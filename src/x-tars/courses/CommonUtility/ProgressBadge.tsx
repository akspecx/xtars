// ProgressBadge.tsx
// Reusable child-facing progress indicators for hub cards.
// Used by both KidsMainPage and VisualLogicLandingPage.

import React from 'react';
import { motion } from 'framer-motion';
import { ModuleProgress, formatLastPlayed, formatTime } from './useModuleProgress';

// --- Star Row ---
interface StarRowProps {
  progress: ModuleProgress;
}

// Shows up to 5 stars filled proportionally to scenariosCompletedBest / totalScenarios
export const StarRow: React.FC<StarRowProps> = ({ progress }) => {
  const total = Math.min(progress.totalScenarios, 5);
  const filled = Math.round((progress.scenariosCompletedBest / Math.max(progress.totalScenarios, 1)) * total);

  return (
    <div className="flex items-center gap-1 justify-center my-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
          className={`text-xl leading-none drop-shadow-sm transition-all ${
            i < filled 
              ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
              : 'text-gray-200 opacity-60'
          }`}
        >
          {i < filled ? '★' : '★'}
        </motion.span>
      ))}
    </div>
  );
};

// --- Mastery Medal Badge ---
// Redesigned to be clearly distinguishable with color-coded tiers
interface MasteryBadgeProps {
  level: 0 | 1 | 2 | 3;
}

const mastersConfig = {
  1: { emoji: '🥉', color: 'text-[#CD7F32]', bg: 'bg-[#FDF4EB]', border: 'border-[#CD7F32]/30', label: 'Bronze' },
  2: { emoji: '🥈', color: 'text-[#94A3B8]', bg: 'bg-[#F1F5F9]', border: 'border-[#94A3B8]/30', label: 'Silver' },
  3: { emoji: '🥇', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#FBBF24]/50', label: 'Gold' },
};

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({ level }) => {
  if (level === 0 || !mastersConfig[level as keyof typeof mastersConfig]) return null;

  const config = mastersConfig[level as keyof typeof mastersConfig];

  return (
    <motion.div
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      className={`absolute top-2 left-2 flex items-center justify-center p-2 rounded-full border-2 shadow-sm z-20 ${config.bg} ${config.border}`}
      title={`${config.label} Mastery`}
    >
      <span className="text-xl leading-none filter drop-shadow-sm">{config.emoji}</span>
      {level === 3 && (
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 rounded-full border border-dashed border-yellow-400 opacity-40"
        />
      )}
    </motion.div>
  );
};

// --- New Pulse Badge ---
// Shown on cards never visited before
export const NewBadge: React.FC = () => (
  <motion.span
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ repeat: Infinity, duration: 2 }}
    className="absolute top-1.5 right-1.5 text-[10px] font-black bg-[#FF5722] text-white px-1.5 py-0.5 rounded-full z-10 shadow leading-none"
  >
    NEW
  </motion.span>
);

// --- Parent Tooltip ---
// Shown on hover (desktop) via CSS group-hover
interface ParentTooltipProps {
  progress: ModuleProgress;
}

export const ParentTooltip: React.FC<ParentTooltipProps> = ({ progress }) => (
  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[200] w-44 bg-white rounded-2xl shadow-xl border-2 border-[#EADAC4] p-3 text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 hidden sm:block">
    <p className="text-[10px] font-black text-[#5D4037] mb-1.5 uppercase tracking-wider">📊 Progress</p>
    <div className="flex flex-col gap-1">
      <Row icon="✅" label={`${progress.scenariosCompletedBest} / ${progress.totalScenarios} scenarios`} />
      <Row icon="🔄" label={`${progress.completions}× completed`} />
      <Row icon="🕐" label={`Played ${progress.visitCount}×`} />
      <Row icon="📅" label={formatLastPlayed(progress.lastPlayedTs)} />
      {progress.totalTimeMs > 0 && <Row icon="⏱️" label={`${formatTime(progress.totalTimeMs)} total`} />}
    </div>
  </div>
);

const Row: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1.5 text-[10px] text-[#7A5C3E] font-semibold">
    <span>{icon}</span>
    <span>{label}</span>
  </div>
);
