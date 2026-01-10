import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  X as CloseIcon,
  Trophy,
  Calculator,
  CheckCircle2,
  Variable,
  ArrowRightLeft,
  BookOpen,
  Layers,
  GraduationCap
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const MISSIONS = [
  { id: 1, v: 'X', a: 3, b: 1, c: 10, op: '+', q: 'Find the Value of X:', options: ['X = 3', 'X = 9', 'X = 4'], correct: 0 },
  { id: 2, v: 'Y', a: 2, b: 4, c: 10, op: '+', q: 'Find the Value of Y:', options: ['Y = 5', 'Y = 3', 'Y = 7'], correct: 1 },
  { id: 3, v: 'A', a: 5, b: 2, c: 13, op: '-', q: 'Find the Value of A:', options: ['A = 3', 'A = 5', 'A = 2'], correct: 0 },
  { id: 4, v: 'B', a: 4, b: 6, c: 22, op: '+', q: 'Find the Value of B:', options: ['B = 8', 'B = 4', 'B = 16'], correct: 1 },
  { id: 5, v: 'Z', a: 6, b: 4, c: 20, op: '-', q: 'Find the Value of Z:', options: ['Z = 4', 'Z = 6', 'Z = 24'], correct: 0 },
  { id: 6, v: 'P', a: 2, b: 8, c: 20, op: '+', q: 'Find the Value of P:', options: ['P = 12', 'P = 10', 'P = 6'], correct: 2 },
  { id: 7, v: 'X', a: 3, b: 5, c: 10, op: '-', q: 'Find the Value of X:', options: ['X = 5', 'X = 15', 'X = 3'], correct: 0 }
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Step 1",
    title: "Balance Rule",
    math: "3X + 1 = 10",
    desc: "Same operation on both sides: Fundamental of algebraic expressions is that we will perform the SAME operation on both sides to keep the balance."
  },
  {
    id: 1,
    label: "Step 2",
    title: "Remove Constant",
    math: "3X + 1 = 10",
    desc: "Make it zero: To get rid of the constant (+1), we need to make it 0. If it is '+', we reduce that amount. If it is '-', we add that amount to both sides."
  },
  {
    id: 2,
    label: "Step 3",
    title: "Simplify",
    math: "3X + 1 - 1 = 10 - 1",
    desc: "Show subtraction/addition: We perform the removal on both sides. This keeps our equation balanced while isolating the variable term."
  },
  {
    id: 3,
    label: "Step 4",
    title: "Handle Coefficient",
    math: "3X = 9",
    desc: "Make it 1: Now we focus on the coefficient (3). To find the value of X, we must make the coefficient 1 by dividing both sides by 3."
  },
  {
    id: 4,
    label: "Step 5",
    title: "Final Answer",
    math: "3X / 3 = 9 / 3",
    result: "X = 3",
    desc: "Value of X: By performing the final division, we isolate the unknown variable identified as 3."
  }
];

