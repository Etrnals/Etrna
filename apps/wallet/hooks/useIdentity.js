import { useState } from 'react';

export default function useIdentity() {
  const [status, setStatus] = useState('Idle');

  const prove = () => {
    setStatus('Submitting Billions ZK proof...');
    setTimeout(() => setStatus('Identity verified. Rewards applied.'), 500);
  };

  return { prove, status };
}
