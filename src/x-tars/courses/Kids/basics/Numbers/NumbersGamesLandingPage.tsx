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
interface NumberGameCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  path: string;
}

const numberGameData: NumberGameCard[] = [
  // Core numbers games
  { id: "Introduction", title: "Starting with the numbers ✅", subtitle: "Introduction to the numbers", icon: "1️⃣2️⃣3️⃣", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/introduction" },
  { id: "Association", title: "Associate objects to a number ✅", subtitle: "How many objects are there?", icon: "🤗", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/association" },
  { id: "identification", title: "Match the Correct Numbers ✅", subtitle: "Identify and match numbers with the correct apple groups", icon: "🍎", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/identification" },
  { id: "counting", title: "Count On Your Body", subtitle: "Learn numbers with body-part examples", icon: "🤗", gradient: "from-rose-500 to-amber-500", path: "/games/numbers/counting" },
  { id: "tracing", title: "Trace the Numbers ✅", subtitle: "Practice drawing numbers with dotted guides", icon: "✍️", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/tracing" },
  { id: "sequence", title: "Number Train Sequence ✅", subtitle: "Arrange train coaches in the correct order", icon: "🚂", gradient: "from-orange-500 to-amber-500", path: "/games/numbers/sequence" },
  { id: "filltheblank", title: "Fill in the Blanks", subtitle: "Drag and drop the missing numbers", icon: "1️⃣_3️⃣", gradient: "from-lime-500 to-green-500", path: "/games/numbers/fill-the-blanks" },
  { id: "descending", title: "Descending Order Train", subtitle: "Place the train coaches in descending order", icon: "3️⃣2️⃣1️⃣", gradient: "from-cyan-500 to-blue-500", path: "/games/numbers/descending" },

  // Age 3–4: early number sense
  { id: "dot-dash", title: "Dot Dash Rockets", subtitle: "Subitize 1–5 dots (Age 3–4)", icon: "🚀", gradient: "from-sky-500 to-indigo-500", path: "/games/numbers/dot-dash-rockets" },
  { id: "ladybug", title: "Ladybug Spots Match", subtitle: "Match spots to numbers (Age 3–4)", icon: "🐞", gradient: "from-emerald-500 to-lime-500", path: "/games/numbers/ladybug-spots" },
  { id: "cleanup", title: "Clean-Up Count", subtitle: "Sort toys and count them (Age 3–4)", icon: "🧸", gradient: "from-teal-500 to-cyan-500", path: "/games/numbers/cleanup-count" },
  { id: "more", title: "Learn what is More ✅", subtitle: "Which one is more? (Age 3–4)", icon: "🧺", gradient: "from-amber-500 to-rose-500", path: "/games/numbers/more" },
  { id: "less", title: "Learn what is Less ✅", subtitle: "Find the less? (Age 3–4)", icon: "🧺", gradient: "from-amber-500 to-rose-500", path: "/games/numbers/less" },
  { id: "zero-hero", title: "Zero the Hero", subtitle: "Learn about zero (Age 3–4)", icon: "🦸", gradient: "from-purple-500 to-pink-500", path: "/games/numbers/zero-hero" },
  { id: "pizza-party", title: "Pizza Party Sharing", subtitle: "Share pizza fairly (Age 3–4)", icon: "🍕", gradient: "from-orange-500 to-red-500", path: "/games/numbers/pizza-party" },
  { id: "coin-collector", title: "Coin Collector", subtitle: "Sort and recognize coins (Age 3–4)", icon: "🪙", gradient: "from-yellow-500 to-amber-500", path: "/games/numbers/coin-collector" },
  { id: "understanding-equal", title: "Understanding Equal ✅", subtitle: "Learn about equal numbers (Age 3–4)", icon: "=", gradient: "from-blue-500 to-indigo-500", path: "/games/numbers/understanding-equal" },

  // Age 4–5: ordering, patterns, sharing
  { id: "bridge", title: "Number Bridge Builder", subtitle: "Fill missing stones on the number line (Age 4–5)", icon: "🌉", gradient: "from-blue-500 to-cyan-500", path: "/games/numbers/number-bridge" },
  { id: "pattern-train", title: "Pattern Train Cars", subtitle: "Complete colorful train patterns (Age 4–5)", icon: "🚃", gradient: "from-fuchsia-500 to-purple-500", path: "/games/numbers/pattern-train-cars" },
  { id: "snack-sharing", title: "Snack Sharing Party", subtitle: "Share snacks fairly between friends (Age 4–5)", icon: "🧁", gradient: "from-rose-500 to-orange-500", path: "/games/numbers/snack-sharing-party" },
  { id: "ordinal-race", title: "Ordinal Race Track", subtitle: "Learn 1st, 2nd, 3rd positions (Age 4–5)", icon: "🏁", gradient: "from-blue-500 to-purple-500", path: "/games/numbers/ordinal-race" },
  { id: "shape-puzzles", title: "Shape Number Puzzles", subtitle: "Count sides and corners (Age 4–5)", icon: "🔷", gradient: "from-purple-500 to-pink-500", path: "/games/numbers/shape-puzzles" },
  { id: "clock-time", title: "Clock Tower Time", subtitle: "Learn to tell time by hour (Age 4–5)", icon: "🕐", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/clock-time" },
  { id: "number-detective", title: "Number Detective", subtitle: "Find numbers in real-world scenes (Age 4–5)", icon: "🔍", gradient: "from-indigo-500 to-purple-500", path: "/games/numbers/number-detective" },

  // Age 5–6: addition, number bonds, measurement
  { id: "ten-frame", title: "Ten-Frame Garden", subtitle: "Plant seeds in a ten-frame (Age 5–6)", icon: "🌼", gradient: "from-emerald-500 to-lime-500", path: "/games/numbers/ten-frame-garden" },
  { id: "add-animals", title: "Add the Animals", subtitle: "Count how many animals altogether (Age 5–6)", icon: "🐑", gradient: "from-sky-500 to-emerald-500", path: "/games/numbers/add-the-animals" },
  { id: "bonds", title: "Number Bonds Bubbles", subtitle: "Find pairs that make a target number (Age 5–6)", icon: "💭", gradient: "from-cyan-500 to-indigo-500", path: "/games/numbers/number-bonds-bubbles" },
  { id: "jumping-frogs", title: "Jumping Frogs", subtitle: "Skip-count by 2s and 5s (Age 5–6)", icon: "🐸", gradient: "from-green-500 to-teal-500", path: "/games/numbers/jumping-frogs" },
  { id: "fill-bucket", title: "Fill the Bucket", subtitle: "Experiment with scoops and capacity (Age 5–6)", icon: "🪣", gradient: "from-sky-500 to-blue-500", path: "/games/numbers/fill-the-bucket" },
  { id: "subtract-snacks", title: "Subtract the Snacks", subtitle: "Learn subtraction by eating snacks (Age 5–6)", icon: "🍪", gradient: "from-orange-500 to-red-500", path: "/games/numbers/subtract-snacks" },
  { id: "measure-monsters", title: "Measure the Monsters", subtitle: "Compare heights using blocks (Age 5–6)", icon: "📏", gradient: "from-green-500 to-teal-500", path: "/games/numbers/measure-monsters" },
  { id: "number-jumper", title: "Number Line Jumper", subtitle: "Jump forward and backward (Age 5–6)", icon: "🦘", gradient: "from-lime-500 to-green-500", path: "/games/numbers/number-jumper" }
];

// --- Page ---
const NumbersGamesLandingPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
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
            {numberGameData.map((game) => (
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

export default NumbersGamesLandingPage;