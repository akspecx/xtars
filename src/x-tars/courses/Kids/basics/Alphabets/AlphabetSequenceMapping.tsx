import { useState, useEffect } from 'react';

const AlphabetSequenceLearning = () => {
  const [sequence, setSequence] = useState([]); // Letters placed in correct sequence
  const [availableLetters, setAvailableLetters] = useState([]); // Shuffled letters to drag from
  const [nextExpected, setNextExpected] = useState('A'); // Next letter expected in sequence
  const [draggedItem, setDraggedItem] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [candies, setCandies] = useState([]); // Celebration candies
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successLetter, setSuccessLetter] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const [modalCandies, setModalCandies] = useState([]);

  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400',
    'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-orange-400', 'bg-cyan-400',
    'bg-lime-400', 'bg-rose-400', 'bg-emerald-400', 'bg-violet-400', 'bg-amber-400',
    'bg-sky-400', 'bg-fuchsia-400', 'bg-stone-400', 'bg-red-500', 'bg-blue-500',
    'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
    'bg-teal-500'
  ];

  const candyEmojis = ['🍬', '🍭', '🍫', '🧁', '🍪', '🍩', '🎂', '🍰'];

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialize game
  const initializeGame = () => {
    setSequence([]);
    setAvailableLetters(shuffleArray(alphabets));
    setNextExpected('A');
    setScore(0);
    setGameComplete(false);
    setCandies([]);
    setShowFeedback(false);
  };

  // Check if speech synthesis is supported
  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
    initializeGame();
  }, []);

  // Check for dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Speak function
  const speakText = (text) => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (speechSupported) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Add celebration candies and success modal
  const addCandies = (letter) => {
    const newCandies = [];
    const newModalCandies = [];
    
    // Screen candies
    for (let i = 0; i < 8; i++) {
      newCandies.push({
        id: Math.random(),
        emoji: candyEmojis[Math.floor(Math.random() * candyEmojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    
    // Modal candies
    for (let i = 0; i < 15; i++) {
      newModalCandies.push({
        id: Math.random(),
        emoji: candyEmojis[Math.floor(Math.random() * candyEmojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1,
      });
    }
    
    setCandies(newCandies);
    setModalCandies(newModalCandies);
    setSuccessLetter(letter);
    setShowSuccessModal(true);
    
    // Remove candies after animation
    setTimeout(() => setCandies([]), 3000);
    
    // Auto close modal after celebration
    setTimeout(() => {
      setShowSuccessModal(false);
      setModalCandies([]);
    }, 3000);
  };

  // Desktop drag handlers
  const handleDragStart = (e, letter) => {
    e.dataTransfer.setData('text/plain', letter.trim());
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(letter);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedLetter = e.dataTransfer.getData('text/plain');
    processLetterDrop(droppedLetter);
    setDraggedItem(null);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e, letter) => {
    setDraggedItem(letter);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Check if dropped on the drop zone
    if (elementBelow && elementBelow.closest('[data-drop-zone="true"]')) {
      if (draggedItem) {
        processLetterDrop(draggedItem);
      }
    }
    
    setDraggedItem(null);
  };

  // Process the letter drop
  const processLetterDrop = (droppedLetter) => {
    console.log('Processing drop:', droppedLetter, 'Expected:', nextExpected);
    
    if (droppedLetter === nextExpected) {
      // Correct letter!
      const newSequence = [...sequence, droppedLetter];
      setSequence(newSequence);
      setScore(score + 1);
      
      // Remove letter from available letters
      setAvailableLetters(prev => prev.filter(letter => letter !== droppedLetter));
      
      // Set next expected letter
      const nextIndex = alphabets.indexOf(droppedLetter) + 1;
      if (nextIndex < alphabets.length) {
        setNextExpected(alphabets[nextIndex]);
        setFeedbackMessage(`Great! Now find ${alphabets[nextIndex]}!`);
        speakText(`Excellent! ${droppedLetter} is correct! Now find the letter ${alphabets[nextIndex]}.`);
      } else {
        // Game complete!
        setGameComplete(true);
        setNextExpected('');
        setFeedbackMessage('🎉 Congratulations! You completed the alphabet!');
        speakText('Amazing! You completed the entire alphabet! You are a superstar!');
      }
      
      // Add celebration candies and show success modal
      addCandies(droppedLetter);
      
    } else {
      // Wrong letter
      setFeedbackMessage(`That's ${droppedLetter}. Try to find ${nextExpected}!`);
      speakText(`Oops! That's ${droppedLetter}. Try to find the letter ${nextExpected}.`);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 3000);
    }
  };

  // Remove letter from sequence (deselect)
  const removeLetter = (letterToRemove, index) => {
    // Remove this letter and all letters after it
    const newSequence = sequence.slice(0, index);
    const removedLetters = sequence.slice(index);
    
    setSequence(newSequence);
    
    // Add removed letters back to available letters and shuffle
    const newAvailableLetters = [...availableLetters, ...removedLetters];
    setAvailableLetters(shuffleArray(newAvailableLetters));
    
    // Update next expected letter
    if (newSequence.length === 0) {
      setNextExpected('A');
    } else {
      const nextIndex = alphabets.indexOf(newSequence[newSequence.length - 1]) + 1;
      setNextExpected(alphabets[nextIndex]);
    }
    
    speakText(`Removed ${letterToRemove}. Now find ${newSequence.length === 0 ? 'A' : alphabets[alphabets.indexOf(newSequence[newSequence.length - 1]) + 1]}.`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const speakInstructions = () => {
    speakText(`Welcome to the Alphabet Sequence Game! Put the letters in order from A to Z. Start by finding the letter A and drag it to the top box. Then find B, then C, and so on!`);
  };

  const speakCurrentLetter = () => {
    if (nextExpected) {
      speakText(`Find the letter ${nextExpected} and drag it to the sequence box.`);
    }
  };

  // Remove auto-play - audio only on button click
  const handlePlayWelcome = () => {
    if (speechSupported) {
      speakText(`Welcome! Let's learn the alphabet sequence! Look for the big letter A and drag it to the top box!`);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900' 
        : 'bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100'
    }`}>
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-3xl relative overflow-hidden">
        
        {/* Celebration Candies */}
        {candies.map((candy) => (
          <div
            key={candy.id}
            className="fixed text-2xl sm:text-3xl md:text-4xl animate-bounce z-50 pointer-events-none"
            style={{
              left: `${candy.x}%`,
              top: `${candy.y}%`,
              animationDuration: '1s',
              animationDelay: `${Math.random() * 0.5}s`
            }}
          >
            {candy.emoji}
          </div>
        ))}

        {/* Success Modal with Candy Celebration */}
        {showSuccessModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            style={{ userSelect: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl transform animate-bounce max-w-sm md:max-w-md mx-4 overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Modal Candies */}
              {modalCandies.map((candy) => (
                <div
                  key={candy.id}
                  className="absolute text-2xl md:text-3xl lg:text-4xl animate-bounce pointer-events-none"
                  style={{
                    left: `${candy.x}%`,
                    top: `${candy.y}%`,
                    animationDuration: '1s',
                    animationDelay: `${candy.delay}s`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1
                  }}
                >
                  {candy.emoji}
                </div>
              ))}
              
              {/* Success Content */}
              <div className="text-center relative z-10">
                <div className="text-4xl md:text-5xl lg:text-6xl animate-pulse mb-3 md:mb-4">
                  🎉
                </div>
                <div className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 ${
                  isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  AWESOME!
                </div>
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 ${colors[alphabets.indexOf(successLetter)]} text-white rounded-2xl py-2 px-4 inline-block shadow-lg`}>
                  {successLetter}
                </div>
                <div className={`text-base md:text-lg lg:text-xl font-semibold ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Great job! Keep going! 🌟
                </div>
                
                {/* Close button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSuccessModal(false);
                    setModalCandies([]);
                  }}
                  className="mt-4 md:mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-2 md:py-3 px-4 md:px-6 rounded-full shadow-lg transition-all transform hover:scale-105 text-sm md:text-base"
                >
                  Continue! 🚀
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${
            isDarkMode 
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400' 
              : 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
          }`}>
            🌈 Alphabet Sequence Game 📝
          </h1>
          
          {/* Score and Controls */}
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <div className={`rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 shadow-lg ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
            }`}>
              <span className="text-sm sm:text-base md:text-lg font-bold text-green-600">
                Progress: {sequence.length}/26
              </span>
            </div>
            
            {!gameComplete && nextExpected && (
              <div className={`rounded-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 shadow-lg ${
                isDarkMode ? 'bg-blue-800 text-white' : 'bg-blue-100'
              }`}>
                <span className="text-sm sm:text-base md:text-lg font-bold text-blue-600">
                  Find: {nextExpected}
                </span>
              </div>
            )}
            
            <div className="flex gap-1 sm:gap-2">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-gray-800 hover:bg-gray-900 text-white'
                }`}
                title="Toggle Dark/Light Mode"
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              
              {speechSupported && (
                <>
                  <button
                    onClick={handlePlayWelcome}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                    title="Play Welcome Instructions"
                  >
                    <span className="text-sm sm:text-base">🎧</span>
                  </button>
                  
                  <button
                    onClick={speakInstructions}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                    title="Hear Instructions"
                  >
                    <span className="text-sm sm:text-base">📢</span>
                  </button>
                  
                  <button
                    onClick={() => isPlaying ? stopSpeech() : speakCurrentLetter()}
                    className={`${isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105`}
                    title={isPlaying ? 'Stop' : 'Hear Current Letter'}
                  >
                    <span className="text-sm sm:text-base">{isPlaying ? '🔇' : '🔊'}</span>
                  </button>
                </>
              )}
              
              <button
                onClick={initializeGame}
                className="bg-orange-500 hover:bg-orange-600 text-white p-2 sm:p-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                title="Reset Game"
              >
                <span className="text-sm sm:text-base">🔄</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {showFeedback && (
          <div className="flex justify-center mb-4">
            <div className={`px-4 py-2 rounded-full shadow-lg animate-bounce ${
              feedbackMessage.includes('Great') || feedbackMessage.includes('Congratulations')
                ? isDarkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                : isDarkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              <span className="text-sm sm:text-base font-semibold">{feedbackMessage}</span>
            </div>
          </div>
        )}

        {/* Main Game Area */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Sequence Display - Top Box */}
          <div className="flex justify-center px-2">
            <div className="w-full max-w-6xl">
              <div
                data-drop-zone="true"
                className={`
                  min-h-24 sm:min-h-28 md:min-h-32 lg:min-h-36 
                  rounded-2xl sm:rounded-3xl border-4 border-dashed transition-all duration-300 
                  flex flex-wrap items-center justify-center p-3 sm:p-4 md:p-6 gap-2 sm:gap-3 md:gap-4 shadow-2xl
                  ${isDarkMode 
                    ? 'border-purple-400 bg-gray-800 hover:border-purple-300 hover:bg-gray-700' 
                    : 'border-purple-400 bg-white hover:border-purple-600 hover:bg-purple-50'
                  }
                `}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                style={{ userSelect: 'none' }}
              >
                {sequence.length === 0 ? (
                  <div className="text-center">
                    <div className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold animate-pulse ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      A
                    </div>
                    <p className={`text-base sm:text-lg md:text-xl mt-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {window.innerWidth < 640 ? 'Find and tap A!' : 'Find and drag A here!'}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-3 justify-center">
                    {sequence.map((letter, index) => (
                      <div
                        key={`${letter}-${index}`}
                        onClick={() => removeLetter(letter, index)}
                      style={{ userSelect: 'none' }}
                        className={`
                          ${colors[alphabets.indexOf(letter)]} 
                          text-white font-bold cursor-pointer
                          text-base sm:text-lg md:text-xl lg:text-2xl
                          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16
                          rounded-xl sm:rounded-2xl 
                          flex items-center justify-center 
                          shadow-lg hover:shadow-xl
                          transition-all duration-200
                          hover:scale-110 active:scale-95
                          border-2 border-white
                          select-none
                        `}
                        title={`Remove ${letter} and letters after it`}
                      >
                        {letter}
                      </div>
                    ))}
                    
                    {/* Next expected letter placeholder */}
                    {!gameComplete && (
                      <div className={`
                        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20
                        rounded-xl sm:rounded-2xl border-4 border-dashed
                        flex items-center justify-center 
                        ${isDarkMode ? 'border-purple-400 bg-gray-700' : 'border-purple-400 bg-purple-50'}
                        animate-pulse
                      `}>
                        <span className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold ${
                          isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                          {nextExpected}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {gameComplete && (
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl animate-bounce mb-4">
                      🎉🌟🎊
                    </div>
                    <div className={`text-xl sm:text-2xl md:text-3xl font-bold ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Perfect! You know your ABCs!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Available Letters Grid - Bottom Box */}
          {availableLetters.length > 0 && (
            <div className={`rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 shadow-2xl border-4 mx-2 ${
              isDarkMode 
                ? 'bg-gray-800 border-purple-600' 
                : 'bg-white border-gradient-to-r from-purple-400 to-pink-400'
            }`}>
              <div className="text-center mb-3 sm:mb-4">
                <h2 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  🔤 {window.innerWidth < 640 ? 'Tap the letters!' : 'Drag the letters!'} 🔤
                </h2>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-13 gap-1 sm:gap-2 md:gap-3">
                {availableLetters.map((letter) => (
                  <div
                    key={`available-${letter}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, letter)}
                    onTouchStart={(e) => handleTouchStart(e, letter)}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ 
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none'
                    }}
                    className={`
                      ${colors[alphabets.indexOf(letter)]} 
                      text-white font-bold 
                      text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl
                      w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20
                      rounded-xl sm:rounded-2xl 
                      flex items-center justify-center 
                      cursor-grab active:cursor-grabbing touch-manipulation
                      shadow-lg hover:shadow-xl
                      transition-all duration-200
                      hover:scale-110 active:scale-95
                      border-2 border-white
                      hover:rotate-3
                      ${draggedItem === letter ? 'scale-110 rotate-3 ring-4 ring-white ring-opacity-50' : ''}
                      ${letter === nextExpected ? 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}
                      select-none
                    `}
                    title={`${window.innerWidth < 640 ? 'Tap' : 'Drag'} ${letter}`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className={`mt-6 sm:mt-8 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border-2 mx-2 ${
          isDarkMode 
            ? 'bg-gray-800 border-purple-600' 
            : 'bg-white border-purple-200'
        }`}>
          <h3 className={`text-base sm:text-lg font-bold text-center mb-2 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`}>
            🎮 How to Play
          </h3>
          <div className={`text-center space-y-1 text-xs sm:text-sm md:text-base ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p>1. Put letters in order: A, B, C, D... Z 📝</p>
            <p>2. {window.innerWidth < 640 ? 'Tap and drag' : 'Drag and drop'} letters to the top box 🖱️</p>
            <p>3. Click letters in the sequence to remove them ❌</p>
            <p>4. Collect candies for correct letters! 🍬</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlphabetSequenceLearning;


