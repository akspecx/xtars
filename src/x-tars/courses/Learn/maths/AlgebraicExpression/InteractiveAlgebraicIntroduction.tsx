import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. CONSTANTS & DATA
// ==========================================
const FRUIT_LIBRARY = [
  { icon: '🍎', name: 'Apple', weight: 2 },
  { icon: '🍊', name: 'Orange', weight: 3 },
  { icon: '🍐', name: 'Pear', weight: 4 },
  { icon: '🍓', name: 'Strawberry', weight: 1 },
  { icon: '🍋', name: 'Lemon', weight: 5 },
];

const SESSION_LENGTH = 6;

// ==========================================
// 2. MAIN LABORATORY COMPONENT
// ==========================================
export default function WeightLabInteraction() {
  const navigate = useNavigate();

  // --- Session & Logic State ---
  const [sessionStep, setSessionStep] = useState(0); 
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [mode, setMode] = useState('practice'); // 'concept' or 'practice'
  
  const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
  const [targetWeight, setTargetWeight] = useState(6);
  const [placedCount, setPlacedCount] = useState(0);
  const [isBalanced, setIsBalanced] = useState(false);
  
  const [isOverTarget, setIsOverTarget] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [dragId, setDragId] = useState(0);

  // --- Concept Building States ---
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const leftPanRef = useRef(null);
  const appleGhostRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const tutorialActiveRef = useRef(false);
  const modeRef = useRef(mode);

  useEffect(() => { modeRef.current = mode; }, [mode]);

  // --- Logic Helpers ---
  const shuffleMission = useCallback(() => {
    if (sessionStep >= SESSION_LENGTH) {
      setSessionCompleted(true);
      return;
    }
    const fruit = FRUIT_LIBRARY[sessionStep % FRUIT_LIBRARY.length];
    const quantity = Math.floor(Math.random() * 3) + 2; 
    const newTarget = fruit.weight * quantity;

    setCurrentFruit(fruit);
    setTargetWeight(newTarget);
    setPlacedCount(0);
    setIsBalanced(false);
    setAutoNextTimer(null);
    setDragId(p => p + 1);
    
    // Stop any ongoing tutorial when mission shuffles
    tutorialActiveRef.current = false;
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [sessionStep]);

  useEffect(() => {
    shuffleMission();
  }, [sessionStep]);

  const leftWeight = placedCount * currentFruit.weight;
  const rotation = Math.max(-20, Math.min(20, (targetWeight - leftWeight) * 8));

  // Balance Check logic
  useEffect(() => {
    if (leftWeight === targetWeight && targetWeight > 0) {
      setIsBalanced(true);
      setAutoNextTimer(10);
    } else {
      setIsBalanced(false);
      setAutoNextTimer(null);
    }
  }, [leftWeight, targetWeight]);

  // Progression Timer
  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      if (sessionStep < SESSION_LENGTH - 1) setSessionStep(prev => prev + 1);
      else setSessionCompleted(true);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, sessionStep]);

  // --- Concept Building Automation ---
  const startConceptBuilding = useCallback(async () => {
    if (tutorialActiveRef.current || isBalanced) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);

    // Initial wait
    await new Promise(r => setTimeout(r, 1000));

    const needed = targetWeight / currentFruit.weight;

    for (let i = 0; i < needed; i++) {
        if (modeRef.current !== 'concept' || isBalanced) break;
        if (!appleGhostRef.current || !leftPanRef.current) break;
        
        const sourceRect = appleGhostRef.current.getBoundingClientRect();
        const targetRect = leftPanRef.current.getBoundingClientRect();
        
        // Move to Bin
        setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
        await new Promise(r => setTimeout(r, 1000));
        if (modeRef.current !== 'concept') break;
        
        // Grab
        setIsGrabbing(true);
        await new Promise(r => setTimeout(r, 500));
        
        // Drag to Pan
        setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
        await new Promise(r => setTimeout(r, 1200));
        if (modeRef.current !== 'concept') break;
        
        // Release and Add
        setIsGrabbing(false);
        setPlacedCount(prev => prev + 1);
        await new Promise(r => setTimeout(r, 800));
    }

    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
  }, [isBalanced, targetWeight, currentFruit]);

  useEffect(() => {
    if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
      const t = setTimeout(startConceptBuilding, 1000);
      return () => clearTimeout(t);
    } else if (mode === 'practice') {
      setIsAutoPlaying(false);
      setIsGrabbing(false);
      setVirtualHandPos(null);
      tutorialActiveRef.current = false;
    }
  }, [mode, isBalanced, startConceptBuilding]);

  // --- Drag Interaction Handlers ---
  const isPointInsideRect = (point, rect) => {
    const buffer = 40;
    return (point.x >= rect.left - buffer && point.x <= rect.right + buffer &&
            point.y >= rect.top - buffer && point.y <= rect.bottom + buffer);
  };

  const getPointFromEvent = (e) => {
    if (e.clientX != null && e.clientX !== 0) return { x: e.clientX, y: e.clientY };
    if (e.touches?.[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return null;
  };

  const handleDragUpdate = (e) => {
    if (!leftPanRef.current) return;
    const point = getPointFromEvent(e);
    if (!point) return;
    const rect = leftPanRef.current.getBoundingClientRect();
    setIsOverTarget(isPointInsideRect(point, rect));
  };

  const handleDragEnd = (e) => {
    setIsOverTarget(false);
    const point = getPointFromEvent(e) || getPointFromEvent(e.changedTouches?.[0]);
    if (point && leftPanRef.current) {
      const rect = leftPanRef.current.getBoundingClientRect();
      if (isPointInsideRect(point, rect) && !isBalanced) {
        setPlacedCount(prev => Math.min(prev + 1, 15));
      }
    }
    setDragId(p => p + 1);
  };

  // --- Modular Div Render Functions ---

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0">
      <header className="w-full bg-[#3e2723] p-4 sm:p-5 lg:p-6 rounded-[2.5rem] border-b-4 border-black/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full md:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-2 hover:text-white transition-all">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 shadow-glow" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Weight Lab</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto ml-auto">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20 scale-90 sm:scale-100">
              <button 
                onClick={() => { setMode('concept'); setPlacedCount(0); }} 
                className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}
              >
                CONCEPT BUILDING
              </button>
              <button 
                onClick={() => { setMode('practice'); setPlacedCount(0); }} 
                className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}
              >
                PRACTICE
              </button>
            </div>
            <button onClick={() => { setPlacedCount(0); setAutoNextTimer(null); }} className="p-2.5 bg-amber-500 text-[#3e2723] rounded-xl shadow-lg border-b-2 border-amber-800 active:scale-95 transition-transform">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );

  const renderDotsDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-1">
      <div className="flex items-center gap-4 bg-[#3e2723]/5 p-4 rounded-full border border-[#3e2723]/10 shadow-inner">
        {[...Array(SESSION_LENGTH)].map((_, i) => {
          const isPast = i < sessionStep;
          const isCurrent = i === sessionStep;
          return (
            <div key={i} className="relative">
              <motion.div animate={isCurrent ? { scale: [1, 1.4, 1] } : {}} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 shadow-md ${isPast ? 'bg-emerald-500 border-emerald-600' : isCurrent ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderScaleDiv = () => (
    <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
      <div className={`relative w-full min-h-[350px] sm:min-h-[480px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)" }} />
        
        {/* Scale Assembly */}
        <div className="relative w-full max-w-5xl flex justify-center items-center scale-[0.35] sm:scale-[0.5] lg:scale-[0.65] origin-top transition-transform overflow-visible mt-12 sm:mt-16">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#2a1a16] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 40, damping: 15 }} className="relative w-full h-8 bg-[#2a1a16] rounded-full flex justify-between items-center shadow-lg px-2 border border-white/10" style={{ originX: 0.5, originY: 0.5 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-yellow-500 rounded-full border-2 border-[#3e2723] z-30 shadow-glow" />
                    
                    {/* LEFT PAN */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
                        </svg>
                        <motion.div ref={leftPanRef} animate={{ scale: isOverTarget ? 1.08 : 1, boxShadow: isOverTarget ? "0 0 60px rgba(59, 130, 246, 0.8)" : "none" }} className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8">
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(placedCount)].map((_, i) => <motion.div key={i} initial={{ scale: 0, y: -40 }} animate={{ scale: 1, y: 0 }} className="text-3xl sm:text-6xl drop-shadow-lg">{currentFruit.icon}</motion.div>)}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border border-white/10">{leftWeight}g</div>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT PAN */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
                        </svg>
                        <motion.div className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="bg-yellow-400 text-[#3e2723] w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-yellow-600">{targetWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border border-white/10">{targetWeight}g</div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        {/* MESSAGING OVERLAY */}
        <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 px-4 z-[100] pointer-events-none">
          {mode === 'concept' && isAutoPlaying && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg border-2 border-white/20 flex items-center gap-3">
              <PlayCircle size={20} className="animate-pulse" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Demonstrating Logic Flow...</span>
            </motion.div>
          )}

          <AnimatePresence>
            {isBalanced && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-md">
                <Trophy size={24} className="animate-bounce" />
                <div className="flex flex-col sm:flex-row items-center gap-1">
                  <span className="text-[10px] font-black uppercase opacity-80 leading-none tracking-widest leading-none">Perfectly Balanced!</span>
                  <span className="text-xs sm:text-lg font-bold leading-none">{placedCount} {currentFruit.name}s reached the target.</span>
                </div>
                <Sparkles size={20} className="text-yellow-300 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderMatrixDiv = () => (
    <div className={`w-full max-w-[1200px] shrink-0 px-2 min-h-[160px] z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-row items-center justify-around shadow-xl relative overflow-visible">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">Interaction Bin</div>
          
          <div className="flex flex-col items-center gap-2 bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-inner">
              <span className="text-[#8d6e63] font-black text-[10px] uppercase">Unit Weight</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
                <span className="text-2xl sm:text-4xl font-black text-[#3e2723]">= {currentFruit.weight}g</span>
              </div>
          </div>

          <div className="relative w-28 h-28 sm:w-40 sm:h-40 bg-black/5 rounded-full border-4 border-dashed border-[#c4a484]/40 flex items-center justify-center">
              <div ref={appleGhostRef} className="absolute inset-0 flex items-center justify-center opacity-30 text-5xl sm:text-7xl pointer-events-none">{currentFruit.icon}</div>
              {!isBalanced && mode === 'practice' && (
                <motion.div
                  key={`drag-${dragId}`}
                  drag
                  dragMomentum={false}
                  onDrag={handleDragUpdate}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.25, zIndex: 2000, cursor: 'grabbing', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }}
                  className="text-5xl sm:text-7xl cursor-grab active:cursor-grabbing z-50 select-none touch-none"
                >
                  {currentFruit.icon}
                </motion.div>
              )}
          </div>
      </div>
    </div>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        <button onClick={() => { if (sessionStep < SESSION_LENGTH - 1) setSessionStep(p => p + 1); else setSessionCompleted(true); }} className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
          <div className="flex items-center gap-2">
            <ChevronRight size={20} />
            <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP MISSION'}</span>
          </div>
          {autoNextTimer !== null && (
            <div className="flex items-center gap-2 bg-black/30 px-4 py-1 rounded-full text-xs">
              <Timer size={14} className="animate-spin text-indigo-300" />
              <span>Next in {autoNextTimer}s</span>
            </div>
          )}
        </button>
        <button onClick={() => { setPlacedCount(0); setAutoNextTimer(null); }} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
          <RefreshCcw size={18} /> <span className="uppercase tracking-tighter">Restart Mission</span>
        </button>
    </div>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
        <Trophy size={64} className="animate-bounce" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Lab Verified!</h1>
      <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You have successfully mastered the physical logic of algebraic balance.</p>
      <button  onClick={() => navigate('/learn/mathematics/algebra/unknown')} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Move to next module</button>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-6 px-2 lg:px-4 overflow-y-auto bg-[#f1f0ee] no-scrollbar">
      <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)" }} />
      
      {/* VIRTUAL HAND GUIDE */}
      <AnimatePresence>
        {mode === 'concept' && virtualHandPos && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }} 
                className="fixed pointer-events-none z-[2000] -translate-x-1/2 -translate-y-1/2"
            >
                <div className="relative flex items-center justify-center">
                    <Hand className="text-stone-800 w-10 h-10 sm:w-16 sm:h-16" fill="white" />
                    <AnimatePresence>
                      {isGrabbing && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute text-[30px] sm:text-[50px] drop-shadow-xl z-[2001]">
                          {currentFruit.icon}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full flex flex-col items-center gap-y-10 sm:gap-y-12">
        {!sessionCompleted ? (
          <>
            {renderHeaderDiv()}
            {renderDotsDiv()}
            {renderScaleDiv()}
            {renderMatrixDiv()}
            {renderButtonsDiv()}
          </>
        ) : (
          <div className="w-full flex items-center justify-center p-4">
            {renderCompletionSummary()}
          </div>
        )}
      </div>
    </div>
  );
}
