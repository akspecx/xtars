// // import React, { useState, useCallback, useEffect, useRef } from 'react';

// // const translations = {
// //   en: {
// //     title: "Unknown or known?",
// //     selectLanguage: "Select Language",
// //     changeTheme: "Change Theme",
// //     reset: "🔄 Reset",
    
// //     // UI labels
// //     equals: "=",
// //     chooseOperation: "Choose an operation:",
// //     leftScale: "Left Scale",
// //     rightScale: "Right Scale",
    
// //     // Path selection
// //     introText: {
// //       text: "The first step to solving an equation with variables on both sides can be confusing. Let's see how two different starting points lead to the same answer, proving the principle of balance holds true regardless of the order.",
// //       voice: "Let's see how two different starting points lead to the same answer.",
// //     },
// //     path1Title: "Method 1: Handle Unknowns First",
// //     path2Title: "Method 2: Handle Knowns First",
// //     path1Button: "Handle Unknowns First",
// //     path2Button: "Handle Knowns First",
// //     finalExplanation: {
// //       text: "As you can see, both methods lead to the same conclusion: **X = 3**. This proves that as long as you perform the same inverse operation on both sides of the equation, the result will always be correct.",
// //       voice: "Both methods lead to the same conclusion: X equals 3. As long as you perform the same inverse operation on both sides, the result will be correct.",
// //     },

// //     // Solving Equations Paths
// //     paths: {
// //       moveXFirst: [
// //         {
// //           step: 1,
// //           equation: "3X + 1 = X + 7",
// //           explanation: "In this method, we will first get all the **apples** (the 'X' terms) to one side. To remove the apple from the right side, we subtract X from both sides. This is the **inverse operation** that keeps the scale balanced.",
// //           voice: "We will first get all the apples on one side. To remove the apple from the right side, we subtract X from both sides.",
// //         },
// //         {
// //           step: 2,
// //           equation: "2X + 1 = 7",
// //           explanation: "Now that we have 2 apples and a 1 gram weight on the left, we need to get the apples by themselves. We will subtract 1 from both sides to remove the number from the left side.",
// //           voice: "To get the apples by themselves, we subtract 1 from both sides.",
// //         },
// //         {
// //           step: 3,
// //           equation: "2X = 6",
// //           explanation: "With 2 apples on one side and 6 grams on the other, we can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
// //           voice: "To find the weight of one apple, we divide both sides by 2.",
// //         },
// //         {
// //           step: 4,
// //           equation: "X = 3",
// //           explanation: "The final result is X = 3. Each apple weighs 3 grams!",
// //           voice: "The final result is X equals 3. Each apple weighs 3 grams!",
// //         }
// //       ],
// //       moveNumbersFirst: [
// //         {
// //           step: 1,
// //           equation: "3X + 1 = X + 7",
// //           explanation: "In this method, we will first get all the **numbers** to one side. To remove the 1 gram weight from the left side, we subtract 1 from both sides. This is the **inverse operation** that keeps the scale balanced.",
// //           voice: "We will first get all the numbers on one side. To remove the 1 gram weight, we subtract 1 from both sides.",
// //         },
// //         {
// //           step: 2,
// //           equation: "3X = X + 6",
// //           explanation: "Now we have 3 apples on the left and 1 apple and 6 grams on the right. To continue isolating the apples, we need to subtract X from both sides.",
// //           voice: "To continue isolating the apples, we subtract X from both sides.",
// //         },
// //         {
// //           step: 3,
// //           equation: "2X = 6",
// //           explanation: "Now we have 2 apples on one side and 6 grams on the other. We can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
// //           voice: "To find the weight of one apple, we divide both sides by 2.",
// //         },
// //         {
// //           step: 4,
// //           equation: "X = 3",
// //           explanation: "The final result is X = 3. Each apple weighs 3 grams!",
// //           voice: "The final result is X equals 3. Each apple weighs 3 grams!",
// //         }
// //       ]
// //     }
// //   },
// //   hi: {
// //     title: "अज्ञात या ज्ञात?",
// //     selectLanguage: "भाषा चुनें",
// //     changeTheme: "थीम बदलें",
// //     reset: "🔄 रीसेट करें",

// //     // UI labels
// //     equals: "बराबर",
// //     chooseOperation: "एक संक्रिया चुनें:",
// //     leftScale: "बायां पैमाना",
// //     rightScale: "दायां पैमाना",
    
// //     // Path selection
// //     introText: {
// //       text: "दोनों पक्षों पर चरों वाले समीकरण को हल करने का पहला कदम भ्रमित करने वाला हो सकता है। आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं, यह साबित करते हुए कि संतुलन का सिद्धांत क्रम की परवाह किए बिना सही है।",
// //       voice: "आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं।",
// //     },
// //     path1Title: "विधि 1: पहले अज्ञात को संभालें",
// //     path2Title: "विधि 2: पहले ज्ञात को संभालें",
// //     path1Button: "अज्ञात से शुरू करें",
// //     path2Button: "ज्ञात से शुरू करें",
// //     finalExplanation: {
// //       text: "जैसा कि आप देख सकते हैं, दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: **X = 3**। यह साबित करता है कि जब तक आप समीकरण के दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, तब तक परिणाम हमेशा सही होगा।",
// //       voice: "दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: X बराबर 3। जब तक आप दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, परिणाम सही होगा।",
// //     },

// //     // Solving Equations Paths
// //     paths: {
// //       moveXFirst: [
// //         {
// //           step: 1,
// //           equation: "3X + 1 = X + 7",
// //           explanation: "इस विधि में, हम पहले सभी **सेबों** (X पदों) को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
// //           voice: "हम पहले सभी सेबों को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं।",
// //         },
// //         {
// //           step: 2,
// //           equation: "2X + 1 = 7",
// //           explanation: "अब जब हमारे पास बाईं ओर 2 सेब और 1 ग्राम का वजन है, तो हमें सेबों को अकेला करना होगा। हम बाईं ओर से संख्या को हटाने के लिए दोनों पक्षों से 1 घटाएंगे।",
// //           voice: "सेबों को अकेला करने के लिए, हम दोनों पक्षों से 1 घटाते हैं।",
// //         },
// //         {
// //           step: 3,
// //           equation: "2X = 6",
// //           explanation: "एक तरफ 2 सेब और दूसरी तरफ 6 ग्राम होने पर, हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
// //           voice: "एक सेब का वजन पता लगाने के लिए, हम दोनों पक्षों को 2 से भाग देते हैं।",
// //         },
// //         {
// //           step: 4,
// //           equation: "X = 3",
// //           explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
// //           voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
// //         }
// //       ],
// //       moveNumbersFirst: [
// //         {
// //           step: 1,
// //           equation: "3X + 1 = X + 7",
// //           explanation: "इस विधि में, हम पहले सभी **संख्याओं** को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
// //           voice: "हम पहले सभी संख्याओं को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं।",
// //         },
// //         {
// //           step: 2,
// //           equation: "3X = X + 6",
// //           explanation: "अब हमारे पास बाईं ओर 3 सेब और दाईं ओर 1 सेब और 6 ग्राम हैं। सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
// //           voice: "सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
// //         },
// //         {
// //           step: 3,
// //           equation: "2X = 6",
// //           explanation: "अब हमारे पास बाईं ओर 2 सेब और दाईं ओर 6 ग्राम हैं। हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
// //           voice: "एक सेब का वजन पता लगाने के लिए, हम दोनों पक्षों को 2 से भाग देते हैं।",
// //         },
// //         {
// //           step: 4,
// //           equation: "X = 3",
// //           explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
// //           voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
// //         }
// //       ]
// //     }
// //   },
// // };

// // const App = () => {
// //   const [currentLanguage, setCurrentLanguage] = useState('en');
// //   const [theme, setTheme] = useState('dark');
// //   const [audioEnabled, setAudioEnabled] = useState(true);
// //   const [leftPanWeight] = useState({ apples: 3, value: 1 });
// //   const [rightPanWeight] = useState({ apples: 1, value: 7 });
// //   const [balanceTilt] = useState(0);

// //   const [selectedPath, setSelectedPath] = useState('moveXFirst');
// //   const [equationStep, setEquationStep] = useState(1);

// //   const t = useCallback((key) => {
// //     const translation = translations[currentLanguage][key];
// //     if (typeof translation === 'object') {
// //       return translation.text;
// //     }
// //     return translation;
// //   }, [currentLanguage]);

// //   const speakMessage = useCallback(async (key, path) => {
// //     if (!audioEnabled) return Promise.resolve();
    
// //     let textToSpeak = '';
// //     if (path) {
// //       const stepObject = translations[currentLanguage].paths[path][key - 1]; // Adjusted to use key as index
// //       textToSpeak = stepObject.voice;
// //     } else if (translations[currentLanguage].hasOwnProperty(key)) {
// //       const translation = translations[currentLanguage][key];
// //       textToSpeak = typeof translation === 'object' ? translation.voice : translation;
// //     }
    
// //     if (!textToSpeak) return Promise.resolve();

// //     return new Promise((resolve) => {
// //       if ('speechSynthesis' in window) {
// //         const utterance = new SpeechSynthesisUtterance(textToSpeak);
// //         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
// //         utterance.rate = 0.8;
// //         speechSynthesis.cancel();
// //         setTimeout(() => {
// //           speechSynthesis.speak(utterance);
// //         }, 100);
// //         utterance.onend = () => resolve();
// //         utterance.onerror = () => resolve();
// //       } else {
// //         resolve();
// //       }
// //     });
// //   }, [currentLanguage, audioEnabled]);

// //   const initialRenderRef = useRef(true);
// //   useEffect(() => {
// //     if (initialRenderRef.current) {
// //       initialRenderRef.current = false;
// //     }
// //     speakMessage('introText');
// //   }, [speakMessage]);

// //   const handleReset = () => {
// //     setEquationStep(1);
// //     speakMessage('introText');
// //   };

// //   const handleSelectPath = (path) => {
// //     setSelectedPath(path);
// //     setEquationStep(1);
// //     speakMessage(1, path); // Speak step 1 message
// //   };

// //   const renderWeights = (apples, value) => {
// //     const appleItems = Array.from({ length: apples }, (_, i) => (
// //       <div key={`apple-${i}`} className="text-4xl leading-none">
// //         🍎
// //       </div>
// //     ));
// //     const valueItem = (
// //       <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
// //         {value} gm
// //       </span>
// //     );
// //     return (
// //       <div className="flex items-center justify-center gap-4">
// //         <div className="flex flex-col items-center justify-center -space-y-2">
// //           {appleItems}
// //         </div>
// //         {valueItem}
// //       </div>
// //     );
// //   };

// //   const renderEquationWithHighlights = (path, step) => {
// //     const baseEquation = translations[currentLanguage].paths[path][step - 1].equation;
// //     const highlightClass = "ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1";

