import "./ChatWindow.css";
import { useContext, useState, useEffect } from "react";
import { MyContext } from "./MyContent";
// import {HashLoader} from "react-spinners";

import { ScaleLoader } from "react-spinners";
import Chat from "./Chat.jsx";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    theme,
    setTheme,
    showSidebar,
    setShowSidebar,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // ADDED: State to hold user info
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ADDED: Fetch user data when dropdown opens
  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (isOpen && userId && !userInfo) {
        try {
          const response = await fetch(
            `https://helpgpt-backend.onrender.com/api/user/${userId}`,
          );
          const data = await response.json();
          setUserInfo(data);
        } catch (err) {
          console.log("Error fetching user:", err);
        }
      }
    };
    fetchUser();
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.reload();
  };

  if (!setPrompt) return null;

  const getReply = async () => {
    const userId = localStorage.getItem("userId");
    setLoading(true);
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
        userId: userId,
      }),
    };

    try {
      const response = await fetch(
        "https://helpgpt-backend.onrender.com/api/chat",
        options,
      );
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  return (
    <div
      className="chat-window"
      onClick={() => {
        if (showSidebar) setShowSidebar(false);
      }}
    >
      <div className="navbar">
        <div className="nav-left">
          <i
            className="fa-solid fa-bars menu-toggle-icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar(!showSidebar);
            }}
          ></i>
          <span className="heading">
            HelpGPT <i className="fa-solid fa-angle-down"></i>
          </span>
        </div>

        <div
          className="userIconDiv"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropDown" onClick={(e) => e.stopPropagation()}>
          {/* UPDATED: User Info Display */}
          {userInfo && (
            <div className="user-info-display">
              <p className="user-display-name">{userInfo.username}</p>
              <div className="email-wrapper">
                <p className="user-display-email">{userInfo.email}</p>
                <span className="tooltip-text">{userInfo.email}</span>
              </div>
              <hr />
            </div>
          )}

          <div
            className="dropDownItem"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <i className="fa-solid fa-gear"></i> Toggle{" "}
            {theme === "dark" ? "Light" : "Dark"} Mode
          </div>

          <div className="dropDownItem logout" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />

      {/* <HashLoader color={theme === 'dark' ? '#fff' : '#000'} loading={loading} /> */}
      <ScaleLoader
        color={theme === "dark" ? "#fff" : "#000"}
        loading={loading}
        height={20}
        width={3}
        radius={2}
        margin={2}
      />
      <div className="chatInput" onClick={(e) => e.stopPropagation()}>
        <div className="inputbox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : "")}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">HelpGpt can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}

export default ChatWindow;
