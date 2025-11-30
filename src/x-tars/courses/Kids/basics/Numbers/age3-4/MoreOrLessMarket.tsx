import React, { useState } from "react";

// Compare small quantities: which basket has more / fewer / same?

type Mode = "more" | "less" | "same";

const MoreOrLessMarket: React.FC = () => {
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(3);
  const [mode, setMode] = useState<Mode>("more");
  const [message, setMessage] = useState<string>("Tap: Which basket is correct?");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const randomSmall = () => 1 + Math.floor(Math.random() * 5);

  const nextRound = () => {
    let a = randomSmall();
    let b = randomSmall();
    if (a === b) {
      // keep equality only sometimes
      if (Math.random() < 0.4) {
        // keep equal
      } else {
        b = a + (Math.random() < 0.5 ? 1 : -1);
        if (b < 1) b = 2;
        if (b > 5) b = 4;
      }
    }
    const modes: Mode[] = ["more", "less", "same"];
    const m = modes[Math.floor(Math.random() * modes.length)];
    setLeft(a);
    setRight(b);
    setMode(m);
    setMessage("Tap: Which basket is correct?");
  };

  const check = (choice: "left" | "right" | "same") => {
    const correct =
      mode === "more"
        ? (choice === "left" && left > right) || (choice === "right" && right > left)
        : mode === "less"
        ? (choice === "left" && left < right) || (choice === "right" && right < left)
        : left === right && choice === "same";

    setAttempts((a) => a + 1);
    if (correct) {
      setScore((s) => s + 1);
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Try again!");
    }
    setTimeout(nextRound, 900);
  };

  const renderFruits = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <span key={i} className="text-xl sm:text-2xl">
        🍎
      </span>
    ));

  const modeLabel =
    mode === "more" ? "Which has MORE apples?" : mode === "less" ? "Which has FEWER apples?" : "Do they look the SAME?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-700 flex items-center gap-2">
              <span>🧺 More-or-Less Market</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">{modeLabel}</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-orange-50 border border-orange-200 text-orange-700 text-sm sm:text-base font-semibold shadow">
            Score: {score}/{attempts || 1}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <button
            type="button"
            onClick={() => check("left")}
            className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-inner p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="text-lg font-semibold text-orange-700">Basket A</div>
            <div className="flex flex-wrap justify-center gap-1 min-h-[2.5rem]">{renderFruits(left)}</div>
          </button>

          <button
            type="button"
            onClick={() => check("right")}
            className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-inner p-4 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className="text-lg font-semibold text-orange-700">Basket B</div>
            <div className="flex flex-wrap justify-center gap-1 min-h-[2.5rem]">{renderFruits(right)}</div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-base sm:text-lg font-medium text-gray-700 min-h-[1.5rem]">{message}</p>
          <button
            type="button"
            onClick={() => check("same")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            <span>🤝</span>
            <span>They Are the Same</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreOrLessMarket;


