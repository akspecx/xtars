import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  Trash2,
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
  RefreshCcw
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
  pF: { initial: 'F', color: 'from-pink-400 to-pink-600' },
};

const JOB_DATA = {
  jDoctor: { initial: 'Dr', name: 'Doctor' },
  jLawyer: { initial: 'La', name: 'Lawyer' },
  jArtist: { initial: 'Ar', name: 'Artist' },
  jEngineer: { initial: 'En', name: 'Engineer' },
  jManager: { initial: 'Ma', name: 'Manager' },
  jTeacher: { initial: 'Te', name: 'Teacher' },
};

const COLOR_DATA = {
  cRed: { initial: 'Re', bg: 'bg-red-600' },
  cBlue: { initial: 'Bl', bg: 'bg-blue-600' },
  cGreen: { initial: 'Gr', bg: 'bg-green-600' },
  cPink: { initial: 'Pi', bg: 'bg-pink-400' },
  cYellow: { initial: 'Ye', bg: 'bg-yellow-400' },
  cViolet: { initial: 'Vi', bg: 'bg-violet-600' },
};

const SAMPLES = [
  {
    text: "The Lawyer sits at the 2nd position.",
    isAnchor: true,
    reason: "Correct! This is an anchor. It defines exactly ONE fixed spot for the Lawyer.",
    elements: { people: [], jobs: ['jLawyer'], colors: [] },
    demoSet1: [{ slot: 1, jobId: 'jLawyer' }],
    demoSet2: null 
  },
  {
    text: "A sits at the 5th position.",
    isAnchor: true,
    reason: "Yes! Position 5 is explicitly reserved for A.",
    elements: { people: ['pA'], jobs: [], colors: [] },
    demoSet1: [{ slot: 4, personId: 'pA' }],
    demoSet2: null
  },
  {
    text: "B sits next to the person who likes Green.",
    isAnchor: false,
    reason: "No. This is relative information. They could be in various spots (1-2, 2-3, etc.), so it's not an anchor.",
    elements: { people: ['pB'], jobs: [], colors: ['cGreen'] },
    demoSet1: [{ slot: 2, personId: 'pB' }, { slot: 3, colorId: 'cGreen' }],
    demoSet2: [{ slot: 0, personId: 'pB' }, { slot: 1, colorId: 'cGreen' }]
  },
  {
    text: "C sits between the Manager and the person who likes Red.",
    isAnchor: false,
    reason: "No. 'Between' allows for multiple valid configurations across the row.",
    elements: { people: ['pC'], jobs: ['jManager'], colors: ['cRed'] },
    demoSet1: [{ slot: 1, jobId: 'jManager' }, { slot: 2, personId: 'pC' }, { slot: 3, colorId: 'cRed' }],
    demoSet2: [{ slot: 3, jobId: 'jManager' }, { slot: 4, personId: 'pC' }, { slot: 5, colorId: 'cRed' }]
  }
];

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const slotRefs = useRef({});
  const [appMode, setAppMode] = useState('concept');
  const [stepIndex, setStepIndex] = useState(0);
  
  const [placements, setPlacements] = useState(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isVerdictVisible, setIsVerdictVisible] = useState(false);
  const [isMasteryVisible, setIsMasteryVisible] = useState(false);

  const [userDecision, setUserDecision] = useState(null); 
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0); 

  const currentClue = SAMPLES[stepIndex];
  const isAtLastSample = stepIndex === SAMPLES.length - 1;

  // Track if board has anything placed
  const hasPlacedRequiredElements = placements.some(p => p.personId !== null || p.jobId !== null || p.colorId !== null);

  // Determine if categories are needed for dynamic slots and tray
  const needsPeople = currentClue.elements.people.length > 0;
  const needsJobs = currentClue.elements.jobs.length > 0;
  const needsColors = currentClue.elements.colors.length > 0;

  const resetBoard = useCallback(() => {
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setIsEvaluating(false);
    setIsVerdictVisible(false);
    setCycleIndex(0);
    setUserDecision(null);
    setShowDecisionButtons(false);
  }, []);

  const handleRestart = () => {
    setStepIndex(0);
    setAppMode('concept');
    setIsMasteryVisible(false);
    resetBoard();
  };

  const switchMode = (mode) => {
    setAppMode(mode);
    setStepIndex(0);
    resetBoard();
  };

  useEffect(() => {
    let interval;
    if (isEvaluating && !currentClue.isAnchor) {
        setCycleIndex(1);
        interval = setInterval(() => {
            setCycleIndex(prev => (prev + 1) % 4);
        }, 1200);
        const timer = setTimeout(() => setIsVerdictVisible(true), 4000);
        return () => { clearInterval(interval); clearTimeout(timer); };
    } else if (isEvaluating) {
        setCycleIndex(1);
        setIsVerdictVisible(true);
    }
  }, [isEvaluating, currentClue]);

  const handleNextStep = () => {
    if (stepIndex < SAMPLES.length - 1) {
      setStepIndex(p => p + 1);
      resetBoard();
    } else if (appMode === 'practice') {
      setIsMasteryVisible(true);
    }
  };

  const handleTheoryStart = () => {
    setIsEvaluating(true);
  };

  const handlePracticeEvaluate = () => {
    setShowDecisionButtons(true);
  };

  const handleUserDecision = (decision) => {
    setUserDecision(decision);
    setShowDecisionButtons(false);
    setIsEvaluating(true);
  };

  const removeItem = (slotIdx, type) => {
    if (isEvaluating || showDecisionButtons) return;
    setPlacements(prev => {
        const next = [...prev];
        next[slotIdx] = { ...next[slotIdx], [type]: null };
        return next;
    });
  };

  const handleDragEnd = (event, info, id, type) => {
    if (appMode !== 'practice' || isEvaluating || showDecisionButtons) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let minDistance = 1000;
    let targetIdx = null;

    // Use hit-test based on column distance for better mobile/vertical accuracy
    Array(6).fill(0).forEach((_, idx) => {
        const ref = slotRefs.current[`slot-${idx}`];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        
        // Horizontal distance is more important for identifying the position
        const dx = dropPoint.x - centerX;
        const dy = dropPoint.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100 && dist < minDistance) {
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

    if (isEvaluating) {
        if (currentClue.isAnchor) {
            const item = currentClue.demoSet1.find(d => d.slot === idx);
            if (item) data = item;
        } else {
            if (cycleIndex === 1) {
                const item = currentClue.demoSet1.find(d => d.slot === idx);
                data = item || { personId: null, jobId: null, colorId: null };
            } else if (cycleIndex === 3) {
                const item = currentClue.demoSet2.find(d => d.slot === idx);
                data = item || { personId: null, jobId: null, colorId: null };
                isGhost = true;
            } else {
                data = { personId: null, jobId: null, colorId: null };
            }
        }
    }

    const person = data?.personId ? PEOPLE_DATA[data.personId] : null;
    const job = data?.jobId ? JOB_DATA[data.jobId] : null;
    const colorAttr = data?.colorId ? COLOR_DATA[data.colorId] : null;

    return (
      <div 
        key={idx}
        ref={el => slotRefs.current[`slot-${idx}`] = el}
        className={`relative flex flex-col items-center gap-2 sm:gap-4 p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all border-2 bg-black/20 border-white/5 overflow-visible min-w-[100px] sm:min-w-[130px]`}
      >
        <span className="text-[8px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest text-center">Pos {idx + 1}</span>
        
        {/* Identity Slot */}
        {needsPeople && (
            <div 
                onClick={() => removeItem(idx, 'personId')}
                className={`relative group w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${person ? `bg-gradient-to-br ${person.color} border-white shadow-lg cursor-pointer hover:scale-105` : 'border-dashed border-white/10'}`}>
               {!person && <User size={16} className="text-white/10" />}
               {person && <span className="text-white font-black text-lg sm:text-xl">{person.initial}</span>}
               {person && <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/40 rounded-full transition-colors flex items-center justify-center"><Trash2 className="text-white opacity-0 group-hover:opacity-100" size={16} /></div>}
            </div>
        )}

        {/* Job Slot */}
        {needsJobs && (
            <div 
                onClick={() => removeItem(idx, 'jobId')}
                className={`relative group w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all ${job ? `bg-amber-600/30 border-amber-400 shadow-md cursor-pointer hover:scale-105` : 'border-dashed border-white/5'}`}>
               {!job && <Briefcase size={14} className="text-white/10" />}
               {job && <span className={`text-[9px] sm:text-[11px] font-black text-white uppercase`}>{String(job.initial)}</span>}
               {job && <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/40 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center"><Trash2 className="text-white opacity-0 group-hover:opacity-100" size={14} /></div>}
            </div>
        )}

        {/* Color Slot */}
        {needsColors && (
            <div 
                onClick={() => removeItem(idx, 'colorId')}
                className={`relative group w-9 h-9 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all ${colorAttr ? `${colorAttr.bg} border-white shadow-md cursor-pointer hover:scale-105` : 'border-dashed border-white/5'}`}>
               {!colorAttr && <Palette size={14} className="text-white/10" />}
               {colorAttr && <span className={`text-[9px] sm:text-[11px] font-black text-white uppercase`}>{String(colorAttr.initial)}</span>}
               {colorAttr && <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/40 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center"><Trash2 className="text-white opacity-0 group-hover:opacity-100" size={14} /></div>}
            </div>
        )}
        
        {isGhost && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 flex flex-col items-center">
                 <ArrowLeftRight size={10} className="text-cyan-400 animate-pulse" />
                 <span className="text-[6px] font-black text-cyan-400 uppercase">Ambiguity</span>
            </motion.div>
        )}
      </div>
    );
  };

  // Tray filtering: Only show items not yet placed
  const availablePeople = currentClue.elements.people.filter(id => !placements.some(p => p.personId === id));
  const availableJobs = currentClue.elements.jobs.filter(id => !placements.some(p => p.jobId === id));
  const availableColors = currentClue.elements.colors.filter(id => !placements.some(p => p.colorId === id));

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20 px-2 sm:px-4">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-4 sm:pt-6 relative z-20">
        <div className="w-full bg-[#2a1a16] p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border-b-4 sm:border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 text-white text-center lg:text-left">
          <div className="flex flex-col">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center justify-center lg:justify-start gap-1.5 text-[#a88a6d] font-black uppercase text-[8px] sm:text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white text-lg sm:text-xl font-black uppercase tracking-tighter text-[#e6dccb]">What is an anchor instruction?</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full lg:w-auto overflow-hidden">
            <button onClick={() => switchMode('concept')} className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Theory</button>
            <button onClick={() => switchMode('practice')} className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1400px] py-4 sm:py-6 relative z-10">
        <div className="bg-[#2a1a16] p-1 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 sm:pt-8 pb-10 sm:pb-12 px-2 sm:px-6 rounded-[1.2rem] sm:rounded-[2rem] flex flex-col items-center min-h-[700px] sm:min-h-[850px] shadow-inner">
            
            {/* Clue Card */}
            <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl mb-8 sm:mb-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 opacity-20" />
               <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"><Shuffle size={12}/> {appMode === 'concept' ? 'Theory' : 'Practice'} {stepIndex + 1}</span>
                  <div className="h-px flex-1 bg-white/10" />
               </div>
               
               <h2 className="text-white text-xl sm:text-4xl font-black italic tracking-tight mb-6 sm:mb-10 text-center leading-tight px-2">
                  "{String(currentClue.text)}"
               </h2>

               <div className="flex flex-col items-center gap-4">
                  {appMode === 'concept' ? (
                      !isEvaluating ? (
                        <button onClick={handleTheoryStart} className="w-full sm:w-auto bg-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 border-b-4 border-cyan-800">
                            <Play size={16} /> Demonstrate Logic
                        </button>
                      ) : null
                  ) : (
                      !showDecisionButtons && !isEvaluating && hasPlacedRequiredElements && (
                        <button onClick={handlePracticeEvaluate} className="w-full sm:w-auto bg-green-600 text-white px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-xl border-b-4 border-green-800 flex items-center justify-center gap-2 sm:gap-3">
                            <CheckCircle2 size={16} /> Evaluate Placement
                        </button>
                      )
                  )}

                  <AnimatePresence>
                    {showDecisionButtons && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md w-full sm:w-auto">
                            <p className="text-yellow-400 font-black uppercase text-[8px] sm:text-xs text-center">Is this a 100% Fixed Anchor?</p>
                            <div className="flex gap-2 sm:gap-4 w-full">
                                <button onClick={() => handleUserDecision('yes')} className="flex-1 sm:flex-none bg-white text-black px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase text-[9px] sm:text-xs hover:bg-slate-100 transition-all border-b-4 border-slate-300">Yes, Fixed</button>
                                <button onClick={() => handleUserDecision('no')} className="flex-1 sm:flex-none bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase text-[9px] sm:text-xs hover:bg-slate-900 transition-all border-b-4 border-slate-800">No, Multiple</button>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <AnimatePresence>
                  {isVerdictVisible && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 sm:mt-10 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border-l-4 sm:border-l-8 shadow-2xl ${
                          currentClue.isAnchor ? 'bg-green-900/40 border-green-500' : 'bg-rose-900/40 border-rose-500'
                      }`}>
                          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <h4 className="text-white font-black uppercase text-[10px] sm:text-sm tracking-widest flex items-center gap-1.5 sm:gap-2">
                                  {currentClue.isAnchor ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-rose-400" />}
                                  {currentClue.isAnchor ? "VERDICT: ANCHOR" : "VERDICT: NOT AN ANCHOR"}
                              </h4>
                          </div>
                          
                          {appMode === 'practice' && (
                              <div className="mb-2 sm:mb-4">
                                  {userDecision === (currentClue.isAnchor ? 'yes' : 'no') ? (
                                      <span className="text-green-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Correct Analysis!</span>
                                  ) : (
                                      <span className="text-rose-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Logic Error. See the movements.</span>
                                  )}
                              </div>
                          )}

                          <p className="text-white italic font-bold text-[11px] sm:text-sm leading-relaxed mb-4 sm:mb-6">
                              {String(currentClue.reason)}
                          </p>

                          {(!isAtLastSample || appMode === 'practice') ? (
                              <button onClick={handleNextStep} className="w-full sm:w-auto bg-white text-black px-6 sm:px-10 py-2 sm:py-3 rounded-full font-black uppercase text-[9px] sm:text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl">
                                  {isAtLastSample ? "Finish Lab" : "Next Sample"} <ArrowRight size={14} />
                              </button>
                          ) : (
                              <button onClick={() => switchMode('practice')} className="w-full sm:w-auto bg-yellow-400 text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-[10px] sm:text-xs hover:scale-105 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-xl border-b-4 border-yellow-800">
                                  <Trophy size={16} sm={18} /> Theory Done! Start Practice
                              </button>
                          )}
                      </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Placement Workspace - Scrollable on mobile */}
            <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
              <div className="flex justify-start sm:justify-center gap-3 sm:gap-6 min-w-max mx-auto">
                 {Array(6).fill(0).map((_, i) => renderSlot(i))}
              </div>
            </div>

            {/* Tray Section */}
            <div className="w-full flex flex-col items-center gap-6 mt-4 px-2">
                <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 w-full max-w-5xl shadow-2xl relative">
                    <span className="absolute -top-3 left-4 sm:left-8 bg-black px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                        <Palette size={12}/> Variable Tray
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        {/* People Tray - only visible if used in scenario */}
                        {needsPeople && (
                          <div className="flex flex-col items-center gap-3 sm:gap-4">
                              <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> People</span>
                              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                  {availablePeople.length > 0 ? availablePeople.map(id => (
                                      <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'personId')} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} cursor-grab shadow-xl text-xs sm:text-base`}><span className="text-white font-black">{PEOPLE_DATA[id].initial}</span></motion.div>
                                  )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">All Placed</div>}
                              </div>
                          </div>
                        )}

                        {/* Jobs Tray - only visible if used in scenario */}
                        {needsJobs && (
                          <div className="flex flex-col items-center gap-3 sm:gap-4">
                              <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={12}/> Jobs</span>
                              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                  {availableJobs.length > 0 ? availableJobs.map(id => (
                                      <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'jobId')} className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 border-amber-400/30 flex items-center justify-center bg-amber-900/40 cursor-grab shadow-xl text-[9px] sm:text-xs"><span className="text-white font-black uppercase">{JOB_DATA[id].initial}</span></motion.div>
                                  )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">All Placed</div>}
                              </div>
                          </div>
                        )}

                        {/* Colors Tray - only visible if used in scenario */}
                        {needsColors && (
                          <div className="flex flex-col items-center gap-3 sm:gap-4">
                              <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Palette size={12}/> Colors</span>
                              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                  {availableColors.length > 0 ? availableColors.map(id => (
                                      <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'colorId')} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 border-white/20 flex items-center justify-center ${COLOR_DATA[id].bg} cursor-grab shadow-xl text-[9px] sm:text-xs`}><span className="text-white font-black uppercase">{COLOR_DATA[id].initial}</span></motion.div>
                                  )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">All Placed</div>}
                              </div>
                          </div>
                        )}
                    </div>

                    <div className="bg-amber-400/10 border border-amber-400/30 p-3 sm:p-4 rounded-[1rem] sm:rounded-2xl flex items-start gap-3 sm:gap-4">
                        <div className="bg-amber-400 p-1.5 sm:p-2 rounded-lg text-black shrink-0">
                            <Info size={16} />
                        </div>
                        <div>
                            <h4 className="text-amber-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest mb-1">Strategist's Tip</h4>
                            <p className="text-white/70 text-[9px] sm:text-[11px] font-bold leading-relaxed">
                                Always start by finding the <span className="text-amber-400">Anchor</span>. It is a piece of information that gives a <span className="underline decoration-amber-500">fixed position</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mastery Modal */}
      <AnimatePresence>
        {isMasteryVisible && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-2xl p-10 sm:p-14 rounded-[3rem] sm:rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 border-4 border-white shadow-xl">
                            <Trophy size={64} className="animate-bounce" />
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Anchor Mastered!</h2>
                        <p className="text-[#3e2723] text-sm sm:text-lg font-bold mb-10 leading-relaxed max-w-md italic">
                            "You have learned to distinguish between fixed certainty and relative movement. This is the foundation of all logical puzzles."
                        </p>
                        <button 
                            onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/anchorFromMultipleInstruction')}
                            className="bg-[#3e2723] text-[#e6dccb] px-10 py-4 sm:py-5 rounded-full font-black uppercase tracking-widest text-xs sm:text-sm hover:scale-105 active:scale-95 transition-all shadow-xl border-b-8 border-black flex items-center gap-3"
                        >
                            <RefreshCcw size={20} /> Next Module
                        </button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-col items-center text-center opacity-40 px-4">
          <GraduationCap size={40} sm={48} className="text-[#3e2723] mb-2" />
          <h3 className="text-[#3e2723] font-black uppercase text-[10px] sm:text-xs">Analytical Foundation Lab</h3>
          <p className="text-[#3e2723] text-[8px] sm:text-[9px] font-bold max-w-xs leading-relaxed italic">"Identify fixed truths to build a stable logical structure."</p>
      </div>
    </div>
  );
}