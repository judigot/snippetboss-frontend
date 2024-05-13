/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig({
  server: {port: 3000},
  // <testConfig>
  test: {
    globals: true,
    environment: 'jsdom',
  },
  // </testConfig>
  // <basepath>
  base: './', // Resolve asset paths after building
  // </basepath>
  plugins: [react(), tsconfigPaths(), TanStackRouterVite()],
});
