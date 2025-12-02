import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OracleService } from './oracle.service';
import { OracleController } from './oracle.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OracleController],
  providers: [OracleService],
  exports: [OracleService],
})
export class OracleModule {}
