import { Contract, JsonRpcProvider, Wallet } from "ethers";
import erc721Abi from "../../abis/Etrnals721A.json" assert { type: "json" };
import stakingAbi from "../../abis/EtrnalsStaking.json" assert { type: "json" };

export type MintParams = {
  speciesId: number;
  quantity: number;
  value: string;
};

export function getProvider(rpcUrl: string) {
  return new JsonRpcProvider(rpcUrl);
}

export function getMinter(rpcUrl: string, privateKey: string, address: string) {
  const provider = getProvider(rpcUrl);
  return new Contract(address, erc721Abi, new Wallet(privateKey, provider));
}

export function getStaking(rpcUrl: string, privateKey: string, address: string) {
  const provider = getProvider(rpcUrl);
  return new Contract(address, stakingAbi, new Wallet(privateKey, provider));
}

export async function mintPublic(minter: Contract, params: MintParams) {
  return minter.mint(params.speciesId, params.quantity, { value: params.value });
}

export async function mintBlueChip(minter: Contract, params: MintParams, collection: string) {
  return minter.blueChipMint(params.speciesId, params.quantity, collection, { value: params.value });
}

export async function fetchMultipliers(staking: Contract, owner: string, tokenIds: number[]) {
  const rewards = await staking.pendingRewards(owner, tokenIds);
  return rewards.toString();
}
