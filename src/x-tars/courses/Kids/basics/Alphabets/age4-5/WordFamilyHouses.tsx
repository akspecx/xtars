import React, { useState, useCallback } from 'react';

interface WordFamily {
  ending: string;
  words: { word: string; emoji: string }[];
  color: string;
}

const wordFamilies: WordFamily[] = [
  { ending: '-at', words: [{ word: 'cat', emoji: '🐱' }, { word: 'bat', emoji: '🦇' }, { word: 'hat', emoji: '🎩' }, { word: 'mat', emoji: '🧘' }], color: 'from-red-400 to-pink-500' },
  { ending: '-an', words: [{ word: 'can', emoji: '🥫' }, { word: 'fan', emoji: '🪭' }, { word: 'man', emoji: '👨' }, { word: 'pan', emoji: '🍳' }], color: 'from-blue-400 to-cyan-500' },
  { ending: '-ig', words: [{ word: 'big', emoji: '🐘' }, { word: 'pig', emoji: '🐷' }, { word: 'dig', emoji: '⛏️' }, { word: 'wig', emoji: '👩‍🦱' }], color: 'from-green-400 to-emerald-500' },
  { ending: '-op', words: [{ word: 'hop', emoji: '🦘' }, { word: 'mop', emoji: '🧹' }, { word: 'top', emoji: '🔝' }, { word: 'pop', emoji: '🎈' }], color: 'from-purple-400 to-fuchsia-500' }
];

const WordFamilyHouses: React.FC = () => {
  const [allWords] = useState(() => wordFamilies.flatMap(f => f.words.map(w => ({ ...w, family: f.ending }))).sort(() => Math.random() - 0.5));
  const [remainingWords, setRemainingWords] = useState(allWords);
  const [houses, setHouses] = useState(wordFamilies.map(f => ({ ...f, placedWords: [] as typeof f.words })));
  const [draggedWord, setDraggedWord] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  const handleDrop = (e: React.DragEvent, familyEnding: string) => {
    e.preventDefault();
    if (draggedWord && draggedWord.family === familyEnding) {
      setRemainingWords(prev => prev.filter(w => w.word !== draggedWord.word));
      setHouses(prev => prev.map(h => h.ending === familyEnding ? { ...h, placedWords: [...h.placedWords, draggedWord] } : h));
      setScore(prev => prev + 1);
      speak(`Correct! ${draggedWord.word} belongs in the ${familyEnding} family!`);
      
      if (remainingWords.length === 1) {
        setShowSuccess(true);
        speak('Amazing! All words are in their families!');
      }
    } else {
      speak(`Oops! ${draggedWord.word} doesn't end with ${familyEnding}!`);
    }
    setDraggedWord(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 text-center mb-6">🏠 Word Family Houses</h1>
        
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}/{allWords.length}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-center font-bold text-gray-700 mb-3">Words to Sort ({remainingWords.length} left)</h3>
          <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 rounded-2xl min-h-[100px]">
            {remainingWords.map((word, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => setDraggedWord(word)}
                onTouchStart={() => setDraggedWord(word)}
                className="px-4 py-2 rounded-xl bg-gradient-to-br from-white to-gray-100 border-2 border-gray-300 cursor-grab active:cursor-grabbing hover:scale-105 transition-all flex items-center gap-2"
              >
                <span className="text-2xl">{word.emoji}</span>
                <span className="font-bold text-lg">{word.word}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {houses.map((house) => (
            <div
              key={house.ending}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, house.ending)}
              onTouchEnd={(e) => { if (draggedWord) handleDrop(e as any, house.ending); }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${house.color} border-4 border-dashed border-white hover:border-yellow-300 transition-all`}
            >
              <div className="text-center mb-3">
                <div className="text-5xl mb-2">🏠</div>
                <div className="text-3xl font-extrabold text-white">{house.ending}</div>
              </div>
              <div className="bg-white bg-opacity-90 rounded-xl p-3 min-h-[150px]">
                {house.placedWords.map((word, i) => (
                  <div key={i} className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center gap-2">
                    <span className="text-2xl">{word.emoji}</span>
                    <span className="font-bold">{word.word}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showSuccess && (
          <div className="mt-6 text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-white">Perfect! All word families complete!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordFamilyHouses;

