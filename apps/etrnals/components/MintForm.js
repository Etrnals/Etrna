import { useState } from 'react';

const species = [
  'Solari',
  'Nyx',
  'Aether',
  'Mireborn',
  'Flux',
  'Helix',
  'Runebound',
  'Obsidian',
  'Aurora'
];

export default function MintForm() {
  const [speciesId, setSpeciesId] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const price = 0.08;

  return (
    <section className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h2>Mint portal</h2>
          <p style={{ color: '#cdd5f5' }}>
            Bridge-ready ERC721A mint with on-chain traits, open metadata, and blue-chip whitelist proofing. Each mint seeds staking multipliers for $VIBE and $ETR plus identity unlocks for Billions ZK proofs.
          </p>
          <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Species</span>
              <select value={speciesId} onChange={(e) => setSpeciesId(Number(e.target.value))} style={{ padding: 12, borderRadius: 10, border: '1px solid #1f2b4a', background: '#050811', color: '#e8f0ff' }}>
                {species.map((s, i) => (
                  <option key={s} value={i}>{s}</option>
                ))}
              </select>
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span>Quantity</span>
              <input type="number" min={1} max={5} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ padding: 12, borderRadius: 10, border: '1px solid #1f2b4a', background: '#050811', color: '#e8f0ff' }} />
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="btn">Public Mint • {(quantity * price).toFixed(2)} ETH</button>
              <button className="btn" style={{ background: '#11182b', color: '#73f3ff' }}>Blue-chip Allowlist</button>
              <button className="btn" style={{ background: '#11182b', color: '#ff7edb' }}>ZK Identity Mint</button>
            </div>
          </div>
        </div>
        <div className="card" style={{ minWidth: 280, maxWidth: 360 }}>
          <h3>Mint facts</h3>
          <ul style={{ paddingLeft: 18, color: '#cdd5f5' }}>
            <li>ERC721A gas-optimized + OpenSea 7.5% royalty</li>
            <li>Blue-chip holders (BAYC, Punks, Azuki, DeGods, Pudgy, Milady) claim first</li>
            <li>Legendary odds per mint: 2%</li>
            <li>Rarity multipliers stack with staking tiers + species utilities</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
