import useBridge from '../../hooks/useBridge';

export default function BridgePanel() {
  const { bridge, status } = useBridge();
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <h2 className="text-xl font-semibold">Bridge</h2>
      <p className="text-slate-300 text-sm">Move assets between chains through EtrnaUniversalBridge.</p>
      <button onClick={bridge} className="px-3 py-2 rounded bg-indigo-500 hover:bg-indigo-600">Simulate Bridge</button>
      <p className="text-xs text-slate-400">{status}</p>
    </div>
  );
}
