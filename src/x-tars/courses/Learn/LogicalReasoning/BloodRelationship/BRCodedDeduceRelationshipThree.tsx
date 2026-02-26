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

const CODE_LEGEND = [
  { code: "A + B", meaning: "A is the Daughter of B", genderA: "F" },
  { code: "A $ B", meaning: "A is the Father of B", genderA: "M" },
  { code: "A @ B", meaning: "A is the Son of B", genderA: "M" },
  { code: "A # B", meaning: "A is the Sister of B", genderA: "F" }
];

const CONCEPT_PROTOCOLS = [
  {
    id: "step-0",
    tab: "Objective",
    title: "The Objective",
    highlight: "",
    definition: "Objective: How is S related to R if 'S $ J @ K # P + R'?",
    logicPoints: [
      "Before building the tree, clearly identify your target.",
      "We need to deduce the final connection between S and R.",
      "We will construct the family tree step-by-step to find out."
    ],
    visual: { type: 'step-build', step: 0 }
  },
  {
    id: "step-1",
    tab: "Step 1",
    title: "Parse: S $ J",
    highlight: "S $ J",
    definition: "Target String: S $ J @ K # P + R",
    logicPoints: [
      "Rule: Always read left-to-right in pairs.",
      "Match '$' in Legend: S is the Father of J.",
      "Gender: S is strictly Male (M).",
      "Action: Place S strictly vertical, directly above J."
    ],
    visual: { type: 'step-build', step: 1 }
  },
  {
    id: "step-2",
    tab: "Step 2",
    title: "Parse: J @ K",
    highlight: "J @ K",
    definition: "Target String: S $ J @ K # P + R",
    logicPoints: [
      "Match '@' in Legend: J is the Son of K.",
      "Deduction: We already know S is J's father.",
      "Action: If K is also J's parent, K must be the Mother! Bond S and K (=) on the top tier."
    ],
    visual: { type: 'step-build', step: 2 }
  },
  {
    id: "step-3",
    tab: "Step 3",
    title: "Parse: K # P",
    highlight: "K # P",
    definition: "Target String: S $ J @ K # P + R",
    logicPoints: [
      "Match '#' in Legend: K is the Sister of P.",
      "Gender check: K is Female (F), matching our previous deduction.",
      "Action: Place P on the exact same horizontal sibling tier as K."
    ],
    visual: { type: 'step-build', step: 3 }
  },
  {
    id: "step-4",
    tab: "Step 4",
    title: "Parse: P + R",
    highlight: "P + R",
    definition: "Target String: S $ J @ K # P + R",
    logicPoints: [
      "Match '+' in Legend: P is the Daughter of R.",
      "Action: Place R vertically above P as her parent.",
      "Final Deduction: S is married to R's daughter (K). S is the Son-in-law of R!"
    ],
    visual: { type: 'step-build', step: 4 }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Trial 1: Common Parent",
    expression: "A @ B # C $ D",
    objective: "How is A related to D?",
    characters: [
      { id: 'C', gender: 'M' },
      { id: 'B', gender: 'F' },
      { id: 'A', gender: 'M' },
      { id: 'D', gender: '?' }
    ],
    clues: [
      "Construct the tree using the Master Legend.",
      "Pay attention to horizontal sibling lines versus vertical parent lines."
    ],
    template: 'practice-t1',
    slots: [
      { id: 0, expectedId: 'B', label: 'Drop Node' },
      { id: 1, expectedId: 'C', label: 'Drop Node' },
      { id: 2, expectedId: 'A', label: 'Drop Node' },
      { id: 3, expectedId: 'D', label: 'Drop Node' }
    ],
    followUp: {
      q: "Based on the completed arrangement, how is A related to D?",
      options: ["Nephew", "Uncle", "Cousin"],
      correct: 2,
      explanation: "A is the son of B. D is the child of C. B and C are siblings. Therefore, the children of siblings are Cousins."
    }
  },
  {
    mission: "Trial 2: The Sibling Trap",
    expression: "P + Q $ R @ S # T",
    objective: "How is T related to P?",
    characters: [
      { id: 'Q', gender: 'M' },
      { id: 'S', gender: 'F' },
      { id: 'T', gender: '?' },
      { id: 'P', gender: 'F' },
      { id: 'R', gender: 'M' }
    ],
    clues: [
      "Use the grid structure to align the generations.",
      "Deduce the unwritten bond between Q and S!"
    ],
    template: 'practice-t2',
    slots: [
      { id: 0, expectedId: 'Q', label: 'Drop Node' },
      { id: 1, expectedId: 'S', label: 'Drop Node' },
      { id: 2, expectedId: 'T', label: 'Drop Node' },
      { id: 3, expectedId: 'P', label: 'Drop Node' },
      { id: 4, expectedId: 'R', label: 'Drop Node' }
    ],
    followUp: {
      q: "Looking at the final grid, how is T related to P?",
      options: ["Maternal Aunt / Uncle", "Paternal Aunt", "Sister"],
      correct: 0,
      explanation: "T is the sibling of S (who is P's mother). Since T's gender is unknown, T is either the Maternal Aunt or Maternal Uncle."
    }
  },
  {
    mission: "Trial 3: The In-Law Offset",
    expression: "U $ V @ W + X $ Y",
    objective: "How is Y related to V?",
    characters: [
      { id: 'X', gender: 'M' },
      { id: 'U', gender: 'M' },
      { id: 'W', gender: 'F' },
      { id: 'Y', gender: '?' },
      { id: 'V', gender: 'M' }
    ],
    clues: [
      "Watch the flow closely. Who sits at the very top of this hierarchy?"
    ],
    template: 'practice-t3',
    slots: [
      { id: 0, expectedId: 'X', label: 'Drop Node' },
      { id: 1, expectedId: 'U', label: 'Drop Node' },
      { id: 2, expectedId: 'W', label: 'Drop Node' },
      { id: 3, expectedId: 'Y', label: 'Drop Node' },
      { id: 4, expectedId: 'V', label: 'Drop Node' }
    ],
    followUp: {
      q: "How is Y related to V?",
      options: ["Grandfather", "Maternal Aunt / Uncle", "Cousin"],
      correct: 1,
      explanation: "Y is the sibling of W. W is the mother of V. Therefore, Y is the Maternal Aunt or Uncle of V."
    }
  },
  {
    mission: "Trial 4: The Large Family",
    expression: "M @ N # O @ P $ Q # R",
    objective: "How is Q related to M?",
    characters: [
      { id: 'P', gender: 'M' },
      { id: 'N', gender: 'F' },
      { id: 'O', gender: 'M' },
      { id: 'Q', gender: 'F' },
      { id: 'R', gender: '?' },
      { id: 'M', gender: 'M' }
    ],
    clues: [
      "Four siblings share the same parent tier. Map them carefully!"
    ],
    template: 'practice-t4',
    slots: [
      { id: 0, expectedId: 'P', label: 'Drop Node' },
      { id: 1, expectedId: 'N', label: 'Drop Node' },
      { id: 2, expectedId: 'O', label: 'Drop Node' },
      { id: 3, expectedId: 'Q', label: 'Drop Node' },
      { id: 4, expectedId: 'R', label: 'Drop Node' },
      { id: 5, expectedId: 'M', label: 'Drop Node' }
    ],
    followUp: {
      q: "Based on the massive sibling chain, how is Q related to M?",
      options: ["Sister", "Mother", "Maternal Aunt"],
      correct: 2,
      explanation: "Q is the sister of N. N is the mother of M. The sister of one's mother is the Maternal Aunt."
    }
  },
  {
    mission: "Trial 5: The Master Exam",
    expression: "S $ J @ K # P + R",
    objective: "How is S related to R?",
    characters: [
      { id: 'R', gender: '?' },
      { id: 'K', gender: 'F' },
      { id: 'P', gender: 'F' },
      { id: 'S', gender: 'M' },
      { id: 'J', gender: 'M' }
    ],
    clues: [
      "Combine everything you've learned to build the complete tree."
    ],
    template: 'practice-5node',
    slots: [
      { id: 0, expectedId: 'R', label: 'Drop Node' },
      { id: 1, expectedId: 'S', label: 'Drop Node' },
      { id: 2, expectedId: 'K', label: 'Drop Node' },
      { id: 3, expectedId: 'P', label: 'Drop Node' },
      { id: 4, expectedId: 'J', label: 'Drop Node' }
    ],
    followUp: {
      q: "FINAL DEDUCTION: How is S related to R?",
      options: ["Son", "Brother-in-law", "Son-in-law"],
      correct: 2,
      explanation: "S is married to K. K and P are siblings, making K the daughter of R. Therefore, S is the husband of R's daughter, making him the Son-in-law!"
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
    <span>
      {parts[0]}
      <span className="bg-amber-400 text-black px-1.5 py-0.5 mx-0.5 rounded shadow-sm">{highlight}</span>
      {parts[1]}
    </span>
  );
};

function Node({ data, color, isSmall, isExtraSmall, isDraggable = false, onDragEnd, onRemove, showRemove }) {
  if (!data) return null;
  const genderLabel = data.gender || data.g;
  const Icon = genderLabel === 'M' ? UserCircle : genderLabel === 'F' ? User : Baby;

  const sizeClasses = isExtraSmall
    ? 'w-12 h-12 sm:w-[64px] sm:h-[64px]'
    : isSmall
      ? 'w-16 h-16 sm:w-24 sm:h-24'
      : 'w-24 h-24 sm:w-36 sm:h-36';

  const textClasses = isExtraSmall
    ? 'text-lg sm:text-2xl'
    : data.id.length <= 2
      ? 'text-3xl sm:text-5xl'
      : isSmall
        ? 'text-[10px] sm:text-sm'
        : 'text-sm sm:text-xl';
        
  const badgeClasses = isExtraSmall
    ? '-top-2 w-5 h-5 text-[6px] sm:-top-2 sm:w-6 sm:h-6 sm:text-[7px]'
    : isSmall
      ? '-top-2 w-7 h-7 text-[8px] sm:-top-3 sm:w-8 sm:h-8 sm:text-[10px]'
      : '-top-2 w-7 h-7 text-[8px] sm:-top-3.5 sm:w-10 sm:h-10 sm:text-[12px]';

  return (
    <motion.div 
      drag={isDraggable}
      dragSnapToOrigin={true}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      className={`flex flex-col items-center gap-1 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`${sizeClasses} rounded-full ${color} flex items-center justify-center text-white shadow-2xl border-2 border-white/20 relative z-10 transition-transform`}>
        <Icon className="absolute inset-0 m-auto opacity-30 w-3/5 h-3/5" />
        <div className={`${textClasses} font-black drop-shadow-md text-center px-1 z-10 uppercase tracking-tighter`}>{data.id}</div>
        <div className={`absolute ${badgeClasses} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-md border-2 border-[#1a0f0d] z-20`}>
          ({genderLabel})
        </div>
        {showRemove && (
            <button 
                onClick={onRemove}
                className="absolute -bottom-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-lg hover:bg-rose-500 active:scale-90 transition-all z-50 border border-white/20"
            >
                <X size={12} strokeWidth={3} />
            </button>
        )}
      </div>
    </motion.div>
  );
}

function Slot({ data, placedId, characters, isSmall, isExtraSmall, onRemove, showRemove }) {
    const placedData = placedId ? characters.find(c => c.id === placedId) : null;
    
    const sizeClasses = isExtraSmall
      ? 'w-12 h-12 sm:w-[64px] sm:h-[64px]'
      : isSmall
        ? 'w-16 h-16 sm:w-24 sm:h-24'
        : 'w-24 h-24 sm:w-36 sm:h-36';

    return (
        <div data-slot-id={data.id} className="flex flex-col items-center justify-center relative">
            {placedData ? (
                <Node data={placedData} color="bg-indigo-600" isSmall={isSmall} isExtraSmall={isExtraSmall} showRemove={showRemove} onRemove={onRemove} />
            ) : (
                <div className={`${sizeClasses} rounded-full border-[3px] border-dashed border-[#c4a484]/40 bg-[#1a110f] flex items-center justify-center transition-colors hover:bg-white/10 shadow-inner relative z-10`}>
                    <MousePointer2 className="text-white/20 w-5 h-5 sm:w-6 sm:h-6" />
                </div>
            )}
            {data.label && !placedData && (
                <span className={`absolute -bottom-6 text-[#dfc4a1] font-black ${isExtraSmall ? 'text-[6px] sm:text-[7px] px-2 py-0.5' : 'text-[7px] sm:text-[9px] px-3 py-1'} uppercase tracking-widest bg-black/40 rounded-full mt-1 z-10 border border-white/10 shadow-lg whitespace-nowrap`}>
                    {data.label}
                </span>
            )}
        </div>
    );
}

export default function LabContent() {
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
        const pad = 40; 
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
    <div className="min-h-screen w-full flex flex-col bg-[#0f0a09] font-sans select-none overflow-hidden text-[#a88a6d] pb-10" ref={containerRef}>
      <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#0f0a09]/95 border-b border-white/5 shadow-sm">
        <div className="w-full max-w-7xl mx-auto bg-[#1a0f0d] px-3 py-2 rounded-xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
            <div className="flex flex-col items-start leading-tight px-2">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
                    <ChevronLeft size={12} /> Dashboard
                </button>
                <span className="text-white font-black uppercase text-[14px] sm:text-[18px] tracking-tight flex items-center gap-2">
                    <Search size={18} className="text-amber-400" /> {appMode === 'concept' ? "Coded Deductions" : "Deduction Lab"}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
                    <button onClick={() => { setAppMode('concept'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
                    <button onClick={() => { setAppMode('practice'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
                </div>
                <button onClick={handleReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all shadow-md"><RotateCcw size={16} /></button>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        <div className="w-full flex-none overflow-hidden flex flex-col gap-2 min-h-[580px] lg:h-[620px] relative">
          
          <motion.div className="w-full h-full bg-[#110c0b] p-4 sm:p-12 rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* PERSISTENT TARGET STRING HEADER */}
            {!lessonFinished && (
                <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 bg-[#1a110f] px-6 py-3 rounded-2xl border-2 border-white/10 shadow-2xl min-w-[280px] sm:min-w-[380px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <Target size={14} />
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-black">
                            {appMode === 'concept' ? "How is S related to R?" : PRACTICE_TASKS[practiceStep].objective}
                        </span>
                    </div>
                    <div className="w-full h-[1px] bg-white/10"></div>
                    <span className="font-mono text-lg sm:text-2xl text-white font-black tracking-widest flex items-center mt-0.5">
                      {appMode === 'concept' ? (
                         CONCEPT_PROTOCOLS[activeTab].tab === "Objective" 
                            ? <span className="text-emerald-400">S $ J @ K # P + R</span>
                            : <HighlightedString fullString="S $ J @ K # P + R" highlight={CONCEPT_PROTOCOLS[activeTab].highlight} />
                      ) : (
                         PRACTICE_TASKS[practiceStep].expression
                      )}
                    </span>
                </div>
            )}

            <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar relative pt-20 sm:pt-24">
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
                       <div className="w-full h-full flex items-center justify-center">
                          <TreeVisual data={CONCEPT_PROTOCOLS[activeTab].visual} />
                       </div>
                     ) : (
                       <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-12 pb-4 sm:pb-0 px-2 sm:px-4">
                         
                         {/* IDENTICAL CONCEPT CIRCULAR WRAPPER */}
                         <div className="flex flex-col items-center bg-[#1a110f] p-4 sm:p-12 rounded-[3rem] sm:rounded-full border border-white/5 shadow-inner w-[340px] sm:w-[480px] h-[340px] sm:h-[540px] justify-center relative overflow-hidden shrink-0">
                             <div className="w-full flex justify-center items-center mt-4">
                                <PracticeTemplate 
                                    task={PRACTICE_TASKS[practiceStep]} 
                                    placedItems={placedItems}
                                    onRemove={practicePhase === 'build' ? removePlaced : null}
                                    showRemove={practicePhase === 'build'}
                                />
                             </div>
                         </div>
                         
                         {/* DRAGGABLE CHARACTER PALETTE */}
                         <div className="flex items-center justify-center shrink-0">
                             {practicePhase === 'build' && (
                                 <div className="flex flex-row lg:flex-col flex-wrap justify-center max-w-[300px] lg:max-w-none gap-3 sm:gap-6 p-4 sm:p-6 bg-[#1a110f] rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm relative z-20">
                                    {PRACTICE_TASKS[practiceStep].characters.map(char => {
                                        const isPlaced = Object.values(placedItems).includes(char.id);
                                        const isComplexGrid = PRACTICE_TASKS[practiceStep].template !== 'practice-t1';
                                        return (
                                            <div key={char.id} className="relative">
                                                <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
                                                    <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(e, info) => handleDragEnd(char.id, e, info)} isSmall={!isComplexGrid} isExtraSmall={isComplexGrid} />
                                                </div>
                                                {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={32} /></div>}
                                            </div>
                                        );
                                    })}
                                 </div>
                             )}
                         </div>
                       </div>
                     )}
                   </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8 text-center p-6 sm:p-10 w-full">
                    <Trophy size={100} className="text-yellow-400 animate-bounce shadow-amber-400/20 drop-shadow-xl" />
                    <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">LOGIC CERTIFIED</h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mt-6">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl transition-all">
                            Restart Module
                        </button>
                        <button onClick={handleReset} className="flex-1 bg-amber-400 text-black border-b-8 border-amber-600 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM PANEL */}
        <div className="w-full flex-none mt-2 bg-[#1a0f0d] p-4 sm:p-6 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-4 overflow-hidden border-b-[10px] border-black/40 min-h-[300px] sm:min-h-[380px]">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6 h-full relative z-10">
            
            {/* LEFT LOG PANEL - ALWAYS SHOWS LEGEND */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-black/40 p-4 rounded-[1.5rem] border border-white/10 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar shadow-inner text-white font-black">
                
                {/* STATIC MASTER LEGEND */}
                <div className="bg-[#1a110f] p-3 sm:p-4 rounded-xl border border-white/5 mb-2 shadow-sm shrink-0">
                  <p className="text-amber-400 text-[10px] sm:text-xs uppercase tracking-widest mb-3 border-b border-white/10 pb-2 flex items-center gap-2">
                    <Key size={14} /> Code Legend
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {CODE_LEGEND.map((leg, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs sm:text-sm bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-yellow-400 font-mono text-base px-2 py-0.5 bg-black/50 rounded-md border border-white/10">{leg.code.split(' ')[1]}</span>
                        <span className="text-white/80 font-bold leading-tight flex-1">{leg.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC CONTENT */}
                {appMode === 'concept' ? (
                   <div className="space-y-4 mt-2 pl-1">
                     <p className="text-white text-base sm:text-xl font-black border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-tighter"><GitBranch size={16} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-2 text-white/80">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-2 text-left py-0.5"><Check size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white font-bold italic text-[12px] sm:text-[14px] leading-tight tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3 h-full mt-1">
                     <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                        <span className="text-orange-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-80">
                            {PRACTICE_TASKS[practiceStep].mission}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={prevPracticeTask} disabled={practiceStep === 0} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/5">
                                <ChevronLeft size={16} className="text-orange-400" />
                            </button>
                            <button onClick={skipPracticeTask} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5">
                                <ChevronRight size={16} className="text-orange-400" />
                            </button>
                        </div>
                     </div>
                     <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2 pt-2">
                        {PRACTICE_TASKS[practiceStep].clues.map((clue, i) => (
                            <div key={i} className="flex items-start gap-3 text-left py-1 text-white/60 text-xs italic">
                                <Info size={16} className="shrink-0 mt-0.5" />
                                <p className="leading-tight">{clue}</p>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
              </div>
            </div>

            {/* RIGHT INTERACTION PANEL */}
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-[#2a1a16] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col gap-4">
                         <div className="flex flex-wrap justify-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5 max-h-[80px] sm:max-h-[none] overflow-y-auto no-scrollbar">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-1.5 px-3 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${activeTab === i ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 shadow-inner">
                            <p className="text-white text-[14px] sm:text-[18px] font-bold leading-relaxed italic px-4">Observe how the logical deduction progresses piece by piece.</p>
                            <button onClick={() => activeTab === CONCEPT_PROTOCOLS.length - 1 ? setAppMode('practice') : setActiveTab(prev => prev + 1)} className="mt-4 flex items-center gap-3 bg-emerald-500 text-white px-8 py-3 rounded-full font-black uppercase text-xs shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all">
                                {activeTab === CONCEPT_PROTOCOLS.length - 1 ? "Engage Practice Hub" : "Next Step"} <ArrowRight size={16} />
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="practice-ui" className="w-full flex flex-col gap-3 h-full">
                         {practicePhase === 'build' ? (
                             <div className="flex flex-col items-center justify-center flex-1 gap-4">
                                <p className="text-stone-400 text-xs sm:text-sm uppercase font-black text-center px-4 leading-relaxed tracking-widest border-b border-white/5 pb-4">
                                  Construct the family tree on the grid to answer the question.
                                </p>
                                <button onClick={validateBuild} disabled={Object.keys(placedItems).length < PRACTICE_TASKS[practiceStep].slots.length} className={`px-16 py-4 rounded-2xl font-black uppercase text-[13px] shadow-2xl transition-all active:scale-95 flex items-center gap-3 border-b-4 ${Object.keys(placedItems).length >= PRACTICE_TASKS[practiceStep].slots.length ? 'bg-amber-400 text-black border-amber-700 hover:scale-105' : 'bg-black/20 text-white/20 border-transparent pointer-events-none'}`}>Validate Arrangement <ChevronRight size={18} /></button>
                             </div>
                         ) : (
                            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar pt-1 text-white">
                                <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-2 text-left shadow-inner"><p className="text-white text-base sm:text-xl font-black leading-tight tracking-tight px-2">{PRACTICE_TASKS[practiceStep].followUp.q}</p></div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {PRACTICE_TASKS[practiceStep].followUp.options.map((opt, i) => {
                                        const isSelected = quizFeedback?.selected === i;
                                        const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].followUp.correct;
                                        let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400 scale-105 shadow-emerald-500/20" : "bg-rose-600 border-rose-400 shadow-rose-500/20") : "bg-black/40 border-white/10 text-white/80";
                                        if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white scale-105 shadow-emerald-500/20";
                                        return (<button key={i} disabled={quizFeedback?.isCorrect} onClick={() => handleQuizSelection(i)} className={`p-4 rounded-xl font-black uppercase transition-all text-[11px] sm:text-xs border-2 ${btnClass} ${!quizFeedback ? 'hover:bg-black/80 hover:border-white/30' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                                {quizFeedback && (
                                    <div className="flex gap-2 w-full mt-auto pt-2">
                                        {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-3 sm:py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg flex items-center justify-center gap-2 hover:bg-rose-500 transition-all border-b-4 border-rose-800"><RefreshCw size={16} /> Try Again</button>}
                                        <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-3 sm:py-4 text-white rounded-2xl font-black text-xs uppercase shadow-xl flex items-center justify-center gap-2 transition-all border-b-4 ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500 border-emerald-800' : 'bg-blue-600 hover:bg-blue-500 border-blue-800'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={16} />}</button>
                                    </div>
                                )}
                            </div>
                         )}
                      </motion.div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center"><Zap size={48} className="text-yellow-400 animate-pulse" /><p className="text-[#a88a6d] font-bold italic text-lg px-8">Diagnostic Trial Success.</p><button onClick={handleReset} className="bg-yellow-400 text-black px-16 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl active:scale-95 border-b-8 border-amber-600 hover:scale-105 transition-all">Restart Concept</button></div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TreeVisual({ data }) {
    if (data.type === 'step-build') {
        const { step } = data;

        if (step === 0) {
            return (
                <div className="relative flex flex-col items-center bg-[#1a110f] p-8 sm:p-12 rounded-full border border-white/5 shadow-inner w-[340px] sm:w-[480px] h-[480px] sm:h-[540px] justify-center overflow-hidden shrink-0">
                    <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-10 text-center absolute top-12">THE TARGET</span>
                    <Target size={80} className="text-emerald-400 mb-8 animate-pulse" />
                    <p className="text-white text-xl sm:text-2xl font-black text-center mb-4 leading-relaxed">Find the hidden relation between <span className="text-emerald-400">S</span> and <span className="text-emerald-400">R</span>!</p>
                    <p className="text-[#a88a6d] text-sm sm:text-base font-bold text-center px-4">We will use the Master Legend to trace the path and unlock the answer.</p>
                </div>
            );
        }

        return (
            <div className="relative flex flex-col items-center bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] sm:h-[540px] justify-center overflow-hidden shrink-0">
                <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square mt-4 shrink-0">
                    
                    {step >= 4 && <motion.div layout className="absolute top-[15%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                        <Node data={{id:'R', g:'?'}} color="bg-stone-600" isExtraSmall />
                    </motion.div>}
                    
                    {/* S gracefully slides left to make room for K in Step 2 */}
                    {step >= 1 && <motion.div layout className={`absolute top-[50%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10 transition-all duration-700 ease-in-out ${step === 1 ? 'left-[40%]' : 'left-[25%]'}`}>
                        <Node data={{id:'S', g:'M'}} color="bg-blue-600" isExtraSmall />
                    </motion.div>}

                    {step >= 2 && <motion.div layout className="absolute top-[50%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                        <Node data={{id:'K', g:'F'}} color="bg-purple-600" isExtraSmall />
                    </motion.div>}
                    
                    {step >= 3 && <motion.div layout className="absolute top-[50%] left-[85%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                        <Node data={{id:'P', g:'F'}} color="bg-purple-600" isExtraSmall />
                    </motion.div>}
                    
                    {step >= 1 && <motion.div layout className="absolute top-[85%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                        <Node data={{id:'J', g:'M'}} color="bg-blue-600" isExtraSmall />
                    </motion.div>}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                        {step === 1 && <>
                            {/* Perfectly straight vertical line when only S and J exist */}
                            <line x1="40" y1="50" x2="40" y2="85" stroke="#facc15" strokeWidth="1.5" />
                            <polygon points="37.5,77 42.5,77 40,81" fill="#facc15" />
                        </>}

                        {step >= 2 && <>
                            <line x1="25" y1="48" x2="55" y2="48" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                            <line x1="25" y1="52" x2="55" y2="52" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                            {/* Drop line from center of marriage bond */}
                            <line x1="40" y1="50" x2="40" y2="85" stroke="#facc15" strokeWidth="1.5" />
                            <polygon points="37.5,77 42.5,77 40,81" fill="#facc15" />
                        </>}

                        {step >= 3 && <line x1="55" y1="50" x2="85" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />}
                        
                        {step >= 4 && <>
                            <path d="M 70 15 V 30 H 55 V 45 M 70 30 H 85 V 45" stroke="#facc15" strokeWidth="1.5" fill="none" />
                            <polygon points="52.5,40 57.5,40 55,44" fill="#facc15" />
                            <polygon points="82.5,40 87.5,40 85,44" fill="#facc15" />
                        </>}
                    </svg>

                    {step >= 2 && <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                        <Heart size={10} className="text-rose-500 fill-rose-500" />
                    </div>}
                </div>
            </div>
        );
    }

    return null;
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;

    if (template === 'practice-t1') {
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex-shrink-0 mt-4">
                <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                </div>
                <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                </div>
                <div className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>
                <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="25" x2="75" y2="25" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="25" y1="25" x2="25" y2="75" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="22.5,63 27.5,63 25,67" fill="#facc15" />
                    
                    <line x1="75" y1="25" x2="75" y2="75" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="72.5,63 77.5,63 75,67" fill="#facc15" />
                </svg>
            </div>
        );
    }

    if (template === 'practice-t2') {
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex-shrink-0 mt-4">
                <div className="absolute top-[25%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[25%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[25%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[75%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[75%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[4]} placedId={placedItems[4]} characters={characters} onRemove={() => onRemove(4)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="20" y1="23" x2="50" y2="23" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="20" y1="27" x2="50" y2="27" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="50" y1="25" x2="80" y2="25" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="20" y1="25" x2="20" y2="75" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="17.5,63 22.5,63 20,67" fill="#facc15" />
                    
                    <line x1="35" y1="25" x2="35" y2="75" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="32.5,63 37.5,63 35,67" fill="#facc15" />
                </svg>
                
                <div className="absolute top-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    if (template === 'practice-t3') {
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex-shrink-0 mt-4">
                <div className="absolute top-[15%] left-[65%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[4]} placedId={placedItems[4]} characters={characters} onRemove={() => onRemove(4)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 65 15 V 30 H 50 V 50 M 65 30 H 80 V 50" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="47.5,40 52.5,40 50,44" fill="#facc15" />
                    <polygon points="77.5,40 82.5,40 80,44" fill="#facc15" />

                    <line x1="50" y1="50" x2="80" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="20" y1="48" x2="50" y2="48" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="20" y1="52" x2="50" y2="52" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />

                    <line x1="35" y1="50" x2="35" y2="85" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="32.5,75 37.5,75 35,79" fill="#facc15" />
                </svg>
                
                <div className="absolute top-[50%] left-[35%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    if (template === 'practice-t4') {
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex-shrink-0 mt-4">
                <div className="absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[80%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[4]} placedId={placedItems[4]} characters={characters} onRemove={() => onRemove(4)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[20%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[5]} placedId={placedItems[5]} characters={characters} onRemove={() => onRemove(5)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M 50 15 V 30 H 20 V 50 M 40 30 V 50 M 60 30 V 50 M 80 30 V 50" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="17.5,40 22.5,40 20,44" fill="#facc15" />
                    <polygon points="37.5,40 42.5,40 40,44" fill="#facc15" />
                    <polygon points="57.5,40 62.5,40 60,44" fill="#facc15" />
                    <polygon points="77.5,40 82.5,40 80,44" fill="#facc15" />

                    <line x1="20" y1="50" x2="80" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <line x1="20" y1="50" x2="20" y2="85" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="17.5,75 22.5,75 20,79" fill="#facc15" />
                </svg>
            </div>
        );
    }

    if (template === 'practice-5node') {
        return (
            <div className="relative w-full max-w-[320px] sm:max-w-[420px] aspect-square flex-shrink-0 mt-4">
                <div className="absolute top-[15%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[55%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[50%] left-[85%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} onRemove={() => onRemove(3)} showRemove={showRemove} isExtraSmall />
                </div>
                <div className="absolute top-[85%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-0 h-0 flex items-center justify-center z-10">
                    <Slot data={slots[4]} placedId={placedItems[4]} characters={characters} onRemove={() => onRemove(4)} showRemove={showRemove} isExtraSmall />
                </div>

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="25" y1="48" x2="55" y2="48" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    <line x1="25" y1="52" x2="55" y2="52" stroke="#facc15" strokeWidth="1.5" opacity="0.6" />
                    
                    <line x1="55" y1="50" x2="85" y2="50" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    
                    <path d="M 70 15 V 30 H 55 V 50 M 70 30 H 85 V 50" stroke="#facc15" strokeWidth="1.5" fill="none" />
                    <polygon points="52.5,40 57.5,40 55,44" fill="#facc15" />
                    <polygon points="82.5,40 87.5,40 85,44" fill="#facc15" />
                    
                    <line x1="40" y1="50" x2="40" y2="85" stroke="#facc15" strokeWidth="1.5" />
                    <polygon points="37.5,75 42.5,75 40,79" fill="#facc15" />
                </svg>

                <div className="absolute top-[50%] left-[40%] -translate-x-1/2 -translate-y-1/2 z-20 bg-[#1a110f] rounded-full p-[2px] border border-white/5 shadow-inner">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
        );
    }

    return null;
}

// export function App() { return ( <Router> <LabContent /> </Router> ); }
// export default App;