import { Injectable } from '@nestjs/common';
import { PrismaService, DelegationRecord } from '../prisma/prisma.service';

export interface DelegationInput {
  delegator: string;
  delegatee: string;
  scope: string; // global or category-specific
  weightPct: number;
}

@Injectable()
export class DelegationService {
  constructor(private readonly prisma: PrismaService) {}

  async delegate(input: DelegationInput): Promise<DelegationRecord> {
    return this.prisma.upsertDelegation(input);
  }

  async undelegate(delegator: string, scope: string): Promise<void> {
    return this.prisma.removeDelegation(delegator, scope);
  }

  async loadDelegatedWeights(_wallet: string): Promise<number[]> {
    // In a real deployment, this would hydrate from on-chain delegation contracts
    const delegations = await this.prisma.listDelegations(_wallet);
    return delegations.map((entry) => entry.weightPct / 100);
  }
}
