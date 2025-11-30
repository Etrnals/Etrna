const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying with ${deployer.address}`);

  const config = {
    name: "Etrnals",
    symbol: "ETRNL",
    maxSupply: 7777,
    maxPerWallet: 3,
    mintPrice: ethers.parseEther("0.08"),
    baseURI: "https://metadata.etrna.io/etrnals/",
    treasury: deployer.address
  };

  const factory = await ethers.getContractFactory("Etrnals");
  const contract = await factory.deploy(
    config.name,
    config.symbol,
    config.maxSupply,
    config.maxPerWallet,
    config.mintPrice,
    config.baseURI,
    config.treasury
  );

  await contract.waitForDeployment();
  console.log(`Etrnals deployed at ${await contract.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
