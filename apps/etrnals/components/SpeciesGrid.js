const species = [
  { name: 'Solari', utility: 'Solar rails, bridge gas rebates', color: '#ffcf33' },
  { name: 'Nyx', utility: 'Darknet swaps, privacy ZK perks', color: '#a88cff' },
  { name: 'Aether', utility: 'Cross-chain latency cuts, billable oracles', color: '#9be7ff' },
  { name: 'Mireborn', utility: 'On-chain labs, toxin crafting boosts', color: '#67f6c8' },
  { name: 'Flux', utility: 'Liquid staking synergy, rebalancing bonuses', color: '#ff8ab3' },
  { name: 'Helix', utility: 'DNA recombinators, trait synthesis', color: '#9affc1' },
  { name: 'Runebound', utility: 'Rune crafting, interop spells', color: '#ffc0ff' },
  { name: 'Obsidian', utility: 'Security guardians, slashing protection', color: '#8de2ff' },
  { name: 'Aurora', utility: 'UI/UX airdrops, creator lanes', color: '#ffd29c' }
];

export default function SpeciesGrid() {
  return (
    <section className="card" style={{ marginBottom: 24 }}>
      <h2>Species utilities</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {species.map((s) => (
          <div key={s.name} className="card" style={{ borderColor: s.color, background: 'rgba(255,255,255,0.02)' }}>
            <div className="tag" style={{ color: s.color }}>{s.name}</div>
            <p style={{ color: '#cdd5f5' }}>{s.utility}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
