import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Scale,
  Target,
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  HelpCircle,
  BookOpen,
  Layers,
  ChevronRight,
  Home,
  FastForward,
  Info,
  Check,
  Plus,
  Trash2,
  Users,
  UserCircle,
  UserCheck,
  UserMinus,
  UserPlus,
  User,
  ShoppingCart,
  UserX,
  CheckCircle,
  XCircle,
  ArrowRightCircle,
  ArrowLeftCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================
const PEOPLE = [
  { id: 'A', name: 'Person A', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
  { id: 'B', name: 'Person B', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
  { id: 'C', name: 'Person C', icon: User, color: 'from-emerald-600 to-emerald-800' },
  { id: 'D', name: 'Person D', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'E', name: 'Person E', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
  { id: 'F', name: 'Person F', icon: Users, color: 'from-indigo-600 to-indigo-800' },
  { id: 'G', name: 'Person G', icon: UserCircle, color: 'from-slate-700 to-slate-900' }
];

const PRACTICE_PEOPLE = [
  { id: 'P', name: 'P', icon: User, color: 'from-cyan-600 to-cyan-800' },
  { id: 'Q', name: 'Q', icon: User, color: 'from-teal-600 to-teal-800' },
  { id: 'R', name: 'R', icon: User, color: 'from-lime-600 to-lime-800' },
  { id: 'S', name: 'S', icon: User, color: 'from-orange-600 to-orange-800' },
  { id: 'T', name: 'T', icon: User, color: 'from-pink-600 to-pink-800' },
  { id: 'U', name: 'U', icon: User, color: 'from-red-600 to-red-800' }
];

const ALL_ITEMS = [...PEOPLE, ...PRACTICE_PEOPLE];

const LOGIC_DATA = {
  concept: {
    clues: [
      "Arrange seven persons (A-G) in DESCENDING order (Tallest to Shortest).",
      "C is shorter than only G.",
      "The number of persons taller than B is equal to the number of persons shorter than D.",
      "B and D are both taller than A.",
      "Neither A nor E is shortest.",
      "Final Decider: E is taller than B."
    ],
    teachingSteps: [
      { 
        clueIndex: 1, 
        prompt: "Step 1: Anchor the Top.",
        instruction: "C is shorter than ONLY G. Place G in Slot 1 and C in Slot 2.", 
        explanation: "Descending order means Slot 1 is tallest. Since G is the only one taller than C, G must be #1 and C must be #2.",
        targetAction: [{ itemId: 'G', slot: 0 }, { itemId: 'C', slot: 1 }]
      },
      { 
        clueIndex: 2, 
        prompt: "Step 2: Symmetrical Balance (Multi-Scenario).",
        instruction: "Logic: Taller than B = Shorter than D. You MUST create 2 branches using '+' to show both possibilities (B=3,D=5 and B=5,D=3).", 
        explanation: "This rule has two solutions. Click a branch row to edit it. Test both possibilities side-by-side to hold all valid ideas!",
        forceMultiScenario: true,
        targetAction: [
          { itemId: 'B', slot: 2 }, { itemId: 'D', slot: 4 },
          { itemId: 'B', slot: 4 }, { itemId: 'D', slot: 2 }
        ]
      },
      { 
        clueIndex: 3, 
        prompt: "Step 3: Placing A in both branches.",
        instruction: "B and D are taller than A. Click each branch row and place Person A in Slot 6 in both rows.", 
        explanation: "Person A is shorter than B and D. Since Slot 7 is the absolute shortest, A fits logically into Slot 6 across all scenarios.",
        targetAction: [{ itemId: 'A', slot: 5 }]
      },
      { 
        clueIndex: 4, 
        prompt: "Step 4: Final Elimination.",
        instruction: "Neither A nor E is shortest. Place Person F in Slot 7 and Person E in Slot 4 in BOTH rows.", 
        explanation: "Slot 7 is the absolute shortest. With A and E excluded, Person F is shortest. This leaves Slot 4 for Person E in both scenarios.",
        targetAction: [{ itemId: 'F', slot: 6 }, { itemId: 'E', slot: 3 }]
      }
    ],
    postQuiz: [
      { q: "Who is the absolute tallest person?", options: ["Person C", "Person G", "Person B"], correct: 1 },
      { q: "Who is the second shortest person (Slot 6)?", options: ["Person A", "Person F", "Person E"], correct: 0 },
      { q: "Which clue allowed us to finally select the valid scenario?", options: ["Clue 1", "Clue 6 (E > B)", "Clue 4"], correct: 1 }
    ]
  },
  practice: [
    {
      id: 'scen-heights',
      title: "Family Height Challenge",
      mission: "Arrange 6 family members (P-U) from Tallest (1) to Shortest (6).",
      clues: [
        "S is shorter than only T.",
        "P is taller than Q but shorter than R.",
        "U is the absolute shortest person.",
        "T is taller than R."
      ],
      targetOrder: ['T', 'S', 'R', 'P', 'Q', 'U'],
      explanation: "Logical Chain: T (1) > S (2) > R (3) > P (4) > Q (5) > U (6).",
      quiz: [
        { q: "Who is at the 4th position?", options: ["Person P", "Person R", "Person Q"], correct: 0 },
        { q: "Is Person S taller than Person R?", options: ["Yes", "No"], correct: 0 },
        { q: "How many people are shorter than T?", options: ["4", "5", "6"], correct: 1 }
      ]
    }
  ]
};

// ==========================================
// SUB-COMPONENTS
// ==========================================
const HeaderSection = ({ onBack, title, appMode, setAppMode, onReset }) => (
  <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
              <ChevronLeft size={12} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[16px] truncate max-w-[150px] sm:max-w-none">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all"><RotateCcw size={16} /></button>
        </div>
      </div>
  </header>
);

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [completedClues, setCompletedClues] = useState([]);
  const [conceptStarted, setConceptStarted] = useState(false);
  const [isArrangementDone, setIsArrangementDone] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');

  const [scenarios, setScenarios] = useState([{ id: Date.now(), items: new Array(7).fill(null) }]);
  const [activeScenIdx, setActiveScenIdx] = useState(0);

  const [practiceStatus, setPracticeStatus] = useState('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const [evaluationPhase, setEvaluationPhase] = useState(false);
  const [validatedBranchIdx, setValidatedBranchIdx] = useState(null);

  const containerRef = useRef(null);

  // ==========================================
  // LOGIC FUNCTIONS
  // ==========================================
  function handleReset(targetMode) {
    const mode = targetMode || appMode;
    const itemCount = mode === 'concept' ? 7 : 6;
    setScenarios([{ id: Date.now(), items: new Array(itemCount).fill(null) }]);
    setActiveScenIdx(0);
    setActiveStep(0);
    setCompletedClues([]);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setIsArrangementDone(false);
    setConceptStarted(false);
    setPracticeStatus('idle');
    setShowExplanation(false);
    setQuizMode(false);
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setLessonFinished(false);
    setEvaluationPhase(false);
    setValidatedBranchIdx(null);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  function handleAddScenario() {
    const currentItems = [...scenarios[activeScenIdx].items];
    setScenarios([...scenarios, { id: Date.now(), items: currentItems }]);
    setActiveScenIdx(scenarios.length);
  }

  function handleRemoveScenario(idx) {
    if (scenarios.length === 1) return;
    const next = scenarios.filter((_, i) => i !== idx);
    setScenarios(next);
    setActiveScenIdx(0);
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function nextQuizStep() {
    const currentData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice[0];
    const currentQuiz = quizMode ? (appMode === 'concept' ? currentData.postQuiz : currentData.quiz) : [];
    if (quizStep < currentQuiz.length - 1) {
        setQuizStep(quizStep + 1);
        setQuizSelection(null);
        setQuizFeedbackMode(false);
    } else {
        setLessonFinished(true);
        setQuizMode(false);
    }
  }

  function prevStep() {
    if (activeStep > 0) {
      const prevIdx = activeStep - 1;
      const currentStep = LOGIC_DATA.concept.teachingSteps[activeStep];
      const prevStepData = LOGIC_DATA.concept.teachingSteps[prevIdx];
      
      const newScenarios = scenarios.map(scen => {
        const newItems = [...scen.items];
        currentStep.targetAction.forEach(ta => {
          const idx = newItems.indexOf(ta.itemId);
          if (idx !== -1) newItems[idx] = null;
        });
        prevStepData.targetAction.forEach(ta => {
          const idx = newItems.indexOf(ta.itemId);
          if (idx !== -1) newItems[idx] = null;
        });
        return { ...scen, items: newItems };
      });

      setScenarios(newScenarios);
      setActiveStep(prevIdx);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
      setCompletedClues(prev => prev.filter(idx => idx !== currentStep.clueIndex && idx !== prevStepData.clueIndex));
      setEvaluationPhase(false);
    }
  }

  function validateBranchChoice(idx) {
    const branch = scenarios[idx].items;
    const ePos = branch.indexOf('E');
    const bPos = branch.indexOf('B');
    if (ePos !== -1 && bPos !== -1 && ePos < bPos) {
        setValidatedBranchIdx(idx);
        setStepStatus('correct');
        setFeedback({ type: 'success', msg: "Correct Logic!", reason: "" });
    } else {
        setFeedback({ type: 'error', msg: "Invalid Scenario", reason: "In this branch, B is taller than E. Clue 6 requires E to be taller!" });
    }
  }

  function checkSymmetryForce(allScenarios) {
    if (allScenarios.length < 2) return false;
    const b1 = allScenarios[0].items;
    const b2 = allScenarios[1].items;
    const p1 = (b1[2] === 'B' && b1[4] === 'D') && (b2[4] === 'B' && b2[2] === 'D');
    const p2 = (b1[4] === 'B' && b1[2] === 'D') && (b2[2] === 'B' && b2[4] === 'D');
    return p1 || p2;
  }

  function handleDragStart() {
    // Clear feedback when user starts a new drag to avoid confusion
    if (feedback.type === 'error') {
       setFeedback({ type: null, msg: "", reason: "" });
       setStepStatus('idle');
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished || (appMode === 'concept' && !conceptStarted) || evaluationPhase) return;

    const dragX = info.point.x;
    const dragY = info.point.y;
    
    // Live DOM snapping logic
    const slots = document.querySelectorAll(`[data-branch-id="${scenarios[activeScenIdx].id}"]`);
    let targetIdx = -1;
    let minDist = 1000;
    const magneticRadius = 150; 

    slots.forEach((slot) => {
        const rect = slot.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
        
        if (dist < magneticRadius && dist < minDist) {
            minDist = dist;
            targetIdx = parseInt(slot.getAttribute('data-slot-idx'));
        }
    });

    if (targetIdx !== -1) {
      const currentItems = [...scenarios[activeScenIdx].items];
      if (currentItems[targetIdx] !== null && currentItems[targetIdx] !== itemId) {
        setFeedback({ type: 'error', msg: "Position Occupied", reason: "Remove current person first using 'X'." });
        if (appMode === 'concept') setStepStatus('wrong');
        return;
      }

      const newItems = [...currentItems];
      if (sourceIndex !== null) newItems[sourceIndex] = null;
      const existingIdx = newItems.indexOf(itemId);
      if (existingIdx !== -1) newItems[existingIdx] = null;
      newItems[targetIdx] = itemId;

      const newScenarios = [...scenarios];
      newScenarios[activeScenIdx].items = newItems;
      setScenarios(newScenarios);

      if (appMode === 'concept') {
        const step = LOGIC_DATA.concept.teachingSteps[activeStep];
        const isItemCorrect = step.targetAction.some(ta => ta.itemId === itemId);
        const isSlotCorrect = step.targetAction.some(ta => ta.itemId === itemId && ta.slot === targetIdx) || step.flexible;

        // ERROR HANDLING IN CONCEPT MODE
        if (!isItemCorrect) {
          setFeedback({ type: 'error', msg: "Deduction Mismatch", reason: `Focus on Clue ${step.clueIndex + 1}. This person isn't involved in this step.` });
          setStepStatus('wrong');
          return;
        }
        if (!isSlotCorrect) {
          setFeedback({ type: 'error', msg: "Logic Position Error", reason: "Height rules place this person in a different slot." });
          setStepStatus('wrong');
          return;
        }

        let success = false;
        if (step.forceMultiScenario) {
            success = checkSymmetryForce(newScenarios);
        } else {
            success = newScenarios.every(scen => step.targetAction.every(ta => scen.items[ta.slot] === ta.itemId));
        }

        if (success) {
          setStepStatus('correct');
          setFeedback({ type: 'success', msg: "Step Validated!", reason: "" });
        }
      } else {
        setPracticeStatus('idle');
      }
    } else if (sourceIndex !== null) {
      const newScenarios = [...scenarios];
      newScenarios[activeScenIdx].items[sourceIndex] = null;
      setScenarios(newScenarios);
    }
  }

  function nextStep() {
    const step = LOGIC_DATA.concept.teachingSteps[activeStep];
    if (!completedClues.includes(step.clueIndex)) setCompletedClues(prev => [...prev, step.clueIndex]);
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setEvaluationPhase(true);
      setStepStatus('idle');
    }
  }

  function validatePractice() {
    const currentOrder = scenarios[0].items.join(',');
    const targetOrder = LOGIC_DATA.practice[0].targetOrder.join(',');
    if (currentOrder === targetOrder) { setPracticeStatus('correct'); setQuizMode(true); } 
    else setPracticeStatus('wrong');
  }

  // Effect to handle mode switching
  useEffect(() => { handleReset(); }, [appMode]);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice[0];
  const currentQuizSet = quizMode ? (appMode === 'concept' ? currentScenData.postQuiz : currentScenData.quiz) : [];

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none overflow-hidden font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
      
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Height Logic Academy" : "Comparative Laboratory"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset()} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* INTERACTIVE AREA */}
        <div key={appMode} className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px]"><Layers size={14}/><span className="font-black uppercase tracking-widest">Logic Workspace</span></div>

            <div className="flex flex-col gap-5">
              <AnimatePresence>
                {scenarios.map((scen, sIdx) => (
                  <motion.div key={scen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shadow-inner transition-all
                    ${sIdx === activeScenIdx ? 'border-yellow-500/40 shadow-xl' : 'border-black/20 opacity-50'}
                    ${evaluationPhase && validatedBranchIdx !== null ? (sIdx === validatedBranchIdx ? 'ring-4 ring-green-500' : 'ring-4 ring-rose-500') : ''}`}
                    onClick={() => !evaluationPhase && setActiveScenIdx(sIdx)}
                  >
                    {/* Direction Markers */}
                    <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                            <ArrowLeftCircle size={16} /> Tallest (Slot 1)
                        </div>
                        {scenarios.length > 1 && sIdx === activeScenIdx && !evaluationPhase && !quizMode && (
                            <div className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-md">ACTIVE BRANCH</div>
                        )}
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                            Shortest (Slot {appMode === 'concept' ? '7' : '6'}) <ArrowRightCircle size={16} />
                        </div>
                    </div>

                    {evaluationPhase && validatedBranchIdx !== null && (
                        <div className="absolute top-4 right-4 z-50">
                            {sIdx === validatedBranchIdx ? <CheckCircle className="text-green-500" size={32} /> : <XCircle className="text-rose-500" size={32} />}
                        </div>
                    )}

                    {appMode === 'concept' && sIdx === activeScenIdx && !quizMode && !lessonFinished && !evaluationPhase && (
                      <div className="absolute -right-1 flex flex-col gap-2 z-40">
                        <button onClick={(e) => { e.stopPropagation(); handleAddScenario(); }} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Plus size={18} strokeWidth={4}/></button>
                        {scenarios.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveScenario(sIdx); }} className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Trash2 size={18} strokeWidth={4}/></button>}
                      </div>
                    )}

                    {evaluationPhase && validatedBranchIdx === null && (
                        <div className="absolute inset-0 bg-yellow-400/5 z-50 flex items-center justify-center cursor-pointer rounded-[1.5rem]" onClick={() => validateBranchChoice(sIdx)}>
                            <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-[12px] uppercase shadow-2xl animate-bounce">Select Valid Scenario</div>
                        </div>
                    )}

                    <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-black/20 -translate-y-1/2 rounded-full z-0" />
                    <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4 px-2">
                      {scen.items.map((itemId, i) => {
                        const itemData = itemId ? ALL_ITEMS.find(f => f.id === itemId) : null;
                        const stepTargets = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.targetAction.map(ta => ta.slot) : [];
                        const isTarget = appMode === 'concept' && stepTargets.includes(i) && conceptStarted && sIdx === activeScenIdx;
                        const IconComponent = itemData ? itemData.icon : null;

                        return (
                          <div key={i} className="flex flex-col items-center gap-1">
                            <div 
                              data-branch-id={scen.id}
                              data-slot-idx={i}
                              className={`w-10 h-10 sm:w-20 sm:h-20 rounded-full border-[1px] sm:border-2 flex items-center justify-center relative transition-all duration-300 group
                                ${itemData 
                                  ? `bg-white border-white shadow-md scale-105 sm:scale-110 
                                     ${(practiceStatus === 'wrong') || (appMode === 'concept' && stepStatus === 'wrong' && itemId === scen.items[i] && sIdx === activeScenIdx && isTarget) ? 'ring-2 ring-rose-500' : ''}
                                     ${(stepStatus === 'correct' && (isTarget || appMode === 'concept')) || (practiceStatus === 'correct') ? 'ring-2 ring-green-500' : ''}` 
                                  : `border-dashed ${isTarget ? 'border-yellow-400 bg-black/40 shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'border-white/10 bg-black/10'}`
                                }
                              `}
                            >
                              {itemData ? (
                                <>
                                  <motion.div 
                                      layoutId={`item-${itemData.id}-${scen.id}`} 
                                      drag={!lessonFinished && !quizFeedbackMode && !evaluationPhase && sIdx === activeScenIdx} 
                                      dragConstraints={containerRef} 
                                      dragMomentum={false} 
                                      dragElastic={0.1}
                                      onDragStart={handleDragStart}
                                      whileDrag={{ scale: 1.3, zIndex: 100, boxShadow: "0 10px 25px rgba(0,0,0,0.4)" }}
                                      onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, i)}
                                      className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
                                  >
                                      <div className="text-white drop-shadow-md"><IconComponent size={28} /></div>
                                      <span className="text-[10px] sm:text-[12px] font-black text-white uppercase mt-1">{itemData.id}</span>
                                  </motion.div>
                                  {!quizMode && !lessonFinished && !evaluationPhase && sIdx === activeScenIdx && (
                                    <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
                                      onClick={() => { const n = [...scenarios]; n[sIdx].items[i] = null; setScenarios(n); if(appMode === 'concept') setStepStatus('idle'); }}>
                                      <div className="bg-rose-600 p-1.5 rounded-full shadow-lg border border-white/20"><X size={14} strokeWidth={3} className="text-white"/></div>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className={`font-black text-[12px] sm:text-[20px] ${isTarget ? 'text-yellow-400' : 'text-white/10'}`}>{i + 1}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
               <div className="flex items-center justify-center gap-1.5 opacity-20"><ShoppingCart size={14} /><span className="text-[14px] font-black uppercase tracking-widest">Shared repository</span></div>
               <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
                  {(appMode === 'concept' ? PEOPLE : PRACTICE_PEOPLE).map((item) => {
                    const isPlacedInActive = scenarios[activeScenIdx].items.includes(item.id);
                    const RepoIcon = item.icon;
                    return (
                      <div key={`anchor-${item.id}`} className="relative w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-[1px] sm:border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
                        {!isPlacedInActive ? (
                            <motion.div 
                                layoutId={`item-${item.id}-storage`} 
                                drag={!quizMode && !lessonFinished && !evaluationPhase && (appMode === 'concept' ? conceptStarted : true) && (appMode === 'practice' || stepStatus === 'idle')} 
                                dragConstraints={containerRef} 
                                dragMomentum={false} 
                                dragElastic={0.1} 
                                onDragStart={handleDragStart}
                                whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.3, zIndex: 100, boxShadow: "0 10px 25px rgba(0,0,0,0.3)" }}
                                onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null)} 
                                className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-1 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${item.color} shadow-xl border-white/20 z-10 p-1 sm:p-2 cursor-grab active:cursor-grabbing`}
                            >
                                <div className="text-white drop-shadow-md"><RepoIcon size={24} /></div>
                                <span className="text-[8px] sm:text-[12px] font-black text-white leading-none">{item.id}</span>
                            </motion.div>
                        ) : (
                            <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-white/5 opacity-10 grayscale pointer-events-none">
                                <div className="scale-75 sm:scale-100 opacity-20"><RepoIcon size={24} /></div>
                            </div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          </motion.div>
        </div>

        {/* GUIDANCE PANEL */}
        <div className="w-full max-w-7xl bg-[#2a1a16] p-4 rounded-t-[2rem] border-t-4 sm:border-t-8 border-black shadow-2xl relative z-50 flex flex-col gap-3 shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 sm:gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 opacity-50"><BookOpen size={16} className="text-[#a88a6d]"/><span className="text-[#a88a6d] font-black uppercase text-[14px]">Rulebook</span></div>
              <div className="bg-black/40 p-3 rounded-2xl border border-white/10 flex flex-col gap-2 h-full max-h-[120px] sm:max-h-[180px] overflow-y-auto custom-scrollbar text-[14px]">
                 {(appMode === 'concept' ? LOGIC_DATA.concept.clues : LOGIC_DATA.practice[0].clues).map((clue, idx) => {
                   const done = appMode === 'concept' && completedClues.includes(idx);
                   return (
                    <div key={idx} className={`flex items-start gap-2 transition-opacity ${done ? 'opacity-30' : 'opacity-100'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${done ? 'bg-green-600' : 'bg-yellow-500'}`}>
                          {done ? <Check size={12} className="text-white"/> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
                        </div>
                        <p className={`text-white font-bold leading-tight ${done ? 'line-through italic text-white/40' : ''}`}>{clue}</p>
                    </div>
                   );
                 })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
               <div className="flex items-center justify-between opacity-50">
                 <div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[14px]">Mission Control</span></div>
                 {conceptStarted && appMode === 'concept' && !quizMode && !lessonFinished && (
                   <button onClick={prevStep} disabled={activeStep === 0} className={`p-1 ${activeStep === 0 ? 'opacity-10' : 'text-yellow-400'}`}><ArrowLeft size={18}/></button>
                 )}
               </div>
               <div className="bg-[#3e2723] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[140px] sm:min-h-[160px]">
                  <AnimatePresence mode='wait'>
                    {showExplanation ? (
                      <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-2 text-center w-full">
                         <p className="text-white font-medium italic leading-snug px-4 text-[14px]">{appMode === 'concept' ? currentScenData.teachingSteps[activeStep].explanation : currentScenData.explanation}</p>
                         <button onClick={() => setShowExplanation(false)} className="bg-white/10 text-white px-6 py-2 rounded-full font-black text-[12px] uppercase tracking-widest shadow-lg">Back to Task</button>
                      </motion.div>
                    ) : lessonFinished ? (
                      <motion.div key="finish" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col items-center gap-3">
                         <Trophy size={50} className="text-yellow-400 animate-bounce" />
                         <h3 className="text-white text-[20px] font-black uppercase tracking-tighter leading-none">Lesson Finished!</h3>
                         <button onClick={() => setAppMode('practice')} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 active:scale-95 transition-all">Start Practice Lab <ChevronRight size={18} className="inline ml-1"/></button>
                      </motion.div>
                    ) : quizMode ? (
                      <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-3">
                         {!quizFeedbackMode ? (
                           <>
                             <div className="flex justify-between items-center px-1">
                               <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest leading-none">Quest {quizStep + 1}/{currentQuizSet.length}</span>
                               <button onClick={() => setShowExplanation(true)} className="text-white/40 text-[12px] font-bold underline">Clue Hint</button>
                             </div>
                             <p className="text-white text-center font-bold leading-tight px-1 text-[16px]">{currentQuizSet[quizStep].q}</p>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-1">
                               {currentQuizSet[quizStep].options.map((opt, idx) => (
                                 <button key={idx} onClick={() => handleQuizSelection(idx)} className="p-3 rounded-lg bg-black/40 text-white font-black uppercase border-b-2 border-black hover:bg-black/60 active:scale-95 transition-all text-[14px]">{opt}</button>
                               ))}
                             </div>
                           </>
                         ) : (
                           <div className="flex flex-col items-center gap-3">
                              <div className={`p-2 rounded-full ${quizSelection === currentQuizSet[quizStep].correct ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-rose-500'} text-white`}>
                                {quizSelection === currentQuizSet[quizStep].correct ? <Check size={24}/> : <X size={24}/>}
                              </div>
                              <h3 className={`text-[18px] font-black uppercase ${quizSelection === currentQuizSet[quizStep].correct ? 'text-green-400' : 'text-rose-400'}`}>{quizSelection === currentQuizSet[quizStep].correct ? 'Perfect Deduction!' : 'Incorrect Logic'}</h3>
                              <div className="flex gap-3">
                                {quizSelection === currentQuizSet[quizStep].correct ? (
                                  <button onClick={nextQuizStep} className="bg-green-600 text-white px-10 py-2 rounded-full font-black text-[14px] uppercase shadow-xl hover:bg-green-500">
                                    {quizStep < currentQuizSet.length - 1 ? 'Next Quest' : 'Complete Lesson'}
                                  </button>
                                ) : (
                                  <button onClick={() => setQuizFeedbackMode(false)} className="bg-rose-600 text-white px-10 py-2 rounded-full font-black text-[14px] uppercase shadow-xl hover:bg-rose-500">Try Again</button>
                                )}
                              </div>
                           </div>
                         )}
                      </motion.div>
                    ) : evaluationPhase ? (
                      <motion.div key="eval" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center flex flex-col items-center gap-4">
                         <div className="bg-yellow-400/10 p-3 rounded-xl border border-yellow-400/40">
                             <p className="text-yellow-400 font-black text-[12px] uppercase tracking-wider leading-none mb-1">Final logic: E is taller than B.</p>
                             <p className="text-white text-[16px] font-bold">Which branch above satisfies this?</p>
                         </div>
                         {validatedBranchIdx === null ? (
                             <p className="text-white/40 text-[12px] animate-pulse italic">Select the valid branch row in the workspace...</p>
                         ) : (
                             <button onClick={() => setQuizMode(true)} className="bg-green-600 text-white px-10 py-2 rounded-full font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all">Start Logic Evaluation <ChevronRight size={18} className="inline ml-1"/></button>
                         )}
                      </motion.div>
                    ) : appMode === 'concept' ? (
                      !conceptStarted ? (
                        <div className="flex flex-col items-center gap-3">
                            <p className="text-white/60 text-center font-medium leading-tight">Deduce exact heights using multi-scenario logic.</p>
                            <button onClick={() => setConceptStarted(true)} className="bg-yellow-400 text-black px-12 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 transition-transform">Begin Academy</button>
                        </div>
                      ) : (
                        <div className="w-full flex flex-col gap-2">
                           {/* ERROR ALERT BOX */}
                           {stepStatus === 'wrong' && feedback.type === 'error' && (
                             <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="bg-rose-500/20 border border-rose-500/50 p-3 rounded-xl flex items-start gap-2 mb-1">
                                <AlertCircle className="text-rose-500 shrink-0" size={18} />
                                <div>
                                   <p className="text-rose-500 font-black text-[14px] uppercase leading-none">{feedback.msg}</p>
                                   <p className="text-white/80 text-[12px] mt-1 leading-tight">{feedback.reason}</p>
                                </div>
                             </motion.div>
                           )}
                           <div className="bg-black/30 p-4 rounded-xl border-l-4 border-yellow-400 w-full shadow-lg">
                              <p className="text-yellow-400 text-[12px] font-black uppercase tracking-widest mb-1 leading-none">{currentScenData.teachingSteps[activeStep].prompt}</p>
                              <p className="text-white font-bold italic leading-tight text-[16px]">{currentScenData.teachingSteps[activeStep].instruction}</p>
                              {currentScenData.teachingSteps[activeStep].forceMultiScenario && scenarios.length < 2 && (
                                  <p className="text-rose-400 text-[12px] font-black uppercase mt-2 animate-pulse flex items-center gap-1"><AlertCircle size={12}/> Create a branch to explore symmetry!</p>
                              )}
                              <div className="mt-4 flex justify-end">
                                 <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`px-8 py-2 rounded-full font-black uppercase text-[12px] transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Verify Step <ArrowRight size={14} className="inline ml-1"/></button>
                              </div>
                           </div>
                        </div>
                      )
                    ) : (
                        <div className="flex flex-col items-center gap-4 w-full">
                           <p className="text-white text-[16px] font-black text-center italic leading-tight px-4 uppercase tracking-tighter">"{currentScenData.mission}"</p>
                           <div className="flex gap-4">
                              <button onClick={validatePractice} disabled={!scenarios[0].items.every(f => f !== null)} className={`bg-orange-500 text-white px-12 py-3 rounded-full font-black uppercase shadow-xl text-[14px] ${!scenarios[0].items.every(f => f !== null) ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}>Validate Solution</button>
                              <button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[14px] shadow-xl">Hint</button>
                           </div>
                        </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.01); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }