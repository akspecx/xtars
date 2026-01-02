// // // // // // // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // // import {
// // // // // // //   RefreshCcw,
// // // // // // //   CheckCircle2,
// // // // // // //   ChevronRight,
// // // // // // //   Trophy,
// // // // // // //   Sparkles,
// // // // // // //   Volume2,
// // // // // // //   VolumeX,
// // // // // // //   Timer,
// // // // // // //   Info,
// // // // // // //   X,
// // // // // // //   Target,
// // // // // // //   ClipboardList,
// // // // // // //   Droplets,
// // // // // // //   HelpCircle,
// // // // // // //   Flower,
// // // // // // //   ArrowRight,
// // // // // // //   Waves,
// // // // // // //   ArrowRightCircle,
// // // // // // //   User as UserIcon,
// // // // // // //   Play,
// // // // // // //   Activity,
// // // // // // //   AlertTriangle,
// // // // // // //   MapPin
// // // // // // // } from 'lucide-react';

// // // // // // // // Custom Temple Icon for a more authentic look
// // // // // // // const TempleIcon = ({ size = 24, className = "" }) => (
// // // // // // //   <svg 
// // // // // // //     width={size} 
// // // // // // //     height={size} 
// // // // // // //     viewBox="0 0 24 24" 
// // // // // // //     fill="none" 
// // // // // // //     stroke="currentColor" 
// // // // // // //     strokeWidth="2" 
// // // // // // //     strokeLinecap="round" 
// // // // // // //     strokeLinejoin="round" 
// // // // // // //     className={className}
// // // // // // //   >
// // // // // // //     <path d="M12 2l3 5h-6l3-5z" />
// // // // // // //     <path d="M5 21v-7l7-4 7 4v7" />
// // // // // // //     <path d="M3 21h18" />
// // // // // // //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// // // // // // //   </svg>
// // // // // // // );

// // // // // // // const PUZZLE_LEVELS = [
// // // // // // //   {
// // // // // // //     id: 'lvl_3',
// // // // // // //     title: 'Sacred Offering I',
// // // // // // //     subtitle: '3 Stage Sequence',
// // // // // // //     stages: 3,
// // // // // // //     solutionHint: "Start 7, Offer 8",
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 'lvl_4',
// // // // // // //     title: 'Sacred Offering II',
// // // // // // //     subtitle: '4 Stage Sequence',
// // // // // // //     stages: 4,
// // // // // // //     solutionHint: "Start 15, Offer 16",
// // // // // // //   },
// // // // // // //   {
// // // // // // //     id: 'lvl_5',
// // // // // // //     title: 'Sacred Offering III',
// // // // // // //     subtitle: '5 Stage Sequence',
// // // // // // //     stages: 5,
// // // // // // //     solutionHint: "Start 31, Offer 32",
// // // // // // //   }
// // // // // // // ];

// // // // // // // export default function App() {
// // // // // // //   const [currentLevel, setCurrentLevel] = useState(0);
// // // // // // //   const level = PUZZLE_LEVELS[currentLevel];
  
// // // // // // //   const [initialFlowers, setInitialFlowers] = useState(0);
// // // // // // //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// // // // // // //   const [isCorrect, setIsCorrect] = useState(false);
// // // // // // //   const [isMuted, setIsMuted] = useState(false);
// // // // // // //   const [showInstructions, setShowInstructions] = useState(false);
// // // // // // //   const [isExplaining, setIsExplaining] = useState(false);
// // // // // // //   const [explanationText, setExplanationText] = useState("");
// // // // // // //   const [formulas, setFormulas] = useState([]);

// // // // // // //   // Journey & Animation State
// // // // // // //   const [activeStep, setActiveStep] = useState(-1); 
// // // // // // //   const [isProcessing, setIsProcessing] = useState(false);

// // // // // // //   const scrollContainerRef = useRef(null);
// // // // // // //   const activeNodeRef = useRef(null);
// // // // // // //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// // // // // // //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// // // // // // //   // Journey Steps Calculation
// // // // // // //   const journeySteps = useMemo(() => {
// // // // // // //     const steps = [];
// // // // // // //     let currentCount = initialFlowers;
// // // // // // //     for (let i = 1; i <= level.stages; i++) {
// // // // // // //       const riverCount = currentCount * 2;
// // // // // // //       const templeCount = riverCount - offeredAmount;
// // // // // // //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// // // // // // //       currentCount = Math.max(0, templeCount);
// // // // // // //     }
// // // // // // //     return steps;
// // // // // // //   }, [initialFlowers, offeredAmount, level.stages]);

// // // // // // //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// // // // // // //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// // // // // // //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// // // // // // //   // Real-time calculation for display
// // // // // // //   const currentDisplayCount = useMemo(() => {
// // // // // // //     if (activeStep === -1) return initialFlowers;
// // // // // // //     const stageIdx = Math.floor(activeStep / 2);
// // // // // // //     const isAtTemple = activeStep % 2 !== 0;
// // // // // // //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// // // // // // //   }, [activeStep, initialFlowers, journeySteps]);

// // // // // // //   // Auto-scroll logic: Fixed initial view, then tracking
// // // // // // //   useEffect(() => {
// // // // // // //     if (scrollContainerRef.current) {
// // // // // // //       if (activeStep <= 1) {
// // // // // // //         // Anchored to the left at the start to ensure Station 1 is visible
// // // // // // //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // // // //       } else if (activeNodeRef.current) {
// // // // // // //         activeNodeRef.current.scrollIntoView({
// // // // // // //           behavior: 'smooth',
// // // // // // //           block: 'nearest',
// // // // // // //           inline: 'center'
// // // // // // //         });
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, [activeStep]);

// // // // // // //   const speak = useCallback((text) => {
// // // // // // //     if (isMuted) return Promise.resolve();
// // // // // // //     return new Promise((resolve) => {
// // // // // // //       window.speechSynthesis.cancel();
// // // // // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // // // // //       utterance.rate = 1.0;
// // // // // // //       const timeout = setTimeout(resolve, 3000);
// // // // // // //       utterance.onend = () => { clearTimeout(timeout); resolve(); };
// // // // // // //       utterance.onerror = () => { clearTimeout(timeout); resolve(); };
// // // // // // //       window.speechSynthesis.speak(utterance);
// // // // // // //     });
// // // // // // //   }, [isMuted]);

// // // // // // //   const startJourney = useCallback(async () => {
// // // // // // //     if (!isInputReady || isProcessing) return;
    
// // // // // // //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// // // // // // //     setIsProcessing(true);
// // // // // // //     setIsCorrect(false);
    
// // // // // // //     for (let i = -1; i < level.stages * 2; i++) {
// // // // // // //       setActiveStep(i);
// // // // // // //       if (i >= 1 && i % 2 !== 0) {
// // // // // // //         const stageIdx = Math.floor(i / 2);
// // // // // // //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// // // // // // //           await speak("Bouquet exhausted early.");
// // // // // // //           break;
// // // // // // //         }
// // // // // // //       }
// // // // // // //       await new Promise(r => setTimeout(r, 1000));
// // // // // // //     }
    
// // // // // // //     if (isLevelSolved) {
// // // // // // //       setIsCorrect(true);
// // // // // // //       await speak("Neural equilibrium achieved!");
// // // // // // //     }
// // // // // // //     setIsProcessing(false);
// // // // // // //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// // // // // // //   // AUTO-START TRIGGER
// // // // // // //   useEffect(() => {
// // // // // // //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// // // // // // //                        lastSimulatedInputs.current.offering !== offeredAmount;

// // // // // // //     if (isInputReady && isNewInput && !isProcessing) {
// // // // // // //       const timer = setTimeout(() => {
// // // // // // //         startJourney();
// // // // // // //       }, 1000); 
// // // // // // //       return () => clearTimeout(timer);
// // // // // // //     }
// // // // // // //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// // // // // // //   const resetPuzzle = useCallback(() => {
// // // // // // //     setInitialFlowers(0);
// // // // // // //     setOfferedAmount(0);
// // // // // // //     setIsCorrect(false);
// // // // // // //     setActiveStep(-1);
// // // // // // //     setIsProcessing(false);
// // // // // // //     setFormulas([]);
// // // // // // //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// // // // // // //     if (scrollContainerRef.current) {
// // // // // // //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // // // //     }
// // // // // // //   }, []);

// // // // // // //   const goToNextLevel = useCallback(() => {
// // // // // // //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// // // // // // //     resetPuzzle();
// // // // // // //   }, [resetPuzzle]);

// // // // // // //   const runExplanation = async () => {
// // // // // // //     const lines = [`Initial Flow: ${initialFlowers}`];
// // // // // // //     journeySteps.forEach(s => {
// // // // // // //       lines.push(`Stage ${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// // // // // // //     });
// // // // // // //     setFormulas(lines);
// // // // // // //     setIsExplaining(true);
// // // // // // //     setExplanationText("Equilibrium requires zero flowers at the end of the final station.");
// // // // // // //     await speak("Calibrate starting flow and offering to end with zero.");
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// // // // // // //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// // // // // // //       {/* HEADER */}
// // // // // // //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
// // // // // // //         <div className="flex items-center gap-2">
// // // // // // //           <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white border-b-2 border-black/40">
// // // // // // //             <UserIcon size={16} className="sm:w-6 sm:h-6" />
// // // // // // //           </div>
// // // // // // //           <div>
// // // // // // //             <h1 className="text-[11px] sm:text-2xl font-black uppercase tracking-tighter text-[#3e2723] leading-none">{level.title}</h1>
// // // // // // //             <p className="text-[5px] sm:text-[9px] font-black text-[#8d6e63] uppercase tracking-widest mt-0.5">{level.subtitle}</p>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         <div className="flex items-center gap-1 sm:gap-3">
// // // // // // //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
// // // // // // //             <HelpCircle size={14} className="sm:w-5 sm:h-5" />
// // // // // // //           </button>
// // // // // // //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
// // // // // // //             {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
// // // // // // //           </button>
// // // // // // //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2.5 bg-[#3e2723] text-white rounded-lg sm:rounded-xl shadow-md border-b-2 border-black active:scale-95 transition-all">
// // // // // // //             <RefreshCcw size={14} />
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* SECTION 1: LAB STAGE */}
// // // // // // //       <div className="flex-1 w-full max-w-4xl bg-[#faf9f6]/40 rounded-[1rem] sm:rounded-[2.5rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-2 border-[#c4a484]/20 relative overflow-hidden flex flex-col items-center justify-center py-2 sm:py-4 min-h-0 my-1">
        
// // // // // // //         <div className="relative w-full flex flex-col items-center z-20 px-2 sm:px-6 gap-y-2 sm:gap-y-4 h-full justify-center">
          
// // // // // // //           {/* NEURAL MONITOR */}
// // // // // // //           <div className="w-full bg-[#faf9f6] rounded-[1rem] sm:rounded-[2rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0">
// // // // // // //             <div className="flex justify-between items-center mb-2 border-b pb-2 border-[#c4a484]/10">
// // // // // // //                <div className="flex items-center gap-2">
// // // // // // //                  <div className="p-1 bg-[#3e2723] rounded-md text-white shadow-sm"><Activity size={10} /></div>
// // // // // // //                  <span className="text-[8px] sm:text-[11px] font-black uppercase tracking-widest text-[#3e2723]">Neural monitor</span>
// // // // // // //                </div>
// // // // // // //                <div className={`text-[7px] sm:text-[10px] font-bold uppercase px-3 py-0.5 rounded-full ${hasZeroEarly && isInputReady ? 'bg-red-100 text-red-600' : 'bg-[#e6dccb]/50 text-[#8d6e63]'}`}>
// // // // // // //                   {hasZeroEarly && isInputReady ? 'Equilibrium Lost' : 'Ready'}
// // // // // // //                </div>
// // // // // // //             </div>
            
// // // // // // //             <div className="grid grid-cols-2 gap-3 sm:gap-6">
// // // // // // //               <div className="relative p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// // // // // // //                  <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5 tracking-tighter">Current Flowers</span>
// // // // // // //                  <div className="text-xl sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// // // // // // //                    <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// // // // // // //                    <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// // // // // // //                  </div>
// // // // // // //               </div>

// // // // // // //               <div className={`relative p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// // // // // // //                  <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5 tracking-tighter">Final Balance</span>
// // // // // // //                  <div className={`text-xl sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>

// // // // // // //           {/* AUTO-TRACKING JOURNEY PATH: Optimized for Station 1 visibility */}
// // // // // // //           <div className="w-full bg-[#3e2723] p-1.5 rounded-[1.2rem] sm:rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.2)] border-b-4 border-black shrink-0">
// // // // // // //             <div 
// // // // // // //               ref={scrollContainerRef}
// // // // // // //               className="bg-[#4e342e] p-4 sm:p-10 rounded-[1rem] sm:rounded-2xl border-2 border-dashed border-[#8d6e63]/20 flex flex-col items-center overflow-x-auto no-scrollbar relative min-h-[160px] sm:min-h-[280px] justify-start"
// // // // // // //             >
// // // // // // //               <div className="flex items-center justify-start min-w-max w-full gap-2 sm:gap-12 text-white relative mt-12 sm:mt-24 pb-4 px-4 sm:px-12">
                
// // // // // // //                 {/* START STATION - Anchored Left */}
// // // // // // //                 <div 
// // // // // // //                   ref={activeStep <= 0 ? activeNodeRef : null}
// // // // // // //                   className="flex flex-col items-center shrink-0 relative"
// // // // // // //                 >
// // // // // // //                   <AnimatePresence>
// // // // // // //                     {activeStep === -1 && (
// // // // // // //                       <motion.div 
// // // // // // //                         layoutId="priest"
// // // // // // //                         className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center"
// // // // // // //                         initial={{ opacity: 0 }} animate={{ opacity: 1 }}
// // // // // // //                       >
// // // // // // //                         <div className="relative">
// // // // // // //                           <UserIcon size={34} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" strokeWidth={3} />
// // // // // // //                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // // //                             {currentDisplayCount}
// // // // // // //                           </motion.div>
// // // // // // //                         </div>
// // // // // // //                         <div className="text-[5px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase tracking-tighter">Gate</div>
// // // // // // //                       </motion.div>
// // // // // // //                     )}
// // // // // // //                   </AnimatePresence>
// // // // // // //                   <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all duration-500 ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-[#faf9f6]/5 border-white/10'}`}>
// // // // // // //                     {initialFlowers}
// // // // // // //                   </div>
// // // // // // //                   <span className="text-[6px] font-black text-[#c4a484] uppercase mt-1 tracking-widest opacity-40">Start</span>
// // // // // // //                 </div>

// // // // // // //                 {journeySteps.map((step, idx) => {
// // // // // // //                   const riverIdx = idx * 2;
// // // // // // //                   const templeIdx = idx * 2 + 1;
// // // // // // //                   return (
// // // // // // //                     <React.Fragment key={idx}>
// // // // // // //                       <div className="self-center mt-[-30px] opacity-20"><ArrowRight size={16} /></div>
                      
// // // // // // //                       {/* OFFERING STATION BOX */}
// // // // // // //                       <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-2 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// // // // // // //                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-3 py-0.5 rounded-full text-[6px] sm:text-[10px] font-black tracking-widest text-white uppercase shadow-lg border border-black/20">Station 0{step.stage}</div>
                        
// // // // // // //                         <div className="flex items-center gap-1 sm:gap-2">
// // // // // // //                           {/* RIVER UNIT */}
// // // // // // //                           <div 
// // // // // // //                             ref={activeStep === riverIdx ? activeNodeRef : null}
// // // // // // //                             className="flex flex-col items-center relative"
// // // // // // //                           >
// // // // // // //                             <AnimatePresence>
// // // // // // //                               {activeStep === riverIdx && (
// // // // // // //                                 <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // // // //                                   <div className="relative">
// // // // // // //                                     <UserIcon size={34} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" strokeWidth={3} />
// // // // // // //                                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // // //                                       {currentDisplayCount}
// // // // // // //                                     </motion.div>
// // // // // // //                                   </div>
// // // // // // //                                 </motion.div>
// // // // // // //                               )}
// // // // // // //                             </AnimatePresence>
// // // // // // //                             <div className={`w-11 h-11 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === riverIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// // // // // // //                                <Waves size={20} className={activeStep === riverIdx ? 'text-white' : 'text-blue-400/40'} />
// // // // // // //                                <span className="text-[7px] sm:text-[10px] font-black">×2</span>
// // // // // // //                             </div>
// // // // // // //                             <span className="text-[7px] font-black text-blue-300 mt-1">{step.atRiver}</span>
// // // // // // //                           </div>

// // // // // // //                           <div className="opacity-10 self-center"><ArrowRight size={10} /></div>

// // // // // // //                           {/* TEMPLE UNIT */}
// // // // // // //                           <div 
// // // // // // //                             ref={activeStep === templeIdx ? activeNodeRef : null}
// // // // // // //                             className="flex flex-col items-center relative"
// // // // // // //                           >
// // // // // // //                             <AnimatePresence>
// // // // // // //                               {activeStep === templeIdx && (
// // // // // // //                                 <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // // // //                                   <div className="relative">
// // // // // // //                                     <UserIcon size={34} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" strokeWidth={3} />
// // // // // // //                                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // // //                                       {currentDisplayCount}
// // // // // // //                                     </motion.div>
// // // // // // //                                   </div>
// // // // // // //                                 </motion.div>
// // // // // // //                               )}
// // // // // // //                             </AnimatePresence>
// // // // // // //                             <div className={`w-11 h-11 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === templeIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// // // // // // //                                <TempleIcon size={20} className={activeStep === templeIdx ? 'text-white' : 'text-amber-400/40'} />
// // // // // // //                                <span className="text-[7px] sm:text-[10px] font-black">-{offeredAmount}</span>
// // // // // // //                             </div>
// // // // // // //                             <span className={`text-[7px] font-black mt-1 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// // // // // // //                           </div>
// // // // // // //                         </div>
// // // // // // //                       </div>
// // // // // // //                     </React.Fragment>
// // // // // // //                   );
// // // // // // //                 })}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* SECTION 2: CALIBRATION INPUTS */}
// // // // // // //       <div className="w-full max-w-4xl flex flex-col items-center mt-1 shrink-0 px-1">
// // // // // // //         <div className="bg-[#3e2723] p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black w-full shadow-2xl relative">
// // // // // // //           <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[8px] sm:text-[11px] font-black uppercase tracking-widest border-2 border-[#3e2723] shadow-md whitespace-nowrap">Neural Input</div>
          
