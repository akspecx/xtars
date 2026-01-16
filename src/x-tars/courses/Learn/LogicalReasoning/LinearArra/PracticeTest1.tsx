import React, { useState } from 'react';
import { 
  CheckCircle, Target, ArrowLeft, RotateCcw
} from 'lucide-react';

const ComparisonExercise = () => {
  const [userOrder, setUserOrder] = useState([]);
  const [availableItems, setAvailableItems] = useState([
    { id: "X", label: "X", color: "bg-purple-500 dark:bg-purple-600" },
    { id: "Y", label: "Y", color: "bg-orange-500 dark:bg-orange-600" },
    { id: "Z", label: "Z", color: "bg-pink-500 dark:bg-pink-600" }
  ]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctOrder = ["X", "Y", "Z"];

  const handleItemClick = (item) => {
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    setUserOrder(prev => [...prev, item.id]);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const handleOrderItemClick = (itemId, index) => {
    const item = availableItems.find(i => i.id === itemId) || 
                 [{ id: "X", label: "X", color: "bg-purple-500 dark:bg-purple-600" },
                  { id: "Y", label: "Y", color: "bg-orange-500 dark:bg-orange-600" },
                  { id: "Z", label: "Z", color: "bg-pink-500 dark:bg-pink-600" }].find(i => i.id === itemId);
    
    if (item) {
      setAvailableItems(prev => [...prev, item]);
      setUserOrder(prev => prev.filter((_, i) => i !== index));
      setIsCorrect(null);
      setShowFeedback(false);
    }
  };

  const checkAnswer = () => {
    const correct = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setShowFeedback(true);
  };

  const resetOrder = () => {
    setAvailableItems([
      { id: "X", label: "X", color: "bg-purple-500 dark:bg-purple-600" },
      { id: "Y", label: "Y", color: "bg-orange-500 dark:bg-orange-600" },
      { id: "Z", label: "Z", color: "bg-pink-500 dark:bg-pink-600" }
    ]);
    setUserOrder([]);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const allItems = [
    { id: "X", label: "X", color: "bg-purple-500 dark:bg-purple-600" },
    { id: "Y", label: "Y", color: "bg-orange-500 dark:bg-orange-600" },
    { id: "Z", label: "Z", color: "bg-pink-500 dark:bg-pink-600" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Making Comparisons</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">Learn to compare and order items based on multiple criteria.</p>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Instructions:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Compare items using given relationships</span>
              </li>
              <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                <CheckCircle className="w-5 h-5 mt-0.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span>Apply logical reasoning to determine order</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Practice Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Available Robots:</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 min-h-40">
              <div className="flex flex-wrap justify-center gap-4">
                {availableItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`w-20 h-20 ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              {availableItems.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  All robots have been placed!
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Order:</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 min-h-40">
              {userOrder.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <ArrowLeft className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
                  Click robots to arrange them in order
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  {userOrder.map((itemId, index) => {
                    const item = allItems.find(i => i.id === itemId);
                    return item ? (
                      <button
                        key={`${itemId}-${index}`}
                        onClick={() => handleOrderItemClick(itemId, index)}
                        className={`w-20 h-20 ${item.color} rounded-xl flex items-center justify-center text-white font-bold text-2xl hover:scale-105 transition-all duration-200 shadow-lg relative`}
                      >
                        {item.label}
                        <span className="absolute -top-2 -right-2 bg-blue-600 dark:bg-blue-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                      </button>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`mb-6 p-6 rounded-xl ${
            isCorrect 
              ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700' 
              : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700'
          }`}>
            <div className={`font-semibold text-lg mb-2 ${
              isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'
            }`}>
              {isCorrect ? '🎉 Excellent! You got it right!' : '❌ Not quite right. Try again!'}
            </div>
            {isCorrect ? (
              <p className="text-green-700 dark:text-green-300">
                Great job! You've successfully completed this practice exercise.
              </p>
            ) : (
              <p className="text-red-700 dark:text-red-300">
                Review the instructions and try rearranging the robots.
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={checkAnswer}
            disabled={userOrder.length === 0}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              userOrder.length === 0 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            Check Answer
          </button>
          
          <button
            onClick={resetOrder}
            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 hover:shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonExercise;