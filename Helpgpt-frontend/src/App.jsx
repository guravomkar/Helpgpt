import './App.css';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import Signup from './Signup.jsx'; // Import Signup
import { MyContext } from './MyContent.jsx';
import { useState, useEffect } from 'react';
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  
  // ADDED: Auth state to track if we should show the overlay
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('userId'));

  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    theme,
    setTheme,
    showSidebar,
    setShowSidebar 
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValues}>
        <Sidebar />
        <ChatWindow />

        {/* --- ADDED: THE OVERLAY LOGIC --- */}
        {!isLoggedIn && (
          <div className="auth-overlay">
             <Signup onAuthSuccess={() => setIsLoggedIn(true)} />
          </div>
        )}
      </MyContext.Provider>
    </div>
  );
}

export default App;