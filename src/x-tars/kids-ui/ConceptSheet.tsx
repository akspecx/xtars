/**
 * kids-ui/ConceptSheet.tsx
 * Bottom-sheet "concept" panel — slides up to explain what BIG / TALL etc. means.
 * Wooden parchment theme.  Text kept concise.
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
  autoAdvance:    boolean;
  theme?:         WoodTheme;
  onDone:         () => void;
}

const ConceptSheet: React.FC<Props> = ({
  pair, askPrimary, primaryLabel, secondaryLabel, autoAdvance, theme, onDone,
}) => {
  const t = theme ?? WOOD_LIGHT;
  const [secs, setSecs] = useState(5);
  const shown  = askPrimary ? pair.primary   : pair.secondary;
  const other  = askPrimary ? pair.secondary : pair.primary;
  const label  = askPrimary ? primaryLabel   : secondaryLabel;
  const color  = askPrimary ? '#8B5533'      : '#10B981';

  useEffect(() => {
    if (!autoAdvance) return;
    const iv = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    const dt = setTimeout(onDone, 5000);
    return () => { clearInterval(iv); clearTimeout(dt); };
  }, [autoAdvance, onDone]);

  return (
    <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="fixed inset-x-0 bottom-0 z-[400] rounded-t-3xl shadow-2xl px-6 pt-5 pb-8"
      style={{ maxHeight: '60vh', overflowY: 'auto', background: t.areaBg, borderTop: `2px solid ${t.cardBorder}` }}
      onClick={onDone}
    >
      {/* Drag handle */}
      <div className="w-10 h-1.5 rounded-full mx-auto mb-4" style={{ background: t.cardBorder }} />

      {/* Auto-advance progress bar */}
      {autoAdvance && (
        <>
          <div className="w-full h-1.5 rounded-full mb-2 overflow-hidden" style={{ background: '#E8C9A0' }}>
            <motion.div
              initial={{ width: '100%' }} animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-full rounded-full"
              style={{ background: color }}
            />
          </div>
          <p className="text-center text-[11px] mb-3" style={{ color: '#A07850' }}>
            Continuing in {secs}s…
          </p>
        </>
      )}

      {/* Heading */}
      <h3 className="text-center text-lg font-black mb-4" style={{ color: t.text }}>
        What is <span style={{ color }}>{label}</span>?
      </h3>

      {/* Side-by-side comparison */}
      <div className="flex items-end justify-center gap-10 mb-5">
        {[
          { item: pair.primary,   lbl: primaryLabel,   sz: 'text-[64px]', c: '#8B5533' },
          { item: pair.secondary, lbl: secondaryLabel, sz: 'text-[38px]', c: '#10B981' },
        ].map(({ item, lbl, sz, c }) => (
          <div key={lbl} className="flex flex-col items-center gap-2">
            <motion.span
              className={`${sz} leading-none`}
              animate={(askPrimary ? lbl === primaryLabel : lbl === secondaryLabel)
                ? { scale: [1, 1.18, 1] } : undefined}
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              {item.emoji}
            </motion.span>
            <span className="text-xs font-black px-3 py-0.5 rounded-full"
              style={{ background: `${c}22`, color: c }}>
              {item.name}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c }}>
              {lbl}
            </span>
          </div>
        ))}
      </div>

      {/* Fact box */}
      <div
        className="rounded-2xl px-4 py-3 mb-5 text-center"
        style={{ background: `${color}18`, border: `1px solid ${color}40` }}
      >
        <p className="font-black text-base" style={{ color }}>
          {shown.name} is {label}!
        </p>
        <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>
          {shown.name} is {askPrimary ? 'bigger' : 'smaller'} than {other.name}.
        </p>
      </div>

      {/* CTA */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onDone}
        className="w-full py-3.5 rounded-2xl font-black text-white shadow-md"
        style={{ background: '#8B5533' }}
      >
        Got it! Let's go →
      </motion.button>
    </motion.div>
  );
};

export default ConceptSheet;
