// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
// import PageMeta from "../../components/common/PageMeta";

// export default function Home() {
//   return (
//     <>
//       <PageMeta
//         title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
//         description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
//       />
//       <div className="grid grid-cols-12 gap-4 md:gap-6">
//         <div className="col-span-12 space-y-6 xl:col-span-7">
//           <EcommerceMetrics />

//           <MonthlySalesChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <MonthlyTarget />
//         </div>

//         <div className="col-span-12">
//           <StatisticsChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <DemographicCard />
//         </div>

//         <div className="col-span-12 xl:col-span-7">
//           <RecentOrders />
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect, useRef, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, Timer, X, Trophy, Sparkles, Volume2, VolumeX,
  Eye, HelpCircle, ArrowRightCircle, Gamepad2, Star, Zap,
  LayoutDashboard, Users, TrendingUp, Clock, CreditCard,
  MapPin, Play, BookOpen, ChevronRight, Flame, Target, 
  BarChart3, MousePointerClick, Activity, AlertTriangle,
  Smartphone, Tablet, Monitor, Calendar, History, ShieldCheck,
  ChevronDown, Quote, Heart, Award, Users2, Rocket, BarChart,
  Layers, Filter, Sparkle, BrainCircuit, Globe, Radio, Lightbulb
} from 'lucide-react';

const GAMES_PER_LEVEL = 5;
const USER_NAME = "Alexander"; 

// --- DUMMY DATA ---
const RECENT_MODULES = [
  { id: 1, title: 'Algebraic Balancing', progress: 80, lastDate: '2h ago', icon: '⚖️' },
  { id: 2, title: 'Magic Square Pro', progress: 35, lastDate: 'Yesterday', icon: '🔢' },
  { id: 3, title: 'Nature Path Memory', progress: 100, lastDate: '3 days ago', icon: '🦋' },
];

const PEER_RECOMMENDATIONS = [
  { id: 'r1', title: 'Quantum Circuitry', popularity: 98, icon: '⚛️', tag: 'Top Peer Choice' },
  { id: 'r2', title: 'Fraction Chef', popularity: 92, icon: '🍕', tag: 'Trending' },
  { id: 'r3', title: 'Geometry Architect', popularity: 85, icon: '📐', tag: 'New Skill' },
];

const BADGES = [
  { id: 1, name: 'First Pop', icon: '🎈', status: 'earned', color: 'bg-[#f8d7da]' },
  { id: 2, name: 'Logic Learner', icon: '🧠', status: 'earned', color: 'bg-[#d1ecf1]' },
  { id: 3, name: 'Speed Demon', icon: '⚡', status: 'earned', color: 'bg-[#fff3cd]' },
  { id: 4, name: 'Math Master', icon: '🎓', status: 'locked', color: 'bg-[#e2e3e5]' },
  { id: 5, name: 'Galaxy King', icon: '👑', status: 'locked', color: 'bg-[#e2e3e5]' },
];

const NEW_ARRIVALS = [
  { id: 1, title: 'Quantum Logic', desc: 'Basics of logic gates.', color: 'from-indigo-600 to-indigo-800', subRate: '82%', views: '12.4k' },
  { id: 2, title: 'Geometry Dash', desc: 'Master angles & area.', color: 'from-emerald-600 to-emerald-800', subRate: '65%', views: '48.2k' },
  { id: 3, title: 'Fraction Pizza', desc: 'Delicious slicing math.', color: 'from-rose-600 to-rose-800', subRate: '91%', views: '8.1k' },
];

const MOTIVATIONAL_QUOTES = [
  { text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle" },
  { text: "Education is what remains after one has forgotten what one has learned in school.", author: "Albert Einstein" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Intelligence plus character - that is the goal of true education.", author: "Martin Luther King Jr." }
];

const MEMORY_CONFIG = [
  { id: 1, name: 'Animal Friends', count: 1, icons: ['🐶', '🐱', '🐰', '🐼'], theme: 'bg-rose-500' },
  { id: 2, name: 'Fruit Harvest', count: 2, icons: ['🍎', '🍌', '🍉', '🍓'], theme: 'bg-orange-500' },
  { id: 3, name: 'Nature Path', count: 3, icons: ['🦋', '🌻', '🌈', '🍄'], theme: 'bg-amber-500' },
  { id: 4, name: 'Super Shapes', count: 4, icons: ['⭐️', '💎', '🎨', '🚀'], theme: 'bg-emerald-500' },
  { id: 5, name: 'Space Voyage', count: 5, icons: ['🚀', '🪐', '👽', '☄️'], theme: 'bg-sky-500' },
  { id: 6, name: 'Magic Kingdom', count: 6, icons: ['🧙‍♂️', '🏰', '🐉', '🔮'], theme: 'bg-violet-500' }
];

const RAINBOW_ROWS = ['bg-[#ff5d8f]', 'bg-[#ff9e00]', 'bg-[#ffd60a]', 'bg-[#38b000]', 'bg-[#00b4d8]'];

// --- ADVANCED UI TRENDS: ANIMATED BACKGROUNDS ---

const AuroraBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 90, 0],
        x: [-20, 20, -20],
        y: [-20, 20, -20]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#8d6e63_0%,_transparent_50%)] blur-[60px]"
    />
  </div>
);

