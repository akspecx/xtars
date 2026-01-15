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
  MousePointer2,
  MoveUp,
  MoveDown
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';
import AanyaBackPng from '../../../CommonUtility/Images/AanyaBack.png';
import BenPng from '../../../CommonUtility/Images/Ben.png';
import ChintuBackPng from '../../../CommonUtility/Images/ChintuBack.png';
import DiyaPng from '../../../CommonUtility/Images/Diya.png';
import EthanBackPng from '../../../CommonUtility/Images/EthanBack.png';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE = [
  { id: 'p1', name: 'Aanya', image: AanyaBackPng, facing: 'away', pos: '1st' },
  { id: 'p2', name: 'Ben', image: BenPng, facing: 'towards', pos: '2nd' },
  { id: 'p3', name: 'Chintu', image: ChintuBackPng, facing: 'away', pos: '3rd' },
  { id: 'p4', name: 'Diya', image: DiyaPng, facing: 'towards', pos: '4th' },
  { id: 'p5', name: 'Ethan', image: EthanBackPng, facing: 'away', pos: '5th' },
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Step 1",
    title: "Left vs. Immediate Left",
    desc: "Imagine yourself as Chintu (facing away). Ben is your 'Immediate Left' because he is right next to your left hand. Aanya is also to your 'Left', but she is further away!",
    highlight: 'left',
    refIndex: 2, // Chintu
    immediateIndex: 1, // Ben
    generalIndex: 0 // Aanya
  },
  {
    id: 1,
    label: "Step 2",
    title: "Right vs. Immediate Right",
    desc: "Imagine yourself as Diya (facing towards). Your right hand points to Chintu. He is your 'Immediate Right'. Ben and Aanya are also to your 'Right'!",
    highlight: 'right',
    refIndex: 3, // Diya
    immediateIndex: 2, // Chintu
    generalIndex: [1, 0] // Ben and Aanya
  }
];

