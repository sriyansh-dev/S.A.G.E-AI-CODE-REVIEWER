import React from 'react'

const ProgressBar = ({name, score}) => {
  let width = "10vw";
  return (
    <div className='p-[15px] rounded-lg progressbar w-full' style={{ borderLeft: `5px solid ${score<50?"#EF4444":score<75?"#EAB308":"#22C55E"}`}}>
      <div className="flex items-center justify-between">
        <p className='text-gray-400 text-[15px] font-[700]'>{name}</p>
        <p className='text-gray-400 text-[13px] font-[700]'>{score}/100</p>
      </div>
      <div className="progress">
        <div className="bg w-full h-[8px] rounded-[30px] bg-[#1F1F2E] mt-2 relative">
        <div style={{width: score+"%"}} className={`absolute left-0 top-0 score h-[8px] rounded-[30px] ${score<50?"bg-red-500":score<75?"bg-yellow-500":"bg-green-500"}`}></div>

        </div>
      </div>
    </div>
  )
}

export default ProgressBar

// {
//     "language": "React",
//     "overallScore": 82,
//     "confidence": 94,
//     "scoreBreakdown": [
//       {
//         "name": "Readability",
//         "score": 9
//       },
//       {
//         "name": "Performance",
//         "score": 7
//       },
//       {
//         "name": "Best Practices",
//         "score": 8
//       },
//       {
//         "name": "Maintainability",
//         "score": 8
//       }
//     ],
//     "summary": "The code is well-structured and readable. Minor performance optimizations and improved error handling would make it more production-ready.",

//     "critical": [
//       {
//         "icon": "FaBug",
//         "title": "Potential Memory Leak",
//         "description": "A useEffect hook contains asynchronous logic without cleanup, which may update state after component unmount."
//       },
//       {
//         "icon": "FaExclamationTriangle",
//         "title": "Missing Error Boundary",
//         "description": "Runtime component failures are not handled, which could crash the entire application."
//       }
//     ],

//     "warnings": [
//       {
//         "title": "Unused State Variable",
//         "line": "24",
//         "severity": "low"
//       },
//       {
//         "title": "Missing Dependency In useEffect",
//         "line": "37",
//         "severity": "medium"
//       },
//       {
//         "title": "Inline Function Causes Re-renders",
//         "line": "58",
//         "severity": "medium"
//       }
//     ],

//     "securityAudit": {
//       "metrics": [
//         {
//           "name": "OWASP Score",
//           "value": "B+"
//         },
//         {
//           "name": "Injection Risk",
//           "value": "Low"
//         },
//         {
//           "name": "Input Validation",
//           "value": "Moderate"
//         },
//         {
//           "name": "Secret Exposure Risk",
//           "value": "Low"
//         }
//       ]
//     },

//     "complianceStandards": [
//       {
//         "name": "Error Handling Present",
//         "passed": false
//       },
//       {
//         "name": "Input Validation Implemented",
//         "passed": true
//       },
//       {
//         "name": "Reusable Components",
//         "passed": true
//       },
//       {
//         "name": "Strict Typing Enforced",
//         "passed": false
//       },
//       {
//         "name": "Consistent Naming Convention",
//         "passed": true
//       }
//     ],

//     "proTip": "Use React.memo for expensive child components to reduce unnecessary re-renders and improve UI responsiveness.",

//     "needToFix": true
//   }