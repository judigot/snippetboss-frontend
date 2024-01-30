/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  // <testConfig>
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // </testConfig>
  // <basepath>
  base: './', // Resolve asset paths after building
  // </basepath>
  plugins: [react(), tsconfigPaths()],
});
