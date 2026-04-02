import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Rocket, Target } from 'lucide-react';
import { getProgress, recordVisit, ModuleProgress } from '../../../CommonUtility/useModuleProgress';
import { MasteryProgress, MasteryBadge, NewBadge } from '../../../CommonUtility/ProgressBadge';
import { useProfile } from '../../../../../context/ProfileContext';

interface VisualLogicLandingPageProps {
  onBack?: () => void;
  theme?: any;
  title?: string;
  icon?: string;
}

const visualLogicData = [
  { id: "big",               title: "Big",          subtitle: "Find the big one",      icon: "🐘", path: "/games/visuallogic/big",               category: "size",     totalScenarios: 8 },
  { id: "small",             title: "Small",        subtitle: "Find the small one",    icon: "🐜", path: "/games/visuallogic/small",             category: "size",     totalScenarios: 8 },
  { id: "big-small-mix",    title: "Big & Small",  subtitle: "Mixed size fun",        icon: "⚖️", path: "/games/visuallogic/big-small-mix",    category: "size",     totalScenarios: 16 },
  { id: "tall",              title: "Tall",         subtitle: "Who is taller?",        icon: "🦒", path: "/games/visuallogic/tall",              category: "size",     totalScenarios: 8 },
  { id: "short",             title: "Short",        subtitle: "Who is shorter?",       icon: "🌵", path: "/games/visuallogic/short",             category: "size",     totalScenarios: 8 },
  { id: "tall-short",       title: "Tall & Short", subtitle: "Height challenge",      icon: "📏", path: "/games/visuallogic/tall-short",       category: "size",     totalScenarios: 16 },
  { id: "above",             title: "Above",        subtitle: "What is up there?",     icon: "☁️", path: "/games/visuallogic/above",             category: "position", totalScenarios: 8 },
  { id: "below",             title: "Below",        subtitle: "What is down there?",   icon: "🍄", path: "/games/visuallogic/below",             category: "position", totalScenarios: 8 },
  { id: "above-below-mix",  title: "Above & Below",subtitle: "Up and down fun",       icon: "↕️", path: "/games/visuallogic/above-below-mix",  category: "position", totalScenarios: 16 },
  { id: "inside",            title: "Inside",       subtitle: "In the box",            icon: "🧸", path: "/games/visuallogic/inside",            category: "position", totalScenarios: 8 },
  { id: "outside",           title: "Outside",      subtitle: "Out of the box",        icon: "🌳", path: "/games/visuallogic/outside",           category: "position", totalScenarios: 8 },
  { id: "inside-outside-mix",title: "In & Out",    subtitle: "Where is it?",          icon: "📦", path: "/games/visuallogic/inside-outside-mix",category: "position", totalScenarios: 16 },
  { id: "full",              title: "Full",         subtitle: "All filled up",         icon: "🧺", path: "/games/visuallogic/full",              category: "quantity", totalScenarios: 8 },
  { id: "empty",             title: "Empty",        subtitle: "Nothing inside",        icon: "🥣", path: "/games/visuallogic/empty",             category: "quantity", totalScenarios: 8 },
  { id: "full-empty",       title: "Full & Empty", subtitle: "Mixed volume fun",      icon: "🥛", path: "/games/visuallogic/full-empty",       category: "quantity", totalScenarios: 16 },
  { id: "same",              title: "Same",         subtitle: "Match the pictures",    icon: "👯", path: "/games/visuallogic/same",              category: "logic",    totalScenarios: 8 },
  { id: "different",         title: "Different",    subtitle: "Spot the odd one",      icon: "🤔", path: "/games/visuallogic/different",         category: "logic",    totalScenarios: 8 },
];

const categoryColors: Record<string, { bg: string; border: string; badge: string; glow: string }> = {
  size:     { bg: "bg-amber-50",   border: "border-amber-200",   badge: "bg-amber-100 text-amber-700",   glow: "ring-amber-300" },
  position: { bg: "bg-sky-50",     border: "border-sky-200",     badge: "bg-sky-100 text-sky-700",       glow: "ring-sky-300" },
  quantity: { bg: "bg-emerald-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700",glow: "ring-emerald-300" },
  logic:    { bg: "bg-violet-50",  border: "border-violet-200",  badge: "bg-violet-100 text-violet-700", glow: "ring-violet-300" },
};

const CartoonWatermarks = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07] z-0 select-none">
    <motion.div animate={{ y: [0, -20, 0], rotate: [-10, -5, -10] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[3%] left-[4%] text-[10vw]">🐘</motion.div>
    <motion.div animate={{ y: [0, 30, 0], rotate: [10, 15, 10] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} className="absolute bottom-[12%] right-[4%] text-[12vw]">🎈</motion.div>
    <motion.div animate={{ y: [0, -15, 0], rotate: [20, 25, 20] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute top-[18%] right-[8%] text-[7vw]">🧩</motion.div>
    <motion.div animate={{ y: [0, 25, 0], rotate: [-15, -10, -15] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }} className="absolute bottom-[8%] left-[8%] text-[9vw]">🚗</motion.div>
    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} className="absolute top-[38%] left-[38%] text-[18vw] opacity-30 blur-[2px]">🧸</motion.div>
  </div>
);

const VisualLogicLandingPage: React.FC<VisualLogicLandingPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const { activeProfile } = useProfile();

  // Load progress for all modules on mount
  useEffect(() => {
    const map: Record<string, ModuleProgress> = {};
    visualLogicData.forEach(g => {
      map[g.id] = getProgress(g.id, g.totalScenarios);
    });
    setProgressMap(map);
  }, []);

  const itemsPerPage = 4;
  const totalPages = Math.ceil(visualLogicData.length / itemsPerPage);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return visualLogicData.slice(start, start + itemsPerPage);
  }, [currentPage]);

  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌼";
    return "Good evening! 🌙";
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#FDFBF7] font-sans select-none relative pb-10 overflow-hidden min-h-screen">
      <CartoonWatermarks />

      <div className="w-full max-w-7xl px-4 sm:px-6 pt-3 sm:pt-4 relative z-10 flex flex-col gap-4 sm:gap-10">

        {/* Compact Welcome Header */}
        <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between gap-4 bg-[#FFFBF2] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-[3px] border-[#FFB74D] shadow-[0_6px_16px_rgba(255,183,77,0.15)] w-full"
        >
            <div className="flex items-center gap-3">
                {activeProfile?.type !== 'KIDS' && onBack && (
                    <button 
                        onClick={onBack}
                        className="p-1.5 sm:p-2 bg-[#FF1744] rounded-full text-white shadow-md shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    >
                        <motion.div whileTap={{ scale: 0.9 }}>
                            <Rocket size={20} strokeWidth={3} className="-rotate-45" />
                        </motion.div>
                    </button>
                )}
                <div className="p-1.5 sm:p-2 bg-[#3e2723] rounded-full text-white shadow-md shrink-0">
                    <Target size={20} strokeWidth={3} />
                </div>
                <div>
                    <h2 className="text-lg sm:text-2xl font-black text-[#7A5C3E] tracking-tighter leading-tight">{dynamicGreeting}</h2>
                    <p className="text-xs sm:text-sm font-bold text-[#A68B7C] tracking-tight opacity-60 leading-none mt-0.5">Pick a game and let's play!</p>
                </div>
            </div>
            <div className="flex flex-col items-center bg-[#4CAF50] px-4 py-2 rounded-xl text-white shadow-[0_4px_0_#388E3C] border-2 border-white transform rotate-1 shrink-0">
                <span className="text-xl sm:text-2xl font-black leading-none">{currentPage + 1}/{totalPages}</span>
                <span className="text-[8px] font-black uppercase tracking-wider opacity-90">Pages</span>
            </div>
        </motion.div>

        {/* Game Carousel Container */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-6 min-h-[400px]">
          {/* Navigation - Left */}
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevPage}
            className="hidden sm:flex absolute -left-4 lg:-left-12 z-20 w-16 h-16 bg-white rounded-full border-4 border-amber-400 items-center justify-center text-amber-500 shadow-xl"
          >
            <Rocket className="rotate-[-135deg]" size={32} strokeWidth={3} />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="grid grid-cols-2 gap-4 sm:gap-8 w-full"
            >
              {currentItems.map((game, idx) => {
                const colors = categoryColors[game.category];
                const prog = progressMap[game.id];
                const isNew = !prog || prog.visitCount === 0;
                const isGold = prog?.masteryLevel === 3;

                return (
                  <motion.button
                    key={game.id}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (game.id) recordVisit(game.id, game.totalScenarios);
                      navigate(game.path, { state: { initialMode: 'kid' } });
                    }}
                    className={`relative aspect-[4/3] flex flex-col items-center justify-center gap-2 sm:gap-4 rounded-[2.5rem] border-[5px] ${colors.bg} ${colors.border} shadow-[0_12px_0_rgba(0,0,0,0.06)] hover:shadow-[0_16px_0_rgba(0,0,0,0.08)] transition-all cursor-pointer group p-4 sm:p-8 ${isGold ? `ring-4 ${colors.glow}` : ''}`}
                  >
                    {prog && <MasteryBadge level={prog.masteryLevel} />}
                    {isNew && <NewBadge />}
                    
                    <motion.span
                      className="text-7xl sm:text-8xl md:text-9xl leading-none drop-shadow-2xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 3 + idx * 0.5, ease: "easeInOut" }}
                    >
                      {game.icon}
                    </motion.span>

                    <div className="text-center">
                      <span className="text-xl sm:text-3xl font-black text-[#5D4037] tracking-tight uppercase leading-none block mb-1">
                        {game.title}
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-[#A68B7C] uppercase tracking-widest opacity-60">
                         {game.category} Fun
                      </span>
                    </div>

                    {prog && prog.visitCount > 0 && <MasteryProgress progress={prog} />}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Navigation - Right */}
          <motion.button
            whileHover={{ scale: 1.1, x: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextPage}
            className="hidden sm:flex absolute -right-4 lg:-right-12 z-20 w-16 h-16 bg-white rounded-full border-4 border-amber-400 items-center justify-center text-amber-500 shadow-xl"
          >
            <Rocket className="rotate-45" size={32} strokeWidth={3} />
          </motion.button>
        </div>

        {/* Page Indicators */}
        <div className="flex justify-center gap-4 mt-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentPage(i)}
              animate={{ 
                scale: currentPage === i ? 1.5 : 1,
                rotate: currentPage === i ? 180 : 0
              }}
              className={`w-6 h-6 rounded-lg rotate-45 border-2 transition-colors ${
                currentPage === i 
                  ? 'bg-amber-400 border-amber-500 shadow-lg' 
                  : 'bg-white border-amber-200'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default VisualLogicLandingPage;