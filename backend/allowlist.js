const fs = require("fs");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { getAddress } = require("ethers");

function loadAllowlist(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Allowlist file not found at ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const addresses = JSON.parse(raw);
  return addresses.map((addr) => getAddress(addr));
}

function buildTree(addresses) {
  const leaves = addresses.map((addr) => keccak256(Buffer.from(addr.slice(2), "hex")));
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

function getAllowlistData(filePath) {
  const addresses = loadAllowlist(filePath);
  const tree = buildTree(addresses);
  return { addresses, tree, root: tree.getHexRoot() };
}

function getProofForAddress(address, tree) {
  const normalized = getAddress(address);
  const leaf = keccak256(Buffer.from(normalized.slice(2), "hex"));
  const proof = tree.getHexProof(leaf);
  return proof.length ? proof : null;
}

module.exports = { getAllowlistData, getProofForAddress };
