import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  Shuffle,
  FastForward,
  Scale,
  Trophy,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
  Timer,
  Info,
  X,
  Equal,
  Plus,
  Minus,
  Target,
  ClipboardList,
  Droplets,
  PawPrint,
  ShoppingBag,
  Weight,
  Hammer,
  Apple,
  HelpCircle
} from 'lucide-react';

const PUZZLES = [
  {
    id: 'dairy',
    title: 'The Dairy Farm',
    subtitle: 'Animal & Milk Constraint',
    targetVal: 100,
    targetItemName: 'Animals',
    targetProductionName: 'Milk Production',
    unit: 'L',
    unitName: 'Milk',
    groupName: 'Barn Notes',
    groupIcon: <PawPrint size={14} />,
    items: [
      { id: 'item1', name: 'Cow', icon: '🐄', yield: 5 },
      { id: 'item2', name: 'Buffalo', icon: '🐂', yield: 2 },
      { id: 'item3', name: 'Goat', icon: '🐐', yield: 0.25 },
    ],
    solutionText: "11 Cows, 13 Buffaloes, and 76 Goats."
  },
  {
    id: 'hardware',
    title: 'Hardware Shop',
    subtitle: 'Mass & Quantity Balance',
    targetVal: 50,
    targetItemName: 'Hardware Items',
    targetProductionName: 'Total Weight',
    unit: 'g',
    unitName: 'Weight',
    groupName: 'Stock Sheet',
    groupIcon: <Hammer size={14} />,
    items: [
      { id: 'item1', name: 'Bolt', icon: '🔩', yield: 5 },
      { id: 'item2', name: 'Nut', icon: '⚙️', yield: 1 },
      { id: 'item3', name: 'Washer', icon: '⭕', yield: 0.1 },
    ],
    solutionText: "9 Bolts, 1 Nut, and 40 Washers."
  },
  {
    id: 'orchard',
    title: 'Fruit Orchard',
    subtitle: 'Harvest & Volume Goal',
    targetVal: 60,
    targetItemName: 'Total Fruits',
    targetProductionName: 'Total Volume',
    unit: 'u',
    unitName: 'Volume',
    groupName: 'Farmer Log',
    groupIcon: <Apple size={14} />,
    items: [
      { id: 'item1', name: 'Melon', icon: '🍉', yield: 6 },
      { id: 'item2', name: 'Pineapple', icon: '🍍', yield: 4 },
      { id: 'item3', name: 'Apple', icon: '🍎', yield: 0.5 },
    ],
    solutionText: "1 Melon, 7 Pineapples, and 52 Apples."
  }
];

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const puzzle = PUZZLES[currentLevel];

  const [counts, setCounts] = useState({ item1: 0, item2: 0, item3: 0 });
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]);

  const timerIntervalRef = useRef(null);

  // Math Logic
  const currentTotalItems = Object.values(counts).reduce((a, b) => a + b, 0);
  const currentTotalYield =
    (counts.item1 * puzzle.items[0].yield) +
    (counts.item2 * puzzle.items[1].yield) +
    (counts.item3 * puzzle.items[2].yield);
  
  const isItemsTargetMet = currentTotalItems === puzzle.targetVal;
  const isYieldTargetMet = Math.abs(currentTotalYield - puzzle.targetVal) < 0.001;
  const isLevelSolved = isItemsTargetMet && isYieldTargetMet;

  const speak = useCallback((text) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      const timeout = setTimeout(resolve, 5000);
      utterance.onend = () => { clearTimeout(timeout); resolve(); };
      utterance.onerror = () => { clearTimeout(timeout); resolve(); };
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  const resetPuzzle = useCallback(() => {
    setCounts({ item1: 0, item2: 0, item3: 0 });
    setIsCorrect(false);
    setAutoNextTimer(null);
    setIsExplaining(false);
    setShowInstructions(false);
    setFormulas([]);
  }, []);

  const goToNextLevel = useCallback(() => {
    setCurrentLevel(prev => (prev + 1) % PUZZLES.length);
    resetPuzzle();
  }, [resetPuzzle]);

  const adjustCount = (id, amount) => {
    if (isCorrect) return;
    setCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] + amount) }));
  };

  const handleDirectInput = (id, value) => {
    if (isCorrect) return;
    const numValue = parseInt(value, 10);
    setCounts(prev => ({
      ...prev,
      [id]: isNaN(numValue) ? 0 : Math.max(0, numValue)
    }));
  };

  useEffect(() => {
    if (isLevelSolved && !isCorrect) {
      setIsCorrect(true);
      setAutoNextTimer(10);
      speak(`Excellent! You have solved ${puzzle.title} by hitting both targets.`);
    }
  }, [isLevelSolved, isCorrect, speak, puzzle.title]);

  const runExplanation = async () => {
    setFormulas([
      `Target 1: Total ${puzzle.targetItemName} = ${puzzle.targetVal}`,
      `Target 2: Total ${puzzle.targetProductionName} = ${puzzle.targetVal}${puzzle.unit}`,
      `Items: ${puzzle.items[0].yield}${puzzle.unit}, ${puzzle.items[1].yield}${puzzle.unit}, ${puzzle.items[2].yield}${puzzle.unit}`
    ]);

    setIsExplaining(true);
    setExplanationText(`We must find a combination that satisfies both constraints.`);
    await speak(`We must find a combination of items that satisfy both constraints.`);
    
    setExplanationText(`Target 1: The sum of all ${puzzle.targetItemName.toLowerCase()} must be ${puzzle.targetVal}.`);
    await speak(`First, the sum of all items must be exactly ${puzzle.targetVal}.`);

    setExplanationText(`Target 2: Total ${puzzle.targetProductionName.toLowerCase()} must be ${puzzle.targetVal} ${puzzle.unit}.`);
    await speak(`Second, their total production must equal ${puzzle.targetVal} ${puzzle.unit}.`);

    setExplanationText(`Solution: ${puzzle.solutionText}`);
    await speak(`The solution for this puzzle is ${puzzle.solutionText}`);
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      goToNextLevel();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, goToNextLevel]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center bg-[#e6dccb] font-sans select-none text-[#5d4037] p-1.5 sm:p-4 pb-2 overflow-y-auto relative shadow-inner">
      {/* 🪵 MAIN WOOD PATTERN OVERLAY 🪵 */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
      {/* HEADER */}
      <div className="w-full max-w-4xl flex justify-between items-center px-1 py-1 sm:py-2 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-12 sm:h-12 bg-[#3e2723] rounded-lg sm:rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/40">
            <Scale size={16} className="sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-[11px] sm:text-2xl font-black uppercase tracking-tighter leading-none text-[#3e2723]">{puzzle.title}</h1>
            <p className="text-[5px] sm:text-[9px] font-black text-[#8d6e63] uppercase tracking-widest leading-none mt-0.5">{puzzle.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <button onClick={() => setShowInstructions(true)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            <HelpCircle size={14} className="sm:w-5 sm:h-5" />
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 sm:p-2.5 bg-[#faf9f6] text-[#3e2723] rounded-lg sm:rounded-xl shadow-sm border border-[#c4a484]/30 active:scale-95 transition-all">
            {isMuted ? <VolumeX size={12} className="sm:w-4 sm:h-4" /> : <Volume2 size={12} className="sm:w-4 sm:h-4" />}
          </button>
          <button onClick={resetPuzzle} className="p-1.5 sm:p-2.5 bg-[#3e2723] text-white rounded-lg sm:rounded-xl shadow-md border-b-2 border-black active:scale-95 transition-all">
            <RefreshCcw size={12} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 1: THE LAB STAGE */}
      <div className="flex-1 w-full max-w-4xl bg-[#faf9f6]/40 rounded-[1.2rem] sm:rounded-[3.5rem] shadow-[inset_0_4px_12px_rgba(0,0,0,0.05)] border-2 border-[#c4a484]/20 relative overflow-hidden flex flex-col items-center justify-center py-2 sm:py-4 min-h-0 my-2 sm:my-4">
        
        <div className="relative w-full flex flex-col items-center z-20 px-2 sm:px-6 gap-y-2 sm:gap-y-4">
          
          {/* MISSION DASHBOARD */}
          <div className="w-full bg-[#faf9f6] rounded-[1rem] sm:rounded-[2.5rem] p-3 sm:p-5 border-2 border-[#c4a484]/40 shadow-[0_8px_20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-4">
              <Target size={12} className="text-[#3e2723]" />
              <span className="text-[8px] sm:text-[12px] font-black uppercase tracking-[0.2em] text-[#3e2723]">Mission Targets</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {/* TARGET 1 */}
              <div className={`relative overflow-hidden p-2 sm:p-6 rounded-[0.8rem] sm:rounded-[2rem] border-2 transition-all bg-[#e6dccb]/30 ${isItemsTargetMet ? 'border-emerald-500 shadow-emerald-100' : 'border-[#c4a484]/30 shadow-inner'}`}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <ShoppingBag size={14} className={`sm:w-6 sm:h-6 ${isItemsTargetMet ? 'text-emerald-500' : 'text-[#8d6e63]'}`} />
                    <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#3e2723]">Target 1</span>
                  </div>
                  <span className="text-[6px] sm:text-[12px] font-bold text-[#8d6e63] text-center leading-tight">Total {puzzle.targetItemName}</span>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className={`text-xl sm:text-5xl font-black ${isItemsTargetMet ? 'text-emerald-600' : 'text-[#3e2723]'}`}>{currentTotalItems}</span>
                    <span className="text-[9px] sm:text-xl font-bold text-[#8d6e63]">/ {puzzle.targetVal}</span>
                  </div>
                </div>
              </div>

              {/* TARGET 2 */}
              <div className={`relative overflow-hidden p-2 sm:p-6 rounded-[0.8rem] sm:rounded-[2rem] border-2 transition-all bg-[#e6dccb]/30 ${isYieldTargetMet ? 'border-blue-500 shadow-blue-100' : 'border-[#c4a484]/30 shadow-inner'}`}>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Droplets size={14} className={`sm:w-6 sm:h-6 ${isYieldTargetMet ? 'text-blue-500' : 'text-[#8d6e63]'}`} />
                    <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#3e2723]">Target 2</span>
                  </div>
                  <span className="text-[6px] sm:text-[12px] font-bold text-[#8d6e63] text-center leading-tight">Total {puzzle.targetProductionName}</span>
                  <div className="flex items-baseline gap-0.5 mt-1">
                    <span className={`text-xl sm:text-5xl font-black ${isYieldTargetMet ? 'text-blue-600' : 'text-[#3e2723]'}`}>{currentTotalYield % 1 === 0 ? currentTotalYield : currentTotalYield.toFixed(1)}</span>
                    <span className="text-[9px] sm:text-xl font-bold text-[#8d6e63]">/ {puzzle.targetVal}{puzzle.unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LAB NOTES */}
          <div className="bg-[#3e2723] p-1 rounded-[1.2rem] sm:rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] border-b-4 border-black w-full">
            <div className="bg-[#4e342e] p-3 sm:p-6 rounded-[1rem] sm:rounded-2xl border-2 border-dashed border-[#8d6e63]/30 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2 sm:mb-4 border-b border-[#8d6e63]/20 w-full justify-center pb-2">
                {puzzle.groupIcon}
                <span className="text-[8px] sm:text-[12px] font-black uppercase tracking-[0.3em] text-[#faf9f6]/80">{puzzle.groupName}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 sm:gap-12 w-full">
                {puzzle.items.map(item => (
                  <div key={item.id} className="flex flex-col items-center">
                    <span className="text-xl sm:text-3xl filter drop-shadow-md">{item.icon}</span>
                    <span className="text-[6px] sm:text-[10px] font-black text-[#c4a484] uppercase mt-1">{item.name}</span>
                    <span className="text-[11px] sm:text-xl font-black text-[#faf9f6]">{item.yield}{puzzle.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FEEDBACK ZONE */}
        <div className="mt-2 sm:mt-4 w-full flex justify-center px-4">
          <AnimatePresence mode="wait">
            {isCorrect ? (
              <motion.div key="win" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-600 text-white py-2 sm:py-3 px-6 sm:px-10 rounded-full shadow-2xl flex items-center gap-3 border-b-4 border-emerald-800 backdrop-blur-sm">
                <Trophy size={16} className="animate-bounce" />
                <span className="text-[10px] sm:text-lg font-bold uppercase tracking-tight">Level Solved!</span>
              </motion.div>
            ) : (
              <motion.div key="neutral" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#faf9f6]/80 backdrop-blur-md px-4 sm:px-8 py-1.5 rounded-full shadow-md font-bold uppercase tracking-widest text-[8px] sm:text-sm text-[#3e2723] border border-[#c4a484]/30 flex items-center gap-2">
                <Info size={12} /> Target: {puzzle.targetVal} & {puzzle.targetVal}{puzzle.unit}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: CONTROLS */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-1 sm:mt-2 shrink-0">
        <div className="bg-[#3e2723] p-2 sm:p-5 rounded-[1.2rem] sm:rounded-[2.5rem] border-4 border-black w-full shadow-2xl relative">
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#faf9f6] text-[#3e2723] px-4 sm:px-8 py-0.5 rounded-full text-[7px] sm:text-[11px] font-black uppercase tracking-widest border-2 border-[#3e2723] shadow-md whitespace-nowrap">Manage Resources</div>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-8">
            {puzzle.items.map(item => (
              <div key={item.id} className="bg-[#faf9f6]/10 p-2 sm:p-5 rounded-[0.8rem] sm:rounded-3xl border border-white/5 shadow-inner flex flex-col items-center gap-1 sm:gap-2">
                <span className="text-xl sm:text-5xl">{item.icon}</span>
                <span className="text-[7px] sm:text-[11px] font-black uppercase text-[#c4a484]">{item.name}s</span>
                
                <input
                  type="number"
                  inputMode="numeric"
                  value={counts[item.id]}
                  onChange={(e) => handleDirectInput(item.id, e.target.value)}
                  className="w-full max-w-[50px] sm:max-w-none bg-[#faf9f6] border-2 border-[#c4a484] rounded-md sm:rounded-xl py-0.5 sm:py-2 text-center text-sm sm:text-3xl font-black text-[#3e2723] focus:ring-4 focus:ring-emerald-500/20 focus:outline-none transition-all"
                />

                <div className="flex gap-1 w-full">
                  <button onClick={() => adjustCount(item.id, -1)} className="flex-1 py-1 sm:py-3 bg-[#e6dccb] text-[#3e2723] rounded-md sm:rounded-xl shadow-sm border-b-2 border-[#c4a484] active:translate-y-0.5 active:border-b-0 font-black text-[12px] sm:text-base">-</button>
                  <button onClick={() => adjustCount(item.id, 1)} className="flex-1 py-1 sm:py-3 bg-emerald-500 text-white rounded-md sm:rounded-xl shadow-md border-b-2 border-emerald-800 active:translate-y-0.5 active:border-b-0 font-black text-[12px] sm:text-base">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="w-full max-w-4xl flex flex-row gap-2 items-center mt-2 sm:mt-4 shrink-0 px-1 pb-2">
        <button onClick={resetPuzzle} className={`flex items-center justify-between flex-1 p-2 sm:p-4 rounded-[1rem] sm:rounded-[2.5rem] font-black active:scale-95 shadow-lg border-b-2 sm:border-b-4 ${autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-900 shadow-emerald-200/50' : 'bg-[#3e2723] text-[#c4a484] border-black'}`}>
          <div className="flex items-center gap-1.5">
            <div className="bg-white/10 p-1 rounded-md sm:rounded-2xl"><ChevronRight size={14} className="sm:w-5 sm:h-5" /></div>
            <span className="uppercase text-[8px] sm:text-lg">{autoNextTimer !== null ? 'NEXT LEVEL' : 'RESET LAB'}</span>
          </div>
          {autoNextTimer !== null && (
            <div className="flex items-center gap-1 bg-black/50 px-2 sm:px-3 py-0.5 rounded-full border border-white/10">
              <Timer size={10} className="animate-spin text-indigo-300" />
              <span className="text-[11px] sm:text-2xl font-mono">{autoNextTimer}</span>
            </div>
          )}
        </button>
        
        <button onClick={runExplanation} className="flex items-center justify-center gap-1.5 flex-1 bg-[#8d6e63] hover:bg-[#3e2723] text-[#faf9f6] p-2 sm:p-4 rounded-[1rem] sm:rounded-[2.5rem] font-black active:scale-95 shadow-lg border-b-2 sm:border-b-4 border-[#3e2723] transition-all">
          <Info size={14} className="sm:w-5 sm:h-5" />
          <span className="uppercase text-[8px] sm:text-lg tracking-tighter">Logic Breakdown</span>
        </button>
      </div>

      {/* INSTRUCTIONS MODAL */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-xl bg-[#faf9f6] rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden relative p-6 sm:p-10 border-4 border-[#3e2723]">
              <button onClick={() => setShowInstructions(false)} className="absolute top-4 right-4 p-2 bg-[#3e2723] text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"><X size={18} /></button>
             
              <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b-2 border-[#c4a484]/20 pb-4">
                  <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-[#3e2723]" />
                  <h2 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-[#3e2723]">Mission Briefing</h2>
              </div>

              <div className="space-y-3 sm:space-y-5 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
                {[
                  { text: `Your objective is to reach equilibrium across two specific targets: Total ${puzzle.targetItemName} and Total ${puzzle.targetProductionName}.`, icon: "🎯" },
                  { text: `Target 1: Adjust the counts so that the total number of items is exactly ${puzzle.targetVal}.`, icon: "📦" },
                  { text: `Target 2: At the same time, ensure the total production output is exactly ${puzzle.targetVal}${puzzle.unit}.`, icon: "⚙️" },
                  { text: `Refer to the '${puzzle.groupName}' to see how much each individual item produces.`, icon: "📝" },
                  { text: "Adjust counts using the '+' and '-' buttons or by entering values directly into the lab display.", icon: "🔬" },
                  { text: "Once both targets turn green, the level is verified and you can proceed.", icon: "✅" }
                ].map((item, i) => (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} key={i} className="flex gap-4 items-start bg-[#e6dccb]/30 p-4 rounded-2xl border border-[#c4a484]/10 shadow-inner">
                    <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#3e2723] text-[#faf9f6] flex items-center justify-center font-black text-xs sm:text-xl shrink-0 shadow-md">{i+1}</span>
                    <p className="text-[11px] sm:text-lg font-bold text-[#5d4037] leading-relaxed pt-1.5">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => setShowInstructions(false)} className="w-full mt-6 sm:mt-8 py-3 sm:py-5 bg-[#3e2723] text-white font-black rounded-2xl shadow-lg transition-all hover:bg-black active:scale-95 uppercase tracking-widest border-b-4 border-black text-xs sm:text-xl">Accept Mission</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
            <div className="w-full max-w-4xl h-fit max-h-[90vh] bg-[#faf9f6] rounded-[1.2rem] sm:rounded-[3rem] shadow-2xl overflow-y-auto relative flex flex-col items-center p-4 sm:p-10 border-4 border-[#3e2723]">
              <button onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }} className="absolute top-2 right-2 p-1.5 bg-[#3e2723] text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-90"><X size={16} /></button>
              <h2 className="text-base sm:text-5xl font-black uppercase tracking-tighter mb-3 text-[#3e2723]">Cognitive Logic</h2>
              <div className="w-full space-y-2 sm:space-y-6">
                <div className="w-full bg-[#3e2723] p-3 sm:p-8 rounded-[0.8rem] sm:rounded-[2.5rem] border-2 border-black text-center shadow-lg">
                  <div className="space-y-1 min-h-[40px] sm:min-h-[160px] flex flex-col justify-center">
                    {formulas.map((line, idx) => (
                      <p key={idx} className="text-[9px] sm:text-3xl font-black font-mono text-[#c4a484] drop-shadow-sm">{line}</p>
                    ))}
                  </div>
                </div>
                <div className="w-full bg-[#e6dccb]/50 p-3 rounded-[0.8rem] sm:rounded-[2.5rem] border-2 border-[#c4a484]/20 text-center min-h-[30px] sm:min-h-[120px] flex items-center justify-center shadow-inner">
                  <p className="text-[9px] sm:text-2xl font-bold text-[#3e2723] leading-tight">{explanationText}</p>
                </div>
              </div>
              <button onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }} className="mt-4 px-8 py-2 bg-[#3e2723] text-white font-black rounded-xl text-[8px] sm:text-xl border-b-2 border-black shadow-md">Continue</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
       .no-scrollbar::-webkit-scrollbar { display: none; }
       .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
       input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
       input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}