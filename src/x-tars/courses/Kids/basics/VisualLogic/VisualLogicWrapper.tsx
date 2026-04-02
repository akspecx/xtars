import React, { Suspense } from "react";
import { useNavigate } from "react-router";
import { GameWrapper } from "../Numbers/NumbersGameWrappers";

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

const LoadingFallback: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="text-xl font-bold animate-pulse text-gray-400">Loading Game...</div>
  </div>
);

// Theme for Visual Logic
const visualLogicTheme = {
  background: 'from-gray-900 to-black',
  surface: 'bg-gray-800 border-gray-700',
  surfaceHover: 'hover:bg-gray-700',
  text: 'text-white',
  textSecondary: 'text-gray-300',
  border: 'border-gray-700',
  shadow: 'shadow-lg shadow-black/50'
};

// Wrapper for Visual Logic Games Page (standalone route)
export const VisualLogicGamesPageWrapper: React.FC = () => {
    const navigate = useNavigate();
    
    const handleBack = () => {
      navigate("/games");
    };
  
    return (
      <Suspense fallback={<LoadingFallback />}>
        <VisualLogicLandingPage 
          onBack={handleBack}
          theme={visualLogicTheme}
          title="Visual Logic"
          icon="🧠"
        />
      </Suspense>
    );
  };

// Reusable Component Wrapper for Visual Logic sub-games
const VisualLogicGame: React.FC<{ Component: React.LazyExoticComponent<React.FC<any>> }> = ({ Component }) => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GameWrapper 
        onBack={() => navigate("/games/visuallogic")}
        theme={visualLogicTheme}
        title="Visual Logic Hub"
        icon="🧠"
      >
        <Component />
      </GameWrapper>
    </Suspense>
  );
};

export const VisualLogicSameWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingofSamePictures} />;
export const VisualLogicAboveAndBelowWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfAboveAndBelow} />;
export const VisualLogicTallAndShortWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfTallAndShort} />;
export const VisualLogicTallWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfTall} />;
export const VisualLogicShortWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfShort} />;
export const VisualLogicFullAndEmptyWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfFullAndEmpty} />;
export const VisualLogicFullWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfFull} />;
export const VisualLogicEmptyWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfEmpty} />;
export const VisualLogicDifferentWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfDifferent} />;
export const VisualLogicBigWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfBig} />;
export const VisualLogicSmallWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingofSmall} />;
export const VisualLogicAboveWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfAbove} />;
export const VisualLogicBelowWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfBelow} />;
export const VisualLogicAboveAndBelowMixWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfAboveAndBelow} />;
export const VisualLogicBigAndSmallMixWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfBigAndSmallMix} />;
export const VisualLogicInsideWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfInside} />;
export const VisualLogicOutsideWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfOutside} />;
export const VisualLogicInsideAndOutsideMixWrapper: React.FC = () => <VisualLogicGame Component={UnderstandingOfInsideAndOutsideMix} />;