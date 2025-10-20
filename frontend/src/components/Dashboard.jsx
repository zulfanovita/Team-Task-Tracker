import React, { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import DashboardHeader from "./DashboardHeader";
import "./Dashboard.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // =======================================
  // 🔹 Ambil data dari backend (fetch awal)
  // =======================================
  async function fetchTasks(showLoader = true) {
    try {
      if (showLoader) setLoading(true);
      const res = await fetch("http://localhost:8000/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Gagal memuat data tugas:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // =======================================
  // 🔹 Handler tambah/ubah task
  // =======================================
  function handleReload(optimisticTask) {
    // 🟢 Optimistic update langsung ke UI
    if (optimisticTask) {
      setTasks((prev) => [...prev, optimisticTask]);
    }

    // 🔁 Re-sync setelah delay agar backend selesai nulis
    setRefreshing(true);
    setTimeout(() => fetchTasks(false), 1500);
  }

  // =======================================
  // 🔹 Statistik ringkas
  // =======================================
  const total = tasks.length;
  const ongoing = tasks.filter((t) => t.status === "Sedang Dikerjakan").length;
  const done = tasks.filter((t) => t.status === "Selesai").length;

  // =======================================
  // 🔹 Render
  // =======================================
  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <div className="dashboard-content">
        {/* Statistik atas */}
        <div className="stats-grid">
          <div className={`stat-card total ${refreshing ? "pulse" : ""}`}>
            <h4>Total Task</h4>
            <span>{total}</span>
          </div>
          <div className={`stat-card ongoing ${refreshing ? "pulse" : ""}`}>
            <h4>Sedang Dikerjakan</h4>
            <span>{ongoing}</span>
          </div>
          <div className={`stat-card done ${refreshing ? "pulse" : ""}`}>
            <h4>Selesai</h4>
            <span>{done}</span>
          </div>
        </div>

        {/* Konten utama */}
        <div className="main-section">
          <div className="task-form">
            <h3>Tambah Tugas</h3>
            <TaskForm
              onCreate={(newTask) => {
                // langsung update UI biar terasa instan
                handleReload({
                  ...newTask,
                  id: Date.now(),
                  status: newTask.status || "Belum Dimulai",
                });
              }}
            />
          </div>

          <div className="task-list">
            <h3>Daftar Tugas</h3>
            {loading ? (
              <p className="loading-text">🔄 Sedang memuat data...</p>
            ) : (
              <TaskList
                tasks={tasks}
                onChange={() => handleReload()}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
