import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { VitePWA } from 'vite-plugin-pwa'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import viteSeoPlugin from './vite-plugin-seo.js'

const basePath = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    viteSeoPlugin(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      avif: { quality: 80 }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      useFilenames: false,
      manifest: {
        name: 'EditAndKraft',
        short_name: 'EditAndKraft',
        description: 'Professional Web Design & Development Portfolio',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        scope: basePath,
        start_url: basePath,
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: false
      },
      strategies: 'generateSW'
    }),
  ],
  base: basePath,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    exclude: ['e2e/**', 'node_modules/**'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          const parts = id.split('node_modules/').pop().split('/');
          const pkg = parts[0].startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0];

          if (pkg === 'firebase') return 'firebase';
          if (pkg === 'framer-motion') return 'framer-motion';
          if (pkg === 'zustand') return 'zustand';
          if (pkg === 'react-helmet-async') return 'react-helmet';
          return 'vendor';
        }
      }
    }
  }
})
