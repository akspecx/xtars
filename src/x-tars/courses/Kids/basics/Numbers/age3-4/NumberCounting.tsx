import React, { useCallback, useMemo, useState } from 'react';

interface CountingItem {
  emoji: string;
  label: string;
  sentence: string;
}

interface CountingCard {
  number: number;
  word: string;
  color: string;
  gradient: string;
  headline: string;
  description: string;
  bodyFact: string;
  items: CountingItem[];
  chant: string;
}

const countingCards: CountingCard[] = [
  {
    number: 1,
    word: 'One',
    color: 'text-rose-600',
    gradient: 'from-rose-200 to-pink-300',
    headline: 'One special nose and one smart head!',
    description: 'Our body starts counting with one: one nose to smell and one head to think.',
    bodyFact: 'Your one nose helps you smell yummy foods, and your head keeps your brain safe.',
    items: [
      { emoji: '👃', label: 'Nose', sentence: 'One nose smells flowers and cookies.' },
      { emoji: '🙂', label: 'Head', sentence: 'One head holds all your brilliant ideas.' }
    ],
    chant: 'One nose, one head—counting starts here!'
  },
  {
    number: 2,
    word: 'Two',
    color: 'text-sky-600',
    gradient: 'from-sky-200 to-blue-300',
    headline: 'Two eyes, two ears, two hands, two legs!',
    description: 'Number two means we have things in pairs that help us see, listen, hug, and run.',
    bodyFact: 'Eyes, ears, hands, and legs come in twos so they can work together as a team.',
    items: [
      { emoji: '👀', label: 'Eyes', sentence: 'Two eyes for seeing bright colors.' },
      { emoji: '👂', label: 'Ears', sentence: 'Two ears for listening to stories.' },
      { emoji: '🤲', label: 'Hands', sentence: 'Two hands for clapping and hugging.' },
      { emoji: '🦵', label: 'Legs', sentence: 'Two legs for jumping up and down.' }
    ],
    chant: 'Two by two, they help you!'
  },
  {
    number: 5,
    word: 'Five',
    color: 'text-purple-600',
    gradient: 'from-purple-200 to-violet-300',
    headline: 'Five friendly fingers!',
    description: 'Look at one hand—five fingers wave, wiggle, and create.',
    bodyFact: 'Each finger helps you hold, draw, and play instruments or games.',
    items: [
      { emoji: '🖐️', label: 'Fingers', sentence: 'Five fingers on one hand wave hello.' }
    ],
    chant: 'Five fingers say high-five!'
  }
];

const NumberCounting: React.FC = () => {
  const [activeNumber, setActiveNumber] = useState<number>(countingCards[0].number);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cardMap = useMemo(() => {
    const map = new Map<number, CountingCard>();
    countingCards.forEach((card) => map.set(card.number, card));
    return map;
  }, []);

  const activeCard = cardMap.get(activeNumber) ?? countingCards[0];

  const speak = useCallback((text: string) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined' &&
      !isSpeaking
    ) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleNumberSelect = (number: number) => {
    setActiveNumber(number);
  };

  const handlePlayIntro = () => {
    speak('Let us count the amazing parts of our bodies. Tap a number, say the chant, and try the actions.');
  };

  const handlePlayFacts = () => {
    speak(`${activeCard.word}. ${activeCard.headline}. ${activeCard.bodyFact} Try saying the chant: ${activeCard.chant}`);
  };

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
              Count on Your Body
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 mx-auto rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium">
            Learn numbers 1, 2, and 5 using the amazing parts of your body. Tap a number to see and hear the matching parts!
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Tap a Number</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-rose-400 to-sky-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {countingCards.map((card) => {
                const isActive = card.number === activeNumber;
                return (
                  <button
                    key={card.number}
                    onClick={() => handleNumberSelect(card.number)}
                    className={`relative rounded-2xl px-4 py-5 text-center transition-all duration-300 transform border-3 ${
                      isActive
                        ? `bg-gradient-to-br ${card.gradient} text-white shadow-2xl scale-105 ring-4 ring-white/60`
                        : 'bg-white text-gray-800 border-gray-200 hover:border-rose-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className={`text-3xl font-extrabold mb-1 ${isActive ? 'text-white' : card.color}`}>
                      {card.number}
                    </div>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      {card.word}
                    </div>
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
                    <div className="text-sm font-semibold text-rose-400 uppercase tracking-wide">Let’s count</div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${activeCard.gradient} text-white text-3xl shadow-lg`}>
                        {activeCard.number}
                      </span>
                      <span>{activeCard.word}</span>
                    </h2>
                    <p className="text-gray-600 mt-2 text-base sm:text-lg">
                      {activeCard.headline}
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 font-semibold">
                      🤗 Body Counting Fun
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-600 font-semibold">
                      🌟 Ages 3 - 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-rose-700 mb-2">Body Fact</h3>
                      <p className="text-sm text-rose-700 font-medium">{activeCard.bodyFact}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-rose-700 mb-2">Things to Notice</h3>
                      <ul className="space-y-2 text-sm text-rose-700 font-medium">
                        {activeCard.items.map((item, index) => (
                          <li key={index} className="flex gap-3 items-start">
                            <span className="w-8 h-8 flex-shrink-0 rounded-full bg-white shadow-inner flex items-center justify-center text-lg">
                              {item.emoji}
                            </span>
                            <span>
                              <strong>{item.label}:</strong> {item.sentence}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 flex flex-col gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-amber-700 mb-2">Body Showcase</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeCard.items.map((item, index) => (
                          <div key={index} className="rounded-3xl bg-white/90 border border-amber-100 shadow-lg p-5 flex flex-col items-center text-center gap-3">
                            <span className="text-6xl sm:text-7xl drop-shadow-md">{item.emoji}</span>
                            <div className="text-lg font-bold text-amber-700">{item.label}</div>
                            <p className="text-sm text-amber-600 font-medium">{item.sentence}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-700 mb-2">Chant Together</h3>
                      <p className="text-base text-amber-800 font-semibold text-center bg-white/70 rounded-2xl py-3 px-4 shadow-inner">
                        {activeCard.chant}
                      </p>
                    </div>
                    <button
                      onClick={handlePlayFacts}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
                    >
                      <span>🔊</span>
                      <span>Play Number Facts</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="bg-white/80 backdrop-blur-md border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Tips for Helpers</h3>
            <p className="text-base text-gray-600">
              Invite your child to chant the number, point to the body part, and try the action. Repeat the chant in different voices to make counting joyful!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-gray-700">
              <span className="px-4 py-2 rounded-full bg-rose-100 text-rose-600">Use a mirror while counting</span>
              <span className="px-4 py-2 rounded-full bg-amber-100 text-amber-600">Match the chant with claps</span>
              <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-600">Switch to whisper voices</span>
            </div>
          </div>
        </section>
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

export default NumberCounting;
