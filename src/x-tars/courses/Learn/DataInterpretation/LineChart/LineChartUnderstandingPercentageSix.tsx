// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   RotateCcw,
//   Trophy,
//   X,
//   Compass,
//   CheckCircle,
//   FileText,
//   Eye,
//   ArrowRight,
//   Target,
//   Info,
//   MousePointer2,
//   BookOpen
// } from 'lucide-react';
// import { HashRouter as Router, useNavigate } from 'react-router-dom';

// // ==========================================
// // SUB-COMPONENTS
// // ==========================================

// function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
//   return (
//     <header className="w-full shrink-0 p-3 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
//       <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-[3px] sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-3 transition-all">
//         <div className="flex flex-col items-start leading-tight">
//           <button onClick={onBack} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px] sm:text-[11px] mb-0.5">
//             <ChevronLeft size={14} strokeWidth={3} /> Dashboard
//           </button>
//           <span className="text-white font-black uppercase text-[15px] sm:text-[18px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
//             {title}
//           </span>
//         </div>
//         <div className="flex items-center gap-2 sm:gap-3">
//           <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
//             <button onClick={() => setAppMode('concept')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
//             <button onClick={() => setAppMode('practice')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
//           </div>
//           <button onClick={onReset} className="p-2 sm:p-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-md">
//             <RotateCcw size={18} strokeWidth={2.5} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// // ==========================================
// // DATA & CONFIG
// // ==========================================

// const SCENARIOS = {
//   concept: {
//     coreDefinition: {
//         title: "Concept: Percentage Line Charts",
//         text: "Charts often show percentages instead of absolute numbers.\n\n• Percentage = (Part ÷ Total) × 100\n• A flat line means the percentage is the same, but absolute numbers might differ if the base changes!"
//     },
//     chartData: {
//       title: "Percentage of Candidates Qualified to Appeared Over the Years",
//       xLabels: ["1994", "1995", "1996", "1997", "1998", "1999", "2000"],
//       values: [40, 60, 70, 50, 90, 90, 60],
//       yMin: 0, yMax: 100, yTickCount: 6, // 0, 20, 40, 60, 80, 100
//       xLabelTitle: "Years", yLabelTitle: "Qualified %"
//     },
//     tabs: [
//       {
//         id: 'trend',
//         label: 'Percentage Trend',
//         objective: "Understand the percentage formula and avoid the 'Flat Line' trap.",
//         steps: [
//           { 
//             id: "trend-0", type: 'mcq', concept: "The Formula", 
//             q: "This chart shows the 'Percentage of Candidates Qualified'.\n\nMathematically, how is this percentage calculated?",
//             options: ["(Qualified + Appeared) × 100", "(Qualified ÷ Appeared) × 100", "(Appeared ÷ Qualified) × 100"],
//             correct: 1,
//             feedback: [
//                 "Percentages represent a ratio (division), not addition.",
//                 "Correct! Percentage = (Qualified ÷ Appeared) × 100. Let's use this formula!",
//                 "You have the numerator and denominator flipped. The smaller part (Qualified) goes on top."
//             ]
//           },
//           { 
//             id: "trend-1", type: 'mcq', concept: "The Flat Line Trap", 
//             q: "Look at the flat line between 1998 and 1999. Both show exactly 90%.\n\nDoes this guarantee that the absolute number of candidates qualified was the exact same in both years?", 
//             options: ["Yes, 90% is always 90%", "No, absolute numbers depend on the base total", "Only if the percentage is 100%"],
//             correct: 1,
//             feedback: [
//                 "Trap! 90% of 100 is 90, but 90% of 1000 is 900. Absolute numbers can differ!",
//                 "Exactly! The absolute number depends entirely on the base (Total Appeared). If the base changes, the absolute number changes.",
//                 "It applies to any percentage. The base total matters immensely."
//             ],
//             visualAid: { type: 'highlight_segment', startIndex: 4, endIndex: 5, label: "90% DOES NOT MEAN SAME NUMBER" } 
//           }
//         ]
//       },
//       {
//         id: 'difference',
//         label: 'Max Difference',
//         objective: "Learn how to spot the maximum change in percentages visually.",
//         steps: [
//           { 
//             id: "diff-0", type: 'interactive_point', concept: "Steepest Climb", targetIndex: 4, 
//             instruction: "To find the maximum percentage increase between any two consecutive years, we look for the steepest upward slope.\n\n👉 Click the peak of the steepest climb on the chart (1998).", 
//             successInstruction: "Great! 1998 is the peak of the steepest climb on this entire chart." 
//           },
//           { 
//             id: "diff-1", type: 'mcq', concept: "Calculating Difference", 
//             q: "You selected 1998 as the peak.\n\nLooking at the values from 1997 to 1998, what is the exact percentage difference (the climb)?", 
//             options: ["+20%", "+30%", "+40%"],
//             correct: 2,
//             feedback: [
//                 "Check the math again: 90 - 50.",
//                 "That would be the jump from 60 to 90.",
//                 "Perfect! The jump from 50% to 90% is a massive +40% increase. The visual slope confirms it!"
//             ],
//             visualAid: { type: 'show_difference', index1: 3, index2: 4, val1: 50, val2: 90 } 
//           }
//         ]
//       },
//       {
//         id: 'compute',
//         label: 'Compute Values',
//         objective: "Calculate absolute missing numbers using the percentage formula.",
//         steps: [
//           { 
//             id: "comp-0", type: 'interactive_point', concept: "Select Data Point", targetIndex: 4, 
//             instruction: "Now let's compute a missing base number.\n\n👉 Click the data point for 1998 to lock in its exact percentage.", 
//             successInstruction: "Perfect. The chart confirms the percentage for 1998 is 90%." 
//           },
//           { 
//             id: "comp-1", type: 'mcq', concept: "Set Up Equation", 
//             q: "Assume the problem states:\n'The number of candidates who QUALIFIED in 1998 was 27,000.'\n\nWe know the percentage is 90% (or 0.90).\nFormula: 0.90 = 27,000 ÷ Appeared.\n\nHow do we rearrange this to find the Total Appeared?", 
//             options: ["Appeared = 27,000 × 0.90", "Appeared = 27,000 ÷ 0.90", "Appeared = 0.90 ÷ 27,000"],
//             correct: 1,
//             feedback: [
//                 "Multiplying the qualified amount by a decimal will make it smaller! The total appeared must be larger.",
//                 "Perfect! We swap the base and the percentage: Appeared = 27,000 ÷ 0.90.",
//                 "You swapped the numerator and the result."
//             ],
//             visualAid: { type: 'show_equation', index: 4, line1: "0.90 = 27,000 ÷ Appeared", line2: "Find Appeared Total" } 
//           },
//           { 
//             id: "comp-2", type: 'mcq', concept: "Solve Total Value", 
//             q: "Let's calculate the final total!\n\nEquation: Appeared = 27,000 ÷ 0.90\n\nWhat is the total number of candidates who appeared?", 
//             options: ["24,300", "30,000", "300,000"],
//             correct: 1,
//             feedback: [
//                 "That's 27,000 multiplied by 0.90.",
//                 "Spot on! 27,000 ÷ 0.90 = 30,000. You've successfully reverse-engineered the base value!",
//                 "You divided by 0.09 instead of 0.90."
//             ],
//             visualAid: { type: 'show_equation', index: 4, line1: "27,000 ÷ 0.90", line2: "Appeared = 30,000" } 
//           }
//         ]
//       }
//     ]
//   },
//   practice: [
//     {
//       title: "Defect Rates",
//       text: "Analyze the factory's defective product percentage.",
//       chartData: {
//           xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//           values: [5, 15, 10, 25, 20],
//           yMin: 0, yMax: 30, yTickCount: 4, // 0, 10, 20, 30
//           xLabelTitle: "Days", yLabelTitle: "Defective %"
//       },
//       mcq: {
//           q: "Between which two consecutive days was the difference in the defective percentage MAXIMUM?",
//           options: ["Mon & Tue", "Tue & Wed", "Wed & Thu"], correct: 2, 
//           explanation: "The jump from 10% to 25% between Wednesday and Thursday is a massive 15% increase, the steepest on the chart."
//       },
//       visualAid: { type: 'show_difference', index1: 2, index2: 3, val1: 10, val2: 25 }
//     },
//     {
//       title: "Delivery Targets",
//       text: "Review the logistics team's target achievement percentage.",
//       chartData: {
//           xLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
//           values: [60, 80, 80, 50],
//           yMin: 0, yMax: 100, yTickCount: 6,
//           xLabelTitle: "Weeks", yLabelTitle: "Target Achieved %"
//       },
//       mcq: {
//           q: "Look at Wk 2 and Wk 3 (both are 80%). If the total target in Wk 2 was 100 packages, and the total target in Wk 3 was 200 packages, did they deliver the same absolute number of packages?",
//           options: ["Yes, 80% is 80%", "No, Wk 3 delivered twice as many", "Cannot be determined"], correct: 1, 
//           explanation: "80% of 100 = 80 packages. 80% of 200 = 160 packages. Absolute numbers depend on the base total!"
//       },
//       visualAid: { type: 'highlight_segment', startIndex: 1, endIndex: 2, label: "BASE MATTERS" }
//     },
//     {
//       title: "Voting Turnout",
//       text: "Check the percentage of registered voters who actually voted.",
//       chartData: {
//           xLabels: ["Dist A", "Dist B", "Dist C", "Dist D"],
//           values: [40, 75, 60, 85],
//           yMin: 0, yMax: 100, yTickCount: 6,
//           xLabelTitle: "Districts", yLabelTitle: "Voted %"
//       },
//       mcq: {
//           q: "In District B, the turnout was 75%. If 15,000 people voted, how many total registered voters are in District B?\n(Hint: 0.75 = 15,000 ÷ Total)",
//           options: ["11,250", "20,000", "22,500"], correct: 1, 
//           explanation: "Total = Voted ÷ 0.75\nTotal = 15,000 ÷ 0.75 = 20,000 registered voters."
//       },
//       visualAid: { type: 'show_equation', index: 1, line1: "0.75 = 15k ÷ Total", line2: "Total = 20k" }
//     },
//     {
//       title: "Discount Utilization",
//       text: "Analyze the percentage of shoppers who used a discount code.",
//       chartData: {
//           xLabels: ["Q1", "Q2", "Q3", "Q4"],
//           values: [20, 50, 30, 60],
//           yMin: 0, yMax: 80, yTickCount: 5,
//           xLabelTitle: "Quarters", yLabelTitle: "Used Discount %"
//       },
//       mcq: {
//           q: "In Q4, 60% of shoppers used a discount. If there were 500 total shoppers in Q4, how many people used the discount?",
//           options: ["300", "560", "833"], correct: 0, 
//           explanation: "Used = Total × 0.60\nUsed = 500 × 0.60 = 300 shoppers."
//       },
//       visualAid: { type: 'show_equation', index: 3, line1: "Used ÷ 500 = 0.60", line2: "Used = 300" }
//     },
//     {
//       title: "Server Uptime",
//       text: "Look at the percentage of time the web server was online.",
//       chartData: {
//           xLabels: ["Jan", "Feb", "Mar", "Apr", "May"],
//           values: [99, 90, 60, 95, 98],
//           yMin: 50, yMax: 100, yTickCount: 6,
//           xLabelTitle: "Months", yLabelTitle: "Uptime %"
//       },
//       mcq: {
//           q: "Which pair of consecutive months saw the MAXIMUM DROP (decrease) in server uptime?",
//           options: ["Jan & Feb", "Feb & Mar", "Mar & Apr"], correct: 1, 
//           explanation: "From Feb (90%) to Mar (60%), the uptime dropped by a massive 30%. This is the steepest downward slope."
//       },
//       visualAid: { type: 'show_difference', index1: 1, index2: 2, val1: 90, val2: 60 }
//     }
//   ]
// };

