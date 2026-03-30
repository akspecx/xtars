import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gamepad2, Star, Zap,
  LayoutDashboard, Users, TrendingUp, Clock, CreditCard,
  Play, 
  Flame, 
  Activity, AlertTriangle,
  ChevronDown, Rocket, 
  BrainCircuit, Globe, ShieldCheck
} from 'lucide-react';

const GAMES_PER_LEVEL = 5;
const USER_NAME = "Prabhat"; 

// --- DUMMY DATA ---
const RECENT_MODULES = [
  { id: 1, title: 'Algebraic Balancing', progress: 80, lastDate: '2h ago', icon: '⚖️' },
  { id: 2, title: 'Magic Square Pro', progress: 35, lastDate: 'Yesterday', icon: '🔢' },
  { id: 3, title: 'Nature Path Memory', progress: 100, lastDate: '3 days ago', icon: '🦋' },
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



const CustomAreaChart = memo(({ data }: any) => {
  const max = Math.max(...data);
  const points = data.map((v: any, i: number) => `${(i * (100 / (data.length - 1)))},${100 - (v / max * 80)}`).join(' ');
  const fillPoints = `0,100 ${points} 100,100`;
  return (
    <div className="relative w-full h-32 mt-6">
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

const CognitiveMetricCircles = memo(({ pace, accuracy, logic }: any) => {
  const size = 220;
  const center = size / 2;
  const strokeWidth = 14;

  const CircleRing = ({ radius, value, color, label }: any) => (
    <g className="group cursor-help">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} strokeOpacity="0.2" />
      <motion.circle 
        cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: value / 100 }}
        transition={{ duration: 2, ease: "circOut" }}
        style={{ originX: "50%", originY: "50%", rotate: -90, filter: `drop-shadow(0px 0px 8px ${color}44)` }}
      />
      <text x={center + radius + strokeWidth + 5} y={center + 3} fontSize="8" fontWeight="900" fill={color} 
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {label}
      </text>
    </g>
  );

  return (
    <motion.div 
      animate={{ scale: [1, 1.02, 1] }} 
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex flex-col items-center justify-center p-6 bg-[#faf9f6] rounded-[3rem] shadow-inner border border-black/5 overflow-hidden"
    >
      <svg width={size} height={size} className="overflow-visible filter drop-shadow-xl">
        <CircleRing radius={85} value={accuracy} color="#10b981" label="Accuracy" />
        <CircleRing radius={65} value={pace} color="#4f46e5" label="Pace" />
        <CircleRing radius={45} value={logic} color="#f59e0b" label="Logic" />
        <text x={center} y={center - 8} textAnchor="middle" fontSize="10" fontWeight="700" fill="#8d6e63" className="tracking-[0.05em] opacity-40 text-[8px]">Mastery</text>
        <text x={center} y={center + 18} textAnchor="middle" fontSize="28" fontStyle="italic" fontWeight="900" fill="#3e2723" className="tabular-nums">
          {Math.round((pace + accuracy + logic) / 3)}%
        </text>
      </svg>
      <div className="flex gap-4 mt-8 border-t border-black/5 pt-4">
         <div className="flex flex-col items-center"><div className="w-4 h-1 rounded-full bg-[#10b981]" /><span className="text-[7px] font-bold opacity-40 mt-1">Accuracy</span></div>
         <div className="flex flex-col items-center"><div className="w-4 h-1 rounded-full bg-[#4f46e5]" /><span className="text-[7px] font-bold opacity-40 mt-1">Pace</span></div>
         <div className="flex flex-col items-center"><div className="w-4 h-1 rounded-full bg-[#f59e0b]" /><span className="text-[7px] font-bold opacity-40 mt-1">Logic</span></div>
      </div>
    </motion.div>
  );
});

const PeerStandingGauge = memo(({ percentile }: any) => (
  <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#3e2723] to-[#1a0f0d] rounded-[3rem] text-white shadow-2xl relative overflow-hidden h-full border-b-[10px] border-black group">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 group-hover:scale-110 transition-transform duration-1000" />
    <span className="text-[9px] font-bold tracking-[0.05em] opacity-40 mb-4 z-10">Global Peer Calibration</span>
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
       <span className="text-[9px] font-bold tracking-[0.05em] text-amber-200">World Rank: #482</span>
    </div>
  </div>
));

const StatCard = memo(({ title, value, sub, icon: Icon, trend, color = "text-[#3e2723]" }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-[#faf9f6] p-6 rounded-[2.5rem] border border-[#c4a484]/20 shadow-[6px_6px_0px_rgba(0,0,0,0.03)] flex flex-col gap-1 relative overflow-hidden group"
  >
    <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-all duration-700">
      {Icon && <Icon size={120} />}
    </div>
    <span className="text-[9px] font-bold text-[#8d6e63] tracking-[0.05em]">{title}</span>
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${color} tracking-tighter tabular-nums`}>{value}</span>
      {trend !== undefined && (
        <span className={`text-[10px] font-black flex items-center ${trend > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </span>
      )}
    </div>
      <span className="text-[9px] font-normal text-[#5C4033] opacity-60">{sub}</span>
  </motion.div>
));

// --- MAIN APPLICATION ---

export default function Home() {
  const [view, setView] = useState('dashboard'); 
  const [role, setRole] = useState('user'); 
  
  // --- Game State ---
  const [levelIdx, setLevelIdx] = useState(0);
  const [gameIdx, setGameIdx] = useState(0); 
  const [time, setTime] = useState(0);
  const [memoryTargets, setMemoryTargets] = useState<any[]>([]);
  const [foundTargets, setFoundTargets] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [errorCell, setErrorCell] = useState<number | null>(null);
  const [roundComplete, setRoundComplete] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState<number | null>(null);



  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    let prefix = "Welcome back";
    if (hour >= 4 && hour < 12) prefix = "Rise and shine";
    else if (hour >= 12 && hour < 17) prefix = "Good afternoon";
    else if (hour >= 17 && hour < 22) prefix = "Good evening";
    else prefix = "Hello, Night Wizard";
    return `${prefix}, ${USER_NAME}!`;
  }, []);



  const startRound = useCallback(() => {
    const config = MEMORY_CONFIG[levelIdx];
    const newTargets: any[] = [];
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

  const handlePopClick = (index: number) => {
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

  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen" >
    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
  
      {/* HEADER STATION */}
      <div className="w-full max-w-7xl flex justify-between items-center px-4 py-4 z-[60] bg-white/40 backdrop-blur-lg border-b border-[#c4a484]/20 shadow-sm shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-[#5d4037] to-[#1a0f0d] rounded-[1.8rem] shadow-2xl flex items-center justify-center text-white border-b-4 border-black relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {view === 'dashboard' ? <LayoutDashboard size={26} /> : <Gamepad2 size={26} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.05em] leading-none text-[#3e2723]">Station Alpha</h1>
            <div className="flex items-center gap-3 mt-1.5">
              <button 
                onClick={() => { setRole(role === 'user' ? 'admin' : 'user'); setView('dashboard'); }}
                className="bg-white border border-[#c4a484]/20 px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-inner transition-all hover:bg-emerald-50 active:scale-95"
              >
                <ShieldCheck size={14} className={role === 'admin' ? 'text-indigo-600' : 'text-emerald-600'} />
                <span className="text-[10px] font-bold tracking-[0.05em] text-[#3e2723]">{role === 'user' ? 'Student Interface' : 'Admin Console'}</span>
                <ChevronDown size={12} className="opacity-40" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[9px] font-bold opacity-30 tracking-[0.05em]">Session Runtime</span>
            <span className="text-xl font-mono font-black tabular-nums tracking-tighter text-[#3e2723] drop-shadow-sm">{formatTime(time)}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setView(view === 'game' ? 'dashboard' : 'game')}
            className="flex items-center gap-3 bg-[#8d6e63] text-white px-8 py-3.5 rounded-[1.5rem] shadow-[0_6px_0_#3e2723] border border-white/20 font-bold text-xs tracking-[0.05em] transition-all"
          >
            {view === 'dashboard' ? <Play size={20} className="fill-current text-amber-300" /> : <LayoutDashboard size={20} />}
            {view === 'dashboard' ? 'Launch Lab' : 'Exit Sector'}
          </motion.button>
        </div>
      </div>

      {/* DASHBOARD CONTENT SCROLL AREA */}
      <div className="flex-1 w-full max-w-7xl overflow-y-auto p-6 bg-[#e6dccb] relative shadow-inner">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        
        <AnimatePresence mode="wait">
          {view === 'dashboard' ? (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 pb-20">
              
              {role === 'user' ? (
                <>
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    className="lg:col-span-12 bg-[#faf9f6] p-6 sm:p-8 md:p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[10px_10px_0px_rgba(0,0,0,0.015)] flex flex-col md:flex-row justify-between items-center gap-6 overflow-visible relative group min-h-[220px]"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.04] -rotate-12 group-hover:scale-110 transition-transform duration-1000"><BrainCircuit size={180} /></div>
                    <div className="relative z-10 text-center md:text-left">
                       <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-[-0.02em] text-[#3e2723] mb-2 leading-tight max-w-xl break-words">{dynamicGreeting}</h2>
                       <p className="text-xs sm:text-sm md:text-base font-semibold text-[#5C4033] tracking-[0.01em] text-center md:text-left max-w-2xl">
                          Ready to learn something new? Pick a subject below to get started.
                       </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-6 bg-[#fdf8f1] px-10 py-6 rounded-[3rem] border border-[#c4a484]/30 shadow-inner relative overflow-hidden group/rank">
                       <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent translate-x-[-100%] group-hover/rank:translate-x-[100%] transition-transform duration-1000" />
                       <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-xl border-2 border-white relative z-10">
                         <Star size={24} className="fill-current" />
                       </div>
                       <div className="flex flex-col relative z-10">
                          <span className="text-2xl font-black text-[#3e2723] leading-none">3 Courses in Progress</span>
                          <span className="text-[10px] font-bold opacity-40 tracking-[0.05em] mt-1">Keep Learning</span>
                       </div>
                    </motion.div>
                  </motion.div>

                  <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-4 bg-[#faf9f6] p-8 rounded-[3rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden relative">
                     <div className="absolute -bottom-10 -right-10 opacity-[0.02]"><Zap size={160} /></div>
                     <div className="flex justify-between items-center mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                           <div className="p-3 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm"><Flame className="text-rose-500" size={24} /></div>
                           <h3 className="text-sm font-bold text-[#3e2723] tracking-[0.05em]">Stability Pulse</h3>
                        </div>
                        <motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-[10px] font-bold bg-[#3e2723] text-white px-4 py-1.5 rounded-full tracking-[0.05em] shadow-lg">Streak: 5D</motion.span>
                     </div>
                     <div className="grid grid-cols-7 gap-2 mb-10 px-1 relative z-10">
                        {['M','T','W','T','F','S','S'].map((day, i) => (
                          <div key={day+i} className="flex flex-col items-center gap-2">
                             <div className={`w-full aspect-square rounded-[1.1rem] shadow-inner border-2 flex items-center justify-center transition-all relative overflow-hidden ${i < 5 ? 'bg-[#3e2723] border-black/5 text-amber-400' : 'bg-white border-[#c4a484]/10 opacity-30'}`}>
                                {i < 5 ? <Zap size={18} fill="currentColor" /> : <div className="w-2 h-2 rounded-full bg-current opacity-20" />}
                             </div>
                             <span className="text-[10px] font-black opacity-30">{day}</span>
                          </div>
                        ))}
                     </div>
                     <div className="bg-[#fdf8f1] p-6 rounded-[2rem] border border-[#c4a484]/20 relative z-10 shadow-inner">
                        <div className="flex justify-between items-end mb-3">
                           <p className="text-[10px] font-bold text-[#8d6e63] tracking-[0.05em]">Neural Retention</p>
                           <span className="text-xs font-black text-[#3e2723]">82%</span>
                        </div>
                        <div className="h-2 w-full bg-black/[0.03] rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} transition={{ duration: 2 }} className="h-full bg-gradient-to-r from-rose-500 to-[#3e2723]" />
                        </div>
                     </div>
                  </motion.div>

                  <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-8 bg-[#faf9f6] p-10 rounded-[3rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><TrendingUp size={160} /></div>
                    <div className="flex justify-between items-start mb-6">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm"><Activity className="text-emerald-600 animate-pulse" /></div>
                          <div>
                             <h2 className="text-2xl font-bold tracking-[0.05em] text-[#3e2723]">Brain Load Dynamics</h2>
                             <p className="text-[10px] font-normal text-[#5C4033] tracking-[0.02em]">Live Cognitive Complexity Mapping</p>
                          </div>
                       </div>
                    </div>
                    <CustomAreaChart data={[20, 35, 25, 65, 40, 85, 55, 75, 60, 95]} />
                  </motion.div>

                  <div className="lg:col-span-8 space-y-8">
                     <div className="bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
                        <div className="flex items-center justify-between mb-10">
                           <div className="flex items-center gap-4 text-[#3e2723]">
                              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm"><Rocket className="text-indigo-600" size={24} /></div>
                              <h3 className="text-xl font-bold tracking-[0.05em]">Active Mission Deck</h3>
                           </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           {RECENT_MODULES.map(m => (
                             <motion.div key={m.id} whileHover={{ y: -10 }} className="p-8 bg-[#fdf8f1] rounded-[3rem] border border-[#c4a484]/20 shadow-sm">
                                <span className="text-5xl block mb-4">{m.icon}</span>
                                <h4 className="text-xs font-bold text-[#3e2723] truncate">{m.title}</h4>
                                <div className="flex items-center gap-3 mt-4">
                                   <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden">
                                      <motion.div initial={{ width: 0 }} animate={{ width: `${m.progress}%` }} className="h-full bg-indigo-500" />
                                   </div>
                                   <span className="text-[10px] font-black">{m.progress}%</span>
                                </div>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-8">
                     <div className="bg-[#faf9f6] p-10 rounded-[3.5rem] border border-[#c4a484]/20 shadow-[8px_8px_0px_rgba(0,0,0,0.02)] flex flex-col items-center flex-1 justify-center">
                        <CognitiveMetricCircles pace={92} accuracy={88} logic={75} />
                     </div>
                     <PeerStandingGauge percentile={96} />
                  </div>
                </>
              ) : (
                <>
                  <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-6 gap-6">
                    <StatCard title="Station Runtime" value="1,280h" sub="+12h TODAY" icon={Clock} trend={8} />
                    <StatCard title="Active Units" value="4,202" sub="GLOBAL REACH" icon={Users} trend={12} color="text-indigo-600" />
                    <StatCard title="Module Return" value="78%" sub="STICKINESS" icon={TrendingUp} trend={3} color="text-emerald-600" />
                    <StatCard title="Acquisition" value="12" sub="FAILED CONV." icon={AlertTriangle} trend={-2} color="text-rose-600" />
                    <StatCard title="Efficiency" value="2.4" sub="AVG ATTEMPTS" icon={Activity} color="text-amber-600" />
                    <StatCard title="Daily Revenue" value="$2.4k" sub="STATION INTAKE" icon={CreditCard} trend={4} />
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div key="game" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 w-full h-full flex flex-col items-center justify-center py-20">
                <div className="grid grid-cols-5 gap-3 sm:gap-8 p-6 sm:p-16 bg-[#d7ccc8] rounded-[4rem] border-4 border-[#8d6e63] shadow-2xl relative">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.button 
                      key={i} whileTap={{ scale: 0.7 }} onClick={() => handlePopClick(i)} 
                      className={`w-12 h-12 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-xl sm:text-8xl transition-all ${foundTargets.includes(i) ? `bg-emerald-400` : errorCell === i ? 'bg-rose-500' : `${RAINBOW_ROWS[Math.floor(i/5)]}`}`}
                    >
                      {(isShowingSequence || foundTargets.includes(i)) && <span>{memoryTargets.find(t => t.index === i)?.icon}</span>}
                    </motion.button>
                  ))}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}