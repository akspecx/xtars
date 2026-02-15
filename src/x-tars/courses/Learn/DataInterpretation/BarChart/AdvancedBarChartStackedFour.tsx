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
  AlertCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '16px', 
  textSize: '14px',   
  labelSize: '10px', 
  colors: {
    agriculture: 'bg-blue-600',
    services: 'bg-red-700',
    manufacturing: 'bg-lime-500',
    miscellaneous: 'bg-cyan-500'
  },
  panelBg: '#3e2723',
  headerBg: '#2a1a16'
};

const CONCEPT_DATA = [
  { 
    name: 'India', 
    agriculture: 40, 
    services: 20, 
    manufacturing: 20, 
    miscellaneous: 20 
  },
  { 
    name: 'Germany', 
    agriculture: 40, 
    services: 20, 
    manufacturing: 10, 
    miscellaneous: 30 
  }
];

const PRACTICE_DATA = [
  { 
    name: 'India', 
    agriculture: 45, 
    services: 15, 
    manufacturing: 25, 
    miscellaneous: 15 
  },
  { 
    name: 'France', 
    agriculture: 30, 
    services: 30, 
    manufacturing: 10, 
    miscellaneous: 30 
  }
];

const LOGIC_KEY = "Value = Boundary Top - Boundary Bottom";

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
             Guided
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
        <h2 className="text-xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Expert Analyst!</h2>
        <p className="text-[#3e2723] font-bold mb-8" style={{ fontSize: UI_CONFIG.textSize }}>"You've successfully mastered interpretation of trade boundary data!"</p>
        
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
    title: "Reading Stacked Boundaries",
    shortTitle: "Literacy",
    icon: <BookOpen size={16} />,
    question: "How do we calculate sector weight without data numbers?",
    coreExplanation: "A segment's weight is found by subtracting its bottom boundary value from its top boundary value on the scale.",
    steps: [
      {
        text: "India Services: Look at the Y-axis. It starts at the 40 mark and ends at the 60 mark. Formula: 60 - 40 = 20%.",
        highlightCountry: 'India', highlightSector: 'services',
        tableRows: [
            { id: 'i1', co: 'India', sec: 'Agri', start: '0', end: '40', val: '40%' },
            { id: 'i2', co: 'India', sec: 'Serv', start: '40', end: '60', val: '20%' }
        ],
        tableCols: [{key:'sec', label:'Sector'}, {key:'start', label:'Start'}, {key:'end', label:'End'}, {key:'val', label:'Value', highlight: true}]
      },
      {
        text: "Germany Manufacturing: It starts at the 60 mark (Top of Services) and ends at the 70 mark. Formula: 70 - 60 = 10%.",
        highlightCountry: 'Germany', highlightSector: 'manufacturing',
        tableRows: [
            { id: 'g1', co: 'Germany', sec: 'Agri', start: '0', end: '40', val: '40%' },
            { id: 'g2', co: 'Germany', sec: 'Serv', start: '40', end: '60', val: '20%' },
            { id: 'g3', co: 'Germany', sec: 'Mfg', start: '60', end: '70', val: '10%' }
        ],
        tableCols: [{key:'co', label:'State'}, {key:'sec', label:'Sector'}, {key:'start', label:'Start'}, {key:'end', label:'End'}, {key:'val', label:'Result', highlight: true}]
      }
    ]
  },
  {
    id: 'c2',
    title: "Monetary Deductions",
    shortTitle: "GDP Goals",
    icon: <Calculator size={16} />,
    question: "If Germany's total GDP is 10,000 Cr, what is the Manufacturing GDP?",
    coreExplanation: "GDP = (Sector % / 100) x Total GDP. First, find the % using the scale boundaries.",
    steps: [
      {
        text: "Germany Mfg: Starts at 60 mark, ends at 70 mark on the scale. Weight = 10%.",
        highlightCountry: 'Germany', highlightSector: 'manufacturing',
        tableRows: [{ id: 's1', task: 'Get %', math: '70 (End) - 60 (Start)', res: '10%' }],
        tableCols: [{key:'task', label:'Step'}, {key:'math', label:'Boundary Check'}, {key:'res', label:'Value', highlight: true}]
      },
      {
        text: "Apply to Scale: 10% of 10,000 Crores = 1,000 Crores.",
        tableRows: [{ id: 's2', task: 'Final Cr', math: '0.10 x 10,000', res: '1,000 Cr' }],
        tableCols: [{key:'task', label:'Step'}, {key:'math', label:'Calculation'}, {key:'res', label:'GDP', highlight: true}],
        overlay: "Mfg GDP: 1,000 Cr"
      }
    ]
  }
];

const PRACTICE_SCENARIOS = [
  {
    id: 'p1',
    question: "If Total GDP of France is 20,000 Cr, then GDP accounted for by Services is?",
    options: ['6,000 Cr', '4,000 Cr', '2,000 Cr'],
    answer: '6,000 Cr',
    explanation: "Deduction: France Services starts at the 30 mark and ends at the 60 mark (30%). 30% of 20,000 = 6,000 Cr.",
    tableRows: [
        { label: 'Step 1', task: 'Boundary (30 to 60)', val: '30%' },
        { label: 'Step 2', task: '0.3 x 20,000', val: '6,000 Cr' }
    ],
    tableCols: [{key:'label', label:'Phase'}, {key:'task', label:'Scale Logic'}, {key:'val', label:'Value', highlight: true}]
  },
  {
    id: 'p2',
    question: "What fraction of India's GDP is Agriculture in the practice chart?",
    options: ['9/20', '1/2', '1/4'],
    answer: '9/20',
    explanation: "India Agri ends at the 45 mark. As a fraction: 45/100 = 9/20.",
    tableRows: [
        { label: 'Step 1', task: 'Upper Bound', val: '45%' },
        { label: 'Step 2', task: 'Fraction', val: '9 / 20' }
    ],
    tableCols: [{key:'label', label:'Step'}, {key:'val', label:'Result', highlight: true}]
  },
  {
    id: 'p3',
    question: "If India GDP is 30,000 Cr and France is 20,000 Cr, what is the Cr difference in Misc contribution?",
    options: ['1,500 Cr', '2,000 Cr', '1,000 Cr'],
    answer: '1,500 Cr',
    explanation: "India Misc (100-85=15%) of 30k = 4,500. France Misc (100-70=30%) of 20k = 6,000. Diff = 1,500 Cr.",
    tableRows: [
        { id: '1', co: 'India Misc (15%)', val: '4,500 Cr' },
        { id: '2', co: 'France Misc (30%)', val: '6,000 Cr' },
        { id: '3', co: 'Difference', val: '1,500 Cr' }
    ],
    tableCols: [{key:'co', label:'Target'}, {key:'val', label:'Magnitude', highlight: true}]
  }
];

// ==========================================
// CHART COMPONENT
// ==========================================
const StackedGDPChart = memo(({ data, highlightCountry, highlightSector, quizFeedback }) => {
  return (
    <div className="flex-1 flex flex-col relative px-8 sm:px-12 overflow-hidden min-h-0 pt-8 pb-4">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        {/* Y-Axis Interval Guidelines */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${val}%` }}>
              <span className="absolute -left-12 font-black text-white/30 text-right w-12 leading-none" style={{ fontSize: '11px' }}>{val}%</span>
            </div>
          ))}
        </div>

        {data.map((country) => {
          const isCountryHigh = !highlightCountry || highlightCountry === country.name;
          
          const sectors = [
            { key: 'agriculture', val: country.agriculture, color: UI_CONFIG.colors.agriculture },
            { key: 'services', val: country.services, color: UI_CONFIG.colors.services },
            { key: 'manufacturing', val: country.manufacturing, color: UI_CONFIG.colors.manufacturing },
            { key: 'miscellaneous', val: country.miscellaneous, color: UI_CONFIG.colors.miscellaneous },
          ];

          return (
            <div key={country.name} className="flex flex-col items-center flex-1 max-w-[140px] h-full relative z-10 px-4">
              <div className="flex flex-col-reverse w-full h-full relative transition-all duration-500 rounded-t-lg overflow-visible border-x border-white/5 shadow-2xl">
                {sectors.map((sec) => {
                  const isActive = quizFeedback || (isCountryHigh && (!highlightSector || highlightSector === sec.key));

                  return (
                    <motion.div 
                      key={sec.key}
                      className={`w-full ${sec.color} relative border-t border-white/10 flex items-center justify-center`}
                      animate={{ height: `${sec.val}%`, opacity: isActive ? 1 : 0.2 }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-around pt-2 shrink-0 h-8">
        {data.map(d => (
          <div key={d.name} className="flex flex-col items-center flex-1">
            <span className="font-black text-white/40 uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.textSize }}>{d.name}</span>
          </div>
        ))}
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
      setQuizFeedback({ isCorrect: false, explanation: "Incorrect value. Use the Y-axis scale to subtract boundaries!" });
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
        title="Sync Composition Lab"
        mode={mode}
        onModeChange={(m) => { setMode(m); setScenarioIndex(0); setStepIndex(-1); setQuizFeedback(null); }}
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
                    <div className="flex justify-between items-start shrink-0 px-2">
                        <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>National Composition</h3>
                        <div className="flex flex-wrap gap-2 justify-end max-w-[200px]">
                            <div className="flex items-center gap-1"><div className={`w-2 h-2 ${UI_CONFIG.colors.agriculture}`} /><span className="text-white/40 text-[9px] font-black uppercase">Agri</span></div>
                            <div className="flex items-center gap-1"><div className={`w-2 h-2 ${UI_CONFIG.colors.services}`} /><span className="text-white/40 text-[9px] font-black uppercase">Serv</span></div>
                            <div className="flex items-center gap-1"><div className={`w-2 h-2 ${UI_CONFIG.colors.manufacturing}`} /><span className="text-white/40 text-[9px] font-black uppercase">Mfg</span></div>
                            <div className="flex items-center gap-1"><div className={`w-2 h-2 ${UI_CONFIG.colors.miscellaneous}`} /><span className="text-white/40 text-[9px] font-black uppercase">Misc</span></div>
                        </div>
                    </div>
                    <StackedGDPChart 
                        data={mode === 'concept' ? CONCEPT_DATA : PRACTICE_DATA}
                        highlightCountry={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.highlightCountry : null} 
                        highlightSector={mode === 'concept' ? currentScenario.steps?.[stepIndex]?.highlightSector : null}
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
                                {mode === 'concept' ? (stepIndex === -1 ? 'Formula' : `Step ${stepIndex + 1}`) : `Mission ${scenarioIndex + 1}`}
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
                                                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1.5 underline underline-offset-4 decoration-yellow-400/30">Boundary Decoding</span>
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
                                            {stepIndex === -1 ? "Start Analysis" : (stepIndex === (currentScenario.steps?.length || 0) - 1 ? (scenarioIndex === scenarios.length - 1 ? "To Practice" : "Next Rule") : "Next Step")} <ArrowRight size={18} />
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
                                                <span className="text-white/30 font-black uppercase text-[10px] mb-0.5 tracking-wider font-black underline decoration-2 decoration-green-500/30">Mission Mission:</span>
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
          width: 8px;
          height: 8px;
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