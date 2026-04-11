/**
 * HungryCaterpillarModule.tsx — "The Hungry Caterpillar"
 * A caterpillar on a branch wants the missing leaf between two letters.
 * Kid mode: shows the answer automatically. Practice: child picks the leaf.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

// ─── Caterpillar SVG component ────────────────────────────────────────────────
const Caterpillar: React.FC<{ wiggle?: boolean; sad?: boolean }> = ({ wiggle, sad }) => {
  const segments = [
    { r: 22, fill: '#4ade80', x: 0 },
    { r: 20, fill: '#22c55e', x: 38 },
    { r: 19, fill: '#4ade80', x: 74 },
    { r: 18, fill: '#22c55e', x: 108 },
    { r: 17, fill: '#4ade80', x: 140 },
  ];
  return (
    <svg width={186} height={60} viewBox="0 0 186 60">
      {/* Body segments */}
      {segments.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x + s.r}
          cy={34}
          r={s.r}
          fill={s.fill}
          stroke="white"
          strokeWidth={1.5}
          animate={wiggle ? {
            y: [-2, -10 + i * 1.5, -2],
            scaleX: [1, 0.92, 1],
          } : sad ? {
            y: [0, 3, 0, 3, 0],
          } : {
            y: [0, -3, 0],
          }}
          transition={wiggle ? {
            duration: 0.5,
            delay: i * 0.07,
            repeat: 3,
            repeatType: 'mirror',
          } : sad ? {
            duration: 0.8,
            repeat: 1,
          } : {
            duration: 2,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
      {/* Head */}
      <motion.circle
        cx={173}
        cy={26}
        r={24}
        fill="#16a34a"
        stroke="white"
        strokeWidth={2}
        animate={wiggle ? { scale: [1, 1.25, 1], rotate: [-8, 8, -8, 0] } : {}}
        transition={wiggle ? { duration: 0.7, type: 'spring', stiffness: 280 } : {}}
      />
      {/* Eyes */}
      <circle cx={165} cy={20} r={5} fill="white" />
      <circle cx={181} cy={20} r={5} fill="white" />
      <motion.circle
        cx={165} cy={20} r={2.5} fill="#1a1a1a"
        animate={wiggle ? { cx: [165, 167, 165] } : sad ? { cy: [20, 22, 20] } : {}}
        transition={{ duration: 0.4, repeat: wiggle ? 3 : 0 }}
      />
      <motion.circle
        cx={181} cy={20} r={2.5} fill="#1a1a1a"
        animate={wiggle ? { cx: [181, 183, 181] } : sad ? { cy: [20, 22, 20] } : {}}
        transition={{ duration: 0.4, repeat: wiggle ? 3 : 0 }}
      />
      {/* Smile or sad */}
      {sad ? (
        <path d="M 163 30 Q 173 26 183 30" stroke="#1a1a1a" strokeWidth={2} fill="none" strokeLinecap="round" />
      ) : (
        <motion.path
          d="M 163 28 Q 173 36 183 28"
          stroke="#1a1a1a"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          animate={wiggle ? { d: ['M 163 28 Q 173 36 183 28', 'M 163 26 Q 173 40 183 26', 'M 163 28 Q 173 36 183 28'] } : {}}
          transition={{ duration: 0.4, repeat: 3 }}
        />
      )}
      {/* Antennae */}
      <line x1="170" y1="4" x2="163" y2="-4" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" />
      <line x1="176" y1="4" x2="183" y2="-4" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={163} cy={-4} r={3.5} fill="#bbf7d0" />
      <circle cx={183} cy={-4} r={3.5} fill="#bbf7d0" />
    </svg>
  );
};

// ─── Leaf SVG (used for both the branch leaves and option buttons) ────────────
const LeafShape: React.FC<{
  label: string;
  color?: string;
  size?: number;
  empty?: boolean;
  glow?: boolean;
  bite?: boolean;
}> = ({ label, color = '#4ade80', size = 88, empty, glow, bite }) => {
  const h = size;
  const w = size * 0.82;
  return (
    <svg width={w} height={h} viewBox="0 0 82 100">
      {glow && (
        <ellipse cx={41} cy={50} rx={36} ry={44}
          fill="none" stroke="#fde047" strokeWidth={4} opacity={0.7}>
          <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" />
        </ellipse>
      )}
      {empty ? (
        <ellipse cx={41} cy={50} rx={33} ry={41}
          fill="none" stroke={glow ? '#fde047' : '#a3e635'} strokeWidth={3}
          strokeDasharray={glow ? undefined : '6 4'} opacity={glow ? 1 : 0.7} />
      ) : bite ? (
        <path d="M41 9 C 8 16, 6 86, 41 93 C 76 86, 74 16, 41 9 Z
                 M 25 52 Q 33 44 21 40 Q 14 38 16 47 Q 18 55 26 53 Z"
          fill={color} />
      ) : (
        <ellipse cx={41} cy={50} rx={33} ry={41} fill={color} />
      )}
      {/* Midrib */}
      {!empty && (
        <line x1={41} y1={12} x2={41} y2={87} stroke="rgba(255,255,255,0.55)" strokeWidth={2.5} strokeLinecap="round" />
      )}
      {/* Veins */}
      {!empty && !bite && (
        <>
          <line x1={41} y1={36} x2={20} y2={28} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={41} y1={36} x2={62} y2={28} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={41} y1={54} x2={15} y2={52} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={41} y1={54} x2={67} y2={52} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
      {/* Label */}
      <text x={41} y={58} textAnchor="middle"
        fontFamily="system-ui, sans-serif" fontWeight="900"
        fontSize={empty ? 30 : 34} fill={empty ? (glow ? '#ca8a04' : '#86efac') : 'white'}
        style={{ textShadow: 'none' }}>
        {empty ? '?' : label}
      </text>
    </svg>
  );
};

// ─── Branch SVG ───────────────────────────────────────────────────────────────
const Branch: React.FC<{ width: number }> = ({ width }) => (
  <svg width={width} height={40} viewBox={`0 0 ${width} 40`} preserveAspectRatio="none">
    <path d={`M 0 28 Q ${width * 0.25} 18 ${width * 0.5} 22 Q ${width * 0.75} 26 ${width} 20`}
      stroke="#92400e" strokeWidth={12} fill="none" strokeLinecap="round" />
    <path d={`M 0 28 Q ${width * 0.25} 18 ${width * 0.5} 22 Q ${width * 0.75} 26 ${width} 20`}
      stroke="#b45309" strokeWidth={7} fill="none" strokeLinecap="round" />
    {/* Bark texture lines */}
    {[0.15, 0.35, 0.55, 0.75].map((t, i) => (
      <line key={i}
        x1={width * t - 8} y1={22 + (i % 2) * 4}
        x2={width * t + 8} y2={24 + (i % 2) * 4}
        stroke="#78350f" strokeWidth={1.5} strokeLinecap="round" opacity={0.6} />
    ))}
  </svg>
);

// ─── Round data ───────────────────────────────────────────────────────────────
function buildRound(roundIdx: number) {
  const start = roundIdx % 24;
  const a = ALPHABET_DATA[start].letter;
  const b = ALPHABET_DATA[start + 1].letter;   // ← correct missing letter
  const c = ALPHABET_DATA[start + 2].letter;
  const wrong = ALPHABET_DATA[(start + 4) % 26].letter;
  const wrongTwo = ALPHABET_DATA[(start + 5) % 26].letter;
  return { a, missing: b, c, wrong, wrongTwo };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HungryCaterpillarModule() {
  const navigate = useNavigate();
  const { activeProfile, availableProfiles } = useProfile() as any;
  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try {
      const id = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const hit = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return hit?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const [mode, setMode] = useState<'play' | 'practice'>('play');
  const [isMuted, setIsMuted] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);
  const [solved, setSolved] = useState(false);
  const [bitten, setBitten] = useState(false);
  const [caterpillarState, setCaterpillarState] = useState<'idle' | 'wiggle' | 'sad'>('idle');
  const [wrongChoice, setWrongChoice] = useState<string | null>(null);
  const { speak } = useSpeech(isMuted);

  const round = useMemo(() => buildRound(roundIdx), [roundIdx]);

  const choices = useMemo(() => {
    const arr = [round.missing, round.wrong];
    if (roundIdx % 2 === 1) arr.reverse();
    return arr;
  }, [round, roundIdx]);

  // Reset on new round
  useEffect(() => {
    setSolved(false);
    setBitten(false);
    setCaterpillarState('idle');
    setWrongChoice(null);
    const timeout = setTimeout(() =>
      speak(
        mode === 'play'
          ? `The hungry caterpillar wants the next leaf! ${round.a}... something... ${round.c}! Watch me find it!`
          : `The hungry caterpillar wants the next leaf! What comes between ${round.a} and ${round.c}?`
      ),
      500
    );
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  // Kid mode: auto-solve
  useEffect(() => {
    if (mode !== 'play' || solved) return;
    const t1 = setTimeout(() => {
      setSolved(true);
      speak(`${round.missing}! ${round.a}, ${round.missing}, ${round.c}!`);
    }, 2200);
    const t2 = setTimeout(() => {
      setBitten(true);
      setCaterpillarState('wiggle');
      speak(`Yum yum! The caterpillar is happy!`);
    }, 3600);
    const t3 = setTimeout(() => setCaterpillarState('idle'), 5200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode, solved]);

  const handleLeafTap = useCallback((letter: string) => {
    if (mode !== 'practice' || solved) return;
    if (letter === round.missing) {
      setSolved(true);
      setCaterpillarState('wiggle');
      speak(`${letter}! Crunch! ${round.a}, ${letter}, ${round.c}! The caterpillar is full and happy!`);
      setTimeout(() => setBitten(true), 700);
      setTimeout(() => setCaterpillarState('idle'), 2200);
    } else {
      setWrongChoice(letter);
      setCaterpillarState('sad');
      speak(`Oops! That's ${letter}! The caterpillar sniffles. Try the other leaf!`);
      setTimeout(() => {
        setWrongChoice(null);
        setCaterpillarState('idle');
      }, 1200);
    }
  }, [mode, solved, round, speak]);

  const bubbleText = caterpillarState === 'wiggle'
    ? `Yum yum! ${round.a}, ${round.missing}, ${round.c}! The caterpillar is happy! 🎉`
    : solved
    ? `Great find! ${round.missing} goes between ${round.a} and ${round.c}! 🌟`
    : mode === 'play'
    ? `The hungry caterpillar wriggles on its branch... 🐛`
    : `What comes between ${round.a} and ${round.c}? Tap the right leaf! 🍃`;

  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#f0fdf4 0%,#bbf7d0 35%,#86efac 70%,#4ade80 100%)' }}
    >
      {/* Floating nature particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none text-xl"
          style={{ left: `${(i * 13 + 5) % 90}%`, top: `${(i * 17 + 8) % 60}%`, opacity: 0.18 }}
          animate={{ y: [0, -18, 0], rotate: [0, 15, -10, 0] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.5 }}
        >
          🍃
        </motion.div>
      ))}

      {/* Top Bar */}
      <div
        className="flex-none flex items-center justify-between px-4 shadow-sm"
        style={{
          paddingTop: 'env(safe-area-inset-top,16px)',
          paddingBottom: 10,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(12px)',
          borderBottom: '2px solid rgba(74,222,128,0.35)',
          zIndex: 20,
        }}
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { setMode(m => m === 'play' ? 'practice' : 'play'); setRoundIdx(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-sm"
            style={{
              background: mode === 'practice' ? '#16a34a' : 'rgba(22,163,74,0.15)',
              color: mode === 'practice' ? 'white' : '#15803d',
              border: '1.5px solid rgba(22,163,74,0.4)',
            }}
          >
            {mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </motion.button>
          <div>
            <p className="font-black text-green-800 text-base leading-tight">Hungry Caterpillar</p>
            <p className="text-xs font-bold text-green-600">
              {round.a} <span className="opacity-40">·</span> _ <span className="opacity-40">·</span> {round.c}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(m => !m)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(22,163,74,0.12)', border: '1.5px solid rgba(22,163,74,0.3)' }}
          >
            {isMuted ? <VolumeX size={18} color="#15803d" /> : <Volume2 size={18} color="#15803d" />}
          </button>
          <button
            onClick={() => navigate('/games/alphabets')}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(22,163,74,0.12)', border: '1.5px solid rgba(22,163,74,0.3)' }}
          >
            <X size={22} color="#15803d" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Main Scene */}
      <div className="flex-1 flex flex-col items-center justify-around px-4 py-2 overflow-hidden">

        {/* Caterpillar */}
        <motion.div
          className="flex items-center justify-center"
          animate={caterpillarState === 'wiggle'
            ? { x: [0, 18, 0, 14, 0, 8, 0] }
            : caterpillarState === 'sad'
            ? { y: [0, 5, 0, 4, 0] }
            : {}}
          transition={{ duration: caterpillarState === 'wiggle' ? 1.2 : 0.6 }}
          style={{ marginTop: 4 }}
        >
          <Caterpillar wiggle={caterpillarState === 'wiggle'} sad={caterpillarState === 'sad'} />
        </motion.div>

        {/* Branch with leaves */}
        <div className="w-full max-w-sm relative" style={{ height: 180 }}>
          {/* Branch underneath */}
          <div className="absolute bottom-0 left-0 right-0">
            <Branch width={340} />
          </div>

          {/* Three leaves */}
          <div className="absolute inset-0 flex items-start justify-around px-2 pt-2">
            {/* Leaf A */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-1 h-6 rounded-full" style={{ background: '#16a34a' }} />
                <LeafShape label={round.a} color="#22c55e" size={88} />
              </div>
            </motion.div>

            {/* Missing leaf - gap */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.22, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-1 h-6 rounded-full" style={{ background: solved ? '#16a34a' : '#a3e635' }} />
                <AnimatePresence mode="wait">
                  {solved ? (
                    <motion.div
                      key="filled"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    >
                      <LeafShape label={round.missing} color="#16a34a" size={88} bite={bitten} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <LeafShape label="?" size={88} empty glow />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Leaf C */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.34, type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="flex flex-col items-center">
                <div className="w-1 h-6 rounded-full" style={{ background: '#16a34a' }} />
                <LeafShape label={round.c} color="#22c55e" size={88} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Options (practice) or Next button (after solve) */}
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div
              key="next"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setRoundIdx(i => i + 1)}
                className="px-8 py-3.5 rounded-2xl font-black text-lg text-white shadow-lg"
                style={{ background: '#16a34a', boxShadow: '0 5px 0 #14532d' }}
              >
                Next Leaf ▶
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/games/alphabets')}
                className="px-6 py-3.5 rounded-2xl font-black text-green-800"
                style={{ background: 'rgba(255,255,255,0.9)', border: '2px solid #86efac' }}
              >
                Menu
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-6 items-end"
            >
              <p className="absolute opacity-0">options</p>
              {choices.map(letter => {
                const isWrong = wrongChoice === letter;
                const leafColor = letter === round.missing ? '#16a34a' : '#dc2626';
                return (
                  <motion.button
                    key={letter}
                    animate={isWrong ? { x: [-12, 12, -10, 10, -6, 6, 0], y: [0, 4, 0, 4, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    whileTap={mode === 'practice' ? { scale: 0.88 } : {}}
                    onClick={() => handleLeafTap(letter)}
                    className="relative flex flex-col items-center gap-1"
                    style={{ opacity: mode === 'play' ? 0.45 : 1 }}
                  >
                    <LeafShape
                      label={letter}
                      color={isWrong ? '#fca5a5' : mode === 'play' ? '#22c55e' : '#15803d'}
                      size={96}
                    />
                    {mode === 'practice' && (
                      <span
                        className="text-[10px] font-black"
                        style={{ color: '#15803d', marginTop: -4 }}
                      >
                        Tap me!
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + speech bubble */}
      <div
        className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom,16px)', zIndex: 10 }}
      >
        <motion.div
          className="shrink-0 flex items-center justify-center"
          style={{ width: 72, height: 72 }}
          animate={caterpillarState === 'wiggle'
            ? { y: [0, -22, 0, -14, 0, -8, 0], scale: [1, 1.18, 0.96, 1.12, 1] }
            : caterpillarState === 'sad'
            ? { x: [0, -8, 8, -6, 6, -3, 3, 0] }
            : {}}
          transition={{ duration: caterpillarState === 'wiggle' ? 0.9 : 0.55 }}
        >
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`bubble-${roundIdx}-${caterpillarState}-${solved}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2"
            style={{ background: 'rgba(255,255,255,0.95)', border: '1.5px solid #bbf7d0' }}
          >
            <button
              onClick={() => setIsMuted(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#16a34a' }}
            >
              <Volume2 size={14} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
