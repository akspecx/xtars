// ProgressBadge.tsx
// Reusable child-facing progress indicators for hub cards.
// Used by both KidsMainPage and VisualLogicLandingPage.

import React from 'react';
import { motion } from 'framer-motion';
import { ModuleProgress, formatLastPlayed, formatTime } from './useModuleProgress';

// --- Mastery Progress Indicator ---
interface MasteryProgressProps {
  progress: ModuleProgress;
  size?: number;
}

/**
 * Replaces the ambiguous StarRow with a clear, visual indicator:
 * - Circular progress ring for in-progress modules.
 * - Green checkmark (✅) or Medal for completed modules.
 * - Pulse effect for modules currently being played.
 */
export const MasteryProgress: React.FC<MasteryProgressProps> = ({ progress, size = 48 }) => {
  const { scenariosCompletedBest, totalScenarios } = progress;
  const isCompleted = scenariosCompletedBest >= totalScenarios;
  const percentage = Math.round((scenariosCompletedBest / Math.max(totalScenarios, 1)) * 100);
  
  // Don't show anything if not started (unless size is used to show a placeholder)
  if (scenariosCompletedBest === 0 && !isCompleted) return null;

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5 mt-1 sm:mt-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Background Track */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-100"
          />
          {/* Progress fill */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className={isCompleted ? "text-emerald-500" : "text-amber-500"}
          />
        </svg>

        {/* Center Content */}
        <div className="flex items-center justify-center z-10 font-black text-[10px] text-[#5D4037]">
          {isCompleted ? (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-xl">✅</motion.span>
          ) : (
             <span>{percentage}%</span>
          )}
        </div>
      </div>
      
      {/* Label for Parents */}
      <span className="text-[9px] font-black uppercase tracking-widest text-[#A68B7C] opacity-70">
        {isCompleted ? "Mastered!" : "In Progress"}
      </span>
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
