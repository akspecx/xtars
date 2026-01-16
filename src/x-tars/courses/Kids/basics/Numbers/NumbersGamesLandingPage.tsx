import React, { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  useNavigate, 
  useParams 
} from 'react-router-dom';
import {
  ChevronRight, BrainCircuit, Lightbulb, 
  ChevronLeft, Info, Calculator, Target, Star, Rocket
} from 'lucide-react';
import NumberGameCard from "../../../CommonUtility/CardsUtility"

const USER_NAME = "Prabhat"; 

const numberGameData = [
    // Core numbers games
    { id: "Introduction", title: "Starting with the numbers ✅", subtitle: "Introduction to the numbers", icon: "1️⃣2️⃣3️⃣", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/introduction" },
    { id: "Association", title: "Associate objects to a number ✅", subtitle: "How many objects are there?", icon: "🤗", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/association" },
    { id: "identification", title: "Match the Correct Numbers ✅", subtitle: "Identify and match numbers with the correct apple groups", icon: "🍎", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/identification" },
    { id: "counting", title: "Count On Your Body", subtitle: "Learn numbers with body-part examples", icon: "🤗", gradient: "from-rose-500 to-amber-500", path: "/games/numbers/counting" },
    { id: "tracing", title: "Trace the Numbers ✅", subtitle: "Practice drawing numbers with dotted guides", icon: "✍️", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/tracing" },
    { id: "sequence", title: "Number Train Sequence ✅", subtitle: "Arrange train coaches in the correct order", icon: "🚂", gradient: "from-orange-500 to-amber-500", path: "/games/numbers/sequence" },
    { id: "filltheblank", title: "Fill in the Blanks", subtitle: "Drag and drop the missing numbers", icon: "1️⃣_3️⃣", gradient: "from-lime-500 to-green-500", path: "/games/numbers/fill-the-blanks" },
    { id: "descending", title: "Descending Order Train", subtitle: "Place the train coaches in descending order", icon: "3️⃣2️⃣1️⃣", gradient: "from-cyan-500 to-blue-500", path: "/games/numbers/descending" },
  
    // Age 3–4: early number sense
    { id: "dot-dash", title: "Dot Dash Rockets", subtitle: "Subitize 1–5 dots (Age 3–4)", icon: "🚀", gradient: "from-sky-500 to-indigo-500", path: "/games/numbers/dot-dash-rockets" },
    { id: "ladybug", title: "Ladybug Spots Match", subtitle: "Match spots to numbers (Age 3–4)", icon: "🐞", gradient: "from-emerald-500 to-lime-500", path: "/games/numbers/ladybug-spots" },
    { id: "cleanup", title: "Clean-Up Count", subtitle: "Sort toys and count them (Age 3–4)", icon: "🧸", gradient: "from-teal-500 to-cyan-500", path: "/games/numbers/cleanup-count" },
    { id: "more", title: "Learn what is More ✅", subtitle: "Which one is more? (Age 3–4)", icon: "🧺", gradient: "from-amber-500 to-rose-500", path: "/games/numbers/more" },
    { id: "less", title: "Learn what is Less ✅", subtitle: "Find the less? (Age 3–4)", icon: "🧺", gradient: "from-amber-500 to-rose-500", path: "/games/numbers/less" },
    { id: "zero-hero", title: "Zero the Hero", subtitle: "Learn about zero (Age 3–4)", icon: "🦸", gradient: "from-purple-500 to-pink-500", path: "/games/numbers/zero-hero" },
    { id: "pizza-party", title: "Pizza Party Sharing", subtitle: "Share pizza fairly (Age 3–4)", icon: "🍕", gradient: "from-orange-500 to-red-500", path: "/games/numbers/pizza-party" },
    { id: "coin-collector", title: "Coin Collector", subtitle: "Sort and recognize coins (Age 3–4)", icon: "🪙", gradient: "from-yellow-500 to-amber-500", path: "/games/numbers/coin-collector" },
    { id: "understanding-equal", title: "Understanding Equal ✅", subtitle: "Learn about equal numbers (Age 3–4)", icon: "=", gradient: "from-blue-500 to-indigo-500", path: "/games/numbers/understanding-equal" },
  
    // Age 4–5: ordering, patterns, sharing
    { id: "bridge", title: "Number Bridge Builder", subtitle: "Fill missing stones on the number line (Age 4–5)", icon: "🌉", gradient: "from-blue-500 to-cyan-500", path: "/games/numbers/number-bridge" },
    { id: "pattern-train", title: "Pattern Train Cars", subtitle: "Complete colorful train patterns (Age 4–5)", icon: "🚃", gradient: "from-fuchsia-500 to-purple-500", path: "/games/numbers/pattern-train-cars" },
    { id: "snack-sharing", title: "Snack Sharing Party", subtitle: "Share snacks fairly between friends (Age 4–5)", icon: "🧁", gradient: "from-rose-500 to-orange-500", path: "/games/numbers/snack-sharing-party" },
    { id: "ordinal-race", title: "Ordinal Race Track", subtitle: "Learn 1st, 2nd, 3rd positions (Age 4–5)", icon: "🏁", gradient: "from-blue-500 to-purple-500", path: "/games/numbers/ordinal-race" },
    { id: "shape-puzzles", title: "Shape Number Puzzles", subtitle: "Count sides and corners (Age 4–5)", icon: "🔷", gradient: "from-purple-500 to-pink-500", path: "/games/numbers/shape-puzzles" },
    { id: "clock-time", title: "Clock Tower Time", subtitle: "Learn to tell time by hour (Age 4–5)", icon: "🕐", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/clock-time" },
    { id: "number-detective", title: "Number Detective", subtitle: "Find numbers in real-world scenes (Age 4–5)", icon: "🔍", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/number-detective" },
  
    // Age 5–6: addition, number bonds, measurement
    { id: "ten-frame", title: "Ten-Frame Garden", subtitle: "Plant seeds in a ten-frame (Age 5–6)", icon: "🌼", gradient: "from-emerald-500 to-lime-500", path: "/games/numbers/ten-frame-garden" },
    { id: "add-animals", title: "Add the Animals", subtitle: "Count how many animals altogether (Age 5–6)", icon: "🐑", gradient: "from-sky-500 to-emerald-500", path: "/games/numbers/add-the-animals" },
    { id: "bonds", title: "Number Bonds Bubbles", subtitle: "Find pairs that make a target number (Age 5–6)", icon: "💭", gradient: "from-cyan-500 to-indigo-500", path: "/games/numbers/number-bonds-bubbles" },
    { id: "jumping-frogs", title: "Jumping Frogs", subtitle: "Skip-count by 2s and 5s (Age 5–6)", icon: "🐸", gradient: "from-green-500 to-teal-500", path: "/games/numbers/jumping-frogs" },
    { id: "fill-bucket", title: "Fill the Bucket", subtitle: "Experiment with scoops and capacity (Age 5–6)", icon: "🪣", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/fill-the-bucket" },
    { id: "subtract-snacks", title: "Subtract the Snacks", subtitle: "Learn subtraction by eating snacks (Age 5–6)", icon: "🍪", gradient: "from-orange-500 to-red-500", path: "/games/numbers/subtract-snacks" },
    { id: "measure-monsters", title: "Measure the Monsters", subtitle: "Compare heights using blocks (Age 5–6)", icon: "📏", gradient: "from-green-500 to-teal-500", path: "/games/numbers/measure-monsters" },
    { id: "number-jumper", title: "Number Line Jumper", subtitle: "Jump forward and backward (Age 5–6)", icon: "🦘", gradient: "from-lime-500 to-green-500", path: "/games/numbers/number-jumper" }
  ];

const MOTIVATIONAL_QUOTES = [
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Education is what remains after one has forgotten what one has learned in school.", author: "Albert Einstein" },
  { text: "Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr." }
];


const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
    <motion.div 
      animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0], x: [-10, 10, -10] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle_at_center,_#ffffff_0%,_transparent_60%)] blur-[40px]"
    />
  </div>
);

// --- MISSION MODULE: BALANCE SCALE ---

const BalanceScaleMission = () => {
  const navigate = useNavigate();
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
      <div className="bg-[#faf9f6] p-8 sm:p-12 rounded-[4rem] border-2 border-[#c4a484]/20 shadow-[12px_12px_0px_#a88a6d] relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-10 text-[#3e2723]">
            <motion.button 
              whileHover={{ x: -5 }} onClick={() => navigate(-1)}
              className="w-14 h-14 bg-[#3e2723] rounded-2xl flex items-center justify-center text-white shadow-xl border-b-4 border-black"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <div className="text-center">
              <span className="text-[11px] font-black uppercase opacity-60 tracking-[0.5em] mb-2 block">Neural Link Calibration</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter leading-none text-[#3e2723]">Scale Mission</h2>
            </div>
            <button 
              onClick={() => setShowLogic(!showLogic)} 
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl border-b-4 ${showLogic ? 'bg-[#8d6e63] text-white border-[#3e2723]' : 'bg-[#3e2723] text-white border-black'}`}
            >
              <Calculator size={24} />
            </button>
          </div>

          <div className="relative w-full max-w-2xl aspect-[2.2/1] bg-[#231714]/5 rounded-[3rem] p-8 border border-[#c4a484]/20 mb-10 flex items-center justify-center shadow-inner overflow-hidden">
            <svg viewBox="0 0 400 200" className="w-full h-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)]">
              <rect x="180" y="165" width="40" height="15" rx="4" fill="#3e2723" />
              <path d="M 200 160 L 200 60" stroke="#3e2723" strokeWidth="10" strokeLinecap="round" />
              <motion.g animate={{ rotate: isCorrect ? 0 : [0, -1.2, 1.2, 0] }} transition={{ duration: 5, repeat: Infinity }}>
                <line x1="80" y1="60" x2="320" y2="60" stroke="#5d4037" strokeWidth="8" strokeLinecap="round" />
                <g transform="translate(80, 60)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke="#8d6e63" strokeWidth="2" />
                  <path d="M -45 50 Q 0 85 45 50 Z" fill="#dfd7cc" stroke="#3e2723" strokeWidth="2" />
                  <text x="0" y="42" textAnchor="middle" fontSize="26" className="pointer-events-none select-none">🍎🍎🍎🍎🍎</text>
                </g>
                <g transform="translate(320, 60)">
                  <line x1="0" y1="0" x2="0" y2="50" stroke="#8d6e63" strokeWidth="2" />
                  <path d="M -45 50 Q 0 85 45 50 Z" fill="#dfd7cc" stroke="#3e2723" strokeWidth="2" />
                  <rect x="-25" y="15" width="50" height="35" rx="6" fill="#3e2723" />
                  <text x="0" y="38" textAnchor="middle" fontSize="16" fontWeight="900" fill="white">{String(totalWeight)}g</text>
                </g>
              </motion.g>
            </svg>
          </div>

          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <p className="text-sm font-black uppercase text-[#8d6e63] tracking-[0.2em] text-center italic">Determine individual unit weight</p>
            <div className="flex w-full gap-4">
              <input 
                type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="---"
                className={`flex-1 bg-white border-2 rounded-[1.5rem] px-6 py-4 text-3xl font-black text-center focus:outline-none transition-all shadow-inner ${isCorrect === true ? 'border-emerald-500 text-emerald-600 shadow-xl' : isCorrect === false ? 'border-rose-500 animate-shake' : 'border-[#c4a484]/30 text-[#3e2723]'}`}
              />
              <motion.button whileTap={{ scale: 0.95 }} onClick={handleCheck} className="bg-[#3e2723] text-white px-10 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-[0_6px_0_#000] active:translate-y-1 active:shadow-none transition-all">Validate</motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Numerical Logic Feed with documentation strings */}
      <AnimatePresence>
        {showLogic && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-[#3e2723] text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden border-b-8 border-black">
             <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12"><BrainCircuit size={160} /></div>
             <div className="flex items-center gap-4 mb-10"><Info className="text-amber-400" /><h3 className="text-xl font-black uppercase tracking-widest leading-none">Neural Logic Feed</h3></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Balance Equality", formula: "Weight Left = Weight Right", desc: "Total weight on right scale = Total weight of left scale as it is balanced scale." },
                  { label: "Multiplication Formula", formula: "$$5 \\times unit = 500g$$", desc: "Number of fruits multiplied by weight of one apple equals 500 grams." },
                  { label: "Division Logic", formula: "$$Weight = 500g \\div 5$$", desc: "Therefore, the weight of one apple equals the total weight divided by the number of apples." }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/5 p-7 rounded-[2.5rem] border border-white/10 group hover:bg-white/10 transition-colors">
                    <span className="text-[10px] font-black uppercase text-amber-400 mb-2 block tracking-widest leading-none">Phase 0{idx + 1}</span>
                    <h4 className="text-sm font-black uppercase mb-1">{String(item.label)}</h4>
                    <div className="text-lg font-black text-white mb-4 leading-tight">{String(item.formula)}</div>
                    <p className="text-[11px] font-medium opacity-60 leading-relaxed italic group-hover:opacity-100 transition-opacity">"{String(item.desc)}"</p>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- PRIMARY HUB COMPONENT ---

export default function NumbersGamesLandingPage() {
  const navigate = useNavigate();
  const { puzzleId } = useParams();
  const [quoteIndex, setQuoteIndex] = useState(0);

  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return `Rise and shine, ${USER_NAME}!`;
    if (hour < 17) return `Good afternoon, ${USER_NAME}!`;
    return `Good evening, ${USER_NAME}!`;
  }, []);

  useEffect(() => {
    const qInterval = setInterval(() => setQuoteIndex(p => (p + 1) % MOTIVATIONAL_QUOTES.length), 10000);
    return () => clearInterval(qInterval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen">
      {/* Wooden Pattern Overlay as requested */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
      
      {/* Soft Ambient Light layer */}
      <AuroraBackground />

      <div className="w-full max-w-7xl p-6 sm:p-10 relative z-10">
        <AnimatePresence mode="wait">
          {!puzzleId ? (
            /* HUB VIEW */
            <motion.div key="hub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-10 pb-24">
              
              {/* Header Plank Tile */}
              <div className="bg-[#faf9f6] p-10 sm:p-16 rounded-[4rem] border-2 border-[#c4a484]/30 shadow-[10px_10px_0px_#a88a6d,15px_15px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                   <div className="text-center md:text-left max-w-2xl text-[#3e2723]">
                      <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                         <div className="p-3 bg-[#3e2723] rounded-2xl text-white shadow-xl"><Target size={24} /></div>
                         <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none">{String(dynamicGreeting)}</h2>
                      </div>
                      <p className="text-sm sm:text-lg font-bold uppercase tracking-[0.4em] leading-relaxed opacity-60">
                        Operational intelligence required. Select a cognitive module to initiate calibration.
                      </p>
                   </div>
                   <div className="flex items-center gap-6 shrink-0 bg-[#3e2723] p-8 rounded-[3rem] text-white shadow-2xl border-b-8 border-black">
                      <div className="text-center">
                        <span className="text-[11px] font-black uppercase block mb-2 tracking-widest opacity-40">Active Links</span>
                        <span className="text-5xl font-black tabular-nums">{String(numberGameData.length)}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Game Tiles Grid using provided Full-Paths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                 {numberGameData.map((game) => (
                   <NumberGameCard 
                    key={String(game.id)} 
                    {...game} 
                    onClick={() => navigate(game.path)} 
                   />
                 ))}
              </div>
            </motion.div>
          ) : (
            /* MISSION VIEW (Placeholder logic for demonstration) */
            <BalanceScaleMission key="game" />
          )}
        </AnimatePresence>

        {!puzzleId && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-20 bg-[#3e2723]/5 backdrop-blur-sm p-12 sm:p-20 rounded-[5rem] border-4 border-dashed border-[#c4a484]/40 flex flex-col items-center text-center relative overflow-hidden z-10 group">
            <Lightbulb className="text-[#c4a484] opacity-50 mb-12 w-20 h-20 group-hover:scale-110 transition-transform duration-1000" />
            <AnimatePresence mode="wait">
              <motion.div key={quoteIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-5xl px-6">
                 <p className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#3e2723] leading-tight mb-10 italic drop-shadow-sm">"{String(MOTIVATIONAL_QUOTES[quoteIndex].text)}"</p>
                 <div className="flex items-center justify-center gap-5 text-[#c4a484]">
                    <div className="w-20 h-[2px] bg-current opacity-30" />
                    <span className="text-xs sm:text-base font-black uppercase tracking-[0.8em]">
                       — {String(MOTIVATIONAL_QUOTES[quoteIndex].author)}
                    </span>
                    <div className="w-20 h-[2px] bg-current opacity-30" />
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