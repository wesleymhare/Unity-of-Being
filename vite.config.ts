import { defineConfig } from 'vite';

// The site is served from https://<user>.github.io/unity-of-being/
export default defineConfig({
  base: '/unity-of-being/',
  build: { chunkSizeWarningLimit: 1500 },
});
