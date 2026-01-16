import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info, X,
  Weight, ClipboardList, Calculator, Scale, Equal,
  Layers, Combine, BookOpen, Hexagon, Boxes, Shapes
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. ASSETS & MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    title: 'Single Crop',
    items: [{ icon: '🍎', name: 'Apple', count: 3, unitWeight: 5 }],
    type: 'monomial',
    rhsWeight: 15,
    explanation: 'There is only ONE kind of object (Apples) on the pan. This is a Monomial.'
  },
  {
    id: 2,
    title: 'Orchard Mix',
    items: [
      { icon: '🍎', name: 'Apple', count: 2, unitWeight: 5 },
      { icon: '🍐', name: 'Pear', count: 2, unitWeight: 10 }
    ],
    type: 'binomial',
    rhsWeight: 30,
    explanation: 'There are TWO different kinds of objects (Apples + Pears). This is a Binomial (which is also a Polynomial!).'
  },
  {
    id: 3,
    title: 'Standard Weight',
    items: [{ icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 50 }],
    type: 'monomial',
    rhsWeight: 50,
    explanation: 'A single object type makes a single algebraic term. This is a Monomial.'
  },
  {
    id: 4,
    title: 'The Full Basket',
    items: [
      { icon: '🍎', name: 'Apple', count: 1, unitWeight: 5 },
      { icon: '🍐', name: 'Pear', count: 1, unitWeight: 10 },
      { icon: '🍓', name: 'Strawberry', count: 1, unitWeight: 2 }
    ],
    type: 'polynomial',
    rhsWeight: 17,
    explanation: 'There are THREE different types of objects. Since there are 2 or more, it is a Polynomial.'
  },
  {
    id: 5,
    title: 'Gem Collection',
    items: [
      { icon: '💎', name: 'Gem', count: 2, unitWeight: 20 },
      { icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 10 }
    ],
    type: 'binomial',
    rhsWeight: 50,
    explanation: 'Gems and Blocks are two different kinds of objects. This is a Binomial.'
  },
  {
    id: 6,
    title: 'Mega Mix',
    items: [
      { icon: '🍊', name: 'Orange', count: 2, unitWeight: 5 },
      { icon: '🍋', name: 'Lemon', count: 1, unitWeight: 5 },
      { icon: '💎', name: 'Gem', count: 1, unitWeight: 50 },
      { icon: '🍎', name: 'Apple', count: 1, unitWeight: 5 }
    ],
    type: 'polynomial',
    rhsWeight: 65,
    explanation: 'With four different kinds of objects, this is a multi-term Polynomial!'
  },
  {
    id: 7,
    title: 'Pure Berry',
    items: [{ icon: '🍓', name: 'Strawberry', count: 12, unitWeight: 1 }],
    type: 'monomial',
    rhsWeight: 12,
    explanation: 'Even though there are many berries, they are all the SAME kind. This is a Monomial.'
  }
];

const TEACHING_STEPS = [
  {
    id: 'monomial',
    label: 'Monomial',
    icon: <Hexagon size={20} />,
    definition: 'A Monomial is an algebraic expression with only ONE term.',
    visual: 'Notice there is only ONE KIND of object on the highlighted pan.',
    example: { items: [{ icon: '🍎', name: 'Apple', count: 3, unitWeight: 5 }], rhs: 15 }
  },
  {
    id: 'binomial',
    label: 'Binomial',
    icon: <Shapes size={20} />,
    definition: 'A Binomial is an algebraic expression with exactly TWO terms.',
    visual: 'Notice there are TWO DIFFERENT KINDS of objects on the highlighted pan.',
    example: { items: [{ icon: '🍎', name: 'Apple', count: 2, unitWeight: 5 }, { icon: '🍐', name: 'Pear', count: 1, unitWeight: 10 }], rhs: 20 }
  },
  {
    id: 'polynomial',
    label: 'Polynomial',
    icon: <Boxes size={20} />,
    definition: 'A Polynomial is an algebraic expression with TWO OR MORE terms.',
    visual: 'Binomials are also Polynomials! Polynomials can have 2 or more kinds of objects.',
    example: { items: [{ icon: '🍎', name: 'Apple', count: 1, unitWeight: 5 }, { icon: '🍐', name: 'Pear', count: 1, unitWeight: 10 }, { icon: '🍓', name: 'Berry', count: 1, unitWeight: 2 }], rhs: 17 }
  }
];

// Unified Weight Block Component
const WeightBlock = ({ weight, size = "large" }) => (
  <motion.div 
    initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
    className={`bg-slate-700 text-white rounded-xl flex items-center justify-center font-black shadow-2xl border-b-4 border-black/40 ring-2 ring-slate-800/30 shrink-0 z-10 mx-1
      ${size === "large" ? "w-12 h-12 sm:w-16 sm:h-16 text-xs sm:text-lg" : "w-10 h-10 sm:w-12 sm:h-12 text-[8px] sm:text-xs"}`}
  >
    <div className="flex flex-col items-center">
        <Weight size={size === "large" ? 14 : 10} className="mb-0.5 opacity-50" />
        {weight ? `${weight}g` : ""}
    </div>
  </motion.div>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function AlgebraClassificationLab() {
  const navigate = useNavigate();

  // --- UI State ---
  const [appMode, setAppMode] = useState('teach'); // 'teach' or 'practice'
  const [teachIndex, setTeachIndex] = useState(0);
  
  // --- Session State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = appMode === 'teach' ? null : MISSIONS[levelIndex];
  const currentExample = appMode === 'teach' ? TEACHING_STEPS[teachIndex] : null;

  const [selectedType, setSelectedType] = useState(null); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);

  const timerIntervalRef = useRef(null);

  const handleClassification = (type) => {
    if (isCorrect || appMode === 'teach') return;
    setSelectedType(type);
    
    // Logic: If user clicks 'polynomial' for a binomial mission, it's technically correct based on definition
    const isActuallyCorrect = type === mission.type || (mission.type === 'binomial' && type === 'polynomial');

    if (isActuallyCorrect) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleNextMission = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedType(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, handleNextMission]);

  // --- Sub-Render Div Functions ---

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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Expression Classification</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20 scale-90 sm:scale-100">
              <button onClick={() => { setAppMode('teach'); setTeachIndex(0); setIsCorrect(false); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'teach' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>LEARN CONCEPT</button>
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); setSessionCompleted(false); setIsCorrect(false); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>PRACTICE MODE</button>
            </div>
            <button onClick={() => window.location.reload()} className="p-2.5 bg-amber-500 text-[#3e2723] rounded-xl shadow-lg border-b-2 border-amber-800 active:scale-95 transition-transform">
              <RefreshCcw size={18} />
            </button>
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
            <div key={m.id} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i < levelIndex ? 'bg-emerald-500 border-emerald-700' : i === levelIndex ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          ))
        )}
      </div>
    </div>
  );

  const renderScaleDiv = () => {
    const activeData = appMode === 'teach' ? TEACHING_STEPS[teachIndex].example : mission;
    if (!activeData) return null;

    return (
      <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
        <div className={`relative w-full min-h-[350px] sm:min-h-[450px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden`}>
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
                      
                      {/* LHS PAN (With Highlights for Teaching) */}
                      <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <motion.div 
                            animate={appMode === 'teach' || isCorrect ? { 
                                scale: 1.05, 
                                boxShadow: "0 0 60px rgba(251, 191, 36, 0.6)" 
                            } : {}}
                            className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                          >
                              <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible px-4">
                                  {activeData.items.map((item, idx) => (
                                      <React.Fragment key={idx}>
                                        {[...Array(item.count)].map((_, i) => (
                                            <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                              {item.name === 'Weight Block' ? <WeightBlock weight={item.unitWeight} /> : <span className="text-3xl sm:text-6xl drop-shadow-lg">{item.icon}</span>}
                                            </motion.div>
                                        ))}
                                      </React.Fragment>
                                  ))}
                              </div>
                              <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Expression Pan</div>
                          </motion.div>
                      </div>

                      {/* RHS PAN (Balanced Counterweight) */}
                      <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8">
                               <div className="mb-10">
                                  <WeightBlock weight={activeData.rhsWeight || activeData.rhs} />
                               </div>
                               <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Total Weight</div>
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
                  <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Verified! This is a {mission.type.toUpperCase()}!</span>
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
            {appMode === 'teach' ? 'Term Encyclopedia' : 'Practice Console'}
          </div>

          {appMode === 'teach' ? (
            <div className="w-full flex flex-col gap-6">
                <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
                    {TEACHING_STEPS.map((step, idx) => (
                      <button key={step.id} onClick={() => setTeachIndex(idx)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                          ${teachIndex === idx ? 'bg-[#3e2723] text-white border-black scale-105 shadow-lg' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                        {step.icon} {step.label}
                      </button>
                    ))}
                </div>
                <motion.div key={teachIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-white shadow-inner text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                    <h3 className="text-[#3e2723] font-black text-xl sm:text-3xl mb-2">{currentExample.label}</h3>
                    <p className="text-[#5d4037] font-bold text-sm sm:text-lg mb-4 italic leading-tight">"{currentExample.definition}"</p>
                    <div className="bg-[#3e2723] text-amber-400 p-4 rounded-2xl text-[11px] sm:text-sm font-bold border-2 border-black/10">
                        {currentExample.visual}
                    </div>
                </motion.div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
               <p className="text-sm sm:text-xl font-black text-[#5d4037] text-center leading-tight uppercase tracking-tight">Categorize the expression on the left scale:</p>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                  {['monomial', 'binomial', 'polynomial'].map(type => (
                    <button key={type} onClick={() => handleClassification(type)} disabled={isCorrect}
                      className={`py-6 rounded-[2rem] font-black uppercase tracking-widest text-xs sm:text-sm transition-all border-b-8
                        ${selectedType === type && isCorrect ? 'bg-emerald-500 text-white border-emerald-700' : 
                          selectedType === type && isError ? 'bg-red-500 text-white border-red-700' :
                          'bg-white text-[#3e2723] border-[#d7ccc8] hover:bg-[#efebe9] active:translate-y-1'}`}>
                      {type}
                      {type === 'polynomial' && <span className="block text-[8px] opacity-60">(2+ Terms)</span>}
                    </button>
                  ))}
               </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        {appMode === 'teach' ? (
          <>
            <button onClick={() => setTeachIndex(p => Math.max(0, p - 1))} disabled={teachIndex === 0}
              className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-[#3e2723] active:scale-95 disabled:opacity-30 transition-all">
              Previous Term
            </button>
            {teachIndex < TEACHING_STEPS.length - 1 ? (
              <button onClick={() => setTeachIndex(p => p + 1)}
                className="flex items-center justify-center gap-3 bg-[#3e2723] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-black active:scale-95 transition-all">
                Next Term <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
                className="flex items-center justify-center gap-3 bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-indigo-900 animate-pulse active:scale-95 transition-all">
                Start Practice Lab <PlayCircle size={18} />
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={handleNextMission}
              className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
              <div className="flex items-center gap-2">
                <ChevronRight size={20} />
                <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP CONFIG'}</span>
              </div>
              {autoNextTimer !== null && <span className="bg-black/20 px-3 py-1 rounded-full text-xs">Next in {autoNextTimer}s</span>}
            </button>
            <button onClick={() => { setAppMode('teach'); setTeachIndex(0); setIsCorrect(false); }} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
              <BookOpen size={18} /> <span className="uppercase tracking-tighter">Review Definitions</span>
            </button>
          </>
        )}
    </div>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
        <Shapes size={64} className="animate-bounce" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Expressly Verified!</h1>
      <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You have successfully mastered the structural logic of Monomials, Binomials, and Polynomials.</p>
      <button onClick={() => navigate('/learn/mathematics/algebra/expressionIntro')} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Move to next module</button>
    </motion.div>
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
          </>
        ) : (
          <div className="w-full flex items-center justify-center p-4">
            {renderCompletionSummary()}
          </div>
        )}
      </div>
    </div>
  );
}
