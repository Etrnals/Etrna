import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// Placeholder JWT auth guard; integrate proper authentication in production.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(_context: ExecutionContext): boolean {
    return true;
  }
}
