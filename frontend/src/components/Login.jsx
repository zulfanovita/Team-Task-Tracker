import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← tambahkan ini
import { login } from "../api";

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // ← buat instance navigate

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await login(password);
      if (res.ok) {
        onSuccess();
        navigate("/dashboard"); // ← pindah ke dashboard
      } else {
        setError("Password salah");
      }
    } catch {
      setError("Gagal terhubung ke server");
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-logo">
          <img width="64" height="64" src="https://img.icons8.com/windows/64/FFFFFF/person-male.png" alt="person-male" className="profile-img"/>
        </div>
        <h2>Team Task Tracker</h2>
        <p className="slogan">👋 Welcome Project Manager 👋</p>

        <label>Password</label>
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="eye-button"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
}
