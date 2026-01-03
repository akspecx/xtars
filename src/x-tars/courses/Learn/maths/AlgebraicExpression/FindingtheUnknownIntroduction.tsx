import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, ChevronRight, Scale,
  Trophy, Sparkles, XCircle, Timer, Info, X, 
  Equal, ChevronLeft, Shuffle, FastForward, Check, 
  ChevronUp, ChevronDown, LayoutGrid, Target, Star, 
  Gem, Activity, Hand, PlayCircle, MousePointer2
} from 'lucide-react';
import { 
  HashRouter as Router, 
  useNavigate
} from 'react-router-dom';

// ==========================================
// 1. ASSETS & CONFIGURATION
// ==========================================
const ITEM_LIBRARY = [
  { icon: '🍎', name: 'Apple', weightRange: [2, 5] },
  { icon: '🍐', name: 'Pear', weightRange: [3, 6] },
  { icon: '🧸', name: 'Teddy', weightRange: [4, 8] },
  { icon: '🍊', name: 'Orange', weightRange: [2, 4] },
  { icon: '💎', name: 'Gem', weightRange: [5, 10] },
];

const SESSION_LENGTH = 6; 

// ==========================================
// 2. MAIN WEIGHT LAB COMPONENT
// ==========================================
export default function WeightLab() {
  const navigate = useNavigate();

  // --- Session State ---
  const [sessionStep, setSessionStep] = useState(0); 
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // --- Question State ---
  const [mode, setMode] = useState('practice');
  const [currentItem, setCurrentItem] = useState(ITEM_LIBRARY[0]);
  const [currentWeight, setCurrentWeight] = useState(3); 
  const [itemCount, setItemCount] = useState(3);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  
  // --- Concept Building / Automation State ---
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showLogicOverlay, setShowLogicOverlay] = useState(false);

  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null); 
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);

  const timerIntervalRef = useRef(null);
  const leftPanRef = useRef(null);
  const rightPanRef = useRef(null);
  const inputMatrixRef = useRef(null);
  const targetTotalWeight = itemCount * currentWeight;

  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  // --- Logic Functions ---
  const generateMission = useCallback(() => {
    if (sessionStep >= SESSION_LENGTH) {
      setSessionCompleted(true);
      return;
    }
    const item = ITEM_LIBRARY[sessionStep % ITEM_LIBRARY.length];
    const weight = Math.floor(Math.random() * (item.weightRange[1] - item.weightRange[0] + 1)) + item.weightRange[0]; 
    const count = Math.floor(Math.random() * 3) + 2; 
    
    const opts = new Set([weight]);
    while(opts.size < 4) {
      opts.add(Math.floor(Math.random() * 10) + 1);
    }
    
    setCurrentItem(item);
    setCurrentWeight(weight);
    setItemCount(count);
    setOptions(Array.from(opts).sort((a, b) => a - b));
    setSelectedAnswer(null);
    setIsCorrect(false);
    setFeedback(null);
    setIsExplaining(false);
    setFormulas([]);
    setAutoNextTimer(null);
    setActiveHighlight(null);
    setVirtualHandPos(null);
    setIsGrabbing(false);
    setIsAutoPlaying(false);
    setShowLogicOverlay(false);
  }, [sessionStep]);

  const moveToNextStep = useCallback(() => {
    if (sessionStep < SESSION_LENGTH - 1) {
      setSessionStep(prev => prev + 1);
    } else {
      setSessionCompleted(true);
    }
  }, [sessionStep]);

  const runExplanation = async () => {
    if (isExplaining) return;
    setIsExplaining(true);
    const total = itemCount * currentWeight;
    const name = currentItem.name;
    
    // Step 1: Balance Equality
    setFormulas(["Total weight on right scale = Total weight of left scale as it is balanced scale"]);
    setActiveHighlight('both');
    setExplanationText("Since the scale is balanced, the weight on the left scale should be equal to the weight on the right scale.");
    await new Promise(r => setTimeout(r, 2000));

    // Step 2: Multiplication Formula
    setFormulas(prev => [...prev, `Total left balance = ${total}, So, right scale weight = ${total}`]);
    setActiveHighlight('left');
    setExplanationText(`So, Number of fruits multiplied by weight of one ${name} equals ${total} grams.`);
    await new Promise(r => setTimeout(r, 2000));

    // Step 3: Division Formula
    setFormulas(prev => [...prev, `Weight of one ${name} = ${total}g ÷ ${itemCount}`]);
    setActiveHighlight('right');
    setExplanationText(`Therefore, the weight of one ${name} equals the total weight divided by the number of units.`);
    await new Promise(r => setTimeout(r, 2000));

    // Step 4: Final Result
    setFormulas(prev => [...prev, `Weight of one ${name} = ${currentWeight}g`]);
    setActiveHighlight('both');
    setExplanationText(`That means one unit weighs exactly ${currentWeight} grams!`);
    await new Promise(r => setTimeout(r, 2000));

    setActiveHighlight(null);
  };

  const handleAnswer = (val) => {
    if (isCorrect || isExplaining || (isAutoPlaying && val !== currentWeight)) return;
    setSelectedAnswer(val);
    if (val === currentWeight) {
      setIsCorrect(true);
      setFeedback('correct');
      setAutoNextTimer(10);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // --- Concept Building Automation ---
  const runConceptAutomation = useCallback(async () => {
    if (isAutoPlaying || isCorrect) return;
    setIsAutoPlaying(true);

    // Initial delay for focus
    await new Promise(r => setTimeout(r, 1200));

    if (!leftPanRef.current || !rightPanRef.current || !inputMatrixRef.current) {
        setIsAutoPlaying(false);
        return;
    }

    const leftRect = leftPanRef.current.getBoundingClientRect();
    const rightRect = rightPanRef.current.getBoundingClientRect();
    const matrixRect = inputMatrixRef.current.getBoundingClientRect();

    // 1. Move hand to show equality (Left to Right)
    setVirtualHandPos({ x: leftRect.left + leftRect.width/2, y: leftRect.top + leftRect.height/2 });
    await new Promise(r => setTimeout(r, 1500));

    setVirtualHandPos({ x: rightRect.left + rightRect.width/2, y: rightRect.top + rightRect.height/2 });
    await new Promise(r => setTimeout(r, 1500));

    // 2. Move hand to input matrix
    setVirtualHandPos({ x: matrixRect.left + matrixRect.width/2, y: matrixRect.top + matrixRect.height/2 });
    setShowLogicOverlay(true);
    await new Promise(r => setTimeout(r, 1500));

    // 3. Select the correct answer automatically
    setIsGrabbing(true);
    handleAnswer(currentWeight);
    await new Promise(r => setTimeout(r, 1000));
    
    setIsGrabbing(false);
    setIsAutoPlaying(false);
    setVirtualHandPos(null);
  }, [isAutoPlaying, isCorrect, itemCount, currentWeight]);

  useEffect(() => {
    if (mode === 'concept' && !isCorrect && !isAutoPlaying) {
      runConceptAutomation();
    }
  }, [mode, isCorrect, runConceptAutomation]);

  useEffect(() => { generateMission(); }, [generateMission, sessionStep]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      moveToNextStep();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, moveToNextStep]);

  // --- Sub-Render Div Functions ---

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0">
      <header className="w-full bg-[#3e2723] p-4 sm:p-5 lg:p-6 rounded-[2.5rem] border-b-4 border-black/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full md:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-2 hover:text-white transition-all active:scale-95 w-fit">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 shadow-glow" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Weight Lab</h2>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto ml-auto">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20 scale-90 sm:scale-100">
              <button onClick={() => { setMode('concept'); generateMission(); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>CONCEPT BUILDING</button>
              <button onClick={() => { setMode('practice'); generateMission(); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>PRACTICE</button>
            </div>
            <button onClick={generateMission} className="p-2.5 bg-amber-500 text-[#3e2723] rounded-xl shadow-lg border-b-2 border-amber-800 active:scale-95 transition-transform">
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );

  const renderDotsDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2">
      <div className="flex items-center gap-4 bg-[#3e2723]/5 p-4 rounded-full border border-[#3e2723]/10 shadow-inner">
        {[...Array(SESSION_LENGTH)].map((_, i) => {
          const isPast = i < sessionStep;
          const isCurrent = i === sessionStep;
          return (
            <div key={i} className="relative">
              <motion.div 
                animate={isCurrent ? { scale: [1, 1.4, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-500 shadow-md
                  ${isPast ? 'bg-emerald-500 border-emerald-600 shadow-emerald-500/20' : 
                    isCurrent ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 
                    'bg-white/40 border-[#3e2723]/20'}`} 
              />
              {isCurrent && <div className="absolute inset-0 bg-amber-400 blur-lg -z-10 opacity-60" />}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderScaleDiv = () => (
    <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
      <div className={`relative w-full min-h-[380px] sm:min-h-[480px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden transition-all ${isExplaining ? 'brightness-50 grayscale-[0.3]' : ''}`}>
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)" }} />
        
        {/* Scale Assembly - Balanced Size */}
        <div className="relative w-full max-w-5xl flex justify-center items-center scale-[0.25] sm:scale-[0.38] lg:scale-[0.5] origin-top transition-transform overflow-visible mt-12 sm:mt-16">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#2a1a16] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <div className="relative w-full h-8 bg-[#2a1a16] rounded-full flex justify-between items-center shadow-lg px-2 border border-white/10">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-yellow-500 rounded-full border-2 border-[#3e2723] z-30 shadow-glow" />
                    
                    {/* LEFT PAN */}
                    <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="w-full h-40 relative flex justify-center pointer-events-none mb-[-4px]">
                            <svg className="w-24 sm:w-32 h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <motion.div 
                          ref={leftPanRef}
                          animate={{ 
                            scale: activeHighlight === 'left' || activeHighlight === 'both' ? 1.08 : 1, 
                            boxShadow: activeHighlight === 'left' || activeHighlight === 'both' ? "0 0 60px rgba(59, 130, 246, 0.8)" : "none" 
                          }}
                          className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8"
                        >
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(itemCount)].map((_, i) => <motion.div key={i} animate={{ scale: 1 }} initial={{ scale: 0 }} className="text-3xl sm:text-6xl drop-shadow-lg">{currentItem.icon}</motion.div>)}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border border-white/10">? g</div>
                        </motion.div>
                    </div>

                    {/* RIGHT PAN */}
                    <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="w-full h-40 relative flex justify-center pointer-events-none mb-[-4px]">
                            <svg className="w-24 sm:w-32 h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                              <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
                            </svg>
                        </div>
                        <motion.div 
                          ref={rightPanRef}
                          animate={{ 
                            scale: activeHighlight === 'right' || activeHighlight === 'both' ? 1.08 : 1, 
                            boxShadow: activeHighlight === 'right' || activeHighlight === 'both' ? "0 0 60px rgba(59, 130, 246, 0.8)" : "none" 
                          }}
                          className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8"
                        >
                             <div className="bg-yellow-400 text-[#3e2723] w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-yellow-600">{targetTotalWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border border-white/10">{targetTotalWeight}g</div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEEDBACK & STATUS OVERLAY */}
        <div className="absolute bottom-6 left-0 w-full flex flex-col items-center gap-2 px-4 z-[100] pointer-events-none">
          {isAutoPlaying && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-blue-600 text-white py-2 px-6 rounded-full shadow-lg border-2 border-white/20 flex items-center gap-3">
              <PlayCircle size={20} className="animate-pulse shrink-0" />
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">Logic Walkthrough...</span>
            </motion.div>
          )}
          <AnimatePresence>
            {feedback === 'correct' && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 z-[100] backdrop-blur-md">
                <Trophy size={24} className="animate-bounce" />
                <div className="flex flex-col sm:flex-row items-center gap-1">
                  <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Logic Synced</span>
                  <span className="text-xs sm:text-lg font-bold">One {currentItem.icon} = {currentWeight} grams!</span>
                </div>
                <Sparkles size={20} className="text-yellow-300 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const renderMatrixDiv = () => (
    <div ref={inputMatrixRef} className={`w-full max-w-[1200px] shrink-0 transition-opacity ${isExplaining ? 'opacity-20 pointer-events-none' : 'opacity-100'} px-2 z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-col items-center shadow-xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">Matrix Logic Input</div>
          <p className="text-sm sm:text-xl font-bold text-[#5d4037] text-center mb-6 leading-tight">
            If the scale is balanced, what is the mass of ONE <span className="inline-block scale-110 mx-1">{currentItem.icon}</span>?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl">
              {options.map((opt) => (
                <button
                  key={opt} onClick={() => handleAnswer(opt)} disabled={isCorrect || isAutoPlaying}
                  className={`h-14 sm:h-18 rounded-2xl font-black text-xl sm:text-3xl transition-all shadow-lg border-b-4 
                    ${isCorrect && opt === currentWeight ? 'bg-emerald-500 text-white border-emerald-700 scale-105 shadow-emerald-500/20' : 
                      selectedAnswer === opt ? 'bg-red-400 text-white border-red-600' : 'bg-white text-[#5d4037] border-gray-300 hover:border-black active:translate-y-1'}`}
                >
                  {opt}g
                </button>
              ))}
          </div>
      </div>
    </div>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center transition-opacity ${isExplaining ? 'opacity-0' : 'opacity-100'} px-2 pb-12 shrink-0`}>
        <button onClick={moveToNextStep} className={`relative flex items-center justify-between p-4 rounded-[1.5rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
          <div className="flex items-center gap-2">
            <Shuffle size={16} />
            <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEXT CHALLENGE'}</span>
          </div>
          {autoNextTimer !== null && <span className="font-mono bg-black/40 px-2 rounded-lg">{autoNextTimer}s</span>}
        </button>
        <button onClick={runExplanation} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[1.5rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
          <div className="flex items-center gap-2">
            <Info size={18} /> <span className="uppercase tracking-tighter">View Explanation</span>
          </div>
        </button>
    </div>
  );

  const renderExplanationOverlay = () => (
    <AnimatePresence>
      {isExplaining && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-2xl bg-[#f1f0ee] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#3e2723] pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar">
            <button onClick={() => { setIsExplaining(false); }} className="absolute top-6 right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all active:scale-95 shadow-lg"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-[#5d4037] mb-8 tracking-tighter text-center">Logical Matrix Analysis</h2>
            <div className="w-full bg-[#3e2723] p-6 rounded-[2.5rem] border-4 border-black/20 mb-8 text-left shadow-inner">
              {formulas.map((line, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`font-mono text-xs sm:text-sm font-black mb-3 last:mb-0 ${idx === formulas.length - 1 ? 'text-yellow-400 text-base sm:text-lg border-t border-white/10 pt-3 mt-3' : 'text-yellow-100/80'}`}>
                  {line}
                </motion.p>
              ))}
            </div>
            <div className="w-full bg-white p-6 rounded-[2rem] border-2 border-[#8d6e63]/20 text-center italic font-bold text-[#5d4037] shadow-sm mb-8">
              <AnimatePresence mode="wait">
                <motion.p key={explanationText} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="text-sm sm:text-base leading-relaxed leading-tight">"{explanationText}"</motion.p>
              </AnimatePresence>
            </div>
            <button onClick={() => { setIsExplaining(false); }} className="px-12 py-4 bg-[#3e2723] text-white font-black rounded-2xl uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 active:border-b-0 transition-all shadow-xl">Understood</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10 shrink-0">
        <Trophy size={64} className="animate-bounce" />
      </div>
      <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Mastery Verified!</h1>
      <p className="text-lg sm:text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You have successfully mastered the logic of balanced equality across all nodes.</p>
      <div className="bg-white p-6 sm:p-8 rounded-[3rem] shadow-lg border-4 border-[#3e2723] w-full max-w-lg mb-10">
         <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-dashed">
            <span className="font-black uppercase text-[#8d6e63] text-xs">Calibration Points</span>
            <span className="font-black text-xl sm:text-2xl text-[#3e2723]">{SESSION_LENGTH} / {SESSION_LENGTH}</span>
         </div>
         <div className="flex justify-between items-center">
            <span className="font-black uppercase text-[#8d6e63] text-xs">Final Result</span>
            <span className="font-black text-xl sm:text-2xl text-emerald-600">Mastery Confirmed</span>
         </div>
      </div>
      <button onClick={() => navigate('/learn/mathematics/algebra/rightScale')} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Move to next module</button>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-6 px-2 lg:px-4 overflow-y-auto bg-[#f1f0ee] no-scrollbar">
      <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)" }} />
      
      {/* VIRTUAL HAND GUIDE */}
      <AnimatePresence>
        {isAutoPlaying && virtualHandPos && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }} 
                className="fixed pointer-events-none z-[2000] -translate-x-1/2 -translate-y-1/2"
            >
                <div className="relative flex items-center justify-center">
                    <Hand className="text-stone-800 w-10 h-10 sm:w-16 sm:h-16 drop-shadow-xl" fill="white" />
                    <AnimatePresence>
                      {isGrabbing && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute text-[30px] sm:text-[50px] drop-shadow-2xl z-[2001]">
                          <MousePointer2 size={40} className="text-blue-500 fill-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

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