// // // // // // //           <div className="grid grid-cols-2 gap-4 sm:gap-8">
// // // // // // //             <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] sm:rounded-3xl border border-white/5 shadow-inner flex flex-col items-center gap-1 sm:gap-2">
// // // // // // //                 <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484] tracking-wider">Starting flow</span>
// // // // // // //                 <input
// // // // // // //                   type="number" value={initialFlowers || ''}
// // // // // // //                   onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// // // // // // //                   className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-md sm:rounded-xl py-1 sm:py-2 text-center text-lg sm:text-4xl font-black text-[#3e2723] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
// // // // // // //                   placeholder="?"
// // // // // // //                 />
// // // // // // //                 <div className="flex gap-1 w-full mt-1">
// // // // // // //                   <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-3 bg-[#e6dccb] text-[#3e2723] rounded-md sm:rounded-xl border-b-2 border-[#c4a484] font-black active:translate-y-0.5 transition-all">-</button>
// // // // // // //                   <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-3 bg-emerald-500 text-white rounded-md sm:rounded-xl border-b-2 border-emerald-800 font-black active:translate-y-0.5 transition-all">+</button>
// // // // // // //                 </div>
// // // // // // //             </div>

// // // // // // //             <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] sm:rounded-3xl border border-white/5 shadow-inner flex flex-col items-center gap-1 sm:gap-2">
// // // // // // //                 <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484] tracking-wider">Temple Offering</span>
// // // // // // //                 <input
// // // // // // //                   type="number" value={offeredAmount || ''}
// // // // // // //                   onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// // // // // // //                   className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-md sm:rounded-xl py-1 sm:py-2 text-center text-lg sm:text-4xl font-black text-[#3e2723] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
// // // // // // //                   placeholder="?"
// // // // // // //                 />
// // // // // // //                 <div className="flex gap-1 w-full mt-1">
// // // // // // //                   <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-3 bg-[#e6dccb] text-[#3e2723] rounded-md sm:rounded-xl border-b-2 border-[#c4a484] font-black active:translate-y-0.5 transition-all">-</button>
// // // // // // //                   <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-3 bg-amber-500 text-white rounded-md sm:rounded-xl border-b-2 border-amber-700 font-black active:translate-y-0.5 transition-all">+</button>
// // // // // // //                 </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* FOOTER NAVIGATION */}
// // // // // // //       <div className="w-full max-w-4xl flex flex-row gap-2 items-center mt-1 sm:mt-2 shrink-0 px-1 pb-1">
// // // // // // //         <button 
// // // // // // //           onClick={isCorrect ? goToNextLevel : startJourney} 
// // // // // // //           disabled={!isInputReady || isProcessing}
// // // // // // //           className={`flex items-center justify-between flex-1 p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] font-black active:scale-95 shadow-lg border-b-2 sm:border-b-4 transition-all ${!isInputReady ? 'bg-black/10 text-[#3e2723]/30' : isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-100' : 'bg-[#3e2723] text-[#c4a484] border-black'}`}
// // // // // // //         >
// // // // // // //           <div className="flex items-center gap-1.5">
// // // // // // //             {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <Play size={14} />}
// // // // // // //             <span className="uppercase text-[8px] sm:text-xs tracking-tighter">{isCorrect ? 'Next Level' : isProcessing ? 'Simulating...' : 'Auto-Processing...'}</span>
// // // // // // //           </div>
// // // // // // //           {isInputReady && <div className="text-[9px] sm:text-xl font-mono text-[#c4a484]">LV {currentLevel + 1}</div>}
// // // // // // //         </button>
        
// // // // // // //         <button onClick={runExplanation} className="flex items-center justify-center gap-1.5 flex-1 bg-[#8d6e63] text-[#faf9f6] p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] font-black active:scale-95 shadow-lg border-b-2 border-[#3e2723]">
// // // // // // //           <Info size={14} />
// // // // // // //           <span className="uppercase text-[8px] sm:text-xs tracking-tighter">Logic Breakdown</span>
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {/* MODALS */}
// // // // // // //       <AnimatePresence>
// // // // // // //         {showInstructions && (
// // // // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // // // // //             <div className="w-full max-w-sm bg-[#faf9f6] rounded-[1.5rem] p-4 sm:p-6 border-4 border-[#3e2723] text-[#3e2723] relative shadow-2xl">
// // // // // // //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4"><X size={18} /></button>
// // // // // // //               <h2 className="text-sm font-black uppercase mb-2">The Ritual</h2>
// // // // // // //               <p className="text-[10px] leading-relaxed mb-4 font-bold opacity-80 uppercase">Navigate {level.stages} stations. Rivers double (×2) bouquet size. Temples take a fixed offering. End with zero flowers only at the final station.</p>
// // // // // // //               <button onClick={() => setShowInstructions(false)} className="w-full py-2 bg-[#3e2723] text-white font-black rounded-lg text-[10px] uppercase shadow-lg border-b-2 border-black active:translate-y-0.5 transition-all">Accept Ritual</button>
// // // // // // //             </div>
// // // // // // //           </motion.div>
// // // // // // //         )}
// // // // // // //       </AnimatePresence>

// // // // // // //       <AnimatePresence>
// // // // // // //         {isExplaining && (
// // // // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // // // // //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar shadow-2xl">
// // // // // // //               <div className="flex justify-between items-center mb-2 border-b border-[#3e2723]/10 pb-1">
// // // // // // //                 <h2 className="text-xs font-black uppercase">Computation Feed</h2>
// // // // // // //                 <button onClick={() => setIsExplaining(false)}><X size={16} /></button>
// // // // // // //               </div>
// // // // // // //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 shadow-inner">
// // // // // // //                 {formulas.map((line, idx) => (
// // // // // // //                   <p key={idx} className="text-[10px] font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //               <p className="text-[10px] font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// // // // // // //             </div>
// // // // // // //           </motion.div>
// // // // // // //         )}
// // // // // // //       </AnimatePresence>

// // // // // // //       <style>{`
// // // // // // //        .no-scrollbar::-webkit-scrollbar { display: none; }
// // // // // // //        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// // // // // // //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// // // // // // //        input[type=number] { -moz-appearance: textfield; }
// // // // // // //       `}</style>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }


// // // // // // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // import {
// // // // // //   RefreshCcw,
// // // // // //   CheckCircle2,
// // // // // //   ChevronRight,
// // // // // //   Trophy,
// // // // // //   Sparkles,
// // // // // //   Volume2,
// // // // // //   VolumeX,
// // // // // //   Timer,
// // // // // //   Info,
// // // // // //   X,
// // // // // //   Target,
// // // // // //   ClipboardList,
// // // // // //   Droplets,
// // // // // //   HelpCircle,
// // // // // //   Flower,
// // // // // //   ArrowRight,
// // // // // //   Waves,
// // // // // //   ArrowRightCircle,
// // // // // //   User as UserIcon,
// // // // // //   Play,
// // // // // //   Activity,
// // // // // //   AlertTriangle,
// // // // // //   MapPin
// // // // // // } from 'lucide-react';

// // // // // // // Custom Temple Icon for a more authentic look
// // // // // // const TempleIcon = ({ size = 24, className = "" }) => (
// // // // // //   <svg 
// // // // // //     width={size} 
// // // // // //     height={size} 
// // // // // //     viewBox="0 0 24 24" 
// // // // // //     fill="none" 
// // // // // //     stroke="currentColor" 
// // // // // //     strokeWidth="2" 
// // // // // //     strokeLinecap="round" 
// // // // // //     strokeLinejoin="round" 
// // // // // //     className={className}
// // // // // //   >
// // // // // //     <path d="M12 2l3 5h-6l3-5z" />
// // // // // //     <path d="M5 21v-7l7-4 7 4v7" />
// // // // // //     <path d="M3 21h18" />
// // // // // //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// // // // // //   </svg>
// // // // // // );

// // // // // // const PUZZLE_LEVELS = [
// // // // // //   {
// // // // // //     id: 'lvl_3',
// // // // // //     title: 'Sacred Offering I',
// // // // // //     subtitle: '3 Stage Sequence',
// // // // // //     stages: 3,
// // // // // //     solutionHint: "Start 7, Offer 8",
// // // // // //   },
// // // // // //   {
// // // // // //     id: 'lvl_4',
// // // // // //     title: 'Sacred Offering II',
// // // // // //     subtitle: '4 Stage Sequence',
// // // // // //     stages: 4,
// // // // // //     solutionHint: "Start 15, Offer 16",
// // // // // //   },
// // // // // //   {
// // // // // //     id: 'lvl_5',
// // // // // //     title: 'Sacred Offering III',
// // // // // //     subtitle: '5 Stage Sequence',
// // // // // //     stages: 5,
// // // // // //     solutionHint: "Start 31, Offer 32",
// // // // // //   }
// // // // // // ];

// // // // // // export default function App() {
// // // // // //   const [currentLevel, setCurrentLevel] = useState(0);
// // // // // //   const level = PUZZLE_LEVELS[currentLevel];
  
// // // // // //   const [initialFlowers, setInitialFlowers] = useState(0);
// // // // // //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// // // // // //   const [isCorrect, setIsCorrect] = useState(false);
// // // // // //   const [isMuted, setIsMuted] = useState(false);
// // // // // //   const [showInstructions, setShowInstructions] = useState(false);
// // // // // //   const [isExplaining, setIsExplaining] = useState(false);
// // // // // //   const [explanationText, setExplanationText] = useState("");
// // // // // //   const [formulas, setFormulas] = useState([]);

// // // // // //   // Journey & Animation State
// // // // // //   const [activeStep, setActiveStep] = useState(-1); 
// // // // // //   const [isProcessing, setIsProcessing] = useState(false);

// // // // // //   const scrollContainerRef = useRef(null);
// // // // // //   const activeNodeRef = useRef(null);
// // // // // //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// // // // // //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// // // // // //   // Journey Steps Calculation
// // // // // //   const journeySteps = useMemo(() => {
// // // // // //     const steps = [];
// // // // // //     let currentCount = initialFlowers;
// // // // // //     for (let i = 1; i <= level.stages; i++) {
// // // // // //       const riverCount = currentCount * 2;
// // // // // //       const templeCount = riverCount - offeredAmount;
// // // // // //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// // // // // //       currentCount = Math.max(0, templeCount);
// // // // // //     }
// // // // // //     return steps;
// // // // // //   }, [initialFlowers, offeredAmount, level.stages]);

// // // // // //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// // // // // //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// // // // // //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// // // // // //   // Real-time calculation for display
// // // // // //   const currentDisplayCount = useMemo(() => {
// // // // // //     if (activeStep === -1) return initialFlowers;
// // // // // //     const stageIdx = Math.floor(activeStep / 2);
// // // // // //     const isAtTemple = activeStep % 2 !== 0;
// // // // // //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// // // // // //   }, [activeStep, initialFlowers, journeySteps]);

// // // // // //   // Auto-scroll logic: Fixed initial view, then tracking
// // // // // //   useEffect(() => {
// // // // // //     if (scrollContainerRef.current) {
// // // // // //       if (activeStep <= 1) {
// // // // // //         // Anchored to the left at the start to ensure Station 1 is visible
// // // // // //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // // //       } else if (activeNodeRef.current) {
// // // // // //         activeNodeRef.current.scrollIntoView({
// // // // // //           behavior: 'smooth',
// // // // // //           block: 'nearest',
// // // // // //           inline: 'center'
// // // // // //         });
// // // // // //       }
// // // // // //     }
// // // // // //   }, [activeStep]);

// // // // // //   const speak = useCallback((text) => {
// // // // // //     if (isMuted) return Promise.resolve();
// // // // // //     return new Promise((resolve) => {
// // // // // //       window.speechSynthesis.cancel();
// // // // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // // // //       utterance.rate = 1.0;
// // // // // //       const timeout = setTimeout(resolve, 3000);
// // // // // //       utterance.onend = () => { clearTimeout(timeout); resolve(); };
// // // // // //       utterance.onerror = () => { clearTimeout(timeout); resolve(); };
// // // // // //       window.speechSynthesis.speak(utterance);
// // // // // //     });
// // // // // //   }, [isMuted]);

// // // // // //   const startJourney = useCallback(async () => {
// // // // // //     if (!isInputReady || isProcessing) return;
    
// // // // // //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// // // // // //     setIsProcessing(true);
// // // // // //     setIsCorrect(false);
    
// // // // // //     for (let i = -1; i < level.stages * 2; i++) {
// // // // // //       setActiveStep(i);
// // // // // //       if (i >= 1 && i % 2 !== 0) {
// // // // // //         const stageIdx = Math.floor(i / 2);
// // // // // //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// // // // // //           await speak("Bouquet exhausted early.");
// // // // // //           break;
// // // // // //         }
// // // // // //       }
// // // // // //       await new Promise(r => setTimeout(r, 1000));
// // // // // //     }
    
// // // // // //     if (isLevelSolved) {
// // // // // //       setIsCorrect(true);
// // // // // //       await speak("Neural equilibrium achieved!");
// // // // // //     }
// // // // // //     setIsProcessing(false);
// // // // // //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// // // // // //   // AUTO-START TRIGGER
// // // // // //   useEffect(() => {
// // // // // //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// // // // // //                        lastSimulatedInputs.current.offering !== offeredAmount;

// // // // // //     if (isInputReady && isNewInput && !isProcessing) {
// // // // // //       const timer = setTimeout(() => {
// // // // // //         startJourney();
// // // // // //       }, 1000); 
// // // // // //       return () => clearTimeout(timer);
// // // // // //     }
// // // // // //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// // // // // //   const resetPuzzle = useCallback(() => {
// // // // // //     setInitialFlowers(0);
// // // // // //     setOfferedAmount(0);
// // // // // //     setIsCorrect(false);
// // // // // //     setActiveStep(-1);
// // // // // //     setIsProcessing(false);
// // // // // //     setFormulas([]);
// // // // // //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// // // // // //     if (scrollContainerRef.current) {
// // // // // //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // // //     }
// // // // // //   }, []);

// // // // // //   const goToNextLevel = useCallback(() => {
// // // // // //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// // // // // //     resetPuzzle();
// // // // // //   }, [resetPuzzle]);

// // // // // //   const runExplanation = async () => {
// // // // // //     const lines = [`Initial Flow: ${initialFlowers}`];
// // // // // //     journeySteps.forEach(s => {
// // // // // //       lines.push(`Stage ${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// // // // // //     });
// // // // // //     setFormulas(lines);
// // // // // //     setIsExplaining(true);
// // // // // //     setExplanationText("Equilibrium requires zero flowers at the end of the final station.");
// // // // // //     await speak("Calibrate starting flow and offering to end with zero.");
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// // // // // //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// // // // // //       {/* HEADER */}
// // // // // //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
// // // // // //         <div className="flex items-center gap-2">
// // // // // //           <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white border-b-2 border-black/40">
// // // // // //             <UserIcon size={16} className="sm:w-6 sm:h-6" />
// // // // // //           </div>
// // // // // //           <div>
// // // // // //             <h1 className="text-[11px] sm:text-2xl font-black uppercase tracking-tighter text-[#3e2723] leading-none">{level.title}</h1>
// // // // // //             <p className="text-[5px] sm:text-[9px] font-black text-[#8d6e63] uppercase tracking-widest mt-0.5">{level.subtitle}</p>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         <div className="flex items-center gap-1 sm:gap-3">
// // // // // //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
// // // // // //             <HelpCircle size={14} className="sm:w-5 sm:h-5" />
// // // // // //           </button>
// // // // // //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
// // // // // //             {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
// // // // // //           </button>
// // // // // //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2.5 bg-[#3e2723] text-white rounded-lg sm:rounded-xl shadow-md border-b-2 border-black active:scale-95 transition-all">
// // // // // //             <RefreshCcw size={14} />
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* SECTION 1: LAB STAGE */}
// // // // // //       <div className="flex-1 w-full max-w-4xl bg-[#faf9f6]/40 rounded-[1rem] sm:rounded-[2.5rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-2 border-[#c4a484]/20 relative overflow-hidden flex flex-col items-center justify-center py-2 sm:py-4 min-h-0 my-1">
        
// // // // // //         <div className="relative w-full flex flex-col items-center z-20 px-2 sm:px-6 gap-y-2 sm:gap-y-4 h-full justify-center">
          
// // // // // //           {/* NEURAL MONITOR */}
// // // // // //           <div className="w-full bg-[#faf9f6] rounded-[1rem] sm:rounded-[2rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0">
// // // // // //             <div className="flex justify-between items-center mb-2 border-b pb-2 border-[#c4a484]/10">
// // // // // //                <div className="flex items-center gap-2">
// // // // // //                  <div className="p-1 bg-[#3e2723] rounded-md text-white shadow-sm"><Activity size={10} /></div>
// // // // // //                  <span className="text-[8px] sm:text-[11px] font-black uppercase tracking-widest text-[#3e2723]">Neural monitor</span>
// // // // // //                </div>
// // // // // //                <div className={`text-[7px] sm:text-[10px] font-bold uppercase px-3 py-0.5 rounded-full ${hasZeroEarly && isInputReady ? 'bg-red-100 text-red-600' : 'bg-[#e6dccb]/50 text-[#8d6e63]'}`}>
// // // // // //                   {hasZeroEarly && isInputReady ? 'Equilibrium Lost' : 'Ready'}
// // // // // //                </div>
// // // // // //             </div>
            
// // // // // //             <div className="grid grid-cols-2 gap-3 sm:gap-6">
// // // // // //               <div className="relative p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// // // // // //                  <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5 tracking-tighter">Current Flowers</span>
// // // // // //                  <div className="text-xl sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// // // // // //                    <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// // // // // //                    <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// // // // // //                  </div>
// // // // // //               </div>

// // // // // //               <div className={`relative p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// // // // // //                  <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5 tracking-tighter">Final Balance</span>
// // // // // //                  <div className={`text-xl sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* AUTO-TRACKING JOURNEY PATH: Manual Scroll Enabled */}
// // // // // //           <div className="w-full bg-[#3e2723] p-1.5 rounded-[1.2rem] sm:rounded-3xl shadow-[0_12px_30px_rgba(0,0,0,0.2)] border-b-4 border-black shrink-0">
// // // // // //             <div 
// // // // // //               ref={scrollContainerRef}
// // // // // //               className="bg-[#4e342e] p-4 sm:p-10 rounded-[1rem] sm:rounded-2xl border-2 border-dashed border-[#8d6e63]/20 flex flex-col items-center overflow-x-auto custom-scrollbar relative min-h-[160px] sm:min-h-[280px] justify-start"
// // // // // //             >
// // // // // //               <div className="flex items-center justify-start min-w-max w-full gap-2 sm:gap-12 text-white relative mt-12 sm:mt-24 pb-4 px-4 sm:px-12">
                
// // // // // //                 {/* START STATION - Anchored Left */}
// // // // // //                 <div 
// // // // // //                   ref={activeStep <= 0 ? activeNodeRef : null}
// // // // // //                   className="flex flex-col items-center shrink-0 relative"
// // // // // //                 >
// // // // // //                   <AnimatePresence>
// // // // // //                     {activeStep === -1 && (
// // // // // //                       <motion.div 
// // // // // //                         layoutId="priest"
// // // // // //                         className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center"
// // // // // //                         initial={{ opacity: 0 }} animate={{ opacity: 1 }}
// // // // // //                       >
// // // // // //                         <div className="relative">
// // // // // //                           <UserIcon size={34} className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" strokeWidth={3} />
// // // // // //                           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // //                             {currentDisplayCount}
// // // // // //                           </motion.div>
// // // // // //                         </div>
// // // // // //                         <div className="text-[5px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase tracking-tighter">Gate</div>
// // // // // //                       </motion.div>
// // // // // //                     )}
// // // // // //                   </AnimatePresence>
// // // // // //                   <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all duration-500 ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-[#faf9f6]/5 border-white/10'}`}>
// // // // // //                     {initialFlowers}
// // // // // //                   </div>
// // // // // //                   <span className="text-[6px] font-black text-[#c4a484] uppercase mt-1 tracking-widest opacity-40">Start</span>
// // // // // //                 </div>

// // // // // //                 {journeySteps.map((step, idx) => {
// // // // // //                   const riverIdx = idx * 2;
// // // // // //                   const templeIdx = idx * 2 + 1;
// // // // // //                   return (
// // // // // //                     <React.Fragment key={idx}>
// // // // // //                       <div className="self-center mt-[-30px] opacity-20"><ArrowRight size={16} /></div>
                      
// // // // // //                       {/* OFFERING STATION BOX */}
// // // // // //                       <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-2 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// // // // // //                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-3 py-0.5 rounded-full text-[6px] sm:text-[10px] font-black tracking-widest text-white uppercase shadow-lg border border-black/20">Station 0{step.stage}</div>
                        
// // // // // //                         <div className="flex items-center gap-1 sm:gap-2">
// // // // // //                           {/* RIVER UNIT */}
// // // // // //                           <div 
// // // // // //                             ref={activeStep === riverIdx ? activeNodeRef : null}
// // // // // //                             className="flex flex-col items-center relative"
// // // // // //                           >
// // // // // //                             <AnimatePresence>
// // // // // //                               {activeStep === riverIdx && (
// // // // // //                                 <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // // //                                   <div className="relative">
// // // // // //                                     <UserIcon size={34} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.6)]" strokeWidth={3} />
// // // // // //                                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // //                                       {currentDisplayCount}
// // // // // //                                     </motion.div>
// // // // // //                                   </div>
// // // // // //                                 </motion.div>
// // // // // //                               )}
// // // // // //                             </AnimatePresence>
// // // // // //                             <div className={`w-11 h-11 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === riverIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// // // // // //                                <Waves size={20} className={activeStep === riverIdx ? 'text-white' : 'text-blue-400/40'} />
// // // // // //                                <span className="text-[7px] sm:text-[10px] font-black">×2</span>
// // // // // //                             </div>
// // // // // //                             <span className="text-[7px] font-black text-blue-300 mt-1">{step.atRiver}</span>
// // // // // //                           </div>

// // // // // //                           <div className="opacity-10 self-center"><ArrowRight size={10} /></div>

// // // // // //                           {/* TEMPLE UNIT */}
// // // // // //                           <div 
// // // // // //                             ref={activeStep === templeIdx ? activeNodeRef : null}
// // // // // //                             className="flex flex-col items-center relative"
// // // // // //                           >
// // // // // //                             <AnimatePresence>
// // // // // //                               {activeStep === templeIdx && (
// // // // // //                                 <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // // //                                   <div className="relative">
// // // // // //                                     <UserIcon size={34} className="text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" strokeWidth={3} />
// // // // // //                                     <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">
// // // // // //                                       {currentDisplayCount}
// // // // // //                                     </motion.div>
// // // // // //                                   </div>
// // // // // //                                 </motion.div>
// // // // // //                               )}
// // // // // //                             </AnimatePresence>
// // // // // //                             <div className={`w-11 h-11 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === templeIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// // // // // //                                <TempleIcon size={20} className={activeStep === templeIdx ? 'text-white' : 'text-amber-400/40'} />
// // // // // //                                <span className="text-[7px] sm:text-[10px] font-black">-{offeredAmount}</span>
// // // // // //                             </div>
// // // // // //                             <span className={`text-[7px] font-black mt-1 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// // // // // //                           </div>
// // // // // //                         </div>
// // // // // //                       </div>
// // // // // //                     </React.Fragment>
// // // // // //                   );
// // // // // //                 })}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* SECTION 2: CALIBRATION INPUTS */}
// // // // // //       <div className="w-full max-w-4xl flex flex-col items-center mt-1 shrink-0 px-1">
// // // // // //         <div className="bg-[#3e2723] p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black w-full shadow-2xl relative">
// // // // // //           <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[8px] sm:text-[11px] font-black uppercase tracking-widest border-2 border-[#3e2723] shadow-md whitespace-nowrap">Neural Input</div>
          
// // // // // //           <div className="grid grid-cols-2 gap-4 sm:gap-8">
// // // // // //             <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] sm:rounded-3xl border border-white/5 shadow-inner flex flex-col items-center gap-1 sm:gap-2">
// // // // // //                 <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484] tracking-wider">Starting flow</span>
// // // // // //                 <input
// // // // // //                   type="number" value={initialFlowers || ''}
// // // // // //                   onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// // // // // //                   className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-md sm:rounded-xl py-1 sm:py-2 text-center text-lg sm:text-4xl font-black text-[#3e2723] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
// // // // // //                   placeholder="?"
// // // // // //                 />
// // // // // //                 <div className="flex gap-1 w-full mt-1">
// // // // // //                   <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-3 bg-[#e6dccb] text-[#3e2723] rounded-md sm:rounded-xl border-b-2 border-[#c4a484] font-black active:translate-y-0.5 transition-all">-</button>
// // // // // //                   <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-3 bg-emerald-500 text-white rounded-md sm:rounded-xl border-b-2 border-emerald-800 font-black active:translate-y-0.5 transition-all">+</button>
// // // // // //                 </div>
// // // // // //             </div>

// // // // // //             <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] sm:rounded-3xl border border-white/5 shadow-inner flex flex-col items-center gap-1 sm:gap-2">
// // // // // //                 <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484] tracking-wider">Temple Offering</span>
// // // // // //                 <input
// // // // // //                   type="number" value={offeredAmount || ''}
// // // // // //                   onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// // // // // //                   className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-md sm:rounded-xl py-1 sm:py-2 text-center text-lg sm:text-4xl font-black text-[#3e2723] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
// // // // // //                   placeholder="?"
// // // // // //                 />
// // // // // //                 <div className="flex gap-1 w-full mt-1">
// // // // // //                   <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-3 bg-[#e6dccb] text-[#3e2723] rounded-md sm:rounded-xl border-b-2 border-[#c4a484] font-black active:translate-y-0.5">-</button>
// // // // // //                   <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-3 bg-amber-500 text-white rounded-md sm:rounded-xl border-b-2 border-amber-700 font-black active:translate-y-0.5">+</button>
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>

// // // // // //       {/* FOOTER NAVIGATION */}
// // // // // //       <div className="w-full max-w-4xl flex flex-row gap-2 items-center mt-1 sm:mt-2 shrink-0 px-1 pb-1">
// // // // // //         <button 
// // // // // //           onClick={isCorrect ? goToNextLevel : startJourney} 
// // // // // //           disabled={!isInputReady || isProcessing}
// // // // // //           className={`flex items-center justify-between flex-1 p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] font-black active:scale-95 shadow-lg border-b-2 sm:border-b-4 transition-all ${!isInputReady ? 'bg-black/10 text-[#3e2723]/30' : isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-100' : 'bg-[#3e2723] text-[#c4a484] border-black'}`}
// // // // // //         >
// // // // // //           <div className="flex items-center gap-1.5">
// // // // // //             {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <Play size={14} />}
// // // // // //             <span className="uppercase text-[8px] sm:text-xs tracking-tighter">{isCorrect ? 'Next Level' : isProcessing ? 'Simulating...' : 'Auto-Processing...'}</span>
// // // // // //           </div>
// // // // // //           {isInputReady && <div className="text-[9px] sm:text-xl font-mono text-[#c4a484]">LV {currentLevel + 1}</div>}
// // // // // //         </button>
        
// // // // // //         <button onClick={runExplanation} className="flex items-center justify-center gap-1.5 flex-1 bg-[#8d6e63] text-[#faf9f6] p-2 sm:p-4 rounded-[0.8rem] sm:rounded-[1.5rem] font-black active:scale-95 shadow-lg border-b-2 border-[#3e2723]">
// // // // // //           <Info size={14} />
// // // // // //           <span className="uppercase text-[8px] sm:text-xs tracking-tighter">Logic Breakdown</span>
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {/* MODALS */}
// // // // // //       <AnimatePresence>
// // // // // //         {showInstructions && (
// // // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // // // //             <div className="w-full max-w-sm bg-[#faf9f6] rounded-[1.5rem] p-4 sm:p-6 border-4 border-[#3e2723] text-[#3e2723] relative shadow-2xl">
// // // // // //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4"><X size={18} /></button>
// // // // // //               <h2 className="text-sm font-black uppercase mb-2">The Ritual</h2>
// // // // // //               <p className="text-[10px] leading-relaxed mb-4 font-bold opacity-80 uppercase">Navigate {level.stages} stations. Rivers double (×2) bouquet size. Temples take a fixed offering. End with zero flowers only at the final station.</p>
// // // // // //               <button onClick={() => setShowInstructions(false)} className="w-full py-2 bg-[#3e2723] text-white font-black rounded-lg text-[10px] uppercase shadow-lg border-b-2 border-black active:translate-y-0.5 transition-all">Accept Ritual</button>
// // // // // //             </div>
// // // // // //           </motion.div>
// // // // // //         )}
// // // // // //       </AnimatePresence>

// // // // // //       <AnimatePresence>
// // // // // //         {isExplaining && (
// // // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // // // //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar shadow-2xl">
// // // // // //               <div className="flex justify-between items-center mb-2 border-b border-[#3e2723]/10 pb-1">
// // // // // //                 <h2 className="text-xs font-black uppercase">Computation Feed</h2>
// // // // // //                 <button onClick={() => setIsExplaining(false)}><X size={16} /></button>
// // // // // //               </div>
// // // // // //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 shadow-inner">
// // // // // //                 {formulas.map((line, idx) => (
// // // // // //                   <p key={idx} className="text-[10px] font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //               <p className="text-[10px] font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// // // // // //             </div>
// // // // // //           </motion.div>
// // // // // //         )}
// // // // // //       </AnimatePresence>

// // // // // //       <style>{`
// // // // // //        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
// // // // // //        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); }
// // // // // //        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 4px; }
// // // // // //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// // // // // //        input[type=number] { -moz-appearance: textfield; }
// // // // // //       `}</style>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // import {
// // // // //   RefreshCcw,
// // // // //   CheckCircle2,
// // // // //   ChevronRight,
// // // // //   Trophy,
// // // // //   Sparkles,
// // // // //   Volume2,
// // // // //   VolumeX,
// // // // //   Timer,
// // // // //   Info,
// // // // //   X,
// // // // //   Target,
// // // // //   ClipboardList,
// // // // //   Droplets,
// // // // //   HelpCircle,
// // // // //   Flower,
// // // // //   ArrowRight,
// // // // //   Waves,
// // // // //   ArrowRightCircle,
// // // // //   User as UserIcon,
// // // // //   Church,
// // // // //   Play,
// // // // //   Activity,
// // // // //   AlertTriangle
// // // // // } from 'lucide-react';

// // // // // // Custom Temple SVG for traditional gopuram architecture
// // // // // const TempleIcon = ({ size = 20, className = "" }) => (
// // // // //   <svg 
// // // // //     width={size} 
// // // // //     height={size} 
// // // // //     viewBox="0 0 24 24" 
// // // // //     fill="none" 
// // // // //     stroke="currentColor" 
// // // // //     strokeWidth="2" 
// // // // //     strokeLinecap="round" 
// // // // //     strokeLinejoin="round" 
// // // // //     className={className}
// // // // //   >
// // // // //     <path d="M12 2l3 5h-6l3-5z" />
// // // // //     <path d="M5 21v-7l7-4 7 4v7" />
// // // // //     <path d="M3 21h18" />
// // // // //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// // // // //   </svg>
// // // // // );

// // // // // const PUZZLE_LEVELS = [
// // // // //   { id: 'lvl_3', title: 'Sacred Offering I', stages: 3, solutionHint: "Start 7, Offer 8" },
// // // // //   { id: 'lvl_4', title: 'Sacred Offering II', stages: 4, solutionHint: "Start 15, Offer 16" },
// // // // //   { id: 'lvl_5', title: 'Sacred Offering III', stages: 5, solutionHint: "Start 31, Offer 32" }
// // // // // ];

// // // // // export default function App() {
// // // // //   const [currentLevel, setCurrentLevel] = useState(0);
// // // // //   const level = PUZZLE_LEVELS[currentLevel];
  
// // // // //   const [initialFlowers, setInitialFlowers] = useState(0);
// // // // //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// // // // //   const [isCorrect, setIsCorrect] = useState(false);
// // // // //   const [isMuted, setIsMuted] = useState(false);
// // // // //   const [showInstructions, setShowInstructions] = useState(false);
// // // // //   const [isExplaining, setIsExplaining] = useState(false);
// // // // //   const [explanationText, setExplanationText] = useState("");
// // // // //   const [formulas, setFormulas] = useState([]);

// // // // //   // Journey & Animation State
// // // // //   const [activeStep, setActiveStep] = useState(-1); 
// // // // //   const [isProcessing, setIsProcessing] = useState(false);

// // // // //   const scrollContainerRef = useRef(null);
// // // // //   const activeNodeRef = useRef(null);
// // // // //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// // // // //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// // // // //   // Journey Steps Calculation
// // // // //   const journeySteps = useMemo(() => {
// // // // //     const steps = [];
// // // // //     let currentCount = initialFlowers;
// // // // //     for (let i = 1; i <= level.stages; i++) {
// // // // //       const riverCount = currentCount * 2;
// // // // //       const templeCount = riverCount - offeredAmount;
// // // // //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// // // // //       currentCount = Math.max(0, templeCount);
// // // // //     }
// // // // //     return steps;
// // // // //   }, [initialFlowers, offeredAmount, level.stages]);

// // // // //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// // // // //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// // // // //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// // // // //   // Real-time calculation for display
// // // // //   const currentDisplayCount = useMemo(() => {
// // // // //     if (activeStep === -1) return initialFlowers;
// // // // //     const stageIdx = Math.floor(activeStep / 2);
// // // // //     const isAtTemple = activeStep % 2 !== 0;
// // // // //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// // // // //   }, [activeStep, initialFlowers, journeySteps]);

// // // // //   // Auto-scroll logic: Fixed initial view, then tracking
// // // // //   useEffect(() => {
// // // // //     if (scrollContainerRef.current) {
// // // // //       if (activeStep <= 1) {
// // // // //         // Anchored to the left at the start to ensure Station 1 is visible
// // // // //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // //       } else if (activeNodeRef.current) {
// // // // //         activeNodeRef.current.scrollIntoView({
// // // // //           behavior: 'smooth',
// // // // //           block: 'nearest',
// // // // //           inline: 'center'
// // // // //         });
// // // // //       }
// // // // //     }
// // // // //   }, [activeStep]);

// // // // //   const speak = useCallback((text) => {
// // // // //     if (isMuted) return;
// // // // //     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
// // // // //       window.speechSynthesis.cancel();
// // // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // // //       utterance.rate = 1.0;
// // // // //       window.speechSynthesis.speak(utterance);
// // // // //     }
// // // // //   }, [isMuted]);

// // // // //   const startJourney = useCallback(async () => {
// // // // //     if (!isInputReady || isProcessing) return;
    
// // // // //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// // // // //     setIsProcessing(true);
// // // // //     setIsCorrect(false);
    
// // // // //     for (let i = -1; i < level.stages * 2; i++) {
// // // // //       setActiveStep(i);
// // // // //       if (i >= 1 && i % 2 !== 0) {
// // // // //         const stageIdx = Math.floor(i / 2);
// // // // //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// // // // //           speak("Exhausted early.");
// // // // //           break;
// // // // //         }
// // // // //       }
// // // // //       await new Promise(r => setTimeout(r, 1000));
// // // // //     }
    
// // // // //     if (isLevelSolved) {
// // // // //       setIsCorrect(true);
// // // // //       speak("Balanced!");
// // // // //     }
// // // // //     setIsProcessing(false);
// // // // //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// // // // //   // AUTO-START TRIGGER: Once inputs are entered, simulate once.
// // // // //   useEffect(() => {
// // // // //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// // // // //                        lastSimulatedInputs.current.offering !== offeredAmount;

// // // // //     if (isInputReady && isNewInput && !isProcessing) {
// // // // //       const timer = setTimeout(() => {
// // // // //         startJourney();
// // // // //       }, 1000); 
// // // // //       return () => clearTimeout(timer);
// // // // //     }
// // // // //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// // // // //   const resetPuzzle = useCallback(() => {
// // // // //     setInitialFlowers(0);
// // // // //     setOfferedAmount(0);
// // // // //     setIsCorrect(false);
// // // // //     setActiveStep(-1);
// // // // //     setIsProcessing(false);
// // // // //     setFormulas([]);
// // // // //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// // // // //     if (scrollContainerRef.current) {
// // // // //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // // //     }
// // // // //   }, []);

// // // // //   const goToNextLevel = useCallback(() => {
// // // // //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// // // // //     resetPuzzle();
// // // // //   }, [resetPuzzle]);

// // // // //   const runExplanation = () => {
// // // // //     const lines = [`Initial Flow: ${initialFlowers}`];
// // // // //     journeySteps.forEach(s => {
// // // // //       lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// // // // //     });
// // // // //     setFormulas(lines);
// // // // //     setExplanationText("Goal: End with exactly zero flowers.");
// // // // //     setIsExplaining(true);
// // // // //     speak("The flowers double at the river and subtract at the temple.");
// // // // //   };

// // // // //   return (
// // // // //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// // // // //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// // // // //       {/* HEADER */}
// // // // //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
// // // // //         <div className="flex items-center gap-2">
// // // // //           <div className="w-7 h-7 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
// // // // //             <UserIcon size={16} />
// // // // //           </div>
// // // // //           <div>
// // // // //             <h1 className="text-[11px] sm:text-xl font-black uppercase text-[#3e2723] leading-none">{level.title}</h1>
// // // // //             <p className="text-[5px] sm:text-[9px] font-black text-[#8d6e63] uppercase tracking-widest leading-none mt-0.5">Sequence Ritual</p>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className="flex items-center gap-1 sm:gap-3">
// // // // //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
// // // // //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
// // // // //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2 bg-[#3e2723] text-white rounded-lg border-b-2 border-black active:scale-95"><RefreshCcw size={14} /></button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* MONITOR */}
// // // // //       <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[1rem] sm:rounded-[2.5rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0 my-1">
// // // // //         <div className="grid grid-cols-2 gap-3 sm:gap-6">
// // // // //           <div className="relative p-2 sm:p-4 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// // // // //             <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5">Current Count</span>
// // // // //             <div className="text-xl sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// // // // //               <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// // // // //               <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// // // // //             </div>
// // // // //           </div>
// // // // //           <div className={`relative p-2 sm:p-4 rounded-xl border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// // // // //             <span className="text-[6px] sm:text-[9px] font-black text-[#8d6e63] uppercase mb-0.5">End Balance</span>
// // // // //             <div className={`text-xl sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* TRACKING PATH */}
// // // // //       <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1.5 rounded-[1.2rem] sm:rounded-[3.5rem] shadow-2xl border-b-4 border-black shrink-0 overflow-hidden relative">
// // // // //         <div 
// // // // //           ref={scrollContainerRef}
// // // // //           className="h-full w-full bg-[#4e342e] rounded-[1rem] sm:rounded-[2.5rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative px-6 sm:px-12"
// // // // //         >
// // // // //           <div className="flex items-center min-w-max gap-3 sm:gap-10 pt-16 sm:pt-24 pb-4">
// // // // //             {/* START GATE */}
// // // // //             <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative">
// // // // //               <AnimatePresence>
// // // // //                 {activeStep === -1 && (
// // // // //                   <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // //                     <div className="relative">
// // // // //                       <UserIcon size={34} className="text-yellow-400 drop-shadow-[0_0_15px_gold]" strokeWidth={3} />
// // // // //                       <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // // //                     </div>
// // // // //                     <div className="text-[5px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase tracking-tighter">Start</div>
// // // // //                   </motion.div>
// // // // //                 )}
// // // // //               </AnimatePresence>
// // // // //               <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
// // // // //                 {initialFlowers}
// // // // //               </div>
// // // // //             </div>

// // // // //             {journeySteps.map((step, idx) => {
// // // // //               const rIdx = idx * 2;
// // // // //               const tIdx = idx * 2 + 1;
// // // // //               return (
// // // // //                 <React.Fragment key={idx}>
// // // // //                   <div className="self-center mt-[-30px] opacity-10"><ArrowRight size={16} /></div>
// // // // //                   <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1.5 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// // // // //                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-3 py-0.5 rounded-full text-[6px] sm:text-[9px] font-black text-white uppercase shadow-lg">Station 0{step.stage}</div>
// // // // //                     <div className="flex items-center gap-1.5 sm:gap-2">
// // // // //                       {/* RIVER */}
// // // // //                       <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // // // //                         <AnimatePresence>
// // // // //                           {activeStep === rIdx && (
// // // // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // //                               <div className="relative">
// // // // //                                 <UserIcon size={34} className="text-blue-400 drop-shadow-[0_0_15px_cyan]" strokeWidth={3} />
// // // // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // // //                               </div>
// // // // //                             </motion.div>
// // // // //                           )}
// // // // //                         </AnimatePresence>
// // // // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// // // // //                            <Waves size={20} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
// // // // //                            <span className="text-[7px] sm:text-[10px] font-black">×2</span>
// // // // //                         </div>
// // // // //                         <span className="text-[7px] font-black text-blue-300 mt-0.5">{step.atRiver}</span>
// // // // //                       </div>
// // // // //                       <div className="opacity-10 self-center"><ArrowRight size={10} /></div>
// // // // //                       {/* TEMPLE */}
// // // // //                       <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // // // //                         <AnimatePresence>
// // // // //                           {activeStep === tIdx && (
// // // // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // // //                               <div className="relative">
// // // // //                                 <UserIcon size={34} className="text-amber-400 drop-shadow-[0_0_15px_orange]" strokeWidth={3} />
// // // // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // // //                               </div>
// // // // //                             </motion.div>
// // // // //                           )}
// // // // //                         </AnimatePresence>
// // // // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// // // // //                            <TempleIcon size={20} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
// // // // //                            <span className="text-[7px] sm:text-[10px] font-black">-{offeredAmount}</span>
// // // // //                         </div>
// // // // //                         <span className={`text-[7px] font-black mt-0.5 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </React.Fragment>
// // // // //               );
// // // // //             })}
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* INPUTS */}
// // // // //       <div className="w-full max-w-4xl bg-[#3e2723] p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
// // // // //         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[8px] sm:text-[11px] font-black uppercase border-2 border-[#3e2723]">Neural Input</div>
// // // // //         <div className="grid grid-cols-2 gap-3 sm:gap-8">
// // // // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // // // //             <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484]">Start Flow</span>
// // // // //             <input 
// // // // //               type="number" value={initialFlowers || ''} 
// // // // //               onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// // // // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // // // //               placeholder="?"
// // // // //             />
// // // // //             <div className="flex gap-1 w-full">
// // // // //               <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-[12px] border-b-2 border-[#c4a484]">-</button>
// // // // //               <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-emerald-500 text-white rounded font-black text-[12px] border-b-2 border-emerald-800">+</button>
// // // // //             </div>
// // // // //           </div>
// // // // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // // // //             <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484]">Offering</span>
// // // // //             <input 
// // // // //               type="number" value={offeredAmount || ''} 
// // // // //               onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// // // // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // // // //               placeholder="?"
// // // // //             />
// // // // //             <div className="flex gap-1 w-full">
// // // // //               <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-[12px] border-b-2 border-[#c4a484]">-</button>
// // // // //               <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-amber-500 text-white rounded font-black text-[12px] border-b-2 border-amber-700">+</button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* FOOTER */}
// // // // //       <div className="w-full max-w-4xl flex gap-2 shrink-0 px-1 pb-1">
// // // // //         <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-3 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-1'}`}>
// // // // //           {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
// // // // //           <span className="text-[10px] sm:text-base uppercase">{isCorrect ? 'Next Level' : 'Re-Run Path'}</span>
// // // // //         </button>
// // // // //         <button onClick={runExplanation} className="flex-1 py-3 sm:py-5 bg-[#8d6e63] text-white rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-lg border-b-4 border-[#3e2723] active:translate-y-1">LogicInsight</button>
// // // // //       </div>

// // // // //       {/* MODALS */}
// // // // //       <AnimatePresence>
// // // // //         {showInstructions && (
// // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
// // // // //             <div className="w-full max-w-sm bg-[#faf9f6] rounded-[1.5rem] p-6 border-4 border-[#3e2723] text-[#3e2723] relative">
// // // // //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4"><X size={18} /></button>
// // // // //               <h2 className="text-lg font-black uppercase mb-2">Sacred Equilibrium</h2>
// // // // //               <p className="text-xs font-bold leading-relaxed mb-4 opacity-80 uppercase">Navigate {level.stages} stations. Rivers double (×2) flowers. Temples take offering. Target: zero at the end.</p>
// // // // //               <button onClick={() => setShowInstructions(false)} className="w-full py-3 bg-[#3e2723] text-white font-black rounded-lg uppercase border-b-4 border-black">Enter</button>
// // // // //             </div>
// // // // //           </motion.div>
// // // // //         )}
// // // // //         {isExplaining && (
// // // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // // //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
// // // // //               <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
// // // // //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-4">
// // // // //                 {formulas.map((line, idx) => (
// // // // //                   <p key={idx} className="text-[10px] font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// // // // //                 ))}
// // // // //               </div>
// // // // //               <p className="text-[10px] font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// // // // //             </div>
// // // // //           </motion.div>
// // // // //         )}
// // // // //       </AnimatePresence>

// // // // //       <style>{`
// // // // //        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
// // // // //        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
// // // // //        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
// // // // //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// // // // //        input[type=number] { -moz-appearance: textfield; }
// // // // //       `}</style>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // import {
// // // //   RefreshCcw,
// // // //   CheckCircle2,
// // // //   ChevronRight,
// // // //   Trophy,
// // // //   Sparkles,
// // // //   Volume2,
// // // //   VolumeX,
// // // //   Timer,
// // // //   Info,
// // // //   X,
// // // //   Target,
// // // //   ClipboardList,
// // // //   Droplets,
// // // //   HelpCircle,
// // // //   Flower,
// // // //   ArrowRight,
// // // //   Waves,
// // // //   ArrowRightCircle,
// // // //   User as UserIcon,
// // // //   Church,
// // // //   Play,
// // // //   Activity,
// // // //   AlertTriangle
// // // // } from 'lucide-react';

// // // // // Custom Temple SVG for traditional gopuram architecture
// // // // const TempleIcon = ({ size = 20, className = "" }) => (
// // // //   <svg 
// // // //     width={size} 
// // // //     height={size} 
// // // //     viewBox="0 0 24 24" 
// // // //     fill="none" 
// // // //     stroke="currentColor" 
// // // //     strokeWidth="2" 
// // // //     strokeLinecap="round" 
// // // //     strokeLinejoin="round" 
// // // //     className={className}
// // // //   >
// // // //     <path d="M12 2l3 5h-6l3-5z" />
// // // //     <path d="M5 21v-7l7-4 7 4v7" />
// // // //     <path d="M3 21h18" />
// // // //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// // // //   </svg>
// // // // );

// // // // const PUZZLE_LEVELS = [
// // // //   { id: 'lvl_3', title: 'Sacred Offering I', stages: 3, solutionHint: "Start 7, Offer 8" },
// // // //   { id: 'lvl_4', title: 'Sacred Offering II', stages: 4, solutionHint: "Start 15, Offer 16" },
// // // //   { id: 'lvl_5', title: 'Sacred Offering III', stages: 5, solutionHint: "Start 31, Offer 32" }
// // // // ];

// // // // export default function App() {
// // // //   const [currentLevel, setCurrentLevel] = useState(0);
// // // //   const level = PUZZLE_LEVELS[currentLevel];
  
// // // //   const [initialFlowers, setInitialFlowers] = useState(0);
// // // //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// // // //   const [isCorrect, setIsCorrect] = useState(false);
// // // //   const [isMuted, setIsMuted] = useState(false);
// // // //   const [showInstructions, setShowInstructions] = useState(false);
// // // //   const [isExplaining, setIsExplaining] = useState(false);
// // // //   const [explanationText, setExplanationText] = useState("");
// // // //   const [formulas, setFormulas] = useState([]);

// // // //   // Journey & Animation State
// // // //   const [activeStep, setActiveStep] = useState(-1); 
// // // //   const [isProcessing, setIsProcessing] = useState(false);

// // // //   const scrollContainerRef = useRef(null);
// // // //   const activeNodeRef = useRef(null);
// // // //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// // // //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// // // //   // Journey Steps Calculation
// // // //   const journeySteps = useMemo(() => {
// // // //     const steps = [];
// // // //     let currentCount = initialFlowers;
// // // //     for (let i = 1; i <= level.stages; i++) {
// // // //       const riverCount = currentCount * 2;
// // // //       const templeCount = riverCount - offeredAmount;
// // // //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// // // //       currentCount = Math.max(0, templeCount);
// // // //     }
// // // //     return steps;
// // // //   }, [initialFlowers, offeredAmount, level.stages]);

// // // //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// // // //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// // // //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// // // //   // Real-time calculation for display
// // // //   const currentDisplayCount = useMemo(() => {
// // // //     if (activeStep === -1) return initialFlowers;
// // // //     const stageIdx = Math.floor(activeStep / 2);
// // // //     const isAtTemple = activeStep % 2 !== 0;
// // // //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// // // //   }, [activeStep, initialFlowers, journeySteps]);

// // // //   // Auto-scroll logic: Fixed initial view, then tracking
// // // //   useEffect(() => {
// // // //     if (scrollContainerRef.current) {
// // // //       if (activeStep <= 1) {
// // // //         // Anchored to the left at the start to ensure Station 1 is visible
// // // //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // //       } else if (activeNodeRef.current) {
// // // //         activeNodeRef.current.scrollIntoView({
// // // //           behavior: 'smooth',
// // // //           block: 'nearest',
// // // //           inline: 'center'
// // // //         });
// // // //       }
// // // //     }
// // // //   }, [activeStep]);

// // // //   const speak = useCallback((text) => {
// // // //     if (isMuted) return;
// // // //     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
// // // //       window.speechSynthesis.cancel();
// // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // //       utterance.rate = 1.0;
// // // //       window.speechSynthesis.speak(utterance);
// // // //     }
// // // //   }, [isMuted]);

// // // //   const startJourney = useCallback(async () => {
// // // //     if (!isInputReady || isProcessing) return;
    
// // // //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// // // //     setIsProcessing(true);
// // // //     setIsCorrect(false);
    
// // // //     for (let i = -1; i < level.stages * 2; i++) {
// // // //       setActiveStep(i);
// // // //       if (i >= 1 && i % 2 !== 0) {
// // // //         const stageIdx = Math.floor(i / 2);
// // // //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// // // //           speak("Exhausted early.");
// // // //           break;
// // // //         }
// // // //       }
// // // //       await new Promise(r => setTimeout(r, 1000));
// // // //     }
    
// // // //     if (isLevelSolved) {
// // // //       setIsCorrect(true);
// // // //       speak("Balanced!");
// // // //     }
// // // //     setIsProcessing(false);
// // // //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// // // //   // AUTO-START TRIGGER: Once inputs are entered, simulate once.
// // // //   useEffect(() => {
// // // //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// // // //                        lastSimulatedInputs.current.offering !== offeredAmount;

// // // //     if (isInputReady && isNewInput && !isProcessing) {
// // // //       const timer = setTimeout(() => {
// // // //         startJourney();
// // // //       }, 1000); 
// // // //       return () => clearTimeout(timer);
// // // //     }
// // // //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// // // //   const resetPuzzle = useCallback(() => {
// // // //     setInitialFlowers(0);
// // // //     setOfferedAmount(0);
// // // //     setIsCorrect(false);
// // // //     setActiveStep(-1);
// // // //     setIsProcessing(false);
// // // //     setFormulas([]);
// // // //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// // // //     if (scrollContainerRef.current) {
// // // //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // // //     }
// // // //   }, []);

// // // //   const goToNextLevel = useCallback(() => {
// // // //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// // // //     resetPuzzle();
// // // //   }, [resetPuzzle]);

// // // //   const runExplanation = () => {
// // // //     const lines = [`Initial Flow: ${initialFlowers}`];
// // // //     journeySteps.forEach(s => {
// // // //       lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// // // //     });
// // // //     setFormulas(lines);
// // // //     setExplanationText("Goal: End with exactly zero flowers.");
// // // //     setIsExplaining(true);
// // // //     speak("The flowers double at the river and subtract at the temple.");
// // // //   };

// // // //   return (
// // // //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// // // //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// // // //       {/* HEADER */}
// // // //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
// // // //         <div className="flex items-center gap-2">
// // // //           <div className="w-7 h-7 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
// // // //             <UserIcon size={16} />
// // // //           </div>
// // // //           <div>
// // // //             <h1 className="text-[11px] sm:text-xl font-black uppercase text-[#3e2723] leading-none">{level.title}</h1>
// // // //             <p className="text-[9px] sm:text-xs font-black text-[#8d6e63] uppercase tracking-widest leading-none mt-0.5">Sequence Ritual</p>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-1 sm:gap-3">
// // // //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
// // // //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
// // // //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2 bg-[#3e2723] text-white rounded-lg border-b-2 border-black active:scale-95"><RefreshCcw size={14} /></button>
// // // //         </div>
// // // //       </div>

// // // //       {/* MONITOR */}
// // // //       <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[1rem] sm:rounded-[2.5rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0 my-1">
// // // //         <div className="grid grid-cols-2 gap-3 sm:gap-6">
// // // //           <div className="relative p-2 sm:p-4 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// // // //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">Current Count</span>
// // // //             <div className="text-xl sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// // // //               <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// // // //               <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// // // //             </div>
// // // //           </div>
// // // //           <div className={`relative p-2 sm:p-4 rounded-xl border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// // // //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">End Balance</span>
// // // //             <div className={`text-xl sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* TRACKING PATH */}
// // // //       <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1.5 rounded-[1.2rem] sm:rounded-[3.5rem] shadow-2xl border-b-4 border-black shrink-0 overflow-hidden relative">
// // // //         <div 
// // // //           ref={scrollContainerRef}
// // // //           className="h-full w-full bg-[#4e342e] rounded-[1rem] sm:rounded-[2.5rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative px-6 sm:px-12"
// // // //         >
// // // //           <div className="flex items-center min-w-max gap-3 sm:gap-10 pt-16 sm:pt-24 pb-4">
// // // //             {/* START GATE */}
// // // //             <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative">
// // // //               <AnimatePresence>
// // // //                 {activeStep === -1 && (
// // // //                   <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // //                     <div className="relative">
// // // //                       <UserIcon size={34} className="text-yellow-400 drop-shadow-[0_0_15px_gold]" strokeWidth={3} />
// // // //                       <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // //                     </div>
// // // //                     <div className="text-[10px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase tracking-tighter">Start</div>
// // // //                   </motion.div>
// // // //                 )}
// // // //               </AnimatePresence>
// // // //               <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
// // // //                 {initialFlowers}
// // // //               </div>
// // // //             </div>

// // // //             {journeySteps.map((step, idx) => {
// // // //               const rIdx = idx * 2;
// // // //               const tIdx = idx * 2 + 1;
// // // //               return (
// // // //                 <React.Fragment key={idx}>
// // // //                   <div className="self-center mt-[-30px] opacity-10"><ArrowRight size={16} /></div>
// // // //                   <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1.5 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// // // //                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-3 py-0.5 rounded-full text-[10px] font-black text-white uppercase shadow-lg">Station 0{step.stage}</div>
// // // //                     <div className="flex items-center gap-1.5 sm:gap-2">
// // // //                       {/* RIVER */}
// // // //                       <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // // //                         <AnimatePresence>
// // // //                           {activeStep === rIdx && (
// // // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // //                               <div className="relative">
// // // //                                 <UserIcon size={34} className="text-blue-400 drop-shadow-[0_0_15px_cyan]" strokeWidth={3} />
// // // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // //                               </div>
// // // //                             </motion.div>
// // // //                           )}
// // // //                         </AnimatePresence>
// // // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// // // //                            <Waves size={20} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
// // // //                            <span className="text-[8px] sm:text-[11px] font-black">×2</span>
// // // //                         </div>
// // // //                         <span className="text-[10px] font-black text-blue-300 mt-0.5">{step.atRiver}</span>
// // // //                       </div>
// // // //                       <div className="opacity-10 self-center"><ArrowRight size={10} /></div>
// // // //                       {/* TEMPLE */}
// // // //                       <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // // //                         <AnimatePresence>
// // // //                           {activeStep === tIdx && (
// // // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // // //                               <div className="relative">
// // // //                                 <UserIcon size={34} className="text-amber-400 drop-shadow-[0_0_15px_orange]" strokeWidth={3} />
// // // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // // //                               </div>
// // // //                             </motion.div>
// // // //                           )}
// // // //                         </AnimatePresence>
// // // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// // // //                            <TempleIcon size={20} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
// // // //                            <span className="text-[8px] sm:text-[11px] font-black">-{offeredAmount}</span>
// // // //                         </div>
// // // //                         <span className={`text-[10px] font-black mt-0.5 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// // // //                       </div>
// // // //                     </div>
// // // //                   </div>
// // // //                 </React.Fragment>
// // // //               );
// // // //             })}
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* INPUTS */}
// // // //       <div className="w-full max-w-4xl bg-[#3e2723] p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
// // // //         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[10px] sm:text-sm font-black uppercase border-2 border-[#3e2723]">Neural Input</div>
// // // //         <div className="grid grid-cols-2 gap-3 sm:gap-8">
// // // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // // //             <span className="text-xs sm:text-sm font-black uppercase text-[#c4a484]">Start Flow</span>
// // // //             <input 
// // // //               type="number" value={initialFlowers || ''} 
// // // //               onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// // // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // // //               placeholder="?"
// // // //             />
// // // //             <div className="flex gap-1 w-full">
// // // //               <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-sm border-b-2 border-[#c4a484]">-</button>
// // // //               <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-emerald-500 text-white rounded font-black text-sm border-b-2 border-emerald-800">+</button>
// // // //             </div>
// // // //           </div>
// // // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // // //             <span className="text-xs sm:text-sm font-black uppercase text-[#c4a484]">Offering</span>
// // // //             <input 
// // // //               type="number" value={offeredAmount || ''} 
// // // //               onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// // // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // // //               placeholder="?"
// // // //             />
// // // //             <div className="flex gap-1 w-full">
// // // //               <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-sm border-b-2 border-[#c4a484]">-</button>
// // // //               <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-amber-500 text-white rounded font-black text-sm border-b-2 border-amber-700">+</button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* FOOTER */}
// // // //       <div className="w-full max-w-4xl flex gap-2 shrink-0 px-1 pb-1">
// // // //         <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-3 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-1'}`}>
// // // //           {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
// // // //           <span className="text-[10px] sm:text-base uppercase">{isCorrect ? 'Next Level' : 'Re-Run Path'}</span>
// // // //         </button>
// // // //         <button onClick={runExplanation} className="flex-1 py-3 sm:py-5 bg-[#8d6e63] text-white rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-lg border-b-4 border-[#3e2723] active:translate-y-1">LogicInsight</button>
// // // //       </div>

// // // //       {/* MODALS */}
// // // //       <AnimatePresence>
// // // //         {showInstructions && (
// // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
// // // //             <div className="w-full max-w-sm bg-[#faf9f6] rounded-[1.5rem] p-6 border-4 border-[#3e2723] text-[#3e2723] relative">
// // // //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4"><X size={18} /></button>
// // // //               <h2 className="text-lg font-black uppercase mb-2">Sacred Equilibrium</h2>
// // // //               <p className="text-xs font-bold leading-relaxed mb-4 opacity-80 uppercase">Navigate {level.stages} stations. Rivers double (×2) flowers. Temples take offering. Target: zero at the end.</p>
// // // //               <button onClick={() => setShowInstructions(false)} className="w-full py-3 bg-[#3e2723] text-white font-black rounded-lg uppercase border-b-4 border-black">Enter</button>
// // // //             </div>
// // // //           </motion.div>
// // // //         )}
// // // //         {isExplaining && (
// // // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // // //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
// // // //               <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
// // // //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-4">
// // // //                 {formulas.map((line, idx) => (
// // // //                   <p key={idx} className="text-xs font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// // // //                 ))}
// // // //               </div>
// // // //               <p className="text-sm font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// // // //             </div>
// // // //           </motion.div>
// // // //         )}
// // // //       </AnimatePresence>

// // // //       <style>{`
// // // //        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
// // // //        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
// // // //        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
// // // //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// // // //        input[type=number] { -moz-appearance: textfield; }
// // // //       `}</style>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import {
// // //   RefreshCcw,
// // //   CheckCircle2,
// // //   ChevronRight,
// // //   Trophy,
// // //   Sparkles,
// // //   Volume2,
// // //   VolumeX,
// // //   Timer,
// // //   Info,
// // //   X,
// // //   Target,
// // //   ClipboardList,
// // //   Droplets,
// // //   HelpCircle,
// // //   Flower,
// // //   ArrowRight,
// // //   Waves,
// // //   ArrowRightCircle,
// // //   User as UserIcon,
// // //   Church,
// // //   Play,
// // //   Activity,
// // //   AlertTriangle,
// // //   MapPin
// // // } from 'lucide-react';

// // // // Custom Temple SVG for traditional gopuram architecture
// // // const TempleIcon = ({ size = 20, className = "" }) => (
// // //   <svg 
// // //     width={size} 
// // //     height={size} 
// // //     viewBox="0 0 24 24" 
// // //     fill="none" 
// // //     stroke="currentColor" 
// // //     strokeWidth="2" 
// // //     strokeLinecap="round" 
// // //     strokeLinejoin="round" 
// // //     className={className}
// // //   >
// // //     <path d="M12 2l3 5h-6l3-5z" />
// // //     <path d="M5 21v-7l7-4 7 4v7" />
// // //     <path d="M3 21h18" />
// // //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// // //   </svg>
// // // );

// // // const PUZZLE_LEVELS = [
// // //   { id: 'lvl_3', title: 'Sacred Offering I', stages: 3, solutionHint: "Start 7, Offer 8" },
// // //   { id: 'lvl_4', title: 'Sacred Offering II', stages: 4, solutionHint: "Start 15, Offer 16" },
// // //   { id: 'lvl_5', title: 'Sacred Offering III', stages: 5, solutionHint: "Start 31, Offer 32" }
// // // ];

// // // export default function App() {
// // //   const [currentLevel, setCurrentLevel] = useState(0);
// // //   const level = PUZZLE_LEVELS[currentLevel];
  
// // //   const [initialFlowers, setInitialFlowers] = useState(0);
// // //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// // //   const [isCorrect, setIsCorrect] = useState(false);
// // //   const [isMuted, setIsMuted] = useState(false);
// // //   const [showInstructions, setShowInstructions] = useState(false);
// // //   const [isExplaining, setIsExplaining] = useState(false);
// // //   const [explanationText, setExplanationText] = useState("");
// // //   const [formulas, setFormulas] = useState([]);

// // //   // Journey & Animation State
// // //   const [activeStep, setActiveStep] = useState(-1); 
// // //   const [isProcessing, setIsProcessing] = useState(false);

// // //   const scrollContainerRef = useRef(null);
// // //   const activeNodeRef = useRef(null);
// // //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// // //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// // //   // Journey Steps Calculation
// // //   const journeySteps = useMemo(() => {
// // //     const steps = [];
// // //     let currentCount = initialFlowers;
// // //     for (let i = 1; i <= level.stages; i++) {
// // //       const riverCount = currentCount * 2;
// // //       const templeCount = riverCount - offeredAmount;
// // //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// // //       currentCount = Math.max(0, templeCount);
// // //     }
// // //     return steps;
// // //   }, [initialFlowers, offeredAmount, level.stages]);

// // //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// // //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// // //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// // //   // Real-time calculation for display
// // //   const currentDisplayCount = useMemo(() => {
// // //     if (activeStep === -1) return initialFlowers;
// // //     const stageIdx = Math.floor(activeStep / 2);
// // //     const isAtTemple = activeStep % 2 !== 0;
// // //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// // //   }, [activeStep, initialFlowers, journeySteps]);

// // //   // Auto-scroll logic: Fixed initial view, then tracking
// // //   useEffect(() => {
// // //     if (scrollContainerRef.current) {
// // //       if (activeStep <= 1) {
// // //         // Anchored to the left at the start to ensure Station 1 is visible
// // //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // //       } else if (activeNodeRef.current) {
// // //         activeNodeRef.current.scrollIntoView({
// // //           behavior: 'smooth',
// // //           block: 'nearest',
// // //           inline: 'center'
// // //         });
// // //       }
// // //     }
// // //   }, [activeStep]);

// // //   const speak = useCallback((text) => {
// // //     if (isMuted) return;
// // //     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
// // //       window.speechSynthesis.cancel();
// // //       const utterance = new SpeechSynthesisUtterance(text);
// // //       utterance.rate = 1.0;
// // //       window.speechSynthesis.speak(utterance);
// // //     }
// // //   }, [isMuted]);

// // //   const startJourney = useCallback(async () => {
// // //     if (!isInputReady || isProcessing) return;
    
// // //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// // //     setIsProcessing(true);
// // //     setIsCorrect(false);
    
// // //     for (let i = -1; i < level.stages * 2; i++) {
// // //       setActiveStep(i);
// // //       if (i >= 1 && i % 2 !== 0) {
// // //         const stageIdx = Math.floor(i / 2);
// // //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// // //           speak("Exhausted early.");
// // //           break;
// // //         }
// // //       }
// // //       await new Promise(r => setTimeout(r, 1000));
// // //     }
    
// // //     if (isLevelSolved) {
// // //       setIsCorrect(true);
// // //       speak("Balanced!");
// // //     }
// // //     setIsProcessing(false);
// // //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// // //   // AUTO-START TRIGGER: Once inputs are entered, simulate once.
// // //   useEffect(() => {
// // //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// // //                        lastSimulatedInputs.current.offering !== offeredAmount;

// // //     if (isInputReady && isNewInput && !isProcessing) {
// // //       const timer = setTimeout(() => {
// // //         startJourney();
// // //       }, 1000); 
// // //       return () => clearTimeout(timer);
// // //     }
// // //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// // //   const resetPuzzle = useCallback(() => {
// // //     setInitialFlowers(0);
// // //     setOfferedAmount(0);
// // //     setIsCorrect(false);
// // //     setActiveStep(-1);
// // //     setIsProcessing(false);
// // //     setFormulas([]);
// // //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// // //     if (scrollContainerRef.current) {
// // //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// // //     }
// // //   }, []);

// // //   const goToNextLevel = useCallback(() => {
// // //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// // //     resetPuzzle();
// // //   }, [resetPuzzle]);

// // //   const runExplanation = () => {
// // //     const lines = [`Initial Flow: ${initialFlowers}`];
// // //     journeySteps.forEach(s => {
// // //       lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// // //     });
// // //     setFormulas(lines);
// // //     setExplanationText("Goal: End with exactly zero flowers.");
// // //     setIsExplaining(true);
// // //     speak("The flowers double at the river and subtract at the temple.");
// // //   };

// // //   return (
// // //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// // //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// // //       {/* HEADER */}
// // //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
// // //         <div className="flex items-center gap-2">
// // //           <div className="w-7 h-7 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
// // //             <UserIcon size={16} />
// // //           </div>
// // //           <div>
// // //             <h1 className="text-[11px] sm:text-xl font-black uppercase text-[#3e2723] leading-none">{level.title}</h1>
// // //             <p className="text-[9px] sm:text-xs font-black text-[#8d6e63] uppercase tracking-widest leading-none mt-0.5">Sequence Ritual</p>
// // //           </div>
// // //         </div>

// // //         <div className="flex items-center gap-1 sm:gap-3">
// // //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
// // //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
// // //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2 bg-[#3e2723] text-white rounded-lg border-b-2 border-black active:scale-95"><RefreshCcw size={14} /></button>
// // //         </div>
// // //       </div>

// // //       {/* MONITOR */}
// // //       <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[1rem] sm:rounded-[2.5rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0 my-1">
// // //         <div className="grid grid-cols-2 gap-3 sm:gap-6">
// // //           <div className="relative p-2 sm:p-4 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// // //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">Current Count</span>
// // //             <div className="text-xl sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// // //               <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// // //               <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// // //             </div>
// // //           </div>
// // //           <div className={`relative p-2 sm:p-4 rounded-xl border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// // //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">End Balance</span>
// // //             <div className={`text-xl sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* TRACKING PATH */}
// // //       <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1.5 rounded-[1.2rem] sm:rounded-[3.5rem] shadow-2xl border-b-4 border-black shrink-0 overflow-hidden relative">
// // //         <div 
// // //           ref={scrollContainerRef}
// // //           className="h-full w-full bg-[#4e342e] rounded-[1rem] sm:rounded-[2.5rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative px-6 sm:px-12"
// // //         >
// // //           <div className="flex items-center min-w-max gap-3 sm:gap-10 pt-16 sm:pt-24 pb-4">
// // //             {/* START GATE */}
// // //             <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative">
// // //               <AnimatePresence>
// // //                 {activeStep === -1 && (
// // //                   <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // //                     <div className="relative">
// // //                       <UserIcon size={34} className="text-yellow-400 drop-shadow-[0_0_15px_gold]" strokeWidth={3} />
// // //                       <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // //                     </div>
// // //                     <div className="text-[10px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase tracking-tighter">Start</div>
// // //                   </motion.div>
// // //                 )}
// // //               </AnimatePresence>
// // //               <div className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
// // //                 {initialFlowers}
// // //               </div>
// // //             </div>

