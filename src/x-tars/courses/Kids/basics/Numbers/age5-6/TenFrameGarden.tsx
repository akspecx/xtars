import React, { useState } from "react";

// Ten-frame style planting game (numbers 1–10)

const makeTarget = () => 1 + Math.floor(Math.random() * 10);

const TenFrameGarden: React.FC = () => {
  const [target, setTarget] = useState<number>(() => makeTarget());
  const [planted, setPlanted] = useState<number>(0);
  const [message, setMessage] = useState<string>("Tap the garden to plant seeds until you match the number.");

  const reset = () => {
    setTarget(makeTarget());
    setPlanted(0);
    setMessage("Tap the garden to plant seeds until you match the number.");
  };

  const handlePlant = () => {
    setPlanted((p) => {
      const next = Math.min(10, p + 1);
      if (next === target) {
        setMessage("🌱 Perfect! You planted the right number of seeds.");
      } else if (next > target) {
        setMessage("Too many! Try clearing and starting again.");
      } else {
        setMessage("Keep planting...");
      }
      return next;
    });
  };

  const handleClear = () => {
    setPlanted(0);
    setMessage("Cleared! Start planting again.");
  };

  const cells = Array.from({ length: 10 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 flex items-center gap-2">
              <span>🌼 Ten-Frame Garden</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Plant exactly <span className="font-bold">{target}</span> seeds in the garden.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 New Number
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-full bg-white border border-emerald-300 text-emerald-700 text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
            >
              🧹 Clear
            </button>
          </div>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        <div className="flex justify-center mb-4">
          <button
            type="button"
            onClick={handlePlant}
            className="rounded-3xl border-4 border-emerald-400 bg-gradient-to-br from-emerald-200 to-green-200 px-4 py-4 shadow-inner active:scale-95 transition-transform"
          >
            <div className="grid grid-cols-5 gap-2 w-56 sm:w-64">
              {cells.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg border border-emerald-400 flex items-center justify-center ${
                    idx < planted ? "bg-emerald-500 text-yellow-100" : "bg-emerald-50 text-emerald-300"
                  }`}
                >
                  {idx < planted ? "🌱" : ""}
                </div>
              ))}
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Tip: How many more seeds do you need? <strong>{Math.max(0, target - planted)}</strong>
        </p>
      </div>
    </div>
  );
};

export default TenFrameGarden;


