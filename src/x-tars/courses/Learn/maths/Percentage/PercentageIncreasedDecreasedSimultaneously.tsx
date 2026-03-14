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
  Target,
  TrendingDown,
  TrendingUp,
  Layers,
  ArrowRight
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
            <button onClick={() => setAppMode('concept')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-emerald-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
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
    question: "Objective: Master 'Successive Percentages'. Does an equal % increase and decrease return you to the original value?",
    teachingSteps: [
      { 
        id: "step-1",
        title: "The Initial Increase",
        explanation: "Let's start with an initial value of ₹100. If this value increases by 20%, we need to calculate the new amount.",
        selectionPrompt: "What is 100 increased by 20%?",
        options: ["80", "200", "120"],
        correct: 2,
        feedback: [
          "That would be a decrease!",
          "That would be a 100% increase.",
          "Exactly! 20% of 100 is 20. So, 100 + 20 = 120."
        ],
        why: "Initial Value (100) + Increase Amount (20) = 120."
      },
      { 
        id: "step-2",
        title: "The New Base",
        explanation: "Now, we will decrease this NEW value (120) by 20%. Most people incorrectly guess it goes back to 100.",
        selectionPrompt: "Will the 20% decrease be calculated on the initial value (100) or the current value (120)?",
        options: ["Current Value (120)", "Initial Value (100)"],
        correct: 0,
        feedback: [
          "Correct! Percentages always apply to the CURRENT base value.",
          "No, the base has changed! We don't use the old number."
        ],
        why: "We always apply the new percentage change to the most recent updated value."
      },
      { 
        id: "step-3",
        title: "Calculate Decrease",
        explanation: "Since it decreases on the current value, we must find the exact decrease amount.",
        selectionPrompt: "What will be 20% of 120?",
        options: ["20", "24", "100"],
        correct: 1,
        feedback: [
          "20 is 20% of 100. Calculate it for 120!",
          "Yes! 10% of 120 is 12, so 20% is 24.",
          "That's not 20%."
        ],
        why: "20% of 120 = 24."
      },
      { 
        id: "step-4",
        title: "The Final Value",
        explanation: "We found the exact decrease amount is 24.",
        selectionPrompt: "Since it's a decrease, subtract it from the current value (120). What is the final value?",
        options: ["96", "100", "144"],
        correct: 0,
        feedback: [
          "Perfect! 120 - 24 = 96.",
          "Subtract carefully! 120 - 24 is not 100.",
          "We are subtracting, not adding."
        ],
        why: "Current Value (120) - Decrease Amount (24) = 96."
      },
      { 
        id: "step-5",
        title: "The Revelation",
        explanation: "Look at what just happened! We started with 100. We increased it by 20%, then decreased it by 20%. But we ended up with 96!",
        selectionPrompt: "Compare the final value to the original value:",
        options: ["It went back to normal", "It is MORE than the original", "It is LESS than the original"],
        correct: 2,
        feedback: [
          "100 is not equal to 96!",
          "96 is not more than 100.",
          "Exactly! 96 is less than 100."
        ],
        why: "Despite increasing and decreasing by the exact same percentage, we lost value overall!"
      },
      { 
        id: "step-6",
        title: "The Golden Rule",
        explanation: "Why did this happen?\nThe 20% decrease was calculated on a LARGER number (120), so the drop (24) was mathematically heavier than the initial climb (20).",
        selectionPrompt: "What is the universal rule when a value increases and decreases by the EXACT SAME percentage?",
        options: ["It stays the same", "It results in a net DECREASE", "It results in a net INCREASE"],
        correct: 1,
        feedback: [
          "We just proved it doesn't!",
          "Yes! This is a golden mathematical rule of successive percentages.",
          "The decrease is always heavier because it's calculated on a bigger base."
        ],
        why: "An equal percentage increase followed by a decrease always results in an overall net decrease."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "First Change", explanation: "Apply the first percentage change to the initial base value.", text: "Calculate First %" },
      { id: 2, step: 1, concept: "The New Base", explanation: "CRITICAL: The second percentage change applies to the NEW calculated value, not the original starting number.", text: "Use New Base" },
      { id: 3, step: 2, concept: "Calculate Math", explanation: "Find the percentage of the new base value.", text: "Find New %" },
      { id: 4, step: 5, concept: "The Golden Rule", explanation: "Increase by X%, then decrease by X% ALWAYS yields a final number LESS than the original.", text: "Net Decrease" }
    ]
  },
  practice: {
    question: "Calculate the successive percentage changes step-by-step!",
    quiz: [
      { 
        q: "A shirt costs ₹100. The price increases by 10%, then decreases by 10% during a sale. What is the final price?", 
        options: ["₹100", "₹90", "₹99"], 
        correct: 2, 
        explanation: "The drop is calculated on a larger base (110), so the decrease amount (11) is larger than the initial increase amount (10).",
        explanationTable: [
            { step: "Increased by 10%", math: "= 100 + 100 × (10/100)", result: "110" },
            { step: "Decreased by 10%", math: "= 110 - 110 × (10/100)", result: "99" }
        ],
        breakdown: { logic: "100 + (100 × 10/100) = 110", calculation: "110 - (110 × 10/100) = 99", jump: "₹99" }
      },
      { 
        q: "A town's population of 200 increases by 50% in year one, then decreases by 10% in year two. What is the final population?", 
        options: ["240", "270", "200"], 
        correct: 1, 
        explanation: "Calculate step by step, making sure to apply the 10% decrease to the updated population of 300.",
        explanationTable: [
            { step: "Increased by 50%", math: "= 200 + 200 × (50/100)", result: "300" },
            { step: "Decreased by 10%", math: "= 300 - 300 × (10/100)", result: "270" }
        ],
        breakdown: { logic: "200 + (200 × 50/100) = 300", calculation: "300 - (300 × 10/100) = 270", jump: "270" }
      },
      { 
        q: "If a number is increased by 25% and then decreased by 25%, the final number will be:", 
        options: ["Less than the original", "Exactly the original", "More than the original"], 
        correct: 0, 
        explanation: "The Golden Rule: An equal percentage increase followed by a decrease always results in a net decrease. This happens because the second percentage (the decrease) is calculated on a LARGER new base value, resulting in a heavier drop.",
        explanationTable: [],
        breakdown: { logic: "Increase is on Original Base", calculation: "Decrease is on a LARGER New Base", jump: "Less than original" }
      },
      { 
        q: "A stock is worth ₹500. It jumps 20%, then drops 20%. What's its final value?", 
        options: ["₹500", "₹480", "₹520"], 
        correct: 1, 
        explanation: "The 20% drop hits harder because it's dropping 20% of 600, which is larger than the original 20% of 500.",
        explanationTable: [
            { step: "Increased by 20%", math: "= 500 + 500 × (20/100)", result: "600" },
            { step: "Decreased by 20%", math: "= 600 - 600 × (20/100)", result: "480" }
        ],
        breakdown: { logic: "500 + (500 × 20/100) = 600", calculation: "600 - (600 × 20/100) = 480", jump: "₹480" }
      },
      { 
        q: "What if the order is reversed? A ₹100 item DECREASES by 10%, THEN INCREASES by 10%. What is the final price?", 
        options: ["₹100", "₹101", "₹99"], 
        correct: 2, 
        explanation: "The final result is still exactly the same! Reversing the order still leads to a net decrease because the 10% increase is calculated on a smaller base (90).",
        explanationTable: [
            { step: "Decreased by 10%", math: "= 100 - 100 × (10/100)", result: "90" },
            { step: "Increased by 10%", math: "= 90 + 90 × (10/100)", result: "99" }
        ],
        breakdown: { logic: "100 - (100 × 10/100) = 90", calculation: "90 + (90 × 10/100) = 99", jump: "₹99" }
      }
    ]
  }
};

export function LabContent() {
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
                  <span className="text-[#3e2723]/50 font-black uppercase tracking-widest text-sm">Calculate Successive %</span>
              </div>
          );
      }

      // Concept Mode Dynamic Equations building up to the formula
      return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
              {/* Objective Banner */}
              <div className="absolute top-2 w-full text-center px-4">
                  <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[9px] sm:text-xs bg-black/60 inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-sm leading-tight max-w-full">
                      {LOGIC_DATA.concept.question}
                  </h3>
              </div>

              {activeStep === 0 && (
                  <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-5xl font-black text-white mt-10">
                      <span className="text-white">100</span>
                      <div className="flex flex-col items-center mx-2 text-emerald-400">
                          <TrendingUp size={24} className="mb-1" />
                          <span className="text-sm sm:text-lg">+ 20%</span>
                      </div>
                      <span className="text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">120</span>
                  </div>
              )}
              {activeStep === 1 && (
                  <div className="flex flex-col items-center mt-10">
                      <span className="text-white/50 text-xs sm:text-sm uppercase tracking-widest mb-3">New Base for Decrease</span>
                      <span className="text-5xl sm:text-6xl font-black text-white bg-black/40 px-8 py-4 rounded-3xl border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10">120</span>
                  </div>
              )}
              {activeStep === 2 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white mt-10">
                      <span className="text-rose-400">20%</span>
                      <span className="text-white/50 text-lg sm:text-3xl">of</span>
                      <span className="text-white">120</span>
                      <span className="text-white/50">=</span>
                      <span className="text-rose-400 drop-shadow-md">24</span>
                  </div>
              )}
              {activeStep === 3 && (
                  <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-6xl font-black text-white mt-10">
                      <span className="text-white">120</span>
                      <span className="text-rose-400">-</span>
                      <span className="text-rose-400">24</span>
                      <span className="text-white/50">=</span>
                      <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">96</span>
                  </div>
              )}
              {activeStep === 4 && (
                  <div className="flex flex-col items-center gap-4 mt-10">
                      <div className="flex items-center gap-6 sm:gap-10 text-xl sm:text-3xl font-black text-white">
                          <div className="flex flex-col items-center">
                              <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest mb-2">Original</span>
                              <span className="text-emerald-400">100</span>
                          </div>
                          <ArrowRight size={32} className="text-white/30" />
                          <div className="flex flex-col items-center">
                              <span className="text-white/50 text-[10px] sm:text-xs uppercase tracking-widest mb-2">Final</span>
                              <span className="text-rose-400">96</span>
                          </div>
                      </div>
                      <span className="text-rose-400 font-bold text-sm sm:text-lg italic mt-2 animate-pulse">100 ≠ 96</span>
                  </div>
              )}
              {activeStep === 5 && (
                  <div className="flex flex-col items-center gap-4 mt-10">
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-4xl font-black text-white">
                          <span className="text-emerald-400">+20%</span>
                          <span className="text-white/50 text-sm sm:text-xl">THEN</span>
                          <span className="text-rose-400">-20%</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-5 text-xl sm:text-3xl font-black text-white mt-2 border-t-2 border-white/20 pt-4">
                          <span className="text-white/50 text-sm sm:text-xl">Results in:</span>
                          <span className="text-rose-400 uppercase tracking-widest flex items-center gap-2"><TrendingDown size={28} /> Net Decrease</span>
                      </div>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Successive Percentage Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {appMode === 'concept' ? (
            <>
                {/* TOP PANEL - DIGITAL MATH BOARD */}
                <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[200px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center justify-center gap-2 opacity-50 text-[9px] sm:text-[11px] font-black uppercase tracking-widest leading-none text-white z-20">
                        <Layers size={14} /> Digital Math Board
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
                                            <span className="w-fit px-2 py-1 rounded bg-emerald-400 text-black font-black text-[9px] uppercase tracking-wider">
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
                                           <span className="text-emerald-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Step {activeStep + 1}: {LOGIC_DATA.concept.teachingSteps[activeStep].title}</span>
                                        </div>
                                        
                                        {/* Concept Details / Explanation */}
                                        <div className="bg-black/30 p-3 sm:p-4 rounded-xl border border-white/5 mt-2 shrink-0">
                                            <p className="text-emerald-100 font-medium text-[12px] sm:text-[14px] leading-relaxed whitespace-pre-line">
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
                                <h4 className="text-emerald-400 font-black uppercase text-[11px] sm:text-[13px] tracking-widest mb-3 flex items-center gap-1.5 border-b border-emerald-500/20 pb-2 shrink-0">
                                    <Info size={18}/> Logic Breakdown
                                </h4>
                                
                                <div className="flex flex-col gap-4">
                                    {/* Optional HTML Table for specific steps */}
                                    {currentQuizSet[quizStep].explanationTable && currentQuizSet[quizStep].explanationTable.length > 0 && (
                                        <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                                            <table className="w-full text-left text-[11px] sm:text-[13px] border-collapse">
                                                <thead>
                                                    <tr className="bg-black/50 border-b border-white/10 text-emerald-300">
                                                        <th className="p-3 font-black uppercase tracking-widest">Phase</th>
                                                        <th className="p-3 font-black uppercase tracking-widest">Calculation</th>
                                                        <th className="p-3 font-black uppercase tracking-widest text-right">Result</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentQuizSet[quizStep].explanationTable.map((row, i) => (
                                                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                            <td className="p-3 text-white/70 font-bold">{row.step}</td>
                                                            <td className="p-3 font-mono text-white">{row.math}</td>
                                                            <td className="p-3 font-black text-emerald-400 text-right">{row.result}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-xl text-emerald-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner">
                                        {currentQuizSet[quizStep]?.explanation}
                                    </div>
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
                  
                  <div className="bg-emerald-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-emerald-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully learned the illusion of successive percentages!" 
                              : "You solved the successive percentage challenges flawlessly!"}
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

export default function App() { return ( <Router> <LabContent /> </Router> ); }