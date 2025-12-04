import { JsonRpcProvider, Wallet } from 'ethers';

export interface WalletSdkConfig {
  rpcUrl: string;
  privateKey?: string;
  entitlementApiBase?: string;
}

export class EtrnaWalletSdk {
  provider: JsonRpcProvider;
  signer?: Wallet;
  entitlementApiBase?: string;

  constructor(config: WalletSdkConfig) {
    this.provider = new JsonRpcProvider(config.rpcUrl);
    this.signer = config.privateKey ? new Wallet(config.privateKey, this.provider) : undefined;
    this.entitlementApiBase = config.entitlementApiBase || 'http://localhost:4000';
  }

  async getBalance(address: string) {
    return this.provider.getBalance(address);
  }

  async getPassEntitlements(address: string) {
    const response = await fetch(`${this.entitlementApiBase}/entitlements/pass/${address}`);
    if (!response.ok) {
      throw new Error('Failed to fetch entitlements');
    }
    return response.json();
  }
}
