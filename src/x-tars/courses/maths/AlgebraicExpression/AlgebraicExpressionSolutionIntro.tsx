import React, { useState, useCallback, useEffect } from 'react';

const translations = {
  en: {
    title: "⚖️ The Balanced Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    start: "Start",
    reset: "🔄 Reset",
    welcome: {
      text: "Let's begin by learning the most important rule of a balanced scale, which applies to equations as well.",
      voice: "Let's begin by learning the most important rule of a balanced scale.",
    },
    balance_intro: {
      text: "A balanced scale shows that both sides are equal. On the left, we have a 3 gram weight, and on the right, we have a 3 gram weight.",
      voice: "A balanced scale shows that both sides are equal. The scale is perfectly balanced.",
    },
    interactive_intro_balanced: {
      text: "Let's begin by demonstrating how an action affects both sides of a balanced scale. Please choose an operation and a value, and apply it to both the Left and Right scales.",
      voice: "Please choose an operation and a value, and apply it to both the Left and Right scales.",
    },
    interactive_intro_unbalanced: {
      text: "Now, let's explore what happens when you perform different actions. Try a different operation or value on each side and observe the scale.",
      voice: "Now, let's explore what happens when you perform different actions. Try a different operation on each side.",
    },
    balanced_feedback: {
      text: "Excellent! The scale is still perfectly balanced! Try performing the same action again on both scales.",
      voice: "The scale is balanced! Try it again.",
    },
    unbalanced_feedback: {
      text: "The scale is no longer balanced!",
      voice: "The scale is no longer balanced!",
    },
    same_action_explanation: {
      text: "As we can see, performing the same action on both sides did not create any tilt and kept the scale balanced. This is because both sides were treated equally. Remember this, as it will be helpful in solving equations. In the future, when we perform one action on one side, it needs to be performed on the other side as well.",
      voice: "Performing the same action on both sides keeps the scale balanced. This will be helpful in solving equations.",
    },
    unbalanced_explanation: {
      text: "The scale is tilted! This is because we performed a different action on each side. As we aim to make it balanced, we always perform the same operation on both sides.",
      voice: "The scale is tilted! This is because we performed a different action on each side. Remember to always perform the same operation on both sides to keep the scale balanced.",
    },
    goBack: "Go to Original Position",
    
    // UI labels
    applyOperation: "Apply",
    enterValue: "Enter value",
    value: "Value:",
    equals: "=",
    chooseOperation: "Choose an operation:",
    leftScale: "Left Scale",
    rightScale: "Right Scale",
  },
  hi: {
    title: "⚖️ संतुलित पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    start: "शुरू करें",
    reset: "🔄 रीसेट करें",
    welcome: {
      text: "आइए एक संतुलित पैमाने के सबसे महत्वपूर्ण नियम को सीखकर शुरू करें, जो समीकरणों पर भी लागू होता है।",
      voice: "आइए एक संतुलित पैमाने के सबसे महत्वपूर्ण नियम को सीखकर शुरू करें।",
    },
    balance_intro: {
      text: "एक संतुलित पैमाना दिखाता है कि दोनों पक्ष बराबर हैं। बाईं ओर, हमारे पास एक 3 ग्राम का वजन है, और दाईं ओर, हमारे पास 3 ग्राम का वजन है।",
      voice: "एक संतुलित पैमाना दिखाता है कि दोनों पक्ष बराबर हैं। पैमाना पूरी तरह से संतुलित है।",
    },
    interactive_intro_balanced: {
      text: "आइए एक संतुलित पैमाने के दोनों पक्षों पर एक क्रिया कैसे प्रभावित करती है, यह प्रदर्शित करके शुरू करें। कृपया एक संक्रिया और एक मान चुनें, और इसे बाएं और दाएं दोनों पैमानों पर लागू करें।",
      voice: "कृपया एक संक्रिया और एक मान चुनें, और इसे बाएं और दाएं दोनों पैमानों पर लागू करें।",
    },
    interactive_intro_unbalanced: {
      text: "अब, आइए जानें कि जब आप अलग-अलग क्रियाएं करते हैं तो क्या होता है। प्रत्येक पक्ष पर एक अलग संक्रिया या मान का प्रयास करें और पैमाने का अवलोकन करें।",
      voice: "अब, आइए जानें कि जब आप अलग-अलग क्रियाएं करते हैं तो क्या होता है। प्रत्येक पक्ष पर एक अलग संक्रिया का प्रयास करें।",
    },
    balanced_feedback: {
      text: "उत्कृष्ट! पैमाना अभी भी पूरी तरह से संतुलित है! दोनों पैमानों पर फिर से एक ही क्रिया करने का प्रयास करें।",
      voice: "पैमाना संतुलित है! इसे फिर से प्रयास करें।",
    },
    unbalanced_feedback: {
      text: "पैमाना अब संतुलित नहीं है!",
      voice: "पैमाना अब संतुलित नहीं है!",
    },
    same_action_explanation: {
      text: "जैसा कि हम देख सकते हैं, दोनों तरफ एक ही क्रिया करने से कोई झुकाव नहीं हुआ और पैमाना संतुलित रहा। ऐसा इसलिए है क्योंकि दोनों पक्षों के साथ समान व्यवहार किया गया था। इसे याद रखें, क्योंकि यह समीकरणों को हल करने में सहायक होगा। भविष्य में, जब हम एक तरफ एक क्रिया करते हैं, तो उसे दूसरी तरफ भी करना होगा।",
      voice: "दोनों तरफ एक ही क्रिया करने से पैमाना संतुलित रहता है। यह समीकरणों को हल करने में सहायक होगा।",
    },
    unbalanced_explanation: {
      text: "पैमाना झुका हुआ है! ऐसा इसलिए है क्योंकि हमने प्रत्येक पक्ष पर एक अलग क्रिया की है। चूंकि हमारा लक्ष्य इसे संतुलित रखना है, इसलिए हम हमेशा दोनों पक्षों पर एक ही संक्रिया करते हैं।",
      voice: "पैमाना झुका हुआ है! ऐसा इसलिए है क्योंकि हमने प्रत्येक पक्ष पर एक अलग क्रिया की है। याद रखें कि पैमाने को संतुलित रखने के लिए हमेशा दोनों पक्षों पर एक ही संक्रिया करें।",
    },
    goBack: "मूल स्थिति पर वापस जाएं",

    // UI labels
    applyOperation: "लागू करें",
    enterValue: "एक मान दर्ज करें",
    value: "मान:",
    equals: "=",
    chooseOperation: "एक संक्रिया चुनें:",
    leftScale: "बायां पैमाना",
    rightScale: "दायां पैमाना",
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [step, setStep] = useState(0);
  const [userInteraction, setUserInteraction] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [leftPanWeight, setLeftPanWeight] = useState(3);
  const [rightPanWeight, setRightPanWeight] = useState(3);
  const [balanceTilt, setBalanceTilt] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showUnbalanced, setShowUnbalanced] = useState(false);

  const [leftOperation, setLeftOperation] = useState('+');
  const [leftValue, setLeftValue] = useState('');
  const [rightOperation, setRightOperation] = useState('+');
  const [rightValue, setRightValue] = useState('');

  const t = useCallback((key, voice = false) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return voice ? translation.voice : translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();
    return new Promise((resolve) => {
      const textToSpeak = t(key, true);
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
    await speakMessage('welcome');
    await speakMessage('balance_intro');
    setStep(2);
    if(showUnbalanced) {
      await speakMessage('interactive_intro_unbalanced');
    } else {
      await speakMessage('interactive_intro_balanced');
    }
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setStep(0);
    setLeftPanWeight(3);
    setRightPanWeight(3);
    setBalanceTilt(0);
    setLeftOperation('+');
    setLeftValue('');
    setRightOperation('+');
    setRightValue('');
    setFeedback('');
    setShowUnbalanced(false);
  };

  const handleApplyOperations = async () => {
    const leftVal = parseFloat(leftValue);
    const rightVal = parseFloat(rightValue);
    
    if (leftValue === '' || isNaN(leftVal) || rightValue === '' || isNaN(rightVal)) return;

    let newLeftWeight = leftPanWeight;
    let newRightWeight = rightPanWeight;

    if (leftOperation === '+') {
      newLeftWeight += leftVal;
    } else if (leftOperation === '-') {
      newLeftWeight -= leftVal;
    } else if (leftOperation === '*') {
      newLeftWeight *= leftVal;
    } else if (leftOperation === '/') {
      if (leftVal === 0) return;
      newLeftWeight /= leftVal;
    }

    if (rightOperation === '+') {
      newRightWeight += rightVal;
    } else if (rightOperation === '-') {
      newRightWeight -= rightVal;
    } else if (rightOperation === '*') {
      newRightWeight *= rightVal;
    } else if (rightOperation === '/') {
      if (rightVal === 0) return;
      newRightWeight /= rightVal;
    }
    
    setLeftPanWeight(newLeftWeight);
    setRightPanWeight(newRightWeight);
    setLeftValue('');
    setRightValue('');

    if (Math.abs(newLeftWeight - newRightWeight) < 0.01) {
      setBalanceTilt(0);
      setFeedback(t('balanced_feedback'));
      if (!showUnbalanced) {
        setShowUnbalanced(true);
        await speakMessage('balanced_feedback');
      } else {
        await speakMessage('same_action_explanation');
      }
    } else {
      const tilt = (newRightWeight - newLeftWeight) * 10;
      setBalanceTilt(Math.min(Math.max(tilt, -15), 15));
      setFeedback(t('unbalanced_feedback'));
      await speakMessage('unbalanced_explanation');
    }
  };


  const handleGoBack = async () => {
    setBalanceTilt(0);
    setLeftPanWeight(3);
    setRightPanWeight(3);
    setFeedback('');
    setLeftOperation('+');
    setLeftValue('');
    setRightOperation('+');
    setRightValue('');
    setStep(2); // Set to step 2 to re-initiate the interactive lesson intro
    await speakMessage('interactive_intro_unbalanced');
  };

  const renderWeight = (weight) => (
    <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
      {weight.toFixed(2)} gm
    </span>
  );

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
          {/* Beam and Pans Group */}
          <div 
            className="absolute bottom-22 sm:bottom-36 w-full max-w-xs sm:max-w-lg transition-all duration-700 ease-in-out"
            style={{ transform: `rotate(${balanceTilt}deg)` }}
          >
            {/* Beam */}
            <div className={`w-full h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}></div>
            {/* Pans */}
            <div className="absolute w-full top-2/3 -translate-y-1/2 flex justify-between px-4 sm:px-8">
              {/* Left Pan */}
              <div 
                className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
                style={{ transform: `rotate(${-balanceTilt}deg)` }}
              >
                <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                  <div className="flex flex-wrap items-center justify-center gap-2" style={{ transform: `rotate(${balanceTilt}deg)` }}>
                    {renderWeight(leftPanWeight)}
                  </div>
                </div>
              </div>
              {/* Right Pan */}
              <div 
                className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
                style={{ transform: `rotate(${-balanceTilt}deg)` }}
              >
                <div className="flex flex-col items-center justify-center" >
                  <div style={{ transform: `rotate(${balanceTilt}deg)` }}>
                    {renderWeight(rightPanWeight)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
          <p className={`text-center text-sm sm:text-base mb-4 sm:mb-6 transition-all duration-300 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            {step === 0 && t('welcome')}
            {step === 1 && t('balance_intro')}
            {step === 2 && showUnbalanced ? t('interactive_intro_unbalanced') : t('interactive_intro_balanced')}
            {feedback && <span className="block mt-2 font-semibold">{feedback}</span>}
          </p>

          {step === 0 && (
            <button
              onClick={handleStart}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('start')}
            </button>
          )}
          
          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('continue')}
            </button>
          )}

          {step >= 2 && (
            <div className="flex flex-col items-center sm:flex-row gap-4 w-full">
              {/* Left Side Controls */}
              <div className={`flex-1 p-3 rounded-lg ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'}`}>
                <h4 className="font-semibold text-center mb-2">{t('leftScale')}</h4>
                <div className="flex flex-col gap-2">
                  <select
                    value={leftOperation}
                    onChange={(e) => setLeftOperation(e.target.value)}
                    className={`w-full p-2 border rounded-md text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                  >
                    {['+', '-', '*', '/'].map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                  <input
                    type="number"
                    value={leftValue}
                    onChange={(e) => setLeftValue(e.target.value)}
                    placeholder={t('enterValue')}
                    className={`w-full p-2 border rounded-md text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                  />
                </div>
              </div>
              
              {/* Right Side Controls */}
              <div className={`flex-1 p-3 rounded-lg ${theme === 'light' ? 'bg-purple-100' : 'bg-purple-900'}`}>
                <h4 className="font-semibold text-center mb-2">{t('rightScale')}</h4>
                <div className="flex flex-col gap-2">
                  <select
                    value={rightOperation}
                    onChange={(e) => setRightOperation(e.target.value)}
                    className={`w-full p-2 border rounded-md text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                  >
                    {['+', '-', '*', '/'].map(op => <option key={op} value={op}>{op}</option>)}
                  </select>
                  <input
                    type="number"
                    value={rightValue}
                    onChange={(e) => setRightValue(e.target.value)}
                    placeholder={t('enterValue')}
                    className={`w-full p-2 border rounded-md text-sm ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
                  />
                </div>
              </div>
              <button
                onClick={handleApplyOperations}
                disabled={!leftValue || isNaN(parseFloat(leftValue)) || !rightValue || isNaN(parseFloat(rightValue))}
                className={`mt-4 sm:mt-0 px-6 py-3 font-bold rounded-lg shadow-lg transition-transform transform active:scale-95 text-lg w-full sm:w-auto ${(!leftValue || !rightValue) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {t('applyOperation')}
              </button>
            </div>
          )}

          <div className="mt-4 flex gap-4 w-full justify-center">
            {balanceTilt !== 0 && (
              <button
                onClick={handleGoBack}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
              >
                {t('goBack')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;