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

## Wallet client
The wallet client uses the Hardhat artifacts from this repo to power a minting UI. You can keep it alongside this project (for example, in a sibling `wallet-client/` directory) and point it at the compiled contract output `artifacts/contracts/Etrnals.sol/Etrnals.json` for the ABI.

### Running the UI
1. Install dependencies: `npm install` (or `pnpm install`/`yarn install` if you prefer) inside the wallet client folder.
2. Start a development server: `npm run dev` (typically binds to `http://localhost:3000`).
3. Build for production: `npm run build` followed by `npm run start`.

### Configuring network and contract
Create a `.env.local` (or comparable) in the wallet client with values like:

```bash
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545       # or your testnet/mainnet RPC
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedContract
NEXT_PUBLIC_NETWORK_NAME=localhost              # optional display string for the UI
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001   # backend base URL for Merkle proofs
```

- `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_RPC_URL` must match the network where `Etrnals` is deployed.
- The ABI is loaded from `artifacts/contracts/Etrnals.sol/Etrnals.json` after running `npm run compile` in this repo.
- `NEXT_PUBLIC_BACKEND_URL` enables the UI to fetch allowlist Merkle proofs from the Express backend (see the `/allowlist/proof/:address` route in `backend/server.js`).

### Minting through the UI
- **Allowlist mint:** connect a wallet that is in your allowlist, click the allowlist mint option, enter a quantity within `maxPerWallet`, and the client will fetch a Merkle proof from `${NEXT_PUBLIC_BACKEND_URL}/allowlist/proof/<your_address>` before submitting the transaction.
- **Public mint:** when `publicMintActive` is true on the contract, choose the public mint flow, set a quantity, and submit with the required `mintPrice` × quantity in ETH.
- The UI should also display the active network, total supply, and mint toggles using on-chain reads so you can confirm you are pointed at the correct deployment.

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

## Building an allowlist
Use the same hashing scheme as the contract when building leaves for your Merkle tree. The on-chain check hashes addresses with
`keccak256(abi.encodePacked(account))`, which matches `ethers.keccak256(ethers.AbiCoder.defaultAbiCoder().encode(["address"],
[addr]))` or a `Buffer.from(addr.slice(2), "hex")` approach. An example using `merkletreejs` and ethers v6:

```js
import { keccak256, AbiCoder, getAddress } from "ethers";
import { MerkleTree } from "merkletreejs";

const addresses = ["0x1234...", "0xabcd..."];
const abiCoder = AbiCoder.defaultAbiCoder();

const leaves = addresses.map((addr) =>
  keccak256(abiCoder.encode(["address"], [getAddress(addr)]))
);

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getHexRoot();
const proofForFirst = tree.getHexProof(leaves[0]);
```

Use `root` with `setAllowlistRoot` on deployment, and pass `proofForFirst` to `allowlistMint` for the corresponding address.
- Events make it easy to trace mint activity: listen for `AllowlistMinted` and `PublicMinted`.
- `airdrop` bypasses payment but still respects `maxSupply`, making it suitable for team reserves or partnerships.
