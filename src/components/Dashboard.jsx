import { useEffect, useState, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

// --- ASET IKON (SAMA SEPERTI SEBELUMNYA) ---
const Icons = {
  Leaf: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5v4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
  Tree: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>,
  TreeSolid: () => <svg className="w-10 h-10" fill="currentColor" stroke="none" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 3.5l6 10.5h-12l6-10.5z" opacity=".5"/><path d="M12 5l-7 12h14l-7-12zm0 14v3h-2v-3h2z"/></svg>,
  Fire: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>,
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>,
  Check: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
  Pencil: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>,
  LogOut: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
  Calc: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>,
  Info: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>,
  Trophy: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5v4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
  User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
};

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

const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};
const isThisMonth = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

// --- SUB COMPONENTS ---
const HomeView = ({ activities, activityType, setActivityType, inputValue, setInputValue, calculatedEmission, loading, handleSubmit, handleEdit, handleDelete, isEditing, cancelEdit, onViewDetail }) => {
  const stats = useMemo(() => {
    let daily = 0; let monthly = 0; let total = 0;
    activities.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      total += amount;
      if (isToday(item.created_at)) daily += amount;
      if (isThisMonth(item.created_at)) monthly += amount;
    });
    return { daily, monthly, total };
  }, [activities]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-24">
      <div className="lg:col-span-2 space-y-8">
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
                    <p className="text-violet-100 text-sm font-bold mb-1">Total</p>
                    <p className="text-3xl font-black">{stats.total.toFixed(1)} <span className="text-sm font-normal opacity-80">kg</span></p>
                </div>
            </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">📝 Riwayat Aktivitas</h3>
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white/60 border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center">
              <p className="text-slate-500 font-medium">Belum ada data aktivitas.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              <AnimatePresence>
              {activities.map((item) => (
                <motion.div 
                    key={item.id} 
                    onClick={() => onViewDetail(item)}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, height: 0 }} 
                    className="group relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-white/80 border border-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm shrink-0"><Icons.Fire /></div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-lg text-slate-700 truncate">{item.activity}</h4>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4 pl-0 sm:pl-4 sm:border-l border-slate-100">
                    <span className="font-extrabold text-xl text-slate-700">{item.amount} <span className="text-sm font-normal text-slate-400">kg</span></span>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(item); }} className="p-2 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-xl transition-colors"><Icons.Pencil /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-colors"><Icons.Trash /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className={`p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500 ${isEditing ? 'bg-amber-50 border-amber-200' : 'bg-white border-white/50'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold flex items-center gap-2 ${isEditing ? 'text-amber-700' : 'text-slate-700'}`}>
              {isEditing ? '✏️ Edit Mode' : <><Icons.Calc /> Kalkulator</>}
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
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{activityType === 'manual' ? 'Emisi (kg)' : `Jumlah (${EMISSION_FACTORS[activityType].unit})`}</label>
              <input type="number" placeholder="0" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-emerald-400 outline-none font-bold text-xl text-slate-800" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
            </div>
            <motion.button whileTap={{ scale: 0.95 }} disabled={!calculatedEmission || loading} className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition disabled:opacity-50 ${isEditing ? 'bg-amber-500 hover:bg-amber-600' : 'bg-slate-900 hover:bg-emerald-600'}`}>{loading ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambahkan"}</motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

const ActivityDetailView = ({ activity, onBack }) => {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-2xl mx-auto pb-24">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
                <Icons.ArrowLeft /> Kembali
            </button>
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 scale-[2]"><Icons.Fire /></div>
                    <p className="text-slate-400 font-bold uppercase text-xs mb-2">Detail Aktivitas</p>
                    <h2 className="text-3xl font-bold">{activity.activity}</h2>
                    <p className="mt-2 opacity-80 text-sm">{new Date(activity.created_at).toLocaleDateString()}</p>
                </div>
                <div className="p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-emerald-50 p-4 rounded-2xl text-center"><p className="text-xs font-bold text-emerald-600 mb-1">Emisi</p><p className="text-2xl font-black text-emerald-800">{activity.amount} kg</p></div>
                        <div className="bg-blue-50 p-4 rounded-2xl text-center"><p className="text-xs font-bold text-blue-600 mb-1">Dampak</p><p className="text-lg font-bold text-blue-800">{activity.amount > 5 ? "Tinggi ⚠️" : "Rendah ✅"}</p></div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">Aktivitas ini menyumbang <strong>{activity.amount} kg CO₂</strong>. {activity.amount > 5 ? "Kurangi frekuensinya ya!" : "Bagus, pertahankan!"}</p>
                </div>
            </div>
        </motion.div>
    )
}

const ForestView = ({ activities }) => {
  const monthlyEmission = useMemo(() => {
    try {
      return (activities || []).filter(item => item && item.created_at && isThisMonth(item.created_at)).reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    } catch (err) { return 0; }
  }, [activities]);
  const treeCount = Math.max(1, 20 - Math.floor(monthlyEmission));
  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="text-center pb-32">
      <div className="relative rounded-[3rem] shadow-2xl overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col justify-end border-4 border-white bg-slate-800">
        <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2670&auto=format&fit=crop" alt="Forest Art" className="w-full h-full object-cover opacity-80"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-slate-800"></div>
        </div>
        <div className="relative z-10 p-8 mb-auto mt-10">
            <h2 className="text-3xl font-extrabold text-white mb-2">🌲 Hutan Bulan Ini</h2>
            <p className="text-white text-lg font-medium">Emisi: <span className="font-bold text-yellow-300">{monthlyEmission.toFixed(2)} kg</span></p>
        </div>
        <div className="relative z-10 px-6 pb-12 flex flex-wrap justify-center items-end gap-[-10px]">
          {Array.from({ length: treeCount }).map((_, i) => (
            <motion.div key={i} initial={{ scale: 0, y: 100 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="text-emerald-400 w-16 h-16"><Icons.TreeSolid /></motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const LeaderboardView = ({ session, onViewUser }) => {
  const [filter, setFilter] = useState('total'); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loadingLB, setLoadingLB] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoadingLB(true);
      const { data } = await supabase.from("footprints").select("*");
      if (data) {
        const grouped = {};
        data.forEach(item => {
          const uid = item.user_id;
          const val = parseFloat(item.amount) || 0;
          if (!grouped[uid]) grouped[uid] = { id: uid, name: item.user_name || "Anonymous", avatar: item.avatar_url, total: 0, daily: 0, monthly: 0 };
          if (item.user_name && item.user_name !== "Anonymous") grouped[uid].name = item.user_name;
          if (item.avatar_url) grouped[uid].avatar = item.avatar_url;
          grouped[uid].total += val;
          if (isToday(item.created_at)) grouped[uid].daily += val;
          if (isThisMonth(item.created_at)) grouped[uid].monthly += val;
        });
        setLeaderboardData(Object.values(grouped).map(u => ({ ...u, score: u[filter], monthly: u.monthly, total: u.total, isMe: u.id === session.user.id })).sort((a, b) => a.score - b.score));
      }
      setLoadingLB(false);
    };
    fetch();
  }, [filter, session.user.id]);

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="max-w-3xl mx-auto pb-24">
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl mb-6 text-center">
        <h2 className="text-2xl font-extrabold mb-4">🏆 Peringkat</h2>
        <div className="inline-flex bg-black/20 p-1 rounded-full">{['daily', 'monthly', 'total'].map(t => <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-full text-xs font-bold ${filter === t ? 'bg-white text-indigo-600' : 'text-white/70'}`}>{t}</button>)}</div>
      </div>
      <div className="space-y-3">
        {loadingLB ? <p className="text-center text-slate-400">Loading...</p> : leaderboardData.map((user, idx) => (
            <div key={user.id} onClick={() => onViewUser(user)} className={`flex items-center justify-between p-4 rounded-2xl border-2 ${idx < 3 ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-slate-100'} cursor-pointer hover:scale-[1.01] transition-transform`}>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <span className="flex items-center justify-center h-full">👤</span>}</div>
                    <div><p className="font-bold text-sm text-slate-700 truncate max-w-[120px]">{user.name}</p>{user.isMe && <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 rounded-full">You</span>}</div>
                </div>
                <span className="font-mono font-bold text-lg text-slate-700">{user.score.toFixed(1)}</span>
            </div>
        ))}
      </div>
    </motion.div>
  );
};

