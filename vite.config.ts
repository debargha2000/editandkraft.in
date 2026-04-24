import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import seoPrerender from './vite-plugin-seo.js';

export default defineConfig({
  plugins: [react(), seoPrerender()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Feature chunks
          if (id.includes('pages/admin') || id.includes('components/admin')) return 'admin-shared';
          if (id.includes('components/layout/LiquidBackground')) return 'home-bg';
          if (id.includes('services')) return 'services';
        },
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    reportCompressedSize: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
