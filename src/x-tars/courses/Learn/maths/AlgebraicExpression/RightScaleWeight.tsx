import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  ChevronRight, Timer, Info, X, 
  Equal, Trophy, Sparkles, Volume2, VolumeX,
  Target, ClipboardList, ShoppingBag, Weight, 
  Apple, ArrowRight, Scale, FastForward, Calculator
} from 'lucide-react';

const MISSIONS = [
  {
    id: 1,
    title: 'Fruit Mix',
    leftSide: [
      { icon: '🍎', name: 'Apple', count: 3, unitWeight: 5 },
      { icon: '🍊', name: 'Orange', count: 2, unitWeight: 8 }
    ],
    knownWeight: 0
  },
  {
    id: 2,
    title: 'Berry Batch',
    leftSide: [
      { icon: '🍓', name: 'Strawberry', count: 5, unitWeight: 4 },
      { icon: '🍋', name: 'Lemon', count: 3, unitWeight: 10 }
    ],
    knownWeight: 0
  },
  {
    id: 3,
    title: 'The Mixed Cargo',
    leftSide: [
      { icon: '🍐', name: 'Pear', count: 4, unitWeight: 6 }
    ],
    knownWeight: 15 
  },
  {
    id: 4,
    title: 'Balanced Load',
    leftSide: [
      { icon: '🍎', name: 'Apple', count: 1, unitWeight: 5 },
      { icon: '🍐', name: 'Pear', count: 2, unitWeight: 6 }
    ],
    knownWeight: 20 
  }
];

// Unified Weight Block Component for visual consistency across Pan and Log
const WeightBlock = ({ weight, size = "large" }) => (
  <motion.div 
    initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }}
    className={`bg-slate-700 text-white rounded-xl flex items-center justify-center font-black shadow-2xl border-b-8 border-black/40 ring-4 ring-slate-800/30 shrink-0 z-10 mx-1
      ${size === "large" ? "w-14 h-14 sm:w-24 sm:h-24 text-xs sm:text-2xl" : "w-10 h-10 sm:w-16 sm:h-16 text-[8px] sm:text-lg"}`}
  >
    <div className="flex flex-col items-center">
      <Weight size={size === "large" ? 16 : 10} className="mb-1 opacity-50" />
      {weight}g
    </div>
  </motion.div>
);

