import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2910/2910768.png"
            alt="Task Tracker Logo"
            className="logo-icon"
          />
          <h2>Team Task Tracker</h2>
        </div>

        {/* Menu Section */}
        <nav className="sidebar-menu">
          <button className="menu-item active" onClick={() => navigate("/dashboard")}>
            🏠 Dashboard
          </button>
          <button className="menu-item" onClick={() => navigate("/tasks")}>
            📋 Tasks
          </button>
          <button className="menu-item" onClick={() => navigate("/reports")}>
            📊 Reports
          </button>
          <button className="menu-item" onClick={() => navigate("/team")}>
            👥 Team
          </button>
        </nav>
      </div>

      {/* Logout Button (selalu di bawah dan kelihatan) */}
      <div className="sidebar-bottom">
      <button className="logout-btn" onClick={handleLogout}>
      <img 
        // width="10" 
        // height="10" 
        src="https://img.icons8.com/sf-regular/96/FFFFFF/exit.png"        
        alt="exit"
        className="logout-icon"
        />
          Logout
        </button>
      </div>
    </div>
  );
}
