import React, { useEffect, useState } from "react";
import "./ChatSidebar.css";
import { FaUser, FaUsers } from "react-icons/fa";
import axios from "axios";
import UserList from "./UserList";

export default function ChatSidebar({ onSelectChat }) {
  const [privateChats, setPrivateChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const privateRes = await axios.get(`http://localhost:8000/chat/private?user_id=${userId}`, {
        withCredentials: true,});
        const groupRes = await axios.get("http://localhost:8000/chat/group", {
          withCredentials: true,
        });
        setPrivateChats(privateRes.data);
        setGroupChats(groupRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setLoading(false);
      }
    };
    fetchChats();
  }, [userId]);


  const handleNewPrivateChat =(chat)=>{
    const exists = privateChats.some((c) => c.id === chat.id);
    if (!exists){
      setPrivateChats((prev) => [...prev, chat]);
    }
  };

  return (
    <div className="chat-sidebar">
      <h2 className="sidebar-title">Part Group</h2>
      {loading && <p className="loading">Loading chats...</p>}

      <UserList onPrivateChatCreated={handleNewPrivateChat} />

      <div className="chat-section">
        <h3 className="section-title">
          <FaUsers /> Groups
        </h3>
        {groupChats.length === 0 && <p className="empty-text">No Groups</p>}
        {groupChats.map((group) => (
          <div
            key={group.id}
            className="chat-item"
            onClick={() => onSelectChat(group, "group")}
          >
            <div className="chat-name"> {group.name}</div>
            <div className="chat-subtext">Created by: {group.create_by}</div>
          </div>
        ))}
      </div>

      <div className="chat-section">
        <h3 className="section-title">
          <FaUser /> Private
        </h3>
        {privateChats.length === 0 && <p className="empty-text">No private chats</p>}
        {privateChats.map((chat) => {
          const otherUser = chat.user1?.username || chat.user2?.username || "Unknown";
          return (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => onSelectChat(chat, "private")}
            >
              <div className="chat-name">{otherUser}</div>
              <div className="chat-subtext">
                Started at: {new Date(chat.created_at).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
