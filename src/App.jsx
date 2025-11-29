import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard' // Pastikan ini mengarah ke file yang benar

// Import CSS Wajib (Reset Margin)
import './components/index.css' 

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-emerald-500"></div>
      </div>
    )
  }

  // LOGIKA UTAMA
  if (!session) {
    return <Auth />
  } else {
    // Kita kirim 'session' ke Dashboard agar bisa dipakai
    return <Dashboard session={session} />
  }
}

export default App