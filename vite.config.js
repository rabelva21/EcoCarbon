import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Ini memastikan service worker otomatis terupdate
      registerType: 'autoUpdate', 
      
      // Nama file manifest yang akan di-generate oleh Vite
      filename: 'manifest.webmanifest',

      manifest: {
        name: 'EcoCarbon - Jejak Karbon',
        short_name: 'EcoCarbon',
        description: 'Aplikasi pelacak jejak karbon harian',
        theme_color: '#10b981', // Warna utama aplikasi (hijau emerald)
        background_color: '#f8fafc', // Warna latar belakang saat loading
        display: 'standalone', // Tampilan seperti aplikasi (menghilangkan address bar browser)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      
      // Konfigurasi Workbox (caching files)
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        // Opsional: Strategi caching untuk API/gambar eksternal
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://images.unsplash.com', // Gambar hutan
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 }, // Cache 1 hari
            },
          },
        ],
      },
    })
  ],
})