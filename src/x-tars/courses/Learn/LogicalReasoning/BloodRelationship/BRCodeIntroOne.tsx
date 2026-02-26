import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Target,
  BookOpen,
  Layers,
  UserCircle,
  User,
  Check,
  Zap,
  Baby,
  ChevronRight,
  Binary,
  GitBranch,
  Crown,
  ArrowRight,
  MousePointer2,
  Dna,
  X,
  Square,
  CheckSquare,
  Info,
  RefreshCw,
  Search,
  Key,
  Heart,
  Sparkles
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================

const CONCEPT_PROTOCOLS = [
  {
    id: "code-father",
    tab: "Code (+)",
    title: "Code (+): The Father",
    definition: "Statement: 'A + B' means A is the father of B.",
    logicPoints: [
      "KEY: The '+' symbol signifies a Father relationship.",
      "GENDER: The first person (A) is strictly Male (M).",
      "PLACEMENT: A is the parent, positioned vertically above B."
    ],
    visual: { type: 'sentence-parent', top: {id:'A', g:'M'}, btm: {id:'B', g:'?'} }
  },
  {
    id: "code-mother",
    tab: "Code (-)",
    title: "Code (-): The Mother",
    definition: "Statement: 'A - B' means A is the mother of B.",
    logicPoints: [
      "KEY: The '-' symbol signifies a Mother relationship.",
      "GENDER: The first person (A) is strictly Female (F).",
      "PLACEMENT: A is the parent, positioned vertically above B."
    ],
    visual: { type: 'sentence-parent', top: {id:'A', g:'F'}, btm: {id:'B', g:'?'} }
  },
  {
    id: "code-sister",
    tab: "Code (*)",
    title: "Code (*): The Sister",
    definition: "Statement: 'A * B' means A is the sister of B.",
    logicPoints: [
      "KEY: The '*' symbol signifies a horizontal Sibling bond.",
      "GENDER: The first person (A) is strictly Female (F).",
      "PLACEMENT: Siblings share the exact same generation tier."
    ],
    visual: { type: 'sentence-sibling', left: {id:'A', g:'F'}, right: {id:'B', g:'?'} }
  },
  {
    id: "code-husband",
    tab: "Code (@)",
    title: "Code (@): The Husband",
    definition: "Statement: 'A @ B' means A is the husband of B.",
    logicPoints: [
      "KEY: The '@' symbol triggers the Marital bond (=).",
      "GENDER: A is Male (M), which automatically makes B Female (F).",
      "PLACEMENT: Spouses sit side-by-side."
    ],
    visual: { type: 'sentence-marriage', left: {id:'A', g:'M'}, right: {id:'B', g:'F'} }
  },
  {
    id: "code-chain",
    tab: "Chain",
    title: "Coded Chains",
    definition: "Statement: 'A + B + C' (A is father of B, B is father of C).",
    logicPoints: [
      "FLOW: Read the expression from left to right.",
      "STEP 1: 'A + B' places A (Male) directly above B.",
      "STEP 2: 'B + C' places B (Male) directly above C.",
      "DEDUCTION: Two tiers up means A is the Grandfather of C."
    ],
    visual: { type: 'sentence-chain', top: {id:'A', g:'M'}, mid: {id:'B', g:'M'}, btm: {id:'C', g:'?'} }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Trial 1: Decode 'X + Y'",
    clues: [
      "Reference: 'A + B' means A is the father of B.",
      "Expression: X + Y"
    ],
    characters: [
      { id: 'Y', gender: '?' },
      { id: 'X', gender: 'M' }
    ],
    template: 'practice-parent',
    slots: [
      { id: 0, expectedId: 'X', label: 'Top Tier' },
      { id: 1, expectedId: 'Y', label: 'Bottom Tier' }
    ],
    followUp: {
      q: "If the expression was expanded to 'X + Y + Z', what would X's relationship be to Z?",
      options: ["Uncle", "Grandfather", "Father"],
      correct: 1,
      explanation: "X is the father of Y, and Y is the father of Z. A two-tier gap upwards defines a Grandfather relationship."
    }
  },
  {
    mission: "Trial 2: Decode 'M * N'",
    clues: [
      "Reference: 'A * B' means A is the sister of B.",
      "Expression: M * N"
    ],
    characters: [
      { id: 'N', gender: '?' },
      { id: 'M', gender: 'F' }
    ],
    template: 'practice-sibling',
    slots: [
      { id: 0, expectedId: 'M', label: 'Node 1' },
      { id: 1, expectedId: 'N', label: 'Node 2' }
    ],
    followUp: {
      q: "Based strictly on the expression 'M * N', do we know N's exact gender?",
      options: ["Yes, N is Male", "No, N's gender is unknown", "Yes, N is Female"],
      correct: 1,
      explanation: "The code only defines M as the sister. N could be a brother OR a sister, so their gender remains unknown."
    }
  },
  {
    mission: "Trial 3: Decode 'H @ W'",
    clues: [
      "Reference: 'A @ B' means A is the husband of B.",
      "Expression: H @ W"
    ],
    characters: [
      { id: 'W', gender: 'F' },
      { id: 'H', gender: 'M' }
    ],
    template: 'practice-marriage',
    slots: [
      { id: 0, expectedId: 'H', label: 'Node 1' },
      { id: 1, expectedId: 'W', label: 'Node 2' }
    ],
    followUp: {
      q: "In coded relationships, if 'H @ W' defines H as the husband, what can we automatically deduce about W?",
      options: ["W is the sister", "W is the wife (Female)", "W's gender is unknown"],
      correct: 1,
      explanation: "In standard blood relation logic, a marital bond with a husband guarantees the other node is the wife (Female)."
    }
  },
  {
    mission: "Trial 4: Decode 'P - Q + R'",
    clues: [
      "Reference 1: 'A - B' means A is the mother of B.",
      "Reference 2: 'A + B' means A is the father of B.",
      "Expression: P - Q + R"
    ],
    characters: [
      { id: 'R', gender: '?' },
      { id: 'P', gender: 'F' },
      { id: 'Q', gender: 'M' }
    ],
    template: 'practice-chain',
    slots: [
      { id: 0, expectedId: 'P', label: 'Tier +2' },
      { id: 1, expectedId: 'Q', label: 'Tier +1' },
      { id: 2, expectedId: 'R', label: 'Tier 0' }
    ],
    followUp: {
      q: "Looking at the final arrangement, how is P related to R?",
      options: ["Grandmother", "Mother", "Aunt"],
      correct: 0,
      explanation: "P is the mother of Q, and Q is the father of R. Since P is female and sits two tiers above R, she is the Grandmother."
    }
  },
  {
    mission: "Trial 5: Decode 'E @ F - G'",
    clues: [
      "Reference 1: 'A @ B' means A is the husband of B.",
      "Reference 2: 'A - B' means A is the mother of B.",
      "Expression: E @ F - G"
    ],
    characters: [
      { id: 'G', gender: '?' },
      { id: 'F', gender: 'F' },
      { id: 'E', gender: 'M' }
    ],
    template: 'practice-family-tree',
    slots: [
      { id: 0, expectedId: 'E', label: 'Node 1' },
      { id: 1, expectedId: 'F', label: 'Node 2' },
      { id: 2, expectedId: 'G', label: 'Node 3' }
    ],
    followUp: {
      q: "Based on the arrangement, what is the specific relationship of E to G?",
      options: ["Uncle", "Grandfather", "Father"],
      correct: 2,
      explanation: "E is the husband of F, and F is the mother of G. Since a mother's husband is the father, E is the Father of G."
    }
  }
];

// ==========================================
// RENDER COMPONENTS
// ==========================================

function Node({ data, color, isSmall, isDraggable = false, onDragEnd, onRemove, showRemove }) {
  if (!data) return null;
  const genderLabel = data.gender || data.g;
  const Icon = genderLabel === 'M' ? UserCircle : genderLabel === 'F' ? User : Baby;

  return (
    <motion.div 
      drag={isDraggable}
      dragSnapToOrigin={true}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      className={`flex flex-col items-center gap-1 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`${isSmall ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-24 h-24 sm:w-36 sm:h-36'} rounded-full ${color} flex items-center justify-center text-white shadow-2xl border-2 border-white/20 relative z-10 transition-transform`}>
        <Icon className="absolute inset-0 m-auto opacity-30 w-3/5 h-3/5" />
        <div className={`${data.id.length <= 2 ? 'text-4xl sm:text-6xl' : (isSmall ? 'text-[10px] sm:text-sm' : 'text-sm sm:text-xl')} font-black drop-shadow-md text-center px-1 z-10 uppercase tracking-tighter`}>{data.id}</div>
        <div className={`absolute ${isSmall ? '-top-2 w-7 h-7 text-[8px]' : '-top-3.5 w-10 h-10 text-[10px] sm:text-[12px]'} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-md border-2 border-[#1a0f0d] z-20`}>
          ({genderLabel})
        </div>
        {showRemove && (
            <button 
                onClick={onRemove}
                className="absolute -bottom-3 -right-3 bg-rose-600 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-500 active:scale-90 transition-all z-50 border border-white/20"
            >
                <X size={14} strokeWidth={3} />
            </button>
        )}
      </div>
      {data.label && (
        <span className="text-white/80 font-black text-[9px] sm:text-[11px] uppercase tracking-widest text-center mt-1 whitespace-nowrap bg-black/40 px-3 py-0.5 rounded-full border border-white/5">
          {data.label}
        </span>
      )}
    </motion.div>
  );
}

function Slot({ data, placedId, characters, isSmall, onRemove, showRemove }) {
    const placedData = placedId ? characters.find(c => c.id === placedId) : null;
    return (
        <div data-slot-id={data.id} className="flex flex-col items-center gap-2 relative">
            <div className={`absolute inset-0 z-0 ${isSmall ? 'scale-[2.5]' : 'scale-[2.2]'} opacity-0 rounded-full bg-white/5 pointer-events-none`} />
            {placedData ? (
                <Node data={placedData} color="bg-indigo-600" isSmall={isSmall} showRemove={showRemove} onRemove={onRemove} />
            ) : (
                <div className={`${isSmall ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-24 h-24 sm:w-36 sm:h-36'} rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10 shadow-inner relative z-10`}>
                    <MousePointer2 className="text-white/10 w-8 h-8" />
                </div>
            )}
            <span className="text-white/20 font-black text-[8px] sm:text-[11px] uppercase tracking-widest bg-black/10 px-3 rounded-full mt-1 relative z-10">{data.label}</span>
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

  const handleDragEnd = (itemId, point) => {
    const slots = document.querySelectorAll(`[data-slot-id]`);
    const slotElement = Array.from(slots).find(s => {
        const rect = s.getBoundingClientRect();
        const pad = 60; 
        return (
            point.x > rect.left - pad && point.x < rect.right + pad &&
            point.y > rect.top - pad && point.y < rect.bottom + pad
        );
    });

    if (slotElement) {
        const sId = parseInt(slotElement.getAttribute('data-slot-id'));
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
                    <Search size={18} className="text-amber-400" /> {appMode === 'concept' ? "Coded Relations" : "Decoding Hub"}
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
        <div className="w-full flex-none overflow-hidden flex flex-col gap-2 min-h-[580px] lg:h-[620px]">
          <motion.div className="w-full h-full bg-[#110c0b] p-4 sm:p-12 rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar relative pt-4 sm:pt-12">
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
                         <div className="flex flex-col items-center bg-[#1a110f] p-6 sm:p-12 rounded-[3rem] sm:rounded-full border border-white/5 shadow-inner w-[340px] sm:w-[480px] h-[340px] sm:h-[540px] justify-center relative overflow-hidden shrink-0">
                             <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-10 text-center absolute top-8 sm:top-12 hidden sm:block">CONSTRUCTION ZONE</span>
                             <div className="w-full flex justify-center items-center">
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
                                 <div className="flex flex-row lg:flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[#1a110f] rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm relative z-20">
                                    {PRACTICE_TASKS[practiceStep].characters.map(char => {
                                        const isPlaced = Object.values(placedItems).includes(char.id);
                                        return (
                                            <div key={char.id} className="relative">
                                                <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
                                                    <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(_, info) => handleDragEnd(char.id, info.point)} isSmall />
                                                </div>
                                                {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={40} /></div>}
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
                    <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">CODES DECODED</h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mt-6">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl transition-all">
                            Restart Module
                        </button>
                        <button onClick={() => navigate('/learn/logicalReasoning/bloodRelations/brCodedBuildingTree')} className="flex-1 bg-amber-400 text-black border-b-8 border-amber-600 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="w-full flex-none mt-2 bg-[#1a0f0d] p-4 sm:p-6 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-4 overflow-hidden border-b-[10px] border-black/40 min-h-[300px] sm:min-h-[380px]">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6 h-full relative z-10">
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-black/40 p-4 rounded-[1.5rem] border border-white/10 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar shadow-inner text-white font-black">
                {appMode === 'concept' ? (
                   <div className="space-y-4">
                     <p className="text-white text-base sm:text-xl font-black border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-tighter"><GitBranch size={16} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-2 text-white/80">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-2 text-left py-0.5"><Check size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white font-bold italic text-[12px] sm:text-[14px] leading-tight tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3 h-full">
                     <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                        <span className="text-orange-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-80">
                            Trial {practiceStep + 1} of {PRACTICE_TASKS.length}
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
                     <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2">
                        {PRACTICE_TASKS[practiceStep].clues.map((clue, i) => (
                            <div key={i} className="flex items-start gap-3 group cursor-pointer text-left py-1" onClick={() => toggleClue(i)}>
                                {completedClues.includes(i) ? <CheckSquare className="text-emerald-500 shrink-0" size={18} /> : <Square className="text-white/20 shrink-0" size={18} />}
                                <p className={`text-white font-bold leading-tight ${completedClues.includes(i) ? 'opacity-40 line-through italic text-emerald-400' : ''}`}>{clue}</p>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-[#2a1a16] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col gap-4">
                         <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === i ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 shadow-inner">
                            <p className="text-white text-[14px] sm:text-[18px] font-bold leading-relaxed italic">{CONCEPT_PROTOCOLS[activeTab].definition}</p>
                            <button onClick={() => activeTab === CONCEPT_PROTOCOLS.length - 1 ? setAppMode('practice') : setActiveTab(prev => prev + 1)} className="mt-2 flex items-center gap-3 bg-emerald-500 text-white px-8 py-2.5 rounded-full font-black uppercase text-[11px] shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all">
                                {activeTab === CONCEPT_PROTOCOLS.length - 1 ? "Engage Practice Hub" : "Observe Next"} <ArrowRight size={16} />
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="practice-ui" className="w-full flex flex-col gap-3 h-full">
                         {practicePhase === 'build' ? (
                             <div className="flex flex-col items-center justify-center flex-1 gap-4">
                                <p className="text-stone-400 text-[10px] uppercase font-black text-center px-4 leading-tight tracking-widest">Construct the mapping defined in the log.</p>
                                <button onClick={validateBuild} disabled={Object.keys(placedItems).length < PRACTICE_TASKS[practiceStep].slots.length} className={`px-16 py-4 rounded-2xl font-black uppercase text-[13px] shadow-2xl transition-all active:scale-95 flex items-center gap-3 border-b-4 ${Object.keys(placedItems).length >= PRACTICE_TASKS[practiceStep].slots.length ? 'bg-amber-400 text-black border-amber-700' : 'bg-black/20 text-white/20 border-transparent pointer-events-none'}`}>Validate Arrangement <ChevronRight size={18} /></button>
                             </div>
                         ) : (
                            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar pt-1 text-white">
                                <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-1 text-left"><p className="text-white text-[15px] sm:text-lg font-black leading-tight tracking-tight px-2">{PRACTICE_TASKS[practiceStep].followUp.q}</p></div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {PRACTICE_TASKS[practiceStep].followUp.options.map((opt, i) => {
                                        const isSelected = quizFeedback?.selected === i;
                                        const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].followUp.correct;
                                        let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400 scale-105 shadow-emerald-500/20" : "bg-rose-600 border-rose-400 shadow-rose-500/20") : "bg-black/40 border-white/10 text-white/80";
                                        if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white scale-105 shadow-emerald-500/20";
                                        return (<button key={i} disabled={quizFeedback?.isCorrect} onClick={() => handleQuizSelection(i)} className={`p-3 rounded-xl font-black uppercase transition-all text-[11px] border-2 ${btnClass} ${!quizFeedback ? 'hover:bg-black/80' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                                {quizFeedback && (
                                    <div className="flex gap-2 w-full mt-auto">
                                        {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-2.5 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"><RefreshCw size={14} /> Try Again</button>}
                                        <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-2.5 text-white rounded-full font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-2 transition-all ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={14} />}</button>
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
    if (data.type === 'sentence-parent') return (
      <div className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] justify-center relative overflow-hidden">
        <Node data={data.top} color={data.top.g === 'M' ? "bg-blue-600" : "bg-purple-600"} isSmall />
        <div className="w-[2px] bg-yellow-400 h-24 relative mt-2 mb-2">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
        </div>
        <Node data={data.btm} color="bg-stone-600" isSmall />
      </div>
    );

    if (data.type === 'sentence-sibling') return (
      <div className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] justify-center relative overflow-hidden">
        <div className="flex items-center gap-16 sm:gap-24">
            <Node data={data.left} color="bg-purple-600" isSmall />
            <div className="w-16 sm:w-24 h-0 border-t-4 border-dotted border-yellow-400/60 mx-[-64px] sm:mx-[-96px] z-0" />
            <Node data={data.right} color="bg-stone-600" isSmall />
        </div>
      </div>
    );

    if (data.type === 'sentence-marriage') return (
      <div className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] justify-center relative overflow-hidden">
        <div className="flex items-center gap-16 sm:gap-24">
            <Node data={data.left} color="bg-blue-600" isSmall />
            <div className="w-16 sm:w-24 h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center mx-[-64px] sm:mx-[-96px] z-0">
                <Heart size={16} className="text-rose-500 fill-rose-500 bg-[#1a110f] px-1" />
            </div>
            <Node data={data.right} color="bg-purple-600" isSmall />
        </div>
      </div>
    );

    if (data.type === 'sentence-chain') return (
      <div className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[520px] justify-center relative overflow-hidden">
        <Node data={data.top} color="bg-blue-600" isSmall />
        <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
        </div>
        <Node data={data.mid} color="bg-blue-600" isSmall />
        <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
        </div>
        <Node data={data.btm} color="bg-stone-600" isSmall />
      </div>
    );

    return null;
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;

    if (template === 'practice-parent') {
        return (
            <div className="flex flex-col items-center justify-center gap-2 mt-4">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="w-[2px] bg-yellow-400 h-16 sm:h-20 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-sibling') {
        return (
            <div className="flex items-start gap-[64px] sm:gap-[128px] justify-center relative pt-8">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="absolute top-[72px] sm:top-[88px] left-1/2 -translate-x-1/2 w-[144px] sm:w-[240px] h-0 border-t-4 border-dotted border-yellow-400/60 -z-10" />
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-marriage') {
        return (
            <div className="flex items-start gap-[64px] sm:gap-[128px] justify-center relative pt-8">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="absolute top-[72px] sm:top-[88px] left-1/2 -translate-x-1/2 w-[144px] sm:w-[240px] h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center -z-10">
                    <Heart size={16} className="text-rose-500 fill-rose-500 bg-[#1a110f] px-1 absolute" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-chain') {
        return (
            <div className="flex flex-col items-center justify-center mt-2">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="w-[1.5px] bg-yellow-400 h-10 sm:h-12 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                <div className="w-[1.5px] bg-yellow-400 h-10 sm:h-12 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-family-tree') {
        return (
            <div className="flex flex-col items-center py-4 relative">
                {/* Top Row: Husband & Wife */}
                <div className="flex items-start gap-[64px] sm:gap-[128px] z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                </div>

                {/* Central Structural Matrix */}
                <div className="absolute top-[56px] sm:top-[72px] left-1/2 -translate-x-1/2 flex flex-col items-center z-0 pointer-events-none">
                    {/* Marriage Bond */}
                    <div className="w-[144px] sm:w-[240px] h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center">
                         <Heart size={16} className="text-rose-500 fill-rose-500 bg-[#1a110f] px-1 absolute" />
                    </div>
                    {/* Downward Arrow */}
                    <div className="w-[2.5px] bg-yellow-400 h-[80px] sm:h-[100px] relative">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>
                </div>

                {/* Bottom Row: Child */}
                <div className="mt-[20px] sm:mt-[30px] z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>
            </div>
        );
    }

    return null;
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }