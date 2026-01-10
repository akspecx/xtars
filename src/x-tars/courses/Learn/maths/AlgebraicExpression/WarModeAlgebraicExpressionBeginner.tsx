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
  ArrowRightLeft
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const MISSIONS = [
  { 
    id: 1, v: 'x', eq: '3x = 2x + 18', q: 'What is the value of x?', 
    options: ['9', '18', '36'], correct: 1,
    explanation: [
      "Step 1: Handle constant - The equation is 3x = 2x + 18. Here, the constant 18 is already isolated on the right side.",
      "Step 2: Unify variable components - We move 2x to the left. Subtract 2x from both sides: 3x - 2x = 2x - 2x + 18. This gives us 1x = 18.",
      "Step 3: Handle the coefficient - Since we have 1x, the variable is already isolated. The value is 18."
    ]
  },
  { 
    id: 2, v: 't', eq: '5t - 3 = 3t - 5', q: 'What is the value of t?', 
    options: ['-1', '1', '-2'], correct: 0,
    explanation: [
      "Step 1: Handle constant - The equation is 5t - 3 = 3t - 5. To remove -3, we add 3 to both sides: 5t - 3 + 3 = 3t - 5 + 3. This gives 5t = 3t - 2.",
      "Step 2: Unify variable components - We move 3t to the left. Subtract 3t from both sides: 5t - 3t = 3t - 3t - 2. This gives 2t = -2.",
      "Step 3: Handle the coefficient - We make the coefficient 1 by dividing both sides by 2: 2t / 2 = -2 / 2. The value is -1."
    ]
  },
  { 
    id: 3, v: 'x', eq: '5x + 9 = 5 + 3x', q: 'What is the value of x?', 
    options: ['2', '-2', '-4'], correct: 1,
    explanation: [
      "Step 1: Handle constant - The equation is 5x + 9 = 5 + 3x. To remove +9, we subtract 9 from both sides: 5x + 9 - 9 = 5 - 9 + 3x. This gives 5x = -4 + 3x.",
      "Step 2: Unify variable components - We move 3x to the left. Subtract 3x from both sides: 5x - 3x = -4 + 3x - 3x. This gives 2x = -4.",
      "Step 3: Handle the coefficient - We make the coefficient 1 by dividing both sides by 2: 2x / 2 = -4 / 2. The value is -2."
    ]
  },
  { 
    id: 4, v: 'z', eq: '4z + 3 = 6 + 2z', q: 'What is the value of z?', 
    options: ['1', '1.5', '3'], correct: 1,
    explanation: [
      "Step 1: Handle constant - The equation is 4z + 3 = 6 + 2z. To remove +3, we subtract 3 from both sides: 4z + 3 - 3 = 6 - 3 + 2z. This gives 4z = 3 + 2z.",
      "Step 2: Unify variable components - We move 2z to the left. Subtract 2z from both sides: 4z - 2z = 3 + 2z - 2z. This gives 2z = 3.",
      "Step 3: Handle the coefficient - We make the coefficient 1 by dividing both sides by 2: 2z / 2 = 3 / 2. The value is 1.5."
    ]
  },
  { 
    id: 5, v: 'x', eq: '2x - 1 = 14 - x', q: 'What is the value of x?', 
    options: ['5', '13', '15'], correct: 0,
    explanation: [
      "Step 1: Handle constant - The equation is 2x - 1 = 14 - x. To remove -1, we add 1 to both sides: 2x - 1 + 1 = 14 + 1 - x. This gives 2x = 15 - x.",
      "Step 2: Unify variable components - We move -x to the left. Add x to both sides: 2x + x = 15 - x + x. This gives 3x = 15.",
      "Step 3: Handle the coefficient - We make the coefficient 1 by dividing both sides by 3: 3x / 3 = 15 / 3. The value is 5."
    ]
  },
  { 
    id: 6, v: 'x', eq: '8x + 4 = 7', q: 'What is the value of x?', 
    options: ['3/8', '11/8', '1/2'], correct: 0,
    explanation: [
      "Step 1: Handle constant - The equation is 8x + 4 = 7. To remove +4, we subtract 4 from both sides: 8x + 4 - 4 = 7 - 4. This gives 8x = 3.",
      "Step 2: Unify variable components - The variable 8x is already alone on the left side.",
      "Step 3: Handle the coefficient - We make the coefficient 1 by dividing both sides by 8: 8x / 8 = 3 / 8. The value is 3/8."
    ]
  },
  { 
    id: 7, v: 'x', eq: 'x = (4/5)(x + 10)', q: 'What is the value of x?', 
    options: ['10', '40', '20'], correct: 1,
    explanation: [
      "Step 1: Handle constant - The equation is x = (4/5)x + 8. No independent constants need moving yet.",
      "Step 2: Unify variable components - Move (4/5)x to the left side. Subtract (4/5)x from both sides: x - (4/5)x = (4/5)x - (4/5)x + 8. This gives 1/5x = 8.",
      "Step 3: Handle the coefficient - To isolate x, multiply both sides by 5 (the inverse of 1/5): 1/5x * 5 = 8 * 5. The value is 40."
    ]
  },
  { 
    id: 8, v: 'x', eq: '2x/3 + 1 = 7x/15 + 3', q: 'What is the value of x?', 
    options: ['5', '10', '15'], correct: 1,
    explanation: [
      "Step 1: Handle constant - The equation is 2x/3 + 1 = 7x/15 + 3. Subtract 1 from both sides: 2x/3 + 1 - 1 = 7x/15 + 3 - 1. This gives 2x/3 = 7x/15 + 2.",
      "Step 2: Unify variable components - Subtract 7x/15 from both sides: 2x/3 - 7x/15 = 7x/15 - 7x/15 + 2. This simplifies to 3x/15 = 2, or 1/5x = 2.",
      "Step 3: Handle the coefficient - Multiply both sides by 5: 1/5x * 5 = 2 * 5. The value is 10."
    ]
  },
  { 
    id: 9, v: 'y', eq: '2y + 5/3 = 26/3 - y', q: 'What is the value of y?', 
    options: ['7/3', '21', '3'], correct: 0,
    explanation: [
      "Step 1: Handle constant - The equation is 2y + 5/3 = 26/3 - y. Subtract 5/3 from both sides: 2y + 5/3 - 5/3 = 26/3 - 5/3 - y. This gives 2y = 21/3 - y, which is 2y = 7 - y.",
      "Step 2: Unify variable components - Add y to both sides: 2y + y = 7 - y + y. This gives 3y = 7.",
      "Step 3: Handle the coefficient - Divide both sides by 3: 3y / 3 = 7 / 3. The value is 7/3."
    ]
  },
  { 
    id: 10, v: 'm', eq: '3m = 5m - 8/5', q: 'What is the value of m?', 
    options: ['4/5', '8/5', '1/5'], correct: 0,
    explanation: [
      "Step 1: Handle constant - The equation is 3m = 5m - 8/5. Add 8/5 to both sides: 3m + 8/5 = 5m - 8/5 + 8/5. This gives 3m + 8/5 = 5m.",
      "Step 2: Unify variable components - Subtract 3m from both sides: 3m - 3m + 8/5 = 5m - 3m. This gives 8/5 = 2m.",
      "Step 3: Handle the coefficient - Divide both sides by 2: (8/5) / 2 = 2m / 2. The value is 4/5."
    ]
  }
];

