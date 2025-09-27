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
    findAppleWeight: "What is the value of X?",
    submit: "✅ Submit",
    retry: "🔄 Retry",
    viewExplanation: "🤔 View Explanation",
    correctAnswer: "🎉 Correct! The answer is 16!",
    incorrectAnswer: "❌ Incorrect. Please try again.",

    // Solving Equations Module
    solveEquationIntro: {
      text: "X/4 + 5 = X - 7. Can you find the value of X?",
      voice: "X divided by 4 plus 5 equals X minus 7. Can you find the value of X?",
    },
    equationSteps: [
      {
        step: 1,
        equation: "X/4 + 5 = X - 7",
        explanation: "The equation 'X/4 + 5 = X - 7' is what we need to solve. Our goal is to find the value of X.",
        voice: "The equation X divided by 4 plus 5 equals X minus 7 is what we need to solve. Our goal is to find the value of X."
      },
      {
        step: 2,
        equation: "X/4 - X + 5 = X - X - 7",
        explanation: "To get all the X terms on one side, we subtract X from both sides of the equation. This keeps the equation balanced.",
        voice: "To get all the X terms on one side, we subtract X from both sides."
      },
      {
        step: 3,
        equation: "-3X/4 + 5 = -7",
        explanation: "After subtracting X from both sides, the equation simplifies to -3X/4 + 5 = -7. Now, we have all the X terms on one side.",
        voice: "After subtracting X, the equation simplifies to negative 3X over 4 plus 5 equals negative 7."
      },
      {
        step: 4,
        equation: "-3X/4 + 5 - 5 = -7 - 5",
        explanation: "To get the X term by itself, we need to remove the '+5' from the left side. We do this by subtracting 5 from both sides of the equation.",
        voice: "To get the X term by itself, we subtract 5 from both sides of the equation."
      },
      {
        step: 5,
        equation: "-3X/4 = -12",
        explanation: "After subtracting 5 from both sides, the equation simplifies to -3X/4 = -12.",
        voice: "After subtracting 5, the equation simplifies to negative 3X over 4 equals negative 12."
      },
      {
        step: 6,
        equation: "(-3X/4) * 4 = (-12) * 4",
        explanation: "To remove the fraction, we first multiply both sides by the denominator, 4. This is a crucial step to keep the equation balanced.",
        voice: "To remove the fraction, we first multiply both sides by 4."
      },
      {
        step: 7,
        equation: "-3X = -48",
        explanation: "After multiplying by 4, the equation simplifies to -3X = -48. Now we have a simple coefficient to handle.",
        voice: "After multiplying, the equation simplifies to negative 3X equals negative 48."
      },
      {
        step: 8,
        equation: "-3X / -3 = -48 / -3",
        explanation: "To isolate X, we divide both sides by the coefficient, -3. This is the final step to find the value of X.",
        voice: "To isolate X, we divide both sides by negative 3."
      },
      {
        step: 9,
        equation: "X = 16",
        explanation: "By performing the division on both sides, we get our final answer: X = 16.",
        voice: "By performing the division on both sides, we get X equals 16."
      },
      {
        step: 10,
        equation: "Final Verification",
        explanation: "Now let's verify our answer. Substitute X = 16 back into the original equation: 16/4 + 5 = 16 - 7, which simplifies to 4 + 5 = 9. Both sides equal 9. This is correct!",
        voice: "Now let's verify our answer. The left side is 16 divided by 4 plus 5, which equals 9. The right side is 16 minus 7, which also equals 9. The equation is balanced!"
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
    substitute: "Substitute X = 16:",
    calculate: "Calculate:",
    perfect: "✅ Perfect! The equation is balanced!",
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
    findAppleWeight: "X का मान कितना है?",
    submit: "✅ सबमिट करें",
    retry: "🔄 पुनः प्रयास करें",
    viewExplanation: "🤔 स्पष्टीकरण देखें",
    correctAnswer: "🎉 सही! उत्तर 16 है!",
    incorrectAnswer: "❌ गलत। कृपया पुनः प्रयास करें।",

    // Solving Equations Module
    solveEquationIntro: {
      text: "X/4 + 5 = X - 7. क्या आप X का मान ज्ञात कर सकते हैं?",
      voice: "X को 4 से विभाजित, प्लस 5, बराबर X माइनस 7। क्या आप X का मान ज्ञात कर सकते हैं?"
    },
    equationSteps: [
      {
        step: 1,
        equation: "X/4 + 5 = X - 7",
        explanation: "समीकरण 'X/4 + 5 = X - 7' हमें हल करने के लिए दिया गया है। हमारा लक्ष्य X का मान ज्ञात करना है।",
        voice: "समीकरण X को 4 से विभाजित, प्लस 5, बराबर X माइनस 7 है। हमें X का मान ज्ञात करना है।"
      },
      {
        step: 2,
        equation: "X/4 - X + 5 = X - X - 7",
        explanation: "सभी X पदों को एक तरफ लाने के लिए, हम समीकरण के दोनों पक्षों से X घटाते हैं। यह समीकरण को संतुलित रखता है।",
        voice: "सभी X पदों को एक तरफ लाने के लिए, हम दोनों पक्षों से X घटाते हैं।"
      },
      {
        step: 3,
        equation: "-3X/4 + 5 = -7",
        explanation: "दोनों पक्षों से X घटाने के बाद, समीकरण -3X/4 + 5 = -7 हो जाता है। अब, हमारे पास सभी X पद एक तरफ हैं।",
        voice: "दोनों पक्षों से X घटाने के बाद, समीकरण नकारात्मक 3X ओवर 4 प्लस 5 बराबर नकारात्मक 7 हो जाता है।"
      },
      {
        step: 4,
        equation: "-3X/4 + 5 - 5 = -7 - 5",
        explanation: "X पद को अकेले प्राप्त करने के लिए, हमें '+5' को हटाना होगा। हम समीकरण के दोनों पक्षों से 5 घटाकर ऐसा करते हैं।",
        voice: "X पद को अकेले प्राप्त करने के लिए, हम दोनों पक्षों से 5 घटाते हैं।"
      },
      {
        step: 5,
        equation: "-3X/4 = -12",
        explanation: "दोनों पक्षों से 5 घटाने के बाद, समीकरण -3X/4 = -12 हो जाता है।",
        voice: "दोनों पक्षों से 5 घटाने के बाद, समीकरण नकारात्मक 3X ओवर 4 बराबर नकारात्मक 12 हो जाता है।"
      },
      {
        step: 6,
        equation: "(-3X/4) * 4 = (-12) * 4",
        explanation: "भिन्न को हटाने के लिए, हम पहले दोनों पक्षों को हर, 4 से गुणा करते हैं। यह समीकरण को संतुलित रखने के लिए एक महत्वपूर्ण कदम है।",
        voice: "भिन्न को हटाने के लिए, हम दोनों पक्षों को 4 से गुणा करते हैं।"
      },
      {
        step: 7,
        equation: "-3X = -48",
        explanation: "4 से गुणा करने के बाद, समीकरण -3X = -48 हो जाता है। अब हमारे पास एक सरल गुणांक है।",
        voice: "4 से गुणा करने के बाद, समीकरण नकारात्मक 3X बराबर नकारात्मक 48 हो जाता है।"
      },
      {
        step: 8,
        equation: "-3X / -3 = -48 / -3",
        explanation: "X को अलग करने के लिए, हम दोनों पक्षों को गुणांक, -3 से भाग देते हैं। यह अंतिम चरण है।",
        voice: "X को अलग करने के लिए, हम दोनों पक्षों को नकारात्मक 3 से भाग देते हैं।"
      },
      {
        step: 9,
        equation: "X = 16",
        explanation: "दोनों पक्षों को भाग देने पर, हमें हमारा अंतिम उत्तर मिलता है: X = 16।",
        voice: "दोनों पक्षों को भाग देने पर, हमें X बराबर 16 मिलता है।"
      },
      {
        step: 10,
        equation: "Final Verification",
        explanation: "अब आइए अपने उत्तर की जाँच करें। X = 16 को मूल समीकरण में रखें: 16/4 + 5 = 16 - 7, जो 4 + 5 = 9 हो जाता है। दोनों पक्ष 9 के बराबर हैं। यह सही है!",
        voice: "अब आइए अपने उत्तर की जाँच करें। बायां पक्ष 16 को 4 से विभाजित, प्लस 5 है, जो 9 के बराबर है। दायां पक्ष 16 माइनस 7 है, जो भी 9 के बराबर है। समीकरण संतुलित है।"
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
    substitute: "X = 16 रखें:",
    calculate: "गणना करें:",
    perfect: "✅ बिलकुल सही! समीकरण संतुलित है!",
  },
};

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [userInteraction, setUserInteraction] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [mode, setMode] = useState('initial'); // 'initial', 'practice' or 'solve'

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
      speakMessage(t('solveEquationIntro'));
    }
  }, [equationStep, mode, speakMessage, currentLanguage, isCorrect, showExplanation]);

  const handleStartSolving = () => {
    setMode('solve');
    setEquationStep(1);
    setShowExplanation(false);
  };
  
  const handleStartPractice = () => {
    setMode('practice');
    setUserAnswer(null);
    setIsCorrect(null);
    setShowExplanation(false);
    speakMessage(t('solveEquationIntro'));
  };

  const handleReset = () => {
    speechSynthesis.cancel();
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
    { value: 14, label: "14" },
    { value: 15, label: "15" },
    { value: 16, label: "16" },
    { value: 17, label: "17" },
  ];
  
  const handlePracticeSubmit = () => {
    if (userAnswer === 16) {
      setIsCorrect(true);
      speakMessage(t('correctAnswer'));
    } else {
      setIsCorrect(false);
      speakMessage(t('incorrectAnswer'));
    }
  }

  const renderEquationTextWithHighlight = (equation, step) => {
    switch (step) {
      case 2:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            X/4 <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- X</span> + 5 = X <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- X</span> - 7
          </p>
        );
      case 3:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-3X/4 + 5</span> = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-7</span>
          </p>
        );
      case 4:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            -3X/4 + 5 <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5</span> = -7 <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">- 5</span>
          </p>
        );
      case 5:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-3X/4</span> = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-12</span>
          </p>
        );
      case 6:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">(-3X/4) * 4</span> = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">(-12) * 4</span>
          </p>
        );
      case 7:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-3X</span> = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-48</span>
          </p>
        );
      case 8:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-3X / -3</span> = <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">-48 / -3</span>
          </p>
        );
      case 9:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            <span className="ring-2 ring-yellow-400 ring-offset-2 rounded-full px-1">X = 16</span>
          </p>
        );
      case 10:
        return (
          <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
            {t('originalEquation')} <span className="text-grey-800 font-bold">X/4 + 5 = X - 7</span><br />
            {t('substitute')} <span className="text-grey-800 font-bold">16/4 + 5 = 16 - 7</span><br />
            {t('calculate')} <span className="text-grey-800 font-bold">4 + 5 = 9</span><br />
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
          <p className={`text-lg sm:text-2xl font-semibold px-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Welcome to the interactive equation solver. Click on the button below to begin the practice session.</p>
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
        <div className="w-full text-center mb-4">
            <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>Equation to solve:</h3>
            <p className={`font-mono text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>X/4 + 5 = X - 7</p>
        </div>
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
          {equationStep > 0 && equationStep <= 10 && (
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
           <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('solveEquationIntro')}</h3>
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
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('originalEquation')} <span className="text-yellow-400 font-bold">X/4 + 5 = X - 7</span></p>
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('substitute')} <span className="text-yellow-400 font-bold">16/4 + 5 = 16 - 7</span></p>
        <p className={`font-mono ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{t('calculate')} <span className="text-yellow-400 font-bold">4 + 5 = 9</span> ✅</p>
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