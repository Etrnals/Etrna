import { DelegationPanel } from '../components/DelegationPanel';
import { ProposalCard } from '../components/ProposalCard';

const scoped = [
  { scope: 'music', delegatee: '0xDe1e...c8', weightPct: 40 },
  { scope: 'treasury', delegatee: '0xA11y...42', weightPct: 25 },
];

const spotlight = [
  {
    id: '3',
    title: 'Route incubator funds',
    status: 'active',
    category: 'treasury',
    description: 'Allocate 150k VIBE to Labs builders aligned with EtrnaVerse missions.',
  },
];

export default function DelegationPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <header>
        <p className="text-xs uppercase tracking-wide text-slate-400">Delegation</p>
        <h1 className="text-3xl font-semibold">Share your voting power</h1>
        <p className="text-sm text-slate-300">Assign delegates by vertical, set weights, and keep custody of your voting units.</p>
      </header>

      <DelegationPanel delegations={scoped} />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Delegate spotlight</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {spotlight.map((proposal) => (
            <ProposalCard key={proposal.id} {...proposal} href={`/governance/proposals/${proposal.id}`} />
          ))}
        </div>
      </section>
    </div>
  );
}
