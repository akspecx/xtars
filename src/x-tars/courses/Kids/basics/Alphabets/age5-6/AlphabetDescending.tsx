import React, { useState, useRef, useCallback } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

interface LetterCarColors {
  main: string;
  roof: string;
  border: string;
}

const AlphabetDescending: React.FC = () => {
  const { isDarkMode: isDark, speak: globalSpeak } = useGameModule();
  const [gameLetters, setGameLetters] = useState<string[]>([]);
  const [droppedLetters, setDroppedLetters] = useState<(string | null)[]>(new Array(5).fill(null));
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [draggedSourceIndex, setDraggedSourceIndex] = useState<number | null>(null);
  const [draggedFromDroppedZone, setDraggedFromDroppedZone] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [trainMoving, setTrainMoving] = useState<boolean>(false);
  const [currentDroppedTarget, setCurrentDroppedTarget] = useState<number | null>(null);
  const [gameId, setGameId] = useState<number>(0);

  const correctSequence = ['E', 'D', 'C', 'B', 'A'];

  const letterCarColors: Record<string, LetterCarColors> = {
    'A': { main: 'from-pink-400 to-pink-500', border: 'border-pink-600', roof: 'bg-pink-300' },
    'B': { main: 'from-purple-400 to-purple-500', border: 'border-purple-600', roof: 'bg-purple-300' },
    'C': { main: 'from-yellow-400 to-yellow-500', border: 'border-yellow-600', roof: 'bg-yellow-300' },
    'D': { main: 'from-green-400 to-green-500', border: 'border-green-600', roof: 'bg-green-300' },
    'E': { main: 'from-orange-400 to-orange-500', border: 'border-orange-600', roof: 'bg-orange-300' }
  };

  const speak = useCallback((text: string) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined' &&
      !isSpeaking
    ) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const checkSequence = useCallback((newDroppedLetters: (string | null)[]) => {
    const isComplete = newDroppedLetters.every(letter => letter !== null);
    if (isComplete) {
      const isCorrect = newDroppedLetters.every((letter, index) => letter === correctSequence[index]);
      if (isCorrect) {
        setTrainMoving(true);
        speak("Awesome! You arranged the alphabet train perfectly in reverse order! Get ready for a surprise!");
        setTimeout(() => {
          setShowSuccess(true);
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          speak("Here are some yummy candies for you!");
        }, 3000);
      } else {
        setShowError(true);
        speak("Oops! That's not quite right. Remember, the reverse alphabet goes E, D, C, B, A. Try again!");
      }
    }
  }, [speak]);

  const initializeGame = useCallback(() => {
    const newDroppedLetters: (string | null)[] = new Array(5).fill(null);
    const initialLetters = ['A', 'B', 'C', 'D', 'E'];
    const shuffledAvailableLetters = [...initialLetters].sort(() => Math.random() - 0.5);

    setGameLetters(shuffledAvailableLetters);
    setDroppedLetters(newDroppedLetters);
    setDraggedLetter(null);
    setDraggedSourceIndex(null);
    setDraggedFromDroppedZone(false);
    setShowSuccess(false);
    setShowError(false);
    setGameStarted(true);
    setTrainMoving(false);
    setGameId(prev => prev + 1);

    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speak(`Time to build the alphabet train in reverse order! The train needs to be: E, D, C, B, and finally A. Drag the letters below to complete the train!`);
  }, [speak]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, letter: string, isDropped: boolean, index: number | null) => {
    setDraggedLetter(letter);
    setDraggedFromDroppedZone(isDropped);
    setDraggedSourceIndex(index);
    if ('dataTransfer' in e) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', letter);
    }
    speak(`You picked letter ${letter}. Now drop it in the right position!`);
  };

  const handleDragEnd = () => {
    setDraggedLetter(null);
    setDraggedFromDroppedZone(false);
    setDraggedSourceIndex(null);
    setCurrentDroppedTarget(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if ('dataTransfer' in e) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setCurrentDroppedTarget(targetIndex);
  };

  const handleDragLeave = () => {
    setCurrentDroppedTarget(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    setCurrentDroppedTarget(null);

    if (draggedLetter === null) return;

    const newDroppedLetters = [...droppedLetters];
    let newGameLetters = [...gameLetters];
    const targetLetter = newDroppedLetters[targetIndex];

    if (draggedFromDroppedZone) {
      if (draggedSourceIndex !== null && draggedSourceIndex !== targetIndex) {
        if (targetLetter === null) {
          newDroppedLetters[targetIndex] = draggedLetter;
          newDroppedLetters[draggedSourceIndex] = null;
          speak(`You moved letter ${draggedLetter}.`);
        } else {
          newDroppedLetters[targetIndex] = draggedLetter;
          newDroppedLetters[draggedSourceIndex] = targetLetter;
          speak(`You swapped letter ${draggedLetter} with letter ${targetLetter}.`);
        }
      }
    } else {
      if (targetLetter !== null) {
        speak(`That spot is already taken by letter ${targetLetter}. You need to empty it first or drag your letter to an empty spot.`);
        handleDragEnd();
        return;
      }

      newDroppedLetters[targetIndex] = draggedLetter;

      const gameLetterIndex = newGameLetters.findIndex(l => l === draggedLetter);
      if (gameLetterIndex > -1) {
        newGameLetters.splice(gameLetterIndex, 1);
      }

      speak(`You placed letter ${draggedLetter} in position ${targetIndex + 1}.`);
    }

    setDroppedLetters(newDroppedLetters);
    setGameLetters(newGameLetters);
    handleDragEnd();
    checkSequence(newDroppedLetters);
  };

  const LetterCar: React.FC<{
    letter: string | null;
    colors: LetterCarColors;
    isDropZone?: boolean;
    isEmpty?: boolean;
    isAvailable?: boolean;
    isDragged?: boolean;
    isDropTarget?: boolean;
    index?: number;
  }> = ({ letter, colors, isDropZone = false, isEmpty = false, isAvailable = false, isDragged = false, isDropTarget = false, index }) => {
    const canBeDragged = isAvailable || (isDropZone && letter !== null);

    return (
      <div
        className={`relative transition-all duration-300 ${isDragged ? 'scale-110 z-10 opacity-70' : ''} ${
          canBeDragged ? 'cursor-grab active:cursor-grabbing' : ''
        } ${isDropTarget ? 'scale-105' : ''}`}
        draggable={canBeDragged}
        onDragStart={(e) => {
          if (canBeDragged && letter !== null) {
            handleDragStart(e, letter, isDropZone, index !== undefined ? index : null);
          }
        }}
        onTouchStart={(e) => {
          if (canBeDragged && letter !== null) {
            handleDragStart(e, letter, isDropZone, index !== undefined ? index : null);
          }
        }}
        onDragEnd={handleDragEnd}
        onTouchEnd={handleDragEnd}
      >
        <div className={`
          ${isEmpty ? (isDark ? 'border-4 border-dashed border-gray-600 bg-gray-700' : 'border-4 border-dashed border-gray-400 bg-gray-100') :
            `bg-gradient-to-b ${colors.main} border-4 ${colors.border}`}
          rounded-lg w-16 h-12 sm:w-20 sm:h-16 md:w-24 md:h-18 flex items-center justify-center shadow-lg
          transform transition-all duration-200
          ${canBeDragged ? 'hover:scale-105 hover:shadow-xl' : ''}
        `}>
          {isEmpty || letter === null ? (
            <div className={`text-xs text-center leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Drop<br />Here</div>
          ) : (
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">{letter}</div>
          )}
        </div>

        <div className={`absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 ${
          isEmpty ? (isDark ? 'bg-gray-500 border-gray-600' : 'bg-gray-300 border-gray-400') : 'bg-gray-800 border-gray-900'
        } rounded-full border-2`}></div>
        <div className={`absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 ${
          isEmpty ? (isDark ? 'bg-gray-500 border-gray-600' : 'bg-gray-300 border-gray-400') : 'bg-gray-800 border-gray-900'
        } rounded-full border-2`}></div>

        <div className={`absolute -top-1 sm:-top-2 left-0.5 sm:left-1 right-0.5 sm:right-1 h-2 sm:h-3 ${
          isEmpty ? (isDark ? 'bg-gray-600 border-gray-700 border-dashed' : 'bg-gray-200 border-gray-400 border-dashed') :
            `${colors.roof} border-2 ${colors.border}`
        } rounded-t-lg `}></div>

        {!isEmpty && (
          <>
            <div className="absolute top-1 left-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-80"></div>
            <div className="absolute top-1 right-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full opacity-80"></div>
          </>
        )}

        {!isEmpty && (
          <div className="absolute -left-1 sm:-left-2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-2 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
        )}
      </div>
    );
  };

  const Engine: React.FC = () => (
    <div className="relative mr-2 sm:mr-3">
      <div className="bg-gradient-to-b from-red-400 to-red-500 border-4 border-red-600 rounded-lg w-18 h-14 sm:w-24 sm:h-20 md:w-28 md:h-22 flex flex-col items-center justify-center shadow-lg">
        <div className="text-lg sm:text-2xl mb-0 sm:mb-1">🚂</div>
        <div className="text-white font-bold text-xs sm:text-sm">Engine</div>
      </div>

      <div className="absolute -bottom-1 sm:-bottom-2 left-1 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full border-2 border-gray-900"></div>
      <div className="absolute -bottom-1 sm:-bottom-2 right-1 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gray-800 rounded-full border-2 border-gray-900"></div>

      <div className="absolute -top-2 sm:-top-3 left-1 sm:left-2 right-1 sm:right-2 h-3 sm:h-4 bg-red-300 rounded-t-lg border-2 border-red-600"></div>

      <div className="absolute -top-3 sm:-top-5 left-1/2 transform -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-gray-700 rounded-full"></div>

      <div className="absolute -top-5 sm:-top-7 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">💨</div>

      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-2 bg-gray-800 border-2 border-gray-900 rounded-full"></div>
    </div>
  );

  if (!gameStarted) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-sky-200 to-green-200'
      }`}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className={`text-center max-w-md mx-auto p-8 rounded-xl shadow-2xl ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-purple-300' : 'text-blue-800'
            }`}>
              🚂 Reverse Alphabet Train 🚂
            </h1>
            <p className={`text-lg sm:text-xl mb-4 sm:mb-6 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Help arrange the colorful letter cars in reverse order!
            </p>
            <p className={`text-base sm:text-lg mb-6 sm:mb-8 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Drag the letter cars onto the track in sequence: E, D, C, B, A
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={initializeGame}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 sm:px-8 rounded-full text-lg sm:text-xl shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
              >
                Start Game! 🎮
              </button>

              <button
                onClick={() => speak("Welcome to the Reverse Alphabet Train Game! You will drag colorful letter cars to arrange them in reverse order from E to A. Each car has a different color and you need to put them in the right sequence. Have fun!")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-base sm:text-lg shadow-lg transform hover:scale-105 transition-all w-full sm:w-auto"
                disabled={isSpeaking}
              >
                {isSpeaking ? '🔊 Speaking...' : '🔊 Hear Instructions'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 p-2 sm:p-4 ${
      isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-sky-200 to-green-200 text-gray-800'
    }`}>
      <style>
        {`
        @keyframes move-forward {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-150vw);
          }
        }
        .animate-move-forward {
          animation: move-forward 3s ease-in-out forwards;
        }

        @keyframes cheering-jump {
            0%, 100% { transform: translateY(0) rotate(0deg) scale(1); }
            25% { transform: translateY(-20px) rotate(10deg) scale(1.1); }
            50% { transform: translateY(0) rotate(-10deg) scale(1); }
            75% { transform: translateY(-10px) rotate(5deg) scale(1.05); }
        }
        .animate-cheering {
            animation: cheering-jump 0.8s ease-in-out infinite;
        }
        `}
      </style>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl transform max-w-sm mx-auto ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="text-4xl sm:text-6xl mb-4">🎉</div>
            <div className="text-6xl sm:text-8xl mb-4 animate-cheering drop-shadow-lg">
              🥳
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mb-4">Awesome!</h2>
            <div className="text-2xl sm:text-4xl mb-4">🍭🍬🍪🧁🍰</div>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Great job arranging the reverse alphabet train!</p>
            <button
              onClick={initializeGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Play Again! 🔄
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowError(false)}>
          <div className={`rounded-3xl p-6 sm:p-8 text-center shadow-2xl max-w-sm mx-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <div className="text-4xl sm:text-6xl mb-4">🤔</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-orange-500 mb-4">Oops!</h2>
            <p className={`text-lg sm:text-xl mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Not quite right! Remember:</p>
            <p className="text-base sm:text-lg text-blue-500 font-semibold mb-4">
              First comes E, then D, then C, then B, and finally A!
            </p>
            <button
              onClick={() => {
                setShowError(false);
                speak("Try again! You can drag the letters already on the track to rearrange them.");
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full text-base sm:text-lg transition-all"
            >
              Close and Try Again 💪
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-8 mt-4">
          <h1 className={`text-xl sm:text-3xl md:text-4xl font-bold ${isDark ? 'text-purple-300' : 'text-blue-800'} text-center w-full`}>
            🚂 Arrange the Letters (Reverse Order)! 🚂
          </h1>
        </div>

        <div className="mb-6 sm:mb-8 border-b-4 border-gray-600">
          <div className="flex items-center justify-center mb-4 sm:mb-6 pb-4 overflow-x-auto">
            <div
              key={gameId}
              className={`flex items-center gap-1 sm:gap-2 min-w-max px-4 ${trainMoving ? 'animate-move-forward' : ''}`}
            >
              <Engine />
              {droppedLetters.map((letter, index) => (
                <div
                  key={index}
                  className={`mx-0.5 sm:mx-1 transition-all duration-200 ${currentDroppedTarget === index ? 'scale-105' : ''}`}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onTouchMove={(e) => handleDragOver(e as unknown as React.DragEvent<HTMLDivElement>)}
                  onTouchEnd={(e) => handleDrop(e as unknown as React.DragEvent<HTMLDivElement>, index)}
                >
                  <LetterCar
                    letter={letter}
                    colors={letter !== null ? letterCarColors[letter] : {} as LetterCarColors}
                    isDropZone={true}
                    isEmpty={letter === null}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h2 className={`text-lg sm:text-2xl font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            Drag all 5 letters onto the track:
          </h2>

          <div className="flex justify-center gap-2 sm:gap-4 flex-wrap px-4">
            {gameLetters.map((letter) => (
              <LetterCar
                key={letter}
                letter={letter}
                colors={letterCarColors[letter]}
                isAvailable={true}
                isDragged={!draggedFromDroppedZone && draggedLetter === letter}
              />
            ))}
          </div>

          {gameLetters.length === 0 && droppedLetters.some(l => l === null) && (
            <p className={`text-base sm:text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              All letters are on the track. Now check your order!
            </p>
          )}

          {gameLetters.length === 0 && droppedLetters.every(l => l !== null) && !showSuccess && !showError && (
            <p className={`text-base sm:text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              All letters placed! Checking your answer... 🤔
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
          <button
            onClick={initializeGame}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
          >
            New Game 🎲
          </button>

          <button
            onClick={() => {
              if (isSpeaking) {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsSpeaking(false);
              } else {
                speak("Remember, arrange the letter cars in reverse order: Orange car with letter E first, then green car with D, yellow car with C, purple car with B, and finally pink car with A!");
              }
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 sm:px-6 rounded-full shadow-lg transform hover:scale-105 transition-all text-base sm:text-lg w-full sm:w-auto"
            disabled={!('speechSynthesis' in window)}
          >
            {isSpeaking ? '🔊 Stop Speaking' : '🔊 Help'}
          </button>
        </div>

        <div className={`text-center rounded-lg p-4 mx-4 sm:mx-0 shadow-inner ${
          isDark ? 'bg-gray-700 bg-opacity-70 text-gray-200' : 'bg-white bg-opacity-70 text-gray-700'
        }`}>
          <p className="text-sm sm:text-lg">
            <span className="font-bold">How to play:</span> Drag the colorful letter cars from the bottom to the empty spaces on the track in reverse order:
            <span className="inline-block mx-1">🧡E</span>
            <span className="inline-block mx-1">💚D</span>
            <span className="inline-block mx-1">💛C</span>
            <span className="inline-block mx-1">💜B</span>
            <span className="inline-block mx-1">🩷A</span> 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlphabetDescending;


