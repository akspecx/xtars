import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SeatingArrangementModule = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false); // Toggle between div and asset images
  const utteranceRef = useRef(null);

const languages = [
    { code: 'en-US', name: 'English (US)', message: 'Vinnie is sitting to the left of Annie' },
    { code: 'en-GB', name: 'English (UK)', message: 'Vinnie is sitting to the left of Annie' },
    { code: 'es-ES', name: 'Spanish', message: 'Vinnie está sentado a la izquierda de Annie' },
    { code: 'fr-FR', name: 'French', message: 'Vinnie est assis à la gauche d\'Annie' },
    { code: 'de-DE', name: 'German', message: 'Vinnie sitzt links von Annie' },
    { code: 'it-IT', name: 'Italian', message: 'Vinnie è seduto alla sinistra di Annie' },
    { code: 'pt-BR', name: 'Portuguese', message: 'Vinnie está sentado à esquerda de Annie' },
    { code: 'ru-RU', name: 'Russian', message: 'Винни сидит слева от Энни' },
    { code: 'ja-JP', name: 'Japanese', message: 'ビニーはアニーの左に座っています' },
    { code: 'ko-KR', name: 'Korean', message: '비니는 애니의 왼쪽에 앉아 있습니다' },
    { code: 'zh-CN', name: 'Chinese', message: '维尼坐在安妮的左边' },
    { code: 'hi-IN', name: 'Hindi', message: 'विनी एनी के बाईं ओर बैठा है' },
    { code: 'ar-SA', name: 'Arabic', message: 'فيني جالس على يسار آني' },
];


  // Asset Image Components (placeholders for imported images)
  const AnnieAssetImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Replace this with your actual imported image */}
      <img 
        src="/path/to/annie-image.png" // Replace with your imported image path
        alt="Annie"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to div version if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      {/* Fallback div (hidden by default) */}
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0" style={{display: 'none'}}>
        <div className="flex items-center justify-center h-full text-pink-600 dark:text-pink-300 font-bold text-sm md:text-base">
          Annie Image
        </div>
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Replace this with your actual imported image */}
      <img 
        src="/path/to/vinnie-image.png" // Replace with your imported image path
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to div version if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'block';
        }}
      />
      {/* Fallback div (hidden by default) */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0" style={{display: 'none'}}>
        <div className="flex items-center justify-center h-full text-blue-600 dark:text-blue-300 font-bold text-sm md:text-base">
          Vinnie Image
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components (existing div-based images)
  const AnnieImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 md:w-28 md:h-12 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-3 left-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 right-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 md:w-2 md:h-2 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 md:w-4 md:h-2 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-16 md:w-16 md:h-24 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-16 left-2 w-2 h-8 md:w-3 md:h-12 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-16 right-2 w-2 h-8 md:w-3 md:h-12 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-2 w-2 h-6 md:w-3 md:h-8 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-6 md:w-3 md:h-8 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 md:w-28 md:h-12 bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-3 left-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 right-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-1 h-1 md:w-2 md:h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 md:w-4 md:h-2 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-10 h-16 md:w-16 md:h-24 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-16 left-2 w-2 h-8 md:w-3 md:h-12 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-16 right-2 w-2 h-8 md:w-3 md:h-12 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-2 w-2 h-6 md:w-3 md:h-8 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-6 md:w-3 md:h-8 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  // Reusable Character Component
  const CharacterComponent = ({ name, ImageComponent, colorTheme }) => (
    <div className="flex flex-col items-center">
      <ImageComponent />
      <h3 className={`text-lg md:text-2xl font-bold mt-2 md:mt-4 ${colorTheme}`}>{name}</h3>
    </div>
  );

  // Reusable Direction Arrow Component
  const DirectionArrow = ({ direction, color, label, isActive = false }) => {
    const ArrowIcon = direction === 'left' ? ArrowLeft : ArrowRight;
    const baseOpacity = isActive ? 'opacity-100' : 'opacity-30';
    const animationClass = isActive ? 'animate-pulse' : '';
    
    return (
      <div className={`flex flex-col items-center ${baseOpacity} ${animationClass}`}>
        <ArrowIcon size={16} className={`md:w-8 md:h-8 ${color} mb-1 md:mb-2`} />
        {label && <div className={`text-xs md:text-xs font-semibold ${color}`}>{label}</div>}
      </div>
    );
  };

  const getCurrentMessage = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.message : languages[0].message;
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  const playVoiceMessage = () => {
    if (isPaused && utteranceRef.current) {
      // Resume paused speech
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Check if speech synthesis is available
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(getCurrentMessage());
      utterance.lang = currentLanguage;
      utterance.rate = 0.8;
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
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleLanguageChange = (langCode) => {
    // Stop current speech when changing language
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentLanguage(langCode);
    setIsPlaying(false);
    setIsPaused(false);
    setIsDropdownOpen(false);
    utteranceRef.current = null;
  };

  useEffect(() => {
    // Auto-play voice message on component mount
    const timer = setTimeout(() => {
      playVoiceMessage();
    }, 1000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-100">
          Seating Arrangement
        </h1>
        
        {/* Image Type Toggle */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center gap-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setUseAssetImages(false)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                !useAssetImages 
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              DIV Images
            </button>
            <button
              onClick={() => setUseAssetImages(true)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
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
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-32 md:min-w-40 text-sm md:text-base"
            >
              <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
              <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 md:w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-3 md:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm md:text-base ${
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
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
          >
            {isPlaying ? <Pause size={18} className="md:w-5 md:h-5" /> : <Play size={18} className="md:w-5 md:h-5" />}
            {isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}
          </button>
        </div>

        {/* Seating Arrangement Visualization */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:p-8">
          <div className="flex justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-4 md:gap-16 w-full">
              
              {/* Vinnie - Left Character (as per the message "Vinnie is sitting to the left of Annie") */}
              <CharacterComponent 
                name="Vinnie" 
                ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage} 
                colorTheme="text-blue-600 dark:text-blue-400"
              />

              {/* Direction Arrow pointing right, labeled "Vinnie's Right" and active */}
              <DirectionArrow 
                direction="right" 
                color="text-blue-500 dark:text-blue-400" 
                label="Vinnie's Right"
                isActive={true}
              />

              {/* Annie - Right Character (to the right of Vinnie) */}
              <CharacterComponent 
                name="Annie" 
                ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage} 
                colorTheme="text-pink-600 dark:text-pink-400"
              />

              {/* Direction Arrow pointing left, labeled "Vinnie's Left" and inactive */}
              <DirectionArrow 
                direction="left" 
                color="text-gray-400 dark:text-gray-500" 
                label="Vinnie's Left"
                isActive={false}
              />
            </div>
          </div>
        </div>

        {/* Current Message Display */}
        <div className="mt-6 md:mt-8 text-center px-4">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
            "{getCurrentMessage()}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementModule;