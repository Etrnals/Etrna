import Link from "next/link";
import { chains } from "@etrna/config";
import { contracts } from "@etrna/sdk";

const dashboardSections = [
  {
    title: "Balances & Network",
    description: "Connect wallet, view ETR/VIBE balances, and ensure you’re on the Etrna L1.",
    href: "#balances"
  },
  {
    title: "UEF Vault",
    description: "Mint UEFVault NFTs for encrypted IP, or browse your existing vault entries.",
    href: "#uef"
  },
  {
    title: "Marketplace",
    description: "Discover Etrnals, Founder NFTs, and Perk NFTs. Swap and purchase with ETR or VIBE.",
    href: "#marketplace"
  },
  {
    title: "Entitlements",
    description: "Check your perks, streak multipliers, and rewards pipeline from cross-chain activity.",
    href: "#entitlements"
  }
];

export default function Page() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 sm:grid-cols-2" id="balances">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-etrna-primary">Etrna Chain</p>
          <h2 className="text-xl font-semibold">Network Configuration</h2>
          <p className="mt-2 text-gray-300">Use these settings in your wallet to connect to the Etrna L1.</p>
          <dl className="mt-4 space-y-2 text-sm text-gray-200">
            <div className="flex justify-between">
              <dt>Chain ID</dt>
              <dd>{chains.etrna.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt>RPC URL</dt>
              <dd className="truncate" title={chains.etrna.rpcUrls.default.http[0]}>
                {chains.etrna.rpcUrls.default.http[0]}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Explorer</dt>
              <dd>{chains.etrna.blockExplorers?.default.url}</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6" id="entitlements">
          <p className="text-sm text-etrna-primary">Contracts</p>
          <h2 className="text-xl font-semibold">Core Addresses</h2>
          <p className="mt-2 text-gray-300">Placeholder addresses for core Etrna contracts. Replace with deployments.</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-200">
            {Object.entries(contracts).map(([name, address]) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span className="font-mono">{address}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2" id="uef">
        {dashboardSections.map((card) => (
          <article key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-etrna-primary">{card.title}</p>
                <h3 className="text-xl font-semibold">{card.title}</h3>
              </div>
              <span className="rounded-full bg-etrna-primary/10 px-3 py-1 text-xs text-etrna-primary">Soon</span>
            </div>
            <p className="mt-3 text-gray-300">{card.description}</p>
            <Link href={card.href} className="mt-4 inline-flex text-sm text-etrna-primary hover:text-etrna-accent">
              Explore
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