// function LabContent() {
//   const navigate = useNavigate();
//   const [appMode, setAppMode] = useState('concept');
  
//   // App State for Steps
//   const [conceptTabIndex, setConceptTabIndex] = useState(0);
//   const [conceptStep, setConceptStep] = useState(0);
//   const [practiceStep, setPracticeStep] = useState(0);
//   const [interactiveCompleted, setInteractiveCompleted] = useState(false);
  
//   const [lessonFinished, setLessonFinished] = useState(false);
//   const [showFinishModal, setShowFinishModal] = useState(false);
//   const containerRef = useRef(null);

//   // MCQ State
//   const [quizSelection, setQuizSelection] = useState(null);
//   const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

//   const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[practiceStep].chartData;
  
//   // Resolve current info block based on mode
//   let currentStepInfo;
//   let currentObjective = "";
//   if (appMode === 'concept') {
//       const activeTab = SCENARIOS.concept.tabs[conceptTabIndex];
//       currentStepInfo = activeTab.steps[conceptStep];
//       currentObjective = activeTab.objective;
//   } else {
//       currentStepInfo = SCENARIOS.practice[practiceStep];
//   }
  
//   const { yMin, yMax, yTickCount, xLabels, values, xLabelTitle, yLabelTitle } = currentData;

//   // Initialization & Reset when Drill/Mode/Tab changes
//   useEffect(() => {
//       setQuizSelection(null);
//       setQuizFeedbackMode(false);
//       setShowExplanation(false);
//       setInteractiveCompleted(false);
//   }, [appMode, practiceStep, conceptTabIndex, conceptStep]); 

//   // Handle MCQ Shuffle for Questions
//   useEffect(() => {
//       const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
          
//       if (currentMCQ?.options) {
//           const arr = Array.from({length: currentMCQ.options.length}, (_, i) => i);
//           for (let i = arr.length - 1; i > 0; i--) {
//               const j = Math.floor(Math.random() * (i + 1));
//               [arr[i], arr[j]] = [arr[j], arr[i]];
//           }
//           setShuffledIndices(arr);
//       }
//   }, [appMode, conceptStep, practiceStep, currentStepInfo]);

//   function handleReset(overrideMode = appMode) {
//     setConceptTabIndex(0);
//     setConceptStep(0);
//     setPracticeStep(0);
//     setInteractiveCompleted(false);
//     setLessonFinished(false);
//     setShowFinishModal(false);
//     setQuizSelection(null);
//     setQuizFeedbackMode(false);
//     setShowExplanation(false);
//   }

//   function handleSetMode(mode) {
//     setAppMode(mode);
//     handleReset(mode);
//   }

//   // ==========================================
//   // CHART RENDERING LOGIC
//   // ==========================================

//   const chartWidth = 400;
//   const chartHeight = 240;
//   const padLeft = 45;
//   const padBottom = 40;
//   const padTop = 20;
//   const padRight = 20;
//   const drawWidth = chartWidth - padLeft - padRight;
//   const drawHeight = chartHeight - padTop - padBottom;
//   const originX = padLeft;
//   const originY = chartHeight - padBottom;

//   // Calculate coordinates
//   const points = values.map((val, idx) => {
//       const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
//       const yRatio = (val - yMin) / (yMax - yMin);
//       const y = originY - (yRatio * drawHeight);
//       return { x, y, val, label: xLabels[idx], idx };
//   });

//   const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

//   // Visual Aids Calculation
//   let visualAidNode = null;
//   const isConceptTeach = appMode === 'concept' && currentStepInfo.type === 'teach';
//   const isConceptInteractiveCompleted = appMode === 'concept' && currentStepInfo.type === 'interactive_point' && interactiveCompleted;
//   const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
//   const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
//   const shouldShowVisualAid = isConceptTeach || isConceptInteractiveCompleted || isCorrectAnswer || showExplanation;
  
//   if (shouldShowVisualAid && currentStepInfo.visualAid) {
//       const aid = currentStepInfo.visualAid;
      
//       if (aid.type === 'highlight_point') {
//           const p = points[aid.index];
//           const isNearTop = p.y < padTop + 40;
//           const boxY = isNearTop ? p.y + 25 : p.y - 45;
//           const textY = isNearTop ? p.y + 40 : p.y - 30;
          
//           let boxX = p.x - 45;
//           if (boxX < padLeft - 10) boxX = padLeft - 10;
//           if (boxX + 90 > chartWidth - padRight + 10) boxX = chartWidth - padRight - 80;

//           visualAidNode = (
//               <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
//                   <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
//                   <rect x={boxX} y={boxY} width="90" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
//                   <text x={boxX + 45} y={textY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
//               </motion.g>
//           );
//       } else if (aid.type === 'highlight_segment') {
//           const p1 = points[aid.startIndex];
//           const p2 = points[aid.endIndex];
//           const midX = (p1.x + p2.x) / 2;
          
//           const isSegNearTop = p1.y < padTop + 40;
//           const segBoxY = isSegNearTop ? p1.y + 20 : p1.y - 40;
//           const segTextY = isSegNearTop ? p1.y + 35 : p1.y - 25;
          
//           let segBoxX = midX - 100;
//           if (segBoxX < padLeft - 10) segBoxX = padLeft - 10;
//           if (segBoxX + 200 > chartWidth - padRight + 10) segBoxX = chartWidth - padRight - 190;

//           visualAidNode = (
//               <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
//                   <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
//                   <rect x={segBoxX} y={segBoxY} width="200" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
//                   <text x={segBoxX + 100} y={segTextY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
//               </motion.g>
//           );
//       } else if (aid.type === 'show_difference') {
//           const p1 = points[aid.index1];
//           const p2 = points[aid.index2];
//           const highP = p1.y < p2.y ? p1 : p2;
//           const lowP = p1.y > p2.y ? p1 : p2;
//           const diff = Math.abs(aid.val1 - aid.val2);
          
//           const boxWidth = 90;
//           const midX = (p1.x + p2.x) / 2;
//           let diffBoxX = midX - boxWidth / 2;
          
//           if (diffBoxX < padLeft - 10) diffBoxX = padLeft - 5;
//           if (diffBoxX + boxWidth > chartWidth - padRight + 10) diffBoxX = chartWidth - padRight - boxWidth + 5;
          
//           let diffBoxY = highP.y - 45;
//           let isAbove = true;
//           if (diffBoxY < 5) {
//               diffBoxY = lowP.y + 25;
//               isAbove = false;
//           }
          
//           const diffTextY = diffBoxY + 17;

