'use client';

import { useState } from 'react';

interface DelegationPanelProps {
  onDelegate?: (delegatee: string, scope: string, weightPct: number) => void;
  delegations?: { scope: string; delegatee: string; weightPct: number }[];
}

export function DelegationPanel({ onDelegate, delegations = [] }: DelegationPanelProps) {
  const [delegatee, setDelegatee] = useState('');
  const [scope, setScope] = useState('global');
  const [weight, setWeight] = useState(50);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Delegation</h3>
        <span className="text-xs text-slate-400">Weighted + scoped</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3 text-sm">
        <input
          className="rounded-lg border border-slate-800 bg-slate-950/50 p-2"
          placeholder="Delegatee address"
          value={delegatee}
          onChange={(e) => setDelegatee(e.target.value)}
        />
        <select
          className="rounded-lg border border-slate-800 bg-slate-950/50 p-2"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="global">Global</option>
          <option value="music">Music</option>
          <option value="vibecheck">VibeCheck</option>
          <option value="uef">UEF Vault</option>
          <option value="verse">Verse Projects</option>
          <option value="treasury">Treasury</option>
        </select>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
          />
          <span className="text-xs text-slate-400">%</span>
        </div>
      </div>
      <button
        className="rounded-lg bg-indigo-500 px-4 py-2 text-white text-sm hover:bg-indigo-400"
        onClick={() => onDelegate?.(delegatee, scope, weight)}
      >
        Save delegation
      </button>

      <div className="rounded-lg border border-slate-800 p-3 text-sm space-y-2">
        {delegations.length === 0 && <p className="text-slate-400">No delegations yet.</p>}
        {delegations.map((delegation) => (
          <div key={`${delegation.scope}-${delegation.delegatee}`} className="flex items-center justify-between">
            <div>
              <p className="font-semibold">{delegation.scope}</p>
              <p className="text-slate-400 text-xs">{delegation.delegatee}</p>
            </div>
            <span className="text-sm font-medium">{delegation.weightPct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
