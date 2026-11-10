import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GoneException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { EmailValidatorService } from './email-validator.service';
import { EmailSenderService } from './email-sender.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHRzb21lc2FsdA$8c3n2GdZcV3S1kXqQe6TgK5m0mV2b5k0b8mRzV1vS0M';

const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;

/**
 * A refresh rotates the session, so the browser can briefly hold a token that
 * another request has just burned. Treat a duplicate within this window as
 * concurrency rather than theft; beyond it, reuse revokes every session.
 */
const REFRESH_ROTATION_GRACE_MS = 30 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailValidator: EmailValidatorService,
    private readonly emailSender: EmailSenderService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const hasMx = await this.emailValidator.hasMxRecord(email);
    if (!hasMx) {
      throw new BadRequestException({
        code: 'EMAIL_INVALID',
        message: 'email domain is invalid',
      });
    }

    const passwordHash = await argon2.hash(dto.password);

    let user: { id: string; email: string; createdAt: Date };
    try {
      user = await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createdAt: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException({
          code: 'EMAIL_TAKEN',
          message: 'email already registered',
        });
      }
      throw error;
    }

    await this.createVerificationCode(user.id, user.email);
    return user;
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    const valid = await argon2.verify(
      user?.passwordHash ?? DUMMY_HASH,
      dto.password,
    );

    if (!user || !valid) {
      throw new UnauthorizedException('invalid credentials');
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'email not verified',
      });
    }

    const tokens = await this.issueTokens({ id: user.id, email: user.email });
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  private async issueTokens(user: { id: string; email: string }) {
    const access = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    const refresh = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(refresh).digest('hex');

    await this.prisma.session.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { access, refresh };
  }

  private async createVerificationCode(userId: string, email: string) {
    await this.prisma.emailVerificationCode.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const code = randomInt(0, 1000000).toString().padStart(6, '0');
    const codeHash = createHash('sha256').update(code).digest('hex');

    await this.prisma.emailVerificationCode.create({
      data: {
        userId,
        codeHash,
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
      },
    });

    await this.emailSender.sendVerificationCode(email, code);
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerifiedAt) {
      throw new ForbiddenException({
        code: 'EMAIL_NOT_VERIFIED',
        message: 'email not verified',
      });
    }

    const codeHash = createHash('sha256').update(dto.code).digest('hex');

    const record = await this.prisma.emailVerificationCode.findFirst({
      where: { userId: user.id, codeHash, usedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestException({
        code: 'INVALID_CODE',
        message: 'invalid code',
      });
    }

    if (record.expiresAt.getTime() <= Date.now()) {
      throw new GoneException({
        code: 'CODE_EXPIRED',
        message: 'code expired',
      });
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationCode.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      }),
    ]);

    return { verified: true };
  }

  async resendVerification(dto: ResendVerificationDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || user.emailVerifiedAt) return;

    const last = await this.prisma.emailVerificationCode.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    const COOLDOWN_MS = 30 * 1000;

    if (last) {
      const elapsed = Date.now() - last.createdAt.getTime();
      if (elapsed < COOLDOWN_MS) {
        const retryAfterSeconds = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        throw new HttpException(
          {
            code: 'TOO_MANY_REQUESTS',
            message: `please wait ${retryAfterSeconds} seconds before retrying`,
          },
          429,
        );
      }
    }

    await this.createVerificationCode(user.id, user.email);
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return;
    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');
    await this.prisma.session.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedException('no refresh token');

    const tokenHash = createHash('sha256').update(refreshToken).digest('hex');

    // ← تغییر: include user برای گرفتن email
    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!session) throw new UnauthorizedException('invalid refresh token');

    if (session.revokedAt) {
      // Parallel navigations, prefetches and tabs all refresh from the same
      // burst of expired requests. Minting a session here keeps the loser of
      // that race signed in, instead of revoking every device the user owns.
      const rotatedRecently =
        session.rotatedAt !== null &&
        Date.now() - session.rotatedAt.getTime() <= REFRESH_ROTATION_GRACE_MS;

      if (!rotatedRecently) {
        await this.prisma.session.updateMany({
          where: { userId: session.userId, revokedAt: null },
          data: { revokedAt: new Date() },
        });
        throw new UnauthorizedException('refresh token reuse detected');
      }

      return this.issueTokens({
        id: session.userId,
        email: session.user.email,
      });
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('refresh token expired');
    }

    const result = await this.prisma.session.updateMany({
      where: { id: session.id, revokedAt: null },
      data: { revokedAt: new Date(), rotatedAt: new Date() },
    });

    if (result.count !== 1) {
      throw new UnauthorizedException('refresh token already used');
    }

    // ← تغییر: email رو پاس می‌دیم
    return this.issueTokens({ id: session.userId, email: session.user.email });
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) return;

    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = randomBytes(32).toString('base64url');
    const tokenHash = createHash('sha256').update(token).digest('hex');

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const link = `${process.env.WEB_ORIGIN}/reset-password?token=${token}`;
    await this.emailSender.sendPasswordResetLink(user.email, link);
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt.getTime() <= Date.now()) {
      throw new BadRequestException({
        code: 'INVALID_TOKEN',
        message: 'invalid or expired token',
      });
    }

    const passwordHash = await argon2.hash(dto.password);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.session.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);
  }
}