// //     if (path === 'moveXFirst') {
// //       switch(step) {
// //         case 1:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">3X + 1 = <span className={highlightClass}>X</span> + 7</p>;
// //         case 2:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">2X <span className={highlightClass}>+ 1</span> = 7</p>;
// //         case 3:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
// //         case 4:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
// //       }
// //     }
    
// //     if (path === 'moveNumbersFirst') {
// //       switch(step) {
// //         case 1:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">3X <span className={highlightClass}>+ 1</span> = X + 7</p>;
// //         case 2:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">3X = <span className={highlightClass}>X</span> + 6</p>;
// //         case 3:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
// //         case 4:
// //           return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
// //       }
// //     }
// //     return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
// //   };

// //   const renderPathSteps = (path) => {
// //     const steps = translations[currentLanguage].paths[path];
// //     return (
// //       <div className="flex flex-col gap-4 w-full">
// //         {steps.map((stepData, index) => (
// //           <div key={index} 
// //                onClick={() => {
// //                  setEquationStep(stepData.step);
// //                  setSelectedPath(path);
// //                  speakMessage(stepData.step, path);
// //                }}
// //                className={`cursor-pointer flex flex-col items-start p-4 rounded-lg shadow-md transition-colors duration-300 ${
// //             equationStep === stepData.step && selectedPath === path
// //               ? `${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'} ring-4 ring-indigo-500`
// //               : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`
// //             }`}>
// //             <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //               {t('step')} {stepData.step}
// //             </h3>
// //             <div className="font-mono bg-gray-200 dark:bg-gray-800 p-3 rounded-lg w-full mt-2">
// //               {renderEquationWithHighlights(path, stepData.step)}
// //             </div>
// //             <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'} mt-2`}>
// //               {stepData.explanation}
// //             </p>
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
// //       <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //         <div className="flex items-center justify-between mb-4">
// //           <div className="flex items-center gap-2">
// //             <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
// //               {t('selectLanguage')}:
// //             </label>
// //             <select
// //               value={currentLanguage}
// //               onChange={(e) => {
// //                 setCurrentLanguage(e.target.value);
// //                 handleReset();
// //               }}
// //               className={`p-2 border rounded-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
// //             >
// //               <option value="en">English</option>
// //               <option value="hi">हिन्दी</option>
// //             </select>
// //           </div>
// //           <div className="flex gap-2">
// //             <button
// //               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
// //               className={`px-3 py-2 rounded-md font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`}
// //             >
// //               {t('changeTheme')}
// //             </button>
// //             <button
// //               onClick={() => setAudioEnabled(!audioEnabled)}
// //               className={`px-3 py-2 rounded-md font-medium ${audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
// //             >
// //               🔊 {audioEnabled ? 'ON' : 'OFF'}
// //             </button>
// //           </div>
// //         </div>
// //         <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight text-center px-2 transition-colors duration-300 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
// //           {t('title')}
// //         </h2>

// //         <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
// //           <div className="relative w-full h-48 sm:h-64 flex items-end justify-center">
// //             {/* Base */}
// //             <div className={`absolute bottom-0 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
// //             {/* Support */}
// //             <div className={`absolute bottom-4 sm:bottom-8 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
// //             {/* Fulcrum */}
// //             <div className={`absolute bottom-20 sm:bottom-32 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}></div>
// //             {/* Beam and Pans Group */}
// //             <div 
// //               className="absolute bottom-22 sm:bottom-36 w-full max-w-xs sm:max-w-lg transition-all duration-700 ease-in-out"
// //               style={{ transform: `rotate(${balanceTilt}deg)` }}
// //             >
// //               {/* Beam */}
// //               <div className={`w-full h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}></div>
// //               {/* Pans */}
// //               <div className="absolute w-full top-2/3 -translate-y-1/2 flex justify-between px-4 sm:px-8">
// //                 {/* Left Pan */}
// //                 <div 
// //                   className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
// //                   style={{ transform: `rotate(${-balanceTilt}deg)` }}
// //                 >
// //                   <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
// //                     <div className="flex flex-wrap items-center justify-center gap-2" style={{ transform: `rotate(${balanceTilt}deg)` }}>
// //                       {renderWeights(leftPanWeight.apples, leftPanWeight.value)}
// //                     </div>
// //                   </div>
// //                 </div>
// //                 {/* Right Pan */}
// //                 <div 
// //                   className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
// //                   style={{ transform: `rotate(${-balanceTilt}deg)` }}
// //                 >
// //                   <div className="flex flex-col items-center justify-center" >
// //                     <div style={{ transform: `rotate(${balanceTilt}deg)` }}>
// //                       {renderWeights(rightPanWeight.apples, rightPanWeight.value)}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
          
// //           <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// //             <p className={`text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //               {t('introText')}
// //             </p>

// //             <div className="flex flex-col sm:flex-row gap-4">
// //               <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
// //                 <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //                   {t('path1Title')}
// //                 </h3>
// //                 {renderPathSteps('moveXFirst')}
// //               </div>
// //               <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
// //                 <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //                   {t('path2Title')}
// //                 </h3>
// //                 {renderPathSteps('moveNumbersFirst')}
// //               </div>
// //             </div>
// //             <div className="mt-6">
// //               <h3 className={`text-lg font-bold text-center mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //                 {t('solutionFound')}
// //               </h3>
// //               <p className={`text-center font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
// //                 {t('finalExplanation')}
// //               </p>
// //             </div>
// //             <div className="mt-4 flex gap-4 w-full justify-center">
// //               <button
// //                 onClick={handleReset}
// //                 className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
// //               >
// //                 {t('reset')}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;



