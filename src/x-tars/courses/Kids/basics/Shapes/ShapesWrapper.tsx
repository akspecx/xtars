import React from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../../../context/ProfileContext";

const ShapesIntroduction = React.lazy(() => import("./ShapesIntroduction"));
const ShapesLandingPage = React.lazy(() => import("./ShapesLandingPage"));
const BearShapeIntro = React.lazy(() => import("./BearShapeIntro"));
const BusShapes = React.lazy(() => import("./BusShapes"));
const TreeHomeShapeIntro = React.lazy(() => import("./TreeHomeShapeIntro"));

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
          ← Back to Shapes Menu
        </button>
      )}
      {children}
    </div>
  );
};

// Wrapper for Shapes Landing Page
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
        title="Shapes"
        icon="🔺"
      />
    );
  };
  
  // Wrapper for Shapes Introduction
  export const ShapesIntroductionWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/shapes">
      <ShapesIntroduction />
    </GameWrapper>
  );

  export const ShapesBearWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/shapes">
      <BearShapeIntro />
    </GameWrapper>
  );

  export const ShapesBusWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/shapes">
      <BusShapes />
    </GameWrapper>
  );

  export const ShapesTreeWrapper: React.FC = () => (
    <GameWrapper menuPath="/games/shapes">
      <TreeHomeShapeIntro />
    </GameWrapper>
  );