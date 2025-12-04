const express = require('express');
const router = express.Router();

const activity = {};

router.post('/record', (req, res) => {
  const { address, action, multiplier = 1 } = req.body || {};
  if (!address || !action) {
    return res.status(400).json({ error: 'address and action required' });
  }
  const snapshot = activity[address] || { bridge: 0, swap: 0, nft: 0, identity: 0, points: 0 };
  switch (action) {
    case 'bridge':
      snapshot.bridge += 1;
      snapshot.points += 10 * multiplier;
      break;
    case 'swap':
      snapshot.swap += 1;
      snapshot.points += 5 * multiplier;
      break;
    case 'nft':
      snapshot.nft += 1;
      snapshot.points += 1;
      break;
    case 'identity':
      snapshot.identity += 1;
      snapshot.points += 20 * multiplier;
      break;
    default:
      return res.status(400).json({ error: 'unknown action' });
  }
  activity[address] = snapshot;
  return res.json(snapshot);
});

router.get('/summary/:address', (req, res) => {
  const snapshot = activity[req.params.address] || { bridge: 0, swap: 0, nft: 0, identity: 0, points: 0 };
  res.json(snapshot);
});

module.exports = router;
