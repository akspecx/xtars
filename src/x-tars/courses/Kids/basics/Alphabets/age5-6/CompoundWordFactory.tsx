import React, { useState } from 'react';

const compounds = [
  { word1: 'sun', word2: 'flower', compound: 'sunflower', emoji: '🌻' },
  { word1: 'rain', word2: 'bow', compound: 'rainbow', emoji: '🌈' },
  { word1: 'butter', word2: 'fly', compound: 'butterfly', emoji: '🦋' },
  { word1: 'foot', word2: 'ball', compound: 'football', emoji: '⚽' },
  { word1: 'cup', word2: 'cake', compound: 'cupcake', emoji: '🧁' },
  { word1: 'star', word2: 'fish', compound: 'starfish', emoji: '⭐' },
  { word1: 'fire', word2: 'fly', compound: 'firefly', emoji: '✨' }
];

const CompoundWordFactory: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected1, setSelected1] = useState<string | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const current = compounds[currentIndex];
  const allWords = compounds.flatMap(c => [c.word1, c.word2]).filter((v, i, a) => a.indexOf(v) === i).sort(() => Math.random() - 0.5);

  const handleWordClick = (word: string) => {
    if (!selected1) {
      setSelected1(word);
    } else if (!selected2 && word !== selected1) {
      setSelected2(word);
      const compound1 = selected1 + word;
      const compound2 = word + selected1;
      
      if (compound1 === current.compound || compound2 === current.compound) {
        setShowSuccess(true);
        setScore(prev => prev + 1);
        setTimeout(() => {
          setShowSuccess(false);
          setSelected1(null);
          setSelected2(null);
          setCurrentIndex((currentIndex + 1) % compounds.length);
        }, 2000);
      } else {
        setTimeout(() => {
          setSelected1(null);
          setSelected2(null);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-purple-700 text-center mb-6">🏭 Compound Word Factory</h1>
        <div className="text-center mb-6"><div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-lg">Score: {score}</div></div>
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
          <div className="text-8xl mb-3">{current.emoji}</div>
          <p className="text-2xl font-bold">Make: {current.compound}</p>
        </div>
        <div className="mb-6 flex justify-center items-center gap-4">
          <div className="w-32 h-20 rounded-xl border-4 border-dashed border-purple-400 flex items-center justify-center bg-purple-50">
            <span className="font-bold text-xl text-purple-700">{selected1 || '?'}</span>
          </div>
          <span className="text-3xl font-bold text-purple-600">+</span>
          <div className="w-32 h-20 rounded-xl border-4 border-dashed border-pink-400 flex items-center justify-center bg-pink-50">
            <span className="font-bold text-xl text-pink-700">{selected2 || '?'}</span>
          </div>
          <span className="text-3xl font-bold text-purple-600">=</span>
          <div className="w-48 h-20 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="font-bold text-2xl text-white">{selected1 && selected2 ? selected1 + selected2 : '?'}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {allWords.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(word)}
              disabled={selected1 === word || selected2 === word}
              className={`px-4 py-3 rounded-xl font-bold text-lg transition-all ${
                selected1 === word || selected2 === word
                  ? 'bg-purple-500 text-white scale-105'
                  : 'bg-gradient-to-br from-white to-gray-100 text-gray-800 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              } disabled:cursor-not-allowed`}
            >
              {word}
            </button>
          ))}
        </div>
        {showSuccess && <div className="mt-6 text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"><div className="text-6xl mb-2">🎉</div><div className="text-3xl font-extrabold text-white">Perfect! You made {current.compound}!</div></div>}
      </div>
    </div>
  );
};

export default CompoundWordFactory;