export default function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const mission = MISSIONS[levelIndex];
  
  // Logic State
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  
  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);

  const timerIntervalRef = useRef(null);

  // Calculate Correct Answer based on Left Side contents
  const calculateTotal = useCallback(() => {
    const fruitTotal = mission.leftSide.reduce((sum, item) => sum + (item.count * item.unitWeight), 0);
    return fruitTotal + mission.knownWeight;
  }, [mission]);

  const speak = useCallback((text) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, [isMuted]);

  const handleNext = useCallback(() => {
    setLevelIndex((prev) => (prev + 1) % MISSIONS.length);
    setUserInput("");
    setIsCorrect(false);
    setIsError(false);
    setAutoNextTimer(null);
  }, []);

  const handleCheck = () => {
    if (!userInput || isCorrect) return;

    const total = calculateTotal();
    if (Number(userInput) === total) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
      speak(`Excellent! The total weight on the right scale is ${total} grams.`);
    } else {
      setIsError(true);
      speak("Not quite. Check the weights again!");
      setTimeout(() => setIsError(false), 500);
    }
  };

  const runExplanation = async () => {
    const total = calculateTotal();
    
    // Exact phrasing requested by user
    const steps = [
      "Total weight on right scale = Total weight of left scale as it is balanced scale"
    ];
    
    mission.leftSide.forEach(item => {
      steps.push(`${item.count} ${item.name}s × ${item.unitWeight}g = ${item.count * item.unitWeight}g`);
    });
    
    if (mission.knownWeight > 0) {
      steps.push(`Known Weight Block = ${mission.knownWeight}g`);
    }

    steps.push(`Total left balance = ${total}`);
    steps.push(`So, right scale weight = ${total}`);
    
    setFormulas(steps);
    setIsExplaining(true);

    const line1 = "Total weight on right scale = Total weight of left scale as it is balanced scale";
    setExplanationText(line1);
    await speak(line1);

    const line2 = `Total left balance = ${total}, So, right scale weight = ${total}`;
    setExplanationText(line2);
    await speak(line2);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, handleNext]);

  const targetTotalWeight = calculateTotal();

  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center px-2 py-1 z-50 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Discovery</h1>
            <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Mission #{mission.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={handleNext} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* SECTION 1: THE LAB STAGE */}
      <div className="flex-1 w-full max-w-5xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.45] sm:scale-[0.75] origin-top transition-transform overflow-visible mt-16 sm:mt-24">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <div className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LEFT PAN */}
                    <div className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8 px-2 overflow-visible">
                            <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible max-h-[140px]">
                                {mission.knownWeight > 0 && <WeightBlock weight={mission.knownWeight} size="large" />}
                                {mission.leftSide.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      {[...Array(item.count)].map((_, i) => (
                                          <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl sm:text-6xl drop-shadow-lg shrink-0">{item.icon}</motion.div>
                                      ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT PAN */}
                    <div className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <motion.div 
                                animate={isCorrect ? { scale: 1.1, rotate: 3 } : {}}
                                className={`bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30 transition-all duration-500 ${!isCorrect && 'grayscale-[0.3]'}`}
                             >
                                {isCorrect ? targetTotalWeight : '?'}
                             </motion.div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{isCorrect ? targetTotalWeight + 'g' : 'Target'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEEDBACK OVERLAY */}
        <div className="absolute bottom-6 w-full flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {isCorrect ? (
                    <motion.div key="win" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm pointer-events-auto">
                        <Trophy size={24} className="animate-bounce" />
                        <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Success! Balance Achieved!</span>
                    </motion.div>
                ) : (
                    <motion.div key="ask" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-xl font-bold uppercase tracking-widest text-[9px] sm:text-sm text-[#8d6e63] border-2 border-[#8d6e63]/20 flex items-center gap-2">
                        <Calculator size={16} /> Total the Left to Discover the Right!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: DISCOVERY CONSOLE */}
      <div className="w-full max-w-5xl flex flex-col items-center mt-2 z-50 mb-1">
        <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb] shadow-md">Lab Control Center</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* UNIT WEIGHT LOG */}
                <div className="bg-gradient-to-br from-[#8d6e63] to-[#5d4037] p-1 rounded-[2rem] shadow-xl border-b-4 border-[#3e2723]">
                    <div className="bg-[#4e342e] p-4 sm:p-5 rounded-[1.8rem] border-2 border-dashed border-[#8d6e63]/50 flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-3 border-b border-[#8d6e63]/30 w-full justify-center pb-2">
                            <ClipboardList size={16} className="text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Yield Notes (Per Item)</span>
                        </div>
                        <div className="flex justify-around w-full gap-4">
                            {mission.leftSide.map((item, idx) => (
                              <div key={idx} className="flex flex-col items-center">
                                  <span className="text-2xl sm:text-4xl filter drop-shadow-md">{item.icon}</span>
                                  <span className="text-[8px] font-black text-[#a88a6d] uppercase mt-1">{item.name}</span>
                                  <span className="text-sm sm:text-2xl font-black text-white">{item.unitWeight}g</span>
                              </div>
                            ))}
                            {mission.knownWeight > 0 && (
                              <div className="flex flex-col items-center border-l border-white/10 pl-6">
                                  <WeightBlock weight={mission.knownWeight} size="small" />
                                  <span className="text-[8px] font-black text-[#a88a6d] uppercase mt-1 text-center">Weight Block</span>
                              </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* DISCOVERY INPUT AREA */}
                <div className="bg-white/50 backdrop-blur-sm p-4 sm:p-6 rounded-[2rem] border-2 border-white shadow-inner flex flex-col items-center gap-4">
                    <p className="text-sm sm:text-xl font-black text-[#5d4037] text-center leading-tight uppercase tracking-tight w-full px-2">
                        What will be the weight on right scale?
                    </p>
                    
                    <motion.div 
                      animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                      className="flex flex-row items-stretch justify-center gap-3 w-full max-w-[400px]"
                    >
                        <input 
                          type="number" 
                          value={userInput}
                          disabled={isCorrect}
                          onChange={(e) => { setUserInput(e.target.value); setIsError(false); }}
                          placeholder="???"
                          className={`w-[130px] sm:w-[180px] bg-white border-4 rounded-2xl py-3 sm:py-5 text-center text-2xl sm:text-5xl font-black focus:ring-4 focus:outline-none shadow-lg transition-all
                            ${isError ? 'border-red-500 text-red-500 ring-4 ring-red-100' : 'border-[#c4a484] text-[#5d4037]'}
                            ${isCorrect ? 'border-emerald-500 text-emerald-600 ring-4 ring-emerald-100' : ''}`}
                        />
                        <button 
                          onClick={handleCheck}
                          disabled={isCorrect || !userInput}
                          className="px-6 sm:px-10 bg-emerald-600 text-white rounded-2xl font-black uppercase text-sm sm:text-xl shadow-lg border-b-4 border-emerald-800 active:translate-y-1 active:border-0 disabled:opacity-50 disabled:grayscale transition-all hover:bg-emerald-500"
                        >
                          Check
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-2">
          <div className="w-full">
            <AnimatePresence mode="wait">
              {autoNextTimer !== null ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl shadow-lg border-b-4 bg-indigo-600 text-white border-indigo-900">
                  <div className="flex items-center gap-3 z-10">
                    <div className="bg-white/10 p-1.5 sm:p-3 rounded-2xl"><ChevronRight size={20} /></div>
                    <div className="leading-tight uppercase tracking-tighter text-[10px] sm:text-lg">Next Mission In</div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-6 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner min-w-[80px] sm:min-w-[140px] justify-center">
                    <Timer size={14} className="animate-spin text-indigo-300" />
                    <span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span>
                  </div>
                </motion.div>
              ) : (
                <div className="w-full h-12 sm:h-20 bg-[#3e2723]/10 rounded-[2.5rem] border-2 border-dashed border-[#3e2723]/20 flex items-center justify-center">
                  <span className="text-[10px] sm:text-xs font-bold text-[#3e2723]/40 uppercase tracking-widest italic">Solve to progress automatically</span>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          <button onClick={runExplanation} className="flex items-center justify-center gap-2 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
            <Info size={18} />
            <span className="uppercase tracking-tighter text-[10px] sm:text-lg">View Explanation</span>
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
                onClick={() => { setIsExplaining(false); if (typeof window !== 'undefined') window.speechSynthesis.cancel(); }}
                className="absolute top-6 right-6 p-4 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <X size={28} />
              </button>

              <h2 className="text-2xl sm:text-5xl font-black uppercase tracking-tighter mb-4 sm:mb-8 text-[#5d4037]">View Explanation</h2>

              <div className="w-full space-y-4 sm:space-y-6">
                <div className="w-full bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-6 sm:p-10 rounded-[2.5rem] border-4 border-[#8d6e63] shadow-2xl text-center">
                  <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                    {formulas.map((line, idx) => (
                      <motion.p key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className={`text-base sm:text-3xl font-black tracking-tight font-mono drop-shadow-md leading-tight text-yellow-100/70`}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-white/60 p-4 sm:p-10 rounded-[2.5rem] border-2 border-[#8d6e63]/20 shadow-inner text-center min-h-[100px] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                     <motion.p key={explanationText} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
                       className="text-sm sm:text-2xl font-bold text-[#5d4037] leading-tight"
                     >
                       {explanationText}
                     </motion.p>
                   </AnimatePresence>
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                 <button onClick={() => { setIsExplaining(false); if (typeof window !== 'undefined') window.speechSynthesis.cancel(); }} className="px-14 py-4 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20 text-xl">I Understand!</button>
              </div>
            </div>
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