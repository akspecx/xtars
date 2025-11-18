import React from "react";
import { useNavigate } from "react-router";
import AlphabetGamesDragDrop from "./AlphabetsDragDropMatching";
import AlphabetSequenceMapping from "./AlphabetSequenceMapping";
import AlphabetFruitFlipGame from "./FlipAlphabetFruitLearning";
import RandomBalloonAlphabetMapping from "./RandomBalloonAlphabetMapping";
import AlphabetTracing from "./AlphabetTracing";
import AlphabetCounting from "./AlphabetCounting";
import AlphabetFillInTheBlanks from "./AlphabetFillInTheBlanks";
import AlphabetObjectMatching from "./AlphabetObjectMatching";
import AlphabetCaseMatching from "./AlphabetCaseMatching";
import AlphabetSorting from "./AlphabetSorting";
import AlphabetDescending from "./AlphabetDescending";
import AlphabetStoryCards from "./AlphabetStoryCards";
import AlphabetBeginningSoundPicker from "./AlphabetBeginningSoundPicker";
import AlphabetLetterPuzzle from "./AlphabetLetterPuzzle";
import AlphabetLetterPathMaze from "./AlphabetLetterPathMaze";
import AlphabetRhyming from "./AlphabetRhyming";
import AlphabetNameBuilder from "./AlphabetNameBuilder";
import AlphabetFindTapScene from "./AlphabetFindTapScene";
import AlphabetUppercaseUsage from "./AlphabetUppercaseUsage";
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

