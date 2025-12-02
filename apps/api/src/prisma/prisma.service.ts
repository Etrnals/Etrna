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

@Injectable()
export class PrismaService {
  private agents = new Map<string, AgentRecord>();
  private tracks = new Map<number, TrackRecord>();
  private oracleRequests = new Map<number, OracleRequestRecord>();
  private smartAccounts = new Map<string, SmartAccountRecord>();
  private oracleCounter = 1;
  private trackCounter = 1;

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

  private generateHexAddress(bytes: number) {
    return `0x${randomBytes(bytes).toString('hex')}`;
  }
}
