import React, { useState, useCallback } from 'react';

interface Scene {
  id: string;
  title: string;
  description: string;
  emoji: string;
  gradient: string;
  numbersToFind: { number: number; position: { x: number; y: number }; context: string }[];
}

const scenes: Scene[] = [
  {
    id: 'house',
    title: 'Neighborhood Street',
    description: 'Find the house numbers!',
    emoji: '🏘️',
    gradient: 'from-blue-200 to-cyan-300',
    numbersToFind: [
      { number: 5, position: { x: 15, y: 30 }, context: '🏠 House 5' },
      { number: 12, position: { x: 45, y: 25 }, context: '🏡 House 12' },
      { number: 8, position: { x: 75, y: 35 }, context: '🏘️ House 8' }
    ]
  },
  {
    id: 'park',
    title: 'City Park',
    description: 'Find numbers on signs!',
    emoji: '🌳',
    gradient: 'from-green-200 to-emerald-300',
    numbersToFind: [
      { number: 3, position: { x: 20, y: 40 }, context: '🚻 Restroom 3' },
      { number: 7, position: { x: 50, y: 30 }, context: '🅿️ Parking 7' },
      { number: 10, position: { x: 80, y: 45 }, context: '🎪 Tent 10' }
    ]
  },
  {
    id: 'street',
    title: 'Busy Street',
    description: 'Find numbers on vehicles!',
    emoji: '🚗',
    gradient: 'from-orange-200 to-yellow-300',
    numbersToFind: [
      { number: 4, position: { x: 25, y: 35 }, context: '🚌 Bus 4' },
      { number: 9, position: { x: 55, y: 40 }, context: '🚕 Taxi 9' },
      { number: 6, position: { x: 85, y: 30 }, context: '🚚 Truck 6' }
    ]
  },
  {
    id: 'store',
    title: 'Shopping Center',
    description: 'Find store numbers!',
    emoji: '🏬',
    gradient: 'from-purple-200 to-pink-300',
    numbersToFind: [
      { number: 2, position: { x: 18, y: 35 }, context: '🍕 Pizza Shop 2' },
      { number: 11, position: { x: 48, y: 28 }, context: '📚 Bookstore 11' },
      { number: 15, position: { x: 78, y: 42 }, context: '🎮 Game Store 15' }
    ]
  }
];

const NumberDetective: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [foundNumbers, setFoundNumbers] = useState<Set<number>>(new Set());
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const currentScene = scenes[currentSceneIndex];

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
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleNumberClick = (number: number, context: string) => {
    if (foundNumbers.has(number)) return;

    setSelectedNumber(number);
    setFoundNumbers(prev => new Set([...prev, number]));
    setScore(prev => prev + 1);
    speak(`Great! You found ${context}!`);

    setTimeout(() => {
      setSelectedNumber(null);
      
      // Check if all numbers in scene are found
      if (foundNumbers.size + 1 === currentScene.numbersToFind.length) {
        setShowSuccess(true);
        speak('Amazing! You found all the numbers in this scene!');
        
        setTimeout(() => {
          setShowSuccess(false);
          setFoundNumbers(new Set());
          if (currentSceneIndex < scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
          } else {
            setCurrentSceneIndex(0);
          }
        }, 3000);
      }
    }, 1000);
  };

  const handlePlayInstructions = () => {
    speak(`${currentScene.description} Look carefully and tap each number you find!`);
  };

  const handleReset = () => {
    setFoundNumbers(new Set());
    setShowSuccess(false);
    setSelectedNumber(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-indigo-700 flex items-center gap-2">
              <span>🔍 Number Detective</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Find numbers hidden in real-world scenes!
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
              className="px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 Reset Scene
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full font-bold text-lg shadow-lg">
            Scene: {currentSceneIndex + 1}/{scenes.length}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Total Found: {score}
          </div>
        </div>

        {/* Scene Title */}
        <div className={`text-center mb-6 p-4 rounded-2xl bg-gradient-to-r ${currentScene.gradient}`}>
          <div className="text-5xl mb-2">{currentScene.emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
            {currentScene.title}
          </h2>
          <p className="text-lg font-semibold text-gray-700">
            {currentScene.description}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <h3 className="text-center font-bold text-gray-700 mb-3">
            Numbers to Find: {foundNumbers.size}/{currentScene.numbersToFind.length}
          </h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {currentScene.numbersToFind.map(({ number, context }) => (
              <div
                key={number}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  foundNumbers.has(number)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {foundNumbers.has(number) ? '✓' : '?'} {number}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Scene */}
        <div className={`relative mb-6 p-8 rounded-3xl bg-gradient-to-br ${currentScene.gradient} min-h-[400px] border-4 border-gray-300`}>
          <div className="text-center text-6xl mb-8">{currentScene.emoji}</div>
          
          {/* Number Hotspots */}
          {currentScene.numbersToFind.map(({ number, position, context }) => (
            <button
              key={number}
              onClick={() => handleNumberClick(number, context)}
              disabled={foundNumbers.has(number)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                foundNumbers.has(number)
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:scale-125 active:scale-95 animate-pulse'
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <div className={`relative ${
                foundNumbers.has(number) 
                  ? 'bg-green-500' 
                  : selectedNumber === number
                  ? 'bg-yellow-400'
                  : 'bg-white'
              } rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-4 border-gray-800 shadow-xl`}>
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-800">
                  {number}
                </span>
                {foundNumbers.has(number) && (
                  <div className="absolute -top-2 -right-2 bg-green-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs sm:text-sm font-bold text-gray-800 bg-white bg-opacity-90 px-2 py-1 rounded-full whitespace-nowrap">
                {context}
              </div>
            </button>
          ))}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Great detective work! All numbers found!
            </div>
          </div>
        )}

        {/* Scene Progress */}
        <div className="mt-6 flex justify-center gap-2">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSceneIndex
                  ? 'bg-indigo-600 w-8'
                  : index < currentSceneIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberDetective;
