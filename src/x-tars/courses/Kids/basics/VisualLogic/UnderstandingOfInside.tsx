import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, 
  Hand, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  Volume2, VolumeX,
  Trophy, PackageSearch, Star
} from 'lucide-react';
import { recordCompletion } from '../../../../courses/CommonUtility/useModuleProgress';
import { useProfile } from '../../../../../context/ProfileContext';

// --- Scenarios updated with user-requested emoji pairings ---
const SCENARIOS = [
  { id: 1, name: 'Cookie', container: '🫙', object: '🍪', label: 'Jar' },
  { id: 2, name: 'Kid', container: '🏠', object: '🧒', label: 'House' },
  { id: 3, name: 'Cat', container: '🚗', object: '🐱', label: 'Car' },
  { id: 4, name: 'Apple', container: '🧺', object: '🍎', label: 'Basket' },
  { id: 5, name: 'Teddy', container: '📦', object: '🧸', label: 'Box' },
  { id: 6, name: 'Fish', container: '🥣', object: '🐠', label: 'Bowl' },
  { id: 7, name: 'Bird', container: '🪹', object: '🐦', label: 'Nest' },
  { id: 8, name: 'Chick', container: '🥚', object: '🐣', label: 'Egg' },
];

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const forcedMode = location.state?.initialMode as 'practice' | 'kid' | null;
  const games = [
    'understandingofsamepictures', 'understandingofabove', 'understandingofbelow',
    'understandingofbig', 'understandingofsmall', 'understandingoftall',
    'understandingofshort', 'understandingoffull', 'understandingofempty',
    'understandingofinside', 'understandingofoutside', 'understandingofaboveandbelow',
    'understandingofbigandsmallmix', 'understandingoffullandemptymix',
    'understandingofinsideandoutsidemix', 'understandingoftallandshort'
  ];
  
  const [mode, setMode] = useState<'practice' | 'kid'>(forcedMode || 'kid'); 
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [insideSide, setInsideSide] = useState<'left' | 'right'>('left'); 
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedSide, setSelectedSide] = useState<string | null>(null);
  const [autoNextTimer, setAutoNextTimer] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [virtualHandPos, setVirtualHandPos] = useState<{ x: number; y: number } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [journeyFinished, setJourneyFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sideRefs = useRef<{ left: HTMLButtonElement | null; right: HTMLButtonElement | null }>({ left: null, right: null });
  const audioCtxRef = useRef<AudioContext | null>(null);
  const tutorialActiveRef = useRef(false);

  const currentScenario = SCENARIOS[scenarioIdx];

  const playThud = useCallback((frequency = 150) => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, [isMuted]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.2; 
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const resetLevel = useCallback((idx: number, isSequential = false) => {
    setScenarioIdx(idx);
    const newInsideSide = Math.random() > 0.5 ? 'left' : 'right';
    setInsideSide(newInsideSide as 'left' | 'right');
    setIsAnswered(false);
    setIsCorrect(false);
    setSelectedSide(null);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setJourneyFinished(false);
    tutorialActiveRef.current = false;

    if (mode === 'practice' || (mode === 'kid' && !isSequential)) {
      speak(`Look closely! Which ${SCENARIOS[idx].name} is inside the ${SCENARIOS[idx].label}?`);
    }
  }, [mode, speak]);

  const handleNextSequential = useCallback(() => {
    if (scenarioIdx < SCENARIOS.length - 1) {
      resetLevel(scenarioIdx + 1, true);
    } else {
      if (mode === 'practice') resetLevel(0, true);
    }
  }, [scenarioIdx, resetLevel, mode]);

  const handleSelect = useCallback((side: string, isTutorial = false) => {
    if (!isTutorial && isAutoPlaying) return;
    if (isAnswered && isCorrect) return;

    setSelectedSide(side);
    setIsAnswered(true);

    const isWinnerSide = (side === insideSide);

    if (isWinnerSide) {
      setIsCorrect(true);
      setScore(s => { const ns = s + 1; recordCompletion('inside', 8, ns); return ns; });
      playThud(440); 
      speak(`Wonderful! The ${currentScenario.name} is inside!`);
      
      if (mode === 'kid') {
        if (scenarioIdx === SCENARIOS.length - 1) {
          if (forcedMode === 'kid') {
            const currentGameIndex = games.indexOf('understandingofinside');
            const nextGameIndex = currentGameIndex + 1;
            if (nextGameIndex < games.length) {
              const nextGame = games[nextGameIndex];
              setTimeout(() => navigate(`/xtars/games/visuallogic/${nextGame}`, { state: { initialMode: 'kid' } }), 3000);
            } else {
              setTimeout(() => setJourneyFinished(true), 1200);
            }
          } else {
              setTimeout(() => setJourneyFinished(true), 1200);
          }
        } else {
          setAutoNextTimer(10);
        }
      } else {
        setAutoNextTimer(10); 
      }
    } else {
      setIsCorrect(false);
      playThud(100); 
      speak("Oops, try again! We can find it!");
      if (!isTutorial) {
        setTimeout(() => {
          setIsAnswered(false);
          setSelectedSide(null);
        }, 2500);
      }
    }
  }, [insideSide, isAnswered, isCorrect, isAutoPlaying, mode, playThud, currentScenario.name, speak, scenarioIdx, forcedMode, games, navigate]);

  const moveHandToSide = useCallback((side: 'left' | 'right') => {
    return new Promise<void>(resolve => {
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
    
    speak(`Let's find the ${currentScenario.name} that is inside the ${currentScenario.label}.`);
    await new Promise(r => setTimeout(r, 1800));
    
    const correctSide = insideSide;
    const wrongSide = insideSide === 'left' ? 'right' : 'left';
    
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
  }, [currentScenario, insideSide, moveHandToSide, handleSelect, speak, journeyFinished]);

  useEffect(() => {
    if (mode === 'kid' && !isCorrect && !tutorialActiveRef.current && !journeyFinished) {
        const timer = setTimeout(() => startKidModeTutorial(), 5500);
        return () => clearTimeout(timer);
    }
  }, [scenarioIdx, mode, isCorrect, startKidModeTutorial, journeyFinished]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      handleNextSequential();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, handleNextSequential]);

  useEffect(() => { resetLevel(0); }, []);

  return (
    <div className="w-full h-full min-h-[calc(100vh-70px)] flex-grow bg-[#FDFBF7] p-1 sm:p-2 pt-1 sm:pt-2 md:pt-2 font-sans select-none flex flex-col items-center justify-start text-[#7A5C3E] overflow-x-hidden relative gap-2 sm:gap-4">
      
      <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 flex-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#D9B99B] rounded-xl sm:rounded-2xl shadow-[0_3px_0_#B8977E] flex items-center justify-center text-white border-2 border-[#EADAC4]">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }}>
                <PackageSearch strokeWidth={3} className="text-white drop-shadow-md w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
          </div>
          <div className="text-left">
            <h1 className="text-lg sm:text-2xl font-black text-[#5D4037] tracking-tighter leading-none uppercase">
              Finding Inside Fun
            </h1>
            <div className="flex items-center gap-2 mt-1 hidden sm:flex">
               <p className="text-[10px] font-bold text-[#A68B7C] uppercase tracking-[0.1em]">Visual Logic Discovery</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-0">
          {activeProfile?.type !== 'KIDS' && (
            <div className="group relative bg-[#F3E5D5] p-1 sm:p-2 rounded-xl sm:rounded-2xl shadow-inner border-2 border-[#EADAC4] flex items-center gap-1 sm:gap-2">
                  <div className="absolute top-full mt-2 right-0 w-52 sm:w-60 bg-white p-3 rounded-xl shadow-xl border-2 border-[#EADAC4] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 z-[100]">
                      <p className="text-[10px] sm:text-xs font-medium text-[#7A5C3E] leading-snug text-left">
                          <span className="font-black text-sm">🧸 Kid Mode:</span><br/>Guidance with virtual hand.<br/>
                          <span className="font-black text-sm mt-1 block">🖐️ Practice:</span><br/>Free play exploration.
                      </p>
                  </div>
                <button 
                    onClick={() => { setMode('kid'); setScore(0); resetLevel(scenarioIdx); }}
                    className={`min-w-[44px] min-h-[44px] sm:min-w-[56px] sm:min-h-[56px] justify-center flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] font-black transition-all ${mode === 'kid' ? 'bg-[#7A5C3E] text-white shadow-md scale-105' : 'text-[#A68B7C] hover:bg-[#EADAC4]'}`}
                >
                    <Play size={14} fill={mode === 'kid' ? 'white' : 'none'} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button 
                    onClick={() => { setMode('practice'); setScore(0); resetLevel(scenarioIdx); }}
                    className={`min-w-[44px] min-h-[44px] sm:min-w-[56px] sm:min-h-[56px] justify-center flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-[#4CAF50] text-white shadow-md scale-105' : 'text-[#A68B7C] hover:bg-[#EADAC4]'}`}
                >
                    <MousePointer2 size={14} className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
            </div>
          )}
            
            <button onClick={() => setIsMuted(!isMuted)} className="min-w-[44px] min-h-[44px] sm:min-w-[56px] sm:min-h-[56px] flex items-center justify-center p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border-b-2 sm:border-b-4 border-[#E0E0E0] text-[#A68B7C] hover:bg-gray-50 active:translate-y-1 transition-all">
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
        </div>
      </div>

      <div className="w-full max-w-4xl flex-1 min-h-0 bg-[#EADAC4] rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-6 shadow-[0_6px_0_#B8977E,0_10px_20px_rgba(184,151,126,0.25)] border-[4px] sm:border-[6px] border-[#D9B99B] relative flex flex-col items-center justify-center mt-6 sm:mt-8 mb-4">
        
        <div className="absolute top-0 transform -translate-y-1/2 z-20">
            <motion.div 
                key={scenarioIdx}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white px-6 py-2 sm:px-10 sm:py-4 rounded-full shadow-md border-b-[3px] sm:border-b-[4px] border-[#F0F0F0] flex items-center gap-2 sm:gap-4"
            >
                {activeProfile?.type !== 'KIDS' && <Star className="text-yellow-400 fill-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />}
                <h2 className="text-lg sm:text-2xl font-black text-[#7A5C3E] uppercase tracking-tighter">FIND INSIDE</h2>
                {activeProfile?.type !== 'KIDS' && <Star className="text-yellow-400 fill-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />}
            </motion.div>
        </div>

        <div className="absolute top-4 sm:top-5 left-4 sm:left-6 z-20 flex items-center gap-1 sm:gap-1.5">
            {SCENARIOS.map((_, i) => (
                <div key={i} className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${i === scenarioIdx ? 'bg-[#7A5C3E] scale-125' : i < scenarioIdx ? 'bg-[#4CAF50]' : 'bg-[#D9B99B] border border-[#a68b7c]/20 bg-opacity-30'}`} />
            ))}
        </div>
        <div className="absolute top-3 sm:top-4 right-4 sm:right-6 z-20 flex items-center gap-1.5 sm:gap-2 bg-white/70 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 sm:border-[3px] border-[#D9B99B] shadow-md backdrop-blur-sm">
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-400 drop-shadow-[0_2px_4px_rgba(234,179,8,0.5)]" />
            <span className="text-lg sm:text-2xl font-black text-[#7A5C3E]">{score}</span>
        </div>

        <div className="w-full grid grid-cols-2 gap-6 sm:gap-12 relative px-4 z-10 pb-4 mt-8 sm:mt-10">
            {(['left', 'right'] as const).map((side) => {
                const isInsideSlot = side === insideSide;
                const isSelected = selectedSide === side;
                
                return (
                    <motion.button
                        key={`${scenarioIdx}-${side}`}
                        ref={el => { sideRefs.current[side] = el; }}
                        onClick={() => { if (mode !== 'kid') handleSelect(side); }}
                        whileHover={!isAnswered && mode !== 'kid' ? { scale: 1.02 } : {}}
                        className={`relative aspect-[4/5] sm:aspect-[4/3] w-full bg-[#FFFBF2] rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[inset_0_4px_8px_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.08)] border-b-[6px] sm:border-b-[10px] flex items-center justify-center transition-all duration-500 overflow-hidden ${
                            isSelected 
                                ? (isCorrect && isInsideSlot ? 'border-[#4CAF50] bg-[#F1FCEF]' : 'border-[#FFB74D] animate-wobble')
                                : isAnswered ? 'opacity-40 border-[#EEE0CB]' : 'border-[#D9B99B] hover:border-[#B8977E]'
                        }`}
                    >
                        <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                            <div className={`absolute w-[80%] h-[75%] sm:h-[80%] border-4 border-dashed rounded-[1rem] transition-colors duration-500 ${isInsideSlot ? 'border-[#D9B99B]' : 'border-transparent'}`} />

                            <div className="relative w-full h-full flex items-center justify-center">
                                <motion.div
                                    animate={{ 
                                      scale: 1.1,
                                      x: isInsideSlot ? "0%" : "-15%"
                                    }}
                                    className="text-[clamp(5rem,min(22vh,26vw),14rem)] drop-shadow-xl z-10 flex items-center justify-center"
                                >
                                    {currentScenario.container}
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ 
                                      scale: isInsideSlot ? 0.6 : 0.9, 
                                      x: isInsideSlot ? "0%" : "30%",         
                                      y: isInsideSlot ? "15%" : "0%",        
                                      filter: isInsideSlot ? 'brightness(0.95) saturate(1.1)' : 'brightness(1)',
                                    }}
                                    transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.1 }}
                                    className="absolute text-[clamp(5rem,min(22vh,26vw),14rem)] z-20 drop-shadow-lg flex items-center justify-center"
                                >
                                    {currentScenario.object}
                                </motion.div>
                                
                                {isInsideSlot && (
                                  <div className="absolute inset-4 bg-[#7A5C3E]/5 rounded-[1.5rem] pointer-events-none z-[15]" />
                                )}
                            </div>
                        </div>

                        <AnimatePresence>
                            {isSelected && (
                                <motion.div 
                                    initial={{ scale: 0, y: 30 }} animate={{ scale: 1.2, y: -40 }} exit={{ scale: 0 }}
                                    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                >
                                    {isCorrect && isInsideSlot ? (
                                        <div className="bg-[#4CAF50] p-2 sm:p-4 rounded-full shadow-2xl border-[4px] sm:border-[8px] border-white">
                                            <CheckCircle2 className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>
                                    ) : (
                                        <div className="bg-[#FFB74D] p-2 sm:p-4 rounded-full shadow-2xl border-[4px] sm:border-[8px] border-white flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16">
                                            <span className="text-white font-black text-2xl sm:text-4xl leading-none">?</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>

        <AnimatePresence>
            {journeyFinished && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 sm:p-8 text-center rounded-[1rem] sm:rounded-[2rem] overflow-hidden"
                >
                    <motion.div 
                      className="bg-[#FFFBF2] p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] border-b-[8px] sm:border-b-[12px] border-[#D9B99B] shadow-[0_20px_40px_rgba(0,0,0,0.1)] w-full max-w-2xl"
                      initial={{ scale: 0.5, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                    >
                        <Trophy className="text-[#FFC107] mb-4 sm:mb-6 animate-bounce drop-shadow-[0_10px_20px_rgba(255,193,7,0.3)] mx-auto w-16 sm:w-20 h-auto" />
                        <h2 className="text-3xl sm:text-5xl font-black text-[#7A5C3E] tracking-tighter uppercase leading-none">YOU DID IT!</h2>
                        <p className="text-[#A68B7C] font-black uppercase tracking-[0.1em] mt-2 sm:mt-4 mb-6 sm:mb-8 text-xs sm:text-sm">YOU ARE AN INSIDE EXPERT!</p>
                        <button 
                            onClick={() => { setMode(forcedMode || 'kid'); setScore(0); resetLevel(0); }}
                            className="bg-[#4CAF50] text-white px-8 py-3 sm:px-10 sm:py-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-xl sm:text-2xl shadow-[0_6px_0_#388E3C] active:translate-y-1 active:shadow-none transition-all"
                        >
                            PLAY AGAIN
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-3 sm:gap-4 items-center flex-none">
        <button
          onClick={handleNextSequential}
          disabled={mode === 'kid' && scenarioIdx === SCENARIOS.length - 1}
          className={`flex items-center justify-center gap-2 sm:gap-3 w-full h-14 sm:h-16 rounded-[1.2rem] sm:rounded-[1.5rem] font-black text-base sm:text-lg transition-all active:translate-y-1 active:shadow-none shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-[4px] sm:border-b-[6px] ${
            autoNextTimer !== null ? 'bg-[#4CAF50] text-white border-[#388E3C]' : 'bg-[#D9B99B] hover:bg-[#B8977E] text-white border-[#B8977E] disabled:opacity-50 disabled:shadow-none'
          }`}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <ChevronRight strokeWidth={4} className="w-6 h-6 sm:w-8 sm:h-8" />
            {activeProfile?.type !== 'KIDS' && (
              <div className="flex flex-col items-start translate-y-0.5 hidden sm:flex">
                  <span className="text-[10px] sm:text-xs font-bold opacity-80 leading-none">GO TO</span>
                  <span className="uppercase tracking-tighter leading-none mt-0.5">NEXT</span>
              </div>
            )}
          </div>

          {autoNextTimer !== null && (
            <div className="bg-black/10 px-2 py-1 rounded-full flex items-center gap-1 sm:gap-2 ml-2">
              <Timer className="animate-spin text-white w-4 h-4" />
              <span className="text-sm sm:text-base text-white font-mono">{autoNextTimer}</span>
            </div>
          )}
        </button>

        <button 
          onClick={() => resetLevel(Math.floor(Math.random() * SCENARIOS.length))} 
          className="flex items-center justify-center gap-2 sm:gap-3 w-full h-14 sm:h-16 bg-[#D9B99B] hover:bg-[#B8977E] text-white rounded-[1.2rem] sm:rounded-[1.5rem] font-black text-base sm:text-lg transition-all active:translate-y-1 active:shadow-none shadow-[0_4px_0_rgba(0,0,0,0.1)] border-b-[4px] sm:border-b-[6px] border-[#B8977E]"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
          <Shuffle strokeWidth={4} className="w-6 h-6 sm:w-8 sm:h-8" />
          {activeProfile?.type !== 'KIDS' && (
            <div className="flex flex-col items-start translate-y-0.5 hidden sm:flex">
                <span className="text-[10px] sm:text-xs font-bold opacity-80 leading-none">MIX</span>
                <span className="uppercase tracking-tighter leading-none mt-0.5">SHUFFLE</span>
            </div>
          )}
        </div>
        </button>
      </div>

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
                    <Hand className="text-[#7A5C3E] w-20 h-20 sm:w-32 sm:h-32 drop-shadow-2xl" fill="#FFFBF2" />
                    <motion.div animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-yellow-300 rounded-full blur-[40px] -z-10" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes wobble { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-5deg); } 75% { transform: rotate(5deg); } }
        .animate-wobble { animation: wobble 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}