import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SeatingArrangementSecondToLeft = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  // currentHighlight can be 'ninnie', 'vinnie-step', 'annie-step', or null
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const utteranceRef = useRef(null);
  const timeoutRef = useRef(null); // To store setTimeout IDs for clearing
  const currentSegmentIndex = useRef(0); // Tracks which segment of speech is currently active

  // Define the speech sequence with text, associated highlight, and optional delay after speaking
  const speechSequence = [
    {
      text: "Here we are going to learn nth position to the left. Annie is second to the left of Ninnie. Starting from Ninnie -",
      highlight: 'ninnie'
    },
    {
      text: "First to the left is Vinnie.",
      highlight: 'vinnie-step',
      delayAfter: 1000 // 2-second pause after this segment
    },
    {
      text: "And second to the left is Annie.",
      highlight: 'annie-step'
    }
  ];

  const languages = [
    {
      code: 'en-US',
      name: 'English (US)',
      message: 'Here we are going to learn nth position to the left. Annie is second to the left of Ninnie. Starting from Ninnie - First to the left is Vinnie and second to the left is Annie.'
    },
    {
      code: 'en-GB',
      name: 'English (UK)',
      message: 'Here we are going to learn nth position to the left. Annie is second to the left of Ninnie. Starting from Ninnie - First to the left is Vinnie and second to the left is Annie.'
    },
    {
      code: 'es-ES',
      name: 'Spanish',
      message: 'Aquí vamos a aprender la posición enésima a la izquierda. Annie está segunda a la izquierda de Ninnie. Comenzando desde Ninnie - Primera a la izquierda está Vinnie y segunda a la izquierda está Annie.'
    },
    {
      code: 'fr-FR',
      name: 'French',
      message: 'Ici nous allons apprendre la nième position à gauche. Annie est deuxième à gauche de Ninnie. En partant de Ninnie - Première à gauche est Vinnie et deuxième à gauche est Annie.'
    },
    {
      code: 'de-DE',
      name: 'German',
      message: 'Hier lernen wir die n-te Position nach links. Annie ist die zweite links von Ninnie. Beginnend von Ninnie - Erste links ist Vinnie und zweite links ist Annie.'
    },
    {
      code: 'it-IT',
      name: 'Italian',
      message: 'Qui impareremo la posizione ennesima a sinistra. Annie è seconda a sinistra di Ninnie. Partendo da Ninnie - Prima a sinistra è Vinnie e seconda a sinistra è Annie.'
    },
    {
      code: 'pt-BR',
      name: 'Portuguese',
      message: 'Aqui vamos aprender a posição enésima à esquerda. Annie está em segundo à esquerda de Ninnie. Começando de Ninnie - Primeira à esquerda está Vinnie e segunda à esquerda está Annie.'
    },
    {
      code: 'ru-RU',
      name: 'Russian',
      message: 'Здесь мы изучим n-ю позицию слева. Энни вторая слева от Нинни. Начиная с Нинни - Первая слева это Винни, а вторая слева это Энни.'
    },
    {
      code: 'ja-JP',
      name: 'Japanese',
      message: 'ここで左からn番目の位置を学びます。アニーはニニーの左から2番目です。ニニーから始めて - 左から1番目はビニー、左から2番目はアニーです。'
    },
    {
      code: 'ko-KR',
      name: 'Korean',
      message: '여기서 왼쪽에서 n번째 위치를 배우겠습니다. 애니는 니니의 왼쪽에서 두 번째입니다. 니니부터 시작해서 - 왼쪽 첫 번째는 비니이고 왼쪽 두 번째는 애니입니다.'
    },
    {
      code: 'zh-CN',
      name: 'Chinese',
      message: '这里我们将学习左边第n个位置。安妮是尼尼左边第二个。从尼尼开始 - 左边第一个是维尼，左边第二个是安妮。'
    },
    {
      code: 'hi-IN',
      name: 'Hindi',
      message: 'यहाँ हम बाईं ओर nth स्थिति सीखने जा रहे हैं। एनी निन्नी के बाईं ओर दूसरी है। निन्नी से शुरू करके - बाईं ओर पहली विनी है और बाईं ओर दूसरी एनी है।'
    },
    {
      code: 'ar-SA',
      name: 'Arabic',
      message: 'هنا سوف نتعلم الموضع رقم n على اليسار. آني هي الثانية على يسار نيني. بدءاً من نيني - الأولى على اليسار هي فيني والثانية على اليسار هي آني.'
    },
  ];

  // Asset Image Components (Simplified paths for example)
  const AnnieAssetImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img
        src="https://placehold.co/128x160/FBCFE8/831843?text=Annie" // Placeholder image
        alt="Annie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-pink-600 dark:text-pink-300 font-bold text-xs md:text-sm">
          Annie
        </div>
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img
        src="https://placehold.co/128x160/DBEAFE/1E40AF?text=Vinnie" // Placeholder image
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-blue-600 dark:text-blue-300 font-bold text-xs md:text-sm">
          Vinnie
        </div>
      </div>
    </div>
  );

  const NinnieAssetImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      <img
        src="https://placehold.co/128x160/D1FAE5/065F46?text=Ninnie" // Placeholder image
        alt="Ninnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 absolute top-0 left-0" style={{ display: 'none' }}>
        <div className="flex items-center justify-center h-full text-green-600 dark:text-green-300 font-bold text-xs md:text-sm">
          Ninnie
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components (Stylized abstract representations)
  const AnnieImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>

      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>

        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-pink-400 dark:bg-pink-500 rounded-full"></div>

        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>

      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>

      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-pink-300 dark:bg-pink-600 rounded-full"></div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>

      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>

        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-blue-400 dark:bg-blue-500 rounded-full"></div>

        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>

      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>

      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-blue-300 dark:bg-blue-600 rounded-full"></div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  const NinnieImage = () => (
    <div className="w-14 h-20 md:w-32 md:h-40 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      {/* Hair */}
      <div className="absolute top-[4%] left-1/2 transform -translate-x-1/2 w-[75%] h-[25%] md:w-[62.5%] md:h-[20%] bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 rounded-t-full"></div>

      {/* Face */}
      <div className="absolute top-[16%] left-1/2 transform -translate-x-1/2 w-[50%] h-[33.3%] md:w-[37.5%] md:h-[30%] bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 rounded-full border border-green-300 dark:border-green-600">
        {/* Eyes */}
        <div className="absolute top-[25%] left-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-[25%] right-[12.5%] w-[12.5%] h-[12.5%] md:w-[16.6%] md:h-[16.6%] bg-gray-800 dark:bg-gray-200 rounded-full"></div>

        {/* Nose */}
        <div className="absolute top-[37.5%] left-1/2 transform -translate-x-1/2 w-[6.25%] h-[6.25%] md:w-[8.3%] md:h-[8.3%] bg-green-400 dark:bg-green-500 rounded-full"></div>

        {/* Mouth */}
        <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[25%] h-[6.25%] md:w-[25%] md:h-[8.3%] bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>

      {/* Body */}
      <div className="absolute bottom-[25%] left-1/2 transform -translate-x-1/2 w-[43.75%] h-[41.6%] md:w-[31.25%] md:h-[40%] bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-700 rounded-lg"></div>

      {/* Arms */}
      <div className="absolute bottom-[50%] left-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-green-300 dark:bg-green-600 rounded-full"></div>
      <div className="absolute bottom-[50%] right-[6.25%] w-[6.25%] h-[20.8%] md:w-[6.25%] md:h-[20%] bg-green-300 dark:bg-green-600 rounded-full"></div>

      {/* Legs */}
      <div className="absolute bottom-0 left-[37.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-orange-400 dark:bg-orange-500 rounded-full"></div>
      <div className="absolute bottom-0 left-[62.5%] transform -translate-x-1/2 w-[6.25%] h-[16.6%] md:w-[6.25%] md:h-[15%] bg-orange-400 dark:bg-orange-500 rounded-full"></div>
    </div>
  );

  // Reusable Character Component
  const CharacterComponent = ({ name, ImageComponent, colorTheme, isHighlighted = false }) => (
    <div className="flex flex-col items-center relative">
      <div className="relative">
        <ImageComponent />
        {/* Highlight ring */}
        {isHighlighted && (
          <div className="absolute -inset-2 border-3 border-yellow-400 dark:border-yellow-500 rounded-xl animate-pulse bg-yellow-100/30 dark:bg-yellow-900/30"></div>
        )}
      </div>
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')} ${isHighlighted ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>
        {name}
      </h3>
    </div>
  );

  // Position Indicator Component
  const PositionIndicator = ({ position, isActive = false }) => (
    <div className={`flex flex-col items-center mx-0.5 md:mx-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
      <div className="flex items-center gap-0.5 md:gap-2">
        <div className="w-3 h-0.5 md:w-8 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
        <ArrowRight size={8} className="md:w-4 md:h-4 text-purple-500 dark:text-purple-400" />
      </div>
      <div className="text-xs md:text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">{position}</div>
    </div>
  );

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Function to reset all speech and highlighting states
  const resetSpeechAndHighlighting = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any pending timeouts
      timeoutRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentHighlight(null);
    currentSegmentIndex.current = 0; // Reset segment index to start from beginning
  }, []);

  // Function to speak a specific segment of the message
  const speakSegment = useCallback((index) => {
    // If all segments have been spoken, reset and exit
    if (index >= speechSequence.length) {
      resetSpeechAndHighlighting();
      return;
    }

    const { text, highlight, delayAfter } = speechSequence[index];
    setCurrentHighlight(highlight); // Apply the highlight for the current segment

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage;
    utterance.rate = 0.7;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // If there's a delay specified for this segment, set a timeout
      if (delayAfter) {
        timeoutRef.current = setTimeout(() => {
          currentSegmentIndex.current++; // Move to the next segment
          speakSegment(currentSegmentIndex.current); // Speak the next segment
        }, delayAfter);
      } else {
        // No delay, immediately move to the next segment
        currentSegmentIndex.current++;
        speakSegment(currentSegmentIndex.current);
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      resetSpeechAndHighlighting();
    };

    utteranceRef.current = utterance; // Store the current utterance
    window.speechSynthesis.speak(utterance);
  }, [currentLanguage, resetSpeechAndHighlighting]); // Dependencies for useCallback

  // Main function to play the voice message
  const playVoiceMessage = useCallback(() => {
    if (isPaused && utteranceRef.current) {
      // If paused, resume the current utterance
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // If not paused, start the sequence from the beginning
      resetSpeechAndHighlighting(); // Ensure a clean start
      currentSegmentIndex.current = 0; // Reset index to 0
      speakSegment(currentSegmentIndex.current); // Start speaking the first segment
    }
  }, [isPaused, resetSpeechAndHighlighting, speakSegment]); // Dependencies for useCallback

  // Function to pause the voice message
  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause(); // Pause the current utterance
      setIsPlaying(false);
      setIsPaused(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear any pending delays if paused mid-delay
        timeoutRef.current = null;
      }
    }
  };

  // Handler for language change
  const handleLanguageChange = (langCode) => {
    resetSpeechAndHighlighting(); // Reset everything before changing language
    setCurrentLanguage(langCode);
    setIsDropdownOpen(false);
    // Add a small delay to allow state to update before playing the new message
    // This is important because changing language and immediately playing might cause issues
    // if the browser's speech synthesis engine isn't ready for the new language.
    setTimeout(() => playVoiceMessage(), 100);
  };

  // useEffect to play the message on initial component mount
  // Removed automatic play on mount to avoid 'not-allowed' error
  useEffect(() => {
    // Cleanup function: stop speech and clear timers when component unmounts
    return () => {
      resetSpeechAndHighlighting();
    };
  }, [resetSpeechAndHighlighting]); // Dependencies for useEffect

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-800 dark:text-gray-100">
          Learning nth Position to the Left
        </h1>

        {/* Image Type Toggle */}
        <div className="flex justify-center mb-3 md:mb-6">
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
        <div className="flex justify-center mb-3 md:mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-28 md:min-w-40 text-xs md:text-base"
            >
              <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
              <ChevronDown size={14} className={`md:w-4 md:h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 md:w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 md:max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-2 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs md:text-base ${
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
        <div className="flex justify-center mb-4 md:mb-8">
          <button
            onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
            className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-base"
          >
            {isPlaying ? <Pause size={16} className="md:w-5 md:h-5" /> : <Play size={16} className="md:w-5 md:h-5" />}
            {isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}
          </button>
        </div>

        {/* Seating Arrangement Visualization */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 md:p-8">
          <div className="flex justify-center items-center overflow-x-auto">
            <div className="flex flex-row justify-center items-center gap-1 md:gap-6">

              {/* Ninnie - Reference point (Rightmost, as others are to her left) */}
              <CharacterComponent
                name="Ninnie"
                ImageComponent={useAssetImages ? NinnieAssetImage : NinnieImage}
                colorTheme="text-green-600"
                isHighlighted={currentHighlight === 'ninnie'}
              />

              {/* Position Indicator: 1st to the left */}
              {/* Active if we are highlighting Vinnie or Annie's step, as 1st is part of the path */}
              <PositionIndicator
                position="1st to the left"
                isActive={currentHighlight === 'vinnie-step' || currentHighlight === 'annie-step'}
              />

              {/* Vinnie - Position 1 (First to the left of Ninnie) */}
              <CharacterComponent
                name="Vinnie"
                ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage}
                colorTheme="text-blue-600"
                isHighlighted={currentHighlight === 'vinnie-step'}
              />

              {/* Position Indicator: 2nd to the left */}
              {/* Active only when highlighting Annie's step */}
              <PositionIndicator
                position="2nd to the left"
                isActive={currentHighlight === 'annie-step'}
              />

              {/* Annie - Position 2 (Second to the left of Ninnie) */}
              <CharacterComponent
                name="Annie"
                ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage}
                colorTheme="text-pink-600"
                isHighlighted={currentHighlight === 'annie-step'}
              />
            </div>
          </div>
        </div>

        {/* Explanation Box */}
        <div className="mt-4 md:mt-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 md:p-4 border border-blue-200 dark:border-blue-700">
          <h3 className="text-sm md:text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">Key Points:</h3>
          <ul className="text-xs md:text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• <strong>Reference Point:</strong> <span className={currentHighlight === 'ninnie' ? 'font-bold text-yellow-700 dark:text-yellow-400' : ''}>Ninnie</span> (starting position)</li>
            <li>• <strong>1st to the left of Ninnie:</strong> <span className={currentHighlight === 'vinnie-step' ? 'font-bold text-yellow-700 dark:text-yellow-400' : ''}>Vinnie</span> (first person when moving left from Ninnie)</li>
            <li>• <strong>2nd to the left of Ninnie:</strong> <span className={currentHighlight === 'annie-step' ? 'font-bold text-yellow-700 dark:text-yellow-400' : ''}>Annie</span> (second person when moving left from Ninnie)</li>
            <li>• <strong>Arrangement (from left to right):</strong> Annie → Vinnie → Ninnie</li>
          </ul>
        </div>

        {/* Current Message Display */}
        <div className="mt-4 md:mt-8 text-center px-2 md:px-4">
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
            "{languages.find(l => l.code === currentLanguage)?.message || languages[0].message}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementSecondToLeft;
