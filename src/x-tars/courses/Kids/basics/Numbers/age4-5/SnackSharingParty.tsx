import React, { useState } from "react";

// Share snacks equally between 2–4 friends (informal division / subtraction)

interface Scenario {
  snacks: number;
  friends: number;
}

const makeScenario = (): Scenario => {
  const friends = 2 + Math.floor(Math.random() * 3); // 2–4
  const snacks = friends * (1 + Math.floor(Math.random() * 3)); // multiples 2–12
  return { snacks, friends };
};

const SnackSharingParty: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>(() => makeScenario());
  const [answer, setAnswer] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("How many snacks does each friend get if we share fairly?");

  const reset = () => {
    setScenario(makeScenario());
    setAnswer(null);
    setMessage("How many snacks does each friend get if we share fairly?");
  };

  const eachGets = scenario.snacks / scenario.friends;

  const choices = Array.from({ length: 4 }, (_, i) => eachGets - 1 + i).filter((n) => n > 0);

  const handleSelect = (n: number) => {
    setAnswer(n);
    if (n === eachGets) {
      setMessage("🎉 Yes! Everyone gets the same number of snacks.");
      setTimeout(reset, 1100);
    } else {
      setMessage("Not fair yet. Try a different number.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-orange-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-700 flex items-center gap-2">
              <span>🧁 Snack Sharing Party</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Share the snacks so each friend gets the same number.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Party
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mb-4 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-600 mb-1">Friends</div>
            <div className="flex gap-1 text-3xl">
              {Array.from({ length: scenario.friends }).map((_, i) => (
                <span key={i}>🧒</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-600 mb-1">Snacks</div>
            <div className="flex flex-wrap justify-center gap-1 text-2xl max-w-[180px]">
              {Array.from({ length: scenario.snacks }).map((_, i) => (
                <span key={i}>🍪</span>
              ))}
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
              className={`px-4 py-2 rounded-xl border-2 text-sm sm:text-base font-semibold shadow-sm active:scale-95 transition-transform
                ${answer === n ? "border-rose-500 bg-rose-50 text-rose-700" : "border-rose-200 bg-white text-rose-700 hover:bg-rose-50"}
              `}
            >
              {n} each
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SnackSharingParty;


