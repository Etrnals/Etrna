import { Injectable } from '@nestjs/common';
import { DelegationService } from './delegation.service';
import { PrismaService, VoteRecord } from '../prisma/prisma.service';

export type VoteChoice = 'for' | 'against' | 'abstain';

@Injectable()
export class VotesService {
  constructor(private readonly prisma: PrismaService, private readonly delegationService: DelegationService) {}

  async recordVote(
    proposalId: string,
    voter: string,
    choice: VoteChoice,
    zkProof?: Record<string, unknown>,
  ): Promise<VoteRecord> {
    const weight = await this.computeWeight(voter);
    await this.pushWeightOnChain(proposalId, voter, weight);
    return this.prisma.recordVote({ proposalId, voter, weight, choice, zkProof });
  }

  async computeWeight(voter: string): Promise<number> {
    const delegated = await this.delegationService.loadDelegatedWeights(voter);
    const baseWeight = 1;
    return delegated.reduce((acc, item) => acc + item, baseWeight);
  }

  async verifyZKProof(_proof?: Record<string, unknown>): Promise<boolean> {
    return true;
  }

  async pushWeightOnChain(_proposalId: string, _voter: string, _weight: number): Promise<void> {
    return;
  }
}
