import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  HelpCircle,
  Calculator,
  CheckCircle2,
  Target,
  Sigma,
  XCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Plus,
  Minus,
  RefreshCw,
  BookOpen,
  Navigation
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// HEADER COMPONENT
// ==========================================
function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-2 sm:p-3 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-auto bg-[#2a1a16] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-b-[3px] sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2 transition-all relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
        
        <div className="flex flex-col items-start leading-tight relative z-10">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[14px] mb-0.5">
            <ChevronLeft size={16} strokeWidth={3} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[16px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 relative z-10">
          <div className="flex bg-black/50 p-1 rounded-lg sm:rounded-xl border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-emerald-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-md sm:rounded-lg text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-1.5 sm:p-2 bg-rose-600 hover:bg-rose-500 rounded-lg sm:rounded-xl border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-md">
            <RotateCcw size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// DATA & CONFIG
// ==========================================
const CONCEPT_TABS = [
  { id: 'increase', label: "Increased By %", icon: TrendingUp },
  { id: 'decrease', label: "Decreased By %", icon: TrendingDown },
  { id: 'successive', label: "Simultaneous", icon: Layers }
];

const getDynamicObjective = (tabIdx) => {
    if (tabIdx === 0) return "Create formula to find when value of anything is increased by some percentage";
    if (tabIdx === 1) return "Create formula to find when value of anything is decreased by some percentage";
    if (tabIdx === 2) return "Create formula to find when value has increased and decreased simultaneously";
    return "Learn algebraic formulas for percentage changes.";
};

const LOGIC_DATA = {
  concept: {
    objective: "Learn algebraic formulas for percentage changes.",
    teachingSteps: [
      { 
        id: "step-0",
        tabIdx: 0,
        title: "The Percentage Fraction",
        explanation: "First, consider a real example: An item costs ₹100. It increases by 10%.\n\nWhat does '10%' actually mean as a mathematical fraction?",
        selectionPrompt: "How do we write 10% as a fraction?",
        options: ["100 / 10", "1 / 100", "10 / 100"],
        correct: 2,
        feedback: ["That is 1000%.", "That is 1%.", "Exactly! Percent literally means 'out of 100'."]
      },
      { 
        id: "step-1",
        tabIdx: 0,
        title: "The Concrete Increase",
        explanation: "10% is written as 10/100. To compute the exact increase amount, we multiply the original price by this fraction.",
        selectionPrompt: "Calculate the exact increase amount: 100 * (10 / 100).",
        options: ["10", "90", "110"],
        correct: 0,
        feedback: ["Perfect! The 100s cancel out, leaving exactly 10.", "That is the result of subtraction.", "That is the new total, not the increase."]
      },
      { 
        id: "step-2",
        tabIdx: 0,
        title: "The Concrete Total",
        explanation: "The increase amount is ₹10. To find the NEW total price, we combine this isolated increase with our original starting value.",
        selectionPrompt: "Find the NEW total: Original (100) + Increase (10).",
        options: ["110", "100", "90"],
        correct: 0,
        feedback: ["Spot on! 100 + 10 = 110.", "You forgot the increase.", "We add, not subtract."]
      },
      { 
        id: "step-3",
        tabIdx: 0,
        title: "Variables: Increase Amount",
        explanation: "No more numbers! Let Original = X. Let Increase = R%. Just like we calculated 10% of 100, we must find R% of X.",
        selectionPrompt: "How do we write the isolated INCREASE amount?",
        options: ["X + R", "X * (R / 100)", "X / R"],
        correct: 1,
        feedback: ["You can't add a percentage directly.", "Correct! Multiply X by the percentage fraction.", "We multiply, not divide."]
      },
      { 
        id: "step-4",
        tabIdx: 0,
        title: "Variables: The New Total",
        explanation: "The exact increase is X * (R/100). The new total is the Original (X) plus the Increase (X * R/100).",
        selectionPrompt: "How do we write the NEW total (Original + Increase)?",
        options: ["X * X * (R/100)", "X - X * (R/100)", "X + X * (R/100)"],
        correct: 2,
        feedback: ["We are adding, not multiplying.", "Minus means a decrease.", "Exactly! Original (X) plus Increase (X * R/100)."]
      },
      { 
        id: "step-5",
        tabIdx: 0,
        title: "Variables: Factoring",
        explanation: "Equation: X + X * (R/100). Instead of writing two terms, we can simplify this by factoring out 'X'.",
        selectionPrompt: "Simplify by factoring out 'X':",
        options: ["X * (1 - R/100)", "X * (1 + R/100)", "X * (R/100)"],
        correct: 1,
        feedback: ["Minus means decrease.", "Perfect! You've built the Golden Increase Formula.", "That's just the increase."]
      },
      { 
        id: "step-6",
        tabIdx: 1,
        title: "The Decrease Formula",
        explanation: "Instead of adding the percentage amount, we subtract it: X - X * (R/100).",
        selectionPrompt: "Factor out 'X' to find the Decrease Formula:",
        options: ["X * (1 - R/100)", "X * (1 + R/100)", "X / (1 - R/100)"],
        correct: 0,
        feedback: ["Spot on! The minus sign inside the bracket represents shrinking value.", "That's an increase.", "We multiply by the factor."]
      },
      { 
        id: "step-7",
        tabIdx: 2,
        title: "Successive Changes",
        explanation: "What if a value X increases by A%, and then the NEW value decreases by B%? We simply chain our multiplier brackets.",
        selectionPrompt: "Chain the multipliers together:",
        options: ["X * (1 + A/100) + (1 - B/100)", "X * (1 + A/100) * (1 - B/100)", "X * (1 + A/100) - B"],
        correct: 1,
        feedback: ["Multiply the factors, don't add.", "Perfect! Chain them by multiplying to get the final answer instantly.", "B needs to be a factor."]
      },
      { 
        id: "step-8",
        tabIdx: 2,
        title: "Concept Summary",
        explanation: "You have successfully built the core algebraic formulas for percentage changes! These formulas will save you from doing multi-step calculations manually.",
        selectionPrompt: "Review the formulas. Are you ready for the practice challenges?",
        options: ["Yes, start practice!"],
        correct: 0,
        feedback: ["Awesome! Let's test your skills in the simulator."]
      }
    ]
  },
  practice: {
    quiz: [
      { 
        q: "A jacket costs ₹200. The price increases by 15%. Which formula calculates the new price?", 
        options: ["200 * (1 - 15/100)", "200 * (1 + 15/100)", "200 * (15 / 100)"], 
        correct: 1, 
        explanation: "Use the Increase formula: X * (1 + R/100).",
        explanationTable: [
            { step: "Values", math: "X=200, R=15", result: "-" },
            { step: "Formula", math: "200 * (1 + 15/100)", result: "230" }
        ],
        breakdown: { jump: "₹230" }
      },
      { 
        q: "A car depreciates (decreases) by 20% from ₹10,000. Which formula is correct?", 
        options: ["10000 * (1 - 20/100)", "10000 * (1 + 20/100)", "10000 / (20/100)"], 
        correct: 0, 
        explanation: "Depreciation is a decrease. Use: X * (1 - R/100).",
        explanationTable: [
            { step: "Values", math: "X=10000, R=20", result: "-" },
            { step: "Formula", math: "10000 * (1 - 20/100)", result: "8000" }
        ],
        breakdown: { jump: "₹8,000" }
      },
      { 
        q: "Population 'P' grows by 10%, then shrinks by 5%. Which formula works?", 
        options: ["P * (1 + 10/100) * (1 - 5/100)", "P * (1 - 10/100) * (1 + 5/100)", "P * (10/100) * (5/100)"], 
        correct: 0, 
        explanation: "Chain the multipliers! First growth (1 + 10/100), then shrink (1 - 5/100).",
        explanationTable: [
            { step: "Growth", math: "P * (1 + 10/100)", result: "-" },
            { step: "Shrink", math: "Result * (1 - 5/100)", result: "-" },
            { step: "Chain", math: "P * (1 + 10/100) * (1 - 5/100)", result: "Formula" }
        ],
        breakdown: { jump: "Correct Formula" }
      },
      { 
        q: "A tech startup has $1,000,000 in funding and it grows by 25%. Which formula gives the new funding amount?", 
        options: ["1000000 * (1 - 25/100)", "1000000 * (25 / 100)", "1000000 * (1 + 25/100)"], 
        correct: 2, 
        explanation: "Growth means an increase. Use the Increase formula: X * (1 + R/100).",
        explanationTable: [
            { step: "Values", math: "X=1000000, R=25", result: "-" },
            { step: "Formula", math: "1000000 * (1 + 25/100)", result: "$1,250,000" }
        ],
        breakdown: { jump: "$1,250,000" }
      },
      { 
        q: "A smartphone's battery life is initially 'B' hours. After an update, it decreases by 8%. Which formula calculates the new battery life?", 
        options: ["B * (1 - 8/100)", "B * (1 + 8/100)", "B - 8"], 
        correct: 0, 
        explanation: "A decrease requires subtracting the percentage from the whole. Use: X * (1 - R/100).",
        explanationTable: [
            { step: "Values", math: "X=B, R=8", result: "-" },
            { step: "Formula", math: "B * (1 - 8/100)", result: "Formula" }
        ],
        breakdown: { jump: "Correct Formula" }
      },
      { 
        q: "The price of a laptop 'L' decreases by 10% on Black Friday, then increases by 5% due to high demand. Which formula calculates the final price?", 
        options: ["L * (1 + 10/100) * (1 - 5/100)", "L * (1 - 10/100) * (1 + 5/100)", "L * (1 - 10/100) - 5"], 
        correct: 1, 
        explanation: "Chain the multipliers sequentially: First a decrease (1 - 10/100), followed by an increase (1 + 5/100).",
        explanationTable: [
            { step: "Decrease", math: "L * (1 - 10/100)", result: "-" },
            { step: "Increase", math: "Result * (1 + 5/100)", result: "-" },
            { step: "Chain", math: "L * (1 - 10/100) * (1 + 5/100)", result: "Formula" }
        ],
        breakdown: { jump: "Correct Formula" }
      },
      { 
        q: "A stock portfolio worth ₹50,000 increases by 12% in January, then decreases by 12% in February. Which formula works?", 
        options: ["50000 * (1 + 12/100) * (1 - 12/100)", "50000 * 1", "50000 * (12/100) * (12/100)"], 
        correct: 0, 
        explanation: "Chain the multipliers: an increase of 12% and a decrease of 12%. It does NOT return to the original value!",
        explanationTable: [
            { step: "Jan Increase", math: "50000 * (1 + 12/100)", result: "-" },
            { step: "Feb Decrease", math: "Result * (1 - 12/100)", result: "-" },
            { step: "Chain", math: "50000 * (1 + 12/100) * (1 - 12/100)", result: "Formula" }
        ],
        breakdown: { jump: "Correct Formula" }
      }
    ]
  }
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [showConceptSummary, setShowConceptSummary] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [hasStartedConcept, setHasStartedConcept] = useState(false);

  const currentConfig = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep] : LOGIC_DATA.practice.quiz[quizStep];
  const currentQuizSet = LOGIC_DATA.practice.quiz;

  function handleReset(mode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setShowFinishModal(false);
    setShowConceptSummary(false);
    setHasStartedConcept(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  function handleSelectionQuiz(idx) {
    setConceptSelectedOption(idx);
    const fbReason = currentConfig?.feedback ? currentConfig.feedback[idx] : "Correct!";
    if (idx === currentConfig?.correct) {
      setFeedback({ type: 'success', msg: "Correct!", reason: fbReason });
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: fbReason });
    }
  }

  function handlePracticeSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
    setShowExplanation(idx === currentConfig?.correct);
  }

  function tryAgainPractice() {
    setQuizFeedbackMode(false);
    setShowExplanation(false);
  }

  function prevStep() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setShowConceptSummary(true);
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
      setShowFinishModal(true);
    }
  }

  const handleTabClick = (idx) => {
    if (appMode === 'concept') {
      const targetStepIndex = LOGIC_DATA.concept.teachingSteps.findIndex(s => s.tabIdx === idx);
      if (targetStepIndex !== -1) {
        setActiveStep(targetStepIndex);
        setConceptSelectedOption(null);
        setFeedback({ type: null, msg: "", reason: "" });
      }
    } else {
      setQuizStep(idx);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
    }
  };

  const isQuizPassed = feedback.type === 'success' || (appMode === 'practice' && quizFeedbackMode && quizSelection === currentConfig?.correct);
  const currentTabIdx = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep].tabIdx : 0;

  // --- DIGITAL MATH BOARD (Div 1 Render for Concept) ---
  const MathBoard = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full relative p-2 text-center">
          <AnimatePresence mode="wait">
              {activeStep === 0 && (
                  <motion.div key="s0" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-inner w-full max-w-sm mx-auto">
                      <span className="text-emerald-400 text-[14px] uppercase tracking-widest font-bold mb-1">Percentage Fraction</span>
                      <div className="flex items-center gap-3 sm:gap-6 text-3xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">10%</span>
                          <span className="text-white/50">=</span>
                          {isQuizPassed ? (
                              <div className="flex flex-col items-center">
                                  <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-3 pb-1">10</span>
                                  <span className="text-sky-400 px-3 pt-1">100</span>
                              </div>
                          ) : (
                              <span className="text-white/20 animate-pulse">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
              {activeStep === 1 && (
                  <motion.div key="s1" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-inner w-full max-w-sm mx-auto">
                      <span className="text-emerald-400 text-[14px] uppercase tracking-widest font-bold mb-1">Calculation</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white">
                          <span className="text-white">100</span>
                          <span className="text-white/50">*</span>
                          <div className="flex flex-col items-center">
                              <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-2 pb-1">10</span>
                              <span className="text-sky-400 px-2 pt-1">100</span>
                          </div>
                          <span className="text-white/50">=</span>
                          {isQuizPassed ? (
                              <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">10</span>
                          ) : (
                              <span className="text-white/20 animate-pulse">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
              {activeStep === 2 && (
                  <motion.div key="s2" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-inner w-full max-w-sm mx-auto">
                      <span className="text-emerald-400 text-[14px] uppercase tracking-widest font-bold mb-1">New Total</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-3xl sm:text-6xl font-black text-white">
                          <span className="text-white">100</span>
                          <span className="text-emerald-400">+</span>
                          <span className="text-yellow-400">10</span>
                          <span className="text-white/50">=</span>
                          {isQuizPassed ? (
                              <span className="text-emerald-400 drop-shadow-md">110</span>
                          ) : (
                              <span className="text-white/20 animate-pulse">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
              {activeStep === 3 && (
                  <motion.div key="s3" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-inner w-full max-w-sm mx-auto">
                      <span className="text-emerald-400 text-[14px] uppercase tracking-widest font-bold mb-1">Increase Amount</span>
                      <div className="flex items-center gap-2 sm:gap-4 text-2xl sm:text-5xl font-black text-white">
                          {isQuizPassed ? (
                              <>
                                  <span className="text-emerald-400">X</span>
                                  <span className="text-white/50">*</span>
                                  <span className="text-white">(</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-2 pb-1">R</span>
                                      <span className="text-sky-400 px-2 pt-1 text-xl sm:text-3xl">100</span>
                                  </div>
                                  <span className="text-white">)</span>
                              </>
                          ) : (
                              <span className="text-white/20 animate-pulse text-4xl">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
              {activeStep === 4 && (
                  <motion.div key="s4" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-black/40 p-4 sm:p-6 rounded-3xl border border-white/10 shadow-inner w-full max-w-lg mx-auto">
                      <span className="text-emerald-400 text-[14px] uppercase tracking-widest font-bold mb-1">New Total</span>
                      <div className="flex items-center gap-2 sm:gap-4 text-xl sm:text-4xl font-black text-white">
                          <span className="text-emerald-400">X</span>
                          <span className="text-emerald-400">+</span>
                          {isQuizPassed ? (
                              <>
                                  <span className="text-emerald-400">X</span>
                                  <span className="text-white/50">*</span>
                                  <span className="text-white">(</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-1 pb-1">R</span>
                                      <span className="text-sky-400 px-1 pt-1 text-lg sm:text-2xl">100</span>
                                  </div>
                                  <span className="text-white">)</span>
                              </>
                          ) : (
                              <span className="text-white/20 animate-pulse text-4xl">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
              {activeStep === 5 && (
                  <motion.div key="s5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-emerald-900/40 p-4 sm:p-6 rounded-3xl border-2 border-emerald-500/50 shadow-lg w-full max-w-lg mx-auto">
                      <span className="text-emerald-400 text-[14px] font-bold uppercase tracking-widest mb-1">Factored (Increase)</span>
                      <div className="flex items-center justify-center gap-2 sm:gap-4 text-3xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">X</span>
                          <span className="text-white/50">*</span>
                          <span className="text-white">(</span>
                          {isQuizPassed ? (
                              <>
                                  <span className="text-white">1</span>
                                  <span className="text-emerald-400">+</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-2 pb-1">R</span>
                                      <span className="text-sky-400 px-2 pt-1 text-xl sm:text-3xl">100</span>
                                  </div>
                              </>
                          ) : (
                              <span className="text-white/20 animate-pulse px-4">?</span>
                          )}
                          <span className="text-white">)</span>
                      </div>
                  </motion.div>
              )}
              {activeStep === 6 && (
                  <motion.div key="s6" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 bg-rose-900/40 p-4 sm:p-6 rounded-3xl border-2 border-rose-500/50 shadow-lg w-full max-w-lg mx-auto">
                      <span className="text-rose-400 text-[14px] font-bold uppercase tracking-widest mb-1">Factored (Decrease)</span>
                      <div className="flex items-center justify-center gap-2 sm:gap-4 text-3xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">X</span>
                          <span className="text-white/50">*</span>
                          <span className="text-white">(</span>
                          {isQuizPassed ? (
                              <>
                                  <span className="text-white">1</span>
                                  <span className="text-rose-400">-</span>
                                  <div className="flex flex-col items-center">
                                      <span className="text-yellow-400 border-b-2 sm:border-b-4 border-white/30 px-2 pb-1">R</span>
                                      <span className="text-sky-400 px-2 pt-1 text-xl sm:text-3xl">100</span>
                                  </div>
                              </>
                          ) : (
                              <span className="text-white/20 animate-pulse px-4">?</span>
                          )}
                          <span className="text-white">)</span>
                      </div>
                  </motion.div>
              )}
              {activeStep === 7 && (
                  <motion.div key="s7" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-2 w-full bg-blue-900/40 p-4 sm:p-6 rounded-3xl border-2 border-blue-500/50 shadow-lg max-w-2xl mx-auto">
                      <span className="text-blue-400 text-[14px] font-bold uppercase tracking-widest mb-1">Chained Formula</span>
                      <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 text-xl sm:text-4xl font-black text-white">
                          {isQuizPassed ? (
                              <>
                                  <span className="text-emerald-400">X</span>
                                  <span className="text-white/50">*</span>
                                  <div className="flex items-center border-x-2 border-white/30 px-1 sm:px-2 rounded-lg">
                                      <span className="text-white mr-1 sm:mr-2">1</span><span className="text-emerald-400 mr-1 sm:mr-2">+</span>
                                      <div className="flex flex-col items-center"><span className="text-yellow-400 border-b-2 border-white/30 px-1 pb-0.5 text-xs sm:text-lg">A</span><span className="text-sky-400 px-1 pt-0.5 text-[10px] sm:text-sm">100</span></div>
                                  </div>
                                  <span className="text-white/50">*</span>
                                  <div className="flex items-center border-x-2 border-white/30 px-1 sm:px-2 rounded-lg">
                                      <span className="text-white mr-1 sm:mr-2">1</span><span className="text-rose-400 mr-1 sm:mr-2">-</span>
                                      <div className="flex flex-col items-center"><span className="text-yellow-400 border-b-2 border-white/30 px-1 pb-0.5 text-xs sm:text-lg">B</span><span className="text-sky-400 px-1 pt-0.5 text-[10px] sm:text-sm">100</span></div>
                                  </div>
                              </>
                          ) : (
                              <span className="text-white/20 animate-pulse px-4 text-3xl sm:text-4xl">?</span>
                          )}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title="Percentage Formulas" appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      {/* INITIAL OBJECTIVE MODAL */}
      <AnimatePresence>
        {appMode === 'concept' && !hasStartedConcept && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#2a1a16] border-[6px] border-[#1a0f0d] shadow-2xl p-6 sm:p-10 rounded-[3rem] w-full max-w-lg text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
               
               <Target size={64} className="text-amber-500 mx-auto mb-6 drop-shadow-lg relative z-10" />
               <h2 className="text-white text-[16px] font-black uppercase tracking-widest drop-shadow-lg mb-6 relative z-10">Module Objective</h2>
               
               <div className="text-amber-100 text-[14px] font-medium px-2 mb-8 leading-relaxed relative z-10 text-left w-full bg-[#1a0f0d]/50 p-4 sm:p-6 rounded-2xl shadow-inner border border-white/5">
                   <p className="mb-4 text-center font-bold text-amber-500 text-[16px]">We are going to learn the following:</p>
                   <ul className="space-y-4 text-[14px]">
                     <li className="flex gap-3 items-start"><CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={20}/><span>Create formula to find when value of anything is <strong>increased by some percentage</strong></span></li>
                     <li className="flex gap-3 items-start"><CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={20}/><span>Value of anything is <strong>decreased by some percentage</strong></span></li>
                     <li className="flex gap-3 items-start"><CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={20}/><span>When value has <strong>increased and decreased simultaneously</strong></span></li>
                   </ul>
               </div>

               <button onClick={() => setHasStartedConcept(true)} className="w-full py-4 sm:py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 relative z-10">
                  Start Learning
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STACKED 2-DIV LAYOUT - STRICTLY FLEX-COL, EQUAL FLEX-1 */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 relative z-10 overflow-hidden min-h-0">
        
        {/* DIV 1: TOP PANEL */}
        <div className={`w-full bg-[#2a1a16] rounded-2xl sm:rounded-3xl border-2 sm:border-[4px] border-[#1a0f0d] shadow-xl relative flex flex-col overflow-hidden transition-all duration-500 flex-[0.8] min-h-[160px]`}>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            {appMode === 'concept' ? (
                <div className="relative w-full h-full flex flex-col p-2 sm:p-3 z-10 overflow-hidden">
                    
                    {/* Clear Objective Banner */}
                    <div className="w-full bg-[#24160f] border border-amber-500/30 p-3 sm:p-4 rounded-xl mb-2 shrink-0 shadow-sm flex items-start gap-3">
                        <Target className="text-amber-500 shrink-0 mt-0.5" size={24} />
                        <div className="flex flex-col leading-tight">
                            <span className="text-amber-500 font-black uppercase text-[16px] tracking-widest mb-0.5">Objective</span>
                            <span className="text-white font-bold text-[14px]">{getDynamicObjective(currentTabIdx)}</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full flex items-center justify-center min-h-0">
                        <MathBoard />
                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-3 sm:p-5 z-10 overflow-hidden">
                    <h2 className="text-white text-[16px] font-black mb-3 leading-snug max-w-2xl drop-shadow-md px-2">
                        {currentQuizSet[quizStep]?.q}
                    </h2>

                    <AnimatePresence mode="wait">
                        {quizFeedbackMode && showExplanation && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col w-full max-w-xl mt-1 h-full justify-center">
                                <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden w-full mb-2 shadow-lg">
                                    <table className="w-full text-left text-[14px]">
                                        <thead>
                                            <tr className="bg-black/60 border-b border-white/10 text-emerald-400">
                                                <th className="p-1.5 sm:p-2 font-black uppercase tracking-widest text-[16px]">Phase</th>
                                                <th className="p-1.5 sm:p-2 font-black uppercase tracking-widest text-[16px]">Math</th>
                                                <th className="p-1.5 sm:p-2 font-black uppercase tracking-widest text-[16px] text-right">Result</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentQuizSet[quizStep].explanationTable.map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 last:border-0">
                                                    <td className="p-1.5 sm:p-2 text-white/80 font-bold text-[14px]">{row.step}</td>
                                                    <td className="p-1.5 sm:p-2 font-mono text-white text-[14px]">{row.math}</td>
                                                    <td className="p-1.5 sm:p-2 font-black text-emerald-400 text-right text-[14px]">{row.result}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-emerald-900/40 border border-emerald-500/50 p-2.5 sm:p-3 rounded-xl text-emerald-100 text-[14px] font-bold leading-snug shadow-inner">
                                    {currentQuizSet[quizStep]?.explanation}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>

        {/* DIV 2: BOTTOM PANEL - CUSTOM LAYOUT MATCHING SCREENSHOT */}
        <div className={`w-full bg-[#2a1a16] rounded-2xl sm:rounded-[2rem] border-[4px] sm:border-[6px] border-[#1a0f0d] shadow-2xl relative flex flex-col overflow-hidden transition-all duration-500 flex-[1.2] min-h-[300px]`}>
            <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

            <div className="flex-1 overflow-hidden flex flex-row relative z-10 w-full h-full">
                
                {/* LEFT SIDEBAR TABS */}
                <div className="w-[120px] sm:w-[180px] shrink-0 flex flex-col gap-2 py-3 px-2 sm:px-3 border-r-[3px] border-black/30 overflow-y-auto no-scrollbar bg-[#1a0f0d]">
                    {appMode === 'concept' ? CONCEPT_TABS.map((tab, idx) => {
                        const isActive = currentTabIdx === idx;
                        return (
                            <button 
                                key={tab.id}
                                onClick={() => handleTabClick(idx)}
                                className={`w-full py-3 px-3 rounded-xl font-black text-[14px] uppercase tracking-widest text-left transition-all flex flex-col gap-1 ${isActive ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-black/20 text-white/50 hover:bg-black/40 hover:text-white/80'}`}
                            >
                                <span>{tab.label}</span>
                            </button>
                        )
                    }) : currentQuizSet.map((_, idx) => {
                        const isActive = quizStep === idx;
                        return (
                            <button 
                                key={idx}
                                onClick={() => handleTabClick(idx)}
                                className={`w-full py-3 px-3 rounded-xl font-black text-[14px] uppercase tracking-widest text-left transition-all ${isActive ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-black/20 text-white/50 hover:bg-black/40 hover:text-white/80'}`}
                            >
                                Challenge {idx + 1}
                            </button>
                        )
                    })}
                </div>

                {/* RIGHT CONTENT AREA */}
                <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto no-scrollbar p-4 sm:p-6 bg-[#24160f] relative">
                    <AnimatePresence mode='wait'>
                        {/* CONCEPT MODE CONTENT */}
                        {appMode === 'concept' && (
                          <motion.div key={`c-${activeStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full w-full">
                            
                            {/* Step Header */}
                            <div className="flex items-center gap-3 mb-4 shrink-0 border-b border-white/10 pb-3">
                                <button onClick={prevStep} disabled={activeStep === 0} className="text-amber-500 hover:text-amber-400 disabled:opacity-30 transition-opacity">
                                    <ChevronLeft size={20} />
                                </button>
                                <div className="bg-amber-600/20 p-1.5 rounded-lg shrink-0 shadow-md border border-amber-500/30">
                                    <Navigation className="text-amber-400" size={16} />
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-amber-500 font-black uppercase text-[14px] tracking-widest mb-0.5">
                                        Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}
                                    </span>
                                    <span className="text-white font-bold text-[16px] leading-snug">
                                        {currentConfig.title}
                                    </span>
                                </div>
                            </div>

                            {/* Inner Content Box */}
                            <div className="flex flex-col flex-1 min-h-[150px] justify-center">
                                
                                {activeStep === 8 ? (
                                    <div className="flex flex-col gap-3 mb-4 text-left w-full h-full justify-center">
                                        <p className="text-emerald-400 text-[16px] font-bold flex items-center gap-2">
                                           <span className="shrink-0"><TrendingUp size={16}/></span> 
                                           <span><strong>Increase:</strong> X * (1 + R/100)</span>
                                        </p>
                                        <p className="text-rose-400 text-[16px] font-bold flex items-center gap-2">
                                           <span className="shrink-0"><TrendingDown size={16}/></span> 
                                           <span><strong>Decrease:</strong> X * (1 - R/100)</span>
                                        </p>
                                        <p className="text-blue-400 text-[16px] font-bold flex items-center gap-2">
                                           <span className="shrink-0"><Layers size={16}/></span> 
                                           <span><strong>Successive:</strong> X * (1+A/100) * (1-B/100)</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-white/80 font-medium text-[14px] leading-relaxed whitespace-pre-line mb-6 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                                        {currentConfig.explanation}
                                    </p>
                                )}

                                <div className="flex items-start gap-2 mb-4 mx-auto w-full max-w-xl justify-center">
                                    <span className="text-amber-400 text-lg leading-none mt-0.5">👉</span>
                                    <p className="text-white font-black text-[16px] leading-snug text-center">
                                        {currentConfig?.selectionPrompt}
                                    </p>
                                </div>

                                <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 shrink-0 mb-4 w-full mx-auto max-w-3xl mt-auto">
                                    {currentConfig?.options?.map((opt, i) => {
                                        const isSelected = conceptSelectedOption === i;
                                        const isCorrect = isSelected && isQuizPassed;
                                        const isWrong = isSelected && feedback.type === 'error';
                                        let btnClass = "bg-[#1a0f0d] border border-white/10 text-white hover:bg-white/10 active:scale-95";
                                        
                                        if (isCorrect) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-[1.02]";
                                        else if (isWrong) btnClass = "bg-rose-600 border-rose-400 text-white";
                                        else if (isQuizPassed) btnClass = "bg-black/40 border-transparent text-white/20 opacity-50 cursor-not-allowed";

                                        return (
                                            <button key={i} disabled={isQuizPassed} onClick={() => handleSelectionQuiz(i)} className={`flex-1 min-w-[200px] px-4 py-3 sm:py-4 rounded-xl font-black text-[14px] transition-all border ${btnClass}`}>
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {!isQuizPassed && feedback.type === 'error' && (
                                    <p className="text-rose-400 text-[14px] font-bold text-center animate-pulse mt-2">"{feedback.reason}"</p>
                                )}

                                {/* Auto-advance or final button for concept */}
                                {isQuizPassed && (
                                    <div className="mt-2 pt-4 border-t border-white/10 flex justify-end">
                                        <button onClick={nextStep} className={`py-2 sm:py-2.5 px-6 rounded-xl font-black uppercase text-[14px] transition-all bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400 active:scale-95`}>
                                            {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Start Practice' : 'Continue'}
                                        </button>
                                    </div>
                                )}
                            </div>
                          </motion.div>
                        )}

                        {/* PRACTICE MODE INTERACTION */}
                        {appMode === 'practice' && (
                            <motion.div key={`p-${quizStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full w-full">
                                
                                <div className="flex flex-col flex-1 justify-center w-full max-w-3xl mx-auto px-2 mt-4">
                                    
                                    {!showExplanation ? (
                                        <>
                                            <div className="flex items-start gap-2 mb-5 justify-center">
                                                <span className="text-amber-400 text-lg leading-none mt-0.5">👉</span>
                                                <p className="text-white font-black text-[16px] leading-snug text-center">
                                                    Select the correct calculated value:
                                                </p>
                                            </div>

                                            <div className="flex flex-row flex-wrap justify-center gap-3 sm:gap-4 w-full">
                                                {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                                                    let style = "bg-[#1a0f0d] border border-white/10 text-white hover:bg-white/10 active:scale-95";
                                                    if (quizFeedbackMode) {
                                                        if (idx === currentQuizSet[quizStep].correct) style = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)] scale-[1.02] z-10";
                                                        else if (idx === quizSelection) style = "bg-rose-600 border-rose-400 text-white shadow-lg";
                                                        else style = "bg-black/40 border-transparent text-white/20 opacity-40";
                                                    }
                                                    return (
                                                        <button key={idx} disabled={quizFeedbackMode} onClick={() => handlePracticeSelection(idx)} className={`flex-1 min-w-[200px] px-5 py-3 sm:py-4 rounded-xl font-black font-mono text-[14px] border-2 transition-all ${style}`}>
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {quizFeedbackMode && quizSelection !== currentQuizSet[quizStep].correct && (
                                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                                    <p className="text-rose-400 text-[14px] font-bold italic animate-pulse">Incorrect value.</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={tryAgainPractice} className="py-2 px-4 bg-rose-600 text-white rounded-lg font-black text-[14px] uppercase transition-all shadow-md active:scale-95">
                                                            Try Again
                                                        </button>
                                                        <button onClick={() => setShowExplanation(true)} className="py-2 px-4 bg-indigo-500 text-white rounded-lg font-black text-[14px] uppercase transition-all shadow-md active:scale-95">
                                                            View Logic
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {quizFeedbackMode && quizSelection === currentQuizSet[quizStep].correct && (
                                                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                                                    <p className="text-emerald-400 text-[14px] font-bold italic animate-pulse">Correct! Well done.</p>
                                                    <button onClick={nextPracticeTask} className="py-2 px-6 bg-emerald-600 text-white rounded-lg font-black text-[14px] uppercase transition-all shadow-[0_0_15px_rgba(52,211,153,0.4)] active:scale-95">
                                                        {quizStep === currentQuizSet.length - 1 ? "Finish Lab" : "Next"}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full w-full justify-center">
                                            <div className="bg-black/30 rounded-xl border border-white/10 overflow-hidden w-full mb-3 shadow-lg">
                                                <table className="w-full text-left text-[14px]">
                                                    <thead>
                                                        <tr className="bg-black/50 border-b border-white/10 text-indigo-400">
                                                            <th className="p-2 font-black uppercase tracking-widest text-[16px]">Phase</th>
                                                            <th className="p-2 font-black uppercase tracking-widest text-[16px]">Math</th>
                                                            <th className="p-2 font-black uppercase tracking-widest text-[16px] text-right">Result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {currentQuizSet[quizStep].explanationTable.map((row, i) => (
                                                            <tr key={i} className="border-b border-white/5 last:border-0">
                                                                <td className="p-2 text-white/80 font-bold text-[14px]">{row.step}</td>
                                                                <td className="p-2 font-mono text-white text-[14px]">{row.math}</td>
                                                                <td className="p-2 font-black text-indigo-400 text-right text-[14px]">{row.result}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-xl text-indigo-100 text-[14px] font-bold leading-snug shadow-inner mb-4">
                                                {currentQuizSet[quizStep]?.explanation}
                                            </div>

                                            <div className="mt-auto flex justify-between items-center pt-2">
                                                <button onClick={tryAgainPractice} className="py-2 px-4 bg-white/10 text-white/70 hover:text-white hover:bg-white/20 rounded-lg font-black text-[14px] uppercase transition-all">
                                                    Back to Options
                                                </button>
                                                <button onClick={nextPracticeTask} className="py-2 px-6 bg-indigo-500 text-white rounded-lg font-black text-[14px] uppercase transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95">
                                                    {quizStep === currentQuizSet.length - 1 ? "Finish Lab" : "Next Challenge"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>

      </main>

      {/* CONCEPT SUMMARY MODAL */}
      <AnimatePresence>
          {showConceptSummary && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
                 <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#2a1a16] border-4 border-[#8d6e63] shadow-2xl p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] flex flex-col items-center gap-5 w-full max-w-xl text-center relative overflow-hidden my-auto">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    
                    <div className="bg-indigo-500/20 p-4 sm:p-5 rounded-full relative z-10 shadow-lg border border-indigo-500/30">
                        <BookOpen size={48} className="text-indigo-400" />
                    </div>

                    <div className="relative z-10 mt-2">
                        <h2 className="text-white text-[16px] font-black uppercase tracking-widest drop-shadow-lg mb-2">Module Summary</h2>
                        <p className="text-[#a88a6d] text-[14px] font-bold px-2 mb-6">Here are the one-step algebraic multipliers you built!</p>
                    </div>

                    <div className="flex flex-col gap-3 w-full text-left relative z-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-[#2a1a16] border border-emerald-500/30 p-4 rounded-xl flex flex-col shadow-lg">
                            <p className="text-emerald-400 text-[16px] font-bold flex items-center gap-2 mb-1.5 uppercase tracking-widest">
                               <TrendingUp size={16}/> Increased By Formula
                            </p>
                            <span className="text-white font-mono font-black text-[14px] pl-6">X * (1 + R/100)</span>
                            <span className="text-[#a88a6d] text-[14px] font-bold pl-6 mt-1">Factored out X from the sum: (X + X*R/100).</span>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-[#2a1a16] border border-rose-500/30 p-4 rounded-xl flex flex-col shadow-lg">
                            <p className="text-rose-400 text-[16px] font-bold flex items-center gap-2 mb-1.5 uppercase tracking-widest">
                               <TrendingDown size={16}/> Decreased By Formula
                            </p>
                            <span className="text-white font-mono font-black text-[14px] pl-6">X * (1 - R/100)</span>
                            <span className="text-[#a88a6d] text-[14px] font-bold pl-6 mt-1">Used the minus sign for a shrinking base.</span>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#2a1a16] border border-blue-500/30 p-4 rounded-xl flex flex-col shadow-lg">
                            <p className="text-blue-400 text-[16px] font-bold flex items-center gap-2 mb-1.5 uppercase tracking-widest">
                               <Layers size={16}/> Successive Changes
                            </p>
                            <span className="text-white font-mono font-black text-[14px] pl-6">X * (1+A/100) * (1-B/100)</span>
                            <span className="text-[#a88a6d] text-[14px] font-bold pl-6 mt-1">Chained the multipliers to calculate instantly.</span>
                        </motion.div>
                    </div>

                    <div className="w-full mt-6 relative z-10">
                        <button onClick={() => { handleSetMode('practice'); setShowConceptSummary(false); }} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-xl active:scale-95 border-b-4 border-indigo-900 flex justify-center items-center gap-3">
                            <Target size={20} /> Enter Practice Lab
                        </button>
                    </div>
                    <button onClick={() => setShowConceptSummary(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-20 hover:rotate-90 duration-300"><X size={24} /></button>
                 </motion.div>
             </motion.div>
          )}
      </AnimatePresence>

      {/* FULL SCREEN COMPLETION MODAL (PRACTICE ONLY) */}
      <AnimatePresence>
        {showFinishModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
               <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#2a1a16] border-[6px] border-[#1a0f0d] shadow-2xl p-6 sm:p-10 rounded-[3rem] flex flex-col items-center gap-5 w-full max-w-md text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                  <div className="bg-indigo-500/20 p-6 rounded-full relative z-10 shadow-lg border border-indigo-500/30">
                      <Trophy size={64} className="text-indigo-400 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-2 relative z-10 mt-2">
                      <h2 className="text-white text-[16px] font-black uppercase tracking-widest drop-shadow-lg">
                          Lab Complete!
                      </h2>
                      <p className="text-indigo-100 text-[14px] font-medium px-2 mt-1 leading-relaxed">
                          {appMode === 'concept' ? "You've successfully built the algebraic formulas!" : "You solved the challenges flawlessly!"}
                      </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full mt-6 relative z-10">
                     <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] active:scale-95 border-b-4 border-indigo-900">Go To Next Module</button>
                     <button onClick={() => { handleReset(appMode); setShowFinishModal(false); }} className="w-full py-3 rounded-xl bg-black/40 hover:bg-black/60 text-white/60 hover:text-white font-black uppercase text-[14px] tracking-wider transition-all border border-white/10">Restart Module</button>
                  </div>
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-20 hover:rotate-90 duration-300"><X size={24} /></button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }