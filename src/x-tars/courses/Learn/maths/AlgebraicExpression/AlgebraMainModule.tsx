import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HashRouter as Router, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Settings, Activity, Zap,
  FlaskConical, ClipboardCheck, BadgeCheck, Check, Clock, PlayCircle,
  Car, Trophy, Target, LayoutGrid, ChevronDown, ChevronUp, Scale,
  Hand, Volume2, VolumeX, RefreshCcw, Sparkles, Timer, FastForward, Shuffle
} from 'lucide-react';


const HIERARCHY_DATA = [
  {
    id: "maths",
    title: "Scale",
    subtitle: "Understanding the balanced scale",
    icon: "⚖️",
    gradient: "from-indigo-500 to-purple-500",
    path: "/learn/mathematics/algebra",
    subModules: [
      { id: 'alg_1', title: 'Balance the Scale', desc: 'Decoding patterns through physical mass.', icon: '🔢', path: '/learn/mathematics/algebra/introduction' },
      { id: 'alg_2', title: 'Finding the Unknown', desc: 'Mapping complex relationships.', icon: '🔗', path: '/learn/mathematics/algebra/unknown' },
      { id: 'alg_3', title: 'Weight on right scale', desc: 'Mapping complex relationships.', icon: '🔗', path: '/learn/mathematics/algebra/rightScale' }
      
    ]
  },
  {
    id: "maths1",
    title: "Fundamentals",
    subtitle: "Fundamentals of equation",
    icon: "⚖️",
    gradient: "from-indigo-500 to-purple-500",
    path: "/learn/mathematics/algebra",
    subModules: [
      { id: 'alg_1', title: 'LHS and RHS', desc: 'Introduction to LHS and RHS', icon: '🔢', path: '/learn/mathematics/algebra/lhsrhsIntroduction' },
      { id: 'alg_2', title: 'Like Unlike terms', desc: 'Undrstanding the like and unlike terms.', icon: '🔗', path: '/learn/mathematics/algebra/likeunlike' },
      { id: 'alg_3', title: 'Monomial Binomial and Polynomial', desc: 'Identify the polynomials', icon: '🔗', path: '/learn/mathematics/algebra/monibiPoly' }
    
    ]
  },
  {
    id: "maths2",
    title: "Advanced - Yet to build",
    subtitle: "Understanding the balanced scale",
    icon: "⚖️",
    gradient: "from-indigo-500 to-purple-500",
    path: "/learn/mathematics/algebra",
    subModules: [
      { id: 'alg_1', title: 'Introduction to expression', desc: 'Let us learn building the expression', icon: '🔢', path: '/learn/mathematics/algebra/expressionIntro' },
      { id: 'alg_2', title: 'Finding the Unknown', desc: 'Mapping complex relationships.', icon: '🔗', path: '/learn/mathematics/algebra/unknown' },
      { id: 'alg_3', title: 'Weight on right scale', desc: 'Mapping complex relationships.', icon: '🔗', path: '/learn/mathematics/algebra/rightScale' }
    
    ]
  }
];

// ==========================================
// 2. COMMON UTILITY ENGINE
// ==========================================
const CurriculumEngine = {
  flatten: (data) => data.flatMap(mod => 
    mod.subModules.map(sm => ({ 
      ...sm, modId: mod.id, modTitle: mod.title, modGradient: mod.gradient, modPath: mod.path 
    }))
  ),
  next: (currentId, flatPath) => {
    const idx = flatPath.findIndex(sm => sm.id === currentId);
    return idx < flatPath.length - 1 ? flatPath[idx + 1] : null;
  },
  progress: (completions, total) => total === 0 ? 0 : Math.round((Object.keys(completions).length / total) * 100)
};

// ==========================================
// 3. UI RENDERER HELPERS
// ==========================================
const IconRenderer = ({ icon, size = 20, className = "" }) => {
  if (!icon) return null;
  if (typeof icon === 'string') return <span className={className}>{icon}</span>;
  const IconComponent = icon;
  return <IconComponent size={size} className={className} />;
};

