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
    id: "parents",
    tab: "Parents",
    title: "Protocol: Direct Lineage (Up)",
    definition: "Parents are direct ancestors sitting exactly one generation above you.",
    logicPoints: [
      "FATHER: Male parent (M).",
      "MOTHER: Female parent (F).",
      "HIERARCHY: Origin is at the Top."
    ],
    visual: { 
      type: 'dual-case-vertical-direct', 
      case1: { title: "FATHER", top: {id:'FATHER', g:'M'}, btm: {id:'CHILD', g:'?'} },
      case2: { title: "MOTHER", top: {id:'MOTHER', g:'F'}, btm: {id:'CHILD', g:'?'} }
    }
  },
  {
    id: "children",
    tab: "Children",
    title: "Protocol: Direct Lineage (Down)",
    definition: "Children are direct descendants sitting exactly one generation below you.",
    logicPoints: [
      "SON: Male descendant (M).",
      "DAUGHTER: Female descendant (F).",
      "HIERARCHY: Descendant is at the Bottom."
    ],
    visual: { 
      type: 'dual-case-vertical-direct', 
      case1: { title: "SON", top: {id:'PARENT', g:'?'}, btm: {id:'SON', g:'M'} },
      case2: { title: "DAUGHTER", top: {id:'PARENT', g:'?'}, btm: {id:'DAUGHTER', g:'F'} }
    }
  },
  {
    id: "inlaws",
    tab: "In-laws",
    title: "Marriage Protocol: In-Laws",
    definition: "Tracing direct relationships through marriage bonds. Identifying Father-in-law and Son-in-law.",
    logicPoints: [
      "FATHER-IN-LAW: Father sits above your Spouse.",
      "SON-IN-LAW: Husband is married to your Daughter.",
      "BOND: Dotted deduction line traces the 'In-law' relation."
    ],
    visual: { 
      type: 'dual-case-inlaw-screenshot-flow', 
      case1: { title: "FATHER-IN-LAW", father: {id:'FATHER', g:'M'}, spouse: {id:'SPOUSE', g:'?'}, me: {id:'ME', g:'?'} },
      case2: { title: "SON-IN-LAW", me: {id:'ME', g:'?'}, daughter: {id:'DAUGHTER', g:'F'}, husband: {id:'HUSBAND', g:'M'} }
    }
  },
  {
    id: "grandparents",
    tab: "Grandparents",
    title: "Protocol: Grand-Generations (Up)",
    definition: "Ancestors sitting two generational steps above you (+2).",
    logicPoints: [
      "GAP: Requires two vertical arrows.",
      "STANDARD: Grandfather (M), Grandmother (F).",
      "MIDDLE: Parent node sits in the center."
    ],
    visual: { 
      type: 'dual-case-chain', 
      case1: { title: "GRANDFATHER", top: {id:'GRANDFATHER', g:'M'}, mid: {id:'PARENT', g:'?'}, btm: {id:'ME', g:'?'} },
      case2: { title: "GRANDMOTHER", top: {id:'GRANDMOTHER', g:'F'}, mid: {id:'PARENT', g:'?'}, btm: {id:'ME', g:'?'} }
    }
  },
  {
    id: "grandkids",
    tab: "Grand-Kids",
    title: "Protocol: Grand-Generations (Down)",
    definition: "Descendants sitting two generational steps below you (-2).",
    logicPoints: [
      "GAP: Requires two vertical steps down.",
      "STANDARD: Grandson (M), Granddaughter (F).",
      "MIDDLE: Child node sits in the center."
    ],
    visual: { 
      type: 'dual-case-chain', 
      case1: { title: "GRANDSON", top: {id:'ME', g:'?'}, mid: {id:'CHILD', g:'?'}, btm: {id:'GRANDSON', g:'M'} },
      case2: { title: "GRANDDAUGHTER", top: {id:'ME', g:'?'}, mid: {id:'CHILD', g:'?'}, btm: {id:'GRANDDAUGHTER', g:'F'} }
    }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Trial 1: Identify the Genders. 'A is Male, B is Female, C is Unknown.'",
    clues: [
      "Rule 1: Node A is a Male.",
      "Rule 2: Node B is a Female.",
      "Rule 3: Node C's gender is not specified."
    ],
    characters: [
      { id: 'C', gender: '?', label: 'NODE C' },
      { id: 'A', gender: 'M', label: 'NODE A' },
      { id: 'B', gender: 'F', label: 'NODE B' }
    ],
    template: 'practice-genders',
    slots: [
      { id: 0, expectedId: 'A', label: 'Male' },
      { id: 1, expectedId: 'B', label: 'Female' },
      { id: 2, expectedId: 'C', label: 'Unknown' }
    ],
    followUp: {
      q: "In a blood relations puzzle, if a person's gender is not explicitly stated or implied, what should you assume?",
      options: ["Assume they are Male", "Assume they are Female", "Leave it Unknown"],
      correct: 2,
      explanation: "Never assume a gender based on a name alone unless explicitly defined by terms like 'brother', 'father', 'wife', etc."
    }
  },
  {
    mission: "Trial 2: Establish a Marriage. 'X is the husband of Y.'",
    clues: [
      "Rule 1: X is the husband of Y."
    ],
    characters: [
      { id: 'Y', gender: 'F', label: 'Y' },
      { id: 'X', gender: 'M', label: 'X' }
    ],
    template: 'practice-marriage',
    slots: [
      { id: 0, expectedId: 'X', label: 'Husband' },
      { id: 1, expectedId: 'Y', label: 'Wife' }
    ],
    followUp: {
      q: "Based on this relationship, what is the exact gender of Y?",
      options: ["Male", "Female", "Unknown"],
      correct: 1,
      explanation: "Since X is identified as the husband, Y must logically be the wife, establishing her gender as Female (F)."
    }
  },
  {
    mission: "Trial 3: Establish Siblings. 'P is the brother of Q.'",
    clues: [
      "Rule 1: P is the brother of Q."
    ],
    characters: [
      { id: 'Q', gender: '?', label: 'Q' },
      { id: 'P', gender: 'M', label: 'P' }
    ],
    template: 'practice-siblings',
    slots: [
      { id: 0, expectedId: 'P', label: 'Brother' },
      { id: 1, expectedId: 'Q', label: 'Sibling' }
    ],
    followUp: {
      q: "Do we know the exact gender of Q based on this statement?",
      options: ["Yes, Q is a brother", "Yes, Q is a sister", "No, Q's gender is unknown"],
      correct: 2,
      explanation: "The statement only defines P as the brother. Q could be a brother or a sister, so their gender remains Unknown (?)."
    }
  },
  {
    mission: "Trial 4: Direct Lineage. 'M is the mother of N.'",
    clues: [
      "Rule 1: M is the mother of N."
    ],
    characters: [
      { id: 'N', gender: '?', label: 'N' },
      { id: 'M', gender: 'F', label: 'M' }
    ],
    template: 'practice-vertical',
    slots: [
      { id: 0, expectedId: 'M', label: 'Parent' },
      { id: 1, expectedId: 'N', label: 'Child' }
    ],
    followUp: {
      q: "If N is later identified as a male, what is his exact relationship to M?",
      options: ["Father", "Brother", "Son"],
      correct: 2,
      explanation: "Since M is the mother, a male child N would logically be her son."
    }
  },
  {
    mission: "Trial 5: Nuclear Family. 'H is the husband of W. S is their son.'",
    clues: [
      "Rule 1: H is the husband of W.",
      "Rule 2: S is the son of H and W."
    ],
    characters: [
      { id: 'S', gender: 'M', label: 'S' },
      { id: 'W', gender: 'F', label: 'W' },
      { id: 'H', gender: 'M', label: 'H' }
    ],
    template: 'practice-family-tree',
    slots: [
      { id: 0, expectedId: 'H', label: 'Husband' },
      { id: 1, expectedId: 'W', label: 'Wife' },
      { id: 2, expectedId: 'S', label: 'Son' }
    ],
    followUp: {
      q: "If S has a sister named D, how is D related to H?",
      options: ["Niece", "Daughter", "Sister-in-law"],
      correct: 1,
      explanation: "The sister of a son is a daughter to the same parents. Therefore, D is the daughter of H."
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
                    <Search size={18} className="text-amber-400" /> {appMode === 'concept' ? "Concept Lab" : "Diagnostic Hub"}
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
        <div className="w-full flex-none overflow-hidden flex flex-col gap-2 h-[480px] sm:h-[620px]">
          <motion.div className="w-full h-full bg-[#110c0b] p-4 sm:p-12 rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar relative pt-12">
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
                       <div className="w-full h-full flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-center gap-6 sm:gap-8 pb-4 md:pb-0">
                         <div className="hidden md:block"></div>
                         
                         <div className="relative w-full flex items-center justify-center">
                            <PracticeTemplate 
                                task={PRACTICE_TASKS[practiceStep]} 
                                placedItems={placedItems}
                                onRemove={practicePhase === 'build' ? removePlaced : null}
                                showRemove={practicePhase === 'build'}
                            />
                         </div>
                         
                         <div className="flex items-center justify-center md:justify-end w-full md:pr-4 lg:pr-8">
                             {practicePhase === 'build' && (
                                 <div className="flex md:flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[#1a110f] rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm relative z-20 shrink-0">
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
                         <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
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
    if (data.type === 'dual-case-vertical-direct') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] justify-center relative overflow-hidden">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-12 text-center absolute top-12">{c.title}</span>
            <Node data={c.top} color={i === 0 ? "bg-amber-600" : "bg-purple-600"} isSmall />
            <div className="w-[2px] bg-yellow-400 h-24 relative mt-2 mb-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
            </div>
            <Node data={c.btm} color="bg-stone-600" isSmall />
          </div>
        ))}
      </div>
    );

    if (data.type === 'dual-case-chain') return (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
          {[data.case1, data.case2].map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[520px] justify-center relative overflow-hidden">
              <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-8 text-center absolute top-12">{c.title}</span>
              <Node data={c.top} color="bg-amber-600" isSmall />
              <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
              </div>
              <Node data={c.mid} color="bg-blue-600" isSmall />
              <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
              </div>
              <Node data={c.btm} color="bg-stone-600" isSmall />
            </div>
          ))}
        </div>
      );

    if (data.type === 'dual-case-inlaw-screenshot-flow') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] sm:h-[540px] justify-center relative overflow-hidden shrink-0">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-10 text-center absolute top-12">{c.title}</span>
            
            <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-square mt-12 shrink-0">
                {/* Fixed Grid Nodes (110x110 wrappers for perfect scaling within viewBox 300 300) */}
                <div className="absolute top-0 left-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.father : c.me} color={i === 0 ? "bg-amber-600" : "bg-blue-600"} isSmall />
                </div>
                <div className="absolute bottom-0 left-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.spouse : c.daughter} color="bg-purple-600" isSmall />
                </div>
                <div className="absolute bottom-0 right-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.me : c.husband} color={i === 0 ? "bg-blue-600" : "bg-stone-600"} isSmall />
                </div>

                {/* SVG Connectors Matrix (300x300 viewbox) - Coords matched to 55px centers */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
                    {/* Vertical Arrow */}
                    <line x1="55" y1="115" x2="55" y2="185" stroke="#facc15" strokeWidth="2.5" />
                    <polygon points="48,183 62,183 55,193" fill="#facc15" />

                    {/* Marriage Bond */}
                    <line x1="115" y1="241" x2="185" y2="241" stroke="#facc15" strokeWidth="2" opacity="0.6" />
                    <line x1="115" y1="249" x2="185" y2="249" stroke="#facc15" strokeWidth="2" opacity="0.6" />
                    
                    {/* Dotted Logic Line */}
                    {i === 0 ? (
                        <>
                           {/* Father-in-law: Arrow points from Me (Right, 245, 245) up to Father (Left, 55, 55) */}
                           <path d="M 245 185 L 245 55 L 120 55" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="8 8" />
                           <polygon points="120,48 120,62 110,55" fill="#fbbf24" />
                        </>
                    ) : (
                        <>
                           {/* Son-in-law: Arrow points from Me (Left, 55, 55) down to Husband (Right, 245, 245) */}
                           <path d="M 115 55 L 245 55 L 245 185" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="8 8" />
                           <polygon points="238,185 252,185 245,195" fill="#fbbf24" />
                        </>
                    )}
                </svg>

                {/* Heart Icon centered on Marriage Bond */}
                <div className="absolute bottom-[40px] left-[50%] -translate-x-1/2 z-20 bg-[#1a110f] rounded-full px-1.5 py-0.5 border border-white/5 shadow-inner">
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
          </div>
        ))}
      </div>
    );

    return null;
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;
    
    if (template === 'practice-genders') {
        return (
            <div className="flex items-center gap-4 sm:gap-8 justify-center">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-marriage') {
        return (
            <div className="flex items-start gap-[64px] sm:gap-[128px] justify-center relative pt-4">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                
                {/* Precisely anchored marriage bond */}
                <div className="absolute top-[56px] sm:top-[72px] left-1/2 -translate-x-1/2 w-[144px] sm:w-[240px] h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center -z-10">
                    <Heart size={16} className="text-rose-500 fill-rose-500 bg-[#0f0a09] px-1 absolute" />
                </div>
                
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-siblings') {
        return (
            <div className="flex items-start gap-[64px] sm:gap-[128px] justify-center relative pt-4">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                
                {/* Precisely anchored sibling bond */}
                <div className="absolute top-[56px] sm:top-[72px] left-1/2 -translate-x-1/2 w-[144px] sm:w-[240px] h-0 border-t-2 border-dotted border-yellow-400/60 -z-10" />
                
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    if (template === 'practice-vertical') {
        return (
            <div className="flex flex-col items-center justify-center gap-2">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="w-[2px] bg-yellow-400 h-16 sm:h-20 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
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
                    {/* Marriage Bond spanning the exact gap */}
                    <div className="w-[144px] sm:w-[240px] h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center">
                         <Heart size={16} className="text-rose-500 fill-rose-500 bg-[#0f0a09] px-1 absolute" />
                    </div>
                    {/* Downward Arrow dropping cleanly from the center of the bond */}
                    <div className="w-[2.5px] bg-yellow-400 h-[80px] sm:h-[100px] relative">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>
                </div>

                {/* Bottom Row: Son */}
                <div className="mt-[20px] sm:mt-[30px] z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>
            </div>
        );
    }
    return null;
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }