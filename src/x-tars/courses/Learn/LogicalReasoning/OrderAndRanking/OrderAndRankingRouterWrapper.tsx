import React from "react";
import { useNavigate } from "react-router";
import ORAscendingDescending from "./ORAscendingDescendingOne";
import ORAscendingDescendingWeight from "./ORAscendingDescendingWeightTwo";
import ORAscendingDescendingFollowInstr from "./ORAscendingDescendingFollowInstrThree";
import ORAscendingHeightTallShort from "./ORAscendingHeightTallShortFour";
import ORAscendingDescendingComplex from "./ORAscendingDescendingComplexFive";
import  ORAscendingDescendingMultiScenarioNoFix from "./ORAscendingDescendingMultiScenarioNoFixSix";
import ORAscendingDescendingClubbingInstructions from "./ORAscendingDescendingClubbingInstructionsSeven";
import ORNumberOfPersons from "./ORNumberOfPersonsOne";
import ORNumberOfPersonsTwo from "./ORNumberOfPersonShiftingTwo";
import ORNumberOfPersonIfBothLeftRight from "./ORNumberOfPersonIfBothLeftRightThree";
import ORNOPRelativePositionForTwoUsers from "./ORNumberOfPersonsRelativePositionForTwoUsersFour";
import ORNOPPeopleWithDiffSide from "./ORNumberOfPersonsTwoPeopleWithDifferentSideFive";
import ORNOPMultiPeople from "./ORNumberOfPersonsMultiPeopleSix";
import ORNOPPeopleInterchangePos from "./ORNumberOfPersonsPositionInterchangeSeven";
import ORNOPWhoAnchor from "./ORNumberOfPersonsWhoAnchorEight";
import ORNOPClassRatio from "./ORNumberOfPersonsRatioNine"
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

export const ORAscendingDescendingRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescending 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORAscendingDescendingWeightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescendingWeight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORAscendingDescendingFollowInstrRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescendingFollowInstr 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORAscendingHeightTallShortRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingHeightTallShort 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORAscendingDescendingComplexRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescendingComplex 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORAscendingDescendingMultiScenarioNoFixRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescendingMultiScenarioNoFix 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};


export const ORAscendingDescendingClubbingInstructionsRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORAscendingDescendingClubbingInstructions 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNumberOfPersonsRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNumberOfPersons 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNumberOfPersonsShiftingRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNumberOfPersonsTwo 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNumberOfPersonIfBothLeftRightRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNumberOfPersonIfBothLeftRight 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPRelativePositionForTwoUsersRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNOPRelativePositionForTwoUsers 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPPeopleWithDiffSideRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNOPPeopleWithDiffSide 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPMultiPeopleRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNOPMultiPeople 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPPeopleInterchangePosRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNOPPeopleInterchangePos 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPWhoAnchorRouter: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/learn/logicalReasoning/orderRanking");
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
    <ORNOPWhoAnchor 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

export const ORNOPClassRatioRouter: React.FC = () => {
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
    <ORNOPClassRatio 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

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













