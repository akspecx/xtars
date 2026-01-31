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
  Globe
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  labelSize: '14px', 
  badgeSize: '16px', 
  deficitColor: 'bg-orange-500', 
  surplusColor: 'bg-indigo-500', 
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const TRADE_DATA = [
  { name: 'Pak', value: -1238 },
  { name: 'Italy', value: -1225 },
  { name: 'India', value: -514 },
  { name: 'S. Afr', value: -425 },
  { name: 'Japan', value: -41 },
  { name: 'UAE', value: 427 },
  { name: 'USA', value: 462 },
  { name: 'UK', value: 665 }
];

const LOGIC_KEY = "Net Balance = (Total Surplus) - (Total Deficit)";

// ==========================================
// SHARED COMPONENTS
// ==========================================
const MiniTable = ({ rows, cols, activeId, reverse = false }) => {
  const displayRows = useMemo(() => (reverse ? [...rows].reverse() : rows), [rows, reverse]);

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col rounded-xl border border-white/10 bg-black/40 overflow-hidden shadow-inner shrink-0">
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse min-w-[340px]">
          <thead className="sticky top-0 z-40 bg-[#1a0f0d] shadow-sm">
            <tr className="border-b border-white/20">
              {cols.map(c => (
                <th key={c.key} className="px-4 py-3 text-white/40 uppercase tracking-widest font-black" style={{ fontSize: '11px' }}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {displayRows.map((r, i) => {
              const isRowActive = activeId && (r.id === activeId || r.key === activeId);
              return (
                <tr key={i} className={`transition-colors ${isRowActive ? 'bg-yellow-400/10' : 'hover:bg-white/5'}`}>
                  {cols.map(c => (
                    <td key={c.key} className="px-4 py-3 font-bold text-white/80" style={{ fontSize: UI_CONFIG.textSize }}>
                      {c.highlight ? (
                        <span className="bg-yellow-400 text-black px-3 py-0.5 rounded-full shadow-lg inline-block min-w-[40px] text-center" style={{ fontSize: UI_CONFIG.textSize }}>
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
const CONCEPT_SCENARIOS = [
  {
    id: 'c1',
    title: "Reading Diverging Charts",
    shortTitle: "Zero-Line Logic",
    icon: <BookOpen size={16} />,
    question: "How do we distinguish between Surplus and Deficit?",
    coreExplanation: "The horizontal line is the Zero Baseline. Bars rising above it are Surplus, bars falling below are Deficit.",
    steps: [
      {
        text: "Step 1: Locate the 0 baseline. Pak's bar drops down to -1238, indicating a trade deficit.",
        highlightNames: ['Pak'],
        tableRows: [{ id: 's1', name: 'Pak', val: '-1238', type: 'Deficit' }],
        tableCols: [{key:'name', label:'Country'}, {key:'val', label:'Value'}, {key:'type', label:'Direction'}]
      },
      {
        text: "Step 2: Look at UK. Its bar rises up to +665, representing a trade surplus.",
        highlightNames: ['UK'],
        tableRows: [
          { id: 's1', name: 'Pak', val: '-1238', type: 'Deficit' },
          { id: 's2', name: 'UK', val: '+665', type: 'Surplus' }
        ],
        tableCols: [{key:'name', label:'Country'}, {key:'val', label:'Value'}, {key:'type', label:'Direction'}]
      }
    ]
  },
  {
    id: 'c2',
    title: "The Net Total Balance",
    shortTitle: "Net Analysis",
    icon: <Calculator size={16} />,
    question: "What is the overall Net Total of all trade for these countries?",
    coreExplanation: "To find the Net, we sum all positive surpluses and subtract all negative deficits.",
    steps: [
      {
        text: "Step 1: Calculate Total Surplus (UAE + USA + UK).",
        highlightNames: ['UAE', 'USA', 'UK'],
        tableRows: [{ id: 's1', task: 'Surplus Sum', math: '427 + 462 + 665', res: '1554' }],
        tableCols: [{key:'task', label:'Step'}, {key:'math', label:'Calculation'}, {key:'res', label:'Total', highlight: true}]
      },
      {
        text: "Step 2: Calculate Total Deficit (Pak + Italy + India + S. Afr + Japan).",
        highlightNames: ['Pak', 'Italy', 'India', 'S. Afr', 'Japan'],
        tableRows: [{ id: 's2', task: 'Deficit Sum', math: '1238+1225+514+425+41', res: '3443' }],
        tableCols: [{key:'task', label:'Step'}, {key:'math', label:'Calculation'}, {key:'res', label:'Total', highlight: true}]
      },
      {
        text: "Step 3: Solve for Net. 1554 (Surplus) - 3443 (Deficit) = -1889.",
        tableRows: [{ id: 's3', task: 'Final Balance', math: '1554 - 3443', res: '-1889' }],
        tableCols: [{key:'task', label:'Phase'}, {key:'math', label:'Equation'}, {key:'res', label:'Net Total', highlight: true}],
        overlay: "Net: -1889"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "What is the ratio between the UK surplus and the Pak-Italy deficit gap?",
    options: ['51 : 1', '40 : 1', '18 : 1'],
    answer: '51 : 1',
    explanation: "Deductive path: 1. UK Surplus = 665. 2. Pak-Italy Gap = 1238 - 1225 = 13. 3. 665 / 13 = 51.1.",
    tableRows: [
        { label: 'Step 1', task: 'UK Surplus', val: '665' },
        { label: 'Step 2', task: 'Deficit Gap', val: '13' },
        { label: 'Step 3', task: 'Ratio', val: '51 : 1' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Operation'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p2',
    question: "Which country has a deficit closest to the average deficit of India and S. Afr?",
    options: ['S. Afr', 'India', 'Japan'],
    answer: 'S. Afr',
    explanation: "Average = (514 + 425) / 2 = 469.5. S. Afr (425) is closer to 469.5 than India (514).",
    tableRows: [
        { label: 'Step 1', task: 'Avg (514+425)/2', val: '469.5' },
        { label: 'Step 2', task: 'Closest State', val: 'S. Afr' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Target'}, {key:'val', label:'Result', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const TradeDivergingChart = memo(({ highlightNames, currentOverlay, quizFeedback }) => {
  return (
    <div className="flex-1 flex flex-col relative px-4 sm:px-8 overflow-hidden min-h-0 pt-10 pb-20">
      <div className="flex-1 flex items-center justify-between relative h-full">
        {/* Simplified Grid Guidelines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
           {[1, 0, -1].map((i) => (
            <div key={i} className="w-full h-[1px] bg-white/5 flex items-center relative" style={{ top: `${50 - i * 50}%` }} />
           ))}
        </div>

        {/* 0 Baseline */}
        <div className="absolute w-full h-[2px] bg-white/20 z-20" style={{ top: '50%' }} />
        
        {/* Overlay Badge */}
        <AnimatePresence>
            {currentOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                  className="absolute top-[-25px] left-1/2 -translate-x-1/2 bg-white text-indigo-950 font-black px-6 py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-50 border-2 border-indigo-100"
                  style={{ fontSize: UI_CONFIG.headerSize }}
                >
                    {currentOverlay}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Bars with Logic-Driven Labels beneath */}
        {TRADE_DATA.map((item) => {
          const isHigh = highlightNames?.includes(item.name);
          const valAbs = Math.abs(item.value);
          const barHeight = (valAbs / 1400) * 50; 

          return (
            <div key={item.name} className="flex flex-col items-center flex-1 h-full relative z-10 px-0.5 max-w-[60px]">
              <div className="w-full h-full relative">
                <motion.div 
                  className={`absolute left-0 right-0 border-x border-white/10 shadow-inner rounded-sm ${item.value < 0 ? UI_CONFIG.deficitColor : UI_CONFIG.surplusColor}`}
                  animate={{ 
                    height: `${barHeight}%`, 
                    top: item.value < 0 ? '50%' : `${50 - barHeight}%`,
                    opacity: quizFeedback || !highlightNames ? 1 : (isHigh ? 1 : 0.15),
                    borderColor: isHigh ? '#fbbf24' : 'rgba(255,255,255,0.1)'
                  }}
                >
                </motion.div>
              </div>
              {/* COMPACT VERTICAL STACK BENEATH BAR */}
              <div className="absolute bottom-[-75px] w-full flex flex-col items-center gap-1">
                 <span className={`font-black uppercase transition-colors duration-300 ${isHigh ? 'text-yellow-400 scale-105' : 'text-white/40'}`} style={{ fontSize: '10px' }}>
                    {item.name}
                 </span>
                 <span className={`font-black transition-colors duration-300 ${isHigh ? 'text-white' : 'text-white/20'}`} style={{ fontSize: UI_CONFIG.textSize }}>
                    {valAbs}
                 </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

// ==========================================
// MAIN LAB CONTENT
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
    if (stepIndex > -1) setStepIndex(prev => prev - 1);
  }, [stepIndex]);

  const handleAnswerClick = (ans) => {
    if (!currentScenario || quizFeedback?.isCorrect) return;
    if (ans === currentScenario.answer) {
      setQuizFeedback({ isCorrect: true, explanation: currentScenario.explanation });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: "Calculation mismatch. Analyze the heights carefully!" });
    }
  };

  const jumpToConcept = (idx) => {
    setScenarioIndex(idx);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  if (isMastery) {
    return (
        <div className="h-screen w-screen bg-[#e6dccb] flex items-center justify-center p-4 font-sans relative overflow-hidden">
             <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
             <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
                <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
                <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Trade Master!</h2>
                <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've mastered interpretation of trade deficit/surplus charts!"</p>
                <button onClick={() => { setMode('concept'); setScenarioIndex(0); setStepIndex(-1); }} className="bg-[#3e2723] text-white py-4 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">Restart Lab</button>
            </div>
        </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative select-none">
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
        
        <section className="flex-[1.2] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-center shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Trade Performance</h3>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-orange-500" /><span className="text-white/40 font-bold uppercase text-[10px]">Deficit</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /><span className="text-white/40 font-bold uppercase text-[10px]">Surplus</span></div>
                    </div>
                </div>
                <button onClick={() => setStepIndex(-1)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50 shadow-inner"><RotateCcw size={14} /></button>
            </div>
            <TradeDivergingChart 
                highlightNames={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.highlightNames : null} 
                currentOverlay={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.overlay : null} 
                quizFeedback={quizFeedback}
            />
          </div>
        </section>

        <section className="flex-1 min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'concept' ? 'bg-yellow-400' : 'bg-green-500'}`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">
                        {mode === 'concept' ? (stepIndex === -1 ? 'Formula' : `Logic Step ${stepIndex + 1}`) : `Independent Task ${scenarioIndex + 1}`}
                    </span>
                </div>
                {mode === 'concept' && (
                  <div className="flex gap-1 relative z-50">
                    {CONCEPT_SCENARIOS.map((cs, idx) => (
                      <button key={cs.id} onClick={() => jumpToConcept(idx)} className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all border cursor-pointer ${scenarioIndex === idx ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg' : 'text-white/30 border-white/10 hover:text-white/60'}`}>{cs.shortTitle}</button>
                    ))}
                  </div>
                )}
            </div>

            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-0 relative">
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
                                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 shrink-0 shadow-inner">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">{currentScenario.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-yellow-400/30">Target Goal:</h4>
                                        <h3 className="text-white font-black uppercase tracking-tight leading-snug" style={{ fontSize: UI_CONFIG.headerSize }}>{currentScenario.question}</h3>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
                                  <div className="bg-white/5 p-4 rounded-t-2xl border-x border-t border-white/10 shadow-xl shrink-0">
                                      {stepIndex === -1 ? (
                                          <div className="flex flex-col gap-1.5">
                                              <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">Logic Map</span>
                                              <p className="text-white font-black italic leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>"{LOGIC_KEY}"</p>
                                              <p className="text-white/60 font-medium" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.coreExplanation}</p>
                                          </div>
                                      ) : (
                                          <div className="flex gap-4 items-start">
                                              <div className="bg-yellow-400 text-black font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[12px] shadow-lg">{stepIndex + 1}</div>
                                              <p className="text-white font-bold leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.steps?.[stepIndex]?.text}</p>
                                          </div>
                                      )}
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-b-2xl border-x border-b border-white/10 flex-1 min-h-0 flex flex-col overflow-hidden">
                                      {stepIndex !== -1 && currentScenario.steps?.[stepIndex]?.tableRows && (
                                          <MiniTable 
                                              rows={currentScenario.steps[stepIndex].tableRows} 
                                              cols={currentScenario.steps[stepIndex].tableCols} 
                                              activeId={currentScenario.steps[stepIndex].activeId}
                                              reverse={true} 
                                          />
                                      )}
                                  </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pt-2 shrink-0">
                                <button onClick={handlePrevStep} disabled={stepIndex === -1} className="flex items-center gap-2 text-white/40 hover:text-white transition-all disabled:opacity-0 cursor-pointer py-2 px-4 rounded-xl relative z-50">
                                    <ArrowLeft size={18} /> <span className="font-black uppercase text-[11px]">Back</span>
                                </button>
                                <button onClick={handleNextStep} className="bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer relative z-50" style={{ fontSize: '11px' }}>
                                    {stepIndex === -1 ? "Solve Together" : (stepIndex === (currentScenario.steps?.length || 0) - 1 ? (scenarioIndex === scenarios.length - 1 ? "Start Practice" : "Next Rule") : "Next Step")} <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-between overflow-hidden">
                            {!quizFeedback ? (
                                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                                    <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                        <div className="p-2 bg-green-500/20 rounded-lg text-green-500 shadow-lg"><Target size={24}/></div>
                                        <div className="flex-1">
                                          <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-green-500/30">Independent Task:</span>
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
                            ) : (
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    <div className="flex-1 overflow-hidden flex flex-col gap-2">
                                        <div className={`p-5 rounded-2xl border-2 w-full text-center shrink-0 ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-red-400" />}
                                                <span className="text-white font-black uppercase text-[12px] tracking-widest">{quizFeedback.isCorrect ? 'Logic Match!' : 'Try Again'}</span>
                                            </div>
                                            <p className="text-white/80 font-medium mb-1" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.isCorrect ? currentScenario.explanation : quizFeedback.explanation}</p>
                                        </div>
                                        {quizFeedback.isCorrect && currentScenario.tableRows && (
                                            <MiniTable rows={currentScenario.tableRows} cols={currentScenario.tableCols} reverse={false} />
                                        )}
                                    </div>
                                    <div className="shrink-0 pt-2 pb-4">
                                      <button 
                                          onClick={quizFeedback.isCorrect ? handleNextScenario : () => setQuizFeedback(null)}
                                          className="bg-white text-black py-4 w-full rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer relative z-50"
                                          style={{ fontSize: '12px' }}
                                      >
                                          {quizFeedback.isCorrect ? "Continue" : "Back to Task"}
                                      </button>
                                    </div>
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

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
        html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
        body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        
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