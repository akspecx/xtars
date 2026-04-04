import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const visualLogicData: KidsGameEntry[] = [
  // ─── Size ────────────────────────────────────────────────────────
  { id: 'big',              title: 'Big',           subtitle: 'Find the big one',        icon: '🐘', iconPair: ['🐘','🐜'], path: '/games/visuallogic/big',              totalScenarios: 8,  gradient: 'from-amber-400 to-orange-500' },
  { id: 'small',            title: 'Small',         subtitle: 'Find the small one',      icon: '🐜', iconPair: ['🐜','🐘'], path: '/games/visuallogic/small',            totalScenarios: 8,  gradient: 'from-amber-300 to-yellow-500' },
  { id: 'big-small-mix',   title: 'Big & Small',   subtitle: 'Mixed size fun',           icon: '⚖️', iconPair: ['🐘','🐜'], path: '/games/visuallogic/big-small-mix',   totalScenarios: 16, gradient: 'from-amber-500 to-rose-400' },

  // ─── Height ──────────────────────────────────────────────────────
  { id: 'tall',             title: 'Tall',          subtitle: 'Who is taller?',           icon: '🦒', iconPair: ['🦒','🐸'], path: '/games/visuallogic/tall',             totalScenarios: 8,  gradient: 'from-sky-400 to-cyan-500' },
  { id: 'short',            title: 'Short',         subtitle: 'Who is shorter?',          icon: '🐸', iconPair: ['🐸','🦒'], path: '/games/visuallogic/short',            totalScenarios: 8,  gradient: 'from-emerald-400 to-teal-500' },
  { id: 'tall-short',      title: 'Tall & Short',  subtitle: 'Height challenge',         icon: '📏', iconPair: ['🦒','🐸'], path: '/games/visuallogic/tall-short',      totalScenarios: 16, gradient: 'from-sky-500 to-indigo-400' },

  // ─── Position ────────────────────────────────────────────────────
  { id: 'above',            title: 'Above',         subtitle: 'What is up there?',        icon: '☁️', iconPair: ['☁️','🏠'], path: '/games/visuallogic/above',            totalScenarios: 8,  gradient: 'from-blue-400 to-indigo-500' },
  { id: 'below',            title: 'Below',         subtitle: 'What is down there?',      icon: '🍄', iconPair: ['🌱','☁️'], path: '/games/visuallogic/below',            totalScenarios: 8,  gradient: 'from-green-400 to-emerald-500' },
  { id: 'above-below-mix', title: 'Above & Below', subtitle: 'Up and down fun',          icon: '↕️', iconPair: ['☁️','🌱'], path: '/games/visuallogic/above-below-mix', totalScenarios: 16, gradient: 'from-indigo-400 to-purple-500' },

  // ─── Inside / Outside ────────────────────────────────────────────
  { id: 'inside',           title: 'Inside',        subtitle: 'In the box',               icon: '🧸', iconPair: ['🏠','🧸'], path: '/games/visuallogic/inside',           totalScenarios: 8,  gradient: 'from-pink-400 to-rose-500' },
  { id: 'outside',          title: 'Outside',       subtitle: 'Out of the box',           icon: '🌳', iconPair: ['🌳','🐦'], path: '/games/visuallogic/outside',          totalScenarios: 8,  gradient: 'from-lime-400 to-green-500' },
  { id: 'inside-outside-mix', title: 'In & Out',    subtitle: 'Where is it?',             icon: '📦', iconPair: ['📦','🌳'], path: '/games/visuallogic/inside-outside-mix', totalScenarios: 16, gradient: 'from-teal-400 to-cyan-500' },

  // ─── Full / Empty ────────────────────────────────────────────────
  { id: 'full',             title: 'Full',          subtitle: 'All filled up',            icon: '🧃', iconPair: ['🧃','🫙'], path: '/games/visuallogic/full',             totalScenarios: 8,  gradient: 'from-orange-400 to-amber-500' },
  { id: 'empty',            title: 'Empty',         subtitle: 'Nothing inside',           icon: '🫙', iconPair: ['🫙','🧃'], path: '/games/visuallogic/empty',            totalScenarios: 8,  gradient: 'from-slate-400 to-gray-500' },
  { id: 'full-empty',      title: 'Full & Empty',  subtitle: 'Mixed volume fun',         icon: '🥛', iconPair: ['🧃','🫙'], path: '/games/visuallogic/full-empty',      totalScenarios: 16, gradient: 'from-cyan-400 to-sky-500' },

  // ─── Same / Different ────────────────────────────────────────────
  { id: 'same',             title: 'Same',          subtitle: 'Match the pictures',       icon: '👯', iconPair: ['🐱','🐱'], path: '/games/visuallogic/same',             totalScenarios: 8,  gradient: 'from-violet-400 to-purple-500' },
  { id: 'different',        title: 'Different',     subtitle: 'Spot the odd one',         icon: '🤔', iconPair: ['🐱','🐶'], path: '/games/visuallogic/different',        totalScenarios: 8,  gradient: 'from-fuchsia-400 to-pink-500' },
];

const VisualLogicLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Visual Logic"
    moduleEmoji="🧩"
    headerGradient="from-amber-500 to-orange-500"
    bgColor="#FDFBF7"
    games={visualLogicData}
    onBack={onBack}
  />
);

export default VisualLogicLandingPage;
