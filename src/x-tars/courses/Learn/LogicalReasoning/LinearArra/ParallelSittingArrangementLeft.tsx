import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, Volume2, VolumeX, Sun, Moon } from 'lucide-react';
import ParallelLeft from './Images/ParallelLeft.png';

const translations = {
  'en': {
    title: "Parallel Seating Arrangement",
    subtitle: "Observe how 'left' and 'right' change depending on which direction you are facing.",
    message: "In the first row, Vinnie is to the left of Annie and Ninnie is to the left of both Annie and Vinnie. In the second row, Minnie is to the left of both Binny and Sunny and Binny is to the left of Sunny. Always imagine yourself in the person's place to better understand their left.",
    play: "Play Voice",
    pause: "Pause Voice",
    resume: "Resume Voice",
    language: "Language",
    lightTheme: "Light Theme",
    darkTheme: "Dark Theme",
  },
  'hi': {
    title: "समानांतर बैठने की व्यवस्था",
    subtitle: "देखें कि आप किस दिशा में देख रहे हैं, उसके आधार पर 'बाएं' और 'दाएं' कैसे बदलते हैं।",
    message: "पहली पंक्ति में, विन्नी एनी के बाईं ओर है और निन्नी एनी और विन्नी दोनों के बाईं ओर है। दूसरी पंक्ति में, मिन्नी बिन्नी और सन्नी दोनों के बाईं ओर है और बिन्नी सन्नी के बाईं ओर है। अपने बाएं को बेहतर ढंग से समझने के लिए हमेशा खुद को उस व्यक्ति की जगह पर रखकर सोचें।",
    play: "आवाज चलाएं",
    pause: "आवाज रोकें",
    resume: "आवाज फिर से शुरू करें",
    language: "भाषा",
    lightTheme: "हल्की थीम",
    darkTheme: "गहरी थीम",
  },
};

const StaticParallelSeatingRight = () => {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [theme, setTheme] = useState('light');
    const utteranceRef = useRef(null);

    const t = translations[currentLanguage];

    // Use useEffect to apply the theme class to the document body
    useEffect(() => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const getPlayIcon = () => {
        if (isPlaying) {
            return <VolumeX size={18} />;
        } else if (isPaused) {
            return <Volume2 size={18} />;
        } else {
            return <Volume2 size={18} />;
        }
    };

    const playVoiceMessage = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const newUtterance = new SpeechSynthesisUtterance(t.message);
            newUtterance.lang = currentLanguage;
            newUtterance.rate = 0.8;
            newUtterance.pitch = 1;
            newUtterance.volume = 1;

            newUtterance.onstart = () => {
                setIsPlaying(true);
                setIsPaused(false);
            };
            newUtterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };
            newUtterance.onerror = () => {
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
            };

            window.speechSynthesis.speak(newUtterance);
            utteranceRef.current = newUtterance;
        }
    };

    const pauseVoiceMessage = () => {
        if ('speechSynthesis' in window && isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
            setIsPaused(true);
        }
    };

    const resumeVoiceMessage = () => {
        if ('speechSynthesis' in window && isPaused) {
            window.speechSynthesis.resume();
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            pauseVoiceMessage();
        } else if (isPaused) {
            resumeVoiceMessage();
        } else {
            playVoiceMessage();
        }
    };

    const handleLanguageChange = (langCode) => {
        setCurrentLanguage(langCode);
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setIsPaused(false);
        setIsDropdownOpen(false);
        utteranceRef.current = null;
    };

    const toggleTheme = () => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className="max-w-4xl w-full mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 md:p-8 transition-colors duration-300 min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">{t.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t.subtitle}</p>

                <div className="flex justify-center items-center gap-4 mb-4 md:mb-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-w-40 text-sm"
                        >
                            <span className="text-gray-700 dark:text-gray-300">{translations[currentLanguage].language}</span>
                            <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                {Object.keys(translations).map((langCode) => (
                                    <button
                                        key={langCode}
                                        onClick={() => handleLanguageChange(langCode)}
                                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm ${
                                            currentLanguage === langCode ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200' : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                    >
                                        {translations[langCode].language}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      title={theme === 'light' ? t.darkTheme : t.lightTheme}
                    >
                      {theme === 'light' ? <Moon size={18} className="text-gray-700" /> : <Sun size={18} className="text-yellow-400" />}
                    </button>
                </div>

                <div className="flex justify-center mb-6 md:mb-8">
                    <button
                        id="play-pause-btn"
                        onClick={handlePlayPause}
                        className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                        {getPlayIcon()}
                        <span>{isPlaying ? t.pause : isPaused ? t.resume : t.play}</span>
                    </button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 md:p-8">
                    <div className="flex flex-col items-center justify-center">
                        <img src={ParallelLeft} alt="Parallel Seating Arrangement" className="w-full h-auto max-w-2xl" />
                    </div>
                </div>

                <div className="mt-6 md:mt-8 text-center px-4">
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 italic break-words">
                        "{t.message}"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StaticParallelSeatingRight;
