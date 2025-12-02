'use client';

import Link from 'next/link';

const cards = [
  {
    href: '/wallet',
    title: 'EtrnaWallet',
    description: 'Smart-account wallet with session keys, gas sponsorship, and spending limits.',
  },
  {
    href: '/music',
    title: 'Music Distribution',
    description: 'Upload tracks, distribute to Web2 platforms, and mint on Etrna as NFTs.',
  },
  {
    href: '/oracle',
    title: 'AI Oracle',
    description: 'Request verifiable AI inferences for UEFs, backed by restaked security.',
  },
  {
    href: '/agents',
    title: 'AI Agents',
    description: 'Register and manage on-chain AI agents as first-class users.',
  },
  {
    href: '/uef',
    title: 'UEF Registry',
    description: 'Register and browse Universal Entitlement Framework metadata.',
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <section>
        <h1 className="text-3xl font-semibold">Welcome to Etrna</h1>
        <p className="mt-2 text-sm text-slate-300">
          A creator-native ecosystem for on-chain music, AI agents, and verifiable intelligence.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-500 transition"
          >
            <h2 className="text-lg font-medium">{card.title}</h2>
            <p className="mt-1 text-xs text-slate-300">{card.description}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
