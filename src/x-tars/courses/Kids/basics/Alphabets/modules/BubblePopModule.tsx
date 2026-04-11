/**
 * BubblePopModule.tsx — "Bubble Pop"
 * 4-5 bubbles at a time. Correct bubbles glow gold in practice mode.
 * Kid mode: system auto-pops correct bubbles (demo). Practice: user pops.
 * Correct pop → avatar dances. Wrong tap → sad emoji on avatar.
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
  id: number;
  letter: string;
  isCorrect: boolean;
  x: number;
  size: number;
  speed: number;
  color: string;
  state: 'floating' | 'popped' | 'bounce';
  dropEmoji: string;
  dropWord: string;
}

const BUBBLE_COLORS = [
  '#e11d48','#2563eb','#059669','#d97706','#7c3aed','#0891b2',
  '#dc2626','#065f46','#be185d','#1d4ed8',
];

let nextId = 0;

export default function BubblePopModule() {
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
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [correctLeft, setCorrectLeft] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [avatarAnim, setAvatarAnim] = useState<'idle' | 'dance' | 'wrong'>('idle');
  const [showSad, setShowSad] = useState(false);
  const correctLeftRef = useRef(0);

  const { speak } = useSpeech(isMuted);

  const ROUNDS = useMemo(() => [
    { target: 'A', distractors: ['B', 'C'] },
    { target: 'B', distractors: ['A', 'D'] },
    { target: 'C', distractors: ['G', 'O'] },
    { target: 'D', distractors: ['B', 'P'] },
    { target: 'E', distractors: ['F', 'A'] },
    { target: 'F', distractors: ['T', 'P'] },
    { target: 'G', distractors: ['C', 'Q'] },
    { target: 'H', distractors: ['K', 'N'] },
    { target: 'I', distractors: ['J', 'L'] },
    { target: 'J', distractors: ['I', 'Y'] },
    { target: 'K', distractors: ['H', 'X'] },
    { target: 'L', distractors: ['I', 'R'] },
  ], []);

  const round = ROUNDS[roundIdx % ROUNDS.length];
  const letterData = useMemo(
    () => ALPHABET_DATA.find(d => d.letter === round.target) ?? ALPHABET_DATA[0],
    [round.target]
  );

  const makeBubble = useCallback((isCorrect: boolean): Bubble => {
    const pool = isCorrect
      ? [round.target, round.target.toLowerCase()]
      : round.distractors;
    const letter = pool[Math.floor(Math.random() * pool.length)];
    const colorPool = isCorrect
      ? [letterData.color]
      : BUBBLE_COLORS.filter(c => c !== letterData.color);
    const ex = letterData.examples[Math.floor(Math.random() * letterData.examples.length)];
    return {
      id: nextId++,
      letter,
      isCorrect,
      x: Math.random() * 70 + 8,
      size: Math.random() * 20 + 84,
      speed: Math.random() * 4 + 12,
      color: colorPool[Math.floor(Math.random() * colorPool.length)],
      state: 'floating',
      dropEmoji: ex.emoji,
      dropWord: ex.word,
    };
  }, [round, letterData]);

  const startRound = useCallback(() => {
    setRoundComplete(false);
    setBubbles([]);
    setCorrectLeft(0);
    // Build 2 correct + 2-3 distractors = 4-5 total
    const items: Bubble[] = [
      makeBubble(true), makeBubble(true),
      makeBubble(false), makeBubble(false),
      // 5th bubble
      Math.random() > 0.5 ? makeBubble(true) : makeBubble(false),
    ];
    items.sort(() => Math.random() - 0.5);
    const correctCount = items.filter(b => b.isCorrect).length;
    correctLeftRef.current = correctCount;
    setCorrectLeft(correctCount);
    setBubbles(items);
    setTimeout(() => speak(
      `Pop the letter ${round.target}! Find big ${round.target} and little ${round.target.toLowerCase()}!`
    ), 400);
  }, [makeBubble, round, speak]);

  useEffect(() => { startRound(); }, [roundIdx]);

  // Kid mode: auto-pop correct bubbles one by one with delay
  useEffect(() => {
    if (mode !== 'play' || roundComplete) return;
    const correctBubbles = bubbles.filter(b => b.isCorrect && b.state === 'floating');
    if (correctBubbles.length === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    correctBubbles.forEach((b, i) => {
      timers.push(setTimeout(() => {
        setBubbles(prev => prev.map(bb => bb.id === b.id ? { ...bb, state: 'popped' } : bb));
        setAvatarAnim('dance');
        const newLeft = correctLeftRef.current - 1;
        correctLeftRef.current = newLeft;
        setCorrectLeft(newLeft);
        if (newLeft <= 0) {
          setTimeout(() => {
            setRoundComplete(true);
            speak(`Amazing! You learned the letter ${round.target}!`);
          }, 1000);
        }
      }, 2500 + i * 2200));
    });
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, bubbles.length, roundIdx, roundComplete]);

  const handleTap = useCallback((bubble: Bubble) => {
    if (mode !== 'practice' || bubble.state !== 'floating') return;
    if (bubble.isCorrect) {
      setAvatarAnim('dance');
      setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, state: 'popped' } : b));
      speak(`Pop! ${bubble.letter}! Yes!`);
      const newLeft = correctLeftRef.current - 1;
      correctLeftRef.current = newLeft;
      setCorrectLeft(newLeft);
      if (newLeft <= 0) {
        setTimeout(() => {
          setRoundComplete(true);
          speak(`Amazing! You popped all the ${round.target}s!`);
        }, 900);
      }
    } else {
      setAvatarAnim('wrong');
      setShowSad(true);
      setBubbles(prev => prev.map(b => b.id === bubble.id ? { ...b, state: 'bounce' } : b));
      speak(`Oops! That's ${bubble.letter}! Find the ${round.target}!`);
      setTimeout(() => setBubbles(prev => prev.map(b =>
        b.id === bubble.id ? { ...b, state: 'floating' } : b
      )), 900);
    }
  }, [mode, round.target, speak]);

  useEffect(() => {
    if (avatarAnim === 'idle') return;
    const t = setTimeout(() => setAvatarAnim('idle'), 1400);
    return () => clearTimeout(t);
  }, [avatarAnim]);

  useEffect(() => {
    if (!showSad) return;
    const t = setTimeout(() => setShowSad(false), 1200);
    return () => clearTimeout(t);
  }, [showSad]);

  const bubbleText = roundComplete
    ? `Great job! You found all the ${round.target}’s! 🎉`
    : mode === 'play'
      ? `Watch! I’ll pop the letter ${round.target} for you! 👀`
      : `Pop the ${round.target} and ${round.target.toLowerCase()} bubbles! 💥`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#0f172a 0%,#1e3a5f 50%,#1e1b4b 100%)' }}>

      {/* Stars */}
      {[...Array(12)].map((_,i) => (
        <motion.div key={i} className="absolute rounded-full bg-white pointer-events-none"
          style={{ width:(i%3)+2, height:(i%3)+2, left:`${(i*8+3)%96}%`, top:`${(i*11+5)%56}%`, opacity:0.3 }}
          animate={{ opacity:[0.1,0.6,0.1] }}
          transition={{ duration:(i%3)+2, repeat:Infinity, delay:i*0.35 }} />
      ))}

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:20 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode(m => m === 'play' ? 'practice' : 'play'); setRoundIdx(0); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: mode==='practice'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.18)',
              color: mode==='practice'?'#1a0000':'#fff', backdropFilter:'blur(6px)' }}>
            {mode==='practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </button>
          <div>
            <p className="font-black text-white text-base leading-none">Bubble Pop!</p>
            <p className="font-black text-xs" style={{ color:letterData.color }}>
              Pop <span style={{ fontSize:20 }}>{round.target}</span>
              <span style={{ fontSize:14 }}> {round.target.toLowerCase()}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.18)' }}>
            {isMuted
              ? <VolumeX size={20} color="white" />
              : <Volume2 size={20} color="white" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')} className="w-11 h-11 rounded-2xl flex items-center justify-center"
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
              <motion.div key={b.id} className="absolute flex flex-col items-center pointer-events-none"
                style={{ left:`${b.x}%`, bottom:'20%', zIndex:15 }}
                initial={{ opacity:1, scale:0.6, y:0 }}
                animate={{ opacity:[1,1,1,0], scale:[1,1.8,2.2,2.6], y:[0,-40,-90,-140] }}
                exit={{ opacity:0 }}
                transition={{ duration:2, ease:'easeOut' }}>
                <span style={{ fontSize:b.size*0.75, lineHeight:1 }}>💥</span>
                <motion.div className="flex flex-col items-center"
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:[0,1,1,0], y:[0,20,50,70] }}
                  transition={{ delay:0.4, duration:1.6, ease:'easeIn' }}>
                  <span style={{ fontSize:46 }}>{b.dropEmoji}</span>
                  <span className="font-black text-xs text-white" style={{ textShadow:'0 1px 4px #000' }}>{b.dropWord}</span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.button key={b.id}
                className="absolute flex items-center justify-center rounded-full font-black shadow-2xl"
                style={{
                  width:b.size, height:b.size,
                  left:`${b.x}%`,
                  bottom: b.state==='bounce' ? '10%' : '-12%',
                  background:`radial-gradient(circle at 35% 32%, ${b.color}55, ${b.color}bb)`,
                  border: mode==='practice' && b.isCorrect ? '4px solid gold' : `3px solid ${b.color}`,
                  boxShadow: mode==='practice' && b.isCorrect
                    ? '0 0 18px 4px gold, 0 4px 12px rgba(0,0,0,0.4)'
                    : '0 4px 12px rgba(0,0,0,0.4)',
                  fontSize:b.size*0.42, color:'white',
                  backdropFilter:'blur(3px)', zIndex:5,
                  textShadow:'0 2px 6px rgba(0,0,0,0.6)',
                }}
                animate={b.state==='bounce'
                  ? { x:[0,-22,22,-18,18,-10,10,0], y:[0,-14,0] }
                  : { y:['0vh','-112vh'] }}
                transition={b.state==='bounce'
                  ? { duration:0.65 }
                  : { duration:b.speed, ease:'linear', repeat:Infinity, repeatType:'loop', repeatDelay:0.8 }}
                onClick={() => handleTap(b)}>
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
                All {round.target}’s found!
              </p>
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => setRoundIdx(i => i+1)}
                className="px-8 py-3 rounded-2xl font-black text-lg text-white shadow-xl"
                style={{ background:letterData.color, boxShadow:`0 5px 0 ${letterData.color}99` }}>
                Next Letter ▶
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:20 }}>
        <div className="relative w-[80px] h-[80px] shrink-0 flex items-center justify-center">
          <motion.div className="w-full h-full flex items-center justify-center"
            animate={avatarAnim==='dance'
              ? { y:[0,-26,0,-16,0,-8,0], scale:[1,1.22,0.95,1.18,0.98,1.08,1], rotate:[0,14,-14,10,-8,4,0] }
              : avatarAnim==='wrong'
              ? { x:[0,-12,12,-10,10,-5,5,0], rotate:[0,-8,8,-5,5,0] }
              : { y:0, x:0, rotate:0, scale:1 }}
            transition={{ duration:avatarAnim==='dance'?0.9:0.55 }}>
            <KidAvatar avatar={kidAvatar} size={78} />
          </motion.div>
          <AnimatePresence>
            {showSad && (
              <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1.1 }}
                exit={{ opacity:0, scale:0.4 }} transition={{ type:'spring', stiffness:320, damping:18 }}>
                <span style={{ fontSize:56 }}>😢</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex-1 flex items-center gap-2 rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3"
          style={{ background:'rgba(255,255,255,0.96)' }}>
          <button onClick={() => setIsMuted(m => !m)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background:letterData.color }}>
            <Volume2 size={16} color="white" />
          </button>
          <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
        </div>
      </div>
    </div>
  );
}
