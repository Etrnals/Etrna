import useUef from '../hooks/useUef';
import UEFUploader from './UEFUploader';
import UEFVault from './UEFVault';

export default function UEFDashboard() {
  const { encrypt, upload, queueMint, refreshJob, jobs, uploading } = useUef();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">UEF Vault</h2>
          <p className="text-slate-300 max-w-2xl">
            Securely encrypt documents, anchor fingerprints on-chain, and mint soulbound or transferable UEF NFTs.
            Rewards route through the EtrnaWallet + RewardsEngine for storage, bridging, and staking boosts.
          </p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-200 border border-emerald-500/30 rounded-lg px-3 py-2 text-sm">
          Connected to RewardsEngine · multipliers auto-applied
        </div>
      </div>
      <UEFUploader
        encrypt={encrypt}
        upload={upload}
        queueMint={queueMint}
        uploading={uploading}
      />
      <UEFVault jobs={jobs} refreshJob={refreshJob} />
    </div>
  );
}
