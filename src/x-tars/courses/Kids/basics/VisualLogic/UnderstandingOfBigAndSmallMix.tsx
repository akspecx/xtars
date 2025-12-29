import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  XCircle, Volume2, VolumeX,
  Trophy, Award, Maximize, Minimize, Star
} from 'lucide-react';

// --- Expanded Mixed Scenarios: 16 objects (Animals, Vegetables, and Vehicles) ---
const SCENARIOS = [
  { id: 1, name: 'Lion', emoji: '🦁' },
  { id: 2, name: 'Broccoli', emoji: '🥦' },
  { id: 3, name: 'Car', emoji: '🚗' },
  { id: 4, name: 'Elephant', emoji: '🐘' },
  { id: 5, name: 'Tomato', emoji: '🍅' },
  { id: 6, name: 'Plane', emoji: '✈️' },
  { id: 7, name: 'Cow', emoji: '🐄' },
  { id: 8, name: 'Carrot', emoji: '🥕' },
  { id: 9, name: 'Monkey', emoji: '🐒' },
  { id: 10, name: 'Corn', emoji: '🌽' },
  { id: 11, name: 'Bus', emoji: '🚌' },
  { id: 12, name: 'Dog', emoji: '🐶' },
  { id: 13, name: 'Eggplant', emoji: '🍆' },
  { id: 14, name: 'Bike', emoji: '🚲' },
  { id: 15, name: 'Horse', emoji: '🐎' },
  { id: 16, name: 'Boat', emoji: '⛵' },
];

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [targetSize, setTargetSize] = useState('big'); // Challenge: 'big' or 'small'
  const [isBigSide, setIsBigSide] = useState('left'); // Physical position of the large emoji
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerIntervalRef = useRef(null);
  const sideRefs = useRef({ left: null, right: null });
  const audioCtxRef = useRef(null);
  const tutorialActiveRef = useRef(false);

  const currentScenario = SCENARIOS[scenarioIdx];

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
    
    // Randomize Physical Position
    setIsBigSide(Math.random() > 0.5 ? 'left' : 'right');
    
    // Randomize Challenge Goal (Big vs Small)
    const newTarget = Math.random() > 0.5 ? 'big' : 'small';
    setTargetSize(newTarget);

    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedSide(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setJourneyFinished(false);
    tutorialActiveRef.current = false;

    if (mode === 'practice' || (mode === 'kid' && !isSequential)) {
      speak(`Look closely! Which ${SCENARIOS[idx].name} is ${newTarget}?`);
    }
  }, [mode, speak]);

  const handleNextSequential = useCallback(() => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      resetLevel(scenarioIdx + 1, true);
    } else {
      if (mode === 'practice') resetLevel(0, true);
    }
  }, [scenarioIdx, resetLevel, mode]);

  const handleSelect = useCallback((side, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    setSelectedSide(side);
    setIsAnswered(true);

    const isWinnerSide = targetSize === 'big' ? (side === isBigSide) : (side !== isBigSide);

    if (isWinnerSide) {
      setIsCorrect(true);
      setScore(s => s + 1);
      playThud(440); 
      speak(`Perfect! That is the ${targetSize} ${currentScenario.name}!`);
      
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
      speak(`Oh! That one is ${targetSize === 'big' ? 'small' : 'big'}. Find the ${targetSize} one!`);
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedSide(null);
        }, 2500);
      }
    }
  }, [isBigSide, targetSize, isAnswered, isCorrect, isAutoPlaying, mode, playThud, currentScenario.name, speak]);

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
    
    speak(`Let's find the ${currentScenario.name} that is ${targetSize}.`);
    await new Promise(r => setTimeout(r, 1800));
    
    const correctSide = targetSize === 'big' ? isBigSide : (isBigSide === 'left' ? 'right' : 'left');
    const wrongSide = correctSide === 'left' ? 'right' : 'left';
    
    await moveHandToSide(wrongSide);
    handleSelect(wrongSide, true); 
    await new Promise(r => setTimeout(r, 3500)); 
    
    setIsAnswered(false);
    setSelectedSide(null);
    await new Promise(r => setTimeout(r, 1000));

    await moveHandToSide(correctSide);
    handleSelect(correctSide, true);
    
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [currentScenario, targetSize, isBigSide, moveHandToSide, handleSelect, speak, journeyFinished]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current && !journeyFinished) {
        const timer = setTimeout(() => startKidModeTutorial(), 2000);
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

  useEffect(() => { resetLevel(0); }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans select-none flex flex-col items-center text-[#7A5C3E]">
      
      {/* Dynamic Header */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#D9B99B] rounded-3xl shadow-[0_8px_0_#B8977E] flex items-center justify-center text-white border-2 border-[#EADAC4]">
              <motion.div 
                key={targetSize}
                initial={{ scale: 0.5 }} 
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                {targetSize === 'big' ? <Maximize size={40} strokeWidth={3} /> : <Minimize size={40} strokeWidth={3} />}
              </motion.div>
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-[#5D4037] tracking-tighter leading-none uppercase">
              Big & Small Fun
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <p className="text-[12px] font-bold text-[#A68B7C] uppercase tracking-[0.2em]">Learning Hub Adventure</p>
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

      {/* TOY STAGE */}
      <div className="w-full max-w-6xl bg-[#EADAC4] rounded-[4rem] sm:rounded-[6rem] p-8 sm:p-16 shadow-[0_25px_0_#B8977E,0_40px_80px_rgba(184,151,126,0.25)] border-[12px] border-[#D9B99B] relative flex flex-col items-center justify-center min-h-[600px] lg:min-h-[750px]">
        
        {/* Instruction Banner */}
        <div className="absolute top-[-40px] z-20">
            <motion.div 
                key={`${scenarioIdx}-${targetSize}`}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white px-12 py-5 sm:px-24 sm:py-8 rounded-full shadow-xl border-b-8 border-[#F0F0F0] flex items-center gap-4"
            >
                <Star className="text-yellow-400 fill-yellow-400" size={32} />
                <h2 className="text-3xl sm:text-6xl font-black text-[#7A5C3E] uppercase tracking-tighter">
                  FIND {targetSize}
                </h2>
                <Star className="text-yellow-400 fill-yellow-400" size={32} />
            </motion.div>
        </div>

        {/* Comparison Grid */}
        <div className="w-full grid grid-cols-2 gap-10 sm:gap-24 max-w-5xl relative px-4 mt-12">
            {['left', 'right'].map((side) => {
                const isLargeSlot = side === isBigSide;
                const isSelected = selectedSide === side;
                const isCorrectChoice = targetSize === 'big' ? (side === isBigSide) : (side !== isBigSide);
                
                return (
                    <motion.button
                        key={`${scenarioIdx}-${side}`}
                        ref={el => sideRefs.current[side] = el}
                        onClick={() => handleSelect(side)}
                        whileHover={!isAnswered ? { scale: 1.02 } : {}}
                        className={`relative aspect-[4/5] sm:aspect-square bg-[#FFFBF2] rounded-[4rem] sm:rounded-[5.5rem] shadow-[inset_0_10px_20px_rgba(0,0,0,0.02),0_20px_40px_rgba(0,0,0,0.1)] border-b-[16px] sm:border-b-[24px] flex items-center justify-center transition-all duration-500 overflow-hidden ${
                            isSelected 
                                ? (isCorrect && isCorrectChoice ? 'border-[#4CAF50] bg-[#F1FCEF]' : 'border-[#FF5252] animate-shake')
                                : isAnswered ? 'opacity-40 border-[#EEE0CB]' : 'border-[#D9B99B] hover:border-[#B8977E]'
                        }`}
                    >
                        {/* THE OBJECT - Sizes adjusted to prevent clipping (1.3x for big, 0.65x for small) */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ 
                              scale: isLargeSlot ? 1.3 : 0.65,
                              filter: isSelected && !isCorrectChoice ? 'grayscale(1)' : 'grayscale(0)'
                            }}
                            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
                            className="text-[8rem] sm:text-[11rem] lg:text-[14rem] drop-shadow-[0_15px_15px_rgba(0,0,0,0.15)] flex items-center justify-center"
                        >
                            {currentScenario.emoji}
                        </motion.div>

                        {/* Particle Feedback */}
                        <AnimatePresence>
                            {isSelected && isCorrect && isCorrectChoice && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 z-20 pointer-events-none">
                                {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ x: 0, y: 0, opacity: 1 }}
                                    animate={{ 
                                      x: (Math.random() - 0.5) * 400, 
                                      y: (Math.random() - 0.5) * 400,
                                      opacity: 0,
                                      scale: 0.5
                                    }}
                                    className="absolute left-1/2 top-1/2 w-4 h-4 bg-yellow-400 rounded-full"
                                  />
                                ))}
                              </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Icons */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div 
                                    initial={{ scale: 0, y: 30 }} animate={{ scale: 1.5, y: -80 }} exit={{ scale: 0 }}
                                    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                >
                                    {isCorrect && isCorrectChoice ? (
                                        <div className="bg-[#4CAF50] p-5 sm:p-8 rounded-full shadow-2xl border-[8px] border-white">
                                            <CheckCircle2 className="text-white w-12 h-12 sm:w-24 sm:h-24" />
                                        </div>
                                    ) : (
                                        <div className="bg-[#FF5252] p-5 sm:p-8 rounded-full shadow-2xl border-[8px] border-white">
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
                          YOU ARE A SIZE EXPERT!
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

      {/* TUTORIAL HAND */}
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