import { Address, PublicClient, WalletClient, getContract } from 'viem';
import MusicDistributorAbi from './abi/MusicDistributor.json';

interface MusicUploadParams {
  title: string;
  uri: string;
  mintOnChain: boolean;
}

export class MusicClient {
  constructor(
    private readonly publicClient: PublicClient,
    private readonly walletClient: WalletClient,
    private readonly distributorAddress: Address,
  ) {}

  async mintAndUpload(params: MusicUploadParams) {
    const account = this.walletClient.account;
    if (!account) throw new Error('No connected account');

    const contract = getContract({
      address: this.distributorAddress,
      abi: MusicDistributorAbi,
      client: { public: this.publicClient, wallet: this.walletClient },
    });

    const hash = await contract.write.uploadAndMint([
      /* uefId: off-chain created via API -> you’d pipe that in here */
      0,
      params.uri,
      params.mintOnChain,
    ]);

    return { txHash: hash };
  }
}

// Hook for web app
export function useMusicUpload() {
  // In production, inject viem clients from wagmi context.
  // Here we assume you have a wrapper hook in apps/web.
  throw new Error('Implement useMusicUpload using MusicClient + wagmi viem clients');
}
