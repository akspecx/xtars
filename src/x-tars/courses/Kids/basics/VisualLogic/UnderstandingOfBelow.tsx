/**
 * UnderstandingOfBelow.tsx — Visual Logic module (ABOVE/BELOW)
 * PhotoCard design: gradient cards, no text labels, Kid/Practice mode toggle.
 */
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX } from 'lucide-react';
import { useTheme }   from '../../../../../context/ThemeContext';
import { useProfile } from '../../../../../context/ProfileContext';
import { useComparisonGame, WOOD_LIGHT, WOOD_DARK } from '../../../../kids-ui/useComparisonGame';
import PhotoCard      from '../../../../kids-ui/PhotoCard';
import KidAvatar      from '../../../CommonUtility/KidAvatar';
import TouchRipple    from '../../../../kids-ui/TouchRipple';
import ConceptSheet   from '../../../../kids-ui/ConceptSheet';
import WinScreen      from '../../../../kids-ui/WinScreen';
import StarBurst      from '../../../../kids-ui/StarBurst';
import type { GamePair, VoiceScript, AvatarMessages } from '../../../../kids-ui/types';

const PAIRS: GamePair[] = [
  { primary: { emoji: '☁️',  name: 'Cloud'   }, secondary: { emoji: '🌿', name: 'Grass'    } },
  { primary: { emoji: '🐦',  name: 'Bird'    }, secondary: { emoji: '🐞', name: 'Ladybug'  } },
  { primary: { emoji: '✈️',  name: 'Plane'   }, secondary: { emoji: '🚗', name: 'Car'      } },
  { primary: { emoji: '⭐',  name: 'Star'    }, secondary: { emoji: '🪨', name: 'Rock'     } },
  { primary: { emoji: '🎈',  name: 'Balloon' }, secondary: { emoji: '🌳', name: 'Tree'     } },
  { primary: { emoji: '🦅',  name: 'Eagle'   }, secondary: { emoji: '🐜', name: 'Ant'      } },
  { primary: { emoji: '🌙',  name: 'Moon'    }, secondary: { emoji: '🏠', name: 'House'    } },
  { primary: { emoji: '🚀',  name: 'Rocket'  }, secondary: { emoji: '⛺', name: 'Tent'     } },
];

const VOICE: VoiceScript = {
  intro:       (_p, _s, kid) => `Hi ${kid}! Find what is BELOW — down on the ground!`,
  question:    (lbl, kid)   => `${kid}, which one is ${lbl}?`,
  correct:     (name, _l, kid) => `Yes! ${name} is BELOW! Well done, ${kid}!`,
  wrong:       ()           => `Look again! Find the ABOVE one!`,
  playWrong:   ()           => `Hmm, is this the ABOVE one?`,
  playThink:   ()           => `Let me look again...`,
  playCorrect: (name)       => `Yes! ${name} is ABOVE! I'll tap it!`,
  done:        (kid)        => `Great job, ${kid}! You got them all! 🎉`,
  concept:     (_lbl, shown) => `${shown} is ABOVE! Look!`,
};

const MSG: AvatarMessages = {
  question: lbl  => `Tap the ${lbl} one!`,
  correct:  name => `${name} is BELOW! 🌿`,
  wrong:              `Look for the one on the ground! 🐞`,
};

const DEFINITION   = `BELOW means something is down low — on the ground, underground, or at the bottom! 🌿`;
const ACCENT       = '#2D6A4F';
const PRIMARY_LBL  = 'ABOVE';
const SECONDARY_LBL = 'BELOW';
const MODULE_ID    = 'below';
const TARGET       = 'secondary' as const;
const PRIMARY_GRAD   = 'linear-gradient(145deg,#d0ebff,#74c0fc,#1971c2)';
const SECONDARY_GRAD = 'linear-gradient(145deg,#c3fae8,#63e6be,#2f9e44)';

interface Props { onBack?: () => void; onNext?: () => void; }

