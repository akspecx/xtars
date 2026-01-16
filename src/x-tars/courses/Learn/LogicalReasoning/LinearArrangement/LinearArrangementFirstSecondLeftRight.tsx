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
  MousePointer2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';
import AanyaPng from '../../../CommonUtility/Images/Aanya.png';
import AanyaBackPng from '../../../CommonUtility/Images/AanyaBack.png';
import BenPng from '../../../CommonUtility/Images/Ben.png';
import BenBackPng from '../../../CommonUtility/Images/BenBack.png';
import ChintuPng from '../../../CommonUtility/Images/Chintu.png';
import ChintuBackPng from '../../../CommonUtility/Images/ChintuBack.png';
import DiyaPng from '../../../CommonUtility/Images/Diya.png';
import DiyaBackPng from '../../../CommonUtility/Images/DiyaBack.png';
import EthanPng from '../../../CommonUtility/Images/Ethan.png';
import EthanBackPng from '../../../CommonUtility/Images/EthanBack.png';





// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE = [
  { 
    id: 'p1', 
    name: 'Aanya', 
    images: {
      away: AanyaBackPng,
      towards: AanyaPng
    },
    facing: 'away', 
    seat: 1 
  },
  { 
    id: 'p2', 
    name: 'Ben', 
    images: {
      towards: BenPng,
      away: BenBackPng
    },
    facing: 'towards', 
    seat: 2 
  },
  { 
    id: 'p3', 
    name: 'Chintu', 
    images: {
      away: ChintuBackPng,
      towards: ChintuPng
    },
    facing: 'away', 
    seat: 3 
  },
  { 
    id: 'p4', 
    name: 'Diya', 
    images: {
      towards: DiyaPng,
      away: DiyaBackPng
    },
    facing: 'towards', 
    seat: 4 
  },
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Scenario 1",
    title: "Left from Diya",
    desc: "Look at Diya's arrow. She faces AWAY. Imagine yourself as Diya. Chintu is 1st to your left, and Ben is 2nd to your left!",
    refIndex: 3, 
    facingOverride: 'away',
    firstPos: 2, // Chintu
    secondPos: 1, // Ben
    side: 'Left'
  },
  {
    id: 1,
    label: "Scenario 2",
    title: "Left from Ben",
    desc: "Look at Ben's arrow. He faces TOWARDS you. Imagine yourself as Ben. See your left hand! Chintu is 1st to your left, and Diya is 2nd to your left!",
    refIndex: 1, 
    facingOverride: 'towards',
    firstPos: 2, // Chintu
    secondPos: 3, // Diya
    side: 'Left'
  },
  {
    id: 2,
    label: "Scenario 3",
    title: "Right from Aanya",
    desc: "Aanya faces AWAY. Imagine yourself as Aanya. Your right hand points toward the others. Ben is 1st to your right, and Chintu is 2nd to your right!",
    refIndex: 0, 
    facingOverride: 'away',
    firstPos: 1, // Ben
    secondPos: 2, // Chintu
    side: 'Right'
  },
  {
    id: 3,
    label: "Scenario 4",
    title: "Right from Diya",
    desc: "Diya faces TOWARDS you. Imagine yourself as Diya. Your right hand points toward Chintu! Chintu is 1st to your right, and Ben is 2nd to your right!",
    refIndex: 3, 
    facingOverride: 'towards',
    firstPos: 2, // Chintu
    secondPos: 1, // Ben
    side: 'Right'
  }
];

const MISSIONS = [
  { 
    id: 1, q: "Who is 1st to Chintu's left?", 
    options: ['Aanya', 'Ben', 'Diya'], correct: 1,
    refIndex: 2, // Chintu
    explanation: [
      "Step 1: Locate Chintu (Seat 3). His arrow points AWAY.",
      "Step 2: Imagine yourself as Chintu. Your left hand points towards Ben.",
      "Step 3: Ben is the very next person. He is 1st to the left."
    ]
  },
  { 
    id: 2, q: "Who is 2nd to Ben's left?", 
    options: ['Aanya', 'Chintu', 'Diya'], correct: 2,
    refIndex: 1, // Ben
    explanation: [
      "Step 1: Look at Ben (Seat 2). His arrow points TOWARDS you.",
      "Step 2: Imagine yourself as Ben. Your left hand points to the right side of the screen.",
      "Step 3: Counting 1st is Chintu, 2nd is Diya. So, Diya is 2nd to the left."
    ]
  },
  { 
    id: 3, q: "Who is 1st to Aanya's right?", 
    options: ['Ben', 'Chintu', 'Diya'], correct: 0,
    refIndex: 0, // Aanya
    explanation: [
      "Step 1: Find Aanya (Seat 1). She faces AWAY.",
      "Step 2: Imagine yourself as Aanya. Your right hand points toward Ben.",
      "Step 3: Ben is sitting in the immediate next seat to the right."
    ]
  },
  { 
    id: 4, q: "Who is 2nd to Diya's right?", 
    options: ['Aanya', 'Ben', 'Chintu'], correct: 1,
    refIndex: 3, // Diya
    explanation: [
      "Step 1: Locate Diya (Seat 4). She faces TOWARDS you.",
      "Step 2: Imagine yourself as Diya. Your right hand points toward the center.",
      "Step 3: Counting from her: 1st is Chintu, 2nd is Ben."
    ]
  },
  { 
    id: 5, q: "Who is 2nd to Chintu's left?", 
    options: ['Aanya', 'Ben', 'Diya'], correct: 0,
    refIndex: 2, // Chintu
    explanation: [
      "Step 1: Find Chintu (Seat 3). He faces AWAY.",
      "Step 2: Imagine himself facing away. Left is Seat 2, then Seat 1.",
      "Step 3: Aanya is the 2nd person in that direction."
    ]
  }
];

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function FirstSecondLeftRight() {
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
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">First and second to left and right</h1>
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
        {(appMode === 'concept' ? [0, 1, 2, 3] : MISSIONS).map((_, i) => (
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

    return (
      <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-32 pb-16 sm:pt-44 sm:pb-24 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[500px] sm:min-h-[650px] shadow-inner">
             
             <div className={`w-full flex items-end justify-center py-8 px-2 sm:px-4 relative gap-2 sm:gap-8 lg:gap-12`}>
                
                {currentPeople.map((person, idx) => {
                  const isRef = appMode === 'concept' ? concept.refIndex === idx : (mission.refIndex === idx);
                  const isFirst = appMode === 'concept' && concept.firstPos === idx;
                  const isSecond = appMode === 'concept' && concept.secondPos === idx;
                  
                  const currentFacing = (appMode === 'concept' && idx === concept.refIndex) 
                    ? concept.facingOverride 
                    : person.facing;

                  const currentImage = person.images[currentFacing] || person.images.towards;

                  return (
                    <motion.div key={person.id} className="flex flex-col items-center shrink-0 relative px-1">
                        
                        {/* Facing Indicator Arrow */}
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                           <div className={`p-2 rounded-full border-2 ${currentFacing === 'away' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`}>
                             {currentFacing === 'away' ? <MoveUp size={18} className="text-white" /> : <MoveDown size={18} className="text-white" />}
                           </div>
                           <span className={`text-[7px] sm:text-[9px] font-black uppercase mt-1.5 tracking-tighter ${currentFacing === 'away' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {currentFacing === 'away' ? 'Away' : 'Towards'}
                           </span>
                        </div>

                        {/* Position Badge in Concept Mode */}
                        {appMode === 'concept' && (isFirst || isSecond) && (
                          <div className={`absolute -top-32 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-lg border-2 shadow-lg font-black text-[10px] uppercase whitespace-nowrap 
                            ${isFirst ? 'bg-cyan-500 border-cyan-300 text-white' : 'bg-orange-500 border-orange-300 text-white'}`}>
                            {isFirst ? `1st ${concept.side}` : `2nd ${concept.side}`}
                          </div>
                        )}

                        <div className={`relative transition-all duration-500 p-1 ${(isRef || isFirst || isSecond) ? 'scale-105' : 'opacity-40 grayscale'}`}>
                          {/* Bench Back */}
                          {/* <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#5d4037] rounded-t-xl border-t-4 border-x-4 border-black/20 z-20 shadow-2xl transition-all duration-500
                             w-14 sm:w-32 h-10 sm:h-18`} 
                          /> */}
                          
                          {/* Image Box */}
                          <div className={`relative z-10 flex items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-white/10 bg-black/40 shadow-2xl ring-2 ring-black/10 transition-all duration-500
                             w-20 h-32 sm:w-40 sm:h-60`}
                          >
                             <img 
                                src={currentImage} 
                                alt={person.name}
                                className={`w-full h-full object-cover filter brightness-[0.95]`}
                                onError={(e) => { e.target.src = `https://via.placeholder.com/300x450?text=${person.name}`; }}
                             />
                          </div>

                          {/* Highlights */}
                          {isRef && <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                          {isFirst && <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                          {isSecond && <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                        </div>
                        
                        {/* Name & Seat */}
                        <div className="mt-8 flex flex-col items-center gap-2">
                           <div className={`px-4 py-1 rounded-full border-2 transition-all duration-500 
                              ${isRef ? 'bg-yellow-400 text-[#2a1a16] border-yellow-500 font-black' : 
                                isFirst ? 'bg-cyan-500 text-white border-cyan-400 font-black' : 
                                isSecond ? 'bg-orange-500 text-white border-orange-400 font-black' :
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
                    className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
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
               className="flex-1 bg-[#8d6e63] text-white p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-[#5d4037] active:translate-y-1 disabled:opacity-30">Back</button>
             {activeTab < CONCEPT_STEPS.length - 1 ? (
               <button onClick={() => setActiveTab(p => p + 1)}
                 className="flex-[2] bg-[#2a1a16] text-[#e6dccb] p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-black active:translate-y-1">Next Scenario</button>
             ) : (
               <button onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
                 className="flex-[2] bg-green-600 text-white p-4 rounded-2xl font-black uppercase text-[10px] border-b-4 border-green-800 animate-pulse active:translate-y-1">Start Lab</button>
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
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Logic Master!</h1>
        <div className="relative z-10 bg-white/60 p-8 rounded-[3rem] border-4 border-[#3e2723]/20 max-w-2xl mb-10 shadow-2xl mx-4 backdrop-blur-sm text-center">
          <h2 className="text-xl sm:text-2xl text-[#8d6e63] font-black uppercase mb-4 tracking-widest leading-tight text-center">Module Summary</h2>
          <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-6 text-center">
            "You have mastered perspective-based positioning! Left and Right change based on where you are facing!"
          </p>
        </div>
        <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/PeopleSittingBetween')} className="relative z-10 px-12 sm:px-20 py-5 sm:py-7 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] sm:rounded-[3rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button>
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
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2.5rem] sm:rounded-[4.5rem] p-6 sm:p-12 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-left">
              <button onClick={() => setIsExplaining(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 sm:p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={20} /></button>
              
              <h3 className="text-xl sm:text-3xl font-black text-[#3e2723] uppercase mb-6 sm:mb-10 flex items-center gap-4">
                <ArrowRightLeft size={32} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 flex flex-col gap-6">
                {mission.explanation.map((line, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/60 rounded-[1.5rem] overflow-hidden shadow-xl border-2 border-[#3e2723]/10 p-6 sm:p-8"
                    >
                        <p className="font-mono text-[#3e2723] text-sm sm:text-lg leading-relaxed italic font-bold">
                          {line}
                        </p>
                    </motion.div>
                ))}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-8 py-5 sm:py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-xl sm:rounded-[3rem] uppercase tracking-widest text-xs sm:text-sm border-b-8 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}