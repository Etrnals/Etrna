# Etrnals NFT collection

This repository provides a Hardhat-based project for the Etrnals ERC-721 collection, including the core minting contract, deployment script, and an example Merkle allowlist test. The design focuses on a transparent mint flow with supply caps, per-wallet limits, metadata management, and protected treasury withdrawals.

## What’s inside
- **Etrnals ERC-721** with: fixed `maxSupply`, per-wallet limit (`maxPerWallet`), exact-price enforcement, and a dedicated treasury for withdrawals.
- **Dual minting flows**: allowlist minting (with Merkle proofs) and public minting that can be toggled independently.
- **Metadata controls**: owner can update base URI until `lockMetadata` is called; after locking, metadata is immutable.
- **Owner tools**: airdrop to any address and treasury rotation with safety checks.
- **Automation-ready scripts**: deploy script with sensible defaults plus a reference test that demonstrates Merkle proofs for allowlist minting.

## Contract quick reference
Key parameters passed to `Etrnals` constructor:
- `name_` / `symbol_`: collection branding on-chain.
- `maxSupply_`: hard cap on total tokens (cannot be exceeded by public/allowlist/airdrop mints).
- `maxPerWallet_`: maximum tokens a single wallet can mint (enforced across allowlist and public mints).
- `mintPrice_`: exact ETH payment required per token (`msg.value` must equal `mintPrice * quantity`).
- `baseURI_`: prefix used by `tokenURI` to serve metadata.
- `treasury_`: address that can withdraw funds (owner is also allowed by `onlyTreasury`).

Minting controls:
- `allowlistActive` / `publicMintActive` toggled via `toggleAllowlist(bool)` and `togglePublicMint(bool)`.
- `allowlistRoot` set with `setAllowlistRoot(bytes32)`; proofs generated off-chain using the same hashing scheme (`keccak256(abi.encodePacked(address))`).
- Events emitted on mints: `AllowlistMinted`, `PublicMinted`.

Metadata & funds:
- `setBaseURI(string)` adjusts metadata prefix until `lockMetadata()` is called.
- `withdraw()` moves contract ETH to `treasury`; callable by treasury or owner via `onlyTreasury` modifier.
- `airdrop(address,uint256)` allows owner to mint without payment while respecting `maxSupply`.

## Project layout
- `contracts/Etrnals.sol` — ERC-721 implementation with allowlist/public minting, metadata controls, treasury withdrawal, and owner airdrop support.
- `scripts/deploy.js` — deploy script with sane defaults for supply, pricing, and base metadata URL.
- `test/etrnals.test.js` — Hardhat test covering allowlist minting with Merkle proofs.
- `hardhat.config.js` — configuration for Solidity 0.8.20 and optional network/API key environment variables.
- `backend/` — lightweight API for allowlist proofs and contract status (requires compiled artifacts).

## Getting started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile contracts:
   ```bash
   npm run compile
   ```
3. Run tests:
   ```bash
   npm test
   ```
4. Deploy (update `.env` with `RPC_URL` and `PRIVATE_KEY`):
   ```bash
   npm run deploy
   ```

5. Start the backend API (after compiling to generate artifacts):
   ```bash
   CONTRACT_ADDRESS=0xYourDeployedContract npm run start
   ```

## Local development tips
- Start a local node for rapid iteration: `npx hardhat node` (in a separate terminal).
- To deploy locally, set `RPC_URL=http://127.0.0.1:8545` and a funded `PRIVATE_KEY` from the node output, then run `npm run deploy`.
- Hardhat console is useful for quick interactions: `npx hardhat console --network localhost` then call functions such as `await etrnals.togglePublicMint(true)`.

Example `.env` skeleton:
```bash
RPC_URL="https://rpc.yournetwork.example"
PRIVATE_KEY="your_private_key_without_0x"
ETHERSCAN_API_KEY="optional_verification_key"
CONTRACT_ADDRESS="optional_deployed_contract_for_backend_status"
PORT=3001
ALLOWLIST_PATH="backend/allowlist.json"
```

## Building an allowlist
Merkle proofs in tests are generated with `merkletreejs`. You can use the same approach to produce production roots and proofs:

```js
// scripts/generateAllowlist.js
require("dotenv").config();
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const allowlist = [
  "0x1234...",
  "0xabcd...",
  // ...more addresses
];

const leaves = allowlist.map((addr) => keccak256(addr));
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

console.log("Root:", tree.getHexRoot());
console.log("Proof for first address:", tree.getHexProof(leaves[0]));
```

Update the contract root with `setAllowlistRoot(root)` and share each wallet’s proof for minting via `allowlistMint(quantity, proof)`.

The backend service exposes:
- `GET /health` — readiness probe.
- `GET /allowlist/root` — current Merkle root and entry count from `ALLOWLIST_PATH`.
- `GET /allowlist/proof/:address` — Merkle proof for a given address or 404 if not included.
- `GET /status` — on-chain contract status (when `CONTRACT_ADDRESS` is set and artifacts exist).

## Environment variables
- `RPC_URL` — RPC endpoint for the target network.
- `PRIVATE_KEY` — deployer key (no `0x` prefix).
- `ETHERSCAN_API_KEY` — optional key for contract verification.

## Notes
- Base URI can be updated until `lockMetadata` is called; afterwards it is immutable.
- Allowlist minting requires a Merkle root set via `setAllowlistRoot`.
- Public minting and allowlist minting can be toggled independently.
- Events make it easy to trace mint activity: listen for `AllowlistMinted` and `PublicMinted`.
- `airdrop` bypasses payment but still respects `maxSupply`, making it suitable for team reserves or partnerships.