// // //             {journeySteps.map((step, idx) => {
// // //               const rIdx = idx * 2;
// // //               const tIdx = idx * 2 + 1;
// // //               return (
// // //                 <React.Fragment key={idx}>
// // //                   <div className="self-center mt-[-30px] opacity-10"><ArrowRight size={16} /></div>
// // //                   <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1.5 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// // //                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-3 py-0.5 rounded-full text-[10px] font-black text-white uppercase shadow-lg">Station 0{step.stage}</div>
// // //                     <div className="flex items-center gap-1.5 sm:gap-2">
// // //                       {/* RIVER */}
// // //                       <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // //                         <AnimatePresence>
// // //                           {activeStep === rIdx && (
// // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // //                               <div className="relative">
// // //                                 <UserIcon size={34} className="text-blue-400 drop-shadow-[0_0_15px_cyan]" strokeWidth={3} />
// // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // //                               </div>
// // //                             </motion.div>
// // //                           )}
// // //                         </AnimatePresence>
// // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// // //                            <Waves size={20} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
// // //                            <span className="text-[8px] sm:text-[11px] font-black">×2</span>
// // //                         </div>
// // //                         <span className="text-[10px] font-black text-blue-300 mt-0.5">{step.atRiver}</span>
// // //                       </div>
// // //                       <div className="opacity-10 self-center"><ArrowRight size={10} /></div>
// // //                       {/* TEMPLE */}
// // //                       <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// // //                         <AnimatePresence>
// // //                           {activeStep === tIdx && (
// // //                             <motion.div layoutId="priest" className="absolute -top-14 sm:-top-24 z-50 flex flex-col items-center">
// // //                               <div className="relative">
// // //                                 <UserIcon size={34} className="text-amber-400 drop-shadow-[0_0_15px_orange]" strokeWidth={3} />
// // //                                 <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// // //                               </div>
// // //                             </motion.div>
// // //                           )}
// // //                         </AnimatePresence>
// // //                         <div className={`w-10 h-10 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// // //                            <TempleIcon size={20} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
// // //                            <span className="text-[8px] sm:text-[11px] font-black">-{offeredAmount}</span>
// // //                         </div>
// // //                         <span className={`text-[10px] font-black mt-0.5 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </React.Fragment>
// // //               );
// // //             })}
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* INPUTS */}
// // //       <div className="w-full max-w-4xl bg-[#3e2723] p-3 sm:p-6 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
// // //         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[10px] sm:text-sm font-black uppercase border-2 border-[#3e2723]">Neural Input</div>
// // //         <div className="grid grid-cols-2 gap-3 sm:gap-8">
// // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // //             <span className="text-xs sm:text-sm font-black uppercase text-[#c4a484]">Start Flow</span>
// // //             <input 
// // //               type="number" value={initialFlowers || ''} 
// // //               onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // //               placeholder="?"
// // //             />
// // //             <div className="flex gap-1 w-full">
// // //               <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-sm border-b-2 border-[#c4a484]">-</button>
// // //               <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-emerald-500 text-white rounded font-black text-sm border-b-2 border-emerald-800">+</button>
// // //             </div>
// // //           </div>
// // //           <div className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2">
// // //             <span className="text-xs sm:text-sm font-black uppercase text-[#c4a484]">Offering</span>
// // //             <input 
// // //               type="number" value={offeredAmount || ''} 
// // //               onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// // //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-lg sm:text-4xl font-black text-[#3e2723]"
// // //               placeholder="?"
// // //             />
// // //             <div className="flex gap-1 w-full">
// // //               <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-sm border-b-2 border-[#c4a484]">-</button>
// // //               <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-amber-500 text-white rounded font-black text-sm border-b-2 border-amber-700">+</button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* FOOTER */}
// // //       <div className="w-full max-w-4xl flex gap-2 shrink-0 px-1 pb-1">
// // //         <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-3 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-1'}`}>
// // //           {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
// // //           <span className="text-[10px] sm:text-base uppercase">{isCorrect ? 'Next Level' : isProcessing ? 'Re-Run Path' : 'Re-Run Path'}</span>
// // //         </button>
// // //         <button onClick={runExplanation} className="flex-1 py-3 sm:py-5 bg-[#8d6e63] text-white rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-lg border-b-4 border-[#3e2723] active:translate-y-1">LogicInsight</button>
// // //       </div>

// // //       {/* MODALS */}
// // //       <AnimatePresence>
// // //         {showInstructions && (
// // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
// // //             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-6 sm:p-10 border-4 border-[#3e2723]">
// // //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform"><X size={18} /></button>
              
// // //               <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
// // //                   <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
// // //                   <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Mission Briefing</h2>
// // //               </div>

// // //               <div className="space-y-3 sm:space-y-5 max-h-[50vh] overflow-y-auto no-scrollbar pr-2 text-[#5d4037]">
// // //                 {[
// // //                   { text: `The priest visits a sequence of ${level.stages} stations, each containing a River and a Temple.`, icon: "🚶" },
// // //                   { text: "At every River (Waves icon), the flower bouquet in hand instantly doubles (×2).", icon: "🌊" },
// // //                   { text: "At every Temple (Gopuram icon), he must offer a fixed number of flowers.", icon: "⛩️" },
// // //                   { text: "Critical Rule: The bouquet must not run out (0 flowers) before reaching the final temple.", icon: "⚠️" },
// // //                   { text: "Ultimate Goal: Adjust the counts so that after the very last temple, the balance is exactly 0.", icon: "🎯" }
// // //                 ].map((item, i) => (
// // //                   <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="flex gap-4 items-start bg-[#e6dccb]/30 p-4 rounded-2xl border border-[#c4a484]/10 shadow-inner">
// // //                     <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
// // //                     <p className="text-[11px] sm:text-lg font-bold leading-relaxed pt-1.5">{item.text}</p>
// // //                   </motion.div>
// // //                 ))}
// // //               </div>

// // //               <button onClick={() => setShowInstructions(false)} className="w-full mt-6 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg transition-all hover:bg-black active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Accept Mission</button>
// // //             </motion.div>
// // //           </motion.div>
// // //         )}
// // //         {isExplaining && (
// // //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// // //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
// // //               <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
// // //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-4 text-center">
// // //                 {formulas.map((line, idx) => (
// // //                   <p key={idx} className="text-[10px] sm:text-sm font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// // //                 ))}
// // //               </div>
// // //               <p className="text-[10px] sm:text-sm font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// // //             </div>
// // //           </motion.div>
// // //         )}
// // //       </AnimatePresence>

// // //       <style>{`
// // //        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
// // //        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
// // //        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
// // //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// // //        input[type=number] { -moz-appearance: textfield; }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }


// // import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   RefreshCcw,
// //   CheckCircle2,
// //   ChevronRight,
// //   Trophy,
// //   Sparkles,
// //   Volume2,
// //   VolumeX,
// //   Timer,
// //   Info,
// //   X,
// //   Target,
// //   ClipboardList,
// //   Droplets,
// //   HelpCircle,
// //   Flower,
// //   ArrowRight,
// //   Waves,
// //   ArrowRightCircle,
// //   User as UserIcon,
// //   Church,
// //   Play,
// //   Activity,
// //   AlertTriangle,
// //   MapPin
// // } from 'lucide-react';

// // // Custom Temple SVG for traditional gopuram architecture
// // const TempleIcon = ({ size = 20, className = "" }) => (
// //   <svg 
// //     width={size} 
// //     height={size} 
// //     viewBox="0 0 24 24" 
// //     fill="none" 
// //     stroke="currentColor" 
// //     strokeWidth="2" 
// //     strokeLinecap="round" 
// //     strokeLinejoin="round" 
// //     className={className}
// //   >
// //     <path d="M12 2l3 5h-6l3-5z" />
// //     <path d="M5 21v-7l7-4 7 4v7" />
// //     <path d="M3 21h18" />
// //     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
// //   </svg>
// // );

// // const PUZZLE_LEVELS = [
// //   { id: 'lvl_3', title: 'Sacred Offering I', stages: 3, solutionHint: "Start 7, Offer 8" },
// //   { id: 'lvl_4', title: 'Sacred Offering II', stages: 4, solutionHint: "Start 15, Offer 16" },
// //   { id: 'lvl_5', title: 'Sacred Offering III', stages: 5, solutionHint: "Start 31, Offer 32" }
// // ];

// // export default function App() {
// //   const [currentLevel, setCurrentLevel] = useState(0);
// //   const level = PUZZLE_LEVELS[currentLevel];
  
// //   const [initialFlowers, setInitialFlowers] = useState(0);
// //   const [offeredAmount, setOfferedAmount] = useState(0);
  
// //   const [isCorrect, setIsCorrect] = useState(false);
// //   const [isMuted, setIsMuted] = useState(false);
// //   const [showInstructions, setShowInstructions] = useState(false);
// //   const [isExplaining, setIsExplaining] = useState(false);
// //   const [explanationText, setExplanationText] = useState("");
// //   const [formulas, setFormulas] = useState([]);

// //   // Journey & Animation State
// //   const [activeStep, setActiveStep] = useState(-1); 
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   const scrollContainerRef = useRef(null);
// //   const activeNodeRef = useRef(null);
// //   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

// //   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

// //   // Journey Steps Calculation
// //   const journeySteps = useMemo(() => {
// //     const steps = [];
// //     let currentCount = initialFlowers;
// //     for (let i = 1; i <= level.stages; i++) {
// //       const riverCount = currentCount * 2;
// //       const templeCount = riverCount - offeredAmount;
// //       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
// //       currentCount = Math.max(0, templeCount);
// //     }
// //     return steps;
// //   }, [initialFlowers, offeredAmount, level.stages]);

// //   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
// //   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
// //   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

// //   // Real-time calculation for display
// //   const currentDisplayCount = useMemo(() => {
// //     if (activeStep === -1) return initialFlowers;
// //     const stageIdx = Math.floor(activeStep / 2);
// //     const isAtTemple = activeStep % 2 !== 0;
// //     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
// //   }, [activeStep, initialFlowers, journeySteps]);

// //   // Auto-scroll logic: Fixed initial view, then tracking
// //   useEffect(() => {
// //     if (scrollContainerRef.current) {
// //       if (activeStep <= 1) {
// //         // Anchored to the left at the start to ensure Station 1 is visible
// //         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// //       } else if (activeNodeRef.current) {
// //         activeNodeRef.current.scrollIntoView({
// //           behavior: 'smooth',
// //           block: 'nearest',
// //           inline: 'center'
// //         });
// //       }
// //     }
// //   }, [activeStep]);

// //   const speak = useCallback((text) => {
// //     if (isMuted) return;
// //     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
// //       window.speechSynthesis.cancel();
// //       const utterance = new SpeechSynthesisUtterance(text);
// //       utterance.rate = 1.0;
// //       window.speechSynthesis.speak(utterance);
// //     }
// //   }, [isMuted]);

// //   const startJourney = useCallback(async () => {
// //     if (!isInputReady || isProcessing) return;
    
// //     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
// //     setIsProcessing(true);
// //     setIsCorrect(false);
    
// //     for (let i = -1; i < level.stages * 2; i++) {
// //       setActiveStep(i);
// //       if (i >= 1 && i % 2 !== 0) {
// //         const stageIdx = Math.floor(i / 2);
// //         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
// //           speak("Exhausted early.");
// //           break;
// //         }
// //       }
// //       await new Promise(r => setTimeout(r, 1000));
// //     }
    
// //     if (isLevelSolved) {
// //       setIsCorrect(true);
// //       speak("Balanced!");
// //     }
// //     setIsProcessing(false);
// //   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

// //   // AUTO-START TRIGGER
// //   useEffect(() => {
// //     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
// //                        lastSimulatedInputs.current.offering !== offeredAmount;

// //     if (isInputReady && isNewInput && !isProcessing) {
// //       const timer = setTimeout(() => {
// //         startJourney();
// //       }, 1000); 
// //       return () => clearTimeout(timer);
// //     }
// //   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

// //   const resetPuzzle = useCallback(() => {
// //     setInitialFlowers(0);
// //     setOfferedAmount(0);
// //     setIsCorrect(false);
// //     setActiveStep(-1);
// //     setIsProcessing(false);
// //     setFormulas([]);
// //     lastSimulatedInputs.current = { flow: 0, offering: 0 };
// //     if (scrollContainerRef.current) {
// //       scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
// //     }
// //   }, []);

// //   const goToNextLevel = useCallback(() => {
// //     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
// //     resetPuzzle();
// //   }, [resetPuzzle]);

// //   const runExplanation = () => {
// //     const lines = [`Initial Flow: ${initialFlowers}`];
// //     journeySteps.forEach(s => {
// //       lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
// //     });
// //     setFormulas(lines);
// //     setExplanationText("Goal: End with exactly zero flowers.");
// //     setIsExplaining(true);
// //     speak("The flowers double at the river and subtract at the temple.");
// //   };

// //   return (
// //     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1 sm:p-4 pb-2 overflow-hidden relative shadow-inner">
// //       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
// //       {/* HEADER - Compacted for mobile */}
// //       <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 shrink-0 z-50">
// //         <div className="flex items-center gap-2">
// //           <div className="w-7 h-7 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
// //             <UserIcon size={14} className="sm:w-6" />
// //           </div>
// //           <div className="leading-tight">
// //             <h1 className="text-[10px] sm:text-xl font-black uppercase text-[#3e2723]">{level.title}</h1>
// //             <p className="text-[8px] sm:text-xs font-black text-[#8d6e63] uppercase tracking-widest">Sequence Ritual</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-1 sm:gap-3">
// //           <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
// //           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
// //           <button onClick={resetPuzzle} className="p-1.5 sm:p-2 bg-[#3e2723] text-white rounded-lg border-b-2 border-black active:scale-95"><RefreshCcw size={14} /></button>
// //         </div>
// //       </div>

// //       {/* MONITOR - Reduced padding on mobile */}
// //       <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[0.8rem] sm:rounded-[2.5rem] p-2 sm:p-5 border-2 border-[#c4a484]/40 shadow-xl relative overflow-hidden shrink-0 my-1">
// //         <div className="grid grid-cols-2 gap-2 sm:gap-6">
// //           <div className="relative p-1.5 sm:p-4 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner flex flex-col items-center">
// //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">In Hand</span>
// //             <div className="text-lg sm:text-5xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
// //               <motion.span key={currentDisplayCount} initial={{ y: 3, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
// //               <Flower size={14} className="text-pink-400 sm:w-8 sm:h-8" />
// //             </div>
// //           </div>
// //           <div className={`relative p-1.5 sm:p-4 rounded-xl border-2 transition-all ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
// //             <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase mb-0.5">End Balance</span>
// //             <div className={`text-lg sm:text-5xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* TRACKING PATH - Flexible height (flex-1) */}
// //       <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1 rounded-[1rem] sm:rounded-[3.5rem] shadow-2xl border-b-4 border-black shrink-0 overflow-hidden relative min-h-0">
// //         <div 
// //           ref={scrollContainerRef}
// //           className="h-full w-full bg-[#4e342e] rounded-[0.8rem] sm:rounded-[2.5rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative px-4 sm:px-12"
// //         >
// //           <div className="flex items-center min-w-max gap-2 sm:gap-10 pt-12 sm:pt-24 pb-4">
// //             {/* START GATE */}
// //             <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative px-4">
// //               <AnimatePresence>
// //                 {activeStep === -1 && (
// //                   <motion.div layoutId="priest" className="absolute -top-12 sm:-top-24 z-50 flex flex-col items-center">
// //                     <div className="relative">
// //                       <UserIcon size={28} className="text-yellow-400 sm:size-34 drop-shadow-[0_0_15px_gold]" strokeWidth={3} />
// //                       <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1 py-0.5 text-[7px] sm:text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// //                     </div>
// //                     <div className="text-[7px] sm:text-[10px] font-black bg-yellow-500 text-black px-1 rounded mt-1 uppercase">Start</div>
// //                   </motion.div>
// //                 )}
// //               </AnimatePresence>
// //               <div className={`w-8 h-8 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black text-xs sm:text-3xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
// //                 {initialFlowers}
// //               </div>
// //             </div>

// //             {journeySteps.map((step, idx) => {
// //               const rIdx = idx * 2;
// //               const tIdx = idx * 2 + 1;
// //               return (
// //                 <React.Fragment key={idx}>
// //                   <div className="self-center mt-[-20px] opacity-10"><ArrowRight size={14} /></div>
// //                   <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1 sm:p-5 rounded-[1rem] sm:rounded-[2.5rem] border border-white/10 relative transition-all">
// //                     <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-black text-white uppercase shadow-lg">Station 0{step.stage}</div>
// //                     <div className="flex items-center gap-1.5 sm:gap-2">
// //                       {/* RIVER */}
// //                       <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// //                         <AnimatePresence>
// //                           {activeStep === rIdx && (
// //                             <motion.div layoutId="priest" className="absolute -top-12 sm:-top-24 z-50 flex flex-col items-center">
// //                               <div className="relative">
// //                                 <UserIcon size={28} className="text-blue-400 sm:size-34 drop-shadow-[0_0_15px_cyan]" strokeWidth={3} />
// //                                 <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1 py-0.5 text-[7px] sm:text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// //                               </div>
// //                             </motion.div>
// //                           )}
// //                         </AnimatePresence>
// //                         <div className={`w-9 h-9 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
// //                            <Waves size={16} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
// //                            <span className="text-[7px] sm:text-[11px] font-black">×2</span>
// //                         </div>
// //                         <span className="text-[9px] sm:text-[10px] font-black text-blue-300 mt-0.5">{step.atRiver}</span>
// //                       </div>
// //                       <div className="opacity-10 self-center"><ArrowRight size={10} /></div>
// //                       {/* TEMPLE */}
// //                       <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
// //                         <AnimatePresence>
// //                           {activeStep === tIdx && (
// //                             <motion.div layoutId="priest" className="absolute -top-12 sm:-top-24 z-50 flex flex-col items-center">
// //                               <div className="relative">
// //                                 <UserIcon size={28} className="text-amber-400 sm:size-34 drop-shadow-[0_0_15px_orange]" strokeWidth={3} />
// //                                 <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1 py-0.5 text-[7px] sm:text-[8px] font-black shadow-lg border border-[#3e2723]">{currentDisplayCount}</div>
// //                               </div>
// //                             </motion.div>
// //                           )}
// //                         </AnimatePresence>
// //                         <div className={`w-9 h-9 sm:w-24 sm:h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
// //                            <TempleIcon size={16} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
// //                            <span className="text-[7px] sm:text-[11px] font-black">-{offeredAmount}</span>
// //                         </div>
// //                         <span className={`text-[9px] sm:text-[10px] font-black mt-0.5 ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </React.Fragment>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </div>

// //       {/* INPUTS - Tighter padding for mobile responsiveness */}
// //       <div className="w-full max-w-4xl bg-[#3e2723] p-2 sm:p-6 rounded-[1rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
// //         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[8px] sm:text-sm font-black uppercase border-2 border-[#3e2723] shadow-md">Lab Input</div>
// //         <div className="grid grid-cols-2 gap-2 sm:gap-8 mt-1">
// //           <div className="bg-[#faf9f6]/10 p-1.5 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2 border border-white/5">
// //             <span className="text-[9px] sm:text-sm font-black uppercase text-[#c4a484]">Start Flow</span>
// //             <input 
// //               type="number" value={initialFlowers || ''} 
// //               onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
// //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-4xl font-black text-[#3e2723]"
// //               placeholder="?"
// //             />
// //             <div className="flex gap-1 w-full">
// //               <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-xs border-b-2 border-[#c4a484] active:translate-y-0.5">-</button>
// //               <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-emerald-500 text-white rounded font-black text-xs border-b-2 border-emerald-800 active:translate-y-0.5">+</button>
// //             </div>
// //           </div>
// //           <div className="bg-[#faf9f6]/10 p-1.5 sm:p-5 rounded-[0.8rem] flex flex-col items-center gap-1 sm:gap-2 border border-white/5">
// //             <span className="text-[9px] sm:text-sm font-black uppercase text-[#c4a484]">Offering</span>
// //             <input 
// //               type="number" value={offeredAmount || ''} 
// //               onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
// //               className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-4xl font-black text-[#3e2723]"
// //               placeholder="?"
// //             />
// //             <div className="flex gap-1 w-full">
// //               <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-xs border-b-2 border-[#c4a484] active:translate-y-0.5">-</button>
// //               <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-amber-500 text-white rounded font-black text-xs border-b-2 border-amber-700 active:translate-y-0.5">+</button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* FOOTER BUTTONS */}
// //       <div className="w-full max-w-4xl flex gap-2 shrink-0 px-1 pb-1">
// //         <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-2 sm:py-5 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-0.5'}`}>
// //           {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
// //           <span className="text-[9px] sm:text-base uppercase">{isCorrect ? 'Next Level' : 'Re-Run'}</span>
// //         </button>
// //         <button onClick={runExplanation} className="flex-1 py-2 sm:py-5 bg-[#8d6e63] text-white rounded-xl sm:rounded-2xl font-black uppercase text-[9px] sm:text-base shadow-lg border-b-4 border-[#3e2723] active:translate-y-0.5">Logic Feed</button>
// //       </div>

// //       {/* MODALS */}
// //       <AnimatePresence>
// //         {showInstructions && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
// //             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-5 sm:p-10 border-4 border-[#3e2723]">
// //               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg"><X size={18} /></button>
              
// //               <div className="flex items-center gap-3 mb-4 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
// //                   <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
// //                   <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Mission Briefing</h2>
// //               </div>

// //               <div className="space-y-2 sm:space-y-4 max-h-[45vh] overflow-y-auto no-scrollbar pr-1 text-[#5d4037]">
// //                 {[
// //                   { text: `Priest visits a sequence of ${level.stages} stations, each with a River and a Temple.`, icon: "🚶" },
// //                   { text: "At every River (Waves icon), flower count instantly doubles (×2).", icon: "🌊" },
// //                   { text: "At every Temple (Temple icon), he offers a fixed number of flowers.", icon: "⛩️" },
// //                   { text: "Critical: Bouquet must not run out (0 flowers) before the final temple.", icon: "⚠️" },
// //                   { text: "Goal: Adjust counts so that after the last temple, balance is exactly 0.", icon: "🎯" }
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex gap-3 items-start bg-[#e6dccb]/30 p-3 sm:p-4 rounded-xl border border-[#c4a484]/10 shadow-inner">
// //                     <span className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
// //                     <p className="text-[10px] sm:text-lg font-bold leading-relaxed pt-0.5 sm:pt-1.5">{item.text}</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               <button onClick={() => setShowInstructions(false)} className="w-full mt-4 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg transition-all hover:bg-black active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Accept Mission</button>
// //             </motion.div>
// //           </motion.div>
// //         )}
// //         {isExplaining && (
// //           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
// //             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
// //               <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
// //               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-6 text-center">
// //                 {formulas.map((line, idx) => (
// //                   <p key={idx} className="text-[10px] sm:text-sm font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
// //                 ))}
// //               </div>
// //               <p className="text-[10px] sm:text-sm font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
// //             </div>
// //           </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <style>{`
// //        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
// //        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
// //        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
// //        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
// //        input[type=number] { -moz-appearance: textfield; }
// //       `}</style>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   RefreshCcw,
//   CheckCircle2,
//   ChevronRight,
//   Trophy,
//   Sparkles,
//   Volume2,
//   VolumeX,
//   Timer,
//   Info,
//   X,
//   Target,
//   ClipboardList,
//   Droplets,
//   HelpCircle,
//   Flower,
//   ArrowRight,
//   Waves,
//   ArrowRightCircle,
//   User as UserIcon,
//   Play,
//   Activity,
//   AlertTriangle,
//   MapPin
// } from 'lucide-react';

// // Custom Temple SVG for traditional gopuram architecture
// const TempleIcon = ({ size = 20, className = "" }) => (
//   <svg 
//     width={size} 
//     height={size} 
//     viewBox="0 0 24 24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round" 
//     className={className}
//   >
//     <path d="M12 2l3 5h-6l3-5z" />
//     <path d="M5 21v-7l7-4 7 4v7" />
//     <path d="M3 21h18" />
//     <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
//   </svg>
// );

// const PUZZLE_LEVELS = [
//   { id: 'lvl_3', title: 'Sacred Offering I', stages: 3, solutionHint: "Start 7, Offer 8" },
//   { id: 'lvl_4', title: 'Sacred Offering II', stages: 4, solutionHint: "Start 15, Offer 16" },
//   { id: 'lvl_5', title: 'Sacred Offering III', stages: 5, solutionHint: "Start 31, Offer 32" }
// ];

// export default function App() {
//   const [currentLevel, setCurrentLevel] = useState(0);
//   const level = PUZZLE_LEVELS[currentLevel];
  
//   const [initialFlowers, setInitialFlowers] = useState(0);
//   const [offeredAmount, setOfferedAmount] = useState(0);
  
//   const [isCorrect, setIsCorrect] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [isExplaining, setIsExplaining] = useState(false);
//   const [explanationText, setExplanationText] = useState("");
//   const [formulas, setFormulas] = useState([]);

//   // Journey & Animation State
//   const [activeStep, setActiveStep] = useState(-1); 
//   const [isProcessing, setIsProcessing] = useState(false);

//   const scrollContainerRef = useRef(null);
//   const activeNodeRef = useRef(null);
//   const lastSimulatedInputs = useRef({ flow: 0, offering: 0 });

//   const isInputReady = initialFlowers > 0 && offeredAmount > 0;

//   // Journey Steps Calculation
//   const journeySteps = useMemo(() => {
//     const steps = [];
//     let currentCount = initialFlowers;
//     for (let i = 1; i <= level.stages; i++) {
//       const riverCount = currentCount * 2;
//       const templeCount = riverCount - offeredAmount;
//       steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
//       currentCount = Math.max(0, templeCount);
//     }
//     return steps;
//   }, [initialFlowers, offeredAmount, level.stages]);

//   const finalBalance = journeySteps[journeySteps.length - 1].atTemple;
//   const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
//   const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

//   const currentDisplayCount = useMemo(() => {
//     if (activeStep === -1) return initialFlowers;
//     const stageIdx = Math.floor(activeStep / 2);
//     const isAtTemple = activeStep % 2 !== 0;
//     return isAtTemple ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
//   }, [activeStep, initialFlowers, journeySteps]);

//   // Auto-scroll logic: Anchored Left for Start, then tracking
//   useEffect(() => {
//     if (scrollContainerRef.current) {
//       if (activeStep <= 1) {
//         scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//       } else if (activeNodeRef.current) {
//         activeNodeRef.current.scrollIntoView({
//           behavior: 'smooth',
//           block: 'nearest',
//           inline: 'center'
//         });
//       }
//     }
//   }, [activeStep]);

//   const speak = useCallback((text) => {
//     if (isMuted) return;
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 1.0;
//       window.speechSynthesis.speak(utterance);
//     }
//   }, [isMuted]);

//   const startJourney = useCallback(async () => {
//     if (!isInputReady || isProcessing) return;
//     lastSimulatedInputs.current = { flow: initialFlowers, offering: offeredAmount };
//     setIsProcessing(true);
//     setIsCorrect(false);
    
//     for (let i = -1; i < level.stages * 2; i++) {
//       setActiveStep(i);
//       if (i >= 1 && i % 2 !== 0) {
//         const stageIdx = Math.floor(i / 2);
//         if (journeySteps[stageIdx].atTemple <= 0 && stageIdx < level.stages - 1) {
//           speak("Exhausted early.");
//           break;
//         }
//       }
//       await new Promise(r => setTimeout(r, 1000));
//     }
    
//     if (isLevelSolved) {
//       setIsCorrect(true);
//       speak("Balanced!");
//     }
//     setIsProcessing(false);
//   }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

//   useEffect(() => {
//     const isNewInput = lastSimulatedInputs.current.flow !== initialFlowers || 
//                        lastSimulatedInputs.current.offering !== offeredAmount;
//     if (isInputReady && isNewInput && !isProcessing) {
//       const timer = setTimeout(() => {
//         startJourney();
//       }, 1000); 
//       return () => clearTimeout(timer);
//     }
//   }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

//   const resetPuzzle = useCallback(() => {
//     setInitialFlowers(0);
//     setOfferedAmount(0);
//     setIsCorrect(false);
//     setActiveStep(-1);
//     setIsProcessing(false);
//     setFormulas([]);
//     lastSimulatedInputs.current = { flow: 0, offering: 0 };
//     if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
//   }, []);

//   const goToNextLevel = useCallback(() => {
//     setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
//     resetPuzzle();
//   }, [resetPuzzle]);

//   const runExplanation = () => {
//     const lines = [`Initial Flow: ${initialFlowers}`];
//     journeySteps.forEach(s => {
//       lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
//     });
//     setFormulas(lines);
//     setExplanationText("Goal: End with exactly zero flowers.");
//     setIsExplaining(true);
//     speak("The flowers double at the river and subtract at the temple.");
//   };

//   return (
//     <div className="h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1 sm:p-2 overflow-hidden relative shadow-inner">
//       <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
//       {/* HEADER */}
//       <div className="w-full max-w-4xl flex justify-between items-center px-1 shrink-0 z-50">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
//             <UserIcon size={16} />
//           </div>
//           <div className="leading-tight">
//             <h1 className="text-[10px] sm:text-base font-black uppercase text-[#3e2723]">{level.title}</h1>
//             <p className="text-[8px] font-black text-[#8d6e63] uppercase tracking-widest leading-none">Sequence Ritual</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-1">
//           <button onClick={() => setShowInstructions(true)} className="p-1.5 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
//           <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
//           <button onClick={resetPuzzle} className="p-1.5 bg-[#3e2723] text-white rounded-lg border-b-2 border-black active:scale-95"><RefreshCcw size={14} /></button>
//         </div>
//       </div>

//       {/* MONITOR - Compressed */}
//       <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[0.8rem] sm:rounded-[1.5rem] p-1.5 sm:p-3 border-2 border-[#c4a484]/40 shadow-xl shrink-0 my-1">
//         <div className="grid grid-cols-2 gap-2 sm:gap-4">
//           <div className="relative p-1.5 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 flex flex-col items-center">
//             <span className="text-[10px] sm:text-xs font-black text-[#8d6e63] uppercase">In Hand</span>
//             <div className="text-xl sm:text-3xl font-black text-[#3e2723] tabular-nums flex items-center gap-1">
//               <motion.span key={currentDisplayCount} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
//               <Flower size={14} className="text-pink-400" />
//             </div>
//           </div>
//           <div className={`relative p-1.5 rounded-xl border-2 transition-all ${isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-[#c4a484]/30 bg-[#e6dccb]/10 shadow-inner'} flex flex-col items-center`}>
//             <span className="text-[10px] sm:text-xs font-black text-[#8d6e63] uppercase">Balance</span>
//             <div className={`text-xl sm:text-3xl font-black tabular-nums ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
//           </div>
//         </div>
//       </div>

//       {/* TRACKING PATH - Highly compressed width */}
//       <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1 rounded-[1rem] sm:rounded-[2rem] shadow-2xl border-b-4 border-black shrink-0 overflow-hidden relative min-h-0">
//         <div 
//           ref={scrollContainerRef}
//           className="h-full w-full bg-[#4e342e] rounded-[0.8rem] sm:rounded-[1.8rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative"
//         >
//           <div className="flex items-center min-w-max gap-1 sm:gap-3 pt-10 pb-2 px-2 sm:px-6">
//             {/* START GATE */}
//             <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative px-1">
//               <AnimatePresence>
//                 {activeStep === -1 && (
//                   <motion.div layoutId="priest" className="absolute -top-12 sm:-top-16 z-50 flex flex-col items-center">
//                     <div className="relative">
//                       <UserIcon size={30} className="text-yellow-400 drop-shadow-[0_0_10px_gold]" strokeWidth={3} />
//                       <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1 py-0.5 text-[8px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
//                     </div>
//                     <div className="text-[8px] font-black bg-yellow-500 text-black px-1 rounded uppercase">Ready</div>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//               <div className={`w-9 h-9 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-xs sm:text-xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
//                 {initialFlowers}
//               </div>
//             </div>

//             {journeySteps.map((step, idx) => {
//               const rIdx = idx * 2;
//               const tIdx = idx * 2 + 1;
//               return (
//                 <React.Fragment key={idx}>
//                   <div className="opacity-10 self-center"><ArrowRight size={12} /></div>
//                   {/* OFFERING STATION BOX - Width reduced significantly */}
//                   <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1 sm:p-2 rounded-xl sm:rounded-3xl border border-white/10 relative transition-all">
//                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-2 py-0.5 rounded-full text-[8px] font-black text-white uppercase whitespace-nowrap">Station 0{step.stage}</div>
//                     <div className="flex items-center gap-1 sm:gap-2">
//                       {/* RIVER */}
//                       <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
//                         <AnimatePresence>
//                           {activeStep === rIdx && (
//                             <motion.div layoutId="priest" className="absolute -top-12 sm:-top-16 z-50 flex flex-col items-center">
//                               <div className="relative">
//                                 <UserIcon size={30} className="text-blue-400 drop-shadow-[0_0_10px_cyan]" strokeWidth={3} />
//                                 <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1 py-0.5 text-[8px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
//                               </div>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                         <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110' : 'bg-blue-500/5 border-blue-500/20'}`}>
//                            <Waves size={18} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
//                            <span className="text-[7px] font-black">×2</span>
//                         </div>
//                         <span className="text-[8px] font-black text-blue-300">{step.atRiver}</span>
//                       </div>
//                       <div className="opacity-10 self-center"><ArrowRight size={8} /></div>
//                       {/* TEMPLE */}
//                       <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
//                         <AnimatePresence>
//                           {activeStep === tIdx && (
//                             <motion.div layoutId="priest" className="absolute -top-12 sm:-top-16 z-50 flex flex-col items-center">
//                               <div className="relative">
//                                 <UserIcon size={30} className="text-amber-400 drop-shadow-[0_0_10px_orange]" strokeWidth={3} />
//                                 <div className="absolute -right-3 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[8px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
//                               </div>
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                         <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110' : 'bg-amber-500/5 border-amber-500/20'}`}>
//                            <TempleIcon size={18} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
//                            <span className="text-[7px] font-black">-{offeredAmount}</span>
//                         </div>
//                         <span className={`text-[8px] font-black ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* INPUTS - Vertical compression for mobile */}
//       <div className="w-full max-w-4xl bg-[#3e2723] p-1.5 sm:p-4 rounded-[1rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
//         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-6 py-0.5 rounded-full text-[9px] sm:text-xs font-black uppercase border-2 border-[#3e2723]">Neural Input</div>
//         <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-1">
//           <div className="bg-[#faf9f6]/10 p-1.5 sm:p-3 rounded-xl flex flex-col items-center gap-0.5 sm:gap-1 border border-white/5">
//             <span className="text-[10px] sm:text-sm font-black uppercase text-[#c4a484]">Start Flow</span>
//             <input 
//               type="number" value={initialFlowers || ''} 
//               onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
//               className="w-full max-w-[40px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-2xl font-black text-[#3e2723]"
//               placeholder="?"
//             />
//             <div className="flex gap-1 w-full mt-0.5">
//               <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-0.5 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-xs border-b-2 border-[#c4a484]">-</button>
//               <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-0.5 sm:py-2 bg-emerald-500 text-white rounded font-black text-xs border-b-2 border-emerald-800">+</button>
//             </div>
//           </div>
//           <div className="bg-[#faf9f6]/10 p-1.5 sm:p-3 rounded-xl flex flex-col items-center gap-0.5 sm:gap-1 border border-white/5">
//             <span className="text-[10px] sm:text-sm font-black uppercase text-[#c4a484]">Offering</span>
//             <input 
//               type="number" value={offeredAmount || ''} 
//               onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
//               className="w-full max-w-[40px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-2xl font-black text-[#3e2723]"
//               placeholder="?"
//             />
//             <div className="flex gap-1 w-full mt-0.5">
//               <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-0.5 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-xs border-b-2 border-[#c4a484]">-</button>
//               <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-0.5 sm:py-2 bg-amber-500 text-white rounded font-black text-xs border-b-2 border-amber-700">+</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <div className="w-full max-w-4xl flex gap-1.5 shrink-0 px-1 pb-1">
//         <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-2 sm:py-4 rounded-xl font-black flex items-center justify-center gap-1.5 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-0.5'}`}>
//           {isProcessing ? <Timer size={12} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
//           <span className="text-[10px] sm:text-sm uppercase">{isCorrect ? 'Next Level' : 'Re-Run Path'}</span>
//         </button>
//         <button onClick={runExplanation} className="flex-1 py-2 sm:py-4 bg-[#8d6e63] text-white rounded-xl font-black uppercase text-[10px] sm:text-sm shadow-lg border-b-4 border-[#3e2723] active:translate-y-0.5">Logic Insight</button>
//       </div>

//       {/* MODALS */}
//       <AnimatePresence>
//         {showInstructions && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
//             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-5 sm:p-10 border-4 border-[#3e2723]">
//               <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg"><X size={18} /></button>
//               <div className="flex items-center gap-3 mb-4 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
//                   <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
//                   <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Mission Briefing</h2>
//               </div>
//               <div className="space-y-2 sm:space-y-4 max-h-[45vh] overflow-y-auto no-scrollbar pr-1 text-[#5d4037]">
//                 {[
//                   { text: `Visit ${level.stages} stations, each with a River and a Temple.`, icon: "🚶" },
//                   { text: "At every River, your bouquet size instantly doubles (×2).", icon: "🌊" },
//                   { text: "At every Temple, you must offer a fixed number of flowers.", icon: "⛩️" },
//                   { text: "Rule: The bouquet must not run out (0) before the last temple.", icon: "⚠️" },
//                   { text: "Goal: Reach a balance of exactly 0 at the final station.", icon: "🎯" }
//                 ].map((item, i) => (
//                   <div key={i} className="flex gap-3 items-start bg-[#e6dccb]/30 p-3 sm:p-4 rounded-xl border border-[#c4a484]/10 shadow-inner">
//                     <span className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
//                     <p className="text-[10px] sm:text-lg font-bold leading-tight pt-1">{item.text}</p>
//                   </div>
//                 ))}
//               </div>
//               <button onClick={() => setShowInstructions(false)} className="w-full mt-4 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg transition-all active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Accept Mission</button>
//             </motion.div>
//           </motion.div>
//         )}
//         {isExplaining && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
//             <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
//               <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
//               <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-6 text-center">
//                 {formulas.map((line, idx) => (
//                   <p key={idx} className="text-[10px] sm:text-sm font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
//                 ))}
//               </div>
//               <p className="text-[10px] sm:text-sm font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <style>{`
//        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
//        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
//        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
//        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
//        input[type=number] { -moz-appearance: textfield; }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  Timer,
  Info,
  X,
  Target,
  ClipboardList,
  Droplets,
  HelpCircle,
  Flower,
  ArrowRight,
  Waves,
  ArrowRightCircle,
  User as UserIcon,
  Play,
  Activity,
  AlertTriangle
} from 'lucide-react';

