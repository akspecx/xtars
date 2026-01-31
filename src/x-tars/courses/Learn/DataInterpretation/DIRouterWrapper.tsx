import React from "react";
import { useNavigate } from "react-router";
import BarChartMain from "./BarChart/BarChartMain"
// import SacredGame from "./puzzlesModule/TheSacredGame"


// To handle back from Maths page
 export const BarChartMainRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/");
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
      <BarChartMain 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };