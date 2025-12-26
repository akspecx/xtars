// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   RefreshCcw, CheckCircle2, 
//   Hand, Play, MousePointer2, 
//   Timer, ChevronRight, Shuffle, 
//   FastForward, XCircle, TrainFront,
//   Trophy, Clock, Sparkles
// } from 'lucide-react';

// // --- Puzzle Scenarios ---
// const PUZZLES = [
//   { id: 1, initial: [1, null, 3, 4, 5], missing: [2] },
//   { id: 2, initial: [1, 2, null, 4, 5], missing: [3] },
//   { id: 3, initial: [null, 2, 3, 4, 5], missing: [1] },
//   { id: 4, initial: [1, null, 3, null, 5], missing: [2, 4] },
//   { id: 5, initial: [null, 2, null, 4, 5], missing: [1, 3] },
// ];

// const COLORS = {
//   1: '#F43F5E', 2: '#F59E0B', 3: '#10B981', 4: '#3B82F6', 5: '#8B5CF6',
// };

// // --- Animated Smoke Component ---
// const SmokePuff = ({ delay, xPos = 35 }) => (
//   <motion.circle
//     cx={xPos} cy="12" r="5"
//     fill="#ffffff"
//     initial={{ y: 0, opacity: 0, scale: 0.5 }}
//     animate={{ y: -50, opacity: [0, 0.4, 0], scale: [0.5, 3] }}
//     transition={{ duration: 2.5, repeat: Infinity, delay: delay, ease: "easeOut" }}
//   />
// );

// export default function App() {
//   const [mode, setMode] = useState('practice'); 
//   const [puzzleIdx, setPuzzleIdx] = useState(0);
//   const [placedCoaches, setPlacedCoaches] = useState({}); 
//   const [isDeparting, setIsDeparting] = useState(false);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
//   const [autoNextTimer, setAutoNextTimer] = useState(null);
//   const [virtualHandPos, setVirtualHandPos] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [feedback, setFeedback] = useState(null); 

//   const timerIntervalRef = useRef(null);
//   const slotRefs = useRef([]);
//   const optionRefs = useRef({});
//   const audioCtxRef = useRef(null);
//   const tutorialActiveRef = useRef(false);

//   const modeRef = useRef(mode);
//   const isDepartingRef = useRef(isDeparting);
//   const placedCoachesRef = useRef(placedCoaches);

//   useEffect(() => {
//     modeRef.current = mode;
//     isDepartingRef.current = isDeparting;
//     placedCoachesRef.current = placedCoaches;
//   }, [mode, isDeparting, placedCoaches]);

//   const currentPuzzle = PUZZLES[puzzleIdx];

//   const speak = useCallback((text) => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.pitch = 1.1;
//       utterance.rate = 0.95;
//       window.speechSynthesis.speak(utterance);
//     }
//   }, []);

//   const playWhistle = useCallback(() => {
//     if (isMuted) return;
//     try {
//       if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       const ctx = audioCtxRef.current;
//       const osc = ctx.createOscillator();
//       const gain = ctx.createGain();
//       osc.type = 'square';
//       osc.frequency.setValueAtTime(800, ctx.currentTime);
//       osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.2);
//       gain.gain.setValueAtTime(0.05, ctx.currentTime);
//       gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
//       osc.connect(gain);
//       gain.connect(ctx.destination);
//       osc.start();
//       osc.stop(ctx.currentTime + 0.8);
//     } catch(e) {}
//   }, [isMuted]);

//   useEffect(() => {
//     const missingCount = currentPuzzle.missing.length;
//     const currentCount = Object.keys(placedCoaches).length;

//     if (currentCount === missingCount && currentCount > 0 && !isDeparting) {
//         const timer = setTimeout(() => {
//             setIsDeparting(true);
//             playWhistle();
//             speak("Train coupled and leaving platform!");
//             setAutoNextTimer(10);
//         }, 1200);
//         return () => clearTimeout(timer);
//     }
//   }, [placedCoaches, currentPuzzle, isDeparting, playWhistle, speak]);

//   const handlePlace = useCallback((val, slotIdx, isTutorial = false) => {
//     if (!isTutorial && isAutoPlaying) return;
//     if (isTutorial && modeRef.current !== 'kid') return;
//     if (placedCoaches[slotIdx]) return;

//     const expected = slotIdx + 1;
//     if (val === expected) {
//       setPlacedCoaches(prev => ({ ...prev, [slotIdx]: val }));
//       setFeedback({ slotIdx, isCorrect: true });
//       speak(`Coach ${val} coupled!`);
//     } else {
//       setFeedback({ slotIdx, isCorrect: false });
//       speak(`Try again! That is coach ${val}. We need coach ${expected} here.`);
//       if (!isTutorial) {
//         setTimeout(() => setFeedback(null), 2000);
//       }
//     }
//   }, [placedCoaches, isAutoPlaying, speak]);

//   const moveHand = async (fromRect, toRect) => {
//     if (modeRef.current !== 'kid') return;
//     setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
//     await new Promise(r => setTimeout(r, 1000));
//     if (modeRef.current !== 'kid') return;
//     setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
//     await new Promise(r => setTimeout(r, 1400));
//   };

//   const startKidModeTutorial = useCallback(async () => {
//     if (tutorialActiveRef.current || isDeparting) return;
//     tutorialActiveRef.current = true;
//     setIsAutoPlaying(true);

//     await new Promise(r => setTimeout(r, 2000));
//     if (modeRef.current !== 'kid' || isDepartingRef.current) {
//         tutorialActiveRef.current = false;
//         setIsAutoPlaying(false);
//         return;
//     }

//     const missingIndices = currentPuzzle.initial
//       .map((val, idx) => (val === null ? idx : null))
//       .filter(v => v !== null);

