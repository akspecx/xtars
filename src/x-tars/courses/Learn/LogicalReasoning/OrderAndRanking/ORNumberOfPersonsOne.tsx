import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Target,
  X,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  Plus,
  Trash2,
  UserCircle,
  UserCheck,
  UserMinus,
  UserPlus,
  User,
  ShoppingCart,
  XCircle,
  ArrowRightCircle,
  ArrowLeftCircle,
  Timer,
  Check,
  Square,
  CheckSquare,
  HelpCircle,
  Zap,
  Activity,
  Gauge,
  Wind,
  User as UserIcon,
  GlassWater,
  ArrowUpRight,
  MoveHorizontal,
  Compass,
  Users,
  PlusCircle,
  Info,
  MousePointer2,
  Eye
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
            <ChevronLeft size={12} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[16px] truncate max-w-[150px] sm:max-w-none leading-none">
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
}

// ==========================================
// DATA & CONFIG
// ==========================================
const ALL_PEOPLE = [
  { id: 'Sonakshi', name: 'Sonakshi', icon: UserCircle, color: 'from-pink-600 to-pink-800' },
  { id: 'Rahul', name: 'Rahul', icon: UserCheck, color: 'from-blue-600 to-blue-800' },
  { id: 'Student', name: 'Student', icon: UserIcon, color: 'from-slate-400 to-slate-600' }
];

const LOGIC_DATA = {
  concept: {
    clues: [
      { id: 1, step: 0, concept: "nth from Left", explanation: "Rank N from left means (N-1) people must sit before you.", text: "Concept 1: Sonakshi is sitting 4th from the Left end." },
      { id: 2, step: 1, concept: "n people on Left", explanation: "If there are N people on your left, your rank is (N+1).", text: "Concept 2: Rahul has exactly 5 people sitting to his Left." },
      { id: 3, step: 2, concept: "nth from Right", explanation: "Rank N from right means (N-1) people must sit behind you.", text: "Concept 3: Sonakshi is sitting 3rd from the Right end." },
      { id: 4, step: 3, concept: "n people on Right", explanation: "If there are N people on your right, your rank from the right end is (N+1).", text: "Concept 4: Rahul has exactly 4 people sitting to his Right." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: 'nth from Left'. If Sonakshi is 4th from the Left end, how many people must be sitting ahead of her?",
        options: ["3 people", "4 people", "5 people"],
        correct: 0,
        feedback: [
          "Perfect! To be the 4th person, you need exactly 3 individuals sitting ahead of you. Rank = Count + 1.",
          "If 4 people were ahead, she would be the 5th person! Try again.",
          "That would make her the 6th person. 5 ahead + 1 (herself) = 6."
        ],
        why: "To be 4th from left, you need a count of 3 students before you.",
        instruction: "Add 4 slots using '+'. Drag Sonakshi to slot 4, and fill slots 1-3 with 'Students'.",
        targetAction: [
            { itemId: 'Sonakshi', slot: 3 },
            { itemId: 'Student', slot: 0 }, { itemId: 'Student', slot: 1 }, { itemId: 'Student', slot: 2 }
        ],
        maxSlots: 4
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: 'n people on Left'. If Rahul has exactly 5 people sitting to his Left, what is his rank from the left end?",
        options: ["5th", "6th", "7th"],
        correct: 1,
        feedback: [
          "If he were 5th, there would only be 4 people ahead of him.",
          "Correct! If there are 5 people to his left, he is the very next person, which makes him the 6th person in line.",
          "That would mean he has 6 people sitting ahead of him."
        ],
        why: "Rank is the Count of people to your left plus yourself. 5 + 1 = 6th rank.",
        instruction: "Add 6 slots using '+'. Place Rahul in the 6th slot, and fill slots 1-5 with 'Students'.",
        targetAction: [
            { itemId: 'Rahul', slot: 5 }, 
            { itemId: 'Student', slot: 0 }, { itemId: 'Student', slot: 1 }, 
            { itemId: 'Student', slot: 2 }, { itemId: 'Student', slot: 3 }, { itemId: 'Student', slot: 4 }
        ],
        maxSlots: 6
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: 'nth from Right'. If Sonakshi is 3rd from the Right end, how many people sit to her Right side?",
        options: ["2 people", "3 people", "4 people"],
        correct: 0,
        feedback: [
          "Correct! To be 3rd from the right end, you only need 2 people sitting behind you. (End = 1st, Person behind = 2nd... 2 people behind = 3rd rank).",
          "If there were 3 people to her right, she would be 4th from the right.",
          "That would make her 5th from the end."
        ],
        why: "To be 3rd from the Right, exactly 2 people must sit between you and the end of the line.",
        instruction: "Add 3 slots using '+'. To show the right end, place Sonakshi in the 1st slot, and fill the 2 slots to her right with 'Students'.",
        targetAction: [
            { itemId: 'Sonakshi', slot: 0 }, 
            { itemId: 'Student', slot: 1 }, { itemId: 'Student', slot: 2 }
        ],
        maxSlots: 3
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: 'n people on Right'. If Rahul has exactly 4 people sitting to his Right, what is his rank from the right end?",
        options: ["3rd", "4th", "5th"],
        correct: 2,
        feedback: [
          "If he were 3rd, he would only have 2 people behind him.",
          "If he were 4th, he would only have 3 people behind him.",
          "Exactly! Having 4 people to your right means you are the 5th person counting backward from that end."
        ],
        why: "Your rank from the right is the count of people to your right plus yourself. 4 + 1 = 5th rank.",
        instruction: "Add 5 slots using '+'. Place Rahul in the 1st slot, and fill the 4 slots to his right with 'Students'.",
        targetAction: [
            { itemId: 'Rahul', slot: 0 }, 
            { itemId: 'Student', slot: 1 }, { itemId: 'Student', slot: 2 },
            { itemId: 'Student', slot: 3 }, { itemId: 'Student', slot: 4 }
        ],
        maxSlots: 5
      }
    ],
    postQuiz: [
      { 
        q: "If you are 10th from the left, how many people are to your left?", 
        options: ["9 people", "10 people", "11 people"], 
        correct: 0, 
        explanation: "Rank 10 means exactly 9 people come before you.",
        simulation: { slots: 10, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 9 }] }
      },
      { 
        q: "If there are 6 people sitting on your right, what is your rank from the right end?", 
        options: ["5th", "6th", "7th"], 
        correct: 2, 
        explanation: "6 people behind you + yourself makes you the 7th person from the end.",
        simulation: { slots: 7, fill: 'Student', persons: [{ id: 'Rahul', slot: 0 }] }
      },
      { 
        q: "If 4 people sit to your left, what is your rank from the left?", 
        options: ["3rd", "4th", "5th"], 
        correct: 2, 
        explanation: "4 people ahead of you means you are the next person, which is 5th.",
        simulation: { slots: 5, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 4 }] }
      },
      { 
        q: "If you are 2nd from the right end, how many people are sitting to your right?", 
        options: ["1 person", "2 people", "3 people"], 
        correct: 0, 
        explanation: "To be 2nd from the end, there can only be 1 person behind you.",
        simulation: { slots: 2, fill: 'Student', persons: [{ id: 'Rahul', slot: 0 }] }
      }
    ]
  },
  practice: {
    title: "Positioning Challenge",
    mission: "Test your understanding by building a single queue using all the rules simultaneously.",
    clues: [
      { id: 1, step: 0, concept: "Total Slots", explanation: "The row has a fixed length.", text: "The queue has exactly 9 slots." },
      { id: 2, step: 0, concept: "n people on Left", explanation: "3 on left = 4th from left.", text: "Sonakshi has exactly 3 people sitting to her Left." },
      { id: 3, step: 0, concept: "nth from Right", explanation: "4th from right = 3 people behind.", text: "Rahul is sitting exactly 4th from the Right end." }
    ],
    quiz: [
      { 
        q: "What is Sonakshi's rank from the left end?", 
        options: ["3rd", "4th", "5th"], 
        correct: 1, 
        explanation: "Having 3 people to her left makes her the 4th person.",
        simulation: { slots: 9, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 3 }, { id: 'Rahul', slot: 5 }] }
      },
      { 
        q: "How many people are sitting to Rahul's right?", 
        options: ["2 people", "3 people", "4 people"], 
        correct: 1, 
        explanation: "If he is 4th from the right end, he must have 3 people behind him.",
        simulation: { slots: 9, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 3 }, { id: 'Rahul', slot: 5 }] }
      },
      { 
        q: "How many people are sitting strictly between Sonakshi and Rahul?", 
        options: ["0 people", "1 person", "2 people"], 
        correct: 1, 
        explanation: "Sonakshi is at slot 4. Rahul is at slot 6. The 5th slot is the 1 person between them.",
        simulation: { slots: 9, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 3 }, { id: 'Rahul', slot: 5 }] }
      },
      { 
        q: "If someone is 1st from the right end, how many people are to their right?", 
        options: ["0 people", "1 person", "2 people"], 
        correct: 0, 
        explanation: "Being 1st from the right means you are the very last person. No one is behind you.",
        simulation: { slots: 3, fill: 'Student', persons: [{ id: 'Sonakshi', slot: 2 }] }
      }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');

  const [traySlotCount, setTraySlotCount] = useState(0);
  const [trayItems, setTrayItems] = useState(new Array(30).fill(null));
  
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.quiz;

  // Validation logic
  useEffect(() => {
    const row = trayItems;
    
    if (appMode === 'practice' && !quizMode) {
        // Practice mode target: 9 slots. Sonakshi at index 3 (3 left). Rahul at index 5 (4th from right: 9-4=5).
        const hasSonakshi = row[3] === 'Sonakshi'; 
        const hasRahul = row[5] === 'Rahul';
        let allFilled = true;
        for (let i = 0; i < 9; i++) {
            if (i !== 3 && i !== 5 && row[i] !== 'Student') {
                allFilled = false;
            }
        }
        setStepStatus((traySlotCount === 9 && hasSonakshi && hasRahul && allFilled) ? 'correct' : 'idle');
        return;
    }

    if (conceptPhase !== 'interaction' || quizMode) return;
    
    const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
    if (!stepData?.targetAction || stepData.targetAction.length === 0) {
        setStepStatus('correct');
        return;
    }
    const isMatch = stepData.targetAction.every(ta => row[ta.slot] === ta.itemId);
    const countMatch = traySlotCount === stepData.maxSlots;
    setStepStatus((isMatch && countMatch) ? 'correct' : 'idle');
  }, [trayItems, traySlotCount, activeStep, appMode, conceptPhase, quizMode]);

  // Quiz Simulation effect
  useEffect(() => {
      if (quizMode && currentQuizSet[quizStep]?.simulation) {
          const sim = currentQuizSet[quizStep].simulation;
          setTraySlotCount(sim.slots);
          const newItems = new Array(30).fill(null);
          
          if (sim.fill === 'Student') {
              for(let i=0; i<sim.slots; i++) newItems[i] = 'Student';
          }
          if (sim.persons) {
              sim.persons.forEach(p => newItems[p.slot] = p.id);
          }
          setTrayItems(newItems);
      }
  }, [quizMode, quizStep, currentQuizSet]);

  function handleReset() {
    setTraySlotCount(0);
    setTrayItems(new Array(30).fill(null));
    setActiveStep(0);
    setFeedback({ type: null, msg: "", reason: "" });
    setActiveConceptInfo(null);
    setStepStatus('idle');
    setConceptPhase('selecting');
    setQuizMode(false);
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setLessonFinished(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset();
  }

  function handleAddSlot() {
    const limit = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.maxSlots : 15;
    if (traySlotCount < limit) {
        setTraySlotCount(prev => prev + 1);
        setFeedback({ type: null, msg: "", reason: "" });
    } else {
        setFeedback({ 
            type: 'error', 
            msg: "Target Reached!", 
            reason: `For this step, you only need exactly ${limit} slots to prove the rule.` 
        });
    }
  }

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
      setConceptPhase('interaction');
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function prevStep() {
    if (conceptPhase === 'interaction') {
      setConceptPhase('selecting');
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    } else if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setTraySlotCount(0);
      setTrayItems(new Array(30).fill(null));
      setConceptPhase('interaction');
      setStepStatus('correct');
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setTraySlotCount(0);
      setTrayItems(new Array(30).fill(null));
      setConceptPhase('selecting');
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
      setActiveConceptInfo(null);
    } else {
      setConceptPhase('finalCheck');
    }
  }

  function validatePractice() {
    if (stepStatus === 'correct') { 
        setQuizMode(true);
        setFeedback({ type: 'success', msg: "Sequence Validated!", reason: "You combined all the rules correctly!" });
    } else {
      setFeedback({ type: 'error', msg: "Arrangement Error", reason: "Ensure 9 slots are created. Sonakshi should have 3 students to her left. Rahul should be 4th from the right end." });
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished) return;
    // Only drags originating from the repository are permitted to be placed
    if (sourceIndex !== null && sourceIndex !== undefined) return;

    const dragX = info.point.x;
    const dragY = info.point.y;
    const slots = document.querySelectorAll(`[data-slot-idx]`);
    let targetSlotIdx = -1;
    let minDist = 1000;
    slots.forEach((slot) => {
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + window.scrollX + rect.width / 2;
      const centerY = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      if (dist < 80 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });
    
    if (targetSlotIdx !== -1) {
      const newItems = [...trayItems];
      if (itemId !== 'Student') {
          const oldIdx = newItems.indexOf(itemId);
          if (oldIdx !== -1) newItems[oldIdx] = null;
      }
      if (newItems[targetSlotIdx] === null || newItems[targetSlotIdx] === 'Student' || itemId !== 'Student') {
          newItems[targetSlotIdx] = itemId;
          setTrayItems(newItems);
          setFeedback({ type: null, msg: "", reason: "" });
      }
    }
  }

  const showSlots = (appMode === 'practice') || (conceptPhase !== 'start' && conceptPhase !== 'scanning') || quizMode;

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Basic Positioning Concepts" : "Positioning Integration Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Logic Tray - Div 1 Top */}
        <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                {quizMode ? <><Eye size={14} /> Question Simulation</> : <><MoveHorizontal size={14} /> Concept Build Zone</>}
            </div>
            
            <div className="relative bg-[#3e2723] pt-10 pb-6 px-1 rounded-[1.5rem] border-2 border-yellow-500/30 shadow-inner flex flex-col items-center justify-center min-h-[160px]">
              <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                <span className="text-yellow-400 font-black uppercase text-[10px]"><ArrowLeftCircle size={14}/> Left End</span>
                <span className="text-yellow-400 font-black uppercase text-[10px]">Right End <ArrowRightCircle size={14}/></span>
              </div>
              
              <div className="w-full flex flex-wrap justify-center items-center gap-2 px-2 transition-all">
                {showSlots && Array.from({ length: traySlotCount }).map((_, i) => {
                  const itemId = trayItems[i];
                  const person = ALL_PEOPLE.find(p => p.id === itemId);

                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div data-slot-idx={i} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center relative transition-all ${person ? 'bg-white border-white scale-110 shadow-lg' : 'border-dashed border-white/20 bg-black/20'}`}>
                        {person && (
                          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${person.color} flex flex-col items-center justify-center text-white shadow-lg z-10 p-1 animate-in zoom-in-50`}>
                            <person.icon size={18} />
                            <span className="font-black text-[8px] uppercase leading-none mt-1 truncate w-full text-center">{person.id}</span>
                          </div>
                        )}
                        {!person && <span className="text-white/10 font-black text-[14px]">{i + 1}</span>}
                        {person && !quizMode && !lessonFinished && (
                            <button onClick={() => { const n = [...trayItems]; n[i] = null; setTrayItems(n); }} className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-1 shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"><X size={8}/></button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {!quizMode && !lessonFinished && (conceptPhase === 'interaction' || appMode === 'practice') && (
                    <button onClick={handleAddSlot} className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 flex items-center justify-center text-yellow-500/40 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all active:scale-95">
                        <PlusCircle size={24} strokeWidth={3} />
                    </button>
                )}
              </div>
              {(!showSlots || traySlotCount === 0) && !quizMode && (
                <p className="text-white/40 font-bold uppercase tracking-widest text-[12px] animate-pulse mt-4">Row is empty. Build the proof from the palette.</p>
              )}
            </div>
            
            {/* Fixed Repository Palette */}
            {!quizMode && !lessonFinished && (
                <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
                  <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none text-white text-[12px]"><ShoppingCart size={14} /> Infinite Palette</div>
                  <div className="flex flex-wrap justify-center items-center gap-4 px-2 sm:px-8">
                    {ALL_PEOPLE.map(person => {
                       return (
                        <div key={`repo-${person.id}`} className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-xl bg-black/20 shadow-inner">
                            <div className="absolute inset-0 opacity-20 scale-75 flex items-center justify-center pointer-events-none">
                                <person.icon size={20} className="text-white" />
                            </div>
                            <motion.div 
                              drag={!quizMode && !lessonFinished} 
                              dragSnapToOrigin={true}
                              onDragEnd={(e, info) => handleDragEnd(e, info, person.id, null)}
                              whileHover={{ scale: 1.15 }} 
                              className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-black/10 bg-gradient-to-br ${person.color} shadow-xl border-white/20 z-[60] p-1 cursor-grab active:cursor-grabbing`}
                            >
                              <person.icon size={20} className="text-white" />
                              <span className="text-[9px] font-black text-white leading-none uppercase mt-1 truncate w-full text-center">{person.id}</span>
                            </motion.div>
                        </div>
                       );
                    })}
                  </div>
                </div>
            )}
          </motion.div>
        </div>

        {/* Guidance Panels - Div 2 */}
        <div className="w-full bg-[#2a1a16] p-4 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-1 min-h-[300px] sm:min-h-[400px]">
            
            {/* Div 1: Filtered Clues List */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="flex items-center gap-2 opacity-50">
                {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
                <span className="text-[#a88a6d] font-black uppercase text-[12px]">{quizMode ? "Reasoning Quiz" : "Active Concept"}</span>
              </div>
              <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar text-[14px]">
                {quizMode ? (
                  <div className="flex flex-col gap-3 h-full">
                    <span className="text-yellow-400 font-black text-[12px] uppercase opacity-60 tracking-widest leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
                    <p className="text-white text-[16px] font-bold leading-tight tracking-tight">{currentQuizSet[quizStep]?.q}</p>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                            let style = "bg-black/40 border-transparent text-white";
                            if (quizFeedbackMode) {
                                if (idx === currentQuizSet[quizStep].correct) style = "bg-green-600 border-green-400 text-white shadow-lg";
                                else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                            }
                            return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3 rounded-xl font-black uppercase transition-all text-[13px] border-2 ${style} ${!quizFeedbackMode ? 'hover:bg-black/60' : ''}`}>{opt}</button>);
                        })}
                    </div>
                  </div>
                ) : (
                  currentScenData.clues.filter(clue => appMode === 'practice' || clue.step === activeStep).map((clue, idx) => {
                    const isEnd = lessonFinished;
                    const showFull = isEnd || appMode === 'practice' || conceptPhase === 'interaction' || conceptPhase === 'selecting';
                    
                    return (
                      <div key={clue.id} className={`flex flex-col gap-1 transition-all ${showFull ? 'opacity-100' : 'opacity-30'}`}>
                        <button 
                          onClick={() => setActiveConceptInfo(clue.concept)}
                          className={`w-fit px-3 py-1 rounded-full bg-yellow-400 text-black font-black text-[10px] uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all flex items-center gap-1 shadow-lg`}
                        >
                          <Info size={10} strokeWidth={4} /> Concept: {clue.concept}
                        </button>
                        <p className={`text-white text-[14px] leading-tight tracking-tight font-medium pl-2 border-l-2 border-white/10 mt-1`}>{clue.text}</p>
                      </div>
                    );
                  })
                )}
                {activeConceptInfo && !quizMode && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-400/10 border border-yellow-400/40 p-3 rounded-xl mt-2 flex items-start gap-2">
                        <Zap size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-yellow-400 text-[12px] italic leading-tight font-bold">"{currentScenData.clues.find(c => c.concept === activeConceptInfo)?.explanation}"</p>
                    </motion.div>
                )}
              </div>
            </div>

            {/* Div 2: Teacher Guidance */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden">
              <AnimatePresence mode='wait'>
                
                {conceptPhase === 'selecting' && appMode === 'concept' && (
                  <motion.div key="selecting" className="flex flex-col gap-3 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5 h-full overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between">
                       <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest">Strategic Discussion</span>
                       {activeStep > 0 && <button onClick={prevStep} className="text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={16}/></button>}
                    </div>
                    <p className="text-white font-bold text-[16px] leading-tight tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                    <div className="flex flex-wrap gap-2 justify-center py-2">
                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => (
                        <button key={i} onClick={() => handleSelectionQuiz(i)} className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg text-white font-black uppercase text-[12px] hover:bg-black/60 transition-colors">{opt}</button>
                      ))}
                    </div>
                    {feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                  </motion.div>
                )}

                {conceptPhase === 'interaction' && appMode === 'concept' && (
                  <motion.div key="interaction" className="flex flex-col gap-3 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5 h-full justify-between">
                    <div className="flex flex-col gap-3">
                       <div className="flex items-center justify-between">
                          <span className="text-green-400 font-black text-[12px] uppercase tracking-widest flex items-center gap-1"><Check size={12}/> Strategy Applied</span>
                          <button onClick={prevStep} className="text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={16}/></button>
                       </div>
                       <p className="text-white italic text-[13px] leading-tight tracking-tight px-2 font-medium">"{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"</p>
                       <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-3 rounded-r-lg mt-2">
                         <div className="text-white text-[14px] font-bold tracking-tight leading-snug">{LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}</div>
                       </div>
                    </div>
                    <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`w-full py-3 rounded-full font-black uppercase text-[14px] tracking-widest transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Complete Lesson Step</button>
                  </motion.div>
                )}

                {(conceptPhase === 'finalCheck' || (appMode === 'practice' && !quizMode)) && !quizMode && (
                  <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <div className="bg-green-400/20 p-6 rounded-xl border border-green-400/50 shadow-lg">
                        <p className="text-white font-bold text-[16px] uppercase tracking-widest">{appMode === 'concept' ? 'All Rules Proved!' : 'Position Challenge'}</p>
                        <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                            {appMode === 'concept' 
                                ? "You've successfully mapped 'rank' to 'count' for both Left and Right ends. Time for the final quiz!" 
                                : "Add exactly 9 slots. Place Sonakshi and Rahul exactly as requested. Fill remaining spots with Students."}
                        </p>
                     </div>
                     <button onClick={appMode === 'concept' ? () => setQuizMode(true) : validatePractice} disabled={appMode === 'practice' && stepStatus !== 'correct'} className={`w-full py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] ${ (appMode === 'concept' || stepStatus === 'correct') ? 'bg-green-600 text-white hover:scale-105 tracking-widest' : 'bg-white/5 text-white/20 cursor-not-allowed' }`}>
                        {appMode === 'concept' ? 'Start Reasoning Quiz' : 'Verify Construction'}
                     </button>
                     {feedback.type === 'error' && appMode === 'practice' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse tracking-tight text-center mt-2 leading-tight">"{feedback.reason}"</p>}
                  </motion.div>
                )}

                {quizMode && (
                  <motion.div key="quiz-feedback" className="flex flex-col gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5 h-full">
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
                        {quizFeedbackMode && (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-yellow-400 text-[14px] italic leading-tight tracking-tight px-4 font-medium text-center">"{currentQuizSet[quizStep]?.explanation}"</p>
                                <button onClick={() => {
                                    if (quizSelection === currentQuizSet[quizStep].correct) {
                                        if (quizStep < currentQuizSet.length - 1) { 
                                            setQuizStep(quizStep + 1); setQuizSelection(null); setQuizFeedbackMode(false); 
                                        } else { 
                                            if (appMode === 'concept') handleSetMode('practice');
                                            else { setLessonFinished(true); setQuizMode(false); }
                                        }
                                    } else { setQuizFeedbackMode(false); setQuizSelection(null); }
                                }} className="bg-indigo-500 text-white px-10 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 transition-all">
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? (appMode === 'concept' ? 'Move to Practice' : 'Finish Laboratory') : 'Next Discovery') : 'Try Again'}
                                </button>
                            </div>
                        )}
                        {!quizFeedbackMode && (
                            <div className="flex flex-col items-center gap-4">
                                <MousePointer2 size={48} className="text-indigo-400 animate-bounce" />
                                <p className="text-white text-[14px] font-medium tracking-tight">Select your answer from the options on the left!</p>
                            </div>
                        )}
                    </div>
                  </motion.div>
                )}

                {lessonFinished && (
                  <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <Trophy size={60} className="text-yellow-400 animate-bounce" />
                     <h3 className="text-white text-[18px] font-black uppercase tracking-widest">Laboratory Mastered!</h3>
                     <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered the foundational concepts of nth position vs count!</p>
                     <div className="flex flex-col gap-3 w-full mt-2 px-6">
                        <button onClick={() => handleReset()} className="bg-amber-600 text-white py-3 rounded-full font-black uppercase shadow-xl tracking-widest text-[12px]">Retry Module</button>
                        <button className="bg-green-600 text-white py-4 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] flex items-center justify-center gap-2">Next Module <ArrowUpRight size={18}/></button>
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
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