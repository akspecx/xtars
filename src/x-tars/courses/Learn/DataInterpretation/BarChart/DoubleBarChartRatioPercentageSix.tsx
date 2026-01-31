import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  BarChart3,
  XCircle,
  CheckCircle2,
  ArrowRightCircle,
  RotateCw,
  ChevronRight,
  Lightbulb,
  Target,
  Percent,
  Divide,
  Calculator,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  blueGradient: 'from-blue-500 to-blue-700',
  redGradient: 'from-red-500 to-red-700',
};

const BRANCHES = [
  { id: 'b1', label: 'B1' }, { id: 'b2', label: 'B2' }, { id: 'b3', label: 'B3' },
  { id: 'b4', label: 'B4' }, { id: 'b5', label: 'B5' }, { id: 'b6', label: 'B6' }
];

const SALES_DATA = {
  y2000: { b1: 80, b2: 75, b3: 95, b4: 85, b5: 75, b6: 70 },
  y2001: { b1: 105, b2: 65, b3: 110, b4: 95, b5: 95, b6: 80 }
};

// ==========================================
// SCENARIOS
// ==========================================
const CONCEPT_SCENARIOS = [
  {
    id: 'ratio_logic',
    title: "Ratio Rules",
    shortTitle: "Ratio",
    icon: <Divide size={16} />,
    question: "What is the ratio of total sales of B2 to total sales of B4?",
    coreExplanation: "Ratio of A : B = Value of A / Value of B. We find the answer by dividing the totals and simplifying the numbers.",
    steps: [
      {
        text: "Calculate Value of A (Branch B2). Combined total = 75 (Year 2000) + 65 (Year 2001) = 140.",
        highlightBranches: ['b2'],
        overlay: "Value A = 140"
      },
      {
        text: "Calculate Value of B (Branch B4). Combined total = 85 (Year 2000) + 95 (Year 2001) = 180.",
        highlightBranches: ['b4'],
        overlay: "Value B = 180"
      },
      {
        text: "Simplify the ratio 140 : 180. Dividing both by 20 gives us the final ratio of 7 : 9.",
        highlightBranches: ['b2', 'b4'],
        overlay: "Ratio: 7 : 9"
      }
    ]
  },
  {
    id: 'percent_logic',
    title: "Percentage Rules",
    shortTitle: "Percent",
    icon: <Percent size={16} />,
    question: "Total sales of B6 is what percent of the total sales of B3?",
    coreExplanation: "A is what % of B = (Value of A / Value of B) × 100. This formula tells us how large A is compared to B.",
    steps: [
      {
        text: "Calculate Value of A (Branch B6). Combined total = 70 + 80 = 150.",
        highlightBranches: ['b6'],
        overlay: "A = 150"
      },
      {
        text: "Calculate Value of B (Branch B3). Combined total = 95 + 110 = 205.",
        highlightBranches: ['b3'],
        overlay: "B = 205"
      },
      {
        text: "Apply Formula: (150 / 205) × 100. The result is approximately 73.17%.",
        highlightBranches: ['b3', 'b6'],
        overlay: "Result: 73.17%"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "What is the ratio of total sales of Branch B1 to Branch B5 for both years combined?",
    options: ['37:34', '16:15', '35:32'],
    answer: '37:34',
    explanation: "Excellent! Total B1 is 185 ($80+105$) and Total B5 is 170 ($75+95$). Ratio $185:170$ simplifies to $37:34$.",
    highlightBranches: ['b1', 'b5']
  },
  {
    id: 'p2',
    question: "Total sales of Branch B4 for both years is what percent of the total sales of B1?",
    options: ['97.3%', '94.5%', '102.1%'],
    answer: '97.3%',
    explanation: "Correct! Total B4 is 180 and Total B1 is 185. Formula: $(180 / 185) \\times 100 = 97.3\\%$.",
    highlightBranches: ['b4', 'b1']
  },
  {
    id: 'p3',
    question: "What is the average sales of Branches B4, B5, and B6 in the year 2001?",
    options: ['85', '90', '95'],
    answer: '90',
    explanation: "Perfect! Sales in 2001 were B4:95, B5:95, B6:80. Total is 270. Average is $270 / 3 = 90$.",
    highlightBranches: ['b4', 'b5', 'b6']
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const SalesChart = memo(({ highlightBranches, currentOverlay }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 40, 80, 120].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 120) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-8 leading-none text-[10px]">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Animated Badge */}
        <AnimatePresence>
            {currentOverlay && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 bg-yellow-400 text-black font-black px-4 py-1.5 rounded-full shadow-2xl z-50 text-[12px] border-2 border-black/10"
                >
                    {currentOverlay}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Bars */}
        {BRANCHES.map((branch) => {
          const val00 = SALES_DATA.y2000[branch.id];
          const val01 = SALES_DATA.y2001[branch.id];
          const h00 = (val00 / 120) * 100;
          const h01 = (val01 / 120) * 100;
          const isHighlighted = highlightBranches?.includes(branch.id);

          return (
            <div key={branch.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[80px] relative z-10 px-1">
              <div className="flex items-end gap-1 w-full h-full relative">
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.blueGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${h00}%`, 
                    opacity: isHighlighted || !highlightBranches?.length ? 1 : 0.1,
                    borderColor: isHighlighted ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: isHighlighted ? 1.05 : 1
                  }}
                >
                   {isHighlighted && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/40 px-1 rounded">{val00}</div>}
                </motion.div>
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.redGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${h01}%`, 
                    opacity: isHighlighted || !highlightBranches?.length ? 1 : 0.1,
                    borderColor: isHighlighted ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: isHighlighted ? 1.05 : 1
                  }}
                >
                   {isHighlighted && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/40 px-1 rounded">{val01}</div>}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-around pt-2 shrink-0 h-8">
        {BRANCHES.map(b => (
          <div key={b.id} className="flex flex-col items-center flex-1">
            <span className="font-black text-white/40 uppercase text-[10px] tracking-tighter">{b.label}</span>
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
  const [mode, setMode] = useState('concept'); 
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(-1); 
  const [quizFeedback, setQuizFeedback] = useState(null);
  
  const scenarios = mode === 'concept' ? CONCEPT_SCENARIOS : PRACTICE_SCENARIOS;
  const isMastery = scenarioIndex === -1;
  const currentScenario = !isMastery ? scenarios[scenarioIndex] : null;

  const handleNextScenario = useCallback(() => {
    if (scenarioIndex < scenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
      setStepIndex(-1);
      setQuizFeedback(null);
    } else {
      if (mode === 'concept') {
        setMode('practice');
        setScenarioIndex(0);
        setStepIndex(0);
        setQuizFeedback(null);
      } else {
        setScenarioIndex(-1);
      }
    }
  }, [scenarioIndex, mode, scenarios.length]);

  const handleNextStep = useCallback(() => {
    if (!currentScenario) return;
    if (mode === 'concept' && stepIndex < (currentScenario.steps?.length || 0) - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      handleNextScenario();
    }
  }, [stepIndex, currentScenario, mode, handleNextScenario]);

  const handlePrevStep = useCallback(() => {
    if (stepIndex > -1) {
      setStepIndex(prev => prev - 1);
    }
  }, [stepIndex]);

  const handleAnswerClick = (ans) => {
    if (!currentScenario || quizFeedback?.isCorrect) return;
    if (ans === currentScenario.answer) {
      setQuizFeedback({ isCorrect: true, explanation: currentScenario.explanation });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: "Calculation mismatch. Check the Branch totals again!" });
    }
  };

  const jumpToConcept = (idx) => {
    setScenarioIndex(idx);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  const resetLab = () => {
    setMode('concept');
    setScenarioIndex(0);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  const activeHighlights = useMemo(() => {
    if (isMastery || !currentScenario) return [];
    if (mode === 'practice') return currentScenario.highlightBranches || [];
    if (stepIndex === -1) return []; 
    return currentScenario.steps?.[stepIndex]?.highlightBranches || [];
  }, [mode, stepIndex, currentScenario, isMastery]);

  const activeOverlay = useMemo(() => {
    if (isMastery || !currentScenario) return null;
    if (mode === 'concept' && stepIndex >= 0) return currentScenario.steps?.[stepIndex]?.overlay || null;
    return null;
  }, [mode, stepIndex, currentScenario, isMastery]);

  if (isMastery) {
    return (
        <div className="h-screen w-full bg-[#e6dccb] flex items-center justify-center p-4 font-sans relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
             <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative">
                <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
                <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Logic Mastered!</h2>
                <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've successfully mastered the logic of ratios, averages, and percentages using data visualization!"</p>
                <button onClick={resetLab} className="bg-[#3e2723] text-white py-4 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">Restart Training</button>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full shrink-0 p-2 sm:p-3 relative z-40">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[11px]"><ChevronLeft size={14} /> Dashboard</button>
          <div className="flex items-center gap-1 sm:gap-2 bg-black/30 p-1 rounded-full border border-white/10 shadow-inner">
             <button onClick={() => { setMode('concept'); setScenarioIndex(0); setStepIndex(-1); setQuizFeedback(null); }} className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all cursor-pointer ${mode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Guided</button>
             <button onClick={() => { setMode('practice'); setScenarioIndex(0); setQuizFeedback(null); }} className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all cursor-pointer ${mode === 'practice' ? 'bg-green-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[900px] flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden relative z-10">
        
        {/* CHART SECTION */}
        <section className="flex-[1.2] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-center shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Comparative Sales Chart</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-600" /><span className="text-white/40 font-bold uppercase text-[9px]">Year 2000</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-600" /><span className="text-white/40 font-bold uppercase text-[9px]">Year 2001</span></div>
                    </div>
                </div>
                <button onClick={resetLab} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50"><RotateCcw size={14} /></button>
            </div>
            <SalesChart highlightBranches={activeHighlights} currentOverlay={activeOverlay} />
          </div>
        </section>

        {/* INTERACTION SECTION */}
        <section className="flex-1 min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'concept' ? 'bg-yellow-400' : 'bg-green-500'}`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">
                        {mode === 'concept' ? (stepIndex === -1 ? 'Formula' : `Step ${stepIndex + 1}`) : `Task ${scenarioIndex + 1}`}
                    </span>
                </div>
                
                {mode === 'concept' && (
                  <div className="flex gap-1">
                    {CONCEPT_SCENARIOS.map((cs, idx) => (
                      <button 
                        key={cs.id}
                        onClick={() => jumpToConcept(idx)}
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all border ${scenarioIndex === idx ? 'bg-yellow-400 text-black border-yellow-400' : 'text-white/30 border-white/10 hover:text-white/60'}`}
                      >
                        {cs.shortTitle}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-0">
                <AnimatePresence mode="wait">
                    {currentScenario && (
                    <motion.div 
                        key={mode + scenarioIndex + stepIndex + (quizFeedback ? '-fb' : '')} 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
                        className="w-full h-full flex flex-col gap-3 overflow-hidden"
                    >
                    
                    {mode === 'concept' ? (
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                            <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 shrink-0">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">{currentScenario.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="text-white/30 font-black uppercase text-[9px] mb-0.5 tracking-wider">Target:</h4>
                                        <h3 className="text-white font-black uppercase tracking-tight leading-snug" style={{ fontSize: UI_CONFIG.headerSize }}>
                                            {currentScenario.question}
                                        </h3>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 shadow-xl flex items-center min-h-[80px] overflow-hidden">
                                    {stepIndex === -1 ? (
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5">The Simple Rule</span>
                                            <p className="text-white font-medium italic leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>"{currentScenario.coreExplanation}"</p>
                                        </div>
                                    ) : (
                                        <div className="flex gap-4 items-start overflow-hidden">
                                            <div className="bg-yellow-400 text-black font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[12px] shadow-lg">{stepIndex + 1}</div>
                                            <p className="text-white font-bold leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.steps?.[stepIndex]?.text}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 shrink-0">
                                <button onClick={handlePrevStep} disabled={stepIndex === -1} className="flex items-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-0 cursor-pointer py-2 px-4 rounded-xl relative z-50">
                                    <ArrowLeft size={18} /> <span className="font-black uppercase text-[11px]">Back</span>
                                </button>
                                <button onClick={handleNextStep} className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer relative z-50" style={{ fontSize: '11px' }}>
                                    {stepIndex === -1 ? "Solve Together" : (stepIndex === (currentScenario.steps?.length || 0) - 1 ? (scenarioIndex === scenarios.length - 1 ? "To Practice" : "Next Rule") : "Next Step")} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-around overflow-hidden">
                            {!quizFeedback ? (
                                <>
                                    <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                        <div className="p-2 bg-green-500/20 rounded-lg text-green-500 shadow-lg"><Target size={24}/></div>
                                        <div className="flex-1">
                                          <span className="text-white/30 font-black uppercase text-[9px] mb-0.5 tracking-wider">Your Task:</span>
                                          <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>"{currentScenario.question}"</h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden">
                                        {currentScenario.options?.map(opt => (
                                            <button 
                                                key={opt} 
                                                onClick={() => handleAnswerClick(opt)}
                                                className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-black text-center transition-all active:scale-95 cursor-pointer relative z-50"
                                                style={{ fontSize: UI_CONFIG.textSize }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-4 overflow-hidden">
                                    <div className={`p-5 rounded-2xl border-2 w-full text-center ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-red-400" />}
                                            <span className="text-white font-black uppercase text-[12px] tracking-widest">{quizFeedback.isCorrect ? 'Correct Logic!' : 'Try Again'}</span>
                                        </div>
                                        <p className="text-white/80 font-medium leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.isCorrect ? currentScenario.explanation : quizFeedback.explanation}</p>
                                    </div>
                                    <button 
                                        onClick={quizFeedback.isCorrect ? handleNextScenario : () => setQuizFeedback(null)}
                                        className="bg-white text-black px-12 py-3.5 rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer relative z-50"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {quizFeedback.isCorrect ? "Continue" : "Back to Calculation"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <div className="shrink-0 mb-2 flex flex-col items-center opacity-10 py-1 relative z-0">
          <GraduationCap size={20} className="text-[#3e2723]" />
          <h3 className="text-[#3e2723] font-black uppercase text-[8px] tracking-[0.3em]">Statistical Interpretation Lab</h3>
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
//         html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
//         body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         * { -webkit-tap-highlight-color: transparent; }
//       `}</style>
//     </Router>
//   );
// }