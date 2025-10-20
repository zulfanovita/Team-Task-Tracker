import React, { useState, useEffect } from "react";
import "./TaskList.css"; // pastikan nanti kamu buat file css-nya

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("Semua");
  const [loading, setLoading] = useState(false);

  // 🔹 Ambil semua data tugas dari backend
  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Gagal mengambil data tugas:", err);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Jalankan saat pertama kali halaman dibuka
  useEffect(() => {
    fetchTasks();
  }, []);

  // 🔹 Ubah status task
  async function handleStatusChange(task, newStatus) {
    try {
      console.log(`🔄 Ubah status ${task.title} → ${newStatus}`);
      const updatedTask = { ...task, status: newStatus };

      const res = await fetch(`http://localhost:8000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status");
      await res.json();

      // refresh ulang list
      fetchTasks();
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Gagal memperbarui status tugas!");
    }
  }

  const filteredTasks =
    filter === "Semua" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Daftar Tugas</h2>
        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Semua</option>
          <option>Belum Dimulai</option>
          <option>Sedang Dikerjakan</option>
          <option>Selesai</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">Memuat data tugas...</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Nama Tugas</th>
              <th>Anggota</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Selesai</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  Tidak ada tugas.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignee || "-"}</td>
                  <td>{task.start_date || "-"}</td>
                  <td>{task.due_date || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        task.status === "Selesai"
                          ? "done"
                          : task.status === "Sedang Dikerjakan"
                          ? "progress"
                          : "pending"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                    >
                      <option>Belum Dimulai</option>
                      <option>Sedang Dikerjakan</option>
                      <option>Selesai</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
