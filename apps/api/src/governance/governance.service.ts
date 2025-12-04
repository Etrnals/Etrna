import { Injectable } from '@nestjs/common';
import { PrismaService, ProposalRecord, VoteRecord } from '../prisma/prisma.service';
import { VotesService } from './votes.service';

export interface ProposalInput {
  title: string;
  description: string;
  category: string;
  proposer: string;
  onchainId?: number;
  eta?: Date;
}

@Injectable()
export class GovernanceService {
  constructor(private readonly prisma: PrismaService, private readonly votesService: VotesService) {}

  async createProposal(input: ProposalInput): Promise<ProposalRecord> {
    return this.prisma.createProposal(input);
  }

  async activateProposal(id: string, onchainId?: number): Promise<ProposalRecord | null> {
    return this.prisma.updateProposal(id, { status: 'active', onchainId });
  }

  async queueProposal(id: string, eta: Date): Promise<ProposalRecord | null> {
    return this.prisma.updateProposal(id, { status: 'queued', eta });
  }

  async executeProposal(id: string): Promise<ProposalRecord | null> {
    return this.prisma.updateProposal(id, { status: 'executed' });
  }

  async getProposalSnapshot(id: string): Promise<{ proposal: ProposalRecord | null; votes: VoteRecord[] }> {
    const proposal = await this.prisma.findProposal(id);
    const votes = await this.prisma.listVotes(id);
    return { proposal, votes };
  }

  async listProposals(): Promise<ProposalRecord[]> {
    return this.prisma.listProposals();
  }
}
