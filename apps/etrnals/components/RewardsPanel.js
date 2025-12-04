const tiers = [
  { label: 'Common', vibe: '1.0x', etr: '1.0x' },
  { label: 'Rare', vibe: '1.15x', etr: '1.10x' },
  { label: 'Epic', vibe: '1.25x', etr: '1.20x' },
  { label: 'Legendary', vibe: '1.50x', etr: '1.40x' }
];

export default function RewardsPanel() {
  return (
    <section className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h2>Staking rewards</h2>
          <p style={{ color: '#cdd5f5' }}>
            Stake Etrnals to amplify $VIBE and $ETR emissions. Multipliers stack from species base rates + rarity tiers. Bridge and swap streaks from the EtrnaWallet increase pending rewards in real time.
          </p>
        </div>
        <div className="card" style={{ minWidth: 280, maxWidth: 360 }}>
          <h3>Tier multipliers</h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {tiers.map((tier) => (
              <div key={tier.label} className="card" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="tag">{tier.label}</div>
                <p style={{ margin: '6px 0', color: '#cdd5f5' }}>$VIBE {tier.vibe}</p>
                <p style={{ margin: 0, color: '#cdd5f5' }}>$ETR {tier.etr}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
