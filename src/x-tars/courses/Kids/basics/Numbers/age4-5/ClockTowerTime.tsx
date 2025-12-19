import React, { useState, useCallback } from 'react';

interface TimeChallenge {
  id: string;
  hour: number;
  displayTime: string;
  activity: string;
  emoji: string;
}

const timeChallenges: TimeChallenge[] = [
  { id: '1', hour: 7, displayTime: '7:00', activity: 'Wake up time!', emoji: '🌅' },
  { id: '2', hour: 8, displayTime: '8:00', activity: 'Breakfast time!', emoji: '🥞' },
  { id: '3', hour: 12, displayTime: '12:00', activity: 'Lunch time!', emoji: '🍕' },
  { id: '4', hour: 3, displayTime: '3:00', activity: 'Snack time!', emoji: '🍪' },
  { id: '5', hour: 6, displayTime: '6:00', activity: 'Dinner time!', emoji: '🍝' },
  { id: '6', hour: 8, displayTime: '8:00', activity: 'Bedtime!', emoji: '🌙' },
  { id: '7', hour: 9, displayTime: '9:00', activity: 'School starts!', emoji: '🏫' },
  { id: '8', hour: 1, displayTime: '1:00', activity: 'Play time!', emoji: '⚽' },
  { id: '9', hour: 5, displayTime: '5:00', activity: 'Go home!', emoji: '🏠' },
  { id: '10', hour: 10, displayTime: '10:00', activity: 'Reading time!', emoji: '📚' }
];

const ClockTowerTime: React.FC = () => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentChallenge = timeChallenges[currentChallengeIndex];

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

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    setAttempts(prev => prev + 1);

    if (hour === currentChallenge.hour) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(prev => prev + 1);
      speak(`Correct! It's ${currentChallenge.displayTime}! ${currentChallenge.activity}`);

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedHour(null);
        if (currentChallengeIndex < timeChallenges.length - 1) {
          setCurrentChallengeIndex(prev => prev + 1);
        } else {
          setCurrentChallengeIndex(0);
        }
      }, 2500);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      speak('Not quite! Try again!');

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedHour(null);
      }, 1500);
    }
  };

  const handlePlayInstructions = () => {
    speak(`It's ${currentChallenge.activity} What time is it? Click the hour hand to show ${currentChallenge.displayTime}!`);
  };

  const handleReset = () => {
    setCurrentChallengeIndex(0);
    setSelectedHour(null);
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
  };

  // Generate clock face
  const renderClock = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    return (
      <svg width="300" height="300" viewBox="0 0 300 300" className="mx-auto">
        {/* Clock face */}
        <circle cx={centerX} cy={centerY} r={radius} fill="white" stroke="#333" strokeWidth="4" />
        
        {/* Hour markers and numbers */}
        {hours.map((hour) => {
          const angle = (hour * 30 - 90) * (Math.PI / 180);
          const x = centerX + (radius - 30) * Math.cos(angle);
          const y = centerY + (radius - 30) * Math.sin(angle);
          
          return (
            <g key={hour}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="20"
                fontWeight="bold"
                fill="#333"
                className="cursor-pointer hover:fill-blue-600"
                onClick={() => handleHourSelect(hour === 12 ? 12 : hour)}
              >
                {hour}
              </text>
            </g>
          );
        })}

        {/* Center dot */}
        <circle cx={centerX} cy={centerY} r="8" fill="#333" />

        {/* Hour hand (if selected) */}
        {selectedHour !== null && (
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + 60 * Math.cos(((selectedHour % 12) * 30 - 90) * (Math.PI / 180))}
            y2={centerY + 60 * Math.sin(((selectedHour % 12) * 30 - 90) * (Math.PI / 180))}
            stroke={isCorrect ? '#10b981' : '#ef4444'}
            strokeWidth="8"
            strokeLinecap="round"
          />
        )}

        {/* Minute hand (always at 12) */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX}
          y2={centerY - 80}
          stroke="#666"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 flex items-center gap-2">
              <span>🕐 Clock Tower Time</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Learn to tell time by the hour!
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
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Attempts: {attempts}
          </div>
        </div>

        {/* Activity Display */}
        <div className="text-center mb-6 p-6 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl">
          <div className="text-6xl mb-3">{currentChallenge.emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            {currentChallenge.activity}
          </h2>
          <p className="text-xl font-semibold text-gray-700">
            What time is it?
          </p>
        </div>

        {/* Clock */}
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
          <p className="text-center text-lg font-bold text-gray-700 mb-4">
            Click the number where the hour hand should point!
          </p>
          {renderClock()}
          <p className="text-center text-sm text-gray-600 mt-4">
            Hint: The short hand points to the hour, the long hand points to 12
          </p>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`text-center p-6 rounded-2xl ${
            isCorrect 
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
              : 'bg-gradient-to-r from-red-400 to-pink-500'
          }`}>
            <div className="text-6xl mb-2">{isCorrect ? '🎉' : '🤔'}</div>
            <div className="text-2xl font-extrabold text-white">
              {isCorrect 
                ? `Correct! It's ${currentChallenge.displayTime}!` 
                : 'Try again! Look at the numbers.'}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 flex justify-center gap-2">
          {timeChallenges.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentChallengeIndex
                  ? 'bg-blue-600 w-6'
                  : index < currentChallengeIndex
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

export default ClockTowerTime;
