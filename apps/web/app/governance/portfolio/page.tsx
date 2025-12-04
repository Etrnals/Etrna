import { ReputationBreakdown } from '../components/ReputationBreakdown';
import { ZKIdentityWidget } from '../components/ZKIdentityWidget';

const scores = [
  { label: 'VibeCheck Accuracy', value: 0.18 },
  { label: 'Verse Missions', value: 0.16 },
  { label: 'UEF Contributions', value: 0.2 },
  { label: 'EtrnaPass', value: 0.1 },
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header>
        <p className="text-xs uppercase tracking-wide text-slate-400">Governance portfolio</p>
        <h1 className="text-3xl font-semibold">Your voting power</h1>
        <p className="text-sm text-slate-300">Monitor staking, delegations, ZK identity, and reputation-based multipliers.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <ReputationBreakdown scores={scores} multiplier={1.64} />
        <ZKIdentityWidget />
      </div>
    </div>
  );
}
