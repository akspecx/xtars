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
  ArrowUpRight
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
  // Juice Module (Concept)
  { id: 'J', name: 'J', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
  { id: 'K', name: 'K', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
  { id: 'L', name: 'L', icon: User, color: 'from-emerald-600 to-emerald-800' },
  { id: 'M', name: 'M', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'N', name: 'N', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
  { id: 'O', name: 'O', icon: GlassWater, color: 'from-indigo-600 to-indigo-800' },
  { id: 'P', name: 'P', icon: Target, color: 'from-orange-600 to-orange-800' },
  // Milk Module (Practice)
  { id: 'Z', name: 'Z', icon: UserCircle, color: 'from-cyan-600 to-cyan-800' },
  { id: 'Y', name: 'Y', icon: UserCheck, color: 'from-pink-600 to-pink-800' },
  { id: 'X', name: 'X', icon: User, color: 'from-slate-600 to-slate-800' },
  { id: 'W', name: 'W', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'V', name: 'V', icon: UserMinus, color: 'from-lime-600 to-lime-800' },
  { id: 'U', name: 'U', icon: GlassWater, color: 'from-indigo-600 to-indigo-800' },
  { id: 'T', name: 'T', icon: Target, color: 'from-orange-600 to-orange-800' }
];

const LOGIC_DATA = {
  concept: {
    clues: [
      { id: 1, text: "1. J buys more than P but less than M." },
      { id: 2, text: "2. N buys more than O but less than L." },
      { id: 3, text: "3. P buys more than L." },
      { id: 4, text: "4. K buys more than M." },
      { id: 5, text: "5. Second least buys 3 liters." },
      { id: 6, text: "6. Second highest buys 12 liters." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Let's build a master sequence immediately. Which group of clues share overlapping people so we can 'club' them together?",
        options: ["1, 3, 4", "1, 2, 5", "2, 4, 6", "None"],
        correct: 0,
        feedback: [
          "Correct! Clue 1 (M>J>P), Clue 3 (P>L), and Clue 4 (K>M) overlap perfectly. Clubbing them creates a 5-person sequence: K > M > J > P > L.",
          "Clue 1 and 2 don't have common people yet. Clue 5 is numeric.",
          "Clue 2 and 4 share no names. We can't build a chain by clubbing these two.",
          "Look for overlapping names! You can bridge instructions to make a master sequence."
        ],
        why: "Overlapping people (M and P) allow us to merge Clues 1, 3, and 4 into a 5-person chain: K > M > J > P > L.",
        instruction: "Drag K, M, J, P, and L into the tray in the order: K > M > J > P > L. Use Ranks 1 to 5.",
        targetAction: [{ itemId: 'K', slot: 0 }, { itemId: 'M', slot: 1 }, { itemId: 'J', slot: 2 }, { itemId: 'P', slot: 3 }, { itemId: 'L', slot: 4 }] 
      },
      { 
        id: "step-2",
        selectionPrompt: "Now we have K > M > J > P > L. Which remaining fragment tells us the order for the rest of the group?",
        options: ["Clue 2", "Clue 5", "Clue 6"],
        correct: 0,
        feedback: [
          "Perfect! Clue 2 (L > N > O) completes the list. Since L is Rank 5, N and O must be Ranks 6 and 7.",
          "Clue 5 is numeric (3L). Let's finish naming the people first.",
          "Clue 6 is a volume rule. Finish the ranking sequence first."
        ],
        why: "Clue 2 bridges our master chain to the last two slots.",
        instruction: "Drag N to Rank 6 and O to Rank 7 based on the L > N > O rule.",
        targetAction: [{ itemId: 'N', slot: 5 }, { itemId: 'O', slot: 6 }]
      },
      { 
        id: "step-3",
        selectionPrompt: "The ranking is finished! Now look at the volume rules. Who buys 12 Liters and who buys 3 Liters?",
        options: ["K & O", "M & N", "M & L"],
        correct: 1,
        feedback: [
          "Not quite. Check clue 6 (2nd high) and 5 (2nd least) ranks again.",
          "Correct! Clue 6 (2nd highest) = Rank 2 (M) = 12L. Clue 5 (2nd least) = Rank 6 (N) = 3L.",
          "Check the ranks again."
        ],
        why: "Ranks determine volumes: Rank 2 (M) = 12L, Rank 6 (N) = 3L.",
        instruction: "Master Sequence: K(1) > M(12L) > J(3) > P(4) > L(5) > N(3L) > O(7).",
        targetAction: []
      }
    ],
    postQuiz: [
      { q: "Who among the following person buys the highest quantity of juice?", options: ["Person M", "Person K", "Person J"], correct: 1, explanation: "K is Rank 1, sitting at the absolute top of our master chain." },
      { q: "Person L bought double the juice of N (3L). What is the average of M and L?", options: ["8 Liters", "9 Liters", "10 Liters"], correct: 1, explanation: "N=3L, so L=6L. M=12L. Average is (12+6)/2 = 9L." },
      { q: "If M+P=17L and K-P=9L, how many liters of juice were bought by K?", options: ["12 Liters", "14 Liters", "16 Liters"], correct: 1, explanation: "M=12L. 12 + P = 17 => P = 5L. K - 5 = 9 => K = 14L." }
    ]
  },
  practice: {
    title: "Milk Consumption Lab",
    mission: "Independently arrange 7 families (X, Z, Y, W, T, V, U) based on the clues provided.",
    clues: [
      { id: 1, text: "1. Family Y buys more than W but less than Z." },
      { id: 2, text: "2. Family V buys more than U but less than T." },
      { id: 3, text: "3. Family W buys more than T." },
      { id: 4, text: "4. Family X buys more than Z." },
      { id: 5, text: "5. 2nd highest buys 15L, 2nd least buys 5L." }
    ],
    targetOrder: ['X', 'Z', 'Y', 'W', 'T', 'V', 'U'],
    quiz: [
      { q: "Which family is the absolute highest milk consumer?", options: ["Family X", "Family Z", "Family Y"], correct: 0, explanation: "Chain logic: X > Z(15L) > Y > W > T > V(5L) > U." },
      { q: "Who buys exactly 15 Liters of milk?", options: ["Family X", "Family Z", "Family Y"], correct: 1, explanation: "Clue 5 states the 2nd highest buys 15L. Z is Rank 2." },
      { q: "What is the average milk consumption of Z and V?", options: ["9 Liters", "10 Liters", "11 Liters"], correct: 1, explanation: "Z=15L, V=5L. Average: (15+5)/2 = 10L." },
      { q: "If Family Y consumes 12L and W consumes 9L, what is the difference between Y and W?", options: ["3 Liters", "4 Liters", "5 Liters"], correct: 0, explanation: "12L - 9L = 3L." },
      { q: "Which family is the second least consumer (Rank 6)?", options: ["Family U", "Family V", "Family T"], correct: 1, explanation: "Ranking: ...T(5) > V(6) > U(7). V is at Rank 6." }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('start'); 
  const [scanningTimer, setScanningTimer] = useState(30);

  const [activeStep, setActiveStep] = useState(0);
  const [completedClues, setCompletedClues] = useState([]);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');

  const [scenarios, setScenarios] = useState([{ id: 101, items: new Array(7).fill(null) }]);
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.quiz;

  useEffect(() => {
    const row = scenarios[0].items;
    if (appMode === 'practice') {
        const isFull = row.every(i => i !== null);
        setStepStatus(isFull ? 'correct' : 'idle');
        return;
    }
    if (conceptPhase !== 'interaction') return;
    const stepData = LOGIC_DATA.concept.teachingSteps[activeStep];
    if (!stepData?.targetAction || stepData.targetAction.length === 0) {
        setStepStatus('correct');
        return;
    }
    const isMatch = stepData.targetAction.every(ta => row[ta.slot] === ta.itemId);
    setStepStatus(isMatch ? 'correct' : 'idle');
  }, [scenarios, activeStep, appMode, conceptPhase]);

  function handleReset() {
    setScenarios([{ id: 101, items: new Array(7).fill(null) }]);
    setActiveStep(0);
    setCompletedClues([]);
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

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logical Path Found!", reason: String(fbReason) });
      setConceptPhase('interaction');
    } else {
      setFeedback({ type: 'error', msg: "Logic Mismatch", reason: String(fbReason) });
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
    if (steps[activeStep]?.clueIndices) {
      setCompletedClues(prev => [...new Set([...prev, ...steps[activeStep].clueIndices])]);
    }
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
    const current = scenarios[0].items.join(',');
    const target = LOGIC_DATA.practice.targetOrder.join(',');
    if (current === target) { 
        setQuizMode(true);
        setFeedback({ type: 'success', msg: "Arrangement Validated!", reason: "The family sequence is perfect. Ready for the reasoning questions?" });
    } else {
      setFeedback({ type: 'error', msg: "Validation Failed", reason: "Re-read clues. Does Family X purchase more than Family Z? Is Family W above Family T?" });
    }
  }

  function handleDragEnd(event, info, itemId, sourceScenId, sourceIndex) {
    if (quizMode || lessonFinished) return;
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
      if (dist < 100 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });
    if (targetSlotIdx !== -1) {
      if (scenarios[0].items[targetSlotIdx] !== null && scenarios[0].items[targetSlotIdx] !== itemId) return;
      const nextScen = [...scenarios];
      const row = [...nextScen[0].items];
      const oldIdx = row.indexOf(itemId);
      if (oldIdx !== -1) row[oldIdx] = null;
      row[targetSlotIdx] = itemId;
      nextScen[0].items = row;
      setScenarios(nextScen);
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  useEffect(() => {
    let interval;
    if (conceptPhase === 'scanning' && scanningTimer > 0) interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
    else if (conceptPhase === 'scanning' && scanningTimer === 0) setConceptPhase('selecting');
    return () => clearInterval(interval);
  }, [conceptPhase, scanningTimer]);

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Juice Ranking Lab" : "Independent Milk Lab"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Logic Tray */}
        <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1 text-white"><Layers size={14} /> Logic Tray</div>
            <div className="relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 border-yellow-500/30 shadow-inner flex flex-col items-center justify-center">
              <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                <span className="text-yellow-400 font-black uppercase text-[12px]"><ArrowLeftCircle size={16}/> Highest</span>
                <span className="text-yellow-400 font-black uppercase text-[12px]">Lowest <ArrowRightCircle size={16}/></span>
              </div>
              <div className="w-full flex flex-wrap justify-around items-center gap-2 px-2">
                {scenarios[0].items.map((itemId, i) => {
                  const item = ALL_PEOPLE.find(p => p.id === itemId);
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div data-slot-idx={i} className={`w-11 h-11 sm:w-20 sm:h-20 rounded-2xl border-2 flex items-center justify-center relative transition-all ${item ? 'bg-white border-white shadow-md scale-105' : 'border-dashed border-white/10 bg-black/10'}`}>
                        {item ? (
                          <motion.div layoutId={`p-${item.id}`} drag={!quizMode && !lessonFinished} dragConstraints={containerRef} onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null, i)}
                            className={`w-full h-full rounded-xl bg-gradient-to-br ${item.color} flex flex-col items-center justify-center text-white shadow-lg cursor-grab active:cursor-grabbing`}>
                            <item.icon size={22} />
                            <span className="font-black text-[12px] sm:text-[14px]">{item.id}</span>
                          </motion.div>
                        ) : <span className="text-white/10 font-black text-[18px]">{i + 1}</span>}
                        {item && !quizMode && !lessonFinished && (
                            <button onClick={() => { const n = [...scenarios]; n[0].items[i] = null; setScenarios(n); }} className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-lg hover:scale-110 z-20"><X size={10}/></button>
                        )}
                      </div>
                      <div className="flex flex-col items-center h-4">
                        {appMode === 'concept' && i === 1 && <span className="text-amber-500 font-black text-[10px] uppercase tracking-tighter leading-none">12L</span>}
                        {appMode === 'concept' && i === 5 && <span className="text-indigo-400 font-black text-[10px] uppercase tracking-tighter leading-none">3L</span>}
                        {appMode === 'practice' && i === 1 && <span className="text-amber-500 font-black text-[10px] uppercase tracking-tighter leading-none">15L</span>}
                        {appMode === 'practice' && i === 5 && <span className="text-indigo-400 font-black text-[10px] uppercase tracking-tighter leading-none">5L</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Repository */}
            <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none text-white"><ShoppingCart size={14} /> Shared Repository</div>
              <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
                {ALL_PEOPLE.filter(p => appMode === 'concept' ? ['J','P','M','N','O','L','K'].includes(p.id) : ['Z','Y','X','W','V','U','T'].includes(p.id)).map(person => {
                   const isPlaced = scenarios[0].items.includes(person.id);
                   return (
                    <div key={`anchor-${person.id}`} className="relative w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-xl bg-black/10 shadow-inner">
                      {!isPlaced ? (
                        <motion.div layoutId={`p-${person.id}`} drag={!quizMode && !lessonFinished} dragConstraints={containerRef} onDragEnd={(e, info) => handleDragEnd(e, info, person.id, null, null)}
                          whileHover={{ scale: 1.15 }} className={`w-full h-full rounded-xl flex flex-col items-center justify-center border-2 border-black/10 bg-gradient-to-br ${person.color} shadow-xl border-white/20 z-10 p-1 cursor-grab active:cursor-grabbing`}>
                          <person.icon size={20} className="text-white" />
                          <span className="text-[10px] font-black text-white leading-none uppercase">{person.id}</span>
                        </motion.div>
                      ) : <div className="opacity-10"><person.icon size={20} className="text-white" /></div>}
                    </div>
                   );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Guidance Panels */}
        <div className="w-full bg-[#2a1a16] p-4 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-1 shrink-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-1 min-h-[300px] sm:min-h-[400px]">
            
            {/* Div 1: The Clues / Quiz Container */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="flex items-center gap-2 opacity-50">
                {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
                <span className="text-[#a88a6d] font-black uppercase text-[12px]">{quizMode ? "Reasoning Quiz" : "The Clues"}</span>
              </div>
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto custom-scrollbar text-[14px]">
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
                    const isRelevant = !isStart && !isEnd && !quizMode && appMode === 'concept' && LOGIC_DATA.concept.teachingSteps[activeStep]?.clueIndices?.includes(idx);
                    const isStruck = !isStart && !isEnd && !quizMode && appMode === 'concept' && completedClues.includes(idx) && !isRelevant;
                    const showFull = isStart || isEnd || isScanning || quizMode || appMode === 'practice';
                    return (
                      <div key={idx} className={`flex items-start gap-3 transition-all ${isRelevant || showFull ? 'opacity-100' : 'opacity-30'}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isRelevant && !showFull ? 'bg-yellow-400' : 'bg-white/10'}`}>
                           {isStruck && !showFull ? <Check size={12} className="text-black" /> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
                        </div>
                        <p className={`text-white text-[14px] leading-tight tracking-tight font-medium ${isStruck && !showFull ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Div 2: Teacher Guidance Container */}
            <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-[3rem] border border-white/5 overflow-hidden">
              <AnimatePresence mode='wait'>
                {conceptPhase === 'start' && !lessonFinished && appMode === 'concept' && (
                  <motion.div key="c-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-4 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <Target size={40} className="text-yellow-400" />
                     <p className="text-white font-medium italic text-[14px] tracking-tight">Ready to learn how to solve rankings by 'Clubbing' fragments into a master chain?</p>
                     <button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-12 py-3 rounded-full font-black uppercase shadow-xl hover:scale-105 transition-all text-[14px]">Begin Concept Analysis</button>
                  </motion.div>
                )}

                {conceptPhase === 'scanning' && appMode === 'concept' && (
                  <motion.div key="scanning" className="flex flex-col items-center justify-center h-full text-center gap-3 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                    <Timer size={40} className="text-yellow-400 animate-pulse" />
                    <p className="text-white font-black text-[16px] tracking-tighter uppercase">Neutral Analysis: {scanningTimer}s</p>
                    <p className="text-white tracking-tight px-4 font-medium text-center">Take a moment to read the bright white clues on the left. Look for common family names!</p>
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
                        <p className="text-white font-bold text-[16px] uppercase tracking-widest">{appMode === 'concept' ? 'Master Chain Built!' : 'Milk Lab Arrangement'}</p>
                        <p className="text-white text-[14px] mt-2 tracking-tight leading-tight">
                            {appMode === 'concept' 
                                ? "Every juice purchase follows the ranking. Double check volumes for Rank 2 (12L) and Rank 6 (3L)." 
                                : "Arrange the 7 families based on the clues. No hints this time! Drag the families into their correct slots."}
                        </p>
                     </div>
                     <button onClick={appMode === 'concept' ? () => setQuizMode(true) : validatePractice} disabled={appMode === 'practice' && stepStatus !== 'correct'} className={`w-full py-4 rounded-full font-black uppercase shadow-xl transition-all text-[14px] ${ (appMode === 'concept' || stepStatus === 'correct') ? 'bg-green-600 text-white hover:scale-105 tracking-widest' : 'bg-white/5 text-white/20 cursor-not-allowed' }`}>
                        {appMode === 'concept' ? 'Start Deduction Quiz' : 'Verify My Arrangement'}
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
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? (appMode === 'concept' ? 'Move to Practice Lab' : 'Finish Laboratory') : 'Next Question') : 'Try Again'}
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
                  <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-6 bg-[#3e2723] p-6 rounded-[3rem] border border-white/5">
                     <Trophy size={60} className="text-yellow-400 animate-bounce" />
                     <div>
                        <h3 className="text-white text-[18px] font-black uppercase tracking-widest mb-1">Laboratory Mastered!</h3>
                        <p className="text-white/60 text-[14px] tracking-tight leading-snug px-6">You've mastered 'Clue Clubbing' for complex sequences. Ready for a new challenge?</p>
                     </div>
                     <div className="flex flex-col gap-3 w-full">
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