import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, ArrowLeft, Lock, Star, Zap } from 'lucide-react';
import AlphabetGamesPage from '../Alphabets/AlphabetGamesPage'
import NumbersMainPage from '../Numbers/NumbersMainPage'
import ShapesLandingPage from '../basics/Shapes/ShapesLandingPage'
import VisualLogicLandingPage from '../basics/VisualLogic/VisualLogicLandingPage'
import { useNavigate } from 'react-router';
import { useGameModule } from '@/hooks/useGameModule';
import AlphabetGamesLandingPage from '../basics/Alphabets/AlphabetGamesLandingPage'
import NumbersGamesLandingPage from '../basics/Numbers/NumbersGamesLandingPage'
import MemoryBuildingMainPage from '../games/MemoryGame/MemoryBuildingMainPage'
import ArrangementMain from '../games/puzzles/Arrangement/ArrangementMain'

// NOTE: External imports like 'import AlphabetsMain from "../basics/Alphabets/AlphabetsMain"' are removed 
// because all components for a single React file must be defined locally to run in this environment.

// --- Types and Theme Configurations ---

interface Theme {
  background: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  border: string;
  shadow: string;
}

// Define standard props for all module components
interface ModuleProps {
  onBack: () => void;
  theme: Theme;
  // Specific props are optional, used primarily by ComingSoonModule
  title?: string;
  icon?: string;
}

// Updated Card interface now includes the component reference and API lock field
interface Card {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  locked?: boolean;
  apiLockedStatus?: boolean; // NEW: Status fetched/to be fetched from an API
  category: string;
  gradient: string;
  // Component to render when the card is clicked
  moduleComponent: React.FC<ModuleProps>;
}

const themes: { light: Theme; dark: Theme } = {
  light: {
    background: 'from-gray-50 to-gray-100',
    surface: 'bg-white border-gray-200',
    surfaceHover: 'hover:bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-gray-200',
    shadow: 'shadow-lg shadow-gray-200/50'
  },
  dark: {
    background: 'from-gray-900 to-black',
    surface: 'bg-gray-800 border-gray-700',
    surfaceHover: 'hover:bg-gray-700',
    text: 'text-white',
    textSecondary: 'text-gray-300',
    border: 'border-gray-700',
    shadow: 'shadow-lg shadow-black/50'
  }
};

// ----------------------------------------------------------------------
// --- LEVEL 2 SUB-GAME COMPONENTS (Called by AlphabetGamesPage) ---
// ----------------------------------------------------------------------

const LetterMatchGame: React.FC<ModuleProps> = ({ onBack, theme }) => (
  <div className={`flex flex-col items-center justify-center h-full text-center ${theme.text}`}>
    <div className="text-8xl mb-6">🔠</div>
    <h3 className="text-3xl font-bold mb-4">Letter Match Game Active!</h3>
    <p className={`text-lg ${theme.textSecondary} mb-8`}>Time to pair capital letters with lowercase ones.</p>
    <button
      onClick={onBack}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
    >
      Finish Game
    </button>
  </div>
);

const SpellingBeeGame: React.FC<ModuleProps> = ({ onBack, theme }) => (
  <div className={`flex flex-col items-center justify-center h-full text-center ${theme.text}`}>
    <div className="text-8xl mb-6">🐝</div>
    <h3 className="text-3xl font-bold mb-4">Spelling Bee Challenge!</h3>
    <p className={`text-lg ${theme.textSecondary} mb-8`}>Listen to the word and type the correct spelling.</p>
    <button
      onClick={onBack}
      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
    >
      Finish Challenge
    </button>
  </div>
);

const AlphabetGameComingSoon: React.FC<ModuleProps> = ({ onBack, theme, title }) => (
  <div className={`flex flex-col items-center justify-center h-full text-center ${theme.text}`}>
    <div className="text-8xl mb-6">⏳</div>
    <h3 className="text-3xl font-bold mb-4">{title}</h3>
    <p className={`text-lg ${theme.textSecondary} mb-8`}>This specific game is launching soon!</p>
    <button
      onClick={onBack}
      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md"
    >
      Back to Alphabet Menu
    </button>
  </div>
);

// -------------------------------------------------------------------
// --- LEVEL 1 MODULE PAGES (Called by LearningPlatform) ---
// -------------------------------------------------------------------

// Data for nested alphabet games/activities
// interface AlphabetGameCard {
//   id: string;
//   title: string;
//   subtitle: string;
//   icon: string;
//   gradient: string;
//   module: React.FC<ModuleProps>;
// }

// const alphabetGameData: AlphabetGameCard[] = [
//   { id: 'match', title: 'Letter Match', subtitle: 'Pairing capital and lowercase letters.', icon: '🔠', gradient: 'from-orange-500 to-amber-500', module: LetterMatchGame },
//   { id: 'spell', title: 'Spelling Bee', subtitle: 'Listen and type words.', icon: '🐝', gradient: 'from-lime-500 to-green-500', module: SpellingBeeGame },
//   { id: 'trace', title: 'Tracing Letters', subtitle: 'Practice handwriting.', icon: '✍️', gradient: 'from-cyan-500 to-blue-500', module: AlphabetGameComingSoon },
//   { id: 'quiz', title: 'Alphabet Quiz', subtitle: 'Test your knowledge.', icon: '❓', gradient: 'from-purple-500 to-fuchsia-500', module: AlphabetGameComingSoon },
// ];


// const AlphabetGamesPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
//   const [activeGameId, setActiveGameId] = useState<string | null>(null);

//   const handleGameSelect = (gameId: string) => {
//     setActiveGameId(gameId);
//   };

//   const handleGameBack = () => {
//     setActiveGameId(null);
//   };

//   const renderContent = () => {
//     if (activeGameId) {
//       const game = alphabetGameData.find(g => g.id === activeGameId);
//       if (!game) return <p className={theme.text}>Game not found.</p>;
      
//       const GameComponent = game.module;
//       // Pass the local back handler to return to the Alphabets menu
//       return <GameComponent onBack={handleGameBack} theme={theme} title={game.title} />;
//     }

//     // Display the main menu of alphabet games
//     return (
//       <div className="max-w-6xl mx-auto">
//         <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${theme.text}`}>
//           {icon} {title} Activities
//         </h2>
//         <p className={`text-lg ${theme.textSecondary} mb-8`}>Choose an activity to start learning!</p>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {alphabetGameData.map((game) => (
//             <div
//               key={game.id}
//               onClick={() => handleGameSelect(game.id)}
//               className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl 
//                           bg-gradient-to-br ${game.gradient} text-white group overflow-hidden`}
//             >
//               <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
//               <h3 className="text-xl font-bold mb-1">{game.title}</h3>
//               <p className="text-sm text-white/90">{game.subtitle}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   // Back button functionality: If a game is active, go back to the game menu. Otherwise, go back to the main Hub.
//   const currentBackHandler = activeGameId ? handleGameBack : onBack;

//   return (
//     <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 overflow-y-auto animate-module-entry`}>
//       <button
//         onClick={currentBackHandler}
//         className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
//       >
//         <ArrowLeft className="w-4 h-4" />
//         {activeGameId ? 'Back to Menu' : 'Back to Hub'}
//       </button>
//       <div className="text-center">
//         {renderContent()}
//       </div>
//     </div>
//   );
// };

// Simple Numbers Module (Renamed for clarity)
// const NumbersPage: React.FC<ModuleProps> = ({ onBack, theme }) => {
//   const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
//   const playNumber = (number: number) => {
//     if ('speechSynthesis' in window) {
//       const utterance = new SpeechSynthesisUtterance(number.toString());
//       utterance.rate = 0.8;
//       speechSynthesis.speak(utterance);
//     }
//   };
//   return (
//     <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 overflow-y-auto animate-module-entry`}>
//       <button
//         onClick={onBack}
//         className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
//       >
//         <ArrowLeft className="w-4 h-4" />
//         Back to Hub
//       </button>
//       <div className="max-w-3xl mx-auto text-center">
//         <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${theme.text}`}>🔢 Number Learning</h2>
//         <p className={`text-base sm:text-lg mb-8 ${theme.textSecondary}`}>Practice counting from 1 to 20!</p>
//         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
//           {numbers.map((number) => (
//             <button
//               key={number}
//               onClick={() => playNumber(number)}
//               className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-4 sm:p-6 rounded-2xl font-bold text-xl sm:text-2xl hover:scale-110 hover:rotate-6 hover:shadow-lg hover:shadow-teal-500/30 transition-all duration-300 active:scale-95"
//             >
//               {number}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

const ComingSoonModule: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => (
  <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 flex items-center justify-center animate-module-entry`}>
    <div className="text-center">
      <button
        onClick={onBack}
        className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Hub
      </button>
      <div className="text-6xl sm:text-8xl mb-6">{icon}</div>
      <h2 className={`text-2xl sm:text-4xl font-bold mb-4 ${theme.text}`}>{title}</h2>
      <p className={`text-lg sm:text-xl ${theme.textSecondary}`}>This module is coming soon!</p>
    </div>
  </div>
);

// --- Card Data (Now referencing Module Components) ---

const cardData: Card[] = [
  // Basics
  {
    id: 'alphabets',
    title: 'Alphabets',
    subtitle: 'Learn letters A-Z with interactive exercises',
    icon: '🔤',
    badge: 'Popular',
    category: 'getting-started',
    gradient: 'from-red-500 to-pink-500',
    moduleComponent: AlphabetGamesLandingPage, // <-- Updated name for the dedicated page
  },
  {
    id: 'numbers',
    title: 'Numbers',
    subtitle: 'Master counting and basic math',
    icon: '🔢',
    badge: 'New',
    category: 'getting-started',
    gradient: 'from-teal-500 to-cyan-500',
    moduleComponent: NumbersGamesLandingPage, // <-- Updated name for the dedicated page
  },
  {
    id: 'shapes',
    title: 'Shapes',
    subtitle: 'Identify and learn geometric shapes',
    icon: '🔺',
    category: 'getting-started',
    gradient: 'from-blue-500 to-indigo-500',
    moduleComponent: ShapesLandingPage, 
  },
  {
    id: 'visuallogic',
    title: 'Visual Logic',
    subtitle: 'Learn comparison concepts and visual reasoning',
    icon: '🧠',
    badge: 'New',
    category: 'getting-started',
    gradient: 'from-purple-500 to-indigo-500',
    moduleComponent: VisualLogicLandingPage, 
  },
  {
    id: 'colors',
    title: 'Colors',
    subtitle: 'Explore the rainbow of colors',
    icon: '🎨',
    locked: true,              // Locked locally
    apiLockedStatus: true,     // And locked by API (should be locked)
    category: 'getting-started',
    gradient: 'from-purple-500 to-pink-500',
    moduleComponent: ComingSoonModule, 
  },
  // Games
  {
    id: 'memory',
    title: 'Memory Game',
    subtitle: 'Test your memory with matching cards',
    icon: '🧠',
    badge: 'Fun',
    category: 'games-puzzles',
    gradient: 'from-cyan-500 to-blue-500',
    moduleComponent: MemoryBuildingMainPage, 
  },
  {
    id: 'puzzle',
    title: 'Puzzles',
    subtitle: 'Solve fun puzzles and brain teasers',
    icon: '🧩',
    category: 'games-puzzles',
    gradient: 'from-emerald-500 to-teal-500',
    moduleComponent: ArrangementMain, 
  },
  // Challenges
  {
    id: 'math',
    title: 'Math Challenge',
    subtitle: 'Quick math problems and calculations',
    icon: '➕',
    badge: 'Hard',
    category: 'challenges-upcoming',
    gradient: 'from-orange-500 to-red-500',
    moduleComponent: ComingSoonModule, 
  },
  {
    id: 'reading',
    title: 'Reading Time',
    subtitle: 'Practice reading with fun stories',
    icon: '📖',
    locked: true,
    category: 'challenges-upcoming',
    gradient: 'from-violet-500 to-purple-500',
    moduleComponent: ComingSoonModule, 
  }
];

// --- Auxiliary Components (Remains the same) ---

const ThemeToggle: React.FC<{ isDark: boolean; onToggle: () => void }> = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-110"
  >
    {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
  </button>
);

const NavTabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  theme: Theme;
}> = ({ activeTab, onTabChange, theme }) => {
  const tabs = [
    { id: 'getting-started', label: 'Getting Started' },
    { id: 'games-puzzles', label: 'Games & Puzzles' },
    { id: 'challenges-upcoming', label: 'Challenges (Upcoming)' }
  ];
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 rounded-full font-semibold text-sm sm:text-base tracking-wider transition-all duration-300 ${
            activeTab === tab.id
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30 transform hover:scale-105'
              : `${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} hover:scale-105 hover:shadow-md`
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const Card: React.FC<{
  card: Card;
  onClick: (cardId: string) => void; 
  theme: Theme;
}> = ({ card, onClick, theme }) => {
  // Determine if the card is effectively locked
  const isLocked = (card.locked || card.apiLockedStatus) ?? false;
  
  return (
    <div
      onClick={() => onClick(card.id)} 
      className={`relative p-6 sm:p-8 rounded-2xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 ${
        isLocked ? 'opacity-75' : ''
      } bg-gradient-to-br ${card.gradient} text-white min-h-[200px] sm:min-h-[220px] group overflow-hidden`}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Badge */}
      {card.badge && (
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30">
          {card.badge}
        </div>
      )}
      {/* Icon */}
      <div className="text-4xl sm:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {card.icon}
      </div>
      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-lg sm:text-xl font-bold mb-2">{card.title}</h3>
        <p className="text-sm sm:text-base text-white/90 mb-4">{card.subtitle}</p>
      </div>
      {/* Status */}
      <div className="absolute bottom-4 right-4 text-xl sm:text-2xl">
        {isLocked ? <Lock className="w-5 h-5 sm:w-6 sm:h-6" /> : card.badge === 'Popular' ? <Star className="w-5 h-5 sm:w-6 sm:h-6" /> : <Zap className="w-5 h-5 sm:w-6 sm:h-6" />}
      </div>
    </div>
  );
};


// --- Main Component ---

const LearningPlatform: React.FC = () => {
  const { isDarkMode } = useGameModule();
  const [activeTab, setActiveTab] = useState('getting-started');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const navigate = useNavigate();

  const theme = themes[isDarkMode ? 'dark' : 'light'];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModule) {
        setActiveModule(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeModule]);

  // Handle touch gestures for mobile (Swipe right to go back)
  useEffect(() => {
    let startX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!activeModule) return;

      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      // Swipe right (negative difference) with sufficient distance to go back
      if (diff < -100) {
        setActiveModule(null);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeModule]);

  const filteredCards = cardData.filter(card => card.category === activeTab);

  const handleCardClick = (cardId: string) => {
    const card = cardData.find(c => c.id === cardId);

    // Card is locked if EITHER the local lock OR the API lock status is true
    const isLocked = (card?.locked || card?.apiLockedStatus) ?? false;

    if (isLocked) {
      console.log('This module is locked! Check card.locked OR card.apiLockedStatus.');
      return;
    }
    
    // Navigate to specific pages instead of showing modal
    if (cardId === 'alphabets') {
      navigate('/games/alphabets');
      return;
    }
    
    if (cardId === 'numbers') {
      navigate('/games/numbers');
      return;
    }
    
    if (cardId === 'shapes') {
      navigate('/games/shapes');
      return;
    }
    
    if (cardId === 'visuallogic') {
      navigate('/games/visuallogic');
      return;
    }
    
    if (cardId === 'memory') {
      navigate('/games/memory');
      return;
    }
    
    if (cardId === 'puzzle') {
      navigate('/games/puzzles');
      return;
    }
    
    setActiveModule(cardId);
  };

  const renderModule = () => {
    const card = cardData.find(c => c.id === activeModule);
    if (!card) return null;

    // Get the component type directly from the card object
    const ModuleComponent = card.moduleComponent;

    // Render the component, passing standardized props
    return (
      <ModuleComponent
        onBack={() => setActiveModule(null)}
        theme={theme}
        title={card.title} // Passed for the ComingSoonModule and Routers
        icon={card.icon}   // Passed for the ComingSoonModule and Routers
      />
    );
  };

  return (
    // <div className={`min-h-screen bg-gradient-to-br ${theme.background} transition-all duration-500`}>
    <div className="w-full flex flex-col items-center bg-[#e6dccb] font-sans select-none relative shadow-inner min-h-screen">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /> 
    
      {/* CSS Keyframe for Module Entry Animation */}
      <style>{`
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-module-entry { 
            animation: slideUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
        }
      `}</style>

      {/* Theme now controlled by global header settings */}

      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className={`text-3xl sm:text-5xl font-bold mb-4 ${theme.text}`}>
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Learning Hub
            </span>
          </h1>
          <p className={`text-base sm:text-lg ${theme.textSecondary}`}>
            Interactive learning made fun and engaging
          </p>
        </div>
        {/* Navigation (Uses flex-wrap for mobile compatibility) */}
        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} theme={theme} />
        {/* Cards Grid (Starts at 1 column on mobile, scaling up) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              // Pass all card properties down
              card={card}
              onClick={handleCardClick} 
              theme={theme}
            />
          ))}
        </div>
      </div>
      {/* Module Overlay */}
      {activeModule && renderModule()}
    </div>
  );
};
export default LearningPlatform;