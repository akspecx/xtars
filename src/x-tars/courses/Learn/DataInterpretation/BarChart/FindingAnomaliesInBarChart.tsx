import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  IceCream,
  Dessert,
  Candy as CandyIcon,
  BarChart3,
  XCircle,
  CheckCircle2,
  Cookie,
  ArrowRightCircle,
  Check,
  RotateCw,
  Search
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '18px',
  textSize: '16px',
  smallText: '14px'
};

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const SWEETS = [
  { 
    id: 'iceCream', 
    label: 'Ice Cream', 
    icon: <IceCream size={24} />, 
    color: 'bg-sky-500', 
    barGradient: 'from-sky-400 to-sky-600',
    target: 6
  },
  { 
    id: 'donut', 
    label: 'Donut', 
    icon: <Dessert size={24} />, 
    color: 'bg-pink-500', 
    barGradient: 'from-pink-400 to-pink-600',
    target: 4
  },
  { 
    id: 'chocolate', 
    label: 'Chocolate', 
    icon: <Cookie size={24} />, 
    color: 'bg-amber-800', 
    barGradient: 'from-amber-600 to-amber-800',
    target: 4
  },
  {
    id: 'candy',
    label: 'Candy',
    icon: <CandyIcon size={24} />,
    color: 'bg-purple-500',
    barGradient: 'from-purple-400 to-purple-600',
    target: 3
  }
];

// Scenarios for "Find the Mistake"
const SCENARIOS = [
  {
    id: 'height_error',
    question: "Which Bar is not correct?",
    teacherIntro: "Data Detective! Click on the bar where you see the issue. One bar reaches the wrong number on the scale!",
    targetVotes: { iceCream: 6, donut: 4, chocolate: 4, candy: 3 },
    displayVotes: { iceCream: 4, donut: 4, chocolate: 4, candy: 3 }, // Error: Ice Cream is 4, should be 6
    errorId: 'iceCream',
    explanation: "Correct! The target for Ice Cream was 6, but the bar only reaches 4.",
    wrongExplanation: (id) => `Not that one! ${id} matches the target number perfectly.`
  },
  {
    id: 'label_error',
    question: "Can you find the mistake in the chart?",
    teacherIntro: "Look closely at the labels and icons. Click on the bar that has the wrong name at the bottom!",
    targetVotes: { iceCream: 6, donut: 4, chocolate: 4, candy: 3 },
    displayVotes: { iceCream: 6, donut: 4, chocolate: 4, candy: 3 },
    errorId: 'chocolate',
    customLabels: { chocolate: 'Donut' }, // Error: Chocolate bar labeled as Donut
    explanation: "Great catch! The label says 'Donut' but the bar actually represents 'Chocolate'.",
    wrongExplanation: (id) => `Nope, the label and icon for ${id} are correct.`
  },
  {
    id: 'color_error',
    question: "Find the visual mistake!",
    teacherIntro: "One sweet is 'hiding' in the wrong color! Click on the bar that is using the wrong identity color.",
    targetVotes: { iceCream: 6, donut: 4, chocolate: 4, candy: 3 },
    displayVotes: { iceCream: 6, donut: 4, chocolate: 4, candy: 3 },
    errorId: 'donut',
    customGradients: { donut: 'from-purple-400 to-purple-600' }, // Error: Donut uses Candy's purple
    explanation: "Aha! Donut bars should be Pink, but this one is Purple like the Candy bar!",
    wrongExplanation: (id) => `The color for ${id} is exactly what it should be.`
  }
];

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); 
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [activeVisual, setActiveVisual] = useState({ id: null, type: null });
  
  const currentScenario = SCENARIOS[scenarioIndex];

  const handleBarClick = (id) => {
    if (gameState === 'intro' || quizFeedback?.isCorrect) return;

    const isCorrect = id === currentScenario.errorId;
    const sweetLabel = SWEETS.find(s => s.id === id)?.label || id;

    if (isCorrect) {
      setQuizFeedback({ 
        isCorrect: true, 
        explanation: currentScenario.explanation, 
        nextState: scenarioIndex < SCENARIOS.length - 1 ? 'next' : 'mastery' 
      });
      setActiveVisual({ id, type: 'correct' });
    } else {
      setQuizFeedback({ 
        isCorrect: false, 
        explanation: currentScenario.wrongExplanation(sweetLabel)
      });
      setActiveVisual({ id, type: 'error' });
    }
  };

  const proceedFromQuiz = () => {
    if (quizFeedback?.nextState === 'mastery') {
      setGameState('mastery');
    } else {
      setScenarioIndex(prev => prev + 1);
      setQuizFeedback(null);
      setActiveVisual({ id: null, type: null });
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setActiveVisual({ id: null, type: null });
  };

  const handleRestart = () => {
    setGameState('intro');
    setScenarioIndex(0);
    setQuizFeedback(null);
    setActiveVisual({ id: null, type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/dataInterpretation/barChart')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all`} style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Data Detective Lab</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <Search className="text-yellow-400" size={16} />
             <span className={`font-black uppercase tracking-widest text-white/70 whitespace-nowrap`} style={{ fontSize: UI_CONFIG.textSize }}>Find the Mistake</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP DIV: Investigation Area (Bar Chart) */}
        <div className="flex-[1.2] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-1 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Evidence Chart</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className={`font-bold text-white/30 uppercase tracking-widest italic`} style={{ fontSize: UI_CONFIG.textSize }}>Click a bar to report the issue</span>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 shadow-lg transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0 mt-4 pt-6">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 2, 4, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className={`absolute -left-10 sm:-left-12 font-black text-white/80 translate-y-[-50%] text-right w-8 select-none`} style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* INTERACTIVE BARS */}
                    {SWEETS.map((sweet, sIdx) => {
                        const val = gameState === 'intro' ? 0 : currentScenario.displayVotes[sweet.id];
                        const heightPercentage = (val / 6) * 100;
                        const isActive = activeVisual.id === sweet.id;
                        const visualType = activeVisual.type;

                        const customGradient = currentScenario.customGradients?.[sweet.id] || sweet.barGradient;

                        return (
                            <div 
                                key={sweet.id} 
                                className={`flex-1 max-w-[60px] sm:max-w-[80px] flex flex-col items-center justify-end relative h-full mx-1 sm:mx-2 cursor-pointer group ${isActive ? 'z-50' : 'z-10'}`}
                                onClick={() => handleBarClick(sweet.id)}
                            >
                                <motion.div 
                                    className={`w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t ${customGradient} border-x border-t relative overflow-hidden`} 
                                    initial={{ height: 0 }} 
                                    animate={{ 
                                        height: `${heightPercentage}%`,
                                        scale: isActive ? 1.1 : 1,
                                        borderColor: isActive ? (visualType === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.2)',
                                        borderWidth: isActive ? '4px' : '1px',
                                        boxShadow: isActive 
                                            ? `0 0 40px ${visualType === 'correct' ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'}` 
                                            : "none"
                                    }} 
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                                    <div className="absolute inset-0 flex flex-col-reverse">
                                        {[2, 4, 6].map((gridVal) => (
                                            <div key={gridVal} className="h-1/3 border-t border-black/10 w-full" />
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CONNECTOR LINE */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div 
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: sIdx === 0 ? '12.5%' : sIdx === 1 ? '37.5%' : sIdx === 2 ? '62.5%' : '87.5%', opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute left-[-1000%] border-t-4 border-dashed pointer-events-none"
                                            style={{ 
                                                bottom: `${heightPercentage}%`,
                                                width: '2000%',
                                                borderColor: visualType === 'correct' ? '#22c55e' : '#ef4444',
                                                zIndex: -1
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-around items-start pt-3 shrink-0 h-14">
                    {SWEETS.map(sweet => {
                        const labelOverride = currentScenario.customLabels?.[sweet.id] || sweet.label;
                        const iconOverride = currentScenario.customLabels?.[sweet.id] 
                            ? SWEETS.find(s => s.label === currentScenario.customLabels[sweet.id])?.icon || sweet.icon
                            : sweet.icon;

                        return (
                            <div key={sweet.id} className="flex-1 flex flex-col items-center max-w-[80px]">
                                <div className={`${sweet.color} p-1 rounded-md text-white shadow-md mb-1`}>
                                    {React.cloneElement(iconOverride, { size: 14 })}
                                </div>
                                <span className={`font-black text-white/90 uppercase tracking-tight text-center leading-none whitespace-nowrap overflow-visible`} style={{ fontSize: UI_CONFIG.smallText }}>
                                    {labelOverride}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DIV: Instructions & Feedback */}
        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
                  <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                      </div>
                      <h2 className={`text-white font-bold italic leading-tight flex-1`} style={{ fontSize: UI_CONFIG.textSize }}>
                        "{quizFeedback ? quizFeedback.explanation : (gameState === 'intro' ? "Data Detective! Click on the bar where you see the issue." : currentScenario.teacherIntro)}"
                      </h2>
                  </div>

                  {gameState === 'intro' && (
                    <button onClick={() => setGameState('detective')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>
                        Start Investigation <ArrowRightCircle size={20} />
                    </button>
                  )}

                  {gameState === 'detective' && !quizFeedback && (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <h3 className="text-yellow-400 font-black uppercase tracking-widest" style={{ fontSize: UI_CONFIG.smallText }}>Case File: Targets</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
                          {SWEETS.map(s => (
                              <div key={s.id} className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center gap-2">
                                  <div className={`${s.color} p-1.5 rounded-lg text-white`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                  <div className="flex flex-col">
                                      <span className="text-white font-black" style={{ fontSize: UI_CONFIG.textSize }}>{s.target} People</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {quizFeedback && (
                    <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
                        {quizFeedback.isCorrect ? 'Next Case' : 'Keep Looking'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                    </button>
                  )}

                </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {gameState === 'mastery' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl">
                            <Trophy size={40} className="animate-bounce" />
                        </div>
                        <h2 className={`text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter text-shadow-sm`}>Master Detective!</h2>
                        <p className={`text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center`} style={{ fontSize: UI_CONFIG.textSize }}>
                            "Superb! You can now spot inconsistencies in data visualization, from scale errors to mislabeling. Your critical thinking is top-notch!"
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                                <RefreshCcw size={16} /> Re-Investigation
                            </button>
                            <button onClick={() => navigate('/learn/dataInterpretation/barChart/createBarChart')} className={`bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                                Next Module <ArrowRightCircle size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
          <GraduationCap size={24} className="text-[#3e2723] mb-1" />
          <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Numerical Integrity Lab</h3>
      </div>
    </div>
  );
}