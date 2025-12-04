interface SimulationProps {
  projectedFor: number;
  projectedAgainst: number;
  quorum: number;
}

export function GovernanceSimulationView({ projectedFor, projectedAgainst, quorum }: SimulationProps) {
  const total = projectedFor + projectedAgainst;
  const quorumPct = Math.min(100, Math.round((total / quorum) * 100));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <h3 className="text-lg font-semibold">Simulation</h3>
      <div className="text-sm text-slate-300 space-y-1">
        <p>Projected For: {projectedFor.toFixed(2)} VP</p>
        <p>Projected Against: {projectedAgainst.toFixed(2)} VP</p>
        <p>Quorum: {quorum.toLocaleString()} VP</p>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div className="h-full bg-blue-500" style={{ width: `${quorumPct}%` }} />
      </div>
      <p className="text-xs text-slate-400">Quorum reached at {quorumPct}% of required threshold.</p>
    </div>
  );
}
