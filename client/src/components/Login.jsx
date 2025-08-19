import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

function Login() {
  const [tab, setTab] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [message, setMessage] = useState("");

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!loginEmail || !loginPassword) {
      setMessage('Please enter email and password.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Logged in! Welcome, ' + (data.user?.name || data.user?.email));
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!signupName || !signupEmail || !signupPassword) {
      setMessage('Please fill all fields.');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Account created! Welcome, ' + (data.user?.name || data.user?.email));
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(data.error || 'Signup failed.');
      }
    } catch (err) {
      setMessage('Server error. Please try again.');
    }
  };

  // Touch-up: all blue replaced with black, and a subtle tab background for active tab
  const styles = {
    page: {
      display: "flex",
      minHeight: "100vh",
      background: "#f7f8fa",
      fontFamily: "Inter, Arial, sans-serif",
    },
    imageSection: {
      flex: 1.2,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#222",
      overflow: "hidden",
    },
    img: {
      width: "100%",
      height: "100vh",
      objectFit: "cover",
      filter: "brightness(0.7)",
    },
    overlay: {
      position: "absolute",
      color: "#fff",
      textAlign: "center",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(34,34,34,0.3)",
      padding: "0 2rem",
    },
    overlayH1: {
      fontSize: "2.5rem",
      marginBottom: "0.5rem",
      fontWeight: 700,
      letterSpacing: "1px",
    },
    overlayP: {
      fontSize: "1.2rem",
      opacity: 0.9,
    },
    formSection: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
    },
    container: {
      width: "100%",
      maxWidth: 370,
      padding: "2.5rem 2rem",
      background: "#fff",
      borderRadius: 18,
      // boxShadow: "0 8px 32px rgba(60,60,100,0.14)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    tabs: {
      display: "flex",
      width: "100%",
      marginBottom: "2rem",
      background: "#f3f3f3",
      borderRadius: 8,
      overflow: "hidden",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "0.7rem 0",
      border: "none",
      background: active ? "#111" : "none",
      fontSize: "1.1rem",
      fontWeight: active ? 700 : 500,
      color: active ? "#fff" : "#888",
      borderBottom: active ? "2.5px solid #111" : "2px solid transparent",
      cursor: "pointer",
      transition: "color 0.2s, border-bottom 0.2s, background 0.2s",
      outline: "none",
    }),
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "1.1rem",
    },
    input: {
      padding: "0.8rem 1rem",
      borderRadius: 8,
      border: "1.2px solid #e4e8ee",
      fontSize: "1rem",
      background: "#f8fafc",
      transition: "border 0.2s",
      outline: "none",
    },
    // For focus, you can use onFocus/onBlur to add a black border if desired
    button: {
      marginTop: "0.3rem",
      padding: "0.9rem 0",
      borderRadius: 8,
      border: "none",
      background: "#111",
      color: "#fff",
      fontSize: "1.1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "background 0.2s",
      width: "100%",
    },
    message: {
      marginTop: "1.2rem",
      color: "#d32f2f",
      fontSize: "1rem",
      textAlign: "center",
      minHeight: "1.5em",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.imageSection}>
        <img
          style={styles.img}
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Welcome"
        />
        <div style={styles.overlay}>
          <h1 style={styles.overlayH1}>Welcome Back!</h1>
          <p style={styles.overlayP}>Sign in to continue or create a new account.</p>
        </div>
      </div>
      <div style={styles.formSection}>
        <div style={styles.container}>
          <div style={styles.tabs}>
            <button
              style={styles.tabBtn(tab === "login")}
              onClick={() => {
                setTab("login");
                setMessage("");
              }}
              type="button"
            >
              Login
            </button>
            <button
              style={styles.tabBtn(tab === "signup")}
              onClick={() => {
                setTab("signup");
                setMessage("");
              }}
              type="button"
            >
              Sign Up
            </button>
          </div>
          {tab === "login" ? (
            <form style={styles.form} onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Login</button>
            </form>
          ) : (
            <form style={styles.form} onSubmit={handleSignup}>
              <input
                type="text"
                placeholder="Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="email"
                placeholder="Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                style={styles.input}
              />
              <input
                type="password"
                placeholder="Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Sign Up</button>
            </form>
          )}
          {message && <div style={styles.message}>{message}</div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
