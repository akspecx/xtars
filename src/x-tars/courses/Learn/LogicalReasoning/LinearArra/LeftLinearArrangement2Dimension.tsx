import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SeatingArrangementModule = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)', message: 'Vinnie is sitting to the left of Annie. Vinnie likes Green color and Annie likes the Red color' },
    { code: 'en-GB', name: 'English (UK)', message: 'Vinnie is sitting to the left of Annie. Vinnie likes Green colour and Annie likes the Red colour' },
    { code: 'es-ES', name: 'Spanish', message: 'Vinnie está sentado a la izquierda de Annie. A Vinnie le gusta el color verde y a Annie le gusta el color rojo' },
    { code: 'fr-FR', name: 'French', message: 'Vinnie est assis à la gauche d\'Annie. Vinnie aime la couleur verte et Annie aime la couleur rouge' },
    { code: 'de-DE', name: 'German', message: 'Vinnie sitzt links von Annie. Vinnie mag die Farbe Grün und Annie mag die Farbe Rot' },
    { code: 'it-IT', name: 'Italian', message: 'Vinnie è seduto alla sinistra de Annie. A Vinnie piace il colore verde e ad Annie piace il colore rosso' },
    { code: 'pt-BR', name: 'Portuguese', message: 'Vinnie está sentado à esquerda de Annie. Vinnie gosta da cor verde e Annie gosta da cor vermelha' },
    { code: 'ru-RU', name: 'Russian', message: 'Винни сидит слева от Энни. Винни нравится зеленый цвет, а Энни нравится красный цвет' },
    { code: 'ja-JP', name: 'Japanese', message: 'ビニーはアニーの左に座っています。ビニーは緑色が好きで、アニーは赤色が好きです' },
    { code: 'ko-KR', name: 'Korean', message: '비니는 애니의 왼쪽에 앉아 있습니다. 비니는 초록색을 좋아하고 애니는 빨간색을 좋아합니다' },
    { code: 'zh-CN', name: 'Chinese', message: '维尼坐在安妮的左边。维尼喜欢绿色，安妮喜欢红色' },
    { code: 'hi-IN', name: 'Hindi', message: 'विनी एनी के बाईं ओर बैठा है। विनी को हरा रंग पसंद है और एनी को लाल रंग पसंद है' },
    { code: 'ar-SA', name: 'Arabic', message: 'فيني جالس على يسار آني. فيني يحب اللون الأخضر وآني تحب اللون الأحمر' },
  ];

  // Asset Image Components
  const AnnieAssetImage = () => (
    <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img
        src="https://placehold.co/192x256/FBCFE8/EC4899?text=Annie"
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
        <div className="flex items-center justify-center h-full text-pink-600 dark:text-pink-300 font-bold text-sm">
          Annie Image
        </div>
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img
        src="https://placehold.co/192x256/BFDBFE/2563EB?text=Vinnie"
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
        <div className="flex items-center justify-center h-full text-blue-600 dark:text-blue-300 font-bold text-sm">
          Vinnie Image
        </div>
      </div>
    </div>
  );

  // Character DIV Image Components - Simplified responsive design
  const AnnieImage = () => (
    <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-6 md:top-7 lg:top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-3 left-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 right-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-5 md:top-6 lg:top-7 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 md:w-4 md:h-1.5 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-8 md:bottom-10 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-12 md:w-12 md:h-16 lg:w-14 lg:h-20 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-2 w-2 h-6 md:w-3 md:h-8 lg:w-3 lg:h-10 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 right-2 w-2 h-6 md:w-3 md:h-8 lg:w-3 lg:h-10 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-2 w-2 h-5 md:w-3 md:h-6 lg:w-3 lg:h-7 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-5 md:w-3 md:h-6 lg:w-3 lg:h-7 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-24 h-32 md:w-32 md:h-40 lg:w-40 lg:h-52 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 md:w-20 md:h-10 lg:w-24 lg:h-12 bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-6 md:top-7 lg:top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-3 left-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 right-2 w-2 h-2 md:w-3 md:h-3 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-5 md:top-6 lg:top-7 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 w-3 h-1 md:w-4 md:h-1.5 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-8 md:bottom-10 lg:bottom-12 left-1/2 transform -translate-x-1/2 w-8 h-12 md:w-12 md:h-16 lg:w-14 lg:h-20 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-2 w-2 h-6 md:w-3 md:h-8 lg:w-3 lg:h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-16 md:bottom-20 lg:bottom-24 right-2 w-2 h-6 md:w-3 md:h-8 lg:w-3 lg:h-10 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-2 w-2 h-5 md:w-3 md:h-6 lg:w-3 lg:h-7 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-2 w-2 h-5 md:w-3 md:h-6 lg:w-3 lg:h-7 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  // Character Component - Fixed alignment structure
  type CharacterComponentProps = {
    name: string;
    ImageComponent: React.ComponentType;
    colorTheme: string;
    favoriteColor?: string;
  };

  const CharacterComponent: React.FC<CharacterComponentProps> = ({ name, ImageComponent, colorTheme, favoriteColor }) => (
    <div className="flex flex-col items-center">
      <div className="flex-shrink-0 mb-3">
        <ImageComponent />
      </div>
      <h3 className={`text-lg md:text-xl lg:text-2xl font-bold mb-3 ${colorTheme}`}>{name}</h3>
      {favoriteColor && (
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Colour preference:</div>
          <div
            className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg border-2 border-gray-400 dark:border-gray-500 shadow-md transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: favoriteColor }}
            title={favoriteColor}
          ></div>
        </div>
      )}
    </div>
  );

  // Direction Arrow Component - Updated to center properly
  type DirectionArrowProps = {
    direction: 'left' | 'right';
    color: string;
    label?: string;
    isActive?: boolean;
  };

  const DirectionArrow: React.FC<DirectionArrowProps> = ({ direction, color, label, isActive = false }) => {
    const ArrowIcon = direction === 'left' ? ArrowLeft : ArrowRight;
    const baseOpacity = isActive ? 'opacity-100' : 'opacity-30';
    const animationClass = isActive ? 'animate-pulse' : '';
    
    return (
      <div className={`flex items-center justify-center self-center ${baseOpacity} ${animationClass}`}>
        <div className="flex flex-col items-center">
          <ArrowIcon className={`w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 ${color} mb-2`} />
          {label && <div className={`text-sm md:text-base font-semibold ${color}`}>{label}</div>}
        </div>
      </div>
    );
  };

  // Helper functions
  const getCurrentMessage = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.message : languages[0].message;
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Speech functions
  const playVoiceMessage = () => {
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
      console.warn("Speech Synthesis API not supported in this browser.");
    }
  };

  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
    }
  };

  interface HandleLanguageChangeEvent extends Event {
    target: HTMLElement & { closest: (selector: string) => HTMLElement | null };
  }

  interface Language {
    code: string;
    name: string;
    message: string;
  }

  const handleLanguageChange = (langCode: string): void => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentLanguage(langCode);
    setIsPlaying(false);
    setIsPaused(false);
    setIsDropdownOpen(false);
    utteranceRef.current = null;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as HTMLElement).closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
            Seating Arrangement
          </h1>
          
          {/* Image Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setUseAssetImages(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !useAssetImages 
                    ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                DIV Images
              </button>
              <button
                onClick={() => setUseAssetImages(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
          <div className="flex justify-center mb-6">
            <div className="relative dropdown-container">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-40"
              >
                <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm ${
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

          {/* Voice Control Buttons */}
          <div className="flex justify-center mb-8">
            <button
              onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}</span>
            </button>
          </div>

          {/* Seating Arrangement Visualization - Fixed alignment */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 md:p-8">
            <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16">
              
              {/* Vinnie */}
              <CharacterComponent 
                name="Vinnie" 
                ImageComponent={useAssetImages ? VinnieAssetImage : VinnieImage} 
                colorTheme="text-blue-600 dark:text-blue-400"
                favoriteColor="green" 
              />

              {/* Direction Arrow */}
              <DirectionArrow 
                direction="right" 
                color="text-pink-500 dark:text-pink-400" 
                label="Left"
                isActive={true} 
              />

              {/* Annie */}
              <CharacterComponent 
                name="Annie" 
                ImageComponent={useAssetImages ? AnnieAssetImage : AnnieImage} 
                colorTheme="text-pink-600 dark:text-pink-400"
                favoriteColor="red" 
              />
            </div>
          </div>

          {/* Current Message Display */}
          <div className="mt-8 text-center px-4">
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 italic break-words leading-relaxed">
              "{getCurrentMessage()}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementModule;