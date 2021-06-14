import React from "react";
import "./codeEditor.css";

const CodeEditor = ({ children, headbar }) => {
  return (
    <div class="code-editor">
      <div className="head-bar">{headbar && headbar()}</div>
      <div className="content">
        <pre className="line-numbers">{children}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
