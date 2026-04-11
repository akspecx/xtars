/**
 * DailyObjectsModule.tsx — “Objects Around Us”
 * 20 iconic kid-friendly objects (fruits, animals, daily things).
 *
 * Kid mode    → one object at a time, auto-plays with TTS.
 * Practice    → 3 cards shown, “Can you spot the [X]?” spot-the-object game.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX }    from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';

type Mode = 'play' | 'practice';
interface Obj { emoji: string; word: string; color: string; bg: string; }

// 20 iconic objects every child knows
const ALL_OBJECTS: Obj[] = [
  { emoji: '🍎', word: 'Apple',     color: '#e11d48', bg: 'linear-gradient(135deg,#fce7f3,#fda4af,#fb7185)' },
  { emoji: '🍊', word: 'Orange',    color: '#ea580c', bg: 'linear-gradient(135deg,#ffedd5,#fdba74,#fb923c)' },
  { emoji: '🥭', word: 'Mango',     color: '#d97706', bg: 'linear-gradient(135deg,#fef3c7,#fcd34d,#fbbf24)' },
  { emoji: '🍌', word: 'Banana',    color: '#ca8a04', bg: 'linear-gradient(135deg,#fefce8,#fde047,#eab308)' },
  { emoji: '🍇', word: 'Grapes',    color: '#7c3aed', bg: 'linear-gradient(135deg,#f5f3ff,#c4b5fd,#a78bfa)' },
  { emoji: '🐘', word: 'Elephant',  color: '#475569', bg: 'linear-gradient(135deg,#f1f5f9,#94a3b8,#64748b)' },
  { emoji: '🐮', word: 'Cow',       color: '#92400e', bg: 'linear-gradient(135deg,#fef3c7,#d97706,#92400e)' },
  { emoji: '🐴', word: 'Horse',     color: '#78350f', bg: 'linear-gradient(135deg,#fef3c7,#fbbf24,#78350f)' },
  { emoji: '🦁', word: 'Lion',      color: '#b45309', bg: 'linear-gradient(135deg,#fefce8,#fde68a,#f59e0b)' },
  { emoji: '🐒', word: 'Monkey',    color: '#92400e', bg: 'linear-gradient(135deg,#fef3c7,#fb923c,#92400e)' },
  { emoji: '🌙', word: 'Moon',      color: '#7c3aed', bg: 'linear-gradient(135deg,#ede9fe,#c4b5fd,#a78bfa)' },
  { emoji: '☀️', word: 'Sun',       color: '#ea580c', bg: 'linear-gradient(135deg,#ffedd5,#fb923c,#f97316)' },
  { emoji: '⭐', word: 'Star',      color: '#ca8a04', bg: 'linear-gradient(135deg,#fef9c3,#fde047,#eab308)' },
  { emoji: '🚗', word: 'Car',       color: '#1d4ed8', bg: 'linear-gradient(135deg,#dbeafe,#93c5fd,#60a5fa)' },
  { emoji: '📚', word: 'Book',      color: '#059669', bg: 'linear-gradient(135deg,#d1fae5,#6ee7b7,#34d399)' },
  { emoji: '🐟', word: 'Fish',      color: '#0891b2', bg: 'linear-gradient(135deg,#cffafe,#67e8f9,#22d3ee)' },
  { emoji: '🦋', word: 'Butterfly', color: '#be185d', bg: 'linear-gradient(135deg,#fce7f3,#f0abfc,#e879f9)' },
  { emoji: '🎈', word: 'Balloon',   color: '#dc2626', bg: 'linear-gradient(135deg,#fee2e2,#fca5a5,#f87171)' },
  { emoji: '🌳', word: 'Tree',      color: '#15803d', bg: 'linear-gradient(135deg,#dcfce7,#86efac,#4ade80)' },
  { emoji: '🐕', word: 'Dog',       color: '#b45309', bg: 'linear-gradient(135deg,#fef3c7,#fcd34d,#b45309)' },
];

// Groups of 3 for practice mode spot-the-object rounds
const GROUPS: Obj[][] = [];
for (let i = 0; i < ALL_OBJECTS.length; i += 3)
  GROUPS.push(ALL_OBJECTS.slice(i, Math.min(i + 3, ALL_OBJECTS.length)));

const DailyObjectsModule: React.FC = () => {
  const navigate = useNavigate();
  const { activeProfile, availableProfiles } = useProfile() as any;

  const kidName = useMemo(() => {
    if (activeProfile?.name) return activeProfile.name;
    try { return JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.name ?? 'Friend'; }
    catch { return 'Friend'; }
  }, [activeProfile]);

  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try {
      const id  = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const hit = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return hit?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const [mode,      setMode]      = useState<Mode>('play');
  const [isMuted,   setIsMuted]   = useState(false);
  const [kidIdx,    setKidIdx]    = useState(0);
  const [groupIdx,  setGroupIdx]  = useState(0);
  const [targetPos, setTargetPos] = useState(0);
  const [tapped,    setTapped]    = useState<number|null>(null);
  const [wrongPos,  setWrongPos]  = useState<number|null>(null);

  const { speak } = useSpeech(isMuted);

  const kidObj    = ALL_OBJECTS[Math.min(kidIdx, ALL_OBJECTS.length - 1)];
  const group     = GROUPS[Math.min(groupIdx, GROUPS.length - 1)];
  const target    = group[targetPos] ?? group[0];
  const accentColor = mode === 'play' ? kidObj.color : target.color;
  const bgGrad      = mode === 'play' ? kidObj.bg    : target.bg;

  useEffect(() => {
    setTargetPos(Math.floor(Math.random() * group.length));
    setTapped(null);
    setWrongPos(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIdx, mode]);

  const bubbleText = useMemo(() => {
    if (mode === 'play') return 'Look! This is a ' + kidObj.word + '! ✨';
    if (tapped !== null) return 'Great job! That is the ' + target.word + '! 🎉';
    return 'Can you spot the ' + target.word + '? 👀';
  }, [mode, kidObj.word, target.word, tapped]);

  useEffect(() => {
    if (mode !== 'play') return;
    const t = setTimeout(() => speak('Look! This is a ' + kidObj.word + '! ' + kidObj.word + '!'), 300);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidIdx, mode]);

  useEffect(() => {
    if (mode !== 'practice') return;
    const t = setTimeout(() => speak('Can you spot the ' + target.word + '?'), 450);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIdx, mode]);

  const advanceKid = useCallback(() => {
    if (kidIdx < ALL_OBJECTS.length - 1) {
      setKidIdx(i => i + 1);
    } else {
      speak('Amazing! You know so many things, ' + kidName + '!');
      setTimeout(() => navigate('/games/alphabets'), 2200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidIdx, kidName]);

  useEffect(() => {
    if (mode !== 'play') return;
    const t = setTimeout(advanceKid, 2800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidIdx, mode]);

  const handleTap = (pos: number) => {
    if (tapped !== null) return;
    if (pos === targetPos) {
      setTapped(pos);
      speak('Yes! ' + target.word + '! Amazing, ' + kidName + '!');
      setTimeout(() => {
        const next = groupIdx + 1;
        if (next < GROUPS.length) {
          setGroupIdx(next);
        } else {
          speak('Wow! You found them all, ' + kidName + '!');
          setTimeout(() => navigate('/games/alphabets'), 2200);
        }
      }, 1400);
    } else {
      setWrongPos(pos);
      speak('Look again! Find the ' + target.word + '!');
      setTimeout(() => setWrongPos(null), 700);
    }
  };

  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: bgGrad }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[20, 50, 75].map((left, i) => (
          <div key={i} className="absolute top-0 w-[2px] opacity-10"
            style={{
              left: `${left}%`, height: '55%',
              background: 'linear-gradient(to bottom, white, transparent)',
              transform: `rotate(${(i - 1) * 7}deg)`,
              transformOrigin: 'top',
            }}
          />
        ))}
      </div>

      <div
        className="flex-none flex flex-col items-center px-5"
        style={{ paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 8, zIndex: 10 }}
      >
        <div className="w-full flex items-center justify-between gap-2 mb-2">
          <button
            onClick={() => setMode(m => m === 'play' ? 'practice' : 'play')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{
              background: mode === 'practice' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
              color: '#1a1a00', backdropFilter: 'blur(6px)',
            }}
          >
            <span>{mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(m => !m)}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {isMuted ? <VolumeX size={20} color={accentColor} /> : <Volume2 size={20} color={accentColor} />}
            </button>
            <button onClick={() => navigate('/games/alphabets')}
              className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <X size={22} color={accentColor} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <h1 className="font-black text-center leading-tight"
          style={{ fontSize: 24, color: accentColor, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Objects Around Us
        </h1>

        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-[4px] bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
            {Array.from({ length: 10 }).map((_, i) => {
              const prog = mode === 'play' ? kidIdx : groupIdx * 3;
              const step = Math.min(Math.floor(prog / ALL_OBJECTS.length * 10), 9);
              const done = i < step, current = i === step;
              return (
                <motion.div key={i} animate={{ scale: current ? 1.25 : 1 }} className="rounded-full"
                  style={{
                    width: current ? 14 : 10, height: current ? 14 : 10,
                    background: done ? accentColor : current ? '#fbbf24' : 'rgba(255,255,255,0.5)',
                    border: '1.5px solid rgba(255,255,255,0.6)',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <AnimatePresence mode="wait">

          {mode === 'play' && (
            <motion.div
              key={'kid-' + kidIdx}
              className="flex flex-col items-center gap-3 w-full"
              initial={{ opacity: 0, scale: 0.75, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: -30 }}
              transition={{ duration: 0.32, type: 'spring', stiffness: 280, damping: 22 }}
            >
              <div
                className="flex flex-col items-center justify-center rounded-3xl shadow-2xl"
                style={{ width: '78%', maxWidth: 300, aspectRatio: '1', background: kidObj.bg, border: `5px solid ${kidObj.color}` }}
              >
                <motion.span
                  animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ fontSize: 100, lineHeight: 1 }}
                >
                  {kidObj.emoji}
                </motion.span>
                <motion.p
                  className="font-black mt-3 text-center"
                  style={{ fontSize: 32, color: kidObj.color, letterSpacing: 1 }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  {kidObj.word}
                </motion.p>
              </div>
            </motion.div>
          )}

          {mode === 'practice' && (
            <motion.div
              key={'practice-' + groupIdx}
              className="flex flex-col items-center gap-5 w-full"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="px-5 py-3 rounded-2xl shadow-md text-center"
                style={{ background: 'rgba(255,255,255,0.88)', border: `3px solid ${target.color}` }}
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <p className="font-black text-lg" style={{ color: '#333' }}>Can you spot the</p>
                <p className="font-black text-3xl" style={{ color: target.color, letterSpacing: 2 }}>
                  {target.word}?
                </p>
              </motion.div>

              <div className="flex gap-3 w-full justify-center">
                {group.map((obj, pos) => {
                  const isCorrect = tapped === pos;
                  const isWrong   = wrongPos === pos;
                  return (
                    <motion.button
                      key={pos}
                      onClick={() => handleTap(pos)}
                      whileTap={{ scale: 0.88 }}
                      animate={isWrong ? { x: [-8, 8, -6, 6, 0] } : {}}
                      transition={isWrong ? { duration: 0.4 } : {}}
                      className="flex flex-col items-center justify-center rounded-2xl shadow-xl flex-1"
                      style={{
                        maxWidth: 110,
                        aspectRatio: '0.85',
                        background: isCorrect
                          ? 'linear-gradient(135deg,#b9f474,#7ec84a)'
                          : isWrong
                          ? 'linear-gradient(135deg,#fecaca,#ef4444)'
                          : obj.bg,
                        border: `4px solid ${isCorrect ? '#7ec84a' : isWrong ? '#ef4444' : obj.color}`,
                      }}
                    >
                      <span style={{ fontSize: 54, lineHeight: 1 }}>{obj.emoji}</span>
                      <p className="font-black text-xs mt-1 text-center px-1"
                         style={{ color: isCorrect ? '#1a6600' : isWrong ? '#7f1d1d' : obj.color }}>
                        {obj.word}
                      </p>
                      {isCorrect && (
                        <motion.span
                          initial={{ scale: 0 }} animate={{ scale: 1.3 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                          style={{ fontSize: 28, marginTop: 4 }}
                        >✅</motion.span>
                      )}
                      {isWrong && (
                        <span style={{ fontSize: 28, marginTop: 4 }}>❌</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)', zIndex: 10 }}
      >
        <div className="w-[80px] h-[80px] shrink-0 flex items-center justify-center">
          <KidAvatar avatar={kidAvatar} size={78} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={'bubble-' + mode + '-' + kidIdx + '-' + groupIdx + '-' + String(tapped)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3"
          >
            <button
              onClick={() => setIsMuted(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: accentColor }}
            >
              <Volume2 size={16} color="white" />
            </button>
            <p className="font-black text-base text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DailyObjectsModule;
