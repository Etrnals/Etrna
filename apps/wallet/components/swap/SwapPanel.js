import useSwap from '../../hooks/useSwap';

export default function SwapPanel() {
  const { swap, status } = useSwap();
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <h2 className="text-xl font-semibold">Swap</h2>
      <p className="text-slate-300 text-sm">Route tokens through EtrnaSwapRouter with multi-chain awareness.</p>
      <button onClick={swap} className="px-3 py-2 rounded bg-emerald-500 hover:bg-emerald-600">Simulate Swap</button>
      <p className="text-xs text-slate-400">{status}</p>
    </div>
  );
}
