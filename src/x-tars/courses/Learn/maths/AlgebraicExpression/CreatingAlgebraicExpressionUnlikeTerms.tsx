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

    const apiKey = "";
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
    // Updated intro_message
    intro_message: "We have on the left scale 3 apples and an additional item of 1 gram, and on the right hand side, we have 13 grams.",
    explanation_line1: "For the left side, we have 3 apples and an additional weight of 1 gram. We can represent the total weight as 3 multiplied by the weight of one apple, plus 1.",
    explanation_line2: "On the right side, we have a known weight of 13 grams. Since the scale is balanced, we can use an equal sign.",
    explanation_line3: "How will you create an algebraic expression in this case?",
    // Removed "After a pause" from explanation_line4
    explanation_line4: "Weight of 3 Apples + 1 = 13.",
    explanation_line5: "To represent the unknown weight of one apple, we can assume it to be equal to 'x'.",
    explanation_line6: "This gives us the final algebraic expression:",
    startMessage: "Welcome to the interactive balance scale. Click start to begin the lesson.",
    lhs_label_apples: "3 * weight of one apple + 1",
    rhs_label_grams: "13g",
    final_equation: "3x + 1 = 13g"
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startLesson: "पाठ शुरू करें",
    reset: "🔄 रीसेट करें",
    // Updated intro_message
    intro_message: "बाईं ओर के पैमाने पर हमारे पास 3 सेब और 1 ग्राम का अतिरिक्त आइटम है, और दाईं ओर, हमारे पास 13 ग्राम हैं।",
    explanation_line1: "बाईं ओर के लिए, हमारे पास 3 सेब और 1 ग्राम का अतिरिक्त वजन है। हम कुल वजन को एक सेब के वजन के 3 गुना, प्लस 1 के रूप में दर्शा सकते हैं।",
    explanation_line2: "दाईं ओर, हमारे पास 13 ग्राम का ज्ञात वजन है। चूंकि तराजू संतुलित है, हम एक बराबर चिह्न का उपयोग कर सकते हैं।",
    explanation_line3: "आप इस मामले में बीजीय व्यंजक कैसे बनाएंगे?",
    // Removed "एक ठहराव के बाद" from explanation_line4
    explanation_line4: "3 सेब का वजन + 1 = 13।",
    explanation_line5: "एक सेब के अज्ञात वजन को दर्शाने के लिए, हम इसे 'x' के बराबर मान सकते हैं।",
    explanation_line6: "इससे हमें अंतिम बीजीय व्यंजक मिलता है:",
    startMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है। पाठ शुरू करने के लिए 'शुरू करें' पर क्लिक करें।",
    lhs_label_apples: "3 * एक सेब का वजन + 1",
    rhs_label_grams: "13 ग्राम",
    final_equation: "3x + 1 = 13 ग्राम"
  }
};

