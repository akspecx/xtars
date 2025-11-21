import React, { useCallback, useMemo, useState } from "react";

interface LetterPuzzlePiece {
  id: string;
  label: string;
  description: string;
}

interface LetterPuzzleCard {
  letter: string;
  name: string;
  color: string;
  gradient: string;
  hint: string;
  pieces: LetterPuzzlePiece[];
}

const puzzleCards: LetterPuzzleCard[] = [
  {
    letter: "A",
    name: "Letter A Tent",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    hint: "A is like a tent: two sides and a bridge in the middle.",
    pieces: [
      { id: "left", label: "Left Side", description: "A tall slanted line on the left." },
      { id: "right", label: "Right Side", description: "A tall slanted line on the right." },
      { id: "bridge", label: "Middle Bridge", description: "A short line across the middle." },
    ],
  },
  {
    letter: "B",
    name: "Letter B Bubbles",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    hint: "B is a stick with two round bubbles.",
    pieces: [
      { id: "stick", label: "Tall Stick", description: "A straight line down." },
      { id: "topBubble", label: "Top Bubble", description: "A round bump at the top." },
      { id: "bottomBubble", label: "Bottom Bubble", description: "A round bump at the bottom." },
    ],
  },
  {
    letter: "C",
    name: "Letter C Cookie",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    hint: "C is like a cookie with one tiny bite taken out.",
    pieces: [
      { id: "curve", label: "Big Curve", description: "A big open curve." },
      { id: "top", label: "Top Tip", description: "A soft curve at the top." },
      { id: "bottom", label: "Bottom Tip", description: "A soft curve at the bottom." },
    ],
  },
];

const AlphabetLetterPuzzle: React.FC = () => {
  const [activeLetter, setActiveLetter] = useState<string>(puzzleCards[0].letter);
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = useMemo(
    () => new Map<string, LetterPuzzleCard>(puzzleCards.map((card) => [card.letter, card])),
    []
  );

  const activeCard = cardMap.get(activeLetter) ?? puzzleCards[0];

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
    setPlacedPieces(new Set());
  };

  const handlePlayInstructions = () => {
    speak(
      `Tap the pieces to build letter ${activeCard.letter}. When all the pieces glow on the letter, you built it!`
    );
  };

  const handlePieceToggle = (pieceId: string, label: string) => {
    setPlacedPieces((prev) => {
      const next = new Set(prev);
      if (next.has(pieceId)) {
        next.delete(pieceId);
        speak(`You removed ${label} from the letter.`);
      } else {
        next.add(pieceId);
        speak(`You added ${label} to the letter.`);
      }
      return next;
    });
  };

  const totalPieces = activeCard.pieces.length;
  const progress = (placedPieces.size / Math.max(totalPieces, 1)) * 100;
  const isComplete = placedPieces.size === totalPieces;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-emerald-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-violet-600 via-sky-600 to-emerald-500 bg-clip-text text-transparent drop-shadow-md mb-3">
            Build the Letter
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Tap the colorful pieces to snap them onto the big letter. When every piece is glowing, your letter is built!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {puzzleCards.map((card) => {
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
                      : "bg-white text-gray-800 border-violet-200 hover:border-violet-400 hover:scale-105"
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
            <div className="h-full rounded-3xl bg-white/95 shadow-xl border border-violet-100 p-6 sm:p-8 flex flex-col justify-between gap-4">
              <div className="space-y-4 text-center">
                <div
                  className={`
                    relative inline-flex items-center justify-center rounded-[2.5rem] px-8 py-8
                    bg-gradient-to-br ${activeCard.gradient} shadow-lg
                  `}
                >
                  <span
                    className={`text-7xl sm:text-8xl font-extrabold ${activeCard.color} drop-shadow-[0_6px_10px_rgba(0,0,0,0.2)]`}
                  >
                    {activeCard.letter}
                  </span>

                  {activeCard.pieces.map((piece, index) => {
                    const isPlaced = placedPieces.has(piece.id);
                    const basePositions = [
                      "top-4 left-6",
                      "bottom-6 left-8",
                      "top-10 right-8",
                      "bottom-8 right-6",
                    ];
                    const pos = basePositions[index % basePositions.length];
                    return (
                      <div
                        key={piece.id}
                        className={`
                          absolute ${pos} w-5 h-5 sm:w-6 sm:h-6 rounded-full
                          transition-all duration-300
                          ${
                            isPlaced
                              ? "bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)] scale-110"
                              : "bg-white/40 border border-white/70"
                          }
                        `}
                      />
                    );
                  })}
                </div>

                <h2
                  className={`text-xl sm:text-2xl font-extrabold ${activeCard.color}`}
                >
                  {activeCard.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 font-medium">
                  {activeCard.hint}
                </p>
              </div>

              <div className="space-y-3">
                <div className="max-w-xs mx-auto">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Pieces placed
                    </span>
                    <span className="text-xs font-bold text-violet-600">
                      {placedPieces.size} / {totalPieces}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {isComplete && (
                    <div className="mt-1 text-xs text-emerald-600 font-semibold">
                      Letter complete! 🎉
                    </div>
                  )}
                </div>

                <button
                  onClick={handlePlayInstructions}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-500 to-sky-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                  disabled={isSpeaking}
                >
                  🔊 Hear Instructions
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white/95 shadow-xl border border-emerald-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-700 mb-2">
                Tap the Pieces to Build the Letter
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tap a piece once to snap it onto the glowing spots on the letter. Tap again if you want to try a different piece.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeCard.pieces.map((piece, index) => {
                  const isPlaced = placedPieces.has(piece.id);
                  const colors = [
                    "from-pink-400 to-rose-500",
                    "from-sky-400 to-cyan-500",
                    "from-emerald-400 to-lime-500",
                  ];
                  const gradient = colors[index % colors.length];
                  return (
                    <button
                      key={piece.id}
                      onClick={() => handlePieceToggle(piece.id, piece.label)}
                      className={`
                        rounded-2xl border-2 p-4 bg-white flex flex-col items-center text-center gap-2
                        shadow-sm transition-all
                        ${
                          isPlaced
                            ? `bg-gradient-to-br ${gradient} border-emerald-400 text-white scale-105 shadow-md`
                            : "border-gray-200 hover:border-emerald-300 hover:shadow-md hover:scale-[1.03]"
                        }
                      `}
                    >
                      <div
                        className={`
                          w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient}
                          flex items-center justify-center text-2xl sm:text-3xl text-white shadow-md
                        `}
                      >
                        {index + 1}
                      </div>
                      <div
                        className={`
                          text-sm sm:text-base font-bold ${
                            isPlaced ? "text-white" : "text-gray-800"
                          }
                        `}
                      >
                        {piece.label}
                      </div>
                      <p
                        className={`
                          text-xs sm:text-sm ${
                            isPlaced ? "text-emerald-50" : "text-gray-600"
                          }
                        `}
                      >
                        {piece.description}
                      </p>
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

export default AlphabetLetterPuzzle;


