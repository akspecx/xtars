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

const LOGIC_DATA = {
  concept: {
    question: "To solve ANY calendar question, we must build our core century model. How do odd days accumulate over centuries?",
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: The Century Trap (24 vs 25). A leap year happens every 4 years. So, shouldn't 100 years have exactly 25 leap years (100 ÷ 4 = 25)? Actually, no! A true solar year is exactly 365.2425 days long. Adding a leap day every 4 years adds slightly TOO MUCH time! To fix this, century years ending in '00' (like 1700, 1800, 1900) are NOT leap years. Because this 100th year is skipped, how many leap years are actually in a standard century?",
        options: ["24 Leap Years", "25 Leap Years", "26 Leap Years"],
        correct: 0,
        feedback: [
          "Exactly! 25 minus the 1 skipped century year = 24 Leap Years.",
          "That would throw the calendar out of sync with the sun!",
          "Too many!"
        ],
        why: "Core Rule: Century years (like 1900) are treated as ORDINARY years (365 days). This leaves us with 24 Leap Years and 76 Ordinary Years in a century.",
        instruction: "Click 'Understand the Math' below to lock in this rule.",
        requiredActionState: 'leap_math_understood',
        buttonText: "Understand the Math"
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: 100 Years (1 Century). Now let's calculate the odd days! 100 years have 76 ordinary years (+76 odd days) and 24 leap years (+48 odd days). 76 + 48 = 124 total odd days. If you divide 124 by 7 to remove the full weeks, what is the remainder?",
        options: ["3 Odd Days", "5 Odd Days", "7 Odd Days"],
        correct: 1,
        feedback: [
          "Not quite. Do 124 ÷ 7.",
          "Brilliant! 124 ÷ 7 is 17 weeks with exactly 5 days left over.",
          "7 odd days is just a full week (0 shift)."
        ],
        why: "Core Rule: A block of 100 years always shifts the calendar forward by exactly 5 days. Memorize this: 100 Years = 5 Odd Days!",
        instruction: "Click 'Jump 100 Years' below to see the +5 shift from Sunday.",
        requiredActionState: 'century_1',
        buttonText: "Jump 100 Years"
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: 200 Years (2 Centuries). If 100 years gives us 5 odd days, then 200 years gives us 5 + 5 = 10 odd days. But 10 days is longer than a week! Divide 10 by 7. How many odd days remain?",
        options: ["3 Odd Days", "1 Odd Day", "5 Odd Days"],
        correct: 0,
        feedback: [
          "Exactly! 10 ÷ 7 leaves a remainder of 3.",
          "Check your math: 10 - 7.",
          "That's for 100 years!"
        ],
        why: "Core Rule: A block of 200 years shifts the calendar by 3 days. Memorize this: 200 Years = 3 Odd Days!",
        instruction: "Click 'Jump 200 Years' below to see the +3 shift from Sunday.",
        requiredActionState: 'century_2',
        buttonText: "Jump 200 Years"
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: 300 Years (3 Centuries). Following the pattern, 300 years is three centuries. That means 5 + 5 + 5 = 15 odd days. When we divide 15 by 7 to clear out the full weeks, how many odd days remain?",
        options: ["3 Odd Days", "1 Odd Day", "0 Odd Days"],
        correct: 1,
        feedback: [
          "That's for 200 years.",
          "Yes! 15 ÷ 7 is 2 weeks with a remainder of 1.",
          "Not quite 0."
        ],
        why: "Core Rule: A block of 300 years shifts the calendar by just 1 day. Memorize this: 300 Years = 1 Odd Day!",
        instruction: "Click 'Jump 300 Years' below to see the +1 shift from Sunday.",
        requiredActionState: 'century_3',
        buttonText: "Jump 300 Years"
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: 400 Years (The Grand Reset). Four centuries give 5 × 4 = 20 odd days. BUT, here is the final rule: Every 4th century (like 1600 or 2000) IS a leap year! This adds 1 extra day back into the calendar. 20 + 1 = 21 odd days. What is the remainder when you divide 21 by 7?",
        options: ["0 Odd Days", "5 Odd Days", "1 Odd Day"],
        correct: 0,
        feedback: [
          "YES! 21 is perfectly divisible by 7. Remainder = 0.",
          "That's for 100 years.",
          "That's for 300 years."
        ],
        why: "Core Rule: Every 400 years, the calendar generates exactly 0 Odd Days. The entire calendar repeats perfectly. The year 1600 has the exact same calendar as 2000!",
        instruction: "Click 'Jump 400 Years' to witness the perfect loop reset.",
        requiredActionState: 'four_centuries',
        buttonText: "Jump 400 Years"
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "The 100th Year Trap", explanation: "Century years (1700, 1800, 1900) are NOT leap years. There are only 24 leap years in a standard century.", text: "1 Century = 24 Leap Years." },
      { id: 2, step: 1, concept: "100 Years", explanation: "124 odd days ÷ 7 leaves 5 remainder. 100 Years = +5 Odd Days.", text: "100 Years = 5 Odd Days." },
      { id: 3, step: 2, concept: "200 Years", explanation: "5 + 5 = 10 odd days. 10 ÷ 7 leaves 3 remainder. 200 Years = +3 Odd Days.", text: "200 Years = 3 Odd Days." },
      { id: 4, step: 3, concept: "300 Years", explanation: "5 + 5 + 5 = 15 odd days. 15 ÷ 7 leaves 1 remainder. 300 Years = +1 Odd Day.", text: "300 Years = 1 Odd Day." },
      { id: 5, step: 4, concept: "400 Years", explanation: "20 odd days + 1 extra leap day = 21. 21 ÷ 7 = 0 remainder. The calendar perfectly resets.", text: "400 Years = 0 Odd Days." }
    ]
  },
  practice: {
    question: "Apply the Century Codes (5, 3, 1, 0) and the Leap Trap to solve these massive time jumps!",
    quiz: [
      { 
        q: "The year 1900 was a century year. Because of the Leap Year Trap, how many odd days did the entire year of 1900 generate?", 
        startDayIdx: 0, 
        endDayIdx: 1,
        options: ["2 Odd Days (Leap)", "0 Odd Days", "1 Odd Day (Ordinary)"], 
        correct: 2, 
        explanation: "1900 is a century year, so it is NOT a leap year (it is not divisible by 400). It is an ordinary 365-day year, generating exactly 1 Odd Day.",
        breakdown: { logic: "Century years aren't leap years unless divisible by 400.", calculation: "1900 = Ordinary Year", jump: "1 Year = 1 Odd Day" }
      },
      { 
        q: "If 1st January 1800 was a Wednesday, what day was 1st January 1900?", 
        startDayIdx: 3, 
        endDayIdx: 1,
        options: ["Monday", "Sunday", "Tuesday"], 
        correct: 0, 
        explanation: "A 100-year jump generates exactly 5 Odd Days. Wednesday + 5 days = Monday.",
        breakdown: { logic: "100 Years = 5 Odd Days", calculation: "Wednesday + 5", jump: "Monday" }
      },
      { 
        q: "If 1st May 1700 was a Friday, what day was 1st May 1900?", 
        startDayIdx: 5, 
        endDayIdx: 1,
        options: ["Sunday", "Monday", "Tuesday"], 
        correct: 1, 
        explanation: "The gap is exactly 200 years. A 200-year jump generates 3 Odd Days. Friday + 3 days = Monday.",
        breakdown: { logic: "200 Years = 3 Odd Days", calculation: "Friday + 3", jump: "Monday" }
      },
      { 
        q: "If 25th Dec 1600 was a Saturday, what day was 25th Dec 2000?", 
        startDayIdx: 6, 
        endDayIdx: 6,
        options: ["Friday", "Saturday", "Sunday"], 
        correct: 1, 
        explanation: "The gap is exactly 400 years. 400 years is the Grand Reset with 0 Odd Days. The day remains exactly the same!",
        breakdown: { logic: "400 Years = 0 Odd Days (Reset)", calculation: "Saturday + 0", jump: "Saturday" }
      },
      { 
        q: "Time Travel Backwards! If 1st January 1900 was a Monday, what day was 1st January 1800?", 
        startDayIdx: 1, 
        endDayIdx: 3,
        options: ["Tuesday", "Wednesday", "Thursday"], 
        correct: 1, 
        explanation: "The gap is 100 years backward. 100 years = 5 Odd Days. Going backward means we SUBTRACT 5. Monday - 5 = Wednesday.",
        breakdown: { logic: "100 Years Backward = -5 Odd Days", calculation: "Monday - 5", jump: "Wednesday" }
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
          setCalendarState('idle'); // Always reset visualization when moving
      }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setCalendarState('idle'); // Always reset visualization when moving
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
            // State-dependent start and end indices
            if (activeStep === 0) { isStart = false; isEnd = false; } // Math only step
            else if (activeStep === 1) { isStart = (i === 0); isEnd = (calendarState === 'century_1' && i === 5); } // SUN + 5 = FRI
            else if (activeStep === 2) { isStart = (i === 0); isEnd = (calendarState === 'century_2' && i === 3); } // SUN + 3 = WED
            else if (activeStep === 3) { isStart = (i === 0); isEnd = (calendarState === 'century_3' && i === 1); } // SUN + 1 = MON
            else if (activeStep === 4) { isStart = (i === 0); isEnd = (calendarState === 'four_centuries' && i === 0); } // SUN + 0 = SUN
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
          if (calendarState === 'century_1') return { start: 0 * (360/7), end: 5 * (360/7), fullCircle: false }; 
          if (calendarState === 'century_2') return { start: 0 * (360/7), end: 3 * (360/7), fullCircle: false }; 
          if (calendarState === 'century_3') return { start: 0 * (360/7), end: 1 * (360/7), fullCircle: false }; 
          if (calendarState === 'four_centuries') return { start: 0 * (360/7), end: 0 * (360/7), fullCircle: true }; // 0 shift
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
                <tspan x="150" dy="-10">Earth's Orbit:</tspan>
                <tspan x="150" dy="20">365.2425 Days</tspan>
            </text>
          );
          if (activeStep >= 1) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Start: SUNDAY</text>;
      }

      if (calendarState === 'leap_math_understood') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">25 - 1 Skipped</tspan>
              <tspan x="150" dy="24" fontSize="20">= 24 Leap Years</tspan>
          </text>
      );

      if (calendarState === 'century_1') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SUN + 5</tspan>
              <tspan x="150" dy="24" fontSize="20">= FRIDAY</tspan>
          </text>
      );
      
      if (calendarState === 'century_2') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SUN + 3</tspan>
              <tspan x="150" dy="24" fontSize="20">= WEDNESDAY</tspan>
          </text>
      );

      if (calendarState === 'century_3') return (
          <text x="150" y="150" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SUN + 1</tspan>
              <tspan x="150" dy="24" fontSize="20">= MONDAY</tspan>
          </text>
      );

      if (calendarState === 'four_centuries') return (
          <text x="150" y="150" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">SUN + 0</tspan>
              <tspan x="150" dy="24" fontSize="20">= SUNDAY</tspan>
          </text>
      );

      return null;
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Time Travel Secrets" : "Odd Days Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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
                              ? "You've successfully learned the secret logic to time travel across dates!" 
                              : "You solved the Time Travel challenges flawlessly!"}
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