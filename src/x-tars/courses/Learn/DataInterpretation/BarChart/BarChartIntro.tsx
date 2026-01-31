import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  Play,
  RotateCcw,
  Check,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  IceCream,
  Dessert,
  Candy,
  BarChart3,
  User,
  ArrowRightCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION (Edit these to change sizes)
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

const KIDS_POOL = [
  { name: 'Alex', color: '#f43f5e', target: 'chocolate' },
  { name: 'Sam', color: '#3b82f6', target: 'iceCream' },
  { name: 'Leo', color: '#10b981', target: 'donut' },
  { name: 'Mia', color: '#a855f7', target: 'donut' },
  { name: 'Zoe', color: '#f97316', target: 'chocolate' },
  { name: 'Ben', color: '#06b6d4', target: 'donut' },
  { name: 'Eva', color: '#eab308', target: 'iceCream' },
  { name: 'Dan', color: '#6366f1', target: 'chocolate' },
  { name: 'Ruby', color: '#84cc16', target: 'donut' },
  { name: 'Max', color: '#14b8a6', target: 'iceCream' },
];

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); // intro, empty_chart, polling, final_observation, deciding, feedback, summary, mastery
  const [currentKidIndex, setCurrentKidIndex] = useState(0);
  const [votes, setVotes] = useState({ chocolate: 0, iceCream: 0, donut: 0 });
  const [teacherSpeech, setTeacherSpeech] = useState("Kids, today we need to decide what sweet to order.");
  const [userFinalChoice, setUserFinalChoice] = useState(null);
  const [isKidArrived, setIsKidArrived] = useState(false);
  const [highlightedChoice, setHighlightedChoice] = useState(null);
  
  const timerRef = useRef(null);
  const transitionTimerRef = useRef(null);
  const autoProcessingRef = useRef(-1);

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  const getWinner = useCallback(() => {
    return Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b);
  }, [votes]);

  const triggerNextUser = useCallback(() => {
    if (currentKidIndex < KIDS_POOL.length - 1) {
      setCurrentKidIndex(prev => prev + 1);
      setIsKidArrived(false);
    } else {
      setGameState('final_observation');
      setTeacherSpeech("Voting is finished! Let's check the preference meter.");
    }
  }, [currentKidIndex]);

  const handleVote = useCallback((sweetId) => {
    setVotes(prev => ({ ...prev, [sweetId]: prev[sweetId] + 1 }));
    setHighlightedChoice(null);

    if (totalVotes === 0) {
      setTeacherSpeech(`One child chose ${sweetId}... watch the bar grow to line 1!`);
    }

    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    transitionTimerRef.current = setTimeout(() => {
      triggerNextUser();
    }, 1500);
  }, [triggerNextUser, totalVotes]);

  useEffect(() => {
    if (gameState === 'polling' && isKidArrived && autoProcessingRef.current !== currentKidIndex) {
      autoProcessingRef.current = currentKidIndex;
      const targetSweet = KIDS_POOL[currentKidIndex].target;
      
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setHighlightedChoice(targetSweet);
        timerRef.current = setTimeout(() => {
          handleVote(targetSweet);
        }, 1000);
      }, 1000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [gameState, isKidArrived, currentKidIndex, handleVote]);

  const handleFinalSelection = (sweetId) => {
    const winnerId = getWinner();
    setUserFinalChoice(sweetId);
    setGameState('feedback');
    
    if (sweetId === winnerId) {
        setTeacherSpeech(`Yes! Since ${sweetId.toUpperCase()} is the maximum, you should select this for the class!`);
    } else {
        const selectedLabel = SWEETS.find(s => s.id === sweetId)?.label || sweetId;
        setTeacherSpeech(`No, since ${selectedLabel} is not the maximum, it is not the most popular choice...`);
        
        setTimeout(() => {
            const winnerLabel = SWEETS.find(s => s.id === winnerId)?.label || winnerId;
            setTeacherSpeech(`Instead, we will select ${winnerLabel.toUpperCase()} as it is liked by the most students.`);
        }, 2000);
    }
  };

  const showSummary = () => {
    const winnerId = getWinner();
    const winnerCount = votes[winnerId];
    const winnerLabel = SWEETS.find(s => s.id === winnerId)?.label || winnerId;
    setTeacherSpeech(`${winnerLabel} was selected by ${winnerCount} people and hence we will order it!`);
    setGameState('summary');
  };

  const handleRestart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setGameState('intro');
    setCurrentKidIndex(0);
    setIsKidArrived(false);
    autoProcessingRef.current = -1;
    setHighlightedChoice(null);
    setVotes({ chocolate: 0, iceCream: 0, donut: 0 });
    setTeacherSpeech("Kids, today we need to decide what sweet to order.");
    setUserFinalChoice(null);
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/dataInterpretation/barChart')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase text-[${UI_CONFIG.smallText}] hover:text-white transition-all`}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className={`text-white text-[${UI_CONFIG.headerSize}] font-black uppercase tracking-tighter`}>Bar Chart Introduction</h1>
          </div>
          {/* <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
             <BarChart3 className="text-yellow-400" size={16} />
             <span className={`text-[${UI_CONFIG.textSize}] font-black uppercase tracking-widest text-white/70 whitespace-nowrap`}>Scale 0 - 6</span>
          </div> */}
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP SECTION: Stage */}
        <div className="h-[44%] shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {(gameState !== 'polling') && (
                <motion.div key="teacher-view" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4 w-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                  </div>
                  <div className="bg-black/40 px-4 py-3 rounded-2xl border border-white/5 w-full max-w-lg min-h-[64px] flex items-center justify-center">
                    <h2 className={`text-white text-[${UI_CONFIG.textSize}] font-bold italic leading-tight text-center`}>"{teacherSpeech}"</h2>
                  </div>

                  <div className="flex gap-3">
                    {gameState === 'intro' && (
                        <button onClick={() => { setGameState('empty_chart'); setTeacherSpeech("Right now, nobody has voted. All the bars are at zero."); }} className={`bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase text-[${UI_CONFIG.textSize}] tracking-widest shadow-xl border-b-4 border-yellow-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-1`}>Start Lesson <ArrowRight size={16} /></button>
                    )}
                    {gameState === 'empty_chart' && (
                        <button onClick={() => { setGameState('polling'); setIsKidArrived(false); autoProcessingRef.current = -1; setTeacherSpeech(`${KIDS_POOL[0].name} is coming to the screen.`); }} className={`bg-cyan-500 text-white px-8 py-3 rounded-full font-black uppercase text-[${UI_CONFIG.textSize}] tracking-widest shadow-xl border-b-4 border-cyan-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 text-center`}>Watch Voting <Play size={16} fill="currentColor" /></button>
                    )}
                    {gameState === 'final_observation' && (
                        <button onClick={() => setGameState('deciding')} className={`bg-green-500 text-white px-10 py-3 rounded-full font-black uppercase text-[${UI_CONFIG.textSize}] tracking-widest shadow-xl border-b-4 border-green-800 hover:scale-105 transition-all text-center`}>Which one is the winner?</button>
                    )}
                    {gameState === 'feedback' && (
                        <button onClick={showSummary} className={`bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase text-[${UI_CONFIG.textSize}] tracking-widest shadow-xl border-b-4 border-yellow-700 hover:scale-105 transition-all text-center flex items-center gap-2`}>View Final Verdict <ArrowRightCircle size={18} /></button>
                    )}
                    {gameState === 'summary' && (
                        <button onClick={() => setGameState('mastery')} className={`bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase text-[${UI_CONFIG.textSize}] tracking-widest shadow-xl border-b-4 border-yellow-700 hover:scale-105 transition-all text-center flex items-center gap-2`}>Finish Module <Trophy size={18} /></button>
                    )}
                  </div>

                  {(gameState === 'deciding' || gameState === 'feedback' || gameState === 'summary') && (
                    <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                      {SWEETS.map(s => {
                        const isWinner = getWinner() === s.id;
                        const isSelected = userFinalChoice === s.id;
                        const isWrong = isSelected && !isWinner;
                        
                        return (
                          <button 
                            key={s.id} 
                            disabled={gameState !== 'deciding'}
                            onClick={() => handleFinalSelection(s.id)} 
                            className={`p-2 rounded-xl flex flex-col items-center gap-1 transition-all border-2
                                ${gameState === 'deciding' ? 'bg-white/5 border-white/10' : ''}
                                ${(gameState === 'feedback' || gameState === 'summary') && isWinner ? 'bg-green-500/20 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : ''}
                                ${(gameState === 'feedback' || gameState === 'summary') && isWrong ? 'bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}
                                ${(gameState === 'feedback' || gameState === 'summary') && !isWinner && !isWrong ? 'opacity-20 border-transparent bg-transparent' : ''}
                            `}
                          >
                            <div className={`${s.color} p-1.5 rounded-md text-white shadow-lg`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                            <span className={`text-white font-black uppercase text-[${UI_CONFIG.textSize}] tracking-tighter`}>{s.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {gameState === 'polling' && (
                <motion.div key="polling-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                   <div className="bg-white/10 px-4 py-1 rounded-full border border-white/5">
                      <span className={`text-[${UI_CONFIG.textSize}] font-black text-yellow-400 uppercase tracking-widest text-center`}>
                        Voter {currentKidIndex + 1} / 10
                      </span>
                   </div>
                   
                   <div className="relative w-full h-16 flex justify-center items-center">
                      <motion.div 
                        key={`kid-${currentKidIndex}`} 
                        initial={{ x: -250, opacity: 1 }} 
                        animate={{ x: [-250, -250, -200, -200, -150, -150, -100, -100, -50, -50, 0] }} 
                        transition={{ duration: 1.8, ease: "linear", times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }} 
                        onAnimationComplete={() => setIsKidArrived(true)} 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white shadow-2xl flex items-center justify-center relative z-20 overflow-hidden"
                        style={{ backgroundColor: KIDS_POOL[currentKidIndex].color }}
                      >
                         <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }} className="text-4xl select-none">🚶‍♂️</span>
                      </motion.div>
                   </div>

                   <div className="flex flex-col items-center gap-2 w-full h-24 mt-2">
                      <h3 className={`text-white text-[${UI_CONFIG.textSize}] font-bold uppercase tracking-tight text-center h-5`}>
                          {KIDS_POOL[currentKidIndex].name} {isKidArrived ? "is choosing..." : "is coming to the screen..."}
                      </h3>
                      
                      <div className="grid grid-cols-3 gap-6 w-full max-w-xs px-2 mt-1">
                          {SWEETS.map(sweet => {
                              const isTarget = highlightedChoice === sweet.id;
                              return (
                                  <div key={sweet.id} className="flex flex-col items-center gap-1">
                                      <motion.div animate={{ scale: isTarget ? 1.25 : 1, borderColor: isTarget ? '#facc15' : 'rgba(255,255,255,0.05)', backgroundColor: isTarget ? 'rgba(250,204,21,0.2)' : 'rgba(255,255,255,0.05)' }} className="p-3 rounded-2xl border-2 transition-all flex items-center justify-center relative shadow-lg">
                                          {isTarget && <motion.div layoutId="choice-glow" className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full" />}
                                          {React.cloneElement(sweet.icon, { size: 24, className: isTarget ? 'text-yellow-400' : 'text-white/20' })}
                                      </motion.div>
                                      <span className={`text-[${UI_CONFIG.textSize}] font-black uppercase tracking-widest text-center ${isTarget ? 'text-yellow-400' : 'text-white/20'}`}>{sweet.label}</span>
                                  </div>
                              );
                          })}
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM SECTION: Preference Meter */}
        <div className="flex-1 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden">
          <div className="flex-1 bg-[#3e2723] p-4 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            
            <div className="flex justify-between items-center mb-4 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className={`text-white font-black uppercase tracking-tighter text-[${UI_CONFIG.headerSize}]`}>Preference Meter</h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                        <span className={`text-[${UI_CONFIG.textSize}] font-bold text-white/30 uppercase tracking-widest italic`}>1 Child = 1 Block</span>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 shadow-lg transition-colors"><RotateCcw size={16} /></button>
            </div>

            <div className="flex-1 flex flex-col relative px-10 sm:px-14 overflow-hidden min-h-0">
                <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
                    <div className="absolute inset-0 pointer-events-none">
                        {[0, 1, 2, 3, 4, 5, 6].map((val) => (
                            <div key={val} className="absolute w-full border-t border-white/10 flex items-center" style={{ bottom: `${(val / 6) * 100}%` }}>
                                <span className={`absolute -left-10 sm:-left-12 text-[${UI_CONFIG.textSize}] font-black text-white/80 translate-y-[-50%] text-right w-8`}>{val}</span>
                            </div>
                        ))}
                    </div>

                    {SWEETS.map(sweet => {
                        const count = votes[sweet.id];
                        const heightPercentage = (count / 6) * 100;
                        const isWinner = (gameState === 'feedback' || gameState === 'summary') && sweet.id === getWinner();
                        const isUserChoice = (gameState === 'feedback' || gameState === 'summary') && sweet.id === userFinalChoice;
                        const isWrongSelection = isUserChoice && !isWinner;

                        return (
                            <div key={sweet.id} className="flex-1 max-w-[80px] sm:max-w-[100px] flex flex-col items-center justify-end relative h-full mx-2 sm:mx-4">
                                <motion.div 
                                    className={`w-full rounded-t-lg sm:rounded-t-xl bg-gradient-to-t ${sweet.barGradient} border-x border-t border-white/20 shadow-2xl relative overflow-hidden`} 
                                    initial={{ height: 0 }} 
                                    animate={{ 
                                        height: `${heightPercentage}%`,
                                        scale: isWinner ? [1, 1.05, 1] : 1,
                                        boxShadow: isWinner ? "0 0 30px rgba(34, 197, 94, 0.6)" : isWrongSelection ? "0 0 15px rgba(239, 68, 68, 0.4)" : "none",
                                        borderColor: isWinner ? "rgba(34, 197, 94, 1)" : isWrongSelection ? "rgba(239, 68, 68, 1)" : "rgba(255, 255, 255, 0.2)"
                                    }} 
                                    transition={{ 
                                        height: { type: 'spring', stiffness: 45, damping: 10 },
                                        scale: { duration: 2, repeat: Infinity }
                                    }}
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)]" />
                                    {isWinner && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} className="absolute inset-0 bg-green-500" />}
                                    {isWrongSelection && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} className="absolute inset-0 bg-red-600" />}

                                    <div className="absolute inset-0 flex flex-col-reverse">
                                        {[...Array(6)].map((_, idx) => (
                                            <div key={idx} className="h-1/6 border-t border-black/10 w-full" />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-around items-start pt-3 shrink-0 h-14 sm:h-18">
                    {SWEETS.map(sweet => (
                        <div key={sweet.id} className="flex-1 flex flex-col items-center max-w-[100px]">
                            <div className={`${sweet.color} p-1 rounded-md text-white shadow-md`}>
                                {React.cloneElement(sweet.icon, { size: 14 })}
                            </div>
                            <span className={`text-[${UI_CONFIG.textSize}] font-black text-white/90 uppercase tracking-tight text-center leading-none mt-2 whitespace-nowrap overflow-visible`}>
                                {sweet.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
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
                        <h2 className={`text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter text-shadow-sm`}>Mastery Achieved!</h2>
                        <p className={`text-[#3e2723] text-[${UI_CONFIG.textSize}] font-bold mb-8 italic px-4 leading-relaxed text-center`}>
                            "Excellent work! You've learned how bar charts help us visualize and compare data to make the best decisions for everyone."
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest text-[${UI_CONFIG.textSize}] hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`}>
                                <RefreshCcw size={16} /> Replay Session
                            </button>
                            <button onClick={() => navigate('/learn/dataInterpretation/barChart/largestSmallest')} className={`bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[${UI_CONFIG.textSize}] hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2`}>
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
          <h3 className={`text-[#3e2723] font-black uppercase text-[${UI_CONFIG.smallText}]`}>Numerical Foundation Lab</h3>
      </div>
    </div>
  );
}
