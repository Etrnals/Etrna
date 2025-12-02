import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OracleService } from './oracle.service';

@Module({
  imports: [PrismaModule],
  providers: [OracleService],
  exports: [OracleService],
})
export class OracleModule {}
