import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function TrackerForm() {
  const [activity, setActivity] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activity || !amount) return alert("Isi semua field!");

    await supabase.from("footprints").insert({
      activity,
      amount,
      date: new Date().toISOString().split("T")[0],
    });

    setActivity("");
    setAmount("");

    window.dispatchEvent(new Event("dataUpdated"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Aktivitas (Contoh: Berkendara)"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Emisi (kg CO2)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Tambahkan</button>
    </form>
  );
}
