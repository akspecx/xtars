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
  ShoppingCart,
  RefreshCw
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// CONFIGURATIONS & CONSTANTS
// ==========================================
const UI_CONFIG = {
  headerTitleSize: '16px',
  normalTextSize: '14px',
  woodPrimary: '#2a1a16',
  woodSecondary: '#3e2723',
  woodAccent: '#a88a6d',
};

const GOODS = [
  { id: 'salt', name: 'Salt', icon: '🧂', color: 'from-slate-700 to-slate-900' },
  { id: 'sugar', name: 'Sugar', icon: '🍬', color: 'from-pink-700 to-pink-900' },
  { id: 'flour', name: 'Flour', icon: '🥣', color: 'from-yellow-800 to-yellow-950' },
  { id: 'wheat', name: 'Wheat', icon: '🌾', color: 'from-amber-800 to-amber-950' },
  { id: 'pulses', name: 'Pulses', icon: '🥜', color: 'from-orange-800 to-orange-950' },
  { id: 'rice', name: 'Rice', icon: '🍚', color: 'from-blue-800 to-blue-950' },
  // Practice Items
  { id: 'bread', name: 'Bread', icon: '🍞', color: 'from-orange-800 to-orange-950' },
  { id: 'milk', name: 'Milk', icon: '🥛', color: 'from-blue-100 to-slate-300' },
  { id: 'apples', name: 'Apples', icon: '🍎', color: 'from-red-800 to-red-950' },
  { id: 'potatoes', name: 'Potatoes', icon: '🥔', color: 'from-yellow-800 to-yellow-950' },
  { id: 'soup', name: 'Soup', icon: '🥫', color: 'from-rose-800 to-rose-950' },
  { id: 'eggs', name: 'Eggs', icon: '🥚', color: 'from-slate-300 to-slate-500' }
];

const LOGIC_DATA = {
  concept: {
    clues: [
      "Salt is the lightest among them.",
      "Flour is heavier than sugar but has less weight than wheat.",
      "Wheat is less heavy than rice and pulses but more than sugar.",
      "Pulses are not the heaviest ones."
    ],
    teachingSteps: [
      { 
        clueIndex: 0, 
        prompt: "Let's follow Instruction 1: 'Salt is the lightest'.",
        instruction: "Drag Salt to the very first trolley position (Slot 1).", 
        explanation: "Absolute superlatives like 'Lightest' give us a fixed anchor. Slot 1 is the home for the minimum weight.",
        targetAction: [{ itemId: 'salt', slot: 0 }]
      },
      { 
        clueIndex: 1, 
        prompt: "Instructions 2 & 3: 'Sugar < Flour < Wheat'.",
        instruction: "This is a logical chain. Place Sugar, Flour, and Wheat in the next three slots together.", 
        explanation: "Sugar is lighter than Flour, and Flour is lighter than Wheat. They must follow Salt in that exact relative order.",
        targetAction: [
          { itemId: 'sugar', slot: 1 },
          { itemId: 'flour', slot: 2 },
          { itemId: 'wheat', slot: 3 }
        ]
      },
      { 
        clueIndex: 2, 
        prompt: "Instruction 3: 'Wheat is less heavy than Rice and Pulses'.",
        instruction: "We have two slots left. Fill Slot 5 and 6 with Rice and Pulses in any order.", 
        explanation: "Since Wheat is lighter than both, Rice and Pulses must occupy the last two spots. We will check the final order next!",
        flexible: true, 
        targetAction: [
          { itemId: 'rice', slot: 4 },
          { itemId: 'pulses', slot: 4 },
          { itemId: 'rice', slot: 5 },
          { itemId: 'pulses', slot: 5 }
        ]
      },
      { 
        clueIndex: 3, 
        prompt: "Final Rule - Instruction 4: 'Pulses are not the heaviest'.",
        instruction: "Look at your last two trolleys. If Pulses are in the final spot, swap them with Rice.", 
        explanation: "If Pulses cannot be the heaviest, they must take Slot 5, leaving Slot 6 for Rice.",
        targetAction: [
          { itemId: 'pulses', slot: 4 },
          { itemId: 'rice', slot: 5 }
        ]
      }
    ]
  },
  practice: [
    {
      id: 'scen-grocery',
      title: "Grocery Challenge",
      mission: "Using comparative logic, arrange these 6 grocery bags from LIGHTEST to HEAVIEST.",
      clues: [
        "Bread is lighter than Eggs.",
        "Soup is the absolute heaviest item.",
        "Milk is heavier than Apples but lighter than Potatoes.",
        "Apples are heavier than Eggs.",
        "Potatoes are not as heavy as Soup."
      ],
      fruits: ['bread', 'eggs', 'apples', 'milk', 'potatoes', 'soup'],
      targetOrder: ['bread', 'eggs', 'apples', 'milk', 'potatoes', 'soup'],
      explanation: "Logical Chain: Bread (L) < Eggs < Apples < Milk < Potatoes < Soup (H).",
      quiz: [
        { q: "Which item is directly lighter than Milk?", options: ["Apples", "Eggs", "Bread"], correct: 0 },
        { q: "If we remove Soup, which item becomes the heaviest?", options: ["Milk", "Potatoes", "Apples"], correct: 1 },
        { q: "Which bag is in the 2nd position?", options: ["Eggs", "Bread", "Milk"], correct: 0 },
        { q: "Between Apples and Potatoes, which is lighter?", options: ["Apples", "Potatoes"], correct: 0 },
        { q: "Is Soup heavier than Bread?", options: ["Yes", "No"], correct: 0 }
      ]
    }
  ]
};

// ==========================================
// SUB-COMPONENTS
// ==========================================
const HeaderSection = ({ onBack, title, appMode, setAppMode, onReset }) => (
  <header className="w-full shrink-0 p-2 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/90 backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex flex-col md:flex-row justify-between items-center text-white gap-3">
        <div className="flex flex-col items-start gap-0.5 w-full md:w-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
              <ChevronLeft size={14} /> Dashboard
          </button>
          <span className="text-white font-black uppercase tracking-tight leading-none" style={{ fontSize: UI_CONFIG.headerTitleSize }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-4 border-rose-900 text-white transition-all active:translate-y-1"><RotateCcw size={16} /></button>
        </div>
      </div>
  </header>
);

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [placedItems, setPlacedItems] = useState(new Array(6).fill(null));
  const [activeStep, setActiveStep] = useState(0);
  const [completedClues, setCompletedClues] = useState([]);
  const [conceptStarted, setConceptStarted] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');

  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceStatus, setPracticeStatus] = useState('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStep, setQuizStep] = useState(-1);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);

  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const slotRefs = useRef([]);

  // Robust cleanup on mode switch
  useEffect(() => {
    setPlacedItems(new Array(6).fill(null));
    setActiveStep(0);
    setCompletedClues([]);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setIsSolved(false);
    setConceptStarted(false);
    setPracticeStatus('idle');
    setShowExplanation(false);
    setQuizStep(-1);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
  }, [appMode]);

  const handleReset = () => {
    setPlacedItems(new Array(6).fill(null));
    setActiveStep(0);
    setCompletedClues([]);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setIsSolved(false);
    setConceptStarted(false);
    setPracticeStatus('idle');
    setShowExplanation(false);
    setQuizStep(-1);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
  };

  const handleSetMode = (mode) => {
    setAppMode(mode);
  };

  const handleDragEnd = (event, info, itemId, sourceIndex) => {
    if (isSolved || (appMode === 'concept' && !conceptStarted) || stepStatus === 'correct' || practiceStatus === 'correct') return;

    const dragX = info.point.x;
    const dragY = info.point.y;
    let targetIdx = -1;
    let minDist = 1000;

    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      if (dist < 60 && dist < minDist) { minDist = dist; targetIdx = index; }
    });

    if (targetIdx !== -1) {
      // NEW: Block replacement logic
      // Only allow dropping if slot is empty, OR if we are dropping the same item back into its current slot
      if (placedItems[targetIdx] !== null && placedItems[targetIdx] !== itemId) {
        setFeedback({ 
            type: 'error', 
            msg: "Slot Occupied", 
            reason: `This trolley slot already has an item. Please deselect the current item first before placing a new one!` 
        });
        if (appMode === 'concept') setStepStatus('wrong');
        return;
      }

      if (appMode === 'concept') {
        const step = LOGIC_DATA.concept.teachingSteps[activeStep];
        const isItemInStep = step.targetAction.some(ta => ta.itemId === itemId);
        const isSlotInStep = step.targetAction.some(ta => ta.slot === targetIdx) || step.flexible;

        // Update placement
        const newItems = [...placedItems];
        if (sourceIndex !== null) newItems[sourceIndex] = null;
        const existingIdx = newItems.indexOf(itemId);
        if (existingIdx !== -1) newItems[existingIdx] = null;
        newItems[targetIdx] = itemId;
        setPlacedItems(newItems);

        if (!isItemInStep) {
            setFeedback({ 
                type: 'error', 
                msg: "Instruction Mismatch", 
                reason: `This item isn't part of the current instruction (Instruction ${step.clueIndex + 1}). Let's stay focused!` 
            });
            setStepStatus('wrong');
            return;
        }

        if (!isSlotInStep) {
            setFeedback({ 
                type: 'error', 
                msg: "Logical Error", 
                reason: `This trolley belongs here, but in a different slot. Review the comparative chain logic!` 
            });
            setStepStatus('wrong');
            return;
        }

        let stepSuccess = false;
        if (step.flexible) {
            const flexibleSlots = [4, 5];
            const flexibleItems = ['pulses', 'rice'];
            stepSuccess = flexibleSlots.every(s => flexibleItems.includes(newItems[s]));
        } else {
            stepSuccess = step.targetAction.every(ta => newItems[ta.slot] === ta.itemId);
        }

        if (stepSuccess) {
          setStepStatus('correct');
          setFeedback({ type: 'success', msg: "Deduction Valid!", reason: "" });
        }
      } else {
        const newItems = [...placedItems];
        if (sourceIndex !== null) newItems[sourceIndex] = null;
        const existingIdx = newItems.indexOf(itemId);
        if (existingIdx !== -1) newItems[existingIdx] = null;
        newItems[targetIdx] = itemId;
        setPlacedItems(newItems);
        setPracticeStatus('idle');
      }
    } else if (sourceIndex !== null) {
      const newItems = [...placedItems];
      newItems[sourceIndex] = null;
      setPlacedItems(newItems);
    }
  };

  const nextStep = () => {
    const step = LOGIC_DATA.concept.teachingSteps[activeStep];
    if (!completedClues.includes(step.clueIndex)) {
      setCompletedClues(prev => [...prev, step.clueIndex]);
    }

    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      const nextIdx = activeStep + 1;
      setActiveStep(nextIdx);
      
      const nextStepData = LOGIC_DATA.concept.teachingSteps[nextIdx];
      const isAlreadyCorrect = nextStepData.targetAction.every(ta => placedItems[ta.slot] === ta.itemId);
      
      if (isAlreadyCorrect) {
          setStepStatus('correct');
          setFeedback({ type: 'success', msg: "Logic Already Satisfied!", reason: "" });
      } else {
          setStepStatus('idle');
          setFeedback({ type: null, msg: "", reason: "" });
      }
    } else {
      setIsSolved(true);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      const prevIdx = activeStep - 1;
      const currentStep = LOGIC_DATA.concept.teachingSteps[activeStep];
      const prevStepData = LOGIC_DATA.concept.teachingSteps[prevIdx];
      
      const newItems = [...placedItems];
      currentStep.targetAction.forEach(ta => {
          const idx = newItems.indexOf(ta.itemId);
          if (idx !== -1) newItems[idx] = null;
      });
      prevStepData.targetAction.forEach(ta => {
          const idx = newItems.indexOf(ta.itemId);
          if (idx !== -1) newItems[idx] = null;
      });
      setPlacedItems(newItems);

      const otherStepsUsingClue = LOGIC_DATA.concept.teachingSteps
        .slice(0, prevIdx)
        .some(s => s.clueIndex === prevStepData.clueIndex);
      
      if (!otherStepsUsingClue) {
        setCompletedClues(prev => prev.filter(c => c !== prevStepData.clueIndex));
      }

      setActiveStep(prevIdx);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
      setIsSolved(false);
    }
  };

  const retryStep = () => {
    const newItems = [...placedItems];
    const validItemsFromPreviousSteps = LOGIC_DATA.concept.teachingSteps
        .slice(0, activeStep)
        .flatMap(step => step.targetAction.map(ta => ta.itemId));

    newItems.forEach((itemId, index) => {
        if (itemId && !validItemsFromPreviousSteps.includes(itemId)) {
            newItems[index] = null;
        }
    });

    setPlacedItems(newItems);
    setStepStatus('idle');
    setFeedback({ type: null, msg: "", reason: "" });
  };

  const retryPractice = () => {
    setPlacedItems(new Array(6).fill(null));
    setPracticeStatus('idle');
  };

  const validatePractice = () => {
    const currentOrder = placedItems.join(',');
    const targetOrder = LOGIC_DATA.practice[practiceIdx].targetOrder.join(',');
    if (currentOrder === targetOrder) {
      setPracticeStatus('correct');
    } else {
      setPracticeStatus('wrong');
    }
  };

  const handleQuizOption = (idx) => {
    if (quizFeedbackMode) return;
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  };

  const currentScen = LOGIC_DATA.practice[practiceIdx];

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col font-sans select-none overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none fixed" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <HeaderSection 
        onBack={() => navigate(-1)}
        title={appMode === 'concept' ? "Logic Academy" : "Practice Laboratory"}
        appMode={appMode}
        setAppMode={handleSetMode}
        onReset={handleReset}
      />

      <main 
        className="flex-1 flex flex-col items-center gap-4 sm:gap-6 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden"
      >
        
        {/* UNIFIED SCROLLABLE WORKSPACE */}
        <div key={appMode} className="w-full flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-6" ref={scrollRef}>
          <motion.div 
            className={`w-full bg-[#2a1a16] p-4 sm:p-8 rounded-[3rem] shadow-2xl border-4 border-black/40 relative transition-all`}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
               <Layers className="text-white/20" size={16}/>
               <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Active Learning Area</span>
            </div>

            <div className="relative bg-[#3e2723] py-8 sm:py-10 px-4 rounded-[2rem] border-4 border-black/20 flex flex-col items-center justify-center shadow-inner mb-8">
              <div className="absolute top-1/2 left-10 right-10 h-1 bg-black/30 -translate-y-1/2 rounded-full z-0" />
              <div className="w-full flex justify-around items-center relative z-10 gap-2">
                {placedItems.map((itemId, i) => {
                  const itemData = itemId ? GOODS.find(f => f.id === itemId) : null;
                  const stepTargets = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.targetAction.map(ta => ta.slot) : [];
                  const isTargetSlot = appMode === 'concept' && stepTargets.includes(i) && conceptStarted;

                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div 
                        ref={el => slotRefs.current[i] = el}
                        className={`w-12 h-12 sm:w-24 sm:h-24 rounded-full border-2 sm:border-4 flex items-center justify-center relative transition-all duration-300 group
                          ${itemData 
                            ? `bg-white border-white shadow-2xl scale-110 
                               ${(practiceStatus === 'wrong') || (appMode === 'concept' && stepStatus === 'wrong' && itemId === placedItems[i]) ? 'ring-4 ring-rose-500 border-rose-500' : ''}
                               ${(stepStatus === 'correct' && (stepTargets.includes(i) || appMode === 'concept')) || (practiceStatus === 'correct') ? 'ring-4 ring-green-500 border-green-500' : ''}` 
                            : `border-dashed ${isTargetSlot ? 'border-yellow-400 bg-black/40 shadow-[0_0_20px_rgba(250,204,21,0.5)]' : 'border-white/10 bg-black/10'}`
                          }
                        `}
                      >
                        {itemData ? (
                          <>
                            <motion.div 
                                layoutId={`item-${itemData.id}-${appMode}`}
                                drag={!isSolved && stepStatus === 'idle' && practiceStatus !== 'correct' && quizStep === -1}
                                dragConstraints={containerRef}
                                dragMomentum={false}
                                dragElastic={0}
                                onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, i)}
                                className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
                            >
                                <span className="text-xl sm:text-4xl drop-shadow-md pointer-events-none">{itemData.icon}</span>
                                <span className="text-[6px] sm:text-[9px] font-black text-white uppercase mt-0.5 tracking-tighter leading-none text-center shadow-black drop-shadow-md">{itemData.name}</span>
                            </motion.div>
                            
                            {/* Deselect Overlay - Solves Issue 1 */}
                            {!isSolved && (practiceStatus === 'idle' || appMode === 'concept') && (
                              <div 
                                className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPlacedItems(p => {
                                        const n = [...p];
                                        n[i] = null;
                                        return n;
                                    });
                                    if(appMode === 'concept') setStepStatus('idle');
                                }}
                              >
                                <div className="bg-rose-600 p-1.5 rounded-full shadow-lg border border-white/20">
                                    <X size={16} strokeWidth={3} className="text-white"/>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <span className={`font-black text-xs sm:text-xl ${isTargetSlot ? 'text-yellow-400 animate-pulse' : 'text-white/10'}`}>{i + 1}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-col gap-4 border-t border-white/5 pt-8">
               <div className="flex items-center justify-center gap-2">
                  <ShoppingCart size={14} className="text-[#a88a6d]" />
                  <span className="text-[#a88a6d] font-black uppercase tracking-[0.4em] text-[9px]">Goods Warehouse</span>
               </div>
               <div className="flex flex-row flex-wrap justify-center items-center gap-3 sm:gap-6 px-4">
                  {(appMode === 'concept' ? GOODS.filter(g => !['bread','eggs','apples','milk','potatoes','soup'].includes(g.id)) : GOODS.filter(g => currentScen.fruits.includes(g.id))).map((item) => {
                    const isPlaced = placedItems.includes(item.id);
                    return (
                      <div key={`anchor-${item.id}`} className="relative w-12 h-12 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
                        {!isPlaced ? (
                            <motion.div
                                layoutId={`item-${item.id}-storage-${appMode}`}
                                drag={!isSolved && (appMode === 'concept' ? conceptStarted : true) && stepStatus === 'idle' && practiceStatus !== 'correct'}
                                dragConstraints={containerRef}
                                dragMomentum={false}
                                dragElastic={0}
                                onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null)}
                                whileHover={{ scale: 1.1 }}
                                className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-0.5 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${item.color} shadow-xl border-white/20 z-10 p-2 cursor-grab active:cursor-grabbing`}
                            >
                                <span className="text-xl sm:text-4xl drop-shadow-md pointer-events-none">{item.icon}</span>
                                <span className="text-[6px] sm:text-[9px] font-black text-white uppercase mt-0.5 tracking-tighter leading-none text-center shadow-black drop-shadow-md">{item.name}</span>
                            </motion.div>
                        ) : (
                            <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-white/5 bg-[#3e2723]/30 opacity-20 grayscale pointer-events-none">
                                <span className="text-xl opacity-30">{item.icon}</span>
                            </div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </div>
          </motion.div>
        </div>

        {/* BOTTOM PANEL */}
        <div className="w-full max-w-7xl bg-[#2a1a16] p-6 sm:p-8 rounded-t-[3.5rem] border-t-8 border-black shadow-2xl relative z-50 flex flex-col gap-6 min-h-[300px] shrink-0">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1 rounded-full bg-[#a88a6d] text-white">
                  <BookOpen size={14} />
                </div>
                <span className="text-[#a88a6d] font-black uppercase tracking-[0.2em] text-[10px]">Rulebook</span>
              </div>
              <div className="bg-black/40 p-5 rounded-3xl border border-white/10 flex flex-col gap-3 h-full max-h-[200px] overflow-y-auto custom-scrollbar">
                 {(appMode === 'concept' ? LOGIC_DATA.concept.clues : currentScen.clues).map((clue, idx) => {
                   const isCompleted = appMode === 'concept' && completedClues.includes(idx);
                   return (
                    <div key={idx} className={`flex items-start gap-3 transition-all duration-500 ${isCompleted ? 'opacity-30' : 'opacity-100'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isCompleted ? 'bg-green-600' : 'bg-yellow-500'}`}>
                          {isCompleted ? <Check size={12} className="text-white"/> : <span className="text-black font-black text-[10px]">{idx + 1}</span>}
                        </div>
                        <p className={`text-white text-xs sm:text-sm font-bold leading-relaxed ${isCompleted ? 'line-through decoration-white/50 text-white/40 italic' : ''}`}>
                          {clue}
                        </p>
                    </div>
                   );
                 })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
               <div className="flex items-center justify-between gap-2 mb-1">
                 <div className="flex items-center gap-2">
                    <Target size={18} className="text-green-400" />
                    <span className="text-[#a88a6d] font-black uppercase tracking-[0.2em] text-[10px]">Mission Control</span>
                 </div>
                 {conceptStarted && appMode === 'concept' && !isSolved && (
                   <button onClick={prevStep} disabled={activeStep === 0} className={`p-2 rounded-full border border-white/10 ${activeStep === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 text-yellow-400'}`}>
                      <ArrowLeft size={16}/>
                   </button>
                 )}
               </div>
               <div className="bg-[#3e2723] p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[200px]">
                  <AnimatePresence mode='wait'>
                    {showExplanation ? (
                      <motion.div key="explanation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                         <div className="text-blue-400 font-black text-[9px] uppercase tracking-[0.4em] mb-1">Deduction Logic</div>
                         <p className="text-white text-xs sm:text-sm font-medium italic text-center px-4 leading-relaxed">{appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep].explanation : currentScen.explanation}</p>
                         <button onClick={() => setShowExplanation(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase transition-colors shadow-lg">Return to Quest</button>
                      </motion.div>
                    ) : appMode === 'concept' ? (
                      !conceptStarted ? (
                        <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center flex flex-col items-center gap-4">
                          <p className="text-white text-base font-bold italic leading-relaxed px-4 text-center">Let's follow the Instructions step-by-step to logically arrange all 6 trolleys.</p>
                          <button onClick={() => setConceptStarted(true)} className="bg-yellow-400 text-black px-12 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                            Start Teaching
                          </button>
                        </motion.div>
                      ) : isSolved ? (
                        <motion.div key="solved" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center flex flex-col items-center gap-4">
                           <Trophy size={60} className="text-yellow-400 animate-bounce" />
                           <h2 className="text-white text-2xl font-black uppercase italic tracking-tighter leading-none">Logic Mastered!</h2>
                           <p className="text-white/60 text-sm font-bold italic">You completed the deduction perfectly. Ready for the solo Challenge?</p>
                           <button onClick={() => setAppMode('practice')} className="bg-green-600 text-white px-10 py-3 rounded-full font-black uppercase text-xs flex items-center gap-2 shadow-xl hover:bg-green-500">Go to Practice <FastForward size={18}/></button>
                        </motion.div>
                      ) : stepStatus === 'idle' ? (
                        <motion.div key="step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full flex flex-col gap-4">
                           <div className="bg-black/30 p-4 rounded-2xl border-l-4 border-yellow-400 shadow-xl">
                              <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{LOGIC_DATA.concept.teachingSteps[activeStep].prompt}</p>
                              <p className="text-white text-base font-bold italic leading-relaxed">{LOGIC_DATA.concept.teachingSteps[activeStep].instruction}</p>
                           </div>
                        </motion.div>
                      ) : stepStatus === 'correct' ? (
                        <motion.div key="correct" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 w-full">
                           <div className="flex items-center gap-3 text-green-400">
                             <CheckCircle2 size={24} />
                             <span className="text-lg font-black uppercase italic tracking-tighter leading-none">Logic Valid!</span>
                           </div>
                           <div className="bg-black/20 p-4 rounded-2xl border border-green-500/10 w-full shadow-inner">
                              <p className="text-[#a88a6d] text-[9px] font-black uppercase tracking-widest mb-1">Logic Insight:</p>
                              <p className="text-white text-sm font-medium italic leading-relaxed">{LOGIC_DATA.concept.teachingSteps[activeStep].explanation}</p>
                           </div>
                           <button onClick={nextStep} className="bg-green-600 text-white px-10 py-2.5 rounded-full font-black uppercase text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-transform">
                             {activeStep < LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Move to Next Clue' : 'Finalize Module'} <ArrowRight size={18}/>
                           </button>
                        </motion.div>
                      ) : (
                        <motion.div key="wrong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 w-full text-center">
                            <div className="p-3 bg-rose-500/20 rounded-full border border-rose-500/40">
                                <AlertCircle size={40} className="text-rose-500" />
                            </div>
                            <h3 className="text-rose-500 text-lg font-black uppercase tracking-tight">{feedback.msg}</h3>
                            <p className="bg-rose-500/10 text-white p-4 rounded-2xl text-xs font-bold italic leading-relaxed border border-rose-500/20 max-w-sm">
                                "{feedback.reason}"
                            </p>
                            <button onClick={retryStep} className="bg-rose-600 text-white px-10 py-3 rounded-full font-black uppercase text-xs flex items-center gap-2 shadow-xl active:translate-y-1 hover:bg-rose-500">
                                <RefreshCw size={16}/> Clear & Re-try
                            </button>
                        </motion.div>
                      )
                    ) : (
                      /* PRACTICE UI */
                      quizStep >= 0 ? (
                        <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-4">
                           {!quizFeedbackMode ? (
                             <div className="flex flex-col gap-4">
                               <div className="flex justify-between items-center px-1">
                                 <div className="text-yellow-400 font-black text-[9px] uppercase tracking-widest">Logic Quest: Q{quizStep + 1}/5</div>
                                 <button onClick={() => setShowExplanation(true)} className="flex items-center gap-1 text-white/40 hover:text-white transition-colors text-[9px] font-bold uppercase underline underline-offset-4 decoration-yellow-400/30"><BookOpen size={10} /> View Logic</button>
                               </div>
                               <p className="text-white text-center font-bold text-sm px-2">{currentScen.quiz[quizStep].q}</p>
                               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                                 {currentScen.quiz[quizStep].options.map((opt, idx) => (
                                   <button key={idx} onClick={() => handleQuizOption(idx)}
                                     className="p-2 sm:p-3 rounded-xl font-black text-[10px] uppercase border-b-4 bg-black/40 text-white border-black hover:bg-black/60 transition-all"
                                   >{opt}</button>
                                 ))}
                               </div>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center gap-4 py-2">
                                <div className={`p-2 rounded-full ${quizSelection === currentScen.quiz[quizStep].correct ? 'bg-green-500' : 'bg-rose-500'} text-white`}>
                                  {quizSelection === currentScen.quiz[quizStep].correct ? <CheckCircle2 size={24}/> : <X size={24}/>}
                                </div>
                                <h3 className={`text-lg font-black uppercase ${quizSelection === currentScen.quiz[quizStep].correct ? 'text-green-400' : 'text-rose-400'}`}>
                                  {quizSelection === currentScen.quiz[quizStep].correct ? 'Logic Validated!' : 'Incorrect Logic'}
                                </h3>
                                <div className="flex gap-3">
                                  {quizSelection === currentScen.quiz[quizStep].correct ? (
                                    <>
                                      <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><BookOpen size={14}/> View Logic</button>
                                      {quizStep < currentScen.quiz.length - 1 ? (
                                        <button onClick={() => { setQuizStep(s => s + 1); setQuizSelection(null); setQuizFeedbackMode(false); }} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1">Next Quest <ChevronRight size={14}/></button>
                                      ) : (
                                        <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1">Complete Lab <Trophy size={14}/></button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); }} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><RotateCcw size={14}/> Re-try</button>
                                      <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><BookOpen size={14}/> View Logic</button>
                                    </>
                                  )}
                                </div>
                             </div>
                           )}
                        </motion.div>
                      ) : (
                        <motion.div key="practice-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-5 w-full">
                           <p className="text-white text-sm sm:text-lg font-black text-center italic leading-tight px-4 uppercase tracking-tighter">"{currentScen.mission}"</p>
                           <div className="flex flex-wrap justify-center gap-3">
                              {practiceStatus === 'idle' ? (
                                <button onClick={validatePractice} disabled={!placedItems.every(f => f !== null)} className={`bg-orange-500 hover:bg-orange-400 text-white px-10 py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl active:translate-y-1 transition-all text-xs ${!placedItems.every(f => f !== null) ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}>
                                  <Play size={18} fill="currentColor" /> Validate Solution
                                </button>
                              ) : practiceStatus === 'correct' ? (
                                <button onClick={() => setQuizStep(0)} className="bg-yellow-500 hover:bg-yellow-400 text-[#2a1a16] px-10 py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl active:translate-y-1 transition-all text-xs">
                                   <HelpCircle size={18} /> Solve Logic Quests
                                </button>
                              ) : (
                                <div className="flex gap-3">
                                   <button onClick={retryPractice} className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl text-xs"><RotateCcw size={16}/> Clear & Re-try</button>
                                   <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl text-xs"><BookOpen size={16}/> View Logic</button>
                                </div>
                              )}
                           </div>
                        </motion.div>
                      )
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <LabContent />
//     </Router>
//   );
// }