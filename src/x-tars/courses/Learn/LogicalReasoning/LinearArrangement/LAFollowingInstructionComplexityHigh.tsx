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
  Search
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// IMAGE ASSET CONFIGURATION
// ==========================================
import AanyaBackPng from '../../../CommonUtility/Images/AanyaBack.png';
import AanyaPng from '../../../CommonUtility/Images/Aanya.png';
import BenBackPng from '../../../CommonUtility/Images/BenBack.png';
import BenPng from '../../../CommonUtility/Images/Ben.png';
import ChintuBackPng from '../../../CommonUtility/Images/ChintuBack.png';
import ChintuPng from '../../../CommonUtility/Images/Chintu.png';
import DiyaBackPng from '../../../CommonUtility/Images/DiyaBack.png';
import DiyaPng from '../../../CommonUtility/Images/Diya.png';
import EthanBackPng from '../../../CommonUtility/Images/EthanBack.png';
import EthanPng from '../../../CommonUtility/Images/Ethan.png';


const PEOPLE_DATA = {
  p1: { name: 'Aanya', images: { towards: AanyaPng, away: AanyaBackPng } },
  p2: { name: 'Ben', images: { towards: BenPng, away: BenBackPng } },
  p3: { name: 'Chintu', images: { towards: ChintuPng, away: ChintuBackPng } },
  p4: { name: 'Diya', images: { towards: DiyaPng, away: DiyaBackPng } },
  p5: { name: 'Ethan', images: { towards: EthanPng, away: EthanBackPng } },
};

const ALL_POOL_ITEMS = [
  { id: 'p1', facing: 'towards', label: 'Aanya (T)' }, { id: 'p1', facing: 'away', label: 'Aanya (A)' },
  { id: 'p2', facing: 'towards', label: 'Ben (T)' },   { id: 'p2', facing: 'away', label: 'Ben (A)' },
  { id: 'p3', facing: 'towards', label: 'Chintu (T)' }, { id: 'p3', facing: 'away', label: 'Chintu (A)' },
  { id: 'p4', facing: 'towards', label: 'Diya (T)' },   { id: 'p4', facing: 'away', label: 'Diya (A)' },
  { id: 'p5', facing: 'towards', label: 'Ethan (T)' },  { id: 'p5', facing: 'away', label: 'Ethan (A)' },
];

