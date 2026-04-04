import { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ProfileProtectedRoute } from "./components/auth/ProfileProtectedRoute";
import FeedBackComponent from "./pages/Feedback";

// Lazy-loaded major sections
const ProfileSelection = lazy(() => import("./pages/AuthPages/ProfileSelection"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard"));
const Progress = lazy(() => import("./pages/parent/Progress"));
const PlatformIntro = lazy(() => import("./pages/parent/PlatformIntro"));
const Subscription = lazy(() => import("./pages/parent/Subscription"));
const Profile = lazy(() => import("./pages/parent/Profile"));
const Settings = lazy(() => import("./pages/parent/Settings"));
const KidsHub = lazy(() => import("./pages/Dashboard/KidsHub"));
const Roadmap = lazy(() => import("./x-tars/Roadmap"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Blank = lazy(() => import("./pages/Blank"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));

// Dynamic Alphabet Game Wrappers
const AlphabetGames = () => import("./x-tars/courses/Kids/basics/Alphabets/AlphabetGameWrappers");
const AlphabetGamesPageWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetGamesPageWrapper })));
const LetterMatchGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.LetterMatchGameWrapper })));
const AlphabetSequenceGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetSequenceGameWrapper })));
const FruitNamingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.FruitNamingGameWrapper })));
const RandomAlphabetGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.RandomAlphabetGameWrapper })));
const AlphabetTracingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetTracingGameWrapper })));
const AlphabetCountingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetCountingGameWrapper })));
const AlphabetFillBlanksGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetFillBlanksGameWrapper })));
const AlphabetObjectMatchingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetObjectMatchingGameWrapper })));
const AlphabetCaseMatchingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetCaseMatchingGameWrapper })));
const AlphabetSortingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetSortingGameWrapper })));
const AlphabetDescendingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetDescendingGameWrapper })));
const AlphabetStoryCardsGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetStoryCardsGameWrapper })));
const AlphabetBeginningSoundGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetBeginningSoundGameWrapper })));
const AlphabetLetterPuzzleGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetLetterPuzzleGameWrapper })));
const AlphabetLetterPathMazeGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetLetterPathMazeGameWrapper })));
const AlphabetRhymingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetRhymingGameWrapper })));
const AlphabetNameBuilderGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetNameBuilderGameWrapper })));
const AlphabetFindTapGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetFindTapGameWrapper })));
const AlphabetUppercaseUsageGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetUppercaseUsageGameWrapper })));
const LetterHuntSafariGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.LetterHuntSafariGameWrapper })));
const AlphabetDancePartyGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetDancePartyGameWrapper })));
const LetterSizeSortingGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.LetterSizeSortingGameWrapper })));
const EnvironmentalPrintMatchGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.EnvironmentalPrintMatchGameWrapper })));
const CVCWordBuilderGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.CVCWordBuilderGameWrapper })));
const WordFamilyHousesGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.WordFamilyHousesGameWrapper })));
const AlphabetChefGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.AlphabetChefGameWrapper })));
const SightWordStarsGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.SightWordStarsGameWrapper })));
const PreWritingStrokesGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.PreWritingStrokesGameWrapper })));
const BlendingBridgeGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.BlendingBridgeGameWrapper })));
const SentenceBuilderGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.SentenceBuilderGameWrapper })));
const CompoundWordFactoryGameWrapper = lazy(() => AlphabetGames().then(m => ({ default: m.CompoundWordFactoryGameWrapper })));

// Dynamic Number Game Wrappers
const NumbersGames = () => import("./x-tars/courses/Kids/basics/Numbers/NumbersGameWrappers");
const NumbersGamesPageWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumbersGamesPageWrapper })));
const NumberIntroductionWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberIntroductionWrapper })));
const NumberFocusWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberFocusWrapper })));
const NumberIdentificationGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberIdentificationGameWrapper })));
const NumberSequenceGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberSequenceGameWrapper })));
const FillInTheBlanksGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.FillInTheBlanksGameWrapper })));
const DescendingOrderGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.DescendingOrderGameWrapper })));
const NumberTracingGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberTracingGameWrapper })));
const NumberCountingGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberCountingGameWrapper })));
const DotDashRocketsGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.DotDashRocketsGameWrapper })));
const LadybugSpotsMatchGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.LadybugSpotsMatchGameWrapper })));
const MoreOrLessMarketGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.MoreOrLessMarketGameWrapper })));
const LessGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.LessGameWrapper })));
const CleanUpCountGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.CleanUpCountGameWrapper })));
const NumberBridgeGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberBridgeGameWrapper })));
const PatternTrainCarsGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.PatternTrainCarsGameWrapper })));
const SnackSharingPartyGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.SnackSharingPartyGameWrapper })));
const TenFrameGardenGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.TenFrameGardenGameWrapper })));
const AddTheAnimalsGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.AddTheAnimalsGameWrapper })));
const NumberBondsBubblesGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberBondsBubblesGameWrapper })));
const JumpingFrogsGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.JumpingFrogsGameWrapper })));
const FillTheBucketGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.FillTheBucketGameWrapper })));
const ZeroTheHeroGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.ZeroTheHeroGameWrapper })));
const PizzaPartySharingGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.PizzaPartySharingGameWrapper })));
const CoinCollectorGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.CoinCollectorGameWrapper })));
const UnderstandingEqualGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.UnderstandingEqualGameWrapper })));
const OrdinalRaceTrackGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.OrdinalRaceTrackGameWrapper })));
const ShapeNumberPuzzlesGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.ShapeNumberPuzzlesGameWrapper })));
const ClockTowerTimeGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.ClockTowerTimeGameWrapper })));
const NumberDetectiveGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberDetectiveGameWrapper })));
const SubtractTheSnacksGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.SubtractTheSnacksGameWrapper })));
const MeasureTheMonstersGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.MeasureTheMonstersGameWrapper })));
const NumberLineJumperGameWrapper = lazy(() => NumbersGames().then(m => ({ default: m.NumberLineJumperGameWrapper })));

// Dynamic Shape Game Wrappers
const ShapesGames = () => import("./x-tars/courses/Kids/basics/Shapes/ShapesWrapper");
const ShapesGamesPageWrapper = lazy(() => ShapesGames().then(m => ({ default: m.ShapesGamesPageWrapper })));
const ShapesBearWrapper = lazy(() => ShapesGames().then(m => ({ default: m.ShapesBearWrapper })));
const ShapesBusWrapper = lazy(() => ShapesGames().then(m => ({ default: m.ShapesBusWrapper })));
const ShapesTreeWrapper = lazy(() => ShapesGames().then(m => ({ default: m.ShapesTreeWrapper })));
const ShapesIntroductionWrapper = lazy(() => ShapesGames().then(m => ({ default: m.ShapesIntroductionWrapper })));

// Dynamic Visual Logic Wrappers
const VisualLogicGames = () => import("./x-tars/courses/Kids/basics/VisualLogic/VisualLogicWrapper");
const VisualLogicGamesPageWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicGamesPageWrapper })));
const VisualLogicSameWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicSameWrapper })));
const VisualLogicAboveWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicAboveWrapper })));
const VisualLogicBelowWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicBelowWrapper })));
const VisualLogicAboveAndBelowWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicAboveAndBelowWrapper })));
const VisualLogicAboveAndBelowMixWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicAboveAndBelowMixWrapper })));
const VisualLogicTallAndShortWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicTallAndShortWrapper })));
const VisualLogicTallWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicTallWrapper })));
const VisualLogicShortWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicShortWrapper })));
const VisualLogicFullAndEmptyWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicFullAndEmptyWrapper })));
const VisualLogicFullWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicFullWrapper })));
const VisualLogicEmptyWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicEmptyWrapper })));
const VisualLogicDifferentWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicDifferentWrapper })));
const VisualLogicBigWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicBigWrapper })));
const VisualLogicSmallWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicSmallWrapper })));
const VisualLogicBigAndSmallMixWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicBigAndSmallMixWrapper })));
const VisualLogicInsideWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicInsideWrapper })));
const VisualLogicOutsideWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicOutsideWrapper })));
const VisualLogicInsideAndOutsideMixWrapper = lazy(() => VisualLogicGames().then(m => ({ default: m.VisualLogicInsideAndOutsideMixWrapper })));

// Other Sections
const MemoryGames = () => import("./x-tars/courses/Kids/basics/MemoryGame/MemoryGameWrappers");
const MemoryGamesPageWrapper = lazy(() => MemoryGames().then(m => ({ default: m.MemoryGamesPageWrapper })));
const AnimalMatchingGameWrapper = lazy(() => MemoryGames().then(m => ({ default: m.AnimalMatchingGameWrapper })));
const FruitsMatchingGameWrapper = lazy(() => MemoryGames().then(m => ({ default: m.FruitsMatchingGameWrapper })));
const NumberMatchingGameWrapper = lazy(() => MemoryGames().then(m => ({ default: m.NumberMatchingGameWrapper })));

const Puzzles = () => import("./x-tars/courses/Kids/basics/Arrangement/PuzzleGameWrappers");
const PuzzlesPageWrapper = lazy(() => Puzzles().then(m => ({ default: m.PuzzlesPageWrapper })));
const AppleArrangementGameWrapper = lazy(() => Puzzles().then(m => ({ default: m.AppleArrangementGameWrapper })));
const OrangeArrangementGameWrapper = lazy(() => Puzzles().then(m => ({ default: m.OrangeArrangementGameWrapper })));
const OrangeComplexArrangementGameWrapper = lazy(() => Puzzles().then(m => ({ default: m.OrangeComplexArrangementGameWrapper })));
const GiraffeComplexArrangementGameWrapper = lazy(() => Puzzles().then(m => ({ default: m.GiraffeComplexArrangementGameWrapper })));

const PuzzlesSection = () => import("./x-tars/courses/Puzzles/PuzzlesWrapper");
const PuzzleRouter = lazy(() => PuzzlesSection().then(m => ({ default: m.PuzzleRouter })));
const PuzzleMissionRouter = lazy(() => PuzzlesSection().then(m => ({ default: m.PuzzleMissionRouter })));
const PuzzleMetricSumRouter = lazy(() => PuzzlesSection().then(m => ({ default: m.PuzzleMetricSumRouter })));
const SacredGameRouter = lazy(() => PuzzlesSection().then(m => ({ default: m.SacredGameRouter })));

const LearnModule = () => import("./x-tars/courses/Learn/LearnModuleWrapper");
const LearnRouter = lazy(() => LearnModule().then(m => ({ default: m.LearnRouter })));
const LearnMathsRouter = lazy(() => LearnModule().then(m => ({ default: m.LearnMathsRouter })));
const LogicalReasoningMainRouter = lazy(() => LearnModule().then(m => ({ default: m.LogicalReasoningMainRouter })));
const DataInterpretationMainRouter = lazy(() => LearnModule().then(m => ({ default: m.DataInterpretationMainRouter })));

// Course Routers
const LogicalReasoning = () => import("./x-tars/courses/Learn/LogicalReasoning/LogicalReasoningRouterWrapper");
const LinearArrangementMainRouter = lazy(() => LogicalReasoning().then(m => ({ default: m.LinearArrangementMainRouter })));
const BloodRelationsMainRouter = lazy(() => LogicalReasoning().then(m => ({ default: m.BloodRelationsMainRouter })));
const OrderAndRankingMainRouter = lazy(() => LogicalReasoning().then(m => ({ default: m.OrderAndRankingMainRouter })));
const ClockMainRouter = lazy(() => LogicalReasoning().then(m => ({ default: m.ClockMainRouter })));

// Sub-Router Modules
const BRModules = () => import("./x-tars/courses/Learn/LogicalReasoning/BloodRelationship/BloodRelationsRouterWrapper");
const BRIntroRouter = lazy(() => BRModules().then(m => ({ default: m.BRIntroRouter })));
const BRAncilliaryRouter = lazy(() => BRModules().then(m => ({ default: m.BRAncilliaryRouter })));
const BRFundamentalsRouter = lazy(() => BRModules().then(m => ({ default: m.BRFundamentalsRouter })));
const BRMoreRelationshipsRouter = lazy(() => BRModules().then(m => ({ default: m.BRMoreRelationshipsRouter })));
const BRWorkingWithInstructionRouter = lazy(() => BRModules().then(m => ({ default: m.BRWorkingWithInstructionRouter })));
const BRCodeIntroRouter = lazy(() => BRModules().then(m => ({ default: m.BRCodeIntroRouter })));
const BRCodedBuildingTreeRouter = lazy(() => BRModules().then(m => ({ default: m.BRCodedBuildingTreeRouter })));
const BRCodedDeduceRelationshipRouter = lazy(() => BRModules().then(m => ({ default: m.BRCodedDeduceRelationshipRouter })));

const ORModules = () => import("./x-tars/courses/Learn/LogicalReasoning/OrderAndRanking/OrderAndRankingRouterWrapper");
const ORAscendingDescendingRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingRouter })));
const ORAscendingDescendingWeightRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingWeightRouter })));
const ORAscendingDescendingFollowInstrRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingFollowInstrRouter })));
const ORAscendingHeightTallShortRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingHeightTallShortRouter })));
const ORAscendingDescendingComplexRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingComplexRouter })));
const ORAscendingDescendingMultiScenarioNoFixRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingMultiScenarioNoFixRouter })));
const ORAscendingDescendingClubbingInstructionsRouter = lazy(() => ORModules().then(m => ({ default: m.ORAscendingDescendingClubbingInstructionsRouter })));
const ORNumberOfPersonsRouter = lazy(() => ORModules().then(m => ({ default: m.ORNumberOfPersonsRouter })));
const ORNumberOfPersonsShiftingRouter = lazy(() => ORModules().then(m => ({ default: m.ORNumberOfPersonsShiftingRouter })));
const ORNumberOfPersonIfBothLeftRightRouter = lazy(() => ORModules().then(m => ({ default: m.ORNumberOfPersonIfBothLeftRightRouter })));
const ORNOPRelativePositionForTwoUsersRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPRelativePositionForTwoUsersRouter })));
const ORNOPPeopleWithDiffSideRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPPeopleWithDiffSideRouter })));
const ORNOPMultiPeopleRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPMultiPeopleRouter })));
const ORNOPPeopleInterchangePosRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPPeopleInterchangePosRouter })));
const ORNOPWhoAnchorRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPWhoAnchorRouter })));
const ORNOPClassRatioRouter = lazy(() => ORModules().then(m => ({ default: m.ORNOPClassRatioRouter })));

const ClockModules = () => import("./x-tars/courses/Learn/LogicalReasoning/Clock/ClockRouterWrapper");
const ClockIntroductionRouter = lazy(() => ClockModules().then(m => ({ default: m.ClockIntroductionRouter })));
const ClockHourHandRotationRouter = lazy(() => ClockModules().then(m => ({ default: m.ClockHourHandRotationRouter })));
const HMHandRotationRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandRotationRouter })));
const AngleBetweenHMHandRouter = lazy(() => ClockModules().then(m => ({ default: m.AngleBetweenHMHandRouter })));
const ReflexAngleRouter = lazy(() => ClockModules().then(m => ({ default: m.ReflexAngleRouter })));
const HMHandOverlapRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandOverlapRouter })));
const HMHandAt90Router = lazy(() => ClockModules().then(m => ({ default: m.HMHandAt90Router })));
const HMHandStraightLineRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandStraightLineRouter })));
const HMHandOverlapAgainRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandOverlapAgainRouter })));
const HMHandErrorRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandErrorRouter })));
const HMHandCertainAnglesInDayRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandCertainAnglesInDayRouter })));
const HMHandErrorRecoveryRouter = lazy(() => ClockModules().then(m => ({ default: m.HMHandErrorRecoveryRouter })));

const LAModules = () => import("./x-tars/courses/Learn/LogicalReasoning/LinearArrangement/LinearArrangementRouterWrapper");
const LinearArrangementIntroductionRouter = lazy(() => LAModules().then(m => ({ default: m.LinearArrangementIntroductionRouter })));
const LinearArrangementLeftRightRouter = lazy(() => LAModules().then(m => ({ default: m.LinearArrangementLeftRightRouter })));
const LADirectionMattersLeftRightRouter = lazy(() => LAModules().then(m => ({ default: m.LADirectionMattersLeftRightRouter })));
const ImmediateRightAndLeftRouter = lazy(() => LAModules().then(m => ({ default: m.ImmediateRightAndLeftRouter })));
const LinearArrangementBetweenRouter = lazy(() => LAModules().then(m => ({ default: m.LinearArrangementBetweenRouter })));
const LAFirstSecondLeftRightRouter = lazy(() => LAModules().then(m => ({ default: m.LAFirstSecondLeftRightRouter })));
const LANumberOfPeopleSittingBetweenRouter = lazy(() => LAModules().then(m => ({ default: m.LANumberOfPeopleSittingBetweenRouter })));
const LAExtremeLeftRightRouter = lazy(() => LAModules().then(m => ({ default: m.LAExtremeLeftRightRouter })));
const LAFollowInstructionIntroRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowInstructionIntroRouter })));
const LAFollowInstructionRightRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowInstructionRightRouter })));
const LAFollowInstructionLeftRightBothRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowInstructionLeftRightBothRouter })));
const LAFollowInstructionDirectionLeftRightRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowInstructionDirectionLeftRightRouter })));
const LAFollowingInstructionWithBetweenAndExtremeEndRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowingInstructionWithBetweenAndExtremeEndRouter })));
const LAFollowingInstructionDiffDirectionIntermediateRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowingInstructionDiffDirectionIntermediateRouter })));
const LAFollowingInstructionComplexityHighRouter = lazy(() => LAModules().then(m => ({ default: m.LAFollowingInstructionComplexityHighRouter })));
const LAActualWorldIntroHighRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldIntroHighRouter })));
const LAActualWorldNorthRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldNorthRouter })));
const LAActualWorldSouthRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldSouthRouter })));
const LAActualWorldSittingParallelRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldSittingParallelRouter })));
const LAActualWorldDirectionDoesNotMatterRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldDirectionDoesNotMatterRouter })));
const LAActualWorldMultipleCaseIntroRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldMultipleCaseIntroRouter })));
const LAActualWorldMultipleCaseIntermediateRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorldMultipleCaseIntermediateRouter })));
const LAActualWorld2DIntroRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorld2DIntroRouter })));
const LAActualWorld3DIntroRouter = lazy(() => LAModules().then(m => ({ default: m.LAActualWorld3DIntroRouter })));
const LAInstructionGyaanAnchorRouter = lazy(() => LAModules().then(m => ({ default: m.LAInstructionGyaanAnchorRouter })));
const LAInstructionGyaanAnchorFromMultipleInstrRouter = lazy(() => LAModules().then(m => ({ default: m.LAInstructionGyaanAnchorFromMultipleInstrRouter })));
const LAInstructionGyaanLeadingToAnchorRouter = lazy(() => LAModules().then(m => ({ default: m.LAInstructionGyaanLeadingToAnchorRouter })));
const LAInstructionGyaanUseMultipleInstrForAnchorRouter = lazy(() => LAModules().then(m => ({ default: m.LAInstructionGyaanUseMultipleInstrForAnchorRouter })));

const MathsModules = () => import("./x-tars/courses/Learn/maths/MathsRouterWrapper");
const AlgebraicExpressionRouter = lazy(() => MathsModules().then(m => ({ default: m.AlgebraicExpressionRouter })));
const PercentageRouter = lazy(() => MathsModules().then(m => ({ default: m.PercentageRouter })));

const AlgebraModules = () => import("./x-tars/courses/Learn/maths/AlgebraicExpression/AlgebraRouterWrapper");
const AlgebraicIntroductionRouter = lazy(() => AlgebraModules().then(m => ({ default: m.AlgebraicIntroductionRouter })));
const FindingWeightUnknowRouter = lazy(() => AlgebraModules().then(m => ({ default: m.FindingWeightUnknowRouter })));
const RightScaleRouter = lazy(() => AlgebraModules().then(m => ({ default: m.RightScaleRouter })));
const LhsrhsIntroductionRouter = lazy(() => AlgebraModules().then(m => ({ default: m.LhsrhsIntroductionRouter })));
const AELikeUnlikeTermsRouter = lazy(() => AlgebraModules().then(m => ({ default: m.AELikeUnlikeTermsRouter })));
const AlgebraicExpressionIntroRouter = lazy(() => AlgebraModules().then(m => ({ default: m.AlgebraicExpressionIntroRouter })));
const MonoBinoPolyIdentificationRouter = lazy(() => AlgebraModules().then(m => ({ default: m.MonoBinoPolyIdentificationRouter })));
const VariableCoeffConstIntroRouter = lazy(() => AlgebraModules().then(m => ({ default: m.VariableCoeffConstIntroRouter })));
const IntroToXRouter = lazy(() => AlgebraModules().then(m => ({ default: m.IntroToXRouter })));
const ActionREactionRouter = lazy(() => AlgebraModules().then(m => ({ default: m.ActionREactionRouter })));
const BalancedScaleToXTransitionRouter = lazy(() => AlgebraModules().then(m => ({ default: m.BalancedScaleToXTransitionRouter })));
const SolveTheBasicEquationRouter = lazy(() => AlgebraModules().then(m => ({ default: m.SolveTheBasicEquationRouter })));
const SolveEquationsAXPlusBRouter = lazy(() => AlgebraModules().then(m => ({ default: m.SolveEquationsAXPlusBRouter })));
const WarModeAEBeginnerRouter = lazy(() => AlgebraModules().then(m => ({ default: m.WarModeAEBeginnerRouter })));
const WarModeAEIntermediateRouter = lazy(() => AlgebraModules().then(m => ({ default: m.WarModeAEIntermediateRouter })));

const PercentageModules = () => import("./x-tars/courses/Learn/maths/Percentage/PercentageRouterWrapper");
const PercentageIntroRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentageIntroRouter })));
const PercentageCalculationRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentageCalculationRouter })));
const PercentageFractionRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentageFractionRouter })));
const PercentageFindPercRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentageFindPercRouter })));
const PercentagePercGameRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercGameRouter })));
const PercentagePercFromTotalRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercFromTotalRouter })));
const PercentagePercKnownGenericRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercKnownGenericRouter })));
const PercentagePercValueGodlenFormulaRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercValueGodlenFormulaRouter })));
const PercentagePercIncreasedByRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercIncreasedByRouter })));
const PercentagePercDecreasedByRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercDecreasedByRouter })));
const PercentagePercIncreasedDecreasedRouter = lazy(() => PercentageModules().then(m => ({ default: m.PercentagePercIncreasedDecreasedRouter })));

const DIModules = () => import("./x-tars/courses/Learn/DataInterpretation/DIRouterWrapper");
const BarChartMainRouter = lazy(() => DIModules().then(m => ({ default: m.BarChartMainRouter })));
const LineChartMainRouter = lazy(() => DIModules().then(m => ({ default: m.LineChartMainRouter })));

const BarChartModules = () => import("./x-tars/courses/Learn/DataInterpretation/BarChart/BarChartRouterWrapper");
const BarChartIntroRouter = lazy(() => BarChartModules().then(m => ({ default: m.BarChartIntroRouter })));
const TheLargestAndSmallestRouter = lazy(() => BarChartModules().then(m => ({ default: m.TheLargestAndSmallestRouter })));
const IncreaseTheScaleTo2Router = lazy(() => BarChartModules().then(m => ({ default: m.IncreaseTheScaleTo2Router })));
const FindingAnomaliesInBarChartRouter = lazy(() => BarChartModules().then(m => ({ default: m.FindingAnomaliesInBarChartRouter })));
const CreateBarChartRouter = lazy(() => BarChartModules().then(m => ({ default: m.CreateBarChartRouter })));
const DoubleBarChartTwoClassRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBarChartTwoClassRouter })));
const DoubleBarComparisonIntroRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBarComparisonIntroRouter })));
const DoubleBCCumulativeDataAnalysisRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBCCumulativeDataAnalysisRouter })));
const DoubleBarChartMissingBarsRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBarChartMissingBarsRouter })));
const DoubleBCMoreComplexAnalysisRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBCMoreComplexAnalysisRouter })));
const DoubleBarChartComputationMinAvgRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBarChartComputationMinAvgRouter })));
const DoubleBCComputationRatioPercentageRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBCComputationRatioPercentageRouter })));
const DoubleBarChartProfitLossRouter = lazy(() => BarChartModules().then(m => ({ default: m.DoubleBarChartProfitLossRouter })));
const AdvancedBarChartStackedOneRouter = lazy(() => BarChartModules().then(m => ({ default: m.AdvancedBarChartStackedOneRouter })));
const AdvancedBarChartTradeTwoRouter = lazy(() => BarChartModules().then(m => ({ default: m.AdvancedBarChartTradeTwoRouter })));

const LineChartModules = () => import("./x-tars/courses/Learn/DataInterpretation/LineChart/LineChartRouterWrapper");
const LineChartIntroRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartIntroRouter })));
const LineChartCreateRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartCreateRouter })));
const LineChartDiffSmallRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartDiffSmallRouter })));
const LineChartAnomaliesRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartAnomaliesRouter })));
const LineChartRatioRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartRatioRouter })));
const LineChartPercentageRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartPercentageRouter })));
const LineChartAverageRouter = lazy(() => LineChartModules().then(m => ({ default: m.LineChartAverageRouter })));

export default function App() {
  return (
    <SettingsProvider>
      <Router>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-gray-900">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                <p className="text-white font-medium animate-pulse">Loading amazing things...</p>
              </div>
            </div>
          }>
            <ScrollToTop />
            <Routes>
              {/* Profile Selection - Initial Entry Point */}
              <Route path="/profiles" element={<ProtectedRoute><ProfileSelection /></ProtectedRoute>} />
              <Route path="/select-profile" element={<ProtectedRoute><ProfileSelection /></ProtectedRoute>} />

              {/* Kids Zone - Standalone (no AppLayout) */}
              <Route path="/games" element={<ProtectedRoute><ProfileProtectedRoute><KidsHub /></ProfileProtectedRoute></ProtectedRoute>} />

              {/* Kids Module Landing Pages - Standalone (no AppLayout sidebar) */}
              <Route path="/games/visuallogic" element={<ProtectedRoute><ProfileProtectedRoute><VisualLogicGamesPageWrapper /></ProfileProtectedRoute></ProtectedRoute>} />
              <Route path="/games/numbers" element={<ProtectedRoute><ProfileProtectedRoute><NumbersGamesPageWrapper /></ProfileProtectedRoute></ProtectedRoute>} />
              <Route path="/games/alphabets" element={<ProtectedRoute><ProfileProtectedRoute><AlphabetGamesPageWrapper /></ProfileProtectedRoute></ProtectedRoute>} />
              <Route path="/games/shapes" element={<ProtectedRoute><ProfileProtectedRoute><ShapesGamesPageWrapper /></ProfileProtectedRoute></ProtectedRoute>} />
              <Route path="/games/memory" element={<ProtectedRoute><ProfileProtectedRoute><MemoryGamesPageWrapper /></ProfileProtectedRoute></ProtectedRoute>} />
              <Route path="/puzzles" element={<ProtectedRoute><ProfileProtectedRoute><PuzzleRouter /></ProfileProtectedRoute></ProtectedRoute>} />

              {/* Dashboard Layout - Protected Routes */}
              <Route element={<ProtectedRoute><ProfileProtectedRoute><AppLayout /></ProfileProtectedRoute></ProtectedRoute>}>

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
             
             
              <Route path="/learn/mathematics/percentage" element={<PercentageRouter />} />
              <Route path="/learn/mathematics/percentage/introduction" element={<PercentageIntroRouter />} /> 
              <Route path="/learn/mathematics/percentage/calculation" element={<PercentageCalculationRouter />} /> 
              <Route path="/learn/mathematics/percentage/fractionPerc" element={<PercentageFractionRouter />} /> 
              <Route path="/learn/mathematics/percentage/FindPerc" element={<PercentageFindPercRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercGame" element={<PercentagePercGameRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercFromTotal" element={<PercentagePercFromTotalRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercKnownGeneric" element={<PercentagePercKnownGenericRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercValueGodlenFormula" element={<PercentagePercValueGodlenFormulaRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercIncreasedBy" element={<PercentagePercIncreasedByRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercDecreasedBy" element={<PercentagePercDecreasedByRouter />} /> 
              <Route path="/learn/mathematics/percentage/PercIncreasedDecreased" element={<PercentagePercIncreasedDecreasedRouter />} />       


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
            
              
              <Route path="/learn/logicalreasoning/bloodRelations" element={<BloodRelationsMainRouter />} />
              <Route path="/learn/logicalreasoning/bloodRelations/introduction" element={<BRIntroRouter />} />
              <Route path="/learn/logicalreasoning/bloodRelations/ancilliary" element={<BRAncilliaryRouter />} />
              <Route path="/learn/logicalreasoning/bloodRelations/fundamentals" element={<BRFundamentalsRouter />} />
              <Route path="/learn/logicalReasoning/bloodRelations/moreRelations" element={<BRMoreRelationshipsRouter />} />
              <Route path="/learn/logicalReasoning/bloodRelations/brWorkingWithInstructions" element={<BRWorkingWithInstructionRouter />} />
              <Route path="/learn/logicalReasoning/bloodRelations/brCodedIntro" element={<BRCodeIntroRouter />} />
              <Route path="/learn/logicalReasoning/bloodRelations/brCodedBuildingTree" element={<BRCodedBuildingTreeRouter />} />
              <Route path="/learn/logicalReasoning/bloodRelations/deduceRelationships" element={<BRCodedDeduceRelationshipRouter />} />

              

              
              <Route path="/learn/logicalreasoning/orderRanking" element={<OrderAndRankingMainRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORAscendingDescending/" element={<ORAscendingDescendingRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORAscendingDescendingWeight/" element={<ORAscendingDescendingWeightRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORAscendingDescendingInstruction/" element={<ORAscendingDescendingFollowInstrRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORHeightTallShort" element={<ORAscendingHeightTallShortRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORComplexInstructions" element={<ORAscendingDescendingComplexRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNoFixPosition" element={<ORAscendingDescendingMultiScenarioNoFixRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORUseMultipleInstruction" element={<ORAscendingDescendingClubbingInstructionsRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNumberOfPersonsIntro" element={<ORNumberOfPersonsRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNumberOfPersonsShifting" element={<ORNumberOfPersonsShiftingRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPBothLeftRight" element={<ORNumberOfPersonIfBothLeftRightRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPRelativePos" element={<ORNOPRelativePositionForTwoUsersRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPMultiPeopleDiffSides" element={<ORNOPPeopleWithDiffSideRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPMultiPeople" element={<ORNOPMultiPeopleRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPPeopleInterchangePos" element={<ORNOPPeopleInterchangePosRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPMultiAnchor" element={<ORNOPWhoAnchorRouter />} />
              <Route path="/learn/logicalReasoning/orderRanking/ORNOPClassRatio" element={<ORNOPClassRatioRouter />} />

              <Route path="/learn/logicalreasoning/clock" element={<ClockMainRouter />} />
              <Route path="/learn/logicalReasoning/clock/introduction" element={<ClockIntroductionRouter />} />
              <Route path="/learn/logicalReasoning/clock/hourhandRotation" element={<ClockHourHandRotationRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandRotation" element={<HMHandRotationRouter />} />
              <Route path="/learn/logicalReasoning/clock/anglebetweenHMHand" element={<AngleBetweenHMHandRouter />} />
              <Route path="/learn/logicalReasoning/clock/reflexAngle" element={<ReflexAngleRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandOverlap" element={<HMHandOverlapRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandAt90" element={<HMHandAt90Router />} />
              <Route path="/learn/logicalReasoning/clock/hmHandStraightLine" element={<HMHandStraightLineRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandOverlapAgain" element={<HMHandOverlapAgainRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandError" element={<HMHandErrorRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandCertainAnglesInDay" element={<HMHandCertainAnglesInDayRouter />} />
              <Route path="/learn/logicalReasoning/clock/hmHandErrorRecovery" element={<HMHandErrorRecoveryRouter />} />

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
              <Route path="/learn/dataInterpretation/barChart/doubleBCMissingBars" element={<DoubleBarChartMissingBarsRouter />} />
              <Route path="/learn/dataInterpretation/barChart/doubleBCComplexAnalysis" element={<DoubleBCMoreComplexAnalysisRouter />} />

              <Route path="/learn/dataInterpretation/barChart/doubleBCMinAvg" element={<DoubleBarChartComputationMinAvgRouter />} />
              <Route path="/learn/dataInterpretation/barChart/doubleBCRatioPercent" element={<DoubleBCComputationRatioPercentageRouter />} />
              <Route path="/learn/dataInterpretation/barChart/doubleBCProfitLoss" element={<DoubleBarChartProfitLossRouter />} />
              
              <Route path="/learn/dataInterpretation/barChart/stackedBarChart" element={<AdvancedBarChartStackedOneRouter />} />
              <Route path="/learn/dataInterpretation/barChart/tradeBarChart" element={<AdvancedBarChartTradeTwoRouter />} />

              
               <Route path="/learn/dataInterpretation/lineChart" element={<LineChartMainRouter />} />
               <Route path="/learn/dataInterpretation/lineChart/introduction" element={<LineChartIntroRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/create" element={<LineChartCreateRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/diffSmall" element={<LineChartDiffSmallRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/anomaliesLineChart" element={<LineChartAnomaliesRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/ratioLineChart" element={<LineChartRatioRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/percentageLineChart" element={<LineChartPercentageRouter />} />
                <Route path="/learn/dataInterpretation/lineChart/averageLineChart" element={<LineChartAverageRouter />} />
                

              
      

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

              {/* Parent Mode Routes */}
              <Route path="/parent" element={<ParentDashboard />} />
              <Route path="/parent/progress" element={<Progress />} />
              <Route path="/parent/intro" element={<PlatformIntro />} />
              <Route path="/parent/subscription" element={<Subscription />} />
              <Route path="/parent/profile" element={<Profile />} />
              <Route path="/parent/settings" element={<Settings />} />

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
          </Suspense>
        </AuthProvider>
      </Router>
    </SettingsProvider>
  );
}
