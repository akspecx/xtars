import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameModule } from '@/hooks/useGameModule';
import { useProfile } from "../../../../../context/ProfileContext";
import { Play, RotateCcw, Home, Trophy, AlertTriangle, Info } from 'lucide-react';

const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface Balloon {
  id: number;
  letter: string;
  x: number;
  y: number;
  color: string;
  speed: number;
}

const AlphabetBalloonGame = () => {
  const { isDarkMode, speak, playSuccessSound, playErrorSound } = useGameModule();
  const { activeProfile } = useProfile();
  
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [currentTarget, setCurrentTarget] = useState('');
  const [targetSequence, setTargetSequence] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [balloonCounter, setBalloonCounter] = useState(0);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const colors = [
    '#FFC0CB', '#B0E0E6', '#98FB98', '#FFFFE0', '#DDA0DD', '#ADD8E6', '#F08080', '#FAFAD2', '#AFEEEE', '#F5DEB3', 
    '#FFA07A', '#FFDAB9', '#F0E68C', '#D8BFD8', '#E0FFFF', '#F5FFFA', '#E6E6FA', '#90EE90', '#FFCC99', '#B0C4DE', 
    '#F0FFFF', '#FFEBCD', '#FAEBD7', '#F0FFF0', '#DCDCDC', '#F0F8FF'
  ];

  const isKids = activeProfile?.type === 'KIDS';
  const audioContextRef = useRef<AudioContext | null>(null);

  const alphabetColors = alphabet.map((letter) => {
      const poppedIndex = targetSequence.indexOf(letter);
      return {
          letter,
          color: colors[alphabet.indexOf(letter)],
          matched: poppedIndex !== -1 && poppedIndex < score
      };
  });
  
  const spawnBalloon = useCallback((letterToSpawn: string) => {
    const randomSpeed = Math.random() * (1.0 - 0.5) + 0.5; 
    setBalloonCounter(prev => {
        const newId = prev + 1;
        const newBalloon: Balloon = {
            id: newId,
            letter: letterToSpawn, 
            x: Math.random() * 80 + 10,
            y: -15,
            color: colors[alphabet.indexOf(letterToSpawn)],
            speed: randomSpeed
        };
        setBalloons([newBalloon]);
        return newId;
    });
  }, [alphabet]);

  useEffect(() => {
    if (!gameStarted || gameOver || gameWon) return;
    const interval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length === 0) return prev; 
        return prev.map(balloon => {
          const newY = balloon.y + balloon.speed;
          if (newY > 75) {
            setGameOver(true);
            playErrorSound();
            speak("Oh no! The balloon crossed the line!");
            return null;
          }
          return { ...balloon, y: newY };
        }).filter((balloon): balloon is Balloon => balloon !== null);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, gameWon]);

  const handleAlphabetClick = (letter: string) => {
    if (letter !== currentTarget || gameOver || gameWon) return;
    setBalloons([]);
    const newScore = score + 1;
    setScore(newScore);
    playSuccessSound();
    speak(`Perfect! You popped the letter ${letter}!`);

    if (newScore === 26) {
      setGameWon(true);
      speak("Full marks! You've matched all the letters!");
    } else {
      const nextTarget = targetSequence[newScore];
      setCurrentTarget(nextTarget);
      setTimeout(() => {
          if (!gameOver && !gameWon) spawnBalloon(nextTarget);
      }, 1000); 
    }
  };

  const startGame = () => {
    const shuffledAlphabet = shuffleArray(alphabet);
    setTargetSequence(shuffledAlphabet);
    setBalloons([]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true); 
    setBalloonCounter(0);
    const firstTarget = shuffledAlphabet[0];
    setCurrentTarget(firstTarget);
    setTimeout(() => spawnBalloon(firstTarget), 0);
    speak("Balloon game starting! Pop the letters as they appear!");
  };

  const resetGame = () => {
    setBalloons([]);
    setScore(0);
    setCurrentTarget('');
    setTargetSequence([]);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
    setBalloonCounter(0);
  };

  return (
    <div className={`w-full min-h-screen relative overflow-hidden font-sans pb-4 transition-colors duration-500 ${!isDarkMode ? 'bg-gradient-to-b from-blue-200 to-blue-400' : 'bg-gray-900'}`}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap'); .font-sans { font-family: 'Inter', sans-serif; } .balloon-move { transition: all 0.04s linear; }`}</style>

      <div className="sticky top-0 left-0 right-0 z-10 bg-white/30 backdrop-blur-md p-4 shadow-xl rounded-b-[2rem] dark:bg-gray-800/90 transition-colors duration-500 border-b-4 border-white/20">
        <div className="flex flex-wrap justify-center gap-2">
          {alphabetColors.map(({ letter, color, matched }) => (
            <button
              key={letter}
              onClick={() => handleAlphabetClick(letter)}
              disabled={matched || !gameStarted || gameOver || gameWon}
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full font-black text-black text-sm md:text-2xl shadow-lg transition-all duration-200 ${matched ? 'opacity-20 scale-90 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:scale-110 active:scale-95 border-2 border-white'}`}
              style={{ backgroundColor: color }} 
            >
              {letter}
            </button>
          ))}
        </div>
        
        <div className="text-center mt-4">
          <span className="text-white font-black text-xl md:text-3xl bg-blue-600/60 px-8 py-3 rounded-full shadow-2xl backdrop-blur-sm border-2 border-white/30">
             {isKids ? `⭐ ${score}` : `Score: ${score}/26`}
          </span>
        </div>

        <div className="w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500 mt-4 shadow-lg rounded-full"></div>
      </div>

      {balloons.map(balloon => (
        <div
          key={balloon.id}
          className="absolute balloon-move cursor-pointer z-5" 
          style={{ left: `${balloon.x}%`, bottom: `${balloon.y}%`, transform: 'translateX(-50%)' }}
          onClick={() => handleAlphabetClick(balloon.letter)}
        >
          <div className="w-16 h-20 md:w-24 md:h-32 rounded-t-full rounded-b-[2rem] shadow-2xl flex items-center justify-center relative p-1 animate-pulse" style={{ backgroundColor: balloon.color, border: '4px solid white' }}>
            <span className="text-black font-black text-3xl md:text-5xl"> 
              {balloon.letter}
            </span>
            <div className="absolute bottom-[-15px] left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-1 h-12 bg-white/60"></div>
            </div>
          </div>
        </div>
      ))}
      
      {!gameStarted && !gameOver && !gameWon && (
        <OverlayCard 
          title={isKids ? "POPPING TIME!" : "🎈 Alphabet Balloon Game"}
          message={isKids ? null : (
            <div className="text-left space-y-4 max-w-xs mx-auto">
              <p className="flex items-center gap-2 font-bold text-blue-600 uppercase"><Info size={20} /> How to play:</p>
              <ol className="space-y-2 text-gray-600 font-medium">
                <li>1. Look for the floating balloon! 🎈</li>
                <li>2. Pop it before it hits the red line! 🛑</li>
                <li>3. Match all letters of the alphabet! 🔤</li>
              </ol>
            </div>
          )}
          button1Action={startGame}
          button1Text={isKids ? "" : "Start Game"}
          button1Icon={<Play size={40} strokeWidth={4} />}
          button1Color="bg-gradient-to-r from-green-400 to-blue-500"
        />
      )}

      {gameOver && (
        <OverlayCard 
          title={isKids ? "OH NO!" : "Game Over!"}
          titleColor="text-red-600"
          message={isKids ? <span className="text-6xl">🛑</span> : `A balloon crossed the line! Final Score: ${score}/26`}
          button1Action={startGame} 
          button1Text={isKids ? "" : "Try Again"}
          button1Icon={<RotateCcw size={40} strokeWidth={4} />}
          button1Color="bg-orange-500"
          button2Action={resetGame}
          button2Text={isKids ? "" : "Main Menu"}
          button2Icon={<Home size={32} />}
          button2Color="bg-gray-500"
        />
      )}

      {gameWon && (
        <OverlayCard 
          title={isKids ? "YOU WON!" : "🎉 Congratulations!"}
          titleColor="text-green-600"
          message={isKids ? <span className="text-8xl">🏆</span> : `Perfect Score: 26/26`}
          button1Action={startGame}
          button1Text={isKids ? "" : "Play Again"}
          button1Icon={<RotateCcw size={40} strokeWidth={4} />}
          button1Color="bg-green-500"
          button2Action={resetGame}
          button2Text={isKids ? "" : "Main Menu"}
          button2Icon={<Home size={32} />}
          button2Color="bg-gray-500"
        />
      )}
    </div>
  );
};

interface OverlayProps {
    title: string;
    titleColor?: string;
    message: React.ReactNode;
    button1Action: () => void;
    button1Text: string;
    button1Icon?: React.ReactNode;
    button1Color: string;
    button2Action?: () => void;
    button2Text?: string;
    button2Icon?: React.ReactNode;
    button2Color?: string;
}

const OverlayCard = ({ title, titleColor = 'text-gray-800', message, button1Action, button1Text, button1Icon, button1Color, button2Action, button2Text, button2Icon, button2Color }: OverlayProps) => (
  <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-[3rem] p-10 shadow-3xl text-center max-w-md w-full border-8 border-white/20 dark:bg-gray-800">
      <h1 className={`text-4xl md:text-5xl font-black mb-6 uppercase tracking-tighter ${titleColor}`}>
        {title}
      </h1>
      {message && <div className="mb-10">{message}</div>}
      <div className="flex flex-col space-y-4">
        <button onClick={button1Action} className={`${button1Color} text-white font-black py-6 rounded-full text-2xl shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4`}>
          {button1Icon}
          {button1Text}
        </button>
        {button2Action && (
          <button onClick={button2Action} className={`${button2Color} text-white font-black py-4 rounded-full text-xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-4`}>
            {button2Icon}
            {button2Text}
          </button>
        )}
      </div>
    </div>
  </div>
);

export default AlphabetBalloonGame;
