import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'service-health',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'api/live',
          source: JSON.stringify({
            status: 'ok',
            component: 'coffee',
            version: packageJson.version,
          }),
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
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
    },
  },
});
