const { expect } = require("chai");
const { ethers } = require("hardhat");

const deploy = async () => {
  const [owner, user] = await ethers.getSigners();
  const factory = await ethers.getContractFactory("Etrnals");
  const contract = await factory.deploy(
    "Etrnals",
    "ETRNL",
    10,
    2,
    ethers.parseEther("0.1"),
    "ipfs://base/",
    owner.address
  );
  await contract.waitForDeployment();
  return { contract, owner, user };
};

describe("Etrnals", () => {
  it("mints during allowlist", async () => {
    const { contract, user } = await deploy();
    const leaf = ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address"], [user.address]));
    const tree = new (require("merkletreejs").MerkleTree)([leaf], ethers.keccak256, { sortPairs: true });
    await contract.setAllowlistRoot(tree.getHexRoot());
    await contract.toggleAllowlist(true);
    const proof = tree.getHexProof(leaf);

    await expect(contract.connect(user).allowlistMint(1, proof, { value: ethers.parseEther("0.1") }))
      .to.emit(contract, "AllowlistMinted");
  });
});
