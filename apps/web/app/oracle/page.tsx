'use client';

import { FormEvent, useState } from 'react';
import { apiRequest, DEFAULT_API_BASE_URL, DEFAULT_API_TOKEN } from '../../lib/api';

interface OracleRequestRecord {
  id: string;
  chainRequestId: number;
  uefId: number;
  prompt: string;
  requester: string;
  txHash: string;
  fulfilled: boolean;
  resultHash?: string;
  createdAt: string;
}

export default function OraclePage() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE_URL);
  const [token, setToken] = useState(DEFAULT_API_TOKEN);
  const [uefId, setUefId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [requester, setRequester] = useState('');
  const [chainRequestId, setChainRequestId] = useState('');
  const [latest, setLatest] = useState<OracleRequestRecord | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const record = await apiRequest<OracleRequestRecord>({ baseUrl: apiBase, token }, '/oracle/requests', {
        method: 'POST',
        json: {
          uefId: Number(uefId),
          prompt,
          requesterAddress: requester,
        },
      });
      setLatest(record);
      setChainRequestId(String(record.chainRequestId));
      setStatus('Request created');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function refresh(e: FormEvent) {
    e.preventDefault();
    if (!chainRequestId) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const record = await apiRequest<OracleRequestRecord>(
        { baseUrl: apiBase, token },
        `/oracle/requests/${chainRequestId}`,
      );
      setLatest(record);
      setStatus('Request fetched');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">AI Oracle</h1>
        <p className="text-sm text-slate-300">Submit AI prompts tied to UEFs and poll their status.</p>
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

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-medium">Create oracle request</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">UEF ID</label>
            <input
              required
              value={uefId}
              onChange={(e) => setUefId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Numeric UEF id"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Requester address</label>
            <input
              required
              value={requester}
              onChange={(e) => setRequester(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="0x..."
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-400">Prompt</label>
          <textarea
            required
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-emerald-500 bg-emerald-600/80 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit request'}
        </button>
      </form>

      <form onSubmit={refresh} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-medium">Fetch request</h2>
        <div className="grid gap-3 sm:grid-cols-2 items-end">
          <div>
            <label className="text-xs text-slate-400">Chain request ID</label>
            <input
              value={chainRequestId}
              onChange={(e) => setChainRequestId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="e.g. 1"
            />
          </div>
          <button
            type="submit"
            disabled={!chainRequestId || loading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </form>

      {(status || error) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
          {status && <p className="text-emerald-400">{status}</p>}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      {latest && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm space-y-2">
          <h3 className="font-medium">Latest request</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <span className="text-slate-400">Chain request ID</span>
            <span>{latest.chainRequestId}</span>
            <span className="text-slate-400">Request ID</span>
            <span className="break-all">{latest.id}</span>
            <span className="text-slate-400">UEF</span>
            <span>{latest.uefId}</span>
            <span className="text-slate-400">Requester</span>
            <span className="break-all">{latest.requester}</span>
            <span className="text-slate-400">TX hash</span>
            <span className="break-all">{latest.txHash}</span>
            <span className="text-slate-400">Fulfilled</span>
            <span>{latest.fulfilled ? 'Yes' : 'No'}</span>
            {latest.resultHash && (
              <>
                <span className="text-slate-400">Result hash</span>
                <span className="break-all">{latest.resultHash}</span>
              </>
            )}
            <span className="text-slate-400">Created</span>
            <span>{new Date(latest.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
