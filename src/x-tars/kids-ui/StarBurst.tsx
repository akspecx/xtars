/**
 * kids-ui/StarBurst.tsx
 * Colourful confetti particles on correct answer.
 */
import React from 'react';
import { motion } from 'framer-motion';

const COLORS = ['#FBBF24', '#22C55E', '#34D399', '#A78BFA', '#F9A8D4', '#FB923C'];

const StarBurst: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * 360;
      const dist  = 80 + (i % 3) * 28;
      return (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width:      8 + (i % 3) * 4,
            height:     8 + (i % 3) * 4,
            background: COLORS[i % COLORS.length],
            left: '50%', top: '50%',
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((angle * Math.PI) / 180) * dist,
            y: Math.sin((angle * Math.PI) / 180) * dist,
            opacity: 0, scale: 0.2,
          }}
          transition={{ duration: 0.75 + (i % 3) * 0.2, ease: 'easeOut' }}
        />
      );
    })}
  </div>
);

export default StarBurst;
