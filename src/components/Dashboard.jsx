import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
// Pastikan library ini sudah diinstall: npm install framer-motion canvas-confetti
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// ==========================================
// 1. KOLEKSI ASET & IKON
// ==========================================
const Icons = {
  Leaf: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5v4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
  Tree: () => <svg className="w-10 h-10" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 3.5l6 10.5h-12l6-10.5z" opacity=".5"/><path d="M12 5l-7 12h14l-7-12zm0 14v3h-2v-3h2z"/></svg>,
  Fire: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
  Pencil: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  Info: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>,
};

// ==========================================
// 2. DATA & CONFIG & HELPERS
// ==========================================
const EMISSION_FACTORS = {
  "motor": { label: "Naik Motor", unit: "km", factor: 0.113 },
  "mobil": { label: "Naik Mobil (Bensin)", unit: "km", factor: 0.192 },
  "bus": { label: "Naik Bus Umum", unit: "km", factor: 0.089 },
  "listrik": { label: "Listrik Rumah", unit: "kWh", factor: 0.85 },
  "daging": { label: "Makan Daging Sapi", unit: "porsi", factor: 6.0 },
  "ayam": { label: "Makan Daging Ayam", unit: "porsi", factor: 1.2 },
  "plastik": { label: "Botol Plastik", unit: "pcs", factor: 0.08 },
  "manual": { label: "Input Manual (Custom)", unit: "kg", factor: 1 }
};

const pageVariants = { initial: { opacity: 0, y: 10 }, in: { opacity: 1, y: 0 }, out: { opacity: 0, y: -10 } };
const pageTransition = { type: "tween", ease: "anticipate", duration: 0.4 };

// Helper untuk filter tanggal
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const isThisMonth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

// ==========================================
// 3. SUB-COMPONENTS (HALAMAN & DETAIL)
// ==========================================

