import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService, OracleRequestRecord } from '../prisma/prisma.service';
import { CreateOracleRequestDto } from './dto/create-oracle-request.dto';
import { OracleWebhookDto } from './dto/oracle-webhook.dto';

@Injectable()
export class OracleService {
  constructor(private readonly prisma: PrismaService) {}

  async requestAI(dto: CreateOracleRequestDto): Promise<OracleRequestRecord> {
    const txHash = this.generateTxHash();
    return this.prisma.createOracleRequest({
      uefId: dto.uefId,
      prompt: dto.prompt,
      requester: dto.requesterAddress,
      txHash,
    });
  }

  async getRequest(chainRequestId: number): Promise<OracleRequestRecord> {
    const record = await this.prisma.findOracleRequest(chainRequestId);
    if (!record) {
      throw new NotFoundException(`Request ${chainRequestId} not found`);
    }
    return record;
  }

  async handleResultWebHook(payload: OracleWebhookDto): Promise<OracleRequestRecord> {
    const updated = await this.prisma.updateOracleRequest(payload.chainRequestId, {
      fulfilled: true,
      resultHash: payload.resultHash,
    });

    if (!updated) {
      throw new NotFoundException(`Request ${payload.chainRequestId} not found`);
    }

    return updated;
  }

  private generateTxHash(): string {
    return `0x${randomBytes(32).toString('hex')}`;
  }
}
