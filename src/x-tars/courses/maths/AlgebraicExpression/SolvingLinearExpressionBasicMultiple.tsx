import React, { useState, useCallback, useEffect } from 'react';

const translations = {
  en: {
    title: "⚖️ Solving Linear Equations ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    start: "Start",
    reset: "🔄 Reset",
    welcome: "Let's learn how to solve a linear equation using a balance scale.",
    step1: "Here we have a balanced scale. On the left, we have two apples. On the right, we have a 6 gram weight. The scale is perfectly balanced, meaning both sides are equal.",
    step2: "We can express this relationship as an equation. The weight of two apples is equal to 6 grams.",
    step3: "Now let's represent the unknown weight of a single apple with the variable 'X'.",
    step4: "A number multiplied by a variable is called a coefficient. The expression '2 multiplied by X' can be written as 2X.",
    step5_intro: "Our goal is to find the weight of a single apple, which means we need to get X by itself. We need to turn the '2' in front of X into a '1'. What operation should we perform on both sides to do this?",
    step5_question: "To change the '2' into a '1', we should:",
    step6_correct: "🎉 Correct! To make 2 into 1, we must divide by 2. Because a scale stays balanced only if you do the same thing to both sides, we also divide the right side by 2.",
    step6_incorrect: "❌ Incorrect. Dividing by 2 is the correct operation to make the coefficient 1. Let's see how that works.",
    step7_equation: "Now we perform the division. By dividing the left side, 2X, by 2, we are left with just X. By dividing the right side, 6, by 2, we get 3.",
    step8_final: "By performing this operation on both sides, the equation becomes X equals 3. This means that the weight of one apple is 3 grams!",
    step9_outro: "You have successfully solved your first linear equation!",
  },
  hi: {
    title: "⚖️ रैखिक समीकरण हल करना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    start: "शुरू करें",
    reset: "🔄 रीसेट करें",
    welcome: "आइए एक संतुलन पैमाने का उपयोग करके रैखिक समीकरण को हल करना सीखें।",
    step1: "यहां हमारे पास एक संतुलित पैमाना है। बाईं ओर, हमारे पास दो सेब हैं। दाईं ओर, हमारे पास 6 ग्राम का एक वजन है। पैमाना पूरी तरह से संतुलित है, जिसका अर्थ है कि दोनों पक्ष बराबर हैं।",
    step2: "हम इस संबंध को एक समीकरण के रूप में व्यक्त कर सकते हैं। दो सेब का वजन 6 ग्राम के बराबर है।",
    step3: "अब आइए एक सेब के अज्ञात वजन को 'X' चर के साथ दर्शाएं।",
    step4: "एक चर से गुणा की गई संख्या को गुणांक कहा जाता है। '2 को X से गुणा' को 2X लिखा जा सकता है।",
    step5_intro: "हमारा लक्ष्य एक सेब का वजन ज्ञात करना है, जिसका अर्थ है कि हमें X को अकेला करना होगा। हमें X के सामने '2' को '1' में बदलना होगा। ऐसा करने के लिए हमें दोनों पक्षों पर क्या संक्रिया करनी चाहिए?",
    step5_question: "'2' को '1' में बदलने के लिए, हमें चाहिए:",
    step6_correct: "🎉 सही! 2 को 1 बनाने के लिए, हमें 2 से भाग देना होगा। क्योंकि एक पैमाना तभी संतुलित रहता है जब आप दोनों पक्षों पर समान संक्रिया करते हैं, हम दाईं ओर को भी 2 से भाग देते हैं।",
    step6_incorrect: "❌ गलत। 2 से भाग देना गुणांक को 1 बनाने के लिए सही संक्रिया है। आइए देखें कि यह कैसे काम करता है।",
    step7_equation: "अब हम भाग की संक्रिया करते हैं। बाईं ओर, 2X, को 2 से भाग देने पर, हमारे पास केवल X बचता है। दाईं ओर, 6, को 2 से भाग देने पर, हमें 3 मिलता है।",
    step8_final: "दोनों पक्षों पर यह संक्रिया करने पर, समीकरण X, 3 के बराबर हो जाता है। इसका मतलब है कि एक सेब का वजन 3 ग्राम है!",
    step9_outro: "आपने सफलतापूर्वक अपना पहला रैखिक समीकरण हल कर लिया है!",
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [step, setStep] = useState(0); // 0: initial, 1-9: steps
  const [userInteraction, setUserInteraction] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);
  const [highlightCoefficient, setHighlightCoefficient] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  const t = useCallback((key, ...args) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'function') {
      return translation(...args);
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key, ...args) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();
    return new Promise((resolve) => {
      const textToSpeak = t(key, ...args);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.cancel();
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, [currentLanguage, userInteraction, audioEnabled, t]);

  const handleStart = async () => {
    setUserInteraction(true);
    setStep(1);
  };

  const handleNext = async () => {
    setStep(step + 1);
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setStep(0);
    setSelectedOperation(null);
    setIsSubmitted(false);
    setIsCorrect(null);
    setHighlightLeft(false);
    setHighlightRight(false);
    setHighlightCoefficient(false);
    setShowEquation(false);
  };

  useEffect(() => {
    const handleStepActions = async () => {
      speechSynthesis.cancel();
      setHighlightLeft(false);
      setHighlightRight(false);
      setHighlightCoefficient(false);
      switch (step) {
        case 1:
          await speakMessage('step1');
          break;
        case 2:
          setShowEquation(true);
          await speakMessage('step2');
          break;
        case 3:
          await speakMessage('step3');
          break;
        case 4:
          await speakMessage('step4');
          setHighlightCoefficient(true);
          break;
        case 5:
          setHighlightCoefficient(true);
          await speakMessage('step5_intro');
          break;
        case 6:
          setHighlightCoefficient(false);
          if (isCorrect) {
            await speakMessage('step6_correct');
            setHighlightLeft(true);
            setHighlightRight(true);
          } else {
            await speakMessage('step6_incorrect');
          }
          break;
        case 7:
          await speakMessage('step7_equation');
          break;
        case 8:
          await speakMessage('step8_final');
          break;
        case 9:
          await speakMessage('step9_outro');
          break;
        default:
          break;
      }
    };
    if (userInteraction) {
      handleStepActions();
    }
  }, [step, userInteraction, speakMessage, isCorrect]);

  const handleSelectOperation = (op) => {
    setSelectedOperation(op);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOperation === '/') {
      setIsCorrect(true);
      setStep(6);
    } else {
      setIsCorrect(false);
      setStep(6);
    }
  };

  const getEquation = () => {
    switch (step) {
      case 2:
        return (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span className="text-xl sm:text-2xl font-bold">2 * Weight of one apple</span>
            <span className="text-2xl sm:text-3xl font-extrabold">=</span>
            <span className="text-xl sm:text-2xl font-bold">6 gm</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span className="text-xl sm:text-2xl font-bold">2 * X</span>
            <span className="text-2xl sm:text-3xl font-extrabold">=</span>
            <span className="text-xl sm:text-2xl font-bold">6</span>
          </div>
        );
      case 4:
      case 5:
        return (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span className={`text-3xl sm:text-5xl font-extrabold transition-all duration-300 ${highlightCoefficient ? 'text-yellow-400 animate-pulse' : ''}`}>2X</span>
            <span className="text-3xl sm:text-5xl font-extrabold">=</span>
            <span className="text-3xl sm:text-5xl font-extrabold">6</span>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <span className={`text-3xl sm:text-5xl font-extrabold relative transition-all duration-300 ${highlightLeft ? 'text-yellow-400' : ''}`}>
                2X<span className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 text-sm sm:text-base font-medium">/ 2</span>
              </span>
              <span className="text-3xl sm:text-5xl font-extrabold">=</span>
              <span className={`text-3xl sm:text-5xl font-extrabold relative transition-all duration-300 ${highlightRight ? 'text-yellow-400' : ''}`}>
                6<span className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 text-sm sm:text-base font-medium">/ 2</span>
              </span>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              <span className="text-3xl sm:text-5xl font-extrabold">
                <span className="line-through">2</span>X/<span className="line-through">2</span>
              </span>
              <span className="text-3xl sm:text-5xl font-extrabold">=</span>
              <span className="text-3xl sm:text-5xl font-extrabold">
                <span className="line-through">6</span>/<span className="line-through">2</span>
              </span>
            </div>
            <div className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
              X = 3
            </div>
          </div>
        );
      case 8:
      case 9:
        return (
          <div className="flex items-center justify-center space-x-2 sm:space-x-4">
            <span className="text-3xl sm:text-5xl font-extrabold">X</span>
            <span className="text-3xl sm:text-5xl font-extrabold">=</span>
            <span className="text-3xl sm:text-5xl font-extrabold">3</span>
          </div>
        );
      default:
        return null;
    }
  };

  const operationOptions = ['+', '-', '*', '/'];

  const highlightClasses = (isLeft) => {
    if (isLeft && highlightLeft) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    if (!isLeft && highlightRight) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    return '';
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
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
      <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight text-center px-2 transition-colors duration-300 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        {t('title')}
      </h2>

      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
        <div className="relative w-full h-48 sm:h-64 flex items-end justify-center">
          {/* Base */}
          <div className={`absolute bottom-0 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
          {/* Support */}
          <div className={`absolute bottom-4 sm:bottom-8 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
          {/* Fulcrum */}
          <div className={`absolute bottom-20 sm:bottom-32 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}></div>
          {/* Beam */}
          <div className={`absolute bottom-22 sm:bottom-36 w-full max-w-xs sm:max-w-lg h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}></div>
          {/* Pans */}
          <div className="absolute bottom-6 sm:bottom-16 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
            {/* Left Pan */}
            <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}>
              <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <span role="img" aria-label="apple" className="text-3xl sm:text-5xl">🍏</span>
                  <span role="img" aria-label="apple" className="text-3xl sm:text-5xl">🍏</span>
                </div>
              </div>
            </div>
            {/* Right Pan */}
            <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
              <div className="flex flex-col items-center justify-center">
                <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>6 gm</span>
              </div>
            </div>
          </div>
        </div>

        {showEquation && (
          <div className={`my-4 sm:my-8 text-center transition-all duration-500 ease-in-out font-mono ${step >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            {getEquation()}
          </div>
        )}

        <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
          <p className={`text-center text-sm sm:text-base mb-4 sm:mb-6 transition-all duration-300 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            {step === 0 && t('welcome')}
            {step === 1 && t('step1')}
            {step === 2 && t('step2')}
            {step === 3 && t('step3')}
            {step === 4 && t('step4')}
            {step === 5 && t('step5_intro')}
            {step === 6 && (isCorrect ? t('step6_correct') : t('step6_incorrect'))}
            {step === 7 && t('step7_equation')}
            {step === 8 && t('step8_final')}
            {step === 9 && t('step9_outro')}
          </p>

          {step === 0 && (
            <button
              onClick={handleStart}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('start')}
            </button>
          )}

          {step >= 1 && step <= 4 && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              Next
            </button>
          )}

          {step === 5 && (
            <>
              <p className="text-center text-sm sm:text-base mb-4 font-semibold">{t('step5_question')}</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {operationOptions.map(op => (
                  <button
                    key={op}
                    onClick={() => handleSelectOperation(op)}
                    className={`px-4 py-2 rounded-lg font-bold text-base transition-colors duration-200 ${
                      selectedOperation === op ? (op === '/' ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : (theme === 'light' ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-700 text-white hover:bg-indigo-600')
                    }`}
                  >
                    {op}2
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!selectedOperation || isSubmitted}
                className={`w-full px-6 py-3 font-bold rounded-lg shadow-lg transition-transform transform active:scale-95 text-lg ${
                  !selectedOperation || isSubmitted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {t('submit')}
              </button>
            </>
          )}

          {(step === 6 || step === 7) && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              Next
            </button>
          )}

          {step === 8 && (
            <button
              onClick={handleNext}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              Next
            </button>
          )}
          
          {step === 9 && (
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;