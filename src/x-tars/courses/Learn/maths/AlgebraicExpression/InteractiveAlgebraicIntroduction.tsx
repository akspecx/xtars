import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, Scale,
  Trophy, Sparkles, Volume2, VolumeX,
  Clock,ChevronLeft
} from 'lucide-react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useParams 
} from 'react-router-dom';

// --- Assets & Configuration ---
const FRUIT_LIBRARY = [
  { icon: '🍎', name: 'Apple', weight: 2 },
  { icon: '🍊', name: 'Orange', weight: 3 },
  { icon: '🍐', name: 'Pear', weight: 4 },
  { icon: '🍓', name: 'Strawberry', weight: 1 },
  { icon: '🍋', name: 'Lemon', weight: 5 },
];

export default function App() {
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/learn/mathematics/algebra");
  };
  const [mode, setMode] = useState('practice'); 
  const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
  const [targetWeight, setTargetWeight] = useState(6);
  const [placedCount, setPlacedCount] = useState(0); 
  const [isBalanced, setIsBalanced] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOverTarget, setIsOverTarget] = useState(false); 
  const [dragId, setDragId] = useState(0); 
  
  const timerIntervalRef = useRef(null);
  const leftPanRef = useRef(null);
  const appleDragRef = useRef(null);
  const appleGhostRef = useRef(null);
  const tutorialActiveRef = useRef(false);
  const modeRef = useRef(mode);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const leftWeight = placedCount * currentFruit.weight;
  const weightDiff = targetWeight - leftWeight;
  const rotation = Math.max(-22, Math.min(22, weightDiff * 7.5));

  const speakMessage = useCallback(async (text) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  const isPointInsideRect = (point, rect) => {
    const buffer = 45; 
    return (
      point.x >= rect.left - buffer &&
      point.x <= rect.right + buffer &&
      point.y >= rect.top - buffer &&
      point.y <= rect.bottom + buffer
    );
  };

  const getPointFromEvent = (event) => {
    if (event?.clientX != null && event.clientX !== 0) {
      return { x: event.clientX, y: event.clientY };
    }
    if (event?.touches?.[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (event?.changedTouches?.[0]) {
      return { x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY };
    }
    return null;
  };

  const shuffleMission = useCallback(() => {
    const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 2; 
    const newTarget = randomFruit.weight * randomQuantity;

    setCurrentFruit(randomFruit);
    setTargetWeight(newTarget);
    setPlacedCount(0);
    setIsBalanced(false);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
    setVirtualHandPos(null);
    
    speakMessage(`New mission! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
  }, [speakMessage]);

  const resetLevel = useCallback(() => {
    setPlacedCount(0);
    setIsBalanced(false);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
    setVirtualHandPos(null);
    speakMessage(`Balance the scale using ${currentFruit.name}s.`);
  }, [currentFruit.name, speakMessage]);

  useEffect(() => {
    if (leftWeight === targetWeight && !isBalanced) {
      setIsBalanced(true);
      speakMessage(`Perfect! It took ${placedCount} ${currentFruit.name}s!`);
      setAutoNextTimer(10);
    } else if (leftWeight !== targetWeight) {
      setIsBalanced(false);
      setAutoNextTimer(null);
    }
  }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

  const addItem = useCallback((isTutorial = false) => {
    if (!isTutorial && isAutoPlaying && modeRef.current === 'concept') return;
    if (isTutorial && modeRef.current !== 'concept') return;

    setPlacedCount(prev => {
        if (prev >= 15) return prev;
        const newVal = prev + 1;
        const newWeight = newVal * currentFruit.weight;
        if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
        else if (newWeight > targetWeight) speakMessage("Too heavy!");
        return newVal;
    });
  }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

  const moveHand = async (fromRect, toRect) => {
    if (modeRef.current !== 'concept') return;
    setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
    await new Promise(r => setTimeout(r, 800));
    if (modeRef.current !== 'concept') return;
    setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
    await new Promise(r => setTimeout(r, 1200));
  };

  const startConceptBuilding = useCallback(async () => {
    if (tutorialActiveRef.current || isBalanced) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);

    await new Promise(r => setTimeout(r, 1500));
    if (modeRef.current !== 'concept' || isBalanced) {
        tutorialActiveRef.current = false;
        setIsAutoPlaying(false);
        return;
    }

    speakMessage(`Concept Building: Target is ${targetWeight} grams.`);
    await new Promise(r => setTimeout(r, 2000));

    const needed = targetWeight / currentFruit.weight;

    for (let i = 0; i < needed; i++) {
        if (modeRef.current !== 'concept' || isBalanced) break;
        if (!appleGhostRef.current || !leftPanRef.current) break;
        
        const sourceRect = appleGhostRef.current.getBoundingClientRect();
        const targetRect = leftPanRef.current.getBoundingClientRect();
        
        setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
        await new Promise(r => setTimeout(r, 1000));
        if (modeRef.current !== 'concept') break;
        setIsGrabbing(true);
        await new Promise(r => setTimeout(r, 500));
        setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
        await new Promise(r => setTimeout(r, 1200));
        if (modeRef.current !== 'concept') break;
        setIsGrabbing(false);
        addItem(true);
        await new Promise(r => setTimeout(r, 800));
    }

    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
  }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

  useEffect(() => {
    if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
      const t = setTimeout(startConceptBuilding, 1500);
      return () => clearTimeout(t);
    } else if (mode === 'practice') {
      setIsAutoPlaying(false);
      setIsGrabbing(false);
      setVirtualHandPos(null);
      tutorialActiveRef.current = false;
    }
  }, [mode, isBalanced, startConceptBuilding]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      shuffleMission();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, shuffleMission]);

  // --- INTERACTION HANDLERS ---
  const handleDragUpdate = (event) => {
    if (!leftPanRef.current) return;
    const point = getPointFromEvent(event);
    if (!point) return;

    const rect = leftPanRef.current.getBoundingClientRect();
    setIsOverTarget(isPointInsideRect(point, rect));
  };

  const handleDragEnd = (event) => {
    setIsOverTarget(false);
    if (!leftPanRef.current) return;

    const point = getPointFromEvent(event);
    if (!point) {
      setDragId(p => p + 1);
      return;
    }

    const rect = leftPanRef.current.getBoundingClientRect();
    const success = isPointInsideRect(point, rect);

    if (success && !isBalanced && mode === 'practice') {
      addItem();
    }
    
    setDragId(p => p + 1);
  };
  
  const renderHeader = () => (
    <header className="w-full max-w-5xl mb-2 bg-[#3e2723] p-4 sm:p-6 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border-b-4 border-black/30 relative overflow-hidden shrink-0 shadow-2xl">
      
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
        }}
      />
  
      <div className="relative z-10 flex justify-between items-end">
        {/* LEFT */}
        <div className="flex flex-col gap-2 text-left">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#a88a6d] font-black uppercase text-[10px] hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={14} />
            Back to Dashboard
          </button>
  
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-[#e6dccb] rotate-45 shadow-glow" />
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">
              Weight Lab
            </h2>
          </div>
        </div>
  
        {/* RIGHT */}
        <div className="hidden md:flex flex-col items-end">
              <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
                  <button onClick={() => { setMode('concept'); resetLevel(); }}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                      CONCEPT BUILDING
                  </button>
                  <button onClick={() => { setMode('practice'); resetLevel(); }}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                      PRACTICE
                  </button>
                  <div>
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                        <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center px-2 py-1 z-50 mb-1">
        {renderHeader()}
      </div>

      {/* THE STAGE */}
      <div className="flex-[0.8] w-full max-w-5xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        {/* SCALE ASSEMBLY - Added mt-14/mt-20 for more top space */}
        <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.45] sm:scale-[0.7] origin-top transition-transform overflow-visible mt-14 sm:mt-20">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[200px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
                    className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
                    style={{ originX: 0.5, originY: 0.5 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LEFT PAN (LOAD) */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <motion.div 
                          ref={leftPanRef} 
                          animate={{ 
                            scale: isOverTarget ? 1.08 : 1,
                            backgroundColor: isOverTarget ? "#8d6e63" : "#a88a6d"
                          }}
                          className={`w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8 transition-all duration-200 ${isOverTarget ? 'ring-8 ring-white/40' : ''}`}
                        >
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10 pointer-events-none">
                                {[...Array(placedCount)].map((_, i) => (
                                    <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-3xl sm:text-6xl drop-shadow-lg pointer-events-none">{currentFruit.icon}</motion.div>
                                ))}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg pointer-events-none">{leftWeight}g</div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT PAN (MASTER) */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        {/* MESSAGING ZONE - bottom-24/bottom-36 lifts it closer to the scale */}
        <div className="absolute bottom-8 sm:bottom-16 left-0 w-full flex justify-center pointer-events-none px-4 text-center">
            <AnimatePresence mode="wait">
                {isBalanced ? (
                    <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg px-4">
                        <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
                            <Trophy size={24} className="animate-bounce shrink-0" />
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Balanced!</span>
                                <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
                            </div>
                            <Sparkles size={20} className="text-yellow-300 shrink-0" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-2 sm:px-8 sm:py-3 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
                        <p className="text-xs sm:text-xl font-bold text-[#5d4037] leading-tight text-center">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* DEPOT AREA */}
      <div className="w-full max-w-5xl flex flex-col items-center mt-2 z-50 mb-1">
        <div className="bg-[#dfd7cc] p-2 sm:p-4 rounded-[2rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Bin</div>
            <div className="flex items-center gap-8 sm:gap-16">
                <div className="text-center bg-white/40 p-2 sm:p-3 rounded-2xl border-2 border-white shadow-inner">
                    <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl drop-shadow-md">{currentFruit.icon}</span>
                        <span className="text-xl sm:text-2xl font-black text-[#5d4037] tracking-tighter leading-none">= {currentFruit.weight}g</span>
                    </div>
                </div>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
                   
                   <div ref={appleGhostRef} className="absolute inset-0 flex items-center justify-center text-[38px] sm:text-[60px] opacity-100 pointer-events-none">
                     {currentFruit.icon}
                   </div>

                   {!isBalanced && mode === 'practice' && (
                     <motion.div 
                        key={`drag-source-${placedCount}-${dragId}`} 
                        ref={appleDragRef} 
                        drag 
                        dragMomentum={false}
                        onDrag={handleDragUpdate}
                        onDragEnd={handleDragEnd} 
                        whileHover={{ scale: 1.15 }} 
                        whileDrag={{ 
                          scale: 1.2, 
                          zIndex: 1000, 
                          cursor: 'grabbing', 
                          filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))' 
                        }}
                        className="text-[38px] sm:text-[60px] cursor-grab active:cursor-grabbing drop-shadow-2xl z-[60] select-none touch-none"
                        style={{ position: 'absolute' }}
                      >
                        {currentFruit.icon}
                      </motion.div>
                   )}
                </div>
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-1">
          <button onClick={() => shuffleMission()} className={`relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-1.5 sm:p-3 rounded-xl"><ChevronRight size={20} /></div>
              <div className="leading-tight uppercase tracking-tighter text-xs sm:text-lg">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
            </div>
            <div className="flex items-center relative z-10">
              {autoNextTimer !== null ? (
                <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-3 sm:px-6 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[100px] sm:min-w-[200px]">
                  <div className="flex items-center gap-1 shrink-0"><Timer size={14} className="animate-spin text-indigo-300" /><span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span></div>
                  <div className="flex justify-between w-full px-2 relative">
                      {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
                      <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-xs sm:text-2xl pointer-events-none">🏃</motion.div>
                  </div>
                </div>
              ) : <FastForward className="opacity-30 w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
          </button>
          <button onClick={() => shuffleMission()} className="flex items-center justify-center gap-2 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
            <Shuffle size={18} />
            <span className="uppercase tracking-tighter text-xs sm:text-lg">Shuffle Lab</span>
          </button>
      </div>

      {/* VIRTUAL HAND GUIDE */}
      <AnimatePresence>
        {mode === 'concept' && virtualHandPos && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
                <div className="relative flex items-center justify-center">
                    <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
                    <AnimatePresence>
                      {isGrabbing && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute text-[26px] sm:text-[40px] filter drop-shadow-xl z-[61] opacity-100">
                          {currentFruit.icon}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}