import React, { useCallback, useMemo, useState } from "react";

interface UppercaseSentence {
  id: string;
  raw: string; // lowercase / mixed
  correct: string; // correctly capitalised
  explanation: string;
  highlightIndices: number[]; // indices of characters that should be uppercase in correct version
}

const sentences: UppercaseSentence[] = [
  {
    id: "sam-dog",
    raw: "sam has a dog.",
    correct: "Sam has a dog.",
    explanation: "Names like Sam start with a big, uppercase letter.",
    highlightIndices: [0],
  },
  {
    id: "i-like-ice-cream",
    raw: "i like ice cream.",
    correct: "I like ice cream.",
    explanation: "The word I is always written as a big, uppercase I.",
    highlightIndices: [0],
  },
  {
    id: "first-word",
    raw: "today we play.",
    correct: "Today we play.",
    explanation: "The first word in a sentence begins with an uppercase letter.",
    highlightIndices: [0],
  },
];

const AlphabetUppercaseUsage: React.FC = () => {
  const [activeId, setActiveId] = useState<string>(sentences[0].id);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sentenceMap = useMemo(
    () => new Map<string, UppercaseSentence>(sentences.map((s) => [s.id, s])),
    []
  );

  const activeSentence = sentenceMap.get(activeId) ?? sentences[0];

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

  const resetForSentence = (id: string) => {
    setActiveId(id);
    setSelectedIndices(new Set());
    setFeedback(null);
    setIsChecking(false);
  };

  const handlePlayInstructions = () => {
    speak(
      "Tap the letters that should be big, uppercase letters. Think about names, the word I, and the first word in a sentence."
    );
  };

  const handleCharClick = (index: number) => {
    const char = activeSentence.raw[index];
    if (!/[a-z]/.test(char)) {
      // only tap letters
      return;
    }
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCheck = () => {
    setIsChecking(true);
    const correctSet = new Set(activeSentence.highlightIndices);
    const isAllCorrect =
      correctSet.size === selectedIndices.size &&
      activeSentence.highlightIndices.every((i) => selectedIndices.has(i));

    if (isAllCorrect) {
      setFeedback("Great job! You found all the letters that should be uppercase.");
      speak("Great job! You found all the letters that should be uppercase.");
    } else {
      setFeedback(
        "Almost there. Look again at the start of the sentence, names, or the word I."
      );
      speak(
        "Almost there. Look again at the start of the sentence, names, or the word I."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-600 bg-clip-text text-transparent drop-shadow-md mb-3">
            Uppercase or Lowercase?
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Tap the letters in the sentence that should be big, uppercase letters. Then check your answer.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {sentences.map((sentence) => {
            const isActive = sentence.id === activeId;
            return (
              <button
                key={sentence.id}
                onClick={() => resetForSentence(sentence.id)}
                className={`
                  px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-400 to-violet-400 text-white border-transparent scale-105"
                      : "bg-white text-gray-800 border-indigo-200 hover:border-indigo-400 hover:scale-105"
                  }
                `}
              >
                Example {sentence.id === "sam-dog" ? "1" : sentence.id === "i-like-ice-cream" ? "2" : "3"}
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl bg-white/95 shadow-xl border border-indigo-100 p-5 sm:p-6 space-y-4">
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-indigo-700">
              Tap the letters that should be uppercase
            </h2>
            <p className="text-sm text-gray-600">
              Tap a letter to mark it. Tap again to unmark it. When you are ready, press{" "}
              <span className="font-semibold">Check</span>.
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Your sentence</p>
            <div className="flex flex-wrap gap-1 sm:gap-1.5 text-lg sm:text-2xl font-semibold">
              {activeSentence.raw.split("").map((char, index) => {
                const isSelected = selectedIndices.has(index);
                const isLetter = /[a-z]/.test(char);

                return (
                  <button
                    key={`${activeSentence.id}-${index}`}
                    type="button"
                    onClick={() => handleCharClick(index)}
                    className={`
                      min-w-[1.4rem] px-1 rounded-md transition-all
                      ${
                        isSelected
                          ? "bg-indigo-500 text-white shadow"
                          : "bg-transparent text-gray-900"
                      }
                      ${!isLetter ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    {char}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-sm">
            <p className="text-xs font-semibold text-slate-500">Correct version</p>
            <p className="font-semibold text-slate-800">{activeSentence.correct}</p>
            <p className="text-xs text-slate-600">{activeSentence.explanation}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between">
            <button
              onClick={handlePlayInstructions}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm disabled:opacity-60"
              disabled={isSpeaking}
            >
              🔊 Hear Hint
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedIndices(new Set());
                  setFeedback(null);
                  setIsChecking(false);
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Clear Marks
              </button>
              <button
                onClick={handleCheck}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60"
                disabled={isSpeaking}
              >
                ✅ Check
              </button>
            </div>
          </div>

          {isChecking && feedback && (
            <div
              className={`
                mt-2 rounded-2xl px-4 py-3 text-sm font-semibold text-center
                ${
                  feedback.startsWith("Great")
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }
              `}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlphabetUppercaseUsage;


