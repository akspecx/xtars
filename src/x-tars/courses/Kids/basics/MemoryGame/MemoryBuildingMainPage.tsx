import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const memoryData: KidsGameEntry[] = [
  { id: 'animals', title: 'Match the Animals', subtitle: 'Open and match the correct animals', icon: '🐘', path: '/games/memory/animals', totalScenarios: 6, gradient: 'from-orange-500 to-amber-500' },
  { id: 'fruits',  title: 'Match the Fruits',  subtitle: 'Match the correct pair of fruits',   icon: '🍉', path: '/games/memory/fruits',  totalScenarios: 6, gradient: 'from-lime-500 to-green-500' },
  { id: 'numbers', title: 'Match the Numbers', subtitle: 'Match the correct numbers',           icon: '🔢', path: '/games/memory/numbers', totalScenarios: 6, gradient: 'from-cyan-500 to-blue-500' },
];

const MemoryBuildingMainPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Memory Game"
    moduleEmoji="🧠"
    headerGradient="from-emerald-500 to-teal-600"
    bgColor="#f0fff8"
    games={memoryData}
    onBack={onBack}
  />
);

export default MemoryBuildingMainPage;
