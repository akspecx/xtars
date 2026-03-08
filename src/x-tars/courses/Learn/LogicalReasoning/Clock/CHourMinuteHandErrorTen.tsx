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
        title: "Concept: The Incorrect Clock",
        text: "When a clock gains or loses time, it creates a discrepancy between 'Indicated Time' and 'True Time'.\n\n• Find the ratio of True Time to Incorrect Time.\n• Example: If a watch gains 10 mins an hour, 60 true mins = 70 incorrect mins. Ratio = 60/70.\n• True Time Passed = Indicated Time Passed × Ratio."
    },
    question: "A watch which gains 5 seconds in 3 minutes was set right at 7 a.m. In the afternoon of the same day, when the watch indicated quarter past 4 o'clock, the true time is:",
    clues: [
      { id: 1, step: 0, concept: "Indicated Time", explanation: "First, figure out how much time the broken clock *thinks* has passed from 7:00 a.m. to 4:15 p.m.", text: "Calculate the total hours passed according to the broken watch." },
      { id: 2, step: 1, concept: "The Gain Ratio", explanation: "The watch gains 5 seconds (1/12 of a minute) every 3 true minutes. So, 3 true minutes = 3 + 1/12 (or 37/12) incorrect minutes.", text: "Find the ratio of True Time to Incorrect Time." },
      { id: 3, step: 2, concept: "Simplifying Ratio", explanation: "True / Incorrect = 3 / (37/12) = 36 / 37. For every 37 hours the broken clock moves, exactly 36 true hours pass.", text: "Simplify the ratio." },
      { id: 4, step: 3, concept: "True Hours Passed", explanation: "Multiply the indicated time (37/4 hours) by the ratio (36/37) to find the actual time passed.", text: "Calculate the true hours passed." },
      { id: 5, step: 4, concept: "Final True Time", explanation: "Add the true hours passed to the starting time of 7:00 a.m.", text: "Find the exact correct time." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: The Scenario. Let's fast forward our starting 7:00 a.m. clock to the incorrect time shown in the afternoon: 4:15 p.m.",
        options: ["Skip", "Acknowledge", "Proceed"], // Dummy options, user just needs to click the clock button for this step
        correct: 1,
        feedback: ["", "Perfect. Let's evaluate this time gap.", ""],
        why: "We need a visual reference of the indicated time.",
        instruction: "Click 'Set Indicated Time' below the clock to advance the hands to 4:15.",
        requiredActionState: 'indicated_time_set'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Indicated Time Passed. The clock was set right at 7:00 a.m. According to the broken watch, how much time has passed to reach 4:15 p.m.?",
        options: ["8 hrs 15 mins", "9 hrs 15 mins", "10 hrs 15 mins"],
        correct: 1,
        feedback: [
          "Count from 7 a.m. to 12 noon (5 hours), then add 4 hours 15 mins.",
          "Correct! 9 hours and 15 minutes have passed on the broken watch.",
          "That would be 5:15 p.m."
        ],
        why: "9 hours and 15 minutes is equal to exactly 37/4 hours.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: The True Ratio. The watch gains 5 seconds (1/12 of a minute) every 3 true minutes. This means for every 3 true minutes, it shows 37/12 minutes. What is the ratio of True Time to Incorrect Time (True ÷ Incorrect)?",
        options: ["35/36", "36/37", "37/38"],
        correct: 1,
        feedback: [
          "Check your fraction division: 3 ÷ (37/12).",
          "Exactly! 3 ÷ (37/12) = 36/37. For every 37 hours the broken clock shows, only 36 true hours have passed.",
          "Check your fraction division!"
        ],
        why: "The multiplier to convert Broken Time to True Time is 36/37.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: True Hours Passed. We know the broken watch showed 9 hours 15 minutes (which is 37/4 hours). To find the true time, we multiply: (37/4) × (36/37). How many TRUE hours have passed?",
        options: ["8 hours", "9 hours", "10 hours"],
        correct: 1,
        feedback: [
          "Check the math: (37/4) × (36/37). The 37s cancel out!",
          "Correct! The 37s cancel out, leaving 36/4, which equals exactly 9 hours.",
          "That's too high."
        ],
        why: "Exactly 9 correct hours have passed in reality.",
        instruction: "Logic Confirmed. Proceed to the final step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: The True Time. If exactly 9 true hours have passed since the clock was set at 7:00 a.m., what is the actual, true time?",
        options: ["3:45 p.m.", "4:00 p.m.", "4:15 p.m."],
        correct: 1,
        feedback: [
          "7 a.m. + 9 hours is not 3:45.",
          "Exactly! 7:00 a.m. + 9 hours = 4:00 p.m. The clock was 15 minutes fast!",
          "4:15 p.m. is the incorrect indicated time."
        ],
        why: "The correct time is exactly 4:00 p.m.",
        instruction: "Click 'Reveal True Time' to wind the clock back to the correct time!",
        requiredActionState: 'true_time_revealed'
      }
    ],
    postQuiz: [
      { 
        q: "If a watch loses 10 minutes every true hour, what is the ratio of True Time to Incorrect Time?", 
        options: ["60/50", "50/60", "60/70"], 
        correct: 0, 
        explanation: "60 true minutes = 50 incorrect minutes. The ratio to convert incorrect to true is 60/50 (or 6/5)."
      },
      { 
        q: "If a watch gains 10 minutes every true hour, what is the ratio of True Time to Incorrect Time?", 
        options: ["60/50", "60/70", "70/60"], 
        correct: 1, 
        explanation: "60 true minutes = 70 incorrect minutes. The ratio to convert incorrect to true is 60/70 (or 6/7)."
      }
    ]
  },
  practice: {
    coreDefinition: {
        title: "Concept: The Incorrect Clock",
        text: "To find the true time when a clock is gaining or losing:\n\n• Find the Base Ratio: (True Minutes / Incorrect Minutes).\n• Find the Indicated Hours Passed.\n• True Hours Passed = Indicated Hours × Ratio."
    },
    practiceQuestions: [
      { 
        timeStr: "Fast Clock (+5s / 3m)", 
        indHour: 5, indMinute: 15, trueHour: 5, trueMinute: 0,
        q: "A watch gains 5 seconds in 3 minutes. It was set right at 8:00 a.m. What is the true time when it indicates 5:15 p.m.?",
        options: ["4:45 p.m.", "5:00 p.m.", "5:30 p.m."], correct: 1, 
        correctText: "TRUE TIME: 5:00",
        explanation: "Ratio = 36 true / 37 incorrect. Indicated passed (8am to 5:15pm) = 37/4 hours. True passed = (37/4) × (36/37) = 9 hours. 8 a.m. + 9 hours = 5:00 p.m."
      },
      { 
        timeStr: "Slow Clock (-5s / 3m)", 
        indHour: 3, indMinute: 45, trueHour: 4, trueMinute: 0,
        q: "A watch LOSES 5 seconds in 3 minutes. It was set right at 7:00 a.m. What is the true time when it indicates 3:45 p.m.?",
        options: ["3:30 p.m.", "4:00 p.m.", "4:15 p.m."], correct: 1, 
        correctText: "TRUE TIME: 4:00",
        explanation: "Ratio = 36 true / 35 incorrect. Indicated passed (7am to 3:45pm) = 35/4 hours. True passed = (35/4) × (36/35) = 9 hours. 7 a.m. + 9 hours = 4:00 p.m."
      },
      { 
        timeStr: "Fast Clock (+10m / hr)", 
        indHour: 7, indMinute: 0, trueHour: 6, trueMinute: 0,
        q: "A watch gains 10 minutes every hour. It was set right at 12:00 noon. What is the true time when it indicates 7:00 p.m.?",
        options: ["5:00 p.m.", "6:00 p.m.", "6:30 p.m."], correct: 1, 
        correctText: "TRUE TIME: 6:00",
        explanation: "Ratio = 60 true / 70 incorrect (6/7). Indicated passed = 7 hours. True passed = 7 × (6/7) = 6 hours. 12 noon + 6 hours = 6:00 p.m."
      },
      { 
        timeStr: "Slow Clock (-10m / hr)", 
        indHour: 2, indMinute: 0, trueHour: 3, trueMinute: 0,
        q: "A watch loses 10 minutes every hour. It was set right at 9:00 a.m. What is the true time when it indicates 2:00 p.m.?",
        options: ["2:30 p.m.", "3:00 p.m.", "4:00 p.m."], correct: 1, 
        correctText: "TRUE TIME: 3:00",
        explanation: "Ratio = 60 true / 50 incorrect (6/5). Indicated passed (9am to 2pm) = 5 hours. True passed = 5 × (6/5) = 6 hours. 9 a.m. + 6 hours = 3:00 p.m."
      },
      { 
        timeStr: "Fast Clock (+5m / hr)", 
        indHour: 9, indMinute: 0, trueHour: 8, trueMinute: 0,
        q: "A watch gains 5 minutes every hour. It was set right at 8:00 a.m. What is the true time when it indicates 9:00 p.m.?",
        options: ["7:00 p.m.", "8:00 p.m.", "8:30 p.m."], correct: 1, 
        correctText: "TRUE TIME: 8:00",
        explanation: "Ratio = 60 true / 65 incorrect (12/13). Indicated passed (8am to 9pm) = 13 hours. True passed = 13 × (12/13) = 12 hours. 8 a.m. + 12 hours = 8:00 p.m."
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

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);
  
  // Clock Interaction State
  // idle (7am) -> indicated_time_set (4:15pm) -> true_time_revealed (4:00pm)
  const [clockState, setClockState] = useState('idle'); 

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanationForIncorrect, setShowExplanationForIncorrect] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.practiceQuestions;

  // Dynamically shuffle options whenever the question changes
  useEffect(() => {
      let optionsLength = 0;
      if (quizMode) {
          optionsLength = currentQuizSet[quizStep]?.options?.length || 0;
      } else {
          optionsLength = LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.length || 0;
      }
      
      if (optionsLength > 0) {
          const arr = Array.from({length: optionsLength}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [activeStep, quizStep, quizMode, appMode, currentQuizSet]);

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

  const handleClockButton = (action) => {
    if (appMode === 'practice' || quizMode || lessonFinished) return;
    
    // For step 1, skip validation since it's just a setup button
    if (activeStep !== 0 && feedback.type !== 'success') {
        setActionError("Please answer the logic question before interacting with the clock.");
        return;
    }
    const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;
    if (!expectedAction || expectedAction === 'none') return;
    
    if (action === expectedAction) {
        setClockState(action);
        setActionError("");
        if (activeStep === 0) {
            // Auto-advance step 1 since there is no real quiz question
            setFeedback({ type: 'success', msg: "", reason: "Clock positioned." });
        }
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
      
      const stepToState = ['idle', 'indicated_time_set', 'indicated_time_set', 'indicated_time_set', 'indicated_time_set'];
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

  // Determine rotations and arcs
  let minuteRotation = 0;
  let hourRotation = 0;
  let topTag = "";
  let finalAngleText = "";

  if (appMode === 'concept') {
      if (clockState === 'idle') {
          minuteRotation = 0; // At 12
          hourRotation = 210; // At 7
          topTag = "START TIME: 7:00 AM";
      }
      if (clockState === 'indicated_time_set') {
          minuteRotation = 90; // 15 mins
          hourRotation = 120 + 7.5; // 4 + quarter
          topTag = "INDICATED TIME: 4:15 PM";
      }
      if (clockState === 'true_time_revealed') {
          minuteRotation = 0; // 0 mins
          hourRotation = 120; // 4 exactly
          topTag = "TRUE TIME: 4:00 PM";
          finalAngleText = "TRUE TIME: 4:00 PM";
      }
  } else if (appMode === 'practice') {
      const currentQ = LOGIC_DATA.practice.practiceQuestions[quizStep];
      if (currentQ) {
          // Before answering correctly, show indicated time
          if (!isCorrectAnswer) {
              minuteRotation = currentQ.indMinute * 6;
              hourRotation = (currentQ.indHour % 12) * 30 + (currentQ.indMinute * 0.5);
              topTag = `INDICATED TIME: ${currentQ.indHour}:${currentQ.indMinute === 0 ? '00' : currentQ.indMinute}`;
              finalAngleText = "";
          } else {
              // After answering correctly, animate to true time smoothly
              minuteRotation = currentQ.trueMinute * 6;
              hourRotation = (currentQ.trueHour % 12) * 30 + (currentQ.trueMinute * 0.5);
              topTag = currentQ.correctText;
              finalAngleText = currentQ.correctText;
          }
      }
  }

  // Animation settings
  const isAnimating = (appMode === 'concept' && clockState === 'true_time_revealed') || 
                      (appMode === 'practice' && isCorrectAnswer) ||
                      (appMode === 'concept' && clockState === 'indicated_time_set');
  
  const transitionSpec = isAnimating 
      ? { type: "tween", duration: 1.2, ease: "easeInOut" } 
      : { duration: 0 };

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Broken Clock Lab" : "Fast/Slow Clock Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Clock Construction & Visualization */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[400px] lg:min-h-[450px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-2 text-white">
                    {appMode === 'practice' && <><span className="text-yellow-500 mr-2 bg-yellow-500/20 px-3 py-1 rounded-md">{LOGIC_DATA.practice.practiceQuestions[quizStep]?.timeStr}</span></>}
                    {quizMode ? <><Eye size={16} /> Question Simulation</> : <><Clock size={16} /> Construction Zone</>}
                </div>

                <div className="bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-black uppercase tracking-widest text-[11px] sm:text-[12px] mb-1">
                    {topTag}
                </div>
                
                {/* SVG Clock Area */}
                <div className="relative bg-[#3e2723] rounded-full border-[8px] border-yellow-500/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[250px] h-[250px] sm:w-[320px] sm:h-[320px]">
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                      {/* Inner Clock Face */}
                      <circle cx="150" cy="150" r="140" fill="#3e2723" />
                      
                      {/* Tick Marks */}
                      {Array.from({length: 60}).map((_, i) => {
                          const isHour = i % 5 === 0;
                          const posStart = polarToCartesian(150, 150, isHour ? 135 : 138, i * 6);
                          const posEnd = polarToCartesian(150, 150, 140, i * 6);
                          return <line key={i} x1={posStart.x} y1={posStart.y} x2={posEnd.x} y2={posEnd.y} stroke="white" strokeWidth={isHour ? 3 : 1} opacity={isHour ? 0.6 : 0.2} />;
                      })}

                      {/* Non-Clickable Numbers (No interaction needed for this module) */}
                      {Array.from({length: 12}).map((_, i) => {
                          const num = i + 1;
                          const pos = polarToCartesian(150, 150, 120, num * 30);
                          return (
                              <g key={`num-${num}`}>
                                  <circle cx={pos.x} cy={pos.y} r="16" fill="#2a1a16" stroke="#a88a6d" strokeWidth="2" />
                                  <text x={pos.x} y={pos.y} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">{num}</text>
                              </g>
                          );
                      })}

                      {/* Hands - Animated cleanly around the central axis using SVG transforms */}
                      <g style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}>
                          
                          {/* Minute Hand */}
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

                          {/* Hour Hand (Dynamic) */}
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
                          
                          {/* Center Pin */}
                          <circle cx="150" cy="150" r="6" fill="#ef4444" />
                      </g>

                      {/* Final Text */}
                      {['true_time_revealed'].includes(clockState) && appMode === 'concept' && (
                          <text x="150" y="200" fill="#4ade80" fontSize="16" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                      {appMode === 'practice' && isCorrectAnswer && (
                          <text x="150" y="200" fill="#4ade80" fontSize="18" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center animate-in fade-in zoom-in duration-300">
                        {activeStep === 0 && clockState !== 'indicated_time_set' && (
                            <button onClick={() => handleClockButton('indicated_time_set')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Set Indicated Time</button>
                        )}
                        {activeStep === 4 && isQuizPassed && (
                            <button onClick={() => handleClockButton('true_time_revealed')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Reveal True Time</button>
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
                                    {shuffledIndices.map((origIdx) => {
                                        const opt = currentQuizSet[quizStep]?.options?.[origIdx];
                                        if (!opt) return null;
                                        
                                        const isCorrect = quizFeedbackMode && origIdx === currentQuizSet[quizStep].correct;
                                        const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentQuizSet[quizStep].correct;
                                        const isDisabled = quizFeedbackMode;

                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                        if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                        else if (isDisabled) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                        return (
                                            <button 
                                                key={origIdx} 
                                                disabled={isDisabled}
                                                onClick={() => handleQuizSelection(origIdx)} 
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
                            {(!isQuizPassed && activeStep !== 0) ? (
                                <>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {shuffledIndices.map((origIdx) => {
                                          const opt = LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.[origIdx];
                                          if (!opt) return null;
                                          
                                          const isSelected = conceptSelectedOption === origIdx;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";

                                          return (
                                            <button 
                                                key={origIdx} 
                                                onClick={() => handleSelectionQuiz(origIdx)} 
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
                                        {(activeStep !== 0) && (
                                            <div className="bg-green-500/10 px-5 py-4 border-b border-green-500/20">
                                                <p className="text-green-400 text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                    <strong className="uppercase tracking-widest text-[11px] block mb-1.5 text-green-500">Logic Confirmed</strong>
                                                    "{feedback.reason}"
                                                </p>
                                            </div>
                                        )}
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
                                    You've successfully found the true time by calculating the ratio! Time for the final quiz.
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
                              ? "You've successfully solved the broken clock discrepancy." 
                              : "You have successfully answered the fast/slow clock drills."}
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }