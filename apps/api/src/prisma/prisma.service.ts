import { Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';

export interface AgentRecord {
  id: string;
  onchainAddress: string;
  manifestUri: string;
  createdAt: Date;
}

export interface TrackRecord {
  id: number;
  title: string;
  uri: string;
  mintOnChain: boolean;
  createdAt: Date;
}

export interface OracleRequestRecord {
  id: string;
  chainRequestId: number;
  uefId: number;
  prompt: string;
  requester: string;
  txHash: string;
  fulfilled: boolean;
  resultHash?: string;
  createdAt: Date;
}

export interface SmartAccountRecord {
  userId: string;
  smartAccount: string;
  sessionKey: string;
  createdAt: Date;
}

export interface UefRecord {
  id: number;
  owner: string;
  name: string;
  uri: string;
  contentHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  proposer: string;
  onchainId?: number;
  status: string;
  eta?: Date;
  createdAt: Date;
}

export interface VoteRecord {
  id: string;
  proposalId: string;
  voter: string;
  weight: number;
  choice: string;
  zkProof?: Record<string, unknown>;
  createdAt: Date;
}

export interface DelegationRecord {
  id: string;
  delegator: string;
  delegatee: string;
  scope: string;
  weightPct: number;
  createdAt: Date;
}

@Injectable()
export class PrismaService {
  private agents = new Map<string, AgentRecord>();
  private tracks = new Map<number, TrackRecord>();
  private oracleRequests = new Map<number, OracleRequestRecord>();
  private smartAccounts = new Map<string, SmartAccountRecord>();
  private uefs = new Map<number, UefRecord>();
  private proposals = new Map<string, ProposalRecord>();
  private votes = new Map<string, VoteRecord[]>();
  private delegations = new Map<string, DelegationRecord[]>();
  private oracleCounter = 1;
  private trackCounter = 1;
  private uefCounter = 1;
  private proposalCounter = 1;

  async createAgent(data: Pick<AgentRecord, 'onchainAddress' | 'manifestUri'>): Promise<AgentRecord> {
    const record: AgentRecord = {
      id: randomUUID(),
      onchainAddress: data.onchainAddress,
      manifestUri: data.manifestUri,
      createdAt: new Date(),
    };
    this.agents.set(record.id, record);
    return record;
  }

  async findAgent(id: string): Promise<AgentRecord | null> {
    return this.agents.get(id) ?? null;
  }

  async createTrack(data: Pick<TrackRecord, 'title' | 'uri' | 'mintOnChain'>): Promise<TrackRecord> {
    const record: TrackRecord = {
      id: this.trackCounter++,
      ...data,
      createdAt: new Date(),
    };
    this.tracks.set(record.id, record);
    return record;
  }

  async listTracks(): Promise<TrackRecord[]> {
    return Array.from(this.tracks.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createOracleRequest(
    data: Pick<OracleRequestRecord, 'uefId' | 'prompt' | 'requester' | 'txHash'>,
  ): Promise<OracleRequestRecord> {
    const record: OracleRequestRecord = {
      id: randomUUID(),
      chainRequestId: this.oracleCounter++,
      fulfilled: false,
      resultHash: undefined,
      createdAt: new Date(),
      ...data,
    };
    this.oracleRequests.set(record.chainRequestId, record);
    return record;
  }

  async findOracleRequest(chainRequestId: number): Promise<OracleRequestRecord | null> {
    return this.oracleRequests.get(chainRequestId) ?? null;
  }

  async updateOracleRequest(
    chainRequestId: number,
    update: Pick<OracleRequestRecord, 'fulfilled' | 'resultHash'>,
  ): Promise<OracleRequestRecord | null> {
    const existing = this.oracleRequests.get(chainRequestId);
    if (!existing) return null;

    const next: OracleRequestRecord = { ...existing, ...update };
    this.oracleRequests.set(chainRequestId, next);
    return next;
  }

  async getOrCreateSmartAccount(userId: string): Promise<SmartAccountRecord> {
    const existing = this.smartAccounts.get(userId);
    if (existing) return existing;

    const created: SmartAccountRecord = {
      userId,
      smartAccount: this.generateHexAddress(20),
      sessionKey: this.generateHexAddress(32),
      createdAt: new Date(),
    };
    this.smartAccounts.set(userId, created);
    return created;
  }

  async registerUef(data: Pick<UefRecord, 'owner' | 'uri' | 'contentHash' | 'name'>): Promise<UefRecord> {
    const record: UefRecord = {
      id: this.uefCounter++,
      name: data.name,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    this.uefs.set(record.id, record);
    return record;
  }

  async updateUef(
    id: number,
    update: Partial<Pick<UefRecord, 'uri' | 'contentHash' | 'name'>>,
  ): Promise<UefRecord | null> {
    const existing = this.uefs.get(id);
    if (!existing) return null;

    const filteredUpdates = Object.fromEntries(
      Object.entries(update).filter(([, value]) => value !== undefined),
    ) as Partial<UefRecord>;

    const next: UefRecord = { ...existing, ...filteredUpdates, updatedAt: new Date() };
    this.uefs.set(id, next);
    return next;
  }

  async listUefs(): Promise<UefRecord[]> {
    return Array.from(this.uefs.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findUef(id: number): Promise<UefRecord | null> {
    return this.uefs.get(id) ?? null;
  }

  async createProposal(
    data: Pick<ProposalRecord, 'title' | 'description' | 'category' | 'proposer'> & {
      onchainId?: number;
      eta?: Date;
    },
  ): Promise<ProposalRecord> {
    const record: ProposalRecord = {
      id: `proposal-${this.proposalCounter++}`,
      status: 'draft',
      createdAt: new Date(),
      ...data,
    };

    this.proposals.set(record.id, record);
    return record;
  }

  async updateProposal(
    id: string,
    update: Partial<Pick<ProposalRecord, 'status' | 'eta' | 'onchainId'>>, 
  ): Promise<ProposalRecord | null> {
    const existing = this.proposals.get(id);
    if (!existing) return null;

    const next: ProposalRecord = { ...existing, ...update };
    this.proposals.set(id, next);
    return next;
  }

  async listProposals(): Promise<ProposalRecord[]> {
    return Array.from(this.proposals.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findProposal(id: string): Promise<ProposalRecord | null> {
    return this.proposals.get(id) ?? null;
  }

  async recordVote(data: Omit<VoteRecord, 'id' | 'createdAt'>): Promise<VoteRecord> {
    const record: VoteRecord = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
    };

    const existing = this.votes.get(data.proposalId) ?? [];
    existing.push(record);
    this.votes.set(data.proposalId, existing);
    return record;
  }

  async listVotes(proposalId: string): Promise<VoteRecord[]> {
    return this.votes.get(proposalId) ?? [];
  }

  async upsertDelegation(data: Omit<DelegationRecord, 'id' | 'createdAt'>): Promise<DelegationRecord> {
    const existing = (this.delegations.get(data.delegator) ?? []).filter(
      (entry) => !(entry.delegatee === data.delegatee && entry.scope === data.scope),
    );

    const record: DelegationRecord = {
      id: randomUUID(),
      createdAt: new Date(),
      ...data,
    };

    existing.push(record);
    this.delegations.set(data.delegator, existing);
    return record;
  }

  async removeDelegation(delegator: string, scope: string): Promise<void> {
    const entries = this.delegations.get(delegator) ?? [];
    this.delegations.set(
      delegator,
      entries.filter((entry) => entry.scope !== scope),
    );
  }

  async listDelegations(delegator: string): Promise<DelegationRecord[]> {
    return this.delegations.get(delegator) ?? [];
  }

  private generateHexAddress(bytes: number) {
    return `0x${randomBytes(bytes).toString('hex')}`;
  }
}
