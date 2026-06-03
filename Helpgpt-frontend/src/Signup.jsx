import { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContent";
import "./Signup.css";

function Signup({ onAuthSuccess }) {
  const { theme } = useContext(MyContext);
  
  const [isLogin, setIsLogin] = useState(false); 
  // NEW: State for styled status messages
  const [status, setStatus] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ text: "", type: "" }); // Clear messages on new attempt

    const endpoint = isLogin ? "login" : "signup";

    try {
      const response = await fetch(`https://helpgpt-backend.onrender.com/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        
        // --- STYLED SUCCESS MESSAGE ---
        setStatus({ 
          text: isLogin ? "Welcome back! Redirecting..." : `Welcome, ${data.username}! Account created!`, 
          type: "success" 
        });
        
        // Delay redirect by 1.5s so user can see the success style
        setTimeout(() => {
          if(onAuthSuccess) onAuthSuccess(); 
        }, 1500);

      } else {
        // --- STYLED ERROR MESSAGE ---
        setStatus({ 
          text: data.error || `${isLogin ? "Login" : "Signup"} failed`, 
          type: "error" 
        });
      }
    } catch (err) {
      console.log("Auth Error:", err);
      setStatus({ text: "Something went wrong with the server.", type: "error" });
    }
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`signup-container ${theme}`}>
      <div className="signup-box">
        <h2>{isLogin ? "Welcome Back" : "Welcome to HelpGPT"}</h2>
        <p>{isLogin ? "Log in to your account" : "Create your account to continue"}</p>

        {/* --- DYNAMIC STATUS MESSAGE BANNER --- */}
        {status.text && (
          <div className={`auth-status-banner ${status.type}`}>
            {status.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
        </form>

        <p className="login-note">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="link" onClick={() => {
            setIsLogin(!isLogin);
            setStatus({ text: "", type: "" }); // Clear message when switching modes
          }}>
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;