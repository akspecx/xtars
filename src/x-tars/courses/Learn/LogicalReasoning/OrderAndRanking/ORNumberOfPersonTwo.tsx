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
  PlusCircle
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
      { id: 1, text: "Sixteen students are sitting in a horizontal row facing North." },
      { id: 2, text: "Sonakshi was initially sitting at the 6th position from the Left." },
      { id: 3, text: "Rule: All even-numbered students shift to successive even-numbered positions." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: The Initial Layout. We have 16 students. To see Sonakshi's 6th position, how many slots must we build?",
        options: ["Build 16 slots", "Build 6 slots", "Build 10 slots"],
        correct: 0,
        feedback: [
          "Correct! The problem states there are 16 students in total, so we must build the full row to visualize the entire line.",
          "Building 6 slots only shows her side, but we can't find her 'Right-end' position without knowing where the row ends!",
          "The clue specifies sixteen students. We need the full line of 16."
        ],
        why: "To calculate positions from the Right end, we must first establish the full row length of 16.",
        instruction: "Use the '+' button to create exactly 16 placeholders. Then drag Sonakshi to the 6th slot.",
        targetAction: [{ itemId: 'Sonakshi', slot: 5 }],
        maxSlots: 16
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Shifting Logic. Even students (2, 4, 6...) shift to 'successive' even positions. Where does Sonakshi (Position 6) move?",
        options: ["Moves to 8th", "Moves to 4th", "Stays at 6th", "Moves to 12th"],
        correct: 2,
        feedback: [
          "Successive means the 1st even student takes 2nd, 2nd takes 4th, and 3rd (Sonakshi) takes 6th. She doesn't jump forward.",
          "That would be shifting backwards.",
          "Exactly! Since she is the 3rd even-numbered student (2, 4, 6), the rule 'successive even positions' means she remains in the 3rd even slot (Position 6).",
          "Successive means they follow the natural even sequence. She stays put."
        ],
        why: "The 3rd even student is 6. Successive even positions for evens (2, 4, 6...) means Position 6 stays as Position 6.",
        instruction: "Place 15 'Students' in all other slots to complete the row visualization.",
        targetAction: [{ itemId: 'Sonakshi', slot: 5 }],
        maxSlots: 16
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Calculating Right Position. Total is 16, Left is 6. What is the formula for the position from the Right end?",
        options: ["Total - Left", "Total - Left + 1", "Total + Left - 1"],
        correct: 1,
        feedback: [
          "If you do 16 - 6, you get 10, which represents people to her right, not her own rank.",
          "Perfect! Position from Right = Total - Position from Left + 1. For Sonakshi: 16 - 6 + 1 = 11.",
          "Adding everything together would result in a number higher than our total students."
        ],
        why: "Formula Proof: $16 - 6 + 1 = 11$. She is the $11^{th}$ person when counting from the Right.",
        instruction: "Final Result: Sonakshi is at the 11th position from the Right end.",
        targetAction: [],
        maxSlots: 16
      }
    ],
    postQuiz: [
      { q: "What is Sonakshi's position from the Right end?", options: ["10th", "11th", "12th"], correct: 1, explanation: "16 - 6 + 1 = 11." },
      { q: "If a person is 1st from Left in a row of 10, what is their Right position?", options: ["9th", "10th", "11th"], correct: 1, explanation: "10 - 1 + 1 = 10." },
      { q: "How many even-numbered positions are there in a row of 16?", options: ["6", "8", "16"], correct: 1, explanation: "16 / 2 = 8." }
    ]
  },
  practice: {
    title: "Positioning Challenge",
    mission: "Twelve students are in a row. Rahul is 4th from Left. If odd students shift to successive odd positions, what is his Right-end rank?",
    clues: [
      { id: 1, text: "Total students = 12. Facing North." },
      { id: 2, text: "Rahul is at the 4th position initially." },
      { id: 3, text: "Rule: Odd-numbered students shift to successive odd positions." }
    ],
    maxSlots: 12,
    quiz: [
      { q: "Does Rahul's position change under the 'Odd-Numbered' shift rule?", options: ["Yes", "No"], correct: 1, explanation: "Rahul is at 4 (Even). The rule only shifts ODD students. He stays at 4." },
      { q: "What is Rahul's final position from the Right end?", options: ["8th", "9th", "10th"], correct: 1, explanation: "12 - 4 + 1 = 9." },
      { q: "How many people are to the right of Rahul?", options: ["7", "8", "9"], correct: 1, explanation: "If he is 9th from right, 8 people are behind him." }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('start'); 
  const [scanningTimer, setScanningTimer] = useState(30);

  const [activeStep, setActiveStep] = useState(0);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');

  const [traySlotCount, setTraySlotCount] = useState(0);
  const [trayItems, setTrayItems] = useState(new Array(30).fill(null));

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.quiz;

  useEffect(() => {
    const row = trayItems;
    if (appMode === 'practice') {
        const hasRahul = row[3] === 'Rahul';
        const isFull = traySlotCount === 12;
        setStepStatus((hasRahul && isFull) ? 'correct' : 'idle');
        return;
    }
    if (conceptPhase !== 'interaction') return;
    const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
    if (!stepData?.targetAction || stepData.targetAction.length === 0) {
        setStepStatus('correct');
        return;
    }
    const isMatch = stepData.targetAction.every(ta => row[ta.slot] === ta.itemId);
    const countMatch = traySlotCount === stepData.maxSlots;
    setStepStatus((isMatch && countMatch) ? 'correct' : 'idle');
  }, [trayItems, traySlotCount, activeStep, appMode, conceptPhase]);

  function handleReset() {
    setTraySlotCount(0);
    setTrayItems(new Array(30).fill(null));
    setActiveStep(0);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setConceptPhase('start');
    setScanningTimer(30);
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
    const limit = appMode === 'concept' ? LOGIC_DATA.concept.teachingSteps[activeStep]?.maxSlots : 12;
    if (traySlotCount < limit) {
        setTraySlotCount(prev => prev + 1);
        setFeedback({ type: null, msg: "", reason: "" });
    } else {
        setFeedback({ 
            type: 'error', 
            msg: "Limit Reached!", 
            reason: `For this problem, we are calculating a row of ${limit} students.` 
        });
    }
  }

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logical Path Found!", reason: String(fbReason) });
      setConceptPhase('interaction');
    } else {
      setFeedback({ type: 'error', msg: "Check the Shifting Rule", reason: String(fbReason) });
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
      setConceptPhase('interaction');
      setStepStatus('correct');
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    const steps = LOGIC_DATA.concept.teachingSteps;
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptPhase('selecting');
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setConceptPhase('finalCheck');
    }
  }

  function validatePractice() {
    if (stepStatus === 'correct') { 
        setQuizMode(true);
        setFeedback({ type: 'success', msg: "Validation Success!", reason: "The 12-person row is correctly built." });
    } else {
      setFeedback({ type: 'error', msg: "Validation Error", reason: "Check total slots (12) and Rahul's rank (4th from Left)." });
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished) return;
    
    // STRICT RULE 3: Only drags from Repo (sourceIndex is null) are allowed.
    // If dropping a unique person, move them. If dropping Student, infinite source.
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
      // STICKY TARGET: Must drop specifically on a placeholder
      if (dist < 80 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });
    
    if (targetSlotIdx !== -1) {
      const newItems = [...trayItems];
      
      // Move unique characters if they already exist in a slot
      if (itemId !== 'Student') {
          const oldIdx = newItems.indexOf(itemId);
          if (oldIdx !== -1) newItems[oldIdx] = null;
      }
      
      // Update target slot
      if (newItems[targetSlotIdx] === null || newItems[targetSlotIdx] === 'Student' || itemId !== 'Student') {
          newItems[targetSlotIdx] = itemId;
          setTrayItems(newItems);
          setFeedback({ type: null, msg: "", reason: "" });
      }
    }
    // If targetSlotIdx is -1, the character will naturally "snap back" because we didn't update state.
  }

  useEffect(() => {
    let interval;
    if (conceptPhase === 'scanning' && scanningTimer > 0) interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
    else if (conceptPhase === 'scanning' && scanningTimer === 0) setConceptPhase('selecting');
    return () => clearInterval(interval);
  }, [conceptPhase, scanningTimer]);

  const showSlots = (appMode === 'practice') || (conceptPhase !== 'start' && conceptPhase !== 'scanning');

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Sitting Logic Lab" : "Independent Algorithm Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Row Construction */}
        <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1 text-white"><MoveHorizontal size={14} /> Construction Zone</div>
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
                          <div className={`w-full h-full rounded-lg bg-gradient-to-br ${person.color} flex flex-col items-center justify-center text-white shadow-lg z-10 p-1`}>
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
              {(!showSlots || traySlotCount === 0) && (
                <p className="text-white/10 font-bold uppercase tracking-widest text-[12px] animate-pulse mt-4">Queue is empty. Use '+' to add placeholders.</p>
              )}
            </div>
            {/* Repository Palette */}
            <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none text-white text-[12px]"><ShoppingCart size={14} /> Repository Palette</div>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
                {ALL_PEOPLE.filter(p => appMode === 'concept' ? ['Sonakshi','Student'].includes(p.id) : ['Rahul','Student'].includes(p.id)).map(person => {
                   return (
                    <div key={`anchor-${person.id}`} className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-xl bg-black/10 shadow-inner">
                        <motion.div 
                          layoutId={`p-${person.id}-repo`} 
                          drag={!quizMode && !lessonFinished} 
                          dragConstraints={containerRef} 
                          onDragEnd={(e, info) => handleDragEnd(e, info, person.id, null)}
                          whileHover={{ scale: 1.15 }} 
                          className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-black/10 bg-gradient-to-br ${person.color} shadow-xl border-white/20 z-[60] p-1 cursor-grab active:cursor-grabbing`}
                        >
                          <person.icon size={20} className="text-white" />
                          <span className="text-[10px] font-black text-white leading-none uppercase mt-1 truncate w-full text-center">{person.id}</span>
                        </motion.div>
                    </div>
                   );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels */}
        <div className="w-full bg-[#2a1a16] p-4 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.8fr] gap-1 min-h-[300px] sm:min-h-[400px]">
            
            {/* Clues & Instruction List */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="flex items-center gap-2 opacity-50">
                {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
                <span className="text-[#a88a6d] font-black uppercase text-[12px]">{quizMode ? "Reasoning Quiz" : "Instructions"}</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar text-[14px]">
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
                  currentScenData.clues.map((clue, idx) => {
                    const isScanning = conceptPhase === 'scanning';
                    const isStart = conceptPhase === 'start' || (appMode === 'practice' && !quizMode);
                    const isEnd = lessonFinished;
                    const isRelevant = !isStart && !isEnd && appMode === 'concept' && (activeStep === idx);
                    const isDone = appMode === 'concept' && activeStep > idx;
                    const showFull = isStart || isEnd || isScanning || appMode === 'practice';
                    return (
                      <div key={idx} className={`flex items-start gap-3 transition-all ${isRelevant || isDone || showFull ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${(isRelevant || isDone) && !showFull ? 'bg-yellow-400' : 'bg-white/10'}`}>
                           {isDone && !showFull ? <Check size={14} className="text-black" strokeWidth={4} /> : <span className={`font-black text-[12px] ${isRelevant ? 'text-black' : 'text-white'}`}>{idx + 1}</span>}
                        </div>
                        <p className={`text-white text-[14px] leading-tight tracking-tight font-medium ${isDone && !showFull ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Teacher Discussion & Logic Flow */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden">
              <AnimatePresence mode='wait'>
                {conceptPhase === 'start' && !lessonFinished && appMode === 'concept' && (
                  <motion.div key="c-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <Users size={40} className="text-yellow-400" />
                     <p className="text-white font-medium italic text-[14px] tracking-tight px-6 leading-relaxed">Let's solve the shifting puzzle by building the line step-by-step!</p>
                     <button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-12 py-3 rounded-full font-black uppercase shadow-xl hover:scale-105 transition-all text-[14px]">Begin Flow Analysis</button>
                  </motion.div>
                )}

                {conceptPhase === 'scanning' && appMode === 'concept' && (
                  <motion.div key="scanning" className="flex flex-col items-center justify-center h-full text-center gap-3 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                    <Timer size={40} className="text-yellow-400 animate-pulse" />
                    <p className="text-white font-black text-[16px] tracking-tighter uppercase">Neutral Analysis: {scanningTimer}s</p>
                    <p className="text-white tracking-tight px-4 font-medium text-center leading-snug">Read the bright white clues. Remember: if you drop a character outside a placeholder, they will snap back to the palette!</p>
                  </motion.div>
                )}

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
                    <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`w-full py-3 rounded-full font-black uppercase text-[14px] tracking-widest transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Complete Step</button>
                  </motion.div>
                )}

                {(conceptPhase === 'finalCheck' || (appMode === 'practice' && !quizMode)) && !quizMode && (
                  <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <div className="bg-green-400/20 p-6 rounded-xl border border-green-400/50 shadow-lg">
                        <p className="text-white font-bold text-[16px] uppercase tracking-widest">{appMode === 'concept' ? 'Model Constructed!' : 'Position Challenge'}</p>
                        <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                            {appMode === 'concept' 
                                ? "You've successfully built the row and applied the shifting logic. Ready to convert Left end to Right end?" 
                                : "Construct the 12-person row for Rahul. Characters palette icons stay fixed—drag them into the placeholders you add using '+'!"}
                        </p>
                     </div>
                     <button onClick={appMode === 'concept' ? () => setQuizMode(true) : validatePractice} disabled={appMode === 'practice' && stepStatus !== 'correct'} className={`w-full py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] ${ (appMode === 'concept' || stepStatus === 'correct') ? 'bg-green-600 text-white hover:scale-105 tracking-widest' : 'bg-white/5 text-white/20 cursor-not-allowed' }`}>
                        {appMode === 'concept' ? 'Start Shifting Quiz' : 'Verify My Layout'}
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
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? (appMode === 'concept' ? 'Start Independent Challenge' : 'Finish Laboratory') : 'Next Discovery') : 'Try Again'}
                                </button>
                            </div>
                        )}
                        {!quizFeedbackMode && (
                            <div className="flex flex-col items-center gap-4">
                                <HelpCircle size={48} className="text-indigo-400 animate-bounce" />
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
                     <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered the shifting algorithm and positioning formulas!</p>
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