//     for (const slotIdx of missingIndices) {
//       if (modeRef.current !== 'kid' || isDepartingRef.current) break;
//       if (slotIdx !== missingIndices[0]) await new Promise(r => setTimeout(r, 1200));
//       if (modeRef.current !== 'kid' || isDepartingRef.current) break;

//       const targetValue = slotIdx + 1;
//       speak(`Let's couple coach ${targetValue}.`);
//       await new Promise(r => setTimeout(r, 2200));
//       if (modeRef.current !== 'kid' || isDepartingRef.current) break;

//       if (!slotRefs.current[slotIdx]) continue;
//       const slotRect = slotRefs.current[slotIdx].getBoundingClientRect();

//       const availableOptions = currentPuzzle.missing.filter(v => 
//         !Object.values(placedCoachesRef.current).includes(v)
//       );
      
//       const wrongValue = availableOptions.find(v => v !== targetValue) || targetValue;
      
//       if (optionRefs.current[wrongValue]) {
//         const optionRect = optionRefs.current[wrongValue].getBoundingClientRect();
//         await moveHand(optionRect, slotRect);
//         if (modeRef.current !== 'kid') break;
//         handlePlace(wrongValue, slotIdx, true);
//         await new Promise(r => setTimeout(r, 3200));
//       }

//       if (wrongValue !== targetValue && optionRefs.current[targetValue]) {
//           if (modeRef.current !== 'kid') break;
//           setFeedback(null);
//           await new Promise(r => setTimeout(r, 600));
//           if (modeRef.current !== 'kid') break;
//           const correctOptionRect = optionRefs.current[targetValue].getBoundingClientRect();
//           await moveHand(correctOptionRect, slotRect);
//           if (modeRef.current !== 'kid') break;
//           handlePlace(targetValue, slotIdx, true);
//           await new Promise(r => setTimeout(r, 1500));
//       }
//     }

//     setIsAutoPlaying(false);
//     setVirtualHandPos(null);
//     tutorialActiveRef.current = false;
//   }, [currentPuzzle, handlePlace, speak, isDeparting]);

//   const resetLevel = useCallback((idx) => {
//     setPuzzleIdx(idx);
//     setPlacedCoaches({});
//     placedCoachesRef.current = {};
//     setIsDeparting(false);
//     setAutoNextTimer(null);
//     setFeedback(null);
//     setIsAutoPlaying(false);
//     tutorialActiveRef.current = false;
//     setVirtualHandPos(null);
//     speak("Complete the sequence!");
//   }, [speak]);

//   useEffect(() => {
//     if (mode === 'kid' && !isDeparting && !tutorialActiveRef.current) {
//       const t = setTimeout(startKidModeTutorial, 2000);
//       return () => clearTimeout(t);
//     } else if (mode === 'practice') {
//       setIsAutoPlaying(false);
//       setVirtualHandPos(null);
//       tutorialActiveRef.current = false;
//     }
//   }, [mode, puzzleIdx, isDeparting, startKidModeTutorial]);

//   useEffect(() => {
//     if (autoNextTimer !== null && autoNextTimer > 0) {
//       timerIntervalRef.current = setInterval(() => {
//         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
//       }, 1000);
//     } else if (autoNextTimer === 0) {
//       const next = (puzzleIdx + 1) % PUZZLES.length;
//       resetLevel(next);
//     }
//     return () => clearInterval(timerIntervalRef.current);
//   }, [autoNextTimer, puzzleIdx, resetLevel]);

//   return (
//     <div className="min-h-screen bg-[#f3f4f6] p-2 sm:p-4 md:p-6 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
//       {/* HEADER */}
//       <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 mb-4 px-2 z-50">
//         <div className="flex flex-col items-center md:items-start text-center">
//           <h1 className="text-xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tighter">
//             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#1e40af] rounded-2xl shadow-xl flex items-center justify-center text-white border-b-4 border-black/10">
//                 <TrainFront size={28} />
//             </div>
//             <span>Grand Station</span>
//           </h1>
//           <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Number Sequence Lab</p>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-4 scale-90 md:scale-100">
//             <div className="bg-[#d1d5db] p-1.5 rounded-2xl shadow-inner flex items-center gap-1 border border-stone-300">
//                 <button 
//                     onClick={() => { setMode('kid'); resetLevel(0); }}
//                     className={`flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
//                 >
//                     <Play size={12} fill={mode === 'kid' ? 'currentColor' : 'none'} />
//                     KID MODE
//                 </button>
//                 <button 
//                     onClick={() => { setMode('practice'); resetLevel(puzzleIdx); }}
//                     className={`flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
//                 >
//                     <MousePointer2 size={12} fill={mode === 'practice' ? 'currentColor' : 'none'} />
//                     PRACTICE
//                 </button>
//             </div>
//             <button onClick={() => resetLevel(puzzleIdx)} className="p-3 bg-[#8d6e63] text-white rounded-xl shadow-lg border-b-4 border-[#5d4037] active:scale-95 transition-transform">
//                 <RefreshCcw size={18} />
//             </button>
//         </div>
//       </div>

//       {/* THE STATION STAGE */}
//       <div className="w-full max-w-[1440px] bg-[#94a3b8] rounded-[2.5rem] sm:rounded-[4rem] p-4 sm:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border-b-[15px] sm:border-b-[25px] border-[#64748b] relative mb-2 sm:mb-4 overflow-hidden flex flex-col items-center justify-center min-h-[420px] sm:min-h-[480px] lg:min-h-[580px]">
        
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#93c5fd44] to-transparent pointer-events-none" />
//         <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-around w-full opacity-10 pointer-events-none">
//             {[...Array(6)].map((_, i) => (
//                 <div key={i} className="w-10 sm:w-16 h-[500px] bg-black rounded-b-full shadow-2xl" />
//             ))}
//         </div>

