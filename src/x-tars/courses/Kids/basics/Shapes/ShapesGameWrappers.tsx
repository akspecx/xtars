import React from "react";
import { useNavigate } from "react-router";

// Wrapper for Shapes Games Page (Coming Soon)
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
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 flex items-center justify-center animate-module-entry`}>
      <div className="text-center">
        <button
          onClick={handleBack}
          className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
        >
          ← Back to Hub
        </button>
        <div className="text-6xl sm:text-8xl mb-6">🔺</div>
        <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${theme.text}`}>Shapes</h2>
        <p className={`text-lg sm:text-xl ${theme.textSecondary}`}>This module is coming soon!</p>
      </div>
    </div>
  );
};

