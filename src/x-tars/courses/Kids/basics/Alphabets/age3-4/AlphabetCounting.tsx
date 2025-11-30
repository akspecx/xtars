import React, { useCallback, useMemo, useState } from "react";

interface AlphabetCountingItem {
  emoji: string;
  word: string;
  sentence: string;
}

interface AlphabetCountingCard {
  letter: string;
  name: string;
  color: string;
  gradient: string;
  sound: string;
  headline: string;
  description: string;
  chant: string;
  story: string;
  items: AlphabetCountingItem[];
  actions: string[];
}

const alphabetCountingCards: AlphabetCountingCard[] = [
  {
    letter: "A",
    name: "Amazing Apple",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    sound: "/ă/",
    headline: "A is for the apple that starts our alphabet adventure.",
    description: "When we say A, our mouths open wide like we're tasting a juicy apple.",
    chant: "A-A-Apple! A taps the front of your smile!",
    story: "Trace the letter A in the air while you pretend to munch an apple slice.",
    items: [
      { emoji: "🍎", word: "Apple", sentence: "Apples crunch with the /ă/ sound." },
      { emoji: "🐜", word: "Ant", sentence: "Ants march along saying /ă/." },
      { emoji: "🚀", word: "Astronaut", sentence: "Astronauts shout 'A-OK!' when they blast off." }
    ],
    actions: ["Draw a big triangle A with your arms.", "Chomp pretend apples three times.", "Tap the top of your mouth to feel the /ă/ sound."]
  },
  {
    letter: "B",
    name: "Bouncy Ball",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    sound: "/b/",
    headline: "B is a bouncy sound that starts with your lips together.",
    description: "Press your lips, pop them open, and you’ll hear /b/ like a bouncing ball.",
    chant: "B-B-Bounce! B pops like a bubble!",
    story: "Clap your hands softly each time you feel the B sound.",
    items: [
      { emoji: "🍼", word: "Bottle", sentence: "Bottle begins with a baby B sound." },
      { emoji: "🦬", word: "Bison", sentence: "Bison stomp the prairie with a bold /b/." },
      { emoji: "🎈", word: "Balloon", sentence: "Balloons blow up with a big B breath." }
    ],
    actions: ["Bounce in place saying /b/ each time you land.", "Hold your lips shut, then pop them to feel the sound.", "Drum gently on your cheeks like a bongo beat."]
  },
  {
    letter: "C",
    name: "Curvy Cat",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    sound: "/k/",
    headline: "C can curl its tail to make the /k/ sound like a curious cat.",
    description: "Slide your tongue to the back of your mouth and let a soft puff of air out.",
    chant: "C-C-Cat! Curl, click, create!",
    story: "Trace a big letter C in the air like you’re drawing a kitten’s tail.",
    items: [
      { emoji: "🐱", word: "Cat", sentence: "Cats creep quietly with /k/ steps." },
      { emoji: "🌜", word: "Crescent", sentence: "A crescent moon curves like letter C." },
      { emoji: "🧀", word: "Cheese", sentence: "Cheese begins with the tricky C-H team." }
    ],
    actions: ["Make claws with your hands and swipe a C shape.", "Whisper /k/ while blowing a tiny puff of air.", "Pretend to curl like a cat napping."]
  },
  {
    letter: "D",
    name: "Dancing Drum",
    color: "text-amber-600",
    gradient: "from-amber-200 to-yellow-300",
    sound: "/d/",
    headline: "D taps the front of your tongue on the roof of your mouth.",
    description: "Touch behind your teeth, drop your tongue, and a gentle /d/ appears.",
    chant: "D-D-Drum! Tap tap tap!",
    story: "Pat your lap like a drum each time you say D.",
    items: [
      { emoji: "🥁", word: "Drum", sentence: "Drums beat with a deep D sound." },
      { emoji: "🦌", word: "Deer", sentence: "Deer dash through the forest saying /d/." },
      { emoji: "🧊", word: "Dice", sentence: "Dice drop and dance on the table." }
    ],
    actions: ["Tap your lap three times for each D in the chant.", "Touch behind your teeth to feel where /d/ begins.", "March in place softly while whispering D words."]
  },
  {
    letter: "E",
    name: "Excited Engine",
    color: "text-purple-600",
    gradient: "from-purple-200 to-violet-300",
    sound: "/ĕ/",
    headline: "E is an energetic engine sound made with a short breath.",
    description: "Smile slightly, open your mouth a little, and push a gentle /ĕ/ sound out.",
    chant: "E-E-Engine! Energy on!",
    story: "Pretend to pull a train whistle whenever you hear /ĕ/.",
    items: [
      { emoji: "🥚", word: "Egg", sentence: "Eggs crack with an /ĕ/ echo." },
      { emoji: "🪱", word: "Earthworm", sentence: "Earthworms wiggle through the soil quietly." },
      { emoji: "🎻", word: "Cello", sentence: "Cello starts with soft letter C but says /s/! Sneaky!" }
    ],
    actions: ["Hold your hands like train wheels and spin them while chanting.", "Smile and say /ĕ/ quickly five times.", "Pretend to lay eggs along an invisible line shaped like E."]
  },
  {
    letter: "F",
    name: "Feathery Friend",
    color: "text-cyan-600",
    gradient: "from-cyan-200 to-sky-300",
    sound: "/f/",
    headline: "F feels like a soft feather blowing past your lips.",
    description: "Place your top teeth on your bottom lip and blow gently.",
    chant: "F-F-Feather! Float and fly!",
    story: "Wave your fingers like feathers every time you whisper /f/.",
    items: [
      { emoji: "🐟", word: "Fish", sentence: "Fish flip through the water with /f/ swishes." },
      { emoji: "🌸", word: "Flower", sentence: "Flowers flutter in the breeze." },
      { emoji: "🦊", word: "Fox", sentence: "Foxes flick their fluffy tails." }
    ],
    actions: ["Blow air across your lip to feel the /f/ breeze.", "Trace an imaginary F in the air with feather-light fingers.", "Pretend to flick paint dots to form the letter shape."]
  }
];

