import React, { useCallback, useMemo, useState } from "react";

interface SoundOption {
  emoji: string;
  word: string;
  startsWith: string; // letter that this word starts with
}

interface SoundCard {
  letter: string;
  name: string;
  color: string;
  gradient: string;
  prompt: string;
  options: SoundOption[];
}

const soundCards: SoundCard[] = [
  {
    letter: "A",
    name: "Apple A",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    prompt: "Tap all the pictures that start with the A sound.",
    options: [
      { emoji: "🍎", word: "Apple", startsWith: "A" },
      { emoji: "🐜", word: "Ant", startsWith: "A" },
      { emoji: "☀️", word: "Sun", startsWith: "S" },
      { emoji: "🚗", word: "Car", startsWith: "C" },
    ],
  },
  {
    letter: "B",
    name: "Bouncy B",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    prompt: "Tap all the pictures that start with the B sound.",
    options: [
      { emoji: "⚽", word: "Ball", startsWith: "B" },
      { emoji: "🐻", word: "Bear", startsWith: "B" },
      { emoji: "🍌", word: "Banana", startsWith: "B" },
      { emoji: "🌳", word: "Tree", startsWith: "T" },
    ],
  },
  {
    letter: "C",
    name: "Curly C",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    prompt: "Tap all the pictures that start with the C sound.",
    options: [
      { emoji: "🐱", word: "Cat", startsWith: "C" },
      { emoji: "🎂", word: "Cake", startsWith: "C" },
      { emoji: "☁️", word: "Cloud", startsWith: "C" },
      { emoji: "🦆", word: "Duck", startsWith: "D" },
    ],
  },
  {
    letter: "D",
    name: "Drum D",
    color: "text-amber-600",
    gradient: "from-amber-200 to-yellow-300",
    prompt: "Tap all the pictures that start with the D sound.",
    options: [
      { emoji: "🥁", word: "Drum", startsWith: "D" },
      { emoji: "🐶", word: "Dog", startsWith: "D" },
      { emoji: "🚪", word: "Door", startsWith: "D" },
      { emoji: "🐱", word: "Cat", startsWith: "C" },
    ],
  },
  {
    letter: "E",
    name: "Excited E",
    color: "text-purple-600",
    gradient: "from-purple-200 to-violet-300",
    prompt: "Tap all the pictures that start with the short E sound.",
    options: [
      { emoji: "🥚", word: "Egg", startsWith: "E" },
      { emoji: "🐘", word: "Elephant", startsWith: "E" },
      { emoji: "🚂", word: "Engine", startsWith: "E" },
      { emoji: "🌙", word: "Moon", startsWith: "M" },
    ],
  },
];

const AlphabetBeginningSoundPicker: React.FC = () => {
  const [activeLetter, setActiveLetter] = useState<string>(soundCards[0].letter);
  const [correctPicks, setCorrectPicks] = useState<Set<string>>(new Set());
  const [incorrectPickId, setIncorrectPickId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = useMemo(
    () => new Map<string, SoundCard>(soundCards.map((card) => [card.letter, card])),
    []
  );

  const activeCard = cardMap.get(activeLetter) ?? soundCards[0];

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

  const resetForLetter = (letter: string) => {
    setActiveLetter(letter);
    setCorrectPicks(new Set());
    setIncorrectPickId(null);
  };

  const handlePlayInstructions = () => {
    speak(
      `Listen for the beginning sound. Tap all the pictures that start with the letter ${activeCard.letter}.`
    );
  };

  const handleOptionClick = (option: SoundOption, index: number) => {
    const id = `${activeCard.letter}-${option.word}-${index}`;
    const isCorrect = option.startsWith === activeCard.letter;

    if (isCorrect) {
      setCorrectPicks((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      speak(`${option.word} starts with ${activeCard.letter}!`);
    } else {
      setIncorrectPickId(id);
      speak(`${option.word} does not start with ${activeCard.letter}. Try a different picture.`);
      setTimeout(() => setIncorrectPickId(null), 800);
    }
  };

  const totalCorrectOptions = activeCard.options.filter(
    (opt) => opt.startsWith === activeCard.letter
  ).length;

  const progress = (correctPicks.size / Math.max(totalCorrectOptions, 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-500 bg-clip-text text-transparent drop-shadow-md mb-3">
            Beginning Sound Picker
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Listen for the first sound. Tap the pictures whose names start with the big letter.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {soundCards.map((card) => {
            const isActive = card.letter === activeLetter;
            return (
              <button
                key={card.letter}
                onClick={() => resetForLetter(card.letter)}
                className={`
                  px-4 py-2 rounded-full text-lg sm:text-xl font-bold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? `bg-gradient-to-r ${card.gradient} text-white border-transparent scale-110`
                      : "bg-white text-gray-800 border-indigo-200 hover:border-indigo-400 hover:scale-105"
                  }
                `}
              >
                {card.letter}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-1">
            <div className="h-full rounded-3xl bg-white/95 shadow-xl border border-indigo-100 p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-4 text-center">
                <div
                  className={`
                    inline-flex items-center justify-center rounded-3xl px-5 py-4
                    bg-gradient-to-br ${activeCard.gradient} shadow-md
                  `}
                >
                  <span
                    className={`text-6xl sm:text-7xl font-extrabold ${activeCard.color} drop-shadow-lg`}
                  >
                    {activeCard.letter}
                  </span>
                </div>
                <h2
                  className={`text-xl sm:text-2xl font-extrabold ${activeCard.color}`}
                >
                  {activeCard.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  {activeCard.prompt}
                </p>
              </div>

              <div className="space-y-3">
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Found correct pictures
                    </span>
                    <span className="text-xs font-bold text-indigo-600">
                      {correctPicks.size} / {totalCorrectOptions}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-sky-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePlayInstructions}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                  disabled={isSpeaking}
                >
                  🔊 Hear Instructions
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/95 shadow-xl border border-sky-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-sky-700 mb-2">
                Tap the Matching Pictures
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Say each word out loud. Does it start with{" "}
                <span className="font-semibold">{activeCard.letter}</span>?
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {activeCard.options.map((option, index) => {
                  const id = `${activeCard.letter}-${option.word}-${index}`;
                  const isCorrectPicked = correctPicks.has(id);
                  const isIncorrect = incorrectPickId === id;

                  return (
                    <button
                      key={id}
                      onClick={() => handleOptionClick(option, index)}
                      className={`
                        relative rounded-2xl border-2 p-3 sm:p-4 bg-white flex flex-col items-center text-center gap-2
                        shadow-sm transition-all
                        ${
                          isCorrectPicked
                            ? "border-emerald-400 bg-emerald-50 scale-105 shadow-md"
                            : isIncorrect
                            ? "border-red-400 bg-red-50 animate-shake"
                            : "border-gray-200 hover:border-indigo-300 hover:shadow-md hover:scale-[1.03]"
                        }
                      `}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-sm">
                        {option.emoji}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">
                        {option.word}
                      </span>
                      {isCorrectPicked && (
                        <span className="absolute -top-2 -right-2 text-lg">⭐</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.35s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AlphabetBeginningSoundPicker;


