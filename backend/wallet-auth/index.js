const express = require('express');
const router = express.Router();

// Simple mock identity route using pseudo ZK proof payloads
router.post('/zk-proof', (req, res) => {
  const { address, proof } = req.body || {};
  if (!address || !proof) {
    return res.status(400).json({ error: 'address and proof required' });
  }
  return res.json({ address, verified: true, tier: 'EtrnaID', points: 20 });
});

module.exports = router;
