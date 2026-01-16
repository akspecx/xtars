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
  ArrowRightLeft
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    variableName: 'X',
    coefficient: 3,
    rhsTotal: 18,
    question: 'Find the Value of X:',
    options: ['X = 3', 'X = 6', 'X = 18'],
    correctIndex: 1
  },
  {
    id: 2,
    variableName: 'Y',
    coefficient: 2,
    rhsTotal: 20,
    question: 'Find the Value of Y:',
    options: ['Y = 10', 'Y = 2', 'Y = 20'],
    correctIndex: 0
  },
  {
    id: 3,
    variableName: 'P',
    coefficient: 4,
    rhsTotal: 24,
    question: 'Find the Value of P:',
    options: ['P = 4', 'P = 8', 'P = 6'],
    correctIndex: 2
  },
  {
    id: 4,
    variableName: 'L',
    coefficient: 5,
    rhsTotal: 20,
    question: 'Find the Value of L:',
    options: ['L = 4', 'L = 5', 'L = 10'],
    correctIndex: 0
  },
  {
    id: 5,
    variableName: 'X',
    divisor: 6,
    rhsTotal: 5,
    isDivision: true,
    question: 'Find the Value of X:',
    options: ['X = 30', 'X = 11', 'X = 1'],
    correctIndex: 0
  }
];

