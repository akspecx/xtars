// // import React, { useState, useCallback, useEffect } from 'react';

// // // Using a custom object for translations to better manage different problem types
// // const translations = {
// //   en: {
// //     scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
// //     selectLanguage: "Select Language",
// //     changeTheme: "Change Theme",
// //     startLearning: "Start Learning",
// //     reset: "🔄 Reset",
// //     welcomeMessage: "Welcome to the interactive algebraic balance scale, a tool to help you visualize algebraic concepts.",
// //     tabMonomial: "Monomial",
// //     tabBinomial: "Binomial",
// //     tabPolynomial: "Polynomial",
// //     monomialTitle: "What is a Monomial?",
// //     monomialExplanation: "A **monomial** is an algebraic expression with only **one term**. It never contains addition or subtraction signs.",
// //     monomialScenario: "In this scenario, we have a single type of item on each side of the scale. The left side has 3 circles (3C). The right side has the number 12. Since the scale is balanced, the expression is: 3C = 12.",
// //     monomialExplanation_step_1: "On the left side of the scale, we have three identical circles. We can represent these circles with a variable, let's say 'C'. Since there are three of them, we write this as 3C.",
// //     monomialExplanation_step_2: "On the right side of the scale, we have the number 12. Because the scales are perfectly balanced, we can represent this relationship with an equals sign.",
// //     monomialExplanation_step_3: "This gives us the complete algebraic expression for a monomial: 3C equals 12.",
// //     binomialTitle: "What is a Binomial?",
// //     binomialExplanation: "A **binomial** is an algebraic expression with **two terms**, joined by an addition or subtraction sign.",
// //     binomialScenario: "In this scenario, the left side has two different types of items: 2 circles (2C) and the number 5. The right side has the number 25. Since the scale is balanced, the expression is: 2C + 5 = 25.",
// //     binomialExplanation_step_1: "On the left side, we have two circles, which we can represent as 2C. We also have a constant, the number 5. The sum of these two terms is 2C + 5.",
// //     binomialExplanation_step_2: "On the right side, we have the number 25. Since the scales are balanced, we set the left side equal to the right side.",
// //     binomialExplanation_step_3: "This gives us the complete algebraic expression for a binomial: 2C + 5 equals 25.",
// //     polynomialTitle: "What is a Polynomial?",
// //     polynomialExplanation: "A **polynomial** is an algebraic expression that can have one or more terms. Monomials and binomials are specific types of polynomials.",
// //     polynomialScenario: "In this scenario, we have a more complex expression. The left side has a circle (C) and a triangle (T). The right side has the number 15. The balanced expression is: C + T = 15.",
// //     polynomialExplanation_step_1: "On the left side, we have a circle, which we can call C, and a triangle, which we can call T. This gives us the expression C + T.",
// //     polynomialExplanation_step_2: "On the right side, we have the number 15. Since the scales are balanced, we set the left side equal to the right side.",
// //     polynomialExplanation_step_3: "This gives us the complete algebraic expression for this polynomial: C + T equals 15.",
// //   },
// //   hi: {
// //     scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
// //     selectLanguage: "भाषा चुनें",
// //     changeTheme: "थीम बदलें",
// //     startLearning: "सीखना शुरू करें",
// //     reset: "🔄 रीसेट करें",
// //     welcomeMessage: "इंटरैक्टिव बीजीय संतुलन पैमाने में आपका स्वागत है, एक उपकरण जो आपको बीजीय अवधारणाओं की कल्पना करने में मदद करेगा।",
// //     tabMonomial: "एकपदीय (Monomial)",
// //     tabBinomial: "द्विपदीय (Binomial)",
// //     tabPolynomial: "बहुपदीय (Polynomial)",
// //     monomialTitle: "एकपदीय (Monomial) क्या है?",
// //     monomialExplanation: "एक **एकपदीय (monomial)** एक बीजीय व्यंजक है जिसमें केवल **एक पद** होता है। इसमें कभी भी जोड़ या घटाव के चिह्न नहीं होते हैं।",
// //     monomialScenario: "इस परिदृश्य में, हमारे पास पैमाने के प्रत्येक तरफ एक ही प्रकार की वस्तु है। बाईं ओर 3 वृत्त हैं, जिन्हें हम 3C के रूप में दर्शा सकते हैं। दाईं ओर संख्या 12 है। चूंकि पैमाना संतुलित है, इसलिए व्यंजक है: 3C = 12.",
// //     monomialExplanation_step_1: "पैमाने के बाईं ओर, हमारे पास तीन समान वृत्त हैं। हम इन वृत्तों को एक चर के रूप में दर्शा सकते हैं, मान लीजिए 'C'। चूंकि ये तीन हैं, हम इसे 3C के रूप में लिखते हैं।",
// //     monomialExplanation_step_2: "पैमाने के दाईं ओर, हमारे पास संख्या 12 है। क्योंकि तराजू पूरी तरह से संतुलित है, हम इस संबंध को बराबर के चिह्न से दर्शा सकते हैं।",
// //     monomialExplanation_step_3: "यह हमें एकपदीय के लिए पूर्ण बीजीय व्यंजक देता है: 3C बराबर 12।",
// //     binomialTitle: "द्विपदीय (Binomial) क्या है?",
// //     binomialExplanation: "एक **द्विपदीय (binomial)** एक बीजीय व्यंजक है जिसमें **दो पद** होते हैं, जो जोड़ या घटाव के चिह्न से जुड़े होते हैं।",
// //     binomialScenario: "इस परिदृश्य में, बाईं ओर दो अलग-अलग प्रकार की वस्तुएं हैं: 2 वृत्त (2C) और संख्या 5। दाईं ओर संख्या 25 है। चूंकि पैमाना संतुलित है, इसलिए व्यंजक है: 2C + 5 = 25.",
// //     binomialExplanation_step_1: "बाईं ओर, हमारे पास दो वृत्त हैं, जिन्हें हम 2C के रूप में दर्शा सकते हैं। हमारे पास एक स्थिर भी है, संख्या 5। इन दो पदों का योग 2C + 5 है।",
// //     binomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 25 है। चूंकि तराजू संतुलित है, हम बाईं ओर को दाईं ओर के बराबर रखते हैं।",
// //     binomialExplanation_step_3: "यह हमें एक द्विपदीय के लिए पूर्ण बीजीय व्यंजक देता है: 2C + 5 बराबर 25।",
// //     polynomialTitle: "बहुपदीय (Polynomial) क्या है?",
// //     polynomialExplanation: "एक **बहुपदीय (polynomial)** एक बीजीय व्यंजक है जिसमें एक या एक से अधिक पद हो सकते हैं। एकपदीय और द्विपदीय भी बहुपदीय के विशिष्ट प्रकार हैं।",
// //     polynomialScenario: "इस परिदृश्य में, हमारे पास एक अधिक जटिल व्यंजक है। बाईं ओर एक वृत्त (C) और एक त्रिभुज (T) है। दाईं ओर संख्या 15 है। संतुलित व्यंजक है: C + T = 15.",
// //     polynomialExplanation_step_1: "बाईं ओर, हमारे पास एक वृत्त है, जिसे हम C कह सकते हैं, और एक त्रिभुज है, जिसे हम T कह सकते हैं। यह हमें C + T का व्यंजक देता है।",
// //     polynomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 15 है। चूंकि तराजू संतुलित है, हम बाईं ओर को दाईं ओर के बराबर रखते हैं।",
// //     polynomialExplanation_step_3: "यह हमें इस बहुपदीय के लिए पूर्ण बीजीय व्यंजक देता है: C + T बराबर 15।",
// //   }
// // };

// // const App = () => {
// //   const [currentLanguage, setCurrentLanguage] = useState('en');
// //   const [theme, setTheme] = useState('dark');
// //   const [mode, setMode] = useState('initial'); // 'initial', 'learn'
// //   const [activeTab, setActiveTab] = useState('monomial'); // 'monomial', 'binomial', 'polynomial'
// //   const [userInteraction, setUserInteraction] = useState(false);
// //   const [audioEnabled, setAudioEnabled] = useState(false);
// //   const [highlightLeft, setHighlightLeft] = useState(false);
// //   const [highlightRight, setHighlightRight] = useState(false);

// //   // Memoize translation function
// //   const t = useCallback((key) => {
// //     const translation = translations[currentLanguage][key];
// //     if (typeof translation === 'function') {
// //       return translation();
// //     }
// //     return translation;
// //   }, [currentLanguage]);

// //   // Handle TTS
// //   const speakMessage = useCallback(async (key) => {
// //     if (!userInteraction || !audioEnabled) return Promise.resolve();
// //     speechSynthesis.cancel();
// //     return new Promise((resolve) => {
// //       const textToSpeak = t(key);
// //       if ('speechSynthesis' in window) {
// //         const utterance = new SpeechSynthesisUtterance(textToSpeak);
// //         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
// //         utterance.rate = 0.8;
// //         utterance.pitch = 1;
// //         utterance.volume = 0.8;
// //         utterance.onend = () => resolve();
// //         utterance.onerror = () => resolve();
// //         speechSynthesis.speak(utterance);
// //       } else {
// //         resolve();
// //       }
// //     });
// //   }, [currentLanguage, userInteraction, audioEnabled, t]);

// //   const startLearnSequence = useCallback(async (tabName) => {
// //     // A single function to manage the voice and highlighting sequence for each tab
// //     speechSynthesis.cancel();
// //     setHighlightLeft(false);
// //     setHighlightRight(false);

// //     let step1_key = `${tabName}Explanation_step_1`;
// //     let step2_key = `${tabName}Explanation_step_2`;
// //     let step3_key = `${tabName}Explanation_step_3`;

// //     setHighlightLeft(true);
// //     await speakMessage(step1_key);
// //     setHighlightLeft(false);

// //     setHighlightRight(true);
// //     await speakMessage(step2_key);
// //     setHighlightRight(false);

// //     await speakMessage(step3_key);
// //   }, [speakMessage]);

// //   const handleStartLearning = () => {
// //     setUserInteraction(true);
// //     setMode('learn');
// //     setActiveTab('monomial');
// //   };

// //   const handleReset = () => {
// //     setMode('initial');
// //     if ('speechSynthesis' in window) {
// //       speechSynthesis.cancel();
// //     }
// //   };

// //   useEffect(() => {
// //     if (mode === 'learn') {
// //       startLearnSequence(activeTab);
// //     }
// //   }, [mode, activeTab, startLearnSequence]);

// //   const highlightClasses = (isLeft) => {
// //     if (isLeft && highlightLeft) {
// //       return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
// //     }
// //     if (!isLeft && highlightRight) {
// //       return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
// //     }
// //     return '';
// //   };

// //   //-------------------
// //   // Render functions for different content types on the scale
// //   //-------------------
// //   const renderScale = (leftContent, rightContent) => (
// //     <div className="relative w-full max-w-xs sm:max-w-2xl h-60 sm:h-80 flex items-center justify-center mb-4 sm:mb-8">
// //       {/* Base */}
// //       <div className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>

// //       {/* Support */}
// //       <div className={`absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>

// //       {/* Fulcrum */}
// //       <div className={`absolute bottom-22 sm:bottom-40 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
// //         <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
// //       </div>

