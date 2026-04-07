import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const visualLogicData: KidsGameEntry[] = [
  // ─── Size ────────────────────────────────────────────────────────
  // wooden-brown accent colours — each card uses a warm brown/tan tone
  { id: 'big',              title: 'Big',          subtitle: 'Which is bigger?',    icon: '🐘', iconPair: ['🐘','🐜'], path: '/games/visuallogic/big',              totalScenarios: 8,  gradient: 'from-[#8B5533] to-[#A0693A]' },
  { id: 'small',            title: 'Small',        subtitle: 'Which is smaller?',   icon: '🐜', iconPair: ['🐜','🐘'], path: '/games/visuallogic/small',            totalScenarios: 8,  gradient: 'from-[#5C7A3E] to-[#7A9E52]' },
  { id: 'big-small-mix',   title: 'Big & Small',  subtitle: 'Big or small?',       icon: '⚖️', iconPair: ['🐘','🐜'], path: '/games/visuallogic/big-small-mix',   totalScenarios: 16, gradient: 'from-[#7B4F2E] to-[#9C6A42]' },

  // ─── Height ──────────────────────────────────────────────────────
  { id: 'tall',             title: 'Tall',         subtitle: 'Who reaches higher?', icon: '🦒', iconPair: ['🦒','🌱'], path: '/games/visuallogic/tall',             totalScenarios: 8,  gradient: 'from-[#6B4226] to-[#8B5533]' },
  { id: 'short',            title: 'Short',        subtitle: 'Who is closer down?', icon: '🌱', iconPair: ['🌱','🦒'], path: '/games/visuallogic/short',            totalScenarios: 8,  gradient: 'from-[#5C3D1E] to-[#7B5230]' },
  { id: 'tall-short',      title: 'Tall & Short', subtitle: 'Tall or short?',      icon: '📏', iconPair: ['🦒','🌱'], path: '/games/visuallogic/tall-short',      totalScenarios: 16, gradient: 'from-[#9C5E2B] to-[#B87340]' },

  // ─── Position ────────────────────────────────────────────────────
  { id: 'above',            title: 'Above',        subtitle: 'What is up?',         icon: '☁️', iconPair: ['☁️','🏠'], path: '/games/visuallogic/above',            totalScenarios: 8,  gradient: 'from-[#4A6FA5] to-[#5E87C1]' },
  { id: 'below',            title: 'Below',        subtitle: 'What is down?',       icon: '🍄', iconPair: ['🌱','☁️'], path: '/games/visuallogic/below',            totalScenarios: 8,  gradient: 'from-[#3D7A52] to-[#52A06C]' },
  { id: 'above-below-mix', title: 'Up & Down',    subtitle: 'Above or below?',     icon: '↕️', iconPair: ['☁️','🌱'], path: '/games/visuallogic/above-below-mix', totalScenarios: 16, gradient: 'from-[#5A4A8A] to-[#7060A8]' },

  // ─── Inside / Outside ────────────────────────────────────────────
  { id: 'inside',           title: 'Inside',       subtitle: 'What is inside?',     icon: '🧸', iconPair: ['🏠','🧸'], path: '/games/visuallogic/inside',           totalScenarios: 8,  gradient: 'from-[#A0522D] to-[#C06A38]' },
  { id: 'outside',          title: 'Outside',      subtitle: 'What is outside?',    icon: '🌳', iconPair: ['🌳','🐦'], path: '/games/visuallogic/outside',          totalScenarios: 8,  gradient: 'from-[#4A7C3F] to-[#62A053]' },
  { id: 'inside-outside-mix', title: 'In & Out',   subtitle: 'Inside or outside?',  icon: '📦', iconPair: ['📦','🌳'], path: '/games/visuallogic/inside-outside-mix', totalScenarios: 16, gradient: 'from-[#7A5430] to-[#9A6A40]' },

  // ─── Full / Empty ────────────────────────────────────────────────
  { id: 'full',             title: 'Full',         subtitle: 'Filled to the top!',  icon: '🧃', iconPair: ['🧃','🫙'], path: '/games/visuallogic/full',             totalScenarios: 8,  gradient: 'from-[#8B6914] to-[#A8841C]' },
  { id: 'empty',            title: 'Empty',        subtitle: 'Nothing inside!',     icon: '🫙', iconPair: ['🫙','🧃'], path: '/games/visuallogic/empty',            totalScenarios: 8,  gradient: 'from-[#7A7060] to-[#968C7A]' },
  { id: 'full-empty',      title: 'Full & Empty', subtitle: 'Full or empty?',      icon: '🥛', iconPair: ['🧃','🫙'], path: '/games/visuallogic/full-empty',      totalScenarios: 16, gradient: 'from-[#5C7A7A] to-[#709898]' },

  // ─── Same / Different ────────────────────────────────────────────
  { id: 'same',             title: 'Same',         subtitle: 'Find the match!',     icon: '👯', iconPair: ['🐱','🐱'], path: '/games/visuallogic/same',             totalScenarios: 8,  gradient: 'from-[#6B4A8B] to-[#8562A8]' },
  { id: 'different',        title: 'Different',    subtitle: 'Spot the odd one!',   icon: '🤔', iconPair: ['🐱','🐶'], path: '/games/visuallogic/different',        totalScenarios: 8,  gradient: 'from-[#8B3A5A] to-[#A84E6E]' },
];

const VisualLogicLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Visual Logic"
    moduleEmoji="🧩"
    headerGradient="from-[#8B5533] to-[#A0693A]"
    bgColor="#F5E6D3"
    games={visualLogicData}
    onBack={onBack}
  />
);

export default VisualLogicLandingPage;
