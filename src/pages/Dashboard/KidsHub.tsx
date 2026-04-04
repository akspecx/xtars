import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  Search, BookOpen, BarChart2, User,
  ChevronRight, Sun, Moon, Lock, X, Star
} from 'lucide-react';
import { useMode } from '../../context/ModeContext';
import { useProfile, AVATAR_OPTIONS } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import KidAvatar from '../../x-tars/courses/CommonUtility/KidAvatar';


// ─── Types ───────────────────────────────────────────────────────────────────

type TabType = 'courses' | 'analytics' | 'account';

interface SubModule {
  id: string;
  title: string;
  emoji: string;
  path: string;
  color: string;
}

type AnimType = 'bounce' | 'spin' | 'wiggle' | 'float' | 'pulse' | 'swing';

interface Category {
  id: string;
  title: string;
  emoji: string;
  illustration: string[];
  path: string;
  gradient: string;
  gradientColors: [string, string];
  accent: string;
  subModules: SubModule[];
}

// ─── Course Data ──────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'visual-logic',
    title: 'Visual Logic',
    emoji: '🧩',
    illustration: ['🧩','🐵','🐘','🐣','🔍'],
    path: '/games/visuallogic',
    gradient: 'from-violet-500 to-purple-700',
    gradientColors: ['#7c3aed','#4c1d95'],
    accent: '#7c3aed',
    animType: 'wiggle',
    subModules: [
      { id: 'vl1', title: 'Animal Match', emoji: '🐵', path: '/games/visuallogic/animalMatching', color: 'bg-purple-400' },
      { id: 'vl2', title: 'Fruit Match', emoji: '🍎', path: '/games/visuallogic/fruitsMatching', color: 'bg-pink-400' },
      { id: 'vl3', title: 'Same Pictures', emoji: '🎭', path: '/games/visuallogic/samePictures', color: 'bg-indigo-400' },
      { id: 'vl4', title: 'Big & Small', emoji: '🐘', path: '/games/visuallogic/bigSmall', color: 'bg-violet-400' },
      { id: 'vl5', title: 'Tall & Short', emoji: '🦒', path: '/games/visuallogic/tallShort', color: 'bg-fuchsia-400' },
      { id: 'vl6', title: 'Full & Empty', emoji: '🪣', path: '/games/visuallogic/fullEmpty', color: 'bg-purple-300' },
      { id: 'vl7', title: 'Inside & Out', emoji: '📦', path: '/games/visuallogic/insideOutside', color: 'bg-indigo-300' },
      { id: 'vl8', title: 'Above & Below', emoji: '🌤️', path: '/games/visuallogic/aboveBelow', color: 'bg-violet-500' },
    ],
  },
  {
    id: 'numbers',
    title: 'Numbers & Math',
    emoji: '🔢',
    illustration: ['1️⃣','2️⃣','3️⃣','⭐','🧮'],
    path: '/games/numbers',
    gradient: 'from-emerald-400 to-teal-600',
    gradientColors: ['#10b981','#0d9488'],
    accent: '#059669',
    animType: 'bounce',
    subModules: [
      { id: 'n1', title: 'Number Intro', emoji: '1️⃣', path: '/games/numbers/introduction', color: 'bg-emerald-400' },
      { id: 'n2', title: 'Counting', emoji: '🧮', path: '/games/numbers/counting', color: 'bg-teal-400' },
      { id: 'n3', title: 'Identify', emoji: '🔎', path: '/games/numbers/identification', color: 'bg-green-400' },
      { id: 'n4', title: 'Sequence', emoji: '📈', path: '/games/numbers/sequence', color: 'bg-emerald-500' },
      { id: 'n5', title: 'Tracing', emoji: '✏️', path: '/games/numbers/tracing', color: 'bg-teal-500' },
      { id: 'n6', title: 'Add Animals', emoji: '🐑', path: '/games/numbers/addAnimals', color: 'bg-green-500' },
      { id: 'n7', title: 'Matching', emoji: '🔗', path: '/games/numbers/matching', color: 'bg-emerald-300' },
      { id: 'n8', title: 'Zero Hero', emoji: '0️⃣', path: '/games/numbers/zeroHero', color: 'bg-teal-300' },
    ],
  },
  {
    id: 'alphabets',
    title: 'ABC & Letters',
    emoji: '📚',
    illustration: ['🅰️','🅱️','🐱','✍️','🎶'],
    path: '/games/alphabets',
    gradient: 'from-amber-400 to-orange-500',
    gradientColors: ['#f59e0b','#f97316'],
    accent: '#d97706',
    animType: 'float',
    subModules: [
      { id: 'a1', title: 'Tracing', emoji: '✍️', path: '/games/alphabets/tracing', color: 'bg-amber-400' },
      { id: 'a2', title: 'Letter Match', emoji: '🔡', path: '/games/alphabets/letter-match', color: 'bg-orange-400' },
      { id: 'a3', title: 'Story Cards', emoji: '📖', path: '/games/alphabets/story-cards', color: 'bg-yellow-500' },
      { id: 'a4', title: 'Sorting', emoji: '🔠', path: '/games/alphabets/sorting', color: 'bg-amber-500' },
      { id: 'a5', title: 'Dance Party', emoji: '🕺', path: '/games/alphabets/dance-party', color: 'bg-orange-500' },
      { id: 'a6', title: 'Rhyming', emoji: '🎵', path: '/games/alphabets/rhyming', color: 'bg-amber-300' },
      { id: 'a7', title: 'CVC Words', emoji: '🐱', path: '/games/alphabets/cvc-words', color: 'bg-yellow-400' },
      { id: 'a8', title: 'Sentence', emoji: '📝', path: '/games/alphabets/sentence-builder', color: 'bg-orange-300' },
    ],
  },
  {
    id: 'shapes',
    title: 'Shapes & Colors',
    emoji: '🔺',
    illustration: ['⭕','🔶','🔷','🌈','🎨'],
    path: '/games/shapes',
    gradient: 'from-rose-400 to-pink-600',
    gradientColors: ['#fb7185','#db2777'],
    accent: '#e11d48',
    animType: 'spin',
    subModules: [
      { id: 's1', title: 'Intro to Shapes', emoji: '⭕', path: '/games/shapes/introduction', color: 'bg-rose-400' },
      { id: 's2', title: 'Tree & Home', emoji: '🌲', path: '/games/shapes/treeHome', color: 'bg-pink-400' },
      { id: 's3', title: 'Bear Shape', emoji: '🐻', path: '/games/shapes/bearShape', color: 'bg-red-400' },
      { id: 's4', title: 'Bus Shapes', emoji: '🚌', path: '/games/shapes/busShapes', color: 'bg-rose-500' },
      { id: 's5', title: 'Number Shapes', emoji: '🔢', path: '/games/shapes/numberPuzzles', color: 'bg-pink-500' },
    ],
  },
  {
    id: 'memory',
    title: 'Memory Match',
    emoji: '🧠',
    illustration: ['🃏','💭','🌟','🎯','🔮'],
    path: '/games/memory',
    gradient: 'from-sky-400 to-blue-600',
    gradientColors: ['#38bdf8','#2563eb'],
    accent: '#0284c7',
    animType: 'pulse',
    subModules: [
      { id: 'm1', title: 'Memory Match', emoji: '🃏', path: '/games/memory', color: 'bg-sky-400' },
      { id: 'm2', title: 'Pattern Match', emoji: '🔁', path: '/games/memory', color: 'bg-blue-400' },
    ],
  },
  {
    id: 'puzzles',
    title: 'Sticker Puzzles',
    emoji: '🚀',
    illustration: ['🚀','🌟','⚡','🏆','🎯'],
    path: '/puzzles',
    gradient: 'from-fuchsia-500 to-pink-700',
    gradientColors: ['#d946ef','#be185d'],
    accent: '#a21caf',
    animType: 'swing',
    subModules: [
      { id: 'p1', title: 'Missions', emoji: '🚀', path: '/puzzles/mission', color: 'bg-fuchsia-400' },
      { id: 'p2', title: 'Metric Sum', emoji: '➕', path: '/puzzles/metricSum', color: 'bg-purple-400' },
      { id: 'p3', title: 'Sacred Game', emoji: '⚡', path: '/puzzles/sacredGame', color: 'bg-pink-400' },
    ],
  },
];

