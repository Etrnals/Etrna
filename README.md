# Etrnals NFT collection

This repository provides a Hardhat-based project for the Etrnals ERC-721 collection, including the core minting contract, deployment script, and an example Merkle allowlist test. The design focuses on a transparent mint flow with supply caps, per-wallet limits, metadata management, and protected treasury withdrawals.

## Project layout
- `contracts/Etrnals.sol` — ERC-721 implementation with allowlist/public minting, metadata controls, treasury withdrawal, and owner airdrop support.
- `scripts/deploy.js` — deploy script with sane defaults for supply, pricing, and base metadata URL.
- `test/etrnals.test.js` — Hardhat test covering allowlist minting with Merkle proofs.
- `hardhat.config.js` — configuration for Solidity 0.8.20 and optional network/API key environment variables.

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

## Environment variables
- `RPC_URL` — RPC endpoint for the target network.
- `PRIVATE_KEY` — deployer key (no `0x` prefix).
- `ETHERSCAN_API_KEY` — optional key for contract verification.

## Notes
- Base URI can be updated until `lockMetadata` is called; afterwards it is immutable.
- Allowlist minting requires a Merkle root set via `setAllowlistRoot`.
- Public minting and allowlist minting can be toggled independently.
