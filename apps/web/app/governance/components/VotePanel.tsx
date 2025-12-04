'use client';

interface VotePanelProps {
  onVote?: (choice: 'for' | 'against' | 'abstain') => void;
  votingPower: number;
}

export function VotePanel({ onVote, votingPower }: VotePanelProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cast your vote</h3>
        <span className="text-xs text-slate-400">Power: {votingPower.toFixed(2)}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-3 text-sm">
        <button
          className="rounded-lg bg-emerald-500/90 px-4 py-2 text-white hover:bg-emerald-400"
          onClick={() => onVote?.('for')}
        >
          For
        </button>
        <button
          className="rounded-lg bg-rose-500/90 px-4 py-2 text-white hover:bg-rose-400"
          onClick={() => onVote?.('against')}
        >
          Against
        </button>
        <button
          className="rounded-lg bg-slate-800 px-4 py-2 text-white hover:bg-slate-700"
          onClick={() => onVote?.('abstain')}
        >
          Abstain
        </button>
      </div>
    </div>
  );
}
