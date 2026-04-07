import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface VisualLogicCardProps {
  /** The emoji to render inside the card */
  emoji?: string | React.ReactNode;
  /**
   * Scale multiplier applied to the emoji.
   * - 2-box games: 1.0 for "target" side, 0.45 for "other" side
   * - Tall/Short: use scaleY instead — pass emojiScale=1 and scaleYOverride
   * - 3/4-box games: always 1.0 (emoji content differs, not size)
   * - FullAndEmpty: ignored — use `children` slot instead
   */
  emojiScale?: number;
  /**
   * Optional independent Y-scale for tall/short games.
   * When provided, scaleY is used instead of uniform scale.
   */
  scaleYOverride?: number;
  /** Whether this card slot is the correct answer */
  isTargetCard: boolean;
  /** Whether this card was selected by the player */
  isSelected: boolean;
  /** Whether the player answered correctly overall */
  isCorrect: boolean;
  /** Whether any card has been selected for this turn */
  isAnswered: boolean;
  /** Click handler – parent blocks clicks in kid mode */
  onClick?: () => void;
  /** Ref for virtual hand tutorial positioning */
  cardRef?: React.Ref<HTMLButtonElement>;
  /**
   * Replaces the emoji entirely — used by Inside/Outside/Full/Empty
   * for complex dual-emoji container layouts.
   */
  children?: React.ReactNode;
  /**
   * Extra overlay rendered ON TOP of the emoji (not replacing it).
   * Used by Different/SamePictures for particle burst effects.
   */
  overlay?: React.ReactNode;
  /** Extra classes on the outer button */
  className?: string;
  /**
   * When true, removes overflow-hidden from the card.
   * Required by Above/Below/AboveAndBelow where the emoji
   * is translated ±45px and would otherwise be clipped.
   */
  overflowVisible?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Particle burst on correct answer
// ─────────────────────────────────────────────────────────────────────────────
const PARTICLE_COUNT = 10;
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => i);

const CorrectParticles: React.FC = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    className="absolute inset-0 z-20 pointer-events-none"
  >
    {particles.map((i) => (
      <motion.div
        key={i}
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={{
          x: (Math.random() - 0.5) * 220,
          y: (Math.random() - 0.5) * 220,
          opacity: 0,
          scale: 0.5,
        }}
        transition={{ duration: 0.7, delay: i * 0.02 }}
        className="absolute left-1/2 top-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full"
      />
    ))}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Feedback icon (✓ or ?)
// ─────────────────────────────────────────────────────────────────────────────
const FeedbackIcon: React.FC<{ correct: boolean }> = ({ correct }) => (
  <motion.div
    initial={{ scale: 0, y: 30 }}
    animate={{ scale: 1.2, y: -44 }}
    exit={{ scale: 0 }}
    className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
  >
    {correct ? (
      <div className="bg-[#4CAF50] p-2 sm:p-4 rounded-full shadow-2xl border-[4px] sm:border-[8px] border-white">
        <CheckCircle2 className="text-white w-6 h-6 sm:w-8 sm:h-8" />
      </div>
    ) : (
      <div className="bg-[#FFB74D] p-2 sm:p-4 rounded-full shadow-2xl border-[4px] sm:border-[8px] border-white flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16">
        <span className="text-white font-black text-2xl sm:text-4xl leading-none">?</span>
      </div>
    )}
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Border colour based on state
// ─────────────────────────────────────────────────────────────────────────────
function borderClass(
  isSelected: boolean,
  isCorrect: boolean,
  isTargetCard: boolean,
  isAnswered: boolean,
): string {
  if (isSelected) {
    return isCorrect && isTargetCard
      ? 'border-[#4CAF50] bg-[#F1FCEF]'
      : 'border-[#FCA5A5] bg-[#FFF1F0] animate-wobble';
  }
  if (isAnswered) return 'opacity-40 border-[#EEE0CB]';
  return 'border-[#D9B99B] hover:border-[#B8977E]';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const VisualLogicCard = React.forwardRef<HTMLButtonElement, VisualLogicCardProps>(
  (
    {
      emoji,
      emojiScale = 1.0,
      scaleYOverride,
      isTargetCard,
      isSelected,
      isCorrect,
      isAnswered,
      onClick,
      children,
      overlay,
      className = '',
      overflowVisible = false,
    },
    ref,
  ) => {
    const showCorrectFeedback = isSelected && isCorrect && isTargetCard;

    // Fix: when using scaleYOverride, initial must also use axis-specific values
    // so that Framer Motion can interpolate correctly. Using `scale: 0` as initial
    // while animating to `scaleX/scaleY` leaves the element invisible.
    const initialProps = scaleYOverride !== undefined
      ? { scaleX: 0, scaleY: 0 }
      : { scale: 0 };

    const animateProps = scaleYOverride !== undefined
      ? { scaleX: 1, scaleY: scaleYOverride }
      : { scale: emojiScale };

    return (
      <motion.button
        ref={ref}
        onClick={onClick}
        whileHover={!isAnswered ? { scale: 1.03 } : {}}
        whileTap={!isAnswered ? { scale: 0.97 } : {}}
        className={[
          // ── Canonical card shape ──────────────────────────────────────────
          'relative aspect-square w-full',
          'bg-[#FFFBF2]',
          'rounded-[1.5rem] sm:rounded-[2.5rem]',
          'shadow-[inset_0_4px_8px_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.08)]',
          'border-b-[6px] sm:border-b-[8px]',
          'flex flex-col items-center justify-center',
          'transition-all duration-500',
          overflowVisible ? 'overflow-visible' : 'overflow-hidden',
          // ── State-driven border / bg ──────────────────────────────────────
          borderClass(isSelected, isCorrect, isTargetCard, isAnswered),
          className,
        ].join(' ')}
      >
        {/* ── Emoji or custom children ───────────────────────────────────── */}
        {children ?? (
          <motion.div
            initial={initialProps}
            animate={{
              ...animateProps,
              filter: isSelected && !isTargetCard ? 'grayscale(1)' : 'grayscale(0)',
            }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            className="text-[clamp(4rem,16vw,9rem)] sm:text-[clamp(5rem,14vw,11rem)] drop-shadow-[0_8px_8px_rgba(0,0,0,0.15)] flex items-center justify-center select-none leading-none"
          >
            {emoji}
          </motion.div>
        )}

        {/* ── Extra overlay on top of emoji (particles etc.) ──────────────── */}
        {overlay}

        {/* ── Correct-answer particle burst ──────────────────────────────── */}
        <AnimatePresence>
          {showCorrectFeedback && <CorrectParticles key="particles" />}
        </AnimatePresence>

        {/* ── Feedback icon ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {isSelected && (
            <FeedbackIcon
              key="feedback"
              correct={showCorrectFeedback}
            />
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);

VisualLogicCard.displayName = 'VisualLogicCard';

export default VisualLogicCard;
