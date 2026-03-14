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
    objective: "Find the value of Exports when the Ratio and Import values are given.",
    coreDefinition: {
        title: "Concept: Handling Ratios in Line Charts",
        text: "Line charts can display ratios instead of absolute values!\n\n• A ratio compares two quantities.\n• We can use algebra and the chart's data points to calculate missing absolute values!"
    },
    chartData: {
      title: "Ratio of Value of Imports to Exports Over the Years",
      xLabels: ["1995", "1996", "1997", "1998", "1999", "2000", "2001"],
      values: [0.65, 0.85, 0.35, 1.25, 1.40, 0.95, 1.55],
      yMin: 0.1, yMax: 1.6, yTickCount: 6, // 0.1, 0.4, 0.7, 1.0, 1.3, 1.6
      xLabelTitle: "Years", yLabelTitle: "Ratio (Import/Export)"
    },
    teachingSteps: [
      {
        id: "step-0",
        type: "mcq",
        concept: "The Formula",
        q: "First, based on the chart's Y-axis 'Ratio (Import/Export)', what is the correct formula?",
        options: ["Ratio = Imports + Exports", "Ratio = Imports ÷ Exports", "Ratio = Exports ÷ Imports"],
        correct: 1,
        feedback: [
            "A ratio uses division, not addition.",
            "Correct! Ratio = Imports ÷ Exports. We'll use this formula to solve the puzzle.",
            "Look at the label: 'Import/Export'. The first word is the numerator."
        ]
      },
      {
        id: "step-1",
        type: "mcq",
        concept: "Find the Ratio",
        q: "Now, we need the ratio for a specific year to use in our formula.\n\nLooking directly at the line chart above, what is the exact ratio value for the year 1998?",
        options: ["0.85", "1.25", "1.40"],
        correct: 1,
        feedback: [
            "0.85 is the ratio for 1996.",
            "Awesome! The chart clearly shows the Ratio for 1998 is 1.25.",
            "1.40 is the ratio for 1999."
        ],
        visualAid: { type: 'highlight_point', index: 3, label: "RATIO: 1.25" }
      },
      {
        id: "step-2",
        type: "mcq",
        concept: "Identify Given Values",
        q: "Let's assume the math problem states:\n'The Imports in 1998 were Rs. 250 crores.'\n\nBased on this given information, what is the exact value of Imports for that year?",
        options: ["1.25 crores", "250 crores", "Unknown"],
        correct: 1,
        feedback: [
            "1.25 is the Ratio, not the Import value.",
            "Exactly! The given Import value is 250 crores.",
            "The value is given right in the problem statement!"
        ]
      },
      {
        id: "step-3",
        type: "mcq",
        concept: "Substitute Values",
        q: "We now have our values!\n• Formula: Ratio = Imports ÷ Exports\n• Ratio = 1.25\n• Imports = 250\n\nIf we plug these numbers into our formula, which equation is correct?",
        options: ["1.25 = Exports ÷ 250", "1.25 = 250 ÷ Exports", "250 = 1.25 ÷ Exports"],
        correct: 1,
        feedback: [
            "You swapped Imports and Exports!",
            "Perfect! Substituting the values gives us: 1.25 = 250 ÷ Exports.",
            "You placed Imports on the left instead of the Ratio."
        ],
        visualAid: { type: 'show_equation', index: 3, line1: "Ratio = Imports ÷ Exports", line2: "1.25 = 250 ÷ Exports" }
      },
      {
        id: "step-4",
        type: "mcq",
        concept: "Compute Exports",
        q: "We have the equation:\n1.25 = 250 ÷ Exports\n\nTo find the actual value of Exports, how should we mathematically rearrange this equation?",
        options: ["Exports = 250 × 1.25", "Exports = 250 ÷ 1.25", "Exports = 1.25 ÷ 250"],
        correct: 1,
        feedback: [
            "Multiplying won't isolate the denominator correctly.",
            "Exactly! You swap the Ratio and Exports. Exports = 250 ÷ 1.25 = 200 crores.",
            "You swapped the numerator and the result. Exports = Imports ÷ Ratio."
        ],
        visualAid: { type: 'show_equation', index: 3, line1: "1.25 = 250 ÷ Exports", line2: "Exports = 200" }
      },
      {
        id: "step-5",
        type: "mcq",
        concept: "Compute Imports",
        q: "Now let's try the reverse! Let's assume for 1999, we are given:\n• Exports = 300 crores\n• Ratio (from chart) = 1.40\n\nEquation: 1.40 = Imports ÷ 300\nHow do we find the Imports?",
        options: ["Imports = 1.40 × 300", "Imports = 300 ÷ 1.40", "Imports = 1.40 + 300"],
        correct: 0,
        feedback: [
            "Brilliant! To isolate Imports, we multiply: Imports = 1.40 × 300 = 420 crores.",
            "That's dividing the export by the ratio. We need to multiply!",
            "Ratios involve multiplication and division, not addition."
        ],
        visualAid: { type: 'show_equation', index: 4, line1: "1.40 = Imports ÷ 300", line2: "Imports = 420" }
      }
    ]
  },
  practice: [
    {
      title: "Revenue to Cost Ratio",
      text: "Analyze the business performance. Ratio = Revenue ÷ Cost.",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [1.5, 2.0, 1.8, 1.2, 2.5],
          yMin: 0, yMax: 3.0, yTickCount: 4, // 0, 1, 2, 3
          xLabelTitle: "Years", yLabelTitle: "Rev / Cost Ratio"
      },
      mcq: {
          q: "In Year 2, the Revenue to Cost ratio is 2.0. If the Revenue was $100k, what was the Cost?",
          options: ["$50k", "$100k", "$200k"], correct: 0, 
          explanation: "Ratio = Revenue ÷ Cost\n2.0 = 100k ÷ Cost\nCost = 100k ÷ 2.0 = $50k."
      },
      visualAid: { type: 'show_equation', index: 1, line1: "100k ÷ Cost = 2.0", line2: "Cost = 50k" }
    },
    {
      title: "Boys to Girls Ratio",
      text: "Review the school demographic data. Ratio = Boys ÷ Girls.",
      chartData: {
          xLabels: ["Class 1", "Class 2", "Class 3", "Class 4"],
          values: [1.2, 0.8, 1.5, 1.0],
          yMin: 0, yMax: 2.0, yTickCount: 5,
          xLabelTitle: "Classes", yLabelTitle: "Boys / Girls Ratio"
      },
      mcq: {
          q: "In Class 3, the ratio of Boys to Girls is 1.5. If there are 20 Girls, how many Boys are there?",
          options: ["20 Boys", "30 Boys", "40 Boys"], correct: 1, 
          explanation: "Ratio = Boys ÷ Girls\n1.5 = Boys ÷ 20\nBoys = 1.5 × 20 = 30."
      },
      visualAid: { type: 'show_equation', index: 2, line1: "Boys ÷ 20 = 1.5", line2: "Boys = 30" }
    },
    {
      title: "Pass to Fail Ratio",
      text: "Check the student test metrics. Ratio = Passed ÷ Failed.",
      chartData: {
          xLabels: ["Test 1", "Test 2", "Test 3", "Test 4"],
          values: [3.0, 4.0, 2.5, 5.0],
          yMin: 0, yMax: 6.0, yTickCount: 4,
          xLabelTitle: "Exams", yLabelTitle: "Pass / Fail Ratio"
      },
      mcq: {
          q: "On Test 4, the Pass to Fail ratio is 5.0. If 10 students failed, how many passed?",
          options: ["20 passed", "30 passed", "50 passed"], correct: 2, 
          explanation: "Ratio = Passed ÷ Failed\n5.0 = Passed ÷ 10\nPassed = 5.0 × 10 = 50."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "Passed ÷ 10 = 5.0", line2: "Passed = 50" }
    },
    {
      title: "Cars to Trucks Sold",
      text: "Analyze the dealership sales. Ratio = Cars ÷ Trucks.",
      chartData: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May"],
          values: [2.5, 3.0, 1.5, 4.0, 2.0],
          yMin: 0, yMax: 5.0, yTickCount: 6,
          xLabelTitle: "Months", yLabelTitle: "Cars / Trucks Ratio"
      },
      mcq: {
          q: "In April (Apr), the ratio is 4.0. If they sold 80 cars, how many trucks did they sell?",
          options: ["10 trucks", "20 trucks", "320 trucks"], correct: 1, 
          explanation: "Ratio = Cars ÷ Trucks\n4.0 = 80 ÷ Trucks\nTrucks = 80 ÷ 4.0 = 20."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "80 ÷ Trucks = 4.0", line2: "Trucks = 20" }
    },
    {
      title: "Savings to Expenses Ratio",
      text: "Look at the personal finance data. Ratio = Savings ÷ Expenses.",
      chartData: {
          xLabels: ["M1", "M2", "M3", "M4"],
          values: [0.5, 0.8, 1.2, 1.5],
          yMin: 0, yMax: 2.0, yTickCount: 5,
          xLabelTitle: "Months", yLabelTitle: "Savings / Expenses"
      },
      mcq: {
          q: "In Month 3 (M3), the ratio is 1.2. If expenses were $500, what were the savings?",
          options: ["$400", "$500", "$600"], correct: 2, 
          explanation: "Ratio = Savings ÷ Expenses\n1.2 = Savings ÷ 500\nSavings = 1.2 × 500 = $600."
      },
      visualAid: { type: 'show_equation', index: 2, line1: "Savings ÷ 500 = 1.2", line2: "Savings = 600" }
    }
  ]
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // App State for Steps
  const [conceptStep, setConceptStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const containerRef = useRef(null);

  // MCQ State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[practiceStep].chartData;
  const currentStepInfo = appMode === 'concept' ? SCENARIOS.concept.teachingSteps[conceptStep] : SCENARIOS.practice[practiceStep];
  
  const { yMin, yMax, yTickCount, xLabels, values, xLabelTitle, yLabelTitle } = currentData;

  // Initialization & Reset when Drill/Mode changes
  useEffect(() => {
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
  }, [appMode, practiceStep, conceptStep]); 

  // Handle MCQ Shuffle for Questions
  useEffect(() => {
      const currentMCQ = appMode === 'concept' ? currentStepInfo : currentStepInfo.mcq;
          
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
    setConceptStep(0);
    setPracticeStep(0);
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
  const currentMCQ = appMode === 'concept' ? currentStepInfo : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
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
          if (conceptStep < SCENARIOS.concept.teachingSteps.length - 1) {
              setConceptStep(conceptStep + 1);
          } else {
              setLessonFinished(true);
          }
      } else {
          handleNextPracticeDrill();
      }
  };

  const handlePrevStep = () => {
      if (appMode === 'concept' && conceptStep > 0) {
          setConceptStep(conceptStep - 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
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
                        {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.title : `Drill ${practiceStep + 1}/5: ${currentStepInfo.title}`}
                    </span>
                    <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                        {infoText}
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

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Ratio Charts Lab" : "Ratio Math Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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

                        {/* Static Points */}
                        {points.map((p, i) => {
                            let pointColor = shouldShowVisualAid ? "#4ade80" : "#f8fafc";
                            return (
                                <g key={`p-${i}`}>
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r="6" 
                                        fill={pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }} 
                                    />
                                    <text 
                                        x={p.x} y={p.y - 12} 
                                        fill={pointColor} 
                                        fontSize="11" 
                                        fontWeight="bold" 
                                        textAnchor="middle"
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
                                <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You successfully learned how to deduce equations and compute absolute values from a ratio chart.</p>
                                <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                    Start Practice Drills
                                </button>
                            </motion.div>
                        ) : (
                            /* STATE 2A: Concept Mode (MCQ) */
                            appMode === 'concept' ? (
                                <motion.div key={`panel-concept-mcq-${conceptStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                        <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                            <Compass size={16}/> Step {conceptStep + 1}: {currentStepInfo.concept}
                                        </span>
                                    </div>

                                    {/* Highlighted Objective Block */}
                                    <div className="bg-indigo-900/40 border border-indigo-500/50 p-3.5 rounded-xl mb-2 flex gap-3 items-start shadow-md">
                                        <Target size={20} className="text-indigo-400 shrink-0 mt-0.5" />
                                        <div className="flex flex-col">
                                            <span className="text-indigo-400 uppercase tracking-widest text-[11px] font-black mb-1">Objective</span>
                                            <span className="text-indigo-50 text-[13px] sm:text-[14px] leading-snug font-medium">
                                                {SCENARIOS.concept.objective}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-4 whitespace-pre-line">
                                            {currentStepInfo.q}
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

                                        {/* Pre-Answer Footer (Shows Back Button if they haven't answered yet) */}
                                        {!quizFeedbackMode && conceptStep > 0 && (
                                            <div className="mt-2 flex justify-start">
                                                <button onClick={handlePrevStep} className="py-2.5 px-5 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-[#3e2723] text-white/80 border border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex items-center gap-1.5">
                                                    <ChevronLeft size={14} /> Back
                                                </button>
                                            </div>
                                        )}

                                        {/* Feedback Footer Area (Shows after user selects an answer) */}
                                        <div className="mt-auto pt-2 min-h-[90px] flex flex-col justify-end">
                                            {quizFeedbackMode && !isCorrectAnswer && (
                                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
                                                    <p className="text-rose-400 text-[13px] sm:text-[14px] font-bold italic text-center leading-tight">
                                                        {`"${currentStepInfo.feedback[quizSelection]}"`}
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                        {conceptStep > 0 && (
                                                             <button onClick={handlePrevStep} className="sm:w-auto px-6 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-[#3e2723] text-white/80 border-2 border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex justify-center items-center gap-2">
                                                                 <ChevronLeft size={16} /> Back
                                                             </button>
                                                        )}
                                                        <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false); }} className="w-full py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95 flex-1">
                                                            Try Again
                                                        </button>
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
                                                        {conceptStep > 0 && (
                                                             <button onClick={handlePrevStep} className="sm:w-auto px-6 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-[#3e2723] text-white/80 border-2 border-white/10 hover:bg-black/40 hover:text-white active:scale-95 flex justify-center items-center gap-2">
                                                                 <ChevronLeft size={16} /> Back
                                                             </button>
                                                        )}
                                                        <button onClick={handleNextStep} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                            {conceptStep === SCENARIOS.concept.teachingSteps.length - 1 ? 'Finish' : 'Continue'}
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* STATE 2B: Practice Mode (MCQ) */
                                <motion.div key={`panel-practice-${practiceStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                        <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                            <Compass size={16}/> Ratio Math Analysis
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
                                                        "Not quite right. Check your math again."
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
                                                        <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Math Correct!</span>
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
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }