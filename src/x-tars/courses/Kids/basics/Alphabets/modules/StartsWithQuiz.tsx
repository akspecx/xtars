/**
 * StartsWithQuiz.tsx
 * ──────────────────────────────────────────────────────────────────────────────
 * "What starts with A?" quiz module — driven by URL param :letter.
 * 4 object cards shown; user (or auto pilot) taps all 3 correct ones.
 * 3 rounds total, then a reward screen.
 *
 * Kid mode   → system cycles through and auto-selects the correct ones.
 * Practice   → user must tap on their own.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidsGameShell, { K, KidsMode } from '../../../../../../x-tars/kids-ui/KidsGameShell';
import { useSpeech } from '../../../../../../x-tars/kids-ui/useSpeech';
import { ALPHABET_DATA, LETTER_MAP, AlphabetObject } from '../alphabetData';

const ROUNDS = 3;

// Shuffle helper
const shuffle = <T,>(arr: T[]): T[] =>
  [...arr].sort(() => Math.random() - 0.5);

const StartsWithQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { letter = 'A' } = useParams<{ letter: string }>();
  const { activeProfile } = useProfile();
  const kidAvatar = activeProfile?.avatar ?? 'bird';
  const kidName   = activeProfile?.name   ?? 'Explorer';

  const data = useMemo(() => LETTER_MAP.get(letter.toUpperCase()) ?? ALPHABET_DATA[0], [letter]);

  const [mode,        setMode]        = useState<KidsMode>('kid');
  const [isMuted,     setIsMuted]     = useState(false);
  const [round,       setRound]       = useState(0);
  const [score,       setScore]       = useState(0);
  const [tapped,      setTapped]      = useState<Set<number>>(new Set());
  const [wrong,       setWrong]       = useState<number | null>(null);
  const [done,        setDone]        = useState(false);
  const [celebrating, setCelebrating] = useState(false);

  const { speak } = useSpeech(isMuted);

  // Shuffle quiz options each round
  const options = useMemo(() => shuffle(data.quiz), [data, round]);

  const correctCount = options.filter(o => o.starts).length;
  const tappedCorrect = [...tapped].filter(i => options[i].starts).length;

  // Bubble text
  const bubbleText = useMemo(() => {
    if (done) return `Wow, ${kidName}! ${score}/${ROUNDS * correctCount} correct! 🌟`;
    if (celebrating) return 'That starts with ' + data.letter + '! 🎉';
    if (wrong !== null) return "Hmm, try again! Find " + data.phoneme + "!";
    return mode === 'kid'
      ? `Let me find things starting with ${data.phoneme}!`
      : `Tap everything that starts with ${data.phoneme}!`;
  }, [done, celebrating, wrong, mode, data, score, kidName]);

  // Speak on round change
  useEffect(() => {
    if (done) { speak(`Amazing! You got ${score} right!`); return; }
    const t = setTimeout(() => speak(
      mode === 'kid'
        ? `I will find things that start with ${data.phoneme}!`
        : `Tap everything that starts with ${data.letter}!`
    ), 300);
    return () => clearTimeout(t);
  }, [round, done]);

  // Advance round
  const advanceRound = useCallback(() => {
    if (round + 1 >= ROUNDS) {
      setDone(true);
    } else {
      setRound(r => r + 1);
      setTapped(new Set());
      setWrong(null);
      setCelebrating(false);
    }
  }, [round]);

  // Handle a tap
  const handleTap = useCallback((i: number) => {
    if (tapped.has(i) || done) return;
    const obj = options[i];
    if (obj.starts) {
      const next = new Set(tapped);
      next.add(i);
      setTapped(next);
      setWrong(null);
      setCelebrating(true);
      setScore(s => s + 1);
      speak(`${obj.word}! Yes! Starts with ${data.phoneme}!`);
      if (next.size >= correctCount) {
        setTimeout(advanceRound, 1000);
      } else {
        setTimeout(() => setCelebrating(false), 600);
      }
    } else {
      setWrong(i);
      speak(`${obj.word} doesn't start with ${data.phoneme}. Try again!`);
      setTimeout(() => setWrong(null), 800);
    }
  }, [tapped, options, data, correctCount, advanceRound]);

  // Kid mode: auto-select correct options one at a time
  useEffect(() => {
    if (mode !== 'kid' || done) return;
    const correctIndexes = options
      .map((o, i) => (o.starts ? i : -1))
      .filter(i => i !== -1)
      .filter(i => !tapped.has(i));

    if (correctIndexes.length === 0) return;
    const t = setTimeout(() => handleTap(correctIndexes[0]), 1400);
    return () => clearTimeout(t);
  }, [mode, tapped, options, done]);

  const currentLetterIdx = ALPHABET_DATA.findIndex(d => d.letter === data.letter);
  const isLastLetter     = currentLetterIdx === ALPHABET_DATA.length - 1;

  return (
    <KidsGameShell
      title={`Starts with ${data.letter}?`}
      accent={data.color}
      onBack={() => navigate(`/games/alphabets/letter-intro/${data.letter}`)}
      mode={mode}
      onModeToggle={() => setMode(m => m === 'kid' ? 'practice' : 'kid')}
      isMuted={isMuted}
      onMuteToggle={() => setIsMuted(m => !m)}
      kidAvatar={kidAvatar}
      kidName={kidName}
      bubbleText={bubbleText}
      celebrating={celebrating}
      dots={{ total: ROUNDS, current: Math.min(round, ROUNDS-1) }}
    >
      <div className="flex flex-col items-center gap-5 px-4 pt-5 pb-10">
        <AnimatePresence mode="wait">

          {/* ── Quiz screen ── */}
          {!done && (
            <motion.div
              key={`round-${round}`}
              className="flex flex-col items-center gap-5 w-full"
              initial={{ opacity:0, x:50 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-50 }}
              transition={{ duration:0.25 }}
            >
              {/* Big letter reminder */}
              <motion.div
                animate={{ scale:[1,1.07,1], rotate:[-3,3,-3,0] }}
                transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}
                className="flex items-center justify-center rounded-3xl shadow-xl font-black"
                style={{
                  width:100, height:100, fontSize:72,
                  background: data.bg,
                  border:`3.5px solid ${data.color}`,
                  color: data.color,
                  fontFamily: 'system-ui, sans-serif',
                }}
              >
                {data.letter}
              </motion.div>

              <p className="font-black text-xl text-center" style={{ color: K.onSurface }}>
                Tap things that start with{' '}
                <span style={{ color: data.color }}>{data.phoneme}</span>
              </p>

              {/* 2×2 grid of objects */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {options.map((obj, i) => {
                  const isHit   = tapped.has(i) && obj.starts;
                  const isWrong = wrong === i;
                  return (
                    <motion.button
                      key={`${round}-${i}`}
                      whileTap={{ scale: 0.88 }}
                      animate={isWrong ? { x:[-6,6,-6,0] } : isHit ? { scale:[1,1.15,1] } : {}}
                      onClick={() => handleTap(i)}
                      disabled={tapped.has(i)}
                      className="flex flex-col items-center justify-center gap-2 rounded-3xl py-5 shadow-lg font-black"
                      style={{
                        background: isHit ? 'linear-gradient(135deg,#b9f474,#7ec84a)'
                                  : isWrong ? '#fecaca'
                                  : '#fff',
                        border: `3px solid ${isHit ? '#7ec84a' : isWrong ? '#ef4444' : K.container}`,
                        color: K.onSurface,
                        minHeight: 130,
                      }}
                    >
                      <span style={{ fontSize: 56 }}>{obj.emoji}</span>
                      <span className="font-black text-base text-center px-2" style={{ color: K.onSurface }}>
                        {obj.word}
                      </span>
                      {isHit   && <span style={{ fontSize:28 }}>✅</span>}
                      {isWrong && <span style={{ fontSize:28 }}>❌</span>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Round dots */}
              <div className="flex gap-2">
                {Array.from({length:ROUNDS}).map((_,i) => (
                  <div key={i} className="rounded-full"
                    style={{
                      width: i === round ? 18 : 10, height:10,
                      background: i < round ? data.color
                                : i === round ? data.color
                                : `${data.color}44`,
                    }} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Reward screen ── */}
          {done && (
            <motion.div key="done"
              className="flex flex-col items-center justify-center gap-6 w-full"
              initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
              transition={{ type:'spring', stiffness:240, damping:20 }}>

              {/* Star burst */}
              <div className="relative flex items-center justify-center" style={{ width:180, height:180 }}>
                {['⭐','🌟','✨','💫','🎉','🌈'].map((s,i) => (
                  <motion.span key={i} className="absolute text-3xl"
                    initial={{ scale:0, x:0, y:0 }}
                    animate={{ scale:1, x:Math.cos(i*60*Math.PI/180)*72, y:Math.sin(i*60*Math.PI/180)*72 }}
                    transition={{ delay:i*0.1, type:'spring', stiffness:200, damping:12 }}>
                    {s}
                  </motion.span>
                ))}
                <motion.div
                  animate={{ scale:[1,1.1,1], rotate:[0,8,-8,0] }}
                  transition={{ duration:2, repeat:Infinity }}
                  className="flex items-center justify-center rounded-3xl shadow-2xl font-black"
                  style={{ width:120, height:120, fontSize:82,
                    background: data.bg, border:`4px solid ${data.color}`,
                    color: data.color, fontFamily:'system-ui,sans-serif' }}
                >
                  {data.letter}
                </motion.div>
              </div>

              <p className="font-black text-3xl text-center" style={{ color: K.onSurface }}>
                🎉 Amazing, {kidName}!
              </p>
              <div className="flex gap-2">
                {[0,1,2].map(i => (
                  <motion.span key={i} initial={{ scale:0 }} animate={{ scale:1 }}
                    transition={{ delay:0.5+i*0.15 }} style={{ fontSize:38 }}>⭐</motion.span>
                ))}
              </div>

              <div className="flex flex-col gap-3 w-full max-w-xs mt-2">
                {!isLastLetter && (
                  <motion.button whileTap={{ scale:0.92 }}
                    initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.7 }}
                    onClick={() => {
                      const next = ALPHABET_DATA[currentLetterIdx+1].letter;
                      navigate(`/games/alphabets/letter-intro/${next}`);
                    }}
                    className="w-full py-4 rounded-2xl font-black text-xl text-white shadow-lg"
                    style={{ background: K.primary, boxShadow:`0 4px 0 ${K.primaryShadow}` }}>
                    Next Letter: {ALPHABET_DATA[currentLetterIdx+1].letter} ▶
                  </motion.button>
                )}
                <motion.button whileTap={{ scale:0.92 }}
                  initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.85 }}
                  onClick={() => { setRound(0); setScore(0); setTapped(new Set()); setDone(false); setCelebrating(false); }}
                  className="w-full py-3 rounded-2xl font-black text-base shadow-md"
                  style={{ background: K.active, color: K.onSurface, border:`2px solid #7ec84a` }}>
                  ↩ Play Again
                </motion.button>
                <motion.button whileTap={{ scale:0.92 }}
                  initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:1 }}
                  onClick={() => navigate('/games/alphabets/hub')}
                  className="w-full py-3 rounded-2xl font-black text-base shadow-md"
                  style={{ background: K.container, color: K.onSurface, border:`2px solid ${K.surfaceVar}` }}>
                  ← Back to Hub
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </KidsGameShell>
  );
};

export default StartsWithQuiz;
