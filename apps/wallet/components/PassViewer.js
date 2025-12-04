import { usePassEntitlements } from '../hooks/usePass';

export default function PassViewer() {
  const { data } = usePassEntitlements();

  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">EtrnaPass (OpenSea Exclusive)</h2>
          <p className="text-sm text-slate-300">Mint and hold the pass on OpenSea to unlock Etrnals access, wallet perks, and VibeCheck boosts.</p>
        </div>
        <a
          href="https://opensea.io/collection/etrnapass"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-400 text-black font-semibold"
        >
          View on OpenSea
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <Badge label="Passes Held" value={data.balance} />
        <Badge label="Wallet Tier" value={data.walletTier} />
        <Badge label="Wallet Multiplier" value={`${(data.walletMultiplier * 100).toFixed(0)}%`} />
        <Badge label="VibeCheck Boost" value={`${(data.vibeCheckBoost * 100).toFixed(0)}%`} />
      </div>
      <div className="bg-slate-900 rounded-lg p-3">
        <h3 className="text-sm font-semibold mb-2">Perks</h3>
        <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
          {data.perks?.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <div className="bg-slate-900 rounded-lg p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
