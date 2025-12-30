import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Sparkles, Star, Zap,
  ChevronRight, Rocket, Sparkle, BrainCircuit, Globe, 
  Lightbulb, Puzzle, ChevronLeft, HelpCircle, Scale,
  CheckCircle2, Info, Calculator, Target, Activity
} from 'lucide-react';

const USER_NAME = "Alexander"; 

// --- PUZZLE DATA SOURCE ---
const PUZZLES_DATA = [
  { 
    id: 'numerical-logic', 
    title: 'Numerical Logic', 
    icon: '🔢', 
    progress: 65, 
    count: '12 Missions',
    type: 'numeric',
    rating: 4.8,
    desc: 'Solve complex numerical sequences and magic grids.',
    subModules: [
      { id: 'sudoku-basic', title: 'Sudoku Basic', icon: '🧩', progress: 100, difficulty: 'Novice', rating: 4.5 },
      { id: 'magic-squares', title: 'Magic Squares', icon: '🔮', progress: 45, difficulty: 'Expert', rating: 4.9 },
      { id: 'sequence-flow', title: 'Sequence Flow', icon: '🌊', progress: 10, difficulty: 'Advanced', rating: 4.7 }
    ]
  },
  { 
    id: 'geometric-flux', 
    title: 'Geometric Flux', 
    icon: '📐', 
    progress: 30, 
    count: '8 Missions',
    type: 'geometric',
    rating: 4.7,
    desc: 'Master spatial reasoning through angle and area flux.',
    subModules: [
      { id: 'angle-master', title: 'Angle Master', icon: '🏹', progress: 60, difficulty: 'Intermediate', rating: 4.6 },
      { id: 'area-legend', title: 'Area Legend', icon: '🗺️', progress: 0, difficulty: 'Advanced', rating: 4.8 }
    ]
  },
  { 
    id: 'algebraic-scales', 
    title: 'Algebraic Scales', 
    icon: '⚖️', 
    progress: 85, 
    count: '15 Missions',
    type: 'algebraic',
    rating: 4.9,
    desc: 'Balance the scales of equality using algebraic logic.',
    subModules: [
      { id: 'equation-balance', title: 'Equation Balance', icon: '🍎', progress: 90, difficulty: 'Master', rating: 5.0 },
      { id: 'variable-hunt', title: 'Variable Hunt', icon: '🔍', progress: 70, difficulty: 'Novice', rating: 4.4 }
    ]
  }
];

const MOTIVATIONAL_QUOTES = [
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Education is what remains after one has forgotten what one has learned in school.", author: "Albert Einstein" },
  { text: "Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr." }
];

// --- KINETIC THEMATIC BACKGROUNDS ---

const NumericBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
    {['1', '0', '7', '3', '5'].map((num, i) => (
      <motion.span
        key={i} className="absolute text-3xl font-black text-white"
        initial={{ y: '110%', x: `${i * 25}%`, opacity: 0 }}
        animate={{ y: '-10%', opacity: [0, 1, 0] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
      >{num}</motion.span>
    ))}
  </div>
);

const GeometricBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
    <motion.div
      animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] border-[1px] border-dashed border-white rounded-full"
    />
  </div>
);

const AlgebraicBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.12]">
    {['x', 'y', 'z', '=', '÷'].map((sym, i) => (
      <motion.span
        key={i} className="absolute text-2xl font-black text-white"
        animate={{ x: [Math.random()*100+'%', Math.random()*100+'%'], y: [Math.random()*100+'%', Math.random()*100+'%'], rotate: [0, 360] }}
        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
      >{sym}</motion.span>
    ))}
  </div>
);

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.1]">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0], x: [-10, 10, -10] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_60%)] blur-[40px]"
    />
  </div>
);

// --- MISSION CARD ---

