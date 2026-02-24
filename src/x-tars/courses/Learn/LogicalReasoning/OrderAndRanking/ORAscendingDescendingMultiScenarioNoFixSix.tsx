// // import React, { useState, useEffect, useRef } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   ChevronLeft,
// //   RotateCcw,
// //   Trophy,
// //   Target,
// //   X,
// //   ArrowRight,
// //   ArrowLeft,
// //   BookOpen,
// //   Layers,
// //   Plus,
// //   Trash2,
// //   UserCircle,
// //   UserCheck,
// //   UserMinus,
// //   UserPlus,
// //   User,
// //   ShoppingCart,
// //   XCircle,
// //   ArrowRightCircle,
// //   ArrowLeftCircle,
// //   Timer,
// //   Check,
// //   Square,
// //   CheckSquare,
// //   HelpCircle,
// //   Zap,
// //   Activity,
// //   Gauge,
// //   Wind,
// //   Car as CarIcon
// // } from 'lucide-react';
// // import { HashRouter as Router, useNavigate } from 'react-router-dom';

// // // ==========================================
// // // DATA & CONFIG
// // // ==========================================
// // const ALL_PEOPLE = [
// //   { id: 'J', name: 'J', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
// //   { id: 'K', name: 'K', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
// //   { id: 'L', name: 'L', icon: User, color: 'from-emerald-600 to-emerald-800' },
// //   { id: 'M', name: 'M', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
// //   { id: 'N', name: 'N', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
// //   { id: 'O', name: 'O', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' },
// //   { id: 'P', name: 'P', icon: Target, color: 'from-orange-600 to-orange-800' },
// //   { id: 'T', name: 'T', icon: CarIcon, color: 'from-slate-600 to-slate-800' },
// //   { id: 'U', name: 'U', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
// //   { id: 'V', name: 'V', icon: Gauge, color: 'from-red-600 to-red-800' },
// //   { id: 'W', name: 'W', icon: Wind, color: 'from-cyan-600 to-cyan-800' },
// //   { id: 'X', name: 'X', icon: Activity, color: 'from-orange-600 to-orange-800' },
// //   { id: 'Y', name: 'Y', icon: MilestoneIcon, color: 'from-pink-600 to-pink-800' },
// //   // Practice Items
// //   { id: 'A', name: 'A', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
// //   { id: 'B', name: 'B', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
// //   { id: 'C', name: 'C', icon: User, color: 'from-emerald-600 to-emerald-800' },
// //   { id: 'D', name: 'D', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
// //   { id: 'E', name: 'E', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
// //   { id: 'F', name: 'F', icon: Activity, color: 'from-orange-600 to-orange-800' },
// //   { id: 'G', name: 'G', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' }
// // ];

// // function UsersIcon(props) {
// //   return (
// //     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
// //     </svg>
// //   );
// // }

// // function MilestoneIcon(props) {
// //   return (
// //     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
// //       <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" /><path d="M12 13v8" /><path d="M12 3v3" />
// //     </svg>
// //   );
// // }

// // const LOGIC_DATA = {
// //   concept: {
// //     clues: [
// //       { id: 1, text: "1. T gives more mileage than V." },
// //       { id: 2, text: "2. W gives more mileage than X, which gives more than V." },
// //       { id: 3, text: "3. U gives more mileage than T." },
// //       { id: 4, text: "4. As many cars give more mileage than V as less than W." },
// //       { id: 5, text: "5. V doesn’t give the lowest mileage." },
// //       { id: 6, text: "6. U gives more mileage than W whereas X gives less than T." },
// //       { id: 7, text: "7. The car with the second lowest mileage gives 50 KMPL." }
// //     ],
// //     teachingSteps: [
// //       { 
// //         id: "step-1",
// //         selectionPrompt: "Observe all clues. Since we have no fixed starting ranks, which clue allows us to build a symmetrical framework to start testing?",
// //         options: ["Clue 1", "Clue 2", "Clue 3", "Clue 4", "Clue 5", "Clue 6", "Clue 7"],
// //         correct: 3,
// //         feedback: [
// //           "Clue 1 is a simple comparison. It doesn't help establish where cars sit on the 1-6 rank scale.",
// //           "Clue 2 is great for chaining, but we need an anchor point first before we can place W or V.",
// //           "Clue 3 is just a relative link between two cars. It doesn't build a structural frame.",
// //           "Correct! Clue 4 introduces 'Symmetry'. It links the counts at both ends (Above V = Below W), giving us a mirrored skeleton to test!",
// //           "Clue 5 is a negative rule. Useful for filtering, but not for building an initial framework.",
// //           "Clue 6 is a double relative comparison. Too complex for our very first anchor point.",
// //           "Clue 7 gives a value (50 KMPL) but doesn't tell us which car it is. We need a positional anchor first."
// //         ],
// //         why: "Clue 4 links the two ends of our list. In a 6-car race, if 'Above V = Below W', it restricts them to specific pairs. We create 4 scenarios to test every possible mirrored position where this balance holds true.",
// //         instruction: "Step 1: Symmetry Branching. Create 4 scenarios using '+'. Place mirrored pairs: R1:(V:5,W:2), R2:(V:4,W:3), R3:(V:3,W:4), R4:(V:2,W:5). In all these cases, # higher than V equals # lower than W.", 
// //         forceMultiScenario: true,
// //         clueIndices: [3, 4],
// //         targetAction: [] 
// //       },
// //       { 
// //         id: "step-2",
// //         selectionPrompt: "We have 4 hypothesized rows. Which instruction helps us filter the impossible ones by checking the chain W > X > V?",
// //         options: ["Clue 2", "Clue 3", "Clue 6"],
// //         correct: 0,
// //         feedback: [
// //           "Correct! Clue 2 says W > X > V. This means there MUST be at least one empty spot between W and V for Car X to sit.",
// //           "Clue 3 doesn't involve W or V directly, so it can't tell us if our current W/V pairs are impossible.",
// //           "Clue 6 involves W, but it doesn't give us the specific chain needed to eliminate rows based on Car X."
// //         ],
// //         why: "Clue 2 says W > X > V. This requires a gap between W and V. In R2, R3, and R4, they are too close or reversed. Only Row 1 (W:2, V:5) leaves room for X!",
// //         instruction: "Step 2: Elimination. Check Scenarios 2, 3, and 4. Mark them as 'Invalid' because they leave no room for Car X. Narrow the solution down to Row 1.", 
// //         clueIndices: [1],
// //         isEliminationStep: true,
// //         targetAction: [] 
// //       },
// //       { 
// //         id: "step-3",
// //         selectionPrompt: "Focusing on Row 1 (W:2, V:5), which clue helps us identify the car that takes the absolute lead at Rank 1?",
// //         options: ["Clue 3", "Clue 6"],
// //         correct: 1,
// //         feedback: [
// //           "Clue 3 says U > T, but we don't know where T is yet. This doesn't guarantee U is at Rank 1.",
// //           "Correct! Clue 6 states U > W. Since W is already at Rank 2, and Rank 1 is the only spot higher, Car U must be the winner!"
// //         ],
// //         why: "Clue 6 states U > W. Since W is Rank 2, and Rank 1 is the only remaining higher spot, U is locked into 1st place.",
// //         instruction: "Step 3: The Winner. In valid Row 1, place Car U at Rank 1.", 
// //         clueIndices: [5],
// //         targetAction: [{ itemId: 'U', slot: 0 }]
// //       },
// //       { 
// //         id: "step-4",
// //         selectionPrompt: "Ranks 3, 4, and 6 are still empty in Row 1. Which clues chain T, X, and Y into place?",
// //         options: ["Clue 1 & 6", "Clue 3"],
// //         correct: 0,
// //         feedback: [
// //           "Correct! Clue 6 says X < T, and Clue 1 says T > V. Chaining them: U(1) > W(2) > T(3) > X(4) > V(5). Car Y fills the only spot left at Rank 6!",
// //           "Clue 3 confirms U > T, which is consistent, but Clues 1 & 6 are the ones that actually define the positions for the remaining empty slots."
// //         ],
// //         why: "Clues 1 and 6 chain the remaining cars. T must be between W and X, and X must be between T and V. This leaves only Rank 6 for Car Y.",
// //         instruction: "Final Step: Completion. Place T at Rank 3, X at Rank 4, and Car Y at Rank 6 in Row 1 to finish the academy.", 
// //         clueIndices: [0, 2, 5],
// //         targetAction: [{ itemId: 'T', slot: 2 }, { itemId: 'X', slot: 3 }, { itemId: 'Y', slot: 5 }]
// //       }
// //     ],
// //     postQuiz: [
// //       { q: "Which car gives the absolute highest mileage?", options: ["Car W", "Car U", "Car T"], correct: 1, explanation: "U is 1st, sitting above W (2nd) and T (3rd)." },
// //       { q: "How many cars give more mileage than car T?", options: ["One", "Two", "Three"], correct: 1, explanation: "Car T is rank 3. U (1st) and W (2nd) are both higher." }
// //     ]
// //   },
// //   practice: [
// //     {
// //       id: 'scen-practice-mirror',
// //       title: "The Building Heights Lab",
// //       mission: "Arrange 6 Buildings from Tallest (1) to Shortest (6).",
// //       clues: [
// //         { id: 1, text: "1. Building B is taller than Building D." },
// //         { id: 2, text: "2. Building E is taller than F, which is taller than D." },
// //         { id: 3, text: "3. Building G is taller than B." },
// //         { id: 4, text: "4. As many buildings are taller than D as shorter than E." },
// //         { id: 5, text: "5. Building D isn't the shortest." },
// //         { id: 6, text: "6. Building G is taller than E whereas F is shorter than B." }
// //       ],
// //       targetOrder: ['G', 'E', 'B', 'F', 'D', 'A'],
// //       quiz: [
// //         { q: "Which building is the tallest?", options: ["Building G", "Building E", "Building B"], correct: 0, explanation: "Mirroring the concept logic: G > E > B > F > D > A. Building G is tallest." },
// //         { q: "How many buildings are shorter than Building B?", options: ["Two", "Three", "Four"], correct: 1, explanation: "B is 3rd tallest. Buildings F(4), D(5), and A(6) are shorter. Total 3." }
// //       ]
// //     }
// //   ]
// // };

// // // ==========================================
// // // SUB-COMPONENTS
// // // ==========================================

// // function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
// //   return (
// //     <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10">
// //       <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
// //         <div className="flex flex-col items-start leading-tight">
// //           <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
// //             <ChevronLeft size={12} /> Dashboard
// //           </button>
// //           <span className="text-white font-black uppercase text-[16px] truncate max-w-[150px] sm:max-w-none">
// //             {title}
// //           </span>
// //         </div>
// //         <div className="flex items-center gap-2">
// //           <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
// //             <button onClick={() => setAppMode('concept')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
// //             <button onClick={() => setAppMode('practice')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
// //           </div>
// //           <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all"><RotateCcw size={16} /></button>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // }

// // export default function LabContent() {
// //   const navigate = useNavigate();
// //   const [appMode, setAppMode] = useState('concept');
// //   const [conceptPhase, setConceptPhase] = useState('start'); 
// //   const [scanningTimer, setScanningTimer] = useState(30);
// //   const [finalValidationTimer, setFinalValidationTimer] = useState(30);

// //   const [activeStep, setActiveStep] = useState(0);
// //   const [completedClues, setCompletedClues] = useState([]);
// //   const [manualStrikes, setManualStrikes] = useState([]);
// //   const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
// //   const [stepStatus, setStepStatus] = useState('idle');

// //   const [scenarios, setScenarios] = useState([{ id: 101, items: new Array(6).fill(null), markedInvalid: false }]);
// //   const [activeScenIdx, setActiveScenIdx] = useState(0);
// //   const [invalidCount, setInvalidCount] = useState(0);
  
// //   const [practiceStatus, setPracticeStatus] = useState('idle');
// //   const [showExplanation, setShowExplanation] = useState(false);

// //   const [quizMode, setQuizMode] = useState(false);
// //   const [quizStep, setQuizStep] = useState(0);
// //   const [quizSelection, setQuizSelection] = useState(null);
// //   const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
// //   const [lessonFinished, setLessonFinished] = useState(false);

// //   const containerRef = useRef(null);

// //   const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice[0];
// //   const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice[0].quiz;

// //   // ==========================================
// //   // HANDLERS
// //   // ==========================================

// //   function handleReset(targetMode) {
// //     const mode = targetMode || appMode;
// //     const slotCount = 6;
// //     setScenarios([{ id: 101, items: new Array(slotCount).fill(null), markedInvalid: false }]);
// //     setActiveScenIdx(0);
// //     setActiveStep(0);
// //     setCompletedClues([]);
// //     setManualStrikes([]);
// //     setFeedback({ type: null, msg: "", reason: "" });
// //     setStepStatus('idle');
// //     setConceptPhase('start');
// //     setScanningTimer(30);
// //     setFinalValidationTimer(30);
// //     setPracticeStatus('idle');
// //     setShowExplanation(false);
// //     setQuizMode(false);
// //     setQuizStep(0);
// //     setQuizSelection(null);
// //     setQuizFeedbackMode(false);
// //     setLessonFinished(false);
// //     setInvalidCount(0);
// //   }

// //   function handleSetMode(mode) {
// //     setAppMode(mode);
// //     handleReset(mode);
// //   }

// //   function handleAddScenario() {
// //     if (scenarios.length >= 4 && appMode === 'concept') return;
// //     const nextId = scenarios[scenarios.length - 1].id + 1;
// //     const currentItems = [...scenarios[activeScenIdx].items];
// //     setScenarios([...scenarios, { id: nextId, items: currentItems, markedInvalid: false }]);
// //     setActiveScenIdx(scenarios.length);
// //   }

// //   function handleRemoveScenario(idx) {
// //     if (scenarios.length === 1) return;
// //     const targetScen = scenarios[idx];
// //     const validCountRemaining = scenarios.filter(s => !s.markedInvalid).length;
// //     if (validCountRemaining === 1 && !targetScen.markedInvalid) {
// //         setFeedback({ type: 'error', msg: "Protection!", reason: "You cannot delete your only potentially valid logic row." });
// //         return;
// //     }
// //     const next = scenarios.filter((_, i) => i !== idx);
// //     setScenarios(next);
// //     setActiveScenIdx(0);
// //   }

// //   function toggleManualStrike(idx) {
// //     if (appMode !== 'practice') return;
// //     setManualStrikes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
// //   }

// //   function handleMarkInvalid(idx) {
// //     if (appMode !== 'concept' || activeStep !== 1) return;
// //     const row = scenarios[idx].items;
// //     const wPos = row.indexOf('W');
// //     const vPos = row.indexOf('V');
    
// //     // Logic: Clue 2 says W > X > V. Needs space for X (gap >= 2).
// //     const gap = vPos - wPos;
// //     const isImpossible = gap < 2 || wPos >= vPos;
    
// //     if (isImpossible && wPos !== -1 && vPos !== -1) {
// //         const nextScenarios = [...scenarios];
// //         nextScenarios[idx].markedInvalid = true;
// //         setScenarios(nextScenarios);
// //         const nextInvalidCount = nextScenarios.filter(s => s.markedInvalid).length;
// //         setInvalidCount(nextInvalidCount);
// //         setFeedback({ type: 'success', msg: "Correct!", reason: "Row eliminated. Car X cannot fit between W and V here." });
        
// //         if (nextInvalidCount >= 3) {
// //             setStepStatus('correct');
// //         }
// //     } else {
// //         setFeedback({ type: 'error', msg: "Check Logic!", reason: "In Row 1 (W:2, V:5), there IS room for Car X. Check the other rows!" });
// //     }
// //   }

// //   function handleSelectionQuiz(idx) {
// //     const step = currentScenData.teachingSteps[activeStep];
// //     if (idx === step.correct) {
// //       setFeedback({ type: 'success', msg: "Brilliant!", reason: step.why });
// //       setConceptPhase('interaction');
// //     } else {
// //       const errorMsg = step.feedback ? step.feedback[idx] : "Not quite. Think about which clue builds structure.";
// //       setFeedback({ type: 'error', msg: "Think Again.", reason: errorMsg });
// //     }
// //   }

// //   function handleQuizSelection(idx) {
// //     setQuizSelection(idx);
// //     setQuizFeedbackMode(true);
// //   }

// //   function handleDragStart() {
// //     setFeedback({ type: null, msg: "", reason: "" });
// //   }

// //   function nextQuizStep() {
// //     if (quizStep < currentQuizSet.length - 1) {
// //       setQuizStep(quizStep + 1);
// //       setQuizSelection(null);
// //       setQuizFeedbackMode(false);
// //       setShowExplanation(false);
// //     } else {
// //       setLessonFinished(true);
// //       setQuizMode(false);
// //       if (appMode === 'concept') {
// //           handleSetMode('practice');
// //       }
// //     }
// //   }

// //   function prevStep() {
// //     if (appMode === 'concept' && conceptPhase === 'interaction') {
// //         setConceptPhase('selecting');
// //         setFeedback({ type: null, msg: "", reason: "" });
// //         setStepStatus('idle');
// //     } else if (activeStep > 0) {
// //       setActiveStep(activeStep - 1);
// //       setConceptPhase('interaction');
// //       setStepStatus('correct');
// //       setFeedback({ type: null, msg: "", reason: "" });
// //     }
// //   }

// //   function nextStep() {
// //     const steps = currentScenData.teachingSteps;
// //     if (steps[activeStep]?.clueIndices) {
// //       setCompletedClues(prev => {
// //         const next = [...prev];
// //         steps[activeStep].clueIndices.forEach(idx => { if (!next.includes(idx)) next.push(idx); });
// //         return next;
// //       });
// //     }
// //     if (activeStep < steps.length - 1) {
// //       setActiveStep(activeStep + 1);
// //       setStepStatus('idle');
// //       setFeedback({ type: null, msg: "", reason: "" });
// //       setConceptPhase('selecting');
// //     } else {
// //       setConceptPhase('finalCheck');
// //       setStepStatus('idle');
// //     }
// //   }

// //   function handleDragEnd(event, info, itemId, sourceScenId, sourceIndex) {
// //     if (quizMode || lessonFinished || (appMode === 'concept' && conceptPhase !== 'interaction')) return;
    
// //     const dragX = info.point.x;
// //     const dragY = info.point.y;
    
// //     // REQUIREMENT: Only the active scenario row can accept drops.
// //     const activeScenId = scenarios[activeScenIdx].id;
// //     const activeRowSlots = document.querySelectorAll(`[data-branch-id="${activeScenId}"][data-slot-idx]`);
    
// //     let targetSlotIdx = -1;
// //     let minDist = 1000;

// //     activeRowSlots.forEach((slot) => {
// //       const rect = slot.getBoundingClientRect();
// //       const centerX = rect.left + window.scrollX + rect.width / 2;
// //       const centerY = rect.top + window.scrollY + rect.height / 2;
      
// //       const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      
// //       if (dist < 150 && dist < minDist) { 
// //           minDist = dist; 
// //           targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); 
// //       }
// //     });

// //     if (targetSlotIdx !== -1) {
// //       const currentActiveItems = [...scenarios[activeScenIdx].items];
// //       if (currentActiveItems[targetSlotIdx] !== null && currentActiveItems[targetSlotIdx] !== itemId) {
// //         setFeedback({ type: 'error', msg: "Slot Full!", reason: "You must remove the car currently there first." });
// //         return;
// //       }

// //       const newScenarios = [...scenarios];
// //       if (sourceScenId !== null) {
// //           const sIdx = scenarios.findIndex(s => s.id === Number(sourceScenId));
// //           if (sIdx !== -1) {
// //               const sourceRow = [...newScenarios[sIdx].items];
// //               sourceRow[sourceIndex] = null;
// //               newScenarios[sIdx].items = sourceRow;
// //           }
// //       }

// //       const refreshedActiveItems = [...newScenarios[activeScenIdx].items];
// //       const oldIdx = refreshedActiveItems.indexOf(itemId);
// //       if (oldIdx !== -1) refreshedActiveItems[oldIdx] = null;
      
// //       refreshedActiveItems[targetSlotIdx] = itemId;
// //       newScenarios[activeScenIdx].items = refreshedActiveItems;
// //       setScenarios(newScenarios);

// //       if (appMode === 'concept') {
// //         const step = currentScenData.teachingSteps[activeStep];
// //         if (activeStep === 0) {
// //             const pairs = [[4, 1], [3, 2], [2, 3], [1, 4]]; 
// //             const matchedCount = pairs.filter(p => newScenarios.some(r => r.items[p[0]] === 'V' && r.items[p[1]] === 'W')).length;
// //             if (newScenarios.length >= 4 && matchedCount === 4) {
// //                 setStepStatus('correct');
// //                 setFeedback({ type: 'success', msg: "Pairs Placed!", reason: "You have built every theoretical symmetry case. Ready for elimination!" });
// //             }
// //         } else {
// //             const matchesAll = step.targetAction?.every(ta => refreshedActiveItems[ta.slot] === ta.itemId);
// //             if (matchesAll) {
// //                 setStepStatus('correct');
// //                 setFeedback({ type: 'success', msg: "Logic Applied!", reason: "" });
// //             }
// //         }
// //       }
// //     }
// //   }

// //   function getDynamicInstruction() {
// //     if (appMode === 'concept' && activeStep === 0 && conceptPhase === 'interaction') {
// //         const targetPairs = [[4,1], [3,2], [2,3], [1,4]];
// //         const found = targetPairs.filter(tp => scenarios.some(s => s.items[tp[0]] === 'V' && s.items[tp[1]] === 'W')).length;
// //         if (found < 4) return `I see ${found} symmetry pair(s). Click '+' until you have 4 rows total and fill them: R1:(V:5,W:2), R2:(V:4,W:3), R3:(V:3,W:4), R4:(V:2,W:5).`;
// //     }
// //     return currentScenData?.teachingSteps[activeStep]?.instruction || "";
// //   }

// //   function validatePractice() {
// //     const currentOrder = scenarios[activeScenIdx].items.join(',');
// //     const targetOrder = LOGIC_DATA.practice[0].targetOrder.join(',');
// //     if (currentOrder === targetOrder) { setPracticeStatus('correct'); setQuizMode(true); }
// //     else {
// //       setPracticeStatus('wrong');
// //       setFeedback({ type: 'error', msg: "Logic Mismatch", reason: "Check clues again. Your arrangement doesn't follow the logic chain!" });
// //     }
// //   }

// //   useEffect(() => {
// //     let interval;
// //     if (conceptPhase === 'scanning' && scanningTimer > 0) interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
// //     else if (conceptPhase === 'scanning' && scanningTimer === 0) setConceptPhase('selecting');
// //     return () => clearInterval(interval);
// //   }, [conceptPhase, scanningTimer]);

// //   useEffect(() => {
// //     let interval;
// //     if (appMode === 'concept' && conceptPhase === 'finalCheck' && finalValidationTimer > 0) interval = setInterval(() => setFinalValidationTimer(t => t - 1), 1000);
// //     return () => clearInterval(interval);
// //   }, [conceptPhase, finalValidationTimer, appMode]);

// //   return (
// //     <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none overflow-hidden font-sans text-[14px]" ref={containerRef}>
// //       <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

// //       <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Mileage Reasoning Academy" : "Comparative Laboratory"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset()} />

// //       <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
// //         <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
// //           <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
// //             <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1"><Layers size={14} /> Logic Tray</div>
// //             <div className="flex flex-col gap-5">
// //               <AnimatePresence>
// //                 {scenarios.map((scen, sIdx) => {
// //                   if (appMode === 'concept' && conceptPhase === 'finalCheck' && scen.markedInvalid) return null;
// //                   const isActive = sIdx === activeScenIdx;
// //                   const stepIsElimination = appMode === 'concept' && activeStep === 1 && conceptPhase === 'interaction';
                  
// //                   return (
// //                     <motion.div key={scen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
// //                       className={`relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shadow-inner transition-all
// //                     ${isActive ? 'border-yellow-500 shadow-xl z-20 scale-[1.01]' : 'border-black/20 opacity-30 grayscale cursor-pointer'}`}
// //                       onClick={() => !scen.markedInvalid && setActiveScenIdx(sIdx)}
// //                     >
// //                       <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
// //                         <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
// //                           <ArrowLeftCircle size={16} /> Highest
// //                         </div>
// //                         {isActive && !quizMode && (
// //                           <div className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-md uppercase tracking-widest">Active Hypothesis {sIdx + 1}</div>
// //                         )}
// //                         <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
// //                           Lowest <ArrowRightCircle size={16} />
// //                         </div>
// //                       </div>

// //                       {scen.markedInvalid && (
// //                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-[1.5rem]">
// //                           <XCircle className="text-rose-500/60" size={60} strokeWidth={3} />
// //                         </div>
// //                       )}

// //                       {stepIsElimination && !scen.markedInvalid && sIdx !== 0 && (
// //                         <div className="absolute inset-0 bg-rose-500/5 z-50 flex items-center justify-center cursor-pointer rounded-[1.5rem]" onClick={() => handleMarkInvalid(sIdx)}>
// //                           <div className="bg-rose-600 text-white px-6 py-2 rounded-full font-black text-[12px] uppercase shadow-2xl border-2 border-white/20">Mark Invalid</div>
// //                         </div>
// //                       )}

// //                       {isActive && !quizMode && !lessonFinished && (
// //                         <div className="absolute -right-1 flex flex-col gap-2 z-40">
// //                           <button onClick={(e) => { e.stopPropagation(); handleAddScenario(); }} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Plus size={18} strokeWidth={4} /></button>
// //                           {scenarios.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveScenario(sIdx); }} className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Trash2 size={18} strokeWidth={4} /></button>}
// //                         </div>
// //                       )}

// //                       <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-black/20 -translate-y-1/2 rounded-full z-0" />
// //                       <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4 px-2">
// //                         {scen.items.map((itemId, i) => {
// //                           const itemData = itemId ? ALL_PEOPLE.find(f => f.id === itemId) : null;
// //                           return (
// //                             <div key={i} className="flex flex-col items-center gap-1">
// //                               <div data-branch-id={scen.id} data-slot-idx={i}
// //                                 className={`w-11 h-11 sm:w-20 sm:h-20 rounded-full border-[1px] sm:border-2 flex items-center justify-center relative transition-all duration-300 group
// //                                 ${itemData ? `bg-white border-white shadow-md scale-105` : `border-dashed border-white/10 bg-black/10`}`}
// //                               >
// //                                 {itemData ? (
// //                                   <>
// //                                     <motion.div layoutId={`item-${itemData.id}-${scen.id}`} drag={!lessonFinished && !quizFeedbackMode && !scen.markedInvalid && isActive} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
// //                                       whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, scen.id, i)}
// //                                       className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
// //                                     >
// //                                       <div className="text-white drop-shadow-md">{<itemData.icon size={28} />}</div>
// //                                       <span className="text-[10px] sm:text-[12px] font-black text-white uppercase mt-1 leading-none">{itemData.id}</span>
// //                                     </motion.div>
// //                                     {!quizMode && !lessonFinished && !scen.markedInvalid && isActive && (
// //                                       <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
// //                                         onClick={() => { const n = [...scenarios]; n[sIdx].items[i] = null; setScenarios(n); if (appMode === 'concept') setStepStatus('idle'); }}>
// //                                         <X size={14} strokeWidth={3} className="text-white" />
// //                                       </div>
// //                                     )}
// //                                   </>
// //                                 ) : (
// //                                   <span className={`font-black text-[12px] sm:text-[20px] text-white/10`}>{i + 1}</span>
// //                                 )}
// //                               </div>
// //                               {(appMode === 'concept' && i === 4) && <span className="text-yellow-500 font-black text-[9px] uppercase tracking-tighter leading-none">50 KMPL</span>}
// //                             </div>
// //                           );
// //                         })}
// //                       </div>
// //                     </motion.div>
// //                   );
// //                 })}
// //               </AnimatePresence>
// //             </div>
// //             {/* repository */}
// //             <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
// //               <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none"><ShoppingCart size={14} /> Shared repository</div>
// //               <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
// //                 {ALL_PEOPLE.map((item) => {
// //                   const isPlacedInActive = scenarios[activeScenIdx].items.includes(item.id);
// //                   const isNeeded = appMode === 'concept' ? ['T','U','V','W','X','Y'].includes(item.id) : (appMode === 'practice' ? ['A','B','D','E','F','G'].includes(item.id) : false);
// //                   if (!isNeeded) return null;
// //                   return (
// //                     <div key={`anchor-${item.id}`} className="relative w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-[1px] sm:border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
// //                       {!isPlacedInActive ? (
// //                         <motion.div layoutId={`item-${item.id}-storage`} drag={!quizMode && !lessonFinished && (conceptPhase === 'interaction' || appMode === 'practice') && stepStatus === 'idle'} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
// //                           whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null, null)}
// //                           className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-1 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${item.color} shadow-xl border-white/20 z-10 p-1 sm:p-2 cursor-grab active:cursor-grabbing`}
// //                         >
// //                           <div className="text-white drop-shadow-md">{<item.icon size={24} />}</div>
// //                           <span className="text-[8px] sm:text-[12px] font-black text-white leading-none uppercase">{item.id}</span>
// //                         </motion.div>
// //                       ) : (
// //                         <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-white/5 opacity-10 grayscale pointer-events-none">
// //                           <div className="scale-75 sm:scale-100 opacity-20">{<item.icon size={24} />}</div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           </motion.div>
// //         </div>

