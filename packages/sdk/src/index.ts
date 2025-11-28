import { ETR_CHAIN } from "@etrna/config";

export type ContractAddressMap = Record<string, `0x${string}`>;

export const contracts: ContractAddressMap = {
  EtrnaToken: "0x0000000000000000000000000000000000000000",
  VibeToken: "0x0000000000000000000000000000000000000000",
  RewardDistributor: "0x0000000000000000000000000000000000000000"
};

export const chains = {
  etrna: ETR_CHAIN
};

export const getChainRpc = () => chains.etrna.rpcUrls.default.http[0];
