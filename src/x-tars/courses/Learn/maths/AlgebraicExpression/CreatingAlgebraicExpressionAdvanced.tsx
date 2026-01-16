import React, { useState, useEffect, useRef, useCallback } from 'react';

const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    startLesson: "Start Lesson",
    reset: "🔄 Reset",
    intro_message: "We have on the left scale 2 rectangles and 1 circle, and on the right hand side, we have 12 grams.",
    explanation_line1: "For the left side, we have 2 rectangles. We represent the total weight of these rectangles as 2 multiplied by the weight of one rectangle. Let's call its weight 'R'.",
    explanation_line2_part2: "Then, we add the weight of the circle to the left side. Let's call its weight 'C'.",
    explanation_line2_right_side: "On the right side, we have a known weight of 12 grams. Since the scale is balanced, we use an equal sign.",
    explanation_line3: "How will you create an algebraic expression for this case?",
    explanation_line4_reveal: "The expression for this balance is: 2R + C = 12.",
    explanation_line5_why: "We wrote this expression because on the left-hand side, we have two rectangles, which we represent as '2R'. Additionally, we have one circle, which we represent as 'C'. The combined weight of these items equals the 12 grams on the right side, leading us to the equation '2R + C = 12'.",
    explanation_line7_final_intro: "This gives us the final algebraic expression:",
    startMessage: "Welcome to the interactive balance scale. Click start to begin the lesson.",
    lhs_label_items: "2 × R + C",
    rhs_label_grams: "12g",
    final_equation: "2R + C = 12g"
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startLesson: "पाठ शुरू करें",
    reset: "🔄 रीसेट करें",
    intro_message: "बाईं ओर के पैमाने पर हमारे पास 2 आयत और 1 वृत्त हैं, और दाईं ओर, हमारे पास 12 ग्राम हैं।",
    explanation_line1: "बाईं ओर के लिए, हमारे पास 2 आयत हैं। हम इन आयतों के कुल वजन को एक आयत के वजन के 2 गुना के रूप में दर्शाते हैं। आइए इसके वजन को 'R' कहें।",
    explanation_line2_part2: "फिर, हम बाईं ओर वृत्त का वजन जोड़ते हैं। आइए इसके वजन को 'C' कहें।",
    explanation_line2_right_side: "दाईं ओर, हमारे पास 12 ग्राम का ज्ञात वजन है। चूंकि तराजू संतुलित है, हम एक बराबर चिह्न का उपयोग करते हैं।",
    explanation_line3: "आप इस मामले में बीजीय व्यंजक कैसे बनाएंगे?",
    explanation_line4_reveal: "इस संतुलन के लिए व्यंजक है: 2R + C = 12।",
    explanation_line5_why: "हमने यह व्यंजक इसलिए लिखा क्योंकि बाईं ओर हमारे पास दो आयत हैं, जिन्हें हम '2R' के रूप में दर्शाते हैं। इसके अतिरिक्त, हमारे पास एक वृत्त है, जिसे हम 'C' के रूप में दर्शाते हैं। इन वस्तुओं का संयुक्त वजन दाईं ओर के 12 ग्राम के बराबर है, जिससे हमें समीकरण '2R + C = 12' मिलता है।",
    explanation_line7_final_intro: "इससे हमें अंतिम बीजीय व्यंजक मिलता है:",
    startMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है। पाठ शुरू करने के लिए 'शुरू करें' पर क्लिक करें।",
    lhs_label_items: "2 × R + C",
    rhs_label_grams: "12 ग्राम",
    final_equation: "2R + C = 12 ग्राम"
  }
};

