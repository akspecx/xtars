/**
 * LetterIntroModule.tsx — “Introduction to Alphabets”
 * Three immersive steps per letter:
 *   Step 0: Meet the Letter  — big animated character + lowercase sibling
 *   Step 1: The Sound        — phoneme waves, repeat 3x
 *   Step 2: A for …         — letter transforms into its iconic object
 * Kid mode    → fully auto-advancing
 * Practice    → also auto-advancing (no tapping needed);
 *             After step 2 the avatar asks the letter quiz
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA, LETTER_MAP } from '../alphabetData';

type Mode   = 'play' | 'practice';
type Stage  = 0 | 1 | 2 | 3; // 3 = practice quiz
type AvatarAnim = 'idle' | 'clap' | 'wrong';

// Sound-wave ring component
const SoundWave: React.FC<{ color: string; delay: number }> = ({ color, delay }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ border: `3px solid ${color}`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
    initial={{ width: 60, height: 60, opacity: 0.8 }}
    animate={{ width: 220, height: 220, opacity: 0 }}
    transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 0.4, ease: 'easeOut' }}
  />
);

export default function LetterIntroModule() {
  const navigate = useNavigate();
  const { letter = 'A' } = useParams<{ letter: string }>();
  const { activeProfile, availableProfiles } = useProfile() as any;

  const data = useMemo(
    () => LETTER_MAP.get(letter.toUpperCase()) ?? ALPHABET_DATA[0],
    [letter]
  );

  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try {
      const id = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const hit = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return hit?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const [mode,     setMode]     = useState<Mode>('play');
  const [isMuted,  setIsMuted]  = useState(false);
  const [stage,    setStage]    = useState<Stage>(0);
  const [showLc,   setShowLc]   = useState(false);  // show lowercase sibling in step 0
  const [letterGuessed, setLetterGuessed] = useState<string | null>(null);
  const [avatarAnim, setAvatarAnim] = useState<AvatarAnim>('idle');

  const { speak } = useSpeech(isMuted);

  const letterIdx  = ALPHABET_DATA.findIndex(d => d.letter === data.letter);
  const nextLetter = ALPHABET_DATA[letterIdx + 1]?.letter ?? null;
  const hero       = data.examples[0]; // most iconic object (e.g. Apple for A)

  // 3 object choices for practice quiz: correct hero + 2 stable picks from other letters
  const objectChoices = useMemo(() => {
    const correct = data.examples[0];
    const pool = ALPHABET_DATA.filter(d => d.letter !== data.letter);
    const wrong1 = pool[(letterIdx * 3) % pool.length].examples[0];
    const wrong2 = pool[(letterIdx * 7 + 5) % pool.length].examples[0];
    const items = [correct, wrong1, wrong2];
    // stable positional shuffle keyed to letterIdx so order is consistent
    if (letterIdx % 3 === 0) return [items[1], items[0], items[2]];
    if (letterIdx % 3 === 1) return [items[2], items[1], items[0]];
    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.letter, letterIdx]);

  // Reset on letter change
  useEffect(() => {
    setStage(0);
    setShowLc(false);
    setLetterGuessed(null);
    setAvatarAnim('idle');
  }, [letter]);

  // Lowercase sibling pops up 1.8s into step 0
  useEffect(() => {
    if (stage !== 0) return;
    const t = setTimeout(() => setShowLc(true), 1800);
    return () => clearTimeout(t);
  }, [stage, letter]);

  // Auto-advance timers (both modes for stages 0-2)
  useEffect(() => {
    if (stage >= 3) return;
    const delays: Record<number, number> = { 0: 6000, 1: 5500, 2: 6000 };
    const t = setTimeout(() => setStage(s => (s + 1) as Stage), delays[stage]);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, letter]);

  // Kid mode: after stage 2, auto-navigate to next letter
  useEffect(() => {
    if (mode !== 'play' || stage !== 3 || !nextLetter) return;
    const t = setTimeout(() => navigate(`/games/alphabets/letter-intro/${nextLetter}`), 3500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, mode, nextLetter]);

  // Speech per stage
  useEffect(() => {
    const msgs: Record<number, string> = {
      0: `Let's meet ${data.uppercase}! Big ${data.uppercase} and little ${data.lowercase} are best friends!`,
      1: `${data.phoneme}... ${data.phoneme}... ${data.phoneme}! That's the ${data.letter} sound!`,
      2: `${data.phoneme}... ${hero.word}! ${data.uppercase} is for ${hero.word}!`,
      3: `${data.uppercase} is for...? Tap the right picture!`,
    };
    const t = setTimeout(() => speak(msgs[stage] ?? ''), 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, letter]);

  // Avatar anim reset
  useEffect(() => {
    if (avatarAnim === 'idle') return;
    const t = setTimeout(() => setAvatarAnim('idle'), 1200);
    return () => clearTimeout(t);
  }, [avatarAnim]);

  // Bubble text
  const bubbleText = useMemo(() => {
    if (stage === 0) return `Let's meet ${data.uppercase}! And here comes little ${data.lowercase}! 👋`;
    if (stage === 1) return `${data.phoneme}… ${data.phoneme}… ${data.phoneme}! That's the ${data.letter} sound! 🎵`;
    if (stage === 2) return `${data.phoneme}… ${hero.word}! ${data.uppercase} is for ${hero.word}! 🎉`;
    // stage 3 quiz
    if (letterGuessed === data.examples[0].word) return `Yes!! ${data.uppercase} is for ${data.examples[0].word}! Amazing! 🎉`;
    if (letterGuessed) return `Oops! ${data.uppercase} is for ${data.examples[0].word}! Try again! 🙈`;
    return `${data.uppercase} is for…? Tap the right one! 🤔`;
  }, [stage, letterGuessed, data, hero]);

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden" style={{ background: data.bg }}>
      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[18, 50, 76].map((left, i) => (
          <div key={i} className="absolute top-0 w-[2px] opacity-10"
            style={{ left: `${left}%`, height: '55%', background: 'linear-gradient(to bottom,white,transparent)',
               transform: `rotate(${(i-1)*7}deg)`, transformOrigin: 'top' }} />
        ))}
      </div>

      {/* Top bar */}
      <div className="flex-none flex flex-col items-center px-5"
        style={{ paddingTop: 'env(safe-area-inset-top,16px)', paddingBottom: 8, zIndex: 10 }}>
        <div className="w-full flex items-center justify-between gap-2 mb-2">
          <button
            onClick={() => { setMode(m => m === 'play' ? 'practice' : 'play'); setStage(0); setLetterGuessed(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: mode === 'practice' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
              color: '#1a0000', backdropFilter: 'blur(6px)' }}>
            <span>{mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMuted(m => !m)}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {isMuted ? <VolumeX size={20} color={data.color} /> : <Volume2 size={20} color={data.color} />}
            </button>
            <button onClick={() => navigate('/games/alphabets')}
              className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md">
              <X size={22} color={data.color} strokeWidth={2.5} />
            </button>
          </div>
        </div>
        <h1 className="font-black text-center leading-tight"
          style={{ fontSize: 22, color: data.color, letterSpacing: 1.5, textTransform: 'uppercase' }}>
          Meet Letter {data.uppercase}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Meet the Letter ── */}
          {stage === 0 && (
            <motion.div key="step0" className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.4, type: 'spring' }}>
              <div className="flex items-end justify-center gap-3">
                {/* Big uppercase with face */}
                <motion.div
                  className="relative flex items-center justify-center"
                  animate={{ y: [0, -18, 0], rotate: [-3, 3, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: 160, height: 160 }}
                  onClick={() => speak(`${data.phoneme}! ${data.phoneme}! ${data.uppercase}!`)}
                >
                  {/* Letter */}
                  <span className="font-black select-none" style={{ fontSize: 140, color: data.color, lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.18))' }}>
                    {data.uppercase}
                  </span>
                  {/* Eyes */}
                  <div className="absolute flex gap-4" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
                    <motion.div animate={{ scaleY: [1, 0.15, 1] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2 }}
                      className="rounded-full bg-white" style={{ width: 16, height: 16, border: `3px solid ${data.color}` }} />
                    <motion.div animate={{ scaleY: [1, 0.15, 1] }} transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 2, delay: 0.1 }}
                      className="rounded-full bg-white" style={{ width: 16, height: 16, border: `3px solid ${data.color}` }} />
                  </div>
                  {/* Smile */}
                  <div className="absolute" style={{ bottom: '28%', left: '50%', transform: 'translateX(-50%)', fontSize: 28 }}>🙂</div>
                </motion.div>

                {/* Lowercase sibling — pops up after delay */}
                <AnimatePresence>
                  {showLc && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 340, damping: 18 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="font-black" style={{ fontSize: 72, color: data.color, lineHeight: 1, opacity: 0.85 }}>
                        {data.lowercase}
                      </span>
                      <motion.span
                        className="font-black text-xs px-2 py-0.5 rounded-full text-white"
                        style={{ background: data.color, fontSize: 11 }}
                        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
                      >
                        little {data.lowercase}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="font-black text-center text-sm opacity-70" style={{ color: data.color }}>
                Tap the letter to hear it!
              </p>
            </motion.div>
          )}

          {/* ── Step 1: The Sound ── */}
          {stage === 1 && (
            <motion.div key="step1" className="flex flex-col items-center gap-4 relative"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
              {/* Letter stays visible above sound waves */}
              <motion.span className="font-black" style={{ fontSize: 80, color: data.color, lineHeight: 1 }}
                animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                {data.uppercase}
              </motion.span>
              {/* Sound waves */}
              <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
                <SoundWave color={data.color} delay={0} />
                <SoundWave color={data.color} delay={0.55} />
                <SoundWave color={data.color} delay={1.1} />
                {/* Big phoneme */}
                <motion.div
                  className="relative z-10 flex flex-col items-center justify-center rounded-full bg-white shadow-2xl"
                  style={{ width: 110, height: 110, border: `5px solid ${data.color}` }}
                  animate={{ scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="font-black" style={{ fontSize: 32, color: data.color }}>{data.phoneme}</span>
                  <span className="font-black text-xs opacity-60" style={{ color: data.color }}>the sound</span>
                </motion.div>
              </div>
              {/* Three bounce chips */}
              <div className="flex gap-3">
                {[0, 1, 2].map(i => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.6 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.55, type: 'spring', stiffness: 260, damping: 18 }}
                    className="rounded-2xl px-4 py-2 font-black text-white shadow-lg"
                    style={{ background: data.color, fontSize: 22 }}
                  >
                    {data.phoneme}!
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Step 2: A for Object ── */}
          {stage === 2 && (
            <motion.div key="step2" className="flex flex-col items-center gap-5"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.3 }}>
              <div className="flex items-center justify-center gap-4">
                {/* Letter */}
                <motion.span className="font-black" style={{ fontSize: 100, color: data.color, lineHeight: 1 }}
                  animate={{ x: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                  {data.uppercase}
                </motion.span>
                {/* Arrow */}
                <motion.div animate={{ x: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
                  className="font-black text-4xl" style={{ color: data.color, opacity: 0.7 }}>for</motion.div>
                {/* Object */}
                <motion.div className="flex flex-col items-center"
                  initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 16 }}>
                  <span style={{ fontSize: 90, lineHeight: 1 }}>{hero.emoji}</span>
                  <motion.span className="font-black mt-1" style={{ fontSize: 26, color: data.color }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
                    {hero.word}
                  </motion.span>
                </motion.div>
              </div>
              {/* Confirmation chip */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                className="px-6 py-3 rounded-2xl font-black text-white shadow-xl text-lg"
                style={{ background: data.color, boxShadow: `0 5px 0 ${data.color}88` }}>
                {data.uppercase} is for {hero.word}!
              </motion.div>
            </motion.div>
          )}

          {/* ── Stage 3: Practice quiz — F is for...? ── */}
          {stage === 3 && (
            <motion.div key="step3" className="flex flex-col items-center gap-5 w-full"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}>
              {/* Challenge header */}
              <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="px-6 py-3 rounded-2xl font-black text-center shadow-lg"
                style={{ background: 'rgba(255,255,255,0.88)', color: data.color, fontSize: 28 }}>
                {data.uppercase} is for…?
              </motion.div>
              {mode === 'practice' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex gap-4 justify-center flex-wrap">
                  {objectChoices.map((obj, idx) => {
                    const isCorrect   = obj.word === data.examples[0].word;
                    const guessedThis = letterGuessed === obj.word;
                    const isWrong     = guessedThis && !isCorrect;
                    const showGreen   = (guessedThis && isCorrect) || (!!(letterGuessed && letterGuessed !== data.examples[0].word) && isCorrect);
                    return (
                      <motion.button key={idx} disabled={!!letterGuessed}
                        animate={isWrong ? { x: [-10,10,-8,8,-4,4,0] } : {}}
                        transition={isWrong ? { duration: 0.45 } : {}}
                        whileTap={!letterGuessed ? { scale: 0.88 } : {}}
                        onClick={() => {
                          if (letterGuessed) return;
                          setLetterGuessed(obj.word);
                          if (isCorrect) {
                            setAvatarAnim('clap');
                            speak(`Yes! ${data.uppercase} is for ${obj.word}! Amazing!`);
                            if (nextLetter) setTimeout(() => navigate(`/games/alphabets/letter-intro/${nextLetter}`), 2800);
                          } else {
                            setAvatarAnim('wrong');
                            speak(`Oops! ${data.uppercase} is for ${data.examples[0].word}! Try again!`);
                            setTimeout(() => setLetterGuessed(null), 1800);
                          }
                        }}
                        className="flex flex-col items-center gap-2 rounded-2xl px-4 py-4 shadow-xl"
                        style={{ background: showGreen ? '#b9f474' : isWrong ? '#ffd6e0' : 'rgba(255,255,255,0.92)',
                          border: `3px solid ${showGreen ? '#7ec84a' : isWrong ? '#fda4af' : data.color}`,
                          minWidth: 90 }}
                      >
                        <span style={{ fontSize: 52 }}>{obj.emoji}</span>
                        <span className="font-black text-sm" style={{ color: showGreen ? '#1a6600' : isWrong ? '#be185d' : data.color }}>
                          {obj.word}
                        </span>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
              {mode === 'play' && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <motion.span className="font-black" style={{ fontSize: 80, color: data.color, lineHeight: 1 }}
                      animate={{ scale: [1,1.1,1], rotate: [-3,3,-3,0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                      {data.uppercase}
                    </motion.span>
                    <span style={{ fontSize: 64 }}>{hero.emoji}</span>
                  </div>
                  <div className="flex gap-3 flex-wrap justify-center">
                    {nextLetter && (
                      <button onClick={() => navigate(`/games/alphabets/letter-intro/${nextLetter}`)}
                        className="px-6 py-3 rounded-2xl font-black text-base text-white shadow-xl"
                        style={{ background: data.color, boxShadow: `0 5px 0 ${data.color}88` }}>
                        Next: {nextLetter} ▶
                      </button>
                    )}
                    <button onClick={() => navigate('/games/alphabets')}
                      className="px-6 py-3 rounded-2xl font-black text-base shadow-xl"
                      style={{ background: 'rgba(255,255,255,0.85)', color: data.color, border: `2px solid ${data.color}` }}>
                      ← All Letters
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + bubble */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom,16px)', zIndex: 10 }}>
        <motion.div className="w-[80px] h-[80px] shrink-0 flex items-center justify-center"
          animate={avatarAnim === 'clap' ? { y: [0,-22,0,-12,0], scale: [1,1.18,1,1.08,1], rotate: [0,8,-8,4,0] }
            : avatarAnim === 'wrong' ? { x: [0,-10,10,-8,8,-4,4,0], rotate: [0,-6,6,-4,4,0] }
            : { y: 0, x: 0, rotate: 0, scale: 1 }}
          transition={{ duration: avatarAnim === 'clap' ? 0.7 : 0.5 }}>
          <KidAvatar avatar={kidAvatar} size={78} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`bubble-${stage}-${letterGuessed}`}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3">
            <button onClick={() => setIsMuted(m => !m)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: data.color }}>
              <Volume2 size={16} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
