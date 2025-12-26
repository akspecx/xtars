import React from "react";
import { useNavigate } from "react-router";
import TrainMovingArrangingNumbers from "./age4-5/TrainMovingArrangingNumbers";
import FillInTheBlanksTrainModule from "./age4-5/FillInTheBlanksTrainModule";
import DescendingOrder from "./age5-6/DescendingOrder";
import NumberIdentification from "./age3-4/NumberIdentification";
import NumberTracing from "./age4-5/NumberTracing";
import NumberCounting from "./age3-4/NumberCounting";

// Age-grouped Numbers games
import DotDashRockets from "./age3-4/DotDashRockets";
import LadybugSpotsMatch from "./age3-4/LadybugSpotsMatch";
import MoreUnderstanding from "./age3-4/MoreUnderstanding";
import LessUnderstanding from "./age3-4/LessUnderstanding"
import CleanUpCount from "./age3-4/CleanUpCount";
import ZeroTheHero from "./age3-4/ZeroTheHero";
import PizzaPartySharing from "./age3-4/PizzaPartySharing";
import CoinCollector from "./age3-4/CoinCollector";
import UnderstandingEqual from "./age3-4/UnderstandingEqual";

import NumberBridgeBuilder from "./age4-5/NumberBridgeBuilder";
import PatternTrainCars from "./age4-5/PatternTrainCars";
import SnackSharingParty from "./age4-5/SnackSharingParty";
import OrdinalRaceTrack from "./age4-5/OrdinalRaceTrack";
import ShapeNumberPuzzles from "./age4-5/ShapeNumberPuzzles";
import ClockTowerTime from "./age4-5/ClockTowerTime";
import NumberDetective from "./age4-5/NumberDetective";

import TenFrameGarden from "./age5-6/TenFrameGarden";
import AddTheAnimals from "./age5-6/AddTheAnimals";
import NumberBondsBubbles from "./age5-6/NumberBondsBubbles";
import JumpingFrogs from "./age5-6/JumpingFrogs";
import FillTheBucket from "./age5-6/FillTheBucket";
import SubtractTheSnacks from "./age5-6/SubtractTheSnacks";
import MeasureTheMonsters from "./age5-6/MeasureTheMonsters";
import NumberLineJumper from "./age5-6/NumberLineJumper";
import NumbersGamesLandingPage from "./NumbersGamesLandingPage";

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
export const NumberSequenceGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <TrainMovingArrangingNumbers />
    </div>
  );
};

// Wrapper for Fill in the Blanks Game
export const FillInTheBlanksGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <FillInTheBlanksTrainModule />
    </div>
  );
};

// Wrapper for Descending Order Game
export const DescendingOrderGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <DescendingOrder />
    </div>
  );
};

// Wrapper for Number Identification Game
export const NumberIdentificationGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <NumberIdentification />
    </div>
  );
};

// Wrapper for Number Tracing Game
export const NumberTracingGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <NumberTracing />
    </div>
  );
};

// Wrapper for Number Counting Page
export const NumberCountingGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/numbers");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <NumberCounting />
    </div>
  );
};

// --- Age 3–4 wrappers ---

export const DotDashRocketsGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <DotDashRockets />
    </div>
  );
};

export const LadybugSpotsMatchGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <LadybugSpotsMatch />
    </div>
  );
};

export const MoreOrLessMarketGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <MoreUnderstanding />
    </div>
  );
};

export const LessGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <LessUnderstanding />
    </div>
  );
};

export const CleanUpCountGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <CleanUpCount />
    </div>
  );
};

export const UnderstandingEqualGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <UnderstandingEqual />
    </div>
  );
};

// --- Age 4–5 wrappers ---

export const NumberBridgeGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <NumberBridgeBuilder />
    </div>
  );
};

export const PatternTrainCarsGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <PatternTrainCars />
    </div>
  );
};

export const SnackSharingPartyGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <SnackSharingParty />
    </div>
  );
};

// --- Age 5–6 wrappers ---

export const TenFrameGardenGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <TenFrameGarden />
    </div>
  );
};

export const AddTheAnimalsGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <AddTheAnimals />
    </div>
  );
};

export const NumberBondsBubblesGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <NumberBondsBubbles />
    </div>
  );
};

export const JumpingFrogsGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <JumpingFrogs />
    </div>
  );
};

export const FillTheBucketGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Numbers Menu
      </button>
      <FillTheBucket />
    </div>
  );
};

// NEW MODULE WRAPPERS
export const ZeroTheHeroGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <ZeroTheHero />
    </div>
  );
};

export const PizzaPartySharingGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <PizzaPartySharing />
    </div>
  );
};

export const CoinCollectorGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <CoinCollector />
    </div>
  );
};

export const OrdinalRaceTrackGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <OrdinalRaceTrack />
    </div>
  );
};

export const ShapeNumberPuzzlesGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <ShapeNumberPuzzles />
    </div>
  );
};

export const ClockTowerTimeGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <ClockTowerTime />
    </div>
  );
};

export const NumberDetectiveGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <NumberDetective />
    </div>
  );
};

export const SubtractTheSnacksGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <SubtractTheSnacks />
    </div>
  );
};

export const MeasureTheMonstersGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <MeasureTheMonsters />
    </div>
  );
};

export const NumberLineJumperGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/numbers");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Numbers Menu</button>
      <NumberLineJumper />
    </div>
  );
};