// //         {/* Guidance Panel */}
// //         <div className="w-full max-w-7xl bg-[#2a1a16] p-4 rounded-t-[2rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-3 shrink-0">
// //           <div className={`grid grid-cols-1 ${appMode === 'concept' && !quizMode ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-1'} gap-4 sm:gap-8`}>
            
// //             <div className="flex flex-col gap-2 min-h-[160px]">
// //               <div className="flex items-center gap-2 opacity-50">
// //                 {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
// //                 <span className="text-[#a88a6d] font-black uppercase text-[14px]">{quizMode ? "Logic Quest" : "The Clues"}</span>
// //               </div>
// //               <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col gap-2 h-full max-h-[220px] overflow-y-auto custom-scrollbar text-[14px]">
// //                 {quizMode ? (
// //                   <div className="flex flex-col gap-3">
// //                     <span className="text-yellow-400 font-black text-[12px] uppercase opacity-60 tracking-widest tracking-tighter leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
// //                     <p className="text-white text-[18px] font-bold leading-tight">{currentQuizSet[quizStep]?.q}</p>
// //                   </div>
// //                 ) : (
// //                   currentScenData && currentScenData.clues.map((clue, idx) => {
// //                     const isScanning = conceptPhase === 'scanning';
// //                     const isFinalCheck = conceptPhase === 'finalCheck';
// //                     const isPractice = appMode === 'practice';
// //                     const isActiveStepLogic = appMode === 'concept' && !isScanning && !isFinalCheck && currentScenData.teachingSteps[activeStep]?.clueIndices.includes(idx);
                    
// //                     // Highlighting Logic: All stay highlighted in Scanning, FinalCheck, and Practice. In concept steps, all stay visible (Point 5).
// //                     const isHighlighted = isScanning || isFinalCheck || isPractice || appMode === 'concept';

// //                     // Strikethrough Logic
// //                     const isStruck = appMode === 'concept' && !isScanning && !isFinalCheck && completedClues.includes(idx);
// //                     const manualStruck = isPractice && manualStrikes.includes(idx);

// //                     return (
// //                       <div key={idx} className={`flex items-start gap-3 transition-all ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}>
// //                         {appMode === 'practice' ? (
// //                           <button onClick={() => toggleManualStrike(idx)} className="mt-1 shrink-0">
// //                             {manualStrikes.includes(idx) ? <CheckSquare className="text-green-500" size={18} /> : <Square className="text-white/20" size={18} />}
// //                           </button>
// //                         ) : (
// //                           <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isActiveStepLogic ? 'bg-yellow-400' : (isHighlighted ? 'bg-yellow-400' : 'bg-white/10')}`}>
// //                             {isStruck ? <Check size={12} className="text-black" /> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
// //                           </div>
// //                         )}
// //                         <p className={`text-white font-bold leading-tight ${isStruck || manualStruck ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
// //                       </div>
// //                     );
// //                   })
// //                 )}
// //               </div>
// //             </div>

// //             <div className="flex flex-col gap-2">
// //               {appMode === 'concept' && !quizMode && (
// //                 <div className="flex items-center justify-between opacity-50">
// //                   <div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[14px]">Teacher Guidance</span></div>
// //                   {(conceptPhase === 'interaction' || conceptPhase === 'selecting') && (<button onClick={prevStep} className="p-1 text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={18} /></button>)}
// //                 </div>
// //               )}
// //               <div className="bg-[#3e2723] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[160px]">
// //                 <AnimatePresence mode='wait'>
// //                   {appMode === 'concept' && conceptPhase === 'scanning' && (
// //                     <motion.div key="scanning" className="text-center flex flex-col items-center gap-3">
// //                       <Timer size={32} className="text-yellow-400 animate-pulse" />
// //                       <p className="text-white font-bold uppercase tracking-widest text-[16px]">Neutral Analysis Phase: {scanningTimer}s</p>
// //                       <p className="text-white/60 text-center leading-tight px-4 tracking-tighter">Read through all 7 instructions carefully. Look for connections between the mileage rules!</p>
// //                     </motion.div>
// //                   )}

// //                   {appMode === 'concept' && conceptPhase === 'start' && (
// //                     <motion.div key="c-start" className="text-center flex flex-col items-center gap-4">
// //                       <p className="text-white font-medium italic mb-2 text-[16px]">Ready to learn how to solve logic with no absolute starting points?</p>
// //                       <button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-16 py-4 rounded-full font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest">Begin Academy</button>
// //                     </motion.div>
// //                   )}

// //                   {appMode === 'practice' && !quizMode && !lessonFinished && (
// //                     <motion.div key="p-arrange" className="flex flex-col items-center gap-4 w-full text-center">
// //                       <p className="text-white text-[18px] font-bold leading-tight uppercase tracking-tighter">"{currentScenData?.mission}"</p>
// //                       <div className="flex gap-4">
// //                         <button onClick={validatePractice} disabled={!scenarios[activeScenIdx].items.every(f => f !== null)} className={`bg-orange-500 text-white px-12 py-3 rounded-full font-black uppercase shadow-xl text-[14px] ${!scenarios[activeScenIdx].items.every(f => f !== null) ? 'opacity-20 grayscale' : 'hover:scale-105 active:scale-95'}`}>Verify solution</button>
// //                         <button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 active:scale-95">Hint</button>
// //                       </div>
// //                     </motion.div>
// //                   )}

// //                   {quizMode && !lessonFinished && (
// //                     <motion.div key="quiz-ui" className="w-full flex flex-col gap-3">
// //                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
// //                         {currentQuizSet[quizStep]?.options.map((opt, idx) => {
// //                           let style = "bg-black/40 border-transparent text-white/80";
// //                           if (quizFeedbackMode) {
// //                             if (idx === quizSelection) style = quizSelection === currentQuizSet[quizStep].correct ? "bg-green-600 border-green-400 text-white shadow-lg" : "bg-rose-600 border-rose-400 text-white shadow-lg";
// //                             else style = "bg-black/20 border-transparent text-white/20 opacity-40";
// //                           }
// //                           return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-4 rounded-xl font-black uppercase transition-all text-[14px] border-2 ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
// //                         })}
// //                       </div>
// //                       {quizFeedbackMode && (
// //                         <div className="flex flex-col items-center gap-3 w-full pt-2">
// //                           {showExplanation && (<div className="bg-blue-600/10 p-4 rounded-xl border border-blue-500/30 w-full text-center"><p className="text-white text-[13px] font-bold italic leading-tight">{currentQuizSet[quizStep]?.explanation}</p></div>)}
// //                           <div className="flex gap-3">
// //                             {quizSelection === currentQuizSet[quizStep].correct ? (<button onClick={nextQuizStep} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[13px] tracking-widest shadow-xl">Next Question</button>) : (<button onClick={() => {setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false);}} className="bg-rose-600 text-white px-12 py-3 rounded-full font-black uppercase text-[13px] tracking-widest shadow-xl">Try Again</button>)}
// //                             {!showExplanation && (<button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-10 py-3 rounded-full font-black uppercase text-[13px] tracking-widest shadow-xl">Explanation</button>)}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </motion.div>
// //                   )}

// //                   {appMode === 'concept' && !quizMode && (
// //                     <motion.div key="c-guidance" className="w-full">
// //                        {conceptPhase === 'selecting' && (
// //                            <div className="flex flex-col items-center gap-4 text-center">
// //                                <p className="text-yellow-400 text-[11px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Discussion Choice</p>
// //                                <p className="text-white text-[17px] font-bold leading-tight px-2 tracking-tight">{currentScenData.teachingSteps[activeStep].selectionPrompt}</p>
// //                                <div className="flex flex-wrap justify-center gap-2">
// //                                    {currentScenData.teachingSteps[activeStep].options.map((opt, i) => (
// //                                        <button key={i} onClick={() => handleSelectionQuiz(i)} className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-black/60 active:scale-95 transition-all text-[12px]">{opt}</button>
// //                                    ))}
// //                                </div>
// //                                {feedback.type === 'error' && <p className="text-rose-400 text-[12px] font-bold italic animate-pulse">{feedback.reason}</p>}
// //                            </div>
// //                        )}
// //                        {conceptPhase === 'interaction' && (
// //                            <div className="flex flex-col items-center text-center w-full">
// //                                <p className="text-green-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Check size={12}/> Strategy Applied</p>
// //                                <p className="text-white text-[13px] font-bold italic mb-4 opacity-60 px-4 leading-tight">{currentScenData.teachingSteps[activeStep].why}</p>
// //                                <div className="bg-black/30 p-4 rounded-xl border-l-4 border-yellow-400 w-full mb-4 shadow-lg">
// //                                    <p className="text-white text-[15px] font-bold leading-tight">{getDynamicInstruction()}</p>
// //                                </div>
// //                                <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`px-12 py-3 rounded-full font-black uppercase text-[12px] transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Complete Step</button>
// //                            </div>
// //                        )}
// //                        {conceptPhase === 'finalCheck' && (
// //                            <div className="text-center flex flex-col items-center gap-3">
// //                                <div className="bg-yellow-400/20 p-5 rounded-xl border border-yellow-400/50 shadow-2xl"><p className="text-green-400 font-black text-[12px] mb-2 tracking-widest leading-none">Cross-Check Arrangement: {finalValidationTimer}s</p><p className="text-white text-[15px] font-bold tracking-tight">Logic chain completed! Review Row 1 one last time. Does it follow every single rule?</p></div>
// //                                {finalValidationTimer === 0 && <button onClick={() => setQuizMode(true)} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[14px] animate-bounce tracking-widest shadow-xl">Submit Arrangement</button>}
// //                            </div>
// //                        )}
// //                     </motion.div>
// //                   )}
                  
// //                   {lessonFinished && (
// //                     <div className="text-center flex flex-col items-center gap-3">
// //                       <Trophy size={60} className="text-yellow-400 animate-pulse" />
// //                       <h3 className="text-white text-[20px] font-black uppercase tracking-tight">{appMode === 'concept' ? "Academy Mastered!" : "Laboratory Complete!"}</h3>
// //                       <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-12 py-4 rounded-full font-black uppercase shadow-xl tracking-widest">Next Challenge</button>
// //                     </div>
// //                   )}
// //                 </AnimatePresence>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>

// //       <style dangerouslySetInnerHTML={{ __html: `
// //         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
// //         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.01); }
// //         .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
// //       `}} />
// //     </div>
// //   );
// // }

// // // export default function App() { return ( <Router> <LabContent /> </Router> ); }


// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   RotateCcw,
//   Trophy,
//   Target,
//   X,
//   ArrowRight,
//   ArrowLeft,
//   BookOpen,
//   Layers,
//   Plus,
//   Trash2,
//   UserCircle,
//   UserCheck,
//   UserMinus,
//   UserPlus,
//   User,
//   ShoppingCart,
//   XCircle,
//   ArrowRightCircle,
//   ArrowLeftCircle,
//   Timer,
//   Check,
//   Square,
//   CheckSquare,
//   HelpCircle,
//   Zap,
//   Activity,
//   Gauge,
//   Wind,
//   Car as CarIcon
// } from 'lucide-react';
// import { HashRouter as Router, useNavigate } from 'react-router-dom';

// // ==========================================
// // ICONS
// // ==========================================

// function UsersIcon(props) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
//     </svg>
//   );
// }

// function MilestoneIcon(props) {
//   return (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" /><path d="M12 13v8" /><path d="M12 3v3" />
//     </svg>
//   );
// }

// // ==========================================
// // SUB-COMPONENTS
// // ==========================================

// function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
//   return (
//     <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm">
//       <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
//         <div className="flex flex-col items-start leading-tight">
//           <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
//             <ChevronLeft size={12} /> Dashboard
//           </button>
//           <span className="text-white font-black uppercase text-[16px] truncate max-w-[150px] sm:max-w-none">
//             {title}
//           </span>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
//             <button onClick={() => setAppMode('concept')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black' : 'text-[#a88a6d] hover:text-white'}`}>Academy</button>
//             <button onClick={() => setAppMode('practice')} className={`px-3 py-1 rounded-md text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
//           </div>
//           <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all"><RotateCcw size={16} /></button>
//         </div>
//       </div>
//     </header>
//   );
// }

// // ==========================================
// // DATA & CONFIG
// // ==========================================
// const ALL_PEOPLE = [
//   { id: 'J', name: 'J', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
//   { id: 'K', name: 'K', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
//   { id: 'L', name: 'L', icon: User, color: 'from-emerald-600 to-emerald-800' },
//   { id: 'M', name: 'M', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
//   { id: 'N', name: 'N', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
//   { id: 'O', name: 'O', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' },
//   { id: 'P', name: 'P', icon: Target, color: 'from-orange-600 to-orange-800' },
//   { id: 'T', name: 'T', icon: CarIcon, color: 'from-slate-600 to-slate-800' },
//   { id: 'U', name: 'U', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
//   { id: 'V', name: 'V', icon: Gauge, color: 'from-red-600 to-red-800' },
//   { id: 'W', name: 'W', icon: Wind, color: 'from-cyan-600 to-cyan-800' },
//   { id: 'X', name: 'X', icon: Activity, color: 'from-orange-600 to-orange-800' },
//   { id: 'Y', name: 'Y', icon: MilestoneIcon, color: 'from-pink-600 to-pink-800' },
//   // Practice Items
//   { id: 'A', name: 'A', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
//   { id: 'B', name: 'B', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
//   { id: 'C', name: 'C', icon: User, color: 'from-emerald-600 to-emerald-800' },
//   { id: 'D', name: 'D', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
//   { id: 'E', name: 'E', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
//   { id: 'F', name: 'F', icon: Activity, color: 'from-orange-600 to-orange-800' },
//   { id: 'G', name: 'G', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' }
// ];

