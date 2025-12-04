import { useState } from 'react';
import fetcher from '../lib/fetcher';

const API_PATH = '/api/uef';

export default function useUef() {
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);

  async function encrypt(content) {
    const response = await fetcher(API_PATH, {
      method: 'POST',
      body: JSON.stringify({ action: 'encrypt', content }),
    });
    return response;
  }

  async function upload({ content, provider, name }) {
    setUploading(true);
    try {
      const response = await fetcher(API_PATH, {
        method: 'POST',
        body: JSON.stringify({ action: 'upload', provider, content, name }),
      });
      return response;
    } finally {
      setUploading(false);
    }
  }

  async function queueMint({ fingerprint, storageURI, storageProvider, transferable, owner }) {
    const { job } = await fetcher(API_PATH, {
      method: 'POST',
      body: JSON.stringify({
        action: 'mint',
        fingerprint,
        storageURI,
        storageProvider,
        transferable,
        owner,
      }),
    });
    setJobs((prev) => [job, ...prev]);
    return job;
  }

  async function refreshJob(id) {
    const { job } = await fetcher(`${API_PATH}?jobId=${id}`);
    setJobs((prev) => prev.map((j) => (j.id === id ? job : j)));
    return job;
  }

  return {
    encrypt,
    upload,
    queueMint,
    refreshJob,
    jobs,
    uploading,
  };
}
