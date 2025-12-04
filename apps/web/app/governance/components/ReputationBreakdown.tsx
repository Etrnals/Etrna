interface ReputationBreakdownProps {
  scores: { label: string; value: number }[];
  multiplier: number;
}

export function ReputationBreakdown({ scores, multiplier }: ReputationBreakdownProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reputation</h3>
        <span className="text-xs text-slate-400">x{multiplier.toFixed(2)} weight</span>
      </div>
      <div className="space-y-2 text-sm">
        {scores.map((score) => (
          <div key={score.label} className="flex items-center justify-between">
            <span className="text-slate-300">{score.label}</span>
            <span className="font-semibold">+{Math.round(score.value * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
