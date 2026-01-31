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
  RotateCw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '18px',
  textSize: '16px',
  smallText: '14px',
};

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const SWEETS = [
  { 
    id: 'chocolate', 
    label: 'Chocolate', 
    icon: <Cookie size={24} />, 
    colorA: 'bg-amber-900',
    colorB: 'bg-amber-500',
    gradientA: 'from-amber-800 to-amber-950',
    gradientB: 'from-amber-300 to-amber-500',
  },
  { 
    id: 'iceCream', 
    label: 'Ice Cream', 
    icon: <IceCream size={24} />, 
    colorA: 'bg-blue-800',
    colorB: 'bg-sky-400',
    gradientA: 'from-blue-700 to-blue-900',
    gradientB: 'from-sky-300 to-sky-500',
  }
];

const CLASS_DATA = {
  classA: { chocolate: 4, iceCream: 6 }, 
  classB: { chocolate: 6, iceCream: 3 }
};

const SCENARIOS = [
  {
    id: 'compare_choc',
    question: "Which class likes Chocolate more?",
    teacherIntro: "Detective, look at the Chocolate bars in both charts. Compare the Deep Brown (A) to the Light Brown (B).",
    answer: 'classB',
    explanation: "Correct! In Class B, the Light Brown bar reaches 6, while in Class A the Deep Brown bar only reaches 4.",
    wrongExplanation: "Look at the height of the Brown bars in both charts. The Class B bar is taller!",
    highlightType: 'sweet',
    highlightId: 'chocolate'
  },
  {
    id: 'compare_ice',
    question: "Which class likes Ice Cream more?",
    teacherIntro: "Now check the blue Ice Cream bars. Compare the Deep Blue (Class A) to the Sky Blue (Class B).",
    answer: 'classA',
    explanation: "Spot on! Class A's Deep Blue bar reaches 6, but Class B's Sky Blue bar only reaches 3.",
    wrongExplanation: "Look again. The Deep Blue bar in Class A is much taller than the Sky Blue bar in Class B.",
    highlightType: 'sweet',
    highlightId: 'iceCream'
  },
  {
    id: 'read_b_ice',
    question: "How many people like Ice Cream in Class B?",
    teacherIntro: "Look closely at the Class B Chart on the right. Find the Sky Blue bar.",
    answer: 3,
    explanation: "Excellent! In Class B, the bar is exactly in the middle of 2 and 4, representing 3 people.",
    wrongExplanation: "Look at the scale. The Sky Blue bar is higher than 2 but hasn't reached 4 yet!",
    highlightType: 'single',
    highlightId: 'iceCream',
    highlightClass: 'classB',
    options: [2, 3, 4]
  },
  {
    id: 'total_comparison',
    question: "Which class has more students in total?",
    teacherIntro: "Combine the bars! Class A (4+6) and Class B (6+3). Which chart has a bigger total?",
    answer: 'classA',
    explanation: "Brilliant! Class A has 10 students total, while Class B has 9 students.",
    wrongExplanation: "Add them up! Class A: 4 + 6 = 10. Class B: 6 + 3 = 9.",
    highlightType: 'all'
  },
  {
    id: 'intra_class_b',
    question: "In Class B, which sweet is more popular?",
    teacherIntro: "Focus only on the Class B Chart. Is Light Brown (Chocolate) or Sky Blue (Ice Cream) taller?",
    answer: 'chocolate',
    explanation: "Correct! In Class B, Chocolate (6) is much more popular than Ice Cream (3).",
    wrongExplanation: "Look at the bars in the Class B chart. One reaches 6 and the other only 3!",
    highlightType: 'class',
    highlightClass: 'classB'
  }
];

// ==========================================
// OPTIMIZED CHART COMPONENT
// ==========================================
const ClassChart = memo(({ classId, title, subTitle, activeVisual, currentScenario, votes }) => {
  return (
    <div className="flex-1 flex flex-col min-w-[140px] h-full">
      <div className="text-center mb-1 flex flex-col">
        <span className="font-black uppercase tracking-widest text-white/80" style={{ fontSize: '13px' }}>{title}</span>
        <span className="font-bold uppercase tracking-tighter text-white/30" style={{ fontSize: '10px' }}>{subTitle}</span>
      </div>
      
      <div className="flex-1 flex flex-col relative px-8 overflow-hidden min-h-0 pt-8">
        <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
          
          {/* Centered Y-Axis Guidelines */}
          <div className="absolute inset-0 pointer-events-none">
            {[0, 2, 4, 6].map((val) => (
              <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                <span className="absolute -left-8 font-black text-white/60 translate-y-[-50%] text-right w-6" style={{ fontSize: '12px' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* BARS */}
          {SWEETS.map((sweet, sIdx) => {
            const val = votes[sweet.id];
            const height = (val / 6) * 100;
            
            // Check if this class/sweet is active based on scenario logic
            const isActive = (activeVisual.classId === classId || activeVisual.classId === 'both') && (
              activeVisual.sweetId === sweet.id || 
              currentScenario.highlightType === 'all' || 
              (currentScenario.highlightType === 'class' && activeVisual.classId === classId)
            );

            const gradient = classId === 'classA' ? sweet.gradientA : sweet.gradientB;
            const borderColor = isActive ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)';

            // Dotted line should stop at the center of the bar. 
            // With 2 sweets in justify-around, centers are at 25% and 75%
            const connectorWidth = sIdx === 0 ? '25%' : '75%';

            return (
              <div key={sweet.id} className="flex-1 max-w-[60px] flex flex-col items-center justify-end relative h-full mx-1 z-10">
                <motion.div 
                  className={`w-full rounded-t-md bg-gradient-to-t ${gradient} border-x border-t relative`}
                  initial={{ height: 0 }}
                  animate={{ 
                    height: `${height}%`,
                    borderColor: borderColor,
                    borderWidth: isActive ? '4px' : '1px',
                    boxShadow: isActive ? `0 0 30px ${activeVisual.type === 'correct' ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'}` : "none"
                  }}
                  transition={{ 
                    height: { type: 'spring', stiffness: 100, damping: 15 },
                    borderColor: { duration: 0.2 },
                    boxShadow: { duration: 0.2 }
                  }}
                >
                    {/* Dotted tracking line - only extends till the number/bar */}
                    <AnimatePresence>
                        {isActive && (
                            <motion.div 
                                initial={{ opacity: 0, width: 0 }} 
                                animate={{ opacity: 1, width: connectorWidth }} 
                                exit={{ opacity: 0, width: 0 }}
                                className="absolute right-0 border-t-2 border-dashed pointer-events-none z-[-1]" 
                                style={{ 
                                    bottom: '100%', 
                                    borderColor: borderColor,
                                    // Logic: Line starts at left 0 and goes to this bar's center
                                    // Since we are inside the bar, we position it fixed to chart left
                                    position: 'fixed',
                                    left: 'auto', 
                                    // Re-implementing line at chart level for precision
                                    display: 'none'
                                }} 
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
                
                {/* Connector Line Refined: Placed at bar container level but absolute to chart area */}
                <AnimatePresence>
                    {isActive && (
                        <motion.div 
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: connectorWidth, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="absolute left-0 border-t-2 border-dashed pointer-events-none z-0"
                            style={{ 
                                bottom: `${height}%`,
                                borderColor: borderColor
                            }}
                        />
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="flex justify-around items-start pt-2 shrink-0 h-12">
          {SWEETS.map(sweet => (
            <div key={sweet.id} className="flex flex-col items-center w-full">
              <div className={`${classId === 'classA' ? sweet.colorA : sweet.colorB} p-1 rounded-md text-white shadow-md mb-0.5`}>
                {React.cloneElement(sweet.icon, { size: 12 })}
              </div>
              <span className="font-black text-white/70 uppercase tracking-tighter text-center leading-none" style={{ fontSize: '10px' }}>{sweet.label}</span>
            </div>
          ))}
        </div>
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
  const [activeVisual, setActiveVisual] = useState({ sweetId: null, classId: null, type: null });
  
  const currentScenario = SCENARIOS[scenarioIndex];

  const mapVisuals = useCallback((selectedId, isCorrect) => {
    // Logic: If we are comparing a sweet across both charts, show lines in both
    if (currentScenario.highlightType === 'sweet') {
        return { sweetId: currentScenario.highlightId, classId: 'both' };
    }
    if (currentScenario.highlightType === 'single') {
        return { sweetId: currentScenario.highlightId, classId: currentScenario.highlightClass };
    }
    if (currentScenario.highlightType === 'class') {
        return { sweetId: selectedId, classId: currentScenario.highlightClass };
    }
    // For 'all' comparison (total students)
    if (currentScenario.highlightType === 'all') {
        return { sweetId: null, classId: 'both' };
    }
    return { sweetId: null, classId: selectedId };
  }, [currentScenario]);

  const handleAnswerClick = (selectedId) => {
    if (quizFeedback?.isCorrect) return;
    const isCorrect = selectedId === currentScenario.answer;

    if (isCorrect) {
      setQuizFeedback({ 
        isCorrect: true, 
        explanation: currentScenario.explanation, 
        nextState: scenarioIndex < SCENARIOS.length - 1 ? 'next' : 'mastery' 
      });
      setActiveVisual({ type: 'correct', ...mapVisuals(selectedId, true) });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: currentScenario.wrongExplanation });
      setActiveVisual({ type: 'error', ...mapVisuals(selectedId, false) });
    }
  };

  const proceedFromQuiz = () => {
    if (quizFeedback?.nextState === 'mastery') {
      setGameState('mastery');
    } else {
      setScenarioIndex(prev => prev + 1);
      setQuizFeedback(null);
      setActiveVisual({ sweetId: null, classId: null, type: null });
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setActiveVisual({ sweetId: null, classId: null, type: null });
  };

  const handleRestart = () => {
    setGameState('intro');
    setScenarioIndex(0);
    setQuizFeedback(null);
    setActiveVisual({ sweetId: null, classId: null, type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/dataInterpretation/barChart')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all" style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Parallel Class Charts</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <Users className="text-yellow-400" size={16} />
             <span className="font-black uppercase tracking-widest text-white/70 whitespace-nowrap" style={{ fontSize: UI_CONFIG.textSize }}>Class A vs B</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP DIV: Comparison Section */}
        <div className="flex-[1.4] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Evidence Charts</h3>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row gap-8 sm:gap-4 mt-2 overflow-hidden">
               <ClassChart 
                  classId="classA" 
                  title="Class A" 
                  subTitle="Deep Colors"
                  activeVisual={activeVisual}
                  currentScenario={currentScenario}
                  votes={CLASS_DATA.classA}
               />
               <div className="hidden sm:block w-px bg-white/5 h-full self-center" />
               <ClassChart 
                  classId="classB" 
                  title="Class B" 
                  subTitle="Light Colors"
                  activeVisual={activeVisual}
                  currentScenario={currentScenario}
                  votes={CLASS_DATA.classB}
               />
            </div>
          </div>
        </div>

        {/* BOTTOM DIV: Instructions & Quiz Area */}
        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
                  <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                      </div>
                      <h2 className="text-white font-bold italic leading-tight flex-1" style={{ fontSize: UI_CONFIG.textSize }}>
                        "{quizFeedback ? quizFeedback.explanation : (gameState === 'intro' ? "Let's compare results across Class A and Class B." : currentScenario.question)}"
                      </h2>
                  </div>

                  {gameState === 'intro' && (
                    <button onClick={() => setGameState('quiz')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Investigation <ArrowRightCircle size={20} /></button>
                  )}

                  {gameState === 'quiz' && !quizFeedback && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl px-2">
                        {currentScenario.options ? (
                            currentScenario.options.map(opt => (
                                <button key={opt} onClick={() => handleAnswerClick(opt)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-black text-center transition-all">{opt}</button>
                            ))
                        ) : currentScenario.highlightType === 'class' || currentScenario.id === 'intra_class_b' ? (
                            SWEETS.map(s => (
                                <button key={s.id} onClick={() => handleAnswerClick(s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all">
                                    <div className={`${s.colorA} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                    {s.label}
                                </button>
                            ))
                        ) : (
                            ['classA', 'classB'].map(cid => (
                                <button key={cid} onClick={() => handleAnswerClick(cid)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-widest">
                                    <div className={`w-4 h-4 rounded-full ${cid === 'classA' ? 'bg-indigo-500' : 'bg-amber-400'}`} />
                                    {cid === 'classA' ? 'Class A' : 'Class B'}
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
                        <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl`} style={{ fontSize: UI_CONFIG.textSize }}>
                            {quizFeedback.isCorrect ? 'Continue' : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                        </button>
                    </div>
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
                        <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl"><Trophy size={40} className="animate-bounce" /></div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Comparison Master!</h2>
                        <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
                            "Fantastic work! You've learned how to read complex double bar charts to compare different groups and identify patterns across categories."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className="bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}><RefreshCcw size={16} /> Re-start Comparison</button>
                            <button onClick={() => navigate('/learn/dataInterpretation/barChart/twoClassBarChart')} className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Next Module <ArrowRightCircle size={18} /></button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
          <Users size={24} className="text-[#3e2723] mb-1" />
          <h3 className="text-[#3e2723] font-black uppercase" style={{ fontSize: UI_CONFIG.smallText }}>Comparative Data Lab</h3>
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