// const LOGIC_DATA = {
//   concept: {
//     clues: [
//       { id: 1, text: "1. T gives more mileage than V." },
//       { id: 2, text: "2. W gives more mileage than X, which gives more than V." },
//       { id: 3, text: "3. U gives more mileage than T." },
//       { id: 4, text: "4. As many cars give more mileage than V as less than W." },
//       { id: 5, text: "5. V doesn’t give the lowest mileage." },
//       { id: 6, text: "6. U gives more mileage than W whereas X gives less than T." },
//       { id: 7, text: "7. The car with the second lowest mileage gives 50 KMPL." }
//     ],
//     teachingSteps: [
//       { 
//         id: "step-1",
//         selectionPrompt: "Observe all clues. Which instruction establishes a 'Mirror Rule' (Symmetry) to create a structural frame?",
//         options: ["Clue 1", "Clue 2", "Clue 3", "Clue 4", "Clue 5", "Clue 6", "Clue 7"],
//         correct: 3,
//         why: "Clue 4 links both ends of the list by mirroring counts. Click 'Complete Step' to start placing cars.",
//         clueIndices: [3],
//         targetAction: [] 
//       },
//       { 
//         id: "step-2-where-w",
//         selectionPrompt: "Let's find a rank for W. Drag Car W from the repository to Rank 2 in Scenario 1.",
//         instruction: "Interactivity: Drag Car W to Rank 2. (Rank 1 is impossible due to Clue 5).",
//         clueIndices: [3, 4],
//         interactionType: 'placement-w',
//         why: "If W is at 1, V is Rank 6 (last) per Clue 4. But Clue 5 says V is NOT last! Place W at Rank 2.",
//         feedback: {
//           wrong: "Oops! If W is at Rank 1 (5 cars lower), V must have 5 cars better (Rank 6). Clue 5 says V is NOT last! Try placing W at Rank 2.",
//           correct: "Correct! Rank 2 is a valid theoretical spot for W. Now we can figure out where V must go."
//         }
//       },
//       { 
//         id: "step-3-mirror-v",
//         selectionPrompt: "W is at Rank 2 (4 cars are lower). Place Car V at the mirrored spot (where 4 cars are faster).",
//         instruction: "Interactivity: Drag V to Rank 5 in Scenario 1. Above V = Below W (4 cars).",
//         clueIndices: [3],
//         interactionType: 'placement-v',
//         why: "Mirror Rule: If W is at 2 (4 slower), V should be at 5 as number of more mileage than V = number of less than W.",
//         feedback: {
//           wrong: "Check the counts! If W is at 2, 4 cars are slower. V must have 4 cars faster than it. Move V to Rank 5.",
//           correct: "Perfect! You've balanced the symmetry."
//         }
//       },
//       { 
//         id: "step-4-other-places",
//         selectionPrompt: "We found (W:2, V:5). Are there other mirrored pairs where V isn't last?",
//         options: ["No, only one pair works", "Yes, multiple pairs"],
//         correct: 1,
//         why: "Correct! We must test all 5 symmetrical pairs. Click '+' to build 5 rows and place all pairs to enable 'Complete Step'.",
//         instruction: "Step 4: Branching. Click '+' until you have 5 rows total. Place mirrored pairs: R1:(V:5,W:2), R2:(V:4,W:3), R3:(V:3,W:4), R4:(V:2,W:5), R5:(V:1,W:6).", 
//         forceMultiScenario: true,
//         maxScenarios: 5,
//         clueIndices: [4],
//         targetAction: [] 
//       },
//       { 
//         id: "step-5-elimination",
//         selectionPrompt: "Which clue helps us eliminate impossible rows by checking the chain W > X > V?",
//         options: ["Clue 2", "Clue 6"],
//         correct: 0,
//         why: "Clue 2 says W > X > V. Only Scenario 1 (W:2, V:5) has a gap. Mark Scenarios 2-5 as 'Invalid' to enable the button.",
//         instruction: "Step 5: Elimination. Mark Scenarios 2, 3, 4, and 5 as 'Invalid' because they leave no room for Car X.", 
//         clueIndices: [1],
//         isEliminationStep: true,
//         targetAction: [] 
//       },
//       { 
//         id: "step-6-winner",
//         selectionPrompt: "Focusing on Row 1 (W:2, V:5), which clue identifies the car at Rank 1?",
//         options: ["Clue 3", "Clue 6"],
//         correct: 1,
//         why: "Clue 6 states U > W. Since W is Rank 2, U must be Rank 1. Place Car U at Rank 1 to enable the button.",
//         instruction: "Step 6: The Winner. In valid Row 1, place Car U at Rank 1.", 
//         clueIndices: [5],
//         targetAction: [{ itemId: 'U', slot: 0 }]
//       },
//       { 
//         id: "step-7-completion",
//         selectionPrompt: "Ranks 3, 4, and 6 are still empty. Which clues chain the final cars T, X, and Y into place?",
//         options: ["Clue 1 & 6", "Clue 3"],
//         correct: 0,
//         why: "Clue 6 says X < T, and Clue 1 says T > V. Place T at 3, X at 4, and Y at 6 to enable the button.",
//         instruction: "Final Step: Completion. In Row 1, place T at Rank 3, X at Rank 4, and Car Y at Rank 6 to finish.", 
//         clueIndices: [0, 2, 5],
//         targetAction: [{ itemId: 'T', slot: 2 }, { itemId: 'X', slot: 3 }, { itemId: 'Y', slot: 5 }]
//       }
//     ],
//     postQuiz: [
//       { q: "Which car gives the absolute highest mileage?", options: ["Car W", "Car U", "Car T"], correct: 1, explanation: "U is 1st, sitting above W (2nd) and T (3rd)." },
//       { q: "How many cars give more mileage than car T?", options: ["One", "Two", "Three"], correct: 1, explanation: "Car T is rank 3. U (1st) and W (2nd) are both higher." }
//     ]
//   },
//   practice: [
//     {
//       id: 'scen-practice-building',
//       title: "Building Height Laboratory",
//       mission: "Arrange 6 Buildings from Tallest (1) to Shortest (6).",
//       clues: [
//         { id: 1, text: "1. Building B is taller than Building D." },
//         { id: 2, text: "2. Building E is taller than F, which is taller than D." },
//         { id: 3, text: "3. Building G is taller than B." },
//         { id: 4, text: "4. As many buildings are taller than D as shorter than E." },
//         { id: 5, text: "5. Building D isn't the shortest." },
//         { id: 6, text: "6. Building G is taller than E whereas F is shorter than B." }
//       ],
//       targetOrder: ['G', 'E', 'B', 'F', 'D', 'A'],
//       quiz: [
//         { q: "Which building is the tallest?", options: ["Building G", "Building E", "Building B"], correct: 0, explanation: "Mirroring academy logic: G > E > B > F > D > A." },
//         { q: "How many buildings are shorter than Building B?", options: ["Two", "Three", "Four"], correct: 1, explanation: "B is 3rd. F(4), D(5), and A(6) are shorter. Total 3." }
//       ]
//     }
//   ]
// };

// // ==========================================
// // MAIN COMPONENT
// // ==========================================

// export default function LabContent() {
//   const navigate = useNavigate();
//   const [appMode, setAppMode] = useState('concept');
//   const [conceptPhase, setConceptPhase] = useState('start'); 
//   const [scanningTimer, setScanningTimer] = useState(30);
//   const [finalValidationTimer, setFinalValidationTimer] = useState(30);

//   const [activeStep, setActiveStep] = useState(0);
//   const [completedClues, setCompletedClues] = useState([]);
//   const [manualStrikes, setManualStrikes] = useState([]);
//   const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
//   const [stepStatus, setStepStatus] = useState('idle');

//   const [scenarios, setScenarios] = useState([{ id: 101, items: new Array(6).fill(null), markedInvalid: false }]);
//   const [activeScenIdx, setActiveScenIdx] = useState(0);
//   const [invalidCount, setInvalidCount] = useState(0);
  
//   const [practiceStatus, setPracticeStatus] = useState('idle');
//   const [showExplanation, setShowExplanation] = useState(false);

//   const [quizMode, setQuizMode] = useState(false);
//   const [quizStep, setQuizStep] = useState(0);
//   const [quizSelection, setQuizSelection] = useState(null);
//   const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
//   const [lessonFinished, setLessonFinished] = useState(false);

//   const containerRef = useRef(null);

//   const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : (LOGIC_DATA.practice ? LOGIC_DATA.practice[0] : null);
//   const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : (LOGIC_DATA.practice ? LOGIC_DATA.practice[0].quiz : []);

//   // ==========================================
//   // CONTINUOUS STEP VALIDATION
//   // ==========================================
//   useEffect(() => {
//     if (appMode !== 'concept' || conceptPhase !== 'interaction') return;

//     const currentRow = scenarios[0].items;
//     const allRows = scenarios;
//     const stepData = currentScenData.teachingSteps[activeStep];
//     const stepId = stepData?.id;

//     let isValid = false;

//     switch (stepId) {
//       case 'step-1':
//         isValid = true;
//         break;
//       case 'step-2-where-w':
//         isValid = currentRow[1] === 'W';
//         break;
//       case 'step-3-mirror-v':
//         isValid = currentRow[1] === 'W' && currentRow[4] === 'V';
//         break;
//       case 'step-4-other-places':
//         const targetPairs = [[4,1], [3,2], [2,3], [1,4], [0,5]];
//         const matchCount = targetPairs.filter(p => allRows.some(r => r.items[p[0]] === 'V' && r.items[p[1]] === 'W')).length;
//         isValid = allRows.length >= 5 && matchCount === 5;
//         break;
//       case 'step-5-elimination':
//         isValid = allRows.filter(s => s.markedInvalid).length >= 4 && !allRows[0].markedInvalid;
//         break;
//       case 'step-6-winner':
//         isValid = allRows[0].items[0] === 'U';
//         break;
//       case 'step-7-completion':
//         const r1 = allRows[0].items;
//         isValid = r1[0] === 'U' && r1[1] === 'W' && r1[2] === 'T' && r1[3] === 'X' && r1[4] === 'V' && r1[5] === 'Y';
//         break;
//       default:
//         isValid = false;
//     }

//     setStepStatus(isValid ? 'correct' : 'idle');
//   }, [scenarios, activeStep, appMode, conceptPhase]);

//   // ==========================================
//   // HELPERS
//   // ==========================================

//   function getDynamicInstruction() {
//     if (appMode === 'concept' && activeStep === 3 && conceptPhase === 'interaction') {
//         const targetPairs = [[4,1], [3,2], [2,3], [1,4], [0,5]];
//         const foundCount = targetPairs.filter(tp => scenarios.some(s => s.items[tp[0]] === 'V' && s.items[tp[1]] === 'W')).length;
//         if (foundCount < 5) return `Progress: ${foundCount}/5 mirror pairs placed. Add 5 rows total and place: R1:(V:5,W:2), R2:(V:4,W:3), R3:(V:3,W:4), R4:(V:2,W:5), R5:(V:1,W:6).`;
//     }
//     return currentScenData?.teachingSteps[activeStep]?.instruction || "";
//   }

//   function validatePractice() {
//     const currentOrder = scenarios[activeScenIdx].items.join(',');
//     const targetOrder = LOGIC_DATA.practice[0].targetOrder.join(',');
//     if (currentOrder === targetOrder) { setPracticeStatus('correct'); setQuizMode(true); }
//     else {
//       setPracticeStatus('wrong');
//       setFeedback({ type: 'error', msg: "Logic Mismatch", reason: "Check clues again. Height chain fails." });
//     }
//   }

//   // ==========================================
//   // HANDLERS
//   // ==========================================

//   function handleReset(targetMode) {
//     const mode = targetMode || appMode;
//     setScenarios([{ id: 101, items: new Array(6).fill(null), markedInvalid: false }]);
//     setActiveScenIdx(0);
//     setActiveStep(0);
//     setCompletedClues([]);
//     setManualStrikes([]);
//     setFeedback({ type: null, msg: "", reason: "" });
//     setStepStatus('idle');
//     setConceptPhase('start');
//     setScanningTimer(30);
//     setFinalValidationTimer(30);
//     setQuizMode(false);
//     setQuizStep(0);
//     setQuizSelection(null);
//     setQuizFeedbackMode(false);
//     setLessonFinished(false);
//     setInvalidCount(0);
//   }

//   function handleSetMode(mode) {
//     setAppMode(mode);
//     handleReset(mode);
//   }

//   function handleAddScenario() {
//     const max = currentScenData?.teachingSteps[activeStep]?.maxScenarios || 5;
//     if (scenarios.length >= max && appMode === 'concept') return;
//     const nextId = Date.now() + Math.random();
//     const currentItems = [...scenarios[activeScenIdx].items];
//     setScenarios([...scenarios, { id: nextId, items: currentItems, markedInvalid: false }]);
//     setActiveScenIdx(scenarios.length);
//   }

//   function handleRemoveScenario(idx) {
//     if (scenarios.length === 1) return;
//     const targetScen = scenarios[idx];
//     const validCountRemaining = scenarios.filter(s => !s.markedInvalid).length;
//     if (validCountRemaining === 1 && !targetScen.markedInvalid) {
//         setFeedback({ type: 'error', msg: "Protection!", reason: "You cannot delete your only potentially valid logic row." });
//         return;
//     }
//     setScenarios(prev => prev.filter((_, i) => i !== idx));
//     setActiveScenIdx(0);
//   }

//   function toggleManualStrike(idx) {
//     if (appMode !== 'practice') return;
//     setManualStrikes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
//   }

//   function handleMarkInvalid(idx) {
//     if (appMode !== 'concept' || activeStep !== 4) return;
//     const row = scenarios[idx].items;
//     const wPos = row.indexOf('W');
//     const vPos = row.indexOf('V');
//     const gap = vPos - wPos;
//     const isImpossible = gap < 2 || wPos >= vPos;
    
//     if (isImpossible && wPos !== -1 && vPos !== -1) {
//         const nextScenarios = [...scenarios];
//         nextScenarios[idx].markedInvalid = true;
//         setScenarios(nextScenarios);
//         const nextInvalidCount = nextScenarios.filter(s => s.markedInvalid).length;
//         setInvalidCount(nextInvalidCount);
//         setFeedback({ type: 'success', msg: "Correct!", reason: "Scenario fails the gap requirement for Car X." });
//     } else {
//         setFeedback({ type: 'error', msg: "Wait!", reason: "Row 1 is logically possible. Mark the others!" });
//     }
//   }

//   function handleSelectionQuiz(idx) {
//     const step = currentScenData.teachingSteps[activeStep];
//     if (idx === step.correct) {
//       setFeedback({ type: 'success', msg: "Excellent Choice!", reason: String(step.why) });
//       setConceptPhase('interaction');
//     } else {
//       const errorMsg = step.feedback ? (Array.isArray(step.feedback) ? step.feedback[idx] : step.feedback) : "Not quite.";
//       setFeedback({ type: 'error', msg: "Think Again.", reason: String(errorMsg) });
//     }
//   }

//   function handleQuizSelection(idx) {
//     setQuizSelection(idx);
//     setQuizFeedbackMode(true);
//   }

//   function handleDragStart() {
//     setFeedback({ type: null, msg: "", reason: "" });
//   }

//   function nextQuizStep() {
//     if (quizStep < currentQuizSet.length - 1) {
//       setQuizStep(quizStep + 1);
//       setQuizSelection(null);
//       setQuizFeedbackMode(false);
//       setShowExplanation(false);
//     } else {
//       setLessonFinished(true);
//       setQuizMode(false);
//       if (appMode === 'concept') handleSetMode('practice');
//     }
//   }

//   function prevStep() {
//     if (appMode === 'concept') {
//       if (conceptPhase === 'interaction') {
//         setConceptPhase('selecting');
//         setFeedback({ type: null, msg: "", reason: "" });
//         setStepStatus('idle');
//       } else if (activeStep > 0) {
//         setActiveStep(activeStep - 1);
//         setConceptPhase('interaction');
//         setStepStatus('correct');
//         setFeedback({ type: null, msg: "" });
//       }
//     }
//   }

//   function nextStep() {
//     const steps = currentScenData.teachingSteps;
//     if (steps[activeStep]?.clueIndices) {
//       setCompletedClues(prev => {
//         const next = [...prev];
//         steps[activeStep].clueIndices.forEach(idx => { if (!next.includes(idx)) next.push(idx); });
//         return next;
//       });
//     }
//     if (activeStep < steps.length - 1) {
//       setActiveStep(activeStep + 1);
//       const nextStepData = steps[activeStep + 1];
//       if (!nextStepData.options) {
//         setConceptPhase('interaction');
//         setStepStatus('idle');
//       } else {
//         setConceptPhase('selecting');
//         setStepStatus('idle');
//       }
//       setFeedback({ type: null, msg: "", reason: "" });
//     } else {
//       setConceptPhase('finalCheck');
//       setStepStatus('idle');
//     }
//   }

//   function handleDragEnd(event, info, itemId, sourceScenId, sourceIndex) {
//     if (quizMode || lessonFinished || (appMode === 'concept' && conceptPhase !== 'interaction')) return;
//     const dragX = info.point.x;
//     const dragY = info.point.y;
//     const activeScenId = scenarios[activeScenIdx].id;
//     const activeRowSlots = document.querySelectorAll(`[data-branch-id="${activeScenId}"][data-slot-idx]`);
//     let targetSlotIdx = -1;
//     let minDist = 1000;
//     activeRowSlots.forEach((slot) => {
//       const rect = slot.getBoundingClientRect();
//       const centerX = rect.left + window.scrollX + rect.width / 2;
//       const centerY = rect.top + window.scrollY + rect.height / 2;
//       const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
//       if (dist < 150 && dist < minDist) { minDist = dist; targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); }
//     });

//     if (targetSlotIdx !== -1) {
//       const step = appMode === 'concept' ? currentScenData.teachingSteps[activeStep] : null;
      
//       if (appMode === 'concept' && step?.interactionType === 'placement-w' && itemId === 'W') {
//         if (targetSlotIdx === 0) {
//            setFeedback({ type: 'error', msg: "Wait!", reason: String(step.feedback.wrong) });
//         } else if (targetSlotIdx === 1) {
//            setFeedback({ type: 'success', msg: "Valid!", reason: String(step.feedback.correct) });
//         }
//       }

//       const currentActiveItems = [...scenarios[activeScenIdx].items];
//       if (currentActiveItems[targetSlotIdx] !== null && currentActiveItems[targetSlotIdx] !== itemId) {
//         setFeedback({ type: 'error', msg: "Slot Occupied!", reason: "Move item first." });
//         return;
//       }

//       const newScenarios = [...scenarios];
//       if (sourceScenId !== null) {
//           const sIdx = scenarios.findIndex(s => s.id === Number(sourceScenId));
//           if (sIdx !== -1) {
//               const sourceRow = [...newScenarios[sIdx].items];
//               sourceRow[sourceIndex] = null;
//               newScenarios[sIdx].items = sourceRow;
//           }
//       }
//       const refreshedActiveItems = [...newScenarios[activeScenIdx].items];
//       const oldIdx = refreshedActiveItems.indexOf(itemId);
//       if (oldIdx !== -1) refreshedActiveItems[oldIdx] = null;
//       refreshedActiveItems[targetSlotIdx] = itemId;
//       newScenarios[activeScenIdx].items = refreshedActiveItems;
//       setScenarios(newScenarios);

//       if (appMode === 'concept') {
//         const wIdx = refreshedActiveItems.indexOf('W');
//         const vMirrorIdx = 5 - wIdx;

//         if (step?.interactionType === 'placement-v' && itemId === 'V') {
//             if (targetSlotIdx === vMirrorIdx && wIdx !== -1) {
//                 setStepStatus('correct');
//                 setFeedback({ type: 'success', msg: "Mirrored!", reason: `Balanced! Since 4 cars are slower than W, V must have 4 faster cars. Click 'Complete Step'.` });
//             } else {
//                 setStepStatus('idle');
//                 setFeedback({ type: 'error', msg: "Check Mirror!", reason: "Check Clue 4. Above V = Below W. Look at W's rank and balance it." });
//             }
//         }
//       }
//     }
//   }

//   // TIMER EFFECT
//   useEffect(() => {
//     let interval;
//     if (conceptPhase === 'scanning' && scanningTimer > 0) {
//       interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
//     } else if (conceptPhase === 'scanning' && scanningTimer === 0) {
//       setConceptPhase('selecting');
//     }
//     return () => clearInterval(interval);
//   }, [conceptPhase, scanningTimer]);

//   useEffect(() => {
//     let interval;
//     if (appMode === 'concept' && conceptPhase === 'finalCheck' && finalValidationTimer > 0) {
//       interval = setInterval(() => setFinalValidationTimer(prev => prev - 1), 1000);
//     }
//     return () => clearInterval(interval);
//   }, [conceptPhase, finalValidationTimer, appMode]);

//   return (
//     <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none overflow-hidden font-sans text-[14px]" ref={containerRef}>
//       <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

//       <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Mileage Reasoning Academy" : "Comparative Laboratory"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset()} />

//       <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
//         <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
//           <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
//             <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1"><Layers size={14} /> Logic Tray</div>
//             <div className="flex flex-col gap-5">
//               <AnimatePresence>
//                 {scenarios.map((scen, sIdx) => {
//                   if (appMode === 'concept' && conceptPhase === 'finalCheck' && scen.markedInvalid) return null;
//                   const isActive = sIdx === activeScenIdx;
//                   const isElimStep = appMode === 'concept' && activeStep === 4 && conceptPhase === 'interaction';
                  
//                   return (
//                     <motion.div key={scen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
//                       className={`relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shadow-inner transition-all
//                     ${isActive ? 'border-yellow-500 shadow-xl z-20 scale-[1.01]' : 'border-black/20 opacity-30 grayscale cursor-pointer'}`}
//                       onClick={() => !scen.markedInvalid && setActiveScenIdx(sIdx)}
//                     >
//                       <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
//                         <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
//                           <ArrowLeftCircle size={16} /> Highest
//                         </div>
//                         {isActive && !quizMode && (
//                           <div className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-md uppercase tracking-widest">Active Hypothesis {sIdx + 1}</div>
//                         )}
//                         <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
//                           Lowest <ArrowRightCircle size={16} />
//                         </div>
//                       </div>

//                       {scen.markedInvalid && (
//                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-[1.5rem]">
//                           <XCircle className="text-rose-500/60" size={60} strokeWidth={3} />
//                         </div>
//                       )}

//                       {isElimStep && !scen.markedInvalid && sIdx !== 0 && (
//                         <div className="absolute inset-0 bg-rose-500/5 z-50 flex items-center justify-center cursor-pointer rounded-[1.5rem]" onClick={() => handleMarkInvalid(sIdx)}>
//                           <div className="bg-rose-600 text-white px-6 py-2 rounded-full font-black text-[12px] uppercase shadow-2xl border-2 border-white/20 tracking-widest">Mark Invalid</div>
//                         </div>
//                       )}

//                       {isActive && !quizMode && !lessonFinished && (
//                         <div className="absolute -right-1 flex flex-col gap-2 z-40">
//                           <button onClick={(e) => { e.stopPropagation(); handleAddScenario(); }} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Plus size={18} strokeWidth={4} /></button>
//                           {scenarios.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveScenario(sIdx); }} className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Trash2 size={18} strokeWidth={4} /></button>}
//                         </div>
//                       )}

//                       <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-black/20 -translate-y-1/2 rounded-full z-0" />
//                       <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4 px-2">
//                         {scen.items.map((itemId, i) => {
//                           const itemData = itemId ? ALL_PEOPLE.find(f => f.id === itemId) : null;
//                           return (
//                             <div key={i} className="flex flex-col items-center gap-1">
//                               <div data-branch-id={scen.id} data-slot-idx={i}
//                                 className={`w-11 h-11 sm:w-20 sm:h-20 rounded-full border-[1px] sm:border-2 flex items-center justify-center relative transition-all duration-300 group
//                                 ${itemData ? `bg-white border-white shadow-md scale-105` : `border-dashed border-white/10 bg-black/10`}`}
//                               >
//                                 {itemData ? (
//                                   <>
//                                     <motion.div layoutId={`item-${itemData.id}-${scen.id}`} drag={!lessonFinished && !quizFeedbackMode && !scen.markedInvalid && isActive} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
//                                       whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, scen.id, i)}
//                                       className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
//                                     >
//                                       <div className="text-white drop-shadow-md">{<itemData.icon size={28} />}</div>
//                                       <span className="text-[10px] sm:text-[12px] font-black text-white uppercase mt-1 leading-none">{itemData.id}</span>
//                                     </motion.div>
//                                     {!quizMode && !lessonFinished && !scen.markedInvalid && isActive && (
//                                       <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
//                                         onClick={() => { const n = [...scenarios]; n[sIdx].items[i] = null; setScenarios(n); if (appMode === 'concept') setStepStatus('idle'); }}>
//                                         <X size={14} strokeWidth={3} className="text-white" />
//                                       </div>
//                                     )}
//                                   </>
//                                 ) : (
//                                   <span className={`font-black text-[12px] sm:text-[20px] text-white/10`}>{i + 1}</span>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </motion.div>
//                   );
//                 })}
//               </AnimatePresence>
//             </div>
//             <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
//               <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none"><ShoppingCart size={14} /> Repository</div>
//               <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
//                 {ALL_PEOPLE.map((item) => {
//                   const isPlacedInActive = scenarios[activeScenIdx].items.includes(item.id);
//                   const isNeeded = appMode === 'concept' ? ['T','U','V','W','X','Y'].includes(item.id) : (appMode === 'practice' ? ['A','B','C','D','E','F','G'].includes(item.id) : false);
//                   if (!isNeeded) return null;
//                   return (
//                     <div key={`anchor-${item.id}`} className="relative w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-[1px] sm:border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
//                       {!isPlacedInActive ? (
//                         <motion.div layoutId={`item-${item.id}-storage`} drag={!quizMode && !lessonFinished && (conceptPhase === 'interaction' || appMode === 'practice') && stepStatus === 'idle'} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
//                           whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null, null)}
//                           className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-1 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${item.color} shadow-xl border-white/20 z-10 p-1 sm:p-2 cursor-grab active:cursor-grabbing`}
//                         >
//                           <div className="text-white drop-shadow-md">{<item.icon size={24} />}</div>
//                           <span className="text-[8px] sm:text-[12px] font-black text-white leading-none uppercase">{item.id}</span>
//                         </motion.div>
//                       ) : (
//                         <div className="w-full h-full rounded-full flex items-center justify-center border-2 border-dashed border-white/5 opacity-10 grayscale pointer-events-none">
//                           <div className="scale-75 sm:scale-100 opacity-20">{<item.icon size={24} />}</div>
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="w-full max-w-7xl bg-[#2a1a16] p-4 rounded-t-[2rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-3 shrink-0">
//           <div className={`grid grid-cols-1 ${appMode === 'concept' && !quizMode ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-1'} gap-4 sm:gap-8`}>
            
//             <div className="flex flex-col gap-2 min-h-[160px]">
//               <div className="flex items-center gap-2 opacity-50">
//                 {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
//                 <span className="text-[#a88a6d] font-black uppercase text-[14px]">{quizMode ? "Logic Quest" : "The Clues"}</span>
//               </div>
//               <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col gap-2 h-full max-h-[220px] overflow-y-auto custom-scrollbar text-[14px]">
//                 {quizMode ? (
//                   <div className="flex flex-col gap-3">
//                     <span className="text-yellow-400 font-black text-[12px] uppercase opacity-60 tracking-widest tracking-tighter leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
//                     <p className="text-white text-[18px] font-bold leading-tight">{currentQuizSet[quizStep]?.q}</p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
//                         {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
//                             let style = "bg-black/40 border-transparent text-white/80";
//                             if (quizFeedbackMode) {
//                                 if (idx === quizSelection) style = quizSelection === currentQuizSet[quizStep].correct ? "bg-green-600 border-green-400 text-white shadow-lg" : "bg-rose-600 border-rose-400 text-white shadow-lg";
//                                 else style = "bg-black/20 border-transparent text-white/20 opacity-40";
//                             }
//                             return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3 rounded-xl font-black uppercase transition-all text-[13px] border-2 ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
//                         })}
//                     </div>
//                     {quizFeedbackMode && (
//                         <div className="flex flex-col items-center gap-2 pt-2">
//                             {quizSelection === currentQuizSet[quizStep].correct ? (
//                                 <button onClick={nextQuizStep} className="bg-green-600 text-white px-10 py-2 rounded-full font-black uppercase text-[12px] tracking-widest shadow-xl">Next Question</button>
//                             ) : (
//                                 <button onClick={() => {setQuizFeedbackMode(false); setQuizSelection(null);}} className="bg-rose-600 text-white px-10 py-2 rounded-full font-black uppercase text-[12px] tracking-widest shadow-xl">Try Again</button>
//                             )}
//                         </div>
//                     )}
//                   </div>
//                 ) : (
//                   currentScenData && currentScenData.clues.map((clue, idx) => {
//                     const isScanning = conceptPhase === 'scanning';
//                     const isFinalCheck = conceptPhase === 'finalCheck';
//                     const isPractice = appMode === 'practice';
//                     const isRelevant = !lessonFinished && !isScanning && !isFinalCheck && appMode === 'concept' && currentScenData?.teachingSteps[activeStep]?.clueIndices.includes(idx);
//                     const isStart = conceptPhase === 'start';
//                     const isEnd = lessonFinished;

//                     const showNeutral = isStart || isEnd;
//                     const isHighlighted = showNeutral || isScanning || isFinalCheck || isPractice || (appMode === 'concept' && !isEnd);
//                     const isYellow = isRelevant && !showNeutral;
//                     const isStruck = appMode === 'concept' && !isScanning && !isFinalCheck && !showNeutral && completedClues.includes(idx) && !isRelevant;
//                     const manualStruck = isPractice && manualStrikes.includes(idx);

//                     return (
//                       <div key={idx} className={`flex items-start gap-3 transition-all ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}>
//                         {appMode === 'practice' ? (
//                           <button onClick={() => toggleManualStrike(idx)} className="mt-1 shrink-0">
//                             {manualStrikes.includes(idx) ? <CheckSquare className="text-green-500" size={18} /> : <Square className="text-white/20" size={18} />}
//                           </button>
//                         ) : (
//                           <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isYellow ? 'bg-yellow-400' : 'bg-white/10'}`}>
//                             {isStruck ? <Check size={12} className="text-black" /> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
//                           </div>
//                         )}
//                         <p className={`text-white font-bold leading-tight ${isStruck || manualStruck ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               {appMode === 'concept' && !quizMode && (
//                 <div className="flex items-center justify-between opacity-50">
//                   <div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[14px]">Teacher Guidance</span></div>
//                   {(conceptPhase === 'interaction' || conceptPhase === 'selecting') && (<button onClick={prevStep} className="p-1 text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={18} /></button>)}
//                 </div>
//               )}
//               <div className="bg-[#3e2723] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[160px]">
//                 <AnimatePresence mode='wait'>
//                   {appMode === 'concept' && conceptPhase === 'scanning' && (
//                     <motion.div key="scanning" className="text-center flex flex-col items-center gap-3">
//                       <Timer size={32} className="text-yellow-400 animate-pulse" />
//                       <p className="text-white font-bold uppercase tracking-widest text-[16px]">Neutral Analysis Phase: {scanningTimer}s</p>
//                       <p className="text-white/60 text-center leading-tight px-4 tracking-tighter">Read through all 7 instructions carefully. Look for connections between the mileage rules!</p>
//                     </motion.div>
//                   )}

//                   {appMode === 'concept' && conceptPhase === 'start' && (
//                     <motion.div key="c-start" className="text-center flex flex-col items-center gap-4">
//                       <p className="text-white font-medium italic mb-2 text-[16px]">Ready to learn how to solve logic with no absolute starting points?</p>
//                       <button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-16 py-4 rounded-full font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-[12px]">Begin Academy</button>
//                     </motion.div>
//                   )}

//                   {appMode === 'practice' && !quizMode && !lessonFinished && (
//                     <motion.div key="p-arrange" className="flex flex-col items-center gap-4 w-full text-center">
//                       <p className="text-white text-[18px] font-bold leading-tight uppercase tracking-tighter">"{currentScenData?.mission}"</p>
//                       <div className="flex gap-4">
//                         <button onClick={validatePractice} disabled={!scenarios[activeScenIdx].items.every(f => f !== null)} className={`bg-orange-500 text-white px-12 py-3 rounded-full font-black uppercase shadow-xl text-[14px] ${!scenarios[activeScenIdx].items.every(f => f !== null) ? 'opacity-20 grayscale' : 'hover:scale-105 active:scale-95'}`}>Verify solution</button>
//                         <button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 active:scale-95">Hint</button>
//                       </div>
//                     </motion.div>
//                   )}

//                   {lessonFinished && (
//                     <div className="text-center flex flex-col items-center gap-3">
//                       <Trophy size={60} className="text-yellow-400 animate-pulse" />
//                       <h3 className="text-white text-[20px] font-black uppercase tracking-tight">Logic Mastered!</h3>
//                       <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-12 py-4 rounded-full font-black uppercase shadow-xl tracking-widest">Next Challenge</button>
//                     </div>
//                   )}

//                   {appMode === 'concept' && !quizMode && !lessonFinished && (
//                     <motion.div key="c-guidance" className="w-full">
//                        {conceptPhase === 'selecting' && (
//                            <div className="flex flex-col items-center gap-4 text-center">
//                                <p className="text-yellow-400 text-[11px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Strategic Discussion</p>
//                                <p className="text-white text-[17px] font-bold leading-tight px-2 tracking-tight">{currentScenData.teachingSteps[activeStep]?.selectionPrompt}</p>
//                                <div className="flex flex-wrap justify-center gap-2">
//                                    {currentScenData.teachingSteps[activeStep].options?.map((opt, i) => (
//                                        <button key={i} onClick={() => handleSelectionQuiz(i)} className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-black/60 active:scale-95 transition-all text-[12px]">{opt}</button>
//                                    ))}
//                                </div>
//                                {feedback.type === 'error' && <p className="text-rose-400 text-[12px] font-bold italic animate-pulse">{String(feedback.reason)}</p>}
//                            </div>
//                        )}
//                        {conceptPhase === 'interaction' && (
//                            <div className="flex flex-col items-center text-center w-full">
//                                <p className="text-green-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Check size={12}/> Strategy Applied</p>
//                                <p className="text-white text-[13px] font-bold italic mb-4 opacity-60 px-4 leading-tight">{String(currentScenData.teachingSteps[activeStep]?.why)}</p>
//                                <div className="bg-black/30 p-4 rounded-xl border-l-4 border-yellow-400 w-full mb-4 shadow-lg">
//                                    <p className="text-white text-[15px] font-bold leading-tight">{getDynamicInstruction()}</p>
//                                </div>
//                                <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`px-12 py-3 rounded-full font-black uppercase text-[12px] transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Complete Step</button>
//                            </div>
//                        )}
//                        {conceptPhase === 'finalCheck' && (
//                            <div className="text-center flex flex-col items-center gap-3">
//                                <div className="bg-yellow-400/20 p-5 rounded-xl border border-yellow-400/50 shadow-2xl"><p className="text-green-400 font-black text-[12px] mb-2 tracking-widest leading-none">Cross-Check Arrangement: {finalValidationTimer}s</p><p className="text-white text-[15px] font-bold tracking-tight">Logic chain completed! Review Row 1 one last time. Does it follow every single rule?</p></div>
//                                {finalValidationTimer === 0 && <button onClick={() => setQuizMode(true)} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[14px] animate-bounce tracking-widest shadow-xl">Submit Arrangement</button>}
//                            </div>
//                        )}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.01); }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
//       `}} />
//     </div>
//   );
// }

// // export default function App() { return ( <Router> <LabContent /> </Router> ); }

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
  Car as CarIcon
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// ICONS
// ==========================================

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

// ==========================================
// DATA & CONFIG
// ==========================================
const ALL_PEOPLE = [
  { id: 'J', name: 'J', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
  { id: 'K', name: 'K', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
  { id: 'L', name: 'L', icon: User, color: 'from-emerald-600 to-emerald-800' },
  { id: 'M', name: 'M', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'N', name: 'N', icon: UserMinus, color: 'from-rose-600 to-rose-800' },
  { id: 'O', name: 'O', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' },
  { id: 'P', name: 'P', icon: Target, color: 'from-orange-600 to-orange-800' },
  { id: 'T', name: 'T', icon: CarIcon, color: 'from-slate-600 to-slate-800' },
  { id: 'U', name: 'U', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
  { id: 'V', name: 'V', icon: Gauge, color: 'from-red-600 to-red-800' },
  { id: 'W', name: 'W', icon: Wind, color: 'from-cyan-600 to-cyan-800' },
  { id: 'X', name: 'X', icon: Activity, color: 'from-orange-600 to-orange-800' },
  { id: 'Y', name: 'Y', icon: MilestoneIcon, color: 'from-pink-600 to-pink-800' },
  // Practice Items
  { id: 'A', name: 'A', icon: UserCircle, color: 'from-blue-600 to-blue-800' },
  { id: 'B', name: 'B', icon: UserCheck, color: 'from-purple-600 to-purple-800' },
  { id: 'C', name: 'C', icon: User, color: 'from-emerald-600 to-emerald-800' },
  { id: 'D', name: 'D', icon: UserPlus, color: 'from-amber-600 to-amber-800' },
  { id: 'E', name: 'E', icon: Zap, color: 'from-yellow-600 to-yellow-800' },
  { id: 'F', name: 'F', icon: Activity, color: 'from-orange-600 to-orange-800' },
  { id: 'G', name: 'G', icon: UsersIcon, color: 'from-indigo-600 to-indigo-800' }
];

const LOGIC_DATA = {
  concept: {
    clues: [
      { id: 1, text: "1. T gives more mileage than V." },
      { id: 2, text: "2. W gives more mileage than X, which gives more than V." },
      { id: 3, text: "3. U gives more mileage than T." },
      { id: 4, text: "4. As many cars give more mileage than V as less than W." },
      { id: 5, text: "5. V doesn’t give the lowest mileage." },
      { id: 6, text: "6. U gives more mileage than W whereas X gives less than T." },
      { id: 7, text: "7. The car with the second lowest mileage gives 50 KMPL." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Observe all clues. Which instruction allows us to build a structural framework where we can determine the positions of V and W at least?",
        options: ["Clue 1", "Clue 2", "Clue 3", "Clue 4", "Clue 5", "Clue 6", "Clue 7"],
        correct: 3,
        feedback: [
          "Clue 1 is a simple relative comparison between two cars. It doesn't help us find a specific spot on the 1-6 rank scale, so it can't be our starting point.",
          "Clue 2 is a strong chain (W > X > V), but we haven't found an anchor rank yet. Using this now would be like trying to build a roof without any walls.",
          "Clue 3 only links U and T. It provides no information about the other four cars or how they relate to the full mileage list.",
          "Correct! Clue 4 is the key because it links the counts at both ends of the list. By using this, we can determine the potential positions of V and W at least.",
          "Clue 5 is a filter. It tells us where V cannot be, which is great for narrowing down choices later, but it doesn't give us a rank to place our first car.",
          "Clue 6 is too complex to start with. It links four different cars but doesn't fix any of them to a specific rank. We need to find our anchor car first.",
          "Clue 7 gives us a fixed mileage value for the 2nd lowest car, but it doesn't name the car. We need a positional clue that names cars to begin our setup."
        ],
        why: "This clue is the key because it links the counts at both ends of the list, allowing us to determine the potential positions of V and W at least.",
        instruction: "Excellent choice! Clue 4 will be our structural anchor. Click 'Complete Step' to start the deduction.",
        clueIndices: [3],
        targetAction: [] 
      },
      { 
        id: "step-2-where-w",
        selectionPrompt: "Let's determine where Car W could sit. Drag Car W from the repository to Rank 1 or Rank 2 in Scenario 1.",
        instruction: "Let's start W with 1 but it is not possible as If W is at 1 then V should be at 6 as per condition 4. So, let's start with W at 2.",
        clueIndices: [3, 4],
        interactionType: 'placement-w',
        why: "We're testing the logic: Rank 1 for W forces Rank 6 for V, which breaks Clue 5. Moving W to Rank 2 is our first valid logical move.",
        feedback: {
          wrong: "Oops! It's not possible to place W at Rank 1. If W is at 1 (0 cars lower), V must have 0 cars higher (Rank 6). But Clue 5 says V can't sit last! Try W at 2.",
          correct: "Correct! If W is at Rank 2 (1 car below), we can now determine where V must go to stay balanced."
        }
      },
      { 
        id: "step-3-mirror-v",
        selectionPrompt: "Since W is at Rank 2 (1 car is slower), place Car V at the rank that balances the logic (exactly 1 car is faster).",
        instruction: "Interactivity: Drag V to Rank 5. If W is at 2, then V should be at 5 as we know number of cars giving more mileage than V = number of cars giving less mileage than W.",
        clueIndices: [3],
        interactionType: 'placement-v',
        targetAction: [{ itemId: 'V', slot: 4 }],
        why: "Mirror logic on a 6-car scale: the mirror of Rank 2 is Rank 5. This satisfies Clue 4 perfectly."
      },
      { 
        id: "step-4-other-places",
        selectionPrompt: "We found one possible pair (W:2, V:5). Can we make W sit at any other place while still following Clue 4?",
        options: ["No, only one pair works", "Yes, there are other possibilities"],
        correct: 1,
        why: "Correct! Since positions are relative and the car list has 6 spots, multiple symmetrical balance points exist where V isn't last.",
        feedback: [
          "Actually, we must consider multiple pairs! Because Clue 4 is relative, several different sets of ranks can satisfy the condition 'Above V = Below W'. Until we check other clues, we can't be sure which pair is correct, so we test them all.",
          "Excellent! You are right. There are exactly 5 pairs that keep the balance where V is not last."
        ],
        instruction: "Step 4: Branching. Click '+' until you have 5 rows total. Place the following pairs to test every logical possibility:", 
        forceMultiScenario: true,
        maxScenarios: 5,
        clueIndices: [4],
        targetAction: [] 
      },
      { 
        id: "step-5-elimination",
        selectionPrompt: "Which instruction helps us 'weed out' the impossible rows by checking the chain W > X > V?",
        options: ["Clue 2", "Clue 6"],
        correct: 0,
        why: "Clue 2 says W > X > V. This requires an empty spot for X. Only Scenario 1 (W:2, V:5) has a gap. Mark Scenarios 2-5 as 'Invalid' to enable the button.",
        instruction: "Step 5: Elimination. Mark Scenarios 2, 3, 4, and 5 as 'Invalid' because they leave no room for Car X.", 
        clueIndices: [1],
        isEliminationStep: true,
        targetAction: [] 
      },
      { 
        id: "step-6-winner",
        selectionPrompt: "In valid Row 1 (W:2, V:5), which clue identifies the car at the absolute lead (Rank 1)?",
        options: ["Clue 3", "Clue 6"],
        correct: 1,
        why: "Clue 6 states U > W. Since W is already at Rank 2, and Rank 1 is the only remaining higher spot, Car U must be the winner!",
        instruction: "Step 6: The Winner. In valid Row 1, place Car U at Rank 1.", 
        clueIndices: [5],
        targetAction: [{ itemId: 'U', slot: 0 }]
      },
      { 
        id: "step-7-completion",
        selectionPrompt: "Ranks 3, 4, and 6 are still empty. Which clues chain T, X, and Y into place?",
        options: ["Clue 1 & 6", "Clue 3"],
        correct: 0,
        why: "Clue 6 says X < T, and Clue 1 says T > V. Chaining: U(1) > W(2) > T(3) > X(4) > V(5). Finally, Y fills Rank 6.",
        instruction: "Final Step: Completion. In Row 1, place T at Rank 3, X at Rank 4, and Car Y at Rank 6 to finish the Concept phase.", 
        clueIndices: [0, 2, 5],
        targetAction: [{ itemId: 'T', slot: 2 }, { itemId: 'X', slot: 3 }, { itemId: 'Y', slot: 5 }]
      }
    ],
    postQuiz: [
      { q: "Which car gives the absolute highest mileage?", options: ["Car W", "Car U", "Car T"], correct: 1, explanation: "U is 1st, sitting above W (2nd) and T (3rd)." },
      { q: "How many cars give more mileage than car T?", options: ["One", "Two", "Three"], correct: 1, explanation: "Car T is rank 3. U (1st) and W (2nd) are better." }
    ]
  },
  practice: [
    {
      id: 'scen-practice-building',
      title: "Building Height Laboratory",
      mission: "Arrange 6 Buildings from Tallest (1) to Shortest (6).",
      clues: [
        { id: 1, text: "1. Building B is taller than Building D." },
        { id: 2, text: "2. Building E is taller than F, which is taller than D." },
        { id: 3, text: "3. Building G is taller than B." },
        { id: 4, text: "4. As many buildings are taller than D as shorter than E." },
        { id: 5, text: "5. Building D isn't the shortest." },
        { id: 6, text: "6. Building G is taller than E whereas F is shorter than B." }
      ],
      targetOrder: ['G', 'E', 'B', 'F', 'D', 'A'],
      quiz: [
        { q: "Which building is the tallest?", options: ["Building G", "Building E", "Building B"], correct: 0, explanation: "Following Concept logic: G > E > B > F > D > A." },
        { q: "How many buildings are shorter than Building B?", options: ["Two", "Three", "Four"], correct: 1, explanation: "B is 3rd. F(4), D(5), and A(6) are shorter. Total 3." }
      ]
    }
  ]
};

// ==========================================
// MAIN COMPONENT
// ==========================================

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

  const [scenarios, setScenarios] = useState([{ id: 101, items: new Array(6).fill(null), markedInvalid: false }]);
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

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : (LOGIC_DATA.practice ? LOGIC_DATA.practice[0] : null);
  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : (LOGIC_DATA.practice ? LOGIC_DATA.practice[0].quiz : []);

  // ==========================================
  // CONTINUOUS STEP VALIDATION
  // ==========================================
  useEffect(() => {
    if (appMode !== 'concept' || conceptPhase !== 'interaction') return;

    const currentRow = scenarios[0].items;
    const allRows = scenarios;
    const stepData = currentScenData.teachingSteps[activeStep];
    const stepId = stepData?.id;

    let isValid = false;

    switch (stepId) {
      case 'step-1':
        isValid = true;
        break;
      case 'step-2-where-w':
        isValid = currentRow[1] === 'W';
        break;
      case 'step-3-mirror-v':
        isValid = currentRow[1] === 'W' && currentRow[4] === 'V';
        break;
      case 'step-4-other-places':
        const targetPairs = [[4,1], [3,2], [2,3], [1,4], [0,5]];
        const matchCount = targetPairs.filter(p => allRows.some(r => r.items[p[0]] === 'V' && r.items[p[1]] === 'W')).length;
        isValid = allRows.length >= 5 && matchCount === 5;
        break;
      case 'step-5-elimination':
        isValid = allRows.filter(s => s.markedInvalid).length >= 4 && !allRows[0].markedInvalid;
        break;
      case 'step-6-winner':
        isValid = allRows[0].items[0] === 'U';
        break;
      case 'step-7-completion':
        const r1 = allRows[0].items;
        isValid = r1[0] === 'U' && r1[1] === 'W' && r1[2] === 'T' && r1[3] === 'X' && r1[4] === 'V' && r1[5] === 'Y';
        break;
      default:
        isValid = false;
    }

    setStepStatus(isValid ? 'correct' : 'idle');
  }, [scenarios, activeStep, appMode, conceptPhase]);

  // ==========================================
  // HELPERS
  // ==========================================

  function getDynamicInstruction() {
    if (appMode === 'concept' && activeStep === 3 && conceptPhase === 'interaction') {
        const targetPairs = [[4,1], [3,2], [2,3], [1,4], [0,5]];
        const foundCount = targetPairs.filter(tp => scenarios.some(s => s.items[tp[0]] === 'V' && s.items[tp[1]] === 'W')).length;
        
        return (
          <div className="flex flex-col gap-2">
            <p className="text-white font-bold mb-1">Mirror Pair Progress: {foundCount}/5</p>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5 font-mono text-[11px] text-yellow-200">
               <div className="grid grid-cols-2 gap-x-4 border-b border-white/10 pb-1 mb-1 opacity-50"><span>Scenario</span><span>Configuration</span></div>
               <div>Row 1 - V at 5 and W at 2</div>
               <div>Row 2 - V at 4 and W at 3</div>
               <div>Row 3 - V at 3 and W at 4</div>
               <div>Row 4 - V at 2 and W at 5</div>
               <div>Row 5 - V at 1 and W at 6</div>
            </div>
            {foundCount < 5 && <p className="text-[12px] italic text-white/60">Click '+' to add rows and place the pairs in Scenario Slots.</p>}
          </div>
        );
    }
    return currentScenData?.teachingSteps[activeStep]?.instruction || "";
  }

  // ==========================================
  // HANDLERS
  // ==========================================

  function handleReset(targetMode) {
    const mode = targetMode || appMode;
    setScenarios([{ id: 101, items: new Array(6).fill(null), markedInvalid: false }]);
    setActiveScenIdx(0);
    setActiveStep(0);
    setCompletedClues([]);
    setManualStrikes([]);
    setFeedback({ type: null, msg: "", reason: "" });
    setStepStatus('idle');
    setConceptPhase('start');
    setScanningTimer(30);
    setFinalValidationTimer(30);
    setQuizMode(false);
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setLessonFinished(false);
    setInvalidCount(0);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  function handleAddScenario() {
    const max = currentScenData?.teachingSteps[activeStep]?.maxScenarios || 5;
    if (scenarios.length >= max && appMode === 'concept') return;
    const nextId = Date.now() + Math.random();
    const currentItems = [...scenarios[activeScenIdx].items];
    setScenarios([...scenarios, { id: nextId, items: currentItems, markedInvalid: false }]);
    setActiveScenIdx(scenarios.length);
  }

  function handleRemoveScenario(idx) {
    if (scenarios.length === 1) return;
    const targetScen = scenarios[idx];
    const validCountRemaining = scenarios.filter(s => !s.markedInvalid).length;
    if (validCountRemaining === 1 && !targetScen.markedInvalid) {
        setFeedback({ type: 'error', msg: "Protection!", reason: "You cannot delete your only potentially valid logic row." });
        return;
    }
    setScenarios(prev => prev.filter((_, i) => i !== idx));
    setActiveScenIdx(0);
  }

  function toggleManualStrike(idx) {
    if (appMode !== 'practice') return;
    setManualStrikes(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  }

  function validatePractice() {
    const currentOrder = scenarios[activeScenIdx].items.join(',');
    const targetOrder = LOGIC_DATA.practice[0].targetOrder.join(',');
    if (currentOrder === targetOrder) {
      setPracticeStatus('correct');
      setQuizMode(true);
    } else {
      setPracticeStatus('wrong');
      setFeedback({ type: 'error', msg: "Logic Mismatch", reason: "Check clues again. Your arrangement doesn't follow the rules!" });
    }
  }

  function handleMarkInvalid(idx) {
    if (appMode !== 'concept' || activeStep !== 4) return;
    const row = scenarios[idx].items;
    const wPos = row.indexOf('W');
    const vPos = row.indexOf('V');
    const gap = vPos - wPos;
    const isImpossible = gap < 2 || wPos >= vPos;
    
    if (isImpossible && wPos !== -1 && vPos !== -1) {
        const nextScenarios = [...scenarios];
        nextScenarios[idx].markedInvalid = true;
        setScenarios(nextScenarios);
        const nextInvalidCount = nextScenarios.filter(s => s.markedInvalid).length;
        setInvalidCount(nextInvalidCount);
        setFeedback({ type: 'success', msg: "Correct!", reason: "Row eliminated. Car X cannot fit between W and V here." });
    } else {
        setFeedback({ type: 'error', msg: "Check Logic!", reason: "Row 1 actually works. Check the other rows!" });
    }
  }

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Excellent!", reason: String(step.why) });
      setConceptPhase('interaction');
      setStepStatus('correct'); 
    } else {
      const errorMsg = step.feedback ? (Array.isArray(step.feedback) ? step.feedback[idx] : step.feedback) : "Not quite.";
      setFeedback({ type: 'error', msg: "Think Again.", reason: String(errorMsg) });
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function handleDragStart() {
    setFeedback({ type: null, msg: "", reason: "" });
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
      if (appMode === 'concept') handleSetMode('practice');
    }
  }

  function prevStep() {
    if (appMode === 'concept') {
      if (conceptPhase === 'interaction') {
        setConceptPhase('selecting');
        setFeedback({ type: null, msg: "", reason: "" });
        setStepStatus('idle');
      } else if (activeStep > 0) {
        setActiveStep(activeStep - 1);
        setConceptPhase('interaction');
        setStepStatus('correct');
        setFeedback({ type: null, msg: "", reason: "" });
      }
    }
  }

  function nextStep() {
    const steps = currentScenData.teachingSteps;
    if (steps[activeStep]?.clueIndices) {
      setCompletedClues(prev => {
        const next = [...prev];
        steps[activeStep].clueIndices.forEach(idx => { if (!next.includes(idx)) next.push(idx); });
        return next;
      });
    }
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      const nextStepData = steps[activeStep + 1];
      if (!nextStepData.options) {
        setConceptPhase('interaction');
        setStepStatus('idle');
      } else {
        setConceptPhase('selecting');
        setStepStatus('idle');
      }
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setConceptPhase('finalCheck');
      setStepStatus('idle');
    }
  }

  function handleDragEnd(event, info, itemId, sourceScenId, sourceIndex) {
    if (quizMode || lessonFinished || (appMode === 'concept' && conceptPhase !== 'interaction')) return;
    const dragX = info.point.x;
    const dragY = info.point.y;
    const activeScenId = scenarios[activeScenIdx].id;
    const activeRowSlots = document.querySelectorAll(`[data-branch-id="${activeScenId}"][data-slot-idx]`);
    let targetSlotIdx = -1;
    let minDist = 1000;
    activeRowSlots.forEach((slot) => {
      const rect = slot.getBoundingClientRect();
      const centerX = rect.left + window.scrollX + rect.width / 2;
      const centerY = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      if (dist < 150 && dist < minDist) { 
          minDist = dist; 
          targetSlotIdx = parseInt(slot.getAttribute('data-slot-idx')); 
      }
    });

    if (targetSlotIdx !== -1) {
      const step = appMode === 'concept' ? currentScenData.teachingSteps[activeStep] : null;
      
      if (appMode === 'concept' && step?.interactionType === 'placement-w' && itemId === 'W') {
        if (targetSlotIdx === 0) {
           setFeedback({ type: 'error', msg: "Wait!", reason: String(step.feedback.wrong) });
        } else if (targetSlotIdx === 1) {
           setFeedback({ type: 'success', msg: "Valid!", reason: String(step.feedback.correct) });
        }
      }

      const currentActiveItems = [...scenarios[activeScenIdx].items];
      if (currentActiveItems[targetSlotIdx] !== null && currentActiveItems[targetSlotIdx] !== itemId) {
        setFeedback({ type: 'error', msg: "Slot Occupied!", reason: "Move the car out of the way first." });
        return;
      }

      const newScenarios = [...scenarios];
      if (sourceScenId !== null) {
          const sIdx = scenarios.findIndex(s => s.id === Number(sourceScenId));
          if (sIdx !== -1) {
              const sourceRow = [...newScenarios[sIdx].items];
              sourceRow[sourceIndex] = null;
              newScenarios[sIdx].items = sourceRow;
          }
      }
      const refreshedActiveItems = [...newScenarios[activeScenIdx].items];
      const oldIdx = refreshedActiveItems.indexOf(itemId);
      if (oldIdx !== -1) refreshedActiveItems[oldIdx] = null;
      refreshedActiveItems[targetSlotIdx] = itemId;
      newScenarios[activeScenIdx].items = refreshedActiveItems;
      setScenarios(newScenarios);

      if (appMode === 'concept') {
        const wIdx = refreshedActiveItems.indexOf('W');
        const vMirrorIdx = 5 - wIdx;

        if (step?.interactionType === 'placement-v' && itemId === 'V') {
            if (targetSlotIdx === vMirrorIdx && wIdx !== -1) {
                setStepStatus('correct');
                setFeedback({ type: 'success', msg: "Mirrored!", reason: `Balanced! If W is at 2 (4 slower), V should be at 5 as the Mirror Rule requires equal counts at both ends. Click 'Complete Step'.` });
            } else {
                setStepStatus('idle');
                setFeedback({ type: 'error', msg: "Check Mirror!", reason: "Look at W's rank and balance it. If W has 4 slower cars, V must have 4 faster cars." });
            }
        }
      }
    }
  }

  // TIMER EFFECT
  useEffect(() => {
    let interval;
    if (conceptPhase === 'scanning' && scanningTimer > 0) {
      interval = setInterval(() => setScanningTimer(t => t - 1), 1000);
    } else if (conceptPhase === 'scanning' && scanningTimer === 0) {
      setConceptPhase('selecting');
    }
    return () => clearInterval(interval);
  }, [conceptPhase, scanningTimer]);

  useEffect(() => {
    let interval;
    if (appMode === 'concept' && conceptPhase === 'finalCheck' && finalValidationTimer > 0) {
      interval = setInterval(() => setFinalValidationTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [conceptPhase, finalValidationTimer, appMode]);

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none overflow-hidden font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Mileage Reasoning Concept" : "Comparative Laboratory"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset()} />

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        <div className="w-full flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-2">
          <motion.div className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-center gap-1 opacity-30 text-[14px] font-black uppercase tracking-widest leading-none mb-1"><Layers size={14} /> Logic Tray</div>
            <div className="flex flex-col gap-5">
              <AnimatePresence>
                {scenarios.map((scen, sIdx) => {
                  if (appMode === 'concept' && conceptPhase === 'finalCheck' && scen.markedInvalid) return null;
                  const isActive = sIdx === activeScenIdx;
                  const isElimStep = appMode === 'concept' && activeStep === 4 && conceptPhase === 'interaction';
                  
                  return (
                    <motion.div key={scen.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`relative bg-[#3e2723] pt-12 pb-6 sm:pb-10 px-1 rounded-[1.5rem] border-2 flex flex-col items-center justify-center shadow-inner transition-all
                    ${isActive ? 'border-yellow-500 shadow-xl z-20 scale-[1.01]' : 'border-black/20 opacity-30 grayscale cursor-pointer'}`}
                      onClick={() => !scen.markedInvalid && setActiveScenIdx(sIdx)}
                    >
                      <div className="absolute top-2 w-full flex justify-between px-6 pointer-events-none">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                          <ArrowLeftCircle size={16} /> Highest
                        </div>
                        {isActive && !quizMode && (
                          <div className="bg-yellow-400 text-black px-3 py-0.5 rounded-full text-[9px] font-black animate-pulse shadow-md uppercase tracking-widest">Active Scenario {sIdx + 1}</div>
                        )}
                        <div className="flex items-center gap-1.5 text-yellow-400 font-black uppercase text-[10px] sm:text-[12px]">
                          Lowest <ArrowRightCircle size={16} />
                        </div>
                      </div>

                      {scen.markedInvalid && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-[1.5rem]">
                          <XCircle className="text-rose-500/60" size={60} strokeWidth={3} />
                        </div>
                      )}

                      {isElimStep && !scen.markedInvalid && sIdx !== 0 && (
                        <div className="absolute inset-0 bg-rose-500/5 z-50 flex items-center justify-center cursor-pointer rounded-[1.5rem]" onClick={() => handleMarkInvalid(sIdx)}>
                          <div className="bg-rose-600 text-white px-6 py-2 rounded-full font-black text-[12px] uppercase shadow-2xl border-2 border-white/20 tracking-widest">Mark Invalid</div>
                        </div>
                      )}

                      {isActive && !quizMode && !lessonFinished && (
                        <div className="absolute -right-1 flex flex-col gap-2 z-40">
                          <button onClick={(e) => { e.stopPropagation(); handleAddScenario(); }} className="p-3 bg-green-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Plus size={18} strokeWidth={4} /></button>
                          {scenarios.length > 1 && <button onClick={(e) => { e.stopPropagation(); handleRemoveScenario(sIdx); }} className="p-3 bg-rose-600 text-white rounded-full shadow-lg hover:scale-110 border border-white/20 transition-transform"><Trash2 size={18} strokeWidth={4} /></button>}
                        </div>
                      )}

                      <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-black/20 -translate-y-1/2 rounded-full z-0" />
                      <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4 px-2">
                        {scen.items.map((itemId, i) => {
                          const itemData = itemId ? ALL_PEOPLE.find(f => f.id === itemId) : null;
                          return (
                            <div key={i} className="flex flex-col items-center gap-1">
                              <div data-branch-id={scen.id} data-slot-idx={i}
                                className={`w-11 h-11 sm:w-20 sm:h-20 rounded-full border-[1px] sm:border-2 flex items-center justify-center relative transition-all duration-300 group
                                ${itemData ? `bg-white border-white shadow-md scale-105` : `border-dashed border-white/10 bg-black/10`}`}
                              >
                                {itemData ? (
                                  <>
                                    <motion.div layoutId={`item-${itemData.id}-${scen.id}`} drag={!lessonFinished && !quizFeedbackMode && !scen.markedInvalid && isActive} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
                                      whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, itemData.id, scen.id, i)}
                                      className={`w-full h-full rounded-full bg-gradient-to-br ${itemData.color} flex flex-col items-center justify-center shadow-inner relative p-1 cursor-grab active:cursor-grabbing z-10`}
                                    >
                                      <div className="text-white drop-shadow-md">{<itemData.icon size={28} />}</div>
                                      <span className="text-[10px] sm:text-[12px] font-black text-white uppercase mt-1 leading-none">{itemData.id}</span>
                                    </motion.div>
                                    {!quizMode && !lessonFinished && !scen.markedInvalid && isActive && (
                                      <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer z-20"
                                        onClick={() => { const n = [...scenarios]; n[sIdx].items[i] = null; setScenarios(n); if (appMode === 'concept') setStepStatus('idle'); }}>
                                        <X size={14} strokeWidth={3} className="text-white" />
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className={`font-black text-[12px] sm:text-[20px] text-white/10`}>{i + 1}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div className="w-full flex flex-col gap-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-center gap-1.5 opacity-20 font-black uppercase tracking-widest leading-none"><ShoppingCart size={14} /> Repository</div>
              <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 px-2 sm:px-8">
                {ALL_PEOPLE.map((item) => {
                  const isPlacedInActive = scenarios[activeScenIdx].items.includes(item.id);
                  const isNeeded = appMode === 'concept' ? ['T','U','V','W','X','Y'].includes(item.id) : (appMode === 'practice' ? ['A','B','D','E','F','G'].includes(item.id) : false);
                  if (!isNeeded) return null;
                  return (
                    <div key={`anchor-${item.id}`} className="relative w-10 h-10 sm:w-20 sm:h-20 flex-shrink-0 flex items-center justify-center border-[1px] sm:border-2 border-white/5 rounded-full bg-black/10 shadow-inner">
                      {!isPlacedInActive ? (
                        <motion.div layoutId={`item-${item.id}-storage`} drag={!quizMode && !lessonFinished && (conceptPhase === 'interaction' || appMode === 'practice') && stepStatus === 'idle'} dragConstraints={containerRef} dragMomentum={false} dragElastic={0.1} onDragStart={handleDragStart}
                          whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.3, zIndex: 100 }} onDragEnd={(e, info) => handleDragEnd(e, info, item.id, null, null)}
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

        <div className="w-full max-w-7xl bg-[#2a1a16] p-4 rounded-t-[2rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-3 shrink-0">
          <div className={`grid grid-cols-1 ${appMode === 'concept' && !quizMode ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-1'} gap-4 sm:gap-8`}>
            
            <div className="flex flex-col gap-2 min-h-[160px]">
              <div className="flex items-center gap-2 opacity-50">
                {quizMode ? <HelpCircle size={16} className="text-yellow-400" /> : <BookOpen size={16} className="text-[#a88a6d]" />}
                <span className="text-[#a88a6d] font-black uppercase text-[14px]">{quizMode ? "Logic Quest" : "The Clues"}</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col gap-2 h-full max-h-[220px] overflow-y-auto custom-scrollbar text-[14px]">
                {quizMode ? (
                  <div className="flex flex-col gap-3">
                    <span className="text-yellow-400 font-black text-[12px] uppercase opacity-60 tracking-widest tracking-tighter leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
                    <p className="text-white text-[18px] font-bold leading-tight">{currentQuizSet[quizStep]?.q}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                            let style = "bg-black/40 border-transparent text-white/80";
                            if (quizFeedbackMode) {
                                if (idx === quizSelection) style = quizSelection === currentQuizSet[quizStep].correct ? "bg-green-600 border-green-400 text-white shadow-lg" : "bg-rose-600 border-rose-400 text-white shadow-lg";
                                else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                            }
                            return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3 rounded-xl font-black uppercase transition-all text-[13px] border-2 ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
                        })}
                    </div>
                    {quizFeedbackMode && (
                        <div className="flex flex-col items-center gap-2 pt-2">
                            {quizSelection === currentQuizSet[quizStep].correct ? (
                                <button onClick={nextQuizStep} className="bg-green-600 text-white px-10 py-2 rounded-full font-black uppercase text-[12px] tracking-widest shadow-xl">Next Question</button>
                            ) : (
                                <button onClick={() => {setQuizFeedbackMode(false); setQuizSelection(null);}} className="bg-rose-600 text-white px-10 py-2 rounded-full font-black uppercase text-[12px] tracking-widest shadow-xl">Try Again</button>
                            )}
                        </div>
                    )}
                  </div>
                ) : (
                  currentScenData && currentScenData.clues.map((clue, idx) => {
                    const isScanning = conceptPhase === 'scanning';
                    const isFinalCheck = conceptPhase === 'finalCheck';
                    const isPractice = appMode === 'practice';
                    const isRelevant = !lessonFinished && !isScanning && !isFinalCheck && appMode === 'concept' && currentScenData?.teachingSteps[activeStep]?.clueIndices?.includes(idx);
                    const isStart = conceptPhase === 'start';
                    const isEnd = lessonFinished;

                    const showNeutral = isStart || isEnd;
                    const isHighlighted = showNeutral || isScanning || isFinalCheck || isPractice || (appMode === 'concept' && !isEnd);
                    const isYellow = isRelevant && !showNeutral;
                    const isStruck = appMode === 'concept' && !isScanning && !isFinalCheck && !showNeutral && completedClues.includes(idx) && !isRelevant;
                    const manualStruck = isPractice && manualStrikes.includes(idx);

                    return (
                      <div key={idx} className={`flex items-start gap-3 transition-all ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}>
                        {appMode === 'practice' ? (
                          <button onClick={() => toggleManualStrike(idx)} className="mt-1 shrink-0">
                            {manualStrikes.includes(idx) ? <CheckSquare className="text-green-500" size={18} /> : <Square className="text-white/20" size={18} />}
                          </button>
                        ) : (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isYellow ? 'bg-yellow-400' : 'bg-white/10'}`}>
                            {isStruck ? <Check size={12} className="text-black" /> : <span className="text-black font-black text-[12px]">{idx + 1}</span>}
                          </div>
                        )}
                        <p className={`text-white font-bold leading-tight ${isStruck || manualStruck ? 'line-through italic text-white/40' : ''}`}>{clue.text}</p>
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
                  {(conceptPhase === 'interaction' || conceptPhase === 'selecting') && (<button onClick={prevStep} className="p-1 text-yellow-400 hover:scale-110 transition-transform"><ArrowLeft size={18} /></button>)}
                </div>
              )}
              <div className="bg-[#3e2723] p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner h-full min-h-[160px]">
                <AnimatePresence mode='wait'>
                  {appMode === 'concept' && conceptPhase === 'scanning' && (
                    <motion.div key="scanning" className="text-center flex flex-col items-center gap-3">
                      <Timer size={32} className="text-yellow-400 animate-pulse" />
                      <p className="text-white font-bold uppercase tracking-widest text-[16px]">Neutral Analysis Phase: {scanningTimer}s</p>
                      <p className="text-white/60 text-center leading-tight px-4 tracking-tighter">Read through all 7 instructions carefully. Look for connections between the mileage rules!</p>
                    </motion.div>
                  )}

                  {appMode === 'concept' && conceptPhase === 'start' && (
                    <motion.div key="c-start" className="text-center flex flex-col items-center gap-4">
                      <p className="text-white font-medium italic mb-2 text-[16px]">Ready to learn how to solve logic with no absolute starting points?</p>
                      <button onClick={() => setConceptPhase('scanning')} className="bg-yellow-400 text-black px-16 py-4 rounded-full font-black uppercase shadow-xl hover:scale-105 active:scale-95 transition-all tracking-widest text-[12px]">Begin Concept Phase</button>
                    </motion.div>
                  )}

                  {appMode === 'practice' && !quizMode && !lessonFinished && (
                    <motion.div key="p-arrange" className="flex flex-col items-center gap-4 w-full text-center">
                      <p className="text-white text-[18px] font-bold leading-tight uppercase tracking-tighter">"{currentScenData?.mission}"</p>
                      <div className="flex gap-4">
                        <button onClick={validatePractice} disabled={!scenarios[activeScenIdx].items.every(f => f !== null)} className={`bg-orange-500 text-white px-12 py-3 rounded-full font-black uppercase shadow-xl text-[14px] ${!scenarios[activeScenIdx].items.every(f => f !== null) ? 'opacity-20 grayscale' : 'hover:scale-105 active:scale-95'}`}>Verify solution</button>
                        <button onClick={() => setShowExplanation(true)} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black uppercase text-[14px] shadow-xl hover:scale-105 active:scale-95">Hint</button>
                      </div>
                    </motion.div>
                  )}

                  {lessonFinished && (
                    <div className="text-center flex flex-col items-center gap-3">
                      <Trophy size={60} className="text-yellow-400 animate-pulse" />
                      <h3 className="text-white text-[20px] font-black uppercase tracking-tight">Logic Mastered!</h3>
                      <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-12 py-4 rounded-full font-black uppercase shadow-xl tracking-widest">Next Challenge</button>
                    </div>
                  )}

                  {appMode === 'concept' && !quizMode && !lessonFinished && (
                    <motion.div key="c-guidance" className="w-full">
                       {conceptPhase === 'selecting' && (
                           <div className="flex flex-col items-center gap-4 text-center">
                               <p className="text-yellow-400 text-[11px] font-black uppercase tracking-widest leading-none mb-1 opacity-60">Strategic Discussion</p>
                               <p className="text-white text-[17px] font-bold leading-tight px-2 tracking-tight">{currentScenData.teachingSteps[activeStep]?.selectionPrompt}</p>
                               <div className="flex flex-wrap justify-center gap-2">
                                   {currentScenData.teachingSteps[activeStep]?.options?.map((opt, i) => (
                                       <button key={i} onClick={() => handleSelectionQuiz(i)} className="bg-black/40 border border-white/10 text-white px-4 py-2 rounded-lg font-black uppercase hover:bg-black/60 active:scale-95 transition-all text-[12px]">{opt}</button>
                                   ))}
                               </div>
                               {feedback.type === 'error' && <p className="text-rose-400 text-[12px] font-bold italic animate-pulse">{String(feedback.reason)}</p>}
                           </div>
                       )}
                       {conceptPhase === 'interaction' && (
                           <div className="flex flex-col items-center text-center w-full">
                               <p className="text-green-400 text-[10px] font-black uppercase mb-1 flex items-center gap-1"><Check size={12}/> Strategy Applied</p>
                               <p className="text-white text-[13px] font-bold italic mb-4 opacity-60 px-4 leading-tight">{String(currentScenData.teachingSteps[activeStep]?.why)}</p>
                               <div className="bg-black/30 p-4 rounded-xl border-l-4 border-yellow-400 w-full mb-4 shadow-lg overflow-hidden">
                                   <div className="text-white text-[14px] leading-tight">{getDynamicInstruction()}</div>
                               </div>
                               <button onClick={nextStep} disabled={stepStatus !== 'correct'} className={`px-12 py-3 rounded-full font-black uppercase text-[12px] transition-all ${stepStatus === 'correct' ? 'bg-green-600 text-white shadow-xl hover:scale-105' : 'bg-white/5 text-white/20 cursor-not-allowed'}`}>Complete Step</button>
                           </div>
                       )}
                       {conceptPhase === 'finalCheck' && (
                           <div className="text-center flex flex-col items-center gap-3">
                               <div className="bg-yellow-400/20 p-5 rounded-xl border border-yellow-400/50 shadow-2xl"><p className="text-green-400 font-black text-[12px] mb-2 tracking-widest leading-none">Cross-Check Arrangement: {finalValidationTimer}s</p><p className="text-white text-[15px] font-bold tracking-tight">Logic chain completed! Review Row 1 one last time. Does it follow every single rule?</p></div>
                               {finalValidationTimer === 0 && <button onClick={() => setQuizMode(true)} className="bg-green-600 text-white px-12 py-3 rounded-full font-black uppercase text-[14px] animate-bounce tracking-widest shadow-xl">Submit Arrangement</button>}
                           </div>
                       )}
                    </motion.div>
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