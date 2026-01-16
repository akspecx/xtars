import { useState } from 'react';

const RatioBasicsForKids = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [language, setLanguage] = useState('english');

  const translations = {
    english: {
      title: "Learn Ratios - Interactive Lessons",
      tabs: [
        {
          title: "Why Ratio?",
          shortTitle: "Why?",
          icon: "🤔",
          content: "intro"
        },
        {
          title: "Let's Start by Counting",
          shortTitle: "Count",
          icon: "🔢",
          content: "counting"
        },
        {
          title: "Let's Compare 2 Groups",
          shortTitle: "Compare",
          icon: "⚖️",
          content: "comparing"
        },
        {
          title: "How to Write a Ratio",
          shortTitle: "Write",
          icon: "✨",
          content: "ratio"
        },
        {
          title: "Your Turn to Try",
          shortTitle: "Try",
          icon: "🎮",
          content: "practice"
        }
      ],
      intro: {
        why: "Why Do We Need Ratios?",
        fairShares: "Making fair shares:",
        fairSharesDesc: "How do we split 6 pizza slices between 2 friends?",
        recipes: "Following recipes:",
        recipesDesc: "For every 1 cup of flour, we need 2 cups of milk",
        understanding: "Understanding our world:",
        understandingDesc: "In our class, there are 3 boys for every 2 girls",
        makingThings: "Making things look right:",
        makingThingsDesc: "Mix 2 drops of red with 1 drop of yellow",
        conclusion: "Ratios help us compare things and make fair decisions!"
      },
      counting: {
        title: "Let's Start by Counting!",
        look: "Look at these candies:",
        countRed: "Count the red ones:",
        countBlue: "Count the blue ones:",
        redApples: "red apples",
        blueGrapes: "blue grapes",
        nowWhat: "Great! We have 2 red apples and 3 blue grapes. Now what?"
      },
      comparing: {
        title: "Now Let's Compare!",
        redGroup: "Red Group",
        blueGroup: "Blue Group",
        canSay: "We can say:",
        forEvery: "For every 2 red apples, there are 3 blue grapes",
        special: "This comparison is special - it has a name!"
      },
      ratio: {
        title: "This is Called a \"Ratio\"!",
        when: "When we compare 2 red apples to 3 blue grapes:",
        called: "This is called a",
        ratio: "ratio",
        different: "We can say this in different ways:",
        conclusion: "A ratio is just a way to compare two groups!"
      },
      practice: {
        title: "Your Turn to Try!",
        look: "Look at these toys:",
        question: "What is the ratio of teddy bears to cars?",
        hint: "Write your answer like this: 1:4 or 1 to 4",
        placeholder: "Type your answer here (example: 1:4)",
        checkAnswer: "Check My Answer",
        tryAgain: "Try Again",
        correct: "🎉 Excellent! You got it right!",
        incorrect: "Not quite right. Let's think step by step:",
        step1: "Step 1: Count the teddy bears = 1",
        step2: "Step 2: Count the cars = 4", 
        step3: "Step 3: The ratio is 1:4",
        explanation: "\"For every 1 teddy bear, there are 4 cars\"",
        congratulations: "🎉 Congratulations! You learned what ratios are and how to find them!"
      }
    },
    hindi: {
      title: "अनुपात सीखें - इंटरैक्टिव पाठ",
      tabs: [
        {
          title: "अनुपात क्यों?",
          shortTitle: "क्यों?",
          icon: "🤔",
          content: "intro"
        },
        {
          title: "गिनती से शुरू करते हैं",
          shortTitle: "गिनती",
          icon: "🔢",
          content: "counting"
        },
        {
          title: "2 समूहों की तुलना करें",
          shortTitle: "तुलना",
          icon: "⚖️",
          content: "comparing"
        },
        {
          title: "अनुपात कैसे लिखें",
          shortTitle: "लिखें",
          icon: "✨",
          content: "ratio"
        },
        {
          title: "अब आपकी बारी",
          shortTitle: "कोशिश",
          icon: "🎮",
          content: "practice"
        }
      ],
      intro: {
        why: "हमें अनुपात की क्यों जरूरत है?",
        fairShares: "न्यायसंगत बंटवारा:",
        fairSharesDesc: "6 पिज्जा टुकड़े 2 दोस्तों में कैसे बांटें?",
        recipes: "व्यंजनों का पालन:",
        recipesDesc: "हर 1 कप आटे के लिए, हमें 2 कप दूध चाहिए",
        understanding: "अपनी दुनिया को समझना:",
        understandingDesc: "हमारी कक्षा में, हर 2 लड़कियों के लिए 3 लड़के हैं",
        makingThings: "चीजों को सही बनाना:",
        makingThingsDesc: "2 बूंद लाल रंग में 1 बूंद पीला मिलाएं",
        conclusion: "अनुपात हमें चीजों की तुलना करने और न्यायसंगत निर्णय लेने में मदद करता है!"
      },
      counting: {
        title: "गिनती से शुरू करते हैं!",
        look: "इन मिठाइयों को देखें:",
        countRed: "लाल वालों को गिनें:",
        countBlue: "नीले वालों को गिनें:",
        redApples: "लाल सेब",
        blueGrapes: "नीले अंगूर",
        nowWhat: "बहुत बढ़िया! हमारे पास 2 लाल सेब और 3 नीले अंगूर हैं। अब क्या?"
      },
      comparing: {
        title: "अब तुलना करते हैं!",
        redGroup: "लाल समूह",
        blueGroup: "नीला समूह",
        canSay: "हम कह सकते हैं:",
        forEvery: "हर 2 लाल सेब के लिए, 3 नीले अंगूर हैं",
        special: "यह तुलना विशेष है - इसका एक नाम है!"
      },
      ratio: {
        title: "इसे \"अनुपात\" कहते हैं!",
        when: "जब हम 2 लाल सेब की 3 नीले अंगूर से तुलना करते हैं:",
        called: "इसे कहते हैं",
        ratio: "अनुपात",
        different: "हम इसे अलग तरीकों से कह सकते हैं:",
        conclusion: "अनुपात दो समूहों की तुलना करने का एक तरीका है!"
      },
      practice: {
        title: "अब आपकी बारी!",
        look: "इन खिलौनों को देखें:",
        question: "टेडी बियर और कारों का अनुपात क्या है?",
        hint: "अपना उत्तर इस तरह लिखें: 1:4 या 1 से 4",
        placeholder: "यहाँ अपना उत्तर टाइप करें (उदाहरण: 1:4)",
        checkAnswer: "मेरा उत्तर जांचें",
        tryAgain: "फिर कोशिश करें",
        correct: "🎉 शानदार! आपका उत्तर सही है!",
        incorrect: "बिल्कुल सही नहीं। आइए कदम दर कदम सोचते हैं:",
        step1: "चरण 1: टेडी बियर गिनें = 1",
        step2: "चरण 2: कारें गिनें = 4",
        step3: "चरण 3: अनुपात है 1:4",
        explanation: "\"हर 1 टेडी बियर के लिए, 4 कारें हैं\"",
        congratulations: "🎉 बधाई हो! आपने सीख लिया कि अनुपात क्या होते हैं और इन्हें कैसे निकालते हैं!"
      }
    }
  };

  const t = translations[language];
  const tabs = t.tabs;

  const renderIntro = () => (
    <div className="text-center space-y-4 md:space-y-6">
      <div className="text-4xl md:text-6xl mb-4">🤔</div>
      <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4 md:mb-6 px-2">
        {t.intro.why}
      </h2>
      
      <div className="space-y-4 md:space-y-6 text-base md:text-lg px-2">
        <div className="bg-yellow-100 p-4 md:p-6 rounded-xl">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🍕</div>
          <p><strong>{t.intro.fairShares}</strong> "{t.intro.fairSharesDesc}"</p>
        </div>
        
        <div className="bg-green-100 p-4 md:p-6 rounded-xl">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🧁</div>
          <p><strong>{t.intro.recipes}</strong> "{t.intro.recipesDesc}"</p>
        </div>
        
        <div className="bg-blue-100 p-4 md:p-6 rounded-xl">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🏫</div>
          <p><strong>{t.intro.understanding}</strong> "{t.intro.understandingDesc}"</p>
        </div>
        
        <div className="bg-pink-100 p-4 md:p-6 rounded-xl">
          <div className="text-3xl md:text-4xl mb-2 md:mb-3">🎨</div>
          <p><strong>{t.intro.makingThings}</strong> "{t.intro.makingThingsDesc}"</p>
        </div>
      </div>
      
      <div className="bg-purple-100 p-3 md:p-4 rounded-xl mt-4 md:mt-6 mx-2">
        <p className="text-lg md:text-xl font-semibold text-purple-800">
          {t.intro.conclusion} 🎯
        </p>
      </div>
    </div>
  );

  const renderCounting = () => (
    <div className="text-center space-y-4 md:space-y-6">
      <div className="text-4xl md:text-6xl mb-4">🔢</div>
      <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-4 md:mb-6 px-2">
        {t.counting.title}
      </h2>
      
      <p className="text-lg md:text-xl mb-6 md:mb-8 px-2">{t.counting.look}</p>
      
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mx-2">
        <div className="flex flex-wrap justify-center gap-2 mb-4 md:mb-6">
          {/* Red candies */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍎</div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍎</div>
          
          {/* Blue candies */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
        </div>
        
        <div className="space-y-3 md:space-y-4 text-lg md:text-xl">
          <p>{t.counting.countRed} <span className="font-bold text-red-600">2 {t.counting.redApples} 🍎🍎</span></p>
          <p>{t.counting.countBlue} <span className="font-bold text-blue-600">3 {t.counting.blueGrapes} 🍇🍇🍇</span></p>
        </div>
      </div>
      
      <div className="bg-yellow-100 p-3 md:p-4 rounded-xl mx-2">
        <p className="text-base md:text-lg font-semibold">
          {t.counting.nowWhat} 🤔
        </p>
      </div>
    </div>
  );

  const renderComparing = () => (
    <div className="text-center space-y-4 md:space-y-6">
      <div className="text-4xl md:text-6xl mb-4">⚖️</div>
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 md:mb-6 px-2">
        {t.comparing.title}
      </h2>
      
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mx-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-4 md:mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-red-600 mb-3 md:mb-4">{t.comparing.redGroup}</h3>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍎</div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍎</div>
            </div>
            <p className="text-xl md:text-2xl font-bold mt-2">2</p>
          </div>
          
          <div>
            <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-3 md:mb-4">{t.comparing.blueGroup}</h3>
            <div className="flex justify-center gap-2">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-500 rounded-full shadow-md flex items-center justify-center text-white text-xl md:text-2xl">🍇</div>
            </div>
            <p className="text-xl md:text-2xl font-bold mt-2">3</p>
          </div>
        </div>
        
        <div className="space-y-3 md:space-y-4 text-lg md:text-xl">
          <p>{t.comparing.canSay} <span className="bg-yellow-200 px-2 py-1 rounded">"{t.comparing.forEvery}"</span></p>
        </div>
      </div>
      
      <div className="bg-green-100 p-3 md:p-4 rounded-xl mx-2">
        <p className="text-base md:text-lg font-semibold">
          {t.comparing.special} 🎉
        </p>
      </div>
    </div>
  );

  const renderRatio = () => (
    <div className="text-center space-y-4 md:space-y-6">
      <div className="text-4xl md:text-6xl mb-4">✨</div>
      <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-4 md:mb-6 px-2">
        {t.ratio.title}
      </h2>
      
      <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mx-2">
        <div className="mb-4 md:mb-6">
          <p className="text-xl md:text-2xl mb-3 md:mb-4">{t.ratio.when}</p>
          
          <div className="bg-purple-100 p-4 md:p-6 rounded-xl">
            <p className="text-2xl md:text-3xl font-bold text-purple-800 mb-3 md:mb-4">2 : 3</p>
            <p className="text-base md:text-lg">{t.ratio.called} <strong>{t.ratio.ratio}</strong>!</p>
          </div>
        </div>
        
        <div className="space-y-3 md:space-y-4 text-base md:text-lg">
          <p>{t.ratio.different}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
            <div className="bg-yellow-100 p-3 md:p-4 rounded-lg">
              <p className="font-bold">2 to 3</p>
            </div>
            <div className="bg-orange-100 p-3 md:p-4 rounded-lg">
              <p className="font-bold">2 : 3</p>
            </div>
            <div className="bg-pink-100 p-3 md:p-4 rounded-lg">
              <p className="font-bold">2/3</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-purple-100 p-3 md:p-4 rounded-xl mx-2">
        <p className="text-lg md:text-xl font-semibold text-purple-800">
          {t.ratio.conclusion} 🎯
        </p>
      </div>
    </div>
  );

  const renderPractice = () => {
    let isCorrect = false;
    if (showFeedback) {
      const normalizedAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
      const correctAnswers = ['1:4', '1to4', '1-4', '1/4'];
      isCorrect = correctAnswers.some(answer => 
        normalizedAnswer === answer.replace(/\s/g, '').toLowerCase()
      );
    }
    
    return (
      <div className="text-center space-y-4 md:space-y-6">
        <div className="text-4xl md:text-6xl mb-4">🎮</div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4 md:mb-6 px-2">
          {t.practice.title}
        </h2>
        
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg mx-2">
          <p className="text-lg md:text-xl mb-4 md:mb-6">{t.practice.look}</p>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Teddy bear */}
            <div className="text-4xl md:text-6xl">🧸</div>
            
            {/* Cars */}
            <div className="text-4xl md:text-6xl">🚗</div>
            <div className="text-4xl md:text-6xl">🚗</div>
            <div className="text-4xl md:text-6xl">🚗</div>
            <div className="text-4xl md:text-6xl">🚗</div>
          </div>
          
          <div className="space-y-4 md:space-y-6">
            <p className="text-lg md:text-xl font-semibold text-blue-700">{t.practice.question}</p>
            <p className="text-sm md:text-base text-gray-600">{t.practice.hint}</p>
            
            <div className="max-w-sm mx-auto">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder={t.practice.placeholder}
                className="w-full p-3 md:p-4 text-center text-lg md:text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <button
              onClick={() => {
                const normalizedAnswer = userAnswer.toLowerCase().replace(/\s/g, '');
                const correctAnswers = ['1:4', '1to4', '1-4', '1/4'];
                const correct = correctAnswers.some(answer => 
                  normalizedAnswer === answer.replace(/\s/g, '').toLowerCase()
                );
                setShowFeedback(true);
              }}
              disabled={!userAnswer.trim()}
              className={`px-6 py-3 rounded-full font-bold text-lg transition-colors ${
                !userAnswer.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {t.practice.checkAnswer}
            </button>
            
            {showFeedback && (
              <div className={`p-4 md:p-6 rounded-xl mt-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? (
                  <div>
                    <p className="text-lg md:text-xl mb-2 font-bold text-green-800">{t.practice.correct}</p>
                    <p className="text-xl md:text-2xl font-bold text-green-800">1 : 4</p>
                    <p className="text-base md:text-lg mt-2">{t.practice.explanation}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-red-800 mb-3">{t.practice.incorrect}</p>
                    <div className="text-left space-y-2 text-sm md:text-base">
                      <p>• {t.practice.step1}</p>
                      <p>• {t.practice.step2}</p>
                      <p>• {t.practice.step3}</p>
                      <p className="text-center mt-3 font-semibold">"{t.practice.explanation}"</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserAnswer('');
                        setShowFeedback(false);
                      }}
                      className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                    >
                      {t.practice.tryAgain}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {showFeedback && isCorrect && (
          <div className="bg-yellow-100 p-3 md:p-4 rounded-xl mx-2">
            <p className="text-lg md:text-xl font-semibold">
              {t.practice.congratulations}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderCurrentTab = () => {
    switch (tabs[activeTab].content) {
      case "intro": return renderIntro();
      case "counting": return renderCounting();
      case "comparing": return renderComparing();
      case "ratio": return renderRatio();
      case "practice": return renderPractice();
      default: return renderIntro();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-3 md:p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl min-h-screen">
      {/* Language Selector */}
      <div className="flex justify-center mb-4 md:mb-6">
        <div className="bg-white rounded-lg p-1 shadow-md">
          <button
            onClick={() => setLanguage('english')}
            className={`px-4 py-2 rounded-md font-medium text-sm md:text-base transition-colors ${
              language === 'english'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('hindi')}
            className={`px-4 py-2 rounded-md font-medium text-sm md:text-base transition-colors ${
              language === 'hindi'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-8 text-gray-800 px-2">
        {t.title}
      </h1>

      {/* Tab Navigation */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-wrap justify-center gap-1 md:gap-2 p-2 bg-white rounded-xl shadow-lg">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(index);
                setUserAnswer('');
                setShowFeedback(false);
              }}
              className={`flex-1 min-w-0 px-2 md:px-4 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md transform scale-105'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-lg md:text-xl">{tab.icon}</span>
                <span className="hidden sm:block">{tab.title}</span>
                <span className="sm:hidden">{tab.shortTitle}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 min-h-96">
        {renderCurrentTab()}
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 text-center">
        <div className="flex justify-center space-x-2">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === activeTab
                  ? 'bg-purple-500 scale-125'
                  : index < activeTab
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {activeTab + 1} / {tabs.length} modules completed
        </p>
      </div>
    </div>
  );
};

export default RatioBasicsForKids;