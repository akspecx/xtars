import React, { useState, useEffect, useRef, useCallback } from 'react';

// Helper to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper to convert PCM data to WAV Blob
const pcmToWav = (pcm16, sampleRate) => {
  const dataView = new DataView(new ArrayBuffer(44 + pcm16.byteLength));
  let offset = 0;

  function writeString(str) {
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  }

  function writeUint32(val) {
    dataView.setUint32(offset, val, true);
    offset += 4;
  }

  function writeUint16(val) {
    dataView.setUint16(offset, val, true);
    offset += 2;
  }

  // RIFF chunk
  writeString('RIFF');
  writeUint32(36 + pcm16.byteLength);
  writeString('WAVE');

  // fmt chunk
  writeString('fmt ');
  writeUint32(16);
  writeUint16(1); // Audio format 1 = PCM
  writeUint16(1); // Number of channels (mono)
  writeUint32(sampleRate);
  writeUint32(sampleRate * 2); // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
  writeUint16(2); // Block align (NumChannels * BitsPerSample/8)
  writeUint16(16); // Bits per sample

  // data chunk
  writeString('data');
  writeUint32(pcm16.byteLength);

  for (let i = 0; i < pcm16.length; i++) {
    dataView.setInt16(offset, pcm16[i], true); // Write PCM data
    offset += 2;
  }

  return new Blob([dataView], { type: 'audio/wav' });
};