// import React, { useState, useCallback, useEffect, useRef } from 'react';

// const translations = {
//   en: {
//     title: "Unknown or known?",
//     selectLanguage: "Select Language",
//     changeTheme: "Change Theme",
//     reset: "🔄 Reset",
    
//     // UI labels
//     equals: "=",
//     chooseOperation: "Choose an operation:",
//     leftScale: "Left Scale",
//     rightScale: "Right Scale",
    
//     // Path selection
//     introText: {
//       text: "The first step to solving an equation with variables on both sides can be confusing. Let's see how two different starting points lead to the same answer, proving the principle of balance holds true regardless of the order.",
//       voice: "Let's see how two different starting points lead to the same answer.",
//     },
//     path1Title: "Method 1: Handle Unknowns First",
//     path2Title: "Method 2: Handle Knowns First",
//     path1Button: "Handle Unknowns First",
//     path2Button: "Handle Knowns First",
//     finalExplanation: {
//       text: "As you can see, both methods lead to the same conclusion: **X = 3**. This proves that as long as you perform the same inverse operation on both sides of the equation, the result will always be correct.",
//       voice: "Both methods lead to the same conclusion: X equals 3. As long as you perform the same inverse operation on both sides, the result will be correct.",
//     },

//     // Solving Equations Paths
//     paths: {
//       moveXFirst: [
//         {
//           step: 1,
//           equation: "3X + 1 = X + 7",
//           explanation: "In this method, we will first get all the **apples** (the 'X' terms) to one side. To remove the apple from the right side, we subtract X from both sides. This is the **inverse operation** that keeps the scale balanced.",
//           voice: "We will first get all the apples on one side. To remove the apple from the right side, we subtract X from both sides.",
//         },
//         {
//           step: 2,
//           equation: "2X + 1 = 7",
//           explanation: "Now that we have 2 apples and a 1 gram weight on the left, we need to get the apples by themselves. We will subtract 1 from both sides to remove the number from the left side.",
//           voice: "To get the apples by themselves, we subtract 1 from both sides.",
//         },
//         {
//           step: 3,
//           equation: "2X = 6",
//           explanation: "With 2 apples on one side and 6 grams on the other, we can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
//           voice: "To find the weight of one apple, we divide both sides by 2.",
//         },
//         {
//           step: 4,
//           equation: "X = 3",
//           explanation: "The final result is X = 3. Each apple weighs 3 grams!",
//           voice: "The final result is X equals 3. Each apple weighs 3 grams!",
//         }
//       ],
//       moveNumbersFirst: [
//         {
//           step: 1,
//           equation: "3X + 1 = X + 7",
//           explanation: "In this method, we will first get all the **numbers** to one side. To remove the 1 gram weight from the left side, we subtract 1 from both sides. This is the **inverse operation** that keeps the scale balanced.",
//           voice: "We will first get all the numbers on one side. To remove the 1 gram weight, we subtract 1 from both sides.",
//         },
//         {
//           step: 2,
//           equation: "3X = X + 6",
//           explanation: "Now we have 3 apples on the left and 1 apple and 6 grams on the right. To continue isolating the apples, we need to subtract X from both sides.",
//           voice: "To continue isolating the apples, we subtract X from both sides.",
//         },
//         {
//           step: 3,
//           equation: "2X = 6",
//           explanation: "Now we have 2 apples on one side and 6 grams on the other. We can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
//           voice: "To find the weight of one apple, we divide both sides by 2.",
//         },
//         {
//           step: 4,
//           equation: "X = 3",
//           explanation: "The final result is X = 3. Each apple weighs 3 grams!",
//           voice: "The final result is X equals 3. Each apple weighs 3 grams!",
//         }
//       ]
//     }
//   },
//   hi: {
//     title: "अज्ञात या ज्ञात?",
//     selectLanguage: "भाषा चुनें",
//     changeTheme: "थीम बदलें",
//     reset: "🔄 रीसेट करें",

//     // UI labels
//     equals: "बराबर",
//     chooseOperation: "एक संक्रिया चुनें:",
//     leftScale: "बायां पैमाना",
//     rightScale: "दायां पैमाना",
    
//     // Path selection
//     introText: {
//       text: "दोनों पक्षों पर चरों वाले समीकरण को हल करने का पहला कदम भ्रमित करने वाला हो सकता है। आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं, यह साबित करते हुए कि संतुलन का सिद्धांत क्रम की परवाह किए बिना सही है।",
//       voice: "आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं।",
//     },
//     path1Title: "विधि 1: पहले अज्ञात को संभालें",
//     path2Title: "विधि 2: पहले ज्ञात को संभालें",
//     path1Button: "अज्ञात से शुरू करें",
//     path2Button: "ज्ञात से शुरू करें",
//     finalExplanation: {
//       text: "जैसा कि आप देख सकते हैं, दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: **X = 3**। यह साबित करता है कि जब तक आप समीकरण के दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, तब तक परिणाम हमेशा सही होगा।",
//       voice: "दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: X बराबर 3। जब तक आप दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, परिणाम सही होगा।",
//     },

//     // Solving Equations Paths
//     paths: {
//       moveXFirst: [
//         {
//           step: 1,
//           equation: "3X + 1 = X + 7",
//           explanation: "इस विधि में, हम पहले सभी **सेबों** (X पदों) को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
//           voice: "हम पहले सभी सेबों को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं।",
//         },
//         {
//           step: 2,
//           equation: "2X + 1 = 7",
//           explanation: "अब जब हमारे पास बाईं ओर 2 सेब और 1 ग्राम का वजन है, तो हमें सेबों को अकेला करना होगा। हम बाईं ओर से संख्या को हटाने के लिए दोनों पक्षों से 1 घटाएंगे।",
//           voice: "सेबों को अकेला करने के लिए, हम दोनों पक्षों से 1 घटाते हैं।",
//         },
//         {
//           step: 3,
//           equation: "2X = 6",
//           explanation: "एक तरफ 2 सेब और दूसरी तरफ 6 ग्राम होने पर, हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
//           voice: "एक सेब का वजन पता लगाने के लिए, हम दोनों पक्षों को 2 से भाग देते हैं।",
//         },
//         {
//           step: 4,
//           equation: "X = 3",
//           explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
//           voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
//         }
//       ],
//       moveNumbersFirst: [
//         {
//           step: 1,
//           equation: "3X + 1 = X + 7",
//           explanation: "इस विधि में, हम पहले सभी **संख्याओं** को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
//           voice: "हम पहले सभी संख्याओं को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं।",
//         },
//         {
//           step: 2,
//           equation: "3X = X + 6",
//           explanation: "अब हमारे पास बाईं ओर 3 सेब और दाईं ओर 1 सेब और 6 ग्राम हैं। सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
//           voice: "सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
//         },
//         {
//           step: 3,
//           equation: "2X = 6",
//           explanation: "अब हमारे पास बाईं ओर 2 सेब और दाईं ओर 6 ग्राम हैं। हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
//           voice: "एक सेब का वजन पता लगाने के लिए, हम दोनों पक्षों को 2 से भाग देते हैं।",
//         },
//         {
//           step: 4,
//           equation: "X = 3",
//           explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
//           voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
//         }
//       ]
//     }
//   },
// };

// const App = () => {
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [theme, setTheme] = useState('dark');
//   const [audioEnabled, setAudioEnabled] = useState(true);
//   const [leftPanWeight] = useState({ apples: 3, value: 1 });
//   const [rightPanWeight] = useState({ apples: 1, value: 7 });
//   const [balanceTilt] = useState(0);

//   const [selectedPath, setSelectedPath] = useState('moveXFirst');
//   const [equationStep, setEquationStep] = useState(1);

//   const t = useCallback((key) => {
//     const translation = translations[currentLanguage][key];
//     if (typeof translation === 'object') {
//       return translation.text;
//     }
//     return translation;
//   }, [currentLanguage]);

//   const speakMessage = useCallback(async (key, path) => {
//     if (!audioEnabled) return Promise.resolve();
    
//     let textToSpeak = '';
//     if (path) {
//       const stepObject = translations[currentLanguage].paths[path][key - 1]; // Adjusted to use key as index
//       textToSpeak = stepObject.voice;
//     } else if (translations[currentLanguage].hasOwnProperty(key)) {
//       const translation = translations[currentLanguage][key];
//       textToSpeak = typeof translation === 'object' ? translation.voice : translation;
//     }
    
//     if (!textToSpeak) return Promise.resolve();

//     return new Promise((resolve) => {
//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(textToSpeak);
//         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
//         utterance.rate = 0.8;
//         speechSynthesis.cancel();
//         setTimeout(() => {
//           speechSynthesis.speak(utterance);
//         }, 100);
//         utterance.onend = () => resolve();
//         utterance.onerror = () => resolve();
//       } else {
//         resolve();
//       }
//     });
//   }, [currentLanguage, audioEnabled]);

//   const initialRenderRef = useRef(true);
//   useEffect(() => {
//     if (initialRenderRef.current) {
//       initialRenderRef.current = false;
//     }
//     speakMessage('introText');
//   }, [speakMessage]);

//   const handleReset = () => {
//     setEquationStep(1);
//     speakMessage('introText');
//   };

//   const handleSelectPath = (path) => {
//     setSelectedPath(path);
//     setEquationStep(1);
//     speakMessage(1, path); // Speak step 1 message
//   };

//   const renderWeights = (apples, value) => {
//     const appleItems = Array.from({ length: apples }, (_, i) => (
//       <div key={`apple-${i}`} className="text-4xl leading-none">
//         🍎
//       </div>
//     ));
//     const valueItem = (
//       <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
//         {value} gm
//       </span>
//     );
//     return (
//       <div className="flex items-center justify-center gap-4">
//         <div className="flex flex-col items-center justify-center -space-y-2">
//           {appleItems}
//         </div>
//         {valueItem}
//       </div>
//     );
//   };

//   const renderEquationWithHighlights = (path, step) => {
//     const baseEquation = translations[currentLanguage].paths[path][step - 1].equation;
//     const highlightClass = "ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1";

//     if (path === 'moveXFirst') {
//       switch(step) {
//         case 1:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">3X + 1 = <span className={highlightClass}>X</span> + 7</p>;
//         case 2:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">2X <span className={highlightClass}>+ 1</span> = 7</p>;
//         case 3:
//           return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
//         case 4:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
//       }
//     }
    
//     if (path === 'moveNumbersFirst') {
//       switch(step) {
//         case 1:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">3X <span className={highlightClass}>+ 1</span> = X + 7</p>;
//         case 2:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">3X = <span className={highlightClass}>X</span> + 6</p>;
//         case 3:
//           return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
//         case 4:
//           return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
//       }
//     }
//     return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
//   };

//   const renderPathSteps = (path) => {
//     const steps = translations[currentLanguage].paths[path];
//     return (
//       <div className="flex flex-col gap-4 w-full">
//         {steps.map((stepData, index) => (
//           <div key={index} 
//                onClick={() => {
//                  setEquationStep(stepData.step);
//                  setSelectedPath(path);
//                  speakMessage(stepData.step, path);
//                }}
//                className={`cursor-pointer flex flex-col items-start p-4 rounded-lg shadow-md transition-colors duration-300 ${
//             equationStep === stepData.step && selectedPath === path
//               ? `${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'} ring-4 ring-indigo-500`
//               : `${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-gray-700 hover:bg-gray-600'}`
//             }`}>
//             <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//               {t('step')} {stepData.step}
//             </h3>
//             <div className="font-mono bg-gray-200 dark:bg-gray-800 p-3 rounded-lg w-full mt-2">
//               {renderEquationWithHighlights(path, stepData.step)}
//             </div>
//             <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'} mt-2`}>
//               {stepData.explanation}
//             </p>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className={`min-h-screen flex flex-col items-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`}>
//       <div className={`flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center gap-2">
//             <label className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium`}>
//               {t('selectLanguage')}:
//             </label>
//             <select
//               value={currentLanguage}
//               onChange={(e) => {
//                 setCurrentLanguage(e.target.value);
//                 handleReset();
//               }}
//               className={`p-2 border rounded-md ${theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-700 text-white'}`}
//             >
//               <option value="en">English</option>
//               <option value="hi">हिन्दी</option>
//             </select>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//               className={`px-3 py-2 rounded-md font-medium ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-white'}`}
//             >
//               {t('changeTheme')}
//             </button>
//             <button
//               onClick={() => setAudioEnabled(!audioEnabled)}
//               className={`px-3 py-2 rounded-md font-medium ${audioEnabled ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}`}
//             >
//               🔊 {audioEnabled ? 'ON' : 'OFF'}
//             </button>
//           </div>
//         </div>
//         <h2 className={`text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 tracking-tight text-center px-2 transition-colors duration-300 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//           {t('title')}
//         </h2>

//         <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
//           <div className="relative w-full h-48 sm:h-64 flex items-end justify-center">
//             {/* Base */}
//             <div className={`absolute bottom-0 w-24 sm:w-40 h-4 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
//             {/* Support */}
//             <div className={`absolute bottom-4 sm:bottom-8 w-3 sm:w-6 h-16 sm:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
//             {/* Fulcrum */}
//             <div className={`absolute bottom-20 sm:bottom-32 w-8 sm:w-12 h-8 sm:h-12 rounded-full shadow-xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}></div>
//             {/* Beam and Pans Group */}
//             <div 
//               className="absolute bottom-22 sm:bottom-36 w-full max-w-xs sm:max-w-lg transition-all duration-700 ease-in-out"
//               style={{ transform: `rotate(${balanceTilt}deg)` }}
//             >
//               {/* Beam */}
//               <div className={`w-full h-3 sm:h-5 rounded-full shadow-2xl ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}></div>
//               {/* Pans */}
//               <div className="absolute w-full top-2/3 -translate-y-1/2 flex justify-between px-4 sm:px-8">
//                 {/* Left Pan */}
//                 <div 
//                   className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
//                   style={{ transform: `rotate(${-balanceTilt}deg)` }}
//                 >
//                   <div className="flex flex-col items-center justify-center gap-1 sm:gap-2">
//                     <div className="flex flex-wrap items-center justify-center gap-2" style={{ transform: `rotate(${balanceTilt}deg)` }}>
//                       {renderWeights(leftPanWeight.apples, leftPanWeight.value)}
//                     </div>
//                   </div>
//                 </div>
//                 {/* Right Pan */}
//                 <div 
//                   className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-36 sm:h-36 rounded-full shadow-2xl border-2 sm:border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
//                   style={{ transform: `rotate(${-balanceTilt}deg)` }}
//                 >
//                   <div className="flex flex-col items-center justify-center" >
//                     <div style={{ transform: `rotate(${balanceTilt}deg)` }}>
//                       {renderWeights(rightPanWeight.apples, rightPanWeight.value)}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-2xl ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//             <p className={`text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//               {t('introText')}
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
//                 <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//                   {t('path1Title')}
//                 </h3>
//                 {renderPathSteps('moveXFirst')}
//               </div>
//               <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
//                 <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//                   {t('path2Title')}
//                 </h3>
//                 {renderPathSteps('moveNumbersFirst')}
//               </div>
//             </div>
//             <div className="mt-6">
//               <h3 className={`text-lg font-bold text-center mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//                 {t('solutionFound')}
//               </h3>
//               <p className={`text-center font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
//                 {t('finalExplanation')}
//               </p>
//             </div>
//             <div className="mt-4 flex gap-4 w-full justify-center">
//               <button
//                 onClick={handleReset}
//                 className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
//               >
//                 {t('reset')}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useCallback, useEffect, useRef } from 'react';

const translations = {
  en: {
    title: "Unknown or known?",
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
      text: "The first step to solving an equation with variables on both sides can be confusing. Let's see how two different starting points lead to the same answer, proving the principle of balance holds true regardless of the order.",
      voice: "Let's see how two different starting points lead to the same answer.",
    },
    path1Title: "Method 1: Handle Unknowns First",
    path2Title: "Method 2: Handle Knowns First",
    path1Button: "Handle Unknowns First",
    path2Button: "Handle Knowns First",
    finalExplanation: {
      text: "As you can see, both methods lead to the same conclusion: **X = 3**. This proves that as long as you perform the same inverse operation on both sides of the equation, the result will always be correct.",
      voice: "As you can see, both methods lead to the same conclusion: X equals 3. This proves that as long as you perform the same inverse operation on both sides of the equation, the result will always be correct.",
    },

    // Solving Equations Paths
    paths: {
      moveXFirst: [
        {
          step: 1,
          equation: "3X + 1 = X + 7",
          explanation: "In this method, we will first get all the **apples** (the 'X' terms) to one side. To remove the apple from the right side, we subtract X from both sides. This is the **inverse operation** that keeps the scale balanced.",
          voice: "In this method, we will first get all the apples, the X terms, to one side. To remove the apple from the right side, we subtract X from both sides. This is the inverse operation that keeps the scale balanced.",
        },
        {
          step: 2,
          equation: "2X + 1 = 7",
          explanation: "Now that we have 2 apples and a 1 gram weight on the left, we need to get the apples by themselves. We will subtract 1 from both sides to remove the number from the left side.",
          voice: "Now that we have 2 apples and a 1 gram weight on the left, we need to get the apples by themselves. We will subtract 1 from both sides to remove the number from the left side.",
        },
        {
          step: 3,
          equation: "2X = 6",
          explanation: "With 2 apples on one side and 6 grams on the other, we can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
          voice: "With 2 apples on one side and 6 grams on the other, we can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
        },
        {
          step: 4,
          equation: "X = 3",
          explanation: "The final result is X = 3. Each apple weighs 3 grams!",
          voice: "The final result is X equals 3. Each apple weighs 3 grams!",
        }
      ],
      moveNumbersFirst: [
        {
          step: 1,
          equation: "3X + 1 = X + 7",
          explanation: "In this method, we will first get all the **numbers** to one side. To remove the 1 gram weight from the left side, we subtract 1 from both sides. This is the **inverse operation** that keeps the scale balanced.",
          voice: "In this method, we will first get all the numbers to one side. To remove the 1 gram weight from the left side, we subtract 1 from both sides. This is the inverse operation that keeps the scale balanced.",
        },
        {
          step: 2,
          equation: "3X = X + 6",
          explanation: "Now we have 3 apples on the left and 1 apple and 6 grams on the right. To continue isolating the apples, we need to subtract X from both sides.",
          voice: "Now we have 3 apples on the left and 1 apple and 6 grams on the right. To continue isolating the apples, we need to subtract X from both sides.",
        },
        {
          step: 3,
          equation: "2X = 6",
          explanation: "Now we have 2 apples on one side and 6 grams on the other. We can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
          voice: "Now we have 2 apples on one side and 6 grams on the other. We can find the weight of a single apple by dividing both sides by the number of apples, which is 2.",
        },
        {
          step: 4,
          equation: "X = 3",
          explanation: "The final result is X = 3. Each apple weighs 3 grams!",
          voice: "The final result is X equals 3. Each apple weighs 3 grams!",
        }
      ]
    }
  },
  hi: {
    title: "अज्ञात या ज्ञात?",
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
      text: "दोनों पक्षों पर चरों वाले समीकरण को हल करने का पहला कदम भ्रमित करने वाला हो सकता है। आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं, यह साबित करते हुए कि संतुलन का सिद्धांत क्रम की परवाह किए बिना सही है।",
      voice: "आइए देखें कि दो अलग-अलग शुरुआती बिंदु एक ही उत्तर तक कैसे पहुंचते हैं।",
    },
    path1Title: "विधि 1: पहले अज्ञात को संभालें",
    path2Title: "विधि 2: पहले ज्ञात को संभालें",
    path1Button: "अज्ञात से शुरू करें",
    path2Button: "ज्ञात से शुरू करें",
    finalExplanation: {
      text: "जैसा कि आप देख सकते हैं, दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: **X = 3**। यह साबित करता है कि जब तक आप समीकरण के दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, तब तक परिणाम हमेशा सही होगा।",
      voice: "जैसा कि आप देख सकते हैं, दोनों विधियाँ एक ही निष्कर्ष पर पहुँचती हैं: X बराबर 3। यह साबित करता है कि जब तक आप समीकरण के दोनों पक्षों पर समान व्युत्क्रम संक्रिया करते हैं, तब तक परिणाम हमेशा सही होगा।",
    },

    // Solving Equations Paths
    paths: {
      moveXFirst: [
        {
          step: 1,
          equation: "3X + 1 = X + 7",
          explanation: "इस विधि में, हम पहले सभी **सेबों** (X पदों) को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
          voice: "इस विधि में, हम पहले सभी सेबों, X पदों को एक तरफ लाएंगे। दाईं ओर से सेब को हटाने के लिए, हम दोनों पक्षों से X घटाते हैं। यह एक व्युत्क्रम संक्रिया है जो संतुलन बनाए रखती है।",
        },
        {
          step: 2,
          equation: "2X + 1 = 7",
          explanation: "अब जब हमारे पास बाईं ओर 2 सेब और 1 ग्राम का वजन है, तो हमें सेबों को अकेला करना होगा। हम बाईं ओर से संख्या को हटाने के लिए दोनों पक्षों से 1 घटाएंगे।",
          voice: "अब जब हमारे पास बाईं ओर 2 सेब और 1 ग्राम का वजन है, तो हमें सेबों को अकेला करना होगा। हम बाईं ओर से संख्या को हटाने के लिए दोनों पक्षों से 1 घटाएंगे।",
        },
        {
          step: 3,
          equation: "2X = 6",
          explanation: "एक तरफ 2 सेब और दूसरी तरफ 6 ग्राम होने पर, हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
          voice: "एक तरफ 2 सेब और दूसरी तरफ 6 ग्राम होने पर, हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
        },
        {
          step: 4,
          equation: "X = 3",
          explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
          voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
        }
      ],
      moveNumbersFirst: [
        {
          step: 1,
          equation: "3X + 1 = X + 7",
          explanation: "इस विधि में, हम पहले सभी **संख्याओं** को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं। यह एक **व्युत्क्रम संक्रिया** है जो संतुलन बनाए रखती है।",
          voice: "इस विधि में, हम पहले सभी संख्याओं को एक तरफ लाएंगे। बाईं ओर से 1 ग्राम के वजन को हटाने के लिए, हम दोनों पक्षों से 1 घटाते हैं। यह एक व्युत्क्रम संक्रिया है जो संतुलन बनाए रखती है।",
        },
        {
          step: 2,
          equation: "3X = X + 6",
          explanation: "अब हमारे पास बाईं ओर 3 सेब और दाईं ओर 1 सेब और 6 ग्राम हैं। सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
          voice: "अब हमारे पास बाईं ओर 3 सेब और दाईं ओर 1 सेब और 6 ग्राम हैं। सेबों को अकेला करने के लिए, हमें दोनों पक्षों से X घटाना होगा।",
        },
        {
          step: 3,
          equation: "2X = 6",
          explanation: "अब हमारे पास बाईं ओर 2 सेब और दाईं ओर 6 ग्राम हैं। हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
          voice: "अब हमारे पास बाईं ओर 2 सेब और दाईं ओर 6 ग्राम हैं। हम दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देकर एक सेब का वजन पता लगा सकते हैं।",
        },
        {
          step: 4,
          equation: "X = 3",
          explanation: "अंतिम परिणाम X = 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
          voice: "अंतिम परिणाम X बराबर 3 है। प्रत्येक सेब का वजन 3 ग्राम है!",
        }
      ]
    }
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [leftPanWeight] = useState({ apples: 3, value: 1 });
  const [rightPanWeight] = useState({ apples: 1, value: 7 });
  const [balanceTilt] = useState(0);

  const [selectedPath, setSelectedPath] = useState('moveXFirst');
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
      const stepObject = translations[currentLanguage].paths[path][key - 1]; // Adjusted to use key as index
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

  const handleSelectPath = (path) => {
    setSelectedPath(path);
    setEquationStep(1);
    speakMessage(1, path); // Speak step 1 message
  };

  const renderWeights = (apples, value) => {
    const appleItems = Array.from({ length: apples }, (_, i) => (
      <div key={`apple-${i}`} className="text-4xl leading-none">
        🍎
      </div>
    ));
    const valueItem = (
      <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
        {value} gm
      </span>
    );
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center justify-center -space-y-2">
          {appleItems}
        </div>
        {valueItem}
      </div>
    );
  };

  const renderEquationWithHighlights = (path, step) => {
    const baseEquation = translations[currentLanguage].paths[path][step - 1].equation;
    const highlightClass = "ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1";

    if (path === 'moveXFirst') {
      switch(step) {
        case 1:
          return <p className="font-mono text-gray-800 dark:text-gray-200">3X + 1 = <span className={highlightClass}>X</span> + 7</p>;
        case 2:
          return <p className="font-mono text-gray-800 dark:text-gray-200">2X <span className={highlightClass}>+ 1</span> = 7</p>;
        case 3:
          return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
        case 4:
          return <p className="font-mono text-gray-800 dark:text-gray-200">{baseEquation}</p>;
      }
    }
    
    if (path === 'moveNumbersFirst') {
      switch(step) {
        case 1:
          return <p className="font-mono text-gray-800 dark:text-gray-200">3X <span className={highlightClass}>+ 1</span> = X + 7</p>;
        case 2:
          return <p className="font-mono text-gray-800 dark:text-gray-200">3X = <span className={highlightClass}>X</span> + 6</p>;
        case 3:
          return <p className="font-mono text-gray-800 dark:text-gray-200"><span className={highlightClass}>2X</span> = <span className={highlightClass}>6</span></p>;
        case 4:
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
                 setSelectedPath(path);
                 speakMessage(stepData.step, path);
               }}
               className={`cursor-pointer flex flex-col items-start p-4 rounded-lg shadow-md transition-colors duration-300 ${
            equationStep === stepData.step && selectedPath === path
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

            <div className="flex flex-col sm:flex-row gap-4">
              <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                  {t('path1Title')}
                </h3>
                {renderPathSteps('moveXFirst')}
              </div>
              <div className={`flex-1 p-4 rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                <h3 className={`text-lg font-bold text-center mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                  {t('path2Title')}
                </h3>
                {renderPathSteps('moveNumbersFirst')}
              </div>
            </div>
            <div className="mt-6">
              <h3 className={`text-lg font-bold text-center mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                {t('solutionFound')}
              </h3>
              <p className={`text-center font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                {t('finalExplanation')}
              </p>
            </div>
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