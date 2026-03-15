import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  HelpCircle,
  Compass,
  Info,
  Eye,
  Percent,
  Calculator,
  DivideSquare,
  FastForward,
  CheckCircle2,
  Target
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
    question: "How do we calculate ANY percentage from scratch?",
    teachingSteps: [
      { 
        id: "step-1",
        title: "Meaning of Percent",
        explanation: "Let's figure out what 30% really means.\nThe word 'percent' literally means 'out of 100'.",
        selectionPrompt: "How can we mathematically write 30% as a fraction?",
        options: ["30 ÷ 100", "100 ÷ 30", "30 + 100"],
        correct: 0,
        feedback: [
          "Exactly! 30% simply means 30 out of 100.",
          "The 100 must be the total on the bottom (the divisor).",
          "We are dividing, not adding."
        ],
        why: "30% is just a shorter way of writing the fraction 30/100."
      },
      { 
        id: "step-2",
        title: "Scaling Up",
        explanation: "Okay, out of 100 it is 30.\n\nThen if I ask, what if the total quantity is 500?",
        selectionPrompt: "What is the mathematical way to calculate how much we get?",
        options: ["500 ÷ 30", "500 × (30 ÷ 100)", "500 + 30"],
        correct: 1,
        feedback: [
          "That would shrink the total incorrectly.",
          "Yes! We multiply the total quantity (500) by our fraction (30/100).",
          "We don't add the percentage to the total."
        ],
        why: "To find a portion of a whole, multiply the Total by the Fraction."
      },
      { 
        id: "step-3",
        title: "The Generic Formula",
        explanation: "Notice the pattern! We took our Total (500) and multiplied it by our percentage fraction (30/100).\n\nThis way we can deduce the general formula:\nValue = (Percent / 100) × Total Quantity",
        selectionPrompt: "Which generic formula will work for ANY percentage?",
        options: ["(Total ÷ 100) + Percent", "(Percent ÷ 100) × Total", "Percent × 100"],
        correct: 1,
        feedback: [
          "Addition won't give us a percentage of a whole.",
          "Exactly! You have successfully built the Golden Formula for percentages.",
          "You need to divide the percent by 100 first!"
        ],
        why: "Any percent out of a total = (Percent ÷ 100) × Total."
      },
      { 
        id: "step-4",
        title: "Apply the Formula",
        explanation: "Let's test our general formula on a new problem: Find 25% of 600.",
        selectionPrompt: "How would we write the equation to find 25% of 600?",
        options: ["(25 ÷ 100) × 600", "(600 ÷ 100) + 25", "(25 × 600) ÷ 1000"],
        correct: 0,
        feedback: [
          "Perfect! You placed the percent over 100, then multiplied by the total.",
          "We don't use addition.",
          "Watch your zeros! It's divided by 100."
        ],
        why: "25% of 600 is written directly as (25/100) × 600."
      },
      { 
        id: "step-5",
        title: "Solve It",
        explanation: "Let's calculate the final answer for (25 ÷ 100) × 600. \n\nHint: 25/100 simplifies to 1/4. What is a quarter of 600?",
        selectionPrompt: "Calculate the final value:",
        options: ["150", "200", "125"],
        correct: 0,
        feedback: [
          "Yes! 1/4 of 600 is exactly 150.",
          "Check your division: 600 ÷ 4.",
          "Not quite."
        ],
        why: "(25 ÷ 100) × 600 = 150. The formula works flawlessly!"
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Per-Cent", explanation: "Percent means 'for every 100'. 30% is just 30/100.", text: "30% = 30/100" },
      { id: 2, step: 1, concept: "Scaling", explanation: "To find a piece of a whole amount, multiply the total by your fraction.", text: "Multiply by Total" },
      { id: 3, step: 2, concept: "The Pattern", explanation: "By combining the previous steps, we discover the universal rule for all percentages.", text: "Deriving the Rule" },
      { id: 4, step: 3, concept: "Consistency", explanation: "This exact same formula works for any percentage and any number.", text: "Works Every Time" }
    ]
  },
  practice: {
    quiz: [
      { 
        q: "Calculate 40% of 50.", 
        options: ["20", "40", "200"], 
        correct: 0, 
        explanation: "Formula: (40 / 100) × 50. Simplify 40/100 to 4/10. Then (4 / 10) × 50 = 4 × 5 = 20.",
        breakdown: { logic: "Formula: (40 ÷ 100) × 50", calculation: "(4 ÷ 10) × 50", jump: "20" }
      },
      { 
        q: "Calculate 75% of 80.", 
        options: ["75", "60", "30"], 
        correct: 1, 
        explanation: "Formula: (75 / 100) × 80. 75/100 is 3/4. Then (3 / 4) × 80 = 3 × 20 = 60.",
        breakdown: { logic: "Formula: (75 ÷ 100) × 80", calculation: "(3 ÷ 4) × 80", jump: "60" }
      },
      { 
        q: "Calculate 5% of 200.", 
        options: ["5", "100", "10"], 
        correct: 2, 
        explanation: "Formula: (5 / 100) × 200. 200 divided by 100 is 2. Then 5 × 2 = 10.",
        breakdown: { logic: "Formula: (5 ÷ 100) × 200", calculation: "5 × 2", jump: "10" }
      },
      { 
        q: "Calculate 90% of 300.", 
        options: ["90", "270", "2700"], 
        correct: 1, 
        explanation: "Formula: (90 / 100) × 300. Simplify 90/100 to 9/10. Then (9 / 10) × 300 = 9 × 30 = 270.",
        breakdown: { logic: "Formula: (90 ÷ 100) × 300", calculation: "(9 ÷ 10) × 300", jump: "270" }
      },
      { 
        q: "Calculate 15% of 60.", 
        options: ["15", "6", "9"], 
        correct: 2, 
        explanation: "Formula: (15 / 100) × 60. 15 × 60 = 900. 900 / 100 = 9.",
        breakdown: { logic: "Formula: (15 ÷ 100) × 60", calculation: "900 ÷ 100", jump: "9" }
      }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  
  // Practice State
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);
  
  const currentConfig = appMode === 'concept' 
    ? LOGIC_DATA.concept.teachingSteps[activeStep] 
    : LOGIC_DATA.practice.quiz[quizStep];

  const currentQuizSet = LOGIC_DATA.practice.quiz;

  function handleReset() {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setShowFinishModal(false);
    setLessonFinished(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset();
  }

  function handleSelectionQuiz(idx) {
    setConceptSelectedOption(idx);
    const fbReason = currentConfig?.feedback ? currentConfig.feedback[idx] : "Correct!";
    if (idx === currentConfig?.correct) {
      setFeedback({ type: 'success', msg: "Correct!", reason: String(fbReason) });
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handlePracticeSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
    if (idx === currentConfig?.correct) setShowExplanation(true); 
    else setShowExplanation(false); 
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

  const isQuizPassed = feedback.type === 'success' || (appMode === 'practice' && quizFeedbackMode && (quizSelection === currentConfig?.correct));

  // --- HTML Digital Math Board ---
  const MathBoard = () => {
      if (appMode === 'practice') {
          return (
              <div className="flex flex-col items-center text-center gap-4 animate-pulse">
                  <Calculator size={64} className="text-[#3e2723]/30" />
                  <span className="text-[#3e2723]/50 font-black uppercase tracking-widest text-sm">Calculate the value</span>
              </div>
          );
      }

      // Concept Mode Dynamic Equations building up to the formula
      return (
          <div className="flex items-center justify-center w-full h-full relative">
              <div className="absolute top-0 sm:top-2 w-full text-center">
                  <h3 className="text-white/50 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                      Step {activeStep + 1}: {LOGIC_DATA.concept.teachingSteps[activeStep].title}
                  </h3>
              </div>

              {activeStep === 0 && (
                  <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-5xl font-black text-white mt-6">
                      <span className="text-yellow-400">30%</span>
                      <span className="text-white/50">→</span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-2 sm:px-4">30</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-2 sm:px-4">100</span>
                      </div>
                  </div>
              )}
              {activeStep === 1 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-3xl sm:text-5xl font-black text-white mt-6">
                      <span className="text-yellow-400">500</span>
                      <span className="text-white/50">×</span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-2 sm:px-4">30</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-2 sm:px-4">100</span>
                      </div>
                  </div>
              )}
              {activeStep === 2 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-4xl lg:text-5xl font-black text-white mt-6">
                      <span className="text-yellow-400">Total</span>
                      <span className="text-white/50">×</span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-2 sm:px-4">Percent</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-2 sm:px-4">100</span>
                      </div>
                  </div>
              )}
              {activeStep === 3 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-3xl sm:text-5xl font-black text-white mt-6">
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-2 sm:px-4">25</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-2 sm:px-4">100</span>
                      </div>
                      <span className="text-white/50">×</span>
                      <span className="text-yellow-400">600</span>
                  </div>
              )}
              {activeStep === 4 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white mt-6">
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-2 sm:px-4">25</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-2 sm:px-4">100</span>
                      </div>
                      <span className="text-white/50">×</span>
                      <span className="text-yellow-400">600</span>
                      <span className="text-white/50">=</span>
                      <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">150</span>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Calculation Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {appMode === 'concept' ? (
            <>
                {/* TOP PANEL - DIGITAL MATH BOARD */}
                <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[200px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center justify-center gap-2 opacity-50 text-[10px] sm:text-[12px] font-black uppercase tracking-widest leading-none text-white z-20">
                        <Calculator size={14} /> Digital Math Board
                    </div>
                    {/* HTML Math Rendering Area */}
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 z-10">
                        <MathBoard />
                    </div>
                </div>

                {/* BOTTOM PANEL - GUIDANCE & EXPLANATION */}
                <div className="flex-[1.0] lg:flex-[1.2] w-full bg-[#3e2723] p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-t-4 border-black shadow-2xl relative z-20 flex flex-col gap-3 overflow-hidden min-h-0">
                    <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3 sm:gap-6 h-full relative z-10 min-h-0">
                        
                        {/* Left Column: Concept Summary */}
                        <div className="flex flex-col gap-3 h-full min-h-0">
                            {/* PERSISTENT GENERAL FORMULA (Always visible if activeStep >= 2) */}
                            {activeStep >= 2 && (
                                <div className="bg-sky-900/20 border-2 border-sky-500/30 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center shadow-inner shrink-0">
                                    <span className="text-sky-300 font-black uppercase text-[9px] sm:text-[10px] tracking-widest mb-1.5 flex items-center gap-1">
                                        <Calculator size={12} /> The General Formula
                                    </span>
                                    <span className="text-white font-mono text-[12px] sm:text-[14px] font-black tracking-wider">
                                        Value = (Percent ÷ 100) × Total
                                    </span>
                                </div>
                            )}

                            {/* Concept Summary Text (Clues) */}
                            <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3 sm:p-4">
                                <div className="flex items-center gap-2 opacity-50 mb-2 border-b border-white/10 pb-2 shrink-0">
                                    <BookOpen size={14} className="text-[#a88a6d]" />
                                    <span className="text-[#a88a6d] font-black uppercase text-[10px] sm:text-[11px] tracking-wider">Concept Summary</span>
                                </div>
                                <div className="flex flex-col gap-3 mt-1">
                                    {LOGIC_DATA.concept.clues.map((clue) => {
                                        const isActive = clue.step === activeStep;
                                        const isPassed = clue.step < activeStep;
                                        if (!isActive && !isPassed) return null;
                                        return (
                                          <div key={clue.id} className={`flex flex-col gap-1 sm:gap-1.5 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                            <span className="w-fit px-2 py-1 rounded bg-sky-400 text-black font-black text-[9px] uppercase tracking-wider">
                                                {clue.concept}
                                            </span>
                                            <p className="text-white text-[11px] sm:text-[12px] leading-snug pl-2 border-l-2 border-white/20 mt-1">{clue.explanation}</p>
                                          </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Interaction Panel */}
                        <div className="flex flex-col bg-[#2a1a16]/95 p-3 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden min-h-0">
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-1 flex flex-col">
                                <AnimatePresence mode='wait'>
                                    <motion.div 
                                        key={`concept-sel-${activeStep}`} 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col gap-2 h-full"
                                    >
                                        <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
                                           <span className="text-sky-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
                                        </div>
                                        
                                        {/* Concept Details / Explanation */}
                                        <div className="bg-black/30 p-3 sm:p-4 rounded-xl border border-white/5 mt-2 shrink-0">
                                            <p className="text-sky-100 font-medium text-[12px] sm:text-[14px] leading-relaxed whitespace-pre-line">
                                                {currentConfig?.explanation}
                                            </p>
                                        </div>

                                        {/* Question Prompt */}
                                        <p className="text-white font-bold text-[13px] sm:text-[15px] leading-snug whitespace-pre-line mt-2">
                                            {currentConfig?.selectionPrompt}
                                        </p>

                                        <div className="flex flex-col gap-2 mt-auto shrink-0 pt-3">
                                            {currentConfig?.options?.map((opt, i) => {
                                                const isSelected = conceptSelectedOption === i;
                                                const isCorrect = isSelected && isQuizPassed;
                                                const isWrong = isSelected && feedback.type === 'error';
                                                
                                                let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 active:scale-95";
                                                if (isCorrect) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-lg";
                                                else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                                return (
                                                    <button 
                                                        key={i} 
                                                        disabled={isQuizPassed}
                                                        onClick={() => handleSelectionQuiz(i)} 
                                                        className={`px-4 py-3.5 rounded-xl font-black text-[12px] sm:text-[14px] transition-all border-2 ${btnClass}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[11px] sm:text-[13px] font-bold italic text-center animate-pulse mt-2 shrink-0">"{feedback.reason}"</p>}
                                        
                                        {/* Post-Answer Next Button */}
                                        {isQuizPassed && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-3 pt-3 border-t border-white/10 w-full shrink-0">
                                                <div className="flex gap-2 w-full">
                                                    <button onClick={prevStep} disabled={activeStep === 0} className={`py-3.5 px-4 rounded-xl font-black transition-all border-2 ${activeStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                                        <ChevronLeft size={18} />
                                                    </button>

                                                    <button onClick={nextStep} className="flex-1 py-3.5 rounded-xl font-black uppercase text-[12px] sm:text-[14px] transition-all bg-emerald-600 text-white border-b-4 border-emerald-800 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                                        {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Start Practice' : 'Next Step'}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        ) : (
            /* PRACTICE MODE LAYOUT: No Visualizer, Question Top, Explanation Bottom */
            <div className="w-full h-full flex flex-col gap-3 sm:gap-4 overflow-y-auto no-scrollbar pb-2">
                
                {/* TOP: QUESTION, OPTIONS & ACTIONS */}
                <div className="bg-[#110c0b] rounded-[2rem] border-4 border-black shadow-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center shrink-0 relative min-h-[300px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-4 left-5 flex items-center gap-2 opacity-50 text-white text-[10px] sm:text-xs uppercase font-black tracking-widest">
                       <Target size={16} /> Challenge {quizStep + 1} of {currentQuizSet.length}
                    </div>
                    
                    <h2 className="text-white text-xl sm:text-3xl lg:text-4xl font-black mt-8 mb-10 leading-snug max-w-3xl z-10 relative">
                        {currentQuizSet[quizStep]?.q}
                    </h2>
                    
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 w-full max-w-4xl z-10 relative">
                        {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                            let style = "bg-[#2a1a16] border-white/10 text-white/80 hover:bg-black/60 hover:text-white";
                            if (quizFeedbackMode) {
                                if (idx === currentQuizSet[quizStep].correct) style = "bg-emerald-600 border-emerald-400 text-white shadow-[0_0_15px_rgba(52,211,153,0.3)] scale-105 z-10";
                                else if (idx === quizSelection) style = "bg-rose-600 border-rose-400 text-white shadow-lg";
                                else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                            }
                            return (
                                <button key={idx} disabled={quizFeedbackMode} onClick={() => handlePracticeSelection(idx)} className={`px-5 py-3 sm:px-8 sm:py-5 rounded-2xl font-black text-sm sm:text-xl border-2 transition-all ${style}`}>
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {/* ACTION BUTTONS (Moved here to the top div) */}
                    {quizFeedbackMode && (
                        <div className="mt-8 flex flex-col items-center w-full max-w-2xl z-10 relative pt-6 border-t-2 border-white/10">
                            {quizSelection !== currentQuizSet[quizStep].correct ? (
                                <>
                                    <p className="text-rose-400 text-sm sm:text-base font-bold italic mb-4 animate-pulse">Incorrect. Try again or view logic.</p>
                                    <div className="flex items-center gap-3 w-full">
                                        <button onClick={prevPracticeTask} disabled={quizStep === 0} className={`py-4 sm:py-5 px-5 rounded-2xl font-black transition-all border-2 ${quizStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={tryAgainPractice} className="flex-1 py-4 sm:py-5 bg-rose-600 text-white rounded-2xl font-black text-[12px] sm:text-base uppercase border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 transition-all shadow-lg">
                                            Try Again
                                        </button>
                                        <button onClick={() => setShowExplanation(!showExplanation)} className="flex-1 py-4 sm:py-5 bg-blue-600 text-white rounded-2xl font-black text-[12px] sm:text-base uppercase border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all shadow-lg">
                                            {showExplanation ? "Hide Logic" : "View Logic"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-emerald-400 text-sm sm:text-base font-bold italic mb-4 animate-pulse">Correct! Well done.</p>
                                    <div className="flex items-center gap-3 w-full">
                                        <button onClick={prevPracticeTask} disabled={quizStep === 0} className={`py-4 sm:py-5 px-5 rounded-2xl font-black transition-all border-2 ${quizStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button onClick={nextPracticeTask} className={`flex-1 py-4 sm:py-5 text-white rounded-2xl font-black text-[13px] sm:text-base uppercase border-b-4 border-emerald-800 bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 transition-all shadow-[0_0_20px_rgba(52,211,153,0.4)]`}>
                                            {quizStep === currentQuizSet.length - 1 ? "Finish Lab" : "Next Question"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* BOTTOM: EXPLANATION (Only shown when requested) */}
                <AnimatePresence mode="wait">
                    {quizFeedbackMode && showExplanation && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="flex-1 bg-[#3e2723] rounded-[2rem] border-t-4 border-black shadow-2xl p-4 sm:p-6 flex flex-col justify-start min-h-[250px] relative">
                            <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                            <div className="flex flex-col h-full relative z-10">
                                <h4 className="text-sky-400 font-black uppercase text-[11px] sm:text-[13px] tracking-widest mb-3 flex items-center gap-1.5 border-b border-sky-500/20 pb-2 shrink-0">
                                    <Info size={18}/> Logic Breakdown
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white mb-4 shrink-0">
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><DivideSquare size={14}/> Math Logic</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-sky-500/30 shadow-inner">
                                        <span className="text-sky-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><Calculator size={14}/> Calculation</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px] text-sky-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><FastForward size={14}/> Result</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-sky-900/40 border border-sky-500/50 p-4 rounded-xl text-sky-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner shrink-0">
                                    {currentQuizSet[quizStep]?.explanation}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )}
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
                   className="bg-[#2a1a16] border-4 border-[#8d6e63] shadow-2xl p-6 sm:p-10 rounded-[3rem] flex flex-col items-center gap-6 w-full max-w-md text-center relative overflow-hidden"
               >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                  
                  <div className="bg-sky-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-sky-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully built the golden percentage formula!" 
                              : "You solved the Formula challenges flawlessly!"}
                      </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full mt-8 relative z-10">
                     {appMode === 'concept' ? (
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 sm:py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[15px] sm:text-[16px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-emerald-900">Start Practice Games</button>
                     ) : (
                         <button onClick={() => setShowFinishModal(false)} className="w-full py-4 sm:py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[15px] sm:text-[16px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-emerald-900">Go To Next Module</button>
                     )}
                     <button onClick={() => { handleReset(); setShowFinishModal(false); }} className="w-full py-3 sm:py-4 rounded-xl bg-black/40 hover:bg-black/60 text-[#a88a6d] hover:text-white font-black uppercase text-[13px] sm:text-[14px] tracking-wider transition-all border border-white/10">Restart Module</button>
                  </div>
                  
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-20">
                      <X size={28} />
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }