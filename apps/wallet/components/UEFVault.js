export default function UEFVault({ jobs, refreshJob }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Vault Activity</h3>
        <button
          className="text-sm text-emerald-300"
          onClick={() => jobs.forEach((job) => refreshJob(job.id))}
        >
          Refresh all
        </button>
      </div>
      <div className="space-y-2">
        {jobs.length === 0 && <p className="text-sm text-slate-300">No vault jobs yet.</p>}
        {jobs.map((job) => (
          <div key={job.id} className="border border-slate-700 rounded-lg p-3 bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Fingerprint</p>
                <p className="font-mono text-xs text-emerald-200 break-all">{job.fingerprint}</p>
              </div>
              <span className="text-xs bg-emerald-600/30 text-emerald-200 px-2 py-1 rounded-full">
                {job.status}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-2 flex gap-4 flex-wrap">
              <span>Storage: {job.storageProvider}</span>
              <span>URI: {job.storageURI}</span>
              <span>Transferable: {job.transferable ? 'yes' : 'soulbound'}</span>
              {job.tokenId && <span>Token ID: #{job.tokenId}</span>}
            </div>
            {job.rewards && (
              <div className="text-xs text-amber-200 mt-2">
                Rewards ready — VIBE +{job.rewards.vibe}, ETR +{job.rewards.etr}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
