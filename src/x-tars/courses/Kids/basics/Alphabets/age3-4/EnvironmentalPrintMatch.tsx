import React, { useState, useCallback } from 'react';

interface Brand {
  id: string;
  name: string;
  firstLetter: string;
  emoji: string;
  color: string;
  category: string;
}

const brands: Brand[] = [
  { id: 'm1', name: "McDonald's", firstLetter: 'M', emoji: '🍔', color: 'from-yellow-400 to-red-500', category: 'Food' },
  { id: 'p1', name: 'Pizza Hut', firstLetter: 'P', emoji: '🍕', color: 'from-red-500 to-orange-500', category: 'Food' },
  { id: 's1', name: 'Starbucks', firstLetter: 'S', emoji: '☕', color: 'from-green-600 to-emerald-700', category: 'Drinks' },
  { id: 't1', name: 'Target', firstLetter: 'T', emoji: '🎯', color: 'from-red-500 to-red-700', category: 'Store' },
  { id: 'w1', name: 'Walmart', firstLetter: 'W', emoji: '🏪', color: 'from-blue-500 to-blue-700', category: 'Store' },
  { id: 'a1', name: 'Apple', firstLetter: 'A', emoji: '🍎', color: 'from-gray-600 to-gray-800', category: 'Tech' },
  { id: 'd1', name: 'Disney', firstLetter: 'D', emoji: '🏰', color: 'from-blue-400 to-purple-500', category: 'Entertainment' },
  { id: 'n1', name: 'Nike', firstLetter: 'N', emoji: '👟', color: 'from-orange-500 to-red-600', category: 'Sports' },
  { id: 'l1', name: 'Lego', firstLetter: 'L', emoji: '🧱', color: 'from-red-500 to-yellow-500', category: 'Toys' },
  { id: 'c1', name: 'Coca-Cola', firstLetter: 'C', emoji: '🥤', color: 'from-red-600 to-red-800', category: 'Drinks' }
];

const EnvironmentalPrintMatch: React.FC = () => {
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentBrand = brands[currentBrandIndex];
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setAttempts(prev => prev + 1);

    if (letter === currentBrand.firstLetter) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(prev => prev + 1);
      speak(`Correct! ${currentBrand.name} starts with letter ${letter}!`);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedLetter(null);
        if (currentBrandIndex < brands.length - 1) {
          setCurrentBrandIndex(prev => prev + 1);
        } else {
          setCurrentBrandIndex(0);
        }
      }, 2000);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      speak(`Not quite! Try again!`);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedLetter(null);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-cyan-700 flex items-center gap-2">
              <span>🏪 Environmental Print Match</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Match brands with their first letter!</p>
          </div>
          <button
            onClick={() => speak(`What letter does ${currentBrand.name} start with?`)}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔊 Instructions
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Attempts: {attempts}
          </div>
        </div>

        <div className={`mb-6 p-8 rounded-3xl bg-gradient-to-br ${currentBrand.color} text-center`}>
          <div className="text-8xl mb-4">{currentBrand.emoji}</div>
          <div className="text-4xl font-extrabold text-white mb-2">{currentBrand.name}</div>
          <div className="text-xl font-semibold text-white bg-black bg-opacity-20 inline-block px-4 py-2 rounded-full">
            {currentBrand.category}
          </div>
        </div>

        <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            What letter does {currentBrand.name} start with?
          </h2>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterSelect(letter)}
              disabled={showFeedback}
              className={`aspect-square rounded-xl transition-all transform ${
                selectedLetter === letter
                  ? isCorrect
                    ? 'bg-green-500 text-white scale-110'
                    : 'bg-red-500 text-white scale-110'
                  : 'bg-gradient-to-br from-white to-gray-100 text-gray-800 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-extrabold text-lg sm:text-xl`}
            >
              {letter}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl ${
            isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' : 'bg-gradient-to-r from-red-400 to-pink-500'
          }`}>
            <div className="text-6xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
            <div className="text-2xl font-extrabold text-white">
              {isCorrect ? `Correct! ${currentBrand.name} starts with ${currentBrand.firstLetter}!` : 'Try again!'}
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-center gap-2">
          {brands.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBrandIndex ? 'bg-cyan-600 w-6' : index < currentBrandIndex ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalPrintMatch;