// --- HALAMAN 1: BERANDA (DASHBOARD) ---
const HomeView = ({ activities, activityType, setActivityType, inputValue, setInputValue, calculatedEmission, loading, handleSubmit, handleEdit, handleDelete, isEditing, cancelEdit, onViewDetail }) => {
  
  const stats = useMemo(() => {
    let daily = 0;
    let monthly = 0;
    let total = 0;

    activities.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      total += amount;
      if (isToday(item.created_at)) daily += amount;
      if (isThisMonth(item.created_at)) monthly += amount;
    });

    return { daily, monthly, total };
  }, [activities]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        
        {/* STATISTIK 3 GRID */}
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">📊 Statistik Emisi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-20"><Icons.Leaf /></div>
                    <p className="text-emerald-100 text-sm font-bold mb-1">Hari Ini</p>
                    <p className="text-3xl font-black">{stats.daily.toFixed(1)} <span className="text-sm font-normal opacity-80">kg</span></p>
                </div>
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-20"><Icons.Calendar /></div>
                    <p className="text-blue-100 text-sm font-bold mb-1">Bulan Ini</p>
                    <p className="text-3xl font-black">{stats.monthly.toFixed(1)} <span className="text-sm font-normal opacity-80">kg</span></p>
                </div>
                <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-20"><Icons.Fire /></div>
                    <p className="text-violet-100 text-sm font-bold mb-1">Total Sepanjang Masa</p>
                    <p className="text-3xl font-black">{stats.total.toFixed(1)} <span className="text-sm font-normal opacity-80">kg</span></p>
                </div>
            </div>
        </div>

        {/* LIST RIWAYAT (BISA DIKLIK KE DETAIL) */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">📝 Riwayat Aktivitas</h3>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white/60 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <p className="text-slate-500 font-medium">Belum ada data aktivitas.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
              {activities.map((item) => (
                // Tambahkan onClick untuk melihat detail
                <motion.div 
                    key={item.id} 
                    onClick={() => onViewDetail(item)}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="group relative flex justify-between items-center p-5 rounded-2xl bg-white/80 border border-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm"><Icons.Fire /></div>
                    <div>
                      <h4 className="font-bold text-lg text-slate-700">{item.activity}</h4>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-extrabold text-xl text-slate-700">{item.amount} <span className="text-sm font-normal text-slate-400">kg</span></span>
                    
                    {/* Tombol Aksi (Stop Propagation agar tidak memicu detail view saat diklik) */}
                    <div className="flex gap-1 pl-4 border-l border-slate-100 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-2 text-slate-400 hover:text-amber-500 rounded-lg"><Icons.Pencil /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 text-slate-400 hover:text-red-500 rounded-lg"><Icons.Trash /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* FORM INPUT */}
      <div className="lg:col-span-1 space-y-6">
        <div className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${isEditing ? 'bg-amber-50 border-amber-200' : 'bg-white border-white/50'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${isEditing ? 'text-amber-700' : 'text-slate-700'}`}>
              {isEditing ? '✏️ Edit Mode' : <><Icons.Calc /> Kalkulator Emisi</>}
            </h3>
            {isEditing && <button onClick={cancelEdit} className="text-xs font-bold bg-slate-200 px-3 py-1 rounded-full">Batal</button>}
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Pilih Aktivitas</label>
              <div className="relative">
                <select value={activityType} onChange={(e) => setActivityType(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none appearance-none font-bold text-slate-700 cursor-pointer">
                  {Object.keys(EMISSION_FACTORS).map((key) => <option key={key} value={key}>{EMISSION_FACTORS[key].label}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{activityType === 'manual' ? 'Jumlah Emisi (kg CO2)' : `Jarak / Jumlah (${EMISSION_FACTORS[activityType].unit})`}</label>
              <input type="number" placeholder="0" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none font-bold text-xl text-slate-800" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
            {!isEditing && activityType !== 'manual' && (
              <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center border border-emerald-100">
                <span className="text-sm font-bold text-emerald-600">Estimasi:</span>
                <span className="text-2xl font-black text-emerald-700">{calculatedEmission || 0} <span className="text-sm font-medium">kg CO₂</span></span>
              </div>
            )}
            <motion.button whileTap={{ scale: 0.95 }} disabled={!calculatedEmission || loading} className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition disabled:opacity-50 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-emerald-600'}`}>{loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambahkan"}</motion.button>
          </form>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-blue-50/50 border border-blue-100 p-6 rounded-3xl">
          <h4 className="font-bold text-blue-800 mb-2 text-sm flex items-center gap-2">💡 Tips Cepat</h4>
          <p className="text-xs text-blue-600 leading-relaxed">
            Ingin mengurangi emisi? Coba gunakan transportasi umum setidaknya 2x seminggu. Efeknya besar lho untuk bumi kita! 🌍
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- HALAMAN DETAIL AKTIVITAS (Syarat Tugas Akhir: Detail Page 1) ---
const ActivityDetailView = ({ activity, onBack }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
                <Icons.ArrowLeft /> Kembali
            </button>
            
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 scale-[2]"><Icons.Fire /></div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-2">Detail Aktivitas</p>
                    <h2 className="text-3xl font-bold">{activity.activity}</h2>
                    <p className="mt-2 opacity-80">{new Date(activity.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="p-8">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                            <p className="text-emerald-600 font-bold text-xs uppercase mb-1">Jumlah Emisi</p>
                            <p className="text-3xl font-black text-emerald-800">{activity.amount} <span className="text-sm font-normal">kg</span></p>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                            <p className="text-blue-600 font-bold text-xs uppercase mb-1">Dampak</p>
                            <p className="text-lg font-bold text-blue-800">{activity.amount > 5 ? "Tinggi ⚠️" : "Rendah ✅"}</p>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 mb-2">Analisis Lingkungan</h3>
                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                        Aktivitas ini menyumbang sebanyak <strong>{activity.amount} kg CO₂</strong> ke atmosfer. 
                        {activity.amount > 5 
                            ? " Angka ini cukup tinggi. Cobalah mencari alternatif yang lebih ramah lingkungan lain kali." 
                            : " Angka ini tergolong rendah. Terima kasih sudah menjaga bumi!"}
                    </p>
                    <div className="bg-slate-100 p-4 rounded-xl text-xs text-slate-500 font-mono">
                        ID Transaksi: {activity.id}<br/>
                        Waktu Input: {new Date(activity.created_at).toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- HALAMAN 2: HUTAN ---
const ForestView = ({ activities }) => {
  const safeActivities = activities || [];

  const monthlyEmission = useMemo(() => {
    try {
      return safeActivities
        .filter(item => item && item.created_at && isThisMonth(item.created_at))
        .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    } catch (err) {
      console.error("Error menghitung emisi:", err);
      return 0;
    }
  }, [safeActivities]);

  const maxTrees = 20;
  const treeCount = Math.max(1, maxTrees - Math.floor(monthlyEmission));
  const trees = Array.from({ length: treeCount });
  
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={{ initial: { opacity: 0 }, in: { opacity: 1 }, out: { opacity: 0 } }} transition={{ duration: 0.4 }} className="text-center">
      <div className="relative rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col justify-end border-4 border-white bg-slate-800">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop" alt="Forest Art Background" className="w-full h-full object-cover opacity-80"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"></div>
        </div>
        <div className="relative z-10 p-10 mb-auto mt-10">
            <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg filter shadow-black">🌲 Hutan Bulan Ini</h2>
            <p className="text-white text-lg font-medium drop-shadow-md">Emisi Bulan Ini: <span className="font-bold text-yellow-300">{monthlyEmission.toFixed(2)} kg</span></p>
            <p className="text-white/80 text-sm mt-1">Hutan akan kembali lebat (20 pohon) saat bulan berganti.</p>
        </div>
        <div className="relative z-10 px-10 pb-16 flex flex-wrap justify-center items-end gap-[-20px]">
          {trees.map((_, i) => (
            <motion.div key={i} initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }} className="text-emerald-300 w-20 h-20 sm:w-32 sm:h-32 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] -ml-4 hover:scale-110 transition-transform duration-300">
                <svg className="w-full h-full" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 3.5l6 10.5h-12l6-10.5z" opacity=".5"/><path d="M12 5l-7 12h14l-7-12zm0 14v3h-2v-3h2z"/></svg>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- HALAMAN 3: LEADERBOARD ---
const LeaderboardView = ({ session, onViewUser }) => {
  const [filter, setFilter] = useState('total'); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLB, setLoadingLB] = useState(false);

  useEffect(() => {
    const fetchGlobalLeaderboard = async () => {
      setLoadingLB(true);
      const { data, error } = await supabase.from("footprints").select("*");
      
      if (error) { console.error("Error fetching leaderboard:", error); setLoadingLB(false); return; }

      const groupedData = {};
      data.forEach(item => {
        const uid = item.user_id;
        const amount = parseFloat(item.amount) || 0;
        const displayName = item.user_name && item.user_name !== "Anonymous" ? item.user_name : "Anonymous";
        const displayAvatar = item.avatar_url ? item.avatar_url : null;

        if (!groupedData[uid]) {
          groupedData[uid] = { id: uid, name: displayName, avatar: displayAvatar, total: 0, daily: 0, monthly: 0 };
        }
        if (displayName !== "Anonymous") groupedData[uid].name = displayName;
        if (displayAvatar) groupedData[uid].avatar = displayAvatar;

        groupedData[uid].total += amount;
        if (isToday(item.created_at)) groupedData[uid].daily += amount;
        if (isThisMonth(item.created_at)) groupedData[uid].monthly += amount;
      });

      const result = Object.values(groupedData).map(u => ({
        id: u.id, name: u.name, avatar: u.avatar, score: u[filter], isMe: u.id === session.user.id
      }));

      result.sort((a, b) => a.score - b.score);
      setLeaderboardData(result);
      setLoadingLB(false);
    };
    fetchGlobalLeaderboard();
  }, [filter, session.user.id]);

  const rankColors = ["bg-yellow-100 border-yellow-300", "bg-gray-100 border-gray-300", "bg-orange-100 border-orange-300", "bg-white border-slate-100"];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl mb-8 text-center relative overflow-hidden">
        <h2 className="text-3xl font-extrabold mb-2 relative z-10">🏆 Peringkat Pahlawan</h2>
        <p className="text-violet-100 relative z-10 mb-6">Semakin rendah emisimu, semakin tinggi peringkatmu!</p>
        <div className="inline-flex bg-black/20 p-1 rounded-full relative z-10 backdrop-blur-sm">
            {['daily', 'monthly', 'total'].map((type) => (
                <button key={type} onClick={() => setFilter(type)} className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${filter === type ? 'bg-white text-indigo-600 shadow-md' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
                    {type === 'daily' ? 'Harian' : type === 'monthly' ? 'Bulanan' : 'Total'}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {loadingLB ? <div className="text-center py-10 text-slate-400">Memuat peringkat...</div> : 
         leaderboardData.length === 0 ? <div className="text-center py-10 text-slate-400">Belum ada data peringkat.</div> : 
         leaderboardData.map((user, index) => {
            const colorClass = rankColors[index] || rankColors[3]; 
            return (
            // Tambahkan onClick untuk melihat detail user lain
            <motion.div 
                layout key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => onViewUser(user)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 ${colorClass} shadow-sm cursor-pointer hover:scale-[1.02] transition-transform ${user.isMe ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}`}
            >
                <div className="flex items-center gap-4">
                <div className="font-black text-xl w-8 text-center text-slate-400">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}</div>
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-white overflow-hidden border-2 border-white shadow-sm">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-2xl">👤</span>}
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg text-slate-700">{user.name}</span>
                    {user.isMe && <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full w-fit">It's You!</span>}
                </div>
                </div>
                <div className="font-mono font-bold text-xl text-slate-700">{user.score.toFixed(2)} <span className="text-sm font-normal opacity-70">kg</span></div>
            </motion.div>
            )})
        }
      </div>
    </motion.div>
  );
};

// --- HALAMAN DETAIL USER (Syarat Tugas Akhir: Detail Page 2) ---
const UserDetailView = ({ user, onBack }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
                <Icons.ArrowLeft /> Kembali
            </button>
            
            <div className="bg-white rounded-[3rem] shadow-2xl p-10 text-center border border-slate-100">
                <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full mb-6 flex items-center justify-center overflow-hidden border-4 border-emerald-100 shadow-lg">
                    {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <span className="text-6xl">👤</span>}
                </div>
                <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold mt-2">Pejuang Lingkungan</span>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 font-bold uppercase">Total Emisi</p>
                        <p className="text-2xl font-black text-slate-800">{user.score.toFixed(1)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                        <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                        <p className="text-2xl font-black text-slate-800">{user.score < 10 ? "🌱" : "🪵"}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// --- HALAMAN 4: PROFIL ---
const ProfileView = ({ session, totalEmission }) => {
  const userMetadata = session.user.user_metadata || {};
  const [isEditMode, setIsEditMode] = useState(false);
  const [username, setUsername] = useState(userMetadata.user_name || userMetadata.full_name || 'Anonymous');
  const [avatarUrl, setAvatarUrl] = useState(userMetadata.avatar_url || null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (event) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) throw new Error('Pilih gambar dulu.');
      const file = event.target.files[0];
      const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`; 
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl); 
    } catch (error) { alert("Gagal upload: " + error.message); } finally { setUploading(false); }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error: authError } = await supabase.auth.updateUser({ data: { user_name: username, avatar_url: avatarUrl } });
    if (authError) { alert("Gagal update auth: " + authError.message); setLoading(false); return; }
    const { error: dbError } = await supabase.from('footprints').update({ user_name: username, avatar_url: avatarUrl }).eq('user_id', session.user.id);
    setLoading(false);
    if (dbError) { console.error("Gagal sinkronisasi:", dbError); alert("Profil terupdate tapi data lama mungkin belum berubah."); } 
    else { alert("Profil & Data berhasil diperbarui!"); setIsEditMode(false); window.location.reload(); }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-[3rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
        <div className="relative z-10 flex flex-col items-center mt-12">
          <div className="relative group">
            <div className="w-32 h-32 bg-white p-1 rounded-full shadow-lg mb-4 flex items-center justify-center overflow-hidden border-4 border-white">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" /> : <span className="text-5xl">😎</span>}
            </div>
            {isEditMode && (
              <label className="absolute bottom-4 right-0 bg-slate-800 text-white p-3 rounded-full cursor-pointer hover:bg-slate-700 shadow-md transition-all">
                {uploading ? <span className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Pencil />}
                <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
              </label>
            )}
          </div>
          {isEditMode ? (
            <form onSubmit={handleUpdateProfile} className="w-full max-w-sm mt-4 space-y-4">
              <div><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full text-center text-2xl font-bold px-4 py-3 border-2 rounded-2xl focus:border-emerald-500 bg-slate-50 mt-1" required /></div>
              <div className="flex justify-center gap-3 pt-2">
                <button type="submit" disabled={loading || uploading} className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition shadow-lg">{loading ? '...' : 'Simpan'}</button>
                <button type="button" onClick={() => setIsEditMode(false)} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-300 transition">Batal</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-3xl font-black text-slate-800 mt-2">{username}</h2>
              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mt-3 tracking-wide">Pahlawan Lingkungan</span>
              <button onClick={() => setIsEditMode(true)} className="mt-6 text-sm text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-full transition"><Icons.Pencil /> Edit Profil</button>
            </>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-12">
          <div className="bg-slate-50 p-6 rounded-3xl text-center border-2 border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Total Emisi</p>
            <p className="text-4xl font-black text-slate-800">{totalEmission} <span className="text-sm text-slate-500 font-medium">kg</span></p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl text-center border-2 border-slate-100">
            <p className="text-slate-400 text-xs font-bold uppercase mb-2">Email</p>
            <p className="text-sm font-bold text-slate-700 break-all">{session.user.email}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- HALAMAN 5: TENTANG APLIKASI (About) ---
const AboutView = () => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 border border-slate-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-emerald-200">
                <Icons.Leaf />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">EcoCarbon</h2>
            <p className="text-slate-500 font-medium">Versi 1.0.0 (Tugas Akhir PWA)</p>
            
            <div className="mt-8 text-left space-y-4">
                <div className="bg-slate-50 p-5 rounded-2xl">
                    <h3 className="font-bold text-slate-800 mb-2">Tentang Aplikasi</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        EcoCarbon adalah aplikasi pelacak jejak karbon pribadi berbasis Progressive Web Apps (PWA). 
                        Aplikasi ini membantu pengguna menghitung, memantau, dan mengurangi emisi karbon harian mereka 
                        melalui gamifikasi hutan virtual dan kompetisi peringkat.
                    </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl">
                    <h3 className="font-bold text-slate-800 mb-2">Pengembang</h3>
                    <p className="text-sm text-slate-600">
                        Nama: <strong>Rabelva Evan Ligar (NIM: 21120123140161)</strong><br/>
                        Teknologi: React, Vite, Tailwind CSS, Supabase
                    </p>
                </div>
            </div>
            
            <p className="mt-10 text-xs text-slate-400">© 2025 EcoCarbon Project</p>
        </div>
    </motion.div>
);

// ==========================================
// 4. MAIN CONTROLLER (DASHBOARD)
// ==========================================
export default function Dashboard({ session }) {
  const [currentPage, setCurrentPage] = useState("home");
  // State untuk Detail Views
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [activities, setActivities] = useState([]);
  const [totalEmission, setTotalEmission] = useState(0);
  const [activityType, setActivityType] = useState("motor");
  const [inputValue, setInputValue] = useState("");
  const [calculatedEmission, setCalculatedEmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (inputValue && activityType) setCalculatedEmission((parseFloat(inputValue) * EMISSION_FACTORS[activityType].factor).toFixed(2));
    else setCalculatedEmission("");
  }, [inputValue, activityType]);

  const fetchActivities = async () => {
    const { data, error } = await supabase.from("footprints").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (!error) {
      setActivities(data);
      setTotalEmission(data.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toFixed(2));
    }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!calculatedEmission) return;
    setLoading(true);
    const finalActivityName = activityType === 'manual' ? "Aktivitas Manual" : `${EMISSION_FACTORS[activityType].label} (${inputValue} ${EMISSION_FACTORS[activityType].unit})`;
    const metadata = session.user.user_metadata || {};
    const userName = metadata.user_name || metadata.full_name || 'Anonymous';
    const avatarUrl = metadata.avatar_url || null;

    if (isEditing) {
      const { error } = await supabase.from("footprints").update({ 
        activity: finalActivityName, amount: parseFloat(calculatedEmission), user_name: userName, avatar_url: avatarUrl
      }).eq("id", editId);
      if (!error) { cancelEdit(); fetchActivities(); }
    } else {
      const { error } = await supabase.from("footprints").insert({ 
        user_id: session.user.id, activity: finalActivityName, amount: parseFloat(calculatedEmission), date: new Date().toISOString(), user_name: userName, avatar_url: avatarUrl
      });
      if (!error) { setInputValue(""); setCalculatedEmission(""); fetchActivities(); confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Hapus data ini?")) return;
    const { error } = await supabase.from("footprints").delete().eq("id", id);
    if (!error) fetchActivities();
  };

  const handleEdit = (item) => {
    setIsEditing(true); setEditId(item.id); setActivityType("manual"); setInputValue(item.amount); setCalculatedEmission(item.amount); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setIsEditing(false); setEditId(null); setInputValue(""); setCalculatedEmission(""); setActivityType("motor"); };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  // Handlers untuk Navigasi Detail
  const handleViewActivity = (item) => { setSelectedActivity(item); setCurrentPage('activity-detail'); };
  const handleViewUser = (user) => { setSelectedUser(user); setCurrentPage('user-detail'); };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans text-slate-800 pb-20 overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <motion.div animate={{ x: [0, 20, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-[120px]"></motion.div>
         <motion.div animate={{ x: [0, -30, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[150px]"></motion.div>
      </div>

      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/30"><Icons.Leaf /></div>
            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">EcoCarbon</span>
          </div>
          <div className="flex bg-slate-100/50 p-1 rounded-full border border-white/50 overflow-x-auto max-w-full no-scrollbar">
            {[{ id: 'home', label: 'Beranda' }, { id: 'forest', label: 'Hutan' }, { id: 'leaderboard', label: 'Peringkat' }, { id: 'profile', label: 'Profil' }, { id: 'about', label: 'Tentang' }]
            .map(menu => (<button key={menu.id} onClick={() => setCurrentPage(menu.id)} className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${currentPage === menu.id ? 'bg-white text-emerald-600 shadow-sm scale-105' : 'text-slate-500 hover:text-slate-800'}`}>{menu.label}</button>))}
          </div>
          <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-full transition-all"><Icons.LogOut /> Keluar</button>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 mt-10">
        <AnimatePresence mode="wait">
          {/* Main Pages */}
          {currentPage === "home" && <HomeView key="home" activities={activities} totalEmission={totalEmission} activityType={activityType} setActivityType={setActivityType} inputValue={inputValue} setInputValue={setInputValue} calculatedEmission={calculatedEmission} loading={loading} handleSubmit={handleSubmit} handleEdit={handleEdit} handleDelete={handleDelete} isEditing={isEditing} cancelEdit={cancelEdit} onViewDetail={handleViewActivity} />}
          {currentPage === "forest" && <ForestView key="forest" activities={activities} />}
          {currentPage === "leaderboard" && <LeaderboardView key="leaderboard" session={session} onViewUser={handleViewUser} />}
          {currentPage === "profile" && <ProfileView key="profile" session={session} totalEmission={totalEmission} />}
          {currentPage === "about" && <AboutView key="about" />}

          {/* Detail Pages (Hidden from Nav) */}
          {currentPage === "activity-detail" && selectedActivity && <ActivityDetailView key="detail-act" activity={selectedActivity} onBack={() => setCurrentPage('home')} />}
          {currentPage === "user-detail" && selectedUser && <UserDetailView key="detail-user" user={selectedUser} onBack={() => setCurrentPage('leaderboard')} />}
        </AnimatePresence>
      </main>
    </div>
  );
}