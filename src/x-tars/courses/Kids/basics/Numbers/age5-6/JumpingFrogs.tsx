import React, { useState } from "react";

// Skip counting with a frog jumping along numbered lily pads

type Step = 2 | 5;

const JumpingFrogs: React.FC = () => {
  const [step, setStep] = useState<Step>(2);
  const [position, setPosition] = useState<number>(0);
  const [message, setMessage] = useState<string>("Tap the next lily pad to help the frog skip-count!");

  const path = step === 2 ? Array.from({ length: 11 }, (_, i) => i) : Array.from({ length: 11 }, (_, i) => i * 1);
  const max = step === 2 ? 20 : 50;

  const reset = (newStep?: Step) => {
    const s = newStep ?? step;
    setStep(s);
    setPosition(0);
    setMessage("Tap the next lily pad to help the frog skip-count!");
  };

  const targetNext = position + step;

  const handlePadClick = (value: number) => {
    if (value === targetNext) {
      setPosition(value);
      if (value + step > max) {
        setMessage("🐸 Great jumps! You reached the end!");
      } else {
        setMessage(`Good! Now jump to ${value + step}.`);
      }
    } else {
      setMessage("Oops, that's not the next skip. Try again.");
    }
  };

  const displayed = Array.from({ length: max / step + 1 }, (_, i) => i * step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-sky-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 flex items-center gap-2">
              <span>🐸 Jumping Frogs</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Skip-count by <span className="font-bold">{step}</span> to cross the pond.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => reset(2)}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow ${
                step === 2 ? "bg-emerald-500 text-white" : "bg-white text-emerald-700 border border-emerald-300"
              }`}
            >
              Count by 2s
            </button>
            <button
              type="button"
              onClick={() => reset(5)}
              className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow ${
                step === 5 ? "bg-emerald-500 text-white" : "bg-white text-emerald-700 border border-emerald-300"
              }`}
            >
              Count by 5s
            </button>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        <div className="flex justify-center overflow-x-auto">
          <div className="flex items-end gap-3 sm:gap-4 min-w-max px-4 pb-4 border-b-4 border-emerald-400">
            {displayed.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handlePadClick(n)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center text-sm sm:text-base font-bold transition-transform
                  ${n === position ? "bg-emerald-500 text-white border-emerald-600 scale-110" : "bg-emerald-100 border-emerald-400 text-emerald-800 hover:bg-emerald-200"}
                `}
              >
                {n}
                {n === position && <span className="absolute -top-6 text-2xl">🐸</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JumpingFrogs;


