import React, { useState, useEffect } from 'react';
import { useGameModule } from '@/hooks/useGameModule';

interface Scene {
  id: string;
  title: string;
  emoji: string;
  items: string[];
  gradient: string;
  instruction: string;
}

const scenes: Scene[] = [
  {
    id: 'birds',
    title: 'Birds on a Wire',
    emoji: '🐦',
    items: ['🐦', '🐦', '🐦'],
    gradient: 'from-sky-200 to-blue-300',
    instruction: 'Tap the birds to make them fly away!'
  },
  {
    id: 'cookies',
    title: 'Cookie Jar',
    emoji: '🍪',
    items: ['🍪', '🍪', '🍪', '🍪'],
    gradient: 'from-amber-200 to-orange-300',
    instruction: 'Tap the cookies to eat them all!'
  },
  {
    id: 'balloons',
    title: 'Party Balloons',
    emoji: '🎈',
    items: ['🎈', '🎈', '🎈', '🎈', '🎈'],
    gradient: 'from-pink-200 to-rose-300',
    instruction: 'Tap the balloons to pop them!'
  },
  {
    id: 'flowers',
    title: 'Garden Flowers',
    emoji: '🌸',
    items: ['🌸', '🌸', '🌸', '🌸'],
    gradient: 'from-emerald-200 to-green-300',
    instruction: 'Tap the flowers to pick them!'
  },
  {
    id: 'stars',
    title: 'Night Stars',
    emoji: '⭐',
    items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐'],
    gradient: 'from-indigo-200 to-purple-300',
    instruction: 'Tap the stars to make them disappear!'
  }
];

const ZeroTheHero: React.FC = () => {
  const { speak, playSuccessSound, playClickSound, playCelebrationSound, announce } = useGameModule();
  
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [remainingItems, setRemainingItems] = useState<string[]>([]);
  const [showZeroCelebration, setShowZeroCelebration] = useState(false);
  const [score, setScore] = useState(0);

  const currentScene = scenes[currentSceneIndex];

  useEffect(() => {
    setRemainingItems([...currentScene.items]);
    setShowZeroCelebration(false);
  }, [currentScene]);

  const handleItemClick = (index: number) => {
    playClickSound();
    const newItems = remainingItems.filter((_, i) => i !== index);
    setRemainingItems(newItems);

    if (newItems.length === 0) {
      setShowZeroCelebration(true);
      setScore(prev => prev + 1);
      playCelebrationSound();
      speak('Zero! All gone! Great job! Zero means nothing is left!');
      announce('Congratulations! You reached zero!', 'assertive');
      
      setTimeout(() => {
        if (currentSceneIndex < scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setCurrentSceneIndex(0);
        }
      }, 3000);
    } else {
      playSuccessSound();
      speak(`${newItems.length} left!`);
      announce(`${newItems.length} items remaining`, 'polite');
    }
  };

  const handlePlayInstructions = () => {
    speak(currentScene.instruction + ' Count down to zero!');
  };

  const handleReset = () => {
    setRemainingItems([...currentScene.items]);
    setShowZeroCelebration(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4" role="main">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-purple-700 dark:text-purple-400 flex items-center gap-2">
              <span role="img" aria-label="superhero">🦸</span>
              <span>Zero the Hero</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
              Make everything disappear and reach ZERO!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePlayInstructions}
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Play instructions"
            >
              <span role="img" aria-label="speaker">🔊</span> Instructions
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              aria-label="Reset game"
            >
              <span role="img" aria-label="reset">🔄</span> Reset
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-4">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full font-bold text-lg shadow-lg" role="status" aria-live="polite">
            <span aria-label={`Scenes completed: ${score}`}>Scenes Completed: {score}</span>
          </div>
        </div>

        {/* Scene Title */}
        <div className={`text-center mb-6 p-4 rounded-2xl bg-gradient-to-r ${currentScene.gradient}`}>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {currentScene.emoji} {currentScene.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-medium">
            {currentScene.instruction}
          </p>
        </div>

        {/* Counter Display */}
        <div className="text-center mb-6">
          <div className={`inline-block px-8 py-4 rounded-2xl ${
            remainingItems.length === 0 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
              : 'bg-gradient-to-r from-blue-400 to-cyan-500'
          } shadow-xl`} role="status" aria-live="assertive">
            <div className="text-6xl sm:text-8xl font-extrabold text-white" aria-label={`${remainingItems.length} items remaining`}>
              {remainingItems.length}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white mt-2">
              {remainingItems.length === 0 ? 'ZERO!' : `item${remainingItems.length !== 1 ? 's' : ''} left`}
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {!showZeroCelebration ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mb-6 min-h-[200px]" role="group" aria-label="Items to remove">
            {remainingItems.map((item, index) => (
              <button
                key={`${item}-${index}`}
                onClick={() => handleItemClick(index)}
                className="aspect-square rounded-2xl bg-gradient-to-br from-white dark:from-gray-700 to-gray-100 dark:to-gray-600 border-4 border-gray-200 dark:border-gray-500 hover:border-purple-400 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center text-5xl sm:text-6xl cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2"
                aria-label={`Remove item ${index + 1} of ${remainingItems.length}`}
                tabIndex={0}
              >
                <span role="img" aria-label={`${item}`}>{item}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="min-h-[200px] flex items-center justify-center" role="alert" aria-live="assertive">
            <div className="text-center animate-bounce">
              <div className="text-8xl sm:text-9xl mb-4" role="img" aria-label="superhero">🦸‍♂️</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-purple-700 dark:text-purple-400 mb-2">
                ZERO THE HERO!
              </div>
              <div className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 font-bold">
                All gone! You reached ZERO! <span role="img" aria-label="celebration">🎉</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {scenes.map((scene, index) => (
            <button
              key={scene.id}
              onClick={() => setCurrentSceneIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSceneIndex
                  ? 'bg-purple-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${scene.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ZeroTheHero;
