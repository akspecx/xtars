import React, { useState, useCallback } from 'react';

interface Letter {
  char: string;
  size: 'big' | 'small';
  color: string;
}

const generateLetters = (): Letter[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const colors = ['text-red-600', 'text-blue-600', 'text-green-600', 'text-purple-600', 'text-pink-600', 'text-yellow-600', 'text-indigo-600', 'text-teal-600'];
  const result: Letter[] = [];
  
  for (let i = 0; i < 10; i++) {
    const char = letters[Math.floor(Math.random() * letters.length)];
    const size = Math.random() > 0.5 ? 'big' : 'small';
    const color = colors[Math.floor(Math.random() * colors.length)];
    result.push({ char, size, color });
  }
  
  return result.sort(() => Math.random() - 0.5);
};

const LetterSizeSorting: React.FC = () => {
  const [letters, setLetters] = useState<Letter[]>(generateLetters());
  const [bigBasket, setBigBasket] = useState<Letter[]>([]);
  const [smallBasket, setSmallBasket] = useState<Letter[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

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

  const handleDragStart = (e: React.DragEvent, letter: Letter) => {
    setDraggedLetter(letter);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (e: React.TouchEvent, letter: Letter) => {
    setDraggedLetter(letter);
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, basket: 'big' | 'small') => {
    e.preventDefault();
    if (draggedLetter) {
      processLetterDrop(draggedLetter, basket);
    }
    setDraggedLetter(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, basket: 'big' | 'small') => {
    if (draggedLetter) {
      processLetterDrop(draggedLetter, basket);
    }
    setDraggedLetter(null);
    e.preventDefault();
  };

  const processLetterDrop = (letter: Letter, basket: 'big' | 'small') => {
    if (letter.size === basket) {
      setLetters(prev => prev.filter(l => l !== letter));
      if (basket === 'big') {
        setBigBasket(prev => [...prev, letter]);
      } else {
        setSmallBasket(prev => [...prev, letter]);
      }
      speak(`Correct! That's a ${basket} letter ${letter.char}!`);
      setScore(prev => prev + 1);

      setTimeout(() => {
        const remaining = letters.filter(l => l !== letter);
        if (remaining.length === 0) {
          setShowSuccess(true);
          speak('Amazing! You sorted all the letters!');
          setTimeout(() => {
            setLetters(generateLetters());
            setBigBasket([]);
            setSmallBasket([]);
            setShowSuccess(false);
          }, 3000);
        }
      }, 100);
    } else {
      setShowError(true);
      setErrorMessage(`That's a ${letter.size} letter, not ${basket}!`);
      speak(`Oops! That's a ${letter.size} letter!`);
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-orange-700 flex items-center gap-2">
              <span>📐 Letter Size Sorting</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Sort letters by size!</p>
          </div>
          <button
            onClick={() => speak('Drag big letters to the BIG basket and small letters to the small basket!')}
            className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔊 Instructions
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-3">Letters to Sort ({letters.length} left)</h3>
          <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-50 rounded-2xl min-h-[120px]">
            {letters.map((letter, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                onTouchStart={(e) => handleTouchStart(e, letter)}
                className={`cursor-grab active:cursor-grabbing transform hover:scale-110 transition-all ${
                  draggedLetter === letter ? 'opacity-50 scale-90' : ''
                }`}
              >
                <div className={`font-extrabold ${letter.color} ${letter.size === 'big' ? 'text-7xl' : 'text-4xl'}`}>
                  {letter.char}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'big')}
            onTouchEnd={(e) => handleTouchEnd(e, 'big')}
            className="p-6 rounded-2xl bg-gradient-to-br from-blue-200 to-cyan-300 border-4 border-dashed border-blue-500 hover:border-blue-700 transition-all"
          >
            <div className="text-center mb-4">
              <div className="text-6xl mb-2">🧺</div>
              <div className="text-4xl font-extrabold text-blue-800">BIG</div>
            </div>
            <div className="bg-white rounded-xl p-4 min-h-[150px] flex flex-wrap justify-center items-center gap-3">
              {bigBasket.map((letter, i) => (
                <div key={i} className={`font-extrabold text-7xl ${letter.color}`}>{letter.char}</div>
              ))}
            </div>
            <div className="text-center mt-2 font-bold text-blue-800">{bigBasket.length} letter{bigBasket.length !== 1 ? 's' : ''}</div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'small')}
            onTouchEnd={(e) => handleTouchEnd(e, 'small')}
            className="p-6 rounded-2xl bg-gradient-to-br from-pink-200 to-rose-300 border-4 border-dashed border-pink-500 hover:border-pink-700 transition-all"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🧺</div>
              <div className="text-2xl font-extrabold text-pink-800">small</div>
            </div>
            <div className="bg-white rounded-xl p-4 min-h-[150px] flex flex-wrap justify-center items-center gap-2">
              {smallBasket.map((letter, i) => (
                <div key={i} className={`font-extrabold text-4xl ${letter.color}`}>{letter.char}</div>
              ))}
            </div>
            <div className="text-center mt-2 font-bold text-pink-800">{smallBasket.length} letter{smallBasket.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl font-extrabold text-white">Perfect! All letters sorted!</div>
          </div>
        )}

        {showError && (
          <div className="text-center p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
            <div className="text-xl font-bold text-white">{errorMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LetterSizeSorting;

