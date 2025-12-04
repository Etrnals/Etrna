const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const speciesData = new Array(9).fill(0).map((_, i) => ({
    name: `Species ${i}`,
    maxSupply: 1111,
    baseURI: `ipfs://etrnals/species-${i}/`,
    utility: "See MARKETING.md for lore"
  }));
  const multiplierData = new Array(9).fill(0).map(() => ({
    vibeMultiplier: 11000,
    etrMultiplier: 10500,
    legendaryBonus: 1500
  }));

  const Registry = await hre.ethers.getContractFactory("SpeciesRegistry");
  const registry = await Registry.deploy(9, speciesData, multiplierData);
  await registry.waitForDeployment();
  console.log("SpeciesRegistry:", registry.target);

  const Etrnals = await hre.ethers.getContractFactory("Etrnals721A");
  const etrnals = await Etrnals.deploy("Etrnals", "ETRNL", hre.ethers.parseEther("0.08"), deployer.address, 750, registry.target);
  await etrnals.waitForDeployment();
  await registry.setMinter(etrnals.target, true);
  console.log("Etrnals721A:", etrnals.target);

  const Staking = await hre.ethers.getContractFactory("EtrnalsStaking");
  const staking = await Staking.deploy(etrnals.target, registry.target);
  await staking.waitForDeployment();
  console.log("EtrnalsStaking:", staking.target);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
