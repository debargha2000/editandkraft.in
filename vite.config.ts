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
    // Optimize chunk splitting for faster page loads
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Increase chunk warning limit slightly for vendor chunks
    chunkSizeWarningLimit: 600,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
