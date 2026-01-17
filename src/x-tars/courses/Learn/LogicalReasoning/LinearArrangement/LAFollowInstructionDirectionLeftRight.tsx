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
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  MoveUp,
  MoveDown,
  RefreshCw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// Assets
const AanyaBackPng = 'https://via.placeholder.com/300x450?text=Aanya+Back';
const AanyaFrontPng = 'https://via.placeholder.com/300x450?text=Aanya+Front';
const BenBackPng = 'https://via.placeholder.com/300x450?text=Ben+Back';
const BenFrontPng = 'https://via.placeholder.com/300x450?text=Ben+Front';
const ChintuBackPng = 'https://via.placeholder.com/300x450?text=Chintu+Back';
const ChintuFrontPng = 'https://via.placeholder.com/300x450?text=Chintu+Front';
const DiyaBackPng = 'https://via.placeholder.com/300x450?text=Diya+Back';
const DiyaFrontPng = 'https://via.placeholder.com/300x450?text=Diya+Front';
const EthanBackPng = 'https://via.placeholder.com/300x450?text=Ethan+Back';
const EthanFrontPng = 'https://via.placeholder.com/300x450?text=Ethan+Front';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  p1: { name: 'Aanya', images: { away: AanyaBackPng, towards: AanyaFrontPng } },
  p2: { name: 'Ben', images: { away: BenBackPng, towards: BenFrontPng } },
  p3: { name: 'Chintu', images: { away: ChintuBackPng, towards: ChintuFrontPng } },
  p4: { name: 'Diya', images: { away: DiyaBackPng, towards: DiyaFrontPng } },
  p5: { name: 'Ethan', images: { away: EthanBackPng, towards: EthanFrontPng } },
};

