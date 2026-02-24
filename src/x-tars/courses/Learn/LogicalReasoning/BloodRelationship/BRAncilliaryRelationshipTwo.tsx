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
  Sparkles,
  MoveRight,
  MoveDown
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================

const CONCEPT_PROTOCOLS = [
  {
    id: "brother-in-law",
    tab: "Brother-in-law",
    title: "Dual Case: Brother-in-law",
    definition: "A Brother-in-law is a male relative by marriage. Path 1: Your spouse's brother. Path 2: Your sister's husband.",
    logicPoints: [
      "Standard: Marked as (M) for Male.",
      "Connection: Linked via marriage (=) or horizontal sibling line.",
      "Tier: Always sits on the same generation tier (Gen 0)."
    ],
    visual: { 
      type: 'dual-case-horizontal', 
      case1: { title: "Spouse's Brother", nodes: [{id:'Me', g:'?'}, {id:'Spouse', g:'?', partner:true}, {id:'Brother-in-law', g:'M', sibling:true}] },
      case2: { title: "Sister's Husband", nodes: [{id:'Me', g:'?'}, {id:'Sister', g:'F', sibling:true}, {id:'Brother-in-law', g:'M', partner:true}] }
    }
  },
  {
    id: "sister-in-law",
    tab: "Sister-in-law",
    title: "Dual Case: Sister-in-law",
    definition: "A Sister-in-law is a female relative by marriage. Path 1: Your spouse's sister. Path 2: Your brother's wife.",
    logicPoints: [
      "Standard: Marked as (F) for Female.",
      "Bond: Double line (=) represents the marriage bridge.",
      "Hierarchy: Shares the same generational level as you."
    ],
    visual: { 
      type: 'dual-case-horizontal', 
      case1: { title: "Spouse's Sister", nodes: [{id:'Me', g:'?'}, {id:'Spouse', g:'?', partner:true}, {id:'Sister-in-law', g:'F', sibling:true}] },
      case2: { title: "Brother's Wife", nodes: [{id:'Me', g:'?'}, {id:'Brother', g:'M', sibling:true}, {id:'Sister-in-law', g:'F', partner:true}] }
    }
  },
  {
    id: "niece",
    tab: "Niece",
    title: "Dual Case: Niece",
    definition: "A Niece is the female child of your sibling. Path: You ... Sibling then Sibling ⬇ Niece.",
    logicPoints: [
      "Standard: Marked as (F) for Female.",
      "Path: Dotted line to Sibling, Solid arrow from Sibling to Child.",
      "Generation: Me/Sibling at Tier 0, Niece at Tier -1."
    ],
    visual: { 
      type: 'dual-case-vertical-arrow-refined', 
      case1: { title: "Brother's Daughter", me: {id:'Me', g:'?'}, sibling: {id:'Brother', g:'M'}, child: {id:'Niece', g:'F'} },
      case2: { title: "Sister's Daughter", me: {id:'Me', g:'?'}, sibling: {id:'Sister', g:'F'}, child: {id:'Niece', g:'F'} }
    }
  },
  {
    id: "nephew",
    tab: "Nephew",
    title: "Dual Case: Nephew",
    definition: "A Nephew is the male child of your sibling. Path: You ... Sibling then Sibling ⬇ Nephew.",
    logicPoints: [
      "Standard: Marked as (M) for Male.",
      "Logic: The Sibling's son is your Nephew.",
      "Visual: Child is centered directly under the specific parent."
    ],
    visual: { 
      type: 'dual-case-vertical-arrow-refined', 
      case1: { title: "Brother's Son", me: {id:'Me', g:'?'}, sibling: {id:'Brother', g:'M'}, child: {id:'Nephew', g:'M'} },
      case2: { title: "Sister's Son", me: {id:'Me', g:'?'}, sibling: {id:'Sister', g:'F'}, child: {id:'Nephew', g:'M'} }
    }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Construction: 'A is married to B. B has a brother C.'",
    clues: [
      "Rule 1: A and B are married (=).",
      "Rule 2: A is Female (F).",
      "Rule 3: B and C are horizontal siblings.",
      "Rule 4: C is Male (M)."
    ],
    characters: [
      { id: 'Partner A', gender: 'F', label: 'Wife' },
      { id: 'Partner B', gender: 'M', label: 'Husband' },
      { id: 'Brother C', gender: 'M', label: 'Brother' }
    ],
    template: 'marriage-sibling-link',
    slots: [
      { id: 0, expectedId: 'Partner A', label: 'Tier 0' },
      { id: 1, expectedId: 'Partner B', label: 'Tier 0' },
      { id: 2, expectedId: 'Brother C', label: 'Tier 0' }
    ],
    followUp: {
      q: "How is Brother C related to Partner A?",
      options: ["Brother", "Brother-in-law", "Husband"],
      correct: 1,
      explanation: "Brother C is the sibling of A's husband (B). This makes C the Brother-in-law."
    }
  }
];

// ==========================================
// SUB-COMPONENTS
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
      className={`flex flex-col items-center gap-1 sm:gap-2 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`${isSmall ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-20 h-20 sm:w-28 sm:h-28'} rounded-full ${color} flex items-center justify-center text-white shadow-2xl border-2 border-white/10 relative z-10 transition-transform`}>
        <Icon className="absolute inset-0 m-auto opacity-20 w-3/4 h-3/4" />
        <div className={`${isSmall ? 'text-[10px]' : 'text-xs sm:text-lg'} font-black drop-shadow-md text-center px-1 z-10 uppercase tracking-tighter`}>{data.id}</div>
        <div className={`absolute ${isSmall ? '-top-2 w-7 h-7 text-[8px]' : '-top-3.5 w-10 h-10 text-[11px] sm:text-[14px]'} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-md border-2 border-[#1a0f0d] z-20`}>
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
        <span className="text-white/60 font-black text-[8px] sm:text-[10px] uppercase tracking-widest text-center mt-2 whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-white/5">
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
                <div className={`${isSmall ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-24 sm:h-24'} rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10 shadow-inner relative z-10`}>
                    <MousePointer2 className="text-white/10 w-6 h-6" />
                </div>
            )}
            <span className="text-white/20 font-black text-[7px] sm:text-[10px] uppercase tracking-widest bg-black/10 px-2 rounded-full mt-1 relative z-10">{data.label}</span>
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

  const nextPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        setPracticeStep(prev => prev + 1);
        setPracticePhase('build');
        setPlacedItems({});
        setQuizFeedback(null);
        setShowExplanation(false);
        setCompletedClues([]);
    } else {
        setLessonFinished(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] pb-10" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm">
        <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
            <div className="flex flex-col items-start leading-tight px-2">
                <button onClick={() => navigate('/learn/logicalReasoning/bloodRelations')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
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
          <motion.div className="w-full h-full bg-[#1a0f0d] p-4 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            <div className="absolute top-4 left-8 opacity-30 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[#a88a6d] flex items-center gap-3">
                <Key size={16} className="text-amber-400 animate-pulse" /> Construction Rail
            </div>

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
                       <div className="flex flex-col items-center gap-10 w-full">
                         <div className="relative min-h-[300px] w-full flex items-center justify-center">
                            <PracticeTemplate 
                                task={PRACTICE_TASKS[practiceStep]} 
                                placedItems={placedItems}
                                onRemove={practicePhase === 'build' ? removePlaced : null}
                                showRemove={practicePhase === 'build'}
                            />
                         </div>

                         {practicePhase === 'build' && (
                             <div className="flex gap-4 sm:gap-10 p-6 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm relative z-20">
                                {PRACTICE_TASKS[practiceStep].characters.map(char => {
                                    const isPlaced = Object.values(placedItems).includes(char.id);
                                    return (
                                        <div key={char.id} className="relative">
                                            <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
                                                <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(_, info) => handleDragEnd(char.id, info.point)} />
                                            </div>
                                            {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={32} /></div>}
                                        </div>
                                    );
                                })}
                             </div>
                         )}
                       </div>
                     )}
                   </motion.div>
                ) : (
                  // <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8 text-center p-10">
                  //   <div className="relative">
                  //       <Trophy size={120} className="text-yellow-400 animate-bounce shadow-amber-400/20 drop-shadow-xl" />
                  //       <Sparkles size={40} className="absolute -top-4 -right-4 text-white animate-pulse" />
                  //   </div>
                  //   <h2 className="text-white text-4xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-4">LOGIC CERTIFIED</h2>
                  //   <button onClick={handleReset} className="bg-amber-400 text-black px-16 py-5 rounded-2xl font-black uppercase text-xl shadow-2xl border-b-8 border-amber-600 hover:scale-105 transition-all">Restart Concept Session</button>
                  // </motion.div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8 text-center p-6 sm:p-10 w-full">
                    <Trophy size={100} className="text-yellow-400 animate-bounce shadow-amber-400/20 drop-shadow-xl" />
                    <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">LOGIC CERTIFIED</h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mt-6">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl transition-all">
                            Restart Module
                        </button>
                        <button onClick={() => navigate('/learn/logicalReasoning/bloodRelations/fundamentals')} className="flex-1 bg-amber-400 text-black border-b-8 border-amber-600 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="w-full flex-none mt-2 bg-[#2a1a16] p-4 sm:p-6 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-4 overflow-hidden border-b-[10px] border-black/40 min-h-[300px] sm:min-h-[380px]">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />

          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6 h-full relative z-10">
            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex items-center gap-2 px-2 opacity-50"><BookOpen size={16} className="text-[#a88a6d]" /><span className="text-[#a88a6d] font-black uppercase text-[11px]">Deduction Log</span></div>
              <div className="bg-black/40 p-4 rounded-[1.5rem] border border-white/10 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar shadow-inner">
                {appMode === 'concept' ? (
                   <div className="space-y-4">
                     <p className="text-white text-base sm:text-xl font-black border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-tighter"><GitBranch size={16} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-2">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-2 text-left py-0.5"><Check size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white/80 font-bold italic text-[12px] sm:text-[14px] leading-tight tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3 h-full">
                     <span className="text-orange-400 font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Trial {practiceStep + 1} Mission</span>
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
              <div className="flex items-center justify-between px-2 opacity-50"><div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[11px]">Interaction Hub</span></div></div>
              <div className="bg-[#3e2723] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col gap-4">
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === i ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 shadow-inner">
                            <p className="text-white text-[14px] sm:text-[18px] font-bold leading-relaxed italic">{CONCEPT_PROTOCOLS[activeTab].definition}</p>
                            {activeTab === CONCEPT_PROTOCOLS.length - 1 ? (
                                <button onClick={() => setAppMode('practice')} className="mt-2 flex items-center gap-3 bg-emerald-500 text-white px-8 py-2.5 rounded-full font-black uppercase text-[11px] shadow-xl border-b-4 border-emerald-800 animate-pulse transition-all">Engage Practice Hub <ArrowRight size={16} /></button>
                            ) : (
                                <button onClick={() => setActiveTab(prev => prev + 1)} className="mt-2 flex items-center gap-3 bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 px-8 py-2.5 rounded-full font-black uppercase text-[11px] hover:bg-yellow-400 hover:text-black transition-all">Observe Next <ChevronRight size={16} /></button>
                            )}
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
                            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar pt-1">
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
                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 mt-auto pb-1">
                                        {showExplanation && <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center shadow-inner"><p className="text-[11px] sm:text-[13px] font-bold italic text-white/70 leading-tight"><Info size={14} className="inline mr-2 text-amber-400" />{PRACTICE_TASKS[practiceStep].followUp.explanation}</p></div>}
                                        <div className="flex gap-2 w-full">
                                            {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-2.5 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"><RefreshCw size={14} /> Try Again</button>}
                                            <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-2.5 text-white rounded-full font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-2 transition-all ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={14} />}</button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                         )}
                      </motion.div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center"><Zap size={48} className="text-yellow-400 animate-pulse" /><p className="text-[#a88a6d] font-bold italic text-lg px-8">Diagnostic Trial Success.</p><button onClick={handleReset} className="bg-yellow-400 text-black px-16 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl active:scale-95 border-b-4 border-amber-600">Restart Concept</button></div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 138, 109, 0.3); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

function HeartIcon({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;
    
    if (template === 'marriage-sibling-link' || template === 'sibling-marriage-link') {
        const isMarriageFirst = template === 'marriage-sibling-link';
        return (
            <div className="flex flex-col items-center py-4">
                <div className="flex items-center gap-16 sm:gap-24 relative px-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} />
                    <div className={`w-16 sm:w-24 h-0.5 ${isMarriageFirst ? 'border-t-4 border-double' : 'border-t-2'} border-yellow-400/40 flex items-center justify-center`}>
                       {isMarriageFirst && <HeartIcon size={14} className="text-rose-500 fill-rose-500" />}
                    </div>
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} />
                    <div className={`w-16 sm:w-24 h-0.5 ${!isMarriageFirst ? 'border-t-4 border-double' : 'border-t-2'} border-yellow-400/40 flex items-center justify-center`}>
                       {!isMarriageFirst && <HeartIcon size={14} className="text-rose-500 fill-rose-500" />}
                    </div>
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} />
                </div>
            </div>
        );
    }
    return null;
}

function TreeVisual({ data }) {
    if (data.type === 'dual-case-horizontal') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-white/5 p-12 rounded-full border border-white/5 shadow-inner min-w-[320px] sm:min-w-[460px] h-[320px] sm:h-[460px] justify-center">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-12 text-center">{c.title}</span>
            <div className="flex items-center gap-4 sm:gap-8">
              {c.nodes.map((n, ni) => (
                <React.Fragment key={ni}>
                  <Node data={n} color={ni===0?'bg-blue-600':'bg-stone-600'} isSmall />
                  {ni < c.nodes.length -1 && (
                    <div className={`w-8 sm:w-16 h-0.5 ${c.nodes[ni+1].partner ? 'border-t-4 border-double' : 'border-t-2'} border-yellow-400/40 flex items-center justify-center`}>
                      {c.nodes[ni+1].partner && <Heart size={10} className="text-rose-500 fill-rose-500" />}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    );

    if (data.type === 'dual-case-vertical-arrow-refined') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-white/5 p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[460px] h-[340px] sm:h-[460px] justify-center">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-12 text-center">{c.title}</span>
            <div className="flex items-start gap-12 sm:gap-20">
                <div className="pt-2">
                    <Node data={c.me} color="bg-blue-600" isSmall />
                </div>
                
                <div className="flex flex-col items-center relative">
                    <div className="absolute right-full top-[30px] sm:top-[34px] w-12 sm:w-20 mr-2 sm:mr-4 flex items-center">
                        <div className="w-full border-t-2 border-dotted border-yellow-400/60" />
                    </div>

                    <Node data={c.sibling} color="bg-purple-600" isSmall />
                    
                    <div className="w-[2px] bg-yellow-400 h-10 sm:h-16 relative mt-1">
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>
                    <Node data={c.child} color="bg-stone-600" isSmall />
                </div>
            </div>
          </div>
        ))}
      </div>
    );

    return null;
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }