import Link from 'next/link';
import { DelegationPanel } from './components/DelegationPanel';
import { ETRStakingPanel } from './components/ETRStakingPanel';
import { ReputationBreakdown } from './components/ReputationBreakdown';
import { ZKIdentityWidget } from './components/ZKIdentityWidget';

const reputationScores = [
  { label: 'Unique Human', value: 0.1 },
  { label: 'VibeCheck Accuracy', value: 0.2 },
  { label: 'EtrnaVerse XP', value: 0.2 },
  { label: 'Music Engagement', value: 0.1 },
  { label: 'UEF Vault', value: 0.2 },
  { label: 'Etrnals Rarity', value: 0.2 },
  { label: 'EtrnaPass', value: 0.1 },
];

export default function GovernanceLandingPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Etrna Governance Hub</p>
          <h1 className="text-3xl font-semibold">Participate in protocol decisions</h1>
          <p className="text-sm text-slate-300">
            Stake ETR, prove uniqueness with IdentityGuard, and earn multipliers from your cross-ecosystem reputation.
          </p>
        </div>
        <Link className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white" href="/governance/proposals">
          View proposals
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ETRStakingPanel />
          <DelegationPanel delegations={[{ scope: 'global', delegatee: '0xAbc...123', weightPct: 35 }]} />
        </div>
        <div className="space-y-4">
          <ReputationBreakdown scores={reputationScores} multiplier={2.1} />
          <ZKIdentityWidget />
        </div>
      </div>
    </div>
  );
}
