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
  RotateCw,
  Cookie,
  ArrowRightCircle
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
    icon: <Cookie size={24} />, 
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
  },
  {
    id: 'candy',
    label: 'Candy',
    icon: <CandyIcon size={24} />,
    color: 'bg-purple-500',
    barGradient: 'from-purple-400 to-purple-600'
  }
];

// Scenario: Ice Cream Max (6), Chocolate & Donut Equal (4), Candy (3 - mid scale)
const INITIAL_VOTES = { chocolate: 4, iceCream: 6, donut: 4, candy: 3 };

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  // States: intro, quiz_equal, quiz_max, quiz_comparison, quiz_reading_donut, quiz_reading_candy, mastery
  const [gameState, setGameState] = useState('intro'); 
  const [votes] = useState(INITIAL_VOTES);
  const [teacherSpeech, setTeacherSpeech] = useState("We've updated our chart with a new scale! Let's see how well you can read it.");
  const [quizFeedback, setQuizFeedback] = useState(null);
  
  // Track which bar is visually active for feedback (red/green highlight + line)
  const [activeVisual, setActiveVisual] = useState({ id: null, ids: [], type: null });

  const timerRef = useRef(null);

  const getWinner = useCallback(() => {
    return Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
  }, [votes]);

  const getLoser = useCallback(() => {
    return Object.keys(votes).reduce((a, b) => votes[a] < votes[b] ? a : b);
  }, [votes]);

  // Handle Quiz Logic
  const handleQuizAnswer = (isCorrect, explanation, nextState, barId, barIds = []) => {
    setQuizFeedback({ isCorrect, explanation, nextState });
    setTeacherSpeech(explanation);
    setActiveVisual({ id: barId, ids: barIds, type: isCorrect ? 'correct' : 'error' });
  };

  const proceedFromQuiz = () => {
    if (quizFeedback && quizFeedback.isCorrect) {
        const next = quizFeedback.nextState;
        if (next === 'mastery') {
            setGameState('mastery');
            return;
        }
        
        setGameState(next);
        setQuizFeedback(null);
        setActiveVisual({ id: null, ids: [], type: null });
        
        if (next === 'quiz_equal') setTeacherSpeech("Which sweets are liked by an equal number of people?");
        if (next === 'quiz_max') setTeacherSpeech("Which sweet has the maximum votes?");
        if (next === 'quiz_comparison') setTeacherSpeech("Is Ice Cream less liked than Donut?");
        if (next === 'quiz_reading_donut') setTeacherSpeech("How many people like Donut?");
        if (next === 'quiz_reading_candy') setTeacherSpeech("How many people like Candy?");
    }
  };

  const handleRetry = () => {
    setQuizFeedback(null);
    setActiveVisual({ id: null, ids: [], type: null });
    if (gameState === 'quiz_equal') setTeacherSpeech("Which sweets are liked by an equal number of people?");
    if (gameState === 'quiz_max') setTeacherSpeech("Which sweet has the maximum votes?");
    if (gameState === 'quiz_comparison') setTeacherSpeech("Is Ice Cream less liked than Donut?");
    if (gameState === 'quiz_reading_donut') setTeacherSpeech("How many people like Donut?");
    if (gameState === 'quiz_reading_candy') setTeacherSpeech("How many people like Candy?");
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setGameState('intro');
    setTeacherSpeech("We've updated our chart with a new scale! Let's see how well you can read it.");
    setQuizFeedback(null);
    setActiveVisual({ id: null, ids: [], type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all`} style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Scale Awareness Lab</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className={`font-black uppercase tracking-widest text-white/70 whitespace-nowrap`} style={{ fontSize: UI_CONFIG.textSize }}>Scale Gap of 2</span>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP SECTION: Bar Chart */}
        <div className="flex-1 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-1 sm:mb-2 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className={`text-white font-black uppercase tracking-tighter`} style={{ fontSize: UI_CONFIG.headerSize }}>Preference Meter</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className={`font-bold text-white/30 uppercase tracking-widest italic`} style={{ fontSize: UI_CONFIG.textSize }}>Scale 0 — 2 — 4 — 6</span>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 shadow-lg transition-colors"><RotateCcw size={16} /></button>
            </div>

            {/* Added pt-8 to ensure the '6' label is visible at the top */}
            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0 mt-4 pt-8">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    
                    {/* Y-Axis Guidelines: 0, 2, 4, 6 */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 2, 4, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t-2 border-white/5 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className={`absolute -left-10 sm:-left-12 font-black text-white/80 translate-y-[-50%] text-right w-8 select-none`} style={{ fontSize: UI_CONFIG.textSize }}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {/* DYNAMIC BARS */}
                    {SWEETS.map((sweet) => {
                        const count = votes[sweet.id];
                        const heightPercentage = (count / 6) * 100;
                        const isVisualActive = activeVisual.id === sweet.id || activeVisual.ids.includes(sweet.id);
                        const highlightColor = activeVisual.type === 'correct' ? '#22c55e' : '#ef4444';

                        return (
                            <div key={sweet.id} className="flex-1 max-w-[60px] sm:max-w-[80px] flex flex-col items-center justify-end relative h-full mx-1 sm:mx-2 z-10">
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
                                        {[2, 4, 6].map((val) => (
                                            <div key={val} className="h-1/3 border-t border-black/10 w-full" />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}

                    {/* DOTTED CONNECTOR LINE */}
                    <AnimatePresence>
                        {activeVisual.id && !activeVisual.ids.length && (
                            <motion.div 
                                key={`connector-${activeVisual.id}`}
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: activeVisual.id === 'chocolate' ? '12.5%' : 
                                           activeVisual.id === 'iceCream' ? '37.5%' : 
                                           activeVisual.id === 'donut' ? '62.5%' : '87.5%' 
                                }}
                                exit={{ opacity: 0 }}
                                className="absolute left-0 border-t-2 border-dashed pointer-events-none z-0"
                                style={{ 
                                    bottom: `${(votes[activeVisual.id] / 6) * 100}%`,
                                    borderColor: activeVisual.type === 'correct' ? '#22c55e' : '#ef4444'
                                }}
                            />
                        )}
                        {activeVisual.ids.length > 0 && activeVisual.ids.map(id => (
                            <motion.div 
                                key={`connector-multi-${id}`}
                                initial={{ width: 0 }}
                                animate={{ 
                                    width: id === 'chocolate' ? '12.5%' : 
                                           id === 'iceCream' ? '37.5%' : 
                                           id === 'donut' ? '62.5%' : '87.5%' 
                                }}
                                exit={{ opacity: 0 }}
                                className="absolute left-0 border-t-2 border-dashed pointer-events-none z-0"
                                style={{ 
                                    bottom: `${(votes[id] / 6) * 100}%`,
                                    borderColor: activeVisual.type === 'correct' ? '#22c55e' : '#ef4444'
                                }}
                            />
                        ))}
                    </AnimatePresence>
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

        {/* BOTTOM SECTION: Interaction Area */}
        <div className="h-[48%] shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
                <motion.div key={gameState + (quizFeedback ? '-feedback' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                  
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

                  {gameState === 'intro' && (
                    <button onClick={() => { setGameState('quiz_equal'); setTeacherSpeech("Which sweets are liked by an equal number of people?"); }} className={`bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest shadow-xl border-b-4 border-yellow-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1`} style={{ fontSize: UI_CONFIG.textSize }}>Start Assessment <ArrowRight size={16} /></button>
                  )}

                  {quizFeedback && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 w-full max-w-md">
                        <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 w-full ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                            {quizFeedback.isCorrect ? <CheckCircle2 className="text-green-400 shrink-0" /> : <XCircle className="text-red-400 shrink-0" />}
                            <p className="font-bold leading-snug" style={{ fontSize: UI_CONFIG.textSize }}>{quizFeedback.explanation}</p>
                        </div>
                        
                        <div className="flex gap-4">
                            <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
                                {quizFeedback.isCorrect ? 'Continue' : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                            </button>
                        </div>
                    </motion.div>
                  )}

                  {/* QUIZ OPTIONS */}
                  {!quizFeedback && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl px-2">
                        {gameState === 'quiz_equal' && [
                            { id: 'cd', label: 'Chocolate and Donut', correct: true, exp: 'Correct! Both have bars that reach the number 4.', ids: ['chocolate', 'donut'] },
                            { id: 'ic', label: 'Ice Cream and Candy', correct: false, exp: 'Try again! Their bars have different heights.', ids: ['iceCream', 'candy'] }
                        ].map(opt => (
                            <button key={opt.id} onClick={() => handleQuizAnswer(opt.correct, opt.exp, 'quiz_max', null, opt.ids)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{opt.label}</button>
                        ))}

                        {gameState === 'quiz_max' && SWEETS.map(s => {
                            const isWinner = s.id === 'iceCream';
                            const feedbackMsg = isWinner 
                                ? 'Correct! Ice Cream has the longest bar at 6 votes.' 
                                : `${s.label} doesn't have the longest bar.`;
                            return (
                                <button key={s.id} onClick={() => handleQuizAnswer(isWinner, feedbackMsg, 'quiz_comparison', s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-md" style={{ fontSize: UI_CONFIG.textSize }}>
                                    <div className={`${s.color} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                    <span>{s.label}</span>
                                </button>
                            );
                        })}

                        {gameState === 'quiz_comparison' && [
                            { id: 'yes', label: 'Yes', correct: false, exp: 'Look again! Ice Cream (6) has more votes than Donut (4).', ids: ['iceCream', 'donut'] },
                            { id: 'no', label: 'No', correct: true, exp: 'Correct! Ice Cream is more liked than Donut.', ids: ['iceCream', 'donut'] }
                        ].map(opt => (
                            <button key={opt.id} onClick={() => handleQuizAnswer(opt.correct, opt.exp, 'quiz_reading_donut', null, opt.ids)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{opt.label}</button>
                        ))}

                        {gameState === 'quiz_reading_donut' && [2, 4, 6].map(num => (
                            <button key={num} onClick={() => handleQuizAnswer(num === 4, num === 4 ? 'Exactly! The Donut bar aligns perfectly with the number 4.' : `Try again! Donut doesn't reach the number ${num}.`, 'quiz_reading_candy', 'donut')} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{num} people</button>
                        ))}

                        {gameState === 'quiz_reading_candy' && [2, 3, 4].map(num => (
                            <button key={num} onClick={() => handleQuizAnswer(num === 3, num === 3 ? 'Incredible! The Candy bar stops exactly between 2 and 4, which is 3.' : `Try again! Candy bar is ${num > 3 ? 'shorter' : 'longer'} than ${num}.`, 'mastery', 'candy')} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold transition-all text-center" style={{ fontSize: UI_CONFIG.textSize }}>{num} people</button>
                        ))}
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
                        <h2 className={`text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter text-shadow-sm`}>Scale Awareness Master!</h2>
                        <p className={`text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center`} style={{ fontSize: UI_CONFIG.textSize }}>
                            "Fantastic! You've learned how to read values using a custom scale and compare data even when values are between markers."
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
