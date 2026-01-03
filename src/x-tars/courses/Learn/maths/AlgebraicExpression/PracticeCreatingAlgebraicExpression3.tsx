import React, { useState, useCallback, useEffect } from 'react';

// Using a custom object for translations to better manage different problem types
const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    startPractice: "Start Practice",
    newProblem: "✨ New Problem",
    reset: "🔄 Reset",
    welcomeMessage: "Welcome to the interactive balance scale.",
    questionIntro: () => {
        return `Welcome! Here on the left scale, we have two circles (C) and two triangles (T). On the right scale, we have a rectangle (R) and the number 8. Can you select the correct expression for this?`;
    },
    selectCorrectExpression: "Select the correct algebraic expression:",
    submit: "✅ Submit",
    retry: "🔄 Retry",
    viewExplanation: "🤔 View Explanation",
    correctAnswer: "🎉 Correct! The balance is represented by the equation:",
    incorrectAnswer: "❌ Incorrect. Please try again.",
    explanation_step_1: () => {
        return `On the left scale, we have two circles (2C) and two triangles (2T). This gives us the expression 2C + 2T.`;
    },
    explanation_step_2: () => {
        return `On the right scale, we have a rectangle (R) and the number 8. This gives us the expression R + 8. Since the scale is balanced, we set the left side equal to the right side.`;
    },
    explanation_step_3: () => {
        return `This gives us the final algebraic expression: 2C + 2T = R + 8.`;
    }
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startPractice: "अभ्यास शुरू करें",
    newProblem: "✨ नई समस्या",
    reset: "🔄 रीसेट करें",
    welcomeMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है।",
    questionIntro: () => {
        return `आपका स्वागत है! बाईं ओर के पैमाने पर, हमारे पास दो वृत्त (C) और दो त्रिभुज (T) हैं। दाईं ओर के पैमाने पर, हमारे पास एक आयत (R) और संख्या 8 है। क्या आप इसके लिए सही व्यंजक चुन सकते हैं?`;
    },
    selectCorrectExpression: "सही बीजीय व्यंजक चुनें:",
    submit: "✅ सबमिट करें",
    retry: "🔄 पुनः प्रयास करें",
    viewExplanation: "🤔 स्पष्टीकरण देखें",
    correctAnswer: "🎉 सही! इस संतुलन को इस समीकरण से दर्शाया गया है:",
    incorrectAnswer: "❌ गलत। कृपया पुनः प्रयास करें।",
    explanation_step_1: () => {
        return `बाईं ओर के पैमाने पर, हमारे पास दो वृत्त (2C) और दो त्रिभुज (2T) हैं। इससे हमें 2C + 2T व्यंजक मिलता है।`;
    },
    explanation_step_2: () => {
        return `दाईं ओर के पैमाने पर, हमारे पास एक आयत (R) और संख्या 8 है। इससे हमें R + 8 व्यंजक मिलता है। चूंकि तराजू संतुलित है, हम बाईं ओर को दाईं ओर के बराबर रखते हैं।`;
    },
    explanation_step_3: () => {
        return `इससे हमें अंतिम बीजीय व्यंजक मिलता है: 2C + 2T = R + 8.`;
    }
  }
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('initial');
  const [userInteraction, setUserInteraction] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Dynamic problem state
  const [problem, setProblem] = useState({ type: 'two-circle-two-triangle-one-rectangle-number', data: {} });
  const [practiceOptions, setPracticeOptions] = useState([]);

  // Memoize translation function
  const t = useCallback((key) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'function') {
      return translation();
    }
    return translation;
  }, [currentLanguage]);

  // Handle TTS
  const speakMessage = useCallback(async (key) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();

    return new Promise((resolve) => {
      const textToSpeak = t(key);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        speechSynthesis.cancel();
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, [currentLanguage, userInteraction, audioEnabled, t]);

  // Function to generate a new problem
  const generateNewProblem = useCallback(() => {
    const newProblem = { type: 'two-circle-two-triangle-one-rectangle-number', data: {} };
    const correctExpression = '2C + 2T = R + 8';
    
    setProblem(newProblem);

    // Generate options based on the correct expression
    const options = [];
    options.push({ id: 'correct', value: correctExpression, isCorrect: true });

    // Generate incorrect options
    options.push({ id: 'inc1', value: '2C + 2T + R = 8', isCorrect: false });
    options.push({ id: 'inc2', value: '2C + 2T = 8', isCorrect: false });
    options.push({ id: 'inc3', value: 'C + T = R + 8', isCorrect: false });
    

    // Shuffle options to randomize the correct answer's position
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setPracticeOptions(options);
  }, []);

  const handleStartPractice = async () => {
    setUserInteraction(true);
    setMode('practice');
    generateNewProblem();
  };

  useEffect(() => {
    if (mode === 'practice' && practiceOptions.length > 0) {
      speakMessage('questionIntro');
    }
  }, [mode, practiceOptions, speakMessage]);

  const handleNewProblem = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setHighlightLeft(false);
    setHighlightRight(false);
    generateNewProblem();
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setMode('initial');
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setHighlightLeft(false);
    setHighlightRight(false);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option.id);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const correctOption = practiceOptions.find(opt => opt.isCorrect);
    if (selectedOption === correctOption.id) {
      setIsCorrect(true);
      speakMessage('correctAnswer');
    } else {
      setIsCorrect(false);
      speakMessage('incorrectAnswer');
    }
  };

  const handleRetry = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const startExplanationSequence = async () => {
    setShowExplanation(true);
    setHighlightLeft(true);
    setHighlightRight(false);
    await speakMessage('explanation_step_1');
    setHighlightLeft(false);
    setHighlightRight(true);
    await speakMessage('explanation_step_2');
    setHighlightLeft(false);
    setHighlightRight(false);
    await speakMessage('explanation_step_3');
  };

  const highlightClasses = (isLeft) => {
    if (isLeft && highlightLeft) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    if (!isLeft && highlightRight) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    return '';
  };

  const renderLeftPanContent = () => {
    // Hardcoded to render 2C and 2T for this specific problem type
    const circles = Array.from({ length: 2 }, (_, i) => (
      <div key={`circle-${i}`} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
        C
      </div>
    ));
    const triangles = Array.from({ length: 2 }, (_, i) => (
      <svg key={`triangle-${i}`} className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,10 90,90 10,90" fill="#f87171" stroke="#ef4444" strokeWidth="5" />
        <text x="50" y="65" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">T</text>
      </svg>
    ));
    return (
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
          {circles}
        </div>
        <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
          {triangles}
        </div>
      </div>
    );
  };

  const renderRightPanContent = () => {
    // Hardcoded to render 1R and 8 for this specific problem type
    return (
      <div className="flex flex-row items-center justify-center gap-4 sm:gap-6">
        <svg className="w-8 h-6 sm:w-10 sm:h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="20" width="80" height="60" rx="10" ry="10" fill="#60a5fa" stroke="#3b82f6" strokeWidth="5" />
          <text x="50" y="55" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">R</text>
        </svg>
        <div className="w-6 h-4 sm:w-8 sm:h-6 rounded-sm bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg mt-1 sm:mt-2">
          8
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
      {/* Controls */}
      <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 flex-1">
            <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
              {t('selectLanguage')}:
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
                handleReset();
              }}
              className={`p-2 border rounded-md flex-1 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base flex-1 sm:flex-none ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
            >
              {t('changeTheme')}
            </button>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
            >
              🔊 {audioEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
      <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight transition-colors duration-300 text-center px-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        {t('scaleTitle')}
      </h2>
      {mode === 'initial' ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className="text-lg sm:text-2xl font-semibold px-2">{t('welcomeMessage')}</p>
          <button
             onClick={handleStartPractice}
             className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
          >
            {t('startPractice')}
          </button>
        </div>
      ) : (
        <>
          {/* Balance Scale */}
          <div className="relative w-full max-w-xs sm:max-w-2xl h-60 sm:h-80 flex items-center justify-center mb-4 sm:mb-8">
            {/* Base */}
            <div className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>

            {/* Support */}
            <div className={`absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>

            {/* Fulcrum */}
            <div className={`absolute bottom-22 sm:bottom-40 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
              <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
            </div>

            {/* Beam */}
            <div className={`absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}>
              <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
            </div>
            {/* Chains */}
            <div className="absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`left-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`right-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
            </div>
            {/* Pans */}
            <div className="absolute bottom-12 sm:bottom-28 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
              {/* Left Pan */}
              <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}>
                <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
                {renderLeftPanContent()}
              </div>
              {/* Right Pan */}
              <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
                <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
                {renderRightPanContent()}
              </div>
            </div>
            {/* Balance indicator */}
            <div className={`absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'}`}>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-sm sm:text-lg">✅</span>
                <span className="font-bold text-xs sm:text-base">BALANCED!</span>
              </div>
            </div>
          </div>

          {/* Practice Interface */}
          <div className="flex flex-col items-center w-full max-w-sm sm:max-w-lg px-2">
            <p className={`text-lg sm:text-2xl font-semibold mb-4 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
              {t('selectCorrectExpression')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              {practiceOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  disabled={isSubmitted && isCorrect !== false}
                  className={`
                    py-3 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200
                    ${selectedOption === option.id ? 'ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 ring-blue-500' : 'hover:bg-opacity-80'}
                    ${theme === 'light' ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-700 text-white hover:bg-indigo-600'}
                    ${isSubmitted && isCorrect === true && option.isCorrect && 'bg-green-500 text-white'}
                    ${isSubmitted && isCorrect === false && selectedOption === option.id && 'bg-red-500 text-white'}
                  `}
                >
                  {option.value}
                </button>
              ))}
            </div>

            {selectedOption && (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full sm:w-auto">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitted}
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-lg shadow-lg transition-transform transform active:scale-95 text-base sm:text-lg flex-1 sm:flex-none ${
                    isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
                  }`}
                >
                  {t('submit')}
                </button>
                <button
                  onClick={handleRetry}
                  className={`px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 text-base sm:text-lg flex-1 sm:flex-none ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
                >
                  {t('retry')}
                </button>
              </div>
            )}
            {isCorrect !== null && (
              <div className={`mt-6 text-center text-lg sm:text-xl font-bold p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <p>{isCorrect ? t('correctAnswer') : t('incorrectAnswer')}</p>
                {isCorrect && (
                  <p className="mt-2 text-base sm:text-lg font-mono bg-white p-2 rounded border-2 border-green-300 text-green-800">
                    {practiceOptions.find(opt => opt.isCorrect)?.value}
                  </p>
                )}
                <button
                   onClick={startExplanationSequence}
                   className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base sm:text-lg"
                >
                  {t('viewExplanation')}
                </button>
                {isCorrect && (
                  <button
                    onClick={handleNewProblem}
                    className={`mt-4 ml-2 px-4 py-2 font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 text-base sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
                  >
                    {t('newProblem')}
                  </button>
                )}
              </div>
            )}

            {showExplanation && (
              <div className={`mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-xs sm:max-w-2xl ${theme === 'light' ? 'bg-white text-gray-800 border border-gray-200' : 'bg-gray-800 text-white border border-gray-700'}`}>
                <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-center">{t('viewExplanation')}</h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className={`p-2 sm:p-3 rounded-lg ${theme === 'light' ? 'bg-indigo-50 border-l-4 border-indigo-400' : 'bg-indigo-900 border-l-4 border-indigo-400'}`}>
                    <p className="font-semibold text-indigo-600 mb-2 text-sm sm:text-base">Step 1: Left Scale Analysis</p>
                    <p className="text-sm sm:text-base">{t('explanation_step_1')}</p>
                  </div>

                  <div className={`p-2 sm:p-3 rounded-lg ${theme === 'light' ? 'bg-purple-50 border-l-4 border-purple-400' : 'bg-purple-900 border-l-4 border-purple-400'}`}>
                    <p className="font-semibold text-purple-600 mb-2 text-sm sm:text-base">Step 2: Right Scale Analysis</p>
                    <p className="text-sm sm:text-base">{t('explanation_step_2')}</p>
                  </div>

                  <div className={`p-2 sm:p-3 rounded-lg ${theme === 'light' ? 'bg-green-50 border-l-4 border-green-400' : 'bg-green-900 border-l-4 border-green-400'}`}>
                    <p className="font-semibold text-green-600 mb-2 text-sm sm:text-base">Step 3: Final Expression</p>
                    <p className="text-sm sm:text-base">{t('explanation_step_3')}</p>
                    <div className="mt-2 sm:mt-3 text-center">
                      <div className="inline-block bg-white p-2 sm:p-3 rounded-lg border-2 border-green-400 font-mono text-base sm:text-lg font-bold text-green-800">
                        {practiceOptions.find(opt => opt.isCorrect)?.value}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleReset}
            className={`mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none text-base sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
          >
            {t('reset')}
          </button>
        </>
      )}
    </div>
  );
};

export default App;