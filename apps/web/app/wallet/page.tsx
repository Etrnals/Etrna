'use client';

import { FormEvent, useState } from 'react';
import { apiRequest, DEFAULT_API_BASE_URL, DEFAULT_API_TOKEN } from '../../lib/api';

interface SmartAccountRecord {
  userId: string;
  smartAccount: string;
  sessionKey: string;
  createdAt: string;
}

export default function WalletPage() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE_URL);
  const [token, setToken] = useState(DEFAULT_API_TOKEN);
  const [userId, setUserId] = useState('');
  const [account, setAccount] = useState<SmartAccountRecord | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchAccount(e: FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setStatus(null);
    setError(null);
    try {
      const record = await apiRequest<SmartAccountRecord>({ baseUrl: apiBase, token }, `/wallets/${userId}`);
      setAccount(record);
      setStatus('Smart account ready');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">EtrnaWallet</h1>
        <p className="text-sm text-slate-300">Derive and view smart accounts generated through the API.</p>
      </header>

      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">API base URL</label>
            <input
              value={apiBase}
              onChange={(e) => setApiBase(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Bearer token</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="API_TOKEN"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <form onSubmit={fetchAccount} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-medium">Lookup smart account</h2>
        <div className="grid gap-3 sm:grid-cols-2 items-end">
          <div>
            <label className="text-xs text-slate-400">User ID / wallet</label>
            <input
              required
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!userId || loading}
            className="rounded-xl border border-emerald-500 bg-emerald-600/80 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? 'Looking up...' : 'Get smart account'}
          </button>
        </div>
      </form>

      {(status || error) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
          {status && <p className="text-emerald-400">{status}</p>}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      {account && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm space-y-2">
          <h3 className="font-medium">Smart account</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <span className="text-slate-400">User</span>
            <span className="break-all">{account.userId}</span>
            <span className="text-slate-400">Account</span>
            <span className="break-all">{account.smartAccount}</span>
            <span className="text-slate-400">Session key</span>
            <span className="break-all">{account.sessionKey}</span>
            <span className="text-slate-400">Created</span>
            <span>{new Date(account.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
