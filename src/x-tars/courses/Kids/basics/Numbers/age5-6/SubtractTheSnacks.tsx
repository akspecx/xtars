import React, { useState, useCallback } from 'react';

interface Problem {
  start: number;
  subtract: number;
  answer: number;
  emoji: string;
  snackName: string;
}

const snackTypes = [
  { emoji: '🍪', name: 'cookies' },
  { emoji: '🍎', name: 'apples' },
  { emoji: '🍌', name: 'bananas' },
  { emoji: '🍇', name: 'grapes' },
  { emoji: '🍓', name: 'strawberries' },
  { emoji: '🥕', name: 'carrots' },
  { emoji: '🍊', name: 'oranges' },
  { emoji: '🍩', name: 'donuts' }
];

const SubtractTheSnacks: React.FC = () => {
  const [problem, setProblem] = useState<Problem>(generateProblem());
  const [eatenCount, setEatenCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  function generateProblem(): Problem {
    const start = 3 + Math.floor(Math.random() * 8); // 3-10
    const subtract = 1 + Math.floor(Math.random() * Math.min(start - 1, 5)); // 1-5, but not more than start-1
    const snack = snackTypes[Math.floor(Math.random() * snackTypes.length)];
    
    return {
      start,
      subtract,
      answer: start - subtract,
      emoji: snack.emoji,
      snackName: snack.name
    };
  }

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

  const handleSnackClick = (index: number) => {
    if (index < problem.subtract && eatenCount < problem.subtract) {
      setEatenCount(prev => prev + 1);
      
      if (eatenCount + 1 === problem.subtract) {
        setShowAnswer(true);
        speak(`You ate ${problem.subtract} ${problem.snackName}. How many are left?`);
      }
    }
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
    setAttempts(prev => prev + 1);

    if (answer === problem.answer) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(prev => prev + 1);
      speak(`Correct! ${problem.start} minus ${problem.subtract} equals ${problem.answer}!`);

      setTimeout(() => {
        setProblem(generateProblem());
        setEatenCount(0);
        setShowAnswer(false);
        setSelectedAnswer(null);
        setShowFeedback(false);
      }, 2500);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      speak('Not quite! Count the snacks that are left.');

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const generateChoices = (): number[] => {
    const choices = new Set<number>([problem.answer]);
    
    while (choices.size < 4) {
      const random = Math.floor(Math.random() * problem.start);
      if (random !== problem.answer) {
        choices.add(random);
      }
    }
    
    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  const handlePlayInstructions = () => {
    speak(`You have ${problem.start} ${problem.snackName}. Tap ${problem.subtract} to eat them, then tell me how many are left!`);
  };

  const handleReset = () => {
    setProblem(generateProblem());
    setEatenCount(0);
    setShowAnswer(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-orange-700 flex items-center gap-2">
              <span>🍪 Subtract the Snacks</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Learn subtraction by eating snacks!
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
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 New Problem
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

        {/* Problem Display */}
        <div className="text-center mb-6 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            You have {problem.start} {problem.snackName}
          </h2>
          <p className="text-lg sm:text-xl font-semibold text-gray-700">
            Tap {problem.subtract} {problem.snackName} to eat them!
          </p>
          {eatenCount > 0 && (
            <p className="text-lg font-bold text-orange-600 mt-2">
              Eaten: {eatenCount}/{problem.subtract}
            </p>
          )}
        </div>

        {/* Snacks Display */}
        <div className="mb-6 p-6 bg-gray-50 rounded-2xl">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-3 justify-items-center">
            {Array.from({ length: problem.start }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleSnackClick(index)}
                disabled={index < eatenCount || eatenCount >= problem.subtract}
                className={`text-5xl sm:text-6xl transition-all transform ${
                  index < eatenCount
                    ? 'opacity-20 scale-75 cursor-not-allowed'
                    : eatenCount < problem.subtract
                    ? 'hover:scale-125 active:scale-95 cursor-pointer animate-bounce'
                    : 'cursor-default'
                }`}
              >
                {problem.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Equation Display */}
        <div className="text-center mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
          <div className="text-3xl sm:text-4xl font-extrabold text-gray-800">
            {problem.start} - {problem.subtract} = {showAnswer ? '?' : '___'}
          </div>
        </div>

        {/* Answer Choices */}
        {showAnswer && !showFeedback && (
          <div className="mb-6">
            <h3 className="text-center text-xl font-bold text-gray-700 mb-4">
              How many {problem.snackName} are left?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {generateChoices().map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleAnswerSelect(choice)}
                  className="aspect-square rounded-2xl bg-gradient-to-br from-white to-gray-100 border-4 border-gray-300 hover:border-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                >
                  <span className="text-5xl font-extrabold text-gray-800">{choice}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
                ? `Correct! ${problem.start} - ${problem.subtract} = ${problem.answer}!` 
                : 'Try again! Count carefully.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtractTheSnacks;
