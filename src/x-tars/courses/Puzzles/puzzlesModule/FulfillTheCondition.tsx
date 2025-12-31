import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 RefreshCcw, CheckCircle2,
 ChevronRight, Shuffle,
 FastForward, Scale,
 Trophy, Sparkles, Volume2, VolumeX,
 XCircle, Timer, Info, X, Equal, Plus, Minus, Target,
 ClipboardList, Droplets, PawPrint, ShoppingBag, Weight, Hammer, Apple
} from 'lucide-react';


const PUZZLES = [
 {
   id: 'dairy',
   title: 'The Dairy Farm',
   subtitle: 'Animal & Milk Constraint',
   targetVal: 100,
   unit: 'L',
   unitName: 'Milk',
   groupName: 'Barn Notes',
   groupIcon: <PawPrint size={16} />,
   items: [
     { id: 'item1', name: 'Cow', icon: '🐄', yield: 5 },
     { id: 'item2', name: 'Buffalo', icon: '🐂', yield: 2 },
     { id: 'item3', name: 'Goat', icon: '🐐', yield: 0.25 },
   ],
   solutionText: "11 Cows, 13 Buffaloes, and 76 Goats."
 },
 {
   id: 'hardware',
   title: 'Hardware Shop',
   subtitle: 'Mass & Quantity Balance',
   targetVal: 50,
   unit: 'g',
   unitName: 'Weight',
   groupName: 'Stock Sheet',
   groupIcon: <Hammer size={16} />,
   items: [
     { id: 'item1', name: 'Bolt', icon: '🔩', yield: 5 },
     { id: 'item2', name: 'Nut', icon: '⚙️', yield: 1 },
     { id: 'item3', name: 'Washer', icon: '⭕', yield: 0.1 },
   ],
   solutionText: "9 Bolts, 1 Nut, and 40 Washers."
 },
 {
   id: 'orchard',
   title: 'Fruit Orchard',
   subtitle: 'Harvest & Volume Goal',
   targetVal: 60,
   unit: 'u',
   unitName: 'Volume',
   groupName: 'Farmer Log',
   groupIcon: <Apple size={16} />,
   items: [
     { id: 'item1', name: 'Melon', icon: '🍉', yield: 6 },
     { id: 'item2', name: 'Pineapple', icon: '🍍', yield: 4 },
     { id: 'item3', name: 'Apple', icon: '🍎', yield: 0.5 },
   ],
   solutionText: "1 Melon, 7 Pineapples, and 52 Apples."
 }
];


