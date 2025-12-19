import React, { useState, useCallback, useEffect } from 'react';

interface RaceCar {
  id: string;
  emoji: string;
  color: string;
  name: string;
  position: number; // 1 = 1st, 2 = 2nd, etc.
}

const carEmojis = ['🏎️', '🚗', '🚙', '🚕', '🚐', '🏁', '🚓', '🚑', '🚒', '🚛'];
const carColors = [
  'from-red-400 to-red-600',
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-yellow-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-indigo-400 to-indigo-600',
  'from-orange-400 to-orange-600',
  'from-teal-400 to-teal-600',
  'from-cyan-400 to-cyan-600'
];

const ordinalNames = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
const ordinalWords = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

const OrdinalRaceTrack: React.FC = () => {
  const [numCars, setNumCars] = useState(5);
  const [raceCars, setRaceCars] = useState<RaceCar[]>([]);
  const [podiumSlots, setPodiumSlots] = useState<(RaceCar | null)[]>([]);
  const [draggedCar, setDraggedCar] = useState<RaceCar | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    initializeRace();
  }, [numCars]);

  const initializeRace = () => {
    const cars: RaceCar[] = [];
    const positions = Array.from({ length: numCars }, (_, i) => i + 1);
    const shuffledPositions = positions.sort(() => Math.random() - 0.5);

    for (let i = 0; i < numCars; i++) {
      cars.push({
        id: `car-${i}`,
        emoji: carEmojis[i],
        color: carColors[i],
        name: `Car ${i + 1}`,
        position: shuffledPositions[i]
      });
    }

    setRaceCars(cars);
    setPodiumSlots(Array(numCars).fill(null));
    setShowSuccess(false);
  };

  const speak = useCallback((text: string) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined' &&
      !isSpeaking
    ) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleDragStart = (e: React.DragEvent, car: RaceCar) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedCar(car);
  };

  const handleTouchStart = (e: React.TouchEvent, car: RaceCar) => {
    setDraggedCar(car);
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    if (draggedCar) {
      placeCarInSlot(draggedCar, slotIndex);
    }
    setDraggedCar(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, slotIndex: number) => {
    if (draggedCar) {
      placeCarInSlot(draggedCar, slotIndex);
    }
    setDraggedCar(null);
    e.preventDefault();
  };

  const placeCarInSlot = (car: RaceCar, slotIndex: number) => {
    // Check if slot is already occupied
    if (podiumSlots[slotIndex] !== null) {
      speak('That spot is already taken!');
      return;
    }

    // Check if this is the correct position
    const correctPosition = car.position - 1; // Convert to 0-indexed
    
    if (slotIndex === correctPosition) {
      // Correct placement
      const newSlots = [...podiumSlots];
      newSlots[slotIndex] = car;
      setPodiumSlots(newSlots);
      setRaceCars(prev => prev.filter(c => c.id !== car.id));
      
      speak(`Correct! ${ordinalWords[slotIndex]} place!`);
      setScore(prev => prev + 1);

      // Check if all cars are placed
      setTimeout(() => {
        const allPlaced = newSlots.every(slot => slot !== null);
        if (allPlaced) {
          setShowSuccess(true);
          speak('Amazing! You placed all the cars in the correct order!');
          setTimeout(() => {
            if (numCars < 10) {
              setNumCars(prev => Math.min(prev + 1, 10));
            } else {
              initializeRace();
            }
          }, 3000);
        }
      }, 100);
    } else {
      // Incorrect placement
      speak(`Not quite! That car finished in ${ordinalWords[correctPosition]} place, not ${ordinalWords[slotIndex]}.`);
      setAttempts(prev => prev + 1);
    }
  };

  const handlePlayInstructions = () => {
    speak('Place each race car in its finishing position! First place, second place, third place, and so on!');
  };

  const handleReset = () => {
    initializeRace();
  };

  const handleRemoveCar = (slotIndex: number) => {
    const car = podiumSlots[slotIndex];
    if (car) {
      setRaceCars(prev => [...prev, car]);
      const newSlots = [...podiumSlots];
      newSlots[slotIndex] = null;
      setPodiumSlots(newSlots);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 flex items-center gap-2">
              <span>🏁 Ordinal Race Track</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Place the race cars in their finishing positions!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePlayInstructions}
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔊 Instructions
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 New Race
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full font-bold text-lg shadow-lg">
            Cars: {numCars}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Correct: {score}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Attempts: {attempts}
          </div>
        </div>

        {/* Race Cars to Place */}
        <div className="mb-6">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-3">
            Race Cars ({raceCars.length} left to place)
          </h3>
          <div className="flex flex-wrap justify-center gap-4 p-4 bg-gray-50 rounded-2xl min-h-[120px]">
            {raceCars.map((car) => (
              <div
                key={car.id}
                draggable
                onDragStart={(e) => handleDragStart(e, car)}
                onTouchStart={(e) => handleTouchStart(e, car)}
                className={`p-4 rounded-xl bg-gradient-to-br ${car.color} shadow-lg cursor-grab active:cursor-grabbing transform hover:scale-110 transition-all ${
                  draggedCar?.id === car.id ? 'opacity-50 scale-90' : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-2">{car.emoji}</div>
                  <div className="bg-white bg-opacity-90 px-3 py-1 rounded-full font-bold text-sm text-gray-800">
                    Finished {ordinalNames[car.position - 1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podium Slots */}
        <div className="mb-6">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-4">
            🏆 Finishing Positions 🏆
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {podiumSlots.map((car, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onTouchEnd={(e) => handleTouchEnd(e, index)}
                className={`relative p-4 rounded-2xl border-4 border-dashed min-h-[160px] flex flex-col items-center justify-center transition-all ${
                  car 
                    ? `bg-gradient-to-br ${car.color} border-green-500` 
                    : 'bg-gray-100 border-gray-300 hover:border-blue-400'
                }`}
              >
                <div className="absolute top-2 left-2 right-2 text-center">
                  <div className="bg-white bg-opacity-90 px-2 py-1 rounded-full font-extrabold text-lg text-gray-800 inline-block">
                    {ordinalNames[index]}
                  </div>
                </div>
                {car ? (
                  <>
                    <div className="text-6xl mb-2 mt-6">{car.emoji}</div>
                    <button
                      onClick={() => handleRemoveCar(index)}
                      className="absolute bottom-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold active:scale-95 transition-transform"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <div className="text-4xl text-gray-400 mt-6">?</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Perfect! All cars in the right order!
            </div>
          </div>
        )}

        {/* Ordinal Guide */}
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
          <h4 className="text-center font-bold text-gray-700 mb-2">Ordinal Numbers Guide</h4>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {ordinalNames.slice(0, numCars).map((ord, i) => (
              <div key={i} className="bg-white px-3 py-1 rounded-full font-bold text-gray-700">
                {ord} = {ordinalWords[i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdinalRaceTrack;
