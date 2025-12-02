require("dotenv").config();
const path = require("path");

const DEFAULT_RPC_URL = "http://127.0.0.1:8545";
const DEFAULT_ALLOWLIST_PATH = path.join(__dirname, "allowlist.json");

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  rpcUrl: process.env.RPC_URL || DEFAULT_RPC_URL,
  contractAddress: process.env.CONTRACT_ADDRESS || "",
  allowlistPath: process.env.ALLOWLIST_PATH || DEFAULT_ALLOWLIST_PATH,
};

module.exports = config;
