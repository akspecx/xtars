import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  ArrowRightLeft,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE = [
  { id: 'p1', name: 'Aanya', image: 'https://via.placeholder.com/300x450?text=Aanya+Back', seat: 1 },
  { id: 'p2', name: 'Ben', image: 'https://via.placeholder.com/300x450?text=Ben+Front', seat: 2 },
  { id: 'p3', name: 'Chintu', image: 'https://via.placeholder.com/300x450?text=Chintu+Back', seat: 3 },
  { id: 'p4', name: 'Diya', image: 'https://via.placeholder.com/300x450?text=Diya+Front', seat: 4 },
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Scenario 1",
    title: "Everyone Facing Away",
    desc: "When everyone faces AWAY, imagine standing in their line. Your hands match the screen! Aanya is at the Extreme Left and Diya is at the Extreme Right.",
    facingAll: 'away',
    extremeLeft: 0, // Aanya
    extremeRight: 3 // Diya
  },
  {
    id: 1,
    label: "Scenario 2",
    title: "Everyone Facing You",
    desc: "When everyone faces TOWARDS you, the perspective flips! Imagine standing in their spot. Now, Diya is at the Extreme Left and Aanya is at the Extreme Right.",
    facingAll: 'towards',
    extremeLeft: 3, // Diya
    extremeRight: 0 // Aanya
  }
];

const MISSIONS = [
  { 
    id: 1, q: 'Who is sitting to the extreme left in the row?', 
    options: ['Aanya', 'Ben', 'Diya'], correct: 0,
    facingAll: 'away',
    explanation: [
      "Step 1: Look at the group. Everyone is looking AWAY from you.",
      "Step 2: Imagine yourself in their spot. Your left hand matches the start of the line.",
      "Step 3: Aanya is the person at the very end on that side. She is Extreme Left."
    ]
  },
  { 
    id: 2, q: 'Who is sitting to the extreme left in the row?', 
    options: ['Aanya', 'Chintu', 'Diya'], correct: 2,
    facingAll: 'towards',
    explanation: [
      "Step 1: Look at the characters. They are all looking TOWARDS you.",
      "Step 2: Imagine you are standing in the line. Your left hand is now on the right side of the screen.",
      "Step 3: Diya is sitting at the very end of that side."
    ]
  },
  { 
    id: 3, q: 'Who is sitting to the extreme right in the row?', 
    options: ['Ben', 'Chintu', 'Diya'], correct: 2,
    facingAll: 'away',
    explanation: [
      "Step 1: Everyone is facing AWAY. Their perspective matches your own view.",
      "Step 2: Look at the far end on your right side.",
      "Step 3: Diya is sitting at the very end of the line on that side."
    ]
  },
  { 
    id: 4, q: 'Who is sitting to the extreme right in the row?', 
    options: ['Aanya', 'Ben', 'Diya'], correct: 0,
    facingAll: 'towards',
    explanation: [
      "Step 1: The characters face TOWARDS you. Their right is your left!",
      "Step 2: Imagine being in the line. Your right hand points to the start of the line.",
      "Step 3: Aanya is the person at the very far end on that side."
    ]
  },
  { 
    id: 5, q: 'Who is sitting to the extreme right in the row?', 
    options: ['Aanya', 'Ben', 'Diya'], correct: 2,
    facingAll: 'away',
    explanation: [
      "Step 1: Observe the arrows. Everyone is facing AWAY.",
      "Step 2: In this view, the Extreme Right is the person at the far end of your right hand.",
      "Step 3: That person is Diya."
    ]
  }
];

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function ExtremeLeftRight() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept'); 
  const [activeTab, setActiveTab] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = MISSIONS[levelIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => { setIsError(false); }, 800);
    }
  };

  const handleNextMission = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  useEffect(() => {
    let interval;
    if (!isExplaining && autoNextTimer !== null && autoNextTimer > 0) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (!isExplaining && autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextMission, isExplaining]);

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Extreme Positioning</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => {setAppMode('practice'); setLevelIndex(0);}} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>
    </div>
  );

  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2 px-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-[#3e2723]/20 px-4 sm:px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {(appMode === 'concept' ? [0, 1] : MISSIONS).map((_, i) => (
          <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 
            ${(appMode === 'concept' ? i < activeTab : i < levelIndex) ? 'bg-green-500 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              (appMode === 'concept' ? i === activeTab : i === levelIndex) ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 
              'bg-white border-[#3e2723]/20'}`} />
        ))}
      </div>
    </div>
  );

  const renderBoardDiv = () => {
    const concept = appMode === 'concept' ? CONCEPT_STEPS[activeTab] : null;
    const currentPeople = PEOPLE; 
    const currentFacing = appMode === 'concept' ? concept.facingAll : mission.facingAll;

    return (
      <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-32 pb-16 sm:pt-44 sm:pb-24 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[650px] shadow-inner">
             
             <div className={`w-full flex items-end justify-center py-8 px-2 sm:px-4 relative gap-2 sm:gap-8 lg:gap-12`}>
                
                {currentPeople.map((person, idx) => {
                  const isExtremeLeft = appMode === 'concept' && concept.extremeLeft === idx;
                  const isExtremeRight = appMode === 'concept' && concept.extremeRight === idx;
                  const highlightPerson = appMode === 'concept' ? (isExtremeLeft || isExtremeRight) : true;

                  return (
                    <motion.div key={person.id} className="flex flex-col items-center shrink-0 relative px-1">
                        
                        {/* Facing Indicator Arrow - CRITICAL visual cue for Practice Mode */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                           <div className={`p-2 rounded-full border-2 ${currentFacing === 'away' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}>
                             {currentFacing === 'away' ? <MoveUp size={18} className="text-white" /> : <MoveDown size={18} className="text-white" />}
                           </div>
                           <span className={`text-[7px] sm:text-[9px] font-black uppercase mt-1.5 tracking-tighter ${currentFacing === 'away' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {currentFacing === 'away' ? 'Away' : 'Towards'}
                           </span>
                        </div>

                        {/* Position Badge in Concept Mode */}
                        {appMode === 'concept' && (isExtremeLeft || isExtremeRight) && (
                          <div className={`absolute -top-32 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-lg border-2 shadow-lg font-black text-[10px] uppercase whitespace-nowrap 
                            ${isExtremeLeft ? 'bg-cyan-500 border-cyan-300 text-white animate-pulse' : 'bg-orange-500 border-orange-300 text-white animate-pulse'}`}>
                            {isExtremeLeft ? `Extreme Left` : `Extreme Right`}
                          </div>
                        )}

                        <div className={`relative transition-all duration-500 p-1 ${highlightPerson ? 'scale-105' : 'opacity-40 grayscale'}`}>
                          {/* Bench Back */}
                          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#5d4037] rounded-t-xl border-t-4 border-x-4 border-black/20 z-20 shadow-2xl transition-all duration-500
                             w-14 sm:w-32 h-10 sm:h-18`} 
                          />
                          
                          {/* Image Box */}
                          <div className={`relative z-10 flex items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-white/10 bg-black/40 shadow-2xl ring-2 ring-black/10 transition-all duration-500
                             w-20 h-32 sm:w-40 sm:h-60`}
                          >
                             <img 
                                src={person.image} 
                                alt={person.name}
                                className={`w-full h-full object-cover filter brightness-[0.95] ${currentFacing === 'away' ? 'scale-x-[-1]' : ''}`}
                                onError={(e) => { e.target.src = `https://via.placeholder.com/300x450?text=${person.name}`; }}
                             />
                          </div>

                          {/* Highlights */}
                          {isExtremeLeft && <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full z-0" />}
                          {isExtremeRight && <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full z-0" />}
                        </div>
                        
                        {/* Name & Seat */}
                        <div className="mt-8 flex flex-col items-center gap-2">
                           <div className={`px-4 py-1 rounded-full border-2 transition-all duration-500 
                              ${isExtremeLeft ? 'bg-cyan-500 text-white border-cyan-400 font-black' : 
                                isExtremeRight ? 'bg-orange-500 text-white border-orange-400 font-black' :
                                'bg-black/20 text-[#a88a6d] border-transparent font-bold'}`}>
                              <span className="text-[9px] sm:text-xs uppercase tracking-widest">{person.name}</span>
                           </div>
                           
                           <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shadow-xl">
                              <span className="text-white font-black text-xs sm:text-sm">#{person.seat}</span>
                           </div>
                        </div>
                      </motion.div>
                  );
                })}
             </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[220px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        {appMode === 'concept' ? (
          <div className="w-full flex flex-col items-center relative z-10">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
               {CONCEPT_STEPS.map((step, idx) => (
                 <button key={step.id} onClick={() => setActiveTab(idx)}
                    className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                      ${activeTab === idx ? 'bg-[#2a1a16] text-yellow-400 border-black shadow-lg scale-110' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                   {step.label}
                 </button>
               ))}
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center w-full max-w-2xl px-4">
              <h3 className="text-[#2a1a16] text-xl sm:text-2xl font-black uppercase mb-4 flex items-center justify-center gap-3 text-shadow-sm">
                <GraduationCap size={32} className="text-orange-600" /> {CONCEPT_STEPS[activeTab].title}
              </h3>
              <p className="text-[#3e2723] text-lg sm:text-2xl font-bold leading-relaxed mb-4 italic">
                "{CONCEPT_STEPS[activeTab].desc}"
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="text-center w-full relative z-10 py-2 sm:py-4">
            <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-8 sm:mb-12 tracking-tight drop-shadow-sm px-2 leading-tight">
                {mission.q}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
              {mission.options.map((option, idx) => (
                <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isCorrect}
                  className={`group relative p-5 sm:p-8 rounded-[1.5rem] border-b-8 font-black text-xl sm:text-3xl transition-all
                    ${selectedOption === idx && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg' : 
                      selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                      'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 active:translate-y-1 shadow-md'}`}>
                  {option}
                  {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 text-white/40" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-24 sm:pb-32 flex flex-col sm:flex-row gap-3 sm:gap-4">
        {appMode === 'concept' ? (
          <div className="flex w-full gap-3">
             <button onClick={() => setActiveTab(p => Math.max(0, p - 1))} disabled={activeTab === 0}
               className="flex-1 bg-[#8d6e63] text-white p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-[#5d4037] active:translate-y-1 disabled:opacity-30 transition-all shadow-lg">Back</button>
             {activeTab < CONCEPT_STEPS.length - 1 ? (
               <button onClick={() => setActiveTab(p => p + 1)}
                 className="flex-[2] bg-[#2a1a16] text-[#e6dccb] p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-black active:translate-y-1 transition-all shadow-lg">Next Scenario</button>
             ) : (
               <button onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
                 className="flex-[2] bg-green-600 text-white p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-green-800 animate-pulse active:translate-y-1 transition-all shadow-lg">Start Practice</button>
             )}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className="flex-1 bg-[#2a1a16] text-[#e6dccb] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 flex justify-center items-center gap-2 shadow-lg">
               <GraduationCap size={18} /> Concept
            </button>
            <button onClick={handleNextMission} className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 flex justify-center items-center gap-2 shadow-lg transition-all">
              {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Mission'} <ChevronRight size={18} />
            </button>
            <button onClick={() => setIsExplaining(true)} disabled={selectedOption === null}
              className={`flex-1 p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 active:translate-y-1 flex items-center justify-center gap-2 shadow-lg transition-all
                ${selectedOption !== null ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
              <Info size={18} /> Explanation
            </button>
          </div>
        )}
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce" />
        </motion.div>
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Extreme Master!</h1>
        <div className="relative z-10 bg-white/60 p-8 rounded-[3rem] border-4 border-[#3e2723]/20 max-w-2xl mb-10 shadow-2xl mx-4 backdrop-blur-sm text-center">
          <h2 className="text-xl sm:text-2xl text-[#8d6e63] font-black uppercase mb-4 tracking-widest leading-tight text-center">Module Summary</h2>
          <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-6 text-center">
            "You have mastered finding the Extreme Left and Extreme Right based on perspective!"
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="relative z-10 px-12 sm:px-20 py-5 sm:py-7 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] sm:rounded-[3rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="absolute inset-0 bg-[#3e2723] pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(0,0,0,0.05) 100px, rgba(0,0,0,0.05) 200px)" }} />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {renderHeaderDiv()}
        {renderProgressDiv()}
        {renderBoardDiv()}
        {renderActionArea()}
        {renderFooterDiv()}
      </div>

      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2.5rem] sm:rounded-[4.5rem] p-6 sm:p-12 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden">
              <button onClick={() => setIsExplaining(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 sm:p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={20} /></button>
              
              <h3 className="text-xl sm:text-3xl font-black text-[#3e2723] uppercase mb-6 sm:mb-10 flex items-center gap-4">
                <ArrowRightLeft size={32} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 flex flex-col gap-6">
                {mission.explanation.map((line, i) => {
                  const [header, ...detailParts] = line.split(" - ");
                  const detail = detailParts.join(" - ");
                  
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/60 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-[#3e2723]/10"
                    >
                      <div className="bg-[#3e2723] p-4 sm:p-5 border-l-[12px] border-yellow-400">
                        <h4 className="text-yellow-400 font-black uppercase text-xs sm:text-sm tracking-widest">
                           {header}
                        </h4>
                      </div>
                      <div className="p-5 sm:p-8 text-center">
                        <p className="font-mono text-[#3e2723] text-sm sm:text-lg leading-relaxed italic font-bold">
                          {detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-8 py-5 sm:py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-xl sm:rounded-[3rem] uppercase tracking-widest text-xs sm:text-sm border-b-8 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}