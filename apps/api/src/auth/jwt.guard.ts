import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'] ?? '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
    const expected =
      this.configService.get<string>('API_TOKEN') ||
      this.configService.get<string>('JWT_SECRET');

    if (!expected) {
      throw new UnauthorizedException('Authentication token is not configured.');
    }

    if (!token || token !== expected) {
      throw new UnauthorizedException('Invalid or missing bearer token.');
    }

    return true;
  }
}
