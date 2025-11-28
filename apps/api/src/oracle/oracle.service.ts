import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EtrnaOracleClient } from '@etrna/oracle';

@Injectable()
export class OracleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly oracleClient: EtrnaOracleClient,
  ) {}

  async requestAI(uefId: number, prompt: string, requesterAddress: string) {
    const { chainRequestId, txHash } = await this.oracleClient.requestAI(uefId, prompt, requesterAddress);

    const record = await this.prisma['oracleRequest']?.create?.({
      data: {
        uefId,
        prompt,
        requester: requesterAddress,
        chainId: chainRequestId,
        txHash,
      },
    });

    return record ?? { uefId, prompt, requester: requesterAddress, chainId: chainRequestId, txHash };
  }

  async handleResultWebHook(payload: { chainRequestId: number; resultHash: string }) {
    const { chainRequestId, resultHash } = payload;
    const req = await this.prisma['oracleRequest']?.findFirst?.({ where: { chainId: chainRequestId } });
    if (!req) return;

    await this.prisma['oracleRequest']?.update?.({
      where: { id: req.id },
      data: { fulfilled: true, resultHash },
    });
  }
}
