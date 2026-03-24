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
  base: '/editandkraft.in/',
  build: {
    base: '/editandkraft.in/',
    target: 'es2020',
    assetsInlineLimit: 4096,
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-router')) return 'react-router';
            return 'vendor';
          }
        }
      }
    }
  }
})
