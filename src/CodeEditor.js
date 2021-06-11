import React from "react";
import "./codeEditor.css";
const CodeEditor = ({ children }) => {
  return (
    <div class="code-editor">
      <div className="head-bar">
        <span class="control"></span>
        <span class="control"></span>
        <span class="control"></span>
      </div>
      <div className="content">
        <pre className="line-numbers">{children}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
