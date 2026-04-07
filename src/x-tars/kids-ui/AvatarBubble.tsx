/**
 * kids-ui/AvatarBubble.tsx
 * Avatar with speech bubble that appears to come FROM the avatar's mouth.
 * Larger text size. Full wooden dark/light mode support.
 */
import React from 'react';
import { motion } from 'framer-motion';
import KidAvatar from '../courses/CommonUtility/KidAvatar';
import type { WoodTheme } from './useComparisonGame';

interface Props {
  avatar:      string;
  text:        string;
  highlight?:  string;
  celebrating: boolean;
  theme:       WoodTheme;
}

const AvatarBubble: React.FC<Props> = ({ avatar, text, highlight, celebrating, theme }) => {
  const parts = highlight ? text.split(highlight) : [text];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="flex items-end gap-0 w-full"
    >
      {/* Avatar */}
      <div className="relative flex-none" style={{ marginRight: -4 }}>
        <motion.div
          key={celebrating ? 'cel' : 'idle'}
          animate={
            celebrating
              ? { y: [0,-28,0,-18,0,-10,0], scale:[1,1.22,1,1.14,1], rotate:[0,-6,6,-4,0] }
              : { y: [0,-5,0] }
          }
          transition={
            celebrating
              ? { duration: 0.95, ease: 'easeOut' }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <KidAvatar avatar={avatar} size={92} />
        </motion.div>
      </div>

      {/* Speech bubble with left-pointing tail (appears from avatar mouth) */}
      <div className="relative flex-1 ml-3 mb-4">
        {/* Tail border */}
        <div
          className="absolute left-0 top-4 -translate-x-[10px]"
          style={{
            width: 0, height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: `12px solid ${theme.bubbleBorder}`,
          }}
        />
        {/* Tail fill */}
        <div
          className="absolute left-0 top-4 -translate-x-[8px]"
          style={{
            width: 0, height: 0,
            borderTop: '7px solid transparent',
            borderBottom: '7px solid transparent',
            borderRight: `11px solid ${theme.bubbleBg}`,
          }}
        />

        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 shadow-lg"
          style={{
            background: theme.bubbleBg,
            border: `2px solid ${theme.bubbleBorder}`,
          }}
        >
          <p className="font-black text-xl leading-snug" style={{ color: theme.text }}>
            {parts.map((p, i) => (
              <React.Fragment key={i}>
                {p}
                {i < parts.length - 1 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                    className="font-black text-2xl"
                    style={{ color: theme.textMuted }}
                  >
                    {highlight}
                  </motion.span>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AvatarBubble;