//         <div className="absolute top-6 right-10 flex flex-col items-center opacity-40">
//             <Clock size={40} className="text-slate-800" />
//             <div className="text-[10px] font-black uppercase mt-1">Platform 01</div>
//         </div>

//         {/* TRACK FLOOR */}
//         <div className="absolute bottom-0 left-0 w-full h-[30%] bg-[#cbd5e1] border-t-8 border-[#94a3b8] z-0 shadow-inner">
//             <div className="w-full h-8 sm:h-12 bg-[#fde047] border-y-2 border-black/10 mt-2 flex justify-around items-center px-1">
//                 {[...Array(40)].map((_, i) => (
//                     <div key={i} className="w-px h-full bg-black/5" />
//                 ))}
//             </div>
            
//             <div className="absolute bottom-[30%] left-0 w-full flex flex-col gap-2.5 px-0 pointer-events-none">
//                 <div className="w-full flex justify-around px-4 opacity-50">
//                     {[...Array(25)].map((_, i) => (
//                         <div key={i} className="w-4 sm:w-6 h-12 bg-[#4e342e] rounded-sm transform -skew-x-12" />
//                     ))}
//                 </div>
//                 <div className="absolute top-2 w-full flex flex-col gap-8 opacity-80">
//                     <div className="w-full h-1.5 bg-gradient-to-r from-slate-400 via-slate-700 to-slate-400 shadow-sm" />
//                     <div className="w-full h-1.5 bg-gradient-to-r from-slate-400 via-slate-700 to-slate-400 shadow-sm" />
//                 </div>
//             </div>
//         </div>

//         {/* THE TRAIN GROUP */}
//         <motion.div 
//             animate={isDeparting ? { x: ["0%", "-220%"] } : { x: 0 }}
//             transition={{ duration: 6, ease: [0.4, 0, 0.2, 1] }}
//             className="flex items-end gap-0 relative z-20 pb-16 w-full justify-start lg:justify-center overflow-x-auto no-scrollbar px-12 sm:px-24 pt-24"
//         >
//             <div className="flex-shrink-0 w-28 sm:w-36 lg:w-52 mr-[-4px] relative">
//                 <svg viewBox="0 0 160 110" className="w-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] overflow-visible">
//                     <SmokePuff delay={0} xPos={30} />
//                     <SmokePuff delay={0.8} xPos={35} />
//                     <rect x="15" y="45" width="120" height="48" rx="6" fill="#1e293b" />
//                     <rect x="90" y="15" width="55" height="40" rx="8" fill="#991b1b" />
//                     <rect x="95" y="20" width="45" height="22" rx="4" fill="#e0f2fe" opacity="0.8" />
//                     <path d="M95 20L140 42" stroke="white" strokeWidth="0.5" opacity="0.4" />
//                     <circle cx="20" cy="69" r="6" fill="#fef08a" className="animate-pulse" />
//                     <path d="M25 45L20 12H45L40 45Z" fill="#0f172a" />
//                     <circle cx="50" cy="90" r="14" fill="#111" />
//                     <circle cx="115" cy="90" r="14" fill="#111" />
//                 </svg>
//             </div>

//             {currentPuzzle.initial.map((val, idx) => {
//                 const isBlank = val === null;
//                 const filledVal = placedCoaches[idx];
//                 const displayVal = val || filledVal;
//                 const isTargetOfFeedback = feedback?.slotIdx === idx;

//                 return (
//                     <div key={idx} className="flex items-end">
//                         <div className="w-2 sm:w-3.5 h-3 bg-[#1e293b] mb-10 relative z-0">
//                             <div className="absolute top-1/2 left-0 w-full h-1 bg-black/30" />
//                         </div>
                        
//                         <div 
//                             ref={el => slotRefs.current[idx] = el}
//                             className={`w-20 h-16 sm:w-28 sm:h-24 lg:w-36 lg:h-32 rounded-2xl flex items-center justify-center relative transition-all ${
//                                 isBlank && !filledVal ? 'border-[3px] border-dashed border-white/40 bg-black/10 shadow-inner' : ''
//                             }`}
//                         >
//                             {displayVal && (
//                                 <motion.div layoutId={isBlank ? `coach-${displayVal}` : undefined} className="w-full h-full relative">
//                                     <svg viewBox="0 0 110 90" className="w-full h-full drop-shadow-[0_12px_15px_rgba(0,0,0,0.4)] overflow-visible">
//                                         <rect x="0" y="8" width="110" height="12" rx="6" fill="#334155" />
//                                         <rect x="5" y="15" width="100" height="60" rx="4" fill={COLORS[displayVal]} />
//                                         <rect x="15" y="24" width="30" height="24" rx="3" fill="#bae6fd" opacity="0.9" />
//                                         <rect x="65" y="24" width="30" height="24" rx="3" fill="#bae6fd" opacity="0.9" />
//                                         <circle cx="30" cy="78" r="10" fill="#111" />
//                                         <circle cx="80" cy="78" r="10" fill="#111" />
//                                     </svg>
//                                     <div className="absolute inset-0 flex items-center justify-center text-white font-black text-2xl sm:text-4xl lg:text-6xl pt-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
//                                         {displayVal}
//                                     </div>
//                                 </motion.div>
//                             )}

//                             <AnimatePresence>
//                                 {isTargetOfFeedback && (
//                                     <motion.div initial={{ scale: 0, y: 10 }} animate={{ scale: 1.6, y: -50 }} exit={{ scale: 0 }} className="absolute z-50">
//                                         {feedback.isCorrect ? (
//                                             <div className="bg-emerald-500 p-2 sm:p-5 rounded-full border-4 border-white shadow-2xl">
//                                                 <CheckCircle2 className="text-white w-8 h-8 sm:w-14 sm:h-14" />
//                                             </div>
//                                         ) : (
//                                             <div className="bg-rose-500 p-2 sm:p-5 rounded-full border-4 border-white shadow-2xl">
//                                                 <XCircle className="text-white w-8 h-8 sm:w-14 sm:h-14" />
//                                             </div>
//                                         )}
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 );
//             })}
//         </motion.div>

//         {!isDeparting && (
//             <div className="mt-8 bg-black/15 p-6 sm:p-8 rounded-[3rem] border-2 border-white/10 w-full max-w-4xl backdrop-blur-xl shadow-2xl relative z-30">
//                 <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#334155] text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-2xl border border-white/20">
//                     Waiting Depot
//                 </div>
//                 <div className="flex justify-center gap-6 sm:gap-14 flex-wrap pt-4">
//                     {currentPuzzle.missing.map(num => (
//                         !Object.values(placedCoaches).includes(num) && (
//                             <motion.button
//                                 key={`option-${num}`}
//                                 layoutId={`coach-${num}`}
//                                 ref={el => optionRefs.current[num] = el}
//                                 drag={!isAutoPlaying}
//                                 dragSnapToOrigin
//                                 onDragEnd={(_, info) => {
//                                     // Hit detect logic: Check ALL empty slots
//                                     const emptySlotIndices = currentPuzzle.initial
//                                         .map((v, i) => (v === null && !placedCoaches[i] ? i : null))
//                                         .filter(v => v !== null);

//                                     let targetSlot = -1;
//                                     for (const i of emptySlotIndices) {
//                                         const rect = slotRefs.current[i].getBoundingClientRect();
//                                         if (info.point.x > rect.left && info.point.x < rect.right && 
//                                             info.point.y > rect.top && info.point.y < rect.bottom) {
//                                             targetSlot = i;
//                                             break;
//                                         }
//                                     }

//                                     if (targetSlot !== -1) {
//                                         handlePlace(num, targetSlot);
//                                     }
//                                 }}
//                                 onClick={() => {
//                                     // Default to first empty for tap convenience
//                                     const firstBlank = currentPuzzle.initial.findIndex((v, i) => v === null && !placedCoaches[i]);
//                                     if (firstBlank !== -1) handlePlace(num, firstBlank);
//                                 }}
//                                 whileHover={{ scale: 1.1, y: -10 }}
//                                 className="w-20 h-16 sm:w-32 sm:h-26 lg:w-44 lg:h-36 relative cursor-grab active:cursor-grabbing"
//                             >
//                                 <svg viewBox="0 0 110 90" className="w-full h-full drop-shadow-2xl overflow-visible">
//                                     <rect x="0" y="8" width="110" height="12" rx="6" fill="#475569" />
//                                     <rect x="5" y="15" width="100" height="60" rx="6" fill={COLORS[num]} />
//                                     <circle cx="30" cy="78" r="10" fill="#111" />
//                                     <circle cx="80" cy="78" r="10" fill="#111" />
//                                 </svg>
//                                 <div className="absolute inset-0 flex items-center justify-center text-white font-black text-3xl sm:text-5xl lg:text-7xl pt-4">
//                                     {num}
//                                 </div>
//                             </motion.button>
//                         )
//                     ))}
//                 </div>
//             </div>
//         )}

//         <AnimatePresence>
//             {isDeparting && (
//                 <motion.div 
//                     initial={{ y: 100, opacity: 0 }} 
//                     animate={{ y: -20, opacity: 1 }} 
//                     className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6"
//                 >
//                     <div className="bg-emerald-600 text-white py-4 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
//                         <Trophy size={28} className="animate-bounce shrink-0" />
//                         <span className="text-sm sm:text-xl font-black uppercase tracking-tight text-center">
//                             Train Coupled and Leaving Platform!
//                         </span>
//                         <Sparkles size={24} className="text-yellow-300" />
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//       </div>

//       {/* NAVIGATION */}
//       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center px-2 mt-2 pb-2">
//           <div className="flex flex-col gap-1">
//             <button 
//               onClick={() => resetLevel((puzzleIdx + 1) % PUZZLES.length)}
//               className={`group relative flex items-center justify-between w-full p-4 sm:p-7 rounded-[2rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-8 ${
//                 autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-[#1e40af] hover:bg-[#1e3a8a] text-white border-[#172554]'
//               }`}
//             >
//               <div className="flex items-center gap-2 sm:gap-5 z-10">
//                 <div className="bg-white/20 p-2 sm:p-4 rounded-xl">
//                    <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
//                 </div>
//                 <div className="text-left">
//                   <div className="leading-tight sm:text-3xl font-black uppercase">
//                     {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT MISSION'}
//                   </div>
//                   {autoNextTimer !== null && (
//                     <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Departing...</div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex items-center relative z-10">
//                 {autoNextTimer !== null ? (
//                   <div className="flex items-center gap-2 sm:gap-5 bg-black/40 px-4 py-2 sm:px-10 sm:py-5 rounded-xl sm:rounded-[2.5rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[150px] sm:min-w-[280px]">
//                     <div className="flex items-center gap-2 shrink-0">
//                       <Timer size={24} className="animate-spin text-emerald-200" />
//                       <span className="text-lg sm:text-4xl font-mono leading-none">{autoNextTimer}</span>
//                     </div>
                    
//                     <div className="flex justify-between w-full px-3 items-center relative">
//                         {[...Array(10)].map((_, i) => (
//                             <div key={`step-${i}`} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>
//                                 👣
//                             </div>
//                         ))}
//                         <motion.div 
//                             animate={{ 
//                                 left: `${((10 - autoNextTimer) / 10) * 100}%`,
//                                 scaleX: -1
//                             }}
//                             className="absolute top-1/2 -translate-y-1/2 text-base sm:text-4xl pointer-events-none"
//                             style={{ x: '-50%' }}
//                         >
//                             🏃
//                         </motion.div>
//                     </div>
//                   </div>
//                 ) : (
//                   <FastForward className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-10 sm:h-10" />
//                 )}
//               </div>

//               {autoNextTimer !== null && (
//                 <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
//                   className="absolute inset-0 bg-emerald-800/20 rounded-[2rem] sm:rounded-[3rem] pointer-events-none" />
//               )}
//             </button>
//           </div>

//           <div className="flex flex-col gap-1">
//             <button onClick={() => resetLevel(Math.floor(Math.random() * PUZZLES.length))} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#374151] hover:bg-[#1f2937] text-white p-4 sm:p-7 rounded-[2rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-8 border-[#111827]">
//               <Shuffle size={24} className="sm:w-10 sm:h-10" />
//               <span className="uppercase font-black">Shuffle Mission</span>
//             </button>
//           </div>
//       </div>

//       <AnimatePresence>
//         {mode === 'kid' && virtualHandPos && (
//             <motion.div 
//                 initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
//                 transition={{ duration: 1.2, ease: "easeInOut" }}
//                 className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
//                 style={{ position: 'fixed' }}
//             >
//                 <div className="relative">
//                     <Hand className="text-stone-800 w-12 h-12 sm:w-28 sm:h-28" fill="white" />
//                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl" />
//                 </div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, TrainFront,
  Trophy, Clock, Sparkles
} from 'lucide-react';

// --- Puzzle Scenarios ---
const PUZZLES = [
  { id: 1, initial: [1, null, 3, 4, 5], missing: [2] },
  { id: 2, initial: [1, 2, null, 4, 5], missing: [3] },
  { id: 3, initial: [null, 2, 3, 4, 5], missing: [1] },
  { id: 4, initial: [1, null, 3, null, 5], missing: [2, 4] },
  { id: 5, initial: [null, 2, null, 4, 5], missing: [1, 3] },
];

const COLORS = {
  1: '#F43F5E', 2: '#F59E0B', 3: '#10B981', 4: '#3B82F6', 5: '#8B5CF6',
};

