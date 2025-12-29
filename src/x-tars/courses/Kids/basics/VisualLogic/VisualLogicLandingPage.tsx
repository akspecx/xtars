import React, { useState } from "react";
import { ArrowLeft, Star, Ruler, Box, Scale, Zap, Play, MousePointer2 } from "lucide-react";
import { Link, BrowserRouter } from "react-router-dom"; 

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
  theme?: Theme; 
}

// --- Data ---
interface ShapeCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  path: string;
  category: "size" | "position" | "quantity" | "logic";
}

const visualLogicData: ShapeCard[] = [
  // Size
  { id: "big", title: "Big", subtitle: "Find the big one", icon: "🐘", path: "/games/visuallogic/big", category: "size" },
  { id: "small", title: "Small", subtitle: "Find the small one", icon: "🐜", path: "/games/visuallogic/small", category: "size" },
  { id: "big-small-mix", title: "Big & Small", subtitle: "Mixed size fun", icon: "⚖️", path: "/games/visuallogic/big-small-mix", category: "size" },
  { id: "tall", title: "Tall", subtitle: "Who is taller?", icon: "🦒", path: "/games/visuallogic/tall", category: "size" },
  { id: "short", title: "Short", subtitle: "Who is shorter?", icon: "🌵", path: "/games/visuallogic/short", category: "size" },
  { id: "tall-short", title: "Tall & Short", subtitle: "Height challenge", icon: "📏", path: "/games/visuallogic/tall-short", category: "size" },

  // Position
  { id: "above", title: "Above", subtitle: "What is up there?", icon: "☁️", path: "/games/visuallogic/above", category: "position" },
  { id: "below", title: "Below", subtitle: "What is down there?", icon: "🍄", path: "/games/visuallogic/below", category: "position" },
  { id: "above-below-mix", title: "Above & Below", subtitle: "Up and down fun", icon: "↕️", path: "/games/visuallogic/above-below-mix", category: "position" },
  { id: "inside", title: "Inside", subtitle: "In the box", icon: "🧸", path: "/games/visuallogic/inside", category: "position" },
  { id: "outside", title: "Outside", subtitle: "Out of the box", icon: "🌳", path: "/games/visuallogic/outside", category: "position" },
  { id: "inside-outside-mix", title: "In & Out", subtitle: "Where is it?", icon: "📦", path: "/games/visuallogic/inside-outside-mix", category: "position" },

  // Quantity
  { id: "full", title: "Full", subtitle: "All filled up", icon: "🧺", path: "/games/visuallogic/full", category: "quantity" },
  { id: "empty", title: "Empty", subtitle: "Nothing inside", icon: "🥣", path: "/games/visuallogic/empty", category: "quantity" },
  { id: "full-empty", title: "Full & Empty", subtitle: "Mixed volume fun", icon: "🥛", path: "/games/visuallogic/full-empty", category: "quantity" },

  // Logic
  { id: "same", title: "Same", subtitle: "Match the pictures", icon: "👯", path: "/games/visuallogic/same", category: "logic" },
  { id: "different", title: "Different", subtitle: "Spot the odd one", icon: "🤔", path: "/games/visuallogic/different", category: "logic" },
];

// Helper to render section headers
const SectionHeader = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="col-span-full flex items-center gap-3 mb-4 mt-8 first:mt-0">
    <div className="bg-[#D9B99B] p-2 rounded-xl text-white shadow-sm">
      <Icon size={24} strokeWidth={3} />
    </div>
    <h3 className="text-2xl font-black text-[#5D4037] uppercase tracking-wider">{title}</h3>
    <div className="h-1 flex-1 bg-[#EADAC4] rounded-full ml-4" />
  </div>
);

