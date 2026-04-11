/**
 * FixTheBridgeModule.tsx — "Fix the Bridge"
 * A plank is missing. Tap the correct letter from 2 choices to fix it.
 * Kid mode: auto-fills and shows avatar running across. Practice: user taps.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

function buildBridgeRound(roundIdx: number) {
  const gapPos = (roundIdx % 3) + 1; // which position (1, 2, or 3) has the gap
  const start = Math.floor(roundIdx / 3) % 22;
  const letters = [
    ALPHABET_DATA[start].letter,
    ALPHABET_DATA[start+1].letter,
    ALPHABET_DATA[start+2].letter,
    ALPHABET_DATA[start+3].letter,
  ].slice(0, 3 + (gapPos===0?1:0)); // always 3 visible planks
  const missing = letters[gapPos];
  const wrong = ALPHABET_DATA[(start + 5) % 26].letter;
  return { letters, missing, wrong, gapPos };
}

export default function FixTheBridgeModule() {
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
  const [fixed, setFixed] = useState(false);
  const [avatarX, setAvatarX] = useState(0);   // 0=left, 1=right (crossed!)
  const [wrongChoice, setWrongChoice] = useState<string|null>(null);
  const [avatarAnim, setAvatarAnim] = useState<'idle'|'run'|'cheer'>('idle');
  const { speak } = useSpeech(isMuted);

  const round = useMemo(() => buildBridgeRound(roundIdx), [roundIdx]);

  useEffect(() => {
    setFixed(false); setAvatarX(0); setWrongChoice(null); setAvatarAnim('idle');
    const before = round.letters[round.gapPos - 1];
    const after  = round.letters[round.gapPos + 1] ?? '';
    setTimeout(() => speak(
      mode === 'play'
        ? `Oh no! The bridge is broken! Watch me fix it!`
        : `Oh no! The bridge is broken! After ${before} comes... tap the right letter!`
    ), 350);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  // Kid mode auto-fills
  useEffect(() => {
    if (mode !== 'play') return;
    const t1 = setTimeout(() => {
      setFixed(true);
      speak(`${round.missing}! The bridge is fixed!`);
    }, 2000);
    const t2 = setTimeout(() => {
      setAvatarAnim('run');
      setAvatarX(1);
      speak('Yay! I made it across!');
    }, 3200);
    const t3 = setTimeout(() => setAvatarAnim('cheer'), 4400);
    return () => [t1,t2,t3].forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx, mode]);

  const handleTap = useCallback((letter: string) => {
    if (mode !== 'practice' || fixed) return;
    if (letter === round.missing) {
      setFixed(true);
      speak(`${letter}! Bridge fixed! Let's cross!`);
      setTimeout(() => { setAvatarAnim('run'); setAvatarX(1); }, 600);
      setTimeout(() => { setAvatarAnim('cheer'); speak('I made it!'); }, 1700);
    } else {
      setWrongChoice(letter);
      speak(`Hmm, that doesn't fit! Try again!`);
      setTimeout(() => setWrongChoice(null), 900);
    }
  }, [mode, fixed, round.missing, speak]);

  const choices = useMemo(() => {
    const arr = [round.missing, round.wrong];
    if (roundIdx % 2 === 1) arr.reverse();
    return arr;
  }, [round, roundIdx]);

  const bubbleText = avatarAnim === 'cheer'
    ? `I crossed the bridge! ${round.missing} was the missing letter! \U0001F389`
    : fixed
    ? `${round.missing} fixed the bridge! Go! Go! Go! \U0001F3C3`
    : mode === 'play'
    ? `The bridge is broken! Watch me fix it! \U0001F527`
    : `What letter is missing? Tap to fix the bridge! \U0001F914`;

  const PLANK_COLOR = '#92400e';

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background:'linear-gradient(160deg,#fef3c7,#fde68a,#fbbf24)' }}>

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:10 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => { setMode(m => m==='play'?'practice':'play'); setRoundIdx(0); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background:mode==='practice'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)', color:'#92400e', backdropFilter:'blur(6px)' }}>
            {mode==='practice' ? '\u270f\ufe0f Practice' : '\U0001F916 Kid Mode'}
          </button>
          <h1 className="font-black text-base" style={{ color:'#92400e' }}>Fix the Bridge</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX size={18} color="#92400e" /> : <Volume2 size={18} color="#92400e" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')} className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <X size={22} color="#92400e" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Bridge scene */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* River */}
        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height:160 }}>
          {/* Water */}
          <div className="absolute inset-0 rounded-2xl" style={{ background:'linear-gradient(180deg,#7dd3fc,#0284c7)' }}>
            {[0,1,2,3].map(i => (
              <motion.div key={i} className="absolute h-[3px] rounded-full bg-white opacity-40"
                style={{ left:`${i*25+5}%`, top:`${30+i*15}%`, width:'18%' }}
                animate={{ x:[0,8,0,-4,0] }} transition={{ duration:2+i*0.5, repeat:Infinity }} />
            ))}
          </div>

          {/* Bridge planks */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 px-4">
            {/* Left bank */}
            <div className="w-10 h-14 rounded-t-xl flex items-center justify-center"
              style={{ background:'#78350f', border:'2px solid #92400e' }}>
              <span className="font-black text-white" style={{ fontSize:13 }}>\u2605</span>
            </div>
            {/* Planks */}
            {round.letters.map((letter, pi) => {
              const isGap = pi === round.gapPos;
              return (
                <motion.div key={pi}
                  animate={isGap && fixed ? { scale:[1,1.2,1], backgroundColor:['#92400e','#22c55e','#92400e'] } : {}}
                  transition={{ duration:0.6 }}
                  className="flex items-center justify-center rounded-xl"
                  style={{
                    width:56, height:64, flexShrink:0,
                    background: isGap && !fixed ? 'transparent' : '#92400e',
                    border: isGap && !fixed ? '3px dashed #ef4444' : '2px solid #78350f',
                    boxShadow: !isGap || fixed ? '0 3px 0 #78350f' : undefined,
                  }}>
                  {(!isGap || fixed) && (
                    <motion.span className="font-black text-white/90" style={{ fontSize:26 }}
                      initial={isGap&&fixed ? { scale:0 } : false}
                      animate={isGap&&fixed ? { scale:1 } : {}}
                      transition={{ type:'spring', stiffness:320, damping:16 }}>
                      {isGap && fixed ? round.missing : !isGap ? letter : ''}
                    </motion.span>
                  )}
                  {isGap && !fixed && (
                    <motion.span style={{ fontSize:24 }} animate={{ opacity:[0.3,1,0.3] }} transition={{ duration:1.2, repeat:Infinity }}>
                      ❓
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
            {/* Right bank / prize */}
            <div className="w-10 h-14 rounded-t-xl flex items-center justify-center"
              style={{ background:'#78350f', border:'2px solid #92400e' }}>
              <AnimatePresence>
                {avatarAnim==='cheer'
                  ? <motion.span style={{ fontSize:22 }} initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:300 }}>\U0001F31F</motion.span>
                  : <span style={{ fontSize:22 }}>\U0001F34E</span>}
              </AnimatePresence>
            </div>
          </div>

          {/* Avatar walking on bridge */}
          <motion.div className="absolute bottom-[26%]"
            animate={{ left: avatarX === 0 ? '4%' : '84%' }}
            transition={{ duration: avatarX===1 ? 1.4 : 0, ease:'linear' }}
            style={{ zIndex:10 }}>
            <KidAvatar avatar={kidAvatar} size={44} />
          </motion.div>
        </div>

        {/* Choices */}
        {mode === 'practice' && !fixed && (
          <div className="flex gap-5 justify-center">
            {choices.map(letter => {
              const isWrong = wrongChoice === letter;
              return (
                <motion.button key={letter}
                  animate={isWrong ? { x:[-8,8,-6,6,-3,3,0] } : {}}
                  whileTap={{ scale:0.88 }}
                  onClick={() => handleTap(letter)}
                  className="w-20 h-20 rounded-2xl font-black text-4xl shadow-xl"
                  style={{
                    background: isWrong ? '#fda4af' : 'white',
                    color: isWrong ? '#be185d' : PLANK_COLOR,
                    border: `3px solid ${isWrong?'#f43f5e':PLANK_COLOR}`,
                    boxShadow:'0 5px 0 rgba(0,0,0,0.15)',
                  }}>
                  {letter}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Next button */}
        {avatarAnim === 'cheer' && (
          <motion.button initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            whileTap={{ scale:0.9 }}
            onClick={() => setRoundIdx(i => i+1)}
            className="px-8 py-3 rounded-2xl font-black text-lg text-white"
            style={{ background:PLANK_COLOR, boxShadow:`0 5px 0 #78350f` }}>
            Next Bridge \u25b6
          </motion.button>
        )}
      </div>

      {/* Avatar + bubble */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:10 }}>
        <motion.div className="w-[70px] h-[70px] shrink-0 flex items-center justify-center"
          animate={avatarAnim==='cheer'
            ? { y:[0,-24,0,-14,0,-8,0], scale:[1,1.22,0.96,1.14,0.98,1.08,1] }
            : {}}
          transition={{ duration:0.9 }}>
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`bubble-${roundIdx}-${avatarAnim}`}
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0 }} transition={{ duration:0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2">
            <button onClick={() => setIsMuted(m => !m)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:PLANK_COLOR }}>
              <Volume2 size={14} color="white" />
            </button>
            <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
