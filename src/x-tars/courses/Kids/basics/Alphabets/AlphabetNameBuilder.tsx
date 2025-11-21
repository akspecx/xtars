import React, { useCallback, useState } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const normalizeName = (name: string) =>
  name
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 8); // keep it short for little kids

const AlphabetNameBuilder: React.FC = () => {
  const [nameInput, setNameInput] = useState("AMY");
  const [targetName, setTargetName] = useState("AMY");
  const [slots, setSlots] = useState<(string | null)[]>(["A", "M", "Y"]);
  const [pool, setPool] = useState<string[]>(() => shuffleArray(["A", "M", "Y"]));
  const [isSpeaking, setIsSpeaking] = useState(false);

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

  const initialiseForName = (rawName: string) => {
    const cleaned = normalizeName(rawName || "A");
    const letters = cleaned.split("");

    // add a few distractors from alphabet
    const extraLetters = ALPHABET.filter((l) => !letters.includes(l)).slice(0, 3);
    const poolLetters = shuffleArray([...letters, ...extraLetters]);

    setTargetName(cleaned);
    setSlots(new Array(letters.length).fill(null));
    setPool(poolLetters);
    speak(
      `Let's build the name ${cleaned
        .split("")
        .join(" ")}. Tap letters from the bottom to put them into the boxes.`
    );
  };

  const handleApplyName = () => {
    const cleaned = normalizeName(nameInput);
    if (!cleaned) {
      speak("Please type at least one letter for your name.");
      return;
    }
    initialiseForName(cleaned);
  };

  const handlePoolLetterClick = (letter: string, index: number) => {
    const emptyIndex = slots.findIndex((s) => s === null);
    if (emptyIndex === -1) {
      speak("All boxes are full. Tap a box to clear it if you want to change a letter.");
      return;
    }
    setSlots((prev) => {
      const copy = [...prev];
      copy[emptyIndex] = letter;
      return copy;
    });
    setPool((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSlotClick = (slotIndex: number) => {
    setSlots((prev) => {
      const copy = [...prev];
      const letter = copy[slotIndex];
      if (letter) {
        setPool((poolPrev) => shuffleArray([...poolPrev, letter]));
      }
      copy[slotIndex] = null;
      return copy;
    });
  };

  const currentName = slots.map((s) => s ?? "_").join("");
  const isComplete = !slots.includes(null);
  const isCorrect = isComplete && currentName === targetName;

  const handleCheckName = () => {
    if (!isComplete) {
      speak("Some boxes are still empty. Try to fill all the boxes first.");
      return;
    }
    if (isCorrect) {
      speak(`Wow! You built ${targetName} perfectly. That is your name!`);
    } else {
      speak(
        `This spells ${currentName.split("").join(" ")}. Look carefully and see which letter needs to change.`
      );
    }
  };

  const handlePlayName = () => {
    speak(`Your name is ${targetName.split("").join(" ")}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-sky-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-md mb-3">
            Build Your Name
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Type a short name, then tap letters to fill the boxes and build it. The first letter is the big, uppercase letter.
          </p>
        </div>

        <div className="rounded-3xl bg-white/95 shadow-xl border border-sky-100 p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <label className="text-sm font-semibold text-gray-700">
              Type your name:
            </label>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={8}
              className="px-3 py-2 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-400 text-center uppercase tracking-wide text-gray-800 w-full sm:w-48"
              placeholder="AMY"
            />
            <button
              onClick={handleApplyName}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm"
            >
              Set Name
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Current name:{" "}
              <span className="font-semibold tracking-wide">
                {targetName.split("").join(" ")}
              </span>
            </p>
            <button
              onClick={handlePlayName}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold hover:bg-sky-200 transition-colors disabled:opacity-60"
              disabled={isSpeaking}
            >
              🔊 Hear My Name
            </button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/95 shadow-xl border border-indigo-100 p-5 sm:p-6 space-y-5">
          <div className="text-center space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-indigo-700">
              Tap letters to fill the boxes
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Tap a box to clear it. Tap a letter tile to place it in the next empty box.
            </p>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3 mb-4 flex-wrap">
            {slots.map((letter, index) => {
              const isFirst = index === 0;
              const display = letter ?? "_";
              return (
                <button
                  key={`slot-${index}`}
                  onClick={() => handleSlotClick(index)}
                  className={`
                    w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center
                    text-xl sm:text-2xl font-extrabold tracking-wide
                    ${
                      isFirst
                        ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                        : "border-sky-300 bg-sky-50 text-sky-700"
                    }
                  `}
                >
                  {display}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {pool.map((letter, index) => (
              <button
                key={`pool-${letter}-${index}`}
                onClick={() => handlePoolLetterClick(letter, index)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 text-white text-lg sm:text-xl font-extrabold flex items-center justify-center shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                {letter}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleCheckName}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
              disabled={isSpeaking}
            >
              ✅ Check My Name
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetNameBuilder;