// ==========================================
// 2. MAIN SOLVER COMPONENT
// ==========================================
export default function AlgebraWarModeBeginning() {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = MISSIONS[levelIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // --- Handlers ---
  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => { setIsError(false); }, 800);
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

  // Updated Timer Logic: Pauses when isExplaining is true
  useEffect(() => {
    let interval;
    if (!isExplaining && autoNextTimer !== null && autoNextTimer > 0) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (!isExplaining && autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextMission, isExplaining]);

  // DIV 1: HEADER
  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Practice Laboratory</h1>
          </div>
          <div className="bg-yellow-400/10 p-3 rounded-2xl border border-yellow-400/20">
            <Calculator className="text-yellow-400" size={24} />
          </div>
        </div>
      </header>
    </div>
  );

  // PROGRESS BAR
  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2 px-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-[#3e2723]/20 px-4 sm:px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {MISSIONS.map((_, i) => (
          <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 
            ${i < levelIndex ? 'bg-green-500 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              i === levelIndex ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 
              'bg-white border-[#3e2723]/20'}`} />
        ))}
      </div>
    </div>
  );

  // DIV 2: MAHOGANY EQUATION BOARD
  const renderBoardDiv = () => (
    <div className="w-full max-w-4xl px-4 py-2 sm:py-4">
      <motion.div key={mission.eq} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a1a16] p-1.5 sm:p-3 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 bg-[#3e2723] p-8 sm:p-16 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px] shadow-inner text-center">
           <span className="text-[#fef3c7] font-mono text-3xl sm:text-5xl md:text-7xl font-black tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] leading-tight">
              {mission.eq}
           </span>
           <div className="w-full mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-white/5">
              <span className="text-[9px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic">
                Mission {levelIndex + 1} of {MISSIONS.length}
              </span>
           </div>
        </div>
      </motion.div>
    </div>
  );

  // DIV 3: INTERACTIVE PANEL
  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[280px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="text-center w-full relative z-10 py-2 sm:py-4">
          <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-6 sm:mb-10 tracking-tight drop-shadow-sm">
              {mission.q}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto">
            {mission.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isCorrect}
                className={`group relative p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-b-8 font-black text-xl sm:text-3xl transition-all
                  ${selectedOption === idx && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg' : 
                    selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                    'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 hover:scale-[1.03] active:translate-y-1 shadow-sm'}`}>
                {option}
                {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/40" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // DIV 4: CONTROL FOOTER
  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-20 sm:pb-24 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button onClick={handleNextMission} className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 flex justify-center items-center gap-2 shadow-lg transition-all">
          {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Mission'} <ChevronRight size={18} />
        </button>
        <button 
          onClick={() => setIsExplaining(true)} 
          disabled={selectedOption === null}
          className={`flex-1 p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 active:translate-y-1 flex items-center justify-center gap-2 shadow-lg transition-all
            ${selectedOption !== null ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
          <Info size={18} /> View Explanation
        </button>
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce sm:w-24 sm:h-24" />
        </motion.div>
        <h1 className="relative z-10 text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Laboratory Complete!</h1>
        <p className="relative z-10 text-lg sm:text-xl text-[#8d6e63] font-bold max-w-md mb-12 leading-relaxed">Algebraic variable isolation mastered. Objectives achieved.</p>
        <button onClick={() => navigate('/learn/mathematics/algebra/WarModeAEIntermediate')} className="relative z-10 px-12 sm:px-16 py-4 sm:py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
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
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-2xl relative border-4 sm:border-8 border-[#3e2723] max-h-[95vh] flex flex-col overflow-hidden">
              <button onClick={() => setIsExplaining(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-1 sm:p-2 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={20} /></button>
              
              <h3 className="text-xl sm:text-2xl font-black text-[#3e2723] uppercase mb-4 sm:mb-8 flex items-center gap-3">
                <ArrowRightLeft size={24} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-1 flex flex-col gap-4">
                {mission.explanation.map((line, i) => {
                  const [header, ...detailParts] = line.split(" - ");
                  const detail = detailParts.join(" - ");
                  
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="bg-[#3e2723] rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 border-l-8 border-yellow-400 shadow-xl"
                    >
                      <h4 className="text-yellow-400 font-black uppercase text-xs sm:text-sm tracking-widest mb-2 flex items-center gap-2">
                        <CheckCircle2 size={16} /> {header}
                      </h4>
                      <p className="font-mono text-yellow-50/90 text-xs sm:text-base leading-relaxed pl-6 italic">
                        {detail}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-6 py-4 sm:py-5 bg-[#3e2723] text-[#e6dccb] font-black rounded-2xl sm:rounded-[2rem] uppercase tracking-widest text-[10px] sm:text-xs border-b-6 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}