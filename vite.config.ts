import { defineConfig } from 'vite';

// The site is served from https://<user>.github.io/Unity-of-Being/
export default defineConfig({
  base: '/Unity-of-Being/',
  build: { chunkSizeWarningLimit: 1500 },
});
