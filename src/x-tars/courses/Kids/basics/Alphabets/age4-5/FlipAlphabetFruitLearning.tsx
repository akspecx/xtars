// Full ScratchSpellGame implementation from FlipAlphabetFruitLearning,
// already mobile-optimized with touch and click-to-place.
import React, { useState, useRef, useEffect } from 'react';
import { Shuffle, RotateCcw, Sparkles, Volume2, Search } from 'lucide-react';
import { useGameModule } from '@/hooks/useGameModule';

// Success Modal Component
const SuccessModal = ({ onPlayAgain, targetWord, isDark }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-40 backdrop-blur-sm">
      <div className={`relative p-6 sm:p-8 rounded-3xl text-center shadow-2xl transform transition-all duration-300 scale-100 opacity-100 animate-pop-in ${
        isDark ? 'bg-gray-800 text-purple-200' : 'bg-white text-purple-800'
      }`}>
        <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
          {/* Confetti effect using emojis */}
          <div className="absolute top-0 left-0 w-full h-full confetti-container pointer-events-none">
            {'🎉🌟🍬🍭🌈✨'.split('').map((char, i) => (
              <span key={i} className="absolute text-2xl sm:text-4xl animate-confetti" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}>
                {char}
              </span>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <div className="text-5xl sm:text-7xl mb-4 animate-bounce-slow">🎉</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-2 drop-shadow-lg">
            Fantastic!
          </h2>
          <p className="text-base sm:text-lg mb-6">
            You spelled "{targetWord}" correctly!
          </p>
          <button
            onClick={onPlayAgain}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            Play Again!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0.5); opacity: 0; }
          80% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.5s ease-out forwards;
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        /* Required for the 3D flip effect */
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        @keyframes pop {
          0% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.0); }
        }
        .animate-pop {
          animation: pop 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

const ScratchSpellGame = () => {
  const { isDarkMode: isDark } = useGameModule();
  // Note: Since this is a simple spelling game, we'll keep the letter pool constant for simplicity.
  const [availableLetters] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  const [flippedFruit, setFlippedFruit] = useState(null);
  const [targetWord, setTargetWord] = useState('');
  const [userAnswer, setUserAnswer] = useState([]);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // State for keyboard-based letter selection (Click-to-Place functionality)
  const [selectedLetter, setSelectedLetter] = useState(null);
  
  // Colorful alphabet colors for background gradients
  const letterColors = [
    'from-red-500 to-pink-500', 'from-blue-500 to-cyan-500', 'from-green-500 to-teal-500',
    'from-purple-500 to-indigo-500', 'from-yellow-500 to-orange-500', 'from-pink-500 to-rose-500',
    'from-indigo-500 to-purple-500', 'from-teal-500 to-green-500', 'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500', 'from-lime-500 to-green-500', 'from-violet-500 to-purple-500',
    'from-amber-500 to-yellow-500', 'from-emerald-500 to-teal-500', 'from-rose-500 to-pink-500',
    'from-sky-500 to-cyan-500', 'from-fuchsia-500 to-pink-500', 'from-red-500 to-orange-500',
    'from-blue-500 to-indigo-500', 'from-green-500 to-emerald-500', 'from-purple-500 to-violet-500',
    'from-yellow-500 to-amber-500', 'from-pink-500 to-fuchsia-500', 'from-cyan-500 to-teal-500',
    'from-orange-500 to-yellow-500', 'from-indigo-500 to-blue-500'
  ];

  const getLetterColor = (letter) => {
    const index = letter.charCodeAt(0) - 'A'.charCodeAt(0);
    return letterColors[index % letterColors.length];
  };

  const fruits = [
    { name: 'APPLE', emoji: '🍎', color: 'text-red-500', bgColor: 'bg-red-200' },
    { name: 'ORANGE', emoji: '🍊', color: 'text-orange-500', bgColor: 'bg-orange-200' },
    { name: 'BANANA', emoji: '🍌', color: 'text-yellow-500', bgColor: 'bg-yellow-200' },
    { name: 'GRAPE', emoji: '🍇', color: 'text-purple-500', bgColor: 'bg-purple-200' },
    { name: 'MANGO', emoji: '🥭', color: 'text-yellow-500', bgColor: 'bg-yellow-200' },
    { name: 'CHERRY', emoji: '🍒', color: 'text-red-500', bgColor: 'bg-red-200' },
    { name: 'PEACH', emoji: '🍑', color: 'text-pink-500', bgColor: 'bg-pink-200' },
    { name: 'LEMON', emoji: '🍋', color: 'text-yellow-500', bgColor: 'bg-yellow-200' }
  ];

  // Voice feedback function using Web Speech API
  const speak = (text) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    // NOTE: Removed aggressive cancellation (speechSynthesis.cancel()) here 
    // to allow voice messages to queue up naturally. 
    // Cancellation is now handled explicitly in toggleVoice and resetGame.
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  // Handle card flip: initiates the game
  const handleCardFlip = (index) => {
    // Cannot flip if a fruit is already revealed or this card is already flipped
    if (flippedFruit || flippedCards.has(index)) return;
    
    // Visually flip the card
    const newFlippedCards = new Set(flippedCards);
    newFlippedCards.add(index);
    setFlippedCards(newFlippedCards);
    
    // Set the game state after the flip animation completes (700ms in CSS, using 300ms for responsiveness)
    setTimeout(() => {
      const fruit = fruits[index];
      setFlippedFruit(fruit);
      setTargetWord(fruit.name);
      // Initialize user answer slots based on word length
      setUserAnswer(new Array(fruit.name.length).fill(null));
      setGameStatus('playing');
      speak(`Great! You found ${fruit.name}. Now spell it using the letters.`);
    }, 300);
  };

  // --- Drag and Drop Handlers ---
  const handleDragStart = (letter) => {
    setDraggedLetter(letter);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverIndex(index); // Visual indication of where the drop will land
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverIndex(null);
  };

  const handleDrop = (e, position) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (!draggedLetter || gameStatus !== 'playing') return;
    
    // Place the dragged letter in the answer slot
    const newAnswer = [...userAnswer];
    newAnswer[position] = { letter: draggedLetter, color: flippedFruit.bgColor };
    setUserAnswer(newAnswer);
    setDraggedLetter(null);
    checkGameStatus(newAnswer);
  };

  // --- Touch Handlers for Mobile / Tablets ---
  const handleLetterTouchStart = (e, letter) => {
    if (gameStatus !== 'playing') return;
    e.preventDefault();
    e.stopPropagation();
    setDraggedLetter(letter);
  };

  const handleLetterTouchMove = (e) => {
    if (!draggedLetter) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const handleLetterTouchEnd = (e) => {
    if (!draggedLetter) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.changedTouches?.[0];
    if (!touch) {
      setDraggedLetter(null);
      setDragOverIndex(null);
      return;
    }

    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow) {
      const slotElement = elementBelow.closest('[data-answer-slot="true"]');
      const slotIndexAttr = slotElement?.getAttribute('data-slot-index');

      if (slotElement && slotIndexAttr != null) {
        const position = parseInt(slotIndexAttr, 10);
        if (!Number.isNaN(position) && gameStatus === 'playing') {
          const newAnswer = [...userAnswer];
          newAnswer[position] = { letter: draggedLetter, color: flippedFruit.bgColor };
          setUserAnswer(newAnswer);
          checkGameStatus(newAnswer);
        }
      }
    }

    setDraggedLetter(null);
    setDragOverIndex(null);
  };

  // --- Click-to-Place Handlers ---
  const handleLetterSelection = (letter) => {
    // Toggle selection: if already selected, deselect; otherwise, select
    setSelectedLetter(prev => prev === letter ? null : letter);
  };
  
  const handleAnswerSlotSelect = (position) => {
    if (!selectedLetter || gameStatus !== 'playing') return;
    
    // Place the selected letter in the answer slot
    const newAnswer = [...userAnswer];
    newAnswer[position] = { letter: selectedLetter, color: flippedFruit.bgColor };
    setUserAnswer(newAnswer);
    setSelectedLetter(null); // Deselect after placing
    checkGameStatus(newAnswer);
  };

  // Checks if the word is complete and correct
  const checkGameStatus = (currentAnswer) => {
    const isComplete = currentAnswer.every(slot => slot !== null);
    if (isComplete) {
      const userWord = currentAnswer.map(slot => slot.letter).join('');
      if (userWord === targetWord) {
        setGameStatus('success');
        speak(`Fantastic! You spelled ${targetWord} correctly! Well done!`);
      } else {
        setGameStatus('incorrect');
        speak('That\'s not quite right. Try again!');
      }
    }
  };

  const resetGame = () => {
    setFlippedFruit(null);
    setTargetWord('');
    setUserAnswer([]);
    setGameStatus('waiting');
    setDraggedLetter(null);
    setFlippedCards(new Set());
    setSelectedLetter(null);
    // Explicitly cancel ongoing speech when starting a new game
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    speak('New game started! Click a card to flip and reveal a fruit.');
  };

  const tryAgain = () => {
    // Clear the current attempt but keep the target word
    setUserAnswer(new Array(targetWord.length).fill(null));
    setGameStatus('playing');
    speak('Try spelling the word again.');
  };

  const handleGetHint = () => {
    if (gameStatus !== 'playing') return;

    // Find the first blank spot
    const blankIndex = userAnswer.findIndex(slot => slot === null);
    
    if (blankIndex !== -1) {
      const newAnswer = [...userAnswer];
      const hintLetter = targetWord[blankIndex];
      newAnswer[blankIndex] = { letter: hintLetter, color: flippedFruit.bgColor };
      setUserAnswer(newAnswer);
      
      // Provide a brief pause before speaking to ensure the state update renders
      setTimeout(() => {
        speak(`The letter at position ${blankIndex + 1} is ${hintLetter}.`);
        checkGameStatus(newAnswer);
      }, 50);

    } else {
      speak('You have already spelled the full word! There are no more hints.');
    }
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    // Explicitly cancel ongoing speech on toggle
    if ('speechSynthesis' in window) speechSynthesis.cancel(); 
    if (newState) {
      speak('Voice enabled. Welcome to the game!');
    }
  };

  // Cleanup any running speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-purple-900' : 'bg-gradient-to-br from-blue-100 to-purple-100'
    } p-3 sm:p-6 font-[Inter]`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with controls (Responsive layout is already handled by flex and Tailwind's breakpoint utilities) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <h1 className={`text-2xl sm:text-4xl font-bold text-center ${
            isDark ? 'text-purple-200' : 'text-purple-800'
          }`}>
            <Sparkles className="inline-block mr-2 mb-1" />
            Flip & Spell Adventure
          </h1>
          <div className="flex gap-3">
            <button
              onClick={toggleVoice}
              className={`p-2 sm:p-3 rounded-full transition-colors ${
                isVoiceEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'
              } text-white shadow-lg`}
              title="Toggle Voice"
            >
              <Volume2 size={18} />
            </button>
          </div>
        </div>

        {/* Game Status Messages */}
        {gameStatus === 'incorrect' && (
          <div className={`border rounded-xl px-4 py-3 mb-6 text-center shadow-md animate-pop-in ${
            isDark ? 'bg-red-900 border-red-600 text-red-200' : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <div className="text-lg sm:text-xl mb-3 font-semibold">Oops! That's not quite right. Try again!</div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={tryAgain}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={resetGame}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors transform hover:scale-105"
              >
                New Game
              </button>
            </div>
          </div>
        )}
        
        {/* === 1. Alphabet Letters (Box 1) - Top Section === */}
        <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl mb-6 sm:mb-8 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-2xl font-bold ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              📝 Alphabet Letters
            </h2>
            <Shuffle className={isDark ? 'text-purple-400' : 'text-purple-600'} size={20} />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
            {/* The letter tiles are responsive due to flex-wrap and fluid sizing (min-width, padding) */}
            {availableLetters.map((letter, index) => (
              <div
                key={index}
                draggable={gameStatus === 'playing'}
                onClick={() => gameStatus === 'playing' && handleLetterSelection(letter)}
                onDragStart={() => gameStatus === 'playing' && handleDragStart(letter)}
                onTouchStart={(e) => handleLetterTouchStart(e, letter)}
                onTouchMove={handleLetterTouchMove}
                onTouchEnd={handleLetterTouchEnd}
                className={`bg-gradient-to-r ${getLetterColor(letter)} text-white px-2 sm:px-3 py-2 rounded-lg font-bold text-sm sm:text-lg cursor-pointer hover:shadow-md transition-all transform select-none active:scale-95 touch-manipulation
                ${selectedLetter === letter ? 'ring-4 ring-offset-2 ring-purple-500 ring-offset-current' : 'hover:scale-105'}
                ${gameStatus !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ minWidth: '2.5rem', textAlign: 'center' }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>

        {/* === 2. Spell the Word (Box 2) & 3. Flip Cards (Box 3) - Two Column Layout === */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
          
          {/* 2. Spell the Word (Answer Area) - Left Column (Wider area for spelling) */}
          <div 
            className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl transition-colors duration-300
              ${isDark ? 'bg-gray-800' : 'bg-white'}
            `}
          >
            <h2 className={`text-lg sm:text-2xl font-bold mb-4 ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              ✏️ Spell the Word
            </h2>
            {flippedFruit ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl sm:text-6xl mb-2">{flippedFruit.emoji}</div>
                  <p className={`text-base sm:text-lg ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Spell: <span className='font-bold'>{flippedFruit.name.length} letters</span>
                  </p>
                </div>
                {/* Answer slots are responsive due to flex-wrap and controlled sizing */}
                <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
                  {targetWord.split('').map((letter, index) => (
                    <div
                      key={index}
                      data-answer-slot="true"
                      data-slot-index={index}
                      onClick={() => handleAnswerSlotSelect(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative w-12 h-12 sm:w-16 sm:h-16 border-2 rounded-xl flex items-center justify-center transition-all duration-150 touch-manipulation cursor-pointer
                      ${userAnswer[index] ? 'border-transparent shadow-lg scale-100' : 'border-dashed hover:border-solid hover:scale-105'}
                      ${userAnswer[index] ? userAnswer[index].color : (dragOverIndex === index ? `border-solid border-4 ${flippedFruit.bgColor}` : (isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-400'))}
                      ${userAnswer[index] ? 'animate-pop' : ''}`}
                    >
                      {/* Dotted hint letter visible when slot is empty */}
                      {!userAnswer[index] && (
                          <span className={`absolute text-lg sm:text-2xl font-bold transition-opacity duration-150 ${
                            isDark ? 'text-gray-600' : 'text-gray-300'
                          }`}
                          style={{
                            // This is a common technique for 'dotted' text in Tailwind environments
                            textShadow: '0 0 0 transparent',
                            WebkitTextStroke: isDark ? '1px #4b5563' : '1px #d1d5db' 
                          }}>
                            {letter}
                          </span>
                      )}
                      {/* User's answer letter */}
                      {userAnswer[index] && (
                        <span className={`text-xl sm:text-3xl font-extrabold ${flippedFruit.color} z-10 drop-shadow-md`}>
                          {userAnswer[index].letter}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <button
                    onClick={handleGetHint}
                    disabled={userAnswer.every(l => l !== null)}
                    className={`mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 mx-auto shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Search size={16} /> Get Hint
                  </button>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <p className="text-base sm:text-lg">Click a card from the **Flip Cards** section to reveal a word and start spelling! (Look right 👉)</p>
              </div>
            )}
          </div>
          
          {/* 3. Flip Cards (Box 3) - Right Column */}
          <div>
            <div className={`rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl ${
              isDark ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <h2 className={`text-lg sm:text-2xl font-bold ${
                  isDark ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  🎯 Flip Cards
                </h2>
                <button
                  onClick={resetGame}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 text-sm sm:text-base shadow-md transform hover:scale-105"
                >
                  <RotateCcw size={16} />
                  Reset Game
                </button>
              </div>

              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {fruits.map((fruit, index) => (
                    <div
                      key={index}
                      className={`relative aspect-square touch-manipulation ${
                        flippedFruit ? 'cursor-not-allowed' : 'cursor-pointer'
                      }`}
                      onClick={() => handleCardFlip(index)}
                    >
                      {/* Card Container with 3D Flip Effect */}
                      <div className={`relative w-full h-full transition-transform duration-700 transform-gpu preserve-3d ${
                        flippedCards.has(index) ? 'rotate-y-180' : ''
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: flippedCards.has(index) ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}>
                        {/* Card Back (Initial State) */}
                        <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-xl backface-hidden ${
                          isDark ? 'bg-gradient-to-br from-purple-600 to-indigo-700' : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                        } flex items-center justify-center transform rotate-y-0 ${
                            flippedFruit ? 'opacity-50' : 'hover:scale-[1.02] transition-transform duration-200'
                        }`}
                        style={{ backfaceVisibility: 'hidden' }}>
                          <div className="text-center text-white">
                            <div className="text-4xl sm:text-5xl mb-3 animate-pulse">🎁</div>
                            <div className="text-sm sm:text-base font-bold">Click to Flip!</div>
                            <div className="text-xs sm:text-sm mt-1 opacity-80">Reveal the fruit</div>
                          </div>
                        </div>
                        {/* Card Front (Revealed State) */}
                        <div className={`absolute inset-0 w-full h-full rounded-2xl shadow-xl backface-hidden ${
                          isDark ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-yellow-300 to-orange-400'
                        } flex items-center justify-center transform rotate-y-180`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}>
                          <div className="text-center p-2">
                            <div className="text-5xl sm:text-6xl lg:text-7xl mb-2 drop-shadow-lg">
                              {fruit.emoji}
                            </div>
                            <div className={`text-sm sm:text-base lg:text-lg font-bold drop-shadow-md ${
                              isDark ? 'text-gray-900' : 'text-gray-800'
                            }`}>
                              {fruit.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className={`text-xs sm:text-sm mt-4 text-center ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                🎯 Click any card to flip it and reveal a delicious fruit! (You can only flip one at a time.)
              </p>
            </div>
          </div>
        </div>
      </div>
      {gameStatus === 'success' && (
        <SuccessModal 
          onPlayAgain={resetGame}
          targetWord={targetWord}
          isDark={isDark}
        />
      )}
    </div>
  );
};

// Export the main App component
const App = () => <ScratchSpellGame />;
export default App;
