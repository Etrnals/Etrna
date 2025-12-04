import Hero from '../components/Hero';
import MintForm from '../components/MintForm';
import SpeciesGrid from '../components/SpeciesGrid';
import RewardsPanel from '../components/RewardsPanel';

export default function Home() {
  return (
    <main className="container">
      <Hero />
      <MintForm />
      <SpeciesGrid />
      <RewardsPanel />
      <section className="card">
        <h3>OpenSea-ready</h3>
        <p style={{ color: '#cdd5f5' }}>
          Metadata follows the OpenSea standard with royalty info baked into the contract (ERC2981). Traits include species, element, origin, and legendary status for rarity reveal. Staking hooks live inside <code>packages/etrnals-sdk</code> with helper functions for mint, blue-chip allowlist mints, and reward reads.
        </p>
      </section>
    </main>
  );
}
