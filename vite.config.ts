import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { seoHtmlPlugin } from './vite-plugins/seo-html';

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHtmlPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
