import React from "react";
import { useNavigate } from "react-router";
import ShapesIntroduction from "./ShapesIntroduction";
import ShapesLandingPage from "./ShapesLandingPage";
import BearShapeIntro from "./BearShapeIntro";
import BusShapes from "./BusShapes";
import TreeHomeShapeIntro from "./TreeHomeShapeIntro";
// import NumberCounting from "./NumberCounting";
// import NumbersGamesLandingPage from "./NumbersGamesLandingPage";

// Wrapper for Numbers Games Page (standalone route)
export const ShapesGamesPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games");
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
      <ShapesLandingPage 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };
  
  // Wrapper for Shapes Introduction
  export const ShapesIntroductionWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games/numbers");
    };
  
    return (
      <div className="min-h-screen">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Numbers Menu
        </button>
        <ShapesIntroduction />
      </div>
    );
  };

  export const ShapesBearWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games/numbers");
    };
  
    return (
      <div className="min-h-screen">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Numbers Menu
        </button>
        <BearShapeIntro />
      </div>
    );
  };

  export const ShapesBusWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games/shapes");
    };
  
    return (
      <div className="min-h-screen">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Numbers Menu
        </button>
        <BusShapes />
      </div>
    );
  };

  export const ShapesTreeWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games/shapes");
    };
  
    return (
      <div className="min-h-screen">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Numbers Menu
        </button>
        <TreeHomeShapeIntro />
      </div>
    );
  };
  
  