const MISSIONS = [
  { 
    id: 1, v: 'Immediate', q: 'Who is sitting to the IMMEDIATE left of Chintu?', 
    options: ['Aanya', 'Ben', 'Diya'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Find Chintu in the line. He is facing Away (arrow pointing Up).",
      "Step 2: Direction Identification - Imagine yourself as Chintu. Hold up your left hand. The person right next to your hand is the 'Immediate Left'.",
      "Step 3: Final Position - Ben is sitting right next to Chintu on the left side. So, Ben is the Immediate Left."
    ]
  },
  { 
    id: 2, v: 'General', q: 'Aanya is to the left of Chintu. Is she the IMMEDIATE left?', 
    options: ['Yes, she is next to him', 'No, she is just to the left', 'No, she is to the right'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Look at Chintu (facing Away) and Aanya.",
      "Step 2: Direction Identification - Imagine yourself as Chintu. Aanya is in the direction of your left hand, but Ben is sitting between you both!",
      "Step 3: Final Position - Since someone else is in between, Aanya is to the left, but NOT the 'Immediate Left'."
    ]
  },
  { 
    id: 3, v: 'Immediate', q: 'Who is to the IMMEDIATE right of Diya?', 
    options: ['Chintu', 'Ben', 'Ethan'], correct: 0,
    explanation: [
      "Step 1: Reference Point - Find Diya. She is facing towards you (arrow pointing Down).",
      "Step 2: Direction Identification - Imagine yourself as Diya. Your right hand is on the side of Chintu.",
      "Step 3: Final Position - Chintu is sitting right next to Diya on that side. He is the Immediate Right."
    ]
  },
  { 
    id: 4, v: 'General', q: 'Imagine yourself as Ethan (facing away). Who is to your left?', 
    options: ['Only Diya', 'Only Aanya', 'Diya, Chintu, Ben & Aanya'], correct: 2,
    explanation: [
      "Step 1: Reference Point - Look at Ethan at the very end. He faces Away.",
      "Step 2: Direction Identification - Hold up your left hand. Every person in that direction is to your 'Left'.",
      "Step 3: Final Position - Diya, Chintu, Ben, and Aanya are all sitting in the direction of your left hand."
    ]
  },
  { 
    id: 5, v: 'Immediate', q: 'Who is to the IMMEDIATE left of Diya?', 
    options: ['Ethan', 'Chintu', 'Ben'], correct: 0,
    explanation: [
      "Step 1: Reference Point - Find Diya (facing Towards).",
      "Step 2: Direction Identification - Imagine yourself as Diya. Your left hand is on your right side (towards Ethan).",
      "Step 3: Final Position - Ethan is sitting right next to you on that side. He is the Immediate Left."
    ]
  },
  { 
    id: 6, v: 'General', q: 'Who is to the right of Ben?', 
    options: ['Only Aanya', 'Aanya & Ethan', 'Aanya'], correct: 2,
    explanation: [
      "Step 1: Reference Point - Find Ben. He faces Towards you.",
      "Step 2: Direction Identification - Imagine yourself as Ben. Your right hand points towards Aanya.",
      "Step 3: Final Position - Aanya is the only person sitting in that direction. She is to the right of Ben."
    ]
  }
];

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function DirectionalLab() {
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
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Left and Immediate left</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => {setAppMode('practice'); setLevelIndex(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
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
    const currentPeople = appMode === 'concept' ? PEOPLE.slice(0, 4) : PEOPLE;

    return (
      <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] p-4 sm:p-6 md:p-8 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[380px] sm:min-h-[550px] shadow-inner overflow-hidden">
             
             <div className="w-full flex items-end justify-center py-12 px-1 sm:px-4 relative gap-2 sm:gap-6 lg:gap-10">
                
                {currentPeople.map((person, idx) => {
                  const isisPartOfPair = concept && (concept.refIndex === idx || concept.immediateIndex === idx || (Array.isArray(concept.generalIndex) ? concept.generalIndex.includes(idx) : concept.generalIndex === idx));
                  const isRef = concept && concept.refIndex === idx;
                  
                  // Arrows for Concept Mode
                  const isImmediateTarget = concept && concept.immediateIndex === idx;
                  const isGeneralTarget = concept && (Array.isArray(concept.generalIndex) ? concept.generalIndex.includes(idx) : concept.generalIndex === idx);

                  // Show arrow in gap
                  const showImmediateArrow = appMode === 'concept' && idx === Math.max(concept.refIndex, concept.immediateIndex);
                  const showGeneralArrow = appMode === 'concept' && isGeneralTarget;

                  return (
                    <React.Fragment key={person.id}>
                      {/* Immediate Arrow Indicator */}
                      {showImmediateArrow && (
                        <div className="flex flex-col items-center justify-center mb-36 z-30 pointer-events-none min-w-[50px] sm:min-w-[100px]">
                           <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                              <div className={`${concept.highlight === 'left' ? 'bg-cyan-600 border-cyan-400' : 'bg-orange-600 border-orange-400'} text-white text-[7px] sm:text-[9px] font-black px-3 py-1 rounded-full shadow-xl border-2 mb-1 uppercase tracking-tighter whitespace-nowrap`}>
                                IMMEDIATE {concept.highlight}
                              </div>
                              {concept.immediateIndex < concept.refIndex ? (
                                <ArrowLeft className={`${concept.highlight === 'left' ? 'text-cyan-400' : 'text-orange-400'} w-6 h-6 sm:w-12 sm:h-12`} />
                              ) : (
                                <ArrowRight className={`${concept.highlight === 'left' ? 'text-cyan-400' : 'text-orange-400'} w-6 h-6 sm:w-12 sm:h-12`} />
                              )}
                           </motion.div>
                        </div>
                      )}

                      <motion.div className="flex flex-col items-center shrink-0 relative">
                        {/* Facing Indicator */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                           <div className={`p-1.5 rounded-full border-2 ${person.facing === 'away' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500'}`}>
                             {person.facing === 'away' ? <MoveUp size={14} className="text-emerald-400" /> : <MoveDown size={14} className="text-rose-400" />}
                           </div>
                           <span className={`text-[6px] sm:text-[8px] font-black uppercase mt-1 ${person.facing === 'away' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {person.facing}
                           </span>
                        </div>

                        {/* General Direction Marker for Concept */}
                        {showGeneralArrow && (
                          <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-30">
                             <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                                <div className="bg-slate-700 text-white text-[6px] sm:text-[8px] px-2 py-0.5 rounded border border-slate-500 mb-1 uppercase">Also to the {concept.highlight}</div>
                                <div className="w-0.5 h-6 bg-slate-500 dashed" />
                             </motion.div>
                          </div>
                        )}

                        <div className={`relative transition-all duration-500 p-1 ${isisPartOfPair ? 'scale-105' : (appMode === 'concept' ? 'opacity-30 grayscale' : '')}`}>
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 sm:w-28 h-8 sm:h-16 bg-[#5d4037] rounded-t-xl border-t-4 border-x-4 border-black/20 z-20 shadow-2xl" />
                          
                          <div className="w-16 h-24 sm:w-32 sm:h-48 relative z-10 flex items-center justify-center overflow-hidden rounded-[1rem] sm:rounded-[1.5rem] border-2 border-white/10 bg-black/40 shadow-2xl ring-2 ring-black/10">
                             <img 
                                src={person.image} 
                                alt={person.name}
                                className="w-full h-full object-cover filter brightness-[0.95]"
                                onError={(e) => { e.target.src = `https://via.placeholder.com/300x450?text=${person.name}`; }}
                             />
                          </div>
                          {isRef && <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                        </div>
                        
                        <div className={`mt-6 px-3 py-0.5 rounded-full border-2 transition-all duration-500 ${isisPartOfPair ? 'bg-white/10 text-white border-white/30' : 'bg-black/20 text-[#a88a6d] border-transparent'}`}>
                          <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest">{person.name}</span>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
             </div>

             <div className="w-full mt-4 border-t border-white/5 pt-6 text-center px-4">
                <span className="text-[9px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic flex items-center justify-center gap-3">
                  <UserCheck size={16} className="text-emerald-500" /> Learn to distinguish between "Left" and "Immediate Left"!
                </span>
             </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[280px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        {appMode === 'concept' ? (
          <div className="w-full flex flex-col items-center relative z-10">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
               {CONCEPT_STEPS.map((step, idx) => (
                 <button key={step.id} onClick={() => setActiveTab(idx)}
                    className={`px-8 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                      ${activeTab === idx ? 'bg-[#2a1a16] text-yellow-400 border-black shadow-lg scale-110' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                   {step.title}
                 </button>
               ))}
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center w-full max-w-2xl px-4">
              <h3 className="text-[#2a1a16] text-xl sm:text-2xl font-black uppercase mb-4 flex items-center justify-center gap-3">
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
          <>
            <button onClick={() => setActiveTab(p => Math.max(0, p - 1))} disabled={activeTab === 0}
              className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 disabled:opacity-30 transition-all shadow-lg">
              Back
            </button>
            {activeTab < CONCEPT_STEPS.length - 1 ? (
              <button onClick={() => setActiveTab(p => p + 1)}
                className="flex-1 bg-[#2a1a16] text-[#e6dccb] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 transition-all shadow-lg">
                Next Rule
              </button>
            ) : (
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
                className="flex-1 bg-green-600 text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-green-800 animate-pulse active:translate-y-1 transition-all shadow-lg">
                Start Lab
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className="flex-1 bg-[#2a1a16] text-[#e6dccb] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 flex justify-center items-center gap-2 shadow-lg">
               <GraduationCap size={18} /> View Concept
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
        <div className="relative z-10 bg-white/60 p-6 rounded-3xl border-2 border-[#3e2723]/20 max-w-2xl mb-10 shadow-inner mx-4 text-center">
          <h2 className="text-lg sm:text-xl text-[#8d6e63] font-black uppercase mb-4 tracking-widest leading-tight">Module Summary</h2>
          <p className="text-[#3e2723] text-base sm:text-xl leading-relaxed font-black mb-6">
            "You have learned that 'Immediate' means the person right next to you, while 'General' direction means anyone sitting on that side!"
          </p>
        </div>
        <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/between')}  className="relative z-10 px-10 sm:px-16 py-4 sm:py-6 bg-[#3e2723] text-[#e6dccb] rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button>
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
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-2xl relative border-4 sm:border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden">
              <button onClick={() => setIsExplaining(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-1 sm:p-2 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={18} /></button>
              
              <h3 className="text-lg sm:text-2xl font-black text-[#3e2723] uppercase mb-4 sm:mb-8 flex items-center gap-3">
                <ArrowRightLeft size={24} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-1 flex flex-col gap-4">
                {mission.explanation.map((line, i) => {
                  const [header, ...detailParts] = line.split(" - ");
                  const detail = detailParts.join(" - ");
                  
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/50 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl border border-[#3e2723]/10"
                    >
                      <div className="bg-[#3e2723] p-3 sm:p-4 border-l-8 border-yellow-400">
                        <h4 className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-2">
                           {header}
                        </h4>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#dfd7cc]/30">
                        <p className="font-mono text-[#3e2723] text-[11px] sm:text-base leading-relaxed italic font-bold text-center">
                          {detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-6 py-4 sm:py-5 bg-[#3e2723] text-[#e6dccb] font-black rounded-xl sm:rounded-[2rem] uppercase tracking-widest text-[10px] sm:text-xs border-b-6 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
