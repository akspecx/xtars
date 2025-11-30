import React from "react";
import { useNavigate } from "react-router";
// Age 3-4 modules
import AlphabetGamesDragDrop from "./age3-4/AlphabetsDragDropMatching";
import RandomBalloonAlphabetMapping from "./age3-4/RandomBalloonAlphabetMapping";
import AlphabetCounting from "./age3-4/AlphabetCounting";
import AlphabetStoryCards from "./age3-4/AlphabetStoryCards";
import AlphabetFindTapScene from "./age3-4/AlphabetFindTapScene";
import LetterHuntSafari from "./age3-4/LetterHuntSafari";
import AlphabetDanceParty from "./age3-4/AlphabetDanceParty";
import LetterSizeSorting from "./age3-4/LetterSizeSorting";
import EnvironmentalPrintMatch from "./age3-4/EnvironmentalPrintMatch";

// Age 4-5 modules
import AlphabetSequenceMapping from "./age4-5/AlphabetSequenceMapping";
import AlphabetFruitFlipGame from "./age4-5/FlipAlphabetFruitLearning";
import AlphabetTracing from "./age4-5/AlphabetTracing";
import AlphabetFillInTheBlanks from "./age4-5/AlphabetFillInTheBlanks";
import AlphabetObjectMatching from "./age4-5/AlphabetObjectMatching";
import AlphabetCaseMatching from "./age4-5/AlphabetCaseMatching";
import AlphabetSorting from "./age4-5/AlphabetSorting";
import AlphabetLetterPuzzle from "./age4-5/AlphabetLetterPuzzle";
import AlphabetLetterPathMaze from "./age4-5/AlphabetLetterPathMaze";
import AlphabetBeginningSoundPicker from "./age4-5/AlphabetBeginningSoundPicker";
import CVCWordBuilder from "./age4-5/CVCWordBuilder";
import WordFamilyHouses from "./age4-5/WordFamilyHouses";
import AlphabetChef from "./age4-5/AlphabetChef";
import SightWordStars from "./age4-5/SightWordStars";
import PreWritingStrokes from "./age4-5/PreWritingStrokes";

// Age 5-6 modules
import AlphabetDescending from "./age5-6/AlphabetDescending";
import AlphabetRhyming from "./age5-6/AlphabetRhyming";
import AlphabetNameBuilder from "./age5-6/AlphabetNameBuilder";
import AlphabetUppercaseUsage from "./age5-6/AlphabetUppercaseUsage";
import BlendingBridge from "./age5-6/BlendingBridge";
import SentenceBuilder from "./age5-6/SentenceBuilder";
import CompoundWordFactory from "./age5-6/CompoundWordFactory";
import AlphabetGamesLandingPage from "./AlphabetGamesLandingPage";

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

