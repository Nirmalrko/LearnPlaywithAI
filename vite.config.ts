import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base: './' lets the build run from any sub-path (e.g. GitHub Pages /repo-name/).
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  test: { environment: 'node' },
});
