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
interface ShapeCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  path: string;
}

const numberGameData: ShapeCard[] = [
  { id: "Understanding of Same", title: "Which pictures are same", subtitle: "See and find the same picture", icon: "⚖️", gradient: "from-indigo-500 to-purple-500", path: "/games/visuallogic/same" },
  { id: "Understanding of Above", title: "Which item is above?", subtitle: "Find the item that is above", icon: "⬆️", gradient: "from-rose-500 to-pink-500", path: "/games/visuallogic/above" },
  { id: "Understanding of Below", title: "Which item is below?", subtitle: "Find the item that is below", icon: "⬇️", gradient: "from-pink-500 to-rose-500", path: "/games/visuallogic/below" },
  { id: "Understanding of Above and Below", title: "Which item is above?", subtitle: "Identify positions above and below", icon: "⬆️", gradient: "from-rose-500 to-amber-500", path: "/games/visuallogic/above-below" },
  { id: "Understanding of Above and Below Mix", title: "Above & Below Mix", subtitle: "Mixed questions on above and below", icon: "↕️", gradient: "from-amber-500 to-orange-500", path: "/games/visuallogic/above-below-mix" },
  { id: "Understanding of Tall and Short", title: "Which item is taller?", subtitle: "Compare heights of shapes", icon: "📏", gradient: "from-sky-500 to-blue-500", path: "/games/visuallogic/tall-short" },
  { id: "Understanding of Wide and Narrow", title: "Which item is wider?", subtitle: "Compare widths of shapes", icon: "↔️", gradient: "from-orange-500 to-amber-500", path: "/games/visuallogic/wide-narrow" },
  { id: "Understanding of Heavy and Light", title: "Which item is heavier?", subtitle: "Compare weights visually", icon: "⚖️", gradient: "from-green-500 to-teal-500", path: "/games/visuallogic/heavy-light" },
  { id: "Understanding of Full and Empty", title: "Which container is full?", subtitle: "Identify full and empty states", icon: "🥛", gradient: "from-blue-500 to-indigo-500", path: "/games/visuallogic/full-empty" },
  { id: "Understanding of Inside and Outside", title: "Which item is inside?", subtitle: "Find items inside or outside containers", icon: "📦", gradient: "from-purple-500 to-pink-500", path: "/games/visuallogic/inside-outside" },
  { id: "Understanding of Different", title: "Which item is different?", subtitle: "Spot the different item in the group", icon: "🔍", gradient: "from-cyan-500 to-blue-500", path: "/games/visuallogic/different" },
  { id: "Understanding of Big", title: "Which item is bigger?", subtitle: "Compare sizes and find the bigger one", icon: "📈", gradient: "from-red-500 to-orange-500", path: "/games/visuallogic/big" },
  { id: "Understanding of Small", title: "Which item is smaller?", subtitle: "Compare sizes and find the smaller one", icon: "📉", gradient: "from-yellow-500 to-green-500", path: "/games/visuallogic/small" },
  { id: "Understanding of Big and Small Mix", title: "Big & Small Mix", subtitle: "Mixed questions on big and small", icon: "📊", gradient: "from-teal-500 to-cyan-500", path: "/games/visuallogic/big-small-mix" },
  { id: "Understanding of Heavy", title: "Which item is heavier?", subtitle: "Find the item that is heavy", icon: "⚖️", gradient: "from-gray-500 to-slate-500", path: "/games/visuallogic/heavy" },
  { id: "Understanding of Light", title: "Which item is lighter?", subtitle: "Find the item that is light", icon: "🪶", gradient: "from-slate-500 to-gray-500", path: "/games/visuallogic/light" },
  { id: "Understanding of Heavy and Light Mix", title: "Heavy & Light Mix", subtitle: "Mixed questions on heavy and light", icon: "⚖️", gradient: "from-slate-500 to-zinc-500", path: "/games/visuallogic/heavy-light-mix" },
  { id: "Understanding of Wide", title: "Which item is wider?", subtitle: "Find the item that is wide", icon: "↔️", gradient: "from-orange-500 to-red-500", path: "/games/visuallogic/wide" },
  { id: "Understanding of Narrow", title: "Which item is narrower?", subtitle: "Find the item that is narrow", icon: "↕️", gradient: "from-red-500 to-orange-500", path: "/games/visuallogic/narrow" },
  { id: "Understanding of Wide and Narrow Mix", title: "Wide & Narrow Mix", subtitle: "Mixed questions on wide and narrow", icon: "↔️", gradient: "from-amber-500 to-yellow-500", path: "/games/visuallogic/wide-narrow-mix" },
  { id: "Understanding of Inside", title: "Which item is inside?", subtitle: "Find the item that is inside", icon: "📦", gradient: "from-purple-500 to-violet-500", path: "/games/visuallogic/inside" },
  { id: "Understanding of Outside", title: "Which item is outside?", subtitle: "Find the item that is outside", icon: "🌍", gradient: "from-violet-500 to-purple-500", path: "/games/visuallogic/outside" },
  { id: "Understanding of Inside and Outside Mix", title: "Inside & Outside Mix", subtitle: "Mixed questions on inside and outside", icon: "📦", gradient: "from-indigo-500 to-purple-500", path: "/games/visuallogic/inside-outside-mix" }
];

// --- Page ---
const VisualLogicLandingPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
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

export default VisualLogicLandingPage;