// //       {/* Beam */}
// //       <div className={`absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}>
// //         <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
// //       </div>
// //       {/* Chains */}
// //       <div className="absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
// //         <div className="flex flex-col items-center">
// //           {[...Array(3)].map((_, i) => (
// //             <div key={`left-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
// //           ))}
// //         </div>
// //         <div className="flex flex-col items-center">
// //           {[...Array(3)].map((_, i) => (
// //             <div key={`right-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
// //           ))}
// //         </div>
// //       </div>
// //       {/* Pans */}
// //       <div className="absolute bottom-12 sm:bottom-28 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
// //         {/* Left Pan */}
// //         <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}>
// //           <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
// //           {leftContent}
// //         </div>
// //         {/* Right Pan */}
// //         <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
// //           <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
// //           {rightContent}
// //         </div>
// //       </div>
// //       {/* Balance indicator */}
// //       <div className={`absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'}`}>
// //         <div className="flex items-center gap-1 sm:gap-2">
// //           <span className="text-sm sm:text-lg">✅</span>
// //           <span className="font-bold text-xs sm:text-base">BALANCED!</span>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   //-------------------
// //   // Content for the new 'Learn' tabs
// //   //-------------------
// //   const MonomialContent = () => {
// //     const leftContent = (
// //       <div className="flex flex-row items-center justify-center gap-1 sm:gap-2">
// //         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
// //         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
// //         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
// //       </div>
// //     );
// //     const rightContent = (
// //       <div className="flex items-center justify-center">
// //         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>12</span>
// //       </div>
// //     );

// //     return (
// //       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
// //         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('monomialTitle')}</h3>
// //         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialExplanation')}</p>
// //         {renderScale(leftContent, rightContent)}
// //         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialScenario')}</p>
// //       </div>
// //     );
// //   };

// //   const BinomialContent = () => {
// //     const leftContent = (
// //       <div className="flex flex-col items-center justify-center gap-2 sm:gap-4">
// //         <div className="flex items-center justify-center gap-1 sm:gap-2">
// //           <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
// //           <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
// //         </div>
// //         <div className="w-6 h-4 sm:w-8 sm:h-6 rounded-sm bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg mt-1 sm:mt-2">
// //           5
// //         </div>
// //       </div>
// //     );
// //     const rightContent = (
// //       <div className="flex items-center justify-center">
// //         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>25</span>
// //       </div>
// //     );
// //     return (
// //       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
// //         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('binomialTitle')}</h3>
// //         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialExplanation')}</p>
// //         {renderScale(leftContent, rightContent)}
// //         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialScenario')}</p>
// //       </div>
// //     );
// //   };

// //   const PolynomialContent = () => {
// //     const leftContent = (
// //         <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
// //             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
// //               C
// //             </div>
// //             <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
// //               <polygon points="50,10 90,90 10,90" fill="#f87171" stroke="#ef4444" strokeWidth="5" />
// //               <text x="50" y="65" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">T</text>
// //             </svg>
// //         </div>
// //     );
// //     const rightContent = (
// //       <div className="flex items-center justify-center">
// //         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>15</span>
// //       </div>
// //     );
// //     return (
// //       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
// //         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('polynomialTitle')}</h3>
// //         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialExplanation')}</p>
// //         {renderScale(leftContent, rightContent)}
// //         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialScenario')}</p>
// //       </div>
// //     );
// //   };

// //   const renderContent = () => {
// //     if (mode === 'initial') {
// //       return (
// //         <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
// //           <p className="text-lg sm:text-2xl font-semibold px-2">{t('welcomeMessage')}</p>
// //           <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
// //             <button
// //                onClick={handleStartLearning}
// //                className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
// //             >
// //               {t('startLearning')}
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     } else if (mode === 'learn') {
// //       return (
// //         <>
// //           <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 w-full max-w-lg">
// //             <button
// //               onClick={() => setActiveTab('monomial')}
// //               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'monomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
// //             >
// //               {t('tabMonomial')}
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('binomial')}
// //               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'binomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
// //             >
// //               {t('tabBinomial')}
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('polynomial')}
// //               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'polynomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
// //             >
// //               {t('tabPolynomial')}
// //             </button>
// //           </div>
// //           {activeTab === 'monomial' && <MonomialContent />}
// //           {activeTab === 'binomial' && <BinomialContent />}
// //           {activeTab === 'polynomial' && <PolynomialContent />}
// //         </>
// //       );
// //     }
// //     return null;
// //   };

// //   return (
// //     <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
// //       {/* Controls */}
// //       <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
// //           <div className="flex items-center gap-2 flex-1">
// //             <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
// //               {t('selectLanguage')}:
// //             </label>
// //             <select
// //               value={currentLanguage}
// //               onChange={(e) => {
// //                 setCurrentLanguage(e.target.value);
// //                 handleReset();
// //               }}
// //               className={`p-2 border rounded-md flex-1 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
// //             >
// //               <option value="en">English</option>
// //               <option value="hi">हिन्दी</option>
// //             </select>
// //           </div>
// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
// //               className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base flex-1 sm:flex-none ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
// //             >
// //               {t('changeTheme')}
// //             </button>
// //             <button
// //               onClick={() => setAudioEnabled(!audioEnabled)}
// //               className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
// //             >
// //               🔊 {audioEnabled ? 'ON' : 'OFF'}
// //             </button>
// //           </div>
// //         </div>
// //       </div>
// //       <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight transition-colors duration-300 text-center px-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
// //         {t('scaleTitle')}
// //       </h2>

// //       {renderContent()}

// //       {mode !== 'initial' && (
// //         <button
// //           onClick={handleReset}
// //           className={`mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none text-base sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
// //         >
// //           {t('reset')}
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // export default App;


// import React, { useState, useCallback, useEffect } from 'react';