// ==========================================
// 2. MAIN SOLVER COMPONENT
// ==========================================
export default function AlgebraSolvingLab() {
  const navigate = useNavigate();
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
    if (index === mission.correctIndex) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(5);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setSelectedOption(null);
      }, 800);
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
    const varName = mission.variableName.toUpperCase();
    const total = mission.rhsTotal;
    
    let lines;
    if (mission.isDivision) {
      const divisor = mission.divisor;
      const result = total * divisor;
      lines = [
        `Step 1: Problem Statement`,
        `The equation is: ${varName} / ${divisor} = ${total}`,
        `Step 2: Goal Identification`,
        `To find the value of ${varName}, we must remove the division by ${divisor}.`,
        `Note: We multiply both sides by ${divisor} because (${varName} / ${divisor}) * ${divisor} is just ${varName}.`,
        `Step 3: Multiplication Action`,
        `To reach our goal, we multiply both sides of the equation by ${divisor}.`,
        `Calculation: (${varName} / ${divisor}) * ${divisor} = ${total} * ${divisor}`,
        `Final Result: ${varName} = ${result}`
      ];
    } else {
      const coeff = mission.coefficient;
      const result = total / coeff;
      lines = [
        `Step 1: Problem Statement`,
        `The equation is: ${coeff}${varName} = ${total}`,
        `Step 2: Goal Identification`,
        `To find the value of ${varName}, we must make the coefficient ${coeff} equal to 1.`,
        `Note: We can't use 0 because 0 * ${varName} is 0. We use 1 because 1 * ${varName} is just ${varName}.`,
        `Step 3: Division Action`,
        `To reach our goal, we divide both sides of the equation by ${coeff}.`,
        `Calculation: ${coeff}${varName} / ${coeff} = ${total} / ${coeff}`,
        `Final Result: ${varName} = ${result}`
      ];
    }
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

  // --- UI Renders ---
  
  // DIV 1: HEADER (Dark Mahogany Theme, Progress dots removed)
  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-6 rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full md:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-yellow-400 rotate-45 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Algebraic Solver Lab</h2>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

  // MIDDLE DIV: PROGRESS BAR (Completed dots turn Green)
  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2">
      <div className="flex gap-3 bg-[#3e2723]/20 px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {MISSIONS.map((_, i) => (
          <div key={i} className={`w-3.5 h-3.5 rounded-full transition-all duration-500 border-2 
            ${i < levelIndex ? 'bg-green-500 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              i === levelIndex ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 
              'bg-white border-[#3e2723]/20'}`} />
        ))}
      </div>
    </div>
  );

  // DIV 2: MAHOGANY EQUATION BOARD (DARK THEME WITH LIGHT EXPRESSION)
  const renderBoardDiv = () => (
    <div className="w-full max-w-4xl px-4 py-4">
      <motion.div 
        key={mission.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a1a16] p-2 sm:p-3 rounded-[3.5rem] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10"
      >
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <div className="relative z-10 bg-[#3e2723] p-10 sm:p-16 rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[260px] shadow-inner">
           <div className="flex flex-col items-center justify-center w-full">
              <span className="text-[#fef3c7] font-mono text-6xl sm:text-9xl font-black tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-none">
                  {mission.isDivision ? 
                    `${mission.variableName} / ${mission.divisor} = ${mission.rhsTotal}` : 
                    `${mission.coefficient}${mission.variableName} = ${mission.rhsTotal}`}
              </span>
           </div>

           <div className="w-full mt-12 pt-6 border-t border-white/5 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <Variable size={14} className="text-yellow-400" />
                <span className="text-[10px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic leading-none">
                  Solve for the value of variable {mission.variableName}
                </span>
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  );

  // DIV 3: QUESTION AND ANSWER AREA (Light Wooden Theme)
  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-8">
      <div className="bg-[#dfd7cc] p-10 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-10 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <div className="text-center w-full relative z-10">
          <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-12 tracking-tight">
              {mission.question}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mx-auto">
            {mission.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isCorrect}
                className={`group relative p-8 rounded-[2.5rem] border-b-8 font-black text-2xl transition-all
                  ${selectedOption === idx && isCorrect ? 'bg-orange-500 border-orange-700 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 
                    selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                    'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 hover:scale-[1.03] active:translate-y-1 shadow-sm'}`}
              >
                {option.toUpperCase()}
                {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-3 right-3 text-white/40" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // DIV 4: CONTROL FOOTER
  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-24 flex gap-4">
        <button 
          onClick={handleNextMission}
          className="flex-1 bg-[#3e2723] text-[#e6dccb] p-5 rounded-2xl font-black uppercase text-[10px] border-b-4 border-black active:translate-y-1 flex justify-center items-center gap-2 shadow-lg hover:brightness-125 transition-all"
        >
          {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Mission'} <ChevronRight size={18} />
        </button>
        <button 
          onClick={runExplanation}
          className="bg-[#8d6e63] text-white p-5 rounded-2xl font-black uppercase text-[10px] border-b-4 border-[#5d4037] active:translate-y-1 flex items-center gap-2 shadow-lg hover:brightness-125 transition-all"
        >
          <Info size={18} /> View Explanation
        </button>
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-48 h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce" />
        </motion.div>
        <h1 className="relative z-10 text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Mission Complete</h1>
        <p className="relative z-10 text-xl text-[#8d6e63] font-bold max-w-md mb-12 leading-relaxed">Algebraic variable isolation mastered. Excellent laboratory performance.</p>
        <button onClick={() => navigate('/learn/mathematics/algebra/SolveAXPlusB')} className="relative z-10 px-16 py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative">
      {/* LIGHT WOODEN MAIN BACKGROUND PATTERN */}
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
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <div className="w-full max-w-2xl bg-[#dfd7cc] rounded-[3.5rem] p-10 shadow-2xl relative border-8 border-[#3e2723]">
              <button onClick={() => setIsExplaining(false)} className="absolute top-8 right-8 p-2 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg"><CloseIcon size={20} /></button>
              <h3 className="text-2xl font-black text-[#3e2723] uppercase mb-8 flex items-center gap-3">
                <ArrowRightLeft size={32} className="text-[#8d6e63]" /> Solution Logic
              </h3>
              <div className="bg-[#3e2723] p-8 rounded-[2.5rem] flex flex-col gap-5 mb-8 border-4 border-black/10 shadow-inner overflow-y-auto max-h-[50vh] no-scrollbar">
                {explanationLines.map((line, i) => (
                  <p key={i} className={`font-mono text-sm sm:text-base leading-relaxed pl-4 border-l-4 
                    ${line.includes('/') || line.includes('=') ? 'text-yellow-400 border-amber-400' : 'text-yellow-100/80 border-white/20'} 
                    ${line.includes('Step') ? 'mt-4 first:mt-0 font-black uppercase text-xs tracking-widest text-[#a88a6d]' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full py-5 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2rem] uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}