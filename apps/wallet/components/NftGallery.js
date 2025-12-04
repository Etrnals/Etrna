const sampleNfts = [
  { name: 'Etrnal #01', collection: 'Etrnals', chain: 'Etrna L1' },
  { name: 'EtrnaPass #77', collection: 'EtrnaPass', chain: 'EVM' },
  { name: 'UEF Document #12', collection: 'UEF', chain: 'Etrna L1' }
];

export default function NftGallery() {
  return (
    <div className="bg-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">NFT Viewer</h2>
        <span className="text-xs text-slate-400">Multi-chain</span>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {sampleNfts.map((nft) => (
          <div key={`${nft.collection}-${nft.name}`} className="bg-slate-900 rounded-lg p-3">
            <p className="text-sm font-semibold">{nft.name}</p>
            <p className="text-xs text-slate-400">{nft.collection}</p>
            <p className="text-xs text-slate-500">{nft.chain}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
