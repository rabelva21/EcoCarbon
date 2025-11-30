import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      
      devOptions: {
        enabled: true 
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
            // PERBAIKAN 1: Hapus kata 'public/' dari src.
            // Gunakan nama file persis seperti di folder Anda (dengan spasi dan kurung)
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        
        // PERBAIKAN 2: Agar tidak White Screen saat offline
        navigateFallback: '/index.html',
        
        // PERBAIKAN 3: Agar tidak error "MIME type text/html"
        // Mencegah Service Worker mengganti file JS/Gambar yang error dengan index.html
        navigateFallbackDenylist: [
          /^\/api\//,           // Abaikan request API
          /\.[a-z]+$/           // Abaikan semua file yang punya ekstensi (.js, .css, .png, dll)
        ],

        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
    })
  ],
})