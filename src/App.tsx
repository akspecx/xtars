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
import CoursesHome from "./x-tars/courses/CourseHome";
import CoursesRouter from "./x-tars/courses/Router";
import GamesHome from "./x-tars/courses/Kids/MainModule/KidsMainPage";
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
  AlphabetUppercaseUsageGameWrapper
} from "./x-tars/courses/Kids/basics/Alphabets/AlphabetGameWrappers";
import { 
  NumbersGamesPageWrapper,
  NumberIdentificationGameWrapper,
  NumberSequenceGameWrapper,
  FillInTheBlanksGameWrapper,
  DescendingOrderGameWrapper,
  NumberTracingGameWrapper,
  NumberCountingGameWrapper
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
  MemoryGamesPageWrapper,
  AnimalMatchingGameWrapper,
  FruitsMatchingGameWrapper,
  NumberMatchingGameWrapper
} from "./x-tars/courses/Kids/games/MemoryGame/MemoryGameWrappers";
import { 
  PuzzlesPageWrapper,
  AppleArrangementGameWrapper,
  OrangeArrangementGameWrapper,
  OrangeComplexArrangementGameWrapper,
  GiraffeComplexArrangementGameWrapper
} from "./x-tars/courses/Kids/games/puzzles/Arrangement/PuzzleGameWrappers";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import FeedBackComponent from "./pages/Feedback";

export default function App() {
  return (
    <>
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

              {/* Courses */}
              <Route path="/courses" element={<CoursesHome />} />
              <Route path="/courses/:courseid" element={<CoursesRouter />} />

              {/* Games */}
              <Route path="/games" element={<GamesHome />} />
              
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

              {/* Numbers Games Menu */}
              <Route path="/games/numbers" element={<NumbersGamesPageWrapper />} />
              
              {/* Numbers Games */}
              <Route path="/games/numbers/identification" element={<NumberIdentificationGameWrapper />} />
              <Route path="/games/numbers/counting" element={<NumberCountingGameWrapper />} />
              <Route path="/games/numbers/tracing" element={<NumberTracingGameWrapper />} />
              <Route path="/games/numbers/sequence" element={<NumberSequenceGameWrapper />} />
              <Route path="/games/numbers/fill-the-blanks" element={<FillInTheBlanksGameWrapper />} />
              <Route path="/games/numbers/descending" element={<DescendingOrderGameWrapper />} />

              <Route path="/games/shapes" element={<ShapesGamesPageWrapper />} />
              <Route path="/games/shapes/introduction" element={<ShapesIntroductionWrapper />} />
              <Route path="/games/shapes/bear" element={<ShapesBearWrapper />} />
              <Route path="/games/shapes/bus" element={<ShapesBusWrapper />} />
              <Route path="/games/shapes/tree" element={<ShapesTreeWrapper />} />
              
              

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
    </>
  );
}
