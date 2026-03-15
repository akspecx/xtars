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
  Layers
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
    question: "What is the fundamental meaning of a Percentage?",
    teachingSteps: [
      { 
        id: "step-1",
        title: "The Meaning of Percent",
        explanation: "Step 1: Decode the word.\nThe word 'Cent' means 100. So, 'Percent' literally means 'out of every 100'.\n\nIf someone says you get 25%, it means if there are 100 items, you get exactly 25.",
        selectionPrompt: "Based on this, what does 25% mean?",
        options: ["25 out of 100", "100 out of 25", "25 added to 100"],
        correct: 0,
        feedback: [
          "Exactly! 25% simply means 25 out of every 100.",
          "You have the numbers backwards!",
          "Percent means a portion out of 100, not addition."
        ],
        why: "25% literally translates to getting 25 items from a total pool of 100 items."
      },
      { 
        id: "step-2",
        title: "Out of Just One",
        explanation: "Step 2: The 'Out of 1' Rule.\nIf you get 25 out of 100, how much do you get out of just 1 single item? To find out, we divide by 100.",
        selectionPrompt: "How do we write the fraction you get out of 1 item?",
        options: ["100 ÷ 25", "25 ÷ 100", "25 × 1"],
        correct: 1,
        feedback: [
          "The 100 must be on the bottom (the total pool).",
          "Yes! Out of 1 single item, you get a fraction: 25/100.",
          "That doesn't divide it down to a single unit's share."
        ],
        why: "If 100 items yield 25, then 1 item yields 25 ÷ 100. This is the unitary method!"
      },
      { 
        id: "step-3",
        title: "Scaling to Any Number",
        explanation: "Step 3: Scaling Up.\nNow we know that for every 1 item, your share is the fraction (25/100).\n\nWhat if the total quantity is 8 instead of 1?",
        selectionPrompt: "If out of 1 you get (25/100), how do you find what you get out of 8?",
        options: ["Add 8", "Divide by 8", "Multiply by 8"],
        correct: 2,
        feedback: [
          "Adding won't scale the fraction properly.",
          "Dividing would make your share even smaller!",
          "Exactly! You multiply the 'out of 1' fraction by 8."
        ],
        why: "If 1 unit gives you 25/100, then 8 units will give you 8 times that amount."
      },
      { 
        id: "step-4",
        title: "Solving the Equation",
        explanation: "Step 4: The Final Calculation.\nYou've built the equation! To find 25% of 8, you calculate: (25/100) × 8.\n\nHint: 25/100 simplifies to 1/4. What is a quarter of 8?",
        selectionPrompt: "Solve the equation: (25 ÷ 100) × 8",
        options: ["It equals 2", "It equals 4", "It equals 25"],
        correct: 0,
        feedback: [
          "Perfect! 8 divided by 4 is exactly 2.",
          "Check your math again: 8 / 4.",
          "25 is the percentage, not the final answer!"
        ],
        why: "By breaking it down to 'out of 1', we easily calculated that 25% of 8 is 2."
      },
      { 
        id: "step-5",
        title: "The Universal Formula",
        explanation: "Step 5: The General Rule.\nNotice what we just did. To find ANY percentage of a number:\n\n1. Find what it is out of 1: (Percent / 100)\n2. Multiply by your target number.",
        selectionPrompt: "What is the universal formula for finding P% of N?",
        options: ["(100 ÷ P) × N", "(P × 100) + N", "(P ÷ 100) × N"],
        correct: 2,
        feedback: [
          "The Percent goes on top!",
          "We use division and multiplication, not addition.",
          "Yes! This formula works perfectly for every percentage problem."
        ],
        why: "P% of N is always (P ÷ 100) × N."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Per-Cent", explanation: "Percent literally means 'out of 100'.", text: "25% = 25 out of 100" },
      { id: 2, step: 1, concept: "Out of 1", explanation: "Divide by 100 to find what the share is out of a single 1 unit.", text: "Out of 1 = 25/100" },
      { id: 3, step: 2, concept: "Scale Up", explanation: "Multiply that fraction by your total target quantity.", text: "Multiply by Total" },
      { id: 4, step: 3, concept: "The Universal Rule", explanation: "Value = (Percent ÷ 100) × Target Number.", text: "(P/100) × N" }
    ]
  },
  practice: {
    question: "Apply the fundamental 'Out of 1' logic to solve these puzzles!",
    quiz: [
      { 
        q: "If 40% means '40 out of 100', what fraction represents the portion you get out of exactly 1 unit?", 
        options: ["40 ÷ 100", "100 ÷ 40", "40 × 100"], 
        correct: 0, 
        explanation: "To find the value out of 1, you divide the percentage by 100. So, it is 40/100.",
        breakdown: { logic: "40 out of 100", calculation: "Divide by 100", jump: "40 ÷ 100" }
      },
      { 
        q: "You know 40% means (40/100) out of 1 single item. How would you calculate the share out of a total of 50 items?", 
        options: ["(40 ÷ 100) + 50", "(40 ÷ 100) × 50", "40 × 50"], 
        correct: 1, 
        explanation: "If 1 item gives you 40/100, then 50 items give you 50 times that amount: (40/100) * 50.",
        breakdown: { logic: "Share for 1 = 40/100", calculation: "Multiply by 50 items", jump: "(40 ÷ 100) × 50" }
      },
      { 
        q: "Solve it: What is the exact value of 40% of 50?", 
        options: ["20", "40", "200"], 
        correct: 0, 
        explanation: "(40/100) * 50. Simplify 40/100 to 4/10. Then 4/10 * 50 = 20.",
        breakdown: { logic: "(40 ÷ 100) × 50", calculation: "(4 ÷ 10) × 50", jump: "20" }
      },
      { 
        q: "If 5% means 5 out of 100, how do you write the equation to find 5% of 200?", 
        options: ["(5 ÷ 100) × 200", "5 × 200", "(100 ÷ 5) × 200"], 
        correct: 0, 
        explanation: "Find the value out of 1 (5/100), then multiply by the total (200).",
        breakdown: { logic: "Out of 1 = 5/100", calculation: "Multiply by 200", jump: "(5 ÷ 100) × 200" }
      },
      { 
        q: "What is the final value of 5% of 200?", 
        options: ["10", "100", "20"], 
        correct: 0, 
        explanation: "(5/100) * 200. The 200 divided by 100 is 2. So, 5 * 2 = 10.",
        breakdown: { logic: "(5 ÷ 100) × 200", calculation: "5 × 2", jump: "10" }
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
          <div className="flex flex-col items-center justify-center w-full h-full relative">
              <div className="absolute top-0 sm:top-2 w-full text-center">
                  <h3 className="text-white/50 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">
                      Step {activeStep + 1}: {LOGIC_DATA.concept.teachingSteps[activeStep].title}
                  </h3>
              </div>

              {activeStep === 0 && (
                  <div className="flex flex-col items-center gap-3 mt-6">
                      <span className="text-yellow-400 text-4xl sm:text-6xl font-black">25%</span>
                      <span className="text-white/50 text-xl sm:text-3xl">=</span>
                      <span className="text-emerald-400 text-3xl sm:text-5xl font-black drop-shadow-md">25 out of 100</span>
                  </div>
              )}
              {activeStep === 1 && (
                  <div className="flex flex-col items-center gap-3 mt-6">
                      <span className="text-white text-2xl sm:text-4xl font-black tracking-wider">Out of 1</span>
                      <span className="text-white/50 text-xl sm:text-2xl">=</span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-3 sm:px-6 text-4xl sm:text-6xl font-black drop-shadow-md">25</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-3 sm:px-6 text-4xl sm:text-6xl font-black drop-shadow-md">100</span>
                      </div>
                  </div>
              )}
              {activeStep === 2 && (
                  <div className="flex items-center gap-4 sm:gap-8 mt-6">
                      <span className="text-white text-3xl sm:text-5xl font-black text-center leading-none">
                          Out of<br/><span className="text-yellow-400">8</span> =
                      </span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-3 sm:px-5 text-4xl sm:text-6xl font-black drop-shadow-md">25</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-3 sm:px-5 text-4xl sm:text-6xl font-black drop-shadow-md">100</span>
                      </div>
                      <span className="text-white/50 text-3xl sm:text-5xl">×</span>
                      <span className="text-yellow-400 text-4xl sm:text-7xl font-black">8</span>
                  </div>
              )}
              {activeStep === 3 && (
                  <div className="flex items-center gap-3 sm:gap-6 mt-6">
                      <div className="flex flex-col items-center opacity-50">
                          <span className="text-emerald-400 border-b-2 sm:border-b-4 border-white/30 pb-1 px-2 text-2xl sm:text-4xl font-black">25</span>
                          <span className="text-sky-400 pt-1 px-2 text-2xl sm:text-4xl font-black">100</span>
                      </div>
                      <span className="text-white/50 text-xl sm:text-3xl">×</span>
                      <span className="text-yellow-400 text-2xl sm:text-4xl font-black opacity-50">8</span>
                      <span className="text-white/50 text-3xl sm:text-5xl">=</span>
                      <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)] text-6xl sm:text-8xl font-black">2</span>
                  </div>
              )}
              {activeStep === 4 && (
                  <div className="flex items-center gap-3 sm:gap-6 mt-6">
                      <span className="text-yellow-400 text-3xl sm:text-5xl font-black tracking-tight">P% of N</span>
                      <span className="text-white/50 text-3xl sm:text-5xl">=</span>
                      <div className="flex flex-col items-center">
                          <span className="text-emerald-400 border-b-4 sm:border-b-8 border-white/30 pb-1 sm:pb-2 px-3 sm:px-5 text-3xl sm:text-5xl font-black drop-shadow-md">P</span>
                          <span className="text-sky-400 pt-1 sm:pt-2 px-3 sm:px-5 text-3xl sm:text-5xl font-black drop-shadow-md">100</span>
                      </div>
                      <span className="text-white/50 text-3xl sm:text-5xl">×</span>
                      <span className="text-white text-4xl sm:text-6xl font-black">N</span>
                  </div>
              )}
          </div>
      );
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Foundation Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {appMode === 'concept' ? (
            <>
                {/* TOP PANEL - DIGITAL MATH BOARD */}
                <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[200px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center justify-center gap-2 opacity-50 text-[10px] sm:text-[12px] font-black uppercase tracking-widest leading-none text-white z-20">
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
                                        <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><DivideSquare size={14}/> Find the 1 Unit Share</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[15px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 rounded-xl border border-blue-500/30 shadow-inner">
                                        <span className="text-blue-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1.5"><Calculator size={14}/> Scale Up</span>
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
                              ? "You've successfully learned the fundamental meaning of percentage!" 
                              : "You solved the foundation percentage challenges flawlessly!"}
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