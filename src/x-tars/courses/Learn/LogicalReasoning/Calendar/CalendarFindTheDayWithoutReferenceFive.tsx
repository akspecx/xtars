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
  Compass,
  Info,
  MousePointer2,
  Eye,
  FileText,
  CalendarDays,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Target,
  Search,
  ArrowLeft,
  DivideSquare,
  FastForward,
  Calculator,
  History,
  Globe
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

const fullConceptString = "The Absolute Day Code: How to find the day of the week for ANY date in history!";

const LOGIC_DATA = {
  concept: {
    question: "What was the exact day of the week on 28th May, 2006?",
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: The Completed Years. To find an absolute date, we first calculate odd days for all FULLY COMPLETED years. For May 28th 2006, the year 2006 is still ongoing. What is the last fully completed year, and how do we break it down into centuries and years?",
        options: ["2000 + 5", "1900 + 105", "2006 + 0"],
        correct: 0,
        feedback: [
          "Exactly! The completed year is 2005, which breaks down cleanly into 2000 + 5.",
          "That doesn't isolate the 400-year leaps.",
          "2006 is not completed yet!"
        ],
        why: "Core Rule: Always step back to the last fully completed year (2005) and split it into centuries and years (2000 + 5) to use our cheat codes.",
        instruction: "Click 'Split 2005' below to lock in the breakdown.",
        requiredActionState: 'step1_done',
        buttonText: "Split 2005"
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Century Odd Days. Let's look at the '2000' part. We know every 400 years generates exactly 0 odd days (the calendar resets). Since 2000 is a perfect multiple of 400, how many odd days are in the first 2000 years?",
        options: ["5 Odd Days", "0 Odd Days", "1 Odd Day"],
        correct: 1,
        feedback: [
          "That's for 100 years.",
          "Brilliant! It's a perfect 400-year reset.",
          "That's for 300 years."
        ],
        why: "Core Rule: Any multiple of 400 (400, 800, 1200, 1600, 2000) generates 0 Odd Days. The slate is wiped clean!",
        instruction: "Click 'Calculate 2000' below to see the 0 day shift.",
        requiredActionState: 'step2_done',
        buttonText: "Calculate 2000"
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Odd Days in 5 Years. Now look at the remaining '5' years. In 5 years, there is 1 Leap Year (2004) and 4 Ordinary Years. Calculation: 1 Leap(2 odd days) + 4 Ordinary(1 odd day) = 2 + 4 = 6 odd days. What is the total odd days for the completed year 2005?",
        options: ["6 Odd Days", "0 Odd Days", "5 Odd Days"],
        correct: 0,
        feedback: [
          "Yes! 0 (from 2000) + 6 (from 5 years) = 6 Odd Days.",
          "You forgot the 5 years!",
          "Don't forget the extra day from the leap year!"
        ],
        why: "Core Rule: To find odd days in remaining years, add the number of leap years to the number of ordinary years.",
        instruction: "Click 'Calculate 5 Years' below to see the +6 shift.",
        requiredActionState: 'step3_done',
        buttonText: "Calculate 5 Years"
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Current Year Months. Now we count the days in 2006 up to May 28th. Jan(31) + Feb(28) + Mar(31) + Apr(30) + May(28) = 148 days. If we divide 148 by 7 to remove full weeks, what is the remainder?",
        options: ["5 Odd Days", "3 Odd Days", "1 Odd Day"],
        correct: 2,
        feedback: [
          "Too high!",
          "Check your math.",
          "Exactly! 148 ÷ 7 = 21 weeks with exactly 1 odd day left."
        ],
        why: "Core Rule: Add up the days of the current uncompleted year and find the remainder divided by 7.",
        instruction: "Click 'Add 2006 Months' below to add the final 1 day shift.",
        requiredActionState: 'step4_done',
        buttonText: "Add 2006 Months"
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: The Absolute Day Code. Total Odd Days = 6 (from 2005) + 1 (from 2006) = 7. Wait, 7 ÷ 7 leaves a remainder of 0! The universal Day Code is: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat. What day is 0?",
        options: ["Sunday", "Saturday", "Monday"],
        correct: 0,
        feedback: [
          "YES! 0 Remainder perfectly aligns with Sunday.",
          "Saturday is 6.",
          "Monday is 1."
        ],
        why: "Core Rule: The final total of all odd days divided by 7 gives you a single digit from 0 to 6, which maps perfectly to the days of the week starting with Sunday at 0.",
        instruction: "Click 'Reveal Final Day' to solve the absolute date puzzle!",
        requiredActionState: 'step5_done',
        buttonText: "Reveal Final Day"
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Completed Year", explanation: "Always subtract 1 from the target year to find the fully completed years. 2006 -> 2005.", text: "Target - 1 = Completed Years." },
      { id: 2, step: 1, concept: "Century Block", explanation: "Split the completed year into a Century block. 2000 is a multiple of 400, so it equals 0 odd days.", text: "2000 Years = 0 Odd Days." },
      { id: 3, step: 2, concept: "Year Block", explanation: "For the remaining years (5), count Leap Years (1) and Ordinary Years (4). 1(2) + 4(1) = 6.", text: "5 Years = 6 Odd Days." },
      { id: 4, step: 3, concept: "Current Months", explanation: "Count the days in the current year. 148 days ÷ 7 = Remainder 1.", text: "2006 to May 28 = 1 Odd Day." },
      { id: 5, step: 4, concept: "Absolute Code", explanation: "Total Odd Days = 6 + 1 = 7. 7 ÷ 7 = 0. The code assigns 0 to Sunday.", text: "0 = Sunday, 1 = Monday..." }
    ]
  },
  practice: {
    question: "Find the Absolute Day of the Week! Remember the code: 0=Sun, 1=Mon, 2=Tue...",
    quiz: [
      { 
        q: "What was the day of the week on 15th August, 1947?", 
        startDayIdx: 0, 
        endDayIdx: 5,
        options: ["Friday", "Saturday", "Sunday"], 
        correct: 0, 
        explanation: "1946 (Completed) = 1600(0) + 300(1) + 46(11L+35O = 57 = 1) = 2 odd days. 1947 to Aug 15 = 227 days = 3 odd days. Total = 2 + 3 = 5 (Friday).",
        breakdown: { logic: "1946 = 1600(0) + 300(1) + 46(1)", calculation: "1947 Months = 3. Total = 5", jump: "Code 5 = Friday" }
      },
      { 
        q: "What was the day of the week on 26th January, 1950?", 
        startDayIdx: 0, 
        endDayIdx: 4,
        options: ["Wednesday", "Friday", "Thursday"], 
        correct: 2, 
        explanation: "1949 (Completed) = 1600(0) + 300(1) + 49(12L+37O = 61 = 5) = 6 odd days. 1950 to Jan 26 = 26 days = 5 odd days. Total = 11. 11 ÷ 7 = 4 (Thursday).",
        breakdown: { logic: "1949 = 1600(0) + 300(1) + 49(5)", calculation: "1950 Jan 26 = 5. Total = 11=4", jump: "Code 4 = Thursday" }
      },
      { 
        q: "What was the day of the week on 2nd October, 1869? (Gandhi's Birth)", 
        startDayIdx: 0, 
        endDayIdx: 6,
        options: ["Saturday", "Friday", "Sunday"], 
        correct: 0, 
        explanation: "1868 (Completed) = 1600(0) + 200(3) + 68(17L+51O = 85 = 1) = 4 odd days. 1869 to Oct 2 = 275 days = 2 odd days. Total = 6 (Saturday).",
        breakdown: { logic: "1868 = 1600(0) + 200(3) + 68(1)", calculation: "1869 Months = 2. Total = 6", jump: "Code 6 = Saturday" }
      },
      { 
        q: "What was the day of the week on 1st January, 2010?", 
        startDayIdx: 0, 
        endDayIdx: 5,
        options: ["Saturday", "Friday", "Thursday"], 
        correct: 1, 
        explanation: "2009 (Completed) = 2000(0) + 9(2L+7O = 11 = 4) = 4 odd days. 2010 to Jan 1 = 1 odd day. Total = 5 (Friday).",
        breakdown: { logic: "2009 = 2000(0) + 9 yrs(4)", calculation: "2010 Jan 1 = 1. Total = 5", jump: "Code 5 = Friday" }
      },
      { 
        q: "What was the day of the week on 14th February, 2004?", 
        startDayIdx: 0, 
        endDayIdx: 6,
        options: ["Sunday", "Monday", "Saturday"], 
        correct: 2, 
        explanation: "2003 (Completed) = 2000(0) + 3(0L+3O = 3) = 3 odd days. 2004 to Feb 14 = Jan(31) + Feb(14) = 45. 45 ÷ 7 = 3 odd days. Total = 6 (Saturday).",
        breakdown: { logic: "2003 = 2000(0) + 3 yrs(3)", calculation: "2004 to Feb 14 = 3. Total = 6", jump: "Code 6 = Saturday" }
      }
    ]
  }
};

// --- Math Helpers for SVG ---
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
  let diff = endAngle - startAngle;
  if (diff < 0) diff += 360;
  const largeArcFlag = diff <= 180 ? "0" : "1";
  
  if (startAngle === endAngle) {
      // Draw a full circle if start and end are the same (0 shift)
      const start2 = polarToCartesian(x, y, radius, endAngle - 0.01);
      return [
        "M", x, y, 
        "L", start.x, start.y, 
        "A", radius, radius, 0, 1, 0, start2.x, start2.y,
        "Z"
      ].join(" ");
  }

  return [
    "M", x, y, 
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  
  // Visualizer State
  const [calendarState, setCalendarState] = useState('idle'); 

  // Practice State
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);
  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = LOGIC_DATA.practice.quiz;

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
    setCalendarState('idle');
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setShowFinishModal(false);
    setLessonFinished(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // --- Interaction Handlers ---
  const handleCalendarButton = (action) => {
    if (appMode === 'practice' || showFinishModal) return;
    if (feedback.type !== 'success') {
        setActionError("Please answer the logic question before interacting with the visualizer.");
        return;
    }
    const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep].requiredActionState;
    
    if (action === expectedAction) {
        setCalendarState(action);
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

  function handlePracticeSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
    if (idx === currentQuizSet[quizStep].correct) {
        setShowExplanation(true); 
    } else {
        setShowExplanation(false); 
    }
  }

  function tryAgainPractice() {
    setQuizFeedbackMode(false);
    setShowExplanation(false);
  }

  function prevStep() {
      if (activeStep > 0) {
          const prevIdx = activeStep - 1;
          setActiveStep(prevIdx);
          setConceptSelectedOption(null);
          setFeedback({ type: null, msg: "", reason: "" });
          setActionError("");
          
          if (prevIdx === 0) setCalendarState('idle');
          if (prevIdx === 1) setCalendarState('step1_done');
          if (prevIdx === 2) setCalendarState('step2_done');
          if (prevIdx === 3) setCalendarState('step3_done');
          if (prevIdx === 4) setCalendarState('step4_done');
      }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setCalendarState('idle'); // Reset visualization for the new step to require user action again
    } else {
      setLessonFinished(true);
      setShowFinishModal(true);
    }
  }

  function prevPracticeTask() {
      if (quizStep > 0) {
          setQuizStep(quizStep - 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
      }
  }

  function nextPracticeTask() {
    if (quizStep < currentQuizSet.length - 1) {
      setQuizStep(quizStep + 1);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
    } else {
      setLessonFinished(true);
      setShowFinishModal(true);
    }
  }

  const isQuizPassed = feedback.type === 'success';
  const currentStepReqAction = LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;
  
  const isBoardValid = appMode === 'concept' && (!currentStepReqAction || calendarState === currentStepReqAction);

  // --- Visualizer Rendering ---
  const renderWeekCircle = () => {
    return daysOfWeek.map((day, i) => {
        const pos = polarToCartesian(150, 150, 110, i * (360/7));
        let isStart = false;
        let isEnd = false;

        if (appMode === 'concept') {
            // Because absolute code starts with Sunday (0), the base start is 0
            isStart = (i === 0);
            
            // State-dependent highlights
            if (activeStep === 0) { isStart = false; isEnd = false; } 
            else if (activeStep === 1) { isStart = (i === 0); isEnd = (calendarState === 'step2_done' && i === 0); } 
            else if (activeStep === 2) { isStart = (i === 0); isEnd = (calendarState === 'step3_done' && i === 6); } // 0 + 6
            else if (activeStep === 3) { isStart = (i === 6); isEnd = (calendarState === 'step4_done' && i === 0); } // 6 + 1 = 7 (0)
            else if (activeStep === 4) { isStart = false; isEnd = (calendarState === 'step5_done' && i === 0); } // Final reveal
        } else if (appMode === 'practice') {
            const currentQ = LOGIC_DATA.practice.quiz[quizStep];
            isStart = (i === currentQ?.startDayIdx);
            isEnd = (quizFeedbackMode && i === currentQ?.endDayIdx);
        }

        return (
            <g key={day} className="transition-all duration-500">
                <circle cx={pos.x} cy={pos.y} r="22" 
                    fill={isEnd ? "#22c55e" : isStart ? "#eab308" : "#3e2723"} 
                    stroke={isEnd || isStart ? "white" : "#a88a6d"} strokeWidth="2" 
                    className="transition-all duration-500"
                />
                <text x={pos.x} y={pos.y} fill={isEnd || isStart ? "black" : "white"} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central">{day}</text>
            </g>
        );
    });
  }

  const getArcAngles = () => {
      if (appMode === 'concept') {
          if (calendarState === 'step2_done') return { start: 0 * (360/7), end: 0 * (360/7), fullCircle: true }; // 0 shift
          if (calendarState === 'step3_done') return { start: 0 * (360/7), end: 6 * (360/7), fullCircle: false }; // +6
          if (calendarState === 'step4_done') return { start: 6 * (360/7), end: 7 * (360/7), fullCircle: false }; // +1 (wraps to 0)
          if (calendarState === 'step5_done') return null; // Just show the final node
      } else if (appMode === 'practice' && quizFeedbackMode) {
          const currentQ = LOGIC_DATA.practice.quiz[quizStep];
          let s = currentQ.startDayIdx;
          let e = currentQ.endDayIdx;
          
          if (s === e) return { start: 0, end: 0, fullCircle: true }; // Full loop for 0 remainder
          
          if (e < s && (s - e) > 3) e += 7; 
          if (s < e && (e - s) > 3) s += 7;
          
          let start = Math.min(s, e);
          let end = Math.max(s, e);
          
          return { start: start * (360/7), end: end * (360/7), fullCircle: false };
      }
      return null;
  }

  const arcData = getArcAngles();

  // Determine what text to show in the center of the calendar based on the current step progress
  const renderCenterText = () => {
      if (appMode === 'practice' && quizFeedbackMode && quizSelection === currentQuizSet[quizStep].correct) {
          return <text x="150" y="150" fill="#22c55e" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Target Found!</text>;
      }
      
      if (appMode !== 'concept') return null;

      if (calendarState === 'idle') {
          if (activeStep === 0) return (
            <text x="150" y="150" fill="#eab308" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                <tspan x="150" dy="-10">Absolute Date:</tspan>
                <tspan x="150" dy="20">28 May 2006</tspan>
            </text>
          );
          if (activeStep === 1) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Start: SUNDAY</text>;
          if (activeStep === 2) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Start: SUNDAY</text>;
          if (activeStep === 3) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Start: SATURDAY</text>;
          if (activeStep === 4) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Find Remainder</text>;
      }

      if (calendarState === 'step1_done') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">2005 Years</tspan>
              <tspan x="150" dy="24" fontSize="20">2000 + 5</tspan>
          </text>
      );

      if (calendarState === 'step2_done') return (
          <text x="150" y="150" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">2000 Years</tspan>
              <tspan x="150" dy="24" fontSize="20">0 Odd Days</tspan>
          </text>
      );
      
      if (calendarState === 'step3_done') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SUN + 6</tspan>
              <tspan x="150" dy="24" fontSize="20">= SATURDAY</tspan>
          </text>
      );

      if (calendarState === 'step4_done') return (
          <text x="150" y="150" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SAT + 1</tspan>
              <tspan x="150" dy="24" fontSize="20">= SUNDAY</tspan>
          </text>
      );

      if (calendarState === 'step5_done') return (
          <text x="150" y="150" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">Code 0</tspan>
              <tspan x="150" dy="24" fontSize="20">= SUNDAY</tspan>
          </text>
      );

      return null;
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Absolute Day Secret" : "Absolute Day Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      {/* MAIN CONTENT AREA - FLUID FLEX LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-2 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col overflow-hidden min-h-0">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="w-full h-full flex flex-col items-center justify-center pt-4 pb-2 px-2 overflow-y-auto no-scrollbar relative z-10">
                <div className="flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none mb-3 text-white">
                    {appMode === 'practice' ? <><Eye size={16} /> Problem Simulator</> : <><Globe size={16} /> Chrono-Visualizer</>}
                </div>
                
                {/* SVG Visualizer Area */}
                <div className="relative bg-[#3e2723] rounded-full border-[8px] border-yellow-500/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px]">
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                      {/* Connection Ring */}
                      {(calendarState !== 'idle' || appMode === 'practice') && (
                        <circle cx="150" cy="150" r="110" fill="none" stroke="#a88a6d" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
                      )}

                      {/* Jump Arc */}
                      {arcData && arcData.fullCircle ? (
                          <circle cx="150" cy="150" r="110" fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                      ) : arcData ? (
                          <path d={describeArc(150, 150, 110, arcData.start, arcData.end)} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                      ) : null}

                      {/* Dynamic Central Text */}
                      {renderCenterText()}

                      {/* Week Nodes */}
                      {renderWeekCircle()}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Concept Steps (Only show if action is required) */}
                {appMode === 'concept' && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4 min-h-[40px]">
                        <AnimatePresence mode="wait">
                            {isQuizPassed && !isBoardValid && currentStepReqAction && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                                    <button onClick={() => handleCalendarButton(currentStepReqAction)} className="px-5 py-2.5 rounded-full bg-indigo-600 text-white font-black uppercase text-[10px] sm:text-[12px] shadow-[0_0_15px_rgba(79,70,229,0.5)] hover:scale-105 active:scale-95 transition-all">
                                        {LOGIC_DATA.concept.teachingSteps[activeStep].buttonText}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>

        {/* BOTTOM PANEL - GUIDANCE & QUIZ */}
        <div className="flex-[0.8] lg:flex-[1.0] w-full bg-[#3e2723] p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-t-4 border-black shadow-2xl relative z-20 flex flex-col gap-2 overflow-hidden min-h-0">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3 sm:gap-6 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Details */}
            <div className="flex flex-col gap-3 h-full min-h-0">
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-4 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg flex gap-3 items-start text-white shrink-0`}>
                    <div className="bg-yellow-400 p-2 rounded-xl text-black shrink-0 shadow-md">
                        <FileText size={20} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-yellow-400 font-black uppercase text-[10px] sm:text-[11px] tracking-widest leading-none mb-0.5">The Master Objective</span>
                        <p className="text-[12px] sm:text-[14px] font-medium leading-snug tracking-tight text-white/90">
                            {appMode === 'concept' ? LOGIC_DATA.concept.question : LOGIC_DATA.practice.question}
                        </p>
                    </div>
                </div>

                {/* Concept Info (Only in Concept Mode) */}
                {appMode === 'concept' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3">
                        <div className="flex items-center gap-2 opacity-50 mb-2 border-b border-white/10 pb-2">
                            <BookOpen size={14} className="text-[#a88a6d]" />
                            <span className="text-[#a88a6d] font-black uppercase text-[10px] sm:text-[11px] tracking-wider">Concept Rules</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {LOGIC_DATA.concept.clues.map((clue) => {
                                const isActive = clue.step === activeStep;
                                const isPassed = clue.step < activeStep;
                                if (!isActive && !isPassed) return null;
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                    <span className="w-fit px-2 py-1 rounded bg-yellow-400 text-black font-black text-[9px] uppercase tracking-wider">
                                        {clue.concept}
                                    </span>
                                    <p className="text-white text-[12px] leading-snug pl-2 border-l-2 border-white/20 mt-1">{clue.explanation}</p>
                                  </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Detailed Practice Breakdown (Only in Practice Mode) */}
                {appMode === 'practice' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3">
                        {quizFeedbackMode && showExplanation ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
                                <h4 className="text-blue-400 font-black uppercase text-[10px] sm:text-[12px] tracking-widest mb-3 flex items-center gap-1.5 border-b border-blue-500/20 pb-2">
                                    <Info size={16}/> Logic Breakdown
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white mb-3">
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><DivideSquare size={12}/> Math Logic</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-blue-500/30 shadow-inner">
                                        <span className="text-blue-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><Calculator size={12}/> Odd Days Calc</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px] text-blue-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><FastForward size={12}/> Final Jump</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-blue-900/40 border border-blue-500/50 p-3 rounded-xl text-blue-100 text-[10px] sm:text-[12px] font-bold leading-relaxed shadow-inner">
                                    {currentQuizSet[quizStep]?.explanation}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-4">
                                <Calculator size={32} className="mb-2" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">Detailed breakdown will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column: Interaction Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-6 rounded-2xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {/* CONCEPT MODE INTERACTION */}
                        {appMode === 'concept' && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col gap-3 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                               <span className="text-yellow-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[13px] sm:text-[15px] leading-snug">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {/* Options */}
                            <div className="flex flex-wrap gap-2 py-2">
                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                    const isSelected = conceptSelectedOption === i;
                                    const isCorrect = isSelected && isQuizPassed;
                                    const isWrong = isSelected && feedback.type === 'error';
                                    
                                    let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 active:scale-95";
                                    if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg";
                                    else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                    else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                    return (
                                        <button 
                                            key={i} 
                                            disabled={isQuizPassed}
                                            onClick={() => handleSelectionQuiz(i)} 
                                            className={`px-4 py-2.5 rounded-xl font-black text-[11px] sm:text-[12px] transition-all border-2 ${btnClass}`}
                                        >
                                            {opt}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[12px] font-bold italic animate-pulse">"{feedback.reason}"</p>}
                            
                            {/* Post-Answer Instruction & Next Button */}
                            {isQuizPassed && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-auto">
                                    
                                    {/* Only show required action box if there is an instruction */}
                                    {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction && (
                                        <div className="bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/30 flex gap-3 items-start">
                                            <MousePointer2 size={20} className="text-yellow-400 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="text-yellow-400 font-black uppercase text-[9px] tracking-widest mb-1">Required Action</span>
                                                <span className="text-white text-[12px] font-bold leading-tight">
                                                    {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 w-full mt-2">
                                        <button onClick={prevStep} disabled={activeStep === 0} className={`py-3 px-4 rounded-xl font-black transition-all border-2 ${activeStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                            <ChevronLeft size={16} />
                                        </button>

                                        {isBoardValid ? (
                                            <button onClick={nextStep} className="flex-1 py-3 rounded-xl font-black uppercase text-[12px] transition-all bg-green-600 text-white border-b-4 border-green-800 hover:bg-green-500 active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                                {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Lesson' : 'Next Step'}
                                            </button>
                                        ) : (
                                            <div className="flex-1 flex flex-col gap-1">
                                                <button disabled className="w-full h-full py-3 rounded-xl font-black uppercase text-[12px] transition-all bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                    Action Required ⬆️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {actionError && <p className="text-rose-400 text-[11px] font-bold text-center">"{actionError}"</p>}
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* PRACTICE MODE INTERACTION */}
                        {appMode === 'practice' && (
                            <motion.div key={`practice-quiz-${quizStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
                                    <span className="text-orange-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><HelpCircle size={14}/> Question {quizStep + 1}/{currentQuizSet.length}</span>
                                </div>
                                <p className="text-white text-[14px] sm:text-[16px] font-bold leading-snug">{currentQuizSet[quizStep]?.q}</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                                    {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                                        let style = "bg-black/40 border-white/10 text-white hover:bg-black/60";
                                        if (quizFeedbackMode) {
                                            if (idx === currentQuizSet[quizStep].correct) style = "bg-green-600 border-green-400 text-white shadow-lg scale-105 z-10";
                                            else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                            else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                                        }
                                        return (
                                            <button key={idx} disabled={quizFeedbackMode} onClick={() => handlePracticeSelection(idx)} className={`p-3 rounded-xl font-black text-[12px] sm:text-[13px] border-2 transition-all ${style}`}>
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizFeedbackMode && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-auto pt-2">
                                        <div className="flex gap-2 w-full mt-2">
                                            <button onClick={prevPracticeTask} disabled={quizStep === 0} className={`py-3 px-4 rounded-xl font-black transition-all border-2 ${quizStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                                <ChevronLeft size={16} />
                                            </button>
                                            
                                            {/* Wrong Answer View */}
                                            {quizSelection !== currentQuizSet[quizStep].correct ? (
                                                <>
                                                    <button onClick={tryAgainPractice} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black text-[11px] uppercase border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        Try Again
                                                    </button>
                                                    <button onClick={() => setShowExplanation(!showExplanation)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[11px] uppercase border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        {showExplanation ? "Hide Logic" : "View Logic"}
                                                    </button>
                                                </>
                                            ) : (
                                                /* Correct Answer View */
                                                <button onClick={nextPracticeTask} className={`flex-1 py-3 text-white rounded-xl font-black text-[11px] uppercase border-b-4 border-emerald-800 bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)]`}>
                                                    {quizStep === currentQuizSet.length - 1 ? "Finish Lab" : "Next Question"}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>
      </main>

      {/* FULL SCREEN COMPLETION MODAL */}
      <AnimatePresence>
        {showFinishModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
               <motion.div 
                   initial={{ scale: 0.9, y: 20 }} 
                   animate={{ scale: 1, y: 0 }} 
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-[#2a1a16] border-4 border-[#8d6e63] shadow-2xl p-6 sm:p-10 rounded-[3rem] flex flex-col items-center gap-5 w-full max-w-md text-center relative overflow-hidden"
               >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                  
                  <div className="bg-yellow-500/20 p-5 rounded-full relative z-10">
                      <Trophy size={72} className="text-yellow-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-2 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4 mt-2">
                          {appMode === 'concept' 
                              ? "You've successfully learned the absolute day method from 1 AD!" 
                              : "You solved the absolute day challenges flawlessly!"}
                      </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full mt-6 relative z-10">
                     {appMode === 'concept' ? (
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-green-900">Start Practice Questions</button>
                     ) : (
                         <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-green-900">Go To Next Module</button>
                     )}
                     <button onClick={() => { handleReset(appMode); setShowFinishModal(false); }} className="w-full py-3 rounded-xl bg-black/40 hover:bg-black/60 text-[#a88a6d] hover:text-white font-black uppercase text-[12px] tracking-wider transition-all border border-white/10">Restart Module</button>
                  </div>
                  
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-20">
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }