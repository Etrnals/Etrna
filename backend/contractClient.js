const fs = require("fs");
const path = require("path");
const { JsonRpcProvider, Contract } = require("ethers");
const config = require("./config");

function buildContractInterface() {
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Etrnals.sol/Etrnals.json");
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Artifact not found. Run `npx hardhat compile` first.");
  }
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const artifact = require(artifactPath);
  return artifact.abi;
}

function getReadClient() {
  const provider = new JsonRpcProvider(config.rpcUrl);
  if (!config.contractAddress) {
    return null;
  }
  const abi = buildContractInterface();
  const contract = new Contract(config.contractAddress, abi, provider);
  return contract;
}

async function getContractState() {
  const contract = getReadClient();
  if (!contract) {
    return null;
  }
  const [
    name,
    symbol,
    maxSupply,
    totalSupply,
    maxPerWallet,
    mintPrice,
    allowlistActive,
    publicMintActive,
    allowlistRoot,
    metadataLocked,
    baseTokenURI,
    treasury,
  ] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.maxSupply(),
    contract.totalSupply(),
    contract.maxPerWallet(),
    contract.mintPrice(),
    contract.allowlistActive(),
    contract.publicMintActive(),
    contract.allowlistRoot(),
    contract.metadataLocked(),
    contract.baseTokenURI(),
    contract.treasury(),
  ]);

  return {
    name,
    symbol,
    maxSupply: maxSupply.toString(),
    totalSupply: totalSupply.toString(),
    maxPerWallet: maxPerWallet.toString(),
    mintPrice: mintPrice.toString(),
    allowlistActive,
    publicMintActive,
    allowlistRoot,
    metadataLocked,
    baseTokenURI,
    treasury,
  };
}

module.exports = { getContractState };
