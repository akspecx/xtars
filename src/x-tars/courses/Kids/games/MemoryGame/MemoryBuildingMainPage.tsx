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
interface MemoryGameCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  path: string;
}

const memoryGameData: MemoryGameCard[] = [
  { id: "animals", title: "Match the animals", subtitle: "open and match the correct animals", icon: "🐘🦒🐒", gradient: "from-orange-500 to-amber-500", path: "/games/memory/animals" },
  { id: "fruits", title: "Match the fruits", subtitle: "Match the correct pair of fruits", icon: "🍉🍌🍎", gradient: "from-lime-500 to-green-500", path: "/games/memory/fruits" },
  { id: "numbers", title: "Match the numbers correctly", subtitle: "Match the correct numbers", icon: "1️⃣2️⃣3️⃣", gradient: "from-cyan-500 to-blue-500", path: "/games/memory/numbers" }
];

// --- Page ---
const MemoryBuildingMainPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 overflow-y-auto animate-module-entry`}>
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
            {memoryGameData.map((game) => (
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

export default MemoryBuildingMainPage;