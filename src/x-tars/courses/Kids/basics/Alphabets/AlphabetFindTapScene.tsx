import React, { useCallback, useMemo, useState } from "react";

interface SceneConfig {
  id: string;
  title: string;
  description: string;
  targetLetter: string;
  color: string;
  gradient: string;
  cells: string[]; // mixture of letters and scene emojis
}

const scenes: SceneConfig[] = [
  {
    id: "forest-s",
    title: "Sunny Forest",
    description: "Find all the letter S hiding in the sunny forest scene.",
    targetLetter: "S",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-lime-200",
    cells: ["🌳", "S", "🐿️", "S", "☀️", "🍄", "S", "🍃", "🦋", "S", "🌼", "🐻"],
  },
  {
    id: "classroom-t",
    title: "Tiny Classroom",
    description: "Find all the letter T in the tiny classroom.",
    targetLetter: "T",
    color: "text-sky-600",
    gradient: "from-sky-200 to-cyan-200",
    cells: ["📚", "T", "✏️", "🎒", "T", "🧸", "🪑", "T", "🧑‍🏫", "🧮", "T", "📏"],
  },
];

const AlphabetFindTapScene: React.FC = () => {
  const [activeSceneId, setActiveSceneId] = useState<string>(scenes[0].id);
  const [foundIndices, setFoundIndices] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sceneMap = useMemo(
    () => new Map<string, SceneConfig>(scenes.map((s) => [s.id, s])),
    []
  );

  const activeScene = sceneMap.get(activeSceneId) ?? scenes[0];

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

  const resetScene = (id: string) => {
    setActiveSceneId(id);
    setFoundIndices(new Set());
  };

  const handlePlayInstructions = () => {
    speak(
      `Look carefully in the picture. Tap every ${activeScene.targetLetter} you can find.`
    );
  };

  const handleCellClick = (value: string, index: number) => {
    if (value !== activeScene.targetLetter) {
      speak(
        `That is ${value}. We are searching for the letter ${activeScene.targetLetter}.`
      );
      return;
    }
    setFoundIndices((prev) => {
      if (prev.has(index)) {
        return prev;
      }
      const next = new Set(prev);
      next.add(index);
      const totalTargets = activeScene.cells.filter(
        (v) => v === activeScene.targetLetter
      ).length;
      if (next.size === totalTargets) {
        speak(
          `You found all the ${activeScene.targetLetter} letters! Great searching eyes.`
        );
      } else {
        speak(
          `Nice! You found a ${activeScene.targetLetter}. Keep looking for more.`
        );
      }
      return next;
    });
  };

  const totalTargets = activeScene.cells.filter(
    (v) => v === activeScene.targetLetter
  ).length;
  const progress =
    (foundIndices.size / Math.max(totalTargets, 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-lime-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-sky-600 to-lime-600 bg-clip-text text-transparent drop-shadow-md mb-3">
            Find & Tap the Letters
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Look carefully around the scene. Some tiles are pictures; some are letters. Tap all the tiles that match the target letter.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {scenes.map((scene) => {
            const isActive = scene.id === activeSceneId;
            return (
              <button
                key={scene.id}
                onClick={() => resetScene(scene.id)}
                className={`
                  px-4 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-white border-transparent scale-105"
                      : "bg-white text-gray-800 border-emerald-200 hover:border-emerald-400 hover:scale-105"
                  }
                `}
              >
                {scene.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-1">
            <div className="h-full rounded-3xl bg-white/95 shadow-xl border border-emerald-100 p-6 sm:p-7 flex flex-col justify-between gap-4">
              <div className="space-y-4">
                <h2
                  className={`text-xl sm:text-2xl font-extrabold ${activeScene.color}`}
                >
                  {activeScene.title}
                </h2>
                <p className="text-sm sm:text-base text-gray-700">
                  {activeScene.description}
                </p>

                <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-gradient-to-br from-emerald-400 to-sky-400 text-white shadow-md">
                  <span className="text-xs font-semibold uppercase">
                    Target Letter
                  </span>
                  <span className="text-2xl font-extrabold">
                    {activeScene.targetLetter}
                  </span>
                </div>

                <div className="max-w-xs">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Letters found
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      {foundIndices.size} / {totalTargets}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-sky-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlayInstructions}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                disabled={isSpeaking}
              >
                🔊 Hear Instructions
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/95 shadow-xl border border-sky-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-sky-700 mb-2">
                Tap all the {activeScene.targetLetter} letters
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Some tiles are pictures like trees and books; some tiles are the letter{" "}
                <span className="font-semibold">{activeScene.targetLetter}</span>. Tap every
                <span className="font-semibold"> {activeScene.targetLetter}</span> you see.
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 justify-items-center">
                {activeScene.cells.map((value, index) => {
                  const isFound = foundIndices.has(index);
                  const isLetter = value === activeScene.targetLetter;

                  return (
                    <button
                      key={`${activeScene.id}-cell-${index}`}
                      onClick={() => handleCellClick(value, index)}
                      className={`
                        w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-extrabold
                        transition-all shadow-sm
                        ${
                          isFound
                            ? "bg-gradient-to-br from-emerald-400 to-sky-400 text-white shadow-md scale-105"
                            : isLetter
                            ? "bg-gradient-to-br from-white to-emerald-50 border border-emerald-300 text-emerald-700 hover:border-emerald-500 hover:shadow-md hover:scale-[1.03]"
                            : "bg-white border border-gray-200 text-gray-700 hover:border-sky-300 hover:shadow-md hover:scale-[1.03]"
                        }
                      `}
                    >
                      {value}
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

export default AlphabetFindTapScene;


