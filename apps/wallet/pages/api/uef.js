const API_BASE = process.env.NEXT_PUBLIC_WALLET_API || process.env.WALLET_BACKEND_URL || 'http://localhost:4000';

export default async function handler(req, res) {
  const action = req.method === 'POST' ? req.body?.action : req.query.action;
  try {
    if (req.method === 'GET' && req.query.jobId) {
      const response = await fetch(`${API_BASE}/uef/mint/jobs/${req.query.jobId}`);
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (action === 'encrypt') {
      const response = await fetch(`${API_BASE}/uef/encryptor/encrypt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: req.body.content }),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (action === 'upload') {
      const response = await fetch(`${API_BASE}/uef/storage/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: req.body.content,
          provider: req.body.provider,
          name: req.body.name,
        }),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    if (action === 'mint') {
      const response = await fetch(`${API_BASE}/uef/mint/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fingerprint: req.body.fingerprint,
          storageURI: req.body.storageURI,
          storageProvider: req.body.storageProvider,
          transferable: req.body.transferable,
          owner: req.body.owner,
        }),
      });
      const data = await response.json();
      return res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('UEF API error', error);
  }

  res.status(400).json({ error: 'Unsupported UEF action' });
}
