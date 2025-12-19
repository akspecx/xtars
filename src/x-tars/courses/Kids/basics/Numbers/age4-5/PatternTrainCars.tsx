import React, { useState } from "react";

// Pattern completion with colored train cars (AB, AAB, ABC)

type PatternType = "AB" | "AAB" | "ABC";

const colors = ["bg-pink-500", "bg-yellow-400", "bg-sky-500", "bg-emerald-500"];

const PatternTrainCars: React.FC = () => {
  const [patternType, setPatternType] = useState<PatternType>("AB");
  const [sequence, setSequence] = useState<number[]>([0, 1, 0, 1, -1]);
  const [answerOptions, setAnswerOptions] = useState<number[]>([0, 1, 2]);
  const [message, setMessage] = useState<string>("Tap the car that completes the pattern.");

  const makePattern = () => {
    const types: PatternType[] = ["AB", "AAB", "ABC"];
    const pt = types[Math.floor(Math.random() * types.length)];
    let base: number[];
    if (pt === "AB") {
      base = [0, 1, 0, 1];
    } else if (pt === "AAB") {
      base = [0, 0, 1, 0, 0, 1];
    } else {
      base = [0, 1, 2, 0, 1];
    }
    const missingIndex = base.length; // next element
    const correct = pt === "AB" ? base[base.length - 2] : pt === "AAB" ? 1 : 2;
    const distractors = [0, 1, 2].filter((c) => c !== correct);
    const options = [correct, distractors[0]];

    setPatternType(pt);
    setSequence([...base, -1]);
    setAnswerOptions(options.sort(() => Math.random() - 0.5));
    setMessage("Tap the car that completes the pattern.");
  };

  const handleAnswer = (colorIdx: number) => {
    const correct =
      patternType === "AB"
        ? colorIdx === sequence[sequence.length - 2]
        : patternType === "AAB"
        ? colorIdx === 1
        : colorIdx === 2;
    if (correct) {
      setMessage("🚂 Pattern complete!");
      setTimeout(makePattern, 900);
    } else {
      setMessage("Not quite. Look at the colors again.");
    }
  };

  React.useEffect(() => {
    makePattern();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700 flex items-center gap-2">
              <span>🚂 Pattern Train Cars</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Look at the colors and choose which car comes next.
            </p>
          </div>
          <button
            type="button"
            onClick={makePattern}
            className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-sm sm:text-base font-semibold shadow-md active:scale-95 transition-transform"
          >
            🔄 New Pattern
          </button>
        </div>

        <p className="text-center text-base sm:text-lg font-medium text-gray-700 mb-4 min-h-[1.5rem]">{message}</p>

        {/* Pattern row */}
        <div className="flex items-center justify-center mb-6 overflow-x-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max px-4">
            <div className="text-3xl mr-2">🚂</div>
            {sequence.map((colorIndex, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 shadow-sm flex items-center justify-center ${
                  colorIndex === -1 ? "border-dashed border-gray-400 bg-gray-50" : `${colors[colorIndex]} border-transparent`
                }`}
              >
                {colorIndex === -1 && <span className="text-xs text-gray-400">?</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Answer choices */}
        <div className="flex flex-wrap justify-center gap-3">
          {answerOptions.map((cIdx) => (
            <button
              key={cIdx}
              type="button"
              onClick={() => handleAnswer(cIdx)}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-purple-300 bg-white shadow flex items-center justify-center active:scale-95 hover:bg-purple-50 transition-transform"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${colors[cIdx]} shadow-inner`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatternTrainCars;


