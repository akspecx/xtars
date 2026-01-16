import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';


const SeatingArrangementBetween = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<number | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)', message: 'Annie is sitting between Vinnie and Ninnie' },
    { code: 'en-GB', name: 'English (UK)', message: 'Annie is sitting between Vinnie and Ninnie' },
    { code: 'es-ES', name: 'Spanish', message: 'Annie está sentada entre Vinnie y Ninnie' },
    { code: 'fr-FR', name: 'French', message: 'Annie est assise entre Vinnie et Ninnie' },
    { code: 'de-DE', name: 'German', message: 'Annie sitzt zwischen Vinnie und Ninnie' },
    { code: 'it-IT', name: 'Italian', message: 'Annie è seduta tra Vinnie e Ninnie' },
    { code: 'pt-BR', name: 'Portuguese', message: 'Annie está sentada entre Vinnie e Ninnie' },
    { code: 'ru-RU', name: 'Russian', message: 'Энни сидит между Винни и Нинни' },
    { code: 'ja-JP', name: 'Japanese', message: 'アニーはビニーとニニーの間に座っています' },
    { code: 'ko-KR', name: 'Korean', message: '애니는 비니와 니니 사이에 앉아 있습니다' },
    { code: 'zh-CN', name: 'Chinese', message: '安妮坐在维尼和尼尼之间' },
    { code: 'hi-IN', name: 'Hindi', message: 'एनी विनी और निन्नी के बीच बैठी है' },
    { code: 'ar-SA', name: 'Arabic', message: 'آني تجلس بين فيني ونيني' },
  ];

  // Asset Image Components
  const AnnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img 
        src="/path/to/annie-image.png"
        alt="Annie"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          if ((e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0" style={{display: 'none'}}>
        <div className="flex items-center justify-center h-full text-pink-600 dark:text-pink-300 font-bold text-xs md:text-sm">
          Annie
        </div>
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img 
        src="/path/to/vinnie-image.png"
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          if ((e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0" style={{display: 'none'}}>
        <div className="flex items-center justify-center h-full text-blue-600 dark:text-blue-300 font-bold text-xs md:text-sm">
          Vinnie
        </div>
      </div>
    </div>
  );

  const NinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      <img 
        src="/path/to/ninnie-image.png"
        alt="Ninnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          if ((e.target as HTMLImageElement).nextSibling instanceof HTMLElement) {
            ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 absolute top-0 left-0" style={{display: 'none'}}>
        <div className="flex items-center justify-center h-full text-green-600 dark:text-green-300 font-bold text-xs md:text-sm">
          Ninnie
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components
  const AnnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-10 md:w-10 md:h-16 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1 h-5 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1 h-5 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-10 md:w-10 md:h-16 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1 h-5 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1 h-5 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  const NinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-orange-600 to-orange-700 dark:from-orange-500 dark:to-orange-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 rounded-full border border-green-300 dark:border-green-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-green-400 dark:bg-green-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-10 md:w-10 md:h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1 h-5 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1 h-5 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-x-1 w-1 h-4 md:w-2 md:h-6 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
    </div>
  );

  // Reusable Character Component
  type CharacterComponentProps = {
    name: string;
    ImageComponent: React.ComponentType;
    colorTheme: string;
  };

  const CharacterComponent: React.FC<CharacterComponentProps> = ({ name, ImageComponent, colorTheme }) => (
    <div className="flex flex-col items-center">
      <ImageComponent />
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme}`}>{name}</h3>
    </div>
  );

  // Between Indicator right Component
  const BetweenRightIndicator = ({ isActive = false }) => (
    <div className={`flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-30'} ${isActive ? 'animate-pulse' : ''}`}>
      <div className="flex items-center gap-1 md:gap-2">
        <ArrowLeft size={12} className="md:w-4 md:h-4 text-purple-500 dark:text-purple-400" />
        <div className="w-8 h-1 md:w-12 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
      </div>
      <div className="text-xs md:text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">Right</div>
    </div>
  );

  // Between Indicator left Component
  const BetweenLeftIndicator = ({ isActive = false }) => (
      <div className={`flex flex-col items-center ${isActive ? 'opacity-100' : 'opacity-30'} ${isActive ? 'animate-pulse' : ''}`}>
        <div className="flex items-center gap-1 md:gap-2">
          <div className="w-8 h-1 md:w-12 md:h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
          <ArrowRight size={12} className="md:w-4 md:h-4 text-purple-500 dark:text-purple-400" />
        </div>
        <div className="text-xs md:text-sm font-semibold text-purple-600 dark:text-purple-400 mt-1">Left</div>
      </div>
    );


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
      if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
        setIsPaused(false);
      }
      return;
    }

    if ('speechSynthesis' in window) {
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
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  };

  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  const handleLanguageChange = (langCode: React.SetStateAction<string>) => {
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
    timerRef.current = setTimeout(() => {
      playVoiceMessage();
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, [currentLanguage]);

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-8 text-gray-800 dark:text-gray-100">
          Seating Arrangement - Between
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
            <div className="flex flex-row justify-center items-center gap-2 md:gap-8 min-w-max">
              
              {/* Vinnie - Left Character */}
              <CharacterComponent 
                name="Vinnie" 
                ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage} 
                colorTheme="text-blue-600 dark:text-blue-400"
              />

              {/* Between Indicator */}
              <BetweenRightIndicator isActive={true} />

              {/* Annie - Center Character (highlighted as being between) */}
              <div className="relative">
                <CharacterComponent 
                  name="Annie" 
                  ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage} 
                  colorTheme="text-pink-600 dark:text-pink-400"
                />
                {/* Highlight ring for Annie */}
                <div className="absolute -inset-2 border-2 border-purple-400 dark:border-purple-500 rounded-xl animate-pulse opacity-50"></div>
              </div>

              {/* Between Indicator */}
              <BetweenLeftIndicator isActive={true} />

              {/* Ninnie - Right Character */}
              <CharacterComponent 
                name="Ninnie" 
                ImageComponent={useAssetImages ? NinnieAssetImage : NinnieImage} 
                colorTheme="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
        </div>

        {/* Current Message Display */}
        <div className="mt-4 md:mt-8 text-center px-2 md:px-4">
          <p className="text-sm md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
            "{getCurrentMessage()}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementBetween;