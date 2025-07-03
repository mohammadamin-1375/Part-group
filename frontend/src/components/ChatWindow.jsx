import React, { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";
import { fetchPrivateMessages, sendMessage } from "../../services/chatService";

export default function ChatWindow({ chat, chatType }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);
  const userId = localStorage.getItem("user_id");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat?.id) return;

    const fetchMessages = async () => {
      const data = await fetchPrivateMessages(chat.id);
      setMessages(data);
    };

    fetchMessages();

    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${chat.id}`);
    ws.current.onmessage = (event) => {
      const newMsg = JSON.parse(event.data);
      setMessages((prev) => [...prev, newMsg]);
    };

    return () => ws.current?.close();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage({
      content: newMessage,
      private_chat_id: chat.id,
    });
    setNewMessage("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">{chat?.name || "Private Chat"}</div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.sender_id === userId ? "sent" : "received"}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="chat-send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}