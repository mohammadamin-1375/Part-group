// UserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserList.css"; // استایل جدا برای زیبایی بیشتر

export default function UserList({ onPrivateChatCreated }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/users/", {
          withCredentials: true,
        });
        setUsers(res.data.filter((u) => u.id !== currentUserId)); // خودت حذف
        setLoading(false);
      } catch (error) {
        console.error("Failed to load users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const handleStartChat = async (targetUserId) => {
    try {
      const res = await axios.post("http://localhost:8000/chat/private", {
        user1_id: currentUserId,
        user2_id: targetUserId,
      }, {
        withCredentials: true,
      });

      onPrivateChatCreated(res.data);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div className="user-list">
      <h3 className="section-title">Start Chat</h3>
      {users.map((user) => (
        <div key={user.id} className="chat-item">
          <div className="chat-name">{user.username}</div>
          <button
            className="start-chat-button"
            onClick={() => handleStartChat(user.id)}
          >
            Start Chat
          </button>
        </div>
      ))}
    </div>
  );
}
