'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiRequest, DEFAULT_API_BASE_URL, DEFAULT_API_TOKEN } from '../../lib/api';

interface UefRecord {
  id: number;
  owner: string;
  name: string;
  uri: string;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
}

export default function UefPage() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE_URL);
  const [token, setToken] = useState(DEFAULT_API_TOKEN);
  const [owner, setOwner] = useState('');
  const [uri, setUri] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [name, setName] = useState('');
  const [records, setRecords] = useState<UefRecord[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshList().catch(() => null);
  }, []);

  async function refreshList() {
    try {
      const list = await apiRequest<UefRecord[]>({ baseUrl: apiBase, token }, '/uef');
      setRecords(list);
    } catch (err) {
      // silent on initial load when token/base might be missing
    }
  }

  async function register(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const record = await apiRequest<UefRecord>({ baseUrl: apiBase, token }, '/uef', {
        method: 'POST',
        json: { owner, uri, contentHash, name },
      });
      setRecords((prev) => [record, ...prev]);
      setStatus('UEF registered');
      setOwner('');
      setUri('');
      setContentHash('');
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">UEF Registry</h1>
        <p className="text-sm text-slate-300">Register Universal Entitlement Framework entries and view the latest submissions.</p>
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
        <h2 className="font-medium">Register UEF</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-slate-400">Owner</label>
            <input
              required
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="0x..."
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Metadata URI</label>
            <input
              required
              value={uri}
              onChange={(e) => setUri(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="ipfs://..."
            />
          </div>
          <div>
            <label className="text-xs text-slate-400">Content hash</label>
            <input
              required
              value={contentHash}
              onChange={(e) => setContentHash(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              placeholder="0x..."
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-emerald-500 bg-emerald-600/80 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Register'}
        </button>
      </form>

      {(status || error) && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
          {status && <p className="text-emerald-400">{status}</p>}
          {error && <p className="text-red-400">{error}</p>}
        </div>
      )}

      <section className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Recent UEFs</h2>
          <button
            onClick={(e) => {
              e.preventDefault();
              refreshList();
            }}
            className="text-xs rounded-lg border border-slate-700 bg-slate-800 px-3 py-1"
          >
            Refresh
          </button>
        </div>
        {records.length === 0 && <p className="text-sm text-slate-400">No UEFs registered yet.</p>}
        <div className="grid gap-3">
          {records.map((record) => (
            <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{record.name}</div>
                <div className="text-xs text-slate-400">#{record.id}</div>
              </div>
              <div className="grid gap-1 sm:grid-cols-2">
                <span className="text-slate-400">Owner</span>
                <span className="break-all">{record.owner}</span>
                <span className="text-slate-400">URI</span>
                <span className="break-all">{record.uri}</span>
                <span className="text-slate-400">Content hash</span>
                <span className="break-all">{record.contentHash}</span>
                <span className="text-slate-400">Updated</span>
                <span>{new Date(record.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
