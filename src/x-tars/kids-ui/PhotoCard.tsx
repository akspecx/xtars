/**
 * kids-ui/PhotoCard.tsx  — shared game card for all Visual Logic modules
 * Shows a gradient image area + large emoji.  NO text label beneath.
 * Primary card gets a bigger emoji + lighter, cooler gradient.
 * Secondary card gets a smaller emoji + warmer gradient.
 */
import React from 'react';
import { motion } from 'framer-motion';
import StarBurst from './StarBurst';

export interface PhotoCardProps {
  side:        { emoji: string; name: string };
  isPrimary:   boolean;
  isSelected:  boolean | null;
  isTarget:    boolean;
  phase:       'question' | 'correct' | 'wrong';
  /** CSS gradient string for the image area */
  primaryGrad:   string;
  secondaryGrad: string;
  onClick?:    () => void;
  cardRef?:    React.RefObject<HTMLButtonElement>;
}

const PhotoCard: React.FC<PhotoCardProps> = ({
  side, isPrimary, isSelected, isTarget, phase,
  primaryGrad, secondaryGrad, onClick, cardRef,
}) => {
  const isAnswered = phase === 'correct' || phase === 'wrong';
  const isRight = isAnswered && isTarget && phase === 'correct';
  const isWrong = isAnswered && isSelected === true && !isTarget && phase === 'wrong';

  const emojiSize  = isPrimary ? 'text-[90px]' : 'text-[56px]';
  const gradBg     = isPrimary ? primaryGrad : secondaryGrad;

  return (
    <div className="flex flex-col items-center gap-2 flex-1" style={{ maxWidth: 170 }}>
      {isRight && <StarBurst />}
      <motion.button
        ref={cardRef}
        onClick={onClick}
        disabled={isAnswered || !onClick}
        animate={isWrong ? { x: [-10, 10, -7, 7, 0] } : {}}
        whileTap={!isAnswered && onClick ? { scale: 0.93 } : {}}
        transition={{ duration: 0.35 }}
        className="w-full rounded-[28px] overflow-hidden shadow-xl border-4 transition-all duration-300"
        style={{
          borderColor: isRight ? '#22C55E' : isWrong ? '#F87171' : 'rgba(255,255,255,0.9)',
          aspectRatio: '1 / 1.15',
          background: gradBg,
        }}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ background: gradBg }}
        >
          {isRight && (
            <motion.div
              className="absolute inset-0"
              animate={{ boxShadow: ['0 0 0px #22C55E50', '0 0 32px #22C55E90', '0 0 0px #22C55E50'] }}
              transition={{ duration: 0.7, repeat: 3 }}
            />
          )}
          <motion.span
            className={`select-none leading-none ${emojiSize} drop-shadow-xl`}
            animate={
              !isAnswered
                ? { y: [0, -8, 0], rotate: [-2, 2, -2] }
                : isRight
                ? { scale: [1, 1.2, 1.1], y: [0, -14, -8] }
                : {}
            }
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {side.emoji}
          </motion.span>
          {isRight && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-3 right-3 w-9 h-9 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white text-lg font-black">✓</span>
            </motion.div>
          )}
        </div>
      </motion.button>
    </div>
  );
};

export default PhotoCard;
