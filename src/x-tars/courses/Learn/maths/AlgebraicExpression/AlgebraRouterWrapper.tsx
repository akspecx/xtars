import React from "react";
import { useNavigate } from "react-router";
import AlgebraicIntroduction from "./InteractiveAlgebraicIntroduction";
import FindingtheUnknownIntroduction from "./FindingtheUnknownIntroduction"
import RightScaleWeight from "./RightScaleWeight"
import LhsrhsIntroduction from "./lhsrhsIntroduction"
import AELikeUnlikeTerms from "./AELikeUnlikeTerms"
import MonoBinoPolyIdentification from "./MonoBinoPolyIdentification"


// To handle back from Maths page

export const AlgebraicIntroductionRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/mathematics/algebra");
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
    <AlgebraicIntroduction 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const FindingWeightUnknowRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/algebra");
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
      <FindingtheUnknownIntroduction 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

export const RightScaleRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/algebra");
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
      <RightScaleWeight 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const LhsrhsIntroductionRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/algebra");
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
      <LhsrhsIntroduction 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const AELikeUnlikeTermsRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/algebra");
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
      <AELikeUnlikeTerms 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const MonoBinoPolyIdentificationRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/algebra");
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
      <MonoBinoPolyIdentification 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };