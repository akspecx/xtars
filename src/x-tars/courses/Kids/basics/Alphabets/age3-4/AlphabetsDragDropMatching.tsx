import { useState } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

const AlphabetDragDrop = () => {
  const { speak, stopSpeech, isDarkMode, playSuccessSound, playErrorSound, playClickSound } = useGameModule();

  const [currentLetter, setCurrentLetter] = useState('A');
  const [draggedLetter, setDraggedLetter] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400',
    'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-orange-400', 'bg-cyan-400',
    'bg-lime-400', 'bg-rose-400', 'bg-emerald-400', 'bg-violet-400', 'bg-amber-400',
    'bg-sky-400', 'bg-fuchsia-400', 'bg-stone-400', 'bg-red-500', 'bg-blue-500',
    'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-teal-500'
  ];

  // Use global speech helper; track local "isPlaying" just for button label.
  const speakText = (text: string) => {
    setIsPlaying(true);
    speak(text);
    // best-effort: reset state after a short delay
    setTimeout(() => setIsPlaying(false), 1500);
  };

  const generateRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * alphabets.length);
    return alphabets[randomIndex];
  };

  // Desktop drag handlers
  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('text/plain', letter.trim());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(letter);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData('text/plain');
    console.log('Dropped letter:', droppedLetter, 'Current letter:', currentLetter);
    processLetterDrop(droppedLetter);
    setDraggedItem(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e, letter) => {
    setDraggedItem(letter);
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Check if dropped on the drop zone
    if (elementBelow && elementBelow.closest('[data-drop-zone="true"]')) {
      if (draggedItem) {
        processLetterDrop(draggedItem);
      }
    }
    
    setDraggedItem(null);
  };

  // Process the letter drop (common for both drag and touch)
  const processLetterDrop = (droppedLetter) => {
    setDraggedLetter(droppedLetter);
    
    const correct = droppedLetter.trim() === currentLetter.trim();
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
      speakText(`Excellent! ${currentLetter} is correct! Great job!`);
    } else {
      speakText(`Oops! That's ${droppedLetter}. Try to find the letter ${currentLetter}.`);
    }
    
    // Auto hide feedback after 2 seconds
    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        handleNext();
      }
    }, 2500);
  };

  const handleNext = () => {
    const newLetter = generateRandomLetter();
    setCurrentLetter(newLetter);
    setDraggedLetter('');
    setIsCorrect(false);
    setShowFeedback(false);
    
    // Announce the new letter
    setTimeout(() => {
      speakText(`Find the letter ${newLetter}. Drag it to the box above!`);
    }, 500);
  };

  const handleReset = () => {
    setScore(0);
    setAttempts(0);
    handleNext();
  };

  const speakCurrentLetter = () => {
    speakText(`The letter is ${currentLetter}. Find ${currentLetter} and drag it to the box!`);
  };

  const speakInstructions = () => {
    speakText(`Welcome to the Alphabet Game! Look at the letter in the top box. Then find the same letter from the bottom and drag it up! Let's start with the letter ${currentLetter}!`);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
            isDarkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            🌈 Alphabet Game 🎯
          </h1>
          
          {/* Score and Controls */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className={`rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 shadow-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
              <span className="text-sm sm:text-base md:text-lg font-bold text-green-600">
                Score: {score}/{attempts}
              </span>
            </div>
            
            <div className="flex gap-1 sm:gap-2">
              {/* Voice controls now use global settings;
                  these buttons simply trigger speech or stop it. */}
              <button
                onClick={speakInstructions}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                title="Hear Instructions"
              >
                <span className="text-sm sm:text-base">📢</span>
              </button>
              
              <button
                onClick={() => {
                  if (isPlaying) {
                    stopSpeech();
                    setIsPlaying(false);
                  } else {
                    speakCurrentLetter();
                  }
                }}
                className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105`}
                title={isPlaying ? 'Stop' : 'Hear Current Letter'}
              >
                <span className="text-sm sm:text-base">{isPlaying ? '🔇' : '🔊'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                title="Reset Game"
              >
                <span className="text-sm sm:text-base">🔄</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Drop Zone - Top Box */}
          <div className="flex justify-center px-2">
            <div className="relative">
              <div
                data-drop-zone="true"
                className={`
                  w-56 h-36 sm:w-64 sm:h-40 md:w-80 md:h-48 lg:w-96 lg:h-56 xl:w-[28rem] xl:h-64
                  rounded-2xl sm:rounded-3xl border-4 border-dashed transition-all duration-300 
                  flex items-center justify-center shadow-2xl
                  ${showFeedback 
                    ? isCorrect 
                      ? `border-green-500 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} animate-pulse` 
                      : `border-red-500 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} animate-bounce`
                    : isDarkMode 
                      ? 'border-purple-400 bg-gray-800 hover:border-purple-300 hover:bg-gray-700' 
                      : 'border-purple-400 bg-white hover:border-purple-600 hover:bg-purple-50'
                  }
                `}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {!draggedLetter ? (
                  <div className="text-center">
                    <div className={`
                      text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold animate-pulse
                      ${isDarkMode 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
                        : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
                      }
                    `}>
                      {currentLetter}
                    </div>
                    <p className={`text-xs sm:text-sm md:text-base mt-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {window.innerWidth < 640 ? 'Tap here!' : 'Drop here!'}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className={`
                      text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold
                      ${isCorrect ? 'text-green-600' : 'text-red-600'} 
                      ${showFeedback ? 'animate-bounce' : ''}
                    `}>
                      {draggedLetter}
                    </div>
                    {showFeedback && (
                      <div className={`text-sm sm:text-base md:text-lg font-bold mt-2 ${
                        isCorrect ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isCorrect ? '🎉 Correct!' : '❌ Try Again!'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Sparkle effects for correct answers */}
              {showFeedback && isCorrect && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 text-lg sm:text-xl md:text-2xl animate-ping">✨</div>
                  <div className="absolute top-0 right-0 text-lg sm:text-xl md:text-2xl animate-ping animation-delay-100">🌟</div>
                  <div className="absolute bottom-0 left-0 text-lg sm:text-xl md:text-2xl animate-ping animation-delay-200">💫</div>
                  <div className="absolute bottom-0 right-0 text-lg sm:text-xl md:text-2xl animate-ping animation-delay-300">⭐</div>
                </div>
              )}
            </div>
          </div>

          {/* Alphabet Grid - Bottom Box */}
          <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl border-4 mx-2 ${
            isDarkMode 
              ? 'bg-gray-800 border-purple-600' 
              : 'bg-white border-gradient-to-r from-purple-400 to-pink-400'
          }`}>
            <div className="text-center mb-3 sm:mb-4">
              <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                🔤 {window.innerWidth < 640 ? 'Tap the letters!' : 'Drag the letters!'} 🔤
              </h2>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-13 gap-1 sm:gap-2 md:gap-3">
              {alphabets.map((letter, index) => (
                <div
                  key={letter}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  onTouchStart={(e) => handleTouchStart(e, letter)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`
                    ${colors[index]} 
                    text-white font-bold 
                    text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
                    w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18
                    rounded-xl sm:rounded-2xl 
                    flex items-center justify-center 
                    cursor-grab active:cursor-grabbing touch-manipulation
                    shadow-lg hover:shadow-xl
                    transition-all duration-200
                    hover:scale-110 active:scale-95
                    border-2 border-white
                    hover:rotate-3
                    ${draggedItem === letter ? 'scale-110 rotate-3 ring-4 ring-white ring-opacity-50' : ''}
                    select-none
                  `}
                  title={`${window.innerWidth < 640 ? 'Tap' : 'Drag'} ${letter}`}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          {showFeedback && isCorrect && (
            <div className="flex justify-center px-2">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-full shadow-lg text-base sm:text-lg md:text-xl transition-all transform hover:scale-105 animate-bounce"
              >
                🚀 Next Letter!
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className={`mt-6 sm:mt-8 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 mx-2 ${
          isDarkMode 
            ? 'bg-gray-800 border-purple-600' 
            : 'bg-white border-purple-200'
        }`}>
          <h3 className={`text-base sm:text-lg font-bold text-center mb-2 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`}>
            🎮 How to Play
          </h3>
          <div className={`text-center space-y-1 text-xs sm:text-sm md:text-base ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p>1. Look at the letter in the top box 👀</p>
            <p>2. Find the same letter in the grid below 🔍</p>
            <p>3. {window.innerWidth < 640 ? 'Tap and drag' : 'Drag and drop'} it into the top box 🖱️</p>
            <p>4. Listen to the voice feedback! 🔊</p>
          </div>
        </div>

        {/* Celebration for high scores */}
        {score > 0 && score % 5 === 0 && showFeedback && isCorrect && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-bounce">
              🎉🎊🌟 Awesome! 🌟🎊🎉
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphabetDragDrop;
