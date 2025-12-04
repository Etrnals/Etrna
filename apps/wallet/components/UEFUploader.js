import { useState } from 'react';

export default function UEFUploader({ encrypt, upload, queueMint, uploading }) {
  const [content, setContent] = useState('');
  const [provider, setProvider] = useState('ipfs');
  const [transferable, setTransferable] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Encrypting document...');
    const encrypted = await encrypt(content);
    setStatus('Uploading encrypted payload...');
    const stored = await upload({ content: encrypted.ciphertext, provider, name: 'uef-doc' });
    setStatus('Queuing mint...');
    await queueMint({
      fingerprint: encrypted.fingerprint,
      storageURI: stored.uri,
      storageProvider: stored.provider,
      transferable,
      owner: 'demo-user',
    });
    setStatus('Queued and minted for rewards.');
    setContent('');
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Upload to UEF Vault</h3>
        <span className="text-xs text-emerald-300">Encrypted + on-chain fingerprint</span>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <textarea
          className="w-full rounded-lg bg-slate-900 border border-slate-700 p-3"
          rows={3}
          placeholder="Paste document contents to encrypt"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm text-slate-300">
            Storage
            <select
              className="ml-2 bg-slate-900 border border-slate-700 rounded px-2 py-1"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="ipfs">IPFS</option>
              <option value="s3">S3</option>
            </select>
          </label>
          <label className="text-sm text-slate-300 flex items-center gap-2">
            <input
              type="checkbox"
              checked={transferable}
              onChange={(e) => setTransferable(e.target.checked)}
            />
            Mint transferable UEF NFT
          </label>
        </div>
        <button
          type="submit"
          className="bg-emerald-500 text-slate-900 font-semibold px-4 py-2 rounded"
          disabled={uploading}
        >
          {uploading ? 'Processing...' : 'Encrypt & Mint'}
        </button>
      </form>
      {status && <p className="text-sm text-slate-200">{status}</p>}
    </div>
  );
}
