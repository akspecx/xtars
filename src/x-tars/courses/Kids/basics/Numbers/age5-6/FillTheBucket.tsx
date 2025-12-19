import React, { useState } from "react";

// Informal measurement: choose how many scoops fill the bucket

const FillTheBucket: React.FC = () => {
  const [target, setTarget] = useState<number>(() => 3 + Math.floor(Math.random() * 3)); // 3–5
  const [scoops, setScoops] = useState<number>(0);
  const [message, setMessage] = useState<string>("Tap the scoop to fill the bucket. Can you fill it just right?");

  const reset = () => {
    setTarget(3 + Math.floor(Math.random() * 3));
    setScoops(0);
    setMessage("Tap the scoop to fill the bucket. Can you fill it just right?");
  };

  const handleScoop = () => {
    setScoops((s) => {
      const next = Math.min(6, s + 1);
      if (next === target) {
        setMessage("🎉 Perfect! The bucket is just right.");
      } else if (next > target) {
        setMessage("Oops, it’s overflowing! That’s too much.");
      } else {
        setMessage("Keep filling...");
      }
      return next;
    });
  };

  const percent = Math.min(100, (scoops / 6) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-100 to-cyan-100 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-sky-700 flex items-center gap-2">
              <span>🪣 Fill the Bucket</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Try to fill the bucket with exactly <span className="font-bold">{target}</span> scoops of water.
            </p>
          </div>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Bucket
          </button>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        <div className="flex flex-col sm:flex-row gap-8 items-center justify-center mb-4">
          {/* Bucket */}
          <div className="relative w-32 h-40 sm:w-36 sm:h-48 bg-sky-200 rounded-b-3xl rounded-t-xl border-4 border-sky-400 overflow-hidden shadow-inner">
            <div
              className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-sky-500 via-sky-400 to-sky-300 transition-all duration-500"
              style={{ height: `${percent}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-60">
              💧
            </div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-lg font-bold text-sky-700">
              {scoops} / 6
            </div>
          </div>

          {/* Scoop button */}
          <button
            type="button"
            onClick={handleScoop}
            className="flex flex-col items-center gap-2 px-5 py-4 rounded-3xl bg-white border-2 border-sky-300 shadow-md active:scale-95 hover:bg-sky-50 transition-transform"
          >
            <span className="text-4xl">🥄</span>
            <span className="text-sm sm:text-base font-semibold text-sky-700">Add a scoop</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          You need <strong>{Math.max(0, target - scoops)}</strong> more scoops to reach{" "}
          <span className="font-bold">{target}</span>.
        </p>
      </div>
    </div>
  );
};

export default FillTheBucket;


