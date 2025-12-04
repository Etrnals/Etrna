export default function Hero() {
  return (
    <section className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 640 }}>
          <div className="tag">Etrnals Genesis • 9,999</div>
          <h1 style={{ margin: '12px 0 8px', fontSize: 42 }}>Etrnals: 9 species engineered for the VIBE × ETR continuum</h1>
          <p style={{ color: '#cdd5f5', lineHeight: 1.6 }}>
            Mint the DNA that powers the Etrna ecosystem. Every species carries unique bridge boosts, swap perks, identity traits, and staking multipliers that amplify $VIBE and $ETR emissions across chains.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn">Connect & Mint</button>
            <span className="tag">OpenSea-ready metadata + 7.5% royalties</span>
          </div>
        </div>
        <div className="card" style={{ minWidth: 240, maxWidth: 320, textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#9acbff', letterSpacing: 2 }}>LIVE NOW</p>
          <h2 style={{ margin: '6px 0 16px' }}>Mint price 0.08 ETH</h2>
          <div style={{ fontSize: 32, fontWeight: 700 }}>9,999 / 9 species</div>
          <p style={{ marginTop: 8, color: '#cdd5f5' }}>Blue-chip allowlist: BAYC, Punks, Azuki, DeGods, Pudgy, Milady.</p>
        </div>
      </div>
    </section>
  );
}
