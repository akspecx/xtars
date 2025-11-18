import React, { useCallback, useState } from "react";

interface StoryCard {
  letter: string;
  name: string;
  color: string;
  gradient: string;
  chant: string;
  story: string;
  items: { emoji: string; word: string; sentence: string }[];
}

const storyCards: StoryCard[] = [
  {
    letter: "A",
    name: "Amazing Apple",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    chant: "A, A, A — apple and ant lead the way!",
    story:
      "An ant found an amazing apple and asked all his ant friends to share a crunchy picnic.",
    items: [
      { emoji: "🍎", word: "Apple", sentence: "Apple starts with the /ă/ sound." },
      { emoji: "🐜", word: "Ant", sentence: "Ants march along saying /ă/ in apple." },
      { emoji: "✈️", word: "Airplane", sentence: "Airplanes roar with a loud A at takeoff." },
    ],
  },
  {
    letter: "B",
    name: "Bouncy Ball",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    chant: "B, B, B — bounce like a ball with me!",
    story:
      "A big blue ball bounced down the hill, bringing giggles to every kid on the playground.",
    items: [
      { emoji: "⚽", word: "Ball", sentence: "Ball begins with a bouncy /b/." },
      { emoji: "🐻", word: "Bear", sentence: "Bears stomp and say /b/ in bear." },
      { emoji: "📚", word: "Book", sentence: "Books bring bright ideas with B." },
    ],
  },
  {
    letter: "C",
    name: "Curious Cat",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    chant: "C, C, C — curl like a curious cat!",
    story:
      "A curious cat crept quietly around the couch, chasing a tiny, tickly feather.",
    items: [
      { emoji: "🐱", word: "Cat", sentence: "Cat curls with the /k/ sound." },
      { emoji: "🎂", word: "Cake", sentence: "Cake is a sweet C-sound treat." },
      { emoji: "🚗", word: "Car", sentence: "Cars can carry kids to class." },
    ],
  },
  {
    letter: "D",
    name: "Dancing Drum",
    color: "text-amber-600",
    gradient: "from-amber-200 to-yellow-300",
    chant: "D, D, D — drum and dance with me!",
    story:
      "A little drum went ding, ding, ding while kids danced and twirled in a happy circle.",
    items: [
      { emoji: "🥁", word: "Drum", sentence: "Drum beats with a deep /d/." },
      { emoji: "🦆", word: "Duck", sentence: "Duck dips and dives in the pond." },
      { emoji: "🚪", word: "Door", sentence: "Doors open for daily /d/ adventures." },
    ],
  },
  {
    letter: "E",
    name: "Excited Engine",
    color: "text-purple-600",
    gradient: "from-purple-200 to-violet-300",
    chant: "E, E, E — engine energy for me!",
    story:
      "An excited engine echoed its /ĕ/ sound as it chugged over the bridge early in the morning.",
    items: [
      { emoji: "🚂", word: "Engine", sentence: "Engines echo an energetic /ĕ/." },
      { emoji: "🥚", word: "Egg", sentence: "Eggs easily crack with a soft tap." },
      { emoji: "🐘", word: "Elephant", sentence: "Elephants enjoy extra leafy snacks." },
    ],
  },
];

const AlphabetStoryCards: React.FC = () => {
  const [activeLetter, setActiveLetter] = useState<string>(storyCards[0].letter);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = new Map<string, StoryCard>(
    storyCards.map((card) => [card.letter, card])
  );

  const activeCard = cardMap.get(activeLetter) ?? storyCards[0];

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
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const handlePlayStory = () => {
    speak(
      `${activeCard.letter} is for ${activeCard.name}. ${activeCard.story} ${activeCard.chant}`
    );
  };

  const handlePlayLetterSound = () => {
    speak(`${activeCard.letter}. ${activeCard.letter} says its sound in ${activeCard.name}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-rose-50 to-amber-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent drop-shadow-md mb-3">
            Alphabet Story Cards
          </h1>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Tap a letter to hear a tiny story, chant, and see picture friends that start with that letter.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {storyCards.map((card) => {
            const isActive = card.letter === activeLetter;
            return (
              <button
                key={card.letter}
                onClick={() => setActiveLetter(card.letter)}
                className={`
                  px-4 py-2 rounded-full text-lg sm:text-xl font-bold shadow-md transition-all
                  border-2
                  ${
                    isActive
                      ? `bg-gradient-to-r ${card.gradient} text-white border-transparent scale-110`
                      : "bg-white text-gray-800 border-pink-200 hover:border-pink-400 hover:scale-105"
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
            <div className="h-full rounded-3xl bg-white/90 shadow-xl border border-pink-100 p-6 sm:p-8 flex flex-col items-center justify-between gap-4">
              <div className="space-y-3 text-center">
                <div
                  className={`
                    inline-flex items-center justify-center rounded-2xl px-4 py-3
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
                  {activeCard.chant}
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handlePlayLetterSound}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                  disabled={isSpeaking}
                >
                  🔊 Hear Letter Sound
                </button>
                <button
                  onClick={handlePlayStory}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all text-sm sm:text-base disabled:opacity-60"
                  disabled={isSpeaking}
                >
                  📖 Play Story & Chant
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl bg-white/90 shadow-xl border border-rose-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-rose-700 mb-2">
                Picture Friends
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Tap each picture with your eyes and say the word. Listen for the{" "}
                <span className="font-semibold">{activeCard.letter}</span> sound at the
                beginning.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeCard.items.map((item) => (
                  <div
                    key={item.word}
                    className="rounded-2xl bg-rose-50 border border-rose-100 shadow-sm p-4 flex flex-col items-center text-center gap-2 hover:bg-rose-100 transition-colors"
                  >
                    <div className="text-4xl sm:text-5xl drop-shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-rose-700">
                      {item.word}
                    </div>
                    <p className="text-xs sm:text-sm text-rose-600">
                      {item.sentence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white/90 shadow-lg border border-amber-100 p-5 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-amber-700 mb-2">
                Try This Together
              </h3>
              <ul className="list-disc list-inside text-sm sm:text-base text-amber-700 space-y-1.5">
                <li>
                  Trace the big letter in the air while you say the chant slowly.
                </li>
                <li>
                  Look around the room and find one more object that starts with{" "}
                  <span className="font-semibold">{activeCard.letter}</span>.
                </li>
                <li>
                  Whisper the story again using your own name or your friend&apos;s name.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetStoryCards;


