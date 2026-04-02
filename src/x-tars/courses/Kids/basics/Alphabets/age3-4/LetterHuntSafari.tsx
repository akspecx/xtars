import React, { useState, useCallback } from 'react';
import { useProfile } from "../../../../../context/ProfileContext";
import { Volume2, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

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
  const { activeProfile } = useProfile();
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [foundAnimals, setFoundAnimals] = useState<Set<string>>(new Set());
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const currentScene = scenes[currentSceneIndex];
  const targetAnimals = currentScene.animals.filter(a => a.letter === currentScene.targetLetter);
  const isKids = activeProfile?.type === 'KIDS';

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAnimalClick = (animal: Animal) => {
    if (foundAnimals.has(animal.name)) return;
    setSelectedAnimal(animal.name);

    if (animal.letter === currentScene.targetLetter) {
      setFoundAnimals(prev => new Set([...prev, animal.name]));
      setScore(prev => prev + 1);
      speak(`Great! ${animal.name} starts with letter ${animal.letter}!`);

      setTimeout(() => {
        setSelectedAnimal(null);
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
      speak(`${animal.name} starts with ${animal.letter}, not ${currentScene.targetLetter}. Try again!`);
      setTimeout(() => setSelectedAnimal(null), 2000);
    }
  };

  const handlePlayInstructions = () => {
    speak(`Find all the animals that start with the letter ${currentScene.targetLetter}! Tap each one you find!`);
  };

  const handleReset = () => {
    setFoundAnimals(new Set());
    setShowSuccess(false);
    setSelectedAnimal(null);
    speak("Game reset! Ready to hunt for letters?");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8">
        
        <header className="flex flex-col items-center text-center w-full">
          <div className="flex flex-col items-center gap-4 mb-4">
             <h1 className="text-4xl md:text-7xl font-black text-amber-700 uppercase tracking-tighter drop-shadow-xl">
               {isKids ? "LETTER HUNT!" : "🦁 Letter Hunt Safari"}
             </h1>
             {!isKids && <p className="text-xl text-gray-600 font-medium tracking-wide">Find animals that start with the target letter!</p>}
          </div>
          
          <div className="flex gap-4">
            <button
               onClick={handlePlayInstructions}
               className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white/30"
            >
              <Volume2 size={32} />
            </button>
            <button
               onClick={handleReset}
               className="bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white/30"
            >
              <RotateCcw size={32} />
            </button>
          </div>
        </header>

        <div className="flex justify-center gap-6 w-full">
          <div className="px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-[2rem] font-black text-2xl shadow-2xl border-4 border-white/30">
            {isKids ? `🗺️ ${currentSceneIndex + 1}` : `Scene: ${currentSceneIndex + 1}/${scenes.length}`}
          </div>
          <div className="px-10 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-[2rem] font-black text-2xl shadow-2xl border-4 border-white/30">
            ⭐ {score}
          </div>
        </div>

        <div className={`w-full flex flex-col items-center gap-6 p-8 rounded-[3rem] bg-gradient-to-r ${currentScene.gradient} shadow-2xl border-4 border-white`}>
           <div className="text-8xl drop-shadow-2xl">{currentScene.background}</div>
           <h2 className="text-3xl md:text-5xl font-black text-gray-800 uppercase tracking-tighter">
             {currentScene.title}
           </h2>
           <div className="bg-white/80 backdrop-blur-md px-12 py-6 rounded-[2.5rem] shadow-2xl border-4 border-white flex flex-col items-center gap-2">
             {!isKids && <p className="text-xl font-bold text-gray-600 uppercase tracking-widest">Find</p>}
             <div className="text-8xl font-black text-amber-700 drop-shadow-xl">{currentScene.targetLetter}</div>
           </div>
        </div>

        <div className="w-full bg-white/60 backdrop-blur-xl p-8 rounded-[3.5rem] shadow-3xl border-4 border-white">
           {!isKids && (
             <h3 className="text-2xl font-black text-center text-gray-700 uppercase mb-6 tracking-widest">
               Animals to Find: {foundAnimals.size}/{targetAnimals.length}
             </h3>
           )}
           <div className="flex justify-center gap-6 flex-wrap">
             {targetAnimals.map((animal) => (
               <div
                 key={animal.name}
                 className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-5xl border-4 shadow-xl transition-all duration-500 ${foundAnimals.has(animal.name) ? 'bg-green-500 border-white text-white' : 'bg-gray-100 border-gray-200 text-gray-300'}`}
               >
                 {foundIndices.has(animal.name) || foundAnimals.has(animal.name) ? <CheckCircle2 size={40} strokeWidth={4} /> : "?"}
               </div>
             ))}
           </div>
        </div>

        <div className={`w-full grid grid-cols-2 md:grid-cols-3 gap-6 p-8 rounded-[4rem] bg-gradient-to-br ${currentScene.gradient} shadow-[inset_0_10px_40px_rgba(0,0,0,0.1)] border-4 border-white`}>
          {currentScene.animals.map((animal) => (
            <button
              key={animal.name}
              onClick={() => handleAnimalClick(animal)}
              disabled={foundAnimals.has(animal.name)}
              className={`relative p-8 rounded-[2.5rem] transition-all transform flex flex-col items-center gap-4 ${foundAnimals.has(animal.name) ? 'bg-green-100/50 opacity-40 grayscale scale-90' : selectedAnimal === animal.name ? animal.letter === currentScene.targetLetter ? 'bg-green-400 scale-110 shadow-3xl border-4 border-white' : 'bg-red-400 scale-110' : 'bg-white hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl border-4 border-white/50'}`}
            >
              <div className="text-7xl md:text-8xl drop-shadow-2xl">{animal.emoji}</div>
              {!isKids && <div className="font-black text-gray-800 text-xl uppercase tracking-tighter">{animal.name}</div>}
              <div className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-xl border-4 border-white shadow-lg ${foundAnimals.has(animal.name) ? 'bg-green-600' : 'bg-amber-600'}`}>
                {animal.letter}
              </div>
              {foundAnimals.has(animal.name) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle2 size={120} strokeWidth={8} className="text-green-600 drop-shadow-2xl animate-bounce" />
                </div>
              )}
            </button>
          ))}
        </div>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
             <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 rounded-[3rem] p-12 text-center shadow-3xl border-8 border-white animate-bounce max-w-xl w-full">
               <div className="text-9xl mb-6">🎉</div>
               <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                 {isKids ? "AWESOME!" : "Perfect!"}
               </h2>
               {!isKids && <p className="text-2xl text-white font-bold mt-4">All {currentScene.targetLetter} animals found!</p>}
             </div>
          </div>
        )}

        <div className="flex justify-center gap-4 py-8">
          {scenes.map((_, index) => (
            <div
              key={index}
              className={`h-4 rounded-full transition-all duration-700 ${index === currentSceneIndex ? 'bg-amber-600 w-16 shadow-lg' : index < currentSceneIndex ? 'bg-green-500 w-4' : 'bg-gray-300 w-4'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LetterHuntSafari;
