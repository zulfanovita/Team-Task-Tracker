import React from "react";
import "./DashboardHeader.css";

export default function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <div></div> {/* sisi kiri kosong biar posisi kanan rapi */}
      <div className="header-right">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3602/3602145.png"
          alt="Notification"
          className="icon"
        />
        <span className="hello-text">Hello, John Doe</span>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
          alt="Profile"
          className="profile-img"
        />
      </div>
    </div>
  );
}
