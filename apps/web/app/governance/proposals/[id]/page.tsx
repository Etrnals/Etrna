import { GovernanceSimulationView } from '../../components/GovernanceSimulationView';
import { VotePanel } from '../../components/VotePanel';

const mockProposal = {
  title: 'Adjust VIBE emission rate',
  status: 'active',
  description:
    'Align VIBE streaming rewards with UEF Vault contributions and EtrnaVerse mission completions while preserving ETR burn.',
  onchainId: 12,
  quorum: 100000,
};

export default function ProposalDetailPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-slate-400">Proposal #{mockProposal.onchainId}</p>
        <h1 className="text-3xl font-semibold">{mockProposal.title}</h1>
        <p className="text-sm text-slate-300">{mockProposal.description}</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <VotePanel votingPower={2100} />
        <GovernanceSimulationView projectedFor={64000} projectedAgainst={12000} quorum={mockProposal.quorum} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-300 space-y-2">
        <p>Chain state: Active • Quorum target {mockProposal.quorum.toLocaleString()} VP.</p>
        <p>Lifecycle: Draft → Active → Succeeded/Defeated → Queued → Executed.</p>
        <p>Unique humans gain an additional 10% multiplier on votes.</p>
      </div>
    </div>
  );
}
