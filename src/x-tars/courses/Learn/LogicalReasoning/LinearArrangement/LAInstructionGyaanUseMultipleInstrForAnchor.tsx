import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Square,
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
  HelpCircle,
  ArrowRight,
  Shuffle,
  ArrowLeftRight,
  RefreshCcw,
  Zap,
  Timer,
  Trash2
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

// --- THEORY SCENARIOS ---
const THEORY_SCENARIOS = [
  {
    title: "Logic of Elimination (Theory)",
    instructions: [
      { id: 1, text: "The Artist sits at an extreme end (Pos 1 or 6).", elements: { people: [], jobs: ['jArtist'], colors: [] }, placement: [{ slot: 0, jobId: 'jArtist' }], alts: [{ slot: 5, jobId: 'jArtist' }] },
      { id: 2, text: "Position 1 is occupied by the Doctor.", elements: { people: [], jobs: ['jDoctor'], colors: [] }, placement: [{ slot: 0, jobId: 'jDoctor' }], alts: null },
      { id: 3, text: "The Artist likes Pink color.", elements: { people: [], jobs: ['jArtist'], colors: ['cPink'] }, placement: [], alts: null }
    ],
    combinedTarget: [1, 2],
    finalPlacement: [{ slot: 0, jobId: 'jDoctor' }, { slot: 5, jobId: 'jArtist', colorId: 'cPink' }],
    logicExplanation: "Theory Scan: Clue 1 limits the Artist to Pos 1 or 6. Clue 2 fixes the Doctor at Pos 1. Since Position 1 is taken, the Artist is forced to Position 6!"
  },
  {
    title: "Blocking Constraint (Theory)",
    instructions: [
      { id: 4, text: "A sits at Position 4 or 5.", elements: { people: ['pA'], jobs: [], colors: [] }, placement: [{ slot: 3, personId: 'pA' }], alts: [{ slot: 4, personId: 'pA' }] },
      { id: 5, text: "The Manager sits at Position 5.", elements: { people: [], jobs: ['jManager'], colors: [] }, placement: [{ slot: 4, jobId: 'jManager' }], alts: null },
      { id: 6, text: "A is a Lawyer.", elements: { people: ['pA'], jobs: ['jLawyer'], colors: [] }, placement: [], alts: null }
    ],
    combinedTarget: [4, 5, 6],
    finalPlacement: [{ slot: 4, jobId: 'jManager' }, { slot: 3, personId: 'pA', jobId: 'jLawyer' }],
    logicExplanation: "Theory Scan: A is at 4 or 5. But Clue 5 fixes the Manager at Pos 5. Since A is a Lawyer (Clue 6), they cannot be the Manager at Pos 5. This forces A into Position 4!"
  }
];

// --- PRACTICE SCENARIOS ---
const PRACTICE_SCENARIOS = [
  {
    title: "The Neighbor Squeeze",
    instructions: [
      { id: 10, text: "B sits at Position 1 or 2.", elements: { people: ['pB'], jobs: [], colors: [] }, placement: [{ slot: 0, personId: 'pB' }], alts: [{ slot: 1, personId: 'pB' }] },
      { id: 11, text: "Position 1 belongs to the Lawyer.", elements: { people: [], jobs: ['jLawyer'], colors: [] }, placement: [{ slot: 0, jobId: 'jLawyer' }], alts: null },
      { id: 12, text: "B is an Engineer.", elements: { people: ['pB'], jobs: ['jEngineer'], colors: [] }, placement: [], alts: null }
    ],
    combinedTarget: [10, 11, 12],
    finalPlacement: [{ slot: 0, jobId: 'jLawyer' }, { slot: 1, personId: 'pB', jobId: 'jEngineer' }],
    logicExplanation: "Correct! Position 1 is locked for the Lawyer. Since B is an Engineer, B cannot occupy Position 1. Therefore, B is forced into Position 2."
  },
  {
    title: "Boundary Squeeze",
    instructions: [
      { id: 20, text: "The Artist sits at an extreme end.", elements: { people: [], jobs: ['jArtist'], colors: [] }, placement: [{ slot: 0, jobId: 'jArtist' }], alts: [{ slot: 5, jobId: 'jArtist' }] },
      { id: 21, text: "Position 6 belongs to a person who likes Red.", elements: { people: [], jobs: [], colors: ['cRed'] }, placement: [{ slot: 5, colorId: 'cRed' }], alts: null },
      { id: 22, text: "The Artist likes Pink color.", elements: { people: [], jobs: ['jArtist'], colors: ['cPink'] }, placement: [], alts: null }
    ],
    combinedTarget: [20, 21, 22],
    finalPlacement: [{ slot: 5, colorId: 'cRed' }, { slot: 0, jobId: 'jArtist', colorId: 'cPink' }],
    logicExplanation: "Perfect! The Artist is at an end. Position 6 is taken by Red. Since the Artist likes Pink, they cannot be at Pos 6. The Artist is forced to Position 1."
  },
  {
    title: "The Proximity Block",
    instructions: [
      { id: 30, text: "A sits next to Position 3 (Pos 2 or 4).", elements: { people: ['pA'], jobs: [], colors: [] }, placement: [{ slot: 1, personId: 'pA' }], alts: [{ slot: 3, personId: 'pA' }] },
      { id: 31, text: "Position 4 is occupied by the Manager.", elements: { people: [], jobs: ['jManager'], colors: [] }, placement: [{ slot: 3, jobId: 'jManager' }], alts: null },
      { id: 32, text: "A is a Lawyer.", elements: { people: ['pA'], jobs: ['jLawyer'], colors: [] }, placement: [], alts: null }
    ],
    combinedTarget: [30, 31, 32],
    finalPlacement: [{ slot: 3, jobId: 'jManager' }, { slot: 1, personId: 'pA', jobId: 'jLawyer' }],
    logicExplanation: "Logic Secured! A has two spots (2 or 4). Clue 31 locks the Manager at Pos 4. This blocks A from Pos 4, leaving only Position 2 for A."
  }
];

export default function LabContent() {
  const navigate = useNavigate();
  const slotRefs = useRef({});
  const [appMode, setAppMode] = useState('concept');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  
  const [placements, setPlacements] = useState(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
  const [selectedClueIds, setSelectedClueIds] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGhosting, setIsGhosting] = useState(false);
  const [ghostCycle, setGhostCycle] = useState(0); 
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);
  const [isLabFinished, setIsLabFinished] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showError, setShowError] = useState(false);
  const [hasPlacedItem, setHasPlacedItem] = useState(false);

  const scenarios = appMode === 'concept' ? THEORY_SCENARIOS : PRACTICE_SCENARIOS;
  const currentScenario = scenarios[scenarioIndex] || scenarios[0];

  // Logic to hide unused slots per scenario
  const needsIdentity = currentScenario.instructions.some(i => i.elements.people.length > 0);
  const needsJob = currentScenario.instructions.some(i => i.elements.jobs.length > 0);
  const needsColor = currentScenario.instructions.some(i => i.elements.colors.length > 0);

  // Helper for grid column management in tray
  const visibleCategoriesCount = [needsIdentity, needsJob, needsColor].filter(Boolean).length;
  const gridColsClass = visibleCategoriesCount === 3 ? 'md:grid-cols-3' : visibleCategoriesCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1';

  const resetAll = useCallback(() => {
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setIsEvaluating(false);
    setSelectedClueIds([]);
    setIsGhosting(false);
    setGhostCycle(0);
    setIsScenarioComplete(false);
    setFeedbackText("");
    setShowError(false);
    setHasPlacedItem(false);
  }, []);

  const handleModeSwitch = (mode) => {
    setAppMode(mode);
    setScenarioIndex(0);
    setIsLabFinished(false);
    resetAll();
  };

  const handleNextScenario = () => {
    if (scenarioIndex < scenarios.length - 1) {
        setScenarioIndex(prev => prev + 1);
        resetAll();
    } else if (appMode === 'concept') {
        return; 
    } else {
        setIsLabFinished(true); 
    }
  };

  useEffect(() => {
    let interval;
    if (isGhosting && selectedClueIds.length > 0) {
        setGhostCycle(1);
        interval = setInterval(() => {
            setGhostCycle(prev => (prev === 3 ? 1 : prev + 1));
        }, 1200);
        return () => clearInterval(interval);
    }
  }, [isGhosting, selectedClueIds]);

  const handleClueSelect = (id) => {
    if (isEvaluating || isScenarioComplete) return;
    setFeedbackText("");
    setShowError(false);
    setSelectedClueIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleTheoryAutoFlow = async () => {
    resetAll();
    setIsEvaluating(true);

    if (scenarioIndex === 0) {
        setFeedbackText("Evaluating: Checking Clue 1 (Artist range)...");
        setSelectedClueIds([1]);
        setIsGhosting(true);
        await new Promise(r => setTimeout(r, 3000));

        setFeedbackText("Scanning: Clue 2 identifies Pos 1 as Doctor...");
        setSelectedClueIds([1, 2]);
        await new Promise(r => setTimeout(r, 2000));

        setFeedbackText("Deduction: Artist forced to Pos 6 because Pink blocks Green (Pos 1)...");
        setSelectedClueIds([1, 2, 3]);
        setIsGhosting(false);
        
        const finalP = Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null }));
        currentScenario.finalPlacement.forEach(p => { finalP[p.slot] = { ...finalP[p.slot], ...p }; });
        setPlacements(finalP);
        setFeedbackText(String(currentScenario.logicExplanation));
        await new Promise(r => setTimeout(r, 5000));
    } else if (scenarioIndex === 1) {
        setFeedbackText("Evaluating: Checking Clue 4 (A range)...");
        setSelectedClueIds([4]);
        setIsGhosting(true);
        await new Promise(r => setTimeout(r, 3000));

        setFeedbackText("Scanning: Clue 5 identifies Pos 5 as Manager...");
        setSelectedClueIds([4, 5]);
        await new Promise(r => setTimeout(r, 2000));

        setFeedbackText("Synthesis: Since A is a Lawyer (Clue 6), A must sit at Pos 4...");
        setSelectedClueIds([4, 5, 6]);
        setIsGhosting(false);
        
        const finalP = Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null }));
        currentScenario.finalPlacement.forEach(p => { finalP[p.slot] = { ...finalP[p.slot], ...p }; });
        setPlacements(finalP);
        setFeedbackText(String(currentScenario.logicExplanation));
        await new Promise(r => setTimeout(r, 5000));
    }

    setIsScenarioComplete(true);
  };

  const handleVerify = () => {
    if (selectedClueIds.length === 0) return;

    if (!hasPlacedItem && appMode === 'practice') {
        setFeedbackText("PLACEMENT REQUIRED! Move the resulting items from the tray into the correct boxes.");
        setShowError(true);
        return;
    }

    setIsEvaluating(true);

    const isCorrectSet = selectedClueIds.length === currentScenario.combinedTarget.length &&
                         selectedClueIds.every(id => currentScenario.combinedTarget.includes(id));

    if (!isCorrectSet) {
        setIsGhosting(true);
        setFeedbackText("INCOMPLETE LOGIC! These clues alone don't fix a single spot. Look for the blocking variable!");
        setShowError(true);
        setTimeout(() => { setIsEvaluating(false); setIsGhosting(false); setShowError(false); }, 4000);
    } else {
        const isCorrectPlacement = currentScenario.finalPlacement.every(item => {
            const s = placements[item.slot];
            return (!item.personId || s.personId === item.personId) && 
                   (!item.jobId || s.jobId === item.jobId) && 
                   (!item.colorId || s.colorId === item.colorId);
        });

        if (!isCorrectPlacement) {
            setFeedbackText("WRONG POSITIONS! You found the combination, but placed the items incorrectly.");
            setShowError(true);
            setTimeout(() => { setIsEvaluating(false); setShowError(false); }, 4000);
        } else {
            setFeedbackText(String(currentScenario.logicExplanation));
            setIsScenarioComplete(true);
            setShowError(false);
        }
    }
  };

  const handleDragEnd = (event, info, id, type) => {
    if (isEvaluating) return;
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
        if (dist < 60 && dist < minDistance) { minDistance = dist; targetIdx = idx; }
    });

    if (targetIdx !== null) {
        setPlacements(prev => {
            const next = [...prev];
            next[targetIdx] = { ...next[targetIdx], [type]: id };
            return next;
        });
        setHasPlacedItem(true);
    }
  };

  const removeItemFromSlot = (idx, type) => {
      if (isEvaluating || isScenarioComplete) return;
      setPlacements(prev => {
          const next = [...prev];
          next[idx] = { ...next[idx], [type]: null };
          return next;
      });
  };

  const renderSlot = (idx) => {
    let data = placements[idx];
    let isGhost = false;

    if (isEvaluating && isGhosting && selectedClueIds.length > 0) {
        const firstClueId = selectedClueIds[0];
        const firstClue = currentScenario.instructions.find(i => i.id === firstClueId);
        if (ghostCycle === 1) data = firstClue?.placement?.find(p => p.slot === idx) || { personId: null };
        else if (ghostCycle === 3) { data = firstClue?.alts?.find(p => p.slot === idx) || { personId: null }; isGhost = true; }
        else data = { personId: null };
    }
    const person = data?.personId ? PEOPLE_DATA[data.personId] : null;
    const job = data?.jobId ? JOB_DATA[data.jobId] : null;
    const color = data?.colorId ? COLOR_DATA[data.colorId] : null;

    return (
      <div key={idx} ref={el => slotRefs.current[`slot-${idx}`] = el} className={`relative flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-2xl border-2 transition-all bg-black/20 border-white/5 min-w-[115px] sm:min-w-[155px]`}>
        <span className="text-[7px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Pos {idx + 1}</span>
        
        {needsIdentity && (
            <div onClick={() => removeItemFromSlot(idx, 'personId')} className={`relative group w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${person ? `bg-gradient-to-br ${person.color} border-white shadow-xl cursor-pointer` : 'border-dashed border-white/10'}`}>
               {!person && <User size={16} className="text-white/10" />}
               {person && <span className={`text-white font-black text-lg sm:text-xl ${isGhost ? 'opacity-40' : ''}`}>{person.initial}</span>}
               {person && !isEvaluating && !isScenarioComplete && (
                   <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={16} className="text-white" /></div>
               )}
            </div>
        )}

        {needsJob && (
            <div onClick={() => removeItemFromSlot(idx, 'jobId')} className={`relative group w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${job ? `bg-amber-600/30 border-amber-400 shadow-md cursor-pointer` : 'border-dashed border-white/5'}`}
            >
               {!job && <Briefcase size={14} className="text-white/10" />}
               {job && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(job.initial)}</span>}
               {job && !isEvaluating && !isScenarioComplete && (
                   <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={14} className="text-white" /></div>
               )}
            </div>
        )}

        {needsColor && (
            <div onClick={() => removeItemFromSlot(idx, 'colorId')} className={`relative group w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${color ? `${color.bg} border-white cursor-pointer` : 'border-dashed border-white/5'}`}
            >
               {!color && <Palette size={14} className="text-white/10" />}
               {color && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(color.initial)}</span>}
               {color && !isEvaluating && !isScenarioComplete && (
                   <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={14} className="text-white" /></div>
               )}
            </div>
        )}
        {isGhost && <div className="absolute -bottom-6 flex flex-col items-center"><ArrowLeftRight size={10} className="text-cyan-400 animate-pulse" /><span className="text-[6px] font-black text-cyan-400 uppercase whitespace-nowrap">Moving</span></div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20 px-2 sm:px-0">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-4 sm:pt-6 relative z-20">
        <div className="w-full bg-[#2a1a16] p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border-b-4 sm:border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 text-white">
          <div className="flex flex-col items-center lg:items-start text-center">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[8px] sm:text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white text-lg sm:text-xl font-black uppercase tracking-tighter text-[#e6dccb]">Combine multiple instructions to find anchor</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full lg:w-auto overflow-hidden shadow-inner">
            <button onClick={() => handleModeSwitch('concept')} className={`flex-1 lg:flex-none px-4 sm:px-8 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Theory</button>
            <button onClick={() => handleModeSwitch('practice')} className={`flex-1 lg:flex-none px-4 sm:px-8 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
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
                        <span className="text-yellow-400 font-black uppercase text-xs tracking-widest">Mastery Objective</span>
                     </div>
                     <p className="text-white text-lg sm:text-2xl font-black uppercase leading-none text-center sm:text-left">
                         {appMode === 'concept' ? 'Study Strategy Synthesis' : 'Identify & Place the Combination'}
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     {appMode === 'concept' && !isEvaluating && <button onClick={handleTheoryAutoFlow} className="bg-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 shadow-xl flex items-center gap-2 border-b-4 border-cyan-800"><Play size={18} fill="currentColor" /> Run Auto Demo</button>}
                     <button onClick={resetAll} className="bg-black/40 text-white p-3 sm:p-4 rounded-full hover:bg-black/60 transition-all border border-white/10"><RotateCcw size={16} /></button>
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 mb-10">
                  {currentScenario.instructions.map((clue) => {
                      const isSelected = selectedClueIds.includes(clue.id);
                      return (
                        <button key={clue.id} onClick={() => handleClueSelect(clue.id)} disabled={isEvaluating || isScenarioComplete} className={`group relative flex items-start text-left gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${isSelected ? 'bg-white/10 border-yellow-400 scale-[1.01] shadow-xl' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
                            <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-white/20'}`}>
                                {isSelected ? <MousePointer2 size={12} className="text-black" /> : <span className="text-[10px] font-black text-white/20">?</span>}
                            </div>
                            <p className={`text-sm sm:text-xl font-bold tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-white/60'}`}>{String(clue.text)}</p>
                        </button>
                      );
                  })}
               </div>

               <AnimatePresence>
                   {selectedClueIds.length > 0 && !isEvaluating && !isScenarioComplete && hasPlacedItem && appMode === 'practice' && ( 
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                           <button onClick={handleVerify} className="bg-green-600 text-white px-12 py-4 rounded-xl sm:rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-800 flex items-center gap-2"><Zap size={16} fill="currentColor"/> Submit Deduction</button>
                       </motion.div>
                   )}
               </AnimatePresence>

               {/* Verdict Section */}
               <AnimatePresence>
                  {isEvaluating && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border-l-8 shadow-2xl ${showError ? 'bg-rose-900/40 border-rose-500 shadow-rose-500/10' : 'bg-cyan-900/40 border-cyan-500 shadow-cyan-500/10'}`}>
                          <div className="flex items-center gap-3 mb-4">{showError ? <XCircle className="text-rose-400" /> : <CheckCircle2 className="text-cyan-400" />}<h4 className="text-white font-black uppercase text-[10px] sm:text-xs tracking-widest">{showError ? "Selection Error" : "Strategic Analysis"}</h4></div>
                          <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-6"><p className="text-white italic font-bold text-sm sm:text-lg leading-relaxed text-center sm:text-left">{String(feedbackText)}</p></div>
                          <div className="flex flex-col sm:flex-row gap-4">
                              <button onClick={() => { setIsEvaluating(false); if(showError) { setSelectedClueIds([]); setFeedbackText(""); setIsGhosting(false); setShowError(false); } }} className="bg-black/40 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] hover:bg-black/60 transition-all flex items-center justify-center gap-2 border border-white/10"><RefreshCcw size={14} /> Try Again</button>
                              {isScenarioComplete && (
                                  scenarioIndex === scenarios.length - 1 && appMode === 'concept' ? 
                                  <button onClick={() => handleModeSwitch('practice')} className="flex-1 bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:scale-105 shadow-xl">Go to Practice <Target size={14} /></button> :
                                  <button onClick={handleNextScenario} className="flex-1 bg-white text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:scale-105 shadow-xl">Next Case <ArrowRight size={14} /></button>
                              )}
                          </div>
                      </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="w-full overflow-x-auto no-scrollbar pb-10 px-4">
              <div className="flex justify-start sm:justify-center gap-3 sm:gap-6 min-w-max mx-auto">
                 {Array(6).fill(0).map((_, i) => renderSlot(i))}
              </div>
            </div>

            <AnimatePresence>
                {selectedClueIds.length > 0 && !isEvaluating && !isScenarioComplete && appMode === 'practice' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center gap-6 mt-4 px-2">
                        <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 w-full max-w-5xl shadow-2xl relative">
                            <span className="absolute -top-3 left-6 sm:left-8 bg-black px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10 flex items-center gap-2"><Palette size={12}/> Variable Tray</span>
                            <div className={`grid grid-cols-1 ${gridColsClass} gap-6 sm:gap-8 mb-8`}>
                                {needsIdentity && (
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><User size={12}/> People</span>
                                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                            {[...new Set(selectedClueIds.flatMap(id => currentScenario.instructions.find(i => i.id === id)?.elements.people || []))].map(id => (
                                                <motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'personId')} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} cursor-grab shadow-xl`}><span className="text-white font-black">{String(PEOPLE_DATA[id].initial)}</span></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {needsJob && (
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><Briefcase size={12}/> Jobs</span>
                                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                            {[...new Set(selectedClueIds.flatMap(id => currentScenario.instructions.find(i => i.id === id)?.elements.jobs || []))].map(id => (
                                                <motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'jobId')} className="w-12 h-12 rounded-xl border-2 border-amber-400/30 flex items-center justify-center bg-amber-900/40 cursor-grab shadow-xl text-[10px]"><span className="text-white font-black uppercase">{String(JOB_DATA[id].initial)}</span></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {needsColor && (
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><Palette size={12}/> Colors</span>
                                        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                            {[...new Set(selectedClueIds.flatMap(id => currentScenario.instructions.find(i => i.id === id)?.elements.colors || []))].map(id => (
                                                <motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'colorId')} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white/20 flex items-center justify-center ${COLOR_DATA[id].bg} cursor-grab shadow-xl text-[10px]`}><span className="text-white font-black uppercase">{String(COLOR_DATA[id].initial)}</span></motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      <AnimatePresence>{isLabFinished && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"><div className="bg-[#e6dccb] w-full max-w-2xl p-10 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden"><div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /><div className="relative z-10 flex flex-col items-center"><div className="w-28 h-28 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 border-4 border-white shadow-xl"><Trophy size={72} className="animate-bounce" /></div><h1 className="text-4xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter text-shadow-sm text-center">Mastery Achieved!</h1><p className="text-[#3e2723] text-lg font-bold mb-12 text-center px-4">"You have successfully mastered the logic of synthesis: combining multiple constraints to build structural certainty!"</p><button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/ActualWorldIntro')} className="bg-[#3e2723] text-[#e6dccb] px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:scale-95 transition-all">Next Module</button></div></div></motion.div>)}</AnimatePresence>
      <div className="mt-8 flex flex-col items-center text-center opacity-40 px-4"><GraduationCap size={48} className="text-[#3e2723] mb-2" /><h3 className="text-[#3e2723] font-black uppercase text-xs">Analytical Foundation Lab</h3><p className="text-[#3e2723] text-[9px] font-bold max-w-xs leading-relaxed italic text-center text-shadow-sm">"Building from fixed truth creates logical certainty."</p></div>
    </div>
  );
}