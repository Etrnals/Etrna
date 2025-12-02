'use client';

import { FormEvent, useState } from 'react';
import { apiRequest, DEFAULT_API_BASE_URL, DEFAULT_API_TOKEN } from '../../lib/api';

interface AgentRecord {
  id: string;
  onchainAddress: string;
  manifestUri: string;
  createdAt: string;
}

export default function AgentsPage() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE_URL);
  const [token, setToken] = useState(DEFAULT_API_TOKEN);
  const [onchainAddress, setOnchainAddress] = useState('');
  const [manifestUri, setManifestUri] = useState('');
  const [agentId, setAgentId] = useState('');
  const [latest, setLatest] = useState<AgentRecord | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function register(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const record = await apiRequest<AgentRecord>({ baseUrl: apiBase, token }, '/agents', {
        method: 'POST',
        json: { onchainAddress, manifestUri },
      });
      setLatest(record);
      setAgentId(record.id);
      setStatus('Agent registered');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function fetchAgent(e: FormEvent) {
    e.preventDefault();
    if (!agentId) return;
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const record = await apiRequest<AgentRecord>({ baseUrl: apiBase, token }, `/agents/${agentId}`);
      setLatest(record);
      setStatus('Agent loaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">AI Agents</h1>
        <p className="text-sm text-slate-300">Register agent manifests and fetch existing agents using the API.</p>
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

      <form onSubmit={register} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-medium">Register agent</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">On-chain address</label>
            <input
              required
              value={onchainAddress}
              onChange={(e) => setOnchainAddress(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Manifest URI</label>
            <input
              required
              value={manifestUri}
              onChange={(e) => setManifestUri(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-emerald-500 bg-emerald-600/80 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Working...' : 'Register'}
        </button>
      </form>

      <form onSubmit={fetchAgent} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="font-medium">Load agent</h2>
        <div className="grid gap-3 sm:grid-cols-2 items-end">
          <div>
            <label className="text-xs text-slate-400">Agent ID</label>
            <input
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="Paste the agent id"
            />
          </div>
          <button
            type="submit"
            disabled={!agentId || loading}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            Fetch agent
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
          <h3 className="font-medium">Most recent agent</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <span className="text-slate-400">ID</span>
            <span className="break-all">{latest.id}</span>
            <span className="text-slate-400">On-chain address</span>
            <span className="break-all">{latest.onchainAddress}</span>
            <span className="text-slate-400">Manifest URI</span>
            <span className="break-all">{latest.manifestUri}</span>
            <span className="text-slate-400">Created</span>
            <span>{new Date(latest.createdAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
