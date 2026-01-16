import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Trophy, Sparkles, 
  ChevronLeft, Shuffle, FastForward, Timer, 
  ChevronRight, Hand, PlayCircle, Info, X,
  Weight, ClipboardList, Calculator, Scale, Equal,
  BookOpen, Target, PenTool, CheckCircle2, Variable, Binary, Hash, HelpCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. ASSETS & MISSIONS CONFIGURATION
// ==========================================
const MISSIONS = [
  {
    id: 1,
    lhsItems: [{ icon: '🍎', name: 'apple', count: 3, unitWeight: 5 }],
    rhsTotal: 15,
    variableName: 'x',
    question: 'If weight of one apple = x, what is the equation?',
    options: ['3x = 15', 'x + 3 = 15', '3 + x = 15'],
    correctIndex: 0
  },
  {
    id: 2,
    lhsItems: [
        { icon: '🍊', name: 'orange', count: 2, unitWeight: 10 },
        { icon: '🧱', name: 'block', count: 1, unitWeight: 10 }
    ],
    rhsTotal: 30,
    variableName: 'y',
    question: 'If weight of one orange = y, identify the correct math sentence:',
    options: ['2y = 30', '2y + 10 = 30', 'y + 2 + 10 = 30'],
    correctIndex: 1
  },
  {
    id: 3,
    lhsItems: [{ icon: '🍐', name: 'pear', count: 4, unitWeight: 5 }],
    rhsTotal: 20,
    variableName: 'p',
    question: 'Using "p" for pear, which one is correct?',
    options: ['4p = 20', 'p + 4 = 20', '4 + p = 20'],
    correctIndex: 0
  },
  {
    id: 4,
    lhsItems: [
        { icon: '🍎', name: 'apple', count: 1, unitWeight: 10 },
        { icon: '🧱', name: 'block', count: 1, unitWeight: 5 }
    ],
    rhsTotal: 15,
    variableName: 'x',
    question: 'One apple (x) and a 5g block balance 15g. The equation is:',
    options: ['x = 15', '5x = 15', 'x + 5 = 15'],
    correctIndex: 2
  },
  {
    id: 5,
    lhsItems: [
        { icon: '🍓', name: 'berry', count: 5, unitWeight: 2 },
        { icon: '🧱', name: 'block', count: 1, unitWeight: 10 }
    ],
    rhsTotal: 20,
    variableName: 'z',
    question: 'Using "z" for berry, translate this scale:',
    options: ['5z + 10 = 20', '10z + 5 = 20', 'z + 5 = 20'],
    correctIndex: 0
  }
];

const TEACHING_STEPS = [
  {
    id: 'mystery',
    label: 'The Mystery',
    title: 'Visible World',
    definition: 'Look at the scale. We see 2 apples and a block balancing 5 blocks. Do we know how heavy one apple is?',
    visual: '❌ No, we don\'t know the weight yet!',
    icon: <HelpCircle size={20} />,
    example: { lhs: [{ icon: '🍎', name: 'apple', count: 2 }, { icon: '🧱', name: 'block', count: 1, unitWeight: 1 }], rhs: 5 }
  },
  {
    id: 'naming',
    label: 'The Name',
    title: 'Give it a Name',
    definition: 'When we don’t know the value of something, we give it a name. Let\'s say: Weight of one apple = x',
    visual: 'x is just a name for the unknown weight.',
    icon: <PenTool size={20} />,
    example: { lhs: [{ icon: '🍎', name: 'apple', count: 2 }], rhs: 10 }
  },
  {
    id: 'language',
    label: 'Math Language',
    title: 'Building the Sentence',
    definition: '2 apples become 2x. The block is +1. So the sentence is: 2x + 1 = 5',
    visual: 'This is written in "Math Language".',
    icon: <Binary size={20} />,
    example: { lhs: [{ icon: '🍎', name: 'apple', count: 2 }, { icon: '🧱', name: 'block', count: 1, unitWeight: 1 }], rhs: 5 }
  },
  {
    id: 'ideal',
    label: 'Ideal World',
    title: 'The Math World',
    definition: 'In the math world, we don’t draw apples. We use variables like x and y because their weights can change.',
    visual: '🍎 → x  |  🍊 → y',
    icon: <Variable size={20} />,
    example: { lhs: [{ icon: '🍎', name: 'apple', count: 1 }, { icon: '🍊', name: 'orange', count: 1 }], rhs: 20 }
  },
  {
    id: 'habit',
    label: 'Why X?',
    title: 'The Math Habit',
    definition: 'We usually use X because it\'s easy to write. Remember: X does NOT mean multiply here. X means "I don\'t know this yet".',
    visual: 'X = Unknown Value',
    icon: <CheckCircle2 size={20} />,
    example: { lhs: [{ icon: '🍎', name: 'apple', count: 4 }], rhs: 40 }
  }
];

// Unified Weight Block
const WeightBlock = ({ weight, size = "large" }) => (
  <motion.div 
    initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }}
    className={`bg-slate-700 text-white rounded-xl flex items-center justify-center font-black shadow-2xl border-b-4 border-black/40 ring-2 ring-slate-800/30 shrink-0 z-10 mx-1
      ${size === "large" ? "w-12 h-12 sm:w-16 sm:h-16 text-xs sm:text-lg" : "w-8 h-8 sm:w-12 sm:h-12 text-[8px] sm:text-xs"}`}
  >
    <div className="flex flex-col items-center">
        <Weight size={size === "large" ? 14 : 10} className="mb-0.5 opacity-50" />
        {weight ? `${weight}g` : ""}
    </div>
  </motion.div>
);

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export default function AlgebraVariableIntro() {
  const navigate = useNavigate();

  // --- UI State ---
  const [appMode, setAppMode] = useState('teach'); 
  const [teachIndex, setTeachIndex] = useState(0);
  
  // --- Practice State ---
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const mission = appMode === 'practice' ? MISSIONS[levelIndex] : null;
  const currentTeach = appMode === 'teach' ? TEACHING_STEPS[teachIndex] : null;

  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);

  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationLines, setExplanationLines] = useState([]);

  const timerIntervalRef = useRef(null);

  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correctIndex) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
        setSelectedOption(null);
      }, 800);
    }
  };

  const handleNextMission = useCallback(() => {
    if (levelIndex < MISSIONS.length - 1) {
      setLevelIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [levelIndex]);

  const runExplanation = async () => {
    setIsExplaining(true);
    const lines = [];
    
    // Step 1: Core Law
    lines.push("Weight on left scale = Weight on right scale");
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1200));

    // Step 2: Name the unknown
    const fruitName = mission.lhsItems.find(i => i.name !== 'block')?.name || 'item';
    lines.push(`We don't know the weight of the ${fruitName}.`);
    lines.push(`So, we give it a name: Weight of one ${fruitName} = ${mission.variableName}`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1500));

    // Step 3: Expression building
    const lhsParts = mission.lhsItems.map(item => {
        if (item.name === 'block') return `${item.unitWeight * item.count}`;
        return `${item.count}${mission.variableName}`;
    }).join(" + ");
    
    lines.push(`LHS items: ${lhsParts}`);
    setExplanationLines([...lines]);
    await new Promise(r => setTimeout(r, 1200));

    // Step 4: Final Sentence
    lines.push("Final equation in math language:");
    lines.push(`${lhsParts} = ${mission.rhsTotal}`);
    setExplanationLines([...lines]);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer, handleNextMission]);

  // --- Sub-Render Div Functions ---

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0">
      <header className="w-full bg-[#3e2723] p-4 sm:p-5 lg:p-6 rounded-[2.5rem] border-b-4 border-black/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left w-full md:w-auto">
            <button onClick={() => navigate('/learn/mathematics/algebra')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400 rotate-45 shadow-glow" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">The Variable Story</h2>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20 scale-90 sm:scale-100">
              <button onClick={() => { setAppMode('teach'); setTeachIndex(0); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'teach' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>LEARN STORY</button>
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); setSessionCompleted(false); setIsCorrect(false); }} className={`px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${appMode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>PRACTICE LAB</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  );

  const renderDotsDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-1">
      <div className="flex items-center gap-4 bg-[#3e2723]/5 p-4 rounded-full border border-[#3e2723]/10 shadow-inner">
        {appMode === 'teach' ? (
          TEACHING_STEPS.map((s, i) => (
            <div key={s.id} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i === teachIndex ? 'bg-blue-500 border-blue-700 ring-4 ring-blue-500/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          ))
        ) : (
          MISSIONS.map((m, i) => (
            <div key={m.id} className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${i < levelIndex ? 'bg-emerald-500 border-emerald-700' : i === levelIndex ? 'bg-amber-400 border-amber-600 ring-4 ring-amber-400/20' : 'bg-white/40 border-[#3e2723]/20'}`} />
          ))
        )}
      </div>
    </div>
  );

  const renderScaleDiv = () => {
    const activeLhs = appMode === 'teach' ? currentTeach.example.lhs : mission.lhsItems;
    const activeRhs = appMode === 'teach' ? (currentTeach.example.rhs || 10) : mission.rhsTotal;

    return (
      <div className="w-full max-w-[1400px] shrink-0 px-2 sm:px-6">
        <div className={`relative w-full min-h-[350px] sm:min-h-[450px] bg-[#3e2723] rounded-[3rem] border-4 border-black/30 shadow-2xl flex flex-col items-center justify-start overflow-hidden`}>
          <div className="absolute inset-0 opacity-[0.2] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="absolute inset-0 bg-white/5 opacity-10 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)" }} />
          
          <div className="relative w-full max-w-5xl flex justify-center items-center scale-[0.25] sm:scale-[0.35] lg:scale-[0.45] origin-top transition-transform overflow-visible mt-12 sm:mt-16">
              <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] z-20" />
                  <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                  <div className="absolute bottom-[-30px] w-56 h-16 bg-[#2a1a16] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
              </div>

              <div className="relative w-full flex justify-center z-20 mt-[12%]">
                  <div className="relative w-full h-8 bg-[#2a1a16] rounded-full flex justify-between items-center shadow-lg px-2 border border-white/10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-yellow-500 rounded-full border-2 border-[#3e2723] z-30 shadow-glow" />
                      
                      {/* LHS PAN */}
                      <div className="absolute left-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <motion.div 
                            animate={isCorrect ? { scale: 1.05, boxShadow: "0 0 60px rgba(59, 130, 246, 0.6)" } : {}}
                            className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                          >
                              <div className="flex flex-wrap-reverse justify-center items-center gap-1 w-full mb-10 overflow-visible px-4">
                                  {activeLhs.map((item, idx) => (
                                      <React.Fragment key={idx}>
                                        {[...Array(item.count || 1)].map((_, i) => (
                                            <motion.div key={`${idx}-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                              {item.name === 'block' ? <WeightBlock weight={item.unitWeight} /> : <span className="text-3xl sm:text-6xl drop-shadow-lg">{item.icon}</span>}
                                            </motion.div>
                                        ))}
                                      </React.Fragment>
                                  ))}
                              </div>
                              <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Left Scale</div>
                          </motion.div>
                      </div>

                      {/* RHS PAN */}
                      <div className="absolute right-[-20px] top-0 w-32 sm:w-64 flex flex-col items-center">
                          <svg className="w-24 sm:w-32 h-40 overflow-visible mb-[-4px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M50 0 L40 100 M50 0 L60 100" stroke="#e6dccb" strokeWidth="2.5" fill="none" strokeOpacity="0.5" strokeLinecap="round" />
                          </svg>
                          <motion.div 
                            animate={isCorrect ? { scale: 1.05, boxShadow: "0 0 167, 139, 250, 0.6)" } : {}}
                            className="w-full h-24 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-black/10 shadow-inner relative flex items-end justify-center pb-8 overflow-visible"
                          >
                               <div className="mb-12">
                                  <WeightBlock weight={activeRhs} />
                                </div>
                               <div className="absolute bottom-[-50px] bg-[#5d4037] text-[#e6dccb] px-6 py-2 rounded-xl font-black text-sm sm:text-xl shadow-lg border border-white/10 uppercase tracking-widest whitespace-nowrap">Right Scale</div>
                          </motion.div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="absolute bottom-6 left-0 w-full flex justify-center pointer-events-none px-4 z-[100]">
            <AnimatePresence mode="wait">
              {isCorrect && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-md pointer-events-auto">
                  <Trophy size={24} className="animate-bounce shrink-0" />
                  <span className="text-xs sm:text-lg font-bold uppercase tracking-tight">Translation Successful!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  };

  const renderMatrixDiv = () => (
    <div className={`w-full max-w-[1200px] shrink-0 transition-opacity px-2 min-h-[160px] z-50`}>
      <div className="bg-[#dfd7cc] p-6 sm:p-8 rounded-[3rem] border-4 border-[#c4a484] w-full flex flex-col items-center justify-center shadow-xl relative overflow-visible gap-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-white/20 shadow-md">
            {appMode === 'teach' ? 'The Variable Storybook' : 'Expression Selector'}
          </div>

          {appMode === 'teach' ? (
            <div className="w-full flex flex-col gap-6">
                <div className="flex justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
                    {TEACHING_STEPS.map((step, idx) => (
                      <button key={step.id} onClick={() => setTeachIndex(idx)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[10px] sm:text-xs transition-all border-b-4 
                          ${teachIndex === idx ? 'bg-[#3e2723] text-white border-black scale-105 shadow-lg' : 'bg-white text-[#8d6e63] border-gray-200 hover:bg-gray-50'}`}>
                         {step.icon} {step.label}
                      </button>
                    ))}
                </div>
                <motion.div key={teachIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/60 p-6 rounded-[2.5rem] border-2 border-white shadow-inner text-center relative overflow-hidden">
                    <h3 className={`font-black text-xl sm:text-3xl mb-2 text-[#3e2723]`}>{currentTeach.title}</h3>
                    <div className="text-[#5d4037] font-bold text-sm sm:text-lg mb-4 leading-tight whitespace-pre-line">
                        {currentTeach.definition}
                    </div>
                    <div className="bg-[#3e2723] text-amber-400 p-4 rounded-2xl text-[11px] sm:text-sm font-bold border-2 border-black/10 italic">
                        {currentTeach.visual}
                    </div>
                </motion.div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-6">
               <p className="text-[#5d4037] font-black text-sm sm:text-xl uppercase tracking-tight text-center leading-tight">
                  {mission.question}
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                  {mission.options.map((option, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isCorrect}
                      className={`group relative p-6 rounded-[2rem] border-b-8 transition-all flex items-center justify-between
                        ${selectedOption === idx && isCorrect ? 'bg-emerald-500 border-emerald-700 text-white' : 
                          selectedOption === idx && isError ? 'bg-red-500 border-red-700 text-white' :
                          'bg-white border-gray-200 text-[#3e2723] hover:bg-gray-50 active:translate-y-1'}`}
                    >
                      <span className="font-black text-sm sm:text-xl text-left leading-tight">{option}</span>
                      {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="shrink-0 ml-2" />}
                    </button>
                  ))}
               </div>
            </div>
          )}
      </div>
    </div>
  );

  const renderExplanationOverlay = () => (
    <AnimatePresence>
      {isExplaining && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#3e2723] pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar relative">
            <button onClick={() => { setIsExplaining(false); setExplanationLines([]); }} className="absolute top-6 right-6 p-2 bg-[#8d6e63] text-white rounded-full hover:rotate-90 transition-all active:scale-95 shadow-lg"><X size={24} /></button>
            <h2 className="text-2xl font-black uppercase text-[#5d4037] mb-8 tracking-tighter text-center">Algebraic Translation</h2>
            <div className="w-full bg-[#3e2723] p-8 rounded-[2.5rem] border-4 border-black/20 mb-8 text-left shadow-inner flex flex-col gap-4">
              {explanationLines.map((line, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`font-mono text-sm sm:text-xl font-black ${idx === explanationLines.length - 1 && line.includes('=') ? 'text-yellow-400 border-t border-white/10 pt-4 mt-2' : 'text-yellow-100/80'}`}>
                  {line}
                </motion.p>
              ))}
            </div>
            <button onClick={() => { setIsExplaining(false); setExplanationLines([]); }} className="px-12 py-4 bg-[#3e2723] text-white font-black rounded-2xl uppercase tracking-widest text-xs border-b-6 border-black active:translate-y-1 shadow-xl">Understood</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderButtonsDiv = () => (
    <div className={`w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-4 items-center px-2 pb-12 shrink-0`}>
        {appMode === 'teach' ? (
          <>
            <button onClick={() => setTeachIndex(p => Math.max(0, p - 1))} disabled={teachIndex === 0}
              className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-[#3e2723] active:scale-95 disabled:opacity-30 transition-all">
              Previous Step
            </button>
            {teachIndex < TEACHING_STEPS.length - 1 ? (
              <button onClick={() => setTeachIndex(p => p + 1)}
                className="flex items-center justify-center gap-3 bg-[#3e2723] text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-black active:scale-95 transition-all">
                Next Step <ChevronRight size={18} />
              </button>
            ) : (
              <button onClick={() => { setAppMode('practice'); setLevelIndex(0); setSessionCompleted(false); setIsCorrect(false); }}
                className="flex items-center justify-center gap-3 bg-indigo-600 text-white p-5 rounded-[2rem] font-black uppercase text-sm border-b-4 border-indigo-900 animate-pulse active:scale-95 transition-all">
                Start Practice Lab <PlayCircle size={18} />
              </button>
            )}
          </>
        ) : (
          <>
            <button onClick={handleNextMission}
              className={`relative flex items-center justify-between p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
              <div className="flex items-center gap-2">
                <ChevronRight size={20} />
                <span className="uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'SKIP QUESTION'}</span>
              </div>
              {autoNextTimer !== null && <span className="bg-black/20 px-3 py-1 rounded-full text-xs">Next in {autoNextTimer}s</span>}
            </button>
            <button onClick={runExplanation} className="flex items-center justify-center gap-3 bg-[#8d6e63] text-white p-4 rounded-[2rem] font-black text-sm active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
              <Info size={18} /> <span className="uppercase tracking-tighter">View Explanation</span>
            </button>
          </>
        )}
    </div>
  );

  const renderCompletionSummary = () => (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center bg-[#f1f0ee] rounded-[3rem] shadow-xl border-4 border-[#3e2723]">
      <div className="w-32 h-32 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white ring-8 ring-[#3e2723]/10">
        <Variable size={64} className="animate-bounce" />
      </div>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-[#3e2723] tracking-tighter mb-4">Algebra Unlocked!</h1>
      <p className="text-xl font-bold text-[#8d6e63] uppercase tracking-widest max-w-xl mb-10 leading-tight">You now understand how $x$ and $y$ represent the unknowns in our physical world.</p>
      <button onClick={() => navigate('/learn/mathematics/algebra/balancedScaleToAE')} className="px-16 py-6 bg-[#3e2723] text-white font-black rounded-[2.5rem] uppercase tracking-widest text-lg shadow-2xl border-b-8 border-black active:translate-y-2 transition-all">Move to next module</button>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center py-6 px-2 lg:px-4 overflow-y-auto bg-[#f1f0ee] no-scrollbar">
      <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)" }} />
      <div className="relative z-10 w-full flex flex-col items-center gap-y-10 sm:gap-y-12">
        {!sessionCompleted ? (
          <>
            {renderHeaderDiv()}
            {renderDotsDiv()}
            {renderScaleDiv()}
            {renderMatrixDiv()}
            {renderButtonsDiv()}
            {renderExplanationOverlay()}
          </>
        ) : (
          <div className="w-full flex items-center justify-center p-4">
            {renderCompletionSummary()}
          </div>
        )}
      </div>
    </div>
  );
}