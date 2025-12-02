'use client';

import { ReactNode } from 'react';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { base, polygon } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [base, polygon],
  transports: {
    [base.id]: process.env.NEXT_PUBLIC_BASE_RPC_URL ? http(process.env.NEXT_PUBLIC_BASE_RPC_URL) : http(),
    [polygon.id]: process.env.NEXT_PUBLIC_POLYGON_RPC_URL
      ? http(process.env.NEXT_PUBLIC_POLYGON_RPC_URL)
      : http(),
  },
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}
