import React from "react";
import { useNavigate } from "react-router";
import appleArrangementQuiz from "./appleArrangementQuiz";
import orangeArrangementQuiz from "./orangeArrangementQuiz";
import orangeComplexArrangement from "./orangeComplexArrangement";
import giraffeComplexArrangement from "./giraffeComplexArrangement";
import ArrangementMain from "./ArrangementMain";

// Wrapper for Puzzles Page (standalone route)
export const PuzzlesPageWrapper: React.FC = () => {
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
    <ArrangementMain 
      onBack={handleBack}
      theme={theme}
      title="Puzzles"
      icon="🧩"
    />
  );
};

// Wrapper for Apple Arrangement Game
export const AppleArrangementGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/puzzles");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Puzzles Menu
      </button>
      <appleArrangementQuiz />
    </div>
  );
};

// Wrapper for Orange Arrangement Game
export const OrangeArrangementGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/puzzles");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Puzzles Menu
      </button>
      <orangeArrangementQuiz />
    </div>
  );
};

// Wrapper for Complex Orange Arrangement Game
export const OrangeComplexArrangementGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/puzzles");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Puzzles Menu
      </button>
      <orangeComplexArrangement />
    </div>
  );
};

// Wrapper for Complex Giraffe Arrangement Game
export const GiraffeComplexArrangementGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/puzzles");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Puzzles Menu
      </button>
      <giraffeComplexArrangement />
    </div>
  );
};

