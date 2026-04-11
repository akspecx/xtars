/**
 * SteppingStonesModule.tsx — "Stepping Stones" A to Z
 * Build a path by tapping each stone. Reveals the letter + its object.
 * Kid mode: auto-taps all stones slowly. Practice: user taps each stone.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

export default function SteppingStonesModule() {
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
  const [revealed, setRevealed] = useState(0); // how many stones revealed (0..26)
  const [complete, setComplete] = useState(false);
  const [avatarAnim, setAvatarAnim] = useState<'idle' | 'bounce'>('idle');
  const { speak } = useSpeech(isMuted);

  // Reset on mode change
  useEffect(() => { setRevealed(0); setComplete(false); }, [mode]);

  // Intro speech
  useEffect(() => {
    setTimeout(() => speak(
      mode === 'play'
        ? "Let's walk the alphabet! Watch as I build the path!"
        : "Tap each stone to reveal the letter! Build the path from A to Z!"
    ), 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Kid mode: auto-reveal one by one
  useEffect(() => {
    if (mode !== 'play' || complete) return;
    if (revealed >= 26) { setComplete(true); return; }
    const t = setTimeout(() => {
      const d = ALPHABET_DATA[revealed];
      speak(`${d.letter}! ${d.phoneme}... ${d.examples[0].word}!`);
      setAvatarAnim('bounce');
      setTimeout(() => setAvatarAnim('idle'), 600);
      setRevealed(r => r + 1);
    }, revealed === 0 ? 1200 : 1800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, revealed, complete]);

  const tapStone = useCallback((idx: number) => {
    if (mode !== 'practice' || idx !== revealed) return;
    const d = ALPHABET_DATA[idx];
    speak(`${d.letter}! ${d.phoneme}... ${d.examples[0].word}!`);
    setAvatarAnim('bounce');
    setTimeout(() => setAvatarAnim('idle'), 600);
    const next = revealed + 1;
    setRevealed(next);
    if (next >= 26) {
      setTimeout(() => {
        setComplete(true);
        speak("You walked the whole alphabet! Amazing!");
      }, 800);
    }
  }, [mode, revealed, speak]);

  const bubbleText = complete
    ? "You built the whole alphabet path! A to Z! 🎉"
    : revealed === 0
    ? mode === 'play' ? "Watch me build the A to Z path! 🤖" : "Tap the first stone to start! 👋"
    : `${ALPHABET_DATA[revealed-1].letter} is for ${ALPHABET_DATA[revealed-1].examples[0].word}! ${ALPHABET_DATA[revealed-1].examples[0].emoji}`;

  // Layout: 4 rows of 6 + 1 row of 2
  const rows: number[][] = [];
  for (let i = 0; i < 26; i += 5) rows.push(Array.from({ length: Math.min(5, 26-i) }, (_,j)=>i+j));

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#e0f7fa,#b2ebf2,#80deea)' }}>

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:10 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMode(m => m==='play'?'practice':'play')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background:mode==='practice'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)',
              color:'#006267', backdropFilter:'blur(6px)' }}>
            {mode==='practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </button>
          <h1 className="font-black text-base" style={{ color:'#006267' }}>A to Z Path</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX size={18} color="#006267" /> : <Volume2 size={18} color="#006267" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')} className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <X size={22} color="#006267" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 mb-2">
        <div className="rounded-full overflow-hidden h-2" style={{ background:'rgba(255,255,255,0.5)' }}>
          <motion.div className="h-full rounded-full" animate={{ width:`${(revealed/26)*100}%` }}
            transition={{ duration:0.4 }} style={{ background:'#00897b' }} />
        </div>
        <p className="text-xs font-black text-center mt-1" style={{ color:'#006267' }}>{revealed}/26 letters</p>
      </div>

      {/* Stones grid */}
      <div className="flex-1 flex flex-col justify-center px-3 gap-3 pb-4 overflow-hidden">
        {rows.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-2">
            {row.map(idx => {
              const d = ALPHABET_DATA[idx];
              const isRevealed = idx < revealed;
              const isNext = idx === revealed && !complete;
              return (
                <motion.button key={idx}
                  style={{
                    width: 52, height: 52,
                    background: isRevealed
                      ? `radial-gradient(circle at 40% 35%,${d.color}cc,${d.color})`
                      : isNext && mode==='practice'
                      ? 'rgba(255,255,255,0.9)'
                      : 'rgba(255,255,255,0.35)',
                    border: isNext && !isRevealed ? `2.5px dashed ${isRevealed?d.color:'#00897b'}` : `2.5px solid ${isRevealed?d.color:'rgba(255,255,255,0.6)'}`,
                    borderRadius: 16,
                    boxShadow: isRevealed ? `0 4px 0 ${d.color}88` : isNext?'0 0 12px rgba(0,200,180,0.5)':undefined,
                    cursor: isNext && mode==='practice' ? 'pointer' : 'default',
                  }}
                  whileTap={isNext && mode==='practice' ? { scale:0.88 } : {}}
                  onClick={() => tapStone(idx)}>
                  <AnimatePresence mode="wait">
                    {isRevealed ? (
                      <motion.div key="revealed" className="flex flex-col items-center justify-center w-full h-full"
                        initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                        transition={{ type:'spring', stiffness:320, damping:18 }}>
                        <span style={{ fontSize:20, lineHeight:1 }}>{d.examples[0].emoji}</span>
                        <span className="font-black" style={{ fontSize:14, color:'white', lineHeight:1 }}>{d.uppercase}</span>
                      </motion.div>
                    ) : (
                      <motion.div key="hidden" className="flex items-center justify-center w-full h-full">
                        {isNext && mode==='practice'
                          ? <motion.span className="font-black" style={{ fontSize:20, color:'#00897b' }}
                              animate={{ scale:[1,1.15,1] }} transition={{ duration:1, repeat:Infinity }}>?</motion.span>
                          : <span style={{ fontSize:18, opacity:0.3 }}>·</span>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Avatar + bubble */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:10 }}>
        <motion.div className="w-[70px] h-[70px] shrink-0 flex items-center justify-center"
          animate={avatarAnim==='bounce' ? { y:[0,-20,0,-10,0], scale:[1,1.2,0.95,1.1,1] } : { y:0, scale:1 }}
          transition={{ duration:0.55 }}>
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`bubble-${revealed}-${complete}`}
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2">
            <button onClick={() => setIsMuted(m => !m)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background:'#00897b' }}>
              <Volume2 size={14} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Complete overlay */}
      <AnimatePresence>
        {complete && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-30"
            style={{ background:'rgba(0,98,103,0.85)' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.span style={{ fontSize:90 }}
              animate={{ scale:[0.7,1.3,1], rotate:[-10,10,0] }}
              transition={{ type:'spring', stiffness:260, damping:16 }}>🎊</motion.span>
            <p className="font-black text-white text-2xl text-center">A to Z done!</p>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => { setRevealed(0); setComplete(false); }}
                className="px-6 py-3 rounded-2xl font-black text-white"
                style={{ background:'#00897b', boxShadow:'0 4px 0 #006168' }}>
                ↻ Again
              </motion.button>
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => navigate('/games/alphabets')}
                className="px-6 py-3 rounded-2xl font-black text-teal-900"
                style={{ background:'rgba(255,255,255,0.9)' }}>
                ← Menu
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