const LabShell = ({ activeSub, isChallengeSolved, isDone, completions, onFinalize, onBack, children }) => {
  const renderHeader = () => (
    <header className="flex justify-between items-end mb-4 bg-[#3e2723] p-6 lg:p-10 rounded-t-[2.5rem] lg:rounded-t-[3.5rem] border-b-4 border-black/30 relative overflow-hidden shrink-0 shadow-2xl">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="relative z-10 flex flex-col gap-2 text-left">
        <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase text-[10px] hover:text-white transition-all active:scale-95"><ChevronLeft size={14} /> Back to Dashboard</button>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-sm bg-[#e6dccb] rotate-45 shadow-glow" />
          <h2 className="text-2xl lg:text-6xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none">{activeSub.title}</h2>
        </div>
      </div>
      <div className="hidden md:flex flex-col items-end relative z-10">
         <div className="flex items-center gap-2 mb-1 text-[#8d6e63] font-black uppercase text-[10px] tracking-widest">Logic Node</div>
         <span className="text-xl font-mono font-black bg-black/40 text-white px-5 py-2 rounded-xl border border-white/10 shadow-2xl">{activeSub.id.toUpperCase()}</span>
      </div>
    </header>
  );

  const renderFooter = () => (
    <div className="w-full max-w-md mt-6 pt-6 border-t border-[#3e2723]/10 shrink-0">
      <motion.button
        whileHover={(isChallengeSolved || isDone) ? { scale: 1.05 } : {}} whileTap={(isChallengeSolved || isDone) ? { scale: 0.95 } : {}}
        disabled={!isChallengeSolved && !isDone}
        onClick={() => onFinalize(activeSub.id)}
        className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl border-b-[10px] transition-all flex items-center justify-center gap-4 ${
          isDone ? 'bg-amber-500 border-amber-800 text-white' : 
          isChallengeSolved ? 'bg-emerald-600 border-emerald-900 text-white animate-bounce' : 'bg-gray-200 border-gray-400 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isDone ? 'Proceed to Next Node' : 'Finalize Calibration'}<ChevronRight size={22} strokeWidth={4} />
      </motion.button>
      {isDone && <div className="mt-5 text-center text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 animate-pulse"><BadgeCheck size={16} /> Matrix Logged: {completions[activeSub.id]}</div>}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col max-w-6xl mx-auto w-full">
      {renderHeader()}
      <div className="flex-1 bg-[#faf9f6] rounded-b-[2.5rem] lg:rounded-b-[4rem] border-x-4 border-b-8 border-[#3e2723] flex flex-col items-center justify-start p-4 lg:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3e2723 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="flex-1 w-full overflow-y-auto no-scrollbar">{children}</div>
        {renderFooter()}
      </div>
    </motion.div>
  );
};

// ==========================================
// 6. DASHBOARD UI COMPONENTS
// ==========================================
const ModuleCard = ({ mod, completions, onSubModuleClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const modCompletions = mod.subModules.filter(sm => completions[sm.id]).length;
  const isFullyDone = modCompletions === mod.subModules.length;

  return (
    <div className="group relative bg-[#faf9f6] rounded-[2.5rem] border-4 border-[#3e2723] shadow-2xl overflow-hidden flex flex-col transition-all hover:shadow-[0_40px_80px_rgba(62,39,35,0.25)] h-fit">
      <div className="p-8 bg-[#3e2723] relative overflow-hidden border-b-2 border-black/20">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
        <div className="relative z-10 flex justify-between items-start text-left">
          <div className="flex gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mod.gradient} flex items-center justify-center text-white text-2xl font-black shadow-2xl shrink-0 border-2 border-white/20 ring-4 ring-[#3e2723]`}>
              <IconRenderer icon={mod.icon} />
            </div>
            <div className="mt-1">
              <h3 className="text-3xl font-black text-[#e6dccb] leading-none mb-1 uppercase tracking-tighter">{mod.title}</h3>
              <p className="text-xs font-bold text-[#8d6e63] uppercase tracking-widest leading-tight opacity-80">{mod.subtitle}</p>
            </div>
          </div>
          {isFullyDone && <BadgeCheck className="text-emerald-500 bg-white rounded-full p-1 shadow-glow" size={28} />}
        </div>
      </div>
      <div className="flex-1 flex flex-col bg-[#faf9f6]">
        <div onClick={() => setIsCollapsed(!isCollapsed)} className="flex items-center justify-between px-8 py-5 border-b border-[#c4a484]/20 bg-[#e6dccb]/20 cursor-pointer hover:bg-[#e6dccb]/30 transition-all group/header">
           <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase text-[#3e2723] tracking-[0.2em]">Modules</span>
              <span className="text-[9px] font-bold text-[#8d6e63] px-2.5 py-1 bg-white border border-[#c4a484]/30 rounded-full shadow-sm">{modCompletions} / {mod.subModules.length}</span>
           </div>
           <div className="p-1.5 rounded-lg bg-[#3e2723] text-[#e6dccb] group-hover/header:bg-black transition-all">
             {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
           </div>
        </div>
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-6 space-y-3 overflow-hidden">
              {mod.subModules.map((sm) => {
                const isDone = !!completions[sm.id];
                return (
                  <motion.button key={sm.id} whileHover={{ x: 8 }} onClick={() => onSubModuleClick(sm)} className="w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between bg-white shadow-sm border-[#c4a484]/10 hover:border-[#3e2723]">
                    <div className="flex items-center gap-5">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 ${isDone ? 'bg-[#3e2723] text-emerald-400 border-[#3e2723]' : 'bg-[#e6dccb] text-[#3e2723]'}`}>
                        <IconRenderer icon={sm.icon} size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black uppercase text-[#3e2723] leading-none mb-1">{sm.title}</h4>
                        <p className="text-[9px] font-bold text-[#8d6e63] opacity-60 uppercase">{sm.id}</p>
                      </div>
                    </div>
                    {isDone ? <div className="bg-emerald-500 text-white p-1 rounded-full shadow-md"><Check size={16} strokeWidth={4} /></div> : <ChevronRight size={18} className="text-[#c4a484]" />}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 7. MAIN ORCHESTRATOR
// ==========================================
export default function LabDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [completions, setCompletions] = useState({});
  const [challengeSolved, setChallengeSolved] = useState(false);

  const flatPath = useMemo(() => CurriculumEngine.flatten(HIERARCHY_DATA), []);
  const activeSub = useMemo(() => flatPath.find(sm => sm.path === location.pathname), [location.pathname, flatPath]);
  const progress = useMemo(() => CurriculumEngine.progress(completions, flatPath.length), [completions, flatPath.length]);

  const handleFinalize = useCallback((id) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCompletions(prev => ({ ...prev, [id]: now }));
    const nextSub = CurriculumEngine.next(id, flatPath);
    if (nextSub) navigate(nextSub.path); else navigate('/');
  }, [flatPath, navigate]);

  // --- TOP-LEVEL RENDER FUNCTIONS ---
  const renderBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
  );

  const renderModuleGrid = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto w-full p-6 lg:p-14 pb-24 text-center">
      <header className="mb-14 flex justify-between items-end border-b-4 border-[#3e2723]/10 pb-8">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#3e2723] rounded-xl text-[#e6dccb] shadow-2xl border border-black/20"><LayoutGrid size={22} /></div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#8d6e63]">Logical Matrix v10.0</span>
          </div>
          <h1 className="text-4xl lg:text-8xl font-black uppercase tracking-tighter text-[#3e2723] leading-none">Curriculum</h1>
        </div>
        <div className="hidden sm:flex flex-col items-end">
           <span className="text-xs font-black uppercase text-[#8d6e63] tracking-[0.3em] mb-1">Global Mastery</span>
           <span className="text-5xl lg:text-7xl font-black text-[#3e2723] tabular-nums leading-none">{progress}%</span>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {HIERARCHY_DATA.map((mod) => (
          <ModuleCard key={mod.id} mod={mod} completions={completions} onSubModuleClick={(sm) => navigate(sm.path)} />
        ))}
      </div>
    </motion.div>
  );

  const renderActiveLab = () => (
    <div className="h-full w-full p-4 lg:p-10 overflow-hidden bg-[#e6dccb]">
      <LabShell 
        activeSub={activeSub} 
        isChallengeSolved={challengeSolved}
        isDone={!!completions[activeSub?.id]} 
        completions={completions} 
        onFinalize={handleFinalize} 
        onBack={() => navigate('/')}
      >
         {activeSub?.path === '/learn/mathematics/algebra/introduction' ? (
           <WeightLabModule isDone={!!completions[activeSub.id]} setChallengeSolved={setChallengeSolved} completions={completions} />
         ) : (
           <div className="h-full flex flex-col items-center justify-center gap-8 opacity-20 grayscale mt-24">
              <Settings size={120} className="animate-spin-slow" /><h4 className="text-3xl font-black uppercase tracking-[0.5em]">Node Initializing...</h4>
           </div>
         )}
      </LabShell>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-[#e6dccb] overflow-y-auto no-scrollbar relative font-sans text-[#3e2723]">
      {renderBackground()}
      <AnimatePresence mode="wait">
        {!activeSub ? renderModuleGrid() : renderActiveLab()}
      </AnimatePresence>
    </div>
  );
}