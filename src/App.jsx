import React, { useState, useEffect } from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import Editor from '@monaco-editor/react';
import ScoreSquare from './components/ScoreSquare';
import ProgressBar from './components/ProgressBar';
import CrticalBox from './components/CrticalBox';
import WarningCom from './components/WarningCom';
import SecurityAudit from './components/SecurityAudit';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { GoCodeReview } from 'react-icons/go';
import { FaInfoCircle } from 'react-icons/fa';
import { LuFileText } from 'react-icons/lu';
import { BsStars } from 'react-icons/bs';
import { MdClose, MdDone } from 'react-icons/md';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { explain, fix, main } from './AI';

const App = () => {
  const [isNoContent, setIsNoContent] = useState(true);
  const [screen, setScreen] = useState("noscreen");
  const [language, setLanguage] = useState("html");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [explainData, setExplainData] = useState("");

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme("codeReviewTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "8B7CFF" },
        { token: "entity.name.function", foreground: "2EE6A6", fontStyle: "bold" },
        { token: "identifier", foreground: "E6E6F0" },
        { token: "string", foreground: "FF9E7A" },
        { token: "number", foreground: "FFB86B" },
        { token: "comment", foreground: "808080", fontStyle: "italic" },
        { token: "type.identifier", foreground: "F6C177" },
        { token: "delimiter", foreground: "CFCFE6" },
      ],
      colors: {
        "editor.background": "#09090F",
        "editor.foreground": "#E6E6F0",
        "editorCursor.foreground": "#8B7CFF",
        "editor.lineHighlightBackground": "#11111A",
        "editor.selectionBackground": "#7C6BFF22",
        "editorLineNumber.foreground": "#4A4A5C",
        "editorLineNumber.activeForeground": "#8B7CFF",
        "editorGutter.background": "#09090F",
        "editorIndentGuide.background": "#1A1A26",
        "minimap.background": "#09090F",
        "editorSuggestWidget.background": "#11111A",
        "editorSuggestWidget.border": "#1F1F2E",
        "editorSuggestWidget.selectedBackground": "#1A1A26",
        "scrollbarSlider.background": "#1A1A26",
        "scrollbarSlider.hoverBackground": "#2A2A3D",
        "editorBracketMatch.background": "#1A1A26",
        "editorBracketMatch.border": "#8B7CFF",
        "editorGroup.border": "#1A1A26",
      },
    });
  }

  const getResponse = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code to analyze");
      return;
    }

    setLoading(true);
    setScreen("analyze");
    try {
      let res = await main(code, language);
      // Strip markdown code blocks if the AI returned them
      const cleanedRes = res.replace(/```json\n?([\s\S]*?)\n?```/g, '$1').trim();
      
      setData(JSON.parse(cleanedRes));
      setIsNoContent(false);
    } catch (error) {
      console.error("Parsing error:", error);
      toast.error("Failed to parse analysis response.");
    } finally {
      setLoading(false);
    }
  };

  const explainDataFunc = async () => {
    try {
      if (!code.trim()) {
        toast.error("Please enter some code to explain");
        return;
      }

      setLoading(true);
      setScreen("explain");
      let res = await explain(code, language);
      setExplainData(res);
      setIsNoContent(false);
    } catch (error) {
      console.error(error);
      toast.error(`Something went wrong: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const fixCode = async () => {
    try {
      if (!code.trim()) {
        toast.error("Please enter some code to fix");
        return;
      }

      setLoading(true);
      setScreen("fix");
      let res = await fix(code, language);
      setCode(res);
      toast.success("Code successfully fixed/updated!");
    } catch (error) {
      toast.error(`Something went wrong: ${error?.message || error}`);
    } finally {
      setLoading(false);
    }
  };



  const handleDownload = () => {
    if (!code.trim()) {
      toast.error("No code to download!");
      return;
    }
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sage-code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Code downloaded!");
  };

  const handleCopyReport = () => {
    if (!data) {
      toast.error("No report available to copy. Please analyze code first.");
      return;
    }
    const reportText = `S.A.G.E Code Analysis Report\nOverall Score: ${data.overallScore}/100\nSummary: ${data.summary}`;
    navigator.clipboard.writeText(reportText);
    toast.success("Report copied to clipboard!");
  };


  return (
    <>
      <Navbar onCopy={handleCopyReport} onDownload={handleDownload} />
      <div className="w-full flex h-screen overflow-hidden">
        <div className="left w-[50%] h-full overflow-auto flex flex-col border-r border-[#1A1A26]">
          <div className="left-header flex items-center justify-between h-[4rem] px-[20px] bg-[#09090F]">
            <div>
              <select 
                onChange={(e) => setLanguage(e.target.value)} 
                value={language} 
                className='language-selector bg-[#11111A] text-white border border-[#1F1F2E] rounded px-2 py-1 outline-none'
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="JavaScript">JavaScript</option>
                <option value="TypeScript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="dart">Dart</option>
                <option value="r">R</option>
                <option value="sql">SQL</option>
                <option value="bash">Bash</option>
                <option value="powershell">PowerShell</option>
                <option value="perl">Perl</option>
                <option value="scala">Scala</option>
                <option value="lua">Lua</option>
                <option value="matlab">MATLAB</option>
                <option value="assembly">Assembly</option>
                <option value="vbnet">VB.NET</option>
                <option value="objectivec">Objective-C</option>
                <option value="haskell">Haskell</option>
                <option value="elixir">Elixir</option>
                <option value="clojure">Clojure</option>
                <option value="fsharp">F#</option>
                <option value="fortran">Fortran</option>
                <option value="cobol">COBOL</option>
                <option value="graphql">GraphQL</option>
                <option value="json">JSON</option>
                <option value="xml">XML</option>
                <option value="yaml">YAML</option>
                <option value="markdown">Markdown</option>
              </select>
            </div>

            <div>
              <button 
                disabled={loading} 
                onClick={getResponse} 
                className="blue-btn flex items-center gap-[10px] bg-[var(--blue)] text-white px-4 py-2 rounded font-semibold hover:opacity-90 disabled:opacity-50"
              >
                <i>
                  {loading && screen === "analyze" ? (
                    <ClipLoader color={"#fff"} size={18} className='mt-1' aria-label="Loading" />
                  ) : (
                    <FaWandMagicSparkles />
                  )}
                </i> 
                Analyze Code
              </button>
            </div>
          </div>

          <div className="code-editor flex-1 w-full h-full">
            <Editor 
              onChange={(val) => setCode(val)} 
              value={code} 
              height="100%" 
              language={language.toLowerCase()} 
              beforeMount={handleEditorWillMount} 
              theme="codeReviewTheme" 
            />
          </div>

          <div className="buttons px-[20px] py-4 flex items-center w-full gap-[10px] bg-[#09090F]">
            <button 
              disabled={loading}
              className='trans flex items-center gap-[10px] w-full justify-center bg-[#11111A] border border-[#1A1A26] text-white py-2 rounded hover:bg-[#1A1A26] disabled:opacity-50' 
              onClick={fixCode}
            >
              {loading && screen === "fix" && (
                <ClipLoader color={"#fff"} size={18} className='mt-1' aria-label="Loading" />
              )} 
              Fix Code
            </button>
            <button 
              disabled={loading}
              className='trans flex items-center gap-[10px] w-full justify-center bg-[#11111A] border border-[#1A1A26] text-white py-2 rounded hover:bg-[#1A1A26] disabled:opacity-50' 
              onClick={explainDataFunc}
            >
              {loading && screen === "explain" && (
                <ClipLoader color={"#fff"} size={18} className='mt-1' aria-label="Loading" />
              )}  
              Explain Code
            </button>
          </div>
        </div>

        <div className="right w-[50%] h-full overflow-auto bg-[#09090F] text-white">
          {isNoContent && (
            <div className='w-full h-full flex items-center flex-col justify-center'>
              <i className='flex items-center justify-center p-[10px] w-[120px] h-[120px] rounded-[50%] bg-[var(--blue)] text-[55px] text-white mb-4'>
                <GoCodeReview />
              </i>
              <p className='text-white text-2xl font-bold'>Analyze Code</p>
              <p className='text-gray-400'>To see results!</p>
            </div>
          )}

          {!isNoContent && screen === "analyze" && data && (
            <div className='w-full overflow-auto h-full p-[20px]'>
              <div className="flex items-center gap-[15px]">
                <ScoreSquare score={data?.overallScore} />
                <div>
                  <h3 className='text-[35px] font-bold m-0 p-0'>Overall Score</h3>
                  <p className='-mt-1 text-gray-400'>Analysis complete based on rules.</p>
                </div>
              </div>

              <div className="gridBox mt-6 flex flex-col gap-3">
                {data?.scoreBreakdown?.map((item, index) => (
                  <ProgressBar key={index} name={item.name} score={item.score} />
                ))}
              </div>

              <div className="summary mt-6 p-[15px] bg-[#17192C] rounded-lg border border-[#2a2e43]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[10px]">
                    <i className='text-[25px] text-[var(--blue)]'><LuFileText /></i>
                    <h3 className='font-bold text-[20px] text-[var(--blue)]'>Summary</h3>
                  </div>
                  <i className='text-[30px] text-gray-500'><BsStars /></i>
                </div>
                <p className='mt-2 text-gray-300'>{data?.summary}</p>
              </div>

              {data?.critical?.length > 0 && (
                <div className="critcal_con mt-6">
                  <p className='font-bold text-[#FFB4AB] mb-2 tracking-wider text-sm'>CRITICAL ISSUES</p>
                  {data.critical.map((item, index) => (
                    <CrticalBox key={index} data={{ title: item?.title, description: item?.description, icon: item?.icon }} />
                  ))}
                </div>
              )}

              {data?.warnings?.length > 0 && (
                <div className="warning_con mt-6">
                  <p className='font-bold text-[#FFB783] mb-2 tracking-wider text-sm'>WARNINGS</p>
                  {data.warnings.map((item, index) => (
                    <WarningCom key={index} data={{ title: item?.title, line: item?.line }} />
                  ))}
                </div>
              )}

              {data?.securityAudit?.metrics?.length > 0 && (
                <div className="security_audit mt-6">
                  <p className='font-bold text-gray-400 mb-2 tracking-wider text-sm'>SECURITY AUDIT</p>
                  <div className='flex items-center gap-[15px] flex-wrap'>
                    {data.securityAudit.metrics.map((item, index) => (
                      <SecurityAudit key={index} data={{ name: item?.name, value: item?.value }} />
                    ))}
                  </div>
                </div>
              )}

              {data?.complianceStandards?.length > 0 && (
                <div className="Compliance_Standards mt-6">
                  <p className='font-bold text-gray-400 mb-5 tracking-wider text-sm'>COMPLIANCE STANDARDS</p>
                  {data.complianceStandards.map((item, index) => (
                    <div key={index} className='flex items-center gap-[15px] mb-2'>
                      <i className={`${item.passed ? "text-green-500" : "text-red-500"} text-[20px]`}>
                        {item.passed ? <MdDone /> : <MdClose />}
                      </i>
                      <p className='text-gray-300'>{item.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className='protip mb-3 mt-6 p-[15px] bg-[#101019] border-l-4 border-[var(--blue)] rounded-r-lg'>
                <div className='flex items-center gap-[15px]'>
                  <i className='text-[17px] text-[var(--blue)]'><HiOutlineLightBulb /></i>
                  <p className='font-bold text-[16px]'>PRO TIP</p>
                </div>
                <p className='text-[14px] text-gray-400 mt-2'>{data?.proTip}</p>
              </div>
            </div>
          )}

          {!isNoContent && screen === "explain" && (
            <div className='w-full overflow-auto h-full p-[20px]'>
              <MarkdownPreview source={explainData} style={{ backgroundColor: 'transparent', color: '#fff' }} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default App;

// const express = require("express");
// const mysql = require("mysql");

// const app = express();

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "123456",
//   database: "users"
// });

// app.get("/user", async (req, res) => {
//   const id = req.query.id;

//   const query = "SELECT * FROM users WHERE id = " + id;

//   db.query(query, (err, result) => {
//     if (err) {
//       console.log(err);
//     }

//     res.send(result);
//   });
// });

// app.post("/login", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   if (username == "admin" && password == "admin123") {
//     res.send({
//       success: true,
//       token: "SECRET_ADMIN_TOKEN"
//     });
//   }
// });

// function processUsers(users) {
//   for (let i = 0; i < users.length; i++) {
//     for (let j = 0; j < users.length; j++) {
//       console.log(users[i].name);
//     }
//   }
// }

// let temp = "unused variable";
// let debug = true;

// function getUserName(user) {
//   return user.profile.name;
// }

// app.listen(3000);