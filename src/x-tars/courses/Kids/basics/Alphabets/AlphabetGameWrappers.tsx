import React from "react";
import { useNavigate } from "react-router";
// Age 3-4 modules
const AlphabetGamesDragDrop = React.lazy(() => import("./age3-4/AlphabetsDragDropMatching"));
const RandomBalloonAlphabetMapping = React.lazy(() => import("./age3-4/RandomBalloonAlphabetMapping"));
const AlphabetCounting = React.lazy(() => import("./age3-4/AlphabetCounting"));
const AlphabetStoryCards = React.lazy(() => import("./age3-4/AlphabetStoryCards"));
const AlphabetFindTapScene = React.lazy(() => import("./age3-4/AlphabetFindTapScene"));
const LetterHuntSafari = React.lazy(() => import("./age3-4/LetterHuntSafari"));
const AlphabetDanceParty = React.lazy(() => import("./age3-4/AlphabetDanceParty"));
const LetterSizeSorting = React.lazy(() => import("./age3-4/LetterSizeSorting"));
const EnvironmentalPrintMatch = React.lazy(() => import("./age3-4/EnvironmentalPrintMatch"));

// Age 4-5 modules
const AlphabetSequenceMapping = React.lazy(() => import("./age4-5/AlphabetSequenceMapping"));
const AlphabetFruitFlipGame = React.lazy(() => import("./age4-5/FlipAlphabetFruitLearning"));
const AlphabetTracing = React.lazy(() => import("./age4-5/AlphabetTracing"));
const AlphabetFillInTheBlanks = React.lazy(() => import("./age4-5/AlphabetFillInTheBlanks"));
const AlphabetObjectMatching = React.lazy(() => import("./age4-5/AlphabetObjectMatching"));
const AlphabetCaseMatching = React.lazy(() => import("./age4-5/AlphabetCaseMatching"));
const AlphabetSorting = React.lazy(() => import("./age4-5/AlphabetSorting"));
const AlphabetLetterPuzzle = React.lazy(() => import("./age4-5/AlphabetLetterPuzzle"));
const AlphabetLetterPathMaze = React.lazy(() => import("./age4-5/AlphabetLetterPathMaze"));
const AlphabetBeginningSoundPicker = React.lazy(() => import("./age4-5/AlphabetBeginningSoundPicker"));
const CVCWordBuilder = React.lazy(() => import("./age4-5/CVCWordBuilder"));
const WordFamilyHouses = React.lazy(() => import("./age4-5/WordFamilyHouses"));
const AlphabetChef = React.lazy(() => import("./age4-5/AlphabetChef"));
const SightWordStars = React.lazy(() => import("./age4-5/SightWordStars"));
const PreWritingStrokes = React.lazy(() => import("./age4-5/PreWritingStrokes"));

// Age 5-6 modules
const AlphabetDescending = React.lazy(() => import("./age5-6/AlphabetDescending"));
const AlphabetRhyming = React.lazy(() => import("./age5-6/AlphabetRhyming"));
const AlphabetNameBuilder = React.lazy(() => import("./age5-6/AlphabetNameBuilder"));
const AlphabetUppercaseUsage = React.lazy(() => import("./age5-6/AlphabetUppercaseUsage"));
const BlendingBridge = React.lazy(() => import("./age5-6/BlendingBridge"));
const SentenceBuilder = React.lazy(() => import("./age5-6/SentenceBuilder"));
const CompoundWordFactory = React.lazy(() => import("./age5-6/CompoundWordFactory"));
const AlphabetGamesLandingPage = React.lazy(() => import("./AlphabetGamesLandingPage"));

// Wrapper for Alphabet Games Page (standalone route)
export const AlphabetGamesPageWrapper: React.FC = () => {
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
    <AlphabetGamesLandingPage 
      onBack={handleBack}
      theme={theme}
      title="Alphabets"
      icon="🔤"
    />
  );
};