// --- Animated Smoke Component ---
const SmokePuff = ({ delay, xPos = 35 }) => (
  <motion.circle
    cx={xPos} cy="12" r="5"
    fill="#ffffff"
    initial={{ y: 0, opacity: 0, scale: 0.5 }}
    animate={{ y: -50, opacity: [0, 0.4, 0], scale: [0.5, 3] }}
    transition={{ duration: 2.5, repeat: Infinity, delay: delay, ease: "easeOut" }}
  />
);

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [placedCoaches, setPlacedCoaches] = useState({}); 
  const [isDeparting, setIsDeparting] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [feedback, setFeedback] = useState(null); 

  const timerIntervalRef = useRef(null);
  const slotRefs = useRef([]);
  const optionRefs = useRef({});
  const audioCtxRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  const modeRef = useRef(mode);
  const isDepartingRef = useRef(isDeparting);
  const placedCoachesRef = useRef(placedCoaches);

  useEffect(() => {
    modeRef.current = mode;
    isDepartingRef.current = isDeparting;
    placedCoachesRef.current = placedCoaches;
  }, [mode, isDeparting, placedCoaches]);

  const currentPuzzle = PUZZLES[puzzleIdx];

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.1;
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playWhistle = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch(e) {}
  }, [isMuted]);

  useEffect(() => {
    const missingCount = currentPuzzle.missing.length;
    const currentCount = Object.keys(placedCoaches).length;

    if (currentCount === missingCount && currentCount > 0 && !isDeparting) {
        const timer = setTimeout(() => {
            setIsDeparting(true);
            playWhistle();
            speak("Train coupled and leaving platform!");
            setAutoNextTimer(10);
        }, 1200);
        return () => clearTimeout(timer);
    }
  }, [placedCoaches, currentPuzzle, isDeparting, playWhistle, speak]);

  const handlePlace = useCallback((val, slotIdx, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isTutorial && modeRef.current !== 'kid') return;
    if (placedCoaches[slotIdx]) return;

    const expected = slotIdx + 1;
    if (val === expected) {
      setPlacedCoaches(prev => ({ ...prev, [slotIdx]: val }));
      setFeedback({ slotIdx, isCorrect: true });
      speak(`Coach ${val} coupled!`);
    } else {
      setFeedback({ slotIdx, isCorrect: false });
      speak(`Try again! That is coach ${val}. We need coach ${expected} here.`);
      if (!isTutorial) {
        setTimeout(() => setFeedback(null), 2000);
      }
    }
  }, [placedCoaches, isAutoPlaying, speak]);

  const moveHand = async (fromRect, toRect) => {
    if (modeRef.current !== 'kid') return;
    setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
    await new Promise(r => setTimeout(r, 1000));
    if (modeRef.current !== 'kid') return;
    setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
    await new Promise(r => setTimeout(r, 1400));
  };

  const startKidModeTutorial = useCallback(async () => {
    if (tutorialActiveRef.current || isDeparting) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);

    await new Promise(r => setTimeout(r, 2000));
    if (modeRef.current !== 'kid' || isDepartingRef.current) {
        tutorialActiveRef.current = false;
        setIsAutoPlaying(false);
        return;
    }

    const missingIndices = currentPuzzle.initial
      .map((val, idx) => (val === null ? idx : null))
      .filter(v => v !== null);

    for (const slotIdx of missingIndices) {
      if (modeRef.current !== 'kid' || isDepartingRef.current) break;
      if (slotIdx !== missingIndices[0]) await new Promise(r => setTimeout(r, 1200));
      if (modeRef.current !== 'kid' || isDepartingRef.current) break;

      const targetValue = slotIdx + 1;
      speak(`Let's couple coach ${targetValue}.`);
      await new Promise(r => setTimeout(r, 2200));
      if (modeRef.current !== 'kid' || isDepartingRef.current) break;

      if (!slotRefs.current[slotIdx]) continue;
      const slotRect = slotRefs.current[slotIdx].getBoundingClientRect();

      const availableOptions = currentPuzzle.missing.filter(v => 
        !Object.values(placedCoachesRef.current).includes(v)
      );
      
      const wrongValue = availableOptions.find(v => v !== targetValue) || targetValue;
      
      if (optionRefs.current[wrongValue]) {
        const optionRect = optionRefs.current[wrongValue].getBoundingClientRect();
        await moveHand(optionRect, slotRect);
        if (modeRef.current !== 'kid') break;
        handlePlace(wrongValue, slotIdx, true);
        await new Promise(r => setTimeout(r, 3200));
      }

      if (wrongValue !== targetValue && optionRefs.current[targetValue]) {
          if (modeRef.current !== 'kid') break;
          setFeedback(null);
          await new Promise(r => setTimeout(r, 600));
          if (modeRef.current !== 'kid') break;
          const correctOptionRect = optionRefs.current[targetValue].getBoundingClientRect();
          await moveHand(correctOptionRect, slotRect);
          if (modeRef.current !== 'kid') break;
          handlePlace(targetValue, slotIdx, true);
          await new Promise(r => setTimeout(r, 1500));
      }
    }

    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    tutorialActiveRef.current = false;
  }, [currentPuzzle, handlePlace, speak, isDeparting]);

  const resetLevel = useCallback((idx) => {
    setPuzzleIdx(idx);
    setPlacedCoaches({});
    placedCoachesRef.current = {};
    setIsDeparting(false);
    setAutoNextTimer(null);
    setFeedback(null);
    setIsAutoPlaying(false);
    tutorialActiveRef.current = false;
    setVirtualHandPos(null);
    speak("Complete the sequence!");
  }, [speak]);

  useEffect(() => {
    if (mode === 'kid' && !isDeparting && !tutorialActiveRef.current) {
      const t = setTimeout(startKidModeTutorial, 2000);
      return () => clearTimeout(t);
    } else if (mode === 'practice') {
      setIsAutoPlaying(false);
      setVirtualHandPos(null);
      tutorialActiveRef.current = false;
    }
  }, [mode, puzzleIdx, isDeparting, startKidModeTutorial]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      const next = (puzzleIdx + 1) % PUZZLES.length;
      resetLevel(next);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, puzzleIdx, resetLevel]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] p-2 sm:p-4 md:p-6 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
      {/* HEADER */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 mb-4 px-2 z-50">
        <div className="flex flex-col items-center md:items-start text-center">
          <h1 className="text-xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tighter">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#1e40af] rounded-2xl shadow-xl flex items-center justify-center text-white border-b-4 border-black/10">
                <TrainFront size={28} />
            </div>
            <span>Grand Station</span>
          </h1>
          <p className="text-[8px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Number Sequence Lab</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 scale-90 md:scale-100">
            <div className="bg-[#d1d5db] p-1.5 rounded-2xl shadow-inner flex items-center gap-1 border border-stone-300">
                <button 
                    onClick={() => { setMode('kid'); resetLevel(0); }}
                    className={`flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
                >
                    <Play size={12} fill={mode === 'kid' ? 'currentColor' : 'none'} />
                    KID MODE
                </button>
                <button 
                    onClick={() => { setMode('practice'); resetLevel(puzzleIdx); }}
                    className={`flex items-center gap-1.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
                >
                    <MousePointer2 size={12} fill={mode === 'practice' ? 'currentColor' : 'none'} />
                    PRACTICE
                </button>
            </div>
            <button onClick={() => resetLevel(puzzleIdx)} className="p-3 bg-[#8d6e63] text-white rounded-xl shadow-lg border-b-4 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={18} />
            </button>
        </div>
      </div>

      {/* THE STATION STAGE - FLUID RESPONSIVE WIDTH */}
      <div className="w-full max-w-[1440px] bg-[#94a3b8] rounded-[2.5rem] sm:rounded-[4rem] p-2 sm:p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border-b-[15px] sm:border-b-[25px] border-[#64748b] relative mb-2 sm:mb-4 overflow-hidden flex flex-col items-center justify-center min-h-[350px] sm:min-h-[480px] lg:min-h-[580px]">
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#93c5fd44] to-transparent pointer-events-none" />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-around w-full opacity-10 pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="w-6 sm:w-16 h-[500px] bg-black rounded-b-full shadow-2xl" />
            ))}
        </div>

        <div className="absolute top-4 right-6 sm:top-6 sm:right-10 flex flex-col items-center opacity-40">
            <Clock size={28} className="text-slate-800 sm:w-10 sm:h-10" />
            <div className="text-[8px] sm:text-[10px] font-black uppercase mt-1 text-center">Platform 01</div>
        </div>

        {/* TRACK FLOOR */}
        <div className="absolute bottom-0 left-0 w-full h-[32%] bg-[#cbd5e1] border-t-4 sm:border-t-8 border-[#94a3b8] z-0 shadow-inner">
            <div className="w-full h-6 sm:h-12 bg-[#fde047] border-y-2 border-black/10 mt-2 flex justify-around items-center px-1">
                {[...Array(40)].map((_, i) => (
                    <div key={i} className="w-px h-full bg-black/5" />
                ))}
            </div>
            
            <div className="absolute bottom-[30%] left-0 w-full flex flex-col gap-2 sm:gap-2.5 px-0 pointer-events-none">
                <div className="w-full flex justify-around px-2 sm:px-4 opacity-50">
                    {[...Array(25)].map((_, i) => (
                        <div key={i} className="w-3 sm:w-6 h-8 sm:h-12 bg-[#4e342e] rounded-sm transform -skew-x-12" />
                    ))}
                </div>
                <div className="absolute top-2 w-full flex flex-col gap-8 opacity-80">
                    <div className="w-full h-1.5 bg-gradient-to-r from-slate-400 via-slate-700 to-slate-400 shadow-sm" />
                    <div className="w-full h-1.5 bg-gradient-to-r from-slate-400 via-slate-700 to-slate-400 shadow-sm" />
                </div>
            </div>
        </div>

        {/* THE TRAIN GROUP - FLUID FLEX PREVENTS HORIZONTAL SCROLL */}
        <motion.div 
            animate={isDeparting ? { x: ["0%", "-200%"] } : { x: 0 }}
            transition={{ duration: 6, ease: [0.4, 0, 0.2, 1] }}
            className="flex items-end gap-0 relative z-20 pb-12 sm:pb-20 w-full justify-center px-2 sm:px-10 pt-16 sm:pt-24 flex-nowrap"
        >
            {/* LOCOMOTIVE - FLUID WIDTH */}
            <div className="flex-shrink-0 w-[16%] max-w-[200px] mr-[-2px] relative">
                <svg viewBox="0 0 160 110" className="w-full drop-shadow-[0_12px_12px_rgba(0,0,0,0.5)] overflow-visible">
                    <SmokePuff delay={0} xPos={30} />
                    <SmokePuff delay={0.8} xPos={35} />
                    <rect x="15" y="45" width="120" height="48" rx="6" fill="#1e293b" />
                    <rect x="90" y="15" width="55" height="40" rx="8" fill="#991b1b" />
                    <rect x="95" y="20" width="45" height="22" rx="4" fill="#e0f2fe" opacity="0.8" />
                    <path d="M95 20L140 42" stroke="white" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="20" cy="69" r="6" fill="#fef08a" className="animate-pulse" />
                    <path d="M25 45L20 12H45L40 45Z" fill="#0f172a" />
                    <circle cx="50" cy="90" r="14" fill="#111" />
                    <circle cx="115" cy="90" r="14" fill="#111" />
                </svg>
            </div>

            {/* Slots / Coaches - FLUID WIDTHS ENSURE 100% SCREEN FIT */}
            {currentPuzzle.initial.map((val, idx) => {
                const isBlank = val === null;
                const filledVal = placedCoaches[idx];
                const displayVal = val || filledVal;
                const isTargetOfFeedback = feedback?.slotIdx === idx;

                return (
                    <div key={idx} className="flex items-end w-[14%] max-w-[180px]">
                        <div className="w-[10%] h-2 sm:h-3 bg-[#1e293b] mb-6 sm:mb-10 relative z-0 flex-shrink-0">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/30" />
                        </div>
                        
                        <div 
                            ref={el => slotRefs.current[idx] = el}
                            className={`w-full aspect-[4/5] sm:aspect-[11/9] rounded-lg sm:rounded-2xl flex items-center justify-center relative transition-all ${
                                isBlank && !filledVal ? 'border-2 sm:border-[3px] border-dashed border-white/40 bg-black/10 shadow-inner' : ''
                            }`}
                        >
                            {displayVal && (
                                <motion.div layoutId={isBlank ? `coach-${displayVal}` : undefined} className="w-full h-full relative">
                                    <svg viewBox="0 0 110 90" className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)] overflow-visible">
                                        <rect x="0" y="8" width="110" height="12" rx="6" fill="#334155" />
                                        <rect x="5" y="15" width="100" height="60" rx="4" fill={COLORS[displayVal]} />
                                        <rect x="15" y="24" width="30" height="24" rx="3" fill="#bae6fd" opacity="0.9" />
                                        <rect x="65" y="24" width="30" height="24" rx="3" fill="#bae6fd" opacity="0.9" />
                                        <circle cx="30" cy="78" r="10" fill="#111" />
                                        <circle cx="80" cy="78" r="10" fill="#111" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl sm:text-5xl lg:text-7xl pt-2 sm:pt-4 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
                                        {displayVal}
                                    </div>
                                </motion.div>
                            )}

                            <AnimatePresence>
                                {isTargetOfFeedback && (
                                    <motion.div initial={{ scale: 0, y: 10 }} animate={{ scale: 1.6, y: -50 }} exit={{ scale: 0 }} className="absolute z-50">
                                        {feedback.isCorrect ? (
                                            <div className="bg-emerald-500 p-1 sm:p-5 rounded-full border-2 sm:border-4 border-white shadow-2xl">
                                                <CheckCircle2 className="text-white w-5 h-5 sm:w-14 sm:h-14" />
                                            </div>
                                        ) : (
                                            <div className="bg-rose-500 p-1 sm:p-5 rounded-full border-2 sm:border-4 border-white shadow-2xl">
                                                <XCircle className="text-white w-5 h-5 sm:w-14 sm:h-14" />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </motion.div>

        {/* WAITING AREA - ADAPTIVE GRID */}
        {!isDeparting && (
            <div className="mt-4 sm:mt-8 bg-black/15 p-4 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-2 border-white/10 w-[95%] sm:w-full max-w-4xl backdrop-blur-xl shadow-2xl relative z-30">
                <div className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 bg-[#334155] text-white px-4 sm:px-8 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs font-black uppercase tracking-[0.3em] shadow-2xl border border-white/20 whitespace-nowrap">
                    Waiting Depot
                </div>
                <div className="flex justify-center gap-4 sm:gap-14 flex-wrap pt-2 sm:pt-4">
                    {currentPuzzle.missing.map(num => (
                        !Object.values(placedCoaches).includes(num) && (
                            <motion.button
                                key={`option-${num}`}
                                layoutId={`coach-${num}`}
                                ref={el => optionRefs.current[num] = el}
                                drag={!isAutoPlaying}
                                dragSnapToOrigin
                                onDragEnd={(_, info) => {
                                    const emptySlotIndices = currentPuzzle.initial
                                        .map((v, i) => (v === null && !placedCoaches[i] ? i : null))
                                        .filter(v => v !== null);

                                    let targetSlot = -1;
                                    for (const i of emptySlotIndices) {
                                        const rect = slotRefs.current[i].getBoundingClientRect();
                                        if (info.point.x > rect.left && info.point.x < rect.right && 
                                            info.point.y > rect.top && info.point.y < rect.bottom) {
                                            targetSlot = i;
                                            break;
                                        }
                                    }
                                    if (targetSlot !== -1) handlePlace(num, targetSlot);
                                }}
                                onClick={() => {
                                    const firstBlank = currentPuzzle.initial.findIndex((v, i) => v === null && !placedCoaches[i]);
                                    if (firstBlank !== -1) handlePlace(num, firstBlank);
                                }}
                                whileHover={{ scale: 1.1, y: -10 }}
                                className="w-[18vw] h-[14vw] sm:w-40 sm:h-30 max-w-[150px] max-h-[120px] relative cursor-grab active:cursor-grabbing"
                            >
                                <svg viewBox="0 0 110 90" className="w-full h-full drop-shadow-2xl overflow-visible">
                                    <rect x="0" y="8" width="110" height="12" rx="6" fill="#475569" />
                                    <rect x="5" y="15" width="100" height="60" rx="6" fill={COLORS[num]} />
                                    <circle cx="30" cy="78" r="10" fill="#111" />
                                    <circle cx="80" cy="78" r="10" fill="#111" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xl sm:text-7xl pt-4">
                                    {num}
                                </div>
                            </motion.button>
                        )
                    ))}
                </div>
            </div>
        )}

        {/* COMPACT STATUS RIBBON */}
        <AnimatePresence>
            {isDeparting && (
                <motion.div 
                    initial={{ y: 100, opacity: 0 }} 
                    animate={{ y: -20, opacity: 1 }} 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 z-[100] w-[90%] sm:w-full max-w-2xl"
                >
                    <div className="bg-emerald-600 text-white py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-2xl flex items-center justify-center gap-2 sm:gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
                        <Trophy size={20} className="animate-bounce shrink-0 sm:w-7 sm:h-7" />
                        <span className="text-[10px] sm:text-xl font-black uppercase tracking-tight text-center">
                            Train Coupled and Leaving Platform!
                        </span>
                        <Sparkles size={16} className="text-yellow-300 hidden sm:block" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* NAVIGATION */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center px-2 mt-2 pb-2">
          <div className="flex flex-col gap-1">
            <button 
              onClick={() => resetLevel((puzzleIdx + 1) % PUZZLES.length)}
              className={`group relative flex items-center justify-between w-full p-4 sm:p-7 rounded-[2rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-8 ${
                autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-[#1e40af] hover:bg-[#1e3a8a] text-white border-[#172554]'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-5 z-10">
                <div className="bg-white/20 p-2 sm:p-4 rounded-xl">
                   <ChevronRight className="w-6 h-6 sm:w-10 sm:h-10" />
                </div>
                <div className="text-left">
                  <div className="leading-tight sm:text-3xl font-black uppercase">
                    {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT MISSION'}
                  </div>
                  {autoNextTimer !== null && (
                    <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Departing...</div>
                  )}
                </div>
              </div>

              {/* PILL TIMER WITH RIGHT-FACING RUNNER */}
              <div className="flex items-center relative z-10">
                {autoNextTimer !== null ? (
                  <div className="flex items-center gap-2 sm:gap-5 bg-black/40 px-4 py-2 sm:px-10 sm:py-5 rounded-xl sm:rounded-[3rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Timer size={22} className="animate-spin text-emerald-200 sm:w-6 sm:h-6" />
                      <span className="text-sm sm:text-4xl font-mono leading-none">{autoNextTimer}</span>
                    </div>
                    
                    <div className="flex justify-between w-full px-2 sm:px-3 items-center relative">
                        {[...Array(10)].map((_, i) => (
                            <div key={`step-${i}`} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>
                                👣
                            </div>
                        ))}
                        <motion.div 
                            animate={{ 
                                left: `${((10 - autoNextTimer) / 10) * 100}%`,
                                scaleX: -1 // Character forced to face right (forward)
                            }}
                            className="absolute top-1/2 -translate-y-1/2 text-base sm:text-4xl pointer-events-none"
                            style={{ x: '-50%' }}
                        >
                            🏃
                        </motion.div>
                    </div>
                  </div>
                ) : (
                  <FastForward className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-10 sm:h-10" />
                )}
              </div>

              {autoNextTimer !== null && (
                <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
                  className="absolute inset-0 bg-emerald-800/20 rounded-[2rem] sm:rounded-[3rem] pointer-events-none" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button onClick={() => resetLevel(Math.floor(Math.random() * PUZZLES.length))} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#374151] hover:bg-[#1f2937] text-white p-4 sm:p-7 rounded-[2rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-8 border-[#111827]">
              <Shuffle size={24} className="sm:w-10 sm:h-10" />
              <span className="uppercase font-black">Shuffle Mission</span>
            </button>
          </div>
      </div>

      {/* VIRTUAL HAND */}
      <AnimatePresence>
        {mode === 'kid' && virtualHandPos && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand className="text-stone-800 w-10 h-10 sm:w-28 sm:h-28" fill="white" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}