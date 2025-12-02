import './globals.css';
import { ReactNode } from 'react';
import { Providers } from './providers';

export const metadata = {
  title: 'Etrna',
  description: 'Etrna ecosystem dApp',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <span className="font-semibold text-lg">Etrna</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">EtrnaWallet</span>
                {/* Connect button from wagmi or RainbowKit-like UI */}
              </div>
            </header>
            <main className="flex-1 px-6 py-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