// Custom Temple SVG for traditional gopuram architecture
const TempleIcon = ({ size = 20, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2l3 5h-6l3-5z" />
    <path d="M5 21v-7l7-4 7 4v7" />
    <path d="M3 21h18" />
    <path d="M9 21v-4a3 3 0 0 1 6 0v4" />
  </svg>
);

const PUZZLE_LEVELS = [
  { id: 'lvl_3', title: 'Sacred Offering I', stages: 3 },
  { id: 'lvl_4', title: 'Sacred Offering II', stages: 4 },
  { id: 'lvl_5', title: 'Sacred Offering III', stages: 5 }
];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const level = PUZZLE_LEVELS[currentLevel];
  
  const [initialFlowers, setInitialFlowers] = useState(0);
  const [offeredAmount, setOfferedAmount] = useState(0);
  
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);

  const [activeStep, setActiveStep] = useState(-1); 
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollContainerRef = useRef(null);
  const activeNodeRef = useRef(null);
  const lastSimInputs = useRef({ flow: -1, offering: -1 });

  const isInputReady = initialFlowers > 0 && offeredAmount > 0;

  const journeySteps = useMemo(() => {
    const steps = [];
    let currentCount = initialFlowers;
    for (let i = 1; i <= level.stages; i++) {
      const riverCount = currentCount * 2;
      const templeCount = riverCount - offeredAmount;
      steps.push({ stage: i, atRiver: riverCount, atTemple: templeCount });
      currentCount = Math.max(0, templeCount);
    }
    return steps;
  }, [initialFlowers, offeredAmount, level.stages]);

  const finalBalance = journeySteps[journeySteps.length - 1]?.atTemple || 0;
  const hasZeroEarly = journeySteps.slice(0, -1).some(s => s.atTemple <= 0);
  const isLevelSolved = isInputReady && finalBalance === 0 && !hasZeroEarly;

  const currentDisplayCount = useMemo(() => {
    if (activeStep === -1) return initialFlowers;
    const stageIdx = Math.floor(activeStep / 2);
    return activeStep % 2 !== 0 ? journeySteps[stageIdx].atTemple : journeySteps[stageIdx].atRiver;
  }, [activeStep, initialFlowers, journeySteps]);

  // Viewport tracking logic
  useEffect(() => {
    if (scrollContainerRef.current) {
      if (activeStep <= 1) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (activeNodeRef.current) {
        activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeStep]);

  const speak = useCallback((text) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [isMuted]);

  const startJourney = useCallback(async () => {
    if (!isInputReady || isProcessing) return;
    
    // Mark as simulated for these specific values
    lastSimInputs.current = { flow: initialFlowers, offering: offeredAmount };
    
    setIsProcessing(true);
    setIsCorrect(false);
    
    for (let i = -1; i < level.stages * 2; i++) {
      setActiveStep(i);
      if (i >= 1 && i % 2 !== 0) {
        const sIdx = Math.floor(i / 2);
        if (journeySteps[sIdx].atTemple <= 0 && sIdx < level.stages - 1) {
          speak("Exhausted flowers early.");
          break;
        }
      }
      await new Promise(r => setTimeout(r, 900));
    }
    
    if (isLevelSolved) {
      setIsCorrect(true);
      speak("Equilibrium achieved.");
    }
    setIsProcessing(false);
  }, [isInputReady, isProcessing, level.stages, journeySteps, isLevelSolved, speak, initialFlowers, offeredAmount]);

  // Automated one-time trigger
  useEffect(() => {
    const isNew = lastSimInputs.current.flow !== initialFlowers || 
                 lastSimInputs.current.offering !== offeredAmount;
    
    if (isInputReady && isNew && !isProcessing) {
      const timer = setTimeout(startJourney, 1200);
      return () => clearTimeout(timer);
    }
  }, [initialFlowers, offeredAmount, startJourney, isInputReady, isProcessing]);

  const resetPuzzle = useCallback(() => {
    setInitialFlowers(0);
    setOfferedAmount(0);
    setIsCorrect(false);
    setActiveStep(-1);
    setIsProcessing(false);
    setFormulas([]);
    lastSimInputs.current = { flow: -1, offering: -1 };
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  const goToNextLevel = useCallback(() => {
    setCurrentLevel(prev => (prev + 1) % PUZZLE_LEVELS.length);
    resetPuzzle();
  }, [resetPuzzle]);

  const runExplanation = useCallback(() => {
    const lines = [`Start Bouquet: ${initialFlowers}`];
    journeySteps.forEach(s => {
      lines.push(`S${s.stage}: (${s.atRiver/2}×2) - ${offeredAmount} = ${s.atTemple}`);
    });
    setFormulas(lines);
    setExplanationText("The flowers must hit zero exactly at the final temple.");
    setIsExplaining(true);
  }, [initialFlowers, offeredAmount, journeySteps]);

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] overflow-hidden relative shadow-inner p-1 sm:p-4">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
      {/* HEADER - Compact shrink-0 */}
      <div className="w-full max-w-4xl flex justify-between items-center px-1 shrink-0 z-50 py-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-11 sm:h-11 bg-[#3e2723] rounded-lg shadow-lg flex items-center justify-center text-white">
            <UserIcon size={16} />
          </div>
          <div>
            <h1 className="text-[11px] sm:text-lg font-black uppercase text-[#3e2723] leading-none">{level.title}</h1>
            <p className="text-[8px] sm:text-xs font-black text-[#8d6e63] uppercase leading-none mt-1">Logic Lab</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30"><HelpCircle size={14} /></button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2 bg-[#faf9f6] text-[#3e2723] rounded-lg border border-[#c4a484]/30">{isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}</button>
          <button onClick={resetPuzzle} className="p-1.5 sm:p-2 bg-[#3e2723] text-white rounded-lg active:scale-95"><RefreshCcw size={14} /></button>
        </div>
      </div>

      {/* MONITOR - Compact shrink-0 */}
      <div className="w-full max-w-4xl bg-[#faf9f6] rounded-[1rem] sm:rounded-[2rem] p-2 sm:p-4 border-2 border-[#c4a484]/40 shadow-xl shrink-0 my-1">
        <div className="grid grid-cols-2 gap-2 sm:gap-6">
          <div className="p-1.5 sm:p-3 rounded-xl border-2 border-[#c4a484]/30 bg-[#e6dccb]/10 flex flex-col items-center">
            <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase">In Hand</span>
            <div className="text-xl sm:text-4xl font-black text-[#3e2723] flex items-center gap-1">
              <motion.span key={currentDisplayCount} initial={{ y: 3, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>{currentDisplayCount}</motion.span>
              <Flower size={16} className="text-pink-400" />
            </div>
          </div>
          <div className={`p-1.5 sm:p-3 rounded-xl border-2 transition-all flex flex-col items-center ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-[#e6dccb]/10 border-[#c4a484]/30'}`}>
            <span className="text-[10px] sm:text-sm font-black text-[#8d6e63] uppercase">Output</span>
            <div className={`text-xl sm:text-4xl font-black ${isCorrect ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{finalBalance}</div>
          </div>
        </div>
      </div>

      {/* JOURNEY PATH - flex-1 min-h-0 allows this to shrink */}
      <div className="flex-1 w-full max-w-4xl bg-[#3e2723] p-1 rounded-[1rem] sm:rounded-[2.5rem] shadow-2xl border-b-4 border-black min-h-0 overflow-hidden relative mb-1">
        <div 
          ref={scrollContainerRef}
          className="h-full w-full bg-[#4e342e] rounded-[0.8rem] sm:rounded-[2rem] border-2 border-dashed border-[#8d6e63]/20 flex items-center justify-start overflow-x-auto custom-scrollbar relative px-4"
        >
          <div className="flex items-center min-w-max gap-2 sm:gap-6 pt-12 pb-4">
            {/* START GATE */}
            <div ref={activeStep <= 0 ? activeNodeRef : null} className="flex flex-col items-center shrink-0 relative px-4">
              <AnimatePresence>
                {activeStep === -1 && (
                  <motion.div layoutId="priest" className="absolute -top-14 sm:-top-20 z-50 flex flex-col items-center">
                    <div className="relative">
                      <UserIcon size={30} className="text-yellow-400 drop-shadow-[0_0_10px_gold]" strokeWidth={3} />
                      <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[9px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
                    </div>
                    <div className="text-[9px] font-black bg-yellow-500 text-black px-1 rounded uppercase mt-1">Ready</div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-sm sm:text-3xl border-2 transition-all ${activeStep === -1 ? 'bg-yellow-500/20 border-yellow-400' : 'bg-white/5 border-white/10'}`}>
                {initialFlowers}
              </div>
              <span className="text-[10px] font-black text-[#c4a484] uppercase mt-1">Start</span>
            </div>

            {journeySteps.map((step, idx) => {
              const rIdx = idx * 2;
              const tIdx = idx * 2 + 1;
              return (
                <React.Fragment key={idx}>
                  <div className="self-center mt-[-30px] opacity-10"><ArrowRight size={16} /></div>
                  <div className="flex flex-col items-center shrink-0 bg-[#faf9f6]/5 p-1.5 sm:p-4 rounded-[1rem] sm:rounded-[2rem] border border-white/10 relative">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8d6e63] px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase shadow-lg">Station 0{step.stage}</div>
                    <div className="flex items-center gap-1 sm:gap-3">
                      {/* RIVER */}
                      <div ref={activeStep === rIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
                        <AnimatePresence>
                          {activeStep === rIdx && (
                            <motion.div layoutId="priest" className="absolute -top-14 sm:-top-20 z-50 flex flex-col items-center">
                              <div className="relative">
                                <UserIcon size={30} className="text-blue-400 drop-shadow-[0_0_15px_cyan]" strokeWidth={3} />
                                <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[9px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === rIdx ? 'bg-blue-500/40 border-blue-400 scale-110 shadow-2xl' : 'bg-blue-500/10 border-blue-500/20'}`}>
                           <Waves size={20} className={activeStep === rIdx ? 'text-white' : 'text-blue-400/40'} />
                           <span className="text-[8px] font-black">×2</span>
                        </div>
                        <span className="text-[10px] font-black text-blue-300">{step.atRiver}</span>
                      </div>
                      <div className="opacity-10 self-center"><ArrowRight size={12} /></div>
                      {/* TEMPLE */}
                      <div ref={activeStep === tIdx ? activeNodeRef : null} className="flex flex-col items-center relative">
                        <AnimatePresence>
                          {activeStep === tIdx && (
                            <motion.div layoutId="priest" className="absolute -top-14 sm:-top-20 z-50 flex flex-col items-center">
                              <div className="relative">
                                <UserIcon size={30} className="text-amber-400 drop-shadow-[0_0_15px_orange]" strokeWidth={3} />
                                <div className="absolute -right-4 -top-2 bg-white text-[#3e2723] rounded-full px-1.5 py-0.5 text-[9px] font-black border border-[#3e2723]">{currentDisplayCount}</div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className={`w-10 h-10 sm:w-16 sm:h-16 rounded-xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${activeStep === tIdx ? 'bg-amber-500/40 border-amber-400 scale-110 shadow-2xl' : 'bg-amber-500/10 border-amber-500/20'}`}>
                           <TempleIcon size={18} className={activeStep === tIdx ? 'text-white' : 'text-amber-400/40'} />
                           <span className="text-[8px] font-black">-{offeredAmount}</span>
                        </div>
                        <span className={`text-[10px] font-black ${step.atTemple <= 0 && idx < level.stages - 1 ? 'text-red-400' : 'text-amber-300'}`}>{step.atTemple}</span>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* INPUTS - Compact shrink-0 */}
      <div className="w-full max-w-4xl bg-[#3e2723] p-1.5 sm:p-4 rounded-[1rem] sm:rounded-[2.5rem] border-4 border-black shadow-2xl shrink-0 my-1 relative">
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-5 py-0.5 rounded-full text-[9px] sm:text-xs font-black uppercase border-2 border-[#3e2723]">Neural Input</div>
        <div className="grid grid-cols-2 gap-2 sm:gap-6 mt-1">
          <div className="bg-[#faf9f6]/10 p-1.5 sm:p-3 rounded-xl flex flex-col items-center gap-0.5 border border-white/5">
            <span className="text-[10px] sm:text-sm font-black uppercase text-[#c4a484]">Start Flow</span>
            <input 
              type="number" value={initialFlowers || ''} 
              onChange={(e) => setInitialFlowers(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full max-w-[45px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-3xl font-black text-[#3e2723]"
              placeholder="?"
            />
            <div className="flex gap-1 w-full">
              <button onClick={() => setInitialFlowers(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-[12px]">-</button>
              <button onClick={() => setInitialFlowers(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-emerald-500 text-white rounded font-black text-[12px]">+</button>
            </div>
          </div>
          <div className="bg-[#faf9f6]/10 p-1.5 sm:p-3 rounded-xl flex flex-col items-center gap-0.5 border border-white/5">
            <span className="text-[10px] sm:text-sm font-black uppercase text-[#c4a484]">Offering</span>
            <input 
              type="number" value={offeredAmount || ''} 
              onChange={(e) => setOfferedAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full max-w-[45px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-lg text-center text-sm sm:text-3xl font-black text-[#3e2723]"
              placeholder="?"
            />
            <div className="flex gap-1 w-full">
              <button onClick={() => setOfferedAmount(p => Math.max(0, p - 1))} className="flex-1 py-1 sm:py-2 bg-[#e6dccb] text-[#3e2723] rounded font-black text-[12px]">-</button>
              <button onClick={() => setOfferedAmount(p => p + 1)} className="flex-1 py-1 sm:py-2 bg-amber-500 text-white rounded font-black text-[12px]">+</button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER - shrink-0 */}
      <div className="w-full max-w-4xl flex gap-2 shrink-0 pb-1">
        <button onClick={isCorrect ? goToNextLevel : () => setActiveStep(-1)} className={`flex-1 py-2 sm:py-4 rounded-xl sm:rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg border-b-4 transition-all ${isCorrect ? 'bg-indigo-600 text-white border-indigo-900 shadow-indigo-200' : 'bg-[#3e2723] text-[#c4a484] border-black active:translate-y-1'}`}>
          {isProcessing ? <Timer size={14} className="animate-spin" /> : isCorrect ? <ArrowRightCircle size={14} /> : <RefreshCcw size={14} />}
          <span className="text-[10px] sm:text-base uppercase tracking-tight">{isCorrect ? 'Next Level' : 'Re-Run Path'}</span>
        </button>
        <button onClick={runExplanation} className="flex-1 py-2 sm:py-4 bg-[#8d6e63] text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-base shadow-lg border-b-4 border-[#3e2723]">Logic Insight</button>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-5 sm:p-10 border-4 border-[#3e2723]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg"><X size={18} /></button>
              <div className="flex items-center gap-3 mb-4 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
                  <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
                  <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Mission Briefing</h2>
              </div>
              <div className="space-y-2 sm:space-y-4 max-h-[45vh] overflow-y-auto no-scrollbar pr-1 text-[#5d4037]">
                {[
                  { text: `Priest visits ${level.stages} stations sequentially.`, icon: "🚶" },
                  { text: "At every River, bouquet size instantly doubles (×2).", icon: "🌊" },
                  { text: "At every Temple, offer a fixed number of flowers.", icon: "⛩️" },
                  { text: "Rule: Bouquet must not reach 0 before the last temple.", icon: "⚠️" },
                  { text: "Goal: Balance exactly at 0 after the final offering.", icon: "🎯" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start bg-[#e6dccb]/30 p-3 sm:p-4 rounded-xl border border-[#c4a484]/10 shadow-inner">
                    <span className="w-6 h-6 sm:w-10 sm:h-10 rounded-lg bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
                    <p className="text-[10px] sm:text-lg font-bold leading-tight pt-0.5 sm:pt-1.5">{item.text}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowInstructions(false)} className="w-full mt-4 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Accept Ritual</button>
            </motion.div>
          </motion.div>
        )}
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
            <div className="w-full max-w-sm h-fit max-h-[80vh] bg-[#faf9f6] rounded-[1.5rem] p-4 border-4 border-[#3e2723] overflow-y-auto no-scrollbar relative shadow-2xl">
              <button onClick={() => setIsExplaining(false)} className="absolute top-2 right-2"><X size={16} /></button>
              <div className="bg-[#3e2723] p-3 rounded-xl mb-4 mt-6 text-center">
                {formulas.map((line, idx) => (
                  <p key={idx} className="text-[10px] sm:text-sm font-mono text-[#c4a484] leading-tight mb-1.5">{line}</p>
                ))}
              </div>
              <p className="text-[10px] sm:text-sm font-bold text-[#3e2723] italic opacity-80 uppercase tracking-tighter">"{explanationText}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
       .custom-scrollbar::-webkit-scrollbar { height: 6px; }
       .custom-scrollbar::-webkit-scrollbar-track { background: rgba(62, 39, 35, 0.1); border-radius: 10px; }
       .custom-scrollbar::-webkit-scrollbar-thumb { background: #8d6e63; border-radius: 10px; border: 1px solid #3e2723; }
       input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
       input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}