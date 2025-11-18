import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface LetterCard {
  letter: string;
  word: string;
  color: string;
  gradient: string;
  objects: string[];
}

interface ObjectGroup {
  id: string;
  object: string;
  emoji: string;
}

const letterData: LetterCard[] = [
  { letter: 'A', word: 'Apple', color: 'text-red-600', gradient: 'from-red-400 to-pink-500', objects: ['Apple', 'Ant', 'Airplane'] },
  { letter: 'B', word: 'Ball', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500', objects: ['Ball', 'Bear', 'Book'] },
  { letter: 'C', word: 'Cat', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500', objects: ['Cat', 'Car', 'Cake'] },
  { letter: 'D', word: 'Dog', color: 'text-yellow-600', gradient: 'from-yellow-400 to-amber-500', objects: ['Dog', 'Duck', 'Drum'] },
  { letter: 'E', word: 'Elephant', color: 'text-purple-600', gradient: 'from-purple-400 to-violet-500', objects: ['Elephant', 'Egg', 'Eagle'] },
];

const objectEmojis: Record<string, string> = {
  'Apple': '🍎',
  'Ant': '🐜',
  'Airplane': '✈️',
  'Ball': '⚽',
  'Bear': '🐻',
  'Book': '📚',
  'Cat': '🐱',
  'Car': '🚗',
  'Cake': '🎂',
  'Dog': '🐶',
  'Duck': '🦆',
  'Drum': '🥁',
  'Elephant': '🐘',
  'Egg': '🥚',
  'Eagle': '🦅',
};

const AlphabetObjectMatching: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedObjectGroup, setSelectedObjectGroup] = useState<ObjectGroup | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shuffledObjectGroups, setShuffledObjectGroups] = useState<ObjectGroup[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const welcomeMessage = "Welcome! Identify and match each letter with objects that start with that letter. Click a letter, then click a matching object.";

  const letterCardMap = useMemo(() => {
    const map = new Map<string, LetterCard>();
    letterData.forEach((item) => {
      map.set(item.letter, item);
    });
    return map;
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined' &&
        !isSpeaking
      ) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const initializeGame = useCallback(() => {
    const allObjects: ObjectGroup[] = [];
    letterData.forEach((letterCard, cardIndex) => {
      letterCard.objects.forEach((obj, objIndex) => {
        allObjects.push({
          id: `${letterCard.letter}-${cardIndex}-${objIndex}`,
          object: obj,
          emoji: objectEmojis[obj] || '❓',
        });
      });
    });
    const shuffled = [...allObjects].sort(() => Math.random() - 0.5);
    setShuffledObjectGroups(shuffled);
    setMatchedPairs(new Set());
    setSelectedLetter(null);
    setSelectedObjectGroup(null);
    setGameStarted(true);
    setShowSuccess(false);
    setScore(0);
    setAttempts(0);
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, [gameStarted, initializeGame]);

  const handlePlayInstructions = () => {
    speak(welcomeMessage);
  };

  const handleLetterClick = (letter: string) => {
    if (matchedPairs.has(letter)) return;

    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      setSelectedObjectGroup(null);
      const word = letterCardMap.get(letter)?.word || '';
      speak(`You selected letter ${letter}, for ${word}. Now click an object that starts with ${letter}.`);
    }
  };

  const handleObjectGroupClick = (group: ObjectGroup) => {
    if (!selectedLetter) {
      speak("Please select a letter first!");
      return;
    }

    setAttempts(prev => prev + 1);
    const correctObjects = letterCardMap.get(selectedLetter)?.objects || [];
    const isCorrect = correctObjects.includes(group.object);

    if (isCorrect) {
      setMatchedPairs(prev => {
        const next = new Set(prev);
        next.add(selectedLetter);
        return next;
      });
      setScore(prev => prev + 10);
      setShowCorrectAnimation(true);
      speak(`Excellent! ${group.object} starts with ${selectedLetter}! Great job!`);

      setTimeout(() => {
        setShowCorrectAnimation(false);
      }, 1000);

      setSelectedLetter(null);
      setSelectedObjectGroup(null);

      if (matchedPairs.size + 1 === letterData.length) {
        setTimeout(() => {
          setShowSuccess(true);
          speak("Amazing! You matched all the letters correctly! Great job!");
        }, 800);
      }
    } else {
      setShowIncorrectAnimation(true);
      const correctObjectsList = correctObjects.join(', ');
      speak(`Oops! That's not correct. Letter ${selectedLetter} should match with objects like ${correctObjectsList}. Try again!`);
      setSelectedObjectGroup(group);

      setTimeout(() => {
        setShowIncorrectAnimation(false);
        setSelectedObjectGroup(null);
      }, 1200);
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const progress = (matchedPairs.size / letterData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Match Letters with Objects
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 font-medium">Match each letter with objects that start with that letter!</p>

          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-purple-600">{matchedPairs.size} / {letterData.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-purple-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Score</div>
              <div className="text-2xl font-bold text-purple-600">{score}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-pink-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Attempts</div>
              <div className="text-2xl font-bold text-pink-600">{attempts}</div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-md mx-4 transform animate-scaleIn border-4 border-purple-400">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 mb-2 font-medium">You matched all the letters correctly!</p>
              <p className="text-lg text-gray-600 mb-8">Final Score: <span className="font-bold text-purple-600">{score}</span> points</p>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {showCorrectAnimation && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="text-8xl animate-ping">✓</div>
          </div>
        )}
        {showIncorrectAnimation && (
          <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
            <div className="text-8xl text-red-500 animate-pulse">✗</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Letters</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {letterData.map((item) => {
                const isMatched = matchedPairs.has(item.letter);
                const isSelected = selectedLetter === item.letter;

                return (
                  <div
                    key={item.letter}
                    onClick={() => handleLetterClick(item.letter)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer
                      transition-all duration-300 transform
                      ${isMatched
                        ? 'bg-gradient-to-br from-purple-200 to-pink-300 border-purple-500 opacity-70 scale-95'
                        : isSelected
                        ? `bg-gradient-to-br ${item.gradient} border-4 border-blue-500 scale-110 shadow-2xl ring-4 ring-blue-300`
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                    <div className={`text-5xl sm:text-6xl font-extrabold mb-2 text-center ${item.color} drop-shadow-md`}>
                      {item.letter}
                    </div>
                    <div className={`text-base sm:text-lg font-bold text-center ${item.color} opacity-90`}>
                      {item.word}
                    </div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20 rounded-2xl">
                        <div className="text-4xl animate-bounce">✓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Objects</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {shuffledObjectGroups.map((group) => {
                const isSelected = selectedObjectGroup?.id === group.id;
                const matchedLetter = Array.from(matchedPairs).find(letter => {
                  const letterCard = letterCardMap.get(letter);
                  return letterCard?.objects.includes(group.object);
                });
                const isMatched = matchedLetter !== undefined;

                return (
                  <div
                    key={group.id}
                    onClick={() => handleObjectGroupClick(group)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer
                      transition-all duration-300 transform
                      ${isMatched
                        ? 'bg-gradient-to-br from-purple-200 to-pink-300 border-purple-500 opacity-70 scale-95'
                        : isSelected
                        ? 'bg-gradient-to-br from-red-200 to-pink-300 border-4 border-red-500 scale-110 shadow-2xl ring-4 ring-red-300 animate-shake'
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm font-bold">?</span>
                      </div>
                    )}
                    <div className="text-5xl sm:text-6xl mb-2 text-center">{group.emoji}</div>
                    <div className="text-base sm:text-lg font-bold text-center text-gray-700">{group.object}</div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20 rounded-2xl">
                        <div className="text-4xl animate-bounce">✓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 sm:mt-12 text-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              💡 <span className="font-semibold">How to play:</span> Click a letter, then click an object that starts with that letter!
            </p>
            <button
              onClick={handlePlayInstructions}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-base hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>🔊</span>
              <span>Play Instructions</span>
            </button>
          </div>
          <button
            onClick={handleReset}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
          >
            🔄 Reset Game
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AlphabetObjectMatching;

