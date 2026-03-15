import React from "react";
import { useNavigate } from "react-router";
import PercentageIntro from "./PercentageIntroOne";
import PercentageCalculation from "./PercentageCalculationTwo"; 
import PercentageFraction from "./PercentageMostCommonFractionsThree";
import PercentageFindPerc from "./PercentageSettingGoldenRuleFour";
import PercentagePercGame from "./PercentageCalculationGameFive";
import PercentagePercFromTotal from "./FindingPercentageOFTotalSix";
import PercentagePercKnownGeneric from "./CreatingPercentageGeneralFormulaSeven";
import PercentagePercValueGodlenFormula from "./PercentageMeaningSetUpEight";
import PercentagePercIncreasedBy from "./PercentageIncreasedByConceptNine";
import PercentagePercDecreasedBy from "./PercentageDecreasedByTen";
import PercentagePercIncreasedDecreased from "./PercentageIncreasedDecreasedSimultaneouslyEleven";

// import AlgebraMainModule from "../maths/AlgebraicExpression/AlgebraMainModule"
// import MathsMainModule from "./PercentageMainModule"
// import PercentageMainModule from "./Percentage/PercentageMainModule"
// import SacredGame from "./puzzlesModule/TheSacredGame"


// To handle back from Maths page

// /learn/mathematics/percentage/introduction


export const PercentageIntroRouter: React.FC = () => {
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
      <PercentageIntro 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

export const PercentageCalculationRouter: React.FC = () => {
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
      <PercentageCalculation 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };


export const PercentageFractionRouter: React.FC = () => {
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
      <PercentageFraction 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };


export const PercentageFindPercRouter: React.FC = () => {
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
      <PercentageFindPerc 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

export const PercentagePercGameRouter: React.FC = () => {
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
      <PercentagePercGame 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

export const PercentagePercFromTotalRouter: React.FC = () => {
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
      <PercentagePercFromTotal 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const PercentagePercKnownGenericRouter: React.FC = () => {
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
      <PercentagePercKnownGeneric 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };


  export const PercentagePercValueGodlenFormulaRouter: React.FC = () => {
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
      <PercentagePercValueGodlenFormula 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const PercentagePercIncreasedByRouter: React.FC = () => {
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
      <PercentagePercIncreasedBy 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };


  export const PercentagePercDecreasedByRouter: React.FC = () => {
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
      <PercentagePercDecreasedBy 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };

  export const PercentagePercIncreasedDecreasedRouter: React.FC = () => {
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
      <PercentagePercIncreasedDecreased 
        onBack={handleBack}
        theme={theme}
        title="Numbers"
        icon="🔢"
      />
    );
  };