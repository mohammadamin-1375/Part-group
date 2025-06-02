import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        console.log("Sending login request",{
            email,
            password
        });
        const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      localStorage.setItem("token", token);
      setMessage("✅ ورود موفق بود!");
      window.location.href = "/dashboard";
    } catch (err) {
      setMessage("❌ ایمیل یا رمز عبور اشتباه است.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src="/logo.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>ورود به Part Group</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="ایمیل"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>ورود</button>
        </form>
        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0d0d0d",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#1e1e1e",
    padding: 30,
    borderRadius: 20,
    width: 320,
    textAlign: "center",
    color: "#fff",
    boxShadow: "0 0 10px rgba(255,102,0,0.5)",
  },
  logo: {
    width: 80,
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
    color: "#ffa500",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 10,
    border: "none",
    outline: "none",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    background: "#ffa500",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
  msg: {
    marginTop: 15,
    color: "#ff4444",
  },
};

export default LoginPage;
