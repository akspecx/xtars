import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
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
    title: "Building the Chain",
    instructions: [
      { 
        id: 0,
        text: "The Artist sits at the 2nd position.", 
        isAnchor: true, 
        isLeading: false,
        elements: { people: [], jobs: ['jArtist'], colors: [] },
        placement: [{ slot: 1, jobId: 'jArtist' }],
        reason: "Anchor found: Position 2 is locked to the Artist independently.",
        theoryNote: "Choosing Anchor: Position 2 is now fixed to the Artist. This is our foundation." 
      },
      { 
        id: 1,
        text: "A sits 3rd to the right of the Artist.", 
        isAnchor: false, 
        isLeading: true,
        elements: { people: ['pA'], jobs: ['jArtist'], colors: [] },
        placement: [{ slot: 4, personId: 'pA' }],
        reason: "Leading Link: Since the Artist is at Position 2, A must be at Position 5.",
        theoryNote: "Next Step: We pick this clue because it mentions the variable we just anchored (Artist)." 
      },
      { 
        id: 2,
        text: "A likes Blue color.", 
        isAnchor: false, 
        isLeading: false,
        elements: { people: ['pA'], jobs: [], colors: ['cBlue'] },
        placement: [{ slot: 4, colorId: 'cBlue' }],
        reason: "Follow-up Link: Now that A is fixed, Blue color is assigned to Position 5.",
        theoryNote: "Chain Complete: We've traced the logic from the Anchor to the final link." 
      }
    ]
  },
  {
    title: "The Professional Link",
    instructions: [
      { 
        id: 0,
        text: "B sits next to the Manager.", 
        isAnchor: false, 
        isLeading: true,
        elements: { people: ['pB'], jobs: ['jManager'], colors: [] },
        placement: [{ slot: 4, personId: 'pB' }, { slot: 5, jobId: 'jManager' }],
        alts: [{ slot: 3, personId: 'pB' }, { slot: 4, jobId: 'jManager' }],
        reason: "Requires the Manager anchor to be fixed first to find the spot.",
        theoryNote: "Link Picked: We select this next because it connects B to our newly fixed Manager."
      },
      { 
        id: 1,
        text: "The Manager is at the 6th position.", 
        isAnchor: true, 
        isLeading: false,
        elements: { people: [], jobs: ['jManager'], colors: [] },
        placement: [{ slot: 5, jobId: 'jManager' }],
        reason: "Fixed Anchor: Position 6 belongs strictly to the Manager.",
        theoryNote: "Start Point: We identify Position 6 as the fixed coordinate."
      },
      { 
        id: 2,
        text: "B is an Engineer.", 
        isAnchor: false, 
        isLeading: false,
        elements: { people: ['pB'], jobs: ['jEngineer'], colors: [] },
        placement: [{ slot: 4, jobId: 'jEngineer' }],
        reason: "Final Link: Identifies the job for student B.",
        theoryNote: "Final Step: Tracing B to Position 5 allows us to assign the Engineer job."
      }
    ]
  }
];

export default function LabContent() {
  const navigate = useNavigate();
  const slotRefs = useRef({});
  const [appMode, setAppMode] = useState('concept');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  
  const [placements, setPlacements] = useState(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
  const [selectedClueIdx, setSelectedClueIdx] = useState(null);
  const [usedClueIds, setUsedClueIds] = useState([]); 
  const [currentGoal, setCurrentGoal] = useState('find_anchor'); 
  
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isGhosting, setIsGhosting] = useState(false);
  const [ghostCycle, setGhostCycle] = useState(0); 
  const [isScenarioComplete, setIsScenarioComplete] = useState(false);
  const [isLabFinished, setIsLabFinished] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [showError, setShowError] = useState(false);

  // New state to track if user has interacted with the board for the currently selected clue
  const [hasPlacedItemForCurrentClue, setHasPlacedItemForCurrentClue] = useState(false);

  const currentScenario = SCENARIOS[scenarioIndex];
  const activeClue = selectedClueIdx !== null ? currentScenario.instructions[selectedClueIdx] : null;

  const resetAll = useCallback(() => {
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setIsEvaluating(false);
    setSelectedClueIdx(null);
    setUsedClueIds([]);
    setCurrentGoal('find_anchor');
    setIsGhosting(false);
    setGhostCycle(0);
    setIsScenarioComplete(false);
    setFeedbackText("");
    setShowError(false);
    setHasPlacedItemForCurrentClue(false);
  }, []);

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
    } else if (appMode === 'concept') {
        return;
    } else {
        setIsLabFinished(true); 
    }
  };

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

  const handleClueSelect = (idx) => {
    if (isEvaluating || usedClueIds.includes(currentScenario.instructions[idx].id) || appMode === 'concept') return;
    setSelectedClueIdx(idx);
    setFeedbackText("");
    setShowError(false);
    setHasPlacedItemForCurrentClue(false); // Reset interaction flag on new selection
    
    const clue = currentScenario.instructions[idx];
    
    if (currentGoal === 'find_anchor') {
        if (!clue.isAnchor) {
            setIsEvaluating(true);
            setIsGhosting(true);
            setFeedbackText("NOT AN ANCHOR! This instruction is relative and doesn't fix a spot independently.");
            setShowError(true);
            setTimeout(() => { setIsGhosting(false); setIsEvaluating(false); setSelectedClueIdx(null); setShowError(false); }, 5000);
        } else {
            setFeedbackText("CORRECT! Now: Place elements from the tray into the correct box positions.");
            setCurrentGoal('place_items');
        }
    } else if (currentGoal === 'find_leading') {
        if (!clue.isLeading) {
            setIsEvaluating(true);
            setFeedbackText("INCORRECT LINK! This clue doesn't lead from your anchor. Find the clue that mentions your anchored item.");
            setShowError(true);
            setTimeout(() => { setIsEvaluating(false); setSelectedClueIdx(null); setShowError(false); }, 4000);
        } else {
            setFeedbackText("CORRECT LINK! Now: Place these elements to extend your logic chain.");
            setCurrentGoal('place_leading');
        }
    }
  };

  const handleTheoryAutoFlow = async () => {
    resetAll();
    setIsEvaluating(true);

    const anchorIdx = currentScenario.instructions.findIndex(i => i.isAnchor);
    setSelectedClueIdx(anchorIdx);
    setFeedbackText("Evaluating Clues: Identifying Anchor...");
    await new Promise(r => setTimeout(r, 1500));
    setFeedbackText(String(currentScenario.instructions[anchorIdx].theoryNote));
    
    const s1P = Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null }));
    currentScenario.instructions[anchorIdx].placement.forEach(p => { s1P[p.slot] = { ...s1P[p.slot], ...p }; });
    setPlacements(s1P);
    await new Promise(r => setTimeout(r, 4000));

    const leadingIdx = currentScenario.instructions.findIndex(i => i.isLeading);
    setSelectedClueIdx(leadingIdx);
    setFeedbackText("Moving Chain: Selecting Next Instruction...");
    await new Promise(r => setTimeout(r, 1500));
    setFeedbackText(String(currentScenario.instructions[leadingIdx].theoryNote));
    
    const s2P = [...s1P];
    currentScenario.instructions[leadingIdx].placement.forEach(p => { s2P[p.slot] = { ...s2P[p.slot], ...p }; });
    setPlacements(s2P);
    await new Promise(r => setTimeout(r, 4000));

    setIsScenarioComplete(true);
  };

  const handlePracticeSubmit = () => {
    if (!activeClue) return;
    setIsEvaluating(true);
    const isCorrect = activeClue.placement.every(item => {
        const s = placements[item.slot];
        return (!item.personId || s.personId === item.personId) && (!item.jobId || s.jobId === item.jobId) && (!item.colorId || s.colorId === item.colorId);
    });

    if (!isCorrect) {
        setFeedbackText("WRONG SPOT! The clue is right, but the position is wrong. Check the counting carefully.");
        setShowError(true);
        setTimeout(() => { setIsEvaluating(false); setShowError(false); }, 4000);
    } else {
        setUsedClueIds(prev => [...prev, activeClue.id]);
        if (currentGoal === 'place_items' || currentGoal === 'find_anchor') {
            setFeedbackText("ANCHOR SECURED! Logic stabilized. Now: What instruction you will pick next?");
            setCurrentGoal('find_leading');
            setSelectedClueIdx(null);
            setIsEvaluating(false);
            setHasPlacedItemForCurrentClue(false);
        } else {
            setFeedbackText("CHAIN LINK SECURED! Well done. You've completed this logical flow.");
            setIsScenarioComplete(true);
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
        setHasPlacedItemForCurrentClue(true); // User interacted with board
    }
  };

  const renderSlot = (idx) => {
    let data = placements[idx];
    let isGhost = false;
    if (isEvaluating && isGhosting && activeClue) {
        if (ghostCycle === 1) data = activeClue.placement.find(p => p.slot === idx) || { personId: null };
        else if (ghostCycle === 3) { data = activeClue.alts.find(p => p.slot === idx) || { personId: null }; isGhost = true; }
        else data = { personId: null };
    }
    const person = data?.personId ? PEOPLE_DATA[data.personId] : null;
    const job = data?.jobId ? JOB_DATA[data.jobId] : null;
    const color = data?.colorId ? COLOR_DATA[data.colorId] : null;

    return (
      <div key={idx} ref={el => slotRefs.current[`slot-${idx}`] = el} className={`relative flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-2xl border-2 transition-all bg-black/20 border-white/5 min-w-[100px] sm:min-w-[140px]`}>
        <span className="text-[7px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Pos {idx + 1}</span>
        <div className={`relative w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${person ? `bg-gradient-to-br ${person.color} border-white shadow-xl` : 'border-dashed border-white/10'}`}>
           {!person && <User size={16} className="text-white/10" />}
           {person && <span className={`text-white font-black text-lg sm:text-xl ${isGhost ? 'opacity-40' : ''}`}>{String(person.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><User size={8} className="text-white/40" /></div>
        </div>
        <div className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${job ? `bg-amber-600/30 border-amber-400 shadow-md` : 'border-dashed border-white/5'}`}>
           {!job && <Briefcase size={14} className="text-white/10" />}
           {job && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(job.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><Briefcase size={8} className="text-white/40" /></div>
        </div>
        <div className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center transition-all ${color ? `${color.bg} border-white` : 'border-dashed border-white/5'}`}>
           {!color && <Palette size={14} className="text-white/10" />}
           {color && <span className={`text-[9px] sm:text-[10px] font-black text-white uppercase ${isGhost ? 'opacity-40' : ''}`}>{String(color.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10"><Palette size={8} className="text-white/40" /></div>
        </div>
        {isGhost && <div className="absolute -bottom-6 flex flex-col items-center"><ArrowLeftRight size={10} className="text-cyan-400 animate-pulse" /><span className="text-[6px] font-black text-cyan-400 uppercase whitespace-nowrap">Shifting</span></div>}
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
            <h1 className="text-white text-lg sm:text-xl font-black uppercase tracking-tighter text-[#e6dccb]">What instruction to pick after anchor?</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full lg:w-auto overflow-hidden">
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
                        <span className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs tracking-widest">Logic Scan</span>
                     </div>
                     <p className="text-white text-lg sm:text-3xl font-black uppercase leading-none text-center sm:text-left">
                         {appMode === 'concept' ? 'Guided Logic Build' : (currentGoal === 'find_anchor' ? 'What is your anchor?' : (currentGoal === 'place_items' ? 'Place Anchor Elements' : (currentGoal === 'find_leading' ? 'What instruction you pick next?' : 'Place leading elements')))}
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     {appMode === 'concept' && !isEvaluating && <button onClick={handleTheoryAutoFlow} className="bg-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 shadow-xl flex items-center gap-2 border-b-4 border-cyan-800"><Play size={18} fill="currentColor" /> Run Demo</button>}
                     <button onClick={resetAll} className="bg-black/40 text-white p-3 sm:p-4 rounded-full hover:bg-black/60 border border-white/10"><RotateCcw size={16} /></button>
                  </div>
               </div>
               
               <div className="flex flex-col gap-3 mb-10">
                  {currentScenario.instructions.map((clue, idx) => {
                      const isUsed = usedClueIds.includes(clue.id);
                      return (
                        <button key={idx} onClick={() => handleClueSelect(idx)} disabled={isEvaluating || isUsed} className={`group relative flex items-start text-left gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all ${isUsed ? 'bg-green-900/20 border-green-500/30 opacity-50 cursor-not-allowed' : selectedClueIdx === idx ? 'bg-white/10 border-yellow-400 scale-[1.01] shadow-xl' : 'bg-transparent border-white/5 hover:border-white/20'}`}>
                            <div className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${isUsed ? 'bg-green-500 border-green-500' : selectedClueIdx === idx ? 'bg-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'border-white/20'}`}>
                                {isUsed ? <Check size={12} className="text-white" /> : selectedClueIdx === idx ? <MousePointer2 size={12} className="text-black" /> : <span className="text-[10px] font-black text-white/20">{idx + 1}</span>}
                            </div>
                            <p className={`text-sm sm:text-xl font-bold tracking-tight leading-tight ${isUsed ? 'text-green-200/40' : selectedClueIdx === idx ? 'text-white' : 'text-white/60'}`}>{String(clue.text)}</p>
                        </button>
                      );
                  })}
               </div>

               <AnimatePresence>
                   {appMode === 'practice' && 
                    (currentGoal === 'place_items' || currentGoal === 'place_leading') && 
                    !isEvaluating && 
                    hasPlacedItemForCurrentClue && ( // Only show submit if user has placed something SINCE selecting this clue
                       <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                           <button onClick={handlePracticeSubmit} className="bg-green-600 text-white px-12 py-4 rounded-xl sm:rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-800 flex items-center gap-2"><Zap size={16} fill="currentColor"/> Submit Placement</button>
                       </motion.div>
                   )}
               </AnimatePresence>

               <AnimatePresence>
                  {isEvaluating && activeClue && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`mt-6 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border-l-8 shadow-2xl ${showError ? 'bg-rose-900/40 border-rose-500 shadow-rose-500/10' : 'bg-cyan-900/40 border-cyan-500 shadow-cyan-500/10'}`}>
                          <div className="flex items-center gap-3 mb-4">{showError ? <XCircle className="text-rose-400" /> : <CheckCircle2 className="text-cyan-400" />}<h4 className="text-white font-black uppercase text-[10px] sm:text-xs tracking-widest">{showError ? "Error detected" : "Analysis Verdict"}</h4></div>
                          <div className="bg-black/40 p-4 rounded-xl border border-white/5 mb-6"><p className="text-white italic font-bold text-sm sm:text-lg leading-relaxed">{String(feedbackText || activeClue.theoryNote || activeClue.reason)}</p></div>
                          <div className="flex flex-col sm:flex-row gap-4">
                              <button onClick={() => { setIsEvaluating(false); if(showError) { setSelectedClueIdx(null); setFeedbackText(""); setIsGhosting(false); setShowError(false); } }} className="bg-black/40 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] hover:bg-black/60 border border-white/10"><RefreshCcw size={14} /> Retry Selection</button>
                              {isScenarioComplete && (
                                  scenarioIndex === SCENARIOS.length - 1 && appMode === 'concept' ? 
                                  <button onClick={() => handleModeSwitch('practice')} className="flex-1 bg-yellow-400 text-black px-8 py-3 rounded-full font-black uppercase text-[10px] hover:scale-105 shadow-xl">Go to Practice Mode <Target size={14} /></button> :
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
                {selectedClueIdx !== null && appMode === 'practice' && !isEvaluating && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center gap-6 mt-4 px-2">
                        <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 w-full max-w-5xl shadow-2xl relative">
                            <span className="absolute -top-3 left-6 sm:left-8 bg-black px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10 flex items-center gap-2"><Palette size={12}/> Interaction Tray</span>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
                                <div className="flex flex-col items-center gap-3"><span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><User size={12}/> People</span><div className="flex flex-wrap justify-center gap-2 sm:gap-3">{activeClue?.elements.people.map(id => (<motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'personId')} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} cursor-grab shadow-xl`}><span className="text-white font-black">{String(PEOPLE_DATA[id].initial)}</span></motion.div>))}</div></div>
                                <div className="flex flex-col items-center gap-3"><span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><Briefcase size={12}/> Jobs</span><div className="flex flex-wrap justify-center gap-2 sm:gap-3">{activeClue?.elements.jobs.map(id => (<motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'jobId')} className="w-12 h-12 rounded-xl border-2 border-amber-400/30 flex items-center justify-center bg-amber-900/40 cursor-grab shadow-xl text-[10px]"><span className="text-white font-black uppercase">{String(JOB_DATA[id].initial)}</span></motion.div>))}</div></div>
                                <div className="flex flex-col items-center gap-3"><span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase flex items-center gap-1.5"><Palette size={12}/> Colors</span><div className="flex flex-wrap justify-center gap-2 sm:gap-3">{activeClue?.elements.colors.map(id => (<motion.div key={id} drag={!isEvaluating} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'colorId')} className={`w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center ${COLOR_DATA[id].bg} cursor-grab shadow-xl text-[10px]`}><span className="text-white font-black uppercase">{String(COLOR_DATA[id].initial)}</span></motion.div>))}</div></div>
                            </div>
                            <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-2xl flex items-start gap-4 shadow-inner">
                                <div className="bg-amber-400 p-2 rounded-lg text-black shrink-0"><Info size={16} /></div>
                                <div><h4 className="text-amber-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest mb-1">Instruction Context</h4><p className="text-white/70 text-[10px] sm:text-[12px] font-bold leading-relaxed">Place the required items from the tray above into their <span className="text-amber-400 underline decoration-amber-500">Fixed Positions</span> on the board to lock the logic chain.</p></div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

          </div>
        </div>
      </div>

      <AnimatePresence>{isLabFinished && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"><div className="bg-[#e6dccb] w-full max-w-2xl p-10 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden"><div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /><div className="relative z-10 flex flex-col items-center"><div className="w-28 h-28 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 border-4 border-white shadow-xl"><Trophy size={72} className="animate-bounce" /></div><h1 className="text-4xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter">Chain Mastered!</h1><p className="text-[#3e2723] text-lg font-bold mb-12">"You have mastered the hierarchy of logic: starting with absolute truth and building outward through leading links!"</p><button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/MultipleInstructionCreateAnchor')} className="bg-[#3e2723] text-[#e6dccb] px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:scale-95 transition-all">Next Module</button></div></div></motion.div>)}</AnimatePresence>
      <div className="mt-8 flex flex-col items-center text-center opacity-40 px-4"><GraduationCap size={48} className="text-[#3e2723] mb-2" /><h3 className="text-[#3e2723] font-black uppercase text-xs">Analytical Foundation Lab</h3><p className="text-[#3e2723] text-[9px] font-bold max-w-xs leading-relaxed italic text-center">"Identifying the anchor is logic. Finding the leading link is strategy."</p></div>
    </div>
  );
}