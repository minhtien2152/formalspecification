import React, { useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import Editor from "react-simple-code-editor";
import dedent from "dedent";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
//import "./styles.css";
import fs from "fs";
import "./codeEditor.css";
import { generator } from "./separator";
import CodeEditor from "./CodeEditor";
const App = () => {
  const ref = useRef();
  const [code, setCode] = useState(dedent`
  import React from "react";
  import ReactDOM from "react-dom";
  function App() {
    return (
      <h1>Hello world</h1>
    );
  }
  ReactDOM.render(<App />, document.getElementById("root"));
  `);

  const [result, setResult] = useState("");

  const fileChangeHandler = (e) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      setCode(e.target.result);
    };
    console.log(e.target.files);
    reader.readAsText(e.target.files[0]);
  };

  const handleOpenFile = () => {
    ref.current.click();
  };
  const handleClose = () => {
    window.close();
  };
  const handleNew = () => {
    setCode("");
  };

  const renderHeadBar = () => {
    return (
      <>
        <span class="control" onClick={handleNew}>
          <i class="fas fa-file"></i>
        </span>
        <span class="control" onClick={handleOpenFile}>
          <i class="fas fa-folder-open"></i>
        </span>
        <span class="control" onClick={handleClose}>
          <i class="fas fa-times"></i>
        </span>
      </>
    );
  };

  return (
    <main className="container">
      <input
        ref={ref}
        type="file"
        style={{ visibility: "hidden" }}
        onChange={fileChangeHandler}
      />
      <CodeEditor headbar={renderHeadBar}>
        <Editor
          placeholder="Type some code…"
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => highlight(code, languages.js)}
          padding={10}
          className="container__editor"
        />
      </CodeEditor>
      <CodeEditor>
        <div
          className="container__editor"
          dangerouslySetInnerHTML={{
            __html: highlight(code, languages.js),
          }}
        />
      </CodeEditor>
      <p>{console.log(generator())}</p>
    </main>
  );
};

export default App;
