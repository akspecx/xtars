import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info, X,
  Weight, ClipboardList, Calculator, Scale, Equal
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. ASSETS & MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    title: 'Basic Fruit Balance',
    leftSide: [{ icon: '🍎', name: 'Apple', count: 4, unitWeight: 5 }],
    rightSide: [{ icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 20 }]
  },
  {
    id: 2,
    title: 'Mixed Left Cargo',
    leftSide: [
      { icon: '🍊', name: 'Orange', count: 3, unitWeight: 10 },
      { icon: '🍓', name: 'Strawberry', count: 1, unitWeight: 5 }
    ],
    rightSide: [{ icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 35 }]
  },
  {
    id: 3,
    title: 'Block vs Fruits',
    leftSide: [{ icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 50 }],
    rightSide: [
      { icon: '🍐', name: 'Pear', count: 5, unitWeight: 8 },
      { icon: '🍓', name: 'Strawberry', count: 2, unitWeight: 5 }
    ]
  },
  {
    id: 4,
    title: 'Dual Side Mix',
    leftSide: [
      { icon: '🍎', name: 'Apple', count: 2, unitWeight: 10 },
      { icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 10 }
    ],
    rightSide: [{ icon: '🍐', name: 'Pear', count: 3, unitWeight: 10 }]
  },
  {
    id: 5,
    title: 'The Berry Scale',
    leftSide: [{ icon: '🍓', name: 'Strawberry', count: 10, unitWeight: 3 }],
    rightSide: [{ icon: '🍊', name: 'Orange', count: 2, unitWeight: 15 }]
  },
  {
    id: 6,
    title: 'Heavy Lifting',
    leftSide: [{ icon: '💎', name: 'Gem', count: 1, unitWeight: 100 }],
    rightSide: [
      { icon: '🧱', name: 'Weight Block', count: 2, unitWeight: 40 },
      { icon: '🍎', name: 'Apple', count: 4, unitWeight: 5 }
    ]
  },
  {
    id: 7,
    title: 'Final Calibration',
    leftSide: [
      { icon: '🍐', name: 'Pear', count: 3, unitWeight: 12 },
      { icon: '🍓', name: 'Strawberry', count: 4, unitWeight: 1 }
    ],
    rightSide: [{ icon: '🧱', name: 'Weight Block', count: 1, unitWeight: 40 }]
  }
];

// Unified Weight Block Component
const WeightBlock = ({ weight, size = "large" }) => (
  <motion.div 
    initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
    className={`bg-slate-700 text-white rounded-xl flex items-center justify-center font-black shadow-2xl border-b-4 border-black/40 ring-2 ring-slate-800/30 shrink-0 z-10 mx-1
      ${size === "large" ? "w-12 h-12 sm:w-20 sm:h-20 text-xs sm:text-lg" : "w-10 h-10 sm:w-14 sm:h-14 text-[8px] sm:text-xs"}`}
  >
    <div className="flex flex-col items-center">
      <Weight size={size === "large" ? 14 : 10} className="mb-1 opacity-50" />
      {weight}g
    </div>
  </motion.div>
);

