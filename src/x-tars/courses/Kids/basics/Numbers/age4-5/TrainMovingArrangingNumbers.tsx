// // import React, { useState, useCallback } from 'react';
// // import { useGameModule } from '@/hooks/useGameModule';

// // const TrainMovingArrangingNumbers: React.FC = () => {
// //   const { speak, playSuccessSound, playErrorSound, playClickSound } = useGameModule();

// //   const [trainCars, setTrainCars] = useState([3, 1, 4, 2, 5]);
// //   const [score, setScore] = useState(0);
// //   const [showSuccess, setShowSuccess] = useState(false);

// //   const correctOrder = [1, 2, 3, 4, 5];

// //   const handleCarClick = (index: number) => {
// //     playClickSound();
// //     const newCars = [...trainCars];
// //     if (index > 0) {
// //       // Swap with previous car
// //       [newCars[index], newCars[index - 1]] = [newCars[index - 1], newCars[index]];
// //       setTrainCars(newCars);

// //       if (JSON.stringify(newCars) === JSON.stringify(correctOrder)) {
// //         playSuccessSound();
// //         setScore(prev => prev + 1);
// //         setShowSuccess(true);
// //         speak('Perfect! The train cars are in order!');
// //         setTimeout(() => {
// //           setShowSuccess(false);
// //           // Generate new sequence
// //           const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
// //           setTrainCars(shuffled);
// //         }, 2000);
// //       }
// //     }
// //   };

// //   const handlePlayInstructions = () => {
// //     speak('Click the train cars to move them and arrange them in order from 1 to 5!');
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 flex items-center justify-center p-4">
// //       <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
// //         <div className="flex justify-between items-center mb-6">
// //           <h1 className="text-3xl font-extrabold text-blue-700">🚂 Number Train Sequence</h1>
// //           <button onClick={handlePlayInstructions} className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">🔊 Instructions</button>
// //         </div>

// //         <div className="text-center mb-6">
// //           <div className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-bold text-lg">Score: {score}</div>
// //         </div>

// //         <div className="text-center mb-6">
// //           <p className="text-xl font-bold text-gray-700 mb-4">Arrange the train cars in order from 1 to 5!</p>
// //           <div className="flex justify-center items-center gap-2">
// //             {trainCars.map((number, index) => (
// //               <button
// //                 key={index}
// //                 onClick={() => handleCarClick(index)}
// //                 className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white text-2xl font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
// //               >
// //                 {number}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {showSuccess && (
// //           <div className="text-center p-6 bg-green-500 rounded-2xl animate-pulse">
// //             <div className="text-6xl mb-2">🎉</div>
// //             <div className="text-3xl font-extrabold text-white">Perfect! Train cars are in order!</div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default TrainMovingArrangingNumbers;

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Trophy, RefreshCcw, CheckCircle2, 
//   Hand, Sparkles, Play, MousePointer2, 
//   Timer, ChevronRight, Shuffle, AlertCircle, 
//   FastForward, XCircle, Volume2, VolumeX
// } from 'lucide-react';

// // --- Constants & Data ---
// const COLORS = [
//   '#e63946', // Coach 1
//   '#f4a261', // Coach 2
//   '#e9c46a', // Coach 3
//   '#2a9d8f', // Coach 4
//   '#264653', // Coach 5
// ];

// const NUMBERS = Array.from({ length: 5 }, (_, i) => ({
//   value: i + 1,
//   color: COLORS[i],
// }));

// export default function App() {
//   const [mode, setMode] = useState('practice'); 
//   const [currentTarget, setCurrentTarget] = useState(NUMBERS[0]);
//   const [score, setScore] = useState(0);
//   const [isAnswered, setIsAnswered] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [selectedIdx, setSelectedIdx] = useState(null);
//   const [autoNextTimer, setAutoNextTimer] = useState(null);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
//   const [virtualHandPos, setVirtualHandPos] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
  
//   const timerIntervalRef = useRef(null);
//   const coachRefs = useRef([]);
//   const audioCtxRef = useRef(null);
//   const soundIntervalRef = useRef(null);
//   const tutorialActiveRef = useRef(false);

//   // Audio Engine: Synthesized Train Chug
//   const initAmbientSound = useCallback(() => {
//     if (isMuted) return;
//     try {
//       if (!audioCtxRef.current) {
//         audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       }
      
//       if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
//       soundIntervalRef.current = setInterval(() => {
//         if (isMuted || isCorrect || audioCtxRef.current.state === 'suspended') return; 
        
//         const osc = audioCtxRef.current.createOscillator();
//         const gain = audioCtxRef.current.createGain();
        
