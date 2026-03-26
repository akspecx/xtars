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
  Receipt,
  ShoppingBag,
  Coins,
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
    question: "Objective: Aryan bought items worth ₹30. Out of this, 60 paise (₹0.60) went to sales tax. The tax rate is 5%. What is the cost of the tax-free items?",
    teachingSteps: [
      { 
        id: "step-1",
        title: "1) Remove the tax",
        explanation: "Principle 1: The total money handed to the cashier (₹30) includes the cost of the items PLUS the tax.\n\nTo find the true cost of just the items, we must remove the tax completely from the total amount.",
        selectionPrompt: "Calculate: Total Spent (30) - Tax Paid (0.60). What is the Total Items Cost?",
        options: ["₹30.60", "₹29.40", "₹29.60"],
        correct: 1,
        feedback: [
          "We must subtract the tax, not add it!",
          "Correct! 30.00 - 0.60 = 29.40.",
          "Check your subtraction carefully."
        ],
        why: "Total Items Cost = Total Spent (30) - Tax (0.60) = 29.40."
      },
      { 
        id: "step-2",
        title: "2) Form Tax Equation",
        explanation: "Principle 2: Sales tax is ONLY charged on 'Taxable Items'. Let the price of these taxable items be 'X'.\n\nWe know the tax rate is 5%. Therefore, 5% of X equals the tax paid (₹0.60).\n\nMathematically: X * (5 / 100) = 0.60",
        selectionPrompt: "Using algebra, how do we rearrange this equation to solve for X?",
        options: ["X = 0.60 / (5 / 100)", "X = 0.60 * (5 / 100)", "X = 0.60 + 5"],
        correct: 0,
        feedback: [
          "Exactly! To isolate X, we divide 0.60 by the percentage (5/100).",
          "Multiplying won't isolate X correctly on the other side of the equation.",
          "We don't add percentages and currency together."
        ],
        why: "Taxable Cost (X) = Tax Amount ÷ Tax Rate."
      },
      { 
        id: "step-3",
        title: "2) Calculate Taxable",
        explanation: "Now, let's solve the equation to find the exact cost of the taxable items.\n\nEquation: X = 0.60 / (5 / 100)\nSince 5/100 is 0.05, the equation becomes: X = 0.60 / 0.05",
        selectionPrompt: "Calculate: 0.60 ÷ 0.05. What is X (the cost of the Taxable Items)?",
        options: ["₹3", "₹12", "₹30"],
        correct: 1,
        feedback: [
          "That's 0.60 * 5.",
          "Spot on! 0.60 ÷ 0.05 = 12.",
          "Too high!"
        ],
        why: "X = 12. The taxable items cost exactly ₹12.00."
      },
      { 
        id: "step-4",
        title: "3) Find Non-Taxable",
        explanation: "Principle 3: The 'Total Items Cost' we found in Step 1 is made of two parts: Taxable Items + Non-Taxable Items.\n\nWe know:\nTotal Items Cost = ₹29.40\nTaxable Items Cost = ₹12.00",
        selectionPrompt: "How do we isolate the actual Non-Taxable items?",
        options: ["29.40 - 12.00", "30.00 - 12.00", "29.40 + 12.00"],
        correct: 0,
        feedback: [
          "Perfect! Subtract the Taxable Cost from the Total Items Cost.",
          "You must subtract from the items cost (29.40), not the total spent with tax (30).",
          "Adding them would give a number higher than the total spent!"
        ],
        why: "Non-Taxable Cost = Total Items Cost - Taxable Cost."
      },
      { 
        id: "step-5",
        title: "3) Solve It",
        explanation: "Let's complete the final calculation.\n\nSubtract the taxable cost (12.00) from the total items cost (29.40).",
        selectionPrompt: "Calculate: 29.40 - 12.00. What is the cost of the tax-free (non-taxable) items?",
        options: ["₹16.40", "₹18.00", "₹17.40"],
        correct: 2,
        feedback: [
          "Check your subtraction!",
          "That's 30 - 12.",
          "Exactly! 29.40 - 12.00 = 17.40."
        ],
        why: "29.40 - 12 = 17.40. You found the exact tax-free cost by following the 3 core principles!"
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "1) Remove Tax", explanation: "Remove the tax from the total paid to find the true cost of the goods.", text: "Total - Tax = Items Cost" },
      { id: 2, step: 1, concept: "2) Set Equation", explanation: "Let Taxable Cost be X. Then X * (Rate/100) = Tax Amount.", text: "X * (Rate/100) = Tax" },
      { id: 3, step: 2, concept: "2) Find Taxable", explanation: "Solve for X by dividing the tax amount by the rate percentage.", text: "X = Tax ÷ Rate" },
      { id: 4, step: 3, concept: "3) Find Non-Taxable", explanation: "Subtract the taxable cost from the total items cost to isolate the non-taxable items.", text: "Items - Taxable" }
    ]
  },
  practice: {
    question: "Calculate the cost of the tax-free items using the strict 3-step logical breakdown!",
    quiz: [
      { 
        q: "Maya bought items for ₹40. The tax paid was 50 paise (₹0.50), and the tax rate is 10%. What is the cost of the tax-free items?", 
        options: ["₹34.50", "₹39.00", "₹35.00"], 
        correct: 0, 
        explanation: "Follow the 3 core principles step-by-step to find the non-taxable remainder.",
        explanationTable: [
            { step: "1) Remove Tax (Total Items Cost)", math: "= 40.00 - 0.50", result: "39.50" },
            { step: "2) Find Taxable (X * 10/100 = 0.50)", math: "X = 0.50 ÷ (10/100)", result: "5.00" },
            { step: "3) Find Non-Taxable", math: "= 39.50 - 5.00", result: "34.50" }
        ],
        breakdown: { logic: "1) Items: 40 - 0.50 = 39.50", calculation: "2) Taxable X = 0.50 / 0.10 = 5", jump: "₹34.50" }
      },
      { 
        q: "Rohan spent ₹60 at the store. He paid ₹1.20 in tax. If the tax rate is 6%, what was the cost of his tax-free items?", 
        options: ["₹40.00", "₹37.60", "₹38.80"], 
        correct: 2, 
        explanation: "Remove the tax, use algebra to find the taxable base (X), and subtract to isolate the tax-free items.",
        explanationTable: [
            { step: "1) Remove Tax (Total Items Cost)", math: "= 60.00 - 1.20", result: "58.80" },
            { step: "2) Find Taxable (X * 6/100 = 1.20)", math: "X = 1.20 ÷ (6/100)", result: "20.00" },
            { step: "3) Find Non-Taxable", math: "= 58.80 - 20.00", result: "38.80" }
        ],
        breakdown: { logic: "1) Items: 60 - 1.20 = 58.80", calculation: "2) Taxable X = 1.20 / 0.06 = 20", jump: "₹38.80" }
      },
      { 
        q: "Zara bought supplies for ₹100. The tax paid was ₹2.50 at a rate of 5%. What is the cost of the tax-free items?", 
        options: ["₹50.00", "₹47.50", "₹45.00"], 
        correct: 1, 
        explanation: "Never skip steps: Remove tax -> Calculate X -> Find difference.",
        explanationTable: [
            { step: "1) Remove Tax (Total Items Cost)", math: "= 100.00 - 2.50", result: "97.50" },
            { step: "2) Find Taxable (X * 5/100 = 2.50)", math: "X = 2.50 ÷ (5/100)", result: "50.00" },
            { step: "3) Find Non-Taxable", math: "= 97.50 - 50.00", result: "47.50" }
        ],
        breakdown: { logic: "1) Items: 100 - 2.50 = 97.50", calculation: "2) Taxable X = 2.50 / 0.05 = 50", jump: "₹47.50" }
      },
      { 
        q: "Kabir spent ₹45. The tax paid was 80 paise (₹0.80) at an 8% tax rate. What is the cost of his tax-free items?", 
        options: ["₹34.20", "₹35.00", "₹33.40"], 
        correct: 0, 
        explanation: "Set up the algebraic equation: X * 8% = 0.80. Then solve for X and subtract.",
        explanationTable: [
            { step: "1) Remove Tax (Total Items Cost)", math: "= 45.00 - 0.80", result: "44.20" },
            { step: "2) Find Taxable (X * 8/100 = 0.80)", math: "X = 0.80 ÷ (8/100)", result: "10.00" },
            { step: "3) Find Non-Taxable", math: "= 44.20 - 10.00", result: "34.20" }
        ],
        breakdown: { logic: "1) Items: 45 - 0.80 = 44.20", calculation: "2) Taxable X = 0.80 / 0.08 = 10", jump: "₹34.20" }
      },
      { 
        q: "Priya bought goods for ₹120. The tax paid was ₹3.00, and the tax rate is 12%. What is the cost of the tax-free items?", 
        options: ["₹90.00", "₹94.00", "₹92.00"], 
        correct: 2, 
        explanation: "Apply the 3 principles methodically.",
        explanationTable: [
            { step: "1) Remove Tax (Total Items Cost)", math: "= 120.00 - 3.00", result: "117.00" },
            { step: "2) Find Taxable (X * 12/100 = 3.00)", math: "X = 3.00 ÷ (12/100)", result: "25.00" },
            { step: "3) Find Non-Taxable", math: "= 117.00 - 25.00", result: "92.00" }
        ],
        breakdown: { logic: "1) Items: 120 - 3.00 = 117", calculation: "2) Taxable X = 3.00 / 0.12 = 25", jump: "₹92.00" }
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
                  <span className="text-[#3e2723]/50 font-black uppercase tracking-widest text-sm">Calculate Values</span>
              </div>
          );
      }

      // Concept Mode Dynamic Equations building up to the formula
      return (
          <div className="flex flex-col items-center justify-center w-full h-full relative">
              {/* Objective Banner */}
              <div className="absolute top-2 w-full text-center px-4">
                  <h3 className="text-emerald-400 font-black uppercase tracking-widest text-[9px] sm:text-[10px] bg-black/60 inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 shadow-sm leading-tight max-w-full">
                      {LOGIC_DATA.concept.question}
                  </h3>
              </div>

              {activeStep === 0 && (
                  <div className="flex flex-col items-center mt-6 gap-2">
                      <span className="text-white/50 text-[10px] sm:text-sm uppercase tracking-widest">1) Remove Tax (Total - Tax = Items)</span>
                      <div className="flex items-center gap-3 sm:gap-4 text-3xl sm:text-5xl font-black text-white">
                          <span className="text-white">₹30</span>
                          <span className="text-rose-400">-</span>
                          <span className="text-rose-400">₹0.60</span>
                          <span className="text-white/50">=</span>
                          <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">₹29.40</span>
                      </div>
                  </div>
              )}
              {activeStep === 1 && (
                  <div className="flex flex-col items-center mt-6 gap-2">
                      <span className="text-white/50 text-[10px] sm:text-sm uppercase tracking-widest">2) Form Equation (Let Taxable = X)</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-4xl font-black text-white">
                          <span className="text-emerald-400">X</span>
                          <span className="text-white/50">*</span>
                          <span className="text-yellow-400">(5/100)</span>
                          <span className="text-white/50">=</span>
                          <span className="text-rose-400">₹0.60</span>
                      </div>
                      <span className="text-emerald-400 text-sm mt-2">X = 0.60 ÷ (5/100)</span>
                  </div>
              )}
              {activeStep === 2 && (
                  <div className="flex flex-col items-center mt-6 gap-2">
                      <span className="text-white/50 text-[10px] sm:text-sm uppercase tracking-widest">2) Calculate Taxable (X)</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-3xl sm:text-5xl font-black text-white">
                          <span className="text-rose-400">0.60</span>
                          <span className="text-white/50">÷</span>
                          <span className="text-yellow-400">0.05</span>
                          <span className="text-white/50">=</span>
                          <span className="text-emerald-400 drop-shadow-md">X</span>
                      </div>
                      <span className="text-emerald-400 text-xl font-black mt-2">X = ₹12.00</span>
                  </div>
              )}
              {activeStep === 3 && (
                  <div className="flex flex-col items-center mt-6 gap-2">
                      <span className="text-white/50 text-[10px] sm:text-sm uppercase tracking-widest">3) Find Non-Taxable (Items - Taxable)</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">₹29.40</span>
                          <span className="text-rose-400">-</span>
                          <span className="text-yellow-400">₹12.00</span>
                          <span className="text-white/50">=</span>
                          <span className="text-blue-400 drop-shadow-md">?</span>
                      </div>
                  </div>
              )}
              {activeStep === 4 && (
                  <div className="flex flex-col items-center mt-6 gap-2">
                      <span className="text-white/50 text-[10px] sm:text-sm uppercase tracking-widest">3) Solve Final Difference</span>
                      <div className="flex items-center gap-3 sm:gap-5 text-2xl sm:text-5xl font-black text-white">
                          <span className="text-emerald-400">₹29.40</span>
                          <span className="text-rose-400">-</span>
                          <span className="text-yellow-400">₹12.00</span>
                          <span className="text-white/50">=</span>
                          <span className="text-blue-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.4)]">₹17.40</span>
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
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Tax & Tax-Free Analysis" : "Tax Logic Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {appMode === 'concept' ? (
            <>
                {/* TOP PANEL - DIGITAL MATH BOARD */}
                <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[160px] sm:min-h-[200px]">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center justify-center gap-2 opacity-50 text-[9px] sm:text-[11px] font-black uppercase tracking-widest leading-none text-white z-20">
                        <Receipt size={14} /> Digital Math Board
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
                        <div className="flex flex-col bg-[#2a1a16]/95 p-3 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden min-h-0 flex flex-col">
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
                                           <span className="text-emerald-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> {LOGIC_DATA.concept.teachingSteps[activeStep].title}</span>
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
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            
                            {/* PERMANENT NAVIGATION BUTTONS FOR CONCEPT MODE */}
                            <div className="flex gap-2 w-full mt-3 pt-3 border-t border-white/10 shrink-0">
                                <button onClick={prevStep} disabled={activeStep === 0} className={`py-3.5 px-4 rounded-xl font-black transition-all border-2 ${activeStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                    <ChevronLeft size={18} />
                                </button>

                                <button 
                                    disabled={!isQuizPassed}
                                    onClick={nextStep} 
                                    className={`flex-1 py-3.5 rounded-xl font-black uppercase text-[12px] sm:text-[14px] transition-all border-b-4 ${isQuizPassed ? 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-white/20 border-transparent cursor-not-allowed'}`}>
                                    {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Start Practice' : 'Next Step'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </>
        ) : (
            /* PRACTICE MODE LAYOUT: No Visualizer, Question Top, Explanation Bottom */
            <div className="w-full h-full flex flex-col gap-3 sm:gap-4 overflow-y-auto pb-2">
                
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
                                    {/* HTML Table for specific steps */}
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

                                    <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-xl text-emerald-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner flex flex-col sm:flex-row gap-4 items-center">
                                        <div className="flex-1">
                                            {currentQuizSet[quizStep]?.explanation}
                                        </div>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/10 flex flex-col items-center shrink-0 min-w-[150px]">
                                            <span className="text-emerald-400 text-[10px] uppercase tracking-widest mb-1">Final Result</span>
                                            <span className="text-2xl font-black text-white">{currentQuizSet[quizStep]?.breakdown.jump}</span>
                                        </div>
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
                              ? "You've successfully learned how to calculate tax-free and taxable portions!" 
                              : "You solved the mixed container challenges flawlessly!"}
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