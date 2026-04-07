import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import { VitePWA } from 'vite-plugin-pwa'
import viteSeoPlugin from './vite-plugin-seo.js'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    viteSeoPlugin(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      svg: { 
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'cleanupIds', active: false }
        ] 
      }
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
        scope: '/',
        start_url: '/',
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
  base: '/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-router') || id.includes('@remix-run')) return 'react-router';
            if (id.includes('react')) return 'react-core';
            return 'vendor';
          }
        }
      }
    }
  }
})
