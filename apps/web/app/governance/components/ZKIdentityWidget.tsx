'use client';

import { useState } from 'react';

export function ZKIdentityWidget() {
  const [verified, setVerified] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">IdentityGuard</h3>
        <span className={`text-xs ${verified ? 'text-emerald-400' : 'text-slate-400'}`}>
          {verified ? 'Unique human verified' : 'Not verified'}
        </span>
      </div>
      <p className="text-sm text-slate-300">Zero-knowledge proof of uniqueness boosts voting power by 10%.</p>
      <button
        className="rounded-lg bg-purple-500 px-4 py-2 text-white text-sm hover:bg-purple-400"
        onClick={() => setVerified(true)}
      >
        Generate ZK proof
      </button>
    </div>
  );
}
