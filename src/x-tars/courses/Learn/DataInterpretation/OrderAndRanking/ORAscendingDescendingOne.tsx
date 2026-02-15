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
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  Weight,
  MoveRight,
  MoveLeft,
  Hand
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  colors: {
    heaviest: 'bg-indigo-600',
    mid: 'bg-amber-500',
    lightest: 'bg-slate-400'
  }
};

const TROLLEY_DATA = [
  { name: 'Rice', weight: 100, size: 75, color: 'bg-indigo-600' },
  { name: 'Wheat', weight: 70, size: 60, color: 'bg-amber-600' },
  { name: 'Sugar', weight: 40, size: 45, color: 'bg-rose-400' },
  { name: 'Salt', weight: 20, size: 30, color: 'bg-slate-300' }
];

// ==========================================
// REUSABLE SUB-COMPONENTS
// ==========================================

const HeaderSection = ({ onBack, title, mode, onModeChange }) => (
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
           <button 
             onClick={() => onModeChange('concept')}
             className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all ${mode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             Concept
           </button>
           <button 
             onClick={() => onModeChange('practice')}
             className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all ${mode === 'practice' ? 'bg-green-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
           >
             Practice
           </button>
        </div>
      </div>
  </header>
);

const CompletionModal = ({ onRestart, onNext }) => (
  <div className="h-full w-full flex items-center justify-center p-4">
    <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Logic Master!</h2>
        <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've mastered the art of ordering and ranking goods by weight!"</p>
        
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
                Next Module <ArrowRightCircle size={14} />
            </button>
        </div>
    </div>
  </div>
);

const MiniTable = ({ rows, cols }) => {
  return (
    <div className="w-full flex-1 min-h-0 flex flex-col rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-inner shrink-0 mt-2">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[320px]">
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
                  <td key={c.key} className="px-3 py-3 font-bold text-white/80" style={{ fontSize: UI_CONFIG.textSize }}>
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
// CHART COMPONENT
// ==========================================
const LinearWeightScale = memo(({ arrangement = 'descending' }) => {
  const displayData = useMemo(() => {
    if (arrangement === 'ascending') return [...TROLLEY_DATA].reverse();
    return TROLLEY_DATA;
  }, [arrangement]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-0">
      <div className="w-full max-w-2xl relative flex items-center justify-between gap-4 px-10">
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2" />
        
        {/* Indicators for Left/Right sides */}
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-40">
           <div className="bg-white/10 p-1.5 rounded-lg mb-1"><MoveLeft size={14} className="text-white" /></div>
           <span className="text-[10px] font-black text-white uppercase">Left</span>
        </div>
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-40">
           <div className="bg-white/10 p-1.5 rounded-lg mb-1"><MoveRight size={14} className="text-white" /></div>
           <span className="text-[10px] font-black text-white uppercase">Right</span>
        </div>

        {displayData.map((item) => (
          <motion.div key={item.name} layout className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, width: item.size, height: item.size }}
              className={`${item.color} rounded-full flex items-center justify-center shadow-xl border-2 border-white/20 relative`}
            >
               <Weight size={item.size / 3} className="text-white/30" />
               <div className="absolute -bottom-8 flex flex-col items-center">
                  <span className="text-white font-black text-[10px] uppercase tracking-tighter">{item.name}</span>
                  <span className="text-white/40 text-[8px] font-bold">{item.weight}kg</span>
               </div>
            </motion.div>
          </motion.div>
        ))}

        <div className="absolute -top-14 left-0 w-full flex items-center justify-center gap-4 text-yellow-400 font-black uppercase text-[12px] tracking-[0.2em]">
          <span>{arrangement} Arrangement</span>
          <motion.div animate={{ x: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <MoveRight size={24} />
          </motion.div>
        </div>
      </div>
    </div>
  );
});

// ==========================================
// MAIN LAB CONTENT
// ==========================================
function LabContent() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('concept'); 
  const [conceptTab, setConceptTab] = useState('ascending');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const PRACTICE_SCENARIOS = [
    {
      id: 'p1',
      arrangement: 'ascending',
      question: "Arranged in ASCENDING order, which item would be placed FIRST?",
      options: ['Salt', 'Rice', 'Sugar'],
      answer: 'Salt',
      explanation: "In Ascending order, we start with the smallest value. Salt (20kg) is the lightest item here.",
      tableRows: [{i:'Salt', w:'20kg', r:'1st'}, {i:'Sugar', w:'40kg', r:'2nd'}, {i:'Rice', w:'100kg', r:'4th'}],
      tableCols: [{key:'i', label:'Item'}, {key:'w', label:'Weight'}, {key:'r', label:'Position', highlight: true}]
    },
    {
      id: 'p2',
      arrangement: 'descending',
      question: "Arranged in DESCENDING order, which item would be placed FIRST?",
      options: ['Rice', 'Wheat', 'Salt'],
      answer: 'Rice',
      explanation: "Descending order starts with the largest value. Rice (100kg) is the heaviest item.",
      tableRows: [{i:'Rice', w:'100kg', r:'1st'}, {i:'Wheat', w:'70kg', r:'2nd'}, {i:'Salt', w:'20kg', r:'4th'}],
      tableCols: [{key:'i', label:'Item'}, {key:'w', label:'Weight'}, {key:'r', label:'Position', highlight: true}]
    },
    {
      id: 'p3',
      arrangement: 'descending',
      question: "Looking at the DESCENDING arrangement, which item is 3rd from the LEFT side?",
      options: ['Sugar', 'Wheat', 'Rice'],
      answer: 'Sugar',
      explanation: "Descending order from Left to Right: 1st (Rice), 2nd (Wheat), 3rd (Sugar).",
      tableRows: [{p:'1st Left', i:'Rice'}, {p:'2nd Left', i:'Wheat'}, {p:'3rd Left', i:'Sugar'}],
      tableCols: [{key:'p', label:'Position'}, {key:'i', label:'Item Found', highlight: true}]
    },
    {
      id: 'p4',
      arrangement: 'ascending',
      question: "Looking at the ASCENDING arrangement, which item is 2nd from the RIGHT side?",
      options: ['Wheat', 'Sugar', 'Rice'],
      answer: 'Wheat',
      explanation: "Ascending sequence is Salt-Sugar-Wheat-Rice. From Right to Left: 1st is Rice, 2nd is Wheat.",
      tableRows: [{p:'1st Right', i:'Rice'}, {p:'2nd Right', i:'Wheat'}],
      tableCols: [{key:'p', label:'Side'}, {key:'i', label:'Item', highlight: true}]
    }
  ];

  const currentScenario = mode === 'practice' ? PRACTICE_SCENARIOS[scenarioIndex] : null;

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
    if (quizFeedback?.isCorrect) return;
    if (ans === currentScenario.answer) {
      setQuizFeedback({ isCorrect: true, text: "Logic Match! Perfect Ranking." });
    } else {
      setQuizFeedback({ isCorrect: false, text: "That's not quite it. Try again!" });
    }
  };

  if (scenarioIndex === -1) {
    return (
        <div className="h-screen w-screen bg-[#f1f0ee] flex flex-col items-center overflow-hidden font-sans relative">
             <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
             <CompletionModal 
                onRestart={() => { setMode('concept'); setScenarioIndex(0); setQuizFeedback(null); setShowExplanation(false); }}
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
        title="Order & Ranking Lab" 
        mode={mode}
        onModeChange={(m) => { setMode(m); setScenarioIndex(0); setQuizFeedback(null); setShowExplanation(false); }}
      />

      <main className="flex-1 w-full max-w-[800px] flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden relative z-10">
        
        <section className="flex-[1] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-start shrink-0 px-2">
                <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Weight Comparison Scale</h3>
                <div className="flex gap-2 items-center bg-black/20 p-1.5 rounded-lg border border-white/5">
                    <Weight size={14} className="text-yellow-400" />
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">Logic Visualizer</span>
                </div>
            </div>
            <LinearWeightScale arrangement={mode === 'concept' ? (conceptTab === 'leftRight' ? 'descending' : conceptTab) : currentScenario?.arrangement} />
          </div>
        </section>

        <section className="flex-[1.3] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'concept' ? 'bg-yellow-400' : 'bg-green-500'}`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">
                        {mode === 'concept' ? 'Learning Phase' : 'Mission'} {scenarioIndex + 1}
                    </span>
                </div>
                {mode === 'concept' && (
                  <div className="flex bg-black/40 p-1 rounded-full border border-white/10">
                    <button onClick={() => setConceptTab('ascending')} className={`px-2 py-1 rounded-full text-[8px] font-black uppercase transition-all ${conceptTab === 'ascending' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}>Ascending</button>
                    <button onClick={() => setConceptTab('descending')} className={`px-2 py-1 rounded-full text-[8px] font-black uppercase transition-all ${conceptTab === 'descending' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}>Descending</button>
                    <button onClick={() => setConceptTab('leftRight')} className={`px-2 py-1 rounded-full text-[8px] font-black uppercase transition-all ${conceptTab === 'leftRight' ? 'bg-white text-black shadow-lg' : 'text-white/40'}`}>L vs R</button>
                  </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-0 relative">
                <AnimatePresence mode="wait">
                    {mode === 'concept' ? (
                      <motion.div key={conceptTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full h-full flex flex-col gap-3 overflow-hidden">
                         <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">
                              {conceptTab === 'ascending' ? <ArrowUpNarrowWide size={24}/> : conceptTab === 'descending' ? <ArrowDownWideNarrow size={24}/> : <Hand size={24}/>}
                            </div>
                            <div className="flex-1">
                                <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-yellow-400/30">Concept: {conceptTab}</span>
                                <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>
                                  {conceptTab === 'ascending' ? "Smallest to Largest. We climb up!" : 
                                   conceptTab === 'descending' ? "Largest to Smallest. We slide down!" : 
                                   "Left side starts from the beginning, Right side starts from the end."}
                                </h3>
                            </div>
                         </div>
                         <div className="flex-1 flex flex-col overflow-hidden">
                            <p className="text-white/60 text-[12px] mb-2 font-bold uppercase tracking-widest" style={{ fontSize: UI_CONFIG.textSize }}>Logic Map:</p>
                            <MiniTable 
                              rows={conceptTab === 'ascending' 
                                ? [{o:'1st', i:'Salt (20kg)'}, {o:'Last', i:'Rice (100kg)'}]
                                : conceptTab === 'descending'
                                ? [{o:'1st', i:'Rice (100kg)'}, {o:'Last', i:'Salt (20kg)'}]
                                : [{o:'From Left', i:'Start counting from start (item 1)'}, {o:'From Right', i:'Start counting from the end'}]
                              }
                              cols={[{key:'o', label:'Rule'}, {key:'i', label:'Definition', highlight: true}]}
                            />
                         </div>
                         <button onClick={() => conceptTab === 'ascending' ? setConceptTab('descending') : conceptTab === 'descending' ? setConceptTab('leftRight') : setMode('practice')} className="bg-yellow-400 text-black py-3 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">
                           {conceptTab === 'leftRight' ? "Ready for Missions!" : "Continue Learning"}
                         </button>
                      </motion.div>
                    ) : (
                      <motion.div key={scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full h-full flex flex-col gap-3 overflow-hidden">
                         {!quizFeedback ? (
                            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                                <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-500 shadow-lg"><Target size={24}/></div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>"{currentScenario.question}"</h3>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2.5 overflow-y-auto custom-scrollbar pr-1">
                                    {currentScenario.options?.map(opt => (
                                        <button key={opt} onClick={() => handleAnswerClick(opt)} className="w-full bg-white/5 hover:bg-white/10 border-2 border-white/10 py-3.5 rounded-xl text-white font-black text-center transition-all active:scale-95 cursor-pointer relative z-50 shadow-lg" style={{ fontSize: UI_CONFIG.textSize }}>{opt}</button>
                                    ))}
                                </div>
                                <button onClick={handlePrevScenario} disabled={scenarioIndex === 0} className="text-white/40 hover:text-white font-bold uppercase text-[10px] disabled:opacity-0 transition-all py-1">Back to Previous Mission</button>
                            </div>
                         ) : showExplanation ? (
                            <div className="flex-1 flex flex-col overflow-hidden">
                                <div className="flex-1 flex flex-col overflow-hidden gap-1">
                                    <MiniTable rows={currentScenario.tableRows} cols={currentScenario.tableCols} />
                                    <div className="p-3 bg-black/10 rounded-b-xl border border-white/5 overflow-y-auto custom-scrollbar">
                                        <p className="text-white/70 italic text-[12px] leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.explanation}</p>
                                    </div>
                                </div>
                                <div className="shrink-0 pt-4 pb-4">
                                    <button onClick={handleNextScenario} className="bg-white text-black py-4 w-full rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer relative z-50 flex items-center justify-center gap-2" style={{ fontSize: '11px' }}>
                                        {scenarioIndex === PRACTICE_SCENARIOS.length - 1 ? "Finish Certification" : "Next Mission"} <ArrowRightCircle size={16} />
                                    </button>
                                </div>
                            </div>
                         ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-6">
                                <div className={`p-6 rounded-[2rem] border-4 w-full max-w-[320px] text-center ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.15)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                    <div className="flex items-center justify-center mb-4">
                                        {quizFeedback.isCorrect ? <div className="p-3 bg-green-500 rounded-full text-black shadow-xl animate-bounce"><CheckCircle2 size={24} /></div> : <div className="p-3 bg-red-500 rounded-full text-black shadow-xl animate-shake"><XCircle size={24} /></div>}
                                    </div>
                                    <span className="text-white font-black uppercase text-[12px] tracking-widest block mb-2">{quizFeedback.isCorrect ? 'Correct!' : 'Incorrect'}</span>
                                    <p className="text-white/80 font-medium mb-6" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.text}</p>
                                    <div className="flex flex-col gap-3">
                                        <button onClick={() => setShowExplanation(true)} className="bg-white text-black py-3.5 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">View Logical Steps</button>
                                        {!quizFeedback.isCorrect && (
                                            <button onClick={() => setQuizFeedback(null)} className="text-white/40 hover:text-white font-bold uppercase text-[11px] transition-all cursor-pointer underline">Retry Challenge</button>
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
          <h3 className="text-[#3e2723] font-black uppercase text-[8px] tracking-[0.3em]">Logical Reasoning Lab v1.3</h3>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
        body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; display: block !important; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
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