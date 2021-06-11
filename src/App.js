import React, { useState } from "react";

import Editor from "react-simple-code-editor";
import dedent from "dedent";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
//import "./styles.css";
import "./codeEditor.css";
import { generator } from "./separator";
import CodeEditor from "./CodeEditor";
const App = () => {
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

  return (
    <main className="container">
      <button onClick={() => console.log(code)}>a</button>
      <CodeEditor>
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
