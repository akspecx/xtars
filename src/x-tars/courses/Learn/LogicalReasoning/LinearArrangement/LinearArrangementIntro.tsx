import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Info,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  ArrowRightLeft,
  Store,
  Users,
  IceCream,
  ClipboardList
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE = [
  { id: 'p1', name: 'Sam', icon: '🚶‍♂️', pos: '1st' },
  { id: 'p2', name: 'Mia', icon: '🚶‍♀️', pos: '2nd' },
  { id: 'p3', name: 'Leo', icon: '🚶‍♂️', pos: '3rd' },
  { id: 'p4', name: 'Eva', icon: '🚶‍♀️', pos: '4th' },
  { id: 'p5', name: 'Max', icon: '🚶‍♂️', pos: '5th' },
];

const MISSIONS = [
  { 
    id: 1, v: 'First', q: 'Who is standing at FIRST in the line?', 
    options: ['Sam', 'Mia', 'Max'], correct: 0,
    explanation: [
      "Step 1: Reference Point - The Ice-Cream shop and the Server are our starting point. Everything begins at the counter.",
      "Step 2: Linear Order - People are standing one after another in a straight sequence. We count from the front to the back.",
      "Step 3: Finding Position - Sam is the person closest to the Server and the counter. This makes Sam the 1st person."
    ]
  },
  { 
    id: 2, v: 'Last', q: 'Who is standing at LAST in the line?', 
    options: ['Sam', 'Eva', 'Max'], correct: 2,
    explanation: [
      "Step 1: Reference Point - We define the front as the Shop and count backwards into the arrangement.",
      "Step 2: Linear Order - Trace the line of people from the shop counter all the way to the end of the queue.",
      "Step 3: Finding Position - Max is at the very end of the sequence with no one else behind him. This makes Max the Last person."
    ]
  },
  { 
    id: 3, v: '2nd', q: 'Who is standing SECOND (2nd) in the line?', 
    options: ['Mia', 'Leo', 'Sam'], correct: 0,
    explanation: [
      "Step 1: Reference Point - First, locate the 1st person (Sam) standing directly at the shop counter.",
      "Step 2: Linear Order - Move exactly one position back from the 1st spot in this linear arrangement.",
      "Step 3: Finding Position - Mia is standing right behind Sam. Following the sequence 1st -> 2nd, we see Mia is 2nd."
    ]
  },
  { 
    id: 4, v: '4th', q: 'Who is standing at the FOURTH (4th) position?', 
    options: ['Leo', 'Eva', 'Max'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Use the serving counter as the starting mark and count the people one by one.",
      "Step 2: Linear Order - Follow the sequence: 1. Sam, 2. Mia, 3. Leo. We need the person in the next spot.",
      "Step 3: Finding Position - The fourth person we reach in this straight line is Eva. Eva is the 4th person."
    ]
  },
  { 
    id: 5, v: '3rd', q: 'Who is standing at the THIRD (3rd) position?', 
    options: ['Mia', 'Leo', 'Eva'], correct: 1,
    explanation: [
      "Step 1: Reference Point - Locate the Server at the start of the arrangement.",
      "Step 2: Linear Order - Skip the first two people in the sequence to identify who is next in line.",
      "Step 3: Finding Position - Leo is the person holding the middle spot between the front and the end. Leo is the 3rd person."
    ]
  }
];

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function LinearArrangementIntro() {
  const navigate = useNavigate();
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = MISSIONS[levelIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // --- Handlers ---
  const handleOptionSelect = (index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === mission.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(10);
    } else {
      setIsError(true);
      setTimeout(() => { setIsError(false); }, 800);
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

  // Timer pauses when explanation is open
  useEffect(() => {
    let interval;
    if (!isExplaining && autoNextTimer !== null && autoNextTimer > 0) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (!isExplaining && autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextMission, isExplaining]);

  // DIV 1: HEADER
  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-lg sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Arrangement Laboratory</h1>
          </div>
          <div className="bg-yellow-400/10 p-2 sm:p-3 rounded-2xl border border-yellow-400/20">
            <Users className="text-yellow-400" size={24} />
          </div>
        </div>
      </header>
    </div>
  );

  // PROGRESS BAR
  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2 px-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-[#3e2723]/20 px-4 sm:px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {MISSIONS.map((_, i) => (
          <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 
            ${i < levelIndex ? 'bg-green-500 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              i === levelIndex ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 
              'bg-white border-[#3e2723]/20'}`} />
        ))}
      </div>
    </div>
  );

  // DIV 2: MAHOGANY BOARD (ICE CREAM SHOP VISUAL)
  const renderBoardDiv = () => (
    <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-[#2a1a16] p-1.5 sm:p-3 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative overflow-hidden ring-4 ring-black/10">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <div className="relative z-10 bg-[#3e2723] p-4 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[260px] sm:min-h-[380px] shadow-inner overflow-hidden">
           
           <div className="w-full flex items-end justify-start sm:justify-center gap-4 sm:gap-12 overflow-x-auto no-scrollbar py-8 pb-10 sm:pb-8">
              
              {/* ADVANCED ICE CREAM SHOP */}
              <div className="flex flex-col items-center shrink-0 relative sticky left-0 z-20">
                {/* Awning Decoration */}
                <div className="w-24 sm:w-40 h-8 sm:h-12 bg-red-600 rounded-t-xl relative overflow-hidden flex border-2 border-black/20 shadow-lg">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-red-600' : 'bg-white'}`} />
                  ))}
                  <div className="absolute bottom-0 w-full h-2 bg-black/10" />
                </div>
                
                {/* Shop Body */}
                <div className="w-20 sm:w-36 h-20 sm:h-32 bg-[#f5e6d3] border-x-4 border-b-4 border-[#8b4513]/40 flex flex-col items-center shadow-xl relative">
                  <div className="bg-[#3e2723] px-2 py-0.5 mt-2 rounded border border-yellow-600/30">
                    <span className="text-yellow-400 font-black text-[6px] sm:text-[9px] uppercase tracking-tighter text-center block">Scoop Station</span>
                  </div>
                  {/* Window/Counter with Server - Facing RIGHT toward the queue */}
                  <div className="w-14 sm:w-24 h-8 sm:h-14 bg-blue-100/30 mt-2 border-2 border-black/5 rounded-md flex items-center justify-center shadow-inner relative">
                    <span className="text-xl sm:text-3xl absolute left-1 sm:left-2 bottom-1 filter drop-shadow-md transform -scale-x-100">🧑‍🍳</span>
                    <span className="text-2xl sm:text-5xl drop-shadow-lg ml-6 sm:ml-8">🍦</span>
                  </div>
                  <div className="absolute bottom-0 w-full h-3 sm:h-6 bg-[#d2b48c] border-t-2 border-black/10 flex items-center justify-center">
                    <span className="text-[6px] sm:text-[10px] font-black text-[#5d4037] uppercase">Order Here</span>
                  </div>
                </div>
              </div>

              {/* SERVICE LINE GAP */}
              <div className="flex flex-col items-center mx-1 sm:mx-2 mb-4 shrink-0">
                <div className="h-0.5 w-8 sm:w-20 bg-white/10 rounded-full" />
                <span className="text-[6px] text-[#a88a6d] font-bold uppercase mt-1">Next!</span>
              </div>

              {/* PEOPLE IN LINE - FACING LEFT TOWARDS SHOP */}
              <div className="flex gap-4 sm:gap-8 pr-4">
                {PEOPLE.map((person, idx) => (
                  <motion.div 
                    key={person.id}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="flex flex-col items-center shrink-0"
                  >
                    <div className="relative group">
                      {/* Person Emoji - Faces LEFT by default, which is toward the shop */}
                      <span className="text-5xl sm:text-7xl drop-shadow-md block transition-transform group-hover:scale-110">
                        {person.icon}
                      </span>
                      {/* Order thought bubble (only for 1st) */}
                      {idx === 0 && (
                         <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-6 -left-4 bg-white rounded-full px-2 py-1 shadow-md border border-black/5 scale-75 sm:scale-100"
                        >
                           <span className="text-xs">🍓?</span>
                         </motion.div>
                      )}
                    </div>
                    
                    <div className="mt-4 bg-white/5 px-2 sm:px-5 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                      <span className="text-[#fef3c7] font-bold text-[9px] sm:text-sm whitespace-nowrap">{person.name}</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[7px] sm:text-[10px] text-yellow-400/60 font-black uppercase tracking-widest">{person.pos}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
           </div>

           <div className="w-full mt-4 sm:mt-6 border-t border-white/5 pt-4">
              <span className="text-[8px] sm:text-xs font-black text-[#a88a6d] uppercase tracking-widest italic text-center block">
                When people stand one after another in a straight line, we call it a linear arrangement
              </span>
           </div>
        </div>
      </motion.div>
    </div>
  );

  // DIV 3: INTERACTIVE PANEL
  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[240px] sm:min-h-[280px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="text-center w-full relative z-10 py-2 sm:py-4">
          <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-6 sm:mb-12 tracking-tight drop-shadow-sm px-2 leading-tight">
              {mission.q}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto">
            {mission.options.map((option, idx) => (
              <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isCorrect}
                className={`group relative p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-b-8 font-black text-lg sm:text-3xl transition-all
                  ${selectedOption === idx && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg' : 
                    selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                    'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 hover:scale-[1.03] active:translate-y-1 shadow-sm'}`}>
                {option}
                {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/40" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // DIV 4: CONTROL FOOTER
  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-20 sm:pb-24 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button onClick={handleNextMission} className="w-full flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 flex justify-center items-center gap-2 shadow-lg transition-all">
          {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Question'} <ChevronRight size={18} />
        </button>
        <button 
          onClick={() => setIsExplaining(true)} 
          disabled={selectedOption === null}
          className={`w-full flex-1 p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 active:translate-y-1 flex items-center justify-center gap-2 shadow-lg transition-all
            ${selectedOption !== null ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
          <Info size={18} /> View Explanation
        </button>
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce w-16 h-16 sm:w-24 sm:h-24" />
        </motion.div>
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter px-4 text-center">Logic Master!</h1>
        <div className="relative z-10 bg-white/60 p-6 sm:p-8 rounded-[2rem] sm:rounded-3xl border-2 border-[#3e2723]/20 max-w-2xl mb-10 shadow-inner mx-4 text-center">
          <h2 className="text-lg sm:text-xl text-[#8d6e63] font-black uppercase mb-6 tracking-widest leading-tight">Module Summary</h2>
          <p className="text-[#3e2723] text-base sm:text-xl leading-relaxed font-black mb-6">
            "When people stand one after another in a straight line, we call it a linear arrangement."
          </p>
          <div className="h-1 w-20 bg-[#3e2723]/10 mx-auto my-4 sm:my-6" />
          <p className="text-xs sm:text-sm text-[#5d4037] italic leading-relaxed">
            You have successfully completed the laboratory challenge on Linear Arrangement!
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="relative z-10 px-10 sm:px-16 py-4 sm:py-6 bg-[#3e2723] text-[#e6dccb] rounded-[1.5rem] sm:rounded-[2.5rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative">
      <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="absolute inset-0 bg-[#3e2723] pointer-events-none opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(0,0,0,0.05) 100px, rgba(0,0,0,0.05) 200px)" }} />
      
      <div className="relative z-10 w-full flex flex-col items-center">
        {renderHeaderDiv()}
        {renderProgressDiv()}
        {renderBoardDiv()}
        {renderActionArea()}
        {renderFooterDiv()}
      </div>

      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2rem] sm:rounded-[3.5rem] p-6 sm:p-10 shadow-2xl relative border-4 sm:border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden">
              <button onClick={() => setIsExplaining(false)} className="absolute top-4 right-4 sm:top-8 sm:right-8 p-1 sm:p-2 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={18} /></button>
              
              <h3 className="text-lg sm:text-2xl font-black text-[#3e2723] uppercase mb-4 sm:mb-8 flex items-center gap-3">
                <ArrowRightLeft size={24} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-1 flex flex-col gap-4">
                {mission.explanation.map((line, i) => {
                  const [header, ...detailParts] = line.split(" - ");
                  const detail = detailParts.join(" - ");
                  
                  return (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/50 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl border border-[#3e2723]/10"
                    >
                      <div className="bg-[#3e2723] p-3 sm:p-4 border-l-8 border-yellow-400">
                        <h4 className="text-yellow-400 font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-2">
                           {header}
                        </h4>
                      </div>
                      <div className="p-4 sm:p-6 bg-[#dfd7cc]/30">
                        <p className="font-mono text-[#3e2723] text-[11px] sm:text-base leading-relaxed italic">
                          {detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-6 py-4 sm:py-5 bg-[#3e2723] text-[#e6dccb] font-black rounded-xl sm:rounded-[2rem] uppercase tracking-widest text-[10px] sm:text-xs border-b-6 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}