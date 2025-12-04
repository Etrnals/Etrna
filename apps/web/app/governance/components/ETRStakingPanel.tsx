'use client';

import { useState } from 'react';

export function ETRStakingPanel() {
  const [staked, setStaked] = useState(1200);
  const [input, setInput] = useState('');

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">ETR Staking</h3>
        <span className="text-xs text-slate-400">{staked} ETR staked</span>
      </div>
      <div className="flex gap-2 text-sm">
        <input
          className="w-full rounded-lg border border-slate-800 bg-slate-950/50 p-2"
          placeholder="Amount"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-400"
          onClick={() => {
            const amount = Number(input);
            if (!isNaN(amount)) setStaked((prev) => prev + amount);
            setInput('');
          }}
        >
          Stake
        </button>
      </div>
      <p className="text-xs text-slate-400">Staked ETR mints non-transferable voting units with ecosystem multipliers.</p>
    </div>
  );
}
