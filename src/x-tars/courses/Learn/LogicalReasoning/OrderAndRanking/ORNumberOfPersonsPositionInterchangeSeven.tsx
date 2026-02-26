import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  HelpCircle,
  Zap,
  ArrowUpRight,
  MoveHorizontal,
  Compass,
  PlusCircle,
  Info,
  MousePointer2,
  Eye,
  FileText,
  ArrowRightCircle,
  ArrowLeftCircle,
  UserCircle,
  UserCheck,
  User as UserIcon,
  ShoppingCart,
  ArrowLeft
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
  { id: 'Leo', name: 'Leo', icon: UserCircle, color: 'from-blue-500 to-blue-700' },
  { id: 'Max', name: 'Max', icon: UserCheck, color: 'from-emerald-500 to-emerald-700' },
  { id: 'Alice', name: 'Alice', icon: UserCircle, color: 'from-pink-500 to-pink-700' },
  { id: 'Bob', name: 'Bob', icon: UserCheck, color: 'from-indigo-500 to-indigo-700' },
  { id: 'Student', name: 'Student', icon: UserIcon, color: 'from-slate-400 to-slate-600' }
];

const LOGIC_DATA = {
  concept: {
    question: "In a row of students, Leo ranks 10th from the Left and Max ranks 5th from the Right. If they interchange their positions, Leo's position becomes 8th from the Left. How many total students are in the row?",
    clues: [
      { id: 1, step: 0, concept: "The Golden Seat", explanation: "When Leo swaps to Max's seat, he becomes 8th from Left. This means Max's original seat IS 8th from Left.", text: "Leo becomes 8th from Left after swapping." },
      { id: 2, step: 1, concept: "Dual Ranks", explanation: "We now know TWO things about Max's original seat: 8th from Left AND 5th from Right.", text: "Max's seat has absolute ranks from both ends." },
      { id: 3, step: 2, concept: "Place Original", explanation: "Let's place Leo where he originally started before any swapping happened.", text: "Leo originally ranked 10th from the Left." },
      { id: 4, step: 3, concept: "The Interchange", explanation: "Physically swap their positions to verify the logic!", text: "If they interchange, Leo's position becomes 8th." },
      { id: 5, step: 4, concept: "Total Formula", explanation: "Total = (Left Rank + Right Rank) - 1 for the SAME seat.", text: "Verify the total length matches the mathematical formula." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: The Golden Seat. After interchanging, Leo sits in Max's old seat. If Leo is now 8th from the Left, what was Max's ORIGINAL rank from the Left?",
        options: ["5th", "8th", "10th"],
        correct: 1,
        feedback: [
          "5th is his rank from the Right!",
          "Correct! Because Leo took Max's seat, Max's original seat must be exactly 8th from the Left.",
          "10th is Leo's original seat."
        ],
        why: "An interchange means swapping seats. Leo's new rank = Max's old rank.",
        instruction: "Click '+ Add Slot' to create exactly 8 slots. Drag Max to his original seat (Slot 8).",
        targetAction: [
            { itemId: 'Max', slot: 7 }
        ],
        maxSlots: 8
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Completing the Row. We know Max's original seat is 8th from the Left. The problem also says Max is 5th from the Right. How many more slots must we add behind him to make him 5th from the Right?",
        options: ["4 slots", "5 slots", "6 slots"],
        correct: 0,
        feedback: [
          "Exactly! To be 5th from the end, you need exactly 4 people behind you. 8 + 4 = 12 Total.",
          "Adding 5 slots would make him 6th from the Right.",
          "Adding 6 slots would make him 7th from the Right."
        ],
        why: "Rank 5 from the right requires exactly 4 trailing slots behind the anchor.",
        instruction: "Add 4 more slots (Total 12). Max should stay in Slot 8.",
        targetAction: [
            { itemId: 'Max', slot: 7 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Placing Leo. Now let's place Leo in his ORIGINAL seat. The problem states Leo started 10th from the Left. Where does he sit in our 12-slot row?",
        options: ["Slot 8", "Slot 10", "Slot 12"],
        correct: 1,
        feedback: [
          "Slot 8 is Max's seat!",
          "Correct! We count from the Left. Leo's original seat is exactly Slot 10.",
          "Slot 12 would make him 12th from the Left."
        ],
        why: "Absolute ranks from the Left directly map to slot numbers.",
        instruction: "Drag Leo from the palette and place him in Slot 10.",
        targetAction: [
            { itemId: 'Max', slot: 7 },
            { itemId: 'Leo', slot: 9 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: The Swap. Let's verify the problem! If Leo and Max physically interchange positions, into which slot does Leo move?",
        options: ["Slot 5", "Slot 8", "Slot 10"],
        correct: 1,
        feedback: [
          "Slot 5 has nothing to do with their seats.",
          "Yes! They swap. Leo moves into Slot 8, and Max moves into Slot 10.",
          "Slot 10 is where he started."
        ],
        why: "Swapping means they trade specific physical seats.",
        instruction: "Physically swap them! Drag Leo to Slot 8, and Drag Max to Slot 10.",
        targetAction: [
            { itemId: 'Leo', slot: 7 },
            { itemId: 'Max', slot: 9 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Mathematical Proof. Our physical row has 12 slots. Let's test the formula on the 'Golden Seat' (Slot 8). It is 8th from Left and 5th from Right. Does Total = (Left + Right) - 1 work?",
        options: ["Yes, 8+5-1 = 12", "No, 8+5 = 13", "Yes, 10+5-1 = 14"],
        correct: 0,
        feedback: [
          "Perfect! The math identically matches our physical model. We found the total without needing to draw it!",
          "You forgot to subtract 1 to remove the double-counted seat.",
          "10 and 5 refer to different seats. The formula only works on a single specific seat!"
        ],
        why: "To find Total, take ONE specific seat where you know both ranks, add them, and subtract 1.",
        instruction: "Proof Complete! Fill all empty slots with 'Students' to finish the lesson.",
        targetAction: [
            { itemId: 'Leo', slot: 7 },
            { itemId: 'Max', slot: 9 },
            { itemId: 'Student', slot: 0 }, { itemId: 'Student', slot: 1 }, { itemId: 'Student', slot: 2 }, 
            { itemId: 'Student', slot: 3 }, { itemId: 'Student', slot: 4 }, { itemId: 'Student', slot: 5 }, 
            { itemId: 'Student', slot: 6 }, { itemId: 'Student', slot: 8 }, { itemId: 'Student', slot: 10 }, { itemId: 'Student', slot: 11 }
        ],
        maxSlots: 12
      }
    ],
    postQuiz: [
      { 
        q: "In interchange problems, how do you find the Total number of students?", 
        options: ["Add their original ranks.", "Add a person's NEW rank from one end to the OTHER person's original rank from the opposite end, then subtract 1.", "Subtract their ranks."], 
        correct: 1, 
        explanation: "The 'Golden Seat' gives you both ranks. New Left Rank + Old Right Rank - 1 = Total."
      },
      { 
        q: "If A is 10th from Left and B is 15th from Right. They swap, and A becomes 20th from Left. What is the Total?", 
        options: ["34", "35", "36"], 
        correct: 0, 
        explanation: "Total = A's New Left (20) + B's Old Right (15) - 1 = 34."
      }
    ]
  },
  practice: {
    question: "Alice is 8th from the Left and Bob is 6th from the Right. After interchanging, Alice becomes 13th from the Left. Build the ORIGINAL line (before the swap) and find the total.",
    clues: [
      { id: 1, step: 0, concept: "Bob's Original Seat", explanation: "Alice moved to Bob's seat, becoming 13th from Left. Bob's seat is 13th from Left.", text: "Identify Bob's Left Rank." },
      { id: 2, step: 0, concept: "Total Calculation", explanation: "Bob's Seat = 13 Left + 6 Right - 1 = 18.", text: "Determine the Total queue length to be exactly 18." },
      { id: 3, step: 0, concept: "Original Placement", explanation: "A=Slot 8, B=Slot 13.", text: "Place Alice and Bob in their exact ORIGINAL positions." }
    ],
    quiz: [
      { 
        q: "What was Bob's ORIGINAL rank from the Left?", 
        options: ["6th", "8th", "13th"], 
        correct: 2, 
        explanation: "Alice took his seat and became 13th from the Left. Therefore, his original seat is 13th from the Left.",
        simulation: { slots: 18, persons: [{ id: 'Bob', slot: 12 }] }
      },
      { 
        q: "What is the total number of students in the row?", 
        options: ["17", "18", "19"], 
        correct: 1, 
        explanation: "Bob's Seat: 13 (Left) + 6 (Right) - 1 = 18.",
        simulation: { slots: 18, persons: [{ id: 'Alice', slot: 7 }, { id: 'Bob', slot: 12 }] }
      },
      { 
        q: "AFTER interchanging, what will be Bob's NEW rank from the Right?", 
        options: ["10th", "11th", "12th"], 
        correct: 1, 
        explanation: "Bob moves to Alice's original seat (8th from Left). Total is 18. New Right Rank = 18 - 8 + 1 = 11th.",
        simulation: { slots: 18, persons: [{ id: 'Bob', slot: 7 }, { id: 'Alice', slot: 12 }] }
      },
      { 
        q: "How many people are strictly between them?", 
        options: ["3", "4", "5"], 
        correct: 1, 
        explanation: "Alice is at 8, Bob is at 13. The slots between them are 9, 10, 11, 12. That's exactly 4 people.",
        simulation: { slots: 18, persons: [{ id: 'Alice', slot: 7 }, { id: 'Bob', slot: 12 }], fillBetween: [8, 11] }
      }
    ]
  }
};

function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  const [stepStatus, setStepStatus] = useState('idle');

  const initialSlots = 0; 
  const [traySlotCount, setTraySlotCount] = useState(initialSlots);
  const [trayItems, setTrayItems] = useState(new Array(40).fill(null));
  
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'practice' ? LOGIC_DATA.practice.quiz : LOGIC_DATA.concept.postQuiz;

  // Validation logic
  useEffect(() => {
    const row = trayItems;
    
    if (appMode === 'practice' && !quizMode) {
        // Practice target: 18 slots. Alice 8th (idx 7). Bob 13th (idx 12).
        const hasAlice = row[7] === 'Alice'; 
        const hasBob = row[12] === 'Bob';
        let studentsFilled = true;
        for (let i = 0; i < 18; i++) {
            if (i !== 7 && i !== 12 && row[i] !== 'Student') {
                studentsFilled = false;
            }
        }
        setStepStatus((traySlotCount === 18 && hasAlice && hasBob && studentsFilled) ? 'correct' : 'idle');
        return;
    }

    if (appMode === 'concept' && !quizMode) {
        const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
        if (!stepData) {
            setStepStatus('correct');
            return;
        }
        
        let isMatch = true;
        if (stepData.targetAction && stepData.targetAction.length > 0) {
             isMatch = stepData.targetAction.every(ta => row[ta.slot] === ta.itemId);
        } else if (stepData.targetAction && stepData.targetAction.length === 0) {
             isMatch = true;
        }

        const countMatch = traySlotCount === stepData.maxSlots;
        setStepStatus((isMatch && countMatch) ? 'correct' : 'idle');
    }
  }, [trayItems, traySlotCount, activeStep, appMode, quizMode]);

  // Quiz Simulation effect 
  useEffect(() => {
      if (quizMode && currentQuizSet[quizStep]?.simulation) {
          const sim = currentQuizSet[quizStep].simulation;
          setTraySlotCount(sim.slots);
          const newItems = new Array(40).fill(null);
          
          for (let i=0; i<sim.slots; i++) newItems[i] = 'Student';

          if (sim.persons) {
              sim.persons.forEach(p => newItems[p.slot] = p.id);
          }
          if (sim.fillBetween) {
              for (let i = sim.fillBetween[0]; i <= sim.fillBetween[1]; i++) {
                  newItems[i] = 'Student'; 
              }
          }
          setTrayItems(newItems);
      }
  }, [quizMode, quizStep, currentQuizSet]);

  function handleReset(overrideMode = appMode) {
    setTraySlotCount(0);
    setTrayItems(new Array(40).fill(null));
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
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
    handleReset(mode);
  }

  function handleAddSlot() {
    const limit = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.maxSlots : 40;
    
    if (limit === 0 && appMode === 'concept') {
        setFeedback({ 
            type: 'error', 
            msg: "Wait!", 
            reason: "We need to answer the logic question before we build the line."
        });
        return;
    }

    if (traySlotCount < limit) {
        setTraySlotCount(prev => prev + 1);
        setActionError("");
    } else {
        setActionError(appMode === 'concept' ? `For this step, we only need exactly ${limit} slots.` : `You don't need more than ${limit} slots.`);
    }
  }

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    setConceptSelectedOption(idx);
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
      setActionError("");
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function prevStep() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setActiveConceptInfo(null);
    } else {
      setConceptPhase('finalCheck');
    }
  }

  function validatePractice() {
    if (stepStatus === 'correct') { 
        setQuizMode(true);
        setFeedback({ type: 'success', msg: "Construction Verified!", reason: "You accurately mapped the ORIGINAL scenario!" });
    } else {
      setFeedback({ type: 'error', msg: "Arrangement Error", reason: "Create 18 slots. Place Alice at Slot 8. Bob at Slot 13. Fill the rest with Students." });
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished) return;
    
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
      if (dist < 60 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });
    
    if (targetSlotIdx !== -1 && targetSlotIdx < traySlotCount) {
      const newItems = [...trayItems];
      if (itemId !== 'Student') {
          const oldIdx = newItems.indexOf(itemId);
          if (oldIdx !== -1) newItems[oldIdx] = null;
      }
      if (newItems[targetSlotIdx] === null || newItems[targetSlotIdx] === 'Student' || itemId !== 'Student') {
          newItems[targetSlotIdx] = itemId;
          setTrayItems(newItems);
          setActionError("");
      }
    }
  }

  const showSlots = traySlotCount > 0;
  
  const activePeopleList = appMode === 'concept' 
    ? ALL_PEOPLE.filter(p => ['Leo', 'Max', 'Student'].includes(p.id))
    : ALL_PEOPLE.filter(p => ['Alice', 'Bob', 'Student'].includes(p.id));

  const isQuizPassed = feedback.type === 'success';
  const isBoardValid = stepStatus === 'correct';

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Position Interchange Lab" : "Swap Calculation Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-4 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Row Construction & Palette */}
        <div className="w-full flex-1 flex flex-col gap-2 min-h-[350px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between">
            
            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                    {quizMode ? <><Eye size={14} /> Question Simulation</> : <><MoveHorizontal size={14} /> Construction Zone</>}
                </div>
                
                {/* Horizontal Scrolling Row */}
                <div className="relative bg-[#3e2723] pt-10 pb-6 rounded-[1.5rem] border-2 border-yellow-500/30 shadow-inner flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                  <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1"><ArrowLeftCircle size={14}/> Left End (1)</span>
                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1">Right End ({traySlotCount || 'N'}) <ArrowRightCircle size={14}/></span>
                  </div>
                  
                  {/* Forced Single Line with Horizontal Scroll */}
                  <div className="w-full flex flex-nowrap justify-start lg:justify-center items-center gap-1 sm:gap-2 px-4 py-4 transition-all overflow-x-auto custom-scrollbar">
                    
                    {showSlots && Array.from({ length: traySlotCount }).map((_, i) => {
                      const itemId = trayItems[i];
                      const person = ALL_PEOPLE.find(p => p.id === itemId);

                      return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div data-slot-idx={i} className={`w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] lg:w-16 lg:h-16 rounded-xl border-2 flex items-center justify-center relative transition-all ${person ? 'bg-white border-white scale-105 shadow-lg' : 'border-dashed border-white/20 bg-black/20'}`}>
                            {person && (
                              <div className={`w-full h-full rounded-[0.5rem] bg-gradient-to-br ${person.color} flex flex-col items-center justify-center text-white shadow-inner p-1 animate-in zoom-in-50`}>
                                <person.icon size={16} className="lg:scale-125" />
                                <span className="font-black text-[7px] sm:text-[8px] lg:text-[10px] uppercase leading-none mt-1 truncate w-full text-center">{person.id}</span>
                              </div>
                            )}
                            {!person && <span className="text-white/10 font-black text-[12px]">{i + 1}</span>}
                            {person && !quizMode && !lessonFinished && (
                                <button onClick={() => { const n = [...trayItems]; n[i] = null; setTrayItems(n); }} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg z-20 hover:scale-110 active:scale-95 transition-all"><X size={12} strokeWidth={3}/></button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {!quizMode && !lessonFinished && (
                        <button onClick={() => handleAddSlot()} className="w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] lg:w-16 lg:h-16 flex-shrink-0 rounded-xl border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 flex flex-col items-center justify-center text-yellow-500/60 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all active:scale-95 shadow-md">
                            <PlusCircle size={24} strokeWidth={2.5} className="lg:scale-125" />
                            <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">Add Slot</span>
                        </button>
                    )}
                  </div>
                  {(!showSlots || traySlotCount === 0) && (
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[12px] animate-pulse mt-4">Row is empty. Follow instructions to begin.</p>
                  )}
                </div>
            </div>
            
            {/* Fixed Repository Palette */}
            {!quizMode && !lessonFinished && (
                <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4 mt-2">
                  <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none text-white text-[12px]"><ShoppingCart size={14} /> Infinite Palette</div>
                  <div className="flex flex-wrap justify-center items-center gap-4 px-2 sm:px-8 pb-2">
                    {activePeopleList.map(person => {
                       return (
                        <div key={`repo-${person.id}`} className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-xl bg-black/20 shadow-inner">
                            <div className="absolute inset-0 opacity-20 scale-75 flex items-center justify-center pointer-events-none">
                                <person.icon size={18} className="text-white lg:scale-125" />
                            </div>
                            <motion.div 
                              drag={!quizMode && !lessonFinished} 
                              dragSnapToOrigin={true}
                              onDragEnd={(e, info) => handleDragEnd(e, info, person.id, null)}
                              whileHover={{ scale: 1.15 }} 
                              className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-black/10 bg-gradient-to-br ${person.color} shadow-xl border-white/20 z-[60] p-1 cursor-grab active:cursor-grabbing`}
                            >
                              <person.icon size={18} className="text-white lg:scale-125" />
                              <span className="text-[8px] sm:text-[9px] lg:text-[10px] font-black text-white leading-none uppercase mt-1 truncate w-full text-center">{person.id}</span>
                            </motion.div>
                        </div>
                       );
                    })}
                  </div>
                </div>
            )}
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels (2-Column Layout with Wooden Theme) */}
        <div className="w-full bg-[#3e2723] p-4 sm:p-5 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3 sm:gap-4 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Dynamic Quiz */}
            <div className="flex flex-col gap-3 h-full">
                
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white ${appMode === 'practice' && !quizMode ? 'flex-1' : ''}`}>
                    <div className="bg-yellow-400 p-2 rounded-xl text-black shrink-0 shadow-lg mt-1">
                        <FileText size={24} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-yellow-400 font-black uppercase text-[12px] tracking-widest leading-none mb-1.5">The Logic Problem</span>
                        <p className="text-[14px] font-medium leading-snug tracking-tight">
                            {appMode === 'concept' ? LOGIC_DATA.concept.question : LOGIC_DATA.practice.question}
                        </p>
                    </div>
                </div>

                {/* Reasoning Quiz / Concept Flow Box */}
                {!(appMode === 'practice' && !quizMode) && (
                    <div className="flex-1 flex flex-col gap-2 p-5 bg-[#2a1a16]/95 rounded-[1.5rem] border-2 border-black/50 overflow-hidden shadow-lg">
                        <div className="flex items-center gap-2 opacity-50 mb-2">
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
                                        return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3 rounded-xl font-black uppercase transition-all text-[13px] border-2 text-left ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                              </div>
                            ) : (
                              (currentScenData.clues || []).filter(clue => appMode === 'practice' || clue.step === activeStep).map((clue) => {
                                const showFull = lessonFinished || appMode === 'practice' || conceptPhase === 'selecting';
                                
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1 transition-all ${showFull ? 'opacity-100' : 'opacity-100'}`}>
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
                                    <p className="text-yellow-400 text-[12px] italic leading-tight font-bold">"{currentScenData.clues?.find(c => c.concept === activeConceptInfo)?.explanation}"</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[300px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {quizFeedbackMode && (
                            <motion.div key="practice-quiz-fb" className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-[250px]">
                                <p className="text-yellow-400 text-[15px] italic leading-tight tracking-tight font-medium text-center px-4">"{currentQuizSet[quizStep]?.explanation}"</p>
                                <button onClick={() => {
                                    if (quizSelection === currentQuizSet[quizStep].correct) {
                                        if (quizStep < currentQuizSet.length - 1) { 
                                            setQuizStep(quizStep + 1); setQuizSelection(null); setQuizFeedbackMode(false); 
                                        } else { 
                                            setLessonFinished(true); setQuizMode(false); 
                                        }
                                    } else { setQuizFeedbackMode(false); setQuizSelection(null); }
                                }} className="bg-indigo-500 text-white px-10 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 transition-all mt-4">
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? 'Finish Laboratory' : 'Next Discovery') : 'Try Again'}
                                </button>
                            </motion.div>
                        )}

                        {quizMode && !quizFeedbackMode && (
                            <motion.div key="practice-quiz-wait" className="flex flex-col items-center justify-center gap-4 h-full opacity-50 min-h-[250px]">
                                <MousePointer2 size={48} className="text-indigo-400 animate-bounce" />
                                <p className="text-white text-[14px] font-medium tracking-tight">Select your answer from the options on the left!</p>
                            </motion.div>
                        )}

                        {lessonFinished && (
                          <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[250px]">
                             <Trophy size={60} className="text-yellow-400 animate-bounce" />
                             <h3 className="text-white text-[18px] font-black uppercase tracking-widest">Laboratory Mastered!</h3>
                             <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered interchange mechanics and total calculations!</p>
                             <div className="flex flex-col gap-3 w-full max-w-sm mt-4 px-6">
                                <button onClick={() => handleReset(appMode)} className="bg-amber-600 text-white py-3 rounded-full font-black uppercase shadow-xl tracking-widest text-[12px]">Retry Module</button>
                                {appMode === 'concept' ? (
                                    <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white py-4 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] flex items-center justify-center gap-2">Start Practice Lab <ArrowUpRight size={18}/></button>
                                ) : (
                                    <button className="bg-green-600 text-white py-4 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] flex items-center justify-center gap-2">Finish Session <ArrowUpRight size={18}/></button>
                                )}
                             </div>
                          </motion.div>
                        )}

                        {conceptPhase === 'selecting' && appMode === 'concept' && !lessonFinished && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col gap-3 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                               <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest flex items-center gap-2"><Compass size={14}/> Interactive Lesson • Step {activeStep + 1}/{LOGIC_DATA.concept.teachingSteps.length}</span>
                               {activeStep > 0 && <button onClick={prevStep} className="text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={16}/></button>}
                            </div>
                            
                            <p className="text-white font-bold text-[16px] leading-tight tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {stepStatus !== 'correct' ? (
                                <>
                                    <div className="flex flex-wrap gap-2 justify-center py-3">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isSelected = conceptSelectedOption === i;
                                          const isCorrect = isSelected && isQuizPassed;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                          else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                          else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                          return (
                                            <button 
                                                key={i} 
                                                disabled={isQuizPassed}
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 py-3 rounded-xl font-black uppercase text-[12px] transition-all shadow-md border ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    
                                    {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                    
                                    {isQuizPassed && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-2">
                                            
                                            <div className="flex flex-col rounded-xl overflow-hidden border-2 border-green-500/50 shadow-lg">
                                                <div className="bg-green-500/10 px-4 py-3 border-b border-green-500/20">
                                                    <p className="text-green-400 text-[13px] font-medium leading-tight">
                                                        <strong className="uppercase tracking-widest text-[10px] block mb-1 text-green-500">Logic Confirmed</strong>
                                                        "{feedback.reason}"
                                                    </p>
                                                </div>
                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction && (
                                                    <div className="bg-yellow-400/10 p-4 flex gap-3 items-start">
                                                        <MousePointer2 size={24} className="text-yellow-400 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-yellow-400 font-black uppercase text-[10px] tracking-widest mb-1">Required Action</span>
                                                            <span className="text-white text-[14px] font-bold tracking-tight leading-snug">
                                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {isBoardValid ? (
                                                <button onClick={nextStep} className="w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95 mt-2">
                                                    {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                                </button>
                                            ) : (
                                                <button disabled={true} className="w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all mt-2 bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                    Complete Action in Construction Zone
                                                </button>
                                            )}
                                            {actionError && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight mt-1">"{actionError}"</p>}
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-2 h-full">
                                   
                                   {/* Keep the options visible but disabled */}
                                   <div className="flex flex-wrap gap-2 justify-center py-3">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isCorrect = conceptSelectedOption === i;
                                          let btnClass = isCorrect ? "bg-green-600 border-green-400 text-white shadow-lg scale-105" : "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";
                                          return (
                                            <button key={i} disabled={true} className={`px-5 py-3 rounded-xl font-black uppercase text-[12px] transition-all shadow-md border ${btnClass}`}>
                                                {opt}
                                            </button>
                                          );
                                      })}
                                   </div>

                                   <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-xl flex items-start gap-3 mt-auto">
                                       <CheckCircleIcon />
                                       <div>
                                           <p className="text-green-400 font-black text-[12px] uppercase tracking-widest mb-1">Step Completed</p>
                                           <p className="text-white text-[14px] font-medium leading-snug">"{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"</p>
                                       </div>
                                   </div>
                                   
                                   <button onClick={nextStep} className={`w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95`}>
                                       {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                   </button>
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 rounded-xl border border-green-400/50 shadow-lg">
                                <p className="text-white font-bold text-[16px] uppercase tracking-widest">All Rules Proved!</p>
                                <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                    You've successfully mapped the complex interchange to find the exact total. Time for the final reasoning quiz!
                                </p>
                             </div>
                             <button onClick={() => setQuizMode(true)} className={`w-full py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Start Reasoning Quiz
                             </button>
                          </motion.div>
                        )}

                        {appMode === 'practice' && !quizMode && !lessonFinished && (
                            <motion.div key="practice-instruction" className="flex flex-col gap-4 h-full items-center justify-center text-center min-h-[250px]">
                                 <div className="bg-green-400/20 p-6 rounded-2xl border border-green-400/50 shadow-lg w-full max-w-lg">
                                    <p className="text-white font-bold text-[16px] uppercase tracking-widest">Independent Construction</p>
                                    <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                        Read the Logic Problem on the left. Construct the ORIGINAL scenario (before any swapping happens) using the Add buttons and the palette!
                                    </p>
                                 </div>
                                 <button onClick={validatePractice} disabled={stepStatus !== 'correct'} className={`w-full max-w-lg py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] ${stepStatus === 'correct' ? 'bg-green-600 text-white hover:scale-105 tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-white/5 text-white/20 cursor-not-allowed border-2 border-white/10' }`}>
                                    Verify Construction
                                 </button>
                                 {feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse tracking-tight text-center mt-2 leading-tight">"{feedback.reason}"</p>}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// Helper icon component
function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }