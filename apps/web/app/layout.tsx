import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Etrna Wallet",
  description: "Etrna L1 Web3 portal"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-etrna-dark text-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <header className="flex flex-col gap-2 pb-8">
            <p className="text-sm uppercase tracking-[0.2em] text-etrna-primary">Etrna L1</p>
            <h1 className="text-3xl font-semibold">EtrnaWallet Portal</h1>
            <p className="text-base text-gray-300">
              Connect to the Etrna chain, review balances, and launch into UEF, Marketplace, and VibeCheck modules.
            </p>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
