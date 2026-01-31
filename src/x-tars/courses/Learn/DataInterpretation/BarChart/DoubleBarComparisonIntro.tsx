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
  classAColor: '#4f46e5', // Indigo
  classBColor: '#fbbf24', // Gold
  classAGradient: 'from-indigo-500 to-indigo-800',
  classBGradient: 'from-amber-300 to-amber-500'
};

const SWEETS = [
  { id: 'chocolate', label: 'Chocolate', icon: <Cookie size={24} />, baseColor: 'bg-amber-800' },
  { id: 'iceCream', label: 'Ice Cream', icon: <IceCream size={24} />, baseColor: 'bg-sky-600' }
];

const CLASS_DATA = {
  classA: { chocolate: 4, iceCream: 6 }, // Total: 10
  classB: { chocolate: 6, iceCream: 3 }  // Total: 9
};

const SCENARIOS = [
  {
    id: 'compare_choc',
    question: "Which class likes Chocolate more?",
    teacherIntro: "Welcome back Detective! Compare Class A (Indigo) and Class B (Gold). Look at the Chocolate group.",
    answer: 'classB',
    explanation: "Correct! The Gold bar (Class B) reaches 6, while the Indigo bar (Class A) only reaches 4.",
    wrongExplanation: "Not quite. Compare the Indigo and Gold bars for Chocolate. The Gold bar is taller!",
    highlightType: 'sweet',
    highlightId: 'chocolate'
  },
  {
    id: 'compare_ice',
    question: "Which class likes Ice Cream more?",
    teacherIntro: "Now let's check the Ice Cream bars. Which class has the higher bar?",
    answer: 'classA',
    explanation: "Spot on! The Indigo bar (Class A) reaches 6, but the Gold bar (Class B) only reaches 3.",
    wrongExplanation: "Look again. The Indigo bar for Ice Cream is longer than the Gold one.",
    highlightType: 'sweet',
    highlightId: 'iceCream'
  },
  {
    id: 'read_b_ice',
    question: "How many people like Ice Cream in Class B?",
    teacherIntro: "Look closely at the Gold bar for Ice Cream. It stops right between 2 and 4.",
    answer: 3,
    explanation: "Excellent! Since the bar is exactly in the middle of 2 and 4, it represents 3 people.",
    wrongExplanation: "Look at the scale on the left. The bar is higher than 2 but lower than 4!",
    highlightType: 'single',
    highlightId: 'iceCream',
    highlightClass: 'classB',
    options: [2, 3, 4]
  },
  {
    id: 'total_comparison',
    question: "Which class has more students in total?",
    teacherIntro: "Time for some math! Add the bars for Class A (4+6) and Class B (6+3).",
    answer: 'classA',
    explanation: "Brilliant! Class A has 10 students (4+6), while Class B has 9 students (6+3).",
    wrongExplanation: "Add them up! Class A: 4 + 6 = 10. Class B: 6 + 3 = 9.",
    highlightType: 'all'
  },
  {
    id: 'intra_class_b',
    question: "In Class B, which sweet is more popular?",
    teacherIntro: "Focus only on the Gold bars (Class B). Is Chocolate or Ice Cream higher?",
    answer: 'chocolate',
    explanation: "Correct! In Class B, Chocolate (6) has a much longer bar than Ice Cream (3).",
    wrongExplanation: "Look at the Gold bars. One is clearly taller than the other!",
    highlightType: 'class',
    highlightClass: 'classB'
  }
];

