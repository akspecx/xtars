import React from "react";
import { useNavigate } from "react-router";
const BarChartIntro = React.lazy(() => import("./BarChartIntro"));
const TheLargestAndSmallest = React.lazy(() => import("./TheLargestAndSmallest"));
const IncreaseTheScaleTo2 = React.lazy(() => import("./IncreaseTheScaleTo2"));
const FindingAnomaliesInBarChart = React.lazy(() => import("./FindingAnomaliesInBarChart"));
const CreateBarChart = React.lazy(() => import("./CreateBarChart"));
const DoubleBarChartTwoClass = React.lazy(() => import("./DoubleBarChartTwoClass"));
const DoubleBarComparisonIntro = React.lazy(() => import("./DoubleBarComparisonIntro"));
const DoubleBCCumulativeDataAnalysis = React.lazy(() => import("./DoubleBarChartCumulativeDataAnalysis"));
const DoubleBarChartMissingBars = React.lazy(() => import("./DoubleBarChartMissingBars"));
const DoubleBCMoreComplexAnalysis = React.lazy(() => import("./DoubleBarChartMoreComplexAnalysis"));
const DoubleBarChartComputationMinAvgOne = React.lazy(() => import("./DoubleBarChartComputationMinAvgOne"));
const DoubleBCComputationRatioPercentageTwo = React.lazy(() => import("./DoubleBarChartComputationRatioPercentageTwo"));
const DoubleBarChartProfitLossSeven = React.lazy(() => import("./DoubleBarChartComputationProfitLossSeven"));
const AdvancedBarChartStackedOne = React.lazy(() => import("./AdvancedBarChartStackedOne"));
const AdvancedBarChartTradeTwo = React.lazy(() => import("./AdvancedBarChartTradeTwo"));
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
    <DoubleBCCumulativeDataAnalysis 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBarChartMissingBarsRouter: React.FC = () => {
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
    <DoubleBarChartMissingBars 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBCMoreComplexAnalysisRouter: React.FC = () => {
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
    <DoubleBCMoreComplexAnalysis 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBarChartComputationMinAvgRouter: React.FC = () => {
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
    <DoubleBarChartComputationMinAvgOne 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBCComputationRatioPercentageRouter: React.FC = () => {
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
    <DoubleBCComputationRatioPercentageTwo 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const DoubleBarChartProfitLossRouter: React.FC = () => {
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
    <DoubleBarChartProfitLossSeven 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const AdvancedBarChartStackedOneRouter: React.FC = () => {
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
    <AdvancedBarChartStackedOne 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const AdvancedBarChartTradeTwoRouter: React.FC = () => {
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
    <AdvancedBarChartTradeTwo 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

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













