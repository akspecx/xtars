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
  Grid3X3,
  Users
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
    question: "How do we calculate the percentage of a specific number?",
    teachingSteps: [
      { 
        id: "step-1",
        type: "interactive",
        theme: 'apple',
        totalUnits: 10,
        targetClicks: 5, 
        selectionPrompt: "Step 1: A Simple Situation. Look at the visualizer. There are 10 apples. If I give you half of these apples, how many will you get? Tap your share!",
        why: "Half of 10 is 5. You get exactly 5 apples."
      },
      { 
        id: "step-2",
        type: "info",
        theme: 'apple',
        totalUnits: 10,
        filledPct: 0.5,
        selectionPrompt: "Step 2: Show Why This Works. You took 5 apples. We already learned that half = 50%. So, what is 50% of 10 apples? It is simply half of 10, which equals 5!\n\n(50% of 10 = half of 10 = 5)",
        buttonText: "Got it: 50% of 10 = 5",
        why: "50% means 50 out of 100, which is the same as half. Linking percentage with fractions makes it easy!"
      },
      { 
        id: "step-3",
        type: "interactive",
        theme: 'chocolate',
        totalUnits: 20,
        targetClicks: 10,
        selectionPrompt: "Step 3: Another Example. Now look at the visualizer. Here are 20 chocolate pieces. What is 50% of 20 chocolates? Remember, 50% just means half! Tap 50% of the pieces.",
        why: "Half of 20 is 10. So, 50% of 20 = 10."
      },
      { 
        id: "step-4",
        type: "interactive",
        theme: 'apple',
        totalUnits: 20,
        targetClicks: 5,
        selectionPrompt: "Step 4: Introduce Another Percentage. Let's move to 25%. We learned earlier that 25% is exactly One Quarter (1/4). What is 25% of 20 apples? Tap exactly 1/4 of the apples to find out!",
        why: "1/4 of 20 is 5. Since 25% is the same as a quarter, 25% of 20 = 5."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "50% = Half", explanation: "Whenever you see 50%, just divide the total number by 2.", text: "50% = 1/2" },
      { id: 2, step: 1, concept: "Visualizing 50%", explanation: "50% of 10 apples means taking half of the 10 apples, which is 5.", text: "50% of 10 = 5" },
      { id: 3, step: 2, concept: "Consistency", explanation: "This rule works for any number! 50% of 20 is simply half of 20, which is 10.", text: "50% of 20 = 10" },
      { id: 4, step: 3, concept: "25% = Quarter", explanation: "25% means 1/4. To find 25%, divide the total number into 4 equal parts and take one.", text: "25% = 1/4" }
    ]
  },
  practice: {
    question: "Use your fraction linking logic to calculate these percentages!",
    quiz: [
      { 
        id: "prac-1",
        type: "interactive",
        q: "You have 8 apples. What is 50% of 8 apples? Tap the correct amount!", 
        theme: 'apple', totalUnits: 8, targetClicks: 4,
        explanation: "50% means half. Half of 8 is 4.",
        breakdown: { logic: "50% = Half", calculation: "8 / 2", jump: "4 Apples" }
      },
      { 
        id: "prac-2",
        type: "interactive",
        q: "Here are 12 pieces of chocolate. What is 50% of 12 chocolates? Tap your share!", 
        theme: 'chocolate', totalUnits: 12, targetClicks: 6,
        explanation: "50% means half. Half of 12 is 6.",
        breakdown: { logic: "50% = Half", calculation: "12 / 2", jump: "6 Pieces" }
      },
      { 
        id: "prac-3",
        type: "interactive",
        q: "You have 8 apples. What is 25% of 8 apples? (Hint: 25% = 1/4)", 
        theme: 'apple', totalUnits: 8, targetClicks: 2,
        explanation: "25% means one quarter (1/4). A quarter of 8 is 2.",
        breakdown: { logic: "25% = 1/4 (Quarter)", calculation: "8 / 4", jump: "2 Apples" }
      },
      { 
        id: "prac-4",
        type: "mcq",
        q: "If there are 40 students in a class and 50% of them like math, how many students like math?", 
        theme: 'survey', totalUnits: 40, filledPct: 0.5,
        options: ["10 Students", "20 Students", "40 Students"], 
        correct: 1, 
        explanation: "50% means half. Half of 40 students is exactly 20 students.",
        breakdown: { logic: "50% = Half", calculation: "40 / 2", jump: "20 Students" }
      },
      { 
        id: "prac-5",
        type: "mcq",
        q: "What is 25% of 40 students?", 
        theme: 'survey', totalUnits: 40, filledPct: 0.25,
        options: ["10 Students", "25 Students", "5 Students"], 
        correct: 0, 
        explanation: "25% means a quarter (1/4). 40 divided by 4 is 10 students.",
        breakdown: { logic: "25% = 1/4", calculation: "40 / 4", jump: "10 Students" }
      }
    ]
  }
};

