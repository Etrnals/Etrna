import Link from 'next/link';
import { ProposalCard } from '../components/ProposalCard';

const proposals = [
  {
    id: '1',
    title: 'Adjust VIBE emission rate',
    status: 'active',
    category: 'treasury',
    description: 'Tune VIBE emissions to support creator quests while aligning ETR burn multipliers.',
  },
  {
    id: '2',
    title: 'Add partner project to EtrnaVerse',
    status: 'draft',
    category: 'verse',
    description: 'Whitelist a new Labs cohort project with governance-weighted multipliers.',
  },
];

export default function ProposalsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Proposals</p>
          <h1 className="text-3xl font-semibold">Governance lifecycle</h1>
        </div>
        <Link className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white" href="/governance/proposals/new">
          New proposal
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {proposals.map((proposal) => (
          <ProposalCard key={proposal.id} {...proposal} href={`/governance/proposals/${proposal.id}`} />
        ))}
      </div>
    </div>
  );
}
