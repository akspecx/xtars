// // // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';

// // // // // // // Helper to convert base64 to ArrayBuffer
// // // // // // const base64ToArrayBuffer = (base64) => {
// // // // // //   const binaryString = window.atob(base64);
// // // // // //   const len = binaryString.length;
// // // // // //   const bytes = new Uint8Array(len);
// // // // // //   for (let i = 0; i < len; i++) {
// // // // // //     bytes[i] = binaryString.charCodeAt(i);
// // // // // //   }
// // // // // //   return bytes.buffer;
// // // // // // };

// // // // // // // Helper to convert PCM data to WAV Blob
// // // // // // const pcmToWav = (pcm16, sampleRate) => {
// // // // // //   const dataView = new DataView(new ArrayBuffer(44 + pcm16.byteLength));
// // // // // //   let offset = 0;

// // // // // //   function writeString(str) {
// // // // // //     for (let i = 0; i < str.length; i++) {
// // // // // //       dataView.setUint8(offset + i, str.charCodeAt(i));
// // // // // //     }
// // // // // //     offset += str.length;
// // // // // //   }

// // // // // //   function writeUint32(val) {
// // // // // //     dataView.setUint32(offset, val, true);
// // // // // //     offset += 4;
// // // // // //   }

// // // // // //   function writeUint16(val) {
// // // // // //     dataView.setUint16(offset, val, true);
// // // // // //     offset += 2;
// // // // // //   }

// // // // // //   // RIFF chunk
// // // // // //   writeString('RIFF');
// // // // // //   writeUint32(36 + pcm16.byteLength);
// // // // // //   writeString('WAVE');

// // // // // //   // fmt chunk
// // // // // //   writeString('fmt ');
// // // // // //   writeUint32(16);
// // // // // //   writeUint16(1); // Audio format 1 = PCM
// // // // // //   writeUint16(1); // Number of channels (mono)
// // // // // //   writeUint32(sampleRate);
// // // // // //   writeUint32(sampleRate * 2); // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
// // // // // //   writeUint16(2); // Block align (NumChannels * BitsPerSample/8)
// // // // // //   writeUint16(16); // Bits per sample

// // // // // //   // data chunk
// // // // // //   writeString('data');
// // // // // //   writeUint32(pcm16.byteLength);

// // // // // //   for (let i = 0; i < pcm16.length; i++) {
// // // // // //     dataView.setInt16(offset, pcm16[i], true); // Write PCM data
// // // // // //     offset += 2;
// // // // // //   }

// // // // // //   return new Blob([dataView], { type: 'audio/wav' });
// // // // // // };

// // // // // // // Function to play audio from base64 PCM data, returns a Promise that resolves when audio ends.
// // // // // // const playAudio = (audioData, mimeType, audioContext) => {
// // // // // //   return new Promise(async (resolve, reject) => {
// // // // // //     let audio = null;
// // // // // //     let audioUrl = null;

// // // // // //     try {
// // // // // //       const currentAudioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
// // // // // //       if (currentAudioContext.state === 'suspended') {
// // // // // //         await currentAudioContext.resume();
// // // // // //       }

// // // // // //       const sampleRateMatch = mimeType.match(/rate=(\d+)/);
// // // // // //       const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;

// // // // // //       const pcmData = base64ToArrayBuffer(audioData);
// // // // // //       const pcm16 = new Int16Array(pcmData);
// // // // // //       const wavBlob = pcmToWav(pcm16, sampleRate);
// // // // // //       audioUrl = URL.createObjectURL(wavBlob);
// // // // // //       audio = new Audio(audioUrl);

// // // // // //       const cleanup = () => {
// // // // // //         if (audioUrl) {
// // // // // //           URL.revokeObjectURL(audioUrl);
// // // // // //           audioUrl = null;
// // // // // //         }
// // // // // //         if (audio) {
// // // // // //           audio.onended = null;
// // // // // //           audio.onerror = null;
// // // // // //           audio = null;
// // // // // //         }
// // // // // //       };

// // // // // //       audio.onerror = (e) => {
// // // // // //         console.error("Audio error during playback:", e);
// // // // // //         cleanup();
// // // // // //         reject(new Error("Audio playback failed due to error event"));
// // // // // //       };

// // // // // //       audio.onended = () => {
// // // // // //         cleanup();
// // // // // //         resolve();
// // // // // //       };

// // // // // //       await audio.play();
// // // // // //     } catch (playError) {
// // // // // //       console.error("Audio play failed, likely autoplay blocked or other issue:", playError);
// // // // // //       const modalId = `audio-play-modal-${Date.now()}`;
// // // // // //       const modal = document.createElement('div');
// // // // // //       modal.id = modalId;
// // // // // //       modal.className = `fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`;
// // // // // //       modal.innerHTML = `
// // // // // //         <div class="bg-white p-6 rounded-lg shadow-xl text-center rounded-2xl">
// // // // // //           <p class="text-lg font-semibold mb-4 text-gray-800">Please interact with the page to enable audio playback</p>
// // // // // //           <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onclick="document.getElementById('${modalId}').remove();">OK</button>
// // // // // //         </div>
// // // // // //       `;
// // // // // //       document.body.appendChild(modal);
// // // // // //       if (audioUrl) URL.revokeObjectURL(audioUrl);
// // // // // //       reject(new Error("Audio play failed, user interaction needed or browser blocked autoplay"));
// // // // // //     }
// // // // // //   });
// // // // // // };

// // // // // //   // Mock TTS function to use a local API
// // // // // //   const fetchTTS = async (text, langCode) => {
// // // // // //     try {
// // // // // //       // For demo purposes, we'll use the Web Speech API as fallback
// // // // // //       if ('speechSynthesis' in window) {
// // // // // //         return new Promise((resolve) => {
// // // // // //           const utterance = new SpeechSynthesisUtterance(text);
// // // // // //           utterance.lang = langCode === 'hi' ? 'hi-IN' : 'en-US';
// // // // // //           utterance.rate = 0.8;
// // // // // //           utterance.pitch = 1;
          
// // // // // //           utterance.onend = () => resolve(true);
// // // // // //           utterance.onerror = () => resolve(false);
          
// // // // // //           speechSynthesis.speak(utterance);
// // // // // //         });
// // // // // //       }

// // // // // //       // Original API code (requires API key)
// // // // // //       const payload = {
// // // // // //         contents: [{
// // // // // //           parts: [{ text: text }]
// // // // // //         }],
// // // // // //         generationConfig: {
// // // // // //           responseModalities: ["AUDIO"],
// // // // // //           speechConfig: {
// // // // // //             voiceConfig: {
// // // // // //               prebuiltVoiceConfig: { voiceName: "Kore" }
// // // // // //             }
// // // // // //           }
// // // // // //         },
// // // // // //         model: "gemini-2.5-flash-preview-tts"
// // // // // //       };

// // // // // //       if (langCode === 'hi') {
// // // // // //         payload.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = "Leda";
// // // // // //         payload.contents[0].parts[0].text = `Say in Hindi: ${text}`;
// // // // // //       }

// // // // // //       // Note: API key needed for actual TTS functionality
// // // // // //       const apiKey = "";
// // // // // //       if (!apiKey) {
// // // // // //         console.warn("No API key provided, using Web Speech API fallback");
// // // // // //         return null;
// // // // // //       }

// // // // // //       const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

// // // // // //       const response = await fetch(apiUrl, {
// // // // // //         method: 'POST',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify(payload)
// // // // // //       });

// // // // // //       if (!response.ok) {
// // // // // //         throw new Error(`API call failed with status: ${response.status}`);
// // // // // //       }

// // // // // //       const result = await response.json();
// // // // // //       const part = result?.candidates?.[0]?.content?.parts?.[0];
// // // // // //       const audioData = part?.inlineData?.data;
// // // // // //       const mimeType = part?.inlineData?.mimeType;

// // // // // //       if (audioData && mimeType && mimeType.startsWith("audio/")) {
// // // // // //         return { audioData, mimeType };
// // // // // //       } else {
// // // // // //         console.warn("API response did not contain valid audio data.");
// // // // // //         return null;
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error("Failed to fetch TTS from API:", error);
// // // // // //       return null;
// // // // // //     }
// // // // // //   };

// // // // // // const translations = {
// // // // // //   en: {
// // // // // //     scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
// // // // // //     selectLanguage: "Select Language",
// // // // // //     changeTheme: "Change Theme",
// // // // // //     startLesson: "Start Lesson",
// // // // // //     reset: "🔄 Reset",
// // // // // //     weight: "Weight of one apple = 2 grams",
// // // // // //     question: "Drag and drop apples to the left pan to balance the scale. How many apples do you need?",
// // // // // //     correct: "Excellent, the scale is balanced. You placed 3 Apples to balance the scale.",
// // // // // //     incorrect: (n) => `Hmm, ${n} apples is not enough. Try again! Put more apples to make it balanced.`,
// // // // // //     finalExplanation: "As you can see, 3 apples (3 x 2 grams = 6 grams) on the left side are equal to the 6 grams on the right side. This is the basic principle of algebraic equations.",
// // // // // //     startMessage: "Welcome to the interactive balance scale. Click start to begin the lesson.",
// // // // // //     dropHere: "Drop apples here",
// // // // // //     equation: "3 * Weight of one apple = 6 grams"
// // // // // //   },
// // // // // //   hi: {
// // // // // //     scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
// // // // // //     selectLanguage: "भाषा चुनें",
// // // // // //     changeTheme: "थीम बदलें",
// // // // // //     startLesson: "पाठ शुरू करें",
// // // // // //     reset: "🔄 रीसेट करें",
// // // // // //     weight: "एक सेब का वजन = 2 ग्राम",
// // // // // //     question: "पैमाने को संतुलित करने के लिए सेब को बाईं ओर के पलड़े पर खींचें और छोड़ें। आपको कितने सेब की आवश्यकता है?",
// // // // // //     correct: "बहुत बढ़िया, पैमाना संतुलित है। आपने इसे संतुलित करने के लिए 3 सेब रखे हैं।",
// // // // // //     incorrect: (n) => `हम्म, ${n} सेब पर्याप्त नहीं हैं। पुनः प्रयास करें! इसे संतुलित करने के लिए और सेब रखें।`,
// // // // // //     finalExplanation: "जैसा कि आप देख सकते हैं, बाईं ओर के 3 सेब (3 x 2 ग्राम = 6 ग्राम) दाईं ओर के 6 ग्राम के बराबर हैं। यह बीजीय समीकरणों का मूल सिद्धांत है।",
// // // // // //     startMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है। पाठ शुरू करने के लिए 'शुरू करें' पर क्लिक करें।",
// // // // // //     dropHere: "यहां सेब गिराएं",
// // // // // //     equation: "3 * एक सेब का वजन = 6 ग्राम"
// // // // // //   }
// // // // // // };

// // // // // // const APPLE_WEIGHT = 2; // Fixed weight of each apple
// // // // // // const RIGHT_SIDE_VALUE = 6; // Fixed value on the right side

// // // // // // const App = () => {
// // // // // //   const [currentLanguage, setCurrentLanguage] = useState('en');
// // // // // //   const [theme, setTheme] = useState('dark');
// // // // // //   const [placedApples, setPlacedApples] = useState([]); // Array to hold placed apples
// // // // // //   const [rightWeight, setRightWeight] = useState(RIGHT_SIDE_VALUE);
// // // // // //   const [feedback, setFeedback] = useState(null);
// // // // // //   const [showLesson, setShowLesson] = useState(false);
// // // // // //   const [isLessonStarted, setIsLessonStarted] = useState(false);
// // // // // //   const [isDragOver, setIsDragOver] = useState(false);
// // // // // //   const [userInteraction, setUserInteraction] = useState(false);
// // // // // //   const [showEquation, setShowEquation] = useState(false);
// // // // // //   const [audioEnabled, setAudioEnabled] = useState(true);

// // // // // //   const leftPanRef = useRef(null);
// // // // // //   const audioContext = useRef(null);

// // // // // //   const leftWeight = placedApples.length * APPLE_WEIGHT;

// // // // // //   const t = useCallback((key, params) => {
// // // // // //     const text = translations[currentLanguage][key];
// // // // // //     if (typeof text === 'function') {
// // // // // //       return text(params);
// // // // // //     }
// // // // // //     return text;
// // // // // //   }, [currentLanguage]);

// // // // // //   const speakMessage = useCallback(async (key, params = null) => {
// // // // // //     // Only attempt TTS if audio is enabled and user has interacted
// // // // // //     if (!userInteraction || !audioEnabled) return;
    
// // // // // //     const textToSpeak = t(key, params);
    
// // // // // //     try {
// // // // // //       // Try Web Speech API first (built-in browser TTS)
// // // // // //       if ('speechSynthesis' in window) {
// // // // // //         const utterance = new SpeechSynthesisUtterance(textToSpeak);
// // // // // //         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
// // // // // //         utterance.rate = 0.8;
// // // // // //         utterance.pitch = 1;
// // // // // //         utterance.volume = 0.8;
        
// // // // // //         // Cancel any ongoing speech
// // // // // //         speechSynthesis.cancel();
        
// // // // // //         return new Promise((resolve) => {
// // // // // //           utterance.onend = () => resolve();
// // // // // //           utterance.onerror = (error) => {
// // // // // //             console.warn(`[Speech] Web Speech API error:`, error);
// // // // // //             resolve();
// // // // // //           };
// // // // // //           speechSynthesis.speak(utterance);
// // // // // //         });
// // // // // //       }
      
// // // // // //       // Fallback to custom TTS API
// // // // // //       const audioContent = await fetchTTS(textToSpeak, currentLanguage);
// // // // // //       if (audioContent && audioContext.current) {
// // // // // //         await playAudio(audioContent.audioData, audioContent.mimeType, audioContext.current);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.warn(`[Speech] Failed to play audio for "${key}":`, error);
// // // // // //       // Don't disable audio on Web Speech API failures, it's more reliable
// // // // // //     }
// // // // // //   }, [currentLanguage, userInteraction, audioEnabled, t]);

// // // // // //   // Initialize audio context early but don't block UI
// // // // // //   useEffect(() => {
// // // // // //     const initAudio = () => {
// // // // // //       try {
// // // // // //         audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
// // // // // //       } catch (error) {
// // // // // //         console.warn("AudioContext not supported:", error);
// // // // // //         setAudioEnabled(false);
// // // // // //       }
// // // // // //     };

