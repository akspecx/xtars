import React, { useState, useCallback } from 'react';

interface CVCWord {
  word: string;
  image: string;
  letters: [string, string, string];
}

const cvcWords: CVCWord[] = [
  { word: 'CAT', image: '🐱', letters: ['C', 'A', 'T'] },
  { word: 'DOG', image: '🐶', letters: ['D', 'O', 'G'] },
  { word: 'SUN', image: '☀️', letters: ['S', 'U', 'N'] },
  { word: 'BUS', image: '🚌', letters: ['B', 'U', 'S'] },
  { word: 'HAT', image: '🎩', letters: ['H', 'A', 'T'] },
  { word: 'PIG', image: '🐷', letters: ['P', 'I', 'G'] },
  { word: 'BED', image: '🛏️', letters: ['B', 'E', 'D'] },
  { word: 'CUP', image: '☕', letters: ['C', 'U', 'P'] },
  { word: 'BAT', image: '🦇', letters: ['B', 'A', 'T'] },
  { word: 'PEN', image: '🖊️', letters: ['P', 'E', 'N'] }
];

const CVCWordBuilder: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState<string[]>(['', '', '']);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const currentWord = cvcWords[currentWordIndex];

  React.useEffect(() => {
    const letters = [...currentWord.letters];
    const extraLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !letters.includes(l)).sort(() => Math.random() - 0.5).slice(0, 3);
    setAvailableLetters([...letters, ...extraLetters].sort(() => Math.random() - 0.5));
    setBuiltWord(['', '', '']);
  }, [currentWordIndex]);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleLetterClick = (letter: string) => {
    const emptyIndex = builtWord.findIndex(l => l === '');
    if (emptyIndex !== -1) {
      const newBuiltWord = [...builtWord];
      newBuiltWord[emptyIndex] = letter;
      setBuiltWord(newBuiltWord);
      setAvailableLetters(prev => prev.filter(l => l !== letter));

      if (emptyIndex === 2) {
        const word = newBuiltWord.join('');
        if (word === currentWord.word) {
          setShowSuccess(true);
          setScore(prev => prev + 1);
          speak(`Perfect! You built ${word}!`);
          setTimeout(() => {
            setShowSuccess(false);
            if (currentWordIndex < cvcWords.length - 1) {
              setCurrentWordIndex(prev => prev + 1);
            } else {
              setCurrentWordIndex(0);
            }
          }, 2500);
        } else {
          speak(`Not quite! Try again!`);
          setTimeout(() => {
            setAvailableLetters(prev => [...prev, ...newBuiltWord]);
            setBuiltWord(['', '', '']);
          }, 1500);
        }
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (builtWord[index]) {
      setAvailableLetters(prev => [...prev, builtWord[index]]);
      const newBuiltWord = [...builtWord];
      newBuiltWord[index] = '';
      setBuiltWord(newBuiltWord);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 text-center mb-6">🏗️ CVC Word Builder</h1>
        
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
        </div>

        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 text-center">
          <div className="text-8xl mb-3">{currentWord.image}</div>
          <p className="text-2xl font-bold text-gray-700">Build this word!</p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {builtWord.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleRemoveLetter(index)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-4 border-dashed border-gray-400 flex items-center justify-center text-4xl font-extrabold text-gray-800 hover:bg-gray-50 transition-all"
            >
              {letter || '?'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {availableLetters.map((letter, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(letter)}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 text-white text-3xl font-extrabold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
            >
              {letter}
            </button>
          ))}
        </div>

        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-white">Perfect! You built {currentWord.word}!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVCWordBuilder;

