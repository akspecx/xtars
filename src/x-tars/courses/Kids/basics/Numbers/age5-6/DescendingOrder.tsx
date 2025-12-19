import React, { useState, useCallback } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

const DescendingOrder: React.FC = () => {
  const { speak, playSuccessSound, playErrorSound, playClickSound } = useGameModule();

  const [trainCars, setTrainCars] = useState([2, 5, 1, 4, 3]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const correctOrder = [5, 4, 3, 2, 1];

  const handleCarClick = (index: number) => {
    playClickSound();
    const newCars = [...trainCars];
    if (index > 0) {
      // Swap with previous car
      [newCars[index], newCars[index - 1]] = [newCars[index - 1], newCars[index]];
      setTrainCars(newCars);

      if (JSON.stringify(newCars) === JSON.stringify(correctOrder)) {
        playSuccessSound();
        setScore(prev => prev + 1);
        setShowSuccess(true);
        speak('Perfect! The train cars are in descending order!');
        setTimeout(() => {
          setShowSuccess(false);
          // Generate new sequence
          const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
          setTrainCars(shuffled);
        }, 2000);
      }
    }
  };

  const handlePlayInstructions = () => {
    speak('Arrange the train cars in descending order from 5 down to 1!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-red-700">🚂 Descending Order Train</h1>
          <button onClick={handlePlayInstructions} className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">🔊 Instructions</button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-bold text-lg">Score: {score}</div>
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-bold text-gray-700 mb-4">Arrange from highest to lowest: 5 → 4 → 3 → 2 → 1</p>
          <div className="flex justify-center items-center gap-2">
            {trainCars.map((number, index) => (
              <button
                key={index}
                onClick={() => handleCarClick(index)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 text-white text-2xl font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {showSuccess && (
          <div className="text-center p-6 bg-green-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-white">Perfect! Descending order achieved!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescendingOrder;