// // // // // //     if (!audioContext.current) {
// // // // // //       initAudio();
// // // // // //     }
// // // // // //   }, []);

// // // // // //   // Start lesson flow immediately when lesson starts, TTS in background
// // // // // //   useEffect(() => {
// // // // // //     if (isLessonStarted) {
// // // // // //       // Speak messages in background without blocking UI
// // // // // //       const runLessonSequence = async () => {
// // // // // //         if (audioEnabled && userInteraction) {
// // // // // //           // Resume audio context if needed
// // // // // //           try {
// // // // // //             if (audioContext.current?.state === 'suspended') {
// // // // // //               await audioContext.current.resume();
// // // // // //             }
// // // // // //           } catch (error) {
// // // // // //             console.warn("Failed to resume audio context:", error);
// // // // // //           }

// // // // // //           // Start TTS in background - don't await to avoid blocking
// // // // // //           speakMessage('weight');
          
// // // // // //           // Delay second message slightly
// // // // // //           setTimeout(() => {
// // // // // //             speakMessage('question');
// // // // // //           }, 1000);
// // // // // //         }
// // // // // //       };
      
// // // // // //       runLessonSequence();
// // // // // //     }
// // // // // //   }, [isLessonStarted, speakMessage, audioEnabled, userInteraction]);

// // // // // //   const handleDragStart = (e, appleId) => {
// // // // // //     e.dataTransfer.setData("text/plain", appleId);
// // // // // //   };

// // // // // //   const handleDrop = (e) => {
// // // // // //     e.preventDefault();
// // // // // //     setIsDragOver(false);

// // // // // //     const newApples = [...placedApples, Date.now()]; // Add a new unique apple
// // // // // //     setPlacedApples(newApples);

// // // // // //     const newWeight = newApples.length * APPLE_WEIGHT;
    
// // // // // //     // Check for correct weight immediately
// // // // // //     if (newWeight === rightWeight) {
// // // // // //       setFeedback({ type: 'correct', message: t('correct') });
// // // // // //       setShowEquation(true);
// // // // // //       // Speak feedback in background
// // // // // //       speakMessage('correct');
// // // // // //     } else {
// // // // // //       setFeedback({ type: 'incorrect', message: t('incorrect', newApples.length) });
// // // // // //       setShowEquation(false);
// // // // // //       // Speak feedback in background
// // // // // //       speakMessage('incorrect', newApples.length);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleDragOver = (e) => {
// // // // // //     e.preventDefault();
// // // // // //     setIsDragOver(true);
// // // // // //   };

// // // // // //   const handleDragLeave = () => {
// // // // // //     setIsDragOver(false);
// // // // // //   };

// // // // // //   const handleStartLesson = () => {
// // // // // //     // Set user interaction immediately
// // // // // //     setUserInteraction(true);
    
// // // // // //     // Show lesson immediately - no waiting for audio context
// // // // // //     setShowLesson(true);
// // // // // //     setIsLessonStarted(true);
    
// // // // // //     // Attempt to resume audio context in background if available
// // // // // //     if (audioContext.current && audioEnabled) {
// // // // // //       audioContext.current.resume().catch(error => {
// // // // // //         console.warn("Failed to resume AudioContext:", error);
// // // // // //         // Don't disable audio, just log the warning
// // // // // //       });
// // // // // //     }
// // // // // //   };

// // // // // //   const handleReset = () => {
// // // // // //     setPlacedApples([]);
// // // // // //     setFeedback(null);
// // // // // //     setIsLessonStarted(false);
// // // // // //     setShowLesson(false);
// // // // // //     setShowEquation(false);
// // // // // //   };

// // // // // //   const handleRemoveApple = (idToRemove) => {
// // // // // //     const newApples = placedApples.filter(id => id !== idToRemove);
// // // // // //     setPlacedApples(newApples);

// // // // // //     const newWeight = newApples.length * APPLE_WEIGHT;
// // // // // //     setFeedback(null);
// // // // // //     setShowEquation(false);

// // // // // //     if (newWeight === rightWeight) {
// // // // // //         setFeedback({ type: 'correct', message: t('correct') });
// // // // // //         setShowEquation(true);
// // // // // //         speakMessage('correct');
// // // // // //     } else if (newWeight > 0) {
// // // // // //       setFeedback({ type: 'incorrect', message: t('incorrect', newApples.length) });
// // // // // //       speakMessage('incorrect', newApples.length);
// // // // // //     }
// // // // // //   };

// // // // // //   const calculateTilt = () => {
// // // // // //     const balance = leftWeight - rightWeight;
// // // // // //     const tilt = (balance / rightWeight) * 15; // Tilt by 15 degrees max
// // // // // //     return Math.max(-15, Math.min(15, tilt));
// // // // // //   };

// // // // // //   const tilt = calculateTilt();
// // // // // //   const isBalanced = leftWeight === rightWeight;

// // // // // //   // Common Tailwind classes
// // // // // //   const containerClasses = `min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`;
// // // // // //   const themeSwitchClasses = `px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
// // // // // //   const buttonClasses = `px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl`;
// // // // // //   const panClasses = `relative flex flex-col items-center justify-center w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-10 rounded-lg border-2 sm:border-3 md:border-4 transition-all duration-700 ease-in-out shadow-lg ${theme === 'light' ? 'border-indigo-400 bg-indigo-200' : 'border-indigo-500 bg-indigo-700'}`;
// // // // // //   const panTextClasses = `text-lg sm:text-2xl md:text-3xl font-bold transition-colors duration-300 z-10 ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-100'}`;
// // // // // //   const feedbackClasses = (type) => `mt-4 p-4 rounded-lg shadow-xl text-center font-semibold text-lg sm:text-xl ${type === 'correct' ? 'bg-green-200 text-green-800 border border-green-400' : 'bg-red-200 text-red-800 border border-red-400'}`;
// // // // // //   const appleContainerClasses = `flex flex-wrap items-end justify-center gap-2 sm:gap-3 md:gap-4 mt-8`;

// // // // // //   return (
// // // // // //     <div className={containerClasses}>
// // // // // //       <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-sm sm:max-w-none sm:w-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
// // // // // //         <div className="flex items-center gap-2 justify-center sm:justify-start">
// // // // // //           <label htmlFor="language-select" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
// // // // // //             {t('selectLanguage')}:
// // // // // //           </label>
// // // // // //           <select
// // // // // //             id="language-select"
// // // // // //             value={currentLanguage}
// // // // // //             onChange={(e) => {
// // // // // //               setCurrentLanguage(e.target.value);
// // // // // //               handleReset();
// // // // // //             }}
// // // // // //             className={`p-1 sm:p-2 border rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
// // // // // //           >
// // // // // //             <option value="en">English</option>
// // // // // //             <option value="hi">हिन्दी</option>
// // // // // //           </select>
// // // // // //         </div>
// // // // // //         <button
// // // // // //           onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
// // // // // //           className={themeSwitchClasses}
// // // // // //         >
// // // // // //           {t('changeTheme')} ({theme === 'light' ? 'Dark' : 'Light'})
// // // // // //         </button>
// // // // // //         {/* Audio toggle button */}
// // // // // //         <button
// // // // // //           onClick={() => setAudioEnabled(!audioEnabled)}
// // // // // //           className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
// // // // // //         >
// // // // // //           🔊 {audioEnabled ? 'ON' : 'OFF'}
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight transition-colors duration-300 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
// // // // // //         {t('scaleTitle')}
// // // // // //       </h2>

// // // // // //       {!showLesson ? (
// // // // // //         <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
// // // // // //           <p className="text-xl sm:text-2xl font-semibold">{t('startMessage')}</p>
// // // // // //           <button onClick={handleStartLesson} className={buttonClasses}>
// // // // // //             {t('startLesson')}
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       ) : (
// // // // // //         <>
// // // // // //           {/* Highlighted weight information */}
// // // // // //           <div className={`text-center mb-6 p-4 rounded-xl shadow-lg border-2 max-w-md mx-auto ${theme === 'light' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-yellow-900 border-yellow-600 text-yellow-200'}`}>
// // // // // //             <div className="flex items-center justify-center gap-3">
// // // // // //               <span className="text-3xl">🍎</span>
// // // // // //               <div className="text-lg sm:text-xl font-bold">
// // // // // //                 {t('weight')}
// // // // // //               </div>
// // // // // //               <span className="text-3xl">⚖️</span>
// // // // // //             </div>
// // // // // //             <div className={`text-sm mt-2 font-medium ${theme === 'light' ? 'text-yellow-700' : 'text-yellow-300'}`}>
// // // // // //               Important: Remember this for solving the puzzle!
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <div className="relative w-full max-w-2xl h-64 sm:h-72 md:h-80 flex items-center justify-center mb-8">
// // // // // //             {/* Base/Stand */}
// // // // // //             <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 sm:w-40 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
            
// // // // // //             {/* Vertical Support */}
// // // // // //             <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-20 sm:w-5 sm:h-24 md:w-6 md:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
            
// // // // // //             {/* Fulcrum */}
// // // // // //             <div className={`absolute bottom-32 sm:bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-xl border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
// // // // // //               <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
// // // // // //             </div>
            
// // // // // //             {/* Main beam */}
// // // // // //             <div
// // // // // //               className={`absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg h-3 sm:h-4 md:h-5 rounded-full shadow-2xl transition-transform duration-700 ease-in-out ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}
// // // // // //               style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}
// // // // // //             >
// // // // // //               {/* Beam highlights */}
// // // // // //               <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
              
// // // // // //               {/* Chain attachment points */}
// // // // // //               <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
// // // // // //               <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
// // // // // //             </div>

// // // // // //             {/* Chains */}
// // // // // //             <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg flex justify-between px-8"
// // // // // //                  style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
// // // // // //               {/* Left chain */}
// // // // // //               <div className="flex flex-col items-center">
// // // // // //                 {[...Array(3)].map((_, i) => (
// // // // // //                   <div key={`left-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //               {/* Right chain */}
// // // // // //               <div className="flex flex-col items-center">
// // // // // //                 {[...Array(3)].map((_, i) => (
// // // // // //                   <div key={`right-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
// // // // // //                 ))}
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             {/* The pans */}
// // // // // //             <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 w-full max-w-lg flex justify-between px-8"
// // // // // //                  style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
              
// // // // // //               {/* Left Pan (Drop Target) */}
// // // // // //               <div
// // // // // //                 ref={leftPanRef}
// // // // // //                 className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl transition-all duration-300 border-4 ${
// // // // // //                   isDragOver ? 'ring-4 ring-blue-400 ring-opacity-50 scale-105' : ''
// // // // // //                 } ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
// // // // // //                 onDrop={handleDrop}
// // // // // //                 onDragOver={handleDragOver}
// // // // // //                 onDragLeave={handleDragLeave}
// // // // // //                 style={{ transform: `rotate(${-tilt}deg)` }}
// // // // // //               >
// // // // // //                 {/* Pan rim highlight */}
// // // // // //                 <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                
// // // // // //                 {/* Pan bottom */}
// // // // // //                 <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-700'} opacity-60`}></div>
                
// // // // // //                 <div className="absolute inset-4 flex flex-col items-center justify-center">
// // // // // //                   {placedApples.length > 0 ? (
// // // // // //                     <div className="flex flex-wrap justify-center gap-1 items-center">
// // // // // //                       {placedApples.map((id) => (
// // // // // //                         <span 
// // // // // //                           key={id} 
// // // // // //                           onClick={() => handleRemoveApple(id)} 
// // // // // //                           className="text-2xl sm:text-3xl cursor-pointer hover:scale-125 transition-transform duration-200 drop-shadow-lg"
// // // // // //                           style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
// // // // // //                         >
// // // // // //                           🍎
// // // // // //                         </span>
// // // // // //                       ))}
// // // // // //                     </div>
// // // // // //                   ) : (
// // // // // //                     <div className="text-center">
// // // // // //                       <div className="text-4xl mb-2 opacity-50">⬇️</div>
// // // // // //                       <span className={`text-xs sm:text-sm font-bold ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-100'} opacity-80`}>
// // // // // //                         {t('dropHere')}
// // // // // //                       </span>
// // // // // //                     </div>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               </div>

// // // // // //               {/* Right Pan (Fixed Value) */}
// // // // // //               <div
// // // // // //                 className={`relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl border-4 ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
// // // // // //                 style={{ transform: `rotate(${-tilt}deg)` }}
// // // // // //               >
// // // // // //                 {/* Pan rim highlight */}
// // // // // //                 <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
                
// // // // // //                 {/* Pan bottom */}
// // // // // //                 <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-700'} opacity-60`}></div>
                
// // // // // //                 <div className="absolute inset-0 flex flex-col items-center justify-center">
// // // // // //                   <div className="text-center">
// // // // // //                     <div className="text-3xl sm:text-4xl mb-1">⚖️</div>
// // // // // //                     <span className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'} drop-shadow-lg`}>
// // // // // //                       {rightWeight}g
// // // // // //                     </span>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             {/* Balance indicator */}
// // // // // //             <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${
// // // // // //               isBalanced 
// // // // // //                 ? theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'
// // // // // //                 : theme === 'light' ? 'bg-orange-200 text-orange-800 border-2 border-orange-400' : 'bg-orange-800 text-orange-200 border-2 border-orange-600'
// // // // // //             }`}>
// // // // // //               <div className="flex items-center gap-2">
// // // // // //                 <span className="text-lg">{isBalanced ? '✅' : '⚖️'}</span>
// // // // // //                 <span className="font-bold text-sm sm:text-base">
// // // // // //                   {isBalanced ? 'BALANCED!' : 'NOT BALANCED'}
// // // // // //                 </span>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
          
// // // // // //           <p className={`text-center text-lg sm:text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t('question')}</p>
          
// // // // // //           {feedback && (
// // // // // //             <div className={feedbackClasses(feedback.type)}>
// // // // // //               {feedback.message}
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {showEquation && (
// // // // // //             <div className={`mt-4 p-4 rounded-lg shadow-xl text-center font-bold text-xl sm:text-2xl ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-100'}`}>
// // // // // //                 {t('equation')}
// // // // // //             </div>
// // // // // //           )}
          
// // // // // //           <div className={appleContainerClasses}>
// // // // // //             <div className="text-center">
// // // // // //               <span className={`text-5xl cursor-grab active:cursor-grabbing transition-transform transform hover:scale-110 mb-2 block`} draggable onDragStart={handleDragStart}>
// // // // // //                 🍎
// // // // // //               </span>
// // // // // //               <span className={`text-lg font-bold ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
// // // // // //                 Apple
// // // // // //               </span>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           <button
// // // // // //             onClick={handleReset}
// // // // // //             className={`mt-8 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
// // // // // //               ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-400' : 'bg-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'}`}
// // // // // //           >
// // // // // //             {t('reset')}
// // // // // //           </button>
// // // // // //         </>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default App;

// // // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // import {
// // // // //   RefreshCcw, CheckCircle2, 
// // // // //   Hand, Play, MousePointer2, 
// // // // //   Timer, ChevronRight, Shuffle, 
// // // // //   FastForward, XCircle, Scale,
// // // // //   Trophy, Sparkles, Volume2, VolumeX,
// // // // //   Clock
// // // // // } from 'lucide-react';

// // // // // // --- Assets & Configuration ---
// // // // // const FRUIT_LIBRARY = [
// // // // //   { icon: '🍎', name: 'Apple', weight: 2 },
// // // // //   { icon: '🍊', name: 'Orange', weight: 3 },
// // // // //   { icon: '🍐', name: 'Pear', weight: 4 },
// // // // //   { icon: '🍓', name: 'Strawberry', weight: 1 },
// // // // //   { icon: '🍋', name: 'Lemon', weight: 5 },
// // // // // ];

// // // // // export default function App() {
// // // // //   const [mode, setMode] = useState('practice'); 
// // // // //   const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
// // // // //   const [targetWeight, setTargetWeight] = useState(6);
// // // // //   const [placedCount, setPlacedCount] = useState(0); 
// // // // //   const [isBalanced, setIsBalanced] = useState(false);
// // // // //   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
// // // // //   const [autoNextTimer, setAutoNextTimer] = useState(null);
// // // // //   const [virtualHandPos, setVirtualHandPos] = useState(null);
// // // // //   const [isGrabbing, setIsGrabbing] = useState(false);
// // // // //   const [isMuted, setIsMuted] = useState(false);
  
// // // // //   const timerIntervalRef = useRef(null);
// // // // //   const leftPanRef = useRef(null);
// // // // //   const appleSourceRef = useRef(null);
// // // // //   const tutorialActiveRef = useRef(false);
// // // // //   const modeRef = useRef(mode);

// // // // //   useEffect(() => { modeRef.current = mode; }, [mode]);

// // // // //   const leftWeight = placedCount * currentFruit.weight;
// // // // //   const weightDiff = targetWeight - leftWeight;
// // // // //   // Tilt physics: 1g difference = ~7.5 degrees
// // // // //   const rotation = Math.max(-22, Math.min(22, weightDiff * 7.5));

// // // // //   // --- TTS Logic ---
// // // // //   const speakMessage = useCallback(async (text) => {
// // // // //     if (isMuted) return;
// // // // //     if ('speechSynthesis' in window) {
// // // // //       window.speechSynthesis.cancel();
// // // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // // //       utterance.rate = 0.95;
// // // // //       utterance.pitch = 1.1;
// // // // //       speechSynthesis.speak(utterance);
// // // // //     }
// // // // //   }, [isMuted]);

// // // // //   // --- Shuffle & Reset Logic ---
// // // // //   const shuffleMission = useCallback(() => {
// // // // //     const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
// // // // //     // Pick a random target quantity (1, 2, 3, or 4) for dynamic gameplay
// // // // //     const randomQuantity = Math.floor(Math.random() * 4) + 1;
// // // // //     const newTarget = randomFruit.weight * randomQuantity;

// // // // //     setCurrentFruit(randomFruit);
// // // // //     setTargetWeight(newTarget);
// // // // //     setPlacedCount(0);
// // // // //     setIsBalanced(false);
// // // // //     setAutoNextTimer(null);
// // // // //     setIsAutoPlaying(false);
// // // // //     setIsGrabbing(false);
// // // // //     tutorialActiveRef.current = false;
// // // // //     setVirtualHandPos(null);
    
// // // // //     speakMessage(`New mission! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
// // // // //   }, [speakMessage]);

// // // // //   const resetLevel = useCallback(() => {
// // // // //     setPlacedCount(0);
// // // // //     setIsBalanced(false);
// // // // //     setAutoNextTimer(null);
// // // // //     setIsAutoPlaying(false);
// // // // //     setIsGrabbing(false);
// // // // //     tutorialActiveRef.current = false;
// // // // //     setVirtualHandPos(null);
// // // // //     speakMessage(`Balance the scale. ${currentFruit.name}s are ${currentFruit.weight} grams each.`);
// // // // //   }, [currentFruit, speakMessage]);

// // // // //   // --- Logic Hooks ---
// // // // //   useEffect(() => {
// // // // //     if (leftWeight === targetWeight && !isBalanced) {
// // // // //       setIsBalanced(true);
// // // // //       speakMessage(`Perfect! It took ${placedCount} ${currentFruit.name}s to balance the scale!`);
// // // // //       setAutoNextTimer(10);
// // // // //     } else if (leftWeight !== targetWeight) {
// // // // //       setIsBalanced(false);
// // // // //       setAutoNextTimer(null);
// // // // //     }
// // // // //   }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

// // // // //   const addItem = useCallback((isTutorial = false) => {
// // // // //     if (!isTutorial && isAutoPlaying) return;
// // // // //     if (isTutorial && modeRef.current !== 'concept') return;

// // // // //     setPlacedCount(prev => {
// // // // //         if (prev >= 12) return prev;
// // // // //         const newVal = prev + 1;
// // // // //         const newWeight = newVal * currentFruit.weight;
// // // // //         if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
// // // // //         else if (newWeight > targetWeight) speakMessage("Too heavy!");
// // // // //         return newVal;
// // // // //     });
// // // // //   }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

// // // // //   const moveHand = async (fromRect, toRect) => {
// // // // //     if (modeRef.current !== 'concept') return;
// // // // //     setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
// // // // //     await new Promise(r => setTimeout(r, 800));
// // // // //     if (modeRef.current !== 'concept') return;
// // // // //     setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
// // // // //     await new Promise(r => setTimeout(r, 1200));
// // // // //   };

// // // // //   const startConceptBuilding = useCallback(async () => {
// // // // //     if (tutorialActiveRef.current || isBalanced) return;
// // // // //     tutorialActiveRef.current = true;
// // // // //     setIsAutoPlaying(true);

// // // // //     await new Promise(r => setTimeout(r, 1500));
// // // // //     if (modeRef.current !== 'concept' || isBalanced) {
// // // // //         tutorialActiveRef.current = false;
// // // // //         setIsAutoPlaying(false);
// // // // //         return;
// // // // //     }

// // // // //     speakMessage(`Goal: ${targetWeight} grams. Let's build the concept.`);
// // // // //     await new Promise(r => setTimeout(r, 2500));

// // // // //     const needed = targetWeight / currentFruit.weight;

// // // // //     for (let i = 0; i < needed; i++) {
// // // // //         if (modeRef.current !== 'concept' || isBalanced) break;
// // // // //         if (!appleSourceRef.current || !leftPanRef.current) break;
        
// // // // //         const sourceRect = appleSourceRef.current.getBoundingClientRect();
// // // // //         const targetRect = leftPanRef.current.getBoundingClientRect();
        
// // // // //         // 1. Move Hand to Source
// // // // //         setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
// // // // //         await new Promise(r => setTimeout(r, 1000));
        
// // // // //         if (modeRef.current !== 'concept') break;

// // // // //         // 2. "Grab" the item
// // // // //         setIsGrabbing(true);
// // // // //         await new Promise(r => setTimeout(r, 500));

// // // // //         // 3. Move Hand (with item) to Pan
// // // // //         setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
// // // // //         await new Promise(r => setTimeout(r, 1200));

// // // // //         if (modeRef.current !== 'concept') break;

// // // // //         // 4. "Drop" the item and update state
// // // // //         setIsGrabbing(false);
// // // // //         addItem(true);
// // // // //         await new Promise(r => setTimeout(r, 800));
// // // // //     }

// // // // //     setIsAutoPlaying(false);
// // // // //     setVirtualHandPos(null);
// // // // //     setIsGrabbing(false);
// // // // //     tutorialActiveRef.current = false;
// // // // //   }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

// // // // //   useEffect(() => {
// // // // //     if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
// // // // //       const t = setTimeout(startConceptBuilding, 1500);
// // // // //       return () => clearTimeout(t);
// // // // //     } else if (mode === 'practice') {
// // // // //       setIsAutoPlaying(false);
// // // // //       setIsGrabbing(false);
// // // // //       setVirtualHandPos(null);
// // // // //       tutorialActiveRef.current = false;
// // // // //     }
// // // // //   }, [mode, isBalanced, startConceptBuilding]);

// // // // //   useEffect(() => {
// // // // //     if (autoNextTimer !== null && autoNextTimer > 0) {
// // // // //       timerIntervalRef.current = setTimeout(() => {
// // // // //         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
// // // // //       }, 1000);
// // // // //     } else if (autoNextTimer === 0) {
// // // // //       shuffleMission();
// // // // //     }
// // // // //     return () => { if (timerIntervalRef.current) clearTimeout(timerIntervalRef.current); };
// // // // //   }, [autoNextTimer, shuffleMission]);

// // // // //   // --- REFINED DRAG AND DROP HIT DETECTION ---
// // // // //   const handleDragEnd = useCallback((event, info) => {
// // // // //     if (isAutoPlaying || isBalanced) return;

// // // // //     if (!leftPanRef.current) return;

// // // // //     // Get the bounding box of the target pan
// // // // //     const panRect = leftPanRef.current.getBoundingClientRect();
    
// // // // //     // Add a generous buffer for hit detection (approx 20% extra space)
// // // // //     const buffer = 40; 
// // // // //     const isOverPan = 
// // // // //       info.point.x >= panRect.left - buffer && 
// // // // //       info.point.x <= panRect.right + buffer && 
// // // // //       info.point.y >= panRect.top - buffer && 
// // // // //       info.point.y <= panRect.bottom + buffer;

// // // // //     // Alternative: Check if the element at the release point is part of the pan
// // // // //     const elementAtPoint = document.elementFromPoint(info.point.x, info.point.y);
// // // // //     const isDirectHit = leftPanRef.current.contains(elementAtPoint);

// // // // //     if (isOverPan || isDirectHit) {
// // // // //       addItem();
// // // // //     }
// // // // //   }, [isAutoPlaying, isBalanced, addItem]);

// // // // //   return (
// // // // //     <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
// // // // //       {/* HEADER */}
// // // // //       <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
// // // // //         <div className="flex items-center gap-2">
// // // // //           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
// // // // //             <Scale size={24} />
// // // // //           </div>
// // // // //           <div>
// // // // //             <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
// // // // //             <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest">Matte Wooden Station</p>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
// // // // //             <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
// // // // //                 <button onClick={() => { setMode('concept'); resetLevel(); }}
// // // // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // // // //                     CONCEPT BUILDING
// // // // //                 </button>
// // // // //                 <button onClick={() => { setMode('practice'); resetLevel(); }}
// // // // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // // // //                     PRACTICE
// // // // //                 </button>
// // // // //             </div>
// // // // //             <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
// // // // //                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
// // // // //             </button>
// // // // //             <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
// // // // //                 <RefreshCcw size={16} />
// // // // //             </button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* THE STAGE */}
// // // // //       <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
// // // // //         <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
// // // // //         <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
// // // // //             <Clock size={32} />
// // // // //             <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
// // // // //         </div>

// // // // //         {/* SCALE AREA */}
// // // // //         <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
// // // // //             <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
// // // // //                 <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
// // // // //                 <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
// // // // //                 <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
// // // // //             </div>

// // // // //             <div className="relative w-full flex justify-center z-20 mt-[12%]">
// // // // //                 <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
// // // // //                     className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
// // // // //                     style={{ originX: 0.5, originY: 0.5 }}>
// // // // //                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
// // // // //                     {/* LEFT PAN */}
// // // // //                     <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // // // //                         <div className="flex justify-between w-[80%] px-4">
// // // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // // // //                         </div>
// // // // //                         <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // // // //                             <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
// // // // //                                 {[...Array(placedCount)].map((_, i) => (
// // // // //                                     <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
// // // // //                                 ))}
// // // // //                             </div>
// // // // //                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
// // // // //                         </div>
// // // // //                     </motion.div>

// // // // //                     {/* RIGHT PAN */}
// // // // //                     <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // // // //                         <div className="flex justify-between w-[80%] px-4">
// // // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // // // //                         </div>
// // // // //                         <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // // // //                              <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
// // // // //                              <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
// // // // //                         </div>
// // // // //                     </motion.div>
// // // // //                 </motion.div>
// // // // //             </div>
// // // // //         </div>

// // // // //         {/* MESSAGING AREA */}
// // // // //         <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none">
// // // // //             <AnimatePresence mode="wait">
// // // // //                 {isBalanced ? (
// // // // //                     <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg px-4">
// // // // //                         <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
// // // // //                             <Trophy size={20} className="animate-bounce shrink-0" />
// // // // //                             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
// // // // //                                 <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80">Balanced!</span>
// // // // //                                 <span className="text-xs sm:text-lg font-bold">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
// // // // //                             </div>
// // // // //                             <Sparkles size={16} className="text-yellow-300 shrink-0" />
// // // // //                         </div>
// // // // //                     </motion.div>
// // // // //                 ) : (
// // // // //                     <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-full shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
// // // // //                         <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
// // // // //                     </motion.div>
// // // // //                 )}
// // // // //             </AnimatePresence>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* DEPOT */}
// // // // //       <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
// // // // //         <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
// // // // //             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Depot</div>
// // // // //             <div className="flex items-center gap-8 sm:gap-16">
// // // // //                 <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
// // // // //                     <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
// // // // //                     <div className="flex items-center gap-2">
// // // // //                         <span className="text-3xl sm:text-5xl">{currentFruit.icon}</span>
// // // // //                         <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter">= {currentFruit.weight}g</span>
// // // // //                     </div>
// // // // //                 </div>
// // // // //                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40">
// // // // //                    {!isBalanced && mode !== 'concept' && (
// // // // //                      <motion.div 
// // // // //                         ref={appleSourceRef} 
// // // // //                         drag 
// // // // //                         dragSnapToOrigin 
// // // // //                         onDragEnd={handleDragEnd} 
// // // // //                         whileHover={{ scale: 1.1 }} 
// // // // //                         whileDrag={{ scale: 1.3, zIndex: 1000 }}
// // // // //                         className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing drop-shadow-xl z-[60]"
// // // // //                       >
// // // // //                         {currentFruit.icon}
// // // // //                       </motion.div>
// // // // //                    )}
// // // // //                    {(isBalanced || mode === 'concept') && (
// // // // //                      <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center">{currentFruit.icon}</div>
// // // // //                    )}
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* NAVIGATION */}
// // // // //       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
// // // // //           <div className="flex flex-col gap-1">
// // // // //             <button onClick={() => shuffleMission()} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
// // // // //               <div className="flex items-center gap-3 z-10">
// // // // //                 <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
// // // // //                 <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
// // // // //               </div>
// // // // //               <div className="flex items-center relative z-10">
// // // // //                 {autoNextTimer !== null ? (
// // // // //                   <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
// // // // //                     <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono">{autoNextTimer}</span></div>
// // // // //                     <div className="flex justify-between w-full px-3 relative">
// // // // //                         {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
// // // // //                         <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl">🏃</motion.div>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
// // // // //               </div>
// // // // //             </button>
// // // // //           </div>
// // // // //           <div className="flex flex-col gap-1">
// // // // //             <button onClick={() => shuffleMission()} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
// // // // //               <Shuffle size={20} />
// // // // //               <span className="uppercase tracking-tighter">Shuffle</span>
// // // // //             </button>
// // // // //           </div>
// // // // //       </div>

// // // // //       {/* VIRTUAL HAND & DRAGGING ITEM */}
// // // // //       <AnimatePresence>
// // // // //         {mode === 'concept' && virtualHandPos && (
// // // // //             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
// // // // //                 transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
// // // // //                 <div className="relative flex items-center justify-center">
// // // // //                     <Hand className="text-stone-800 w-9 h-9 sm:w-20 sm:h-20" fill="white" />
// // // // //                     <AnimatePresence>
// // // // //                       {isGrabbing && (
// // // // //                         <motion.div 
// // // // //                           initial={{ scale: 0, opacity: 0 }}
// // // // //                           animate={{ scale: 1, opacity: 1 }}
// // // // //                           exit={{ scale: 0, opacity: 0 }}
// // // // //                           className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61]"
// // // // //                         >
// // // // //                           {currentFruit.icon}
// // // // //                         </motion.div>
// // // // //                       )}
// // // // //                     </AnimatePresence>
// // // // //                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
// // // // //                 </div>
// // // // //             </motion.div>
// // // // //         )}
// // // // //       </AnimatePresence>

// // // // //       <style>{`
// // // // //         .no-scrollbar::-webkit-scrollbar { display: none; }
// // // // //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// // // // //       `}</style>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // import {
// // // //   RefreshCcw, CheckCircle2, 
// // // //   Hand, Play, MousePointer2, 
// // // //   Timer, ChevronRight, Shuffle, 
// // // //   FastForward, XCircle, Scale,
// // // //   Trophy, Sparkles, Volume2, VolumeX,
// // // //   Clock
// // // // } from 'lucide-react';

// // // // // --- Assets & Configuration ---
// // // // const FRUIT_LIBRARY = [
// // // //   { icon: '🍎', name: 'Apple', weight: 2 },
// // // //   { icon: '🍊', name: 'Orange', weight: 3 },
// // // //   { icon: '🍐', name: 'Pear', weight: 4 },
// // // //   { icon: '🍓', name: 'Strawberry', weight: 1 },
// // // //   { icon: '🍋', name: 'Lemon', weight: 5 },
// // // // ];

// // // // export default function App() {
// // // //   const [mode, setMode] = useState('practice'); 
// // // //   const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
// // // //   const [targetWeight, setTargetWeight] = useState(6);
// // // //   const [placedCount, setPlacedCount] = useState(0); 
// // // //   const [isBalanced, setIsBalanced] = useState(false);
// // // //   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
// // // //   const [autoNextTimer, setAutoNextTimer] = useState(null);
// // // //   const [virtualHandPos, setVirtualHandPos] = useState(null);
// // // //   const [isGrabbing, setIsGrabbing] = useState(false);
// // // //   const [isMuted, setIsMuted] = useState(false);
  
// // // //   const timerIntervalRef = useRef(null);
// // // //   const leftPanRef = useRef(null);
// // // //   const appleSourceRef = useRef(null);
// // // //   const tutorialActiveRef = useRef(false);
// // // //   const modeRef = useRef(mode);

// // // //   // Sync ref with state for async loops
// // // //   useEffect(() => { modeRef.current = mode; }, [mode]);

// // // //   const leftWeight = placedCount * currentFruit.weight;
// // // //   const weightDiff = targetWeight - leftWeight;
// // // //   const rotation = Math.max(-22, Math.min(22, weightDiff * 6));

// // // //   // --- Audio ---
// // // //   const speakMessage = useCallback(async (text) => {
// // // //     if (isMuted) return;
// // // //     if ('speechSynthesis' in window) {
// // // //       window.speechSynthesis.cancel();
// // // //       const utterance = new SpeechSynthesisUtterance(text);
// // // //       utterance.rate = 0.95;
// // // //       utterance.pitch = 1.1;
// // // //       speechSynthesis.speak(utterance);
// // // //     }
// // // //   }, [isMuted]);

// // // //   // --- Logic Functions ---
// // // //   const shuffleMission = useCallback(() => {
// // // //     const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
// // // //     const randomQuantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 fruits
// // // //     const newTarget = randomFruit.weight * randomQuantity;

// // // //     setCurrentFruit(randomFruit);
// // // //     setTargetWeight(newTarget);
// // // //     setPlacedCount(0);
// // // //     setIsBalanced(false);
// // // //     setAutoNextTimer(null);
// // // //     setIsAutoPlaying(false);
// // // //     setIsGrabbing(false);
// // // //     tutorialActiveRef.current = false;
// // // //     setVirtualHandPos(null);
    
// // // //     speakMessage(`New challenge! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
// // // //   }, [speakMessage]);

// // // //   const resetLevel = useCallback(() => {
// // // //     setPlacedCount(0);
// // // //     setIsBalanced(false);
// // // //     setAutoNextTimer(null);
// // // //     setIsAutoPlaying(false);
// // // //     setIsGrabbing(false);
// // // //     tutorialActiveRef.current = false;
// // // //     setVirtualHandPos(null);
// // // //     speakMessage(`Let's balance the scale!`);
// // // //   }, [speakMessage]);

// // // //   // --- Effect Hooks ---
// // // //   useEffect(() => {
// // // //     if (leftWeight === targetWeight && !isBalanced) {
// // // //       setIsBalanced(true);
// // // //       speakMessage(`Balanced! ${placedCount} ${currentFruit.name}s was the answer!`);
// // // //       setAutoNextTimer(10);
// // // //     } else if (leftWeight !== targetWeight) {
// // // //       setIsBalanced(false);
// // // //       setAutoNextTimer(null);
// // // //     }
// // // //   }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

// // // //   const addItem = useCallback((isTutorial = false) => {
// // // //     if (!isTutorial && isAutoPlaying) return;
// // // //     if (isTutorial && modeRef.current !== 'concept') return;

// // // //     setPlacedCount(prev => {
// // // //         if (prev >= 15) return prev;
// // // //         const newVal = prev + 1;
// // // //         const newWeight = newVal * currentFruit.weight;
// // // //         if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
// // // //         else if (newWeight > targetWeight) speakMessage("Too heavy!");
// // // //         return newVal;
// // // //     });
// // // //   }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

// // // //   const startConceptBuilding = useCallback(async () => {
// // // //     if (tutorialActiveRef.current || isBalanced) return;
// // // //     tutorialActiveRef.current = true;
// // // //     setIsAutoPlaying(true);

// // // //     await new Promise(r => setTimeout(r, 1500));
// // // //     if (modeRef.current !== 'concept' || isBalanced) {
// // // //         tutorialActiveRef.current = false;
// // // //         setIsAutoPlaying(false);
// // // //         return;
// // // //     }

// // // //     speakMessage(`Building concept... Target is ${targetWeight} grams.`);
// // // //     await new Promise(r => setTimeout(r, 2000));

// // // //     const needed = targetWeight / currentFruit.weight;

// // // //     for (let i = 0; i < needed; i++) {
// // // //         if (modeRef.current !== 'concept' || isBalanced) break;
// // // //         if (!appleSourceRef.current || !leftPanRef.current) break;
        
// // // //         const sourceRect = appleSourceRef.current.getBoundingClientRect();
// // // //         const targetRect = leftPanRef.current.getBoundingClientRect();
        
// // // //         // Step 1: Move to Source
// // // //         setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
// // // //         await new Promise(r => setTimeout(r, 1000));
// // // //         if (modeRef.current !== 'concept') break;

// // // //         // Step 2: Grab
// // // //         setIsGrabbing(true);
// // // //         await new Promise(r => setTimeout(r, 500));

// // // //         // Step 3: Move to Pan
// // // //         setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
// // // //         await new Promise(r => setTimeout(r, 1200));
// // // //         if (modeRef.current !== 'concept') break;

// // // //         // Step 4: Drop
// // // //         setIsGrabbing(false);
// // // //         addItem(true);
// // // //         await new Promise(r => setTimeout(r, 800));
// // // //     }

// // // //     setIsAutoPlaying(false);
// // // //     setVirtualHandPos(null);
// // // //     setIsGrabbing(false);
// // // //     tutorialActiveRef.current = false;
// // // //   }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

// // // //   useEffect(() => {
// // // //     if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
// // // //       const t = setTimeout(startConceptBuilding, 1500);
// // // //       return () => clearTimeout(t);
// // // //     } else if (mode === 'practice') {
// // // //       setIsAutoPlaying(false);
// // // //       setIsGrabbing(false);
// // // //       setVirtualHandPos(null);
// // // //       tutorialActiveRef.current = false;
// // // //     }
// // // //   }, [mode, isBalanced, startConceptBuilding]);

// // // //   useEffect(() => {
// // // //     if (autoNextTimer !== null && autoNextTimer > 0) {
// // // //       timerIntervalRef.current = setInterval(() => {
// // // //         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
// // // //       }, 1000);
// // // //     } else if (autoNextTimer === 0) {
// // // //       shuffleMission();
// // // //     }
// // // //     return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
// // // //   }, [autoNextTimer, shuffleMission]);

// // // //   // --- ROBUST DRAG END HANDLER ---
// // // //   const handleDragEnd = (event, info) => {
// // // //     if (isAutoPlaying || isBalanced || mode !== 'practice') return;

// // // //     if (!leftPanRef.current) return;

// // // //     // Get pan bounds in viewport space
// // // //     const panRect = leftPanRef.current.getBoundingClientRect();
    
// // // //     // Generous magnetic drop zone (buffer)
// // // //     const buffer = 60; 
// // // //     const isOverTarget = 
// // // //       info.point.x >= panRect.left - buffer && 
// // // //       info.point.x <= panRect.right + buffer && 
// // // //       info.point.y >= panRect.top - buffer && 
// // // //       info.point.y <= panRect.bottom + buffer;

// // // //     if (isOverTarget) {
// // // //       addItem();
// // // //     }
// // // //   };

// // // //   return (
// // // //     <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
// // // //       {/* HEADER */}
// // // //       <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
// // // //         <div className="flex items-center gap-2">
// // // //           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
// // // //             <Scale size={24} />
// // // //           </div>
// // // //           <div>
// // // //             <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
// // // //             <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest">Matte Wooden Station</p>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
// // // //             <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
// // // //                 <button onClick={() => { setMode('concept'); resetLevel(); }}
// // // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // // //                     CONCEPT BUILDING
// // // //                 </button>
// // // //                 <button onClick={() => { setMode('practice'); resetLevel(); }}
// // // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // // //                     PRACTICE
// // // //                 </button>
// // // //             </div>
// // // //             <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
// // // //                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
// // // //             </button>
// // // //             <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
// // // //                 <RefreshCcw size={16} />
// // // //             </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* STAGE */}
// // // //       <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
// // // //         <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
// // // //         <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
// // // //             <Clock size={32} />
// // // //             <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
// // // //         </div>

// // // //         {/* SCALE ASSEMBLY */}
// // // //         <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
// // // //             <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
// // // //                 <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
// // // //                 <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
// // // //                 <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
// // // //             </div>

// // // //             <div className="relative w-full flex justify-center z-20 mt-[12%]">
// // // //                 <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
// // // //                     className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
// // // //                     style={{ originX: 0.5, originY: 0.5 }}>
// // // //                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
// // // //                     {/* LOAD PAN */}
// // // //                     <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // // //                         <div className="flex justify-between w-[80%] px-4">
// // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // // //                         </div>
// // // //                         <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // // //                             <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
// // // //                                 {[...Array(placedCount)].map((_, i) => (
// // // //                                     <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
// // // //                                 ))}
// // // //                             </div>
// // // //                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
// // // //                         </div>
// // // //                     </motion.div>

// // // //                     {/* MASTER PAN */}
// // // //                     <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // // //                         <div className="flex justify-between w-[80%] px-4">
// // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // // //                         </div>
// // // //                         <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // // //                              <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
// // // //                              <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
// // // //                         </div>
// // // //                     </motion.div>
// // // //                 </motion.div>
// // // //             </div>
// // // //         </div>

// // // //         {/* BOTTOM COMMUNICATION ZONE */}
// // // //         <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none px-4">
// // // //             <AnimatePresence mode="wait">
// // // //                 {isBalanced ? (
// // // //                     <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
// // // //                         <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
// // // //                             <Trophy size={24} className="animate-bounce shrink-0" />
// // // //                             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
// // // //                                 <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80">Success!</span>
// // // //                                 <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
// // // //                             </div>
// // // //                             <Sparkles size={20} className="text-yellow-300 shrink-0" />
// // // //                         </div>
// // // //                     </motion.div>
// // // //                 ) : (
// // // //                     <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
// // // //                         <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
// // // //                     </motion.div>
// // // //                 )}
// // // //             </AnimatePresence>
// // // //         </div>
// // // //       </div>

// // // //       {/* DEPOT AREA */}
// // // //       <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
// // // //         <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
// // // //             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Bin</div>
// // // //             <div className="flex items-center gap-8 sm:gap-16">
// // // //                 <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
// // // //                     <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
// // // //                     <div className="flex items-center gap-2">
// // // //                         <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
// // // //                         <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter">= {currentFruit.weight}g</span>
// // // //                     </div>
// // // //                 </div>
// // // //                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
// // // //                    {/* Draggable Fruit in Practice Mode */}
// // // //                    {!isBalanced && mode === 'practice' && (
// // // //                      <motion.div 
// // // //                         ref={appleSourceRef} 
// // // //                         drag 
// // // //                         dragSnapToOrigin 
// // // //                         onDragEnd={handleDragEnd} 
// // // //                         whileHover={{ scale: 1.15 }} 
// // // //                         whileDrag={{ scale: 1.3, zIndex: 1000, cursor: 'grabbing' }}
// // // //                         className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing drop-shadow-2xl z-[60] select-none"
// // // //                       >
// // // //                         {currentFruit.icon}
// // // //                       </motion.div>
// // // //                    )}
// // // //                    {/* Visual Ghost/Reference in Concept Mode */}
// // // //                    {(isBalanced || mode === 'concept') && (
// // // //                      <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">{currentFruit.icon}</div>
// // // //                    )}
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //       </div>

// // // //       {/* NAVIGATION BAR */}
// // // //       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
// // // //           <button onClick={shuffleMission} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
// // // //             <div className="flex items-center gap-3 z-10">
// // // //               <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
// // // //               <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
// // // //             </div>
// // // //             <div className="flex items-center relative z-10">
// // // //               {autoNextTimer !== null ? (
// // // //                 <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
// // // //                   <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono">{autoNextTimer}</span></div>
// // // //                   <div className="flex justify-between w-full px-3 relative">
// // // //                       {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
// // // //                       <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl">🏃</motion.div>
// // // //                   </div>
// // // //                 </div>
// // // //               ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
// // // //             </div>
// // // //           </button>
// // // //           <button onClick={shuffleMission} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
// // // //             <Shuffle size={20} />
// // // //             <span className="uppercase tracking-tighter">Shuffle Lab</span>
// // // //           </button>
// // // //       </div>

// // // //       {/* VIRTUAL HAND GUIDE */}
// // // //       <AnimatePresence>
// // // //         {mode === 'concept' && virtualHandPos && (
// // // //             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
// // // //                 transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
// // // //                 <div className="relative flex items-center justify-center">
// // // //                     {/* Proportionally smaller hand */}
// // // //                     <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
// // // //                     <AnimatePresence>
// // // //                       {isGrabbing && (
// // // //                         <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
// // // //                           className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61] opacity-100">
// // // //                           {currentFruit.icon}
// // // //                         </motion.div>
// // // //                       )}
// // // //                     </AnimatePresence>
// // // //                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
// // // //                 </div>
// // // //             </motion.div>
// // // //         )}
// // // //       </AnimatePresence>

// // // //       <style>{`
// // // //         .no-scrollbar::-webkit-scrollbar { display: none; }
// // // //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// // // //       `}</style>
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import {
// // //   RefreshCcw, CheckCircle2, 
// // //   Hand, Play, MousePointer2, 
// // //   Timer, ChevronRight, Shuffle, 
// // //   FastForward, XCircle, Scale,
// // //   Trophy, Sparkles, Volume2, VolumeX,
// // //   Clock
// // // } from 'lucide-react';

// // // // --- Assets & Configuration ---
// // // const FRUIT_LIBRARY = [
// // //   { icon: '🍎', name: 'Apple', weight: 2 },
// // //   { icon: '🍊', name: 'Orange', weight: 3 },
// // //   { icon: '🍐', name: 'Pear', weight: 4 },
// // //   { icon: '🍓', name: 'Strawberry', weight: 1 },
// // //   { icon: '🍋', name: 'Lemon', weight: 5 },
// // // ];

// // // export default function App() {
// // //   const [mode, setMode] = useState('practice'); 
// // //   const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
// // //   const [targetWeight, setTargetWeight] = useState(6);
// // //   const [placedCount, setPlacedCount] = useState(0); 
// // //   const [isBalanced, setIsBalanced] = useState(false);
// // //   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
// // //   const [autoNextTimer, setAutoNextTimer] = useState(null);
// // //   const [virtualHandPos, setVirtualHandPos] = useState(null);
// // //   const [isGrabbing, setIsGrabbing] = useState(false);
// // //   const [isMuted, setIsMuted] = useState(false);
  
// // //   const timerIntervalRef = useRef(null);
// // //   const leftPanRef = useRef(null);
// // //   const appleSourceRef = useRef(null);
// // //   const tutorialActiveRef = useRef(false);
// // //   const modeRef = useRef(mode);

// // //   // Sync ref with state for async loops
// // //   useEffect(() => { modeRef.current = mode; }, [mode]);

// // //   const leftWeight = placedCount * currentFruit.weight;
// // //   const weightDiff = targetWeight - leftWeight;
// // //   const rotation = Math.max(-22, Math.min(22, weightDiff * 6));

// // //   // --- Audio ---
// // //   const speakMessage = useCallback(async (text) => {
// // //     if (isMuted) return;
// // //     if ('speechSynthesis' in window) {
// // //       window.speechSynthesis.cancel();
// // //       const utterance = new SpeechSynthesisUtterance(text);
// // //       utterance.rate = 0.95;
// // //       utterance.pitch = 1.1;
// // //       speechSynthesis.speak(utterance);
// // //     }
// // //   }, [isMuted]);

// // //   // --- Logic Functions ---
// // //   const shuffleMission = useCallback(() => {
// // //     const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
// // //     const randomQuantity = Math.floor(Math.random() * 3) + 1; // 1 to 3 fruits
// // //     const newTarget = randomFruit.weight * randomQuantity;

// // //     setCurrentFruit(randomFruit);
// // //     setTargetWeight(newTarget);
// // //     setPlacedCount(0);
// // //     setIsBalanced(false);
// // //     setAutoNextTimer(null);
// // //     setIsAutoPlaying(false);
// // //     setIsGrabbing(false);
// // //     tutorialActiveRef.current = false;
// // //     setVirtualHandPos(null);
    
// // //     speakMessage(`New challenge! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
// // //   }, [speakMessage]);

// // //   const resetLevel = useCallback(() => {
// // //     setPlacedCount(0);
// // //     setIsBalanced(false);
// // //     setAutoNextTimer(null);
// // //     setIsAutoPlaying(false);
// // //     setIsGrabbing(false);
// // //     tutorialActiveRef.current = false;
// // //     setVirtualHandPos(null);
// // //     speakMessage(`Let's balance the scale!`);
// // //   }, [speakMessage]);

// // //   // --- Effect Hooks ---
// // //   useEffect(() => {
// // //     if (leftWeight === targetWeight && !isBalanced) {
// // //       setIsBalanced(true);
// // //       speakMessage(`Balanced! ${placedCount} ${currentFruit.name}s was the answer!`);
// // //       setAutoNextTimer(10);
// // //     } else if (leftWeight !== targetWeight) {
// // //       setIsBalanced(false);
// // //       setAutoNextTimer(null);
// // //     }
// // //   }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

// // //   const addItem = useCallback((isTutorial = false) => {
// // //     if (!isTutorial && isAutoPlaying) return;
// // //     if (isTutorial && modeRef.current !== 'concept') return;

// // //     setPlacedCount(prev => {
// // //         if (prev >= 15) return prev;
// // //         const newVal = prev + 1;
// // //         const newWeight = newVal * currentFruit.weight;
// // //         if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
// // //         else if (newWeight > targetWeight) speakMessage("Too heavy!");
// // //         return newVal;
// // //     });
// // //   }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

// // //   const startConceptBuilding = useCallback(async () => {
// // //     if (tutorialActiveRef.current || isBalanced) return;
// // //     tutorialActiveRef.current = true;
// // //     setIsAutoPlaying(true);

// // //     await new Promise(r => setTimeout(r, 1500));
// // //     if (modeRef.current !== 'concept' || isBalanced) {
// // //         tutorialActiveRef.current = false;
// // //         setIsAutoPlaying(false);
// // //         return;
// // //     }

// // //     speakMessage(`Building concept... Target is ${targetWeight} grams.`);
// // //     await new Promise(r => setTimeout(r, 2000));

// // //     const needed = targetWeight / currentFruit.weight;

// // //     for (let i = 0; i < needed; i++) {
// // //         if (modeRef.current !== 'concept' || isBalanced) break;
// // //         if (!appleSourceRef.current || !leftPanRef.current) break;
        
// // //         const sourceRect = appleSourceRef.current.getBoundingClientRect();
// // //         const targetRect = leftPanRef.current.getBoundingClientRect();
        
// // //         // Step 1: Move to Source
// // //         setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
// // //         await new Promise(r => setTimeout(r, 1000));
// // //         if (modeRef.current !== 'concept') break;

// // //         // Step 2: Grab
// // //         setIsGrabbing(true);
// // //         await new Promise(r => setTimeout(r, 500));

// // //         // Step 3: Move to Pan
// // //         setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
// // //         await new Promise(r => setTimeout(r, 1200));
// // //         if (modeRef.current !== 'concept') break;

// // //         // Step 4: Drop
// // //         setIsGrabbing(false);
// // //         addItem(true);
// // //         await new Promise(r => setTimeout(r, 800));
// // //     }

// // //     setIsAutoPlaying(false);
// // //     setVirtualHandPos(null);
// // //     setIsGrabbing(false);
// // //     tutorialActiveRef.current = false;
// // //   }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

// // //   useEffect(() => {
// // //     if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
// // //       const t = setTimeout(startConceptBuilding, 1500);
// // //       return () => clearTimeout(t);
// // //     } else if (mode === 'practice') {
// // //       setIsAutoPlaying(false);
// // //       setIsGrabbing(false);
// // //       setVirtualHandPos(null);
// // //       tutorialActiveRef.current = false;
// // //     }
// // //   }, [mode, isBalanced, startConceptBuilding]);

// // //   useEffect(() => {
// // //     if (autoNextTimer !== null && autoNextTimer > 0) {
// // //       timerIntervalRef.current = setInterval(() => {
// // //         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
// // //       }, 1000);
// // //     } else if (autoNextTimer === 0) {
// // //       shuffleMission();
// // //     }
// // //     return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
// // //   }, [autoNextTimer, shuffleMission]);

// // //   // --- ROBUST DRAG END HANDLER ---
// // //   const handleDragEnd = (event, info) => {
// // //     if (isAutoPlaying || isBalanced || mode !== 'practice') return;

// // //     if (!leftPanRef.current) return;

// // //     // Get pan bounds in viewport space
// // //     const panRect = leftPanRef.current.getBoundingClientRect();
    
// // //     // Get the drag element's final position
// // //     const dragX = info.point.x;
// // //     const dragY = info.point.y;
    
// // //     // Generous magnetic drop zone (buffer) - increased for better UX
// // //     const buffer = 100; 
// // //     const isOverTarget = 
// // //       dragX >= panRect.left - buffer && 
// // //       dragX <= panRect.right + buffer && 
// // //       dragY >= panRect.top - buffer && 
// // //       dragY <= panRect.bottom + buffer;

// // //     if (isOverTarget) {
// // //       addItem();
// // //     }
// // //   };

// // //   return (
// // //     <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
// // //       {/* HEADER */}
// // //       <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
// // //         <div className="flex items-center gap-2">
// // //           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
// // //             <Scale size={24} />
// // //           </div>
// // //           <div>
// // //             <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
// // //             <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest">Matte Wooden Station</p>
// // //           </div>
// // //         </div>

// // //         <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
// // //             <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
// // //                 <button onClick={() => { setMode('concept'); resetLevel(); }}
// // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // //                     CONCEPT BUILDING
// // //                 </button>
// // //                 <button onClick={() => { setMode('practice'); resetLevel(); }}
// // //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// // //                     PRACTICE
// // //                 </button>
// // //             </div>
// // //             <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
// // //                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
// // //             </button>
// // //             <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
// // //                 <RefreshCcw size={16} />
// // //             </button>
// // //         </div>
// // //       </div>

// // //       {/* STAGE */}
// // //       <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
// // //         <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
// // //         <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
// // //             <Clock size={32} />
// // //             <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
// // //         </div>

// // //         {/* SCALE ASSEMBLY */}
// // //         <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
// // //             <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
// // //                 <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
// // //                 <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
// // //                 <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
// // //             </div>

// // //             <div className="relative w-full flex justify-center z-20 mt-[12%]">
// // //                 <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
// // //                     className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
// // //                     style={{ originX: 0.5, originY: 0.5 }}>
// // //                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
// // //                     {/* LOAD PAN */}
// // //                     <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // //                         <div className="flex justify-between w-[80%] px-4">
// // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // //                         </div>
// // //                         <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // //                             <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
// // //                                 {[...Array(placedCount)].map((_, i) => (
// // //                                     <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
// // //                                 ))}
// // //                             </div>
// // //                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
// // //                         </div>
// // //                     </motion.div>

// // //                     {/* MASTER PAN */}
// // //                     <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// // //                         <div className="flex justify-between w-[80%] px-4">
// // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// // //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// // //                         </div>
// // //                         <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// // //                              <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
// // //                              <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
// // //                         </div>
// // //                     </motion.div>
// // //                 </motion.div>
// // //             </div>
// // //         </div>

// // //         {/* BOTTOM COMMUNICATION ZONE */}
// // //         <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none px-4">
// // //             <AnimatePresence mode="wait">
// // //                 {isBalanced ? (
// // //                     <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
// // //                         <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
// // //                             <Trophy size={24} className="animate-bounce shrink-0" />
// // //                             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
// // //                                 <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80">Success!</span>
// // //                                 <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
// // //                             </div>
// // //                             <Sparkles size={20} className="text-yellow-300 shrink-0" />
// // //                         </div>
// // //                     </motion.div>
// // //                 ) : (
// // //                     <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
// // //                         <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
// // //                     </motion.div>
// // //                 )}
// // //             </AnimatePresence>
// // //         </div>
// // //       </div>

// // //       {/* DEPOT AREA */}
// // //       <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
// // //         <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
// // //             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Bin</div>
// // //             <div className="flex items-center gap-8 sm:gap-16">
// // //                 <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
// // //                     <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
// // //                     <div className="flex items-center gap-2">
// // //                         <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
// // //                         <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter">= {currentFruit.weight}g</span>
// // //                     </div>
// // //                 </div>
// // //                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
// // //                    {/* Draggable Fruit in Practice Mode */}
// // //                    {!isBalanced && mode === 'practice' && (
// // //                      <motion.div 
// // //                         ref={appleSourceRef} 
// // //                         drag 
// // //                         dragSnapToOrigin 
// // //                         dragElastic={0.1}
// // //                         dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
// // //                         onDragEnd={handleDragEnd} 
// // //                         whileHover={{ scale: 1.15 }} 
// // //                         whileDrag={{ scale: 1.3, zIndex: 1000 }}
// // //                         className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing drop-shadow-2xl select-none touch-none"
// // //                         style={{ position: 'relative', zIndex: 60 }}
// // //                       >
// // //                         {currentFruit.icon}
// // //                       </motion.div>
// // //                    )}
// // //                    {/* Visual Ghost/Reference in Concept Mode */}
// // //                    {(isBalanced || mode === 'concept') && (
// // //                      <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">{currentFruit.icon}</div>
// // //                    )}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //       </div>

// // //       {/* NAVIGATION BAR */}
// // //       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
// // //           <button onClick={shuffleMission} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
// // //             <div className="flex items-center gap-3 z-10">
// // //               <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
// // //               <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
// // //             </div>
// // //             <div className="flex items-center relative z-10">
// // //               {autoNextTimer !== null ? (
// // //                 <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
// // //                   <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono">{autoNextTimer}</span></div>
// // //                   <div className="flex justify-between w-full px-3 relative">
// // //                       {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
// // //                       <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl">🏃</motion.div>
// // //                   </div>
// // //                 </div>
// // //               ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
// // //             </div>
// // //           </button>
// // //           <button onClick={shuffleMission} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
// // //             <Shuffle size={20} />
// // //             <span className="uppercase tracking-tighter">Shuffle Lab</span>
// // //           </button>
// // //       </div>

// // //       {/* VIRTUAL HAND GUIDE */}
// // //       <AnimatePresence>
// // //         {mode === 'concept' && virtualHandPos && (
// // //             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
// // //                 transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
// // //                 <div className="relative flex items-center justify-center">
// // //                     {/* Proportionally smaller hand */}
// // //                     <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
// // //                     <AnimatePresence>
// // //                       {isGrabbing && (
// // //                         <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
// // //                           className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61] opacity-100">
// // //                           {currentFruit.icon}
// // //                         </motion.div>
// // //                       )}
// // //                     </AnimatePresence>
// // //                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
// // //                 </div>
// // //             </motion.div>
// // //         )}
// // //       </AnimatePresence>

// // //       <style>{`
// // //         .no-scrollbar::-webkit-scrollbar { display: none; }
// // //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }

// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   RefreshCcw, CheckCircle2, 
// //   Hand, Play, MousePointer2, 
// //   Timer, ChevronRight, Shuffle, 
// //   FastForward, XCircle, Scale,
// //   Trophy, Sparkles, Volume2, VolumeX,
// //   Clock
// // } from 'lucide-react';

// // // --- Assets & Configuration ---
// // const FRUIT_LIBRARY = [
// //   { icon: '🍎', name: 'Apple', weight: 2 },
// //   { icon: '🍊', name: 'Orange', weight: 3 },
// //   { icon: '🍐', name: 'Pear', weight: 4 },
// //   { icon: '🍓', name: 'Strawberry', weight: 1 },
// //   { icon: '🍋', name: 'Lemon', weight: 5 },
// // ];

// // export default function App() {
// //   const [mode, setMode] = useState('practice'); 
// //   const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
// //   const [targetWeight, setTargetWeight] = useState(6);
// //   const [placedCount, setPlacedCount] = useState(0); 
// //   const [isBalanced, setIsBalanced] = useState(false);
// //   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
// //   const [autoNextTimer, setAutoNextTimer] = useState(null);
// //   const [virtualHandPos, setVirtualHandPos] = useState(null);
// //   const [isGrabbing, setIsGrabbing] = useState(false);
// //   const [isMuted, setIsMuted] = useState(false);
  
// //   const timerIntervalRef = useRef(null);
// //   const leftPanRef = useRef(null);
// //   const appleSourceRef = useRef(null);
// //   const tutorialActiveRef = useRef(false);
// //   const modeRef = useRef(mode);

// //   // Sync ref with state for async loops
// //   useEffect(() => { modeRef.current = mode; }, [mode]);

// //   const leftWeight = placedCount * currentFruit.weight;
// //   const weightDiff = targetWeight - leftWeight;
// //   // Tilt physics
// //   const rotation = Math.max(-22, Math.min(22, weightDiff * 7.5));

// //   // --- Audio ---
// //   const speakMessage = useCallback(async (text) => {
// //     if (isMuted) return;
// //     if ('speechSynthesis' in window) {
// //       window.speechSynthesis.cancel();
// //       const utterance = new SpeechSynthesisUtterance(text);
// //       utterance.rate = 0.95;
// //       utterance.pitch = 1.1;
// //       speechSynthesis.speak(utterance);
// //     }
// //   }, [isMuted]);

// //   // --- Logic Functions ---
// //   const shuffleMission = useCallback(() => {
// //     const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
// //     const randomQuantity = Math.floor(Math.random() * 3) + 1; 
// //     const newTarget = randomFruit.weight * randomQuantity;

// //     setCurrentFruit(randomFruit);
// //     setTargetWeight(newTarget);
// //     setPlacedCount(0);
// //     setIsBalanced(false);
// //     setAutoNextTimer(null);
// //     setIsAutoPlaying(false);
// //     setIsGrabbing(false);
// //     tutorialActiveRef.current = false;
// //     setVirtualHandPos(null);
    
// //     speakMessage(`New challenge! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
// //   }, [speakMessage]);

// //   const resetLevel = useCallback(() => {
// //     setPlacedCount(0);
// //     setIsBalanced(false);
// //     setAutoNextTimer(null);
// //     setIsAutoPlaying(false);
// //     setIsGrabbing(false);
// //     tutorialActiveRef.current = false;
// //     setVirtualHandPos(null);
// //     speakMessage(`Let's balance the scale!`);
// //   }, [speakMessage]);

// //   // --- Effect Hooks ---
// //   useEffect(() => {
// //     if (leftWeight === targetWeight && !isBalanced) {
// //       setIsBalanced(true);
// //       speakMessage(`Balanced! It took ${placedCount} ${currentFruit.name}s!`);
// //       setAutoNextTimer(10);
// //     } else if (leftWeight !== targetWeight) {
// //       setIsBalanced(false);
// //       setAutoNextTimer(null);
// //     }
// //   }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

// //   const addItem = useCallback((isTutorial = false) => {
// //     if (!isTutorial && isAutoPlaying) return;
// //     if (isTutorial && modeRef.current !== 'concept') return;

// //     setPlacedCount(prev => {
// //         if (prev >= 15) return prev;
// //         const newVal = prev + 1;
// //         const newWeight = newVal * currentFruit.weight;
// //         if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
// //         else if (newWeight > targetWeight) speakMessage("Too heavy!");
// //         return newVal;
// //     });
// //   }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

// //   const startConceptBuilding = useCallback(async () => {
// //     if (tutorialActiveRef.current || isBalanced) return;
// //     tutorialActiveRef.current = true;
// //     setIsAutoPlaying(true);

// //     await new Promise(r => setTimeout(r, 1500));
// //     if (modeRef.current !== 'concept' || isBalanced) {
// //         tutorialActiveRef.current = false;
// //         setIsAutoPlaying(false);
// //         return;
// //     }

// //     speakMessage(`Building concept... Target is ${targetWeight} grams.`);
// //     await new Promise(r => setTimeout(r, 2000));

// //     const needed = targetWeight / currentFruit.weight;

// //     for (let i = 0; i < needed; i++) {
// //         if (modeRef.current !== 'concept' || isBalanced) break;
// //         if (!appleSourceRef.current || !leftPanRef.current) break;
        
// //         const sourceRect = appleSourceRef.current.getBoundingClientRect();
// //         const targetRect = leftPanRef.current.getBoundingClientRect();
        
// //         setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
// //         await new Promise(r => setTimeout(r, 1000));
// //         if (modeRef.current !== 'concept') break;

// //         setIsGrabbing(true);
// //         await new Promise(r => setTimeout(r, 500));

// //         setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
// //         await new Promise(r => setTimeout(r, 1200));
// //         if (modeRef.current !== 'concept') break;

// //         setIsGrabbing(false);
// //         addItem(true);
// //         await new Promise(r => setTimeout(r, 800));
// //     }

// //     setIsAutoPlaying(false);
// //     setVirtualHandPos(null);
// //     setIsGrabbing(false);
// //     tutorialActiveRef.current = false;
// //   }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

// //   useEffect(() => {
// //     if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
// //       const t = setTimeout(startConceptBuilding, 1500);
// //       return () => clearTimeout(t);
// //     } else if (mode === 'practice') {
// //       setIsAutoPlaying(false);
// //       setIsGrabbing(false);
// //       setVirtualHandPos(null);
// //       tutorialActiveRef.current = false;
// //     }
// //   }, [mode, isBalanced, startConceptBuilding]);

// //   useEffect(() => {
// //     if (autoNextTimer !== null && autoNextTimer > 0) {
// //       timerIntervalRef.current = setInterval(() => {
// //         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
// //       }, 1000);
// //     } else if (autoNextTimer === 0) {
// //       shuffleMission();
// //     }
// //     return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
// //   }, [autoNextTimer, shuffleMission]);

// //   // --- REFINED DRAG END HANDLER FOR ALL BROWSERS ---
// //   const handleDragEnd = (event, info) => {
// //     // Only proceed if in Practice Mode and not already balanced or auto-playing
// //     if (isAutoPlaying || isBalanced || mode !== 'practice') return;

// //     if (!leftPanRef.current) return;

// //     // 1. Get current viewport position of the pan
// //     const panRect = leftPanRef.current.getBoundingClientRect();
    
// //     // 2. Get the cursor/touch release point
// //     const releaseX = info.point.x;
// //     const releaseY = info.point.y;
    
// //     // 3. Define a generous hit area (Pan bounds + 100px magnetic buffer)
// //     const hitBuffer = 100;
// //     const isInHitZone = 
// //       releaseX >= panRect.left - hitBuffer && 
// //       releaseX <= panRect.right + hitBuffer && 
// //       releaseY >= panRect.top - hitBuffer && 
// //       releaseY <= panRect.bottom + hitBuffer;

// //     if (isInHitZone) {
// //       addItem();
// //     }
// //   };

// //   return (
// //     <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
// //       {/* HEADER */}
// //       <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
// //         <div className="flex items-center gap-2">
// //           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
// //             <Scale size={24} />
// //           </div>
// //           <div>
// //             <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
// //             <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Matte Wooden Station</p>
// //           </div>
// //         </div>

// //         <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
// //             <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
// //                 <button onClick={() => { setMode('concept'); resetLevel(); }}
// //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// //                     CONCEPT BUILDING
// //                 </button>
// //                 <button onClick={() => { setMode('practice'); resetLevel(); }}
// //                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
// //                     PRACTICE
// //                 </button>
// //             </div>
// //             <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
// //                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
// //             </button>
// //             <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
// //                 <RefreshCcw size={16} />
// //             </button>
// //         </div>
// //       </div>

// //       {/* THE STAGE */}
// //       <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
// //         <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
// //         <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
// //             <Clock size={32} />
// //             <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
// //         </div>

// //         {/* SCALE AREA */}
// //         <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
// //             <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
// //                 <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
// //                 <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
// //                 <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
// //             </div>

// //             <div className="relative w-full flex justify-center z-20 mt-[12%]">
// //                 <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
// //                     className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
// //                     style={{ originX: 0.5, originY: 0.5 }}>
// //                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
// //                     {/* LEFT PAN (LOAD) */}
// //                     <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// //                         <div className="flex justify-between w-[80%] px-4">
// //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// //                         </div>
// //                         <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// //                             <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
// //                                 {[...Array(placedCount)].map((_, i) => (
// //                                     <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
// //                                 ))}
// //                             </div>
// //                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
// //                         </div>
// //                     </motion.div>

// //                     {/* RIGHT PAN (TARGET) */}
// //                     <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
// //                         <div className="flex justify-between w-[80%] px-4">
// //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
// //                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
// //                         </div>
// //                         <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
// //                              <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
// //                              <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
// //                         </div>
// //                     </motion.div>
// //                 </motion.div>
// //             </div>
// //         </div>

// //         {/* COMMUNICATION ZONE */}
// //         <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none px-4">
// //             <AnimatePresence mode="wait">
// //                 {isBalanced ? (
// //                     <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
// //                         <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
// //                             <Trophy size={24} className="animate-bounce shrink-0" />
// //                             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
// //                                 <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Balanced!</span>
// //                                 <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
// //                             </div>
// //                             <Sparkles size={20} className="text-yellow-300 shrink-0" />
// //                         </div>
// //                     </motion.div>
// //                 ) : (
// //                     <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
// //                         <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
// //                     </motion.div>
// //                 )}
// //             </AnimatePresence>
// //         </div>
// //       </div>

// //       {/* DEPOT AREA */}
// //       <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
// //         <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
// //             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Depot</div>
// //             <div className="flex items-center gap-8 sm:gap-16">
// //                 <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
// //                     <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
// //                     <div className="flex items-center gap-2">
// //                         <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
// //                         <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter leading-none">= {currentFruit.weight}g</span>
// //                     </div>
// //                 </div>
// //                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
// //                    {/* Draggable Source Item */}
// //                    {!isBalanced && mode === 'practice' && (
// //                      <motion.div 
// //                         ref={appleSourceRef} 
// //                         drag 
// //                         dragSnapToOrigin 
// //                         onDragEnd={handleDragEnd} 
// //                         whileHover={{ scale: 1.15 }} 
// //                         whileDrag={{ scale: 1.3, zIndex: 1000, cursor: 'grabbing' }}
// //                         className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing drop-shadow-2xl z-[60] select-none touch-none"
// //                         style={{ position: 'relative' }}
// //                       >
// //                         {currentFruit.icon}
// //                       </motion.div>
// //                    )}
// //                    {(isBalanced || mode === 'concept') && (
// //                      <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">{currentFruit.icon}</div>
// //                    )}
// //                 </div>
// //             </div>
// //         </div>
// //       </div>

// //       {/* NAVIGATION */}
// //       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
// //           <button onClick={() => shuffleMission()} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
// //             <div className="flex items-center gap-3 z-10">
// //               <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
// //               <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
// //             </div>
// //             <div className="flex items-center relative z-10">
// //               {autoNextTimer !== null ? (
// //                 <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
// //                   <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono leading-none">{autoNextTimer}</span></div>
// //                   <div className="flex justify-between w-full px-3 relative">
// //                       {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
// //                       <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl pointer-events-none">🏃</motion.div>
// //                   </div>
// //                 </div>
// //               ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
// //             </div>
// //           </button>
// //           <button onClick={() => shuffleMission()} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
// //             <Shuffle size={20} />
// //             <span className="uppercase tracking-tighter">Shuffle Weight</span>
// //           </button>
// //       </div>

// //       {/* VIRTUAL HAND (CONCEPT BUILDING ONLY) */}
// //       <AnimatePresence>
// //         {mode === 'concept' && virtualHandPos && (
// //             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
// //                 transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
// //                 <div className="relative flex items-center justify-center">
// //                     <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
// //                     <AnimatePresence>
// //                       {isGrabbing && (
// //                         <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
// //                           className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61] opacity-100">
// //                           {currentFruit.icon}
// //                         </motion.div>
// //                       )}
// //                     </AnimatePresence>
// //                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
// //                 </div>
// //             </motion.div>
// //         )}
// //       </AnimatePresence>

// //       <style>{`
// //         .no-scrollbar::-webkit-scrollbar { display: none; }
// //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// //       `}</style>
// //     </div>
// //   );
// // }


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   RefreshCcw, CheckCircle2, 
//   Hand, Play, MousePointer2, 
//   Timer, ChevronRight, Shuffle, 
//   FastForward, XCircle, Scale,
//   Trophy, Sparkles, Volume2, VolumeX,
//   Clock
// } from 'lucide-react';

// // --- Assets & Configuration ---
// const FRUIT_LIBRARY = [
//   { icon: '🍎', name: 'Apple', weight: 2 },
//   { icon: '🍊', name: 'Orange', weight: 3 },
//   { icon: '🍐', name: 'Pear', weight: 4 },
//   { icon: '🍓', name: 'Strawberry', weight: 1 },
//   { icon: '🍋', name: 'Lemon', weight: 5 },
// ];

// export default function App() {
//   const [mode, setMode] = useState('practice'); 
//   const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
//   const [targetWeight, setTargetWeight] = useState(6);
//   const [placedCount, setPlacedCount] = useState(0); 
//   const [isBalanced, setIsBalanced] = useState(false);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(false);
//   const [autoNextTimer, setAutoNextTimer] = useState(null);
//   const [virtualHandPos, setVirtualHandPos] = useState(null);
//   const [isGrabbing, setIsGrabbing] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
  
//   const timerIntervalRef = useRef(null);
//   const leftPanRef = useRef(null);
//   const appleSourceRef = useRef(null);
//   const tutorialActiveRef = useRef(false);
//   const modeRef = useRef(mode);

//   // Sync ref with state for async loops
//   useEffect(() => { modeRef.current = mode; }, [mode]);

//   const leftWeight = placedCount * currentFruit.weight;
//   const weightDiff = targetWeight - leftWeight;
//   // Tilt physics
//   const rotation = Math.max(-22, Math.min(22, weightDiff * 7.5));

//   // --- TTS Logic ---
//   const speakMessage = useCallback(async (text) => {
//     if (isMuted) return;
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.95;
//       utterance.pitch = 1.1;
//       speechSynthesis.speak(utterance);
//     }
//   }, [isMuted]);

//   // --- Logic Functions ---
//   const shuffleMission = useCallback(() => {
//     const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
//     const randomQuantity = Math.floor(Math.random() * 3) + 1; 
//     const newTarget = randomFruit.weight * randomQuantity;

//     setCurrentFruit(randomFruit);
//     setTargetWeight(newTarget);
//     setPlacedCount(0);
//     setIsBalanced(false);
//     setAutoNextTimer(null);
//     setIsAutoPlaying(false);
//     setIsGrabbing(false);
//     tutorialActiveRef.current = false;
//     setVirtualHandPos(null);
    
//     speakMessage(`New challenge! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
//   }, [speakMessage]);

//   const resetLevel = useCallback(() => {
//     setPlacedCount(0);
//     setIsBalanced(false);
//     setAutoNextTimer(null);
//     setIsAutoPlaying(false);
//     setIsGrabbing(false);
//     tutorialActiveRef.current = false;
//     setVirtualHandPos(null);
//     speakMessage(`Let's balance the scale!`);
//   }, [speakMessage]);

//   // --- Effect Hooks ---
//   useEffect(() => {
//     if (leftWeight === targetWeight && !isBalanced) {
//       setIsBalanced(true);
//       speakMessage(`Perfect! It took ${placedCount} ${currentFruit.name}s!`);
//       setAutoNextTimer(10);
//     } else if (leftWeight !== targetWeight) {
//       setIsBalanced(false);
//       setAutoNextTimer(null);
//     }
//   }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

//   const addItem = useCallback((isTutorial = false) => {
//     // If it's a manual add (not tutorial), and we are in Concept mode auto-playing, ignore
//     if (!isTutorial && isAutoPlaying && modeRef.current === 'concept') return;
    
//     // Final check for concept mode tutorial call
//     if (isTutorial && modeRef.current !== 'concept') return;

//     setPlacedCount(prev => {
//         if (prev >= 15) return prev;
//         const newVal = prev + 1;
//         const newWeight = newVal * currentFruit.weight;
//         if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
//         else if (newWeight > targetWeight) speakMessage("Too heavy!");
//         return newVal;
//     });
//   }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

//   const moveHand = async (fromRect, toRect) => {
//     if (modeRef.current !== 'concept') return;
//     setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
//     await new Promise(r => setTimeout(r, 800));
//     if (modeRef.current !== 'concept') return;
//     setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
//     await new Promise(r => setTimeout(r, 1200));
//   };

//   const startConceptBuilding = useCallback(async () => {
//     if (tutorialActiveRef.current || isBalanced) return;
//     tutorialActiveRef.current = true;
//     setIsAutoPlaying(true);

//     await new Promise(r => setTimeout(r, 1500));
//     if (modeRef.current !== 'concept' || isBalanced) {
//         tutorialActiveRef.current = false;
//         setIsAutoPlaying(false);
//         return;
//     }

//     speakMessage(`Building concept... Target is ${targetWeight} grams.`);
//     await new Promise(r => setTimeout(r, 2000));

//     const needed = targetWeight / currentFruit.weight;

//     for (let i = 0; i < needed; i++) {
//         if (modeRef.current !== 'concept' || isBalanced) break;
//         if (!appleSourceRef.current || !leftPanRef.current) break;
        
//         const sourceRect = appleSourceRef.current.getBoundingClientRect();
//         const targetRect = leftPanRef.current.getBoundingClientRect();
        
//         setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
//         await new Promise(r => setTimeout(r, 1000));
//         if (modeRef.current !== 'concept') break;

//         setIsGrabbing(true);
//         await new Promise(r => setTimeout(r, 500));

//         setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
//         await new Promise(r => setTimeout(r, 1200));
//         if (modeRef.current !== 'concept') break;

//         setIsGrabbing(false);
//         addItem(true);
//         await new Promise(r => setTimeout(r, 800));
//     }

//     setIsAutoPlaying(false);
//     setVirtualHandPos(null);
//     setIsGrabbing(false);
//     tutorialActiveRef.current = false;
//   }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

//   useEffect(() => {
//     if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
//       const t = setTimeout(startConceptBuilding, 1500);
//       return () => clearTimeout(t);
//     } else if (mode === 'practice') {
//       setIsAutoPlaying(false);
//       setIsGrabbing(false);
//       setVirtualHandPos(null);
//       tutorialActiveRef.current = false;
//     }
//   }, [mode, isBalanced, startConceptBuilding]);

//   useEffect(() => {
//     if (autoNextTimer !== null && autoNextTimer > 0) {
//       timerIntervalRef.current = setInterval(() => {
//         setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
//       }, 1000);
//     } else if (autoNextTimer === 0) {
//       shuffleMission();
//     }
//     return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
//   }, [autoNextTimer, shuffleMission]);

//   // --- REFINED DRAG END HANDLER ---
//   const handleDragEnd = (event, info) => {
//     if (isAutoPlaying || isBalanced || mode !== 'practice') return;

//     if (!leftPanRef.current) return;

//     // Get the viewport position of the pan
//     const panRect = leftPanRef.current.getBoundingClientRect();
//     const panCenterX = panRect.left + panRect.width / 2;
//     const panCenterY = panRect.top + panRect.height / 2;
    
//     // info.point is viewport-relative (client coordinates)
//     const dropX = info.point.x;
//     const dropY = info.point.y;
    
//     // Calculate distance from center of pan to the drop point
//     const distance = Math.sqrt(Math.pow(dropX - panCenterX, 2) + Math.pow(dropY - panCenterY, 2));

//     // A very generous radius (1.2x pan width) for hit detection
//     const radiusThreshold = Math.max(panRect.width, 120);

//     if (distance < radiusThreshold) {
//       addItem();
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
//       {/* HEADER */}
//       <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
//         <div className="flex items-center gap-2">
//           <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
//             <Scale size={24} />
//           </div>
//           <div>
//             <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
//             <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Matte Wooden Station</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
//             <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
//                 <button onClick={() => { setMode('concept'); resetLevel(); }}
//                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
//                     CONCEPT BUILDING
//                 </button>
//                 <button onClick={() => { setMode('practice'); resetLevel(); }}
//                     className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
//                     PRACTICE
//                 </button>
//             </div>
//             <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
//                 {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
//             </button>
//             <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
//                 <RefreshCcw size={16} />
//             </button>
//         </div>
//       </div>

//       {/* THE STAGE */}
//       <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
//         <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
//         <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
//             <Clock size={32} />
//             <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
//         </div>

//         {/* SCALE AREA */}
//         <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
//             <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
//                 <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
//                 <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
//                 <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
//             </div>

//             <div className="relative w-full flex justify-center z-20 mt-[12%]">
//                 <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
//                     className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
//                     style={{ originX: 0.5, originY: 0.5 }}>
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
//                     {/* LEFT PAN */}
//                     <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
//                         <div className="flex justify-between w-[80%] px-4">
//                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
//                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
//                         </div>
//                         <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
//                             <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
//                                 {[...Array(placedCount)].map((_, i) => (
//                                     <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
//                                 ))}
//                             </div>
//                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
//                         </div>
//                     </motion.div>

//                     {/* RIGHT PAN */}
//                     <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
//                         <div className="flex justify-between w-[80%] px-4">
//                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
//                             <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
//                         </div>
//                         <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
//                              <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
//                              <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
//                         </div>
//                     </motion.div>
//                 </motion.div>
//             </div>
//         </div>

//         {/* COMMUNICATION ZONE */}
//         <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none px-4">
//             <AnimatePresence mode="wait">
//                 {isBalanced ? (
//                     <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
//                         <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
//                             <Trophy size={24} className="animate-bounce shrink-0" />
//                             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
//                                 <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Balanced!</span>
//                                 <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
//                             </div>
//                             <Sparkles size={20} className="text-yellow-300 shrink-0" />
//                         </div>
//                     </motion.div>
//                 ) : (
//                     <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
//                         <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </div>
//       </div>

//       {/* DEPOT AREA */}
//       <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
//         <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
//             <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Depot</div>
//             <div className="flex items-center gap-8 sm:gap-16">
//                 <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
//                     <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
//                     <div className="flex items-center gap-2">
//                         <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
//                         <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter leading-none">= {currentFruit.weight}g</span>
//                     </div>
//                 </div>
//                 <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
//                    {/* Draggable Source Item */}
//                    {!isBalanced && mode === 'practice' && (
//                      <motion.div 
//                         ref={appleSourceRef} 
//                         drag 
//                         dragSnapToOrigin 
//                         onDragEnd={handleDragEnd} 
//                         whileHover={{ scale: 1.15 }} 
//                         whileDrag={{ scale: 1.3, zIndex: 1000, cursor: 'grabbing' }}
//                         className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing drop-shadow-2xl z-[60] select-none touch-none"
//                         style={{ position: 'relative' }}
//                       >
//                         {currentFruit.icon}
//                       </motion.div>
//                    )}
//                    {(isBalanced || mode === 'concept') && (
//                      <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">{currentFruit.icon}</div>
//                    )}
//                 </div>
//             </div>
//         </div>
//       </div>

//       {/* NAVIGATION BAR */}
//       <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
//           <button onClick={() => shuffleMission()} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
//             <div className="flex items-center gap-3 z-10">
//               <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
//               <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
//             </div>
//             <div className="flex items-center relative z-10">
//               {autoNextTimer !== null ? (
//                 <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
//                   <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono">{autoNextTimer}</span></div>
//                   <div className="flex justify-between w-full px-3 relative">
//                       {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
//                       <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl pointer-events-none">🏃</motion.div>
//                   </div>
//                 </div>
//               ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
//             </div>
//           </button>
//           <button onClick={() => shuffleMission()} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
//             <Shuffle size={20} />
//             <span className="uppercase tracking-tighter">Shuffle Lab</span>
//           </button>
//       </div>

//       {/* VIRTUAL HAND GUIDE */}
//       <AnimatePresence>
//         {mode === 'concept' && virtualHandPos && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
//                 transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
//                 <div className="relative flex items-center justify-center">
//                     <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
//                     <AnimatePresence>
//                       {isGrabbing && (
//                         <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
//                           className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61] opacity-100">
//                           {currentFruit.icon}
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                     <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
//                 </div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       <style>{`
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  Hand, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, 
  FastForward, XCircle, Scale,
  Trophy, Sparkles, Volume2, VolumeX,
  Clock
} from 'lucide-react';

// --- Assets & Configuration ---
const FRUIT_LIBRARY = [
  { icon: '🍎', name: 'Apple', weight: 2 },
  { icon: '🍊', name: 'Orange', weight: 3 },
  { icon: '🍐', name: 'Pear', weight: 4 },
  { icon: '🍓', name: 'Strawberry', weight: 1 },
  { icon: '🍋', name: 'Lemon', weight: 5 },
];

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [currentFruit, setCurrentFruit] = useState(FRUIT_LIBRARY[0]);
  const [targetWeight, setTargetWeight] = useState(6);
  const [placedCount, setPlacedCount] = useState(0); 
  const [isBalanced, setIsBalanced] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [virtualHandPos, setVirtualHandPos] = useState(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerIntervalRef = useRef(null);
  const leftPanRef = useRef(null);
  const appleSourceRef = useRef(null);
  const tutorialActiveRef = useRef(false);
  const modeRef = useRef(mode);

  // Sync ref with state for async loops
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const leftWeight = placedCount * currentFruit.weight;
  const weightDiff = targetWeight - leftWeight;
  // Tilt physics
  const rotation = Math.max(-22, Math.min(22, weightDiff * 7.5));

  // --- TTS Logic ---
  const speakMessage = useCallback(async (text) => {
    if (isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.1;
      speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  // --- Logic Functions ---
  const shuffleMission = useCallback(() => {
    const randomFruit = FRUIT_LIBRARY[Math.floor(Math.random() * FRUIT_LIBRARY.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 2; // Aim for 2-4 fruits for variety
    const newTarget = randomFruit.weight * randomQuantity;

    setCurrentFruit(randomFruit);
    setTargetWeight(newTarget);
    setPlacedCount(0);
    setIsBalanced(false);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
    setVirtualHandPos(null);
    
    speakMessage(`New mission! Use ${randomFruit.name}s to reach ${newTarget} grams.`);
  }, [speakMessage]);

  const resetLevel = useCallback(() => {
    setPlacedCount(0);
    setIsBalanced(false);
    setAutoNextTimer(null);
    setIsAutoPlaying(false);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
    setVirtualHandPos(null);
    speakMessage(`Let's balance the scale!`);
  }, [speakMessage]);

  // --- Effect Hooks ---
  useEffect(() => {
    if (leftWeight === targetWeight && !isBalanced) {
      setIsBalanced(true);
      speakMessage(`Perfect! It took ${placedCount} ${currentFruit.name}s!`);
      setAutoNextTimer(10);
    } else if (leftWeight !== targetWeight) {
      setIsBalanced(false);
      setAutoNextTimer(null);
    }
  }, [leftWeight, targetWeight, isBalanced, speakMessage, placedCount, currentFruit]);

  const addItem = useCallback((isTutorial = false) => {
    // Basic guards
    if (!isTutorial && isAutoPlaying && modeRef.current === 'concept') return;
    if (isTutorial && modeRef.current !== 'concept') return;

    setPlacedCount(prev => {
        if (prev >= 15) return prev;
        const newVal = prev + 1;
        const newWeight = newVal * currentFruit.weight;
        if (newWeight < targetWeight) speakMessage(`${newWeight} grams.`);
        else if (newWeight > targetWeight) speakMessage("Too heavy!");
        return newVal;
    });
  }, [currentFruit, targetWeight, isAutoPlaying, speakMessage]);

  const moveHand = async (fromRect, toRect) => {
    if (modeRef.current !== 'concept') return;
    setVirtualHandPos({ x: fromRect.left + fromRect.width/2, y: fromRect.top + fromRect.height/2 });
    await new Promise(r => setTimeout(r, 800));
    if (modeRef.current !== 'concept') return;
    setVirtualHandPos({ x: toRect.left + toRect.width/2, y: toRect.top + toRect.height/2 });
    await new Promise(r => setTimeout(r, 1200));
  };

  const startConceptBuilding = useCallback(async () => {
    if (tutorialActiveRef.current || isBalanced) return;
    tutorialActiveRef.current = true;
    setIsAutoPlaying(true);

    await new Promise(r => setTimeout(r, 1500));
    if (modeRef.current !== 'concept' || isBalanced) {
        tutorialActiveRef.current = false;
        setIsAutoPlaying(false);
        return;
    }

    speakMessage(`Building concept... Target is ${targetWeight} grams.`);
    await new Promise(r => setTimeout(r, 2000));

    const needed = targetWeight / currentFruit.weight;

    for (let i = 0; i < needed; i++) {
        if (modeRef.current !== 'concept' || isBalanced) break;
        if (!appleSourceRef.current || !leftPanRef.current) break;
        
        const sourceRect = appleSourceRef.current.getBoundingClientRect();
        const targetRect = leftPanRef.current.getBoundingClientRect();
        
        setVirtualHandPos({ x: sourceRect.left + sourceRect.width/2, y: sourceRect.top + sourceRect.height/2 });
        await new Promise(r => setTimeout(r, 1000));
        if (modeRef.current !== 'concept') break;

        setIsGrabbing(true);
        await new Promise(r => setTimeout(r, 500));

        setVirtualHandPos({ x: targetRect.left + targetRect.width/2, y: targetRect.top + targetRect.height/2 });
        await new Promise(r => setTimeout(r, 1200));
        if (modeRef.current !== 'concept') break;

        setIsGrabbing(false);
        addItem(true);
        await new Promise(r => setTimeout(r, 800));
    }

    setIsAutoPlaying(false);
    setVirtualHandPos(null);
    setIsGrabbing(false);
    tutorialActiveRef.current = false;
  }, [addItem, isBalanced, speakMessage, targetWeight, currentFruit]);

  useEffect(() => {
    if (mode === 'concept' && !isBalanced && !tutorialActiveRef.current) {
      const t = setTimeout(startConceptBuilding, 1500);
      return () => clearTimeout(t);
    } else if (mode === 'practice') {
      setIsAutoPlaying(false);
      setIsGrabbing(false);
      setVirtualHandPos(null);
      tutorialActiveRef.current = false;
    }
  }, [mode, isBalanced, startConceptBuilding]);

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      shuffleMission();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, shuffleMission]);

  // --- ENHANCED HIT DETECTION FOR PRACTICE MODE ---
  const handleDragEnd = (event, info) => {
    // Reject if not in practice or already balanced
    if (isBalanced || mode !== 'practice' || isAutoPlaying) return;

    if (!leftPanRef.current) return;

    // Get real-time pan coordinates (in viewport space)
    const panRect = leftPanRef.current.getBoundingClientRect();
    
    // info.point is absolute viewport coordinate in Framer Motion
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Generous magnetic zone (80px buffer around the pan)
    const magneticBuffer = 80;
    
    const isOverPan = 
        dropX >= panRect.left - magneticBuffer &&
        dropX <= panRect.right + magneticBuffer &&
        dropY >= panRect.top - magneticBuffer &&
        dropY <= panRect.bottom + magneticBuffer;

    if (isOverPan) {
      addItem();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] p-2 sm:p-4">
      
      {/* HEADER */}
      <div className="w-full max-w-7xl flex justify-between items-center px-2 py-1 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Weight Lab</h1>
            <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Matte Wooden Station</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
            <div className="bg-[#dfd7cc] p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-[#c4a484]/20">
                <button onClick={() => { setMode('concept'); resetLevel(); }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'concept' ? 'bg-white text-blue-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                    CONCEPT BUILDING
                </button>
                <button onClick={() => { setMode('practice'); resetLevel(); }}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[8px] sm:text-[10px] font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-[#8d6e63]'}`}>
                    PRACTICE
                </button>
            </div>
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={shuffleMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* THE STAGE */}
      <div className="flex-1 w-full max-w-[1440px] bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative mt-1 overflow-visible flex flex-col items-center justify-start pb-10 sm:pb-20">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        <div className="absolute top-4 right-6 opacity-20 text-[#5d4037] flex flex-col items-center">
            <Clock size={32} />
            <div className="text-[7px] font-black uppercase tracking-widest leading-none">ROOM 04</div>
        </div>

        {/* SCALE AREA */}
        <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.52] sm:scale-[0.8] origin-top transition-transform overflow-visible mt-16 sm:mt-12">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[320px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <motion.div animate={{ rotate: rotation }} transition={{ type: "spring", stiffness: 35, damping: 14 }}
                    className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2"
                    style={{ originX: 0.5, originY: 0.5 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LEFT PAN */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div ref={leftPanRef} className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(placedCount)].map((_, i) => (
                                    <motion.div key={i} initial={{ scale: 0, y: -60 }} animate={{ scale: 1, y: 0 }} className="text-4xl sm:text-7xl drop-shadow-lg">{currentFruit.icon}</motion.div>
                                ))}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{leftWeight}g</div>
                        </div>
                    </motion.div>

                    {/* RIGHT PAN */}
                    <motion.div animate={{ rotate: -rotation }} className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center" style={{ originX: "50%", originY: "0%" }}>
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetWeight}g</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        {/* COMMUNICATION ZONE */}
        <div className="absolute bottom-4 sm:bottom-12 left-0 w-full flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {isBalanced ? (
                    <motion.div key="balanced-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
                        <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
                            <Trophy size={24} className="animate-bounce shrink-0" />
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center">
                                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Balanced!</span>
                                <span className="text-xs sm:text-lg font-bold leading-none">It took {placedCount} <span className="inline-block scale-110">{currentFruit.icon}</span> {currentFruit.name}s!</span>
                            </div>
                            <Sparkles size={20} className="text-yellow-300 shrink-0" />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="question-msg" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="bg-white/90 backdrop-blur-md px-5 py-3 sm:px-8 sm:py-4 rounded-[2rem] shadow-2xl border-2 border-[#8d6e63]/20 flex items-center gap-2 sm:gap-4 text-center z-[90]">
                        <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">How many <span className="inline-block scale-110 mx-1">{currentFruit.icon}</span> {currentFruit.name}s will make the scale balanced?</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* DEPOT AREA */}
      <div className="w-full max-w-4xl flex flex-col items-center mt-2 z-50 mb-2">
        <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2.5rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">{currentFruit.name} Depot</div>
            <div className="flex items-center gap-8 sm:gap-16">
                <div className="text-center bg-white/40 p-3 sm:p-5 rounded-2xl border-2 border-white shadow-inner">
                    <p className="text-[#8d6e63] font-black text-[8px] uppercase tracking-widest mb-1">Unit Weight</p>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl sm:text-5xl drop-shadow-md">{currentFruit.icon}</span>
                        <span className="text-3xl sm:text-5xl font-black text-[#5d4037] tracking-tighter leading-none">= {currentFruit.weight}g</span>
                    </div>
                </div>
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center bg-black/5 rounded-full border-2 border-dashed border-[#c4a484]/40 overflow-visible">
                   {/* Draggable Source Item - Practice Mode Only */}
                   {!isBalanced && mode === 'practice' && (
                     <motion.div 
                        ref={appleSourceRef} 
                        drag 
                        dragSnapToOrigin 
                        onDragEnd={handleDragEnd} 
                        whileHover={{ scale: 1.15 }} 
                        whileDrag={{ scale: 1.3, zIndex: 1000, cursor: 'grabbing', filter: 'drop-shadow(0 20px 20px rgba(0,0,0,0.3))' }}
                        className="text-[100px] sm:text-[140px] cursor-grab active:cursor-grabbing z-[60] select-none touch-none"
                        style={{ position: 'relative' }}
                      >
                        {currentFruit.icon}
                      </motion.div>
                   )}
                   {/* Static Ghost Reference - Concept or Balanced */}
                   {(isBalanced || mode === 'concept') && (
                     <div ref={appleSourceRef} className="text-[100px] sm:text-[140px] opacity-10 absolute inset-0 flex items-center justify-center pointer-events-none">{currentFruit.icon}</div>
                   )}
                </div>
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 items-center px-2 pb-2">
          <button onClick={() => shuffleMission()} className={`relative flex items-center justify-between w-full p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-2 sm:p-4 rounded-xl"><ChevronRight size={24} /></div>
              <div className="leading-tight uppercase tracking-tighter">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW MISSION'}</div>
            </div>
            <div className="flex items-center relative z-10">
              {autoNextTimer !== null ? (
                <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-4 sm:px-8 py-1.5 sm:py-3 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[140px] sm:min-w-[280px]">
                  <div className="flex items-center gap-1 shrink-0"><Timer size={18} className="animate-spin text-indigo-300" /><span className="text-xl sm:text-4xl font-mono">{autoNextTimer}</span></div>
                  <div className="flex justify-between w-full px-3 relative">
                      {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>👣</div>))}
                      <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-sm sm:text-3xl pointer-events-none">🏃</motion.div>
                  </div>
                </div>
              ) : <FastForward className="opacity-30 sm:w-10 sm:h-10" />}
            </div>
          </button>
          <button onClick={() => shuffleMission()} className="flex items-center justify-center gap-3 sm:gap-6 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
            <Shuffle size={20} />
            <span className="uppercase tracking-tighter">Shuffle Lab</span>
          </button>
      </div>

      {/* VIRTUAL HAND GUIDE */}
      <AnimatePresence>
        {mode === 'concept' && virtualHandPos && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, left: virtualHandPos.x, top: virtualHandPos.y }}
                transition={{ duration: 1, ease: "easeInOut" }} className="fixed pointer-events-none z-[1000] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl">
                <div className="relative flex items-center justify-center">
                    <Hand className="text-stone-800 w-8 h-8 sm:w-16 sm:h-16" fill="white" />
                    <AnimatePresence>
                      {isGrabbing && (
                        <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute text-[70px] sm:text-[120px] filter drop-shadow-xl z-[61] opacity-100">
                          {currentFruit.icon}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 bg-blue-400/20 rounded-full blur-[40px]" />
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}