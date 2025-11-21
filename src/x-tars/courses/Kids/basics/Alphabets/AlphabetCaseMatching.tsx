import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface LetterPair {
  uppercase: string;
  lowercase: string;
  color: string;
  gradient: string;
}

const letterPairs: LetterPair[] = [
  { uppercase: 'A', lowercase: 'a', color: 'text-red-600', gradient: 'from-red-400 to-pink-500' },
  { uppercase: 'B', lowercase: 'b', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500' },
  { uppercase: 'C', lowercase: 'c', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500' },
  { uppercase: 'D', lowercase: 'd', color: 'text-yellow-600', gradient: 'from-yellow-400 to-amber-500' },
  { uppercase: 'E', lowercase: 'e', color: 'text-purple-600', gradient: 'from-purple-400 to-violet-500' },
];

const AlphabetCaseMatching: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedUppercase, setSelectedUppercase] = useState<string | null>(null);
  const [selectedLowercase, setSelectedLowercase] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [shuffledUppercase, setShuffledUppercase] = useState<string[]>([]);
  const [shuffledLowercase, setShuffledLowercase] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const welcomeMessage = "Welcome! Match uppercase letters with their lowercase partners. Click an uppercase letter, then click the matching lowercase letter.";

  const letterPairMap = useMemo(() => {
    const map = new Map<string, LetterPair>();
    letterPairs.forEach((pair) => {
      map.set(pair.uppercase, pair);
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
    const uppercase = letterPairs.map(p => p.uppercase);
    const lowercase = letterPairs.map(p => p.lowercase);
    const shuffledUpper = [...uppercase].sort(() => Math.random() - 0.5);
    const shuffledLower = [...lowercase].sort(() => Math.random() - 0.5);
    setShuffledUppercase(shuffledUpper);
    setShuffledLowercase(shuffledLower);
    setMatchedPairs(new Set());
    setSelectedUppercase(null);
    setSelectedLowercase(null);
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

  const handleUppercaseClick = (letter: string) => {
    if (matchedPairs.has(letter)) return;

    if (selectedUppercase === letter) {
      setSelectedUppercase(null);
    } else {
      setSelectedUppercase(letter);
      setSelectedLowercase(null);
      speak(`You selected uppercase ${letter}. Now click the matching lowercase letter.`);
    }
  };

  const handleLowercaseClick = (letter: string) => {
    if (!selectedUppercase) {
      speak("Please select an uppercase letter first!");
      return;
    }

    setAttempts(prev => prev + 1);
    const pair = letterPairMap.get(selectedUppercase);
    const isCorrect = pair?.lowercase === letter;

    if (isCorrect) {
      setMatchedPairs(prev => {
        const next = new Set(prev);
        next.add(selectedUppercase);
        return next;
      });
      setScore(prev => prev + 10);
      setShowCorrectAnimation(true);
      speak(`Excellent! Uppercase ${selectedUppercase} matches with lowercase ${letter}! Great job!`);

      setTimeout(() => {
        setShowCorrectAnimation(false);
      }, 1000);

      setSelectedUppercase(null);
      setSelectedLowercase(null);

      if (matchedPairs.size + 1 === letterPairs.length) {
        setTimeout(() => {
          setShowSuccess(true);
          speak("Amazing! You matched all the letter pairs correctly! Great job!");
        }, 800);
      }
    } else {
      setShowIncorrectAnimation(true);
      const correctLowercase = pair?.lowercase || '';
      speak(`Oops! That's not correct. Uppercase ${selectedUppercase} should match with lowercase ${correctLowercase}. Try again!`);
      setSelectedLowercase(letter);

      setTimeout(() => {
        setShowIncorrectAnimation(false);
        setSelectedLowercase(null);
      }, 1200);
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const progress = (matchedPairs.size / letterPairs.length) * 100;

  const getLetterPair = (letter: string, isUppercase: boolean): LetterPair | undefined => {
    if (isUppercase) {
      return letterPairMap.get(letter);
    } else {
      return letterPairs.find(p => p.lowercase === letter);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Match Uppercase & Lowercase
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 font-medium">Match each uppercase letter with its lowercase partner!</p>

          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-blue-600">{matchedPairs.size} / {letterPairs.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-blue-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Score</div>
              <div className="text-2xl font-bold text-blue-600">{score}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-indigo-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Attempts</div>
              <div className="text-2xl font-bold text-indigo-600">{attempts}</div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-md mx-4 transform animate-scaleIn border-4 border-blue-400">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 mb-2 font-medium">You matched all the letter pairs correctly!</p>
              <p className="text-lg text-gray-600 mb-8">Final Score: <span className="font-bold text-blue-600">{score}</span> points</p>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Uppercase Letters</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {shuffledUppercase.map((letter) => {
                const isMatched = matchedPairs.has(letter);
                const isSelected = selectedUppercase === letter;
                const pair = getLetterPair(letter, true);

                return (
                  <div
                    key={letter}
                    onClick={() => handleUppercaseClick(letter)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer
                      transition-all duration-300 transform
                      ${isMatched
                        ? 'bg-gradient-to-br from-blue-200 to-indigo-300 border-blue-500 opacity-70 scale-95'
                        : isSelected
                        ? `bg-gradient-to-br ${pair?.gradient || 'from-gray-400 to-gray-500'} border-4 border-blue-500 scale-110 shadow-2xl ring-4 ring-blue-300`
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                    )}
                    <div className={`text-5xl sm:text-6xl font-extrabold mb-2 text-center ${pair?.color || 'text-gray-600'} drop-shadow-md`}>
                      {letter}
                    </div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-2xl">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Lowercase Letters</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {shuffledLowercase.map((letter) => {
                const isSelected = selectedLowercase === letter;
                const pair = getLetterPair(letter, false);
                const matchedUppercase = Array.from(matchedPairs).find(uppercase => {
                  const upperPair = letterPairMap.get(uppercase);
                  return upperPair?.lowercase === letter;
                });
                const isMatched = matchedUppercase !== undefined;

                return (
                  <div
                    key={letter}
                    onClick={() => handleLowercaseClick(letter)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer
                      transition-all duration-300 transform
                      ${isMatched
                        ? 'bg-gradient-to-br from-blue-200 to-indigo-300 border-blue-500 opacity-70 scale-95'
                        : isSelected
                        ? 'bg-gradient-to-br from-indigo-200 to-purple-300 border-4 border-indigo-500 scale-110 shadow-2xl ring-4 ring-indigo-300 animate-shake'
                        : 'bg-white border-gray-300 hover:border-gray-400 hover:shadow-xl hover:scale-105 active:scale-95'
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-sm font-bold">?</span>
                      </div>
                    )}
                    <div className={`text-5xl sm:text-6xl font-extrabold mb-2 text-center ${pair?.color || 'text-gray-600'} drop-shadow-md`}>
                      {letter}
                    </div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 rounded-2xl">
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
              💡 <span className="font-semibold">How to play:</span> Click an uppercase letter, then click the matching lowercase letter!
            </p>
            <button
              onClick={handlePlayInstructions}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold text-base hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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

export default AlphabetCaseMatching;