// Wrapper for Letter Match Game
export const LetterMatchGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetGamesDragDrop />
    </div>
  );
};

// Wrapper for Alphabet Sequence Game
export const AlphabetSequenceGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetSequenceMapping />
    </div>
  );
};

// Wrapper for Fruit Naming Game
export const FruitNamingGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetFruitFlipGame />
    </div>
  );
};

// Wrapper for Random Balloon Alphabet Game
export const RandomAlphabetGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <RandomBalloonAlphabetMapping />
    </div>
  );
};

// Wrapper for Alphabet Tracing
export const AlphabetTracingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetTracing />
    </div>
  );
};

// Wrapper for Alphabet Sound/Counting activity
export const AlphabetCountingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetCounting />
    </div>
  );
};

// Wrapper for Alphabet Fill in the Blanks
export const AlphabetFillBlanksGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetFillInTheBlanks />
    </div>
  );
};

// Wrapper for Alphabet Object Matching
export const AlphabetObjectMatchingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetObjectMatching />
    </div>
  );
};

// Wrapper for Alphabet Case Matching
export const AlphabetCaseMatchingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetCaseMatching />
    </div>
  );
};

// Wrapper for Alphabet Sorting
export const AlphabetSortingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetSorting />
    </div>
  );
};

// Wrapper for Alphabet Descending
export const AlphabetDescendingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetDescending />
    </div>
  );
};

// Wrapper for Alphabet Story Cards
export const AlphabetStoryCardsGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetStoryCards />
    </div>
  );
};

// Wrapper for Beginning Sound Picker
export const AlphabetBeginningSoundGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetBeginningSoundPicker />
    </div>
  );
};

// Wrapper for Letter Puzzle
export const AlphabetLetterPuzzleGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetLetterPuzzle />
    </div>
  );
};

// Wrapper for Letter Path Maze
export const AlphabetLetterPathMazeGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetLetterPathMaze />
    </div>
  );
};

// Wrapper for Rhyming
export const AlphabetRhymingGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetRhyming />
    </div>
  );
};

// Wrapper for Name Builder
export const AlphabetNameBuilderGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetNameBuilder />
    </div>
  );
};

// Wrapper for Find & Tap Scene
export const AlphabetFindTapGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetFindTapScene />
    </div>
  );
};

// Wrapper for Uppercase Usage
export const AlphabetUppercaseUsageGameWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/games/alphabets");
  };

  return (
    <div className="min-h-screen">
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
      >
        ← Back to Alphabet Menu
      </button>
      <AlphabetUppercaseUsage />
    </div>
  );
};

// NEW MODULE WRAPPERS
export const LetterHuntSafariGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <LetterHuntSafari />
    </div>
  );
};

export const AlphabetDancePartyGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <AlphabetDanceParty />
    </div>
  );
};

export const LetterSizeSortingGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <LetterSizeSorting />
    </div>
  );
};

export const EnvironmentalPrintMatchGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <EnvironmentalPrintMatch />
    </div>
  );
};

export const CVCWordBuilderGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <CVCWordBuilder />
    </div>
  );
};

export const WordFamilyHousesGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <WordFamilyHouses />
    </div>
  );
};

export const AlphabetChefGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <AlphabetChef />
    </div>
  );
};

export const SightWordStarsGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <SightWordStars />
    </div>
  );
};

export const PreWritingStrokesGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <PreWritingStrokes />
    </div>
  );
};

export const BlendingBridgeGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <BlendingBridge />
    </div>
  );
};

export const SentenceBuilderGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <SentenceBuilder />
    </div>
  );
};

export const CompoundWordFactoryGameWrapper: React.FC = () => {
  const navigate = useNavigate();
  const handleBack = () => navigate("/games/alphabets");
  return (
    <div className="min-h-screen">
      <button onClick={handleBack} className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md">← Back to Alphabet Menu</button>
      <CompoundWordFactory />
    </div>
  );
};

