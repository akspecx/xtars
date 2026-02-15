import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Trophy,
  Scale,
  Target,
  X,
  ArrowRight,
  ArrowLeft,
  Play,
  HelpCircle,
  BookOpen,
  Layers,
  ChevronRight,
  Home,
  FastForward
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// CONFIGURATIONS
// ==========================================
const UI_CONFIG = {
  headerTitleSize: '16px',
  normalTextSize: '14px',
  woodPrimary: '#2a1a16',
  woodSecondary: '#3e2723',
  woodAccent: '#a88a6d',
};

const FRUITS = [
  { id: 'apple', name: 'Apple', icon: '🍎', weight: 150, weightLabel: '150g', color: 'from-green-400 to-green-600' },
  { id: 'orange', name: 'Orange', icon: '🍊', weight: 200, weightLabel: '200g', color: 'from-orange-400 to-orange-600' },
  { id: 'grapes', name: 'Grapes', icon: '🍇', weight: 500, weightLabel: '500g', color: 'from-purple-400 to-purple-600' },
  { id: 'watermelon', name: 'Watermelon', icon: '🍉', weight: 5000, weightLabel: '5kg', color: 'from-emerald-500 to-green-800' }
];

const LOGIC_DATA = {
  concept: {
    ascending: {
      targetOrder: ['apple', 'orange', 'watermelon'],
      steps: [
        { slot: 0, text: "Place the LIGHTEST fruit (Apple 150g) first.", targetId: 'apple' },
        { slot: 1, text: "Place the MEDIUM weight fruit (Orange 200g) in the middle.", targetId: 'orange' },
        { slot: 2, text: "Place the HEAVIEST fruit (Watermelon 5kg) last.", targetId: 'watermelon' }
      ]
    },
    descending: {
      targetOrder: ['watermelon', 'orange', 'apple'],
      steps: [
        { slot: 0, text: "Place the HEAVIEST fruit (Watermelon 5kg) first.", targetId: 'watermelon' },
        { slot: 1, text: "Place the MEDIUM weight fruit (Orange 200g) in the middle.", targetId: 'orange' },
        { slot: 2, text: "Place the LIGHTEST fruit (Apple 150g) last.", targetId: 'apple' }
      ]
    }
  },
  practice: [
    {
      id: 'scen1',
      title: "Arrangement 1",
      mission: "Arrange Apple, Orange, and Watermelon in ASCENDING order.",
      clues: ["Orange is heavier than Apple", "Watermelon is the heaviest of all"],
      fruits: ['apple', 'orange', 'watermelon'],
      targetOrder: ['apple', 'orange', 'watermelon'],
      explanation: "Ascending means Smallest to Largest. Since 150g < 200g < 5000g, the order is Apple, Orange, Watermelon.",
      quiz: [
        { q: "Which fruit is exactly 50g heavier than the Apple?", options: ["Orange", "Watermelon", "None"], correct: 0 },
        { q: "Which fruit represents the highest weight value?", options: ["Apple", "Orange", "Watermelon"], correct: 2 }
      ]
    },
    {
      id: 'scen2',
      title: "Arrangement 2",
      mission: "Arrange all 4 fruits in DESCENDING order (Heavy to Light).",
      clues: ["Grapes (500g) are lighter than Watermelon", "Orange is lighter than Grapes", "Apple is lighter than Grapes"],
      fruits: ['apple', 'orange', 'watermelon', 'grapes'],
      targetOrder: ['watermelon', 'grapes', 'orange', 'apple'],
      explanation: "Descending means Largest to Smallest: Watermelon (5kg) > Grapes (500g) > Orange (200g) > Apple (150g).",
      quiz: [
        { q: "Which fruit is in the 2nd position from the left?", options: ["Watermelon", "Grapes", "Orange"], correct: 1 },
        { q: "How many fruits are heavier than the Orange in this set?", options: ["1", "2", "3"], correct: 1 }
      ]
    }
  ]
};

const HeaderSection = ({ onBack, title, appMode, setAppMode, onReset }) => (
  <header className="w-full shrink-0 p-2 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/90 backdrop-blur-sm">
      <div className="w-full max-w-5xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex flex-col md:flex-row justify-between items-center text-white gap-3">
        <div className="flex flex-col items-start gap-0.5 w-full md:w-auto">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
              <ChevronLeft size={14} /> Dashboard
          </button>
          <span className="text-white font-black uppercase tracking-tight leading-none" style={{ fontSize: UI_CONFIG.headerTitleSize }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-4 border-rose-900 text-white transition-all active:translate-y-1"><RotateCcw size={16} /></button>
        </div>
      </div>
  </header>
);

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptSubMode, setConceptSubMode] = useState('ascending');
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [unlockedIdx, setUnlockedIdx] = useState(0);
  
  const [placedFruits, setPlacedFruits] = useState([null, null, null]);
  const [activeStep, setActiveStep] = useState(0);
  const [feedback, setFeedback] = useState({ type: null, msg: "" });
  const [isSolved, setIsSolved] = useState(false);
  const [practiceStatus, setPracticeStatus] = useState('idle'); // idle, correct, wrong
  const [showExplanation, setShowExplanation] = useState(false);

  // Quiz State
  const [quizStep, setQuizStep] = useState(-1); 
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);

  const containerRef = useRef(null);
  const slotRefs = useRef([]);

  const handleReset = () => {
    const fruitCount = appMode === 'practice' ? LOGIC_DATA.practice[practiceIdx].fruits.length : 3;
    setPlacedFruits(new Array(fruitCount).fill(null));
    setActiveStep(0);
    setFeedback({ type: null, msg: "" });
    setIsSolved(false);
    setPracticeStatus('idle');
    setShowExplanation(false);
    setQuizStep(-1);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
  };

  const handleSetMode = (mode) => {
    setAppMode(mode);
    setConceptSubMode('ascending');
    setPracticeIdx(0);
    setUnlockedIdx(0);
    handleReset();
  };

  const handleDragEnd = (event, info, fruitId, sourceIndex) => {
    if (isSolved || practiceStatus === 'correct' || quizStep >= 0) return;

    const dragX = info.point.x;
    const dragY = info.point.y;
    let targetIdx = -1;
    let minDistance = 1000;

    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dragX - centerX, 2) + Math.pow(dragY - centerY, 2));
      if (dist < 60 && dist < minDistance) { minDistance = dist; targetIdx = index; }
    });

    if (targetIdx !== -1) {
      if (sourceIndex === targetIdx) return;

      if (appMode === 'concept') {
        const subData = LOGIC_DATA.concept[conceptSubMode];
        const step = subData.steps[activeStep];
        
        setPlacedFruits(prev => {
          const n = [...prev];
          if (sourceIndex !== null) n[sourceIndex] = null;
          const existingIdx = n.indexOf(fruitId);
          if (existingIdx !== -1) n[existingIdx] = null;
          n[targetIdx] = fruitId;
          return n;
        });

        if (targetIdx === step.slot && fruitId === step.targetId) {
          setFeedback({ type: 'success', msg: "Correct placement!" });
          if (activeStep < 2) {
            setActiveStep(s => s + 1);
            setTimeout(() => setFeedback({ type: null, msg: "" }), 1000);
          } else {
            setIsSolved(true);
            setFeedback({ type: 'success', msg: `${conceptSubMode.toUpperCase()} Order Completed!` });
          }
        } else {
          setFeedback({ type: 'error', msg: `Incorrect. The ${fruitId} is not correctly placed for ${conceptSubMode} order.` });
          setTimeout(() => {
            setPlacedFruits(prev => {
              const n = [...prev];
              n[targetIdx] = null;
              return n;
            });
            setFeedback({ type: null, msg: "" });
          }, 1500);
        }
      } else {
        setPlacedFruits(prev => {
          const n = [...prev];
          if (sourceIndex !== null) {
            const existing = n[targetIdx];
            n[sourceIndex] = existing;
            n[targetIdx] = fruitId;
          } else {
            const existingIdx = n.indexOf(fruitId);
            if (existingIdx !== -1) n[existingIdx] = null;
            n[targetIdx] = fruitId;
          }
          return n;
        });
        setPracticeStatus('idle');
      }
    } else if (sourceIndex !== null) {
      setPlacedFruits(prev => { const n = [...prev]; n[sourceIndex] = null; return n; });
      if (appMode === 'concept') setActiveStep(prev => Math.min(prev, sourceIndex));
    }
  };

  const validatePractice = () => {
    const currentOrder = placedFruits.join(',');
    const targetOrder = LOGIC_DATA.practice[practiceIdx].targetOrder.join(',');
    if (currentOrder === targetOrder) {
      setPracticeStatus('correct');
      setFeedback({ type: 'success', msg: "Excellent! Your arrangement is correct." });
    } else {
      setPracticeStatus('wrong');
      setFeedback({ type: 'error', msg: "Incorrect arrangement. Please try again or view the explanation." });
    }
  };

  const handleQuizOption = (idx) => {
    if (quizFeedbackMode) return;
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  };

  const currentScen = LOGIC_DATA.practice[practiceIdx];
  const conceptScen = LOGIC_DATA.concept[conceptSubMode];
  const allPlaced = placedFruits.every(f => f !== null);

  const handleArrangementNav = (direction) => {
    const newIdx = practiceIdx + direction;
    if (newIdx >= 0 && newIdx < LOGIC_DATA.practice.length) {
      if (direction === 1 && newIdx > unlockedIdx) return;
      setPracticeIdx(newIdx);
    }
  };

  // Automated Next Arrangement Logic
  const proceedToNextArrangement = () => {
    const nextIdx = practiceIdx + 1;
    if (nextIdx < LOGIC_DATA.practice.length) {
      setUnlockedIdx(prev => Math.max(prev, nextIdx));
      setPracticeIdx(nextIdx);
    } else {
      setUnlockedIdx(LOGIC_DATA.practice.length); // Trigger final overlay
    }
    setQuizFeedbackMode(false);
    setQuizStep(-1);
  };

  useEffect(() => {
    handleReset();
  }, [practiceIdx, appMode]);

  const handleQuizStepNav = (direction) => {
    const newStep = quizStep + direction;
    if (newStep >= 0 && newStep < currentScen.quiz.length) {
      setQuizStep(newStep);
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setFeedback({ type: null, msg: "" });
    }
  };

  const isQuizCorrect = quizSelection === currentScen.quiz[quizStep]?.correct;

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col font-sans select-none overflow-x-hidden" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.3] pointer-events-none fixed" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <HeaderSection 
        onBack={() => navigate(-1)}
        title={appMode === 'concept' ? "Logic Discovery" : "Practice Laboratory"}
        appMode={appMode}
        setAppMode={handleSetMode}
        onReset={handleReset}
      />

      <main className="flex-1 flex flex-col items-center gap-4 sm:gap-6 p-2 sm:p-4 w-full max-w-5xl mx-auto relative z-10 overflow-visible">
        
        {/* DIV 1: INTERACTIVE BOARD */}
        <div className="w-full max-w-4xl bg-[#2a1a16] p-3 sm:p-6 rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-4 border-black/40 relative z-10 flex flex-col gap-4 sm:gap-8">
          
          <div className="relative bg-[#3e2723] py-6 sm:py-10 px-2 sm:px-4 rounded-[1.5rem] sm:rounded-[2.5rem] border-4 border-black/20 flex flex-col items-center justify-center shadow-inner min-h-[180px] sm:min-h-[220px]">
            <div className="absolute top-1/2 left-6 sm:left-10 right-6 sm:right-10 h-1 sm:h-2 bg-black/30 -translate-y-1/2 rounded-full z-0" />
            <div className="w-full flex justify-around items-center relative z-10 gap-1 sm:gap-4">
              {placedFruits.map((fruitId, i) => {
                const fruitData = fruitId ? FRUITS.find(f => f.id === fruitId) : null;
                const isTargetSlot = appMode === 'concept' && i === activeStep;

                return (
                  <div key={i} className="flex flex-col items-center gap-2 sm:gap-3">
                    <div 
                      ref={el => slotRefs.current[i] = el}
                      className={`w-14 h-14 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 flex items-center justify-center relative transition-all duration-300
                        ${fruitData 
                          ? `bg-white border-white shadow-2xl scale-110 ${practiceStatus === 'wrong' ? 'ring-4 sm:ring-8 ring-rose-500 border-rose-500' : practiceStatus === 'correct' ? 'ring-4 sm:ring-8 ring-green-500 border-green-500' : ''}` 
                          : `border-dashed ${isTargetSlot ? 'border-yellow-400 bg-black/40 shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'border-white/20 bg-black/20'}`
                        }
                      `}
                    >
                      {fruitData ? (
                        <motion.div 
                          layoutId={`fruit-${fruitData.id}`}
                          drag={!isSolved && practiceStatus !== 'correct' && quizStep === -1}
                          dragConstraints={containerRef}
                          dragMomentum={false}
                          dragElastic={0}
                          onDragEnd={(e, info) => handleDragEnd(e, info, fruitData.id, i)}
                          className={`w-full h-full rounded-full bg-gradient-to-br ${fruitData.color} flex flex-col items-center justify-center shadow-inner relative group cursor-pointer`}
                        >
                          <span className="text-2xl sm:text-5xl drop-shadow-md pointer-events-none">{fruitData.icon}</span>
                          <span className="text-[6px] sm:text-[9px] font-black text-white/90 uppercase mt-0.5 pointer-events-none">{fruitData.weightLabel}</span>
                          {practiceStatus === 'idle' && !isSolved && (
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={(e) => { e.stopPropagation(); setPlacedFruits(p => { const n=[...p]; n[i]=null; return n; }); }}>
                                <X size={20} className="text-white sm:w-8 sm:h-8"/>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <span className={`font-black text-base sm:text-xl ${isTargetSlot ? 'text-yellow-400 animate-pulse' : 'text-white/20'}`}>{i + 1}</span>
                      )}
                    </div>
                    <span className="bg-[#2a1a16] px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-full text-white text-[6px] sm:text-[9px] font-black uppercase border border-white/10 shadow-lg tracking-wider">
                      Slot {i + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full h-0.5 sm:h-1 bg-black/30 rounded-full" />

          {/* STORAGE AREA */}
          <div className="flex flex-col gap-2 sm:gap-4 relative z-20">
            <div className="w-full flex justify-center">
               <span className="text-[#a88a6d] font-black uppercase tracking-[0.2em] text-[8px] sm:text-[10px] bg-black/30 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full border border-white/5 flex items-center gap-1 sm:gap-2">
                 <Scale size={12} /> Fruit Storage
               </span>
            </div>
            <div className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-10 w-full max-w-2xl mx-auto px-2 sm:px-4 overflow-visible">
              {(appMode === 'concept' ? FRUITS.filter(f => f.id !== 'grapes') : FRUITS.filter(f => currentScen.fruits.includes(f.id))).map((fruit) => {
                const isPlaced = placedFruits.includes(fruit.id);
                return (
                  <div key={`anchor-${fruit.id}`} className="relative w-12 h-12 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center border-2 border-white/5 rounded-full bg-black/5 shadow-inner">
                    {!isPlaced ? (
                        <motion.div
                            layoutId={`fruit-${fruit.id}`}
                            drag={!isSolved && practiceStatus !== 'correct' && quizStep === -1}
                            dragConstraints={containerRef}
                            dragMomentum={false}
                            dragElastic={0}
                            onDragEnd={(e, info) => handleDragEnd(e, info, fruit.id, null)}
                            whileHover={{ scale: 1.1, zIndex: 100, cursor: 'grab' }}
                            whileDrag={{ scale: 1.2, zIndex: 200, cursor: 'grabbing' }}
                            className={`w-full h-full rounded-full flex flex-col items-center justify-center gap-0.5 border-2 sm:border-4 border-black/10 bg-gradient-to-br ${fruit.color} shadow-xl border-white/20 z-10`}
                        >
                            <span className="text-xl sm:text-4xl drop-shadow-md pointer-events-none">{fruit.icon}</span>
                            <div className="flex flex-col items-center leading-none pointer-events-none">
                                <span className="text-[6px] sm:text-[9px] font-black text-white/90 uppercase tracking-tighter">{fruit.name}</span>
                                <span className="text-[5px] sm:text-[8px] font-bold text-white/60">{fruit.weightLabel}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="w-full h-full rounded-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 bg-[#3e2723]/30 opacity-20 grayscale pointer-events-none">
                            <span className="text-xl sm:text-3xl opacity-30">{fruit.icon}</span>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DIV 2: CONTROL PANEL */}
        <div className="w-full max-w-4xl bg-[#2a1a16] p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-b-8 border-black shadow-2xl relative z-0 flex flex-col gap-4 sm:gap-6 min-h-[300px]">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {quizStep === -1 && (
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1 rounded-full ${feedback.type === 'error' ? 'bg-rose-500' : 'bg-[#a88a6d]'} text-white`}>
                    {feedback.type === 'error' ? <AlertCircle size={12} /> : <Lightbulb size={12} />}
                  </div>
                  <span className="text-[#a88a6d] font-black uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">
                    {appMode === 'concept' ? 'Guided Instruction' : 'Logical Clues'}
                  </span>
                </div>
                
                <div className={`bg-black/30 p-3 sm:p-5 rounded-2xl border min-h-[60px] sm:min-h-[80px] transition-all flex items-center ${feedback.type === 'error' ? 'border-rose-500 bg-rose-500/10' : 'border-white/10'}`}>
                  {appMode === 'concept' ? (
                    <p className="text-white text-xs sm:text-sm font-bold italic leading-relaxed">
                      {feedback.msg || conceptScen.steps[activeStep].text}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-1 sm:gap-1.5 w-full">
                        {currentScen.clues.map((clue, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-yellow-400 shrink-0" />
                            <p className="text-white text-[10px] sm:text-xs font-bold">{clue}</p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className={`flex flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto items-center md:items-end ${quizStep !== -1 ? 'w-full md:w-full' : ''}`}>
               {appMode === 'concept' ? (
                 <div className="flex flex-row bg-black/20 p-1 rounded-xl border border-white/5 w-full md:w-auto">
                    <button onClick={() => { setConceptSubMode('ascending'); handleReset(); }} className={`flex-1 md:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-black text-[8px] sm:text-[10px] uppercase transition-all ${conceptSubMode === 'ascending' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Ascending</button>
                    <button onClick={() => { setConceptSubMode('descending'); handleReset(); }} className={`flex-1 md:flex-none px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-black text-[8px] sm:text-[10px] uppercase transition-all ${conceptSubMode === 'descending' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>Descending</button>
                 </div>
               ) : (
                 <div className={`flex items-center gap-2 sm:gap-3 bg-black/40 p-1.5 sm:p-2 rounded-xl border border-white/10 px-3 sm:px-4 ${quizStep !== -1 ? 'w-full' : 'w-full md:w-auto'} justify-between`}>
                    <button onClick={() => handleArrangementNav(-1)} disabled={practiceIdx === 0} className={`p-1 rounded-md transition-colors ${practiceIdx === 0 ? 'text-white/10 cursor-not-allowed' : 'text-yellow-400 hover:bg-yellow-400/10'}`}><ArrowLeft size={16}/></button>
                    <div className="flex flex-col items-center leading-none">
                      <span className="text-white font-black text-[8px] sm:text-[10px] uppercase tracking-widest whitespace-nowrap">{currentScen.title}</span>
                      <span className="text-[#a88a6d] font-bold text-[7px] sm:text-[8px] uppercase">Laboratory</span>
                    </div>
                    <button onClick={() => handleArrangementNav(1)} disabled={practiceIdx === LOGIC_DATA.practice.length - 1 || (practiceIdx >= unlockedIdx)} className={`p-1 rounded-md transition-colors ${(practiceIdx === LOGIC_DATA.practice.length - 1 || practiceIdx >= unlockedIdx) ? 'text-white/10 cursor-not-allowed' : 'text-yellow-400 hover:bg-yellow-400/10'}`}><ArrowRight size={16}/></button>
                 </div>
               )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 sm:gap-3 flex-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2">
                <Target size={14} className="text-green-400" />
                <span className="text-[#a88a6d] font-black uppercase tracking-[0.2em] text-[8px] sm:text-[10px]">Mission Control</span>
              </div>
              {(feedback.msg && feedback.type === 'success') || practiceStatus === 'correct' ? <CheckCircle2 size={14} className="text-green-400 animate-pulse" /> : null}
            </div>
            
            <div className="bg-[#3e2723] p-4 sm:p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-4 sm:gap-5 shadow-inner flex-1 min-h-[160px]">
              
              <AnimatePresence mode='wait'>
                {quizStep >= 0 ? (
                  <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="w-full flex flex-col gap-4">
                    
                    {!quizFeedbackMode ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1 sm:px-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button onClick={() => handleQuizStepNav(-1)} disabled={quizStep === 0} className={`p-1 ${quizStep === 0 ? 'opacity-20 cursor-not-allowed' : 'text-yellow-400'}`}><ArrowLeft size={14}/></button>
                            <div className="text-yellow-400 font-black text-[7px] sm:text-[9px] uppercase tracking-widest">Logic Quiz: Q{quizStep + 1}</div>
                            <button onClick={() => handleQuizStepNav(1)} disabled={quizStep === currentScen.quiz.length - 1} className={`p-1 ${quizStep === currentScen.quiz.length - 1 ? 'opacity-20 cursor-not-allowed' : 'text-yellow-400'}`}><ArrowRight size={14}/></button>
                          </div>
                          <button onClick={() => setShowExplanation(true)} className="flex items-center gap-1 text-white/40 hover:text-white transition-colors text-[7px] sm:text-[9px] font-bold uppercase"><BookOpen size={10} /> Explanation</button>
                        </div>
                        <p className="text-white text-center font-bold text-sm sm:text-lg px-2">{currentScen.quiz[quizStep].q}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
                          {currentScen.quiz[quizStep].options.map((opt, idx) => (
                            <button key={idx} onClick={() => handleQuizOption(idx)}
                              className="p-2 sm:p-3 rounded-xl font-black text-[8px] sm:text-[10px] uppercase border-b-4 bg-black/40 text-white border-black hover:bg-black/60 transition-all"
                            >{opt}</button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-2">
                         <div className={`p-2 rounded-full ${isQuizCorrect ? 'bg-green-500' : 'bg-rose-500'} text-white`}>
                           {isQuizCorrect ? <CheckCircle2 size={24}/> : <AlertCircle size={24}/>}
                         </div>
                         <h3 className={`text-lg font-black uppercase ${isQuizCorrect ? 'text-green-400' : 'text-rose-400'}`}>
                           {isQuizCorrect ? 'Correct Logic!' : 'Incorrect Logic'}
                         </h3>
                         
                         <div className="flex gap-3">
                           {!isQuizCorrect ? (
                             <>
                               <button onClick={() => setQuizFeedbackMode(false)} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><RotateCcw size={14}/> Re-try</button>
                               <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><BookOpen size={14}/> View Logic</button>
                             </>
                           ) : (
                             <>
                               <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1"><BookOpen size={14}/> Explanation</button>
                               {quizStep < currentScen.quiz.length - 1 ? (
                                 <button onClick={() => handleQuizStepNav(1)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1">Next Question <ChevronRight size={14}/></button>
                               ) : (
                                 <button onClick={proceedToNextArrangement} className="bg-yellow-500 text-black px-6 py-2 rounded-full font-black uppercase text-[10px] flex items-center gap-1">
                                   {practiceIdx < LOGIC_DATA.practice.length - 1 ? 'Next Arrangement' : 'Finish Laboratory'} <Trophy size={14}/>
                                 </button>
                               )}
                             </>
                           )}
                         </div>
                      </div>
                    )}
                  </motion.div>
                ) : showExplanation ? (
                  <motion.div key="explanation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3">
                    <div className="text-blue-400 font-black text-[9px] uppercase tracking-widest">Logical Breakdown</div>
                    <p className="text-white text-xs sm:text-sm font-medium italic text-center px-4 leading-relaxed">{currentScen.explanation}</p>
                    <button onClick={() => setShowExplanation(false)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase transition-colors">Close</button>
                  </motion.div>
                ) : (
                  <motion.div key="mission" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 w-full">
                    <p className="text-white text-sm sm:text-lg font-black text-center italic leading-tight px-4">
                      {appMode === 'concept' ? `"Arrange fruits in ${conceptSubMode.toUpperCase()} Order"` : `"${currentScen.mission}"`}
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                      {appMode === 'concept' && isSolved && (
                        <button onClick={() => conceptSubMode === 'ascending' ? (setConceptSubMode('descending'), handleReset()) : handleSetMode('practice')}
                          className="bg-green-500 hover:bg-green-400 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl active:translate-y-1 transition-all text-[10px] sm:text-xs"
                        >
                          {conceptSubMode === 'ascending' ? "Learn Descending" : "Enter Practice Mode"}
                          <ArrowRight size={16} />
                        </button>
                      )}

                      {appMode === 'practice' && practiceStatus === 'idle' && allPlaced && (
                        <button onClick={validatePractice} className="bg-orange-500 hover:bg-orange-400 text-white px-8 sm:px-10 py-2 sm:py-3 rounded-full font-black uppercase flex items-center gap-2 shadow-xl active:translate-y-1 transition-all text-[10px] sm:text-xs">
                          <Play size={16} fill="currentColor" /> Validate Solution
                        </button>
                      )}

                      {practiceStatus === 'wrong' && (
                        <>
                          <button onClick={() => setPracticeStatus('idle')} className="bg-rose-600 hover:bg-rose-500 text-white px-4 sm:px-6 py-2 rounded-full font-black uppercase flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs active:translate-y-1 transition-all">
                            <RotateCcw size={14} /> Try Again
                          </button>
                          <button onClick={() => setShowExplanation(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-full font-black uppercase flex items-center gap-1 sm:gap-2 text-[8px] sm:text-xs active:translate-y-1 transition-all">
                            <BookOpen size={14} /> Explanation
                          </button>
                        </>
                      )}

                      {practiceStatus === 'correct' && (
                        <button onClick={() => setQuizStep(0)} className="bg-yellow-500 hover:bg-yellow-400 text-[#2a1a16] px-6 sm:px-8 py-2 rounded-full font-black uppercase flex items-center gap-2 shadow-lg active:translate-y-1 transition-all text-[10px] sm:text-xs">
                           <HelpCircle size={16} /> Start Logic Quiz
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* FINAL MASTERY OVERLAY */}
        <AnimatePresence>
          {unlockedIdx >= LOGIC_DATA.practice.length && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4">
                <div className="bg-[#2a1a16] p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] border-4 sm:border-8 border-yellow-400 text-center flex flex-col items-center gap-3 sm:gap-6 max-w-sm relative">
                  <Trophy size={100} className="text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)]" />
                  <h2 className="text-white text-3xl sm:text-5xl font-black uppercase italic leading-none tracking-tighter">Lab Master!</h2>
                  <p className="text-white/60 text-sm sm:text-base font-bold italic px-2">You solved every weight analysis scenario and mastered the logic.</p>
                  
                  <div className="flex flex-col w-full gap-3 mt-4">
                    <button onClick={() => window.location.reload()} className="bg-yellow-400 text-black py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl">
                      <Home size={20}/> Back to Dashboard
                    </button>
                    <button className="bg-green-600 text-white py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                      <FastForward size={20}/> Next Module
                    </button>
                  </div>
                </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <LabContent />
//     </Router>
//   );
// }