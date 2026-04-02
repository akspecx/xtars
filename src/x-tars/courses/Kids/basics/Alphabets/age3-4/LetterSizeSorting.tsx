import React, { useState, useCallback, useRef } from 'react';
import { useProfile } from "../../../../../context/ProfileContext";
import { Volume2, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Letter {
  char: string;
  size: 'big' | 'small';
  color: string;
}

const generateLetters = (): Letter[] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const colors = [
    'text-red-500', 'text-blue-500', 'text-green-500', 'text-purple-500', 
    'text-pink-500', 'text-orange-500', 'text-indigo-500', 'text-teal-500'
  ];
  const result: Letter[] = [];
  
  for (let i = 0; i < 8; i++) {
    const char = letters[Math.floor(Math.random() * letters.length)];
    const size = Math.random() > 0.5 ? 'big' : 'small';
    const color = colors[Math.floor(Math.random() * colors.length)];
    result.push({ char, size, color });
  }
  
  return result.sort(() => Math.random() - 0.5);
};

const LetterSizeSorting: React.FC = () => {
  const { activeProfile } = useProfile();
  const [letters, setLetters] = useState<Letter[]>(generateLetters());
  const [bigBasket, setBigBasket] = useState<Letter[]>([]);
  const [smallBasket, setSmallBasket] = useState<Letter[]>([]);
  const [draggedLetter, setDraggedLetter] = useState<Letter | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const isKids = activeProfile?.type === 'KIDS';

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, letter: Letter) => {
    setDraggedLetter(letter);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTouchStart = (e: React.TouchEvent, letter: Letter) => {
    setDraggedLetter(letter);
  };

  const handleDrop = (e: React.DragEvent, basket: 'big' | 'small') => {
    e.preventDefault();
    if (draggedLetter) {
      processLetterDrop(draggedLetter, basket);
    }
    setDraggedLetter(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, basketType: 'big' | 'small') => {
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.closest(`[data-basket="${basketType}"]`)) {
       if (draggedLetter) processLetterDrop(draggedLetter, basketType);
    }
    setDraggedLetter(null);
  };

  const processLetterDrop = (letter: Letter, basket: 'big' | 'small') => {
    if (letter.size === basket) {
      setLetters(prev => prev.filter(l => l !== letter));
      if (basket === 'big') {
        setBigBasket(prev => [...prev, letter]);
      } else {
        setSmallBasket(prev => [...prev, letter]);
      }
      speak(`Correct! Big ${letter.char} goes into the ${basket} basket!`);
      setScore(prev => prev + 1);

      if (letters.length === 1) {
          setShowSuccess(true);
          speak('Amazing sorting! You matched them all!');
          setTimeout(() => {
            setLetters(generateLetters());
            setBigBasket([]);
            setSmallBasket([]);
            setShowSuccess(false);
          }, 3000);
      }
    } else {
      setShowError(true);
      setErrorText(`Oops! That's a ${letter.size} letter!`);
      speak(`Oh no! That letter is ${letter.size}! Try again!`);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-50 to-red-50 p-4 md:p-8 flex flex-col items-center">
      <header className="text-center mb-8 flex flex-col items-center w-full">
        <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-amber-500 bg-clip-text text-transparent drop-shadow-xl mb-4 uppercase tracking-tighter">
          {isKids ? "SIZE SORTING!" : "Letter Size Sorting"}
        </h1>
        {!isKids && <p className="text-xl text-gray-700 font-medium max-w-2xl">Sort big and small letters into their baskets!</p>}
        
        <div className="flex gap-4 mt-6">
            <button
               onClick={() => speak('Put big letters in the BIG basket and small letters in the small basket!')}
               className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-full shadow-2xl transition-all hover:scale-110 border-4 border-white/30"
            >
              <Volume2 size={32} />
            </button>
            <div className="px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-[2rem] font-black text-2xl shadow-2xl border-4 border-white/30 flex items-center gap-3">
               ⭐ {score}
            </div>
        </div>
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-10">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[3rem] shadow-3xl border-4 border-white flex flex-col items-center gap-6">
          {!isKids && <h3 className="text-2xl font-black text-gray-700 uppercase tracking-widest">Letters to Sort</h3>}
          <div className="flex flex-wrap justify-center gap-8 min-h-[150px] p-4">
            {letters.map((letter, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, letter)}
                onTouchStart={(e) => handleTouchStart(e, letter)}
                className={`cursor-grab active:cursor-grabbing transform hover:scale-125 transition-all drop-shadow-2xl ${draggedLetter === letter ? 'opacity-30 scale-90' : ''}`}
              >
                <div className={`font-black ${letter.color} ${letter.size === 'big' ? 'text-9xl md:text-[10rem]' : 'text-5xl md:text-7xl'}`}>
                  {letter.char}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            data-basket="big"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'big')}
            className="p-10 rounded-[4rem] bg-gradient-to-br from-blue-300 to-cyan-400 border-8 border-dashed border-white/50 shadow-3xl flex flex-col items-center gap-6 group hover:border-blue-600 transition-all"
          >
            <div className="text-center flex flex-col items-center gap-2">
              <div className="text-9xl group-hover:scale-110 transition-transform drop-shadow-xl">🧺</div>
              <div className="text-6xl font-black text-blue-900 uppercase tracking-tighter drop-shadow-lg">BIG</div>
            </div>
            <div className="bg-white/80 w-full rounded-[2.5rem] p-6 min-h-[250px] flex flex-wrap justify-center items-center gap-6 border-4 border-white shadow-inner">
              {bigBasket.map((letter, i) => (
                <div key={i} className={`font-black text-8xl ${letter.color} drop-shadow-lg`}>{letter.char}</div>
              ))}
            </div>
          </div>

          <div
            data-basket="small"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 'small')}
            className="p-10 rounded-[4rem] bg-gradient-to-br from-pink-300 to-rose-400 border-8 border-dashed border-white/50 shadow-3xl flex flex-col items-center gap-6 group hover:border-pink-600 transition-all"
          >
            <div className="text-center flex flex-col items-center gap-2">
              <div className="text-7xl group-hover:scale-110 transition-transform drop-shadow-xl">🧺</div>
              <div className="text-4xl font-black text-pink-900 uppercase tracking-tighter drop-shadow-lg">small</div>
            </div>
            <div className="bg-white/80 w-full rounded-[2.5rem] p-6 min-h-[250px] flex flex-wrap justify-center items-center gap-4 border-4 border-white shadow-inner">
              {smallBasket.map((letter, i) => (
                <div key={i} className={`font-black text-5xl ${letter.color} drop-shadow-lg`}>{letter.char}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
           <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-[3rem] p-12 text-center shadow-3xl border-8 border-white animate-bounce max-w-lg w-full">
             <div className="text-9xl mb-6">🎉</div>
             <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter">AMAZING!</h2>
             {!isKids && <p className="text-2xl text-white font-bold mt-4">All letters sorted perfectly!</p>}
           </div>
        </div>
      )}

      {showError && (
        <div className="fixed bottom-10 px-10 py-6 bg-red-500 text-white rounded-[2.5rem] shadow-3xl border-4 border-white animate-bounce flex items-center gap-4">
            <AlertCircle size={32} strokeWidth={4} />
            <span className="text-3xl font-black uppercase tracking-tighter">{isKids ? "TRY AGAIN!" : errorText}</span>
        </div>
      )}
    </div>
  );
};

export default LetterSizeSorting;
