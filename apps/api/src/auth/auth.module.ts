import { Global, Module } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Global()
@Module({
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
