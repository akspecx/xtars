/**
 * kids-ui/WoodCard.tsx
 * Comparison card with wooden-parchment theme.
 * Wooden brown idle border, green on correct, peach-rose on wrong.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarBurst from './StarBurst';
import { WOOD_LIGHT, type WoodTheme } from './useComparisonGame';

// Legacy export for GameRenderer compatibility
export const WOOD = WOOD_LIGHT;

type Phase = 'question' | 'correct' | 'wrong';

interface Props {
  side:        { emoji: string; name: string };
  isPrimary:   boolean;
  isSelected:  boolean | null;
  isTarget:    boolean;
  phase:       Phase;
  scaleMode:   'size' | 'height';
  theme?:      WoodTheme;
  onClick?:    () => void;
  cardRef?:    React.RefObject<HTMLButtonElement>;
}

const WoodCard: React.FC<Props> = ({
  side, isPrimary, isSelected, isTarget, phase, scaleMode, theme, onClick, cardRef,
}) => {
  const t = theme ?? WOOD_LIGHT;
  const isAnswered = phase === 'correct' || phase === 'wrong';
  const isWrong    = isAnswered && isSelected === true && !isTarget && phase === 'wrong';
  const isRight    = isAnswered && isTarget && phase === 'correct';

  const bg = isRight ? '#F1FCEF' : isWrong ? '#FFF1F0' : t.cardBg;
  const border = isRight ? '#22C55E' : isWrong ? '#FCA5A5' : t.cardBorder;

  const emojiSize = (() => {
    if (scaleMode === 'size')
      return isPrimary ? 'text-[110px] sm:text-[128px]' : 'text-[62px] sm:text-[74px]';
    return 'text-[88px] sm:text-[102px]';
  })();

  const scaleY = scaleMode === 'height' ? (isPrimary ? 1.55 : 0.82) : undefined;

  return (
    <div className="flex flex-col items-center gap-3 relative">
      {isRight && <StarBurst />}

      <motion.button
        ref={cardRef}
        onClick={onClick}
        disabled={isAnswered || !onClick}
        animate={isWrong ? { x: [-8, 8, -6, 6, -4, 4, 0] } : { scale: 1 }}
        transition={{ duration: 0.42 }}
        whileTap={!isAnswered && onClick ? { scale: 0.92 } : {}}
        className="relative flex items-center justify-center rounded-3xl border-[3px] overflow-hidden
                   w-[145px] h-[184px] sm:w-[170px] sm:h-[210px]
                   shadow-[0_4px_20px_rgba(107,63,42,0.12)] transition-all duration-300"
        style={{ background: bg, borderColor: border }}
      >
        {/* Green glow ring on correct */}
        {isRight && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            animate={{ boxShadow: ['0 0 0px #22C55E50', '0 0 28px #22C55E50', '0 0 0px #22C55E50'] }}
            transition={{ duration: 0.7, repeat: 3 }}
          />
        )}

        {/* Emoji */}
        <motion.span
          className={`select-none leading-none ${emojiSize}`}
          style={scaleMode === 'height'
            ? { display: 'block', transform: `scaleY(${scaleY})`, transformOrigin: 'bottom' }
            : {}}
          animate={!isAnswered
            ? { rotate: [-1.5, 1.5, -1.5], y: [0, -4, 0] }
            : isRight
            ? { scale: [1, 1.1, 1.05], y: [0, -10, -5] }
            : {}}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {side.emoji}
        </motion.span>

        {/* ✓ badge — correct only */}
        {isRight && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute bottom-2 right-2 w-7 h-7 bg-[#22C55E] rounded-full
                       flex items-center justify-center shadow"
          >
            <span className="text-white text-sm font-black">✓</span>
          </motion.div>
        )}
      </motion.button>

      {/* Name chip — revealed after answer */}
      <AnimatePresence>
        {isAnswered && (
          <motion.span
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="text-sm font-black rounded-xl px-3 py-1"
            style={
              isRight
                ? { background: '#D1FAE5', color: '#065F46' }
                : { background: '#F5E6D3', color: '#7B4F2E' }
            }
          >
            {side.name}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WoodCard;
