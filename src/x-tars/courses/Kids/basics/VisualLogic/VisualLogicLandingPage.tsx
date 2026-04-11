/**
 * VisualLogicLandingPage.tsx — Screen-2 redesign
 * Animated concept cards that visually SHOW the concept (no raw emojis, no %).
 * Locked / NEW badges — level dots instead of progress %.
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock } from 'lucide-react';
import { useProfile } from '../../../../../context/ProfileContext';
import KidAvatar from '../../../CommonUtility/KidAvatar';
import { getProgress } from '../../../CommonUtility/useModuleProgress';

// ─── Course data ────────────────────────────────────────────────────────────
interface CourseEntry {
  id:         string;
  title:      string;
  path:       string;
  total:      number;
  /** Large emoji representing the primary concept */
  bigEmoji:   string;
  /** Small emoji representing the secondary concept */
  smallEmoji: string;
  /** Background gradient for the concept card image area */
  cardGrad:   string;
  unlockBy?:  string;
  isNew?:     boolean;
}

const COURSES: CourseEntry[] = [
  // ── Size ──────────────────────────────────────────────────────────────────
  { id: 'big',           title: 'Big',              path: '/games/visuallogic/big',
    bigEmoji: '🐘', smallEmoji: '🐜',
    cardGrad: 'linear-gradient(135deg,#a8edea,#3dd6cb,#0d9488)', total: 24, isNew: true },
  { id: 'small',         title: 'Small',            path: '/games/visuallogic/small',
    bigEmoji: '🐜', smallEmoji: '🐾',
    cardGrad: 'linear-gradient(135deg,#d1fae5,#6ee7b7,#059669)', total: 24 },
  { id: 'bigsmallmix',   title: 'Big & Small',      path: '/games/visuallogic/big-small-mix',
    bigEmoji: '🐘', smallEmoji: '🐭',
    cardGrad: 'linear-gradient(135deg,#a8edea,#fde68a,#0d9488)', total: 24 },
  // ── Height ────────────────────────────────────────────────────────────────
  { id: 'tall',          title: 'Tall',             path: '/games/visuallogic/tall',
    bigEmoji: '🦒', smallEmoji: '🌵',
    cardGrad: 'linear-gradient(135deg,#c9f0ff,#62c8f5,#0284c7)', total: 24 },
  { id: 'short',         title: 'Short',            path: '/games/visuallogic/short',
    bigEmoji: '🐢', smallEmoji: '🌱',
    cardGrad: 'linear-gradient(135deg,#d1fae5,#a7f3d0,#047857)', total: 24 },
  { id: 'tallshort',     title: 'Tall & Short',     path: '/games/visuallogic/tall-short',
    bigEmoji: '🦒', smallEmoji: '🐢',
    cardGrad: 'linear-gradient(135deg,#c9f0ff,#d1fae5,#0284c7)', total: 24 },
  // ── Position ──────────────────────────────────────────────────────────────
  { id: 'above',         title: 'Above',            path: '/games/visuallogic/above',
    bigEmoji: '☁️', smallEmoji: '🌤️',
    cardGrad: 'linear-gradient(135deg,#bfdbfe,#60a5fa,#1d4ed8)', total: 24 },
  { id: 'below',         title: 'Below',            path: '/games/visuallogic/below',
    bigEmoji: '🌿', smallEmoji: '🐛',
    cardGrad: 'linear-gradient(135deg,#d1fae5,#86efac,#166534)', total: 24 },
  { id: 'abovebelow',    title: 'Above & Below',    path: '/games/visuallogic/above-below',
    bigEmoji: '☁️', smallEmoji: '🌿',
    cardGrad: 'linear-gradient(135deg,#bfdbfe,#d1fae5,#1d4ed8)', total: 24 },
  // ── Container ─────────────────────────────────────────────────────────────
  { id: 'inside',        title: 'Inside',           path: '/games/visuallogic/inside',
    bigEmoji: '🐱', smallEmoji: '📦',
    cardGrad: 'linear-gradient(135deg,#fce7f3,#f9a8d4,#be185d)', total: 24 },
  { id: 'outside',       title: 'Outside',          path: '/games/visuallogic/outside',
    bigEmoji: '🐶', smallEmoji: '🏡',
    cardGrad: 'linear-gradient(135deg,#fef3c7,#fcd34d,#b45309)', total: 24 },
  { id: 'insideoutside', title: 'Inside & Outside', path: '/games/visuallogic/inside-outside',
    bigEmoji: '🐱', smallEmoji: '🦮',
    cardGrad: 'linear-gradient(135deg,#fce7f3,#fef3c7,#be185d)', total: 24 },
  // ── Quantity ──────────────────────────────────────────────────────────────
  { id: 'full',          title: 'Full',             path: '/games/visuallogic/full',
    bigEmoji: '🧃', smallEmoji: '🍶',
    cardGrad: 'linear-gradient(135deg,#e0e7ff,#a5b4fc,#4338ca)', total: 24 },
  { id: 'empty',         title: 'Empty',            path: '/games/visuallogic/empty',
    bigEmoji: '🫙', smallEmoji: '🥤',
    cardGrad: 'linear-gradient(135deg,#f3f4f6,#d1d5db,#374151)', total: 24 },
  { id: 'fullempty',     title: 'Full & Empty',     path: '/games/visuallogic/full-empty',
    bigEmoji: '🧃', smallEmoji: '🫙',
    cardGrad: 'linear-gradient(135deg,#e0e7ff,#f3f4f6,#4338ca)', total: 24 },
  // ── Comparison ────────────────────────────────────────────────────────────
  { id: 'same',          title: 'Same & Different', path: '/games/visuallogic/same',
    bigEmoji: '🍎', smallEmoji: '🍌',
    cardGrad: 'linear-gradient(135deg,#fef9c3,#fde68a,#d97706)', total: 16 },
];

// ─── Concept Preview card with cycling animation ─────────────────────────────
const ConceptPreview: React.FC<{
  bigEmoji: string; smallEmoji: string; cardGrad: string; locked: boolean;
}> = ({ bigEmoji, smallEmoji, cardGrad, locked }) => (
  <div
    className="relative w-full rounded-xl overflow-hidden"
    style={{ aspectRatio: '16/9', background: locked ? '#e5e7eb' : cardGrad }}
  >
    {!locked ? (
      <div className="absolute inset-0 flex items-end justify-center pb-3 gap-8">
        <motion.span
          className="text-[72px] leading-none select-none drop-shadow-xl"
          animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >{bigEmoji}</motion.span>
        <motion.span
          className="text-[48px] leading-none select-none drop-shadow-lg"
          animate={{ y: [0, 8, 0], rotate: [2, -2, 2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >{smallEmoji}</motion.span>
      </div>
    ) : (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-200/80">
        <Lock size={40} color="#9ca3af" strokeWidth={2} />
      </div>
    )}
  </div>
);

// ─── Level dots (replaces percentage) ────────────────────────────────────────
const LevelDots: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const filled = Math.round(pct / 20);  // 0-5 dots out of 5
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: 10, height: 10,
            background: i < filled ? color : 'rgba(52,47,0,0.12)',
          }}
        />
      ))}
    </div>
  );
};

// ─── Course card ─────────────────────────────────────────────────────────────
const CourseCard: React.FC<{
  entry: CourseEntry; index: number; unlockPct: number; onTap: () => void;
}> = ({ entry, index, unlockPct, onTap }) => {
  const p = getProgress(entry.id, entry.total);
  const pct    = p ? Math.round((p.scenariosCompletedBest / Math.max(p.totalScenarios, 1)) * 100) : 0;
  const locked = entry.unlockBy !== undefined && unlockPct < 80;
  const done   = pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.07 }}
      className="group relative rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(52,47,0,0.06)]"
      style={{ background: '#ffffff', border: '1px solid rgba(52,47,0,0.06)' }}
    >
      {/* NEW badge */}
      {entry.isNew && !locked && (
        <div className="absolute top-4 right-4 z-20">
          <span className="font-black text-xs px-4 py-1.5 rounded-full" style={{ background: '#ff8eaf', color: '#66002f' }}>NEW</span>
        </div>
      )}

      {/* Concept preview */}
      <div className="group-hover:-translate-y-1 transition-transform duration-300 p-4 pb-0">
        <ConceptPreview
          bigEmoji={entry.bigEmoji}
          smallEmoji={entry.smallEmoji}
          cardGrad={entry.cardGrad}
          locked={locked}
        />
      </div>

      {/* Card body */}
      <div className="px-5 pt-4 pb-5">
        <h3 className="font-black text-2xl mb-3" style={{ color: '#342f00' }}>{entry.title}</h3>

        {!locked && (
          <div className="flex items-center justify-between mb-4">
            <LevelDots pct={pct} color={done ? '#3c6600' : '#005f99'} />
          </div>
        )}

        {locked ? (
          <div className="w-full py-4 rounded-full flex items-center justify-center gap-2" style={{ background: 'rgba(52,47,0,0.05)' }}>
            <Lock size={16} color="#342f00" style={{ opacity: 0.4 }} />
            <span className="font-bold text-lg" style={{ color: 'rgba(52,47,0,0.4)' }}>Locked</span>
          </div>
        ) : done ? (
          <button onClick={onTap} className="w-full py-4 rounded-full font-bold text-lg transition-all hover:scale-[0.98] active:scale-95"
            style={{ background: '#b9f474', color: '#342f00', boxShadow: '0 4px 0 #3c6600' }}>
            Play Again
          </button>
        ) : (
          <button onClick={onTap} className="w-full py-4 rounded-full font-bold text-lg transition-all hover:scale-[0.98] active:scale-95"
            style={{ background: '#005f99', color: '#ecf3ff', boxShadow: '0 4px 0 #005386' }}>
            Play Now
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────
const VisualLogicLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const kidAvatar = activeProfile?.avatar ?? 'bird';

  const progressMap = useMemo(() => {
    const m: Record<string, number> = {};
    COURSES.forEach(c => {
      const p = getProgress(c.id, c.total);
      m[c.id] = p ? Math.round((p.scenariosCompletedBest / Math.max(p.totalScenarios, 1)) * 100) : 0;
    });
    return m;
  }, []);

  const handleBack = () => { if (onBack) { onBack(); return; } navigate(-1); };
  const nav = (path: string) => navigate(path, { state: { fromProfileSelection: true } });

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#fff7cc' }}>
      {/* Top nav */}
      <div
        className="flex-none flex items-center justify-between px-5 rounded-b-[2rem] shadow-[0_8px_32px_rgba(52,47,0,0.08)] z-50"
        style={{ background: '#fff7cc', paddingTop: 'env(safe-area-inset-top, 14px)', paddingBottom: 14 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-full transition-transform active:scale-95"
            style={{ background: '#fff394' }}
          >
            <ChevronLeft size={24} color="#342f00" strokeWidth={2.5} />
          </button>
          <p className="font-black text-2xl tracking-tight" style={{ color: '#342f00' }}>Pick a Game!</p>
        </div>
        <div className="w-12 h-12 shrink-0 flex items-center justify-center">
          <KidAvatar avatar={kidAvatar} size={48} />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="px-4 pt-4 pb-8">

          {/* Subject pill */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs tracking-widest uppercase"
              style={{ background: '#b9f474', color: '#294700' }}>
              ✨ Visual Logic
            </span>
          </div>

          {/* Hero */}
          <header className="relative flex items-center gap-5 rounded-2xl overflow-hidden p-5 mb-6" style={{ background: '#fff394' }}>
            <div className="flex-1 z-10">
              <h2 className="font-black leading-[1.1] mb-2" style={{ fontSize: 30, color: '#342f00' }}>
                Master the art of{" "}
                <span style={{ color: '#005f99' }}>observing</span>.
              </h2>
              <p className="text-sm" style={{ color: '#655d00' }}>
                Help Dino find differences, sort by size, and match shapes!
              </p>
            </div>
            <div className="relative shrink-0 flex items-center justify-center" style={{ width: 88, height: 88 }}>
              <KidAvatar avatar={kidAvatar} size={88} />
            </div>
          </header>

          {/* Courses grid */}
          <div className="grid grid-cols-1 gap-5">
            {COURSES.map((entry, i) => {
              const unlockPct = entry.unlockBy ? (progressMap[entry.unlockBy] ?? 0) : 100;
              return (
                <CourseCard
                  key={entry.id}
                  entry={entry}
                  index={i}
                  unlockPct={unlockPct}
                  onTap={() => nav(entry.path)}
                />
              );
            })}
          </div>

          {/* Daily challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.45 }}
            className="mt-6 rounded-2xl overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg,#005f99,#44a6f6)', boxShadow: '0 12px 40px rgba(0,95,153,0.2)' }}
          >
            <div className="absolute -right-4 -top-4 opacity-20 text-[120px] leading-none">⭐</div>
            <div className="p-6">
              <p className="font-black text-sm mb-1 uppercase tracking-widest" style={{ color: 'rgba(236,243,255,0.8)' }}>Shape Builder</p>
              <h3 className="font-black text-2xl mb-4" style={{ color: '#ecf3ff' }}>Daily Challenge!</h3>
              <button
                className="w-full py-4 rounded-full font-bold text-lg"
                style={{ background: '#ffffff', color: '#005f99' }}
                onClick={() => nav('/games/visuallogic/big')}
              >
                Start Challenge
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisualLogicLandingPage;
