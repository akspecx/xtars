import React from "react";
import { useNavigate } from "react-router";
import { useProfile } from "../../../../../context/ProfileContext";

// Shared Wrapper to handle conditional navigation visibility
const GameWrapper: React.FC<{ children: React.ReactNode; menuPath: string }> = ({ children, menuPath }) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  
  return (
    <div className="min-h-screen">
      {activeProfile?.type !== 'KIDS' && (
        <button
          onClick={() => navigate(menuPath)}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-md"
        >
          ← Back to Alphabet Menu
        </button>
      )}
      {children}
    </div>
  );
};

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
export const LetterMatchGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetGamesDragDrop />
  </GameWrapper>
);

// Wrapper for Alphabet Sequence Game
export const AlphabetSequenceGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetSequenceMapping />
  </GameWrapper>
);

// Wrapper for Fruit Naming Game
export const FruitNamingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetFruitFlipGame />
  </GameWrapper>
);

// Wrapper for Random Balloon Alphabet Game
export const RandomAlphabetGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <RandomBalloonAlphabetMapping />
  </GameWrapper>
);

// Wrapper for Alphabet Tracing
export const AlphabetTracingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetTracing />
  </GameWrapper>
);

// Wrapper for Alphabet Sound/Counting activity
export const AlphabetCountingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetCounting />
  </GameWrapper>
);

// Wrapper for Alphabet Fill in the Blanks
export const AlphabetFillBlanksGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetFillInTheBlanks />
  </GameWrapper>
);

// Wrapper for Alphabet Object Matching
export const AlphabetObjectMatchingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetObjectMatching />
  </GameWrapper>
);

// Wrapper for Alphabet Case Matching
export const AlphabetCaseMatchingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetCaseMatching />
  </GameWrapper>
);

// Wrapper for Alphabet Sorting
export const AlphabetSortingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetSorting />
  </GameWrapper>
);

// Wrapper for Alphabet Descending
export const AlphabetDescendingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetDescending />
  </GameWrapper>
);

// Wrapper for Alphabet Story Cards
export const AlphabetStoryCardsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetStoryCards />
  </GameWrapper>
);

// Wrapper for Beginning Sound Picker
export const AlphabetBeginningSoundGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetBeginningSoundPicker />
  </GameWrapper>
);

// Wrapper for Letter Puzzle
export const AlphabetLetterPuzzleGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetLetterPuzzle />
  </GameWrapper>
);

// Wrapper for Letter Path Maze
export const AlphabetLetterPathMazeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetLetterPathMaze />
  </GameWrapper>
);

// Wrapper for Rhyming
export const AlphabetRhymingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetRhyming />
  </GameWrapper>
);

// Wrapper for Name Builder
export const AlphabetNameBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetNameBuilder />
  </GameWrapper>
);

// Wrapper for Find & Tap Scene
export const AlphabetFindTapGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetFindTapScene />
  </GameWrapper>
);

// Wrapper for Uppercase Usage
export const AlphabetUppercaseUsageGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetUppercaseUsage />
  </GameWrapper>
);

// NEW MODULE WRAPPERS
export const LetterHuntSafariGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <LetterHuntSafari />
  </GameWrapper>
);

export const AlphabetDancePartyGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetDanceParty />
  </GameWrapper>
);

export const LetterSizeSortingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <LetterSizeSorting />
  </GameWrapper>
);

export const EnvironmentalPrintMatchGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <EnvironmentalPrintMatch />
  </GameWrapper>
);

export const CVCWordBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <CVCWordBuilder />
  </GameWrapper>
);

export const WordFamilyHousesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <WordFamilyHouses />
  </GameWrapper>
);

export const AlphabetChefGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <AlphabetChef />
  </GameWrapper>
);

export const SightWordStarsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <SightWordStars />
  </GameWrapper>
);

export const PreWritingStrokesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <PreWritingStrokes />
  </GameWrapper>
);

export const BlendingBridgeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <BlendingBridge />
  </GameWrapper>
);

export const SentenceBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <SentenceBuilder />
  </GameWrapper>
);

export const CompoundWordFactoryGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets">
    <CompoundWordFactory />
  </GameWrapper>
);
