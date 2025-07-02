import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import AdminUserList from "./pages/AdminUser";
import ChatPage from "./pages/ChatPage";
import React from "react";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute> <DashboardPage /></PrivateRoute>} />
        <Route path="/admin-settings" element={<AdminUserList />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
