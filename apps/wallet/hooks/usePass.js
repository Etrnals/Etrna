import useSWR from 'swr';
import fetcher from '../lib/fetcher';

export function usePassEntitlements(address = 'demo-pass-holder') {
  return useSWR(`/api/pass?address=${address}`, fetcher, {
    fallbackData: {
      balance: 0,
      etrnalsMintAccess: false,
      walletTier: 'Standard',
      walletMultiplier: 1,
      vibeCheckBoost: 1,
      perks: ['Mint on OpenSea to unlock EtrnaPass perks']
    }
  });
}
