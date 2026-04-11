/**
 * AlphabetTrainModule.tsx — "The Alphabet Train" (v2)
 * Rich train UI: engine + colorful wagons with wheels.
 * Kid mode: auto-loads letters. Practice: tap each letter in order.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

const WAGON_COLORS = ['#e11d48', '#2563eb', '#059669'];
const CHUNK_SIZE = 3;
function getChunk(roundIdx: number) {
  const start = (roundIdx * CHUNK_SIZE) % 24;
  return ALPHABET_DATA.slice(start, start + CHUNK_SIZE);
}

/* ══ Sub-components ══════════════════════════════════════════════════════════ */

/** Animated smoke puff over chimney */
const SmokePuff: React.FC<{ active: boolean }> = ({ active }) => (
  <div className="absolute" style={{ left: 22, top: -22, pointerEvents: 'none', width: 28, height: 28 }}>
    {[0, 1, 2].map(i => (
      <motion.div key={i} className="absolute rounded-full"
        style={{ width: 8 + i * 4, height: 8 + i * 4, background: 'rgba(210,210,220,0.8)', left: i * 3 - 4, top: 0 }}
        animate={active ? { y: [-2, -28 - i * 10], opacity: [0.8, 0], scale: [0.6, 1.8] } : { opacity: 0 }}
        transition={active ? { duration: 1.2, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' } : {}} />
    ))}
  </div>
);

/** Single wheel */
const Wheel: React.FC<{ size: number; spin?: boolean }> = ({ size, spin }) => (
  <motion.div className="rounded-full relative flex items-center justify-center flex-shrink-0"
    style={{ width: size, height: size, background: '#374151', border: '2px solid #6b7280', position: 'relative' }}
    animate={spin ? { rotate: 360 } : {}}
    transition={spin ? { duration: 0.45, repeat: Infinity, ease: 'linear' } : {}}>
    <div className="absolute rounded-full" style={{ width: size * 0.38, height: size * 0.38, background: '#9ca3af' }} />
    <div className="absolute" style={{ width: 1.5, height: size * 0.78, background: '#6b7280', borderRadius: 1 }} />
    <div className="absolute" style={{ height: 1.5, width: size * 0.78, background: '#6b7280', borderRadius: 1 }} />
  </motion.div>
);

/** The locomotive engine */
const Engine: React.FC<{ spin?: boolean }> = ({ spin }) => (
  <div className="relative flex flex-col items-start flex-shrink-0" style={{ marginRight: 3, width: 88 }}>
    <SmokePuff active={!!spin} />
    {/* Chimney */}
    <div style={{ width: 14, height: 14, background: '#1e3a5f', marginLeft: 16, marginBottom: -3, borderRadius: '4px 4px 0 0' }} />
    {/* Body */}
    <div className="relative flex items-center rounded-xl overflow-hidden"
      style={{ width: 88, height: 50, background: 'linear-gradient(170deg,#1e40af,#1e3a5f)', border: '2.5px solid #1d4ed8', boxShadow: '0 5px 0 #1e3a5f' }}>
      {/* Cab window */}
      <div className="absolute rounded-lg" style={{ right: 8, top: 7, width: 26, height: 22, background: '#bfdbfe', border: '2px solid #60a5fa' }} />
      {/* Headlight */}
      <div className="absolute rounded-full" style={{ right: -4, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, background: '#fde047', boxShadow: '0 0 10px 3px #fde04799' }} />
      {/* Boiler stripes */}
      <div className="absolute" style={{ left: 8, top: 14, width: 48, height: 3, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
      <div className="absolute" style={{ left: 8, top: 22, width: 40, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />
    </div>
    {/* Wheels row */}
    <div className="flex gap-2.5 mt-1 pl-2">
      {[0, 1, 2].map(i => <Wheel key={i} size={19} spin={spin} />)}
    </div>
  </div>
);

/** A single train wagon */
const WagonCar: React.FC<{
  color: string; letter?: string; emoji?: string; word?: string; empty?: boolean; spin?: boolean;
}> = ({ color, letter, emoji, word, empty, spin }) => (
  <div className="relative flex flex-col items-center flex-shrink-0" style={{ marginRight: 3, width: 72 }}>
    {/* Wagon body */}
    <div className="rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        width: 72, height: 52,
        background: empty ? '#e5e7eb' : `linear-gradient(155deg,${color}dd,${color})`,
        border: `2.5px solid ${empty ? '#d1d5db' : color}`,
        boxShadow: empty ? undefined : `0 5px 0 ${color}99`,
      }}>
      {/* Window frame */}
      {!empty && <div className="absolute inset-2 rounded-lg" style={{ border: '1.5px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.1)' }} />}
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {emoji ? (
          <>
            <span style={{ fontSize: 20, lineHeight: 1 }}>{emoji}</span>
            {word && <span className="font-black text-white" style={{ fontSize: 7, marginTop: 1 }}>{word}</span>}
          </>
        ) : letter ? (
          <span className="font-black text-white" style={{ fontSize: 28, textShadow: '0 2px 6px rgba(0,0,0,0.35)' }}>{letter}</span>
        ) : (
          <span style={{ fontSize: 20, opacity: 0.3 }}>📦</span>
        )}
      </div>
    </div>
    {/* Wheels */}
    <div className="flex gap-7 mt-1">
      <Wheel size={16} spin={spin} />
      <Wheel size={16} spin={spin} />
    </div>
  </div>
);

/** Rail track (with animated ties when train is moving) */
const RailTrack: React.FC<{ moving?: boolean }> = ({ moving }) => (
  <div className="relative w-full" style={{ height: 16 }}>
    <div className="absolute w-full rounded-full" style={{ top: 1, height: 4, background: '#92400e' }} />
    <div className="absolute w-full rounded-full" style={{ top: 11, height: 4, background: '#92400e' }} />
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 18 }, (_, i) => (
        <motion.div key={i}
          className="absolute rounded"
          style={{ width: 11, height: 16, top: 0, background: '#78350f', left: i * 24 }}
          animate={moving ? { x: [0, -24 * 18] } : {}}
          transition={moving ? { duration: 1.4, repeat: Infinity, ease: 'linear' } : {}} />
      ))}
    </div>
  </div>
);

/** Confetti burst on completion */
const CONF_COLORS = ['#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#22c55e', '#f97316'];
const Confetti: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {Array.from({ length: 26 }, (_, i) => (
      <motion.div key={i} className="absolute rounded-sm"
        style={{ width: (i % 3) + 5, height: (i % 4) + 8, background: CONF_COLORS[i % 6], left: `${(i * 7 + 3) % 95}%`, top: '-5%' }}
        initial={{ y: 0, rotate: 0, opacity: 1 }}
        animate={{ y: [`0vh`, `${65 + (i % 3) * 15}vh`], rotate: [0, (i % 2 === 0 ? 1 : -1) * (180 + i * 12)], opacity: [1, 1, 0] }}
        transition={{ duration: 2 + (i % 4) * 0.3, delay: i * 0.07, ease: 'easeIn' }} />
    ))}
  </div>
);

/** Platform letter card */
const PCard: React.FC<{
  d: typeof ALPHABET_DATA[0]; loaded: boolean; isNext: boolean;
  onTap: () => void; wrongTap: boolean; disabled: boolean;
}> = ({ d, loaded, isNext, onTap, wrongTap, disabled }) => (
  <motion.button
    disabled={loaded || disabled}
    onClick={onTap}
    animate={wrongTap ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
    whileTap={!loaded && !disabled ? { scale: 0.86 } : {}}
    transition={{ duration: 0.4 }}
    className="relative flex flex-col items-center rounded-2xl overflow-hidden"
    style={{
      width: 70, padding: '10px 6px 8px',
      background: loaded ? '#e5e7eb' : isNext ? d.color : '#fff',
      border: `3px solid ${loaded ? '#d1d5db' : isNext ? d.color : '#e2e8f0'}`,
      boxShadow: loaded ? 'none' : isNext ? `0 6px 0 ${d.color}88, 0 0 18px ${d.color}44` : '0 4px 0 #cbd5e1',
      opacity: loaded ? 0.28 : 1, transition: 'all 0.3s',
    }}>
    <span style={{ fontSize: 32, lineHeight: 1 }}>{d.examples[0].emoji}</span>
    <span className="font-black mt-0.5" style={{ fontSize: 20, color: loaded ? '#9ca3af' : isNext ? 'white' : d.color }}>{d.letter}</span>
    {isNext && !loaded && (
      <motion.div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-yellow-300"
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 0.9, repeat: Infinity }} />
    )}
  </motion.button>
);

