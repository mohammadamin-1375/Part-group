import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./utils/PrivateRoute";
import AdminUserList from "./pages/AdminUser";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute> <DashboardPage /></PrivateRoute>} />
        <Route path="/admin/users" element={<AdminUserList />} />
      </Routes>
    </Router>
  );
}

export default App;
