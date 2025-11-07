import React, { useState, useEffect } from 'react';

interface NumberCard {
  number: number;
  word: string;
  color: string;
  gradient: string;
  apples: number;
}

const numberData: NumberCard[] = [
  { number: 1, word: 'One', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500', apples: 1 },
  { number: 2, word: 'Two', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500', apples: 2 },
  { number: 3, word: 'Three', color: 'text-pink-600', gradient: 'from-pink-400 to-rose-500', apples: 3 },
  { number: 4, word: 'Four', color: 'text-amber-700', gradient: 'from-amber-400 to-orange-500', apples: 4 },
  { number: 5, word: 'Five', color: 'text-purple-600', gradient: 'from-purple-400 to-violet-500', apples: 5 },
  { number: 6, word: 'Six', color: 'text-indigo-600', gradient: 'from-indigo-400 to-blue-500', apples: 6 },
  { number: 7, word: 'Seven', color: 'text-teal-600', gradient: 'from-teal-400 to-cyan-500', apples: 7 },
  { number: 8, word: 'Eight', color: 'text-red-600', gradient: 'from-red-400 to-pink-500', apples: 8 },
  { number: 9, word: 'Nine', color: 'text-violet-600', gradient: 'from-violet-400 to-purple-500', apples: 9 },
  { number: 10, word: 'Ten', color: 'text-sky-600', gradient: 'from-sky-400 to-blue-500', apples: 10 },
];

const NumberIdentification: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedAppleGroup, setSelectedAppleGroup] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [shuffledAppleGroups, setShuffledAppleGroups] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const initializeGame = () => {
    // Shuffle apple groups
    const groups = numberData.map(item => item.apples);
    const shuffled = [...groups].sort(() => Math.random() - 0.5);
    setShuffledAppleGroups(shuffled);
    setMatchedPairs(new Set());
    setSelectedNumber(null);
    setSelectedAppleGroup(null);
    setGameStarted(true);
    setShowSuccess(false);
    setScore(0);
    setAttempts(0);
    speak("Welcome! Match each number with the correct group of apples. Click a number, then click the matching apple group!");
  };

  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, []);

  const handleNumberClick = (number: number) => {
    if (matchedPairs.has(number)) return; // Already matched
    
    if (selectedNumber === number) {
      setSelectedNumber(null);
    } else {
      setSelectedNumber(number);
      setSelectedAppleGroup(null);
      const word = numberData.find(item => item.number === number)?.word || '';
      speak(`You selected number ${number}, ${word}. Now click the group with ${number} apples.`);
    }
  };

  const handleAppleGroupClick = (appleCount: number) => {
    if (!selectedNumber) {
      speak("Please select a number first!");
      return;
    }

    setAttempts(prev => prev + 1);
    const correctCount = numberData.find(item => item.number === selectedNumber)?.apples;
    
    if (appleCount === correctCount) {
      // Correct match!
      setMatchedPairs(prev => new Set([...prev, selectedNumber]));
      setScore(prev => prev + 10);
      setShowCorrectAnimation(true);
      const word = numberData.find(item => item.number === selectedNumber)?.word || '';
      speak(`Excellent! ${selectedNumber} matches with ${appleCount} apples! ${word}!`);
      
      setTimeout(() => {
        setShowCorrectAnimation(false);
      }, 1000);

      setSelectedNumber(null);
      setSelectedAppleGroup(null);

      // Check if all matched
      if (matchedPairs.size + 1 === numberData.length) {
        setTimeout(() => {
          setShowSuccess(true);
          speak("Amazing! You matched all the numbers correctly! Great job!");
        }, 800);
      }
    } else {
      // Incorrect match
      setShowIncorrectAnimation(true);
      speak(`Oops! That's not correct. Number ${selectedNumber} should match with ${correctCount} apples. Try again!`);
      setSelectedAppleGroup(appleCount);
      
      setTimeout(() => {
        setShowIncorrectAnimation(false);
        setSelectedAppleGroup(null);
      }, 1200);
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const renderApples = (count: number, isMatched: boolean = false) => {
    return Array.from({ length: count }, (_, i) => (
      <span 
        key={i} 
        className={`text-2xl sm:text-3xl transition-all duration-300 ${
          isMatched ? 'animate-bounce' : 'hover:scale-125'
        }`}
        style={{ 
          animationDelay: isMatched ? `${i * 0.1}s` : '0s',
          display: 'inline-block'
        }}
      >
        🍎
      </span>
    ));
  };

  const progress = (matchedPairs.size / numberData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-yellow-50 p-4 sm:p-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Match the Correct Numbers
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 font-medium">Match each number with the correct group of apples!</p>
          
          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Progress</span>
              <span className="text-sm font-bold text-green-600">{matchedPairs.size} / {numberData.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Score Display */}
          <div className="mt-4 flex justify-center gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-green-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Score</div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-blue-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Attempts</div>
              <div className="text-2xl font-bold text-blue-600">{attempts}</div>
            </div>
          </div>
        </div>

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-md mx-4 transform animate-scaleIn border-4 border-green-400">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 mb-2 font-medium">You matched all the numbers correctly!</p>
              <p className="text-lg text-gray-600 mb-8">Final Score: <span className="font-bold text-green-600">{score}</span> points</p>
              <button
                onClick={handleReset}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Correct/Incorrect Animation Overlay */}
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

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Numbers Side */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Numbers</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {numberData.map((item) => {
                const isMatched = matchedPairs.has(item.number);
                const isSelected = selectedNumber === item.number;
                
                return (
                  <div
                    key={item.number}
                    onClick={() => handleNumberClick(item.number)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer 
                      transition-all duration-300 transform
                      ${isMatched 
                        ? 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-500 opacity-70 scale-95' 
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
                      {item.number}
                    </div>
                    <div className={`text-base sm:text-lg font-bold text-center ${item.color} opacity-90`}>
                      {item.word}
                    </div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl">
                        <div className="text-4xl animate-bounce">✓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apples Side */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Apple Groups</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {shuffledAppleGroups.map((appleCount, index) => {
                const isSelected = selectedAppleGroup === appleCount;
                const matchedNumber = Array.from(matchedPairs).find(num => 
                  numberData.find(item => item.number === num)?.apples === appleCount
                );
                const isMatched = matchedNumber !== undefined;
                const numberInfo = numberData.find(item => item.apples === appleCount);
                
                return (
                  <div
                    key={`${appleCount}-${index}`}
                    onClick={() => handleAppleGroupClick(appleCount)}
                    className={`
                      relative rounded-2xl border-3 p-5 sm:p-6 cursor-pointer 
                      transition-all duration-300 transform
                      ${isMatched
                        ? 'bg-gradient-to-br from-green-200 to-emerald-300 border-green-500 opacity-70 scale-95'
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
                    <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 min-h-[70px] sm:min-h-[90px]">
                      {renderApples(appleCount, isMatched)}
                    </div>
                    {isMatched && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-2xl">
                        <div className="text-4xl animate-bounce">✓</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instructions and Reset */}
        <div className="mt-10 sm:mt-12 text-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              💡 <span className="font-semibold">How to play:</span> Click a number, then click the matching apple group!
            </p>
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

export default NumberIdentification;
