/**
 * TrueFalseGame.tsx  — Same & Different True/False game
 * Shows two items side by side, ask "Are these the SAME?"
 * Kid taps TRUE or FALSE.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useProfile } from '../../../../../context/ProfileContext';
import KidAvatar from '../../../CommonUtility/KidAvatar';
import WinScreen from '../../../../kids-ui/WinScreen';
import { recordCompletion } from '../../../CommonUtility/useModuleProgress';

interface TFPair {
  left:    { emoji: string; name: string };
  right:   { emoji: string; name: string };
  isSame:  boolean;
}

const PAIRS: TFPair[] = [
  // SAME pairs (identical items)
  { left: { emoji: '🍎', name: 'Apple'  }, right: { emoji: '🍎', name: 'Apple'  }, isSame: true  },
  { left: { emoji: '🐱', name: 'Cat'    }, right: { emoji: '🐱', name: 'Cat'    }, isSame: true  },
  { left: { emoji: '🚗', name: 'Car'    }, right: { emoji: '🚗', name: 'Car'    }, isSame: true  },
  { left: { emoji: '⭐', name: 'Star'   }, right: { emoji: '⭐', name: 'Star'   }, isSame: true  },
  { left: { emoji: '🏀', name: 'Ball'   }, right: { emoji: '🏀', name: 'Ball'   }, isSame: true  },
  { left: { emoji: '🌻', name: 'Flower' }, right: { emoji: '🌻', name: 'Flower' }, isSame: true  },
  { left: { emoji: '🐘', name: 'Elephant'}, right: { emoji: '🐘', name: 'Elephant'}, isSame: true  },
  { left: { emoji: '🍕', name: 'Pizza'  }, right: { emoji: '🍕', name: 'Pizza'  }, isSame: true  },
  // DIFFERENT pairs
  { left: { emoji: '🍎', name: 'Apple'  }, right: { emoji: '🍌', name: 'Banana' }, isSame: false },
  { left: { emoji: '🐱', name: 'Cat'    }, right: { emoji: '🐶', name: 'Dog'    }, isSame: false },
  { left: { emoji: '🚗', name: 'Car'    }, right: { emoji: '✈️', name: 'Plane'  }, isSame: false },
  { left: { emoji: '⭐', name: 'Star'   }, right: { emoji: '🌙', name: 'Moon'   }, isSame: false },
  { left: { emoji: '🏀', name: 'Basketball'}, right: { emoji: '⚽', name: 'Soccer Ball'}, isSame: false },
  { left: { emoji: '🌻', name: 'Sunflower'}, right: { emoji: '🌹', name: 'Rose'  }, isSame: false },
  { left: { emoji: '🐘', name: 'Elephant'}, right: { emoji: '🦁', name: 'Lion'  }, isSame: false },
  { left: { emoji: '🍕', name: 'Pizza'  }, right: { emoji: '🍔', name: 'Burger' }, isSame: false },
];

type Phase = 'question' | 'correct' | 'wrong';

interface Props { onBack?: () => void; onNext?: () => void; }

export default function TrueFalseGame({ onBack, onNext }: Props) {
  const { activeProfile, availableProfiles } = useProfile() as any;
  const kidName = useMemo(() => {
    if (activeProfile?.name) return activeProfile.name;
    try { return JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.name ?? 'Friend'; }
    catch { return 'Friend'; }
  }, [activeProfile]);
  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try {
      const id = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const fl = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return fl?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const SESSION = useMemo(() => [...PAIRS].sort(() => Math.random() - 0.5).slice(0, 8), []);
  const [idx,    setIdx]    = useState(0);
  const [phase,  setPhase]  = useState<Phase>('question');
  const [score,  setScore]  = useState(0);
  const [muted,  setMuted]  = useState(false);
  const [chosen, setChosen] = useState<boolean | null>(null);

  const pair = SESSION[idx];
  const done = idx >= SESSION.length;

  const handleAnswer = useCallback((answer: boolean) => {
    if (phase !== 'question') return;
    const correct = answer === pair.isSame;
    setChosen(answer);
    setPhase(correct ? 'correct' : 'wrong');
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= SESSION.length) {
        recordCompletion('same', SESSION.length, score + (correct ? 1 : 0), SESSION.length);
        setIdx(SESSION.length);
      } else {
        setIdx(i => i + 1);
        setPhase('question');
        setChosen(null);
      }
    }, 1200);
  }, [phase, pair, idx, SESSION, score]);

  const replay = () => { setIdx(0); setPhase('question'); setScore(0); setChosen(null); };

  const bubbleText = phase === 'correct'
    ? (chosen ? `Yes! They ARE the same! 🎉` : `Right! They are DIFFERENT! ✨`)
    : phase === 'wrong'
    ? `Oops! Look carefully! 👀`
    : `Are these the SAME?`;

  const DOTS = SESSION.slice(0, 8);

  if (done) {
    return (
      <WinScreen
        avatar={kidAvatar} name={kidName} score={score}
        total={SESSION.length} accent="#AD1457"
        onDone={() => { if (onNext) { onNext(); return; } if (onBack) { onBack(); return; } replay(); }}
        onReplay={replay}
      />
    );
  }

  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#ffd6e0 0%,#ffafc3 30%,#e05480 60%,#ad1457 100%)' }}
    >
      {/* Top bar */}
      <div
        className="flex-none flex flex-col items-center px-5"
        style={{ paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 8 }}
      >
        <div className="w-full flex items-center justify-end gap-2 mb-2">
          <button onClick={() => setMuted(m => !m)}
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
            {muted ? <VolumeX size={20} color="#6b0032" /> : <Volume2 size={20} color="#6b0032" />}
          </button>
          {(onBack || onNext) && (
            <button onClick={() => { if (onBack) onBack(); }}
              className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <X size={22} color="#6b0032" strokeWidth={2.5} />
            </button>
          )}
        </div>
        <h1 className="font-black text-center" style={{ fontSize: 26, color: '#fff', letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Same or Different?
        </h1>
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-[6px] bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
            {DOTS.map((_, i) => {
              const done = i < idx; const cur = i === idx;
              const bg = done ? '#ad1457' : cur ? '#f9c' : 'rgba(255,255,255,0.5)';
              return (
                <motion.div key={i} animate={{ scale: cur ? 1.25 : 1 }} className="rounded-full"
                  style={{ width: cur ? 14 : 10, height: cur ? 14 : 10, background: bg, border: '1.5px solid rgba(255,255,255,0.6)' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8 min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 24 }}
            className="flex items-end justify-center gap-6 w-full"
          >
            {[pair.left, pair.right].map((item, i) => (
              <div
                key={i}
                className="flex-1 rounded-[28px] overflow-hidden shadow-xl border-4 flex items-center justify-center"
                style={{
                  aspectRatio: '1 / 1.1',
                  maxWidth: 160,
                  background: i === 0
                    ? 'linear-gradient(145deg,#ffe8f0,#ff8fab,#c9184a)'
                    : 'linear-gradient(145deg,#ffe8f0,#ff8fab,#c9184a)',
                  borderColor: phase === 'correct'
                    ? '#22C55E'
                    : phase === 'wrong'
                    ? '#F87171'
                    : 'rgba(255,255,255,0.9)',
                }}
              >
                <motion.span
                  className="text-[80px] leading-none select-none"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {item.emoji}
                </motion.span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* TRUE / FALSE buttons */}
        <AnimatePresence>
          {phase === 'question' && (
            <motion.div
              key="btns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex gap-4 w-full max-w-xs"
            >
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleAnswer(true)}
                className="flex-1 py-4 rounded-full font-black text-xl shadow-lg"
                style={{ background: '#22C55E', color: '#fff', boxShadow: '0 4px 0 #15803d' }}
              >
                TRUE ✓
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => handleAnswer(false)}
                className="flex-1 py-4 rounded-full font-black text-xl shadow-lg"
                style={{ background: '#EF4444', color: '#fff', boxShadow: '0 4px 0 #b91c1c' }}
              >
                FALSE ✗
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mascot + speech bubble */}
      <div className="flex-none flex items-end gap-3 px-4" style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}>
        <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden shadow-lg shrink-0 bg-pink-800 flex items-center justify-center">
          <KidAvatar avatar={kidAvatar} size={70} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`bubble-${idx}-${phase}`}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3"
          >
            <button onClick={() => setMuted(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#ad1457' }}>
              <Volume2 size={16} color="white" />
            </button>
            <p className="font-black text-base text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
