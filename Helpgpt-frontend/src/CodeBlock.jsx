import { useState } from "react";

function CodeBlock({ children, ...props }) {
  const [copied, setCopied] = useState(false);

  // This function digs through React objects to find the actual text
  const extractText = (child) => {
    if (typeof child === "string") return child;
    if (Array.isArray(child)) return child.map(extractText).join("");
    if (child?.props?.children) return extractText(child.props.children);
    return "";
  };

  const handleCopy = () => {
    const textToCopy = extractText(children);
    
    // Fallback: if somehow it's still an object, force it to a string
    const finalString = typeof textToCopy === "string" 
      ? textToCopy 
      : String(textToCopy);

    navigator.clipboard.writeText(finalString.replace(/\n$/, ""));
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container" style={{ position: "relative" }}>
      <button className="copy-button" onClick={handleCopy}>
        {copied ? (
          <>
            <i className="fa-solid fa-check"></i> Copied!
          </>
        ) : (
          <>
            <i className="fa-solid fa-copy"></i> Copy code
          </>
        )}
      </button>
      <code {...props}>{children}</code>
    </div>
  );
}

export default CodeBlock;