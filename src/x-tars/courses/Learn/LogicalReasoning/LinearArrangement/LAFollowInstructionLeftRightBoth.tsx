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
  AlertCircle
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
const PEOPLE_DATA = [
  { id: 'p1', name: 'Aanya', image: AanyaBackPng },
  { id: 'p2', name: 'Ben', image: BenPng },
  { id: 'p3', name: 'Chintu', image: ChintuBackPng },
  { id: 'p4', name: 'Diya', image: DiyaPng },
  { id: 'p5', name: 'Ethan', image: EthanBackPng },
];

const MISSIONS = {
  concept: {
    title: "Learning the Seating Mix",
    note: "Note: Verification is the most important step. Always re-read instructions to confirm your final line.",
    instructions: [
      "1. Ben is sitting at the extreme left (Seat 1)",
      "2. Aanya is sitting to the immediate right of Ben",
      "3. Ethan is sitting to the right of Aanya",
      "4. Chintu is sitting to the immediate right of Ethan",
      "5. Diya is sitting at the extreme right (Seat 5)"
    ],
    requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    steps: [
      // PHASE 1: BUILDING
      {
        personId: "p2",
        targetSlot: 0, 
        why: "Step 1: Ben is our anchor at Seat 1 (Extreme Left).",
        highlightIns: 0,
        clearAll: true
      },
      {
        personId: "p1",
        targetSlot: 1, 
        why: "Step 2: Place Aanya at Seat 2. This is 'Immediate Right' of Ben.",
        highlightIns: 1,
        clearAll: false
      },
      {
        personId: "p5",
        targetSlot: 2, 
        why: "Step 3: Place Ethan in Seat 3. He is to the right of Aanya.",
        highlightIns: 2,
        clearAll: false
      },
      {
        personId: "p3",
        targetSlot: 3, 
        why: "Step 4: Chintu is 'Immediate Right' of Ethan. Seat 4 belongs to him.",
        highlightIns: 3,
        clearAll: false
      },
      {
        personId: "p4",
        targetSlot: 4, 
        why: "Step 5: Finally, Diya takes Seat 5 (Extreme Right).",
        highlightIns: 4,
        clearAll: false
      },
      // PHASE 2: VERIFICATION WALKTHROUGH
      {
        personId: null,
        targetSlot: null,
        why: "Now, let's verify! Rule 1: Ben is at the start of the line. Correct!",
        highlightIns: 0,
        clearAll: false,
        isVerification: true
      },
      {
        personId: null,
        targetSlot: null,
        why: "Rule 2: Aanya is in Seat 2, right next to Ben. Correct!",
        highlightIns: 1,
        clearAll: false,
        isVerification: true
      },
      {
        personId: null,
        targetSlot: null,
        why: "Rule 3: Ethan is in Seat 3. He is indeed to the right of Aanya. Correct!",
        highlightIns: 2,
        clearAll: false,
        isVerification: true
      },
      {
        personId: null,
        targetSlot: null,
        why: "Rule 4: Chintu is in Seat 4, touching Ethan on the right. Correct!",
        highlightIns: 3,
        clearAll: false,
        isVerification: true
      },
      {
        personId: null,
        targetSlot: null,
        why: "Rule 5: Diya is at the very end of the line. Correct!",
        highlightIns: 4,
        clearAll: false,
        isVerification: true
      },
      // PHASE 3: FINAL VERDICT
      {
        personId: null,
        targetSlot: null,
        why: "All instructions are done! Now you can go ahead for practice.",
        highlightIns: -1,
        clearAll: false,
        isVerification: true,
        isComplete: true
      }
    ],
    questions: []
  },
  practice: [
    {
      id: "p1_mission",
      requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
      note: "Note: Tapping the checkboxes helps you track which rules you have already applied.",
      instructions: [
        "1. Ethan is sitting at the extreme left",
        "2. Diya is sitting to the immediate right of Ethan",
        "3. Ben is sitting exactly in the middle of the row",
        "4. Chintu is sitting at the extreme right",
        "5. Aanya is sitting to the immediate left of Chintu"
      ],
      correctOrder: ['p5', 'p4', 'p2', 'p1', 'p3'], // Ethan, Diya, Ben, Aanya, Chintu
      questions: [
        { 
          q: "Who is sitting at the extreme left?", 
          options: ["Ethan", "Aanya", "Chintu"], 
          correct: 0,
          explanation: ["Ethan was placed in Seat 1 based on Rule 1."]
        },
        { 
          q: "Who is sitting to the immediate right of Ethan?", 
          options: ["Aanya", "Diya", "Ben"], 
          correct: 1,
          explanation: ["Rule 2 states Diya is sitting immediately next to Ethan on the right."]
        },
        { 
          q: "Who are the neighbors of Ben?", 
          options: ["Ethan & Diya", "Diya & Aanya", "Aanya & Chintu"], 
          correct: 1,
          explanation: ["Ben is in the middle (Seat 3). His neighbors are Diya (Seat 2) and Aanya (Seat 4)."]
        },
        { 
          q: "Who is sitting exactly in the middle?", 
          options: ["Ben", "Ethan", "Diya"], 
          correct: 0,
          explanation: ["As per Rule 3, Ben occupies the 3rd seat in this 5-person row."]
        },
        { 
          q: "How many people are sitting between Ethan and Chintu?", 
          options: ["2", "3", "4"], 
          correct: 1,
          explanation: ["Between the ends (Seats 1 and 5), there are 3 people (Seats 2, 3, and 4)."]
        },
        { 
          q: "Who is sitting at the extreme right?", 
          options: ["Ben", "Ethan", "Chintu"], 
          correct: 2,
          explanation: ["Chintu was assigned to the 'Extreme Right' in Rule 4."]
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
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  // Interaction tracking
  const [userCheckedInstructions, setUserCheckedInstructions] = useState([false, false, false, false, false]);

  // Tutorial States
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  
  // Quiz States
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  // Derived Mission Data
  const mission = (appMode === 'concept' ? MISSIONS.concept : MISSIONS.practice[levelIndex]) || MISSIONS.concept;

  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  // Reset Logic
  useEffect(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setTutorialStep(-1);
    setTutorialNarrative("");
    setHighlightedInstruction(-1);
    setIsVerifying(false);
    setIsTutorialComplete(false);
    setActiveQuestionIndex(0);
    setAutoNextTimer(null);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsError(false);
    setUserCheckedInstructions([false, false, false, false, false]);
  }, [appMode, levelIndex, clearAllTutorials]);

  // Seating Validation
  useEffect(() => {
    if (appMode === 'practice') {
      const isCorrectArr = mission.correctOrder.every((id, idx) => {
        if (id === null) return true;
        return placedPeople[idx] === id;
      });
      setIsArrangementCorrect(isCorrectArr);
    } else {
      // Arrangement is correct once the tutorial reaches the first verification phase
      setIsArrangementCorrect(tutorialStep >= 5);
    }
  }, [placedPeople, mission, tutorialStep, appMode]);

  const handleNext = useCallback(() => {
    clearAllTutorials();
    if (appMode === 'concept') {
      setAppMode('practice');
      setLevelIndex(0);
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
    setTutorialStep(0);
    setIsVerifying(false);
    setIsTutorialComplete(false);
    
    const runStep = (idx) => {
      if (!MISSIONS.concept.steps[idx]) return;
      const step = MISSIONS.concept.steps[idx];
      
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.highlightIns);
      setIsVerifying(!!step.isVerification);
      setIsTutorialComplete(!!step.isComplete);

      const t1 = setTimeout(() => {
        if (!step.isVerification) {
          setPlacedPeople(prev => {
            let next = step.clearAll ? [null, null, null, null, null] : [...prev];
            if (step.removeAt !== undefined) next[step.removeAt] = null;
            if (step.personId && step.targetSlot !== null) next[step.targetSlot] = step.personId;
            return next;
          });
        }

        if (idx < MISSIONS.concept.steps.length - 1) {
          const t2 = setTimeout(() => runStep(idx + 1), 3500);
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

  const toggleCheckbox = (index) => {
    if (appMode !== 'practice') return;
    setUserCheckedInstructions(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const filteredPool = PEOPLE_DATA.filter(p => mission.requiredIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="absolute inset-0 bg-[#3e2723] pointer-events-none opacity-[0.03]" />
      
      {/* HEADER */}
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-left">
              <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
                <ChevronLeft size={16} /> Dashboard
              </button>
              <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">What if instructions are for both left and right</h1>
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
          
          <div className="relative z-10 bg-[#3e2723] pt-12 pb-12 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[650px] shadow-inner">
            
            {/* LOGIC CHECKLIST */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[#2a1a16] shadow-lg">
                      {isVerifying ? <ArrowRightLeft size={18} /> : <CheckSquare size={18} />}
                    </div>
                    <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.2em]">
                      {isVerifying ? "Verification Mode" : "Instruction Checklist"}
                    </span>
                  </div>
                  {appMode === 'concept' && tutorialStep === -1 && (
                    <button onClick={startTutorial} className="bg-yellow-400 text-[#2a1a16] px-5 py-2 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
                      <Play size={14} fill="currentColor" /> Watch Tutorial
                    </button>
                  )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepComplete = appMode === 'practice' 
                      ? userCheckedInstructions[i] 
                      : (tutorialStep > i);
                    const isTutorialActive = appMode === 'concept' && highlightedInstruction === i;

                    return (
                      <button 
                        key={i} 
                        onClick={() => toggleCheckbox(i)}
                        disabled={appMode === 'concept'}
                        className={`flex items-start text-left gap-3 p-3 rounded-2xl transition-all duration-500 border-2
                        ${isTutorialActive ? 'bg-yellow-400/20 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.3)] scale-105' : isStepComplete ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5 hover:border-white/20'}`}
                      >
                        <div className="mt-0.5">
                          {isStepComplete ? (
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                          ) : isTutorialActive ? (
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                              <Square size={18} className="text-yellow-400 shrink-0" />
                            </motion.div>
                          ) : (
                            <Square size={18} className="text-white/20 shrink-0" />
                          )}
                        </div>
                        <p className={`text-xs sm:text-sm font-bold leading-tight transition-colors duration-500
                          ${isStepComplete ? 'text-green-400' : isTutorialActive ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>
                          {ins}
                        </p>
                      </button>
                    );
                  })}
               </div>
            </div>

            {/* LOGIC NOTE */}
            <div className="w-full max-w-3xl px-4 mb-8">
               <div className="bg-amber-900/40 border border-amber-500/30 p-3 rounded-2xl flex items-center gap-3">
                  <AlertCircle size={20} className="text-amber-400 shrink-0" />
                  <p className="text-amber-200 text-[10px] sm:text-xs font-bold leading-tight italic">
                    {mission.note}
                  </p>
               </div>
            </div>

            <AnimatePresence>
              {appMode === 'concept' && tutorialNarrative && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`${isTutorialComplete ? 'bg-green-600 ring-green-400/20' : isVerifying ? 'bg-indigo-600 ring-indigo-400/20' : 'bg-cyan-600 ring-cyan-400/20'} text-white px-8 py-4 rounded-3xl text-sm sm:text-base font-black text-center max-w-lg mb-8 shadow-2xl border-b-4 border-black/40 relative ring-4 transition-colors duration-500`}
                >
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 ${isTutorialComplete ? 'bg-green-600' : isVerifying ? 'bg-indigo-600' : 'bg-cyan-600'} rotate-45 transition-colors duration-500`} />
                  {isTutorialComplete && <span className="block text-[10px] uppercase opacity-70 mb-1 tracking-widest">Tutorial Result</span>}
                  {isVerifying && !isTutorialComplete && <span className="block text-[10px] uppercase opacity-70 mb-1 tracking-widest">Verification Walkthrough</span>}
                  {tutorialNarrative}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CHARACTER SLOTS */}
            <div className="w-full flex items-end justify-center py-6 px-2 gap-3 sm:gap-6 relative">
              {placedPeople.map((id, idx) => {
                const person = id ? PEOPLE_DATA.find(p => p.id === id) : null;
                const isTutorialHighlighted = appMode === 'concept' && tutorialStep !== -1 && (
                  (idx === MISSIONS.concept.steps[tutorialStep]?.targetSlot) || 
                  (isVerifying && highlightedInstruction === 1 && idx <= 1) || 
                  (isVerifying && highlightedInstruction === 3 && (idx === 2 || idx === 3))
                );

                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div 
                      ref={el => slotRefs.current[idx] = el}
                      className={`relative w-20 h-32 sm:w-40 sm:h-60 rounded-[1.5rem] sm:rounded-[2rem] border-4 transition-all duration-500 flex items-center justify-center overflow-hidden
                        ${person ? 'border-yellow-400 bg-black/60 scale-105' : 'border-dashed border-white/10 bg-white/5 shadow-inner'}
                        ${isTutorialHighlighted ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#3e2723] shadow-[0_0_30px_rgba(250,204,21,0.5)]' : ''}`}
                    >
                      {person ? (
                        <motion.img layoutId={`person-${person.id}`} src={person.image} alt={person.name} className="w-full h-full object-cover pointer-events-none" />
                      ) : (
                        <div className="opacity-10"><Users size={32} className="text-white" /></div>
                      )}
                      {person && !isArrangementCorrect && appMode === 'practice' && (
                        <button onClick={() => setPlacedPeople(prev => {
                          const next = [...prev]; next[idx] = null; return next;
                        })} className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 p-1.5 rounded-full shadow-lg z-20"><Trash2 size={12} className="text-white" /></button>
                      )}
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-[10px] sm:text-xs">#{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* POOL */}
            <div className="mt-8 p-6 bg-black/30 rounded-[2.5rem] border border-white/10 w-full max-w-3xl flex flex-col items-center shadow-2xl">
              <span className="text-[10px] font-black text-[#a88a6d] uppercase tracking-[0.3em] mb-6">People Pool</span>
              <div className="flex gap-4 justify-center w-full flex-wrap">
                {filteredPool.map(person => {
                  const isPlaced = placedPeople.includes(person.id);
                  const isDisabledPool = isArrangementCorrect || isPlaced;
                  return (
                    <div key={person.id} className="relative w-14 h-22 sm:w-24 sm:h-36 shrink-0">
                      <div className={`absolute inset-0 rounded-xl border-2 border-white/5 overflow-hidden transition-all duration-300
                        ${isDisabledPool ? 'opacity-30 grayscale border-white/10' : 'opacity-10 border-transparent'}`}>
                         <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
                      </div>
                      {!isPlaced && !isArrangementCorrect && (
                        <motion.div 
                          layoutId={`person-${person.id}`}
                          drag={appMode === 'practice'}
                          dragConstraints={containerRef}
                          dragElastic={0.1}
                          onDragEnd={(e, info) => handleDragEnd(e, info, person.id)}
                          whileDrag={{ scale: 1.1, zIndex: 100 }}
                          className={`absolute inset-0 rounded-xl border-2 border-white/20 shadow-xl overflow-hidden bg-[#2a1a16] touch-none ${appMode === 'practice' ? 'cursor-grab' : 'cursor-default'}`}
                        >
                          <img src={person.image} alt={person.name} className="w-full h-full object-cover pointer-events-none" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/80 py-1 border-t border-white/5">
                            <p className="text-white text-[7px] sm:text-[9px] font-black text-center uppercase">{person.name}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-6 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-[2rem] border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-green-400 font-black uppercase text-sm tracking-widest">
                      {isTutorialComplete ? "All Instructions Done!" : appMode === 'concept' ? "Verification Walkthrough Complete!" : "Perfect Verdict: All Rules Satisfied!"}
                    </span>
                 </div>
                 {appMode === 'concept' && (
                   <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline underline-offset-4 decoration-white/20">
                     <RotateCcw size={14} /> Replay Tutorial
                   </button>
                 )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* QUESTIONS SECTION */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[3rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[250px]">
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-8">
               <div className="w-20 h-20 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse shadow-inner">
                 {appMode === 'concept' ? <GraduationCap size={40} /> : <Move size={40} />}
               </div>
               <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase tracking-tight">
                 {appMode === 'concept' ? "Observe Verification" : "Solve the Arrangement"}
               </h2>
               <p className="text-[#3e2723]/60 font-bold max-sm:text-xs max-w-sm italic">
                 {appMode === 'concept' ? "Watch how every rule is re-checked to ensure 100% accuracy." : "Follow all rules above. Questions will unlock once the line is correct."}
               </p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-12 tracking-tight px-4 leading-tight">
                      {mission.questions[activeQuestionIndex]?.q}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mx-auto px-4">
                    {(mission.questions[activeQuestionIndex]?.options || []).map((option, idx) => {
                      const isCurrentSelected = selectedOption === idx;
                      const buttonClass = isCurrentSelected && isCorrect ? 'bg-green-500 border-green-700 text-white' : 
                                        isCurrentSelected && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 
                                        'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                      return (
                        <button key={idx} onClick={() => handleAnswerSelect(idx)}
                          className={`group relative p-6 sm:p-8 rounded-[2rem] border-b-8 shadow-lg font-black text-lg sm:text-xl transition-all ${buttonClass}`}
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
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-6 tracking-tight text-shadow-sm">Tutorial Ready!</h2>
                   <p className="text-[#3e2723]/60 font-bold mb-8 italic max-w-lg mx-auto">All instructions are done and now you can go ahead for practice. Apply your logic to solve the next challenge!</p>
                   <button onClick={() => setAppMode('practice')} className="bg-[#2a1a16] text-[#e6dccb] px-12 py-5 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl flex items-center gap-2 mx-auto hover:scale-105 active:scale-95 transition-all">
                      Start Practice <ChevronRight size={20} />
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
         <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect}
           className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2
             ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
           <Lightbulb size={18} /> View Logic
         </button>
         <button onClick={handleNext} 
           className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2
             ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>
           {autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Practice Mode' : 'Skip Question')}
           <ChevronRight size={18} />
         </button>
      </div>

      {/* SESSION COMPLETE */}
      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-10 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10">
                <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mx-auto mb-8 shadow-2xl border-4 border-white">
                  <Trophy size={64} className="animate-bounce" />
                </div>
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Logic Pro!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-10 max-w-md mx-auto">
                  "You followed the rules and verified the line! Spatial reasoning is now one of your greatest strengths!"
                </p>
                <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/InstrDiffDirection')} className="px-12 py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 transition-all">Next Module</button>
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
