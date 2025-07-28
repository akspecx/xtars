import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

const SeatingArrangementLeftReferenceModule = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [speechProgress, setSpeechProgress] = useState(0);
  const [totalSequenceDuration, setTotalSequenceDuration] = useState(0); // Track total sequence duration
  const [elapsedTime, setElapsedTime] = useState(0); // Track elapsed time in the sequence
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const messageTimeoutRef = useRef<number | null>(null);
  const sequenceStartTimeRef = useRef<number | null>(null); // Track when the sequence started

  // Define the messages for different languages - updated to be from characters' perspective
  const languages = [
    {
      code: 'en-US',
      name: 'English (US)',
      messages: [
        'Annie is sitting to the left of Vinnie.',
        'Left and Right direction is from Vinnie\'s perspective, not yours.',
        'From Vinnie\'s point of view, Annie is on his left side. Observe Annie\'s position.',
        'The seating arrangement is always described from the characters\' perspective, not the viewer\'s perspective.'
      ]
    },
    {
      code: 'en-GB',
      name: 'English (UK)',
      messages: [
        'Annie is sitting to the left of Vinnie.',
        'Left and Right direction is from Vinnie\'s perspective, not yours.',
        'From Vinnie\'s point of view, Annie is on his left side. Observe Annie\'s position.',
        'The seating arrangement is always described from the characters\' perspective, not the viewer\'s perspective.'
      ]
    },
    {
      code: 'es-ES',
      name: 'Spanish',
      messages: [
        'Annie está sentada a la izquierda de Vinnie.',
        'La dirección izquierda y derecha es desde la perspectiva de Vinnie, no tuya.',
        'Desde el punto de vista de Vinnie, Annie está a su izquierda. Observa la posición de Annie.',
        'La disposición de los asientos siempre se describe desde la perspectiva de los personajes, no del espectador.'
      ]
    },
    {
      code: 'fr-FR',
      name: 'French',
      messages: [
        'Annie est assise à la gauche de Vinnie.',
        'La direction gauche et droite est du point de vue de Vinnie, pas du vôtre.',
        'Du point de vue de Vinnie, Annie est à sa gauche. Observez la position d\'Annie.',
        'L\'arrangement des sièges est toujours décrit du point de vue des personnages, pas du spectateur.'
      ]
    },
    {
      code: 'de-DE',
      name: 'German',
      messages: [
        'Annie sitzt links von Vinnie.',
        'Die Richtung links und rechts ist aus Vinnies Sicht, nicht aus Ihrer.',
        'Aus Vinnies Sicht ist Annie auf seiner linken Seite. Beachten Sie Annies Position.',
        'Die Sitzordnung wird immer aus der Sicht der Charaktere beschrieben, nicht aus der Sicht des Betrachters.'
      ]
    },
    {
      code: 'it-IT',
      name: 'Italian',
      messages: [
        'Annie è seduta alla sinistra di Vinnie.',
        'La direzione sinistra e destra è dalla prospettiva di Vinnie, non tua.',
        'Dal punto di vista di Vinnie, Annie è alla sua sinistra. Osserva la posizione di Annie.',
        'La disposizione dei posti è sempre descritta dalla prospettiva dei personaggi, non dello spettatore.'
      ]
    },
    {
      code: 'pt-BR',
      name: 'Portuguese',
      messages: [
        'Annie está sentada à esquerda de Vinnie.',
        'A direção esquerda e direita é da perspectiva de Vinnie, não sua.',
        'Do ponto de vista de Vinnie, Annie está à sua esquerda. Observe a posição de Annie.',
        'O arranjo dos assentos é sempre descrito da perspectiva dos personagens, não do espectador.'
      ]
    },
    {
      code: 'ru-RU',
      name: 'Russian',
      messages: [
        'Энни сидит слева от Винни.',
        'Направление влево и вправо с точки зрения Винни, а не вашей.',
        'С точки зрения Винни, Энни находится слева от него. Обратите внимание на положение Энни.',
        'Расположение мест всегда описывается с точки зрения персонажей, а не зрителя.'
      ]
    },
    {
      code: 'ja-JP',
      name: 'Japanese',
      messages: [
        'アニーはビニーの左に座っています。',
        '左右の方向は、あなたの視点ではなく、ビニーの視点からです。',
        'ビニーの視点から見ると、アニーは彼の左側にいます。アニーの位置に注目してください。',
        '座席配置は常にキャラクターの視点から説明され、視聴者の視点からではありません。'
      ]
    },
    {
      code: 'ko-KR',
      name: 'Korean',
      messages: [
        '애니는 비니의 왼쪽에 앉아 있습니다.',
        '좌우 방향은 당신의 관점이 아닌 비니의 관점입니다.',
        '비니의 관점에서 보면 애니는 그의 왼쪽에 있습니다. 애니의 위치를 관찰하세요.',
        '좌석 배치는 항상 캐릭터의 관점에서 설명되며, 관찰자의 관점에서가 아닙니다.'
      ]
    },
    {
      code: 'zh-CN',
      name: 'Chinese',
      messages: [
        '安妮坐在维尼的左边。',
        '左右方向是从维尼的角度，而不是你的角度。',
        '从维尼的角度看，安妮在他的左边。观察安妮的位置。',
        '座位安排总是从角色的角度描述，而不是观众的角度。'
      ]
    },
    {
      code: 'hi-IN',
      name: 'Hindi',
      messages: [
        'एनी विनी के बाईं ओर बैठी है।',
        'बाएं और दाएं की दिशा विनी के नजरिए से है, आपके नजरिए से नहीं।',
        'विनी के नजरिए से, एनी उसके बाईं ओर है। एनी की स्थिति का अवलोकन करें।',
        'बैठने की व्यवस्था हमेशा पात्रों के नजरिए से बताई जाती है, दर्शक के नजरिए से नहीं।'
      ]
    },
    {
      code: 'ar-SA',
      name: 'Arabic',
      messages: [
        'آني تجلس على يسار فيني.',
        'اتجاه اليسار واليمين من منظور فيني، وليس منظورك.',
        'من وجهة نظر فيني، آني على يساره. لاحظ موقع آني.',
        'ترتيب الجلوس يوصف دائماً من منظور الشخصيات، وليس من منظور المشاهد.'
      ]
    },
  ];

  // Annie's image component
  const AnnieImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img
        src="/src/LogicalReasoning/LinearArrangement/Images/Annie.png"
        alt="Annie"
        className="w-full h-full object-cover"
      />
    </div>
  );

  // Vinnie's image component
  const VinnieImage = () => (
    <div className="w-28 h-36 md:w-48 md:h-64 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img
        src="/src/LogicalReasoning/LinearArrangement/Images/Vinnie.png"
        alt="Vinnie"
        className="w-full h-full object-cover"
      />
    </div>
  );

  // Character Component
  type CharacterComponentProps = {
    name: string;
    ImageComponent: React.ComponentType;
    colorTheme: string;
    isHighlighted?: boolean;
  };

  const CharacterComponent: React.FC<CharacterComponentProps> = ({ name, ImageComponent, colorTheme, isHighlighted = false }) => (
    <div className={`flex flex-col items-center transition-all duration-300 ${isHighlighted ? 'scale-105' : ''}`}>
      <div className={`transition-all duration-300 ${isHighlighted ? 'ring-4 ring-yellow-400 dark:ring-yellow-500 ring-offset-2 dark:ring-offset-gray-800 rounded-2xl' : ''}`}>
        <ImageComponent />
      </div>
      <h3 className={`text-lg md:text-2xl font-bold mt-2 md:mt-4 ${colorTheme} ${isHighlighted ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>{name}</h3>
    </div>
  );

  // Direction Arrow Component
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
      <div className={`flex flex-col items-center ${baseOpacity} ${animationClass}`}>
        <ArrowIcon size={16} className={`md:w-8 md:h-8 ${color} mb-1 md:mb-2`} />
        {label && <div className={`text-xs md:text-xs font-semibold ${color}`}>{label}</div>}
      </div>
    );
  };

  // Function to get the current message text
  const getCurrentMessageText = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    if (lang && lang.messages.length > currentMessageIndex) {
      return lang.messages[currentMessageIndex];
    }
    return languages[0].messages[0];
  };

  // Function to get the current language name
  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Function to calculate total sequence duration
  const calculateTotalSequenceDuration = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    const messages = lang ? lang.messages : languages[0].messages;
    
    let totalDuration = 0;
    messages.forEach((message, index) => {
      const messageDuration = message.length * 0.08; // 80ms per character
      totalDuration += messageDuration;
      if (index < messages.length - 1) {
        totalDuration += 1.5; // 1.5 second pause between messages
      }
    });
    
    return totalDuration;
  };

  // Function to clear the progress bar interval
  const clearProgressBar = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Function to start the progress bar for the entire sequence
  const startSequenceProgressBar = () => {
    clearProgressBar();
    setSpeechProgress(0);
    setElapsedTime(0);
    
    const totalDuration = calculateTotalSequenceDuration();
    setTotalSequenceDuration(totalDuration);
    sequenceStartTimeRef.current = Date.now();
    
    const intervalTime = 100; // Update every 100ms
    
    progressIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      if (sequenceStartTimeRef.current !== null) {
        const elapsed = (currentTime - sequenceStartTimeRef.current) / 1000; // Convert to seconds
        setElapsedTime(elapsed);

        const progress = Math.min((elapsed / totalDuration) * 100, 100);
        setSpeechProgress(progress);

        if (progress >= 100) {
          clearProgressBar();
        }
      }
    }, intervalTime);
  };

  // Function to pause the progress bar
  const pauseSequenceProgressBar = () => {
    clearProgressBar();
    // Keep the current progress and elapsed time
  };

  // Function to resume the progress bar
  const resumeSequenceProgressBar = () => {
    if (totalSequenceDuration === 0) return;
    
    clearProgressBar();
    const remainingDuration = totalSequenceDuration - elapsedTime;
    
    if (remainingDuration > 0) {
      sequenceStartTimeRef.current = Date.now() - (elapsedTime * 1000);
      
      const intervalTime = 100;
      progressIntervalRef.current = setInterval(() => {
        const currentTime = Date.now();
        if (sequenceStartTimeRef.current !== null) {
          const elapsed = (currentTime - sequenceStartTimeRef.current) / 1000;
          setElapsedTime(elapsed);

          const progress = Math.min((elapsed / totalSequenceDuration) * 100, 100);
          setSpeechProgress(progress);

          if (progress >= 100) {
            clearProgressBar();
          }
        }
      }, intervalTime);
    }
  };

  // Function to play or resume the voice message sequence
  const playVoiceMessage = () => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }

    if (isPaused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      resumeSequenceProgressBar();
      return;
    }

    // Start new sequence
    window.speechSynthesis.cancel();
    clearProgressBar();
    setIsPlaying(false);
    setIsPaused(false);
    utteranceRef.current = null;
    setCurrentMessageIndex(0);
    setSpeechProgress(0);
    setElapsedTime(0);

    setTimeout(() => {
      startSequenceProgressBar(); // Start the single progress bar for entire sequence
      speakCurrentMessage(0);
    }, 100);
  };

  // Function to speak a specific message in the sequence
  const speakCurrentMessage = (indexToSpeak: number) => {
    const lang = languages.find(l => l.code === currentLanguage);
    const messages = lang ? lang.messages : languages[0].messages;

    if (indexToSpeak >= messages.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentMessageIndex(0);
      utteranceRef.current = null;
      clearProgressBar(); // Clear progress bar when sequence ends
      setSpeechProgress(100); // Set to 100% and then clear
      setTimeout(() => setSpeechProgress(0), 500); // Reset after brief display
      return;
    }

    const messageText = messages[indexToSpeak];
    setCurrentMessageIndex(indexToSpeak);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(messageText);
      utterance.lang = currentLanguage;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        const nextIndex = indexToSpeak + 1;
        const totalMessages = messages.length;
        
        if (nextIndex >= totalMessages) {
          // This was the last message
          setIsPlaying(false);
          setIsPaused(false);
          clearProgressBar();
          setSpeechProgress(100); // Show completion
          setTimeout(() => setSpeechProgress(0), 500); // Reset after brief display
          return;
        }
        
        setIsPlaying(false);
        setIsPaused(false);

        messageTimeoutRef.current = setTimeout(() => {
          speakCurrentMessage(nextIndex);
        }, 1500);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsPlaying(false);
        setIsPaused(false);
        utteranceRef.current = null;
        
        if (event.error === 'interrupted') {
          const nextIndex = indexToSpeak + 1;
          const totalMessages = languages.find(l => l.code === currentLanguage)?.messages.length || 0;
          if (nextIndex < totalMessages) {
            messageTimeoutRef.current = setTimeout(() => {
              speakCurrentMessage(nextIndex);
            }, 500);
          } else {
            setCurrentMessageIndex(0);
            clearProgressBar();
            setSpeechProgress(0);
          }
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Function to pause the voice message
  const pauseVoiceMessage = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      pauseSequenceProgressBar();
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = null;
      }
    }
  };

  // Handler for language change
  const handleLanguageChange = (langCode: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    clearProgressBar();
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
      messageTimeoutRef.current = null;
    }
    setCurrentLanguage(langCode);
    setCurrentMessageIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setIsDropdownOpen(false);
    setSpeechProgress(0);
    setElapsedTime(0);
    setTotalSequenceDuration(0);
    utteranceRef.current = null;
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearProgressBar();
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
        messageTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, []);

  // Determine if Annie should be highlighted
  const isAnnieHighlighted = currentMessageIndex === 2;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-inter">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-100">
          Seating Arrangement
        </h1>

        {/* Language Selection Dropdown */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-32 md:min-w-40 text-sm md:text-base shadow-sm"
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

        {/* Voice Control Buttons */}
        <div className="flex justify-center mb-6 md:mb-8">
          <button
            onClick={isPlaying ? pauseVoiceMessage : playVoiceMessage}
            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
          >
            {isPlaying ? <Pause size={18} className="md:w-5 md:h-5" /> : <Play size={18} className="md:w-5 md:h-5" />}
            {isPlaying ? 'Pause Voice' : isPaused ? 'Resume Voice' : 'Play Voice'}
          </button>
        </div>

        {/* Speech Progress Bar - Single bar for entire sequence */}
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-6 md:mb-8 overflow-hidden">
          <div
            className="bg-blue-500 dark:bg-blue-400 h-2.5 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${speechProgress}%` }}
          ></div>
        </div>

        {/* Seating Arrangement Visualization Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 md:p-8">
          <div className="flex justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-4 md:gap-16 w-full">

              {/* Annie Character Component - on the left, as she is to Vinnie's left */}
              <CharacterComponent
                name="Annie"
                ImageComponent={AnnieImage}
                colorTheme="text-pink-600 dark:text-pink-400"
                isHighlighted={isAnnieHighlighted}
              />

              {/* Direction Arrow pointing left, labeled "Vinnie's Left" and active */}
              <DirectionArrow
                direction="left"
                color="text-blue-500 dark:text-blue-400"
                label="Vinnie's Left"
                isActive={true}
              />

              {/* Vinnie Character Component - on the right, as Annie is to his left */}
              <CharacterComponent
                name="Vinnie"
                ImageComponent={VinnieImage}
                colorTheme="text-blue-600 dark:text-blue-400"
              />

              {/* Direction Arrow pointing right, labeled "Vinnie's Right" and inactive */}
              <DirectionArrow
                direction="right"
                color="text-gray-400 dark:text-gray-500"
                label="Vinnie's Right"
                isActive={false}
              />
            </div>
          </div>
        </div>

        {/* Current Spoken Message Display */}
        <div className="mt-6 md:mt-8 text-center px-4 min-h-[4rem]">
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 italic break-words">
            "{getCurrentMessageText()}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementLeftReferenceModule;