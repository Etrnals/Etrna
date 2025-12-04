const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'etrnals-output');

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

const legendaryChance = 0.02;

function randomTrait(seed, mod) {
  return (seed % mod) + 1;
}

function buildMetadata(id) {
  const speciesId = id % species.length;
  const isLegendary = Math.random() < legendaryChance;
  const attributes = [
    { trait_type: 'Species', value: species[speciesId] },
    { trait_type: 'Element', value: ['Fire', 'Shadow', 'Air', 'Earth', 'Water'][randomTrait(id, 5) - 1] },
    { trait_type: 'Origin', value: ['Prime', 'Vault', 'Frontier', 'Citadel'][randomTrait(id * 3, 4) - 1] },
    { trait_type: 'Legendary', value: isLegendary ? 'True' : 'False' }
  ];

  return {
    name: `Etrnal #${id}`,
    description: 'Etrnals are the apex DNA across the Etrna continuum. Each species unlocks utilities, bridge boosts, and staking multipliers for VIBE and ETR.',
    image: `ipfs://QmPlaceholder/${id}.png`,
    external_url: `https://etrna.xyz/etrnals/${id}`,
    attributes,
  };
}

function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let i = 1; i <= 20; i++) {
    const metadata = buildMetadata(i);
    fs.writeFileSync(path.join(outputDir, `${i}.json`), JSON.stringify(metadata, null, 2));
  }

  console.log(`Generated sample metadata to ${outputDir}`);
}

if (require.main === module) {
  main();
}
