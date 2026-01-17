import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 RefreshCcw,
 ChevronRight,
 Trophy, Sparkles, Volume2, VolumeX,
 Info, X, Target,
 Timer, RotateCcw,
 Microscope, Play,
 AlertCircle, CheckCircle2,
 Flame, Activity,
 Clock,
 CirclePause,
 CirclePlay,
 Zap,
 History
} from 'lucide-react';

const PUZZLES = [
    {
        id: 1,
        title: "The Rapid Burn",
        goal: 30,
        instruction: "Measure exactly 30 minutes using one candle. Remember: lighting both ends makes it burn twice as fast.",
        hint: "Light both ends of Candle A.",
        solutionText: "A 60-minute candle lit at both ends burns out in exactly 30 minutes."
    },
    {
        id: 2,
        title: "The Classic 45",
        goal: 45,
        instruction: "Measure exactly 45 minutes using two candles. You'll need to change the state of the second candle mid-burn.",
        hint: "Light A (both ends) and B (one end). When A finishes, light the other end of B.",
        solutionText: "Phase 1: 30m (A both ends, B one end). Phase 2: 15m (B now both ends). Total: 45m."
    },
    {
        id: 3,
        title: "The Double Hour",
        goal: 90,
        instruction: "Measure 1 hour and 30 minutes. Sequence matters!",
        hint: "Burn one completely, then burn the next at double speed.",
        solutionText: "60m (A one end) + 30m (B both ends) = 90m."
    },
    {
        id: 4,
        title: "The Quarter Hour",
        goal: 15,
        instruction: "Measure exactly 15 minutes. Note: The timer starts as soon as you ignite the first candle, but you can 'Zero' it whenever you like.",
        hint: "Light A (both ends) and B (one end). When A finishes, zero the timer and light B's other end.",
        solutionText: "Phase 1 gets you to the 30m mark. Zeroing the timer then allows you to measure the final 15m as B burns from both ends."
    }
];

const FlickeringFlame = ({ active, position = 'top', offset = 0 }) => {
    if (!active) return null;
    const isTop = position === 'top';
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
                scale: [1, 1.2, 1, 1.3, 1],
                opacity: [0.7, 1, 0.8, 1, 0.7],
                y: isTop ? [0, -4, 0, -6, 0] : [0, 4, 0, 6, 0]
            }}
            transition={{ repeat: Infinity, duration: 0.4, ease: "easeInOut" }}
            className={`absolute z-30 pointer-events-none left-1/2 -translate-x-1/2`}
            style={{ 
                [isTop ? 'top' : 'bottom']: `calc(${offset}% - ${isTop ? '24px' : '20px'})`,
            }}
        >
            <Flame size={isTop ? 44 : 36} className="text-orange-500 fill-orange-500 blur-[0.3px]" />
        </motion.div>
    );
};

export default function App() {
 // --- Progression State ---
 const [currentLevel, setCurrentLevel] = useState(0);
 const puzzle = PUZZLES[currentLevel];

 // --- UI State ---
 const [isMuted, setIsMuted] = useState(false);
 const [showInstructions, setShowInstructions] = useState(true);
 const [isExplaining, setIsExplaining] = useState(false);
 
 // --- Simulation State ---
 const [simTime, setSimTime] = useState(0); 
 const [displayOffset, setDisplayOffset] = useState(0); 
 const [isRunning, setIsRunning] = useState(false);
 const [isFinished, setIsFinished] = useState(false);

 const [candles, setCandles] = useState({
    A: { topConsumed: 0, btmConsumed: 0, topLit: false, btmLit: false, gone: false },
    B: { topConsumed: 0, btmConsumed: 0, topLit: false, btmLit: false, gone: false }
 });

 const displayTime = Math.max(0, simTime - displayOffset);

 const speak = useCallback((text) => {
   if (isMuted || !window.speechSynthesis) return;
   window.speechSynthesis.cancel();
   const utterance = new SpeechSynthesisUtterance(text);
   window.speechSynthesis.speak(utterance);
 }, [isMuted]);

 const toggleLight = (id, end) => {
    if (isRunning || isFinished) return;
    setCandles(prev => ({
        ...prev,
        [id]: { ...prev[id], [end]: !prev[id][end] }
    }));
 };

 const resetDisplayTimer = () => {
    setDisplayOffset(simTime);
    speak("Timer zeroed.");
 };

 const reset = useCallback(() => {
    setSimTime(0);
    setDisplayOffset(0);
    setIsRunning(false);
    setIsFinished(false);
    setCandles({
        A: { topConsumed: 0, btmConsumed: 0, topLit: false, btmLit: false, gone: false },
        B: { topConsumed: 0, btmConsumed: 0, topLit: false, btmLit: false, gone: false }
    });
 }, []);

 const nextLevel = () => {
    const nextIdx = (currentLevel + 1) % PUZZLES.length;
    setCurrentLevel(nextIdx);
    reset();
    setShowInstructions(true);
 };

 useEffect(() => {
    let interval;
    if (isRunning && !isFinished) {
        interval = setInterval(() => {
            setCandles(prev => {
                const next = { ...prev };
                let eventHappened = false;

                ['A', 'B'].forEach(id => {
                    if (next[id].gone) return;
                    const topRate = next[id].topLit ? 0.2 : 0;
                    const btmRate = next[id].btmLit ? 0.2 : 0;
                    next[id].topConsumed += topRate;
                    next[id].btmConsumed += btmRate;

                    if (next[id].topConsumed + next[id].btmConsumed >= 60) {
                        next[id].gone = true;
                        next[id].topLit = false;
                        next[id].btmLit = false;
                        eventHappened = true;
                    }
                });

                setSimTime(t => t + 0.2);

                if (eventHappened) {
                    setIsRunning(false);
                    speak("A candle has finished burning. Simulation paused.");
                }

                if (next.A.gone && next.B.gone) {
                    setIsFinished(true);
                    setIsRunning(false);
                }

                return next;
            });
        }, 100);
    }
    return () => clearInterval(interval);
 }, [isRunning, isFinished, speak]);

 const isSuccess = Math.abs(displayTime - puzzle.goal) < 0.5;

 return (
   <div className="min-h-screen flex flex-col items-center bg-[#f4f1ea] font-sans select-none text-[#5d4037] p-3 sm:p-8 relative overflow-hidden">
     {/* TEXTURED WOOD BACKGROUND */}
     <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
     
     {/* HEADER */}
     <header className="w-full max-w-4xl flex justify-between items-center mb-6 z-50">
       <div className="flex items-center gap-3">
         <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#8d6e63] rounded-2xl shadow-xl flex items-center justify-center text-white border-b-4 border-[#5d4037]">
            <Timer size={32} />
         </div>
         <div>
           <h1 className="text-xl sm:text-4xl font-black uppercase tracking-tighter leading-none">{puzzle.title}</h1>
           <p className="text-[10px] sm:text-xs font-bold text-[#a88a6d] uppercase tracking-widest mt-1">Trial {currentLevel + 1} / {PUZZLES.length}</p>
         </div>
       </div>

       <div className="flex items-center gap-2">
           <button onClick={() => setIsMuted(!isMuted)} className="p-3 sm:p-4 bg-white rounded-xl shadow-md border border-stone-200 active:scale-95">
               {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <button onClick={reset} className="p-3 sm:p-4 bg-[#8d6e63] text-white rounded-xl shadow-lg border-b-4 border-[#5d4037] active:scale-95 transition-transform">
               <RotateCcw size={20} />
           </button>
       </div>
     </header>

     {/* MAIN STAGE */}
     <main className="flex-1 w-full max-w-4xl bg-[#e6dccb] rounded-[3rem] shadow-2xl border-b-[12px] border-[#c4a484] relative overflow-hidden flex flex-col p-4 sm:p-12 mb-6 border-t-2 border-white/20">
       <div className="absolute inset-0 bg-stone-900/5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(93,64,55,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
       <div className="relative z-20 flex flex-col gap-6 sm:gap-8">
             
             {/* INSTRUMENT PANEL */}
             <div className="w-full bg-[#fdfaf5]/95 backdrop-blur-md rounded-[2.5rem] p-5 sm:p-8 border-2 border-[#8d6e63]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#5d4037] rounded-full flex items-center justify-center text-white border-4 border-[#8d6e63] shadow-lg">
                    <Clock size={32} className={isRunning ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#a88a6d] tracking-widest">Goal: {puzzle.goal}m</span>
                    <h2 className="text-4xl sm:text-6xl font-black text-[#5d4037] tabular-nums tracking-tighter">
                        {Math.floor(displayTime).toString().padStart(2, '0')}:{((displayTime * 60) % 60).toFixed(0).padStart(2, '0')}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={resetDisplayTimer}
                        className="px-6 py-3 bg-white border-2 border-[#8d6e63]/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-50 active:scale-95 shadow-sm flex items-center gap-2"
                    >
                        <History size={16} className="text-[#8d6e63]" /> Zero Timer
                    </button>
                    <div className={`px-6 py-3 rounded-2xl border-b-4 font-black flex items-center gap-3 transition-all ${isRunning ? 'bg-orange-500 text-white border-orange-700' : 'bg-stone-200 text-stone-500 border-stone-400'}`}>
                        <Zap size={16} className={isRunning ? 'animate-pulse' : ''} />
                        <span className="uppercase text-xs sm:text-sm">{isRunning ? 'Active' : 'Paused'}</span>
                    </div>
                </div>
             </div>

             {/* CANDLES INTERFACE */}
             <div className="bg-white/95 p-6 sm:p-12 rounded-[4rem] border-4 border-[#8d6e63]/20 shadow-2xl relative">
                <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/wood-pattern.png")' }} />
                
                <div className="flex justify-around items-center h-80 relative mb-12 border-b-8 border-stone-100 rounded-b-[3rem]">
                    {['A', 'B'].map(id => {
                        const topPercent = (candles[id].topConsumed / 60) * 100;
                        const btmPercent = (candles[id].btmConsumed / 60) * 100;
                        const remainingPercent = ((60 - candles[id].topConsumed - candles[id].btmConsumed) / 60) * 100;

                        return (
                            <div key={id} className="flex flex-col items-center gap-6 group">
                                <div className="relative w-12 sm:w-20 bg-stone-100 rounded-lg border-2 border-stone-200 shadow-inner flex flex-col items-center overflow-visible" style={{ height: '240px' }}>
                                    {/* THE THREAD / WICK */}
                                    <div className="absolute inset-y-0 w-0.5 bg-stone-800/40 left-1/2 -translate-x-1/2 z-0" />
                                    
                                    {/* WAX BODY (Dynamic Melting) */}
                                    <motion.div 
                                        className="w-full bg-gradient-to-r from-orange-200 via-orange-50 to-orange-200 relative z-10 rounded-sm shadow-md border-x border-orange-100"
                                        animate={{ 
                                            height: `${remainingPercent}%`,
                                            top: `${topPercent}%`
                                        }}
                                        transition={{ duration: 0.1, ease: "linear" }}
                                    />

                                    {/* FLAMES - Moving with the wax */}
                                    <FlickeringFlame 
                                        active={candles[id].topLit && !candles[id].gone} 
                                        position="top" 
                                        offset={topPercent}
                                    />
                                    <FlickeringFlame 
                                        active={candles[id].btmLit && !candles[id].gone} 
                                        position="bottom" 
                                        offset={btmPercent}
                                    />
                                </div>

                                <div className="flex flex-col gap-2 w-full max-w-[140px]">
                                    <span className="text-center font-black text-[10px] text-[#a88a6d] uppercase tracking-[0.3em]">Unit {id}</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => toggleLight(id, 'topLit')}
                                            disabled={candles[id].gone || isRunning}
                                            className={`py-3 rounded-xl border-2 text-[9px] font-black transition-all ${candles[id].topLit ? 'bg-orange-500 text-white border-orange-700 shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-[#8d6e63]/30'}`}
                                        >
                                            TOP
                                        </button>
                                        <button 
                                            onClick={() => toggleLight(id, 'btmLit')}
                                            disabled={candles[id].gone || isRunning}
                                            className={`py-3 rounded-xl border-2 text-[9px] font-black transition-all ${candles[id].btmLit ? 'bg-orange-500 border-orange-700 text-white shadow-inner' : 'bg-white border-stone-200 text-stone-400 hover:border-[#8d6e63]/30'}`}
                                        >
                                            BTM
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4">
                    {!isFinished ? (
                        <button 
                            onClick={() => setIsRunning(!isRunning)}
                            className={`w-full py-6 sm:py-8 rounded-[2.5rem] font-black text-xl sm:text-3xl shadow-xl border-b-8 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-widest ${isRunning ? 'bg-stone-500 text-white border-stone-700' : 'bg-blue-600 text-white border-blue-900 shadow-blue-500/20'}`}
                        >
                            {isRunning ? <CirclePause size={32}/> : <CirclePlay size={32}/>}
                            {isRunning ? 'Interrupt' : simTime > 0 ? 'Resume Experiment' : 'Start Ignition'}
                        </button>
                    ) : (
                        <div className="bg-[#5d4037] p-6 sm:p-10 rounded-[3rem] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl border-b-8 border-black">
                            <div className="text-center sm:text-left">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Session Conclusion</span>
                                <p className="text-4xl font-black">{displayTime.toFixed(1)} Minutes Captured</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={reset} className="p-5 bg-[#8d6e63] rounded-2xl hover:bg-white hover:text-[#8d6e63] transition-all shadow-lg"><RotateCcw size={28}/></button>
                                {isSuccess && <button onClick={nextLevel} className="p-5 bg-emerald-500 rounded-2xl hover:bg-white hover:text-emerald-500 transition-all font-black uppercase flex items-center gap-3 text-lg shadow-lg">Next <ChevronRight size={24}/></button>}
                            </div>
                        </div>
                    )}
                </div>
             </div>
         </div>

         <AnimatePresence>
             {isFinished && isSuccess && (
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-[#3e2723]/50 backdrop-blur-sm pointer-events-auto">
                    <div className="bg-emerald-600 text-white p-12 sm:p-24 rounded-[5rem] shadow-2xl flex flex-col items-center gap-8 text-center border-b-[16px] border-emerald-900 ring-[20px] ring-emerald-500/20">
                        <Trophy size={100} className="text-yellow-300 animate-bounce" />
                        <div>
                            <h2 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-none mb-2">CALIBRATED!</h2>
                            <p className="font-bold text-2xl sm:text-3xl opacity-90 italic">Trial {puzzle.id} Successfully Concluded</p>
                        </div>
                        <button onClick={nextLevel} className="px-16 py-6 bg-white text-emerald-600 rounded-[2rem] font-black uppercase text-2xl shadow-xl hover:bg-emerald-50 transition-all active:scale-95">Next Experiment</button>
                    </div>
                 </motion.div>
             )}
         </AnimatePresence>
     </main>

     <footer className="w-full max-w-4xl flex gap-4 pb-8">
        <button onClick={() => setIsExplaining(true)} className="flex-1 p-6 bg-[#8d6e63] text-white rounded-[2rem] font-black text-lg border-b-8 border-[#3e2723] flex items-center justify-center gap-4 active:scale-95 transition-all shadow-lg">
            <Info size={28} /> <span className="uppercase tracking-widest">Logic Manual</span>
        </button>
     </footer>

     <AnimatePresence>
        {showInstructions && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-3xl p-4">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-4xl bg-[#fdfaf5] rounded-[4rem] p-10 sm:p-24 border-[16px] border-[#8d6e63] text-center shadow-3xl relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-orange-100 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 border-4 border-orange-200 shadow-lg">
                        <Activity size={64} className="text-orange-600 animate-pulse" />
                    </div>
                    <h2 className="text-5xl sm:text-9xl font-black text-[#5d4037] mb-8 uppercase tracking-tighter leading-none text-center">Trial {puzzle.id}</h2>
                    <p className="text-2xl sm:text-5xl font-bold text-[#8d6e63] leading-tight mb-14 italic text-center">"{puzzle.instruction}"</p>
                    <button onClick={() => setShowInstructions(false)} className="px-20 py-8 bg-blue-600 text-white font-black rounded-[3rem] shadow-2xl border-b-8 border-blue-900 text-2xl sm:text-5xl uppercase tracking-widest hover:scale-105 transition-all active:scale-95">Enter Laboratory</button>
                </motion.div>
            </div>
        )}

        {isExplaining && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#3e2723]/95 backdrop-blur-2xl p-4">
                <div className="w-full max-w-4xl bg-white rounded-[4rem] p-10 sm:p-20 border-[12px] border-[#8d6e63] relative flex flex-col items-center shadow-2xl">
                    <button onClick={()=>setIsExplaining(false)} className="absolute top-8 right-8 p-5 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform"><X size={32}/></button>
                    <h2 className="text-5xl font-black text-[#5d4037] mb-12 uppercase tracking-tighter">Lab Protocol</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12 w-full text-left">
                        <div className="bg-[#5d4037] p-10 rounded-[3rem] text-white border-b-[12px] border-black">
                            <h3 className="text-yellow-400 font-black uppercase text-xl mb-6 flex items-center gap-3 border-b border-white/10 pb-4">Core Rule</h3>
                            <p className="text-2xl leading-snug font-bold opacity-90 italic">A 60m candle consumes 1 unit per minute per lit end. Lighting both ends makes it finish in 30m.</p>
                        </div>
                        <div className="bg-[#f5f2ed] p-10 rounded-[3rem] border-4 border-dashed border-[#8d6e63]">
                            <h3 className="text-blue-600 font-black uppercase text-xl mb-6 flex items-center gap-3 border-b border-[#8d6e63]/20 pb-4">Strategy</h3>
                            <p className="text-2xl leading-snug font-bold text-[#5d4037]">{puzzle.solutionText}</p>
                        </div>
                    </div>
                    <button onClick={()=>setIsExplaining(false)} className="px-20 py-8 bg-[#8d6e63] text-white font-black rounded-3xl shadow-xl uppercase border-b-8 border-[#3e2723] text-2xl tracking-widest">Protocol Clear</button>
                </div>
            </div>
        )}
     </AnimatePresence>

     <style dangerouslySetInnerHTML={{ __html: `
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
     ` }} />
   </div>
 );
}