import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  Compass,
  TrendingUp,
  Table as TableIcon,
  CheckCircle,
  FileText,
  Eye,
  ArrowRight,
  Target,
  Info
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
        title: "Concept: Analyzing Line Charts",
        text: "A Line Chart doesn't just show numbers; it lets us compare them visually!\n\n• Difference: The vertical gap between two dots.\n• Same Values: A perfectly flat line between dots.\n• Minimum: The lowest dot on the entire chart."
    },
    chartData: {
      title: "Percentage of Candidates Qualified Over the Years",
      xLabels: ["1994", "1995", "1996", "1997", "1998", "1999", "2000"],
      values: [40, 60, 70, 50, 90, 90, 60],
      yMin: 0, yMax: 100, yTickCount: 6, // 0, 20, 40, 60, 80, 100
      xLabelTitle: "Years", yLabelTitle: "Qualified %"
    },
    teachingSteps: [
      { 
        id: "step-1",
        concept: "Reading a Value",
        selectionPrompt: "Let's learn to calculate differences! First, look at the chart. What is the percentage of qualified candidates for the year 1996?",
        options: ["50%", "70%", "90%"],
        correct: 1,
        feedback: [
          "Look closely at the dot directly above 1996.",
          "Correct! The dot above 1996 aligns perfectly with 70%.",
          "90% is the value for 1998 and 1999."
        ],
        visualAid: { type: 'highlight_point', index: 2, label: "1996 VALUE" }
      },
      { 
        id: "step-2",
        concept: "Reading the Next Value",
        selectionPrompt: "Great! Now, find the percentage for the next year, 1997.",
        options: ["40%", "50%", "70%"],
        correct: 1,
        feedback: [
          "40% is for 1994. Find the dot for 1997.",
          "Perfect! The dot above 1997 drops down to 50%.",
          "70% was the previous year (1996)."
        ],
        visualAid: { type: 'highlight_point', index: 3, label: "1997 VALUE" }
      },
      { 
        id: "step-3",
        concept: "Calculating Differences",
        selectionPrompt: "To find the difference between 1996 and 1997, we subtract the lower value from the higher value: 70% - 50%. What is the difference?",
        options: ["10%", "20%", "30%"],
        correct: 1,
        feedback: [
          "Check your math: 70 - 50.",
          "Exactly! The vertical gap represents a 20% difference between those two years.",
          "30% is 80 - 50."
        ],
        visualAid: { type: 'show_difference', index1: 2, index2: 3, val1: 70, val2: 50 }
      },
      { 
        id: "step-4",
        concept: "Spotting Flat Lines",
        selectionPrompt: "Look at the line connecting 1998 and 1999. It is perfectly horizontal. What does a flat line tell us?",
        options: ["The value dropped to zero.", "The values are exactly the same.", "The value is increasing."],
        correct: 1,
        feedback: [
          "The line is high up at 90%, not at zero.",
          "Correct! A flat line means there was zero change; the percentage stayed exactly at 90%.",
          "An upward slope means it is increasing."
        ],
        visualAid: { type: 'highlight_segment', startIndex: 4, endIndex: 5, label: "FLAT LINE = NO CHANGE" }
      },
      { 
        id: "step-5",
        concept: "Finding the Minimum",
        selectionPrompt: "Finally, the 'minimum' is the absolute lowest point on the entire chart. In which year did the chart hit its minimum?",
        options: ["1994", "1997", "2000"],
        correct: 0,
        feedback: [
          "Exactly! 1994 is the lowest dot on the graph, resting at 40%.",
          "1997 is a dip (50%), but 1994 is lower (40%).",
          "2000 is 60%, which is higher than 1994."
        ],
        visualAid: { type: 'highlight_point', index: 0, label: "LOWEST POINT" }
      }
    ]
  },
  practice: [
    {
      title: "Monthly Revenue",
      text: "Analyze the store's monthly revenue.",
      chartData: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [20, 40, 40, 30, 60, 50],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($k)"
      },
      q: "Which two consecutive months had the exactly SAME revenue?",
      options: ["Jan & Feb", "Feb & Mar", "May & Jun"], correct: 1, 
      correctText: "FEB & MAR",
      explanation: "The flat line between February and March shows the revenue remained unchanged at $40k.",
      visualAid: { type: 'highlight_segment', startIndex: 1, endIndex: 2, label: "SAME VALUE" }
    },
    {
      title: "School Attendance",
      text: "Review the daily attendance for the week.",
      chartData: {
          xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [95, 90, 85, 85, 80],
          yMin: 70, yMax: 100, yTickCount: 4,
          xLabelTitle: "Days", yLabelTitle: "Attendance %"
      },
      q: "On which day was the attendance the MINIMUM?",
      options: ["Wednesday", "Thursday", "Friday"], correct: 2, 
      correctText: "FRIDAY",
      explanation: "Friday represents the absolute lowest point on the chart at 80%.",
      visualAid: { type: 'highlight_point', index: 4, label: "MINIMUM" }
    },
    {
      title: "Book Sales",
      text: "Check the bookstore's daily sales.",
      chartData: {
          xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          values: [30, 50, 40, 60, 60, 90, 70],
          yMin: 0, yMax: 100, yTickCount: 6,
          xLabelTitle: "Days", yLabelTitle: "Books Sold"
      },
      q: "What is the difference in books sold between Saturday and Sunday?",
      options: ["10 books", "20 books", "30 books"], correct: 1, 
      correctText: "20 BOOKS DIFFERENCE",
      explanation: "Saturday had 90 sales and Sunday had 70. 90 - 70 = 20 books.",
      visualAid: { type: 'show_difference', index1: 5, index2: 6, val1: 90, val2: 70 }
    },
    {
      title: "Website Traffic",
      text: "Analyze the website visitor data.",
      chartData: {
          xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          values: [500, 700, 400, 600, 800],
          yMin: 0, yMax: 1000, yTickCount: 6,
          xLabelTitle: "Days", yLabelTitle: "Visitors"
      },
      q: "On which day did the website receive the MINIMUM traffic?",
      options: ["Monday", "Wednesday", "Thursday"], correct: 1, 
      correctText: "WEDNESDAY",
      explanation: "The lowest point on the chart occurs on Wednesday, with 400 visitors.",
      visualAid: { type: 'highlight_point', index: 2, label: "MINIMUM" }
    },
    {
      title: "Gym Memberships",
      text: "Look at the gym's annual membership data.",
      chartData: {
          xLabels: ["2018", "2019", "2020", "2021"],
          values: [100, 150, 150, 200],
          yMin: 0, yMax: 250, yTickCount: 6,
          xLabelTitle: "Years", yLabelTitle: "Members"
      },
      q: "What is the difference in memberships between 2018 and 2019?",
      options: ["25 members", "50 members", "100 members"], correct: 1, 
      correctText: "50 MEMBERS DIFFERENCE",
      explanation: "In 2018 there were 100 members, and in 2019 there were 150. 150 - 100 = 50 members.",
      visualAid: { type: 'show_difference', index1: 0, index2: 1, val1: 100, val2: 150 }
    }
  ]
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // App State
  const [activeStep, setActiveStep] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const containerRef = useRef(null);

  // MCQ State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[activeStep].chartData;
  const currentStepInfo = appMode === 'concept' ? SCENARIOS.concept.teachingSteps[activeStep] : SCENARIOS.practice[activeStep];
  
  const { yMin, yMax, yTickCount, xLabels, values: targetValues, xLabelTitle, yLabelTitle } = currentData;

  // Handle MCQ Shuffle for Questions
  useEffect(() => {
      const currentQ = appMode === 'concept' ? SCENARIOS.concept.teachingSteps[activeStep] : SCENARIOS.practice[activeStep];
      if (currentQ?.options) {
          const arr = Array.from({length: currentQ.options.length}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [appMode, activeStep]);

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
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
  const points = targetValues.map((val, idx) => {
      const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
      const yRatio = (val - yMin) / (yMax - yMin);
      const y = originY - (yRatio * drawHeight);
      return { x, y, val, label: xLabels[idx], idx };
  });

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Visual Aids Calculation
  let visualAidNode = null;
  const isCorrectAnswer = quizFeedbackMode && quizSelection === currentStepInfo.correct;
  const shouldShowVisualAid = isCorrectAnswer || showExplanation;
  
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
          
          let segBoxX = midX - 70;
          if (segBoxX < padLeft - 10) segBoxX = padLeft - 10;
          if (segBoxX + 140 > chartWidth - padRight + 10) segBoxX = chartWidth - padRight - 130;

          visualAidNode = (
              <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                  <rect x={segBoxX} y={segBoxY} width="140" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
                  <text x={segBoxX + 70} y={segTextY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
              </motion.g>
          );
      } else if (aid.type === 'show_difference') {
          const p1 = points[aid.index1];
          const p2 = points[aid.index2];
          // Determine which point is higher visually (lower y coordinate)
          const highP = p1.y < p2.y ? p1 : p2;
          const lowP = p1.y > p2.y ? p1 : p2;
          const diff = Math.abs(aid.val1 - aid.val2);
          
          // Smart positioning: Put label perfectly between the two points to ensure visibility
          const boxWidth = 90;
          const midX = (p1.x + p2.x) / 2;
          let diffBoxX = midX - boxWidth / 2;
          
          // Ensure the box stays on screen
          if (diffBoxX < padLeft - 10) diffBoxX = padLeft - 5;
          if (diffBoxX + boxWidth > chartWidth - padRight + 10) diffBoxX = chartWidth - padRight - boxWidth + 5;
          
          // Place label strictly above the highest point
          let diffBoxY = highP.y - 45;
          
          // If it goes off the top edge, flip it to the bottom
          let isAbove = true;
          if (diffBoxY < 5) {
              diffBoxY = lowP.y + 25;
              isAbove = false;
          }
          
          const diffTextY = diffBoxY + 17;

          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {/* Highlight the points */}
                  <circle cx={p1.x} cy={p1.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <circle cx={p2.x} cy={p2.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />

                  {/* Horizontal projection from lower point */}
                  <line x1={lowP.x} y1={lowP.y} x2={highP.x} y2={lowP.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Vertical gap line */}
                  <line x1={highP.x} y1={lowP.y} x2={highP.x} y2={highP.y} stroke="#4ade80" strokeWidth="4" />
                  
                  {/* End caps for vertical line */}
                  <line x1={highP.x - 6} y1={lowP.y} x2={highP.x + 6} y2={lowP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={highP.x - 6} y1={highP.y} x2={highP.x + 6} y2={highP.y} stroke="#4ade80" strokeWidth="3" />
                  
                  {/* Connecting dashed line from label to gap line */}
                  <line 
                      x1={midX} 
                      y1={isAbove ? diffBoxY + 26 : diffBoxY} 
                      x2={highP.x} 
                      y2={(highP.y + lowP.y) / 2} 
                      stroke="#4ade80" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2" 
                  />

                  {/* Smart Positioned Label Box */}
                  <rect x={diffBoxX} y={diffBoxY} width={boxWidth} height={26} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.5))" }} />
                  <text x={diffBoxX + boxWidth / 2} y={diffTextY} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">
                      {Math.max(aid.val1, aid.val2)} - {Math.min(aid.val1, aid.val2)} = {diff}
                  </text>
              </motion.g>
          );
      }
  }

  // Interaction Handlers
  const handleQuizSelection = (idx) => {
      setQuizSelection(idx);
      setQuizFeedbackMode(true);
      setShowExplanation(false); // Hide explanation automatically when a new answer is selected
  };

  const handleNextStep = () => {
      const maxSteps = appMode === 'concept' ? SCENARIOS.concept.teachingSteps.length : SCENARIOS.practice.length;
      if (activeStep < maxSteps - 1) {
          setActiveStep(activeStep + 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
      } else {
          setLessonFinished(true);
          if (appMode === 'practice') {
              setShowFinishModal(true);
          }
      }
  };

  // Render Left Panel Content dynamically
  const renderLeftPanel = () => {
    const infoText = appMode === 'concept' ? SCENARIOS.concept.coreDefinition.text : currentStepInfo.text;
    
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Definition Box */}
            <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0`}>
                <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                    {appMode === 'concept' ? <Target size={24} strokeWidth={2.5}/> : <FileText size={24} strokeWidth={2.5}/>}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                        {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.title : `Drill ${activeStep + 1}/5: ${currentStepInfo.title}`}
                    </span>
                    <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                        {infoText}
                    </p>
                </div>
            </div>

            {/* Explanation Section (Styled same as Definition Box) */}
            <AnimatePresence>
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex-1"
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
                                    {appMode === 'concept' ? currentStepInfo.feedback[currentStepInfo.correct] : currentStepInfo.explanation}
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

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Chart Reading Lab" : "Data Analysis Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: The Chart Viewer (TOP AREA) */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[380px] lg:min-h-[420px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full max-w-[650px]">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                    {appMode === 'practice' && <><span className="text-yellow-500 mr-2 bg-yellow-500/20 px-3 py-1 rounded-md">Drill {activeStep + 1}</span></>}
                    <TrendingUp size={16} /> Chart Viewer
                </div>

                <div className="bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-black uppercase tracking-widest text-[11px] sm:text-[12px] mb-2 flex items-center gap-2">
                    <Eye size={14} className={shouldShowVisualAid ? "text-green-400" : "text-yellow-400"}/> 
                    {topTag}
                </div>

                {/* Data Title Overlay Above Chart */}
                <div className="text-white/80 font-black text-[13px] sm:text-[14px] uppercase tracking-widest text-center mt-2 mb-1">
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
                                return <text key={`yl-${i}`} x={originX - 8} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{val}</text>;
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
                            stroke="#fbbf24" 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
                        />

                        {/* Static Points */}
                        {points.map((p, i) => (
                            <g key={`p-${i}`}>
                                <circle 
                                    cx={p.x} 
                                    cy={p.y} 
                                    r="6" 
                                    fill="#f8fafc" 
                                    stroke="#3e2723" 
                                    strokeWidth="2" 
                                    style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }} 
                                />
                                <text 
                                    x={p.x} y={p.y - 12} 
                                    fill="#f8fafc" 
                                    fontSize="11" 
                                    fontWeight="bold" 
                                    textAnchor="middle"
                                >
                                    {p.val}
                                </text>
                            </g>
                        ))}
                        
                        {/* Visual Aid (Rendered LAST so it appears ON TOP of lines and points) */}
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
                                <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You successfully learned how to identify minimums, flat trends, and calculate differences on a chart.</p>
                                <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                    Start Practice Drills
                                </button>
                            </motion.div>
                        ) : (
                            /* STATE 2: Active Question */
                            <motion.div key={`question-panel-${activeStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                    <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                        <Compass size={16}/> {appMode === 'concept' ? `Step ${activeStep + 1}: ${currentStepInfo.concept}` : "Chart Analysis"}
                                    </span>
                                </div>
                                <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-4">
                                    {appMode === 'concept' ? currentStepInfo.selectionPrompt : currentStepInfo.q}
                                </p>

                                <div className="flex flex-col gap-2.5 mb-4">
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
                                                {appMode === 'concept' ? `"${currentStepInfo.feedback[quizSelection]}"` : `"Not quite right. Look closely at the chart again."`}
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
                                                <button onClick={handleNextStep} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                    {(appMode === 'concept' && activeStep === SCENARIOS.concept.teachingSteps.length - 1) ? 'Complete Concept' : 'Continue'}
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
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
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }