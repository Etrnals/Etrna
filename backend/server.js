const express = require("express");
const cors = require("cors");
const config = require("./config");
const { getAllowlistData, getProofForAddress } = require("./allowlist");
const { getContractState } = require("./contractClient");
const entitlementUpgrades = require("./entitlement-upgrades");

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/entitlements", entitlementUpgrades);

  let allowlistCache;

  function ensureAllowlist() {
    if (!allowlistCache) {
      allowlistCache = getAllowlistData(config.allowlistPath);
    }
    return allowlistCache;
  }

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/allowlist/root", (_req, res, next) => {
    try {
      const { root, addresses } = ensureAllowlist();
      res.json({ root, total: addresses.length });
    } catch (error) {
      next(error);
    }
  });

  app.get("/allowlist/proof/:address", (req, res, next) => {
    try {
      const { tree } = ensureAllowlist();
      const proof = getProofForAddress(req.params.address, tree);
      if (!proof) {
        res.status(404).json({ error: "Address not in allowlist" });
        return;
      }
      res.json({ address: req.params.address, proof });
    } catch (error) {
      next(error);
    }
  });

  app.get("/status", async (_req, res, next) => {
    try {
      const state = await getContractState();
      if (!state) {
        res.status(200).json({
          connected: false,
          message: "Set CONTRACT_ADDRESS to enable contract status queries",
        });
        return;
      }
      res.json({ connected: true, rpcUrl: config.rpcUrl, ...state });
    } catch (error) {
      next(error);
    }
  });

  app.use((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ error: err.message });
  });

  return app;
}

function start() {
  const app = createApp();
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on port ${config.port}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { createApp, start };
