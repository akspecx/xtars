import React from "react";
import { useNavigate } from "react-router";
import LineChartIntro from "./LineChartIntroOne";
import LineChartCreate from "./LineChartCreateTwo";
import LineChartDiffSmall from "./LineChartMinDiffThree";
// import FindingAnomaliesInBarChart from "./FindingAnomaliesInBarChart";
// import CreateBarChart from "./CreateBarChart";
// import  DoubleBarChartTwoClass from "./DoubleBarChartTwoClass";
// import DoubleBarComparisonIntro from "./DoubleBarComparisonIntro";
// import DoubleBCCumulativeDataAnalysis from "./DoubleBarChartCumulativeDataAnalysis";
// import DoubleBarChartMissingBars from "./DoubleBarChartMissingBars"
// import DoubleBCMoreComplexAnalysis from "./DoubleBarChartMoreComplexAnalysis";
// import DoubleBarChartComputationMinAvgOne from "./DoubleBarChartComputationMinAvgOne";
// import DoubleBCComputationRatioPercentageTwo from "./DoubleBarChartComputationRatioPercentageTwo";
// import DoubleBarChartProfitLossSeven from "./DoubleBarChartComputationProfitLossSeven";
// import AdvancedBarChartStackedOne from "./AdvancedBarChartStackedOne";
// import AdvancedBarChartTradeTwo from "./AdvancedBarChartTradeTwo";
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

export const LineChartIntroRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/dataInterpretation/lineChart");
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
    <LineChartIntro 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LineChartCreateRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/dataInterpretation/lineChart");
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
    <LineChartCreate 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const LineChartDiffSmallRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/dataInterpretation/lineChart");
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
    <LineChartDiffSmall 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

// export const FindingAnomaliesInBarChartRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <FindingAnomaliesInBarChart 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const CreateBarChartRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <CreateBarChart 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBarChartTwoClassRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBarChartTwoClass 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };


// export const DoubleBarComparisonIntroRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBarComparisonIntro 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBCCumulativeDataAnalysisRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBCCumulativeDataAnalysis 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBarChartMissingBarsRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBarChartMissingBars 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBCMoreComplexAnalysisRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBCMoreComplexAnalysis 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBarChartComputationMinAvgRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBarChartComputationMinAvgOne 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBCComputationRatioPercentageRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBCComputationRatioPercentageTwo 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const DoubleBarChartProfitLossRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <DoubleBarChartProfitLossSeven 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const AdvancedBarChartStackedOneRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <AdvancedBarChartStackedOne 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };

// export const AdvancedBarChartTradeTwoRouter: React.FC = () => {
//   const navigate = useNavigate();
  
//   const handleBack = () => {
//     navigate("/learn/dataInterpretation/barChart");
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
//     <AdvancedBarChartTradeTwo 
//       onBack={handleBack}
//       theme={theme}
//       title="Numbers"
//       icon="🔢"
//     />
//   );
// };