//         osc.type = 'triangle';
//         osc.frequency.setValueAtTime(45, audioCtxRef.current.currentTime);
//         gain.gain.setValueAtTime(0.01, audioCtxRef.current.currentTime);
//         gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.15);
        
//         osc.connect(gain);
//         gain.connect(audioCtxRef.current.destination);
        
//         osc.start();
//         osc.stop(audioCtxRef.current.currentTime + 0.15);
//       }, 800);
//     } catch (e) {
//       console.warn("Audio context blocked");
//     }
//   }, [isMuted, isCorrect]);

//   useEffect(() => {
//     initAmbientSound();
//     return () => {
//       if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
//       if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
//     };
//   }, [initAmbientSound]);

//   const speak = useCallback((text) => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1.0;
//       utterance.pitch = 1.1;
//       window.speechSynthesis.speak(utterance);
//     }
//   }, []);

//   const handleSelect = useCallback((idx, isTutorial = false) => {
//     // Block interaction during tutorial autoplay unless triggered by logic
//     if (!isTutorial && isAutoPlaying) return;
//     if (isAnswered && isCorrect) return;

//     const val = idx + 1;
//     setSelectedIdx(idx);
//     setIsAnswered(true);

//     if (val === currentTarget.value) {
//       setIsCorrect(true);
//       setScore(s => s + 1);
//       speak(`Great choice! Coach number ${val}!`);
//       setAutoNextTimer(10);
//     } else {
//       setIsCorrect(false);
//       speak(`Is this coach ${currentTarget.value}? No, this is coach ${val}.`);
//       if (!isTutorial) {
//         setTimeout(() => {
//           setIsAnswered(false);
//           setSelectedIdx(null);
//         }, 2500);
//       }
//     }
//   }, [currentTarget.value, isAnswered, isCorrect, isAutoPlaying, speak]);

//   const moveHandToCoach = useCallback((idx) => {
//     return new Promise(resolve => {
//       if (!coachRefs.current[idx]) return resolve();
//       const rect = coachRefs.current[idx].getBoundingClientRect();
//       setVirtualHandPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
//       setTimeout(resolve, 1000);
//     });
//   }, []);

//   const startKidModeTutorial = useCallback(async (val) => {
//     if (tutorialActiveRef.current) return;
//     tutorialActiveRef.current = true;
//     setIsAutoPlaying(true);
    
//     speak(`Let's find coach number ${val}.`);
//     await new Promise(r => setTimeout(r, 1200));
    
//     // 1. Intentional Mistake Demo
//     const wrongIdx = val === 1 ? 1 : 0; 
//     await moveHandToCoach(wrongIdx);
//     handleSelect(wrongIdx, true); 
//     await new Promise(r => setTimeout(r, 3200)); 
    
//     // 2. Reset and Correct Selection
//     setIsAnswered(false);
//     setSelectedIdx(null);
//     await new Promise(r => setTimeout(r, 800));

//     const correctIdx = val - 1;
//     await moveHandToCoach(correctIdx);
//     handleSelect(correctIdx, true);
    
//     setIsAutoPlaying(false);
//     setVirtualHandPos(null);
//     // tutorialActiveRef remains true until target changes to prevent re-triggering
//   }, [moveHandToCoach, handleSelect, speak]);

//   const resetLevel = useCallback((target) => {
//     setCurrentTarget(target);
//     setIsAnswered(false);
//     setIsCorrect(false);
//     setSelectedIdx(null);
//     setAutoNextTimer(null);
//     setIsAutoPlaying(false);
//     setVirtualHandPos(null);
//     tutorialActiveRef.current = false;

//     if (mode === 'practice') {
//       speak(`Find coach number ${target.value}.`);
//     }
//   }, [mode, speak]);

//   useEffect(() => {
//     if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current) {
//         const timer = setTimeout(() => {
//             startKidModeTutorial(currentTarget.value);
//         }, 1500);
//         return () => clearTimeout(timer);
//     }
//   }, [currentTarget, mode, isCorrect, startKidModeTutorial]);

//   const handleNextSequential = useCallback(() => {
//     const idx = NUMBERS.findIndex(n => n.value === currentTarget.value);
//     const next = NUMBERS[(idx + 1) % NUMBERS.length];
//     resetLevel(next);
//   }, [currentTarget.value, resetLevel]);

//   const handleNextRandom = () => {
//     const available = NUMBERS.filter(n => n.value !== currentTarget.value);
//     const next = available[Math.floor(Math.random() * available.length)];
//     resetLevel(next);
//   };

//   useEffect(() => {
//     if (autoNextTimer !== null && autoNextTimer > 0) {
//       timerIntervalRef.current = setInterval(() => {
//         setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
//       }, 1000);
//     } else if (autoNextTimer === 0) {
//       handleNextSequential();
//     }
//     return () => clearInterval(timerIntervalRef.current);
//   }, [autoNextTimer, handleNextSequential]);

//   return (
//     <div className="min-h-screen bg-[#fcfaf7] p-2 sm:p-4 md:p-6 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
//       {/* Header */}
//       <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 mb-3 sm:mb-4 px-2">
//         <div className="flex flex-col items-center md:items-start text-center">
//           <h1 className="text-xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tighter">
//             <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/10 text-lg sm:text-xl">
//                 <span>🚂</span>
//             </div>
//             <span>Number Train</span>
//           </h1>
//           <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identification Lab</p>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100">
//             <div className="bg-[#e2d6c3] p-1 rounded-xl shadow-inner flex items-center gap-1 border border-stone-300">
//                 <button 
//                     onClick={() => setMode('kid')}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
//                 >
//                     <Play size={10} fill={mode === 'kid' ? 'currentColor' : 'none'} />
//                     KID MODE
//                 </button>
//                 <button 
//                     onClick={() => setMode('practice')}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
//                 >
//                     <MousePointer2 size={10} fill={mode === 'practice' ? 'currentColor' : 'none'} />
//                     PRACTICE
//                 </button>
//             </div>
//             <button 
//                 onClick={() => {
//                     if (audioCtxRef.current) audioCtxRef.current.resume();
//                     setIsMuted(!isMuted);
//                 }}
//                 className="p-2 sm:p-2.5 bg-white border border-stone-200 rounded-lg shadow-sm text-stone-500 active:scale-95 transition-transform"
//             >
//                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//             </button>
//         </div>
      
//         <div className="flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100">
//           <div className="bg-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
//             <span className="text-[7px] uppercase font-black opacity-40">Correct</span>
//             <span className="text-base sm:text-xl font-black text-blue-600">{score}</span>
//           </div>
//           <button onClick={() => resetLevel(currentTarget)} className="p-2 sm:p-2.5 bg-[#8d6e63] text-white rounded-lg shadow-md border-b-4 border-[#5d4037]">
//             <RefreshCcw size={16} />
//           </button>
//         </div>
//       </div>

//       {/* THE STAGE */}
//       <div className="w-full max-w-7xl bg-[#dfc4a1] rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border-b-8 sm:border-b-[12px] border-[#c4a484] relative mb-4 sm:mb-6 overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[580px]">
        
//         {/* Goal Indicator */}
//         <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col items-center">
//             <motion.div 
//                 key={currentTarget.value}
//                 initial={{ scale: 0.5, y: -10 }}
//                 animate={{ scale: 1, y: 0 }}
//                 className="bg-white/95 px-6 py-2 sm:px-10 sm:py-3 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border-b-4 border-stone-200 text-center"
//             >
//                 <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5 sm:mb-1">Target Coach</div>
//                 <div className="text-5xl sm:text-8xl lg:text-[10rem] font-black leading-none" style={{ color: currentTarget.color }}>
//                     {currentTarget.value}
//                 </div>
//             </motion.div>
//         </div>

//         {/* The Linked Train Container */}
//         <div className="w-full max-w-6xl relative py-8 sm:py-16 overflow-visible">
//             {/* Tracks */}
//             <div className="absolute bottom-10 left-0 w-full h-4 sm:h-10 bg-stone-900/10 rounded-full flex items-center px-4">
//                 <div className="w-full h-0.5 sm:h-1.5 bg-stone-500/20" />
//             </div>
            
//             <motion.div 
//                 initial={{ x: -800 }}
//                 animate={{ x: 0 }}
//                 transition={{ type: 'spring', damping: 25, stiffness: 50 }}
//                 className="flex items-end gap-0 w-full justify-start lg:justify-center overflow-x-auto no-scrollbar pb-10 px-8"
//             >
//                 {/* Engine */}
//                 <div className="flex-shrink-0 w-[14vw] min-w-[75px] sm:w-36 lg:w-48 relative group">
//                     <svg viewBox="0 0 120 100" className="w-full drop-shadow-2xl overflow-visible">
//                         <motion.circle animate={{ y: [0, -15], opacity: [0, 0.8, 0], scale: [0.5, 1.2] }} transition={{ repeat: Infinity, duration: 1.5 }} cx="85" cy="15" r="4" fill="#ddd" />
//                         <motion.circle animate={{ y: [0, -25], opacity: [0, 0.6, 0], scale: [0.5, 1.8] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} cx="80" cy="15" r="5" fill="#eee" />
//                         <rect x="10" y="45" width="100" height="42" rx="4" fill="#222" />
//                         <rect x="65" y="20" width="45" height="30" rx="3" fill="#e63946" />
//                         <rect x="70" y="25" width="35" height="20" rx="2" fill="#87ceeb" opacity="0.6" />
//                         <rect x="25" y="15" width="12" height="30" rx="2" fill="#333" />
//                         <circle cx="35" cy="87" r="10" fill="#111" />
//                         <circle cx="85" cy="87" r="10" fill="#111" />
//                         <rect x="0" y="65" width="10" height="4" fill="#666" rx="2" />
//                     </svg>
//                 </div>

//                 {/* Numbered Coaches */}
//                 {NUMBERS.map((n, idx) => (
//                     <div key={`coach-wrapper-${n.value}`} className="flex items-end overflow-visible">
//                         <div className="w-1 sm:w-2.5 h-1 bg-stone-700 mb-4 sm:mb-8 flex-shrink-0 opacity-70" />
                        
//                         <motion.button
//                             ref={el => coachRefs.current[idx] = el}
//                             onClick={() => handleSelect(idx)}
//                             whileHover={!isAnswered ? { y: -6, scale: 1.05 } : {}}
//                             className={`flex-shrink-0 w-[11vw] min-w-[55px] sm:w-26 lg:w-36 relative transition-all duration-300 ${
//                                 selectedIdx === idx 
//                                 ? (n.value === currentTarget.value ? 'scale-105 z-20' : 'animate-shake z-10')
//                                 : isAnswered ? 'opacity-30' : 'opacity-100'
//                             }`}
//                         >
//                             <svg viewBox="0 0 100 80" className="w-full drop-shadow-xl overflow-visible">
//                                 <rect x="5" y="25" width="90" height="42" rx="8" fill={n.color} />
//                                 <rect x="5" y="25" width="90" height="6" fill="black" opacity="0.1" rx="1.5" />
//                                 <rect x="15" y="32" width="16" height="14" rx="2" fill="white" opacity="0.2" />
//                                 <rect x="69" y="32" width="16" height="14" rx="2" fill="white" opacity="0.2" />
//                                 <circle cx="25" cy="74" r="8" fill="#111" />
//                                 <circle cx="75" cy="74" r="8" fill="#111" />
//                                 <rect x="95" y="60" width="5" height="4" fill="#666" rx="1.5" />
//                             </svg>

//                             <div className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4">
//                                 <span className="text-xl sm:text-4xl lg:text-6xl font-black text-white drop-shadow-lg">
//                                     {n.value}
//                                 </span>
//                             </div>

//                             {/* Feedback Icons */}
//                             <AnimatePresence>
//                                 {selectedIdx === idx && (
//                                     <motion.div 
//                                         key={`feedback-${currentTarget.value}-${n.value}`}
//                                         initial={{ scale: 0, y: 20 }} 
//                                         animate={{ scale: 1.2, y: -45 }}
//                                         exit={{ scale: 0, y: 10 }}
//                                         className="absolute left-1/2 -translate-x-1/2 z-[60]"
//                                     >
//                                         {n.value === currentTarget.value ? (
//                                             <div className="bg-emerald-500 p-1.5 sm:p-3 rounded-full shadow-2xl border-4 border-white ring-8 ring-emerald-500/10">
//                                                 <CheckCircle2 className="text-white w-6 h-6 sm:w-12 sm:h-12" />
//                                             </div>
//                                         ) : (
//                                             <div className="bg-rose-500 p-1.5 sm:p-3 rounded-full shadow-2xl border-4 border-white ring-8 ring-rose-500/20">
//                                                 <XCircle className="text-white w-6 h-6 sm:w-12 sm:h-12" />
//                                             </div>
//                                         )}
//                                     </motion.div>
//                                 )}
//                             </AnimatePresence>
//                         </motion.button>
//                     </div>
//                 ))}
//             </motion.div>
//         </div>

//         {!isAnswered && mode === 'practice' && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-stone-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest bg-white/40 px-5 py-1.5 rounded-full">
//                 <Hand size={14} className="animate-bounce" />
//                 Tap a coach to select
//             </motion.div>
//         )}
//       </div>

//       {/* VIRTUAL HAND FOR KID MODE */}
//       <AnimatePresence>
//         {mode === 'kid' && virtualHandPos && (
//             <motion.div 
//                 key="virtual-hand"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
//                 transition={{ duration: 1.2, ease: "easeInOut" }}
//                 className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
//                 style={{ position: 'fixed' }}
//             >
//                 <div className="relative">
//                     <Hand className="text-stone-800 w-10 h-10 sm:w-20 sm:h-20" fill="white" />
//                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl" />
//                 </div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       {/* NAVIGATION - FEATURING "TEN STEPS" ANIMATION */}
//       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center px-2 mt-auto pb-2">
//           <div className="flex flex-col gap-1">
//             <button 
//               onClick={handleNextSequential}
//               className={`group relative flex items-center justify-between w-full p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 ${
//                 autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
//               }`}
//             >
//               <div className="flex items-center gap-2 sm:gap-4 z-10">
//                 <div className="bg-white/20 p-1.5 sm:p-3 rounded-xl">
//                    <ChevronRight size={18} className="sm:w-8 sm:h-8" />
//                 </div>
//                 <div className="text-left">
//                   <div className="leading-tight sm:text-xl font-black">
//                     {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
//                   </div>
//                   {autoNextTimer !== null && (
//                     <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Auto-Jump</div>
//                   )}
//                 </div>
//               </div>

//               {/* THE "TEN STEPS" PILL */}
//               <div className="flex items-center relative z-10">
//                 {autoNextTimer !== null ? (
//                   <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-[2rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[220px]">
//                     <Timer size={18} className="animate-spin text-emerald-200 shrink-0" />
                    
//                     {/* Footprint Track (10 steps) */}
//                     <div className="flex justify-between w-full px-2 items-center relative">
//                         {[...Array(10)].map((_, i) => (
//                             <motion.div 
//                                 key={i}
//                                 initial={false}
//                                 animate={{ 
//                                     opacity: (10 - autoNextTimer) > i ? 1 : 0.2,
//                                     scale: (10 - autoNextTimer) === i ? 1.4 : 1
//                                 }}
//                                 className="text-[10px] sm:text-lg"
//                             >
//                                 👣
//                             </motion.div>
//                         ))}
                        
//                         {/* Moving Kid Character - Faces RIGHT now by removing horizontal scale transform */}
//                         <motion.div 
//                             animate={{ 
//                                 left: `${((10 - autoNextTimer) / 9) * 100}%`,
//                                 x: '-50%'
//                             }}
//                             className="absolute top-1/2 -translate-y-1/2 text-lg sm:text-3xl pointer-events-none"
//                             style={{ left: 0 }}
//                         >
//                             🏃
//                         </motion.div>
//                     </div>
//                   </div>
//                 ) : (
//                   <FastForward className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-8 sm:h-8" />
//                 )}
//               </div>

//               {autoNextTimer !== null && (
//                 <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
//                   className="absolute inset-0 bg-emerald-800/20 rounded-[1.5rem] sm:rounded-[3rem] pointer-events-none" />
//               )}
//             </button>
//           </div>

//           <div className="flex flex-col gap-1">
//             <button onClick={handleNextRandom} className="flex items-center justify-center gap-3 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 border-[#5d4037]">
//               <Shuffle size={18} className="sm:w-8 sm:h-8" />
//               <span className="uppercase font-black">Random Jump</span>
//             </button>
//           </div>
//       </div>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         @keyframes shake {
//             0%, 100% { transform: translateX(0); }
//             25% { transform: translateX(-8px); }
//             75% { transform: translateX(8px); }
//         }
//         .animate-shake { animation: shake 0.3s ease-in-out 2; }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, AlertCircle, 
  FastForward, XCircle, Volume2, VolumeX
} from 'lucide-react';

// --- Constants & Data ---
const COLORS = [
  '#e63946', // Coach 1
  '#f4a261', // Coach 2
  '#e9c46a', // Coach 3
  '#2a9d8f', // Coach 4
  '#264653', // Coach 5
];

const NUMBERS = Array.from({ length: 5 }, (_, i) => ({
  value: i + 1,
  color: COLORS[i],
}));

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [currentTarget, setCurrentTarget] = useState(NUMBERS[0]);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerIntervalRef = useRef(null);
  const coachRefs = useRef([]);
  const audioCtxRef = useRef(null);
  const soundIntervalRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  // Audio Engine: Synthesized Train Chug
  const initAmbientSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = setInterval(() => {
        if (isMuted || isCorrect || audioCtxRef.current.state === 'suspended') return; 
        
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(45, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.01, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.15);
      }, 800);
    } catch (e) {
      console.warn("Audio context blocked");
    }
  }, [isMuted, isCorrect]);

  useEffect(() => {
    initAmbientSound();
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
    };
  }, [initAmbientSound]);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleSelect = useCallback((idx, isTutorial = false) => {
    // Block interaction during tutorial autoplay unless triggered by logic
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    const val = idx + 1;
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (val === currentTarget.value) {
      setIsCorrect(true);
      setScore(s => s + 1);
      speak(`Great choice! Coach number ${val}!`);
      setAutoNextTimer(10);
    } else {
      setIsCorrect(false);
      speak(`Is this coach ${currentTarget.value}? No, this is coach ${val}.`);
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedIdx(null);
        }, 2500);
      }
    }
  }, [currentTarget.value, isAnswered, isCorrect, isAutoPlaying, speak]);

  const moveHandToCoach = useCallback((idx) => {
    return new Promise(resolve => {
      if (!coachRefs.current[idx]) return resolve();
      const rect = coachRefs.current[idx].getBoundingClientRect();
      setVirtualHandPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setTimeout(resolve, 1000);
    });
  }, []);

  const startKidModeTutorial = useCallback(async (val) => {
    if (tutorialActiveRef.current) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);
    
    speak(`Let's find coach number ${val}.`);
    await new Promise(r => setTimeout(r, 1200));
    
    // 1. Intentional Mistake Demo
    const wrongIdx = val === 1 ? 1 : 0; 
    await moveHandToCoach(wrongIdx);
    handleSelect(wrongIdx, true); 
    await new Promise(r => setTimeout(r, 3200)); 
    
    // 2. Reset and Correct Selection
    setIsAnswered(false);
    setSelectedIdx(null);
    await new Promise(r => setTimeout(r, 800));

    const correctIdx = val - 1;
    await moveHandToCoach(correctIdx);
    handleSelect(correctIdx, true);
    
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    // tutorialActiveRef remains true until target changes to prevent re-triggering
  }, [moveHandToCoach, handleSelect, speak]);

  const resetLevel = useCallback((target) => {
    setCurrentTarget(target);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedIdx(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    tutorialActiveRef.current = false;

    if (mode === 'practice') {
      speak(`Find coach number ${target.value}.`);
    }
  }, [mode, speak]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current) {
        const timer = setTimeout(() => {
            startKidModeTutorial(currentTarget.value);
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [currentTarget, mode, isCorrect, startKidModeTutorial]);

  const handleNextSequential = useCallback(() => {
    const idx = NUMBERS.findIndex(n => n.value === currentTarget.value);
    const next = NUMBERS[(idx + 1) % NUMBERS.length];
    resetLevel(next);
  }, [currentTarget.value, resetLevel]);

  const handleNextRandom = () => {
    const available = NUMBERS.filter(n => n.value !== currentTarget.value);
    const next = available[Math.floor(Math.random() * available.length)];
    resetLevel(next);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      handleNextSequential();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, handleNextSequential]);

  return (
    <div className="min-h-screen bg-[#fcfaf7] p-2 sm:p-4 md:p-6 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-2 sm:gap-4 mb-3 sm:mb-4 px-2">
        <div className="flex flex-col items-center md:items-start text-center">
          <h1 className="text-xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tighter">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/10 text-xl sm:text-2xl">
                <span>🚂</span>
            </div>
            <span>Number Train</span>
          </h1>
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identification Lab</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100">
            <div className="bg-[#e2d6c3] p-1 rounded-xl shadow-inner flex items-center gap-1 border border-stone-300">
                <button 
                    onClick={() => setMode('kid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
                >
                    <Play size={10} fill={mode === 'kid' ? 'currentColor' : 'none'} />
                    KID MODE
                </button>
                <button 
                    onClick={() => setMode('practice')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
                >
                    <MousePointer2 size={10} fill={mode === 'practice' ? 'currentColor' : 'none'} />
                    PRACTICE
                </button>
            </div>
            <button 
                onClick={() => {
                    if (audioCtxRef.current) audioCtxRef.current.resume();
                    setIsMuted(!isMuted);
                }}
                className="p-2 sm:p-2.5 bg-white border border-stone-200 rounded-lg shadow-sm text-stone-500 active:scale-95 transition-transform"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
        </div>
      
        <div className="flex items-center gap-2 sm:gap-3 scale-90 sm:scale-100">
          <div className="bg-white px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[50px] sm:min-w-[70px]">
            <span className="text-[7px] uppercase font-black opacity-40">Correct</span>
            <span className="text-base sm:text-xl font-black text-blue-600">{score}</span>
          </div>
          <button onClick={() => resetLevel(currentTarget)} className="p-2 sm:p-2.5 bg-[#8d6e63] text-white rounded-lg shadow-md border-b-4 border-[#5d4037]">
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* THE STAGE - REDUCED BOTTOM MARGIN */}
      <div className="w-full max-w-7xl bg-[#dfc4a1] rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border-b-8 sm:border-b-[12px] border-[#c4a484] relative mb-1 sm:mb-2 overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[580px]">
        
        {/* Goal Indicator */}
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col items-center">
            <motion.div 
                key={currentTarget.value}
                initial={{ scale: 0.5, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white/95 px-6 py-2 sm:px-10 sm:py-3 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border-b-4 border-stone-200 text-center"
            >
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-stone-400 mb-0.5 sm:mb-1">Target Coach</div>
                <div className="text-5xl sm:text-8xl lg:text-[10rem] font-black leading-none" style={{ color: currentTarget.color }}>
                    {currentTarget.value}
                </div>
            </motion.div>
        </div>

        {/* The Linked Train Container */}
        <div className="w-full max-w-6xl relative py-8 sm:py-16 overflow-visible">
            {/* Tracks */}
            <div className="absolute bottom-10 left-0 w-full h-4 sm:h-10 bg-stone-900/10 rounded-full flex items-center px-4">
                <div className="w-full h-0.5 sm:h-1.5 bg-stone-500/20" />
            </div>
            
            <motion.div 
                initial={{ x: -800 }}
                animate={{ x: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 50 }}
                className="flex items-end gap-0 w-full justify-start lg:justify-center overflow-x-auto no-scrollbar pb-10 px-8"
            >
                {/* Engine */}
                <div className="flex-shrink-0 w-[14vw] min-w-[75px] sm:w-36 lg:w-48 relative group">
                    <svg viewBox="0 0 120 100" className="w-full drop-shadow-2xl overflow-visible">
                        <motion.circle animate={{ y: [0, -15], opacity: [0, 0.8, 0], scale: [0.5, 1.2] }} transition={{ repeat: Infinity, duration: 1.5 }} cx="85" cy="15" r="4" fill="#ddd" />
                        <motion.circle animate={{ y: [0, -25], opacity: [0, 0.6, 0], scale: [0.5, 1.8] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} cx="80" cy="15" r="5" fill="#eee" />
                        <rect x="10" y="45" width="100" height="42" rx="4" fill="#222" />
                        <rect x="65" y="20" width="45" height="30" rx="3" fill="#e63946" />
                        <rect x="70" y="25" width="35" height="20" rx="2" fill="#87ceeb" opacity="0.6" />
                        <rect x="25" y="15" width="12" height="30" rx="2" fill="#333" />
                        <circle cx="35" cy="87" r="10" fill="#111" />
                        <circle cx="85" cy="87" r="10" fill="#111" />
                        <rect x="0" y="65" width="10" height="4" fill="#666" rx="2" />
                    </svg>
                </div>

                {/* Numbered Coaches */}
                {NUMBERS.map((n, idx) => (
                    <div key={`coach-wrapper-${n.value}`} className="flex items-end overflow-visible">
                        <div className="w-1 sm:w-2.5 h-1 bg-stone-700 mb-4 sm:mb-8 flex-shrink-0 opacity-70" />
                        
                        <motion.button
                            ref={el => coachRefs.current[idx] = el}
                            onClick={() => handleSelect(idx)}
                            whileHover={!isAnswered ? { y: -6, scale: 1.05 } : {}}
                            className={`flex-shrink-0 w-[11vw] min-w-[55px] sm:w-26 lg:w-36 relative transition-all duration-300 ${
                                selectedIdx === idx 
                                ? (n.value === currentTarget.value ? 'scale-105 z-20' : 'animate-shake z-10')
                                : isAnswered ? 'opacity-30' : 'opacity-100'
                            }`}
                        >
                            <svg viewBox="0 0 100 80" className="w-full drop-shadow-xl overflow-visible">
                                <rect x="5" y="25" width="90" height="42" rx="8" fill={n.color} />
                                <rect x="5" y="25" width="90" height="6" fill="black" opacity="0.1" rx="1.5" />
                                <rect x="15" y="32" width="16" height="14" rx="2" fill="white" opacity="0.2" />
                                <rect x="69" y="32" width="16" height="14" rx="2" fill="white" opacity="0.2" />
                                <circle cx="25" cy="74" r="8" fill="#111" />
                                <circle cx="75" cy="74" r="8" fill="#111" />
                                <rect x="95" y="60" width="5" height="4" fill="#666" rx="1.5" />
                            </svg>

                            <div className="absolute inset-0 flex items-center justify-center pt-2 sm:pt-4">
                                <span className="text-xl sm:text-4xl lg:text-6xl font-black text-white drop-shadow-lg">
                                    {n.value}
                                </span>
                            </div>

                            {/* Feedback Icons */}
                            <AnimatePresence>
                                {selectedIdx === idx && (
                                    <motion.div 
                                        key={`feedback-${currentTarget.value}-${n.value}`}
                                        initial={{ scale: 0, y: 20 }} 
                                        animate={{ scale: 1.2, y: -45 }}
                                        exit={{ scale: 0, y: 10 }}
                                        className="absolute left-1/2 -translate-x-1/2 z-[60]"
                                    >
                                        {n.value === currentTarget.value ? (
                                            <div className="bg-emerald-500 p-1.5 sm:p-3 rounded-full shadow-2xl border-4 border-white ring-8 ring-emerald-500/10">
                                                <CheckCircle2 className="text-white w-6 h-6 sm:w-12 sm:h-12" />
                                            </div>
                                        ) : (
                                            <div className="bg-rose-500 p-1.5 sm:p-3 rounded-full shadow-2xl border-4 border-white ring-8 ring-rose-500/20">
                                                <XCircle className="text-white w-6 h-6 sm:w-12 sm:h-12" />
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </div>
                ))}
            </motion.div>
        </div>

        {!isAnswered && mode === 'practice' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex items-center gap-2 text-stone-500 font-black text-[8px] sm:text-[10px] uppercase tracking-widest bg-white/40 px-5 py-1.5 rounded-full">
                <Hand size={14} className="animate-bounce" />
                Tap a coach to select
            </motion.div>
        )}
      </div>

      {/* VIRTUAL HAND FOR KID MODE */}
      <AnimatePresence>
        {mode === 'kid' && virtualHandPos && (
            <motion.div 
                key="virtual-hand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand className="text-stone-800 w-10 h-10 sm:w-20 sm:h-20" fill="white" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* NAVIGATION - REDUCED TOP MARGIN AND REMOVED MT-AUTO FOR TIGHTER FIT */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center px-2 mt-2 pb-2">
          <div className="flex flex-col gap-1">
            <button 
              onClick={handleNextSequential}
              className={`group relative flex items-center justify-between w-full p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 ${
                autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-4 z-10">
                <div className="bg-white/20 p-1.5 sm:p-3 rounded-xl">
                   <ChevronRight size={18} className="sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <div className="leading-tight sm:text-xl font-black">
                    {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
                  </div>
                  {autoNextTimer !== null && (
                    <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Auto-Jump</div>
                  )}
                </div>
              </div>

              {/* THE "TEN STEPS" PILL */}
              <div className="flex items-center relative z-10">
                {autoNextTimer !== null ? (
                  <div className="flex items-center gap-2 sm:gap-3 bg-black/40 px-3 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-[2rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[220px]">
                    <Timer size={18} className="animate-spin text-emerald-200 shrink-0" />
                    
                    {/* Footprint Track (10 steps) */}
                    <div className="flex justify-between w-full px-2 items-center relative">
                        {[...Array(10)].map((_, i) => (
                            <motion.div 
                                key={i}
                                initial={false}
                                animate={{ 
                                    opacity: (10 - autoNextTimer) > i ? 1 : 0.2,
                                    scale: (10 - autoNextTimer) === i ? 1.4 : 1
                                }}
                                className="text-[10px] sm:text-lg"
                            >
                                👣
                            </motion.div>
                        ))}
                        
                        {/* Moving Kid Character - Faces RIGHT */}
                        <motion.div 
                            animate={{ 
                                left: `${((10 - autoNextTimer) / 9) * 100}%`,
                                x: '-50%'
                            }}
                            className="absolute top-1/2 -translate-y-1/2 text-lg sm:text-3xl pointer-events-none"
                            style={{ left: 0 }}
                        >
                            🏃
                        </motion.div>
                    </div>
                  </div>
                ) : (
                  <FastForward className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-8 sm:h-8" />
                )}
              </div>

              {autoNextTimer !== null && (
                <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
                  className="absolute inset-0 bg-emerald-800/20 rounded-[1.5rem] sm:rounded-[3rem] pointer-events-none" />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <button onClick={handleNextRandom} className="flex items-center justify-center gap-3 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 border-[#5d4037]">
              <Shuffle size={18} className="sm:w-8 sm:h-8" />
              <span className="uppercase font-black">Random Jump</span>
            </button>
          </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out 2; }
      `}</style>
    </div>
  );
}