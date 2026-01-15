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
  Users,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  MousePointer2
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';
import AanyaBackPng from '../../../CommonUtility/Images/AanyaBack.png';
import BenBackPng from '../../../CommonUtility/Images/BenBack.png';
import ChintuBackPng from '../../../CommonUtility/Images/ChintuBack.png';
import DiyaBackPng from '../../../CommonUtility/Images/DiyaBack.png';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
// REPLACE THE 'image' URLS BELOW WITH YOUR ACTUAL IMAGE PATHS
const PEOPLE = [
  { id: 'p1', name: 'Aanya', image: AanyaBackPng, pos: '1st' },
  { id: 'p2', name: 'Ben', image: BenBackPng, pos: '2nd' },
  { id: 'p3', name: 'Chintu', image: ChintuBackPng, pos: '3rd' },
  { id: 'p4', name: 'Diya', image: DiyaBackPng, pos: '4th' },
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Step 1",
    title: "Understanding LEFT",
    desc: "Aanya is sitting to the left of Ben. Look at the cyan arrow between them pointing to the left side!",
    highlight: 'left',
    pair: [0, 1] // Aanya and Ben
  },
  {
    id: 1,
    label: "Step 2",
    title: "Understanding RIGHT",
    desc: "Diya is sitting to the right of Chintu. Look at the orange arrow between them pointing to the right side!",
    highlight: 'right',
    pair: [2, 3] // Chintu and Diya
  }
];

