import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskForm.css";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [status, setStatus] = useState("Belum Dimulai");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !assignee) return;

    const newTask = {
      title,
      description: "",
      assignee,
      start_date: startDate ? startDate.toISOString().split("T")[0] : null,
      due_date: endDate ? endDate.toISOString().split("T")[0] : null,
    };

    try {
      setLoading(true);

      // POST ke backend
      const res = await fetch("http://localhost:8000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!res.ok) throw new Error("Gagal menambahkan tugas");

      const createdTask = await res.json();
      console.log("✅ Task tersimpan:", createdTask);

      // Langsung ambil ulang list tugas biar sinkron
      const getRes = await fetch("http://localhost:8000/tasks");
      const latestTasks = await getRes.json();

      // Kirim hasil ke Dashboard biar langsung update UI
      if (onCreate) onCreate(latestTasks);

      // Reset form
      setTitle("");
      setAssignee("");
      setStartDate(null);
      setEndDate(null);
      setStatus("Belum Dimulai");
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal menambahkan tugas. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Nama Tugas</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan nama tugas"
          required
        />
      </div>

      <div className="form-group">
        <label>Kepada Anggota Tim</label>
        <input
          type="text"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          placeholder="Masukkan nama anggota tim"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group half">
          <label>Tanggal Mulai</label>
          <div className="input-with-icon">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pilih tanggal"
              className="datepicker-input"
            />
            <i className="fa-regular fa-calendar calendar-icon"></i>
          </div>
        </div>

        <div className="form-group half">
          <label>Tanggal Selesai</label>
          <div className="input-with-icon">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              minDate={startDate}
              dateFormat="dd/MM/yyyy"
              placeholderText="Pilih tanggal"
              className="datepicker-input"
            />
            <i className="fa-regular fa-calendar calendar-icon"></i>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <div className="select-wrapper">
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Belum Dimulai</option>
            <option>Sedang Dikerjakan</option>
            <option>Selesai</option>
          </select>
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Tugas"}
      </button>
    </form>
  );
}
