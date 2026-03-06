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
    coreDefinition: {
        title: "Concept: Overlapping Hands",
        text: "When the hands of a clock are 'together', they overlap, making the angle between them exactly 0°.\n\n• To find this exact time between hour H and H+1, start at H:00.\n• Find the initial minute-gap of the hour hand (H × 5).\n• Since the minute hand moves faster, multiply this gap by the 12/11 catch-up fraction to find the exact overlap time!"
    },
    question: "At what time between 9 and 10 o'clock will the hands of a watch be together?",
    clues: [
      { id: 1, step: 0, concept: "Base Hour", explanation: "To find an event between 9 and 10, we always use 9:00 as our base starting point.", text: "Identify the base hour for this interval." },
      { id: 2, step: 1, concept: "Starting Gap", explanation: "At 9:00, the minute hand is at 12 and the hour hand is at 9. This means the hour hand has a 45-minute head start.", text: "Determine the initial gap in minute-spaces." },
      { id: 3, step: 2, concept: "Magic Multiplier", explanation: "The minute hand gains 55 minute spaces over the hour hand every 60 minutes. 60/55 simplifies to exactly 12/11.", text: "Recall the catch-up fraction." },
      { id: 4, step: 3, concept: "Exact Time", explanation: "To catch up those 45 minutes, it takes: 45 × (12/11) = 540/11 = 49 1/11 minutes.", text: "Multiply the initial gap by 12/11 to find the exact catch-up time." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Base Hour. To find out when the hands meet between 9 and 10, we must set the clock to the start of the hour. What is the base hour?",
        options: ["8:00", "9:00", "10:00"],
        correct: 1,
        feedback: [
          "That would be for the hour before.",
          "Correct! We always calculate from the top of the starting hour (9:00).",
          "10:00 is the end of the interval, we must start at 9:00."
        ],
        why: "All clock calculations require resetting the clock to the top of the given hour.",
        instruction: "Click on the number '9' on the clock face to set the base hour to 9:00.",
        requiredActionState: 'base_time_placed'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: The Initial Gap. At 9:00, the minute hand sits at 12 (0 mins) and the hour hand is pointing at the 9. How many minutes of space must the minute hand cover to catch up?",
        options: ["30 mins", "45 mins", "50 mins"],
        correct: 1,
        feedback: [
          "30 minutes is at the 6.",
          "Exactly! The 9 mark represents exactly 45 minutes of space on the clock face.",
          "50 minutes is at the 10."
        ],
        why: "The number 9 represents 9 × 5 = 45 minute spaces.",
        instruction: "Click 'Highlight Gap' below the clock to visualize the 45-minute distance.",
        requiredActionState: 'gap_highlighted'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Magic Multiplier. The hour hand doesn't stay still! As the minute hand moves, the hour hand creeps forward. What fraction do we multiply the gap by to account for this and find the exact catch-up time?",
        options: ["11/12", "12/11", "5/6"],
        correct: 1,
        feedback: [
          "You have the fraction upside down!",
          "Correct! Because the minute hand gains 55 spaces every 60 minutes, the ratio is 60/55, which simplifies perfectly to 12/11.",
          "That ratio represents something else entirely."
        ],
        why: "Multiplying by 12/11 perfectly compensates for the hour hand's continuous creeping motion.",
        instruction: "Logic Confirmed. Proceed to the final step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: The Exact Time. Let's do the math: 45 spaces × (12/11) = 540/11. If we convert 540/11 into a mixed fraction, what do we get?",
        options: ["45 5/11 mins", "48 2/11 mins", "49 1/11 mins"],
        correct: 2,
        feedback: [
          "Check your division: 540 ÷ 11.",
          "Close, but 48 × 11 is 528.",
          "Exactly! 540 ÷ 11 = 49 with a remainder of 1. The exact overlap time is 9:49 1/11."
        ],
        why: "Initial Gap (45) × 12/11 gives us the precise time the faster hand catches the slower hand.",
        instruction: "Click 'Animate Overlap' to smoothly sweep the hands to exactly 49 1/11 minutes.",
        requiredActionState: 'overlap_animated'
      }
    ],
    postQuiz: [
      { 
        q: "Why do we multiply the base gap by 12/11?", 
        options: ["Because there are 12 hours on a clock.", "To account for the hour hand moving forward while the minute hand tries to catch it.", "To convert hours to minutes."], 
        correct: 1, 
        explanation: "If the hour hand didn't move, they would overlap at exactly 9:45. Since it moves away, the minute hand takes slightly longer (12/11) to catch it!"
      },
      { 
        q: "If we were looking for the time hands overlap between 3 and 4, what would be the initial gap to multiply by 12/11?", 
        options: ["10 minutes", "15 minutes", "20 minutes"], 
        correct: 1, 
        explanation: "The base hour is 3:00. The hour hand is on the 3, which corresponds to exactly 15 minutes of space."
      }
    ]
  },
  practice: {
    coreDefinition: {
        title: "Concept: Overlapping Hands",
        text: "To find the exact time hands are together (0° apart) between hour H and the next hour:\n\n• Find the base minute mark of H (H × 5).\n• This is your initial Gap.\n• Exact Time = Gap × 12/11 minutes past H."
    },
    practiceQuestions: [
      { 
        timeStr: "Between 3 and 4", hour: 3, gap: 15,
        q: "At what exact time between 3 and 4 o'clock will the hands be together?",
        options: ["15 5/11 mins past 3", "16 4/11 mins past 3", "17 mins past 3"], correct: 1, 
        correctText: "Overlap at 3:16 4/11",
        explanation: "Base is 3:00. Initial gap = 15 mins. Exact time = 15 × 12/11 = 180/11 = 16 4/11 mins past 3."
      },
      { 
        timeStr: "Between 6 and 7", hour: 6, gap: 30,
        q: "At what exact time between 6 and 7 o'clock will the hands be together?",
        options: ["30 mins past 6", "32 8/11 mins past 6", "33 3/11 mins past 6"], correct: 1, 
        correctText: "Overlap at 6:32 8/11",
        explanation: "Base is 6:00. Initial gap = 30 mins. Exact time = 30 × 12/11 = 360/11 = 32 8/11 mins past 6."
      },
      { 
        timeStr: "Between 10 and 11", hour: 10, gap: 50,
        q: "At what exact time between 10 and 11 o'clock will the hands be together?",
        options: ["54 6/11 mins past 10", "55 5/11 mins past 10", "56 mins past 10"], correct: 0, 
        correctText: "Overlap at 10:54 6/11",
        explanation: "Base is 10:00. Initial gap = 50 mins. Exact time = 50 × 12/11 = 600/11 = 54 6/11 mins past 10."
      },
      { 
        timeStr: "Between 1 and 2", hour: 1, gap: 5,
        q: "At what exact time between 1 and 2 o'clock will the hands be together?",
        options: ["5 5/11 mins past 1", "6 2/11 mins past 1", "7 1/11 mins past 1"], correct: 0, 
        correctText: "Overlap at 1:05 5/11",
        explanation: "Base is 1:00. Initial gap = 5 mins. Exact time = 5 × 12/11 = 60/11 = 5 5/11 mins past 1."
      },
      { 
        timeStr: "Between 5 and 6", hour: 5, gap: 25,
        q: "At what exact time between 5 and 6 o'clock will the hands be together?",
        options: ["25 5/11 mins past 5", "27 3/11 mins past 5", "28 2/11 mins past 5"], correct: 1, 
        correctText: "Overlap at 5:27 3/11",
        explanation: "Base is 5:00. Initial gap = 25 mins. Exact time = 25 × 12/11 = 300/11 = 27 3/11 mins past 5."
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
  // idle -> base_time_placed -> gap_highlighted -> overlap_animated
  const [clockState, setClockState] = useState('idle'); 

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanationForIncorrect, setShowExplanationForIncorrect] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.practiceQuestions;

  useEffect(() => {
     if (appMode === 'practice') {
         setQuizMode(true);
     }
  }, [appMode]);

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
    setActiveConceptInfo(null);
    setClockState('idle');
    setConceptPhase('selecting');
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanationForIncorrect(false);
    setLessonFinished(false);
    setShowFinishModal(false);
    setStepStatus('idle');
    if (overrideMode === 'practice') {
        setQuizMode(true);
    } else {
        setQuizMode(false);
    }
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

      const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;
      if (!expectedAction || expectedAction === 'none') return;

      if (expectedAction === 'base_time_placed' && num === 9) {
          setClockState('base_time_placed');
          setActionError("");
      } else if (expectedAction === 'base_time_placed' && num !== 9) {
          setActionError("Incorrect. We are evaluating between 9 and 10, so start at 9:00.");
      }
  };

  const handleClockButton = (action) => {
    if (appMode === 'practice' || quizMode || lessonFinished) return;
    if (feedback.type !== 'success') {
        setActionError("Please answer the logic question before interacting with the clock.");
        return;
    }
    const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;
    if (!expectedAction || expectedAction === 'none') return;
    
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
    setShowExplanationForIncorrect(false); // reset explanation view on new selection
  }

  function prevStep() {
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setActiveConceptInfo(null);
      
      const stepToState = ['idle', 'base_time_placed', 'base_time_placed', 'gap_highlighted'];
      setClockState(stepToState[newStep] || 'idle');
    }
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
  const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;
  const isBoardValid = appMode === 'concept' ? (!expectedAction || expectedAction === 'none' || clockState === expectedAction) : false;

  // Explanation logic for Practice Mode / Post Quiz
  const isCorrectAnswer = quizFeedbackMode && quizSelection === currentQuizSet[quizStep]?.correct;
  const shouldShowExplanation = isCorrectAnswer || showExplanationForIncorrect;

  // Determine when we should actually animate the hands smoothly (only at Step 4, or Practice Correct)
  const isAnimating = (appMode === 'concept' && clockState === 'overlap_animated') || 
                      (appMode === 'practice' && isCorrectAnswer);
  
  // If not animating, duration is 0 so the hands snap instantly to position
  const transitionSpec = isAnimating 
      ? { type: "tween", duration: 1.5, ease: "easeInOut" } 
      : { duration: 0 };

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

  // Determine rotations and arcs
  let minuteRotation = 0;
  let hourRotation = 0;
  let showMinute = false;
  let showHour = false;
  let arcStart = 0;
  let arcEnd = 0;
  let showGapArc = false;
  let finalAngleText = "";

  if (appMode === 'concept') {
      if (clockState !== 'idle') {
          showMinute = true;
          showHour = true;
      }
      if (['base_time_placed', 'gap_highlighted'].includes(clockState)) {
          minuteRotation = 0; // At 12 (0 degrees)
          hourRotation = 270; // At 9 (270 degrees)
      }
      if (['gap_highlighted'].includes(clockState)) {
          arcStart = 0;
          arcEnd = 270;
          showGapArc = true;
      }
      if (['overlap_animated'].includes(clockState)) {
          minuteRotation = 294.545; // (540/11) * 6
          hourRotation = 294.545;
          finalAngleText = "OVERLAP AT 9:49 1/11";
      }
  } else if (appMode === 'practice') {
      const currentQ = LOGIC_DATA.practice.practiceQuestions[quizStep];
      if (currentQ) {
          showMinute = true;
          showHour = true;
          // Before answering correctly, snap to base hour instantly
          if (!isCorrectAnswer) {
              minuteRotation = 0;
              hourRotation = currentQ.hour * 30;
              finalAngleText = "";
          } else {
              // After answering correctly, animate to overlap smoothly
              const overlapMins = currentQ.gap * (12/11);
              const overlapAngle = overlapMins * 6; 
              minuteRotation = overlapAngle;
              hourRotation = overlapAngle;
              
              finalAngleText = currentQ.correctText;
          }
      }
  }

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Overlapping Hands Lab" : "Overlap Calculation Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Clock Construction & Visualization */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[400px] lg:min-h-[450px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-2 text-white">
                    {appMode === 'practice' && <><span className="text-yellow-500 mr-2 bg-yellow-500/20 px-3 py-1 rounded-md">{LOGIC_DATA.practice.practiceQuestions[quizStep]?.timeStr}</span></>}
                    {quizMode ? <><Eye size={16} /> Question Simulation</> : <><Clock size={16} /> Construction Zone</>}
                </div>
                
                {/* SVG Clock Area */}
                <div className="relative bg-[#3e2723] rounded-full border-[8px] border-yellow-500/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                      {/* Inner Clock Face */}
                      <circle cx="150" cy="150" r="140" fill="#3e2723" />
                      
                      {/* Wedges/Arcs Rendering for Gap Highlight */}
                      {showGapArc && (
                          <g opacity="0.8">
                             <path d={describeArc(150, 150, 140, arcStart, arcEnd)} fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="2" />
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

                      {/* Hands - Animated cleanly around the central axis using SVG transforms */}
                      <g style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}>
                          
                          {/* Minute Hand */}
                          {showMinute && (
                              <motion.g
                                initial={{ rotate: minuteRotation }}
                                animate={{ rotate: minuteRotation }}
                                transition={transitionSpec}
                                style={{ transformOrigin: "50% 50%" }}
                              >
                                  {/* Invisible bounding box enforcer ensures 50% 50% origin is exactly the center */}
                                  <circle cx="150" cy="150" r="140" fill="transparent" />
                                  <line x1="150" y1="150" x2="150" y2="50" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
                              </motion.g>
                          )}

                          {/* Hour Hand (Dynamic) */}
                          {showHour && (
                              <motion.g
                                initial={{ rotate: hourRotation }}
                                animate={{ rotate: hourRotation }}
                                transition={transitionSpec}
                                style={{ transformOrigin: "50% 50%" }}
                              >
                                  {/* Invisible bounding box enforcer ensures 50% 50% origin is exactly the center */}
                                  <circle cx="150" cy="150" r="140" fill="transparent" />
                                  <line x1="150" y1="150" x2="150" y2="70" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
                              </motion.g>
                          )}
                          
                          {/* Center Pin */}
                          <circle cx="150" cy="150" r="6" fill="#ef4444" />
                      </g>

                      {/* Final Text */}
                      {['overlap_animated'].includes(clockState) && appMode === 'concept' && (
                          <text x="150" y="200" fill="#fde047" fontSize="15" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                      {appMode === 'practice' && isCorrectAnswer && (
                          <text x="150" y="200" fill="#fde047" fontSize="16" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && isQuizPassed && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center animate-in fade-in zoom-in duration-300">
                        {activeStep === 1 && (
                            <button onClick={() => handleClockButton('gap_highlighted')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Highlight Gap</button>
                        )}
                        {activeStep === 3 && (
                            <button onClick={() => handleClockButton('overlap_animated')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Animate Overlap</button>
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
                
                {/* The Logic Problem / Core Definition Box */}
                <div className={`bg-[#2a1a16]/95 p-5 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 sm:gap-5 items-start text-white`}>
                    <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                        {quizMode ? <Info size={26} strokeWidth={2.5}/> : <FileText size={26} strokeWidth={2.5}/>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                            {quizMode ? currentScenData.coreDefinition.title : "The Logic Problem"}
                        </span>
                        <p className="text-[14px] sm:text-[16px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                            {quizMode ? currentScenData.coreDefinition.text : LOGIC_DATA.concept.question}
                        </p>
                    </div>
                </div>

                {/* Solution Explanation / Concept Clues Box */}
                <div className="flex-1 flex flex-col gap-3 p-5 sm:p-6 bg-[#2a1a16]/95 rounded-[1.5rem] border-2 border-black/50 overflow-hidden shadow-lg">
                    <div className="flex items-center gap-2 opacity-50 mb-2">
                        <BookOpen size={18} className={quizMode ? "text-yellow-400" : "text-[#a88a6d]"} />
                        <span className="text-[#a88a6d] font-black uppercase text-[12px] sm:text-[13px] tracking-wider">
                            {quizMode ? "Solution Explanation" : "Active Concept"}
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar text-[14px]">
                        {quizMode ? (
                            <div className="flex flex-col h-full justify-center pb-4">
                                {shouldShowExplanation ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-400/10 border border-yellow-400/40 p-4 sm:p-5 rounded-xl shadow-inner flex gap-3 sm:gap-4 items-start">
                                        <Zap size={22} className="text-yellow-400 shrink-0 mt-0.5" />
                                        <p className="text-yellow-400 text-[14px] sm:text-[15px] italic leading-relaxed font-bold">
                                            "{currentQuizSet[quizStep]?.explanation}"
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center opacity-30 gap-3 pt-4">
                                        <FileText size={40} />
                                        <p className="text-center font-medium tracking-wide max-w-[200px] text-[13px] sm:text-[14px]">Detailed explanation will appear here after you solve the question, or if you request it.</p>
                                    </div>
                                )}
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
            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[350px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>

                        {quizMode && !lessonFinished && (
                            <motion.div key="quiz-panel" className="flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                    <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                        <Compass size={16}/> {appMode === 'practice' ? `Practice Drill ${quizStep + 1}/${currentQuizSet.length}` : `Concept Quiz ${quizStep + 1}/${currentQuizSet.length}`}
                                    </span>
                                </div>
                                <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2 text-center">
                                    {currentQuizSet[quizStep]?.q}
                                </p>

                                <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-3">
                                    {currentQuizSet[quizStep]?.options?.map((opt, i) => {
                                        const isCorrect = quizFeedbackMode && i === currentQuizSet[quizStep].correct;
                                        const isWrong = quizFeedbackMode && i === quizSelection && i !== currentQuizSet[quizStep].correct;
                                        const isDisabled = quizFeedbackMode;

                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                        if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                        else if (isDisabled) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                        return (
                                            <button 
                                                key={i} 
                                                disabled={isDisabled}
                                                onClick={() => handleQuizSelection(i)} 
                                                className={`px-5 sm:px-8 py-3.5 sm:py-5 rounded-xl font-black uppercase text-[13px] sm:text-[15px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizFeedbackMode && quizSelection !== currentQuizSet[quizStep].correct && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-auto">
                                        <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"Incorrect. Check your math!"</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanationForIncorrect(false); }} className="flex-1 py-3.5 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] border-2 border-rose-400 hover:scale-105 active:scale-95">
                                                Try Again
                                            </button>
                                            {!showExplanationForIncorrect && (
                                                <button onClick={() => setShowExplanationForIncorrect(true)} className="flex-1 py-3.5 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                    View Explain
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {isCorrectAnswer && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-auto">
                                        <div className="bg-green-400/10 p-4 sm:p-5 flex items-start gap-4 shadow-inner rounded-xl border border-green-500/20">
                                            <CheckCircleIcon />
                                            <div className="flex flex-col">
                                                <span className="text-green-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Correct Answer</span>
                                                <span className="text-white text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                    Brilliant! Review the explanation on the left.
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            if (quizStep < currentQuizSet.length - 1) { 
                                                setQuizStep(quizStep + 1); 
                                                setQuizSelection(null); 
                                                setQuizFeedbackMode(false); 
                                                setShowExplanationForIncorrect(false);
                                            } else { 
                                                setLessonFinished(true); 
                                                setShowFinishModal(true);
                                            }
                                        }} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95">
                                            {quizStep === currentQuizSet.length - 1 ? 'Finish Module' : 'Next Question'}
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                        
                        {lessonFinished && (
                          <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <Trophy size={70} className="text-yellow-400 opacity-50" />
                             <h3 className="text-white text-[20px] sm:text-[24px] font-black uppercase tracking-widest">Completed</h3>
                             <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You've successfully completed this section.</p>
                             <button onClick={() => setShowFinishModal(true)} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                 Open Finish Menu
                             </button>
                          </motion.div>
                        )}

                        {conceptPhase === 'selecting' && appMode === 'concept' && !lessonFinished && !quizMode && (
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
                               {activeStep > 0 && <button onClick={prevStep} className="text-yellow-400 hover:scale-110 active:scale-95 transition-transform bg-white/5 p-1.5 rounded-lg"><ArrowLeft size={18}/></button>}
                            </div>
                            
                            <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {/* We always render MCQ block unless the clock action is strictly not met. But wait, we render MCQ first! */}
                            {(!isQuizPassed) ? (
                                <>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isSelected = conceptSelectedOption === i;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";

                                          return (
                                            <button 
                                                key={i} 
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    {feedback.type === 'error' && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-3">
                                    
                                    <div className="flex flex-col rounded-xl overflow-hidden border-[2px] border-green-500/50 shadow-xl">
                                        <div className="bg-green-500/10 px-5 py-4 border-b border-green-500/20">
                                            <p className="text-green-400 text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                <strong className="uppercase tracking-widest text-[11px] block mb-1.5 text-green-500">Logic Confirmed</strong>
                                                "{feedback.reason}"
                                            </p>
                                        </div>
                                        {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction && !isBoardValid && expectedAction !== 'none' && (
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
                                        {isBoardValid && (
                                            <div className="bg-green-400/10 p-5 flex items-start gap-4 shadow-inner">
                                                <CheckCircleIcon />
                                                <div className="flex flex-col">
                                                    <span className="text-green-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Step Completed</span>
                                                    <span className="text-white text-[15px] font-medium leading-relaxed">
                                                        "{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"
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
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl">
                                <p className="text-white font-bold text-[18px] uppercase tracking-widest">Clock Logic Mastered!</p>
                                <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                    You've successfully mapped the exact overlapping alignment. Time for the final quiz!
                                </p>
                             </div>
                             <button onClick={() => setQuizMode(true)} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Start Reasoning Quiz
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
                   className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-5 w-full max-w-md text-center relative"
               >
                  <div className="bg-yellow-500/20 p-4 rounded-full">
                      <Trophy size={64} className="text-yellow-400 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-widest">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully mapped the exact 0-degree alignments." 
                              : "You have successfully answered the angle drills."}
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset(appMode); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart</button>
                     {appMode === 'concept' ? (
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Start Practice</button>
                     ) : (
                         <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Finish Session</button>
                     )}
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