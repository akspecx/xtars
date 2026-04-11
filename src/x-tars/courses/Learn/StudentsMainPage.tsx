import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smile } from 'lucide-react';
import { getProgress, recordVisit, ModuleProgress } from '../CommonUtility/useModuleProgress';
import { MasteryBadge, NewBadge, ParentTooltip } from '../CommonUtility/ProgressBadge';

const STUDENTS_DATA = [
  { id: "maths", title: "Maths", subtitle: "Learn the core of Mathematics", icon: "📐", path: "/learn/mathematics", category: "math", totalScenarios: 10 },
  { id: "logicalreasoning", title: "Logical Reasoning", subtitle: "Solve the arrangements", icon: "🧠", path: "/learn/logicalreasoning", category: "logic", totalScenarios: 10 },
  { id: "datainterpretation", title: "Data Interpretation", subtitle: "Analyze and interpret data", icon: "📊", path: "/learn/dataInterpretation", category: "math", totalScenarios: 10 },
  { id: "maps", title: "Maps", subtitle: "Explore Geographical Maps", icon: "🗺️", path: "/learn/maps", category: "logic", totalScenarios: 28 }
];

const categoryColors: Record<string, { bg: string; border: string; badge: string; glow: string }> = {
  language: { bg: "bg-indigo-50",  border: "border-indigo-200",  badge: "bg-indigo-100 text-indigo-700",  glow: "ring-indigo-300" },
  math:     { bg: "bg-amber-50",   border: "border-amber-200",   badge: "bg-amber-100 text-amber-700",    glow: "ring-amber-300" },
  logic:    { bg: "bg-violet-50",  border: "border-violet-200",  badge: "bg-violet-100 text-violet-700",  glow: "ring-violet-300" },
};

const CartoonWatermarks = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.07] z-0 select-none">
    <motion.div animate={{ y: [0, -20, 0], rotate: [-10, -5, -10] }} transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} className="absolute top-[3%] left-[4%] text-[10vw]">📚</motion.div>
    <motion.div animate={{ y: [0, 30, 0], rotate: [10, 15, 10] }} transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }} className="absolute bottom-[12%] right-[4%] text-[12vw]">🎓</motion.div>
    <motion.div animate={{ y: [0, -15, 0], rotate: [20, 25, 20] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute top-[18%] right-[8%] text-[7vw]">💡</motion.div>
    <motion.div animate={{ y: [0, 25, 0], rotate: [-15, -10, -15] }} transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }} className="absolute bottom-[8%] left-[8%] text-[9vw]">📝</motion.div>
    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }} className="absolute top-[38%] left-[38%] text-[18vw] opacity-30 blur-[2px]">🧠</motion.div>
  </div>
);

export default function StudentsMainPage() {
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});

  useEffect(() => {
    const map: Record<string, ModuleProgress> = {};
    STUDENTS_DATA.forEach(g => { 
      map[g.id] = getProgress(g.id, g.totalScenarios); 
    });
    setProgressMap(map);
  }, []);

  const dynamicGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️";
    if (hour < 17) return "Good afternoon! 🌼";
    return "Good evening! 🌙";
  }, []);

  return (
    <div className="w-full flex flex-col items-center bg-[#FDFBF7] font-sans select-none relative pb-10 overflow-hidden min-h-screen">
      <CartoonWatermarks />

      <div className="w-full max-w-7xl px-4 sm:px-6 pt-3 sm:pt-4 relative z-10 flex flex-col gap-4 sm:gap-6">

        {/* Compact Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-4 bg-[#FFFBF2] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border-[3px] border-[#FFB74D] shadow-[0_6px_16px_rgba(255,183,77,0.15)] w-full"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FFB74D] rounded-full text-white shadow-md shrink-0">
              <Smile size={22} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-[#7A5C3E] tracking-tighter leading-tight">{dynamicGreeting}</h2>
              <p className="text-xs sm:text-sm font-semibold text-[#A68B7C] leading-none mt-0.5">What do you want to learn today, Student?</p>
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#4CAF50] px-4 py-2 rounded-xl text-white shadow-[0_4px_0_#388E3C] border-2 border-white transform rotate-1 shrink-0">
            <span className="text-[9px] font-black uppercase tracking-wider opacity-90">Topics</span>
            <span className="text-2xl font-black leading-none">{STUDENTS_DATA.length}</span>
          </div>
        </motion.div>

        {/* 4-per-row grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {STUDENTS_DATA.map((game, idx) => {
            const colors = categoryColors[game.category] ?? categoryColors.logic;
            const prog = progressMap[game.id];
            const isNew = !prog || prog.visitCount === 0;
            const isGold = prog?.masteryLevel === 3;

            return (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  recordVisit(game.id, game.totalScenarios);
                  navigate(game.path);
                }}
                className={`relative aspect-[4/3] flex flex-col items-center justify-center gap-1 sm:gap-1.5 rounded-2xl sm:rounded-3xl border-[3px] ${colors.bg} ${colors.border} shadow-[0_4px_0_rgba(0,0,0,0.08)] hover:shadow-[0_6px_0_rgba(0,0,0,0.12)] transition-all cursor-pointer group p-2 ${isGold ? "ring-2 " + colors.glow : ""}`}
              >
                {prog && <MasteryBadge level={prog.masteryLevel} />}
                {isNew && <NewBadge />}
                {prog && <ParentTooltip progress={prog} />}

                <motion.span
                  className="text-5xl sm:text-6xl md:text-7xl leading-none drop-shadow-md"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4 + idx * 0.3, ease: "easeInOut" }}
                >
                  {game.icon}
                </motion.span>

                <span className="text-xs sm:text-sm font-black text-[#5D4037] tracking-tight leading-none text-center">
                  {game.title}
                </span>

                <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                  {game.category}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}
