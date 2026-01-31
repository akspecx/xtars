import React, { useState, useCallback, useRef, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  IceCream,
  BarChart3,
  XCircle,
  CheckCircle2,
  Cookie,
  ArrowRightCircle,
  Users,
  RotateCw,
  Dessert,
  ChevronRight,
  MoveVertical
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '18px',
  textSize: '16px',
  smallText: '14px',
  classAColor: '#4f46e5', // Indigo
  classBColor: '#fbbf24', // Gold
  classAGradient: 'from-indigo-500 to-indigo-800',
  classBGradient: 'from-amber-300 to-amber-500',
};

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const SWEETS = [
  { id: 'chocolate', label: 'Chocolate', icon: <Cookie size={24} />, baseColor: 'bg-amber-900' },
  { id: 'iceCream', label: 'Ice Cream', icon: <IceCream size={24} />, baseColor: 'bg-sky-600' },
  { id: 'donut', label: 'Donut', icon: <Dessert size={24} />, baseColor: 'bg-pink-600' }
];

const CLASS_DATA = {
  classA: { chocolate: 4, iceCream: 6, donut: 2, total: 12 },
  classB: { chocolate: 6, iceCream: 3, donut: 4, total: 13 }
};

const SCENARIOS = [
  {
    id: 'missing_b_donut',
    class: 'Class B',
    total: 13,
    known: "Chocolate is 6 and Ice Cream is 3",
    target: 4,
    missingLabel: 'Donut',
    missing: { sweetId: 'donut', classId: 'classB' },
    explanation: "Brilliant deduction! 13 total students minus 9 (6 + 3) leaves 4 for the Donut bar."
  },
  {
    id: 'missing_a_ice',
    class: 'Class A',
    total: 12,
    known: "Chocolate is 4 and Donut is 2",
    target: 6,
    missingLabel: 'Ice Cream',
    missing: { sweetId: 'iceCream', classId: 'classA' },
    explanation: "Spot on! 12 total students minus 6 (4 + 2) leaves 6 for Ice Cream."
  },
  {
    id: 'missing_b_choc',
    class: 'Class B',
    total: 13,
    known: "Ice Cream is 3 and Donut is 4",
    target: 6,
    missingLabel: 'Chocolate',
    missing: { sweetId: 'chocolate', classId: 'classB' },
    explanation: "Excellent! 13 total students minus 7 (3 + 4) leaves exactly 6 for Chocolate."
  },
  {
    id: 'missing_a_choc',
    class: 'Class A',
    total: 12,
    known: "Ice Cream is 6 and Donut is 2",
    target: 4,
    missingLabel: 'Chocolate',
    missing: { sweetId: 'chocolate', classId: 'classA' },
    explanation: "Correct! 12 total students minus 8 (6 + 2) leaves 4 for Chocolate."
  }
];