const RIGHT_SIDE_VALUE = 13;
const NUM_APPLES = 3;
const LEFT_ADDITIONAL_WEIGHT = 1;

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

  const audioContext = useRef(null);

  const t = useCallback((key) => {
    return translations[currentLanguage][key];
  }, [currentLanguage]);

  const speakMessage = useCallback(async (key) => {
    if (!userInteraction || !audioEnabled) return;
    const textToSpeak = t(key);
    
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
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
      
      const audioContent = await fetchTTS(textToSpeak, currentLanguage);
      if (audioContent && audioContext.current) {
        await playAudio(audioContent.audioData, audioContent.mimeType, audioContext.current);
      }
    } catch (error) {
      console.warn(`[Speech] Failed to play audio for "${key}":`, error);
    }
  }, [currentLanguage, userInteraction, audioEnabled, t]);

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

  useEffect(() => {
    if (isLessonStarted) {
      const runLessonSequence = async () => {
        if (audioEnabled && userInteraction) {
          try {
            if (audioContext.current?.state === 'suspended') {
              await audioContext.current.resume();
            }
          } catch (error) {
            console.warn("Failed to resume audio context:", error);
          }
          
          await speakMessage('intro_message');
          
          setTimeout(() => {
            setHighlightLeft(true);
            speakMessage('explanation_line1');
          }, 3000);

          setTimeout(() => {
            setHighlightLeft(false);
            setHighlightRight(true);
            speakMessage('explanation_line2');
          }, 6000);

          setTimeout(async () => {
            setHighlightRight(false);
            await speakMessage('explanation_line3'); // Ask user to create algebraic expression
          }, 9000);

          setTimeout(async () => {
            await speakMessage('explanation_line4'); // Provide the intermediate step
            setShowLhsExpression(true);
            setShowRhsExpression(true);
          }, 14000); // Increased pause for user thinking

          setTimeout(async () => {
            await speakMessage('explanation_line5'); // Introduce 'x'
          }, 18000);

          setTimeout(async () => {
            await speakMessage('explanation_line6'); // Final expression intro
          }, 21000);

          setTimeout(() => {
            setShowFinalEquation(true); // Display final equation
          }, 24000);
          
        } else {
            // Non-audio flow for immediate display
            setTimeout(() => {
                setShowLhsExpression(true);
                setShowRhsExpression(true);
            }, 14000);
            setTimeout(() => {
                setShowFinalEquation(true);
            }, 24000);
        }
      };
      runLessonSequence();
    }
  }, [isLessonStarted, speakMessage, audioEnabled, userInteraction]);

  const handleStartLesson = () => {
    setUserInteraction(true);
    setShowLesson(true);
    setIsLessonStarted(true);
    if (audioContext.current && audioEnabled) {
      audioContext.current.resume().catch(error => {
        console.warn("Failed to resume AudioContext:", error);
      });
    }
  };

  const handleReset = () => {
    setShowLesson(false);
    setIsLessonStarted(false);
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

  // Common Tailwind classes
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
            <div
              className={`absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg h-3 sm:h-4 md:h-5 rounded-full shadow-2xl transition-transform duration-700 ease-in-out ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}
              style={{ transform: `rotate(0deg)`, transformOrigin: 'center center' }}
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
              
              <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
              <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
            </div>

            {/* Chains */}
            <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg flex justify-between px-8"
                 style={{ transform: `rotate(0deg)`, transformOrigin: 'center center' }}>
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
            <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 w-full max-w-lg flex justify-between px-8"
                 style={{ transform: `rotate(0deg)`, transformOrigin: 'center center' }}>
              
              {/* Left Pan (3 Apples + 1g weight) */}
              <div
                className={`${panClasses} ${highlightClasses(true)} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
                style={{ transform: `rotate(0deg)` }}
              >
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-700'} opacity-60`}></div>
                
                {/* Modified: Apples stacked, 1g weight next to them */}
                <div className="absolute inset-4 flex flex-row items-center justify-center gap-2">
                  {/* Stacked Apples - Removed gap-1 */}
                  <div className="flex flex-col items-center justify-center"> 
                    {[...Array(NUM_APPLES)].map((_, i) => (
                      <span key={i} className="text-2xl sm:text-3xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🍎</span>
                    ))}
                  </div>
                  {/* 1g Weight */}
                  <div className={`px-2 py-1 rounded-md text-sm sm:text-base font-bold shadow-md ${theme === 'light' ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-200'}`}>
                    {LEFT_ADDITIONAL_WEIGHT}g
                  </div>
                </div>
              </div>

              {/* Right Pan (Fixed Value) */}
              <div
                className={`${panClasses} ${highlightClasses(false)} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
                style={{ transform: `rotate(0deg)` }}
              >
                <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-700'} opacity-60`}></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-1">⚖️</div>
                    <span className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'} drop-shadow-lg`}>
                      {RIGHT_SIDE_VALUE}g
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Balance indicator */}
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${
              true
                ? theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'
                : 'bg-orange-200 text-orange-800 border-2 border-orange-400'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <span className="font-bold text-sm sm:text-base">BALANCED!</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg mt-4 sm:mt-6 md:mt-8">
            {showLhsExpression && (
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center gap-4">
                    <span className={`text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {t('lhs_label_apples').split('=').shift()} {/* Take only "3 * weight of one apple + 1" */}
                    </span>
                    <span className={`text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        =
                    </span>
                    <span className={`text-sm sm:text-lg md:text-xl font-bold transition-colors duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {t('rhs_label_grams')}
                    </span>
                </div>
              </div>
            )}
            
            {showFinalEquation && (
              <div className={`mt-2 font-bold text-lg sm:text-xl md:text-2xl space-x-2`}>
                <span className={`font-extrabold text-3xl my-2 ${theme === 'light' ? 'text-green-800' : 'text-green-100'}`}>
                  {translations[currentLanguage].final_equation}
                </span>
              </div>
            )}
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