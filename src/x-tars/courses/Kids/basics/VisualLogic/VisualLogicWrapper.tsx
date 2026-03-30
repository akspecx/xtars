import React from "react";
import { useNavigate } from "react-router";
const VisualLogicLandingPage = React.lazy(() => import("./VisualLogicLandingPage"));
const UnderstandingofSamePictures = React.lazy(() => import("./UnderstandingofSamePictures"));
const UnderstandingOfAbove = React.lazy(() => import("./UnderstandingOfAbove"));
const UnderstandingOfBelow = React.lazy(() => import("./UnderstandingOfBelow"));
const UnderstandingOfAboveAndBelow = React.lazy(() => import("./UnderstandingOfAboveAndBelow"));
const UnderstandingOfTallAndShort = React.lazy(() => import("./UnderstandingOfTallAndShort"));
const UnderstandingOfTall = React.lazy(() => import("./UnderstandingOfTall"));
const UnderstandingOfShort = React.lazy(() => import("./UnderstandingOfShort"));
const UnderstandingOfFullAndEmpty = React.lazy(() => import("./UnderstandingOfFullAndEmpty"));
const UnderstandingOfFull = React.lazy(() => import("./UnderstandingOfFull"));
const UnderstandingOfEmpty = React.lazy(() => import("./UnderstandingOfEmpty"));
const UnderstandingOfDifferent = React.lazy(() => import("./UnderstandingOfDifferent"));
const UnderstandingOfBig = React.lazy(() => import("./UnderstandingOfBig"));
const UnderstandingofSmall = React.lazy(() => import("./UnderstandingofSmall"));
const UnderstandingOfBigAndSmallMix = React.lazy(() => import("./UnderstandingOfBigAndSmallMix"));
const UnderstandingOfInside = React.lazy(() => import("./UnderstandingOfInside"));
const UnderstandingOfOutside = React.lazy(() => import("./UnderstandingOfOutside"));
const UnderstandingOfInsideAndOutsideMix = React.lazy(() => import("./UnderstandingOfInsideAndOutsideMix"));

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
  
  // Wrapper for Understanding of Tall
  export const VisualLogicTallWrapper: React.FC = () => {
    return <UnderstandingOfTall />;
  };
  
  // Wrapper for Understanding of Short
  export const VisualLogicShortWrapper: React.FC = () => {
    return <UnderstandingOfShort />;
  };
  
  // Wrapper for Understanding of Full and Empty
  export const VisualLogicFullAndEmptyWrapper: React.FC = () => {
    return <UnderstandingOfFullAndEmpty />;
  };
  
  // Wrapper for Understanding of Full
  export const VisualLogicFullWrapper: React.FC = () => {
    return <UnderstandingOfFull />;
  };
  
  // Wrapper for Understanding of Empty
  export const VisualLogicEmptyWrapper: React.FC = () => {
    return <UnderstandingOfEmpty />;
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