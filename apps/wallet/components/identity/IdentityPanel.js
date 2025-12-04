import useIdentity from '../../hooks/useIdentity';

export default function IdentityPanel() {
  const { prove, status } = useIdentity();
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <h2 className="text-xl font-semibold">Identity</h2>
      <p className="text-slate-300 text-sm">Billions-powered ZK attestations for perks and rewards.</p>
      <button onClick={prove} className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-600">Submit Proof</button>
      <p className="text-xs text-slate-400">{status}</p>
    </div>
  );
}
