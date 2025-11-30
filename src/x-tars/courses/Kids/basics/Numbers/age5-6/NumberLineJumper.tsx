import React, { useState, useCallback } from 'react';

interface Challenge {
  start: number;
  target: number;
  moves: { direction: 'forward' | 'backward'; amount: number }[];
}

const generateChallenge = (difficulty: number): Challenge => {
  const start = 5 + Math.floor(Math.random() * 10); // 5-14
  const numMoves = Math.min(2 + difficulty, 4); // 2-4 moves
  const moves: { direction: 'forward' | 'backward'; amount: number }[] = [];
  
  let current = start;
  for (let i = 0; i < numMoves; i++) {
    const direction = Math.random() > 0.5 ? 'forward' : 'backward';
    const amount = 1 + Math.floor(Math.random() * 3); // 1-3
    
    // Ensure we don't go below 0 or above 20
    if (direction === 'backward' && current - amount < 0) {
      moves.push({ direction: 'forward', amount });
      current += amount;
    } else if (direction === 'forward' && current + amount > 20) {
      moves.push({ direction: 'backward', amount });
      current -= amount;
    } else {
      moves.push({ direction, amount });
      current += direction === 'forward' ? amount : -amount;
    }
  }
  
  return { start, target: current, moves };
};

const NumberLineJumper: React.FC = () => {
  const [difficulty, setDifficulty] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(generateChallenge(0));
  const [currentPosition, setCurrentPosition] = useState(challenge.start);
  const [moveIndex, setMoveIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

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

  const handleJump = (direction: 'forward' | 'backward') => {
    if (moveIndex >= challenge.moves.length) return;

    const currentMove = challenge.moves[moveIndex];
    setAttempts(prev => prev + 1);

    if (direction === currentMove.direction) {
      // Correct direction
      const newPosition = currentPosition + (direction === 'forward' ? currentMove.amount : -currentMove.amount);
      setCurrentPosition(newPosition);
      setMoveIndex(prev => prev + 1);
      
      speak(`Good! Jump ${direction} ${currentMove.amount}!`);

      // Check if challenge is complete
      if (moveIndex + 1 === challenge.moves.length) {
        if (newPosition === challenge.target) {
          setShowSuccess(true);
          setScore(prev => prev + 1);
          speak(`Perfect! You reached ${challenge.target}!`);
          
          setTimeout(() => {
            const newDifficulty = Math.min(difficulty + 1, 3);
            setDifficulty(newDifficulty);
            const newChallenge = generateChallenge(newDifficulty);
            setChallenge(newChallenge);
            setCurrentPosition(newChallenge.start);
            setMoveIndex(0);
            setShowSuccess(false);
          }, 3000);
        }
      }
    } else {
      // Wrong direction
      setShowError(true);
      speak(`Oops! Try the other direction!`);
      
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    }
  };

  const handlePlayInstructions = () => {
    const move = challenge.moves[moveIndex];
    if (move) {
      speak(`Jump ${move.direction} ${move.amount} step${move.amount > 1 ? 's' : ''}!`);
    } else {
      speak('Help the kangaroo jump on the number line to reach the target!');
    }
  };

  const handleReset = () => {
    const newChallenge = generateChallenge(difficulty);
    setChallenge(newChallenge);
    setCurrentPosition(newChallenge.start);
    setMoveIndex(0);
    setShowSuccess(false);
    setShowError(false);
  };

  const currentMove = challenge.moves[moveIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-green-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-green-700 flex items-center gap-2">
              <span>🦘 Number Line Jumper</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Jump forward and backward on the number line!
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
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 New Challenge
            </button>
          </div>
        </div>

        {/* Score */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Level: {difficulty + 1}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-blue-400 to-cyan-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Jumps: {attempts}
          </div>
        </div>

        {/* Current Move Instruction */}
        {currentMove && !showSuccess && (
          <div className="text-center mb-6 p-4 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Jump {currentMove.direction} {currentMove.amount} step{currentMove.amount > 1 ? 's' : ''}!
            </h2>
            <p className="text-lg text-gray-700 mt-2">
              Move {moveIndex + 1} of {challenge.moves.length}
            </p>
          </div>
        )}

        {/* Number Line */}
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl overflow-x-auto">
          <div className="flex items-end justify-center gap-1 min-w-max pb-4">
            {Array.from({ length: 21 }, (_, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Kangaroo */}
                {currentPosition === i && (
                  <div className="text-5xl mb-2 animate-bounce">🦘</div>
                )}
                
                {/* Target indicator */}
                {challenge.target === i && moveIndex === challenge.moves.length && (
                  <div className="text-3xl mb-2">🎯</div>
                )}
                
                {/* Number marker */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                  currentPosition === i
                    ? 'bg-green-500 text-white scale-125 shadow-xl'
                    : challenge.target === i
                    ? 'bg-yellow-400 text-gray-800 border-4 border-yellow-600'
                    : challenge.start === i
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {i}
                </div>
                
                {/* Label */}
                {(i === challenge.start || i === challenge.target || i === currentPosition) && (
                  <div className="text-xs font-bold text-gray-600 mt-1">
                    {i === challenge.start && moveIndex === 0 ? 'Start' : ''}
                    {i === challenge.target ? 'Target' : ''}
                    {i === currentPosition && i !== challenge.start ? 'Here' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Jump Controls */}
        {!showSuccess && currentMove && (
          <div className="flex justify-center gap-6 mb-6">
            <button
              onClick={() => handleJump('backward')}
              disabled={showError}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-400 to-pink-500 text-white text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              ⬅️ Jump Backward
            </button>
            <button
              onClick={() => handleJump('forward')}
              disabled={showError}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Jump Forward ➡️
            </button>
          </div>
        )}

        {/* Feedback */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Perfect! You reached {challenge.target}!
            </div>
          </div>
        )}

        {showError && (
          <div className="text-center p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
            <div className="text-xl font-bold text-white">
              Oops! Try the other direction!
            </div>
          </div>
        )}

        {/* Move History */}
        <div className="mt-6 p-4 bg-gray-50 rounded-2xl">
          <h4 className="text-center font-bold text-gray-700 mb-2">Moves Completed:</h4>
          <div className="flex justify-center gap-2 flex-wrap">
            {challenge.moves.map((move, index) => (
              <div
                key={index}
                className={`px-3 py-1 rounded-full font-bold text-sm ${
                  index < moveIndex
                    ? 'bg-green-500 text-white'
                    : index === moveIndex
                    ? 'bg-yellow-400 text-gray-800 animate-pulse'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {move.direction === 'forward' ? '➡️' : '⬅️'} {move.amount}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberLineJumper;
