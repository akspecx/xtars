import React from "react";
import { useNavigate } from "react-router";
import AlgebraicIntroduction from "./InteractiveAlgebraicIntroduction";
import FindingtheUnknownIntroduction from "./FindingtheUnknownIntroduction"
// import MathsMainModule from "./MathsMainModule"
// import SacredGame from "./puzzlesModule/TheSacredGame"


// To handle back from Maths page

export const AlgebraicIntroductionRouter: React.FC = () => {
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
      <FindingtheUnknownIntroduction 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

// export const MathsMainRouter: React.FC = () => {
//     const navigate = useNavigate();
    
//     const handleBack = () => {
//       navigate("/learn/mathematics");
//     };
  
//     // Default theme (dark theme)
//     const theme = {
//       background: 'from-gray-900 to-black',
//       surface: 'bg-gray-800 border-gray-700',
//       surfaceHover: 'hover:bg-gray-700',
//       text: 'text-white',
//       textSecondary: 'text-gray-300',
//       border: 'border-gray-700',
//       shadow: 'shadow-lg shadow-black/50'
//     };
  
//     return (
//       <MathsMainModule 
//         onBack={handleBack}
//         theme={theme}
//         title="Numbers"
//         icon="🔢"
//       />
//     );
//   };

//   export const AlgebraicExpressionRouter: React.FC = () => {
//     const navigate = useNavigate();
    
//     const handleBack = () => {
//       navigate("/learn/mathematics/");
//     };
  
//     // Default theme (dark theme)
//     const theme = {
//       background: 'from-gray-900 to-black',
//       surface: 'bg-gray-800 border-gray-700',
//       surfaceHover: 'hover:bg-gray-700',
//       text: 'text-white',
//       textSecondary: 'text-gray-300',
//       border: 'border-gray-700',
//       shadow: 'shadow-lg shadow-black/50'
//     };
  
//     return (
//       <AlgebraMainModule 
//         onBack={handleBack}
//         theme={theme}
//         title="Numbers"
//         icon="🔢"
//       />
//     );
//   };