// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//  RefreshCcw, CheckCircle2,
//  Timer, Info, X,
//  Trophy, Sparkles, Volume2, VolumeX,
//  Target, ClipboardList, Eye, EyeOff,
//  LayoutGrid, AlertCircle, HelpCircle, ChevronRight, FastForward,
//  ArrowRightCircle
// } from 'lucide-react';


// export default function App() {
//  // --- Game State ---
//  const [targetSum, setTargetSum] = useState(15);
//  const [grid, setGrid] = useState(Array(9).fill(""));
//  const [isCorrect, setIsCorrect] = useState(false);
//  const [isMuted, setIsMuted] = useState(false);
//  const [showSolution, setShowSolution] = useState(false);
//  const [showInstructions, setShowInstructions] = useState(false);
//  const [time, setTime] = useState(0);
//  const [isActive, setIsActive] = useState(true);
//  const [autoNextTimer, setAutoNextTimer] = useState(null);


//  const timerRef = useRef(null);
//  const nextLevelTimerRef = useRef(null);


//  // --- Logic Helpers ---
//  const getLineSum = (indices) => {
//    return indices.reduce((acc, idx) => acc + (grid[idx] === "" ? 0 : Number(grid[idx])), 0);
//  };


//  const isLineFull = (indices) => {
//    return indices.every(idx => grid[idx] !== "" && !isNaN(grid[idx]));
//  };


//  const checkSolved = (currentGrid) => {
//    const lines = [
//      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
//      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
//      [0, 4, 8], [2, 4, 6]             // Diagonals
//    ];


//    const allFilled = currentGrid.every(cell => cell !== "" && !isNaN(cell));
//    if (!allFilled) return false;


//    const uniqueValues = new Set(currentGrid.filter(v => v !== ""));
//    if (uniqueValues.size !== 9) return false;


//    return lines.every(line => {
//      const sum = line.reduce((acc, idx) => acc + Number(currentGrid[idx]), 0);
//      return sum === targetSum;
//    });
//  };


//  const getValidation = (index) => {
//    const val = grid[index];
//    if (val === "") return { isError: false };


//    const isDuplicate = grid.some((cell, idx) => idx !== index && cell === val && cell !== "");
  
//    const lines = [
//      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
//    ];


//    let lineError = false;
//    lines.forEach(line => {
//      if (line.includes(index)) {
//        const lineValues = line.map(idx => grid[idx]);
//        const sum = lineValues.reduce((a, b) => Number(a) + (b === "" ? 0 : Number(b)), 0);
      
//        if (isLineFull(line)) {
//          if (sum !== targetSum) lineError = true;
//        } else if (sum > targetSum) {
//          lineError = true;
//        }
//      }
//    });


//    return { isError: isDuplicate || lineError };
//  };


//  const generateSolution = () => {
//    const n = targetSum / 3;
//    return [
//      n + 3, n - 4, n + 1,
//      n - 2, n,     n + 2,
//      n - 1, n + 4, n - 3
//    ];
//  };


//  // --- Actions ---
//  const handleInput = (index, value) => {
//    if (isCorrect) return;
//    const newGrid = [...grid];
//    newGrid[index] = value;
//    setGrid(newGrid);


//    if (checkSolved(newGrid)) {
//      setIsCorrect(true);
//      setIsActive(false);
//      setAutoNextTimer(10);
//      speak("Wonderful! You've mastered the Magic Square.");
//    }
//  };


//  const resetGame = () => {
//    setGrid(Array(9).fill(""));
//    setIsCorrect(false);
//    setTime(0);
//    setIsActive(true);
//    setShowSolution(false);
//    setAutoNextTimer(null);
//  };


//  const goToNextLevel = useCallback(() => {
//    setTargetSum(prev => prev + 3);
//    setGrid(Array(9).fill(""));
//    setIsCorrect(false);
//    setTime(0);
//    setIsActive(true);
//    setShowSolution(false);
//    setAutoNextTimer(null);
//  }, []);


//  const speak = useCallback((text) => {
//    if (isMuted) return;
//    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//      window.speechSynthesis.cancel();
//      const utterance = new SpeechSynthesisUtterance(text);
//      utterance.rate = 1;
//      window.speechSynthesis.speak(utterance);
//    }
//  }, [isMuted]);


//  // --- Lifecycle ---
//  useEffect(() => {
//    if (isActive) {
//      timerRef.current = setInterval(() => setTime(prev => prev + 1), 1000);
//    } else {
//      clearInterval(timerRef.current);
//    }
//    return () => clearInterval(timerRef.current);
//  }, [isActive]);


//  useEffect(() => {
//    if (autoNextTimer !== null && autoNextTimer > 0) {
//      nextLevelTimerRef.current = setInterval(() => {
//        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
//      }, 1000);
//    } else if (autoNextTimer === 0) {
//      goToNextLevel();
//    }
//    return () => clearInterval(nextLevelTimerRef.current);
//  }, [autoNextTimer, goToNextLevel]);


//  const formatTime = (seconds) => {
//    const mins = Math.floor(seconds / 60);
//    const secs = seconds % 60;
//    return `${mins}:${secs.toString().padStart(2, '0')}`;
//  };


//  const rowIndices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
//  const colIndices = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];


//  return (
//    <div className="h-[100dvh] w-full flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] px-2 sm:px-4 py-2">
    
//      {/* HEADER */}
//      <div className="w-full max-w-4xl flex justify-between items-center py-1 z-50 shrink-0">
//        <div className="flex items-center gap-2">
//          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
//            <LayoutGrid size={20} />
//          </div>
//          <div>
//            <h1 className="text-xs sm:text-2xl font-black uppercase tracking-tighter leading-none">Magic Square</h1>
//            <div className="flex items-center gap-1.5 mt-0.5">
//               <Timer size={10} className="text-[#a88a6d]" />
//               <span className="text-[9px] sm:text-xs font-bold font-mono text-[#a88a6d]">{formatTime(time)}</span>
//            </div>
//          </div>
//        </div>


//        <div className="flex items-center gap-1 sm:gap-3">
//            <button
//              onClick={() => setShowInstructions(true)}
//              className="px-2 sm:px-3 py-1.5 sm:py-2 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 flex items-center gap-1.5"
//            >
//              <HelpCircle size={14} />
//              <span className="hidden md:inline text-[10px] sm:text-xs font-black uppercase">Instructions</span>
//            </button>
//            <button onClick={() => setIsMuted(!isMuted)} className="p-2 sm:p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95">
//                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
//            </button>
//            <button onClick={resetGame} className="p-2 sm:p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95">
//                <RefreshCcw size={14} />
//            </button>
//        </div>
//      </div>


//      {/* MAIN STAGE */}
//      <div className="flex-1 w-full max-w-4xl bg-[#e6dccb] rounded-[1.5rem] sm:rounded-[3.5rem] shadow-xl border-b-[6px] sm:border-b-[10px] border-[#c4a484] relative overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4">
//        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
      
//        {/* Target Banner */}
//        <div className="relative z-10 mb-2 sm:mb-8 text-center">
//            <div className="bg-[#5d4037] text-[#e6dccb] px-4 sm:px-10 py-1.5 sm:py-3 rounded-full shadow-lg border-2 border-[#c4a484] flex items-center gap-2 sm:gap-3">
//                <Target className="w-3 h-3 sm:w-6 sm:h-6 text-yellow-400" />
//                <span className="text-[10px] sm:text-xl font-black uppercase tracking-widest leading-none">Target Sum: {targetSum}</span>
//            </div>
//        </div>


//        {/* 4x4 Responsive Grid */}
//        <div className="relative z-10 grid grid-cols-4 gap-1.5 sm:gap-4 p-2 sm:p-5 bg-[#8d6e63]/10 rounded-[1.2rem] sm:rounded-[3rem] border-2 border-[#8d6e63]/20 shadow-inner">
//            {[0, 1, 2].map(rowIdx => (
//              <React.Fragment key={`r-${rowIdx}`}>
//                {[0, 1, 2].map(colIdx => {
//                  const idx = rowIdx * 3 + colIdx;
//                  const validation = getValidation(idx);
//                  const solution = generateSolution();
//                  return (
//                    <motion.div
//                      key={`c-${idx}`}
//                      className={`relative w-14 h-14 sm:w-28 sm:h-28 rounded-lg sm:rounded-[2rem] shadow-xl flex items-center justify-center transition-all duration-300 border-b-2 sm:border-b-4
//                        ${validation.isError ? 'bg-red-500 border-red-800 ring-2 ring-red-200' : 'bg-white border-[#c4a484]'}
//                        ${isCorrect ? 'ring-2 sm:ring-4 ring-emerald-400 border-emerald-600' : ''}`}
//                    >
//                      <input
//                        type="number"
//                        inputMode="numeric"
//                        value={showSolution ? solution[idx] : grid[idx]}
//                        onChange={(e) => handleInput(idx, e.target.value)}
//                        disabled={isCorrect || showSolution}
//                        className={`w-full bg-transparent text-center text-xl sm:text-6xl font-black focus:outline-none
//                          ${validation.isError ? 'text-white' : 'text-[#5d4037]'}
//                          ${showSolution ? 'text-blue-500 opacity-60' : ''}`}
//                        placeholder="?"
//                      />
//                    </motion.div>
//                  );
//                })}
//                {/* Row Sum Indicator */}
//                <div className="flex items-center justify-center">
//                  <div className={`w-9 h-9 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 flex flex-col items-center justify-center shadow-md transition-all duration-500
//                    ${getLineSum(rowIndices[rowIdx]) === targetSum ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-200' :
//                      getLineSum(rowIndices[rowIdx]) > targetSum ? 'bg-red-500 border-red-700 text-white' :
//                      'bg-amber-100 border-amber-200 text-amber-600'}`}>
//                    <span className="text-[6px] sm:text-[9px] font-black uppercase leading-none">Sum</span>
//                    <span className="text-xs sm:text-2xl font-black leading-none">{getLineSum(rowIndices[rowIdx])}</span>
//                  </div>
//                </div>
//              </React.Fragment>
//            ))}


//            {/* Column Sum Row */}
//            {[0, 1, 2].map(colIdx => (
//              <div key={`col-s-${colIdx}`} className="flex items-center justify-center mt-1">
//                <div className={`w-9 h-9 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 flex flex-col items-center justify-center shadow-md transition-all duration-500
//                  ${getLineSum(colIndices[colIdx]) === targetSum ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-200' :
//                    getLineSum(colIndices[colIdx]) > targetSum ? 'bg-red-500 border-red-700 text-white' :
//                    'bg-amber-100 border-amber-200 text-amber-600'}`}>
//                  <span className="text-[6px] sm:text-[9px] font-black uppercase leading-none">Sum</span>
//                  <span className="text-xs sm:text-2xl font-black leading-none">{getLineSum(colIndices[colIdx])}</span>
//                </div>
//              </div>
//            ))}
//            <div className="flex items-center justify-center opacity-30"><Sparkles size={12} className="sm:w-4 sm:h-4" /></div>
//        </div>
//      </div>


//      {/* SECTION 2: DISCOVERY CONSOLE - 3-Button Layout with Timer integration */}
//      <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-1 shrink-0 px-1 sm:px-2">
//        <div className="bg-[#dfd7cc] p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] border-4 border-[#c4a484] w-full shadow-2xl relative">
//            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border-2 border-[#e6dccb] shadow-md">Lab Console</div>
          
//            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 w-full">
//                {/* View Solution */}
//                <button
//                  onClick={() => setShowSolution(!showSolution)}
//                  className={`flex items-center justify-center gap-2 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-sm shadow-md border-b-4 transition-all
//                    ${showSolution ? 'bg-amber-500 text-white border-amber-700 ring-4 ring-amber-100' : 'bg-white text-[#5d4037] border-gray-200 active:translate-y-1 active:border-0 hover:bg-amber-50'}`}
//                >
//                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
//                  {showSolution ? 'Hide Solution' : 'View Solution'}
//                </button>


//                {/* Reset Square */}
//                <button
//                  onClick={resetGame}
//                  className="flex items-center justify-center gap-2 py-2 sm:py-4 bg-white text-[#8d6e63] rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-sm shadow-md border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-red-50"
//                >
//                  <RefreshCcw size={16} /> Reset Square
//                </button>


//                {/* Next Puzzle - Logic Gated with Timer Integration */}
//                <button
//                  onClick={goToNextLevel}
//                  disabled={!isCorrect}
//                  className={`flex items-center justify-center gap-2 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-sm shadow-md border-b-4 transition-all
//                    ${isCorrect
//                      ? 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500 active:translate-y-1 active:border-0'
//                      : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'}`}
//                >
//                  {autoNextTimer !== null ? <Timer size={16} className="animate-spin" /> : <ArrowRightCircle size={16} />}
//                  <span>
//                    {autoNextTimer !== null ? `Next Level (${autoNextTimer}s)` : 'Next Level'}
//                  </span>
//                </button>
//            </div>
//        </div>
//      </div>


//      {/* INSTRUCTIONS MODAL */}
//      <AnimatePresence>
//        {showInstructions && (
//          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-md p-3 sm:p-4">
//            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#f1f0ee] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-6 sm:p-12 border-[6px] sm:border-[8px] border-[#8d6e63]">
//              <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:scale-110"><X size={20} /></button>
            
//              <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[#8d6e63]/20 pb-4">
//                  <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#8d6e63]" />
//                  <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#5d4037]">Lab Instructions</h2>
//              </div>


//              <div className="space-y-2 sm:space-y-4 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
//                {[
//                  "The square is a 3x3 metric grid.",
//                  "Sum from all the rows, columns, and diagonal should be same.",
//                  "Each row, column, and diagonal must add up to exactly " + targetSum + ".",
//                  "Numbers must not be repeated (duplicates turn red).",
//                  "Sum indicators on sides turn green when target is reached.",
//                  "The 'Next Level' button will unlock and countdown once solved."
//                ].map((text, i) => (
//                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="flex gap-3 items-start bg-white/50 p-3 rounded-xl border border-[#8d6e63]/10">
//                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#8d6e63] text-white flex items-center justify-center font-black text-xs sm:text-lg shrink-0 shadow-sm">{i+1}</span>
//                    <p className="text-[10px] sm:text-lg font-bold text-[#5d4037] leading-tight pt-1">{text}</p>
//                  </motion.div>
//                ))}
//              </div>


//              <button onClick={() => setShowInstructions(false)} className="w-full mt-6 sm:mt-10 py-3 sm:py-4 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20 text-xs sm:text-xl">I'm Ready!</button>
//            </motion.div>
//          </motion.div>
//        )}
//      </AnimatePresence>


//      <style>{`
//        .no-scrollbar::-webkit-scrollbar { display: none; }
//        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
//          -webkit-appearance: none; margin: 0;
//        }
//        input[type=number] { -moz-appearance: textfield; }
//      `}</style>
//    </div>
//  );
// }

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
  Eye,
  EyeOff,
  LayoutGrid,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  FastForward,
  ArrowRightCircle,
  Scale
} from 'lucide-react';