// ==========================================
// 2. MAIN SOLVER COMPONENT
// ==========================================
export default function AlgebraSolvingLab() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept'); 
  const [activeTab, setActiveTab] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = MISSIONS[levelIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationLines, setExplanationLines] = useState([]);

  // --- Handlers ---
  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(5);
    } else {
      setIsError(true);
      setTimeout(() => { setIsError(false); setSelectedOption(null); }, 800);
    }
  };

  const handleNextMission = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  const runExplanation = async () => {
    setIsExplaining(true);
    const { v, a, b, c, op } = mission;
    const invOp = op === '+' ? '-' : '+';
    const midVal = op === '+' ? c - b : c + b;
    const resVal = midVal / a;

    const lines = [
      `Step 1: Balance Rule`,
      `Same operation on both sides to keep the balance.`,
      `Step 2: Remove Constant`,
      `Equation: ${a}${v} ${op} ${b} = ${c}. We must make the constant ${op}${b} into 0.`,
      `Step 3: Simplify`,
      `Show the action: ${a}${v} ${op} ${b} ${invOp} ${b} = ${c} ${invOp} ${b}`,
      `Remaining: ${a}${v} = ${midVal}`,
      `Step 4: Handle Coefficient`,
      `Make it 1: Divide both sides by ${a} to isolate ${v}.`,
      `Calculation: ${a}${v} / ${a} = ${midVal} / ${a}`,
      `Step 5: Final Answer`,
      `Value of ${v}: ${v} = ${resVal}`
    ];
    setExplanationLines(lines);
  };

  useEffect(() => {
    let interval;
    if (autoNextTimer !== null && autoNextTimer > 0) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextMission]);

  // DIV 1: HEADER
  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full lg:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Algebraic Solver Lab</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept Mode</button>
            <button onClick={() => {setAppMode('practice'); setLevelIndex(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice Lab</button>
          </div>
        </div>
      </header>
    </div>
  );

  // PROGRESS BAR
  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2 px-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-[#3e2723]/20 px-4 sm:px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {appMode === 'concept' ? (
          CONCEPT_STEPS.map((_, i) => (
            <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 ${i < activeTab ? 'bg-green-500 border-green-600' : i === activeTab ? 'bg-yellow-400 border-yellow-500 scale-125' : 'bg-white border-[#3e2723]/20'}`} />
          ))
        ) : (
          MISSIONS.map((_, i) => (
            <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 ${i < levelIndex ? 'bg-green-500 border-green-600' : i === levelIndex ? 'bg-yellow-400 border-yellow-500 scale-125' : 'bg-white border-[#3e2723]/20'}`} />
          ))
        )}
      </div>
    </div>
  );

  // DIV 2: MAHOGANY EQUATION BOARD
  const renderBoardDiv = () => {
    const displayMath = appMode === 'concept' ? CONCEPT_STEPS[activeTab].math : `${mission.a}${mission.v} ${mission.op} ${mission.b} = ${mission.c}`;
    const resultMath = appMode === 'concept' ? CONCEPT_STEPS[activeTab].result : null;

    return (
      <div className="w-full max-w-4xl px-4 py-2 sm:py-4">
        <motion.div key={displayMath} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-3 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="relative z-10 bg-[#3e2723] p-6 sm:p-16 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[260px] shadow-inner text-center">
             <span className="text-[#fef3c7] font-mono text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-tight">
                {displayMath}
             </span>
             {resultMath && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 sm:mt-8 bg-green-600 text-white px-6 sm:px-8 py-1 sm:py-2 rounded-full font-black text-xl sm:text-2xl shadow-lg border-2 border-white/20">
                 {resultMath}
               </motion.div>
             )}
             <div className="w-full mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/5">
                <span className="text-[9px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic">
                  {appMode === 'concept' ? `Logic: ${CONCEPT_STEPS[activeTab].title}` : `Mission: Solve Variable ${mission.v}`}
                </span>
             </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // DIV 3: INTERACTIVE PANEL
  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-8">
      <div className="bg-[#dfd7cc] p-4 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[300px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        {appMode === 'concept' ? (
          <div className="w-full flex flex-col items-center relative z-10">
            {/* STEP TABS - UPDATED WITH STEP NAMES */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
               {CONCEPT_STEPS.map((step, idx) => (
                 <button 
                    key={step.id} 
                    onClick={() => setActiveTab(idx)}
                    className={`px-3 sm:px-5 py-2 rounded-xl sm:rounded-2xl font-black uppercase text-[8px] sm:text-[10px] transition-all border-b-4 
                      ${activeTab === idx ? 'bg-[#2a1a16] text-yellow-400 border-black shadow-lg scale-105 sm:scale-110' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}
                 >
                   {step.label}: {step.title}
                 </button>
               ))}
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center w-full max-w-2xl px-2">
              <h3 className="text-[#2a1a16] text-lg sm:text-xl font-black uppercase mb-3 flex items-center justify-center gap-2">
                <Layers size={20} className="text-orange-600 sm:w-6 sm:h-6" /> {CONCEPT_STEPS[activeTab].title}
              </h3>
              <p className="text-[#3e2723] text-sm sm:text-lg md:text-xl font-bold leading-relaxed mb-4">
                {CONCEPT_STEPS[activeTab].desc}
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="text-center w-full relative z-10 py-2 sm:py-4">
            <h2 className="text-[#3e2723] text-2xl sm:text-3xl font-black uppercase mb-6 sm:mb-12 tracking-tight drop-shadow-sm">{mission.q}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
              {mission.options.map((option, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleOptionSelect(idx)} 
                  disabled={isCorrect}
                  className={`group relative p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-b-8 font-black text-lg sm:text-2xl transition-all
                    ${selectedOption === idx && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : 
                      selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                      'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 hover:scale-[1.03] active:translate-y-1 shadow-sm'}`}
                >
                  {option}
                  {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white/40" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // DIV 4: CONTROL FOOTER (Navigation outside DIV 3)
  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-20 sm:pb-24 flex flex-col sm:flex-row gap-3 sm:gap-4">
        {appMode === 'concept' ? (
          <>
            <button 
              onClick={() => setActiveTab(p => Math.max(0, p - 1))} 
              disabled={activeTab === 0}
              className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 disabled:opacity-30 transition-all shadow-lg"
            >
              Previous Step
            </button>
            {activeTab < CONCEPT_STEPS.length - 1 ? (
              <button 
                onClick={() => setActiveTab(p => p + 1)}
                className="flex-1 bg-[#3e2723] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 transition-all shadow-lg"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
                className="flex-1 bg-green-600 text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-green-800 animate-pulse active:translate-y-1 transition-all shadow-lg"
              >
                Start Practice
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4">
             <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className="flex-1 bg-[#3e2723] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 flex justify-center items-center gap-2 shadow-lg">
               <GraduationCap size={16} /> View Concept
            </button>
            <button onClick={handleNextMission} className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 flex justify-center items-center gap-2 shadow-lg">
              {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Mission'} <ChevronRight size={18} />
            </button>
            <button onClick={runExplanation} className="flex-1 bg-white text-[#3e2723] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-2 border-[#3e2723] active:translate-y-1 flex items-center justify-center gap-2 shadow-lg">
              <Info size={18} /> Explanation
            </button>
          </div>
        )}
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce sm:w-24 sm:h-24" />
        </motion.div>
        <h1 className="relative z-10 text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Algebra Mastered!</h1>
        <p className="relative z-10 text-lg sm:text-xl text-[#8d6e63] font-bold max-w-md mb-12 leading-relaxed">Two-step algebraic variable isolation mastered. Objectives achieved.</p>
        <button onClick={() => navigate('/learn/mathematics/algebra/WarModeAEBeginner')} className="relative z-10 px-12 sm:px-16 py-4 sm:py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="absolute inset-0 bg-[#3e2723] pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(0,0,0,0.05) 100px, rgba(0,0,0,0.05) 200px)" }} />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {renderHeaderDiv()}
        {renderProgressDiv()}
        {renderBoardDiv()}
        {renderActionArea()}
        {renderFooterDiv()}
      </div>

      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#dfd7cc] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-2xl relative border-4 sm:border-8 border-[#3e2723] max-h-[95vh] flex flex-col">
              <button onClick={() => setIsExplaining(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-1 sm:p-2 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg"><CloseIcon size={20} /></button>
              <h3 className="text-xl sm:text-2xl font-black text-[#3e2723] uppercase mb-4 sm:mb-8 flex items-center gap-3">
                <ArrowRightLeft size={24} className="text-[#8d6e63]" /> Solution Logic
              </h3>
              <div className="bg-[#3e2723] p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col gap-3 sm:gap-5 mb-6 sm:mb-8 border-4 border-black/10 shadow-inner overflow-y-auto no-scrollbar">
                {explanationLines.map((line, i) => (
                  <p key={i} className={`font-mono text-[10px] sm:text-base leading-relaxed pl-3 sm:pl-4 border-l-4 
                    ${line.includes('/') || line.includes('=') ? 'text-yellow-400 border-amber-400' : 'text-yellow-100/80 border-white/20'} 
                    ${line.includes('Step') ? 'mt-3 sm:mt-4 first:mt-0 font-black uppercase text-[8px] sm:text-xs tracking-widest text-[#a88a6d]' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full py-4 sm:py-5 bg-[#3e2723] text-[#e6dccb] font-black rounded-2xl sm:rounded-[2rem] uppercase tracking-widest text-[10px] sm:text-xs border-b-6 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}