/**
 * kids-ui/TouchRipple.tsx
 * Animated finger-tap hint used in Play mode.
 * Replaces any visible mouse-cursor icon.
 */
import React from 'react';
import { motion } from 'framer-motion';

interface Props { x: number; y: number }

const TouchRipple: React.FC<Props> = ({ x, y }) => (
  <motion.div
    className="fixed pointer-events-none z-[600]"
    style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
  >
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="absolute rounded-full border-4 border-[#FBBF24]"
        style={{ left: -28, top: -28, width: 56, height: 56 }}
        initial={{ scale: 0.4, opacity: 0.9 }}
        animate={{ scale: 1.8 + i * 0.4, opacity: 0 }}
        transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity, repeatDelay: 0.4 }}
      />
    ))}
    <motion.div
      className="w-5 h-5 rounded-full bg-[#FBBF24] shadow-lg"
      style={{ marginLeft: -10, marginTop: -10 }}
      animate={{ scale: [1, 0.8, 1] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
  </motion.div>
);

export default TouchRipple;
