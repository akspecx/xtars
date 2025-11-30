import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

// --- Shared Types ---
export interface Theme {
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

export interface ModuleProps {
  onBack: () => void;
  theme: Theme;
  title?: string;
  icon?: string;
}

// --- Data ---
interface AlphabetGameCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  path: string;
}

const alphabetGameData: AlphabetGameCard[] = [
  { id: "match", title: "Letter Match", subtitle: "Correctly match the alphabets", icon: "🔠", gradient: "from-orange-500 to-amber-500", path: "/games/alphabets/letter-match" },
  { id: "arrange", title: "Arranging Alphabets", subtitle: "Arrange the alphabets in order", icon: "🇦🇧🇨", gradient: "from-lime-500 to-green-500", path: "/games/alphabets/sequence" },
  { id: "fruitNaming", title: "Fruit Naming", subtitle: "Practice fruit naming with letters", icon: "🍎", gradient: "from-cyan-500 to-blue-500", path: "/games/alphabets/fruit-naming" },
  { id: "randomAlphabets", title: "Random Alphabet Mapping", subtitle: "Select the correct alphabets", icon: "❓", gradient: "from-purple-500 to-fuchsia-500", path: "/games/alphabets/random-balloon" },
  { id: "tracing", title: "Trace the Letters", subtitle: "Follow dotted guides & strokes", icon: "✍️", gradient: "from-pink-500 to-purple-500", path: "/games/alphabets/tracing" },
  { id: "soundGarden", title: "Alphabet Sound Garden", subtitle: "Hear stories & chants", icon: "🎵", gradient: "from-emerald-500 to-teal-500", path: "/games/alphabets/counting" },
  { id: "storyCards", title: "Alphabet Story Cards", subtitle: "Tiny stories & chants for each letter", icon: "📖", gradient: "from-amber-400 to-orange-500", path: "/games/alphabets/story-cards" },
  { id: "fillBlanks", title: "Fill in the Blanks", subtitle: "Drag letters to complete sequences", icon: "🚂", gradient: "from-indigo-500 to-purple-500", path: "/games/alphabets/fill-blanks" },
  { id: "objectMatching", title: "Letter-Object Matching", subtitle: "Match letters with objects", icon: "🎯", gradient: "from-rose-500 to-pink-500", path: "/games/alphabets/object-matching" },
  { id: "caseMatching", title: "Uppercase / Lowercase", subtitle: "Match uppercase with lowercase", icon: "🔤", gradient: "from-blue-500 to-indigo-500", path: "/games/alphabets/case-matching" },
  { id: "sorting", title: "Letter Sorting", subtitle: "Sort by vowels, curves, and more", icon: "📦", gradient: "from-green-500 to-emerald-500", path: "/games/alphabets/sorting" },
  { id: "descending", title: "Reverse Alphabet", subtitle: "Arrange letters in reverse order", icon: "🔙", gradient: "from-orange-500 to-red-500", path: "/games/alphabets/descending" },
  { id: "beginSound", title: "Beginning Sound Picker", subtitle: "Pick pictures by starting sound", icon: "🔈", gradient: "from-sky-500 to-cyan-500", path: "/games/alphabets/begin-sound" },
  { id: "letterPuzzle", title: "Build the Letter", subtitle: "Snap pieces to build letters", icon: "🧩", gradient: "from-violet-500 to-indigo-500", path: "/games/alphabets/letter-puzzle" },
  { id: "letterMaze", title: "Letter Path Maze", subtitle: "Tap letters in order to make a path", icon: "🧭", gradient: "from-yellow-500 to-amber-500", path: "/games/alphabets/path-maze" },
  { id: "rhyming", title: "Rhyming Friends", subtitle: "Find words that rhyme", icon: "🎵", gradient: "from-fuchsia-500 to-rose-500", path: "/games/alphabets/rhyming" },
  { id: "nameBuilder", title: "Build Your Name", subtitle: "Use letters to build your name", icon: "✍️", gradient: "from-teal-500 to-emerald-500", path: "/games/alphabets/name-builder" },
  { id: "findTap", title: "Find & Tap Letters", subtitle: "Search scenes for hidden letters", icon: "🔍", gradient: "from-emerald-400 to-sky-400", path: "/games/alphabets/find-tap" },
  { id: "uppercaseUsage", title: "Uppercase or Lowercase?", subtitle: "Choose letters that should be uppercase", icon: "🔡", gradient: "from-slate-500 to-indigo-500", path: "/games/alphabets/uppercase-usage" },
  
  // NEW MODULES
  { id: "letter-safari", title: "Letter Hunt Safari", subtitle: "Find animals by starting letter (Age 3–4)", icon: "🦁", gradient: "from-amber-500 to-orange-500", path: "/games/alphabets/letter-safari" },
  { id: "dance-party", title: "Alphabet Dance Party", subtitle: "Learn letters through actions (Age 3–4)", icon: "💃", gradient: "from-pink-500 to-purple-500", path: "/games/alphabets/dance-party" },
  { id: "size-sorting", title: "Letter Size Sorting", subtitle: "Sort big and small letters (Age 3–4)", icon: "📐", gradient: "from-yellow-500 to-orange-500", path: "/games/alphabets/size-sorting" },
  { id: "print-match", title: "Environmental Print Match", subtitle: "Match brands with letters (Age 3–4)", icon: "🏪", gradient: "from-cyan-500 to-blue-500", path: "/games/alphabets/print-match" },
  { id: "cvc-builder", title: "CVC Word Builder", subtitle: "Build 3-letter words (Age 4–5)", icon: "🏗️", gradient: "from-green-500 to-emerald-500", path: "/games/alphabets/cvc-builder" },
  { id: "word-families", title: "Word Family Houses", subtitle: "Sort rhyming word families (Age 4–5)", icon: "🏠", gradient: "from-orange-500 to-red-500", path: "/games/alphabets/word-families" },
  { id: "alphabet-chef", title: "Alphabet Chef", subtitle: "Spell food words (Age 4–5)", icon: "👨‍🍳", gradient: "from-rose-500 to-pink-500", path: "/games/alphabets/alphabet-chef" },
  { id: "sight-words", title: "Sight Word Stars", subtitle: "Catch falling sight words (Age 4–5)", icon: "⭐", gradient: "from-indigo-500 to-purple-500", path: "/games/alphabets/sight-words" },
  { id: "pre-writing", title: "Pre-Writing Strokes", subtitle: "Practice writing strokes (Age 4–5)", icon: "✏️", gradient: "from-blue-500 to-purple-500", path: "/games/alphabets/pre-writing" },
  { id: "blending", title: "Blending Bridge", subtitle: "Blend sounds to make words (Age 5–6)", icon: "🌉", gradient: "from-sky-500 to-blue-500", path: "/games/alphabets/blending" },
  { id: "sentence-builder", title: "Sentence Builder", subtitle: "Build complete sentences (Age 5–6)", icon: "📝", gradient: "from-teal-500 to-cyan-500", path: "/games/alphabets/sentence-builder" },
  { id: "compound-words", title: "Compound Word Factory", subtitle: "Combine words to make new ones (Age 5–6)", icon: "🏭", gradient: "from-purple-500 to-pink-500", path: "/games/alphabets/compound-words" }
];

// --- Page ---
const AlphabetGamesLandingPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} p-4 sm:p-8 overflow-y-auto animate-module-entry`}>
      <button
        onClick={onBack}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hub
      </button>
      <div className="text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${theme.text}`}>
            {icon} {title} Activities
          </h2>
          <p className={`text-lg ${theme.textSecondary} mb-8`}>Choose an activity to start learning!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alphabetGameData.map((game) => (
              <Link
                key={game.id}
                to={game.path}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl 
                            bg-gradient-to-br ${game.gradient} text-white group overflow-hidden block`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
                <h3 className="text-xl font-bold mb-1">{game.title}</h3>
                <p className="text-sm text-white/90">{game.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetGamesLandingPage;