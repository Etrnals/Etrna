import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UefService } from './uef.service';
import { UefController } from './uef.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [UefService],
  controllers: [UefController],
})
export class UefModule {}
