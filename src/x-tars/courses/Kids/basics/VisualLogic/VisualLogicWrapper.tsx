import React from "react";
import { useNavigate } from "react-router";
import VisualLogicLandingPage from "./VisualLogicLandingPage";
import UnderstandingofSamePictures from "./UnderstandingofSamePictures";
import UnderstandingOfAbove from "./UnderstandingOfAbove";
import UnderstandingOfBelow from "./UnderstandingOfBelow";
import UnderstandingOfAboveAndBelow from "./UnderstandingOfAboveAndBelow";
import UnderstandingOfTallAndShort from "./UnderstandingOfTallAndShort";
import UnderstandingOfWideAndNarrow from "./UnderstandingOfWideAndNarrow";
import UnderstandingOfHeavyAndLight from "./UnderstandingOfHeavyAndLight";
import UnderstandingOfFullAndEmpty from "./UnderstandingOfFullAndEmpty";
import UnderstandingOfInsideAndOutside from "./UnderstandingOfInsideAndOutside";
import UnderstandingOfDifferent from "./UnderstandingOfDifferent";
import UnderstandingOfBig from "./UnderstandingOfBig";
import UnderstandingofSmall from "./UnderstandingofSmall";
import UnderstandingOfBigAndSmallMix from "./UnderstandingOfBigAndSmallMix";
import UnderstandingOfHeavy from "./UnderstandingOfHeavy";
import UnderstandingOfLight from "./UnderstandingOfLight";
import UnderstandingOfHeavyAndLightMix from "./UnderstandingOfHeavyAndLightMix";
import UnderstandingOfWide from "./UnderstandingOfWide";
import UnderstandingOfNarrow from "./UnderstandingOfNarrow";
import UnderstandingOfWideAndNarrowMix from "./UnderstandingOfWideAndNarrowMix";
import UnderstandingOfInside from "./UnderstandingOfInside";
import UnderstandingOfOutside from "./UnderstandingOfOutside";
import UnderstandingOfInsideAndOutsideMix from "./UnderstandingOfInsideAndOutsideMix";

// Wrapper for Visual Logic Games Page (standalone route)
export const VisualLogicGamesPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games");
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
      <VisualLogicLandingPage 
        onBack={handleBack}
        theme={theme}
        title="Visual Logic"
        icon="🧠"
      />
    );
  };

  // Wrapper for Understanding of Same
  export const VisualLogicSameWrapper: React.FC = () => {
    return <UnderstandingofSamePictures />;
  };
  
  // Wrapper for Understanding of Above and Below
  export const VisualLogicAboveAndBelowWrapper: React.FC = () => {
    return <UnderstandingOfAboveAndBelow />;
  };
  
  // Wrapper for Understanding of Tall and Short
  export const VisualLogicTallAndShortWrapper: React.FC = () => {
    return <UnderstandingOfTallAndShort />;
  };
  
  // Wrapper for Understanding of Wide and Narrow
  export const VisualLogicWideAndNarrowWrapper: React.FC = () => {
    return <UnderstandingOfWideAndNarrow />;
  };
  
  // Wrapper for Understanding of Heavy and Light
  export const VisualLogicHeavyAndLightWrapper: React.FC = () => {
    return <UnderstandingOfHeavyAndLight />;
  };
  
  // Wrapper for Understanding of Full and Empty
  export const VisualLogicFullAndEmptyWrapper: React.FC = () => {
    return <UnderstandingOfFullAndEmpty />;
  };
  
  // Wrapper for Understanding of Inside and Outside
  export const VisualLogicInsideAndOutsideWrapper: React.FC = () => {
    return <UnderstandingOfInsideAndOutside />;
  };
  
  // Wrapper for Understanding of Different
  export const VisualLogicDifferentWrapper: React.FC = () => {
    return <UnderstandingOfDifferent />;
  };
  
  // Wrapper for Understanding of Big
  export const VisualLogicBigWrapper: React.FC = () => {
    return <UnderstandingOfBig />;
  };
  
  // Wrapper for Understanding of Small
  export const VisualLogicSmallWrapper: React.FC = () => {
    return <UnderstandingofSmall />;
  };
  
  // Wrapper for Understanding of Above
  export const VisualLogicAboveWrapper: React.FC = () => {
    return <UnderstandingOfAbove />;
  };
  
  // Wrapper for Understanding of Below
  export const VisualLogicBelowWrapper: React.FC = () => {
    return <UnderstandingOfBelow />;
  };
  
  // Wrapper for Understanding of Above and Below Mix
  export const VisualLogicAboveAndBelowMixWrapper: React.FC = () => {
    return <UnderstandingOfAboveAndBelow />;
  };
  
  // Wrapper for Understanding of Big and Small Mix
  export const VisualLogicBigAndSmallMixWrapper: React.FC = () => {
    return <UnderstandingOfBigAndSmallMix />;
  };
  
  // Wrapper for Understanding of Heavy
  export const VisualLogicHeavyWrapper: React.FC = () => {
    return <UnderstandingOfHeavy />;
  };
  
  // Wrapper for Understanding of Light
  export const VisualLogicLightWrapper: React.FC = () => {
    return <UnderstandingOfLight />;
  };
  
  // Wrapper for Understanding of Heavy and Light Mix
  export const VisualLogicHeavyAndLightMixWrapper: React.FC = () => {
    return <UnderstandingOfHeavyAndLightMix />;
  };
  
  // Wrapper for Understanding of Wide
  export const VisualLogicWideWrapper: React.FC = () => {
    return <UnderstandingOfWide />;
  };
  
  // Wrapper for Understanding of Narrow
  export const VisualLogicNarrowWrapper: React.FC = () => {
    return <UnderstandingOfNarrow />;
  };
  
  // Wrapper for Understanding of Wide and Narrow Mix
  export const VisualLogicWideAndNarrowMixWrapper: React.FC = () => {
    return <UnderstandingOfWideAndNarrowMix />;
  };
  
  // Wrapper for Understanding of Inside
  export const VisualLogicInsideWrapper: React.FC = () => {
    return <UnderstandingOfInside />;
  };
  
  // Wrapper for Understanding of Outside
  export const VisualLogicOutsideWrapper: React.FC = () => {
    return <UnderstandingOfOutside />;
  };
  
  // Wrapper for Understanding of Inside and Outside Mix
  export const VisualLogicInsideAndOutsideMixWrapper: React.FC = () => {
    return <UnderstandingOfInsideAndOutsideMix />;
  };