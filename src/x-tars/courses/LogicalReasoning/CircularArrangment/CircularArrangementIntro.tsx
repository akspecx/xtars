import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, Globe } from 'lucide-react';

const CircularArrangementModule = () => {
  const [activeModule, setActiveModule] = useState('what');
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('english');
  const [isPlaying, setIsPlaying] = useState({ what: false, why: false });

  const content = {
    english: {
      title: "Circular Arrangement",
      whatTab: "What is Circular Arrangement?",
      whyTab: "Why is it Important?",
      what: {
        title: "What is Circular Arrangement?",
        intro: "Circular arrangement is a logical reasoning concept where people or objects are placed around a circle, like sitting around a round table.",
        keyConceptTitle: "Key Concept:",
        keyConcept: "In a circle, there is no fixed starting point or ending point. This is the key difference from linear arrangements.",
        positionsTitle: "Position Terms:",
        positions: [
          { icon: "🔄", term: "Clockwise:", desc: "Moving in the direction of clock hands" },
          { icon: "🔄", term: "Anti-clockwise:", desc: "Moving opposite to clock hands" },
          { icon: "👉", term: "Right/Left:", desc: "Depends on facing direction (center or outside)" },
          { icon: "⚡", term: "Opposite:", desc: "Person sitting directly across (even numbers only)" }
        ],
        warning: "⚠️ Important: The facing direction (center or outside) determines whether clockwise means right or left!",
        audio: "What is Circular Arrangement? Circular arrangement is a logical reasoning concept where people or objects are placed around a circle, like sitting around a round table. In a circle, there is no fixed starting point or ending point. This is the key difference from linear arrangements. When people sit in a circle, we describe their positions relative to each other using terms like left, right, clockwise, anti-clockwise, and opposite. The most important thing to remember is that in circular arrangements, the facing direction matters a lot. If people are facing the center, then clockwise means right and anti-clockwise means left. But if they're facing outside, it reverses! Understanding circular arrangement helps you solve seating arrangement puzzles and logical reasoning questions efficiently."
      },
      why: {
        title: "Why is it Important?",
        intro: "Circular arrangement is a crucial concept for logical reasoning and problem-solving. Here's why you need to master it:",
        reasons: [
          {
            icon: "🧠",
            title: "1. Tests Spatial Visualization",
            desc: "It enhances your ability to imagine and mentally rotate objects and people in space, which is a valuable cognitive skill."
          },
          {
            icon: "🎯",
            title: "2. Improves Analytical Thinking",
            desc: "You learn to use given clues systematically to deduce positions, building strong logical reasoning skills."
          },
          {
            icon: "📝",
            title: "3. Common in Competitive Exams",
            desc: "Circular arrangement questions frequently appear in aptitude tests, interviews, and competitive exams like banking, SSC, and placement tests."
          },
          {
            icon: "💼",
            title: "4. Real-Life Applications",
            desc: "Helps in planning seating arrangements at events, organizing team meetings, arranging furniture, and solving practical spatial problems."
          },
          {
            icon: "🏗️",
            title: "5. Foundation for Advanced Logic",
            desc: "Mastering circular arrangements builds a strong foundation for other logical reasoning topics and complex problem-solving scenarios."
          }
        ],
        takeawayTitle: "💡 Key Takeaway",
        takeaway: "The skill you develop is working with relative positions rather than absolute positions - a valuable problem-solving approach in many areas of life and work!",
        audio: "Why is Circular Arrangement Important? Circular arrangement is crucial for logical reasoning and problem-solving skills. First, it tests your spatial visualization ability - can you imagine people sitting in a circle and their relative positions? Second, it improves your analytical thinking as you need to use given clues step by step to figure out who sits where. Third, circular arrangement questions are very common in competitive exams, interviews, and aptitude tests. Fourth, this concept helps in real-life situations like planning seating at events, organizing team meetings, or arranging furniture. Finally, mastering circular arrangement builds a strong foundation for other logical reasoning topics. The key skill you develop is the ability to work with relative positions rather than absolute positions, which is a valuable problem-solving approach in many areas."
      }
    },
    hindi: {
      title: "वृत्ताकार व्यवस्था",
      whatTab: "वृत्ताकार व्यवस्था क्या है?",
      whyTab: "यह क्यों महत्वपूर्ण है?",
      what: {
        title: "वृत्ताकार व्यवस्था क्या है?",
        intro: "वृत्ताकार व्यवस्था एक तार्किक तर्क अवधारणा है जहां लोगों या वस्तुओं को एक वृत्त के चारों ओर रखा जाता है, जैसे गोल मेज के चारों ओर बैठना।",
        keyConceptTitle: "मुख्य अवधारणा:",
        keyConcept: "एक वृत्त में कोई निश्चित प्रारंभिक बिंदु या अंतिम बिंदु नहीं होता है। यह रैखिक व्यवस्थाओं से मुख्य अंतर है।",
        positionsTitle: "स्थिति शब्द:",
        positions: [
          { icon: "🔄", term: "दक्षिणावर्त:", desc: "घड़ी की सुइयों की दिशा में चलना" },
          { icon: "🔄", term: "वामावर्त:", desc: "घड़ी की सुइयों के विपरीत चलना" },
          { icon: "👉", term: "दाएं/बाएं:", desc: "मुख की दिशा पर निर्भर करता है (केंद्र या बाहर)" },
          { icon: "⚡", term: "विपरीत:", desc: "सीधे सामने बैठा व्यक्ति (केवल सम संख्या में)" }
        ],
        warning: "⚠️ महत्वपूर्ण: मुख की दिशा (केंद्र या बाहर) यह निर्धारित करती है कि दक्षिणावर्त का अर्थ दाएं है या बाएं!",
        audio: "वृत्ताकार व्यवस्था क्या है? वृत्ताकार व्यवस्था एक तार्किक तर्क अवधारणा है जहां लोगों या वस्तुओं को एक वृत्त के चारों ओर रखा जाता है, जैसे गोल मेज के चारों ओर बैठना। एक वृत्त में कोई निश्चित प्रारंभिक बिंदु या अंतिम बिंदु नहीं होता है। यह रैखिक व्यवस्थाओं से मुख्य अंतर है। जब लोग एक वृत्त में बैठते हैं, तो हम उनकी स्थिति एक दूसरे के सापेक्ष शब्दों का उपयोग करके वर्णित करते हैं जैसे बाएं, दाएं, दक्षिणावर्त, वामावर्त, और विपरीत। सबसे महत्वपूर्ण बात यह याद रखना है कि वृत्ताकार व्यवस्थाओं में मुख की दिशा बहुत मायने रखती है। यदि लोग केंद्र की ओर मुख कर रहे हैं, तो दक्षिणावर्त का अर्थ दाएं है और वामावर्त का अर्थ बाएं है। लेकिन यदि वे बाहर की ओर मुख कर रहे हैं, तो यह उलट जाता है!"
      },
      why: {
        title: "यह क्यों महत्वपूर्ण है?",
        intro: "वृत्ताकार व्यवस्था तार्किक तर्क और समस्या समाधान के लिए एक महत्वपूर्ण अवधारणा है। यहां बताया गया है कि आपको इसे क्यों महारत हासिल करनी चाहिए:",
        reasons: [
          {
            icon: "🧠",
            title: "1. स्थानिक दृश्यता का परीक्षण",
            desc: "यह आपकी वस्तुओं और लोगों को अंतरिक्ष में कल्पना करने और मानसिक रूप से घुमाने की क्षमता को बढ़ाता है, जो एक मूल्यवान संज्ञानात्मक कौशल है।"
          },
          {
            icon: "🎯",
            title: "2. विश्लेषणात्मक सोच में सुधार",
            desc: "आप स्थितियों का अनुमान लगाने के लिए दिए गए सुराग का व्यवस्थित रूप से उपयोग करना सीखते हैं, मजबूत तार्किक तर्क कौशल का निर्माण करते हैं।"
          },
          {
            icon: "📝",
            title: "3. प्रतिस्पर्धी परीक्षाओं में सामान्य",
            desc: "वृत्ताकार व्यवस्था के प्रश्न अक्सर योग्यता परीक्षणों, साक्षात्कारों, और बैंकिंग, एसएससी, और प्लेसमेंट परीक्षणों जैसी प्रतिस्पर्धी परीक्षाओं में दिखाई देते हैं।"
          },
          {
            icon: "💼",
            title: "4. वास्तविक जीवन अनुप्रयोग",
            desc: "कार्यक्रमों में बैठने की व्यवस्था की योजना बनाने, टीम बैठकों का आयोजन करने, फर्नीचर व्यवस्थित करने और व्यावहारिक स्थानिक समस्याओं को हल करने में मदद करता है।"
          },
          {
            icon: "🏗️",
            title: "5. उन्नत तर्क के लिए आधार",
            desc: "वृत्ताकार व्यवस्थाओं में महारत हासिल करना अन्य तार्किक तर्क विषयों और जटिल समस्या-समाधान परिदृश्यों के लिए एक मजबूत नींव बनाता है।"
          }
        ],
        takeawayTitle: "💡 मुख्य बात",
        takeaway: "आप जो कौशल विकसित करते हैं वह पूर्ण स्थितियों के बजाय सापेक्ष स्थितियों के साथ काम करना है - जीवन और कार्य के कई क्षेत्रों में एक मूल्यवान समस्या-समाधान दृष्टिकोण!",
        audio: "वृत्ताकार व्यवस्था क्यों महत्वपूर्ण है? वृत्ताकार व्यवस्था तार्किक तर्क और समस्या-समाधान कौशल के लिए महत्वपूर्ण है। पहला, यह आपकी स्थानिक दृश्यता क्षमता का परीक्षण करता है - क्या आप लोगों को एक वृत्त में बैठे और उनकी सापेक्ष स्थितियों की कल्पना कर सकते हैं? दूसरा, यह आपकी विश्लेषणात्मक सोच में सुधार करता है क्योंकि आपको चरण दर चरण दिए गए सुरागों का उपयोग करके यह पता लगाना होता है कि कौन कहां बैठता है। तीसरा, वृत्ताकार व्यवस्था के प्रश्न प्रतिस्पर्धी परीक्षाओं, साक्षात्कारों, और योग्यता परीक्षणों में बहुत आम हैं। चौथा, यह अवधारणा वास्तविक जीवन की स्थितियों में मदद करती है जैसे कार्यक्रमों में बैठने की योजना बनाना, टीम बैठकों का आयोजन करना, या फर्नीचर व्यवस्थित करना। अंत में, वृत्ताकार व्यवस्था में महारत हासिल करना अन्य तार्किक तर्क विषयों के लिए एक मजबूत नींव बनाता है।"
      }
    }
  };

  const playAudio = (module) => {
    const utterance = new SpeechSynthesisUtterance();
    
    utterance.text = content[language][module].audio;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set language for speech
    utterance.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
    
    utterance.onstart = () => {
      setIsPlaying({ ...isPlaying, [module]: true });
    };
    
    utterance.onend = () => {
      setIsPlaying({ ...isPlaying, [module]: false });
    };
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying({ what: false, why: false });
  };

  const currentContent = content[language];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'}`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Controls */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {currentContent.title}
          </h1>
          <div className="flex gap-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  stopAudio();
                }}
                className={`appearance-none px-4 py-3 pr-10 rounded-full font-semibold cursor-pointer transition-all ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
                }`}
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
              </select>
              <Globe className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            </div>
            
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-3 rounded-full transition-all ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-white hover:bg-gray-100 text-gray-800 shadow-lg'
              }`}
            >
              {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Module Selector */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveModule('what')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              activeModule === 'what'
                ? isDark
                  ? 'bg-blue-600 text-white shadow-xl'
                  : 'bg-blue-500 text-white shadow-xl'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {currentContent.whatTab}
          </button>
          <button
            onClick={() => setActiveModule('why')}
            className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
              activeModule === 'why'
                ? isDark
                  ? 'bg-purple-600 text-white shadow-xl'
                  : 'bg-purple-500 text-white shadow-xl'
                : isDark
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            {currentContent.whyTab}
          </button>
        </div>

        {/* Content Area */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {/* Module: What */}
          {activeModule === 'what' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {currentContent.what.title}
                </h2>
                <button
                  onClick={() => isPlaying.what ? stopAudio() : playAudio('what')}
                  className={`p-4 rounded-full transition-all ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                  }`}
                >
                  {isPlaying.what ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="space-y-6">
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentContent.what.intro}
                </p>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <h3 className={`font-semibold text-xl mb-3 ${isDark ? 'text-blue-300' : 'text-blue-900'}`}>
                    {currentContent.what.keyConceptTitle}
                  </h3>
                  <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-blue-800'}`}>
                    {currentContent.what.keyConcept}
                  </p>
                </div>

                <div className="flex justify-center my-8">
                  <svg viewBox="0 0 300 300" className="w-full max-w-lg">
                    <circle cx="150" cy="150" r="100" fill="none" stroke={isDark ? '#60a5fa' : '#3b82f6'} strokeWidth="3" strokeDasharray="8,8"/>
                    <text x="150" y="155" textAnchor="middle" fill={isDark ? '#60a5fa' : '#3b82f6'} fontSize="16" fontWeight="bold">
                      {language === 'hindi' ? 'गोल मेज' : 'Round Table'}
                    </text>
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                      const angle = (i * 60 - 90) * Math.PI / 180;
                      const x = 150 + 100 * Math.cos(angle);
                      const y = 150 + 100 * Math.sin(angle);
                      const names = ['A', 'B', 'C', 'D', 'E', 'F'];
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="28" fill={isDark ? '#3b82f6' : '#2563eb'}/>
                          <text x={x} y={y + 7} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">
                            {names[i]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className={`font-semibold text-xl mb-3 ${isDark ? 'text-green-300' : 'text-green-900'}`}>
                    {currentContent.what.positionsTitle}
                  </h3>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-green-800'}`}>
                    {currentContent.what.positions.map((pos, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-3 text-xl">{pos.icon}</span>
                        <span><strong>{pos.term}</strong> {pos.desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`p-6 rounded-xl border-2 ${isDark ? 'bg-yellow-900 border-yellow-600' : 'bg-yellow-50 border-yellow-400'}`}>
                  <p className={`text-lg font-semibold ${isDark ? 'text-yellow-300' : 'text-yellow-900'}`}>
                    {currentContent.what.warning}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Module: Why */}
          {activeModule === 'why' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {currentContent.why.title}
                </h2>
                <button
                  onClick={() => isPlaying.why ? stopAudio() : playAudio('why')}
                  className={`p-4 rounded-full transition-all ${
                    isDark
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
                  }`}
                >
                  {isPlaying.why ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
              </div>

              <div className="space-y-6">
                <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {currentContent.why.intro}
                </p>

                <div className="space-y-4">
                  {currentContent.why.reasons.map((reason, idx) => (
                    <div key={idx} className={`p-5 rounded-xl ${isDark ? 'bg-gray-700' : idx % 5 === 0 ? 'bg-purple-50' : idx % 5 === 1 ? 'bg-blue-50' : idx % 5 === 2 ? 'bg-green-50' : idx % 5 === 3 ? 'bg-orange-50' : 'bg-pink-50'}`}>
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{reason.icon}</span>
                        <div>
                          <h3 className={`font-semibold text-lg mb-2 ${isDark ? idx % 5 === 0 ? 'text-purple-300' : idx % 5 === 1 ? 'text-blue-300' : idx % 5 === 2 ? 'text-green-300' : idx % 5 === 3 ? 'text-orange-300' : 'text-pink-300' : idx % 5 === 0 ? 'text-purple-900' : idx % 5 === 1 ? 'text-blue-900' : idx % 5 === 2 ? 'text-green-900' : idx % 5 === 3 ? 'text-orange-900' : 'text-pink-900'}`}>
                            {reason.title}
                          </h3>
                          <p className={isDark ? 'text-gray-300' : idx % 5 === 0 ? 'text-purple-800' : idx % 5 === 1 ? 'text-blue-800' : idx % 5 === 2 ? 'text-green-800' : idx % 5 === 3 ? 'text-orange-800' : 'text-pink-800'}>
                            {reason.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`p-6 rounded-xl ${isDark ? 'bg-gradient-to-r from-purple-900 to-pink-900' : 'bg-gradient-to-r from-purple-500 to-pink-500'} text-white mt-8`}>
                  <h3 className="font-bold text-xl mb-3">{currentContent.why.takeawayTitle}</h3>
                  <p className="text-lg">
                    {currentContent.why.takeaway}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircularArrangementModule;