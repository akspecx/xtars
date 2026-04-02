import React, { useCallback, useMemo, useState } from "react";
import { useProfile } from "../../../../../context/ProfileContext";
import { Volume2, Search, Sparkles, CheckCircle2 } from "lucide-react";

interface SceneConfig {
  id: string;
  title: string;
  description: string;
  targetLetter: string;
  color: string;
  gradient: string;
  cells: string[];
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
  const { activeProfile } = useProfile();
  const [activeSceneId, setActiveSceneId] = useState<string>(scenes[0].id);
  const [foundIndices, setFoundIndices] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sceneMap = useMemo(
    () => new Map<string, SceneConfig>(scenes.map((s) => [s.id, s])),
    []
  );

  const activeScene = sceneMap.get(activeSceneId) ?? scenes[0];
  const isKids = activeProfile?.type === 'KIDS';

  const speak = useCallback(
    (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    []
  );

  const resetScene = (id: string) => {
    setActiveSceneId(id);
    setFoundIndices(new Set());
    speak(`New scene! Can you find all the letter ${sceneMap.get(id)?.targetLetter}?`);
  };

  const handlePlayInstructions = () => {
    speak(`Look carefully in the picture. Tap every ${activeScene.targetLetter} you can find.`);
  };

  const handleCellClick = (value: string, index: number) => {
    if (value !== activeScene.targetLetter) {
        speak(`That is ${value}. We are looking for ${activeScene.targetLetter}!`);
        return;
    }
    
    if (foundIndices.has(index)) return;

    setFoundIndices((prev) => {
      const next = new Set(prev);
      next.add(index);
      const totalTargets = activeScene.cells.filter((v) => v === activeScene.targetLetter).length;
      
      if (next.size === totalTargets) {
        speak(`You found them all! Great job finding the letter ${activeScene.targetLetter}!`);
      } else {
        speak(`You found one! Keep looking for more letter ${activeScene.targetLetter}.`);
      }
      return next;
    });
  };

  const totalTargets = activeScene.cells.filter((v) => v === activeScene.targetLetter).length;
  const progress = (foundIndices.size / Math.max(totalTargets, 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-lime-50 p-4 md:p-8 flex flex-col items-center">
      <header className="text-center mb-8 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-emerald-600 via-sky-600 to-lime-600 bg-clip-text text-transparent drop-shadow-xl mb-4 uppercase tracking-tighter">
          {isKids ? "FIND THE LETTERS!" : "Find & Tap the Letters"}
        </h1>
        {!isKids && (
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Look carefully around the scene. Tap all the tiles that match the target letter.
          </p>
        )}
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-6 md:gap-10">
        <div className="flex flex-wrap justify-center gap-4">
          {scenes.map((scene) => {
            const isActive = scene.id === activeSceneId;
            return (
              <button
                key={scene.id}
                onClick={() => resetScene(scene.id)}
                className={`px-8 py-4 rounded-full text-xl font-black shadow-xl transition-all border-4 flex items-center gap-3 ${isActive ? "bg-gradient-to-r from-emerald-400 to-sky-400 text-white border-white scale-110" : "bg-white text-gray-800 border-emerald-100 hover:border-emerald-300 hover:scale-105"}`}
              >
                <Search size={24} />
                {!isKids && scene.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <div className="h-full rounded-[3rem] bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-white p-8 flex flex-col justify-between gap-8">
              <div className="space-y-6 flex flex-col items-center text-center">
                <h2 className={`text-3xl md:text-5xl font-black ${activeCard ? activeScene.color : 'text-emerald-600'} uppercase tracking-tighter`}>
                  {activeScene.title}
                </h2>
                {!isKids && <p className="text-xl text-gray-700 font-medium">{activeScene.description}</p>}

                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="flex items-center gap-4 rounded-3xl p-6 bg-gradient-to-br from-emerald-400 to-sky-400 text-white shadow-2xl border-4 border-white/30 w-full justify-center">
                    {!isKids && <span className="text-sm font-black uppercase tracking-widest">Find</span>}
                    <span className="text-6xl font-black drop-shadow-lg">{activeScene.targetLetter}</span>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center px-4">
                      <span className="text-2xl font-black text-emerald-600 uppercase tracking-tighter">
                          ⭐ {foundIndices.size} / {totalTargets}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-6 border-4 border-white shadow-inner overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-emerald-400 to-sky-500 transition-all duration-700 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlayInstructions}
                className="w-full flex items-center justify-center gap-4 py-6 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all border-4 border-white/30"
                disabled={isSpeaking}
              >
                <Volume2 size={32} />
                {!isKids && <span>Instructions</span>}
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-[3rem] bg-white/95 backdrop-blur-xl shadow-2xl border-4 border-sky-100 p-8">
              {!isKids && (
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-sky-700 uppercase tracking-widest flex items-center gap-3">
                        <Sparkles size={28} /> Tap all the {activeScene.targetLetter} letters
                    </h3>
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-6 justify-items-center">
                {activeScene.cells.map((value, index) => {
                  const isFound = foundIndices.has(index);
                  const isLetter = value === activeScene.targetLetter;

                  return (
                    <button
                      key={`${activeScene.id}-cell-${index}`}
                      onClick={() => handleCellClick(value, index)}
                      className={`
                        w-20 h-20 md:w-32 md:h-32 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-5xl md:text-7xl font-black
                        transition-all shadow-xl border-4
                        ${isFound ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white border-white scale-110 shadow-2xl" : isLetter ? "bg-white border-emerald-100 text-emerald-700 hover:scale-110 hover:border-emerald-400" : "bg-white border-sky-50 text-gray-700 hover:scale-110 hover:border-sky-300"}
                      `}
                    >
                      {isFound ? <CheckCircle2 size={48} strokeWidth={4} /> : value}
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
