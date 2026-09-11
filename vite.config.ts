import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (/\/node_modules\/(three|@react-three\/fiber)\//.test(id)) return 'three';
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
        },
      },
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
