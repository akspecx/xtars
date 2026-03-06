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

const fullConceptString = "Calendar Algebra: Discover the shortcut to calculate days in \"x weeks and x days\"!";

const LOGIC_DATA = {
  concept: {
    question: "How many total days are there in exactly x weeks and x days?",
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Convert Weeks to Days. Let's break the problem down using algebra. First, look at the 'x weeks' part. Since we know every single week has exactly 7 days, how do we write 'x weeks' as total days?",
        options: ["x + 7", "7x", "x / 7"],
        correct: 1,
        feedback: [
          "That would just be adding 7 to x.",
          "Exactly! 1 week is 7 days, so x weeks is 7 times x (or 7x) days.",
          "That would be dividing x by 7."
        ],
        why: "Core Rule: To convert weeks into days, you simply multiply the number of weeks by 7. So, 'x weeks' becomes '7x' days.",
        instruction: "Click 'Convert to Days' below to swap weeks for days.",
        requiredActionState: 'x_weeks',
        buttonText: "Convert to Days"
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Add the Extra Days. Now we know 'x weeks' equals '7x days'. But the problem asks for 'x weeks AND x days'. What mathematical operation do we use to combine the 7x days with the extra x days?",
        options: ["7x * x", "7x - x", "7x + x"],
        correct: 2,
        feedback: [
          "We are combining them, not multiplying.",
          "We aren't taking days away!",
          "Spot on! 'And' means we add them together: 7x + x."
        ],
        why: "Core Rule: When calculating a total, we add the pieces together. The total days equation is now: 7x (from the weeks) + x (the extra days).",
        instruction: "Click 'Add Extra Days' below.",
        requiredActionState: 'add_x',
        buttonText: "Add Extra Days"
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Combine Like Terms. We have built our algebra equation: 7x + x. If you have 7 'x's and you add 1 more 'x', what is the simplified total?",
        options: ["8x", "14x", "7x²"],
        correct: 0,
        feedback: [
          "YES! 7x + 1x = 8x.",
          "Check your addition.",
          "We are adding, not multiplying x by x!"
        ],
        why: "Math Verified: The expression simplifies perfectly to 8x. This means the total number of days will ALWAYS be 8 times whatever 'x' is!",
        instruction: "Click 'Simplify Equation' to see the final formula.",
        requiredActionState: 'combine',
        buttonText: "Simplify Equation"
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Real World Test. Let's test our new '8x' formula! Imagine x = 5. The problem becomes: 'How many days are in 5 weeks and 5 days?' Using our 8x formula, what is the answer?",
        options: ["35 Days", "45 Days", "40 Days"],
        correct: 2,
        feedback: [
          "That's just 5 weeks (7 * 5). You forgot the extra 5 days!",
          "Check your math: 8 * 5.",
          "Exactly! 8 * 5 = 40 days. (Or manually: 35 days + 5 days = 40)."
        ],
        why: "The shortcut works flawlessly. Instead of calculating weeks and adding days separately, you just multiply the number by 8.",
        instruction: "Click 'Test x=5' to lock in the example.",
        requiredActionState: 'apply_5',
        buttonText: "Test x=5"
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: The Ultimate Shortcut. You've just created a powerful math cheat code! If anyone ever asks you how many days are in 'y weeks and y days', what is the fastest way to find the answer?",
        options: ["Multiply y by 7", "Multiply y by 8", "Multiply y by 14"],
        correct: 1,
        feedback: [
          "That only gives you the days in the weeks.",
          "YES! The total days will always be 8 times the number.",
          "Too high!"
        ],
        why: "Application: Whenever the number of weeks and the number of extra days are the EXACT SAME number, just multiply that number by 8!",
        instruction: "Click 'Reveal Shortcut' to complete the logic puzzle!",
        requiredActionState: 'shortcut',
        buttonText: "Reveal Shortcut"
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Conversion", explanation: "1 week = 7 days. Therefore, x weeks = 7x days.", text: "x weeks = 7x" },
      { id: 2, step: 1, concept: "Addition", explanation: "Combine the days from the weeks with the extra isolated days.", text: "Total = 7x + x" },
      { id: 3, step: 2, concept: "Simplification", explanation: "By combining like terms, 7x + 1x becomes 8x.", text: "Formula = 8x" },
      { id: 4, step: 3, concept: "The 8x Shortcut", explanation: "Whenever the weeks and days share the same variable, the total days is just the variable multiplied by 8.", text: "Shortcut: Multiply by 8" }
    ]
  },
  practice: {
    question: "Use the '8x Formula' to solve these calendar math puzzles instantly!",
    quiz: [
      { 
        q: "How many total days are there in exactly 3 weeks and 3 days?", 
        startDayIdx: 0, 
        endDayIdx: 3,
        options: ["21 Days", "24 Days", "27 Days"], 
        correct: 1, 
        explanation: "Since the weeks and days are the same number (3), apply the 8x formula. 8 * 3 = 24 days.",
        breakdown: { logic: "x = 3", calculation: "Formula: 8x", jump: "8 * 3 = 24 Days" }
      },
      { 
        q: "A long expedition lasted exactly 10 weeks and 10 days. How many total days did it last?", 
        startDayIdx: 0, 
        endDayIdx: 3,
        options: ["80 Days", "70 Days", "100 Days"], 
        correct: 0, 
        explanation: "Here, x = 10. Using our combined formula (7x + x = 8x), we simply multiply 10 by 8. 8 * 10 = 80 days.",
        breakdown: { logic: "x = 10", calculation: "Formula: 8x", jump: "8 * 10 = 80 Days" }
      },
      { 
        q: "How many total days are there in 12 weeks and 12 days?", 
        startDayIdx: 0, 
        endDayIdx: 0,
        options: ["84 Days", "144 Days", "96 Days"], 
        correct: 2, 
        explanation: "Here, x = 12. Apply the 8x formula: 8 * 12 = 96 days. (Manually: 12*7=84, 84+12=96).",
        breakdown: { logic: "x = 12", calculation: "Formula: 8x", jump: "8 * 12 = 96 Days" }
      },
      { 
        q: "A summer break is 7 weeks and 7 days long. How many total days is the break?", 
        startDayIdx: 0, 
        endDayIdx: 0,
        options: ["56 Days", "49 Days", "64 Days"], 
        correct: 0, 
        explanation: "Here, x = 7. Multiply by 8. 8 * 7 = 56 days.",
        breakdown: { logic: "x = 7", calculation: "Formula: 8x", jump: "8 * 7 = 56 Days" }
      },
      { 
        q: "If a project takes 'z' weeks and 'z' days to complete, which algebraic formula represents the total days?", 
        startDayIdx: 0, 
        endDayIdx: 0,
        options: ["7z Days", "z² Days", "8z Days"], 
        correct: 2, 
        explanation: "z weeks = 7z days. Add the extra z days: 7z + z = 8z. The formula works for any variable!",
        breakdown: { logic: "Convert: z weeks = 7z", calculation: "Add: 7z + z", jump: "Result = 8z" }
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
          if (prevIdx === 1) setCalendarState('x_weeks');
          if (prevIdx === 2) setCalendarState('add_x');
          if (prevIdx === 3) setCalendarState('combine');
          if (prevIdx === 4) setCalendarState('apply_5');
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
        // We will keep the circle generic as a 'Week Loop'
        let isStart = false;
        let isEnd = false;

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
      // Highlight 1 day forward to represent the "8x" where 1 week loop completes and 1 extra day is jumped.
      if (appMode === 'concept') {
          if (['combine', 'apply_5', 'shortcut'].includes(calendarState)) return { start: 0 * (360/7), end: 1 * (360/7), fullCircle: false }; 
      }
      return null;
  }

  const arcData = getArcAngles();

  // Determine what text to show in the center of the calendar based on the current step progress
  const renderCenterText = () => {
      if (appMode === 'practice' && quizFeedbackMode && quizSelection === currentQuizSet[quizStep].correct) {
          return <text x="150" y="150" fill="#22c55e" fontSize="18" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Formula Applied!</text>;
      }
      
      if (appMode !== 'concept') return null;

      if (calendarState === 'idle') {
          if (activeStep === 0) return (
            <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
                <tspan x="150" dy="-10">x weeks</tspan>
                <tspan x="150" dy="20">+ x days</tspan>
            </text>
          );
          if (activeStep === 1) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">7x days + x</text>;
          if (activeStep === 2) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">7x + x</text>;
          if (activeStep === 3) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">Test x=5</text>;
          if (activeStep === 4) return <text x="150" y="150" fill="#eab308" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">x weeks, x days</text>;
      }

      if (calendarState === 'x_weeks') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">x weeks =</tspan>
              <tspan x="150" dy="24" fontSize="20">7x days</tspan>
          </text>
      );

      if (calendarState === 'add_x') return (
          <text x="150" y="150" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">7x days</tspan>
              <tspan x="150" dy="24" fontSize="20">+ x days</tspan>
          </text>
      );
      
      if (calendarState === 'combine') return (
          <text x="150" y="150" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">7x + 1x =</tspan>
              <tspan x="150" dy="24" fontSize="24">8x Days</tspan>
          </text>
      );

      if (calendarState === 'apply_5') return (
          <text x="150" y="150" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">8 * 5 =</tspan>
              <tspan x="150" dy="24" fontSize="20">40 Days</tspan>
          </text>
      );

      if (calendarState === 'shortcut') return (
          <text x="150" y="150" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">
              <tspan x="150" dy="-10">Shortcut:</tspan>
              <tspan x="150" dy="24" fontSize="20">Multiply by 8</tspan>
          </text>
      );

      return null;
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "The 'x Weeks x Days' Trick" : "Algebra Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      {/* MAIN CONTENT AREA - FLUID FLEX LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-2 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col overflow-hidden min-h-0">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="w-full h-full flex flex-col items-center justify-center pt-4 pb-2 px-2 overflow-y-auto no-scrollbar relative z-10">
                <div className="flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none mb-3 text-white">
                    {appMode === 'practice' ? <><Eye size={16} /> Problem Simulator</> : <><Calculator size={16} /> Formula Visualizer</>}
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
                                        <span className="text-blue-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><Calculator size={12}/> Using Formula</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px] text-blue-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><FastForward size={12}/> Total Days</span>
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
                              ? "You've successfully learned the algebraic shortcut for weeks and days!" 
                              : "You solved the algebraic calendar challenges flawlessly!"}
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