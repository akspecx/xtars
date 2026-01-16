import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info, X as CloseIcon,
  Weight, ClipboardList, Calculator, Scale, Equal,
  BookOpen, Target, PenTool, CheckCircle2, Variable, Binary, Hash, HelpCircle,
  Divide
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. ASSETS & MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    title: 'Solving for Apple (X)',
    lhsItems: [{ icon: '🍎', name: 'apple', count: 2, unitWeight: 5, type: 'base' }],
    rhsTotal: 10,
    variableName: 'X',
    question: 'Find the Value of X:',
    options: ['X = 2', 'X = 5', 'X = 10'],
    correctIndex: 1,
    coefficient: 2
  },
  {
    id: 2,
    title: 'Solving for Orange (Y)',
    lhsItems: [{ icon: '🍊', name: 'orange', count: 4, unitWeight: 3, type: 'base' }],
    rhsTotal: 12,
    variableName: 'Y',
    question: 'Find the Value of Y:',
    options: ['Y = 3', 'Y = 4', 'Y = 8'],
    correctIndex: 0,
    coefficient: 4
  },
  {
    id: 3,
    title: 'Solving for Pear (P)',
    lhsItems: [{ icon: '🍐', name: 'pear', count: 3, unitWeight: 6, type: 'base' }],
    rhsTotal: 18,
    variableName: 'P',
    question: 'Find the Value of P:',
    options: ['P = 15', 'P = 9', 'P = 6'],
    correctIndex: 2,
    coefficient: 3
  },
  {
    id: 4,
    title: 'Solving for Lemon (L)',
    lhsItems: [{ icon: '🍋', name: 'lemon', count: 5, unitWeight: 5, type: 'base' }],
    rhsTotal: 25,
    variableName: 'L',
    question: 'Find the Value of L:',
    options: ['L = 5', 'L = 20', 'L = 50'],
    correctIndex: 0,
    coefficient: 5
  },
  {
    id: 5,
    title: 'Solving for Berry (B)',
    lhsItems: [{ icon: '🍓', name: 'berry', count: 2, unitWeight: 8, type: 'base' }],
    rhsTotal: 16,
    variableName: 'B',
    question: 'Find the Value of B:',
    options: ['B = 14', 'B = 8', 'B = 32'],
    correctIndex: 1,
    coefficient: 2
  }
];

const TEACHING_STEPS = [
  {
    id: 'step1',
    label: 'Step 1',
    title: 'The Observation',
    definition: '3 * Weight of one apple = 15',
    visual: 'First, we see the objects on the scale in math form.',
    lhs: [{ icon: '🍎', name: 'apple', count: 3, unitWeight: 5, type: 'base' }],
    rhs: 15
  },
  {
    id: 'step2',
    label: 'Step 2',
    title: 'Naming the Unknown',
    definition: 'You assume weight of one apple = X.\nSo, 3 * X = 15',
    visual: 'We use a variable X to represent the mystery weight.',
    lhs: [{ icon: '🍎', name: 'apple', count: 3, unitWeight: 5, type: 'base' }],
    rhs: 15
  },
  {
    id: 'step3',
    label: 'Step 3',
    title: 'Why Target 1?',
    definition: 'We want to find the weight of ONE apple. To do this, we must make the coefficient 3 become 1.\nWhy 1? Because 1 * X is just X!\nWhy not 0? Because 0 * X is 0, and we would lose our answer!',
    visual: 'Target: 1 * X = Weight of one item',
    lhs: [{ icon: '🍎', name: 'apple', count: 3, unitWeight: 5, type: 'base' }],
    rhs: 15
  },
  {
    id: 'step4',
    label: 'Step 4',
    title: 'The Division',
    definition: '3X/3 = 15/3',
    visual: 'We divide both sides by 3 to reach our target of 1.',
    lhs: [{ icon: '🍎', count: 3, unitWeight: 5, type: 'base' }],
    rhs: 15
  },
  {
    id: 'step5',
    label: 'Step 5',
    title: 'The Result',
    definition: 'X = 5',
    visual: 'Now we have our answer: one apple weighs 5g.',
    lhs: [{ icon: '🍎', name: 'apple', count: 1, unitWeight: 5, type: 'base' }],
    rhs: 5
  }
];

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================
const PanItem = ({ item }) => (
  <motion.div
    layout
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="relative flex items-center justify-center m-1 p-2 rounded-xl"
  >
    {item.icon === '🧱' ? (
      <div className="flex flex-col items-center text-white font-black">
        <Weight size={16} className="opacity-50" />
        <span className="text-[10px] sm:text-sm leading-none">{item.unitWeight}g</span>
      </div>
    ) : (
      <span className="text-3xl sm:text-5xl drop-shadow-md">{item.icon}</span>
    )}
  </motion.div>
);

const WeightBlock = ({ weight }) => (
  <motion.div 
    initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
    className="bg-slate-700 text-white w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center font-black shadow-2xl border-b-4 border-black/40 ring-2 ring-slate-800/30 shrink-0 z-10 mx-1"
  >
    <div className="flex flex-col items-center">
        <Weight size={14} className="mb-0.5 opacity-50" />
        {weight}g
    </div>
  </motion.div>
);

// ==========================================
// 3. MAIN LAB COMPONENT
// ==========================================
export default function AlgebraFindingXLab() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('teach'); 
  const [teachIndex, setTeachIndex] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const mission = appMode === 'practice' ? MISSIONS[levelIndex] : null;
  const currentTeach = appMode === 'teach' ? TEACHING_STEPS[teachIndex] : null;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationLines, setExplanationLines] = useState([]);

  const timerIntervalRef = useRef(null);

  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correctIndex) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setSelectedOption(null);
      }, 800);
    }
  };

  const handleNextMission = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  const runExplanation = async () => {
    setIsExplaining(true);
    const lines = [];
    const coeff = mission.coefficient;
    const total = mission.rhsTotal;
    const varName = mission.variableName.toUpperCase();
    const fruit = mission.lhsItems[0].name;
    const result = total / coeff;
    
    lines.push(`Step 1: ${coeff} * Weight of one ${fruit} = ${total}`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1000));

    lines.push(`Step 2: You assume weight of one ${fruit} = ${varName}`);
    lines.push(`So, ${coeff} * ${varName} = ${total}`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1200));

    lines.push(`Step 3: We need to find the weight of one ${fruit} so, we will try to make the coefficient ${coeff} to 1 and for that we will divide by ${coeff}.`);
    lines.push(`Note: We can't use 0, because anything * 0 is 0!`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 2000));

    lines.push(`Step 4: ${coeff}${varName}/${coeff} = ${total}/${coeff}`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1500));

    lines.push(`Final Result: ${varName} = ${result}`);
    setExplanationLines([...lines]);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, handleNextMission]);

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0">
      <header className="w-full bg-[#3e2723] p-4 sm:p-5 lg:p-6 rounded-[2.5rem] border-b-4 border-black/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full md:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 shadow-glow" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Solve for X</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20 scale-90 sm:scale-100">
              <button onClick={() => { setAppMode('teach'); setTeachIndex(0); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'teach' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>LEARN STEPS</button>
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); setSessionCompleted(false); setIsCorrect(false); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>SOLVE LAB</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

  const renderDotsDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-1">
      <div className="flex items-center gap-4 bg-[#3e2723]/5 p-4 rounded-full border border-[#3e2723]/10 shadow-inner">
        {appMode === 'teach' ? (
          TEACHING_STEPS.map((s, i) => (
            <div key={s.id} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i === teachIndex ? 'bg-blue-500 border-blue-700 ring-4 ring-blue-500/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          ))
        ) : (
          MISSIONS.map((m, i) => (
            <div key={m.id} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i < levelIndex ? 'bg-emerald-500 border-emerald-700 shadow-emerald-500/20' : i === levelIndex ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          ))
        )}
      </div>
    </div>
  );

  const renderScaleDiv = () => {
    const activeLhs = appMode === 'teach' ? currentTeach.lhs : mission.lhsItems;
    const activeRhs = appMode === 'teach' ? currentTeach.rhs : mission.rhsTotal;

    return (
      <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
        <div className={`relative w-full min-h-[350px] sm:min-h-[480px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative w-full max-w-5xl flex justify-center items-center scale-[0.25] sm:scale-[0.35] lg:scale-[0.45] origin-top transition-transform overflow-visible mt-12 sm:mt-16">
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] z-20" />
                  <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                  <div className="absolute bottom-[-30px] w-56 h-16 bg-[#2a1a16] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
              </div>

              <div className="relative w-full flex justify-center z-20 mt-[12%]">
                  <div className="relative w-full h-8 bg-[#2a1a16] rounded-full flex justify-between items-center shadow-lg px-2 border border-white/10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-yellow-500 rounded-full border-2 border-[#3e2723] z-30 shadow-glow" />
                      
                      {/* LHS PAN */}
                      <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center origin-top">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <motion.div 
                            animate={isCorrect ? { scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.6)" } : {}}
                            className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible px-4"
                          >
                              <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible">
                                  {activeLhs.map((item, idx) => (
                                      <React.Fragment key={idx}>
                                        {[...Array(item.count || 1)].map((_, i) => (
                                            <PanItem key={`${idx}-${i}`} item={item} />
                                        ))}
                                      </React.Fragment>
                                  ))}
                              </div>
                              <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Left Scale</div>
                          </motion.div>
                      </div>

                      {/* RHS PAN */}
                      <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center origin-top">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible px-4">
                               <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible">
                                  <WeightBlock weight={activeRhs} />
                                </div>
                               <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Right Scale</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="absolute bottom-6 left-0 w-full flex justify-center pointer-events-none px-4 z-[100]">
            <AnimatePresence mode="wait">
              {isCorrect && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-md pointer-events-auto">
                  <Trophy size={24} className="animate-bounce shrink-0" />
                  <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Solved! Value Identified.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const renderMatrixDiv = () => (
    <div className={`w-full max-w-[1200px] shrink-0 transition-opacity px-2 min-h-[160px] z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-col items-center justify-center shadow-xl relative overflow-visible gap-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">
            {appMode === 'teach' ? 'Method Encyclopedia' : 'Solution Selector'}
          </div>

          {appMode === 'teach' ? (
            <div className="w-full flex flex-col gap-6">
                <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
                    {TEACHING_STEPS.map((step, idx) => (
                      <button key={step.id} onClick={() => setTeachIndex(idx)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                          ${teachIndex === idx ? 'bg-[#3e2723] text-white border-black scale-105 shadow-lg' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                         {step.label}
                      </button>
                    ))}
                </div>
                <motion.div key={teachIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-white shadow-inner text-center relative overflow-hidden">
                    <h3 className={`font-black text-xl sm:text-3xl mb-2 text-[#3e2723]`}>{currentTeach.title}</h3>
                    <div className="text-[#5d4037] font-bold text-sm sm:text-lg mb-4 leading-tight whitespace-pre-line">
                        {currentTeach.definition}
                    </div>
                    <div className="bg-[#3e2723] text-amber-400 p-4 rounded-2xl text-[11px] sm:text-sm font-bold border-2 border-black/10 italic">
                        {currentTeach.visual}
                    </div>
                </motion.div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
               <div className="text-center w-full max-w-2xl">
                   {/* UNIFIED AND ALIGNED EQUATION BADGE */}
                   <div className="bg-white/80 p-8 rounded-[2.5rem] border-4 border-[#3e2723]/10 shadow-inner mb-6 flex flex-col items-center gap-4">
                       <div className="flex flex-col items-start gap-3 w-full max-w-[420px]">
                           <div className="flex items-center gap-4 w-full">
                               <span className="text-[11px] font-black text-[#8d6e63] uppercase w-14 text-right">Step 1:</span>
                               <span className="text-[#3e2723] font-mono text-sm sm:text-xl font-black whitespace-nowrap">
                                   {mission.coefficient} * Weight of one {mission.lhsItems[0].name} = {mission.rhsTotal}
                               </span>
                           </div>
                           <div className="flex items-center gap-4 w-full">
                               <span className="text-[11px] font-black text-[#8d6e63] uppercase w-14 text-right">Step 2:</span>
                               <span className="text-[#3e2723] font-mono text-sm sm:text-xl font-black whitespace-nowrap">
                                   {mission.coefficient} * {mission.variableName.toUpperCase()} = {mission.rhsTotal}
                               </span>
                           </div>
                       </div>
                       
                       {/* VARIABLE NOTE AT BOTTOM OF DIV */}
                       <div className="w-full mt-4 pt-4 border-t border-[#3e2723]/10 text-center">
                           <span className="text-[10px] sm:text-xs font-black text-[#8d6e63] uppercase tracking-widest italic">
                               Assume weight of one {mission.lhsItems[0].name} = {mission.variableName.toUpperCase()}
                           </span>
                       </div>
                   </div>

                   <p className="text-[#3e2723] font-black text-sm sm:text-xl uppercase tracking-tight leading-tight">
                      {mission.question}
                   </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
                  {mission.options.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isCorrect}
                      className={`group relative p-6 rounded-[2rem] border-b-8 transition-all flex items-center justify-between
                        ${selectedOption === idx && isCorrect ? 'bg-emerald-500 border-emerald-700 text-white' : 
                          selectedOption === idx && isError ? 'bg-red-500 border-red-700 text-white' :
                          'bg-white border-gray-200 text-[#3e2723] hover:bg-gray-50 active:translate-y-1'}`}
                    >
                      <span className="font-black text-sm sm:text-base text-center w-full">{option}</span>
                      {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="shrink-0 absolute right-4" />}
                    </button>
                  ))}
               </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderExplanationOverlay = () => (
    <AnimatePresence>
      {isExplaining && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#3e2723] pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar relative">
            <button onClick={() => { setIsExplaining(false); setExplanationLines([]); }} className="absolute top-6 right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all active:scale-95 shadow-lg"><CloseIcon size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-[#5d4037] mb-8 tracking-tighter text-center">Step-by-Step Logic</h2>
            <div className="w-full bg-[#3e2723] p-8 rounded-[2.5rem] border-4 border-black/20 mb-8 text-left shadow-inner flex flex-col gap-4">
              {explanationLines.map((line, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-sm sm:text-xl font-black ${line.includes('/') || line.includes('=') ? 'text-yellow-400' : 'text-yellow-100/80'} ${idx === explanationLines.length - 1 && line.includes('Result') ? 'border-t border-white/10 pt-4 mt-2' : ''}`}>
                  {line}
                </motion.p>
              ))}
            </div>
            <button onClick={() => { setIsExplaining(false); setExplanationLines([]); }} className="px-12 py-4 bg-[#3e2723] text-white font-black rounded-2xl uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 shadow-xl">Understood</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        {appMode === 'teach' ? (
          <>
            <button onClick={() => setTeachIndex(p => Math.max(0, p - 1))} disabled={teachIndex === 0}
              className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-[#3e2723] active:scale-95 disabled:opacity-30 transition-all">
              Previous Step
            </button>
            {teachIndex < TEACHING_STEPS.length - 1 ? (
              <button onClick={() => setTeachIndex(p => p + 1)}
                className="flex items-center justify-center gap-3 bg-[#3e2723] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-black active:scale-95 transition-all">
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); setSessionCompleted(false); setIsCorrect(false); }}
                className="flex items-center justify-center gap-3 bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-indigo-900 animate-pulse active:scale-95 transition-all">
                Start Solution Lab <PlayCircle size={18} />
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={handleNextMission}
              className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
              <div className="flex items-center gap-2">
                <ChevronRight size={20} />
                <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP MISSION'}</span>
              </div>
              {autoNextTimer !== null && <span className="bg-black/20 px-3 py-1 rounded-full text-xs">Next in {autoNextTimer}s</span>}
            </button>
            <button onClick={runExplanation} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
              <Info size={18} /> <span className="uppercase tracking-tighter">View Logic</span>
            </button>
          </>
        )}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-6 px-2 lg:px-4 overflow-y-auto bg-[#f1f0ee] no-scrollbar">
      <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)" }} />
      <div className="relative z-10 w-full flex flex-col items-center gap-y-10 sm:gap-y-12">
        {!sessionCompleted ? (
          <>
            {renderHeaderDiv()}
            {renderDotsDiv()}
            {renderScaleDiv()}
            {renderMatrixDiv()}
            {renderButtonsDiv()}
            {renderExplanationOverlay()}
          </>
        ) : (
          <div className="w-full flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
              <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
                <Calculator size={64} className="animate-bounce" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Value Mastered!</h1>
              <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You have successfully mastered the logical process of isolating $X$ and finding its value.</p>
              <button onClick={() => navigate('/learn/mathematics/algebra/SolveBasicEquation')} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Complete Module</button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}