//           visualAidNode = (
//               <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
//                   <circle cx={p1.x} cy={p1.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
//                   <circle cx={p2.x} cy={p2.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
//                   <line x1={lowP.x} y1={lowP.y} x2={highP.x} y2={lowP.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
//                   <line x1={highP.x} y1={lowP.y} x2={highP.x} y2={highP.y} stroke="#4ade80" strokeWidth="4" />
//                   <line x1={highP.x - 6} y1={lowP.y} x2={highP.x + 6} y2={lowP.y} stroke="#4ade80" strokeWidth="3" />
//                   <line x1={highP.x - 6} y1={highP.y} x2={highP.x + 6} y2={highP.y} stroke="#4ade80" strokeWidth="3" />
//                   <line x1={midX} y1={isAbove ? diffBoxY + 26 : diffBoxY} x2={highP.x} y2={(highP.y + lowP.y) / 2} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
//                   <rect x={diffBoxX} y={diffBoxY} width={boxWidth} height={26} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.5))" }} />
//                   <text x={diffBoxX + boxWidth / 2} y={diffTextY} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">
//                       {Math.max(aid.val1, aid.val2)} - {Math.min(aid.val1, aid.val2)} = {diff}%
//                   </text>
//               </motion.g>
//           );
//       } else if (aid.type === 'show_equation') {
//           const p = points[aid.index];
//           const boxWidth = 160;
//           const boxHeight = 44;
          
//           let boxX = p.x - boxWidth / 2;
//           if (boxX < padLeft) boxX = padLeft + 5;
//           if (boxX + boxWidth > chartWidth - padRight) boxX = chartWidth - padRight - boxWidth - 5;
          
//           let boxY = p.y - boxHeight - 20;
//           let isAbove = true;
          
//           if (boxY < padTop - 10) {
//               boxY = p.y + 20;
//               isAbove = false;
//           }

//           visualAidNode = (
//               <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
//                   <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
//                   <line 
//                       x1={p.x} y1={isAbove ? boxY + boxHeight : boxY} 
//                       x2={p.x} y2={isAbove ? p.y - 12 : p.y + 12} 
//                       stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" 
//                   />
//                   <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="2" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.4))" }} />
//                   <text x={boxX + boxWidth / 2} y={boxY + 18} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">{aid.line1}</text>
//                   <text x={boxX + boxWidth / 2} y={boxY + 34} fill="#064e3b" fontSize="13" fontWeight="900" textAnchor="middle">{aid.line2}</text>
//               </motion.g>
//           );
//       }
//   }

//   // Interaction Handlers
//   const handleQuizSelection = (idx) => {
//       setQuizSelection(idx);
//       setQuizFeedbackMode(true);
//       setShowExplanation(false);
//   };

//   const handleNextStep = () => {
//       if (appMode === 'concept') {
//           const currentTab = SCENARIOS.concept.tabs[conceptTabIndex];
//           if (conceptStep < currentTab.steps.length - 1) {
//               setConceptStep(conceptStep + 1);
//           } else if (conceptTabIndex < SCENARIOS.concept.tabs.length - 1) {
//               setConceptTabIndex(conceptTabIndex + 1);
//               setConceptStep(0);
//           } else {
//               setLessonFinished(true);
//           }
//       } else {
//           handleNextPracticeDrill();
//       }
//   };

//   const handlePrevStep = () => {
//       if (appMode === 'concept') {
//           if (conceptStep > 0) {
//               setConceptStep(conceptStep - 1);
//               setQuizSelection(null);
//               setQuizFeedbackMode(false);
//               setShowExplanation(false);
//           } else if (conceptTabIndex > 0) {
//               setConceptTabIndex(conceptTabIndex - 1);
//               setConceptStep(SCENARIOS.concept.tabs[conceptTabIndex - 1].steps.length - 1);
//               setQuizSelection(null);
//               setQuizFeedbackMode(false);
//               setShowExplanation(false);
//           }
//       }
//   };

//   const handleNextPracticeDrill = () => {
//       if (practiceStep < SCENARIOS.practice.length - 1) {
//           setPracticeStep(practiceStep + 1);
//           setQuizSelection(null);
//           setQuizFeedbackMode(false);
//           setShowExplanation(false);
//       } else {
//           setLessonFinished(true);
//           setShowFinishModal(true);
//       }
//   }

//   // Render Left Panel Content dynamically
//   const renderLeftPanel = () => {
//     return (
//         <div className="flex flex-col gap-4 h-full">
//             {/* Definition Box */}
//             <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0`}>
//                 <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
//                     {appMode === 'concept' ? <Target size={24} strokeWidth={2.5}/> : <FileText size={24} strokeWidth={2.5}/>}
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
//                         {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.title : `Drill ${practiceStep + 1}/5: ${currentStepInfo.title}`}
//                     </span>
//                     <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
//                         {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.text : currentStepInfo.text}
//                     </p>
//                 </div>
//             </div>
            
//             {/* Explanation Section (Only shown in practice mode on explicit click) */}
//             <AnimatePresence>
//                 {showExplanation && appMode === 'practice' && (
//                     <motion.div
//                         initial={{ opacity: 0, y: -10, height: 0 }}
//                         animate={{ opacity: 1, y: 0, height: 'auto' }}
//                         exit={{ opacity: 0, y: -10, height: 0 }}
//                         className="flex-shrink-0"
//                     >
//                         <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0 h-full`}>
//                             <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
//                                 <Info size={24} strokeWidth={2.5}/>
//                             </div>
//                             <div className="flex flex-col gap-1">
//                                 <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
//                                     Explanation
//                                 </span>
//                                 <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
//                                     {currentStepInfo.mcq.explanation}
//                                 </p>
//                             </div>
//                         </div>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
//   };

//   const topTag = appMode === 'concept' ? "DATA ANALYSIS" : "PRACTICE SCENARIO";

//   return (
//     <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
//       <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

//       <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Line Charts" : "Percentage Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

//       <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
//         {/* Div 1: The Chart Viewer (TOP AREA) */}
//         <div className="w-full flex-1 flex flex-col gap-3 min-h-[380px] lg:min-h-[420px]">
//           <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
//             <div className="w-full flex flex-col items-center gap-3 h-full max-w-[650px]">
                
//                 {/* Data Title Overlay Above Chart */}
//                 <div className="text-white/80 font-black text-[13px] sm:text-[14px] uppercase tracking-widest text-center mb-2">
//                     {currentData.title}
//                 </div>
                
//                 {/* SVG Chart Area */}
//                 <div className={`relative bg-[#3e2723] rounded-2xl border-[4px] ${shouldShowVisualAid ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'border-yellow-500/30'} shadow-inner w-full flex-1 flex flex-col items-center justify-center transition-all duration-500`}>
//                     <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible">
                        
//                         {/* Grid Lines (Faint) */}
//                         {Array.from({length: yTickCount}).map((_, i) => {
//                             const y = originY - (i * (drawHeight / (yTickCount - 1)));
//                             return <line key={`grid-${i}`} x1={originX} y1={y} x2={chartWidth - padRight} y2={y} stroke="white" strokeWidth="1" opacity="0.1" />;
//                         })}

//                         {/* Axes */}
//                         <g>
//                             <line x1={originX} y1={originY} x2={chartWidth - padRight + 10} y2={originY} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
//                             <line x1={originX} y1={originY} x2={originX} y2={padTop - 10} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                            
//                             {/* Y Labels */}
//                             {Array.from({length: yTickCount}).map((_, i) => {
//                                 const val = yMin + i * ((yMax - yMin)/(yTickCount - 1));
//                                 const y = originY - (i * (drawHeight / (yTickCount - 1)));
//                                 return <text key={`yl-${i}`} x={originX - 8} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{parseFloat(val.toFixed(2))}</text>;
//                             })}

//                             {/* X Labels */}
//                             {points.map((p, i) => (
//                                 <text key={`xl-${i}`} x={p.x} y={originY + 18} fill="#a88a6d" fontSize="9" fontWeight="bold" textAnchor="middle">{p.label}</text>
//                             ))}

//                             {/* Axis Titles */}
//                             <text x={originX + drawWidth/2} y={chartHeight - 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
//                             <text x={12} y={originY - drawHeight/2} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
//                         </g>

//                         {/* The Connecting Line */}
//                         <path 
//                             d={pathD} 
//                             fill="none" 
//                             stroke={shouldShowVisualAid ? "#4ade80" : "#fbbf24"} 
//                             strokeWidth="4" 
//                             strokeLinecap="round" 
//                             strokeLinejoin="round" 
//                             style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
//                         />

//                         {/* Static & Interactive Points */}
//                         {points.map((p, i) => {
//                             const isTargetPoint = appMode === 'concept' && currentStepInfo.type === 'interactive_point' && currentStepInfo.targetIndex === i && !interactiveCompleted;
//                             let pointColor = shouldShowVisualAid ? "#4ade80" : "#f8fafc";
                            
//                             return (
//                                 <g key={`p-${i}`}>
//                                     {/* Hit target for interactivity */}
//                                     {isTargetPoint && (
//                                         <circle 
//                                             cx={p.x} cy={p.y} r="25" fill="transparent" 
//                                             style={{ cursor: "pointer" }}
//                                             onClick={() => setInteractiveCompleted(true)} 
//                                         />
//                                     )}
//                                     {/* Pulsing effect if interactive target */}
//                                     {isTargetPoint && (
//                                         <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px`, pointerEvents: "none" }} />
//                                     )}
                                    
//                                     <circle 
//                                         cx={p.x} 
//                                         cy={p.y} 
//                                         r="6" 
//                                         fill={isTargetPoint ? "#fde047" : pointColor} 
//                                         stroke="#3e2723" 
//                                         strokeWidth="2" 
//                                         style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))", pointerEvents: "none" }} 
//                                     />
//                                     <text 
//                                         x={p.x} y={p.y - 12} 
//                                         fill={isTargetPoint ? "#fde047" : pointColor} 
//                                         fontSize="11" 
//                                         fontWeight="bold" 
//                                         textAnchor="middle"
//                                         style={{ pointerEvents: "none" }}
//                                     >
//                                         {parseFloat(p.val.toFixed(2))}
//                                     </text>
//                                 </g>
//                             )
//                         })}
                        
//                         {/* Visual Aid (Rendered LAST so it appears ON TOP) */}
//                         {visualAidNode}
//                     </svg>
//                 </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Div 2: Guidance Panels (BOTTOM 2-COLUMN AREA) */}
//         <div className="w-full bg-[#3e2723] p-4 sm:p-6 lg:p-8 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-2 shrink-0 overflow-hidden min-h-[350px] lg:min-h-[400px]">
//           <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

//           <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-4 sm:gap-6 lg:gap-8 h-full relative z-10">
            
//             {/* Left Column: Core Concepts */}
//             <div className="flex flex-col gap-4 h-full">
//                 {renderLeftPanel()}
//             </div>

//             {/* Right Column: Teacher Guidance & Q&A Panel */}
//             <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[300px] relative overflow-hidden">
//                 <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
//                     <AnimatePresence mode='wait'>
                        
//                         {/* STATE 1: Lesson Finished */}
//                         {lessonFinished && appMode === 'concept' ? (
//                             <motion.div key="concept-finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
//                                 <Trophy size={70} className="text-yellow-400 opacity-50" />
//                                 <h3 className="text-white text-[20px] sm:text-[24px] font-black uppercase tracking-widest">Concept Mastered!</h3>
//                                 <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You successfully learned how to deduce equations and compute absolute values from a percentage chart.</p>
//                                 <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
//                                     Start Practice Drills
//                                 </button>
//                             </motion.div>
//                         ) : (
//                             /* STATE 2A: Concept Mode (Interactive & Tabs) */
//                             appMode === 'concept' ? (
//                                 <motion.div key={`panel-concept-${conceptTabIndex}-${conceptStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    
//                                     {/* Tabs Header */}
//                                     <div className="flex gap-2 pb-3 mb-1 overflow-x-auto hide-scrollbar border-b border-white/10">
//                                         {SCENARIOS.concept.tabs.map((tab, idx) => (
//                                             <button
//                                               key={tab.id}
//                                               onClick={() => { setConceptTabIndex(idx); setConceptStep(0); setInteractiveCompleted(false); setQuizSelection(null); setQuizFeedbackMode(false); }}
//                                               className={`px-4 py-2 rounded-xl text-[11px] sm:text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
//                                                 conceptTabIndex === idx ? 'bg-indigo-600 text-white shadow-md' : 'bg-black/20 text-white/50 hover:text-white hover:bg-black/40'
//                                               }`}
//                                             >
//                                               {tab.label}
//                                             </button>
//                                         ))}
//                                     </div>

//                                     {/* Highlighted Objective Block */}
//                                     <div className="bg-indigo-900/40 border border-indigo-500/50 p-3.5 rounded-xl mb-2 flex gap-3 items-start shadow-md">
//                                         <Target size={20} className="text-indigo-400 shrink-0 mt-0.5" />
//                                         <div className="flex flex-col">
//                                             <span className="text-indigo-400 uppercase tracking-widest text-[11px] font-black mb-1">Objective</span>
//                                             <span className="text-indigo-50 text-[13px] sm:text-[14px] leading-snug font-medium">
//                                                 {currentObjective}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* Content Step */}
//                                     <div className="flex flex-col h-full">
//                                         <div className="flex items-center gap-2 mb-2">
//                                             {currentStepInfo.type === 'interactive_point' ? <MousePointer2 size={16} className="text-yellow-400"/> : 
//                                              currentStepInfo.type === 'mcq' ? <Compass size={16} className="text-yellow-400"/> :
//                                              <BookOpen size={16} className="text-yellow-400"/>}
//                                             <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest">
//                                                 Step {conceptStep + 1}: {currentStepInfo.concept}
//                                             </span>
//                                         </div>

//                                         {currentStepInfo.type === 'mcq' ? (
//                                             /* Concept MCQ Form */
//                                             <div className="flex flex-col h-full">
//                                                 <p className="text-white font-bold text-[14px] sm:text-[16px] leading-snug tracking-tight mb-4 whitespace-pre-line">
//                                                     {currentStepInfo.q}
//                                                 </p>

//                                                 <div className="flex flex-col gap-2 mb-4">
//                                                     {shuffledIndices.map((origIdx) => {
//                                                         const opt = currentStepInfo.options[origIdx];
//                                                         const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.correct;
//                                                         const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.correct;
                                                        
//                                                         let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
//                                                         if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
//                                                         else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                        
//                                                         return (
//                                                             <button 
//                                                                 key={origIdx} 
//                                                                 disabled={quizFeedbackMode}
//                                                                 onClick={() => handleQuizSelection(origIdx)} 
//                                                                 className={`w-full py-3.5 px-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
//                                                             >
//                                                                 {opt}
//                                                             </button>
//                                                         );
//                                                     })}
//                                                 </div>

//                                                 {/* Pre-Answer Footer (Back Button) */}
//                                                 {!quizFeedbackMode && (conceptStep > 0 || conceptTabIndex > 0) && (
//                                                     <div className="mt-2 flex justify-start">
//                                                         <button onClick={handlePrevStep} className="py-2.5 px-5 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-[#3e2723] text-white/80 border border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex items-center gap-1.5">
//                                                             <ChevronLeft size={14} /> Back
//                                                         </button>
//                                                     </div>
//                                                 )}

//                                                 {/* Feedback Footer Area (Post Answer) */}
//                                                 <div className="mt-auto pt-2 min-h-[90px] flex flex-col justify-end">
//                                                     {quizFeedbackMode && !isCorrectAnswer && (
//                                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
//                                                             <p className="text-rose-400 text-[13px] sm:text-[14px] font-bold italic text-center leading-tight">
//                                                                 {`"${currentStepInfo.feedback[quizSelection]}"`}
//                                                             </p>
//                                                             <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
//                                                                 {(conceptStep > 0 || conceptTabIndex > 0) && (
//                                                                      <button onClick={handlePrevStep} className="sm:w-auto px-6 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-[#3e2723] text-white/80 border-2 border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex justify-center items-center gap-2">
//                                                                          <ChevronLeft size={16} /> Back
//                                                                      </button>
//                                                                 )}
//                                                                 <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); }} className="w-full py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95 flex-1">
//                                                                     Try Again
//                                                                 </button>
//                                                             </div>
//                                                         </motion.div>
//                                                     )}

//                                                     {isCorrectAnswer && (
//                                                         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
//                                                             <div className="bg-green-400/10 p-3 sm:p-4 rounded-xl border border-green-500/20 flex gap-3 items-center justify-center">
//                                                                 <CheckCircle className="text-green-400 shrink-0" size={20} />
//                                                                 <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Logic Correct!</span>
//                                                             </div>
//                                                             <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
//                                                                 {(conceptStep > 0 || conceptTabIndex > 0) && (
//                                                                      <button onClick={handlePrevStep} className="sm:w-auto px-6 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-[#3e2723] text-white/80 border-2 border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex justify-center items-center gap-2">
//                                                                          <ChevronLeft size={16} /> Back
//                                                                      </button>
//                                                                 )}
//                                                                 <button onClick={handleNextStep} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
//                                                                     {conceptStep === SCENARIOS.concept.tabs[conceptTabIndex].steps.length - 1 && conceptTabIndex === SCENARIOS.concept.tabs.length - 1 ? 'Finish' : 'Continue'}
//                                                                     <ArrowRight size={16} />
//                                                                 </button>
//                                                             </div>
//                                                         </motion.div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ) : (
//                                             /* Teach or Interactive Point Form */
//                                             <>
//                                                 <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-4 sm:p-5 rounded-[1.5rem] shadow-inner mb-4 flex-1">
//                                                      <p className="text-indigo-100 font-medium text-[14px] sm:text-[16px] leading-relaxed tracking-wide whitespace-pre-line">
//                                                          {currentStepInfo.type === 'interactive_point' && interactiveCompleted ? currentStepInfo.successInstruction : currentStepInfo.instruction}
//                                                      </p>
//                                                 </div>
                                                
//                                                 {/* Navigation Footer */}
//                                                 <div className="mt-auto pt-2 min-h-[60px] flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-between w-full">
//                                                     {(conceptStep > 0 || conceptTabIndex > 0) && (
//                                                         <motion.button initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} onClick={handlePrevStep} className="py-4 px-6 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-[#3e2723] text-white/80 border-2 border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex justify-center items-center gap-2">
//                                                             <ChevronLeft size={18} /> Back
//                                                         </motion.button>
//                                                     )}
                                                    
