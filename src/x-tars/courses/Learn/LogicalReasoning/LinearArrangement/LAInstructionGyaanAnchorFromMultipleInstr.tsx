import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  X as XIcon,
  Trophy,
  CheckCircle2,
  Play,
  RotateCcw,
  Layers,
  XCircle,
  Info,
  Check,
  Search,
  GraduationCap,
  Target,
  Sparkles,
  MousePointer2,
  Briefcase,
  Palette,
  User,
  AlertCircle,
  ArrowRight,
  Shuffle,
  ArrowLeftRight,
  RefreshCcw,
  Zap,
  Timer
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  pA: { initial: 'A', color: 'from-rose-400 to-rose-600' },
  pB: { initial: 'B', color: 'from-sky-400 to-sky-600' },
  pC: { initial: 'C', color: 'from-amber-400 to-amber-600' },
  pD: { initial: 'D', color: 'from-emerald-400 to-emerald-600' },
  pE: { initial: 'E', color: 'from-purple-400 to-purple-600' },
};

const JOB_DATA = {
  jDoctor: { initial: 'Dr', name: 'Doctor' },
  jLawyer: { initial: 'La', name: 'Lawyer' },
  jArtist: { initial: 'Ar', name: 'Artist' },
  jEngineer: { initial: 'En', name: 'Engineer' },
  jManager: { initial: 'Ma', name: 'Manager' },
};

const COLOR_DATA = {
  cRed: { initial: 'Re', bg: 'bg-red-600' },
  cBlue: { initial: 'Bl', bg: 'bg-blue-600' },
  cGreen: { initial: 'Gr', bg: 'bg-green-600' },
  cPink: { initial: 'Pi', bg: 'bg-pink-400' },
  cYellow: { initial: 'Ye', bg: 'bg-yellow-400' },
};

const SCENARIOS = [
  {
    title: "The Professional Row",
    instructions: [
      { 
        text: "The Manager sits at the 4th position.", 
        isAnchor: true, 
        elements: { people: [], jobs: ['jManager'], colors: [] },
        placement: [{ slot: 3, jobId: 'jManager' }],
        alts: null,
        reason: "This is an anchor because it gives a specific position (4th) for the Manager. No other variable is needed to identify this spot.",
        theoryFlow: "Look at the list. Clue 2 is about neighbors, and Clue 3 is about gaps. Neither gives a fixed spot. But Clue 1 gives us the 4th position. We start here to stabilize the build." 
      },
      { 
        text: "The Doctor sits next to the Manager.", 
        isAnchor: false, 
        elements: { people: [], jobs: ['jDoctor', 'jManager'], colors: [] },
        placement: [{ slot: 2, jobId: 'jDoctor' }, { slot: 3, jobId: 'jManager' }], 
        alts: [{ slot: 4, jobId: 'jDoctor' }, { slot: 3, jobId: 'jManager' }], 
        reason: "This is relative. 'Next to' depends on the Manager. If the Manager isn't placed, the Doctor has no reference. Even with the Manager placed, 'Next to' has two possible sides.",
        theoryFlow: "While this is helpful once the Manager is placed, it cannot be our anchor because it has two possible spots." 
      },
      { 
        text: "B sits between the Doctor and the Artist.", 
        isAnchor: false, 
        elements: { people: ['pB'], jobs: ['jDoctor', 'jArtist'], colors: [] },
        placement: [{ slot: 1, jobId: 'jDoctor' }, { slot: 2, personId: 'pB' }, { slot: 3, jobId: 'jArtist' }],
        alts: [{ slot: 2, jobId: 'jDoctor' }, { slot: 3, personId: 'pB' }, { slot: 4, jobId: 'jArtist' }],
        reason: "Highly ambiguous. This needs two other people to be placed first. Without them, B could be anywhere in the line.",
        theoryFlow: "This is a complex link. It requires the Doctor and Artist to be fixed first. Since we can't determine B's exact spot independently, it's not an anchor." 
      }
    ]
  },
  {
    title: "The Extreme Ends",
    instructions: [
      { 
        text: "The Artist sits at one of the extreme ends.", 
        isAnchor: false, 
        elements: { people: [], jobs: ['jArtist'], colors: [] },
        placement: [{ slot: 0, jobId: 'jArtist' }],
        alts: [{ slot: 5, jobId: 'jArtist' }],
        reason: "Unstable: 'Extreme ends' means two possibilities (Position 1 or 6). Not a perfect anchor yet.",
        theoryFlow: "You might think this is an anchor, but check Position 1 and Position 6. It's not a single fixed truth!" 
      },
      { 
        text: "B sits at the 1st position.", 
        isAnchor: true, 
        elements: { people: ['pB'], jobs: [], colors: [] },
        placement: [{ slot: 0, personId: 'pB' }],
        alts: null,
        reason: "Fixed spot: Position 1 is locked to B.",
        theoryFlow: "This is our Anchor! Once B is at Pos 1, we know the Artist from Clue 1 must be at the OTHER extreme end (Pos 6)." 
      }
    ]
  },
  {
    title: "The Colorful Chain",
    instructions: [
      { 
        text: "A sits next to the person who likes Green.", 
        isAnchor: false, 
        elements: { people: ['pA'], jobs: [], colors: ['cGreen'] },
        placement: [{ slot: 1, personId: 'pA' }, { slot: 2, colorId: 'cGreen' }],
        alts: [{ slot: 3, personId: 'pA' }, { slot: 2, colorId: 'cGreen' }],
        reason: "Relative: A could be on either side of Green.",
        theoryFlow: "Starting here is dangerous. A and Green could be anywhere in the middle of the row." 
      },
      { 
        text: "The person at the 6th position likes Green.", 
        isAnchor: true, 
        elements: { people: [], jobs: [], colors: ['cGreen'] },
        placement: [{ slot: 5, colorId: 'cGreen' }],
        alts: null,
        reason: "Fixed spot: Position 6 is definitely Green.",
        theoryFlow: "This is the Anchor. Now we know exactly where Position 6 is. Now Clue 1 is easy: A must be at Position 5!" 
      }
    ]
  }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const slotRefs = useRef({});
  const [appMode, setAppMode] = useState('concept');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  
  // Logic States
  const [placements, setPlacements] = useState(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
  const [selectedClueIdx, setSelectedClueIdx] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGhosting, setIsGhosting] = useState(false);
  const [ghostCycle, setGhostCycle] = useState(0); 
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);
  const [isLabFinished, setIsLabFinished] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const currentScenario = SCENARIOS[scenarioIndex];
  const activeClue = selectedClueIdx !== null ? currentScenario.instructions[selectedClueIdx] : null;

  // Reset logic
  const resetAll = useCallback(() => {
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setIsEvaluating(false);
    setSelectedClueIdx(null);
    setIsGhosting(false);
    setGhostCycle(0);
    setIsScenarioComplete(false);
    setFeedbackText("");
  }, []);

  // Ghosting Animation Logic
  useEffect(() => {
    let interval;
    if (isGhosting && activeClue?.alts) {
        setGhostCycle(1);
        interval = setInterval(() => {
            setGhostCycle(prev => (prev === 3 ? 1 : prev + 1));
        }, 1200);
        return () => clearInterval(interval);
    }
  }, [isGhosting, activeClue]);

  const handleModeSwitch = (mode) => {
    setAppMode(mode);
    setScenarioIndex(0);
    setIsLabFinished(false);
    resetAll();
  };

  const handleNextScenario = () => {
    if (scenarioIndex < SCENARIOS.length - 1) {
        setScenarioIndex(prev => prev + 1);
        resetAll();
    } else {
        setIsLabFinished(true);
    }
  };

  const handleRetryCurrent = () => {
      resetAll();
  };

  const handleClueSelect = (idx) => {
    if (isEvaluating || appMode === 'concept') return;
    setSelectedClueIdx(idx);
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setFeedbackText("");
  };

  const handleTheoryAutoFlow = async () => {
    resetAll();
    setIsEvaluating(true);

    for (let i = 0; i < currentScenario.instructions.length; i++) {
        setSelectedClueIdx(i);
        const clue = currentScenario.instructions[i];
        
        if (!clue.isAnchor) {
            setIsGhosting(true);
            await new Promise(r => setTimeout(r, 4000));
            setIsGhosting(false);
        } else {
            const next = [...placements];
            clue.placement.forEach(p => {
                next[p.slot] = { ...next[p.slot], ...p };
            });
            setPlacements(next);
            await new Promise(r => setTimeout(r, 3000));
        }
    }
    setIsScenarioComplete(true);
  };

  const handlePracticeSubmit = () => {
    if (!activeClue) return;
    setIsEvaluating(true);
    
    if (!activeClue.isAnchor) {
        setIsGhosting(true);
        setFeedbackText("UNSTABLE! Items could move between multiple positions. A true anchor is a fixed point of truth.");
        setTimeout(() => {
            setIsGhosting(false);
            setIsEvaluating(false);
        }, 5000);
    } else {
        const isPlacementCorrect = activeClue.placement.every(item => {
            const slot = placements[item.slot];
            if (item.personId && slot.personId !== item.personId) return false;
            if (item.jobId && slot.jobId !== item.jobId) return false;
            if (item.colorId && slot.colorId !== item.colorId) return false;
            return true;
        });

        if (isPlacementCorrect) {
            setFeedbackText("STABLE ANCHOR! You've successfully locked the starting point of this logic puzzle.");
            setIsScenarioComplete(true);
        } else {
            setFeedbackText("WRONG SPOT! You picked the anchor, but placed it in the wrong position. Try again.");
            setTimeout(() => setIsEvaluating(false), 3000);
        }
    }
  };

  const handleDragEnd = (event, info, id, type) => {
    if (appMode !== 'practice' || selectedClueIdx === null || isEvaluating) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let minDistance = 1000;
    let targetIdx = null;

    Array(6).fill(0).forEach((_, idx) => {
        const ref = slotRefs.current[`slot-${idx}`];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        const dist = Math.sqrt(Math.pow(dropPoint.x - centerX, 2) + Math.pow(dropPoint.y - centerY, 2));
        if (dist < 60 && dist < minDistance) {
            minDistance = dist;
            targetIdx = idx;
        }
    });

    if (targetIdx !== null) {
        setPlacements(prev => {
            const next = [...prev];
            next[targetIdx] = { ...next[targetIdx], [type]: id };
            return next;
        });
    }
  };

  const renderSlot = (idx) => {
    let data = placements[idx];
    let isGhost = false;

    if (isEvaluating && activeClue && !activeClue.isAnchor) {
        if (ghostCycle === 1) {
            data = activeClue.placement.find(p => p.slot === idx) || { personId: null };
        } else if (ghostCycle === 3) {
            data = activeClue.alts.find(p => p.slot === idx) || { personId: null };
            isGhost = true;
        } else {
            data = { personId: null };
        }
    }

    const person = data?.personId ? PEOPLE_DATA[data.personId] : null;
    const job = data?.jobId ? JOB_DATA[data.jobId] : null;
    const color = data?.colorId ? COLOR_DATA[data.colorId] : null;

    return (
      <div 
        key={idx}
        ref={el => slotRefs.current[`slot-${idx}`] = el}
        className={`relative flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-4 rounded-2xl border-2 transition-all bg-black/20 border-white/5 min-w-[100px] sm:min-w-[140px]`}
      >
        <span className="text-[7px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Position {idx + 1}</span>
        
        {/* Person Slot */}
        <div className={`relative w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${person ? `bg-gradient-to-br ${person.color} border-white shadow-xl` : 'border-dashed border-white/10'}`}>
           {!person && <User size={16} className="text-white/10" />}
           {person && <span className={`text-white font-black text-lg sm:text-xl ${isGhost ? 'opacity-40' : ''}`}>{String(person.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><User size={8} className="text-white/40" /></div>
        </div>

        {/* Job Slot */}
        <div className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${job ? `bg-amber-600/30 border-amber-400` : 'border-dashed border-white/5'}`}>
           {!job && <Briefcase size={14} className="text-white/10" />}
           {job && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(job.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><Briefcase size={8} className="text-white/40" /></div>
        </div>

        {/* Color Slot */}
        <div className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${color ? `${color.bg} border-white` : 'border-dashed border-white/5'}`}>
           {!color && <Palette size={14} className="text-white/10" />}
           {color && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(color.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><Palette size={8} className="text-white/40" /></div>
        </div>

        {isGhost && (
            <div className="absolute -bottom-6 flex flex-col items-center">
                 <ArrowLeftRight size={10} className="text-cyan-400 animate-pulse" />
                 <span className="text-[6px] font-black text-cyan-400 uppercase whitespace-nowrap">Ambiguous</span>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20 px-2 sm:px-0">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-4 sm:pt-6 relative z-20">
        <div className="w-full bg-[#2a1a16] p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border-b-4 sm:border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center justify-center lg:justify-start gap-1.5 text-[#a88a6d] font-black uppercase text-[8px] sm:text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white text-lg sm:text-xl font-black uppercase tracking-tighter text-[#e6dccb]">Can we select anchor from multiple instructions?</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full lg:w-auto overflow-hidden">
            <button onClick={() => handleModeSwitch('concept')} className={`flex-1 lg:flex-none px-4 sm:px-8 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => handleModeSwitch('practice')} className={`flex-1 lg:flex-none px-4 sm:px-8 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1400px] py-4 sm:py-6 relative z-10">
        <div className="bg-[#2a1a16] p-1 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 sm:pt-8 pb-10 sm:pb-12 px-2 sm:px-6 rounded-[1.2rem] sm:rounded-[2rem] flex flex-col items-center min-h-[750px] shadow-inner">
            
            <div className="w-full max-w-5xl bg-black/60 backdrop-blur-md border border-white/10 p-4 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl mb-8 sm:mb-12 relative overflow-hidden">
               
               <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                  <div className="flex flex-col items-center sm:items-start gap-1">
                     <div className="flex items-center gap-2 mb-1">
                        <Target size={18} className="text-yellow-400" />
                        <span className="text-yellow-400 font-black uppercase text-xs sm:text-base tracking-widest">Logic Objective</span>
                     </div>
                     <p className="text-white text-lg sm:text-3xl font-black uppercase leading-none text-center sm:text-left">
                         {appMode === 'concept' ? 'Observe Independent Truth' : 'Identify & Lock the Anchor'}
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     {appMode === 'concept' && !isEvaluating && (
                        <button onClick={handleTheoryAutoFlow} className="bg-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2 border-b-4 border-cyan-800">
                             <Play size={18} fill="currentColor" /> Run Lesson
                        </button>
                     )}
                     {appMode === 'concept' && isEvaluating && (
                        <button onClick={resetAll} className="bg-black/40 text-white p-3 sm:p-4 rounded-full hover:bg-black/60 transition-all border border-white/10">
                            <RotateCcw size={16} />
                        </button>
                     )}
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 mb-10">
                  {currentScenario.instructions.map((clue, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleClueSelect(idx)}
                        disabled={isEvaluating}
                        className={`group relative flex items-start text-left gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${
                            selectedClueIdx === idx ? 'bg-white/10 border-yellow-400 scale-[1.01] shadow-xl' : 'bg-transparent border-white/5'
                        }`}
                      >
                         <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                            selectedClueIdx === idx ? 'bg-yellow-400 border-yellow-400' : 'border-white/20'
                         }`}>
                             {selectedClueIdx === idx ? <MousePointer2 size={12} className="text-black" /> : <span className="text-[10px] font-black text-white/20">{idx + 1}</span>}
                         </div>
                         <p className={`text-sm sm:text-xl font-bold tracking-tight leading-tight ${selectedClueIdx === idx ? 'text-white' : 'text-white/60'}`}>
                             {String(clue.text)}
                         </p>
                      </button>
                  ))}
               </div>

               {/* Practice Interaction */}
               <AnimatePresence>
                   {appMode === 'practice' && selectedClueIdx !== null && !isEvaluating && (
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-4">
                           <div className="bg-yellow-400/20 px-6 py-2 rounded-full border border-yellow-400/40 flex items-center gap-2">
                               <Timer size={14} className="text-yellow-400" />
                               <span className="text-yellow-400 font-black uppercase text-[10px]">Now place items in Position 1-6</span>
                           </div>
                           <button onClick={handlePracticeSubmit} className="bg-green-600 text-white px-12 py-4 rounded-xl sm:rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-800">
                               Submit Selection
                           </button>
                       </motion.div>
                   )}
               </AnimatePresence>

               {/* Analysis Verdict */}
               <AnimatePresence>
                  {isEvaluating && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border-l-8 shadow-2xl ${
                          activeClue.isAnchor ? 'bg-green-900/40 border-green-500' : 'bg-rose-900/40 border-rose-500'
                      }`}>
                          <div className="flex items-center gap-3 mb-4">
                              {activeClue.isAnchor ? <CheckCircle2 className="text-green-400" /> : <XCircle className="text-rose-400" />}
                              <h4 className="text-white font-black uppercase text-xs sm:text-sm tracking-widest">
                                  {activeClue.isAnchor ? "VERDICT: FIXED ANCHOR" : "VERDICT: UNSTABLE LINK"}
                              </h4>
                          </div>
                          
                          <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-6">
                            <h5 className="text-yellow-400 font-black uppercase text-[9px] sm:text-[10px] mb-2 flex items-center gap-2">
                                <Search size={12}/> Analysis:
                            </h5>
                            <p className="text-white italic font-bold text-sm sm:text-lg leading-relaxed">
                                {appMode === 'concept' ? String(activeClue.theoryFlow) : String(feedbackText || activeClue.reason)}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-4">
                              <button onClick={resetAll} className="bg-black/40 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] hover:bg-black/60 transition-all flex items-center justify-center gap-2 border border-white/10">
                                  <RefreshCcw size={14} /> Retry Scenario
                              </button>
                              
                              {isScenarioComplete && (
                                  <button onClick={handleNextScenario} className="flex-1 bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl">
                                      Next Scenario <ArrowRight size={14} />
                                  </button>
                              )}
                          </div>
                      </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Row Workspace */}
            <div className="w-full overflow-x-auto no-scrollbar pb-10 px-4">
              <div className="flex justify-start sm:justify-center gap-3 sm:gap-6 min-w-max mx-auto">
                 {Array(6).fill(0).map((_, i) => renderSlot(i))}
              </div>
            </div>

            {/* Item Tray */}
            <AnimatePresence>
                {selectedClueIdx !== null && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center gap-6 mt-4 px-2">
                        <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 w-full max-w-5xl shadow-2xl relative">
                            <span className="absolute -top-3 left-6 sm:left-8 bg-black px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10 flex items-center gap-2">
                                <Palette size={12}/> Focus Tray: Clue Items
                            </span>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> People</span>
                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                        {activeClue?.elements.people.length > 0 ? activeClue.elements.people.map(id => (
                                            <motion.div key={id} drag={appMode === 'practice' && !isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'personId')} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} cursor-grab shadow-xl`}><span className="text-white font-black">{String(PEOPLE_DATA[id].initial)}</span></motion.div>
                                        )) : <div className="h-12 sm:h-14 flex items-center text-white/5 uppercase font-black text-[9px]">None</div>}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={12}/> Jobs</span>
                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                        {activeClue?.elements.jobs.length > 0 ? activeClue.elements.jobs.map(id => (
                                            <motion.div key={id} drag={appMode === 'practice' && !isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'jobId')} className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-amber-400/30 flex items-center justify-center bg-amber-900/40 cursor-grab shadow-xl text-[10px]"><span className="text-white font-black uppercase">{String(JOB_DATA[id].initial)}</span></motion.div>
                                        )) : <div className="h-12 sm:h-14 flex items-center text-white/5 uppercase font-black text-[9px]">None</div>}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center gap-3">
                                    <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Palette size={12}/> Colors</span>
                                    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                        {activeClue?.elements.colors.length > 0 ? activeClue.elements.colors.map(id => (
                                            <motion.div key={id} drag={appMode === 'practice' && !isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'colorId')} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white/20 flex items-center justify-center ${COLOR_DATA[id].bg} cursor-grab shadow-xl text-[10px]`}><span className="text-white font-black uppercase">{String(COLOR_DATA[id].initial)}</span></motion.div>
                                        )) : <div className="h-12 sm:h-14 flex items-center text-white/5 uppercase font-black text-[9px]">None</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-4">
                                <div className="bg-amber-400 p-2 rounded-lg text-black shrink-0"><Info size={16} /></div>
                                <div>
                                    <h4 className="text-amber-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest mb-1">Strategist's Tip</h4>
                                    <p className="text-white/70 text-[10px] sm:text-[12px] font-bold leading-relaxed">
                                        Look for clues that lock a specific attribute into a <span className="text-amber-400 underline decoration-amber-500">Fixed Position</span>. Relative links like 'Next to' only become anchors once their reference point is placed!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      {/* Lab Finished Modal */}
      <AnimatePresence>
        {isLabFinished && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-2xl p-10 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div>
                        <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter text-shadow-sm">Lab Complete!</h1>
                        <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-bold mb-12">"You have successfully mastered the logic of scanning for anchors. You can now determine structural certainty with ease!"</p>
                        <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/WhatAfterAnchor')} className="bg-[#3e2723] text-[#e6dccb] px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:scale-95 transition-all">Next Module</button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-col items-center text-center opacity-40 px-4">
          <GraduationCap size={48} className="text-[#3e2723] mb-2" />
          <h3 className="text-[#3e2723] font-black uppercase text-xs">Analytical Foundation Lab</h3>
          <p className="text-[#3e2723] text-[9px] font-bold max-w-xs leading-relaxed italic text-center">"Independent truths create the foundation for logical certainty."</p>
      </div>
    </div>
  );
}