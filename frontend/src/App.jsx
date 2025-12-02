import EtrnaWallet from './components/EtrnaWallet.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Etrna Mint Console</h1>
        <p className="muted">Connect your wallet and mint Etrnals from the allowlist or public sale.</p>
      </header>
      <EtrnaWallet />
      <footer className="app-footer">Update network and contract settings in <code>src/config.js</code>.</footer>
    </div>
  );
}
