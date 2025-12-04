const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with", deployer.address);

  const Bridge = await ethers.getContractFactory("EtrnaUniversalBridge");
  const bridge = await Bridge.deploy(deployer.address);
  await bridge.waitForDeployment();

  const Router = await ethers.getContractFactory("EtrnaSwapRouter");
  const router = await Router.deploy(deployer.address);
  await router.waitForDeployment();

  const Tracker = await ethers.getContractFactory("WalletActivityTracker");
  const tracker = await Tracker.deploy(deployer.address);
  await tracker.waitForDeployment();

  console.log("Bridge:", await bridge.getAddress());
  console.log("Router:", await router.getAddress());
  console.log("Tracker:", await tracker.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
