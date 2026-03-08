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
        title: "Concept: The Gaining Clock",
        text: "To find when a uniformly gaining/losing clock shows the exact true time:\n\n• Find Total Hours Passed between observations.\n• Find Total Minutes Gained (Low + Fast).\n• Find the Hourly Rate: (Total Hours / Total Gain).\n• Multiply the initial 'Low' minutes by this Rate to find the hours needed to catch up!"
    },
    question: "A watch which gains uniformly is 5 minutes low at noon on Monday and is 3 minutes 30 seconds fast at 2 p.m. on the following Monday. When was it correct?",
    clues: [
      { id: 1, step: 0, concept: "Elapsed Time", explanation: "Find the exact amount of TRUE hours passed from the first observation to the second.", text: "Calculate the total hours passed." },
      { id: 2, step: 1, concept: "Total Gain", explanation: "The watch recovered its 5-minute deficit and added an extra 3.5 minutes. 5 + 3.5 = 8.5 minutes.", text: "Determine the total minutes the watch gained." },
      { id: 3, step: 2, concept: "Gain Rate", explanation: "Divide the Total Hours by the Total Gain. 170 hours / 8.5 minutes = 20 hours per minute gained.", text: "Calculate how many hours it takes to gain 1 minute." },
      { id: 4, step: 3, concept: "Target Recovery", explanation: "To be exactly correct, the watch only needed to make up the original 5 minutes it was behind.", text: "Identify the target gain amount." },
      { id: 5, step: 4, concept: "Time to Correct", explanation: "5 minutes × 20 hours/min = 100 hours. The watch took 100 hours to show the correct time.", text: "Calculate the hours required to reach the target." },
      { id: 6, step: 5, concept: "Final Addition", explanation: "Add 100 hours (4 days, 4 hours) to Monday Noon.", text: "Determine the final correct day and time." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Total Time. From exactly 12:00 Noon on Monday to 2:00 p.m. on the following Monday, how many total true hours have passed?",
        options: ["168 hours", "170 hours", "172 hours"],
        correct: 1,
        feedback: [
          "168 hours is exactly 7 days (Monday Noon to Monday Noon). Don't forget the extra 2 hours!",
          "Correct! 7 days (168 hours) + 2 hours = 170 total hours passed.",
          "Check your math! 7 days = 168 hours. Add 2 hours."
        ],
        why: "7 days × 24 hours = 168 hours. Add the 2 hours to get to 2 p.m.",
        instruction: "Click 'Set Indicated Time' below to advance the clock.",
        requiredActionState: 'time_passed_calculated'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Total Gain. Over these 170 hours, the watch went from being 5 minutes LOW to being 3.5 minutes FAST. What is the total amount of minutes gained?",
        options: ["1.5 minutes", "8 minutes", "8.5 minutes"],
        correct: 2,
        feedback: [
          "You subtracted! But it had to cross zero to become fast, so we add the distances.",
          "Don't forget the extra 30 seconds (0.5 minutes).",
          "Exactly! 5 minutes (to reach correct time) + 3.5 minutes (getting ahead) = 8.5 minutes of total gain."
        ],
        why: "Total Gain = Initial Deficit + Final Surplus.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Hourly Rate. If the watch gains 8.5 minutes in 170 hours, how many true hours does it take to gain exactly 1 minute? (Hint: 170 ÷ 8.5)",
        options: ["15 hours", "20 hours", "25 hours"],
        correct: 1,
        feedback: [
          "15 × 8.5 is 127.5.",
          "Correct! 170 ÷ 8.5 = 20. The watch gains 1 minute every 20 true hours.",
          "25 × 8.5 is 212.5."
        ],
        why: "Total Hours (170) ÷ Total Minutes Gained (8.5) = 20 hours per minute.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Target Recovery. To show the true correct time, the watch doesn't need to gain the full 8.5 minutes. It only needs to make up for the time it was initially behind. What is this target?",
        options: ["3.5 minutes", "5 minutes", "8.5 minutes"],
        correct: 1,
        feedback: [
          "That is how far ahead it ended up.",
          "Exactly! It started 5 minutes low, so gaining exactly 5 minutes will make it perfectly correct.",
          "That is the total gain over the whole week."
        ],
        why: "Correct time is achieved the moment the initial deficit is erased.",
        instruction: "Logic Confirmed. Proceed to the next step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Time Needed. If it takes 20 hours to gain 1 minute, how many hours will it take to gain our target of 5 minutes?",
        options: ["80 hours", "100 hours", "120 hours"],
        correct: 1,
        feedback: [
          "Check your multiplication: 5 × 20.",
          "Correct! 5 minutes × 20 hours/min = 100 hours.",
          "That would be for 6 minutes."
        ],
        why: "Target Gain (5) × Hourly Rate (20) = 100 hours.",
        instruction: "Logic Confirmed. Proceed to the final step.",
        requiredActionState: 'none'
      },
      { 
        id: "step-6",
        selectionPrompt: "Step 6: The Correct Time. 100 hours is exactly 4 days and 4 hours (96 + 4). If we add this to our starting time of Monday 12:00 Noon, when is the watch correct?",
        options: ["Thursday 4:00 p.m.", "Friday 4:00 p.m.", "Saturday 8:00 a.m."],
        correct: 1,
        feedback: [
          "Monday + 4 days is Friday, not Thursday.",
          "Exactly! Monday Noon + 4 days = Friday Noon. Friday Noon + 4 hours = Friday 4:00 p.m.!",
          "Check your day math: Mon + 4 days + 4 hours."
        ],
        why: "Adding the recovery time to the start time gives the exact moment of correctness.",
        instruction: "Click 'Reveal Correct Time' to finalize the puzzle!",
        requiredActionState: 'correct_time_revealed'
      }
    ],
    postQuiz: [
      { 
        q: "If a watch is 2 mins low, and later 4 mins fast, what is the total gain?", 
        options: ["2 minutes", "4 minutes", "6 minutes"], 
        correct: 2, 
        explanation: "You must add the low deficit and the fast surplus: 2 + 4 = 6 minutes."
      },
      { 
        q: "If a watch gains 1 minute every 15 hours, how long will it take to recover being 3 minutes low?", 
        options: ["5 hours", "30 hours", "45 hours"], 
        correct: 2, 
        explanation: "3 minutes × 15 hours/min = 45 hours."
      }
    ]
  },
  practice: {
    coreDefinition: {
        title: "Concept: The Gaining Clock",
        text: "Formula to find the Exact Correct Time:\n\n• Gain = (Low Mins + Fast Mins)\n• Rate = (Total Hours Passed ÷ Total Gain)\n• Hours to Correct = (Initial Low Mins × Rate)\n• Add 'Hours to Correct' to the starting time!"
    },
    practiceQuestions: [
      { 
        timeStr: "Drill 1 (4.8 min Fast)", 
        ansHour: 2, ansMinute: 0,
        q: "A watch is 2 mins low at noon on Monday and is 4 min 48 sec fast at 2 p.m. on the following Monday. When was it correct?",
        options: ["Tuesday 2:00 p.m.", "Wednesday 2:00 p.m.", "Thursday 12:00 noon"], correct: 1, 
        correctText: "WEDNESDAY 2:00 PM",
        explanation: "Time = 170 hrs. Gain = 2 + 4.8 = 6.8 mins. Rate = 170/6.8 = 25 hrs/min. To gain 2 mins: 2 * 25 = 50 hrs. Noon Mon + 50 hrs (2 days 2 hrs) = Wed 2:00 p.m."
      },
      { 
        timeStr: "Drill 2 (60 Hour Span)", 
        ansHour: 3, ansMinute: 0,
        q: "A watch is 2 mins low at 9 a.m. on Monday and is 2 mins fast at 9 p.m. on Wednesday. When was it correct?",
        options: ["Tuesday 9:00 a.m.", "Tuesday 3:00 p.m.", "Wednesday 9:00 a.m."], correct: 1, 
        correctText: "TUESDAY 3:00 PM",
        explanation: "Time = 60 hrs. Total Gain = 4 mins. Rate = 60/4 = 15 hrs/min. Target Gain = 2 mins. Time needed = 30 hrs. Mon 9 a.m. + 30 hrs = Tue 3:00 p.m."
      },
      { 
        timeStr: "Drill 3 (72 Hour Span)", 
        ansHour: 8, ansMinute: 0,
        q: "A watch is 5 mins low at 2 p.m. on Tuesday and is 7 mins fast at 2 p.m. on Friday. When was it correct?",
        options: ["Wednesday 8:00 p.m.", "Thursday 8:00 a.m.", "Thursday 2:00 p.m."], correct: 0, 
        correctText: "WEDNESDAY 8:00 PM",
        explanation: "Time = 72 hrs. Total Gain = 12 mins. Rate = 72/12 = 6 hrs/min. Target Gain = 5 mins. Time needed = 30 hrs. Tue 2 p.m. + 30 hrs = Wed 8:00 p.m."
      },
      { 
        timeStr: "Drill 4 (54 Hour Span)", 
        ansHour: 6, ansMinute: 0,
        q: "A watch is 3 mins low at 6 a.m. on Thursday and is 1.5 mins fast at 12 noon on Saturday. When was it correct?",
        options: ["Friday 12:00 noon", "Friday 6:00 p.m.", "Saturday 6:00 a.m."], correct: 1, 
        correctText: "FRIDAY 6:00 PM",
        explanation: "Time = 54 hrs. Total Gain = 4.5 mins. Rate = 54/4.5 = 12 hrs/min. Target Gain = 3 mins. Time needed = 36 hrs. Thu 6 a.m. + 36 hrs (1.5 days) = Fri 6:00 p.m."
      },
      { 
        timeStr: "Drill 5 (Fractional Hours)", 
        ansHour: 12, ansMinute: 48,
        q: "A watch is 4 mins low at 8 a.m. on Sunday and is 6 mins fast at 8 a.m. on Wednesday. When was it correct?",
        options: ["Monday 12:48 p.m.", "Monday 8:00 p.m.", "Tuesday 12:48 a.m."], correct: 0, 
        correctText: "MONDAY 12:48 PM",
        explanation: "Time = 72 hrs. Gain = 10 mins. Rate = 7.2 hrs/min. Target Gain = 4 mins. Time needed = 28.8 hrs = 28 hrs 48 mins. Sun 8 a.m. + 28 hrs 48 mins = Mon 12:48 p.m."
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
      
      const stepToState = [
          'idle', 
          'time_passed_calculated', 
          'time_passed_calculated', 
          'time_passed_calculated', 
          'time_passed_calculated', 
          'time_passed_calculated'
      ];
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
      // Idle is Start Time (Mon 12:00)
      if (clockState === 'idle') {
          minuteRotation = 0; // 12
          hourRotation = 0; // 12
          topTag = "MONDAY 12:00 PM (5 mins slow)";
      } else if (clockState === 'time_passed_calculated') {
          minuteRotation = 0; // 12
          hourRotation = 60; // 2
          topTag = "NEXT MONDAY 2:00 PM (3.5 mins fast)";
      } else if (clockState === 'correct_time_revealed') {
          minuteRotation = 0; // 0 mins
          hourRotation = 120; // 4
          topTag = "FRIDAY 4:00 PM";
          finalAngleText = "FRIDAY 4:00 PM";
      }
  } else if (appMode === 'practice') {
      const currentQ = LOGIC_DATA.practice.practiceQuestions[quizStep];
      if (currentQ) {
          // Before answering correctly, keep neutral
          if (!isCorrectAnswer) {
              minuteRotation = 0;
              hourRotation = 0;
              topTag = "PRACTICE DRILL";
              finalAngleText = "";
          } else {
              // After answering correctly, animate to correct time
              minuteRotation = currentQ.ansMinute * 6;
              hourRotation = (currentQ.ansHour % 12) * 30 + (currentQ.ansMinute * 0.5);
              topTag = currentQ.correctText;
              finalAngleText = currentQ.correctText;
          }
      }
  }

  // Animation settings
  const isAnimating = (appMode === 'concept' && clockState === 'correct_time_revealed') || 
                      (appMode === 'concept' && clockState === 'time_passed_calculated') || 
                      (appMode === 'practice' && isCorrectAnswer);
  
  const transitionSpec = isAnimating 
      ? { type: "tween", duration: 1.2, ease: "easeInOut" } 
      : { duration: 0 };

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Gaining Clock Lab" : "Time Recovery Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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

                      {/* Non-Clickable Numbers */}
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
                      {clockState === 'correct_time_revealed' && appMode === 'concept' && (
                          <text x="150" y="200" fill="#4ade80" fontSize="16" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                      {appMode === 'practice' && isCorrectAnswer && (
                          <text x="150" y="200" fill="#4ade80" fontSize="18" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>{finalAngleText}</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && isQuizPassed && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center animate-in fade-in zoom-in duration-300">
                        {activeStep === 0 && (
                            <button onClick={() => handleClockButton('time_passed_calculated')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Set Indicated Time</button>
                        )}
                        {activeStep === 5 && (
                            <button onClick={() => handleClockButton('correct_time_revealed')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Reveal Correct Time</button>
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
                            
                            {(!isQuizPassed) ? (
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
                                    You've successfully solved the broken clock discrepancy. Time for the final quiz!
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
                              ? "You've successfully mapped the time recovery formula." 
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