const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UEF Vault", function () {
  async function deployUEF() {
    const [owner, user, other] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory("UEFVaultNFT");
    const vault = await Vault.deploy("UEF Vault", "UEF", "ipfs://uef/", owner.address, owner.address, 750);
    const Registry = await ethers.getContractFactory("UEFRegistry");
    const registry = await Registry.deploy(vault.address);
    await vault.setRegistry(registry.address);
    return { owner, user, other, vault, registry };
  }

  it("registers a unique fingerprint and mints soulbound by default", async function () {
    const { registry, vault, user } = await deployUEF();
    const fingerprint = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc-1"));

    const tx = await registry.registerDocument(
      user.address,
      fingerprint,
      "ipfs://cid1",
      0,
      false
    );
    const receipt = await tx.wait();
    const tokenId = receipt.events.find((e) => e.event === "DocumentRegistered").args.tokenId;

    expect(await vault.balanceOf(user.address)).to.equal(1);
    expect(await vault.isSoulbound(tokenId)).to.equal(true);
    await expect(
      vault.connect(user)["safeTransferFrom(address,address,uint256)"](user.address, registry.address, tokenId)
    ).to.be.revertedWith("Soulbound");
  });

  it("allows transferable UEFs to move between owners", async function () {
    const { registry, vault, user, other } = await deployUEF();
    const fingerprint = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc-transfer"));

    const tx = await registry.registerDocument(
      user.address,
      fingerprint,
      "ipfs://cid2",
      0,
      true
    );
    const receipt = await tx.wait();
    const tokenId = receipt.events.find((e) => e.event === "DocumentRegistered").args.tokenId;

    await vault.connect(user)["safeTransferFrom(address,address,uint256)"](user.address, other.address, tokenId);
    expect(await vault.ownerOf(tokenId)).to.equal(other.address);
  });

  it("prevents duplicate fingerprints", async function () {
    const { registry, user } = await deployUEF();
    const fingerprint = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("doc-duplicate"));

    await registry.registerDocument(user.address, fingerprint, "ipfs://cid3", 0, true);
    await expect(
      registry.registerDocument(user.address, fingerprint, "ipfs://cid4", 0, true)
    ).to.be.revertedWithCustomError(registry, "FingerprintExists");
  });
});
