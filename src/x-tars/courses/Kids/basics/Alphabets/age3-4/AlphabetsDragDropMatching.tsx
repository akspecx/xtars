import { useState, useEffect } from 'react';
import { useGameModule } from '@/hooks/useGameModule';
import { useProfile } from "../../../../../context/ProfileContext";
import { RotateCcw, Volume2, VolumeX, MessageCircle, ChevronRight } from 'lucide-react';

const AlphabetDragDrop = () => {
  const { speak, stopSpeech, isDarkMode, playSuccessSound, playErrorSound, playClickSound } = useGameModule();
  const { activeProfile } = useProfile();

  const [currentLetter, setCurrentLetter] = useState('A');
  const [draggedLetter, setDraggedLetter] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400',
    'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-orange-400', 'bg-cyan-400',
    'bg-lime-400', 'bg-rose-400', 'bg-emerald-400', 'bg-violet-400', 'bg-amber-400',
    'bg-sky-400', 'bg-fuchsia-400', 'bg-stone-400', 'bg-red-500', 'bg-blue-500',
    'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-teal-500'
  ];

  const isKids = activeProfile?.type === 'KIDS';

  const speakText = (text: string) => {
    setIsPlaying(true);
    speak(text);
    setTimeout(() => setIsPlaying(false), 2000);
  };

  const generateRandomLetter = () => {
    const randomIndex = Math.floor(Math.random() * alphabets.length);
    return alphabets[randomIndex];
  };

  const handleDragStart = (e: React.DragEvent, letter: string) => {
    e.dataTransfer.setData('text/plain', letter.trim());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(letter);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData('text/plain');
    processLetterDrop(droppedLetter);
    setDraggedItem(null);
  };

  const handleTouchStart = (e: React.TouchEvent, letter: string) => {
    setDraggedItem(letter);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Touch move implementation if needed for specialized drag visual
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elementBelow && elementBelow.closest('[data-drop-zone="true"]')) {
      if (draggedItem) {
        processLetterDrop(draggedItem);
      }
    }
    setDraggedItem(null);
  };

  const processLetterDrop = (droppedLetter: string) => {
    setDraggedLetter(droppedLetter);
    const correct = droppedLetter.trim() === currentLetter.trim();
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(prev => prev + 1);
    
    if (correct) {
      setScore(prev => prev + 1);
      playSuccessSound();
      speakText(`Excellent! ${currentLetter} is correct! Great job!`);
    } else {
      playErrorSound();
      speakText(`Oops! That's ${droppedLetter}. Try to find the letter ${currentLetter}.`);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (correct) {
        handleNext();
      }
    }, 2500);
  };

  const handleNext = () => {
    const newLetter = generateRandomLetter();
    setCurrentLetter(newLetter);
    setDraggedLetter('');
    setIsCorrect(false);
    setShowFeedback(false);
    
    setTimeout(() => {
      speakText(`Find the letter ${newLetter}. Drag it to the box above!`);
    }, 500);
  };

  const handleReset = () => {
    setScore(0);
    setAttempts(0);
    handleNext();
  };

  const speakCurrentLetter = () => {
    speakText(`The letter is ${currentLetter}. Find ${currentLetter} and drag it to the box!`);
  };

  const speakInstructions = () => {
    speakText(`Welcome to the Alphabet Game! Look at the letter in the top box. Then find the same letter from the bottom and drag it up! Let's start with the letter ${currentLetter}!`);
  };

  useEffect(() => {
    const firstLetter = generateRandomLetter();
    setCurrentLetter(firstLetter);
    setTimeout(() => {
        speakText(`Welcome to Alphabet Match! Can you find the letter ${firstLetter}?`);
    }, 1000);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-6 w-full flex flex-col items-center">
          <h1 className={`text-3xl md:text-6xl font-black mb-4 drop-shadow-lg uppercase tracking-tighter ${
            isDarkMode 
              ? 'text-white' 
              : 'text-purple-600'
          }`}>
            {isKids ? "ALPHABET MATCH!" : "🌈 Alphabet Game 🎯"}
          </h1>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {!isKids && (
                <div className={`rounded-full px-6 py-2 shadow-lg border-2 ${
                    isDarkMode ? 'bg-gray-800 text-white border-purple-500' : 'bg-white border-purple-200'
                }`}>
                    <span className="text-xl font-bold text-green-600">
                        Score: {score}/{attempts}
                    </span>
                </div>
            )}
            
            <div className="flex gap-4">
              <button onClick={speakInstructions} className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95">
                <MessageCircle size={32} />
              </button>
              
              <button 
                onClick={() => isPlaying ? stopSpeech() : speakCurrentLetter()}
                className={`${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95`}
              >
                {isPlaying ? <VolumeX size={32} /> : <Volume2 size={32} />}
              </button>
              
              <button onClick={handleReset} className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95">
                <RotateCcw size={32} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="w-full flex flex-col items-center gap-8 md:gap-12">
          {/* Drop Zone */}
          <div className="relative">
            <div
              data-drop-zone="true"
              className={`
                w-72 h-48 md:w-[32rem] md:h-80
                rounded-[2.5rem] border-8 border-dashed transition-all duration-300 
                flex items-center justify-center shadow-2xl
                ${showFeedback 
                  ? isCorrect 
                    ? 'border-green-500 bg-green-100/30' 
                    : 'border-red-500 bg-red-100/30 animate-bounce'
                  : isDarkMode 
                    ? 'border-purple-400 bg-gray-800' 
                    : 'border-purple-400 bg-white'
                }
              `}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {!draggedLetter ? (
                <div className="text-center">
                  <div className={`text-8xl md:text-[12rem] font-black animate-pulse ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-600'
                  }`}>
                    {currentLetter}
                  </div>
                  {!isKids && <p className="text-lg font-bold text-gray-500 uppercase tracking-widest mt-4">Drop Here!</p>}
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-8xl md:text-[12rem] font-black ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {draggedLetter}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`w-full bg-white/90 backdrop-blur-md rounded-[3rem] p-6 md:p-10 shadow-2xl border-4 ${
            isDarkMode ? 'bg-gray-800/90 border-purple-600' : 'bg-white border-purple-200'
          }`}>
            {!isKids && (
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-gray-700 uppercase tracking-widest">🔤 Drag the letters! 🔤</h2>
                </div>
            )}
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-13 gap-3">
              {alphabets.map((letter, index) => (
                <div
                  key={letter}
                  draggable
                  onDragStart={(e) => handleDragStart(e, letter)}
                  onTouchStart={(e) => handleTouchStart(e, letter)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className={`
                    ${colors[index]} 
                    text-white font-black 
                    text-2xl md:text-4xl
                    w-14 h-14 md:w-20 md:h-20
                    rounded-[1.25rem] md:rounded-[2rem]
                    flex items-center justify-center 
                    cursor-grab active:cursor-grabbing touch-manipulation
                    shadow-xl hover:shadow-2xl
                    transition-all duration-200
                    hover:scale-115 active:scale-90
                    border-4 border-white/40
                    ${draggedItem === letter ? 'scale-110 ring-4 ring-white' : ''}
                    select-none
                  `}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>

          {showFeedback && isCorrect && (
            <div className="animate-bounce">
              <button onClick={handleNext} className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-black py-6 px-12 rounded-full shadow-2xl text-2xl flex items-center gap-4 hover:scale-105 transition-transform">
                <ChevronRight size={40} />
                {!isKids && "Next Letter!"}
              </button>
            </div>
          )}
        </div>

        {!isKids && (
            <div className={`mt-10 w-full max-w-2xl rounded-3xl p-6 shadow-xl border-4 ${
                isDarkMode ? 'bg-gray-800 border-purple-600 text-white' : 'bg-white border-purple-200 text-gray-700'
            }`}>
                <h3 className="text-xl font-black text-center mb-4 uppercase">🎮 How to Play</h3>
                <div className="text-center space-y-2 text-lg font-medium">
                    <p>1. Look at the letter in the top box 👀</p>
                    <p>2. Find the same letter in the grid below 🔍</p>
                    <p>3. Drag it into the top box 🖱️</p>
                    <p>4. Listen to the voice feedback! 🔊</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AlphabetDragDrop;
