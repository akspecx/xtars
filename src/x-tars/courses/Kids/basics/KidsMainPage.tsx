import { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Smile } from 'lucide-react';
import { getProgress, recordVisit, ModuleProgress, getAggregateProgress } from '../../CommonUtility/useModuleProgress';

const KIDS_DATA = [
  { id: "alphabets",   title: "Alphabets",    subtitle: "Learn letters A to Z",        icon: "🔤", path: "/games/alphabets",    category: "language", totalScenarios: 26,
    icons: ["🍎","A","🍌","B","🐱","C","🐕","D","🐘","E"] },
  { id: "numbers",     title: "Numbers",      subtitle: "Counting and basic math",      icon: "🔢", path: "/games/numbers",      category: "math",     totalScenarios: 10,
    icons: ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣"] },
  { id: "shapes",      title: "Shapes",       subtitle: "Geometric shapes and colours", icon: "🔺", path: "/games/shapes",       category: "math",     totalScenarios: 8,
    icons: ["🔴","🔵","🔺","🟨","⭐","🟣"] },
  { id: "visuallogic", title: "Visual Logic", subtitle: "Big, small, above, below",     icon: "👁️", path: "/games/visuallogic",  category: "logic",    totalScenarios: 17,
    icons: ["🦒","Tall","🐜","Small","🐘","Big","🌱","Short"] },
  { id: "memory",      title: "Memory",       subtitle: "Match the pairs",              icon: "🧠", path: "/games/memory",       category: "logic",    totalScenarios: 10,
    icons: ["🐶","❓","🐶","🐱","❓","🐱"] },
  { id: "puzzles",     title: "Puzzles",      subtitle: "Solve fun brain teasers",      icon: "🧩", path: "/games/puzzles",      category: "logic",    totalScenarios: 10,
    icons: ["🧩","🔔","❓","💡","🌟"] },
];

const categoryColors: Record<string, { bg: string; ring: string; barColor: string; titleColor: string }> = {
  language: { bg: '#EFF6FF', ring: '#60A5FA', barColor: '#3B82F6', titleColor: '#1D4ED8' },
  math:     { bg: '#FFF7ED', ring: '#FB923C', barColor: '#F97316', titleColor: '#9A3412' },
  logic:    { bg: '#F5F3FF', ring: '#A78BFA', barColor: '#8B5CF6', titleColor: '#6D28D9' },
};

// Cycles through a list of icons/labels one by one with spring animation
const AnimatedCardIcon = ({ icons, delay = 0 }: { icons: string[]; delay?: number }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % icons.length), 1000 + delay);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icons.length]);
  const curr = icons[idx];
  const isText = ['A','B','C','D','E','Tall','Small','Big','Short'].includes(curr);
  return (
    <div style={{ height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="leading-none select-none"
          style={isText ? { fontSize: 42, fontWeight: 900 } : { fontSize: 56 }}
          initial={{ opacity: 0, scale: 0.4, y: 22 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          transition={{ duration: 0.36, type: 'spring', stiffness: 320, damping: 22 }}
        >
          {curr}
        </motion.span>
      </AnimatePresence>
    </div>
  );
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

export default function KidsMainPage() {
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState<Record<string, ModuleProgress>>({});

  useEffect(() => {
    const map: Record<string, ModuleProgress> = {};
    KIDS_DATA.forEach(g => { 
      if (g.id === 'visuallogic') {
        const visualLogicIds = [
          "big", "small", "big-small-mix", "tall", "short", "tall-short", 
          "above", "below", "above-below-mix", "inside", "outside", "inside-outside-mix", 
          "full", "empty", "full-empty", "same", "different"
        ];
        map[g.id] = getAggregateProgress(g.id, visualLogicIds);
      } else {
        map[g.id] = getProgress(g.id, g.totalScenarios); 
      }
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
    <div className="w-full flex flex-col items-center bg-[#FDFBF7] font-sans select-none relative pb-10 overflow-hidden min-h-full">
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
              <p className="text-xs sm:text-sm font-semibold text-[#A68B7C] leading-none mt-0.5">What do you want to learn today?</p>
            </div>
          </div>
        </motion.div>

        {/* 4-per-row grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {KIDS_DATA.map((game, idx) => {
            const colors = categoryColors[game.category] ?? categoryColors.logic;
            const prog = progressMap[game.id];
            const isNew = !prog || prog.visitCount === 0;
            const pct  = prog
              ? Math.round((prog.scenariosCompletedBest / Math.max(prog.totalScenarios, 1)) * 100)
              : 0;
            const isDone = pct >= 100;

            return (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: (idx % 2) * 0.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  recordVisit(game.id, game.totalScenarios);
                  navigate(game.path);
                }}
                className="relative flex flex-col items-center gap-2 rounded-3xl p-4 text-center shadow-md active:shadow-sm border-2 transition-all"
                style={{ background: colors.bg, borderColor: colors.ring + '55' }}
              >
                {/* Status sticker */}
                {isNew && (
                  <motion.span
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full leading-none"
                  >
                    NEW
                  </motion.span>
                )}
                {isDone && (
                  <span className="absolute top-2 right-2 text-[15px] leading-none">⭐</span>
                )}

                {/* Big emoji — cycles through subject-specific icons */}
                <AnimatedCardIcon icons={game.icons} delay={idx * 180} />

                {/* Title only — no subtitle, no category badge */}
                <span className="font-black text-[15px] leading-tight" style={{ color: colors.titleColor }}>
                  {game.title}
                </span>

                {/* Progress bar — no percentage text */}
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: colors.ring + '30' }}>
                  {!isNew && (
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: (idx % 2) * 0.08 + 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: colors.barColor }}
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

      </div>
    </div>
  );
}