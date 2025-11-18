import React, { useCallback, useMemo, useState } from "react";

interface RhymeOption {
  emoji: string;
  word: string;
}

interface RhymeCard {
  id: string;
  focusLetter: string;
  color: string;
  gradient: string;
  prompt: string;
  anchor: RhymeOption;
  rhyming: RhymeOption;
  nonRhyming: RhymeOption;
}

const rhymeCards: RhymeCard[] = [
  {
    id: "a-cat-hat",
    focusLetter: "A",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    prompt: "Which picture rhymes with CAT?",
    anchor: { emoji: "🐱", word: "Cat" },
    rhyming: { emoji: "🎩", word: "Hat" },
    nonRhyming: { emoji: "🐀", word: "Rat" },
  },
  {
    id: "o-boat-goat",
    focusLetter: "O",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    prompt: "Which picture rhymes with BOAT?",
    anchor: { emoji: "🛶", word: "Boat" },
    rhyming: { emoji: "🐐", word: "Goat" },
    nonRhyming: { emoji: "🧥", word: "Coat" },
  },
  {
    id: "i-pig-wig",
    focusLetter: "I",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    prompt: "Which picture rhymes with PIG?",
    anchor: { emoji: "🐷", word: "Pig" },
    rhyming: { emoji: "👩‍🦱", word: "Wig" },
    nonRhyming: { emoji: "🐸", word: "Frog" },
  },
];

type ChoiceState = "idle" | "correct" | "incorrect";

const AlphabetRhyming: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(rhymeCards[0].id);
  const [choiceState, setChoiceState] = useState<ChoiceState>("idle");
  const [chosenWord, setChosenWord] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const rhymeMap = useMemo(
    () => new Map<string, RhymeCard>(rhymeCards.map((card) => [card.id, card])),
    []
  );

  const activeCard = rhymeMap.get(activeId) ?? rhymeCards[0];

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

  const resetForCard = (id: string) => {
    setActiveId(id);
    setChoiceState("idle");
    setChosenWord(null);
  };

  const handlePlayInstructions = () => {
    speak(
      `Listen for the ending sound. Which picture rhymes with ${activeCard.anchor.word}?`
    );
  };

  const handleChoice = (option: RhymeOption, isRhyming: boolean) => {
    setChosenWord(option.word);
    if (isRhyming) {
      setChoiceState("correct");
      speak(`${option.word} rhymes with ${activeCard.anchor.word}. They sound the same at the end!`);
    } else {
      setChoiceState("incorrect");
      speak(
        `${option.word} does not rhyme with ${activeCard.anchor.word}. Try tapping the other picture.`
      );
    }
  };

  const options: { option: RhymeOption; isRhyming: boolean }[] = [
    { option: activeCard.rhyming, isRhyming: true },
    { option: activeCard.nonRhyming, isRhyming: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-md mb-3">
            Rhyming Friends
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Listen for words that sound the same at the end. Pick the picture that rhymes with the anchor word.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {rhymeCards.map((card) => {
            const isActive = card.id === activeId;
            return (
              <button
                key={card.id}
                onClick={() => resetForCard(card.id)}
                className={`
                  px-4 py-2 rounded-full text-sm sm:text-base font-semibold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? `bg-gradient-to-r ${card.gradient} text-white border-transparent scale-105`
                      : "bg-white text-gray-800 border-purple-200 hover:border-purple-400 hover:scale-105"
                  }
                `}
              >
                {card.anchor.word.toUpperCase()} rhyme
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <div>
            <div className="rounded-3xl bg-white/95 shadow-xl border border-purple-100 p-6 sm:p-7 flex flex-col gap-4">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center gap-3 rounded-3xl px-5 py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">
                  <span className="text-3xl sm:text-4xl">
                    {activeCard.anchor.emoji}
                  </span>
                  <span className="text-xl sm:text-2xl font-extrabold">
                    {activeCard.anchor.word.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  {activeCard.prompt}
                </p>
              </div>

              <button
                onClick={handlePlayInstructions}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                disabled={isSpeaking}
              >
                🔊 Hear Instructions
              </button>

              {choiceState !== "idle" && chosenWord && (
                <div
                  className={`
                    rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold text-center
                    ${
                      choiceState === "correct"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }
                  `}
                >
                  {choiceState === "correct"
                    ? `${chosenWord} and ${activeCard.anchor.word} rhyme!`
                    : `${chosenWord} does not rhyme. Try the other picture.`}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-3xl bg-white/95 shadow-xl border border-pink-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2">
                Which One Rhymes?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Say the words slowly: {activeCard.anchor.word}, then each picture. Do they sound the same at the end?
              </p>
              <div className="grid grid-cols-2 gap-4">
                {options.map(({ option, isRhyming }) => {
                  const isChosen = chosenWord === option.word;
                  const isCorrectChoice =
                    isChosen && choiceState === "correct" && isRhyming;
                  const isWrongChoice =
                    isChosen && choiceState === "incorrect" && !isRhyming;

                  return (
                    <button
                      key={`${activeCard.id}-${option.word}`}
                      onClick={() => handleChoice(option, isRhyming)}
                      className={`
                        rounded-2xl border-2 p-4 bg-white flex flex-col items-center text-center gap-2
                        shadow-sm transition-all
                        ${
                          isCorrectChoice
                            ? "border-emerald-400 bg-emerald-50 scale-105 shadow-md"
                            : isWrongChoice
                            ? "border-rose-400 bg-rose-50 animate-shake"
                            : "border-gray-200 hover:border-pink-300 hover:shadow-md hover:scale-[1.03]"
                        }
                      `}
                    >
                      <span className="text-4xl sm:text-5xl drop-shadow-sm">
                        {option.emoji}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-gray-800">
                        {option.word}
                      </span>
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

export default AlphabetRhyming;


