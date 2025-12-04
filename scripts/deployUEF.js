const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying UEF contracts with", deployer.address);

  const Vault = await hre.ethers.getContractFactory("UEFVaultNFT");
  const vault = await Vault.deploy("UEF Vault", "UEF", "ipfs://uef/", deployer.address, deployer.address, 750);
  await vault.deployed();
  console.log("UEFVaultNFT deployed at", vault.address);

  const Registry = await hre.ethers.getContractFactory("UEFRegistry");
  const registry = await Registry.deploy(vault.address);
  await registry.deployed();
  console.log("UEFRegistry deployed at", registry.address);

  await (await vault.setRegistry(registry.address)).wait();
  console.log("Registry set on vault");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
