import "./Chat.css";
import { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContent";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// CHANGE: Switched from github.css to atom-one-dark.css for better dark mode compatibility
import "highlight.js/styles/atom-one-dark.css"; 

import CodeBlock from "./CodeBlock";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  useEffect(() => {
    if (reply == null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;

    const lastChat = prevChats[prevChats.length - 1];
    if (lastChat.role !== "assistant") return;

    const content = lastChat.content.split("");
    let idx = 0;
    let isCancelled = false;

    const interval = setInterval(() => {
      if (isCancelled) return;
      setLatestReply(content.slice(0, idx + 1).join(""));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 20);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [prevChats]);

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    console.log("Text copied to clipboard");
  };

  const renderMarkdown = (content) => (
    <ReactMarkdown 
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({ node, inline, className, children, ...props }) {
          if (inline) {
            return <code className={className} {...props}>{children}</code>;
          }
          return (
            <CodeBlock className={className} {...props}>
              {children}
            </CodeBlock>
          );
        }
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <div className="container">
      {prevChats.length === 0 && <h1 className="startNewChat">How can I help you today?</h1>}
      <div className="chats">
        {prevChats?.map((chat, idx) => {
          const isLastAssistant = idx === prevChats.length - 1 && chat.role === "assistant";
          
          if (isLastAssistant) return null;

          return (
            <div className={chat.role === "user" ? "userDiv" : "gptDiv"} key={idx}>
              <div className={chat.role === "user" ? "userMessageContainer" : "gptMessageContainer"}>
                {chat.role === "user" ? (
                  <p className="userMessage">{chat.content}</p>
                ) : (
                  renderMarkdown(chat.content)
                )}
                <button className="copyMsgBtn" onClick={() => copyToClipboard(chat.content)}>
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          );
        })}

        {prevChats.length > 0 && prevChats[prevChats.length - 1].role === "assistant" && (
          <div className="gptDiv">
            <div className="gptMessageContainer">
              {renderMarkdown(latestReply !== null ? latestReply : prevChats[prevChats.length - 1].content)}
              
              <button 
                className="copyMsgBtn gptCopy" 
                onClick={() => copyToClipboard(prevChats[prevChats.length - 1].content)}
              >
                <i className="fa-regular fa-copy"></i>
              </button>
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>
    </div>
  );
}

export default Chat;