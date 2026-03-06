import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  HelpCircle,
  Zap,
  ArrowUpRight,
  Compass,
  Info,
  MousePointer2,
  Eye,
  FileText,
  Clock,
  CircleDot,
  ArrowLeft
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

const LOGIC_DATA = {
  concept: {
    question: "What is the exact angle between the hour hand and the minute hand of a clock at exactly 4:00?",
    clues: [
      { id: 1, step: 0, concept: "Minute Hand", explanation: "At exact hours (like 4:00, 5:00), the minute hand is always at the top of the clock.", text: "Identify the position of the Minute Hand at exactly 4:00." },
      { id: 2, step: 1, concept: "Hour Hand", explanation: "At exactly 4:00, the hour hand points precisely at the number 4.", text: "Identify the position of the Hour Hand at 4:00." },
      { id: 3, step: 2, concept: "The 30° Rule", explanation: "A circle is 360°. Divided by 12 hours, each 1-hour gap is exactly 30° (360 ÷ 12 = 30).", text: "Determine the angle of a single 1-hour gap." },
      { id: 4, step: 3, concept: "Counting Gaps", explanation: "Count the number of 1-hour spaces between 12 and 4.", text: "Calculate the total number of hour gaps between the two hands." },
      { id: 5, step: 4, concept: "Total Angle", explanation: "Total Angle = (Number of Gaps) × 30°.", text: "Multiply the gaps by 30° to find the final angle." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Minute Hand Position. At exactly 4:00, where does the MINUTE hand point on the clock face?",
        options: ["At 12", "At 4", "At 6"],
        correct: 0,
        feedback: [
          "Correct! At any exact hour, the minute hand points straight up at the 12.",
          "That is where the hour hand will be!",
          "That would mean it is 4:30."
        ],
        why: "The minute hand at 12 represents 0 minutes past the hour.",
        instruction: "Click on the number '12' on the clock face to place the Minute Hand.",
        requiredActionState: 'minute_placed'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Hour Hand Position. At exactly 4:00, where does the HOUR hand point on the clock face?",
        options: ["At 3", "At 4", "At 5"],
        correct: 1,
        feedback: [
          "That would mean it's 3:00.",
          "Exactly! Since it is 4:00 and zero minutes have passed, the hour hand is aimed perfectly at the 4.",
          "That would mean it's 5:00."
        ],
        why: "At the start of any hour, the hour hand points directly at that hour's number.",
        instruction: "Click on the number '4' on the clock face to place the Hour Hand.",
        requiredActionState: 'hour_placed'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: The 30° Rule. A full circle is 360°. A clock is divided into 12 equal hour sections. What is the angle of just ONE hour section (e.g., from 12 to 1)?",
        options: ["15°", "30°", "45°"],
        correct: 1,
        feedback: [
          "If one section was 15°, the whole clock would only be 180°.",
          "Perfect! 360° ÷ 12 sections = 30° per section. Every single hour gap is exactly 30°.",
          "If one section was 45°, 12 sections would be 540°!"
        ],
        why: "360 degrees divided by 12 equal hour slices equals 30 degrees per slice.",
        instruction: "Click the 'Show 1 Gap' button below the clock to visualize a 30° slice.",
        requiredActionState: 'one_gap_shown'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Counting Gaps. Look at the space between the minute hand (12) and the hour hand (4). How many 1-hour gaps are between them?",
        options: ["3 gaps", "4 gaps", "5 gaps"],
        correct: 1,
        feedback: [
          "Count carefully: 12-1, 1-2, 2-3, 3-4.",
          "Correct! There are exactly 4 hour gaps between 12 and 4.",
          "That would be the gap for 5:00."
        ],
        why: "The hands are separated by the 1, 2, 3, and 4 hour marks, creating 4 distinct spaces.",
        instruction: "Click the 'Highlight 4 Gaps' button below the clock to visualize all the spaces.",
        requiredActionState: 'all_gaps_shown'
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Final Angle. If there are 4 gaps, and each gap is 30°, what is the total angle between the hour and minute hand at 4:00?",
        options: ["90°", "120°", "150°"],
        correct: 1,
        feedback: [
          "4 × 30 is not 90. (90° would be 3 gaps, like at 3:00).",
          "Exactly! 4 gaps × 30° = 120°. You have successfully calculated the angle!",
          "4 × 30 is not 150. (150° would be 5 gaps, like at 5:00)."
        ],
        why: "Total Angle = Gaps × 30°. So, 4 × 30° = 120°.",
        instruction: "Click the 'Draw Total Angle' button below the clock to complete the mathematical proof!",
        requiredActionState: 'arc_shown'
      }
    ],
    postQuiz: [
      { 
        q: "What is the angle between the hands at exactly 2:00?", 
        options: ["30°", "60°", "90°"], 
        correct: 1, 
        explanation: "At 2:00, there are 2 hour gaps between 12 and 2. 2 × 30° = 60°."
      },
      { 
        q: "How many degrees does each 1-hour gap represent on a standard clock face?", 
        options: ["15°", "30°", "45°"], 
        correct: 1, 
        explanation: "A full circle is 360°. Divided by 12 hours, each gap is exactly 30°."
      }
    ]
  },
  practice: {
    question: "Find the exact interior (smaller) angle between the hour and minute hands of a clock at exactly 8:00.",
    clues: [
      { id: 1, step: 0, concept: "Minute Hand", explanation: "At 8:00, the minute hand is at 12.", text: "Identify the position of the Minute Hand." },
      { id: 2, step: 0, concept: "Hour Hand", explanation: "At 8:00, the hour hand is exactly on the 8.", text: "Identify the position of the Hour Hand." },
      { id: 3, step: 0, concept: "Shortest Distance", explanation: "The smaller interior angle is found by counting the shortest path between 8 and 12 (which is 4 gaps, not 8 gaps).", text: "Count the hour gaps taking the shortest path." },
      { id: 4, step: 0, concept: "Total Angle", explanation: "4 gaps × 30° = 120°.", text: "Multiply the gaps by 30°." }
    ],
    quiz: [
      { 
        q: "At exactly 8:00, what numbers are the Minute and Hour hands pointing to?", 
        options: ["Minute: 8, Hour: 12", "Minute: 12, Hour: 8", "Minute: 12, Hour: 6"], 
        correct: 1, 
        explanation: "At any exact hour, the minute hand is at 12. At 8:00, the hour hand is at 8."
      },
      { 
        q: "When finding the angle, we usually look for the interior (smaller) angle. How many hour gaps form the shortest path between 8 and 12?", 
        options: ["4 gaps", "6 gaps", "8 gaps"], 
        correct: 0, 
        explanation: "Going clockwise from 12 to 8 gives 8 gaps (240°). Going counter-clockwise from 12 to 8 gives 4 gaps. 4 is the shorter path!"
      },
      { 
        q: "Since each gap is 30°, what is the interior angle at 8:00?", 
        options: ["120°", "240°", "270°"], 
        correct: 0, 
        explanation: "4 gaps × 30° = 120°. Notice that 8:00 and 4:00 have the exact same interior angle!"
      }
    ]
  }
};