const MISSIONS = {
  concept: {
    title: "The Logic of Perspective",
    note: "Key: If a person faces TOWARDS you, their Left is your Right! If they face AWAY, their sides match yours.",
    instructions: [
      "1. Ben sits at the extreme left (Seat 1) and faces AWAY",
      "2. Aanya sits to the immediate right of Ben and faces TOWARDS you",
      "3. Ethan sits to the immediate left of Aanya and faces AWAY",
      "4. Chintu sits to the immediate right of Ethan and faces TOWARDS you",
      "5. Diya sits to the immediate left of Chintu"
    ],
    requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    correctLayout: [
      { id: 'p2', facing: 'away' },
      { id: 'p1', facing: 'towards' },
      { id: 'p5', facing: 'away' },
      { id: 'p3', facing: 'towards' },
      { id: 'p4', facing: 'away' },
    ],
    steps: [
      { personId: "p2", slot: 0, facing: "away", why: "Anchor: Ben starts at Seat 1 facing AWAY. His Right is our Right.", ins: 0 },
      { personId: "p1", slot: 1, facing: "towards", why: "Relative: Aanya is to Ben's right. She faces TOWARDS us.", ins: 1 },
      { personId: "p5", slot: 2, facing: "away", why: "Logic: Aanya faces us, so her LEFT is Seat 3! Place Ethan there.", ins: 2 },
      { personId: "p3", slot: 3, facing: "towards", why: "Relative: Ethan faces away, his RIGHT is Seat 4. Place Chintu there.", ins: 3 },
      { personId: "p4", slot: 4, facing: "away", why: "Logic: Chintu faces us, so his LEFT is Seat 5. Place Diya there.", ins: 4 },
      // Verification Phase
      { verify: 1, why: "Let's re-verify Aanya: She faces towards us, so her Right neighbor is Ben. Correct!" },
      { verify: 3, why: "Check Chintu: He faces towards us, so his Left neighbor is Diya. Correct!" },
      { why: "All instructions are done! Now you can go ahead for practice.", isComplete: true }
    ]
  },
  practice: [
    {
      id: "p1_relative",
      requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
      note: "Perspective Check: Look at the character's facing arrow before deciding SL or SR.",
      instructions: [
        "1. Ethan sits at the extreme right (Seat 5) and faces AWAY",
        "2. Diya sits to the immediate left of Ethan and faces TOWARDS you",
        "3. Ben sits to the immediate right of Diya and faces AWAY",
        "4. Aanya sits to the immediate left of Ben and faces TOWARDS you",
        "5. Chintu sits to the immediate left of Aanya"
      ],
      correctLayout: [
        { id: 'p3', facing: 'away' },
        { id: 'p1', facing: 'towards' },
        { id: 'p2', facing: 'away' },
        { id: 'p4', facing: 'towards' },
        { id: 'p5', facing: 'away' },
      ],
      questions: [
        { 
          q: "Who is sitting at the extreme left (Seat 1)?", 
          options: ["Chintu", "Ethan", "Aanya"], 
          correct: 0,
          explanation: ["After following the chain from Ethan (Seat 5) back to the left, Chintu ends up at Seat 1."]
        },
        { 
          q: "Who is sitting exactly in the middle?", 
          options: ["Ben", "Aanya", "Diya"], 
          correct: 0,
          explanation: ["Ben occupies Seat 3, which is the exact center of the 5-person line."]
        },
        { 
          q: "How many people are facing TOWARDS you?", 
          options: ["1", "2", "3"], 
          correct: 1,
          explanation: ["Only Aanya (Seat 2) and Diya (Seat 4) are facing towards you."]
        },
        { 
          q: "Is Diya's left neighbor Ethan?", 
          options: ["Yes", "No"], 
          correct: 1,
          explanation: ["No. Diya faces towards us, so her Left is Seat 5. Ethan is her Left neighbor."]
        },
        { 
          q: "Who is sitting between Chintu and Ben?", 
          options: ["Ethan", "Aanya", "Diya"], 
          correct: 1,
          explanation: ["Chintu is at 1 and Ben is at 3. Aanya (Seat 2) sits between them."]
        }
      ]
    }
  ]
};

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  // App States
  const [appMode, setAppMode] = useState('concept'); 
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPeople, setPlacedPeople] = useState([null, null, null, null, null]);
  const [peopleFacings, setPeopleFacings] = useState(['away', 'away', 'away', 'away', 'away']);
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  // Tracking
  const [userCheckedInstructions, setUserCheckedInstructions] = useState([false, false, false, false, false]);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  
  // Quiz
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

  // Sync Logic
  useEffect(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setPeopleFacings(['away', 'away', 'away', 'away', 'away']);
    setTutorialStep(-1);
    setTutorialNarrative("");
    setHighlightedInstruction(-1);
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
      setIsArrangementCorrect(tutorialStep >= 5);
    }
  }, [placedPeople, peopleFacings, mission, tutorialStep, appMode]);

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

  useEffect(() => {
    let interval;
    if (autoNextTimer !== null && autoNextTimer > 0 && !isExplaining) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNext, isExplaining]);

  const startTutorial = useCallback(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setPeopleFacings(['away', 'away', 'away', 'away', 'away']);
    setTutorialStep(0);
    setIsTutorialComplete(false);
    
    const runStep = (idx) => {
      if (!MISSIONS.concept.steps[idx]) return;
      const step = MISSIONS.concept.steps[idx];
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.ins !== undefined ? step.ins : (step.verify !== undefined ? step.verify : -1));
      setIsTutorialComplete(!!step.isComplete);

      const t1 = setTimeout(() => {
        if (step.personId) {
          setPlacedPeople(prev => { const n = [...prev]; n[step.slot] = step.personId; return n; });
          setPeopleFacings(prev => { const n = [...prev]; n[step.slot] = step.facing; return n; });
        }
        if (idx < MISSIONS.concept.steps.length - 1) {
          const t2 = setTimeout(() => runStep(idx + 1), 4000);
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

  const handleDragEnd = (event, info, personId) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
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
        const oldIdx = next.indexOf(personId);
        const targetExisting = next[targetSlotIndex];
        if (oldIdx !== -1) next[oldIdx] = targetExisting;
        next[targetSlotIndex] = personId;
        return next;
      });
    }
  };

  const toggleFacing = (idx) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
    setPeopleFacings(prev => {
      const next = [...prev];
      next[idx] = next[idx] === 'away' ? 'towards' : 'away';
      return next;
    });
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

  const toggleCheckbox = (index) => {
    if (appMode !== 'practice') return;
    setUserCheckedInstructions(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      {/* HEADER */}
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-left">
              <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
                <ChevronLeft size={16} /> Dashboard
              </button>
              <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Perspective Lab</h1>
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
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-12 pb-12 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[700px] shadow-inner">
            
            {/* INSTRUCTIONS */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <CheckSquare size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.2em]">Relative Rule Checklist</span>
                  </div>
                  {appMode === 'concept' && tutorialStep === -1 && (
                    <button onClick={startTutorial} className="bg-yellow-400 text-[#2a1a16] px-4 py-1.5 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 transition-all">
                      <Play size={12} fill="currentColor" /> Watch Logic Tutorial
                    </button>
                  )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepDone = appMode === 'practice' ? userCheckedInstructions[i] : (tutorialStep > i);
                    const isHighlight = appMode === 'concept' && highlightedInstruction === i;
                    return (
                      <button key={i} onClick={() => toggleCheckbox(i)} disabled={appMode === 'concept'}
                        className={`flex items-start text-left gap-3 p-3 rounded-2xl transition-all duration-500 border-2
                        ${isHighlight ? 'bg-yellow-400/10 border-yellow-400 scale-105' : isStepDone ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5 hover:border-white/10'}`}
                      >
                        {isStepDone ? <CheckCircle2 size={16} className="text-green-500 mt-0.5" /> : <Square size={16} className="text-white/20 mt-0.5" />}
                        <p className={`text-[11px] sm:text-[13px] font-bold leading-tight ${isStepDone ? 'text-green-400' : isHighlight ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>
                          {ins}
                        </p>
                      </button>
                    );
                  })}
               </div>
            </div>

            {/* NOTE BOX */}
            <div className="w-full max-w-3xl px-4 mb-8">
               <div className="bg-amber-900/40 border border-amber-500/30 p-3 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} className="text-amber-400 shrink-0" />
                  <p className="text-amber-200 text-[10px] sm:text-xs font-bold italic leading-tight">{mission.note}</p>
               </div>
            </div>

            <AnimatePresence>
              {appMode === 'concept' && tutorialNarrative && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`${isTutorialComplete ? 'bg-green-600 ring-green-400/20' : 'bg-indigo-600 ring-indigo-400/20'} text-white px-8 py-4 rounded-3xl text-sm font-black text-center max-w-lg mb-8 shadow-2xl border-b-4 border-black/40 relative ring-4 transition-all`}
                >
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 ${isTutorialComplete ? 'bg-green-600' : 'bg-indigo-600'} rotate-45 transition-all`} />
                  {tutorialNarrative}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CHARACTER SLOTS */}
            <div className="w-full flex items-end justify-center py-6 px-2 gap-3 sm:gap-6 relative">
              {placedPeople.map((id, idx) => {
                const person = id ? PEOPLE_DATA[id] : null;
                const facing = peopleFacings[idx];
                const image = person ? person.images[facing] : null;
                const isTutoRef = appMode === 'concept' && (MISSIONS.concept.steps[tutorialStep]?.slot === idx || MISSIONS.concept.steps[tutorialStep]?.verify === idx);

                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div 
                      ref={el => slotRefs.current[idx] = el}
                      className={`relative w-16 h-28 sm:w-32 sm:h-52 rounded-[1rem] sm:rounded-[2rem] border-4 transition-all duration-500 flex items-center justify-center overflow-hidden
                        ${person ? 'border-yellow-400 bg-black/60 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-dashed border-white/10 bg-white/5 shadow-inner'}
                        ${isTutoRef ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#3e2723]' : ''}`}
                    >
                      {person ? (
                        <>
                          <motion.img layoutId={`person-${id}`} src={image} className="w-full h-full object-cover pointer-events-none" />
                          {!isArrangementCorrect && (
                            <button onClick={() => setPlacedPeople(prev => { const n = [...prev]; n[idx] = null; return n; })} className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full z-20"><Trash2 size={12} className="text-white" /></button>
                          )}
                        </>
                      ) : <div className="opacity-10"><Users size={32} className="text-white" /></div>}
                    </div>
                    {/* ORIENTATION TOGGLE */}
                    <div className="flex flex-col items-center gap-1.5">
                        <button 
                          onClick={() => toggleFacing(idx)}
                          disabled={!person || isArrangementCorrect}
                          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center shadow-lg
                            ${!person ? 'bg-black/20 border-white/5 text-white/10' : 
                              facing === 'away' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white'}`}
                        >
                          {facing === 'away' ? <MoveUp size={18} /> : <MoveDown size={18} />}
                        </button>
                        <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-widest ${person ? 'text-white' : 'text-white/20'}`}>
                           {facing === 'away' ? 'Away' : 'Towards'}
                        </span>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-[10px]">#{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* POOL */}
            <div className="mt-8 p-6 bg-black/30 rounded-[2.5rem] border border-white/10 w-full max-w-3xl flex flex-col items-center shadow-2xl">
              <span className="text-[10px] font-black text-[#a88a6d] uppercase tracking-[0.3em] mb-4 text-center">Available People (Faces Away in Pool)</span>
              <div className="flex gap-4 justify-center w-full flex-wrap">
                {mission.requiredIds.map(id => {
                  const person = PEOPLE_DATA[id];
                  const isPlaced = placedPeople.includes(id);
                  const isDisabled = isArrangementCorrect || isPlaced;
                  return (
                    <div key={id} className="relative w-14 h-22 sm:w-24 sm:h-36 shrink-0">
                      <div className={`absolute inset-0 rounded-xl border-2 border-white/5 overflow-hidden transition-all duration-300
                        ${isDisabled ? 'opacity-30 grayscale' : 'opacity-10 border-transparent'}`}>
                         <img src={person.images.away} className="w-full h-full object-cover" />
                      </div>
                      {!isPlaced && !isArrangementCorrect && (
                        <motion.div 
                          layoutId={`person-${id}`}
                          drag={appMode === 'practice'}
                          dragConstraints={containerRef}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                          whileDrag={{ scale: 1.1, zIndex: 100 }}
                          className={`absolute inset-0 rounded-xl border-2 border-white/20 shadow-xl overflow-hidden bg-[#2a1a16] touch-none ${appMode === 'practice' ? 'cursor-grab' : 'cursor-default'}`}
                        >
                          <img src={person.images.away} className="w-full h-full object-cover pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 border-t border-white/5"><p className="text-white text-[7px] sm:text-[9px] font-black text-center uppercase">{person.name}</p></div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-[2rem] border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-green-400 font-black uppercase text-sm tracking-widest text-center">
                      {isTutorialComplete ? "Logic Mastered!" : "Perfect Seating! Orientation Verified."}
                    </span>
                 </div>
                 {appMode === 'concept' && <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline underline-offset-4"><RotateCcw size={14} /> Replay Demo</button>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ACTION AREA */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[3rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[250px]">
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-8">
               <div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse shadow-inner"><GraduationCap size={32} /></div>
               <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase tracking-tight">Solve the Logic Chain</h2>
               <p className="text-[#3e2723]/60 font-bold text-sm max-w-sm italic">Seat each person and flip their arrows to match the rules. Questions unlock once the line is correct!</p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-10 tracking-tight px-4 leading-tight">{mission.questions[activeQuestionIndex]?.q}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto px-4">
                    {mission.questions[activeQuestionIndex]?.options.map((option, idx) => {
                      const isSel = selectedOption === idx;
                      const btnClass = isSel && isCorrect ? 'bg-green-500 border-green-700 text-white' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                      return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 sm:p-8 rounded-[2rem] border-b-8 shadow-lg font-black text-lg transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-2 right-2 opacity-40" size={20} />}</button>;
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8">
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-6 tracking-tight text-shadow-sm">Tutorial Ready!</h2>
                   <p className="text-[#3e2723]/60 font-bold mb-8 italic max-w-lg mx-auto text-center">You've learned how perspective flips Left and Right. Now try the Practice challenge!</p>
                   <button onClick={() => setAppMode('practice')} className="bg-[#2a1a16] text-[#e6dccb] px-12 py-5 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all">Start Practice <ChevronRight size={20} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
         <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect} className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}><Lightbulb size={18} /> View Logic</button>
         <button onClick={handleNext} className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Practice Mode' : 'Skip Question')} <ChevronRight size={18} /></button>
      </div>

      {/* SESSION COMPLETE */}
      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-10 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={64} className="animate-bounce" /></div>
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Logic Pro!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-10 max-w-md mx-auto text-center">"You mastered the perspective chain! You can now solve complex seating logic from any character's view."</p>
                <button onClick={() => window.location.reload()} className="px-12 py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 transition-all">Restart Lab</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#dfd7cc] rounded-[3.5rem] p-8 sm:p-14 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-center">
              <button onClick={() => setIsExplaining(false)} className="absolute top-8 right-8 p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90"><CloseIcon size={24} /></button>
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-10 flex items-center justify-center gap-5"><ArrowRightLeft size={40} className="text-[#8d6e63]" /> Perspective Logic</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 text-left">
                {(mission.questions?.[activeQuestionIndex]?.explanation || (appMode === 'concept' ? mission.steps.map(s => s.why) : mission.explanation) || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-8 rounded-[2rem] border-l-[16px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-xl leading-relaxed font-black italic">"{line}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full mt-10 py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2.5rem] uppercase border-b-8 border-black text-lg tracking-widest shadow-2xl transition-all">Understood!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