/* ══ Main Component ══════════════════════════════════════════════════════════ */
export default function AlphabetTrainModule() {
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
  const [loaded, setLoaded] = useState([false, false, false]);
  const [showObjects, setShowObjects] = useState(false);
  const [trainGone, setTrainGone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextExpected, setNextExpected] = useState(0);
  const [wrongTap, setWrongTap] = useState<number | null>(null);
  const [avatarAnim, setAvatarAnim] = useState<'idle' | 'excited' | 'cheer'>('idle');
  const { speak } = useSpeech(isMuted);
  const chunk = useMemo(() => getChunk(roundIdx), [roundIdx]);

  const doReset = useCallback(() => {
    setLoaded([false, false, false]); setShowObjects(false); setTrainGone(false);
    setShowConfetti(false); setNextExpected(0); setWrongTap(null); setAvatarAnim('idle');
  }, []);

  useEffect(() => {
    doReset();
    setTimeout(() => speak(
      mode === 'play'
        ? `All aboard! Loading ${chunk.map(d => d.letter).join(', ')}! Watch!`
        : `Load the ${chunk.map(d => d.letter).join(', ')} train! Tap ${chunk[0].letter} first!`
    ), 450);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  const finishLoading = useCallback((full: boolean[]) => {
    if (!full.every(Boolean)) return;
    speak(`${chunk.map(d => d.letter).join(', ')} loaded! All aboard!`);
    setAvatarAnim('excited');
    setTimeout(() => {
      setShowObjects(true);
      speak(chunk.map(d => `${d.letter} for ${d.examples[0].word}`).join(', '));
    }, 1400);
    setTimeout(() => {
      setTrainGone(true); setShowConfetti(true); setAvatarAnim('cheer');
      speak('Choo choo! Amazing job!');
    }, 4200);
  }, [chunk, speak]);

  // Kid mode — auto load
  useEffect(() => {
    if (mode !== 'play') return;
    const ts: ReturnType<typeof setTimeout>[] = [];
    chunk.forEach((d, i) => {
      ts.push(setTimeout(() => {
        speak(`${d.letter}!`); setAvatarAnim('excited'); setTimeout(() => setAvatarAnim('idle'), 600);
        setLoaded(prev => {
          const n = [...prev]; n[i] = true;
          if (i === chunk.length - 1) setTimeout(() => finishLoading([true, true, true]), 350);
          return n;
        });
      }, 1200 + i * 1800));
    });
    return () => ts.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  const tapLetter = useCallback((idx: number) => {
    if (mode !== 'practice' || loaded[idx]) return;
    if (idx === nextExpected) {
      speak(`${chunk[idx].letter}!`); setAvatarAnim('excited'); setTimeout(() => setAvatarAnim('idle'), 600);
      const n = [...loaded]; n[idx] = true; setLoaded(n); setNextExpected(idx + 1);
      if (n.every(Boolean)) setTimeout(() => finishLoading(n), 350);
    } else {
      setWrongTap(idx); speak(`Load ${chunk[nextExpected].letter} first!`);
      setTimeout(() => setWrongTap(null), 700);
    }
  }, [mode, loaded, nextExpected, chunk, speak, finishLoading]);

  const bubbleText = trainGone
    ? `Choo choo! 🚂 ${chunk.map(d => d.letter).join(', ')} are on their way! 🎉`
    : showObjects
    ? `Look inside! ${chunk.map(d => `${d.letter} for ${d.examples[0].word}`).join(', ')}! 🌟`
    : mode === 'play'
    ? `Loading the ${chunk.map(d => d.letter).join(', ')} train! 🚂`
    : loaded.every(Boolean) ? 'All loaded! Here we go! 🚂'
    : `Tap ${chunk[nextExpected]?.letter ?? '?'} to load next! 📦`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)' }}>

      {/* Stars */}
      {[...Array(14)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: (i % 3) + 1.5, height: (i % 3) + 1.5, left: `${(i * 7 + 3) % 95}%`, top: `${(i * 11 + 5) % 48}%`, opacity: 0.18 }}
          animate={{ opacity: [0.05, 0.55, 0.05] }}
          transition={{ duration: 1.5 + (i % 3), repeat: Infinity, delay: i * 0.22 }} />
      ))}

      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop: 'env(safe-area-inset-top,16px)', paddingBottom: 10, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.12)', zIndex: 20 }}>
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => { setMode(m => (m === 'play' ? 'practice' : 'play')); doReset(); setRoundIdx(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: mode === 'practice' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)', color: mode === 'practice' ? '#4c1d95' : 'white', border: '1.5px solid rgba(255,255,255,0.25)' }}>
            {mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </motion.button>
          <div>
            <p className="font-black text-white text-base leading-tight">Alphabet Train</p>
            <p className="text-xs font-bold text-purple-300">{chunk.map(d => d.letter).join(' · ')}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            {isMuted ? <VolumeX size={18} color="white" /> : <Volume2 size={18} color="white" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <X size={22} color="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-3 gap-4 overflow-hidden">

        {/* ── Train scene card ───────────────────────────────────────── */}
        <div className="relative rounded-3xl mx-1 overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,255,255,0.14)', paddingTop: 20, paddingBottom: 0 }}>

          {/* Sky gradient fill */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ background: 'linear-gradient(180deg,rgba(99,102,241,0.15) 0%,transparent 100%)' }} />

          {/* Train */}
          <div className="relative overflow-hidden" style={{ height: 102 }}>
            <motion.div className="absolute bottom-1 flex items-end" style={{ left: 10 }}
              animate={trainGone ? { x: '115%', opacity: 0 } : {}}
              transition={trainGone ? { duration: 1.8, ease: 'easeIn' } : {}}>
              <Engine spin={trainGone} />
              {chunk.map((d, i) => (
                <WagonCar key={i} color={WAGON_COLORS[i]}
                  letter={loaded[i] && !showObjects ? d.letter : undefined}
                  emoji={loaded[i] && showObjects ? d.examples[0].emoji : undefined}
                  word={loaded[i] && showObjects ? d.examples[0].word : undefined}
                  empty={!loaded[i]} spin={trainGone} />
              ))}
            </motion.div>
          </div>

          {/* Track */}
          <RailTrack moving={trainGone} />
        </div>

        {/* ── Platform ──────────────────────────────────────────────── */}
        <div className="rounded-3xl mx-1 px-4 py-4"
          style={{ background: 'rgba(255,255,255,0.1)', border: '2px solid rgba(255,255,255,0.18)' }}>
          <p className="font-black text-center text-xs mb-3" style={{ color: 'rgba(216,180,254,0.9)' }}>
            {mode === 'practice' ? `📦 Tap ${chunk[nextExpected]?.letter ?? '✓'} to load` : '🚉 Platform'}
          </p>
          <div className="flex justify-center gap-3">
            {chunk.map((d, i) => (
              <PCard key={i} d={d} loaded={loaded[i]}
                isNext={i === nextExpected && !loaded[i] && mode === 'practice'}
                onTap={() => tapLetter(i)} wrongTap={wrongTap === i} disabled={mode === 'play'} />
            ))}
          </div>
        </div>

        {/* Next train buttons */}
        <AnimatePresence>
          {trainGone && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ delay: 0.6 }}
              className="flex gap-3 justify-center">
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => setRoundIdx(i => i + 1)}
                className="px-7 py-3.5 rounded-2xl font-black text-lg text-white shadow-2xl"
                style={{ background: '#7c3aed', boxShadow: '0 5px 0 #5b21b6' }}>
                Next Train ▶
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/games/alphabets')}
                className="px-6 py-3.5 rounded-2xl font-black text-purple-900"
                style={{ background: 'rgba(255,255,255,0.92)' }}>
                Menu
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + speech bubble */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom,16px)', zIndex: 10 }}>
        <motion.div className="shrink-0 flex items-center justify-center" style={{ width: 72, height: 72 }}
          animate={avatarAnim === 'cheer'
            ? { y: [0, -26, 0, -16, 0, -8, 0], scale: [1, 1.22, 0.95, 1.18, 0.98, 1.08, 1], rotate: [0, 12, -12, 8, -6, 3, 0] }
            : avatarAnim === 'excited'
            ? { y: [0, -14, 0, -8, 0], scale: [1, 1.12, 0.98, 1.08, 1] }
            : {}}
          transition={{ duration: avatarAnim === 'cheer' ? 1.0 : 0.55 }}>
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`b-${roundIdx}-${loaded.join('')}-${trainGone}`}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="flex-1 flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2"
            style={{ background: 'rgba(255,255,255,0.95)' }}>
            <button onClick={() => setIsMuted(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#7c3aed' }}>
              <Volume2 size={14} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
