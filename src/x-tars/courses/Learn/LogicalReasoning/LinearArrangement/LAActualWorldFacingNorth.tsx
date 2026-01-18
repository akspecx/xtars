import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  GraduationCap,
  Trash2,
  Lightbulb,
  ArrowRightLeft,
  Play,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  Search,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Compass,
  Navigation
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  p1: { name: 'Aanya', initial: 'A', color: 'from-rose-400 to-rose-600', border: 'border-rose-300', ring: 'ring-rose-500/30' },
  p2: { name: 'Ben', initial: 'B', color: 'from-sky-400 to-sky-600', border: 'border-sky-300', ring: 'ring-sky-500/30' },
  p3: { name: 'Chintu', initial: 'C', color: 'from-amber-400 to-amber-600', border: 'border-amber-300', ring: 'ring-amber-500/30' },
  p4: { name: 'Diya', initial: 'D', color: 'from-emerald-400 to-emerald-600', border: 'border-emerald-300', ring: 'ring-emerald-500/30' },
  p5: { name: 'Ethan', initial: 'E', color: 'from-purple-400 to-purple-600', border: 'border-purple-300', ring: 'ring-purple-500/30' },
};

const PEOPLE_IDS = ['p1', 'p2', 'p3', 'p4', 'p5'];

const MISSIONS = {
  concept: {
    title: "Linear Directional Logic",
    mainHeader: "5 persons A, B, C, D, and E are sitting in a row facing North",
    note: "Deduction Strategy: We start with the corner anchor (E) and follow the 'string' of neighbors one by one.",
    instructions: [
      "1. D is on the left of C.",
      "2. B is on the right of E.",
      "3. A is on the right of C.",
      "4. B is on the left of D.",
      "5. E occupies a corner."
    ],
    requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    correctLayout: [
      { id: 'p5', facing: 'away' },    // E at 1
      { id: 'p2', facing: 'away' },    // B at 2
      { id: 'p4', facing: 'away' },    // D at 3
      { id: 'p3', facing: 'away' },    // C at 4
      { id: 'p1', facing: 'away' },    // A at 5
    ],
    steps: [
      { personId: "p5", slot: 0, facing: "away", why: "Step 1: Anchor found. Clue 5 places E at the corner (Slot 1).", ins: 4, done: [] },
      { why: "Step 2: Connect to E. Clue 2 says B is on the right of E. Since we face North, Right points to Slot 2.", ins: 1, done: [4] },
      { personId: "p2", slot: 1, facing: "away", why: "B takes Slot 2, satisfying Clue 2.", ins: 1, done: [4] },
      { why: "Step 3: Connect to B. Clue 4 says B is on the left of D.", ins: 3, done: [4, 1] },
      { personId: "p4", slot: 2, facing: "away", why: "For B(2) to be left of someone, D must be at Slot 3.", ins: 3, done: [4, 1] },
      { why: "Step 4: Connect to D. Clue 1 says D is on the left of C.", ins: 0, done: [4, 1, 3] },
      { personId: "p3", slot: 3, facing: "away", why: "For D(3) to be left of someone, C must be at Slot 4.", ins: 0, done: [4, 1, 3] },
      { why: "Step 5: Final Person. Clue 3 says A is on the right of C.", ins: 2, done: [4, 1, 3, 0] },
      { personId: "p1", slot: 4, facing: "away", why: "A takes the final corner at Slot 5, satisfying the row.", ins: 2, done: [4, 1, 3, 0] },
      { why: "Logic Complete! Sequence E-B-D-C-A solves all directional constraints.", isComplete: true, done: [4, 1, 3, 0, 2] }
    ]
  },
  practice: [
    {
      id: "extreme_practice_directional",
      mainHeader: "5 persons A, B, C, D, and E are sitting in a row facing North",
      requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
      note: "Standard Perspective: Facing North (↑) means Left is toward lower slots and Right is toward higher slots.",
      instructions: [
        "1. Everyone is facing NORTH (↑).",
        "2. Ethan (E) is at an EXTREME END.",
        "3. Aanya (A) is to the IMMEDIATE LEFT of Ethan (E).",
        "4. Ben (B) is exactly BETWEEN Aanya (A) and Diya (D).",
        "5. Chintu (C) is at the OTHER EXTREME END."
      ],
      correctLayout: [
        { id: 'p3', facing: 'away' },    // C (1)
        { id: 'p4', facing: 'away' },    // D (2)
        { id: 'p2', facing: 'away' },    // B (3)
        { id: 'p1', facing: 'away' },    // A (4)
        { id: 'p5', facing: 'away' },    // E (5)
      ],
      explanation: [
        "1. Ethan at End: If Ethan is at 1 and faces North, his Left points to nothing. So Ethan MUST be at Slot 5.",
        "2. Aanya: To the Immediate Left of Ethan(5) facing North is Slot 4.",
        "3. Ben & Diya: Ben is between Aanya(4) and Diya. This forces Ben to Slot 3 and Diya to Slot 2.",
        "4. Chintu: Occupies the remaining extreme corner at Slot 1."
      ],
      questions: [
        { 
          q: "If Ethan (E) is at an extreme end and Aanya (A) is to his IMMEDIATE LEFT, which slot must Ethan be in?", 
          options: ["Slot 1", "Slot 5"], 
          correct: 1,
          explanation: ["Facing North (Away), your Left arm points to lower slot numbers. For there to be a slot (Slot 4) to Ethan's left, Ethan must be at the right-most end, Slot 5."]
        },
        { 
          q: "What direction does the Green Arrow (↑) indicate?", 
          options: ["Facing North (Away)", "Facing South (Towards)"], 
          correct: 0,
          explanation: ["Green Up Arrow (↑) represents North or Facing Away from the observer."]
        },
        { 
          q: "Who is the anchor at the far LEFT extreme (Slot 1)?", 
          options: ["Chintu (C)", "Ethan (E)", "Diya (D)"], 
          correct: 0,
          explanation: ["With Ethan at 5 and the chain filling slots 2-4, Chintu takes the other end at Slot 1."]
        },
        { 
          q: "Is Ben (B) sitting to the Immediate Left or Immediate Right of Aanya (A)?", 
          options: ["Immediate Left", "Immediate Right"], 
          correct: 0,
          explanation: ["In the chain C(1)-D(2)-B(3)-A(4)-E(5), Ben is to the left of Aanya."]
        }
      ]
    }
  ]
};

