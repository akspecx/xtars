/**
 * AlphabetGamesLandingPage.tsx
 * Redesigned to match VisualLogicLandingPage style:
 * animated concept cards, Figma color tokens, level dots, no %.
 */
import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useProfile } from '../../../../../context/ProfileContext';
import KidAvatar from '../../../CommonUtility/KidAvatar';
import { getProgress } from '../../../CommonUtility/useModuleProgress';

// ─── Game catalogue ──────────────────────────────────────────────────────────
interface AlphGame {
  id:         string;
  title:      string;
  path:       string;
  total:      number;
  emoji1:     string;
  emoji2:     string;
  cardGrad:   string;
  isNew?:     boolean;
  /** Extra icons to cycle through in the preview card */
  extraEmojis?: string[];
}

const GAMES: AlphGame[] = [
  // ★ Module 1 — Objects Around Us
  { id: 'daily-objects', title: 'Objects Around Us', path: '/games/alphabets/daily-objects', total: 30,
    emoji1: '�', emoji2: '🐘', cardGrad: 'linear-gradient(135deg,#e0f2fe,#7dd3fc,#0369a1)', isNew: true,
    extraEmojis: ['🍊', '🐴', '🐮', '🦁', '🌙', '⭐', '☀️', '🚗', '📚'] },
  // ★ Module 2 — Introduction to Alphabets (Meet / Sound / Object)
  { id: 'letter-intro-A', title: 'Introduction to Alphabets', path: '/games/alphabets/letter-intro/A', total: 26,
    emoji1: 'A', emoji2: 'a', cardGrad: 'linear-gradient(135deg,#fce7f3,#fda4af,#e11d48)', isNew: true,
    extraEmojis: ['B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F'] },
  // ★ Module 3 — Bubble Pop
  { id: 'bubble-pop', title: 'Bubble Pop', path: '/games/alphabets/bubble-pop', total: 26,
    emoji1: '\uD83E\uDEE7', emoji2: 'A', cardGrad: 'linear-gradient(135deg,#e0f2fe,#bae6fd,#0284c7)', isNew: true,
    extraEmojis: ['\uD83E\uDEE7', 'B', '\uD83E\uDEE7', 'C', '\uD83E\uDEE7', 'D', '\uD83E\uDEE7', 'E'] },
  // ★ Module 5 — Stepping Stones A to Z
  { id: 'stepping-stones', title: 'Stepping Stones A\u2192Z', path: '/games/alphabets/stepping-stones', total: 26,
    emoji1: '\uD83E\uDEA8', emoji2: 'A', cardGrad: 'linear-gradient(135deg,#f0fdf4,#86efac,#16a34a)', isNew: true,
    extraEmojis: ['\uD83E\uDEA8', 'B', '\uD83E\uDEA8', 'C', '\uD83E\uDEA8', 'Z'] },
  // ★ Module 6 — Building Blocks
  { id: 'building-blocks', title: 'Building Blocks', path: '/games/alphabets/building-blocks', total: 26,
    emoji1: '\uD83E\uDDF1', emoji2: 'A', cardGrad: 'linear-gradient(135deg,#fff7ed,#fdba74,#ea580c)', isNew: true,
    extraEmojis: ['\uD83E\uDDF1', 'B', '\uD83E\uDDF1', 'C', '\uD83E\uDDF1', 'D'] },
  // ★ Module 7 — Frog Jump
  { id: 'frog-jump', title: 'Frog Jump', path: '/games/alphabets/frog-jump', total: 26,
    emoji1: '\uD83D\uDC38', emoji2: '?', cardGrad: 'linear-gradient(135deg,#f0fdf4,#4ade80,#15803d)', isNew: true,
    extraEmojis: ['A', '\uD83D\uDC38', 'B', '\uD83D\uDC38', '?'] },
  // ★ Module 8 — Hungry Caterpillar
  { id: 'hungry-caterpillar', title: 'Hungry Caterpillar', path: '/games/alphabets/hungry-caterpillar', total: 26,
    emoji1: '🐛', emoji2: 'B', cardGrad: 'linear-gradient(135deg,#f0fdf4,#86efac,#15803d)', isNew: true,
    extraEmojis: ['🍃', 'A', '🐛', 'C', '🍃'] },
  // ★ Module 9 — Alphabet Train
  { id: 'abc-train', title: 'Alphabet Train', path: '/games/alphabets/abc-train', total: 26,
    emoji1: '\uD83D\uDE82', emoji2: 'ABC', cardGrad: 'linear-gradient(135deg,#eff6ff,#93c5fd,#1d4ed8)', isNew: true,
    extraEmojis: ['\uD83D\uDE82', 'A', 'B', 'C', '\uD83D\uDE83'] },
  // ★ Module 4 — A for? (quiz: which letter do they start with?)
  { id: 'letter-quiz-A', title: 'A for?', path: '/games/alphabets/letter-quiz/A', total: 26,
    emoji1: '\uD83C\uDF4E', emoji2: '\uD83D\uDC1C', cardGrad: 'linear-gradient(135deg,#fff7cc,#fbeb5b,#d97706)', isNew: true,
    extraEmojis: ['\uD83D\uDEEB', '\uD83D\uDC1B', '\u26BD', '\uD83C\uDF4C', '\uD83D\uDC31', '\uD83D\uDC42'] },
  // ★ Full letter learning journey
  { id: 'letter-journey', title: 'Letter Learning Journey', path: '/games/alphabets/letter-journey', total: 26,
    emoji1: '🔠', emoji2: '✈️', cardGrad: 'linear-gradient(135deg,#fff7cc,#fbeb5b,#f0e037)', isNew: true },
  // Recognition
  { id: 'match',          title: 'Letter Match',          path: '/games/alphabets/letter-match',     total: 26, emoji1: '🔠', emoji2: '🅰️', cardGrad: 'linear-gradient(135deg,#fde68a,#f59e0b,#d97706)', isNew: true },
  { id: 'caseMatching',   title: 'Uppercase / Lowercase', path: '/games/alphabets/case-matching',    total: 26, emoji1: '🔡', emoji2: '🔠', cardGrad: 'linear-gradient(135deg,#bfdbfe,#60a5fa,#1d4ed8)' },
  { id: 'objectMatching', title: 'Letter-Object Match',   path: '/games/alphabets/object-matching',  total: 26, emoji1: '🎯', emoji2: '🍎', cardGrad: 'linear-gradient(135deg,#fce7f3,#f9a8d4,#be185d)' },
  { id: 'beginSound',     title: 'Beginning Sounds',      path: '/games/alphabets/begin-sound',      total: 26, emoji1: '🔈', emoji2: '🐝', cardGrad: 'linear-gradient(135deg,#c9f0ff,#62c8f5,#0284c7)' },
  { id: 'findTap',        title: 'Find & Tap Letters',    path: '/games/alphabets/find-tap',          total: 26, emoji1: '🔍', emoji2: '👀', cardGrad: 'linear-gradient(135deg,#a8edea,#3dd6cb,#0d9488)' },
  { id: 'arrange',        title: 'Arranging Alphabets',   path: '/games/alphabets/sequence',         total: 26, emoji1: '🔡', emoji2: '📋', cardGrad: 'linear-gradient(135deg,#d1fae5,#6ee7b7,#059669)' },
  // Writing
  { id: 'tracing',        title: 'Trace the Letters',     path: '/games/alphabets/tracing',          total: 26, emoji1: '✍️', emoji2: '📝', cardGrad: 'linear-gradient(135deg,#e0e7ff,#a5b4fc,#4338ca)' },
  { id: 'pre-writing',    title: 'Pre-Writing Strokes',   path: '/games/alphabets/pre-writing',      total: 20, emoji1: '✏️', emoji2: '〰️', cardGrad: 'linear-gradient(135deg,#fef9c3,#fde68a,#b45309)' },
  { id: 'nameBuilder',    title: 'Build Your Name',       path: '/games/alphabets/name-builder',     total: 10, emoji1: '✍️', emoji2: '🏷️', cardGrad: 'linear-gradient(135deg,#fce7f3,#c084fc,#7e22ce)' },
  // Sounds & Phonics
  { id: 'soundGarden',    title: 'Alphabet Sound Garden', path: '/games/alphabets/counting',         total: 26, emoji1: '🎵', emoji2: '🎶', cardGrad: 'linear-gradient(135deg,#d1fae5,#34d399,#065f46)' },
  { id: 'rhyming',        title: 'Rhyming Friends',       path: '/games/alphabets/rhyming',          total: 20, emoji1: '🎵', emoji2: '🐝', cardGrad: 'linear-gradient(135deg,#fef3c7,#fbbf24,#92400e)' },
  { id: 'blending',       title: 'Blending Bridge',       path: '/games/alphabets/blending',         total: 20, emoji1: '🌉', emoji2: '🔊', cardGrad: 'linear-gradient(135deg,#bfdbfe,#818cf8,#3730a3)' },
  // Words & Building
  { id: 'fillBlanks',     title: 'Fill in the Blanks',    path: '/games/alphabets/fill-blanks',      total: 20, emoji1: '🚂', emoji2: '🔤', cardGrad: 'linear-gradient(135deg,#fce7f3,#f43f5e,#9f1239)' },
  { id: 'cvc-builder',    title: 'CVC Word Builder',      path: '/games/alphabets/cvc-builder',      total: 20, emoji1: '🏗️', emoji2: '📖', cardGrad: 'linear-gradient(135deg,#c9f0ff,#0ea5e9,#0c4a6e)' },
  { id: 'word-families',  title: 'Word Family Houses',    path: '/games/alphabets/word-families',    total: 20, emoji1: '🏠', emoji2: '📚', cardGrad: 'linear-gradient(135deg,#fde68a,#fb923c,#9a3412)' },
  { id: 'sentence-builder', title: 'Sentence Builder',   path: '/games/alphabets/sentence-builder', total: 15, emoji1: '📝', emoji2: '💬', cardGrad: 'linear-gradient(135deg,#a8edea,#67e8f9,#164e63)' },
  { id: 'compound-words', title: 'Compound Word Factory', path: '/games/alphabets/compound-words',   total: 15, emoji1: '🏭', emoji2: '🔗', cardGrad: 'linear-gradient(135deg,#e9d5ff,#a855f7,#581c87)' },
  // Stories & Fun
  { id: 'storyCards',     title: 'Alphabet Story Cards',  path: '/games/alphabets/story-cards',      total: 26, emoji1: '📖', emoji2: '🌟', cardGrad: 'linear-gradient(135deg,#fef9c3,#fde68a,#713f12)' },
  { id: 'fruitNaming',    title: 'Fruit Naming',          path: '/games/alphabets/fruit-naming',     total: 20, emoji1: '🍎', emoji2: '🍌', cardGrad: 'linear-gradient(135deg,#d1fae5,#86efac,#14532d)' },
  { id: 'letter-safari',  title: 'Letter Hunt Safari',    path: '/games/alphabets/letter-safari',    total: 26, emoji1: '🦁', emoji2: '🌴', cardGrad: 'linear-gradient(135deg,#fde68a,#4ade80,#166534)' },
  { id: 'dance-party',    title: 'Alphabet Dance Party',  path: '/games/alphabets/dance-party',      total: 26, emoji1: '💃', emoji2: '🕺', cardGrad: 'linear-gradient(135deg,#fce7f3,#f472b6,#831843)' },
  // Sorting & Matching
  { id: 'sorting',        title: 'Letter Sorting',        path: '/games/alphabets/sorting',          total: 20, emoji1: '📦', emoji2: '🔤', cardGrad: 'linear-gradient(135deg,#c7d2fe,#6366f1,#312e81)' },
  { id: 'size-sorting',   title: 'Letter Size Sorting',   path: '/games/alphabets/size-sorting',     total: 20, emoji1: '📐', emoji2: '🅰️', cardGrad: 'linear-gradient(135deg,#fde68a,#f97316,#7c2d12)' },
  { id: 'randomAlphabets', title: 'Random Alphabet',      path: '/games/alphabets/random-balloon',   total: 26, emoji1: '❓', emoji2: '🎈', cardGrad: 'linear-gradient(135deg,#e9d5ff,#c084fc,#4a044e)' },
  { id: 'letterPuzzle',   title: 'Build the Letter',      path: '/games/alphabets/letter-puzzle',    total: 26, emoji1: '🧩', emoji2: '🔠', cardGrad: 'linear-gradient(135deg,#bfdbfe,#a5b4fc,#1e3a5f)' },
  { id: 'letterMaze',     title: 'Letter Path Maze',      path: '/games/alphabets/path-maze',        total: 20, emoji1: '🧭', emoji2: '🗺️', cardGrad: 'linear-gradient(135deg,#fef3c7,#fbbf24,#78350f)' },
  { id: 'descending',     title: 'Reverse Alphabet',      path: '/games/alphabets/descending',       total: 26, emoji1: '🔙', emoji2: '🔤', cardGrad: 'linear-gradient(135deg,#fce7f3,#fb7185,#881337)' },
  { id: 'print-match',    title: 'Print Match',           path: '/games/alphabets/print-match',      total: 20, emoji1: '🏪', emoji2: '📰', cardGrad: 'linear-gradient(135deg,#a8edea,#22d3ee,#155e75)' },
  { id: 'uppercaseUsage', title: 'Uppercase or Lowercase?', path: '/games/alphabets/uppercase-usage', total: 26, emoji1: '🔡', emoji2: '🔠', cardGrad: 'linear-gradient(135deg,#d1fae5,#4ade80,#14532d)' },
  { id: 'alphabet-chef',  title: 'Alphabet Chef',         path: '/games/alphabets/alphabet-chef',    total: 20, emoji1: '👨‍🍳', emoji2: '🍕', cardGrad: 'linear-gradient(135deg,#fde68a,#f87171,#7f1d1d)' },
  { id: 'sight-words',    title: 'Sight Word Stars',      path: '/games/alphabets/sight-words',      total: 20, emoji1: '⭐', emoji2: '📖', cardGrad: 'linear-gradient(135deg,#fef9c3,#fbbf24,#451a03)' },
];

// ─── Concept preview card — icons cycle one by one ──────────────────────────
const GamePreview: React.FC<{ g: AlphGame }> = ({ g }) => {
  const icons = g.extraEmojis ? [g.emoji1, g.emoji2, ...g.extraEmojis] : [g.emoji1, g.emoji2];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % icons.length), 1100);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [icons.length]);
  return (
    <div
      className="relative w-full rounded-xl overflow-hidden flex items-center justify-center"
      style={{ aspectRatio: '16/9', background: g.cardGrad }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="text-[64px] leading-none select-none drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.4, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -25 }}
          transition={{ duration: 0.38, type: 'spring', stiffness: 300, damping: 22 }}
        >
          {icons[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// ─── Level dots ───────────────────────────────────────────────────────────────
const LevelDots: React.FC<{ pct: number; color: string }> = ({ pct, color }) => {
  const filled = Math.round(pct / 20);
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{ width: 10, height: 10, background: i < filled ? color : 'rgba(52,47,0,0.12)' }}
        />
      ))}
    </div>
  );
};

// ─── Game card ────────────────────────────────────────────────────────────────
const GameCard: React.FC<{ g: AlphGame; onClick: () => void; index: number }> = ({ g, onClick, index }) => {
  const prog = getProgress(g.id, g.total);
  const done = prog ? prog.scenariosCompletedBest : 0;
  const pct  = Math.round((done / Math.max(g.total, 1)) * 100);
  const started = done > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.32, delay: index * 0.07, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden shadow-lg"
      style={{ background: '#fff', border: '2px solid #fbeb5b' }}
    >
      {/* NEW badge */}
      {g.isNew && (
        <div className="flex justify-end px-3 pt-2">
          <span className="text-xs font-black rounded-full px-3 py-0.5" style={{ background: '#ff8eaf', color: '#fff' }}>NEW ✨</span>
        </div>
      )}

      <div className="p-3">
        <GamePreview g={g} />
      </div>

      {/* Info row */}
      <div className="px-4 pb-2">
        <p className="font-black text-base" style={{ color: '#342f00' }}>{g.title}</p>
        <LevelDots pct={pct} color="#b9f474" />
      </div>

      {/* Button */}
      <div className="px-4 pb-4 pt-1">
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={onClick}
          className="w-full py-3 rounded-xl font-black text-base shadow-md"
          style={{
            background: started ? '#b9f474' : '#005f99',
            color: started ? '#342f00' : '#fff',
            boxShadow: started ? '0 3px 0 #7ec84a' : '0 3px 0 #005386',
          }}
        >
          {started ? '▶ Play Again' : '▶ Play Now'}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const AlphabetGamesLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const kidName   = activeProfile?.name  ?? 'Explorer';
  const kidAvatar = activeProfile?.avatar ?? 'default';

  const progressMap = useMemo(() => {
    const m: Record<string, number> = {};
    GAMES.forEach(g => {
      const prog = getProgress(g.id, g.total);
      m[g.id] = prog ? Math.round((prog.scenariosCompletedBest / Math.max(g.total, 1)) * 100) : 0;
    });
    return m;
  }, []);

  const totalDone = useMemo(() =>
    GAMES.reduce((sum, g) => sum + (getProgress(g.id, g.total)?.scenariosCompletedBest ?? 0), 0),
  []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden" style={{ background: '#fff7cc' }}>

      {/* ── Nav bar ── */}
      <nav className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 shadow-sm"
        style={{ background: '#fff394', borderBottom: '2px solid #fbeb5b' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/games')}
          className="h-10 w-10 flex items-center justify-center rounded-xl shadow"
          style={{ background: '#fbeb5b' }}
        >
          <ChevronLeft size={22} color="#342f00" strokeWidth={3} />
        </motion.button>

        <p className="flex-1 font-black text-lg text-center" style={{ color: '#342f00' }}>
          Pick a Game!
        </p>

        <div className="h-10 w-10 flex items-center justify-center">
          <KidAvatar avatar={kidAvatar} size={36} />
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="px-5 py-6" style={{ background: '#fff394' }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="px-3 py-1 rounded-full font-black text-sm" style={{ background: '#b9f474', color: '#342f00' }}>
              ✨ Alphabets
            </span>
            <h1 className="font-black mt-2 leading-tight" style={{ fontSize: 32, color: '#342f00' }}>
              Master the ABCs!
            </h1>
            <p className="font-bold mt-1" style={{ color: '#655d00', fontSize: 15 }}>
              {GAMES.length} fun games for {kidName}
            </p>
          </div>
          <div className="h-24 w-24 flex items-center justify-center shrink-0">
            <KidAvatar avatar={kidAvatar} size={88} />
          </div>
        </div>
      </section>

      {/* ── Cards grid ── */}
      <main className="flex-1 px-4 py-5 pb-24">
        <div className="grid grid-cols-2 gap-4">
          {GAMES.map((g, idx) => (
            <GameCard
              key={g.id}
              g={g}
              index={idx}
              onClick={() => navigate(g.path)}
            />
          ))}
        </div>
      </main>

    </div>
  );
};

export default AlphabetGamesLandingPage;

