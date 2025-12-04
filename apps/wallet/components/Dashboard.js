import Link from 'next/link';
import WalletActions from './WalletActions';
import RewardSummary from './RewardSummary';
import Notifications from './Notifications';
import NftGallery from './NftGallery';
import PassViewer from './PassViewer';
import UEFDashboard from './UEFDashboard';

export default function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold">EtrnaWallet</h1>
        <p className="text-slate-300">Universal wallet for EVM chains and Etrna L1 with bridges, swaps, NFTs, and ZK identity.</p>
      </header>
      <WalletActions />
      <RewardSummary />
      <UEFDashboard />
      <PassViewer />
      <NftGallery />
      <Notifications />
      <footer className="text-sm text-slate-400 flex gap-3">
        <Link href="#">Terms</Link>
        <Link href="#">Privacy</Link>
      </footer>
    </div>
  );
}
