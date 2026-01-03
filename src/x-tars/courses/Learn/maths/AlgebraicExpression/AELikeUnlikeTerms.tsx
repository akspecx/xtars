import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info, X,
  Weight, ClipboardList, Calculator, Scale, Equal,
  Layers, Combine, BookOpen
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. ASSETS & MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    title: 'Apple Orchard',
    items: [{ icon: '🍎', name: 'Apple', count: 4, unitWeight: 5 }],
    type: 'like',
    rhsWeight: 20,
    explanation: 'Since all items on the scale are the same kind (only Apples), they are Like Terms.'
  },
  {
    id: 2,
    title: 'Fruit Basket',
    items: [
      { icon: '🍎', name: 'Apple', count: 2, unitWeight: 5 },
      { icon: '🍐', name: 'Pear', count: 2, unitWeight: 8 }
    ],
    type: 'unlike',
    rhsWeight: 26,
    explanation: 'We have a mix of Apples and Pears. Different objects mean these are Unlike Terms.'
  },
  {
    id: 3,
    title: 'Pure Weight',
    items: [{ icon: '🧱', name: 'Weight Block', count: 3, unitWeight: 10 }],
    type: 'like',
    rhsWeight: 30,
    explanation: 'Every item is a Weight Block. Since they are all the same kind of object, they are Like Terms.'
  },
  {
    id: 4,
    title: 'Cargo Loading',
    items: [
      { icon: '🍓', name: 'Strawberry', count: 3, unitWeight: 2 },
      { icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 10 }
    ],
    type: 'unlike',
    rhsWeight: 16,
    explanation: 'A Strawberry and a Weight Block are different kinds of objects. Therefore, they are Unlike Terms.'
  },
  {
    id: 5,
    title: 'Gem Vault',
    items: [{ icon: '💎', name: 'Gem', count: 5, unitWeight: 20 }],
    type: 'like',
    rhsWeight: 100,
    explanation: 'We have 5 gems, but they are all the same kind of object. These are Like Terms.'
  },
  {
    id: 6,
    title: 'Market Variety',
    items: [
      { icon: '🍊', name: 'Orange', count: 2, unitWeight: 6 },
      { icon: '🍋', name: 'Lemon', count: 1, unitWeight: 4 }
    ],
    type: 'unlike',
    rhsWeight: 16,
    explanation: 'Oranges and Lemons are different objects. They are Unlike Terms.'
  },
  {
    id: 7,
    title: 'Mixed Harvest',
    items: [
      { icon: '🍐', name: 'Pear', count: 3, unitWeight: 8 },
      { icon: '🍎', name: 'Apple', count: 2, unitWeight: 5 }
    ],
    type: 'unlike',
    rhsWeight: 34,
    explanation: 'This cargo contains both Pears and Apples. Since the objects are mixed, they are Unlike Terms.'
  }
];

// Unified Weight Block Component for visual consistency
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
export default function AlgebraLikeUnlikeDiscovery() {
  const navigate = useNavigate();

  // --- Session & Logic State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const mission = MISSIONS[levelIndex];
  
  const [selectedType, setSelectedType] = useState(null); 
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  
  // Intro Sequence
  const [introStep, setIntroStep] = useState(0); 
  const [isIntroAnimating, setIsIntroAnimating] = useState(true);

  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);
  const [highlightSide, setHighlightSide] = useState(null); 

  const timerIntervalRef = useRef(null);

  const handleSelect = (type) => {
    if (isCorrect || isIntroAnimating) return;
    setSelectedType(type);
    
    if (type === mission.type) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 800);
    }
  };

  const handleNext = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedType(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
      setIntroStep(0);
      setIsIntroAnimating(true);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  // Mission Intro Animation
  useEffect(() => {
    if (isIntroAnimating) {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 800));
            setIntroStep(1); // LHS Observation
            await new Promise(r => setTimeout(r, 2000));
            setIntroStep(2); // Ready
            setIsIntroAnimating(false);
        };
        sequence();
    }
  }, [isIntroAnimating]);

  const runExplanation = async () => {
    setIsExplaining(true);
    setHighlightSide('lhs');
    setFormulas(["Logical Analysis"]);
    
    const uniqueItems = [...new Set(mission.items.map(i => i.name))];
    
    if (mission.type === 'like') {
      setExplanationText(`Step 1: On the Left Side, we only see ${uniqueItems[0]}s.`);
      setFormulas(prev => [...prev, "All items are of the SAME KIND.", "Object: " + uniqueItems[0]]);
    } else {
      setExplanationText(`Step 1: On the Left Side, we see a mixture of ${uniqueItems.join(" and ")}.`);
      setFormulas(prev => [...prev, "Items are of DIFFERENT KINDS.", "Mixed objects detected."]);
    }
    await new Promise(r => setTimeout(r, 3000));

    setFormulas(prev => [...prev, `Conclusion: ${mission.type.toUpperCase()} TERMS`]);
    setExplanationText(mission.explanation);
    await new Promise(r => setTimeout(r, 3000));
    setHighlightSide(null);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, handleNext]);

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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Like vs Unlike Terms</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-[#4e342e] px-4 py-2 rounded-2xl border border-white/10 flex flex-col items-center">
               <span className="text-[8px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mb-1">Concept Node</span>
               <span className="text-white font-black leading-none">#{mission.id}</span>
            </div>
            <button onClick={() => { setSelectedType(null); setIsCorrect(false); setIntroStep(0); setIsIntroAnimating(true); }} className="p-2.5 bg-amber-500 text-[#3e2723] rounded-xl shadow-lg border-b-2 border-amber-800 active:scale-95 transition-transform">
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
        {MISSIONS.map((m, i) => (
          <div key={m.id} className="relative">
            <motion.div animate={i === levelIndex ? { scale: [1, 1.4, 1] } : {}} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 shadow-md ${i < levelIndex ? 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20' : i === levelIndex ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderScaleDiv = () => (
    <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
      <div className={`relative w-full min-h-[400px] sm:min-h-[520px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden transition-all ${isExplaining ? 'brightness-50 grayscale-[0.3]' : ''}`}>
        <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)" }} />
        
        {/* Scale Assembly */}
        <div className="relative w-full max-w-5xl flex justify-center items-center scale-[0.25] sm:scale-[0.38] lg:scale-[0.48] origin-top transition-transform overflow-visible mt-12 sm:mt-16">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#2a1a16] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <div className="relative w-full h-8 bg-[#2a1a16] rounded-full flex justify-between items-center shadow-lg px-2 border border-white/10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-yellow-500 rounded-full border-2 border-[#3e2723] z-30 shadow-glow" />
                    
                    {/* PAN (LHS Items) */}
                    <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                        </svg>
                        <motion.div 
                          animate={(introStep === 1 || highlightSide === 'lhs' || isCorrect) ? { scale: 1.05, boxShadow: "0 0 60px rgba(251, 191, 36, 0.4)" } : {}}
                          className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                        >
                            <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible">
                                {mission.items.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      {[...Array(item.count)].map((_, i) => (
                                          <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            {item.name === 'Weight Block' ? <WeightBlock weight={item.unitWeight} /> : <span className="text-3xl sm:text-6xl drop-shadow-lg">{item.icon}</span>}
                                          </motion.div>
                                      ))}
                                    </React.Fragment>
                                ))}
                            </div>
                            <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest">LHS Side</div>
                        </motion.div>
                    </div>

                    {/* RIGHT PAN (Counter Weight) */}
                    <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                        </svg>
                        <div className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="mb-10">
                                <WeightBlock weight={mission.rhsWeight} />
                             </div>
                             <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest">RHS Side</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEEDBACK OVERLAY */}
        <div className="absolute bottom-6 left-0 w-full flex justify-center pointer-events-none px-4 z-[100]">
          <AnimatePresence mode="wait">
            {isCorrect ? (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-md pointer-events-auto">
                <Trophy size={24} className="animate-bounce shrink-0" />
                <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Verified! These are {mission.type.toUpperCase()} terms!</span>
                <Sparkles size={20} className="text-yellow-300 animate-pulse shrink-0" />
              </motion.div>
            ) : !isIntroAnimating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/90 backdrop-blur-md px-8 py-2 rounded-full shadow-xl font-bold uppercase tracking-widest text-[9px] sm:text-sm text-[#8d6e63] border-2 border-[#8d6e63]/20 flex items-center gap-2">
                    <Info size={16} /> Look at the LHS objects. Are they all the same kind?
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderMatrixDiv = () => (
    <div className={`w-full max-w-[1200px] shrink-0 transition-opacity px-2 min-h-[160px] z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-col items-center justify-center shadow-xl relative overflow-visible gap-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">Lab Console: Term Categorization</div>
          
          {/* DEFINITIONS TILE */}
          <div className="w-full max-w-3xl bg-[#4e342e] p-4 rounded-[2rem] border-2 border-dashed border-[#8d6e63]/40 flex flex-col sm:flex-row gap-4 shadow-inner mb-2 text-left">
              <div className="flex-1 flex items-start gap-3 bg-black/10 p-3 rounded-2xl">
                 <Combine className="text-emerald-400 shrink-0 mt-1" size={18} />
                 <div>
                    <h4 className="text-emerald-400 font-black text-[10px] uppercase leading-none mb-1">Like Terms</h4>
                    <p className="text-[#dfd7cc] text-[9px] font-bold leading-tight">Terms that consist of the SAME KIND of object.</p>
                 </div>
              </div>
              <div className="flex-1 flex items-start gap-3 bg-black/10 p-3 rounded-2xl">
                 <Layers className="text-purple-400 shrink-0 mt-1" size={18} />
                 <div>
                    <h4 className="text-purple-400 font-black text-[10px] uppercase leading-none mb-1">Unlike Terms</h4>
                    <p className="text-[#dfd7cc] text-[9px] font-bold leading-tight">Terms that consist of DIFFERENT KINDS of objects.</p>
                 </div>
              </div>
          </div>

          <div className="flex flex-row items-stretch justify-center gap-4 w-full max-w-2xl bg-white/40 p-2 rounded-[2.5rem] border-2 border-white shadow-inner">
              <button 
                onClick={() => handleSelect('like')} 
                disabled={isCorrect || isIntroAnimating}
                className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-[2rem] transition-all border-b-8
                  ${selectedType === 'like' && isCorrect ? 'bg-emerald-500 text-white border-emerald-700' : 
                    selectedType === 'like' && isError ? 'bg-red-500 text-white border-red-700' :
                    'bg-white text-[#3e2723] border-[#d7ccc8] hover:bg-[#efebe9]'} 
                  ${isIntroAnimating ? 'opacity-30' : 'active:translate-y-1'}`}
              >
                  <Combine size={32} className={selectedType === 'like' ? 'text-white' : 'text-emerald-600'} />
                  <span className="font-black uppercase tracking-widest text-xs sm:text-lg leading-none">Like Terms</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase leading-none">Same Kind</span>
              </button>

              <button 
                onClick={() => handleSelect('unlike')} 
                disabled={isCorrect || isIntroAnimating}
                className={`flex-1 flex flex-col items-center gap-2 py-6 rounded-[2rem] transition-all border-b-8
                  ${selectedType === 'unlike' && isCorrect ? 'bg-emerald-500 text-white border-emerald-700' : 
                    selectedType === 'unlike' && isError ? 'bg-red-500 text-white border-red-700' :
                    'bg-white text-[#3e2723] border-[#d7ccc8] hover:bg-[#efebe9]'} 
                  ${isIntroAnimating ? 'opacity-30' : 'active:translate-y-1'}`}
              >
                  <Layers size={32} className={selectedType === 'unlike' ? 'text-white' : 'text-purple-600'} />
                  <span className="font-black uppercase tracking-widest text-xs sm:text-lg leading-none">Unlike Terms</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase leading-none">Mixed Kinds</span>
              </button>
          </div>
      </div>
    </div>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        <button onClick={handleNext} className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
          <div className="flex items-center gap-2">
            <ChevronRight size={20} />
            <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP CONCEPT'}</span>
          </div>
          {autoNextTimer !== null && (
            <div className="flex items-center gap-2 bg-black/30 px-4 py-1 rounded-full text-xs">
              <Timer size={14} className="animate-spin" />
              <span>Next in {autoNextTimer}s</span>
            </div>
          )}
        </button>
        <button onClick={runExplanation} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
          <Info size={18} /> <span className="uppercase tracking-tighter">View Explanation</span>
        </button>
    </div>
  );

  const renderExplanationOverlay = () => (
    <AnimatePresence>
      {isExplaining && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#3e2723] pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => setIsExplaining(false)} className="absolute top-6 right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all active:scale-95 shadow-lg"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-[#5d4037] mb-8 tracking-tighter text-center">Logical Term Analysis</h2>
            <div className="w-full bg-[#3e2723] p-6 rounded-[2.5rem] border-4 border-black/20 mb-8 text-left shadow-inner">
              {formulas.map((line, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-xs sm:text-xl font-black mb-3 last:mb-0 ${idx === formulas.length - 1 ? 'text-yellow-400 border-t border-white/10 pt-3 mt-3' : 'text-yellow-100/80'}`}>
                  {line}
                </motion.p>
              ))}
            </div>
            <div className="w-full bg-white p-6 rounded-[2rem] border-2 border-[#8d6e63]/20 text-center italic font-bold text-[#5d4037] shadow-sm mb-8">
              <AnimatePresence mode="wait">
                <motion.p key={explanationText} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm sm:text-lg leading-relaxed">"{explanationText}"</motion.p>
              </AnimatePresence>
            </div>
            <button onClick={() => setIsExplaining(false)} className="px-12 py-4 bg-[#3e2723] text-white font-black rounded-2xl uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 shadow-xl">Understood</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
        <Combine size={64} className="animate-bounce" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Concept Mastered!</h1>
      <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You can now distinguish between Like and Unlike terms with physical precision.</p>
      <button onClick={() => window.location.reload()} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Move to next module</button>
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
            {renderExplanationOverlay()}
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