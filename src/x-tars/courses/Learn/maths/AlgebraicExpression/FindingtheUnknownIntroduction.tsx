import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, Scale,
  Trophy, Sparkles, Volume2, VolumeX,
  Clock,ChevronLeft,Info
} from 'lucide-react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useParams 
} from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  const onBack = () => {
    navigate("/learn/mathematics/algebra");
  };

  const [mode, setMode] = useState<'concept' | 'practice'>('concept');

  const shuffleMission = () => {
    generateMission();
  };

  const renderHeader = () => (
    <header className="w-full max-w-5xl mb-2 bg-[#3e2723] p-4 sm:p-6 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3.5rem] border-b-4 border-black/30 relative overflow-hidden shrink-0 shadow-2xl">
      
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')`,
        }}
      />
  
      <div className="relative z-10 flex justify-between items-end">
        {/* LEFT */}
        <div className="flex flex-col gap-2 text-left">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[#a88a6d] font-black uppercase text-[10px] hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft size={14} />
            Back to Dashboard
          </button>
  
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-sm bg-[#e6dccb] rotate-45 shadow-glow" />
            <h2 className="text-xl sm:text-2xl lg:text-5xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">
              Weight Lab
            </h2>
          </div>
        </div>
  
        {/* RIGHT */}
        <div className="hidden md:flex flex-col items-end">
              <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
                  <button onClick={() => { setMode('concept'); resetLevel(); }}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                      CONCEPT BUILDING
                  </button>
                  <button onClick={() => { setMode('practice'); resetLevel(); }}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                      PRACTICE
                  </button>
                  <div>
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                        <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>
        </div>
      </div>
    </header>
  );
  const [currentAppleWeight, setCurrentAppleWeight] = useState(3);
  const [appleCount, setAppleCount] = useState(4);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  
  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null); // 'left' | 'right' | 'both' | null
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]); 

  const timerIntervalRef = useRef(null);

  // Improved speak function with fail-safe resolve
  const speak = useCallback((text) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      
      // Fail-safe: if speech fails or hangs, resolve after 5 seconds
      const timeout = setTimeout(resolve, 5000);

      utterance.onend = () => {
        clearTimeout(timeout);
        resolve();
      };
      utterance.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  const generateMission = useCallback(() => {
    const weight = Math.floor(Math.random() * 5) + 2; 
    const count = Math.floor(Math.random() * 4) + 2;  
    const correct = weight;
    
    const opts = new Set([correct]);
    while(opts.size < 4) {
      opts.add(Math.floor(Math.random() * 8) + 1);
    }
    
    setCurrentAppleWeight(weight);
    setAppleCount(count);
    setOptions(Array.from(opts).sort((a, b) => a - b));
    setSelectedAnswer(null);
    setIsCorrect(false);
    setFeedback(null);
    setAutoNextTimer(null);
    setIsExplaining(false);
    setFormulas([]);
    window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    generateMission();
  }, [generateMission]);

  const runExplanation = async () => {
    const total = appleCount * currentAppleWeight;
    
    // Set all formulas immediately from the beginning as requested
    setFormulas([
      "Weight on Left = Weight on Right",
      `${appleCount} × weight of one apple = ${total}g`,
      `Weight of one apple = ${total}g ÷ ${appleCount}`,
      `Weight of one apple = ${currentAppleWeight}g`
    ]);

    setIsExplaining(true);
    
    // Narration sequence with visual highlights
    setExplanationText("Look at the scale. It is perfectly balanced.");
    await speak("Look at the scale. It is perfectly balanced.");
    
    setActiveHighlight('both');
    setExplanationText("Since the scale is balanced, the weight on the left scale should be equal to the weight on the right scale.");
    await speak("Since the scale is balanced, then the weight on the left scale should be equal to the weight on the right scale.");

    setActiveHighlight('left');
    setExplanationText(`So, ${appleCount} fruits multiplied by the weight of one apple must equal ${total} grams.`);
    await speak(`Number of fruits multiplied by weight of one apple equals ${total} grams.`);

    setActiveHighlight('right');
    setExplanationText(`To find the weight of one apple, we divide the total weight by the number of apples.`);
    await speak(`Weight on one apple equals weight divided by Number of apples.`);

    setActiveHighlight('both');
    setExplanationText(`That means one apple weighs ${currentAppleWeight} grams!`);
    await speak(`That means one apple weighs ${currentAppleWeight} grams!`);

    setActiveHighlight(null);
  };

  const handleAnswer = (val) => {
    if (isCorrect) return;
    setSelectedAnswer(val);
    if (val === currentAppleWeight) {
      setIsCorrect(true);
      setFeedback('correct');
      setAutoNextTimer(10);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
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

  const targetTotalWeight = appleCount * currentAppleWeight;
  


  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center px-2 py-1 z-50 mb-1">
      {renderHeader()}

        {/* <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Algebra Lab</h1>
            <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Problem Solving Station</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={generateMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={16} />
            </button>
        </div> */}
      </div>

      {/* SECTION 1: THE SCALE STAGE */}
      <div className="flex-1 w-full max-w-5xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.45] sm:scale-[0.75] origin-top transition-transform overflow-visible mt-16 sm:mt-24">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <div className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LEFT PAN */}
                    <div className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(appleCount)].map((_, i) => (
                                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl sm:text-6xl drop-shadow-lg">🍎</motion.div>
                                ))}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">? g</div>
                        </div>
                    </div>

                    {/* RIGHT PAN */}
                    <div className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetTotalWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetTotalWeight}g</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEEDBACK OVERLAY */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {feedback === 'correct' && (
                    <motion.div key="correct-toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
                        <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
                            <Trophy size={24} className="animate-bounce" />
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Solved!</span>
                                <span className="text-xs sm:text-lg font-bold leading-none">One 🍎 weighs {currentAppleWeight} grams!</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                {feedback === 'incorrect' && (
                    <motion.div key="wrong-toast" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-red-500 text-white px-8 py-3 rounded-full shadow-2xl font-black uppercase tracking-widest flex items-center gap-3">
                        <XCircle size={20} /> Try again!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: QUESTION & OPTIONS */}
      <div className="w-full max-w-5xl flex flex-col items-center mt-2 z-50 mb-1">
        <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">Problem Control</div>
            
            <div className="mb-4 sm:mb-6 text-center max-w-xl">
               <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">
                  If the scale is balanced, what is the weight of <span className="inline-block scale-110 mx-1">🍎</span> ONE apple?
               </p>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-2xl">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={isCorrect}
                    className={`relative group h-14 sm:h-20 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-3xl transition-all shadow-lg border-b-4 
                      ${isCorrect && opt === currentAppleWeight ? 'bg-emerald-500 text-white border-emerald-700 scale-105' : 
                        selectedAnswer === opt && opt !== currentAppleWeight ? 'bg-red-400 text-white border-red-600 grayscale' :
                        'bg-white text-[#5d4037] border-gray-300 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0'}`}
                  >
                    {opt}g
                    {isCorrect && opt === currentAppleWeight && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-emerald-600">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </button>
                ))}
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-1">
          <button onClick={() => generateMission()} className={`relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-1.5 sm:p-3 rounded-xl"><ChevronRight size={20} /></div>
              <div className="leading-tight uppercase tracking-tighter text-xs sm:text-lg">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW CHALLENGE'}</div>
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
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3e2723]/90 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#8d6e63]">
              <button 
                onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
                className="absolute top-6 right-6 p-3 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4 text-[#5d4037]">Step-by-Step Logic</h2>

              {/* MINI SCALE ASSEMBLY */}
              <div className="relative w-full h-40 sm:h-52 flex justify-center items-center scale-90 sm:scale-100 mb-8">
                 <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-2 h-24 bg-[#8d6e63] rounded-full opacity-20" />
                 </div>
                 
                 <div className="relative w-full max-w-md h-2 bg-[#5d4037] rounded-full flex justify-between items-center px-2">
                    <div className="relative flex flex-col items-center">
                       <motion.div 
                         animate={{ scale: activeHighlight === 'left' || activeHighlight === 'both' ? 1.1 : 1 }}
                         className={`w-20 h-20 sm:w-28 sm:h-28 bg-[#e6dccb] rounded-full border-4 flex items-center justify-center shadow-xl transition-all
                           ${activeHighlight === 'left' || activeHighlight === 'both' ? 'border-blue-500 ring-8 ring-blue-500/20 shadow-blue-500/40' : 'border-[#8d6e63]'}`}
                       >
                          <div className="flex flex-wrap justify-center gap-1 p-2">
                            {[...Array(appleCount)].map((_, i) => <span key={i} className="text-lg">🍎</span>)}
                          </div>
                       </motion.div>
                       <div className="mt-2 font-black text-sm text-[#5d4037]">{appleCount} Apples</div>
                    </div>

                    <Equal className={`w-8 h-8 transition-opacity ${activeHighlight === 'both' ? 'opacity-100 text-emerald-600 scale-125' : 'opacity-20'}`} />

                    <div className="relative flex flex-col items-center">
                       <motion.div 
                         animate={{ scale: activeHighlight === 'right' || activeHighlight === 'both' ? 1.1 : 1 }}
                         className={`w-20 h-20 sm:w-28 sm:h-28 bg-[#e6dccb] rounded-full border-4 flex items-center justify-center shadow-xl transition-all
                           ${activeHighlight === 'right' || activeHighlight === 'both' ? 'border-blue-500 ring-8 ring-blue-500/20 shadow-blue-500/40' : 'border-[#8d6e63]'}`}
                       >
                          <span className="font-black text-xl sm:text-3xl">{targetTotalWeight}g</span>
                       </motion.div>
                       <div className="mt-2 font-black text-sm text-[#5d4037]">Total Weight</div>
                    </div>
                 </div>
              </div>

              {/* FORMULA & NARRATION SECTION */}
              <div className="w-full space-y-4">
                {/* Visual Formula Display - Content is now populated from the start */}
                <div className="w-full bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-6 rounded-3xl border-4 border-[#8d6e63] shadow-2xl text-center">
                  <div className="space-y-3 min-h-[140px] flex flex-col justify-center">
                    {formulas.map((line, idx) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`text-lg sm:text-2xl font-black tracking-tight font-mono drop-shadow-md leading-tight 
                          ${(activeHighlight === 'both' && idx === 0) || 
                            (activeHighlight === 'left' && idx === 1) || 
                            (activeHighlight === 'right' && idx === 2) ||
                            (activeHighlight === 'both' && idx === 3)
                            ? 'text-yellow-400 scale-110' : 'text-yellow-100/60'}`}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Descriptive Text Block */}
                <div className="w-full bg-white/60 p-4 sm:p-6 rounded-3xl border-2 border-[#8d6e63]/20 shadow-inner text-center min-h-[100px] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                     <motion.p 
                       key={explanationText}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="text-base sm:text-xl font-bold text-[#5d4037] leading-tight"
                     >
                       {explanationText}
                     </motion.p>
                   </AnimatePresence>
                </div>
              </div>

              <div className="mt-6">
                 <button 
                   onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
                   className="px-10 py-3 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20"
                 >
                   I Got It!
                 </button>
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