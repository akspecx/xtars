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
  Lightbulb,
  Target,
  Calculator,
  ArrowLeft,
  TrendingUp,
  Wallet,
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
  smallText: '11px',
  expGradient: 'from-blue-600 to-blue-800',
  incGradient: 'from-green-500 to-green-700',
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const COMPANIES = [
  { id: 'm', label: 'M', expenditure: 45, income: 35 },
  { id: 'n', label: 'N', expenditure: 40, income: 50 },
  { id: 'p', label: 'P', expenditure: 45, income: 40 },
  { id: 'q', label: 'Q', expenditure: 30, income: 40 },
  { id: 'r', label: 'R', expenditure: 45, income: 50 }
];

const FORMULA = "% Profit/Loss = [(Income - Expenditure) / Expenditure] x 100";

// ==========================================
// SHARED COMPONENTS
// ==========================================
const MiniTable = ({ rows, cols, activeId }) => (
  <div className="w-full mt-2 rounded-xl border-2 border-white/10 bg-black/40 shadow-inner shrink-0 flex flex-col min-h-0 overflow-hidden">
    <div className="max-h-[180px] overflow-y-auto no-scrollbar overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0 min-w-[340px]">
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
            const isRowActive = activeId && (r.id === activeId || r.key === activeId);
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
    id: 'c1',
    title: "Joint Performance Analysis",
    shortTitle: "Combined Market",
    icon: <TrendingUp size={16} />,
    question: "What was the joint % Profit/Loss of M and N together?",
    coreExplanation: "To find combined profit, we must sum all Incomes and all Expenditures before applying the rule.",
    steps: [
      {
        text: "Step 1: Identify totals for Company M. Expenditure = 45, Income = 35.",
        highlightIds: ['m'], highlightType: 'both', activeId: 'm',
        tableRows: [{ id: 'm', label: 'M', exp: 45, inc: 35, res: '-' }],
        tableCols: [{key:'label', label:'Co'}, {key:'exp', label:'Expenditure'}, {key:'inc', label:'Income'}, {key:'res', label:'Total'}]
      },
      {
        text: "Step 2: Identify totals for Company N. Expenditure = 40, Income = 50.",
        highlightIds: ['n'], highlightType: 'both', activeId: 'n',
        tableRows: [
            { id: 'm', label: 'M', exp: 45, inc: 35 },
            { id: 'n', label: 'N', exp: 40, inc: 50 }
        ],
        tableCols: [{key:'label', label:'Co'}, {key:'exp', label:'Expenditure'}, {key:'inc', label:'Income'}]
      },
      {
        text: "Step 3: Combine them. Total Expenditure = 85. Total Income = 85. Result is 0% Profit.",
        highlightIds: ['m', 'n'], highlightType: 'both',
        tableRows: [{ id: 'sum', label: 'COMBINED', exp: 85, inc: 85, res: '0%' }],
        tableCols: [{key:'label', label:'Type'}, {key:'exp', label:'Total Expenditure'}, {key:'inc', label:'Total Income'}, {key:'res', label:'Profit %', highlight: true}],
        overlay: "Net Profit: 0%"
      }
    ]
  },
  {
    id: 'c3',
    title: "Backward Variable Discovery",
    shortTitle: "Historical Analysis",
    icon: <Calculator size={16} />,
    question: "If R's Expenditure increased by 20% from 2000 to 2001, find its 2000 Income (Profit was 10%).",
    coreExplanation: "We work backward from the current chart value to find the historical data point.",
    steps: [
      {
        text: "Step 1: Look at the chart for Company R in 2001. Its Expenditure bar shows 45 million.",
        highlightIds: ['r'], highlightType: 'exp', activeId: 'r',
        tableRows: [{ id: 'r21', year: '2001', expenditure: 45, status: 'Current Data' }],
        tableCols: [{key:'year', label:'Year'}, {key:'expenditure', label:'Expenditure'}, {key:'status', label:'Note'}]
      },
      {
        text: "Step 2: State the 20% growth rule. This means: Expenditure(2000) x 1.20 = Expenditure(2001).",
        highlightIds: ['r'], highlightType: 'exp',
        tableRows: [{ id: 'r20l', year: 'Relation', expenditure: '?', status: 'Prev Exp x 1.20 = 45' }],
        tableCols: [{key:'year', label:'Logic'}, {key:'expenditure', label:'Value'}, {key:'status', label:'Relationship'}]
      },
      {
        text: "Step 3: Rearrange to solve. So, Expenditure(2000) = 45 / 1.20.",
        highlightIds: ['r'], highlightType: 'exp',
        tableRows: [{ id: 'r20r', year: 'Solve', expenditure: '?', status: '45 ÷ 1.20' }],
        tableCols: [{key:'year', label:'Logic'}, {key:'expenditure', label:'Value'}, {key:'status', label:'Formula'}]
      },
      {
        text: "Step 4: The Expenditure in year 2000 was 37.5 million.",
        highlightIds: ['r'], highlightType: 'exp',
        tableRows: [{ id: 'r20f', year: '2000', expenditure: 37.5, status: 'Solved' }],
        tableCols: [{key:'year', label:'Year'}, {key:'expenditure', label:'Expenditure', highlight: true}, {key:'status', label:'Status'}],
        overlay: "Expenditure 2000 = 37.5"
      },
      {
        text: "Step 5: Find Income. Profit was 10%, so Income = 110% of Expenditure. 37.5 x 1.10 = 41.25.",
        highlightIds: ['r'], highlightType: 'both',
        tableRows: [{ id: 'ri', year: '2000', income: 41.25, status: '37.5 x 1.10' }],
        tableCols: [{key:'year', label:'Year'}, {key:'income', label:'Income 2000', highlight: true}, {key:'status', label:'Math Step'}],
        overlay: "Income 2000 = 41.25M"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "Income of Q in 2001 was 10% more than 2000. Profit in 2000 was 20%. Find Q's 2000 Expenditure.",
    options: ['30.30', '32.50', '28.40'],
    answer: '30.30',
    explanation: "Let's uncover the answer step-by-step to avoid any confusion:",
    highlightIds: ['q'], highlightType: 'both',
    tableRows: [
        { label: 'Step 1', task: 'Income 2001 (From Bar)', val: '40' },
        { label: 'Step 2', task: 'Logic: Inc 2000 x 1.10', val: '40' },
        { label: 'Step 3', task: 'Solve: 40 ÷ 1.10', val: '36.36' },
        { label: 'Step 4', task: 'Income 2000 Result', val: '36.36' },
        { label: 'Step 5', task: 'Profit: Exp 2000 x 1.20', val: '36.36' },
        { label: 'Step 6', task: 'Solve: 36.36 ÷ 1.20', val: '30.30' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Operation'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p2',
    question: "For Company N, if Income in 2001 was a 25% increase from 2000, what was the Income in 2000?",
    options: ['40.00', '37.50', '42.00'],
    answer: '40.00',
    explanation: "Working backward from the bar height of 50 for Company N:",
    highlightIds: ['n'], highlightType: 'inc',
    tableRows: [
        { label: 'Phase 1', task: 'Identify 2001 Income', val: '50' },
        { label: 'Phase 2', task: 'Growth Relation', val: 'Inc 2000 x 1.25 = 50' },
        { label: 'Phase 3', task: 'Rearrange Formula', val: 'Inc 2000 = 50 ÷ 1.25' },
        { label: 'Phase 4', task: 'Calculate Result', val: '40' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Deduction'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p3',
    question: "Which company faced the highest percentage loss in 2001?",
    options: ['Company M', 'Company P', 'Company Q'],
    answer: 'Company M',
    explanation: "Let's compare the Loss % of both companies using the rule:",
    highlightIds: ['m', 'p'], highlightType: 'both',
    tableRows: [
        { label: 'Company M', calc: '(10 loss / 45 exp)', res: '22.2% Loss' },
        { label: 'Company P', calc: '(5 loss / 45 exp)', res: '11.1% Loss' }
    ],
    tableCols: [{key:'label', label:'Company'}, {key:'calc', label:'Math'}, {key:'res', label:'Result', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const CompanyChart = memo(({ highlightIds, highlightType, currentOverlay }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 10, 20, 30, 40, 50].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 55) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/40 text-right w-8 leading-none text-[10px]">{val}</span>
            </div>
          ))}
        </div>
        
        {/* Premium Light Theme Badge */}
        <AnimatePresence>
            {currentOverlay && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} 
                  className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-white text-indigo-950 font-black px-6 py-2.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-50 border-2 border-indigo-100"
                  style={{ fontSize: UI_CONFIG.badgeSize }}
                >
                    {currentOverlay}
                </motion.div>
            )}
        </AnimatePresence>

        {COMPANIES.map((company) => {
          const isLit = highlightIds?.includes(company.id);
          const showExp = highlightType === 'both' || highlightType === 'exp';
          const showInc = highlightType === 'both' || highlightType === 'inc';

          return (
            <div key={company.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[85px] relative z-10 px-1">
              <div className="flex items-end gap-1 w-full h-full relative">
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.expGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${(company.expenditure / 55) * 100}%`, 
                    opacity: (isLit && showExp) || !highlightIds?.length ? 1 : 0.1, 
                    borderColor: (isLit && showExp) ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: 1 
                  }}
                >
                   {(isLit && showExp) && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/40 px-1 rounded shadow-lg">{company.expenditure}</div>}
                </motion.div>
                <motion.div 
                  className={`flex-1 rounded-t-sm bg-gradient-to-t ${UI_CONFIG.incGradient} border-x border-t transition-all duration-500`} 
                  animate={{ 
                    height: `${(company.income / 55) * 100}%`, 
                    opacity: (isLit && showInc) || !highlightIds?.length ? 1 : 0.1, 
                    borderColor: (isLit && showInc) ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                    scale: 1 
                  }}
                >
                   {(isLit && showInc) && <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-white bg-black/40 px-1 rounded shadow-lg">{company.income}</div>}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-around pt-2 shrink-0 h-8">
        {COMPANIES.map(c => (
          <div key={c.id} className="flex flex-col items-center flex-1">
            <span className="font-black text-white/40 uppercase text-[10px] tracking-tighter">{c.label}</span>
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
      setQuizFeedback({ isCorrect: false, explanation: "Incorrect calculation. Follow the logic map steps!" });
    }
  };

  const jumpToConcept = (idx) => {
    setScenarioIndex(idx);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  const activeHighlights = useMemo(() => {
    if (isMastery || !currentScenario) return [];
    if (mode === 'practice') return quizFeedback ? (currentScenario.highlightIds || []) : [];
    if (stepIndex === -1) return []; 
    return currentScenario.steps?.[stepIndex]?.highlightIds || [];
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
        // <div className="h-screen w-screen bg-[#e6dccb] flex items-center justify-center p-4 font-sans relative overflow-hidden">
        //      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        //      <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        //         <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        //         <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Statistical Master!</h2>
        //         <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've mastered financial data interpretation using logical step-by-step variables!"</p>
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
                    <button onClick={() => navigate('/learn/dataInterpretation/barChart/stackedBarChart')} className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Next Module<ArrowRightCircle size={18} /></button>
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
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Statistical Analysis</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-blue-700" /><span className="text-white/40 font-bold uppercase text-[9px]">Expenditure</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-green-600" /><span className="text-white/40 font-bold uppercase text-[9px]">Income</span></div>
                    </div>
                </div>
                <button onClick={() => setStepIndex(-1)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50 shadow-inner"><RotateCcw size={14} /></button>
            </div>
            <CompanyChart highlightIds={activeHighlights} highlightType={highlightType} currentOverlay={activeOverlay} />
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
                                
                                <div className="flex flex-col min-h-0 flex-1 overflow-hidden">
                                  <div className="bg-white/5 p-4 rounded-t-2xl border-x border-t border-white/10 shadow-xl shrink-0">
                                      {stepIndex === -1 ? (
                                          <div className="flex flex-col gap-1.5">
                                              <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">The Concept Rule</span>
                                              <p className="text-white font-black italic leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>"{FORMULA}"</p>
                                              <p className="text-white/60 font-medium text-[12px]">{currentScenario.coreExplanation}</p>
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
                                        {quizFeedback.isCorrect ? "Continue" : "Back to Task"}
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
//         html, body, #root { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background: #f1f0ee; }
//         body { font-family: 'Noto Sans', sans-serif; color: #1a1a1a; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         * { -webkit-tap-highlight-color: transparent; }
//       `}</style>
//     </Router>
//   );
// }