export default function App() {
  // --- Game State ---
  const [targetSum, setTargetSum] = useState(15);
  const [grid, setGrid] = useState(Array(9).fill(""));
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [autoNextTimer, setAutoNextTimer] = useState(null);

  const timerRef = useRef(null);
  const nextLevelTimerRef = useRef(null);

  // --- Logic Helpers ---
  const getLineSum = (indices) => {
    return indices.reduce((acc, idx) => acc + (grid[idx] === "" ? 0 : Number(grid[idx])), 0);
  };

  const isLineFull = (indices) => {
    return indices.every(idx => grid[idx] !== "" && !isNaN(grid[idx]));
  };

  const checkSolved = (currentGrid) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    const allFilled = currentGrid.every(cell => cell !== "" && !isNaN(cell));
    if (!allFilled) return false;

    const uniqueValues = new Set(currentGrid.filter(v => v !== ""));
    if (uniqueValues.size !== 9) return false;

    return lines.every(line => {
      const sum = line.reduce((acc, idx) => acc + Number(currentGrid[idx]), 0);
      return sum === targetSum;
    });
  };

  const getValidation = (index) => {
    const val = grid[index];
    if (val === "") return { isError: false };

    const isDuplicate = grid.some((cell, idx) => idx !== index && Number(cell) === Number(val) && cell !== "");
    
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    let lineError = false;
    lines.forEach(line => {
      if (line.includes(index)) {
        const lineValues = line.map(idx => grid[idx]);
        const sum = lineValues.reduce((a, b) => Number(a) + (b === "" ? 0 : Number(b)), 0);
        
        if (isLineFull(line)) {
          if (sum !== targetSum) lineError = true;
        } else if (sum > targetSum) {
          lineError = true;
        }
      }
    });

    return { isError: isDuplicate || lineError };
  };

  const generateSolution = () => {
    const n = targetSum / 3;
    return [
      n + 3, n - 4, n + 1,
      n - 2, n,     n + 2,
      n - 1, n + 4, n - 3
    ];
  };

  // --- Actions ---
  const handleInput = (index, value) => {
    if (isCorrect) return;
    const newGrid = [...grid];
    newGrid[index] = value;
    setGrid(newGrid);

    if (checkSolved(newGrid)) {
      setIsCorrect(true);
      setIsActive(false);
      setAutoNextTimer(10);
      speak("Wonderful! You've mastered the Magic Square.");
    }
  };

  const resetGame = () => {
    setGrid(Array(9).fill(""));
    setIsCorrect(false);
    setTime(0);
    setIsActive(true);
    setShowSolution(false);
    setAutoNextTimer(null);
  };

  const goToNextLevel = useCallback(() => {
    setTargetSum(prev => prev + 3);
    setGrid(Array(9).fill(""));
    setIsCorrect(false);
    setTime(0);
    setIsActive(true);
    setShowSolution(false);
    setAutoNextTimer(null);
  }, []);

  const speak = useCallback((text) => {
    if (isMuted) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  // --- Lifecycle ---
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

  const rowIndices = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
  const colIndices = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none overflow-y-auto text-[#5d4037] p-1.5 sm:p-4 relative shadow-inner">
      {/* 🪵 MAIN WOOD PATTERN OVERLAY 🪵 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center py-1 sm:py-2 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#3e2723] rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/40">
            <LayoutGrid size={18} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-[11px] sm:text-2xl font-black uppercase tracking-tighter leading-none text-[#3e2723]">Magic Square</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Timer size={10} className="text-[#8d6e63]" />
              <span className="text-[8px] sm:text-xs font-bold font-mono text-[#8d6e63]">{formatTime(time)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            <HelpCircle size={14} className="sm:w-5 sm:h-5" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            {isMuted ? <VolumeX size={14} className="sm:w-5 sm:h-5" /> : <Volume2 size={14} className="sm:w-5 sm:h-5" />}
          </button>
          <button onClick={resetGame} className="p-1.5 sm:p-2.5 bg-[#3e2723] text-white rounded-lg sm:rounded-xl shadow-md border-b-2 border-black active:scale-95 transition-all">
            <RefreshCcw size={14} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* MAIN STAGE */}
      <div className="flex-1 w-full max-w-4xl bg-[#faf9f6]/40 rounded-[1.2rem] sm:rounded-[3.5rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-2 border-[#c4a484]/20 relative overflow-hidden flex flex-col items-center justify-center py-4 sm:py-8 min-h-0 my-2 sm:my-4">
        
        {/* Target Banner */}
        <div className="relative z-10 mb-4 sm:mb-8 text-center">
            <div className="bg-[#3e2723] text-[#faf9f6] px-6 sm:px-12 py-2 sm:py-4 rounded-full shadow-xl border-b-4 border-black flex items-center gap-2 sm:gap-4 transition-transform hover:scale-105">
                <Target className="w-4 h-4 sm:w-8 sm:h-8 text-yellow-400" />
                <span className="text-xs sm:text-2xl font-black uppercase tracking-widest leading-none">Target Sum: {targetSum}</span>
            </div>
        </div>

        {/* 4x4 Responsive Grid (3 cells + 1 sum indicator) */}
        <div className="relative z-10 grid grid-cols-4 gap-2 sm:gap-6 p-3 sm:p-8 bg-[#3e2723]/5 rounded-[1.5rem] sm:rounded-[3rem] border-2 border-[#c4a484]/30 shadow-inner">
            {[0, 1, 2].map(rowIdx => (
              <React.Fragment key={`r-${rowIdx}`}>
                {[0, 1, 2].map(colIdx => {
                  const idx = rowIdx * 3 + colIdx;
                  const validation = getValidation(idx);
                  const solution = generateSolution();
                  return (
                    <motion.div
                      key={`c-${idx}`}
                      whileTap={{ scale: 0.95 }}
                      className={`relative w-14 h-14 sm:w-32 sm:h-32 rounded-xl sm:rounded-[2rem] shadow-xl flex items-center justify-center transition-all duration-300 border-b-2 sm:border-b-4
                        ${validation.isError ? 'bg-red-500 border-red-800 ring-2 ring-red-100 shadow-none' : 'bg-white border-[#c4a484]'}
                        ${isCorrect ? 'ring-2 sm:ring-4 ring-emerald-400 border-emerald-600' : ''}`}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        value={showSolution ? solution[idx] : grid[idx]}
                        onChange={(e) => handleInput(idx, e.target.value)}
                        disabled={isCorrect || showSolution}
                        className={`w-full h-full bg-transparent text-center text-xl sm:text-6xl font-black focus:outline-none transition-colors
                          ${validation.isError ? 'text-white' : 'text-[#3e2723]'}
                          ${showSolution ? 'text-amber-600' : ''}`}
                        placeholder="?"
                      />
                    </motion.div>
                  );
                })}
                {/* Row Sum Indicator */}
                <div className="flex items-center justify-center">
                  <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 flex flex-col items-center justify-center shadow-md transition-all duration-500
                    ${getLineSum(rowIndices[rowIdx]) === targetSum ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-100' :
                      getLineSum(rowIndices[rowIdx]) > targetSum ? 'bg-red-500 border-red-700 text-white' :
                      'bg-[#e6dccb] border-[#c4a484]/50 text-[#8d6e63]'}`}>
                    <span className="text-[6px] sm:text-[10px] font-black uppercase leading-none mb-0.5">Sum</span>
                    <span className="text-sm sm:text-3xl font-black leading-none">{getLineSum(rowIndices[rowIdx])}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* Column Sum Row */}
            {[0, 1, 2].map(colIdx => (
              <div key={`col-s-${colIdx}`} className="flex items-center justify-center mt-1">
                <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 flex flex-col items-center justify-center shadow-md transition-all duration-500
                  ${getLineSum(colIndices[colIdx]) === targetSum ? 'bg-emerald-500 border-emerald-700 text-white scale-110 shadow-emerald-100' :
                    getLineSum(colIndices[colIdx]) > targetSum ? 'bg-red-500 border-red-700 text-white' :
                    'bg-[#e6dccb] border-[#c4a484]/50 text-[#8d6e63]'}`}>
                  <span className="text-[6px] sm:text-[10px] font-black uppercase leading-none mb-0.5">Sum</span>
                  <span className="text-sm sm:text-3xl font-black leading-none">{getLineSum(colIndices[colIdx])}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center opacity-40"><Sparkles size={16} className="text-amber-500" /></div>
        </div>
      </div>

      {/* DISCOVERY CONSOLE */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2 shrink-0 px-1 sm:px-2">
        <div className="bg-[#3e2723] p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-4 border-black w-full shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest border-2 border-[#3e2723] shadow-md">Discovery Console</div>
           
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 w-full">
                {/* View Solution */}
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className={`flex items-center justify-center gap-2 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-md border-b-4 transition-all
                    ${showSolution ? 'bg-amber-500 text-white border-amber-700' : 'bg-[#faf9f6]/10 text-[#c4a484] border-white/5 hover:bg-[#faf9f6]/20 active:translate-y-1 active:border-b-0'}`}
                >
                  {showSolution ? <EyeOff size={18} /> : <Eye size={18} />}
                  {showSolution ? 'Hide Solution' : 'View Solution'}
                </button>

                {/* Reset Square */}
                <button
                  onClick={resetGame}
                  className="flex items-center justify-center gap-2 py-3 sm:py-5 bg-[#e6dccb] text-[#3e2723] rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-md border-b-4 border-[#c4a484] active:translate-y-1 active:border-b-0"
                >
                  <RefreshCcw size={18} /> Reset Hub
                </button>

                {/* Next Level */}
                <button
                  onClick={goToNextLevel}
                  disabled={!isCorrect}
                  className={`flex items-center justify-center gap-2 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-md border-b-4 transition-all
                    ${isCorrect
                      ? 'bg-emerald-600 text-white border-emerald-800 hover:bg-emerald-500'
                      : 'bg-black/20 text-white/20 border-black/10 cursor-not-allowed opacity-50'}`}
                >
                  {autoNextTimer !== null ? <Timer size={18} className="animate-spin" /> : <ArrowRightCircle size={18} />}
                  <span>
                    {autoNextTimer !== null ? `Next (${autoNextTimer}s)` : 'Next Level'}
                  </span>
                </button>
            </div>
        </div>
      </div>

      {/* INSTRUCTIONS MODAL */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-6 sm:p-10 border-4 border-[#3e2723]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"><X size={18} /></button>
             
              <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
                  <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
                  <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Calibration Notes</h2>
              </div>

              <div className="space-y-3 sm:space-y-5 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                {[
                  { text: "The square is a 3x3 high-precision metric grid.", icon: "📏" },
                  { text: "Use strictly unique numbers for every cell; repeat entries are prohibited.", icon: "🗝️" },
                  { text: "Calibrate the tiles so that every row, every column, and both main diagonals sum exactly to " + targetSum + ".", icon: "⚖️" },
                  { text: "Sum trackers on the edges turn green once the local alignment is verified.", icon: "✅" },
                  { text: "The entire hub must reach total equilibrium to unlock the next neural level.", icon: "🚀" }
                ].map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="flex gap-4 items-start bg-[#e6dccb]/30 p-4 rounded-2xl border border-[#c4a484]/10 shadow-inner">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
                    <p className="text-[11px] sm:text-lg font-bold text-[#5d4037] leading-relaxed pt-1.5">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full mt-6 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg transition-all hover:bg-black active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Initiate Calibration</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
         -webkit-appearance: none; margin: 0;
       }
       input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}