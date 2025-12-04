const API_BASE = process.env.NEXT_PUBLIC_WALLET_API || process.env.WALLET_BACKEND_URL || 'http://localhost:4000';

export default async function handler(req, res) {
  const address = req.query.address || 'demo-pass-holder';
  try {
    const response = await fetch(`${API_BASE}/entitlements/pass/${address}`);
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('entitlement lookup failed', error);
  }

  res.status(200).json({
    balance: 0,
    etrnalsMintAccess: false,
    walletTier: 'Standard',
    walletMultiplier: 1,
    vibeCheckBoost: 1,
    perks: ['Mint on OpenSea to unlock EtrnaPass perks']
  });
}
