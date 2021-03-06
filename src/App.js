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
import { ClockLoader as Loader, FadeLoader } from "react-spinners";

//import "./styles.css";
import fs from "fs";
// import "./codeEditor.css";
import {generator, convertToCSharp_display, CSharpApiEncodeStr, separateConsoleRead} from "./separator";
// import CodeEditor from "./CodeEditor";

const App = () => {
  const [theme, setTheme] = useState("light");
  const [isEditorReady, setIsEditorReady] = useState(false);

  const [formal, setFormal] = useState((dedent(`LaNamNhuan   (  nam    :   Z) kq : B    
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

  const [code, setCode] = useState((`
    using System;

    public class Program
    {
      static void Main(string[] args)
      {
        Console.WriteLine("hello world");
      }
    }
  `))

  const [consoleOutput, setConsoleOutput] = useState("");
  const [consoleWait, setConsoleWait] = useState(false);
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
    setCode((convertToCSharp_display(formal)));
  }

  function toggleTheme() {
    setTheme(theme === "light" ? "vs-dark" : "light");
  }

  function handleCompileScript() {
    setConsoleWait(true);
    const str = separateConsoleRead((code));
    const encodedScript = CSharpApiEncodeStr(str);

    var axios = require('axios');
    var data = JSON.stringify({"Compiler":1,"Language":1,"ProjectType":1,"CodeBlock":encodedScript});

    var config = {
      method: 'post',
      url: '/fiddles/',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
    .then(function (response) {
      const res = JSON.parse(JSON.stringify(response.data));
      setConsoleOutput(res["ConsoleOutput"]);
      setConsoleWait(false);
    })
    .catch(function (error) {
      console.log(error);
    });

    // let myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");

    // let raw = JSON.stringify({"Compiler":1,"Language":1,"ProjectType":1,"CodeBlock":encodedScript});

    // let requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: raw,
    //   redirect: 'follow'
    // };

    // fetch("https://dotnetfiddle.net/api/fiddles/", requestOptions)
    //   .then(response => response.text())
    //   .then(result => console.log(result))
    //   .catch(error => console.log('error', error));
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
        {/* x??? l?? output ch??? n??y */}
        <div key="2" style={{display: 'flex-box', padding: '5px'}}>
          <button class="control" onClick={handleCompileScript}>
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
            <FadeLoader size={50} loading={consoleWait}/>
          </div>
          <div>
            {consoleOutput}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
