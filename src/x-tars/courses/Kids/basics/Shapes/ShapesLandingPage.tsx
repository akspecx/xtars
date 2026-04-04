import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const shapesData: KidsGameEntry[] = [
  { id: 'Introduction',      title: 'Shapes in the Real World', subtitle: 'Identify shapes around us',           icon: '🔴', path: '/games/shapes/introduction', totalScenarios: 8, gradient: 'from-indigo-500 to-purple-500' },
  { id: 'Find the Shapes',   title: 'Help Bear Find Shapes',    subtitle: 'Bear is confused — help them!',      icon: '🐻', path: '/games/shapes/bear',         totalScenarios: 8, gradient: 'from-rose-500 to-amber-500' },
  { id: 'Bus Shapes',        title: 'Shapes on Vehicles',       subtitle: 'Locate shapes on different vehicles', icon: '🚌', path: '/games/shapes/bus',          totalScenarios: 8, gradient: 'from-sky-500 to-blue-500' },
  { id: "Let's make a tree", title: "Let's Make a Tree",        subtitle: 'Find correct shapes to build a tree', icon: '🌳', path: '/games/shapes/tree',         totalScenarios: 8, gradient: 'from-green-500 to-emerald-500' },
];

const ShapesLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Shapes"
    moduleEmoji="🟡"
    headerGradient="from-sky-500 to-blue-600"
    bgColor="#f0f7ff"
    games={shapesData}
    onBack={onBack}
  />
);

export default ShapesLandingPage;
