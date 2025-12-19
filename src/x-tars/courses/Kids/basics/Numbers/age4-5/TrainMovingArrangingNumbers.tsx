import React, { useState, useCallback } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

const TrainMovingArrangingNumbers: React.FC = () => {
  const { speak, playSuccessSound, playErrorSound, playClickSound } = useGameModule();

  const [trainCars, setTrainCars] = useState([3, 1, 4, 2, 5]);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const correctOrder = [1, 2, 3, 4, 5];

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
        speak('Perfect! The train cars are in order!');
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
    speak('Click the train cars to move them and arrange them in order from 1 to 5!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">🚂 Number Train Sequence</h1>
          <button onClick={handlePlayInstructions} className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">🔊 Instructions</button>
        </div>

        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-green-500 text-white rounded-full font-bold text-lg">Score: {score}</div>
        </div>

        <div className="text-center mb-6">
          <p className="text-xl font-bold text-gray-700 mb-4">Arrange the train cars in order from 1 to 5!</p>
          <div className="flex justify-center items-center gap-2">
            {trainCars.map((number, index) => (
              <button
                key={index}
                onClick={() => handleCarClick(index)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white text-2xl font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                {number}
              </button>
            ))}
          </div>
        </div>

        {showSuccess && (
          <div className="text-center p-6 bg-green-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-3xl font-extrabold text-white">Perfect! Train cars are in order!</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainMovingArrangingNumbers;


