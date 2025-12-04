# UEF Vault Module

The UEF (Unique Encrypted Fingerprint) Vault secures documents by encrypting payloads, anchoring fingerprints on-chain, and minting soulbound or transferable NFTs.

## Contracts
- **UEFVaultNFT**: ERC721 + ERC2981 with per-token transferability flag and soulbound enforcement. Registry-only minting plus optional RewardsEngine callback.
- **UEFRegistry**: Validates unique fingerprints, orchestrates minting, and stores storage adapter provenance.

## Backend (mounted under `/uef`)
- **Encryptor** (`/uef/encryptor/encrypt`): AES-256-GCM encryption + fingerprinting.
- **Storage** (`/uef/storage/upload`): Simulated IPFS/S3 adapter that returns a deterministic URI.
- **Mint Worker** (`/uef/mint/jobs`): Queues and completes mint jobs with reward hints.

Environment:
```
UEF_ENCRYPTION_KEY=<32-byte secret>
UEF_STORAGE_PROVIDER=ipfs|s3
WALLET_BACKEND_URL=<backend origin for Next.js API proxy>
```

## Frontend
The wallet dashboard exposes a UEF section with encryption/upload/mint actions and a live job list, wired via `/api/uef` to the backend.

## Testing
Run the Hardhat test suite:
```
pnpm hardhat test test/uef.test.js
```
