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
  Calculator,
  Repeat,
  ArrowLeft,
  MinusCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  badgeSize: '16px', // Increased for difference value
  smallText: '11px',
  passGradient: 'from-indigo-900 to-indigo-950',
  failGradient: 'from-gray-300 to-gray-400',
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const YEARS = [
  { id: 'y1', label: '1991-92', p: 150, f: 100, gap: 50 },
  { id: 'y2', label: '1992-93', p: 200, f: 100, gap: 100 },
  { id: 'y3', label: '1993-94', p: 300, f: 50, gap: 250 },
  { id: 'y4', label: '1994-95', p: 250, f: 100, gap: 150 },
  { id: 'y5', label: '1995-96', p: 300, f: 100, gap: 200 }
];

const SCHOOL_DATA = {
  pass: { y1: 150, y2: 200, y3: 300, y4: 250, y5: 300 },
  fail: { y1: 100, y2: 100, y3: 50, y4: 100, y5: 100 }
};

// ==========================================
// SHARED COMPONENTS
// ==========================================
const MiniTable = ({ rows, cols, activeId }) => (
  <div className="w-full mt-2 rounded-xl border-2 border-white/10 bg-black/40 shadow-2xl flex flex-col min-h-0 overflow-hidden">
    <div className="max-h-[140px] overflow-y-auto no-scrollbar overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0 min-w-[300px]">
        <thead>
          <tr className="bg-[#1a0f0d]">
            {cols.map(c => (
              <th 
                key={c.key} 
                className="sticky top-0 z-30 px-4 py-2.5 bg-[#1a0f0d] text-white/40 uppercase tracking-widest font-black border-b border-white/10 text-[9px]"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const isRowActive = activeId && r.id === activeId;
            return (
              <tr 
                key={i} 
                className={`transition-all duration-300 ${isRowActive ? 'bg-yellow-400/10' : 'hover:bg-white/5'}`}
              >
                {cols.map(c => (
                  <td 
                    key={c.key} 
                    className={`px-4 py-2 font-bold border-b border-white/5 text-white/80`}
                    style={{ fontSize: UI_CONFIG.textSize }}
                  >
                    {c.highlight ? (
                      <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full text-[12px] shadow-lg inline-block min-w-[32px] text-center">
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

// ==========================================
// SCENARIOS
// ==========================================
const CONCEPT_SCENARIOS = [
  {
    id: 'diff_logic',
    title: "Smallest Difference",
    shortTitle: "Difference",
    icon: <MinusCircle size={16} />,
    question: "Which year has the smallest difference?",
    coreExplanation: "Difference = Pass - Fail. We will add each year's data to our table one by one and calculate the gaps.",
    steps: [
      {
        text: "Step 1: Check 1991-92. Pass is 150, Fail is 100. Gap = 50.",
        highlightYears: ['y1'], highlightType: 'both', activeId: 'y1',
        tableRows: [YEARS[0]],
        tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Result', highlight: true}]
      },
      {
        text: "Step 2: Add 1992-93. Pass is 200, Fail is 100. Gap = 100.",
        highlightYears: ['y2'], highlightType: 'both', activeId: 'y2',
        tableRows: YEARS.slice(0, 2),
        tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Result', highlight: true}]
      },
      {
        text: "Step 3: Add 1993-94. Pass is 300, Fail is 50. Gap = 250.",
        highlightYears: ['y3'], highlightType: 'both', activeId: 'y3',
        tableRows: YEARS.slice(0, 3),
        tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Result', highlight: true}]
      },
      {
        text: "Step 4: Add 1994-95. Pass is 250, Fail is 100. Gap = 150.",
        highlightYears: ['y4'], highlightType: 'both', activeId: 'y4',
        tableRows: YEARS.slice(0, 4),
        tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Result', highlight: true}]
      },
      {
        text: "Step 5: Add 1995-96. Pass is 300, Fail is 100. Gap = 200.",
        highlightYears: ['y5'], highlightType: 'both', activeId: 'y5',
        tableRows: YEARS.slice(0, 5),
        tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Result', highlight: true}]
      },
      {
        text: "Final Result: The smallest gap in the table is 50 (from 1991-92).",
        highlightYears: ['y1'], highlightType: 'both', activeId: 'y1',
        tableRows: YEARS,
        tableCols: [{key:'label', label:'Year'}, {key:'gap', label:'Gap Analysis', highlight: true}],
        overlay: "Smallest Gap: 50"
      }
    ]
  },
  {
    id: 'avg_logic',
    title: "Average Failure",
    shortTitle: "Average",
    icon: <Calculator size={16} />,
    question: "What was the average failure?",
    coreExplanation: "Average = (Sum of all Failures) / (Total Years).",
    steps: [
      {
        text: "Identify Fail (Grey) bars for all five years.",
        highlightYears: ['y1', 'y2', 'y3', 'y4', 'y5'], highlightType: 'fail',
        tableRows: YEARS,
        tableCols: [{key:'label', label:'Year'}, {key:'f', label:'Failures'}]
      },
      {
        text: "Calculate Sum: 100 + 100 + 50 + 100 + 100 = 450 total students.",
        highlightYears: ['y1', 'y2', 'y3', 'y4', 'y5'], highlightType: 'fail',
        tableRows: [{ id:'sum', item: 'Total Sum', math: '100+100+50+100+100', res: '450' }],
        tableCols: [{key:'item', label:'Task'}, {key:'math', label:'Math'}, {key:'res', label:'Total', highlight: true}]
      },
      {
        text: "Divide 450 by 5 years to get an average of 90 students per year.",
        highlightYears: ['y1', 'y2', 'y3', 'y4', 'y5'], highlightType: 'fail',
        tableRows: [{ id:'avg', item: 'Average', math: '450 ÷ 5', res: '90' }],
        tableCols: [{key:'item', label:'Final'}, {key:'math', label:'Division'}, {key:'res', label:'Result', highlight: true}],
        overlay: "Avg Result: 90"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "In 1993-94, what is the exact difference between Pass and Fail students?",
    options: ['150', '250', '200'],
    answer: '250',
    explanation: "Correct! In 1993-94, 300 passed and 50 failed. 300 - 50 = 250.",
    highlightYears: ['y3'], highlightType: 'both',
    tableRows: [{ id: 'y3', label: '1993-94', p: 300, f: 50, gap: 250 }],
    tableCols: [{key:'label', label:'Year'}, {key:'p', label:'Pass'}, {key:'f', label:'Fail'}, {key:'gap', label:'Gap Result', highlight: true}]
  },
  {
    id: 'p2',
    question: "Identify the year where Passing students were exactly double the failing students.",
    options: ['1991-92', '1992-93', '1994-95'],
    answer: '1992-93',
    explanation: "Great! 100 kids failed and 200 passed. Since 100 x 2 = 200, it is double.",
    highlightYears: ['y2'], highlightType: 'both',
    tableRows: [{ id: 'y2', label: '1992-93', f: 100, double: 200, p: 200 }],
    tableCols: [{key:'label', label:'Year'}, {key:'f', label:'Fail'}, {key:'double', label:'Double'}, {key:'p', label:'Pass Result', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const SchoolChart = memo(({ highlightYears, highlightType, currentOverlay }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 100, 200, 300].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 350) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-8 leading-none text-[10px]">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Animated Badge - Lighter Theme & Larger Text */}
        <AnimatePresence>
            {currentOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }} 
                  className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-white text-indigo-950 font-black px-6 py-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 border-2 border-indigo-200"
                  style={{ fontSize: UI_CONFIG.badgeSize }}
                >
                    {currentOverlay}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Bars */}
        {YEARS.map((year) => {
          const vP = SCHOOL_DATA.pass[year.id];
          const vF = SCHOOL_DATA.fail[year.id];
          const isYearLit = highlightYears?.includes(year.id);
          const showPass = highlightType === 'both' || highlightType === 'pass';
          const showFail = highlightType === 'both' || highlightType === 'fail';

          return (
            <div key={year.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[80px] relative z-10 px-1">
              <div className="flex items-end gap-1 w-full h-full relative">
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.passGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${(vP / 350) * 100}%`, 
                    opacity: (isYearLit && showPass) || !highlightYears?.length ? 1 : 0.1, 
                    borderColor: (isYearLit && showPass) ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: 1 
                  }}
                >
                   {(isYearLit && showPass) && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/40 px-1 rounded shadow-lg">{vP}</div>}
                </motion.div>
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.failGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${(vF / 350) * 100}%`, 
                    opacity: (isYearLit && showFail) || !highlightYears?.length ? 1 : 0.1, 
                    borderColor: (isYearLit && showFail) ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: 1 
                  }}
                >
                   {(isYearLit && showFail) && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-black bg-white/40 px-1 rounded shadow-lg">{vF}</div>}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-around pt-2 shrink-0 h-8">
        {YEARS.map(y => (
          <div key={y.id} className="flex flex-col items-center flex-1">
            <span className="font-black text-white/40 uppercase text-[9px] tracking-tighter">{y.label.split('-')[0]}</span>
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
      setQuizFeedback({ isCorrect: false, explanation: "Calculation mismatch. Check the heights again!" });
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
    if (mode === 'practice') return quizFeedback ? (currentScenario.highlightYears || []) : [];
    if (stepIndex === -1) return []; 
    return currentScenario.steps?.[stepIndex]?.highlightYears || [];
  }, [mode, stepIndex, currentScenario, isMastery, quizFeedback]);

  const highlightType = useMemo(() => {
    if (isMastery || !currentScenario) return 'both';
    if (mode === 'practice') return currentScenario.highlightType || 'both';
    if (stepIndex === -1) return 'both';
    return currentScenario.steps?.[stepIndex]?.highlightType || 'both';
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
             <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
                <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
                <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Level Cleared!</h2>
                <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've mastered step-by-step school data analysis!"</p>
                <button onClick={resetLab} className="bg-[#3e2723] text-white py-4 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 transition-all cursor-pointer">Restart Lab</button>
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
        
        <section className="flex-[1.2] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
            <div className="flex justify-between items-center shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Statistical Analysis</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-indigo-950" /><span className="text-white/40 font-bold uppercase text-[9px]">Pass</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-gray-300" /><span className="text-white/40 font-bold uppercase text-[9px]">Fail</span></div>
                    </div>
                </div>
                <button onClick={() => setStepIndex(-1)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50 shadow-inner"><RotateCcw size={14} /></button>
            </div>
            <SchoolChart highlightYears={activeHighlights} highlightType={highlightType} currentOverlay={activeOverlay} />
          </div>
        </section>

        <section className="flex-1 min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner relative">
            
            <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${mode === 'concept' ? 'bg-yellow-400' : 'bg-green-500'}`} />
                    <span className="text-white/60 font-black tracking-widest uppercase text-[10px]">
                        {mode === 'concept' ? (stepIndex === -1 ? 'Introduction' : `Phase ${stepIndex + 1}`) : `Independent Task ${scenarioIndex + 1}`}
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
                            <div className="flex flex-col gap-3 min-h-0">
                                <div className="flex items-center gap-3 bg-black/20 p-3 rounded-xl border border-white/5 shrink-0 shadow-inner">
                                    <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">{currentScenario.icon}</div>
                                    <div className="flex-1">
                                        <h4 className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-yellow-400/30">Target Goal:</h4>
                                        <h3 className="text-white font-black uppercase tracking-tight leading-snug" style={{ fontSize: UI_CONFIG.headerSize }}>{currentScenario.question}</h3>
                                    </div>
                                </div>
                                
                                {/* FIX: Split description and table to prevent entire section scrolling */}
                                <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
                                  <div className="bg-white/5 p-4 rounded-t-2xl border-x border-t border-white/10 shadow-xl shrink-0">
                                      {stepIndex === -1 ? (
                                          <div className="flex flex-col gap-1.5">
                                              <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">The Concept Rule</span>
                                              <p className="text-white font-medium italic leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>"{currentScenario.coreExplanation}"</p>
                                          </div>
                                      ) : (
                                          <div className="flex gap-4 items-start">
                                              <div className="bg-yellow-400 text-black font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-[12px] shadow-lg">{stepIndex + 1}</div>
                                              <p className="text-white font-bold leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.steps?.[stepIndex]?.text}</p>
                                          </div>
                                      )}
                                  </div>
                                  <div className="bg-white/5 p-4 rounded-b-2xl border-x border-b border-white/10 flex-1 min-h-0 flex flex-col">
                                      {stepIndex !== -1 && currentScenario.steps?.[stepIndex]?.tableRows && (
                                          <MiniTable 
                                              rows={currentScenario.steps[stepIndex].tableRows} 
                                              cols={currentScenario.steps[stepIndex].tableCols} 
                                              activeId={currentScenario.steps[stepIndex].activeId}
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
                        <div className="flex-1 flex flex-col justify-around overflow-hidden">
                            {!quizFeedback ? (
                                <>
                                    <div className="flex items-center gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner shrink-0">
                                        <div className="p-2 bg-green-500/20 rounded-lg text-green-500 shadow-lg"><Target size={24}/></div>
                                        <div className="flex-1">
                                          <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-green-500/30">Your Task:</span>
                                          <h3 className="text-white font-black italic leading-tight" style={{ fontSize: UI_CONFIG.headerSize }}>"{currentScenario.question}"</h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden">
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
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center gap-3 overflow-y-auto no-scrollbar">
                                    <div className={`p-5 rounded-2xl border-2 w-full text-center ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-red-500/10 border-red-500/50'}`}>
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-red-400" />}
                                            <span className="text-white font-black uppercase text-[12px] tracking-widest">{quizFeedback.isCorrect ? 'Logic Match!' : 'Try Again'}</span>
                                        </div>
                                        <p className="text-white/80 font-medium leading-relaxed mb-3" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.isCorrect ? currentScenario.explanation : quizFeedback.explanation}</p>
                                        {quizFeedback.isCorrect && currentScenario.tableRows && (
                                            <MiniTable rows={currentScenario.tableRows} cols={currentScenario.tableCols} />
                                        )}
                                    </div>
                                    <button 
                                        onClick={quizFeedback.isCorrect ? handleNextScenario : () => setQuizFeedback(null)}
                                        className="bg-white text-black px-12 py-3.5 rounded-full font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer relative z-50"
                                        style={{ fontSize: '12px' }}
                                    >
                                        {quizFeedback.isCorrect ? "Continue Training" : "Back to Task"}
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