// --- Math Helpers for SVG Clock ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y, 
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};


function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);
  const [stepStatus, setStepStatus] = useState('idle');
  
  // Clock Interaction State
  const [clockState, setClockState] = useState('idle'); // idle -> minute_placed -> hour_placed -> one_gap_shown -> all_gaps_shown -> arc_shown

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'practice' ? LOGIC_DATA.practice.quiz : LOGIC_DATA.concept.postQuiz;

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
    setActiveConceptInfo(null);
    setClockState('idle');
    setConceptPhase('selecting');
    setQuizMode(false);
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setLessonFinished(false);
    setStepStatus('idle');
    setShowFinishModal(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // --- Clock Interaction Handlers ---
  const handleClockNumberClick = (num) => {
      if (appMode === 'practice' || quizMode || lessonFinished) return;
      if (feedback.type !== 'success') {
          setActionError("Please answer the logic question before interacting with the clock.");
          return;
      }

      const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep].requiredActionState;

      if (expectedAction === 'minute_placed' && num === 12) {
          setClockState('minute_placed');
          setActionError("");
      } else if (expectedAction === 'minute_placed' && num !== 12) {
          setActionError("Incorrect. The minute hand should point to 12.");
      } else if (expectedAction === 'hour_placed' && num === 4) {
          setClockState('hour_placed');
          setActionError("");
      } else if (expectedAction === 'hour_placed' && num !== 4) {
          setActionError("Incorrect. The hour hand should point to 4.");
      }
  };

  const handleClockButton = (action) => {
    if (appMode === 'practice' || quizMode || lessonFinished) return;
    if (feedback.type !== 'success') {
        setActionError("Please answer the logic question before interacting with the clock.");
        return;
    }
    const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep].requiredActionState;
    
    if (action === expectedAction) {
        setClockState(action);
        setActionError("");
    } else {
        setActionError("That is not the correct action for this step.");
    }
  };

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    setConceptSelectedOption(idx);
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
      setActionError("");
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
      setActionError("");
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
    } else {
      setConceptPhase('finalCheck');
    }
  }

  const isQuizPassed = feedback.type === 'success';
  const isBoardValid = appMode === 'concept' && clockState === LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;

  // Render SVG Clock Elements
  const renderClockNumbers = () => {
      const numbers = [];
      for (let i = 1; i <= 12; i++) {
          const pos = polarToCartesian(150, 150, 120, i * 30);
          numbers.push(
              <g key={`num-${i}`} 
                 onClick={() => handleClockNumberClick(i)}
                 className={`cursor-pointer transition-all duration-300 ${appMode === 'concept' && isQuizPassed && !isBoardValid ? 'hover:opacity-70' : ''}`}
              >
                  <circle cx={pos.x} cy={pos.y} r="16" fill="#2a1a16" stroke="#a88a6d" strokeWidth="2" className="transition-all hover:fill-[#a88a6d] hover:stroke-white"/>
                  <text x={pos.x} y={pos.y} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">{i}</text>
              </g>
          );
      }
      return numbers;
  };

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Clock Angles Lab" : "Interior Angles Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Clock Construction & Visualization */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[400px] lg:min-h-[450px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-2 text-white">
                    {quizMode ? <><Eye size={16} /> Question Simulation</> : <><Clock size={16} /> Construction Zone</>}
                </div>
                
                {/* SVG Clock Area */}
                <div className="relative bg-[#3e2723] rounded-full border-[8px] border-yellow-500/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                      {/* Inner Clock Face */}
                      <circle cx="150" cy="150" r="140" fill="#3e2723" />
                      
                      {/* Wedges/Arcs Rendering */}
                      {(clockState === 'one_gap_shown' || clockState === 'all_gaps_shown' || clockState === 'arc_shown' || appMode === 'practice') && (
                          <g opacity="0.8">
                             {(clockState === 'one_gap_shown') && (
                                <path d={describeArc(150, 150, 140, 0, 30)} fill="rgba(34, 197, 94, 0.3)" stroke="#4ade80" strokeWidth="2" />
                             )}
                             {(clockState === 'all_gaps_shown' || clockState === 'arc_shown') && appMode === 'concept' && (
                                <>
                                    <path d={describeArc(150, 150, 140, 0, 30)} fill={clockState === 'arc_shown' ? "rgba(234, 179, 8, 0.4)" : "rgba(56, 189, 248, 0.2)"} stroke="#eab308" strokeWidth="1" />
                                    <path d={describeArc(150, 150, 140, 30, 60)} fill={clockState === 'arc_shown' ? "rgba(234, 179, 8, 0.4)" : "rgba(56, 189, 248, 0.2)"} stroke="#eab308" strokeWidth="1" />
                                    <path d={describeArc(150, 150, 140, 60, 90)} fill={clockState === 'arc_shown' ? "rgba(234, 179, 8, 0.4)" : "rgba(56, 189, 248, 0.2)"} stroke="#eab308" strokeWidth="1" />
                                    <path d={describeArc(150, 150, 140, 90, 120)} fill={clockState === 'arc_shown' ? "rgba(234, 179, 8, 0.4)" : "rgba(56, 189, 248, 0.2)"} stroke="#eab308" strokeWidth="1" />
                                </>
                             )}
                             {appMode === 'practice' && (
                                 <path d={describeArc(150, 150, 140, 240, 360)} fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="2" />
                             )}
                          </g>
                      )}

                      {/* Tick Marks */}
                      {Array.from({length: 60}).map((_, i) => {
                          const isHour = i % 5 === 0;
                          const posStart = polarToCartesian(150, 150, isHour ? 135 : 138, i * 6);
                          const posEnd = polarToCartesian(150, 150, 140, i * 6);
                          return <line key={i} x1={posStart.x} y1={posStart.y} x2={posEnd.x} y2={posEnd.y} stroke="white" strokeWidth={isHour ? 3 : 1} opacity={isHour ? 0.6 : 0.2} />;
                      })}

                      {/* Clickable Numbers */}
                      {renderClockNumbers()}

                      {/* Hands */}
                      {(clockState !== 'idle' || appMode === 'practice') && (
                          <g style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}>
                              {/* Minute Hand (at 12 always for these problems) */}
                              <line x1="150" y1="150" x2="150" y2="40" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
                              
                              {/* Hour Hand */}
                              {(clockState === 'hour_placed' || clockState === 'one_gap_shown' || clockState === 'all_gaps_shown' || clockState === 'arc_shown' || appMode === 'practice') && (
                                  <line 
                                    x1="150" 
                                    y1="150" 
                                    x2={polarToCartesian(150, 150, 80, appMode === 'practice' ? 240 : 120).x} 
                                    y2={polarToCartesian(150, 150, 80, appMode === 'practice' ? 240 : 120).y} 
                                    stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" 
                                  />
                              )}
                              {/* Center Pin */}
                              <circle cx="150" cy="150" r="6" fill="#ef4444" />
                          </g>
                      )}

                      {/* Final Angle Text */}
                      {clockState === 'arc_shown' && appMode === 'concept' && (
                          <text x="190" y="110" fill="#fde047" fontSize="24" fontWeight="black" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>120°</text>
                      )}
                      {appMode === 'practice' && lessonFinished && (
                          <text x="110" y="110" fill="#fde047" fontSize="24" fontWeight="black" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>120°</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && (
                    <div className="flex gap-3 mt-4">
                        {activeStep === 2 && (
                            <button onClick={() => handleClockButton('one_gap_shown')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Show 1 Gap (30°)</button>
                        )}
                        {activeStep === 3 && (
                            <button onClick={() => handleClockButton('all_gaps_shown')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Highlight 4 Gaps</button>
                        )}
                        {activeStep === 4 && (
                            <button onClick={() => handleClockButton('arc_shown')} className="px-6 py-2 rounded-full bg-yellow-500 text-black font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Draw Total Angle</button>
                        )}
                    </div>
                )}
            </div>
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels (2-Column Layout with Wooden Theme) */}
        <div className="w-full bg-[#3e2723] p-4 sm:p-6 lg:p-8 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-2 shrink-0 overflow-hidden min-h-[400px] lg:min-h-[450px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-4 sm:gap-6 lg:gap-8 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Dynamic Quiz */}
            <div className="flex flex-col gap-4 h-full">
                
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-5 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 sm:gap-5 items-start text-white ${appMode === 'practice' && !quizMode ? 'flex-1' : ''}`}>
                    <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                        <FileText size={26} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">The Logic Problem</span>
                        <p className="text-[14px] sm:text-[16px] font-medium leading-relaxed tracking-tight text-white/90">
                            {appMode === 'concept' ? LOGIC_DATA.concept.question : LOGIC_DATA.practice.question}
                        </p>
                    </div>
                </div>

                {/* Reasoning Quiz / Concept Flow Box */}
                {!(appMode === 'practice' && !quizMode) && (
                    <div className="flex-1 flex flex-col gap-3 p-5 sm:p-6 bg-[#2a1a16]/95 rounded-[1.5rem] border-2 border-black/50 overflow-hidden shadow-lg">
                        <div className="flex items-center gap-2 opacity-50 mb-2">
                            {quizMode ? <HelpCircle size={18} className="text-yellow-400" /> : <BookOpen size={18} className="text-[#a88a6d]" />}
                            <span className="text-[#a88a6d] font-black uppercase text-[12px] sm:text-[13px] tracking-wider">{quizMode ? "Reasoning Quiz" : "Active Concept"}</span>
                        </div>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar text-[14px]">
                            {quizMode ? (
                              <div className="flex flex-col gap-4 h-full">
                                <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase opacity-70 tracking-widest leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
                                <p className="text-white text-[16px] sm:text-[18px] font-bold leading-snug tracking-tight">{currentQuizSet[quizStep]?.q}</p>
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                                        let style = "bg-black/40 border-transparent text-white";
                                        if (quizFeedbackMode) {
                                            if (idx === currentQuizSet[quizStep].correct) style = "bg-green-600 border-green-400 text-white shadow-lg";
                                            else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                            else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                                        }
                                        return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3.5 sm:p-4 rounded-xl font-black uppercase transition-all text-[13px] sm:text-[14px] border-2 text-left ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                              </div>
                            ) : (
                              (currentScenData.clues || []).filter(clue => appMode === 'practice' || clue.step === activeStep).map((clue) => {
                                const showFull = lessonFinished || appMode === 'practice' || conceptPhase === 'selecting';
                                
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1.5 transition-all ${showFull ? 'opacity-100' : 'opacity-100'}`}>
                                    <button 
                                      onClick={() => setActiveConceptInfo(clue.concept)}
                                      className={`w-fit px-3.5 py-1.5 rounded-full bg-yellow-400 text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-md`}
                                    >
                                      <Info size={12} strokeWidth={3} /> Concept: {clue.concept}
                                    </button>
                                    <p className={`text-white text-[14px] sm:text-[15px] leading-snug tracking-tight font-medium pl-3 border-l-[3px] border-white/10 mt-1`}>{clue.text}</p>
                                  </div>
                                );
                              })
                            )}
                            {activeConceptInfo && !quizMode && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-400/10 border border-yellow-400/40 p-4 rounded-xl mt-3 flex items-start gap-3 shadow-inner">
                                    <Zap size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <p className="text-yellow-400 text-[13px] sm:text-[14px] italic leading-relaxed font-bold">"{currentScenData.clues?.find(c => c.concept === activeConceptInfo)?.explanation}"</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[350px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {quizFeedbackMode && (
                            <motion.div key="practice-quiz-fb" className="flex flex-col items-center justify-center gap-5 text-center h-full min-h-[250px]">
                                <p className="text-yellow-400 text-[15px] sm:text-[17px] italic leading-snug tracking-tight font-medium text-center px-4">"{currentQuizSet[quizStep]?.explanation}"</p>
                                <button onClick={() => {
                                    if (quizSelection === currentQuizSet[quizStep].correct) {
                                        if (quizStep < currentQuizSet.length - 1) { 
                                            setQuizStep(quizStep + 1); setQuizSelection(null); setQuizFeedbackMode(false); 
                                        } else { 
                                            setLessonFinished(true); setQuizMode(false); 
                                        }
                                    } else { setQuizFeedbackMode(false); setQuizSelection(null); }
                                }} className="bg-indigo-500 text-white px-10 py-3.5 sm:py-4 rounded-full font-black uppercase text-[14px] sm:text-[15px] shadow-xl hover:scale-105 transition-all mt-4 tracking-wider">
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? 'Finish Laboratory' : 'Next Discovery') : 'Try Again'}
                                </button>
                            </motion.div>
                        )}

                        {quizMode && !quizFeedbackMode && (
                            <motion.div key="practice-quiz-wait" className="flex flex-col items-center justify-center gap-5 h-full opacity-50 min-h-[250px]">
                                <MousePointer2 size={56} className="text-indigo-400 animate-bounce" />
                                <p className="text-white text-[15px] sm:text-[16px] font-medium tracking-wide">Select your answer from the options on the left!</p>
                            </motion.div>
                        )}

                        {lessonFinished && (
                          <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <Trophy size={70} className="text-yellow-400 animate-bounce" />
                             <h3 className="text-white text-[20px] sm:text-[24px] font-black uppercase tracking-widest">Laboratory Mastered!</h3>
                             <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You've mastered reading clock angles directly from hour gaps!</p>
                             <div className="flex flex-col gap-3.5 w-full max-w-sm mt-5 px-6">
                                <button onClick={() => handleReset(appMode)} className="bg-amber-600 text-white py-3.5 sm:py-4 rounded-full font-black uppercase shadow-xl tracking-widest text-[13px] sm:text-[14px] hover:scale-105 transition-all">Retry Module</button>
                                {appMode === 'concept' ? (
                                    <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white py-4 rounded-full font-black uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-widest text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:scale-105 transition-all">Start Practice Lab <ArrowUpRight size={20}/></button>
                                ) : (
                                    <button onClick={() => setShowFinishModal(true)} className="bg-green-600 text-white py-4 rounded-full font-black uppercase shadow-[0_0_20px_rgba(34,197,94,0.4)] tracking-widest text-[14px] sm:text-[15px] flex items-center justify-center gap-2 hover:scale-105 transition-all">Finish Session <ArrowUpRight size={20}/></button>
                                )}
                             </div>
                          </motion.div>
                        )}

                        {conceptPhase === 'selecting' && appMode === 'concept' && !lessonFinished && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col gap-4 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                               <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><Compass size={16}/> Interactive Lesson • Step {activeStep + 1}/{LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {stepStatus !== 'correct' ? (
                                <>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isSelected = conceptSelectedOption === i;
                                          const isCorrect = isSelected && isQuizPassed;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                          else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                          else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                          return (
                                            <button 
                                                key={i} 
                                                disabled={isQuizPassed}
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    
                                    {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                    
                                    {isQuizPassed && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-3">
                                            
                                            <div className="flex flex-col rounded-xl overflow-hidden border-[2px] border-green-500/50 shadow-xl">
                                                <div className="bg-green-500/10 px-5 py-4 border-b border-green-500/20">
                                                    <p className="text-green-400 text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                        <strong className="uppercase tracking-widest text-[11px] block mb-1.5 text-green-500">Logic Confirmed</strong>
                                                        "{feedback.reason}"
                                                    </p>
                                                </div>
                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction && (
                                                    <div className="bg-yellow-400/10 p-5 flex gap-4 items-start">
                                                        <MousePointer2 size={26} className="text-yellow-400 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-yellow-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Required Action</span>
                                                            <span className="text-white text-[15px] font-bold tracking-tight leading-snug">
                                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {isBoardValid ? (
                                                <button onClick={nextStep} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95 mt-3">
                                                    {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2 mt-3">
                                                    <button disabled={true} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                        Complete Action on the Clock
                                                    </button>
                                                    {actionError && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight mt-1.5">"{actionError}"</p>}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 mt-3 h-full">
                                   
                                   {/* Keep the options visible but disabled */}
                                   <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isCorrect = conceptSelectedOption === i;
                                          let btnClass = isCorrect ? "bg-green-600 border-green-400 text-white shadow-lg scale-105" : "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";
                                          return (
                                            <button key={i} disabled={true} className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}>
                                                {opt}
                                            </button>
                                          );
                                      })}
                                   </div>

                                   <div className="bg-green-400/10 border border-green-400/30 p-5 rounded-xl flex items-start gap-4 mt-auto shadow-inner">
                                       <CheckCircleIcon />
                                       <div>
                                           <p className="text-green-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest mb-1.5">Step Completed</p>
                                           <p className="text-white text-[15px] font-medium leading-relaxed">"{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"</p>
                                       </div>
                                   </div>
                                   
                                   <button onClick={nextStep} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95`}>
                                       {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                   </button>
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl">
                                <p className="text-white font-bold text-[18px] uppercase tracking-widest">Clock Logic Mastered!</p>
                                <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                    You've successfully mapped the angle using the 30 degree gap rule. Time for the final quiz!
                                </p>
                             </div>
                             <button onClick={() => setQuizMode(true)} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Start Reasoning Quiz
                             </button>
                          </motion.div>
                        )}

                        {appMode === 'practice' && !quizMode && !lessonFinished && (
                            <motion.div key="practice-instruction" className="flex flex-col gap-4 h-full items-center justify-center text-center min-h-[250px]">
                                 <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl w-full max-w-lg">
                                    <p className="text-white font-bold text-[18px] uppercase tracking-widest">Verify Clock Angle</p>
                                    <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                        Read the problem on the left. Look at the clock face showing 8:00 to answer the questions!
                                    </p>
                                 </div>
                                 <button onClick={() => setQuizMode(true)} className={`w-full max-w-lg py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)]`}>
                                    Start Practice Quiz
                                 </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>
      </main>

      {/* Custom Alert Overlay for Finishing the Laboratory */}
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
                   className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-5 w-full max-w-sm text-center relative"
               >
                  <div className="bg-yellow-500/20 p-4 rounded-full">
                      <Trophy size={56} className="text-yellow-400" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <h2 className="text-white text-xl sm:text-2xl font-black uppercase tracking-widest">Lab Complete!</h2>
                      <p className="text-white/80 text-sm sm:text-base font-medium">You have successfully finished the Clock Angles module.</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full mt-2">
                     <button onClick={() => handleReset(appMode)} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart Module</button>
                     <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Go to Next Module</button>
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

// Helper icon component
function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }