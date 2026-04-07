/**
 * kids-ui/WinScreen.tsx
 * Module completion screen with confetti + avatar.
 * Wooden dark background for contrast, golden stars.
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import KidAvatar from '../courses/CommonUtility/KidAvatar';

const COLORS = ['#FBBF24', '#22C55E', '#34D399', '#A78BFA', '#F9A8D4', '#FB923C'];
const WAIT = 5;

interface Props {
  avatar:  string;
  name:    string;
  score:   number;
  total:   number;
  accent:  string;
  onDone:  () => void;
  onReplay:() => void;
}

const WinScreen: React.FC<Props> = ({ avatar, name, score, total, accent, onDone, onReplay }) => {
  const [show,  setShow]  = useState(false);
  const [secs,  setSecs]  = useState(WAIT);

  useEffect(() => { const t = setTimeout(() => setShow(true), 150); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!show) return;
    if (secs <= 0) { onDone(); return; }
    const t = setTimeout(() => setSecs(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [show, secs, onDone]);

  const confetti = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * 360;
      const dist  = 80 + (i % 5) * 26;
      return {
        x: Math.cos((angle * Math.PI) / 180) * dist,
        y: Math.sin((angle * Math.PI) / 180) * dist - 40,
        color: COLORS[i % COLORS.length],
        size: 7 + (i % 4) * 3,
        delay: (i % 6) * 0.06,
      };
    }), []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex flex-col overflow-hidden"
      style={{ background: '#3D200E' }}   // deep mahogany
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : -28 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className="flex-none text-center pt-14 px-6 select-none"
      >
        <p className="text-4xl font-black text-[#FBBF24] tracking-widest uppercase">Amazing!</p>
        <p className="text-xl text-white/85 font-bold mt-1">Great job, {name}! 🎉</p>
        <div className="flex gap-1.5 justify-center mt-3">
          {Array.from({ length: total }).map((_, i) => (
            <Star key={i} size={22}
              fill={i < score ? '#FBBF24' : 'rgba(255,255,255,0.15)'}
              className={i < score ? 'text-amber-400' : 'text-white/20'}
            />
          ))}
        </div>
      </motion.div>

      {/* Avatar + confetti */}
      <div className="flex-1 relative flex items-end justify-center pb-4">
        {show && confetti.map((c, i) => (
          <motion.div key={i} className="absolute rounded-full"
            style={{ width: c.size, height: c.size, background: c.color, left: '50%', bottom: '38%', zIndex: 12 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: c.x, y: c.y, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.95 + c.delay, delay: 0.1 + c.delay, ease: 'easeOut' }}
          />
        ))}
        <motion.div
          className="relative z-20"
          initial={{ scale: 0, y: 36 }}
          animate={{ scale: show ? 1 : 0, y: show ? [0,-22,0,-12,0] : 36 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 270 }}
        >
          <KidAvatar avatar={avatar} size={118} flying />
        </motion.div>
      </div>

      {/* Grass strip */}
      <div className="flex-none h-10 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-10 bg-[#22C55E]"
          style={{ borderTopLeftRadius: '60%', borderTopRightRadius: '60%' }} />
      </div>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: show ? 1 : 0, y: show ? 0 : 24 }}
        transition={{ delay: 0.45, type: 'spring' }}
        className="flex-none px-6 pt-5 pb-10 flex gap-3"
        style={{ background: '#FFFDF5' }}
      >
        <motion.button whileTap={{ scale: 0.93 }} onClick={onReplay}
          className="flex-1 py-3.5 rounded-2xl font-black text-[#8B5533] border-[2px]"
          style={{ background: '#F5E6D3', borderColor: '#D4A574' }}
        >
          🔄 Play Again
        </motion.button>
        <motion.button whileTap={{ scale: 0.93 }} onClick={onDone}
          className="flex-1 py-3.5 rounded-2xl font-black text-white shadow-md"
          style={{ background: accent || '#8B5533' }}
        >
          Next →  ({secs}s)
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WinScreen;
