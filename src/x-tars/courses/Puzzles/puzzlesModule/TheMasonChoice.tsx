import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 RefreshCcw,
 ChevronRight,
 FastForward,
 Trophy, Sparkles, Volume2, VolumeX,
 Info, X, Equal, Target,
 Weight, Hammer, Boxes, GitBranch,
 Activity, Scale, AlertCircle,
 PlayCircle, HelpCircle, RotateCcw,
 Microscope, CheckCircle2
} from 'lucide-react';

/**
 * Core Logic: Binary (one side) or Ternary (balanced) weighing
 */
const getMeasurementStatus = (segments, target, mode = 'ternary') => {
  const measurable = new Set();
  const n = segments.length;
  
  if (mode === 'binary') {
    for (let i = 0; i < (1 << n); i++) {
      let currentSum = 0;
      for (let j = 0; j < n; j++) {
        if ((i >> j) & 1) currentSum += segments[j];
      }
      if (currentSum > 0 && currentSum <= target) measurable.add(currentSum);
    }
  } else {
    const totalCombinations = Math.pow(3, n);
    for (let i = 0; i < totalCombinations; i++) {
      let currentSum = 0;
      let temp = i;
      for (let j = 0; j < n; j++) {
        const coeff = (temp % 3) - 1; 
        currentSum += coeff * segments[j];
        temp = Math.floor(temp / 3);
      }
      const absSum = Math.abs(currentSum);
      if (absSum > 0 && absSum <= target) measurable.add(absSum);
    }
  }

  const results = [];
  for (let w = 1; w <= target; w++) {
    results.push({
      weight: w,
      isPossible: measurable.has(w)
    });
  }
  return results;
};

const PUZZLES = [
 {
   id: 'level1',
   title: 'Small Load',
   targetVal: 13,
   pieces: 3,
   mode: 'ternary',
   instruction: "Balanced scale: pieces can go on either side. Use 3 pieces to weigh up to 13kg.",
   solutionText: "1kg, 3kg, and 9kg pieces."
 },
 {
   id: 'level2',
   title: 'Mason\'s Choice',
   targetVal: 15,
   pieces: 4,
   mode: 'binary',
   instruction: "Single scale: pieces only on one side. Use 4 pieces to cover up to 15kg.",
   solutionText: "1kg, 2kg, 4kg, and 8kg pieces."
 },
 {
   id: 'level3',
   title: 'Heavy Block',
   targetVal: 40,
   pieces: 4,
   mode: 'ternary',
   instruction: "Balanced scale again! Find 4 pieces to measure every kilo up to 40kg.",
   solutionText: "1kg, 3kg, 9kg, and 27kg pieces."
 },
 {
   id: 'level4',
   title: 'The Monolith',
   targetVal: 121,
   pieces: 5,
   mode: 'ternary',
   instruction: "The ultimate balanced scale challenge. 5 pieces to measure up to 121kg.",
   solutionText: "1, 3, 9, 27, and 81kg pieces."
 }
];

export default function App() {
 const [currentLevel, setCurrentLevel] = useState(0);
 const puzzle = PUZZLES[currentLevel];

 // State
 const [userSegments, setUserSegments] = useState(Array(puzzle.pieces).fill(""));
 const [isCorrect, setIsCorrect] = useState(false);
 const [isMuted, setIsMuted] = useState(false);
 const [autoNextTimer, setAutoNextTimer] = useState(null);
 const [showInstructions, setShowInstructions] = useState(true);
 const [showDiagnostic, setShowDiagnostic] = useState(false);
 const [isExplaining, setIsExplaining] = useState(false);

 const timerIntervalRef = useRef(null);
 // Track the previous count of entered pieces to trigger popup only on change
 const lastEnteredCount = useRef(0);

 // Logic Calculations
 const segmentNumbers = useMemo(() => 
    userSegments.map(s => parseInt(s, 10)).filter(n => !isNaN(n) && n > 0),
 [userSegments]);

 const currentSum = segmentNumbers.reduce((a, b) => a + b, 0);
 const testingLog = useMemo(() => getMeasurementStatus(segmentNumbers, puzzle.targetVal, puzzle.mode), [segmentNumbers, puzzle.targetVal, puzzle.mode]);
 
 const missingWeights = testingLog.filter(item => !item.isPossible).map(item => item.weight);
 const allPiecesEntered = segmentNumbers.length === puzzle.pieces;
 const allMeasurable = missingWeights.length === 0 && allPiecesEntered;
 const sumMatches = currentSum === puzzle.targetVal;
 const isSolved = allMeasurable && sumMatches;

 const speak = useCallback((text) => {
   if (isMuted || !window.speechSynthesis) return Promise.resolve();
   return new Promise((resolve) => {
     window.speechSynthesis.cancel();
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.rate = 1.0;
     utterance.onend = () => resolve();
     utterance.onerror = () => resolve();
     window.speechSynthesis.speak(utterance);
   });
 }, [isMuted]);

 const resetPuzzle = useCallback(() => {
   setUserSegments(Array(puzzle.pieces).fill(""));
   setIsCorrect(false);
   setAutoNextTimer(null);
   setIsExplaining(false);
   setShowDiagnostic(false);
   lastEnteredCount.current = 0;
 }, [puzzle.pieces]);

 const goToNextLevel = useCallback(() => {
   const nextIdx = (currentLevel + 1) % PUZZLES.length;
   setCurrentLevel(nextIdx);
   setUserSegments(Array(PUZZLES[nextIdx].pieces).fill(""));
   setIsCorrect(false);
   setAutoNextTimer(null);
   setShowInstructions(true);
   setShowDiagnostic(false);
   lastEnteredCount.current = 0;
 }, [currentLevel]);

 const handleInputChange = (idx, val) => {
   if (isCorrect) return;
   const next = [...userSegments];
   const cleaned = val.replace(/[^0-9]/g, '').slice(0, 3);
   next[idx] = cleaned;
   setUserSegments(next);
 };

 // FIXED: Trigger Diagnostic Pop-up ONLY when the count increases to the max
 useEffect(() => {
    const currentCount = segmentNumbers.length;
    if (currentCount === puzzle.pieces && lastEnteredCount.current < puzzle.pieces && !isCorrect) {
        setShowDiagnostic(true);
    }
    lastEnteredCount.current = currentCount;
 }, [segmentNumbers.length, puzzle.pieces, isCorrect]);

 // Handle level intro voice
 useEffect(() => {
    if (showInstructions) {
        speak(puzzle.instruction);
    }
 }, [showInstructions, puzzle.instruction, speak]);

 // Monitoring Win State
 useEffect(() => {
   if (isSolved && !isCorrect) {
     setIsCorrect(true);
     setAutoNextTimer(10);
     setShowDiagnostic(true); // Ensure final report shows
     speak("Excellent! The stone fragmentation is mathematically perfect.");
   }
 }, [isSolved, isCorrect, speak]);

 useEffect(() => {
   if (autoNextTimer !== null && autoNextTimer > 0) {
     timerIntervalRef.current = setInterval(() => {
       setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
     }, 1000);
   } else if (autoNextTimer === 0) {
     goToNextLevel();
   }
   return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
 }, [autoNextTimer, goToNextLevel]);

 return (
   <div className="min-h-screen flex flex-col items-center bg-[#f5f2ed] font-sans select-none overflow-x-hidden text-[#5d4037] p-3 sm:p-8">
     
     {/* HEADER */}
     <header className="w-full flex justify-between items-center z-50 mb-4 sm:mb-6 max-w-4xl">
       <div className="flex items-center gap-3">
         <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#8d6e63] rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-white border-b-4 border-[#5d4037]">
           <Hammer size={24} className="sm:w-8 sm:h-8" />
         </div>
         <div>
           <h1 className="text-lg sm:text-3xl font-black uppercase tracking-tighter leading-none">{puzzle.title}</h1>
           <p className="text-[8px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest mt-0.5 sm:mt-1">Stonemasonry Lab</p>
         </div>
       </div>

       <div className="flex items-center gap-2 sm:gap-3">
           <button onClick={() => setIsMuted(!isMuted)} className="p-3 sm:p-4 bg-white text-[#8d6e63] rounded-xl shadow-md border border-[#c4a484]/20 active:scale-95 transition-transform">
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <button onClick={resetPuzzle} title="Retry Level" className="p-3 sm:p-4 bg-[#8d6e63] text-white rounded-xl shadow-lg border-b-4 border-[#5d4037] active:scale-95 transition-transform">
               <RotateCcw size={20} />
           </button>
       </div>
     </header>

     {/* MAIN CONTENT AREA */}
     <main className="flex-1 w-full max-w-4xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-b-[8px] sm:border-b-[12px] border-[#c4a484] relative overflow-hidden flex flex-col items-center gap-6 sm:gap-8 p-4 sm:p-12 mb-6 sm:mb-8">
       <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)' }} />
      
       <div className="relative w-full z-20 flex flex-col gap-6 sm:gap-10">
            
             {/* PUZZLE INFO CARD */}
             <div className="w-full bg-[#fdfaf5]/90 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-10 border-2 border-[#8d6e63]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 bg-[#5d4037] rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#8d6e63]">
                    <Weight size={32} className="sm:w-12 sm:h-12" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-sm font-black uppercase text-[#a88a6d] tracking-[0.2em]">Target Stone Mass</span>
                    <h2 className="text-3xl sm:text-6xl font-black text-[#5d4037]">{puzzle.targetVal}kg</h2>
                  </div>
                </div>
                <div className="text-center sm:text-right bg-[#8d6e63]/10 px-6 py-2 rounded-2xl border border-[#8d6e63]/20">
                  <span className="text-[10px] sm:text-sm font-black uppercase text-[#a88a6d] tracking-[0.2em]">Goal</span>
                  <h2 className="text-2xl sm:text-5xl font-black text-[#8d6e63]">{puzzle.pieces} Pieces</h2>
                </div>
             </div>

             {/* FRAGMENT INPUT AREA */}
             <div className="bg-white/95 p-6 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] border-4 border-[#8d6e63]/20 shadow-2xl flex flex-col items-center relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 sm:mb-12 uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black text-[#8d6e63] text-xs sm:text-base">
                  <Hammer size={18} className="text-stone-400" /> Enter Fragment Weights
                </div>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-10">
                  {userSegments.map((seg, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 sm:gap-4">
                       <input
                        type="text"
                        inputMode="numeric"
                        value={seg}
                        placeholder="?"
                        onChange={(e) => handleInputChange(idx, e.target.value)}
                        className={`w-16 h-16 sm:w-36 sm:h-36 bg-[#fdfaf5] border-4 rounded-2xl sm:rounded-[2.5rem] text-center text-2xl sm:text-6xl font-black text-[#5d4037] shadow-inner focus:outline-none focus:ring-4 sm:focus:ring-8 focus:ring-blue-500/10 transition-all ${
                          isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-[#c4a484]/40'
                        }`}
                       />
                       <span className="text-[8px] sm:text-sm font-black text-[#a88a6d] uppercase tracking-[0.2em]">Piece {idx + 1}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 sm:mt-14 pt-8 sm:pt-12 border-t-2 border-[#8d6e63]/10 w-full flex flex-col items-center">
                  <div className={`px-8 py-3 sm:px-14 sm:py-5 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-4xl transition-all duration-300 ${sumMatches ? 'bg-blue-600 text-white shadow-xl scale-105' : 'bg-stone-200 text-stone-500'}`}>
                    Sum: {currentSum} / {puzzle.targetVal}kg
                  </div>
                </div>
             </div>

             {/* DASHBOARD INDICATORS */}
             <div className="grid grid-cols-2 gap-4 sm:gap-8">
                <div className={`p-4 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white border-2 shadow-xl flex items-center gap-4 sm:gap-8 transition-all ${sumMatches ? 'border-blue-500 shadow-blue-100' : 'border-stone-200 opacity-60'}`}>
                  <div className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl ${sumMatches ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-stone-200 text-stone-400'}`}>
                    <Scale size={24} className="sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <p className="text-[8px] sm:text-sm font-black uppercase text-stone-400 tracking-wider">Sum Accuracy</p>
                    <p className="text-sm sm:text-2xl font-black">{sumMatches ? "Perfect" : "Pending"}</p>
                  </div>
                </div>
                <button 
                    onClick={() => setShowDiagnostic(true)}
                    disabled={segmentNumbers.length === 0}
                    className={`p-4 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white border-2 shadow-xl flex items-center gap-4 sm:gap-8 transition-all group ${allMeasurable ? 'border-emerald-500 shadow-emerald-100' : 'border-stone-200'} ${segmentNumbers.length === 0 ? 'opacity-40 pointer-events-none' : 'hover:scale-[1.02] active:scale-95'}`}
                >
                  <div className={`p-3 sm:p-6 rounded-xl sm:rounded-2xl ${allMeasurable ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'}`}>
                    <Microscope size={24} className="sm:w-10 sm:h-10" />
                  </div>
                  <div className="text-left text-[#5d4037]">
                    <p className="text-[8px] sm:text-sm font-black uppercase text-stone-400 tracking-wider">Analysis</p>
                    <p className="text-sm sm:text-2xl font-black flex items-center gap-2">
                        {allMeasurable ? "Verified" : "View Check"} 
                        {!allMeasurable && <ChevronRight size={20} className="text-blue-500" />}
                    </p>
                  </div>
                </button>
             </div>
         </div>

         {/* WIN BANNER OVERLAY */}
         <AnimatePresence>
             {isCorrect && (
                 <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none p-4 bg-emerald-900/10 backdrop-blur-sm">
                    <motion.div initial={{ y: 150, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} className="bg-emerald-600 text-white py-8 px-12 sm:py-12 sm:px-24 rounded-[3rem] sm:rounded-[4rem] shadow-[0_40px_120px_rgba(5,150,105,0.7)] flex flex-col sm:flex-row items-center gap-8 sm:gap-14 border-b-[12px] sm:border-b-[20px] border-emerald-900 pointer-events-auto text-center sm:text-left">
                        <Trophy size={64} className="animate-bounce text-yellow-300 sm:w-28 sm:h-28" />
                        <div>
                          <span className="text-3xl sm:text-7xl font-black uppercase tracking-tight block leading-none mb-2">Success!</span>
                          <span className="text-sm sm:text-3xl font-bold opacity-80 uppercase tracking-widest italic block">The Stone is Perfectly Balanced</span>
                        </div>
                    </motion.div>
                 </div>
             )}
         </AnimatePresence>
       </main>

       {/* FOOTER NAV */}
       <footer className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center px-4 max-w-4xl relative z-30 pb-4">
           <button onClick={goToNextLevel} disabled={!isCorrect} className={`relative flex items-center justify-between w-full p-4 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] font-black shadow-2xl transition-all active:scale-95 border-b-8 ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-500/30' : 'bg-[#3e2723]/30 text-[#dfc4a1]/30 border-black/20 pointer-events-none'}`}>
             <div className="flex items-center gap-4 sm:gap-6">
               <div className="bg-white/20 p-3 sm:p-5 rounded-2xl sm:rounded-3xl"><ChevronRight size={24} className="sm:w-10 sm:h-10" /></div>
               <div className="leading-tight uppercase tracking-tighter text-sm sm:text-3xl">{autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Next Level'}</div>
             </div>
             <FastForward className="opacity-30 w-12 h-12 sm:w-16 sm:h-16" />
           </button>
          
           <button onClick={() => setIsExplaining(true)} className="flex items-center justify-center gap-4 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-4 sm:p-10 rounded-[1.5rem] sm:rounded-[3rem] font-black text-sm sm:text-3xl active:scale-95 shadow-2xl border-b-8 border-[#3e2723] transition-colors">
             <Info size={24} className="sm:w-10 sm:h-10" />
             <span className="uppercase tracking-tighter leading-none">Explain Logic</span>
           </button>
       </footer>

       {/* MODAL: DIAGNOSTIC GRID */}
       <AnimatePresence>
         {showDiagnostic && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[400] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-2xl p-4 sm:p-8"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-3xl bg-[#fdfaf5] rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl p-6 sm:p-12 border-[10px] sm:border-[16px] border-[#8d6e63] relative flex flex-col"
                >
                    <button onClick={() => setShowDiagnostic(false)} className="absolute top-4 right-4 sm:top-10 sm:right-10 p-3 sm:p-6 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all shadow-xl z-[450]">
                        <X size={24} className="sm:w-8 sm:h-8" />
                    </button>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-12">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-600/30">
                            <Activity size={32} className="sm:w-12 sm:h-12" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-[#5d4037]">Laboratory Report</h2>
                            <p className="text-[10px] sm:text-lg font-bold text-[#8d6e63] uppercase tracking-widest">Diagnostic grid (1..{puzzle.targetVal}kg)</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[350px] sm:max-h-[450px] pr-2 no-scrollbar mb-8">
                        <div className="grid grid-cols-5 sm:grid-cols-8 gap-3 sm:gap-5">
                            {testingLog.map(item => (
                                <div key={item.weight} className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center text-xs sm:text-2xl font-black transition-all duration-500 ${
                                    item.isPossible 
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                                    : 'bg-red-500/10 text-red-500/40 border border-red-500/10'
                                }`}>
                                    {item.weight}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#e6dccb] p-6 rounded-[2rem] border-2 border-dashed border-[#8d6e63]/40">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle size={20} className={missingWeights.length > 0 ? "text-red-500" : "text-emerald-500"} />
                            <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-[#5d4037]">Findings: {missingWeights.length > 0 ? "Measurement Gaps Detected" : "Full Precision Achieved"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {missingWeights.length > 0 ? (
                                missingWeights.slice(0, 15).map(w => (
                                    <span key={w} className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] sm:text-sm font-black shadow-md border-b-2 border-red-900 animate-in fade-in">
                                        {w}kg
                                    </span>
                                ))
                            ) : (
                                <div className="flex items-center gap-3 text-emerald-600 text-sm sm:text-2xl font-bold italic">
                                    <CheckCircle2 size={24} /> Mathematically optimal fragmentation!
                                </div>
                            )}
                            {missingWeights.length > 15 && <span className="text-[#8d6e63] font-bold">...and more</span>}
                        </div>
                    </div>

                    <button onClick={() => setShowDiagnostic(false)} className="mt-8 py-5 bg-[#8d6e63] text-white font-black rounded-3xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-b-8 border-[#5d4037] text-lg sm:text-3xl">
                        Adjust Weights
                    </button>
                </motion.div>
            </motion.div>
         )}
       </AnimatePresence>

       {/* MODAL: LEVEL INSTRUCTIONS */}
       <AnimatePresence>
         {showInstructions && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[500] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-2xl p-4 sm:p-6"
            >
                <motion.div 
                    initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-4xl bg-[#fdfaf5] rounded-[2.5rem] sm:rounded-[4rem] shadow-2xl p-8 sm:p-20 border-[10px] sm:border-[16px] border-[#8d6e63] relative flex flex-col items-center text-center"
                >
                    <div className="w-16 h-16 sm:w-28 sm:h-28 bg-[#8d6e63] rounded-3xl sm:rounded-[2rem] flex items-center justify-center text-white mb-6 sm:mb-10 shadow-2xl border-b-8 border-[#5d4037]">
                        <PlayCircle size={48} className="sm:w-20 sm:h-20" />
                    </div>
                    <h2 className="text-3xl sm:text-8xl font-black uppercase tracking-tighter mb-4 sm:mb-8 text-[#5d4037]">Level Task</h2>
                    
                    <div className="space-y-6 sm:space-y-10 mb-10 sm:mb-16">
                        <p className="text-lg sm:text-4xl font-bold text-[#8d6e63] leading-relaxed">
                            {puzzle.instruction}
                        </p>
                        <div className="bg-[#e6dccb] p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[3rem] border-4 border-dashed border-[#8d6e63] text-left">
                            <ul className="space-y-3 sm:space-y-6 text-sm sm:text-3xl font-black text-[#5d4037]">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-full flex shrink-0 items-center justify-center text-white text-xs sm:text-xl">1</div>
                                    <span>Define exactly {puzzle.pieces} weights.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-full flex shrink-0 items-center justify-center text-white text-xs sm:text-xl">2</div>
                                    <span>The sum must be {puzzle.targetVal}kg.</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-full flex shrink-0 items-center justify-center text-white text-xs sm:text-xl">3</div>
                                    <span>Measure all increments up to {puzzle.targetVal}kg.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowInstructions(false)} 
                        className="px-16 py-6 sm:px-28 sm:py-10 bg-blue-600 text-white font-black rounded-3xl sm:rounded-[3rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest border-b-8 border-blue-900 text-xl sm:text-5xl"
                    >
                        Start Analysis
                    </button>
                </motion.div>
            </motion.div>
         )}
       </AnimatePresence>

       {/* MODAL: LOGIC BREAKDOWN */}
       <AnimatePresence>
         {isExplaining && (
           <motion.div
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="fixed inset-0 z-[600] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-xl p-4"
           >
             <div className="w-full max-w-6xl bg-[#f1f0ee] rounded-[3rem] sm:rounded-[4rem] shadow-2xl overflow-hidden relative flex flex-col items-center p-8 sm:p-20 border-[8px] sm:border-[16px] border-[#8d6e63]">
               <button onClick={() => setIsExplaining(false)} className="absolute top-4 right-4 sm:top-10 sm:right-10 p-4 sm:p-6 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-2xl">
                 <X size={24} className="sm:w-10 sm:h-10" />
               </button>

               <h2 className="text-4xl sm:text-8xl font-black uppercase tracking-tighter mb-8 sm:mb-12 text-[#5d4037]">Lab Logic</h2>

               <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-14 mb-10 sm:mb-20 text-left">
                 <div className="bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-8 sm:p-14 rounded-[2rem] sm:rounded-[4rem] border-b-8 border-black text-white shadow-2xl flex flex-col justify-center">
                   <h3 className="text-yellow-400 font-black uppercase text-xs sm:text-2xl tracking-widest mb-4 sm:mb-8 border-b border-white/10 pb-4 flex items-center gap-4">
                     <GitBranch size={24} /> {puzzle.mode === 'ternary' ? 'Ternary Theory' : 'Binary Theory'}
                   </h3>
                   <p className="text-stone-200 text-sm sm:text-4xl leading-tight font-medium">
                     {puzzle.mode === 'ternary' 
                        ? "Weights on both sides? Use powers of 3 (1, 3, 9...)." 
                        : "Weights on one side? Use powers of 2 (1, 2, 4...)."
                     }
                   </p>
                 </div>

                 <div className="bg-white p-8 sm:p-14 rounded-[2rem] sm:rounded-[4rem] border-b-8 border-stone-200 shadow-2xl flex flex-col justify-center">
                   <h3 className="text-blue-600 font-black uppercase text-xs sm:text-2xl tracking-widest mb-4 sm:mb-8 border-b border-stone-100 pb-4 flex items-center gap-4">
                     <Target size={24} /> Solution Key
                   </h3>
                   <p className="text-stone-600 text-sm sm:text-4xl leading-tight font-medium">
                     {"Sum to target and leave no gaps in the report."}
                   </p>
                   <p className="mt-6 sm:mt-12 text-[#5d4037] font-black text-lg sm:text-5xl uppercase tracking-tighter">
                     {`Hint: ${puzzle.solutionText}`}
                   </p>
                 </div>
               </div>

               <button onClick={() => setIsExplaining(false)} className="px-16 py-6 sm:px-28 sm:py-10 bg-[#8d6e63] text-white font-black rounded-2xl sm:rounded-[3rem] shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-8 border-[#3e2723] text-xl sm:text-5xl">I Understand</button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* GLOBAL STYLE FIXES */}
       <style dangerouslySetInnerHTML={{ __html: `
         .no-scrollbar::-webkit-scrollbar { display: none; }
         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       ` }} />
   </div>
 );
}