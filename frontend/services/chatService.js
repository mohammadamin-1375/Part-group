import axios from "axios";

const BASE_URL = "http://localhost:8000/chat";

export const fetchPrivateMessages = async (chatId) => {
  const res = await axios.get(`${BASE_URL}/private/${chatId}/messages`, {
    withCredentials: true,
  });
  return res.data;
};

export const fetchGroupMessages = async (roomId) => {
  const res = await axios.get(`${BASE_URL}/group/${roomId}/messages`, {
    withCredentials: true,
  });
  return res.data;
};

export const sendMessage = async (messageData) => {
  const res = await axios.post(`${BASE_URL}/send-message`, messageData, {
    withCredentials: true,
  });
  return res.data;
};

export const createPrivateChat = async (user1_id, user2_id) => {
  const res = await axios.post(`${BASE_URL}/private`, {
    user1_id,
    user2_id,
  });
  return res.data;
};