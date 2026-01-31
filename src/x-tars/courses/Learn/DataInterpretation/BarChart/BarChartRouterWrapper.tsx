import React from "react";
import { useNavigate } from "react-router";
import BarChartIntro from "./BarChartIntro";
import TheLargestAndSmallest from "./TheLargestAndSmallest";
import IncreaseTheScaleTo2 from "./IncreaseTheScaleTo2";
import FindingAnomaliesInBarChart from "./FindingAnomaliesInBarChart";
import CreateBarChart from "./CreateBarChart";
import  DoubleBarChartTwoClass from "./DoubleBarChartTwoClass";
import DoubleBarComparisonIntro from "./DoubleBarComparisonIntro";
import DoubleBCCumulativeDataAnalysis from "./DoubleBarChartCumulativeDataAnalysis";
// import LAFollowInstructionIntro from "./LAFollowInstructionIntro"
// import LAFollowInstructionRight from "./LAFollowInstructionRight";
// import LAFollowInstructionLeftRightBoth from "./LAFollowInstructionLeftRightBoth";
// import LAFollowInstructionDirectionLeftRight from "./LAFollowInstructionDirectionLeftRight";
// import LAFollowingInstructionWithBetweenAndExtremeEnd from "./LAFollowingInstructionWithBetweenAndExtremeEnd";
// import LAFollowingInstructionDiffDirectionIntermediate from "./LAFollowingInstructionDiffDirectionIntermediate";
// import LAFollowingInstructionComplexityHigh from "./LAFollowingInstructionComplexityHigh";
// import LAActualWorldIntro from "./LAActualWorldIntro"
// import LAActualWorldNorth from "./LAActualWorldFacingNorth"
// import LAActualWorldSouth from "./LAActualWorldFacingSouth"
// import LAActualWorldSittingParallel from "./LAActualWorldSittingInParallel"
// import LAActualWorldDirectionDoesNotMatter from "./LAActualWorldDirectionDoesNotMatter"
// import LAActualWorldMultipleCaseIntro from "./LAActualWorldMultipleCaseIntro"
// import LAActualWorldMultipleCaseIntermediate from "./LAActualWorldMultipleCaseIntermediate"
// import LAActualWorld2DIntro from "./LAActualWorld2DIntro"
// import LAActualWorld3DIntro from "./LAActualWorld3DIntro"
// import LAInstructionGyaanAnchor from "./LAInstructionGyaanAnchor"
// import LAInstructionGyaanAnchorFromMultipleInstr from "./LAInstructionGyaanAnchorFromMultipleInstr"
// import LAInstructionGyaanLeadingToAnchor from "./LAInstructionGyaanLeadingToAnchor"
// import LAInstructionGyaanUseMultipleInstrForAnchor from "./LAInstructionGyaanUseMultipleInstrForAnchor"

// To handle back from Maths page

export const BarChartIntroRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/dataInterpretation/barChart");
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
    <BarChartIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const TheLargestAndSmallestRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/dataInterpretation/barChart");
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
    <TheLargestAndSmallest 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const IncreaseTheScaleTo2Router: React.FC = () => {
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
    <IncreaseTheScaleTo2 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const FindingAnomaliesInBarChartRouter: React.FC = () => {
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
    <FindingAnomaliesInBarChart 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const CreateBarChartRouter: React.FC = () => {
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
    <CreateBarChart 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBarChartTwoClassRouter: React.FC = () => {
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
    <DoubleBarChartTwoClass 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};


export const DoubleBarComparisonIntroRouter: React.FC = () => {
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
    <DoubleBarComparisonIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBCCumulativeDataAnalysisRouter: React.FC = () => {
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
    <DoubleBCCumulativeDataAnalysis 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

// export const LAFollowInstructionIntroRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowInstructionIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowInstructionRightRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowInstructionRight 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowInstructionLeftRightBothRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowInstructionLeftRightBoth 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowInstructionDirectionLeftRightRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowInstructionDirectionLeftRight 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowingInstructionWithBetweenAndExtremeEndRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowingInstructionWithBetweenAndExtremeEnd 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowingInstructionDiffDirectionIntermediateRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowingInstructionDiffDirectionIntermediate 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAFollowingInstructionComplexityHighRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAFollowingInstructionComplexityHigh 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldIntroHighRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldNorthRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldNorth 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldSouthRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldSouth 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldDirectionDoesNotMatterRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldDirectionDoesNotMatter 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldSittingParallelRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldSittingParallel 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldMultipleCaseIntroRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldMultipleCaseIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorldMultipleCaseIntermediateRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorldMultipleCaseIntermediate 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorld2DIntroRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorld2DIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAActualWorld3DIntroRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAActualWorld3DIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAInstructionGyaanAnchorRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAInstructionGyaanAnchor 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAInstructionGyaanAnchorFromMultipleInstrRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAInstructionGyaanAnchorFromMultipleInstr 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };


// export const LAInstructionGyaanLeadingToAnchorRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAInstructionGyaanLeadingToAnchor 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const LAInstructionGyaanUseMultipleInstrForAnchorRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/logicalReasoning/LinearArrangement");
//   };

//   // Default theme (dark theme)
//   const theme = {
//     background: 'from-gray-900 to-black',
//     surface: 'bg-gray-800 border-gray-700',
//     surfaceHover: 'hover:bg-gray-700',
//     text: 'text-white',
//     textSecondary: 'text-gray-300',
//     border: 'border-gray-700',
//     shadow: 'shadow-lg shadow-black/50'
//   };

//   return (
//     <LAInstructionGyaanUseMultipleInstrForAnchor 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };













