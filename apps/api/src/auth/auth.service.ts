import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const passwordHash = await argon2.hash(dto.password);

    try {
      const user = await this.prisma.user.create({
        data: { email, passwordHash },
        select: { id: true, email: true, createdAt: true },
      });
      return user;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('email already registered');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });

    const valid = user
      ? await argon2.verify(user.passwordHash, dto.password)
      : false;

    if (!user || !valid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const tokens = await this.issueTokens(user);
    return { user: { id: user.id, email: user.email }, ...tokens };
  }

  private async issueTokens(user: { id: string }) {
    const access = await this.jwt.signAsync({ sub: user.id });
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
}
