/**
 * kids-ui/ConceptSheet.tsx
 * Slides up to explain what BIG / TALL / ABOVE / FULL etc. means.
 * Now accepts a kid-friendly definition string per module.
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GamePair } from './types';
import { WOOD_LIGHT, type WoodTheme } from './useComparisonGame';

interface Props {
  pair:           GamePair;
  askPrimary:     boolean;
  primaryLabel:   string;
  secondaryLabel: string;
  /** Kid-friendly one-liner like "BIG means it takes up lots of space!" */
  definition?:    string;
  autoAdvance:    boolean;
  theme?:         WoodTheme;
  onDone:         () => void;
}

const ConceptSheet: React.FC<Props> = ({
  pair, askPrimary, primaryLabel, secondaryLabel, definition,
  autoAdvance, theme, onDone,
}) => {
  const t = theme ?? WOOD_LIGHT;
  const [secs, setSecs] = useState(6);
  const shown  = askPrimary ? pair.primary   : pair.secondary;
  const other  = askPrimary ? pair.secondary : pair.primary;
  const label  = askPrimary ? primaryLabel   : secondaryLabel;
  const color  = askPrimary ? '#005f99'      : '#3c6600';

  useEffect(() => {
    if (!autoAdvance) return;
    const iv = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    const dt = setTimeout(onDone, 6000);
    return () => { clearInterval(iv); clearTimeout(dt); };
  }, [autoAdvance, onDone]);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-[400] rounded-t-[2rem] shadow-2xl px-6 pt-5 pb-10"
      style={{ maxHeight: '65vh', overflowY: 'auto', background: '#fff7cc', borderTop: '3px solid #fbeb5b' }}
      onClick={onDone}
    >
      {/* Drag handle */}
      <div className="w-10 h-1.5 rounded-full mx-auto mb-4" style={{ background: '#bcaf3c' }} />

      {/* Auto-advance bar */}
      {autoAdvance && (
        <div className="w-full h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: '#f0e037' }}>
          <motion.div
            initial={{ width: '100%' }} animate={{ width: '0%' }}
            transition={{ duration: 6, ease: 'linear' }}
            className="h-full rounded-full"
            style={{ background: color }}
          />
        </div>
      )}

      {/* Label badge */}
      <div className="flex justify-center mb-3">
        <span
          className="font-black text-xl px-6 py-2 rounded-full"
          style={{ background: color, color: '#fff' }}
        >
          {label}
        </span>
      </div>

      {/* Definition */}
      {definition && (
        <div
          className="rounded-2xl px-4 py-3 mb-4 text-center"
          style={{ background: `${color}18`, border: `1.5px solid ${color}40` }}
        >
          <p className="font-black text-base" style={{ color }}>{definition}</p>
        </div>
      )}

      {/* Side-by-side comparison */}
      <div className="flex items-end justify-center gap-10 mb-5">
        {[
          { item: pair.primary,   lbl: primaryLabel,   sz: 'text-[72px]', c: '#005f99' },
          { item: pair.secondary, lbl: secondaryLabel, sz: 'text-[44px]', c: '#3c6600' },
        ].map(({ item, lbl, sz, c }) => (
          <div key={lbl} className="flex flex-col items-center gap-1">
            <motion.span
              className={`${sz} leading-none`}
              animate={(askPrimary ? lbl === primaryLabel : lbl === secondaryLabel)
                ? { scale: [1, 1.2, 1] } : undefined}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {item.emoji}
            </motion.span>
            <span
              className="text-xs font-black px-3 py-0.5 rounded-full mt-1"
              style={{ background: `${c}20`, color: c }}
            >
              {lbl}
            </span>
          </div>
        ))}
      </div>

      {/* Fact */}
      <p className="text-center font-bold text-sm mb-5" style={{ color: '#655d00' }}>
        {shown.name} is {label}!{'  '}{other.name} is {askPrimary ? secondaryLabel : primaryLabel}.
      </p>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={e => { e.stopPropagation(); onDone(); }}
        className="w-full py-4 rounded-full font-black text-lg shadow-md"
        style={{ background: '#005f99', color: '#ecf3ff', boxShadow: '0 4px 0 #005386' }}
      >
        Got it! Let's go →
      </motion.button>
    </motion.div>
  );
};

export default ConceptSheet;
