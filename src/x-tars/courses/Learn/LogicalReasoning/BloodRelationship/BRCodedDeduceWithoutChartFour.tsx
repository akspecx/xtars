import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  BookOpen,
  UserCircle,
  User,
  Check,
  Zap,
  Baby,
  ChevronRight,
  GitBranch,
  ArrowRight,
  MousePointer2,
  X,
  Square,
  CheckSquare,
  Info,
  RefreshCw,
  Search,
  Key,
  Heart,
  Sparkles,
  Target,
  XCircle,
  CheckCircle2,
  Filter,
  Pencil
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================

const NOTATION_LEGEND = [
  { code: "A + B", meaning: "A is Father of B (+1 Gap)", genderA: "M" },
  { code: "A - B", meaning: "A is Brother of B (0 Gap)", genderA: "M" },
  { code: "A % B", meaning: "A is Wife of B (0 Gap)", genderA: "F" },
  { code: "A x B", meaning: "A is Mother of B (+1 Gap)", genderA: "F" }
];

const fullConceptString = "Which expression shows that M is the maternal grandmother of T?";

const CONCEPT_PROTOCOLS = [
  {
    id: "step-0",
    tab: "Speed Hacks",
    title: "Reverse Deduction",
    highlight: "",
    definition: "Target: M is the Maternal Grandmother of T.",
    logicPoints: [
      "SECRET HACK: Do NOT draw family trees for all 4 options! It wastes too much time.",
      "Instead, we use two powerful mathematical filters to eliminate wrong options instantly.",
      "Let's learn the Gender Check and the Generation Gap check."
    ],
    visual: { type: 'option-testing', step: 0 }
  },
  {
    id: "step-1",
    tab: "Trick 1",
    title: "Trick 1: Gender Check",
    highlight: "",
    definition: "Filter by the required gender of the target person.",
    logicPoints: [
      "A Maternal Grandmother MUST be Female (F).",
      "We check the symbol immediately following 'M' to find M's gender.",
      "If the symbol makes M a male (like '+' for Father or '-' for Brother), we instantly eliminate that option without drawing anything!"
    ],
    visual: { type: 'option-testing', step: 1 }
  },
  {
    id: "step-2",
    tab: "Trick 2",
    title: "Trick 2: Generation Gap",
    highlight: "",
    definition: "Calculate the mathematical generation distance.",
    logicPoints: [
      "Assign a number to every symbol: Parents = +1, Grandparents = +2, Siblings/Spouses = 0.",
      "A Grandmother is exactly 2 generations above (+2).",
      "We add the numbers between M and T. If the total is NOT +2, we eliminate the option instantly!"
    ],
    visual: { type: 'option-testing', step: 2 }
  },
  {
    id: "step-3",
    tab: "Tie-Breaker",
    title: "The Tie-Breaker",
    highlight: "",
    definition: "What if multiple options survive the filters?",
    logicPoints: [
      "Sometimes, two options might both show M is Female AND have a +2 Gap.",
      "TIE-BREAKER: This is the ONLY time you should draw a family chart.",
      "Once you narrow it down, draw the tree for the surviving options to validate the exact relationship."
    ],
    visual: { type: 'option-testing', step: 3 }
  },
  {
    id: "step-4",
    tab: "Option 1",
    title: "Test Option 1",
    highlight: "M x N % S + T",
    definition: "Testing: M x N % S + T",
    logicPoints: [
      "Gender Check: 'M x' means M is a Mother (F). PASS!",
      "Gap Check: x(+1) + %(0) + +(+1) = +2 Gap. PASS!",
      "Tie-Breaker Verification: N is wife of S, S is father of T -> N is Mother. M is Mother of N -> Maternal Grandmother. CORRECT!"
    ],
    visual: { type: 'option-testing', step: 4 }
  },
  {
    id: "step-5",
    tab: "Option 2",
    title: "Test Option 2",
    highlight: "M x N - S % T",
    definition: "Testing: M x N - S % T",
    logicPoints: [
      "Option 1 was right, but let's see why Option 2 fails.",
      "Gender Check: 'M x' means M is a Mother (F). PASS!",
      "Gap Check: x(+1) + -(0) + %(0) = +1 Gap. FAIL!",
      "Eliminated instantly without drawing a tree! A Grandmother requires a +2 Gap."
    ],
    visual: { type: 'option-testing', step: 5 }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Trial 1: The Paternal Uncle",
    objective: "Which expression proves P is the Paternal Uncle of S?",
    options: [
      "P + Q - R % S",
      "P - Q + R - S",
      "P x Q - R + S",
      "P % Q + R x S"
    ],
    clues: [
      "Trick 1: An Uncle must be Male. Check the symbol after P.",
      "Trick 2: An Uncle is +1 Generation above S.",
      "If multiple pass, draw the tree to break the tie!"
    ],
    correct: 1,
    explanation: "Trick 1: P must be Male. Options 3 & 4 make P Female (x, %). Trick 2: Uncle is +1 Gen. Opt 1: +1+0+0=+1. Opt 2: 0+1+0=+1. Tie-breaker (Draw it): In Opt 2, P is brother to Q (Father of R/S), making P the Paternal Uncle!"
  },
  {
    mission: "Trial 2: The Maternal Grandfather",
    objective: "Which expression proves A is the Maternal Grandfather of D?",
    options: [
      "A + B - C x D",
      "A x B + C - D",
      "A - B + C + D",
      "A % B x C - D"
    ],
    clues: [
      "Trick 1: A Grandfather must be Male.",
      "Trick 2: A Grandfather is exactly +2 Generations above D."
    ],
    correct: 0,
    explanation: "Trick 1: Grandfather is Male (Eliminate 2 & 4). Trick 2: Grandfather is +2. Opt 1: Father(+1) + Brother(0) + Mother(+1) = +2. Draw to verify: A is father of C (Mother of D), making A the Maternal Grandfather!"
  },
  {
    mission: "Trial 3: The Sister-in-Law",
    objective: "Which expression proves W is the Sister-in-Law of Z?",
    options: [
      "W % X + Y - Z",
      "W x X - Y % Z",
      "W - X % Y + Z",
      "W % X - Y - Z"
    ],
    clues: [
      "Trick 1: A Sister-in-Law must be Female.",
      "Trick 2: A Sister-in-Law sits on the SAME generation tier (0 Gap)."
    ],
    correct: 3,
    explanation: "Trick 1: W must be Female (Eliminate 3). Trick 2: Sister-in-Law is 0 Gap. Opt 1 is +1. Opt 2 is +1. Opt 4: Wife(0) + Brother(0) + Brother(0) = 0. Option 4 is the only one mathematically possible!"
  },
  {
    mission: "Trial 4: The Aunt",
    objective: "Which expression proves Q is the Aunt of M?",
    options: [
      "Q + R - M",
      "Q % R + M",
      "Q % R - S + M",
      "Q x R - M"
    ],
    clues: [
      "Trick 1: An Aunt must be Female.",
      "Trick 2: An Aunt is +1 Generation above M."
    ],
    correct: 2,
    explanation: "Trick 1: Q must be Female (Eliminate 1). Trick 2: Aunt is +1. Opt 2, 3, 4 all have +1 gap. Tie-breaker (Draw them): Opt 2 & 4 make Q the direct Mother. Opt 3 makes Q the wife of M's uncle, making her the Aunt!"
  },
  {
    mission: "Trial 5: The Mother-in-Law",
    objective: "Which expression proves R is the Mother-in-Law of U?",
    options: [
      "R + S % T + U",
      "R x S - T + U",
      "R x S % U",
      "R % S + U"
    ],
    clues: [
      "Trick 1: A Mother-in-Law must be Female.",
      "Trick 2: A Mother-in-Law is exactly +1 Generation above U."
    ],
    correct: 2,
    explanation: "Trick 1: R must be Female (Eliminate 1). Trick 2: Mother-in-Law is +1. Opt 2 is +2. Opt 3 is +1 (Mother(+1) + Wife(0)). Opt 4 is +1. Tie-breaker: Opt 4 makes R the direct mother. Opt 3 makes R mother of S, and S is wife of U. R is U's Mother-in-Law!"
  }
];

// ==========================================
// RENDER COMPONENTS
// ==========================================

const HighlightedString = ({ fullString, highlight }) => {
  if (!highlight || !fullString.includes(highlight)) return <span>{fullString}</span>;
  const parts = fullString.split(highlight);
  return (
    <span className="leading-relaxed">
      {parts[0]}
      <span className="bg-amber-400 text-black px-1.5 py-0.5 mx-0.5 rounded shadow-sm">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </span>
  );
};

export function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeTab, setActiveTab] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  
  const handleReset = () => {
    setActiveTab(0);
    setPracticeStep(0);
    setQuizFeedback(null);
    setShowExplanation(false);
    setLessonFinished(false);
  };

  const handleQuizSelection = (idx) => {
    const task = PRACTICE_TASKS[practiceStep];
    const isCorrect = idx === task.correct;
    setQuizFeedback({ selected: idx, isCorrect });
    if (isCorrect) setShowExplanation(true);
  };

  const goToPracticeStep = (stepIndex) => {
    setPracticeStep(stepIndex);
    setQuizFeedback(null);
    setShowExplanation(false);
  };

  const prevPracticeTask = () => {
    if (practiceStep > 0) goToPracticeStep(practiceStep - 1);
  };

  const skipPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  const nextPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#0f0a09] font-sans select-none overflow-hidden text-[#a88a6d] overscroll-none">
      
      {/* HEADER */}
      <header className="w-full shrink-0 p-2 sm:p-3 bg-[#0f0a09]/95 border-b border-white/5 shadow-sm z-[100]">
        <div className="w-full max-w-7xl mx-auto bg-[#1a0f0d] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
            <div className="flex flex-col items-start leading-tight px-1 sm:px-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[8px] sm:text-[10px]">
                    <ChevronLeft size={10} sm:size={12} /> Dashboard
                </button>
                <span className="text-white font-black uppercase text-[12px] sm:text-[16px] tracking-tight flex items-center gap-1.5 sm:gap-2 mt-0.5">
                    <Search size={14} className="text-amber-400 sm:w-[18px] sm:h-[18px]" /> {appMode === 'concept' ? "Speed Deductions" : "Testing Lab"}
                </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
                    <button onClick={() => { setAppMode('concept'); handleReset(); }} className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[9px] sm:text-[12px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
                    <button onClick={() => { setAppMode('practice'); handleReset(); }} className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[9px] sm:text-[12px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
                </div>
                <button onClick={handleReset} className="p-1.5 sm:p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all shadow-md"><RotateCcw size={14} sm:size={16} /></button>
            </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA - FLUID FLEX LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-2 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.4] lg:flex-[1.6] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col overflow-hidden min-h-0">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            {/* PERSISTENT TARGET STRING HEADER */}
            {!lessonFinished && (
                <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 bg-[#1a110f] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl w-11/12 max-w-[340px] sm:max-w-[580px]">
                    <div className="flex items-center gap-1 sm:gap-2 text-emerald-400">
                        <Target size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-center">
                            {appMode === 'concept' ? "Which expression is correct?" : PRACTICE_TASKS[practiceStep].objective}
                        </span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10 my-0.5 sm:my-1"></div>
                    <span className="font-mono text-[10px] sm:text-[12px] lg:text-[14px] text-white font-bold tracking-widest flex flex-wrap justify-center items-center text-center leading-relaxed">
                      {appMode === 'concept' 
                        ? <span className="text-emerald-400 text-center">{fullConceptString}</span>
                        : <span className="text-yellow-400 text-center">"Use Math Hacks to eliminate options!"</span>
                      }
                    </span>
                </div>
            )}

            <div className="w-full h-full flex flex-col items-center justify-center pt-16 sm:pt-20 pb-2 px-2 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {!lessonFinished ? (
                   <motion.div 
                    key={`${appMode}-${activeTab}-${practiceStep}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                   >
                     {appMode === 'concept' ? (
                       <TreeVisual data={CONCEPT_PROTOCOLS[activeTab].visual} />
                     ) : (
                       <div className="w-full h-full flex flex-col items-center justify-center gap-4 w-full max-w-lg mx-auto">
                            {/* MULTIPLE CHOICE UI FOR PRACTICE */}
                            <div className="bg-[#1a110f] p-4 sm:p-6 rounded-[2rem] border border-white/5 shadow-inner w-full flex flex-col gap-3">
                                {PRACTICE_TASKS[practiceStep].options.map((opt, i) => {
                                    const isSelected = quizFeedback?.selected === i;
                                    const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].correct;
                                    let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400 shadow-emerald-500/20" : "bg-rose-600 border-rose-400 shadow-rose-500/20") : "bg-[#2a1a16] border-white/10 text-white/80";
                                    if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20";
                                    
                                    return (
                                        <button 
                                            key={i} 
                                            disabled={quizFeedback?.isCorrect} 
                                            onClick={() => handleQuizSelection(i)} 
                                            className={`p-4 sm:p-5 rounded-2xl font-mono font-black uppercase transition-all text-[12px] sm:text-sm border-2 flex justify-between items-center ${btnClass} ${!quizFeedback ? 'hover:bg-[#3e2723] hover:border-white/30 hover:scale-[1.01]' : ''}`}
                                        >
                                            <span className="tracking-widest">{opt}</span>
                                            {quizFeedback && isCorrectIdx && <CheckCircle2 size={20} className="text-white" />}
                                            {isSelected && !quizFeedback.isCorrect && <XCircle size={20} className="text-white" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* FEEDBACK & EXPLANATION */}
                            {quizFeedback && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-2">
                                    {showExplanation && quizFeedback.isCorrect && (
                                        <div className="bg-emerald-900/40 border border-emerald-500/50 p-4 rounded-2xl shadow-inner text-emerald-100 text-[10px] sm:text-xs font-bold leading-relaxed">
                                            {PRACTICE_TASKS[practiceStep].explanation}
                                        </div>
                                    )}
                                    <div className="flex gap-2 w-full">
                                        {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-black text-xs uppercase shadow-md flex items-center justify-center gap-2 hover:bg-rose-500 transition-all border-b-4 border-rose-800"><RefreshCw size={14} /> Try Again</button>}
                                        <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-3 text-white rounded-xl font-black text-xs uppercase shadow-md flex items-center justify-center gap-2 transition-all border-b-4 ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800' : 'bg-blue-600 hover:bg-blue-500 border-blue-800'}`}>
                                            {quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={14} />}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                       </div>
                     )}
                   </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Trophy size={80} className="text-yellow-400 animate-bounce drop-shadow-xl mb-4" />
                    <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">LOGIC CERTIFIED</h2>
                    <div className="flex flex-row gap-3 w-full justify-center max-w-sm">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 py-3 rounded-xl font-black uppercase text-[10px] sm:text-sm shadow-xl transition-all">
                            Restart
                        </button>
                        <button onClick={handleReset} className="flex-[1.5] bg-amber-400 text-black border-b-4 sm:border-b-6 border-amber-600 py-3 rounded-xl font-black uppercase text-[10px] sm:text-sm shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        {/* BOTTOM PANEL - LOGS & CONTROLS */}
        <div className="flex-[0.6] lg:flex-[0.8] w-full bg-[#1a0f0d] p-2 sm:p-3 rounded-[1.5rem] sm:rounded-[2rem] border-t-2 sm:border-t-4 border-b-[6px] sm:border-b-[8px] border-black shadow-2xl flex flex-col md:flex-row gap-2 min-h-0 overflow-hidden">
            
            {/* LEFT: MASTER LEGEND & CLUES */}
            <div className="flex-[1.2] flex flex-col bg-black/40 rounded-xl border border-white/10 p-2 sm:p-3 overflow-y-auto custom-scrollbar min-h-0">
                
                {/* COMPACT MASTER LEGEND */}
                <div className="bg-[#1a110f] p-2 sm:p-3 rounded-lg border border-white/5 mb-2 shadow-sm shrink-0">
                  <p className="text-amber-400 text-[10px] sm:text-xs uppercase tracking-widest mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                    <Key size={14} /> Code Legend
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {NOTATION_LEGEND.map((leg, i) => (
                      <div key={i} className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-white/5 whitespace-nowrap">
                        <span className="text-yellow-400 font-mono font-black">{leg.code.split(' ')[1]}</span>
                        <span className="text-white/80 font-bold">{leg.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC CONTENT */}
                {appMode === 'concept' ? (
                   <div className="space-y-2 mt-1 px-1">
                     <p className="text-white text-xs sm:text-sm lg:text-base font-black border-b border-white/5 pb-1 flex items-center gap-1.5 uppercase tracking-tighter"><GitBranch size={12} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-1 sm:space-y-1.5 text-white/80">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-1.5 text-left"><Check size={10} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white font-bold italic text-[9px] sm:text-[11px] lg:text-xs leading-snug tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-2 h-full mt-1">
                     <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                        <span className="text-orange-400 font-black text-[9px] sm:text-[11px] uppercase tracking-[0.15em] opacity-80">
                            {PRACTICE_TASKS[practiceStep].mission}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button onClick={prevPracticeTask} disabled={practiceStep === 0} className="p-1 bg-white/5 rounded border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all">
                                <ChevronLeft size={12} className="text-orange-400" />
                            </button>
                            <button onClick={skipPracticeTask} className="p-1 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-all">
                                <ChevronRight size={12} className="text-orange-400" />
                            </button>
                        </div>
                     </div>
                     <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 mt-2">
                        {(PRACTICE_TASKS[practiceStep].clues || []).map((clue, i) => (
                            <div key={i} className="flex items-start gap-2 text-left text-white/60 text-[9px] sm:text-[11px] italic">
                                <Info size={12} className="shrink-0 mt-0.5 text-blue-400" />
                                <p className="leading-snug">{clue}</p>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
            </div>

            {/* RIGHT: INTERACTION / QUIZ */}
            <div className="flex-1 flex flex-col bg-[#2a1a16] rounded-xl border border-white/5 p-2 sm:p-3 overflow-hidden min-h-0 relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col justify-center gap-2 sm:gap-3">
                         <div className="flex flex-wrap justify-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 shrink-0">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-1 px-2 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeTab === i ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto custom-scrollbar">
                            <p className="text-white text-[10px] sm:text-xs font-bold leading-snug italic px-2 mb-2 sm:mb-4">Trace the deduction backward chunk by chunk.</p>
                            <button onClick={() => activeTab === CONCEPT_PROTOCOLS.length - 1 ? setAppMode('practice') : setActiveTab(prev => prev + 1)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-black uppercase text-[9px] sm:text-[11px] shadow-lg border-b-2 border-emerald-800 active:scale-95 transition-all">
                                {activeTab === CONCEPT_PROTOCOLS.length - 1 ? "Start Practice" : "Next Step"} <ArrowRight size={12} />
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="practice-ui" className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                         <Zap size={40} className="text-yellow-400 mb-4 animate-pulse opacity-80" />
                         <p className="text-white text-sm sm:text-base font-black mb-2 leading-relaxed uppercase tracking-widest">Select the Correct Option</p>
                         <p className="text-[#a88a6d] text-xs sm:text-sm font-bold px-2">Use the Gender and Gap checks to find the answer without drawing 4 different trees.</p>
                      </motion.div>
                    )
                  ) : (
                     <div className="flex items-center justify-center h-full">
                         <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Module Complete</span>
                     </div>
                  )}
                </AnimatePresence>
            </div>
          </div>
      </main>

      {/* STYLES FOR CUSTOM SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}

function TreeVisual({ data }) {
    if (data.type === 'option-testing') {
        const { step } = data;

        const optionsList = [
            { id: 4, text: "1. M x N % S + T", isCorrect: true },
            { id: 5, text: "2. M x N - S % T", isCorrect: false },
            { id: 6, text: "4. M x N x S % T", isCorrect: false } // Only showing 3 for visual simplicity
        ];

        let activeOptId = 0;
        if (step === 4) activeOptId = 4;
        if (step === 5) activeOptId = 5;

        const EvalRow = ({ title, value, status }) => (
            <div className="flex justify-between items-center bg-black/40 p-2 sm:p-3 rounded-lg border border-white/5 w-full">
                <span className="text-white/70 font-bold text-[9px] sm:text-[11px] uppercase tracking-wider">{title}</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-white font-mono font-black text-[10px] sm:text-xs">{value}</span>
                    {status === 'pass' && <CheckCircle2 size={14} className="text-emerald-400" />}
                    {status === 'fail' && <XCircle size={14} className="text-rose-400" />}
                    {status === 'warn' && <Pencil size={14} className="text-yellow-400" />}
                </div>
            </div>
        );

        return (
            <div className="relative w-full h-full flex flex-col justify-start p-2 sm:p-4 overflow-y-auto no-scrollbar">
                
                {step === 0 && (
                   <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <Filter size={64} className="text-emerald-400 mb-6 animate-pulse opacity-80" />
                      <p className="font-black text-xl sm:text-2xl uppercase tracking-widest mb-4 text-white">Reverse Deduction</p>
                      <p className="text-[#a88a6d] text-sm font-bold leading-relaxed max-w-sm">Use math to eliminate wrong options instantly instead of drawing every single family tree!</p>
                   </motion.div>
                )}

                {step === 1 && (
                   <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center h-full p-2 text-center w-full max-w-md mx-auto">
                      <p className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6 text-emerald-400">Gender Check Filter</p>
                      <div className="flex flex-col gap-4 w-full">
                          <div className="bg-rose-900/40 border-2 border-rose-500/50 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                              <span className="text-white font-bold text-sm">M <span className="text-yellow-400 font-black">+</span> N (Father)</span>
                              <span className="text-rose-400 font-black uppercase text-sm flex items-center gap-2">Male <XCircle size={16} /></span>
                          </div>
                          <div className="bg-emerald-900/40 border-2 border-emerald-500/50 p-4 rounded-2xl flex justify-between items-center shadow-lg">
                              <span className="text-white font-bold text-sm">M <span className="text-yellow-400 font-black">x</span> N (Mother)</span>
                              <span className="text-emerald-400 font-black uppercase text-sm flex items-center gap-2">Female <CheckCircle2 size={16} /></span>
                          </div>
                      </div>
                      <p className="text-[#a88a6d] text-xs font-bold mt-6 px-4">Grandmothers must be Female. If the symbol makes M a male, eliminate it immediately!</p>
                   </motion.div>
                )}

                {step === 2 && (
                   <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center h-full p-2 text-center w-full max-w-md mx-auto">
                      <p className="font-black text-lg sm:text-xl uppercase tracking-widest mb-6 text-blue-400">Generation Gap Filter</p>
                      <div className="flex flex-col gap-2 w-full text-xs sm:text-sm font-mono font-black">
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10"><span className="text-white">Grandparents</span><span className="text-emerald-400 bg-emerald-900/50 px-3 py-1 rounded-full">+2</span></div>
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10"><span className="text-white">Parents</span><span className="text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full">+1</span></div>
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10"><span className="text-white">Siblings / Spouses</span><span className="text-stone-400 bg-stone-800/50 px-3 py-1 rounded-full">0</span></div>
                          <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/10"><span className="text-white">Children</span><span className="text-rose-400 bg-rose-900/50 px-3 py-1 rounded-full">-1</span></div>
                      </div>
                      <p className="text-[#a88a6d] text-xs font-bold mt-6 px-4">Add the numbers across the string. A Grandmother must exactly equal <span className="text-emerald-400">+2</span>.</p>
                   </motion.div>
                )}

                {step === 3 && (
                   <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center justify-center h-full p-2 text-center w-full max-w-md mx-auto">
                      <Pencil size={64} className="text-yellow-400 mb-6 animate-pulse opacity-80" />
                      <p className="font-black text-xl sm:text-2xl uppercase tracking-widest mb-4 text-white">The Tie-Breaker</p>
                      <p className="text-[#a88a6d] text-sm font-bold leading-relaxed max-w-sm">If multiple options pass BOTH the Gender AND Gap checks, <span className="text-yellow-400">THEN</span> you draw a quick family tree for those specific options to confirm the exact relation.</p>
                   </motion.div>
                )}

                {step >= 4 && (
                    <>
                        <div className="grid grid-cols-1 gap-2 sm:gap-3 mb-4 w-full mt-2">
                            {optionsList.map(opt => {
                                const isActive = activeOptId === opt.id;
                                const isEvaluated = step > opt.id; 
                                let bgClass = "bg-[#1a110f] border-white/10 text-white/50";
                                
                                if (isActive) {
                                    bgClass = "bg-indigo-900/40 border-indigo-400 text-white shadow-lg scale-[1.02] shadow-indigo-500/20";
                                } else if (isEvaluated) {
                                    if (opt.id === 4) bgClass = "bg-emerald-900/40 border-emerald-500 text-emerald-100 shadow-lg shadow-emerald-500/20"; // Keep option 1 green
                                    else bgClass = "bg-rose-900/40 border-rose-500/50 text-rose-200 opacity-60";
                                }

                                return (
                                    <div key={opt.id} className={`p-2.5 sm:p-3 rounded-xl border-2 transition-all duration-300 ${bgClass} flex items-center justify-between`}>
                                        <span className="font-mono font-black text-[10px] sm:text-xs tracking-wider">{opt.text}</span>
                                        {((opt.id === 4 && step >= 4) || (isActive && opt.isCorrect)) && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                                        {((isEvaluated && opt.id !== 4) || (isActive && !opt.isCorrect && step > 0)) && <XCircle size={16} className="text-rose-400 shrink-0" />}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Evaluation Panel */}
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={`eval-${step}`}
                                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                className="bg-[#2a1a16] border-2 border-white/10 rounded-2xl p-3 sm:p-5 shadow-inner flex flex-col gap-2 sm:gap-3 w-full mt-auto"
                            >
                                <span className="text-white/50 font-black uppercase text-[8px] sm:text-[10px] tracking-widest text-center border-b border-white/10 pb-2 mb-1">Live Evaluation</span>
                                
                                {step === 4 && (
                                    <>
                                        <EvalRow title="Gender Check (M)" value="M is Mother (F)" status="pass" />
                                        <EvalRow title="Generation Gap" value="x(+1) + %(0) + +(+1) = +2" status="pass" />
                                        <EvalRow title="Tie-Breaker Verify" value="M is Maternal Grandmother!" status="pass" />
                                    </>
                                )}
                                {step === 5 && (
                                    <>
                                        <EvalRow title="Gender Check (M)" value="M is Mother (F)" status="pass" />
                                        <EvalRow title="Generation Gap" value="x(+1) + -(0) + %(0) = +1" status="fail" />
                                        <div className="text-center text-rose-400 font-bold text-[10px] sm:text-xs mt-1">❌ Eliminated Instantly: Needs +2 Gap!</div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </div>
        );
    }

    return null;
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }