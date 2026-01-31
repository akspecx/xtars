import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { SettingsProvider } from "./contexts/SettingsContext";
import CoursesHome from "./x-tars/courses/CourseHome";
import CoursesRouter from "./x-tars/courses/Router";
import GamesHome from "./x-tars/courses/Kids/basics/KidsMainPage";
import PuzzlesHome from "./x-tars/courses/Puzzles/PuzzlesMain"
import Roadmap from "./x-tars/Roadmap";
// import ShapesIntroduction  from "./x-tars/courses/Kids/basics/Shapes/ShapesIntroduction";
import { 
  AlphabetGamesPageWrapper,
  LetterMatchGameWrapper, 
  AlphabetSequenceGameWrapper, 
  FruitNamingGameWrapper, 
  RandomAlphabetGameWrapper,
  AlphabetTracingGameWrapper,
  AlphabetCountingGameWrapper,
  AlphabetFillBlanksGameWrapper,
  AlphabetObjectMatchingGameWrapper,
  AlphabetCaseMatchingGameWrapper,
  AlphabetSortingGameWrapper,
  AlphabetDescendingGameWrapper,
  AlphabetStoryCardsGameWrapper,
  AlphabetBeginningSoundGameWrapper,
  AlphabetLetterPuzzleGameWrapper,
  AlphabetLetterPathMazeGameWrapper,
  AlphabetRhymingGameWrapper,
  AlphabetNameBuilderGameWrapper,
  AlphabetFindTapGameWrapper,
  AlphabetUppercaseUsageGameWrapper,
  LetterHuntSafariGameWrapper,
  AlphabetDancePartyGameWrapper,
  LetterSizeSortingGameWrapper,
  EnvironmentalPrintMatchGameWrapper,
  CVCWordBuilderGameWrapper,
  WordFamilyHousesGameWrapper,
  AlphabetChefGameWrapper,
  SightWordStarsGameWrapper,
  PreWritingStrokesGameWrapper,
  BlendingBridgeGameWrapper,
  SentenceBuilderGameWrapper,
  CompoundWordFactoryGameWrapper
} from "./x-tars/courses/Kids/basics/Alphabets/AlphabetGameWrappers";
import { 
  NumbersGamesPageWrapper,
  NumberIntroductionWrapper,
  NumberFocusWrapper,
  NumberIdentificationGameWrapper,
  NumberSequenceGameWrapper,
  FillInTheBlanksGameWrapper,
  DescendingOrderGameWrapper,
  NumberTracingGameWrapper,
  NumberCountingGameWrapper,
  DotDashRocketsGameWrapper,
  LadybugSpotsMatchGameWrapper,
  MoreOrLessMarketGameWrapper,
  LessGameWrapper,
  CleanUpCountGameWrapper,
  NumberBridgeGameWrapper,
  PatternTrainCarsGameWrapper,
  SnackSharingPartyGameWrapper,
  TenFrameGardenGameWrapper,
  AddTheAnimalsGameWrapper,
  NumberBondsBubblesGameWrapper,
  JumpingFrogsGameWrapper,
  FillTheBucketGameWrapper,
  ZeroTheHeroGameWrapper,
  PizzaPartySharingGameWrapper,
  CoinCollectorGameWrapper,
  UnderstandingEqualGameWrapper,
  OrdinalRaceTrackGameWrapper,
  ShapeNumberPuzzlesGameWrapper,
  ClockTowerTimeGameWrapper,
  NumberDetectiveGameWrapper,
  SubtractTheSnacksGameWrapper,
  MeasureTheMonstersGameWrapper,
  NumberLineJumperGameWrapper
} from "./x-tars/courses/Kids/basics/Numbers/NumbersGameWrappers";


import { 
  ShapesGamesPageWrapper,
  ShapesBearWrapper,
  ShapesBusWrapper,
  ShapesTreeWrapper,
  ShapesIntroductionWrapper
} from "./x-tars/courses/Kids/basics/Shapes/ShapesWrapper";
// import { ShapesGamesPageWrapper } from "./x-tars/courses/Kids/basics/Shapes/ShapesLandingPage";
import { 
  VisualLogicGamesPageWrapper,
  VisualLogicSameWrapper,
  VisualLogicAboveWrapper,
  VisualLogicBelowWrapper,
  VisualLogicAboveAndBelowWrapper,
  VisualLogicAboveAndBelowMixWrapper,
  VisualLogicTallAndShortWrapper,
  VisualLogicTallWrapper,
  VisualLogicShortWrapper,
  VisualLogicFullAndEmptyWrapper,
  VisualLogicFullWrapper,
  VisualLogicEmptyWrapper,
  VisualLogicDifferentWrapper,
  VisualLogicBigWrapper,
  VisualLogicSmallWrapper,
  VisualLogicBigAndSmallMixWrapper,
  VisualLogicInsideWrapper,
  VisualLogicOutsideWrapper,
  VisualLogicInsideAndOutsideMixWrapper
} from "./x-tars/courses/Kids/basics/VisualLogic/VisualLogicWrapper";
import { 
  MemoryGamesPageWrapper,
  AnimalMatchingGameWrapper,
  FruitsMatchingGameWrapper,
  NumberMatchingGameWrapper
} from "./x-tars/courses/Kids/basics/MemoryGame/MemoryGameWrappers";
import { 
  PuzzlesPageWrapper,
  AppleArrangementGameWrapper,
  OrangeArrangementGameWrapper,
  OrangeComplexArrangementGameWrapper,
  GiraffeComplexArrangementGameWrapper
} from "./x-tars/courses/Kids/basics/Arrangement/PuzzleGameWrappers";

import{LinearArrangementMainRouter}
from "./x-tars/courses/Learn/LogicalReasoning/LogicalReasoningRouterWrapper"


import {LinearArrangementIntroductionRouter,
  LinearArrangementLeftRightRouter,
LADirectionMattersLeftRightRouter,
ImmediateRightAndLeftRouter,
LinearArrangementBetweenRouter,
LAFirstSecondLeftRightRouter,
LANumberOfPeopleSittingBetweenRouter,
LAExtremeLeftRightRouter,
LAFollowInstructionIntroRouter,
LAFollowInstructionRightRouter,
LAFollowInstructionLeftRightBothRouter,
LAFollowInstructionDirectionLeftRightRouter,
LAFollowingInstructionWithBetweenAndExtremeEndRouter,
LAFollowingInstructionDiffDirectionIntermediateRouter,
LAFollowingInstructionComplexityHighRouter,
LAActualWorldIntroHighRouter,
LAActualWorldNorthRouter,
LAActualWorldSouthRouter,
LAActualWorldSittingParallelRouter,
LAActualWorldDirectionDoesNotMatterRouter,
LAActualWorldMultipleCaseIntroRouter,
LAActualWorldMultipleCaseIntermediateRouter,
LAActualWorld2DIntroRouter,
LAActualWorld3DIntroRouter,
LAInstructionGyaanAnchorRouter,
LAInstructionGyaanAnchorFromMultipleInstrRouter,
LAInstructionGyaanLeadingToAnchorRouter,
LAInstructionGyaanUseMultipleInstrForAnchorRouter
}
from "./x-tars/courses/Learn/LogicalReasoning/LinearArrangement/LinearArrangementRouterWrapper"

import {
  PuzzleRouter,
  PuzzleMissionRouter,
  PuzzleMetricSumRouter,
  SacredGameRouter
  
}
from "./x-tars/courses/Puzzles/PuzzlesWrapper";


import {
  AlgebraicExpressionRouter
  
}
from "./x-tars/courses/Learn/maths/MathsRouterWrapper"

import {
  AlgebraicIntroductionRouter,
  FindingWeightUnknowRouter,
  RightScaleRouter,
  LhsrhsIntroductionRouter,
  AELikeUnlikeTermsRouter,
  AlgebraicExpressionIntroRouter,
  MonoBinoPolyIdentificationRouter,
  VariableCoeffConstIntroRouter,
  IntroToXRouter,
  ActionREactionRouter,
  BalancedScaleToXTransitionRouter,
  SolveTheBasicEquationRouter,
  SolveEquationsAXPlusBRouter,
  WarModeAEBeginnerRouter,
  WarModeAEIntermediateRouter

}
from "./x-tars/courses/Learn/maths/AlgebraicExpression/AlgebraRouterWrapper"



import {
  LearnRouter,
  LearnMathsRouter,
  LogicalReasoningMainRouter,
  DataInterpretationMainRouter
  }
from "./x-tars/courses/Learn/LearnModuleWrapper"

import 
{
  BarChartMainRouter
}
from "./x-tars/courses/Learn/DataInterpretation/DIRouterWrapper"

import 
{
  BarChartIntroRouter,
  TheLargestAndSmallestRouter,
  IncreaseTheScaleTo2Router,
  FindingAnomaliesInBarChartRouter,
  CreateBarChartRouter,
  DoubleBarChartTwoClassRouter,
  DoubleBarComparisonIntroRouter,
  DoubleBCCumulativeDataAnalysisRouter
}
from "./x-tars/courses/Learn/DataInterpretation/BarChart/BarChartRouterWrapper"

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FeedBackComponent from "./pages/Feedback";

export default function App() {
  return (
    <SettingsProvider>
      <Router basename="xtars">
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Dashboard Layout - Protected Routes */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              {/* Dashboard */}
              <Route index element={<Home />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/home" element={<Home />} />

              {/* Courses Learn Module Router */}
              <Route path="/learn" element={<LearnRouter />} />
              <Route path="/learn/mathematics" element={<LearnMathsRouter />} />
              <Route path="/learn/mathematics/algebra" element={<AlgebraicExpressionRouter />} />
               {/* Algebra sub modules */}
               <Route path="/learn/mathematics/algebra/introduction" element={<AlgebraicIntroductionRouter />} />
              <Route path="/learn/mathematics/algebra/unknown" element={<FindingWeightUnknowRouter />} />
              <Route path="/learn/mathematics/algebra/rightScale" element={<RightScaleRouter />} />
              <Route path="/learn/mathematics/algebra/lhsrhsIntroduction" element={<LhsrhsIntroductionRouter />} />
              <Route path="/learn/mathematics/algebra/likeunlike" element={<AELikeUnlikeTermsRouter />} />
              <Route path="/learn/mathematics/algebra/monibiPoly" element={<MonoBinoPolyIdentificationRouter />} />
              <Route path="/learn/mathematics/algebra/expressionIntro" element={<AlgebraicExpressionIntroRouter />} />
              <Route path="/learn/mathematics/algebra/variableCoefficient" element={<VariableCoeffConstIntroRouter />} />
              <Route path="/learn/mathematics/algebra/IntroToX" element={<IntroToXRouter />} />
              <Route path="/learn/mathematics/algebra/actionReaction" element={<ActionREactionRouter />} />
              <Route path="/learn/mathematics/algebra/balancedScaleToAE" element={<BalancedScaleToXTransitionRouter />} />
              <Route path="/learn/mathematics/algebra/SolveBasicEquation" element={<SolveTheBasicEquationRouter />} />
              <Route path="/learn/mathematics/algebra/SolveAXPlusB" element={<SolveEquationsAXPlusBRouter />} />
              <Route path="/learn/mathematics/algebra/WarModeAEBeginner" element={<WarModeAEBeginnerRouter />} /> 
              <Route path="/learn/mathematics/algebra/WarModeAEIntermediate" element={<WarModeAEIntermediateRouter />} />
             
             
              


              <Route path="/learn/logicalreasoning" element={<LogicalReasoningMainRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement" element={<LinearArrangementMainRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/introduction" element={<LinearArrangementIntroductionRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/leftRight" element={<LinearArrangementLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/leftRightWithDiffDirection" element={<LADirectionMattersLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/immediateleftRight" element={<ImmediateRightAndLeftRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/between" element={<LinearArrangementBetweenRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/FirstSecondLeftRight" element={<LAFirstSecondLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/PeopleSittingBetween" element={<LANumberOfPeopleSittingBetweenRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/extremeleftRight" element={<LAExtremeLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/followInstructionLeft" element={<LAFollowInstructionIntroRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/InstrRight" element={<LAFollowInstructionRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/InstrBothLeftRight" element={<LAFollowInstructionLeftRightBothRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/InstrDiffDirection" element={<LAFollowInstructionDirectionLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/InstrExtremEnd" element={<LAFollowingInstructionWithBetweenAndExtremeEndRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/InstrDiffSideIntermediate" element={<LAFollowingInstructionDiffDirectionIntermediateRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/Instrcomplex" element={<LAFollowingInstructionComplexityHighRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/ActualWorldIntro" element={<LAActualWorldIntroHighRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/ActualWorldNorth" element={<LAActualWorldNorthRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/ActualWorldSouth" element={<LAActualWorldSouthRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/ActualWorldSittingParallel" element={<LAActualWorldSittingParallelRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/DirectionDoesnotMatter" element={<LAActualWorldDirectionDoesNotMatterRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/MultipleCaseIntro" element={<LAActualWorldMultipleCaseIntroRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/MultipleCaseIntermediate" element={<LAActualWorldMultipleCaseIntermediateRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/2DArrangement" element={<LAActualWorld2DIntroRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/3DArrangement" element={<LAActualWorld3DIntroRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/ChooseAnchor" element={<LAInstructionGyaanAnchorRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/anchorFromMultipleInstruction" element={<LAInstructionGyaanAnchorFromMultipleInstrRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/WhatAfterAnchor" element={<LAInstructionGyaanLeadingToAnchorRouter />} />
              <Route path="/learn/logicalReasoning/LinearArrangement/MultipleInstructionCreateAnchor" element={<LAInstructionGyaanUseMultipleInstrForAnchorRouter />} />
            
              




            
              <Route path="/learn/dataInterpretation" element={<DataInterpretationMainRouter />} />
              <Route path="/learn/dataInterpretation/barChart" element={<BarChartMainRouter />} />
              <Route path="/learn/dataInterpretation/barChart/introduction" element={<BarChartIntroRouter />} />
              <Route path="/learn/dataInterpretation/barChart/largestSmallest" element={<TheLargestAndSmallestRouter />} />
              <Route path="/learn/dataInterpretation/barChart/differentScale" element={<IncreaseTheScaleTo2Router />} />
              <Route path="/learn/dataInterpretation/barChart/anomaliesInBar" element={<FindingAnomaliesInBarChartRouter />} />
              <Route path="/learn/dataInterpretation/barChart/createBarChart" element={<CreateBarChartRouter />} />
              <Route path="/learn/dataInterpretation/barChart/twoClassBarChart" element={<DoubleBarChartTwoClassRouter />} />

              <Route path="/learn/dataInterpretation/barChart/doubleBarChart" element={<DoubleBarComparisonIntroRouter />} />

              <Route path="/learn/dataInterpretation/barChart/doubleBCCumulative" element={<DoubleBCCumulativeDataAnalysisRouter />} />

              
              


              {/* Games */}
              <Route path="/games" element={<GamesHome />} />

              {/* Puzzle module router */}

              <Route path="/puzzles" element={<PuzzleRouter />} />
              <Route path="/puzzles/mission" element={<PuzzleMissionRouter />} />
              <Route path="/puzzles/metricSum" element={<PuzzleMetricSumRouter />} />
              <Route path="/puzzles/sacredGame" element={<SacredGameRouter />} />
              {/* Alphabet Games Menu */}
              <Route path="/games/alphabets" element={<AlphabetGamesPageWrapper />} />
              
              {/* Alphabet Games */}
              <Route path="/games/alphabets/letter-match" element={<LetterMatchGameWrapper />} />
              <Route path="/games/alphabets/sequence" element={<AlphabetSequenceGameWrapper />} />
              <Route path="/games/alphabets/fruit-naming" element={<FruitNamingGameWrapper />} />
              <Route path="/games/alphabets/random-balloon" element={<RandomAlphabetGameWrapper />} />
              <Route path="/games/alphabets/tracing" element={<AlphabetTracingGameWrapper />} />
              <Route path="/games/alphabets/counting" element={<AlphabetCountingGameWrapper />} />
              <Route path="/games/alphabets/fill-blanks" element={<AlphabetFillBlanksGameWrapper />} />
              <Route path="/games/alphabets/object-matching" element={<AlphabetObjectMatchingGameWrapper />} />
              <Route path="/games/alphabets/case-matching" element={<AlphabetCaseMatchingGameWrapper />} />
              <Route path="/games/alphabets/sorting" element={<AlphabetSortingGameWrapper />} />
              <Route path="/games/alphabets/descending" element={<AlphabetDescendingGameWrapper />} />
              <Route path="/games/alphabets/story-cards" element={<AlphabetStoryCardsGameWrapper />} />
              <Route path="/games/alphabets/begin-sound" element={<AlphabetBeginningSoundGameWrapper />} />
              <Route path="/games/alphabets/letter-puzzle" element={<AlphabetLetterPuzzleGameWrapper />} />
              <Route path="/games/alphabets/path-maze" element={<AlphabetLetterPathMazeGameWrapper />} />
              <Route path="/games/alphabets/rhyming" element={<AlphabetRhymingGameWrapper />} />
              <Route path="/games/alphabets/name-builder" element={<AlphabetNameBuilderGameWrapper />} />
              <Route path="/games/alphabets/find-tap" element={<AlphabetFindTapGameWrapper />} />
              <Route path="/games/alphabets/uppercase-usage" element={<AlphabetUppercaseUsageGameWrapper />} />
              <Route path="/games/alphabets/letter-safari" element={<LetterHuntSafariGameWrapper />} />
              <Route path="/games/alphabets/dance-party" element={<AlphabetDancePartyGameWrapper />} />
              <Route path="/games/alphabets/size-sorting" element={<LetterSizeSortingGameWrapper />} />
              <Route path="/games/alphabets/print-match" element={<EnvironmentalPrintMatchGameWrapper />} />
              <Route path="/games/alphabets/cvc-builder" element={<CVCWordBuilderGameWrapper />} />
              <Route path="/games/alphabets/word-families" element={<WordFamilyHousesGameWrapper />} />
              <Route path="/games/alphabets/alphabet-chef" element={<AlphabetChefGameWrapper />} />
              <Route path="/games/alphabets/sight-words" element={<SightWordStarsGameWrapper />} />
              <Route path="/games/alphabets/pre-writing" element={<PreWritingStrokesGameWrapper />} />
              <Route path="/games/alphabets/blending" element={<BlendingBridgeGameWrapper />} />
              <Route path="/games/alphabets/sentence-builder" element={<SentenceBuilderGameWrapper />} />
              <Route path="/games/alphabets/compound-words" element={<CompoundWordFactoryGameWrapper />} />

              {/* Numbers Games Menu */}
              <Route path="/games/numbers" element={<NumbersGamesPageWrapper />} />

              
              
              {/* Numbers Games */}
              <Route path="/games/numbers/introduction" element={<NumberIntroductionWrapper />} />
              <Route path="/games/numbers/association" element={<NumberFocusWrapper />} />
              <Route path="/games/numbers/identification" element={<NumberIdentificationGameWrapper />} />
              <Route path="/games/numbers/counting" element={<NumberCountingGameWrapper />} />
              <Route path="/games/numbers/tracing" element={<NumberTracingGameWrapper />} />
              <Route path="/games/numbers/sequence" element={<NumberSequenceGameWrapper />} />
              <Route path="/games/numbers/fill-the-blanks" element={<FillInTheBlanksGameWrapper />} />
              <Route path="/games/numbers/descending" element={<DescendingOrderGameWrapper />} />
              <Route path="/games/numbers/dot-dash-rockets" element={<DotDashRocketsGameWrapper />} />
              <Route path="/games/numbers/ladybug-spots" element={<LadybugSpotsMatchGameWrapper />} />
              <Route path="/games/numbers/more" element={<MoreOrLessMarketGameWrapper />} />
              <Route path="/games/numbers/less" element={<LessGameWrapper />} />
              <Route path="/games/numbers/cleanup-count" element={<CleanUpCountGameWrapper />} />
              <Route path="/games/numbers/number-bridge" element={<NumberBridgeGameWrapper />} />
              <Route path="/games/numbers/pattern-train-cars" element={<PatternTrainCarsGameWrapper />} />
              <Route path="/games/numbers/snack-sharing-party" element={<SnackSharingPartyGameWrapper />} />
              <Route path="/games/numbers/ten-frame-garden" element={<TenFrameGardenGameWrapper />} />
              <Route path="/games/numbers/add-the-animals" element={<AddTheAnimalsGameWrapper />} />
              <Route path="/games/numbers/number-bonds-bubbles" element={<NumberBondsBubblesGameWrapper />} />
              <Route path="/games/numbers/jumping-frogs" element={<JumpingFrogsGameWrapper />} />
              <Route path="/games/numbers/fill-the-bucket" element={<FillTheBucketGameWrapper />} />
              <Route path="/games/numbers/zero-hero" element={<ZeroTheHeroGameWrapper />} />
              <Route path="/games/numbers/pizza-party" element={<PizzaPartySharingGameWrapper />} />
              <Route path="/games/numbers/coin-collector" element={<CoinCollectorGameWrapper />} />
              <Route path="/games/numbers/ordinal-race" element={<OrdinalRaceTrackGameWrapper />} />
              <Route path="/games/numbers/shape-puzzles" element={<ShapeNumberPuzzlesGameWrapper />} />
              <Route path="/games/numbers/clock-time" element={<ClockTowerTimeGameWrapper />} />
              <Route path="/games/numbers/number-detective" element={<NumberDetectiveGameWrapper />} />
              <Route path="/games/numbers/subtract-snacks" element={<SubtractTheSnacksGameWrapper />} />
              <Route path="/games/numbers/measure-monsters" element={<MeasureTheMonstersGameWrapper />} />
              <Route path="/games/numbers/number-jumper" element={<NumberLineJumperGameWrapper />} />
              <Route path="/games/numbers/understanding-equal" element={<UnderstandingEqualGameWrapper />} />

              <Route path="/games/shapes" element={<ShapesGamesPageWrapper />} />
              <Route path="/games/shapes/introduction" element={<ShapesIntroductionWrapper />} />
              <Route path="/games/shapes/bear" element={<ShapesBearWrapper />} />
              <Route path="/games/shapes/bus" element={<ShapesBusWrapper />} />
              <Route path="/games/shapes/tree" element={<ShapesTreeWrapper />} />
              
              {/* Visual Logic Games Menu */}
              <Route path="/games/visuallogic" element={<VisualLogicGamesPageWrapper />} />
              
              {/* Visual Logic Games */}
              <Route path="/games/visuallogic/same" element={<VisualLogicSameWrapper />} />
              <Route path="/games/visuallogic/above" element={<VisualLogicAboveWrapper />} />
              <Route path="/games/visuallogic/below" element={<VisualLogicBelowWrapper />} />
              <Route path="/games/visuallogic/above-below" element={<VisualLogicAboveAndBelowWrapper />} />
              <Route path="/games/visuallogic/above-below-mix" element={<VisualLogicAboveAndBelowMixWrapper />} />
              <Route path="/games/visuallogic/tall-short" element={<VisualLogicTallAndShortWrapper />} />
              <Route path="/games/visuallogic/tall" element={<VisualLogicTallWrapper />} />
              <Route path="/games/visuallogic/short" element={<VisualLogicShortWrapper />} />
              <Route path="/games/visuallogic/full-empty" element={<VisualLogicFullAndEmptyWrapper />} />
              <Route path="/games/visuallogic/full" element={<VisualLogicFullWrapper />} />
              <Route path="/games/visuallogic/empty" element={<VisualLogicEmptyWrapper />} />
              <Route path="/games/visuallogic/different" element={<VisualLogicDifferentWrapper />} />
              <Route path="/games/visuallogic/big" element={<VisualLogicBigWrapper />} />
              <Route path="/games/visuallogic/small" element={<VisualLogicSmallWrapper />} />
              <Route path="/games/visuallogic/big-small-mix" element={<VisualLogicBigAndSmallMixWrapper />} />
              <Route path="/games/visuallogic/inside" element={<VisualLogicInsideWrapper />} />
              <Route path="/games/visuallogic/outside" element={<VisualLogicOutsideWrapper />} />
              <Route path="/games/visuallogic/inside-outside-mix" element={<VisualLogicInsideAndOutsideMixWrapper />} />

              {/* Shapes (Coming Soon) */}
              {/* <Route path="/games/shapes" element={<ShapesGamesPageWrapper />} /> */}

              {/* Memory Games Menu */}
              <Route path="/games/memory" element={<MemoryGamesPageWrapper />} />
              
              {/* Memory Games */}
              <Route path="/games/memory/animals" element={<AnimalMatchingGameWrapper />} />
              <Route path="/games/memory/fruits" element={<FruitsMatchingGameWrapper />} />
              <Route path="/games/memory/numbers" element={<NumberMatchingGameWrapper />} />

              {/* Puzzles Menu */}
              <Route path="/games/puzzles" element={<PuzzlesPageWrapper />} />
              
              {/* Puzzles */}
              <Route path="/games/puzzles/apple" element={<AppleArrangementGameWrapper />} />
              <Route path="/games/puzzles/orange" element={<OrangeArrangementGameWrapper />} />
              <Route path="/games/puzzles/orange-complex" element={<OrangeComplexArrangementGameWrapper />} />
              <Route path="/games/puzzles/giraffe-complex" element={<GiraffeComplexArrangementGameWrapper />} />

              {/* Roadmap */}
              <Route path="/roadmap" element={<Roadmap />} />

              {/* User Profile */}
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/user-profile" element={<UserProfiles />} />

              {/* Calendar */}
              <Route path="/calendar" element={<Calendar />} />

              {/* Blank Page */}
              <Route path="/blank" element={<Blank />} />

              {/* Forms */}
              <Route path="/forms" element={<FormElements />} />
              <Route path="/form-elements" element={<FormElements />} />

              {/* Tables */}
              <Route path="/tables" element={<BasicTables />} />
              <Route path="/basic-tables" element={<BasicTables />} />

              {/* UI Elements */}
              <Route path="/ui/alerts" element={<Alerts />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/ui/avatars" element={<Avatars />} />
              <Route path="/avatars" element={<Avatars />} />
              <Route path="/ui/badges" element={<Badges />} />
              <Route path="/badges" element={<Badges />} />
              <Route path="/badge" element={<Badges />} />
              <Route path="/ui/buttons" element={<Buttons />} />
              <Route path="/buttons" element={<Buttons />} />
              <Route path="/ui/images" element={<Images />} />
              <Route path="/images" element={<Images />} />
              <Route path="/ui/videos" element={<Videos />} />
              <Route path="/videos" element={<Videos />} />

              {/* Charts */}
              <Route path="/charts/line" element={<LineChart />} />
              <Route path="/line-chart" element={<LineChart />} />
              <Route path="/charts/bar" element={<BarChart />} />
              <Route path="/bar-chart" element={<BarChart />} />

              {/* Feedback */}
              <Route path="/feedback" element={<FeedBackComponent />} />
            </Route>

            {/* Auth Routes - Public */}
            <Route path="/auth/signin" element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/auth/signup" element={<SignUp />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/register" element={<SignUp />} />

            {/* Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </SettingsProvider>
  );
}
