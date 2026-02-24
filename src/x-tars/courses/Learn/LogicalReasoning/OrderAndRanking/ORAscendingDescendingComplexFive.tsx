import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  AlertCircle,
  Trophy,
  Target,
  X,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  ChevronRight,
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
  Info,
  HelpCircle,
  Activity
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================
const PEOPLE_DATA = [
  { id: 'L', name: 'L', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
  { id: 'M', name: 'M', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
  { id: 'N', name: 'N', icon: User, color: 'from-emerald-600 to-emerald-800' },
  { id: 'O', name: 'O', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'P', name: 'P', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
  { id: 'Q', name: 'Q', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' },
  { id: 'R', name: 'R', icon: Target, color: 'from-orange-600 to-orange-800' },
  { id: 'S', name: 'S', icon: MilestoneIcon, color: 'from-teal-600 to-teal-800' }
];

function UsersIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function MilestoneIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" /><path d="M12 13v8" /><path d="M12 3v3" />
    </svg>
  );
}

const LOGIC_DATA = {
  concept: {
    clues: [
      { id: 1, text: "1. Six persons – L, M, N, O, P and Q have different cibil scores.", meaning: "There are six distinct ranks from 1 (Highest) to 6 (Lowest)." },
      { id: 2, text: "2. The cibil score of O is more than L, whose cibil score is more than M.", meaning: "Person O has a higher score than Person L, and Person L also has a higher score than Person M." },
      { id: 3, text: "3. Only two person's cibil score is less than P.", meaning: "Exactly two people are ranked below Person P, which places P in the 4th position." },
      { id: 4, text: "4. The cibil score of M is less than P, but it is not the lowest.", meaning: "Person M is ranked lower than Person P (4th) but higher than the absolute lowest rank (6th)." },
      { id: 5, text: "5. The cibil score of N is more than both L and P, but N is not the highest.", meaning: "Person N is ranked higher than both Person L and Person P, but N is not at Rank 1." },
      { id: 6, text: "6. 400 is the second lowest cibil score.", meaning: "The person sitting in the fifth position has a score of exactly 400." }
    ],
    teachingSteps: [
      { 
        clueIndices: [2], 
        instructionId: 3,
        prompt: "Step 1: The Absolute Anchor",
        instruction: "Following Instruction Number 3, we know 'Only two people score less than P.' Count two spots from the bottom (6th and 5th), and Person P must be in the 4th spot. Place P in Slot 4!", 
        targetAction: [{ itemId: 'P', slot: 3 }]
      },
      { 
        clueIndices: [3, 5], 
        instructionId: 4, 
        prompt: "Step 2: Deducing M",
        instruction: "Following Instruction Number 4 and Instruction Number 6, we know M is lower than P (4th) but not the lowest (6th). This means M must be in the 5th spot! Place M in Slot 5. Note: Instruction 6 says this spot scores 400.", 
        targetAction: [{ itemId: 'M', slot: 4 }]
      },
      { 
        clueIndices: [4], 
        instructionId: 5,
        prompt: "Step 3: Branching Scenarios",
        instruction: "Instruction 5 says N is higher than 4th but not 1st. This means N could be in spot 2 or 3. Click '+' to create a scenario. In Row 1, place N at 2nd, L at 3rd, and O at 1st. In Row 2, place N at 3rd, L at 6th, and O at 1st.", 
        forceMultiScenario: true,
        targetAction: []
      },
      { 
        clueIndices: [1, 0], 
        instructionId: 2,
        prompt: "Step 4: The Final Elimination",
        instruction: "Look at Instruction Number 2: 'Person L has a higher score than Person M'. In Row 2, Person L is at the very bottom (6th), which is LOWER than M! Mark Row 2 as invalid. Finally, place Q in the empty spot in the valid row.", 
        targetAction: [{ itemId: 'Q', slot: 5 }]
      }
    ],
    postQuiz: [
      { q: "Who ended up having the absolute highest score?", options: ["Person N", "Person O", "Person Q"], correct: 1, explanation: "Person O is at rank 1 because Person N was not allowed to be at rank 1, and Person Q was the last person for the bottom spot." },
      { q: "What is the rank of the person with a score of 400?", options: ["Rank 4", "Rank 5", "Rank 6"], correct: 1, explanation: "Instruction 6 clearly stated that 400 is the second lowest score, which in a group of 6 is position 5." },
      { q: "If Person N has a score of 750, what is a likely score for Person L?", options: ["800 points", "760 points", "680 points"], correct: 2, explanation: "Person L is at rank 3, below Person N (rank 2). Therefore, L's score must be less than 750." }
    ]
  },
  practice: [
    {
      id: 'scen-race',
      title: "The Running Race Lab",
      mission: "Arrange 7 persons from Highest Distance (1) to Lowest Distance (7).",
      clues: [
        { id: 1, text: "1. Only two persons run more distance than R, who runs less than M." },
        { id: 2, text: "2. Q runs more than O but less than N." },
        { id: 3, text: "3. N doesn’t run more than P." },
        { id: 4, text: "4. S doesn’t run more than O." },
        { id: 5, text: "5. P doesn’t run for the highest distance." },
        { id: 6, text: "6. The one who runs the second-highest runs for 8km." },
        { id: 7, text: "7. The one who runs the second-lowest runs for 4km." },
        { id: 8, text: "8. Person P runs more distance than Person R." }
      ],
      targetOrder: ['M', 'P', 'R', 'N', 'Q', 'O', 'S'],
      quiz: [
        { q: "Who among the following person runs the third-lowest distance?", options: ["Person N", "Person Q", "Person O", "Person R"], correct: 1, explanation: "The ranking is M(1), P(2), R(3), N(4), Q(5), O(6), S(7). Counting from the bottom, S is 1st lowest, O is 2nd lowest, and Q is the 3rd lowest runner." },
        { q: "Who runs the highest distance in this race?", options: ["Person P", "Person R", "Person M", "Person N"], correct: 2, explanation: "Instruction 1 says only two run more than R (M and P). Since Instruction 5 says P is not the highest, Person M must be the winner." },
        { q: "How many persons run more distance than Person N?", options: ["Two", "Three", "Four", "Five"], correct: 1, explanation: "Person N is at rank 4. M, P, and R (ranks 1, 2, 3) are all higher. That counts as 3 people." },
        { q: "If Person R runs 6km, what is a possible distance for Person Q?", options: ["9km", "7km", "5km", "3km"], correct: 2, explanation: "Person R is 3rd (6km) and O is 6th (4km). Person Q is 5th. Q's distance must be between 4 and 6. 5km is the only possible answer." }
      ]
    }
  ]
};

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
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
}

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('start');
  const [scanningTimer, setScanningTimer] = useState(30);
  const [finalValidationTimer, setFinalValidationTimer] = useState(30);
  const [activeStep, setActiveStep] = useState(0);
  const [completedClues, setCompletedClues] = useState([]);
  const [manualStrikes, setManualStrikes] = useState([]);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [stepStatus, setStepStatus] = useState('idle');
  const [scenarios, setScenarios] = useState([{ id: Date.now(), items: new Array(6).fill(null), markedInvalid: false }]);
  const [activeScenIdx, setActiveScenIdx] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [practiceStatus, setPracticeStatus] = useState('idle');
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);
  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice[0];
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : (LOGIC_DATA.practice[0]?.quiz || []);

  function handleReset(targetMode) {
    const mode = targetMode || appMode;
    const slotCount = mode === 'concept' ? 6 : 7;
    setScenarios([{ id: Date.now(), items: new Array(slotCount).fill(null), markedInvalid: false }]);
    setActiveScenIdx(0);
    setActiveStep(0);
    setInvalidCount(0);
    setCompletedClues([]);
    setManualStrikes([]);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setConceptPhase('start');
    setScanningTimer(30);
    setFinalValidationTimer(30);
    setPracticeStatus('idle');
    setShowExplanation(false);
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

  function handleAddScenario() {
    const currentItems = [...scenarios[activeScenIdx].items];
    setScenarios([...scenarios, { id: Date.now(), items: currentItems, markedInvalid: false }]);
    setActiveScenIdx(scenarios.length);
  }

  function handleRemoveScenario(idx) {
    if (scenarios.length === 1) return;
    const next = scenarios.filter((_, i) => i !== idx);
    setScenarios(next);
    setActiveScenIdx(0);
  }

  function toggleManualStrike(idx) {
    if (appMode !== 'practice') return;
    setManualStrikes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  }

  function handleMarkInvalid(idx) {
    const row = scenarios[idx].items;
    const lPos = row.indexOf('L');
    const mPos = row.indexOf('M');
    if (lPos === 5 && mPos === 4) {
      const nextScenarios = [...scenarios];
      nextScenarios[idx].markedInvalid = true;
      setScenarios(nextScenarios);
      setInvalidCount(prev => prev + 1);
      setFeedback({ type: 'success', msg: "Great! One arrangement eliminated.", reason: "" });
    } else {
      setFeedback({ type: 'error', msg: "Check Instruction 2!", reason: "Person L must sit above Person M. This row follows that, so it could be valid!" });
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function nextQuizStep() {
    if (quizStep < currentQuizSet.length - 1) {
      setQuizStep(quizStep + 1);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
    } else {
      setLessonFinished(true);
      setQuizMode(false);
    }
  }

  function prevStep() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    }
  }

  function nextStep() {
    const steps = LOGIC_DATA.concept.teachingSteps;
    const stepData = steps[activeStep];
    if (stepData?.clueIndices) {
      setCompletedClues(prev => {
        const next = [...prev];
        stepData.clueIndices.forEach(idx => { if (!next.includes(idx)) next.push(idx); });
        return next;
      });
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setStepStatus('idle');
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setConceptPhase('finalCheck');
      setStepStatus('idle');
    }
  }

  function handleDragStart() {
    if (feedback.type === 'error') {
      setFeedback({ type: null, msg: "", reason: "" });
      setStepStatus('idle');
    }
  }

  function handleDragEnd(event, info, itemId, sourceIndex) {
    if (quizMode || lessonFinished || (appMode === 'concept' && conceptPhase !== 'interaction')) return;
    const dragX = info.point.x;
    const dragY = info.point.y;
    const slots = document.querySelectorAll(`[data-branch-id="${scenarios[activeScenIdx].id}"]`);
    let targetIdx = -1;
    let minDist = 1000;

    slots.forEach((slot) => {
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      if (dist < 150 && dist < minDist) { minDist = dist; targetIdx = parseInt(slot.getAttribute('data-slot-idx')); }
    });

    if (targetIdx !== -1) {
      const currentItems = [...scenarios[activeScenIdx].items];
      if (currentItems[targetIdx] !== null && currentItems[targetIdx] !== itemId) {
        setFeedback({ type: 'error', msg: "Spot occupied.", reason: "Please remove the person currently there." });
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
        if (activeStep === 2) {
          const b1 = newScenarios[0]?.items;
          const b2 = newScenarios[1]?.items;
          const isCaseA = (b) => b && b[1] === 'N' && b[2] === 'L' && b[0] === 'O';
          const isCaseB = (b) => b && b[2] === 'N' && b[5] === 'L' && b[0] === 'O';
          if (newScenarios.length >= 2 && ((isCaseA(b1) && isCaseB(b2)) || (isCaseA(b2) && isCaseB(b1)))) {
            setStepStatus('correct');
            setFeedback({ type: 'success', msg: "Both arrangements placed! Click Verify.", reason: "" });
          }
          return;
        }
        if (activeStep === 3) {
          const validRow = newScenarios.find(s => !s.markedInvalid);
          if (validRow && validRow.items[5] === 'Q' && invalidCount > 0) {
            setStepStatus('correct');
            setFeedback({ type: 'success', msg: "Final person placed!", reason: "" });
          }
          return;
        }
        const isItemCorrect = step.targetAction?.some(ta => ta.itemId === itemId);
        const isSlotCorrect = step.targetAction?.some(ta => ta.itemId === itemId && ta.slot === targetIdx);
        if (isItemCorrect && isSlotCorrect) {
          setStepStatus('correct');
          setFeedback({ type: 'success', msg: "Correct placement!", reason: "" });
        } else {
          setStepStatus('wrong');
          setFeedback({ type: 'error', msg: "Incorrect.", reason: "Follow Instruction Number " + step.instructionId + " to place this person." });
        }
      }
    } else if (sourceIndex !== null) {
      const newScenarios = [...scenarios]; newScenarios[activeScenIdx].items[sourceIndex] = null; setScenarios(newScenarios);
    }
  }

  function validatePractice() {
    const currentOrder = scenarios[activeScenIdx].items.join(',');
    const targetOrder = LOGIC_DATA.practice[0].targetOrder.join(',');
    if (currentOrder === targetOrder) { setPracticeStatus('correct'); setQuizMode(true); }
    else {
      setPracticeStatus('wrong');
      setFeedback({ type: 'error', msg: "Sequence Error", reason: "The race positions don't follow all the race clues. Check instructions 1-8 again!" });
    }
  }

  useEffect(() => {
    let interval;
    if (conceptPhase === 'scanning' && scanningTimer > 0) interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
    else if (conceptPhase === 'scanning' && scanningTimer === 0) setConceptPhase('anchorQuiz');
    return () => clearInterval(interval);
  }, [conceptPhase, scanningTimer]);

  useEffect(() => {
    let interval;
    if (appMode === 'concept' && conceptPhase === 'finalCheck' && finalValidationTimer > 0) interval = setInterval(() => setFinalValidationTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [conceptPhase, finalValidationTimer, appMode]);

  function getDynamicInstruction() {
    if (appMode === 'concept' && activeStep === 2 && conceptPhase === 'interaction') {
      const branchNPos = scenarios.map(s => s.items.indexOf('N'));
      if (branchNPos.includes(1) && !branchNPos.includes(2)) {
        const rowIdx = scenarios.findIndex(s => s.items.indexOf('N') === 1) + 1;
        return `I see N is at Rank 2 in Row ${rowIdx}! Excellent. Now click the other row and try the alternative: N at Rank 3, L at Rank 6, and O at Rank 1.`;
      }
      if (branchNPos.includes(2) && !branchNPos.includes(1)) {
        const rowIdx = scenarios.findIndex(s => s.items.indexOf('N') === 2) + 1;
        return `Great work trying N at Rank 3. Now click the other row and place N at Rank 2 (with L at 3 and O at 1) to explore both!`;
      }
    }
    return LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction || "";
  }

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none overflow-hidden font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Logic Academy" : "Comparative Laboratory"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset()} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px]"><Layers size={14} /><span className="font-black uppercase tracking-widest">Logic Tray</span></div>
            <div className="flex flex-col gap-5">
              <AnimatePresence>
                {scenarios.map((scen, sIdx) => {
                  const isVisible = (appMode === 'concept' && conceptPhase === 'finalCheck') ? !scen.markedInvalid : true;
                  if (!isVisible) return null;
                  return (
                    <motion.div key={scen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shadow-inner transition-all
                    ${sIdx === activeScenIdx ? 'border-yellow-500/40 shadow-xl' : 'border-black/20 opacity-50'}
                    ${scen.markedInvalid ? 'grayscale opacity-30 border-rose-500/40' : ''}`}
                      onClick={() => !scen.markedInvalid && (appMode === 'practice' || conceptPhase === 'interaction') && setActiveScenIdx(sIdx)}
                    >
                      <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                          <ArrowLeftCircle size={16} /> Highest
                        </div>
                        {scenarios.length > 1 && sIdx === activeScenIdx && !quizMode && (
                          <div className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-md uppercase">Editing Row {sIdx + 1}</div>
                        )}
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                          Lowest <ArrowRightCircle size={16} />
                        </div>
                      </div>
                      <div className="absolute top-2 left-4 opacity-5"><span className="text-[12px] font-black text-white uppercase tracking-widest">Scenario {sIdx + 1}</span></div>
                      {scen.markedInvalid && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50 rounded-[1.5rem]">
                          <XCircle className="text-rose-500/60" size={60} strokeWidth={3} />
                        </div>
                      )}
                      {appMode === 'concept' && activeStep === 3 && !scen.markedInvalid && invalidCount === 0 && (
                        <div className="absolute inset-0 bg-rose-500/5 z-50 flex items-center justify-center cursor-pointer rounded-[1.5rem]" onClick={() => handleMarkInvalid(sIdx)}>
                          <div className="bg-rose-600 text-white px-6 py-2 rounded-full font-black text-[12px] uppercase shadow-2xl animate-bounce border-2 border-white/20 tracking-widest">Mark Row {sIdx + 1} Invalid</div>
                        </div>
                      )}
                      {sIdx === activeScenIdx && !quizMode && !lessonFinished && ((appMode === 'concept' && conceptPhase === 'interaction' && activeStep < 3) || (appMode === 'practice')) && (
                        <div className="absolute -right-1 flex flex-col gap-2 z-40">
                          <button onClick={(e) => { e.stopPropagation(); handleAddScenario(); }} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Plus size={18} strokeWidth={4} /></button>
                          {scenarios.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveScenario(sIdx); }} className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Trash2 size={18} strokeWidth={4} /></button>}
                        </div>
                      )}
                      <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-black/20 -translate-y-1/2 rounded-full z-0" />
                      <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4 px-2">
                        {scen.items.map((itemId, i) => {
                          const itemData = itemId ? PEOPLE_DATA.find(f => f.id === itemId) : null;
                          return (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div data-branch-id={scen.id} data-slot-idx={i}
                                className={`w-11 h-11 sm:w-20 sm:h-20 rounded-full border-[1px] sm:border-2 flex items-center justify-center relative transition-all duration-300 group
                                ${itemData ? `bg-white border-white shadow-md scale-105 ${(practiceStatus === 'wrong' && sIdx === activeScenIdx) || (appMode === 'concept' && stepStatus === 'wrong' && sIdx === activeScenIdx) ? 'ring-2 ring-rose-500' : ''} ${(stepStatus === 'correct' && sIdx === activeScenIdx) || (practiceStatus === 'correct' && sIdx === activeScenIdx) ? 'ring-2 ring-green-500' : ''}` : `border-dashed border-white/10 bg-black/10`}`}
                              >
                                {itemData ? (
                                  <>
                                    <motion.div layoutId={`item-${itemData.id}-${scen.id}`} drag={!lessonFinished && !quizFeedbackMode && !scen.markedInvalid && sIdx === activeScenIdx} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1}
                                      whileDrag={{ scale: 1.3, zIndex: 100 }} onDragStart={handleDragStart} onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, i)}
                                      className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
                                    >
                                      <div className="text-white drop-shadow-md">{<itemData.icon size={28} />}</div>
                                      <span className="text-[10px] sm:text-[12px] font-black text-white uppercase mt-1 leading-none">{itemData.id}</span>
                                    </motion.div>
                                    {!quizMode && !lessonFinished && !scen.markedInvalid && sIdx === activeScenIdx && (
                                      <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
                                        onClick={() => { const n = [...scenarios]; n[sIdx].items[i] = null; setScenarios(n); if (appMode === 'concept') setStepStatus('idle'); }}>
                                        <div className="bg-rose-600 p-1.5 rounded-full shadow-lg border border-white/20"><X size={14} strokeWidth={3} className="text-white" /></div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className={`font-black text-[12px] sm:text-[20px] text-white/10`}>{i + 1}</span>
                                )}
                              </div>
                              {(appMode === 'concept' && i === 4) && <span className="text-yellow-500 font-black text-[9px] uppercase tracking-tighter leading-none">400 pts</span>}
                              {(appMode === 'practice' && i === 1) && <span className="text-cyan-400 font-black text-[9px] uppercase tracking-tighter leading-none">8 km</span>}
                              {(appMode === 'practice' && i === 5) && <span className="text-cyan-400 font-black text-[9px] uppercase tracking-tighter leading-none">4 km</span>}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
            <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-center gap-1.5 opacity-20"><ShoppingCart size={14} /><span className="text-[14px] font-black uppercase tracking-widest">Shared repository</span></div>
              <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
                {PEOPLE_DATA.map((item) => {
                  const isPlacedInActive = scenarios[activeScenIdx].items.includes(item.id);
                  if (item.id === 'L' || (appMode === 'concept' && (item.id === 'R' || item.id === 'S'))) return null;
                  return (
                    <div key={`anchor-${item.id}`} className="relative w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-[1px] sm:border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
                      {!isPlacedInActive ? (
                        <motion.div layoutId={`item-${item.id}-storage`} drag={!quizMode && !lessonFinished && (conceptPhase === 'interaction' || appMode === 'practice') && stepStatus === 'idle'} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1}
                          whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null)}
                          className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-1 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${item.color} shadow-xl border-white/20 z-10 p-1 sm:p-2 cursor-grab active:cursor-grabbing`}
                        >
                          <div className="text-white drop-shadow-md">{<item.icon size={24} />}</div>
                          <span className="text-[8px] sm:text-[12px] font-black text-white leading-none uppercase">{item.id}</span>
                        </motion.div>
                      ) : (
                        <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-white/5 opacity-10 grayscale pointer-events-none">
                          <div className="scale-75 sm:scale-100 opacity-20">{<item.icon size={24} />}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="w-full max-w-7xl bg-[#2a1a16] p-4 rounded-t-[2rem] border-t-4 sm:border-t-8 border-black shadow-2xl relative z-50 flex flex-col gap-3 shrink-0">
          <div className={`grid grid-cols-1 ${quizMode ? 'md:grid-cols-1' : 'md:grid-cols-[1fr_2fr]'} gap-4 sm:gap-8`}>
            <div className="flex flex-col gap-2 min-h-[160px]">
              <div className="flex items-center gap-2 opacity-50">
                {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
                <span className="text-[#a88a6d] font-black uppercase text-[14px]">{quizMode ? "Logic Question" : "The Clues"}</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col gap-2 h-full max-h-[220px] overflow-y-auto custom-scrollbar text-[14px]">
                {quizMode ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest opacity-60">Quest {quizStep + 1}</span>
                    <p className="text-white text-[18px] font-bold leading-tight tracking-tight">{currentQuizSet[quizStep]?.q}</p>
                  </div>
                ) : (
                  currentScenData.clues.map((clue, idx) => {
                    const isDone = (appMode === 'concept' && conceptPhase === 'finalCheck') ? false : (appMode === 'concept' ? completedClues.includes(idx) : manualStrikes.includes(idx));
                    return (
                      <div key={idx} className={`flex items-start gap-3 transition-opacity ${isDone ? 'opacity-30' : 'opacity-100'}`}>
                        {appMode === 'practice' ? (
                          <button onClick={() => toggleManualStrike(idx)} className="mt-1 shrink-0">
                            {isDone ? <CheckSquare className="text-green-500" size={18} /> : <Square className="text-white/20" size={18} />}
                          </button>
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isDone ? 'bg-green-600' : 'bg-yellow-500'}`}>
                            {isDone ? <Check size={12} className="text-white" /> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
                          </div>
                        )}
                        <p className={`text-white font-bold leading-tight ${isDone ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {appMode === 'concept' && !quizMode && (
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[14px]">Teacher Guidance</span></div>
                  {conceptPhase === 'interaction' && !quizMode && !lessonFinished && (<button onClick={prevStep} disabled={activeStep === 0} className={`p-1 ${activeStep === 0 ? 'opacity-10' : 'text-yellow-400'}`}><ArrowLeft size={18} /></button>)}
                </div>
              )}
              <div className="bg-[#3e2723] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[160px]">
                <AnimatePresence mode='wait'>
                  {appMode === 'practice' && !quizMode && !lessonFinished && (
                    <motion.div key="p-arrange" className="flex flex-col items-center gap-4 w-full">
                      <div className="text-center px-4">
                        <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Logic Lab</p>
                        <p className="text-white text-[16px] font-bold leading-tight uppercase tracking-tighter">"{currentScenData.mission}"</p>
                      </div>
                      <div className="flex gap-4">
                        <button onClick={validatePractice} disabled={!scenarios[activeScenIdx].items.every(f => f !== null)} className={`bg-orange-500 text-white px-12 py-3 rounded-full font-black uppercase shadow-xl text-[14px] ${!scenarios[activeScenIdx].items.every(f => f !== null) ? 'opacity-20 grayscale cursor-not-allowed' : 'hover:scale-105 active:scale-95'} tracking-widest`}>Verify solution</button>
                        <button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 active:scale-95 tracking-widest">Hint</button>
                      </div>
                    </motion.div>
                  )}
                  {quizMode && !lessonFinished && (
                    <motion.div key="quiz-options" className="w-full flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                        {currentQuizSet[quizStep]?.options.map((opt, idx) => {
                          let variant = "bg-black/40 border-transparent text-white/80";
                          if (quizFeedbackMode) {
                            if (idx === quizSelection) variant = quizSelection === currentQuizSet[quizStep].correct ? "bg-green-600 border-green-400 text-white" : "bg-rose-600 border-rose-400 text-white";
                            else variant = "bg-black/20 border-transparent text-white/20";
                          }
                          return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-4 rounded-xl font-black uppercase transition-all text-[14px] border-2 ${variant} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
                        })}
                      </div>
                      {quizFeedbackMode && (
                        <div className="flex flex-col items-center gap-3 w-full pt-2">
                          {showExplanation && (<div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/30 w-full text-center"><p className="text-white text-[13px] font-bold italic leading-tight">{currentQuizSet[quizStep]?.explanation}</p></div>)}
                          <div className="flex gap-3">
                            {quizSelection === currentQuizSet[quizStep].correct ? (<button onClick={nextQuizStep} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[13px] tracking-widest">Next Question</button>) : (<button onClick={() => {setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false);}} className="bg-rose-600 text-white px-12 py-3 rounded-full font-black uppercase text-[13px] tracking-widest">Try Again</button>)}
                            {!showExplanation && (<button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-10 py-3 rounded-full font-black uppercase text-[13px] tracking-widest">Explanation</button>)}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                  {appMode === 'concept' && conceptPhase === 'interaction' && !quizMode && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="bg-black/30 p-4 rounded-xl border-l-4 border-yellow-400 w-full shadow-lg">
                        <p className="text-yellow-400 text-[10px] font-black uppercase tracking-widest opacity-60">Logic Breakdown</p>
                        <p className="text-white text-[15px] font-bold italic mb-4">{getDynamicInstruction()}</p>
                        <div className="flex justify-end"><button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`px-10 py-3 rounded-full font-black uppercase text-[12px] ${stepStatus === 'correct' ? 'bg-green-600 text-white' : 'bg-white/5 text-white/20'}`}>Verify Step</button></div>
                      </div>
                    </div>
                  )}
                  {appMode === 'concept' && conceptPhase === 'finalCheck' && !quizMode && (
                    <div className="text-center flex flex-col items-center gap-3">
                      <div className="bg-yellow-400/20 p-5 rounded-xl border border-yellow-400/50"><p className="text-green-400 font-black text-[12px] mb-2 tracking-widest">Final Validation: {finalValidationTimer}s</p><p className="text-white text-[15px] font-bold">Check Row 1 against all clues one last time. No more help from strike-outs!</p></div>
                      {finalValidationTimer === 0 && <button onClick={() => setQuizMode(true)} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[14px] animate-bounce">Submit Arrangement</button>}
                    </div>
                  )}
                  {appMode === 'concept' && conceptPhase === 'start' && (<button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-16 py-4 rounded-full font-black uppercase shadow-xl">Begin Lesson</button>)}
                  {lessonFinished && (
                    <div className="text-center flex flex-col items-center gap-3">
                      <Trophy size={60} className="text-yellow-400 animate-bounce" />
                      <h3 className="text-white text-[20px] font-black uppercase">{appMode === 'concept' ? "Academy Mastered!" : "Laboratory Complete!"}</h3>
                      <button onClick={() => appMode === 'concept' ? setAppMode('practice') : handleReset('practice')} className="bg-green-600 text-white px-12 py-4 rounded-full font-black uppercase shadow-xl tracking-widest">Next Challenge</button>
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