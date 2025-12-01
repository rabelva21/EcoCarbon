import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './components/index.css' 

// PERBAIKAN: Gunakan import dari virtual module vite-plugin-pwa
// Jangan register manual pakai navigator.serviceWorker.register
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // Munculkan popup konfirmasi jika ada update baru
    if (confirm('Konten baru tersedia. Refresh sekarang?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasi siap bekerja offline')
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)