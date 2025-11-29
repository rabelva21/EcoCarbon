import { useState } from "react";
import { supabase } from "../supabaseClient";

// Ikon
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500">
    <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
    <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
  </svg>
);
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-teal-500">
    <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
  </svg>
);

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // --- PERBAIKAN DI SINI: FUNGSI GANTI MODE & RESET ---
  const switchMode = () => {
    setIsRegistering(!isRegistering); // Balik status (Login <-> Daftar)
    setEmail("");     // Hapus Email
    setPassword("");  // Hapus Password
  };
  // ----------------------------------------------------

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isRegistering) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        // Jika verifikasi email di Supabase SUDAH DIMATIKAN, user bisa langsung login
        // Jika BELUM, akan muncul alert suruh cek email
        alert("Pendaftaran berhasil! Mencoba login otomatis...");
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError && !loginError.message.includes("Email not confirmed")) {
           alert("Silakan login manual.");
           switchMode(); 
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div 
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        width: '100vw', height: '100vh',
        backgroundColor: '#f8fafc',
        margin: 0, padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, overflow: 'hidden'
      }}
    >
      {/* Background Animasi */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-green-200/60 rounded-full blur-[150px] mix-blend-multiply animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-teal-200/60 rounded-full blur-[150px] mix-blend-multiply"></div>
      
      <div className="relative z-10 w-full max-w-[400px] m-4">
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 sm:p-10 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.12)]">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2 flex justify-center items-center gap-2">
              <span className="text-3xl filter drop-shadow-sm">🌱</span> EcoCarbon
            </h1>
            <p className="text-gray-500 font-medium tracking-wide">
              {isRegistering ? "Mulai langkah hijaumu hari ini" : "Selamat datang kembali"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-700 ml-4 uppercase tracking-wider">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-teal-600">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/80 border border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-teal-700 ml-4 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-teal-600">
                  <LockIcon />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50/80 border border-gray-200 text-gray-800 placeholder-gray-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all font-medium font-mono tracking-widest"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/20 
                         hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.98] 
                         disabled:opacity-70 transition-all duration-300 mt-8"
            >
              {loading ? "Memproses..." : (isRegistering ? "Daftar Akun" : "Masuk")}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-gray-500">
            {isRegistering ? "Sudah punya akun?" : "Belum punya akun?"}
            <button
              onClick={switchMode} // <-- MEMANGGIL FUNGSI RESET DI SINI
              className="ml-2 font-bold text-teal-600 hover:text-teal-800 transition-colors underline decoration-2 underline-offset-4"
            >
              {isRegistering ? "Login" : "Daftar"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}