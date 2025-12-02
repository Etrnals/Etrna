import { Injectable } from '@nestjs/common';
import { PrismaService, SmartAccountRecord } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getSmartAccount(userId: string): Promise<SmartAccountRecord> {
    return this.prisma.getOrCreateSmartAccount(userId);
  }
}
