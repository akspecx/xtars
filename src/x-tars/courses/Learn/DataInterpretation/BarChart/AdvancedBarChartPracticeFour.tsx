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
  Target,
  Calculator,
  ArrowLeft,
  ArrowRightCircle,
  TrendingUp,
  ShoppingBag
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  colors: {
    banana: 'bg-yellow-400',
    strawberry: 'bg-red-600',
    blueberry: 'bg-blue-600'
  }
};

// Data condensed to 3 days for maximum mobile legibility
const SALES_DATA = [
  { day: 'Mon', banana: 6000, strawberry: 5500, blueberry: 6500 },
  { day: 'Tue', banana: 5200, strawberry: 7000, blueberry: 5800 },
  { day: 'Wed', banana: 6700, strawberry: 6100, blueberry: 5400 }
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
           <span className="px-4 py-1.5 rounded-full font-black uppercase text-[10px] text-yellow-400">Inventory Lab</span>
        </div>
      </div>
  </header>
);

const CompletionModal = ({ onRestart, onNext }) => (
  <div className="h-full w-full flex items-center justify-center p-4">
    <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Sales Expert!</h2>
        <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've successfully mastered the analysis of multi-colored category data!"</p>
        
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

const MiniTable = ({ rows, cols }) => {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-inner shrink-0 mt-2">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[350px]">
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
            {rows.map((r, i) => (
              <tr key={i} className="transition-colors hover:bg-white/5">
                {cols.map(c => (
                  <td key={c.key} className="px-3 py-3 font-bold text-white/80" style={{ fontSize: '13px' }}>
                    {c.highlight ? (
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded shadow-lg inline-block min-w-[30px] text-center">
                        {r[c.key]}
                      </span>
                    ) : (
                      r[c.key] ?? '-'
                    )}
                  </td>
                ))}
              </tr>
            ))}
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
    question: "Total number of Strawberry and Blueberry sold on Wednesday is what percent of the sum of Banana on Monday and Strawberry on Tuesday?",
    options: ['88.5%', '92.4%', '75.8%'],
    answer: '88.5%',
    explanation: "Step 1: Wednesday target (S + BL) = 6100 + 5400 = 11500. Step 2: Reference sum (Mon B + Tue S) = 6000 + 7000 = 13000. Step 3: (11500 / 13000) * 100 = 88.46% ≈ 88.5%.",
    tableRows: [
        { label: 'Wed (S + BL)', data: '6,100 + 5,400', res: '11,500' },
        { label: 'Ref (MonB + TueS)', data: '6,000 + 7,000', res: '13,000' },
        { label: 'Percentage', data: '(11.5k / 13k) * 100', res: '88.5%' }
    ],
    tableCols: [{key:'label', label:'Group'}, {key:'data', label:'Calculation'}, {key:'res', label:'Value', highlight: true}]
  },
  {
    id: 'p2',
    question: "What is the ratio of combined Banana and Strawberry sold on Monday to the combined Banana and Strawberry sold on Tuesday?",
    options: ['115 : 122', '110 : 125', '23 : 24'],
    answer: '115 : 122',
    explanation: "Monday total = 6000 + 5500 = 11500. Tuesday total = 5200 + 7000 = 12200. The simplified ratio is 11500 : 12200, which is 115 : 122.",
    tableRows: [
        { day: 'Monday', math: '6,000 + 5,500', total: '11,500' },
        { day: 'Tuesday', math: '5,200 + 7,000', total: '12,200' },
        { day: 'Final Ratio', math: '11500 : 12200', total: '115 : 122' }
    ],
    tableCols: [{key:'day', label:'Day'}, {key:'math', label:'Operation'}, {key:'total', label:'Result', highlight: true}]
  },
  {
    id: 'p3',
    question: "What is the average number of Blueberries sold across all three days?",
    options: ['5,900 units', '6,100 units', '5,750 units'],
    answer: '5,900 units',
    explanation: "Blueberry values: 6500 (Mon), 5800 (Tue), 5400 (Wed). Sum = 17700. Average = 17700 / 3 = 5900.",
    tableRows: [
        { item: 'Data Points', data: '6500, 5800, 5400' },
        { item: 'Total Sum', data: '17,700' },
        { item: 'Average', data: '17,700 / 3 = 5,900' }
    ],
    tableCols: [{key:'item', label:'Phase'}, {key:'data', label:'Result', highlight: true}]
  },
  {
    id: 'p4',
    question: "What is the difference between the total number of Bananas and total number of Strawberries sold across all days?",
    options: ['700 units', '1,000 units', '850 units'],
    answer: '700 units',
    explanation: "Banana Sum: 6000+5200+6700 = 17900. Strawberry Sum: 5500+7000+6100 = 18600. Difference = 18600 - 17900 = 700.",
    tableRows: [
        { fruit: 'Strawberry (Total)', val: '18,600' },
        { fruit: 'Banana (Total)', val: '17,900' },
        { fruit: 'Gap', val: '700' }
    ],
    tableCols: [{key:'fruit', label:'Category'}, {key:'val', label:'Total Count', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const FruitSalesBarChart = memo(() => {
  const maxVal = 7500;
  const minVal = 5000;

  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8 pb-4">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis Guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          {[5000, 5500, 6000, 6500, 7000, 7500].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${((val-minVal)/(maxVal-minVal))*100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-10 leading-none" style={{ fontSize: '10px' }}>{val}</span>
            </div>
          ))}
        </div>

        {SALES_DATA.map((d) => (
          <div key={d.day} className="flex flex-col items-center flex-1 max-w-[180px] h-full relative z-10 px-2 sm:px-4 group">
            <div className="flex items-end justify-center w-full h-full gap-1.5 sm:gap-2.5">
                {/* Banana - Yellow */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[7px] font-black text-white/30 mb-0.5">{d.banana}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.banana} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${((d.banana-minVal)/(maxVal-minVal))*100}%` }} />
                </div>
                {/* Strawberry - Red */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[7px] font-black text-white/30 mb-0.5">{d.strawberry}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.strawberry} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${((d.strawberry-minVal)/(maxVal-minVal))*100}%` }} />
                </div>
                {/* Blueberry - Blue */}
                <div className="flex flex-col items-center flex-1 h-full justify-end">
                    <span className="text-[7px] font-black text-white/30 mb-0.5">{d.blueberry}</span>
                    <motion.div className={`w-full ${UI_CONFIG.colors.blueberry} rounded-t-sm shadow-lg`} initial={{ height: 0 }} animate={{ height: `${((d.blueberry-minVal)/(maxVal-minVal))*100}%` }} />
                </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-around pt-3 shrink-0 h-10">
        {SALES_DATA.map(d => (
          <div key={d.day} className="flex flex-col items-center flex-1 overflow-hidden">
            <span className="font-black text-white/40 uppercase tracking-tighter text-center leading-tight truncate w-full px-1" style={{ fontSize: '12px' }}>{d.day}</span>
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
  
  const currentScenario = scenarioIndex !== -1 ? PRACTICE_SCENARIOS[scenarioIndex] : null;

  const handleNextScenario = useCallback(() => {
    if (scenarioIndex < PRACTICE_SCENARIOS.length - 1) {
      setScenarioIndex(prev => prev + 1);
      setQuizFeedback(null);
      setShowExplanation(false);
    } else {
      setScenarioIndex(-1);
    }
  }, [scenarioIndex]);

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
      setQuizFeedback({ isCorrect: true, text: "Logic Match! Your calculation aligns with the dataset." });
    } else {
      setQuizFeedback({ isCorrect: false, text: "Calculation Mismatch. Sum the specific fruit bars carefully!" });
    }
  };

  if (scenarioIndex === -1) {
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
      
      <HeaderSection onBack={() => navigate('/')} title="Market Sales Analytics" />

      <main className="flex-1 w-full max-w-[800px] flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden relative z-10">
        
        <section className="flex-[1] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-start shrink-0 px-2">
                <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>3-Day Fruit Volume</h3>
                <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400" /><span className="text-white/40 text-[9px] font-black uppercase">Banana</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600" /><span className="text-white/40 text-[9px] font-black uppercase">Strawberry</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600" /><span className="text-white/40 text-[9px] font-black uppercase">Blueberry</span></div>
                </div>
            </div>
            <FruitSalesBarChart />
          </div>
        </section>

        <section className="flex-1 min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse bg-yellow-400`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">Mission Task {scenarioIndex + 1}</span>
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
                        key={scenarioIndex + (quizFeedback ? '-fb' : '')} 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} 
                        className="w-full h-full flex flex-col gap-3 overflow-hidden"
                    >
                        {!quizFeedback ? (
                            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400 shadow-lg"><Target size={24}/></div>
                                    <div className="flex-1">
                                        <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-yellow-400/30">Analytics Goal:</span>
                                        <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>"{currentScenario.question}"</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar pr-1">
                                    {currentScenario.options?.map(opt => (
                                        <button 
                                            key={opt} onClick={() => handleAnswerClick(opt)}
                                            className="w-full bg-white/5 hover:bg-white/10 border-2 border-white/10 py-3 rounded-xl text-white font-black text-center transition-all active:scale-95 cursor-pointer relative z-50 shadow-lg"
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
                                        <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest">Statistical Pathway</span>
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
                                <div className={`p-6 rounded-[2rem] border-4 w-full max-w-[320px] text-center ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                    <div className="flex items-center justify-center mb-4">
                                        {quizFeedback.isCorrect ? <div className="p-3 bg-green-500 rounded-full text-black shadow-xl animate-bounce"><CheckCircle2 size={24} /></div> : <div className="p-3 bg-red-500 rounded-full text-black shadow-xl animate-shake"><XCircle size={24} /></div>}
                                    </div>
                                    <span className="text-white font-black uppercase text-[12px] tracking-widest block mb-2">{quizFeedback.isCorrect ? 'Logic Match!' : 'Calculation Error'}</span>
                                    <p className="text-white/80 font-medium mb-6" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.text}</p>
                                    
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => setShowExplanation(true)} className="bg-white text-black py-3.5 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">Explore Explanation</button>
                                        {!quizFeedback.isCorrect && (
                                            <button onClick={() => setQuizFeedback(null)} className="text-white/40 hover:text-white font-bold uppercase text-[11px] transition-all cursor-pointer">Retry Mission</button>
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
          <h3 className="text-[#3e2723] font-black uppercase text-[8px] tracking-[0.3em]">Statistical Intelligence v1.5</h3>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
        body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; display: block !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.15); border-radius: 10px; border: 1px solid transparent; background-clip: padding-box; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
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