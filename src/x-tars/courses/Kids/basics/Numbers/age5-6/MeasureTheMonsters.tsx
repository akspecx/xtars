import React, { useState, useCallback } from 'react';

interface Monster {
  id: string;
  name: string;
  emoji: string;
  height: number;
  color: string;
}

const generateMonsters = (): Monster[] => {
  const monsterEmojis = ['👹', '👺', '👾', '🤖', '👽', '🦖', '🦕', '🐉'];
  const colors = ['bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-yellow-400', 'bg-indigo-400', 'bg-teal-400'];
  const names = ['Rex', 'Blu', 'Gigi', 'Pip', 'Zara', 'Max', 'Luna', 'Finn'];
  
  const numMonsters = 2 + Math.floor(Math.random() * 2); // 2-3 monsters
  const monsters: Monster[] = [];
  const usedHeights = new Set<number>();
  
  for (let i = 0; i < numMonsters; i++) {
    let height;
    do {
      height = 3 + Math.floor(Math.random() * 6); // 3-8 blocks
    } while (usedHeights.has(height));
    usedHeights.add(height);
    
    monsters.push({
      id: `monster-${i}`,
      name: names[i],
      emoji: monsterEmojis[i],
      height,
      color: colors[i]
    });
  }
  
  return monsters;
};

type QuestionType = 'tallest' | 'shortest' | 'difference' | 'total';

const MeasureTheMonsters: React.FC = () => {
  const [monsters, setMonsters] = useState<Monster[]>(generateMonsters());
  const [questionType, setQuestionType] = useState<QuestionType>('tallest');
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
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

  const getCorrectAnswer = (): string | number => {
    switch (questionType) {
      case 'tallest':
        return monsters.reduce((max, m) => m.height > max.height ? m : max).name;
      case 'shortest':
        return monsters.reduce((min, m) => m.height < min.height ? m : min).name;
      case 'difference':
        const tallest = Math.max(...monsters.map(m => m.height));
        const shortest = Math.min(...monsters.map(m => m.height));
        return tallest - shortest;
      case 'total':
        return monsters.reduce((sum, m) => sum + m.height, 0);
      default:
        return '';
    }
  };

  const getQuestion = (): string => {
    switch (questionType) {
      case 'tallest':
        return 'Which monster is the tallest?';
      case 'shortest':
        return 'Which monster is the shortest?';
      case 'difference':
        return 'How much taller is the tallest monster than the shortest?';
      case 'total':
        return 'What is the total height of all monsters combined?';
      default:
        return '';
    }
  };

  const getChoices = (): (string | number)[] => {
    const correct = getCorrectAnswer();
    
    if (questionType === 'tallest' || questionType === 'shortest') {
      return monsters.map(m => m.name);
    } else {
      const choices = new Set<number>([correct as number]);
      while (choices.size < 4) {
        const random = Math.floor(Math.random() * 20) + 1;
        choices.add(random);
      }
      return Array.from(choices).sort(() => Math.random() - 0.5);
    }
  };

  const handleAnswer = (answer: string | number) => {
    setSelectedAnswer(answer);
    setAttempts(prev => prev + 1);
    const correct = getCorrectAnswer();

    if (answer === correct) {
      setIsCorrect(true);
      setShowFeedback(true);
      setScore(prev => prev + 1);
      speak(`Correct! ${answer} is the right answer!`);

      setTimeout(() => {
        moveToNext();
      }, 2000);
    } else {
      setIsCorrect(false);
      setShowFeedback(true);
      speak('Not quite! Look at the blocks carefully and count again.');

      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const moveToNext = () => {
    const types: QuestionType[] = ['tallest', 'shortest', 'difference', 'total'];
    const currentIndex = types.indexOf(questionType);
    
    if (currentIndex < types.length - 1) {
      setQuestionType(types[currentIndex + 1]);
    } else {
      setMonsters(generateMonsters());
      setQuestionType('tallest');
    }
    
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const handlePlayInstructions = () => {
    speak('Count the blocks to measure each monster, then answer the question!');
  };

  const handleReset = () => {
    setMonsters(generateMonsters());
    setQuestionType('tallest');
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-teal-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-green-700 flex items-center gap-2">
              <span>📏 Measure the Monsters</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Compare heights using blocks!
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
              🔄 New Monsters
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

        {/* Question */}
        <div className="text-center mb-6 p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {getQuestion()}
          </h2>
        </div>

        {/* Monsters Display */}
        <div className="mb-6 p-6 bg-gray-50 rounded-2xl">
          <div className="flex justify-center items-end gap-4 sm:gap-8 min-h-[400px]">
            {monsters.map((monster) => (
              <div key={monster.id} className="flex flex-col items-center">
                {/* Monster */}
                <div className="text-5xl sm:text-6xl mb-2">{monster.emoji}</div>
                <div className="font-bold text-lg text-gray-800 mb-2">{monster.name}</div>
                
                {/* Blocks */}
                <div className="flex flex-col-reverse gap-1">
                  {Array.from({ length: monster.height }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${monster.color} border-2 border-gray-800 rounded-lg flex items-center justify-center font-bold text-white text-lg`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                
                {/* Height Label */}
                <div className="mt-2 px-3 py-1 bg-gray-800 text-white rounded-full font-bold text-sm">
                  {monster.height} blocks
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer Choices */}
        {!showFeedback && (
          <div className="mb-6">
            <div className={`grid ${
              questionType === 'tallest' || questionType === 'shortest' 
                ? `grid-cols-${monsters.length}` 
                : 'grid-cols-2 sm:grid-cols-4'
            } gap-4`}>
              {getChoices().map((choice) => (
                <button
                  key={choice}
                  onClick={() => handleAnswer(choice)}
                  className="p-4 rounded-2xl bg-gradient-to-br from-white to-gray-100 border-4 border-gray-300 hover:border-green-500 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="text-2xl sm:text-3xl font-extrabold text-gray-800">{choice}</span>
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
                ? `Correct! The answer is ${getCorrectAnswer()}!` 
                : 'Try again! Count the blocks carefully.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasureTheMonsters;
