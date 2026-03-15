import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  HelpCircle,
  Compass,
  Info,
  MousePointer2,
  Eye,
  PieChart,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DivideSquare,
  FastForward,
  Calculator,
  Percent,
  Apple
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
    question: "How do we find the percentage of a share?",
    teachingSteps: [
      { 
        id: "step-1",
        type: "interactive",
        theme: 'pizza',
        totalUnits: 4,
        targetClicks: 2, 
        selectionPrompt: "Step 1: Your Share. Let's start with a pizza cut into 4 slices. Tap exactly 2 slices to claim your half!",
        why: "You selected 2 out of 4 slices. This is exactly half the pizza."
      },
      { 
        id: "step-2",
        type: "mcq",
        theme: 'pizza',
        totalUnits: 100,
        filledPct: 0.5,
        selectionPrompt: "Step 2: Scale to 100. You have half the pizza. If this pizza magically had 100 slices instead, how many slices would make up your half?",
        options: ["25 Slices", "50 Slices", "100 Slices"],
        correct: 1,
        feedback: [
          "That would be a quarter of the pizza.",
          "Exactly! Half of 100 is 50.",
          "That's the whole pizza!"
        ],
        why: "Half of 100 is exactly 50."
      },
      { 
        id: "step-3",
        type: "mcq",
        theme: 'pizza',
        totalUnits: 100,
        filledPct: 0.5,
        selectionPrompt: "Step 3: The Magic Word. Your share is 50 out of 100 slices. Since 'Percent' literally means 'out of 100', how do we show this in percentage form?",
        options: ["20%", "50%", "100%"],
        correct: 1,
        feedback: [
          "Too low!",
          "YES! 50 out of 100 is exactly 50 percentage (50%).",
          "That's the whole thing."
        ],
        why: "Because percentage means 'out of 100', 50 out of 100 is 50%."
      },
      { 
        id: "step-4",
        type: "mcq",
        theme: 'battery',
        totalUnits: 5,
        filledPct: 0.8,
        selectionPrompt: "Step 4: The Battery Check. This battery has 5 cells, and 4 are full. Can we find the percentage? Let's assume it has 100 cells! If 5 cells scale up to 100 (5 × 20 = 100), what does your share of 4 scale up to?",
        options: ["40", "80", "100"],
        correct: 1,
        feedback: [
          "Check your math: 4 × 20.",
          "Spot on! 4 × 20 = 80. So for 100, it would be 80. Hence it is 80% charged!",
          "Too high!"
        ],
        why: "If 5 cells scale to 100, then 4 cells scale to 80. So it is 80% charged!"
      },
      { 
        id: "step-5",
        type: "info",
        theme: 'battery',
        totalUnits: 5,
        filledPct: 0.8,
        selectionPrompt: "Step 5: The Golden Formula. Instead of scaling up manually every time, we can directly solve it like this: (Your Share ÷ Total Quantity) × 100. For our battery: (4 ÷ 5) × 100 = 0.8 × 100 = 80%. It works for everything!",
        buttonText: "I've Got The Formula!",
        why: "Formula: (Part ÷ Whole) × 100 = Percentage."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Fractions", explanation: "Taking 2 slices out of a total of 4 is written as 2/4.", text: "Share = Part / Whole" },
      { id: 2, step: 1, concept: "Scaling", explanation: "Percentages are always out of 100. Multiply both numbers by the same amount to reach 100.", text: "Scale to 100." },
      { id: 3, step: 2, concept: "Percent", explanation: "50 pieces out of 100 pieces total is written as 50%.", text: "50 out of 100 = 50%" },
      { id: 4, step: 3, concept: "Proportions", explanation: "4 out of 5 is the exact same proportion as 80 out of 100.", text: "4/5 = 80/100" },
      { id: 5, step: 4, concept: "The Formula", explanation: "To find ANY percentage instantly, divide the Part by the Whole, then multiply by 100.", text: "(Part ÷ Whole) × 100" }
    ]
  },
  practice: {
    question: "Calculate the percentages using the Golden Formula: (Part ÷ Whole) × 100",
    quiz: [
      { 
        type: "interactive",
        q: "Your phone battery has 4 energy bars. Tap the bars to show that it is exactly 75% charged!", 
        theme: 'battery', totalUnits: 4, targetClicks: 3,
        explanation: "Using reverse math: 75% of 4 bars is 3 bars. (3 ÷ 4) × 100 = 75%.",
        breakdown: { logic: "Formula: (3 ÷ 4) × 100", calculation: "0.75 × 100", jump: "75%" }
      },
      { 
        type: "mcq",
        q: "A giant pizza is cut into 10 slices. You eat 4 slices. What percentage did you eat?", 
        theme: 'pizza', totalUnits: 10, filledPct: 0.4,
        options: ["40%", "25%", "4%"], 
        correct: 0, 
        explanation: "4 ÷ 10 = 0.4. 0.4 × 100 = 40%.",
        breakdown: { logic: "Part = 4, Whole = 10", calculation: "(4 ÷ 10) × 100", jump: "40%" }
      },
      { 
        type: "interactive",
        q: "This chocolate bar has 10 pieces. Tap the pieces to eat exactly 50% of the bar!", 
        theme: 'chocolate', totalUnits: 10, targetClicks: 5,
        explanation: "5 out of 10 pieces is exactly half. (5 ÷ 10) × 100 = 50%.",
        breakdown: { logic: "Formula: (5 ÷ 10) × 100", calculation: "0.5 × 100", jump: "50%" }
      },
      { 
        type: "mcq",
        q: "Your battery has 5 cells total and 2 are charged. What is the charge percentage?", 
        theme: 'battery', totalUnits: 5, filledPct: 0.4,
        options: ["20%", "40%", "50%"], 
        correct: 1, 
        explanation: "2 ÷ 5 = 0.4. 0.4 × 100 = 40%.",
        breakdown: { logic: "Part = 2, Whole = 5", calculation: "(2 ÷ 5) × 100", jump: "40%" }
      },
      { 
        type: "interactive",
        q: "This pizza has 8 slices. Tap the slices to show exactly 50% eaten!", 
        theme: 'pizza', totalUnits: 8, targetClicks: 4,
        explanation: "Half of 8 slices is 4 slices. (4 ÷ 8) × 100 = 50%.",
        breakdown: { logic: "Formula: (4 ÷ 8) × 100", calculation: "0.5 × 100", jump: "50%" }
      },
      { 
        type: "mcq",
        q: "A giant power bank holds 500 units of power, and it currently has 400 units charged. What is the charge percentage?", 
        theme: 'battery', totalUnits: 10, filledPct: 0.8,
        options: ["40%", "80%", "100%"], 
        correct: 1, 
        explanation: "400 ÷ 500 = 0.8. 0.8 × 100 = 80%.",
        breakdown: { logic: "Part = 400, Whole = 500", calculation: "(400 ÷ 500) × 100", jump: "80%" }
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


export default function LabContent() {
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
  
  const currentConfig = appMode === 'concept' 
    ? LOGIC_DATA.concept.teachingSteps[activeStep] 
    : LOGIC_DATA.practice.quiz[quizStep];

  const currentQuizSet = LOGIC_DATA.practice.quiz;
  const isInteractive = currentConfig?.type === 'interactive';
  const isInfo = currentConfig?.type === 'info';

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

  function handleSelectionQuiz(idx) {
    if (isInteractive || isInfo) return;
    setConceptSelectedOption(idx);
    const fbReason = currentConfig.feedback[idx];
    if (idx === currentConfig.correct) {
      setFeedback({ type: 'success', msg: "Correct!", reason: String(fbReason) });
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handlePracticeSelection(idx) {
    if (isInteractive || isInfo) return;
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
          setFeedback({ type: 'success', msg: "Perfect!", reason: currentConfig.why || "You selected the exact right amount!" });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-1); 
              setShowExplanation(true);
          }
      } else {
          setFeedback({ type: 'error', msg: "Try Again", reason: `You selected ${interactiveSelection.length}, but we need exactly ${target}!` });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-2); 
          }
      }
  };

  const submitInfo = () => {
      setFeedback({ type: 'success', msg: "Formula Learned!", reason: currentConfig.why });
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
          const isRevealed = quizFeedbackMode && quizSelection === currentConfig?.correct;
          let fPct = 0;
          if (currentConfig?.type === 'interactive') {
              fPct = isRevealed ? (currentConfig.targetClicks / currentConfig.totalUnits) : 0;
          } else {
              fPct = currentConfig?.filledPct ?? 0;
          }
          return { 
              theme: currentConfig?.theme || 'pizza', 
              totalUnits: currentConfig?.totalUnits || 4, 
              filledPct: fPct 
          };
      }

      if (appMode === 'concept') {
          let fPct = 0;
          if (currentConfig?.type === 'interactive') {
              if (isQuizPassed) fPct = currentConfig.targetClicks / currentConfig.totalUnits;
          } else if (currentConfig?.type === 'mcq' || currentConfig?.type === 'info') {
              fPct = currentConfig?.filledPct ?? 0;
          }
          return {
              theme: currentConfig?.theme || 'pizza',
              totalUnits: currentConfig?.totalUnits || 4,
              filledPct: fPct
          };
      }
      return { theme: 'pizza', totalUnits: 4, filledPct: 0 };
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

      // Non-interactive Mode (MCQ / Info)
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
      const cols = totalUnits === 10 ? 2 : 1;
      const rows = totalUnits / cols;
      const pW = 100 / cols;
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
              {/* Dynamic Segment Lines based on totalUnits */}
              {Array.from({ length: totalUnits - 1 }).map((_, i) => {
                  const x = 65 + ((i + 1) * pW);
                  return <line key={i} x1={x} y1="110" x2={x} y2="190" stroke="#a88a6d" strokeWidth="4" opacity="0.8" pointerEvents="none" />
              })}
          </g>
      );
  };

  const AppleTheme = () => {
      let cols = 2;
      if (totalUnits === 5) cols = 5;
      if (totalUnits === 8) cols = 4;
      if (totalUnits === 10) cols = 5;
      if (totalUnits === 100) cols = 10;
      
      const rows = Math.ceil(totalUnits / cols);
      const cellW = 260 / cols; 
      const cellH = 260 / rows;
      const startX = 150 - (cols * cellW) / 2 + cellW / 2;
      const startY = 150 - (rows * cellH) / 2 + cellH / 2;

      const hasSelection = isInteractive ? interactiveSelection.length > 0 : filledPct > 0;

      return (
          <g>
              {Array.from({ length: totalUnits }).map((_, i) => {
                  const c = i % cols;
                  const r = Math.floor(i / cols);
                  const x = startX + c * cellW;
                  const y = startY + r * cellH;
                  
                  let isSelected = false;
                  if (isInteractive) {
                      isSelected = interactiveSelection.includes(i);
                  } else {
                      isSelected = i < (filledPct * totalUnits);
                  }

                  const rApple = Math.min(cellW, cellH) * 0.35;
                  
                  // Custom Bezier paths to create an authentic Apple shape!
                  const appleBody = `M ${x} ${y + rApple*0.6} 
                                     C ${x - rApple} ${y + rApple}, 
                                       ${x - rApple*1.2} ${y - rApple*0.4}, 
                                       ${x - rApple*0.5} ${y - rApple*0.8} 
                                     C ${x - rApple*0.2} ${y - rApple*0.9}, 
                                       ${x} ${y - rApple*0.5}, 
                                       ${x} ${y - rApple*0.5} 
                                     C ${x} ${y - rApple*0.5}, 
                                       ${x + rApple*0.2} ${y - rApple*0.9}, 
                                       ${x + rApple*0.5} ${y - rApple*0.8} 
                                     C ${x + rApple*1.2} ${y - rApple*0.4}, 
                                       ${x + rApple} ${y + rApple}, 
                                       ${x} ${y + rApple*0.6} Z`;
                  
                  const leaf = `M ${x} ${y - rApple*0.6} 
                                Q ${x + rApple*0.5} ${y - rApple*1.3} 
                                  ${x + rApple*0.8} ${y - rApple*0.8} 
                                Q ${x + rApple*0.3} ${y - rApple*0.4} 
                                  ${x} ${y - rApple*0.6} Z`;
                                  
                  const stem = `M ${x} ${y - rApple*0.5} Q ${x - rApple*0.2} ${y - rApple*1.2} ${x + rApple*0.1} ${y - rApple*1.4}`;

                  const scaleTransform = isSelected ? `scale(1.15)` : `scale(1)`;
                  const appleOpacity = hasSelection && !isSelected ? 0.3 : 1;

                  return (
                      <g 
                        key={i} 
                        onClick={() => handleVisualClick(i)} 
                        className={isInteractive && !isQuizPassed ? "cursor-pointer hover:opacity-100" : ""} 
                        style={{ 
                            transformOrigin: `${x}px ${y}px`, 
                            transform: scaleTransform, 
                            opacity: appleOpacity,
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
                        }}
                      >
                          {/* Dashed Selection Ring */}
                          {isSelected && <circle cx={x} cy={y} r={rApple*1.25} fill="none" stroke="#facc15" strokeWidth={totalUnits >= 100 ? "1.5" : "3"} strokeDasharray={totalUnits >= 100 ? "2 2" : "4 4"} opacity="0.8" pointerEvents="none" />}
                          
                          <path d={stem} stroke="#78350f" strokeWidth={totalUnits >= 100 ? "1" : "2"} fill="none" />
                          <path d={leaf} fill="#22c55e" stroke="#166534" strokeWidth={totalUnits >= 100 ? "0.5" : "1"} />
                          <path d={appleBody} fill="#ef4444" stroke={isSelected ? "#facc15" : "#991b1b"} strokeWidth={isSelected ? (totalUnits >= 100 ? "1.5" : "2.5") : (totalUnits >= 100 ? "0.5" : "1.5")} />
                          
                          {/* Glossy reflection mark */}
                          <path d={`M ${x - rApple*0.6} ${y - rApple*0.2} Q ${x - rApple*0.4} ${y - rApple*0.6} ${x - rApple*0.1} ${y - rApple*0.7}`} stroke="white" strokeWidth={totalUnits >= 100 ? "0.5" : "1.5"} strokeLinecap="round" fill="none" opacity="0.5" />
                      </g>
                  );
              })}
          </g>
      );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Discovery Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-3 sm:p-5 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.5] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[250px]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none text-white z-20">
                {appMode === 'practice' ? <><Eye size={16} /> Simulator</> : <><PieChart size={16} /> Visualizer</>}
            </div>
            
            {/* SVG Visualizer Area */}
            <div className="relative bg-[#2a1a16] rounded-3xl border-4 border-[#3e2723] shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] mt-2 z-10">
                <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                    {theme === 'pizza' && <PizzaTheme />}
                    {theme === 'chocolate' && <ChocolateTheme />}
                    {theme === 'battery' && <BatteryTheme />}
                    {theme === 'apple' && <AppleTheme />}
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
                        <Percent size={24} strokeWidth={2.5}/>
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
                            {isInfo ? (
                                <div className="flex flex-col gap-3 py-3 mt-auto">
                                    {!isQuizPassed && (
                                        <button 
                                            onClick={submitInfo} 
                                            className={`px-5 py-3 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 bg-amber-500 hover:bg-amber-400 text-black border-amber-700 active:translate-y-1 active:border-b-0`}
                                        >
                                            {currentConfig.buttonText}
                                        </button>
                                    )}
                                </div>
                            ) : isInteractive ? (
                                <div className="flex flex-col items-center gap-4 py-4 mt-auto">
                                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                                        <MousePointer2 size={28} className="animate-bounce" />
                                        <span className="text-sm sm:text-base font-black uppercase tracking-widest">Tap Visualizer Elements</span>
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
                              ? "You've successfully learned how to calculate percentages!" 
                              : "You solved the Shares and Percentages challenges flawlessly!"}
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }