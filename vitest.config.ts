import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, '.'),
      '@/components': path.resolve(dirname, './components'),
      '@/lib': path.resolve(dirname, './lib'),
      '@/data': path.resolve(dirname, './data'),
      '@/app': path.resolve(dirname, './app'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      // Add a separate project for unit tests
      {
        resolve: {
          alias: {
            '@': path.resolve(dirname, '.'),
            '@/components': path.resolve(dirname, './components'),
            '@/lib': path.resolve(dirname, './lib'),
            '@/data': path.resolve(dirname, './data'),
            '@/app': path.resolve(dirname, './app'),
          },
        },
        test: {
          name: 'unit',
          include: ['**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
});
