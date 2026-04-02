import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { useLocation } from 'react-router';
import { useProfile } from '../../context/ProfileContext';
import { useMode } from '../../context/ModeContext';
import useGoBack from '../../hooks/useGoBack';

const KidsBackButton: React.FC = () => {
  const { activeProfile } = useProfile();
  const { isParentMode } = useMode();
  const location = useLocation();
  const goBack = useGoBack();

  // Only show for Kids profile and not in Parent Mode
  if (activeProfile?.type !== 'KIDS' || isParentMode) return null;

  // Don't show on the main Hub or Selection screens
  const isHubPage = location.pathname === '/' ||
    location.pathname === '/games' ||
    location.pathname === '/profiles' ||
    location.pathname === '/select-profile';

  if (isHubPage) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={goBack}
        className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-24 h-24 bg-rose-500 rounded-full border-8 border-white shadow-[0_10px_0_#be123c] group"
        aria-label="Go Back"
      >
        <motion.div
          animate={{ x: [0, -2, 2, 0], y: [0, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Rocket
            className="text-white rotate-[-135deg] group-hover:translate-x-[-2px] group-hover:translate-y-[2px] transition-transform"
            size={48}
            strokeWidth={3}
          />
        </motion.div>

        {/* Playful tooltip-like text */}
        <span className="absolute -top-12 bg-white text-rose-600 px-4 py-1 rounded-full font-black text-sm uppercase tracking-widest border-2 border-rose-200 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Go Back! 🚀
        </span>
      </motion.button>
    </AnimatePresence>
  );
};

export default KidsBackButton;
