import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import seoPrerender from './vite-plugin-seo.js';

export default defineConfig({
  plugins: [tailwindcss(), react(), seoPrerender()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion') || id.includes('motion')) return 'animations';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('lucide-react')) return 'icons';
            return 'vendor';
          }
          // Feature chunks
          if (id.includes('pages/admin') || id.includes('components/admin')) return 'admin-shared';
          if (id.includes('components/layout/LiquidBackground')) return 'home-bg';
          if (id.includes('pages/Services') || id.includes('components/sections/Services')) return 'services';
        },
      },
    },
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
      },
      format: {
        comments: false,
      },
    },
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    sourcemap: false,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
