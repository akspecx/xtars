import React, { useState } from "react";

// Match ladybug spots to numerals and finger patterns (1–5)

const LadybugSpotsMatch: React.FC = () => {
  const [target, setTarget] = useState<number>(1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<string>("Count the spots and tap the matching number!");

  const nextRound = () => {
    const next = 1 + Math.floor(Math.random() * 5);
    setTarget(next);
  };

  const handleSelect = (answer: number) => {
    const correct = answer === target;
    setAttempts((a) => a + 1);
    if (correct) {
      setScore((s) => s + 1);
      setMessage("🐞 Perfect match!");
    } else {
      setMessage("Try again. Look closely at the spots.");
    }
    setTimeout(() => {
      nextRound();
      setMessage("Count the spots and tap the matching number!");
    }, 900);
  };

  const renderSpots = () =>
    Array.from({ length: target }).map((_, i) => (
      <div
        key={i}
        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/80 shadow-sm"
      />
    ));

  const renderFingers = () =>
    "🖐".repeat(target > 5 ? 1 : 0); // kept simple; main focus is dots + numerals

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-lime-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 flex items-center gap-2">
              <span>🐞 Ladybug Spots Match</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Count the spots on the ladybug and tap the right number.
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm sm:text-base font-semibold shadow">
            Score: {score}/{attempts || 1}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="relative w-40 h-32 sm:w-52 sm:h-40">
            {/* Ladybug body */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-xl flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">{renderSpots()}</div>
            </div>
            {/* Head */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-10 rounded-full bg-gray-900 shadow-md flex items-center justify-center text-white text-lg">
              🐞
            </div>
          </div>
          {!!renderFingers() && (
            <div className="text-3xl" aria-hidden>
              {renderFingers()}
            </div>
          )}
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">
          {message}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => handleSelect(n)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border-2 border-emerald-300 text-emerald-700 text-xl sm:text-2xl font-bold flex items-center justify-center shadow-md active:scale-95 hover:bg-emerald-50 transition-transform"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LadybugSpotsMatch;