const MISSIONS = [
  { 
    id: 1, v: 'Left', q: 'Who is sitting to the LEFT of Ben?', 
    options: ['Aanya', 'Chintu', 'Diya'], correct: 0,
    explanation: [
      "Step 1: Reference Point - First, find Ben in the arrangement. He is the 2nd person in the line.",
      "Step 2: Direction Identification - Look at the person sitting on the left side of Ben.",
      "Step 3: Final Position - Aanya is the person in that spot. So, Aanya is to the left of Ben."
    ]
  },
  { 
    id: 2, v: 'Right', q: 'Who is sitting to the RIGHT of Chintu?', 
    options: ['Aanya', 'Ben', 'Diya'], correct: 2,
    explanation: [
      "Step 1: Reference Point - Locate Chintu in the arrangement (he is the 3rd person).",
      "Step 2: Direction Identification - Look at the person sitting on the right side of Chintu.",
      "Step 3: Final Position - Diya is sitting in that spot. So, Diya is to the right of Chintu."
    ]
  },
  { 
    id: 3, v: 'Leftmost', q: 'Who is the LEFTMOST person in the line?', 
    options: ['Diya', 'Aanya', 'Ben'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Look at the entire row of people from start to finish.",
      "Step 2: Direction Identification - Find the very first person on the far left end.",
      "Step 3: Final Position - Aanya is the first person on the left. She is the leftmost."
    ]
  },
  { 
    id: 4, v: 'Right', q: 'Who is sitting to the RIGHT of Ben?', 
    options: ['Aanya', 'Chintu', 'Diya'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Find Ben in his seat.",
      "Step 2: Direction Identification - Move one position toward the right side of the arrangement.",
      "Step 3: Final Position - Chintu is sitting right next to Ben on his right side."
    ]
  },
  { 
    id: 5, v: 'Left', q: 'Who is to the immediate LEFT of Diya?', 
    options: ['Chintu', 'Ben', 'Aanya'], correct: 0,
    explanation: [
      "Step 1: Reference Point - Find Diya at the far right end of the line.",
      "Step 2: Direction Identification - Look at the person sitting just before her on the left.",
      "Step 3: Final Position - Chintu is the person sitting to her left."
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

  // --- Handlers ---
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

  // DIV 1: HEADER
  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full lg:w-auto">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Direction Laboratory</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept Mode</button>
            <button onClick={() => {setAppMode('practice'); setLevelIndex(0);}} className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice Lab</button>
          </div>
        </div>
      </header>
    </div>
  );

  // PROGRESS BAR
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

  // DIV 2: MAHOGANY BOARD (SITTING ARRANGEMENT)
  const renderBoardDiv = () => {
    const concept = appMode === 'concept' ? CONCEPT_STEPS[activeTab] : null;

    return (
      <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-3 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] p-4 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[450px] shadow-inner overflow-hidden">
             
             {/* THE ARRANGEMENT CONTAINER */}
             <div className="w-full flex items-end justify-center overflow-x-auto no-scrollbar py-16 px-4">
                
                {PEOPLE.map((person, idx) => {
                  const isPartOfPair = concept && concept.pair.includes(idx);
                  const isRef = concept && concept.pair[1] === idx;
                  const isTarget = concept && concept.pair[0] === idx;

                  return (
                    <React.Fragment key={person.id}>
                      {/* Relationship Tag BETWEEN People (Only for Concept Mode) */}
                      {appMode === 'concept' && idx > 0 && (
                        <div className="flex flex-col items-center justify-center mx-1 sm:mx-4 mb-20">
                           {activeTab === 0 && idx === 1 && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }} 
                               animate={{ opacity: 1, y: 0 }} 
                               className="flex flex-col items-center"
                             >
                                <div className="bg-cyan-500 text-white text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-cyan-400 mb-2">LEFT</div>
                                <ArrowLeft className="text-cyan-400 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-glow" />
                             </motion.div>
                           )}
                           {activeTab === 1 && idx === 3 && (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }} 
                               animate={{ opacity: 1, y: 0 }} 
                               className="flex flex-col items-center"
                             >
                                <div className="bg-orange-500 text-white text-[8px] sm:text-[10px] font-black px-2 py-1 rounded-md shadow-lg border border-orange-400 mb-2">RIGHT</div>
                                <ArrowRight className="text-orange-400 w-6 h-6 sm:w-8 sm:h-8 drop-shadow-glow" />
                             </motion.div>
                           )}
                        </div>
                      )}

                      {/* THE PERSON COMPONENT */}
                      <motion.div 
                        className="flex flex-col items-center shrink-0 relative"
                      >
                        <div className={`relative transition-all duration-500 p-2 
                          ${isPartOfPair ? 'scale-110' : 'opacity-40 grayscale-[0.5]'}
                        `}>
                          {/* Bench Back - LAYERED IN FRONT (z-20) */}
                          {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 sm:w-24 h-10 sm:h-16 bg-[#ead9d3] rounded-t-xl border-t-4 border-x-4 border-black/20 z-20 shadow-lg" /> */}
                          
                          {/* Image Placeholder (z-10) */}
                          <div className="w-16 h-24 sm:w-32 sm:h-44 relative z-10 flex items-center justify-center overflow-hidden rounded-xl border-2 border-white/5">
                             <img 
                                src={person.image} 
                                alt={`${person.name} back view`}
                                className="w-full h-full object-cover filter brightness-[0.9]"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Back+View'; }}
                             />
                          </div>

                          {/* GLO INDICATORS */}
                          {isRef && <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                          {isTarget && (
                            <div className={`absolute inset-0 blur-3xl rounded-full z-0 animate-pulse ${activeTab === 0 ? 'bg-cyan-400/30' : 'bg-orange-400/30'}`} />
                          )}
                        </div>
                        
                        <div className={`mt-8 px-3 sm:px-4 py-1 sm:py-2 rounded-full border transition-all duration-500
                          ${isPartOfPair ? 'bg-white/10 text-[#fef3c7] border-white/20' : 'bg-black/20 text-[#a88a6d] border-transparent'}
                        `}>
                          <span className="text-[9px] sm:text-xs font-black uppercase tracking-widest">{person.name}</span>
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
             </div>

             <div className="w-full mt-4 border-t border-white/5 pt-6 text-center px-4">
                <span className="text-[10px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic flex items-center justify-center gap-3">
                  <UserCheck size={16} className="text-emerald-500 shrink-0" /> Characters are facing away from you (facing the arrangement)
                </span>
             </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // DIV 3: INTERACTIVE PANEL
  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[280px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        {appMode === 'concept' ? (
          <div className="w-full flex flex-col items-center relative z-10">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
               {CONCEPT_STEPS.map((step, idx) => (
                 <button key={step.id} onClick={() => setActiveTab(idx)}
                    className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                      ${activeTab === idx ? 'bg-[#2a1a16] text-yellow-400 border-black shadow-lg scale-110' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                   {step.label}: {step.title}
                 </button>
               ))}
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center w-full max-w-2xl px-4">
              <h3 className="text-[#2a1a16] text-xl sm:text-2xl font-black uppercase mb-4 flex items-center justify-center gap-3">
                <GraduationCap size={28} className="text-orange-600" /> {CONCEPT_STEPS[activeTab].title}
              </h3>
              <p className="text-[#3e2723] text-lg sm:text-2xl font-bold leading-relaxed mb-4 italic">
                "{CONCEPT_STEPS[activeTab].desc}"
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-[#3e2723]/10 px-4 py-2 rounded-xl">
                <MousePointer2 size={16} className="text-[#3e2723]" />
                <span className="text-xs font-black uppercase text-[#3e2723]">Check the directional arrows above</span>
              </div>
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
                  className={`group relative p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-b-8 font-black text-xl sm:text-3xl transition-all
                    ${selectedOption === idx && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg' : 
                      selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                      'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 hover:scale-[1.03] active:translate-y-1 shadow-sm'}`}>
                  {option}
                  {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/40" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // DIV 4: CONTROL FOOTER
  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-20 sm:pb-24 flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                Enter Practice Lab
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
            <button 
              onClick={() => setIsExplaining(true)} 
              disabled={selectedOption === null}
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
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Direction Master!</h1>
        <div className="relative z-10 bg-white/60 p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl border-2 border-[#3e2723]/20 max-w-2xl mb-10 shadow-inner mx-4">
          <h2 className="text-lg sm:text-xl text-[#8d6e63] font-black uppercase mb-4 tracking-widest leading-tight text-center">Module Summary</h2>
          <p className="text-[#3e2723] text-base sm:text-xl leading-relaxed font-black mb-6 text-center">
            "Left and Right help us identify everyone's position in a line!"
          </p>
          <div className="h-1 w-20 bg-[#3e2723]/10 mx-auto my-4 sm:my-6" />
          <p className="text-xs sm:text-sm text-[#5d4037] italic leading-relaxed text-center">
            You have correctly mastered directional positioning in a linear arrangement.
          </p>
        </div>
        <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/leftRightWithDiffDirection')} className="relative z-10 px-10 sm:px-16 py-4 sm:py-6 bg-[#3e2723] text-[#e6dccb] rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
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
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/50 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl border border-[#3e2723]/10"
                    >
                      <div className="bg-[#3e2723] p-3 sm:p-4 border-l-8 border-yellow-400">
                        <h4 className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-2">
                           {header}
                        </h4>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#dfd7cc]/30">
                        <p className="font-mono text-[#3e2723] text-[11px] sm:text-base leading-relaxed italic">
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