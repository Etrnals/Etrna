import Head from 'next/head';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <Head>
        <title>EtrnaWallet</title>
      </Head>
      <Dashboard />
    </div>
  );
}
