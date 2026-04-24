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
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lenis')) return 'vendor-lenis';
            // Consolidate react and other common dependencies to prevent circular chunks
            return 'vendor-react';
          }
          // Feature chunks
          if (id.includes('pages/admin')) return 'admin';
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
