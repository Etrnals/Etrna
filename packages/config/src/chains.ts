export const ETR_CHAIN = {
  id: 1337,
  name: "Etrna L1",
  network: "etrna",
  nativeCurrency: {
    decimals: 18,
    name: "Etrna",
    symbol: "ETR"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.etrna.example"],
      webSocket: ["wss://rpc.etrna.example/ws"]
    },
    public: {
      http: ["https://rpc.etrna.example"],
      webSocket: ["wss://rpc.etrna.example/ws"]
    }
  },
  blockExplorers: {
    default: { name: "EtrnaScan", url: "https://scan.etrna.example" }
  }
} as const;

export type EtrnaChain = typeof ETR_CHAIN;
