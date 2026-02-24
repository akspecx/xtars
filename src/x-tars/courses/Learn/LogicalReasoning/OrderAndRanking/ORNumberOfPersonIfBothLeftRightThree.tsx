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
  { id: 'Leo', name: 'Leo', icon: UserCircle, color: 'from-blue-500 to-blue-700' },
  { id: 'Max', name: 'Max', icon: UserCheck, color: 'from-emerald-500 to-emerald-700' },
  { id: 'Alice', name: 'Alice', icon: UserCircle, color: 'from-pink-500 to-pink-700' },
  { id: 'Bob', name: 'Bob', icon: UserCheck, color: 'from-purple-500 to-purple-700' },
  { id: 'Student', name: 'Student', icon: UserIcon, color: 'from-slate-400 to-slate-600' }
];

const LOGIC_DATA = {
  concept: {
    question: "All 15 students of a class are standing in a straight row facing north. Leo is 4th from the left end, while Max is 5th from the right end. How many students stand strictly between Leo and Max?",
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Setting up the line. We will try to make all the positions first so that we can make them sit well. How many slots do we need?",
        options: ["4 slots", "5 slots", "15 slots"],
        correct: 2,
        feedback: [
          "4 is just Leo's position. We need the whole class!",
          "5 is Max's position from the right. We need slots for everyone.",
          "Correct! Since there are 15 students in total, we must create 15 placeholders so we can visualize the entire row."
        ],
        why: "Building the full length of the queue gives us absolute anchors for both the Left and Right ends.",
        instruction: "Use the '+' button to add exactly 15 placeholders to the row.",
        targetAction: [],
        maxSlots: 15
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Place the first person. Let's make Leo sit first. If he is 4th from the Left end, which slot does he go into?",
        options: ["Slot 3", "Slot 4", "Slot 5"],
        correct: 1,
        feedback: [
          "Slot 3 would make him 3rd from the Left.",
          "Perfect! We count from the Left (start). Slot 4 is the 4th position.",
          "Slot 5 would make him 5th from the Left."
        ],
        why: "Positions measured from the Left perfectly map to our slot numbers (1, 2, 3, 4...).",
        instruction: "Drag Leo from the palette into the 4th slot.",
        targetAction: [
            { itemId: 'Leo', slot: 3 }
        ],
        maxSlots: 15
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Place the second person. Now we must seat Max. He is 5th from the Right end. Where does he go?",
        options: ["Slot 5", "Slot 10", "Slot 11"],
        correct: 2,
        feedback: [
          "Slot 5 is measured from the Left! We have to count backward from the Right end.",
          "Slot 10 would mean there are 5 people behind him (11, 12, 13, 14, 15). That would make him 6th from the right!",
          "Correct! Counting backward: Slot 15 is 1st, 14 is 2nd, 13 is 3rd, 12 is 4th, and Slot 11 is the 5th position from the Right end."
        ],
        why: "We count 5 spots starting from the very end of the line (Right).",
        instruction: "Drag Max from the palette into the 11th slot.",
        targetAction: [
            { itemId: 'Leo', slot: 3 }, 
            { itemId: 'Max', slot: 10 }
        ],
        maxSlots: 15
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Visualizing the Gap. How many students stand strictly between Leo (Slot 4) and Max (Slot 11)?",
        options: ["5 students", "6 students", "7 students"],
        correct: 1,
        feedback: [
          "You missed one! Let's count the empty slots: 5, 6, 7, 8, 9, 10.",
          "Exactly! Visually, there are 6 empty slots between them.",
          "You might have included one of the anchors (Leo or Max) in your count."
        ],
        why: "The 'between' gap excludes both the starting and ending anchors.",
        instruction: "Drag 'Students' from the palette to fill all 6 slots between Leo and Max (Slots 5 through 10).",
        targetAction: [
            { itemId: 'Leo', slot: 3 }, 
            { itemId: 'Max', slot: 10 },
            { itemId: 'Student', slot: 4 }, { itemId: 'Student', slot: 5 }, { itemId: 'Student', slot: 6 },
            { itemId: 'Student', slot: 7 }, { itemId: 'Student', slot: 8 }, { itemId: 'Student', slot: 9 }
        ],
        maxSlots: 15
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Building a Generic Formula. If a line is huge, making slots is too hard! Instead, convert Max to the same 'Left' dimension: (Total - Right + 1). What is Max's Left position?",
        options: ["10th from Left", "11th from Left", "12th from Left"],
        correct: 1,
        feedback: [
          "15 - 5 gives 10, but that's how many people are to his left. His position is one more!",
          "Correct! Max's rank from Left = 15 - 5 + 1 = 11th. Now both Leo (4th) and Max (11th) are measured from the Left.",
          "That would put him at 15 - 5 + 2, which is incorrect."
        ],
        why: "Once both people are measured from the Left, the gap is simply: (Max's Left Rank - Leo's Left Rank) - 1. So, (11 - 4) - 1 = 6.",
        instruction: "The formula matches our visual proof! Gap = 6. Click complete to finish.",
        targetAction: [
            { itemId: 'Leo', slot: 3 }, 
            { itemId: 'Max', slot: 10 },
            { itemId: 'Student', slot: 4 }, { itemId: 'Student', slot: 5 }, { itemId: 'Student', slot: 6 },
            { itemId: 'Student', slot: 7 }, { itemId: 'Student', slot: 8 }, { itemId: 'Student', slot: 9 }
        ],
        maxSlots: 15
      }
    ]
  },
  practice: {
    question: "There are 12 students standing in a straight row facing north. Alice is 3rd from the Left end, and Bob is 4th from the Right end. Build this scenario to answer the questions.",
    quiz: [
      { 
        q: "What is Bob's rank if we count him from the Left end?", 
        options: ["8th", "9th", "10th"], 
        correct: 1, 
        explanation: "Using the formula: Total (12) - Right (4) + 1 = 9th from the Left.",
        simulation: { slots: 12, persons: [{ id: 'Bob', slot: 8 }] }
      },
      { 
        q: "How many students sit STRICTLY between Alice and Bob?", 
        options: ["4 students", "5 students", "6 students"], 
        correct: 1, 
        explanation: "Alice is 3rd (Left). Bob is 9th (Left). Gap = (9 - 3) - 1 = 5 students.",
        simulation: { slots: 12, persons: [{ id: 'Alice', slot: 2 }, { id: 'Bob', slot: 8 }], fillBetween: [3, 7] }
      },
      { 
        q: "If a line has 20 kids, and A is 5th from left while B is 7th from right, how many kids are between them?", 
        options: ["7", "8", "9"], 
        correct: 1, 
        explanation: "A = 5th Left. B = 20 - 7 + 1 = 14th Left. Gap = (14 - 5) - 1 = 8.",
        simulation: { slots: 20, persons: [{ id: 'Alice', slot: 4 }, { id: 'Bob', slot: 13 }], fillBetween: [5, 12] }
      },
      { 
        q: "What is the general rule to convert a Right-end rank to a Left-end rank?", 
        options: ["Total - RightRank", "Total - RightRank - 1", "Total - RightRank + 1"], 
        correct: 2, 
        explanation: "Always subtract the position from the total and add 1.",
        simulation: { slots: 10, persons: [{ id: 'Bob', slot: 7 }] } 
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

  const initialSlots = 0; 
  const [traySlotCount, setTraySlotCount] = useState(initialSlots);
  const [trayItems, setTrayItems] = useState(new Array(40).fill(null));
  
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'practice' ? LOGIC_DATA.practice.quiz : [];

  // Validation logic
  useEffect(() => {
    const row = trayItems;
    
    if (appMode === 'practice' && !quizMode) {
        // Practice target: 12 slots. Alice 3rd (idx 2). Bob 4th right (12-4+1 = 9th left = idx 8).
        const hasAlice = row[2] === 'Alice'; 
        const hasBob = row[8] === 'Bob';
        let isMatch = traySlotCount === 12 && hasAlice && hasBob;
        setStepStatus(isMatch ? 'correct' : 'idle');
        return;
    }

    if (appMode === 'concept' && !quizMode) {
        const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
        if (!stepData?.targetAction) {
            setStepStatus('correct');
            return;
        }
        
        let isMatch = true;
        if (stepData.targetAction.length > 0) {
             isMatch = stepData.targetAction.every(ta => row[ta.slot] === ta.itemId);
        }
        const countMatch = traySlotCount === stepData.maxSlots;
        setStepStatus((isMatch && countMatch) ? 'correct' : 'idle');
    }
  }, [trayItems, traySlotCount, activeStep, appMode, quizMode]);

  // Quiz Simulation effect 
  useEffect(() => {
      if (quizMode && appMode === 'practice' && currentQuizSet[quizStep]?.simulation) {
          const sim = currentQuizSet[quizStep].simulation;
          setTraySlotCount(sim.slots);
          const newItems = new Array(40).fill(null);
          
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
  }, [quizMode, quizStep, currentQuizSet, appMode]);

  function handleReset(overrideMode = appMode) {
    setTraySlotCount(0);
    setTrayItems(new Array(40).fill(null));
    setActiveStep(0);
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
        setFeedback({ type: null, msg: "", reason: "" });
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
      setStepStatus('correct');
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setLessonFinished(true);
    }
  }

  function validatePractice() {
    if (stepStatus === 'correct') { 
        setQuizMode(true);
        setFeedback({ type: 'success', msg: "Construction Verified!", reason: "You accurately mapped the two dimensions." });
    } else {
      setFeedback({ type: 'error', msg: "Arrangement Error", reason: "Create exactly 12 slots. Place Alice 3rd from the Left. Place Bob 4th from the Right end!" });
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
          setFeedback({ type: null, msg: "", reason: "" });
      }
    }
  }

  const showSlots = traySlotCount > 0;
  
  // Decide which people array to use based on mode
  const activePeopleList = appMode === 'concept' 
    ? ALL_PEOPLE.filter(p => ['Leo', 'Max', 'Student'].includes(p.id))
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
                    <span className="text-yellow-400 font-black uppercase text-[10px]"><ArrowLeftCircle size={14}/> Left (1)</span>
                    <span className="text-yellow-400 font-black uppercase text-[10px]">Right ({traySlotCount || 'N'}) <ArrowRightCircle size={14}/></span>
                  </div>
                  
                  {/* Forced Single Line with Horizontal Scroll. Padding Y prevents red X from being trimmed */}
                  <div className="w-full flex flex-nowrap justify-start sm:justify-center items-center gap-1.5 sm:gap-2 px-4 py-3 transition-all overflow-x-auto custom-scrollbar">
                    {showSlots && Array.from({ length: traySlotCount }).map((_, i) => {
                      const itemId = trayItems[i];
                      const person = ALL_PEOPLE.find(p => p.id === itemId);

                      return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                          {/* Ideal sizing to fit 15 elements on desktop without scroll */}
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
                          // Show minimal visual reinforcement in practice mode
                          <div className="flex flex-col gap-2 h-full opacity-60 items-center justify-center text-center">
                                <Compass size={40} className="text-yellow-400 mb-2" />
                                <p className="text-white font-medium text-[14px] tracking-tight px-4 leading-snug">
                                    Analyze the problem statement above to complete the layout in the Construction Zone.
                                </p>
                          </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full relative overflow-hidden">
                <AnimatePresence mode='wait'>
                    
                    {quizFeedbackMode && (
                        <motion.div key="practice-quiz-fb" className="flex flex-col items-center justify-center gap-4 text-center h-full">
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
                        <motion.div key="practice-quiz-wait" className="flex flex-col items-center justify-center gap-4 h-full opacity-50">
                            <MousePointer2 size={48} className="text-indigo-400 animate-bounce" />
                            <p className="text-white text-[14px] font-medium tracking-tight">Select your answer from the options on the left!</p>
                        </motion.div>
                    )}

                    {lessonFinished && (
                      <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-4">
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
                      <motion.div key={`concept-sel-${activeStep}`} className="flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                           <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest flex items-center gap-2"><Compass size={14}/> Interactive Lesson • Step {activeStep + 1}/{LOGIC_DATA.concept.teachingSteps.length}</span>
                           {activeStep > 0 && <button onClick={prevStep} className="text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={16}/></button>}
                        </div>
                        
                        <p className="text-white font-bold text-[16px] leading-tight tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                        
                        {stepStatus !== 'correct' ? (
                            <>
                                <div className="flex flex-wrap gap-2 justify-center py-3">
                                  {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => (
                                    <button key={i} onClick={() => handleSelectionQuiz(i)} className="bg-black/40 border border-white/10 px-5 py-3 rounded-xl text-white font-black uppercase text-[12px] hover:bg-black/60 hover:scale-105 active:scale-95 transition-all shadow-md">{opt}</button>
                                  ))}
                                </div>
                                {feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                {feedback.type === 'success' && <p className="text-green-400 text-[13px] font-bold italic text-center leading-tight">"{feedback.reason}" Now follow the instruction below!</p>}
                                
                                {(feedback.type === 'success' || LOGIC_DATA.concept.teachingSteps[activeStep].options.length === 0) && (
                                    <div className="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 rounded-r-xl mt-2 flex gap-3 items-center">
                                        <Info size={24} className="text-yellow-400 shrink-0" />
                                        <div className="text-white text-[14px] font-bold tracking-tight leading-snug">{LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col gap-4 mt-2">
                               <div className="bg-green-400/10 border border-green-400/30 p-4 rounded-xl flex items-start gap-3">
                                   <CheckCircleIcon />
                                   <div>
                                       <p className="text-green-400 font-black text-[12px] uppercase tracking-widest mb-1">Step Completed</p>
                                       <p className="text-white text-[14px] font-medium leading-snug">"{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"</p>
                                   </div>
                               </div>
                               <button onClick={nextStep} className={`w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all bg-green-600 text-white shadow-xl hover:scale-105 active:scale-95 mt-auto`}>
                                   {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                               </button>
                            </div>
                        )}
                      </motion.div>
                    )}

                    {appMode === 'practice' && !quizMode && !lessonFinished && (
                        <motion.div key="practice-instruction" className="flex flex-col gap-4 h-full items-center justify-center text-center">
                             <div className="bg-green-400/20 p-6 rounded-2xl border border-green-400/50 shadow-lg w-full max-w-lg">
                                <p className="text-white font-bold text-[16px] uppercase tracking-widest">Independent Construction</p>
                                <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                    Read the Logic Problem on the left. Add 12 slots using '+' and drag characters from the palette to match the rules. 
                                </p>
                             </div>
                             <button onClick={validatePractice} disabled={stepStatus !== 'correct'} className={`w-full max-w-lg py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] ${stepStatus === 'correct' ? 'bg-green-600 text-white hover:scale-105 tracking-widest' : 'bg-white/5 text-white/20 cursor-not-allowed' }`}>
                                Verify Construction
                             </button>
                             {feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse tracking-tight text-center mt-2 leading-tight">"{feedback.reason}"</p>}
                        </motion.div>
                    )}

                </AnimatePresence>
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