const ACCENT_COLORS = [
  { id: 'violet', label: 'Star Purple', class: 'from-violet-500 to-indigo-600' },
  { id: 'rose',   label: 'Cherry Red',  class: 'from-rose-500 to-pink-600' },
  { id: 'amber',  label: 'Sunny Gold',  class: 'from-amber-500 to-orange-500' },
  { id: 'teal',   label: 'Ocean Teal',  class: 'from-teal-500 to-sky-500' },
  { id: 'green',  label: 'Forest',      class: 'from-green-600 to-emerald-600' },
  { id: 'pink',   label: 'Candy Pink',  class: 'from-pink-600 to-purple-600' },
];

const MOCK_PROGRESS: Record<string, number> = {
  'visual-logic': 35,
  'numbers': 60,
  'alphabets': 20,
  'shapes': 0,
  'memory': 0,
  'puzzles': 10,
};

const RATINGS: Record<string, number> = {
  'visual-logic': 4.8,
  'numbers': 4.6,
  'alphabets': 4.5,
  'shapes': 4.7,
  'memory': 4.3,
  'puzzles': 4.9,
};

// ─── Search Modal ─────────────────────────────────────────────────────────────

const SearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allModules = CATEGORIES.flatMap(c =>
    c.subModules.map(s => ({ ...s, category: c.title }))
  );

  const results = query.trim()
    ? allModules.filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-900 m-4 mt-12 rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search games, topics..."
            className="flex-1 text-base outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400"
          />
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        {results.length > 0 && (
          <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
            {results.map(r => (
              <button
                key={r.id}
                onClick={() => { navigate(r.path, { state: { fromProfileSelection: true } }); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
              >
                <span className="text-2xl">{r.emoji}</span>
                <div>
                  <p className="font-bold text-sm text-gray-800 dark:text-white">{r.title}</p>
                  <p className="text-xs text-gray-400">{r.category}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300" />
              </button>
            ))}
          </div>
        )}
        {query.trim() && results.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <span className="text-4xl block mb-2">🔍</span>
            <p className="text-sm">No games found for "{query}"</p>
          </div>
        )}
        {!query.trim() && (
          <div className="p-6 text-center text-gray-400">
            <span className="text-4xl block mb-2">⭐</span>
            <p className="text-sm font-medium">Type to search games!</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Concept-Teaching Icon per Category ──────────────────────────────────────

const CATEGORY_STATIC: Record<string, string> = {
  'visual-logic': '🧩', 'numbers': '🔢', 'alphabets': '📚',
  'shapes': '🔺', 'memory': '🧠', 'puzzles': '🚀',
};

const ConceptIcon: React.FC<{ categoryId: string; isVisible: boolean }> = ({ categoryId, isVisible }) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!isVisible) { setFrame(0); return; }
    const t = setInterval(() => setFrame(f => f + 1), 900);
    return () => clearInterval(t);
  }, [isVisible]);

  // When off-screen: static emoji – no running timers or repeat animations
  if (!isVisible) {
    return <span className="text-4xl select-none opacity-80">{CATEGORY_STATIC[categoryId] ?? '⭐'}</span>;
  }

  // ── Visual Logic: cycles through all 6 concepts ───────────────────────────
  if (categoryId === 'visual-logic') {
    const SCENE_LABELS = ['Big & Small', 'Tall & Short', 'Same!', 'Full & Empty', 'Above & Below', 'Inside & Out'];
    const scene = Math.floor(frame / 2) % SCENE_LABELS.length;
    const tick  = frame % 2;
    const label = SCENE_LABELS[scene];

    const renderScene = () => {
      switch (scene) {
        case 0: return (
          // Big & Small
          <div className="flex items-center justify-center gap-3 w-full h-full">
            <motion.span animate={{ scale: tick === 0 ? 2.1 : 0.45 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
              className="text-2xl select-none leading-none">🐘</motion.span>
            <motion.span animate={{ scale: tick === 0 ? 0.45 : 2.1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              style={{ display: 'inline-block' }}
              className="text-2xl select-none leading-none">🐭</motion.span>
          </div>
        );
        case 1: return (
          // Tall & Short
          <div className="flex items-end justify-center gap-6 w-full pb-3" style={{ height: '100%' }}>
            <motion.span animate={{ scaleY: 1.9 }}
              style={{ transformOrigin: 'bottom', display: 'inline-block' }}
              transition={{ duration: 0.5 }}
              className="text-2xl select-none leading-none">🦒</motion.span>
            <motion.span animate={{ scaleY: 0.55 }}
              style={{ transformOrigin: 'bottom', display: 'inline-block' }}
              transition={{ duration: 0.5 }}
              className="text-2xl select-none leading-none">🐸</motion.span>
          </div>
        );
        case 2: return (
          // Same / Matching
          <div className="flex items-center justify-center gap-3 w-full h-full">
            {['🍎','🍎'].map((e, i) => (
              <motion.span key={i}
                animate={{ scale: [1, 1.4, 1], rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.25 }}
                className="text-3xl select-none leading-none">{e}</motion.span>
            ))}
          </div>
        );
        case 3: return (
          // Full & Empty
          <div className="flex items-center justify-center gap-4 w-full h-full">
            <div className="flex flex-col items-center gap-0.5">
              <motion.span animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-3xl select-none leading-none">🪣</motion.span>
              <span className="text-white text-[8px] font-black uppercase tracking-wide">Full</span>
            </div>
            <div className="flex flex-col items-center gap-0.5 opacity-35">
              <span className="text-3xl select-none leading-none">🪣</span>
              <span className="text-white text-[8px] font-black uppercase tracking-wide">Empty</span>
            </div>
          </div>
        );
        case 4: return (
          // Above & Below
          <div className="flex flex-col items-center justify-between w-full px-4 py-2" style={{ height: '100%' }}>
            <motion.span animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-2xl select-none leading-none">☁️</motion.span>
            <div className="w-full h-px bg-white/35 rounded-full" />
            <motion.span animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-2xl select-none leading-none">🐟</motion.span>
          </div>
        );
        default: return (
          // Inside & Outside
          <div className="flex items-center justify-center w-full h-full">
            <div className="relative w-14 h-14 bg-white/15 rounded-2xl border-2 border-white/40 flex items-center justify-center overflow-hidden">
              <motion.span
                animate={{ x: tick === 0 ? 0 : 22, opacity: tick === 0 ? 1 : 0.15 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-2xl select-none">🐣</motion.span>
            </div>
          </div>
        );
      }
    };

    return (
      <div className="relative flex flex-col items-center justify-center w-full h-full">
        <div className="flex-1 w-full flex items-center justify-center">{renderScene()}</div>
        <AnimatePresence mode="wait">
          <motion.p key={label}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[7px] font-black text-white/70 uppercase tracking-widest pb-1">
            {label}
          </motion.p>
        </AnimatePresence>
      </div>
    );
  }
  // Numbers: 1→2→3→4→5 pop-counting
  if (categoryId === 'numbers') {
    const nums = ['1','2','3','4','5'];
    const active = frame % nums.length;
    return (
      <div className="flex items-center justify-center gap-1 w-full h-full">
        {nums.map((n, i) => (
          <motion.span key={n}
            animate={{ scale: i === active ? 1.9 : 0.6, opacity: i === active ? 1 : 0.25 }}
            transition={{ duration: 0.35 }}
            className="text-xl font-black text-white select-none">{n}</motion.span>
        ))}
      </div>
    );
  }
  // Alphabets: slide A→B→C→D→E
  if (categoryId === 'alphabets') {
    const letters = ['A','B','C','D','E'];
    const idx = frame % letters.length;
    return (
      <AnimatePresence mode="wait">
        <motion.span key={idx}
          initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-5xl font-black text-white select-none leading-none">
          {letters[idx]}
        </motion.span>
      </AnimatePresence>
    );
  }
  // Shapes: spin-in ⭕→🔷→🔶→🔺
  if (categoryId === 'shapes') {
    const shapes = ['⭕','🔷','🔶','🔺'];
    const si = frame % shapes.length;
    return (
      <AnimatePresence mode="wait">
        <motion.span key={si}
          initial={{ rotate: -90, opacity: 0, scale: 0.3 }}
          animate={{ rotate: 0, opacity: 1, scale: 1.5 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-4xl select-none leading-none">
          {shapes[si]}
        </motion.span>
      </AnimatePresence>
    );
  }
  // Memory: card flip reveal
  if (categoryId === 'memory') {
    const revealed = frame % 4 !== 0;
    const pairs = ['🦁','🐻','🦊'];
    const pair = pairs[Math.floor(frame / 4) % pairs.length];
    return (
      <div className="flex items-center justify-center gap-2.5 w-full h-full">
        {[0, 1].map(i => (
          <motion.div key={i}
            animate={{ scaleX: revealed ? 1 : -1 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center text-xl select-none shadow">
            {revealed ? pair : '🃏'}
          </motion.div>
        ))}
      </div>
    );
  }
  // Puzzles: rocket launch
  if (categoryId === 'puzzles') {
    const launched = (frame % 4) >= 1 && (frame % 4) <= 2;
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <motion.span
          animate={{ y: launched ? -14 : 0, scale: launched ? 1.4 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-4xl select-none leading-none">🚀</motion.span>
        <motion.div animate={{ opacity: launched ? 1 : 0 }} className="flex gap-0.5 mt-0.5">
          {['🔥','🔥'].map((f, i) => (
            <motion.span key={i}
              animate={{ scale: launched ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.3, repeat: launched ? Infinity : 0, delay: i * 0.1 }}
              className="text-sm select-none">{f}</motion.span>
          ))}
        </motion.div>
      </div>
    );
  }
  return <span className="text-4xl select-none">{CATEGORY_STATIC[categoryId] ?? '⭐'}</span>;
};

// ─── Star Row ─────────────────────────────────────────────────────────────────

const StarRow: React.FC<{ rating: number; dark?: boolean }> = ({ rating, dark }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={11}
          className={i < full ? 'text-amber-400' : i === full && half ? 'text-amber-300'
            : dark ? 'text-gray-300 dark:text-gray-600' : 'text-white/20'}
          fill={i < full ? '#fbbf24' : i === full && half ? '#fcd34d' : 'none'}
        />
      ))}
      <span className={`text-[10px] font-bold ml-1 ${dark ? 'text-gray-400 dark:text-gray-500' : 'text-white/60'}`}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// ─── Module Card (hotel-card style with concept icon) ────────────────────────

const ModuleCard: React.FC<{
  category: Category;
  progress: number;
  rating: number;
  index: number;
  onPress: () => void;
}> = ({ category, progress, rating, index, onPress }) => {
  const isNew = progress === 0;
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: false, amount: 0.4 });

  return (
    <motion.button
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className="w-full flex rounded-2xl overflow-hidden shadow-md mb-3 text-left"
      style={{ height: 112 }}
    >
      {/* Left panel – gradient with concept animation */}
      <div className={`w-[38%] flex-none bg-gradient-to-br ${category.gradient} flex items-center justify-center relative overflow-hidden`}
        style={{ minHeight: '100%' }}>
        <span className="absolute text-[72px] leading-none opacity-10 select-none pointer-events-none">
          {category.emoji}
        </span>
        <div className="relative z-10 flex items-center justify-center w-full" style={{ height: '100%' }}>
          <ConceptIcon categoryId={category.id} isVisible={isVisible} />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 bg-white dark:bg-[#2c2c2e] px-3 py-2.5 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1">
          <p className="font-black text-gray-900 dark:text-white text-sm leading-snug flex-1">{category.title}</p>
          {isNew && (
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.1, repeat: Infinity }}
              className="flex-none bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              ✨ NEW
            </motion.span>
          )}
        </div>
        <p className="text-gray-400 dark:text-gray-500 text-[11px]">{category.subModules.length} mini-games</p>
        <StarRow rating={rating} dark />
        <div className="mt-1.5">
          {isNew ? (
            <div className="flex items-center gap-1.5">
              <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-[#3a3a3c]" />
              <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600">Start!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-[#3a3a3c] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, delay: index * 0.06 + 0.2 }}
                  className={`h-full rounded-full bg-gradient-to-r ${category.gradient}`} />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold w-7 text-right">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Chevron */}
      <div className="bg-white dark:bg-[#2c2c2e] flex items-center pr-2.5">
        <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
      </div>
    </motion.button>
  );
};

// ─── Continue Learning Card (large centered carousel) ───────────────────────

const ContinueCard: React.FC<{
  category: Category;
  progress: number;
  onPress: () => void;
}> = ({ category, progress, onPress }) => {
  const ref = useRef(null);
  const isVisible = useInView(ref, { once: false, amount: 0.5 });

  return (
  <motion.button
    ref={ref}
    whileTap={{ scale: 0.97 }}
    onClick={onPress}
    className={`flex-none snap-center rounded-3xl overflow-hidden relative bg-gradient-to-br ${category.gradient} shadow-xl text-left`}
    style={{ width: '72vw', maxWidth: 300, height: 185 }}
  >
    {/* bg pattern emoji – large faint behind everything */}
    <span className="absolute text-[160px] leading-none opacity-10 select-none pointer-events-none z-0"
      style={{ right: '-15%', top: '-20%' }}>
      {category.emoji}
    </span>

    {/* Concept animation – fills the entire card */}
    <div className="absolute inset-0 flex items-center justify-center z-[5]">
      <ConceptIcon categoryId={category.id} isVisible={isVisible} />
    </div>

    {/* Bottom overlay */}
    <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-10"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)' }}>
      <p className="text-white font-black text-lg leading-tight">{category.title}</p>
      <div className="flex items-center gap-2 mt-2">
        <div className="flex-1 h-2 rounded-full bg-white/25 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
            transition={{ duration: 0.9 }}
            className="h-full rounded-full bg-white" />
        </div>
        <span className="text-white font-black text-sm">{progress}%</span>
      </div>
    </div>
  </motion.button>
  );
};

// ─── Welcome Popup ────────────────────────────────────────────────────────────

const WelcomePopup: React.FC<{
  avatar: string;
  name: string;
  topicTitle: string;
  topicEmoji: string;
  accentClass: string;
  onDone: () => void;
}> = ({ avatar, name, topicTitle, topicEmoji, accentClass, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999] flex items-end justify-center"
      onClick={onDone}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ y: 320, scale: 0.88 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 320, scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="relative z-10 w-full max-w-sm mx-4 mb-20 bg-white dark:bg-[#2c2c2e] rounded-3xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Gradient top strip */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${accentClass}`} />
        <div className="p-6 text-center">
          {/* Avatar bounce */}
          <motion.div
            className="flex justify-center mb-3"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.9, repeat: 2, ease: 'easeInOut' }}
          >
            <KidAvatar avatar={avatar} size={76} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
            <p className="text-2xl font-black text-gray-800 dark:text-white mb-1">
              Hey {name}! 🎉
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium mb-4">
              We're going to learn
            </p>
            <div className={`bg-gradient-to-br ${accentClass} rounded-2xl px-4 py-3 mb-5 shadow-md`}>
              <span className="text-4xl leading-none">{topicEmoji}</span>
              <p className="text-white font-black text-xl mt-1 leading-tight">{topicTitle}</p>
              <p className="text-white/70 text-xs font-bold mt-0.5">today!</p>
            </div>
            <motion.p
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="text-xs text-gray-300 dark:text-gray-600 font-bold"
            >
              Tap to start →
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Courses Tab ──────────────────────────────────────────────────────────────

const CoursesTab: React.FC = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ path: string; title: string; emoji: string } | null>(null);
  const { activeProfile } = useProfile();
  const [accentId, setAccentId] = useState<string>(() => localStorage.getItem('kids_accent_color') ?? 'violet');
  const accentClass = ACCENT_COLORS.find(a => a.id === accentId)?.class ?? 'from-violet-500 to-indigo-500';

  useEffect(() => {
    const handler = (e: Event) => setAccentId((e as CustomEvent<string>).detail);
    window.addEventListener('kids-accent-change', handler);
    return () => window.removeEventListener('kids-accent-change', handler);
  }, []);

  const nav = (path: string) => navigate(path, { state: { fromProfileSelection: true } });

  const handleModulePress = (path: string, title: string, emoji: string) => {
    setPendingNav({ path, title, emoji });
  };

  const confirmNav = () => {
    if (pendingNav) {
      const path = pendingNav.path;
      setPendingNav(null);
      nav(path);
    }
  };

  const inProgress = CATEGORIES.filter(c => MOCK_PROGRESS[c.id] > 0 && MOCK_PROGRESS[c.id] < 100);

  return (
    <>
    <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${accentClass} flex items-center justify-center shadow-md`}>
            <Star size={16} className="text-white" fill="white" />
          </div>
          <span className="font-black text-lg text-gray-800 dark:text-white">
            X-TARS <span className="text-violet-500">Kids</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Profile avatar in header */}
          <motion.div
            whileTap={{ scale: 0.88 }}
            className="w-9 h-9 rounded-full bg-[#f0f0f5] dark:bg-[#2c2c2e] flex items-center justify-center overflow-hidden shadow-sm"
          >
            <KidAvatar avatar={activeProfile?.avatar ?? 'bird'} size={32} />
          </motion.div>
          <button onClick={() => setShowSearch(true)}
            className="w-9 h-9 rounded-full bg-[#f0f0f5] dark:bg-[#2c2c2e] flex items-center justify-center">
            <Search size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Continue Learning – centered snap carousel with left+right peek */}
      {inProgress.length > 0 && (
        <div className="mb-5">
          <p className="px-4 text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
            🔥 Continue Learning
          </p>
          {/* px-[14%] creates symmetrical dead-space → both left and right cards peek */}
          <div className="flex gap-4 overflow-x-auto px-[14%] pb-2 no-scrollbar snap-x snap-mandatory scroll-smooth"
            style={{ scrollPaddingInline: '14%' }}>
            {inProgress.map(cat => (
              <ContinueCard key={cat.id} category={cat}
                progress={MOCK_PROGRESS[cat.id]}
                onPress={() => handleModulePress(cat.path, cat.title, cat.emoji)} />
            ))}
          </div>
        </div>
      )}

      {/* All Modules list */}
      <div className="px-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
          📚 All Modules
        </p>
        {CATEGORIES.map((cat, i) => (
          <ModuleCard key={cat.id} category={cat}
            progress={MOCK_PROGRESS[cat.id] ?? 0}
            rating={RATINGS[cat.id] ?? 4.5}
            index={i}
            onPress={() => handleModulePress(cat.path, cat.title, cat.emoji)} />
        ))}
      </div>

      <div className="h-6" />

      <AnimatePresence>
        {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}
      </AnimatePresence>
    </div>

    {/* Welcome popup */}
    <AnimatePresence>
      {pendingNav && (
        <WelcomePopup
          avatar={activeProfile?.avatar ?? 'bird'}
          name={activeProfile?.name ?? 'Explorer'}
          topicTitle={pendingNav.title}
          topicEmoji={pendingNav.emoji}
          accentClass={accentClass}
          onDone={confirmNav}
        />
      )}
    </AnimatePresence>
    </>
  );
};

// ─── Analytics Tab ───────────────────────────────────────────────────────────

const AnalyticsTab: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
    <motion.div
      animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
      className="text-8xl mb-6"
    >
      🚀
    </motion.div>
    <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Coming Soon!</h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-6 max-w-xs">
      We're building something awesome! Analytics and progress tracking will be here soon.
    </p>
    <div className="flex gap-3 mb-8">
      {['📊', '🏆', '⭐', '🎯'].map((e, i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center text-2xl shadow-md"
        >
          {e}
        </motion.div>
      ))}
    </div>
    <div className="px-6 py-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
      <p className="text-violet-600 dark:text-violet-400 text-xs font-black uppercase tracking-widest">Dev in Progress</p>
    </div>
  </div>
);

// ─── Account Tab ──────────────────────────────────────────────────────────────

const AccountTab: React.FC = () => {
  const { activeProfile, updateAvatar } = useProfile();
  const { openParentalGate } = useMode();
  const { theme, toggleTheme } = useTheme();
  const [accentId, setAccentId] = useState<string>(() =>
    localStorage.getItem('kids_accent_color') ?? 'violet'
  );

  const handleAccentChange = (id: string) => {
    setAccentId(id);
    localStorage.setItem('kids_accent_color', id);
    window.dispatchEvent(new CustomEvent('kids-accent-change', { detail: id }));
  };

  const selectedAccent = ACCENT_COLORS.find(a => a.id === accentId) ?? ACCENT_COLORS[0];
  const accountId = `XTARS-${(activeProfile?.id ?? 'UNKNOWN').slice(-8).toUpperCase()}`;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar">
      <div className="px-4 pt-14 pb-8 space-y-4">

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${selectedAccent.class} rounded-3xl p-6 shadow-xl`}
        >
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
              <KidAvatar avatar={activeProfile?.avatar ?? 'bird'} size={60} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white text-2xl font-black truncate">{activeProfile?.name ?? 'Kid'}</h2>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-0.5">
                {activeProfile?.type ?? 'KIDS'} Account
              </p>
              <div className="mt-2 bg-black/20 rounded-xl px-3 py-1.5 inline-block">
                <span className="text-white/80 text-[10px] font-mono font-black tracking-widest">{accountId}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dark / Light Mode */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#3a3a3c]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                {theme === 'light'
                  ? <Sun size={20} className="text-amber-500" />
                  : <Moon size={20} className="text-indigo-400" />}
              </div>
              <div>
                <p className="font-black text-gray-800 dark:text-white text-sm">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </p>
                <p className="text-gray-400 text-xs">Change app appearance</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full transition-all duration-300 relative ${theme === 'dark' ? 'bg-indigo-500' : 'bg-gray-300'}`}
            >
              <motion.div
                animate={{ x: theme === 'dark' ? 28 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full bg-white shadow-md absolute top-0.5"
              />
            </button>
          </div>
        </motion.div>

        {/* App Accent Color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#3a3a3c]"
        >
          <p className="font-black text-gray-800 dark:text-white text-sm mb-3 flex items-center gap-2">
            🎨 App Theme Color
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ACCENT_COLORS.map(a => (
              <button
                key={a.id}
                onClick={() => handleAccentChange(a.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all ${
                  accentId === a.id
                    ? 'border-gray-800 dark:border-white bg-gray-50 dark:bg-[#3a3a3c]'
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-[#3a3a3c]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${a.class} shadow-sm flex-none`} />
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Change Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#3a3a3c]"
        >
          <p className="font-black text-gray-800 dark:text-white text-sm mb-3 flex items-center gap-2">
            🐣 Change Avatar
          </p>
          <div className="grid grid-cols-6 gap-2">
            {AVATAR_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => activeProfile && updateAvatar(activeProfile.id, opt.id)}
                className={`aspect-square rounded-xl flex items-center justify-center border-2 transition-all ${
                  activeProfile?.avatar === opt.id
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105'
                    : 'border-transparent bg-gray-50 dark:bg-[#3a3a3c]'
                }`}
              >
                <KidAvatar avatar={opt.id} size={30} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Parent Mode */}
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.97 }}
          onClick={openParentalGate}
          className="w-full flex items-center gap-3 bg-white dark:bg-[#2c2c2e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-[#3a3a3c] text-left"
        >
          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-indigo-500" />
          </div>
          <div className="flex-1">
            <p className="font-black text-gray-800 dark:text-white text-sm">Parent Mode</p>
            <p className="text-gray-400 text-xs">Access parental controls</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </motion.button>

        <p className="text-center text-gray-300 dark:text-gray-600 text-xs font-mono">X-TARS Kids v2.0.2</p>
      </div>
    </div>
  );
};

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────

type TabDef = { id: TabType; label: string; icon: React.ElementType };
const TABS: TabDef[] = [
  { id: 'courses',   label: 'Courses',  icon: BookOpen },
  { id: 'analytics', label: 'Progress', icon: BarChart2 },
  { id: 'account',   label: 'Account',  icon: User },
];

const TabBar: React.FC<{ active: TabType; onChange: (t: TabType) => void }> = ({ active, onChange }) => (
  <div className="flex-none bg-white dark:bg-[#1c1c1e] border-t border-gray-100 dark:border-[#2c2c2e] px-4 pt-2 pb-6 flex items-center justify-around">
    {TABS.map(tab => {
      const isActive = active === tab.id;
      const Icon = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="flex flex-col items-center gap-1 px-5 py-1 relative"
        >
          {isActive && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute -top-2 w-8 h-1 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
            />
          )}
          <Icon
            size={22}
            className={isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-600'}
            strokeWidth={isActive ? 2.5 : 1.8}
          />
          <span className={`text-[10px] font-black uppercase tracking-wider ${
            isActive ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-gray-600'
          }`}>
            {tab.label}
          </span>
        </button>
      );
    })}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const KidsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('courses');
  const { theme } = useTheme();

  return (
    <div className={`h-screen flex flex-col overflow-hidden font-outfit ${theme === 'dark' ? 'bg-[#1c1c1e]' : 'bg-[#f5f5f7]'}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {activeTab === 'courses'   && <CoursesTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'account'   && <AccountTab />}
        </motion.div>
      </AnimatePresence>

      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default KidsHub;

