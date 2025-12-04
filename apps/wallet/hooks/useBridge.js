import { useState } from 'react';

export default function useBridge() {
  const [status, setStatus] = useState('Idle');

  const bridge = () => {
    setStatus('Submitting bridge intent via EtrnaUniversalBridge...');
    setTimeout(() => setStatus('Bridge queued. Awaiting relayer confirmation.'), 500);
  };

  return { bridge, status };
}