export default function UnderstandingOfBelow({ onBack, onNext }: Props) {
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

  const bubbleText = game.phase === 'correct'
    ? MSG.correct(game.correctObj.name)
    : game.phase === 'wrong' ? MSG.wrong : MSG.question(game.askLabel);

  const DOTS = game.sessionPairs.slice(0, 8);

  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #c7e9fb 0%, #89cef7 30%, #56aee0 60%, #3090c7 100%)' }}
    >
      {/* Light-ray overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[20, 50, 75].map((left, i) => (
          <div key={i}
            className="absolute top-0 w-[2px] opacity-10"
            style={{
              left: `${left}%`,
              height: '55%',
              background: 'linear-gradient(to bottom, white, transparent)',
              transform: `rotate(${(i - 1) * 7}deg)`,
              transformOrigin: 'top',
            }}
          />
        ))}
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────── */}
      <div
        className="flex-none flex flex-col items-center px-5"
        style={{ paddingTop: 'env(safe-area-inset-top, 16px)', paddingBottom: 8 }}
      >
        {/* Close + mute + mode toggle row */}
        <div className="w-full flex items-center justify-between gap-2 mb-2">
          {/* Mode toggle */}
          <button
            onClick={() => game.switchMode(game.mode === 'play' ? 'practice' : 'play')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black"
            style={{
              background: game.mode === 'practice' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
              color: '#1a3c28',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span>{game.mode === 'practice' ? '✏️ Practice' : '🤖 Kid Mode'}</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => game.setIsMuted(!game.isMuted)}
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
              {game.isMuted ? <VolumeX size={20} color="#1a3c28" /> : <Volume2 size={20} color="#1a3c28" />}
            </button>
            {(onBack || onNext) && (
              <button
                onClick={() => { if (onBack) onBack(); }}
                className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md"
              >
                <X size={22} color="#1a3c28" strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        {/* Centred title */}
        <h1
          className="font-black text-center leading-tight"
          style={{ fontSize: 28, color: '#1a3c28', letterSpacing: 1.5, textTransform: 'uppercase' }}
        >
          {PRIMARY_LBL} OR {SECONDARY_LBL}?
        </h1>

        {/* Progress dots */}
        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-[6px] bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm">
            {DOTS.map((_, i) => {
              const done    = i < game.pairIdx;
              const current = i === game.pairIdx;
              const bg = done ? '#2d6a4f' : current ? '#f4c842' : 'rgba(255,255,255,0.5)';
              return (
                <motion.div key={i}
                  animate={{ scale: current ? 1.25 : 1 }}
                  className="rounded-full"
                  style={{ width: current ? 14 : 10, height: current ? 14 : 10, background: bg, border: '1.5px solid rgba(255,255,255,0.6)' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Cards ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-5 min-h-0">
        <motion.div
          key={`cards-${game.pairIdx}`}
          className="flex items-end justify-center gap-5 w-full"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 24 }}
        >
          {(['left', 'right'] as const).map(side => {
            const obj       = side === 'left' ? game.leftSide  : game.rightSide;
            const isPrimary = side === 'left'
              ? game.leftSide === game.pair.primary
              : game.rightSide === game.pair.primary;
            return (
              <PhotoCard
                key={side}
                side={obj}
                isPrimary={isPrimary}
                isTarget={side === game.correctSide}
                isSelected={game.selected === side ? true : null}
                phase={game.phase}
                primaryGrad={PRIMARY_GRAD}
                secondaryGrad={SECONDARY_GRAD}
                cardRef={side === 'left' ? game.leftRef : game.rightRef}
                onClick={
                  game.mode === 'practice' && game.phase === 'question'
                    ? () => game.handleAnswer(side)
                    : undefined
                }
              />
            );
          })}
        </motion.div>
      </div>

      {/* ── Mascot + speech bubble ────────────────────────────────── */}
      <div
        className="flex-none flex items-end gap-3 px-4"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden shadow-lg shrink-0 bg-teal-700 flex items-center justify-center">
          <KidAvatar avatar={kidAvatar} size={70} />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`bubble-${game.pairIdx}-${game.phase}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center gap-2 bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md mb-3"
          >
            <button
              onClick={() => game.setIsMuted(!game.isMuted)}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: '#40b0aa' }}
            >
              <Volume2 size={16} color="white" />
            </button>
            <p className="font-black text-base text-gray-800 leading-snug">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Touch ripple */}
      <AnimatePresence>{game.pointer && <TouchRipple x={game.pointer.x} y={game.pointer.y} />}</AnimatePresence>

      {/* Concept sheet */}
      <AnimatePresence>
        {game.showConcept && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/30 backdrop-blur-sm"
              onClick={game.onConceptDone} />
            <ConceptSheet
              pair={game.pair}
              askPrimary={game.resolvedAskPrimary}
              primaryLabel={PRIMARY_LBL}
              secondaryLabel={SECONDARY_LBL}
              definition={DEFINITION}
              autoAdvance={game.mode === 'play'}
              theme={theme}
              onDone={game.onConceptDone}
            />
          </>
        )}
      </AnimatePresence>

      {/* ? hint button */}
      <motion.button
        whileTap={{ scale: 0.86 }}
        onClick={() => game.setShowConcept(true)}
        className="fixed right-5 bottom-28 z-[100] w-12 h-12 rounded-full flex items-center justify-center shadow-lg text-white font-black text-xl"
        style={{ background: '#FBBF24' }}
      >?</motion.button>

      {/* Win screen */}
      <AnimatePresence>
        {game.done && (
          <WinScreen
            avatar={kidAvatar} name={kidName} score={game.score}
            total={game.sessionPairs.length} accent={ACCENT}
            onDone={() => { if (onNext) { onNext(); return; } if (onBack) { onBack(); return; } game.replay(); }}
            onReplay={game.replay}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