// ==========================================
// 2. MAIN LHS & RHS COMPONENT
// ==========================================
export default function AlgebraLHSRHSDiscovery() {
  const navigate = useNavigate();

  // --- Session & Logic State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const mission = MISSIONS[levelIndex];
  
  const [lhsInput, setLhsInput] = useState("");
  const [rhsInput, setRhsInput] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  
  // Introduction/Animation State
  const [introStep, setIntroStep] = useState(0); // 0: Start, 1: LHS, 2: RHS, 3: Ready
  const [isIntroAnimating, setIsIntroAnimating] = useState(true);

  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);
  const [highlightSide, setHighlightSide] = useState(null); 

  const timerIntervalRef = useRef(null);

  // Logic Helpers
  const calculateSideTotal = useCallback((side) => {
    return side.reduce((sum, item) => sum + (item.count * item.unitWeight), 0);
  }, []);

  const handleCheck = () => {
    if (!lhsInput || !rhsInput || isCorrect || isIntroAnimating) return;
    const lhsTarget = calculateSideTotal(mission.leftSide);
    const rhsTarget = calculateSideTotal(mission.rightSide);

    if (Number(lhsInput) === lhsTarget && Number(rhsInput) === rhsTarget) {
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
      setLhsInput("");
      setRhsInput("");
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
            await new Promise(r => setTimeout(r, 1000));
            setIntroStep(1); // LHS
            await new Promise(r => setTimeout(r, 2500));
            setIntroStep(2); // RHS
            await new Promise(r => setTimeout(r, 2500));
            setIntroStep(3); // Ready
            setIsIntroAnimating(false);
        };
        sequence();
    }
  }, [isIntroAnimating]);

  const runExplanation = async () => {
    setIsExplaining(true);
    const lhs = calculateSideTotal(mission.leftSide);
    const rhs = calculateSideTotal(mission.rightSide);
    
    setFormulas(["Logical Balance Analysis"]);
    
    // Step 1: LHS
    setHighlightSide('lhs');
    const lhsText = mission.leftSide.map(i => `${i.count} ${i.name}s × ${i.unitWeight}g`).join(" + ");
    setExplanationText(`First, let's calculate the Left Hand Side (LHS): ${lhsText} = ${lhs}g`);
    await new Promise(r => setTimeout(r, 3000));

    // Step 2: RHS
    setHighlightSide('rhs');
    const rhsText = mission.rightSide.map(i => `${i.count} ${i.name}s × ${i.unitWeight}g`).join(" + ");
    setExplanationText(`Now, let's calculate the Right Hand Side (RHS): ${rhsText} = ${rhs}g`);
    await new Promise(r => setTimeout(r, 3000));

    // Conclusion
    setHighlightSide('both');
    setFormulas(["Total weight on right scale = Total weight of left scale as it is balanced scale", `Total left balance = ${lhs}g`, `Total right balance = ${rhs}g`, "Conclusion: LHS = RHS"]);
    setExplanationText("Since the scale is perfectly balanced, the LHS and RHS weights are exactly equal!");
    await new Promise(r => setTimeout(r, 3000));
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
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Discovery: LHS & RHS</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-[#4e342e] px-4 py-2 rounded-2xl border border-white/10 flex flex-col items-center">
               <span className="text-[8px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mb-1">Module Node</span>
               <span className="text-white font-black leading-none">#{mission.id}</span>
            </div>
            <button onClick={() => { setLhsInput(""); setRhsInput(""); setIsCorrect(false); setIntroStep(0); setIsIntroAnimating(true); }} className="p-2.5 bg-amber-500 text-[#3e2723] rounded-xl shadow-lg border-b-2 border-amber-800 active:scale-95 transition-transform">
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
            <motion.div animate={i === levelIndex ? { scale: [1, 1.4, 1] } : {}} className={`w-4 h-4 rounded-full border-2 transition-all duration-500 shadow-md ${i < levelIndex ? 'bg-emerald-500 border-emerald-600' : i === levelIndex ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
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
                    
                    {/* LEFT PAN (LHS) */}
                    <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                        </svg>
                        <motion.div 
                          animate={(introStep === 1 || highlightSide === 'lhs' || highlightSide === 'both') ? { scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.8)" } : {}}
                          className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                        >
                            <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible">
                                {mission.leftSide.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      {[...Array(item.count)].map((_, i) => (
                                          <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            {item.name === 'Weight Block' ? <WeightBlock weight={item.unitWeight} /> : <span className="text-3xl sm:text-6xl drop-shadow-lg">{item.icon}</span>}
                                          </motion.div>
                                      ))}
                                    </React.Fragment>
                                ))}
                            </div>
                            <AnimatePresence>
                              {(introStep >= 1 || highlightSide === 'lhs' || highlightSide === 'both') && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-[-55px] bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">
                                    Left Hand Side (LHS)
                                </motion.div>
                              )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* RIGHT PAN (RHS) */}
                    <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                        </svg>
                        <motion.div 
                          animate={(introStep === 2 || highlightSide === 'rhs' || highlightSide === 'both') ? { scale: 1.05, boxShadow: "0 0 60px rgba(167, 139, 250, 0.8)" } : {}}
                          className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                        >
                            <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible">
                                {mission.rightSide.map((item, idx) => (
                                    <React.Fragment key={idx}>
                                      {[...Array(item.count)].map((_, i) => (
                                          <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                            {item.name === 'Weight Block' ? <WeightBlock weight={item.unitWeight} /> : <span className="text-3xl sm:text-6xl drop-shadow-lg">{item.icon}</span>}
                                          </motion.div>
                                      ))}
                                    </React.Fragment>
                                ))}
                            </div>
                            <AnimatePresence>
                              {(introStep >= 2 || highlightSide === 'rhs' || highlightSide === 'both') && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute bottom-[-55px] bg-purple-600 text-white px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">
                                    Right Hand Side (RHS)
                                </motion.div>
                              )}
                            </AnimatePresence>
                        </motion.div>
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
                <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Equivalence Sync: LHS = RHS</span>
                <Sparkles size={20} className="text-yellow-300 animate-pulse shrink-0" />
              </motion.div>
            ) : !isIntroAnimating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/90 backdrop-blur-md px-8 py-2 rounded-full shadow-xl font-bold uppercase tracking-widest text-[9px] sm:text-sm text-[#8d6e63] border-2 border-[#8d6e63]/20 flex items-center gap-2">
                    <Calculator size={16} /> Nodes Initialized. Solve the balance!
                </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderMatrixDiv = () => (
    <div className={`w-full max-w-[1200px] shrink-0 transition-opacity px-2 min-h-[180px] z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-col lg:flex-row items-stretch justify-around shadow-xl relative overflow-visible gap-6">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">Lab Console: Logic Analysis</div>
          
          {/* YIELD NOTES (UNIT WEIGHTS) */}
          <div className="flex-1 flex flex-col items-center gap-3 bg-white/40 p-4 rounded-[2rem] border-2 border-white shadow-inner">
              <span className="text-[#8d6e63] font-black text-[10px] uppercase tracking-widest">Yield Notes</span>
              <div className="flex flex-wrap justify-center gap-6">
                  {mission.leftSide.concat(mission.rightSide).filter((v, i, a) => a.findIndex(t => t.name === v.name) === i).map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        {item.name === 'Weight Block' ? <WeightBlock weight={item.unitWeight} size="small" /> : <span className="text-2xl sm:text-4xl drop-shadow-md">{item.icon}</span>}
                        <span className="text-[8px] font-black text-[#a88a6d] uppercase mt-1 leading-none">{item.name}</span>
                        <span className="text-base sm:text-xl font-black text-[#3e2723] leading-none">{item.unitWeight}g</span>
                    </div>
                  ))}
              </div>
          </div>

          {/* DUAL INPUT AREA */}
          <div className="flex-1 bg-white/60 p-4 sm:p-6 rounded-[2.5rem] border-2 border-white shadow-inner flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-black text-blue-700 uppercase">Weight of LHS</span>
                      <input 
                        type="number" value={lhsInput} disabled={isCorrect || isIntroAnimating}
                        onChange={(e) => setLhsInput(e.target.value)}
                        placeholder="???"
                        className={`w-[110px] sm:w-[130px] bg-white border-4 rounded-xl py-3 text-center text-xl sm:text-3xl font-black focus:ring-4 focus:outline-none transition-all ${isCorrect ? 'border-emerald-500' : 'border-blue-200'} ${isIntroAnimating ? 'opacity-30' : ''}`}
                      />
                  </div>
                  <Equal className="text-[#8d6e63] mt-4" size={24} />
                  <div className="flex flex-col items-center gap-1">
                      <span className="text-[9px] font-black text-purple-700 uppercase">Weight of RHS</span>
                      <input 
                        type="number" value={rhsInput} disabled={isCorrect || isIntroAnimating}
                        onChange={(e) => setRhsInput(e.target.value)}
                        placeholder="???"
                        className={`w-[110px] sm:w-[130px] bg-white border-4 rounded-xl py-3 text-center text-xl sm:text-3xl font-black focus:ring-4 focus:outline-none transition-all ${isCorrect ? 'border-emerald-500' : 'border-purple-200'} ${isIntroAnimating ? 'opacity-30' : ''}`}
                      />
                  </div>
              </div>
              <motion.button 
                animate={isError ? { x: [-5, 5, -5, 5, 0] } : {}}
                onClick={handleCheck} disabled={isCorrect || !lhsInput || !rhsInput || isIntroAnimating}
                className="w-full sm:w-auto px-12 py-3 bg-emerald-600 text-white rounded-2xl font-black uppercase text-sm shadow-lg border-b-4 border-emerald-800 active:translate-y-1 transition-all"
              >
                Validate Equation
              </motion.button>
          </div>
      </div>
    </div>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        <button onClick={handleNext} className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
          <div className="flex items-center gap-2">
            <ChevronRight size={20} />
            <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP MISSION'}</span>
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
            <button onClick={() => { setIsExplaining(false); setHighlightSide(null); }} className="absolute top-6 right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all active:scale-95 shadow-lg"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-[#5d4037] mb-8 tracking-tighter text-center">Logical Proof of Equality</h2>
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
            <button onClick={() => { setIsExplaining(false); setHighlightSide(null); }} className="px-12 py-4 bg-[#3e2723] text-white font-black rounded-2xl uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 shadow-xl">Understood</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
        <Trophy size={64} className="animate-bounce" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Discovery Mastered!</h1>
      <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You have successfully mastered the logic of Left Hand Side and Right Hand Side equivalence.</p>
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