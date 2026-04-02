import React from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../../../context/ProfileContext";
import appleArrangementQuiz from "./appleArrangementQuiz";
import orangeArrangementQuiz from "./orangeArrangementQuiz";
import orangeComplexArrangement from "./orangeComplexArrangement";
import giraffeComplexArrangement from "./giraffeComplexArrangement";

const ArrangementMain = React.lazy(() => import("./ArrangementMain"));

// Shared Wrapper to handle conditional navigation visibility
const GameWrapper: React.FC<{ children: React.ReactNode; menuPath: string }> = ({ children, menuPath }) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  
  return (
    <div className="min-h-screen">
      {activeProfile?.type !== 'KIDS' && (
        <button
          onClick={() => navigate(menuPath)}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Puzzles Menu
        </button>
      )}
      {children}
    </div>
  );
};

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
export const AppleArrangementGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/puzzles">
      {React.createElement(appleArrangementQuiz)}
    </GameWrapper>
);

// Wrapper for Orange Arrangement Game
export const OrangeArrangementGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/puzzles">
      {React.createElement(orangeArrangementQuiz)}
    </GameWrapper>
);

// Wrapper for Complex Orange Arrangement Game
export const OrangeComplexArrangementGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/puzzles">
      {React.createElement(orangeComplexArrangement)}
    </GameWrapper>
);

// Wrapper for Complex Giraffe Arrangement Game
export const GiraffeComplexArrangementGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/puzzles">
      {React.createElement(giraffeComplexArrangement)}
    </GameWrapper>
);
