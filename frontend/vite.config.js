import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@artifact': path.resolve(__dirname, '../artifacts/contracts/Etrnals.sol/Etrnals.json'),
    },
  },
  server: {
    fs: {
      // allow access to contract artifacts outside of frontend folder
      allow: ['..'],
    },
  },
});
