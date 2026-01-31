import React from "react";
import { useNavigate } from "react-router";
import LearnMainModule from "./LearnMainModule";
import MathsMainModule from "./maths/MathsMainModule"
import LogicalReasoningMainModule from "./LogicalReasoning/LogicalReasoningMainModule"
import DataInterpretationMain from "./DataInterpretation/DIMainModule"
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


export const LearnMathsRouter: React.FC = () => {
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
    <MathsMainModule 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LogicalReasoningMainRouter: React.FC = () => {
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
    <LogicalReasoningMainModule 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DataInterpretationMainRouter: React.FC = () => {
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
    <DataInterpretationMain 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

