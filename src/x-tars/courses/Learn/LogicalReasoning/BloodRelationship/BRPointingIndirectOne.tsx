import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  BookOpen,
  UserCircle,
  User,
  Check,
  Zap,
  Baby,
  ChevronRight,
  GitBranch,
  ArrowRight,
  MousePointer2,
  X,
  Square,
  CheckSquare,
  Info,
  RefreshCw,
  Search,
  Key,
  Heart,
  Sparkles,
  Target
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================

const NOTATION_LEGEND = [
  { code: "(M)", meaning: "Male Marker", genderA: "M" },
  { code: "(F)", meaning: "Female Marker", genderA: "F" },
  { code: "(=)", meaning: "Marriage Bond", genderA: "N/A" },
  { code: "(--)", meaning: "Sibling Bond", genderA: "N/A" },
  { code: "(↓)", meaning: "Generational Drop", genderA: "N/A" }
];

const CONCEPT_PROTOCOLS = [
  {
    id: "step-0",
    tab: "Objective",
    title: "The Pointing Strategy",
    highlight: "",
    definition: "Objective: How is Y related to X?",
    logicPoints: [
      "SCENARIO: X introduces Y saying, 'He is the husband of the grand daughter of the father of my father.'",
      "GOLDEN RULE: Always start at the word 'my' and work backwards piece by piece.",
      "Let's break this sentence down to build the tree."
    ],
    visual: { type: 'step-build', step: 0 }
  },
  {
    id: "step-1",
    tab: "Step 1",
    title: "Find the Anchor",
    highlight: "my father",
    definition: "Sentence: ...the father of my father.",
    logicPoints: [
      "ANCHOR: Start with the speaker, X.",
      "PHRASE: 'my father' refers to X's direct parent.",
      "ACTION: Place 'Father' strictly vertical, directly above X."
    ],
    visual: { type: 'step-build', step: 1 }
  },
  {
    id: "step-2",
    tab: "Step 2",
    title: "Move Backwards",
    highlight: "father of my father",
    definition: "Sentence: ...the grand daughter of the father of my father.",
    logicPoints: [
      "PHRASE: The 'father of' the node we just placed.",
      "DEDUCTION: The father of X's father is X's Grandfather.",
      "ACTION: Place 'Grandfather' strictly vertical above 'Father'."
    ],
    visual: { type: 'step-build', step: 2 }
  },
  {
    id: "step-3",
    tab: "Step 3",
    title: "Trace Downwards",
    highlight: "grand daughter of the father of my father",
    definition: "Sentence: ...the husband of the grand daughter of...",
    logicPoints: [
      "PHRASE: The 'grand daughter of' the Grandfather.",
      "DEDUCTION: A grand daughter is the daughter of the Father. This makes her X's Sister!",
      "ACTION: Place 'Sister' on the exact same horizontal sibling tier as X."
    ],
    visual: { type: 'step-build', step: 3 }
  },
  {
    id: "step-4",
    tab: "Step 4",
    title: "The Final Link",
    highlight: "husband of the grand daughter of the father of my father",
    definition: "Sentence: He is the husband of the grand daughter...",
    logicPoints: [
      "PHRASE: The 'husband of' the Sister.",
      "ACTION: Place Y next to Sister with a Marriage Bond (=).",
      "FINAL DEDUCTION: Y is married to X's sister. Y is X's Brother-in-Law!"
    ],
    visual: { type: 'step-build', step: 4 }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Trial 1: The Only Son",
    expression: "She is the daughter of my father's only son.",
    objective: "How is She (B) related to Speaker (A)?",
    characters: [
      { id: 'FATH', gender: 'M' },
      { id: 'A', gender: 'M' },
      { id: 'B', gender: 'F' }
    ],
    clues: [
      "Start at 'my father'. (A's father)",
      "Who is the 'only son' of A's father? It must be A himself!",
      "Place B as the daughter of A."
    ],
    template: 'practice-t1',
    slots: [
      { id: 0, expectedId: 'FATH', label: 'Drop Node' },
      { id: 1, expectedId: 'A', label: 'Drop Node' },
      { id: 2, expectedId: 'B', label: 'Drop Node' }
    ],
    followUp: {
      q: "Based on your deduction, how is B related to A?",
      options: ["Niece", "Daughter", "Sister"],
      correct: 1,
      explanation: "A is the only son of his father. The daughter of A is logically A's own Daughter."
    }
  },
  {
    mission: "Trial 2: The Only Daughter",
    expression: "He is the son of the only daughter of my mother.",
    objective: "How is He (N) related to Speaker (M)?",
    characters: [
      { id: 'MOTH', gender: 'F' },
      { id: 'M', gender: 'M' },
      { id: 'SIS', gender: 'F' },
      { id: 'N', gender: 'M' }
    ],
    clues: [
      "Start at 'my mother'. (M's mother)",
      "The 'only daughter' of M's mother is M's sister.",
      "He (N) is the son of M's sister."
    ],
    template: 'practice-t2',
    slots: [
      { id: 0, expectedId: 'MOTH', label: 'Drop Node' },
      { id: 1, expectedId: 'M', label: 'Drop Node' },
      { id: 2, expectedId: 'SIS', label: 'Drop Node' },
      { id: 3, expectedId: 'N', label: 'Drop Node' }
    ],
    followUp: {
      q: "How is N related to M?",
      options: ["Son", "Nephew", "Cousin"],
      correct: 1,
      explanation: "N is the son of M's sister. A sister's son is a Nephew."
    }
  },
  {
    mission: "Trial 3: The Grandson",
    expression: "She is the wife of the grandson of my mother.",
    objective: "How is She (Q) related to Speaker (P)?",
    characters: [
      { id: 'MOTH', gender: 'F' },
      { id: 'P', gender: 'M' },
      { id: 'SON', gender: 'M' },
      { id: 'Q', gender: 'F' }
    ],
    clues: [
      "'My mother' -> P's mother.",
      "The 'grandson' of P's mother -> P's son.",
      "She (Q) is the wife of P's son."
    ],
    template: 'practice-t3',
    slots: [
      { id: 0, expectedId: 'MOTH', label: 'Drop Node' },
      { id: 1, expectedId: 'P', label: 'Drop Node' },
      { id: 2, expectedId: 'SON', label: 'Drop Node' },
      { id: 3, expectedId: 'Q', label: 'Drop Node' }
    ],
    followUp: {
      q: "How is Q related to P?",
      options: ["Daughter", "Daughter-in-law", "Niece"],
      correct: 1,
      explanation: "Q is the wife of P's son. A son's wife is a Daughter-in-law."
    }
  },
  {
    mission: "Trial 4: The Circular Trap",
    expression: "He is the brother of the daughter of the wife of my husband.",
    objective: "How is He (B) related to Speaker (W)?",
    characters: [
      { id: 'HUSB', gender: 'M' },
      { id: 'W', gender: 'F' },
      { id: 'DAU', gender: 'F' },
      { id: 'B', gender: 'M' }
    ],
    clues: [
      "'Wife of my husband' -> That is W herself!",
      "'Daughter of W' -> W's daughter.",
      "He (B) is the brother of W's daughter."
    ],
    template: 'practice-t4',
    slots: [
      { id: 0, expectedId: 'HUSB', label: 'Drop Node' },
      { id: 1, expectedId: 'W', label: 'Drop Node' },
      { id: 2, expectedId: 'DAU', label: 'Drop Node' },
      { id: 3, expectedId: 'B', label: 'Drop Node' }
    ],
    followUp: {
      q: "After tracing the circle, how is B related to W?",
      options: ["Brother", "Son", "Nephew"],
      correct: 1,
      explanation: "B is the brother of W's daughter. The brother of a daughter is the parents' Son."
    }
  },
  {
    mission: "Trial 5: Master Challenge",
    expression: "He is the husband of the grand daughter of the father of my father.",
    objective: "How is Y related to X?",
    characters: [
      { id: 'GF', gender: 'M' },
      { id: 'FATH', gender: 'M' },
      { id: 'X', gender: 'M' },
      { id: 'SIS', gender: 'F' },
      { id: 'Y', gender: 'M' }
    ],
    clues: [
      "Build the exact tree you learned in Concept Mode.",
      "GF at the top, Father below him, X and Sis below him, Y married to Sis."
    ],
    template: 'practice-t5',
    slots: [
      { id: 0, expectedId: 'GF', label: 'Drop Node' },
      { id: 1, expectedId: 'FATH', label: 'Drop Node' },
      { id: 2, expectedId: 'X', label: 'Drop Node' },
      { id: 3, expectedId: 'SIS', label: 'Drop Node' },
      { id: 4, expectedId: 'Y', label: 'Drop Node' }
    ],
    followUp: {
      q: "FINAL DEDUCTION: How is Y related to X?",
      options: ["Brother", "Brother-in-law", "Cousin"],
      correct: 1,
      explanation: "Y is the husband of X's sister. Therefore, Y is the Brother-in-law!"
    }
  }
];

// ==========================================
// RENDER COMPONENTS
// ==========================================

const HighlightedString = ({ fullString, highlight }) => {
  if (!highlight || !fullString.includes(highlight)) return <span>{fullString}</span>;
  const parts = fullString.split(highlight);
  return (
    <span className="leading-relaxed">
      {parts[0]}
      <span className="bg-amber-400 text-black px-1.5 py-0.5 mx-0.5 rounded shadow-sm">{highlight}</span>
      {parts.slice(1).join(highlight)}
    </span>
  );
};

function Node({ data, color, isSmall, isExtraSmall, isDraggable = false, onDragEnd, onRemove, showRemove }) {
  if (!data) return null;
  const genderLabel = data.gender || data.g;
  const Icon = genderLabel === 'M' ? UserCircle : genderLabel === 'F' ? User : Baby;

  const sizeClasses = isExtraSmall
    ? 'w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16'
    : isSmall
      ? 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20'
      : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24';

  const textClasses = isExtraSmall
    ? 'text-[10px] sm:text-xs lg:text-sm'
    : data.id.length <= 2
      ? 'text-3xl sm:text-5xl'
      : isSmall
        ? 'text-[10px] sm:text-sm'
        : 'text-sm sm:text-lg lg:text-2xl';
        
  const badgeClasses = isExtraSmall
    ? '-top-2 w-4 h-4 text-[6px] sm:-top-2 sm:w-5 sm:h-5 sm:text-[7px]'
    : isSmall
      ? '-top-2 w-5 h-5 text-[7px] sm:-top-2.5 sm:w-7 sm:h-7 sm:text-[9px]'
      : '-top-2 w-6 h-6 text-[8px] sm:-top-3 sm:w-8 sm:h-8 sm:text-[10px]';

  return (
    <motion.div 
      drag={isDraggable}
      dragSnapToOrigin={true}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 999 }}
      className={`flex flex-col items-center gap-1 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`${sizeClasses} rounded-full ${color} flex items-center justify-center text-white shadow-xl border-2 border-white/20 relative z-10 transition-transform`}>
        <Icon className="absolute inset-0 m-auto opacity-30 w-3/5 h-3/5" />
        <div className={`${textClasses} font-black drop-shadow-md text-center px-1 z-10 uppercase tracking-tighter`}>{data.id}</div>
        <div className={`absolute ${badgeClasses} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-sm border border-[#1a0f0d] z-20`}>
          ({genderLabel})
        </div>
        {showRemove && (
            <button 
                onClick={onRemove}
                className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-rose-600 text-white rounded-full p-0.5 sm:p-1 shadow-lg hover:bg-rose-500 active:scale-90 transition-all z-50 border border-white/20"
            >
                <X size={10} strokeWidth={3} />
            </button>
        )}
      </div>
    </motion.div>
  );
}

function Slot({ data, placedId, characters, isSmall, isExtraSmall, onRemove, showRemove }) {
    const placedData = placedId ? characters.find(c => c.id === placedId) : null;
    
    const sizeClasses = isExtraSmall
      ? 'w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16'
      : isSmall
        ? 'w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20'
        : 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24';

    return (
        <div data-slot-id={data.id} className="flex flex-col items-center justify-center relative">
            {placedData ? (
                <Node data={placedData} color="bg-indigo-600" isSmall={isSmall} isExtraSmall={isExtraSmall} showRemove={showRemove} onRemove={onRemove} />
            ) : (
                <div className={`${sizeClasses} rounded-full border-2 border-dashed border-[#c4a484]/40 bg-[#1a110f] flex items-center justify-center shadow-inner relative z-10`}>
                    <MousePointer2 className="text-white/20 w-4 h-4 sm:w-5 sm:h-5" />
                </div>
            )}
            {data.label && !placedData && (
                <span className={`absolute -bottom-4 sm:-bottom-5 text-[#dfc4a1] font-black text-[5px] sm:text-[7px] px-1.5 py-0.5 sm:px-2 sm:py-0.5 uppercase tracking-widest bg-black/60 rounded-full z-10 border border-white/5 shadow-md whitespace-nowrap`}>
                    {data.label}
                </span>
            )}
        </div>
    );
}

export function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeTab, setActiveTab] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [practicePhase, setPracticePhase] = useState('build');
  const [placedItems, setPlacedItems] = useState({});
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [completedClues, setCompletedClues] = useState([]);
  
  const containerRef = useRef(null);

  const handleReset = () => {
    setActiveTab(0);
    setPracticeStep(0);
    setPracticePhase('build');
    setPlacedItems({});
    setQuizFeedback(null);
    setShowExplanation(false);
    setLessonFinished(false);
    setCompletedClues([]);
  };

  const toggleClue = (idx) => {
    setCompletedClues(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleDragEnd = (itemId, event, info) => {
    let clientX, clientY;

    if (event && (event.type.includes('touch') || event.pointerType === 'touch')) {
        const touch = event.changedTouches ? event.changedTouches[0] : (event.touches ? event.touches[0] : event);
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else if (event && event.clientX !== undefined && event.clientY !== undefined) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else if (info && info.point) {
        clientX = info.point.x - window.scrollX;
        clientY = info.point.y - window.scrollY;
    } else {
        return;
    }

    const slots = document.querySelectorAll(`[data-slot-id]`);
    const slotElement = Array.from(slots).find(s => {
        const rect = s.getBoundingClientRect();
        const pad = 30; 
        return (
            clientX > rect.left - pad && clientX < rect.right + pad &&
            clientY > rect.top - pad && clientY < rect.bottom + pad
        );
    });

    if (slotElement) {
        const sId = parseInt(slotElement.getAttribute('data-slot-id'), 10);
        if (placedItems[sId]) return;
        setPlacedItems(prev => ({ ...prev, [sId]: itemId }));
    }
  };

  const removePlaced = (slotId) => {
    const next = { ...placedItems };
    delete next[slotId];
    setPlacedItems(next);
  };

  const validateBuild = () => {
    const task = PRACTICE_TASKS[practiceStep];
    const isCorrect = task.slots.every(slot => placedItems[slot.id] === slot.expectedId);
    if (isCorrect) setPracticePhase('quiz');
  };

  const handleQuizSelection = (idx) => {
    const task = PRACTICE_TASKS[practiceStep];
    const isCorrect = idx === task.followUp.correct;
    setQuizFeedback({ selected: idx, isCorrect });
    if (isCorrect) setShowExplanation(true);
  };

  const goToPracticeStep = (stepIndex) => {
    setPracticeStep(stepIndex);
    setPracticePhase('build');
    setPlacedItems({});
    setQuizFeedback(null);
    setShowExplanation(false);
    setCompletedClues([]);
  };

  const prevPracticeTask = () => {
    if (practiceStep > 0) goToPracticeStep(practiceStep - 1);
  };

  const skipPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  const nextPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#0f0a09] font-sans select-none overflow-hidden text-[#a88a6d] overscroll-none" ref={containerRef}>
      
      {/* HEADER */}
      <header className="w-full shrink-0 p-2 sm:p-3 bg-[#0f0a09]/95 border-b border-white/5 shadow-sm z-[100]">
        <div className="w-full max-w-7xl mx-auto bg-[#1a0f0d] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
            <div className="flex flex-col items-start leading-tight px-1 sm:px-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[8px] sm:text-[10px]">
                    <ChevronLeft size={10} sm:size={12} /> Dashboard
                </button>
                <span className="text-white font-black uppercase text-[12px] sm:text-[16px] tracking-tight flex items-center gap-1.5 sm:gap-2 mt-0.5">
                    <Search size={14} className="text-amber-400 sm:w-[18px] sm:h-[18px]" /> {appMode === 'concept' ? "Indirect Relations" : "Pointing Lab"}
                </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
                    <button onClick={() => { setAppMode('concept'); handleReset(); }} className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[9px] sm:text-[12px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
                    <button onClick={() => { setAppMode('practice'); handleReset(); }} className={`px-2 py-1 sm:px-4 sm:py-1.5 rounded-md text-[9px] sm:text-[12px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
                </div>
                <button onClick={handleReset} className="p-1.5 sm:p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all shadow-md"><RotateCcw size={14} sm:size={16} /></button>
            </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA - FLUID FLEX LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-2 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.4] lg:flex-[1.6] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col overflow-hidden min-h-0">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            {/* PERSISTENT TARGET STRING HEADER */}
            {!lessonFinished && (
                <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1 bg-[#1a110f] px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-white/10 shadow-2xl w-11/12 max-w-[340px] sm:max-w-[480px]">
                    <div className="flex items-center gap-1 sm:gap-2 text-emerald-400">
                        <Target size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-center">
                            {appMode === 'concept' ? "How is Y related to X?" : PRACTICE_TASKS[practiceStep].objective}
                        </span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10 my-0.5 sm:my-1"></div>
                    <span className="font-mono text-[9px] sm:text-xs lg:text-sm text-white font-bold tracking-wide flex items-center text-center leading-tight">
                      {appMode === 'concept' ? (
                         CONCEPT_PROTOCOLS[activeTab].tab === "Objective" 
                            ? <span className="text-emerald-400">"He is the husband of the grand daughter of the father of my father."</span>
                            : <HighlightedString fullString="He is the husband of the grand daughter of the father of my father." highlight={CONCEPT_PROTOCOLS[activeTab].highlight} />
                      ) : (
                         `"${PRACTICE_TASKS[practiceStep].expression}"`
                      )}
                    </span>
                </div>
            )}

            <div className="w-full h-full flex flex-col items-center justify-center pt-16 sm:pt-20 pb-2 px-2 overflow-y-auto no-scrollbar">
              <AnimatePresence mode="wait">
                {!lessonFinished ? (
                   <motion.div 
                    key={`${appMode}-${activeTab}-${practiceStep}-${practicePhase}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                   >
                     {appMode === 'concept' ? (
                       <TreeVisual data={CONCEPT_PROTOCOLS[activeTab].visual} />
                     ) : (
                       <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-8 w-full">
                         
                         {/* DRAG TARGET CIRCLE */}
                         <div className="relative flex-shrink-0 bg-[#1a110f] rounded-full border border-white/5 shadow-inner w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[380px] lg:h-[380px] flex items-center justify-center">
                             <div className="w-[85%] h-[85%] relative">
                                <PracticeTemplate 
                                    task={PRACTICE_TASKS[practiceStep]} 
                                    placedItems={placedItems}
                                    onRemove={practicePhase === 'build' ? removePlaced : null}
                                    showRemove={practicePhase === 'build'}
                                />
                             </div>
                         </div>
                         
                         {/* DRAGGABLE CHARACTER PALETTE */}
                         {practicePhase === 'build' && (
                             <div className="flex flex-row lg:flex-col flex-wrap justify-center items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-[#1a110f] rounded-2xl sm:rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm z-20 shrink-0">
                                {PRACTICE_TASKS[practiceStep].characters.map(char => {
                                    const isPlaced = Object.values(placedItems).includes(char.id);
                                    const isComplexGrid = PRACTICE_TASKS[practiceStep].template !== 'practice-t1';
                                    return (
                                        <div key={char.id} className="relative">
                                            <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
                                                <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(e, info) => handleDragEnd(char.id, e, info)} isSmall={!isComplexGrid} isExtraSmall={isComplexGrid} />
                                            </div>
                                            {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={24} /></div>}
                                        </div>
                                    );
                                })}
                             </div>
                         )}
                       </div>
                     )}
                   </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Trophy size={80} className="text-yellow-400 animate-bounce drop-shadow-xl mb-4" />
                    <h2 className="text-white text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none mb-6">LOGIC CERTIFIED</h2>
                    <div className="flex flex-row gap-3 w-full justify-center max-w-sm">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 py-3 rounded-xl font-black uppercase text-[10px] sm:text-sm shadow-xl transition-all">
                            Restart
                        </button>
                        <button onClick={handleReset} className="flex-[1.5] bg-amber-400 text-black border-b-4 sm:border-b-6 border-amber-600 py-3 rounded-xl font-black uppercase text-[10px] sm:text-sm shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        </div>

        {/* BOTTOM PANEL - LOGS & CONTROLS */}
        <div className="flex-[0.6] lg:flex-[0.8] w-full bg-[#1a0f0d] p-2 sm:p-3 rounded-[1.5rem] sm:rounded-[2rem] border-t-2 sm:border-t-4 border-b-[6px] sm:border-b-[8px] border-black shadow-2xl flex flex-col md:flex-row gap-2 min-h-0 overflow-hidden">
            
            {/* LEFT: MASTER LEGEND & CLUES */}
            <div className="flex-[1.2] flex flex-col bg-black/40 rounded-xl border border-white/10 p-2 sm:p-3 overflow-y-auto custom-scrollbar min-h-0">
                
                {/* COMPACT MASTER LEGEND */}
                <div className="bg-[#1a110f] p-2 sm:p-3 rounded-lg border border-white/5 mb-2 shadow-sm shrink-0">
                  <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                    {NOTATION_LEGEND.map((leg, i) => (
                      <div key={i} className="flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-white/5 whitespace-nowrap">
                        <span className="text-yellow-400 font-mono font-black">{leg.code}</span>
                        <span className="text-white/80 font-bold">{leg.meaning.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC CONTENT */}
                {appMode === 'concept' ? (
                   <div className="space-y-2 mt-1 px-1">
                     <p className="text-white text-xs sm:text-sm lg:text-base font-black border-b border-white/5 pb-1 flex items-center gap-1.5 uppercase tracking-tighter"><GitBranch size={12} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-1 sm:space-y-1.5 text-white/80">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-1.5 text-left"><Check size={10} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white font-bold italic text-[9px] sm:text-[11px] lg:text-xs leading-snug tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-2 h-full mt-1">
                     <div className="flex items-center justify-between pb-1.5 border-b border-white/10 shrink-0">
                        <span className="text-orange-400 font-black text-[9px] sm:text-[11px] uppercase tracking-[0.15em] opacity-80">
                            {PRACTICE_TASKS[practiceStep].mission}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <button onClick={prevPracticeTask} disabled={practiceStep === 0} className="p-1 bg-white/5 rounded border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all">
                                <ChevronLeft size={12} className="text-orange-400" />
                            </button>
                            <button onClick={skipPracticeTask} className="p-1 bg-white/5 rounded border border-white/5 hover:bg-white/10 transition-all">
                                <ChevronRight size={12} className="text-orange-400" />
                            </button>
                        </div>
                     </div>
                     <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1">
                        {PRACTICE_TASKS[practiceStep].clues.map((clue, i) => (
                            <div key={i} className="flex items-start gap-2 text-left text-white/60 text-[9px] sm:text-[11px] italic">
                                <Info size={12} className="shrink-0 mt-0.5" />
                                <p className="leading-snug">{clue}</p>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
            </div>

            {/* RIGHT: INTERACTION / QUIZ */}
            <div className="flex-1 flex flex-col bg-[#2a1a16] rounded-xl border border-white/5 p-2 sm:p-3 overflow-hidden min-h-0 relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col justify-center gap-2 sm:gap-3">
                         <div className="flex flex-wrap justify-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5 shrink-0">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-1 px-2 rounded-md text-[8px] sm:text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeTab === i ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center shadow-inner overflow-y-auto custom-scrollbar">
                            <p className="text-white text-[10px] sm:text-xs font-bold leading-snug italic px-2 mb-2 sm:mb-4">Trace the deduction backward chunk by chunk.</p>
                            <button onClick={() => activeTab === CONCEPT_PROTOCOLS.length - 1 ? setAppMode('practice') : setActiveTab(prev => prev + 1)} className="flex items-center gap-2 bg-emerald-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-black uppercase text-[9px] sm:text-[11px] shadow-lg border-b-2 border-emerald-800 active:scale-95 transition-all">
                                {activeTab === CONCEPT_PROTOCOLS.length - 1 ? "Start Practice" : "Next Step"} <ArrowRight size={12} />
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="practice-ui" className="w-full h-full flex flex-col gap-2">
                         {practicePhase === 'build' ? (
                             <div className="flex flex-col items-center justify-center h-full gap-3 sm:gap-4 px-2">
                                <p className="text-stone-400 text-[9px] sm:text-[11px] uppercase font-black text-center leading-relaxed tracking-wider border-b border-white/5 pb-2 w-full">
                                  Drag nodes into slots to build the tree.
                                </p>
                                <button onClick={validateBuild} disabled={Object.keys(placedItems).length < PRACTICE_TASKS[practiceStep].slots.length} className={`px-6 py-2 sm:py-3 rounded-xl font-black uppercase text-[10px] sm:text-xs shadow-xl transition-all active:scale-95 flex items-center gap-2 border-b-2 sm:border-b-4 ${Object.keys(placedItems).length >= PRACTICE_TASKS[practiceStep].slots.length ? 'bg-amber-400 text-black border-amber-700 hover:scale-105' : 'bg-black/40 text-white/20 border-transparent pointer-events-none'}`}>Validate Arrangement <ChevronRight size={14} /></button>
                             </div>
                         ) : (
                            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pt-1 text-white pr-1">
                                <div className="bg-black/20 p-2 sm:p-3 rounded-lg border border-white/5 mb-2 text-center shadow-inner shrink-0">
                                    <p className="text-white text-[10px] sm:text-[13px] lg:text-sm font-black leading-snug tracking-tight">{PRACTICE_TASKS[practiceStep].followUp.q}</p>
                                </div>
                                <div className="flex flex-col gap-1.5 shrink-0">
                                    {PRACTICE_TASKS[practiceStep].followUp.options.map((opt, i) => {
                                        const isSelected = quizFeedback?.selected === i;
                                        const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].followUp.correct;
                                        let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400 shadow-emerald-500/20" : "bg-rose-600 border-rose-400 shadow-rose-500/20") : "bg-black/40 border-white/10 text-white/80";
                                        if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-emerald-500/20";
                                        return (<button key={i} disabled={quizFeedback?.isCorrect} onClick={() => handleQuizSelection(i)} className={`p-2 rounded-lg font-black uppercase transition-all text-[9px] sm:text-[11px] border border-b-2 ${btnClass} ${!quizFeedback ? 'hover:bg-black/80 hover:border-white/30' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                                {quizFeedback && (
                                    <div className="flex gap-2 w-full mt-3 shrink-0">
                                        {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-2 bg-rose-600 text-white rounded-lg font-black text-[9px] sm:text-[10px] uppercase shadow-md flex items-center justify-center gap-1.5 hover:bg-rose-500 transition-all border-b-2 border-rose-800"><RefreshCw size={12} /> Try Again</button>}
                                        <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-2 text-white rounded-lg font-black text-[9px] sm:text-[10px] uppercase shadow-md flex items-center justify-center gap-1.5 transition-all border-b-2 ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800' : 'bg-blue-600 hover:bg-blue-500 border-blue-800'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={12} />}</button>
                                    </div>
                                )}
                            </div>
                         )}
                      </motion.div>
                    )
                  ) : (
                     <div className="flex items-center justify-center h-full">
                         <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Module Complete</span>
                     </div>
                  )}
                </AnimatePresence>
            </div>
          </div>
      </main>

      {/* STYLES FOR CUSTOM SCROLLBARS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}

function TreeVisual({ data }) {
    if (data.type === 'step-build') {
        const { step } = data;

        if (step === 0) {
            return (
                <div className="relative flex flex-col items-center justify-center text-center p-4">
                    <Target size={64} className="text-emerald-400 mb-6 animate-pulse opacity-80" />
                    <p className="text-white text-lg sm:text-xl font-black mb-3 leading-relaxed">Let's find the hidden relation!</p>
                    <p className="text-[#a88a6d] text-xs sm:text-sm font-bold px-4 max-w-sm">Follow the Golden Rule: Always start at 'my' and trace the path backwards using the legend.</p>
                </div>
            );
        }

        return (
            <div className="relative w-[90%] h-[90%] shrink-0 flex items-center justify-center">
                {step >= 2 && <motion.div layout className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Node data={{id:'GF', g:'M'}} color="bg-stone-600" isExtraSmall />
                </motion.div>}
                
                {step >= 1 && <motion.div layout className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Node data={{id:'FATH', g:'M'}} color="bg-stone-600" isExtraSmall />
                </motion.div>}

                {step >= 1 && <motion.div layout className={`absolute top-[85%] -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 ease-in-out ${step >= 3 ? 'left-[20%]' : 'left-[50%]'}`}>
                    <Node data={{id:'X', g:'M'}} color="bg-blue-600" isExtraSmall />
                </motion.div>}
                
                {step >= 3 && <motion.div layout className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Node data={{id:'SIS', g:'F'}} color="bg-purple-600" isExtraSmall />
                </motion.div>}
                
                {step >= 4 && <motion.div layout className="absolute top-[85%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Node data={{id:'Y', g:'M'}} color="bg-blue-600" isExtraSmall />
                </motion.div>}

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    
                    {step >= 2 && <>
                        {/* GF to FATH */}
                        <line x1="50" y1="15" x2="50" y2="45" stroke="#facc15" strokeWidth="1.5" />
                        <polygon points="47.5,42 52.5,42 50,46" fill="#facc15" />
                    </>}

                    {step >= 1 && step < 3 && <>
                        {/* Straight drop to X */}
                        <line x1="50" y1="45" x2="50" y2="85" stroke="#facc15" strokeWidth="1.5" />
                        <polygon points="47.5,82 52.5,82 50,86" fill="#facc15" />
                    </>}

                    {step >= 3 && <>
                        {/* Split drop to X and SIS */}
                        <path d="M 50 45 V 60 H 20 V 85 M 50 60 V 85" stroke="#facc15" strokeWidth="1.5" fill="none" />
                        <polygon points="17.5,82 22.5,82 20,86" fill="#facc15" />
                        <polygon points="47.5,82 52.5,82 50,86" fill="#facc15" />
                        {/* Sibling bond */}
                        <line x1="20" y1="85" x2="50" y2="85" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    </>}
                    
                    {step >= 4 && <>
                        {/* SIS = Y Marriage */}
                        <line x1="50" y1="83" x2="80" y2="83" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                        <line x1="50" y1="87" x2="80" y2="87" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    </>}
                </svg>

                {step >= 4 && <div className="absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>}
            </div>
        );
    }

    return null;
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;

    if (template === 'practice-t1') {
        // Father -> A -> B
        return (
            <div className="relative w-full h-full shrink-0">
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                </div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                </div>
                <div className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="50" y1="15" x2="50" y2="50" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="47.5,47 52.5,47 50,51" fill="#facc15" />
                    
                    <line x1="50" y1="50" x2="50" y2="85" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="47.5,82 52.5,82 50,86" fill="#facc15" />
                </svg>
            </div>
        );
    }

    if (template === 'practice-t2') {
        // Mother -> M & Sis. Sis -> N.
        return (
            <div className="relative w-full h-full shrink-0">
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 50 15 V 35 H 20 V 50 M 50 35 H 80 V 50" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="17.5,47 22.5,47 20,51" fill="#facc15" />
                    <polygon points="77.5,47 82.5,47 80,51" fill="#facc15" />
                    
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="80" y1="50" x2="80" y2="85" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="77.5,82 82.5,82 80,86" fill="#facc15" />
                </svg>
            </div>
        );
    }

    if (template === 'practice-t3') {
        // Mother -> P -> Son = Q
        return (
            <div className="relative w-full h-full shrink-0">
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="50" y1="15" x2="50" y2="50" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="47.5,47 52.5,47 50,51" fill="#facc15" />
                    
                    <path d="M 50 50 V 65 H 30 V 85" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="27.5,82 32.5,82 30,86" fill="#facc15" />

                    <line x1="30" y1="83" x2="70" y2="83" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="30" y1="87" x2="70" y2="87" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                </svg>
                
                <div className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    if (template === 'practice-t4') {
        // H = W -> D & B
        return (
            <div className="relative w-full h-full shrink-0">
                <div className="absolute top-[25%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[75%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[75%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="30" y1="23" x2="70" y2="23" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="30" y1="27" x2="70" y2="27" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    
                    <path d="M 50 25 V 50 H 30 V 75 M 50 50 H 70 V 75" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="27.5,72 32.5,72 30,76" fill="#facc15" />
                    <polygon points="67.5,72 72.5,72 70,76" fill="#facc15" />

                    <line x1="30" y1="75" x2="70" y2="75" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
                
                <div className="absolute top-[25%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    if (template === 'practice-t5') {
        // GF -> F -> X & Sis = Y
        return (
            <div className="relative w-full h-full shrink-0">
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[80%] -translate-x-1/2 -translate-y-1/2 z-10">
                    <Slot data={slots[4]} placedId={placedItems[4]} characters={characters} onRemove={() => onRemove(4)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="50" y1="15" x2="50" y2="45" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="47.5,42 52.5,42 50,46" fill="#facc15" />
                    
                    <path d="M 50 45 V 60 H 20 V 85 M 50 60 V 85" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="17.5,82 22.5,82 20,86" fill="#facc15" />
                    <polygon points="47.5,82 52.5,82 50,86" fill="#facc15" />
                    
                    <line x1="20" y1="85" x2="50" y2="85" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="50" y1="83" x2="80" y2="83" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="50" y1="87" x2="80" y2="87" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                </svg>

                <div className="absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    return null;
}

export function App() { return ( <Router> <LabContent /> </Router> ); }
export default App;