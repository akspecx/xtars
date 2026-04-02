import React from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../../../context/ProfileContext";

const AnimalMatching = React.lazy(() => import("./AnimalMatching"));
const FruitsMatching = React.lazy(() => import("./FruitsMatching"));
const NumberMatching = React.lazy(() => import("./NumberMatching"));
const MemoryBuildingMainPage = React.lazy(() => import("./MemoryBuildingMainPage"));

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
          ← Back to Memory Games Menu
        </button>
      )}
      {children}
    </div>
  );
};

// Wrapper for Memory Games Page (standalone route)
export const MemoryGamesPageWrapper: React.FC = () => {
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
    <MemoryBuildingMainPage 
      onBack={handleBack}
      theme={theme}
      title="Memory Game"
      icon="🧠"
    />
  );
};

// Wrapper for Animal Matching Game
export const AnimalMatchingGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/memory">
      <AnimalMatching />
    </GameWrapper>
);

// Wrapper for Fruits Matching Game
export const FruitsMatchingGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/memory">
      <FruitsMatching />
    </GameWrapper>
);

// Wrapper for Number Matching Game
export const NumberMatchingGameWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/memory">
      <NumberMatching />
    </GameWrapper>
);
