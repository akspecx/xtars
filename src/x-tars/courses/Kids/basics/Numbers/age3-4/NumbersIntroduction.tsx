// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   RefreshCcw, 
// //   Sparkles, Play, 
// //   Timer, ChevronRight, Shuffle, 
// //   FastForward, Volume2, VolumeX,
// //   Trophy, Gamepad2, Music, Music2
// // } from 'lucide-react';

// // // --- Constants ---
// // const NUMBERS = [
// //   { value: 1, name: 'One', color: '#d64545' },
// //   { value: 2, name: 'Two', color: '#e69055' },
// //   { value: 3, name: 'Three', color: '#8e5ecf' },
// //   { value: 4, name: 'Four', color: '#e07d2c' },
// //   { value: 5, name: 'Five', color: '#d64a62' },
// //   { value: 6, name: 'Six', color: '#38a361' },
// //   { value: 7, name: 'Seven', color: '#c9a01c' },
// //   { value: 8, name: 'Eight', color: '#bf3434' },
// //   { value: 9, name: 'Nine', color: '#74a62d' },
// // ];

// // const THEMES = [
// //   { id: 'apple', emoji: '🍎', name: 'Apple', plural: 'Apples' },
// //   { id: 'candy', emoji: '🍬', name: 'Candy', plural: 'Candies' },
// //   { id: 'cat', emoji: '🐱', name: 'Cat', plural: 'Cats' },
// //   { id: 'lion', emoji: '🦁', name: 'Lion', plural: 'Lions' },
// //   { id: 'elephant', emoji: '🐘', name: 'Elephant', plural: 'Elephants' },
// //   { id: 'robot', emoji: '🤖', name: 'Robot', plural: 'Robots' },
// // ];

// // export default function App() {
// //   const [gameState, setGameState] = useState('intro'); 
// //   const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
// //   const [currentIdx, setCurrentIdx] = useState(0);
// //   const [stepCount, setStepCount] = useState(0);
// //   const [autoNextTimer, setAutoNextTimer] = useState(null);
// //   const [isMusicOn, setIsMusicOn] = useState(false);
// //   const [isCounting, setIsCounting] = useState(false);

// //   const timerIntervalRef = useRef(null);
// //   const countingIntervalRef = useRef(null);
// //   const audioCtxRef = useRef(null);

// //   // --- Audio Logic ---
// //   const speak = useCallback((text) => {
// //     if ('speechSynthesis' in window) {
// //       window.speechSynthesis.cancel();
// //       const utterance = new SpeechSynthesisUtterance(text);
// //       utterance.pitch = 1.3;
// //       utterance.rate = 0.85;
// //       window.speechSynthesis.speak(utterance);
// //     }
// //   }, []);

// //   const playBackgroundMusic = () => {
// //     try {
// //       if (!audioCtxRef.current) {
// //         audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
// //       }
// //       const ctx = audioCtxRef.current;
// //       if (ctx.state === 'suspended') ctx.resume();

// //       const playNote = (freq, time, duration) => {
// //         const osc = ctx.createOscillator();
// //         const gain = ctx.createGain();
// //         osc.type = 'triangle';
// //         osc.frequency.setValueAtTime(freq, time);
// //         gain.gain.setValueAtTime(0.02, time);
// //         gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
// //         osc.connect(gain);
// //         gain.connect(ctx.destination);
// //         osc.start(time);
// //         osc.stop(time + duration);
// //       };

// //       const now = ctx.currentTime;
// //       const notes = [261.63, 329.63, 392.00, 523.25];
// //       for (let i = 0; i < 200; i++) {
// //         playNote(notes[i % 4], now + i * 1.5, 1.2);
// //       }
// //       setIsMusicOn(true);
// //     } catch (e) {
// //       console.warn("Audio Context blocked.");
// //     }
// //   };

// //   const startCounting = useCallback((targetValue) => {
// //     setStepCount(0);
// //     setIsCounting(true);
// //     if (countingIntervalRef.current) clearInterval(countingIntervalRef.current);

// //     let current = 0;
// //     countingIntervalRef.current = setInterval(() => {
// //       if (current < targetValue) {
// //         current += 1;
// //         setStepCount(current);
// //         speak(`${current}`);
// //       } else {
// //         clearInterval(countingIntervalRef.current);
// //         setIsCounting(false);
// //         const label = targetValue > 1 ? selectedTheme.plural : selectedTheme.name;
// //         speak(`That makes ${targetValue} ${label}!`);
// //         setAutoNextTimer(10);
// //       }
// //     }, 1500);
// //   }, [selectedTheme, speak]);

// //   const handleNextSequential = useCallback(() => {
// //     const nextIdx = (currentIdx + 1) % NUMBERS.length;
// //     setCurrentIdx(nextIdx);
// //     setAutoNextTimer(null);
// //     startCounting(NUMBERS[nextIdx].value);
// //   }, [currentIdx, startCounting]);

// //   const handleNextRandom = () => {
// //     const available = NUMBERS.filter((_, i) => i !== currentIdx);
// //     const nextIdx = NUMBERS.indexOf(available[Math.floor(Math.random() * available.length)]);
// //     setCurrentIdx(nextIdx);
// //     setAutoNextTimer(null);
// //     startCounting(NUMBERS[nextIdx].value);
// //   };

// //   const handleSelectTheme = (theme) => {
// //     setSelectedTheme(theme);
// //     setGameState('learning');
// //     speak(`Let's count ${theme.plural}!`);
// //     setTimeout(() => {
// //       startCounting(NUMBERS[0].value);
// //     }, 1500);
// //   };

// //   useEffect(() => {
// //     if (autoNextTimer !== null && autoNextTimer > 0) {
// //       timerIntervalRef.current = setInterval(() => {
// //         setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
// //       }, 1000);
// //     } else if (autoNextTimer === 0) {
// //       handleNextSequential();
// //     }
// //     return () => clearInterval(timerIntervalRef.current);
// //   }, [autoNextTimer, handleNextSequential]);

// //   const currentNumberData = NUMBERS[currentIdx];
// //   const matteCardClass = "bg-gradient-to-br from-[#fcfcfc] to-[#f5f5f5] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_8px_32px_rgba(0,0,0,0.06)] border border-white/40";

// //   return (
// //     <div className="min-h-screen bg-[#fcfaf7] p-2 sm:p-4 md:p-6 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800 relative">
      
// //       {/* HEADER */}
// //       {gameState !== 'intro' && (
// //         <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 mb-4 px-2 z-10">
// //           <div className="flex flex-col items-center md:items-start text-center">
// //             <h1 className="text-xl sm:text-3xl font-black flex items-center gap-2 text-slate-900 uppercase tracking-tighter">
// //               <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#d97706] rounded-xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/10 text-lg sm:xl">
// //                   <Gamepad2 size={20} />
// //               </div>
// //               <span>Counting Lab</span>
// //             </h1>
// //             <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
// //                {gameState === 'learning' ? `${selectedTheme.emoji} ${selectedTheme.plural}` : 'Theme Selection'}
// //             </p>
// //           </div>

// //           <div className="flex items-center gap-2 sm:gap-4">
// //               <button 
// //                   onClick={() => {
// //                     if (audioCtxRef.current) audioCtxRef.current.resume();
// //                     playBackgroundMusic();
// //                     setIsMusicOn(!isMusicOn);
// //                   }}
// //                   className={`p-2 sm:p-2.5 rounded-lg shadow-sm active:scale-95 transition-all ${isMusicOn ? 'bg-[#f0fdf4] text-[#16a34a]' : 'bg-white text-gray-300'}`}
// //               >
// //                   {isMusicOn ? <Music size={16} /> : <Music2 size={16} />}
// //               </button>

// //               <button onClick={() => { setGameState('selection'); setAutoNextTimer(null); if (countingIntervalRef.current) clearInterval(countingIntervalRef.current); }} className="p-2 sm:p-2.5 bg-[#8d6e63] text-white rounded-lg shadow-md border-b-4 border-[#5d4037]">
// //                   <RefreshCcw size={16} />
// //               </button>
// //           </div>
// //         </div>
// //       )}

// //       <AnimatePresence mode="wait">
// //         {gameState === 'intro' && (
// //           <motion.div
// //             key="intro"
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
// //             className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#fcfaf7] p-4 text-center"
// //           >
// //             <KidCharacter className="w-64 h-72 sm:w-80 sm:h-96 md:w-[450px] md:h-[500px]" isTalking={true} />
// //             <h1 className="text-4xl md:text-8xl font-black text-[#5d4037] mt-4 mb-2 tracking-tighter uppercase leading-none">Hi Friend!</h1>
// //             <p className="text-lg md:text-2xl text-[#8d6e63] mb-8 md:mb-12 font-bold uppercase tracking-widest">Shall we count together?</p>
// //             <motion.button
// //               whileTap={{ scale: 0.92 }}
// //               onClick={() => { setGameState('selection'); speak("Hello! What should we count today?"); playBackgroundMusic(); }}
// //               className="flex items-center justify-center gap-3 px-12 md:px-20 py-6 md:py-10 bg-[#c2410c] text-white rounded-[2.5rem] md:rounded-[4rem] font-black text-2xl md:text-4xl shadow-[0_12px_0_#9a3412] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
// //             >
// //               <Play fill="currentColor" size={32} />
// //               LET'S START
// //             </motion.button>
// //           </motion.div>
// //         )}

// //         {gameState === 'selection' && (
// //           <motion.div
// //             key="selection"
// //             initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
// //             className="w-full max-w-6xl flex flex-col items-center py-4 md:py-8"
// //           >
// //             <KidCharacter className="w-32 h-40 md:w-56 md:h-72" isTalking={true} />
// //             <h2 className="text-2xl md:text-6xl font-black text-[#5d4037] mt-4 mb-8 text-center uppercase tracking-tighter">Choose a theme!</h2>
          
// //             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-10 w-full px-4">
// //               {THEMES.map((theme) => (
// //                 <button
// //                   key={theme.id}
// //                   onClick={() => handleSelectTheme(theme)}
// //                   className={`group ${matteCardClass} p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border-b-[8px] md:border-b-[16px] border-orange-100 hover:border-[#ea580c]/30 active:translate-y-1 active:border-b-0 flex flex-col items-center gap-3 md:gap-8 transition-all`}
// //                 >
// //                   <div className="text-6xl md:text-[8rem] group-hover:scale-110 transition-transform duration-300">
// //                     {theme.emoji}
// //                   </div>
// //                   <div className="text-xs md:text-2xl font-black text-[#5d4037] uppercase tracking-widest opacity-80">
// //                     {theme.name}
// //                   </div>
// //                 </button>
// //               ))}
// //             </div>
// //           </motion.div>
// //         )}

// //         {gameState === 'learning' && (
// //           <motion.div
// //             key="learning"
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
// //             className="w-full max-w-7xl flex flex-col items-center gap-4"
// //           >
// //             <div className="w-full bg-[#dfc4a1] rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 md:p-12 shadow-2xl border-b-[12px] sm:border-b-[16px] border-[#c4a484] relative mb-1 flex flex-col items-center justify-center min-h-[450px] sm:min-h-[550px] lg:min-h-[680px]">
              
// //               <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6 md:gap-10 max-w-6xl">
                
// //                 {/* TRAY SIDE - ENHANCED SPACING */}
// //                 <motion.div
// //                   className={`${matteCardClass} flex-1 w-full rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col items-center min-h-[340px] md:min-h-[540px]`}
// //                 >
// //                   <span className="text-[10px] md:text-sm font-black text-[#ea580c] opacity-60 uppercase tracking-[0.4em] mb-4">The Tray</span>
// //                   <div className="flex-1 flex items-center justify-center w-full overflow-hidden">
// //                     <div className="grid grid-cols-3 gap-8 sm:gap-12 md:gap-16 lg:gap-20 p-4 md:p-10 bg-black/[0.02] rounded-[2rem] md:rounded-[3.5rem] shadow-inner w-full max-w-[600px]">
// //                       {Array.from({ length: currentNumberData.value }).map((_, i) => (
// //                         <div key={`${currentIdx}-slot-${i}`} className="aspect-square flex items-center justify-center relative">
// //                          <AnimatePresence>
// //                            {i < stepCount && (
// //                               <motion.span
// //                                 initial={{ scale: 0, y: -40, rotate: -30 }}
// //                                 animate={{ scale: 1, y: 0, rotate: 0 }}
// //                                 transition={{ type: "spring", stiffness: 120 }}
// //                                 className="text-3xl sm:text-5xl md:text-[4.5rem] drop-shadow-md leading-none select-none"
// //                               >
// //                                 {selectedTheme.emoji}
// //                               </motion.span>
// //                            )}
// //                          </AnimatePresence>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>
// //                   <div className="mt-6 bg-[#fff7ed] px-8 py-2 md:py-4 rounded-full text-[#9a3412] font-black text-lg md:text-4xl border border-orange-100 shadow-sm uppercase tracking-tighter">
// //                      {stepCount} {stepCount === 1 ? selectedTheme.name : selectedTheme.plural}
// //                   </div>
// //                 </motion.div>

// //                 <div className="flex flex-col items-center px-4 py-2">
// //                   <KidCharacter className="w-32 h-40 sm:w-44 sm:h-60 md:w-56 md:h-72" isTalking={isCounting} />
// //                   <div className="bg-white px-5 py-3 rounded-[1.5rem] shadow-lg mt-4 border border-stone-100 relative min-w-[120px] text-center">
// //                     <p className="font-black text-[#5d4037] text-sm md:text-xl uppercase tracking-tighter">
// //                       {isCounting ? "Count!" : "Ready!"}
// //                     </p>
// //                     <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-stone-100" />
// //                   </div>
// //                 </div>

// //                 <motion.div
// //                   key={`target-${currentIdx}`}
// //                   initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
// //                   className={`${matteCardClass} flex-1 w-full rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-12 flex flex-col items-center min-h-[340px] md:min-h-[540px]`}
// //                 >
// //                   <span className="text-[10px] md:text-sm font-black text-[#2563eb] opacity-60 uppercase tracking-[0.4em] mb-4">Target</span>
// //                   <div className="flex-1 flex items-center justify-center">
// //                      <motion.span
// //                        initial={{ scale: 0.5 }} animate={{ scale: 1 }}
// //                        className="text-[8rem] sm:text-[12rem] md:text-[20rem] font-black leading-none drop-shadow-xl saturate-150"
// //                        style={{ color: currentNumberData.color }}
// //                      >
// //                        {currentNumberData.value}
// //                      </motion.span>
// //                   </div>
// //                   <div className="mt-6 bg-[#f0f9ff] px-10 py-2 md:py-4 rounded-full text-[#1e40af] font-black text-lg md:text-5xl tracking-[0.1em] uppercase border border-blue-100 shadow-sm">
// //                     {currentNumberData.name}
// //                   </div>
// //                 </motion.div>
// //               </div>

// //               {!isCounting && stepCount === currentNumberData.value && (
// //                 <div className="absolute inset-0 pointer-events-none z-[100]">
// //                   <Sparkles className="text-yellow-400 absolute top-1/4 left-[8%] animate-bounce w-8 h-8 md:w-16 md:h-16" />
// //                   <Sparkles className="text-yellow-400 absolute bottom-1/4 right-[8%] animate-bounce w-8 h-8 md:w-16 md:h-16" />
// //                 </div>
// //               )}
// //             </div>

// //             <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center px-2 mt-2 pb-2">
// //                 <div className="flex flex-col gap-1">
// //                   <button 
// //                     onClick={handleNextSequential}
// //                     disabled={isCounting}
// //                     className={`group relative flex items-center justify-between w-full p-3 sm:p-7 rounded-[1.5rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 ${
// //                       isCounting ? 'opacity-50 grayscale cursor-not-allowed' : 
// //                       autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
// //                     }`}
// //                   >
// //                     <div className="flex items-center gap-2 sm:gap-5 z-10">
// //                       <div className="bg-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl">
// //                          <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
// //                       </div>
// //                       <div className="text-left">
// //                         <div className="leading-tight sm:text-xl md:text-2xl font-black uppercase">
// //                           {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
// //                         </div>
// //                         {autoNextTimer !== null && (
// //                           <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Moving...</div>
// //                         )}
// //                       </div>
// //                     </div>

// //                     {/* PILL TIMER WITH RUNNER FACING RIGHT */}
// //                     <div className="flex items-center relative z-10">
// //                       {autoNextTimer !== null ? (
// //                         <div className="flex items-center gap-2 sm:gap-4 bg-black/40 px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-[2.5rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[150px] sm:min-w-[240px]">
// //                           <div className="flex items-center gap-1.5 shrink-0">
// //                             <Timer size={20} className="animate-spin text-emerald-200" />
// //                             <span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span>
// //                           </div>
                          
// //                           <div className="flex justify-between w-full px-3 items-center relative">
// //                               {[...Array(10)].map((_, i) => (
// //                                   <div key={`step-${i}`} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>
// //                                       👣
// //                                   </div>
// //                               ))}
// //                               {/* Character forced to face right (Runner naturally faces left, so -1 flip works) */}
// //                               <motion.div 
// //                                   animate={{ 
// //                                     left: `${((10 - autoNextTimer) / 10) * 100}%`,
// //                                     scaleX: -1
// //                                   }}
// //                                   transition={{ type: "tween", ease: "linear" }}
// //                                   className="absolute top-1/2 -translate-y-1/2 text-base sm:text-3xl pointer-events-none"
// //                                   style={{ x: '-50%' }}
// //                               >
// //                                   🏃
// //                               </motion.div>
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <FastForward className="opacity-40 group-hover:opacity-100 transition-opacity sm:w-8 sm:h-8" />
// //                       )}
// //                     </div>

// //                     {autoNextTimer !== null && (
// //                       <motion.div initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
// //                         className="absolute inset-0 bg-emerald-800/20 rounded-[1.5rem] sm:rounded-[3rem] pointer-events-none" />
// //                     )}
// //                   </button>
// //                 </div>

// //                 <div className="flex flex-col gap-1">
// //                   <button onClick={handleNextRandom} disabled={isCounting} className="flex items-center justify-center gap-3 sm:gap-5 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-7 rounded-[1.5rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 border-[#5d4037] disabled:opacity-50 disabled:cursor-not-allowed">
// //                     <Shuffle size={20} className="sm:w-8 sm:h-8" />
// //                     <span className="uppercase font-black">Random Shuffle</span>
// //                   </button>
// //                 </div>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <style>{`
// //         .no-scrollbar::-webkit-scrollbar { display: none; }
// //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// //         @keyframes shake {
// //             0%, 100% { transform: translateX(0); }
// //             25% { transform: translateX(-8px); }
// //             75% { transform: translateX(8px); }
// //         }
// //         .animate-shake { animation: shake 0.3s ease-in-out 2; }
// //       `}</style>
// //     </div>
// //   );
// // }