const MISSIONS = {
  concept: {
    title: "Extreme Tough Logic",
    note: "Level: Grandmaster. We use overlapping relative clues to solve positions, then force orientations using perspective rules.",
    instructions: [
      "1. Diya is sitting at an EXTREME END.",
      "2. Ethan is sitting exactly BETWEEN Ben and Aanya.",
      "3. Aanya is sitting exactly BETWEEN Ethan and Chintu.",
      "4. Ben is to the RIGHT of Aanya.",
      "5. Diya is to the LEFT of Ben."
    ],
    requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
    correctLayout: [
      { id: 'p4', facing: 'away' },    
      { id: 'p2', facing: 'away' },    
      { id: 'p5', facing: 'away' },    
      { id: 'p1', facing: 'towards' }, 
      { id: 'p3', facing: 'away' },    
    ],
    steps: [
      { personId: "p4", slot: 0, facing: "away", why: "Step 1: Fixed Anchor. Instruction 1 places Diya at the far left end (Slot 1).", ins: 0 },
      { why: "Strategy: Now we use Instruction 5 because it mentions Diya. It says 'Diya is to the LEFT of Ben'.", ins: 4 },
      { personId: "p2", slot: 1, facing: "away", why: "For Diya (Slot 1) to be on someone's left, that person must be in a higher slot. Let's place Ben at Slot 2.", ins: 4 },
      { why: "Logic Check: Ben is at Slot 2. For Slot 1 to be his LEFT, Ben must face AWAY from us. (When facing away, Left is Slot 1).", facing: "away", slot: 1, ins: 4 },
      { why: "Step 3: Now use Instruction 2: Ethan is BETWEEN Ben and Aanya. Ben is at Slot 2.", ins: 1 },
      { personId: "p5", slot: 2, facing: "away", why: "This forces Ethan into Slot 3 and Aanya into Slot 4.", ins: 1 },
      { personId: "p1", slot: 3, facing: "away", why: "Current Chain: Diya(1) - Ben(2) - Ethan(3) - Aanya(4).", ins: 1 },
      { why: "Step 4: Finally, Instruction 3 says Aanya is between Ethan and Chintu.", ins: 2 },
      { personId: "p3", slot: 4, facing: "away", why: "Since Ethan is at 3 and Aanya is at 4, Chintu must be at Slot 5.", ins: 2 },
      { why: "Step 5: Final Check. Instruction 4 says 'Ben is to the RIGHT of Aanya'.", ins: 3 },
      { why: "Aanya is at Slot 4. Ben is at Slot 2 (a lower number).", ins: 3 },
      { facing: "towards", slot: 3, why: "For Slot 2 to be Aanya's RIGHT, she must face TOWARDS us. (Towards = Right arm points to lower slots).", ins: 3 },
      { why: "Extreme Challenge Complete! You correctly used perspective to solve every person's position and orientation.", isComplete: true }
    ]
  },
  practice: [
    {
      id: "extreme_practice_01",
      requiredIds: ['p1', 'p2', 'p3', 'p4', 'p5'],
      note: "Grandmaster Challenge: Overlapping clues. Anchor your line from the extreme end and work outward.",
      instructions: [
        "1. Chintu is sitting at an EXTREME END.",
        "2. Ben is sitting BETWEEN Aanya and Ethan.",
        "3. Aanya is sitting exactly BETWEEN Chintu and Ben.",
        "4. Chintu is to the RIGHT of Aanya.",
        "5. Ethan is to the LEFT of Aanya."
      ],
      correctLayout: [
        { id: 'p3', facing: 'away' },    // Chintu (1)
        { id: 'p1', facing: 'towards' }, // Aanya (2)
        { id: 'p2', facing: 'away' },    // Ben (3)
        { id: 'p5', facing: 'away' },    // Ethan (4)
        { id: 'p4', facing: 'away' },    // Diya (5)
      ],
      explanation: [
        "Positioning: Chintu is end (1). Aanya between Chintu(1) and Ben(3) = Aanya at 2. Ben between Aanya(2) and Ethan(4) = Ethan at 4.",
        "Orientation Rule 1: Chintu (1) is Right of Aanya (2). Aanya must face us (Towards) for Slot 1 to be her Right side.",
        "Orientation Rule 2: Ethan (4) is Left of Aanya (2). When facing us, Slot 4 is her Left side. All rules satisfied."
      ],
      questions: [
        { 
          q: "If Chintu is at the far left (Slot 1) and Ben is at Slot 3, where is Aanya?", 
          options: ["Slot 2", "Slot 4", "Slot 5"], 
          correct: 0,
          explanation: ["Instruction 3 states Aanya is 'exactly' between them. 2 is exactly between 1 and 3."]
        },
        { 
          q: "Which way is Aanya facing to make Chintu (Slot 1) her RIGHT side neighbor?", 
          options: ["Towards you", "Away from you"], 
          correct: 0,
          explanation: ["If she faces towards us at Slot 2, her right arm points toward Slot 1. If she faced away, it would point to Slot 3."]
        },
        { 
          q: "According to Instruction 5, Ethan is to the LEFT of Aanya. If Aanya faces towards us at Slot 2, is Ethan at a higher or lower slot number?", 
          options: ["Higher (3, 4, or 5)", "Lower (Slot 1)"], 
          correct: 0,
          explanation: ["Towards-facing characters have their Left side pointing toward higher slot numbers."]
        },
        { 
          q: "Who is at the far RIGHT end (Slot 5)?", 
          options: ["Diya", "Ethan", "Ben"], 
          correct: 0,
          explanation: ["Chintu(1), Aanya(2), Ben(3), and Ethan(4) are logically fixed. Diya must be in the only empty spot, Slot 5."]
        },
        { 
          q: "How many people are sitting between Aanya and Ethan?", 
          options: ["None", "One (Ben)", "Two (Ben and Diya)"], 
          correct: 1,
          explanation: ["Aanya is at Slot 2 and Ethan is at Slot 4. Ben is between them at Slot 3."]
        },
        { 
          q: "If everyone faced AWAY, who would have Chintu to their LEFT?", 
          options: ["Aanya", "Ben", "No one"], 
          correct: 0,
          explanation: ["Facing away, the Left side points to lower slot numbers. Aanya at 2 would see Chintu at 1 to her Left."]
        },
        { 
          q: "Which clue allowed you to determine the orientation of the whole line?", 
          options: ["Instruction 4 (Chintu is Right of Aanya)", "Instruction 1 (Extreme End)", "Instruction 2 (Between)"], 
          correct: 0,
          explanation: ["Instruction 4 defines the relationship between position and perspective, forcing the orientation."]
        }
      ]
    }
  ]
};

export default function LabContent() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept'); 
  const [levelIndex, setLevelIndex] = useState(0);
  const [placedPeople, setPlacedPeople] = useState([null, null, null, null, null]);
  const [peopleFacings, setPeopleFacings] = useState([null, null, null, null, null]);
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  
  const [userCheckedInstructions, setUserCheckedInstructions] = useState([false, false, false, false, false]);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
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
    setPeopleFacings([null, null, null, null, null]);
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

  const startTutorial = useCallback(() => {
    clearAllTutorials();
    setPlacedPeople([null, null, null, null, null]);
    setPeopleFacings([null, null, null, null, null]);
    setTutorialStep(0);
    setIsTutorialComplete(false);
    
    const runStep = (idx) => {
      if (!MISSIONS.concept.steps[idx]) return;
      const step = MISSIONS.concept.steps[idx];
      
      setTutorialStep(idx);
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.ins);
      
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
        }, 6000); 
        tutorialTimeouts.current.push(t2);
      }, 3500); 
      tutorialTimeouts.current.push(t1);
    };
    runStep(0);
  }, [clearAllTutorials]);

  const handleDragEnd = (event, info, personId, facing) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let targetIdx = -1;
    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      if (dropPoint.x >= rect.left + scrollX && dropPoint.x <= rect.right + scrollX &&
          dropPoint.y >= rect.top + scrollY && dropPoint.y <= rect.bottom + scrollY) {
        targetIdx = index;
      }
    });

    if (targetIdx !== -1) {
      setPlacedPeople(prev => { const n = [...prev]; n[targetIdx] = personId; return n; });
      setPeopleFacings(prev => { const n = [...prev]; n[targetIdx] = facing; return n; });
    }
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
              <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
                <ChevronLeft size={16} /> Dashboard
              </button>
              <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none text-shadow-sm">Can you solve the complex linear arrangement now?</h1>
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
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10">
          <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-12 pb-12 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[750px] shadow-inner">
            
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-[2.5rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <CheckSquare size={18} className="text-yellow-400" />
                    <span className="text-yellow-400 font-black uppercase text-xs tracking-[0.2em]">Logic Checklist</span>
                  </div>
                  {appMode === 'concept' && tutorialStep === -1 && (
                    <button onClick={startTutorial} className="bg-yellow-400 text-[#2a1a16] px-4 py-1.5 rounded-full font-black text-[10px] uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl">
                      <Play size={12} fill="currentColor" /> Watch Step-by-Step Logic
                    </button>
                  )}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepDone = appMode === 'practice' ? userCheckedInstructions[i] : (highlightedInstruction >= i && highlightedInstruction !== -1);
                    const isHighlight = appMode === 'concept' && highlightedInstruction === i;
                    return (
                      <button key={i} onClick={() => setUserCheckedInstructions(prev => { const n = [...prev]; n[i] = !n[i]; return n; })} disabled={appMode === 'concept'}
                        className={`flex items-start text-left gap-3 p-3 rounded-2xl transition-all duration-500 border-2
                        ${isHighlight ? 'bg-yellow-400/10 border-yellow-400 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : isStepDone ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5 hover:border-white/10'}`}
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

            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialNarrative && (
                <motion.div key={tutorialNarrative} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`${isTutorialComplete ? 'bg-green-600 ring-green-400/20 shadow-green-500/20' : 'bg-cyan-600 ring-cyan-400/20 shadow-cyan-500/20'} text-white px-8 py-5 rounded-[2rem] text-sm sm:text-base font-black text-center max-w-xl mb-10 shadow-2xl border-b-4 border-black/40 relative ring-4 transition-all`}
                >
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 ${isTutorialComplete ? 'bg-green-600' : 'bg-cyan-600'} rotate-45 transition-all`} />
                  <span className="flex items-center justify-center gap-2 text-[10px] opacity-70 mb-2 uppercase tracking-widest"><Search size={12}/> Slow Deduction Walkthrough</span>
                  {tutorialNarrative}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SLOTS */}
            <div className="w-full flex items-end justify-center py-6 px-2 gap-3 sm:gap-6 relative">
              {placedPeople.map((id, idx) => {
                const person = id ? PEOPLE_DATA[id] : null;
                const facing = peopleFacings[idx];
                const image = person ? person.images[facing] : null;
                const isTutoTarget = appMode === 'concept' && tutorialStep !== -1 && (
                   idx === MISSIONS.concept.steps[tutorialStep]?.slot
                );

                return (
                  <div key={idx} className="flex flex-col items-center gap-4">
                    <div 
                      ref={el => slotRefs.current[idx] = el}
                      className={`relative w-24 h-36 sm:w-40 sm:h-60 rounded-[1rem] sm:rounded-[2rem] border-4 transition-all duration-500 flex items-center justify-center overflow-hidden
                        ${person ? 'border-yellow-400 bg-black/60 scale-100 shadow-[0_0_25px_rgba(250,204,21,0.2)]' : 'border-dashed border-white/10 bg-white/5 shadow-inner'}
                        ${isTutoTarget ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#3e2723] scale-105' : ''}`}
                    >
                      {person ? (
                        <div className="w-full h-full relative">
                          <motion.img 
                            layoutId={`char-${id}-${facing}`} 
                            src={image} 
                            className="w-full h-full object-cover object-top pointer-events-none" 
                            draggable="false" 
                            initial={false}
                            transition={{ type: "spring", stiffness: 350, damping: 35 }}
                          />
                          {!isArrangementCorrect && appMode !== 'concept' && (
                            <button onClick={() => {
                                setPlacedPeople(prev => { const n = [...prev]; n[idx] = null; return n; });
                                setPeopleFacings(prev => { const n = [...prev]; n[idx] = null; return n; });
                            }} className="absolute top-2 right-2 bg-red-500 p-2 rounded-full z-20 shadow-lg hover:scale-110 active:scale-90 transition-transform"><Trash2 size={14} className="text-white" /></button>
                          )}
                        </div>
                      ) : <div className="opacity-10"><Users size={32} className="text-white" /></div>}
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`px-3 py-1 rounded-full border-2 text-[8px] font-black uppercase transition-colors
                            ${!person ? 'bg-black/20 border-white/5 text-white/10' : 
                              facing === 'away' ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-rose-600 border-rose-400 text-white'}`}>
                           {facing || 'Empty'}
                        </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-[10px]">#{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* POOL */}
            <div className="mt-8 p-6 bg-black/30 rounded-[2.5rem] border border-white/10 w-full max-w-5xl flex flex-col items-center shadow-2xl relative">
               <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }} />
              
              <div className="flex flex-col items-center mb-6 relative z-10">
                <span className="text-[10px] font-black text-[#a88a6d] uppercase tracking-[0.4em] text-center">People Pool</span>
                <p className="text-[#a88a6d]/50 text-[9px] uppercase font-bold tracking-widest mt-1">Select version & place on seats</p>
              </div>

              <div className="w-full relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
                  {ALL_POOL_ITEMS.map((item, idx) => {
                    const person = PEOPLE_DATA[item.id];
                    const isItemPlaced = placedPeople.some((id, seatIdx) => id === item.id && peopleFacings[seatIdx] === item.facing);
                    
                    return (
                      <div key={`${item.id}-${item.facing}`} className="relative w-28 h-42 sm:w-32 sm:h-48">
                        <div className={`absolute inset-0 rounded-2xl border-2 border-white/5 overflow-hidden transition-all duration-300
                          ${isItemPlaced ? 'opacity-10 grayscale scale-90' : 'opacity-0'}`}>
                           <img src={person.images[item.facing]} className="w-full h-full object-cover object-top" draggable="false" />
                        </div>
                        
                        <motion.div 
                          layoutId={`char-${item.id}-${item.facing}`}
                          drag={appMode === 'practice' && !isArrangementCorrect && !isItemPlaced}
                          dragConstraints={containerRef}
                          dragElastic={0}
                          dragSnapToOrigin={true}
                          onDragEnd={(e, info) => handleDragEnd(e, info, item.id, item.facing)}
                          whileHover={{ scale: isItemPlaced ? 1 : 1.05, y: isItemPlaced ? 0 : -5 }}
                          whileDrag={{ 
                            scale: 1.05, 
                            zIndex: 1000, 
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
                            pointerEvents: "none" 
                          }}
                          className={`absolute inset-0 rounded-2xl border-4 border-white/10 shadow-xl overflow-hidden bg-[#2a1a16] touch-none transition-opacity
                            ${appMode === 'practice' && !isItemPlaced ? 'cursor-grab active:cursor-grabbing hover:border-white/30' : 'cursor-default'}
                            ${isItemPlaced ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                        >
                          <img src={person.images[item.facing]} className="w-full h-full object-cover object-top pointer-events-none" draggable="false" />
                          
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-6 pb-2 px-1 border-t border-white/5 backdrop-blur-[2px]">
                              <p className="text-white text-[8px] sm:text-[10px] font-black text-center uppercase tracking-tighter leading-none">{item.label}</p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-[2rem] border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-green-400 font-black uppercase text-sm tracking-widest text-center">
                      {isTutorialComplete ? "Logic Mastered!" : "Grandmaster Verdict: Arrangement Solved!"}
                    </span>
                 </div>
                 {appMode === 'concept' && <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline underline-offset-4 decoration-white/20 shadow-xl"><RotateCcw size={14} /> Replay Demo</button>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* QUIZ */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[3rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[350px]">
          <div className="absolute inset-0 opacity-[0.1]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-8">
               <div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse shadow-inner"><GraduationCap size={32} /></div>
               <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase tracking-tight text-center px-4 leading-tight">Expert Deduction Challenge</h2>
               <p className="text-[#3e2723]/60 font-bold text-sm max-w-sm italic text-center">Observe extremes and work your way into the center using relative positions.</p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <span className="bg-[#3e2723] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase">Question {activeQuestionIndex + 1} of {mission.questions.length}</span>
                  </div>
                  <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight px-4 leading-tight text-center max-w-3xl mx-auto">{mission.questions[activeQuestionIndex]?.q}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mx-auto px-4">
                    {mission.questions[activeQuestionIndex]?.options.map((option, idx) => {
                      const isSel = selectedOption === idx;
                      const btnClass = isSel && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg scale-105' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 shadow-sm';
                      return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 sm:p-8 rounded-[2rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-2 right-2 opacity-40" size={20} />}</button>;
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center">
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-6 tracking-tight text-shadow-sm text-center">Grandmaster Status!</h2>
                   <button onClick={() => setAppMode('practice')} className="bg-[#2a1a16] text-[#e6dccb] px-12 py-5 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl flex items-center gap-2 mx-auto hover:scale-105 transition-all">Start Practice <ChevronRight size={20} /></button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
         <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect} className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Lightbulb size={18} /> View Deduction Logic</button>
         <button onClick={handleNext} className={`flex-1 p-5 rounded-[2rem] font-black uppercase text-[11px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-2 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Start Practice' : 'Skip Challenge')} <ChevronRight size={18} /></button>
      </div>

      {/* SESSION COMPLETE */}
      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-10 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={64} className="animate-bounce" /></div>
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Grandmaster Logician!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-10 max-w-md mx-auto text-center px-4">"You solved a spatially complex chain using only relative clues and orientation logic. You are in the top 1% of logicians!"</p>
                <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="relative z-10 px-12 py-6 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[3.5rem] p-8 sm:p-14 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-center">
              <button onClick={() => setIsExplaining(false)} className="absolute top-8 right-8 p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 shadow-xl z-20"><CloseIcon size={24} /></button>
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-10 flex items-center justify-center gap-5"><ArrowRightLeft size={40} className="text-[#8d6e63]" /> Spatial Deduction</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-6 text-left">
                {(mission.questions?.[activeQuestionIndex]?.explanation || mission.explanation || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-8 rounded-[2rem] border-l-[16px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-lg leading-relaxed font-black italic">"{line}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full mt-10 py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2.5rem] uppercase border-b-8 border-black text-lg tracking-widest shadow-2xl transition-all active:translate-y-1">Got It!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}