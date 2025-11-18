import React, { useState, useEffect, useCallback, useMemo } from 'react';

interface LetterCard {
  letter: string;
  color: string;
  gradient: string;
  isVowel: boolean;
  hasCurves: boolean;
}

const letterData: LetterCard[] = [
  { letter: 'A', color: 'text-red-600', gradient: 'from-red-400 to-pink-500', isVowel: true, hasCurves: false },
  { letter: 'B', color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500', isVowel: false, hasCurves: true },
  { letter: 'C', color: 'text-green-600', gradient: 'from-green-400 to-emerald-500', isVowel: false, hasCurves: true },
  { letter: 'D', color: 'text-yellow-600', gradient: 'from-yellow-400 to-amber-500', isVowel: false, hasCurves: true },
  { letter: 'E', color: 'text-purple-600', gradient: 'from-purple-400 to-violet-500', isVowel: true, hasCurves: false },
];

type SortMode = 'vowels' | 'curves';

const AlphabetSorting: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('vowels');
  const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
  const [vowelBin, setVowelBin] = useState<string[]>([]);
  const [consonantBin, setConsonantBin] = useState<string[]>([]);
  const [curvesBin, setCurvesBin] = useState<string[]>([]);
  const [straightBin, setStraightBin] = useState<string[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const welcomeMessage = "Welcome! Sort letters into the correct bins. Drag letters to sort them by vowels and consonants, or by curves and straight lines.";

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
    const letters = letterData.map(l => l.letter);
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setVowelBin([]);
    setConsonantBin([]);
    setCurvesBin([]);
    setStraightBin([]);
    setDraggedLetter(null);
    setGameStarted(true);
    setShowSuccess(false);
    setScore(0);
  }, []);

  useEffect(() => {
    if (!gameStarted) {
      initializeGame();
    }
  }, [gameStarted, initializeGame]);

  useEffect(() => {
    if (gameStarted) {
      checkCompletion();
    }
  }, [vowelBin, consonantBin, curvesBin, straightBin, gameStarted]);

  const handlePlayInstructions = () => {
    speak(welcomeMessage);
  };

  const handleDragStart = (letter: string) => {
    setDraggedLetter(letter);
    speak(`You picked letter ${letter}. Drag it to the correct bin!`);
  };

  const handleDragEnd = () => {
    setDraggedLetter(null);
  };

  const handleDrop = (binType: 'vowel' | 'consonant' | 'curves' | 'straight') => {
    if (!draggedLetter) return;

    const letterCard = letterCardMap.get(draggedLetter);
    if (!letterCard) return;

    const newShuffled = shuffledLetters.filter(l => l !== draggedLetter);
    setShuffledLetters(newShuffled);

    let isCorrect = false;
    if (sortMode === 'vowels') {
      if (binType === 'vowel' && letterCard.isVowel) {
        setVowelBin(prev => [...prev, draggedLetter]);
        isCorrect = true;
      } else if (binType === 'consonant' && !letterCard.isVowel) {
        setConsonantBin(prev => [...prev, draggedLetter]);
        isCorrect = true;
      }
    } else {
      if (binType === 'curves' && letterCard.hasCurves) {
        setCurvesBin(prev => [...prev, draggedLetter]);
        isCorrect = true;
      } else if (binType === 'straight' && !letterCard.hasCurves) {
        setStraightBin(prev => [...prev, draggedLetter]);
        isCorrect = true;
      }
    }

    if (isCorrect) {
      setScore(prev => prev + 10);
      speak(`Great! Letter ${draggedLetter} is correct!`);
    } else {
      setShuffledLetters(prev => [...prev, draggedLetter]);
      speak(`Oops! That's not the right bin for letter ${draggedLetter}. Try again!`);
    }

    setDraggedLetter(null);
  };

  const checkCompletion = () => {
    if (sortMode === 'vowels') {
      const totalSorted = vowelBin.length + consonantBin.length;
      if (totalSorted === letterData.length && shuffledLetters.length === 0) {
        setTimeout(() => {
          setShowSuccess(true);
          speak("Amazing! You sorted all the letters correctly! Great job!");
        }, 500);
      }
    } else {
      const totalSorted = curvesBin.length + straightBin.length;
      if (totalSorted === letterData.length && shuffledLetters.length === 0) {
        setTimeout(() => {
          setShowSuccess(true);
          speak("Amazing! You sorted all the letters correctly! Great job!");
        }, 500);
      }
    }
  };

  const handleReset = () => {
    initializeGame();
  };

  const handleModeChange = (mode: SortMode) => {
    setSortMode(mode);
    initializeGame();
  };

  const renderBin = (binType: 'vowel' | 'consonant' | 'curves' | 'straight', letters: string[], label: string, emoji: string, color: string) => {
    return (
      <div
        className={`min-h-[200px] rounded-2xl border-4 border-dashed ${color} p-4 transition-all duration-300 ${
          draggedLetter ? 'border-solid scale-105' : ''
        }`}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleDrop(binType);
        }}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{emoji}</div>
          <div className={`text-xl font-bold ${color.replace('border-', 'text-')}`}>{label}</div>
        </div>
        <div className="flex flex-wrap gap-3 justify-center min-h-[100px]">
          {letters.map((letter) => {
            const letterCard = letterCardMap.get(letter);
            return (
              <div
                key={letter}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br ${letterCard?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-lg`}
              >
                {letter}
              </div>
            );
          })}
          {letters.length === 0 && (
            <div className={`text-sm ${color.replace('border-', 'text-')} opacity-50`}>Drop letters here</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Sort the Letters
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 font-medium">Sort letters into the correct bins!</p>

          <div className="mt-6 flex justify-center gap-4 mb-6">
            <button
              onClick={() => handleModeChange('vowels')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                sortMode === 'vowels'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vowels & Consonants
            </button>
            <button
              onClick={() => handleModeChange('curves')}
              className={`px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                sortMode === 'curves'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Curves & Straight
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg border-2 border-green-200">
              <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Score</div>
              <div className="text-2xl font-bold text-green-600">{score}</div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-2xl max-w-md mx-4 transform animate-scaleIn border-4 border-green-400">
              <div className="text-7xl mb-6 animate-bounce">🎉</div>
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                Congratulations!
              </h2>
              <p className="text-xl text-gray-700 mb-2 font-medium">You sorted all the letters correctly!</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {sortMode === 'vowels' ? (
            <>
              {renderBin('vowel', vowelBin, 'Vowels', '🔤', 'border-purple-500')}
              {renderBin('consonant', consonantBin, 'Consonants', '📝', 'border-blue-500')}
            </>
          ) : (
            <>
              {renderBin('curves', curvesBin, 'Curves', '🌀', 'border-pink-500')}
              {renderBin('straight', straightBin, 'Straight', '📏', 'border-orange-500')}
            </>
          )}
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Drag letters to sort:</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {shuffledLetters.map((letter) => {
              const letterCard = letterCardMap.get(letter);
              return (
                <div
                  key={letter}
                  draggable
                  onDragStart={() => handleDragStart(letter)}
                  onDragEnd={handleDragEnd}
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br ${letterCard?.gradient || 'from-gray-400 to-gray-500'} flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 transition-transform ${
                    draggedLetter === letter ? 'opacity-50 scale-90' : ''
                  }`}
                >
                  {letter}
                </div>
              );
            })}
            {shuffledLetters.length === 0 && (
              <div className="text-gray-500 text-lg">All letters sorted! 🎉</div>
            )}
          </div>
        </div>

        <div className="mt-10 sm:mt-12 text-center space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 border-gray-200 max-w-2xl mx-auto">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              💡 <span className="font-semibold">How to play:</span> Drag letters from the bottom to the correct bins above!
            </p>
            <button
              onClick={handlePlayInstructions}
              className="mt-4 inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-base hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
      `}</style>
    </div>
  );
};

export default AlphabetSorting;

