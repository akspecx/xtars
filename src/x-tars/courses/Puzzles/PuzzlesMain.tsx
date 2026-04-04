import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../CommonUtility/KidsModuleLandingPage';

const puzzlesData: KidsGameEntry[] = [
  { id: 'TheMission',    title: 'The Mission',    subtitle: 'Achieve the mission within constraints', icon: '🎯', path: '/puzzles/mission',    totalScenarios: 5, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'MetricSum',     title: 'Magic Square',   subtitle: 'Arrange numbers so sum is equal',        icon: '🔢', path: '/puzzles/metricSum',  totalScenarios: 5, gradient: 'from-violet-500 to-blue-500' },
  { id: 'identification', title: 'The Sacred Game', subtitle: 'Can you offer flowers correctly?',    icon: '🛕', path: '/puzzles/sacredGame', totalScenarios: 5, gradient: 'from-orange-500 to-amber-500' },
];

const PuzzlesMain: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Puzzles"
    moduleEmoji="🚀"
    headerGradient="from-violet-600 to-indigo-700"
    bgColor="#f5f0ff"
    games={puzzlesData}
    onBack={onBack}
  />
);

export default PuzzlesMain;
