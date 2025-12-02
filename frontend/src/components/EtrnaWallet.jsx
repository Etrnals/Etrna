import {useEffect, useMemo, useState} from 'react';
import {BrowserProvider, Contract, formatEther, parseEther} from 'ethers';
import artifact from '@artifact';
import {CONTRACT, NETWORK} from '../config.js';

const emptyState = {
  totalSupply: null,
  maxSupply: null,
  mintPrice: null,
  allowlistActive: false,
  publicMintActive: false,
  mintedByWallet: null,
};

export default function EtrnaWallet() {
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [proofInput, setProofInput] = useState('');
  const [state, setState] = useState(emptyState);
  const [loading, setLoading] = useState(false);

  const formattedPrice = useMemo(() => {
    if (!state.mintPrice) return '—';
    return `${formatEther(state.mintPrice)} ETH`;
  }, [state.mintPrice]);

  useEffect(() => {
    if (!window.ethereum) {
      setError('No injected wallet detected. Please install MetaMask or a compatible provider.');
    }
  }, []);

  const parseQuantity = () => {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      throw new Error('Quantity must be a positive integer');
    }
    return qty;
  };

  const loadProvider = async () => {
    if (!window.ethereum) {
      throw new Error('Browser wallet not found');
    }
    const browserProvider = new BrowserProvider(window.ethereum);
    const accounts = await browserProvider.send('eth_requestAccounts', []);
    if (!accounts || !accounts[0]) {
      throw new Error('No account selected');
    }
    const network = await browserProvider.getNetwork();
    if (Number(network.chainId) !== Number(NETWORK.chainId)) {
      throw new Error(`Wrong network: please switch to ${NETWORK.name} (chain ${NETWORK.chainId}).`);
    }
    setAccount(accounts[0]);
    const nextSigner = await browserProvider.getSigner();
    setSigner(nextSigner);
    return {browserProvider, nextSigner};
  };

  const loadContractState = async (ctr, currentAccount) => {
    try {
      const [totalSupply, maxSupply, mintPrice, allowlistActive, publicMintActive, mintedByWallet] =
        await Promise.all([
          ctr.totalSupply(),
          ctr.maxSupply(),
          ctr.mintPrice(),
          ctr.allowlistActive(),
          ctr.publicMintActive(),
          currentAccount ? ctr.mintedByWallet(currentAccount) : Promise.resolve(null),
        ]);

      setState({
        totalSupply: Number(totalSupply),
        maxSupply: Number(maxSupply),
        mintPrice,
        allowlistActive,
        publicMintActive,
        mintedByWallet: mintedByWallet ? Number(mintedByWallet) : null,
      });
    } catch (e) {
      setError(`Failed to read contract state: ${e.message}`);
    }
  };

  const connect = async () => {
    setError('');
    setStatus('Connecting to wallet...');
    try {
      if (!artifact?.abi) {
        throw new Error('Contract artifact missing. Make sure artifacts are compiled.');
      }
      if (!CONTRACT.address || CONTRACT.address === '0x0000000000000000000000000000000000000000') {
        throw new Error('Contract address not configured. Update src/config.js.');
      }
      const {nextSigner} = await loadProvider();
      const ctr = new Contract(CONTRACT.address, artifact.abi, nextSigner);
      setContract(ctr);
      await loadContractState(ctr, nextSigner.address);
      setStatus('Wallet connected.');
    } catch (e) {
      setError(e.message);
      setStatus('');
    }
  };

  const handleMint = async (mode) => {
    if (!contract || !signer) {
      setError('Connect your wallet first.');
      return;
    }
    setError('');
    setStatus(`${mode === 'allowlist' ? 'Allowlist' : 'Public'} mint in progress...`);
    setLoading(true);
    try {
      const qty = parseQuantity();
      const value = state.mintPrice ? state.mintPrice * BigInt(qty) : parseEther('0');
      const tx =
        mode === 'allowlist'
          ? await contract.allowlistMint(qty, parseProof(proofInput), {value})
          : await contract.publicMint(qty, {value});
      await tx.wait();
      await loadContractState(contract, signer.address);
      setStatus('Mint successful!');
    } catch (e) {
      setError(e.message || 'Transaction failed.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const parseProof = (input) => {
    if (!input.trim()) return [];
    return input
      .split(/\r?\n|,/)
      .map((p) => p.trim())
      .filter(Boolean);
  };

  return (
    <section className="card">
      <div className="flex-between">
        <div>
          <div className="badge">Network: {NETWORK.name}</div>
          <div className="badge">Contract: {CONTRACT.address}</div>
        </div>
        <button onClick={connect} disabled={loading}>
          {account ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      <div className="grid" style={{marginTop: '1rem'}}>
        <div>
          <span className="label">Supply</span>
          <div className="badge">
            {state.totalSupply ?? '—'} / {state.maxSupply ?? '—'}
          </div>
        </div>
        <div>
          <span className="label">Mint Price</span>
          <div className="badge">{formattedPrice}</div>
        </div>
        <div>
          <span className="label">Allowlist</span>
          <div className="badge">{state.allowlistActive ? 'Open' : 'Closed'}</div>
        </div>
        <div>
          <span className="label">Public</span>
          <div className="badge">{state.publicMintActive ? 'Open' : 'Closed'}</div>
        </div>
        <div>
          <span className="label">Minted by you</span>
          <div className="badge">{state.mintedByWallet ?? '—'}</div>
        </div>
      </div>

      <div className="grid" style={{marginTop: '1rem'}}>
        <label>
          <span className="label">Quantity</span>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="How many?"
          />
        </label>
        <label>
          <span className="label">Merkle Proof (comma or newline separated)</span>
          <textarea
            value={proofInput}
            onChange={(e) => setProofInput(e.target.value)}
            placeholder="0xabc..., 0xdef..."
          />
        </label>
      </div>

      <div className="flex-between" style={{marginTop: '1.25rem'}}>
        <button onClick={() => handleMint('allowlist')} disabled={loading || !state.allowlistActive}>
          Allowlist Mint
        </button>
        <button onClick={() => handleMint('public')} disabled={loading || !state.publicMintActive}>
          Public Mint
        </button>
      </div>

      {(status || error) && (
        <div className={`status ${error ? 'error' : 'success'}`}>{error || status}</div>
      )}
    </section>
  );
}
