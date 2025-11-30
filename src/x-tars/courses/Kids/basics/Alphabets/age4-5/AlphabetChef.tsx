import React, { useState, useCallback } from 'react';

const recipes = [
  { food: 'EGG', emoji: '🥚', letters: ['E', 'G', 'G'] },
  { food: 'PIE', emoji: '🥧', letters: ['P', 'I', 'E'] },
  { food: 'HAM', emoji: '🍖', letters: ['H', 'A', 'M'] },
  { food: 'BUN', emoji: '🍔', letters: ['B', 'U', 'N'] },
  { food: 'TEA', emoji: '🍵', letters: ['T', 'E', 'A'] }
];

const AlphabetChef: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const current = recipes[currentIndex];

  React.useEffect(() => {
    const extra = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(l => !current.letters.includes(l)).sort(() => Math.random() - 0.5).slice(0, 3);
    setAvailableLetters([...current.letters, ...extra].sort(() => Math.random() - 0.5));
    setBuiltWord([]);
  }, [currentIndex]);

  const handleLetterClick = (letter: string) => {
    if (builtWord.length < current.letters.length) {
      setBuiltWord([...builtWord, letter]);
      setAvailableLetters(prev => prev.filter(l => l !== letter));
      
      if (builtWord.length + 1 === current.letters.length) {
        const word = [...builtWord, letter].join('');
        if (word === current.food) {
          setShowSuccess(true);
          setScore(prev => prev + 1);
          setTimeout(() => {
            setShowSuccess(false);
            setCurrentIndex((currentIndex + 1) % recipes.length);
          }, 2000);
        } else {
          setTimeout(() => {
            setAvailableLetters(prev => [...prev, ...builtWord, letter]);
            setBuiltWord([]);
          }, 1000);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-rose-700 text-center mb-6">👨‍🍳 Alphabet Chef</h1>
        <div className="text-center mb-6"><div className="inline-block px-6 py-2 bg-gradient-to-r from-rose-400 to-pink-400 text-white rounded-full font-bold text-lg">Score: {score}</div></div>
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
          <div className="text-8xl mb-3">{current.emoji}</div>
          <p className="text-2xl font-bold">Spell: {current.food}</p>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {builtWord.map((l, i) => <div key={i} className="w-16 h-16 rounded-xl bg-green-400 text-white text-3xl font-bold flex items-center justify-center">{l}</div>)}
          {Array.from({ length: current.letters.length - builtWord.length }).map((_, i) => <div key={i} className="w-16 h-16 rounded-xl border-4 border-dashed border-gray-400 flex items-center justify-center text-3xl">?</div>)}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {availableLetters.map((l, i) => <button key={i} onClick={() => handleLetterClick(l)} className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 text-white text-3xl font-bold hover:scale-105 active:scale-95 transition-all">{l}</button>)}
        </div>
        {showSuccess && <div className="mt-6 text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"><div className="text-6xl mb-2">🎉</div><div className="text-3xl font-extrabold text-white">Delicious! You cooked {current.food}!</div></div>}
      </div>
    </div>
  );
};

export default AlphabetChef;

