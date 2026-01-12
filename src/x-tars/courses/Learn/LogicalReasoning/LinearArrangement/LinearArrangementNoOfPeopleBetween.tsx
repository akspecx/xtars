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
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  MousePointer2
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// 1. DATA CONFIGURATIONS
// ==========================================
const PEOPLE = [
  { id: 'p1', name: 'Aanya', image: 'https://via.placeholder.com/300x450?text=Aanya+Back', facing: 'away', seat: 1 },
  { id: 'p2', name: 'Ben', image: 'https://via.placeholder.com/300x450?text=Ben+Front', facing: 'towards', seat: 2 },
  { id: 'p3', name: 'Chintu', image: 'https://via.placeholder.com/300x450?text=Chintu+Back', facing: 'away', seat: 3 },
  { id: 'p4', name: 'Diya', image: 'https://via.placeholder.com/300x450?text=Diya+Front', facing: 'towards', seat: 4 },
  { id: 'p5', name: 'Ethan', image: 'https://via.placeholder.com/300x450?text=Ethan+Back', facing: 'away', seat: 5 },
];

const CONCEPT_STEPS = [
  {
    id: 0,
    label: "Step 1",
    title: "Aanya to Diya",
    desc: "Aanya is in Seat 1. Diya is in Seat 4. There are 2 people (Ben and Chintu) between them!",
    highlight: 'count',
    ends: [0, 3], 
    between: [1, 2] 
  }
];

const MISSIONS = [
  { 
    id: 1, v: 'Count', q: 'How many people are sitting between Aanya and Diya?', 
    options: ['1 Person', '2 People', '3 People'], correct: 1,
    explanation: [
      "Step 1: Find Aanya (Seat 1) and Diya (Seat 4).",
      "Step 2: Look at the seats in the middle (Seat 2 and 3).",
      "Step 3: Ben and Chintu are there. That is 2 people."
    ]
  },
  { 
    id: 2, v: 'Count', q: 'How many people sit between Ben and Ethan?', 
    options: ['1 Person', '2 People', '3 People'], correct: 1,
    explanation: [
      "Step 1: Locate Ben (Seat 2) and Ethan (Seat 5).",
      "Step 2: Check the middle seats (Seat 3 and 4).",
      "Step 3: Chintu and Diya are sitting there. Total is 2 people."
    ]
  },
  { 
    id: 3, v: 'Count', q: 'How many people sit between Aanya and Chintu?', 
    options: ['None', '1 Person', '2 People'], correct: 1,
    explanation: [
      "Step 1: Find Aanya (Seat 1) and Chintu (Seat 3).",
      "Step 2: Only Seat 2 is in the middle.",
      "Step 3: Ben is in that seat. Total is 1 person."
    ]
  },
  { 
    id: 4, v: 'Count', q: 'How many people sit between Aanya and Ethan?', 
    options: ['2 People', '3 People', '4 People'], correct: 1,
    explanation: [
      "Step 1: Find Aanya (Seat 1) and Ethan (Seat 5).",
      "Step 2: Seats 2, 3, and 4 are in the middle.",
      "Step 3: Ben, Chintu, and Diya are there. Total is 3 people."
    ]
  },
  { 
    id: 5, v: 'Count', q: 'How many people sit between Chintu and Ethan?', 
    options: ['1 Person', '2 People', 'None'], correct: 0,
    explanation: [
      "Step 1: Find Chintu (Seat 3) and Ethan (Seat 5).",
      "Step 2: Seat 4 is the middle spot.",
      "Step 3: Diya is sitting there. Total is 1 person."
    ]
  }
];

// ==========================================
// 2. MAIN LAB COMPONENT
// ==========================================
export default function PeopleBetweenLab() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept'); 
  const [activeTab, setActiveTab] = useState(0);
  const [levelIndex, setLevelIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  
  const mission = MISSIONS[levelIndex];
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

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

  useEffect(() => {
    let interval;
    if (!isExplaining && autoNextTimer !== null && autoNextTimer > 0) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (!isExplaining && autoNextTimer === 0) {
      handleNextMission();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextMission, isExplaining]);

  const renderHeaderDiv = () => (
    <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6">
      <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
        <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
              <ChevronLeft size={16} /> Dashboard
            </button>
            <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">Counting Lab</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => {setAppMode('practice'); setLevelIndex(0);}} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>
    </div>
  );

  const renderProgressDiv = () => (
    <div className="w-full shrink-0 flex items-center justify-center py-2 px-4">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-[#3e2723]/20 px-4 sm:px-6 py-3 rounded-full border border-[#3e2723]/10 backdrop-blur-sm shadow-inner">
        {(appMode === 'concept' ? [0] : MISSIONS).map((_, i) => (
          <div key={i} className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full transition-all duration-500 border-2 
            ${(appMode === 'concept' ? i < activeTab : i < levelIndex) ? 'bg-green-500 border-green-600 shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 
              (appMode === 'concept' ? i === activeTab : i === levelIndex) ? 'bg-yellow-400 border-yellow-500 scale-125 shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 
              'bg-white border-[#3e2723]/20'}`} />
        ))}
      </div>
    </div>
  );

  const renderBoardDiv = () => {
    const concept = appMode === 'concept' ? CONCEPT_STEPS[activeTab] : null;
    // Concept mode only shows the first 4 people as requested
    const currentPeople = appMode === 'concept' ? PEOPLE.slice(0, 4) : PEOPLE;

    return (
      <div className="w-full max-w-5xl px-4 py-2 sm:py-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          
          <div className="relative z-10 bg-[#3e2723] pt-16 pb-16 sm:pt-24 sm:pb-24 px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[450px] sm:min-h-[600px] shadow-inner">
             
             <div className={`w-full flex items-end justify-start sm:justify-center overflow-x-auto no-scrollbar py-8 px-2 sm:px-4 relative gap-1 sm:gap-4 lg:gap-8`}>
                
                {currentPeople.map((person, idx) => {
                  const isEnd = appMode === 'concept' && concept.ends.includes(idx);
                  const isBetween = appMode === 'concept' && concept.between.includes(idx);
                  const highlightPerson = appMode === 'concept' ? (isEnd || isBetween) : true;

                  return (
                    <motion.div key={person.id} className="flex flex-col items-center shrink-0 relative px-1">
                        
                        <div className={`relative transition-all duration-500 p-1 ${highlightPerson ? 'scale-105' : 'opacity-40 grayscale'}`}>
                          {/* Bench Back */}
                          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#5d4037] rounded-t-xl border-t-4 border-x-4 border-black/20 z-20 shadow-2xl transition-all duration-500
                            ${appMode === 'concept' ? 'w-14 sm:w-32 h-10 sm:h-18' : 'w-12 sm:w-24 h-10 sm:h-16'}`} 
                          />
                          
                          {/* Image Box Container */}
                          <div className={`relative z-10 flex items-center justify-center overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-white/10 bg-black/40 shadow-2xl ring-2 ring-black/10 transition-all duration-500
                            ${appMode === 'concept' 
                              ? 'w-20 h-32 sm:w-40 sm:h-60' 
                              : 'w-16 h-26 sm:w-32 sm:h-48'}`}
                          >
                             <img 
                                src={person.image} 
                                alt={person.name}
                                className="w-full h-full object-cover filter brightness-[0.95]"
                                onError={(e) => { e.target.src = `https://via.placeholder.com/300x450?text=${person.name}`; }}
                             />
                          </div>

                          {/* Highlights */}
                          {isEnd && <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                          {isBetween && <div className="absolute inset-0 bg-cyan-400/20 blur-3xl rounded-full z-0 animate-pulse" />}
                        </div>
                        
                        {/* Name Label & Seat SCaffolding */}
                        <div className="mt-8 flex flex-col items-center gap-2">
                           <div className={`px-4 py-1 rounded-full border-2 transition-all duration-500 
                              ${isEnd ? 'bg-yellow-400 text-[#2a1a16] border-yellow-500 font-black' : 
                                isBetween ? 'bg-cyan-500 text-white border-cyan-400 font-black' : 
                                'bg-black/20 text-[#a88a6d] border-transparent font-bold'}`}>
                              <span className="text-[9px] sm:text-xs uppercase tracking-widest">{person.name}</span>
                           </div>
                           
                           <div className="flex flex-col items-center">
                              <div className="w-0.5 h-4 bg-white/10" />
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shadow-xl">
                                 <span className="text-white font-black text-xs sm:text-sm">#{person.seat}</span>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                  );
                })}
             </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const renderActionArea = () => (
    <div className="w-full max-w-4xl px-4 py-4 sm:py-6">
      <div className="bg-[#dfd7cc] p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-4 sm:gap-6 w-full relative overflow-hidden ring-4 ring-[#dfd7cc]/50 min-h-[200px] sm:min-h-[280px]">
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        {appMode === 'concept' ? (
          <div className="w-full flex flex-col items-center relative z-10">
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-center w-full max-w-2xl px-4">
              <h3 className="text-[#2a1a16] text-xl sm:text-2xl font-black uppercase mb-4 flex items-center justify-center gap-3 text-shadow-sm">
                <GraduationCap size={32} className="text-orange-600" /> {CONCEPT_STEPS[activeTab].title}
              </h3>
              <p className="text-[#3e2723] text-lg sm:text-2xl font-bold leading-relaxed mb-4 italic">
                "{CONCEPT_STEPS[activeTab].desc}"
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="text-center w-full relative z-10 py-2 sm:py-4">
            <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase mb-8 sm:mb-12 tracking-tight drop-shadow-sm px-2 leading-tight">
                {mission.q}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-2xl mx-auto">
              {mission.options.map((option, idx) => (
                <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={isCorrect}
                  className={`group relative p-5 sm:p-8 rounded-[1.5rem] border-b-8 font-black text-xl sm:text-3xl transition-all
                    ${selectedOption === idx && isCorrect ? 'bg-green-500 border-green-700 text-white shadow-lg' : 
                      selectedOption === idx && isError ? 'bg-red-600 border-red-800 text-white animate-shake' :
                      'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50 active:translate-y-1 shadow-md'}`}>
                  {option}
                  {selectedOption === idx && isCorrect && <CheckCircle2 size={24} className="absolute top-2 right-2 text-white/40" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderFooterDiv = () => (
    <div className="w-full max-w-md px-4 pb-24 sm:pb-32 flex flex-col sm:flex-row gap-3 sm:gap-4">
        {appMode === 'concept' ? (
          <button onClick={() => { setAppMode('practice'); setLevelIndex(0); }}
            className="w-full bg-[#2a1a16] text-[#e6dccb] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 transition-all shadow-lg flex items-center justify-center gap-2">
            Start counting Challenge <ChevronRight size={18} />
          </button>
        ) : (
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:gap-4">
            <button onClick={() => {setAppMode('concept'); setActiveTab(0);}} className="flex-1 bg-[#2a1a16] text-[#e6dccb] p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-black active:translate-y-1 flex justify-center items-center gap-2 shadow-lg">
               <GraduationCap size={18} /> Concept
            </button>
            <button onClick={handleNextMission} className="flex-1 bg-[#8d6e63] text-white p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 border-[#5d4037] active:translate-y-1 flex justify-center items-center gap-2 shadow-lg transition-all">
              {autoNextTimer !== null ? `Next in ${autoNextTimer}s` : 'Skip Mission'} <ChevronRight size={18} />
            </button>
            <button onClick={() => setIsExplaining(true)} disabled={selectedOption === null}
              className={`flex-1 p-4 sm:p-5 rounded-2xl font-black uppercase text-[10px] sm:text-[11px] border-b-4 active:translate-y-1 flex items-center justify-center gap-2 shadow-lg transition-all
                ${selectedOption !== null ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed'}`}>
              <Info size={18} /> Explanation
            </button>
          </div>
        )}
    </div>
  );

  if (sessionCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#e6dccb]">
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-10 shadow-2xl border-8 border-white ring-8 ring-[#3e2723]/10">
          <Trophy size={80} className="animate-bounce" />
        </motion.div>
        <h1 className="relative z-10 text-3xl sm:text-6xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Counting Master!</h1>
        <div className="relative z-10 bg-white/60 p-8 rounded-[3rem] border-4 border-[#3e2723]/20 max-w-2xl mb-10 shadow-2xl mx-4 backdrop-blur-sm text-center">
          <h2 className="text-xl sm:text-2xl text-[#8d6e63] font-black uppercase mb-4 tracking-widest leading-tight text-center">Module Summary</h2>
          <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-6 text-center">
            "You have mastered counting the number of people between others. Great job!"
          </p>
        </div>
        <button onClick={() => window.location.reload()} className="relative z-10 px-12 sm:px-20 py-5 sm:py-7 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] sm:rounded-[3rem] font-black uppercase tracking-widest shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab</button>
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
            <div className="w-full max-w-3xl bg-[#dfd7cc] rounded-[2.5rem] sm:rounded-[4.5rem] p-6 sm:p-12 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden">
              <button onClick={() => setIsExplaining(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 sm:p-3 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 active:scale-90 shadow-lg z-20"><CloseIcon size={20} /></button>
              
              <h3 className="text-xl sm:text-3xl font-black text-[#3e2723] uppercase mb-6 sm:mb-10 flex items-center gap-4">
                <ArrowRightLeft size={32} className="text-[#8d6e63]" /> Solution Logic
              </h3>

              <div className="flex-1 overflow-y-auto no-scrollbar pr-2 flex flex-col gap-6">
                {mission.explanation.map((line, i) => {
                  const [header, ...detailParts] = line.split(" - ");
                  const detail = detailParts.join(" - ");
                  
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white/60 rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border-2 border-[#3e2723]/10"
                    >
                      <div className="bg-[#3e2723] p-4 sm:p-5 border-l-[12px] border-yellow-400">
                        <h4 className="text-yellow-400 font-black uppercase text-xs sm:text-sm tracking-widest">
                           {header}
                        </h4>
                      </div>
                      <div className="p-5 sm:p-8 text-center">
                        <p className="font-mono text-[#3e2723] text-sm sm:text-lg leading-relaxed italic font-bold">
                          {detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <button onClick={() => setIsExplaining(false)} className="w-full mt-8 py-5 sm:py-6 bg-[#3e2723] text-[#e6dccb] font-black rounded-xl sm:rounded-[3rem] uppercase tracking-widest text-xs sm:text-sm border-b-8 border-black active:translate-y-1 shadow-xl hover:bg-black transition-colors">Understood</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}