import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaVideo,
  FaPhone,
  FaUserCog,
  FaFolderOpen,
} from "react-icons/fa";
import "./DashboardPage.css";

export default function DashboardPage() {
  const navigate = useNavigate();

  const navButtons = [
    { icon: <FaComments />, path: "/chat", label: "Chat" },
    { icon: <FaFolderOpen />, path: "/archive", label: "Archive" },
    { icon: <FaVideo />, path: "/conference", label: "Conference" },
    { icon: <FaPhone />, path: "/call", label: "Call" },
    { icon: <FaUserCog />, path: "/admin-settings", label: "Admin" },
  ];

  return (
    <div className="dashboard-container">
      {/* Logo */}
      <div className="logo-wrapper">
        <img src="/logo.png" alt="Part Group" className="dashboard-logo" />
      </div>

      {/* Icon buttons */}
      <div className="menu-wrapper">
        {navButtons.map((btn, idx) => (
          <button
            key={idx}
            className="menu-button"
            onClick={() => navigate(btn.path)}
            title={btn.label}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
