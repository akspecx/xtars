import React, { useState } from "react";

// Number bonds: choose pairs that make the target (e.g., 5 => 2+3, 1+4)

const targets = [4, 5, 6, 7, 8, 10];

const makeRound = () => {
  const target = targets[Math.floor(Math.random() * targets.length)];
  const options = Array.from({ length: target }, (_, i) => i + 1).filter((n) => n < target);
  return { target, options };
};

const NumberBondsBubbles: React.FC = () => {
  const [{ target, options }, setState] = useState(() => makeRound());
  const [first, setFirst] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Tap two bubbles that add up to the number in the cloud.");

  const reset = () => {
    setState(makeRound());
    setFirst(null);
    setMessage("Tap two bubbles that add up to the number in the cloud.");
  };

  const handleBubble = (n: number) => {
    if (first === null) {
      setFirst(n);
      setMessage(`You picked ${n}. Pick another bubble.`);
      return;
    }
    const sum = first + n;
    if (sum === target) {
      setMessage(`🎈 Yes! ${first} + ${n} = ${target}.`);
      setTimeout(reset, 1100);
    } else {
      setMessage(`Not ${sum}. Try a different pair.`);
      setFirst(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-sky-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-cyan-700 flex items-center gap-2">
              <span>💭 Number Bonds Bubbles</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Find two numbers that make <span className="font-bold">{target}</span> altogether.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Target
          </button>
        </div>

        <div className="flex justify-center mb-4">
          <div className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 text-white text-xl sm:text-2xl font-extrabold shadow-inner">
            {target}
          </div>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        <div className="flex flex-wrap justify-center gap-3">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleBubble(n)}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full text-lg sm:text-xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform
                ${first === n ? "bg-cyan-500 text-white" : "bg-white text-cyan-700 border-2 border-cyan-300 hover:bg-cyan-50"}
              `}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberBondsBubbles;


