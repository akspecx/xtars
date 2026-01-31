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
  ArrowRightCircle,
  TrendingUp,
  RefreshCcw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  badgeSize: '16px', 
  catColor: 'bg-[#3b82f6]', 
  xatColor: 'bg-[#b91c1c]', 
  cetColor: 'bg-[#84cc16]', 
  noneColor: 'bg-[#7c3aed]', 
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const DATA = [
  { year: '2000', cat: 20, xat: 60, cet: 60, none: 30, total: 170, success: 140 },
  { year: '2001', cat: 30, xat: 60, cet: 60, none: 30, total: 180, success: 150 },
  { year: '2002', cat: 40, xat: 60, cet: 60, none: 40, total: 200, success: 160 }
];

const LOGIC_KEY = "Total Students = CAT + XAT + CET + None";

// ==========================================
// SHARED COMPONENTS
// ==========================================
const MiniTable = ({ rows, cols, activeId, reverse = false }) => {
  // Requirement: Conditional sort based on mode
  const sortedRows = useMemo(() => (reverse ? [...rows].reverse() : rows), [rows, reverse]);

  return (
    <div className="w-full rounded-xl border border-white/10 bg-black/40 shadow-inner flex flex-col min-h-0 overflow-hidden">
      <div className="overflow-y-auto overflow-x-auto flex-1 max-h-[180px] custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[340px]">
          <thead className="sticky top-0 z-30 bg-[#1a0f0d]">
            <tr className="border-b border-white/20">
              {cols.map(c => (
                <th 
                  key={c.key} 
                  className="px-4 py-3 text-white/40 uppercase tracking-widest font-black"
                  style={{ fontSize: '11px' }} 
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((r, i) => {
              const isRowActive = activeId && (r.id === activeId || r.key === activeId);
              return (
                <tr 
                  key={i} 
                  className={`transition-all duration-300 border-b border-white/5 last:border-0 ${isRowActive ? 'bg-yellow-400/10' : 'hover:bg-white/5'}`}
                >
                  {cols.map(c => (
                    <td 
                      key={c.key} 
                      className="px-4 py-3 font-bold text-white/80"
                      style={{ fontSize: UI_CONFIG.textSize }}
                    >
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
    title: "Understanding The Stack",
    shortTitle: "Chart Reading",
    icon: <BookOpen size={16} />,
    question: "How do we find the total value of students in a year?",
    coreExplanation: "A stacked bar adds values one on top of another. The total height is the sum of all individual colors.",
    steps: [
      {
        text: "Step 1: Check Year 2000. CAT is 20, XAT is 60, CET is 60, and None is 30.",
        activeYear: '2000', highlightSegment: 'all',
        tableRows: [{ id: 's1', part: 'Year 2000', cat: 20, xat: 60, cet: 60, n: 30 }],
        tableCols: [{key:'part', label:'Year'}, {key:'cat', label:'CAT'}, {key:'xat', label:'XAT'}, {key:'cet', label:'CET'}, {key:'n', label:'None'}]
      },
      {
        text: "Step 2: Add all values together: 20 + 60 + 60 + 30 = 170.",
        activeYear: '2000', highlightSegment: 'all',
        tableRows: [
          { id: 's1', label: 'Summation', math: '20+60+60+30', total: '170' }
        ],
        tableCols: [{key:'label', label:'Phase'}, {key:'math', label:'Calculation'}, {key:'total', label:'Total Height', highlight: true}]
      },
      {
        text: "Step 3: Verification. The top of the Year 2000 bar reaches 170 on the scale.",
        activeYear: '2000', highlightSegment: 'all',
        tableRows: [{ id: 's3', rule: 'Logic Rule', desc: LOGIC_KEY }],
        tableCols: [{key:'rule', label:'Concept'}, {key:'desc', label:'Definition', highlight: true}],
        overlay: "Top Height = 170"
      }
    ]
  },
  {
    id: 'c2',
    title: "Identifying Best Result",
    shortTitle: "Success Rate",
    icon: <TrendingUp size={16} />,
    question: "Which year showed the best success percentage in exams?",
    coreExplanation: "Success Percentage = (Students who cleared CAT, XAT, or CET) / Total x 100.",
    steps: [
      {
        text: "Step 1: Year 2000. Total = 170. So, success = (140 / 170) x 100 = 82.35%.",
        activeYear: '2000', highlightSegment: 'success', activeId: 'yr0',
        tableRows: [{ id: 'yr0', yr: '2000', s: 140, t: 170, res: '82.35%' }],
        tableCols: [{key:'yr', label:'Year'}, {key:'s', label:'Cleared'}, {key:'t', label:'Total'}, {key:'res', label:'Success %'}]
      },
      {
        text: "Step 2: Year 2001. Total = 180. So, success = (150 / 180) x 100 = 83.33%.",
        activeYear: '2001', highlightSegment: 'success', activeId: 'yr1',
        tableRows: [
            { id: 'yr0', yr: '2000', s: 140, t: 170, res: '82.35%' },
            { id: 'yr1', yr: '2001', s: 150, t: 180, res: '83.33%' }
        ],
        tableCols: [{key:'yr', label:'Year'}, {key:'s', label:'Cleared'}, {key:'t', label:'Total'}, {key:'res', label:'Success %'}]
      },
      {
        text: "Step 3: Year 2002. Total = 200. So, success = (160 / 200) x 100 = 80.00%.",
        activeYear: '2002', highlightSegment: 'success', activeId: 'yr2',
        tableRows: [
            { id: 'yr0', yr: '2000', s: 140, t: 170, res: '82.35%' },
            { id: 'yr1', yr: '2001', s: 150, t: 180, res: '83.33%' },
            { id: 'yr2', yr: '2002', s: 160, t: 200, res: '80.00%' }
        ],
        tableCols: [{key:'yr', label:'Year'}, {key:'s', label:'Cleared'}, {key:'t', label:'Total'}, {key:'res', label:'Success %'}]
      },
      {
        text: "Step 4: Comparing success rates, 2001 is the highest at 83.33%.",
        activeYear: '2001', highlightSegment: 'success', activeId: 'r2',
        tableRows: [
            { id: 'r1', yr: '2000', res: '82.35%' },
            { id: 'r2', yr: '2001', res: '83.33%' },
            { id: 'r3', yr: '2002', res: '80.00%' }
        ],
        tableCols: [{key:'yr', label:'Year'}, {key:'res', label:'Result %', highlight: true}],
        overlay: "Best Year: 2001"
      }
    ]
  },
  {
    id: 'c3',
    title: "Calculating Growth Rate",
    shortTitle: "Student Increase",
    icon: <Calculator size={16} />,
    question: "What is the % increase in total students in 2002 over 2000?",
    coreExplanation: "Increase % = [(New Total - Old Total) / Old Total] x 100.",
    steps: [
      {
        text: "Step 1: Find Year 2000 Total students from the top of the bar (170).",
        activeYear: '2000', highlightSegment: 'all', activeId: 'g1',
        tableRows: [{ id: 'g1', yr: '2000', val: 170 }],
        tableCols: [{key:'yr', label:'Year'}, {key:'val', label:'Total Students'}]
      },
      {
        text: "Step 2: Find Year 2002 Total students from the top of the bar (200).",
        activeYear: '2002', highlightSegment: 'all', activeId: 'g2',
        tableRows: [{ id: 'g1', yr: '2000', val: 170 }, { id: 'g2', yr: '2002', val: 200 }],
        tableCols: [{key:'yr', label:'Year'}, {key:'val', label:'Total Students'}]
      },
      {
        text: "Step 3: Solve the growth formula using both year totals.",
        activeYear: 'all',
        tableRows: [
            { id: 'stepA', phase: 'Step 1', task: 'Difference', math: '200 - 170', res: '30' },
            { id: 'stepB', phase: 'Step 2', task: 'Growth %', math: '(30 / 170) x 100', res: '17.65%' }
        ],
        tableCols: [{key:'phase', label:'Phase'}, {key:'task', label:'Item'}, {key:'math', label:'Calculation'}, {key:'res', label:'Result', highlight: true}],
        overlay: "Increase: 17.65%"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "What percentage of students cleared CAT in the year 2000?",
    options: ['11.76%', '14.20%', '10.50%'],
    answer: '11.76%',
    explanation: "Deductive path discovery:",
    tableRows: [
        { id: 's1', label: 'Step 1', task: 'Identify CAT students (2000)', val: '20' },
        { id: 's2', label: 'Step 2', task: 'Identify Total students (2000)', val: '170' },
        { id: 's3', label: 'Step 3', task: 'Calculation: (20 / 170) x 100', val: '11.76%' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Operation'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p2',
    question: "In 2002, what was the percentage of students who cleared AT LEAST one exam?",
    options: ['80%', '75%', '85%'],
    answer: '80%',
    explanation: "Deductive path discovery:",
    tableRows: [
        { id: 's1', label: 'Step 1', task: 'Total students in 2002', val: '200' },
        { id: 's2', label: 'Step 2', task: 'Sum of Cleared (40+60+60)', val: '160' },
        { id: 's3', label: 'Step 3', task: 'Calculation: (160 / 200) x 100', val: '80%' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Logic Step'}, {key:'val', label:'Result', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const EntranceExamChart = memo(({ activeYear, highlightSegment, currentOverlay, quizFeedback }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        <div className="absolute inset-0 pointer-events-none">
          {[0, 50, 100, 150, 200].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 220) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-10 leading-none" style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
            </div>
          ))}
        </div>
        
        <AnimatePresence>
            {currentOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                  className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-white text-indigo-950 font-black px-6 py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-50 border-2 border-indigo-100"
                  style={{ fontSize: UI_CONFIG.headerSize }}
                >
                    {currentOverlay}
                </motion.div>
            )}
        </AnimatePresence>

        {DATA.map((yearData) => {
          const isYearActive = activeYear === yearData.year || activeYear === 'all' || !activeYear;

          const hCat = (yearData.cat / 220) * 100;
          const hXat = (yearData.xat / 220) * 100;
          const hCet = (yearData.cet / 220) * 100;
          const hNone = (yearData.none / 220) * 100;

          const getOpacity = (seg) => {
            if (quizFeedback) return 1;
            if (!activeYear || activeYear === 'none') return 1;
            if (activeYear !== yearData.year && activeYear !== 'all') return 0.1;
            if (highlightSegment === 'all') return 1;
            if (highlightSegment === 'success' && seg !== 'none') return 1;
            return highlightSegment === seg ? 1 : 0.1;
          };

          return (
            <div key={yearData.year} className="flex flex-col items-center justify-end h-full flex-1 max-w-[100px] relative z-10 px-2">
              <div className="flex flex-col-reverse w-full h-full relative transition-all duration-500">
                <motion.div className={`w-full ${UI_CONFIG.catColor} border-x border-t border-white/20 relative shadow-inner`} animate={{ height: `${hCat}%`, opacity: getOpacity('cat') }}>
                    {getOpacity('cat') === 1 && <span className="absolute inset-0 flex items-center justify-center font-black text-white/50" style={{ fontSize: UI_CONFIG.textSize }}>{yearData.cat}</span>}
                </motion.div>
                <motion.div className={`w-full ${UI_CONFIG.xatColor} border-x border-t border-white/20 relative shadow-inner`} animate={{ height: `${hXat}%`, opacity: getOpacity('xat') }}>
                    {getOpacity('xat') === 1 && <span className="absolute inset-0 flex items-center justify-center font-black text-white/50" style={{ fontSize: UI_CONFIG.textSize }}>{yearData.xat}</span>}
                </motion.div>
                <motion.div className={`w-full ${UI_CONFIG.cetColor} border-x border-t border-white/20 relative shadow-inner`} animate={{ height: `${hCet}%`, opacity: getOpacity('cet') }}>
                    {getOpacity('cet') === 1 && <span className="absolute inset-0 flex items-center justify-center font-black text-white/50" style={{ fontSize: UI_CONFIG.textSize }}>{yearData.cet}</span>}
                </motion.div>
                <motion.div className={`w-full ${UI_CONFIG.noneColor} border-x border-t border-white/20 relative shadow-inner`} animate={{ height: `${hNone}%`, opacity: getOpacity('none') }}>
                    {getOpacity('none') === 1 && <span className="absolute inset-0 flex items-center justify-center font-black text-white/50" style={{ fontSize: UI_CONFIG.textSize }}>{yearData.none}</span>}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-around pt-2 shrink-0 h-8">
        {DATA.map(d => (
          <div key={d.year} className="flex flex-col items-center flex-1">
            <span className="font-black text-white/40 uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.textSize }}>{d.year}</span>
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
      setQuizFeedback({ isCorrect: false, explanation: "Incorrect value. Check the chart heights again!" });
    }
  };

  const jumpToConcept = (idx) => {
    setScenarioIndex(idx);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  if (isMastery) {
    return (
        // <div className="h-screen w-screen bg-[#e6dccb] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        //      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        //      <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        //         <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        //         <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Statistical Master!</h2>
        //         <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've mastered step-by-step interpretation of entrance exam charts!"</p>
        //         <button onClick={() => { setMode('concept'); setScenarioIndex(0); setStepIndex(-1); }} className="bg-[#3e2723] text-white py-4 w-full rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer">Restart Lab</button>
        //     </div>
        // </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl"><Trophy size={40} className="animate-bounce" /></div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Analytical Master!</h2>
                <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
                    "Phenomenal! You've transitioned from guided concepts to independent practice with perfect logic. You're a true data scientist!"
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                    <button onClick={() => { setMode('concept'); setScenarioIndex(0); setStepIndex(-1); }} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}><RefreshCcw size={16} /> Re-start</button>
                    <button onClick={() => navigate('/learn/dataInterpretation/barChart/tradeBarChart')} className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Next Module<ArrowRightCircle size={18} /></button>
                </div>
            </div>
        </div>
    </motion.div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full shrink-0 p-2 sm:p-3 relative z-40">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <button onClick={() => navigate('/learn/dataInterpretation/barChart')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[11px]"><ChevronLeft size={14} /> Dashboard</button>
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
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Deductive Exam Lab</h3>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-500" /><span className="text-white/40 font-bold uppercase text-[11px]">CAT</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-red-700" /><span className="text-white/40 font-bold uppercase text-[11px]">XAT</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-lime-500" /><span className="text-white/40 font-bold uppercase text-[11px]">CET</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-violet-600" /><span className="text-white/40 font-bold uppercase text-[11px]">None</span></div>
                    </div>
                </div>
                <button onClick={() => setStepIndex(-1)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50 shadow-inner"><RotateCcw size={14} /></button>
            </div>
            <EntranceExamChart 
                activeYear={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.activeYear : null} 
                highlightSegment={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.highlightSegment : null} 
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
                        {mode === 'concept' ? (stepIndex === -1 ? 'Initial Formula' : `Logic Step ${stepIndex + 1}`) : `Independent Task ${scenarioIndex + 1}`}
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
                                  <div className="bg-white/5 p-4 rounded-t-2xl border-x border-t border-white/10 shadow-xl shrink-0 overflow-y-auto custom-scrollbar">
                                      {stepIndex === -1 ? (
                                          <div className="flex flex-col gap-1.5">
                                              <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">Logical Formula</span>
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
                                              reverse={true} // Latest at top for Concept mode
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