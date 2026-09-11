import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { version } from './package.json';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'service-health',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'api/live',
          source: JSON.stringify({ status: 'ok', component: 'coffee', version }),
        });
      },
    },
  ],
  build: {
    license: { fileName: 'oss-licenses.txt' },
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
