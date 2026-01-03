import React, { useState, useCallback, useEffect, useRef } from 'react';

const translations = {
  en: {
    title: "Understanding Like and Unlike Terms",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    continue: "Continue",
    reset: "🔄 Reset",
    start: "Start",
    intro: {
      text: "Now we are going to learn about like and unlike terms. Click Start to proceed.",
      voice: "Now we are going to learn about like and unlike terms.",
    },
    
    // UI labels
    equals: "=",
    concludingMessage: "Remember this while solving the algebraic expression.",
    
    tabs: {
      likeTerms: {
        tabName: "Like Terms",
        steps: [
          {
            left: { apples: 2, apple2: 1, value: null },
            right: { apples: 1, oranges: 1, value: null },
            text: "Since we have 2 apples and one apple separately on the left scale, we can combine them and write it as 3 * Weight of one apple. We can add them as they are **like terms**.",
            voice: "We can combine the two apples and one apple on the left scale to get a total of three apples. We can add them as they are like terms.",
            equation: "2 * Weight of one apple + Weight of one apple = Weight of one apple + Weight of one orange",
            highlight: "left"
          }
        ]
      },
      unlikeTerms: {
        tabName: "Unlike Terms",
        steps: [
          {
            left: { apples: 3, value: null },
            right: { apples: 1, oranges: 1, value: null },
            text: "On the right scale, we have one apple and one orange. We can only perform direct operations of addition and subtraction on **like terms**. Since apples and oranges are **unlike terms**, we cannot combine them.",
            voice: "On the right scale, we have one apple and one orange. We cannot combine them because they are unlike terms. Remember this while solving the algebraic expression.",
            equation: "3 * Weight of one apple = Weight of one apple + Weight of one orange",
            highlight: "right"
          }
        ]
      }
    }
  },
  hi: {
    title: "समान और असमान पदों को समझना",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    continue: "जारी रखें",
    reset: "🔄 रीसेट करें",
    start: "शुरू करें",
    intro: {
      text: "अब हम समान और असमान पदों के बारे में सीखने जा रहे हैं। जारी रखने के लिए शुरू करें पर क्लिक करें।",
      voice: "अब हम समान और असमान पदों के बारे में सीखने जा रहे हैं।",
    },

    // UI labels
    equals: "बराबर",
    concludingMessage: "बीजगणितीय व्यंजक हल करते समय इसे याद रखें।",
    
    tabs: {
      likeTerms: {
        tabName: "समान पद",
        steps: [
          {
            left: { apples: 2, apple2: 1, value: null },
            right: { apples: 1, oranges: 1, value: null },
            text: "चूंकि हमारे पास बाईं ओर के पैमाने पर 2 सेब और एक सेब अलग-अलग हैं, हम उन्हें मिलाकर 3 * एक सेब का वजन के रूप में लिख सकते हैं। हम उन्हें जोड़ सकते हैं क्योंकि वे **समान पद** हैं।",
            voice: "हम बाईं ओर दो सेब और एक सेब को मिलाकर कुल तीन सेब प्राप्त कर सकते हैं। हम उन्हें जोड़ सकते हैं क्योंकि वे समान पद हैं।",
            equation: "2 * एक सेब का वजन + एक सेब का वजन = एक सेब का वजन + एक संतरे का वजन",
            highlight: "left"
          }
        ]
      },
      unlikeTerms: {
        tabName: "असमान पद",
        steps: [
          {
            left: { apples: 3, value: null },
            right: { apples: 1, oranges: 1, value: null },
            text: "दाईं ओर के पैमाने पर, हमारे पास एक सेब और एक संतरा है। हम केवल **समान पदों** पर ही जोड़ और घटाव की सीधी क्रियाएं कर सकते हैं। चूंकि सेब और संतरा **असमान पद** हैं, हम उन्हें नहीं मिला सकते।",
            voice: "दाईं ओर, हमारे पास एक सेब और एक संतरा है। हम उन्हें नहीं मिला सकते क्योंकि वे असमान पद हैं। बीजगणितीय व्यंजक हल करते समय इसे याद रखें।",
            equation: "3 * एक सेब का वजन = एक सेब का वजन + एक संतरे का वजन",
            highlight: "right"
          }
        ]
      }
    }
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [balanceTilt] = useState(0);

  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState('likeTerms');
  const [currentStep, setCurrentStep] = useState(0);

  const t = useCallback((key) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (text) => {
    if (!audioEnabled) return Promise.resolve();
    
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.cancel();
        setTimeout(() => {
          speechSynthesis.speak(utterance);
        }, 100);
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
      } else {
        resolve();
      }
    });
  }, [currentLanguage, audioEnabled]);
  
  const handleContinue = () => {
    setCurrentStep(prev => {
      const steps = translations[currentLanguage].tabs[activeTab].steps;
      return prev < steps.length - 1 ? prev + 1 : prev;
    });
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setActiveTab('likeTerms');
    setIsStarted(false);
  };
  
  const handleStart = () => {
    setIsStarted(true);
    setCurrentStep(0);
    setActiveTab('likeTerms');
  };
  
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (isStarted) {
      const voiceMessage = translations[currentLanguage].tabs[activeTab].steps[currentStep].voice;
      if (voiceMessage) {
        speakMessage(voiceMessage);
      }
    } else {
      speakMessage(translations[currentLanguage].intro.voice);
    }
  }, [isStarted, activeTab, currentStep, currentLanguage, speakMessage]);

  const renderWeights = (content) => {
    const items = [];
    if (content.apples) {
      for (let i = 0; i < content.apples; i++) {
        items.push(<div key={`apple-${items.length}`} className="text-4xl leading-none">🍎</div>);
      }
    }
    if (content.apple2) {
       for (let i = 0; i < content.apple2; i++) {
        items.push(<div key={`apple2-${items.length}`} className="text-4xl leading-none">🍎</div>);
      }
    }
    if (content.oranges) {
      for (let i = 0; i < content.oranges; i++) {
        items.push(<div key={`orange-${items.length}`} className="text-4xl leading-none">🍊</div>);
      }
    }
    if (content.value) {
      items.push(
        <span key="value" className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
          {content.value} gm
        </span>
      );
    }
    
    if (activeTab === 'likeTerms' && content.apples && content.apple2) {
      return (
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center -space-y-2">
            {Array.from({ length: content.apples }, (_, i) => (
              <div key={`apple-${i}`} className="text-4xl leading-none">🍎</div>
            ))}
          </div>
          <div className="flex flex-col items-center justify-center -space-y-2">
            {Array.from({ length: content.apple2 }, (_, i) => (
              <div key={`apple2-${i}`} className="text-4xl leading-none">🍎</div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items}
      </div>
    );
  };

  const currentContent = translations[currentLanguage].tabs[activeTab].steps[currentStep];

  return (
    <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
      <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
              {t('selectLanguage')}:
            </label>
            <select
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
                handleReset();
              }}
              className={`p-2 border rounded-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-2 rounded-md font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`}
            >
              {t('changeTheme')}
            </button>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`px-3 py-2 rounded-md font-medium ${audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
            >
              🔊 {audioEnabled ? 'ON' : 'OFF'}
            </button>
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
                  className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'} ${isStarted && currentContent.highlight === 'left' ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-transparent animate-pulse' : ''}`}
                  style={{ transform: `rotate(${-balanceTilt}deg)` }}
                >
                  <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                    <div className="flex flex-wrap items-center justify-center gap-2" style={{ transform: `rotate(${balanceTilt}deg)` }}>
                      {isStarted && renderWeights(currentContent.left)}
                    </div>
                  </div>
                </div>
                {/* Right Pan */}
                <div 
                  className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'} ${isStarted && currentContent.highlight === 'right' ? 'ring-4 ring-yellow-500 ring-offset-4 ring-offset-transparent animate-pulse' : ''}`}
                  style={{ transform: `rotate(${-balanceTilt}deg)` }}
                >
                  <div className="flex flex-col items-center justify-center" >
                    <div style={{ transform: `rotate(${balanceTilt}deg)` }}>
                      {isStarted && renderWeights(currentContent.right)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            {!isStarted ? (
              <div className="flex flex-col items-center">
                <p className={`text-center text-sm sm:text-base mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                  {t('intro')}
                </p>
                <button
                  onClick={handleStart}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                >
                  {t('start')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {/* Tabs */}
                <div className="w-full flex justify-center mb-4">
                  <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                    {Object.keys(translations[currentLanguage].tabs).map(tabName => (
                      <button
                        key={tabName}
                        onClick={() => handleTabChange(tabName)}
                        className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                          activeTab === tabName
                            ? 'bg-blue-600 text-white'
                            : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                        }`}
                      >
                        {translations[currentLanguage].tabs[tabName].tabName}
                      </button>
                    ))}
                  </div>
                </div>

                <p className={`text-center mb-4 text-lg font-bold p-3 rounded-lg w-full ${theme === 'light' ? 'text-gray-800 bg-gray-100' : 'text-gray-200 bg-gray-700'}`}>
                  {currentContent.equation}
                </p>
                <p className={`text-center mb-4 text-sm sm:text-base w-full ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`} dangerouslySetInnerHTML={{ __html: currentContent.text }}>
                </p>
                <p className={`text-center mt-6 text-sm sm:text-base w-full p-2 rounded-lg font-semibold ${theme === 'light' ? 'text-gray-800 bg-gray-100' : 'text-gray-200 bg-gray-700'}`}>
                  {t('concludingMessage')}
                </p>
              </div>
            )}
            <div className="mt-4 flex gap-4 w-full justify-center">
              {isStarted && (
                <button
                  onClick={handleReset}
                  className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                >
                  {t('reset')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;