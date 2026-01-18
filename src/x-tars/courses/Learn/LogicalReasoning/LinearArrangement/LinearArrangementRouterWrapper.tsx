import React from "react";
import { useNavigate } from "react-router";
import LinearArrangementIntro from "./LinearArrangementIntro";
import LinearArrangementLeftRight from "./LinearArrangementLeftRight";
import LADirectionMattersLeftRight from "./LinearArrangementDirectionMattersLeftRight";
import ImmediateRightAndLeft from "./ImmediateRightAndLeft";
import LinearArrangementBetween from "./LinearArrangementBetween";
import  LAFirstSecondLeftRight from "./LinearArrangementFirstSecondLeftRight";
import LANumberOfPeopleSittingBetween from "./LinearArrangementNumberOfPeopleSittingBetween";
import LAExtremeLeftRight from "./LinearArrangementExtremeLeftRight";
import LAFollowInstructionIntro from "./LAFollowInstructionIntro"
import LAFollowInstructionRight from "./LAFollowInstructionRight";
import LAFollowInstructionLeftRightBoth from "./LAFollowInstructionLeftRightBoth";
import LAFollowInstructionDirectionLeftRight from "./LAFollowInstructionDirectionLeftRight";
import LAFollowingInstructionWithBetweenAndExtremeEnd from "./LAFollowingInstructionWithBetweenAndExtremeEnd";
import LAFollowingInstructionDiffDirectionIntermediate from "./LAFollowingInstructionDiffDirectionIntermediate";
import LAFollowingInstructionComplexityHigh from "./LAFollowingInstructionComplexityHigh";
import LAActualWorldIntro from "./LAActualWorldIntro"
import LAActualWorldNorth from "./LAActualWorldFacingNorth"
import LAActualWorldSouth from "./LAActualWorldFacingSouth"
import LAActualWorldSittingParallel from "./LAActualWorldSittingInParallel"

// To handle back from Maths page

export const LinearArrangementIntroductionRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LinearArrangementIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LinearArrangementLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LinearArrangementLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LADirectionMattersLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LADirectionMattersLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ImmediateRightAndLeftRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <ImmediateRightAndLeft 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LinearArrangementBetweenRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LinearArrangementBetween 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFirstSecondLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFirstSecondLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};


export const LANumberOfPeopleSittingBetweenRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LANumberOfPeopleSittingBetween 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAExtremeLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAExtremeLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowInstructionIntroRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowInstructionIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowInstructionRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowInstructionRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowInstructionLeftRightBothRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowInstructionLeftRightBoth 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowInstructionDirectionLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowInstructionDirectionLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowingInstructionWithBetweenAndExtremeEndRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowingInstructionWithBetweenAndExtremeEnd 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowingInstructionDiffDirectionIntermediateRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowingInstructionDiffDirectionIntermediate 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAFollowingInstructionComplexityHighRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAFollowingInstructionComplexityHigh 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAActualWorldIntroHighRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAActualWorldIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAActualWorldNorthRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAActualWorldNorth 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAActualWorldSouthRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAActualWorldSouth 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LAActualWorldSittingParallelRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/LinearArrangement");
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
    <LAActualWorldSittingParallel 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};