// // // --- KID CHARACTER COMPONENT ---
// // function KidCharacter({ className, isTalking = false, isWalking = false }) {
// //   return (
// //     <motion.div
// //       className={className}
// //       animate={isWalking ? {
// //         x: [0, 10, -10, 0],
// //         y: [0, -10, 0, -10, 0],
// //       } : {
// //         y: [0, -8, 0],
// //         rotate: [0, 1, -1, 0]
// //       }}
// //       transition={{
// //         repeat: Infinity,
// //         duration: isWalking ? 0.5 : 4,
// //         ease: "easeInOut"
// //       }}
// //     >
// //       <svg className="w-full h-full" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg">
// //         <defs>
// //           <radialGradient id="faceGrad" cx="100" cy="110" r="45" gradientUnits="userSpaceOnUse">
// //             <stop stopColor="#ffdbac" />
// //             <stop offset="1" stopColor="#f1c27d" />
// //           </radialGradient>
// //           <linearGradient id="shirtGrad" x1="100" y1="160" x2="100" y2="220" gradientUnits="userSpaceOnUse">
// //             <stop stopColor="#2563eb" />
// //             <stop offset="1" stopColor="#1e40af" />
// //           </linearGradient>
// //         </defs>

// //         <motion.g animate={isWalking ? { rotate: [-20, 20, -20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
// //             <rect x="75" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
// //             <rect x="68" y="245" width="30" height="15" rx="8" fill="#2d1e1e" />
// //         </motion.g>
      
// //         <motion.g animate={isWalking ? { rotate: [20, -20, 20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
// //             <rect x="105" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
// //             <rect x="102" y="245" width="30" height="15" rx="8" fill="#2d1e1e" />
// //         </motion.g>

// //         <rect x="70" y="200" width="60" height="25" rx="5" fill="#1e3a8a" />
// //         <motion.rect x="50" y="165" width="25" height="40" rx="12" fill="#ffdbac" animate={isWalking ? { rotate: [30, -30, 30] } : { rotate: 15 }} style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.5 }} />
// //         <motion.rect x="125" y="165" width="25" height="40" rx="12" fill="#ffdbac" animate={isWalking ? { rotate: [-30, 30, -30] } : { rotate: -15 }} style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.5 }} />
// //         <path d="M60 160C60 160 80 150 100 150C120 150 140 160 140 160V210H60V160Z" fill="url(#shirtGrad)" />

// //         <path d="M55 110C55 70 80 55 100 55C120 55 145 70 145 110" stroke="#4e342e" strokeWidth="25" strokeLinecap="round"/>
// //         <circle cx="100" cy="110" r="48" fill="url(#faceGrad)" />
// //         <path d="M55 95C55 95 75 75 100 75C125 75 145 95 145 95" fill="#d64545" />
// //         <path d="M52 95C52 95 80 85 100 85C120 85 148 95 148 95L155 100H45L52 95Z" fill="#bf3434" />

// //         <motion.g animate={{ scaleY: [1, 1, 1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3.5 }}>
// //           <circle cx="82" cy="110" r="6" fill="#2d1e1e" />
// //           <circle cx="118" cy="110" r="6" fill="#2d1e1e" />
// //         </motion.g>
// //         <motion.path
// //           stroke="#4e342e" strokeWidth="4" strokeLinecap="round"
// //           animate={isTalking ? { d: ["M85 135Q100 150 115 135", "M90 140Q100 145 110 140", "M85 135Q100 150 115 135"] } : { d: "M90 138Q100 145 110 138" }}
// //           transition={{ repeat: Infinity, duration: 0.4 }}
// //         />
// //       </svg>
// //     </motion.div>
// //   );
// // }

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   RefreshCcw, 
//   Sparkles, Play, 
//   ChevronRight, Shuffle, 
//   Trophy, Gamepad2, Music, Music2,
//   ChevronLeft, MousePointer2, CheckCircle2
// } from 'lucide-react';

// // --- Constants ---
// const NUMBERS = [
//   { value: 1, name: 'One', color: '#60a5fa' },
//   { value: 2, name: 'Two', color: '#34d399' },
//   { value: 3, name: 'Three', color: '#a78bfa' },
//   { value: 4, name: 'Four', color: '#fb923c' },
//   { value: 5, name: 'Five', color: '#f472b6' },
//   { value: 6, name: 'Six', color: '#4ade80' },
//   { value: 7, name: 'Seven', color: '#fbbf24' },
//   { value: 8, name: 'Eight', color: '#f87171' },
//   { value: 9, name: 'Nine', color: '#a3e635' },
// ];

// const THEMES = [
//   { id: 'apple', emoji: '🍎', name: 'Apple', plural: 'Apples' },
//   { id: 'candy', emoji: '🍬', name: 'Candy', plural: 'Candies' },
//   { id: 'cat', emoji: '🐱', name: 'Cat', plural: 'Cats' },
//   { id: 'lion', emoji: '🦁', name: 'Lion', plural: 'Lions' },
//   { id: 'elephant', emoji: '🐘', name: 'Elephant', plural: 'Elephants' },
//   { id: 'robot', emoji: '🤖', name: 'Robot', plural: 'Robots' },
// ];

// export default function App() {
//   const [gameState, setGameState] = useState('intro'); // intro, selection, learning, outro
//   const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
//   const [currentIdx, setCurrentIdx] = useState(0);
//   const [stepCount, setStepCount] = useState(0);
//   const [autoNextTimer, setAutoNextTimer] = useState(null);
//   const [isMusicOn, setIsMusicOn] = useState(false);
//   const [isCounting, setIsCounting] = useState(false);
//   const [seenNumbers, setSeenNumbers] = useState(new Set());

//   const timerIntervalRef = useRef(null);
//   const countingIntervalRef = useRef(null);
//   const audioCtxRef = useRef(null);

//   // --- Audio Logic ---
//   const speak = useCallback((text) => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.pitch = 1.3;
//       utterance.rate = 0.85;
//       window.speechSynthesis.speak(utterance);
//     }
//   }, []);

//   const playBackgroundMusic = () => {
//     try {
//       if (!audioCtxRef.current) {
//         audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       }
//       const ctx = audioCtxRef.current;
//       if (ctx.state === 'suspended') ctx.resume();

//       const playNote = (freq, time, duration) => {
//         const osc = ctx.createOscillator();
//         const gain = ctx.createGain();
//         osc.type = 'triangle';
//         osc.frequency.setValueAtTime(freq, time);
//         gain.gain.setValueAtTime(0.02, time);
//         gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
//         osc.connect(gain);
//         gain.connect(ctx.destination);
//         osc.start(time);
//         osc.stop(time + duration);
//       };

//       const now = ctx.currentTime;
//       const notes = [261.63, 329.63, 392.00, 523.25];
//       for (let i = 0; i < 200; i++) {
//         playNote(notes[i % 4], now + i * 1.5, 1.2);
//       }
//       setIsMusicOn(true);
//     } catch (e) {
//       console.warn("Audio Context blocked.");
//     }
//   };

//   const startCounting = useCallback((targetValue) => {
//     setStepCount(0);
//     setIsCounting(true);
//     setAutoNextTimer(null);
//     if (countingIntervalRef.current) clearInterval(countingIntervalRef.current);

//     let current = 0;
//     countingIntervalRef.current = setInterval(() => {
//       if (current < targetValue) {
//         current += 1;
//         setStepCount(current);
//         speak(`${current}`);
//       } else {
//         clearInterval(countingIntervalRef.current);
//         setIsCounting(false);
//         const label = targetValue > 1 ? selectedTheme.plural : selectedTheme.name;
//         speak(`That makes ${targetValue} ${label}!`);
//         setAutoNextTimer(6); 
//       }
//     }, 2200); // Increased interval by 1 second to slow down the counting
//   }, [selectedTheme, speak]);

//   const handleNextSequential = useCallback(() => {
//     if (seenNumbers.size >= NUMBERS.length) {
//       setGameState('outro');
//       speak("Great job! We finished counting everything!");
//       return;
//     }

//     let nextIdx = (currentIdx + 1) % NUMBERS.length;
//     while (seenNumbers.has(NUMBERS[nextIdx].value) && seenNumbers.size < NUMBERS.length) {
//       nextIdx = (nextIdx + 1) % NUMBERS.length;
//     }

//     setCurrentIdx(nextIdx);
//     setAutoNextTimer(null);
//     setSeenNumbers(prev => new Set(prev).add(NUMBERS[nextIdx].value));
//     startCounting(NUMBERS[nextIdx].value);
//   }, [currentIdx, seenNumbers, startCounting]);

//   const handleNextRandom = () => {
//     if (seenNumbers.size >= NUMBERS.length) {
//       setGameState('outro');
//       speak("Great job! We finished counting everything!");
//       return;
//     }

//     const available = NUMBERS.filter(n => !seenNumbers.has(n.value));
//     const randomPick = available[Math.floor(Math.random() * available.length)];
//     const nextIdx = NUMBERS.findIndex(n => n.value === randomPick.value);
    
//     setCurrentIdx(nextIdx);
//     setAutoNextTimer(null);
//     setSeenNumbers(prev => new Set(prev).add(NUMBERS[nextIdx].value));
//     startCounting(NUMBERS[nextIdx].value);
//   };

//   const startGame = () => {
//     setGameState('selection');
//     speak("What should we count today?");
//   };

//   const handleSelectTheme = (theme) => {
//     setSelectedTheme(theme);
//     setGameState('learning');
//     setSeenNumbers(new Set([NUMBERS[0].value]));
//     setCurrentIdx(0);
//     speak(`Let's count ${theme.plural}!`);
//     setTimeout(() => {
//       startCounting(NUMBERS[0].value);
//     }, 1000);
//   };

//   const resetGame = () => {
//     setGameState('intro');
//     setSeenNumbers(new Set());
//     setCurrentIdx(0);
//     setAutoNextTimer(null);
//     if (countingIntervalRef.current) clearInterval(countingIntervalRef.current);
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

//   const currentNumberData = NUMBERS[currentIdx];
//   const showNumber = !isCounting && stepCount === currentNumberData.value && gameState === 'learning';

//   return (
//     // STRICT WRAPPER: 100dvh, hidden overflow, flex column ensures no scrolling ever.
//     <div className="h-[100dvh] w-screen bg-[#e8e4d8] font-sans select-none overflow-hidden flex flex-col text-[#e3d8c8] relative">
      
//       {/* HEADER */}
//       <header className="h-14 sm:h-16 w-[calc(100%-16px)] mx-auto mt-2 bg-[#261712] rounded-t-xl sm:rounded-xl flex-shrink-0 flex justify-between items-center px-4 shadow-lg z-10 border-b-4 border-[#1c100c]">
//         <div className="flex items-center gap-3">
//           <div className="flex flex-col">
//             <div className="text-[10px] text-[#9c8b7b] font-black flex items-center gap-1 cursor-pointer hover:text-white transition-colors uppercase tracking-widest">
//                <ChevronLeft size={12} strokeWidth={3}/> DASHBOARD
//             </div>
//             <h1 className="text-[16px] font-black text-white uppercase tracking-widest leading-none mt-0.5 flex items-center gap-2">
//               <Gamepad2 size={16} className="text-[#fbbf24]" />
//               Counting Lab
//             </h1>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-4">
//           <button 
//              onClick={() => {
//                if (audioCtxRef.current) audioCtxRef.current.resume();
//                playBackgroundMusic();
//                setIsMusicOn(!isMusicOn);
//              }}
//              className={`p-1.5 rounded-md border-b-2 active:translate-y-[2px] active:border-b-0 transition-all ${isMusicOn ? 'bg-[#3b82f6] border-[#2563eb] text-white' : 'bg-[#120a07] border-[#3b251a] text-[#9c8b7b]'}`}
//           >
//              {isMusicOn ? <Music size={16} /> : <Music2 size={16} />}
//           </button>

//           <button onClick={resetGame} className="bg-[#ef4444] p-1.5 rounded-md text-white border-b-2 border-[#b91c1c] active:translate-y-[2px] active:border-b-0 transition-all">
//              <RefreshCcw size={16} />
//           </button>
//         </div>
//       </header>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative z-0">
        
//         {/* DIV 1: THE TRAY (Kid on left, objects on right) */}
//         <div className="flex-[1.2] min-h-0 bg-[#2d2019] rounded-xl border-[3px] border-[#1d140e] shadow-xl p-3 sm:p-5 flex flex-col relative">
//           <h2 className="text-[#a39182] text-[12px] sm:text-[14px] font-black tracking-[0.2em] text-center mb-2 uppercase z-10 shrink-0">
//              Objects In The Tray
//           </h2>
          
//           <div className="flex-1 min-h-0 border border-[#4a3424] rounded-lg bg-[#251811] relative overflow-hidden flex flex-row">
             
//              {/* Kid Section (Left Side) */}
//              <div className="w-1/3 sm:w-1/4 h-full border-r border-[#4a3424] flex flex-col items-center justify-center p-2 bg-[#2a1b13] relative z-10 shrink-0">
                
//                 {/* Entertaining Jump Animation on every count */}
//                 <motion.div
//                    key={isCounting ? stepCount : 'idle'}
//                    initial={isCounting && stepCount > 0 ? { y: 0, scale: 1 } : false}
//                    animate={isCounting && stepCount > 0 ? { y: [0, -25, 0], scale: [1, 1.05, 1] } : { y: [0, -4, 0] }}
//                    transition={isCounting && stepCount > 0 ? { duration: 0.35, ease: "easeInOut" } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
//                    className="w-full max-w-[140px] sm:max-w-[180px] h-auto drop-shadow-2xl"
//                 >
//                    <KidCharacter isTalking={isCounting || gameState === 'intro'} />
//                 </motion.div>
                
//                 {/* Live Count Under Kid */}
//                 <div className="h-10 mt-2 sm:mt-4 flex items-center justify-center relative">
//                    <AnimatePresence mode="popLayout">
//                      {gameState === 'learning' && isCounting && stepCount > 0 && (
//                        <motion.div 
//                          key={`count-badge-${stepCount}`}
//                          initial={{ scale: 0, y: -10, rotate: -15 }}
//                          animate={{ scale: 1, y: 0, rotate: 0 }}
//                          exit={{ scale: 0, opacity: 0 }}
//                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                          className="px-5 py-2 sm:px-6 sm:py-3 bg-[#fbbf24] text-[#4a3424] rounded-full font-black text-[28px] sm:text-[36px] border-[4px] sm:border-[6px] border-[#d97706] shadow-xl leading-none absolute"
//                        >
//                           {stepCount}
//                        </motion.div>
//                      )}
//                      {gameState === 'learning' && !isCounting && stepCount === currentNumberData.value && (
//                        <motion.div 
//                          key="done-badge"
//                          initial={{ scale: 0 }}
//                          animate={{ scale: 1 }}
//                          className="px-4 py-2 bg-[#4ade80] text-[#14532d] rounded-xl text-[14px] sm:text-[16px] font-black uppercase tracking-wider shadow-lg absolute whitespace-nowrap flex flex-col items-center leading-tight z-20"
//                        >
//                           <span>Wow!</span>
//                           <span className="text-[10px] sm:text-[12px] font-bold opacity-90 capitalize">
//                              {currentNumberData.value === 1 
//                                ? `This is 1 ${selectedTheme.name}` 
//                                : `These are ${currentNumberData.value} ${selectedTheme.plural}`}
//                           </span>
//                        </motion.div>
//                      )}
//                    </AnimatePresence>
//                 </div>
//              </div>

//              {/* Objects Tray (Right Side) */}
//              <div className="flex-1 relative h-full flex items-center justify-center p-2 sm:p-4">
//                {/* Faint Horizontal Lines representing board */}
//                <div className="absolute inset-0 flex flex-col justify-between py-4 sm:py-8 px-4 pointer-events-none opacity-40">
//                   {[...Array(6)].map((_, i) => (
//                     <div key={i} className="w-full border-t border-[#4a3424] flex items-center" />
//                   ))}
//                </div>

//                {/* Objects Display */}
//                <div className="z-10 w-full h-full flex items-center justify-center">
//                   {(gameState === 'learning' || gameState === 'outro') ? (
//                      <div className="flex flex-wrap justify-center items-center content-center gap-4 sm:gap-8 w-full max-w-[85%] mx-auto">
//                        {Array.from({ length: currentNumberData.value }).map((_, i) => (
//                          <div key={`item-${i}`} className="flex items-center justify-center w-12 h-12 sm:w-20 sm:h-20 shrink-0">
//                            <AnimatePresence>
//                              {i < stepCount && (
//                                 <motion.span
//                                   initial={{ scale: 0, y: -20, opacity: 0 }}
//                                   animate={{ scale: 1, y: 0, opacity: 1 }}
//                                   transition={{ type: "spring", stiffness: 120, damping: 12 }}
//                                   className="text-[6vh] sm:text-[9vh] drop-shadow-md leading-none select-none"
//                                 >
//                                   {selectedTheme.emoji}
//                                 </motion.span>
//                              )}
//                            </AnimatePresence>
//                          </div>
//                        ))}
//                      </div>
//                   ) : (
//                      <div className="flex flex-col items-center justify-center opacity-30 filter grayscale">
//                         <span className="text-[10vh]">{selectedTheme.emoji}</span>
//                         <span className="text-[#e3d8c8] font-bold text-[14px] mt-2 tracking-widest uppercase">Waiting to count...</span>
//                      </div>
//                   )}
//                </div>
//              </div>
//           </div>
//         </div>

//         {/* DIV 2: REVEAL / SELECTION */}
//         <div className="flex-1 min-h-0 bg-[#3a281e] rounded-xl border-[3px] border-[#1d140e] shadow-xl p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative overflow-hidden bg-gradient-to-b from-[#3a281e] to-[#2d1e16]">
          
//           {/* THEME SELECTION STATE (Replaces Div 2 content entirely) */}
//           {gameState === 'selection' && (
//              <div className="flex-1 w-full h-full flex flex-col items-center justify-center">
//                 <h3 className="text-[16px] sm:text-[20px] font-black text-[#fbbf24] mb-4 uppercase tracking-widest text-center animate-pulse flex items-center gap-2">
//                   <MousePointer2 size={20} /> Choose your objects!
//                 </h3>
//                 <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-3xl">
//                    {THEMES.map((theme) => (
//                       <button
//                          key={theme.id}
//                          onClick={() => handleSelectTheme(theme)}
//                          className="bg-[#291b13] border-[3px] border-[#1a110b] hover:border-[#fbbf24] p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group"
//                       >
//                          <span className="text-[4vh] sm:text-[6vh] group-hover:scale-110 transition-transform">{theme.emoji}</span>
//                          <span className="text-[#9c8b7b] group-hover:text-white font-black uppercase tracking-wider text-[10px] sm:text-[12px]">{theme.name}</span>
//                       </button>
//                    ))}
//                 </div>
//              </div>
//           )}

//           {/* LEARNING / OUTRO STATE (Focused purely on the number) */}
//           {(gameState === 'learning' || gameState === 'outro') && (
//              <div className="flex-1 min-h-0 flex flex-col gap-4 bg-[#2f2018] rounded-xl p-4 sm:p-6 border border-[#1a110b] shadow-inner items-center justify-center relative">
                
//                 {/* Central Number Reveal */}
//                 <div className="flex-1 flex flex-col items-center justify-center w-full">
//                     {showNumber ? (
//                        <motion.div 
//                          initial={{ scale: 0.5, opacity: 0 }} 
//                          animate={{ scale: 1, opacity: 1 }} 
//                          className="text-[14vh] sm:text-[20vh] font-black leading-none drop-shadow-2xl flex flex-col items-center"
//                          style={{ color: currentNumberData.color }}
//                        >
//                           {currentNumberData.value}
//                           <span className="text-[20px] sm:text-[30px] mt-2 uppercase tracking-widest text-[#fbbf24] font-black">
//                              {currentNumberData.name}
//                           </span>
//                        </motion.div>
//                     ) : (
//                        <div className="flex flex-col items-center justify-center">
//                           <div className="text-[10vh] sm:text-[16vh] font-black text-[#4a3424] leading-none mb-4 drop-shadow-sm">?</div>
//                           {gameState === 'learning' && (
//                             <div className="text-[14px] sm:text-[18px] text-[#fbbf24] font-black tracking-widest uppercase animate-pulse">
//                                How many are there?
//                             </div>
//                           )}
//                        </div>
//                     )}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 shrink-0 max-w-md mt-auto">
//                    <button 
//                       onClick={handleNextSequential} 
//                       disabled={!showNumber} 
//                       className={`flex-1 flex justify-center items-center gap-2 border-b-4 rounded-full py-3 sm:py-4 font-black text-[12px] sm:text-[14px] uppercase tracking-wider transition-all active:scale-95 active:border-b-0 ${
//                         showNumber 
//                         ? 'bg-[#3b82f6] border-[#2563eb] text-white hover:bg-[#2563eb] shadow-lg' 
//                         : 'bg-[#1a110b] border-[#1a110b] text-[#4a3424] opacity-50 cursor-not-allowed'
//                       }`}
//                    >
//                       {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Next Lesson'}
//                       <ChevronRight size={18} />
//                    </button>
//                    <button 
//                       onClick={handleNextRandom} 
//                       disabled={!showNumber} 
//                       className={`flex-1 flex justify-center items-center gap-2 border-b-4 rounded-full py-3 sm:py-4 font-black text-[12px] sm:text-[14px] uppercase tracking-wider transition-all active:scale-95 active:border-b-0 ${
//                         showNumber 
//                         ? 'bg-[#10b981] border-[#059669] text-white hover:bg-[#059669] shadow-lg' 
//                         : 'bg-[#1a110b] border-[#1a110b] text-[#4a3424] opacity-50 cursor-not-allowed'
//                       }`}
//                    >
//                       <Shuffle size={18} />
//                       Random Pick
//                    </button>
//                 </div>
//              </div>
//           )}

//         </div>
//       </main>

//       {/* --- OVERLAYS --- */}

//       {/* INTRO POP-UP */}
//       <AnimatePresence>
//         {gameState === 'intro' && (
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="absolute inset-0 z-50 bg-[#120a07]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
//           >
//             <motion.div
//               initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
//               className="w-full max-w-xl flex flex-row items-end gap-2 sm:gap-6 relative"
//             >
//                {/* Kid standing outside the bubble */}
//                <div className="w-28 h-40 sm:w-56 sm:h-72 shrink-0 drop-shadow-2xl z-10 -mb-2 sm:-mb-4">
//                   <KidCharacter className="w-full h-full" isTalking={true} />
//                </div>

//                {/* Speech Bubble */}
//                <div className="bg-[#fffbeb] rounded-[2rem] p-5 sm:p-8 flex-1 border-[4px] sm:border-[6px] border-[#fbbf24] shadow-2xl relative mb-4 sm:mb-10">
//                   {/* Bubble Pointer */}
//                   <div className="absolute top-[60%] -left-[18px] sm:-left-[24px] w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-r-[20px] sm:border-r-[24px] border-r-[#fbbf24] border-b-[10px] sm:border-b-[12px] border-b-transparent"></div>
//                   <div className="absolute top-[60%] -left-[10px] sm:-left-[14px] w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-r-[18px] sm:border-r-[20px] border-r-[#fffbeb] border-b-[8px] sm:border-b-[10px] border-b-transparent z-10"></div>
                  
//                   <h2 className="text-[18px] sm:text-[24px] font-black text-[#d97706] mb-2 sm:mb-3 uppercase tracking-wide">
//                     Hi Friend! 👋
//                   </h2>
//                   <p className="text-[#78350f] font-bold text-[14px] sm:text-[18px] leading-snug mb-4 sm:mb-6">
//                     Today we are going to learn how to count from 1 to 9. <br/><br className="hidden sm:block"/>
//                     Watch me count the objects in the tray closely!
//                   </p>
                  
//                   <button 
//                     onClick={startGame} 
//                     className="w-full bg-[#fbbf24] text-[#4a3424] text-[14px] sm:text-[20px] font-black py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_4px_0_#d97706] sm:shadow-[0_6px_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest border-2 border-[#d97706]"
//                   >
//                     <Play fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
//                     Let's Play!
//                   </button>
//                </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* OUTRO POP-UP */}
//       <AnimatePresence>
//         {gameState === 'outro' && (
//           <motion.div 
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className="absolute inset-0 z-50 bg-[#120a07]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
//           >
//             <motion.div
//               initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
//               className="w-full max-w-2xl flex flex-row items-end gap-2 sm:gap-6 relative"
//             >
//                {/* Kid standing outside the bubble */}
//                <div className="w-28 h-40 sm:w-56 sm:h-72 shrink-0 drop-shadow-2xl z-10 -mb-2 sm:-mb-4">
//                   <KidCharacter className="w-full h-full" isTalking={true} />
//                </div>

//                {/* Speech Bubble */}
//                <div className="bg-[#fffbeb] rounded-[2rem] p-5 sm:p-8 flex-1 border-[4px] sm:border-[6px] border-[#10b981] shadow-2xl relative mb-4 sm:mb-10">
//                   {/* Bubble Pointer */}
//                   <div className="absolute top-[60%] -left-[18px] sm:-left-[24px] w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-r-[20px] sm:border-r-[24px] border-r-[#10b981] border-b-[10px] sm:border-b-[12px] border-b-transparent"></div>
//                   <div className="absolute top-[60%] -left-[10px] sm:-left-[14px] w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-r-[18px] sm:border-r-[20px] border-r-[#fffbeb] border-b-[8px] sm:border-b-[10px] border-b-transparent z-10"></div>
                  
//                   <h2 className="text-[18px] sm:text-[24px] font-black text-[#047857] mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2">
//                     <Trophy className="text-[#fbbf24] w-5 h-5 sm:w-8 sm:h-8" /> You Did It! 🎉
//                   </h2>
                  
//                   <div className="text-[#065f46] font-bold text-[12px] sm:text-[16px] leading-snug mb-4 sm:mb-6">
//                     <p className="mb-1 sm:mb-2 text-[#047857] font-black uppercase tracking-wider text-[10px] sm:text-[14px]">What you learned:</p>
//                     <div className="flex flex-col gap-1 sm:gap-2">
//                        <span className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#10b981] shrink-0 sm:w-4 sm:h-4 mt-0.5"/> How to count objects one by one.</span>
//                        <span className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#10b981] shrink-0 sm:w-4 sm:h-4 mt-0.5"/> Recognizing numbers from 1 to 9.</span>
//                     </div>
//                   </div>
                  
//                   <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                      <button 
//                        onClick={resetGame}
//                        className="flex-1 bg-[#10b981] text-white text-[12px] sm:text-[16px] font-black py-2.5 sm:py-4 px-3 sm:px-4 rounded-full shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-widest border-2 border-[#047857]"
//                      >
//                        <RefreshCcw size={16} className="sm:w-5 sm:h-5" />
//                        Play Again
//                      </button>
//                      <button 
//                        onClick={() => speak("Moving to the next module!")}
//                        className="flex-1 bg-[#3b82f6] text-white text-[12px] sm:text-[16px] font-black py-2.5 sm:py-4 px-3 sm:px-4 rounded-full shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-widest border-2 border-[#1d4ed8]"
//                      >
//                        Next Module
//                        <ChevronRight size={16} className="sm:w-5 sm:h-5" />
//                      </button>
//                   </div>
//                </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//     </div>
//   );
// }

// // --- KID CHARACTER COMPONENT ---
// // Responsive SVG character with waving arms
// function KidCharacter({ className, isTalking = false, isWalking = false }) {
//   return (
//     <motion.div
//       className={className}
//       animate={isWalking ? {
//         x: [0, 5, -5, 0],
//         y: [0, -5, 0, -5, 0],
//       } : {
//         rotate: [0, 1, -1, 0]
//       }}
//       transition={{
//         repeat: Infinity,
//         duration: isWalking ? 0.5 : 4,
//         ease: "easeInOut"
//       }}
//     >
//       <svg className="w-full h-full" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
//         <defs>
//           <radialGradient id="faceGrad" cx="100" cy="110" r="45" gradientUnits="userSpaceOnUse">
//             <stop stopColor="#ffdbac" />
//             <stop offset="1" stopColor="#f1c27d" />
//           </radialGradient>
//           <linearGradient id="shirtGrad" x1="100" y1="160" x2="100" y2="220" gradientUnits="userSpaceOnUse">
//             <stop stopColor="#3b82f6" />
//             <stop offset="1" stopColor="#1d4ed8" />
//           </linearGradient>
//         </defs>

//         {/* Legs */}
//         <motion.g animate={isWalking ? { rotate: [-20, 20, -20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
//             <rect x="75" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
//             <rect x="68" y="245" width="30" height="15" rx="8" fill="#4a3424" />
//         </motion.g>
//         <motion.g animate={isWalking ? { rotate: [20, -20, 20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
//             <rect x="105" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
//             <rect x="102" y="245" width="30" height="15" rx="8" fill="#4a3424" />
//         </motion.g>

//         {/* Body/Shirt */}
//         <rect x="70" y="200" width="60" height="25" rx="5" fill="#1e3a8a" />
        
//         {/* Arms (Excited waving when talking/counting) */}
//         <motion.rect x="50" y="165" width="25" height="40" rx="12" fill="#ffdbac" 
//            animate={isTalking ? { rotate: [15, 60, 15] } : { rotate: 15 }} 
//            style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.4 }} />
//         <motion.rect x="125" y="165" width="25" height="40" rx="12" fill="#ffdbac" 
//            animate={isTalking ? { rotate: [-15, -60, -15] } : { rotate: -15 }} 
//            style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.4 }} />
           
//         <path d="M60 160C60 160 80 150 100 150C120 150 140 160 140 160V210H60V160Z" fill="url(#shirtGrad)" />

//         {/* Head/Hair */}
//         <path d="M55 110C55 70 80 55 100 55C120 55 145 70 145 110" stroke="#4a3424" strokeWidth="25" strokeLinecap="round"/>
//         <circle cx="100" cy="110" r="48" fill="url(#faceGrad)" />
        
//         {/* Hat/Cap */}
//         <path d="M55 95C55 95 75 75 100 75C125 75 145 95 145 95" fill="#ef4444" />
//         <path d="M52 95C52 95 80 85 100 85C120 85 148 95 148 95L155 100H45L52 95Z" fill="#b91c1c" />

//         {/* Eyes (Blinking) */}
//         <motion.g animate={{ scaleY: [1, 1, 1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3.5 }}>
//           <circle cx="82" cy="110" r="6" fill="#4a3424" />
//           <circle cx="118" cy="110" r="6" fill="#4a3424" />
//         </motion.g>

//         {/* Mouth (Talk Animation) */}
//         <motion.path
//           stroke="#4a3424" strokeWidth="4" strokeLinecap="round" fill={isTalking ? "#4a3424" : "none"}
//           animate={isTalking ? { d: ["M85 135 Q100 150 115 135 Q100 145 85 135", "M88 138 Q100 145 112 138 Q100 142 88 138", "M85 135 Q100 150 115 135 Q100 145 85 135"] } : { d: "M85 135 Q100 145 115 135" }}
//           transition={{ repeat: Infinity, duration: 0.4 }}
//         />
//       </svg>
//     </motion.div>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, 
  Sparkles, Play, 
  ChevronRight, Shuffle, 
  Trophy, Gamepad2, Music, Music2,
  ChevronLeft, MousePointer2, CheckCircle2
} from 'lucide-react';

// --- Constants ---
const NUMBERS = [
  { value: 1, name: 'One', color: '#60a5fa' },
  { value: 2, name: 'Two', color: '#34d399' },
  { value: 3, name: 'Three', color: '#a78bfa' },
  { value: 4, name: 'Four', color: '#fb923c' },
  { value: 5, name: 'Five', color: '#f472b6' },
  { value: 6, name: 'Six', color: '#4ade80' },
  { value: 7, name: 'Seven', color: '#fbbf24' },
  { value: 8, name: 'Eight', color: '#f87171' },
  { value: 9, name: 'Nine', color: '#a3e635' },
];

const THEMES = [
  { id: 'apple', emoji: '🍎', name: 'Apple', plural: 'Apples' },
  { id: 'candy', emoji: '🍬', name: 'Candy', plural: 'Candies' },
  { id: 'cat', emoji: '🐱', name: 'Cat', plural: 'Cats' },
  { id: 'lion', emoji: '🦁', name: 'Lion', plural: 'Lions' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant', plural: 'Elephants' },
  { id: 'robot', emoji: '🤖', name: 'Robot', plural: 'Robots' },
];

export default function App() {
  const [gameState, setGameState] = useState('intro'); // intro, selection, learning, outro
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stepCount, setStepCount] = useState(0);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [seenNumbers, setSeenNumbers] = useState(new Set());

  const timerIntervalRef = useRef(null);
  const countingIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // --- Audio Logic ---
  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.3;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playBackgroundMusic = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const playNote = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.02, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = ctx.currentTime;
      const notes = [261.63, 329.63, 392.00, 523.25];
      for (let i = 0; i < 200; i++) {
        playNote(notes[i % 4], now + i * 1.5, 1.2);
      }
      setIsMusicOn(true);
    } catch (e) {
      console.warn("Audio Context blocked.");
    }
  };

  const startCounting = useCallback((targetValue) => {
    setStepCount(0);
    setIsCounting(true);
    setAutoNextTimer(null);
    if (countingIntervalRef.current) clearInterval(countingIntervalRef.current);

    let current = 0;
    countingIntervalRef.current = setInterval(() => {
      if (current < targetValue) {
        current += 1;
        setStepCount(current);
        speak(`${current}`);
      } else {
        clearInterval(countingIntervalRef.current);
        setIsCounting(false);
        const label = targetValue > 1 ? selectedTheme.plural : selectedTheme.name;
        speak(`That makes ${targetValue} ${label}!`);
        setAutoNextTimer(6); 
      }
    }, 2200); // Increased interval by 1 second to slow down the counting
  }, [selectedTheme, speak]);

  const handleNextSequential = useCallback(() => {
    if (seenNumbers.size >= NUMBERS.length) {
      setGameState('outro');
      speak("Great job! We finished counting everything!");
      return;
    }

    let nextIdx = (currentIdx + 1) % NUMBERS.length;
    while (seenNumbers.has(NUMBERS[nextIdx].value) && seenNumbers.size < NUMBERS.length) {
      nextIdx = (nextIdx + 1) % NUMBERS.length;
    }

    setCurrentIdx(nextIdx);
    setAutoNextTimer(null);
    setSeenNumbers(prev => new Set(prev).add(NUMBERS[nextIdx].value));
    startCounting(NUMBERS[nextIdx].value);
  }, [currentIdx, seenNumbers, startCounting]);

  const handleNextRandom = () => {
    if (seenNumbers.size >= NUMBERS.length) {
      setGameState('outro');
      speak("Great job! We finished counting everything!");
      return;
    }

    const available = NUMBERS.filter(n => !seenNumbers.has(n.value));
    const randomPick = available[Math.floor(Math.random() * available.length)];
    const nextIdx = NUMBERS.findIndex(n => n.value === randomPick.value);
    
    setCurrentIdx(nextIdx);
    setAutoNextTimer(null);
    setSeenNumbers(prev => new Set(prev).add(NUMBERS[nextIdx].value));
    startCounting(NUMBERS[nextIdx].value);
  };

  const startGame = () => {
    setGameState('selection');
    speak("What should we count today?");
  };

  const handleSelectTheme = (theme) => {
    setSelectedTheme(theme);
    setGameState('learning');
    setSeenNumbers(new Set([NUMBERS[0].value]));
    setCurrentIdx(0);
    speak(`Let's count ${theme.plural}!`);
    setTimeout(() => {
      startCounting(NUMBERS[0].value);
    }, 1000);
  };

  const resetGame = () => {
    setGameState('intro');
    setSeenNumbers(new Set());
    setCurrentIdx(0);
    setAutoNextTimer(null);
    if (countingIntervalRef.current) clearInterval(countingIntervalRef.current);
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

  const currentNumberData = NUMBERS[currentIdx];
  const showNumber = !isCounting && stepCount === currentNumberData.value && gameState === 'learning';

  return (
    // STRICT WRAPPER: 100dvh, hidden overflow, flex column ensures no scrolling ever.
    <div className="h-[100dvh] w-screen bg-[#e8e4d8] font-sans select-none overflow-hidden flex flex-col text-[#e3d8c8] relative">
      
      {/* HEADER WRAPPER - Properly constrained to align with the main container */}
      <div className="w-full max-w-[1000px] mx-auto px-2 sm:px-4 mt-2 sm:mt-4 shrink-0">
        <header className="h-14 sm:h-16 bg-[#261712] rounded-xl flex justify-between items-center px-4 shadow-lg z-10 border-b-4 border-[#1c100c]">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="text-[10px] text-[#9c8b7b] font-black flex items-center gap-1 cursor-pointer hover:text-white transition-colors uppercase tracking-widest">
                 <ChevronLeft size={12} strokeWidth={3}/> DASHBOARD
              </div>
              <h1 className="text-[16px] font-black text-white uppercase tracking-widest leading-none mt-0.5 flex items-center gap-2">
                <Gamepad2 size={16} className="text-[#fbbf24]" />
                Counting Lab
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button 
               onClick={() => {
                 if (audioCtxRef.current) audioCtxRef.current.resume();
                 playBackgroundMusic();
                 setIsMusicOn(!isMusicOn);
               }}
               className={`p-1.5 rounded-md border-b-2 active:translate-y-[2px] active:border-b-0 transition-all ${isMusicOn ? 'bg-[#3b82f6] border-[#2563eb] text-white' : 'bg-[#120a07] border-[#3b251a] text-[#9c8b7b]'}`}
            >
               {isMusicOn ? <Music size={16} /> : <Music2 size={16} />}
            </button>

            <button onClick={resetGame} className="bg-[#ef4444] p-1.5 rounded-md text-white border-b-2 border-[#b91c1c] active:translate-y-[2px] active:border-b-0 transition-all">
               <RefreshCcw size={16} />
            </button>
          </div>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-h-0 w-full max-w-[1000px] mx-auto p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative z-0 mb-2 sm:mb-4">
        
        {/* DIV 1: THE TRAY (Kid on left, objects on right) */}
        <div className="flex-[1.2] min-h-0 bg-[#2d2019] rounded-xl border-[3px] border-[#1d140e] shadow-xl p-3 sm:p-5 flex flex-col relative">
          <h2 className="text-[#a39182] text-[12px] sm:text-[14px] font-black tracking-[0.2em] text-center mb-2 uppercase z-10 shrink-0">
             Objects In The Tray
          </h2>
          
          <div className="flex-1 min-h-0 border border-[#4a3424] rounded-lg bg-[#251811] relative overflow-hidden flex flex-row">
             
             {/* Kid Section (Left Side) */}
             <div className="w-1/3 sm:w-1/4 h-full border-r border-[#4a3424] flex flex-col items-center justify-center p-2 bg-[#2a1b13] relative z-10 shrink-0">
                
                {/* Entertaining Jump Animation on every count */}
                <motion.div
                   key={isCounting ? stepCount : 'idle'}
                   initial={isCounting && stepCount > 0 ? { y: 0, scale: 1 } : false}
                   animate={isCounting && stepCount > 0 ? { y: [0, -25, 0], scale: [1, 1.05, 1] } : { y: [0, -4, 0] }}
                   transition={isCounting && stepCount > 0 ? { duration: 0.35, ease: "easeInOut" } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
                   className="w-full max-w-[140px] sm:max-w-[180px] h-auto drop-shadow-2xl"
                >
                   <KidCharacter isTalking={isCounting || gameState === 'intro'} />
                </motion.div>
                
                {/* Live Count Under Kid */}
                <div className="h-10 mt-2 sm:mt-4 flex items-center justify-center relative">
                   <AnimatePresence mode="popLayout">
                     {gameState === 'learning' && isCounting && stepCount > 0 && (
                       <motion.div 
                         key={`count-badge-${stepCount}`}
                         initial={{ scale: 0, y: -10, rotate: -15 }}
                         animate={{ scale: 1, y: 0, rotate: 0 }}
                         exit={{ scale: 0, opacity: 0 }}
                         transition={{ type: "spring", stiffness: 300, damping: 20 }}
                         className="px-5 py-2 sm:px-6 sm:py-3 bg-[#fbbf24] text-[#4a3424] rounded-full font-black text-[24px] sm:text-[36px] border-[3px] sm:border-[5px] border-[#d97706] shadow-xl leading-none absolute"
                       >
                          {stepCount}
                       </motion.div>
                     )}
                     {gameState === 'learning' && !isCounting && stepCount === currentNumberData.value && (
                       <motion.div 
                         key="done-badge"
                         initial={{ scale: 0 }}
                         animate={{ scale: 1 }}
                         className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4ade80] text-[#14532d] rounded-xl text-[12px] sm:text-[16px] font-black uppercase tracking-wider shadow-lg absolute whitespace-nowrap flex flex-col items-center leading-tight z-20"
                       >
                          <span>Wow!</span>
                          <span className="text-[9px] sm:text-[12px] font-bold opacity-90 capitalize">
                             {currentNumberData.value === 1 
                               ? `This is 1 ${selectedTheme.name}` 
                               : `These are ${currentNumberData.value} ${selectedTheme.plural}`}
                          </span>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
             </div>

             {/* Objects Tray (Right Side) */}
             <div className="flex-1 relative h-full flex items-center justify-center p-2 sm:p-4">
               {/* Faint Horizontal Lines representing board */}
               <div className="absolute inset-0 flex flex-col justify-between py-4 sm:py-8 px-4 pointer-events-none opacity-40">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-full border-t border-[#4a3424] flex items-center" />
                  ))}
               </div>

               {/* Objects Display - Made fully responsive to prevent overlap */}
               <div className="z-10 w-full h-full flex items-center justify-center">
                  {(gameState === 'learning' || gameState === 'outro') ? (
                     <div className="flex flex-wrap justify-center items-center content-center gap-2 sm:gap-4 lg:gap-6 w-full max-w-[95%] mx-auto">
                       {Array.from({ length: currentNumberData.value }).map((_, i) => (
                         <div key={`item-${i}`} className="flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 lg:w-20 lg:h-20 shrink-0">
                           <AnimatePresence>
                             {i < stepCount && (
                                <motion.span
                                  initial={{ scale: 0, y: -20, opacity: 0 }}
                                  animate={{ scale: 1, y: 0, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 120, damping: 12 }}
                                  className="text-[4vh] sm:text-[6vh] lg:text-[8vh] drop-shadow-md leading-none select-none"
                                >
                                  {selectedTheme.emoji}
                                </motion.span>
                             )}
                           </AnimatePresence>
                         </div>
                       ))}
                     </div>
                  ) : (
                     <div className="flex flex-col items-center justify-center opacity-30 filter grayscale">
                        <span className="text-[10vh]">{selectedTheme.emoji}</span>
                        <span className="text-[#e3d8c8] font-bold text-[14px] mt-2 tracking-widest uppercase">Waiting to count...</span>
                     </div>
                  )}
               </div>
             </div>
          </div>
        </div>

        {/* DIV 2: REVEAL / SELECTION */}
        <div className="flex-1 min-h-0 bg-[#3a281e] rounded-xl border-[3px] border-[#1d140e] shadow-xl p-2 sm:p-4 flex flex-col gap-2 sm:gap-4 relative overflow-hidden bg-gradient-to-b from-[#3a281e] to-[#2d1e16]">
          
          {/* THEME SELECTION STATE (Replaces Div 2 content entirely) */}
          {gameState === 'selection' && (
             <div className="flex-1 w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-[16px] sm:text-[20px] font-black text-[#fbbf24] mb-4 uppercase tracking-widest text-center animate-pulse flex items-center gap-2">
                  <MousePointer2 size={20} /> Choose your objects!
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 w-full max-w-3xl">
                   {THEMES.map((theme) => (
                      <button
                         key={theme.id}
                         onClick={() => handleSelectTheme(theme)}
                         className="bg-[#291b13] border-[3px] border-[#1a110b] hover:border-[#fbbf24] p-3 sm:p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group"
                      >
                         <span className="text-[4vh] sm:text-[6vh] group-hover:scale-110 transition-transform">{theme.emoji}</span>
                         <span className="text-[#9c8b7b] group-hover:text-white font-black uppercase tracking-wider text-[10px] sm:text-[12px]">{theme.name}</span>
                      </button>
                   ))}
                </div>
             </div>
          )}

          {/* LEARNING / OUTRO STATE (Focused purely on the number) */}
          {(gameState === 'learning' || gameState === 'outro') && (
             <div className="flex-1 min-h-0 flex flex-col gap-4 bg-[#2f2018] rounded-xl p-4 sm:p-6 border border-[#1a110b] shadow-inner items-center justify-center relative">
                
                {/* Central Number Reveal */}
                <div className="flex-1 flex flex-col items-center justify-center w-full">
                    {showNumber ? (
                       <motion.div 
                         initial={{ scale: 0.5, opacity: 0 }} 
                         animate={{ scale: 1, opacity: 1 }} 
                         className="text-[14vh] sm:text-[20vh] font-black leading-none drop-shadow-2xl flex flex-col items-center"
                         style={{ color: currentNumberData.color }}
                       >
                          {currentNumberData.value}
                          <span className="text-[20px] sm:text-[30px] mt-2 uppercase tracking-widest text-[#fbbf24] font-black">
                             {currentNumberData.name}
                          </span>
                       </motion.div>
                    ) : (
                       <div className="flex flex-col items-center justify-center">
                          <div className="text-[10vh] sm:text-[16vh] font-black text-[#4a3424] leading-none mb-4 drop-shadow-sm">?</div>
                          {gameState === 'learning' && (
                            <div className="text-[14px] sm:text-[18px] text-[#fbbf24] font-black tracking-widest uppercase animate-pulse text-center px-4">
                               How many are there?
                            </div>
                          )}
                       </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="w-full flex flex-col sm:flex-row gap-2 sm:gap-4 shrink-0 max-w-md mt-auto">
                   <button 
                      onClick={handleNextSequential} 
                      disabled={!showNumber} 
                      className={`flex-1 flex justify-center items-center gap-2 border-b-4 rounded-full py-3 sm:py-4 font-black text-[12px] sm:text-[14px] uppercase tracking-wider transition-all active:scale-95 active:border-b-0 ${
                        showNumber 
                        ? 'bg-[#3b82f6] border-[#2563eb] text-white hover:bg-[#2563eb] shadow-lg' 
                        : 'bg-[#1a110b] border-[#1a110b] text-[#4a3424] opacity-50 cursor-not-allowed'
                      }`}
                   >
                      {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Next Lesson'}
                      <ChevronRight size={18} />
                   </button>
                   <button 
                      onClick={handleNextRandom} 
                      disabled={!showNumber} 
                      className={`flex-1 flex justify-center items-center gap-2 border-b-4 rounded-full py-3 sm:py-4 font-black text-[12px] sm:text-[14px] uppercase tracking-wider transition-all active:scale-95 active:border-b-0 ${
                        showNumber 
                        ? 'bg-[#10b981] border-[#059669] text-white hover:bg-[#059669] shadow-lg' 
                        : 'bg-[#1a110b] border-[#1a110b] text-[#4a3424] opacity-50 cursor-not-allowed'
                      }`}
                   >
                      <Shuffle size={18} />
                      Random Pick
                   </button>
                </div>
             </div>
          )}

        </div>
      </main>

      {/* --- OVERLAYS --- */}

      {/* INTRO POP-UP */}
      <AnimatePresence>
        {gameState === 'intro' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#120a07]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl flex flex-row items-end gap-2 sm:gap-6 relative"
            >
               {/* Kid standing outside the bubble */}
               <div className="w-28 h-40 sm:w-56 sm:h-72 shrink-0 drop-shadow-2xl z-10 -mb-2 sm:-mb-4">
                  <KidCharacter className="w-full h-full" isTalking={true} />
               </div>

               {/* Speech Bubble */}
               <div className="bg-[#fffbeb] rounded-[2rem] p-5 sm:p-8 flex-1 border-[4px] sm:border-[6px] border-[#fbbf24] shadow-2xl relative mb-4 sm:mb-10">
                  {/* Bubble Pointer */}
                  <div className="absolute top-[60%] -left-[18px] sm:-left-[24px] w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-r-[20px] sm:border-r-[24px] border-r-[#fbbf24] border-b-[10px] sm:border-b-[12px] border-b-transparent"></div>
                  <div className="absolute top-[60%] -left-[10px] sm:-left-[14px] w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-r-[18px] sm:border-r-[20px] border-r-[#fffbeb] border-b-[8px] sm:border-b-[10px] border-b-transparent z-10"></div>
                  
                  <h2 className="text-[18px] sm:text-[24px] font-black text-[#d97706] mb-2 sm:mb-3 uppercase tracking-wide">
                    Hi Friend! 👋
                  </h2>
                  <p className="text-[#78350f] font-bold text-[14px] sm:text-[18px] leading-snug mb-4 sm:mb-6">
                    Today we are going to learn how to count from 1 to 9. <br/><br className="hidden sm:block"/>
                    Watch me count the objects in the tray closely!
                  </p>
                  
                  <button 
                    onClick={startGame} 
                    className="w-full bg-[#fbbf24] text-[#4a3424] text-[14px] sm:text-[20px] font-black py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-[0_4px_0_#d97706] sm:shadow-[0_6px_0_#d97706] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest border-2 border-[#d97706]"
                  >
                    <Play fill="currentColor" size={20} className="sm:w-6 sm:h-6" />
                    Let's Play!
                  </button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OUTRO POP-UP */}
      <AnimatePresence>
        {gameState === 'outro' && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#120a07]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl flex flex-row items-end gap-2 sm:gap-6 relative"
            >
               {/* Kid standing outside the bubble */}
               <div className="w-28 h-40 sm:w-56 sm:h-72 shrink-0 drop-shadow-2xl z-10 -mb-2 sm:-mb-4">
                  <KidCharacter className="w-full h-full" isTalking={true} />
               </div>

               {/* Speech Bubble */}
               <div className="bg-[#fffbeb] rounded-[2rem] p-5 sm:p-8 flex-1 border-[4px] sm:border-[6px] border-[#10b981] shadow-2xl relative mb-4 sm:mb-10">
                  {/* Bubble Pointer */}
                  <div className="absolute top-[60%] -left-[18px] sm:-left-[24px] w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-r-[20px] sm:border-r-[24px] border-r-[#10b981] border-b-[10px] sm:border-b-[12px] border-b-transparent"></div>
                  <div className="absolute top-[60%] -left-[10px] sm:-left-[14px] w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-r-[18px] sm:border-r-[20px] border-r-[#fffbeb] border-b-[8px] sm:border-b-[10px] border-b-transparent z-10"></div>
                  
                  <h2 className="text-[18px] sm:text-[24px] font-black text-[#047857] mb-2 sm:mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Trophy className="text-[#fbbf24] w-5 h-5 sm:w-8 sm:h-8" /> You Did It! 🎉
                  </h2>
                  
                  <div className="text-[#065f46] font-bold text-[12px] sm:text-[16px] leading-snug mb-4 sm:mb-6">
                    <p className="mb-1 sm:mb-2 text-[#047857] font-black uppercase tracking-wider text-[10px] sm:text-[14px]">What you learned:</p>
                    <div className="flex flex-col gap-1 sm:gap-2">
                       <span className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#10b981] shrink-0 sm:w-4 sm:h-4 mt-0.5"/> How to count objects one by one.</span>
                       <span className="flex items-start gap-2"><CheckCircle2 size={16} className="text-[#10b981] shrink-0 sm:w-4 sm:h-4 mt-0.5"/> Recognizing numbers from 1 to 9.</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                     <button 
                       onClick={resetGame}
                       className="flex-1 bg-[#10b981] text-white text-[12px] sm:text-[16px] font-black py-2.5 sm:py-4 px-3 sm:px-4 rounded-full shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-widest border-2 border-[#047857]"
                     >
                       <RefreshCcw size={16} className="sm:w-5 sm:h-5" />
                       Play Again
                     </button>
                     <button 
                       onClick={() => speak("Moving to the next module!")}
                       className="flex-1 bg-[#3b82f6] text-white text-[12px] sm:text-[16px] font-black py-2.5 sm:py-4 px-3 sm:px-4 rounded-full shadow-[0_4px_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-1 sm:gap-2 uppercase tracking-widest border-2 border-[#1d4ed8]"
                     >
                       Next Module
                       <ChevronRight size={16} className="sm:w-5 sm:h-5" />
                     </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

// --- KID CHARACTER COMPONENT ---
// Responsive SVG character with waving arms
function KidCharacter({ className, isTalking = false, isWalking = false }) {
  return (
    <motion.div
      className={className}
      animate={isWalking ? {
        x: [0, 5, -5, 0],
        y: [0, -5, 0, -5, 0],
      } : {
        rotate: [0, 1, -1, 0]
      }}
      transition={{
        repeat: Infinity,
        duration: isWalking ? 0.5 : 4,
        ease: "easeInOut"
      }}
    >
      <svg className="w-full h-full" viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="faceGrad" cx="100" cy="110" r="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffdbac" />
            <stop offset="1" stopColor="#f1c27d" />
          </radialGradient>
          <linearGradient id="shirtGrad" x1="100" y1="160" x2="100" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Legs */}
        <motion.g animate={isWalking ? { rotate: [-20, 20, -20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
            <rect x="75" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
            <rect x="68" y="245" width="30" height="15" rx="8" fill="#4a3424" />
        </motion.g>
        <motion.g animate={isWalking ? { rotate: [20, -20, 20] } : {}} transition={{ repeat: Infinity, duration: 0.5 }}>
            <rect x="105" y="215" width="20" height="35" rx="10" fill="#f1c27d" />
            <rect x="102" y="245" width="30" height="15" rx="8" fill="#4a3424" />
        </motion.g>

        {/* Body/Shirt */}
        <rect x="70" y="200" width="60" height="25" rx="5" fill="#1e3a8a" />
        
        {/* Arms (Excited waving when talking/counting) */}
        <motion.rect x="50" y="165" width="25" height="40" rx="12" fill="#ffdbac" 
           animate={isTalking ? { rotate: [15, 60, 15] } : { rotate: 15 }} 
           style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.4 }} />
        <motion.rect x="125" y="165" width="25" height="40" rx="12" fill="#ffdbac" 
           animate={isTalking ? { rotate: [-15, -60, -15] } : { rotate: -15 }} 
           style={{ transformOrigin: 'top center' }} transition={{ repeat: Infinity, duration: 0.4 }} />
           
        <path d="M60 160C60 160 80 150 100 150C120 150 140 160 140 160V210H60V160Z" fill="url(#shirtGrad)" />

        {/* Head/Hair */}
        <path d="M55 110C55 70 80 55 100 55C120 55 145 70 145 110" stroke="#4a3424" strokeWidth="25" strokeLinecap="round"/>
        <circle cx="100" cy="110" r="48" fill="url(#faceGrad)" />
        
        {/* Hat/Cap */}
        <path d="M55 95C55 95 75 75 100 75C125 75 145 95 145 95" fill="#ef4444" />
        <path d="M52 95C52 95 80 85 100 85C120 85 148 95 148 95L155 100H45L52 95Z" fill="#b91c1c" />

        {/* Eyes (Blinking) */}
        <motion.g animate={{ scaleY: [1, 1, 1, 0.1, 1] }} transition={{ repeat: Infinity, duration: 3.5 }}>
          <circle cx="82" cy="110" r="6" fill="#4a3424" />
          <circle cx="118" cy="110" r="6" fill="#4a3424" />
        </motion.g>

        {/* Mouth (Talk Animation) */}
        <motion.path
          stroke="#4a3424" strokeWidth="4" strokeLinecap="round" fill={isTalking ? "#4a3424" : "none"}
          animate={isTalking ? { d: ["M85 135 Q100 150 115 135 Q100 145 85 135", "M88 138 Q100 145 112 138 Q100 142 88 138", "M85 135 Q100 150 115 135 Q100 145 85 135"] } : { d: "M85 135 Q100 145 115 135" }}
          transition={{ repeat: Infinity, duration: 0.4 }}
        />
      </svg>
    </motion.div>
  );
}