import React, { useState, useCallback } from 'react';

interface Shape {
  id: string;
  name: string;
  emoji: string;
  sides: number;
  corners: number;
  color: string;
  gradient: string;
}

const shapes: Shape[] = [
  { id: 'triangle', name: 'Triangle', emoji: '🔺', sides: 3, corners: 3, color: 'text-red-600', gradient: 'from-red-400 to-pink-500' },
  { id: 'square', name: 'Square', emoji: '🟦', sides: 4, corners: 4, color: 'text-blue-600', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'pentagon', name: 'Pentagon', emoji: '⬟', sides: 5, corners: 5, color: 'text-purple-600', gradient: 'from-purple-400 to-fuchsia-500' },
  { id: 'hexagon', name: 'Hexagon', emoji: '⬡', sides: 6, corners: 6, color: 'text-green-600', gradient: 'from-green-400 to-emerald-500' },
  { id: 'circle', name: 'Circle', emoji: '🔵', sides: 0, corners: 0, color: 'text-yellow-600', gradient: 'from-yellow-400 to-orange-500' }
];

type QuestionType = 'sides' | 'corners';

const ShapeNumberPuzzles: React.FC = () => {
  const [currentShapeIndex, setCurrentShapeIndex] = useState(0);
  const [questionType, setQuestionType] = useState<QuestionType>('sides');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const currentShape = shapes[currentShapeIndex];
  const correctAnswer = questionType === 'sides' ? currentShape.sides : currentShape.corners;

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

  const generateChoices = (): number[] => {
    const choices = new Set<number>([correctAnswer]);
    
    while (choices.size < 4) {
      const random = Math.floor(Math.random() * 8);
      choices.add(random);
    }
    
    return Array.from(choices).sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer: number) => {
    setAttempts(prev => prev + 1);
    
    if (answer === correctAnswer) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(prev => prev + 1);
      
      const message = currentShape.id === 'circle' 
        ? `Correct! A circle has no ${questionType}!`
        : `Correct! A ${currentShape.name} has ${correctAnswer} ${questionType}!`;
      speak(message);

      setTimeout(() => {
        setShowFeedback(false);
        moveToNext();
      }, 2000);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      speak(`Not quite! Try counting again.`);
      
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  const moveToNext = () => {
    if (questionType === 'sides') {
      setQuestionType('corners');
    } else {
      setQuestionType('sides');
      if (currentShapeIndex < shapes.length - 1) {
        setCurrentShapeIndex(prev => prev + 1);
      } else {
        setCurrentShapeIndex(0);
      }
    }
  };

  const handlePlayInstructions = () => {
    speak(`Count the ${questionType} of the ${currentShape.name} and choose the correct number!`);
  };

  const handleReset = () => {
    setCurrentShapeIndex(0);
    setQuestionType('sides');
    setShowFeedback(false);
    setScore(0);
    setAttempts(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-purple-700 flex items-center gap-2">
              <span>🔷 Shape Number Puzzles</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Count the sides and corners of shapes!
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

        {/* Shape Display */}
        <div className={`mb-6 p-8 rounded-3xl bg-gradient-to-br ${currentShape.gradient} flex flex-col items-center justify-center`}>
          <div className="text-9xl mb-4">{currentShape.emoji}</div>
          <div className="text-3xl font-extrabold text-white mb-2">{currentShape.name}</div>
        </div>

        {/* Question */}
        <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            How many {questionType} does this {currentShape.name.toLowerCase()} have?
          </h2>
        </div>

        {/* Answer Choices */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {generateChoices().map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              disabled={showFeedback}
              className="aspect-square rounded-2xl bg-gradient-to-br from-white to-gray-100 border-4 border-gray-300 hover:border-purple-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span className="text-5xl sm:text-6xl font-extrabold text-gray-800">{choice}</span>
            </button>
          ))}
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
                ? `Correct! ${correctAnswer} ${questionType}!` 
                : 'Try again! Count carefully.'}
            </div>
          </div>
        )}

        {/* Progress */}
        <div className="mt-6 flex justify-center gap-2">
          {shapes.map((shape, index) => (
            <div
              key={shape.id}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentShapeIndex
                  ? 'bg-purple-600 w-8'
                  : index < currentShapeIndex
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

export default ShapeNumberPuzzles;

