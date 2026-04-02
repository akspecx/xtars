import React, { useState, useCallback } from 'react';
import { useProfile } from "../../../../../context/ProfileContext";
import { Volume2, Music, Sparkles, Shuffle, ListOrdered } from 'lucide-react';

interface LetterAction {
  letter: string;
  action: string;
  emoji: string;
  instruction: string;
  animation: string;
}

const letterActions: LetterAction[] = [
  { letter: 'A', action: 'Arms Up', emoji: '🙌', instruction: 'Raise your arms high!', animation: 'animate-bounce' },
  { letter: 'B', action: 'Bounce', emoji: '⬆️⬇️', instruction: 'Bounce up and down!', animation: 'animate-bounce' },
  { letter: 'C', action: 'Clap', emoji: '👏', instruction: 'Clap your hands!', animation: 'animate-pulse' },
  { letter: 'D', action: 'Dance', emoji: '💃', instruction: 'Dance around!', animation: 'animate-spin' },
  { letter: 'E', action: 'Elbow Touch', emoji: '💪', instruction: 'Touch your elbows!', animation: 'animate-wiggle' },
  { letter: 'F', action: 'Feet Stomp', emoji: '👣', instruction: 'Stomp your feet!', animation: 'animate-bounce' },
  { letter: 'G', action: 'Giggle', emoji: '😄', instruction: 'Giggle and laugh!', animation: 'animate-pulse' },
  { letter: 'H', action: 'Hop', emoji: '🦘', instruction: 'Hop on one foot!', animation: 'animate-bounce' },
  { letter: 'I', action: 'Itch', emoji: '🤚', instruction: 'Pretend to itch!', animation: 'animate-wiggle' },
  { letter: 'J', action: 'Jump', emoji: '🤸', instruction: 'Jump high!', animation: 'animate-bounce' },
  { letter: 'K', action: 'Kick', emoji: '🦵', instruction: 'Kick your leg!', animation: 'animate-swing' },
  { letter: 'L', action: 'Lean', emoji: '🤸‍♀️', instruction: 'Lean to the side!', animation: 'animate-tilt' },
  { letter: 'M', action: 'March', emoji: '🚶', instruction: 'March in place!', animation: 'animate-march' },
  { letter: 'N', action: 'Nod', emoji: '🙂', instruction: 'Nod your head!', animation: 'animate-nod' },
  { letter: 'O', action: 'Open Arms', emoji: '🤗', instruction: 'Open your arms wide!', animation: 'animate-expand' },
  { letter: 'P', action: 'Point', emoji: '👉', instruction: 'Point forward!', animation: 'animate-point' },
  { letter: 'Q', action: 'Quiet', emoji: '🤫', instruction: 'Be very quiet!', animation: 'animate-fade' },
  { letter: 'R', action: 'Run', emoji: '🏃', instruction: 'Run in place!', animation: 'animate-run' },
  { letter: 'S', action: 'Spin', emoji: '🌀', instruction: 'Spin around!', animation: 'animate-spin' },
  { letter: 'T', action: 'Touch Toes', emoji: '🧘', instruction: 'Touch your toes!', animation: 'animate-bend' },
  { letter: 'U', action: 'Up & Down', emoji: '⬆️⬇️', instruction: 'Go up and down!', animation: 'animate-bounce' },
  { letter: 'V', action: 'Victory', emoji: '✌️', instruction: 'Make a V sign!', animation: 'animate-victory' },
  { letter: 'W', action: 'Wave', emoji: '👋', instruction: 'Wave hello!', animation: 'animate-wave' },
  { letter: 'X', action: 'X-Cross Arms', emoji: '❌', instruction: 'Cross your arms!', animation: 'animate-cross' },
  { letter: 'Y', action: 'Yawn', emoji: '🥱', instruction: 'Give a big yawn!', animation: 'animate-yawn' },
  { letter: 'Z', action: 'Zigzag', emoji: '⚡', instruction: 'Move in a zigzag!', animation: 'animate-zigzag' }
];

