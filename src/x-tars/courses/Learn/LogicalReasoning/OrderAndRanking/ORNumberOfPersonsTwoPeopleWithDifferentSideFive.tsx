import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
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
  Eye,
  FileText
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
  { id: 'Sindhu', name: 'Sindhu', icon: UserCircle, color: 'from-pink-500 to-pink-700' },
  { id: 'Madhu', name: 'Madhu', icon: UserCheck, color: 'from-emerald-500 to-emerald-700' },
  { id: 'Alice', name: 'Alice', icon: UserCircle, color: 'from-blue-500 to-blue-700' },
  { id: 'Bob', name: 'Bob', icon: UserCheck, color: 'from-purple-500 to-purple-700' },
  { id: 'Student', name: 'Student', icon: UserIcon, color: 'from-slate-400 to-slate-600' }
];

const LOGIC_DATA = {
  concept: {
    question: "In a row, Sindhu is 5th from the front (left) end and Madhu is 4th from the back (right) end. If they interchange their positions, there are 3 persons strictly between them. Total number of persons in the row?",
    clues: [
      { id: 1, step: 0, concept: "Total Slots", explanation: "Total = Left Rank + Gap + Right Rank.", text: "First, we calculate the total slots to build the full line." },
      { id: 2, step: 1, concept: "First Anchor", explanation: "Rank 5 from front means slot 5.", text: "Sindhu sits exactly 5th from the front (left) end." },
      { id: 3, step: 2, concept: "Second Anchor", explanation: "Rank 4 from back means counting 4 spots from the end.", text: "Madhu sits exactly 4th from the back (right) end." },
      { id: 4, step: 3, concept: "The Gap", explanation: "The empty space strictly between Sindhu and Madhu.", text: "Verify that there are exactly 3 persons between them." },
      { id: 5, step: 4, concept: "The Interchange", explanation: "Swapping positions doesn't change the total number of people.", text: "Interchange Sindhu and Madhu to see their new relative positions!" }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Setting up the line. We will make all the positions first so we can make them sit well. Based on the data (5 Left + 3 Gap + 4 Right), how many slots do we need?",
        options: ["9 slots", "12 slots", "15 slots"],
        correct: 1,
        feedback: [
          "That would be too short! Don't forget the gap.",
          "Correct! 5 (Left) + 3 (Gap) + 4 (Right) = 12 total slots. We build the entire row first so we have absolute ends.",
          "That would be too many slots!"
        ],
        why: "To establish a solid grid for both ends, we must build all 12 placeholders first.",
        instruction: "Use the '+' button to add exactly 12 placeholders to the row.",
        targetAction: [],
        maxSlots: 12
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Place the first person. Let's make Sindhu sit first. If she is 5th from the front (left) end, which slot does she go into?",
        options: ["Slot 4", "Slot 5", "Slot 6"],
        correct: 1,
        feedback: [
          "Slot 4 would make her 4th from the front.",
          "Perfect! We count from the Left. Slot 5 is the 5th position.",
          "Slot 6 would make her 6th from the front."
        ],
        why: "Positions measured from the front (Left) perfectly map to our slot numbers (1, 2, 3, 4, 5...).",
        instruction: "Drag Sindhu from the palette into the 5th slot.",
        targetAction: [
            { itemId: 'Sindhu', slot: 4 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Place the second person. Now we make Madhu sit. She is 4th from the back (right) end. Where does she go in our 12-slot row?",
        options: ["Slot 8", "Slot 9", "Slot 10"],
        correct: 1,
        feedback: [
          "Slot 8 would mean there are 4 people behind her (9, 10, 11, 12). That makes her 5th from the back!",
          "Correct! Counting backward: Slot 12 is 1st, 11 is 2nd, 10 is 3rd, and Slot 9 is the 4th position from the back end.",
          "Slot 10 would make her 3rd from the back end."
        ],
        why: "We count 4 spots starting from the very end of the line (Right). 12, 11, 10, 9.",
        instruction: "Drag Madhu from the palette into the 9th slot.",
        targetAction: [
            { itemId: 'Sindhu', slot: 4 }, 
            { itemId: 'Madhu', slot: 8 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Visualizing the Gap. Look at the empty slots strictly between Sindhu (Slot 5) and Madhu (Slot 9). How many people fit in this gap?",
        options: ["2 persons", "3 persons", "4 persons"],
        correct: 1,
        feedback: [
          "Count carefully! Slots 6, 7, and 8 are empty.",
          "Exactly! There are exactly 3 empty slots strictly between them. This proves our initial math.",
          "You might have counted one of the anchors."
        ],
        why: "The 'between' gap perfectly fits the 3 students mentioned in the problem.",
        instruction: "Drag 'Students' from the palette to fill the 3 slots between Sindhu and Madhu (Slots 6, 7, 8).",
        targetAction: [
            { itemId: 'Sindhu', slot: 4 }, 
            { itemId: 'Madhu', slot: 8 },
            { itemId: 'Student', slot: 5 }, { itemId: 'Student', slot: 6 }, { itemId: 'Student', slot: 7 }
        ],
        maxSlots: 12
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: The Interchange. The problem says 'If they interchange...'. If Sindhu and Madhu swap seats, Madhu is now at Sindhu's old seat (5th from Left). How many people are strictly to the right of Madhu now?",
        options: ["6 people", "7 people", "8 people"],
        correct: 1,
        feedback: [
          "If there were 6 people, the total row would be 5 (Madhu) + 6 = 11.",
          "Correct! The total row is 12. Madhu is at position 5. So 12 - 5 = 7 people are strictly to her right!",
          "8 people to her right would mean the row has 13 slots."
        ],
        why: "Interchanging positions is just a trick to test relative ranks! The total number of people never changes. Total = 12.",
        instruction: "Drag Sindhu and Madhu to physically SWAP their positions. Fill all remaining slots with 'Students' to complete the row!",
        targetAction: [
            { itemId: 'Madhu', slot: 4 }, 
            { itemId: 'Sindhu', slot: 8 },
            { itemId: 'Student', slot: 0 }, { itemId: 'Student', slot: 1 }, { itemId: 'Student', slot: 2 }, { itemId: 'Student', slot: 3 },
            { itemId: 'Student', slot: 5 }, { itemId: 'Student', slot: 6 }, { itemId: 'Student', slot: 7 },
            { itemId: 'Student', slot: 9 }, { itemId: 'Student', slot: 10 }, { itemId: 'Student', slot: 11 }
        ],
        maxSlots: 12
      }
    ],
    postQuiz: [
      { 
        q: "What is the correct formula to find the Total when given a Left Rank, a Right Rank, and the Gap between them?", 
        options: ["Left + Right", "Left + Right + Gap", "Left + Right - Gap"], 
        correct: 1, 
        explanation: "Simply add the Left sequence, the Right sequence, and the gap in the middle."
      },
      { 
        q: "Does interchanging positions affect the total number of people in the row?", 
        options: ["Yes", "No", "Only if the gap is odd"], 
        correct: 1, 
        explanation: "Swapping individuals changes who sits where, but the physical length of the line remains exactly the same."
      }
    ]
  },
  practice: {
    question: "There are 17 students in a row. Alice is 7th from the Left end. Bob is 6th from the Right end. There are 4 students strictly between them. Build this scenario, then answer the questions.",
    clues: [
      { id: 1, step: 0, concept: "Total Slots", explanation: "Row length = 17.", text: "The queue must have exactly 17 slots." },
      { id: 2, step: 0, concept: "Left Anchor", explanation: "Alice goes to Slot 7.", text: "Alice is 7th from the Left end." },
      { id: 3, step: 0, concept: "Right Anchor", explanation: "Bob goes to Slot 12 (17 - 6 + 1).", text: "Bob is 6th from the Right end." }
    ],
    quiz: [
      { 
        q: "What is the total number of persons in the row?", 
        options: ["16", "17", "18"], 
        correct: 1, 
        explanation: "Total = 7 (Left) + 4 (Gap) + 6 (Right) = 17.",
        simulation: { slots: 17, persons: [{ id: 'Alice', slot: 6 }, { id: 'Bob', slot: 11 }] }
      },
      { 
        q: "If Alice and Bob interchange their positions, what is Alice's NEW rank from the Left end?", 
        options: ["12th", "13th", "14th"], 
        correct: 0, 
        explanation: "Alice takes Bob's old seat (6th from right). 17 - 6 + 1 = 12th from Left.",
        simulation: { slots: 17, persons: [{ id: 'Bob', slot: 6 }, { id: 'Alice', slot: 11 }] }
      },
      { 
        q: "After the interchange, how many people sit strictly to the left of Bob?", 
        options: ["5", "6", "7"], 
        correct: 1, 
        explanation: "Bob takes Alice's old seat (7th from left). Rank 7 means 6 people are to his left.",
        simulation: { slots: 17, persons: [{ id: 'Bob', slot: 6 }, { id: 'Alice', slot: 11 }] }
      },
      { 
        q: "Does the number of people strictly between them change after the interchange?", 
        options: ["Yes, it becomes 0", "Yes, it becomes 6", "No, it remains 4"], 
        correct: 2, 
        explanation: "Swapping anchors doesn't change the physical gap between those two specific seats.",
        simulation: { slots: 17, persons: [{ id: 'Bob', slot: 6 }, { id: 'Alice', slot: 11 }], fillBetween: [7, 10] }
      }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
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
        // Practice target: 17 slots. Alice 7th (idx 6). Bob 6th right (17-6+1 = 12th left = idx 11).
        const hasAlice = row[6] === 'Alice'; 
        const hasBob = row[11] === 'Bob';
        let studentsFilled = true;
        for (let i = 0; i < 17; i++) {
            if (i !== 6 && i !== 11 && row[i] !== 'Student') {
                studentsFilled = false;
            }
        }
        setStepStatus((traySlotCount === 17 && hasAlice && hasBob && studentsFilled) ? 'correct' : 'idle');
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
          
          // Fill all with students first if generic
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
    const limit = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.maxSlots : 20;
    if (traySlotCount < limit) {
        setTraySlotCount(prev => prev + 1);
    } else {
        setFeedback({ 
            type: 'error', 
            msg: "Limit Reached!", 
            reason: appMode === 'concept' ? `For this step, we only need exactly ${limit} slots.` : `You don't need more than ${limit} slots.`
        });
    }
  }

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    setConceptSelectedOption(idx);
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
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
      setStepStatus('correct');
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
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
        setFeedback({ type: 'success', msg: "Construction Verified!", reason: "You accurately mapped the two dimensions." });
    } else {
      setFeedback({ type: 'error', msg: "Arrangement Error", reason: "Create exactly 17 slots. Place Alice 7th from Left. Place Bob 6th from Right end. Fill the rest with Students." });
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished) return;
    
    // STRICT CONSTRAINT: Only allow dragging from the fixed repository palette.
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
      // Sticky drop radius configured for smaller items
      if (dist < 60 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });
    
    if (targetSlotIdx !== -1 && targetSlotIdx < traySlotCount) {
      const newItems = [...trayItems];
      // Automatically unseat unique characters if they are dropped into a new slot
      if (itemId !== 'Student') {
          const oldIdx = newItems.indexOf(itemId);
          if (oldIdx !== -1) newItems[oldIdx] = null;
      }
      // Allow drop into empty slot or overwrite a 'Student'
      if (newItems[targetSlotIdx] === null || newItems[targetSlotIdx] === 'Student' || itemId !== 'Student') {
          newItems[targetSlotIdx] = itemId;
          setTrayItems(newItems);
      }
    }
  }

  const showSlots = traySlotCount > 0;
  
  // Decide which people array to use based on mode
  const activePeopleList = appMode === 'concept' 
    ? ALL_PEOPLE.filter(p => ['Sindhu', 'Madhu', 'Student'].includes(p.id))
    : ALL_PEOPLE.filter(p => ['Alice', 'Bob', 'Student'].includes(p.id));

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Overlapping Ranks Lab" : "Gap Calculation Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-4 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Row Construction & Palette */}
        <div className="w-full flex-1 flex flex-col gap-2 min-h-[350px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between">
            
            <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                    {quizMode ? <><Eye size={14} /> Question Simulation</> : <><MoveHorizontal size={14} /> Construction Zone</>}
                </div>
                
                {/* Horizontal Scrolling Row - Slots slightly reduced and padded to prevent trim */}
                <div className="relative bg-[#3e2723] pt-10 pb-6 rounded-[1.5rem] border-2 border-yellow-500/30 shadow-inner flex flex-col items-center justify-center min-h-[160px] overflow-hidden">
                  <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                    <span className="text-yellow-400 font-black uppercase text-[10px]"><ArrowLeftCircle size={14}/> Left End (1)</span>
                    <span className="text-yellow-400 font-black uppercase text-[10px]">Right End ({traySlotCount || 'N'}) <ArrowRightCircle size={14}/></span>
                  </div>
                  
                  {/* Forced Single Line with Horizontal Scroll. Padding Y prevents red X from being trimmed */}
                  <div className="w-full flex flex-nowrap justify-start lg:justify-center items-center gap-1.5 sm:gap-2 px-4 py-4 transition-all overflow-x-auto custom-scrollbar">
                    {showSlots && Array.from({ length: traySlotCount }).map((_, i) => {
                      const itemId = trayItems[i];
                      const person = ALL_PEOPLE.find(p => p.id === itemId);

                      return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                          {/* Ideal sizing to fit elements on desktop without scroll: w-10 h-10 to w-[3.25rem] */}
                          <div data-slot-idx={i} className={`w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] rounded-xl border-2 flex items-center justify-center relative transition-all ${person ? 'bg-white border-white scale-105 shadow-lg' : 'border-dashed border-white/20 bg-black/20'}`}>
                            {person && (
                              <div className={`w-full h-full rounded-[0.5rem] bg-gradient-to-br ${person.color} flex flex-col items-center justify-center text-white shadow-inner p-1 animate-in zoom-in-50`}>
                                <person.icon size={16} />
                                <span className="font-black text-[7px] sm:text-[8px] uppercase leading-none mt-1 truncate w-full text-center">{person.id}</span>
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
                        <button onClick={handleAddSlot} className="w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] flex-shrink-0 rounded-xl border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 flex items-center justify-center text-yellow-500/40 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all active:scale-95">
                            <PlusCircle size={24} strokeWidth={2.5} />
                        </button>
                    )}
                  </div>
                  {(!showSlots || traySlotCount === 0) && (
                    <p className="text-white/40 font-bold uppercase tracking-widest text-[12px] animate-pulse mt-4">Row is empty. Use '+' to add placeholders.</p>
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
                        <div key={`repo-${person.id}`} className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-xl bg-black/20 shadow-inner">
                            <div className="absolute inset-0 opacity-20 scale-75 flex items-center justify-center pointer-events-none">
                                <person.icon size={18} className="text-white" />
                            </div>
                            <motion.div 
                              drag={!quizMode && !lessonFinished} 
                              dragSnapToOrigin={true}
                              onDragEnd={(e, info) => handleDragEnd(e, info, person.id, null)}
                              whileHover={{ scale: 1.15 }} 
                              className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-black/10 bg-gradient-to-br ${person.color} shadow-xl border-white/20 z-[60] p-1 cursor-grab active:cursor-grabbing`}
                            >
                              <person.icon size={18} className="text-white" />
                              <span className="text-[8px] sm:text-[9px] font-black text-white leading-none uppercase mt-1 truncate w-full text-center">{person.id}</span>
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
          {/* Wood overlay specific to Div 2 */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3 sm:gap-4 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Dynamic Quiz */}
            <div className="flex flex-col gap-3 h-full">
                
                {/* The Logic Problem Box */}
                <div className="bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white">
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
                                <p className="text-yellow-400 text-[12px] italic leading-tight font-bold">"{currentScenData.clues?.find(c => c.concept === activeConceptInfo)?.explanation}"</p>
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full relative overflow-hidden">
                {/* Scroll container decoupled from animation wrapper to prevent layout jumps */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {quizFeedbackMode && (
                            <motion.div key="practice-quiz-fb" className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-[150px]">
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
                            <motion.div key="practice-quiz-wait" className="flex flex-col items-center justify-center gap-4 h-full opacity-50 min-h-[150px]">
                                <MousePointer2 size={48} className="text-indigo-400 animate-bounce" />
                                <p className="text-white text-[14px] font-medium tracking-tight">Select your answer from the options on the left!</p>
                            </motion.div>
                        )}

                        {lessonFinished && (
                          <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[200px]">
                             <Trophy size={60} className="text-yellow-400 animate-bounce" />
                             <h3 className="text-white text-[18px] font-black uppercase tracking-widest">Laboratory Mastered!</h3>
                             <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered the gap calculation and rank conversion formulas!</p>
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
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="flex flex-col gap-3 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                               <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest flex items-center gap-2"><Compass size={14}/> Interactive Lesson • Step {activeStep + 1}/{LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[16px] leading-tight tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {stepStatus !== 'correct' ? (
                                <>
                                    <div className="flex flex-wrap gap-2 justify-center py-3">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isSelected = conceptSelectedOption === i;
                                          const isCorrect = isSelected && feedback.type === 'success';
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                          else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                          else if (feedback.type === 'success') btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                          return (
                                            <button 
                                                key={i} 
                                                disabled={feedback.type === 'success'}
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 py-3 rounded-xl font-black uppercase text-[12px] transition-all shadow-md border ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    {feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                    
                                    {feedback.type === 'success' && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-2">
                                            <p className="text-green-400 text-[14px] font-bold italic text-center leading-tight">"{feedback.reason}"</p>
                                            
                                            <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 rounded-r-xl flex gap-3 items-start">
                                                <Info size={24} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <div className="text-white text-[14px] font-bold tracking-tight leading-snug">{LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}</div>
                                            </div>

                                            <button 
                                                disabled={true} 
                                                className={`w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all mt-2 bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10`}
                                            >
                                                Complete Action in Div 1
                                            </button>
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-2">
                                   <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-xl flex items-start gap-3">
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
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[150px]">
                             <div className="bg-green-400/20 p-6 rounded-xl border border-green-400/50 shadow-lg">
                                <p className="text-white font-bold text-[16px] uppercase tracking-widest">All Rules Proved!</p>
                                <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                    You've successfully mapped 'rank' to 'count' for both Left and Right ends. Time for the final reasoning quiz!
                                </p>
                             </div>
                             <button onClick={() => setQuizMode(true)} className={`w-full py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Start Reasoning Quiz
                             </button>
                          </motion.div>
                        )}

                        {appMode === 'practice' && !quizMode && !lessonFinished && (
                            <motion.div key="practice-instruction" className="flex flex-col gap-4 h-full items-center justify-center text-center min-h-[150px]">
                                 <div className="bg-green-400/20 p-6 rounded-2xl border border-green-400/50 shadow-lg w-full max-w-lg">
                                    <p className="text-white font-bold text-[16px] uppercase tracking-widest">Independent Construction</p>
                                    <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                        Read the Logic Problem on the left. Add 17 slots using '+' and drag characters from the palette to match the rules. 
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }