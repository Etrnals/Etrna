import { useState } from 'react';

export default function useSwap() {
  const [status, setStatus] = useState('Idle');

  const swap = () => {
    setStatus('Routing swap through EtrnaSwapRouter...');
    setTimeout(() => setStatus('Swap executed with optimal path.'), 500);
  };

  return { swap, status };
}
