import React, { useState, useCallback, useEffect, useRef } from 'react';

const translations = {
  en: {
    title: "When to Subtract vs. When to Divide",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    reset: "🔄 Reset",
    
    // UI labels
    equals: "=",
    chooseOperation: "Choose an operation:",
    leftScale: "Left Scale",
    rightScale: "Right Scale",
    
    // Path selection
    introText: {
      text: "The first step to solving an equation can be confusing. Let's explore two different scenarios to understand when to use subtraction and when to use division.",
      voice: "Let's explore two different scenarios to understand when to use subtraction and when to use division.",
    },
    scenario1Title: "Scenario 1: Subtract to Isolate X",
    scenario2Title: "Scenario 2: Divide to Isolate X",

    // Solving Equations Paths
    paths: {
      subtractionScenario: [
        {
          step: 1,
          equation: "3X = 2X + 6",
          explanation: "In this equation, we want to get all the 'X' terms to one side. Since **2X** is being **added** on the right side, we use the inverse operation, which is **subtraction**, to remove it. We subtract 2X from both sides to keep the scale balanced.",
          voice: "In this equation, we want to get all the X terms to one side. Since 2X is being added, we use the inverse operation, which is subtraction. We subtract 2X from both sides to keep the scale balanced.",
        },
        {
          step: 2,
          equation: "3X - 2X = 2X - 2X + 6",
          explanation: "After subtracting 2X from both sides, the equation now shows the operation explicitly. This demonstrates how the scale remains balanced when the same action is performed on both sides.",
          voice: "After subtracting 2X from both sides, the equation now shows the operation explicitly. This demonstrates how the scale remains balanced.",
        },
        {
          step: 3,
          equation: "X = 6",
          explanation: "After performing the subtraction on both sides, the equation simplifies to X = 6. We have isolated X and found its value.",
          voice: "After performing the subtraction on both sides, the equation simplifies to X equals 6. We have isolated X and found its value.",
        }
      ],
      divisionScenario: [
        {
          step: 1,
          equation: "3X = 6",
          explanation: "In this equation, we want to find the value of a single 'X'. Since **3** is a **coefficient** being **multiplied** by X, we use the inverse operation, which is **division**. We divide both sides by 3 to keep the scale balanced.",
          voice: "In this equation, we want to find the value of a single X. Since 3 is a coefficient being multiplied by X, we use the inverse operation, which is division. We divide both sides by 3 to keep the scale balanced.",
        },
        {
          step: 2,
          equation: "X = 2",
          explanation: "After dividing both sides by 3, the equation simplifies to X = 2. We have found that each apple weighs 2 grams.",
          voice: "After dividing both sides by 3, the equation simplifies to X equals 2. We have found that each apple weighs 2 grams.",
        }
      ]
    }
  },
  hi: {
    title: "कब घटाना है और कब भाग देना है?",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    reset: "🔄 रीसेट करें",

    // UI labels
    equals: "बराबर",
    chooseOperation: "एक संक्रिया चुनें:",
    leftScale: "बायां पैमाना",
    rightScale: "दायां पैमाना",
    
    // Path selection
    introText: {
      text: "एक समीकरण को हल करने का पहला कदम भ्रमित करने वाला हो सकता है। आइए यह समझने के लिए दो अलग-अलग परिदृश्यों का पता लगाएं कि कब घटाना है और कब भाग देना है।",
      voice: "आइए यह समझने के लिए दो अलग-अलग परिदृश्यों का पता लगाएं कि कब घटाना है और कब भाग देना है।",
    },
    scenario1Title: "परिदृश्य 1: X को अलग करने के लिए घटाएँ",
    scenario2Title: "परिदृश्य 2: X को अलग करने के लिए भाग दें",

    // Solving Equations Paths
    paths: {
      subtractionScenario: [
        {
          step: 1,
          equation: "3X = 2X + 6",
          explanation: "इस समीकरण में, हम सभी 'X' पदों को एक तरफ लाना चाहते हैं। चूंकि दाईं ओर **2X** को **जोड़ा** जा रहा है, हम इसे हटाने के लिए व्युत्क्रम संक्रिया, जो कि **घटाना** है, का उपयोग करते हैं। संतुलन बनाए रखने के लिए हम दोनों पक्षों से 2X घटाते हैं।",
          voice: "इस समीकरण में, हम सभी X पदों को एक तरफ लाना चाहते हैं। चूंकि 2X को जोड़ा जा रहा है, हम इसे हटाने के लिए घटाने का उपयोग करते हैं। संतुलन बनाए रखने के लिए हम दोनों पक्षों से 2X घटाते हैं।",
        },
        {
          step: 2,
          equation: "3X - 2X = 2X - 2X + 6",
          explanation: "दोनों पक्षों से 2X घटाने के बाद, समीकरण अब क्रिया को स्पष्ट रूप से दिखाता है। यह दर्शाता है कि जब दोनों पक्षों पर एक ही क्रिया की जाती है तो पैमाना कैसे संतुलित रहता है।",
          voice: "दोनों पक्षों से 2X घटाने के बाद, समीकरण अब क्रिया को स्पष्ट रूप से दिखाता है। यह दर्शाता है कि पैमाना कैसे संतुलित रहता है।",
        },
        {
          step: 3,
          equation: "X = 6",
          explanation: "दोनों पक्षों से 2X घटाने के बाद, समीकरण X = 6 हो जाता है। हमने X को अलग कर लिया है और उसका मान ज्ञात कर लिया है।",
          voice: "दोनों पक्षों से 2X घटाने के बाद, समीकरण X बराबर 6 हो जाता है। हमने X को अलग कर लिया है।",
        }
      ],
      divisionScenario: [
        {
          step: 1,
          equation: "3X = 6",
          explanation: "इस समीकरण में, हम एक 'X' का मान ज्ञात करना चाहते हैं। चूंकि **3** एक **गुणांक** है जिसे X से **गुणा** किया जा रहा है, हम व्युत्क्रम संक्रिया, जो कि **भाग देना** है, का उपयोग करते हैं। संतुलन बनाए रखने के लिए हम दोनों पक्षों को 3 से भाग देते हैं।",
          voice: "इस समीकरण में, हम एक X का मान ज्ञात करना चाहते हैं। चूंकि 3 एक गुणांक है जिसे X से गुणा किया जा रहा है, हम व्युत्क्रम संक्रिया, जो कि भाग देना है, का उपयोग करते हैं। संतुलन बनाए रखने के लिए हम दोनों पक्षों को 3 से भाग देते हैं।",
        },
        {
          step: 2,
          equation: "X = 2",
          explanation: "दोनों पक्षों को 3 से भाग देने के बाद, समीकरण X = 2 हो जाता है। हमने पाया है कि प्रत्येक सेब का वजन 2 ग्राम है।",
          voice: "दोनों पक्षों को 3 से भाग देने के बाद, समीकरण X बराबर 2 हो जाता है। प्रत्येक सेब का वजन 2 ग्राम है।",
        }
      ]
    }
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [leftPanWeight, setLeftPanWeight] = useState({ apples: 3, value: null });
  const [rightPanWeight, setRightPanWeight] = useState({ apples: 2, value: 6 });
  const [balanceTilt] = useState(0);

  const [scenario, setScenario] = useState('subtractionScenario');
  const [equationStep, setEquationStep] = useState(1);

  const t = useCallback((key) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key, path) => {
    if (!audioEnabled) return Promise.resolve();
    
    let textToSpeak = '';
    if (path) {
      const stepObject = translations[currentLanguage].paths[path][key - 1];
      textToSpeak = stepObject.voice;
    } else if (translations[currentLanguage].hasOwnProperty(key)) {
      const translation = translations[currentLanguage][key];
      textToSpeak = typeof translation === 'object' ? translation.voice : translation;
    }
    
    if (!textToSpeak) return Promise.resolve();

    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
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

  const initialRenderRef = useRef(true);
  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
    }
    speakMessage('introText');
  }, [speakMessage]);

  const handleReset = () => {
    setEquationStep(1);
    speakMessage('introText');
  };

  const handleChangeScenario = (newScenario) => {
    setScenario(newScenario);
    setEquationStep(1);
    if (newScenario === 'subtractionScenario') {
      setLeftPanWeight({ apples: 3, value: null });
      setRightPanWeight({ apples: 2, value: 6 });
    } else {
      setLeftPanWeight({ apples: 3, value: null });
      setRightPanWeight({ apples: 0, value: 6 });
    }
    speakMessage(1, newScenario);
  };

  const renderWeights = (apples, value) => {
    const appleItems = Array.from({ length: apples }, (_, i) => (
      <div key={`apple-${i}`} className="text-4xl leading-none">
        🍎
      </div>
    ));
    const valueItem = value !== null && (
      <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
        {value} gm
      </span>
    );
    return (
      <div className="flex items-center justify-center gap-4">
        {apples > 0 && (
          <div className="flex flex-col items-center justify-center -space-y-2">
            {appleItems}
          </div>
        )}
        {valueItem}
      </div>
    );
  };

  const renderEquationWithHighlights = (path, step) => {
    const baseEquation = translations[currentLanguage].paths[path][step - 1].equation;
    const highlightClass = "ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1";

    if (path === 'subtractionScenario') {
      switch(step) {
        case 1:
          return <p className="font-mono text-gray-800 dark:text-gray-200">3X = <span className={highlightClass}>2X</span> + 6</p>;
        case 2:
          return <p className="font-mono text-gray-800 dark:text-gray-200">3X - 2X = 2X - 2X + 6</p>;
        case 3:
          return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
      }
    }
    
    if (path === 'divisionScenario') {
      switch(step) {
        case 1:
          return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>3X</span> = <span className={highlightClass}>6</span></p>;
        case 2:
          return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
      }
    }
    return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
  };

  const renderPathSteps = (path) => {
    const steps = translations[currentLanguage].paths[path];
    return (
      <div className="flex flex-col gap-4 w-full">
        {steps.map((stepData, index) => (
          <div key={index} 
               onClick={() => {
                 setEquationStep(stepData.step);
                 setScenario(path);
                 speakMessage(stepData.step, path);
               }}
               className={`cursor-pointer flex flex-col items-start p-4 rounded-lg shadow-md transition-colors duration-300 ${
            equationStep === stepData.step && scenario === path
              ? `${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'} ring-4 ring-indigo-500`
              : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`
            }`}>
            <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
              {t('step')} {stepData.step}
            </h3>
            <div className="font-mono bg-gray-200 dark:bg-gray-800 p-3 rounded-lg w-full mt-2">
              {renderEquationWithHighlights(path, stepData.step)}
            </div>
            <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'} mt-2`}>
              {stepData.explanation}
            </p>
          </div>
        ))}
      </div>
    );
  };

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
                  className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
                  style={{ transform: `rotate(${-balanceTilt}deg)` }}
                >
                  <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
                    <div className="flex flex-wrap items-center justify-center gap-2" style={{ transform: `rotate(${balanceTilt}deg)` }}>
                      {renderWeights(leftPanWeight.apples, leftPanWeight.value)}
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
                      {renderWeights(rightPanWeight.apples, rightPanWeight.value)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            <p className={`text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
              {t('introText')}
            </p>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleChangeScenario('subtractionScenario')}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
                  scenario === 'subtractionScenario' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-300 text-gray-800' : 'bg-gray-700 text-white'}`
                }`}
              >
                {t('scenario1Title')}
              </button>
              <button
                onClick={() => handleChangeScenario('divisionScenario')}
                className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors duration-200 ${
                  scenario === 'divisionScenario' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-300 text-gray-800' : 'bg-gray-700 text-white'}`
                }`}
              >
                {t('scenario2Title')}
              </button>
            </div>
            
            {scenario === 'subtractionScenario' && renderPathSteps('subtractionScenario')}
            {scenario === 'divisionScenario' && renderPathSteps('divisionScenario')}

            <div className="mt-4 flex gap-4 w-full justify-center">
              <button
                onClick={handleReset}
                className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
              >
                {t('reset')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;