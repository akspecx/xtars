import React, { useState, useCallback } from 'react';

const words = [
  { word: 'CAT', sounds: ['C', 'A', 'T'], emoji: '🐱' },
  { word: 'DOG', sounds: ['D', 'O', 'G'], emoji: '🐶' },
  { word: 'SUN', sounds: ['S', 'U', 'N'], emoji: '☀️' },
  { word: 'BUS', sounds: ['B', 'U', 'S'], emoji: '🚌' },
  { word: 'HAT', sounds: ['H', 'A', 'T'], emoji: '🎩' }
];

const BlendingBridge: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blendedSounds, setBlendedSounds] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const current = words[currentIndex];

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && !isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.75;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleSoundClick = (sound: string, index: number) => {
    if (blendedSounds.length === index) {
      const newBlended = [...blendedSounds, sound];
      setBlendedSounds(newBlended);
      speak(sound);
      
      if (newBlended.length === current.sounds.length) {
        setShowSuccess(true);
        setScore(prev => prev + 1);
        speak(`Perfect! ${current.word}!`);
        setTimeout(() => {
          setShowSuccess(false);
          setBlendedSounds([]);
          setCurrentIndex((currentIndex + 1) % words.length);
        }, 2500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 text-center mb-6">🌉 Blending Bridge</h1>
        <div className="text-center mb-6"><div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full font-bold text-lg">Score: {score}</div></div>
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
          <div className="text-8xl mb-3">{current.emoji}</div>
          <p className="text-2xl font-bold">Blend the sounds to make: {current.word}</p>
        </div>
        <div className="flex justify-center items-center gap-4 mb-6">
          {current.sounds.map((sound, i) => (
            <React.Fragment key={i}>
              <button
                onClick={() => handleSoundClick(sound, i)}
                disabled={blendedSounds.length > i}
                className={`w-20 h-20 rounded-2xl text-3xl font-extrabold transition-all ${
                  blendedSounds.length > i
                    ? 'bg-green-500 text-white scale-110'
                    : blendedSounds.length === i
                    ? 'bg-blue-500 text-white animate-pulse hover:scale-105'
                    : 'bg-gray-300 text-gray-600'
                } disabled:cursor-not-allowed`}
              >
                {sound}
              </button>
              {i < current.sounds.length - 1 && <span className="text-3xl font-bold text-gray-400">+</span>}
            </React.Fragment>
          ))}
          <span className="text-3xl font-bold text-gray-400">=</span>
          <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 text-white text-3xl font-extrabold flex items-center justify-center">
            {blendedSounds.length === current.sounds.length ? current.word : '?'}
          </div>
        </div>
        {showSuccess && <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse"><div className="text-6xl mb-2">🎉</div><div className="text-3xl font-extrabold text-white">Perfect! You blended {current.word}!</div></div>}
      </div>
    </div>
  );
};

export default BlendingBridge;

