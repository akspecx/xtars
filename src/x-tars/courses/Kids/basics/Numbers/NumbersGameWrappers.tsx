import React from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../../../context/ProfileContext";

export interface GameWrapperProps {
  children: React.ReactNode;
  menuPath?: string;
  onBack?: () => void;
  theme?: any;
  title?: string;
  icon?: string;
}

// Shared Wrapper to handle conditional navigation visibility
export const GameWrapper: React.FC<GameWrapperProps> = ({ 
  children, 
  menuPath, 
  onBack,
  theme,
  title,
  icon
}) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  
  const handleBack = onBack || (() => menuPath && navigate(menuPath));

  return (
    <div className="min-h-screen">
      {activeProfile?.type !== 'KIDS' && handleBack && (
        <button
          onClick={handleBack}
          className={`absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full border shadow-md transition-all duration-300 ${
            theme?.surface || 'bg-white dark:bg-gray-800'
          } ${theme?.text || 'text-gray-900 dark:text-white'} ${
            theme?.border || 'border-gray-200 dark:border-gray-700'
          } ${theme?.surfaceHover || 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          {icon || '←'} {title ? `Back to ${title}` : 'Back to Menu'}
        </button>
      )}
      {children}
    </div>
  );
};

const TrainMovingArrangingNumbers = React.lazy(() => import("./age4-5/TrainMovingArrangingNumbers"));
const FillInTheBlanksTrainModule = React.lazy(() => import("./age4-5/FillInTheBlanksTrainModule"));
const DescendingOrder = React.lazy(() => import("./age5-6/DescendingOrder"));
const NumberIdentification = React.lazy(() => import("./age3-4/NumberIdentification"));
const NumberTracing = React.lazy(() => import("./age4-5/NumberTracing"));
const NumberCounting = React.lazy(() => import("./age3-4/NumberCounting"));
const NumbersIntroduction = React.lazy(() => import("./age3-4/NumbersIntroduction"));
const NumberFocus = React.lazy(() => import("./age3-4/NumberFocus"));

// Age-grouped Numbers games
const DotDashRockets = React.lazy(() => import("./age3-4/DotDashRockets"));
const LadybugSpotsMatch = React.lazy(() => import("./age3-4/LadybugSpotsMatch"));
const MoreUnderstanding = React.lazy(() => import("./age3-4/MoreUnderstanding"));
const LessUnderstanding = React.lazy(() => import("./age3-4/LessUnderstanding"));
const CleanUpCount = React.lazy(() => import("./age3-4/CleanUpCount"));
const ZeroTheHero = React.lazy(() => import("./age3-4/ZeroTheHero"));
const PizzaPartySharing = React.lazy(() => import("./age3-4/PizzaPartySharing"));
const CoinCollector = React.lazy(() => import("./age3-4/CoinCollector"));
const UnderstandingEqual = React.lazy(() => import("./age3-4/UnderstandingEqual"));

const NumberBridgeBuilder = React.lazy(() => import("./age4-5/NumberBridgeBuilder"));
const PatternTrainCars = React.lazy(() => import("./age4-5/PatternTrainCars"));
const SnackSharingParty = React.lazy(() => import("./age4-5/SnackSharingParty"));
const OrdinalRaceTrack = React.lazy(() => import("./age4-5/OrdinalRaceTrack"));
const ShapeNumberPuzzles = React.lazy(() => import("./age4-5/ShapeNumberPuzzles"));
const ClockTowerTime = React.lazy(() => import("./age4-5/ClockTowerTime"));
const NumberDetective = React.lazy(() => import("./age4-5/NumberDetective"));

const TenFrameGarden = React.lazy(() => import("./age5-6/TenFrameGarden"));
const AddTheAnimals = React.lazy(() => import("./age5-6/AddTheAnimals"));
const NumberBondsBubbles = React.lazy(() => import("./age5-6/NumberBondsBubbles"));
const JumpingFrogs = React.lazy(() => import("./age5-6/JumpingFrogs"));
const FillTheBucket = React.lazy(() => import("./age5-6/FillTheBucket"));
const SubtractTheSnacks = React.lazy(() => import("./age5-6/SubtractTheSnacks"));
const MeasureTheMonsters = React.lazy(() => import("./age5-6/MeasureTheMonsters"));
const NumberLineJumper = React.lazy(() => import("./age5-6/NumberLineJumper"));
const NumbersGamesLandingPage = React.lazy(() => import("./NumbersGamesLandingPage"));

// Wrapper for Numbers Games Page (standalone route)
export const NumbersGamesPageWrapper: React.FC = () => {
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
    <NumbersGamesLandingPage 
      onBack={handleBack}
      theme={theme}
      title="Numbers"
      icon="🔢"
    />
  );
};

// Wrapper for Sequence Game
export const NumberSequenceGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <TrainMovingArrangingNumbers />
  </GameWrapper>
);

export const NumberIntroductionWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumbersIntroduction />
  </GameWrapper>
);

export const NumberFocusWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberFocus />
  </GameWrapper>
);

// Wrapper for Fill in the Blanks Game
export const FillInTheBlanksGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <FillInTheBlanksTrainModule />
  </GameWrapper>
);

// Wrapper for Descending Order Game
export const DescendingOrderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <DescendingOrder />
  </GameWrapper>
);

// Wrapper for Number Identification Game
export const NumberIdentificationGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberIdentification />
  </GameWrapper>
);

// Wrapper for Number Tracing Game
export const NumberTracingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberTracing />
  </GameWrapper>
);

// Wrapper for Number Counting Page
export const NumberCountingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberCounting />
  </GameWrapper>
);

// --- Age 3–4 wrappers ---
export const DotDashRocketsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <DotDashRockets />
  </GameWrapper>
);

export const LadybugSpotsMatchGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <LadybugSpotsMatch />
  </GameWrapper>
);

export const MoreOrLessMarketGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <MoreUnderstanding />
  </GameWrapper>
);

export const LessGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <LessUnderstanding />
  </GameWrapper>
);

export const CleanUpCountGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <CleanUpCount />
  </GameWrapper>
);

export const UnderstandingEqualGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <UnderstandingEqual />
  </GameWrapper>
);

// --- Age 4–5 wrappers ---
export const NumberBridgeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberBridgeBuilder />
  </GameWrapper>
);

export const PatternTrainCarsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <PatternTrainCars />
  </GameWrapper>
);

export const SnackSharingPartyGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <SnackSharingParty />
  </GameWrapper>
);

// --- Age 5–6 wrappers ---
export const TenFrameGardenGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <TenFrameGarden />
  </GameWrapper>
);

export const AddTheAnimalsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <AddTheAnimals />
  </GameWrapper>
);

export const NumberBondsBubblesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberBondsBubbles />
  </GameWrapper>
);

export const JumpingFrogsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <JumpingFrogs />
  </GameWrapper>
);

export const FillTheBucketGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <FillTheBucket />
  </GameWrapper>
);

// NEW MODULE WRAPPERS
export const ZeroTheHeroGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <ZeroTheHero />
  </GameWrapper>
);

export const PizzaPartySharingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <PizzaPartySharing />
  </GameWrapper>
);

export const CoinCollectorGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <CoinCollector />
  </GameWrapper>
);

export const OrdinalRaceTrackGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <OrdinalRaceTrack />
  </GameWrapper>
);

export const ShapeNumberPuzzlesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <ShapeNumberPuzzles />
  </GameWrapper>
);

export const ClockTowerTimeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <ClockTowerTime />
  </GameWrapper>
);

export const NumberDetectiveGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberDetective />
  </GameWrapper>
);

export const SubtractTheSnacksGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <SubtractTheSnacks />
  </GameWrapper>
);

export const MeasureTheMonstersGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <MeasureTheMonsters />
  </GameWrapper>
);

export const NumberLineJumperGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/numbers">
    <NumberLineJumper />
  </GameWrapper>
);
