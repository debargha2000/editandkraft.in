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
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,avif}']
      }
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
