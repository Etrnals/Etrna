import { useMemo } from 'react';
import { Address, PublicClient, WalletClient, getContract } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';
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

export interface MusicUploadHookOptions {
  distributorAddress?: Address;
}

export interface MusicUploadHandle {
  ready: boolean;
  mintAndUpload: (params: MusicUploadParams) => Promise<{ txHash: Address } | void>;
}

export function useMusicUpload(options: MusicUploadHookOptions = {}): MusicUploadHandle {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const distributorAddress = options.distributorAddress ?? (process.env.NEXT_PUBLIC_DISTRIBUTOR_ADDRESS as Address | undefined);

  const client = useMemo(() => {
    if (!publicClient || !walletClient || !distributorAddress) return null;
    return new MusicClient(publicClient, walletClient, distributorAddress);
  }, [publicClient, walletClient, distributorAddress]);

  if (!client) {
    return {
      ready: false,
      async mintAndUpload() {
        throw new Error('Missing wallet connection or distributor address');
      },
    };
  }

  return {
    ready: true,
    mintAndUpload: (params) => client.mintAndUpload(params),
  };
}
