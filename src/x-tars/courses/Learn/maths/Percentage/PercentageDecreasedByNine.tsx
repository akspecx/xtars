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
  TrendingDown
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
    question: "How do we calculate a 'Decreased By' percentage?",
    teachingSteps: [
      { 
        id: "step-1",
        title: "Finding the Decrease Value",
        explanation: "Step 1: Find the value of the percent.\nImagine you have ₹400 today, and it will decrease by 20% next year. First, we must figure out exactly what that 20% is in rupees.",
        selectionPrompt: "What is 20% of ₹400?",
        options: ["₹80", "₹320", "₹480"],
        correct: 0,
        feedback: [
          "Exactly! 20% out of 400 is 80.",
          "That would be the final amount, not just the 20% piece!",
          "That would be if it increased!"
        ],
        why: "To find 20% of 400, we calculate (20/100) * 400 = 80."
      },
      { 
        id: "step-2",
        title: "The Meaning of Decrease",
        explanation: "Step 2: Understanding 'Decrease'.\nNow we know the decrease amount is ₹80. The word 'decrease' means your original money is shrinking or losing value.",
        selectionPrompt: "What do you do with this ₹80?",
        options: ["Add it to ₹400", "Subtract it from ₹400", "Multiply it by ₹400"],
        correct: 1,
        feedback: [
          "Adding would mean your money 'increased'.",
          "Yes! 'Decrease' always means we SUBTRACT from our original amount.",
          "Multiplying would give us an incorrectly huge number!"
        ],
        why: "Decrease = Subtraction. We must subtract the lost value from the starting value."
      },
      { 
        id: "step-3",
        title: "The Final Total",
        explanation: "Step 3: Calculating the New Amount.\nSince the money is decreasing, we take the Original Amount (₹400) and SUBTRACT the Decrease Amount (₹80).",
        selectionPrompt: "What is the new total amount you will get next year?",
        options: ["₹480", "₹320", "₹80"],
        correct: 1,
        feedback: [
          "This would be an increase.",
          "Perfect! 400 - 80 = 320.",
          "That is just the decrease amount!"
        ],
        why: "₹400 (Original) - ₹80 (Decrease) = ₹320."
      },
      { 
        id: "step-4",
        title: "The General Rule",
        explanation: "Step 4: The Golden Formula.\nNotice the pattern! We started with our Original amount, calculated a percentage of it, and then subtracted them.",
        selectionPrompt: "Which general formula works for ANY 'decreased by' problem?",
        options: ["Original + Decrease", "Original × Percent", "Original - Decrease"],
        correct: 2,
        feedback: [
          "That is the formula for an increase.",
          "That only gives you the decrease amount, not the final total.",
          "Exactly! You always subtract the calculated decrease from your starting amount."
        ],
        why: "New Value = Original Amount - Decrease Amount."
      },
      { 
        id: "step-5",
        title: "Test the Formula",
        explanation: "Step 5: Apply it to a new number.\nLet's test our rule: What is 80 decreased by 25%?\n\nHint: First find 25% (a quarter) of 80. Then subtract that from the original 80.",
        selectionPrompt: "Calculate the final value:",
        options: ["60", "100", "20"],
        correct: 0,
        feedback: [
          "Yes! 25% of 80 is 20. And 80 - 20 = 60.",
          "You added 20 instead of subtracting!",
          "20 is just the decrease amount. You forgot to subtract it from 80!"
        ],
        why: "Original (80) - Decrease (20) = 60."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Step 1: Find the %", explanation: "First, calculate what the percentage value is in real numbers.", text: "Calculate the Decrease" },
      { id: 2, step: 1, concept: "Decrease = Subtract", explanation: "The word 'decrease' tells us to use Subtraction (-).", text: "Decrease means -" },
      { id: 3, step: 2, concept: "Step 2: Combine", explanation: "Subtract the decrease value from your starting value to get the final answer.", text: "Original - Decrease" },
      { id: 4, step: 3, concept: "Consistency", explanation: "This 2-step process works for every single 'decreased by' problem.", text: "Works Every Time" }
    ]
  },
  practice: {
    question: "Apply the 'Original - Decrease' rule to solve these puzzles!",
    quiz: [
      { 
        q: "A toy costs ₹200. Its price is decreased by 10% on sale. What is the new price?", 
        options: ["₹220", "₹180", "₹20"], 
        correct: 1, 
        explanation: "First find 10% of 200, which is 20. Then subtract it from the original price: 200 - 20 = 180.",
        breakdown: { logic: "10% of 200 = 20", calculation: "Original (200) - Decrease (20)", jump: "₹180" }
      },
      { 
        q: "Your phone battery was at 50%. It decreased by 20% of its current charge. What is your new battery percentage?", 
        options: ["40%", "10%", "60%"], 
        correct: 0, 
        explanation: "20% of 50 is 10. Subtract that from the original battery level: 50 - 10 = 40.",
        breakdown: { logic: "20% of 50 = 10", calculation: "Original (50) - Decrease (10)", jump: "40%" }
      },
      { 
        q: "If an initial value was 50 and now it is 30, what is the PERCENTAGE decrease?", 
        options: ["20%", "40%", "30%"], 
        correct: 1, 
        explanation: "First, find the decrease amount: 50 - 30 = 20. To find the percentage, divide the decrease by the original amount and multiply by 100: (20 ÷ 50) × 100 = 40%.",
        breakdown: { logic: "Decrease amount = 20", calculation: "(20 ÷ 50) × 100", jump: "40%" }
      },
      { 
        q: "A block of ice weighed 100 kg. It melted (decreased) by 25%. How much does it weigh now?", 
        options: ["75 kg", "125 kg", "25 kg"], 
        correct: 0, 
        explanation: "25% of 100 is 25. Subtract the melted amount from the original weight: 100 - 25 = 75.",
        breakdown: { logic: "25% of 100 = 25", calculation: "Original (100) - Decrease (25)", jump: "75 kg" }
      },
      { 
        q: "House rent is ₹500. Next month it decreases by 10%. What is the new rent?", 
        options: ["₹550", "₹450", "₹50"], 
        correct: 1, 
        explanation: "10% of 500 is 50. Subtract it from the original rent: 500 - 50 = 450.",
        breakdown: { logic: "10% of 500 = 50", calculation: "Original (500) - Decrease (50)", jump: "₹450" }
      },
      { 
        q: "A baker made 40 cakes yesterday. Today production decreased by 50%. How many cakes did he make today?", 
        options: ["20 Cakes", "60 Cakes", "80 Cakes"], 
        correct: 0, 
        explanation: "50% (which means exactly half) of 40 is 20. Subtract the lost 20 cakes from the original 40: 40 - 20 = 20.",
        breakdown: { logic: "50% of 40 = 20", calculation: "Original (40) - Decrease (20)", jump: "20 Cakes" }
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
      // Concept Mode Dynamic Equations building up to the formula
      return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
              <div className="absolute top-0 sm:top-2 w-full text-center">
                  <h3 className="text-white/50 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                      Step {activeStep + 1}: {LOGIC_DATA.concept.teachingSteps[activeStep].title}
                  </h3>
              </div>

              {activeStep === 0 && (
                  <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-5xl font-black text-white mt-6">
                      <span className="text-emerald-400">20% of 400</span>
                      <span className="text-white/50">=</span>
                      <span className="text-rose-400">?</span>
                  </div>
              )}
              {activeStep === 1 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-4xl font-black text-white mt-6">
                      <div className="flex flex-col items-center bg-black/40 p-4 rounded-xl border border-white/10">
                          <span className="text-white/50 text-xs sm:text-sm uppercase tracking-widest mb-1">Original</span>
                          <span className="text-emerald-400">400</span>
                      </div>
                      <span className="text-white/50">?</span>
                      <div className="flex flex-col items-center bg-black/40 p-4 rounded-xl border border-white/10">
                          <span className="text-rose-400/50 text-xs sm:text-sm uppercase tracking-widest mb-1">Decrease</span>
                          <span className="text-rose-400">80</span>
                      </div>
                  </div>
              )}
              {activeStep === 2 && (
                  <div className="flex items-center gap-4 sm:gap-6 text-3xl sm:text-6xl font-black text-white mt-6">
                      <span className="text-emerald-400">400</span>
                      <span className="text-white/80">-</span>
                      <span className="text-rose-400">80</span>
                      <span className="text-white/50">=</span>
                      <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">320</span>
                  </div>
              )}
              {activeStep === 3 && (
                  <div className="flex items-center gap-3 sm:gap-5 text-xl sm:text-4xl font-black text-white mt-6">
                      <span className="text-white">New Value</span>
                      <span className="text-white/50">=</span>
                      <div className="flex items-center gap-3">
                          <span className="text-emerald-400 bg-emerald-900/40 px-3 py-1 rounded-lg">Original</span>
                          <span className="text-white/80">-</span>
                          <span className="text-rose-400 bg-rose-900/40 px-3 py-1 rounded-lg">Decrease</span>
                      </div>
                  </div>
              )}
              {activeStep === 4 && (
                  <div className="flex flex-col items-center gap-4 mt-6">
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">80</span>
                          <span className="text-white/80">-</span>
                          <span className="text-rose-400">(25% of 80)</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-5 text-3xl sm:text-5xl font-black text-white opacity-50">
                          <span className="text-emerald-400">80</span>
                          <span className="text-white/80">-</span>
                          <span className="text-rose-400">20</span>
                          <span className="text-white/50">=</span>
                          <span className="text-white">60</span>
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
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Decrease Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {appMode === 'concept' ? (
            <>
                {/* TOP PANEL - DIGITAL MATH BOARD */}
                <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[200px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center justify-center gap-2 opacity-50 text-[10px] sm:text-[12px] font-black uppercase tracking-widest leading-none text-white z-20">
                        <TrendingDown size={14} /> Digital Math Board
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
                            {/* PERSISTENT GENERAL FORMULA (Always visible if activeStep >= 3) */}
                            {activeStep >= 3 && (
                                <div className="bg-emerald-900/20 border-2 border-emerald-500/30 p-3 sm:p-4 rounded-xl flex flex-col items-center text-center shadow-inner shrink-0">
                                    <span className="text-emerald-300 font-black uppercase text-[9px] sm:text-[10px] tracking-widest mb-1.5 flex items-center gap-1">
                                        <TrendingDown size={12} /> The General Formula
                                    </span>
                                    <span className="text-white font-mono text-[12px] sm:text-[14px] font-black tracking-wider">
                                        New = Original - Decrease
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
                                           <span className="text-emerald-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white mb-4 shrink-0">
                                    <div className="bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><Percent size={14}/> Find The Percent</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-blue-500/30 shadow-inner">
                                        <span className="text-blue-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><Calculator size={14}/> Apply Formula</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px] text-blue-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><FastForward size={14}/> Result</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-xl text-emerald-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner shrink-0">
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
                  
                  <div className="bg-emerald-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-emerald-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully learned how to calculate percentage decreases!" 
                              : "You solved the Decrease challenges flawlessly!"}
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