import React, { useState, useCallback } from 'react';

interface Animal {
  emoji: string;
  name: string;
  letter: string;
}

interface Scene {
  id: string;
  title: string;
  background: string;
  gradient: string;
  animals: Animal[];
  targetLetter: string;
}

const scenes: Scene[] = [
  {
    id: 'jungle',
    title: 'Jungle Adventure',
    background: '🌴',
    gradient: 'from-green-200 to-emerald-300',
    targetLetter: 'L',
    animals: [
      { emoji: '🦁', name: 'Lion', letter: 'L' },
      { emoji: '🐒', name: 'Monkey', letter: 'M' },
      { emoji: '🦜', name: 'Parrot', letter: 'P' },
      { emoji: '🦎', name: 'Lizard', letter: 'L' },
      { emoji: '🐅', name: 'Tiger', letter: 'T' },
      { emoji: '🦘', name: 'Kangaroo', letter: 'K' }
    ]
  },
  {
    id: 'savanna',
    title: 'Savanna Safari',
    background: '🌾',
    gradient: 'from-yellow-200 to-orange-300',
    targetLetter: 'E',
    animals: [
      { emoji: '🐘', name: 'Elephant', letter: 'E' },
      { emoji: '🦒', name: 'Giraffe', letter: 'G' },
      { emoji: '🦓', name: 'Zebra', letter: 'Z' },
      { emoji: '🦅', name: 'Eagle', letter: 'E' },
      { emoji: '🦏', name: 'Rhino', letter: 'R' },
      { emoji: '🐆', name: 'Leopard', letter: 'L' }
    ]
  },
  {
    id: 'arctic',
    title: 'Arctic Expedition',
    background: '❄️',
    gradient: 'from-blue-200 to-cyan-300',
    targetLetter: 'P',
    animals: [
      { emoji: '🐧', name: 'Penguin', letter: 'P' },
      { emoji: '🐻‍❄️', name: 'Polar Bear', letter: 'P' },
      { emoji: '🦭', name: 'Seal', letter: 'S' },
      { emoji: '🦌', name: 'Reindeer', letter: 'R' },
      { emoji: '🐺', name: 'Wolf', letter: 'W' },
      { emoji: '🦉', name: 'Owl', letter: 'O' }
    ]
  },
  {
    id: 'ocean',
    title: 'Ocean Dive',
    background: '🌊',
    gradient: 'from-cyan-200 to-blue-300',
    targetLetter: 'S',
    animals: [
      { emoji: '🦈', name: 'Shark', letter: 'S' },
      { emoji: '🐙', name: 'Octopus', letter: 'O' },
      { emoji: '🐠', name: 'Fish', letter: 'F' },
      { emoji: '🦀', name: 'Crab', letter: 'C' },
      { emoji: '⭐', name: 'Starfish', letter: 'S' },
      { emoji: '🐢', name: 'Turtle', letter: 'T' }
    ]
  }
];

const LetterHuntSafari: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [foundAnimals, setFoundAnimals] = useState<Set<string>>(new Set());
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const currentScene = scenes[currentSceneIndex];
  const targetAnimals = currentScene.animals.filter(a => a.letter === currentScene.targetLetter);

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

  const handleAnimalClick = (animal: Animal) => {
    if (foundAnimals.has(animal.name)) return;

    setSelectedAnimal(animal.name);

    if (animal.letter === currentScene.targetLetter) {
      // Correct!
      setFoundAnimals(prev => new Set([...prev, animal.name]));
      setScore(prev => prev + 1);
      speak(`Great! ${animal.name} starts with letter ${animal.letter}!`);

      setTimeout(() => {
        setSelectedAnimal(null);
        
        // Check if all target animals are found
        const allFound = targetAnimals.every(a => foundAnimals.has(a.name) || a.name === animal.name);
        if (allFound) {
          setShowSuccess(true);
          speak(`Amazing! You found all the animals with letter ${currentScene.targetLetter}!`);
          
          setTimeout(() => {
            setShowSuccess(false);
            setFoundAnimals(new Set());
            if (currentSceneIndex < scenes.length - 1) {
              setCurrentSceneIndex(prev => prev + 1);
            } else {
              setCurrentSceneIndex(0);
            }
          }, 3000);
        }
      }, 1000);
    } else {
      // Wrong
      speak(`${animal.name} starts with ${animal.letter}, not ${currentScene.targetLetter}. Try again!`);
      
      setTimeout(() => {
        setSelectedAnimal(null);
      }, 2000);
    }
  };

  const handlePlayInstructions = () => {
    speak(`Find all the animals that start with the letter ${currentScene.targetLetter}! Tap each one you find!`);
  };

  const handleReset = () => {
    setFoundAnimals(new Set());
    setShowSuccess(false);
    setSelectedAnimal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-700 flex items-center gap-2">
              <span>🦁 Letter Hunt Safari</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Find animals that start with the target letter!
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
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-full font-bold text-lg shadow-lg">
            Scene: {currentSceneIndex + 1}/{scenes.length}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Found: {score}
          </div>
        </div>

        {/* Scene Title & Target Letter */}
        <div className={`text-center mb-6 p-6 rounded-2xl bg-gradient-to-r ${currentScene.gradient}`}>
          <div className="text-6xl mb-2">{currentScene.background}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {currentScene.title}
          </h2>
          <div className="inline-block px-6 py-3 bg-white rounded-2xl shadow-lg">
            <p className="text-lg font-semibold text-gray-700 mb-1">Find animals starting with:</p>
            <div className="text-6xl font-extrabold text-amber-700">{currentScene.targetLetter}</div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <h3 className="text-center font-bold text-gray-700 mb-3">
            Animals to Find: {foundAnimals.size}/{targetAnimals.length}
          </h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {targetAnimals.map((animal) => (
              <div
                key={animal.name}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  foundAnimals.has(animal.name)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {foundAnimals.has(animal.name) ? '✓' : '?'} {animal.emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Animals Grid */}
        <div className={`mb-6 p-6 rounded-3xl bg-gradient-to-br ${currentScene.gradient} min-h-[300px]`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentScene.animals.map((animal) => (
              <button
                key={animal.name}
                onClick={() => handleAnimalClick(animal)}
                disabled={foundAnimals.has(animal.name)}
                className={`relative p-4 rounded-2xl transition-all transform ${
                  foundAnimals.has(animal.name)
                    ? 'bg-green-500 opacity-50 cursor-not-allowed'
                    : selectedAnimal === animal.name
                    ? animal.letter === currentScene.targetLetter
                      ? 'bg-green-400 scale-110'
                      : 'bg-red-400 scale-110'
                    : 'bg-white hover:scale-105 active:scale-95 cursor-pointer shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="text-5xl sm:text-6xl mb-2">{animal.emoji}</div>
                <div className="font-bold text-gray-800 text-sm sm:text-base">{animal.name}</div>
                <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  foundAnimals.has(animal.name)
                    ? 'bg-green-600'
                    : 'bg-gray-600'
                }`}>
                  {animal.letter}
                </div>
                {foundAnimals.has(animal.name) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">✓</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Perfect! All {currentScene.targetLetter} animals found!
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
                  ? 'bg-amber-600 w-8'
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

export default LetterHuntSafari;