// --- Simple Apple SVG Component ---
const AppleIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
        <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
);

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  
  // Interactive Selection States
  const [interactiveSelection, setInteractiveSelection] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

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
    setIsDragging(false);
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
    const fbReason = currentConfig?.feedback ? currentConfig.feedback[idx] : "Correct!";
    if (idx === currentConfig?.correct) {
      setFeedback({ type: 'success', msg: "Correct!", reason: String(fbReason) });
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
    }
  }

  function handlePracticeSelection(idx) {
    if (isInteractive || isInfo) return;
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
    if (idx === currentConfig?.correct) setShowExplanation(true); 
    else setShowExplanation(false); 
  }

  const handleVisualClick = (idx, forceAdd = false) => {
    if (!isInteractive) return;
    if (appMode === 'practice' && quizFeedbackMode) return;
    if (appMode === 'concept' && feedback.type === 'success') return;

    setInteractiveSelection(prev => {
        if (prev.includes(idx)) {
            return forceAdd ? prev : prev.filter(i => i !== idx);
        } else {
            return [...prev, idx];
        }
    });
  };

  const submitInteraction = () => {
      const target = currentConfig?.targetClicks;
      if (interactiveSelection.length === target) {
          setFeedback({ type: 'success', msg: "Perfect!", reason: currentConfig?.why || "You matched the target perfectly!" });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-1); 
              setShowExplanation(true);
          }
      } else {
          setFeedback({ type: 'error', msg: "Keep Trying", reason: `You selected ${interactiveSelection.length}. We need exactly ${target}.` });
          if (appMode === 'practice') {
              setQuizFeedbackMode(true);
              setQuizSelection(-2); 
          }
      }
  };

  const submitInfo = () => {
      setFeedback({ type: 'success', msg: "Concept Understood!", reason: currentConfig.why });
  };

  function tryAgainPractice() {
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    // Do NOT clear interactive selection here, let them adjust from where they left off
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
              // In practice interactive, we ONLY show what they clicked
              fPct = 0; 
          } else {
              fPct = currentConfig?.filledPct ?? 0;
          }
          return { 
              theme: currentConfig?.theme || 'chocolate', 
              totalUnits: currentConfig?.totalUnits || 10, 
              filledPct: fPct 
          };
      }

      if (appMode === 'concept') {
          let fPct = 0;
          if (currentConfig?.type === 'interactive') {
              // Only let user clicks drive the visual in concept interactive steps until passed, then lock it
              fPct = 0;
          } else if (currentConfig?.type === 'mcq' || currentConfig?.type === 'info') {
              fPct = currentConfig?.filledPct ?? 0;
          }
          return {
              theme: currentConfig?.theme || 'chocolate',
              totalUnits: currentConfig?.totalUnits || 10,
              filledPct: fPct
          };
      }
      return { theme: 'chocolate', totalUnits: 10, filledPct: 0 };
  }

  const { theme, totalUnits, filledPct } = getVisualState();

  const ChocolateTheme = () => {
      let cols = 2; // Default
      if (totalUnits === 12) cols = 3;
      if (totalUnits === 20) cols = 4;
      
      const rows = totalUnits / cols;
      const pW = 100 / cols;
      const pH = 200 / rows;

      const pieces = Array.from({length: totalUnits}).map((_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          
          let isSelected = false;
          if (isInteractive) {
              isSelected = interactiveSelection.includes(i);
          } else {
              // Fill vertically for visual clarity
              const targetCount = Math.round(filledPct * totalUnits);
              const indexByCol = col * rows + row; 
              isSelected = indexByCol < targetCount;
          }

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
                  onMouseEnter={(e) => { if (e.buttons === 1) handleVisualClick(i, true) }}
                  className={isInteractive && !isQuizPassed ? "cursor-pointer hover:brightness-110 transition-all" : "transition-all"} 
              />
          );
      });

      return (
        <g>
            <rect x="95" y="45" width="110" height="210" rx="12" fill="#2a1a16" opacity="0.4" />
            {pieces}
        </g>
      );
  };

  const SurveyTheme = () => {
      let cols = 5;
      if (totalUnits === 40) cols = 8;
      const rows = Math.ceil(totalUnits / cols);
      
      const cellW = 220 / cols;
      const cellH = 200 / rows;
      const startX = 150 - (cols * cellW) / 2 + cellW / 2;
      const startY = 150 - (rows * cellH) / 2 + cellH / 2;

      return (
          <g>
              <rect x="30" y="40" width="240" height="220" rx="16" fill="#1a110f" opacity="0.4" />
              {Array.from({length: totalUnits}).map((_, i) => {
                  const r = Math.floor(i / cols);
                  const c = i % cols;
                  const x = startX + c * cellW;
                  const y = startY + r * cellH;
                  
                  let isSelected = false;
                  if (isInteractive) {
                      isSelected = interactiveSelection.includes(i);
                  } else {
                      isSelected = i < (filledPct * totalUnits);
                  }

                  const scale = totalUnits >= 40 ? 0.7 : 1;

                  return (
                      <g 
                          key={i} 
                          onClick={() => handleVisualClick(i)} 
                          onMouseEnter={(e) => { if (e.buttons === 1) handleVisualClick(i, true) }}
                          className={isInteractive && !isQuizPassed ? "cursor-pointer hover:scale-110 transition-transform origin-center" : "transition-transform origin-center"}
                          style={{ transformOrigin: `${x}px ${y}px`, transform: `scale(${scale})` }}
                      >
                          <circle cx={x} cy={y-8} r="8" fill={isSelected ? "#facc15" : "#5d4037"} stroke="#2a1a16" strokeWidth="2" />
                          <path d={`M ${x-10} ${y+16} C ${x-10} ${y}, ${x+10} ${y}, ${x+10} ${y+16} Z`} fill={isSelected ? "#facc15" : "#5d4037"} stroke="#2a1a16" strokeWidth="2" />
                      </g>
                  );
              })}
          </g>
      );
  };

  const AppleTheme = () => {
      let cols = 2;
      if (totalUnits === 8) cols = 4;
      if (totalUnits === 10) cols = 5;
      if (totalUnits === 20) cols = 5;
      if (totalUnits === 40) cols = 8;
      
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

  // Real-time calculation logic for HUD
  const liveFractionCount = isInteractive ? interactiveSelection.length : Math.round(filledPct * totalUnits);
  const livePercentage = Math.round((liveFractionCount / totalUnits) * 100);
  const isTargetMet = isInteractive && liveFractionCount === currentConfig?.targetClicks;

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Percentage Calculation Lab" : "Percentage Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA - STACKED LAYOUT */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-2 sm:p-4 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.4] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[200px] sm:min-h-[250px] touch-none">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none text-white z-20">
                {theme === 'chocolate' && <><Grid3X3 size={16} /> Chocolate Bar</>}
                {theme === 'apple' && <><AppleIcon size={16} /> Apples</>}
                {theme === 'survey' && <><Users size={16} /> Class Survey</>}
            </div>
            
            {/* SVG Visualizer Area */}
            <div className="relative bg-[#2a1a16] rounded-3xl border-4 border-[#3e2723] shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] lg:w-[320px] lg:h-[320px] mt-2 z-10 touch-none">
                <svg 
                    viewBox="0 0 300 300" 
                    className="w-full h-full drop-shadow-2xl touch-none"
                    onMouseLeave={() => setIsDragging(false)} 
                    onMouseUp={() => setIsDragging(false)}
                    onTouchEnd={() => setIsDragging(false)}
                    onTouchMove={(e) => {
                        if (!isDragging || !isInteractive || isQuizPassed) return;
                        const touch = e.touches[0];
                        const el = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (el && el.getAttribute('data-index') !== null) {
                            handleVisualClick(Number(el.getAttribute('data-index')), true);
                        }
                    }}
                >
                    {theme === 'chocolate' && <ChocolateTheme />}
                    {theme === 'apple' && <AppleTheme />}
                    {theme === 'survey' && <SurveyTheme />}
                </svg>
            </div>
        </div>

        {/* BOTTOM PANEL - GUIDANCE & QUIZ */}
        <div className="flex-[0.8] lg:flex-[1.0] w-full bg-[#3e2723] p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border-t-4 border-black shadow-2xl relative z-20 flex flex-col gap-3 overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-3 sm:gap-6 h-full relative z-10 min-h-0">
            
            {/* Left Column: Logic Problem & Details */}
            <div className="flex flex-col gap-3 h-full min-h-0">
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-3 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg flex gap-3 items-start text-white shrink-0`}>
                    <div className="bg-sky-400 p-2 sm:p-2.5 rounded-xl text-black shrink-0 shadow-md">
                        <Percent size={20} sm:size={24} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-1.5">
                        <span className="text-sky-400 font-black uppercase text-[9px] sm:text-[11px] tracking-widest leading-none mb-0.5">
                            {appMode === 'concept' ? "Live Simulation" : "Challenge Target"}
                        </span>
                        <p className="text-[12px] sm:text-[14px] lg:text-[15px] font-medium leading-snug tracking-tight text-white/90">
                            {currentConfig?.selectionPrompt || currentConfig?.q}
                        </p>
                    </div>
                </div>

                {/* Concept Info (Only in Concept Mode) */}
                {appMode === 'concept' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3">
                        <div className="flex items-center gap-2 opacity-50 mb-2 border-b border-white/10 pb-2 shrink-0">
                            <BookOpen size={14} className="text-[#a88a6d]" />
                            <span className="text-[#a88a6d] font-black uppercase text-[10px] sm:text-[11px] tracking-wider">Concept Rules</span>
                        </div>
                        <div className="flex flex-col gap-3">
                            {LOGIC_DATA.concept.clues.map((clue) => {
                                const isActive = clue.step === activeStep;
                                const isPassed = clue.step < activeStep;
                                if (!isActive && !isPassed) return null;
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1 sm:gap-1.5 ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                                    <span className="w-fit px-2 py-1 rounded bg-sky-400 text-black font-black text-[9px] uppercase tracking-wider">
                                        {clue.concept}
                                    </span>
                                    <p className="text-white text-[11px] sm:text-[12px] leading-snug pl-2 border-l-2 border-white/20 mt-1">{clue.explanation}</p>
                                  </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Detailed Practice Breakdown (Only in Practice Mode) */}
                {appMode === 'practice' && (
                    <div className="flex-1 flex flex-col bg-[#2a1a16]/95 rounded-2xl border-2 border-black/50 shadow-lg overflow-y-auto custom-scrollbar p-3">
                        {quizFeedbackMode && showExplanation ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full">
                                <h4 className="text-sky-400 font-black uppercase text-[10px] sm:text-[12px] tracking-widest mb-3 flex items-center gap-1.5 border-b border-sky-500/20 pb-2">
                                    <Info size={16}/> Logic Breakdown
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white mb-3">
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><DivideSquare size={12}/> Math Logic</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-sky-500/30 shadow-inner">
                                        <span className="text-sky-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><Calculator size={12}/> Calculation</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px] text-sky-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[9px] uppercase tracking-wider block mb-1 flex items-center gap-1"><FastForward size={12}/> Result</span>
                                        <span className="font-mono font-bold text-[11px] sm:text-[13px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-sky-900/40 border border-sky-500/50 p-3 rounded-xl text-sky-100 text-[10px] sm:text-[12px] font-bold leading-relaxed shadow-inner">
                                    {currentQuizSet[quizStep]?.explanation}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center px-4">
                                <Calculator size={32} className="mb-2" />
                                <p className="text-[11px] font-bold uppercase tracking-widest">Detailed breakdown will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Column: Interaction Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-3 sm:p-5 rounded-2xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden min-h-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2 flex flex-col">
                    <AnimatePresence mode='wait'>
                        
                        {/* CONCEPT MODE INTERACTION */}
                        {appMode === 'concept' && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="flex flex-col gap-3 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
                               <span className="text-sky-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><Compass size={14}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            {/* REAL-TIME MATH HUD (Only for Interactive steps) */}
                            {isInteractive && (
                                <motion.div key="live-eq" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-black/50 p-3 sm:p-4 rounded-2xl border border-white/10 mb-2 w-full flex flex-col items-center shadow-inner shrink-0">
                                    <span className="text-white/40 uppercase tracking-widest text-[9px] font-black mb-1 sm:mb-2">Live Equation</span>
                                    <div className="flex items-center gap-3 sm:gap-6 text-white w-full justify-center">
                                        <div className="flex flex-col items-center">
                                            <span className={`text-2xl sm:text-4xl font-black ${isTargetMet ? 'text-emerald-400' : 'text-sky-400'}`}>{liveFractionCount}</span>
                                            <span className="w-10 sm:w-12 h-1 bg-white/20 my-1 rounded-full"></span>
                                            <span className="text-lg sm:text-2xl font-bold text-white/50">{totalUnits}</span>
                                        </div>
                                        <span className="text-xl sm:text-3xl font-black text-white/30">=</span>
                                        <div className="flex items-center">
                                            <span className={`text-4xl sm:text-6xl font-black drop-shadow-lg ${isTargetMet ? 'text-emerald-400' : 'text-white'}`}>
                                                {livePercentage}<span className="text-2xl sm:text-4xl opacity-70">%</span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Non-Interactive Math Display for MCQs */}
                            {!isInteractive && (
                                 <motion.div key="vis-breakdown" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-black/50 p-3 sm:p-4 rounded-2xl border border-white/10 mb-2 w-full flex flex-col items-center shadow-inner shrink-0">
                                    <span className="text-white/40 uppercase tracking-widest text-[9px] font-black mb-1 sm:mb-2">Visual Breakdown</span>
                                    <div className="flex items-center gap-3 sm:gap-6 text-white w-full justify-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl sm:text-4xl font-black text-sky-400">{liveFractionCount}</span>
                                            <span className="w-10 sm:w-12 h-1 bg-white/20 my-1 rounded-full"></span>
                                            <span className="text-lg sm:text-2xl font-bold text-white/50">{totalUnits}</span>
                                        </div>
                                        <span className="text-xl sm:text-3xl font-black text-white/30">=</span>
                                        <div className="flex items-center">
                                            <span className="text-4xl sm:text-6xl font-black text-white drop-shadow-lg">
                                                {livePercentage}<span className="text-2xl sm:text-4xl opacity-70">%</span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Rendering Interaction Types */}
                            {isInfo ? (
                                <div className="flex flex-col gap-2 mt-auto shrink-0">
                                    {!isQuizPassed && (
                                        <button 
                                            onClick={submitInfo} 
                                            className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0`}
                                        >
                                            {currentConfig.buttonText}
                                        </button>
                                    )}
                                </div>
                            ) : isInteractive ? (
                                <div className="flex flex-col items-center gap-2 mt-auto shrink-0">
                                    <p className="text-white/80 text-[10px] sm:text-xs font-bold text-center mb-1">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                    
                                    <button 
                                        disabled={isQuizPassed}
                                        onClick={submitInteraction} 
                                        className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 shadow-xl ${isQuizPassed ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0'}`}
                                    >
                                        Submit Selection
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2 mt-auto shrink-0">
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
                                                className={`px-4 py-3 sm:py-4 rounded-xl font-black text-[11px] sm:text-[13px] transition-all border-2 ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[11px] sm:text-[13px] font-bold italic text-center animate-pulse mt-2 shrink-0">"{feedback.reason}"</p>}
                            
                            {/* Post-Answer Next Button */}
                            {isQuizPassed && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-2 pt-3 border-t border-white/10 w-full shrink-0">
                                    <div className="flex gap-2 w-full">
                                        <button onClick={prevStep} disabled={activeStep === 0} className={`py-3 px-4 rounded-xl font-black transition-all border-2 ${activeStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                            <ChevronLeft size={16} />
                                        </button>

                                        <button onClick={nextStep} className="flex-1 py-3 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[14px] transition-all bg-emerald-600 text-white border-b-4 border-emerald-800 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                                            {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Start Practice' : 'Next Level'}
                                        </button>
                                    </div>
                                    {actionError && <p className="text-rose-400 text-[11px] font-bold text-center">"{actionError}"</p>}
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* PRACTICE MODE INTERACTION */}
                        {appMode === 'practice' && (
                            <motion.div key={`practice-quiz-${quizStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full gap-3">
                                <div className="flex items-center justify-between border-b border-white/10 pb-2 shrink-0">
                                    <span className="text-sky-400 font-black text-[10px] sm:text-[11px] uppercase tracking-widest flex items-center gap-1.5"><HelpCircle size={14}/> Question {quizStep + 1}/{currentQuizSet.length}</span>
                                </div>

                                {/* REAL-TIME MATH HUD (Only for Interactive steps) */}
                                {isInteractive && (
                                    <motion.div key="live-eq" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-black/50 p-3 sm:p-4 rounded-2xl border border-white/10 mt-1 w-full flex flex-col items-center shadow-inner shrink-0">
                                        <span className="text-white/40 uppercase tracking-widest text-[9px] font-black mb-1 sm:mb-2">Live Equation</span>
                                        <div className="flex items-center gap-3 sm:gap-6 text-white w-full justify-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-2xl sm:text-4xl font-black ${isTargetMet ? 'text-emerald-400' : 'text-sky-400'}`}>{liveFractionCount}</span>
                                                <span className="w-10 sm:w-12 h-1 bg-white/20 my-1 rounded-full"></span>
                                                <span className="text-lg sm:text-2xl font-bold text-white/50">{totalUnits}</span>
                                            </div>
                                            <span className="text-xl sm:text-3xl font-black text-white/30">=</span>
                                            <div className="flex items-center">
                                                <span className={`text-4xl sm:text-6xl font-black drop-shadow-lg ${isTargetMet ? 'text-emerald-400' : 'text-white'}`}>
                                                    {livePercentage}<span className="text-2xl sm:text-4xl opacity-70">%</span>
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {isInteractive ? (
                                    <div className="flex flex-col items-center gap-2 mt-auto shrink-0">
                                        <p className="text-white/80 text-[10px] sm:text-xs font-bold text-center mb-1">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                        
                                        <button 
                                            disabled={quizFeedbackMode && quizSelection === -1}
                                            onClick={submitInteraction} 
                                            className={`w-full py-3.5 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 shadow-xl ${quizFeedbackMode && quizSelection === -1 ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0'}`}
                                        >
                                            Submit Selection
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 mt-auto shrink-0">
                                        {currentConfig?.options?.map((opt, idx) => {
                                            let style = "bg-black/40 border-white/10 text-white hover:bg-black/60";
                                            if (quizFeedbackMode) {
                                                if (idx === currentConfig?.correct) style = "bg-emerald-600 border-emerald-400 text-white shadow-lg scale-105 z-10";
                                                else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                                else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                                            }
                                            return (
                                                <button key={idx} disabled={quizFeedbackMode} onClick={() => handlePracticeSelection(idx)} className={`p-4 py-3 sm:py-4 rounded-xl font-black text-[11px] sm:text-[13px] border-2 transition-all ${style}`}>
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {!isInteractive && quizFeedbackMode && quizSelection !== currentConfig?.correct && quizSelection >= 0 && (
                                   <p className="text-rose-400 text-[11px] sm:text-[13px] font-bold italic text-center animate-pulse mt-1 shrink-0">Incorrect. Try again or view logic.</p>
                                )}
                                {isInteractive && quizFeedbackMode && quizSelection === -2 && (
                                   <p className="text-rose-400 text-[11px] sm:text-[13px] font-bold italic text-center animate-pulse mt-1 shrink-0">{feedback.reason}</p>
                                )}

                                {quizFeedbackMode && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-2 pt-3 border-t border-white/10 w-full shrink-0">
                                        <div className="flex gap-2 w-full">
                                            <button onClick={prevPracticeTask} disabled={quizStep === 0} className={`py-3 px-4 rounded-xl font-black transition-all border-2 ${quizStep === 0 ? 'bg-white/5 text-white/20 border-transparent cursor-not-allowed' : 'bg-black/40 text-[#a88a6d] border-white/10 hover:text-white hover:bg-black/60'}`}>
                                                <ChevronLeft size={16} />
                                            </button>
                                            
                                            {/* Wrong Answer View */}
                                            {((!isInteractive && quizSelection !== currentConfig?.correct) || (isInteractive && quizSelection === -2)) ? (
                                                <>
                                                    <button onClick={tryAgainPractice} className="flex-1 py-3 sm:py-4 bg-rose-600 text-white rounded-xl font-black text-[11px] sm:text-[13px] uppercase border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        Try Again
                                                    </button>
                                                    <button onClick={() => setShowExplanation(!showExplanation)} className="flex-1 py-3 sm:py-4 bg-blue-600 text-white rounded-xl font-black text-[11px] sm:text-[13px] uppercase border-b-4 border-blue-800 active:translate-y-1 active:border-b-0 transition-all">
                                                        {showExplanation ? "Hide Logic" : "View Logic"}
                                                    </button>
                                                </>
                                            ) : (
                                                /* Correct Answer View */
                                                <button onClick={nextPracticeTask} className={`flex-1 py-3 sm:py-4 text-white rounded-xl font-black text-[12px] sm:text-[14px] uppercase border-b-4 border-emerald-800 bg-emerald-600 hover:bg-emerald-500 active:translate-y-1 active:border-b-0 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]`}>
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
                  
                  <div className="bg-sky-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-sky-400 animate-bounce" />
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
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 sm:py-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-[15px] sm:text-[16px] tracking-wider transition-all shadow-lg active:scale-95 border-b-4 border-emerald-900">Start Practice Games</button>
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