const express = require('express');

const router = express.Router();
const entitlements = {};

function computeEntitlements(balance = 0) {
  const hasPass = balance > 0;
  return {
    balance,
    etrnalsMintAccess: hasPass,
    walletTier: hasPass ? 'Passholder' : 'Standard',
    walletMultiplier: hasPass ? 1.2 : 1,
    vibeCheckBoost: hasPass ? 1.15 : 1,
    perks: hasPass
      ? [
          'Direct mint access for Etrnals drops',
          'Priority wallet routing and fee rebates',
          'VibeCheck boosted reputation proofs',
          'Entitlement sync across bridges/swaps'
        ]
      : ['Bridge to earn base perks', 'Verify identity to unlock boosts']
  };
}

router.get('/pass/:address', (req, res) => {
  const address = (req.params.address || '').toLowerCase();
  const snapshot = entitlements[address] || computeEntitlements(0);
  res.json(snapshot);
});

router.post('/pass/sync', (req, res) => {
  const { address, balance = 0 } = req.body || {};
  if (!address) {
    return res.status(400).json({ error: 'address required' });
  }
  const snapshot = computeEntitlements(balance);
  entitlements[address.toLowerCase()] = snapshot;
  res.json(snapshot);
});

module.exports = router;