const ScanningPulse = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div 
      initial={{ y: "-100%" }}
      animate={{ y: "200%" }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="w-full h-[50%] bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent skew-y-12"
    />
  </div>
);

// --- UI SUB-COMPONENTS ---

const StatCard = memo(({ title, value, sub, icon: Icon, trend, color = "text-[#3e2723]" }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-[#faf9f6] p-6 rounded-[2.5rem] border border-[#c4a484]/20 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] flex flex-col gap-1 relative overflow-hidden group"
  >
    <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700 group-hover:scale-125">
      {Icon && <Icon size={120} />}
    </div>
    <span className="text-[9px] font-black uppercase text-[#8d6e63] tracking-[0.2em]">{title}</span>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${color} tracking-tighter tabular-nums`}>{value}</span>
      {trend !== undefined && (
        <span className={`text-[10px] font-black flex items-center ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
    <span className="text-[9px] font-bold text-[#a88a6d] uppercase opacity-60">{sub}</span>
  </motion.div>
));

const CognitiveMetricCircles = memo(({ pace, accuracy, logic }) => {
  const size = 220;
  const center = size / 2;
  const strokeWidth = 14;

  const CircleRing = ({ radius, value, color, label }) => (
    <g className="group cursor-help">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} strokeOpacity="0.2" />
      <motion.circle 
        cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: value / 100,
          strokeWidth: [strokeWidth, strokeWidth + 2, strokeWidth] 
        }}
        transition={{ 
          pathLength: { duration: 2, ease: "circOut" },
          strokeWidth: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ originX: "50%", originY: "50%", rotate: -90, filter: `drop-shadow(0px 0px 8px ${color}44)` }}
      />
      <text x={center + radius + strokeWidth + 5} y={center + 3} fontSize="8" fontWeight="900" fill={color} 
        className="uppercase opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {label}: {value}%
      </text>
    </g>
  );

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-[#faf9f6] rounded-[3rem] shadow-inner border border-black/5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-tr from-black/[0.01] to-transparent pointer-events-none" />
      <svg width={size} height={size} className="overflow-visible filter drop-shadow-xl">
        <CircleRing radius={85} value={accuracy} color="#10b981" label="Accuracy" />
        <CircleRing radius={65} value={pace} color="#4f46e5" label="Pace" />
        <CircleRing radius={45} value={logic} color="#f59e0b" label="Logic" />
        
        <motion.g animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 4, repeat: Infinity }}>
          <text x={center} y={center - 8} textAnchor="middle" fontSize="10" fontWeight="900" fill="#8d6e63" className="uppercase tracking-[0.2em]">System</text>
          <text x={center} y={center + 18} textAnchor="middle" fontSize="28" fontStyle="italic" fontWeight="900" fill="#3e2723" className="tabular-nums">
            {Math.round((pace + accuracy + logic) / 3)}%
          </text>
        </motion.g>
      </svg>
      
      <div className="flex gap-5 mt-8 border-t border-black/5 pt-6 w-full justify-center">
         <div className="flex items-center gap-2 flex-col group"><div className="w-6 h-1 rounded-full bg-[#10b981] group-hover:w-8 transition-all" /><span className="text-[7px] font-black uppercase opacity-60 text-[#3e2723]">Accuracy</span></div>
         <div className="flex items-center gap-2 flex-col group"><div className="w-6 h-1 rounded-full bg-[#4f46e5] group-hover:w-8 transition-all" /><span className="text-[7px] font-black uppercase opacity-60 text-[#3e2723]">Pace</span></div>
         <div className="flex items-center gap-2 flex-col group"><div className="w-6 h-1 rounded-full bg-[#f59e0b] group-hover:w-8 transition-all" /><span className="text-[7px] font-black uppercase opacity-60 text-[#3e2723]">Logic</span></div>
      </div>
    </div>
  );
});

const PeerStandingGauge = memo(({ percentile }) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#3e2723] to-[#1a0f0d] rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full border-b-[10px] border-black group">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000" />
    <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-4 z-10">Global Peer Calibration</span>
    <div className="relative z-10">
      <svg width="140" height="80" viewBox="0 0 100 50">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" strokeLinecap="round" />
        <motion.path 
          initial={{ pathLength: 0 }} animate={{ pathLength: percentile / 100 }} transition={{ duration: 2.5, ease: "circOut" }}
          d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round"
          className="filter drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
        />
      </svg>
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }} className="text-4xl font-black tabular-nums tracking-tighter">Top {100 - percentile}%</motion.span>
      </div>
    </div>
    <div className="mt-6 flex items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 z-10 hover:bg-white/10 transition-colors cursor-default">
       <Globe size={12} className="text-amber-400 animate-pulse" />
       <span className="text-[9px] font-black uppercase tracking-widest text-amber-200">World Rank: #482</span>
    </div>
  </div>
));

