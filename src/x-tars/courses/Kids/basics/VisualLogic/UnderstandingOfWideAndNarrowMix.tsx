import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, Volume2, VolumeX,
  Trophy, Award
} from 'lucide-react';

// --- Scenarios for Width Comparison ---
const SCENARIOS = [
  { id: 1, name: 'Elephant', emoji: '🐘', color: '#64748b' },
  { id: 2, name: 'Tree', emoji: '🌳', color: '#166534' },
  { id: 3, name: 'House', emoji: '🏠', color: '#991b1b' },
  { id: 4, name: 'Butterfly', emoji: '🦋', color: '#7c3aed' },
  { id: 5, name: 'Fish', emoji: '🐠', color: '#ea580c' },
  { id: 6, name: 'Flower', emoji: '🌻', color: '#ca8a04' },
  { id: 7, name: 'Balloon', emoji: '🎈', color: '#dc2626' },
  { id: 8, name: 'Bus', emoji: '🚌', color: '#eab308' },
  { id: 9, name: 'Road', emoji: '🛣️', color: '#374151' },
  { id: 10, name: 'Path', emoji: '🛤️', color: '#6b7280' },
  { id: 11, name: 'River', emoji: '🌊', color: '#0ea5e9' },
  { id: 12, name: 'Stream', emoji: '🏞️', color: '#06b6d4' },
  { id: 13, name: 'Bridge', emoji: '🌉', color: '#7c2d12' },
  { id: 14, name: 'Gate', emoji: '🚪', color: '#92400e' },
  { id: 15, name: 'Door', emoji: '🚪', color: '#a16207' },
  { id: 16, name: 'Window', emoji: '🪟', color: '#ca8a04' },
];

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [bigSide, setBigSide] = useState('left'); // The side that is WIDE
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [currentTarget, setCurrentTarget] = useState('wide'); // 'wide' or 'narrow'
  
  const timerIntervalRef = useRef(null);
  const sideRefs = useRef({ left: null, right: null });
  const audioCtxRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const resetLevel = useCallback((idx, isSequential = false) => {
    setScenarioIdx(idx);
    
    // Randomize which side is WIDE
    const newBigSide = Math.random() > 0.5 ? 'left' : 'right';
    // Randomize target: wide or narrow
    const newTarget = Math.random() > 0.5 ? 'wide' : 'narrow';
    
    setBigSide(newBigSide);
    setCurrentTarget(newTarget);
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedSide(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setJourneyFinished(false);
    tutorialActiveRef.current = false;

    if (mode === 'practice' || (mode === 'kid' && !isSequential)) {
      speak(`Find the ${newTarget} ${SCENARIOS[idx].name}!`);
    }
  }, [mode, speak]);

  const handleNextSequential = useCallback(() => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      resetLevel(scenarioIdx + 1, true);
    } else {
      if (mode === 'practice') {
        resetLevel(0, true);
      }
    }
  }, [scenarioIdx, resetLevel, mode]);

  const handleSelect = useCallback((side, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    setSelectedSide(side);
    setIsAnswered(true);

    const isWinner = (currentTarget === 'wide') ? (side === bigSide) : (side !== bigSide);

    if (isWinner) {
      setIsCorrect(true);
      setScore(score + 1);
      speak(`Wonderful! That is the ${currentTarget} ${currentScenario.name}!`);
      
      if (mode === 'kid') {
        if (scenarioIdx === SCENARIOS.length - 1) {
            setTimeout(() => {
                setJourneyFinished(true);
                speak("Brilliant! You've completed your journey and found all the wide and narrow items!");
            }, 1000);
        } else {
            setAutoNextTimer(10);
        }
      } else {
        setAutoNextTimer(10); 
      }
    } else {
      setIsCorrect(false);
      const wrongType = currentTarget === 'wide' ? 'narrow' : 'wide';
      speak(`Is that ${currentTarget}? No, that one is ${wrongType}. Look for the ${currentTarget} ${currentScenario.name}!`);
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedSide(null);
        }, 2000);
      }
    }
  }, [bigSide, isAnswered, isCorrect, isAutoPlaying, mode, score, scenarioIdx, currentScenario, currentTarget, speak]);

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
    
    speak(`Let's find the ${currentTarget} ${currentScenario.name}.`);
    await new Promise(r => setTimeout(r, 1500));
    
    const correctSide = (currentTarget === 'wide') ? bigSide : (bigSide === 'left' ? 'right' : 'left');
    const wrongSide = correctSide === 'left' ? 'right' : 'left';
    
    await moveHandToSide(wrongSide);
    handleSelect(wrongSide, true); 
    await new Promise(r => setTimeout(r, 3000)); 
    
    setIsAnswered(false);
    setSelectedSide(null);
    await new Promise(r => setTimeout(r, 800));

    await moveHandToSide(correctSide);
    handleSelect(correctSide, true);
    
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [currentScenario, bigSide, currentTarget, moveHandToSide, handleSelect, speak, journeyFinished]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current && !journeyFinished) {
        const timer = setTimeout(() => { startKidModeTutorial(); }, 2000);
        return () => clearTimeout(timer);
    }
  }, [scenarioIdx, mode, isCorrect, startKidModeTutorial, journeyFinished]);

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
    <div className="min-h-screen bg-[#f0f4f8] p-4 md:p-8 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
      {/* Header & Controls */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl sm:text-4xl font-black flex items-center justify-center md:justify-start gap-3 text-slate-900 tracking-tight">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-500 rounded-2xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/20">
                <Award size={24} />
            </div>
            <span>Wide & Narrow Mix</span>
          </h1>
          <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
             {mode !== 'kid' && (
               <div className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Award size={10} /> Progress: {scenarioIdx + 1} / {SCENARIOS.length}
               </div>
             )}
             <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Logic • Mixed Challenge</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="bg-slate-200/50 p-1.5 rounded-2xl shadow-inner flex items-center gap-1 border border-slate-200">
                <button 
                    onClick={() => { setMode('kid'); setScore(0); resetLevel(0); }}
                    className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Play size={14} fill={mode === 'kid' ? 'currentColor' : 'none'} />
                    KID MODE
                </button>
                <button 
                    onClick={() => { setMode('practice'); setScore(0); resetLevel(scenarioIdx); }}
                    className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-xs font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-md scale-105' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <MousePointer2 size={14} fill={mode === 'practice' ? 'currentColor' : 'none'} />
                    PRACTICE
                </button>
            </div>
            
            <button onClick={() => resetLevel(scenarioIdx)} className="p-3 bg-blue-500 text-white rounded-2xl shadow-lg border-b-4 border-blue-900 active:scale-95 transition-all">
                <RefreshCcw size={20} />
            </button>
        </div>
      </div>

      {/* STAGE */}
      <div className={`w-full max-w-6xl bg-white rounded-[3rem] sm:rounded-[5rem] p-6 sm:p-12 shadow-2xl border-b-[12px] border-slate-200 relative flex flex-col items-center justify-center min-h-[550px] lg:min-h-[700px] overflow-hidden`}>
        
        {/* Task Prompt */}
        <div className="mb-8 lg:mb-12">
            <motion.div 
                key={`prompt-${scenarioIdx}-${currentTarget}`}
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-slate-50 px-8 py-4 sm:px-20 sm:py-8 rounded-[2rem] shadow-xl border-b-4 border-slate-200 text-center"
            >
                <div className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-1 text-blue-500">Target</div>
                <div className={`text-3xl sm:text-6xl font-black tracking-tighter uppercase leading-none ${currentTarget === 'wide' ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {currentTarget.toUpperCase()}
                </div>
                <div className="text-xl sm:text-3xl font-bold text-slate-600 mt-2">{currentScenario.name}</div>
            </motion.div>
        </div>

        {/* Comparison Area */}
        <div className="w-full grid grid-cols-2 gap-6 sm:gap-16 max-w-5xl relative px-2">
            {['left', 'right'].map((side) => {
                const isTarget = (currentTarget === 'wide') ? (side === bigSide) : (side !== bigSide);
                
                return (
                    <motion.button
                        key={`${scenarioIdx}-${side}-${currentTarget}`}
                        ref={el => sideRefs.current[side] = el}
                        onClick={() => handleSelect(side)}
                        whileHover={!isAnswered ? { scale: 1.02, y: -5 } : {}}
                        className={`relative aspect-[3/4] sm:aspect-square bg-slate-50 rounded-[3rem] sm:rounded-[5rem] shadow-xl border-b-[10px] sm:border-b-[16px] flex items-center justify-center transition-all duration-500 ${
                            selectedSide === side 
                                ? (isCorrect ? 'border-emerald-500 ring-[12px] ring-emerald-500/10' : 'border-rose-400 animate-shake')
                                : isAnswered ? 'opacity-40 grayscale-[0.5]' : 'border-slate-100 hover:border-slate-200'
                        }`}
                        style={{
                            boxShadow: isTarget ? '0 20px 40px rgba(0,0,0,0.3)' : '0 5px 10px rgba(0,0,0,0.1)'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.0 }}
                            transition={{ type: 'spring', damping: 10, stiffness: 60 }}
                            className="text-[10rem] sm:text-[18rem] drop-shadow-2xl"
                        >
                            {currentScenario.emoji}
                        </motion.div>

                        <AnimatePresence>
                            {selectedSide === side && (
                                <motion.div 
                                    initial={{ scale: 0, y: 30 }} animate={{ scale: 1.4, y: -60 }} exit={{ scale: 0 }}
                                    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                >
                                    {isCorrect ? (
                                        <div className="bg-emerald-500 p-4 sm:p-8 rounded-full shadow-2xl border-[6px] border-white">
                                            <CheckCircle2 className="text-white w-12 h-12 sm:w-24 sm:h-24" />
                                        </div>
                                    ) : (
                                        <div className="bg-rose-500 p-4 sm:p-8 rounded-full shadow-2xl border-[6px] border-white">
                                            <XCircle className="text-white w-12 h-12 sm:w-24 sm:h-24" />
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
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
                >
                    <Trophy size={160} className="text-blue-500 mb-10 animate-bounce" />
                    <h2 className="text-6xl sm:text-9xl font-black text-slate-900 tracking-tighter uppercase">Brilliant!</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.4em] mt-8 mb-14 text-lg sm:text-3xl">You've mastered wide and narrow!</p>
                    <button 
                        onClick={() => { setMode('kid'); setScore(0); resetLevel(0); }}
                        className="bg-emerald-500 text-white px-20 py-8 rounded-[3rem] font-black text-3xl sm:text-5xl shadow-2xl border-b-8 border-emerald-900 active:scale-95 transition-all"
                    >
                        PLAY AGAIN
                    </button>
                    <button 
                        onClick={() => { setMode('practice'); setScore(0); resetLevel(0); }}
                        className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-sm hover:text-slate-600 transition-colors"
                    >
                        Try Practice Mode
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* TUTORIAL HAND */}
      <AnimatePresence>
        {mode === 'kid' && virtualHandPos && !journeyFinished && (
            <motion.div 
                key="v-hand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1 }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand className="text-slate-800 w-16 h-16 sm:w-36 sm:h-36 drop-shadow-2xl" fill="white" />
                    <motion.div animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-blue-400 rounded-full blur-3xl -z-10" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER - ALWAYS PRESENT BUT BEHAVIOR ADAPTS TO MODE */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10 items-center mt-8 pb-20 px-2">
          <button 
            onClick={handleNextSequential}
            disabled={mode === 'kid' && scenarioIdx === SCENARIOS.length - 1}
            className={`group flex items-center justify-between w-full p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] font-black text-xl sm:text-4xl transition-all active:scale-95 shadow-xl border-b-8 ${
              autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-900' : 'bg-slate-800 hover:bg-slate-900 text-white border-slate-950 disabled:opacity-50'
            }`}
          >
            <div className="flex items-center gap-6">
              <div className="bg-white/10 p-4 sm:p-6 rounded-[2rem]">
                 <ChevronRight className="w-8 h-8 sm:w-14 sm:h-14" />
              </div>
              <div className="text-left">
                <div className="uppercase">Next Item</div>
                {autoNextTimer !== null && <div className="text-xs sm:text-sm font-bold opacity-60">Wait for it...</div>}
              </div>
            </div>

            {autoNextTimer !== null && (
              <div className="bg-black/20 px-8 py-4 sm:px-12 sm:py-6 rounded-[2rem] flex items-center gap-4">
                  <Timer className="animate-spin" size={24} />
                  <span className="text-2xl sm:text-4xl">{autoNextTimer}</span>
              </div>
            )}
          </button>

          <button onClick={() => resetLevel(Math.floor(Math.random() * SCENARIOS.length))} className="flex items-center justify-center gap-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[4rem] font-black text-xl sm:text-4xl transition-all active:scale-95 shadow-xl border-b-8 border-emerald-900">
            <Shuffle size={32} className="sm:w-14 sm:h-14" />
            <span className="uppercase">Shuffle</span>
          </button>
      </div>

      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-15px); }
            40%, 80% { transform: translateX(15px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}