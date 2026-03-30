import React from "react";
import { useNavigate } from "react-router";
const LearnMainModule = React.lazy(() => import("../LearnMainModule"));
const AlgebraMainModule = React.lazy(() => import("../maths/AlgebraicExpression/AlgebraMainModule"));
const MathsMainModule = React.lazy(() => import("./MathsMainModule"));
const PercentageMainModule = React.lazy(() => import("./Percentage/PercentageMainModule"));
// import SacredGame from "./puzzlesModule/TheSacredGame"


// To handle back from Maths page


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

  export const AlgebraicExpressionRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/");
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
      <AlgebraMainModule 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

   export const PercentageRouter: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/learn/mathematics/percentage");
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
      <PercentageMainModule 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };