/**
 * SizeGameBase.tsx
 * ─────────────────────────────────────────────────────────
 * Shared interactive size-concept game for:
 *   • UnderstandingOfBig    (target = 'big')
 *   • UnderstandingofSmall  (target = 'small')
 *   • UnderstandingOfBigAndSmallMix (target = 'mix')
 *
 * Play Mode   – automated demo: virtual pointer, auto-steps, full narration
 * Practice Mode – child taps, voice feedback, concept teaching
 */

import React, {
  useState, useEffect, useRef, useCallback, useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, Play, MousePointer2, Volume2, VolumeX, Star, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { recordCompletion } from '../../../../courses/CommonUtility/useModuleProgress';
import { useProfile } from '../../../../../context/ProfileContext';
import { useTheme }   from '../../../../../context/ThemeContext';
import KidAvatar from '../../../CommonUtility/KidAvatar';
import { patchSpeechSynthesis } from '../../../../../utils/patchSpeechSynthesis';

// Patch speech synthesis on mobile WebView
try { patchSpeechSynthesis(); } catch { /* ignore if unavailable */ }

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameTarget = 'big' | 'small' | 'mix';
type GameMode  = 'play' | 'practice';
type Phase     = 'question' | 'correct' | 'wrong' | 'concept' | 'done' | 'walking';
interface Side  { emoji: string; name: string }
interface Pair  { big: Side; small: Side }

const MODE_STORAGE_KEY = 'kids_game_mode';
const getStoredMode = (): GameMode => {
  try { return (localStorage.getItem(MODE_STORAGE_KEY) as GameMode) || 'play'; }
  catch { return 'play'; }
};
const storeMode = (m: GameMode) => {
  try { localStorage.setItem(MODE_STORAGE_KEY, m); } catch { /* ignore */ }
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const PAIRS: Pair[] = [
  { big: { emoji: '🐘', name: 'Elephant' }, small: { emoji: '🐜', name: 'Ant'    } },
  { big: { emoji: '🏠', name: 'House'    }, small: { emoji: '🧸', name: 'Toy'    } },
  { big: { emoji: '🦒', name: 'Giraffe'  }, small: { emoji: '🐕', name: 'Dog'    } },
  { big: { emoji: '🏀', name: 'Ball'     }, small: { emoji: '🔮', name: 'Marble' } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useSpeech(isMuted: boolean) {
  const speak = useCallback((text: string, rate = 0.9, pitch = 1.25) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = () => {
      const u = new SpeechSynthesisUtterance(text);
      u.rate  = rate;
      u.pitch = pitch;
      u.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const pick = voices.find(v => v.lang.startsWith('en')) ?? voices[0];
      if (pick) u.voice = pick;
      window.speechSynthesis.speak(u);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      utter();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null;
        utter();
      };
    }
  }, [isMuted]);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  return { speak, cancel };
}

function useSound(isMuted: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  const playTone = useCallback((freq: number, dur = 0.2) => {
    if (isMuted) return;
    try {
      if (!ctxRef.current)
        ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx  = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch { /* ignore */ }
  }, [isMuted]);

  const ding = useCallback(() => { playTone(880, 0.15); setTimeout(() => playTone(1100, 0.15), 150); }, [playTone]);
  const buzz = useCallback(() => { playTone(120, 0.25); }, [playTone]);

  return { ding, buzz };
}

// ─── Star particle burst (correct) ───────────────────────────────────────────

const STAR_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A8E063', '#FF9FF3'];

const StarBurst: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {Array.from({ length: 14 }).map((_, i) => {
      const angle  = (i / 14) * 360;
      const dist   = 80 + Math.random() * 60;
      const nx     = Math.cos((angle * Math.PI) / 180) * dist;
      const ny     = Math.sin((angle * Math.PI) / 180) * dist;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 8 + Math.random() * 8,
            height: 8 + Math.random() * 8,
            background: STAR_COLORS[i % STAR_COLORS.length],
            left: '50%', top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: nx, y: ny, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7 + Math.random() * 0.4, ease: 'easeOut' }}
        />
      );
    })}
  </div>
);

// ─── Object Card ─────────────────────────────────────────────────────────────

interface ObjectCardProps {
  side: Side;
  isBig: boolean;
  isSelected: boolean | null; // null = not yet answered, true/false = answered
  isTarget: boolean;          // this card is the correct answer
  phase: Phase;
  animateScale?: boolean;     // concept phase uses slow scale
  onClick?: () => void;
  cardRef?: React.RefObject<HTMLButtonElement>;
}

const ObjectCard: React.FC<ObjectCardProps & { isDark?: boolean; playWrongHover?: boolean }> = ({
  side, isBig, isSelected, isTarget, phase, animateScale, onClick, cardRef, isDark = false, playWrongHover = false,
}) => {
  const isAnswered = phase === 'correct' || phase === 'wrong';
  const showBurst  = isAnswered && isTarget && phase === 'correct';
  const isWrong    = isAnswered && isSelected === true && !isTarget && phase === 'wrong';

  const borderCls = playWrongHover
    ? 'border-red-400'
    : isAnswered
    ? isTarget
      ? 'border-emerald-400 shadow-emerald-200 shadow-xl'
      : isDark ? 'border-gray-700 opacity-50' : 'border-gray-100 opacity-50'
    : isDark ? 'border-gray-600' : 'border-gray-100';

  return (
    <div className="flex flex-col items-center gap-3 relative">
      {showBurst && <StarBurst />}

      <motion.button
        ref={cardRef}
        onClick={onClick}
        disabled={isAnswered || !onClick}
        animate={
          animateScale
            ? { scale: isBig ? 1.12 : 0.88, y: isBig ? -6 : 6 }
            : isWrong
            ? { x: [-8, 8, -6, 6, 0] }
            : isAnswered && isTarget && phase === 'correct'
            ? { scale: [1, 1.1, 1.05], y: [0, -8, -4] }
            : { scale: 1 }
        }
        transition={{ duration: animateScale ? 0.7 : 0.4 }}
        whileTap={!isAnswered ? { scale: 0.92 } : {}}
        className={`relative flex items-center justify-center rounded-3xl border-2 overflow-hidden transition-all
          w-[152px] h-[192px] sm:w-[178px] sm:h-[218px]
          ${isAnswered && isTarget
            ? isDark ? 'bg-emerald-950' : 'bg-emerald-50'
            : isWrong
            ? isDark ? 'bg-red-950' : 'bg-red-50'
            : playWrongHover
            ? isDark ? 'bg-red-950/40' : 'bg-red-50'
            : isDark ? 'bg-gray-800' : 'bg-white'
          }
          ${borderCls}
          ${!isAnswered && onClick ? 'active:scale-95 cursor-pointer' : ''}
          shadow-[0_4px_18px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_18px_rgba(0,0,0,0.3)]
        `}
      >
        {/* Glow ring for target on correct */}
        {isAnswered && isTarget && phase === 'correct' && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ boxShadow: ['0 0 0px #34d39980', '0 0 28px #34d39980', '0 0 0px #34d39980'] }}
            transition={{ duration: 0.8, repeat: 3 }}
          />
        )}

        <motion.span
          className={`select-none leading-none ${isBig ? 'text-[115px] sm:text-[130px]' : 'text-[65px] sm:text-[76px]'}`}
          animate={!isAnswered ? {
            rotate: [-2, 2, -2],
            y:      [0, -4, 0],
          } : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {side.emoji}
        </motion.span>

        {/* ✗ overlay on wrong hover in play mode */}
        {playWrongHover && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center rounded-3xl bg-red-400/20"
          >
            <span className="text-red-500 font-black text-5xl pointer-events-none">✗</span>
          </motion.div>
        )}

        {/* "✓" overlay on correct target */}
        {isAnswered && isTarget && phase === 'correct' && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute bottom-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-sm font-black">✓</span>
          </motion.div>
        )}
      </motion.button>

      {/* Name label — shows after answer */}
      <AnimatePresence>
        {isAnswered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className={`text-sm font-black rounded-xl px-3 py-1 ${
              isTarget && phase === 'correct'
                ? isDark ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {side.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Avatar Speech Bubble ─────────────────────────────────────────────────────

interface SpeechBubbleProps {
  avatar: string;
  text: string;
  highlight?: string;
  accent?: string;
  celebrating?: boolean;   // triggers extra bounce on the avatar
  isDark?: boolean;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  avatar, text, highlight, accent = 'text-violet-600', celebrating, isDark,
}) => {
  const parts = highlight ? text.split(highlight) : [text];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="flex items-end gap-3 w-full mx-auto"
    >
      {/* Avatar — bigger; celebrates inline instead of popup */}
      <motion.div
        key={celebrating ? 'celebrate' : 'idle'}
        animate={
          celebrating
            ? { y: [0, -22, 0, -14, 0, -8, 0], scale: [1, 1.18, 1, 1.12, 1] }
            : { y: [0, -6, 0] }
        }
        transition={
          celebrating
            ? { duration: 0.9, ease: 'easeOut' }
            : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
        }
        className="flex-none"
      >
        <KidAvatar avatar={avatar} size={88} />
      </motion.div>

      {/* Bubble sits right next to avatar */}
      <div
        className={`relative flex-1 rounded-2xl rounded-bl-none px-4 py-3 shadow-md border ${
          isDark
            ? 'bg-gray-700 border-gray-600'
            : 'bg-white border-gray-100'
        }`}
      >
        {/* Tail */}
        <div className="absolute bottom-0 left-0 -translate-x-1 translate-y-1">
          <div
            className={`w-4 h-4 rotate-0 border-l border-b ${
              isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-100'
            }`}
            style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
          />
        </div>

        <p className={`font-bold text-sm leading-snug ${
          isDark ? 'text-gray-100' : 'text-gray-700'
        }`}>
          {parts.map((p, i) => (
            <React.Fragment key={i}>
              {p}
              {i < parts.length - 1 && (
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className={`${accent} font-black text-base`}
                >
                  {highlight}
                </motion.span>
              )}
            </React.Fragment>
          ))}
        </p>
      </div>
    </motion.div>
  );
};

// ─── Virtual Play Pointer ─────────────────────────────────────────────────────

const VirtualPointer: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <motion.div
    className="fixed z-[600] pointer-events-none"
    initial={{ left: x, top: y }}
    animate={{ left: x, top: y }}
    transition={{ duration: 0.9, ease: 'easeInOut' }}
    style={{ transform: 'translate(-50%, -50%)' }}
  >
    <motion.div
      animate={{ scale: [1, 0.8, 1] }}
      transition={{ duration: 0.6, repeat: Infinity }}
      className="relative"
    >
      <MousePointer2 size={36} className="text-violet-700 drop-shadow-xl" fill="#ede9fe" />
      <motion.div
        animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 bg-violet-400 rounded-full blur-[18px] -z-10"
      />
    </motion.div>
  </motion.div>
);

// ─── Concept Panel ────────────────────────────────────────────────────────────

interface ConceptPanelProps {
  pair: Pair;
  asking: 'big' | 'small';
  onDone: () => void;
}

const ConceptPanel: React.FC<ConceptPanelProps & { isDark?: boolean; autoAdvance?: boolean }> = ({
  pair, asking, onDone, isDark = false, autoAdvance = false,
}) => {
  const target = asking === 'big' ? pair.big : pair.small;
  const other  = asking === 'big' ? pair.small : pair.big;
  const [secs, setSecs] = useState(5);

  useEffect(() => {
    if (!autoAdvance) return;
    const iv = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    const dt = setTimeout(onDone, 5000);
    return () => { clearInterval(iv); clearTimeout(dt); };
  }, [autoAdvance, onDone]);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className={`fixed inset-x-0 bottom-0 z-[400] rounded-t-3xl shadow-2xl border-t-4 border-violet-200 px-6 pt-5 pb-8 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}
      style={{ maxHeight: '60vh', overflowY: 'auto' }}
    >
      {/* Handle */}
      <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

      {/* Auto-advance progress bar */}
      {autoAdvance && (
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className={`h-full rounded-full ${asking === 'big' ? 'bg-amber-400' : 'bg-sky-400'}`}
          />
        </div>
      )}
      {autoAdvance && (
        <p className={`text-center text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>
          Continuing in {secs}s…
        </p>
      )}

      <h3 className={`text-center text-lg font-black mb-4 ${
        isDark ? 'text-gray-100' : 'text-gray-800'
      }`}>
        {asking === 'big'
          ? '🌍 What does BIG mean?'
          : '🔬 What does SMALL mean?'}
      </h3>

      {/* Visual demo */}
      <div className="flex items-end justify-center gap-8 mb-5">
        {/* Big object */}
        <div className="flex flex-col items-center gap-2">
          <motion.span
            className="text-[64px] leading-none"
            animate={{ scale: asking === 'big' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1.2, repeat: asking === 'big' ? Infinity : 0 }}
          >
            {pair.big.emoji}
          </motion.span>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${asking === 'big' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
            {pair.big.name}
          </span>
          {asking === 'big' && (
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">MORE space</span>
          )}
        </div>

        {/* Arrow */}
        <div className="text-3xl mb-6 text-gray-300">vs</div>

        {/* Small object */}
        <div className="flex flex-col items-center gap-2">
          <motion.span
            className="text-[36px] leading-none"
            animate={{ scale: asking === 'small' ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 1.2, repeat: asking === 'small' ? Infinity : 0 }}
          >
            {pair.small.emoji}
          </motion.span>
          <span className={`text-xs font-black px-3 py-1 rounded-full ${asking === 'small' ? 'bg-sky-100 text-sky-700' : 'bg-gray-100 text-gray-500'}`}>
            {pair.small.name}
          </span>
          {asking === 'small' && (
            <span className="text-[10px] font-bold text-sky-500 uppercase tracking-wide">LESS space</span>
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className={`rounded-2xl px-4 py-3 mb-5 text-center ${asking === 'big' ? 'bg-amber-50 border border-amber-100' : 'bg-sky-50 border border-sky-100'}`}>
        <p className={`font-black text-base ${asking === 'big' ? 'text-amber-700' : 'text-sky-700'}`}>
          {asking === 'big'
            ? `${pair.big.name} is BIG because it takes up MORE space!`
            : `${pair.small.name} is SMALL because it takes up LESS space!`}
        </p>
        <p className="text-gray-500 text-sm mt-1">
          {asking === 'big'
            ? 'Things that are bigger need more room around them.'
            : 'Things that are smaller need less room around them.'}
        </p>
      </div>

      <motion.button
        onClick={onDone}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3.5 rounded-2xl font-black text-white text-base shadow-md
          ${asking === 'big' ? 'bg-amber-500 shadow-amber-300' : 'bg-sky-500 shadow-sky-300'}`}
      >
        Got it! Let's continue →
      </motion.button>
    </motion.div>
  );
};

// ─── Completion Screen ────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FFD700','#FF6B6B','#4ECDC4','#FF9FF3','#A8E063','#FFA94D','#74C0FC'];
const AUTO_ADVANCE_SEC = 5;

const WalkingAvatarTransition: React.FC<{
  avatar: string;
  name: string;
  score: number;
  total: number;
  isDark: boolean;
  onDone: () => void;
  onReplay: () => void;
}> = ({ avatar, name, score, total, isDark, onDone, onReplay }) => {
  const [show,      setShow]      = useState(false);
  const [countdown, setCountdown] = useState(AUTO_ADVANCE_SEC);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(t);
  }, []);

  // tick countdown after show
  useEffect(() => {
    if (!show) return;
    if (countdown <= 0) { onDone(); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [show, countdown, onDone]);

  const confetti = useMemo(() => Array.from({ length: 28 }).map((_, i) => {
    const angle = (i / 28) * 360;
    const dist  = 90 + (i % 5) * 26;
    return {
      x: Math.cos((angle * Math.PI) / 180) * dist,
      y: Math.sin((angle * Math.PI) / 180) * dist - 50,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 7 + (i % 4) * 3,
      delay: (i % 6) * 0.06,
    };
  }), []);

  const podiumCoins = [
    { h: 36, w: 56, label: '1', color: '#C9A227', shade: '#A07D1A' },
    { h: 52, w: 56, label: '2', color: '#D4AF37', shade: '#B08A20' },
    { h: 72, w: 66, label: '5', color: '#FFD700', shade: '#C9A227', center: true },
    { h: 52, w: 56, label: '5', color: '#D4AF37', shade: '#B08A20' },
    { h: 36, w: 56, label: '1', color: '#C9A227', shade: '#A07D1A' },
  ];

  const bg = isDark ? '#111827' : '#2D3A5A';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[500] flex flex-col overflow-hidden"
      style={{ background: bg }}
    >
      {/* Title + stars */}
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : -28 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 320 }}
        className="flex-none text-center pt-14 px-6 select-none"
      >
        <p className="text-4xl font-black text-white tracking-widest uppercase">CORRECT!</p>
        <p className="text-xl text-white/90 font-bold mt-1">Great Job, {name}! 🎉</p>
        <div className="flex gap-1.5 justify-center mt-3">
          {Array.from({ length: total }).map((_, i) => (
            <Star key={i} size={22}
              fill={i < score ? '#fbbf24' : 'rgba(255,255,255,0.15)'}
              className={i < score ? 'text-amber-400' : 'text-white/20'}
            />
          ))}
        </div>
      </motion.div>

      {/* Avatar + podium + confetti */}
      <div className="flex-1 relative flex items-end justify-center pb-2">
        {show && confetti.map((c, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: c.size, height: c.size, background: c.color, left: '50%', bottom: '34%', zIndex: 12 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: c.x, y: c.y, opacity: 0, scale: 0.2 }}
            transition={{ duration: 1.0 + c.delay, delay: 0.1 + c.delay, ease: 'easeOut' }}
          />
        ))}
        {show && ['⭐','✨','🌟','⭐','✨'].map((s, i) => (
          <motion.span key={i} className="absolute text-2xl pointer-events-none"
            style={{ left: `${14 + i * 18}%`, bottom: '38%', zIndex: 11 }}
            initial={{ opacity: 0, y: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], y: -65 - i * 15, scale: [0, 1.3, 0] }}
            transition={{ delay: 0.25 + i * 0.15, duration: 1.1 }}
          />
        ))}

        <div className="relative z-20 flex flex-col items-center">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0, y: 36 }}
            animate={{ scale: show ? 1 : 0, y: show ? [0, -20, 0, -10, 0] : 36 }}
            transition={{ delay: 0.2, duration: 0.75, type: 'spring', stiffness: 280 }}
          >
            <KidAvatar avatar={avatar} size={110} flying />
          </motion.div>
          {/* Podium */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: show ? 1 : 0, y: show ? 0 : 28 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 260 }}
            className="flex items-end justify-center gap-1"
          >
            {podiumCoins.map((coin, i) => (
              <div key={i}
                className="rounded-xl flex items-center justify-center font-black shadow-lg"
                style={{
                  width: coin.w, height: coin.h,
                  background: `linear-gradient(160deg, ${coin.color} 40%, ${coin.shade})`,
                  color: coin.shade,
                  border: `3px solid ${coin.shade}`,
                  boxShadow: `0 5px 0 ${coin.shade}`,
                  fontSize: coin.center ? 20 : 14,
                }}
              >{coin.label}</div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Grass strip */}
      <div className="flex-none relative overflow-hidden" style={{ height: 44 }}>
        <div className="absolute inset-x-0 bottom-0"
          style={{ height: 44, background: '#4CAF50', borderTopLeftRadius: '60%', borderTopRightRadius: '60%' }}
        />
        {[10, 26, 42, 58, 74, 90].map((left, i) => (
          <div key={i} className="absolute"
            style={{ left: `${left}%`, bottom: 22, transform: 'translateX(-50%)' }}
          >
            <div style={{ width: 14, height: 20, background: '#388E3C', borderRadius: '50% 50% 0 0', display: 'inline-block', marginRight: 2 }} />
            <div style={{ width: 11, height: 16, background: '#43A047', borderRadius: '50% 50% 0 0', display: 'inline-block', marginRight: 2 }} />
            <div style={{ width: 13, height: 18, background: '#388E3C', borderRadius: '50% 50% 0 0', display: 'inline-block' }} />
          </div>
        ))}
      </div>

      {/* Buttons + countdown */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 24 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
        className="flex-none px-5 pb-10 pt-4 flex flex-col gap-3"
        style={{ background: bg }}
      >
        {/* Next module — primary */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onDone}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-black text-base text-white shadow-xl"
          style={{ background: '#7DC244' }}
        >
          <ArrowRight size={18} strokeWidth={3} />
          Next Module
          <span className="ml-auto text-white/60 text-sm font-bold">({countdown}s)</span>
        </motion.button>
        {/* Replay — secondary */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onReplay}
          className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-black text-base text-white shadow"
          style={{ background: 'rgba(255,255,255,0.14)', border: '2px solid rgba(255,255,255,0.22)' }}
        >
          <RefreshCw size={16} strokeWidth={2.5} />
          Play Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main Game Component ──────────────────────────────────────────────────────

interface SizeGameProps {
  target: GameTarget;
  moduleId: string;
  onBack?: () => void;
  onNext?: () => void;   // navigate directly to the next module
}

const SizeGame: React.FC<SizeGameProps> = ({ target, moduleId, onBack, onNext }) => {
  const { activeProfile } = useProfile();
  const { theme }   = useTheme();
  const isDark      = theme === 'dark';
  const kidName = (() => {
    if (activeProfile?.name) return activeProfile.name;
    try { return JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.name ?? 'Friend'; }
    catch { return 'Friend'; }
  })();
  const kidAvatar = (() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try { return JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird'; }
    catch { return 'bird'; }
  })();

  const [mode,        setMode]        = useState<GameMode>(getStoredMode);
  const [pairIdx,     setPairIdx]     = useState(0);
  const [asking,      setAsking]      = useState<'big' | 'small'>('big');
  const [leftIsBig,   setLeftIsBig]   = useState(true);
  const [phase,       setPhase]       = useState<Phase>('question');
  const [selected,    setSelected]    = useState<'left' | 'right' | null>(null);
  const [isMuted,     setIsMuted]     = useState(false);
  const [score,       setScore]       = useState(0);
  const [showConcept,    setShowConcept]    = useState(false);
  const [pointer,        setPointer]        = useState<{ x: number; y: number } | null>(null);
  const [hoverSide,      setHoverSide]      = useState<'left' | 'right' | null>(null);
  const [shownConcept,   setShownConcept]   = useState(false);
  const [celebrating,    setCelebrating]    = useState(false);
  const [modeDropOpen,   setModeDropOpen]   = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const { speak, cancel } = useSpeech(isMuted);
  const { ding, buzz }    = useSound(isMuted);

  const leftCardRef  = useRef<HTMLButtonElement>(null);
  const rightCardRef = useRef<HTMLButtonElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playRef      = useRef(false);

  const pair = PAIRS[pairIdx];

  // Which asking direction for this round
  const resolvedAsking = useMemo<'big' | 'small'>(() => {
    if (target === 'mix') return asking;
    return target === 'big' ? 'big' : 'small';
  }, [target, asking]);

  // Which side is correct (the answerable side)
  const correctSide = useMemo<'left' | 'right'>(() => {
    const targetIsBig = resolvedAsking === 'big';
    if (leftIsBig) return targetIsBig ? 'left' : 'right';
    return targetIsBig ? 'right' : 'left';
  }, [leftIsBig, resolvedAsking]);

  const correctObj = resolvedAsking === 'big' ? pair.big : pair.small;
  const wrongObj   = resolvedAsking === 'big' ? pair.small : pair.big;
  const leftObj    = leftIsBig ? pair.big : pair.small;
  const rightObj   = leftIsBig ? pair.small : pair.big;

  // ── Timing helpers ──────────────────────────────────────────────────────────

  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timerRef.current.push(t);
  }, []);

  const clearAll = useCallback(() => {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setPointer(null);
    setHoverSide(null);
    setCelebrating(false);
    playRef.current = false;
    cancel();
  }, [cancel]);

  // ── Reset round ─────────────────────────────────────────────────────────────

  const resetRound = useCallback((
    idx: number,
    nextAsking: 'big' | 'small' = target === 'small' ? 'small' : 'big',
  ) => {
    clearAll();
    setPairIdx(idx);
    setAsking(nextAsking);
    setLeftIsBig(Math.random() < 0.5);
    setPhase('question');
    setSelected(null);
    setShowConcept(false);
  }, [clearAll, target]);

  // ── Handle answer ──────────────────────────────────────────────────────────

  const handleAnswer = useCallback((side: 'left' | 'right') => {
    if (phase !== 'question') return;
    setSelected(side);

    const isRight = side === correctSide;
    if (isRight) {
      setPhase('correct');
      setScore(s => { const ns = s + 1; recordCompletion(moduleId, PAIRS.length, ns); return ns; });
      ding();
      speak(`Yes! ${correctObj.name} is ${resolvedAsking === 'big' ? 'BIG' : 'SMALL'}! Great job, ${kidName}!`, 0.9, 1.3);

      // 1. Show avatar celebration overlay
      setCelebrating(true);
      after(1800, () => setCelebrating(false));

      after(2400, () => {
        if (!shownConcept) {
          setShownConcept(true);
          setShowConcept(true);
        } else {
          const nextIdx = pairIdx + 1;
          if (nextIdx < PAIRS.length) {
            const nextAsking = target === 'mix'
              ? (Math.random() < 0.5 ? 'big' : 'small')
              : target === 'small' ? 'small' : 'big';
            resetRound(nextIdx, nextAsking);
          } else {
            setPhase('walking');
            speak(`Woohoo ${kidName}! You got them all! Let's go!`, 0.85, 1.3);
          }
        }
      });
    } else {
      setPhase('wrong');
      buzz();
      speak(`Hmm, look again! Which one is ${resolvedAsking === 'big' ? 'bigger' : 'smaller'}, ${kidName}?`, 0.9, 1.2);
      after(2000, () => {
        setPhase('question');
        setSelected(null);
      });
    }
  }, [phase, correctSide, ding, buzz, speak, correctObj, resolvedAsking, kidName,
      shownConcept, pairIdx, target, after, resetRound, moduleId]);

  // ── Concept done ────────────────────────────────────────────────────────────

  const onConceptDone = useCallback(() => {
    setShowConcept(false);
    const nextIdx = pairIdx + 1;
    if (nextIdx < PAIRS.length) {
      const nextAsking = target === 'mix'
        ? (Math.random() < 0.5 ? 'big' : 'small')
        : target === 'small' ? 'small' : 'big';
      resetRound(nextIdx, nextAsking);
    } else {
      setPhase('walking');
      speak(`Woohoo! You got them all! Let's go!`, 0.85, 1.3);
    }
  }, [pairIdx, target, resetRound, speak]);

  // ── Play mode automation ────────────────────────────────────────────────────

  const runPlayMode = useCallback(async () => {
    if (playRef.current) return;
    playRef.current = true;

    await new Promise<void>(r => { after(600, r); });
    speak(`Hey ${kidName}! Let's find which one is ${resolvedAsking === 'big' ? 'BIG' : 'SMALL'}!`, 0.9, 1.3);

    // Move pointer to wrong side first
    await new Promise<void>(r => { after(2000, r); });
    const wrongRef  = correctSide === 'left' ? rightCardRef : leftCardRef;
    const wrongSide = correctSide === 'left' ? 'right' : 'left';
    const wrongEl   = wrongRef.current;
    if (wrongEl) {
      const r = wrongEl.getBoundingClientRect();
      setPointer({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setHoverSide(wrongSide as 'left' | 'right');
    speak(`Hmm… is it this one?`, 0.9, 1.2);

    await new Promise<void>(r => { after(1800, r); });
    // Shake pointer (hesitate)
    speak(`No, wait! Let me look closer…`);

    // Move pointer to correct side
    await new Promise<void>(r => { after(1600, r); });
    const correctEl = (correctSide === 'left' ? leftCardRef : rightCardRef).current;
    if (correctEl) {
      const r = correctEl.getBoundingClientRect();
      setPointer({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    speak(`Yes! ${correctObj.name} is ${resolvedAsking === 'big' ? 'BIG' : 'SMALL'}! Let me tap it!`);
    // Wait for the pointer animation (0.9s) to finish arriving at correct card, THEN clear red
    await new Promise<void>(r => { after(950, r); });
    setHoverSide(null);

    await new Promise<void>(r => { after(700, r); });
    setPointer(null);
    handleAnswer(correctSide);
    playRef.current = false;
  }, [after, speak, correctSide, correctObj, resolvedAsking, kidName, handleAnswer]);

  // Trigger play mode automation on question phase
  useEffect(() => {
    if (mode === 'play' && phase === 'question') {
      const t = setTimeout(runPlayMode, 800);
      return () => clearTimeout(t);
    }
  }, [mode, phase, pairIdx, runPlayMode]);

  // Opening speech
  useEffect(() => {
    resetRound(0, target === 'small' ? 'small' : 'big');
    after(300, () => {
      speak(`Hi ${kidName}! I will teach you about ${target === 'big' ? 'BIG' : target === 'small' ? 'SMALL' : 'BIG and SMALL'} today!`, 0.85, 1.3);
    });
    return () => { clearAll(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModeSwitch = (m: GameMode) => {
    clearAll();
    setMode(m);
    storeMode(m);
    setScore(0);
    setShownConcept(false);
    setModeDropOpen(false);
    resetRound(0, target === 'small' ? 'small' : 'big');
    after(400, () => {
      speak(m === 'play'
        ? `Watch me, ${kidName}! I will show you how!`
        : `Your turn, ${kidName}! Tap the ${target === 'big' ? 'BIG' : target === 'small' ? 'SMALL' : 'right'} one!`,
        0.9, 1.3);
    });
  };

  // Close mode dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setModeDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Prompt text ─────────────────────────────────────────────────────────────

  const promptText = (() => {
    if (phase === 'correct')
      return `Yes! ${correctObj.name} is ${resolvedAsking === 'big' ? 'BIG' : 'SMALL'}! 🎉`;
    if (phase === 'wrong')
      return `Let's look again 👀`;
    return `${kidName}, which one looks ${resolvedAsking === 'big' ? 'BIG' : 'SMALL'}?`;
  })();

  const promptHighlight = phase === 'question'
    ? (resolvedAsking === 'big' ? 'BIG' : 'SMALL')
    : undefined;

  const promptAccent = resolvedAsking === 'big'
    ? 'text-amber-600'
    : 'text-sky-600';

  // ── Header config ───────────────────────────────────────────────────────────

  const progressDots = (
    <div className="flex gap-2 justify-center">
      {PAIRS.map((_, i) => (
        <motion.div
          key={i}
          animate={{ scale: i === pairIdx ? 1.3 : 1 }}
          className={`w-2.5 h-2.5 rounded-full transition-colors ${
            i < pairIdx     ? 'bg-emerald-400'
            : i === pairIdx ? (resolvedAsking === 'big' ? 'bg-amber-500' : 'bg-sky-500')
                             : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const ACCENT_MAP_LOCAL: Record<string, string> = {
    violet: 'from-violet-500 to-indigo-600', rose:  'from-rose-500 to-pink-500',
    amber:  'from-amber-500 to-orange-500',  teal:  'from-teal-500 to-sky-500',
    green:  'from-green-600 to-emerald-600', pink:  'from-pink-600 to-purple-600',
  };
  const accentId   = localStorage.getItem('kids_accent_color') ?? 'amber';
  const headerGrad = ACCENT_MAP_LOCAL[accentId] ?? 'from-amber-400 to-orange-500';
  const targetEmoji = target === 'big' ? '🐘' : target === 'small' ? '🐜' : '⚖️';
  const targetLabel = target === 'big' ? 'Big' : target === 'small' ? 'Small' : 'Big & Small';

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className={`flex flex-col h-screen select-none overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>

      {/* ── Header (green, module badge + mode + sound) ── */}
      <div
        className="flex items-center gap-3 px-4 flex-none"
        style={{
          background: '#7DC244',
          paddingTop: 'env(safe-area-inset-top, 14px)',
          paddingBottom: 12,
        }}
      >
        {/* Back */}
        {onBack && (
          <motion.button whileTap={{ scale: 0.85 }} onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white flex-none">
            <ChevronLeft size={20} strokeWidth={3} />
          </motion.button>
        )}

        {/* Module badge + title: just the topic name */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-amber-400 border-[3px] border-amber-300 flex items-center justify-center flex-none shadow-md">
            <span className="text-2xl leading-none">{targetEmoji}</span>
          </div>
          <p className="text-white font-black text-xl leading-tight">
            {targetLabel}
          </p>
        </div>

        {/* MODE dropdown — dark pill */}
        <div className="relative flex-none" ref={dropRef}>
          <button
            onClick={() => setModeDropOpen(o => !o)}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-md"
            style={{ background: '#3B4A2A' }}
          >
            <span className="text-white text-[9px] font-black tracking-widest text-center leading-none uppercase">
              {mode === 'play' ? 'PLAY' : 'PRAC'}
            </span>
          </button>

          <AnimatePresence>
            {modeDropOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }}
                transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[200] w-44"
              >
                {([
                  { id: 'play'     as GameMode, label: 'Play Mode',   desc: 'Watch & learn',    icon: <Play size={13} fill="#6d28d9" className="text-violet-600" /> },
                  { id: 'practice' as GameMode, label: 'Practice',    desc: 'Your turn to tap!', icon: <MousePointer2 size={13} className="text-emerald-600" /> },
                ] as const).map(opt => (
                  <button key={opt.id} onClick={() => handleModeSwitch(opt.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                      mode === opt.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center flex-none">{opt.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-gray-800 truncate">{opt.label}</p>
                      <p className="text-[10px] text-gray-400 truncate">{opt.desc}</p>
                    </div>
                    {mode === opt.id && <Check size={11} className="text-emerald-500 flex-none" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sound button — white outlined box */}
        <button
          onClick={() => { setIsMuted(m => !m); cancel(); }}
          className="w-12 h-12 flex items-center justify-center rounded-xl flex-none"
          style={{
            background: isDark ? 'rgba(255,255,255,0.12)' : 'white',
            border: isDark ? '2px solid rgba(255,255,255,0.2)' : '3px solid rgba(255,255,255,0.7)',
          }}
        >
          {isMuted
            ? <VolumeX size={22} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            : <Volume2 size={22} className="text-[#7DC244]" />}
        </button>
      </div>

      {/* ── Big title ── */}
      <div className="flex-none pt-3 pb-2 px-4 text-center">
        <motion.h1
          key={`title-${pairIdx}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-black uppercase tracking-wide leading-tight"
          style={{ color: '#7DC244', letterSpacing: '0.05em' }}
        >
          {resolvedAsking === 'big' ? 'Find the Big One' : 'Find the Small One'}
        </motion.h1>
        <div className="mt-2">{progressDots}</div>
      </div>

      {/* ── Cards (content boundary) ── */}
      <div className={`flex-1 flex flex-col items-center justify-center mx-4 rounded-3xl min-h-0 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <motion.div
          key={`cards-${pairIdx}`}
          className="flex items-center justify-center gap-6 sm:gap-14 w-full px-4"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.32, type: 'spring', stiffness: 340, damping: 26 }}
        >
          {(['left', 'right'] as const).map(side => {
            const obj      = side === 'left' ? leftObj : rightObj;
            const isBig    = side === 'left' ? leftIsBig : !leftIsBig;
            const isTarget = side === correctSide;
            const thisRef  = side === 'left' ? leftCardRef : rightCardRef;
            // In play mode the pointer hovers over wrong side — highlight it red briefly
            const isPlayWrongHover = mode === 'play' && hoverSide === side && !isTarget;
            return (
              <ObjectCard
                key={side}
                side={obj}
                isBig={isBig}
                isTarget={isTarget}
                isSelected={selected === side ? true : null}
                phase={phase}
                animateScale={showConcept && phase === 'correct'}
                onClick={mode === 'practice' && phase === 'question'
                  ? () => handleAnswer(side)
                  : undefined}
                cardRef={thisRef as React.RefObject<HTMLButtonElement>}
                isDark={isDark}
                playWrongHover={isPlayWrongHover}
              />
            );
          })}
        </motion.div>

        {/* Instruction */}
        <motion.p
          key={`instr-${pairIdx}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-xl font-black text-center px-4 pb-4 ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          Tap on the {resolvedAsking === 'big' ? 'bigger' : 'smaller'} object.
        </motion.p>
      </div>

      {/* ── Avatar + speech bubble (below cards) ── */}
      <div className={`flex-none px-4 pt-2 pb-2 ${
        isDark ? 'bg-gray-900' : 'bg-white'
      }`}>
        <AnimatePresence mode="wait">
          <SpeechBubble
            key={`bubble-${pairIdx}-${phase}`}
            avatar={kidAvatar}
            text={promptText}
            highlight={promptHighlight}
            accent={promptAccent}
            celebrating={celebrating}
            isDark={isDark}
          />
        </AnimatePresence>
      </div>

      {/* Floating ? help badge — bottom-right corner */}
      <motion.button
        whileTap={{ scale: 0.88 }}
        onClick={() => setShowConcept(true)}
        className="fixed right-5 bottom-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white font-black text-2xl"
        style={{ background: '#F5A623' }}
      >
        ?
      </motion.button>

      {/* Celebrating — only confetti particles now; avatar reacts inline in SpeechBubble */}
      <AnimatePresence>
        {celebrating && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[450] pointer-events-none"
          >
            {Array.from({ length: 18 }).map((_, i) => {
              const angle = (i / 18) * 360;
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 8 + (i % 4) * 3, height: 8 + (i % 4) * 3,
                    background: STAR_COLORS[i % STAR_COLORS.length],
                    left: '50%', top: '45%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos((angle * Math.PI) / 180) * (110 + (i % 3) * 40),
                    y: Math.sin((angle * Math.PI) / 180) * (90 + (i % 3) * 30),
                    opacity: 0, scale: 0.2,
                  }}
                  transition={{ duration: 0.75 + (i % 3) * 0.2, ease: 'easeOut' }}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Concept panel */}
      <AnimatePresence>
        {showConcept && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm"
            />
            <ConceptPanel pair={pair} asking={resolvedAsking} onDone={onConceptDone} isDark={isDark} autoAdvance={mode === 'play'} />
          </>
        )}
      </AnimatePresence>

      {/* Virtual pointer (play mode) */}
      <AnimatePresence>
        {pointer && <VirtualPointer x={pointer.x} y={pointer.y} />}
      </AnimatePresence>

      {/* Completion screen */}
      <AnimatePresence>
        {phase === 'walking' && (
          <WalkingAvatarTransition
            avatar={kidAvatar}
            name={kidName}
            score={score}
            total={PAIRS.length}
            isDark={isDark}
            onDone={() => {
              clearAll();
              if (onNext) {
                onNext();
              } else if (onBack) {
                onBack();
              } else {
                setScore(0); setShownConcept(false); setCelebrating(false);
                resetRound(0, target === 'small' ? 'small' : 'big');
              }
            }}
            onReplay={() => {
              clearAll();
              setScore(0); setShownConcept(false); setCelebrating(false);
              resetRound(0, target === 'small' ? 'small' : 'big');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SizeGame;
