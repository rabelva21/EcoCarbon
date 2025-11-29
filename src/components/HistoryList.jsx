// File: src/components/HistoryList.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function HistoryList({ keyTrigger }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [keyTrigger]); // Akan refresh jika keyTrigger berubah

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("footprints")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setHistory(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("footprints").delete().eq("id", id);
    if (!error) fetchData();
  };

  if (loading) return <p className="text-center text-gray-500">Memuat data...</p>;

  return (
    <div className="space-y-3">
      {history.length === 0 ? (
        <p className="text-gray-500 text-center text-sm">Belum ada aktivitas tercatat.</p>
      ) : (
        history.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 border border-gray-200 p-3 rounded-xl shadow-sm">
            <div>
              <p className="font-medium text-gray-800">{item.activity}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-700 font-bold">{item.emission} kg</span>
              <button 
                onClick={() => handleDelete(item.id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}