const CustomAreaChart = memo(({ data }) => {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i * (100 / (data.length - 1)))},${100 - (v / max * 80)}`).join(' ');
  const fillPoints = `0,100 ${points} 100,100`;
  return (
    <div className="relative w-full h-32 mt-6 group">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full filter drop-shadow-lg">
        <defs>
          <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8d6e63" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8d6e63" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="url(#areaGrad)" points={fillPoints} />
        <motion.polyline 
          initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }}
          fill="none" stroke="#8d6e63" strokeWidth="3" strokeLinecap="round" points={points} 
        />
        <motion.line 
          x1="0" y1="0" x2="0" y2="100" stroke="rgba(141,110,99,0.2)" strokeWidth="0.5"
          animate={{ x1: [0, 100, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
});

const DonutChart = memo(({ data }) => {
  let offset = 0;
  return (
    <div className="relative flex items-center justify-center">
      <svg width="150" height="150" viewBox="0 0 42 42" className="filter drop-shadow-2xl">
        {data.map((item, i) => {
          const strokeDasharray = `${item.value} ${100 - item.value}`;
          const strokeDashoffset = 100 - offset + 25;
          offset += item.value;
          return (
            <circle key={i} cx="21" cy="21" r="15.915" fill="transparent" stroke={item.color} strokeWidth="7" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000" />
          );
        })}
        <circle cx="21" cy="21" r="11" fill="#faf9f6" className="shadow-inner" />
      </svg>
      <div className="absolute text-center flex flex-col">
         <span className="text-lg font-black text-[#3e2723] leading-none">88%</span>
         <span className="text-[7px] font-black uppercase opacity-40">Mobile</span>
      </div>
    </div>
  );
});

// --- MAIN APPLICATION ---

export default function App() {
  const [view, setView] = useState('dashboard'); 
  const [role, setRole] = useState('user'); 
  const [adIndex, setAdIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  // --- Game State ---
  const [levelIdx, setLevelIdx] = useState(0);
  const [gameIdx, setGameIdx] = useState(0); 
  const [time, setTime] = useState(0);
  const [memoryTargets, setMemoryTargets] = useState([]);
  const [foundTargets, setFoundTargets] = useState([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [errorCell, setErrorCell] = useState(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);

  const currentLevel = MEMORY_CONFIG[levelIdx];

  // Simulated logic for return gap (Long time no see)
  const isReturnAfterLongTime = useMemo(() => false, []); // Toggle this to true to see formal greeting

  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    let prefix = "Welcome back";
    
    if (isReturnAfterLongTime) return `Welcome back to Station Alpha, ${USER_NAME}. It is excellent to see you again.`;

    if (hour >= 4 && hour < 12) prefix = "Rise and shine";
    else if (hour >= 12 && hour < 17) prefix = "Good afternoon";
    else if (hour >= 17 && hour < 22) prefix = "Good evening";
    else prefix = "Hello, Night Wizard";

    return `${prefix}, ${USER_NAME}!`;
  }, [isReturnAfterLongTime]);

  useEffect(() => {
    const interval = setInterval(() => setAdIndex((p) => (p + 1) % NEW_ARRIVALS.length), 6000);
    const qInterval = setInterval(() => setQuoteIndex(p => (p + 1) % MOTIVATIONAL_QUOTES.length), 10000);
    return () => { clearInterval(interval); clearInterval(qInterval); };
  }, []);

  const startRound = useCallback(() => {
    const config = MEMORY_CONFIG[levelIdx];
    const newTargets = [];
    const availableIndices = Array.from({ length: 25 }, (_, i) => i);
    for (let i = 0; i < config.count; i++) {
      const randomIdx = Math.floor(Math.random() * availableIndices.length);
      const cellIdx = availableIndices.splice(randomIdx, 1)[0];
      const icon = config.icons[Math.floor(Math.random() * config.icons.length)];
      newTargets.push({ index: cellIdx, icon });
    }
    setMemoryTargets(newTargets);
    setFoundTargets([]);
    setIsShowingSequence(true);
    setErrorCell(null);
    setRoundComplete(false);
    setAutoNextTimer(null);
    setTimeout(() => setIsShowingSequence(false), 1200);
  }, [levelIdx]);

  const handlePopClick = (index) => {
    if (isShowingSequence || roundComplete || errorCell !== null) return;
    const target = memoryTargets.find(t => t.index === index);
    if (target) {
      if (!foundTargets.includes(index)) {
        const newFound = [...foundTargets, index];
        setFoundTargets(newFound);
        if (newFound.length === memoryTargets.length) {
          setRoundComplete(true);
          setAutoNextTimer(3);
        }
      }
    } else {
      setErrorCell(index);
      setTimeout(() => { setErrorCell(null); startRound(); }, 800);
    }
  };

  useEffect(() => {
    const t = setInterval(() => setTime(prev => prev + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      const ct = setTimeout(() => setAutoNextTimer(p => p - 1), 1000);
      return () => clearTimeout(ct);
    } else if (autoNextTimer === 0) {
      if (gameIdx < GAMES_PER_LEVEL - 1) {
        setGameIdx(p => p + 1);
        startRound();
      } else {
        setLevelIdx(p => (p + 1) % MEMORY_CONFIG.length);
        setGameIdx(0);
      }
    }
  }, [autoNextTimer, gameIdx, startRound]);

  useEffect(() => { if (view === 'game') startRound(); }, [levelIdx, view, startRound]);

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center bg-[#fdf8f1] font-sans select-none overflow-hidden text-[#5d4037]">
      
      {/* HEADER STATION */}
      <div className="w-full max-w-7xl flex justify-between items-center px-4 py-4 z-[60] bg-white/40 backdrop-blur-lg border-b border-[#c4a484]/20 shadow-sm shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#5d4037] to-[#1a0f0d] rounded-[1.8rem] shadow-2xl flex items-center justify-center text-white border-b-4 border-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {view === 'dashboard' ? <LayoutDashboard size={26} /> : <Gamepad2 size={26} />}
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter leading-none text-[#3e2723]">Station Alpha</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <button 
                onClick={() => { setRole(role === 'user' ? 'admin' : 'user'); setView('dashboard'); }}
                className="bg-white border border-[#c4a484]/20 px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-inner transition-all hover:bg-emerald-50 active:scale-95"
              >
                <ShieldCheck size={14} className={role === 'admin' ? 'text-indigo-600' : 'text-emerald-600'} />
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-[#3e2723]">{role === 'user' ? 'Student Interface' : 'Admin Console'}</span>
                <ChevronDown size={12} className="opacity-40" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-black uppercase opacity-30 tracking-[0.2em]">Session Runtime</span>
            <span className="text-xl font-mono font-black tabular-nums tracking-tighter text-[#3e2723] drop-shadow-sm">{formatTime(time)}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setView(view === 'game' ? 'dashboard' : 'game')}
            className="flex items-center gap-3 bg-[#8d6e63] text-white px-8 py-3.5 rounded-[1.5rem] shadow-[0_6px_0_#3e2723] border border-white/20 font-black uppercase text-xs tracking-widest transition-all"
          >
            {view === 'dashboard' ? <Play size={20} className="fill-current text-amber-300" /> : <LayoutDashboard size={20} />}
            {view === 'dashboard' ? 'Launch Lab' : 'Exit Sector'}
          </motion.button>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div className="flex-1 w-full max-w-7xl overflow-y-auto no-scrollbar p-6 bg-[#e6dccb] relative shadow-inner">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pb-20">
              
              {role === 'user' ? (
                /* --- BENCHMARK STUDENT DASHBOARD V9 (INNOVATIVE UI) --- */
                <>
                  {/* 1. PERSONAL MESSAGE PANEL */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="lg:col-span-12 bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[10px_10px_0px_rgba(0,0,0,0.015)] flex flex-col md:flex-row justify-between items-center gap-6 overflow-hidden relative group"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.04] -rotate-12 group-hover:scale-110 transition-transform duration-1000"><BrainCircuit size={180} /></div>
                    <div className="relative z-10">
                       <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-[#3e2723] mb-1">{dynamicGreeting}</h2>
                       <p className="text-sm font-bold text-[#8d6e63] uppercase tracking-[0.5em] flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_#10b981]" />
                          LAB CO-PROCESSOR INITIALIZED & READY
                       </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-6 bg-[#fdf8f1] px-10 py-6 rounded-[3rem] border border-[#c4a484]/30 shadow-inner relative overflow-hidden group/rank">
                       <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent translate-x-[-100%] group-hover/rank:translate-x-[100%] transition-transform duration-1000" />
                       <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-xl border-2 border-white relative z-10"><Star fill="currentColor" size={28} /></div>
                       <div className="flex flex-col relative z-10">
                          <span className="text-2xl font-black text-[#3e2723] leading-none">Gold Elite</span>
                          <span className="text-[10px] font-black uppercase opacity-40 tracking-widest mt-1">Growth Matrix V.4</span>
                       </div>
                    </motion.div>
                  </motion.div>

                  {/* 2. TELEMETRY PANEL (Stability & Brain Dynamics) */}
                  <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-4 bg-[#faf9f6] p-8 rounded-[3rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden relative">
                     <div className="absolute -bottom-10 -right-10 opacity-[0.02]"><Zap size={160} /></div>
                     <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm"><Flame className="text-rose-500" size={24} /></div>
                           <h3 className="text-sm font-black uppercase text-[#3e2723] tracking-widest">Stability Pulse</h3>
                        </div>
                        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] font-black bg-[#3e2723] text-white px-4 py-1.5 rounded-full tracking-widest uppercase shadow-lg">STREAK: 5D</motion.span>
                     </div>
                     <div className="grid grid-cols-7 gap-2 mb-10 px-1 relative z-10">
                        {['M','T','W','T','F','S','S'].map((day, i) => (
                          <div key={day+i} className="flex flex-col items-center gap-2">
                             <div className={`w-full aspect-square rounded-[1.1rem] shadow-inner border-2 flex items-center justify-center transition-all relative overflow-hidden ${i < 5 ? 'bg-[#3e2723] border-black/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-white border-[#c4a484]/10 opacity-30 grayscale'}`}>
                                {i === 4 && <motion.div animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-amber-400 rounded-full" />}
                                {i < 5 ? <Zap size={18} fill="currentColor" className="relative z-10" /> : <div className="w-2 h-2 rounded-full bg-current opacity-20 relative z-10" />}
                             </div>
                             <span className="text-[10px] font-black opacity-30">{day}</span>
                          </div>
                        ))}
                     </div>
                     <div className="bg-[#fdf8f1] p-6 rounded-[2rem] border border-[#c4a484]/20 relative z-10 shadow-inner overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/[0.03] to-transparent" />
                        <div className="flex justify-between items-end mb-3 relative z-10">
                           <p className="text-[10px] font-black uppercase text-[#8d6e63] tracking-widest">Neural Retention</p>
                           <span className="text-xs font-black text-[#3e2723]">82%</span>
                        </div>
                        <div className="h-2 w-full bg-black/[0.03] rounded-full overflow-hidden relative z-10">
                           <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 2 }} className="h-full bg-gradient-to-r from-rose-500 to-[#3e2723]" />
                        </div>
                     </div>
                  </motion.div>

                  <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-8 bg-[#faf9f6] p-10 rounded-[3rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000"><TrendingUp size={160} /></div>
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm"><Activity className="text-emerald-600 animate-pulse" /></div>
                          <div>
                             <h2 className="text-2xl font-black uppercase tracking-tighter text-[#3e2723]">Brain Load Dynamics</h2>
                             <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-[0.2em]">Live Cognitive Complexity Mapping</p>
                          </div>
                       </div>
                       <motion.div 
                         whileHover={{ scale: 1.05 }}
                         className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl border border-emerald-100 text-[10px] font-black tracking-[0.1em] shadow-sm uppercase cursor-default"
                       >
                         +22% SYNC RATE
                       </motion.div>
                    </div>
                    <CustomAreaChart data={[20, 35, 25, 65, 40, 85, 55, 75, 60, 95]} />
                    <div className="flex justify-between mt-4 text-[10px] font-black uppercase opacity-20 px-10 tracking-[0.8em]"><span>BOOT</span><span>PROCESSING</span><span>OPTIMAL</span></div>
                  </motion.div>

                  {/* 3. ACTIVE MISSION DECK & COGNITIVE EXCELLENCE */}
                  <div className="lg:col-span-8 space-y-8">
                     <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-4 text-[#3e2723]">
                              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm"><Rocket className="text-indigo-600 animate-bounce" size={24} /></div>
                              <div>
                                 <h3 className="text-xl font-black uppercase tracking-widest leading-none">Active Mission Deck</h3>
                                 <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest mt-1">Modules currently in flight</p>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {RECENT_MODULES.map(m => (
                             <motion.div 
                               key={m.id} 
                               whileHover={{ y: -10 }}
                               className="p-8 bg-[#fdf8f1] rounded-[3rem] border border-[#c4a484]/20 shadow-sm hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all cursor-pointer group relative overflow-hidden"
                             >
                                <AuroraBackground />
                                <span className="text-5xl block mb-4 drop-shadow-2xl group-hover:rotate-12 transition-transform relative z-10">{m.icon}</span>
                                <h4 className="text-xs font-black text-[#3e2723] uppercase tracking-tighter truncate relative z-10">{m.title}</h4>
                                <p className="text-[9px] font-bold text-[#a88a6d] mt-1 mb-8 uppercase opacity-60 tracking-widest relative z-10">{m.lastDate}</p>
                                <div className="flex flex-col gap-2 mb-6 relative z-10">
                                   <div className="flex justify-between items-center px-1">
                                      <span className="text-[8px] font-black uppercase opacity-30">Status</span>
                                      <span className="text-[10px] font-black">{m.progress}%</span>
                                   </div>
                                   <div className="h-1.5 bg-black/[0.03] rounded-full overflow-hidden shadow-inner">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-indigo-500 rounded-full" />
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </motion.div>

                     {/* PEER FAVORITES */}
                     <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 shadow-sm"><Radio className="text-amber-600 animate-pulse" size={24} /></div>
                              <div>
                                 <h3 className="text-xl font-black uppercase tracking-widest text-[#3e2723] leading-none">Discovery Hub</h3>
                                 <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest mt-1">Peer favorites in your cognitive tier</p>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {PEER_RECOMMENDATIONS.map(item => (
                             <motion.div 
                               key={item.id} 
                               whileHover={{ y: -10 }}
                               className="p-8 bg-white rounded-[3rem] border border-[#c4a484]/20 shadow-sm hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] transition-all cursor-pointer group relative overflow-hidden"
                             >
                                <ScanningPulse />
                                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform relative z-10">{item.icon}</span>
                                <span className="text-[9px] font-black bg-indigo-600 text-white px-3 py-1 rounded-full mb-3 inline-block uppercase tracking-widest shadow-lg relative z-10">{item.tag}</span>
                                <h4 className="text-xs font-black text-[#3e2723] uppercase tracking-tighter truncate mb-6 relative z-10">{item.title}</h4>
                                <div className="flex flex-col gap-2 relative z-10">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase opacity-30">Global Adoption</span>
                                      <span className="text-[10px] font-black text-emerald-600">{item.popularity}%</span>
                                   </div>
                                   <div className="h-1.5 bg-black/[0.03] rounded-full overflow-hidden shadow-inner">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${item.popularity}%` }} transition={{ duration: 2, ease: "circOut" }} className="h-full bg-emerald-500 rounded-full" />
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </motion.div>
                  </div>

                  {/* COGNITIVE EXCELLENCE */}
                  <div className="lg:col-span-4 flex flex-col gap-8">
                     <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5 }} className="bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] flex flex-col items-center flex-1 justify-center relative group">
                        <div className="absolute top-6 left-6 opacity-[0.05] group-hover:rotate-45 transition-transform duration-1000"><BookOpen size={48} /></div>
                        <h3 className="text-xs font-black uppercase tracking-[0.5em] text-[#8d6e63] mb-12 text-center opacity-60">Neural Profile Matrix</h3>
                        <CognitiveMetricCircles pace={92} accuracy={88} logic={75} />
                        <div className="mt-12 bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-black/[0.03] shadow-inner relative overflow-hidden group/text">
                           <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/20" />
                           <p className="text-[11px] text-[#5d4037]/80 text-center italic font-bold leading-relaxed max-w-[210px]">
                             "{USER_NAME}, your **Pace** is in the top global percentile. Balance logic for total station symmetry."
                           </p>
                        </div>
                     </motion.div>
                     <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                        <PeerStandingGauge percentile={96} />
                     </motion.div>
                  </div>

                  {/* 4. GLOBAL BENCHMARK & HONOR HALL */}
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="lg:col-span-7 bg-gradient-to-br from-[#8d6e63] to-[#3e2723] p-12 rounded-[4rem] shadow-2xl text-white relative overflow-hidden border-b-[12px] border-black/40 flex flex-col justify-between group">
                     <Quote className="absolute top-10 right-10 w-32 h-32 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-1000" />
                     <div className="relative z-10">
                        <div className="flex gap-2 mb-8">
                           {[1,2,3,4,5].map(s => <Star key={s} size={24} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />)}
                        </div>
                        <h3 className="text-4xl font-black uppercase mb-8 tracking-tighter drop-shadow-md">Audit Performance Review</h3>
                        <div className="bg-black/20 backdrop-blur-md p-10 rounded-[3rem] border border-white/10 shadow-2xl relative group/card overflow-hidden">
                           <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="absolute top-0 left-0 w-20 h-full bg-white/5 skew-x-12" />
                           <div className="absolute -left-2 top-12 w-4 h-12 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
                           <p className="italic text-xl font-medium leading-relaxed opacity-95 tracking-tight text-white/90 relative z-10">"The tactile immersion engine within Station Alpha has accelerated Alexander's cognitive mapping to elite levels."</p>
                           <div className="mt-8 flex items-center gap-4 relative z-10">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20"><Quote size={14} className="text-amber-300" /></div>
                              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400 opacity-60">Global STEM Certification Audit</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>

                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="lg:col-span-5 bg-[#faf9f6] p-10 rounded-[4rem] border border-[#c4a484]/20 shadow-[10px_10px_0px_rgba(0,0,0,0.015)] flex flex-col justify-center relative overflow-hidden group">
                     <div className="flex items-center justify-between mb-12 relative z-10">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-[#3e2723] text-white rounded-2xl shadow-xl"><Trophy size={20} /></div>
                           <h3 className="text-sm font-black uppercase tracking-widest text-[#3e2723]">Honor Cabinet</h3>
                        </div>
                     </div>
                     <div className="grid grid-cols-4 gap-8 px-2 relative z-10">
                        {BADGES.slice(0,4).map((b) => (
                          <div key={b.id} className="flex flex-col items-center gap-4">
                             <motion.div 
                               whileHover={{ scale: 1.15, rotate: 10, y: -5 }}
                               className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.8rem] flex items-center justify-center text-3xl shadow-xl transition-all ${b.status === 'earned' ? `${b.color} grayscale-0 border-b-6 border-black/20` : 'bg-black/5 border-2 border-dashed border-black/10 opacity-20 cursor-not-allowed'}`}
                             >
                                {b.icon}
                                {b.status === 'earned' && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute inset-0 bg-white/30 rounded-[1.8rem]" />}
                             </motion.div>
                             <span className="text-[9px] font-black uppercase tracking-widest opacity-40 text-center leading-tight">{b.name}</span>
                          </div>
                        ))}
                     </div>
                     <button className="mt-12 py-5 bg-[#3e2723] text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-black transition-all relative z-10 border-b-4 border-black/50">Audit Full Cabinet</button>
                  </motion.div>

                  {/* MOTIVATIONAL HERITAGE PLAQUE */}
                  <motion.div 
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                    className="lg:col-span-12 mt-12 bg-gradient-to-br from-[#c4a484]/10 to-transparent p-12 rounded-[3.5rem] border-4 border-dashed border-[#c4a484]/30 flex flex-col items-center text-center relative overflow-hidden"
                  >
                    <Lightbulb className="text-[#8d6e63] opacity-20 mb-8" size={64} />
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={quoteIndex}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="max-w-3xl"
                      >
                         <p className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#3e2723] leading-tight mb-6">
                           "{MOTIVATIONAL_QUOTES[quoteIndex].text}"
                         </p>
                         <span className="text-xs font-black uppercase tracking-[0.5em] text-[#8d6e63]">
                           — {MOTIVATIONAL_QUOTES[quoteIndex].author}
                         </span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                /* --- ADMIN DASHBOARD V4 --- */
                <>
                  <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    <StatCard title="Station Runtime" value="1,280h" sub="+12h TODAY" icon={Clock} trend={8} color="text-[#3e2723]" />
                    <StatCard title="Active Units" value="4,202" sub="GLOBAL REACH" icon={Users} trend={12} color="text-indigo-600" />
                    <StatCard title="Module Return" value="78%" sub="STICKINESS" icon={TrendingUp} trend={3} color="text-emerald-600" />
                    <StatCard title="Acquisition" value="12" sub="FAILED CONV." icon={AlertTriangle} trend={-2} color="text-rose-600" />
                    <StatCard title="Efficiency" value="2.4" sub="AVG ATTEMPTS" icon={Activity} color="text-amber-600" />
                    <StatCard title="Daily Revenue" value="$2.4k" sub="STATION INTAKE" icon={CreditCard} trend={4} />
                  </div>

                  <div className="lg:col-span-12 bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
                     <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-5">
                           <div className="p-4 bg-emerald-50 rounded-3xl border border-emerald-100 shadow-sm"><Rocket className="text-emerald-600" size={28} /></div>
                           <div>
                              <h3 className="text-2xl font-black uppercase tracking-widest text-[#3e2723] leading-none">Market Launch Analytics</h3>
                              <p className="text-xs font-bold text-[#8d6e63] uppercase tracking-widest mt-2 opacity-60">Real-time performance cycle: Q4 Deployment</p>
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {NEW_ARRIVALS.map(item => (
                          <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="p-10 bg-white border border-[#c4a484]/20 rounded-[3.5rem] shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                             <div className={`absolute top-0 left-0 w-2.5 h-full bg-[#8d6e63] group-hover:bg-[#3e2723] transition-colors`} />
                             <h4 className="text-2xl font-black uppercase tracking-tighter mb-2 text-[#3e2723]">{item.title}</h4>
                             <p className="text-[11px] font-bold opacity-50 mb-12 leading-relaxed">{item.desc}</p>
                             <div className="flex items-center justify-between bg-[#fdf8f1] p-6 rounded-[2rem] border border-black/5 shadow-inner">
                                <div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-[#8d6e63] mb-1 opacity-60">Acquisition</p>
                                   <p className="text-3xl font-black text-[#3e2723] tracking-tighter">{item.subRate}</p>
                                </div>
                                <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md border border-black/5"><TrendingUp size={28} className="text-emerald-500" /></motion.div>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <div className="lg:col-span-8 bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
                    <div className="flex justify-between items-center mb-10 border-b border-black/5 pb-8">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100"><Filter className="text-indigo-600" size={24} /></div>
                          <div>
                             <h3 className="text-xl font-black uppercase text-[#3e2723] leading-none tracking-widest">Conversion Intelligence</h3>
                             <p className="text-[10px] font-bold text-[#8d6e63] uppercase tracking-widest mt-1">Interactions vs Subscription Yield</p>
                          </div>
                       </div>
                    </div>
                    <div className="overflow-hidden rounded-[2.5rem] border border-black/5 shadow-inner bg-white">
                       <table className="w-full text-left text-xs">
                         <thead className="bg-[#3e2723] text-white uppercase text-[10px] tracking-[0.3em]">
                           <tr><th className="p-8">Segment</th><th className="p-8 text-center">Engagement</th><th className="p-8 text-center">Conversion</th><th className="p-8 text-right">Heat Index</th></tr>
                         </thead>
                         <tbody className="font-black text-[#5d4037]">
                           {NEW_ARRIVALS.map(item => (
                             <tr key={item.id} className="border-b border-black/5 hover:bg-[#fdf8f1] transition-colors group">
                               <td className="p-8 text-sm group-hover:text-[#3e2723] uppercase tracking-tighter">{item.title}</td>
                               <td className="p-8 text-center text-[#8d6e63] font-mono group-hover:scale-110 transition-transform">{item.views}</td>
                               <td className="p-8 text-center text-indigo-600 font-mono text-lg">{item.subRate}</td>
                               <td className="p-8 text-right">
                                  <div className="w-32 h-2 bg-black/5 rounded-full overflow-hidden ml-auto shadow-inner group-hover:bg-black/10 transition-all">
                                     <motion.div initial={{ width: 0 }} animate={{ width: item.subRate }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-gradient-to-r from-[#8d6e63] to-[#3e2723] relative overflow-hidden">
                                        <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-white/20" />
                                     </motion.div>
                                  </div>
                               </td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                    </div>
                  </div>

                  <div className="lg:col-span-4 bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#8d6e63] mb-12">System Deployment Hub</h3>
                     <DonutChart data={[{value: 65, color: '#3e2723'}, {value: 25, color: '#8d6e63'}, {value: 10, color: '#e6dccb'}]} />
                     <div className="mt-12 w-full space-y-6">
                        <div className="flex justify-between items-center bg-black/5 p-8 rounded-[2.5rem] shadow-inner border border-white hover:bg-white transition-all group"><div className="flex items-center gap-4"><Smartphone size={24} className="text-[#3e2723] group-hover:scale-110 transition-transform" /> <span className="text-xs font-black uppercase tracking-widest text-[#8d6e63]">Mobile Matrix</span></div> <span className="font-black text-2xl tabular-nums text-[#3e2723]">65%</span></div>
                        <div className="flex justify-between items-center p-8 rounded-[2.5rem] hover:bg-white transition-all group border border-transparent hover:border-black/5"><div className="flex items-center gap-4"><Tablet size={24} className="text-[#3e2723] group-hover:scale-110 transition-transform" /> <span className="text-xs font-black uppercase tracking-widest text-[#8d6e63]">Tablet Interface</span></div> <span className="font-black text-2xl tabular-nums text-[#3e2723]">25%</span></div>
                     </div>
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            /* --- INNOVATIVE POP-IT GAME VIEW --- */
            <motion.div key="game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-10 pb-20">
                <div className="mb-12 text-center px-4">
                  <motion.div key={`${levelIdx}-${gameIdx}`} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#3e2723] text-white px-12 py-6 rounded-[3rem] shadow-2xl border-b-[10px] border-black/40 inline-flex items-center gap-6 relative overflow-hidden">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
                    <Zap className="text-yellow-400 w-10 h-10 fill-current animate-pulse relative z-10" />
                    <span className="text-2xl sm:text-4xl font-black uppercase tracking-tighter relative z-10">{currentLevel.name}</span>
                  </motion.div>
                </div>
                <div className="grid grid-cols-5 gap-5 sm:gap-8 p-8 sm:p-16 bg-[#d7ccc8] rounded-[5rem] sm:rounded-[7rem] border-4 sm:border-[20px] border-[#8d6e63] shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative group/board">
                  <div className="absolute inset-6 rounded-[4rem] border-2 border-white/5 pointer-events-none group-hover/board:border-white/10 transition-all duration-1000" />
                  {Array.from({ length: 25 }).map((_, i) => {
                    const target = memoryTargets.find(t => t.index === i);
                    const isFound = foundTargets.includes(i);
                    const isError = errorCell === i;
                    const rowIndex = Math.floor(i / 5);
                    return (
                      <motion.button 
                        key={i} 
                        whileTap={{ scale: 0.7 }} 
                        onClick={() => handlePopClick(i)} 
                        className={`w-16 h-16 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-4xl sm:text-8xl transition-all duration-150 relative ${isFound ? `bg-emerald-400 shadow-[inset_0_12px_25px_rgba(0,0,0,0.4)] ring-4 sm:ring-12 ring-emerald-200` : isError ? 'bg-rose-500 shadow-[inset_0_12px_25px_rgba(0,0,0,0.5)] ring-4 sm:ring-12 ring-rose-300' : `${RAINBOW_ROWS[rowIndex]} shadow-[0_12px_0_rgba(0,0,0,0.2),inset_0_-12px_25px_rgba(255,255,255,0.4)] hover:scale-105 active:shadow-none active:translate-y-1`}`}
                      >
                        <AnimatePresence>{(isShowingSequence && target) || isFound ? (<motion.span initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="drop-shadow-2xl pointer-events-none">{target?.icon}</motion.span>) : null}</AnimatePresence>
                        {isError && <div className="absolute inset-0 flex items-center justify-center bg-rose-600 rounded-full"><X className="text-white w-12 h-12 sm:w-20 sm:h-20 stroke-[6]" /></div>}
                      </motion.button>
                    );
                  })}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lab Console Overlay (Game Mode Only) */}
      {view === 'game' && (
        <div className="w-full max-w-7xl flex flex-col items-center mt-2 z-[70] shrink-0 px-6 pb-6">
          <div className="bg-[#dfd7cc] p-8 rounded-[3.5rem] border-b-[12px] border-[#c4a484] w-full shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-white/80 transition-all duration-1000" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3e2723] text-white px-12 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl z-10 border border-white/5">Neural Interface v.X</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                  <button onClick={startRound} disabled={roundComplete || isShowingSequence} className="flex items-center justify-center gap-4 py-7 bg-white text-[#3e2723] rounded-[2.5rem] font-black uppercase text-base shadow-[0_8px_0_#e2e8f0] active:shadow-none active:translate-y-1 hover:bg-[#faf9f6] transition-all relative overflow-hidden group/btn">
                    <motion.div initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.6 }} className="absolute inset-0 bg-black/[0.02]" />
                    <Eye size={26} className="group-hover/btn:scale-110 transition-transform" /> Recall Pulse
                  </button>
                  <button onClick={() => { setTime(0); startRound(); }} className="flex items-center justify-center gap-4 py-7 bg-white text-rose-500 rounded-[2.5rem] font-black uppercase text-base shadow-[0_8px_0_#fecdd3] active:shadow-none active:translate-y-1 hover:bg-rose-50 transition-all group/btn">
                    <RefreshCcw size={26} className="group-hover/btn:rotate-180 transition-transform duration-700" /> Cycle Frame
                  </button>
                  <button onClick={() => setAutoNextTimer(0)} disabled={!roundComplete} className={`relative flex items-center justify-center gap-4 py-7 rounded-[2.5rem] font-black uppercase text-base shadow-2xl transition-all ${roundComplete ? 'bg-[#3e2723] text-white shadow-[0_12px_0_#000000] scale-105 active:shadow-none active:translate-y-1' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'}`}>
                    <div className="flex items-center gap-4 relative z-10">
                      {autoNextTimer !== null ? <Timer size={26} className="animate-spin text-amber-400" /> : <ArrowRightCircle size={26} className="text-amber-400" />}
                      <span>{autoNextTimer !== null ? `Sync in ${autoNextTimer}s` : gameIdx < 4 ? 'Next Mission' : 'Next Sector'}</span>
                    </div>
                  </button>
              </div>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .grid-cols-24 { grid-template-columns: repeat(24, minmax(0, 1fr)); }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}