/**
 * BubblePopModule.tsx — “Bubble Pop”
 * Practice mode: correct-letter bubbles glow gold (hint).
 * Kid mode:      all bubbles look the same (challenge).
 * Correct pop  → avatar dances + random object from the letter drops.
 * Wrong tap    → sad emoji overlays avatar momentarily.
 */
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

interface Bubble {
  id:        number;
  letter:    string;
  isCorrect: boolean;
  x:         number;   // vw %
  size:      number;   // px
  speed:     number;   // float duration in seconds (10-15, slow enough for kids)
  color:     string;
  state:     'floating' | 'popped' | 'bounce';
  dropEmoji: string;   // randomly picked from letterData.examples
  dropWord:  string;
}

const BUBBLE_COLORS = [
  '#e11d48','#2563eb','#059669','#d97706','#7c3aed','#0891b2',
  '#dc2626','#065f46','#be185d','#1d4ed8','#b45309','#4338ca',
];

let nextId = 0;

export default function BubblePopModule() {
  const navigate = useNavigate();
  const { activeProfile, availableProfiles } = useProfile() as any;

  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try { const id = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const hit = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return hit?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const [mode,          setMode]          = useState<'play'|'practice'>('play');
  const [isMuted,       setIsMuted]       = useState(false);
  const [roundIdx,      setRoundIdx]      = useState(0);
  const [bubbles,       setBubbles]       = useState<Bubble[]>([]);
  const [correctLeft,   setCorrectLeft]   = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [avatarAnim,    setAvatarAnim]    = useState<'idle'|'dance'|'wrong'>('idle');
  const [showSad,       setShowSad]       = useState(false);  // sad emoji overlay on wrong
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { speak } = useSpeech(isMuted);

  const ROUNDS = useMemo(() => [
    { targetLetter: 'A', distractors: ['B','C','D','E'] },
    { targetLetter: 'B', distractors: ['A','C','P','D'] },
    { targetLetter: 'C', distractors: ['G','D','O','B'] },
    { targetLetter: 'D', distractors: ['B','G','P','Q'] },
    { targetLetter: 'E', distractors: ['F','A','B','C'] },
    { targetLetter: 'F', distractors: ['E','T','P','B'] },
    { targetLetter: 'G', distractors: ['C','Q','O','D'] },
    { targetLetter: 'H', distractors: ['K','A','N','I'] },
    { targetLetter: 'I', distractors: ['J','L','T','H'] },
    { targetLetter: 'J', distractors: ['I','G','Y','L'] },
    { targetLetter: 'K', distractors: ['H','X','C','N'] },
    { targetLetter: 'L', distractors: ['I','J','T','R'] },
  ], []);

  const round = ROUNDS[roundIdx % ROUNDS.length];
  const letterData = useMemo(
    () => ALPHABET_DATA.find(d => d.letter === round.targetLetter) ?? ALPHABET_DATA[0],
    [round.targetLetter]
  );

  // Build one bubble — correct bubbles cycle randomly through all examples for variety
  const makeBubble = useCallback((isCorrect: boolean): Bubble => {
    const pool = isCorrect
      ? [round.targetLetter, round.targetLetter.toLowerCase()]
      : round.distractors;
    const letter = pool[Math.floor(Math.random() * pool.length)];
    const colorPool = isCorrect
      ? [letterData.color]
      : BUBBLE_COLORS.filter(c => c !== letterData.color);
    // Pick a random example object so different pops show different objects
    const ex = letterData.examples[Math.floor(Math.random() * letterData.examples.length)];
    return {
      id:        nextId++,
      letter,
      isCorrect,
      x:         Math.random() * 74 + 5,
      size:      Math.random() * 28 + 76,               // 76-104 px
      speed:     Math.random() * 5 + 11,                // 11-16 s — slow enough for kids
      color:     colorPool[Math.floor(Math.random() * colorPool.length)],
      state:     'floating',
      dropEmoji: ex.emoji,
      dropWord:  ex.word,
    };
  }, [round, letterData]);

  // ── Start round ──
  const startRound = useCallback(() => {
    setRoundComplete(false);
    setBubbles([]);
    const initial: Bubble[] = [];
    for (let i = 0; i < 3; i++) initial.push(makeBubble(true));   // 3 correct
    for (let i = 0; i < 4; i++) initial.push(makeBubble(false));  // 4 distractors
    initial.sort(() => Math.random() - 0.5);
    setBubbles(initial);
    setCorrectLeft(3);
    setTimeout(() => speak(
      `Pop the letter ${round.targetLetter}! Find the big ${round.targetLetter} and little ${round.targetLetter.toLowerCase()}!`
    ), 400);
  }, [makeBubble, round, speak]);

  useEffect(() => { startRound(); }, [roundIdx]);

  // Spawn extra bubbles periodically
  useEffect(() => {
    spawnRef.current = setInterval(() => {
      setBubbles(prev => {
        if (prev.filter(b => b.state === 'floating').length >= 9) return prev;
        return [...prev, makeBubble(Math.random() < 0.35)];
      });
    }, 3000);  // spawn every 3 s
    return () => { if (spawnRef.current) clearInterval(spawnRef.current); };
  }, [makeBubble]);

  // ── Handle tap ──
  const correctLeftRef = useRef(correctLeft);
  useEffect(() => { correctLeftRef.current = correctLeft; }, [correctLeft]);

  const handleTap = useCallback((bubble: Bubble) => {
    if (bubble.state !== 'floating') return;
    if (bubble.isCorrect) {
      setAvatarAnim('dance');
      setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, state: 'popped' } : b));
      speak(`Pop! ${bubble.letter}! Yes!`);
      const newLeft = correctLeftRef.current - 1;
      setCorrectLeft(newLeft);
      if (newLeft <= 0) {
        setTimeout(() => {
          setRoundComplete(true);
          speak(`Amazing! You popped all the ${round.targetLetter}'s! Great job!`);
        }, 1000);
      }
    } else {
      setAvatarAnim('wrong');
      setShowSad(true);
      setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, state: 'bounce' } : b));
      speak(`Oops! That's ${bubble.letter}! Find the ${round.targetLetter}!`);
      setTimeout(() => setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, state: 'floating' } : b)), 900);
    }
  }, [round.targetLetter, speak]);

  // Reset avatar anim
  useEffect(() => {
    if (avatarAnim === 'idle') return;
    const t = setTimeout(() => setAvatarAnim('idle'), 1400);
    return () => clearTimeout(t);
  }, [avatarAnim]);

  // Reset sad emoji
  useEffect(() => {
    if (!showSad) return;
    const t = setTimeout(() => setShowSad(false), 1200);
    return () => clearTimeout(t);
  }, [showSad]);

  const bubbleText = roundComplete
    ? `Amazing! You popped all the ${round.targetLetter}'s! 🎉`
    : `Pop the letter ${round.targetLetter}! Tap the ${round.targetLetter} and ${round.targetLetter.toLowerCase()} bubbles! 💥`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e3a5f 50%,#1e1b4b 100%)' }}>

      {/* Star background */}
      {[...Array(14)].map((_,i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width: (i%3)+2, height: (i%3)+2,
            left: `${(i*7+3)%97}%`, top: `${(i*11+5)%58}%`, opacity: 0.35 }}
          animate={{ opacity: [0.15,0.7,0.15] }}
          transition={{ duration: (i%3)+2, repeat:Infinity, delay: i*0.4 }} />
      ))}

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:20 }}>
        <div className="flex items-center gap-3">
          {/* mode toggle */}
          <button
            onClick={() => { setMode(m => m === 'play' ? 'practice' : 'play'); setRoundIdx(0); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: mode === 'practice' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.18)',
              color: mode === 'practice' ? '#1a0000' : '#fff', backdropFilter: 'blur(6px)' }}>
            {mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </button>
          <div>
            <p className="font-black text-white text-base leading-none">Bubble Pop!</p>
            <p className="font-black text-xs" style={{ color: letterData.color }}>
              Pop <span style={{ fontSize:18 }}>{round.targetLetter}</span>
              <span style={{ fontSize:14 }}> {round.targetLetter.toLowerCase()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)' }}>
            {isMuted ? <VolumeX size={20} color="white" /> : <Volume2 size={20} color="white" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')}
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)' }}>
            <X size={22} color="white" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bubble field */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence>
          {bubbles.map(b => (
            b.state === 'popped' ? (
              // Pop burst — object falls slowly so kids can see it
              <motion.div key={b.id} className="absolute flex flex-col items-center pointer-events-none"
                style={{ left:`${b.x}%`, bottom:'15%', zIndex:15 }}
                initial={{ opacity:1, scale:0.6, y:0 }}
                animate={{ opacity:[1,1,1,0], scale:[1,1.6,1.8,2.2], y:[0,-30,-60,-120] }}
                exit={{ opacity:0 }}
                transition={{ duration:1.8, ease:'easeOut' }}
              >
                <span style={{ fontSize: b.size * 0.75, lineHeight:1 }}>💥</span>
                {/* Object drops downward and lingers */}
                <motion.div className="flex flex-col items-center"
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:[0,1,1,0], y:[0,18,40,60] }}
                  transition={{ delay:0.3, duration:1.5, ease:'easeIn' }}>
                  <span style={{ fontSize:44 }}>{b.dropEmoji}</span>
                  <span className="font-black text-xs text-white" style={{ textShadow:'0 1px 4px #000' }}>{b.dropWord}</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.button
                key={b.id}
                className="absolute flex items-center justify-center rounded-full font-black shadow-2xl"
                style={{
                  width:b.size, height:b.size,
                  left:`${b.x}%`,
                  bottom: b.state === 'bounce' ? '8%' : '-12%',
                  background: `radial-gradient(circle at 35% 32%, ${b.color}55, ${b.color}bb)`,
                  border: mode === 'practice' && b.isCorrect
                    ? `4px solid gold`
                    : `3px solid ${b.color}`,
                  boxShadow: mode === 'practice' && b.isCorrect
                    ? `0 0 18px 4px gold, 0 4px 12px rgba(0,0,0,0.4)`
                    : `0 4px 12px rgba(0,0,0,0.4)`,
                  fontSize: b.size * 0.42,
                  color: 'white',
                  backdropFilter: 'blur(3px)',
                  zIndex: 5,
                  textShadow: '0 2px 6px rgba(0,0,0,0.6)',
                }}
                animate={b.state === 'bounce'
                  ? { x: [0,-22,22,-18,18,-10,10,0], y: [0,-14,0] }
                  : { y: ['0vh', '-110vh'] }}
                transition={b.state === 'bounce'
                  ? { duration: 0.6 }
                  : { duration: b.speed, ease: 'linear', repeat: Infinity, repeatType: 'loop', repeatDelay: 0.8 }}
                onClick={() => handleTap(b)}
              >
                {b.letter}
              </motion.button>
            )
          ))}
        </AnimatePresence>

        {/* Round complete overlay */}
        <AnimatePresence>
          {roundComplete && (
            <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-30"
              style={{ background:'rgba(0,0,0,0.75)' }}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
              <motion.span style={{ fontSize:96 }}
                animate={{ scale:[0.7,1.3,1], rotate:[-15,15,-8,8,0] }}
                transition={{ type:'spring', stiffness:280, damping:16 }}>
                🎉
              </motion.span>
              <p className="font-black text-white text-2xl text-center">
                All {round.targetLetter}'s popped!
              </p>
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => setRoundIdx(i => i + 1)}
                className="px-8 py-3 rounded-2xl font-black text-lg text-white shadow-xl"
                style={{ background: letterData.color, boxShadow:`0 5px 0 ${letterData.color}99` }}>
                Next Letter ▶
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar + speech bubble */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:20 }}>

        {/* Avatar with dance or sad overlay */}
        <div className="relative w-[80px] h-[80px] shrink-0 flex items-center justify-center">
          <motion.div className="w-full h-full flex items-center justify-center"
            animate={avatarAnim === 'dance'
              ? { y:[0,-28,0,-18,0,-10,0], scale:[1,1.22,0.95,1.18,0.98,1.08,1],
                  rotate:[0,14,-14,10,-8,4,0] }
              : avatarAnim === 'wrong'
              ? { x:[0,-12,12,-10,10,-5,5,0], rotate:[0,-8,8,-5,5,0] }
              : { y:0, x:0, rotate:0, scale:1 }}
            transition={{ duration: avatarAnim === 'dance' ? 0.9 : 0.55 }}>
            <KidAvatar avatar={kidAvatar} size={78} />
          </motion.div>
          {/* Sad overlay */}
          <AnimatePresence>
            {showSad && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1.1 }} exit={{ opacity:0, scale:0.4 }}
                transition={{ type:'spring', stiffness:320, damping:18 }}>
                <span style={{ fontSize:56 }}>😢</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3"
          style={{ background:'rgba(255,255,255,0.96)' }}>
          <button onClick={() => setIsMuted(m => !m)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: letterData.color }}>
            <Volume2 size={16} color="white" />
          </button>
          <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
        </div>
      </div>
    </div>
  );
}
