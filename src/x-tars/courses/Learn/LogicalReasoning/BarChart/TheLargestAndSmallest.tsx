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
  Candy,
  BarChart3,
  ArrowRightCircle,
  XCircle,
  CheckCircle2,
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
    id: 'chocolate', 
    label: 'Chocolate', 
    icon: <Candy size={24} />, 
    color: 'bg-amber-800', 
    barGradient: 'from-amber-600 to-amber-800'
  },
  { 
    id: 'iceCream', 
    label: 'Ice Cream', 
    icon: <IceCream size={24} />, 
    color: 'bg-sky-500', 
    barGradient: 'from-sky-400 to-sky-600'
  },
  { 
    id: 'donut', 
    label: 'Donut', 
    icon: <Dessert size={24} />, 
    color: 'bg-pink-500', 
    barGradient: 'from-pink-400 to-pink-600'
  }
];

const INITIAL_VOTES = { chocolate: 3, iceCream: 5, donut: 2 };

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  // States: intro, quiz_most, quiz_least, quiz_how, summary, mastery
  const [gameState, setGameState] = useState('intro'); 
  const [votes] = useState(INITIAL_VOTES);
  const [teacherSpeech, setTeacherSpeech] = useState("We polled the class about their favorite sweets. Let's look at the results!");
  const [quizFeedback, setQuizFeedback] = useState(null);
  
  // Track which bar is visually active for feedback (red/green highlight + line)
  const [activeVisual, setActiveVisual] = useState({ id: null, type: null }); // type: 'correct' or 'error'

  const timerRef = useRef(null);

  const getWinner = useCallback(() => {
    return Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
  }, [votes]);

  const getLoser = useCallback(() => {
    return Object.keys(votes).reduce((a, b) => votes[a] < votes[b] ? a : b);
  }, [votes]);

  // Handle Quiz Logic
  const handleQuizAnswer = (isCorrect, explanation, nextState, barId) => {
    setQuizFeedback({ isCorrect, explanation, nextState });
    setTeacherSpeech(explanation);
    setActiveVisual({ id: barId, type: isCorrect ? 'correct' : 'error' });
  };

  const proceedFromQuiz = () => {
    if (quizFeedback && quizFeedback.isCorrect) {
        const next = quizFeedback.nextState;
        setGameState(next);
        setQuizFeedback(null);
        setActiveVisual({ id: null, type: null });
        
        if (next === 'quiz_most') setTeacherSpeech("Which sweet got the most votes?");
        if (next === 'quiz_least') setTeacherSpeech("Which sweet got the least votes?");
        if (next === 'quiz_how') setTeacherSpeech("How do you know which sweet has the most votes?");
        if (next === 'summary') {
            const winnerId = getWinner();
            const winnerCount = votes[winnerId];
            const winnerLabel = SWEETS.find(s => s.id === winnerId)?.label || winnerId;
            setTeacherSpeech(`${winnerLabel} was selected by ${winnerCount} people and hence we will order it for the class!`);
            setActiveVisual({ id: winnerId, type: 'correct' });
        }
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setActiveVisual({ id: null, type: null });
    if (gameState === 'quiz_most') setTeacherSpeech("Which sweet got the most votes?");
    if (gameState === 'quiz_least') setTeacherSpeech("Which sweet got the least votes?");
    if (gameState === 'quiz_how') setTeacherSpeech("How do you know which sweet has the most votes?");
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState('intro');
    setTeacherSpeech("We polled the class about their favorite sweets. Let's look at the results!");
    setQuizFeedback(null);
    setActiveVisual({ id: null, type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all`} style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Bar Chart Interpretation</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className={`font-black uppercase tracking-widest text-white/70 whitespace-nowrap`} style={{ fontSize: UI_CONFIG.textSize }}>Class Poll Data</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP SECTION: Preference Meter (Bar Chart) */}
        <div className="flex-1 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-1 sm:mb-2 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Preference Meter</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className={`font-bold text-white/30 uppercase tracking-widest italic`} style={{ fontSize: UI_CONFIG.textSize }}>1 Child = 1 Block</span>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 shadow-lg transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0 mt-4">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    
                    {/* Y-Axis Guidelines */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className={`absolute -left-10 sm:-left-12 font-black text-white/80 translate-y-[-50%] text-right w-8 select-none`} style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* DYNAMIC BARS */}
                    {SWEETS.map((sweet) => {
                        const count = votes[sweet.id];
                        const heightPercentage = (count / 6) * 100;
                        const isVisualActive = activeVisual.id === sweet.id;
                        const highlightColor = activeVisual.type === 'correct' ? '#22c55e' : '#ef4444';

                        return (
                            <div key={sweet.id} className="flex-1 max-w-[80px] sm:max-w-[100px] flex flex-col items-center justify-end relative h-full mx-1 sm:mx-4 z-10">
                                <motion.div 
                                    className={`w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t ${sweet.barGradient} border-x border-t border-white/20 shadow-2xl relative overflow-hidden`} 
                                    initial={{ height: 0 }} 
                                    animate={{ 
                                        height: `${heightPercentage}%`,
                                        scale: isVisualActive && activeVisual.type === 'correct' ? [1, 1.05, 1] : 1,
                                        boxShadow: isVisualActive ? `0 0 30px ${activeVisual.type === 'correct' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'}` : "none",
                                        borderColor: isVisualActive ? highlightColor : "rgba(255, 255, 255, 0.2)"
                                    }} 
                                    transition={{ 
                                        height: { duration: 1, ease: "easeOut" },
                                        scale: { duration: 2, repeat: Infinity }
                                    }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                                    {isVisualActive && (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className={`absolute inset-0 ${activeVisual.type === 'correct' ? 'bg-green-500' : 'bg-red-500'}`} />
                                    )}
                                    <div className="absolute inset-0 flex flex-col-reverse">
                                        {[...Array(6)].map((_, idx) => (
                                            <div key={idx} className="h-1/6 border-t border-black/10 w-full" />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}

                    {/* CONNECTOR LINE */}
                    <AnimatePresence>
                        {activeVisual.id && (
                            <motion.div 
                                key={`connector-${activeVisual.id}`}
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: activeVisual.id === 'chocolate' ? '16.6%' : activeVisual.id === 'iceCream' ? '50%' : '83.3%' 
                                }}
                                exit={{ opacity: 0 }}
                                className="absolute left-0 border-t-2 border-dashed pointer-events-none z-0"
                                style={{ 
                                    bottom: `${(votes[activeVisual.id] / 6) * 100}%`,
                                    borderColor: activeVisual.type === 'correct' ? '#22c55e' : '#ef4444'
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="flex justify-around items-start pt-3 shrink-0 h-14">
                    {SWEETS.map(sweet => (
                        <div key={sweet.id} className="flex-1 flex flex-col items-center max-w-[100px]">
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

        {/* BOTTOM SECTION: Interaction Area (Questions) */}
        <div className="h-[48%] shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + (quizFeedback ? '-feedback' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
                  {/* Teacher Feedback Loop */}
                  {!quizFeedback && (
                    <div className="flex flex-col items-center gap-2 w-full">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                      </div>
                      <div className="bg-black/40 px-4 py-2 rounded-2xl border border-white/5 w-full max-w-lg min-h-[56px] flex items-center justify-center">
                        <h2 className={`text-white font-bold italic leading-tight text-center`} style={{ fontSize: UI_CONFIG.textSize }}>"{teacherSpeech}"</h2>
                      </div>
                    </div>
                  )}

                  {/* Intro State */}
                  {gameState === 'intro' && (
                    <button onClick={() => { setGameState('quiz_most'); setTeacherSpeech("Which sweet got the most votes?"); }} className={`bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest shadow-xl border-b-4 border-yellow-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1`} style={{ fontSize: UI_CONFIG.textSize }}>Begin Assessment <ArrowRight size={16} /></button>
                  )}

                  {/* Quiz Feedback State (With Retry Option) */}
                  {quizFeedback && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 w-full max-w-md">
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 w-full ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                            {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400 shrink-0" /> : <XCircle className="text-red-400 shrink-0" />}
                            <p className="font-bold leading-snug" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.explanation}</p>
                        </div>
                        
                        <div className="flex gap-4">
                            {quizFeedback.isCorrect ? (
                                <button onClick={proceedFromQuiz} className="bg-white text-black px-12 py-3 rounded-full font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center gap-2 shadow-xl" style={{ fontSize: UI_CONFIG.textSize }}>
                                    Continue <ArrowRight size={18} />
                                </button>
                            ) : (
                                <button onClick={handleRetry} className="bg-amber-500 text-white px-12 py-3 rounded-full font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 shadow-xl border-b-4 border-amber-800" style={{ fontSize: UI_CONFIG.textSize }}>
                                    Try Again <RotateCw size={18} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                  )}

                  {/* Quiz Options */}
                  {!quizFeedback && (gameState === 'quiz_most' || gameState === 'quiz_least' || gameState === 'quiz_how') && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-2">
                        {(gameState === 'quiz_most' || gameState === 'quiz_least') && SWEETS.map(s => {
                            const isMost = gameState === 'quiz_most' && s.id === getWinner();
                            const isLeast = gameState === 'quiz_least' && s.id === getLoser();
                            const isCorrect = isMost || isLeast;
                            const targetState = gameState === 'quiz_most' ? 'quiz_least' : 'quiz_how';
                            
                            // Specific feedback strings with requested terminology
                            let feedbackMsg = "";
                            if (isCorrect) {
                                feedbackMsg = `Correct! ${s.label} has the ${isMost ? 'longest' : 'shortest'} bar with ${votes[s.id]} votes.`;
                            } else {
                                if (gameState === 'quiz_most') {
                                    feedbackMsg = `${s.label} doesn't have the longest bar.`;
                                } else {
                                    feedbackMsg = `${s.label} doesn't have the shortest bar.`;
                                }
                            }

                            return (
                                <button key={s.id} onClick={() => handleQuizAnswer(isCorrect, feedbackMsg, targetState, s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-3 rounded-xl text-white font-bold flex flex-col items-center gap-2 transition-all shadow-md" style={{ fontSize: UI_CONFIG.textSize }}>
                                    <div className={`${s.color} p-2 rounded-md shadow-lg`}>{React.cloneElement(s.icon, { size: 20 })}</div>
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}
                        {gameState === 'quiz_how' && [
                            { id: 'height', label: 'By the height of the bars', correct: true, exp: 'Exactly! The taller the bar, the more votes it represents.', next: 'summary' },
                            { id: 'colors', label: 'By the colors of the bars', correct: false, exp: 'Colors help us tell them apart, but the height shows the amount!', next: 'quiz_how' },
                            { id: 'order', label: 'By the order on the line', correct: false, exp: 'The position on the axis tells us which sweet it is, but height shows the votes.', next: 'quiz_how' }
                        ].map(opt => (
                            <button key={opt.id} onClick={() => handleQuizAnswer(opt.correct, opt.exp, opt.next, opt.correct ? getWinner() : null)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold leading-tight transition-all text-center" style={{ fontSize: UI_CONFIG.smallText }}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                  )}

                  {/* Final Verdict Phase */}
                  {gameState === 'summary' && (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={handleRestart} className={`bg-[#e6dccb] text-[#3e2723] px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                            <RefreshCcw size={18} /> Re-start
                        </button>
                        <button onClick={() => setGameState('mastery')} className={`bg-green-600 text-white px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                            Next Module <ArrowRightCircle size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Mastery Modal */}
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
                            "Incredible work! You can now accurately read bar charts to identify maximums, minimums, and make data-driven decisions."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
                                <RefreshCcw size={16} /> Replay
                            </button>
                            <button className={`bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}>
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
          <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Numerical Interpretation Lab</h3>
      </div>
    </div>
  );
}