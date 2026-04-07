/**
 * UnderstandingOfShort.tsx
 * All pairs, voice, and rendering live here.
 * Uses useComparisonGame + wooden dark/light theme.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, VolumeX, Play, MousePointer2, Check } from 'lucide-react';
import { useTheme }   from '../../../../../context/ThemeContext';
import { useProfile } from '../../../../../context/ProfileContext';
import { useComparisonGame, WOOD_LIGHT, WOOD_DARK } from '../../../../kids-ui/useComparisonGame';
import WoodCard     from '../../../../kids-ui/WoodCard';
import AvatarBubble from '../../../../kids-ui/AvatarBubble';
import TouchRipple  from '../../../../kids-ui/TouchRipple';
import ConceptSheet from '../../../../kids-ui/ConceptSheet';
import WinScreen    from '../../../../kids-ui/WinScreen';
import type { GamePair, VoiceScript, AvatarMessages } from '../../../../kids-ui/types';

const PAIRS: GamePair[] = [
  { primary: { emoji: '🦒', name: 'Giraffe'    }, secondary: { emoji: '🐢', name: 'Turtle'   } },
  { primary: { emoji: '🌲', name: 'Pine Tree'  }, secondary: { emoji: '🌱', name: 'Sprout'   } },
  { primary: { emoji: '🏢', name: 'Skyscraper' }, secondary: { emoji: '🏠', name: 'House'    } },
  { primary: { emoji: '🗼', name: 'Tower'       }, secondary: { emoji: '⛺', name: 'Tent'     } },
  { primary: { emoji: '🌵', name: 'Cactus'     }, secondary: { emoji: '🌸', name: 'Flower'   } },
  { primary: { emoji: '🚀', name: 'Rocket'     }, secondary: { emoji: '📦', name: 'Box'      } },
  { primary: { emoji: '🪜', name: 'Ladder'     }, secondary: { emoji: '🎈', name: 'Balloon'  } },
  { primary: { emoji: '🌴', name: 'Palm Tree'  }, secondary: { emoji: '🍄', name: 'Mushroom' } },
  { primary: { emoji: '🏛️', name: 'Temple'     }, secondary: { emoji: '🪴', name: 'Pot Plant'} },
  { primary: { emoji: '🗽', name: 'Statue'     }, secondary: { emoji: '🐞', name: 'Ladybug'  } },
  { primary: { emoji: '🎋', name: 'Bamboo'     }, secondary: { emoji: '🌺', name: 'Hibiscus' } },
];

const VOICE: VoiceScript = {
  intro:       (_p, _s, kid) => `Hi ${kid}! Find the SHORT one!`,
  question:    (lbl, kid)   => `${kid}, tap the ${lbl} one!`,
  correct:     (name, _l, kid) => `Yes! ${name} is SHORT! Well done, ${kid}!`,
  wrong:       ()           => `Find the shorter one!`,
  playWrong:   ()           => `Hmm, this one looks short… let me check!`,
  playThink:   ()           => `Which one is closer to the ground?`,
  playCorrect: (name)       => `${name} is SHORT! I'll tap it!`,
  done:        (kid)        => `${kid}, you know what SHORT is now!`,
  concept:     (lbl, shown) => `${shown} is ${lbl}! It doesn't reach very high!`,
};

const MSG: AvatarMessages = {
  question: lbl  => `Find the ${lbl} one!`,
  correct:  name => `${name} is SHORT! 🌱`,
  wrong:              `Look for the shorter one! 🐢`,
};

const ACCENT        = '#5C3D1E';
const PRIMARY_LBL   = 'TALL';
const SECONDARY_LBL = 'SHORT';
const HEADER_ICON   = '🌱';
const SCALE_MODE    = 'height' as const;
const MODULE_ID     = 'short';
const TARGET        = 'secondary' as const;

interface Props { onBack?: () => void; onNext?: () => void; }

export default function UnderstandingOfShort({ onBack, onNext }: Props) {
  const { theme: colorMode } = useTheme();
  const theme = colorMode === 'dark' ? WOOD_DARK : WOOD_LIGHT;

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
      const fromList = id ? availableProfiles?.find((p: any) => p.id === id) : null;
      return fromList?.avatar ?? JSON.parse(localStorage.getItem('xtars_active_profile') || 'null')?.avatar ?? 'bird';
    } catch { return 'bird'; }
  }, [activeProfile, availableProfiles]);

  const game = useComparisonGame({
    moduleId: MODULE_ID, target: TARGET,
    primaryLabel: PRIMARY_LBL, secondaryLabel: SECONDARY_LBL,
    pairs: PAIRS, voice: VOICE, kidName,
  });

  const [modeOpen, setModeOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setModeOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const bubbleText = game.phase === 'correct'
    ? MSG.correct(game.correctObj.name)
    : game.phase === 'wrong' ? MSG.wrong : MSG.question(game.askLabel);
  const bubbleHighlight = game.phase === 'question' ? game.askLabel : undefined;

  return (
    <div className="flex flex-col h-screen select-none overflow-hidden" style={{ background: theme.pageBg }}>
      <div className="flex items-center gap-3 px-4 flex-none"
        style={{ background: ACCENT, paddingTop: 'env(safe-area-inset-top, 14px)', paddingBottom: 12 }}>
        {onBack && (
          <motion.button whileTap={{ scale: 0.85 }} onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white flex-none">
            <ChevronLeft size={20} strokeWidth={3} />
          </motion.button>
        )}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-white/25 border-[3px] border-white/35 flex items-center justify-center flex-none shadow">
            <span className="text-2xl leading-none">{HEADER_ICON}</span>
          </div>
          <p className="text-white font-black text-lg leading-tight truncate">
            {game.resolvedAskPrimary ? PRIMARY_LBL : SECONDARY_LBL}
          </p>
        </div>
        <div className="relative flex-none" ref={dropRef}>
          <button onClick={() => setModeOpen(o => !o)}
            className="w-11 h-11 rounded-full flex items-center justify-center shadow-md bg-black/25">
            <span className="text-white text-[9px] font-black tracking-widest uppercase leading-none">
              {game.mode === 'play' ? 'PLAY' : 'PRAC'}
            </span>
          </button>
          <AnimatePresence>
            {modeOpen && (
              <motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.95 }} transition={{ duration: 0.14 }}
                className="absolute right-0 top-full mt-2 rounded-2xl shadow-xl overflow-hidden z-[200] w-44"
                style={{ background: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                {(['play', 'practice'] as const).map(opt => (
                  <button key={opt} onClick={() => { game.switchMode(opt); setModeOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left"
                    style={{ background: game.mode === opt ? theme.areaRing + '55' : 'transparent' }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-none" style={{ background: theme.areaRing }}>
                      {opt === 'play' ? <Play size={11} fill={ACCENT} style={{ color: ACCENT }} /> : <MousePointer2 size={11} style={{ color: '#10B981' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black truncate" style={{ color: theme.text }}>{opt === 'play' ? 'Play Mode' : 'Practice'}</p>
                      <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>{opt === 'play' ? 'Watch & learn' : 'Your turn!'}</p>
                    </div>
                    {game.mode === opt && <Check size={11} style={{ color: '#10B981' }} />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button onClick={() => game.setIsMuted(!game.isMuted)}
          className="w-11 h-11 flex items-center justify-center rounded-xl flex-none bg-white/20">
          {game.isMuted ? <VolumeX size={20} className="text-white/60" /> : <Volume2 size={20} className="text-white" />}
        </button>
      </div>
      <div className="flex-none pt-3 pb-2 px-4 text-center">
        <motion.h1 key={`t-${game.pairIdx}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black uppercase tracking-wide" style={{ color: ACCENT }}>
          Tap the {game.askLabel} one
        </motion.h1>
        <div className="flex gap-2 justify-center mt-2">
          {game.sessionPairs.map((_, i) => (
            <motion.div key={i} animate={{ scale: i === game.pairIdx ? 1.25 : 1 }}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: i < game.pairIdx ? '#22C55E' : i === game.pairIdx ? ACCENT : theme.dot }} />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center mx-4 mt-1 mb-3 rounded-3xl min-h-0"
        style={{ background: theme.areaBg, border: `2px solid ${theme.areaRing}` }}>
        <motion.div key={`cards-${game.pairIdx}`}
          className="flex items-center justify-center gap-6 sm:gap-12 w-full px-4"
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 340, damping: 26 }}>
          {(['left', 'right'] as const).map(side => (
            <WoodCard key={side}
              side={side === 'left' ? game.leftSide : game.rightSide}
              isPrimary={side === 'left' ? game.leftSide === game.pair.primary : game.rightSide === game.pair.primary}
              isTarget={side === game.correctSide}
              isSelected={game.selected === side ? true : null}
              phase={game.phase} scaleMode={SCALE_MODE} theme={theme}
              onClick={game.mode === 'practice' && game.phase === 'question' ? () => game.handleAnswer(side) : undefined}
              cardRef={side === 'left' ? game.leftRef : game.rightRef}
            />
          ))}
        </motion.div>
      </div>
      <div className="flex-none px-4 pt-2 pb-4" style={{ background: theme.pageBg }}>
        <AnimatePresence mode="wait">
          <AvatarBubble key={`bubble-${game.pairIdx}-${game.phase}`}
            avatar={kidAvatar} text={bubbleText} highlight={bubbleHighlight}
            celebrating={game.celebrating} theme={theme} />
        </AnimatePresence>
      </div>
      <motion.button whileTap={{ scale: 0.86 }} onClick={() => game.setShowConcept(true)}
        className="fixed right-5 bottom-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white font-black text-xl"
        style={{ background: '#FBBF24' }}>?</motion.button>
      <AnimatePresence>{game.pointer && <TouchRipple x={game.pointer.x} y={game.pointer.y} />}</AnimatePresence>
      <AnimatePresence>
        {game.showConcept && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm" onClick={game.onConceptDone} />
            <ConceptSheet pair={game.pair} askPrimary={game.resolvedAskPrimary}
              primaryLabel={PRIMARY_LBL} secondaryLabel={SECONDARY_LBL}
              autoAdvance={game.mode === 'play'} theme={theme} onDone={game.onConceptDone} />
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {game.done && (
          <WinScreen avatar={kidAvatar} name={kidName} score={game.score}
            total={game.sessionPairs.length} accent={ACCENT}
            onDone={() => { if (onNext) { onNext(); return; } if (onBack) { onBack(); return; } game.replay(); }}
            onReplay={game.replay} />
        )}
      </AnimatePresence>
    </div>
  );
}