const AlphabetDanceParty: React.FC = () => {
  const { activeProfile } = useProfile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPerforming, setIsPerforming] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'sequential' | 'random'>('random');

  const currentLetter = letterActions[currentIndex];
  const isKids = activeProfile?.type === 'KIDS';

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.3;
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleLetterClick = (letterAction: LetterAction, index: number) => {
    if (isPerforming) return;
    
    setCurrentIndex(index);
    setIsPerforming(true);
    setScore(prev => prev + 1);
    speak(`${letterAction.letter}! Time to ${letterAction.action}! ${letterAction.instruction}`);

    setTimeout(() => {
      setIsPerforming(false);
    }, 4000);
  };

  const handlePlayInstructions = () => {
    speak(`Welcome to the Alphabet Dance Party! Tap any letter to see its special dance move! Let's get moving!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 p-4 md:p-8 flex flex-col items-center">
      <header className="text-center mb-8 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-xl mb-4 uppercase tracking-tighter">
          {isKids ? "DANCE PARTY!" : "💃 Alphabet Dance Party"}
        </h1>
        {!isKids && (
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Learn letters through fun actions! Tap a letter to see its move.
          </p>
        )}
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-8 md:gap-12">
        <div className="flex flex-wrap justify-center gap-4">
          <button
             onClick={handlePlayInstructions}
             className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white/30"
          >
            <Volume2 size={32} />
          </button>
          
          {!isKids && (
              <button
                onClick={() => setMode(m => m === 'sequential' ? 'random' : 'sequential')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-110 active:scale-95 border-4 border-white/30 flex items-center gap-3 font-black text-xl"
              >
                {mode === 'sequential' ? <ListOrdered size={28} /> : <Shuffle size={28} />}
                {mode === 'sequential' ? 'Order' : 'Random'}
              </button>
          )}

          <div className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl border-4 border-white/30 flex items-center gap-3">
            <Music size={28} /> ⭐ {score}
          </div>
        </div>

        {/* Action Stage */}
        <div className="w-full flex justify-center">
            <div className={`w-full max-w-2xl rounded-[4rem] p-10 md:p-16 bg-white/40 backdrop-blur-xl border-4 border-white shadow-3xl text-center relative overflow-hidden flex flex-col items-center gap-6 min-h-[400px] justify-center ${isPerforming ? currentLetter.animation : 'animate-pulse'}`}>
                {isPerforming ? (
                    <>
                        <div className="text-[12rem] md:text-[15rem] leading-none drop-shadow-2xl">{currentLetter.emoji}</div>
                        <div className="text-8xl md:text-[10rem] font-black text-pink-700 leading-none drop-shadow-lg -mt-4">{currentLetter.letter}</div>
                        <div className="text-3xl md:text-5xl font-black text-purple-800 uppercase tracking-tighter">{currentLetter.action}</div>
                        {!isKids && <div className="text-xl md:text-2xl font-bold text-gray-600 italic">"{currentLetter.instruction}"</div>}
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-8">
                        <Sparkles size={120} className="text-yellow-400 animate-spin-slow" />
                        <h2 className="text-4xl font-black text-gray-400 uppercase tracking-widest">{isKids ? "TAP A LETTER!" : "Ready to dance?"}</h2>
                    </div>
                )}
            </div>
        </div>

        {/* Input Grid */}
        <div className="w-full bg-white/60 backdrop-blur-xl p-8 rounded-[4rem] shadow-3xl border-4 border-white">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-3">
            {letterActions.map((la, index) => (
              <button
                key={la.letter}
                onClick={() => handleLetterClick(la, index)}
                disabled={isPerforming}
                className={`aspect-square rounded-[1.5rem] md:rounded-[2rem] transition-all transform flex flex-col items-center justify-center p-2 border-4 ${index === currentIndex && isPerforming ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-white scale-110 shadow-2xl rotate-6' : 'bg-white border-pink-50 text-gray-800 hover:scale-110 active:scale-90 hover:border-pink-300 shadow-xl'}`}
              >
                <div className="text-2xl md:text-4xl font-black">{la.letter}</div>
                <div className="text-xl md:text-3xl">{la.emoji}</div>
              </button>
            ))}
          </div>
        </div>

        {!isKids && (
          <div className="w-full max-w-4xl bg-blue-50/50 p-8 rounded-[3rem] border-4 border-blue-100">
            <h3 className="text-2xl font-black text-center text-blue-800 uppercase mb-6 tracking-widest">Guide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {letterActions.slice(0, 12).map((la) => (
                <div key={la.letter} className="bg-white p-4 rounded-2xl shadow-md border-2 border-blue-50 flex items-center justify-center gap-3">
                  <span className="font-black text-pink-600 text-xl">{la.letter}</span>
                  <span className="text-gray-500 font-bold">{la.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
          .animate-spin-slow { animation: spin 8s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AlphabetDanceParty;
