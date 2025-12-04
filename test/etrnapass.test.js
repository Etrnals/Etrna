const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EtrnaPass721", function () {
  async function deployPass() {
    const [deployer, openSea, user] = await ethers.getSigners();
    const Pass = await ethers.getContractFactory("EtrnaPass721");
    const pass = await Pass.deploy(
      "EtrnaPass",
      "ETRNP",
      "ipfs://etrnapass/",
      deployer.address,
      750,
      openSea.address,
      5000
    );
    return { deployer, openSea, user, pass };
  }

  it("restricts minting to the OpenSea minter", async function () {
    const { pass, user, openSea } = await deployPass();
    await expect(pass.connect(user).mintFromOpenSea(user.address, 1)).to.be.revertedWith(
      "Mint only via OpenSea"
    );
    await pass.connect(openSea).mintFromOpenSea(user.address, 2);
    expect(await pass.totalSupply()).to.equal(2);
    expect(await pass.balanceOf(user.address)).to.equal(2);
  });

  it("exposes entitlement snapshots for holders", async function () {
    const { pass, openSea, user } = await deployPass();
    await pass.connect(openSea).mintFromOpenSea(user.address, 1);
    const entitlement = await pass.entitlementSnapshot(user.address);
    expect(entitlement.etrnalsMintAccess).to.equal(true);
    expect(entitlement.walletMultiplierBps).to.equal(12000);
    expect(entitlement.vibeCheckBoostBps).to.equal(1500);
  });
});
