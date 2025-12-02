import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService, AgentRecord } from '../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async registerAgent(dto: CreateAgentDto): Promise<AgentRecord> {
    return this.prisma.createAgent({
      onchainAddress: dto.onchainAddress,
      manifestUri: dto.manifestUri,
    });
  }

  async getAgent(id: string): Promise<AgentRecord> {
    const agent = await this.prisma.findAgent(id);
    if (!agent) {
      throw new NotFoundException(`Agent ${id} not found`);
    }
    return agent;
  }
}
