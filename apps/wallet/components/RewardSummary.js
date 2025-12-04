import useSWR from 'swr';
import fetcher from '../lib/fetcher';

export default function RewardSummary() {
  const { data } = useSWR('/api/rewards', fetcher, { fallbackData: { bridge: 0, swap: 0, nft: 0, identity: 0, points: 0 } });
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h2 className="text-xl font-semibold">Rewards Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3 text-sm">
        <Metric label="Bridges" value={data.bridge} />
        <Metric label="Swaps" value={data.swap} />
        <Metric label="NFT Views" value={data.nft} />
        <Metric label="Proofs" value={data.identity} />
        <Metric label="Points" value={data.points} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="bg-slate-900 rounded-lg p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
