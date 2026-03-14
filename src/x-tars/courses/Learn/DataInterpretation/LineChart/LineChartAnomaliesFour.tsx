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
  Info,
  AlertTriangle,
  MousePointer2
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
        title: "Concept: Finding Chart Anomalies",
        text: "Sometimes charts contain errors! Always verify the visual chart against the original data.\n\n• Compare the chart dots to the Data Reference table.\n• Drag the incorrect dot up or down to fix the anomaly."
    },
    chartData: {
      title: "Factory Output (Units per Week)",
      xLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"],
      targetValues: [20, 40, 30, 70, 50],
      initialValues: [20, 40, 60, 70, 50], // Anomaly at Wk 3 (is 60, should be 30)
      yMin: 0, yMax: 80, yTickCount: 5, snapStep: 10,
      xLabelTitle: "Weeks", yLabelTitle: "Units Built"
    },
    teachingSteps: [
      { 
        id: "step-0",
        type: 'mcq',
        concept: "Read the Table",
        selectionPrompt: "Let's learn how to spot errors! Look at the Data Reference table on the left. What should the exact value for Wk 3 be?",
        options: ["20", "30", "60"],
        correct: 1,
        feedback: [
          "20 is the target value for Wk 1.",
          "Correct! The table clearly states that Wk 3 should be 30.",
          "60 is not the value shown in the table for Wk 3."
        ]
      },
      { 
        id: "step-1",
        type: 'mcq',
        concept: "Read the Chart",
        selectionPrompt: "Now look at the Chart Viewer above. Where is the dot for Wk 3 currently plotted?",
        options: ["30", "40", "60"],
        correct: 2,
        feedback: [
          "It should be 30, but look higher on the chart!",
          "40 is the value for Wk 2.",
          "Exactly! The dot is mistakenly plotted way up at 60."
        ],
        visualAid: { type: 'highlight_point', index: 2, label: "PLOTTED AT 60" }
      },
      { 
        id: "step-2",
        type: 'mcq',
        concept: "Spot the Anomaly",
        selectionPrompt: "The table says 30, but the chart shows 60. We've found a data anomaly! What should we do to fix it?",
        options: ["Drag the dot UP to 70", "Drag the dot DOWN to 30", "Leave it alone"],
        correct: 1,
        feedback: [
          "70 is the target for Wk 4, not Wk 3.",
          "Perfect! We need to move the dot down so the chart accurately reflects the data table.",
          "We can't leave errors in our data reporting!"
        ]
      },
      { 
        id: "step-3",
        type: 'action',
        concept: "Fixing the Chart",
        selectionPrompt: "Your turn! Drag the yellow dot for Wk 3 down to exactly 30 to match the table.",
        actionButtonText: "Check Chart Fix"
      }
    ]
  },
  practice: [
    {
      title: "Temperature Log",
      text: "Find and fix the anomaly in the daily temperature chart.",
      chartData: {
          xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          targetValues: [15, 20, 25, 20, 10],
          initialValues: [15, 20, 10, 20, 10], // Anomaly at Wed
          yMin: 0, yMax: 40, yTickCount: 5, snapStep: 5,
          xLabelTitle: "Days", yLabelTitle: "Temp (°C)"
      },
      mcq: {
          q: "Compare the chart to the Data Reference table. Which day is plotted incorrectly?",
          options: ["Tuesday", "Wednesday", "Thursday"], correct: 1, 
          explanation: "Wednesday is plotted at 10°C, but the data table says it should be 25°C."
      },
      fixPrompt: "Drag Wednesday's dot up to 25°C to fix the chart!"
    },
    {
      title: "Monthly Sales",
      text: "Review the store's monthly revenue data.",
      chartData: {
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May"],
          targetValues: [20, 40, 50, 30, 60],
          initialValues: [20, 40, 30, 30, 60], // Anomaly at Mar
          yMin: 0, yMax: 80, yTickCount: 5, snapStep: 10,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($k)"
      },
      mcq: {
          q: "Which month has an anomaly (an incorrect value) on the chart?",
          options: ["February", "March", "April"], correct: 1, 
          explanation: "March is plotted at 30, but the data table shows it should be 50."
      },
      fixPrompt: "Drag March's dot up to 50 to correct the revenue data!"
    },
    {
      title: "Math Scores",
      text: "Check the student's test scores.",
      chartData: {
          xLabels: ["Test 1", "Test 2", "Test 3", "Test 4"],
          targetValues: [60, 80, 70, 90],
          initialValues: [60, 80, 70, 50], // Anomaly at Test 4
          yMin: 40, yMax: 100, yTickCount: 4, snapStep: 10,
          xLabelTitle: "Exams", yLabelTitle: "Marks"
      },
      mcq: {
          q: "Which test score is plotted incorrectly on the chart?",
          options: ["Test 2", "Test 3", "Test 4"], correct: 2, 
          explanation: "Test 4 is plotted at a low 50, but the student actually scored a 90."
      },
      fixPrompt: "Drag Test 4's dot up to 90 to fix their grade!"
    },
    {
      title: "Rainfall Log",
      text: "Analyze the monthly rainfall measurements.",
      chartData: {
          xLabels: ["Apr", "May", "Jun", "Jul"],
          targetValues: [30, 50, 80, 40],
          initialValues: [30, 20, 80, 40], // Anomaly at May
          yMin: 0, yMax: 100, yTickCount: 6, snapStep: 10,
          xLabelTitle: "Months", yLabelTitle: "Rain (mm)"
      },
      mcq: {
          q: "Which month's rainfall data is wrong on the chart?",
          options: ["April", "May", "June"], correct: 1, 
          explanation: "May is plotted at 20mm, but the table records 50mm."
      },
      fixPrompt: "Drag May's dot up to 50mm to fix the weather report!"
    },
    {
      title: "Savings Tracker",
      text: "Look at the personal savings data over 5 months.",
      chartData: {
          xLabels: ["M1", "M2", "M3", "M4", "M5"],
          targetValues: [10, 20, 40, 50, 60],
          initialValues: [50, 20, 40, 50, 60], // Anomaly at M1
          yMin: 0, yMax: 60, yTickCount: 4, snapStep: 10,
          xLabelTitle: "Months", yLabelTitle: "Savings ($)"
      },
      mcq: {
          q: "Which month contains a data anomaly on the chart?",
          options: ["M1", "M2", "M3"], correct: 0, 
          explanation: "M1 is incorrectly plotted at 50, when it should start at 10."
      },
      fixPrompt: "Drag the dot for M1 down to 10 to correct the savings chart!"
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

  // Phase State (Practice Mode only: 'mcq' -> 'fix' -> 'success')
  const [practicePhase, setPracticePhase] = useState('mcq');

  // Interactive Chart State
  const [userValues, setUserValues] = useState([]);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [actionError, setActionError] = useState("");
  const svgRef = useRef(null);

  // MCQ State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[practiceStep].chartData;
  const currentStepInfo = appMode === 'concept' ? SCENARIOS.concept.teachingSteps[conceptStep] : SCENARIOS.practice[practiceStep];
  
  const { yMin, yMax, yTickCount, snapStep, xLabels, targetValues, initialValues, xLabelTitle, yLabelTitle } = currentData;

  // Initialization & Reset when Drill/Mode changes
  useEffect(() => {
      // We ONLY load initial values when the app mode or practice drill changes.
      // This prevents the chart from resetting when advancing through concept steps!
      const initial = appMode === 'concept' ? SCENARIOS.concept.chartData.initialValues : SCENARIOS.practice[practiceStep].chartData.initialValues;
      setUserValues([...initial]);
      setActionError("");
      setDraggingIdx(null);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
      
      if (appMode === 'practice') {
          setPracticePhase('mcq');
      }
  }, [appMode, practiceStep]); // Intentionally omitting conceptStep

  // Handle MCQ Shuffle for Questions
  useEffect(() => {
      const currentMCQ = appMode === 'concept' 
          ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) 
          : currentStepInfo.mcq;
          
      if (currentMCQ?.options) {
          const arr = Array.from({length: currentMCQ.options.length}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [appMode, conceptStep, practiceStep, currentStepInfo, practicePhase]);

  function handleReset(overrideMode = appMode) {
    setConceptStep(0);
    setPracticeStep(0);
    setLessonFinished(false);
    setShowFinishModal(false);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setActionError("");
    setDraggingIdx(null);
    if (overrideMode === 'practice') setPracticePhase('mcq');
    
    const initialData = overrideMode === 'concept' ? SCENARIOS.concept.chartData.initialValues : SCENARIOS.practice[0].chartData.initialValues;
    setUserValues([...initialData]);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // ==========================================
  // CHART RENDERING & DRAG LOGIC
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

  // Calculate coordinates based on USER values (so they can drag them)
  const points = userValues.map((val, idx) => {
      const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
      const yRatio = (val - yMin) / (yMax - yMin);
      const y = originY - (yRatio * drawHeight);
      return { x, y, val, label: xLabels[idx], idx };
  });

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Drag Handlers
  const handlePointerMove = (e) => {
      if (draggingIdx === null || !svgRef.current) return;
      if (e.cancelable) e.preventDefault();

      const rect = svgRef.current.getBoundingClientRect();
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientY) return;

      const yPx = clientY - rect.top;
      const viewBoxRatio = chartHeight / rect.height; 
      const svgY = yPx * viewBoxRatio;

      let val = yMin + ((originY - svgY) / drawHeight) * (yMax - yMin);
      val = Math.round(val / snapStep) * snapStep;
      val = Math.max(yMin, Math.min(yMax, val));

      setUserValues(prev => {
          const next = [...prev];
          next[draggingIdx] = val;
          return next;
      });
  };

  const handlePointerUp = () => setDraggingIdx(null);

  // Validation Logic
  const validateChart = () => {
      // Check if all current user values match the target values
      const isFixed = userValues.every((v, i) => v === targetValues[i]);
      if (isFixed) {
          setActionError("");
          if (appMode === 'concept') {
              if (conceptStep === SCENARIOS.concept.teachingSteps.length - 1) {
                  setLessonFinished(true);
              } else {
                  handleNextStep();
              }
          } else {
              setPracticePhase('success'); // Show success screen for the drill
          }
      } else {
          setActionError("That's not quite right! Check the Data Reference table carefully.");
      }
  };

  // Determine App State Context
  const isChartFixed = userValues.every((v, i) => v === targetValues[i]);
  const isActionPhase = (appMode === 'concept' && currentStepInfo.type === 'action') || (appMode === 'practice' && practicePhase === 'fix');
  const showGreenChart = isChartFixed && !isActionPhase; // Turn green when successfully fixed and not actively dragging

  const getIsDraggable = (idx) => {
      return isActionPhase; // Allow dragging any point during the action phase
  };

  // Visual Aids Calculation (Only show in Concept Mode MCQ steps if correct)
  let visualAidNode = null;
  const currentMCQ = appMode === 'concept' ? currentStepInfo : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && quizSelection === currentMCQ?.correct;
  const shouldShowVisualAid = appMode === 'concept' && currentStepInfo.type === 'mcq' && (isCorrectAnswer || showExplanation);
  
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
              setQuizSelection(null);
              setQuizFeedbackMode(false);
              setShowExplanation(false);
          } else {
              setLessonFinished(true);
          }
      } else {
          // Practice Mode MCQ -> Fix phase
          setPracticePhase('fix');
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
      }
  };

  const handleNextPracticeDrill = () => {
      if (practiceStep < SCENARIOS.practice.length - 1) {
          setPracticeStep(practiceStep + 1);
          setPracticePhase('mcq');
      } else {
          setLessonFinished(true);
          setShowFinishModal(true);
      }
  }

  // Render Left Panel Content dynamically
  const renderLeftPanel = () => {
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Target Data Table - ALWAYS show so user can compare it to the chart */}
            <div className="flex-1 flex flex-col bg-[#2a1a16]/95 border-[3px] border-yellow-500/30 rounded-[1.5rem] overflow-hidden shadow-lg min-h-[180px]">
                <div className="bg-yellow-500/20 px-4 py-3 flex items-center justify-between border-b border-yellow-500/30 shrink-0">
                    <div className="flex items-center gap-2">
                        <TableIcon size={16} className="text-yellow-400"/>
                        <span className="text-yellow-400 font-black text-[12px] uppercase tracking-wider">Data Reference</span>
                    </div>
                </div>
                <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 bg-black/40 text-white/50 text-[11px] font-black uppercase tracking-wider px-4 py-2 sticky top-0 z-10">
                        <span>{xLabelTitle}</span>
                        <span className="text-right">{yLabelTitle}</span>
                    </div>
                    {xLabels.map((lbl, i) => (
                        <div key={i} className="grid grid-cols-2 text-white text-[14px] font-bold px-4 py-3 border-t border-white/5 hover:bg-white/5 transition-colors">
                            <span className="text-indigo-300">{lbl}</span>
                            <span className="text-right">{targetValues[i]}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Explanation Section */}
            <AnimatePresence>
                {showExplanation && (
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
                                    {appMode === 'concept' ? currentStepInfo.feedback[currentStepInfo.correct] : currentStepInfo.mcq.explanation}
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

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Chart Anomalies Lab" : "Error Correction Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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
                <div 
                    className={`relative bg-[#3e2723] rounded-2xl border-[4px] ${showGreenChart ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'border-yellow-500/30'} shadow-inner w-full flex-1 flex flex-col items-center justify-center transition-all duration-500 touch-none`}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible">
                        
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
                            stroke={showGreenChart ? "#4ade80" : "#fbbf24"} 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
                        />

                        {/* Points & Drag Interaction */}
                        {points.map((p, i) => {
                            const isDraggable = getIsDraggable(i);
                            const isDraggingThis = draggingIdx === i;
                            let pointColor = "#f8fafc"; // default white
                            
                            if (showGreenChart) pointColor = "#4ade80"; // green if fully solved
                            else if (isDraggingThis) pointColor = "#fde047"; // yellow while dragging
                            else if (isActionPhase) pointColor = "#fde047"; // all points glow slightly during action phase to indicate draggability

                            return (
                                <g key={`p-${i}`} className={isDraggable ? "cursor-ns-resize" : ""}>
                                    {/* Invisible hit target for touch */}
                                    {isDraggable && (
                                        <circle 
                                            cx={p.x} cy={p.y} r="25" fill="transparent" 
                                            onPointerDown={(e) => { setDraggingIdx(i); handlePointerMove(e); }} 
                                        />
                                    )}
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r={isDraggingThis ? 9 : 6} 
                                        fill={pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))", pointerEvents: "none" }} 
                                    />
                                    <text 
                                        x={p.x} y={p.y - 12} 
                                        fill={pointColor} 
                                        fontSize="11" 
                                        fontWeight="bold" 
                                        textAnchor="middle"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {p.val}
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
                                <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You successfully learned how to spot data errors and physically fix anomalies on a line chart.</p>
                                <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                    Start Practice Drills
                                </button>
                            </motion.div>
                        ) : (
                            /* STATE 2: Handling Practice Phases or Concept Steps */
                            <motion.div key={`panel-${appMode === 'concept' ? conceptStep : practiceStep}-${isActionPhase ? 'action' : 'mcq'}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                    <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                        <Compass size={16}/> 
                                        {appMode === 'concept' ? `Step ${conceptStep + 1}: ${currentStepInfo.concept}` : (practicePhase === 'success' ? 'Drill Complete' : 'Chart Analysis')}
                                    </span>
                                </div>
                                
                                {/* 2A: Action Phase (Drag to Fix) */}
                                {isActionPhase && (
                                    <div className="flex flex-col h-full gap-4">
                                        <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-2">
                                            {appMode === 'concept' ? currentStepInfo.selectionPrompt : currentStepInfo.fixPrompt}
                                        </p>
                                        <div className="bg-yellow-400/10 border border-yellow-400/40 p-4 rounded-xl shadow-inner flex gap-3 items-start">
                                            <MousePointer2 size={22} className="text-yellow-400 shrink-0 mt-0.5" />
                                            <p className="text-yellow-400 text-[13px] sm:text-[14px] italic leading-relaxed font-bold">
                                                Drag the incorrect dot on the chart UP or DOWN until it matches the Target Data table.
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2 mt-auto pt-4">
                                            <button 
                                                onClick={validateChart}
                                                className={`w-full py-4 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all shadow-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 flex justify-center items-center gap-2`}
                                            >
                                                <CheckCircle size={18} /> Check Chart Fix
                                            </button>
                                            {actionError && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-rose-400 font-bold text-[12px] sm:text-[13px] bg-rose-500/10 py-2 rounded-lg border border-rose-500/20 px-2 text-center">
                                                    <AlertTriangle size={14} className="shrink-0" /> {actionError}
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 2B: Success Phase (Practice Mode after fix) */}
                                {appMode === 'practice' && practicePhase === 'success' && (
                                    <div className="flex flex-col h-full gap-4 justify-center items-center text-center pb-4">
                                        <CheckCircle size={56} className="text-green-400" />
                                        <p className="text-white font-black uppercase tracking-widest text-[18px] sm:text-[20px]">Perfectly Fixed!</p>
                                        <p className="text-white/70 px-4 leading-relaxed font-medium">The line chart now perfectly aligns with the target data references.</p>
                                        
                                        <button 
                                            onClick={handleNextPracticeDrill}
                                            className="w-full mt-4 py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all shadow-[0_0_20px_rgba(74,222,128,0.4)] bg-green-600 text-white hover:bg-green-500 active:scale-95 flex justify-center items-center gap-2"
                                        >
                                            {practiceStep < SCENARIOS.practice.length - 1 ? 'Next Drill' : 'Finish Lab'}
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                )}

                                {/* 2C: MCQ Phase (Finding Anomaly) */}
                                {!isActionPhase && !(appMode === 'practice' && practicePhase === 'success') && (
                                    <div className="flex flex-col h-full">
                                        <p className="text-white font-bold text-[15px] sm:text-[17px] leading-snug tracking-tight mb-4">
                                            {appMode === 'concept' ? currentStepInfo.selectionPrompt : currentStepInfo.mcq.q}
                                        </p>

                                        <div className="flex flex-col gap-2.5 mb-4">
                                            {shuffledIndices.map((origIdx) => {
                                                const mcqData = appMode === 'concept' ? currentStepInfo : currentStepInfo.mcq;
                                                const opt = mcqData.options[origIdx];
                                                const isCorrect = quizFeedbackMode && origIdx === mcqData.correct;
                                                const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== mcqData.correct;
                                                
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
                                                        <span className="text-green-400 font-black uppercase text-[13px] sm:text-[14px] tracking-widest">Anomaly Identified!</span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full">
                                                        {!showExplanation && (
                                                            <button onClick={() => setShowExplanation(true)} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                                View Explain
                                                            </button>
                                                        )}
                                                        <button onClick={handleNextStep} className="w-full sm:flex-1 py-3.5 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                            {appMode === 'concept' ? 'Continue' : 'Fix the Chart'}
                                                            <ArrowRight size={16} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                )}
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
                          You have successfully mastered Chart Error Correction!
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