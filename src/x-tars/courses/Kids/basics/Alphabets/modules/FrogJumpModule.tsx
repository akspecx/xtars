/**
 * FrogJumpModule.tsx — "The Frog Jump"
 * A, B, ? — tap what comes next.
 * Kid mode: avatar auto-hops and shows the answer. Practice: user taps.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

function buildRound(roundIdx: number) {
  const start = roundIdx % 24; // never exceed Z
  const a = ALPHABET_DATA[start].letter;
  const b = ALPHABET_DATA[start+1].letter;
  const correct = ALPHABET_DATA[start+2].letter;
  // wrong: skip one
  const wrong = ALPHABET_DATA[start+3]?.letter ?? 'Z';
  return { a, b, correct, wrong, startIdx: start };
}

export default function FrogJumpModule() {
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

  const [mode, setMode] = useState<'play'|'practice'>('play');
  const [isMuted, setIsMuted] = useState(false);
  const [roundIdx, setRoundIdx] = useState(0);
  const [frogPad, setFrogPad] = useState(0);  // 0=A pad, 1=B pad, 2=? pad
  const [answered, setAnswered] = useState<string|null>(null);
  const [wrongChoice, setWrongChoice] = useState<string|null>(null);
  const [avatarAnim, setAvatarAnim] = useState<'idle'|'jump'|'wrong'>('idle');
  const { speak } = useSpeech(isMuted);

  const round = useMemo(() => buildRound(roundIdx), [roundIdx]);

  useEffect(() => {
    setFrogPad(0); setAnswered(null); setWrongChoice(null); setAvatarAnim('idle');
    setTimeout(() => speak(
      mode === 'play'
        ? `${round.a}... ${round.b}... What comes next? Watch!`
        : `${round.a}... ${round.b}... What comes next? Tap the right letter!`
    ), 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  // Kid mode: auto-hop
  useEffect(() => {
    if (mode !== 'play') return;
    const t1 = setTimeout(() => { setFrogPad(1); setAvatarAnim('jump'); speak(round.b); setTimeout(() => setAvatarAnim('idle'), 500); }, 1800);
    const t2 = setTimeout(() => { setFrogPad(2); setAvatarAnim('jump'); speak(round.correct); setAnswered(round.correct); setTimeout(() => setAvatarAnim('idle'), 500); }, 3600);
    const t3 = setTimeout(() => speak(`${round.a}, ${round.b}, ${round.correct}! ${round.correct} comes next!`), 4800);
    return () => [t1,t2,t3].forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  const handleChoice = useCallback((letter: string) => {
    if (mode !== 'practice' || answered) return;
    if (letter === round.correct) {
      setAnswered(letter);
      setFrogPad(2);
      setAvatarAnim('jump');
      speak(`${round.correct}! ${round.a}, ${round.b}, ${round.correct}! Correct!`);
      setTimeout(() => setAvatarAnim('idle'), 700);
    } else {
      setWrongChoice(letter);
      setAvatarAnim('wrong');
      speak(`Hmm! Try again! After ${round.b} comes...`);
      setTimeout(() => { setWrongChoice(null); setAvatarAnim('idle'); }, 900);
    }
  }, [mode, answered, round, speak]);

  const PAD_BG = ['#10b981','#3b82f6','#f59e0b'];
  // Shuffle choices so correct isn't always first
  const choices = useMemo(() => {
    const arr = [round.correct, round.wrong];
    if (roundIdx % 2 === 1) arr.reverse();
    return arr;
  }, [round, roundIdx]);

  const bubbleText = answered === round.correct
    ? `${round.a}, ${round.b}, ${round.correct}! 🐸 Yes!`
    : mode === 'play'
    ? `${round.a}... ${round.b}... Watch the frog jump! 🐸`
    : `${round.a}... ${round.b}... What comes next? 🤔`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background:'linear-gradient(160deg,#d1fae5,#a7f3d0,#34d399)' }}>

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:10 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode(m => m==='play'?'practice':'play'); setRoundIdx(0); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background:mode==='practice'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)', color:'#065f46', backdropFilter:'blur(6px)' }}>
            {mode==='practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </button>
          <h1 className="font-black text-base" style={{ color:'#065f46' }}>Frog Jump</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX size={18} color="#065f46" /> : <Volume2 size={18} color="#065f46" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')} className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <X size={22} color="#065f46" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Lily pads */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
        <div className="flex items-end justify-center gap-3 w-full">
          {[round.a, round.b, answered ?? '?'].map((label, padIdx) => (
            <div key={padIdx} className="flex flex-col items-center gap-2">
              {/* Frog on this pad? */}
              <AnimatePresence>
                {frogPad === padIdx && (
                  <motion.div
                    initial={{ y: 40, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-30, opacity:0 }}
                    transition={{ type:'spring', stiffness:320, damping:18 }}>
                    <KidAvatar avatar={kidAvatar} size={52} />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Pad */}
              <motion.div
                animate={padIdx===2 && answered ? { scale:[1,1.15,1], boxShadow:['0 0 0 0 transparent','0 0 20px 8px #fbbf2488','0 0 0 0 transparent'] } : {}}
                transition={{ duration:0.8 }}
                className="flex items-center justify-center rounded-full"
                style={{
                  width: padIdx===2?96:80, height:padIdx===2?96:80,
                  background: `radial-gradient(circle at 40% 35%, ${PAD_BG[padIdx]}99, ${PAD_BG[padIdx]})`,
                  border:`3px solid white`,
                  boxShadow:`0 6px 0 ${PAD_BG[padIdx]}66`,
                }}>
                <span className="font-black text-white" style={{ fontSize:padIdx===2?40:34 }}>
                  {label}
                </span>
              </motion.div>
              {padIdx===2 && answered && (
                <motion.span style={{ fontSize:28 }}
                  initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300, damping:14 }}>
                  {ALPHABET_DATA.find(d=>d.letter===answered)?.examples[0].emoji}
                </motion.span>
              )}
            </div>
          ))}
        </div>

        {/* Choices (practice only) */}
        {mode === 'practice' && !answered && (
          <div className="flex gap-6 justify-center">
            {choices.map(ch => {
              const isWrong = wrongChoice === ch;
              return (
                <motion.button key={ch}
                  animate={isWrong ? { x:[-8,8,-6,6,-3,3,0] } : {}}
                  transition={{ duration:0.45 }}
                  whileTap={{ scale:0.88 }}
                  onClick={() => handleChoice(ch)}
                  className="w-20 h-20 rounded-2xl font-black text-4xl shadow-xl text-white"
                  style={{
                    background: isWrong ? '#fda4af' : '#065f46',
                    border: isWrong ? '3px solid #f43f5e' : '3px solid rgba(255,255,255,0.4)',
                    boxShadow:'0 5px 0 rgba(0,0,0,0.2)',
                  }}>
                  {ch}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Next round button (practice after correct) */}
        {mode === 'practice' && answered === round.correct && (
          <motion.button initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            whileTap={{ scale:0.9 }}
            onClick={() => setRoundIdx(i => i+1)}
            className="px-8 py-3 rounded-2xl font-black text-lg text-white"
            style={{ background:'#065f46', boxShadow:'0 5px 0 #044039' }}>
            Next ▶
          </motion.button>
        )}
        {mode === 'play' && answered === round.correct && (
          <motion.button initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:1 }}
            whileTap={{ scale:0.9 }}
            onClick={() => { setAnswer: setAnswered(null); setRoundIdx(i => i+1); }}
            className="px-8 py-3 rounded-2xl font-black text-lg text-white"
            style={{ background:'#065f46', boxShadow:'0 5px 0 #044039' }}>
            Next ▶
          </motion.button>
        )}
      </div>

      {/* Avatar */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:10 }}>
        <motion.div className="w-[70px] h-[70px] shrink-0 flex items-center justify-center"
          animate={avatarAnim==='jump' ? { y:[0,-22,0], scale:[1,1.2,1] }
            : avatarAnim==='wrong' ? { x:[0,-10,10,-8,8,-4,4,0] }
            : { y:0, x:0 }}
          transition={{ duration:0.5 }}>
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`bubble-${roundIdx}-${answered}`}
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2">
            <button onClick={() => setIsMuted(m => !m)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:'#065f46' }}>
              <Volume2 size={14} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
