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
    allowOnly: false,
    passWithNoTests: false,
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      // Non-View production logic and data only; View .tsx components are covered by L4 E2E.
      include: ['src/lib/**/*.ts', 'src/data/**/*.ts'],
      exclude: [
        // Type-only definitions (no executable statements)
        'src/data/types.ts',
        // Browser AudioContext synthesis — covered by browser E2E
        'src/lib/sound.ts',
      ],
      reporter: ['text', 'json', 'html'],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
