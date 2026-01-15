import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  Users,
  Move,
  GraduationCap,
  MousePointer2,
  Trash2,
  Lightbulb,
  ArrowRightLeft,
  Play,
  RotateCcw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// Assets (Using placeholders for environment stability)
import AanyaBackPng from '../../../CommonUtility/Images/AanyaBack.png';
import BenBackPng from '../../../CommonUtility/Images/BenBack.png';
import ChintuBackPng from '../../../CommonUtility/Images/ChintuBack.png';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = [
  { id: 'p1', name: 'Aanya', image: AanyaBackPng },
  { id: 'p2', name: 'Ben', image: BenBackPng },
  { id: 'p3', name: 'Chintu', image: ChintuBackPng },
];

const MISSIONS = {
  concept: {
    title: "Learning Relative Positions",
    instructions: [
      "1. Aanya is sitting to the left of Ben",
      "2. Chintu is sitting to the immediate left of Ben"
    ],
    steps: [
      {
        personId: "p2",
        targetSlot: 1, 
        why: "What if we place Ben at Seat 2? Let's check...",
        highlightIns: -1,
        clearAll: true
      },
      {
        personId: "p3",
        targetSlot: 0, 
        why: "Chintu (Immediate Left) goes to Seat 1. But now where does Aanya go?",
        highlightIns: 1,
        clearAll: false
      },
      {
        personId: null,
        targetSlot: null,
        why: "Oh no! There is no room left on the left for Aanya. Let's move Ben.",
        highlightIns: 0,
        clearAll: true
      },
      {
        personId: "p2",
        targetSlot: 2, 
        why: "Let's place Ben at Seat 3. This gives us more room on his left side!",
        highlightIns: -1,
        clearAll: false
      },
      {
        personId: "p1",
        targetSlot: 1, 
        why: "Let's try Aanya at Seat 2. She IS to the left of Ben...",
        highlightIns: 0,
        clearAll: false
      },
      {
        personId: null,
        targetSlot: 1, 
        why: "Wait! Instruction 2 says Chintu is IMMEDIATELY left. Seat 2 belongs to him!",
        highlightIns: 1,
        clearAll: false,
        removeAt: 1
      },
      {
        personId: "p3",
        targetSlot: 1, 
        why: "So, Chintu must be in Seat 2 (Immediate Left of Ben).",
        highlightIns: 1,
        clearAll: false
      },
      {
        personId: "p1",
        targetSlot: 0, 
        why: "And Aanya takes the remaining spot in Seat 1. Now both rules are perfect!",
        highlightIns: 0,
        clearAll: false
      }
    ],
    questions: []
  },
  practice: [
    {
      id: "p1_mission",
      instructions: [
        "1. Aanya is sitting to the left of Ben",
        "2. Chintu is sitting to the immediate left of Ben"
      ],
      correctOrder: ['p1', 'p3', 'p2'], 
      questions: [
        { 
          q: "Who is sitting at the extreme left of the row?", 
          options: ["Aanya", "Ben", "Chintu"], 
          correct: 0,
          explanation: ["Aanya is in Seat 1, which is the 'Extreme Left' of this row."]
        },
        { 
          q: "Who is sitting to the immediate left of Ben?", 
          options: ["Aanya", "Chintu", "None"], 
          correct: 1,
          explanation: ["As per Instruction 2, Chintu is sitting right next to Ben on his left side (Seat 2)."]
        },
        { 
          q: "Who is sitting between Aanya and Ben?", 
          options: ["No one", "Chintu", "Diya"], 
          correct: 1,
          explanation: ["Chintu is in Seat 2, sitting right between Aanya and Ben."]
        }
      ]
    }
  ]
};

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function FollowInstruction() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  // State
  const [appMode, setAppMode] = useState('concept'); 
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPeople, setPlacedPeople] = useState([null, null, null]);
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  // Derived Mission Data
  const mission = (appMode === 'concept' ? MISSIONS.concept : MISSIONS.practice[levelIndex]) || MISSIONS.concept;

  // Cleanup helper
  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  // Navigation Logic
  const handleNext = useCallback(() => {
    clearAllTutorials();
    if (appMode === 'concept') {
      setAppMode('practice');
      setLevelIndex(0);
      setPlacedPeople([null, null, null]);
      return;
    }

    const currentMission = MISSIONS.practice[levelIndex];
    if (!currentMission) return;

    if (activeQuestionIndex < (currentMission.questions?.length || 0) - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      if (levelIndex < MISSIONS.practice.length - 1) {
        setLevelIndex(prev => prev + 1);
        setPlacedPeople([null, null, null]);
      } else {
        setSessionCompleted(true);
      }
    }
  }, [appMode, levelIndex, activeQuestionIndex, clearAllTutorials]);

  // Tutorial Engine
  const startTutorial = useCallback(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null]);
    setTutorialStep(0);
    
    const runStep = (idx) => {
      // Guard: Only run if we are still in concept mode
      if (!MISSIONS.concept.steps[idx]) return;
      
      const step = MISSIONS.concept.steps[idx];
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.highlightIns);

      const t1 = setTimeout(() => {
        setPlacedPeople(prev => {
          let next = step.clearAll ? [null, null, null] : [...prev];
          if (step.removeAt !== undefined) next[step.removeAt] = null;
          if (step.personId && step.targetSlot !== null) {
            next[step.targetSlot] = step.personId;
          }
          return next;
        });

        if (idx < MISSIONS.concept.steps.length - 1) {
          const t2 = setTimeout(() => runStep(idx + 1), 2500);
          tutorialTimeouts.current.push(t2);
          setTutorialStep(idx + 1);
        } else {
          setTutorialStep(MISSIONS.concept.steps.length - 1);
        }
      }, 1500);
      
      tutorialTimeouts.current.push(t1);
    };

    runStep(0);
  }, [clearAllTutorials]);

  // Validation
  useEffect(() => {
    if (appMode === 'practice') {
      const isCorrectArr = placedPeople.every((id, idx) => id === mission.correctOrder?.[idx]);
      setIsArrangementCorrect(isCorrectArr);
    } else {
      setIsArrangementCorrect(tutorialStep === (MISSIONS.concept.steps?.length || 0) - 1);
    }
  }, [placedPeople, mission, tutorialStep, appMode]);

  // Mode/Level Reset Sync
  useEffect(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null]);
    setTutorialStep(-1);
    setTutorialNarrative("");
    setHighlightedInstruction(-1);
    setActiveQuestionIndex(0);
    setAutoNextTimer(null);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsError(false);
  }, [appMode, levelIndex, clearAllTutorials]);

  // Timer
  useEffect(() => {
    let interval;
    if (autoNextTimer !== null && autoNextTimer > 0 && !isExplaining) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNext, isExplaining]);

  const handleDragEnd = (event, info, personId) => {
    if (appMode === 'concept') return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let targetSlotIndex = -1;

    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      if (dropPoint.x >= rect.left + scrollX && dropPoint.x <= rect.right + scrollX &&
          dropPoint.y >= rect.top + scrollY && dropPoint.y <= rect.bottom + scrollY) {
        targetSlotIndex = index;
      }
    });

    if (targetSlotIndex !== -1) {
      setPlacedPeople(prev => {
        const next = [...prev];
        const oldIndex = next.indexOf(personId);
        const targetExisting = next[targetSlotIndex];
        if (oldIndex !== -1) next[oldIndex] = targetExisting;
        next[targetSlotIndex] = personId;
        return next;
      });
    }
  };

  const handleAnswerSelect = (index) => {
    if (isCorrect) return;
    const currentQ = mission.questions?.[activeQuestionIndex];
    if (!currentQ) return;

    setSelectedOption(index);
    if (index === currentQ.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 600);
    }
  };

  const renderHeader = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Let us make user sit by following the instructions</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => setAppMode('concept')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept Building</button>
            <button onClick={() => setAppMode('practice')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>
    </div>
  );

  const renderBoard = () => (
    <div className="w-full max-w-5xl px-4 py-2">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <div className="relative z-10 bg-[#3e2723] pt-12 pb-12 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[620px] shadow-inner">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-8 py-5 rounded-[2rem] w-full max-w-2xl mb-8 shadow-2xl">
             <div className="flex justify-between items-center mb-4">
                <span className="text-yellow-400 font-black uppercase text-[10px] tracking-[0.2em]">Logic Rules</span>
                {appMode === 'concept' && tutorialStep === -1 && (
                  <button onClick={startTutorial} className="bg-yellow-400 text-[#2a1a16] px-4 py-1.5 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                    <Play size={12} fill="currentColor" /> Watch Logic Demo
                  </button>
                )}
             </div>
             <div className="flex flex-col gap-2">
                {(mission.instructions || []).map((ins, i) => (
                  <p key={i} className={`text-center text-sm sm:text-lg leading-tight italic transition-all duration-500
                    ${highlightedInstruction === i ? 'text-yellow-400 font-black scale-105 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-[#e6dccb] font-bold opacity-60'}`}>
                    {ins}
                  </p>
                ))}
             </div>
          </div>

          <AnimatePresence>
            {appMode === 'concept' && tutorialNarrative && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-cyan-500/90 text-white px-6 py-3 rounded-2xl text-xs sm:text-base font-black text-center max-w-md mb-6 shadow-xl border-b-4 border-cyan-700 relative"
              >
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-600 rotate-45" />
                {tutorialNarrative}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full flex items-end justify-center py-6 px-2 gap-4 sm:gap-12 relative">
            {placedPeople.map((id, idx) => {
              const person = id ? PEOPLE_DATA.find(p => p.id === id) : null;
              return (
                <div key={idx} className="flex flex-col items-center gap-4">
                  <div 
                    ref={el => slotRefs.current[idx] = el}
                    className={`relative w-20 h-32 sm:w-40 sm:h-60 rounded-[1.5rem] sm:rounded-[2.5rem] border-4 transition-all duration-500 flex items-center justify-center overflow-hidden
                      ${person ? 'border-yellow-400 bg-black/60 shadow-[0_0_30px_rgba(250,204,21,0.2)] scale-105' : 'border-dashed border-white/10 bg-white/5 shadow-inner'}`}
                  >
                    {person ? (
                      <motion.img layoutId={`person-${person.id}`} src={person.image} alt={person.name} className="w-full h-full object-cover pointer-events-none" />
                    ) : (
                      <div className="opacity-10"><Users size={48} className="text-white" /></div>
                    )}
                    {person && !isArrangementCorrect && appMode === 'practice' && (
                      <button onClick={() => setPlacedPeople(prev => {
                        const next = [...prev]; next[idx] = null; return next;
                      })} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full shadow-lg z-20"><Trash2 size={12} className="text-white" /></button>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xs">#{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PEOPLE POOL: Persistent logic implemented */}
          {(appMode === 'practice' || appMode === 'concept') && (
            <div className="mt-8 p-6 bg-black/30 rounded-[2.5rem] border border-white/10 w-full max-w-2xl flex flex-col items-center shadow-2xl transition-all">
              <span className="text-[10px] font-black text-[#a88a6d] uppercase tracking-[0.3em] mb-6">
                People Pool
              </span>
              <div className="flex gap-6 justify-center w-full">
                {PEOPLE_DATA.map(person => {
                  const isPlaced = placedPeople.includes(person.id);
                  // Disabled if arrangement is done OR it's concept mode tutorial
                  const isDisabledPool = isArrangementCorrect || isPlaced;

                  return (
                    <div key={person.id} className="relative w-16 h-24 sm:w-28 sm:h-40 shrink-0">
                      {/* Shadow Card - Always visible but grayscale if placed or mission done */}
                      <div className={`absolute inset-0 rounded-2xl border-2 overflow-hidden transition-all duration-300
                        ${isDisabledPool ? 'opacity-30 grayscale border-white/10' : 'opacity-10 border-transparent'}`}
                      >
                         <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                         <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1.5 border-t border-white/5">
                            <p className="text-white text-[8px] sm:text-[10px] font-black text-center uppercase tracking-tighter">{person.name}</p>
                         </div>
                      </div>
                      
                      {!isPlaced && !isArrangementCorrect && (
                        <motion.div 
                          layoutId={`person-${person.id}`}
                          drag={appMode === 'practice'}
                          dragConstraints={containerRef}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => handleDragEnd(e, info, person.id)}
                          whileDrag={{ scale: 1.1, zIndex: 100 }}
                          className={`absolute inset-0 rounded-2xl border-2 border-white/20 shadow-xl overflow-hidden bg-[#2a1a16] touch-none ${appMode === 'practice' ? 'cursor-grab' : 'cursor-default'}`}
                        >
                          <img src={person.image} alt={person.name} className="w-full h-full object-cover pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1.5 border-t border-white/5">
                            <p className="text-white text-[8px] sm:text-[10px] font-black text-center uppercase">{person.name}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isArrangementCorrect && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 flex flex-col items-center gap-4">
               <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-[2rem] border-2 border-green-500/50 shadow-2xl">
                  <CheckCircle2 className="text-green-500" size={24} />
                  <span className="text-green-400 font-black uppercase text-sm tracking-widest">
                    {appMode === 'concept' ? "Step-by-Step Logic Complete!" : "Perfect Seating! Solve below."}
                  </span>
               </div>
               {appMode === 'concept' && (
                 <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline underline-offset-4 decoration-white/20">
                   <RotateCcw size={14} /> Replay Demonstration
                 </button>
               )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );

  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 mb-24">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[3rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[250px]">
        <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        {!isArrangementCorrect ? (
          <div className="relative z-10 flex flex-col items-center text-center gap-4 py-8">
             <div className="w-20 h-20 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse shadow-inner">
               {appMode === 'concept' ? <GraduationCap size={40} /> : <Move size={40} />}
             </div>
             <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase tracking-tight">
               {appMode === 'concept' ? "Watch the Demo above" : "Arrange the row first"}
             </h2>
             <p className="text-[#3e2723]/60 font-bold max-w-sm italic">
               {appMode === 'concept' ? "We will show you exactly how to seat everyone." : "Unlock questions by seating characters correctly."}
             </p>
          </div>
        ) : (
          <div className="relative z-10 w-full text-center py-2">
            {mission.questions && mission.questions.length > 0 ? (
              <>
                <h2 className="text-[#3e2723] text-xl sm:text-4xl font-black uppercase mb-12 tracking-tight px-4 leading-tight">
                    {mission.questions[activeQuestionIndex]?.q}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl mx-auto px-4">
                  {(mission.questions[activeQuestionIndex]?.options || []).map((option, idx) => {
                    const isCurrentSelected = selectedOption === idx;
                    const buttonClass = isCurrentSelected && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-green-200' : 
                                      isCurrentSelected && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 
                                      'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                    return (
                      <button key={idx} onClick={() => handleAnswerSelect(idx)}
                        className={`group relative p-6 sm:p-8 rounded-[2rem] border-b-8 shadow-lg font-black text-xl sm:text-2xl transition-all ${buttonClass}`}
                      >
                        {option}
                        {isCurrentSelected && isCorrect && <CheckCircle2 className="absolute top-2 right-2 opacity-40" size={20} />}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-8">
                 <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-6 tracking-tight">Demo Complete!</h2>
                 <p className="text-[#3e2723]/60 font-bold mb-8 italic max-w-lg mx-auto">Ready to try the practice challenge on your own?</p>
                 <button onClick={() => setAppMode('practice')} className="bg-[#2a1a16] text-[#e6dccb] px-12 py-5 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all">
                    Start Challenge <ChevronRight size={20} />
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderFooter = () => (
    <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
       <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect}
         className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2
           ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
         <Lightbulb size={18} /> View Logic
       </button>
       <button onClick={handleNext} 
         className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2
           ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>
         {autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Skip to Challenge' : 'Skip Mission')}
         <ChevronRight size={18} />
       </button>
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb] relative">
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce" />
        </div>
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Arrangement Master!</h1>
        <div className="relative z-10 bg-white/60 p-10 rounded-[3.5rem] border-4 border-[#3e2723]/20 max-w-2xl mb-10 shadow-2xl mx-4 backdrop-blur-sm font-black text-lg">
           "You followed every instruction perfectly! Spatial logic is your strength."
        </div>
        <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="relative z-10 px-16 py-7 bg-[#3e2723] text-[#e6dccb] rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 transition-all active:translate-y-2">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="absolute inset-0 bg-[#3e2723] pointer-events-none opacity-[0.03]" />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {renderHeader()}
        {renderBoard()}
        {renderActionArea()}
        {renderFooter()}
      </div>

      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#dfd7cc] rounded-[3.5rem] p-8 sm:p-14 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-center">
              <button onClick={() => setIsExplaining(false)} className="absolute top-8 right-8 p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90"><CloseIcon size={24} /></button>
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-10 flex items-center justify-center gap-5"><ArrowRightLeft size={40} className="text-[#8d6e63]" /> Solution Logic</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 text-left">
                {(mission.questions?.[activeQuestionIndex]?.explanation || (appMode === 'concept' ? mission.steps.map(s => s.why) : mission.explanation) || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-8 rounded-[2rem] border-l-[16px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-xl leading-relaxed font-black italic">"{line}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full mt-10 py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2.5rem] uppercase border-b-8 border-black text-lg tracking-widest shadow-2xl active:translate-y-1 transition-all">Understood!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}