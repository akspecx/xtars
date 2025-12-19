import React, { useState } from "react";

// Simple subitizing game: show 1–5 dots and let kids pick the matching number.

const DOT_PATTERNS: number[] = [1, 2, 3, 4, 5];

const DotDashRockets: React.FC = () => {
  const [current, setCurrent] = useState<number>(() => DOT_PATTERNS[Math.floor(Math.random() * DOT_PATTERNS.length)]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string>("Tap the rocket that shows how many dots you see!");

  const pickNext = () => {
    const next = DOT_PATTERNS[Math.floor(Math.random() * DOT_PATTERNS.length)];
    setCurrent(next);
  };

  const handleAnswer = (answer: number) => {
    const isCorrect = answer === current;
    setAttempts((a) => a + 1);
    if (isCorrect) {
      setScore((s) => s + 1);
      setMessage("🚀 Great! You matched the dots!");
    } else {
      setMessage("🤔 Not yet. Try another number!");
    }
    setTimeout(() => {
      pickNext();
      setMessage("How many dots do you see?");
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
              <span>🚀 Dot Dash Rockets</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Look at the dots and tap the number that tells how many you see.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm sm:text-base font-semibold shadow">
              Score: {score}/{attempts || 1}
            </div>
          </div>
        </div>

        {/* Dots card */}
        <div className="flex justify-center mb-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl flex items-center justify-center">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: current }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white shadow-md"
                />
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">
          {message}
        </p>

        {/* Answer buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {DOT_PATTERNS.map((n) => (
            <button
              key={n}
              onClick={() => handleAnswer(n)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-indigo-300 text-indigo-700 text-xl sm:text-2xl font-bold flex items-center justify-center shadow-md active:scale-95 hover:bg-indigo-50 transition-transform"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DotDashRockets;


