import React, { useState } from "react";

// Concrete addition with animals: combine two pens and pick the total (up to 10)

interface Problem {
  a: number;
  b: number;
}

const makeProblem = (): Problem => {
  const a = 1 + Math.floor(Math.random() * 5);
  const b = 1 + Math.floor(Math.random() * 5);
  return { a, b };
};

const AddTheAnimals: React.FC = () => {
  const [problem, setProblem] = useState<Problem>(() => makeProblem());
  const [message, setMessage] = useState<string>("How many animals altogether?");

  const total = problem.a + problem.b;

  const choices = Array.from({ length: 4 }, (_, i) => total - 1 + i).filter((n) => n > 0);

  const reset = () => {
    setProblem(makeProblem());
    setMessage("How many animals altogether?");
  };

  const handleSelect = (n: number) => {
    if (n === total) {
      setMessage("🎉 Correct! That's the total.");
      setTimeout(reset, 1000);
    } else {
      setMessage("Not quite. Count again carefully.");
    }
  };

  const renderAnimals = (count: number, emoji: string) =>
    Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-2xl sm:text-3xl">
        {emoji}
      </span>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-700 flex items-center gap-2">
              <span>🐑 Add the Animals</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Count the animals in both pens and choose the total.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Question
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 flex flex-col items-center gap-2 shadow-inner">
            <div className="font-semibold text-sky-700 text-sm">Pen A</div>
            <div className="flex flex-wrap justify-center gap-1">
              {renderAnimals(problem.a, "🐑")}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex flex-col items-center gap-2 shadow-inner">
            <div className="font-semibold text-emerald-700 text-sm">Pen B</div>
            <div className="flex flex-wrap justify-center gap-1">
              {renderAnimals(problem.b, "🐑")}
            </div>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {choices.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleSelect(n)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border-2 border-sky-300 text-sky-700 text-lg sm:text-xl font-bold flex items-center justify-center shadow-sm active:scale-95 hover:bg-sky-50 transition-transform"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddTheAnimals;


