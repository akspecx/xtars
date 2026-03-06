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
  Compass,
  Info,
  MousePointer2,
  Eye,
  FileText,
  PieChart,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Target,
  Search,
  ArrowLeft,
  DivideSquare,
  FastForward,
  Calculator,
  History,
  Globe
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-3 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-[3px] sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-3 transition-all">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px] sm:text-[11px] mb-0.5">
            <ChevronLeft size={14} strokeWidth={3} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[15px] sm:text-[18px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 sm:p-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-md">
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// DATA & CONFIG
// ==========================================

const LOGIC_DATA = {
  concept: {
    question: "How do we measure parts of a whole?",
    teachingSteps: [
      { 
        id: "step-1",
        type: "mcq",
        totalUnits: 2,
        filledPct: 1, 
        selectionPrompt: "Step 1: The Whole Pizza. Let's share a pizza! It is cut perfectly down the middle into 2 equal slices. Right now, the pizza is completely full and nobody has eaten any of it. How many slices make up this whole pizza?",
        options: ["1 Slice", "2 Slices", "4 Slices"],
        correct: 1,
        feedback: [
          "Count again! Look at the two halves.",
          "Exactly! The whole pizza is made of 2 slices.",
          "We only cut it once down the middle."
        ],
        why: "Core Concept: The total number of pieces makes up the 'Whole'. Right now, the whole is 2 slices."
      },
      { 
        id: "step-2",
        type: "interactive",
        totalUnits: 2,
        targetClicks: 1,
        selectionPrompt: "Step 2: Eating Half. You are super hungry and want exactly Half of the pizza. Click on exactly 1 slice in the visualizer to eat your share, then click Submit!",
        why: "Core Concept: A fraction tells us how many pieces we have compared to the total pieces. 1 piece out of 2 is exactly Half."
      },
      { 
        id: "step-3",
        type: "interactive",
        totalUnits: 4,
        targetClicks: 2,
        selectionPrompt: "Step 3: A Bigger Pizza. Now imagine a new pizza of the exact same size, but it is cut into 4 slices. To eat exactly HALF of this pizza, how many slices do you need? Click your share and Submit!",
        why: "Math Magic: The amount of food stays the same, but because there are more total slices, your share requires more slices to equal 'Half'."
      },
      { 
        id: "step-4",
        type: "mcq",
        totalUnits: 100,
        filledPct: 0.5,
        selectionPrompt: "Step 4: The Giant Pizza. What if we magically cut the pizza into 100 tiny slices? If your share is STILL exactly half, how many of those 100 slices belong to you?",
        options: ["50 Slices", "10 Slices", "25 Slices"],
        correct: 0,
        feedback: [
          "YES! Half of 100 is exactly 50.",
          "10 is way less than half!",
          "25 is a quarter of the pizza, not half."
        ],
        why: "Core Rule: 'Half' always means dividing the total by 2. So 1 out of 2 is the exact same amount as 50 out of 100!"
      },
      { 
        id: "step-5",
        type: "mcq",
        totalUnits: 100,
        filledPct: 0.25,
        selectionPrompt: "Step 5: The Quarter Share. Let's try a different share. Instead of half, you want a quarter (1/4) of the giant 100-slice pizza. How many slices out of 100 is that?",
        options: ["10 Slices", "50 Slices", "25 Slices"],
        correct: 2,
        feedback: [
          "That's too small!",
          "That would be half of the pizza.",
          "Exactly! 100 divided into 4 equal parts is 25."
        ],
        why: "Application: We can scale any fraction to 100. A quarter is always 25 out of 100."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "The Whole", explanation: "The 'Whole' is everything. If it's cut into 2 slices, the whole is 2 slices.", text: "Whole = Total Slices." },
      { id: 2, step: 1, concept: "Half of 2", explanation: "If there are 2 slices, half of them is exactly 1 slice.", text: "1/2 of 2 = 1." },
      { id: 3, step: 2, concept: "Half of 4", explanation: "If there are 4 slices, half of them is exactly 2 slices. It's the same amount of food!", text: "1/2 of 4 = 2." },
      { id: 4, step: 3, concept: "Half of 100", explanation: "If there are 100 slices, half of them is 50. 1 out of 2 is the same as 50 out of 100.", text: "1/2 of 100 = 50." },
      { id: 5, step: 4, concept: "Quarter of 100", explanation: "If you divide 100 into 4 pieces, each piece is 25. So 1/4 of 100 is 25.", text: "1/4 of 100 = 25." }
    ]
  },
  practice: {
    question: "Use your knowledge of fractions and shares to solve these visual puzzles!",
    quiz: [
      { 
        type: "interactive",
        q: "This pizza is cut into 4 slices. If your share is exactly 1 slice (A Quarter), click on the visualizer to claim your share!", 
        theme: 'pizza', totalUnits: 4, targetClicks: 1,
        explanation: "You clicked exactly 1 out of the 4 available slices, which is a Quarter (1/4).",
        breakdown: { logic: "Total = 4 Slices", calculation: "Your Share = 1 Slice", jump: "1 out of 4" }
      },
      { 
        type: "interactive",
        q: "This chocolate bar has 10 pieces. If you want to eat exactly Half of it, click on the pieces you will eat!", 
        theme: 'chocolate', totalUnits: 10, targetClicks: 5,
        explanation: "Half of anything means dividing it by 2. 10 divided by 2 is 5 pieces.",
        breakdown: { logic: "Total = 10 Pieces", calculation: "Your Share = Half", jump: "Half of 10 = 5" }
      },
      { 
        type: "mcq",
        q: "A dollar has 100 pennies. You spend a Quarter (1/4) of your dollar on a gumball. How many pennies did you spend?", 
        theme: 'coin', totalUnits: 100, filledPct: 0.25,
        options: ["50 Pennies", "25 Pennies", "10 Pennies"], 
        correct: 1, 
        explanation: "A quarter means dividing the total by 4. 100 pennies divided by 4 is exactly 25 pennies.",
        breakdown: { logic: "Total = 100 Pennies", calculation: "Your Share = 1 Quarter", jump: "Quarter of 100 = 25" }
      },
      { 
        type: "interactive",
        q: "Your phone battery has 4 energy bars. Click to fill the battery so it represents 'The Whole Thing' (completely full)!", 
        theme: 'battery', totalUnits: 4, targetClicks: 4,
        explanation: "The 'Whole Thing' always means all of the pieces. If there are 4 bars total, all 4 must be filled.",
        breakdown: { logic: "Total = 4 Bars", calculation: "Your Share = The Whole Thing", jump: "Whole of 4 = 4" }
      },
      { 
        type: "mcq",
        q: "A giant fruit pie is cut into 100 slices. You take exactly Half of the pie. How many slices do you have?", 
        theme: 'pizza', totalUnits: 100, filledPct: 0.5,
        options: ["75 Slices", "25 Slices", "50 Slices"], 
        correct: 2, 
        explanation: "Half of 100 is always 50. So half the pie equals 50 slices out of 100.",
        breakdown: { logic: "Total = 100 Slices", calculation: "Your Share = Half", jump: "Half of 100 = 50" }
      }
    ]
  }
};

// --- Math Helpers for SVG ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeWedge = (x, y, radius, startAngle, endAngle) => {
  if (endAngle - startAngle >= 359.9) {
      return `M ${x} ${y-radius} A ${radius} ${radius} 0 1 1 ${x-0.01} ${y-radius} Z`;
  }
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  let diff = endAngle - startAngle;
  if (diff < 0) diff += 360;
  const largeArcFlag = diff <= 180 ? "0" : "1";
  
  return [
      "M", x, y, 
      "L", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "Z"
  ].join(" ");
};


export function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  
  // Interactive Selection State
  const [interactiveSelection, setInteractiveSelection] = useState([]);

  // Practice State
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  const containerRef = useRef(null);
  
  // Safely get current step configuration
  const currentConfig = appMode === 'concept' 
    ? LOGIC_DATA.concept.teachingSteps[activeStep] 
    : LOGIC_DATA.practice.quiz[quizStep];

  const currentQuizSet = LOGIC_DATA.practice.quiz;

  const isInteractive = currentConfig?.type === 'interactive';

  function handleReset() {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setInteractiveSelection([]);
    setActionError("");
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setShowFinishModal(false);
    setLessonFinished(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset();
  }

  // --- Interaction Handlers ---
  function handleSelectionQuiz(idx) {
    if (isInteractive) return;
    setConceptSelectedOption(idx);
    const fbReason = currentConfig.feedback[idx];
    if (idx === currentConfig.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handlePracticeSelection(idx) {
    if (isInteractive) return;
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
    if (idx === currentConfig.correct) setShowExplanation(true); 
    else setShowExplanation(false); 
  }

  const handleVisualClick = (idx) => {
    if (!isInteractive) return;
    if (appMode === 'practice' && quizFeedbackMode) return;
    if (appMode === 'concept' && feedback.type === 'success') return;

    setInteractiveSelection(prev => 
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const submitInteraction = () => {
      const target = currentConfig.targetClicks;
      if (interactiveSelection.length === target) {
          setFeedback({ type: 'success', msg: "Perfect!", reason: "You selected the exact right amount!" });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-1); // Special flag for correct interaction
              setShowExplanation(true);
          }
      } else {
          setFeedback({ type: 'error', msg: "Try Again", reason: `You selected ${interactiveSelection.length}, but we need exactly ${target}!` });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-2); // Special flag for wrong interaction
          }
      }
  };

  function tryAgainPractice() {
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setInteractiveSelection([]);
    setFeedback({ type: null, msg: "", reason: "" });
  }

  function prevStep() {
      if (activeStep > 0) {
          setActiveStep(activeStep - 1);
          setConceptSelectedOption(null);
          setFeedback({ type: null, msg: "", reason: "" });
          setInteractiveSelection([]);
      }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setInteractiveSelection([]);
    } else {
      setLessonFinished(true);
      setShowFinishModal(true);
    }
  }

  function prevPracticeTask() {
      if (quizStep > 0) {
          setQuizStep(quizStep - 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
          setInteractiveSelection([]);
          setFeedback({ type: null, msg: "", reason: "" });
      }
  }

  function nextPracticeTask() {
    if (quizStep < currentQuizSet.length - 1) {
      setQuizStep(quizStep + 1);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
      setInteractiveSelection([]);
      setFeedback({ type: null, msg: "", reason: "" });
    } else {
      setLessonFinished(true);
      setShowFinishModal(true);
    }
  }

  const isQuizPassed = feedback.type === 'success' || (appMode === 'practice' && quizFeedbackMode && (quizSelection === currentConfig?.correct || quizSelection === -1));

  // --- SVG Theming Logic ---
  const getVisualState = () => {
      if (appMode === 'practice') {
          const isRevealed = quizFeedbackMode && quizSelection === currentConfig.correct;
          return {
              theme: currentConfig.theme,
              totalUnits: currentConfig.totalUnits || 100,
              filledPct: isRevealed ? (currentConfig.filledPct || (currentConfig.targetClicks / currentConfig.totalUnits)) : 0
          };
      }

      if (appMode === 'concept') {
          let fPct = 0;
          if (currentConfig.type === 'interactive') {
              if (isQuizPassed) fPct = currentConfig.targetClicks / currentConfig.totalUnits;
          } else if (currentConfig.type === 'mcq') {
              fPct = isQuizPassed ? currentConfig.filledPct : 0;
              if (activeStep === 0) fPct = 1; // Show full pizza at the start
          }

          return {
              theme: 'pizza',
              totalUnits: currentConfig.totalUnits || 2,
              filledPct: fPct
          };
      }
      return { theme: 'pizza', totalUnits: 2, filledPct: 0 };
  }

  const { theme, totalUnits, filledPct } = getVisualState();

  const PizzaTheme = () => {
      const sliceAngle = 360 / totalUnits;

      // Base Pizza (Crust + Sauce)
      const BasePizza = () => (
          <g>
              <circle cx="150" cy="150" r="110" fill="#fde047" stroke="#b45309" strokeWidth="15" />
          </g>
      );

      // Interactive Mode: Render Individual Wedges
      if (isInteractive) {
          return (
              <g>
                  <BasePizza />
                  {Array.from({ length: totalUnits }).map((_, i) => {
                      const startAngle = i * sliceAngle;
                      const endAngle = (i + 1) * sliceAngle;
                      const isSelected = interactiveSelection.includes(i);
                      const midAngle = startAngle + (sliceAngle / 2);
                      const pepPos = polarToCartesian(150, 150, 70, midAngle);
                      
                      return (
                          <g key={i} onClick={() => handleVisualClick(i)} className={!isQuizPassed ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}>
                              <path 
                                  d={describeWedge(150, 150, 110, startAngle, endAngle)} 
                                  fill={isSelected ? "#facc15" : "transparent"} 
                                  stroke="#d97706" 
                                  strokeWidth={totalUnits > 10 ? "1" : "3"} 
                              />
                              {isSelected && totalUnits <= 10 && (
                                  <circle cx={pepPos.x} cy={pepPos.y} r="12" fill="#ef4444" stroke="#991b1b" strokeWidth="2" pointerEvents="none" />
                              )}
                          </g>
                      );
                  })}
                  {/* Redraw crust to cover stroke overlaps */}
                  <circle cx="150" cy="150" r="110" fill="none" stroke="#b45309" strokeWidth="15" pointerEvents="none" />
              </g>
          );
      }

      // Non-interactive Mode (MCQ)
      return (
          <g>
              <BasePizza />
              {/* Lines for non-interactive pizza to show slice boundaries */}
              {totalUnits > 1 && Array.from({length: totalUnits}).map((_, i) => {
                  if (totalUnits >= 50 && i % 2 !== 0) return null;
                  const angle = i * sliceAngle;
                  const edge = polarToCartesian(150, 150, 110, angle);
                  return <line key={angle} x1="150" y1="150" x2={edge.x} y2={edge.y} stroke="#d97706" strokeWidth={totalUnits > 10 ? "1" : "3"} opacity={totalUnits > 10 ? "0.4" : "0.6"} pointerEvents="none" />;
              })}
              
              {/* Filled Portion (Highlights user's share with Pepperoni/Bright Yellow) */}
              {filledPct > 0 && (
                  <g>
                      {filledPct >= 1 ? (
                          <circle cx="150" cy="150" r="110" fill="#facc15" />
                      ) : (
                          <path d={describeWedge(150, 150, 110, 0, filledPct * 360)} fill="#facc15" />
                      )}
                      {/* Redraw crust over the highlight so it stays neat */}
                      <circle cx="150" cy="150" r="110" fill="none" stroke="#b45309" strokeWidth="15" pointerEvents="none" />
                      {/* Random Pepperonis inside filled area */}
                      { [30, 70, 120, 160, 200, 250, 300, 330].map((angle, i) => {
                          if (angle <= filledPct * 360) {
                              const r = [40, 70, 50, 80, 60, 90, 45, 75][i];
                              const pos = polarToCartesian(150, 150, r, angle);
                              return <circle key={`pep-${i}`} cx={pos.x} cy={pos.y} r="12" fill="#ef4444" stroke="#991b1b" strokeWidth="2" pointerEvents="none" />;
                          }
                          return null;
                      })}
                  </g>
              )}
          </g>
      );
  };

  const ChocolateTheme = () => {
      const cols = 2;
      const rows = totalUnits / cols;
      const pW = 50;
      const pH = 200 / rows;

      if (isInteractive) {
          const pieces = Array.from({length: totalUnits}).map((_, i) => {
              const col = i % cols;
              const row = Math.floor(i / cols);
              const isSelected = interactiveSelection.includes(i);

              return (
                  <rect 
                      key={i} 
                      x={100 + col * pW} 
                      y={50 + row * pH} 
                      width={pW} 
                      height={pH} 
                      fill={isSelected ? "#facc15" : "#5d4037"} 
                      stroke="#3e2723" 
                      strokeWidth="4" 
                      onClick={() => handleVisualClick(i)} 
                      className={!isQuizPassed ? "cursor-pointer hover:opacity-80 transition-opacity" : ""} 
                  />
              );
          });
          return (
            <g>
                <rect x="95" y="45" width="110" height="210" rx="12" fill="#2a1a16" opacity="0.4" />
                {pieces}
            </g>
          );
      }

      return (
          <g>
              <rect x="100" y="50" width="100" height="200" rx="10" fill="#5d4037" stroke="#3e2723" strokeWidth="6" />
              {totalUnits === 10 && (
                  <>
                    <line x1="100" y1="90" x2="200" y2="90" stroke="#3e2723" strokeWidth="4" />
                    <line x1="100" y1="130" x2="200" y2="130" stroke="#3e2723" strokeWidth="4" />
                    <line x1="100" y1="170" x2="200" y2="170" stroke="#3e2723" strokeWidth="4" />
                    <line x1="100" y1="210" x2="200" y2="210" stroke="#3e2723" strokeWidth="4" />
                    <line x1="150" y1="50" x2="150" y2="250" stroke="#3e2723" strokeWidth="4" />
                  </>
              )}
              {filledPct > 0 && (
                  <rect x="100" y={50} width="100" height={200 * filledPct} rx="10" fill="#facc15" opacity="0.8" pointerEvents="none" />
              )}
          </g>
      )
  };

  const CoinTheme = () => (
      <g>
          <circle cx="150" cy="150" r="100" fill="#2a1a16" stroke="#facc15" strokeWidth="6" strokeDasharray="8 8" opacity="0.4" />
          {filledPct > 0 && (
              filledPct >= 1 ? (
                  <circle cx="150" cy="150" r="100" fill="#facc15" />
              ) : (
                  <path d={describeWedge(150, 150, 100, 0, filledPct * 360)} fill="#facc15" />
              )
          )}
          <text x="150" y="150" fill="#eab308" fontSize="64" fontWeight="bold" textAnchor="middle" dominantBaseline="central" opacity={filledPct > 0 ? "1" : "0.2"}>¢</text>
      </g>
  );

  const BatteryTheme = () => {
      const pW = 150 / totalUnits;
      
      if (isInteractive) {
          const pieces = Array.from({length: totalUnits}).map((_, i) => {
              const isSelected = interactiveSelection.includes(i);
              return (
                  <rect 
                      key={i} 
                      x={65 + i * pW} 
                      y={115} 
                      width={pW} 
                      height="70" 
                      fill={isSelected ? "#22c55e" : "#2a1a16"} 
                      stroke="#a88a6d" 
                      strokeWidth="2" 
                      onClick={() => handleVisualClick(i)} 
                      className={!isQuizPassed ? "cursor-pointer hover:opacity-80 transition-opacity" : ""} 
                  />
              );
          });
          return (
              <g>
                  <rect x="60" y="110" width="160" height="80" rx="10" fill="#1a110f" stroke="#a88a6d" strokeWidth="6" />
                  <rect x="220" y="135" width="15" height="30" rx="4" fill="#a88a6d" />
                  {pieces}
              </g>
          );
      }

      return (
          <g>
              <rect x="60" y="110" width="160" height="80" rx="10" fill="#2a1a16" stroke="#a88a6d" strokeWidth="6" opacity="0.5"/>
              <rect x="220" y="135" width="15" height="30" rx="4" fill="#a88a6d" opacity="0.5" />
              {filledPct > 0 && <rect x="65" y="115" width={150 * filledPct} height="70" rx="6" fill="#22c55e" />}
              {totalUnits === 4 && (
                  <>
                      <line x1="102.5" y1="110" x2="102.5" y2="190" stroke="#a88a6d" strokeWidth="4" opacity="0.8" />
                      <line x1="140" y1="110" x2="140" y2="190" stroke="#a88a6d" strokeWidth="4" opacity="0.8" />
                      <line x1="177.5" y1="110" x2="177.5" y2="190" stroke="#a88a6d" strokeWidth="4" opacity="0.8" />
                  </>
              )}
          </g>
      );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Fractions & Shares Lab" : "Shares Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-3 sm:p-5 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.5] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[250px]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none text-white z-20">
                {appMode === 'practice' ? <><Eye size={16} /> Simulator</> : <><PieChart size={16} /> Visualizer</>}
            </div>
            
            {/* SVG Visualizer Area */}
            <div className="relative bg-[#3e2723] rounded-full border-[8px] border-[#2a1a16] shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] mt-2 z-10">
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                    {theme === 'pizza' && <PizzaTheme />}
                    {theme === 'chocolate' && <ChocolateTheme />}
                    {theme === 'coin' && <CoinTheme />}
                    {theme === 'battery' && <BatteryTheme />}
                </svg>
            </div>
        </div>

        {/* BOTTOM PANEL - GUIDANCE & QUIZ */}
        <div className="flex-[0.8] lg:flex-[1.0] w-full bg-[#3e2723] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-t-4 border-black shadow-2xl relative z-20 flex flex-col gap-4 overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-4 sm:gap-8 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Details */}
            <div className="flex flex-col gap-3 h-full min-h-0">
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-4 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg flex gap-3 items-start text-white shrink-0`}>
                    <div className="bg-amber-400 p-2 sm:p-2.5 rounded-xl text-black shrink-0 shadow-md">
                        <PieChart size={24} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-amber-400 font-black uppercase text-[10px] sm:text-[11px] tracking-widest leading-none mb-0.5">The Master Objective</span>
                        <p className="text-[13px] sm:text-[15px] font-medium leading-snug tracking-tight text-white/90">
                            {appMode === 'concept' ? LOGIC_DATA.concept.question : LOGIC_DATA.practice.question}
                        </p>
                    </div>
                </div>

                {/* Concept Info (Only in Concept Mode) */}
                {appMode === 'concept' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3 sm:p-4">
                        <div className="flex items-center gap-2 opacity-50 mb-3 border-b border-white/10 pb-2">
                            <BookOpen size={16} className="text-[#a88a6d]" />
                            <span className="text-[#a88a6d] font-black uppercase text-[11px] sm:text-[12px] tracking-wider">Concept Rules</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {LOGIC_DATA.concept.clues.map((clue) => {
                                const isActive = clue.step === activeStep;
                                const isPassed = clue.step < activeStep;
                                if (!isActive && !isPassed) return null;
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1.5 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                    <span className="w-fit px-2 py-1 rounded bg-amber-400 text-black font-black text-[10px] uppercase tracking-wider">
                                        {clue.concept}
                                    </span>
                                    <p className="text-white text-[12px] sm:text-[13px] leading-snug pl-2 border-l-2 border-white/20 mt-1">{clue.explanation}</p>
                                  </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Detailed Practice Breakdown (Only in Practice Mode) */}
                {appMode === 'practice' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-4">
                        {quizFeedbackMode && showExplanation ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
                                <h4 className="text-amber-400 font-black uppercase text-[11px] sm:text-[13px] tracking-widest mb-4 flex items-center gap-2 border-b border-amber-500/20 pb-2">
                                    <Info size={18}/> Logic Breakdown
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white mb-4">
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><DivideSquare size={14}/> Math Logic</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-blue-500/30 shadow-inner">
                                        <span className="text-blue-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><Calculator size={14}/> Calculation</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px] text-blue-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><FastForward size={14}/> Result</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-amber-900/40 border border-amber-500/50 p-4 rounded-xl text-amber-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner">
                                    {currentQuizSet[quizStep]?.explanation}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-4">
                                <Calculator size={40} className="mb-3" />
                                <p className="text-[12px] font-bold uppercase tracking-widest">Detailed breakdown will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column: Interaction Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-6 rounded-2xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {/* CONCEPT MODE INTERACTION */}
                        {appMode === 'concept' && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col gap-4 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                               <span className="text-amber-400 font-black text-[11px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><Compass size={16}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[13px] sm:text-[15px] leading-snug">{currentConfig?.selectionPrompt}</p>
                            
                            {/* Rendering Interaction Types */}
                            {isInteractive ? (
                                <div className="flex flex-col items-center gap-4 py-4 mt-auto">
                                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                                        <MousePointer2 size={28} className="animate-bounce" />
                                        <span className="text-sm sm:text-base font-black uppercase tracking-widest">Tap Visualizer Slices</span>
                                    </div>
                                    <p className="text-white/80 text-xs sm:text-sm font-bold text-center">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                    
                                    <button 
                                        disabled={isQuizPassed}
                                        onClick={submitInteraction} 
                                        className={`w-full py-3.5 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 mt-2 ${isQuizPassed ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black border-amber-700 active:translate-y-1 active:border-b-0'}`}
                                    >
                                        Submit Selection
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 py-3 mt-auto">
                                    {currentConfig?.options?.map((opt, i) => {
                                        const isSelected = conceptSelectedOption === i;
                                        const isCorrect = isSelected && isQuizPassed;
                                        const isWrong = isSelected && feedback.type === 'error';
                                        
                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 active:scale-95";
                                        if (isCorrect) btnClass = "bg-emerald-600 border-emerald-400 text-white shadow-lg";
                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                        else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                        return (
                                            <button 
                                                key={i} 
                                                disabled={isQuizPassed}
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 py-3 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-2 ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[13px] font-bold italic text-center animate-pulse mt-2">"{feedback.reason}"</p>}
                            
                            {/* Post-Answer Next Button */}
                            {isQuizPassed && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-auto pt-4 border-t border-white/10">
                                    <div className="flex gap-3 w-full">
                                        <button onClick={prevStep} disabled={activeStep === 0} className={`py-3 px-5 rounded-xl font-black transition-all border-2 ${activeStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                            <ChevronLeft size={20} />
                                        </button>

                                        <button onClick={nextStep} className="flex-1 py-3 sm:py-4 rounded-xl font-black uppercase text-[13px] sm:text-[15px] transition-all bg-emerald-600 text-white border-b-4 border-emerald-800 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                            {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Lesson' : 'Next Step'}
                                        </button>
                                    </div>
                                    {actionError && <p className="text-rose-400 text-[12px] font-bold text-center">"{actionError}"</p>}
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* PRACTICE MODE INTERACTION */}
                        {appMode === 'practice' && (
                            <motion.div key={`practice-quiz-${quizStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                                    <span className="text-amber-400 font-black text-[11px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><HelpCircle size={14}/> Question {quizStep + 1}/{currentQuizSet.length}</span>
                                </div>
                                <p className="text-white text-[15px] sm:text-[18px] font-bold leading-snug">{currentConfig?.q}</p>
                                
                                {isInteractive ? (
                                    <div className="flex flex-col items-center gap-4 py-4 mt-auto">
                                        {!quizFeedbackMode && (
                                           <div className="flex items-center gap-2 text-amber-400 mb-2">
                                               <MousePointer2 size={28} className="animate-bounce" />
                                               <span className="text-sm sm:text-base font-black uppercase tracking-widest">Tap the Visualizer</span>
                                           </div>
                                        )}
                                        <p className="text-white/80 text-xs sm:text-sm font-bold text-center">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                        
                                        <button 
                                            disabled={quizFeedbackMode && quizSelection === -1}
                                            onClick={submitInteraction} 
                                            className={`w-full py-3.5 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 mt-2 ${(quizFeedbackMode && quizSelection === -1) ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black border-amber-700 active:translate-y-1 active:border-b-0'}`}
                                        >
                                            Submit Selection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 py-3 mt-auto">
                                        {currentConfig?.options?.map((opt, idx) => {
                                            let style = "bg-black/40 border-white/10 text-white hover:bg-black/60";
                                            if (quizFeedbackMode) {
                                                if (idx === currentConfig?.correct) style = "bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105 z-10";
                                                else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                                else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                                            }
                                            return (
                                                <button key={idx} disabled={quizFeedbackMode} onClick={() => handlePracticeSelection(idx)} className={`p-4 sm:p-5 rounded-xl font-black text-[13px] sm:text-[15px] border-2 transition-all ${style}`}>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {!isInteractive && quizFeedbackMode && quizSelection !== currentConfig?.correct && quizSelection >= 0 && (
                                   <p className="text-rose-400 text-[13px] font-bold italic text-center animate-pulse mt-2">Incorrect. Try again or view logic.</p>
                                )}
                                {isInteractive && quizFeedbackMode && quizSelection === -2 && (
                                   <p className="text-rose-400 text-[13px] font-bold italic text-center animate-pulse mt-2">{feedback.reason}</p>
                                )}

                                {quizFeedbackMode && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-auto pt-4 border-t border-white/10">
                                        <div className="flex gap-3 w-full">
                                            <button onClick={prevPracticeTask} disabled={quizStep === 0} className={`py-3 px-5 rounded-xl font-black transition-all border-2 ${quizStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                                <ChevronLeft size={20} />
                                            </button>
                                            
                                            {/* Wrong Answer View */}
                                            {((!isInteractive && quizSelection !== currentConfig?.correct) || (isInteractive && quizSelection === -2)) ? (
                                                <>
                                                    <button onClick={tryAgainPractice} className="flex-1 py-3 sm:py-4 bg-rose-600 text-white rounded-xl font-black text-[12px] sm:text-[14px] uppercase border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        Try Again
                                                    </button>
                                                    <button onClick={() => setShowExplanation(!showExplanation)} className="flex-1 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-black text-[12px] sm:text-[14px] uppercase border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        {showExplanation ? "Hide Logic" : "View Logic"}
                                                    </button>
                                                </>
                                            ) : (
                                                /* Correct Answer View */
                                                <button onClick={nextPracticeTask} className={`flex-1 py-3 sm:py-4 text-white rounded-xl font-black text-[13px] sm:text-[15px] uppercase border-b-4 border-emerald-800 bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]`}>
                                                    {quizStep === currentQuizSet.length - 1 ? "Finish Lab" : "Next Question"}
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>
      </main>

      {/* FULL SCREEN COMPLETION MODAL */}
      <AnimatePresence>
        {showFinishModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            >
               <motion.div 
                   initial={{ scale: 0.9, y: 20 }} 
                   animate={{ scale: 1, y: 0 }} 
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-[#2a1a16] border-4 border-[#8d6e63] shadow-2xl p-6 sm:p-10 rounded-[3rem] flex flex-col items-center gap-6 w-full max-w-md text-center relative overflow-hidden"
               >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />
                  
                  <div className="bg-amber-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-amber-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully learned how fractions map to physical shares!" 
                              : "You solved the Shares and Fractions challenges flawlessly!"}
                      </p>
                  </div>
                  
                  <div className="flex flex-col gap-3 w-full mt-8 relative z-10">
                     {appMode === 'concept' ? (
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 sm:py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[15px] sm:text-[16px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-emerald-900">Start Practice Questions</button>
                     ) : (
                         <button onClick={() => setShowFinishModal(false)} className="w-full py-4 sm:py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[15px] sm:text-[16px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-emerald-900">Go To Next Module</button>
                     )}
                     <button onClick={() => { handleReset(); setShowFinishModal(false); }} className="w-full py-3 sm:py-4 rounded-xl bg-black/40 hover:bg-black/60 text-[#a88a6d] hover:text-white font-black uppercase text-[13px] sm:text-[14px] tracking-wider transition-all border border-white/10">Restart Module</button>
                  </div>
                  
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors z-20">
                      <X size={28} />
                  </button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }