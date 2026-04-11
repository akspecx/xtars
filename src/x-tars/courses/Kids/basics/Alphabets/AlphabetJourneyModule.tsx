/**
 * AlphabetJourneyModule.tsx
 * Full 6-phase letter-learning flow for all 26 letters.
 *
 * Phase 1 – Sound Intro     : bouncing emoji, TTS sound, NO letter shown
 * Phase 2 – Object Tap      : tap 3 objects that start with this sound
 * Phase 3 – Letter Reveal   : letter animates out of the emoji
 * Phase 4 – Tracing         : finger trace with sparkle trail
 * Phase 5 – Mini Game       : find-the-object challenge (3 choices)
 * Phase 6 – Reward          : stars + celebration
 */
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../context/ProfileContext';
import KidAvatar from '../../../CommonUtility/KidAvatar';

// ─── Letter data ─────────────────────────────────────────────────────────────
interface LetterEntry {
  letter: string;
  phoneme: string;      // e.g. "/a/"
  color: string;        // accent
  bg: string;           // card bg gradient
  objects: { emoji: string; word: string; starts: boolean }[];
}

const LETTERS: LetterEntry[] = [
  { letter:'A', phoneme:'/a/', color:'#e11d48', bg:'linear-gradient(135deg,#fce7f3,#fda4af)',
    objects:[{emoji:'🍎',word:'Apple',starts:true},{emoji:'🐜',word:'Ant',starts:true},{emoji:'🐶',word:'Dog',starts:false},{emoji:'✈️',word:'Aeroplane',starts:true}] },
  { letter:'B', phoneme:'/b/', color:'#1d4ed8', bg:'linear-gradient(135deg,#dbeafe,#93c5fd)',
    objects:[{emoji:'🐻',word:'Bear',starts:true},{emoji:'⚽',word:'Ball',starts:true},{emoji:'🌸',word:'Flower',starts:false},{emoji:'🍌',word:'Banana',starts:true}] },
  { letter:'C', phoneme:'/k/', color:'#059669', bg:'linear-gradient(135deg,#d1fae5,#6ee7b7)',
    objects:[{emoji:'🐱',word:'Cat',starts:true},{emoji:'🎂',word:'Cake',starts:true},{emoji:'🌙',word:'Moon',starts:false},{emoji:'🚗',word:'Car',starts:true}] },
  { letter:'D', phoneme:'/d/', color:'#b45309', bg:'linear-gradient(135deg,#fef3c7,#fcd34d)',
    objects:[{emoji:'🥁',word:'Drum',starts:true},{emoji:'🦆',word:'Duck',starts:true},{emoji:'🐘',word:'Elephant',starts:false},{emoji:'🐕',word:'Dog',starts:true}] },
  { letter:'E', phoneme:'/e/', color:'#7c3aed', bg:'linear-gradient(135deg,#ede9fe,#c4b5fd)',
    objects:[{emoji:'🥚',word:'Egg',starts:true},{emoji:'🐘',word:'Elephant',starts:true},{emoji:'🍞',word:'Bread',starts:false},{emoji:'✏️',word:'Eraser',starts:true}] },
  { letter:'F', phoneme:'/f/', color:'#0284c7', bg:'linear-gradient(135deg,#e0f2fe,#7dd3fc)',
    objects:[{emoji:'🐸',word:'Frog',starts:true},{emoji:'🌸',word:'Flower',starts:true},{emoji:'🐝',word:'Bee',starts:false},{emoji:'🦊',word:'Fox',starts:true}] },
  { letter:'G', phoneme:'/g/', color:'#16a34a', bg:'linear-gradient(135deg,#dcfce7,#86efac)',
    objects:[{emoji:'🍇',word:'Grapes',starts:true},{emoji:'🦒',word:'Giraffe',starts:true},{emoji:'🐟',word:'Fish',starts:false},{emoji:'🎸',word:'Guitar',starts:true}] },
  { letter:'H', phoneme:'/h/', color:'#d97706', bg:'linear-gradient(135deg,#fef3c7,#fbbf24)',
    objects:[{emoji:'🏠',word:'House',starts:true},{emoji:'🎩',word:'Hat',starts:true},{emoji:'🐰',word:'Rabbit',starts:false},{emoji:'🐴',word:'Horse',starts:true}] },
  { letter:'I', phoneme:'/i/', color:'#0369a1', bg:'linear-gradient(135deg,#e0f2fe,#38bdf8)',
    objects:[{emoji:'🍦',word:'Ice Cream',starts:true},{emoji:'🔥',word:'Fire',starts:false},{emoji:'🎸',word:'Instrument',starts:true},{emoji:'🐛',word:'Insect',starts:true}] },
  { letter:'J', phoneme:'/j/', color:'#b91c1c', bg:'linear-gradient(135deg,#fee2e2,#fca5a5)',
    objects:[{emoji:'🃏',word:'Joker',starts:true},{emoji:'🤸',word:'Jumping',starts:true},{emoji:'🐱',word:'Cat',starts:false},{emoji:'🫙',word:'Jar',starts:true}] },
  { letter:'K', phoneme:'/k/', color:'#7e22ce', bg:'linear-gradient(135deg,#f3e8ff,#c084fc)',
    objects:[{emoji:'🦘',word:'Kangaroo',starts:true},{emoji:'🪁',word:'Kite',starts:true},{emoji:'🌴',word:'Tree',starts:false},{emoji:'🗝️',word:'Key',starts:true}] },
  { letter:'L', phoneme:'/l/', color:'#15803d', bg:'linear-gradient(135deg,#dcfce7,#4ade80)',
    objects:[{emoji:'🦁',word:'Lion',starts:true},{emoji:'🍋',word:'Lemon',starts:true},{emoji:'⭐',word:'Star',starts:false},{emoji:'🦎',word:'Lizard',starts:true}] },
  { letter:'M', phoneme:'/m/', color:'#9d174d', bg:'linear-gradient(135deg,#fce7f3,#f9a8d4)',
    objects:[{emoji:'🌙',word:'Moon',starts:true},{emoji:'🐒',word:'Monkey',starts:true},{emoji:'🌟',word:'Star',starts:false},{emoji:'🍄',word:'Mushroom',starts:true}] },
  { letter:'N', phoneme:'/n/', color:'#1e3a8a', bg:'linear-gradient(135deg,#dbeafe,#60a5fa)',
    objects:[{emoji:'📰',word:'Newspaper',starts:true},{emoji:'🪆',word:'Nesting Doll',starts:true},{emoji:'🐝',word:'Bee',starts:false},{emoji:'🌙',word:'Night',starts:true}] },
  { letter:'O', phoneme:'/o/', color:'#c2410c', bg:'linear-gradient(135deg,#ffedd5,#fb923c)',
    objects:[{emoji:'🐙',word:'Octopus',starts:true},{emoji:'🦉',word:'Owl',starts:true},{emoji:'🐟',word:'Fish',starts:false},{emoji:'🍊',word:'Orange',starts:true}] },
  { letter:'P', phoneme:'/p/', color:'#7c3aed', bg:'linear-gradient(135deg,#ede9fe,#a78bfa)',
    objects:[{emoji:'🐧',word:'Penguin',starts:true},{emoji:'🍕',word:'Pizza',starts:true},{emoji:'🦁',word:'Lion',starts:false},{emoji:'🪴',word:'Plant',starts:true}] },
  { letter:'Q', phoneme:'/kw/', color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#2dd4bf)',
    objects:[{emoji:'👑',word:'Queen',starts:true},{emoji:'🦆',word:'Quack',starts:true},{emoji:'🌺',word:'Flower',starts:false},{emoji:'❓',word:'Question',starts:true}] },
  { letter:'R', phoneme:'/r/', color:'#b91c1c', bg:'linear-gradient(135deg,#fee2e2,#f87171)',
    objects:[{emoji:'🌈',word:'Rainbow',starts:true},{emoji:'🐇',word:'Rabbit',starts:true},{emoji:'🐱',word:'Cat',starts:false},{emoji:'🚀',word:'Rocket',starts:true}] },
  { letter:'S', phoneme:'/s/', color:'#0ea5e9', bg:'linear-gradient(135deg,#e0f2fe,#38bdf8)',
    objects:[{emoji:'🌞',word:'Sun',starts:true},{emoji:'⭐',word:'Star',starts:true},{emoji:'🐔',word:'Chicken',starts:false},{emoji:'🐍',word:'Snake',starts:true}] },
  { letter:'T', phoneme:'/t/', color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#5eead4)',
    objects:[{emoji:'🐯',word:'Tiger',starts:true},{emoji:'🌳',word:'Tree',starts:true},{emoji:'🐢',word:'Turtle',starts:true},{emoji:'🐻',word:'Bear',starts:false}] },
  { letter:'U', phoneme:'/u/', color:'#6d28d9', bg:'linear-gradient(135deg,#ede9fe,#8b5cf6)',
    objects:[{emoji:'☂️',word:'Umbrella',starts:true},{emoji:'🦄',word:'Unicorn',starts:true},{emoji:'🌸',word:'Flower',starts:false},{emoji:'📦',word:'Unbox',starts:true}] },
  { letter:'V', phoneme:'/v/', color:'#7c3aed', bg:'linear-gradient(135deg,#f3e8ff,#c084fc)',
    objects:[{emoji:'🎻',word:'Violin',starts:true},{emoji:'🌺',word:'Violet',starts:true},{emoji:'🌙',word:'Moon',starts:false},{emoji:'🚐',word:'Van',starts:true}] },
  { letter:'W', phoneme:'/w/', color:'#1d4ed8', bg:'linear-gradient(135deg,#dbeafe,#93c5fd)',
    objects:[{emoji:'🐋',word:'Whale',starts:true},{emoji:'🐺',word:'Wolf',starts:true},{emoji:'🐸',word:'Frog',starts:false},{emoji:'⌚',word:'Watch',starts:true}] },
  { letter:'X', phoneme:'/ks/', color:'#374151', bg:'linear-gradient(135deg,#f3f4f6,#9ca3af)',
    objects:[{emoji:'🎻',word:'Xylophone',starts:true},{emoji:'🐠',word:'Xfish',starts:true},{emoji:'🌟',word:'Star',starts:false},{emoji:'📦',word:'X-box',starts:true}] },
  { letter:'Y', phoneme:'/y/', color:'#a16207', bg:'linear-gradient(135deg,#fef9c3,#fde047)',
    objects:[{emoji:'🧶',word:'Yarn',starts:true},{emoji:'🥛',word:'Yak Milk',starts:true},{emoji:'🐙',word:'Octopus',starts:false},{emoji:'🪀',word:'Yo-yo',starts:true}] },
  { letter:'Z', phoneme:'/z/', color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#34d399)',
    objects:[{emoji:'🦓',word:'Zebra',starts:true},{emoji:'⚡',word:'Zap',starts:true},{emoji:'🌷',word:'Tulip',starts:false},{emoji:'🔭',word:'Zoom',starts:true}] },
];

// ─── Phase enum ───────────────────────────────────────────────────────────────
type Phase = 'sound' | 'object-tap' | 'reveal' | 'trace' | 'game' | 'reward';

const PHASES: Phase[] = ['sound', 'object-tap', 'reveal', 'trace', 'game', 'reward'];
const PHASE_LABELS = ['Listen','Tap','Reveal','Trace','Find It','Done!'];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const speak = (text: string, rate = 0.85, pitch = 1.1) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = rate; u.pitch = pitch; u.volume = 1;
  window.speechSynthesis.speak(u);
};

// ─── ★ Phase 1: Sound Intro ───────────────────────────────────────────────────
const PhaseSound: React.FC<{ entry: LetterEntry; onNext: () => void }> = ({ entry, onNext }) => {
  const obj = entry.objects[0];

  useEffect(() => {
    const t = setTimeout(() => speak(`${entry.phoneme}… ${entry.phoneme}… like ${obj.word}!`), 400);
    return () => clearTimeout(t);
  }, [entry]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 pt-6 pb-10 h-full">
      <motion.p
        className="font-black text-3xl tracking-tight"
        style={{ color: '#342f00' }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👂 Listen!
      </motion.p>

      {/* Bouncing emoji – NO letter */}
      <motion.div
        animate={{ y: [0, -22, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex items-center justify-center rounded-3xl shadow-2xl"
        style={{ width: 180, height: 180, background: entry.bg, fontSize: 100, lineHeight: 1 }}
      >
        {obj.emoji}
      </motion.div>

      <motion.p
        className="font-black text-4xl tracking-widest"
        style={{ color: entry.color }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        {entry.phoneme}
      </motion.p>
      <p className="font-bold text-xl" style={{ color: '#655d00' }}>"{obj.word}" starts with this sound!</p>

      <div className="flex gap-4 w-full max-w-xs">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => speak(`${entry.phoneme}… ${entry.phoneme}… like ${obj.word}!`)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black shadow-md"
          style={{ background: '#fbeb5b', color: '#342f00', border: '2px solid #f0e037' }}
        >
          <Volume2 size={20} /> Again
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={onNext}
          className="flex-1 py-3 rounded-2xl font-black shadow-md text-white"
          style={{ background: '#005f99', boxShadow: '0 3px 0 #005386' }}
        >
          Next ▶
        </motion.button>
      </div>
    </div>
  );
};

// ─── ★ Phase 2: Object Tap ───────────────────────────────────────────────────
const PhaseObjectTap: React.FC<{ entry: LetterEntry; onNext: () => void }> = ({ entry, onNext }) => {
  const targets = entry.objects.slice(0, 3);
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [wrong,  setWrong]  = useState<number | null>(null);
  const hits = targets.filter(o => o.starts).length;

  useEffect(() => {
    speak(`Tap everything that starts with ${entry.phoneme}`);
  }, [entry]);

  const handleTap = (i: number) => {
    if (tapped.has(i)) return;
    const obj = targets[i];
    if (obj.starts) {
      speak(`${obj.word}! ${entry.phoneme}… yes!`);
      setTapped(prev => { const s = new Set(prev); s.add(i); return s; });
    } else {
      speak(`Hmm, ${obj.word} starts with a different sound!`);
      setWrong(i);
      setTimeout(() => setWrong(null), 800);
    }
  };

  const correctTapped = [...tapped].filter(i => targets[i].starts).length;

  useEffect(() => {
    if (correctTapped === hits) {
      const t = setTimeout(() => { speak('Great! You found them all!'); setTimeout(onNext, 800); }, 400);
      return () => clearTimeout(t);
    }
  }, [correctTapped, hits]);

  return (
    <div className="flex flex-col items-center gap-6 px-5 pt-6 pb-10 h-full">
      <motion.p className="font-black text-2xl text-center" style={{ color: '#342f00' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Tap things that start with <span style={{ color: entry.color }}>{entry.phoneme}</span>
      </motion.p>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm mt-2">
        {targets.map((obj, i) => {
          const hitIt  = tapped.has(i) && obj.starts;
          const isWrong = wrong === i;
          return (
            <motion.button
              key={i}
              whileTap={{ scale: 0.88 }}
              animate={isWrong ? { x: [-6, 6, -6, 0] } : hitIt ? { scale: [1, 1.18, 1] } : {}}
              onClick={() => handleTap(i)}
              className="flex flex-col items-center justify-center gap-2 rounded-3xl py-5 shadow-lg font-black text-base"
              style={{
                background: hitIt ? '#b9f474' : isWrong ? '#fecaca' : '#fff',
                border: `3px solid ${hitIt ? '#7ec84a' : isWrong ? '#ef4444' : '#fbeb5b'}`,
                color: '#342f00',
                fontSize: 13,
              }}
            >
              <span style={{ fontSize: 52 }}>{obj.emoji}</span>
              {obj.word}
              {hitIt && <span style={{ fontSize: 20 }}>✓</span>}
            </motion.button>
          );
        })}
      </div>

      <p className="font-bold text-lg" style={{ color: '#655d00' }}>
        {correctTapped}/{hits} found
      </p>
    </div>
  );
};

// ─── ★ Phase 3: Letter Reveal ─────────────────────────────────────────────────
const PhaseReveal: React.FC<{ entry: LetterEntry; onNext: () => void }> = ({ entry, onNext }) => {
  const [stage, setStage] = useState<'emoji' | 'arrow' | 'letter' | 'done'>('emoji');
  const obj = entry.objects[0];

  useEffect(() => {
    speak(`See the letter ${entry.letter}!`);
    const t1 = setTimeout(() => setStage('arrow'), 800);
    const t2 = setTimeout(() => setStage('letter'), 1600);
    const t3 = setTimeout(() => setStage('done'), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [entry]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-6 h-full pb-10">
      <motion.p className="font-black text-2xl" style={{ color: '#342f00' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        🎉 Meet the letter!
      </motion.p>

      <div className="flex items-center justify-center gap-5">
        {/* Emoji */}
        <motion.div
          className="flex items-center justify-center rounded-3xl shadow-xl"
          style={{ width: 120, height: 120, background: entry.bg, fontSize: 68 }}
          animate={stage !== 'emoji' ? { scale: [1, 1.15, 0.9] } : { y: [0, -10, 0] }}
          transition={{ duration: stage !== 'emoji' ? 0.3 : 2, repeat: stage === 'emoji' ? Infinity : 0 }}
        >
          {obj.emoji}
        </motion.div>

        {/* Arrow */}
        <AnimatePresence>
          {(stage === 'arrow' || stage === 'letter' || stage === 'done') && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="text-4xl font-black" style={{ color: entry.color }}>→</motion.span>
          )}
        </AnimatePresence>

        {/* Letter */}
        <AnimatePresence>
          {(stage === 'letter' || stage === 'done') && (
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
              className="flex items-center justify-center rounded-3xl shadow-2xl"
              style={{
                width: 120, height: 120,
                background: `linear-gradient(145deg, ${entry.color}22, ${entry.color}44)`,
                border: `4px solid ${entry.color}`,
                fontSize: 80,
                fontWeight: 900,
                color: entry.color,
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              {entry.letter}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Glow pulsing letter name */}
      <AnimatePresence>
        {stage === 'done' && (
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="font-black text-3xl text-center"
            style={{ color: entry.color }}
          >
            {obj.emoji} = {entry.letter} for {obj.word}!
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'done' && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => { speak(`${entry.letter} for ${obj.word}!`); setTimeout(onNext, 600); }}
            className="px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg mt-2"
            style={{ background: '#005f99', boxShadow: '0 4px 0 #005386' }}
          >
            Let's Trace! ✏️
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── ★ Phase 4: Tracing ──────────────────────────────────────────────────────
const PhaseTrace: React.FC<{ entry: LetterEntry; onNext: () => void }> = ({ entry, onNext }) => {
  const [sparks,   setSparks]   = useState<{ id: number; x: number; y: number }[]>([]);
  const [progress, setProgress] = useState(0);   // 0–100
  const [done,     setDone]     = useState(false);
  const boxRef  = useRef<HTMLDivElement>(null);
  const sparkId = useRef(0);

  useEffect(() => {
    speak(`Trace the letter ${entry.letter}! Follow the dots with your finger.`);
  }, [entry]);

  const addSpark = (x: number, y: number) => {
    const id = ++sparkId.current;
    setSparks(prev => [...prev.slice(-20), { id, x, y }]);
    setTimeout(() => setSparks(prev => prev.filter(s => s.id !== id)), 600);
  };

  const handleTouch = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (done) return;
    e.preventDefault();
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    const t = e.touches[0];
    addSpark(t.clientX - rect.left, t.clientY - rect.top);
    setProgress(prev => {
      const next = Math.min(prev + 2.5, 100);
      if (next >= 100 && !done) {
        setDone(true);
        speak(`Wonderful! You traced the letter ${entry.letter}!`);
      }
      return next;
    });
  }, [done, entry]);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (done || e.buttons !== 1) return;
    const rect = boxRef.current?.getBoundingClientRect();
    if (!rect) return;
    addSpark(e.clientX - rect.left, e.clientY - rect.top);
    setProgress(prev => {
      const next = Math.min(prev + 2.5, 100);
      if (next >= 100 && !done) {
        setDone(true);
        speak(`Wonderful! You traced the letter ${entry.letter}!`);
      }
      return next;
    });
  }, [done, entry]);

  return (
    <div className="flex flex-col items-center gap-5 px-5 pt-4 pb-10 h-full">
      <motion.p className="font-black text-2xl" style={{ color: '#342f00' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ✏️ Trace the letter <span style={{ color: entry.color }}>{entry.letter}</span>
      </motion.p>

      {/* Tracing canvas */}
      <div
        ref={boxRef}
        onTouchMove={handleTouch}
        onTouchStart={handleTouch}
        onMouseMove={handleMouse}
        onMouseDown={handleMouse}
        className="relative flex items-center justify-center rounded-3xl shadow-xl overflow-hidden select-none"
        style={{
          width: '90%', maxWidth: 320, aspectRatio: '1',
          background: 'white',
          border: `4px solid ${entry.color}`,
          touchAction: 'none',
          cursor: 'crosshair',
        }}
      >
        {/* Dotted guide letter */}
        <span
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: `${entry.color}18`,
            fontFamily: 'system-ui, sans-serif',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {entry.letter}
        </span>

        {/* Dot guides */}
        {[
          { top: '10%', left: '50%' },
          { top: '35%', left: '30%' },
          { top: '35%', left: '70%' },
          { top: '60%', left: '50%' },
          { top: '85%', left: '30%' },
          { top: '85%', left: '70%' },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 rounded-full"
            style={{
              top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)',
              background: entry.color + '88',
              border: `2px solid ${entry.color}`,
            }}
            animate={{ scale: [0.8, 1.15, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}

        {/* Sparkle trail */}
        {sparks.map(s => (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none text-2xl"
            style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 1, scale: 0.5 }}
            animate={{ opacity: 0, scale: 1.6, y: -20 }}
            transition={{ duration: 0.6 }}
          >✨</motion.div>
        ))}

        {/* Progress fill overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `${entry.color}10`,
            clipPath: `inset(${100 - progress}% 0 0 0)`,
            transition: 'clip-path 0.1s',
          }}
        />
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs rounded-full overflow-hidden" style={{ height: 12, background: '#f0e037' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: entry.color }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <p className="font-bold text-base" style={{ color: '#655d00' }}>
        {done ? '🎉 Done!' : 'Draw over the letter!'}
      </p>

      <AnimatePresence>
        {done && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            className="px-10 py-4 rounded-2xl font-black text-xl text-white shadow-lg"
            style={{ background: '#005f99', boxShadow: '0 4px 0 #005386' }}
          >
            Play a Game! 🎮
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── ★ Phase 5: Mini Game — Find the Object ───────────────────────────────────
const PhaseGame: React.FC<{ entry: LetterEntry; onNext: () => void }> = ({ entry, onNext }) => {
  // Pick 3 options: 2 that start with letter, 1 that doesn't — shuffle
  const options = useMemo(() => {
    const starters = entry.objects.filter(o => o.starts);
    const others   = entry.objects.filter(o => !o.starts);
    const pool = [...starters.slice(0, 2), ...others.slice(0, 1)];
    return pool.sort(() => Math.random() - 0.5);
  }, [entry]);

  const target = useMemo(() => options[Math.floor(Math.random() * options.filter(o => o.starts).length)], [options]);

  const [chosen, setChosen] = useState<number | null>(null);
  const [round,  setRound]  = useState(0);  // 3 rounds
  const [score,  setScore]  = useState(0);

  const currentTarget = useMemo(() => {
    const starters = options.filter(o => o.starts);
    return starters[round % starters.length] ?? starters[0];
  }, [options, round]);

  const currentOptions = useMemo(() => [...options].sort(() => Math.random() - 0.5), [round]);

  useEffect(() => {
    speak(`Find something that starts with ${entry.phoneme}!`);
  }, [round]);

  const handlePick = (i: number) => {
    if (chosen !== null) return;
    setChosen(i);
    const correct = currentOptions[i].starts;
    if (correct) {
      speak(`${currentOptions[i].word}! Yes! Starts with ${entry.phoneme}!`);
      setScore(s => s + 1);
      setTimeout(() => {
        if (round + 1 >= 3) { onNext(); }
        else { setRound(r => r + 1); setChosen(null); }
      }, 1200);
    } else {
      speak(`Hmm… ${currentOptions[i].word} doesn't start with ${entry.phoneme}. Try again!`);
      setTimeout(() => setChosen(null), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 px-5 pt-4 pb-10 h-full">
      <motion.div className="flex flex-col items-center gap-1"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="font-black text-2xl" style={{ color: '#342f00' }}>🎮 Find It!</p>
        <p className="font-bold text-lg" style={{ color: '#655d00' }}>
          Tap the one that starts with <span style={{ color: entry.color }}>{entry.phoneme}</span>
        </p>
      </motion.div>

      {/* Big letter reminder */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="flex items-center justify-center rounded-3xl shadow-xl font-black"
        style={{
          width: 100, height: 100, fontSize: 72,
          background: `${entry.color}20`,
          border: `3px solid ${entry.color}`,
          color: entry.color,
          fontFamily: 'system-ui, sans-serif',
        }}
      >{entry.letter}</motion.div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {currentOptions.map((obj, i) => {
          const isChosen  = chosen === i;
          const isCorrect = isChosen && obj.starts;
          const isWrong   = isChosen && !obj.starts;
          return (
            <motion.button
              key={`${round}-${i}`}
              whileTap={{ scale: 0.88 }}
              animate={isWrong ? { x: [-6, 6, -6, 0] } : {}}
              onClick={() => handlePick(i)}
              className="flex flex-col items-center justify-center gap-2 rounded-3xl py-4 shadow-lg font-black"
              style={{
                fontSize: 13,
                background: isCorrect ? '#b9f474' : isWrong ? '#fecaca' : '#fff',
                border: `3px solid ${isCorrect ? '#7ec84a' : isWrong ? '#ef4444' : '#fbeb5b'}`,
                color: '#342f00',
              }}
            >
              <span style={{ fontSize: 48 }}>{obj.emoji}</span>
              {obj.word}
            </motion.button>
          );
        })}
      </div>

      {/* Round dots */}
      <div className="flex gap-2 mt-2">
        {[0, 1, 2].map(i => (
          <div key={i} className="w-3 h-3 rounded-full transition-all"
            style={{ background: i < round ? entry.color : i === round ? entry.color + 'bb' : '#e5e7eb' }} />
        ))}
      </div>
    </div>
  );
};

// ─── ★ Phase 6: Reward ────────────────────────────────────────────────────────
const PhaseReward: React.FC<{ entry: LetterEntry; onNextLetter: () => void; onDone: () => void; isLast: boolean }> =
  ({ entry, onNextLetter, onDone, isLast }) => {
  const obj = entry.objects[0];

  useEffect(() => {
    speak(`Amazing! You learned the letter ${entry.letter}! ${entry.letter} for ${obj.word}!`);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 h-full pb-10">
      {/* Stars burst */}
      <div className="relative flex items-center justify-center">
        {['⭐','🌟','✨','💫','🎉'].map((s, i) => (
          <motion.span
            key={i}
            className="absolute text-3xl"
            initial={{ scale: 0, x: 0, y: 0 }}
            animate={{ scale: 1, x: Math.cos(i * 72 * Math.PI / 180) * 70, y: Math.sin(i * 72 * Math.PI / 180) * 70 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 200, damping: 12 }}
          >{s}</motion.span>
        ))}
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex items-center justify-center rounded-3xl shadow-2xl font-black"
          style={{
            width: 130, height: 130, fontSize: 90,
            background: `${entry.color}22`,
            border: `4px solid ${entry.color}`,
            color: entry.color,
            fontFamily: 'system-ui, sans-serif',
          }}
        >{entry.letter}</motion.div>
      </div>

      <motion.p
        className="font-black text-3xl text-center leading-tight"
        style={{ color: '#342f00' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
      >
        🎉 Amazing!<br />
        <span style={{ color: entry.color }}>{entry.letter}</span> is for {obj.emoji} {obj.word}!
      </motion.p>

      {/* Stars row */}
      <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {[0,1,2].map(i => (
          <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.15 }} style={{ fontSize: 40 }}>⭐</motion.span>
        ))}
      </motion.div>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
        {!isLast && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            onClick={onNextLetter}
            className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg"
            style={{ background: '#005f99', boxShadow: '0 4px 0 #005386' }}
          >
            Next Letter ▶
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.92 }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
          onClick={onDone}
          className="w-full py-3 rounded-2xl font-black text-base shadow-md"
          style={{ background: '#fbeb5b', color: '#342f00', border: '2px solid #f0e037' }}
        >
          Back to Menu
        </motion.button>
      </div>
    </div>
  );
};

// ─── Progress bar (phase steps) ───────────────────────────────────────────────
const PhaseStepper: React.FC<{ phase: Phase; color: string }> = ({ phase, color }) => {
  const idx = PHASES.indexOf(phase);
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      {PHASES.map((_, i) => (
        <React.Fragment key={i}>
          <div
            className="rounded-full transition-all"
            style={{
              width: i === idx ? 28 : 10,
              height: 10,
              background: i < idx ? color : i === idx ? color : `${color}44`,
            }}
          />
          {i < PHASES.length - 1 && <div className="flex-1 h-0.5 rounded" style={{ background: `${color}33` }} />}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AlphabetJourneyModule: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const kidAvatar = activeProfile?.avatar ?? 'bird';

  const [letterIdx, setLetterIdx] = useState(0);
  const [phase,     setPhase]     = useState<Phase>('sound');

  const entry  = LETTERS[letterIdx];
  const isLast = letterIdx === LETTERS.length - 1;

  const nextPhase = () => setPhase(p => PHASES[PHASES.indexOf(p) + 1] ?? 'reward');

  const handleNextLetter = () => {
    setLetterIdx(i => i + 1);
    setPhase('sound');
  };

  const handleDone = () => navigate('/games/alphabets');

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: 'linear-gradient(160deg,#fff7cc 0%,#fbeb5b 40%,#f6e54a 80%,#f0e037 100%)' }}
    >
      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[18, 52, 80].map((left, i) => (
          <div key={i} className="absolute top-0 w-[2px] opacity-[0.07]"
            style={{ left: `${left}%`, height: '55%', background: 'linear-gradient(to bottom,#342f00,transparent)', transform: `rotate(${(i - 1) * 8}deg)`, transformOrigin: 'top' }} />
        ))}
      </div>

      {/* ── Top bar ── */}
      <div
        className="relative z-10 flex-none flex items-center gap-3 px-4 shadow-md"
        style={{ paddingTop: 'env(safe-area-inset-top,14px)', paddingBottom: 10, background: '#fff394', borderBottom: '2.5px solid #fbeb5b' }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleDone}
          className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0"
          style={{ background: '#fbeb5b', border: '1.5px solid #f0e037' }}
        >
          <ChevronLeft size={22} color="#342f00" strokeWidth={3} />
        </motion.button>

        {/* Letter progress bubble */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="font-black text-2xl" style={{ color: entry.color }}>{entry.letter}</span>
          <span className="font-bold text-sm" style={{ color: '#655d00' }}>
            {letterIdx + 1}/{LETTERS.length}
          </span>
        </div>

        <div className="h-10 w-10 rounded-xl overflow-hidden shadow-md shrink-0"
          style={{ border: '2.5px solid #fbeb5b', background: '#fff' }}>
          <KidAvatar avatar={kidAvatar} size={36} />
        </div>
      </div>

      {/* Phase stepper */}
      <div className="relative z-10 flex-none" style={{ background: '#fff394', borderBottom: '1.5px solid #fbeb5b' }}>
        <PhaseStepper phase={phase} color={entry.color} />
      </div>

      {/* Phase label */}
      <div className="relative z-10 flex justify-center py-1" style={{ background: '#fff394' }}>
        <span className="px-4 py-0.5 rounded-full font-black text-sm shadow-sm"
          style={{ background: entry.color + '22', color: entry.color, border: `1.5px solid ${entry.color}55` }}>
          Step {PHASES.indexOf(phase) + 1}/6 — {PHASE_LABELS[PHASES.indexOf(phase)]}
        </span>
      </div>

      {/* ── Phase content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto" style={{ paddingBottom: 'env(safe-area-inset-bottom,16px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${letterIdx}-${phase}`}
            className="h-full"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {phase === 'sound'      && <PhaseSound      entry={entry} onNext={nextPhase} />}
            {phase === 'object-tap' && <PhaseObjectTap  entry={entry} onNext={nextPhase} />}
            {phase === 'reveal'     && <PhaseReveal     entry={entry} onNext={nextPhase} />}
            {phase === 'trace'      && <PhaseTrace      entry={entry} onNext={nextPhase} />}
            {phase === 'game'       && <PhaseGame       entry={entry} onNext={nextPhase} />}
            {phase === 'reward'     && (
              <PhaseReward
                entry={entry}
                onNextLetter={handleNextLetter}
                onDone={handleDone}
                isLast={isLast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlphabetJourneyModule;
