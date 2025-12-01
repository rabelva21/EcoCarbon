import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './components/index.css' 

// --- PERBAIKAN PENTING: GUNAKAN VIRTUAL REGISTER ---
// Jangan pakai navigator.serviceWorker.register manual!
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Konten baru tersedia. Refresh sekarang?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('Aplikasi siap bekerja offline')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)