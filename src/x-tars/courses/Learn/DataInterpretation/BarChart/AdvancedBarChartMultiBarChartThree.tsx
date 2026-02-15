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
  Globe
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  labelSize: '12px', 
  importColor: 'bg-lime-600', 
  exportColor: 'bg-orange-500', 
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const CONCEPT_DATA = [
  { name: 'A', import: 87, export: 92 },
  { name: 'C', import: 2199, export: 433 },
  { name: 'E', import: 803, export: 725 },
  { name: 'G', import: 3604, export: 1223 },
  { name: 'H', import: 4605, export: 2916 },
  { name: 'I', import: 2744, export: 4002 },
  { name: 'L', import: 12699, export: 6045 }
];

const PRACTICE_DATA = CONCEPT_DATA.map(d => ({
    ...d,
    import: Math.round(d.import * 1.05), 
    export: Math.round(d.export * 0.95)  
}));

const LOGIC_KEY = "Surplus = Export - Import | Deficit = Import - Export";

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
           <span className="px-4 py-1.5 rounded-full font-black uppercase text-[10px] text-white/40">Lab Environment</span>
        </div>
      </div>
  </header>
);

const CompletionModal = ({ onRestart, onNext }) => (
  <div className="h-full w-full flex items-center justify-center p-4">
    <div className="bg-[#e6dccb] w-full max-w-sm p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative z-40">
        <Trophy size={64} className="mx-auto mb-4 text-[#3e2723] animate-bounce" />
        <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Sync Guru!</h2>
        <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've successfully mastered interpretation of trade synchronized charts!"</p>
        
        <div className="flex flex-col gap-3">
            <button 
                onClick={onRestart} 
                className="w-full bg-white border-2 border-[#3e2723] text-[#3e2723] py-4 rounded-full font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
                <RotateCcw size={14} /> Restart training
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
    title: "Understanding Trade Logic",
    shortTitle: "Literacy",
    icon: <BookOpen size={16} />,
    question: "How do we identify Surplus vs Deficit countries?",
    coreExplanation: "Surplus = Export - Import (If Sell > Buy)\nDeficit = Import - Export (If Buy > Sell)",
    steps: [
      {
        text: "Step 1: Identify all Surplus countries. We look for where the Orange bar is longer than the Green bar.",
        highlightNames: ['A', 'I'],
        tableRows: [
            { id: 'a', co: 'A', imp: 87, exp: 92, math: '92 - 87', res: '+5' },
            { id: 'i', co: 'I', imp: 2744, exp: 4002, math: '4002 - 2744', res: '+1258' }
        ],
        tableCols: [{key:'co', label:'State'}, {key:'imp', label:'Import'}, {key:'exp', label:'Export'}, {key:'math', label:'Calculation'}, {key:'res', label:'Surplus', highlight: true}]
      },
      {
        text: "Step 2: Identify all Deficit countries. Here, the Green bar (Import) is longer than the Orange bar (Export).",
        highlightNames: ['C', 'E', 'G', 'H', 'L'],
        tableRows: [
            { id: 'c', co: 'C', math: '2199 - 433', res: '1766' },
            { id: 'e', co: 'E', math: '803 - 725', res: '78' },
            { id: 'g', co: 'G', math: '3604 - 1223', res: '2381' },
            { id: 'h', co: 'H', math: '4605 - 2916', res: '1689' },
            { id: 'l', co: 'L', math: '12699 - 6045', res: '6654' }
        ],
        tableCols: [{key:'co', label:'State'}, {key:'math', label:'Import - Export'}, {key:'res', label:'Deficit Value', highlight: true}]
      }
    ]
  },
  {
    id: 'c2',
    title: "Highest Trade Deficit",
    shortTitle: "Deficit Goal",
    icon: <AlertCircle size={16} />,
    question: "Which country has the Highest Trade Deficit?",
    coreExplanation: "We calculate the magnitude for every single country to find the absolute leader.",
    steps: [
      {
        text: "Let's compute every country one-by-one: A, C, E, G, H, I, and L.",
        highlightNames: ['A', 'C', 'E', 'G', 'H', 'I', 'L'],
        tableRows: [
            { id: 'a', co: 'A', math: '87 - 92', val: '-5 (Surplus)' },
            { id: 'c', co: 'C', math: '2199 - 433', val: '1766' },
            { id: 'e', co: 'E', math: '803 - 725', val: '78' },
            { id: 'g', co: 'G', math: '3604 - 1223', val: '2381' },
            { id: 'h', co: 'H', math: '4605 - 2916', val: '1689' },
            { id: 'i', co: 'I', math: '2744 - 4002', val: '-1258 (Surplus)' },
            { id: 'l', co: 'L', math: '12699 - 6045', val: '6654' }
        ],
        tableCols: [{key:'co', label:'State'}, {key:'math', label:'Import - Export'}, {key:'val', label:'Result', highlight: true}]
      },
      {
        text: "Result: Comparing the values, Country L has a deficit of 6654, which is the highest in the entire list.",
        highlightNames: ['L'],
        tableRows: [{ id: 'win', co: 'State L', val: '6654', note: 'MAXIMUM' }],
        tableCols: [{key:'co', label:'Winner'}, {key:'val', label:'Deficit Value', highlight: true}, {key:'note', label:'Status'}]
      }
    ]
  },
  {
    id: 'c3',
    title: "Maximum to Minimum Ratios",
    shortTitle: "Ratio Logic",
    icon: <Calculator size={16} />,
    question: "What is the ratio of Maximum Exports to Minimum Imports?",
    coreExplanation: "Formula: Ratio = Highest Export / Lowest Import",
    steps: [
      {
        text: "Maximum Export: Scan the Orange bars. Country L is the leader at 6045.",
        highlightNames: ['L'], focus: 'export',
        tableRows: [{ id: 'max', item: 'Max Export', val: '6045', co: 'L' }],
        tableCols: [{key:'item', label:'Metric'}, {key:'val', label:'Value', highlight: true}, {key:'co', label:'State'}]
      },
      {
        text: "Minimum Import: Scan the Green bars. Country A is the lowest at 87.",
        highlightNames: ['A'], focus: 'import',
        tableRows: [
            { id: 'max', item: 'Max Export', val: '6045', co: 'L' },
            { id: 'min', item: 'Min Import', val: '87', co: 'A' }
        ],
        tableCols: [{key:'item', label:'Metric'}, {key:'val', label:'Value', highlight: true}, {key:'co', label:'State'}]
      },
      {
        text: "Final Step: 6045 / 87 = 69.48. This is nearly a 70:1 ratio.",
        tableRows: [{ id: 'res', item: 'Ratio', math: '6045 ÷ 87', res: '69.48' }],
        tableCols: [{key:'item', label:'Goal'}, {key:'math', label:'Math'}, {key:'res', label:'Result', highlight: true}],
        overlay: "Ratio ≈ 70:1"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "In this modified chart, how many countries exhibit a Trade Surplus (Export > Import)?",
    options: ['1 Country', '2 Countries', '3 Countries'],
    answer: '1 Country',
    explanation: "Data Analysis: Export for A is 87 and Import is 91. Only Country I (4202 Export > 2607 Import) has a surplus.",
    tableRows: [
        { id: '1', co: 'A', check: '87 < 91', res: 'Deficit' },
        { id: '2', co: 'I', check: '4202 > 2607', res: 'Surplus' },
        { id: '3', co: 'Others', check: 'Exp < Imp', res: 'Deficit' }
    ],
    tableCols: [{key:'co', label:'State'}, {key:'check', label:'Logic'}, {key:'res', label:'Status', highlight: true}]
  },
  {
    id: 'p2',
    question: "Which country has the highest ratio of Exports to Imports?",
    options: ['Country I', 'Country A', 'Country L'],
    answer: 'Country I',
    explanation: "Calculated Ratio for I is approx 1.61. For A it is 0.95. For L it is 0.45. I is the leader.",
    tableRows: [
        { label: 'Step 1', co: 'State I', val: '1.61 Ratio' },
        { label: 'Step 2', co: 'State A', val: '0.95 Ratio' },
        { label: 'Step 3', co: 'State L', val: '0.45 Ratio' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'co', label:'Target'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p3',
    question: "What is the combined Import value of Country E and H?",
    options: ['5678', '4605', '5408'],
    answer: '5678',
    explanation: "Summing the adjusted imports: E (843) + H (4835) = 5678.",
    tableRows: [
        { id: '1', item: 'State E Import', val: '843' },
        { id: '2', item: 'State H Import', val: '4835' },
        { id: '3', item: 'Total Sum', val: '5678' }
    ],
    tableCols: [{key:'item', label:'Data Point'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p4',
    question: "What is the average trade deficit across countries C, G, and L?",
    options: ['4802', '5230', '3950'],
    answer: '4802',
    explanation: "Summing deficits: C(1876) + G(2511) + L(6019) = 14406. Average = 14406 / 3 = 4802.",
    tableRows: [
        { id: '1', co: 'C+G+L Total', val: '14406' },
        { id: '2', co: 'Average', val: '4802' }
    ],
    tableCols: [{key:'co', label:'Metric'}, {key:'val', label:'Magnitude', highlight: true}]
  },
  {
    id: 'p5',
    question: "Which country has the lowest overall Trade Volume (Import + Export)?",
    options: ['Country A', 'Country E', 'Country C'],
    answer: 'Country A',
    explanation: "Total Volume: A(178), E(1532), C(2764). A is the lowest trade participant.",
    tableRows: [
        { id: '1', co: 'State A', val: '178' },
        { id: '2', co: 'State E', val: '1532' },
        { id: '3', co: 'State C', val: '2764' }
    ],
    tableCols: [{key:'co', label:'State'}, {key:'val', label:'Total Volume', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const DualTradeChart = memo(({ data, highlightNames, focus, quizFeedback }) => {
  const maxVal = 14000;

  return (
    <div className="flex-1 flex flex-col gap-4 p-2 sm:p-4 min-h-0 overflow-hidden">
      <div className="flex justify-between items-center px-8">
         <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${UI_CONFIG.importColor}`} /><span className="text-white/40 uppercase font-black text-[11px]">Imports</span></div>
         <div className="flex items-center gap-2"><span className="text-white/40 uppercase font-black text-[11px]">Exports</span><div className={`w-3 h-3 rounded-sm ${UI_CONFIG.exportColor}`} /></div>
      </div>

      <div className="flex-1 flex flex-col justify-between py-2 pr-12 pl-12">
        {data.map((item) => {
          const isHigh = highlightNames?.includes(item.name);
          const impW = (item.import / maxVal) * 100;
          const expW = (item.export / maxVal) * 100;

          return (
            <div key={item.name} className="flex items-center gap-4 h-8 sm:h-9 relative">
              
              <div className="flex-1 flex justify-end items-center relative h-full">
                <span className={`absolute right-[calc(100%+8px)] font-black text-white/60 transition-opacity ${!highlightNames || (isHigh && focus !== 'export') ? 'opacity-100' : 'opacity-10'}`} style={{ fontSize: UI_CONFIG.textSize }}>
                    {item.import}
                </span>
                <div className="w-full flex justify-end bg-white/5 rounded-l-md h-full overflow-hidden shadow-inner">
                    <motion.div 
                    className={`${UI_CONFIG.importColor} h-full rounded-l-sm border-r border-black/20`}
                    animate={{ 
                        width: `${impW}%`,
                        opacity: quizFeedback || !highlightNames ? 1 : (isHigh && focus !== 'export' ? 1 : 0.1)
                    }}
                    />
                </div>
              </div>

              <div className={`w-10 flex items-center justify-center font-black text-white rounded-full h-full border shadow-lg transition-all duration-500 z-20 shrink-0 ${isHigh ? 'bg-yellow-400 text-black border-yellow-400 scale-110' : 'bg-black/40 border-white/10'}`} style={{ fontSize: UI_CONFIG.textSize }}>
                {item.name}
              </div>

              <div className="flex-1 flex justify-start items-center relative h-full">
                <div className="w-full flex justify-start bg-white/5 rounded-r-md h-full overflow-hidden shadow-inner">
                    <motion.div 
                    className={`${UI_CONFIG.exportColor} h-full rounded-r-sm border-l border-black/20`}
                    animate={{ 
                        width: `${expW}%`,
                        opacity: quizFeedback || !highlightNames ? 1 : (isHigh && focus !== 'import' ? 1 : 0.1)
                    }}
                    />
                </div>
                <span className={`absolute left-[calc(100%+8px)] font-black text-white/60 transition-opacity ${!highlightNames || (isHigh && focus !== 'import') ? 'opacity-100' : 'opacity-10'}`} style={{ fontSize: UI_CONFIG.textSize }}>
                    {item.export}
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
      setQuizFeedback({ isCorrect: false, explanation: "Incorrect value. Sync both charts to find the leader!" });
    }
  };

  const jumpToConcept = (idx) => {
    setScenarioIndex(idx);
    setStepIndex(-1);
    setQuizFeedback(null);
  };

  return (
    <div className="h-screen w-screen bg-[#f1f0ee] flex flex-col items-center overflow-hidden font-sans relative select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <HeaderSection 
        onBack={() => navigate('/')} 
        title="Sync Trade Synchronizer" 
      />

      <main className="flex-1 w-full max-w-[900px] flex flex-col gap-2 sm:gap-4 p-2 sm:p-4 min-h-0 overflow-hidden relative z-10">
        
        {isMastery ? (
            <CompletionModal 
                onRestart={() => { setMode('concept'); setScenarioIndex(0); setStepIndex(-1); }}
                onNext={() => navigate('/')}
            />
        ) : (
            <>
                <section className="flex-[1.1] min-h-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
                <div className="flex-1 bg-[#3e2723] p-3 rounded-2xl flex flex-col shadow-inner overflow-hidden relative">
                    <div className="flex justify-between items-center shrink-0 px-2">
                        <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Trade Flow Synchronizer</h3>
                        <button onClick={() => setStepIndex(-1)} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 transition-colors cursor-pointer relative z-50 shadow-inner"><RotateCcw size={14} /></button>
                    </div>
                    <DualTradeChart 
                        data={mode === 'concept' ? CONCEPT_DATA : PRACTICE_DATA}
                        highlightNames={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.highlightNames : null} 
                        focus={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.focus : null}
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
                                {mode === 'concept' ? (stepIndex === -1 ? 'Initial Concept' : `Logic Phase ${stepIndex + 1}`) : `Independent Mission ${scenarioIndex + 1}`}
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
                                                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">Dual-Chart logic</span>
                                                    <p className="text-white font-black italic leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>"{LOGIC_KEY}"</p>
                                                    <p className="text-white/60 font-medium leading-relaxed" style={{ fontSize: UI_CONFIG.textSize }}>{currentScenario.coreExplanation}</p>
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
                                                <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-green-500/30">Sync Mission:</span>
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
                                                {quizFeedback.isCorrect ? "Continue" : "Back to Mission"}
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
            </>
        )}
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
          width: 6px;
          height: 6px;
          display: block !important;
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