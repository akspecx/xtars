import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, Volume2, VolumeX,
  Trophy
} from 'lucide-react';

// --- Scenarios with requested constructs ---
const SCENARIOS = [
  { id: 1, type: 'cars', emoji: '🚗', name: 'Cars', leftCount: 5, rightCount: 3, color: '#2563eb' },
  { id: 2, type: 'flowers', emoji: '🌸', name: 'Flowers', leftCount: 2, rightCount: 6, color: '#e63946' },
  { id: 3, type: 'shoes', emoji: '👟', name: 'Shoes', leftCount: 4, rightCount: 2, color: '#264653' },
  { id: 4, type: 'clothes', emoji: '👕', name: 'Clothes', leftCount: 3, rightCount: 7, color: '#2a9d8f' },
  { id: 5, type: 'teddies', emoji: '🧸', name: 'Teddies', leftCount: 6, rightCount: 4, color: '#f4a261' },
];

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  
  const timerIntervalRef = useRef(null);
  const sideRefs = useRef({ left: null, right: null });
  const audioCtxRef = useRef(null);
  const soundIntervalRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  const initAmbientSound = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      if (soundIntervalRef.current) clearInterval(soundIntervalRef.current);
      soundIntervalRef.current = setInterval(() => {
        if (isMuted || isCorrect || journeyFinished || audioCtxRef.current.state === 'suspended') return; 
        
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.006, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.1);
      }, 1500);
    } catch (e) {
      console.warn("Audio context blocked");
    }
  }, [isMuted, isCorrect, journeyFinished]);

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

  const handleSelect = useCallback((side, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    setSelectedSide(side);
    setIsAnswered(true);

    // LOGIC CHANGE: Check for the side with FEWER items
    const isWinner = (side === 'left' && currentScenario.leftCount < currentScenario.rightCount) ||
                     (side === 'right' && currentScenario.rightCount < currentScenario.leftCount);

    if (isWinner) {
      setIsCorrect(true);
      speak(`Excellent! This side has less ${currentScenario.name}!`);
      
      if (mode === 'kid') {
        if (scenarioIdx < SCENARIOS.length - 1) {
          setAutoNextTimer(5); 
        } else {
          setJourneyFinished(true);
          speak("Fantastic! You finished your journey and found all the smaller groups!");
        }
      } else {
        setAutoNextTimer(10); 
      }
    } else {
      setIsCorrect(false);
      speak(`Is this less? No, this side has more. Let's find where is less!`);
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedSide(null);
        }, 2500);
      }
    }
  }, [currentScenario, isAnswered, isCorrect, isAutoPlaying, mode, scenarioIdx, speak]);

  const moveHandToSide = useCallback((side) => {
    return new Promise(resolve => {
      const el = sideRefs.current[side];
      if (!el) return resolve();
      const rect = el.getBoundingClientRect();
      setVirtualHandPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setTimeout(resolve, 1200);
    });
  }, []);

  const startKidModeTutorial = useCallback(async () => {
    if (tutorialActiveRef.current || journeyFinished) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);
    
    speak(`Where can you see less ${currentScenario.name}?`);
    await new Promise(r => setTimeout(r, 1200));
    
    // TUTORIAL CHANGE: Pick the side with MORE first as a mistake demo
    const correctSide = currentScenario.leftCount < currentScenario.rightCount ? 'left' : 'right';
    const wrongSide = correctSide === 'left' ? 'right' : 'left';
    
    // Demonstrate mistake (pick the bigger group)
    await moveHandToSide(wrongSide);
    handleSelect(wrongSide, true); 
    await new Promise(r => setTimeout(r, 3200)); 
    
    // Correction (pick the smaller group)
    setIsAnswered(false);
    setSelectedSide(null);
    await new Promise(r => setTimeout(r, 800));

    await moveHandToSide(correctSide);
    handleSelect(correctSide, true);
    
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [currentScenario, moveHandToSide, handleSelect, speak, journeyFinished]);

  const resetLevel = useCallback((idx) => {
    setScenarioIdx(idx);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedSide(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setJourneyFinished(false);
    tutorialActiveRef.current = false;

    if (mode === 'practice') {
      speak(`Which box has less ${SCENARIOS[idx].name}?`);
    }
  }, [mode, speak]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current && !journeyFinished) {
        const timer = setTimeout(() => {
            startKidModeTutorial();
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [scenarioIdx, mode, isCorrect, startKidModeTutorial, journeyFinished]);

  const handleNextSequential = useCallback(() => {
    const nextIdx = (scenarioIdx + 1) % SCENARIOS.length;
    resetLevel(nextIdx);
  }, [scenarioIdx, resetLevel]);

  const handleNextRandom = () => {
    const available = SCENARIOS.filter((_, i) => i !== scenarioIdx);
    const nextIdx = SCENARIOS.indexOf(available[Math.floor(Math.random() * available.length)]);
    resetLevel(nextIdx);
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
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/10 text-lg sm:xl">
                <span>⚖️</span>
            </div>
            <span>Understanding of Less</span>
          </h1>
          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visual Logic Lab</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-[#e2d6c3] p-1 rounded-xl shadow-inner flex items-center gap-1 border border-stone-300">
                <button 
                    onClick={() => { setMode('kid'); setScenarioIdx(0); resetLevel(0); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
                >
                    <Play size={10} fill={mode === 'kid' ? 'currentColor' : 'none'} />
                    KID MODE
                </button>
                <button 
                    onClick={() => { setMode('practice'); resetLevel(scenarioIdx); }}
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

            <button onClick={() => resetLevel(scenarioIdx)} className="p-2 sm:p-2.5 bg-[#8d6e63] text-white rounded-lg shadow-md border-b-4 border-[#5d4037]">
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* THE STAGE */}
      <div className="w-full max-w-7xl bg-[#dfc4a1] rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 shadow-2xl border-b-8 sm:border-b-[12px] border-[#c4a484] relative mb-1 sm:mb-2 overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[480px] lg:min-h-[620px]">
        
        {/* Visual Prompt Updated to 'Less?' */}
        <div className="mb-6 lg:mb-12 flex flex-col items-center">
            <motion.div 
                key={`prompt-${scenarioIdx}`}
                initial={{ scale: 0.5, y: -10 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white/95 px-6 py-2 sm:px-12 sm:py-4 rounded-full shadow-xl border-b-4 border-stone-200 text-center"
            >
                <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-0.5">Which box has</div>
                <div className="text-3xl sm:text-6xl font-black text-[#2563eb] tracking-tighter uppercase leading-none">Less?</div>
            </motion.div>
        </div>

        {/* Comparison Boxes */}
        <div className="w-full grid grid-cols-2 gap-4 sm:gap-12 max-w-5xl relative px-4">
            {['left', 'right'].map((side) => {
                const count = side === 'left' ? currentScenario.leftCount : currentScenario.rightCount;
                // Logic updated to check for smaller group
                const isWinnerSide = (side === 'left' && currentScenario.leftCount < currentScenario.rightCount) ||
                                     (side === 'right' && currentScenario.rightCount < currentScenario.leftCount);
                
                return (
                    <motion.button
                        key={`${scenarioIdx}-${side}`}
                        ref={el => sideRefs.current[side] = el}
                        onClick={() => handleSelect(side)}
                        whileHover={!isAnswered ? { scale: 1.02, y: -5 } : {}}
                        className={`relative aspect-[4/5] sm:aspect-square bg-white rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[8px] sm:border-b-[12px] p-4 sm:p-10 flex items-center justify-center overflow-visible transition-all duration-500 ${
                            selectedSide === side 
                                ? (isWinnerSide ? 'border-emerald-500 ring-8 ring-emerald-500/10' : 'border-rose-400 animate-shake')
                                : isAnswered ? 'opacity-30 grayscale-[0.3]' : 'border-stone-100'
                        }`}
                    >
                        {/* Dynamic Item Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 justify-items-center items-center w-full h-full">
                            {[...Array(count)].map((_, i) => (
                                <motion.div
                                    key={`item-${i}`}
                                    initial={{ scale: 0, rotate: -25 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="text-3xl sm:text-6xl lg:text-8xl drop-shadow-lg"
                                >
                                    {currentScenario.emoji}
                                </motion.div>
                            ))}
                        </div>

                        {/* Feedback Marks */}
                        <AnimatePresence>
                            {selectedSide === side && (
                                <motion.div 
                                    key={`status-feedback-${side}`}
                                    initial={{ scale: 0, y: 20 }} animate={{ scale: 1.3, y: -40 }} exit={{ scale: 0 }}
                                    className="absolute left-1/2 -translate-x-1/2 z-50"
                                >
                                    {isWinnerSide ? (
                                        <div className="bg-emerald-500 p-2 sm:p-5 rounded-full shadow-2xl border-4 border-white ring-8 ring-emerald-500/10">
                                            <CheckCircle2 className="text-white w-8 h-8 sm:w-16 sm:h-16" />
                                        </div>
                                    ) : (
                                        <div className="bg-rose-500 p-2 sm:p-5 rounded-full shadow-2xl border-4 border-white ring-8 ring-rose-500/10">
                                            <XCircle className="text-white w-8 h-8 sm:w-16 sm:h-16" />
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>

        {/* Completion Modal */}
        <AnimatePresence>
            {journeyFinished && (
                <motion.div 
                    key="completion-modal"
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
                >
                    <Trophy size={110} className="text-[#2563eb] mb-8 animate-bounce" />
                    <h2 className="text-4xl sm:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">Super Job!</h2>
                    <p className="text-stone-500 font-bold uppercase tracking-widest mt-4 mb-10 text-xs sm:text-lg">You found all the smaller boxes!</p>
                    <button 
                        onClick={() => { setMode('practice'); resetLevel(0); }}
                        className="bg-[#2563eb] text-white px-12 py-5 rounded-[2rem] font-black text-xl sm:text-3xl shadow-2xl border-b-8 border-blue-800 active:scale-95 transition-all"
                    >
                        START OVER
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

        {!isAnswered && !isAutoPlaying && mode === 'practice' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex items-center gap-2 text-stone-500 font-black text-[9px] sm:text-sm uppercase tracking-widest bg-white/40 px-6 py-2 rounded-full">
                <Hand size={16} className="animate-bounce" />
                Tap the box with LESS
            </motion.div>
        )}
      </div>

      {/* VIRTUAL HAND */}
      <AnimatePresence>
        {mode === 'kid' && virtualHandPos && !journeyFinished && (
            <motion.div 
                key="virtual-hand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand className="text-stone-800 w-12 h-12 sm:w-28 sm:h-28" fill="white" />
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER NAVIGATION */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center px-2 mt-2 pb-2">
          <div className="flex flex-col gap-1">
            <button 
              onClick={handleNextSequential}
              className={`group relative flex items-center justify-between w-full p-3 sm:p-7 rounded-[1.5rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 ${
                autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-5 z-10">
                <div className="bg-white/20 p-2 sm:p-4 rounded-xl sm:rounded-2xl">
                   <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="text-left">
                  <div className="leading-tight sm:text-2xl font-black uppercase">
                    {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
                  </div>
                  {autoNextTimer !== null && (
                    <div className="text-[7px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5">Moving...</div>
                  )}
                </div>
              </div>

              {/* PILL TIMER WITH RUNNER */}
              <div className="flex items-center relative z-10">
                {autoNextTimer !== null ? (
                  <div className="flex items-center gap-2 sm:gap-4 bg-black/40 px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-[2.5rem] border border-white/20 shadow-inner relative overflow-hidden min-w-[130px] sm:min-w-[220px]">
                    <Timer size={20} className="animate-spin text-emerald-200 shrink-0" />
                    <div className="flex justify-between w-full px-3 items-center relative">
                        {[...Array(10)].map((_, i) => (
                            <div key={`step-${i}`} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>
                                👣
                            </div>
                        ))}
                        <motion.div 
                            animate={{ left: `${((10 - autoNextTimer) / 9) * 100}%`, x: '-50%' }}
                            className="absolute top-1/2 -translate-y-1/2 text-base sm:text-2xl pointer-events-none"
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
            <button onClick={handleNextRandom} className="flex items-center justify-center gap-3 sm:gap-5 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-7 rounded-[1.5rem] sm:rounded-[3rem] font-black text-sm sm:text-2xl transition-all active:scale-95 shadow-xl border-b-4 sm:border-b-8 border-[#5d4037]">
              <Shuffle size={20} className="sm:w-8 sm:h-8" />
              <span className="uppercase font-black">Random Shuffle</span>
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