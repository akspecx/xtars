import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  ChevronRight, Shuffle, 
  FastForward, Scale,
  Trophy, Sparkles, Volume2, VolumeX,
  XCircle, Timer, Info, X, Equal, Plus, Minus, Divide, AlertCircle, BookOpen
} from 'lucide-react';

export default function App() {
  // --- Physical State ---
  const [unitWeight, setUnitWeight] = useState(4); 
  const [appleCount, setAppleCount] = useState(3);
  const [lhsExtra, setLhsExtra] = useState(0);    
  const [rhsWeight, setRhsWeight] = useState(12); 
  
  const [operationValue, setOperationValue] = useState(1);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showKeyLearning, setShowKeyLearning] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  
  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null); 
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]); 

  const timerIntervalRef = useRef(null);
  const learningTimeoutRef = useRef(null);

  // --- Math Helpers ---
  const totalLhsWeight = (appleCount * unitWeight) + lhsExtra;
  const totalRhsWeight = rhsWeight;
  const isBalanced = totalLhsWeight === totalRhsWeight;
  
  const weightDiff = totalRhsWeight - totalLhsWeight;
  const tiltRotation = Math.max(-15, Math.min(15, weightDiff * 1.5));

  const speak = useCallback((text) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const timeout = setTimeout(resolve, 5000);
      utterance.onend = () => { clearTimeout(timeout); resolve(); };
      utterance.onerror = () => { clearTimeout(timeout); resolve(); };
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  const generateMission = useCallback(() => {
    const unit = Math.floor(Math.random() * 5) + 2; 
    const count = Math.floor(Math.random() * 3) + 2; 
    setUnitWeight(unit);
    setAppleCount(count);
    setLhsExtra(0);
    setRhsWeight(count * unit);
    setIsCorrect(false);
    setAttemptCount(0);
    setShowKeyLearning(false);
    setAutoNextTimer(null);
    setIsExplaining(false);
    setFormulas([]);
  }, []);

  useEffect(() => {
    generateMission();
  }, [generateMission]);

  // Apply Operation and track attempts
  const applyOp = (side, type) => {
    if (isCorrect) return;
    const n = operationValue;
    setAttemptCount(prev => prev + 1);

    if (side === 'lhs') {
      if (type === 'add') setLhsExtra(prev => prev + n);
      if (type === 'sub') setLhsExtra(prev => Math.max(0, prev - n));
      if (type === 'mul') {
        setLhsExtra(prev => prev * n);
        setAppleCount(prev => prev * n);
      }
      if (type === 'div' && n !== 0) {
        setLhsExtra(prev => Math.floor(prev / n));
        setAppleCount(prev => Math.max(1, Math.floor(prev / n)));
      }
    } else {
      if (type === 'add') setRhsWeight(prev => prev + n);
      if (type === 'sub') setRhsWeight(prev => Math.max(0, prev - n));
      if (type === 'mul') setRhsWeight(prev => prev * n);
      if (type === 'div' && n !== 0) setRhsWeight(prev => Math.floor(prev / n));
    }
  };

  // Manage key learning tag visibility
  useEffect(() => {
    if (attemptCount >= 3 && !isBalanced && !isCorrect) {
      setShowKeyLearning(true);
      if (learningTimeoutRef.current) clearTimeout(learningTimeoutRef.current);
      learningTimeoutRef.current = setTimeout(() => {
        setShowKeyLearning(false);
      }, 5000); 
    } else if (isBalanced) {
      setShowKeyLearning(false);
    }
  }, [attemptCount, isBalanced, isCorrect]);

  // Check solve condition
  useEffect(() => {
    if (appleCount === 1 && lhsExtra === 0 && isBalanced && !isCorrect && attemptCount > 0) {
      setIsCorrect(true);
      setAutoNextTimer(10);
    }
  }, [appleCount, lhsExtra, isBalanced, isCorrect, attemptCount]);

  const runExplanation = async () => {
    setFormulas([
      "Fundamental Principle:",
      "Weight on Left = Weight on Right",
      "Aim: Keep scale balanced after each action."
    ]);

    setIsExplaining(true);
    setExplanationText("Look at the scale. It is perfectly balanced.");
    await speak("Look at the scale. It is perfectly balanced.");
    
    setActiveHighlight('both');
    setExplanationText("As we know the scale is balanced, our aim is to keep the scale balanced after each action.");
    await speak("As we know the scale is balanced, our aim is to keep the scale balanced after each action.");

    setActiveHighlight('both');
    setExplanationText("This is the fundamental principle of a balanced scale.");
    await speak("This is the fundamental principle of a balanced scale.");

    setActiveHighlight('both');
    setExplanationText("To keep it balanced, we recommend you take the same action on both scales.");
    await speak("To keep it balanced, we recommend you take the same action on both scales.");

    setActiveHighlight(null);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      generateMission();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, generateMission]);

  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center px-2 py-1 z-50 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Algebra Lab</h1>
            <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Physical Balance Lesson</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={generateMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* SECTION 1: THE SCALE STAGE */}
      <div className="flex-1 w-full max-w-4xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        <div className="relative w-full max-w-3xl flex justify-center items-center scale-[0.45] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-24">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                
                <div className="absolute bottom-[20px] bg-white/90 px-4 py-2 rounded-xl shadow-lg border-2 border-[#8d6e63] z-30 min-w-[140px] text-center transform -rotate-1">
                   <div className="text-[8px] font-black uppercase text-[#8d6e63] leading-none mb-1 text-center">Physical Note</div>
                   <div className="text-sm sm:text-lg font-black text-[#5d4037] whitespace-nowrap">Weight of one 🍎 = {unitWeight}g</div>
                </div>

                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <motion.div 
              animate={{ rotate: tiltRotation }}
              transition={{ type: "spring", stiffness: 40, damping: 10 }}
              className="relative w-full flex justify-center z-20 mt-[12%]"
            >
                <div className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LHS PAN */}
                    <motion.div animate={{ rotate: -tiltRotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center origin-top">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(appleCount)].map((_, i) => (
                                    <motion.div key={i} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl sm:text-6xl drop-shadow-lg">🍎</motion.div>
                                ))}
                                {lhsExtra > 0 && <div className="bg-yellow-400 text-[#5d4037] px-2 py-1 rounded-lg font-black text-xs sm:text-xl shadow-md">+{lhsExtra}g</div>}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border-2 border-[#c4a484] whitespace-nowrap min-w-[80px] text-center">
                              {totalLhsWeight}g
                            </div>
                        </div>
                    </motion.div>

                    {/* RHS PAN */}
                    <motion.div animate={{ rotate: -tiltRotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center origin-top">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <motion.div layout className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">
                               {totalRhsWeight}g
                             </motion.div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg border-2 border-[#c4a484] whitespace-nowrap min-w-[80px] text-center">
                               {totalRhsWeight}g
                             </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>

        {/* FEEDBACK & KEY LEARNING */}
        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center gap-3 pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {isCorrect ? (
                    <motion.div key="win" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm pointer-events-auto">
                        <Trophy size={24} className="animate-bounce" />
                        <span className="text-xs sm:text-lg font-bold uppercase">Great! The scale is perfectly balanced.</span>
                    </motion.div>
                ) : !isBalanced ? (
                    <div className="flex flex-col items-center gap-2">
                      <motion.div key="unbalanced" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="bg-amber-600 text-white px-6 py-2 rounded-full shadow-xl font-bold uppercase tracking-widest text-[10px] sm:text-sm flex items-center gap-2 border-b-4 border-amber-800">
                          <AlertCircle size={16} /> Aim is to keep scale balanced.
                      </motion.div>
                      <AnimatePresence>
                        {showKeyLearning && (
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: 10, opacity: 0 }}
                            className="bg-white/90 border-2 border-[#8d6e63] px-4 py-1.5 rounded-xl shadow-lg flex items-center gap-2"
                          >
                             <BookOpen size={14} className="text-blue-600" />
                             <span className="text-[9px] sm:text-xs font-black text-[#5d4037] uppercase">Key Learning: Take same action on both scales to keep it balanced!</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                ) : attemptCount > 0 ? (
                    <motion.div key="balanced-success" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-100 border-2 border-emerald-500/30 px-8 py-2 rounded-full shadow-md font-black uppercase tracking-tight text-[10px] sm:text-lg text-emerald-700 flex items-center gap-2">
                        <Sparkles size={18} className="text-emerald-500" /> Wow, the scale is balanced!
                    </motion.div>
                ) : (
                    <motion.div key="balanced-initial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-md font-bold uppercase tracking-widest text-[10px] sm:text-sm text-[#8d6e63] border border-[#8d6e63]/20">
                        Aim is to keep scale balanced!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: PHYSICAL CONTROLS */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-1">
        <div className="bg-[#dfd7cc] p-3 sm:p-5 rounded-[2rem] border-4 border-[#c4a484] w-[95%] sm:w-full shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">Action Panel</div>
            
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
                    
                    {/* LEFT SIDE OPS */}
                    <div className="bg-[#8d6e63]/10 p-3 rounded-2xl border border-[#8d6e63]/10">
                        <div className="text-[9px] font-black uppercase text-[#8d6e63] mb-2 text-center">Left Scale</div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => applyOp('lhs', 'add')} title="Add" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-emerald-50"><Plus size={18} className="mx-auto text-emerald-600" /></button>
                            <button onClick={() => applyOp('lhs', 'sub')} title="Subtract" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-red-50"><Minus size={18} className="mx-auto text-red-600" /></button>
                            <button onClick={() => applyOp('lhs', 'mul')} title="Multiply" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-blue-50"><X size={18} className="mx-auto text-blue-600" /></button>
                            <button onClick={() => applyOp('lhs', 'div')} title="Divide" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-purple-50"><Divide size={18} className="mx-auto text-purple-600" /></button>
                        </div>
                    </div>

                    {/* CENTRAL N-VALUE */}
                    <div className="flex flex-col items-center justify-center p-3 px-6 bg-white/40 rounded-3xl border-2 border-white shadow-inner min-w-[120px]">
                        <span className="text-[10px] font-black uppercase text-[#8d6e63] mb-1">Value n</span>
                        <input 
                          type="number" 
                          value={operationValue} 
                          onChange={(e) => setOperationValue(Number(e.target.value))} 
                          className="w-16 bg-white border-2 border-[#8d6e63] rounded-xl p-2 font-black text-center text-2xl text-[#5d4037] shadow-sm" 
                          min="1" max="99" 
                        />
                    </div>

                    {/* RIGHT SIDE OPS */}
                    <div className="bg-[#8d6e63]/10 p-3 rounded-2xl border border-[#8d6e63]/10">
                        <div className="text-[9px] font-black uppercase text-[#8d6e63] mb-2 text-center">Right Scale</div>
                        <div className="grid grid-cols-4 gap-2">
                            <button onClick={() => applyOp('rhs', 'add')} title="Add" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-emerald-50"><Plus size={18} className="mx-auto text-emerald-600" /></button>
                            <button onClick={() => applyOp('rhs', 'sub')} title="Subtract" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-red-50"><Minus size={18} className="mx-auto text-red-600" /></button>
                            <button onClick={() => applyOp('rhs', 'mul')} title="Multiply" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-blue-50"><X size={18} className="mx-auto text-blue-600" /></button>
                            <button onClick={() => applyOp('rhs', 'div')} title="Divide" className="p-3 bg-white rounded-xl shadow-sm border-b-4 border-gray-200 active:translate-y-1 active:border-0 hover:bg-purple-50"><Divide size={18} className="mx-auto text-purple-600" /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-1">
          <button onClick={() => generateMission()} className={`relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-1.5 sm:p-3 rounded-xl"><ChevronRight size={20} /></div>
              <div className="leading-tight uppercase tracking-tighter text-xs sm:text-lg">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW LESSON'}</div>
            </div>
            <div className="flex items-center relative z-10">
              {autoNextTimer !== null ? (
                <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-3 sm:px-6 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[100px] sm:min-w-[200px]">
                  <div className="flex items-center gap-1 shrink-0"><Timer size={14} className="animate-spin text-indigo-300" /><span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span></div>
                  <div className="flex justify-between w-full px-2 relative">
                      {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>🍎</div>))}
                      <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-xs sm:text-2xl pointer-events-none">🏃</motion.div>
                  </div>
                </div>
              ) : <FastForward className="opacity-30 w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
          </button>
          
          <button onClick={runExplanation} className="flex items-center justify-center gap-2 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
            <Info size={18} />
            <span className="uppercase tracking-tighter text-xs sm:text-lg">View Explanation</span>
          </button>
      </div>

      {/* EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3e2723]/90 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#8d6e63]">
              <button 
                onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
                className="absolute top-6 right-6 p-3 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4 text-[#5d4037]">Fundamental Principle</h2>

              <div className="w-full space-y-4">
                <div className="w-full bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-6 rounded-3xl border-4 border-[#8d6e63] shadow-2xl text-center">
                  <div className="space-y-4 min-h-[140px] flex flex-col justify-center">
                    {formulas.map((line, idx) => (
                      <motion.p key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className={`text-lg sm:text-2xl font-black tracking-tight font-mono drop-shadow-md leading-tight text-yellow-100/70`}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>

                <div className="w-full bg-white/60 p-4 sm:p-6 rounded-3xl border-2 border-[#8d6e63]/20 shadow-inner text-center min-h-[100px] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                     <motion.p key={explanationText} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                       className="text-base sm:text-xl font-bold text-[#5d4037] leading-tight"
                     >
                       {explanationText}
                     </motion.p>
                   </AnimatePresence>
                </div>
              </div>

              <div className="mt-6">
                 <button onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }} className="px-10 py-3 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20">I Understand!</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}