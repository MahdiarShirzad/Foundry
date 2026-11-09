import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies?.access_token as string | undefined;

    if (!token) {
      throw new UnauthorizedException('missing token');
    }

    try {
      const payload = await this.jwt.verifyAsync<{
        sub: string;
        email?: string;
      }>(token);
      (
        req as Request & { user?: { id: string; email?: string } }
      ).user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }
}
