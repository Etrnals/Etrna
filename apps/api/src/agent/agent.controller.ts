import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { AgentService } from './agent.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateAgentDto } from './dto/create-agent.dto';

@Controller('agents')
@UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  async create(@Body() dto: CreateAgentDto) {
    return this.agentService.registerAgent(dto);
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.agentService.getAgent(id);
  }
}
