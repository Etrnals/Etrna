const hre = require("hardhat");

async function main() {
  const [deployer, openSea] = await hre.ethers.getSigners();
  console.log("Deploying EtrnaPass with:", deployer.address);

  const Pass = await hre.ethers.getContractFactory("EtrnaPass721");
  const pass = await Pass.deploy(
    "EtrnaPass",
    "ETRNP",
    "ipfs://etrnapass/",
    deployer.address,
    750,
    openSea.address,
    5000
  );
  await pass.waitForDeployment();
  console.log("EtrnaPass721:", pass.target);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
