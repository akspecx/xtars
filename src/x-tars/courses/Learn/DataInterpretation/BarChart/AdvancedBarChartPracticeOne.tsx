import React, { useState, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  XCircle,
  CheckCircle2,
  BookOpen,
  Target,
  Calculator,
  ArrowLeft,
  TrendingUp,
  ArrowRightCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  labelSize: '11px', 
  colors: {
    y1: 'bg-blue-600', // 2002-03
    y2: 'bg-red-700',  // 2003-04
    y3: 'bg-lime-600'  // 2004-05
  },
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const PRODUCTION_DATA = [
  { name: 'Honda', y1: 6, y2: 14, y3: 21 },
  { name: 'GM', y1: 12, y2: 18, y3: 18 },
  { name: 'Maruti', y1: 5, y2: 9, y3: 15 },
  { name: 'HM', y1: 16, y2: 9, y3: 12 },
  { name: 'Hyundai', y1: 8, y2: 14, y3: 7 }
];

// ==========================================
// REUSABLE SUB-COMPONENTS
// ==========================================

const HeaderSection = ({ onBack, title }) => (
  <header className="w-full shrink-0 p-2 sm:p-3 relative z-40">
      <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
        <div className="flex flex-col">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[11px]">
              <ChevronLeft size={14} /> Dashboard
          </button>
          <span className="text-white font-black uppercase tracking-tighter ml-1 mt-0.5" style={{ fontSize: UI_CONFIG.headerSize }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 bg-black/30 p-1 rounded-full border border-white/10 shadow-inner">
           <span className="px-4 py-1.5 rounded-full font-black uppercase text-[10px] text-yellow-400">Analysis Mode</span>
        </div>
      </div>
  </header>
);

const CompletionModal = ({ onRestart, onNext }) => (
  <div className="h-full w-full flex items-center justify-center p-4">
    <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Production Guru!</h2>
        <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've successfully mastered interpretation of longitudinal company baselines!"</p>
        
        <div className="flex flex-col gap-3">
            <button 
                onClick={onRestart} 
                className="w-full bg-white border-2 border-[#3e2723] text-[#3e2723] py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
                <RotateCcw size={14} /> Restart Practice
            </button>
            <button 
                onClick={onNext}
                className="w-full bg-[#3e2723] text-white py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
                Finish Module <ArrowRightCircle size={14} />
            </button>
        </div>
    </div>
  </div>
);

const MiniTable = ({ rows, cols, activeId }) => {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-inner shrink-0 mt-2">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="sticky top-0 z-40 bg-[#1a0f0d] shadow-sm">
            <tr className="border-b border-white/20">
              {cols.map(c => (
                <th key={c.key} className="px-3 py-3 text-white/40 uppercase tracking-widest font-black" style={{ fontSize: '10px' }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, i) => {
              const isRowActive = activeId && (r.id === activeId || r.key === activeId);
              return (
                <tr key={i} className={`transition-colors ${isRowActive ? 'bg-yellow-400/10' : 'hover:bg-white/5'}`}>
                  {cols.map(c => (
                    <td key={c.key} className="px-3 py-3 font-bold text-white/80" style={{ fontSize: '13px' }}>
                      {c.highlight ? (
                        <span className="bg-yellow-400 text-black px-2 py-0.5 rounded shadow-lg inline-block min-w-[30px] text-center">
                          {r[c.key]}
                        </span>
                      ) : (
                        <span className={isRowActive ? 'text-yellow-400' : ''}>
                          {r[c.key] ?? '-'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// SCENARIOS
// ==========================================
const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "How many companies showed production below their own 3-year average in 2002-03, but rose above their average in 2003-04?",
    options: ['3 Companies', '2 Companies', '4 Companies'],
    answer: '3 Companies',
    explanation: "To solve this, we must first calculate the 3-year individual average for each company. Then, we check if 2002-03 is < that average AND if 2003-04 is > that average. Honda, GM, and Hyundai satisfy both conditions.",
    tableRows: [
        { name: 'Honda', calc: '(6+14+21)/3 = 13.7', v1: '6', v2: '14', status: 'Match (6 < 13.7 & 14 > 13.7)' },
        { name: 'GM', calc: '(12+18+18)/3 = 16.0', v1: '12', v2: '18', status: 'Match (12 < 16 & 18 > 16)' },
        { name: 'Maruti', calc: '(5+9+15)/3 = 9.7', v1: '5', v2: '9', status: 'Both years < Average' },
        { name: 'HM', calc: '(16+9+12)/3 = 12.3', v1: '16', v2: '9', status: '2002-03 already > Average' },
        { name: 'Hyundai', calc: '(8+14+7)/3 = 9.7', v1: '8', v2: '14', status: 'Match (8 < 9.7 & 14 > 9.7)' }
    ],
    tableCols: [
        {key:'name', label:'Company'}, 
        {key:'calc', label:'Individual Avg Computation'}, 
        {key:'status', label:'Logic Status: Y1 < Avg & Y2 > Avg', highlight: true}
    ]
  },
  {
    id: 'p2',
    question: "What is the ratio of Hindustan Motors (HM) production in 2003-04 to Honda's production in 2002-03?",
    options: ['3 : 2', '2 : 1', '4 : 3'],
    answer: '3 : 2',
    explanation: "Locate the specific bars on the chart. 1. Find HM's production in 2003-04 (Red bar) which is 9. 2. Find Honda's production in 2002-03 (Blue bar) which is 6. 3. The ratio is 9 : 6, which simplifies to 3 : 2 by dividing both numbers by 3.",
    tableRows: [
        { target: 'HM Production (2003-04)', val: '9' },
        { target: 'Honda Production (2002-03)', val: '6' },
        { target: 'Final Ratio (9:6)', val: '3 : 2' }
    ],
    tableCols: [{key:'target', label:'Target Data'}, {key:'val', label:'Value Found', highlight: true}]
  },
  {
    id: 'p3',
    question: "For how many companies has there been no decrease in production in any year compared to the previous year?",
    options: ['3 Companies', '2 Companies', '4 Companies'],
    answer: '3 Companies',
    explanation: "We are looking for a 'Consistent' or 'Growth' trend (where the value either increases or stays the same each year). Checking the sequence Blue -> Red -> Green: Honda, GM, and Maruti show no decreases.",
    tableRows: [
        { co: 'Honda', seq: '6 → 14 → 21', res: 'Continuous Growth' },
        { co: 'GM', seq: '12 → 18 → 18', res: 'Growth then Constant' },
        { co: 'Maruti', seq: '5 → 9 → 15', res: 'Continuous Growth' },
        { co: 'HM', seq: '16 → 9 (Drop)', res: 'Decrease detected' },
        { co: 'Hyundai', seq: '14 → 7 (Drop)', res: 'Decrease detected' }
    ],
    tableCols: [{key:'co', label:'Manufacturer'}, {key:'seq', label:'Output Sequence'}, {key:'res', label:'Analysis Result', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const ProductionBarChart = memo(({ quizFeedback }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8 pb-4">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 5, 10, 15, 20, 25].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val/25)*100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-10 leading-none" style={{ fontSize: '11px' }}>{val}</span>
            </div>
          ))}
        </div>

        {PRODUCTION_DATA.map((company) => (
          <div key={company.name} className="flex flex-col items-center flex-1 max-w-[120px] h-full relative z-10 px-1 sm:px-2">
            <div className="flex items-end justify-center w-full h-full gap-0.5 sm:gap-1">
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[9px] font-black text-white/40 mb-1">{company.y1}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.y1} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${(company.y1/25)*100}%` }} />
                </div>
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[9px] font-black text-white/40 mb-1">{company.y2}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.y2} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${(company.y2/25)*100}%` }} />
                </div>
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[9px] font-black text-white/40 mb-1">{company.y3}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.y3} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${(company.y3/25)*100}%` }} />
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around pt-3 shrink-0 h-10">
        {PRODUCTION_DATA.map(d => (
          <div key={d.name} className="flex flex-col items-center flex-1 overflow-hidden">
            <span className="font-black text-white/40 uppercase tracking-tighter text-center leading-tight truncate w-full px-1" style={{ fontSize: '10px' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ==========================================
// MAIN LAB CONTENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const scenarios = PRACTICE_SCENARIOS;
  const isMastery = scenarioIndex === -1;
  const currentScenario = !isMastery ? scenarios[scenarioIndex] : null;

  const handleNextScenario = useCallback(() => {
    if (scenarioIndex < scenarios.length - 1) {
      setScenarioIndex(prev => prev + 1);
      setQuizFeedback(null);
      setShowExplanation(false);
    } else {
      setScenarioIndex(-1);
    }
  }, [scenarioIndex, scenarios.length]);

  const handlePrevScenario = useCallback(() => {
    if (scenarioIndex > 0) {
      setScenarioIndex(prev => prev - 1);
      setQuizFeedback(null);
      setShowExplanation(false);
    }
  }, [scenarioIndex]);

  const handleAnswerClick = (ans) => {
    if (!currentScenario || quizFeedback?.isCorrect) return;
    if (ans === currentScenario.answer) {
      setQuizFeedback({ isCorrect: true, text: "Logic Match! Your interpretation of individual company baselines is correct." });
    } else {
      setQuizFeedback({ isCorrect: false, text: "Data Mismatch. Remember to calculate each company's own 3-year average first!" });
    }
  };

  if (isMastery) {
    return (
        <div className="h-screen w-screen bg-[#f1f0ee] flex flex-col items-center overflow-hidden font-sans relative">
             <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
             <CompletionModal 
                onRestart={() => { setScenarioIndex(0); setQuizFeedback(null); setShowExplanation(false); }}
                onNext={() => navigate('/')}
             />
        </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#f1f0ee] flex flex-col items-center overflow-hidden font-sans relative select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <HeaderSection 
        onBack={() => navigate('/')} 
        title="Production Performance Lab" 
      />

      <main className="flex-1 w-full max-w-[900px] flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden relative z-10">
        
        <section className="flex-[1.1] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-start shrink-0 px-2">
                <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Industry Output (000s)</h3>
                <div className="flex flex-wrap gap-2 justify-end max-w-[220px]">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600" /><span className="text-white/40 text-[9px] font-black uppercase">2002-03</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-700" /><span className="text-white/40 text-[9px] font-black uppercase">2003-04</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-lime-600" /><span className="text-white/40 text-[9px] font-black uppercase">2004-05</span></div>
                </div>
            </div>
            <ProductionBarChart quizFeedback={quizFeedback} />
          </div>
        </section>

        <section className="flex-1 min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse bg-yellow-400`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">Independent Mission {scenarioIndex + 1}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handlePrevScenario} disabled={scenarioIndex === 0} className="text-white/40 hover:text-white disabled:opacity-0 transition-colors uppercase font-black text-[9px] flex items-center gap-1"><ArrowLeft size={12}/> Back</button>
                    <div className="flex gap-1">
                        {PRACTICE_SCENARIOS.map((_, idx) => (
                            <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${scenarioIndex === idx ? 'bg-yellow-400 scale-125' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-0 relative">
                <AnimatePresence mode="wait">
                    {currentScenario && (
                    <motion.div 
                        key={scenarioIndex + (quizFeedback ? '-fb' : '') + (showExplanation ? '-exp' : '')} 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
                        className="w-full h-full flex flex-col gap-3 overflow-hidden"
                    >
                        {!quizFeedback ? (
                            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400 shadow-lg"><Target size={24}/></div>
                                    <div className="flex-1">
                                        <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-yellow-400/30">Target Objective:</span>
                                        <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>"{currentScenario.question}"</h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {currentScenario.options?.map(opt => (
                                        <button 
                                            key={opt} onClick={() => handleAnswerClick(opt)}
                                            className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-black text-center transition-all active:scale-95 cursor-pointer relative z-50 shadow-lg"
                                            style={{ fontSize: UI_CONFIG.textSize }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : showExplanation ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 flex flex-col overflow-hidden gap-1">
                                    <div className="bg-yellow-400/10 p-2.5 rounded-t-xl border-x border-t border-yellow-400/30 flex items-center gap-2">
                                        <Calculator className="text-yellow-400" size={14} />
                                        <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest">Logic Breakdown</span>
                                    </div>
                                    <MiniTable rows={currentScenario.tableRows} cols={currentScenario.tableCols} />
                                    <div className="p-3 bg-black/10 rounded-b-xl border border-white/5 overflow-y-auto custom-scrollbar">
                                        <p className="text-white/70 italic text-[12px] leading-relaxed"><span className="text-yellow-400 font-black uppercase text-[10px] not-italic mr-2">Full Path:</span>{currentScenario.explanation}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 pt-4 pb-4">
                                    <button 
                                        onClick={handleNextScenario}
                                        className="bg-white text-black py-4 w-full rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer relative z-50 flex items-center justify-center gap-2"
                                        style={{ fontSize: '11px' }}
                                    >
                                        Proceed to Next Mission <ArrowRightCircle size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <div className={`p-8 rounded-[2rem] border-4 w-full max-w-sm text-center ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                    <div className="flex items-center justify-center mb-4">
                                        {quizFeedback.isCorrect ? <div className="p-4 bg-green-500 rounded-full text-black shadow-xl animate-bounce"><CheckCircle2 size={32} /></div> : <div className="p-4 bg-red-500 rounded-full text-black shadow-xl animate-shake"><XCircle size={32} /></div>}
                                    </div>
                                    <span className="text-white font-black uppercase text-[14px] tracking-widest block mb-2">{quizFeedback.isCorrect ? 'Logic Match!' : 'Data Mismatch'}</span>
                                    <p className="text-white/80 font-medium mb-8" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.text}</p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => setShowExplanation(true)} className="bg-white text-black py-4 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">Explore Full Explanation</button>
                                        {!quizFeedback.isCorrect && (
                                            <button onClick={() => setQuizFeedback(null)} className="text-white/40 hover:text-white font-bold uppercase text-[11px] transition-all cursor-pointer">Retry Calculation</button>
                                        )}
                                        {quizFeedback.isCorrect && (
                                            <button onClick={handleNextScenario} className="text-white/40 hover:text-white font-bold uppercase text-[11px] transition-all cursor-pointer">Skip to Next Mission</button>
                                        )}
                                    </div>
                                </div>
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
          <h3 className="text-[#3e2723] font-black uppercase text-[8px] tracking-[0.3em]">Statistical Intelligence v12</h3>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
        body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; display: block !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; border: 1px solid transparent; background-clip: padding-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.4); }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out infinite; }
        
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <LabContent />
//     </Router>
//   );
// }