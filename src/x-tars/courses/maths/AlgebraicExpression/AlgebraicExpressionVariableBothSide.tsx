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

    // Solving Equations Module
    solveEquationIntro: {
      text: "Now that you understand the principle of balance, let's use it to solve an equation. On the left side, we have three apples and a 1 gram weight. On the right, we have one apple and a 7 gram weight. The scale is balanced.",
      voice: "Now that you understand the principle of balance, let's solve an equation. The scale is balanced.",
    },
    equationSteps: [
      {
        step: 1,
        equation: "3X + 1 = X + 7",
        explanation: "The equation, '3 * weight of one apple + 1 gm = weight of one apple + 7 gm', represents our balanced scale in math form. We use X to represent the unknown weight of each apple. This is written as 3X + 1 = X + 7.",
        voice: "The equation, 3X plus 1 equals X plus 7, represents our balanced scale in math form."
      },
      {
        step: 2,
        equation: "3X - X + 1 = X - X + 7",
        explanation: "Our goal is to get all the apples by themselves on one side. We can do this by removing one apple from each side. We subtract X from both sides of the equation. This is a crucial step because whatever we do to one side, we must do to the other to keep the equation balanced.",
        voice: "Our goal is to get all the apples on one side. To do this, we subtract X from both sides."
      },
      {
        step: 3,
        equation: "2X + 1 = 7",
        explanation: "After removing one apple from each side, the equation becomes 2X + 1 = 7. We now have two apples and a 1 gram weight on the left, and a total weight of 7 grams on the right.",
        voice: "After removing one apple from each side, the equation becomes 2X plus 1 equals 7. This is much simpler."
      },
      {
        step: 4,
        equation: "2X + 1 - 1 = 7 - 1",
        explanation: "Now, to get the apples completely by themselves, we need to remove the 1 gm weight. We do this by subtracting 1 from both sides of the equation. This is the same principle of balance we learned earlier.",
        voice: "Now we need to remove the 1 gram weight. We do this by subtracting 1 from both sides of the equation."
      },
      {
        step: 5,
        equation: "2X = 6",
        explanation: "After subtracting 1 from both sides, the equation becomes 2X = 6. We now have two apples on the left, and a total weight of 6 grams on the right.",
        voice: "After subtracting 1 from both sides, the equation becomes 2X equals 6."
      },
      {
        step: 6,
        equation: "2X / 2 = 6 / 2",
        explanation: "Now we have 2 apples that equal 6 grams. To find the weight of a single apple, we need to get rid of the '2' (the coefficient). We do this by dividing both sides by 2. This makes the coefficient of X equal to 1.",
        voice: "Now we have 2 apples that equal 6 grams. To find the weight of a single apple, we divide both sides by 2."
      },
      {
        step: 7,
        equation: "X = 3",
        explanation: "By dividing both sides by 2, we get our final answer: X = 3. This means each apple weighs 3 grams!",
        voice: "By dividing both sides by 2, we get X equals 3. This means each apple weighs 3 grams!"
      }
    ],
    continue: "Continue",
    solve: "Solve",
    step: "Step",
    equation: "Equation",
    explanation: "Explanation",
    solutionFound: "🎉 Solution Found!",
    answer: "Answer",
    verifyAnswer: "Let's verify our answer:",
    originalEquation: "Original equation:",
    substitute: "Substitute X = 3:",
    calculate: "Calculate:",
    perfect: "✅ Perfect! Each apple weighs exactly 3 grams!",
    finalVerification: {
      text: "Now let's verify our answer. Since we found that each apple weighs 3 grams, the left side of the scale is 3 times 3 plus 1, which equals 10. The right side is 1 times 3 plus 7, which also equals 10. Both sides are equal, so the scale remains balanced!",
      voice: "Now let's verify our answer. The left side is 3 times 3 plus 1, which equals 10. The right side is 1 times 3 plus 7, which also equals 10. Both sides are equal, and the scale is balanced.",
    }
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
      voice: "एक संतुलित पैमाना दिखाता है कि दोनों पक्ष बराबर हैं।",
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
      voice: "एक ही क्रिया करने से पैमाना संतुलित रहता है।",
    },
    unbalanced_explanation: {
      text: "पैमाना झुका हुआ है! ऐसा इसलिए है क्योंकि हमने प्रत्येक पक्ष पर एक अलग क्रिया की है। चूंकि हमारा लक्ष्य इसे संतुलित रखना है, इसलिए हम हमेशा दोनों पक्षों पर एक ही संक्रिया करते हैं।",
      voice: "पैमाना झुका हुआ है। दोनों पक्षों पर हमेशा एक ही संक्रिया करें।",
    },
    goBack: "मूल स्थिति पर वापस जाएं",

    // UI labels
    applyOperation: "लागू करें",
    enterValue: "एक मान दर्ज करें",
    value: "मान:",
    equals: "बराबर",
    chooseOperation: "एक संक्रिया चुनें:",
    leftScale: "बायां पैमाना",
    rightScale: "दायां पैमाना",

    // Solving Equations Module
    solveEquationIntro: {
      text: "अब जब आप संतुलन के सिद्धांत को समझ गए हैं, तो आइए इसका उपयोग एक समीकरण को हल करने के लिए करें। बाईं ओर, हमारे पास तीन सेब और 1 ग्राम का वजन है। दाईं ओर, हमारे पास एक सेब और 7 ग्राम का वजन है। पैमाना संतुलित है।",
      voice: "अब जब आप संतुलन के सिद्धांत को समझ गए हैं, तो आइए एक समीकरण को हल करें। पैमाना संतुलित है।",
    },
    equationSteps: [
      {
        step: 1,
        equation: "3X + 1 = X + 7",
        explanation: "समीकरण, '3 * एक सेब का वजन + 1 ग्राम बराबर 1 सेब का वजन + 7 ग्राम', गणितीय रूप में हमारे संतुलित पैमाने को दर्शाता है। हम प्रत्येक सेब के अज्ञात वजन को दर्शाने के लिए X का उपयोग करते हैं। इसे 3X + 1 = X + 7 के रूप में लिखा जाता है।",
        voice: "समीकरण 3X प्लस 1 बराबर X प्लस 7, गणितीय रूप में हमारे संतुलित पैमाने को दर्शाता है।"
      },
      {
        step: 2,
        equation: "3X - X + 1 = X - X + 7",
        explanation: "हमारा लक्ष्य सभी सेबों को एक तरफ अकेले रखना है। हम दोनों पक्षों से एक सेब को हटाकर ऐसा कर सकते हैं। हम समीकरण के दोनों पक्षों से X को घटाते हैं। यह एक महत्वपूर्ण कदम है क्योंकि हम एक तरफ जो कुछ भी करते हैं, उसे समीकरण को संतुलित रखने के लिए दूसरी तरफ भी करना चाहिए।",
        voice: "हमारा लक्ष्य सभी सेबों को एक तरफ रखना है। ऐसा करने के लिए, हम दोनों पक्षों से X को घटाते हैं।"
      },
      {
        step: 3,
        equation: "2X + 1 = 7",
        explanation: "दोनों पक्षों से एक सेब हटाने के बाद, समीकरण 2X + 1 = 7 हो जाता है। अब हमारे पास बाईं ओर दो सेब और एक 1 ग्राम का वजन है, और दाईं ओर कुल 7 ग्राम का वजन है।",
        voice: "दोनों पक्षों से एक सेब हटाने के बाद, समीकरण 2X प्लस 1 बराबर 7 हो जाता है। यह बहुत सरल है।"
      },
      {
        step: 4,
        equation: "2X + 1 - 1 = 7 - 1",
        explanation: "अब, सेब को पूरी तरह से अकेले रखने के लिए, हमें 1 ग्राम वजन को हटाना होगा। हम समीकरण के दोनों पक्षों से 1 घटाकर ऐसा करते हैं। यह वही संतुलन का सिद्धांत है जो हमने पहले सीखा था।",
        voice: "अब हमें 1 ग्राम वजन को हटाना होगा। हम समीकरण के दोनों पक्षों से 1 घटाकर ऐसा करते हैं।"
      },
      {
        step: 5,
        equation: "2X = 6",
        explanation: "दोनों पक्षों से 1 घटाने के बाद, समीकरण 2X = 6 हो जाता है। अब हमारे पास बाईं ओर दो सेब और दाईं ओर कुल 6 ग्राम का वजन है।",
        voice: "दोनों पक्षों से 1 घटाने के बाद, समीकरण 2X बराबर 6 हो जाता है।"
      },
      {
        step: 6,
        equation: "2X / 2 = 6 / 2",
        explanation: "अब हमारे पास 2 सेब हैं जिनका वजन 6 ग्राम है। एक सेब का वजन पता लगाने के लिए, हमें दोनों पक्षों को सेब की संख्या, जो कि 2 है, से भाग देना होगा। इससे X का गुणांक 1 हो जाएगा।",
        voice: "अब हमारे पास 2 सेब हैं जिनका वजन 6 ग्राम है। एक सेब का वजन पता लगाने के लिए, हम दोनों पक्षों को 2 से भाग देते हैं।"
      },
      {
        step: 7,
        equation: "X = 3",
        explanation: "दोनों पक्षों को 2 से भाग देने पर, हमें हमारा अंतिम उत्तर मिलता है: X = 3। इसका मतलब है कि प्रत्येक सेब का वजन 3 ग्राम है!",
        voice: "दोनों पक्षों को 2 से भाग देने पर, हमें X बराबर 3 मिलता है। इसका मतलब है कि प्रत्येक सेब का वजन 3 ग्राम है!"
      }
    ],
    continue: "जारी रखें",
    solve: "हल करें",
    step: "चरण",
    equation: "समीकरण",
    explanation: "स्पष्टीकरण",
    solutionFound: "🎉 समाधान मिला!",
    answer: "उत्तर",
    verifyAnswer: "आइए अपने उत्तर की जाँच करें:",
    originalEquation: "मूल समीकरण:",
    substitute: "X = 3 रखें:",
    calculate: "गणना करें:",
    perfect: "✅ बिलकुल सही! प्रत्येक सेब का वजन ठीक 3 ग्राम है!",
    finalVerification: {
      text: "अब आइए अपने उत्तर को सत्यापित करें। चूंकि हमें पता चला कि प्रत्येक सेब का वजन 3 ग्राम है, तो पैमाने का बायां पक्ष 3 गुना 3 प्लस 1 है, जो 10 के बराबर है। दायां पक्ष 1 गुना 3 प्लस 7 है, जो भी 10 के बराबर है। दोनों पक्ष बराबर हैं, इसलिए पैमाना संतुलित रहता है!",
      voice: "अब आइए अपने उत्तर को सत्यापित करें। दोनों पक्ष 10 के बराबर हैं, इसलिए पैमाना संतुलित है।",
    }
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [userInteraction, setUserInteraction] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [leftPanWeight, setLeftPanWeight] = useState({ apples: 3, value: 1 });
  const [rightPanWeight, setRightPanWeight] = useState({ apples: 1, value: 7 });
  const [balanceTilt, setBalanceTilt] = useState(0);

  const [equationMode, setEquationMode] = useState(true);
  const [equationStep, setEquationStep] = useState(0);

  const t = useCallback((key) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();
    
    let textToSpeak = '';
    if (translations[currentLanguage].hasOwnProperty(key)) {
      const translation = translations[currentLanguage][key];
      textToSpeak = typeof translation === 'object' ? translation.voice : translation;
    } else if (key.startsWith('equationSteps')) {
      const parts = key.split('[');
      const stepIndex = parseInt(parts[1].replace(']', ''), 10);
      const stepObject = translations[currentLanguage].equationSteps[stepIndex];
      textToSpeak = stepObject.voice;
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
  }, [currentLanguage, userInteraction, audioEnabled]);

  useEffect(() => {
    if (equationMode && equationStep > 0 && equationStep <= translations[currentLanguage].equationSteps.length) {
      speakMessage(`equationSteps[${equationStep - 1}]`);
    } else if (equationMode && equationStep === 0) {
      speakMessage('solveEquationIntro');
    } else if (equationMode && equationStep > translations[currentLanguage].equationSteps.length) {
      speakMessage('finalVerification');
    }
  }, [equationStep, equationMode, speakMessage, currentLanguage]);


  const handleStartSolving = () => {
    setEquationMode(true);
    setLeftPanWeight({ apples: 3, value: 1 });
    setRightPanWeight({ apples: 1, value: 7 });
    setBalanceTilt(0);
    setEquationStep(1);
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setLeftPanWeight({ apples: 3, value: 1 });
    setRightPanWeight({ apples: 1, value: 7 });
    setBalanceTilt(0);
    setEquationMode(true);
    setEquationStep(0);
  };

  const handleGoBack = () => {
    setLeftPanWeight({ apples: 3, value: 1 });
    setRightPanWeight({ apples: 1, value: 7 });
    setBalanceTilt(0);
    setEquationStep(0);
    setEquationMode(true);
  };

  const handleEquationStep = (step) => {
    speechSynthesis.cancel();
    setEquationStep(step);
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

  const renderEquationTextWithHighlight = (equation, step) => {
    switch (step) {
      case 2:
        return (
          <p className="font-mono text-gray-800 dark:text-gray-200">
            3X <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1"> - X</span> + 1 = X <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1"> - X</span> + 7
          </p>
        );
      case 4:
        return (
          <p className="font-mono text-gray-800 dark:text-gray-200">
            2X + <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">1</span> - 1 = 7 - <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">1</span>
          </p>
        );
      case 6:
        return (
          <p className="font-mono text-gray-800 dark:text-gray-200">
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>X / <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span> = 6 / <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">2</span>
          </p>
        );
      default:
        return <p className="font-mono text-gray-800 dark:text-gray-200">{equation}</p>;
    }
  };

  const renderCurrentStepContent = () => {
    if (equationStep === 0) {
      return <p className={`font-semibold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('solveEquationIntro')}</p>;
    }
    if (equationStep > 0 && equationStep <= translations[currentLanguage].equationSteps.length) {
      const stepData = translations[currentLanguage].equationSteps[equationStep - 1];
      return (
        <div className="flex flex-col items-start gap-4">
          <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('step')} {stepData.step}</h3>
          <div className="font-mono bg-gray-100 dark:bg-gray-700 p-3 rounded-lg w-full">
            {renderEquationTextWithHighlight(stepData.equation, stepData.step)}
          </div>
          <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{stepData.explanation}</p>
        </div>
      );
    }
    if (equationStep > translations[currentLanguage].equationSteps.length) {
      return renderVerification();
    }
    return null;
  };

  const renderVerification = () => {
    return (
      <div className={`mt-6 p-4 rounded-lg shadow-inner ${theme === 'light' ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-800 text-gray-200'}`}>
        <h3 className="font-bold text-lg mb-2">{t('verifyAnswer')}</h3>
        <p className="font-mono">{t('originalEquation')} <span className="text-yellow-400 font-bold">3X + 1 = X + 7</span></p>
        <p className="font-mono">{t('substitute')} <span className="text-yellow-400 font-bold">3(3) + 1 = 3 + 7</span></p>
        <p className="font-mono">{t('calculate')} <span className="text-yellow-400 font-bold">9 + 1 = 10</span> ✅</p>
        <p className="font-mono"><span className="text-yellow-400 font-bold">10 = 10</span></p>
        <p className="mt-4 text-center font-bold text-green-500 text-xl">{t('perfect')}</p>
      </div>
    );
  };

  const totalSteps = translations[currentLanguage].equationSteps.length;
  const currentStep = equationStep > 0 ? equationStep : 0;

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
          
          <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            {/* Tab-based navigation for steps */}
            <div className="w-full flex justify-center mb-4">
              <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
                {translations[currentLanguage].equationSteps.map((step, index) => (
                  <button
                    key={index}
                    onClick={() => handleEquationStep(step.step)}
                    className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                      equationStep === step.step
                        ? 'bg-blue-600 text-white'
                        : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                    }`}
                  >
                    {t('step')} {step.step}
                  </button>
                ))}
                <button
                  onClick={() => handleEquationStep(totalSteps + 1)}
                  className={`px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                    equationStep === totalSteps + 1
                      ? 'bg-blue-600 text-white'
                      : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                  }`}
                >
                  {t('verifyAnswer')}
                </button>
              </div>
            </div>

            {/* Content for the current step */}
            <div className={`flex flex-col items-start w-full min-h-[150px] p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
              {renderCurrentStepContent()}
            </div>

            {equationStep < totalSteps + 1 && (
              <button
                onClick={() => handleEquationStep(equationStep + 1)}
                className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4"
              >
                {t('continue')}
              </button>
            )}

            <div className="mt-4 flex gap-4 w-full justify-center">
              {equationMode && equationStep >= totalSteps + 1 && (
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
    </div>
  );
};

export default App;