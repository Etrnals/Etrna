const express = require("express");
const crypto = require("crypto");

const router = express.Router();
let jobCounter = 0;
const jobs = new Map();

router.post("/jobs", (req, res) => {
  const id = ++jobCounter;
  const fingerprint = req.body.fingerprint || crypto.randomBytes(32).toString("hex");
  const job = {
    id,
    fingerprint,
    owner: req.body.owner || "demo-owner",
    storageURI: req.body.storageURI || "ipfs://placeholder",
    storageProvider: req.body.storageProvider || "ipfs",
    transferable: Boolean(req.body.transferable),
    status: "queued",
    tokenId: null,
    rewards: { vibe: 5, etr: 2 },
  };
  jobs.set(id, job);

  // simulate mint completion
  job.status = "minted";
  job.tokenId = id;
  job.mintedAt = new Date().toISOString();

  res.json({ job });
});

router.get("/jobs/:id", (req, res) => {
  const job = jobs.get(Number(req.params.id));
  if (!job) return res.status(404).json({ error: "Unknown job" });
  res.json({ job });
});

module.exports = router;
