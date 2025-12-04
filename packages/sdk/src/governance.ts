export interface ProposalDto {
  title: string;
  description: string;
  category: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  onchainId?: number;
}

export interface ReputationSnapshot {
  uniqueHumanScore: number;
  vibeCheckScore: number;
  verseXp: number;
  musicEngagement: number;
  uefContributions: number;
  etrnalsRarity: number;
  etrnaPass: number;
  multiplier: number;
}

export async function getProposals(): Promise<Proposal[]> {
  return [
    {
      id: 'proposal-1',
      title: 'Adjust VIBE emission rate',
      description: 'Tune rewards and align burn schedules with treasury control.',
      category: 'treasury',
      status: 'active',
      onchainId: 1,
    },
  ];
}

export async function getProposal(id: string): Promise<Proposal | undefined> {
  const proposals = await getProposals();
  return proposals.find((p) => p.id === id);
}

export async function createProposal(dto: ProposalDto): Promise<Proposal> {
  return {
    id: 'proposal-draft',
    status: 'draft',
    ...dto,
  };
}

export async function voteProposal(_id: string, _choice: 'for' | 'against' | 'abstain', _zkProof?: unknown): Promise<void> {
  return;
}

export async function delegate(to: string, scope: string, weightPct: number): Promise<void> {
  console.log('delegate', to, scope, weightPct);
}

export async function getVotingPower(_wallet: string): Promise<number> {
  return 2100;
}

export async function getReputation(_wallet: string): Promise<ReputationSnapshot> {
  return {
    uniqueHumanScore: 0.1,
    vibeCheckScore: 0.2,
    verseXp: 0.2,
    musicEngagement: 0.1,
    uefContributions: 0.2,
    etrnalsRarity: 0.2,
    etrnaPass: 0.1,
    multiplier: 2.1,
  };
}
