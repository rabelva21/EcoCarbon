import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      
      // PENTING: Ini akan auto-generate service worker
      // Jangan pakai sw.js manual lagi!
      devOptions: {
        enabled: true // Enable di development mode untuk testing
      },

      manifest: {
        name: 'EcoCarbon - Jejak Karbon',
        short_name: 'EcoCarbon',
        description: 'Aplikasi pelacak jejak karbon harian',
        theme_color: '#10b981',
        background_color: '#f8fafc',
        display: 'standalone',
        icons: [
          {
            src: '/pwa-192x192.png', // PERBAIKAN: Tambah / di depan
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable' // Support untuk Android adaptive icons
          },
          {
            src: '/pwa-512x512.png', // PERBAIKAN: Tambah / di depan
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      workbox: {
        // Cache semua assets yang di-build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        
        // Tambah file yang perlu di-precache
        additionalManifestEntries: [
          { url: '/', revision: null },
          { url: '/index.html', revision: null }
        ],
        
        // Runtime caching untuk external resources
        runtimeCaching: [
          {
            // Cache Unsplash images
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 hari
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache Supabase API calls
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 menit
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          },
          {
            // Cache Google Fonts files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 tahun
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ],
        
        // Cleanup old caches
        cleanupOutdatedCaches: true,
        
        // Skip waiting untuk update langsung
        skipWaiting: true,
        clientsClaim: true
      }
    })
  ],
  
  // Build optimization
  build: {
    outDir: 'dist',
    sourcemap: false, // Set true jika butuh debugging
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase-vendor': ['@supabase/supabase-js']
        }
      }
    }
  }
})