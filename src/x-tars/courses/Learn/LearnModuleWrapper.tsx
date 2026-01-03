import React from "react";
import { useNavigate } from "react-router";
import LearnMainModule from "./LearnMainModule";
// import PuzzlesSubModules from "./PuzzlesMain"
// import MetricSum from "./puzzlesModule/MetricsSum"
// import SacredGame from "./puzzlesModule/TheSacredGame"
// Wrapper for Numbers Games Page (standalone route)

export const LearnRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/");
  };

  // Default theme (dark theme)
  const theme = {
    background: 'from-gray-900 to-black',
    surface: 'bg-gray-800 border-gray-700',
    surfaceHover: 'hover:bg-gray-700',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    shadow: 'shadow-lg shadow-black/50'
  };

  return (
    <LearnMainModule 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};