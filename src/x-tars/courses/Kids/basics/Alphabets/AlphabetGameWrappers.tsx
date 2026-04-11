import React, { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ChevronLeft, Volume2, VolumeX } from "lucide-react";
import { useProfile } from "../../../../../context/ProfileContext";
import KidAvatar from "../../../CommonUtility/KidAvatar";

// ─── Visual Logic-style shell for ALL alphabet games ────────────────────────
const GameWrapper: React.FC<{
  children:  React.ReactNode;
  menuPath:  string;
  title?:    string;
  accent?:   string;
}> = ({ children, menuPath, title = 'Alphabets', accent = '#d97706' }) => {
  const navigate  = useNavigate();
  const { activeProfile } = useProfile();
  const kidAvatar = activeProfile?.avatar ?? 'bird';
  const [isMuted, setIsMuted] = useState(false);

  const handleMute = () => {
    setIsMuted(m => !m);
    window.speechSynthesis?.cancel();
  };

  return (
    <div
      className="flex flex-col h-screen select-none overflow-hidden"
      style={{ background: 'linear-gradient(160deg,#fff7cc 0%,#fbeb5b 40%,#f6e54a 80%,#f0e037 100%)' }}
    >
      {/* Light-ray overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[18, 50, 78].map((left, i) => (
          <div key={i}
            className="absolute top-0 w-[2px] opacity-[0.07]"
            style={{
              left: `${left}%`, height: '55%',
              background: 'linear-gradient(to bottom, #342f00, transparent)',
              transform: `rotate(${(i - 1) * 8}deg)`,
              transformOrigin: 'top',
            }}
          />
        ))}
      </div>

      {/* ── Top bar ── */}
      <div
        className="relative z-10 flex-none flex items-center gap-3 px-4 shadow-md"
        style={{
          paddingTop: 'env(safe-area-inset-top, 14px)',
          paddingBottom: 10,
          background: '#fff394',
          borderBottom: '2.5px solid #fbeb5b',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => navigate(menuPath)}
          className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md shrink-0"
          style={{ background: '#fbeb5b', border: '1.5px solid #f0e037' }}
        >
          <ChevronLeft size={22} color="#342f00" strokeWidth={3} />
        </motion.button>

        <p className="flex-1 font-black text-lg text-center tracking-tight" style={{ color: '#342f00' }}>
          {title}
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={handleMute}
            className="h-10 w-10 flex items-center justify-center rounded-xl shadow-md"
            style={{ background: '#fbeb5b', border: '1.5px solid #f0e037' }}
          >
            {isMuted
              ? <VolumeX size={20} color="#342f00" />
              : <Volume2 size={20} color="#342f00" />
            }
          </motion.button>
          <div
            className="h-10 w-10 rounded-xl overflow-hidden shadow-md"
            style={{ border: '2.5px solid #fbeb5b', background: '#fff' }}
          >
            <KidAvatar avatar={kidAvatar} size={36} />
          </div>
        </div>
      </div>

      {/* ── Game content ── */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <div className={isMuted ? 'pointer-events-auto' : ''} style={{ minHeight: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Journey module (full 6-phase learning)
const AlphabetJourneyModuleComponent = React.lazy(() => import("./AlphabetJourneyModule"));

// Structured learning modules (hub + per-letter path)
const AlphabetLearningHubComponent = React.lazy(() => import("./modules/AlphabetLearningHub"));
const DailyObjectsModuleComponent   = React.lazy(() => import("./modules/DailyObjectsModule"));
const LetterIntroModuleComponent    = React.lazy(() => import("./modules/LetterIntroModule"));
const LetterQuizModuleComponent     = React.lazy(() => import("./modules/LetterQuizModule"));
const BubblePopModuleComponent      = React.lazy(() => import("./modules/BubblePopModule"));
const SteppingStonesModuleComponent  = React.lazy(() => import("./modules/SteppingStonesModule"));
const BuildingBlocksModuleComponent = React.lazy(() => import("./modules/BuildingBlocksModule"));
const FrogJumpModuleComponent       = React.lazy(() => import("./modules/FrogJumpModule"));
const HungryCaterpillarModuleComponent = React.lazy(() => import("./modules/HungryCaterpillarModule"));
const AlphabetTrainModuleComponent  = React.lazy(() => import("./modules/AlphabetTrainModule"));
const StartsWithQuizComponent       = React.lazy(() => import("./modules/StartsWithQuiz"));

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
  return <AlphabetGamesLandingPage />;
};

// Wrapper for the new 6-phase Alphabet Journey Module
export const AlphabetJourneyModuleWrapper: React.FC = () => (
  <React.Suspense fallback={<div className="flex items-center justify-center h-screen" style={{background:'#fff7cc'}}><div className="text-4xl animate-bounce">🔠</div></div>}>
    <AlphabetJourneyModuleComponent />
  </React.Suspense>
);

// Structured learning path wrappers — each module handles its own full-screen layout
const FALLBACK = <div className="flex items-center justify-center h-screen" style={{background:'#fff7cc'}}><div className="text-5xl animate-bounce">🔤</div></div>;

export const AlphabetLearningHubWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><AlphabetLearningHubComponent /></React.Suspense>
);
export const DailyObjectsModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><DailyObjectsModuleComponent /></React.Suspense>
);
export const LetterIntroModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><LetterIntroModuleComponent /></React.Suspense>
);
export const LetterQuizModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><LetterQuizModuleComponent /></React.Suspense>
);
export const BubblePopModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><BubblePopModuleComponent /></React.Suspense>
);
export const SteppingStonesModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><SteppingStonesModuleComponent /></React.Suspense>
);
export const BuildingBlocksModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><BuildingBlocksModuleComponent /></React.Suspense>
);
export const FrogJumpModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><FrogJumpModuleComponent /></React.Suspense>
);
export const HungryCaterpillarModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><HungryCaterpillarModuleComponent /></React.Suspense>
);
export const AlphabetTrainModuleWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><AlphabetTrainModuleComponent /></React.Suspense>
);
export const StartsWithQuizWrapper: React.FC = () => (
  <React.Suspense fallback={FALLBACK}><StartsWithQuizComponent /></React.Suspense>
);

// Wrapper for Letter Match Game
export const LetterMatchGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter Match">
    <AlphabetGamesDragDrop />
  </GameWrapper>
);

// Wrapper for Alphabet Sequence Game
export const AlphabetSequenceGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Arranging Alphabets">
    <AlphabetSequenceMapping />
  </GameWrapper>
);

// Wrapper for Fruit Naming Game
export const FruitNamingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Fruit Naming">
    <AlphabetFruitFlipGame />
  </GameWrapper>
);

// Wrapper for Random Balloon Alphabet Game
export const RandomAlphabetGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Random Alphabet">
    <RandomBalloonAlphabetMapping />
  </GameWrapper>
);

// Wrapper for Alphabet Tracing
export const AlphabetTracingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Trace the Letters">
    <AlphabetTracing />
  </GameWrapper>
);

// Wrapper for Alphabet Sound/Counting activity
export const AlphabetCountingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Alphabet Sound Garden">
    <AlphabetCounting />
  </GameWrapper>
);

// Wrapper for Alphabet Fill in the Blanks
export const AlphabetFillBlanksGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Fill in the Blanks">
    <AlphabetFillInTheBlanks />
  </GameWrapper>
);

// Wrapper for Alphabet Object Matching
export const AlphabetObjectMatchingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter-Object Match">
    <AlphabetObjectMatching />
  </GameWrapper>
);

// Wrapper for Alphabet Case Matching
export const AlphabetCaseMatchingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Uppercase / Lowercase">
    <AlphabetCaseMatching />
  </GameWrapper>
);

// Wrapper for Alphabet Sorting
export const AlphabetSortingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter Sorting">
    <AlphabetSorting />
  </GameWrapper>
);

// Wrapper for Alphabet Descending
export const AlphabetDescendingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Reverse Alphabet">
    <AlphabetDescending />
  </GameWrapper>
);

// Wrapper for Alphabet Story Cards
export const AlphabetStoryCardsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Alphabet Story Cards">
    <AlphabetStoryCards />
  </GameWrapper>
);

// Wrapper for Beginning Sound Picker
export const AlphabetBeginningSoundGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Beginning Sounds">
    <AlphabetBeginningSoundPicker />
  </GameWrapper>
);

// Wrapper for Letter Puzzle
export const AlphabetLetterPuzzleGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Build the Letter">
    <AlphabetLetterPuzzle />
  </GameWrapper>
);

// Wrapper for Letter Path Maze
export const AlphabetLetterPathMazeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter Path Maze">
    <AlphabetLetterPathMaze />
  </GameWrapper>
);

// Wrapper for Rhyming
export const AlphabetRhymingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Rhyming Friends">
    <AlphabetRhyming />
  </GameWrapper>
);

// Wrapper for Name Builder
export const AlphabetNameBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Build Your Name">
    <AlphabetNameBuilder />
  </GameWrapper>
);

// Wrapper for Find & Tap Scene
export const AlphabetFindTapGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Find &amp; Tap Letters">
    <AlphabetFindTapScene />
  </GameWrapper>
);

// Wrapper for Uppercase Usage
export const AlphabetUppercaseUsageGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Uppercase or Lowercase?">
    <AlphabetUppercaseUsage />
  </GameWrapper>
);

export const LetterHuntSafariGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter Hunt Safari">
    <LetterHuntSafari />
  </GameWrapper>
);

export const AlphabetDancePartyGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Alphabet Dance Party">
    <AlphabetDanceParty />
  </GameWrapper>
);

export const LetterSizeSortingGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Letter Size Sorting">
    <LetterSizeSorting />
  </GameWrapper>
);

export const EnvironmentalPrintMatchGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Print Match">
    <EnvironmentalPrintMatch />
  </GameWrapper>
);

export const CVCWordBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="CVC Word Builder">
    <CVCWordBuilder />
  </GameWrapper>
);

export const WordFamilyHousesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Word Family Houses">
    <WordFamilyHouses />
  </GameWrapper>
);

export const AlphabetChefGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Alphabet Chef">
    <AlphabetChef />
  </GameWrapper>
);

export const SightWordStarsGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Sight Word Stars">
    <SightWordStars />
  </GameWrapper>
);

export const PreWritingStrokesGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Pre-Writing Strokes">
    <PreWritingStrokes />
  </GameWrapper>
);

export const BlendingBridgeGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Blending Bridge">
    <BlendingBridge />
  </GameWrapper>
);

export const SentenceBuilderGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Sentence Builder">
    <SentenceBuilder />
  </GameWrapper>
);

export const CompoundWordFactoryGameWrapper: React.FC = () => (
  <GameWrapper menuPath="/games/alphabets" title="Compound Word Factory">
    <CompoundWordFactory />
  </GameWrapper>
);