export default function App() {
 // --- App Progress State ---
 const [currentLevel, setCurrentLevel] = useState(0);
 const puzzle = PUZZLES[currentLevel];


 // --- Puzzle Counts ---
 const [counts, setCounts] = useState({ item1: 0, item2: 0, item3: 0 });
  // App Logic State
 const [isCorrect, setIsCorrect] = useState(false);
 const [isMuted, setIsMuted] = useState(false);
 const [autoNextTimer, setAutoNextTimer] = useState(null);
  // Explanation States
 const [isExplaining, setIsExplaining] = useState(false);
 const [activeHighlight, setActiveHighlight] = useState(null);
 const [explanationText, setExplanationText] = useState("");
 const [formulas, setFormulas] = useState([]);


 const timerIntervalRef = useRef(null);


 // --- Derived Math ---
 const currentTotalItems = Object.values(counts).reduce((a, b) => a + b, 0);
 const currentTotalYield =
   (counts.item1 * puzzle.items[0].yield) +
   (counts.item2 * puzzle.items[1].yield) +
   (counts.item3 * puzzle.items[2].yield);
  const isItemsTargetMet = currentTotalItems === puzzle.targetVal;
 const isYieldTargetMet = currentTotalYield === puzzle.targetVal;
 const isLevelSolved = isItemsTargetMet && isYieldTargetMet;


 const speak = useCallback((text) => {
   if (isMuted) return Promise.resolve();
   return new Promise((resolve) => {
     window.speechSynthesis.cancel();
     const utterance = new SpeechSynthesisUtterance(text);
     utterance.rate = 0.95;
     const timeout = setTimeout(resolve, 5000);
     utterance.onend = () => { clearTimeout(timeout); resolve(); };
     utterance.onerror = () => { clearTimeout(timeout); resolve(); };
     window.speechSynthesis.speak(utterance);
   });
 }, [isMuted]);


 const resetPuzzle = useCallback(() => {
   setCounts({ item1: 0, item2: 0, item3: 0 });
   setIsCorrect(false);
   setAutoNextTimer(null);
   setIsExplaining(false);
   setFormulas([]);
 }, []);


 const goToNextLevel = useCallback(() => {
   setCurrentLevel(prev => (prev + 1) % PUZZLES.length);
   resetPuzzle();
 }, [resetPuzzle]);


 // Adjust count via buttons (+/-)
 const adjustCount = (id, amount) => {
   if (isCorrect) return;
   setCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] + amount) }));
 };


 // Adjust count via direct input
 const handleDirectInput = (id, value) => {
   if (isCorrect) return;
   const numValue = parseInt(value, 10);
   setCounts(prev => ({
     ...prev,
     [id]: isNaN(numValue) ? 0 : Math.max(0, numValue)
   }));
 };


 // Level Win Monitoring
 useEffect(() => {
   if (isLevelSolved && !isCorrect) {
     setIsCorrect(true);
     setAutoNextTimer(10);
     speak(`Excellent! You have solved ${puzzle.title} by hitting both targets.`);
   }
 }, [isLevelSolved, isCorrect, speak, puzzle.title]);


 const runExplanation = async () => {
   setFormulas([
     `Target A: Total Items = ${puzzle.targetVal}`,
     `Target B: Total ${puzzle.unitName} = ${puzzle.targetVal}${puzzle.unit}`,
     `Yields: ${puzzle.items[0].yield}, ${puzzle.items[1].yield}, ${puzzle.items[2].yield}`
   ]);


   setIsExplaining(true);
   setExplanationText(`We must find a combination of items that satisfy both constraints.`);
   await speak(`We must find a combination of items that satisfy both constraints.`);
  
   setActiveHighlight('items');
   setExplanationText(`First, the sum of all three types of items must be exactly ${puzzle.targetVal}.`);
   await speak(`First, the sum of all three types of items must be exactly ${puzzle.targetVal}.`);


   setActiveHighlight('yield');
   setExplanationText(`Second, their total ${puzzle.unitName} production must be ${puzzle.targetVal} ${puzzle.unit}.`);
   await speak(`Second, their total production must equal ${puzzle.targetVal} ${puzzle.unit}.`);


   setActiveHighlight('math');
   setExplanationText(`The solution is: ${puzzle.solutionText}`);
   await speak(`The solution for this puzzle is ${puzzle.solutionText}`);


   setActiveHighlight(null);
 };


 useEffect(() => {
   if (autoNextTimer !== null && autoNextTimer > 0) {
     timerIntervalRef.current = setInterval(() => {
       setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
     }, 1000);
   } else if (autoNextTimer === 0) {
     goToNextLevel();
   }
   return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
 }, [autoNextTimer, goToNextLevel]);


 return (
   <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
    
     {/* HEADER */}
     <div className="w-full max-w-5xl flex justify-between items-center px-2 py-1 z-50 mb-1">
       <div className="flex items-center gap-2">
         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
           <Scale size={24} />
         </div>
         <div>
           <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">{puzzle.title}</h1>
           <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">{puzzle.subtitle}</p>
         </div>
       </div>


       <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
           <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
               {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
           </button>
           <button onClick={resetPuzzle} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
               <RefreshCcw size={16} />
           </button>
       </div>
     </div>


     {/* SECTION 1: THE LAB STAGE */}
     <div className="flex-1 w-full max-w-5xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
       <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
      
       <div className="relative w-full flex flex-col items-center mt-4 sm:mt-10 z-20 px-4">
          
           {/* MISSION DASHBOARD */}
           <div className="w-full max-w-2xl bg-[#fdfaf5]/40 backdrop-blur-sm rounded-[2.5rem] p-3 sm:p-5 border-2 border-[#8d6e63]/20 shadow-inner mb-4 sm:mb-10">
               <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                   <Target size={16} className="text-[#8d6e63]" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8d6e63]">Mission Dashboard</span>
               </div>
              
               <div className="grid grid-cols-2 gap-3 sm:gap-6">
                   {/* ASKS 1: ITEMS */}
                   <div className={`relative overflow-hidden p-3 sm:p-6 rounded-[2rem] border-2 transition-all bg-white ${isItemsTargetMet ? 'border-emerald-500 shadow-emerald-200/50' : 'border-[#8d6e63]/30 shadow-md'}`}>
                       <div className="flex flex-col items-center relative z-10">
                           <ShoppingBag size={20} className={isItemsTargetMet ? 'text-emerald-500' : 'text-[#a88a6d]'} />
                           <span className="text-[8px] sm:text-[10px] font-black uppercase text-[#a88a6d] mt-2">Target: Total Items</span>
                           <div className="flex items-baseline gap-1 mt-1">
                               <span className={`text-xl sm:text-5xl font-black ${isItemsTargetMet ? 'text-emerald-600' : 'text-[#5d4037]'}`}>{currentTotalItems}</span>
                               <span className="text-[10px] sm:text-xl font-bold text-[#a88a6d]">/ {puzzle.targetVal}</span>
                           </div>
                       </div>
                   </div>


                   {/* ASKS 2: YIELD */}
                   <div className={`relative overflow-hidden p-3 sm:p-6 rounded-[2rem] border-2 transition-all bg-white ${isYieldTargetMet ? 'border-blue-500 shadow-blue-200/50' : 'border-[#8d6e63]/30 shadow-md'}`}>
                       <div className="flex flex-col items-center relative z-10">
                           <Weight size={20} className={isYieldTargetMet ? 'text-blue-500' : 'text-[#a88a6d]'} />
                           <span className="text-[8px] sm:text-[10px] font-black uppercase text-[#a88a6d] mt-2">Target: Total {puzzle.unitName}</span>
                           <div className="flex items-baseline gap-1 mt-1">
                               <span className={`text-xl sm:text-5xl font-black ${isYieldTargetMet ? 'text-blue-600' : 'text-[#5d4037]'}`}>{currentTotalYield % 1 === 0 ? currentTotalYield : currentTotalYield.toFixed(2)}</span>
                               <span className="text-[10px] sm:text-xl font-bold text-[#a88a6d]">/ {puzzle.targetVal}{puzzle.unit}</span>
                           </div>
                       </div>
                   </div>
               </div>
           </div>


           {/* LAB NOTES */}
           <div className="bg-gradient-to-br from-[#8d6e63] to-[#5d4037] p-1 rounded-3xl shadow-2xl border-b-4 border-[#3e2723] w-full max-w-lg">
               <div className="bg-[#4e342e] p-3 sm:p-6 rounded-2xl border-2 border-dashed border-[#8d6e63]/50 flex flex-col items-center">
                   <div className="flex items-center gap-2 mb-2 sm:mb-4 border-b border-[#8d6e63]/30 w-full justify-center pb-2">
                       {puzzle.groupIcon}
                       <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/80">{puzzle.groupName}</span>
                   </div>
                   <div className="grid grid-cols-3 gap-2 sm:gap-12 w-full">
                       {puzzle.items.map(item => (
                         <div key={item.id} className="flex flex-col items-center px-1 sm:px-4">
                             <span className="text-xl sm:text-3xl filter drop-shadow-md">{item.icon}</span>
                             <span className="text-[7px] sm:text-[8px] font-black text-[#a88a6d] uppercase mt-1">{item.name}</span>
                             <span className="text-xs sm:text-xl font-black text-white">{item.yield}{puzzle.unit}</span>
                         </div>
                       ))}
                   </div>
               </div>
           </div>
       </div>


       {/* PROGRESS ZONE */}
       <div className="absolute bottom-4 left-0 w-full flex flex-col items-center gap-3 pointer-events-none px-4">
           <AnimatePresence mode="wait">
               {isCorrect ? (
                   <motion.div key="win" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-emerald-600 text-white py-3 px-10 rounded-full shadow-2xl flex items-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm pointer-events-auto">
                       <Trophy size={24} className="animate-bounce" />
                       <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Level Complete! Both Targets Met!</span>
                       <Sparkles size={20} className="text-yellow-300" />
                   </motion.div>
               ) : (
                   <motion.div key="neutral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-[2rem] shadow-xl font-bold uppercase tracking-widest text-[10px] sm:text-sm text-[#8d6e63] border-2 border-[#8d6e63]/20 flex items-center gap-3">
                       <Info size={16} /> Balance the counts to reach {puzzle.targetVal} / {puzzle.targetVal}.
                   </motion.div>
               )}
           </AnimatePresence>
       </div>
     </div>


     {/* SECTION 2: CONTROLS WITH DIRECT INPUT */}
     <div className="w-full max-w-5xl flex flex-col items-center mt-3 z-50 mb-2">
       <div className="bg-[#dfd7cc] p-3 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full shadow-2xl relative">
           <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-8 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 border-[#e6dccb] shadow-md">Resource Management</div>
          
           <div className="grid grid-cols-3 gap-3 sm:gap-8">
               {puzzle.items.map(item => (
                 <div key={item.id} className="bg-white/40 p-2 sm:p-5 rounded-3xl border-2 border-white shadow-inner flex flex-col items-center gap-1 sm:gap-2">
                     <div className="relative">
                       <span className="text-2xl sm:text-5xl drop-shadow-md">{item.icon}</span>
                     </div>
                     <span className="text-[8px] sm:text-[10px] font-black uppercase text-[#8d6e63] tracking-wider">{item.name}s</span>
                    
                     {/* DIRECT INPUT FIELD */}
                     <input
                       type="number"
                       value={counts[item.id]}
                       onChange={(e) => handleDirectInput(item.id, e.target.value)}
                       className="w-full max-w-[60px] sm:max-w-[100px] bg-white border-2 border-[#c4a484] rounded-xl py-1 sm:py-2 text-center text-lg sm:text-3xl font-black text-[#5d4037] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none shadow-sm appearance-none"
                     />


                     <div className="flex gap-1 sm:gap-2 w-full">
                         <button onClick={() => adjustCount(item.id, -1)} className="flex-1 py-2 sm:py-3 bg-[#f1f0ee] rounded-xl shadow-sm border-b-4 border-gray-300 active:translate-y-1 active:border-0 text-[#8d6e63] font-black transition-all hover:bg-white">-</button>
                         <button onClick={() => adjustCount(item.id, 1)} className="flex-1 py-2 sm:py-3 bg-white rounded-xl shadow-md border-b-4 border-[#c4a484] active:translate-y-1 active:border-0 text-[#5d4037] font-black transition-all hover:scale-105">+</button>
                     </div>
                 </div>
               ))}
           </div>
       </div>
     </div>


     {/* NAVIGATION BAR */}
     <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-2">
         <button onClick={resetPuzzle} className={`relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
           <div className="flex items-center gap-3 z-10">
             <div className="bg-white/10 p-1.5 sm:p-3 rounded-2xl"><ChevronRight size={20} /></div>
             <div className="leading-tight uppercase tracking-tighter text-[10px] sm:text-lg">{autoNextTimer !== null ? 'NEXT LEVEL NOW' : 'RESET LAB'}</div>
           </div>
           <div className="flex items-center relative z-10">
             {autoNextTimer !== null ? (
               <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-3 sm:px-6 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[80px] sm:min-w-[200px]">
                 <div className="flex items-center gap-1 shrink-0"><Timer size={14} className="animate-spin text-indigo-300" /><span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span></div>
                 <div className="flex justify-between w-full px-2 relative">
                     {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>🧩</div>))}
                     <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-xs sm:text-2xl pointer-events-none">🏃</motion.div>
                 </div>
               </div>
             ) : <FastForward className="opacity-30 w-6 h-6 sm:w-8 sm:h-8" />}
           </div>
         </button>
        
         <button onClick={runExplanation} className="flex items-center justify-center gap-2 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
           <Info size={18} />
           <span className="uppercase tracking-tighter text-[10px] sm:text-lg">Logic Breakdown</span>
         </button>
     </div>


     {/* EXPLANATION MODAL */}
     <AnimatePresence>
       {isExplaining && (
         <motion.div
           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
           className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-md p-4"
         >
           <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col items-center p-6 sm:p-10 border-[8px] border-[#8d6e63]">
             <button
               onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
               className="absolute top-6 right-6 p-4 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-lg"
             >
               <X size={28} />
             </button>


             <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter mb-4 sm:mb-8 text-[#5d4037]">Logic Breakdown</h2>


             <div className="w-full space-y-4 sm:space-y-6">
               <div className="w-full bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-4 sm:p-8 rounded-[2.5rem] border-4 border-[#8d6e63] shadow-2xl text-center">
                 <div className="space-y-3 sm:space-y-4 min-h-[120px] sm:min-h-[160px] flex flex-col justify-center">
                   {formulas.map((line, idx) => (
                     <motion.p key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                       className={`text-base sm:text-3xl font-black tracking-tight font-mono drop-shadow-md leading-tight text-yellow-100/70`}
                     >
                       {line}
                     </motion.p>
                   ))}
                 </div>
               </div>


               <div className="w-full bg-white/60 p-4 sm:p-10 rounded-[2.5rem] border-2 border-[#8d6e63]/20 shadow-inner text-center min-h-[80px] sm:min-h-[120px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p key={explanationText} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                      className="text-sm sm:text-2xl font-bold text-[#5d4037] leading-tight"
                    >
                      {explanationText}
                    </motion.p>
                  </AnimatePresence>
               </div>
             </div>


             <div className="mt-6 sm:mt-10">
                <button onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }} className="px-10 sm:px-14 py-3 sm:py-4 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20 text-sm sm:text-xl">I Understand!</button>
             </div>
           </div>
         </motion.div>
       )}
     </AnimatePresence>


     <style>{`
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       /* Hide arrows in number inputs */
       input::-webkit-outer-spin-button,
       input::-webkit-inner-spin-button {
         -webkit-appearance: none;
         margin: 0;
       }
       input[type=number] {
         -moz-appearance: textfield;
       }
     `}</style>
   </div>
 );
}