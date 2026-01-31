import React, { useState, useCallback, useRef, memo } from 'react';
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
  ChevronRight
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
  classA: { chocolate: 4, iceCream: 6, donut: 2 }, // Total: 12
  classB: { chocolate: 6, iceCream: 3, donut: 4 }  // Total: 13
};

const SCENARIOS = [
  {
    id: 'total_combined',
    question: "How many students are there in both classes together?",
    teacherIntro: "Let's find the total. Add up all the bars for Class A (12) and Class B (13).",
    answer: 25,
    explanation: "Perfect! Class A has 12 students and Class B has 13. Together, that makes 25 voters (12 + 13 = 25).",
    wrongExplanation: "Count again! Add all Indigo bars (4 + 6 + 2 = 12) and all Gold bars (6 + 3 + 4 = 13).",
    highlightType: 'all',
    options: [20, 25, 30]
  },
  {
    id: 'choc_vs_donut',
    question: "How many more students like Chocolate than Donut in both classes combined?",
    teacherIntro: "Compare the totals! Find the total for Chocolate (4 + 6 = 10) and Donut (2 + 4 = 6).",
    answer: 4,
    explanation: "Spot on! 10 people like Chocolate and 6 like Donut. The difference is 4 (10 - 6 = 4).",
    wrongExplanation: "Check the totals. Chocolate has 10 and Donut has 6. How many more is that?",
    highlightType: 'compare_sweets',
    highlightIds: ['chocolate', 'donut'],
    options: [2, 4, 6]
  },
  {
    id: 'max_overall',
    question: "Which sweet is liked by the maximum students overall?",
    teacherIntro: "Look at the combined heights. Which sweet group has the most total votes across both classes?",
    answer: 'chocolate',
    explanation: "Correct! Chocolate has 10 total votes, which is more than Ice Cream (9) or Donut (6).",
    wrongExplanation: "Compare the groups! Add up the heights for each sweet. One group definitely has more.",
    highlightType: 'all_sweets'
  }
];

// ==========================================
// OPTIMIZED CHART COMPONENT
// ==========================================
const GroupedChart = memo(({ activeVisual, currentScenario }) => {
  return (
    <div className="flex-1 flex flex-col relative px-12 sm:px-16 overflow-hidden min-h-0 pt-10">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        
        {/* Fixed Guideline Layer with Better Centering */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 2, 4, 6].map((val) => (
            <div 
              key={val} 
              className="absolute w-full h-[1px] bg-white/5 flex items-center" 
              style={{ bottom: `${(val / 6) * 100}%` }}
            >
              {/* Labels with explicit leading-none and translate centering */}
              <span 
                className="absolute -left-10 font-black text-white/80 text-right w-8 leading-none transform -translate-y-[0.5px]" 
                style={{ fontSize: '14px' }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Dynamic Tracking Overlay (Lines + Labels aligned to center) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <AnimatePresence>
            {activeVisual.type && SWEETS.map((sweet, sIdx) => {
              const isActive = currentScenario.highlightType === 'all' || 
                               currentScenario.highlightType === 'all_sweets' ||
                               (currentScenario.highlightType === 'compare_sweets' && currentScenario.highlightIds.includes(sweet.id)) ||
                               activeVisual.sweetId === sweet.id;

              if (!isActive) return null;

              const valA = CLASS_DATA.classA[sweet.id];
              const valB = CLASS_DATA.classB[sweet.id];
              const hA = (valA / 6) * 100;
              const hB = (valB / 6) * 100;
              
              const groupWidth = 100 / 3;
              const centerOfGroup = groupWidth * sIdx + (groupWidth / 2);
              const barWidthOffset = 4.2;

              const accentColor = activeVisual.type === 'correct' ? '#22c55e' : '#ef4444';

              return (
                <React.Fragment key={`visuals-${sweet.id}`}>
                  {/* Line + Label for Class A */}
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${centerOfGroup - barWidthOffset}%`, opacity: 1 }}
                    className="absolute left-0 border-t-2 border-dashed"
                    style={{ bottom: `${hA}%`, borderColor: accentColor }}
                  />
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute font-black text-[10px] text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30"
                    style={{ 
                        bottom: `${hA}%`, 
                        left: `${centerOfGroup - barWidthOffset}%`, 
                        transform: 'translate(-50%, 50%)' // Center badge exactly on the 1px line
                    }}
                  >
                    {valA}
                  </motion.div>

                  {/* Line + Label for Class B */}
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${centerOfGroup + barWidthOffset}%`, opacity: 1 }}
                    className="absolute left-0 border-t-2 border-dashed"
                    style={{ bottom: `${hB}%`, borderColor: accentColor }}
                  />
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute font-black text-[10px] text-black bg-amber-400 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30"
                    style={{ 
                        bottom: `${hB}%`, 
                        left: `${centerOfGroup + barWidthOffset}%`, 
                        transform: 'translate(-50%, 50%)' // Center badge exactly on the 1px line
                    }}
                  >
                    {valB}
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        {/* BARS LAYER */}
        {SWEETS.map((sweet) => {
          const valA = CLASS_DATA.classA[sweet.id];
          const valB = CLASS_DATA.classB[sweet.id];
          const hA = (valA / 6) * 100;
          const hB = (valB / 6) * 100;

          const isGroupHighlighted = activeVisual.type && (
            currentScenario.highlightType === 'all' || 
            currentScenario.highlightType === 'all_sweets' ||
            (currentScenario.highlightType === 'compare_sweets' && currentScenario.highlightIds.includes(sweet.id)) ||
            activeVisual.sweetId === sweet.id
          );

          return (
            <div key={sweet.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[150px] relative z-10 px-2">
              <div className="flex items-end gap-1 w-full h-full">
                <motion.div 
                  className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t relative`}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${hA}%`,
                    borderColor: isGroupHighlighted && activeVisual.type ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                    borderWidth: isGroupHighlighted && activeVisual.type ? '3px' : '1px',
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
                <motion.div 
                  className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t relative`}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${hB}%`,
                    borderColor: isGroupHighlighted && activeVisual.type ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                    borderWidth: isGroupHighlighted && activeVisual.type ? '3px' : '1px',
                  }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
              </div>
            </div>
          );
        })}
      </div>

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
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [activeVisual, setActiveVisual] = useState({ sweetId: null, type: null });
  
  const currentScenario = SCENARIOS[scenarioIndex];

  const handleAnswerClick = (selectedId) => {
    if (quizFeedback?.isCorrect) return;
    const isCorrect = selectedId === currentScenario.answer;

    if (isCorrect) {
      setQuizFeedback({ 
        isCorrect: true, 
        explanation: currentScenario.explanation, 
        nextState: scenarioIndex < SCENARIOS.length - 1 ? 'next' : 'mastery' 
      });
      setActiveVisual({ type: 'correct', sweetId: typeof selectedId === 'string' ? selectedId : null });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: currentScenario.wrongExplanation });
      setActiveVisual({ type: 'error', sweetId: typeof selectedId === 'string' ? selectedId : null });
    }
  };

  const proceedFromQuiz = () => {
    if (quizFeedback?.nextState === 'mastery') {
      setGameState('mastery');
    } else {
      handleNext();
    }
  };

  const handleNext = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
        setScenarioIndex(prev => prev + 1);
        setQuizFeedback(null);
        setActiveVisual({ sweetId: null, type: null });
    }
  };

  const handlePrevious = () => {
    if (scenarioIndex > 0) {
        setScenarioIndex(prev => prev - 1);
        setQuizFeedback(null);
        setActiveVisual({ sweetId: null, type: null });
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setActiveVisual({ sweetId: null, type: null });
  };

  const handleRestart = () => {
    setGameState('intro');
    setScenarioIndex(0);
    setQuizFeedback(null);
    setActiveVisual({ sweetId: null, type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all" style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Cumulative Data Analysis</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className="font-black uppercase tracking-widest text-white/70 whitespace-nowrap" style={{ fontSize: UI_CONFIG.textSize }}>Center Aligned</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        <div className="flex-[1.4] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Class Poll Comparison</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: UI_CONFIG.classAColor }} /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class A (Indigo)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: UI_CONFIG.classBColor }} /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class B (Gold)</span></div>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
            </div>
            <GroupedChart activeVisual={activeVisual} currentScenario={currentScenario} />
          </div>
        </div>

        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner">
            
            {gameState === 'quiz' && (
                <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                    <button onClick={handlePrevious} disabled={scenarioIndex === 0} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
                        <ChevronLeft size={16} /> PREV
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-white/60 font-black tracking-[0.2em] uppercase" style={{ fontSize: '10px' }}>CASE {scenarioIndex + 1} / {SCENARIOS.length}</span>
                    </div>
                    <button onClick={handleNext} disabled={scenarioIndex === SCENARIOS.length - 1} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
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
                            <h2 className="text-white font-bold italic leading-tight flex-1" style={{ fontSize: UI_CONFIG.textSize }}>
                                "{gameState === 'intro' ? "Let's combine our data! How well can you add these bars together?" : currentScenario.question}"
                            </h2>
                        </div>
                    )}

                    {gameState === 'intro' && (
                        <button onClick={() => setGameState('quiz')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Investigation <ArrowRightCircle size={20} /></button>
                    )}

                    {gameState === 'quiz' && !quizFeedback && (
                        <div className="grid grid-cols-3 gap-3 w-full max-w-2xl px-2">
                            {currentScenario.options ? (
                                currentScenario.options.map(opt => (
                                    <button key={opt} onClick={() => handleAnswerClick(opt)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-black text-center transition-all" style={{ fontSize: UI_CONFIG.textSize }}>{opt}</button>
                                ))
                            ) : (
                                SWEETS.map(s => (
                                    <button key={s.id} onClick={() => handleAnswerClick(s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all" style={{ fontSize: UI_CONFIG.textSize }}>
                                        <div className={`${s.baseColor} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                        {s.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {quizFeedback && (
                        <div className="flex flex-col items-center gap-3 w-full">
                            <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 w-full max-w-md ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                                {quizFeedback.isCorrect ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                                <p className="font-bold leading-tight" style={{ fontSize: UI_CONFIG.smallText }}>{quizFeedback.explanation}</p>
                            </div>
                            <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
                                {quizFeedback.isCorrect ? 'Continue' : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
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
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Double Chart Master!</h2>
                        <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
                            "Incredible work! You've successfully learned how to sum and compare complex data across two different classes using side-by-side bar charts."
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
          <Users size={24} className="text-[#3e2723] mb-1" />
          <h3 className="text-[#3e2723] font-black uppercase" style={{ fontSize: UI_CONFIG.smallText }}>Comparative Interpretation Lab</h3>
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