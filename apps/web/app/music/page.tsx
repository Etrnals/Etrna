'use client';

import { FormEvent, useState } from 'react';
import { useAccount } from 'wagmi';
import { useMusicUpload } from '@etrna/sdk';

export default function MusicPage() {
  const { address } = useAccount();
  const [title, setTitle] = useState('');
  const [uri, setUri] = useState('');
  const [mint, setMint] = useState(true);
  const [loading, setLoading] = useState(false);
  const musicUpload = useMusicUpload();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!address || !musicUpload.ready) return;

    setLoading(true);
    try {
      await musicUpload.mintAndUpload({ title, uri, mintOnChain: mint });
      setTitle('');
      setUri('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold mb-4">Upload a track</h1>
      {!address && <p className="text-sm text-red-400">Connect your wallet to continue.</p>}
      {!musicUpload.ready && (
        <p className="text-sm text-amber-400">Connect your wallet and set NEXT_PUBLIC_DISTRIBUTOR_ADDRESS.</p>
      )}
      <form onSubmit={onSubmit} className="space-y-4 mt-4">
        <div>
          <label className="text-xs text-slate-400">Title</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs text-slate-400">Metadata URI (IPFS / Arweave)</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
            value={uri}
            onChange={(e) => setUri(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="mint"
            type="checkbox"
            checked={mint}
            onChange={(e) => setMint(e.target.checked)}
          />
          <label htmlFor="mint" className="text-xs text-slate-300">
            Mint on Etrna chain as NFT
          </label>
        </div>
        <button
          disabled={!address || loading || !musicUpload.ready}
          className="rounded-xl border border-emerald-500 bg-emerald-600/80 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
