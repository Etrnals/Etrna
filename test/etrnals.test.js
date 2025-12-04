const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Etrnals suite", function () {
  async function deploySuite() {
    const [deployer, user, bluechip] = await ethers.getSigners();

    const speciesData = new Array(9).fill(0).map((_, i) => ({
      name: `Species ${i}`,
      maxSupply: 1111,
      baseURI: "ipfs://base/",
      utility: "utility"
    }));
    const multiplierData = new Array(9).fill(0).map(() => ({
      vibeMultiplier: 10000,
      etrMultiplier: 10000,
      legendaryBonus: 1500
    }));

    const Registry = await ethers.getContractFactory("SpeciesRegistry");
    const registry = await Registry.deploy(9, speciesData, multiplierData);

    const Etrnals = await ethers.getContractFactory("Etrnals721A");
    const etrnals = await Etrnals.deploy("Etrnals", "ETRNL", ethers.parseEther("0.08"), deployer.address, 750, registry.target);
    await registry.setMinter(etrnals.target, true);

    const Staking = await ethers.getContractFactory("EtrnalsStaking");
    const staking = await Staking.deploy(etrnals.target, registry.target);

    const BlueChip = await ethers.getContractFactory("Etrnals");
    const bc = await BlueChip.deploy("BC", "BC", 10, 10, ethers.parseEther("0.01"), "ipfs://", deployer.address);
    await bc.togglePublicMint(true);
    await bc.connect(bluechip).publicMint(1, { value: ethers.parseEther("0.01") });

    return { deployer, user, bluechip, registry, etrnals, staking, bc };
  }

  it("mints and tracks species supply", async function () {
    const { etrnals, registry, user } = await deploySuite();
    await etrnals.setMintStates(false, true, false);
    await etrnals.connect(user).mint(0, 2, { value: ethers.parseEther("0.16") });
    expect(await etrnals.totalSupply()).to.equal(2);
    expect(await registry.mintedBySpecies(0)).to.equal(2);
  });

  it("allows blue-chip minting when holder", async function () {
    const { etrnals, bc, bluechip } = await deploySuite();
    await etrnals.setMintStates(false, true, true);
    await etrnals.setBlueChipCollection(bc.target, true);
    await etrnals.connect(bluechip).blueChipMint(1, 1, bc.target, { value: ethers.parseEther("0.08") });
    expect(await etrnals.ownerOf(0)).to.equal(bluechip.address);
  });

  it("stakes and calculates rewards", async function () {
    const { etrnals, staking, registry, user } = await deploySuite();
    await etrnals.setMintStates(false, true, false);
    await etrnals.connect(user).mint(2, 1, { value: ethers.parseEther("0.08") });
    await etrnals.connect(user).approve(staking.target, 0);
    await staking.connect(user).stake([0]);
    await ethers.provider.send("evm_increaseTime", [3600]);
    await ethers.provider.send("evm_mine", []);
    const pending = await staking.pendingRewards(user.address, [0]);
    expect(pending).to.be.gt(0);
  });
});