export default function LAActualFacingNorth() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept'); 
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPeople, setPlacedPeople] = useState([null, null, null, null, null]);
  const [peopleFacings, setPeopleFacings] = useState(['away', 'away', 'away', 'away', 'away']);
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  const [userCheckedInstructions, setUserCheckedInstructions] = useState([false, false, false, false, false]);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [tutorialDoneIns, setTutorialDoneIns] = useState([]);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const mission = (appMode === 'concept' ? MISSIONS.concept : MISSIONS.practice[levelIndex]) || MISSIONS.concept;

  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  useEffect(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setPeopleFacings(['away', 'away', 'away', 'away', 'away']);
    setTutorialStep(-1);
    setTutorialNarrative("");
    setHighlightedInstruction(-1);
    setTutorialDoneIns([]);
    setIsTutorialComplete(false);
    setActiveQuestionIndex(0);
    setAutoNextTimer(null);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsError(false);
    setUserCheckedInstructions([false, false, false, false, false]);
  }, [appMode, levelIndex, clearAllTutorials]);

  useEffect(() => {
    if (appMode === 'practice') {
      const isCorrectArr = mission.correctLayout.every((layout, idx) => {
        return placedPeople[idx] === layout.id && peopleFacings[idx] === layout.facing;
      });
      setIsArrangementCorrect(isCorrectArr);
    } else {
      setIsArrangementCorrect(isTutorialComplete); 
    }
  }, [placedPeople, peopleFacings, mission, isTutorialComplete, appMode]);

  const handleNext = useCallback(() => {
    clearAllTutorials();
    if (appMode === 'concept') {
      setAppMode('practice');
      setLevelIndex(0);
      return;
    }
    const currentMission = MISSIONS.practice[levelIndex];
    if (activeQuestionIndex < (currentMission.questions?.length || 0) - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      if (levelIndex < MISSIONS.practice.length - 1) {
        setLevelIndex(prev => prev + 1);
      } else {
        setSessionCompleted(true);
      }
    }
  }, [appMode, levelIndex, activeQuestionIndex, clearAllTutorials]);

  const handleAnswerSelect = useCallback((index) => {
    if (isCorrect) return;
    const currentQ = mission.questions?.[activeQuestionIndex];
    if (!currentQ) return;
    setSelectedOption(index);
    if (index === currentQ.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(8);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 600);
    }
  }, [isCorrect, mission, activeQuestionIndex]);

  useEffect(() => {
    let interval;
    if (autoNextTimer !== null && autoNextTimer > 0 && !isExplaining) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNext, isExplaining]);

  const toggleDirection = (idx) => {
    if (isArrangementCorrect || appMode === 'concept') return;
    setPeopleFacings(prev => {
      const next = [...prev];
      next[idx] = next[idx] === 'away' ? 'towards' : 'away';
      return next;
    });
  };

  const startTutorial = useCallback(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setPeopleFacings(['away', 'away', 'away', 'away', 'away']);
    setTutorialStep(0);
    setTutorialDoneIns([]);
    setIsTutorialComplete(false);
    
    const runStep = (idx) => {
      if (!MISSIONS.concept.steps[idx]) return;
      const step = MISSIONS.concept.steps[idx];
      
      setTutorialStep(idx);
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.ins);
      setTutorialDoneIns(step.done || []);
      
      const t1 = setTimeout(() => {
        if (step.personId) {
          setPlacedPeople(prev => { const n = [...prev]; n[step.slot] = step.personId; return n; });
        }
        if (step.facing) {
          setPeopleFacings(prev => { const n = [...prev]; n[step.slot] = step.facing; return n; });
        }
        
        if (step.isComplete) {
          setIsTutorialComplete(true);
          return;
        }

        const t2 = setTimeout(() => {
          if (idx < MISSIONS.concept.steps.length - 1) {
            runStep(idx + 1);
          }
        }, 7500); 
        tutorialTimeouts.current.push(t2);
      }, 3500); 
      tutorialTimeouts.current.push(t1);
    };
    runStep(0);
  }, [clearAllTutorials]);

  const handleDragEnd = (event, info, personId) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
    
    const dropPoint = { x: info.point.x, y: info.point.y };
    let targetIdx = -1;
    let minDistance = 1000;
    
    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.pageYOffset || window.scrollY;
      
      const slotCenterX = rect.left + scrollX + rect.width / 2;
      const slotCenterY = rect.top + scrollY + rect.height / 2;
      
      const dist = Math.sqrt(
        Math.pow(dropPoint.x - slotCenterX, 2) + 
        Math.pow(dropPoint.y - slotCenterY, 2)
      );

      if (dist < 60 && dist < minDistance) {
        minDistance = dist;
        targetIdx = index;
      }
    });

    if (targetIdx !== -1) {
      setPlacedPeople(prev => {
         const next = [...prev];
         const existingIdx = next.findIndex(p => p === personId);
         if (existingIdx !== -1) next[existingIdx] = null;
         next[targetIdx] = personId;
         return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      {/* HEADER */}
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-left">
              <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
                <ChevronLeft size={16} /> Dashboard
              </button>
              <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none text-shadow-sm">Poeple are facing north</h1>
            </div>
            <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
              <button onClick={() => setAppMode('concept')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept Building</button>
              <button onClick={() => setAppMode('practice')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
            </div>
          </div>
        </header>
      </div>

      {/* BOARD */}
      <div className="w-full max-w-6xl px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-2 sm:px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[600px] shadow-inner overflow-visible">
            
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="mb-6 p-4 bg-white/5 rounded-2xl border-l-4 border-yellow-400">
                  <h2 className="text-white text-sm sm:text-lg font-black uppercase tracking-tight leading-tight">
                    {mission.mainHeader}
                  </h2>
               </div>

               <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Navigation size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs tracking-[0.2em]">Logical Reasoning</span>
                  </div>
                  {appMode === 'concept' && tutorialStep === -1 && (
                    <button onClick={startTutorial} className="bg-yellow-400 text-[#2a1a16] px-4 py-1.5 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl">
                      <Play size={12} fill="currentColor" /> Watch Solution
                    </button>
                  )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepDone = appMode === 'practice' ? userCheckedInstructions[i] : tutorialDoneIns.includes(i);
                    const isHighlight = appMode === 'concept' && highlightedInstruction === i;
                    return (
                      <button key={i} onClick={() => setUserCheckedInstructions(prev => { const n = [...prev]; n[i] = !n[i]; return n; })} disabled={appMode === 'concept'}
                        className={`flex items-start text-left gap-3 p-2.5 rounded-xl transition-all duration-500 border-2
                        ${isHighlight ? 'bg-yellow-400/10 border-yellow-400 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)] z-10' : isStepDone ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                      >
                        {isStepDone ? <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> : <Square size={16} className="text-white/20 mt-0.5" />}
                        <p className={`text-[10px] sm:text-[12px] font-bold leading-tight ${isStepDone ? 'text-green-400' : isHighlight ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>
                          {ins}
                        </p>
                      </button>
                    );
                  })}
               </div>
            </div>

            <div className="w-full max-w-3xl px-4 mb-4 text-center">
               <div className="bg-amber-900/40 border border-amber-500/30 p-2.5 rounded-xl inline-flex items-center gap-3 shadow-xl">
                  <AlertCircle size={18} className="text-amber-400 shrink-0" />
                  <p className="text-amber-200 text-[9px] sm:text-[11px] font-bold italic leading-tight">{mission.note}</p>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialNarrative && (
                <motion.div key={tutorialNarrative} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`${isTutorialComplete ? 'bg-green-600 ring-green-400/20 shadow-green-500/20' : 'bg-cyan-600 ring-cyan-400/20 shadow-cyan-500/20'} text-white px-6 sm:px-8 py-4 sm:py-5 rounded-[2rem] text-xs sm:text-sm font-black text-center max-w-xl mb-6 shadow-2xl border-b-4 border-black/40 relative ring-4 transition-all`}
                >
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 ${isTutorialComplete ? 'bg-green-600' : 'bg-cyan-600'} rotate-45 transition-all`} />
                  <span className="flex items-center justify-center gap-2 text-[9px] opacity-70 mb-1 uppercase tracking-widest"><Search size={12}/> Logical Reasoning Walkthrough</span>
                  {tutorialNarrative}
                </motion.div>
              )}
            </AnimatePresence>

            {/* THE LINE & CIRCULAR SLOTS */}
            <div className="w-full flex items-end justify-center py-10 px-2 gap-3 sm:gap-14 relative mb-6 overflow-visible">
              <div className="absolute bottom-[3.5rem] sm:bottom-[4.5rem] left-[5%] right-[5%] h-1.5 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0 rounded-full" />
              
              {placedPeople.map((id, idx) => {
                const person = id ? PEOPLE_DATA[id] : null;
                const facing = peopleFacings[idx];
                const isTutoTarget = appMode === 'concept' && tutorialStep !== -1 && (
                   idx === MISSIONS.concept.steps[tutorialStep]?.slot
                );

                return (
                  <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
                    <div 
                      ref={el => slotRefs.current[idx] = el}
                      className={`relative w-14 h-14 sm:w-28 sm:h-28 rounded-full border-4 transition-all duration-500 flex items-center justify-center
                        ${person ? `bg-gradient-to-br ${person.color} border-white ring-4 sm:ring-8 ring-black/20 scale-110 shadow-2xl` : 'border-dashed border-white/10 bg-[#2a1a16]/50 shadow-inner'}
                        ${isTutoTarget ? 'ring-4 ring-yellow-400 ring-offset-4 sm:ring-offset-8 ring-offset-[#3e2723] scale-125 z-20' : ''}`}
                    >
                      {person ? (
                        <div className="flex flex-col items-center justify-center relative w-full h-full">
                          <span className="text-white font-black text-2xl sm:text-4xl drop-shadow-lg select-none">{person.initial}</span>
                          
                          <button 
                            onClick={() => toggleDirection(idx)}
                            className={`absolute -top-10 sm:-top-16 p-1.5 sm:p-2.5 rounded-full border-2 transition-all hover:scale-110 active:scale-95 shadow-xl group
                              ${facing === 'away' ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-rose-600 border-rose-300 text-white'}`}
                          >
                             {facing === 'away' ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
                             <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-[8px] px-2 py-0.5 rounded uppercase font-black transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {facing === 'away' ? 'North ↑' : 'South ↓'}
                             </span>
                             {!isArrangementCorrect && appMode !== 'concept' && (
                               <div className="absolute -right-1 -top-1 bg-white p-1 rounded-full text-[#2a1a16] border border-black/20 shadow-lg">
                                  <RefreshCw size={8} className="animate-spin-slow" />
                               </div>
                             )}
                          </button>

                          {!isArrangementCorrect && appMode !== 'concept' && (
                            <button onClick={() => {
                                setPlacedPeople(prev => { const n = [...prev]; n[idx] = null; return n; });
                            }} className="absolute -bottom-4 bg-red-600 p-1.5 rounded-full z-20 shadow-lg border-2 border-white text-white hover:scale-110 transition-transform"><Trash2 size={10}/></button>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center opacity-30 select-none">
                          <span className="text-white font-black text-[10px]">#{idx+1}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`w-8 sm:w-12 h-1.5 rounded-full transition-colors ${person ? 'bg-white shadow-[0_0_15px_white]' : 'bg-white/5'}`} />

                    <div className="h-6 mt-1">
                        <div className={`px-3 py-0.5 rounded-full border-2 text-[7px] sm:text-[9px] font-black uppercase transition-all
                            ${!person ? 'bg-black/20 border-white/5 text-white/10' : 
                              facing === 'away' ? 'bg-[#3e2723] border-white/20 text-white shadow-emerald-500/20' : 'bg-white border-black/20 text-black shadow-lg shadow-rose-500/10'}`}>
                           {facing ? (facing === 'away' ? 'North ↑' : 'South ↓') : 'Empty'}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COMPASS & LEGEND ROW */}
            <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-6 px-4 mb-4">
                <div className="flex items-center gap-4 bg-black/30 p-3 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="relative w-14 h-14 bg-black/40 rounded-full border-2 border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
                        <div className="absolute top-1 text-[7px] font-black text-emerald-400">N</div>
                        <div className="absolute bottom-1 text-[7px] font-black text-rose-400">S</div>
                        <div className="w-0.5 h-8 bg-emerald-400 absolute top-1 rounded-full transform origin-bottom animate-pulse" />
                        <Compass className="text-white/40 animate-spin-slow" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#a88a6d]">Logical Compass</span>
                      <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">Cardinal Perspective</p>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                   <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                     <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center border border-emerald-300 shadow-md"><ArrowUp size={12} className="text-white" /></div>
                     <span className="text-[8px] sm:text-[10px] font-black text-[#a88a6d] uppercase tracking-widest">Green Arrow Away = Facing North</span>
                   </div>
                   <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                     <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center border border-rose-300 shadow-md"><ArrowDown size={12} className="text-white" /></div>
                     <span className="text-[8px] sm:text-[10px] font-black text-[#a88a6d] uppercase tracking-widest">Red Arrow Towards = Facing South</span>
                   </div>
                </div>
            </div>

            {/* REFERENCE POOL */}
            <div className="mt-2 p-6 sm:p-8 bg-black/40 rounded-[3rem] sm:rounded-[3.5rem] border border-white/20 w-full max-w-5xl flex flex-col items-center shadow-2xl relative overflow-visible">
               <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[3rem]" />
              
              <div className="flex flex-col items-center mb-6 relative z-10">
                <span className="text-[11px] sm:text-[13px] font-black text-yellow-400 uppercase tracking-[0.6em] text-center drop-shadow-sm">Character Selection</span>
                <p className="text-[#a88a6d] text-[8px] sm:text-[10px] uppercase font-black tracking-widest mt-1">Select and place characters on seats</p>
              </div>

              <div className="w-full relative z-10">
                <div className="flex flex-wrap gap-4 sm:gap-12 justify-center">
                  {PEOPLE_IDS.map((id) => {
                    const person = PEOPLE_DATA[id];
                    const isItemPlaced = placedPeople.includes(id);
                    
                    return (
                      <div key={id} className="relative w-16 h-16 sm:w-24 sm:h-24">
                        <div className={`absolute inset-0 rounded-full border-2 border-white/5 flex items-center justify-center transition-all duration-300
                          ${isItemPlaced ? 'opacity-20 grayscale border-dashed scale-90' : 'opacity-0'}`}>
                           <span className="text-white font-black text-lg">{person.initial}</span>
                        </div>
                        
                        <motion.div 
                          layoutId={`tag-${id}`}
                          drag={appMode === 'practice' && !isArrangementCorrect && !isItemPlaced}
                          dragConstraints={containerRef}
                          dragElastic={0.05}
                          dragSnapToOrigin={true}
                          dragMomentum={false}
                          onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                          whileHover={{ scale: isItemPlaced ? 1 : 1.1, rotate: isItemPlaced ? 0 : 5 }}
                          whileDrag={{ 
                            scale: 1.25, 
                            zIndex: 1000, 
                            boxShadow: "0 45px 80px -20px rgba(0, 0, 0, 0.9)",
                            pointerEvents: "none" 
                          }}
                          className={`absolute inset-0 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl touch-none transition-all
                            bg-gradient-to-br ${person.color} ${person.ring} ${appMode === 'practice' && !isItemPlaced ? 'cursor-grab active:cursor-grabbing border-white shadow-[0_10px_30px_rgba(0,0,0,0.4)]' : 'cursor-default border-black/20 opacity-10 grayscale pointer-events-none'}
                            ${isItemPlaced ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                          <span className="text-white font-black text-2xl sm:text-4xl leading-none drop-shadow-md select-none">{person.initial}</span>
                          <p className="mt-1 text-white/70 text-[7px] sm:text-[9px] font-black uppercase select-none">{person.name}</p>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 sm:px-12 py-4 sm:py-5 rounded-[2.5rem] border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={32} />
                    <span className="text-green-400 font-black uppercase text-xs sm:text-sm tracking-[0.2em] text-center">
                      {isTutorialComplete ? "Solution Mastery!" : "Puzzle Solved Successfully!"}
                    </span>
                 </div>
                 {appMode === 'concept' && <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline underline-offset-4 decoration-white/20 shadow-xl"><RotateCcw size={14} /> Replay Session</button>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* QUIZ SECTION */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[300px]">
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-6">
               <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse shadow-inner"><GraduationCap size={40} /></div>
               <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight text-center px-4 leading-tight">Spatial Deduction Laboratory</h2>
               <p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center px-4">Analyze cardinal rules. facing North (↑) means Left arm points toward Slot 1. Build the row to satisfy every neighboring clue.</p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <span className="bg-[#3e2723] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">Grandmaster Assessment • Q{activeQuestionIndex + 1}</span>
                  </div>
                  <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-10 tracking-tight px-4 leading-tight text-center max-w-3xl mx-auto">{mission.questions[activeQuestionIndex]?.q}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto px-4">
                    {mission.questions[activeQuestionIndex]?.options.map((option, idx) => {
                      const isSel = selectedOption === idx;
                      const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg scale-105' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 shadow-sm';
                      return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 sm:p-8 rounded-[2rem] border-b-8 font-black text-sm sm:text-xl transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={20} />}</button>;
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center">
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-8 tracking-tight text-shadow-sm text-center">Grandmaster Logic Attained!</h2>
                   <button onClick={() => setAppMode('practice')} className="bg-[#2a1a16] text-[#e6dccb] px-12 sm:px-16 py-5 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl flex items-center gap-3 mx-auto hover:scale-105 transition-all text-lg tracking-widest">Next Training <ChevronRight size={24} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
         <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect} className={`flex-1 p-6 rounded-[2.5rem] font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Lightbulb size={20} /> View Logic</button>
         <button onClick={handleNext} className={`flex-1 p-6 rounded-[2.5rem] font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Begin Practice' : 'Skip Step')} <ChevronRight size={20} /></button>
      </div>

      {/* SESSION COMPLETE OVERLAY */}
      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-8 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div>
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter">Cardinal Genius!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto text-center px-4">"You successfully solved complex cardinal chains. You understand how facing North affects perspective and neighbor rules!"</p>
                <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/ActualWorldSouth')} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all text-sm sm:text-xl">Next Module</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIC EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-[#dfd7cc] rounded-[3.5rem] p-6 sm:p-14 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-center">
              <button onClick={() => setIsExplaining(false)} className="absolute top-6 sm:top-8 right-6 sm:right-8 p-3 sm:p-4 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 shadow-xl z-20"><CloseIcon size={28} /></button>
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-8 sm:mb-12 flex items-center justify-center gap-4 sm:gap-6"><ArrowRightLeft size={48} className="text-[#8d6e63]" /> Cardinal Logic Mapping</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 sm:gap-8 text-left px-2 sm:px-4">
                {(mission.questions?.[activeQuestionIndex]?.explanation || mission.explanation || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-6 sm:p-10 rounded-[2rem] border-l-[16px] sm:border-l-[20px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-xl leading-relaxed font-black italic">"{line}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full mt-8 sm:mt-12 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2rem] sm:rounded-[3rem] uppercase border-b-8 border-black text-lg sm:text-xl tracking-widest shadow-2xl transition-all active:translate-y-1">Understood!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
