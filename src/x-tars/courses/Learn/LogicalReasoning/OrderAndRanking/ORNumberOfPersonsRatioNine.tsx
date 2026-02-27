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
  ArrowDownCircle,
  ArrowUpCircle,
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
  { id: 'Rahul', name: 'Rahul', icon: UserCircle, color: 'from-indigo-600 to-indigo-800' },
  { id: 'Sam', name: 'Sam', icon: UserCheck, color: 'from-emerald-600 to-emerald-800' },
  { id: 'Boy', name: 'Boy', icon: UserIcon, color: 'from-blue-400 to-blue-600' },
  { id: 'Girl', name: 'Girl', icon: UserIcon, color: 'from-pink-400 to-pink-600' }
];

const LOGIC_DATA = {
  concept: {
    question: "In a class of 15 students, where girls are twice that of boys, Rahul (a boy) ranked 6th from the top. If there are 4 girls ahead of Rahul, how many boys are after him in rank?",
    clues: [
      { id: 1, step: 0, concept: "Find the Ratio", explanation: "Total = 15. Ratio of Girls to Boys is 2:1.", text: "Calculate the exact number of boys and girls in the class." },
      { id: 2, step: 1, concept: "The Top Group", explanation: "Rank 6 means there are exactly 5 students ahead of him.", text: "Build the line and place Rahul at his exact rank." },
      { id: 3, step: 2, concept: "Breakdown Ahead", explanation: "Out of 5 students ahead, 4 are girls. So 1 must be a boy.", text: "Identify the composition of the group ahead of Rahul." },
      { id: 4, step: 3, concept: "Remaining Boys", explanation: "Total Boys (5) - Boys Ahead (1) - Rahul (1) = Boys After.", text: "Calculate how many boys are left to be placed after Rahul." },
      { id: 5, step: 4, concept: "Verification", explanation: "Count the board to ensure it equals 10 Girls and 5 Boys.", text: "Verify the entire row matches the problem's criteria." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Find the Breakdown. The class has 15 students total. The problem says 'girls are twice that of boys' (a 2:1 ratio). How many Girls and Boys are exactly in this class?",
        options: ["10 Girls, 5 Boys", "5 Girls, 10 Boys", "8 Girls, 7 Boys"],
        correct: 0,
        feedback: [
          "Correct! 15 divided by 3 parts is 5. So, Boys = 5. Girls = 5 x 2 = 10.",
          "That would mean boys are twice that of girls!",
          "That is not a 2:1 ratio."
        ],
        why: "We now know our absolute boundaries: we only have exactly 5 Boys and 10 Girls to place on the board.",
        instruction: "No board action required yet. We just solved the math! Click 'Read Above to Proceed'.",
        validationType: 'none',
        maxSlots: 0
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Placing Rahul. Rahul is 6th from the Top. Let's build the line starting from the Top! How many slots do we initially need to place Rahul at rank 6?",
        options: ["5 slots", "6 slots", "7 slots"],
        correct: 1,
        feedback: [
          "5 slots would make him 5th from the top.",
          "Perfect! We need 6 slots. The first 5 slots represent the students ahead of him, and the 6th slot is for Rahul.",
          "7 slots goes one step too far right now."
        ],
        why: "Rank 6 means exactly 5 students are positioned ahead of the anchor.",
        instruction: "Click '+ Add Slot' exactly 6 times. Drag Rahul to Slot 6.",
        validationType: 'custom',
        maxSlots: 6
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Who is ahead? The problem states there are '4 girls ahead of Rahul'. Since there are 5 total slots ahead of him (Slots 1-5), how many BOYS must be ahead of him?",
        options: ["0 Boys", "1 Boy", "2 Boys"],
        correct: 1,
        feedback: [
          "If there are 0 boys, who is sitting in the 5th empty slot?",
          "Correct! 5 total ahead - 4 girls = exactly 1 boy ahead of Rahul.",
          "That would mean there are 6 people ahead of him!"
        ],
        why: "Simple deduction: Total Ahead (5) minus Girls Ahead (4) equals Boys Ahead (1).",
        instruction: "Drag 4 'Girl's and 1 'Boy' into slots 1 through 5 (in any order).",
        validationType: 'custom',
        maxSlots: 6
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Boys After Rahul. Let's answer the final question! We know there are 5 Boys TOTAL in the class. We see 1 Boy ahead of Rahul, and Rahul himself is a Boy. How many Boys are placed AFTER Rahul?",
        options: ["2 Boys", "3 Boys", "4 Boys"],
        correct: 1,
        feedback: [
          "Count again: 1 (ahead) + 1 (Rahul) + 2 = 4 Boys total. We need 5!",
          "Exactly! 5 Total Boys - 1 Boy ahead - 1 (Rahul) = 3 Boys left to place after him.",
          "That would equal 6 Total Boys in the class."
        ],
        why: "Total Boys (5) = Boys Ahead (1) + Rahul (1) + Boys After (3).",
        instruction: "Logic verified! Click 'Read Above to Proceed' to finish building the class.",
        validationType: 'custom',
        maxSlots: 6
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Final Verification. We know there are 3 Boys after Rahul. Since the total class is 15, we must add 9 more slots to the bottom. To verify our math, complete the class!",
        options: ["Build the rest of the class", "Skip this step"],
        correct: 0,
        feedback: [
          "Let's build it! Add 9 slots, then place 3 Boys and 6 Girls into the bottom section.",
          "We must always verify our logic visually!"
        ],
        why: "The visual proof validates our mathematical deductions step by step.",
        instruction: "Click '+ Add Slot' to make 15 total slots. Drag 3 'Boy's and 6 'Girl's into slots 7-15.",
        validationType: 'custom',
        maxSlots: 15
      }
    ],
    postQuiz: [
      { 
        q: "In a class of 30 where girls are twice boys, how many boys are there?", 
        options: ["10 Boys", "15 Boys", "20 Boys"], 
        correct: 0, 
        explanation: "Ratio 2:1 means 3 parts. 30 / 3 = 10. So 10 Boys and 20 Girls."
      },
      { 
        q: "If Person X (a boy) is 10th from the top, and 6 girls are ahead of him, how many boys are ahead of him?", 
        options: ["3 Boys", "4 Boys", "5 Boys"], 
        correct: 0, 
        explanation: "10th from top = 9 people ahead. 9 total - 6 girls = 3 boys ahead."
      }
    ]
  },
  practice: {
    question: "In a class of 12 students, girls are twice that of boys. Sam (a boy) ranks 7th from the Top. If 5 girls are ahead of Sam, build the scenario to find out how many boys are after him.",
    clues: [
      { id: 1, step: 0, concept: "Total Breakdown", explanation: "12 total = 8 Girls and 4 Boys.", text: "Calculate the exact number of Boys and Girls." },
      { id: 2, step: 0, concept: "Ahead of Sam", explanation: "Sam is 7th, so 6 people are ahead. 5 are Girls, so 1 is a Boy.", text: "Deduce the group composition ahead of Sam." },
      { id: 3, step: 0, concept: "Boys After", explanation: "Total Boys (4) - Ahead (1) - Sam (1) = 2 Boys after.", text: "Calculate how many boys remain." },
      { id: 4, step: 0, concept: "Build the Line", explanation: "Place Sam 7th. Put 5 Girls & 1 Boy ahead of him. Fill the rest.", text: "Construct the exact visual representation!" }
    ],
    quiz: [
      { 
        q: "How many Boys and Girls are in this 12-student class?", 
        options: ["6 Girls, 6 Boys", "8 Girls, 4 Boys", "4 Girls, 8 Boys"], 
        correct: 1, 
        explanation: "The ratio is 2:1. 12 divided by 3 parts is 4. So 4 Boys and 8 Girls."
      },
      { 
        q: "Since Sam is 7th from Top, how many students are strictly ahead of him?", 
        options: ["5 students", "6 students", "7 students"], 
        correct: 1, 
        explanation: "Rank 7 means there are exactly 6 people positioned before him."
      },
      { 
        q: "If 5 girls are ahead of Sam, how many boys are ahead of him?", 
        options: ["0 Boys", "1 Boy", "2 Boys"], 
        correct: 1, 
        explanation: "6 total ahead - 5 girls = 1 Boy."
      },
      { 
        q: "How many boys are ranked AFTER Sam?", 
        options: ["1 Boy", "2 Boys", "3 Boys"], 
        correct: 1, 
        explanation: "Total Boys (4) - Boys Ahead (1) - Sam (1) = 2 Boys left to place after him."
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
        // Practice target: 12 slots. Sam 7th (idx 6). 
        // Ahead (idx 0-5): 5 Girls, 1 Boy.
        // Behind (idx 7-11): 3 Girls, 2 Boys.
        if (traySlotCount === 12 && row[6] === 'Sam') {
            const topGroup = row.slice(0, 6);
            const bottomGroup = row.slice(7, 12);
            
            const topGirls = topGroup.filter(x => x === 'Girl').length;
            const topBoys = topGroup.filter(x => x === 'Boy').length;
            const bottomGirls = bottomGroup.filter(x => x === 'Girl').length;
            const bottomBoys = bottomGroup.filter(x => x === 'Boy').length;

            if (topGirls === 5 && topBoys === 1 && bottomBoys === 2 && bottomGirls === 3) {
                setStepStatus('correct');
                return;
            }
        }
        setStepStatus('idle');
        return;
    }

    if (appMode === 'concept' && !quizMode) {
        const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
        if (!stepData) {
            setStepStatus('correct');
            return;
        }
        
        let isMatch = false;
        const countMatch = traySlotCount === stepData.maxSlots;

        // Custom Flexible Validation Logic for Concept Mode
        if (activeStep === 0) {
            isMatch = true; // Math only step
        } else if (activeStep === 1) {
            isMatch = row[5] === 'Rahul';
        } else if (activeStep === 2) {
            const topGroup = row.slice(0, 5);
            const topGirls = topGroup.filter(x => x === 'Girl').length;
            const topBoys = topGroup.filter(x => x === 'Boy').length;
            isMatch = row[5] === 'Rahul' && topGirls === 4 && topBoys === 1;
        } else if (activeStep === 3) {
            const topGroup = row.slice(0, 5);
            const topGirls = topGroup.filter(x => x === 'Girl').length;
            const topBoys = topGroup.filter(x => x === 'Boy').length;
            isMatch = row[5] === 'Rahul' && topGirls === 4 && topBoys === 1; // Same as step 2, just math verification
        } else if (activeStep === 4) {
            const topGroup = row.slice(0, 5);
            const bottomGroup = row.slice(6, 15);
            
            const topGirls = topGroup.filter(x => x === 'Girl').length;
            const topBoys = topGroup.filter(x => x === 'Boy').length;
            const bottomGirls = bottomGroup.filter(x => x === 'Girl').length;
            const bottomBoys = bottomGroup.filter(x => x === 'Boy').length;

            isMatch = row[5] === 'Rahul' && topGirls === 4 && topBoys === 1 && bottomBoys === 3 && bottomGirls === 6;
        }

        setStepStatus((isMatch && countMatch) ? 'correct' : 'idle');
    }
  }, [trayItems, traySlotCount, activeStep, appMode, quizMode]);

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
    
    if (appMode === 'concept' && feedback.type !== 'success') {
        setActionError("Please answer the logic question above before building the line.");
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
      setActionError("");
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
        setFeedback({ type: 'success', msg: "Construction Verified!", reason: "You accurately mapped the ratio and groups!" });
    } else {
      setFeedback({ type: 'error', msg: "Arrangement Error", reason: "Create 12 slots. Place Sam 7th. Put 5 Girls and 1 Boy ahead of him. Put 2 Boys and 3 Girls after him." });
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished) return;
    if (sourceIndex !== null && sourceIndex !== undefined) return;

    if (appMode === 'concept' && feedback.type !== 'success') {
        setActionError("Please answer the logic question above before placing characters.");
        return;
    }

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
      // Only unseat named characters
      if (itemId !== 'Boy' && itemId !== 'Girl') {
          const oldIdx = newItems.indexOf(itemId);
          if (oldIdx !== -1) newItems[oldIdx] = null;
      }
      
      newItems[targetSlotIdx] = itemId;
      setTrayItems(newItems);
      setActionError("");
    }
  }

  const showSlots = traySlotCount > 0;
  
  const activePeopleList = appMode === 'concept' 
    ? ALL_PEOPLE.filter(p => ['Rahul', 'Boy', 'Girl'].includes(p.id))
    : ALL_PEOPLE.filter(p => ['Sam', 'Boy', 'Girl'].includes(p.id));

  const isQuizPassed = feedback.type === 'success';
  const isBoardValid = stepStatus === 'correct';

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Distribution Logic Lab" : "Ratio Calculation Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

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
                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1"><ArrowDownCircle size={14}/> Top End (Rank 1)</span>
                    <span className="text-yellow-400 font-black uppercase text-[10px] flex items-center gap-1">Bottom End (Rank {traySlotCount || 'N'}) <ArrowUpCircle size={14}/></span>
                  </div>
                  
                  {/* Forced Single Line with Horizontal Scroll */}
                  <div className="w-full flex flex-nowrap justify-start items-center gap-1 sm:gap-2 px-4 py-4 transition-all overflow-x-auto custom-scrollbar">
                    
                    {showSlots && Array.from({ length: traySlotCount }).map((_, i) => {
                      const itemId = trayItems[i];
                      const person = ALL_PEOPLE.find(p => p.id === itemId);

                      return (
                        <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                          <div data-slot-idx={i} className={`w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] lg:w-14 lg:h-14 rounded-xl border-2 flex items-center justify-center relative transition-all ${person ? 'bg-white border-white scale-105 shadow-lg' : 'border-dashed border-white/20 bg-black/20'}`}>
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
                        <button onClick={() => handleAddSlot()} className="w-10 h-10 sm:w-[3.25rem] sm:h-[3.25rem] lg:w-14 lg:h-14 flex-shrink-0 rounded-xl border-2 border-dashed border-yellow-500/40 bg-yellow-500/5 flex flex-col items-center justify-center text-yellow-500/60 hover:text-yellow-400 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all active:scale-95 shadow-md">
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
                                <person.icon size={24} className="text-white lg:scale-125" />
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
                             <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered distribution ratios and rank combinations!</p>
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
                                        <div className="flex flex-col gap-1 mt-2">
                                            <button disabled={true} className="w-full py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.maxSlots > 0 ? "Complete Action in Construction Zone" : "Read Above to Proceed"}
                                            </button>
                                            {actionError && <p className="text-rose-400 text-[13px] font-bold italic animate-pulse text-center leading-tight mt-1">"{actionError}"</p>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 rounded-xl border border-green-400/50 shadow-lg">
                                <p className="text-white font-bold text-[16px] uppercase tracking-widest">All Rules Proved!</p>
                                <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                                    You've successfully mapped the complex distribution ratios and found the exact relative groups! Time for the final quiz!
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
                                        Read the Logic Problem on the left. Construct the ORIGINAL scenario using the Add buttons and the palette!
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