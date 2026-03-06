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
        title: "Concept: 90 Degree Angle",
        text: "In every hour, the hands of a clock are usually at a 90° angle (right angle) TWICE.\n\n• 90 degrees equals exactly 15 minutes of space.\n• Time 1: Minute hand is 15 mins BEHIND the hour hand.\n• Time 2: Minute hand is 15 mins AHEAD of the hour hand.\n• Multiply your target minute spaces by the 12/11 magic catch-up fraction to get the exact time."
    },
    question: "At what times between 7 and 8 o'clock will the hands of a clock be at a 90-degree angle to each other?",
    clues: [
      { id: 1, step: 0, concept: "Base Hour", explanation: "To find any event between 7 and 8, we always use 7:00 as our base starting point.", text: "Identify the base hour for this interval." },
      { id: 2, step: 1, concept: "90° to Minutes", explanation: "Since 1 minute = 6°, 90° divided by 6° = exactly 15 minutes of space.", text: "Convert the target angle into minute-spaces." },
      { id: 3, step: 2, concept: "1st Target (Behind)", explanation: "At 7:00, the hour hand starts at 35 mins. To be 90° behind it: 35 - 15 = 20 mins.", text: "Find the minute space 15 minutes BEFORE the hour hand." },
      { id: 4, step: 3, concept: "1st Exact Time", explanation: "To reach the 20-minute mark, the minute hand takes: 20 × (12/11) = 240/11 = 21 9/11 minutes.", text: "Multiply the first target by 12/11." },
      { id: 5, step: 4, concept: "2nd Target (Ahead)", explanation: "At 7:00, the hour hand starts at 35 mins. To be 90° ahead of it: 35 + 15 = 50 mins.", text: "Find the minute space 15 minutes AFTER the hour hand." },
      { id: 6, step: 5, concept: "2nd Exact Time", explanation: "To reach the 50-minute mark, the minute hand takes: 50 × (12/11) = 600/11 = 54 6/11 minutes.", text: "Multiply the second target by 12/11." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Base Hour. To find out when the hands are 90° apart between 7 and 8, we must set the clock to the start of the hour. What is the base hour?",
        options: ["7:00", "7:30", "8:00"],
        correct: 0,
        feedback: [
          "Correct! We always calculate from the top of the starting hour (7:00).",
          "We must start calculations from 0 minutes.",
          "8:00 is the end of the interval."
        ],
        why: "All clock calculations require resetting the clock to the top of the hour.",
        instruction: "Click on the number '7' on the clock face to set the base hour to 7:00.",
        requiredActionState: 'base_time_placed'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: 90° in Minutes. Since the whole clock is 60 minutes (360°), every single minute represents 6°. How many minutes of space equal a 90° angle?",
        options: ["10 mins", "15 mins", "20 mins"],
        correct: 1,
        feedback: [
          "10 minutes × 6° = 60°.",
          "Exactly! 90° ÷ 6° = 15 minutes. The hands must be separated by 15 minute-spaces.",
          "20 minutes × 6° = 120°."
        ],
        why: "A right angle on a clock face always covers exactly 15 minutes of distance.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: 1st Target (Behind). At 7:00, the hour hand starts at the 35-minute mark. To be 90° (15 mins) BEHIND the hour hand, what minute mark must the minute hand aim for?",
        options: ["15", "20", "50"],
        correct: 1,
        feedback: [
          "That is the distance, not the target mark.",
          "Correct! 35 minutes - 15 minutes = 20. The first target is the 20-minute mark (the 4).",
          "That would be 15 minutes AHEAD."
        ],
        why: "35 (Base) - 15 (Target Gap) = 20.",
        instruction: "Click 'Show 1st Target' to visualize the 20-minute mark.",
        requiredActionState: 'show_target_1'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: 1st Exact Time. To gain those 20 spaces, we multiply by our magic 12/11 catch-up fraction. 20 × (12/11) = 240/11. What is this as a mixed fraction?",
        options: ["20 5/11 mins", "21 9/11 mins", "22 mins"],
        correct: 1,
        feedback: [
          "Check your division: 240 ÷ 11.",
          "Exactly! 240 ÷ 11 = 21 with a remainder of 9. The first 90° angle occurs at 7:21 9/11.",
          "That would be 242/11."
        ],
        why: "Target Space × 12/11 gives us the exact time the hands align with that gap.",
        instruction: "Click 'Animate 1st Angle' to see the exact 90° gap.",
        requiredActionState: 'animate_time_1'
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: 2nd Target (Ahead). The minute hand will pass the hour hand and eventually be 90° (15 mins) AHEAD of it. What minute mark must the minute hand aim for now?",
        options: ["35", "40", "50"],
        correct: 2,
        feedback: [
          "35 is where the hour hand started.",
          "That is only 5 minutes ahead.",
          "Correct! 35 minutes + 15 minutes = 50. The second target is the 50-minute mark (the 10)."
        ],
        why: "35 (Base) + 15 (Target Gap) = 50.",
        instruction: "Click 'Show 2nd Target' to reset the clock and view the new goal.",
        requiredActionState: 'show_target_2'
      },
      { 
        id: "step-6",
        selectionPrompt: "Step 6: 2nd Exact Time. Finally, multiply the new 50-space target by 12/11. 50 × (12/11) = 600/11. What is this as a mixed fraction?",
        options: ["54 6/11 mins", "55 mins", "56 4/11 mins"],
        correct: 0,
        feedback: [
          "Exactly! 600 ÷ 11 = 54 with a remainder of 6. The second 90° angle occurs at 7:54 6/11.",
          "That would be 605/11.",
          "Check your math!"
        ],
        why: "The second exact right angle occurs just before 8:00.",
        instruction: "Click 'Animate 2nd Angle' to complete the proof!",
        requiredActionState: 'animate_time_2'
      }
    ],
    postQuiz: [
      { 
        q: "Why are there TWO times when the hands form a 90° angle in most hours?", 
        options: ["Because the clock is a circle.", "Because the minute hand can be 15 mins behind the hour hand, and later 15 mins ahead.", "Because 12/11 creates two answers."], 
        correct: 1, 
        explanation: "The faster minute hand approaches from behind (-15 mins), passes the hour hand, and then pulls ahead (+15 mins)."
      },
      { 
        q: "How many minute-spaces always correspond to a 90° angle?", 
        options: ["10 minutes", "15 minutes", "20 minutes"], 
        correct: 1, 
        explanation: "Since the clock is 360° for 60 minutes, 90° is a quarter of the clock, which is exactly 15 minutes."
      }
    ]
  },
  practice: {
    coreDefinition: {
        title: "Concept: 90 Degree Angle",
        text: "To find the exact times the hands are 90° apart between hour H and the next hour:\n\n• Find the base minute mark of H (H × 5).\n• Time 1 Target = Base - 15.\n• Time 2 Target = Base + 15.\n• Multiply both Targets by 12/11 to find the exact times past the hour."
    },
    practiceQuestions: [
      { 
        timeStr: "Between 4 and 5 (First Time)", hour: 4, minuteTarget: 5, // 20 - 15 = 5
        q: "At what exact FIRST time between 4 and 5 o'clock will the hands be at 90°?",
        options: ["5 5/11 mins past 4", "10 10/11 mins past 4", "15 mins past 4"], correct: 0, 
        correctText: "90° at 4:05 5/11",
        explanation: "Base is 4:00 (20 mins). 1st Target = 20 - 15 = 5. Exact time = 5 × 12/11 = 60/11 = 5 5/11 mins past 4."
      },
      { 
        timeStr: "Between 5 and 6 (Second Time)", hour: 5, minuteTarget: 40, // 25 + 15 = 40
        q: "At what exact SECOND time between 5 and 6 o'clock will the hands be at 90°?",
        options: ["40 mins past 5", "43 7/11 mins past 5", "45 5/11 mins past 5"], correct: 1, 
        correctText: "90° at 5:43 7/11",
        explanation: "Base is 5:00 (25 mins). 2nd Target = 25 + 15 = 40. Exact time = 40 × 12/11 = 480/11 = 43 7/11 mins past 5."
      },
      { 
        timeStr: "Between 2 and 3 (Second Time)", hour: 2, minuteTarget: 25, // 10 + 15 = 25
        q: "At what exact SECOND time between 2 and 3 o'clock will the hands be at 90°?",
        options: ["25 mins past 2", "27 3/11 mins past 2", "30 mins past 2"], correct: 1, 
        correctText: "90° at 2:27 3/11",
        explanation: "Base is 2:00 (10 mins). 2nd Target = 10 + 15 = 25. Exact time = 25 × 12/11 = 300/11 = 27 3/11 mins past 2."
      },
      { 
        timeStr: "Between 8 and 9 (First Time)", hour: 8, minuteTarget: 25, // 40 - 15 = 25
        q: "At what exact FIRST time between 8 and 9 o'clock will the hands be at 90°?",
        options: ["25 5/11 mins past 8", "27 3/11 mins past 8", "30 mins past 8"], correct: 1, 
        correctText: "90° at 8:27 3/11",
        explanation: "Base is 8:00 (40 mins). 1st Target = 40 - 15 = 25. Exact time = 25 × 12/11 = 300/11 = 27 3/11 mins past 8."
      },
      { 
        timeStr: "Between 10 and 11 (First Time)", hour: 10, minuteTarget: 35, // 50 - 15 = 35
        q: "At what exact FIRST time between 10 and 11 o'clock will the hands be at 90°?",
        options: ["38 2/11 mins past 10", "40 mins past 10", "42 4/11 mins past 10"], correct: 0, 
        correctText: "90° at 10:38 2/11",
        explanation: "Base is 10:00 (50 mins). 1st Target = 50 - 15 = 35. Exact time = 35 × 12/11 = 420/11 = 38 2/11 mins past 10."
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
  // idle -> base_time_placed -> show_target_1 -> animate_time_1 -> show_target_2 -> animate_time_2
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

      if (expectedAction === 'base_time_placed' && num === 7) {
          setClockState('base_time_placed');
          setActionError("");
      } else if (expectedAction === 'base_time_placed' && num !== 7) {
          setActionError("Incorrect. We are evaluating between 7 and 8, so start at 7:00.");
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
      
      const stepToState = ['idle', 'base_time_placed', 'base_time_placed', 'show_target_1', 'animate_time_1', 'show_target_2', 'animate_time_2'];
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
  let finalAngleText = "";
  let showTargetMarker = null;

  if (appMode === 'concept') {
      if (clockState !== 'idle') {
          showMinute = true;
          showHour = true;
      }
      if (['base_time_placed'].includes(clockState)) {
          minuteRotation = 0; // At 12
          hourRotation = 210; // At 7
      }
      if (['show_target_1'].includes(clockState)) {
          minuteRotation = 0; 
          hourRotation = 210; 
          showTargetMarker = 120; // 20 mins = 120 deg
      }
      if (['animate_time_1'].includes(clockState)) {
          minuteRotation = 130.909; // 240/11 mins
          hourRotation = 220.909; // 210 + 240/11 * 0.5
          arcStart = 130.909;
          arcEnd = 220.909;
          finalAngleText = "21 9/11 MINS";
      }
      if (['show_target_2'].includes(clockState)) {
          minuteRotation = 0; 
          hourRotation = 210; 
          showTargetMarker = 300; // 50 mins = 300 deg
      }
      if (['animate_time_2'].includes(clockState)) {
          minuteRotation = 327.272; // 600/11 mins
          hourRotation = 237.272; // 210 + 600/11 * 0.5
          arcStart = 237.272;
          arcEnd = 327.272;
          finalAngleText = "54 6/11 MINS";
      }
  } else if (appMode === 'practice') {
      const currentQ = LOGIC_DATA.practice.practiceQuestions[quizStep];
      if (currentQ) {
          showMinute = true;
          showHour = true;
          // Before answering correctly, show base hour
          if (!isCorrectAnswer) {
              minuteRotation = 0;
              hourRotation = currentQ.hour * 30;
              finalAngleText = "";
          } else {
              // After answering correctly, animate to exactly 90 degrees
              const overlapMins = currentQ.minuteTarget * (12/11);
              const overlapAngle = overlapMins * 6; 
              minuteRotation = overlapAngle;
              hourRotation = currentQ.hour * 30 + overlapMins * 0.5;
              
              arcStart = Math.min(hourRotation, minuteRotation);
              arcEnd = Math.max(hourRotation, minuteRotation);
              
              finalAngleText = currentQ.correctText;
          }
      }
  }

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "90 Degree Hands Lab" : "90 Degree Angle Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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
                      
                      {/* Wedges/Arcs Rendering for 90 Degree Highlight */}
                      {(['animate_time_1', 'animate_time_2'].includes(clockState) || (appMode === 'practice' && isCorrectAnswer)) && (
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

                      {/* Ghost Target Marker for Concept Mode */}
                      {showTargetMarker !== null && appMode === 'concept' && (
                          <circle cx={polarToCartesian(150, 150, 140, showTargetMarker).x} cy={polarToCartesian(150, 150, 140, showTargetMarker).y} r="10" fill="#e11d48" className="animate-pulse" />
                      )}

                      {/* Clickable Numbers */}
                      {renderClockNumbers()}

                      {/* Hands */}
                      <g style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}>
                          
                          {/* Minute Hand */}
                          {showMinute && (
                              <motion.line 
                                x1="150" y1="150" 
                                animate={{
                                    x2: polarToCartesian(150, 150, 100, minuteRotation).x,
                                    y2: polarToCartesian(150, 150, 100, minuteRotation).y
                                }}
                                transition={{ type: "spring", stiffness: 40, damping: 14 }}
                                stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                              />
                          )}

                          {/* Hour Hand (Dynamic) */}
                          {showHour && (
                              <motion.line 
                                x1="150" y1="150" 
                                animate={{
                                    x2: polarToCartesian(150, 150, 80, hourRotation).x,
                                    y2: polarToCartesian(150, 150, 80, hourRotation).y
                                }}
                                transition={{ type: "spring", stiffness: 40, damping: 14 }}
                                stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" 
                              />
                          )}
                          
                          {/* Center Pin */}
                          <circle cx="150" cy="150" r="6" fill="#ef4444" />
                      </g>

                      {/* Final Text */}
                      {['animate_time_1', 'animate_time_2'].includes(clockState) && appMode === 'concept' && (
                          <text x="150" y="240" fill="#fde047" fontSize="16" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                      {appMode === 'practice' && isCorrectAnswer && (
                          <text x="150" y="200" fill="#fde047" fontSize="18" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && isQuizPassed && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center animate-in fade-in zoom-in duration-300">
                        {activeStep === 2 && (
                            <button onClick={() => handleClockButton('show_target_1')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Show 1st Target</button>
                        )}
                        {activeStep === 3 && (
                            <button onClick={() => handleClockButton('animate_time_1')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Animate 1st Angle</button>
                        )}
                        {activeStep === 4 && (
                            <button onClick={() => handleClockButton('show_target_2')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Show 2nd Target</button>
                        )}
                        {activeStep === 5 && (
                            <button onClick={() => handleClockButton('animate_time_2')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Animate 2nd Angle</button>
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
                                    You've successfully found both times the hands are 90 degrees apart. Time for the final quiz!
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
                              ? "You've successfully mapped the exact 90-degree alignments." 
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