import React, { useState, useCallback, useEffect, useRef } from 'react';

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
    findOrangeWeight: "What is the weight of one orange?",
    submit: "✅ Submit",
    retry: "🔄 Retry",
    viewExplanation: "🤔 View Explanation",
    correctAnswer: "🎉 Correct! The weight of one orange is 4 grams!",
    incorrectAnswer: "❌ Incorrect. Please try again.",

    // Solving Equations Module
    solveEquationIntro: {
      text: "Now that you understand the principle of balance, let's use it to solve an equation. On the left side, we have three oranges and a 7 gram weight. On the right, we have a 19 gram weight. The scale is balanced.",
      voice: "Now that you understand the principle of balance, let's solve an equation. The scale is balanced.",
    },
    equationSteps: [
      {
        step: 1,
        equation: "3X + 7 = 19",
        explanation: "The equation '3 * weight of one orange + 7 = 19' shows our balanced scale in math form. We use X to represent the unknown weight of each orange, so we can write it as 3X + 7 = 19.",
        voice: "The equation 3 times weight of one orange, plus 7, equals 19. We use X to represent the unknown weight of each orange, so we can write it as 3X plus 7 equals 19."
      },
      {
        step: 2,
        equation: "3X + 7 - 7 = 19 - 7",
        explanation: "Our goal is to get the oranges by themselves on one side. To do this, we need to remove the '+7 gm' weight. We do this by subtracting 7 from both sides of the equation. This is a crucial step because whatever we do to one side, we must do to the other to keep the equation balanced.",
        voice: "Our goal is to get the oranges by themselves on one side. To do this, we need to remove the '+7 gm' weight. We do this by subtracting 7 from both sides of the equation. This is a crucial step because whatever we do to one side, we must do to the other to keep the equation balanced."
      },
      {
        step: 3,
        equation: "3X = 12",
        explanation: "After subtracting 7 from both sides, the equation becomes 3X = 12. We now have 3 oranges on the left, and a total weight of 12 grams on the right.",
        voice: "After subtracting 7 from both sides, the equation becomes 3X equals 12. We now have 3 oranges on the left, and a total weight of 12 grams on the right."
      },
      {
        step: 4,
        equation: "3X / 3 = 12 / 3",
        explanation: "Now we have 3 oranges that equal 12 grams. To find the weight of a single orange, we need to get rid of the '3' (the coefficient). We do this by dividing both sides by the number of oranges, which is 3. This makes the coefficient of X equal to 1.",
        voice: "Now we have 3 oranges that equal 12 grams. To find the weight of a single orange, we need to get rid of the '3' (the coefficient). We do this by dividing both sides by the number of oranges, which is 3. This makes the coefficient of X equal to 1.",
      },
      {
        step: 5,
        equation: "X = 4",
        explanation: "By dividing both sides by 3, we get our final answer: X = 4. This means each orange weighs 4 grams!",
        voice: "By dividing both sides by 3, we get X equals 4. This means each orange weighs 4 grams!"
      },
      {
        step: 6,
        equation: "Final Verification",
        explanation: "Now let's verify our answer. Since we found that each orange weighs 4 grams, the left side of the scale is 3 times 4 plus 7, which equals 19. This is the same as the right side, so the scale remains balanced!",
        voice: "Now let's verify our answer. The left side is 3 times 4 plus 7, which equals 19. This is the same as the right side, so the scale is balanced.",
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
    substitute: "Substitute X = 4:",
    calculate: "Calculate:",
    perfect: "✅ Perfect! Each orange weighs exactly 4 grams!",
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
    equals: "बराबर",
    chooseOperation: "एक संक्रिया चुनें:",
    leftScale: "बायां पैमाना",
    rightScale: "दायां पैमाना",
    findOrangeWeight: "एक संतरे का वजन कितना है?",
    submit: "✅ सबमिट करें",
    retry: "🔄 पुनः प्रयास करें",
    viewExplanation: "🤔 स्पष्टीकरण देखें",
    correctAnswer: "🎉 सही! एक संतरे का वजन 4 ग्राम है!",
    incorrectAnswer: "❌ गलत। कृपया पुनः प्रयास करें।",

    // Solving Equations Module
    solveEquationIntro: {
      text: "अब जब आप संतुलन के सिद्धांत को समझ गए हैं, तो आइए इसका उपयोग एक समीकरण को हल करने के लिए करें। बाईं ओर, हमारे पास तीन संतरे और 7 ग्राम का वजन है। दाईं ओर, हमारे पास 19 ग्राम का वजन है। पैमाना संतुलित है।",
      voice: "अब जब आप संतुलन के सिद्धांत को समझ गए हैं, तो आइए एक समीकरण को हल करें। पैमाना संतुलित है।",
    },
    equationSteps: [
      {
        step: 1,
        equation: "3X + 7 = 19",
        explanation: "समीकरण '3 * एक संतरे का वजन + 7 = 19' गणितीय रूप में हमारे संतुलित पैमाने को दर्शाता है। हम प्रत्येक संतरे के अज्ञात वजन को दर्शाने के लिए X का उपयोग करते हैं, इसलिए हम इसे 3X + 7 = 19 के रूप में लिख सकते हैं।",
        voice: "समीकरण '3 * एक संतरे का वजन + 7 = 19' गणितीय रूप में हमारे संतुलित पैमाने को दर्शाता है। हम प्रत्येक संतरे के अज्ञात वजन को दर्शाने के लिए X का उपयोग करते हैं, इसलिए हम इसे 3X + 7 = 19 के रूप में लिख सकते हैं।"
      },
      {
        step: 2,
        equation: "3X + 7 - 7 = 19 - 7",
        explanation: "हमारा लक्ष्य एक तरफ संतरे को अकेले रखना है। ऐसा करने के लिए, हमें +7 ग्राम वजन को हटाना होगा। हम समीकरण के दोनों पक्षों में 7 घटाकर ऐसा करते हैं। यह एक महत्वपूर्ण कदम है क्योंकि हम एक तरफ जो कुछ भी करते हैं, उसे समीकरण को संतुलित रखने के लिए दूसरी तरफ भी करना चाहिए।",
        voice: "हमारा लक्ष्य संतरे को अकेले रखना है। हम समीकरण को संतुलित रखने के लिए दोनों पक्षों में 7 घटाते हैं।"
      },
      {
        step: 3,
        equation: "3X = 12",
        explanation: "दोनों पक्षों से 7 घटाने के बाद, समीकरण 3X = 12 हो जाता है। अब हमारे पास बाईं ओर 3 संतरे और दाईं ओर कुल 12 ग्राम वजन है।",
        voice: "दोनों पक्षों से 7 घटाने के बाद, समीकरण 3X बराबर 12 हो जाता है। यह सरल है।"
      },
      {
        step: 4,
        equation: "3X / 3 = 12 / 3",
        explanation: "अब हमारे पास 3 संतरे हैं जिनका वजन 12 ग्राम है। एक संतरे का वजन पता लगाने के लिए, हमें दोनों पक्षों को संतरे की संख्या, जो कि 3 है, से भाग देना होगा। इससे X का गुणांक 1 हो जाएगा।",
        voice: "अब हमारे पास 3 संतरे हैं जिनका वजन 12 ग्राम है। एक संतरे का वजन पता लगाने के लिए, हम दोनों पक्षों को 3 से भाग देते हैं।"
      },
      {
        step: 5,
        equation: "X = 4",
        explanation: "दोनों पक्षों को 3 से भाग देने पर, हमें हमारा अंतिम उत्तर मिलता है: X = 4। इसका मतलब है कि प्रत्येक संतरे का वजन 4 ग्राम है!",
        voice: "दोनों पक्षों को 3 से भाग देने पर, हमें X बराबर 4 मिलता है। इसका मतलब है कि प्रत्येक संतरे का वजन 4 ग्राम है!"
      },
      {
        step: 6,
        equation: "Final Verification",
        explanation: "अब आइए अपने उत्तर को सत्यापित करें। चूंकि हमें पता चला कि प्रत्येक संतरे का वजन 4 ग्राम है, तो पैमाने का बायां पक्ष 3 गुना 4 प्लस 7 है, जो 19 के बराबर है। यह दाईं ओर के वजन के समान है, इसलिए पैमाना संतुलित रहता है!",
        voice: "अब आइए अपने उत्तर को सत्यापित करें। बायां पक्ष 3 गुना 4 प्लस 7 है, जो 19 के बराबर है। यह दाईं ओर के वजन के समान है, इसलिए पैमाना संतुलित है।",
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
    substitute: "X = 4 रखें:",
    calculate: "गणना करें:",
    perfect: "✅ बिलकुल सही! प्रत्येक संतरे का वजन ठीक 4 ग्राम है!",
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [userInteraction, setUserInteraction] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mode, setMode] = useState('initial'); // 'initial', 'practice' or 'solve'

  const [leftPanWeight, setLeftPanWeight] = useState({ oranges: 3, value: 7 });
  const [rightPanWeight, setRightPanWeight] = useState(19);
  const [balanceTilt, setBalanceTilt] = useState(0);

  const [equationStep, setEquationStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const t = useCallback((key, voice = false) => {
    const translation = translations[currentLanguage][key];
    if (typeof translation === 'object') {
      return voice ? translation.voice : translation.text;
    }
    return translation;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key) => {
    if (!userInteraction || !audioEnabled) return Promise.resolve();
    
    let textToSpeak = '';
    const translation = translations[currentLanguage][key];
    textToSpeak = translation ? (typeof translation === 'object' ? translation.voice : translation) : key;
    
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
    if (mode === 'solve' && equationStep > 0 && equationStep <= translations[currentLanguage].equationSteps.length) {
      speakMessage(translations[currentLanguage].equationSteps[equationStep - 1].voice);
    } else if (mode === 'solve' && equationStep === 0) {
      speakMessage('solveEquationIntro');
    } else if (mode === 'solve' && equationStep > translations[currentLanguage].equationSteps.length) {
      speakMessage(translations[currentLanguage].equationSteps[translations[currentLanguage].equationSteps.length - 1].voice);
    } else if (mode === 'practice' && !isCorrect && !showExplanation) {
      speakMessage(t('findOrangeWeight'));
    }
  }, [equationStep, mode, speakMessage, currentLanguage, isCorrect, showExplanation]);

  const handleStartSolving = () => {
    setMode('solve');
    setLeftPanWeight({ oranges: 3, value: 7 });
    setRightPanWeight(19);
    setBalanceTilt(0);
    setEquationStep(1);
    setShowExplanation(false);
  };
  
  const handleStartPractice = () => {
    setMode('practice');
    setLeftPanWeight({ oranges: 3, value: 7 });
    setRightPanWeight(19);
    setBalanceTilt(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    speakMessage(t('findOrangeWeight'));
  };

  const handleReset = () => {
    speechSynthesis.cancel();
    setLeftPanWeight({ oranges: 3, value: 7 });
    setRightPanWeight(19);
    setBalanceTilt(0);
    setMode('initial');
    setEquationStep(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };
  
  const handleRetry = () => {
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  }
  
  const handleViewExplanation = () => {
    setShowExplanation(true);
    setEquationStep(1);
    setMode('solve');
  }

  const handleGoBack = () => {
    setLeftPanWeight({ oranges: 3, value: 7 });
    setRightPanWeight(19);
    setBalanceTilt(0);
    setMode('practice');
    setEquationStep(0);
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleEquationStep = (step) => {
    speechSynthesis.cancel();
    setEquationStep(step);
  };
  
  const practiceOptions = [
    { value: 3, label: "3 grams" },
    { value: 4, label: "4 grams" },
    { value: 5, label: "5 grams" },
    { value: 6, label: "6 grams" },
  ];
  
  const handlePracticeSubmit = () => {
    if (userAnswer === 4) {
      setIsCorrect(true);
      speakMessage(t('correctAnswer'));
    } else {
      setIsCorrect(false);
      speakMessage(t('incorrectAnswer'));
    }
  }

  const renderWeights = (content) => {
    const items = [];
    if (content.apples) {
      for (let i = 0; i < content.apples; i++) {
        items.push(<div key={`apple-${items.length}`} className="text-4xl leading-none">🍎</div>);
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
    
    return (
      <div className="flex flex-wrap items-center justify-center gap-2">
        {items}
      </div>
    );
  };
  
  const renderEquationTextWithHighlight = (equation, step) => {
    switch (step) {
      case 2:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            3X <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">+ 7</span> - <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7</span> = 19 - <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">7</span>
          </p>
        );
      case 4:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>X / <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span> = 12 / <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">3</span>
          </p>
        );
      case 5:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            X = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">4</span>
          </p>
        );
      case 6:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            {t('originalEquation')} <span className="text-grey-800 font-bold">3X + 7 = 19</span><br />
            {t('substitute')} <span className="text-grey-800 font-bold">3*{`4`} + 7 = 19</span><br />
            {t('calculate')} <span className="text-grey-800 font-bold">12 + 7 = 19</span><br />
            LHS = RHS
          </p>
        );
      default:
        return <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{equation}</p>;
    }
  };

  const renderCurrentStepContent = () => {
    if (mode === 'initial') {
      return (
        <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm sm:max-w-md mx-auto border-4 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
          <p className={`text-lg sm:text-2xl font-semibold px-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-800'}`}>Welcome to the interactive balance scale. Click on the button below to begin the practice session.</p>
          <button
              onClick={handleStartPractice}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl mt-4"
          >
            Start Practice
          </button>
        </div>
      );
    }
    if (mode === 'practice' && !showExplanation) {
      return renderPracticeContent();
    }
    
    if (mode === 'solve' || showExplanation) {
      const stepData = translations[currentLanguage].equationSteps[equationStep - 1];
      
      return (
        <>
        <div className="w-full flex justify-center mb-4 overflow-x-auto">
          <div className={`inline-flex rounded-lg shadow-md ${theme === 'light' ? 'bg-gray-200' : 'bg-gray-700'}`}>
            {translations[currentLanguage].equationSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => handleEquationStep(step.step)}
                className={`flex-shrink-0 px-4 py-2 text-sm sm:text-base font-bold rounded-lg transition-colors duration-200 ${
                  equationStep === step.step
                    ? 'bg-blue-600 text-white'
                    : `${theme === 'light' ? 'text-gray-700 hover:bg-gray-300' : 'text-gray-300 hover:bg-gray-600'}`
                }`}
              >
                {t('step')} {step.step}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex flex-col items-start w-full min-h-[150px] p-4 rounded-lg ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
          {equationStep > 0 && equationStep <= 6 && (
            <>
              <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('step')} {stepData.step}</h3>
              <div className={`font-mono p-3 rounded-lg w-full ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                {renderEquationTextWithHighlight(stepData.equation, stepData.step)}
              </div>
              <p className={`text-sm sm:text-base text-left ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{stepData.explanation}</p>
            </>
          )}
        </div>
        {equationStep < translations[currentLanguage].equationSteps.length && (
          <button
            onClick={() => handleEquationStep(equationStep + 1)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4"
          >
            {t('continue')}
          </button>
        )}
        {equationStep >= translations[currentLanguage].equationSteps.length && (
          <div className="mt-4 flex gap-4 w-full justify-center">
            <button
              onClick={handleGoBack}
              className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
            >
              {t('goBack')}
            </button>
          </div>
        )}
        </>
      )
    }
    return null;
  };
  
  const renderPracticeContent = () => {
    return (
      <>
        <div className="flex flex-col items-start gap-4 w-full">
           <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('findOrangeWeight')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {practiceOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setUserAnswer(option.value)}
                  disabled={isCorrect !== null}
                  className={`py-3 px-4 rounded-lg font-bold text-base sm:text-lg transition-all duration-200 ${
                    userAnswer === option.value 
                      ? 'ring-2 sm:ring-4 ring-offset-1 sm:ring-offset-2 ring-blue-500' 
                      : 'hover:bg-opacity-80'
                  } ${
                    isCorrect === true && userAnswer === option.value
                      ? 'bg-green-500 text-white'
                      : isCorrect === false && userAnswer === option.value
                      ? 'bg-red-500 text-white'
                      : `${theme === 'light' ? 'bg-indigo-200 text-indigo-800 hover:bg-indigo-300' : 'bg-indigo-700 text-white hover:bg-indigo-600'}`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {isCorrect === null && (
              <button
                onClick={handlePracticeSubmit}
                disabled={userAnswer === null}
                className={`w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg mt-4 ${userAnswer === null && 'opacity-50 cursor-not-allowed'}`}
              >
                {t('submit')}
              </button>
            )}
            {isCorrect !== null && (
              <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full">
                {isCorrect === false ? (
                  <>
                    <button
                      onClick={handleRetry}
                      className="w-full px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                    >
                      {t('retry')}
                    </button>
                    <button
                      onClick={handleViewExplanation}
                      className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                    >
                      {t('viewExplanation')}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                        onClick={handleGoBack}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                    >
                        {t('goBack')}
                    </button>
                    <button
                        onClick={handleViewExplanation}
                        className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg"
                    >
                        {t('viewExplanation')}
                    </button>
                  </>
                )}
              </div>
            )}
        </div>
      </>
    )
  }
  
  const renderVerification = () => {
    return (
      <div className={`mt-6 p-4 rounded-lg shadow-inner ${theme === 'light' ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-800 text-gray-200'}`}>
        <h3 className="font-bold text-lg mb-2">{t('verifyAnswer')}</h3>
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('originalEquation')} <span className="text-yellow-400 font-bold">3X + 7 = 19</span></p>
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('substitute')} <span className="text-yellow-400 font-bold">3(4) + 7 = ?</span></p>
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('calculate')} <span className="text-yellow-400 font-bold">12 + 7 = 19</span> ✅</p>
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
                      {mode !== 'initial' && (
                        <div className="flex flex-col items-center justify-center -space-y-2">
                            {Array.from({ length: leftPanWeight.oranges }, (_, i) => (
                                <div key={`orange-${i}`} className="text-4xl leading-none">🍊</div>
                            ))}
                        </div>
                      )}
                      {mode !== 'initial' && (
                        <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
                            {leftPanWeight.value} gm
                        </span>
                      )}
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
                      {mode !== 'initial' && (
                        <span className="w-16 h-12 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg p-2">
                            {rightPanWeight} gm
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 sm:p-6 rounded-lg shadow-md w-full max-w-sm sm:max-w-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
            {renderCurrentStepContent()}
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