import React, { useRef, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
// import Editor from "react-simple-code-editor";
import dedent from "dedent";
import * as style from './App'
// import { highlight, languages } from "prismjs/components/prism-core";
// import "prismjs/components/prism-clike";
// import "prismjs/components/prism-javascript";
// import "prismjs/components/prism-markup";

import Editor from "@monaco-editor/react";
import { ClockLoader as Loader } from "react-spinners";

//import "./styles.css";
import fs from "fs";
// import "./codeEditor.css";
import {generator, convertToCSharp_display, CSharpApiEncodeStr} from "./separator";
// import CodeEditor from "./CodeEditor";

export const rTabs = (str) => str.trim().replace(/^ {4}/gm, "");

const App = () => {
  const [theme, setTheme] = useState("light");
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [formal, setFormal] = useState(rTabs(dedent(`LaNamNhuan   (  nam    :   Z) kq : B    
  pre   (nam>0)
  post 
  ( 
     (kq = FALSE) && (nam%4 !=0)
  ) 
  ||
  ( 
     (kq = FALSE) && (nam%400 != 0) 
     && (nam%100=0) 
  ) ||
  ( 
     (kq = TRUE) 
     && (nam%4 = 0) 
     && (nam%100!=0)
  ) 
  ||
  ( (kq = TRUE) && (nam%400=0))
  `)))

  const [code, setCode] = useState(rTabs(`
    using System;

    public class Program
    {
      static void Main(string[] args)
      {
        Console.WriteLine("hello world");
      }
    }
  `))

  const inputFileRef = useRef();

  const fileChangeHandler = (e) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      setFormal(e.target.result);
    };
    console.log(e.target.files);
    reader.readAsText(e.target.files[0]);
  };

  function handleEditorDidMount() {
    setIsEditorReady(true);
  }

  function handleConvertToCSharp() {
    // try {
    //   convertToCSharp_display(formal);
    // } catch (e) {
    //   alert("wrong formal specification format");
    //   return;
    // }
    setCode(rTabs(convertToCSharp_display(formal)));
  }

  function handleResultDidMount() {

  }

  function toggleTheme() {
    setTheme(theme === "light" ? "vs-dark" : "light");
  }

  function handleCompileScript(encodedScript) {
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({"Compiler":1,"Language":1,"ProjectType":1,"CodeBlock":encodedScript});

    let requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://dotnetfiddle.net/api/fiddles/", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  return (
    <>
      <div style={{height: '70vh', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: '30px auto auto', gridAutoFlow: 'row'}}>
        <div key="1" style={{display: 'flex-box', padding: '5px'}}>
          <button style={{width: 'fit-content'}} onClick={toggleTheme} disabled={!isEditorReady}>
            Toggle theme
          </button>
          <button style={{width: 'fit-content'}} onClick={handleConvertToCSharp} disabled={!isEditorReady}>
            Convert
          </button>
          <button class="control" onClick={() => {
            setFormal("");
            setCode("");
          }}>
            <i class="fas fa-file"></i>
          </button>
          <button class="control" onClick={() => {inputFileRef.current.click();}}>
            <i class="fas fa-folder-open"></i>
          </button>
          <button class="control" onClick={() => {
            window.open("about:blank", "_self");
            window.close();
          }}>
            <i class="fas fa-times"></i>
          </button>
          <input
            ref={inputFileRef}
            type="file"
            style={{ visibility: "hidden" }}
            onChange={fileChangeHandler}
          />
        </div>
        {/* xử lý output chỗ này */}
        <div key="2" style={{display: 'flex-box', padding: '5px'}}>
          <button class="control" onClick={() => handleCompileScript(CSharpApiEncodeStr(dedent(code)))}>
            <i class="fas fa-cogs"></i>
          </button>
        </div>
        <div key="3" style={{overflow: 'hidden'}}>
          <Editor
            height="calc(100% - 19px)" // By default, it fully fits with its parent
            theme={theme}
            language="go"
            loading={<Loader />}
            value={formal}
            onChange={(val, ev) => {setFormal(val)}}
            onMount={handleEditorDidMount}
            options={{
              scrollbar: {
                vertical: "hidden",
              },
            }}
          />
        </div>
        <div key="4" style={{overflow: 'hidden'}}>
          <Editor
            height="calc(100% - 19px)" // By default, it fully fits with its parent
            theme={theme}
            language="csharp"
            loading={<Loader />}
            value={code}
            onChange={(val, ev) => {setCode(val)}}
            onMount={handleEditorDidMount}
            options={{
              scrollbar: {
                vertical: "hidden",
              },
            }}
          />
        </div>
      </div>
      <div style={{width: '95%', height: '25vh', padding: '10px'}}>
        <div style={{border: '1px solid black', width: '100%', height: '100%', overflowX: 'hidden', padding: '7px'}}>
          <h3 style={{marginTop: '0px'}}>Output</h3>
          <div>
            output 
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