// // Using a custom object for translations to better manage different problem types
// const translations = {
//   en: {
//     scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
//     selectLanguage: "Select Language",
//     changeTheme: "Change Theme",
//     startLearning: "Start Learning",
//     reset: "🔄 Reset",
//     welcomeMessage: "Welcome to the interactive algebraic balance scale, a tool to help you visualize algebraic concepts.",
//     tabMonomial: "Monomial",
//     tabBinomial: "Binomial",
//     tabPolynomial: "Polynomial",
//     monomialTitle: "What is a Monomial?",
//     monomialExplanation: "A **monomial** is an algebraic expression with only **one term**. The prefix **'mono'** means **'one'**, which is why it has a single term. It never contains addition or subtraction signs.",
//     monomialScenario: "In this scenario, we have a single type of item on each side of the scale. The left side has 3 circles (3C). The right side has the number 12. Since the scale is balanced, the expression is: 3C = 12.",
//     monomialExplanation_step_1: "On the left side of the scale, we have three identical circles. We can represent these circles with a variable, let's say 'C'. Since there are three of them, we write this as 3C.",
//     monomialExplanation_step_2: "On the right side of the scale, we have the number 12. Because the scales are perfectly balanced, we can represent this relationship with an equals sign.",
//     monomialExplanation_step_3: "This gives us the complete algebraic expression for a monomial: 3C equals 12.",
//     binomialTitle: "What is a Binomial?",
//     binomialExplanation: "A **binomial** is an algebraic expression with **two terms**, joined by an addition or subtraction sign. The prefix **'bi'** means **'two'**, which is why it has two terms.",
//     binomialScenario: "In this scenario, the left side has two different types of items: 2 circles (2C) and the number 5. The right side has the number 25. Since the scale is balanced, the expression is: 2C + 5 = 25.",
//     binomialExplanation_step_1: "On the left side, we have two circles, which we can represent as 2C. We also have a constant, the number 5. The sum of these two terms is 2C + 5.",
//     binomialExplanation_step_2: "On the right side, we have the number 25. Since the scales are balanced, we set the left side equal to the right side.",
//     binomialExplanation_step_3: "This gives us the complete algebraic expression for a binomial: 2C + 5 equals 25.",
//     polynomialTitle: "What is a Polynomial?",
//     polynomialExplanation: "A **polynomial** is an algebraic expression that can have one or more terms. The prefix **'poly'** means **'many'**, which is why a polynomial can have many terms. Monomials and binomials are specific types of polynomials.",
//     polynomialScenario: "In this scenario, we have a more complex expression. The left side has a circle (C) and a triangle (T). The right side has the number 15. The balanced expression is: C + T = 15.",
//     polynomialExplanation_step_1: "On the left side, we have a circle, which we can call C, and a triangle, which we can call T. This gives us the expression C + T.",
//     polynomialExplanation_step_2: "On the right side, we have the number 15. Since the scales are balanced, we set the left side equal to the right side.",
//     polynomialExplanation_step_3: "This gives us the complete algebraic expression for this polynomial: C + T equals 15.",
//   },
//   hi: {
//     scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
//     selectLanguage: "भाषा चुनें",
//     changeTheme: "थीम बदलें",
//     startLearning: "सीखना शुरू करें",
//     reset: "🔄 रीसेट करें",
//     welcomeMessage: "इंटरैक्टिव बीजीय संतुलन पैमाने में आपका स्वागत है, एक उपकरण जो आपको बीजीय अवधारणाओं की कल्पना करने में मदद करेगा।",
//     tabMonomial: "एकपदीय (Monomial)",
//     tabBinomial: "द्विपदीय (Binomial)",
//     tabPolynomial: "बहुपदीय (Polynomial)",
//     monomialTitle: "एकपदीय (Monomial) क्या है?",
//     monomialExplanation: "एक **एकपदीय (monomial)** एक बीजीय व्यंजक है जिसमें केवल **एक पद** होता है। उपसर्ग **'मोनो'** का अर्थ **'एक'** होता है, यही कारण है कि इसमें एक ही पद होता है। इसमें कभी भी जोड़ या घटाव के चिह्न नहीं होते हैं। ",
//     monomialScenario: "इस परिदृश्य में, हमारे पास पैमाने के प्रत्येक तरफ एक ही प्रकार की वस्तु है। बाईं ओर 3 वृत्त हैं, जिन्हें हम 3C के रूप में दर्शा सकते हैं। दाईं ओर संख्या 12 है। चूंकि पैमाना संतुलित है, इसलिए व्यंजक है: 3C = 12.",
//     monomialExplanation_step_1: "पैमाने के बाईं ओर, हमारे पास तीन समान वृत्त हैं। हम इन वृत्तों को एक चर के रूप में दर्शा सकते हैं, मान लीजिए 'C'। चूंकि ये तीन हैं, हम इसे 3C के रूप में लिखते हैं।",
//     monomialExplanation_step_2: "पैमाने के दाईं ओर, हमारे पास संख्या 12 है। क्योंकि तराजू पूरी तरह से संतुलित है, हम इस संबंध को बराबर के चिह्न से दर्शा सकते हैं।",
//     monomialExplanation_step_3: "यह हमें एकपदीय के लिए पूर्ण बीजीय व्यंजक देता है: 3C बराबर 12।",
//     binomialTitle: "द्विपदीय (Binomial) क्या है?",
//     binomialExplanation: "एक **द्विपदीय (binomial)** एक बीजीय व्यंजक है जिसमें **दो पद** होते हैं, जो जोड़ या घटाव के चिह्न से जुड़े होते हैं। उपसर्ग **'बाय'** का अर्थ **'दो'** होता है, यही कारण है कि इसमें दो पद होते हैं।",
//     binomialScenario: "इस परिदृश्य में, बाईं ओर दो अलग-अलग प्रकार की वस्तुएं हैं: 2 वृत्त (2C) और संख्या 5। दाईं ओर संख्या 25 है। चूंकि पैमाना संतुलित है, इसलिए व्यंजक है: 2C + 5 = 25.",
//     binomialExplanation_step_1: "बाईं ओर, हमारे पास दो वृत्त हैं, जिन्हें हम 2C के रूप में दर्शा सकते हैं। हमारे पास एक स्थिर भी है, संख्या 5। इन दो पदों का योग 2C + 5 है।",
//     binomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 25 है। चूंकि तराजू संतुलित है, हम बाईं ओर को दाईं ओर के बराबर रखते हैं।",
//     binomialExplanation_step_3: "यह हमें एक द्विपदीय के लिए पूर्ण बीजीय व्यंजक देता है: 2C + 5 बराबर 25।",
//     polynomialTitle: "बहुपदीय (Polynomial) क्या है?",
//     polynomialExplanation: "एक **बहुपदीय (polynomial)** एक बीजीय व्यंजक है जिसमें एक या एक से अधिक पद हो सकते हैं। उपसर्ग **'पॉली'** का अर्थ **'कई'** होता है, यही कारण है कि एक बहुपदीय में कई पद हो सकते हैं। एकपदीय और द्विपदीय भी बहुपदीय के विशिष्ट प्रकार हैं।",
//     polynomialScenario: "इस परिदृश्य में, हमारे पास एक अधिक जटिल व्यंजक है। बाईं ओर एक वृत्त (C) और एक त्रिभुज (T) है। दाईं ओर संख्या 15 है। संतुलित व्यंजक है: C + T = 15.",
//     polynomialExplanation_step_1: "बाईं ओर, हमारे पास एक वृत्त है, जिसे हम C कह सकते हैं, और एक त्रिभुज है, जिसे हम T कह सकते हैं। यह हमें C + T का व्यंजक देता है।",
//     polynomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 15 है। चूंकि तराजू संतुलित है, हम बाईं ओर को दाईं ओर के बराबर रखते हैं।",
//     polynomialExplanation_step_3: "यह हमें इस बहुपदीय के लिए पूर्ण बीजीय व्यंजक देता है: C + T बराबर 15।",
//   }
// };

// const App = () => {
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [theme, setTheme] = useState('dark');
//   const [mode, setMode] = useState('initial'); // 'initial', 'learn'
//   const [activeTab, setActiveTab] = useState('monomial'); // 'monomial', 'binomial', 'polynomial'
//   const [userInteraction, setUserInteraction] = useState(false);
//   const [audioEnabled, setAudioEnabled] = useState(false);
//   const [highlightLeft, setHighlightLeft] = useState(false);
//   const [highlightRight, setHighlightRight] = useState(false);

//   // Memoize translation function
//   const t = useCallback((key) => {
//     const translation = translations[currentLanguage][key];
//     if (typeof translation === 'function') {
//       return translation();
//     }
//     return translation;
//   }, [currentLanguage]);

//   // Handle TTS
//   const speakMessage = useCallback(async (key) => {
//     if (!userInteraction || !audioEnabled) return Promise.resolve();
//     speechSynthesis.cancel();
//     return new Promise((resolve) => {
//       const textToSpeak = t(key);
//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(textToSpeak);
//         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
//         utterance.rate = 0.8;
//         utterance.pitch = 1;
//         utterance.volume = 0.8;
//         utterance.onend = () => resolve();
//         utterance.onerror = () => resolve();
//         speechSynthesis.speak(utterance);
//       } else {
//         resolve();
//       }
//     });
//   }, [currentLanguage, userInteraction, audioEnabled, t]);

//   const startLearnSequence = useCallback(async (tabName) => {
//     // A single function to manage the voice and highlighting sequence for each tab
//     speechSynthesis.cancel();
//     setHighlightLeft(false);
//     setHighlightRight(false);

//     let step1_key = `${tabName}Explanation_step_1`;
//     let step2_key = `${tabName}Explanation_step_2`;
//     let step3_key = `${tabName}Explanation_step_3`;

//     setHighlightLeft(true);
//     await speakMessage(step1_key);
//     setHighlightLeft(false);

//     setHighlightRight(true);
//     await speakMessage(step2_key);
//     setHighlightRight(false);

//     await speakMessage(step3_key);
//   }, [speakMessage]);

//   const handleStartLearning = () => {
//     setUserInteraction(true);
//     setMode('learn');
//     setActiveTab('monomial');
//   };

//   const handleReset = () => {
//     setMode('initial');
//     if ('speechSynthesis' in window) {
//       speechSynthesis.cancel();
//     }
//   };

//   useEffect(() => {
//     if (mode === 'learn') {
//       startLearnSequence(activeTab);
//     }
//   }, [mode, activeTab, startLearnSequence]);

//   const highlightClasses = (isLeft) => {
//     if (isLeft && highlightLeft) {
//       return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
//     }
//     if (!isLeft && highlightRight) {
//       return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
//     }
//     return '';
//   };

//   //-------------------
//   // Render functions for different content types on the scale
//   //-------------------
//   const renderScale = (leftContent, rightContent) => (
//     <div className="relative w-full max-w-xs sm:max-w-2xl h-60 sm:h-80 flex items-center justify-center mb-4 sm:mb-8">
//       {/* Base */}
//       <div className={`absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>

//       {/* Support */}
//       <div className={`absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>

//       {/* Fulcrum */}
//       <div className={`absolute bottom-22 sm:bottom-40 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
//         <div className="absolute inset-1 sm:inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
//       </div>

//       {/* Beam */}
//       <div className={`absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}>
//         <div className="absolute inset-x-0 top-0 h-0.5 sm:h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
//       </div>
//       {/* Chains */}
//       <div className="absolute bottom-24 sm:bottom-44 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
//         <div className="flex flex-col items-center">
//           {[...Array(3)].map((_, i) => (
//             <div key={`left-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
//           ))}
//         </div>
//         <div className="flex flex-col items-center">
//           {[...Array(3)].map((_, i) => (
//             <div key={`right-${i}`} className={`w-0.5 sm:w-1 h-3 sm:h-5 mb-0.5 sm:mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
//           ))}
//         </div>
//       </div>
//       {/* Pans */}
//       <div className="absolute bottom-12 sm:bottom-28 w-full max-w-xs sm:max-w-lg flex justify-between px-4 sm:px-8">
//         {/* Left Pan */}
//         <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}>
//           <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
//           {leftContent}
//         </div>
//         {/* Right Pan */}
//         <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
//           <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
//           {rightContent}
//         </div>
//       </div>
//       {/* Balance indicator */}
//       <div className={`absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 px-2 sm:px-4 py-1 sm:py-2 rounded-full shadow-lg ${theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'}`}>
//         <div className="flex items-center gap-1 sm:gap-2">
//           <span className="text-sm sm:text-lg">✅</span>
//           <span className="font-bold text-xs sm:text-base">BALANCED!</span>
//         </div>
//       </div>
//     </div>
//   );

//   //-------------------
//   // Content for the new 'Learn' tabs
//   //-------------------
//   const MonomialContent = () => {
//     const leftContent = (
//       <div className="flex flex-row items-center justify-center gap-1 sm:gap-2">
//         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
//         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
//         <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
//       </div>
//     );
//     const rightContent = (
//       <div className="flex items-center justify-center">
//         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>12</span>
//       </div>
//     );

//     return (
//       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
//         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('monomialTitle')}</h3>
//         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialExplanation')}</p>
//         {renderScale(leftContent, rightContent)}
//         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialScenario')}</p>
//       </div>
//     );
//   };

//   const BinomialContent = () => {
//     const leftContent = (
//       <div className="flex flex-col items-center justify-center gap-2 sm:gap-4">
//         <div className="flex items-center justify-center gap-1 sm:gap-2">
//           <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
//           <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
//         </div>
//         <div className="w-6 h-4 sm:w-8 sm:h-6 rounded-sm bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg mt-1 sm:mt-2">
//           5
//         </div>
//       </div>
//     );
//     const rightContent = (
//       <div className="flex items-center justify-center">
//         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>25</span>
//       </div>
//     );
//     return (
//       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
//         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('binomialTitle')}</h3>
//         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialExplanation')}</p>
//         {renderScale(leftContent, rightContent)}
//         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialScenario')}</p>
//       </div>
//     );
//   };

//   const PolynomialContent = () => {
//     const leftContent = (
//         <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
//             <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
//               C
//             </div>
//             <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
//               <polygon points="50,10 90,90 10,90" fill="#f87171" stroke="#ef4444" strokeWidth="5" />
//               <text x="50" y="65" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">T</text>
//             </svg>
//         </div>
//     );
//     const rightContent = (
//       <div className="flex items-center justify-center">
//         <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>15</span>
//       </div>
//     );
//     return (
//       <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
//         <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('polynomialTitle')}</h3>
//         <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialExplanation')}</p>
//         {renderScale(leftContent, rightContent)}
//         <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialScenario')}</p>
//       </div>
//     );
//   };

//   const renderContent = () => {
//     if (mode === 'initial') {
//       return (
//         <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
//           <p className="text-lg sm:text-2xl font-semibold px-2">{t('welcomeMessage')}</p>
//           <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
//             <button
//                onClick={handleStartLearning}
//                className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
//             >
//               {t('startLearning')}
//             </button>
//           </div>
//         </div>
//       );
//     } else if (mode === 'learn') {
//       return (
//         <>
//           <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 w-full max-w-lg">
//             <button
//               onClick={() => setActiveTab('monomial')}
//               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'monomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
//             >
//               {t('tabMonomial')}
//             </button>
//             <button
//               onClick={() => setActiveTab('binomial')}
//               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'binomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
//             >
//               {t('tabBinomial')}
//             </button>
//             <button
//               onClick={() => setActiveTab('polynomial')}
//               className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'polynomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
//             >
//               {t('tabPolynomial')}
//             </button>
//           </div>
//           {activeTab === 'monomial' && <MonomialContent />}
//           {activeTab === 'binomial' && <BinomialContent />}
//           {activeTab === 'polynomial' && <PolynomialContent />}
//         </>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
//       {/* Controls */}
//       <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
//           <div className="flex items-center gap-2 flex-1">
//             <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
//               {t('selectLanguage')}:
//             </label>
//             <select
//               value={currentLanguage}
//               onChange={(e) => {
//                 setCurrentLanguage(e.target.value);
//                 handleReset();
//               }}
//               className={`p-2 border rounded-md flex-1 text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//             </select>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//               className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base flex-1 sm:flex-none ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
//             >
//               {t('changeTheme')}
//             </button>
//             <button
//               onClick={() => setAudioEnabled(!audioEnabled)}
//               className={`px-3 py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
//             >
//               🔊 {audioEnabled ? 'ON' : 'OFF'}
//             </button>
//           </div>
//         </div>
//       </div>
//       <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight transition-colors duration-300 text-center px-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//         {t('scaleTitle')}
//       </h2>

//       {renderContent()}

//       {mode !== 'initial' && (
//         <button
//           onClick={handleReset}
//           className={`mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none text-base sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
//         >
//           {t('reset')}
//         </button>
//       )}
//     </div>
//   );
// };

// export default App;


import React, { useState, useCallback, useEffect } from 'react';

// Using a custom object for translations to better manage different problem types
const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    startLearning: "Start Learning",
    reset: "🔄 Reset",
    welcomeMessage: "Welcome to the interactive algebraic balance scale, a tool to help you visualize algebraic concepts.",
    tabMonomial: "Monomial",
    tabBinomial: "Binomial",
    tabPolynomial: "Polynomial",
    monomialTitle: "What is a Monomial?",
    monomialExplanation: "A **monomial** is an algebraic expression with only **one term**. The prefix **'mono'** means **'one'**, which is why it has a single term. It never contains addition or subtraction signs.",
    monomialScenario: "",
    monomialExplanation_step_1: "A monomial has only one term. On the left side of our scale, we see three circles. This is a single term: three C, or 3C.",
    monomialExplanation_step_2: "On the right side, we have the number 12. This is also a single term. Because the scales are perfectly balanced, we can see a relationship between them.",
    monomialExplanation_step_3: "The scale is perfectly balanced, illustrating a relationship between the single term on the left and the single term on the right.",
    binomialTitle: "What is a Binomial?",
    binomialExplanation: "A **binomial** is an algebraic expression with **two terms**, joined by an addition or subtraction sign. The prefix **'bi'** means **'two'**, which is why it has two terms.",
    binomialScenario: "",
    binomialExplanation_step_1: "A binomial has two terms. On the left side of our scale, we have two different items: two circles, or 2C, and the number 5. These are two distinct terms.",
    binomialExplanation_step_2: "On the right side, we have the number 25. This is a single term. Since the scales are balanced, we can observe the relationship between the items.",
    binomialExplanation_step_3: "The scale is perfectly balanced, illustrating the relationship between the two terms on the left side and the single term on the right.",
    polynomialTitle: "What is a Polynomial?",
    polynomialExplanation: "A **polynomial** is an algebraic expression that can have one or more terms. The prefix **'poly'** means **'many'**, which is why a polynomial can have many terms. Monomials and binomials are specific types of polynomials.",
    polynomialScenario: "",
    polynomialExplanation_step_1: "A polynomial can have many terms. On the left side, we have a circle, or C, and a triangle, or T. These are two separate variables, and therefore, two terms.",
    polynomialExplanation_step_2: "On the right side, we have the number 15. This is one term. Since the scales are balanced, we can observe the relationship between the items.",
    polynomialExplanation_step_3: "The scale is perfectly balanced, illustrating the relationship between the terms.",
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startLearning: "सीखना शुरू करें",
    reset: "🔄 रीसेट करें",
    welcomeMessage: "इंटरैक्टिव बीजीय संतुलन पैमाने में आपका स्वागत है, एक उपकरण जो आपको बीजीय अवधारणाओं की कल्पना करने में मदद करेगा।",
    tabMonomial: "एकपदीय (Monomial)",
    tabBinomial: "द्विपदीय (Binomial)",
    tabPolynomial: "बहुपदीय (Polynomial)",
    monomialTitle: "एकपदीय (Monomial) क्या है?",
    monomialExplanation: "एक **एकपदीय (monomial)** एक बीजीय व्यंजक है जिसमें केवल **एक पद** होता है। उपसर्ग **'मोनो'** का अर्थ **'एक'** होता है, यही कारण है कि इसमें एक ही पद होता है। इसमें कभी भी जोड़ या घटाव के चिह्न नहीं होते हैं। ",
    monomialScenario: "",
    monomialExplanation_step_1: "एकपदीय में केवल एक पद होता है। पैमाने के बाईं ओर, हमारे पास तीन वृत्त हैं। यह एक एकल पद है: तीन C, या 3C।",
    monomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 12 है। यह भी एक एकल पद है। क्योंकि तराजू पूरी तरह से संतुलित है, हम उनके बीच के संबंध को देख सकते हैं।",
    monomialExplanation_step_3: "यह पैमाना पूरी तरह से संतुलित है, जो बाईं ओर के एकल पद और दाईं ओर के एकल पद के बीच के संबंध को दर्शाता है।",
    binomialTitle: "द्विपदीय (Binomial) क्या है?",
    binomialExplanation: "एक **द्विपदीय (binomial)** एक बीजीय व्यंजक है जिसमें **दो पद** होते हैं, जो जोड़ या घटाव के चिह्न से जुड़े होते हैं। उपसर्ग **'बाय'** का अर्थ **'दो'** होता है, यही कारण है कि इसमें दो पद होते हैं।",
    binomialScenario: "",
    binomialExplanation_step_1: "एक द्विपदीय में दो पद होते हैं। पैमाने के बाईं ओर, हमारे पास दो अलग-अलग वस्तुएं हैं: दो वृत्त, या 2C, और संख्या 5। ये दो अलग-अलग पद हैं।",
    binomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 25 है। यह एक एकल पद है। चूंकि तराजू संतुलित है, हम बाईं ओर और दाईं ओर के बीच के संबंध को देख सकते हैं।",
    binomialExplanation_step_3: "यह पैमाना पूरी तरह से संतुलित है, जो बाईं ओर के दो पदों और दाईं ओर के एकल पद के बीच के संबंध को दर्शाता है।",
    polynomialTitle: "बहुपदीय (Polynomial) क्या है?",
    polynomialExplanation: "एक **बहुपदीय (polynomial)** एक बीजीय व्यंजक है जिसमें एक या एक से अधिक पद हो सकते हैं। उपसर्ग **'पॉली'** का अर्थ **'कई'** होता है, यही कारण है कि एक बहुपदीय में कई पद हो सकते हैं। एकपदीय और द्विपदीय भी बहुपदीय के विशिष्ट प्रकार हैं।",
    polynomialScenario: "",
    polynomialExplanation_step_1: "एक बहुपदीय में कई पद हो सकते हैं। बाईं ओर, हमारे पास एक वृत्त, जिसे हम C कह सकते हैं, और एक त्रिभुज, जिसे हम T कह सकते हैं। ये दो अलग-अलग चर हैं, और इसलिए, दो पद हैं।",
    polynomialExplanation_step_2: "दाईं ओर, हमारे पास संख्या 15 है। यह एक पद है। चूंकि तराजू संतुलित है, हम बाईं ओर और दाईं ओर के बीच के संबंध को देख सकते हैं।",
    polynomialExplanation_step_3: "यह पैमाना पूरी तरह से संतुलित है, जो पदों के बीच के संबंध को दर्शाता है।",
  }
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [mode, setMode] = useState('initial'); // 'initial', 'learn'
  const [activeTab, setActiveTab] = useState('monomial'); // 'monomial', 'binomial', 'polynomial'
  const [userInteraction, setUserInteraction] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);

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
    speechSynthesis.cancel();
    return new Promise((resolve) => {
      const textToSpeak = t(key);
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  }, [currentLanguage, userInteraction, audioEnabled, t]);

  const startLearnSequence = useCallback(async (tabName) => {
    // A single function to manage the voice and highlighting sequence for each tab
    speechSynthesis.cancel();
    setHighlightLeft(false);
    setHighlightRight(false);

    let step1_key = `${tabName}Explanation_step_1`;
    let step2_key = `${tabName}Explanation_step_2`;
    let step3_key = `${tabName}Explanation_step_3`;

    setHighlightLeft(true);
    await speakMessage(step1_key);
    setHighlightLeft(false);

    setHighlightRight(true);
    await speakMessage(step2_key);
    setHighlightRight(false);

    await speakMessage(step3_key);
  }, [speakMessage]);

  const handleStartLearning = () => {
    setUserInteraction(true);
    setMode('learn');
    setActiveTab('monomial');
  };

  const handleReset = () => {
    setMode('initial');
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (mode === 'learn') {
      startLearnSequence(activeTab);
    }
  }, [mode, activeTab, startLearnSequence]);

  const highlightClasses = (isLeft) => {
    if (isLeft && highlightLeft) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    if (!isLeft && highlightRight) {
      return 'ring-4 ring-yellow-400 ring-opacity-75 animate-pulse';
    }
    return '';
  };

  //-------------------
  // Render functions for different content types on the scale
  //-------------------
  const renderScale = (leftContent, rightContent) => (
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
          {leftContent}
        </div>
        {/* Right Pan */}
        <div className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl transition-all duration-700 border-2 sm:border-4 ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}>
          <div className="absolute inset-1 sm:inset-2 rounded-full border-1 sm:border-2 border-white opacity-20"></div>
          {rightContent}
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
  );

  //-------------------
  // Content for the new 'Learn' tabs
  //-------------------
  const MonomialContent = () => {
    const leftContent = (
      <div className="flex flex-row items-center justify-center gap-1 sm:gap-2">
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
      </div>
    );
    const rightContent = (
      <div className="flex items-center justify-center">
        <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>12</span>
      </div>
    );

    return (
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
        <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('monomialTitle')}</h3>
        <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialExplanation')}</p>
        {renderScale(leftContent, rightContent)}
        <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('monomialScenario')}</p>
      </div>
    );
  };

  const BinomialContent = () => {
    const leftContent = (
      <div className="flex flex-col items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">C</div>
        </div>
        <div className="w-6 h-4 sm:w-8 sm:h-6 rounded-sm bg-red-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg mt-1 sm:mt-2">
          5
        </div>
      </div>
    );
    const rightContent = (
      <div className="flex items-center justify-center">
        <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>25</span>
      </div>
    );
    return (
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
        <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('binomialTitle')}</h3>
        <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialExplanation')}</p>
        {renderScale(leftContent, rightContent)}
        <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('binomialScenario')}</p>
      </div>
    );
  };

  const PolynomialContent = () => {
    const leftContent = (
        <div className="flex flex-row items-center justify-center gap-2 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
              C
            </div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <polygon points="50,10 90,90 10,90" fill="#f87171" stroke="#ef4444" strokeWidth="5" />
              <text x="50" y="65" fontSize="30" fontWeight="bold" fill="white" textAnchor="middle" alignmentBaseline="middle">T</text>
            </svg>
        </div>
    );
    const rightContent = (
      <div className="flex items-center justify-center">
        <span className={`text-lg sm:text-xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'}`}>15</span>
      </div>
    );
    return (
      <div className="flex flex-col items-center w-full max-w-sm sm:max-w-2xl text-center">
        <h3 className="text-xl sm:text-3xl font-bold mb-4">{t('polynomialTitle')}</h3>
        <p className={`text-sm sm:text-lg mb-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialExplanation')}</p>
        {renderScale(leftContent, rightContent)}
        <p className={`text-sm sm:text-base mt-2 px-2 sm:px-4 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{t('polynomialScenario')}</p>
      </div>
    );
  };

  const renderContent = () => {
    if (mode === 'initial') {
      return (
        <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className="text-lg sm:text-2xl font-semibold px-2">{t('welcomeMessage')}</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button
               onClick={handleStartLearning}
               className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl"
            >
              {t('startLearning')}
            </button>
          </div>
        </div>
      );
    } else if (mode === 'learn') {
      return (
        <>
          <div className="flex justify-center gap-2 sm:gap-4 mb-4 sm:mb-8 w-full max-w-lg">
            <button
              onClick={() => setActiveTab('monomial')}
              className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'monomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
            >
              {t('tabMonomial')}
            </button>
            <button
              onClick={() => setActiveTab('binomial')}
              className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'binomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
            >
              {t('tabBinomial')}
            </button>
            <button
              onClick={() => setActiveTab('polynomial')}
              className={`flex-1 px-2 py-2 sm:px-4 sm:py-3 rounded-lg font-bold text-sm sm:text-base transition-colors duration-300 ${activeTab === 'polynomial' ? 'bg-blue-600 text-white shadow-lg' : `${theme === 'light' ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}`}
            >
              {t('tabPolynomial')}
            </button>
          </div>
          {activeTab === 'monomial' && <MonomialContent />}
          {activeTab === 'binomial' && <BinomialContent />}
          {activeTab === 'polynomial' && <PolynomialContent />}
        </>
      );
    }
    return null;
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

      {renderContent()}

      {mode !== 'initial' && (
        <button
          onClick={handleReset}
          className={`mt-4 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none text-base sm:text-lg ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-800 hover:bg-gray-100'}`}
        >
          {t('reset')}
        </button>
      )}
    </div>
  );
};

export default App;