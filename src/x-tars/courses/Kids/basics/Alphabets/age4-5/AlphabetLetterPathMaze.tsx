import React, { useCallback, useMemo, useState } from "react";

interface PathMazeCard {
  id: string;
  title: string;
  description: string;
  path: string[]; // sequence of letters to tap
  grid: string[]; // flattened grid of letters
  columns: number;
}

const mazeCards: PathMazeCard[] = [
  {
    id: "abcde",
    title: "A to E Path",
    description: "Tap A, then B, then C, then D, then E to draw the path.",
    path: ["A", "B", "C", "D", "E"],
    columns: 4,
    grid: [
      "A",
      "X",
      "B",
      "Y",
      "C",
      "Z",
      "D",
      "Q",
      "R",
      "S",
      "E",
      "T",
    ],
  },
  {
    id: "mnopq",
    title: "M to Q Path",
    description: "Tap M, then N, then O, then P, then Q to draw the path.",
    path: ["M", "N", "O", "P", "Q"],
    columns: 4,
    grid: [
      "M",
      "A",
      "N",
      "B",
      "C",
      "O",
      "P",
      "D",
      "E",
      "F",
      "Q",
      "G",
    ],
  },
];

const AlphabetLetterPathMaze: React.FC = () => {
  const [activeMazeId, setActiveMazeId] = useState<string>(mazeCards[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tappedIndices, setTappedIndices] = useState<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const mazeMap = useMemo(
    () => new Map<string, PathMazeCard>(mazeCards.map((m) => [m.id, m])),
    []
  );

  const activeMaze = mazeMap.get(activeMazeId) ?? mazeCards[0];

  const speak = useCallback(
    (text: string) => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined" &&
        !isSpeaking
      ) {
        window.speechSynthesis.cancel();
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const resetMaze = (id: string) => {
    setActiveMazeId(id);
    setCurrentStepIndex(0);
    setTappedIndices([]);
  };

  const handlePlayInstructions = () => {
    const sequence = activeMaze.path.join(", ");
    speak(
      `Help the letters make a path. Tap them in order: ${sequence}. Start with ${activeMaze.path[0]}.`
    );
  };

  const handleCellClick = (letter: string, index: number) => {
    const expectedLetter = activeMaze.path[currentStepIndex];

    if (letter === expectedLetter) {
      setTappedIndices((prev) => [...prev, index]);
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const isLast = nextIndex === activeMaze.path.length;

      if (isLast) {
        speak("You found the whole path! Great job following the letters.");
      } else {
        const nextLetter = activeMaze.path[nextIndex];
        speak(`Nice! Now find the letter ${nextLetter}.`);
      }
    } else {
      speak(
        `That is the letter ${letter}. Right now, we are looking for ${expectedLetter}.`
      );
    }
  };

  const progress =
    (currentStepIndex / Math.max(activeMaze.path.length, 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-rose-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-amber-600 via-rose-600 to-orange-500 bg-clip-text text-transparent drop-shadow-md mb-3">
            Letter Path Maze
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Tap the letters in order to draw a glowing path. Follow the sequence like a tiny letter treasure map.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {mazeCards.map((maze) => {
            const isActive = maze.id === activeMazeId;
            return (
              <button
                key={maze.id}
                onClick={() => resetMaze(maze.id)}
                className={`
                  px-4 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-rose-400 text-white border-transparent scale-105"
                      : "bg-white text-gray-800 border-amber-200 hover:border-amber-400 hover:scale-105"
                  }
                `}
              >
                {maze.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-1">
            <div className="h-full rounded-3xl bg-white/95 shadow-xl border border-amber-100 p-6 sm:p-7 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-amber-700">
                  {activeMaze.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-700">
                  {activeMaze.description}
                </p>

                <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3">
                  <div className="text-xs font-semibold text-amber-700 mb-2">
                    Letter path
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeMaze.path.map((letter, index) => {
                      const isDone = index < currentStepIndex;
                      const isNext = index === currentStepIndex;
                      return (
                        <div
                          key={`${activeMaze.id}-${letter}-${index}`}
                          className={`
                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                            ${
                              isDone
                                ? "bg-emerald-500 text-white"
                                : isNext
                                ? "bg-amber-500 text-white animate-pulse"
                                : "bg-white text-amber-700 border border-amber-200"
                            }
                          `}
                        >
                          {letter}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="max-w-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Path progress
                    </span>
                    <span className="text-xs font-bold text-amber-600">
                      {currentStepIndex} / {activeMaze.path.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlayInstructions}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                disabled={isSpeaking}
              >
                🔊 Hear Instructions
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/95 shadow-xl border border-rose-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-rose-700 mb-2">
                Tap the Letters to Make a Path
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Start with the first letter in the path, then keep going in order. Watch the glowing trail follow your taps!
              </p>

              <div
                className="grid gap-3 sm:gap-4 justify-items-center"
                style={{ gridTemplateColumns: `repeat(${activeMaze.columns}, minmax(0, 1fr))` }}
              >
                {activeMaze.grid.map((letter, index) => {
                  const isTapped = tappedIndices.includes(index);
                  const stepNumber = tappedIndices.indexOf(index);
                  const isCurrent =
                    stepNumber === tappedIndices.length - 1 &&
                    tappedIndices.length > 0;

                  return (
                    <button
                      key={`${activeMaze.id}-cell-${index}`}
                      onClick={() => handleCellClick(letter, index)}
                      className={`
                        relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
                        text-2xl sm:text-3xl font-extrabold
                        transition-all shadow-sm
                        ${
                          isTapped
                            ? "bg-gradient-to-br from-emerald-400 to-amber-400 text-white shadow-md scale-105"
                            : "bg-white border border-rose-200 text-rose-700 hover:border-rose-400 hover:shadow-md hover:scale-[1.03]"
                        }
                      `}
                    >
                      {letter}
                      {isTapped && (
                        <span
                          className={`
                            absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] sm:text-xs
                            flex items-center justify-center
                            ${
                              isCurrent
                                ? "bg-emerald-500 text-white animate-pulse"
                                : "bg-emerald-400 text-white"
                            }
                          `}
                        >
                          {stepNumber + 1}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetLetterPathMaze;