const VisualLogicLandingPageContent: React.FC<ModuleProps> = ({ onBack }) => {
  const [globalMode, setGlobalMode] = useState<'practice' | 'kid' | null>(null);
  
  // Group data
  const sizeGames = visualLogicData.filter(g => g.category === 'size');
  const posGames = visualLogicData.filter(g => g.category === 'position');
  const qtyGames = visualLogicData.filter(g => g.category === 'quantity');
  const logicGames = visualLogicData.filter(g => g.category === 'logic');

  const toggleMode = (mode: 'practice' | 'kid') => {
    setGlobalMode(prev => prev === mode ? null : mode);
  };

  const renderGrid = (games: ShapeCard[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <Link
          key={game.id}
          to={game.path}
          state={globalMode ? { initialMode: globalMode } : undefined}
          className="group relative bg-[#EADAC4] p-6 rounded-[2rem] border-[3px] border-[#D7CCC8] shadow-[0_8px_0_#C4A484] hover:shadow-[0_4px_0_#C4A484] hover:bg-[#E0D0BA] hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none transition-all duration-150 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Decorative Corner Screws */}
          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#C4A484]" />
          <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#C4A484]" />

          <div className="w-20 h-20 bg-[#FDFBF7] rounded-[1.5rem] flex items-center justify-center text-5xl mb-4 shadow-inner border border-[#D7CCC8] group-hover:scale-110 transition-transform">
            {game.icon}
          </div>
          
          <h3 className="text-xl font-black text-[#5D4037] mb-1">{game.title}</h3>
          <p className="text-xs font-bold text-[#8D6E63] uppercase tracking-wide">{game.subtitle}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-4 sm:p-8 font-sans text-[#7A5C3E]">
      
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#EADAC4] text-[#5D4037] font-black border-b-4 border-[#D7CCC8] hover:bg-[#D7CCC8] active:translate-y-1 active:border-b-0 transition-all"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          Back To Hub
        </button>
        <div className="ml-auto flex items-center gap-2 bg-[#FFFBF2] px-4 py-2 rounded-xl border border-[#EADAC4] shadow-sm">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            <span className="font-black text-[#5D4037]">Visual Logic Hub</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-6xl font-black text-[#5D4037] tracking-tight mb-2">
              THINK & SEE
            </h1>
            <div className="absolute -right-8 -top-8 text-yellow-400 animate-bounce delay-700 hidden sm:block">
                <Star size={48} fill="currentColor" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-[#A68B7C]">Explore, Compare, and Discover!</p>
        </div>

        {/* Global Mode Selector */}
        <div className="flex flex-col items-center mb-16">
          <p className="text-xs font-black uppercase text-[#8D6E63] mb-3 tracking-widest">Parent Settings: Choose Mode</p>
          <div className="flex gap-4 bg-[#EADAC4] p-2 rounded-3xl border-2 border-[#D7CCC8]">
            <button
              onClick={() => toggleMode('practice')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-200 ${
                globalMode === 'practice' 
                  ? 'bg-[#4CAF50] text-white shadow-md scale-105' 
                  : 'bg-transparent text-[#7A5C3E] hover:bg-[#D7CCC8]/50'
              }`}
            >
              <MousePointer2 size={20} />
              PRACTICE
            </button>
            <button
              onClick={() => toggleMode('kid')}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all duration-200 ${
                globalMode === 'kid' 
                  ? 'bg-[#5D4037] text-white shadow-md scale-105' 
                  : 'bg-transparent text-[#7A5C3E] hover:bg-[#D7CCC8]/50'
              }`}
            >
              <Play size={20} fill="currentColor" />
              KID MODE
            </button>
          </div>
          {globalMode === null && (
            <p className="text-[10px] font-bold text-[#A68B7C] mt-2 uppercase tracking-wide">Default: Interactive Practice</p>
          )}
        </div>

        {/* Shelves */}
        <SectionHeader title="Size & Scale" icon={Ruler} />
        {renderGrid(sizeGames)}

        <SectionHeader title="Position" icon={Box} />
        {renderGrid(posGames)}

        <SectionHeader title="Quantity" icon={Scale} />
        {renderGrid(qtyGames)}

        <SectionHeader title="Logic & Matching" icon={Zap} />
        {renderGrid(logicGames)}

      </div>
    </div>
  );
};

// Wrap in Router for standalone preview, while allowing it to work if nested later.
const VisualLogicLandingPage: React.FC<ModuleProps> = (props) => {
  return (
    <VisualLogicLandingPageContent {...props} />
  );
};

export default VisualLogicLandingPage;