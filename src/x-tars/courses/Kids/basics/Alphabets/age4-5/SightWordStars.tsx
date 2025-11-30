import React, { useState, useCallback } from 'react';

const sightWords = ['the', 'and', 'is', 'can', 'see', 'go', 'to', 'in', 'on', 'it', 'we', 'my', 'you', 'he', 'she', 'at', 'am', 'up', 'do', 'me'];

const SightWordStars: React.FC = () => {
  const [targetWord, setTargetWord] = useState(sightWords[0]);
  const [fallingWords, setFallingWords] = useState<{ word: string; x: number; y: number; id: number }[]>([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const isTarget = Math.random() > 0.5;
      const word = isTarget ? targetWord : sightWords[Math.floor(Math.random() * sightWords.length)];
      setFallingWords(prev => [...prev, { word, x: Math.random() * 80, y: 0, id: nextId }]);
      setNextId(prev => prev + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [targetWord, nextId]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFallingWords(prev => prev.map(w => ({ ...w, y: w.y + 2 })).filter(w => w.y < 100));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleWordClick = (word: { word: string; id: number }) => {
    if (word.word === targetWord) {
      setScore(prev => prev + 1);
      setFallingWords(prev => prev.filter(w => w.id !== word.id));
      if (score > 0 && score % 5 === 0) {
        setTargetWord(sightWords[Math.floor(Math.random() * sightWords.length)]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-4xl w-full bg-white bg-opacity-10 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <h1 className="text-3xl font-extrabold text-white text-center mb-6">⭐ Sight Word Stars</h1>
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-3 bg-yellow-400 text-gray-900 rounded-full font-bold text-2xl">Catch: {targetWord}</div>
          <div className="inline-block ml-4 px-6 py-2 bg-green-400 text-white rounded-full font-bold text-lg">Score: {score}</div>
        </div>
        <div className="relative h-96 bg-blue-900 bg-opacity-50 rounded-2xl overflow-hidden">
          {fallingWords.map((word) => (
            <button
              key={word.id}
              onClick={() => handleWordClick(word)}
              className={`absolute px-4 py-2 rounded-full font-bold text-lg transition-all transform hover:scale-110 ${
                word.word === targetWord ? 'bg-yellow-400 text-gray-900' : 'bg-white text-gray-800'
              }`}
              style={{ left: `${word.x}%`, top: `${word.y}%` }}
            >
              {word.word} ⭐
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SightWordStars;

