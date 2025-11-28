import { Module } from '@nestjs/common';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AgentController],
  providers: [AgentService, JwtAuthGuard],
})
export class AgentModule {}
