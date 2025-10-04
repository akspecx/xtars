import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun } from 'lucide-react';

// --- Configuration ---
const MAX_TURNS = 10;

// --- Animal and Color Mapping (5 distinct animals) ---

const animalMap = {
  1: { emoji: '🐘', name: 'Elephant' },
  2: { emoji: '🦁', name: 'Lion' },
  3: { emoji: '🦒', name: 'Giraffe' },
  4: { emoji: '🐒', name: 'Monkey' },
  5: { emoji: '🐼', name: 'Panda' },
};

// Define the shape of the color data for a train car
interface TrainCarColors {
  main: string;
  roof: string;
  border: string;
}

// Define the card structure
interface Card {
  number: number; // Still 1-5 internally for matching logic
  id: number; // Unique ID for React keying and tracking
}

// --- SVG Definitions for Card Back Themes ---

const LollipopSVG = (isDark: boolean) => (
  // Increased size to w-14 h-14
  <svg className={`w-14 h-14`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="lollipop-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor: isDark ? "rgb(236, 72, 153)" : "rgb(251, 191, 36)", stopOpacity: 1}} />
        <stop offset="100%" style={{stopColor: isDark ? "rgb(255, 165, 0)" : "rgb(239, 68, 68)", stopOpacity: 1}} />
      </linearGradient>
    </defs>
    {/* Lollipop head (r increased for size) */}
    <circle cx="12" cy="10" r="8" fill="url(#lollipop-grad)" />
    {/* Stick (adjusted position and height) */}
    <rect x="11" y="16" width="2" height="7" rx="1" fill={isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)"} />
  </svg>
);

const StarSVG = (isDark: boolean) => (
  // Increased size to w-14 h-14
  <svg className={`w-14 h-14`} viewBox="0 0 24 24" fill={isDark ? "rgb(252, 211, 77)" : "rgb(255, 182, 0)"} stroke={isDark ? "rgb(255, 237, 74)" : "rgb(203, 166, 11)"} strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2l3.09 6.26l6.91 1l-5 4.86l1.18 6.88l-6.18-3.25l-6.18 3.25l1.18-6.88l-5-4.86l6.91-1z" fillRule="evenodd" clipRule="evenodd" />
  </svg>
);

const CrayonSVG = (isDark: boolean) => (
  // Increased size to w-14 h-14
  <svg className={`w-14 h-14`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body (increased size, adjusted position) */}
    <rect x="5" y="6" width="14" height="14" rx="2" fill={isDark ? "rgb(59, 130, 246)" : "rgb(147, 197, 253)"} />
    {/* Tip (adjusted coordinates to fit larger body) */}
    <path d="M12 2L19 6H5L12 2Z" fill={isDark ? "rgb(251, 191, 36)" : "rgb(249, 115, 22)"} />
    {/* Outline */}
    <rect x="5" y="6" width="14" height="14" rx="2" stroke={isDark ? "rgb(30, 64, 175)" : "rgb(37, 99, 235)"} strokeWidth="2" />
    {/* Label (adjusted position) */}
    <rect x="5" y="13" width="14" height="3" fill={isDark ? "rgb(249, 250, 251)" : "rgb(254, 243, 199)"} />
  </svg>
);

// Map theme names to their components
const cardBackThemes = [
  { name: 'Lollipop', component: LollipopSVG },
  { name: 'Star', component: StarSVG },
  { name: 'Crayon', component: CrayonSVG },
];


// --- Component: Memory Card (Train Car Visual) ---

const trainCarColors: Record<number, TrainCarColors> = {
  1: { main: 'from-pink-400 to-pink-500', border: 'border-pink-600', roof: 'bg-pink-300' },
  2: { main: 'from-purple-400 to-purple-500', border: 'border-purple-600', roof: 'bg-purple-300' },
  3: { main: 'from-yellow-400 to-yellow-500', border: 'border-yellow-600', roof: 'bg-yellow-300' },
  4: { main: 'from-green-400 to-green-500', border: 'border-green-600', roof: 'bg-green-300' },
  5: { main: 'from-orange-400 to-orange-500', border: 'border-orange-600', roof: 'bg-orange-300' }
};

interface MemoryCardProps {
  card: Card;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  isProcessing: boolean; // Added to disable clicks during flip back
  onClick: (index: number, number: number) => void;
  isDark: boolean;
  cardBackTheme: string; // New prop for theme selection
}

const MemoryCard: React.FC<MemoryCardProps> = ({ card, index, isFlipped, isMatched, isProcessing, onClick, isDark, cardBackTheme }) => {
  const colors = trainCarColors[card.number] || { main: 'gray', border: 'gray', roof: 'gray' };
  const animal = animalMap[card.number];

  // Determine what to display on the card based on its state
  const isCardVisible = isFlipped || isMatched;

  // Function to dynamically select the correct SVG component
  const getCardBackIcon = () => {
    const theme = cardBackThemes.find(t => t.name === cardBackTheme);
    // Render the component found, passing the isDark state
    return theme ? theme.component(isDark) : LollipopSVG(isDark);
  };

  // Handles click/tap to flip the card
  const handleClick = () => {
    if (!isCardVisible && !isProcessing) {
      onClick(index, card.number);
    }
  };

  return (
    <div 
      className={`relative perspective w-full h-full max-w-[80px] sm:max-w-[100px] aspect-[4/5] transition-transform duration-500 transform 
          ${isMatched ? 'opacity-80 scale-95 cursor-default' : 'hover:scale-[1.03] cursor-pointer'} 
          ${isProcessing ? 'cursor-wait' : ''}`}
      onClick={handleClick}
    >
      <div 
        className={`absolute inset-0 preserve-3d transition-transform duration-500 ${isCardVisible ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Card Back (Styled with dynamic icon and hover effect) */}
        <div 
          className={`absolute backface-hidden inset-0 rounded-xl shadow-xl border-4 flex items-center justify-center p-2 
            ${isDark ? 'bg-indigo-700 border-indigo-900' : 'bg-yellow-300 border-yellow-400'}
            transition-all duration-300 transform hover:scale-105`} 
          style={{ transform: 'rotateY(0deg)' }}
        >
          {/* Dynamically render the selected theme icon */}
          {getCardBackIcon()}
        </div>

        {/* Card Face (The Train Car) */}
        <div 
          className={`absolute backface-hidden inset-0 rounded-xl shadow-xl flex items-center justify-center`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* Train Car Visual Adaptation */}
          <div className="relative w-full h-full p-1 flex flex-col justify-center items-center">
            {/* Main car body */}
            <div className={`
              ${isMatched ? 'opacity-70' : ''}
              bg-gradient-to-b ${colors.main} border-4 ${colors.border}
              rounded-lg w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-18 flex items-center justify-center shadow-lg
              transform transition-all duration-200
            `}>
              {/* Display the Animal Emoji */}
              <div 
                className="text-4xl sm:text-5xl md:text-6xl font-bold drop-shadow-lg" 
                style={{fontSize: '50px'}} // Increased font size for visual appeal
              >
                {animal.emoji}
              </div>
            </div>

            {/* Wheels */}
            <div className="absolute bottom-[-2px] left-1/4 transform -translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-900"></div>
            <div className="absolute bottom-[-2px] right-1/4 transform translate-x-1/2 w-3 h-3 bg-gray-800 rounded-full border-2 border-gray-900"></div>

            {/* Car roof */}
            <div className={`absolute top-1 left-1 right-1 h-2 ${colors.roof} border-2 ${colors.border} rounded-t-lg `}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  // --- Game State ---
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false); 
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [gameId, setGameId] = useState<number>(0);
  const [cardBackTheme, setCardBackTheme] = useState(cardBackThemes[0].name); // New state for card back theme

  // --- Configuration ---
  const MAX_TURNS = 10;
  
  // --- Utility Hooks ---

  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev);
  }, []);

  // Voice synthesis function
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  /**
   * Initializes the Memory Match game.
   */
  const initializeGame = useCallback(() => {
    // 1. Create pairs (1 through 5)
    const initialNumbers = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
    
    // 2. Shuffle and map to Card objects
    const shuffledCards = initialNumbers
      .sort(() => Math.random() - 0.5)
      .map((number, index) => ({ number, id: index }));

    // 3. Reset states
    setCards(shuffledCards);
    setFlippedIndices([]);
    setMatchedIndices([]);
    setTurns(0);
    setIsProcessing(false);
    setGameStarted(true);
    setShowSuccess(false);
    setGameOver(false); // Reset Game Over state
    setGameId(prev => prev + 1);

    if ('speechSynthesis' in window) speechSynthesis.cancel();
    speak(`Match the animal train cars! You have ${MAX_TURNS} turns.`);
  }, [speak]);

  // --- Game Logic: Matching Check ---

  useEffect(() => {
    if (flippedIndices.length === 2 && !isProcessing) {
      setIsProcessing(true);
      const [index1, index2] = flippedIndices;
      const number1 = cards[index1].number;
      const number2 = cards[index2].number;
      
      // Increment turns ONLY when the second card is flipped
      setTurns(prev => prev + 1);

      if (number1 === number2) {
        // Match found!
        setMatchedIndices(prev => [...prev, index1, index2]);
        setFlippedIndices([]); // Clear flipped
        setIsProcessing(false);
        // Announce the animal name
        speak(`Match! Found the pair of ${animalMap[number1].name}.`);
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          setFlippedIndices([]);
          setIsProcessing(false);
          speak(`No match. Try again!`);
        }, 1000);
      }
    }
  }, [flippedIndices, cards, isProcessing, speak]);

  // --- Game Win Check ---

  useEffect(() => {
    if (matchedIndices.length === cards.length && cards.length > 0) {
      // Game Won!
      setTimeout(() => {
        setShowSuccess(true);
        if ('speechSynthesis' in window) speechSynthesis.cancel();
        speak(`You won in ${turns} turns! Excellent memory!`);
      }, 500);
    }
  }, [matchedIndices, cards.length, turns, speak]);

  // --- Game Over Check (Turn Limit) ---

  useEffect(() => {
    // Only check if game is active, not won, and turns hit the limit
    if (gameStarted && turns === MAX_TURNS && matchedIndices.length < cards.length && !showSuccess) {
      setGameOver(true);
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      speak(`Game Over! You ran out of turns. Try again!`);
    }
  }, [turns, matchedIndices.length, cards.length, showSuccess, gameStarted, speak]);


  // --- Event Handler: Card Click ---

  const handleCardClick = (index: number, number: number) => {
    // Disable clicks if processing (flipping back) or game is over
    if (isProcessing || gameOver || flippedIndices.includes(index) || matchedIndices.includes(index)) {
      return;
    }

    // Announce the animal name
    speak(animalMap[number].name);

    // Flip the card
    setFlippedIndices(prev => {
      // If one card is already flipped, add the second one.
      if (prev.length === 1) {
        return [...prev, index];
      }
      // If no cards are flipped, start a new turn.
      return [index];
    });
  };

  // --- Render UI ---

  // Start Screen
  if (!gameStarted) {
    return (
      <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
        isDark ? 'bg-slate-950 text-gray-100' : 'bg-gradient-to-br from-indigo-200 via-sky-200 to-teal-100'
      }`}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative">
          
          <button
            onClick={toggleTheme}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors ${
              isDark ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className={`text-center max-w-md mx-auto p-8 rounded-xl shadow-2xl ${
            isDark ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-teal-400' : 'text-indigo-800'
            }`}>
              🧠 Animal Memory Match 🧠
            </h1>
            <p className={`text-lg sm:text-xl mb-4 sm:mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Test your memory! Find 5 pairs of **Animal Train Cars** (Elephant, Lion, etc.).
            </p>
            
            {/* New Card Back Theme Selector */}
            <div className="mb-6">
                <label htmlFor="card-theme" className={`block text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    What kind of toy should be on the card backs?
                </label>
                <select
                    id="card-theme"
                    value={cardBackTheme}
                    onChange={(e) => setCardBackTheme(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100"
                >
                    {cardBackThemes.map(theme => (
                        <option key={theme.name} value={theme.name}>{theme.name}</option>
                    ))}
                </select>
            </div>
            {/* End Theme Selector */}

            <p className={`text-base sm:text-lg mb-6 sm:mb-8 font-bold ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>
              You only have {MAX_TURNS} turns to win!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={initializeGame}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                Start Game! 🎮
              </button>

              <button
                onClick={() => speak(`Welcome to the Animal Memory Match Game! Click on two cards to find a matching pair of animals. You have only ${MAX_TURNS} turns to win!`)}
                className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                disabled={!('speechSynthesis' in window)}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Hear Instructions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Game Screen
  return (
    <div className={`min-h-screen transition-colors duration-300 p-2 sm:p-4 relative overflow-hidden ${
      isDark ? 'bg-slate-950 text-gray-100' : 'bg-gradient-to-br from-indigo-200 via-sky-200 to-teal-100 text-gray-800'
    }`}>
      {/* CSS for 3D flip effect */}
      <style>
        {`
        .perspective {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        `}
      </style>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-4 sm:mb-8 mt-4">
          <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-teal-400' : 'text-indigo-800'} text-center w-full`}>
            🧠 Animal Memory Match 🧠
          </h1>
          
          <button
            onClick={toggleTheme}
            className={`p-2 sm:p-3 rounded-full shadow-lg transition-colors absolute top-4 right-4 ${
              isDark ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        {/* Scoreboard and Info */}
        <div className="flex justify-around items-center mb-6 p-3 rounded-xl shadow-lg bg-white/80 backdrop-blur dark:bg-slate-800/90">
          <p className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100">
            Turns: <span className={`font-extrabold ${turns >= MAX_TURNS ? 'text-red-500' : 'text-indigo-600 dark:text-indigo-400'}`}>{turns}</span> / {MAX_TURNS}
          </p>
          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300">
            Matches Found: <span className="font-semibold text-teal-500">{matchedIndices.length / 2}</span> / 5
          </p>
        </div>

        {/* Card Grid (5x2 layout) */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 justify-items-center p-2">
          {cards.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              index={index}
              isFlipped={flippedIndices.includes(index)}
              isMatched={matchedIndices.includes(index)}
              isProcessing={isProcessing || gameOver} // Pass processing/game over state
              onClick={handleCardClick}
              isDark={isDark}
              cardBackTheme={cardBackTheme} // Pass the selected theme down
            />
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center my-6">
          <button
            onClick={initializeGame}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
          >
            New Game 🎲
          </button>

          <button
            onClick={() => {
                if (isSpeaking) {
                    if ('speechSynthesis' in window) speechSynthesis.cancel();
                    setIsSpeaking(false);
                } else {
                    speak(`Click two cards to find a matching pair of animals. You must win in ${MAX_TURNS} turns!`);
                }
            }}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
            disabled={!('speechSynthesis' in window)}
          >
            {isSpeaking ? '🔊 Stop Speaking' : '🔊 Help/Instructions'}
          </button>
        </div>
      </div>
      
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDark ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="text-4xl sm:text-6xl mb-4">🎉</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">You Won!</h2>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>You matched all pairs in **{turns} turns**!</p>
            <button
              onClick={initializeGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all shadow-md"
            >
              Play Again! 🔄
            </button>
          </div>
        </div>
      )}
      
      {/* Game Over Popup */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDark ? 'bg-slate-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="text-4xl sm:text-6xl mb-4">💀</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mb-4">Game Over!</h2>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>You used all {MAX_TURNS} turns. Better luck next time!</p>
            <p className={`text-base sm:text-lg mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>You matched {matchedIndices.length / 2} out of 5 pairs.</p>
            <button
              onClick={initializeGame}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all shadow-md"
            >
              Try Again! 🔄
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;