const RIGHT_SIDE_VALUE = 12;
const NUM_RECTANGLES = 2;

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [showLesson, setShowLesson] = useState(false);
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [userInteraction, setUserInteraction] = useState(false);
  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);
  const [showLhsExpression, setShowLhsExpression] = useState(false);
  const [showRhsExpression, setShowRhsExpression] = useState(false);
  const [showFinalEquation, setShowFinalEquation] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const t = useCallback((key) => {
    return translations[currentLanguage][key];
  }, [currentLanguage]);

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
        
        utterance.onend = () => {
          console.log(`Finished speaking: ${key}`);
          resolve();
        };
        utterance.onerror = (error) => {
          console.warn(`[Speech] Error for "${key}":`, error);
          resolve();
        };
        
        speechSynthesis.speak(utterance);
      } else {
        console.warn('Speech synthesis not supported');
        resolve();
      }
    });
  }, [currentLanguage, userInteraction, audioEnabled, t]);

  // Sequential lesson execution
  const executeStep = useCallback(async (step) => {
    console.log(`Executing step ${step}`);
    
    switch (step) {
      case 0:
        await speakMessage('intro_message');
        break;
      case 1:
        setHighlightLeft(true);
        await speakMessage('explanation_line1');
        break;
      case 2:
        await speakMessage('explanation_line2_part2');
        break;
      case 3:
        setHighlightLeft(false);
        setHighlightRight(true);
        await speakMessage('explanation_line2_right_side');
        break;
      case 4:
        setHighlightRight(false);
        await speakMessage('explanation_line3');
        break;
      case 5:
        await speakMessage('explanation_line4_reveal');
        setShowLhsExpression(true);
        setShowRhsExpression(true);
        break;
      case 6:
        await speakMessage('explanation_line5_why');
        break;
      case 7:
        await speakMessage('explanation_line7_final_intro');
        break;
      case 8:
        setShowFinalEquation(true);
        break;
    }
    
    console.log(`Completed step ${step}`);
  }, [speakMessage]);

  useEffect(() => {
    if (isLessonStarted && currentStep < 9) {
      const runStep = async () => {
        // Add delay before first step
        if (currentStep === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        await executeStep(currentStep);
        
        // Add appropriate delays between steps
        let delay = 2500; // Default delay
        if (currentStep === 1 || currentStep === 6) delay = 3500; // Longer pauses for complex explanations
        if (currentStep === 4) delay = 4000; // Pause after question
        
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, delay);
      };
      
      runStep();
    }
  }, [isLessonStarted, currentStep, executeStep]);

  const handleStartLesson = () => {
    setUserInteraction(true);
    setShowLesson(true);
    setIsLessonStarted(true);
    setCurrentStep(0);
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setShowLesson(false);
    setIsLessonStarted(false);
    setCurrentStep(0);
    setHighlightLeft(false);
    setHighlightRight(false);
    setShowLhsExpression(false);
    setShowRhsExpression(false);
    setShowFinalEquation(false);
  };

  const highlightClasses = (isLeft) => {
    if (isLeft && highlightLeft) {
        return `ring-4 ring-yellow-400 ring-opacity-75 animate-pulse`;
    }
    if (!isLeft && highlightRight) {
        return `ring-4 ring-yellow-400 ring-opacity-75 animate-pulse`;
    }
    return '';
  }

  const containerClasses = `min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`;
  const themeSwitchClasses = `px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
  const buttonClasses = `px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl`;
  const panClasses = `relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl transition-all duration-700 border-4`;

  return (
    <div className={containerClasses}>
      <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-sm sm:max-w-none sm:w-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <label htmlFor="language-select" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
            {t('selectLanguage')}:
          </label>
          <select
            id="language-select"
            value={currentLanguage}
            onChange={(e) => {
              setCurrentLanguage(e.target.value);
              handleReset();
            }}
            className={`p-1 sm:p-2 border rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={themeSwitchClasses}
        >
          {t('changeTheme')} ({theme === 'light' ? 'Dark' : 'Light'})
        </button>
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
        >
          🔊 {audioEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight transition-colors duration-300 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
        {t('scaleTitle')}
      </h2>

      {!showLesson ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className="text-xl sm:text-2xl font-semibold">{t('startMessage')}</p>
          <button onClick={handleStartLesson} className={buttonClasses}>
            {t('startLesson')}
          </button>
        </div>
      ) : (
        <>
          <div className="relative w-full max-w-2xl h-64 sm:h-72 md:h-80 flex items-center justify-center mb-8">
            {/* Base/Stand */}
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 sm:w-40 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
            
            {/* Vertical Support */}
            <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-20 sm:w-5 sm:h-24 md:w-6 md:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
            
            {/* Fulcrum */}
            <div className={`absolute bottom-32 sm:bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-xl border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
            </div>
            
            {/* Main beam */}
            <div className={`absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg h-3 sm:h-4 md:h-5 rounded-full shadow-2xl transition-transform duration-700 ease-in-out ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}>
              <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
              <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
              <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
            </div>

            {/* Chains */}
            <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg flex justify-between px-8">
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`left-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`right-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
            </div>

            {/* The pans */}
            <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 w-full max-w-lg flex justify-between px-8">
              
              {/* Left Pan (2 Rectangles + 1 Circle) */}
              <div className={`${panClasses} ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}>
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-700'} opacity-60`}></div>
                
                <div className="absolute inset-3 flex flex-row items-center justify-center gap-2">
                  {/* Stacked Rectangles with proper spacing */}
                  <div className="flex flex-col items-center justify-center gap-1"> 
                    {[...Array(NUM_RECTANGLES)].map((_, i) => (
                      <div key={i} className="w-6 h-4 sm:w-7 sm:h-5 rounded-sm bg-red-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                        R
                      </div>
                    ))}
                  </div>
                  {/* Circle with proper spacing */}
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    C
                  </div>
                </div>
              </div>

              {/* Right Pan (Fixed Value) */}
              <div className={`${panClasses} ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-700'} opacity-60`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-1">⚖️</div>
                    <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>
                      {RIGHT_SIDE_VALUE}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance indicator */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'}`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="font-bold text-sm sm:text-base">BALANCED!</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg mt-4 sm:mt-6 md:mt-8">
            {showLhsExpression && (
              <div className="flex justify-center items-center gap-4">
                <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {t('lhs_label_items')}
                </span>
                <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  =
                </span>
                <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {t('rhs_label_grams')}
                </span>
              </div>
            )}
            
            {showFinalEquation && (
              <div className="mt-4">
                <span className={`font-extrabold text-2xl sm:text-3xl ${theme === 'light' ? 'text-green-800' : 'text-green-100'}`}>
                  {t('final_equation')}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={handleReset}
            className={`mt-8 px-4 py-2 sm:px-6 sm:py-3 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none text-sm sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
          >
            {t('reset')}
          </button>
        </>
      )}
    </div>
  );
};

export default App;