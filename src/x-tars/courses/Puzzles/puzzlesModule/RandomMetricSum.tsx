import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw,
  CheckCircle2,
  Timer,
  Info,
  X,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Target,
  ClipboardList,
  LayoutGrid,
  ChevronRight,
  ArrowRightCircle,
  Zap,
  MousePointer2,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  // --- Game State ---
  const [gridSize, setGridSize] = useState(3); 
  const [grid, setGrid] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rowTargets, setRowTargets] = useState([]);
  const [colTargets, setColTargets] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [level, setLevel] = useState(1);

  const timerRef = useRef(null);
  const nextLevelTimerRef = useRef(null);

  // --- Logic Helpers ---
  const generateLevel = useCallback((size, currentLevel) => {
    // Increase complexity based on level
    // 3x3: Lv 1-3 (Numbers 1-15), Lv 4-6 (Numbers 10-50)
    // 4x4: Lv 7+ (Numbers 1-30)
    const rangeMax = currentLevel < 4 ? 15 : currentLevel < 7 ? 50 : 30;
    const rangeMin = currentLevel < 4 ? 1 : 10;

    const newGrid = Array.from({ length: size * size }, () => 
      Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin
    );
    
    // Create a hidden solution
    const solutionMask = newGrid.map(() => Math.random() > 0.45);
    
    // Safety check: ensure at least one per row and col is selected
    for(let i=0; i<size; i++) {
        let rowHasSelection = false;
        for(let j=0; j<size; j++) if(solutionMask[i*size+j]) rowHasSelection = true;
        if(!rowHasSelection) solutionMask[i*size + Math.floor(Math.random()*size)] = true;
    }

    const rows = [];
    const cols = Array(size).fill(0);

    for (let r = 0; r < size; r++) {
      let rowSum = 0;
      for (let c = 0; c < size; c++) {
        const idx = r * size + c;
        if (solutionMask[idx]) {
          rowSum += newGrid[idx];
          cols[c] += newGrid[idx];
        }
      }
      rows.push(rowSum);
    }

    setGrid(newGrid);
    setRowTargets(rows);
    setColTargets(cols);
    setSelected(Array(size * size).fill(false));
    setIsCorrect(false);
    setIsActive(true);
    setAutoNextTimer(null);
  }, []);

  const getCurrentRowSum = (rowIdx) => {
    let sum = 0;
    for (let c = 0; c < gridSize; c++) {
      const idx = rowIdx * gridSize + c;
      if (selected[idx]) sum += grid[idx];
    }
    return sum;
  };

  const getCurrentColSum = (colIdx) => {
    let sum = 0;
    for (let r = 0; r < gridSize; r++) {
      const idx = r * gridSize + colIdx;
      if (selected[idx]) sum += grid[idx];
    }
    return sum;
  };

  const checkSolved = (newSelected) => {
    for (let r = 0; r < gridSize; r++) {
      let rSum = 0;
      for (let c = 0; c < gridSize; c++) {
        if (newSelected[r * gridSize + c]) rSum += grid[r * gridSize + c];
      }
      if (rSum !== rowTargets[r]) return false;
    }
    for (let c = 0; c < gridSize; c++) {
      let cSum = 0;
      for (let r = 0; r < gridSize; r++) {
        if (newSelected[r * gridSize + c]) cSum += grid[r * gridSize + c];
      }
      if (cSum !== colTargets[c]) return false;
    }
    return true;
  };

  const speak = useCallback((text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  // --- Actions ---
  const toggleCell = (index) => {
    if (isCorrect) return;
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);

    if (checkSolved(newSelected)) {
      setIsCorrect(true);
      setIsActive(false);
      setAutoNextTimer(10);
      speak("Matrix integrity confirmed. Calibrating next tier.");
    }
  };

  const resetGame = () => {
    generateLevel(gridSize, level);
    setTime(0);
  };

  const goToNextLevel = useCallback(() => {
    const nextLevel = level + 1;
    // Scale size: Level 1-6 is 3x3, Level 7+ is 4x4
    const nextSize = nextLevel >= 7 ? 4 : 3;
    
    setGridSize(nextSize);
    setLevel(nextLevel);
    generateLevel(nextSize, nextLevel);
    setTime(0);
  }, [level, generateLevel]);

  // --- Lifecycle ---
  useEffect(() => {
    generateLevel(gridSize, level);
  }, []);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      nextLevelTimerRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      goToNextLevel();
    }
    return () => clearInterval(nextLevelTimerRef.current);
  }, [autoNextTimer, goToNextLevel]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none overflow-y-auto text-[#5d4037] p-1.5 sm:p-4 relative shadow-inner">
      {/* 🪵 WOOD PATTERN 🪵 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center py-1 sm:py-2 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-14 sm:h-14 bg-[#3e2723] rounded-lg sm:rounded-2xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/40">
            <LayoutGrid size={20} className="sm:w-8 sm:h-8" />
          </div>
          <div>
            <h1 className="text-xs sm:text-3xl font-black uppercase tracking-tighter leading-none text-[#3e2723]">Metric Sum Lab</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Timer size={12} className="text-[#8d6e63]" />
              <span className="text-[9px] sm:text-sm font-black font-mono text-[#8d6e63]">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-4">
          <button onClick={() => setShowInstructions(true)} className="p-2 sm:p-3 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-2xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            <Info size={16} className="sm:w-6 sm:h-6" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 sm:p-3 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-2xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            {isMuted ? <VolumeX size={16} className="sm:w-6 sm:h-6" /> : <Volume2 size={16} className="sm:w-6 sm:h-6" />}
          </button>
          <button onClick={resetGame} className="p-2 sm:p-3 bg-[#3e2723] text-white rounded-lg sm:rounded-2xl shadow-md border-b-4 border-black active:scale-95 transition-all">
            <RefreshCcw size={16} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 w-full max-w-4xl bg-[#faf9f6]/30 rounded-[1.5rem] sm:rounded-[4rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-2 border-[#c4a484]/15 relative flex flex-col items-center justify-center py-6 sm:py-12 min-h-0 my-3 sm:my-6">
        
        {/* Level Banner */}
        <div className="relative z-10 mb-6 sm:mb-12 text-center flex flex-col items-center gap-3">
            <div className="bg-[#3e2723] text-[#faf9f6] px-8 sm:px-16 py-3 sm:py-5 rounded-full shadow-2xl border-b-8 border-black flex items-center gap-3 sm:gap-5 transition-transform hover:rotate-1">
                <Zap className={`w-5 h-5 sm:w-10 sm:h-10 ${level >= 7 ? 'text-amber-400 animate-pulse' : 'text-blue-400'}`} />
                <div className="flex flex-col items-start">
                    <span className="text-[10px] sm:text-sm font-black text-amber-500 opacity-60 uppercase tracking-widest leading-none">Complexity Level {level}</span>
                    <span className="text-sm sm:text-3xl font-black uppercase tracking-tighter leading-none">
                        {level < 4 ? 'Entry Protocol' : level < 7 ? 'Neural Overload' : 'Expert Calibration'}
                    </span>
                </div>
            </div>
            <p className="text-[10px] sm:text-lg font-bold text-[#8d6e63] uppercase tracking-[0.2em] italic">
                Grid System: {gridSize}x{gridSize} 🔬 Range: 1 - {level < 4 ? 15 : level < 7 ? 50 : 30}
            </p>
        </div>

        {/* Dynamic Responsive Grid */}
        <div 
          className={`relative z-10 grid gap-2 sm:gap-6 p-4 sm:p-10 bg-[#3e2723]/5 rounded-[2rem] sm:rounded-[4rem] border-2 border-[#c4a484]/40 shadow-inner`}
          style={{ gridTemplateColumns: `repeat(${gridSize + 1}, minmax(0, 1fr))` }}
        >
            {Array.from({ length: gridSize }).map((_, r) => (
              <React.Fragment key={`r-${r}`}>
                {Array.from({ length: gridSize }).map((_, c) => {
                  const idx = r * gridSize + c;
                  const isCellSelected = selected[idx];
                  const val = grid[idx];
                  return (
                    <motion.div
                      key={`c-${idx}`}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleCell(idx)}
                      className={`relative w-12 h-12 sm:w-28 sm:h-28 rounded-xl sm:rounded-[2.5rem] shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 border-b-4 sm:border-b-8
                        ${isCellSelected ? 'bg-amber-400 border-amber-600 shadow-amber-300/40' : 'bg-white border-[#c4a484]'}
                        ${isCorrect ? 'ring-4 sm:ring-8 ring-emerald-400/50 border-emerald-600' : ''}`}
                    >
                      <span className={`text-base sm:text-6xl font-black transition-colors ${isCellSelected ? 'text-white' : 'text-[#3e2723]'}`}>
                        {val}
                      </span>
                      {isCellSelected && !isCorrect && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1.5 -right-1.5 sm:-top-3 sm:-right-3 bg-emerald-500 text-white rounded-full p-1 shadow-lg">
                          <CheckCircle2 size={14} className="sm:w-7 sm:h-7" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
                {/* Row Sum Indicator */}
                <div className="flex items-center justify-center pl-2">
                  <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] border-2 sm:border-4 flex flex-col items-center justify-center shadow-lg transition-all duration-500
                    ${getCurrentRowSum(r) === rowTargets[r] ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-200' :
                      getCurrentRowSum(r) > rowTargets[r] ? 'bg-red-500 border-red-700 text-white animate-shake' :
                      'bg-[#e6dccb] border-[#c4a484]/60 text-[#8d6e63]'}`}>
                    <span className="text-[6px] sm:text-xs font-black uppercase mb-0.5 leading-none opacity-60">Row</span>
                    <span className="text-xs sm:text-3xl font-black tabular-nums leading-none">{getCurrentRowSum(r)}</span>
                    <div className="w-4 sm:w-10 h-0.5 bg-current opacity-20 my-0.5 sm:my-1" />
                    <span className="text-[8px] sm:text-lg font-bold opacity-80">{rowTargets[r]}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Column Sum Row */}
            {Array.from({ length: gridSize }).map((_, c) => (
              <div key={`col-s-${c}`} className="flex items-center justify-center pt-2">
                <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] border-2 sm:border-4 flex flex-col items-center justify-center shadow-lg transition-all duration-500
                  ${getCurrentColSum(c) === colTargets[c] ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-200' :
                    getCurrentColSum(c) > colTargets[c] ? 'bg-red-500 border-red-700 text-white animate-shake' :
                    'bg-[#e6dccb] border-[#c4a484]/60 text-[#8d6e63]'}`}>
                  <span className="text-[6px] sm:text-xs font-black uppercase mb-0.5 leading-none opacity-60">Col</span>
                  <span className="text-xs sm:text-3xl font-black tabular-nums leading-none">{getCurrentColSum(c)}</span>
                  <div className="w-4 sm:w-10 h-0.5 bg-current opacity-20 my-0.5 sm:my-1" />
                  <span className="text-[8px] sm:text-lg font-bold opacity-80">{colTargets[c]}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center opacity-30"><Sparkles size={24} className="text-amber-500 animate-pulse" /></div>
        </div>
      </div>

      {/* LAB CONSOLE */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-3 z-50 mb-3 shrink-0 px-2 sm:px-4">
        <div className="bg-[#3e2723] p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] border-4 border-black w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-10 py-2 rounded-full text-[10px] sm:text-sm font-black uppercase tracking-widest border-2 border-[#3e2723] shadow-lg">Operations Dashboard</div>
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
                {/* Reset Unit */}
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-3 py-4 sm:py-6 bg-[#e6dccb] text-[#3e2723] rounded-2xl sm:rounded-[2rem] font-black uppercase text-xs sm:text-xl shadow-xl border-b-8 border-[#c4a484] active:translate-y-2 active:border-b-0 transition-all hover:bg-white"
                >
                  <RefreshCcw size={24} /> Reset Trial
                </button>

                {/* Next Tier */}
                <button
                  onClick={goToNextLevel}
                  disabled={!isCorrect}
                  className={`flex items-center justify-between px-10 py-4 sm:py-6 rounded-2xl sm:rounded-[2rem] font-black uppercase text-xs sm:text-xl shadow-xl border-b-8 transition-all
                    ${isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-900 hover:bg-emerald-500 active:translate-y-2 active:border-b-0'
                      : 'bg-black/40 text-white/20 border-black/60 cursor-not-allowed opacity-50'}`}
                >
                  <div className="flex items-center gap-3">
                    {autoNextTimer !== null ? <Timer size={24} className="animate-spin text-amber-300" /> : <ArrowRightCircle size={24} />}
                    <span>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : 'Advance Tier'}</span>
                  </div>
                  <ChevronRight size={24} className={isCorrect ? 'animate-bounce-x' : ''} />
                </button>
            </div>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-2xl bg-[#faf9f6] rounded-[3rem] sm:rounded-[5rem] shadow-2xl overflow-hidden relative p-8 sm:p-16 border-[12px] border-[#3e2723]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-8 right-8 p-3 bg-[#3e2723] text-white rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-transform"><X size={24} /></button>
             
              <div className="flex items-center gap-4 mb-10 border-b-4 border-[#c4a484]/30 pb-6">
                  <ClipboardList className="w-8 h-8 sm:w-16 sm:h-16 text-[#3e2723]" />
                  <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-[#3e2723]">Lab Manual</h2>
              </div>

              <div className="space-y-4 sm:space-y-6 max-h-[55vh] overflow-y-auto no-scrollbar pr-3">
                {[
                  { text: "Tap tiles to select fragments of the metric mass.", icon: <MousePointer2 className="text-blue-500"/> },
                  { text: "Selected numbers in each axis must sum exactly to the target value shown.", icon: <Target className="text-amber-500"/> },
                  { text: "Grid complexity increases every 3 tiers (larger numbers and larger dimensions).", icon: <Zap className="text-orange-500"/> },
                  { text: "The status node turns green when a row or column reaches equilibrium.", icon: <CheckCircle2 className="text-emerald-500"/> },
                  { text: "If an axis exceeds the limit, the node will glow red in warning.", icon: <ShieldAlert className="text-red-500"/> }
                ].map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-5 items-start bg-[#e6dccb]/20 p-5 sm:p-8 rounded-[2rem] border-2 border-[#c4a484]/20 shadow-inner group hover:bg-white transition-colors">
                    <span className="w-10 h-10 sm:w-16 sm:h-16 rounded-2xl bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xl sm:text-4xl shrink-0 shadow-lg">{item.icon}</span>
                    <p className="text-xs sm:text-2xl font-bold text-[#5d4037] leading-relaxed pt-1 sm:pt-2">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => {setShowInstructions(false); setIsActive(true);}} className="w-full mt-10 sm:mt-14 py-5 sm:py-8 bg-[#3e2723] text-white font-black rounded-3xl sm:rounded-[2.5rem] shadow-2xl transition-all hover:bg-black active:scale-95 uppercase tracking-[0.2em] border-b-[12px] border-black text-sm sm:text-3xl">Initiate Sequence</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCorrect && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none p-6 bg-emerald-900/20 backdrop-blur-[3px]">
            <motion.div initial={{ scale: 0.5, y: 100 }} animate={{ scale: 1, y: 0 }} className="bg-emerald-600 text-white p-12 sm:p-32 rounded-[5rem] sm:rounded-[8rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center gap-10 text-center border-b-[20px] border-emerald-950 ring-[24px] ring-emerald-500/20 pointer-events-auto">
              <Trophy size={120} className="text-yellow-300 animate-bounce" />
              <div>
                <h2 className="text-6xl sm:text-9xl font-black uppercase tracking-tighter leading-none mb-4">ALIGNMENT!</h2>
                <p className="font-bold text-2xl sm:text-4xl opacity-90 italic uppercase tracking-widest">Equilibrium Achieved in {formatTime(time)}</p>
              </div>
              <button onClick={goToNextLevel} className="px-20 py-8 bg-white text-emerald-600 rounded-[2.5rem] sm:rounded-[3.5rem] font-black uppercase text-xl sm:text-5xl shadow-2xl hover:scale-105 transition-all active:scale-95 border-b-[12px] border-stone-200">Next Simulation</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       @keyframes shake {
         0%, 100% { transform: translateX(0); }
         25% { transform: translateX(-4px); }
         75% { transform: translateX(4px); }
       }
       .animate-shake { animation: shake 0.2s ease-in-out infinite; }
       @keyframes bounce-x {
         0%, 100% { transform: translateX(0); }
         50% { transform: translateX(10px); }
       }
       .animate-bounce-x { animation: bounce-x 1s infinite; }
      `}</style>
    </div>
  );
}