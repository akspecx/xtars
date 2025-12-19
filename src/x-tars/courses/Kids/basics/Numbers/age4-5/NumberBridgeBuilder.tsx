import React, { useState } from "react";

// Simple number-line bridge: fill missing numbers 1–10.

const generateSequence = () => {
  const start = 1;
  const end = 10;
  const full = Array.from({ length: end - start + 1 }, (_, i) => start + i);
  // remove 2–3 random positions
  const missing = new Set<number>();
  while (missing.size < 3) {
    const candidate = start + Math.floor(Math.random() * (end - start + 1));
    if (candidate !== start && candidate !== end) missing.add(candidate);
  }
  const blanks = Array.from(missing);
  const bridge = full.map((n) => (missing.has(n) ? null : n));
  return { bridge, blanks };
};

const NumberBridgeBuilder: React.FC = () => {
  const [{ bridge, blanks }, setState] = useState(() => generateSequence());
  const [selected, setSelected] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Tap a missing stone, then tap the right number.");

  const reset = () => {
    setState(generateSequence());
    setSelected(null);
    setMessage("Tap a missing stone, then tap the right number.");
  };

  const handleStoneClick = (index: number) => {
    if (bridge[index] !== null) return;
    // select that position
    setSelected(index);
  };

  const handleNumberClick = (num: number) => {
    if (selected === null) return;
    const correctValue = selected + 1; // since sequence is 1..10
    if (num === correctValue) {
      const newBridge = [...bridge];
      newBridge[selected] = num;
      const remainingBlanks = blanks.filter((b) => b !== num);
      setState({ bridge: newBridge, blanks: remainingBlanks });
      setSelected(null);
      setMessage("Nice jump! Fill the next missing stone.");
    } else {
      setMessage("Not this one. Try a different number.");
    }
  };

  const allFilled = bridge.every((v) => v !== null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-700 flex items-center gap-2">
              <span>🌉 Number Bridge Builder</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Fill in the missing stones so the path counts from 1 to 10.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Bridge
          </button>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">
          {allFilled ? "Bridge complete! Great counting! 🎉" : message}
        </p>

        {/* Bridge stones */}
        <div className="flex justify-center mb-6 overflow-x-auto">
          <div className="flex gap-2 sm:gap-3">
            {bridge.map((value, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleStoneClick(idx)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center text-sm sm:text-lg font-bold transition-transform
                  ${value === null ? "border-dashed border-gray-400 bg-gray-50 text-gray-400" : "border-sky-400 bg-sky-100 text-sky-700"}
                  ${selected === idx ? "scale-110 ring-4 ring-amber-300" : ""}
                `}
              >
                {value ?? "?"}
              </button>
            ))}
          </div>
        </div>

        {/* Number choices */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleNumberClick(n)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border-2 border-sky-300 text-sky-700 text-sm sm:text-lg font-bold flex items-center justify-center shadow-sm active:scale-95 hover:bg-sky-50 transition-transform"
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberBridgeBuilder;


