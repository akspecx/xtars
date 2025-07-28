import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, Check, X } from 'lucide-react';

const SeatingArrangementAdditionalPractice = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const utteranceRef = useRef(null);

  // Define language-specific messages, questions, and answers
  const languages = [
    { 
      code: 'en-US', 
      name: 'English (US)', 
      message: 'Annie, Vinnie, and Ninnie are sitting in a row',
      question: 'Who is sitting to the left of Annie?', // Updated question
      correctAnswer: 'The correct answer is Vinnie', // Updated correct answer
      incorrectAnswer: 'The correct answer is Vinnie. From Annie\'s perspective, Vinnie is to her left.' // Updated incorrect answer explanation
    },
    { 
      code: 'en-GB', 
      name: 'English (UK)', 
      message: 'Annie, Vinnie, and Ninnie are sitting in a row',
      question: 'Who is sitting to the left of Annie?', // Updated question
      correctAnswer: 'The correct answer is Vinnie', // Updated correct answer
      incorrectAnswer: 'The correct answer is Vinnie. From Annie\'s perspective, Vinnie is to her left.' // Updated incorrect answer explanation
    },
    { 
      code: 'de-DE', 
      name: 'German', 
      message: 'Annie, Vinnie und Ninnie sitzen in einer Reihe',
      question: 'Wer sitzt links von Annie?', // Updated question
      correctAnswer: 'Die richtige Antwort ist Vinnie', // Updated correct answer
      incorrectAnswer: 'Die richtige Antwort ist Vinnie. Aus Annies Sicht ist Vinnie zu ihrer Linken.' // Updated incorrect answer explanation
    },
    { 
      code: 'hi-IN', 
      name: 'Hindi', 
      message: 'एनी, विनी और निन्नी एक कतार में बैठे हैं',
      question: 'एनी के बाईं ओर कौन बैठा है？', // Updated question
      correctAnswer: 'सही उत्तर विनी है', // Updated correct answer
      incorrectAnswer: 'सही उत्तर विनी है। एनी के दृष्टिकोण से, विनी उसके बाईं ओर है।' // Updated incorrect answer explanation
    },
  ];

  // Asset Image Components (placeholders for actual images)
  const AnnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img 
        src="https://placehold.co/128x160/FBCFE8/881337?text=Annie" // Placeholder image
        alt="Annie"
        className="w-full h-full object-cover"
        // Fallback to text if image fails to load
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0 flex items-center justify-center text-pink-600 dark:text-pink-300 font-bold text-xs md:text-sm" style={{display: 'none'}}>
        Annie
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img 
        src="https://placehold.co/128x160/DBEAFE/1E40AF?text=Vinnie" // Placeholder image
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs md:text-sm" style={{display: 'none'}}>
        Vinnie
      </div>
    </div>
  );

  const NinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      <img 
        src="https://placehold.co/128x160/D1FAE5/065F46?text=Ninnie" // Placeholder image
        alt="Ninnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 absolute top-0 left-0 flex items-center justify-center text-green-600 dark:text-green-300 font-bold text-xs md:text-sm" style={{display: 'none'}}>
        Ninnie
      </div>
    </div>
  );

  // Character DIV Image Components (stylized representations)
  const AnnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  const NinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 rounded-full border border-green-300 dark:border-green-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-green-400 dark:bg-green-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-yellow-500 dark:bg-yellow-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-yellow-500 dark:bg-yellow-600 rounded-full"></div>
    </div>
  );

  // Reusable Character Component to display name and image
  const CharacterComponent = ({ name, ImageComponent, colorTheme }) => (
    <div className="flex flex-col items-center">
      <ImageComponent />
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')}`}>{name}</h3>
    </div>
  );

  // Helper function to get the current message based on selected language
  const getCurrentMessage = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.message : languages[0].message; // Default to first language if not found
  };

  // Helper function to get the current question based on selected language
  const getCurrentQuestion = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.question : languages[0].question;
  };

  // Helper function to get the current correct answer message
  const getCurrentCorrectAnswer = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.correctAnswer : languages[0].correctAnswer;
  };

  // Helper function to get the current incorrect answer message
  const getCurrentIncorrectAnswer = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.incorrectAnswer : languages[0].incorrectAnswer;
  };

  // Helper function to get the current language name for display
  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Function to play or resume voice message
  const playVoiceMessage = (text = null) => {
    if (isPaused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      
      const messageToSpeak = text || getCurrentMessage(); // Use provided text or current message
      const utterance = new SpeechSynthesisUtterance(messageToSpeak);
      utterance.lang = currentLanguage;
      utterance.rate = 0.8; // Slightly slower speech
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      
      utteranceRef.current = utterance; // Store utterance reference for pause/resume
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to pause voice message
  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  // Handle language change from dropdown
  const handleLanguageChange = (langCode) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech when changing language
    }
    setCurrentLanguage(langCode);
    setIsPlaying(false);
    setIsPaused(false);
    setIsDropdownOpen(false);
    utteranceRef.current = null;
  };

  // Handle user's answer selection
  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    // Logic updated to check if Vinnie is the correct answer
    setIsCorrect(answer === 'Vinnie'); // Vinnie is correct - he's to Annie's left from her perspective
    
    // Play the appropriate answer message after a short delay
    setTimeout(() => {
      const answerText = answer === 'Vinnie' ? getCurrentCorrectAnswer() : getCurrentIncorrectAnswer();
      playVoiceMessage(answerText);
    }, 500);
  };

  // Reset quiz state for a new attempt
  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    // Optionally, replay the initial message
    playVoiceMessage(); 
  };

  // Effect to play initial message on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      playVoiceMessage();
    }, 1000); // Delay to ensure component is fully rendered

    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Clean up speech synthesis on unmount
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-6">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800 dark:text-gray-100">
          Seating Arrangement Practice
        </h1>
        
        {/* Image Type Toggle */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setUseAssetImages(false)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                !useAssetImages 
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              DIV Images
            </button>
            <button
              onClick={() => setUseAssetImages(true)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                useAssetImages 
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Asset Images
            </button>
          </div>
        </div>
        
        {/* Language Selection Dropdown */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-24 md:min-w-32 text-xs md:text-sm"
            >
              <span className="text-gray-700 dark:text-gray-200 truncate">{getCurrentLanguageName()}</span>
              <ChevronDown size={14} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 md:w-44 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs md:text-sm ${
                      currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voice Control */}
        <div className="flex justify-center mb-4 md:mb-6">
          <button
            onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-sm"
          >
            {isPlaying ? <Pause size={14} className="md:w-4 md:h-4" /> : <Play size={14} className="md:w-4 md:h-4" />}
            {isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
          </button>
        </div>

        {/* Seating Arrangement Visualization */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 md:p-6 mb-4 md:mb-6">
          <div className="flex justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-2 md:gap-8 w-full">
              {/* Annie - Left */}
              <CharacterComponent 
                name="Annie" 
                ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage} 
                colorTheme="text-pink-600"
              />
              
              {/* Vinnie - Center */}
              <CharacterComponent 
                name="Vinnie" 
                ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage} 
                colorTheme="text-blue-600"
              />
              
              {/* Ninnie - Right */}
              <CharacterComponent 
                name="Ninnie" 
                ImageComponent={useAssetImages ? NinnieAssetImage : NinnieImage} 
                colorTheme="text-green-600"
              />
            </div>
          </div>
        </div>

        {/* Current Message Display */}
        <div className="mb-4 md:mb-6 text-center px-2 md:px-4">
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic break-words">
            "{getCurrentMessage()}"
          </p>
        </div>

        {/* Quiz Question */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-300 text-center mb-3 md:mb-4">
            {getCurrentQuestion()}
          </h2>
          
          {!showResult && (
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
              <button
                onClick={() => handleAnswerSelect('Vinnie')} 
                className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              >
                Vinnie
              </button>
              <button
                onClick={() => handleAnswerSelect('Ninnie')}
                className="px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              >
                Ninnie
              </button>
            </div>
          )}

          {showResult && (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-3 md:mb-4 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? <Check size={20} className="md:w-6 md:h-6" /> : <X size={20} className="md:w-6 md:h-6" />}
                <span className="text-lg md:text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
              </div>
              
              {/* Show selected answer with color coding */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center mb-3 md:mb-4">
                <div className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base ${
                  selectedAnswer === 'Vinnie' 
                    ? (isCorrect ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-red-500 dark:bg-red-600 text-white')
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  Vinnie {selectedAnswer === 'Vinnie' && (isCorrect ? '✓' : '✗')}
                </div>
                <div className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base ${
                  selectedAnswer === 'Ninnie' 
                    ? (isCorrect ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-red-500 dark:bg-red-600 text-white')
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  Ninnie {selectedAnswer === 'Ninnie' && (isCorrect ? '✓' : '✗')}
                </div>
              </div>
              
              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                {isCorrect 
                  ? "Great job! Vinnie is sitting to the left of Annie (from Annie's perspective)."
                  : "The correct answer is Vinnie. From Annie's perspective facing you, Vinnie is to her left."}
              </p>
              
              <button
                onClick={resetQuiz}
                className="px-4 md:px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementAdditionalPractice;
