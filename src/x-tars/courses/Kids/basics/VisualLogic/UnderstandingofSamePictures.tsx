import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  XCircle, Volume2, VolumeX,
  Trophy, Award, Search, Star
} from 'lucide-react';

// --- Scenarios for Visual Logic Matching ---
const SCENARIOS = [
  { id: 1, name: 'Elephant', targetEmoji: '🐘', matchEmoji: '🐘', decoy1: '🦁', decoy2: '🦒' },
  { id: 2, name: 'Apple', targetEmoji: '🍎', matchEmoji: '🍎', decoy1: '🍌', decoy2: '🍇' },
  { id: 3, name: 'Tree', targetEmoji: '🌳', matchEmoji: '🌳', decoy1: '🌵', decoy2: '🌸' },
  { id: 4, name: 'Sun', targetEmoji: '☀️', matchEmoji: '☀️', decoy1: '☁️', decoy2: '🌙' },
  { id: 5, name: 'Car', targetEmoji: '🚗', matchEmoji: '🚗', decoy1: '🚲', decoy2: '✈️' },
  { id: 6, name: 'Fish', targetEmoji: '🐠', matchEmoji: '🐠', decoy1: '🦀', decoy2: '🐙' },
  { id: 7, name: 'Butterfly', targetEmoji: '🦋', matchEmoji: '🦋', decoy1: '🐝', decoy2: '🐞' },
  { id: 8, name: 'Shoe', targetEmoji: '👟', matchEmoji: '👟', decoy1: '🧦', decoy2: '👕' },
];

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [correctIndex, setCorrectIndex] = useState(null); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerIntervalRef = useRef(null);
  const choiceRefs = useRef([]);
  const audioCtxRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  // Logic for a physical "Wood Block" sound effect
  const playThud = useCallback((frequency = 150) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, audioCtxRef.current.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.1);
    } catch (e) {}
  }, [isMuted]);

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.2; 
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const resetLevel = useCallback((idx, isSequential = false) => {
    setScenarioIdx(idx);
    setCorrectIndex(Math.floor(Math.random() * 3)); 
    
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedIndex(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setJourneyFinished(false);
    tutorialActiveRef.current = false;

    if (mode === 'practice' || (mode === 'kid' && !isSequential)) {
      speak(`Find same pictures!`);
    }
  }, [mode, speak]);

  useEffect(() => {
    resetLevel(0);
  }, []);

  const handleNextSequential = useCallback(() => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      resetLevel(scenarioIdx + 1, true);
    } else {
      if (mode === 'practice') {
        resetLevel(0, true);
      }
    }
  }, [scenarioIdx, resetLevel, mode]);

  const handleSelect = useCallback((index, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    setSelectedIndex(index);
    setIsAnswered(true);

    const isWinnerChoice = (index === correctIndex);

    if (isWinnerChoice) {
      setIsCorrect(true);
      setScore(s => s + 1);
      playThud(440);
      speak(`Wonderful! They are the same!`);
      
      if (mode === 'kid') {
        if (scenarioIdx === SCENARIOS.length - 1) {
            setTimeout(() => setJourneyFinished(true), 1200);
        } else {
            setAutoNextTimer(10);
        }
      } else {
        setAutoNextTimer(10); 
      }
    } else {
      setIsCorrect(false);
      playThud(100);
      speak(`Are they the same? No, they are different. Find same pictures!`);
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedIndex(null);
        }, 2500);
      }
    }
  }, [correctIndex, isAnswered, isCorrect, isAutoPlaying, mode, playThud, scenarioIdx, speak]);

  const moveHandToChoice = useCallback((index) => {
    return new Promise(resolve => {
      const el = choiceRefs.current[index];
      if (!el) return resolve();
      const rect = el.getBoundingClientRect();
      setVirtualHandPos({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      setTimeout(resolve, 1200);
    });
  }, []);

  const startKidModeTutorial = useCallback(async () => {
    if (tutorialActiveRef.current || journeyFinished || correctIndex === null) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);
    
    speak(`Find same pictures! Let's look.`);
    await new Promise(r => setTimeout(r, 1800));
    
    const wrongIndex = (correctIndex + 1) % 3;
    
    await moveHandToChoice(wrongIndex);
    handleSelect(wrongIndex, true); 
    await new Promise(r => setTimeout(r, 3500)); 
    
    setIsAnswered(false);
    setSelectedIndex(null);
    await new Promise(r => setTimeout(r, 1000));

    await moveHandToChoice(correctIndex);
    handleSelect(correctIndex, true);
    
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [correctIndex, moveHandToChoice, handleSelect, speak, journeyFinished]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current && !journeyFinished && correctIndex !== null) {
        const timer = setTimeout(() => { startKidModeTutorial(); }, 2000);
        return () => clearTimeout(timer);
    }
  }, [scenarioIdx, mode, isCorrect, startKidModeTutorial, journeyFinished, correctIndex]);

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

  if (correctIndex === null) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans select-none overflow-x-hidden flex flex-col items-center text-[#7A5C3E]">
      
      {/* Light Wooden Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#D9B99B] rounded-3xl shadow-[0_8px_0_#B8977E] flex items-center justify-center text-white border-2 border-[#EADAC4]">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
                <Search size={40} strokeWidth={3} className="text-white drop-shadow-md" />
              </motion.div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-[#5D4037] tracking-tighter leading-none uppercase">
              Finding Same Fun
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[12px] font-bold text-[#A68B7C] uppercase tracking-[0.2em]">Visual Logic Adventure</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="bg-[#F3E5D5] p-2 rounded-3xl shadow-inner border-2 border-[#EADAC4] flex items-center gap-2">
                <button 
                    onClick={() => { setMode('kid'); setScore(0); resetLevel(0); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${mode === 'kid' ? 'bg-[#7A5C3E] text-white shadow-lg scale-105' : 'text-[#A68B7C] hover:bg-[#EADAC4]'}`}
                >
                    <Play size={16} fill={mode === 'kid' ? 'white' : 'none'} />
                    KID MODE
                </button>
                <button 
                    onClick={() => { setMode('practice'); setScore(0); resetLevel(scenarioIdx); }}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${mode === 'practice' ? 'bg-[#4CAF50] text-white shadow-lg scale-105' : 'text-[#A68B7C] hover:bg-[#EADAC4]'}`}
                >
                    <MousePointer2 size={16} />
                    PRACTICE
                </button>
            </div>
            
            <button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white rounded-2xl shadow-md border-b-4 border-[#E0E0E0] text-[#A68B7C] hover:bg-gray-50 active:translate-y-1 transition-all">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
        </div>
      </div>

      {/* LIGHT OAK TOY STAGE */}
      <div className="w-full max-w-6xl bg-[#EADAC4] rounded-[4rem] sm:rounded-[6rem] p-8 sm:p-16 shadow-[0_25px_0_#B8977E,0_40px_80px_rgba(184,151,126,0.25)] border-[12px] border-[#D9B99B] relative flex flex-col items-center justify-center min-h-[600px] lg:min-h-[750px]">
        
        {/* Look Here Box (Target) */}
        <div className="mb-6 flex flex-col items-center">
            <div className="text-[10px] sm:text-sm font-black uppercase tracking-[0.2em] text-[#A68B7C] mb-3 flex items-center gap-2">
                <Search size={16} /> Look here
            </div>
            <div className="bg-[#FFFBF2] p-6 sm:p-12 rounded-[3.5rem] shadow-2xl border-b-[8px] border-[#D9B99B] flex items-center justify-center">
                <motion.div
                    key={`target-${scenarioIdx}`}
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-8xl sm:text-[10rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                >
                    {currentScenario.targetEmoji}
                </motion.div>
            </div>
        </div>

        {/* Floating Instruction Banner */}
        <div className="mb-10 lg:mb-14">
            <motion.div 
                key={scenarioIdx}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white px-12 py-5 sm:px-24 sm:py-6 rounded-full shadow-xl border-b-8 border-[#F0F0F0] flex items-center gap-4"
            >
                <Star className="text-yellow-400 fill-yellow-400" size={32} />
                <h2 className="text-2xl sm:text-5xl font-black text-[#7A5C3E] uppercase tracking-tighter">
                  Find same pictures
                </h2>
                <Star className="text-yellow-400 fill-yellow-400" size={32} />
            </motion.div>
        </div>

        {/* Comparison Area - THREE BOXES */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 max-w-5xl relative px-2">
            {[0, 1, 2].map((index) => {
                const isEqual = index === correctIndex;
                const isSelected = selectedIndex === index;
                let emoji;
                if (isEqual) emoji = currentScenario.matchEmoji;
                else if (index === (correctIndex + 1) % 3) emoji = currentScenario.decoy1;
                else emoji = currentScenario.decoy2;
                
                return (
                    <motion.button
                        key={`${scenarioIdx}-${index}`}
                        ref={el => choiceRefs.current[index] = el}
                        onClick={() => handleSelect(index)}
                        whileHover={!isAnswered ? { scale: 1.05 } : {}}
                        className={`relative aspect-square sm:aspect-[4/5] bg-[#FFFBF2] rounded-[3rem] sm:rounded-[4rem] shadow-[inset_0_10px_20px_rgba(0,0,0,0.02),0_20px_40px_rgba(0,0,0,0.1)] border-b-[12px] sm:border-b-[20px] flex items-center justify-center transition-all duration-500 ${
                            isSelected 
                                ? (isCorrect && isEqual ? 'border-[#4CAF50] bg-[#F1FCEF]' : 'border-[#FF5252] animate-shake')
                                : isAnswered ? 'opacity-40 border-[#EEE0CB]' : 'border-[#D9B99B] hover:border-[#B8977E]'
                        }`}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-[7rem] sm:text-[9rem] lg:text-[11rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)]"
                        >
                            {emoji}
                        </motion.div>

                        {/* Particle Feedback on Correct Click */}
                        <AnimatePresence>
                            {isSelected && isCorrect && isEqual && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 z-20 pointer-events-none">
                                {[...Array(10)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ 
                                      x: (Math.random() - 0.5) * 300, 
                                      y: (Math.random() - 0.5) * 300,
                                      opacity: 0,
                                      scale: 0.5
                                    }}
                                    className="absolute left-1/2 top-1/2 w-4 h-4 bg-yellow-400 rounded-full"
                                  />
                                ))}
                              </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Feedback Icons */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div 
                                    initial={{ scale: 0, y: 30 }} animate={{ scale: 1.4, y: -60 }} exit={{ scale: 0 }}
                                    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                >
                                    {isCorrect && isEqual ? (
                                        <div className="bg-[#4CAF50] p-4 sm:p-6 rounded-full shadow-2xl border-[6px] border-white">
                                            <CheckCircle2 className="text-white w-10 h-10 sm:w-16 sm:h-16" />
                                        </div>
                                    ) : (
                                        <div className="bg-[#FF5252] p-4 sm:p-6 rounded-full shadow-2xl border-[6px] border-white">
                                            <XCircle className="text-white w-10 h-10 sm:w-16 sm:h-16" />
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
                    className="absolute inset-0 z-[100] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center"
                >
                    <motion.div 
                      className="bg-[#FFFBF2] p-16 sm:p-24 rounded-[5rem] border-b-[24px] border-[#D9B99B] shadow-[0_50px_100px_rgba(0,0,0,0.1)]"
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                        <Trophy size={180} className="text-[#FFC107] mb-10 animate-bounce drop-shadow-[0_10px_20px_rgba(255,193,7,0.3)] mx-auto" />
                        <h2 className="text-6xl sm:text-9xl font-black text-[#7A5C3E] tracking-tighter uppercase leading-none">
                          YOU DID IT!
                        </h2>
                        <p className="text-[#A68B7C] font-black uppercase tracking-[0.4em] mt-8 mb-16 text-xl sm:text-4xl">
                          YOU MATCHED THEM ALL!
                        </p>
                        <button 
                            onClick={() => { setMode('kid'); setScore(0); resetLevel(0); }}
                            className="bg-[#4CAF50] text-white px-24 py-8 rounded-[3.5rem] font-black text-4xl sm:text-6xl shadow-[0_15px_0_#388E3C] active:translate-y-2 active:shadow-none transition-all"
                        >
                            PLAY AGAIN
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-12 pb-24 px-4">
          <button 
            onClick={handleNextSequential}
            disabled={mode === 'kid' && scenarioIdx === SCENARIOS.length - 1}
            className={`group relative flex items-center justify-between w-full p-8 sm:p-12 rounded-[3.5rem] font-black text-2xl sm:text-5xl transition-all active:translate-y-2 shadow-[0_12px_0_rgba(0,0,0,0.1)] border-b-8 ${
              autoNextTimer !== null ? 'bg-[#4CAF50] text-white border-[#388E3C]' : 'bg-[#D9B99B] hover:bg-[#B8977E] text-white border-[#B8977E] disabled:opacity-50 disabled:shadow-none'
            }`}
          >
            <div className="flex items-center gap-8">
              <div className="bg-white/20 p-5 sm:p-7 rounded-3xl">
                 <ChevronRight size={48} strokeWidth={4} />
              </div>
              <div className="text-left leading-none">
                <div className="uppercase tracking-tighter">Next One</div>
                {autoNextTimer !== null && <div className="text-sm font-bold opacity-60 mt-1 tracking-widest uppercase text-white">Wait for it...</div>}
              </div>
            </div>

            {autoNextTimer !== null && (
              <div className="bg-black/10 px-10 py-6 rounded-full flex items-center gap-4">
                  <Timer className="animate-spin text-white" size={32} />
                  <span className="text-4xl text-white font-mono">{autoNextTimer}</span>
              </div>
            )}
          </button>

          <button onClick={() => resetLevel(Math.floor(Math.random() * SCENARIOS.length))} className="flex items-center justify-center gap-8 w-full bg-[#B8977E] hover:bg-[#A68B7C] text-white p-8 sm:p-12 rounded-[3.5rem] font-black text-2xl sm:text-5xl transition-all active:translate-y-2 shadow-[0_12px_0_rgba(0,0,0,0.1)] border-b-8 border-[#A68B7C]">
            <Shuffle size={48} strokeWidth={3} />
            <span className="uppercase tracking-tighter">Shuffle</span>
          </button>
      </div>

      {/* INTERACTIVE TUTORIAL HAND */}
      <AnimatePresence>
        {mode === 'kid' && virtualHandPos && !journeyFinished && (
            <motion.div 
                key="v-hand"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="fixed pointer-events-none z-[500] -translate-x-1/2 -translate-y-1/2"
                style={{ position: 'fixed' }}
            >
                <div className="relative">
                    <Hand className="text-[#7A5C3E] w-24 h-24 sm:w-48 sm:h-48 drop-shadow-2xl" fill="#FFFBF2" />
                    <motion.div animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-yellow-300 rounded-full blur-[60px] -z-10" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            15%, 45%, 75% { transform: translateX(-15px); }
            30%, 60%, 90% { transform: translateX(15px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        
        button:active {
          box-shadow: none !important;
          transform: translateY(8px);
        }
      `}</style>
    </div>
  );
}