const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wallet modules", function () {
  it("deploys bridge, router, tracker", async function () {
    const [owner] = await ethers.getSigners();
    const Bridge = await ethers.getContractFactory("EtrnaUniversalBridge");
    const bridge = await Bridge.deploy(owner.address);
    const Router = await ethers.getContractFactory("EtrnaSwapRouter");
    const router = await Router.deploy(owner.address);
    const Tracker = await ethers.getContractFactory("WalletActivityTracker");
    const tracker = await Tracker.deploy(owner.address);

    expect(await bridge.owner()).to.equal(owner.address);
    expect(await router.owner()).to.equal(owner.address);
    expect(await tracker.owner()).to.equal(owner.address);
  });
});
