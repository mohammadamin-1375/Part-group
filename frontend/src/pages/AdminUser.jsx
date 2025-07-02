// UserManagementPage.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, MoreHorizontal, LayoutList, LayoutGrid } from "lucide-react";
import "./AdminUser.css";
import { useNavigate } from "react-router-dom";
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found.");
      return;
    }

    fetch("http://localhost:8000/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch users.");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  return (
    <div className="user-page-container">
      {/* Sidebar */}
      <aside className="user-sidebar">
        <h2 className="sidebar-title">Setting User</h2>
        <ul>
          <li>
            <button className="sidebar-item active">
              <span className="dot gray" />
              User Manager
            </button>
          </li>
          <li>
            <button className="sidebar-item"
            onClick={()=>navigate("/dashboard")}>
              <span className="dot light" />
              Dashboard
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="user-main">
        <div className="user-topbar">
          <h1 className="title">User Search</h1>
          <div className="actions">
            <Button variant="outline" size="sm">
              Add User
            </Button>
            <div className="layout-buttons">
              <Button variant="outline" size="icon">
                <LayoutList className="icon" />
              </Button>
              <Button variant="outline" size="icon">
                <LayoutGrid className="icon" />
              </Button>
            </div>
          </div>
        </div>

        <div className="search-box">
          <div className="search-input-wrapper">
            <Input placeholder="Search User Name" className="pr-10" />
            <Search className="search-icon" />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Row</th>
                <th>User Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Active</th>
                <th>Setting</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{idx + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.role?.name || "-"}</td>
                  <td>{user.email}</td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                  <td>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="icon" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
