/**
 * BuildingBlocksModule.tsx — "Building Blocks"
 * Tap a block to select it, tap the correct pedestal to place it.
 * Teaches A→B→C order. Kid mode: auto-places. Practice: user places.
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA } from '../alphabetData';

// The current set of 3 letters to order — starts at A,B,C then advances
const ROUND_SIZE = 3;

function getRoundLetters(roundIdx: number) {
  const start = (roundIdx * ROUND_SIZE) % 24; // wrap so we don't go past Z
  return ALPHABET_DATA.slice(start, start + ROUND_SIZE).map(d => d.letter);
}

function scatterOrder(letters: string[]) {
  const arr = [...letters];
  // ensure it's actually shuffled (at least one out of place)
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  if (arr[0] === letters[0] && arr[1] === letters[1]) [arr[0], arr[1]] = [arr[1], arr[0]];
  return arr;
}

const PEDESTAL_COLORS = ['#e11d48', '#2563eb', '#059669'];

export default function BuildingBlocksModule() {
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
  const [letters, setLetters] = useState<string[]>([]);      // the correct order
  const [blocks, setBlocks] = useState<string[]>([]);         // scattered at bottom
  const [placed, setPlaced] = useState<(string|null)[]>([null,null,null]);
  const [selected, setSelected] = useState<string | null>(null);
  const [wrongPedestal, setWrongPedestal] = useState<number | null>(null);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [hintPedestal, setHintPedestal] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const [avatarAnim, setAvatarAnim] = useState<'idle'|'clap'|'wrong'>('idle');

  const { speak } = useSpeech(isMuted);

  const init = useCallback(() => {
    const ls = getRoundLetters(roundIdx);
    setLetters(ls);
    setBlocks(scatterOrder(ls));
    setPlaced([null, null, null]);
    setSelected(null);
    setWrongPedestal(null);
    setWrongAttempts(0);
    setHintPedestal(null);
    setComplete(false);
    setAvatarAnim('idle');
    setTimeout(() => speak(
      mode === 'play'
        ? `Let's order ${ls.join(', ')}! Watch!`
        : `Can you find ${ls[0]}? Tap ${ls[0]} then tap the first pedestal!`
    ), 350);
  }, [roundIdx, mode, speak]);

  useEffect(() => { init(); }, [roundIdx, mode]);

  // Kid mode: auto-place blocks one by one
  useEffect(() => {
    if (mode !== 'play' || complete || letters.length === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    letters.forEach((letter, i) => {
      timers.push(setTimeout(() => {
        setPlaced(prev => { const n = [...prev]; n[i] = letter; return n; });
        setBlocks(prev => prev.filter(b => b !== letter));
        setAvatarAnim('clap');
        speak(`${letter}!`);
        setTimeout(() => setAvatarAnim('idle'), 600);
        if (i === letters.length - 1) {
          setTimeout(() => {
            setComplete(true);
            speak(`${letters.join(', ')}! Great order!`);
          }, 1200);
        }
      }, 1500 + i * 2000));
    });
    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, letters, complete]);

  const tapBlock = useCallback((letter: string) => {
    if (mode !== 'practice') return;
    setSelected(s => s === letter ? null : letter);
  }, [mode]);

  const tapPedestal = useCallback((pedestalIdx: number) => {
    if (mode !== 'practice' || !selected || placed[pedestalIdx]) return;
    const isCorrect = letters[pedestalIdx] === selected;
    if (isCorrect) {
      setPlaced(prev => { const n=[...prev]; n[pedestalIdx]=selected; return n; });
      setBlocks(prev => prev.filter(b => b !== selected));
      setSelected(null);
      setAvatarAnim('clap');
      speak(`${selected}! Correct!`);
      setTimeout(() => setAvatarAnim('idle'), 700);
      const newPlaced = placed.map((p,i) => i===pedestalIdx ? selected : p);
      if (newPlaced.every(Boolean)) {
        setTimeout(() => { setComplete(true); speak(`${letters.join(', ')}! Great job!`); }, 900);
      }
    } else {
      setWrongPedestal(pedestalIdx);
      setAvatarAnim('wrong');
      const attempts = wrongAttempts + 1;
      setWrongAttempts(attempts);
      speak(`Hmm, not there! Find ${letters[pedestalIdx]}!`);
      setTimeout(() => { setWrongPedestal(null); setAvatarAnim('idle'); }, 700);
      if (attempts >= 2) {
        // hint: pulse the correct pedestal for the selected block
        const correctIdx = letters.indexOf(selected);
        if (correctIdx !== -1) setHintPedestal(correctIdx);
      }
    }
  }, [mode, selected, placed, letters, wrongAttempts, speak]);

  const unplacedBlocks = blocks.filter(b => !placed.includes(b));

  const bubbleText = complete
    ? `${letters.join(' → ')}! Well done! 🎉`
    : selected
    ? `Now tap the right pedestal for ${selected}!`
    : mode === 'play'
    ? `Watch! Let’s put ${letters.join(', ')} in order! 👀`
    : `Tap a block to pick it up! 📦`;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background:'linear-gradient(160deg,#fef9c3,#fef08a,#fde047)' }}>

      {/* Top bar */}
      <div className="flex-none flex items-center justify-between px-4"
        style={{ paddingTop:'env(safe-area-inset-top,16px)', paddingBottom:8, zIndex:10 }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setMode(m => m==='play'?'practice':'play')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background:mode==='practice'?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)', color:'#854d0e', backdropFilter:'blur(6px)' }}>
            {mode==='practice' ? '✏️ Practice' : '🤖 Kid Mode'}
          </button>
          <h1 className="font-black text-base" style={{ color:'#854d0e' }}>Building Blocks</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center">
            {isMuted ? <VolumeX size={18} color="#854d0e" /> : <Volume2 size={18} color="#854d0e" />}
          </button>
          <button onClick={() => navigate('/games/alphabets')} className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <X size={22} color="#854d0e" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Pedestals */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <p className="font-black text-sm" style={{ color:'#854d0e', opacity:0.7 }}>Put the letters in order!</p>
        <div className="flex justify-center gap-5">
          {[0,1,2].map(i => {
            const letter = placed[i];
            const correctLetter = letters[i];
            const isHint = hintPedestal === i;
            const isWrong = wrongPedestal === i;
            return (
              <motion.div key={i}
                animate={isWrong ? { x:[-8,8,-6,6,-3,3,0] } : isHint ? { scale:[1,1.08,1,1.08,1] } : {}}
                transition={isWrong ? { duration:0.5 } : isHint ? { duration:1.4, repeat:Infinity } : {}}
                onClick={() => tapPedestal(i)}
                style={{
                  width:72, height:80, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'flex-end', cursor:'pointer',
                }}>
                {/* Pedestal */}
                <div className="flex items-center justify-center rounded-2xl relative"
                  style={{
                    width:72, height:72,
                    background: letter ? `${PEDESTAL_COLORS[i]}22` : 'rgba(255,255,255,0.55)',
                    border: `3px ${letter ? 'solid' : 'dashed'} ${PEDESTAL_COLORS[i]}`,
                    boxShadow: isHint ? `0 0 18px 4px ${PEDESTAL_COLORS[i]}99` : undefined,
                  }}>
                  {letter ? (
                    <motion.div className="flex flex-col items-center"
                      initial={{ scale:0 }} animate={{ scale:1 }}
                      transition={{ type:'spring', stiffness:320, damping:16 }}>
                      <span className="font-black" style={{ fontSize:34, color:PEDESTAL_COLORS[i] }}>{letter}</span>
                      <span style={{ fontSize:18 }}>{ALPHABET_DATA.find(d=>d.letter===letter)?.examples[0].emoji}</span>
                    </motion.div>
                  ) : (
                    <span className="font-black" style={{ fontSize:22, color:PEDESTAL_COLORS[i], opacity:0.35 }}>{correctLetter}</span>
                  )}
                </div>
                <div className="w-10 h-2 rounded-full mt-1" style={{ background:PEDESTAL_COLORS[i] }} />
              </motion.div>
            );
          })}
        </div>

        {/* Blocks at bottom */}
        <div className="flex gap-4 justify-center flex-wrap mt-4">
          {unplacedBlocks.map(letter => {
            const d = ALPHABET_DATA.find(dd => dd.letter === letter)!;
            const isSel = selected === letter;
            return (
              <motion.button key={letter}
                whileTap={{ scale:0.86 }}
                animate={isSel ? { y:[0,-8,0], scale:[1,1.12,1] } : {}}
                transition={isSel ? { duration:0.8, repeat:Infinity } : {}}
                onClick={() => tapBlock(letter)}
                className="flex flex-col items-center justify-center rounded-2xl shadow-xl"
                style={{
                  width:70, height:70,
                  background: isSel ? d.color : '#fff',
                  border: `3px solid ${isSel ? d.color : '#e2e8f0'}`,
                  boxShadow: isSel ? `0 6px 0 ${d.color}88, 0 0 20px ${d.color}55` : '0 4px 0 #cbd5e1',
                }}>
                <span className="font-black" style={{ fontSize:28, color:isSel?'#fff':d.color }}>{letter}</span>
                <span style={{ fontSize:22 }}>{d.examples[0].emoji}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Avatar */}
      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:10 }}>
        <motion.div className="w-[70px] h-[70px] shrink-0 flex items-center justify-center"
          animate={avatarAnim==='clap'
            ? { y:[0,-22,0,-12,0], scale:[1,1.18,1,1.08,1], rotate:[0,8,-8,4,0] }
            : avatarAnim==='wrong'
            ? { x:[0,-10,10,-8,8,-4,4,0] }
            : { y:0, x:0 }}
          transition={{ duration:0.6 }}>
          <KidAvatar avatar={kidAvatar} size={68} />
        </motion.div>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-2">
          <button onClick={() => setIsMuted(m => !m)} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background:'#854d0e' }}>
            <Volume2 size={14} color="white" />
          </button>
          <p className="font-black text-sm text-gray-800 leading-snug">{bubbleText}</p>
        </div>
      </div>

      {/* Complete overlay */}
      <AnimatePresence>
        {complete && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5 z-30"
            style={{ background:'rgba(133,77,14,0.85)' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.span style={{ fontSize:88 }}
              animate={{ scale:[0.8,1.3,1], rotate:[-12,12,0] }}
              transition={{ type:'spring', stiffness:260, damping:16 }}>🎉</motion.span>
            <p className="font-black text-white text-2xl">{letters.join(' → ')} done!</p>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => setRoundIdx(i => i+1)}
                className="px-6 py-3 rounded-2xl font-black text-lg text-white"
                style={{ background:'#f59e0b', boxShadow:'0 4px 0 #d97706' }}>
                Next ▶
              </motion.button>
              <motion.button whileTap={{ scale:0.9 }}
                onClick={() => navigate('/games/alphabets')}
                className="px-6 py-3 rounded-2xl font-black text-amber-900"
                style={{ background:'rgba(255,255,255,0.9)' }}>
                Menu
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
