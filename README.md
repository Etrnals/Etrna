# Etrna Monorepo (Turborepo)

Etrna is a decentralized reality accelerator built on the Etrna L1 (ETR Chain). This monorepo provides the foundational scaffolding for the ecosystem across smart contracts, backend services, and Web3 frontends.

## Structure
- `apps/web`: Next.js (App Router) Web3 frontend for the EtrnaWallet experience.
- `apps/api`: NestJS backend scaffold for entitlements, rewards, UEF, and other services.
- `packages/config`: Shared configuration (chains, RPC, env schema).
- `packages/sdk`: Shared client-side helpers and contract ABIs (placeholder).

## Getting Started
1. Install dependencies (pnpm recommended):
   ```bash
   pnpm install
   ```
2. Run the web app:
   ```bash
   pnpm dev --filter web
   ```
3. Run the API (dev mode):
   ```bash
   pnpm dev --filter api
   ```

## Scripts
Key scripts are orchestrated through Turborepo:
- `pnpm dev`: Run all dev servers.
- `pnpm build`: Build all apps and packages.
- `pnpm lint`: Lint all workspaces.

## Roadmap
- Expand `packages/sdk` with verified ABIs and wagmi/viem clients.
- Flesh out API modules for entitlements, rewards, UEF Vault, and EtrnaMusic.
- Add CI (GitHub Actions) for linting, tests, and type checks.
- Integrate smart contract deployments and Foundry workspace for on-chain components.