export default function LabContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [activeVisual, setActiveVisual] = useState({ sweetId: null, classId: null, type: null });
  
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
      setActiveVisual({ type: 'correct', ...mapVisuals(selectedId) });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: currentScenario.wrongExplanation });
      setActiveVisual({ type: 'error', ...mapVisuals(selectedId) });
    }
  };

  const mapVisuals = (selectedId) => {
    if (currentScenario.highlightType === 'sweet') return { sweetId: currentScenario.highlightId, classId: selectedId };
    if (currentScenario.highlightType === 'single') return { sweetId: currentScenario.highlightId, classId: currentScenario.highlightClass };
    if (currentScenario.highlightType === 'class') return { sweetId: selectedId, classId: currentScenario.highlightClass };
    return { sweetId: null, classId: selectedId };
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
            <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Double Bar Comparison</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className="font-black uppercase tracking-widest text-white/70 whitespace-nowrap" style={{ fontSize: UI_CONFIG.textSize }}>Class A vs B</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        <div className="flex-[1.3] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-1 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Comparative Chart</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: UI_CONFIG.classAColor }} /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class A (Indigo)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: UI_CONFIG.classBColor }} /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class B (Gold)</span></div>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0 mt-4 pt-6">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    
                    {/* Centered Y-Axis Guidelines */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 2, 4, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className="absolute -left-10 sm:-left-12 font-black text-white/80 translate-y-[-50%] text-right w-8" style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {SWEETS.map((sweet, sIdx) => {
                        const valA = CLASS_DATA.classA[sweet.id];
                        const valB = CLASS_DATA.classB[sweet.id];
                        const hA = (valA / 6) * 100;
                        const hB = (valB / 6) * 100;

                        const isAActive = activeVisual.classId === 'classA' && (activeVisual.sweetId === sweet.id || currentScenario.highlightType === 'all' || (currentScenario.highlightType === 'class' && activeVisual.classId === 'classA'));
                        const isBActive = activeVisual.classId === 'classB' && (activeVisual.sweetId === sweet.id || currentScenario.highlightType === 'all' || (currentScenario.highlightType === 'class' && activeVisual.classId === 'classB'));

                        return (
                            <div key={sweet.id} className="flex flex-col items-center justify-end h-full w-[120px] sm:w-[160px] relative z-10 px-2">
                                <div className="flex items-end gap-1 w-full h-full relative">
                                    {/* Class A Bar */}
                                    <motion.div 
                                        className={`flex-1 rounded-t-md sm:rounded-t-lg bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t relative`}
                                        initial={{ height: 0 }}
                                        animate={{ 
                                            height: `${hA}%`,
                                            borderColor: isAActive ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                                            borderWidth: isAActive ? '4px' : '1px',
                                            boxShadow: isAActive ? `0 0 30px ${activeVisual.type === 'correct' ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'}` : "none"
                                        }}
                                        transition={{ type: 'spring', stiffness: 100 }}
                                    >
                                        {isAActive && (
                                            <motion.div initial={{ width: 0 }} animate={{ width: '2000%' }} className="absolute left-[-1000%] border-t-2 border-dashed pointer-events-none" style={{ bottom: '100%', borderColor: activeVisual.type === 'correct' ? '#22c55e' : '#ef4444' }} />
                                        )}
                                    </motion.div>

                                    {/* Class B Bar */}
                                    <motion.div 
                                        className={`flex-1 rounded-t-md sm:rounded-t-lg bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t relative`}
                                        initial={{ height: 0 }}
                                        animate={{ 
                                            height: `${hB}%`,
                                            borderColor: isBActive ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
                                            borderWidth: isBActive ? '4px' : '1px',
                                            boxShadow: isBActive ? `0 0 30px ${activeVisual.type === 'correct' ? 'rgba(34,197,94,0.6)' : 'rgba(239,68,68,0.6)'}` : "none"
                                        }}
                                        transition={{ type: 'spring', stiffness: 100 }}
                                    >
                                        {isBActive && (
                                            <motion.div initial={{ width: 0 }} animate={{ width: '2000%' }} className="absolute left-[-1000%] border-t-2 border-dashed pointer-events-none" style={{ bottom: '100%', borderColor: activeVisual.type === 'correct' ? '#22c55e' : '#ef4444' }} />
                                        )}
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-around items-start pt-4 shrink-0 h-16">
                    {SWEETS.map(sweet => (
                        <div key={sweet.id} className="flex flex-col items-center w-[120px] sm:w-[160px]">
                            <div className={`${sweet.baseColor} p-1.5 rounded-md text-white shadow-md mb-1`}>{React.cloneElement(sweet.icon, { size: 16 })}</div>
                            <span className="font-black text-white/90 uppercase tracking-tight text-center leading-none" style={{ fontSize: UI_CONFIG.textSize }}>{sweet.label}</span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
                  <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                      </div>
                      <h2 className="text-white font-bold italic leading-tight flex-1" style={{ fontSize: UI_CONFIG.textSize }}>
                        "{quizFeedback ? quizFeedback.explanation : (gameState === 'intro' ? "Ready to compare data? Let's check our dual class results." : currentScenario.question)}"
                      </h2>
                  </div>

                  {gameState === 'intro' && (
                    <button onClick={() => setGameState('quiz')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Comparison <ArrowRightCircle size={20} /></button>
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
                                    <div className={`${s.baseColor} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                    {s.label}
                                </button>
                            ))
                        ) : (
                            ['classA', 'classB'].map(cid => (
                                <button key={cid} onClick={() => handleAnswerClick(cid)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all uppercase tracking-widest">
                                    <Users size={18} style={{ color: cid === 'classA' ? UI_CONFIG.classAColor : UI_CONFIG.classBColor }} />
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
                        <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : () => setQuizFeedback(null)} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl`} style={{ fontSize: UI_CONFIG.textSize }}>
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
                            <button onClick={() => navigate('/learn/dataInterpretation/barChart/doubleBCCumulative')} className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Next Module<ArrowRightCircle size={18} /></button>
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