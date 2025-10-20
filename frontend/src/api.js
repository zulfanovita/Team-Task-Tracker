const BASE = "http://localhost:8000";

// 🔐 Login Project Manager
export async function login(password) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }), // kirim sebagai JSON body
  });

  // jika server mengembalikan error, tetap balas objek dengan .ok = false
  if (!res.ok) {
    return { ok: false };
  }

  return res.json();
}

// 📋 Ambil semua task
export async function getTasks() {
  const res = await fetch(`${BASE}/tasks`);
  return res.json();
}

// ➕ Buat task baru
export async function createTask(payload) {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ✏️ Update task
export async function updateTask(id, payload) {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// 🗑️ Hapus task
export async function deleteTask(id) {
  const res = await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
  return res.json();
}

// 📊 Ambil data dashboard
export async function getDashboard() {
  const res = await fetch(`${BASE}/dashboard`);
  return res.json();
}
