const express = require("express");
const crypto = require("crypto");
const config = require("../config");

const router = express.Router();

const PROVIDERS = ["ipfs", "s3"];

router.get("/providers", (_req, res) => {
  res.json({ providers: PROVIDERS });
});

router.post("/upload", (req, res) => {
  const provider = (req.body.provider || config.defaultStorage || "ipfs").toLowerCase();
  if (!PROVIDERS.includes(provider)) {
    return res.status(400).json({ error: "Unsupported provider" });
  }
  const payload = req.body.content || "";
  const name = req.body.name || "uef-doc";
  const cid = crypto.createHash("sha256").update(provider + payload + name).digest("hex");
  res.json({ uri: `${provider}://uef/${cid}`, provider });
});

module.exports = router;