const AlphabetCounting: React.FC = () => {
  const [activeLetter, setActiveLetter] = useState<string>(alphabetCountingCards[0].letter);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = useMemo(() => {
    const map = new Map<string, AlphabetCountingCard>();
    alphabetCountingCards.forEach((card) => map.set(card.letter, card));
    return map;
  }, []);

  const activeCard = cardMap.get(activeLetter) ?? alphabetCountingCards[0];

  const speak = useCallback(
    (text: string) => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined" &&
        !isSpeaking
      ) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.1;
        utterance.volume = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const handlePlayIntro = useCallback(() => {
    speak("Let's explore the alphabet with our eyes, ears, and bodies. Tap a letter, feel the sound, and act out the matching words.");
  }, [speak]);

  const handlePlayLetterStory = useCallback(() => {
    speak(
      `Letter ${activeCard.letter} says ${activeCard.sound}. ${activeCard.description} Try our chant: ${activeCard.chant}. ${activeCard.story}`
    );
  }, [activeCard, speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-sky-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-12 w-64 h-64 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-0 right-8 w-72 h-72 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-rose-500 via-amber-500 to-sky-500 bg-clip-text text-transparent drop-shadow-lg mb-4">
              Alphabet Sound Garden
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 mx-auto rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium">
            Tap a letter tile to see kid-friendly pictures, chants, and motions that match the letter’s sound. Listen to the story and copy the moves!
          </p>
          <button
            onClick={handlePlayIntro}
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 text-white font-semibold shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <span>🎧</span>
            <span>Play Instructions</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tap a Letter</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-rose-400 to-sky-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {alphabetCountingCards.map((card) => {
                const isActive = card.letter === activeLetter;
                return (
                  <button
                    key={card.letter}
                    onClick={() => setActiveLetter(card.letter)}
                    className={`relative rounded-2xl px-4 py-5 text-center transition-all duration-300 transform border ${
                      isActive
                        ? `bg-gradient-to-br ${card.gradient} text-white shadow-2xl scale-105 ring-4 ring-white/70`
                        : "bg-white text-gray-800 border-gray-200 hover:border-rose-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className={`text-3xl font-extrabold mb-1 ${isActive ? "text-white" : card.color}`}>{card.letter}</div>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? "text-white/90" : "text-gray-500"}`}>{card.name.split(" ")[0]}</div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-rose-400 uppercase tracking-wide">Sound focus</div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${activeCard.gradient} text-white text-3xl shadow-lg`}
                      >
                        {activeCard.letter}
                      </span>
                      <span>{activeCard.name}</span>
                    </h2>
                    <p className="text-gray-600 mt-2 text-base sm:text-lg">{activeCard.headline}</p>
                    <p className="text-sm text-gray-500 mt-1">{activeCard.description}</p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-semibold">🎵 Phonics Play</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 font-semibold">🌟 Ages 3 - 6</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-rose-700 mb-2">Picture Connections</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {activeCard.items.map((item, index) => (
                          <div key={index} className="rounded-3xl bg-white/90 border border-rose-100 shadow-lg p-4 flex gap-4">
                            <div className="text-4xl drop-shadow-md">{item.emoji}</div>
                            <div>
                              <div className="text-lg font-bold text-rose-700">{item.word}</div>
                              <p className="text-sm text-rose-600 font-medium">{item.sentence}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handlePlayLetterStory}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                    >
                      <span>🔊</span>
                      <span>Play Letter Story</span>
                    </button>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-amber-700 mb-2">Move & Chant</h3>
                      <p className="text-base text-amber-800 font-semibold text-center bg-white/70 rounded-2xl py-3 px-4 shadow-inner">{activeCard.chant}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-1">Try these actions</h4>
                      <ul className="space-y-2 text-sm text-amber-700 font-medium list-disc list-inside">
                        {activeCard.actions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white/80 rounded-2xl p-4 border border-amber-100">
                      <h4 className="text-sm font-semibold text-amber-600 uppercase tracking-wide mb-2">Imagination moment</h4>
                      <p className="text-sm text-amber-700">{activeCard.story}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AlphabetCounting;


