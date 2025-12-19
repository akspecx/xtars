import React, { useState, useCallback } from 'react';

interface LetterAction {
  letter: string;
  action: string;
  emoji: string;
  instruction: string;
  animation: string;
}

const letterActions: LetterAction[] = [
  { letter: 'A', action: 'Arms Up', emoji: '🙌', instruction: 'Raise your arms high!', animation: 'animate-bounce' },
  { letter: 'B', action: 'Bounce', emoji: '⬆️⬇️', instruction: 'Bounce up and down!', animation: 'animate-bounce' },
  { letter: 'C', action: 'Clap', emoji: '👏', instruction: 'Clap your hands!', animation: 'animate-pulse' },
  { letter: 'D', action: 'Dance', emoji: '💃', instruction: 'Dance around!', animation: 'animate-spin' },
  { letter: 'E', action: 'Elbow Touch', emoji: '💪', instruction: 'Touch your elbows!', animation: 'animate-wiggle' },
  { letter: 'F', action: 'Feet Stomp', emoji: '👣', instruction: 'Stomp your feet!', animation: 'animate-bounce' },
  { letter: 'G', action: 'Giggle', emoji: '😄', instruction: 'Giggle and laugh!', animation: 'animate-pulse' },
  { letter: 'H', action: 'Hop', emoji: '🦘', instruction: 'Hop on one foot!', animation: 'animate-bounce' },
  { letter: 'I', action: 'Itch', emoji: '🤚', instruction: 'Pretend to itch!', animation: 'animate-wiggle' },
  { letter: 'J', action: 'Jump', emoji: '🤸', instruction: 'Jump high!', animation: 'animate-bounce' },
  { letter: 'K', action: 'Kick', emoji: '🦵', instruction: 'Kick your leg!', animation: 'animate-swing' },
  { letter: 'L', action: 'Lean', emoji: '🤸‍♀️', instruction: 'Lean to the side!', animation: 'animate-tilt' },
  { letter: 'M', action: 'March', emoji: '🚶', instruction: 'March in place!', animation: 'animate-march' },
  { letter: 'N', action: 'Nod', emoji: '🙂', instruction: 'Nod your head!', animation: 'animate-nod' },
  { letter: 'O', action: 'Open Arms', emoji: '🤗', instruction: 'Open your arms wide!', animation: 'animate-expand' },
  { letter: 'P', action: 'Point', emoji: '👉', instruction: 'Point forward!', animation: 'animate-point' },
  { letter: 'Q', action: 'Quiet', emoji: '🤫', instruction: 'Be very quiet!', animation: 'animate-fade' },
  { letter: 'R', action: 'Run', emoji: '🏃', instruction: 'Run in place!', animation: 'animate-run' },
  { letter: 'S', action: 'Spin', emoji: '🌀', instruction: 'Spin around!', animation: 'animate-spin' },
  { letter: 'T', action: 'Touch Toes', emoji: '🧘', instruction: 'Touch your toes!', animation: 'animate-bend' },
  { letter: 'U', action: 'Up & Down', emoji: '⬆️⬇️', instruction: 'Go up and down!', animation: 'animate-bounce' },
  { letter: 'V', action: 'Victory', emoji: '✌️', instruction: 'Make a V sign!', animation: 'animate-victory' },
  { letter: 'W', action: 'Wave', emoji: '👋', instruction: 'Wave hello!', animation: 'animate-wave' },
  { letter: 'X', action: 'X-Cross Arms', emoji: '❌', instruction: 'Cross your arms!', animation: 'animate-cross' },
  { letter: 'Y', action: 'Yawn', emoji: '🥱', instruction: 'Give a big yawn!', animation: 'animate-yawn' },
  { letter: 'Z', action: 'Zigzag', emoji: '⚡', instruction: 'Move in a zigzag!', animation: 'animate-zigzag' }
];

const AlphabetDanceParty: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPerforming, setIsPerforming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'sequential' | 'random'>('sequential');

  const currentLetter = letterActions[currentIndex];

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
      utterance.pitch = 1.3;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleLetterClick = (letterAction: LetterAction) => {
    setIsPerforming(true);
    setScore(prev => prev + 1);
    speak(`Letter ${letterAction.letter}! ${letterAction.action}! ${letterAction.instruction}`);

    setTimeout(() => {
      setIsPerforming(false);
      if (mode === 'sequential') {
        if (currentIndex < letterActions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setCurrentIndex(0);
        }
      } else {
        const randomIndex = Math.floor(Math.random() * letterActions.length);
        setCurrentIndex(randomIndex);
      }
    }, 3000);
  };

  const handlePlayInstructions = () => {
    speak(`Welcome to the Alphabet Dance Party! Tap each letter to see its special dance move! Letter ${currentLetter.letter} says ${currentLetter.action}!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-pink-700 flex items-center gap-2">
              <span>💃 Alphabet Dance Party</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Learn letters through fun actions!
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
              onClick={() => setMode(m => m === 'sequential' ? 'random' : 'sequential')}
              className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              {mode === 'sequential' ? '🔀 Random' : '📝 Sequential'}
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full font-bold text-lg shadow-lg">
            Dances Performed: {score}
          </div>
        </div>

        {/* Current Letter Display */}
        {isPerforming && (
          <div className={`mb-6 p-8 rounded-3xl bg-gradient-to-br from-yellow-200 to-orange-300 text-center ${currentLetter.animation}`}>
            <div className="text-9xl mb-4">{currentLetter.emoji}</div>
            <div className="text-6xl font-extrabold text-gray-800 mb-2">{currentLetter.letter}</div>
            <div className="text-3xl font-bold text-gray-700 mb-2">{currentLetter.action}</div>
            <div className="text-xl font-semibold text-gray-600">{currentLetter.instruction}</div>
          </div>
        )}

        {/* Alphabet Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-2 mb-6">
          {letterActions.map((letterAction, index) => (
            <button
              key={letterAction.letter}
              onClick={() => handleLetterClick(letterAction)}
              disabled={isPerforming}
              className={`aspect-square rounded-xl transition-all transform ${
                index === currentIndex && !isPerforming
                  ? 'bg-gradient-to-br from-pink-400 to-purple-500 text-white scale-110 shadow-xl animate-pulse'
                  : isPerforming && index === currentIndex
                  ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white scale-110'
                  : 'bg-gradient-to-br from-white to-gray-100 text-gray-800 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center text-center p-1`}
            >
              <div className="text-2xl sm:text-3xl font-extrabold">{letterAction.letter}</div>
              <div className="text-lg">{letterAction.emoji}</div>
            </button>
          ))}
        </div>

        {/* Action Guide */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
          <h3 className="text-center font-bold text-gray-700 mb-3">Quick Reference</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {letterActions.slice(0, 12).map((la) => (
              <div key={la.letter} className="bg-white px-2 py-1 rounded-lg text-center">
                <span className="font-bold text-pink-600">{la.letter}</span> = {la.action}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetDanceParty;
