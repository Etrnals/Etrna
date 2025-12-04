const express = require('express');
const router = express.Router();

const assets = {};

router.post('/holdings', (req, res) => {
  const { address, tokens = [], nfts = [] } = req.body || {};
  assets[address] = { tokens, nfts };
  res.json({ ok: true });
});

router.get('/holdings/:address', (req, res) => {
  res.json(assets[req.params.address] || { tokens: [], nfts: [] });
});

module.exports = router;