// ==========================================
// INTERACTIVE CHART COMPONENT
// ==========================================
const GroupedChart = memo(({ currentScenario, userHeight, setUserHeight, isCorrect, isChecking }) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Global Drag Handler for Maximum Smoothness
  useEffect(() => {
    if (!isDragging || isChecking) return;

    const handleGlobalMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const offsetY = clientY - rect.top;
      
      // Calculate value based on vertical position relative to chart height
      let rawValue = 6 - (offsetY / rect.height) * 6;
      let roundedValue = Math.max(0, Math.min(6, Math.round(rawValue)));
      setUserHeight(roundedValue);
    };

    const handleGlobalUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging, isChecking, setUserHeight]);

  return (
    <div className="flex-1 flex flex-col relative px-12 sm:px-16 overflow-hidden min-h-0 pt-10 chart-area">
      <div 
        ref={containerRef}
        className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full"
      >
        
        {/* Fixed Scale Guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 2, 4, 6].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/80 text-right w-8 leading-none transform -translate-y-[0.5px]" style={{ fontSize: '14px' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Tracking Line Overlay (Only on check or during drag) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <AnimatePresence>
            {(isChecking || isDragging) && (
              (() => {
                const sIdx = SWEETS.findIndex(s => s.id === currentScenario.missing.sweetId);
                const groupWidth = 100 / 3;
                const centerOfGroup = groupWidth * sIdx + (groupWidth / 2);
                const isClassA = currentScenario.missing.classId === 'classA';
                const barWidthOffset = 4.2;
                const lineEnd = isClassA ? centerOfGroup - barWidthOffset : centerOfGroup + barWidthOffset;
                
                // Colors: Success/Error if checking, Neutral if dragging
                const accentColor = isChecking 
                  ? (isCorrect ? '#22c55e' : '#ef4444') 
                  : (isClassA ? '#818cf8' : '#fbbf24');

                return (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${lineEnd}%`, opacity: isDragging ? 0.3 : 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="absolute left-0 border-t-2 border-dashed"
                    style={{ bottom: `${(userHeight / 6) * 100}%`, borderColor: accentColor }}
                  />
                );
              })()
            )}
          </AnimatePresence>
        </div>

        {/* BARS LAYER */}
        {SWEETS.map((sweet) => {
          const isMissingSweet = currentScenario.missing.sweetId === sweet.id;
          const valA = CLASS_DATA.classA[sweet.id];
          const valB = CLASS_DATA.classB[sweet.id];
          const hA = (valA / 6) * 100;
          const hB = (valB / 6) * 100;

          return (
            <div key={sweet.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[150px] relative z-10 px-2">
              <div className="flex items-end gap-1 w-full h-full relative">
                
                {/* Class A Bar */}
                {isMissingSweet && currentScenario.missing.classId === 'classA' ? (
                   <div className="flex-1 h-full flex flex-col justify-end relative">
                      <motion.div 
                        onMouseDown={() => !isChecking && setIsDragging(true)}
                        onTouchStart={() => !isChecking && setIsDragging(true)}
                        animate={{ height: `${(userHeight / 6) * 100}%` }}
                        // Transition is instant while dragging for smoothness, springy when confirmed
                        transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 15 }}
                        className={`w-full rounded-t-md bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t relative cursor-ns-resize touch-none select-none`}
                        style={{ 
                            borderColor: isChecking ? (isCorrect ? '#22c55e' : '#ef4444') : (isDragging ? '#818cf8' : 'rgba(255,255,255,0.6)'),
                            borderWidth: (isChecking || isDragging) ? '3px' : '2px',
                            borderStyle: isChecking ? 'solid' : 'dashed',
                            boxShadow: isChecking 
                                ? `0 0 20px ${isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}` 
                                : (isDragging ? '0 0 25px rgba(129,140,248,0.4)' : '0 0 10px rgba(255,255,255,0.1)')
                        }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0 w-0 z-30">
                            <div className={`absolute left-0 -translate-x-1/2 -translate-y-1/2 font-black px-1.5 py-0.5 rounded text-[10px] shadow-2xl flex items-center justify-center min-w-[22px] border border-white/20 transition-colors ${isChecking ? (isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-indigo-600 text-white'}`}>
                                {userHeight}
                            </div>
                         </div>
                         {!isChecking && (
                            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-20'}`}>
                                <MoveVertical className="text-white" size={14} />
                            </div>
                         )}
                      </motion.div>
                   </div>
                ) : (
                  <motion.div 
                    className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t border-white/10 opacity-70`}
                    animate={{ height: `${hA}%` }}
                  />
                )}

                {/* Class B Bar */}
                {isMissingSweet && currentScenario.missing.classId === 'classB' ? (
                   <div className="flex-1 h-full flex flex-col justify-end relative">
                      <motion.div 
                        onMouseDown={() => !isChecking && setIsDragging(true)}
                        onTouchStart={() => !isChecking && setIsDragging(true)}
                        animate={{ height: `${(userHeight / 6) * 100}%` }}
                        // Transition is instant while dragging, springy when confirmed
                        transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 100, damping: 15 }}
                        className={`w-full rounded-t-md bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t relative cursor-ns-resize touch-none select-none`}
                        style={{ 
                            borderColor: isChecking ? (isCorrect ? '#22c55e' : '#ef4444') : (isDragging ? '#fcd34d' : 'rgba(255,255,255,0.6)'),
                            borderWidth: (isChecking || isDragging) ? '3px' : '2px',
                            borderStyle: isChecking ? 'solid' : 'dashed',
                            boxShadow: isChecking 
                                ? `0 0 20px ${isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}` 
                                : (isDragging ? '0 0 25px rgba(251,191,36,0.4)' : '0 0 10px rgba(255,255,255,0.1)')
                        }}
                      >
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0 w-0 z-30">
                            <div className={`absolute left-0 -translate-x-1/2 -translate-y-1/2 font-black px-1.5 py-0.5 rounded text-[10px] shadow-2xl flex items-center justify-center min-w-[22px] border transition-colors ${isChecking ? (isCorrect ? 'bg-green-600 text-white border-white/20' : 'bg-red-600 text-white border-white/20') : 'bg-amber-400 text-black border-black/10'}`}>
                                {userHeight}
                            </div>
                         </div>
                         {!isChecking && (
                            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 transition-opacity ${isDragging ? 'opacity-100' : 'opacity-20'}`}>
                                <MoveVertical className="text-black" size={14} />
                            </div>
                         )}
                      </motion.div>
                   </div>
                ) : (
                  <motion.div 
                    className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t border-white/10 opacity-70`}
                    animate={{ height: `${hB}%` }}
                  />
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-around items-start pt-4 shrink-0 h-16">
        {SWEETS.map(sweet => (
          <div key={sweet.id} className="flex flex-col items-center flex-1 max-w-[150px]">
            <div className={`${sweet.baseColor} p-1.5 rounded-md text-white shadow-md mb-1`}>
              {React.cloneElement(sweet.icon, { size: 16 })}
            </div>
            <span className="font-black text-white/90 uppercase tracking-tight text-center leading-none" style={{ fontSize: UI_CONFIG.textSize }}>
              {sweet.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [userHeight, setUserHeight] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);
  
  const currentScenario = SCENARIOS[scenarioIndex];

  const handleCheck = () => {
    setIsChecking(true);
    const isCorrect = userHeight === currentScenario.target;

    if (isCorrect) {
      setQuizFeedback({
        isCorrect: true,
        explanation: currentScenario.explanation,
        nextState: scenarioIndex < SCENARIOS.length - 1 ? 'next' : 'mastery'
      });
    } else {
      const diff = userHeight > currentScenario.target ? "shorter" : "taller";
      setQuizFeedback({
        isCorrect: false,
        explanation: `Almost! Based on the class total, this bar should be a bit ${diff}. Try moving the bar again!`
      });
    }
  };

  const handleNext = () => {
    setScenarioIndex(prev => prev + 1);
    setUserHeight(0);
    setQuizFeedback(null);
    setIsChecking(false);
  };

  const handlePrevious = () => {
    setScenarioIndex(prev => Math.max(0, prev - 1));
    setUserHeight(0);
    setQuizFeedback(null);
    setIsChecking(false);
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setIsChecking(false);
  };

  const handleRestart = () => {
    setGameState('intro');
    setScenarioIndex(0);
    setUserHeight(0);
    setQuizFeedback(null);
    setIsChecking(false);
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all" style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Deductive Construction Lab</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className="font-black uppercase tracking-widest text-white/70 whitespace-nowrap" style={{ fontSize: UI_CONFIG.textSize }}>Rebuild the Chart</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP DIV: Interactive Chart */}
        <div className="flex-[1.4] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Puzzle Workspace</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-600" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class A</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class B</span></div>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
            </div>
            <GroupedChart 
                currentScenario={currentScenario} 
                userHeight={userHeight} 
                setUserHeight={setUserHeight}
                isCorrect={quizFeedback?.isCorrect}
                isChecking={isChecking}
            />
          </div>
        </div>

        {/* BOTTOM DIV: Interaction area */}
        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner">
            
            {gameState === 'quiz' && (
                <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                    <button onClick={handlePrevious} disabled={scenarioIndex === 0 || isChecking} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
                        <ChevronLeft size={16} /> PREV
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-white/60 font-black tracking-[0.2em] uppercase" style={{ fontSize: '10px' }}>LOGIC CASE {scenarioIndex + 1} / {SCENARIOS.length}</span>
                    </div>
                    <button onClick={handleNext} disabled={scenarioIndex === SCENARIOS.length - 1 || !quizFeedback?.isCorrect} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
                        NEXT <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 p-4 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div key={gameState + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                    
                    {!quizFeedback && (
                        <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <span className="text-yellow-400 font-black uppercase tracking-widest text-[10px]">Case Clue:</span>
                                <h2 className="text-white font-bold italic leading-tight" style={{ fontSize: UI_CONFIG.textSize }}>
                                    {gameState === 'intro' ? (
                                        "One bar is missing! Look at the class total and existing bars, then drag the dashed bar to its correct height."
                                    ) : (
                                        <>
                                            {currentScenario.class} has {currentScenario.total} students. 
                                            Votes for {currentScenario.known.split(' and ')[0]} and for {currentScenario.known.split(' and ')[1]}. 
                                            How many will vote for {currentScenario.missingLabel}? <span className="text-yellow-400 not-italic font-black">Grab the bar and drag it!</span>
                                        </>
                                    )}
                                </h2>
                            </div>
                        </div>
                    )}

                    {gameState === 'intro' && (
                        <button onClick={() => setGameState('quiz')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Logic Puzzles <ArrowRightCircle size={20} /></button>
                    )}

                    {gameState === 'quiz' && !quizFeedback && (
                        <div className="flex flex-col items-center gap-2">
                            <button 
                                onClick={handleCheck}
                                className="bg-green-500 text-white px-12 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-green-800"
                                style={{ fontSize: UI_CONFIG.textSize }}
                            >
                                Confirm Height <ArrowRightCircle size={20} />
                            </button>
                        </div>
                    )}

                    {quizFeedback && (
                        <div className="flex flex-col items-center gap-3 w-full">
                            <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 w-full max-w-md ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                                {quizFeedback.isCorrect ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                                <p className="font-bold leading-tight" style={{ fontSize: UI_CONFIG.smallText }}>{quizFeedback.explanation}</p>
                            </div>
                            <button 
                                onClick={quizFeedback.isCorrect ? (scenarioIndex < SCENARIOS.length - 1 ? handleNext : () => setGameState('mastery')) : handleRetry} 
                                className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} 
                                style={{ fontSize: UI_CONFIG.textSize }}
                            >
                                {quizFeedback.isCorrect ? (scenarioIndex < SCENARIOS.length - 1 ? 'Next Puzzle' : 'Finish Lab') : 'Try Adjusting'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                            </button>
                        </div>
                    )}
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {gameState === 'mastery' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl"><Trophy size={40} className="animate-bounce" /></div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter text-shadow-sm">Logic Master!</h2>
                        <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
                            "Bravo! You've mastered deductive reasoning for data sets. You can now rebuild charts based on logical clues and class totals! Your numerical logic is outstanding."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}><RefreshCcw size={16} /> Re-start</button>
                            <button className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Finish Lab <ArrowRightCircle size={18} /></button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
          <GraduationCap size={24} className="text-[#3e2723] mb-1" />
          <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Logic Construction Lab</h3>
      </div>
    </div>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <LabContent />
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
//         html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
//         body { font-family: 'Noto Sans', sans-serif; background: #f1f0ee; user-select: none; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         .text-shadow-sm { text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
//       `}</style>
//     </Router>
//   );
// }