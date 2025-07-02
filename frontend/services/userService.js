import axios from "axios";

const BASE_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getUsers = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/users/`, getAuthHeaders());
    return res.data;
  } catch (error) {
    console.error("❌ خطا در گرفتن لیست کاربران:", error);
    throw error;
  }
};