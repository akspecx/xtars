import React, { useState } from 'react';

const sentences = [
  { words: ['The', 'cat', 'is', 'big'], emoji: '🐱' },
  { words: ['I', 'can', 'see', 'you'], emoji: '👀' },
  { words: ['We', 'go', 'to', 'school'], emoji: '🏫' },
  { words: ['She', 'has', 'a', 'dog'], emoji: '🐶' },
  { words: ['He', 'likes', 'to', 'play'], emoji: '⚽' }
];

const SentenceBuilder: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [builtSentence, setBuiltSentence] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);

  const current = sentences[currentIndex];

  React.useEffect(() => {
    setAvailableWords([...current.words].sort(() => Math.random() - 0.5));
    setBuiltSentence([]);
  }, [currentIndex]);

  const handleWordClick = (word: string) => {
    setBuiltSentence([...builtSentence, word]);
    setAvailableWords(prev => prev.filter(w => w !== word));
    
    if (builtSentence.length + 1 === current.words.length) {
      const sentence = [...builtSentence, word].join(' ');
      const correct = current.words.join(' ');
      if (sentence === correct) {
        setShowSuccess(true);
        setScore(prev => prev + 1);
        setTimeout(() => {
          setShowSuccess(false);
          setCurrentIndex((currentIndex + 1) % sentences.length);
        }, 2000);
      } else {
        setTimeout(() => {
          setAvailableWords([...current.words].sort(() => Math.random() - 0.5));
          setBuiltSentence([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-teal-700 text-center mb-6">📝 Sentence Builder</h1>
        <div className="text-center mb-6"><div className="inline-block px-6 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-white rounded-full font-bold text-lg">Score: {score}</div></div>
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
          <div className="text-8xl mb-3">{current.emoji}</div>
          <p className="text-2xl font-bold">Build the sentence!</p>
        </div>
        <div className="mb-6 p-4 bg-gray-100 rounded-2xl min-h-[80px] flex flex-wrap gap-2">
          {builtSentence.map((word, i) => (
            <div key={i} className="px-4 py-2 rounded-lg bg-green-500 text-white font-bold text-lg">{word}</div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {availableWords.map((word, i) => (
            <button key={i} onClick={() => handleWordClick(word)} className="px-6 py-3 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all">{word}</button>
          ))}
        </div>
        {showSuccess && <div className="mt-6 text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"><div className="text-6xl mb-2">🎉</div><div className="text-3xl font-extrabold text-white">Perfect sentence!</div></div>}
      </div>
    </div>
  );
};

export default SentenceBuilder;