const UserDetailView = ({ user, onBack }) => (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-md mx-auto pb-32">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold mb-6"><Icons.ArrowLeft /> Kembali</button>
        <div className="bg-white rounded-[3rem] shadow-xl p-8 text-center border border-slate-100">
            <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full mb-4 overflow-hidden">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <span className="text-4xl leading-[6rem]">👤</span>}</div>
            <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100 text-left">
                <p>Halo! <strong>{user.name}</strong> adalah salah satu pahlawan bumi.</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                    <li>Emisi Bulan Ini: <strong className="text-emerald-600">{user.monthly?.toFixed(2) || 0} kg</strong></li>
                    <li>Total Kontribusi: <strong className="text-indigo-600">{user.total?.toFixed(2) || 0} kg</strong></li>
                </ul>
            </div>
        </div>
    </motion.div>
);

const ProfileView = ({ session, totalEmission, onLogout }) => {
  const [username, setUsername] = useState(session.user.user_metadata.user_name || 'Anonymous');
  const [avatarUrl, setAvatarUrl] = useState(session.user.user_metadata.avatar_url || null);
  const [isEdit, setIsEdit] = useState(false); const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // TAMBAHAN: State uploading untuk foto
  const joinDate = new Date(session.user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // --- FITUR UPLOAD FOTO (KEMBALI ADA) ---
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

  const handleSave = async (e) => {
    e.preventDefault(); setLoading(true);
    await supabase.auth.updateUser({ data: { user_name: username, avatar_url: avatarUrl } });
    await supabase.from('footprints').update({ user_name: username, avatar_url: avatarUrl }).eq('user_id', session.user.id);
    setLoading(false); setIsEdit(false); alert("Profil diperbarui!"); window.location.reload();
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="max-w-2xl mx-auto pb-32">
      <div className="bg-white rounded-[3rem] shadow-xl p-6 md:p-8 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
        <div className="relative z-10 mt-8">
            <div className="relative group mx-auto w-28">
                <div className="w-28 h-28 bg-white p-1 rounded-full shadow-lg mb-4 overflow-hidden border-4 border-white">
                    {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover rounded-full"/> : <span className="text-5xl leading-[6rem]">😎</span>}
                </div>
                {/* TOMBOL UPLOAD (KEMBALI ADA) */}
                {isEdit && (
                  <label className="absolute bottom-4 right-0 bg-slate-800 text-white p-3 rounded-full cursor-pointer hover:bg-slate-700 shadow-md transition-all">
                    {uploading ? <span className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <Icons.Pencil />}
                    <input type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} className="hidden" />
                  </label>
                )}
            </div>

            {isEdit ? <form onSubmit={handleSave} className="flex gap-2 justify-center mt-4"><input value={username} onChange={e=>setUsername(e.target.value)} className="border p-2 rounded-lg"/><button disabled={loading} className="bg-emerald-500 text-white p-2 rounded-lg">Save</button></form> 
            : <><h2 className="text-2xl font-black">{username}</h2><button onClick={() => setIsEdit(true)} className="text-xs text-blue-500 font-bold mt-1">Edit Profil</button></>}
        </div>
        
        <div className="mt-8 space-y-3 text-left">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">📊 Ringkasan</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Halo <strong>{username}</strong>! Kamu bergabung sejak <strong>{joinDate}</strong>. 
                    Total jejak karbon yang tercatat adalah <span className="font-bold text-emerald-600">{totalEmission} kg</span>.
                </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl"><p className="text-xs font-bold text-slate-400 uppercase">Email</p><p className="text-sm font-bold truncate">{session.user.email}</p></div>
        </div>
        <button onClick={onLogout} className="mt-8 w-full bg-red-50 text-red-500 font-bold py-3 rounded-2xl flex justify-center gap-2"><Icons.LogOut /> Keluar</button>
      </div>
    </motion.div>
  );
};

const AboutView = () => (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} className="max-w-2xl mx-auto pb-32 text-center">
        <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-slate-100">
            <h2 className="text-2xl font-black mb-2">EcoCarbon</h2>
            <p className="text-slate-500 text-sm mb-6">Aplikasi Jejak Karbon PWA</p>
            <div className="text-left bg-slate-50 p-5 rounded-2xl text-sm text-slate-600">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-4">
                    <h3 className="font-bold text-slate-800 mb-2">Tentang Aplikasi</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        EcoCarbon adalah aplikasi pelacak jejak karbon pribadi berbasis Progressive Web Apps (PWA). 
                        Aplikasi ini membantu pengguna menghitung, memantau, dan mengurangi emisi karbon harian mereka 
                        melalui gamifikasi hutan virtual dan kompetisi peringkat.
                    </p>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-2">Pengembang</h3>
                    <p className="text-sm text-slate-600">
                        Nama: <strong>Rabelva Evan Ligar (21120123140161)</strong><br/>
                        Teknologi: React, Vite, Tailwind CSS, Supabase
                    </p>
                </div>
            </div>
            <p className="mt-10 text-xs text-slate-400">© 2025 EcoCarbon Project</p>
        </div>
    </motion.div>
);

// ==========================================
// 4. MAIN CONTROLLER
// ==========================================
export default function Dashboard({ session }) {
  const [currentPage, setCurrentPage] = useState("home");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // DETEKSI MOBILE UNTUK TAMPILAN NAVBAR
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Cek saat pertama load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => { window.removeEventListener('online', handleStatus); window.removeEventListener('offline', handleStatus); };
  }, []);

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
    if (inputValue && activityType) setCalculatedEmission((parseFloat(inputValue) * EMISSION_FACTORS[activityType].factor).toFixed(2)); else setCalculatedEmission("");
  }, [inputValue, activityType]);

  const fetchActivities = async () => {
    const { data } = await supabase.from("footprints").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (data) { setActivities(data); setTotalEmission(data.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0).toFixed(2)); }
  };
  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!calculatedEmission) return; setLoading(true);
    const activityName = activityType === 'manual' ? "Manual" : `${EMISSION_FACTORS[activityType].label} (${inputValue} ${EMISSION_FACTORS[activityType].unit})`;
    const payload = { user_id: session.user.id, activity: activityName, amount: parseFloat(calculatedEmission), date: new Date().toISOString(), user_name: session.user.user_metadata.user_name || 'Anonymous', avatar_url: session.user.user_metadata.avatar_url };
    
    if (isEditing) await supabase.from("footprints").update(payload).eq("id", editId);
    else await supabase.from("footprints").insert(payload);
    
    setLoading(false); setInputValue(""); setCalculatedEmission(""); setIsEditing(false); fetchActivities();
    if (!isEditing) confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleDelete = async (id) => { if(window.confirm("Hapus?")) { await supabase.from("footprints").delete().eq("id", id); fetchActivities(); } };
  const handleEdit = (item) => { setIsEditing(true); setEditId(item.id); setActivityType("manual"); setInputValue(item.amount); setCalculatedEmission(item.amount); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const cancelEdit = () => { setIsEditing(false); setEditId(null); setInputValue(""); };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const handleViewActivity = (item) => { setSelectedActivity(item); setCurrentPage('activity-detail'); };
  const handleViewUser = (user) => { setSelectedUser(user); setCurrentPage('user-detail'); };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-0 overflow-x-hidden">
      {isOffline && <div className="bg-red-500 text-white text-center text-xs font-bold py-2 fixed top-0 w-full z-[100]">📡 Offline Mode</div>}
      
      {/* HEADER DESKTOP */}
      {!isMobile && (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-black text-xl text-emerald-600"><Icons.Leaf /> EcoCarbon</div>
            <div className="flex gap-2">
                {['home', 'forest', 'leaderboard', 'profile', 'about'].map(id => (
                    <button key={id} onClick={() => setCurrentPage(id)} className={`px-4 py-1 rounded-full text-sm font-bold capitalize ${currentPage === id ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500'}`}>{id}</button>
                ))}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-full transition-all"><Icons.LogOut /> Keluar</button>
        </nav>
      )}

      {/* MOBILE HEADER */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 font-extrabold text-lg text-emerald-600"><Icons.Leaf /> EcoCarbon</div>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {currentPage === "home" && <HomeView key="home" activities={activities} totalEmission={totalEmission} activityType={activityType} setActivityType={setActivityType} inputValue={inputValue} setInputValue={setInputValue} calculatedEmission={calculatedEmission} loading={loading} handleSubmit={handleSubmit} handleEdit={handleEdit} handleDelete={handleDelete} isEditing={isEditing} cancelEdit={cancelEdit} onViewDetail={handleViewActivity} />}
          {currentPage === "forest" && <ForestView key="forest" activities={activities} />}
          {currentPage === "leaderboard" && <LeaderboardView key="leaderboard" session={session} onViewUser={handleViewUser} />}
          {currentPage === "profile" && <ProfileView key="profile" session={session} totalEmission={totalEmission} onLogout={handleLogout} />}
          {currentPage === "about" && <AboutView key="about" />}
          {currentPage === "activity-detail" && selectedActivity && <ActivityDetailView key="detail-act" activity={selectedActivity} onBack={() => setCurrentPage('home')} />}
          {currentPage === "user-detail" && selectedUser && <UserDetailView key="detail-user" user={selectedUser} onBack={() => setCurrentPage('leaderboard')} />}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAV BAR (FULL WIDTH - MENEMPEL DI BAWAH) */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 z-[9999]">
            <div className="flex justify-around items-center h-16 pb-1"> 
                {[
                { id: 'home', label: 'Home', icon: Icons.Leaf },
                { id: 'forest', label: 'Hutan', icon: Icons.Tree },
                { id: 'leaderboard', label: 'Top', icon: Icons.Fire },
                { id: 'profile', label: 'Profil', icon: Icons.User },
                { id: 'about', label: 'Info', icon: Icons.Info }
                ].map((menu) => {
                    const isActive = currentPage === menu.id;
                    return (
                    <button 
                        key={menu.id} 
                        onClick={() => setCurrentPage(menu.id)} 
                        className="relative flex flex-col items-center justify-center w-full h-full"
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="nav-bg" 
                                className="absolute inset-0 bg-emerald-50 rounded-lg -z-10 mx-1 mb-1" 
                                initial={false} 
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <div className={`transition-all duration-300 ${isActive ? 'text-emerald-600 -translate-y-0.5' : 'text-slate-400'}`}>
                            <menu.icon />
                        </div>
                        {isActive && <span className="text-[10px] font-bold text-emerald-700 mt-0.5">{menu.label}</span>}
                    </button>
                )})}
            </div>
        </div>
      )}

    </div>
  );
}