// Function to play audio from base64 PCM data, returns a Promise that resolves when audio ends.
const playAudio = (audioData, mimeType, audioContext) => {
  return new Promise(async (resolve, reject) => {
    let audio = null;
    let audioUrl = null;

    try {
      const currentAudioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      if (currentAudioContext.state === 'suspended') {
        await currentAudioContext.resume();
      }

      const sampleRateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;

      const pcmData = base64ToArrayBuffer(audioData);
      const pcm16 = new Int16Array(pcmData);
      const wavBlob = pcmToWav(pcm16, sampleRate);
      audioUrl = URL.createObjectURL(wavBlob);
      audio = new Audio(audioUrl);

      const cleanup = () => {
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          audioUrl = null;
        }
        if (audio) {
          audio.onended = null;
          audio.onerror = null;
          audio = null;
        }
      };

      audio.onerror = (e) => {
        console.error("Audio error during playback:", e);
        cleanup();
        reject(new Error("Audio playback failed due to error event"));
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };

      await audio.play();
    } catch (playError) {
      console.error("Audio play failed, likely autoplay blocked or other issue:", playError);
      const modalId = `audio-play-modal-${Date.now()}`;
      const modal = document.createElement('div');
      modal.id = modalId;
      modal.className = `fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`;
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-xl text-center rounded-2xl">
          <p class="text-lg font-semibold mb-4 text-gray-800">Please interact with the page to enable audio playback</p>
          <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onclick="document.getElementById('${modalId}').remove();">OK</button>
        </div>
      `;
      document.body.appendChild(modal);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      reject(new Error("Audio play failed, user interaction needed or browser blocked autoplay"));
    }
  });
};

  // Mock TTS function to use a local API
  const fetchTTS = async (text, langCode) => {
    try {
      // For demo purposes, we'll use the Web Speech API as fallback
      if ('speechSynthesis' in window) {
        return new Promise((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = langCode === 'hi' ? 'hi-IN' : 'en-US';
          utterance.rate = 0.8;
          utterance.pitch = 1;
          
          utterance.onend = () => resolve(true);
          utterance.onerror = () => resolve(false);
          
          speechSynthesis.speak(utterance);
        });
      }

      // Original API code (requires API key)
      const payload = {
        contents: [{
          parts: [{ text: text }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" }
            }
          }
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      if (langCode === 'hi') {
        payload.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = "Leda";
        payload.contents[0].parts[0].text = `Say in Hindi: ${text}`;
      }

      // Note: API key needed for actual TTS functionality
      const apiKey = "";
      if (!apiKey) {
        console.warn("No API key provided, using Web Speech API fallback");
        return null;
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        return { audioData, mimeType };
      } else {
        console.warn("API response did not contain valid audio data.");
        return null;
      }
    } catch (error) {
      console.error("Failed to fetch TTS from API:", error);
      return null;
    }
  };

const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    startLesson: "Start Lesson",
    reset: "🔄 Reset",
    weight: "Weight of one apple = 2 grams",
    question: "Drag and drop apples to the left pan to balance the scale. How many apples do you need?",
    correct: "Excellent, the scale is balanced. You placed 3 Apples to balance the scale.",
    incorrect: (n) => `Hmm, ${n} apples is not enough. Try again! Put more apples to make it balanced.`,
    finalExplanation: "As you can see, 3 apples (3 x 2 grams = 6 grams) on the left side are equal to the 6 grams on the right side. This is the basic principle of algebraic equations.",
    startMessage: "Welcome to the interactive balance scale. Click start to begin the lesson.",
    dropHere: "Drop apples here",
    equation: "3 * Weight of one apple = 6 grams"
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startLesson: "पाठ शुरू करें",
    reset: "🔄 रीसेट करें",
    weight: "एक सेब का वजन = 2 ग्राम",
    question: "पैमाने को संतुलित करने के लिए सेब को बाईं ओर के पलड़े पर खींचें और छोड़ें। आपको कितने सेब की आवश्यकता है?",
    correct: "बहुत बढ़िया, पैमाना संतुलित है। आपने इसे संतुलित करने के लिए 3 सेब रखे हैं।",
    incorrect: (n) => `हम्म, ${n} सेब पर्याप्त नहीं हैं। पुनः प्रयास करें! इसे संतुलित करने के लिए और सेब रखें।`,
    finalExplanation: "जैसा कि आप देख सकते हैं, बाईं ओर के 3 सेब (3 x 2 ग्राम = 6 ग्राम) दाईं ओर के 6 ग्राम के बराबर हैं। यह बीजीय समीकरणों का मूल सिद्धांत है।",
    startMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है। पाठ शुरू करने के लिए 'शुरू करें' पर क्लिक करें।",
    dropHere: "यहां सेब गिराएं",
    equation: "3 * एक सेब का वजन = 6 ग्राम"
  }
};

const APPLE_WEIGHT = 2; // Fixed weight of each apple
const RIGHT_SIDE_VALUE = 6; // Fixed value on the right side

const App = () => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState('dark');
  const [placedApples, setPlacedApples] = useState([]); // Array to hold placed apples
  const [rightWeight, setRightWeight] = useState(RIGHT_SIDE_VALUE);
  const [feedback, setFeedback] = useState(null);
  const [showLesson, setShowLesson] = useState(false);
  const [isLessonStarted, setIsLessonStarted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [userInteraction, setUserInteraction] = useState(false);
  const [showEquation, setShowEquation] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const leftPanRef = useRef(null);
  const audioContext = useRef(null);

  const leftWeight = placedApples.length * APPLE_WEIGHT;

  const t = useCallback((key, params) => {
    const text = translations[currentLanguage][key];
    if (typeof text === 'function') {
      return text(params);
    }
    return text;
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key, params = null) => {
    // Only attempt TTS if audio is enabled and user has interacted
    if (!userInteraction || !audioEnabled) return;
    
    const textToSpeak = t(key, params);
    
    try {
      // Try Web Speech API first (built-in browser TTS)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        // Cancel any ongoing speech
        speechSynthesis.cancel();
        
        return new Promise((resolve) => {
          utterance.onend = () => resolve();
          utterance.onerror = (error) => {
            console.warn(`[Speech] Web Speech API error:`, error);
            resolve();
          };
          speechSynthesis.speak(utterance);
        });
      }
      
      // Fallback to custom TTS API
      const audioContent = await fetchTTS(textToSpeak, currentLanguage);
      if (audioContent && audioContext.current) {
        await playAudio(audioContent.audioData, audioContent.mimeType, audioContext.current);
      }
    } catch (error) {
      console.warn(`[Speech] Failed to play audio for "${key}":`, error);
      // Don't disable audio on Web Speech API failures, it's more reliable
    }
  }, [currentLanguage, userInteraction, audioEnabled, t]);

  // Initialize audio context early but don't block UI
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn("AudioContext not supported:", error);
        setAudioEnabled(false);
      }
    };

    if (!audioContext.current) {
      initAudio();
    }
  }, []);

  // Start lesson flow immediately when lesson starts, TTS in background
  useEffect(() => {
    if (isLessonStarted) {
      // Speak messages in background without blocking UI
      const runLessonSequence = async () => {
        if (audioEnabled && userInteraction) {
          // Resume audio context if needed
          try {
            if (audioContext.current?.state === 'suspended') {
              await audioContext.current.resume();
            }
          } catch (error) {
            console.warn("Failed to resume audio context:", error);
          }

          // Start TTS in background - don't await to avoid blocking
          speakMessage('weight');
          
          // Delay second message slightly
          setTimeout(() => {
            speakMessage('question');
          }, 1000);
        }
      };
      
      runLessonSequence();
    }
  }, [isLessonStarted, speakMessage, audioEnabled, userInteraction]);

  const handleDragStart = (e, appleId) => {
    e.dataTransfer.setData("text/plain", appleId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const newApples = [...placedApples, Date.now()]; // Add a new unique apple
    setPlacedApples(newApples);

    const newWeight = newApples.length * APPLE_WEIGHT;
    
    // Check for correct weight immediately
    if (newWeight === rightWeight) {
      setFeedback({ type: 'correct', message: t('correct') });
      setShowEquation(true);
      // Speak feedback in background
      speakMessage('correct');
    } else {
      setFeedback({ type: 'incorrect', message: t('incorrect', newApples.length) });
      setShowEquation(false);
      // Speak feedback in background
      speakMessage('incorrect', newApples.length);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleStartLesson = () => {
    // Set user interaction immediately
    setUserInteraction(true);
    
    // Show lesson immediately - no waiting for audio context
    setShowLesson(true);
    setIsLessonStarted(true);
    
    // Attempt to resume audio context in background if available
    if (audioContext.current && audioEnabled) {
      audioContext.current.resume().catch(error => {
        console.warn("Failed to resume AudioContext:", error);
        // Don't disable audio, just log the warning
      });
    }
  };

  const handleReset = () => {
    setPlacedApples([]);
    setFeedback(null);
    setIsLessonStarted(false);
    setShowLesson(false);
    setShowEquation(false);
  };

  const handleRemoveApple = (idToRemove) => {
    const newApples = placedApples.filter(id => id !== idToRemove);
    setPlacedApples(newApples);

    const newWeight = newApples.length * APPLE_WEIGHT;
    setFeedback(null);
    setShowEquation(false);

    if (newWeight === rightWeight) {
        setFeedback({ type: 'correct', message: t('correct') });
        setShowEquation(true);
        speakMessage('correct');
    } else if (newWeight > 0) {
      setFeedback({ type: 'incorrect', message: t('incorrect', newApples.length) });
      speakMessage('incorrect', newApples.length);
    }
  };

  const calculateTilt = () => {
    const balance = leftWeight - rightWeight;
    const tilt = (balance / rightWeight) * 15; // Tilt by 15 degrees max
    return Math.max(-15, Math.min(15, tilt));
  };

  const tilt = calculateTilt();
  const isBalanced = leftWeight === rightWeight;

  // Common Tailwind classes
  const containerClasses = `min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`;
  const themeSwitchClasses = `px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
  const buttonClasses = `px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl`;
  const panClasses = `relative flex flex-col items-center justify-center w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-10 rounded-lg border-2 sm:border-3 md:border-4 transition-all duration-700 ease-in-out shadow-lg ${theme === 'light' ? 'border-indigo-400 bg-indigo-200' : 'border-indigo-500 bg-indigo-700'}`;
  const panTextClasses = `text-lg sm:text-2xl md:text-3xl font-bold transition-colors duration-300 z-10 ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-100'}`;
  const feedbackClasses = (type) => `mt-4 p-4 rounded-lg shadow-xl text-center font-semibold text-lg sm:text-xl ${type === 'correct' ? 'bg-green-200 text-green-800 border border-green-400' : 'bg-red-200 text-red-800 border border-red-400'}`;
  const appleContainerClasses = `flex flex-wrap items-end justify-center gap-2 sm:gap-3 md:gap-4 mt-8`;

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
        {/* Audio toggle button */}
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
          {/* Highlighted weight information */}
          <div className={`text-center mb-6 p-4 rounded-xl shadow-lg border-2 max-w-md mx-auto ${theme === 'light' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-yellow-900 border-yellow-600 text-yellow-200'}`}>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">🍎</span>
              <div className="text-lg sm:text-xl font-bold">
                {t('weight')}
              </div>
              <span className="text-3xl">⚖️</span>
            </div>
            <div className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-300'}`}>
              Important: Remember this for solving the puzzle!
            </div>
          </div>

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
            <div
              className={`absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg h-3 sm:h-4 md:h-5 rounded-full shadow-2xl transition-transform duration-700 ease-in-out ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}
              style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}
            >
              {/* Beam highlights */}
              <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
              
              {/* Chain attachment points */}
              <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
              <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
            </div>

            {/* Chains */}
            <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg flex justify-between px-8"
                 style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
              {/* Left chain */}
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`left-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
              {/* Right chain */}
              <div className="flex flex-col items-center">
                {[...Array(3)].map((_, i) => (
                  <div key={`right-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
                ))}
              </div>
            </div>

            {/* The pans */}
            <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 w-full max-w-lg flex justify-between px-8"
                 style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
              
              {/* Left Pan (Drop Target) */}
              <div
                ref={leftPanRef}
                className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl transition-all duration-300 border-4 ${
                  isDragOver ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''
                } ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                style={{ transform: `rotate(${-tilt}deg)` }}
              >
                {/* Pan rim highlight */}
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                
                {/* Pan bottom */}
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-700'} opacity-60`}></div>
                
                <div className="absolute inset-4 flex flex-col items-center justify-center">
                  {placedApples.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-1 items-center">
                      {placedApples.map((id) => (
                        <span 
                          key={id} 
                          onClick={() => handleRemoveApple(id)} 
                          className="text-2xl sm:text-3xl cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-lg"
                          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                        >
                          🍎
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2 opacity-50">⬇️</div>
                      <span className={`text-xs sm:text-sm font-bold ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-100'} opacity-80`}>
                        {t('dropHere')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Pan (Fixed Value) */}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
                style={{ transform: `rotate(${-tilt}deg)` }}
              >
                {/* Pan rim highlight */}
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                
                {/* Pan bottom */}
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-700'} opacity-60`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-1">⚖️</div>
                    <span className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'} drop-shadow-lg`}>
                      {rightWeight}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance indicator */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${
              isBalanced 
                ? theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'
                : theme === 'light' ? 'bg-orange-200 text-orange-800 border-2 border-orange-400' : 'bg-orange-800 text-orange-200 border-2 border-orange-600'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{isBalanced ? '✅' : '⚖️'}</span>
                <span className="font-bold text-sm sm:text-base">
                  {isBalanced ? 'BALANCED!' : 'NOT BALANCED'}
                </span>
              </div>
            </div>
          </div>
          
          <p className={`text-center text-lg sm:text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t('question')}</p>
          
          {feedback && (
            <div className={feedbackClasses(feedback.type)}>
              {feedback.message}
            </div>
          )}

          {showEquation && (
            <div className={`mt-4 p-4 rounded-lg shadow-xl text-center font-bold text-xl sm:text-2xl ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-100'}`}>
                {t('equation')}
            </div>
          )}
          
          <div className={appleContainerClasses}>
            <div className="text-center">
              <span className={`text-5xl cursor-grab active:cursor-grabbing transition-transform transform hover:scale-110 mb-2 block`} draggable onDragStart={handleDragStart}>
                🍎
              </span>
              <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                Apple
              </span>
            </div>
          </div>

          <button
            onClick={handleReset}
            className={`mt-8 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
              ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-400' : 'bg-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'}`}
          >
            {t('reset')}
          </button>
        </>
      )}
    </div>
  );
};

export default App;