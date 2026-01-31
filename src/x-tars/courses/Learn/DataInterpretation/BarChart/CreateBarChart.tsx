import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  IceCream,
  Dessert,
  Candy as CandyIcon,
  BarChart3,
  XCircle,
  CheckCircle2,
  Cookie,
  ArrowRightCircle,
  Pencil,
  Check,
  RotateCw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '18px',
  textSize: '16px',
  smallText: '14px'
};

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const SWEETS = [
  { 
    id: 'iceCream', 
    label: 'Ice Cream', 
    icon: <IceCream size={24} />, 
    color: 'bg-sky-500', 
    barGradient: 'from-sky-400 to-sky-600',
    target: 6
  },
  { 
    id: 'donut', 
    label: 'Donut', 
    icon: <Dessert size={24} />, 
    color: 'bg-pink-500', 
    barGradient: 'from-pink-400 to-pink-600',
    target: 4
  },
  { 
    id: 'chocolate', 
    label: 'Chocolate', 
    icon: <Cookie size={24} />, 
    color: 'bg-amber-800', 
    barGradient: 'from-amber-600 to-amber-800',
    target: 4
  },
  {
    id: 'candy',
    label: 'Candy',
    icon: <CandyIcon size={24} />,
    color: 'bg-purple-500',
    barGradient: 'from-purple-400 to-purple-600',
    target: 3
  }
];

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  // States: intro, drawing, quiz_total, quiz_diff, quiz_combined, mastery
  const [gameState, setGameState] = useState('intro'); 
  const [userVotes, setUserVotes] = useState({ iceCream: 0, donut: 0, chocolate: 0, candy: 0 });
  const [teacherSpeech, setTeacherSpeech] = useState("Today, you are the scientist! Use the data below to draw your own bar chart.");
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [activeVisual, setActiveVisual] = useState({ id: null, ids: [], type: null });
  
  const timerRef = useRef(null);

  // Function to handle clicking on the chart to set height
  const handleChartClick = (sweetId, e) => {
    // Only allow drawing in construction states
    if (gameState !== 'intro' && gameState !== 'drawing' && gameState !== 'checking') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const heightRatio = 1 - (clickY / rect.height);
    
    let newValue = Math.round(heightRatio * 6);
    if (newValue < 0) newValue = 0;
    if (newValue > 6) newValue = 6;

    const sweetLabel = SWEETS.find(s => s.id === sweetId)?.label || sweetId;

    setUserVotes(prev => ({ ...prev, [sweetId]: newValue }));
    setGameState('drawing');
    
    // Clear the "Check" highlights when user starts interacting again
    setQuizFeedback(null);
    setActiveVisual({ id: sweetId, ids: [], type: 'drawing' });
    setTeacherSpeech(`Setting ${sweetLabel} to ${newValue}. Does it match the target?`);
  };

  const checkChart = () => {
    const errorIds = SWEETS.filter(sweet => userVotes[sweet.id] !== sweet.target).map(s => s.id);

    if (errorIds.length === 0) {
      setTeacherSpeech("Perfect! Your chart matches the data exactly. Now, let's analyze what you created.");
      setQuizFeedback({ isCorrect: true, explanation: "Excellent work! Every bar matches its target.", nextState: 'quiz_total' });
      setActiveVisual({ id: null, ids: SWEETS.map(s => s.id), type: 'correct' });
    } else {
      const errorLabels = SWEETS.filter(s => errorIds.includes(s.id)).map(s => s.label);
      setTeacherSpeech(`Check your bars for ${errorLabels.join(' and ')}. Do they match the targets below?`);
      setQuizFeedback({ 
        isCorrect: false, 
        explanation: `Some bars are incorrect. Look at the red highlights and adjust them to the target values.`, 
        nextState: 'drawing' 
      });
      // Highlight ALL incorrect bars
      setActiveVisual({ id: null, ids: errorIds, type: 'error' });
    }
  };

  const handleQuizAnswer = (isCorrect, explanation, nextState, barIds = []) => {
    setQuizFeedback({ isCorrect, explanation, nextState });
    setTeacherSpeech(explanation);
    setActiveVisual({ id: null, ids: barIds, type: isCorrect ? 'correct' : 'error' });
  };

  const proceedFromQuiz = () => {
    if (quizFeedback && quizFeedback.isCorrect) {
      const next = quizFeedback.nextState;
      setGameState(next);
      setQuizFeedback(null);
      setActiveVisual({ id: null, ids: [], type: null });
      
      if (next === 'quiz_total') setTeacherSpeech("How many people actually voted for sweets?");
      if (next === 'quiz_diff') setTeacherSpeech("How many more children like Ice Cream than Donut?");
      if (next === 'quiz_combined') setTeacherSpeech("How many chose chocolate and ice-cream together?");
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    // If we were in the drawing phase, just clear the visual errors so user can draw again
    if (gameState === 'drawing' || gameState === 'checking') {
        setActiveVisual({ id: null, ids: [], type: null });
    } else {
        // Reset to question text if in quiz
        setActiveVisual({ id: null, ids: [], type: null });
    }
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState('intro');
    setUserVotes({ iceCream: 0, donut: 0, chocolate: 0, candy: 0 });
    setTeacherSpeech("Today, you are the scientist! Use the data below to draw your own bar chart.");
    setQuizFeedback(null);
    setActiveVisual({ id: null, ids: [], type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/dataInterpretation/barChart')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all`} style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Data Drawing Lab</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className={`font-black uppercase tracking-widest text-white/70 whitespace-nowrap`} style={{ fontSize: UI_CONFIG.textSize }}>Numerical Analysis</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP DIV: Drawing Area */}
        <div className="flex-[1.2] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-1 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Your Constructed Chart</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className={`font-bold text-white/30 uppercase tracking-widest italic`} style={{ fontSize: UI_CONFIG.textSize }}>Scale Gap of 2 (0-2-4-6)</span>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 shadow-lg transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0 mt-4 pt-6">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    
                    {/* Y-Axis Guidelines */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 2, 4, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className={`absolute -left-10 sm:-left-12 font-black text-white/80 translate-y-[-50%] text-right w-8 select-none`} style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* INTERACTIVE BARS */}
                    {SWEETS.map((sweet, sIdx) => {
                        const val = userVotes[sweet.id];
                        const heightPercentage = (val / 6) * 100;
                        const isActive = activeVisual.id === sweet.id || activeVisual.ids.includes(sweet.id);
                        const visualType = activeVisual.type;

                        return (
                            <div 
                                key={sweet.id} 
                                className="flex-1 max-w-[60px] sm:max-w-[80px] flex flex-col items-center justify-end relative h-full mx-1 sm:mx-2 z-10 cursor-crosshair group"
                                onClick={(e) => handleChartClick(sweet.id, e)}
                            >
                                {/* Target Ghosting */}
                                <div className="absolute inset-0 w-full border-x-2 border-t-2 border-dashed border-white/5 rounded-t-lg pointer-events-none" />

                                <motion.div 
                                    className={`w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t ${sweet.barGradient} border-x border-t relative overflow-hidden`} 
                                    initial={{ height: 0 }} 
                                    animate={{ 
                                        height: `${heightPercentage}%`,
                                        scale: isActive && visualType === 'correct' ? [1, 1.05, 1] : 1,
                                        borderColor: isActive ? (visualType === 'correct' ? '#22c55e' : visualType === 'error' ? '#ef4444' : '#facc15') : 'rgba(255,255,255,0.2)',
                                        boxShadow: isActive ? `0 0 20px ${visualType === 'correct' ? 'rgba(34,197,94,0.4)' : 'rgba(239, 68, 68, 0.4)'}` : 'none'
                                    }} 
                                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                                    {isActive && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className={`absolute inset-0 ${visualType === 'correct' ? 'bg-green-500' : visualType === 'error' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                                    )}
                                    <div className="absolute inset-0 flex flex-col-reverse">
                                        {[2, 4, 6].map((gridVal) => (
                                            <div key={gridVal} className="h-1/3 border-t border-black/10 w-full" />
                                        ))}
                                    </div>
                                </motion.div>

                                {/* CONNECTOR LINE (Now shows for ALL active IDs simultaneously) */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: sIdx === 0 ? '12.5%' : sIdx === 1 ? '37.5%' : sIdx === 2 ? '62.5%' : '87.5%' }}
                                            exit={{ opacity: 0 }}
                                            className="absolute left-[-1000%] border-t-2 border-dashed pointer-events-none z-0"
                                            style={{ 
                                                bottom: `${heightPercentage}%`,
                                                width: '2000%',
                                                borderColor: visualType === 'correct' ? '#22c55e' : visualType === 'error' ? '#ef4444' : '#facc15'
                                            }}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-around items-start pt-3 shrink-0 h-14">
                    {SWEETS.map(sweet => (
                        <div key={sweet.id} className="flex-1 flex flex-col items-center max-w-[80px]">
                            <div className={`${sweet.color} p-1 rounded-md text-white shadow-md mb-1`}>
                                {React.cloneElement(sweet.icon, { size: 14 })}
                            </div>
                            <span className={`font-black text-white/90 uppercase tracking-tight text-center leading-none whitespace-nowrap overflow-visible`} style={{ fontSize: UI_CONFIG.smallText }}>
                                {sweet.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* BOTTOM DIV: Instructions & Quiz Area */}
        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-5 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
                  {/* Teacher Feedback Loop */}
                  {!quizFeedback && (
                    <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                        </div>
                        <h2 className={`text-white font-bold italic leading-tight flex-1`} style={{ fontSize: UI_CONFIG.textSize }}>"{teacherSpeech}"</h2>
                    </div>
                  )}

                  {/* DRAWING PHASE: TARGETS */}
                  {(gameState === 'intro' || gameState === 'drawing') && !quizFeedback && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-3xl">
                          {SWEETS.map(s => (
                              <div key={s.id} className="bg-white/5 p-2 rounded-xl border border-white/10 flex items-center gap-2">
                                  <div className={`${s.color} p-1.5 rounded-lg text-white`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                  <div className="flex flex-col">
                                      <span className="text-white/40 font-black uppercase tracking-tighter" style={{ fontSize: '10px' }}>Target</span>
                                      <span className="text-white font-black" style={{ fontSize: UI_CONFIG.textSize }}>{s.target}</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="flex gap-4 mt-1">
                        {gameState === 'intro' ? (
                            <button onClick={() => setGameState('drawing')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>
                                Start Drawing <ArrowRightCircle size={20} />
                            </button>
                        ) : (
                            <button onClick={checkChart} className="bg-green-500 text-white px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-green-800" style={{ fontSize: UI_CONFIG.textSize }}>
                                Check My Chart <Check size={20} />
                            </button>
                        )}
                      </div>
                    </>
                  )}

                  {/* QUIZ FEEDBACK OVERLAY */}
                  {quizFeedback && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 w-full max-w-md">
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 w-full ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                            {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400 shrink-0" /> : <XCircle className="text-red-400 shrink-0" />}
                            <p className="font-bold leading-snug" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.explanation}</p>
                        </div>
                        <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
                            {quizFeedback.isCorrect ? 'Continue' : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                        </button>
                    </motion.div>
                  )}

                  {/* FOLLOW-UP QUESTIONS */}
                  {!quizFeedback && gameState === 'quiz_total' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl px-2">
                        {[15, 17, 20].map(num => (
                            <button key={num} onClick={() => handleQuizAnswer(num === 17, num === 17 ? "Great counting! Adding up all the bars ($6+4+4+3$) gives us 17 votes." : `Try again! Adding all the bars won't give ${num}.`, 'quiz_diff', SWEETS.map(s => s.id))} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{num} Voters</button>
                        ))}
                    </div>
                  )}

                  {!quizFeedback && gameState === 'quiz_diff' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl px-2">
                        {[1, 2, 3].map(num => (
                            <button key={num} onClick={() => handleQuizAnswer(num === 2, num === 2 ? "Spot on! The Ice Cream bar (6) is 2 blocks taller than the Donut bar (4)." : `Look at the bars again. Is the difference really ${num}?`, 'quiz_combined', ['iceCream', 'donut'])} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{num} children</button>
                        ))}
                    </div>
                  )}

                  {!quizFeedback && gameState === 'quiz_combined' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl px-2">
                        {[8, 10, 12].map(num => (
                            <button key={num} onClick={() => handleQuizAnswer(num === 10, num === 10 ? "Correct! By combining the 4 votes for Chocolate and the 6 votes for Ice Cream, we get 10 in total." : `Try again! That's not the sum of Chocolate and Ice Cream.`, 'mastery', ['chocolate', 'iceCream'])} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{num} Voters</button>
                        ))}
                    </div>
                  )}

                </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* MASTERY MODAL */}
      <AnimatePresence>
        {gameState === 'mastery' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl">
                            <Trophy size={40} className="animate-bounce" />
                        </div>
                        <h2 className={`text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter text-shadow-sm`}>Interpretation Master!</h2>
                        <p className={`text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center`} style={{ fontSize: UI_CONFIG.textSize }}>
                            "Incredible work! You've learned how to build a bar chart from data and use it to answer complex questions about the total and differences."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                                <RefreshCcw size={16} /> Re-start
                            </button>
                            <button onClick={() => navigate('/learn/dataInterpretation/barChart/twoClassBarChart')} className={`bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                                Next Module <ArrowRightCircle size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
          <GraduationCap size={24} className="text-[#3e2723] mb-1" />
          <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Construction & Analysis Lab</h3>
      </div>
    </div>
  );
}