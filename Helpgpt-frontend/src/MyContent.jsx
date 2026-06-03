import { createContext, useState } from "react";

export const MyContext = createContext({});

export const MyProvider = ({ children }) => {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(null);
  const [allThreads, setAllThreads] = useState([]);
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [theme, setTheme] = useState("dark");

  // State to track if the sidebar is open on mobile
  const [showSidebar, setShowSidebar] = useState(false); 

  return (
    <MyContext.Provider
      value={{
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        allThreads, setAllThreads,
        prevChats, setPrevChats,
        newChat, setNewChat,
        theme, setTheme,
        showSidebar, setShowSidebar 
      }}
    >
      {children}
    </MyContext.Provider>
  );
};