//                                                     {(currentStepInfo.type === 'teach' || interactiveCompleted) ? (
//                                                         <motion.button initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} onClick={handleNextStep} className="flex-1 py-4 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
//                                                             {currentStepInfo.actionButtonText || 'Continue'}
//                                                             <ArrowRight size={18} />
//                                                         </motion.button>
//                                                     ) : (
//                                                         <div className="flex-1"></div> // spacer
//                                                     )}
//                                                 </div>
//                                             </>
//                                         )}

//                                     </div>
//                                 </motion.div>
//                             ) : (
//                                 /* STATE 2B: Practice Mode (MCQ) */
//                                 <motion.div key={`panel-practice-${practiceStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
//                                     <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
//                                         <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
//                                             <Compass size={16}/> Practice Analysis
//                                         </span>
//                                     </div>

//                                     <div className="flex flex-col h-full">
//                                         <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-4 whitespace-pre-line">
//                                             {currentStepInfo.mcq.q}
//                                         </p>

//                                         <div className="flex flex-col gap-2.5 mb-4">
//                                             {shuffledIndices.map((origIdx) => {
//                                                 const opt = currentStepInfo.mcq.options[origIdx];
//                                                 const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.mcq.correct;
//                                                 const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.mcq.correct;
                                                
//                                                 let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
//                                                 if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
//                                                 else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                
//                                                 return (
//                                                     <button 
//                                                         key={origIdx} 
//                                                         disabled={quizFeedbackMode}
//                                                         onClick={() => handleQuizSelection(origIdx)} 
//                                                         className={`w-full py-3.5 px-4 rounded-xl font-black uppercase text-[13px] sm:text-[14px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
//                                                     >
//                                                         {opt}
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>

//                                         {/* Feedback Footer Area */}
//                                         <div className="mt-auto pt-2 min-h-[90px] flex flex-col justify-end">
//                                             {quizFeedbackMode && !isCorrectAnswer && (
//                                                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
//                                                     <p className="text-rose-400 text-[13px] sm:text-[14px] font-bold italic text-center leading-tight">
//                                                         "Not quite right. Check your analysis again."
//                                                     </p>
//                                                     <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
//                                                         <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false); }} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95">
//                                                             Try Again
//                                                         </button>
//                                                         {!showExplanation && (
//                                                             <button onClick={() => setShowExplanation(true)} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
//                                                                 View Explain
//                                                             </button>
//                                                         )}
//                                                     </div>
//                                                 </motion.div>
//                                             )}

//                                             {isCorrectAnswer && (
//                                                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
//                                                     <div className="bg-green-400/10 p-3 sm:p-4 rounded-xl border border-green-500/20 flex gap-3 items-center justify-center">
//                                                         <CheckCircle className="text-green-400 shrink-0" size={20} />
//                                                         <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Correct!</span>
//                                                     </div>
//                                                     <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
//                                                         {!showExplanation && (
//                                                             <button onClick={() => setShowExplanation(true)} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
//                                                                 View Explain
//                                                             </button>
//                                                         )}
//                                                         <button onClick={handleNextPracticeDrill} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-scale-105 active:scale-95 flex justify-center items-center gap-2">
//                                                             {practiceStep === SCENARIOS.practice.length - 1 ? 'Finish' : 'Continue'}
//                                                             <ArrowRight size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </motion.div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )
//                         )}

//                     </AnimatePresence>
//                 </div>
//             </div>

//           </div>
//         </div>

//       </main>

//       {/* Custom Alert Overlay for Finishing the Practice Laboratory */}
//       <AnimatePresence>
//         {showFinishModal && (
//             <motion.div 
//                 initial={{ opacity: 0 }} 
//                 animate={{ opacity: 1 }} 
//                 exit={{ opacity: 0 }} 
//                 className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
//             >
//                <motion.div 
//                    initial={{ scale: 0.9, y: 20 }} 
//                    animate={{ scale: 1, y: 0 }} 
//                    exit={{ scale: 0.9, y: 20 }}
//                    className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-5 w-full max-w-md text-center relative"
//                >
//                   <div className="bg-yellow-500/20 p-4 rounded-full">
//                       <Trophy size={64} className="text-yellow-400 animate-bounce" />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                       <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-widest">
//                           Lab Complete!
//                       </h2>
//                       <p className="text-white/80 text-sm sm:text-base font-medium px-4">
//                           You have successfully mastered Chart Reading!
//                       </p>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
//                      <button onClick={() => { handleReset('concept'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart Lab</button>
//                      <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Close Menu</button>
//                   </div>
//                   <button onClick={() => setShowFinishModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
//                       <X size={24} />
//                   </button>
//                </motion.div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .hide-scrollbar::-webkit-scrollbar { display: none; }
//         .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
//       `}} />
//     </div>
//   );
// }

// export default function App() { return ( <Router> <LabContent /> </Router> ); }


