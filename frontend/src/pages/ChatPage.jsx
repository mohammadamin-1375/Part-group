import React, { useState } from "react";
import "./ChatPage.css";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatType, setChatType] = useState(null);

  const handleSelectChat = (chat, type) => {
    setSelectedChat(chat);
    setChatType(type);
  };

  return (
    <div className="chat-page">
      <ChatSidebar onSelectChat={handleSelectChat} />
      <ChatWindow chat={selectedChat} chatType={chatType} />
    </div>
  );
}
