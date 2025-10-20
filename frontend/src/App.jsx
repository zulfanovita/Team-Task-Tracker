import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import { getTasks } from "./api";
import "./App.css";

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [tasks, setTasks] = useState([]);

  async function load() {
    const t = await getTasks();
    setTasks(t);
  }

  useEffect(() => {
    if (authed) load();
  }, [authed]);

  // ✅ fungsi logout
  function handleLogout() {
    setAuthed(false);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onSuccess={() => setAuthed(true)} />}
        />
        <Route
          path="/dashboard"
          element={
            authed ? (
              <div className="app-layout">
                <Sidebar onLogout={handleLogout} /> {/* ✅ dikirim ke Sidebar */}
                <Dashboard tasks={tasks} onReload={load} />
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