import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  Compass,
  CheckCircle,
  FileText,
  Eye,
  ArrowRight,
  Target,
  Info,
  MousePointer2,
  BookOpen
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-3 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-[3px] sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-3 transition-all">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px] sm:text-[11px] mb-0.5">
            <ChevronLeft size={14} strokeWidth={3} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[15px] sm:text-[18px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 sm:p-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-md">
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// DATA & CONFIG
// ==========================================

const SCENARIOS = {
  concept: {
    coreDefinition: {
        title: "Concept: Percentage Line Charts",
        text: "Charts often show percentages instead of absolute numbers.\n\n• Percentage = (Part ÷ Total) × 100\n• A flat line means the percentage is the same, but absolute numbers might differ if the base changes!"
    },
    chartData: {
      title: "Percentage of Candidates Qualified to Appeared Over the Years",
      xLabels: ["1994", "1995", "1996", "1997", "1998", "1999", "2000"],
      values: [40, 60, 70, 50, 90, 90, 60],
      yMin: 0, yMax: 100, yTickCount: 6, // 0, 20, 40, 60, 80, 100
      xLabelTitle: "Years", yLabelTitle: "Qualified %"
    },
    tabs: [
      {
        id: 'trend',
        label: 'Percentage Trend',
        objective: "Understand the percentage formula and avoid the 'Flat Line' trap.",
        steps: [
          { 
            id: "trend-0", type: 'mcq', concept: "The Formula", 
            q: "This chart shows the 'Percentage of Candidates Qualified'.\n\nMathematically, how is this percentage calculated?",
            options: ["(Qualified + Appeared) × 100", "(Qualified ÷ Appeared) × 100", "(Appeared ÷ Qualified) × 100"],
            correct: 1,
            feedback: [
                "Percentages represent a ratio (division), not addition.",
                "Correct! Percentage = (Qualified ÷ Appeared) × 100. Let's use this formula!",
                "You have the numerator and denominator flipped. The smaller part (Qualified) goes on top."
            ]
          },
          { 
            id: "trend-1", type: 'mcq', concept: "The Flat Line Trap", 
            q: "Look at the flat line between 1998 and 1999. Both show exactly 90%.\n\nDoes this guarantee that the absolute number of candidates qualified was the exact same in both years?", 
            options: ["Yes, 90% is always 90%", "No, absolute numbers depend on the base total", "Only if the percentage is 100%"],
            correct: 1,
            feedback: [
                "Trap! 90% of 100 is 90, but 90% of 1000 is 900. Absolute numbers can differ!",
                "Exactly! The absolute number depends entirely on the base (Total Appeared). If the base changes, the absolute number changes.",
                "It applies to any percentage. The base total matters immensely."
            ],
            visualAid: { type: 'highlight_segment', startIndex: 4, endIndex: 5, label: "90% DOES NOT MEAN SAME NUMBER" } 
          }
        ]
      },
      {
        id: 'difference',
        label: 'Max Difference',
        objective: "Learn how to spot the maximum change in percentages visually.",
        steps: [
          { 
            id: "diff-0", type: 'interactive_point', concept: "Steepest Climb", targetIndex: 4, 
            instruction: "To find the maximum percentage increase between any two consecutive years, we look for the steepest upward slope.\n\nObserve the encircled peak of the steepest climb on the chart (1998).", 
            successInstruction: "Great! 1998 is the peak of the steepest climb on this entire chart.",
            visualAid: { type: 'highlight_point', index: 4, label: "1998: 90%" }
          },
          { 
            id: "diff-1", type: 'mcq', concept: "Calculating Difference", 
            q: "You observed 1998 as the peak.\n\nLooking at the values from 1997 to 1998, what is the exact percentage difference (the climb)?", 
            options: ["+20%", "+30%", "+40%"],
            correct: 2,
            feedback: [
                "Check the math again: 90 - 50.",
                "That would be the jump from 60 to 90.",
                "Perfect! The jump from 50% to 90% is a massive +40% increase. The visual slope confirms it!"
            ],
            visualAid: { type: 'show_difference', index1: 3, index2: 4, val1: 50, val2: 90 } 
          }
        ]
      },
      {
        id: 'compute',
        label: 'Compute Values',
        objective: "Calculate absolute missing numbers using the percentage formula.",
        steps: [
          { 
            id: "comp-0", type: 'interactive_point', concept: "Select Data Point", targetIndex: 4, 
            instruction: "Now let's compute a missing base number.\n\nObserve the encircled data point for 1998 to confirm its exact percentage.", 
            successInstruction: "Perfect. The chart confirms the percentage for 1998 is 90%.",
            visualAid: { type: 'highlight_point', index: 4, label: "1998: 90%" }
          },
          { 
            id: "comp-1", type: 'mcq', concept: "Set Up Equation", 
            q: "Assume the problem states:\n'The number of candidates who QUALIFIED in 1998 was 27,000.'\n\nWe know the percentage is 90% (or 0.90).\nFormula: 0.90 = 27,000 ÷ Appeared.\n\nHow do we rearrange this to find the Total Appeared?", 
            options: ["Appeared = 27,000 × 0.90", "Appeared = 27,000 ÷ 0.90", "Appeared = 0.90 ÷ 27,000"],
            correct: 1,
            feedback: [
                "Multiplying the qualified amount by a decimal will make it smaller! The total appeared must be larger.",
                "Perfect! We swap the base and the percentage: Appeared = 27,000 ÷ 0.90.",
                "You swapped the numerator and the result."
            ],
            visualAid: { type: 'show_equation', index: 4, line1: "0.90 = 27,000 ÷ Appeared", line2: "Find Appeared Total" } 
          },
          { 
            id: "comp-2", type: 'mcq', concept: "Solve Total Value", 
            q: "Let's calculate the final total!\n\nEquation: Appeared = 27,000 ÷ 0.90\n\nWhat is the total number of candidates who appeared?", 
            options: ["24,300", "30,000", "300,000"],
            correct: 1,
            feedback: [
                "That's 27,000 multiplied by 0.90.",
                "Spot on! 27,000 ÷ 0.90 = 30,000. You've successfully reverse-engineered the base value!",
                "You divided by 0.09 instead of 0.90."
            ],
            visualAid: { type: 'show_equation', index: 4, line1: "27,000 ÷ 0.90", line2: "Appeared = 30,000" } 
          }
        ]
      }
    ]
  },
  practice: [
    {
      title: "Defect Rates",
      text: "Analyze the factory's defective product percentage.",
      chartData: {
          xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [5, 15, 10, 25, 20],
          yMin: 0, yMax: 30, yTickCount: 4, // 0, 10, 20, 30
          xLabelTitle: "Days", yLabelTitle: "Defective %"
      },
      mcq: {
          q: "Between which two consecutive days was the difference in the defective percentage MAXIMUM?",
          options: ["Mon & Tue", "Tue & Wed", "Wed & Thu"], correct: 2, 
          explanation: "The jump from 10% to 25% between Wednesday and Thursday is a massive 15% increase, the steepest on the chart."
      },
      visualAid: { type: 'show_difference', index1: 2, index2: 3, val1: 10, val2: 25 }
    },
    {
      title: "Delivery Targets",
      text: "Review the logistics team's target achievement percentage.",
      chartData: {
          xLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
          values: [60, 80, 80, 50],
          yMin: 0, yMax: 100, yTickCount: 6,
          xLabelTitle: "Weeks", yLabelTitle: "Target Achieved %"
      },
      mcq: {
          q: "Look at Wk 2 and Wk 3 (both are 80%). If the total target in Wk 2 was 100 packages, and the total target in Wk 3 was 200 packages, did they deliver the same absolute number of packages?",
          options: ["Yes, 80% is 80%", "No, Wk 3 delivered twice as many", "Cannot be determined"], correct: 1, 
          explanation: "80% of 100 = 80 packages. 80% of 200 = 160 packages. Absolute numbers depend on the base total!"
      },
      visualAid: { type: 'highlight_segment', startIndex: 1, endIndex: 2, label: "BASE MATTERS" }
    },
    {
      title: "Voting Turnout",
      text: "Check the percentage of registered voters who actually voted.",
      chartData: {
          xLabels: ["Dist A", "Dist B", "Dist C", "Dist D"],
          values: [40, 75, 60, 85],
          yMin: 0, yMax: 100, yTickCount: 6,
          xLabelTitle: "Districts", yLabelTitle: "Voted %"
      },
      mcq: {
          q: "In District B, the turnout was 75%. If 15,000 people voted, how many total registered voters are in District B?\n(Hint: 0.75 = 15,000 ÷ Total)",
          options: ["11,250", "20,000", "22,500"], correct: 1, 
          explanation: "Total = Voted ÷ 0.75\nTotal = 15,000 ÷ 0.75 = 20,000 registered voters."
      },
      visualAid: { type: 'show_equation', index: 1, line1: "0.75 = 15k ÷ Total", line2: "Total = 20k" }
    },
    {
      title: "Discount Utilization",
      text: "Analyze the percentage of shoppers who used a discount code.",
      chartData: {
          xLabels: ["Q1", "Q2", "Q3", "Q4"],
          values: [20, 50, 30, 60],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Quarters", yLabelTitle: "Used Discount %"
      },
      mcq: {
          q: "In Q4, 60% of shoppers used a discount. If there were 500 total shoppers in Q4, how many people used the discount?",
          options: ["300", "560", "833"], correct: 0, 
          explanation: "Used = Total × 0.60\nUsed = 500 × 0.60 = 300 shoppers."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "Used ÷ 500 = 0.60", line2: "Used = 300" }
    },
    {
      title: "Server Uptime",
      text: "Look at the percentage of time the web server was online.",
      chartData: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May"],
          values: [99, 90, 60, 95, 98],
          yMin: 50, yMax: 100, yTickCount: 6,
          xLabelTitle: "Months", yLabelTitle: "Uptime %"
      },
      mcq: {
          q: "Which pair of consecutive months saw the MAXIMUM DROP (decrease) in server uptime?",
          options: ["Jan & Feb", "Feb & Mar", "Mar & Apr"], correct: 1, 
          explanation: "From Feb (90%) to Mar (60%), the uptime dropped by a massive 30%. This is the steepest downward slope."
      },
      visualAid: { type: 'show_difference', index1: 1, index2: 2, val1: 90, val2: 60 }
    }
  ]
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // App State for Steps
  const [conceptTabIndex, setConceptTabIndex] = useState(0);
  const [conceptStep, setConceptStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [interactiveCompleted, setInteractiveCompleted] = useState(false);
  
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const containerRef = useRef(null);

  // MCQ State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[practiceStep].chartData;
  
  // Resolve current info block based on mode
  let currentStepInfo;
  let currentObjective = "";
  if (appMode === 'concept') {
      const activeTab = SCENARIOS.concept.tabs[conceptTabIndex];
      currentStepInfo = activeTab.steps[conceptStep];
      currentObjective = activeTab.objective;
  } else {
      currentStepInfo = SCENARIOS.practice[practiceStep];
  }
  
  const { yMin, yMax, yTickCount, xLabels, values, xLabelTitle, yLabelTitle } = currentData;

  // Initialization & Reset when Drill/Mode/Tab changes
  useEffect(() => {
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
      setInteractiveCompleted(false);
  }, [appMode, practiceStep, conceptTabIndex, conceptStep]); 

  // Handle MCQ Shuffle for Questions
  useEffect(() => {
      const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
          
      if (currentMCQ?.options) {
          const arr = Array.from({length: currentMCQ.options.length}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [appMode, conceptStep, practiceStep, currentStepInfo]);

  function handleReset(overrideMode = appMode) {
    setConceptTabIndex(0);
    setConceptStep(0);
    setPracticeStep(0);
    setInteractiveCompleted(false);
    setLessonFinished(false);
    setShowFinishModal(false);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // ==========================================
  // CHART RENDERING LOGIC
  // ==========================================

  const chartWidth = 400;
  const chartHeight = 240;
  const padLeft = 45;
  const padBottom = 40;
  const padTop = 20;
  const padRight = 20;
  const drawWidth = chartWidth - padLeft - padRight;
  const drawHeight = chartHeight - padTop - padBottom;
  const originX = padLeft;
  const originY = chartHeight - padBottom;

  // Calculate coordinates
  const points = values.map((val, idx) => {
      const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
      const yRatio = (val - yMin) / (yMax - yMin);
      const y = originY - (yRatio * drawHeight);
      return { x, y, val, label: xLabels[idx], idx };
  });

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Visual Aids Calculation
  let visualAidNode = null;
  const isConceptTeach = appMode === 'concept' && currentStepInfo.type === 'teach';
  const isConceptInteractiveCompleted = appMode === 'concept' && currentStepInfo.type === 'interactive_point';
  const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
  const shouldShowVisualAid = isConceptTeach || isConceptInteractiveCompleted || isCorrectAnswer || showExplanation;
  
  if (shouldShowVisualAid && currentStepInfo.visualAid) {
      const aid = currentStepInfo.visualAid;
      
      if (aid.type === 'highlight_point') {
          const p = points[aid.index];
          const isNearTop = p.y < padTop + 40;
          const boxY = isNearTop ? p.y + 25 : p.y - 45;
          const textY = isNearTop ? p.y + 40 : p.y - 30;
          
          let boxX = p.x - 45;
          if (boxX < padLeft - 10) boxX = padLeft - 10;
          if (boxX + 90 > chartWidth - padRight + 10) boxX = chartWidth - padRight - 80;

          visualAidNode = (
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  <rect x={boxX} y={boxY} width="90" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
                  <text x={boxX + 45} y={textY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
              </motion.g>
          );
      } else if (aid.type === 'highlight_segment') {
          const p1 = points[aid.startIndex];
          const p2 = points[aid.endIndex];
          const midX = (p1.x + p2.x) / 2;
          
          const isSegNearTop = p1.y < padTop + 40;
          const segBoxY = isSegNearTop ? p1.y + 20 : p1.y - 40;
          const segTextY = isSegNearTop ? p1.y + 35 : p1.y - 25;
          
          let segBoxX = midX - 100;
          if (segBoxX < padLeft - 10) segBoxX = padLeft - 10;
          if (segBoxX + 200 > chartWidth - padRight + 10) segBoxX = chartWidth - padRight - 190;

          visualAidNode = (
              <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                  <rect x={segBoxX} y={segBoxY} width="200" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
                  <text x={segBoxX + 100} y={segTextY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
              </motion.g>
          );
      } else if (aid.type === 'show_difference') {
          const p1 = points[aid.index1];
          const p2 = points[aid.index2];
          const highP = p1.y < p2.y ? p1 : p2;
          const lowP = p1.y > p2.y ? p1 : p2;
          const diff = Math.abs(aid.val1 - aid.val2);
          
          const boxWidth = 90;
          const midX = (p1.x + p2.x) / 2;
          let diffBoxX = midX - boxWidth / 2;
          
          if (diffBoxX < padLeft - 10) diffBoxX = padLeft - 5;
          if (diffBoxX + boxWidth > chartWidth - padRight + 10) diffBoxX = chartWidth - padRight - boxWidth + 5;
          
          let diffBoxY = highP.y - 45;
          let isAbove = true;
          if (diffBoxY < 5) {
              diffBoxY = lowP.y + 25;
              isAbove = false;
          }
          
          const diffTextY = diffBoxY + 17;

          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <circle cx={p1.x} cy={p1.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <circle cx={p2.x} cy={p2.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <line x1={lowP.x} y1={lowP.y} x2={highP.x} y2={lowP.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1={highP.x} y1={lowP.y} x2={highP.x} y2={highP.y} stroke="#4ade80" strokeWidth="4" />
                  <line x1={highP.x - 6} y1={lowP.y} x2={highP.x + 6} y2={lowP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={highP.x - 6} y1={highP.y} x2={highP.x + 6} y2={highP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={midX} y1={isAbove ? diffBoxY + 26 : diffBoxY} x2={highP.x} y2={(highP.y + lowP.y) / 2} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect x={diffBoxX} y={diffBoxY} width={boxWidth} height={26} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.5))" }} />
                  <text x={diffBoxX + boxWidth / 2} y={diffTextY} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">
                      {Math.max(aid.val1, aid.val2)} - {Math.min(aid.val1, aid.val2)} = {diff}%
                  </text>
              </motion.g>
          );
      } else if (aid.type === 'show_equation') {
          const p = points[aid.index];
          const boxWidth = 160;
          const boxHeight = 44;
          
          let boxX = p.x - boxWidth / 2;
          if (boxX < padLeft) boxX = padLeft + 5;
          if (boxX + boxWidth > chartWidth - padRight) boxX = chartWidth - padRight - boxWidth - 5;
          
          let boxY = p.y - boxHeight - 20;
          let isAbove = true;
          
          if (boxY < padTop - 10) {
              boxY = p.y + 20;
              isAbove = false;
          }

          visualAidNode = (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  <line 
                      x1={p.x} y1={isAbove ? boxY + boxHeight : boxY} 
                      x2={p.x} y2={isAbove ? p.y - 12 : p.y + 12} 
                      stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" 
                  />
                  <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="2" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.4))" }} />
                  <text x={boxX + boxWidth / 2} y={boxY + 18} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">{aid.line1}</text>
                  <text x={boxX + boxWidth / 2} y={boxY + 34} fill="#064e3b" fontSize="13" fontWeight="900" textAnchor="middle">{aid.line2}</text>
              </motion.g>
          );
      }
  }

  // Interaction Handlers
  const handleQuizSelection = (idx) => {
      setQuizSelection(idx);
      setQuizFeedbackMode(true);
      setShowExplanation(false);
  };

  const handleNextStep = () => {
      if (appMode === 'concept') {
          const currentTab = SCENARIOS.concept.tabs[conceptTabIndex];
          if (conceptStep < currentTab.steps.length - 1) {
              setConceptStep(conceptStep + 1);
          } else if (conceptTabIndex < SCENARIOS.concept.tabs.length - 1) {
              setConceptTabIndex(conceptTabIndex + 1);
              setConceptStep(0);
          } else {
              setLessonFinished(true);
          }
      } else {
          handleNextPracticeDrill();
      }
  };

  const handlePrevStep = () => {
      if (appMode === 'concept') {
          if (conceptStep > 0) {
              setConceptStep(conceptStep - 1);
              setQuizSelection(null);
              setQuizFeedbackMode(false);
              setShowExplanation(false);
          } else if (conceptTabIndex > 0) {
              setConceptTabIndex(conceptTabIndex - 1);
              setConceptStep(SCENARIOS.concept.tabs[conceptTabIndex - 1].steps.length - 1);
              setQuizSelection(null);
              setQuizFeedbackMode(false);
              setShowExplanation(false);
          }
      }
  };

  const handleNextPracticeDrill = () => {
      if (practiceStep < SCENARIOS.practice.length - 1) {
          setPracticeStep(practiceStep + 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
      } else {
          setLessonFinished(true);
          setShowFinishModal(true);
      }
  }

  // Render Left Panel Content dynamically
  const renderLeftPanel = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Definition Box */}
            <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0`}>
                <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                    {appMode === 'concept' ? <Target size={24} strokeWidth={2.5}/> : <FileText size={24} strokeWidth={2.5}/>}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                        {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.title : `Drill ${practiceStep + 1}/5: ${currentStepInfo.title}`}
                    </span>
                    <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                        {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.text : currentStepInfo.text}
                    </p>
                </div>
            </div>
            
            {/* Explanation Section (Only shown in practice mode on explicit click) */}
            <AnimatePresence>
                {showExplanation && appMode === 'practice' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex-shrink-0"
                    >
                        <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0 h-full`}>
                            <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                                <Info size={24} strokeWidth={2.5}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                                    Explanation
                                </span>
                                <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                                    {currentStepInfo.mcq.explanation}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
  };

  const topTag = appMode === 'concept' ? "DATA ANALYSIS" : "PRACTICE SCENARIO";

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Line Charts" : "Percentage Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: The Chart Viewer (TOP AREA) */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[380px] lg:min-h-[420px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full max-w-[650px]">
                
                {/* Data Title Overlay Above Chart */}
                <div className="text-white/80 font-black text-[13px] sm:text-[14px] uppercase tracking-widest text-center mb-2">
                    {currentData.title}
                </div>
                
                {/* SVG Chart Area */}
                <div className={`relative bg-[#3e2723] rounded-2xl border-[4px] ${shouldShowVisualAid ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'border-yellow-500/30'} shadow-inner w-full flex-1 flex flex-col items-center justify-center transition-all duration-500`}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible">
                        
                        {/* Grid Lines (Faint) */}
                        {Array.from({length: yTickCount}).map((_, i) => {
                            const y = originY - (i * (drawHeight / (yTickCount - 1)));
                            return <line key={`grid-${i}`} x1={originX} y1={y} x2={chartWidth - padRight} y2={y} stroke="white" strokeWidth="1" opacity="0.1" />;
                        })}

                        {/* Axes */}
                        <g>
                            <line x1={originX} y1={originY} x2={chartWidth - padRight + 10} y2={originY} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                            <line x1={originX} y1={originY} x2={originX} y2={padTop - 10} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                            
                            {/* Y Labels */}
                            {Array.from({length: yTickCount}).map((_, i) => {
                                const val = yMin + i * ((yMax - yMin)/(yTickCount - 1));
                                const y = originY - (i * (drawHeight / (yTickCount - 1)));
                                return <text key={`yl-${i}`} x={originX - 8} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{parseFloat(val.toFixed(2))}</text>;
                            })}

                            {/* X Labels */}
                            {points.map((p, i) => (
                                <text key={`xl-${i}`} x={p.x} y={originY + 18} fill="#a88a6d" fontSize="9" fontWeight="bold" textAnchor="middle">{p.label}</text>
                            ))}

                            {/* Axis Titles */}
                            <text x={originX + drawWidth/2} y={chartHeight - 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
                            <text x={12} y={originY - drawHeight/2} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
                        </g>

                        {/* The Connecting Line */}
                        <path 
                            d={pathD} 
                            fill="none" 
                            stroke={shouldShowVisualAid ? "#4ade80" : "#fbbf24"} 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
                        />

                        {/* Static & Interactive Points */}
                        {points.map((p, i) => {
                            const isTargetPoint = appMode === 'concept' && currentStepInfo.type === 'interactive_point' && currentStepInfo.targetIndex === i;
                            let pointColor = shouldShowVisualAid ? "#4ade80" : "#f8fafc";
                            
                            return (
                                <g key={`p-${i}`}>
                                    {/* Pulsing effect if interactive target */}
                                    {isTargetPoint && (
                                        <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px`, pointerEvents: "none" }} />
                                    )}
                                    
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r="6" 
                                        fill={isTargetPoint ? "#fde047" : pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))", pointerEvents: "none" }} 
                                    />
                                    <text 
                                        x={p.x} y={p.y - 12} 
                                        fill={isTargetPoint ? "#fde047" : pointColor} 
                                        fontSize="11" 
                                        fontWeight="bold" 
                                        textAnchor="middle"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {parseFloat(p.val.toFixed(2))}
                                    </text>
                                </g>
                            )
                        })}
                        
                        {/* Visual Aid (Rendered LAST so it appears ON TOP) */}
                        {visualAidNode}
                    </svg>
                </div>
            </div>
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels (BOTTOM 2-COLUMN AREA) */}
        <div className="w-full bg-[#3e2723] p-4 sm:p-6 lg:p-8 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-2 shrink-0 overflow-hidden min-h-[350px] lg:min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-4 sm:gap-6 lg:gap-8 h-full relative z-10">
            
            {/* Left Column: Core Concepts */}
            <div className="flex flex-col gap-4 h-full">
                {renderLeftPanel()}
            </div>

            {/* Right Column: Teacher Guidance & Q&A Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[300px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {/* STATE 1: Lesson Finished */}
                        {lessonFinished && appMode === 'concept' ? (
                            <motion.div key="concept-finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                                <Trophy size={70} className="text-yellow-400 opacity-50" />
                                <h3 className="text-white text-[20px] sm:text-[24px] font-black uppercase tracking-widest">Concept Mastered!</h3>
                                <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You successfully learned how to deduce equations and compute absolute values from a percentage chart.</p>
                                <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                    Start Practice Drills
                                </button>
                            </motion.div>
                        ) : (
                            /* STATE 2A: Concept Mode (Interactive & Tabs) */
                            appMode === 'concept' ? (
                                <motion.div key={`panel-concept-${conceptTabIndex}-${conceptStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    
                                    {/* Tabs Header */}
                                    <div className="flex justify-center gap-2 pb-3 mb-1 overflow-x-auto hide-scrollbar border-b border-white/10">
                                        {SCENARIOS.concept.tabs.map((tab, idx) => (
                                            <button
                                              key={tab.id}
                                              onClick={() => { setConceptTabIndex(idx); setConceptStep(0); setInteractiveCompleted(false); setQuizSelection(null); setQuizFeedbackMode(false); }}
                                              className={`px-4 py-2 rounded-xl text-[11px] sm:text-[12px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                                                conceptTabIndex === idx ? 'bg-indigo-600 text-white shadow-md' : 'bg-black/20 text-white/50 hover:text-white hover:bg-black/40'
                                              }`}
                                            >
                                              {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Highlighted Objective Block */}
                                    <div className="bg-indigo-900/40 border border-indigo-500/50 p-3.5 rounded-xl mb-2 flex gap-3 items-start shadow-md relative">
                                        {(conceptStep > 0 || conceptTabIndex > 0) && (
                                            <button onClick={handlePrevStep} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-indigo-400 hover:text-white hover:bg-indigo-500/30 transition-colors">
                                                <ChevronLeft size={20} />
                                            </button>
                                        )}
                                        <div className={`flex gap-3 items-start ${ (conceptStep > 0 || conceptTabIndex > 0) ? 'ml-8' : ''}`}>
                                            <Target size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-indigo-400 uppercase tracking-widest text-[11px] font-black mb-1">Objective</span>
                                                <span className="text-indigo-50 text-[13px] sm:text-[14px] leading-snug font-medium">
                                                    {currentObjective}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Step */}
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-center items-center gap-2 mb-2">
                                            {currentStepInfo.type === 'interactive_point' ? <Eye size={16} className="text-yellow-400"/> : 
                                             currentStepInfo.type === 'mcq' ? <Compass size={16} className="text-yellow-400"/> :
                                             <BookOpen size={16} className="text-yellow-400"/>}
                                            <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest">
                                                Step {conceptStep + 1}: {currentStepInfo.concept}
                                            </span>
                                        </div>

                                        {currentStepInfo.type === 'mcq' ? (
                                            /* Concept MCQ Form */
                                            <div className="flex flex-col h-full">
                                                <p className="text-white font-bold text-[14px] sm:text-[16px] leading-snug tracking-tight mb-4 whitespace-pre-line">
                                                    {currentStepInfo.q}
                                                </p>

                                                <div className="flex flex-col gap-2 mb-4">
                                                    {shuffledIndices.map((origIdx) => {
                                                        const opt = currentStepInfo.options[origIdx];
                                                        const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.correct;
                                                        const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.correct;
                                                        
                                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
                                                        if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
                                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                        
                                                        return (
                                                            <button 
                                                                key={origIdx} 
                                                                disabled={quizFeedbackMode}
                                                                onClick={() => handleQuizSelection(origIdx)} 
                                                                className={`w-full py-3.5 px-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Feedback Footer Area (Post Answer) */}
                                                <div className="mt-auto pt-2 min-h-[90px] flex flex-col justify-end">
                                                    {quizFeedbackMode && !isCorrectAnswer && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                                                            <p className="text-rose-400 text-[13px] sm:text-[14px] font-bold italic text-center leading-tight">
                                                                {`"${currentStepInfo.feedback[quizSelection]}"`}
                                                            </p>
                                                            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                                <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); }} className="w-full py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95 flex-1">
                                                                    Try Again
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    {isCorrectAnswer && (
                                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                                                            <div className="bg-green-400/10 p-3 sm:p-4 rounded-xl border border-green-500/20 flex gap-3 items-center justify-center">
                                                                <CheckCircle className="text-green-400 shrink-0" size={20} />
                                                                <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Logic Correct!</span>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                                <button onClick={handleNextStep} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                                    {conceptStep === SCENARIOS.concept.tabs[conceptTabIndex].steps.length - 1 && conceptTabIndex === SCENARIOS.concept.tabs.length - 1 ? 'Finish' : 'Continue'}
                                                                    <ArrowRight size={16} />
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Teach or Interactive Point Form */
                                            <>
                                                <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-4 sm:p-5 rounded-[1.5rem] shadow-inner mb-4 flex-1">
                                                     <p className="text-indigo-100 font-medium text-[14px] sm:text-[16px] leading-relaxed tracking-wide whitespace-pre-line">
                                                         {currentStepInfo.instruction}
                                                     </p>
                                                </div>
                                                
                                                {/* Navigation Footer */}
                                                <div className="mt-auto pt-2 min-h-[60px] flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-between w-full">
                                                    
                                                    {(currentStepInfo.type === 'teach' || currentStepInfo.type === 'interactive_point') ? (
                                                        <motion.button initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} onClick={handleNextStep} className="flex-1 py-4 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                            {currentStepInfo.actionButtonText || 'Continue'}
                                                            <ArrowRight size={18} />
                                                        </motion.button>
                                                    ) : (
                                                        <div className="flex-1"></div> // spacer
                                                    )}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </motion.div>
                            ) : (
                                /* STATE 2B: Practice Mode (MCQ) */
                                <motion.div key={`panel-practice-${practiceStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    <div className="flex items-center justify-center border-b border-white/10 pb-3 mb-1">
                                        <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                            <Compass size={16}/> Practice Analysis
                                        </span>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-4 whitespace-pre-line">
                                            {currentStepInfo.mcq.q}
                                        </p>

                                        <div className="flex flex-col gap-2.5 mb-4">
                                            {shuffledIndices.map((origIdx) => {
                                                const opt = currentStepInfo.mcq.options[origIdx];
                                                const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.mcq.correct;
                                                const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.mcq.correct;
                                                
                                                let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
                                                if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
                                                else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                
                                                return (
                                                    <button 
                                                        key={origIdx} 
                                                        disabled={quizFeedbackMode}
                                                        onClick={() => handleQuizSelection(origIdx)} 
                                                        className={`w-full py-3.5 px-4 rounded-xl font-black uppercase text-[13px] sm:text-[14px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Feedback Footer Area */}
                                        <div className="mt-auto pt-2 min-h-[90px] flex flex-col justify-end">
                                            {quizFeedbackMode && !isCorrectAnswer && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                                                    <p className="text-rose-400 text-[13px] sm:text-[14px] font-bold italic text-center leading-tight">
                                                        "Not quite right. Check your analysis again."
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                        <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false); }} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95">
                                                            Try Again
                                                        </button>
                                                        {!showExplanation && (
                                                            <button onClick={() => setShowExplanation(true)} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                                View Explain
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {isCorrectAnswer && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                                                    <div className="bg-green-400/10 p-3 sm:p-4 rounded-xl border border-green-500/20 flex gap-3 items-center justify-center">
                                                        <CheckCircle className="text-green-400 shrink-0" size={20} />
                                                        <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Correct!</span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                        {!showExplanation && (
                                                            <button onClick={() => setShowExplanation(true)} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                                View Explain
                                                            </button>
                                                        )}
                                                        <button onClick={handleNextPracticeDrill} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                            {practiceStep === SCENARIOS.practice.length - 1 ? 'Finish' : 'Continue'}
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>

      </main>

      {/* Custom Alert Overlay for Finishing the Practice Laboratory */}
      <AnimatePresence>
        {showFinishModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
               <motion.div 
                   initial={{ scale: 0.9, y: 20 }} 
                   animate={{ scale: 1, y: 0 }} 
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-5 w-full max-w-md text-center relative"
               >
                  <div className="bg-yellow-500/20 p-4 rounded-full">
                      <Trophy size={64} className="text-yellow-400 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-widest">
                          Lab Complete!
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base font-medium px-4">
                          You have successfully mastered Chart Reading!
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset('concept'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart Lab</button>
                     <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Close Menu</button>
                  </div>
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }