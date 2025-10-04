import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import TrainMovingArrangingNumbers from "./TrainMovingArrangingNumbers"

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

// --- Sub-Games ---
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

// --- Data ---
interface AlphabetGameCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  module: React.FC<ModuleProps>;
}

const alphabetGameData: AlphabetGameCard[] = [
  { id: "match", title: "Find the sequence", subtitle: "Correctly sequence the numbers", icon: "🔠", gradient: "from-orange-500 to-amber-500", module: TrainMovingArrangingNumbers }
//   { id: "spell", title: "Arranging Alphabet", subtitle: "Arrange the alphabets", icon: "✍️", gradient: "from-lime-500 to-green-500", module: AlphabetSequenceMapping },
//   { id: "trace", title: "Fruit naming", subtitle: "Practice fruit namming.", icon: "✍️", gradient: "from-cyan-500 to-blue-500", module: AlphabetFruitFlipGame }
//   // { id: "quiz", title: "Alphabet Quiz", subtitle: "Test your knowledge.", icon: "❓", gradient: "from-purple-500 to-fuchsia-500", module: AlphabetGameComingSoon }
];

// --- Page ---
const AlphabetGamesPage: React.FC<ModuleProps> = ({ onBack, theme, title, icon }) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const handleGameSelect = (gameId: string) => setActiveGameId(gameId);
  const handleGameBack = () => setActiveGameId(null);

  const renderContent = () => {
    if (activeGameId) {
      const game = alphabetGameData.find((g) => g.id === activeGameId);
      if (!game) return <p className={theme.text}>Game not found.</p>;
      const GameComponent = game.module;
      return <GameComponent onBack={handleGameBack} theme={theme} title={game.title} />;
    }

    return (
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-3xl sm:text-5xl font-bold mb-4 ${theme.text}`}>
          {icon} {title} Activities
        </h2>
        <p className={`text-lg ${theme.textSecondary} mb-8`}>Choose an activity to start learning!</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {alphabetGameData.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] shadow-xl 
                          bg-gradient-to-br ${game.gradient} text-white group overflow-hidden`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
              <h3 className="text-xl font-bold mb-1">{game.title}</h3>
              <p className="text-sm text-white/90">{game.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentBackHandler = activeGameId ? handleGameBack : onBack;

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${theme.background} p-4 sm:p-8 overflow-y-auto animate-module-entry`}>
      <button
        onClick={currentBackHandler}
        className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-full ${theme.surface} ${theme.text} ${theme.surfaceHover} border ${theme.border} transition-all duration-300 hover:scale-105`}
      >
        <ArrowLeft className="w-4 h-4" />
        {activeGameId ? "Back to Menu" : "Back to Hub"}
      </button>
      <div className="text-center">{renderContent()}</div>
    </div>
  );
};

export default AlphabetGamesPage;