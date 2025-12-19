import React, { useState, useCallback } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

const FillInTheBlanksTrainModule: React.FC = () => {
  const { speak, playSuccessSound, playErrorSound, playClickSound } = useGameModule();

  const [sequence, setSequence] = useState([1, null, 3, null, 5]);
  const [availableNumbers, setAvailableNumbers] = useState([2, 4]);
  const [draggedNumber, setDraggedNumber] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const correctSequence = [1, 2, 3, 4, 5];

  const handleDragStart = (number: number) => {
    setDraggedNumber(number);
    playClickSound();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedNumber !== null && sequence[index] === null) {
      const newSequence = [...sequence];
      newSequence[index] = draggedNumber;
      setSequence(newSequence);
      setAvailableNumbers(prev => prev.filter(n => n !== draggedNumber));

      if (JSON.stringify(newSequence) === JSON.stringify(correctSequence)) {
        playSuccessSound();
        setScore(prev => prev + 1);
        setShowSuccess(true);
        speak('Excellent! The train is complete!');
        setTimeout(() => {
          setShowSuccess(false);
          // Generate new sequence
          const blanks = [1, 3, 5, null, null];
          const nums = [2, 4];
          setSequence(blanks.sort(() => Math.random() - 0.5));
          setAvailableNumbers(nums.sort(() => Math.random() - 0.5));
        }, 2000);
      }
    }
    setDraggedNumber(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handlePlayInstructions = () => {
    speak('Drag the missing numbers to fill in the blanks on the train!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-purple-700">🚂 Fill in the Blanks</h1>
          <button onClick={handlePlayInstructions} className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">🔊 Instructions</button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-bold text-lg">Score: {score}</div>
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-bold text-gray-700 mb-4">Fill in the missing numbers!</p>
          <div className="flex justify-center items-center gap-2 mb-6">
            {sequence.map((number, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-4 border-dashed flex items-center justify-center text-2xl font-extrabold transition-all ${
                  number === null
                    ? 'border-gray-400 bg-gray-100'
                    : 'border-green-500 bg-green-200'
                }`}
              >
                {number || '?'}
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            {availableNumbers.map((number) => (
              <div
                key={number}
                draggable
                onDragStart={() => handleDragStart(number)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-3xl font-extrabold flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg hover:scale-105 transition-all"
              >
                {number}
              </div>
            ))}
          </div>
        </div>

        {showSuccess && (
          <div className="text-center p-6 bg-green-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-white">Perfect! Train is complete!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FillInTheBlanksTrainModule;


