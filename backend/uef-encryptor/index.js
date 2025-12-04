const express = require("express");
const crypto = require("crypto");
const config = require("../config");

const router = express.Router();

function getKey() {
  const source = process.env.UEF_ENCRYPTION_KEY || config.encryptionKey;
  return crypto.createHash("sha256").update(source).digest();
}

function fingerprintPayload(payload) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

router.post("/fingerprint", (req, res) => {
  const payload = req.body.content || "";
  const fingerprint = fingerprintPayload(payload + (req.body.salt || ""));
  res.json({ fingerprint });
});

router.post("/encrypt", (req, res) => {
  const payload = req.body.content || "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const fingerprint = fingerprintPayload(payload + (req.body.salt || ""));

  res.json({
    fingerprint,
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: ciphertext.toString("hex"),
  });
});

module.exports = router;