const MissionCard = memo(({ id, title, icon, subtitle, progress, onClick, type, difficulty, rating, desc }) => {
  const renderBackground = () => {
    switch(type) {
      case 'numeric': return <NumericBackground />;
      case 'geometric': return <GeometricBackground />;
      case 'algebraic': return <AlgebraicBackground />;
      default: return <AuroraBackground />;
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.01 }}
      onClick={() => onClick && onClick(id)}
      className="flex flex-col bg-[#faf9f6] rounded-[2.5rem] border border-[#c4a484]/20 shadow-sm hover:shadow-2xl transition-all cursor-pointer group overflow-hidden h-full min-h-[380px]"
    >


      <div className="relative h-48 bg-[#231714] flex items-center justify-center overflow-hidden">
        {renderBackground()}

        
        <div className="absolute inset-0 bg-gradient-to-t from-[#231714]/90 via-transparent to-black/10 z-10" />
        
        <div className="absolute top-5 right-5 z-30 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-white/10 shadow-lg">
          <Star size={10} className="fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-black text-white tabular-nums tracking-tighter">{String(rating || '5.0')}</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-[0.1] group-hover:opacity-[0.18] transition-opacity duration-1000 blur-[2px]">
           <span className="text-[160px] select-none scale-125 transform group-hover:scale-100 transition-transform duration-1000">{icon}</span>
        </div>

        <div className="relative z-20 transform group-hover:scale-110 transition-transform duration-500">
           <span className="text-7xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">{icon}</span>
        </div>

        {difficulty && (
          <div className="absolute bottom-5 left-5 z-20 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/5">
             <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">{String(difficulty)}</span>
          </div>
        )}
      </div>

      <div className="p-7 flex flex-col flex-1 relative z-10 shadow-inner">
         <h4 className="text-xl font-black text-[#3e2723] uppercase tracking-tighter mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{String(title)}</h4>
         <p className="text-[12px] font-medium text-[#8d6e63] leading-relaxed opacity-70 mb-6 line-clamp-2">
            {String(desc || subtitle)}
         </p>
         
         <div className="mt-auto pt-5 border-t border-[#c4a484]/10">
            <div className="flex justify-between items-center mb-2 px-1">
               <span className="text-[10px] font-black uppercase opacity-40 tracking-widest text-[#3e2723]">Sector Sync</span>
               <span className="text-[11px] font-black text-[#3e2723] tabular-nums">{String(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-black/[0.04] rounded-full overflow-hidden shadow-inner">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${progress}%` }} 
                 transition={{ duration: 1.5, ease: "circOut" }} 
                 className="h-full bg-indigo-500 rounded-full relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-white/10 animate-pulse" />
               </motion.div>
            </div>
         </div>
      </div>
    </motion.div>
  );
});

// --- CORE GAME MODULE: BALANCE SCALE MISSION ---

const BalanceScaleMission = ({ onBack }) => {
  const [showLogic, setShowLogic] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  const itemCount = 5;
  const totalWeight = 500;
  const correctValue = totalWeight / itemCount;

  const handleCheck = () => {
    if (parseInt(inputValue) === correctValue) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1500);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col gap-6">
      <div className="bg-[#faf9f6] p-8 sm:p-12 rounded-[4rem] border border-[#c4a484]/20 shadow-[12px_12px_0px_rgba(0,0,0,0.01)] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-10">
            <motion.button 
              whileHover={{ x: -5 }} onClick={onBack}
              className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#3e2723] shadow-md border border-black/5"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div className="text-center">
              <span className="text-[11px] font-black uppercase text-[#8d6e63] tracking-[0.5em] mb-2 block opacity-60">Calibration Sub-Sector</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-[#3e2723]">Balance Mission</h2>
            </div>
            <button 
              onClick={() => setShowLogic(!showLogic)} 
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${showLogic ? 'bg-[#3e2723] text-white' : 'bg-white text-[#3e2723]'}`}
            >
              <Calculator size={24} />
            </button>
          </div>

          <div className="relative w-full max-w-2xl aspect-[2.2/1] bg-white/30 backdrop-blur-md rounded-[3rem] p-8 border border-white/60 mb-10 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-2xl">
              <rect x="185" y="160" width="30" height="15" rx="4" fill="#3e2723" />
              <path d="M 200 160 L 200 60" stroke="#3e2723" strokeWidth="8" strokeLinecap="round" />
              <motion.g animate={{ rotate: isCorrect ? 0 : [0, -1, 1, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <line x1="100" y1="60" x2="300" y2="60" stroke="#8d6e63" strokeWidth="6" strokeLinecap="round" />
                <g transform="translate(100, 60)">
                  <line x1="0" y1="0" x2="0" y2="40" stroke="#8d6e63" strokeWidth="2" />
                  <path d="M -40 40 Q 0 60 40 40 Z" fill="#dfd7cc" stroke="#3e2723" strokeWidth="2" />
                  <text x="0" y="32" textAnchor="middle" fontSize="22" className="pointer-events-none">🍎🍎🍎🍎🍎</text>
                </g>
                <g transform="translate(300, 60)">
                  <line x1="0" y1="0" x2="0" y2="40" stroke="#8d6e63" strokeWidth="2" />
                  <path d="M -40 40 Q 0 60 40 40 Z" fill="#dfd7cc" stroke="#3e2723" strokeWidth="2" />
                  <rect x="-20" y="15" width="40" height="25" rx="5" fill="#3e2723" />
                  <text x="0" y="32" textAnchor="middle" fontSize="14" fontWeight="900" fill="white">{String(totalWeight)}g</text>
                </g>
              </motion.g>
            </svg>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <p className="text-xs font-black uppercase text-[#8d6e63] tracking-[0.2em] text-center">Determine weight of one apple</p>
            <div className="flex w-full gap-4">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="---"
                className={`flex-1 bg-white border-2 rounded-[1.5rem] px-6 py-4 text-3xl font-black text-center focus:outline-none transition-all ${isCorrect === true ? 'border-emerald-500 text-emerald-600 shadow-xl' : isCorrect === false ? 'border-rose-500 animate-shake' : 'border-[#c4a484]/30 text-[#3e2723]'}`}
              />
              <button onClick={handleCheck} className="bg-[#3e2723] text-white px-8 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-[0_6px_0_#000]">Validate</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLogic && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-[#3e2723] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit size={140} /></div>
             <div className="flex items-center gap-4 mb-10"><Info className="text-amber-400" /><h3 className="text-xl font-black uppercase tracking-widest leading-none">Numerical Logic Feed</h3></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Balance Equality", formula: "Left = Right", desc: "Since the scale is balanced, then the weight on the left scale should be equal to the weight on the right scale." },
                  { label: "Multiplication Formula", formula: `${itemCount} × unit = ${totalWeight}g`, desc: "So, Number of fruits multiplied by weight of one apple equals total counter-weight." },
                  { label: "Division Logic", formula: `unit = ${totalWeight}g ÷ ${itemCount}`, desc: "Therefore, the weight of one apple equals the total weight divided by the number of apples." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all">
                    <span className="text-[10px] font-black uppercase text-amber-400 mb-2 block tracking-widest leading-none">Step 0{idx + 1}</span>
                    <h4 className="text-sm font-black uppercase mb-1">{String(item.label)}</h4>
                    <p className="text-lg font-black text-white mb-4 leading-tight">{String(item.formula)}</p>
                    <p className="text-[11px] font-medium opacity-60 leading-relaxed italic">"{String(item.desc)}"</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- PRIMARY COMPONENT (APP) ---

export default function App() {
  const [view, setView] = useState('hub'); // 'hub', 'detail', 'mission'
  const [activePuzzleId, setActivePuzzleId] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const selectedPuzzle = useMemo(() => PUZZLES_DATA.find(p => p.id === activePuzzleId), [activePuzzleId]);
  
  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return `Rise and shine, ${USER_NAME}!`;
    if (hour < 17) return `Good afternoon, ${USER_NAME}!`;
    if (hour < 22) return `Good evening, ${USER_NAME}!`;
    return `Hello, Night Wizard ${USER_NAME}!`;
  }, []);

  useEffect(() => {
    const qInterval = setInterval(() => setQuoteIndex(p => (p + 1) % MOTIVATIONAL_QUOTES.length), 10000);
    return () => clearInterval(qInterval);
  }, []);

  // Internal Navigation Handlers
  const openPuzzleDetail = (id) => {
    setActivePuzzleId(id);
    setView('detail');
  };

  const startMission = (subId) => {
    // Note: subId can be used to load specific mission data in the future
    setView('mission');
  };

  const goBackToHub = () => {
    setView('hub');
    setActivePuzzleId(null);
  };

  const goBackToDetail = () => {
    setView('detail');
  };

  return (
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <div className="w-full max-w-7xl p-6 sm:p-10 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'hub' && (
            /* HUB VIEW */
            <motion.div key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20">
              <div className="md:col-span-12 bg-[#faf9f6] p-10 sm:p-16 rounded-[4rem] border border-[#c4a484]/20 shadow-[10px_10px_0px_rgba(0,0,0,0.01)] relative overflow-hidden group">
                <AuroraBackground />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                   <div className="text-center md:text-left max-w-2xl">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                         <div className="p-3 bg-[#3e2723] rounded-2xl text-white shadow-xl"><Rocket size={24} /></div>
                         <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-[#3e2723] leading-none">{String(dynamicGreeting)}</h2>
                      </div>
                      <p className="text-sm sm:text-lg font-bold text-[#8d6e63] uppercase tracking-[0.4em] leading-relaxed opacity-80">
                        Calibration required. Select a cognitive sector to initiate mission sequences.
                      </p>
                   </div>
                   <div className="flex items-center gap-6 shrink-0 bg-white/50 backdrop-blur-md p-8 rounded-[3rem] border border-white shadow-xl">
                      <div className="text-center">
                        <span className="text-[11px] font-black uppercase text-[#8d6e63] block mb-2 tracking-widest opacity-60">Sectors</span>
                        <span className="text-5xl font-black text-[#3e2723] tabular-nums">{String(PUZZLES_DATA.length)}</span>
                      </div>
                   </div>
                </div>
              </div>
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                 {PUZZLES_DATA.map((puzzle) => (
                   <MissionCard 
                    key={puzzle.id} id={puzzle.id} title={puzzle.title} icon={puzzle.icon} 
                    subtitle={puzzle.count} progress={puzzle.progress} rating={puzzle.rating} 
                    desc={puzzle.desc} onClick={openPuzzleDetail} type={puzzle.type} 
                   />
                 ))}
              </div>
            </motion.div>
          )}

          {view === 'detail' && (
            /* DETAIL VIEW */
            <motion.div key="detail" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex flex-col gap-10 pb-20 w-full">
               <div className="bg-[#faf9f6] p-10 sm:p-14 rounded-[4rem] border border-[#c4a484]/20 shadow-[10px_10px_0px_rgba(0,0,0,0.01)] flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                  <div className="flex items-center gap-10 relative z-10">
                     <motion.button whileHover={{ x: -8 }} onClick={goBackToHub} className="w-16 h-16 bg-white border border-[#c4a484]/20 rounded-3xl flex items-center justify-center text-[#3e2723] shadow-xl hover:bg-[#3e2723] hover:text-white transition-all group">
                        <ChevronLeft size={32} />
                     </motion.button>
                     <div>
                        <span className="text-[11px] font-black uppercase text-[#8d6e63] tracking-[0.5em] mb-3 block opacity-60">Sector Sub-Hub</span>
                        <h2 className="text-3xl sm:text-6xl font-black uppercase tracking-tighter text-[#3e2723] flex items-center gap-6 leading-none">
                           <span className="text-5xl">{selectedPuzzle?.icon}</span> {selectedPuzzle?.title}
                        </h2>
                     </div>
                  </div>
                  <div className="bg-[#3e2723] text-white px-12 py-8 rounded-[3rem] shadow-2xl text-center min-w-[200px] relative z-10 border-b-[8px] border-black/30">
                     <span className="text-[11px] font-black uppercase opacity-40 block mb-2 tracking-[0.3em]">Maturity</span>
                     <span className="text-5xl font-black tabular-nums">{selectedPuzzle?.progress}%</span>
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {selectedPuzzle?.subModules.map((sub) => (
                    <MissionCard 
                      key={sub.id} id={sub.id} title={sub.title} icon={sub.icon} 
                      subtitle="Operational Unit" progress={sub.progress} difficulty={sub.difficulty} 
                      rating={sub.rating} onClick={startMission} 
                      type={selectedPuzzle.type} 
                    />
                  ))}
               </div>
            </motion.div>
          )}

          {view === 'mission' && (
            /* MISSION VIEW */
            <BalanceScaleMission key="mission" onBack={goBackToDetail} />
          )}
        </AnimatePresence>

        {view !== 'mission' && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 bg-gradient-to-br from-[#c4a484]/20 to-transparent p-12 sm:p-16 rounded-[4rem] border-4 border-dashed border-[#c4a484]/40 flex flex-col items-center text-center relative overflow-hidden z-10 group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#c4a484]/50 to-transparent" />
            <Lightbulb className="text-[#8d6e63] opacity-20 mb-10 w-16 h-16 group-hover:scale-110 transition-transform duration-1000" />
            <AnimatePresence mode="wait">
              <motion.div key={quoteIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-4xl px-4">
                 <p className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#3e2723] leading-tight mb-8 italic drop-shadow-sm">"{String(MOTIVATIONAL_QUOTES[quoteIndex].text)}"</p>
                 <div className="flex items-center justify-center gap-5">
                    <div className="w-16 h-[2px] bg-[#8d6e63] opacity-30" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.6em] text-[#8d6e63] opacity-60">— {String(MOTIVATIONAL_QUOTES[quoteIndex].author)}</span>
                    <div className="w-16 h-[2px] bg-[#8d6e63] opacity-30" />
                 </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
}