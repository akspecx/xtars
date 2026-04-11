/**
 * LetterQuizModule.tsx — “A for?”
 * Shows the 3 example objects one by one (auto), then avatar asks
 * “Which letter do they all start with?” — 4 letter choice buttons.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProfile } from '../../../../../../context/ProfileContext';
import KidAvatar from '../../../../CommonUtility/KidAvatar';
import { useSpeech } from '../../../../../kids-ui/useSpeech';
import { ALPHABET_DATA, LETTER_MAP } from '../alphabetData';

type Stage = 0 | 1 | 2 | 3;
type AvatarAnim = 'idle' | 'clap' | 'wrong';

export default function LetterQuizModule() {
  const navigate = useNavigate();
  const { letter = 'A' } = useParams<{ letter: string }>();
  const { activeProfile, availableProfiles } = useProfile() as any;

  const data = useMemo(() => LETTER_MAP.get(letter.toUpperCase()) ?? ALPHABET_DATA[0], [letter]);

  const kidAvatar = useMemo(() => {
    if (activeProfile?.avatar) return activeProfile.avatar;
    try { const id = JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.id;
      const hit = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return hit?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const [isMuted,       setIsMuted]       = useState(false);
  const [stage,         setStage]         = useState<Stage>(0);
  const [letterGuessed, setLetterGuessed] = useState<string | null>(null);
  const [avatarAnim,    setAvatarAnim]    = useState<AvatarAnim>('idle');

  const { speak } = useSpeech(isMuted);
  const letterIdx  = ALPHABET_DATA.findIndex(d => d.letter === data.letter);
  const nextLetter = ALPHABET_DATA[letterIdx + 1]?.letter ?? null;

  const letterChoices = useMemo(() => {
    const pool = ALPHABET_DATA.filter(d => d.letter !== data.letter);
    const picks: string[] = [];
    const step = Math.max(1, Math.floor(pool.length / 3));
    for (let i = 0; picks.length < 3 && i < pool.length; i += step) picks.push(pool[i].letter);
    while (picks.length < 3) picks.push(pool[picks.length].letter);
    return [...picks, data.letter].sort((a, b) => a.localeCompare(b));
  }, [data.letter]);

  useEffect(() => { setStage(0); setLetterGuessed(null); setAvatarAnim('idle'); }, [letter]);

  // Auto-advance stages 0-2
  useEffect(() => {
    if (stage >= 3) return;
    const t = setTimeout(() => setStage(s => (s + 1) as Stage), 2800);
    return () => clearTimeout(t);
  }, [stage, letter]);

  // Speech
  useEffect(() => {
    if (stage < 3) {
      const obj = data.examples[stage as 0|1|2];
      const t = setTimeout(() => speak(`${data.phoneme}... ${obj.word}! ${data.uppercase} is for ${obj.word}!`), 350);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => speak(`${data.examples.map(e => e.word).join(', ')}! Which letter do they all start with?`), 400);
      return () => clearTimeout(t);
    }
  }, [stage, letter]);

  useEffect(() => { if (avatarAnim === 'idle') return; const t = setTimeout(() => setAvatarAnim('idle'), 1200); return () => clearTimeout(t); }, [avatarAnim]);

  const bubbleText = useMemo(() => {
    if (stage < 3) {
      const obj = data.examples[stage as 0|1|2];
      return `${data.phoneme}… ${obj.word}! ${data.uppercase} is for ${obj.word}! 👀`;
    }
    if (letterGuessed === data.letter) return `Yes!! ${data.letter}! All start with ${data.letter}! 🎉`;
    if (letterGuessed) return `Oops! Try again! Listen: ${data.phoneme}… which letter?`;
    return `${data.examples.map(e => e.word).join(', ')}… which letter? 🤔`;
  }, [stage, letterGuessed, data]);

  const currentObj = stage < 3 ? data.examples[stage as 0|1|2] : data.examples[0];

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden" style={{ background: data.bg }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[18,50,76].map((left,i) => (
          <div key={i} className="absolute top-0 w-[2px] opacity-10"
            style={{ left:`${left}%`, height:'55%', background:'linear-gradient(to bottom,white,transparent)',
              transform:`rotate(${(i-1)*7}deg)`, transformOrigin:'top' }} />
        ))}
      </div>
      <div className="flex-none flex flex-col items-center px-5"
        style={{ paddingTop: 'env(safe-area-inset-top,16px)', paddingBottom: 8, zIndex: 10 }}>
        <div className="w-full flex items-center justify-between gap-2 mb-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-black"
            style={{ background: 'rgba(255,255,255,0.6)', color: data.color, backdropFilter: 'blur(6px)' }}>
            🤔 A for?
          </span>
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
        <h1 className="font-black text-center" style={{ fontSize: 24, color: data.color, letterSpacing: 1.5 }}>
          {data.uppercase} for?
        </h1>
        <div className="flex items-center gap-[6px] bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm mt-2">
          {[0,1,2,3].map(i => {
            const done=i<stage, cur=i===stage;
            return <motion.div key={i} animate={{ scale: cur ? 1.25 : 1 }} className="rounded-full"
              style={{ width:cur?14:10, height:cur?14:10,
                background: done?data.color:cur?'#fbbf24':'rgba(255,255,255,0.5)',
                border: '1.5px solid rgba(255,255,255,0.6)' }} />;
          })}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 min-h-0">
        <AnimatePresence mode="wait">
          {stage < 3 && (
            <motion.div key={`obj-${stage}`} className="flex flex-col items-center gap-4 w-full"
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.28 }}>
              <p className="font-black" style={{ color: `${data.color}cc`, fontSize: 15 }}>{stage+1} of 3</p>
              <div className="flex flex-col items-center justify-center rounded-3xl shadow-2xl"
                style={{ width:'75%', maxWidth:300, aspectRatio:'1', background:data.bg, border:`5px solid ${data.color}` }}>
                <motion.span animate={{ y:[0,-16,0], scale:[1,1.1,1] }}
                  transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }} style={{ fontSize:96, lineHeight:1 }}>
                  {currentObj.emoji}
                </motion.span>
                <p className="font-black mt-3" style={{ fontSize:30, color:data.color }}>
                  <span style={{ fontSize:38 }}>{currentObj.word[0]}</span>{currentObj.word.slice(1)}
                </p>
              </div>
            </motion.div>
          )}
          {stage === 3 && (
            <motion.div key="quiz" className="flex flex-col items-center gap-4 w-full"
              initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0 }} transition={{ type:'spring', stiffness:280, damping:22 }}>
              <div className="flex justify-center gap-3">
                {data.examples.map((ex,i) => (
                  <motion.div key={i} initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                    transition={{ delay:i*0.3, type:'spring', stiffness:280, damping:18 }}
                    className="flex flex-col items-center gap-1 rounded-2xl px-3 py-3 shadow-lg"
                    style={{ background:'rgba(255,255,255,0.78)', border:`2.5px solid ${data.color}55`, minWidth:80 }}>
                    <span style={{ fontSize:46 }}>{ex.emoji}</span>
                    <p className="font-black text-center" style={{ fontSize:13, color:data.color }}>{ex.word}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity:0,y:16 }} animate={{ opacity:1,y:0 }} transition={{ delay:1.1 }}
                className="flex gap-3 justify-center flex-wrap">
                {letterChoices.map(ch => {
                  const isCorrect   = ch === data.letter;
                  const guessedThis = letterGuessed === ch;
                  const isWrong     = guessedThis && !isCorrect;
                  const showGreen   = (guessedThis && isCorrect) || (!!(letterGuessed && letterGuessed !== data.letter) && isCorrect);
                  return (
                    <motion.button key={ch} disabled={!!letterGuessed}
                      animate={isWrong ? { x:[-10,10,-8,8,-4,4,0] } : {}}
                      transition={isWrong ? { duration:0.45 } : {}}
                      whileTap={!letterGuessed ? { scale:0.88 } : {}}
                      onClick={() => {
                        if (letterGuessed) return;
                        setLetterGuessed(ch);
                        if (isCorrect) {
                          setAvatarAnim('clap');
                          speak(`Yes! ${data.letter}! ${data.examples.map(e=>e.word).join(', ')} all start with ${data.letter}! Amazing!`);
                          if (nextLetter) setTimeout(() => navigate(`/games/alphabets/letter-quiz/${nextLetter}`), 2800);
                        } else {
                          setAvatarAnim('wrong');
                          speak(`Oops! Try again! Listen: ${data.phoneme}...`);
                          setTimeout(() => setLetterGuessed(null), 1800);
                        }
                      }}
                      className="w-16 h-16 rounded-2xl font-black text-3xl shadow-xl flex items-center justify-center"
                      style={{ background: showGreen?'#b9f474':isWrong?'#ffd6e0':'rgba(255,255,255,0.92)',
                        color: showGreen?'#1a6600':isWrong?'#be185d':data.color,
                        border: `3px solid ${showGreen?'#7ec84a':isWrong?'#fda4af':data.color}` }}
                    >{ch}</motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom:'env(safe-area-inset-bottom,16px)', zIndex:10 }}>
        <motion.div className="w-[80px] h-[80px] shrink-0 flex items-center justify-center"
          animate={avatarAnim==='clap' ? {y:[0,-22,0,-12,0],scale:[1,1.18,1,1.08,1],rotate:[0,8,-8,4,0]}
            : avatarAnim==='wrong' ? {x:[0,-10,10,-8,8,-4,4,0],rotate:[0,-6,6,-4,4,0]}
            : {y:0,x:0,rotate:0,scale:1}}
          transition={{ duration: avatarAnim==='clap'?0.7:0.5 }}>
          <KidAvatar avatar={kidAvatar} size={78} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={`bubble-${stage}-${letterGuessed}`}
            initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }}
            exit={{ opacity:0,x:10 }} transition={{ duration:0.2 }}
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
