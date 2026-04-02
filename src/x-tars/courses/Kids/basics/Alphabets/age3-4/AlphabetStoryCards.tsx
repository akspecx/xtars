import React, { useCallback, useState } from "react";
import { useProfile } from "../../../../../context/ProfileContext";
import { Volume2, BookOpen, Music, Sparkles, Wand2 } from "lucide-react";

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
    story: "An ant found an amazing apple and asked all his ant friends to share a crunchy picnic.",
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
    story: "A big blue ball bounced down the hill, bringing giggles to every kid on the playground.",
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
    story: "A curious cat crept quietly around the couch, chasing a tiny, tickly feather.",
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
    story: "A little drum went ding, ding, ding while kids danced and twirled in a happy circle.",
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
    story: "An excited engine echoed its /ĕ/ sound as it chugged over the bridge early in the morning.",
    items: [
      { emoji: "🚂", word: "Engine", sentence: "Engines echo an energetic /ĕ/." },
      { emoji: "🥚", word: "Egg", sentence: "Eggs easily crack with a soft tap." },
      { emoji: "🐘", word: "Elephant", sentence: "Elephants enjoy extra leafy snacks." },
    ],
  },
];

const AlphabetStoryCards: React.FC = () => {
  const { activeProfile } = useProfile();
  const [activeLetter, setActiveLetter] = useState<string>(storyCards[0].letter);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = new Map<string, StoryCard>(
    storyCards.map((card) => [card.letter, card])
  );

  const activeCard = cardMap.get(activeLetter) ?? storyCards[0];
  const isKids = activeProfile?.type === 'KIDS';

  const speak = useCallback(
    (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    []
  );

  const handlePlayStory = () => {
    speak(`${activeCard.letter} is for ${activeCard.name}. ${activeCard.story} ${activeCard.chant}`);
  };

  const handlePlayLetterSound = () => {
    speak(`${activeCard.letter}. ${activeCard.letter} says its sound in ${activeCard.name}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-rose-50 to-amber-50 p-4 md:p-8 flex flex-col items-center">
      <header className="text-center mb-8 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-pink-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent drop-shadow-xl mb-4 uppercase tracking-tighter">
          {isKids ? "STORY CARDS!" : "Alphabet Story Cards"}
        </h1>
        {!isKids && (
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Tap a letter to hear a tiny story, chant, and see picture friends that start with that letter.
          </p>
        )}
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-6 md:gap-10">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {storyCards.map((card) => {
            const isActive = card.letter === activeLetter;
            return (
              <button
                key={card.letter}
                onClick={() => setActiveLetter(card.letter)}
                className={`flex-none w-14 h-14 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] text-2xl md:text-4xl font-black shadow-xl transition-all border-4 flex items-center justify-center ${isActive ? `bg-gradient-to-r ${card.gradient} text-white border-white scale-110 shadow-2xl` : "bg-white text-gray-800 border-rose-50 hover:border-pink-200 hover:scale-105"}`}
              >
                {card.letter}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1">
            <div className="h-full rounded-[3rem] bg-white/90 backdrop-blur-xl shadow-2xl border-4 border-white p-8 flex flex-col items-center justify-between gap-8">
              <div className="space-y-6 text-center w-full">
                <div className={`inline-flex items-center justify-center rounded-[2.5rem] w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br ${activeCard.gradient} shadow-2xl border-8 border-white/50`}>
                  <span className={`text-7xl md:text-9xl font-black ${activeCard.color} drop-shadow-2xl`}>
                    {activeCard.letter}
                  </span>
                </div>
                <h2 className={`text-3xl md:text-5xl font-black ${activeCard.color} uppercase tracking-tighter`}>
                  {activeCard.name}
                </h2>
                {!isKids && <p className="text-xl text-gray-700 font-bold italic">"{activeCard.chant}"</p>}
              </div>

              <div className="flex flex-col gap-4 w-full">
                <button
                  onClick={handlePlayLetterSound}
                  className="w-full flex items-center justify-center gap-4 py-6 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/30"
                  disabled={isSpeaking}
                >
                  <Volume2 size={32} />
                  {!isKids && <span>Sound</span>}
                </button>
                <button
                  onClick={handlePlayStory}
                  className="w-full flex items-center justify-center gap-4 py-6 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white/30"
                  disabled={isSpeaking}
                >
                  <BookOpen size={32} />
                  {!isKids && <span>Story</span>}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="rounded-[3rem] bg-white/90 backdrop-blur-xl shadow-2xl border-4 border-rose-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black text-rose-700 uppercase tracking-widest flex items-center gap-3">
                  <Sparkles size={28} /> {isKids ? "PICTURES!" : "Picture Friends"}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeCard.items.map((item) => (
                  <div
                    key={item.word}
                    className="rounded-[2.5rem] bg-rose-50/50 border-4 border-rose-100 shadow-xl p-6 flex flex-col items-center text-center gap-4 hover:bg-rose-100 transition-all hover:scale-105"
                  >
                    <div className="text-6xl md:text-7xl drop-shadow-2xl">
                      {item.emoji}
                    </div>
                    <div className="text-2xl font-black text-rose-700 uppercase">
                      {item.word}
                    </div>
                    {!isKids && <p className="text-md text-rose-600 font-bold">{item.sentence}</p>}
                  </div>
                ))}
              </div>
            </div>

            {!isKids && (
              <div className="rounded-[3rem] bg-white/90 backdrop-blur-xl shadow-2xl border-4 border-amber-100 p-8 flex flex-col gap-6">
                <h3 className="text-2xl font-black text-amber-700 uppercase tracking-widest flex items-center gap-3">
                  <Wand2 size={28} /> Try This Together
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-amber-700 font-bold">
                  <li className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-100 flex items-center gap-4">✨ Trace the letter in the air!</li>
                  <li className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-100 flex items-center gap-4">✨ Find 1 object starting with {activeCard.letter}!</li>
                  <li className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-100 flex items-center gap-4">✨ Say the chant very slowly!</li>
                  <li className="bg-amber-50 p-4 rounded-3xl border-2 border-amber-100 flex items-center gap-4">✨ Whisper the secret story!</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetStoryCards;
