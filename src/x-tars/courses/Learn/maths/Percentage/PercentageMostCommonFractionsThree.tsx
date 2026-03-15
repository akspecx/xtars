import React, { useState, useRef } from 'react';
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
  Grid3X3,
  ChevronRight,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DivideSquare,
  FastForward,
  Calculator,
  Percent,
  GripHorizontal
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
    question: "How do we visualize common percentages?",
    teachingSteps: [
      { 
        id: "step-1",
        type: "info",
        theme: 'chocolate',
        totalUnits: 2,
        filledPct: 0.5, 
        selectionPrompt: "Step 1: One Half (1/2). Let's learn the most common fractions! If a chocolate bar has 2 pieces and you take 1, you have One Half. Because percent means 'out of 100', 1/2 is exactly 50%.",
        buttonText: "Got it: 1/2 = 50%",
        why: "1 out of 2 is the exact same ratio as 50 out of 100."
      },
      { 
        id: "step-2",
        type: "info",
        theme: 'chocolate',
        totalUnits: 4,
        filledPct: 0.25, 
        selectionPrompt: "Step 2: One Quarter (1/4). Now the chocolate bar has 4 pieces. Taking 1 piece is One Quarter. 100 divided by 4 is 25, so 1/4 is exactly 25%.",
        buttonText: "Got it: 1/4 = 25%",
        why: "1 out of 4 is the exact same ratio as 25 out of 100."
      },
      { 
        id: "step-3",
        type: "interactive",
        theme: 'chocolate',
        totalUnits: 4,
        targetClicks: 3,
        selectionPrompt: "Step 3: Three Quarters (3/4). Let's test this! If you take 3 pieces out of 4, what percent is that? Tap exactly 3 pieces to claim them!",
        why: "Answer: 3 out of 4 is 3/4. Since 1/4 is 25%, 3/4 equals 75%!"
      },
      { 
        id: "step-4",
        type: "info",
        theme: 'grid',
        totalUnits: 100,
        filledPct: 0.2,
        selectionPrompt: "Step 4: Tenths and Fifths. Meet the 10 × 10 grid! It has exactly 100 squares (1 square = 1%).\n• 1/10 = 10% (One tenth)\n• 1/5 = 20% (One fifth)",
        buttonText: "Got it: 1/5 = 20%",
        why: "Visually seeing 100 squares makes finding percentages out of 100 very clear."
      },
      { 
        id: "step-5",
        type: "interactive",
        theme: 'grid',
        totalUnits: 100,
        targetClicks: 30,
        selectionPrompt: "Step 5: Visual Percentage. Now it's your turn! Color exactly 30 squares to visually show 30%. (Hint: Click and drag your mouse/finger to paint them quickly!)",
        why: "30 squares out of 100 is exactly 30%."
      }
    ],
    clues: [
      { id: 1, step: 0, concept: "Half & Quarters", explanation: "1/2 = 50%. 1/4 = 25%. 3/4 = 75%.", text: "Memorize halves and quarters." },
      { id: 2, step: 1, concept: "Tenths & Fifths", explanation: "1/10 = 10%. 1/5 = 20%.", text: "Memorize tenths and fifths." },
      { id: 3, step: 2, concept: "The 100 Grid", explanation: "A 10x10 grid has exactly 100 squares.", text: "10x10 Grid = 100 Total." },
      { id: 4, step: 3, concept: "1 Square = 1%", explanation: "Because percent means out of 100, coloring 1 square out of 100 is exactly 1%.", text: "1 Square = 1%." },
      { id: 5, step: 4, concept: "Visual Proof", explanation: "Coloring 30 squares proves that 30 out of 100 is 30%.", text: "Visually see out of 100." }
    ]
  },
  practice: {
    question: "Use the Visual Grid and Chocolate Bar to answer these percentage puzzles!",
    quiz: [
      { 
        type: "mcq",
        q: "Look at the 100-square grid. We colored exactly 10 squares. What percentage is colored?", 
        theme: 'grid', totalUnits: 100, filledPct: 0.1,
        options: ["1%", "10%", "100%"], 
        correct: 1, 
        explanation: "10 squares out of 100 is exactly 10%. This is also known as One Tenth (1/10).",
        breakdown: { logic: "10 out of 100", calculation: "Grid shows out of 100 directly", jump: "10%" }
      },
      { 
        type: "interactive",
        q: "This chocolate bar has 4 pieces. Tap exactly 3 pieces to show Three Quarters (3/4)!", 
        theme: 'chocolate', totalUnits: 4, targetClicks: 3,
        explanation: "You selected 3 out of 4 pieces. 3/4 is a common fraction that always equals 75%.",
        breakdown: { logic: "Total = 4 Pieces", calculation: "Your Share = 3 Pieces", jump: "3/4 = 75%" }
      },
      { 
        type: "interactive",
        q: "Let's color the grid! Tap and drag to color exactly 25 squares. This visually shows One Quarter (1/4).", 
        theme: 'grid', totalUnits: 100, targetClicks: 25,
        explanation: "25 colored squares out of 100 represents 25%. 25% is exactly One Quarter.",
        breakdown: { logic: "100 Grid", calculation: "Color 25 squares", jump: "25% = 1/4" }
      },
      { 
        type: "mcq",
        q: "Which common fraction is equal to exactly 20%?", 
        theme: 'grid', totalUnits: 100, filledPct: 0.2,
        options: ["One Half (1/2)", "One Quarter (1/4)", "One Fifth (1/5)"], 
        correct: 2, 
        explanation: "One fifth of 100 is 20 (100 ÷ 5 = 20). So 1/5 is equal to 20%.",
        breakdown: { logic: "20% = 20 out of 100", calculation: "100 ÷ 5 = 20", jump: "One Fifth (1/5)" }
      },
      { 
        type: "interactive",
        q: "Color exactly 50 squares on the 100-grid to visually show One Half (1/2)!", 
        theme: 'grid', totalUnits: 100, targetClicks: 50,
        explanation: "Coloring 50 squares fills exactly half of the grid. 50 out of 100 is 50%.",
        breakdown: { logic: "100 Grid", calculation: "Color 50 squares", jump: "50% = 1/2" }
      }
    ]
  }
};

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
      setFeedback({ type: 'success', msg: "Concept Understood!", reason: currentConfig.why });
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
              theme: currentConfig?.theme || 'grid', 
              totalUnits: currentConfig?.totalUnits || 100, 
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
              theme: currentConfig?.theme || 'grid',
              totalUnits: currentConfig?.totalUnits || 100,
              filledPct: fPct
          };
      }
      return { theme: 'grid', totalUnits: 100, filledPct: 0 };
  }

  const { theme, totalUnits, filledPct } = getVisualState();

  const ChocolateTheme = () => {
      let cols = 2;
      if (totalUnits === 2) cols = 1;
      if (totalUnits === 4) cols = 2;
      if (totalUnits === 10) cols = 2;
      
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
              // Calculate how many total pieces should be filled
              const targetCount = Math.round(filledPct * totalUnits);
              // Map index to fill column-by-column vertically instead of row-by-row horizontally
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
                  className={isInteractive && !isQuizPassed ? "cursor-pointer hover:brightness-110 transition-all" : ""} 
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

  const GridTheme = () => {
      const rows = 10;
      const cols = 10;
      const cellSize = 22;
      const gridW = cols * cellSize;
      const gridH = rows * cellSize;
      const startX = 150 - gridW / 2;
      const startY = 150 - gridH / 2;

      return (
          <g>
              <rect x={startX - 5} y={startY - 5} width={gridW + 10} height={gridH + 10} rx="8" fill="#1a110f" stroke="#3e2723" strokeWidth="4" />
              {Array.from({length: totalUnits}).map((_, i) => {
                  const r = Math.floor(i / cols);
                  const c = i % cols;
                  const x = startX + c * cellSize;
                  const y = startY + r * cellSize;
                  
                  let isSelected = false;
                  if (isInteractive) {
                      isSelected = interactiveSelection.includes(i);
                  } else {
                      isSelected = i < (filledPct * totalUnits);
                  }

                  return (
                      <rect 
                          key={i} 
                          data-index={i}
                          x={x} 
                          y={y} 
                          width={cellSize - 2} 
                          height={cellSize - 2} 
                          rx="3"
                          fill={isSelected ? "#0ea5e9" : "#2a1a16"} 
                          stroke={isSelected ? "#bae6fd" : "#3e2723"} 
                          strokeWidth="1" 
                          onMouseDown={() => { setIsDragging(true); handleVisualClick(i, true); }}
                          onMouseEnter={() => { if (isDragging) handleVisualClick(i, true); }}
                          className={isInteractive && !isQuizPassed ? "cursor-pointer hover:brightness-125" : ""} 
                      />
                  );
              })}
          </g>
      );
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      {/* HEADER */}
      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Visual Percentages Lab" : "Grid Simulator"} appMode={appMode} setAppMode={handleSetMode} onReset={handleReset} />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-3 p-3 sm:p-5 relative z-10 overflow-hidden min-h-0">
        
        {/* TOP PANEL - VISUALIZER */}
        <div className="flex-[1.2] lg:flex-[1.5] w-full bg-[#110c0b] rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-black shadow-2xl relative flex flex-col items-center justify-center overflow-hidden min-h-[250px] touch-none">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
            
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center justify-center gap-2 opacity-50 text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none text-white z-20">
                {appMode === 'practice' ? <><Eye size={16} /> Simulator</> : <><Grid3X3 size={16} /> Visualizer</>}
            </div>
            
            {/* SVG Visualizer Area */}
            <div className="relative bg-[#2a1a16] rounded-3xl border-4 border-[#3e2723] shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px] mt-2 z-10 touch-none">
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
                    {theme === 'grid' && <GridTheme />}
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
                    <div className="bg-sky-400 p-2 sm:p-2.5 rounded-xl text-black shrink-0 shadow-md">
                        <Percent size={24} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <span className="text-sky-400 font-black uppercase text-[10px] sm:text-[11px] tracking-widest leading-none mb-0.5">The Master Objective</span>
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
                                    <span className="w-fit px-2 py-1 rounded bg-sky-400 text-black font-black text-[10px] uppercase tracking-wider">
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
                                <h4 className="text-sky-400 font-black uppercase text-[11px] sm:text-[13px] tracking-widest mb-4 flex items-center gap-2 border-b border-sky-500/20 pb-2">
                                    <Info size={18}/> Logic Breakdown
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-white mb-4">
                                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                        <span className="text-white/50 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><DivideSquare size={14}/> Math Logic</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px]">{currentQuizSet[quizStep].breakdown.logic}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-sky-500/30 shadow-inner">
                                        <span className="text-sky-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><Calculator size={14}/> Calculation</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px] text-sky-400">{currentQuizSet[quizStep].breakdown.calculation}</span>
                                    </div>
                                    <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30 shadow-inner sm:col-span-2">
                                        <span className="text-emerald-300 text-[10px] uppercase tracking-wider block mb-1 flex items-center gap-1"><FastForward size={14}/> Result</span>
                                        <span className="font-mono font-bold text-[12px] sm:text-[14px] text-emerald-400">{currentQuizSet[quizStep].breakdown.jump}</span>
                                    </div>
                                </div>
                                <div className="bg-sky-900/40 border border-sky-500/50 p-4 rounded-xl text-sky-100 text-[12px] sm:text-[14px] font-bold leading-relaxed shadow-inner">
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
                               <span className="text-sky-400 font-black text-[11px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><Compass size={16}/> Step {activeStep + 1} of {LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[13px] sm:text-[15px] leading-snug whitespace-pre-line">{currentConfig?.selectionPrompt}</p>
                            
                            {/* Rendering Interaction Types */}
                            {isInfo ? (
                                <div className="flex flex-col gap-3 py-3 mt-auto">
                                    {!isQuizPassed && (
                                        <button 
                                            onClick={submitInfo} 
                                            className={`px-5 py-3 sm:py-4 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0`}
                                        >
                                            {currentConfig.buttonText}
                                        </button>
                                    )}
                                </div>
                            ) : isInteractive ? (
                                <div className="flex flex-col items-center gap-4 py-4 mt-auto">
                                    <div className="flex items-center gap-2 text-sky-400 mb-2">
                                        <MousePointer2 size={28} className="animate-bounce" />
                                        <span className="text-sm sm:text-base font-black uppercase tracking-widest">Tap Visualizer Elements</span>
                                    </div>
                                    <p className="text-white/80 text-xs sm:text-sm font-bold text-center">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                    
                                    <button 
                                        disabled={isQuizPassed}
                                        onClick={submitInteraction} 
                                        className={`w-full py-3.5 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 mt-2 ${isQuizPassed ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0'}`}
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
                                    <span className="text-sky-400 font-black text-[11px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><HelpCircle size={14}/> Question {quizStep + 1}/{currentQuizSet.length}</span>
                                </div>
                                <p className="text-white text-[15px] sm:text-[18px] font-bold leading-snug">{currentConfig?.q}</p>
                                
                                {isInteractive ? (
                                    <div className="flex flex-col items-center gap-4 py-4 mt-auto">
                                        {!quizFeedbackMode && (
                                           <div className="flex items-center gap-2 text-sky-400 mb-2">
                                               <MousePointer2 size={28} className="animate-bounce" />
                                               <span className="text-sm sm:text-base font-black uppercase tracking-widest">Tap the Visualizer</span>
                                           </div>
                                        )}
                                        <p className="text-white/80 text-xs sm:text-sm font-bold text-center">Selected: {interactiveSelection.length} / {currentConfig?.targetClicks}</p>
                                        
                                        <button 
                                            disabled={quizFeedbackMode && quizSelection === -1}
                                            onClick={submitInteraction} 
                                            className={`w-full py-3.5 rounded-xl font-black text-[13px] sm:text-[15px] transition-all border-b-4 mt-2 ${(quizFeedbackMode && quizSelection === -1) ? 'bg-emerald-600 text-white border-emerald-800 opacity-50 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-black border-sky-700 active:translate-y-1 active:border-b-0'}`}
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
                  
                  <div className="bg-sky-500/20 p-6 rounded-full relative z-10">
                      <Trophy size={80} className="text-sky-400 animate-bounce" />
                  </div>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                      <h2 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-lg">
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-[#e6dccb] text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully learned how fractions map to percentages using the 100-Grid!" 
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