import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContent.jsx";
import { v1 as uuidv1 } from "uuid";
import blackLogo from "./assets/blacklogo.png";

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, setCurrThreadId,
    setNewChat, setPrompt, setReply,
    setPrevChats, theme,
    showSidebar, setShowSidebar
  } = useContext(MyContext);

  // Get the logged-in user's ID
  const userId = localStorage.getItem("userId");

  const getAllThreads = async () => {
    if (!userId) return; // Don't fetch if no user is logged in
    
    try {
      // UPDATED: Now calling the user-specific route
      const response = await fetch(`https://helpgpt-backend.onrender.com/api/thread/${userId}`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) { console.log(err); }
  };

  useEffect(() => { getAllThreads(); }, [currThreadId, userId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setShowSidebar(false); // Close sidebar on mobile
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      // UPDATED: Using the content-specific sub-route we added to backend
      const response = await fetch(`https://helpgpt-backend.onrender.com/api/thread/content/${newThreadId}`);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setShowSidebar(false); // Close sidebar on mobile
    } catch (err) { console.log(err); }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`https://helpgpt-backend.onrender.com/api/thread/${threadId}`, { method: "DELETE" });
      setAllThreads((prev) => prev.filter((thread) => thread.threadId !== threadId));
      if (threadId === currThreadId) { createNewChat(); }
    } catch (err) { console.log(err); }
  };

  return (
    <section className={`sidebar ${theme} ${showSidebar ? "active" : ""}`}>
      <button onClick={createNewChat} className="new-chat-btn">
      <img src={blackLogo} alt="logo" className="logo" />
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      <div className="history-wrapper">
        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li
              key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
            >
              <span className="thread-title">{thread.title}</span>
              <i className="fa-solid fa-trash" onClick={(e) => { e.stopPropagation(); deleteThread(thread.threadId); }}></i>
            </li>
          ))}
        </ul>
      </div>
      <div className="sign"><p>By Bhumika &hearts;</p></div>
    </section>
  );
}

export default Sidebar;