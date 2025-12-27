// import React, { useState, useEffect, useRef, useCallback } from 'react';

// // Helper to convert base64 to ArrayBuffer
// const base64ToArrayBuffer = (base64) => {
//   const binaryString = window.atob(base64);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

// // Helper to convert PCM data to WAV Blob
// const pcmToWav = (pcm16, sampleRate) => {
//   const dataView = new DataView(new ArrayBuffer(44 + pcm16.byteLength));
//   let offset = 0;

//   function writeString(str) {
//     for (let i = 0; i < str.length; i++) {
//       dataView.setUint8(offset + i, str.charCodeAt(i));
//     }
//     offset += str.length;
//   }

//   function writeUint32(val) {
//     dataView.setUint32(offset, val, true);
//     offset += 4;
//   }

//   function writeUint16(val) {
//     dataView.setUint16(offset, val, true);
//     offset += 2;
//   }

//   // RIFF chunk
//   writeString('RIFF');
//   writeUint32(36 + pcm16.byteLength);
//   writeString('WAVE');

//   // fmt chunk
//   writeString('fmt ');
//   writeUint32(16);
//   writeUint16(1); // Audio format 1 = PCM
//   writeUint16(1); // Number of channels (mono)
//   writeUint32(sampleRate);
//   writeUint32(sampleRate * 2); // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
//   writeUint16(2); // Block align (NumChannels * BitsPerSample/8)
//   writeUint16(16); // Bits per sample

//   // data chunk
//   writeString('data');
//   writeUint32(pcm16.byteLength);

//   for (let i = 0; i < pcm16.length; i++) {
//     dataView.setInt16(offset, pcm16[i], true); // Write PCM data
//     offset += 2;
//   }

//   return new Blob([dataView], { type: 'audio/wav' });
// };

// // Function to play audio from base64 PCM data, returns a Promise that resolves when audio ends.
// const playAudio = (audioData, mimeType, audioContext) => {
//   return new Promise(async (resolve, reject) => {
//     let audio = null;
//     let audioUrl = null;

//     try {
//       const currentAudioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
//       if (currentAudioContext.state === 'suspended') {
//         await currentAudioContext.resume();
//       }

//       const sampleRateMatch = mimeType.match(/rate=(\d+)/);
//       const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;

//       const pcmData = base64ToArrayBuffer(audioData);
//       const pcm16 = new Int16Array(pcmData);
//       const wavBlob = pcmToWav(pcm16, sampleRate);
//       audioUrl = URL.createObjectURL(wavBlob);
//       audio = new Audio(audioUrl);

//       const cleanup = () => {
//         if (audioUrl) {
//           URL.revokeObjectURL(audioUrl);
//           audioUrl = null;
//         }
//         if (audio) {
//           audio.onended = null;
//           audio.onerror = null;
//           audio = null;
//         }
//       };

//       audio.onerror = (e) => {
//         console.error("Audio error during playback:", e);
//         cleanup();
//         reject(new Error("Audio playback failed due to error event"));
//       };

//       audio.onended = () => {
//         cleanup();
//         resolve();
//       };

//       await audio.play();
//     } catch (playError) {
//       console.error("Audio play failed, likely autoplay blocked or other issue:", playError);
//       const modalId = `audio-play-modal-${Date.now()}`;
//       const modal = document.createElement('div');
//       modal.id = modalId;
//       modal.className = `fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50`;
//       modal.innerHTML = `
//         <div class="bg-white p-6 rounded-lg shadow-xl text-center rounded-2xl">
//           <p class="text-lg font-semibold mb-4 text-gray-800">Please interact with the page to enable audio playback</p>
//           <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" onclick="document.getElementById('${modalId}').remove();">OK</button>
//         </div>
//       `;
//       document.body.appendChild(modal);
//       if (audioUrl) URL.revokeObjectURL(audioUrl);
//       reject(new Error("Audio play failed, user interaction needed or browser blocked autoplay"));
//     }
//   });
// };

// // Mock TTS function to use a local API
// const fetchTTS = async (text, langCode) => {
//   try {
//     const payload = {
//       contents: [{
//         parts: [{ text: text }]
//       }],
//       generationConfig: {
//         responseModalities: ["AUDIO"],
//         speechConfig: {
//           voiceConfig: {
//             prebuiltVoiceConfig: { voiceName: "Kore" }
//           }
//         }
//       },
//       model: "gemini-2.5-flash-preview-tts"
//     };

//     if (langCode === 'hi') {
//       payload.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName = "Leda";
//       payload.contents[0].parts[0].text = `Say in Hindi: ${text}`;
//     }

//     const apiKey = "";
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       throw new Error(`API call failed with status: ${response.status}`);
//     }

//     const result = await response.json();
//     const part = result?.candidates?.[0]?.content?.parts?.[0];
//     const audioData = part?.inlineData?.data;
//     const mimeType = part?.inlineData?.mimeType;

//     if (audioData && mimeType && mimeType.startsWith("audio/")) {
//       return { audioData, mimeType };
//     } else {
//       console.warn("API response did not contain valid audio data.");
//       return null;
//     }
//   } catch (error) {
//     console.error("Failed to fetch TTS from API:", error);
//     return null;
//   }
// };

// const translations = {
//   en: {
//     scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
//     selectLanguage: "Select Language",
//     changeTheme: "Change Theme",
//     startLesson: "Start Lesson",
//     reset: "🔄 Reset",
//     intro_message: "On the left hand side you have four apples and on the right hand side you have the weight as twelve grams. Can you find the weight of one apple?",
//     question: "Can you find the weight of one apple?",
//     correct: "That is correct! The weight of one apple is three grams.",
//     incorrect: "That is incorrect. Try again!",
//     explanation_title: "Here is the explanation:",
//     explanation_line1: "The scale is balanced, so the weight of the four apples equals 12 grams.",
//     explanation_line2: "4 * Weight of one apple = 12 grams",
//     explanation_line3: "To find the weight of one apple, divide both sides by 4.",
//     explanation_line4: "Weight of one apple = 12 / 4",
//     explanation_line5: "Weight of one apple = 3 grams",
//     startMessage: "Welcome to the interactive balance scale. Click start to begin the lesson.",
//     options: [2, 3, 4, 5]
//   },
//   hi: {
//     scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
//     selectLanguage: "भाषा चुनें",
//     changeTheme: "थीम बदलें",
//     startLesson: "पाठ शुरू करें",
//     reset: "🔄 रीसेट करें",
//     intro_message: "बाईं ओर आपके पास चार सेब हैं और दाईं ओर आपके पास बारह ग्राम का वजन है। क्या आप एक सेब का वजन पता लगा सकते हैं?",
//     question: "क्या आप एक सेब का वजन पता लगा सकते हैं?",
//     correct: "यह सही है! एक सेब का वजन तीन ग्राम है।",
//     incorrect: "यह गलत है। पुनः प्रयास करें!",
//     explanation_title: "यहां स्पष्टीकरण है:",
//     explanation_line1: "पैमाना संतुलित है, इसलिए चार सेब का वजन 12 ग्राम के बराबर है।",
//     explanation_line2: "4 * एक सेब का वजन = 12 ग्राम",
//     explanation_line3: "एक सेब का वजन ज्ञात करने के लिए, दोनों पक्षों को 4 से विभाजित करें।",
//     explanation_line4: "एक सेब का वजन = 12 / 4",
//     explanation_line5: "एक सेब का वजन = 3 ग्राम",
//     startMessage: "इंटरैक्टिव संतुलन पैमाने में आपका स्वागत है। पाठ शुरू करने के लिए 'शुरू करें' पर क्लिक करें।",
//     options: [2, 3, 4, 5]
//   }
// };

// const APPLE_WEIGHT = 3; // Fixed weight of each apple for this problem
// const RIGHT_SIDE_VALUE = 12; // Fixed value on the right side for this problem
// const NUM_APPLES = 4;

// const App = () => {
//   const [currentLanguage, setCurrentLanguage] = useState('en');
//   const [theme, setTheme] = useState('dark');
//   const [feedback, setFeedback] = useState(null);
//   const [showLesson, setShowLesson] = useState(false);
//   const [isLessonStarted, setIsLessonStarted] = useState(false);
//   const [userInteraction, setUserInteraction] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [audioEnabled, setAudioEnabled] = useState(true);
//   const [answered, setAnswered] = useState(false);

//   const audioContext = useRef(null);

//   const t = useCallback((key, params) => {
//     const text = translations[currentLanguage][key];
//     if (typeof text === 'function') {
//       return text(params);
//     }
//     return text;
//   }, [currentLanguage]);

//   const speakMessage = useCallback(async (key, params = null) => {
//     if (!userInteraction || !audioEnabled) return;
//     const textToSpeak = t(key, params);
    
//     try {
//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(textToSpeak);
//         utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
//         utterance.rate = 0.8;
//         utterance.pitch = 1;
//         utterance.volume = 0.8;
        
//         speechSynthesis.cancel();
        
//         return new Promise((resolve) => {
//           utterance.onend = () => resolve();
//           utterance.onerror = (error) => {
//             console.warn(`[Speech] Web Speech API error:`, error);
//             resolve();
//           };
//           speechSynthesis.speak(utterance);
//         });
//       }
      
//       const audioContent = await fetchTTS(textToSpeak, currentLanguage);
//       if (audioContent && audioContext.current) {
//         await playAudio(audioContent.audioData, audioContent.mimeType, audioContext.current);
//       }
//     } catch (error) {
//       console.warn(`[Speech] Failed to play audio for "${key}":`, error);
//     }
//   }, [currentLanguage, userInteraction, audioEnabled, t]);

//   useEffect(() => {
//     const initAudio = () => {
//       try {
//         audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
//       } catch (error) {
//         console.warn("AudioContext not supported:", error);
//         setAudioEnabled(false);
//       }
//     };
//     if (!audioContext.current) {
//       initAudio();
//     }
//   }, []);

//   useEffect(() => {
//     if (isLessonStarted) {
//       const runLessonSequence = async () => {
//         if (audioEnabled && userInteraction) {
//           try {
//             if (audioContext.current?.state === 'suspended') {
//               await audioContext.current.resume();
//             }
//           } catch (error) {
//             console.warn("Failed to resume audio context:", error);
//           }
//           speakMessage('intro_message');
//         }
//       };
//       runLessonSequence();
//     }
//   }, [isLessonStarted, speakMessage, audioEnabled, userInteraction]);

//   const handleStartLesson = () => {
//     setUserInteraction(true);
//     setShowLesson(true);
//     setIsLessonStarted(true);
//     if (audioContext.current && audioEnabled) {
//       audioContext.current.resume().catch(error => {
//         console.warn("Failed to resume AudioContext:", error);
//       });
//     }
//   };

//   const handleReset = () => {
//     setFeedback(null);
//     setIsLessonStarted(false);
//     setShowLesson(false);
//     setShowExplanation(false);
//     setAnswered(false);
//   };

//   const handleAnswer = (answer) => {
//     setAnswered(true);
//     if (answer === APPLE_WEIGHT) {
//       setFeedback({ type: 'correct', message: t('correct') });
//       setShowExplanation(true);
//       speakMessage('correct');
      
//       const lines = [
//         'explanation_title',
//         'explanation_line1',
//         'explanation_line2',
//         'explanation_line3',
//         'explanation_line4',
//         'explanation_line5'
//       ];
      
//       let delay = 1000;
//       lines.forEach(lineKey => {
//         setTimeout(() => {
//           speakMessage(lineKey);
//         }, delay);
//         delay += 3000; // Adjust delay for cleaner flow
//       });

//     } else {
//       setFeedback({ type: 'incorrect', message: t('incorrect') });
//       setShowExplanation(false);
//       speakMessage('incorrect');
//     }
//   };

//   const calculateTilt = () => {
//     return 0;
//   };

//   const tilt = calculateTilt();

//   // Common Tailwind classes
//   const containerClasses = `min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${theme === 'light' ? 'bg-gray-200 text-gray-900' : 'bg-gray-900 text-white'}`;
//   const themeSwitchClasses = `px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}`;
//   const buttonClasses = `px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl`;
//   const panClasses = `relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl transition-all duration-700 border-4`;
//   const panTextClasses = `text-lg sm:text-2xl md:text-3xl font-bold transition-colors duration-300 z-10`;
//   const feedbackClasses = (type) => `mt-4 p-4 rounded-lg shadow-xl text-center font-semibold text-lg sm:text-xl ${type === 'correct' ? 'bg-green-200 text-green-800 border border-green-400' : 'bg-red-200 text-red-800 border border-red-400'}`;
//   const optionButtonClasses = (option) => `px-6 py-3 rounded-full font-bold shadow-lg transition-transform transform hover:scale-105 active:scale-95 ${
//     answered && option === APPLE_WEIGHT
//       ? 'bg-green-500 text-white hover:bg-green-600' 
//       : 'bg-indigo-500 text-white hover:bg-indigo-600'
//   } ${answered && option !== APPLE_WEIGHT ? 'bg-red-500 text-white' : ''} `;

//   return (
//     <div className={containerClasses}>
//       <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-sm sm:max-w-none sm:w-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
//         <div className="flex items-center gap-2 justify-center sm:justify-start">
//           <label htmlFor="language-select" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
//             {t('selectLanguage')}:
//           </label>
//           <select
//             id="language-select"
//             value={currentLanguage}
//             onChange={(e) => {
//               setCurrentLanguage(e.target.value);
//               handleReset();
//             }}
//             className={`p-1 sm:p-2 border rounded-md text-sm sm:text-base ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}`}
//           >
//             <option value="en">English</option>
//             <option value="hi">हिन्दी</option>
//           </select>
//         </div>
//         <button
//           onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//           className={themeSwitchClasses}
//         >
//           {t('changeTheme')} ({theme === 'light' ? 'Dark' : 'Light'})
//         </button>
//         <button
//           onClick={() => setAudioEnabled(!audioEnabled)}
//           className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base ${audioEnabled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
//         >
//           🔊 {audioEnabled ? 'ON' : 'OFF'}
//         </button>
//       </div>

//       <h2 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight transition-colors duration-300 text-center ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
//         {t('scaleTitle')}
//       </h2>

//       {!showLesson ? (
//         <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-2xl max-w-2xl mx-auto border-4 text-center space-y-4 transition-colors duration-300 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
//           <p className="text-xl sm:text-2xl font-semibold">{t('startMessage')}</p>
//           <button onClick={handleStartLesson} className={buttonClasses}>
//             {t('startLesson')}
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="relative w-full max-w-2xl h-64 sm:h-72 md:h-80 flex items-center justify-center mb-8">
//             {/* Base/Stand */}
//             <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 sm:w-40 sm:h-8 rounded-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-600 to-gray-800'}`}></div>
            
//             {/* Vertical Support */}
//             <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-4 h-20 sm:w-5 sm:h-24 md:w-6 md:h-28 rounded-t-full shadow-lg ${theme === 'light' ? 'bg-gradient-to-b from-gray-500 to-gray-700' : 'bg-gradient-to-b from-gray-700 to-gray-900'}`}></div>
            
//             {/* Fulcrum */}
//             <div className={`absolute bottom-32 sm:bottom-36 md:bottom-40 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full shadow-xl border-4 ${theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-700 border-yellow-800'}`}>
//               <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white to-gray-200 opacity-30"></div>
//             </div>
            
//             {/* Main beam */}
//             <div
//               className={`absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg h-3 sm:h-4 md:h-5 rounded-full shadow-2xl transition-transform duration-700 ease-in-out ${theme === 'light' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400' : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600'}`}
//               style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}
//             >
//               <div className="absolute inset-x-0 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-40"></div>
              
//               <div className={`absolute left-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
//               <div className={`absolute right-8 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-lg ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'} border-2 border-gray-800`}></div>
//             </div>

//             {/* Chains */}
//             <div className="absolute bottom-36 sm:bottom-40 md:bottom-44 w-full max-w-lg flex justify-between px-8"
//                  style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
//               <div className="flex flex-col items-center">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={`left-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
//                 ))}
//               </div>
//               <div className="flex flex-col items-center">
//                 {[...Array(3)].map((_, i) => (
//                   <div key={`right-${i}`} className={`w-1 h-4 sm:h-5 mb-1 rounded-full ${theme === 'light' ? 'bg-gray-600' : 'bg-gray-400'}`}></div>
//                 ))}
//               </div>
//             </div>

//             {/* The pans */}
//             <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 w-full max-w-lg flex justify-between px-8"
//                  style={{ transform: `rotate(${tilt}deg)`, transformOrigin: 'center center' }}>
              
//               {/* Left Pan (Fixed Apple Count) */}
//               <div
//                 className={`${panClasses} ${theme === 'light' ? 'bg-gradient-to-br from-indigo-200 to-indigo-400 border-indigo-500' : 'bg-gradient-to-br from-indigo-600 to-indigo-800 border-indigo-400'}`}
//                 style={{ transform: `rotate(${-tilt}deg)` }}
//               >
//                 <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
//                 <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-700'} opacity-60`}></div>
                
//                 <div className="absolute inset-4 flex flex-col items-center justify-center">
//                   <div className="flex flex-wrap justify-center gap-1 items-center">
//                     {[...Array(NUM_APPLES)].map((_, i) => (
//                       <span key={i} className="text-2xl sm:text-3xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🍎</span>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Right Pan (Fixed Value) */}
//               <div
//                 className={`${panClasses} ${theme === 'light' ? 'bg-gradient-to-br from-purple-200 to-purple-400 border-purple-500' : 'bg-gradient-to-br from-purple-600 to-purple-800 border-purple-400'}`}
//                 style={{ transform: `rotate(${-tilt}deg)` }}
//               >
//                 <div className="absolute inset-2 rounded-full border-2 border-white opacity-20"></div>
//                 <div className={`absolute bottom-1 left-1 right-1 h-2 rounded-full ${theme === 'light' ? 'bg-purple-500' : 'bg-purple-700'} opacity-60`}></div>
                
//                 <div className="absolute inset-0 flex flex-col items-center justify-center">
//                   <div className="text-center">
//                     <div className="text-3xl sm:text-4xl mb-1">⚖️</div>
//                     <span className={`text-xl sm:text-2xl font-bold ${theme === 'light' ? 'text-purple-800' : 'text-purple-100'} drop-shadow-lg`}>
//                       {RIGHT_SIDE_VALUE}g
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Balance indicator */}
//             <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full shadow-lg transition-all duration-700 ${
//               true // Always balanced in this version
//                 ? theme === 'light' ? 'bg-green-200 text-green-800 border-2 border-green-400' : 'bg-green-800 text-green-200 border-2 border-green-600'
//                 : 'bg-orange-200 text-orange-800 border-2 border-orange-400' // Placeholder for not balanced
//             }`}>
//               <div className="flex items-center gap-2">
//                 <span className="text-lg">✅</span>
//                 <span className="font-bold text-sm sm:text-base">BALANCED!</span>
//               </div>
//             </div>
//           </div>
          
//           <p className={`text-center text-lg sm:text-xl font-semibold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>{t('question')}</p>
          
//           <div className="flex flex-wrap justify-center gap-4 mt-8">
//             {translations[currentLanguage].options.map((option) => (
//               <button
//                 key={option}
//                 onClick={() => handleAnswer(option)}
//                 className={optionButtonClasses(option)}
//                 disabled={answered}
//               >
//                 {option}g
//               </button>
//             ))}
//           </div>
          
//           {feedback && (
//             <div className={feedbackClasses(feedback.type)}>
//               {feedback.message}
//             </div>
//           )}

//           {showExplanation && (
//             <div className={`mt-4 p-4 rounded-lg shadow-xl text-center font-bold text-lg sm:text-xl md:text-2xl ${theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-900 text-green-100'}`}>
//                 <p>{t('explanation_title')}</p>
//                 <div className="my-4">
//                   <p>{t('explanation_line1')}</p>
//                   <p>{t('explanation_line2')}</p>
//                 </div>
//                 <div className="my-4">
//                   <p>{t('explanation_line3')}</p>
//                   <p>{t('explanation_line4')}</p>
//                 </div>
//                 <p>{t('explanation_line5')}</p>
//             </div>
//           )}

//           <button
//             onClick={handleReset}
//             className={`mt-8 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
//               ${theme === 'light' ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-400' : 'bg-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'}`}
//           >
//             {t('reset')}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCcw, CheckCircle2, 
  ChevronRight, Shuffle, 
  FastForward, Scale,
  Trophy, Sparkles, Volume2, VolumeX,
  XCircle, Timer, Info, X, Equal
} from 'lucide-react';

export default function App() {
  const [currentAppleWeight, setCurrentAppleWeight] = useState(3);
  const [appleCount, setAppleCount] = useState(4);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [feedback, setFeedback] = useState(null); 
  
  // Explanation States
  const [isExplaining, setIsExplaining] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(null); // 'left' | 'right' | 'both' | null
  const [explanationText, setExplanationText] = useState("");
  const [formulas, setFormulas] = useState([]); 

  const timerIntervalRef = useRef(null);

  // Improved speak function with fail-safe resolve
  const speak = useCallback((text) => {
    if (isMuted) return Promise.resolve();
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      
      // Fail-safe: if speech fails or hangs, resolve after 5 seconds
      const timeout = setTimeout(resolve, 5000);

      utterance.onend = () => {
        clearTimeout(timeout);
        resolve();
      };
      utterance.onerror = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }, [isMuted]);

  const generateMission = useCallback(() => {
    const weight = Math.floor(Math.random() * 5) + 2; 
    const count = Math.floor(Math.random() * 4) + 2;  
    const correct = weight;
    
    const opts = new Set([correct]);
    while(opts.size < 4) {
      opts.add(Math.floor(Math.random() * 8) + 1);
    }
    
    setCurrentAppleWeight(weight);
    setAppleCount(count);
    setOptions(Array.from(opts).sort((a, b) => a - b));
    setSelectedAnswer(null);
    setIsCorrect(false);
    setFeedback(null);
    setAutoNextTimer(null);
    setIsExplaining(false);
    setFormulas([]);
    window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    generateMission();
  }, [generateMission]);

  const runExplanation = async () => {
    const total = appleCount * currentAppleWeight;
    
    // Set all formulas immediately from the beginning as requested
    setFormulas([
      "Weight on Left = Weight on Right",
      `${appleCount} × weight of one apple = ${total}g`,
      `Weight of one apple = ${total}g ÷ ${appleCount}`,
      `Weight of one apple = ${currentAppleWeight}g`
    ]);

    setIsExplaining(true);
    
    // Narration sequence with visual highlights
    setExplanationText("Look at the scale. It is perfectly balanced.");
    await speak("Look at the scale. It is perfectly balanced.");
    
    setActiveHighlight('both');
    setExplanationText("Since the scale is balanced, the weight on the left scale should be equal to the weight on the right scale.");
    await speak("Since the scale is balanced, then the weight on the left scale should be equal to the weight on the right scale.");

    setActiveHighlight('left');
    setExplanationText(`So, ${appleCount} fruits multiplied by the weight of one apple must equal ${total} grams.`);
    await speak(`Number of fruits multiplied by weight of one apple equals ${total} grams.`);

    setActiveHighlight('right');
    setExplanationText(`To find the weight of one apple, we divide the total weight by the number of apples.`);
    await speak(`Weight on one apple equals weight divided by Number of apples.`);

    setActiveHighlight('both');
    setExplanationText(`That means one apple weighs ${currentAppleWeight} grams!`);
    await speak(`That means one apple weighs ${currentAppleWeight} grams!`);

    setActiveHighlight(null);
  };

  const handleAnswer = (val) => {
    if (isCorrect) return;
    setSelectedAnswer(val);
    if (val === currentAppleWeight) {
      setIsCorrect(true);
      setFeedback('correct');
      setAutoNextTimer(10);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(p => (p > 0 ? p - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      generateMission();
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [autoNextTimer, generateMission]);

  const targetTotalWeight = appleCount * currentAppleWeight;

  return (
    <div className="h-screen flex flex-col items-center bg-[#f1f0ee] font-sans select-none overflow-hidden text-[#5d4037] pt-4 sm:pt-6 pb-2 px-2 sm:px-4">
      
      {/* HEADER */}
      <div className="w-full max-w-5xl flex justify-between items-center px-2 py-1 z-50 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#8d6e63] rounded-xl shadow-lg flex items-center justify-center text-white border-b-2 border-black/20">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter leading-none">Algebra Lab</h1>
            <p className="text-[7px] sm:text-[9px] font-black text-[#a88a6d] uppercase tracking-widest leading-none mt-0.5">Problem Solving Station</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 scale-90 sm:scale-100">
            <button onClick={() => setIsMuted(!isMuted)} className="p-2.5 bg-white text-[#8d6e63] rounded-xl shadow-sm border border-[#c4a484]/10 active:scale-95 transition-transform">
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <button onClick={generateMission} className="p-2.5 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-2 border-[#5d4037] active:scale-95 transition-transform">
                <RefreshCcw size={16} />
            </button>
        </div>
      </div>

      {/* SECTION 1: THE SCALE STAGE */}
      <div className="flex-1 w-full max-w-5xl bg-[#e6dccb] rounded-[2rem] sm:rounded-[3.5rem] shadow-xl border-b-[10px] border-[#c4a484] relative overflow-visible flex flex-col items-center justify-start pb-0">
        <div className="absolute inset-0 bg-[#e6dccb] pointer-events-none rounded-[2rem] sm:rounded-[3.5rem]" style={{ backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(93,64,55,0.02) 50px, rgba(93,64,55,0.02) 100px)` }} />
        
        <div className="relative w-full max-w-4xl flex justify-center items-center scale-[0.45] sm:scale-[0.75] origin-top transition-transform overflow-visible mt-16 sm:mt-24">
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-10 pointer-events-none">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8d6e63] to-[#5d4037] rounded-full border-4 border-[#c4a484] shadow-xl mb-[-20px] relative z-20" />
                <div className="w-8 h-[220px] bg-gradient-to-r from-[#5d4037] via-[#8d6e63] to-[#5d4037] rounded-b-xl shadow-2xl relative" />
                <div className="absolute bottom-[-30px] w-56 h-16 bg-[#3e2723] rounded-t-[4rem] shadow-xl z-0 border-b-4 border-black/20" />
            </div>

            <div className="relative w-full flex justify-center z-20 mt-[12%]">
                <div className="relative w-full h-7 bg-gradient-to-b from-[#8d6e63] to-[#3e2723] rounded-full flex justify-between items-center shadow-lg border-b-2 border-black/20 px-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-yellow-300 to-amber-600 rounded-full border-2 border-[#3e2723] shadow-md z-30" />
                    
                    {/* LEFT PAN */}
                    <div className="absolute left-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                            <div className="flex flex-wrap-reverse justify-center gap-1 w-[90%] mb-10">
                                {[...Array(appleCount)].map((_, i) => (
                                    <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl sm:text-6xl drop-shadow-lg">🍎</motion.div>
                                ))}
                            </div>
                            <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">? g</div>
                        </div>
                    </div>

                    {/* RIGHT PAN */}
                    <div className="absolute right-[-15px] top-0 w-32 sm:w-64 flex flex-col items-center">
                        <div className="flex justify-between w-[80%] px-4">
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[15deg] rounded-full" />
                            <div className="w-1 h-40 bg-gradient-to-b from-[#3e2723]/60 to-[#a88a6d]/20 origin-top rotate-[-15deg] rounded-full" />
                        </div>
                        <div className="w-full h-20 sm:h-32 bg-gradient-to-b from-[#a88a6d] to-[#8d6e63] rounded-b-[6rem] border-t-[10px] border-[#5d4037]/20 shadow-inner relative flex items-end justify-center pb-8">
                             <div className="bg-gradient-to-br from-yellow-400 to-amber-900 text-white w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center rounded-[2rem] font-black text-3xl sm:text-7xl shadow-xl mb-12 border-b-8 border-black/30">{targetTotalWeight}g</div>
                             <div className="absolute bottom-[-45px] bg-[#5d4037] text-white px-8 py-2 rounded-full font-black text-lg sm:text-3xl shadow-lg">{targetTotalWeight}g</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* FEEDBACK OVERLAY */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center pointer-events-none px-4">
            <AnimatePresence mode="wait">
                {feedback === 'correct' && (
                    <motion.div key="correct-toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="z-[100] w-full max-w-lg">
                        <div className="bg-emerald-600 text-white py-3 px-8 rounded-full shadow-2xl flex items-center justify-center gap-4 border-b-4 border-emerald-800 backdrop-blur-sm">
                            <Trophy size={24} className="animate-bounce" />
                            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                                <span className="text-[10px] sm:text-sm font-black uppercase tracking-widest opacity-80 leading-none">Solved!</span>
                                <span className="text-xs sm:text-lg font-bold leading-none">One 🍎 weighs {currentAppleWeight} grams!</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                {feedback === 'incorrect' && (
                    <motion.div key="wrong-toast" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-red-500 text-white px-8 py-3 rounded-full shadow-2xl font-black uppercase tracking-widest flex items-center gap-3">
                        <XCircle size={20} /> Try again!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* SECTION 2: QUESTION & OPTIONS */}
      <div className="w-full max-w-5xl flex flex-col items-center mt-2 z-50 mb-1">
        <div className="bg-[#dfd7cc] p-4 sm:p-6 rounded-[2rem] border-4 border-[#c4a484] w-[95%] sm:w-full flex flex-col items-center shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#5d4037] text-[#e6dccb] px-6 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border-2 border-[#e6dccb]">Problem Control</div>
            
            <div className="mb-4 sm:mb-6 text-center max-w-xl">
               <p className="text-sm sm:text-xl font-bold text-[#5d4037] leading-tight">
                  If the scale is balanced, what is the weight of <span className="inline-block scale-110 mx-1">🍎</span> ONE apple?
               </p>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6 w-full max-w-2xl">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={isCorrect}
                    className={`relative group h-14 sm:h-20 rounded-2xl sm:rounded-3xl font-black text-xl sm:text-3xl transition-all shadow-lg border-b-4 
                      ${isCorrect && opt === currentAppleWeight ? 'bg-emerald-500 text-white border-emerald-700 scale-105' : 
                        selectedAnswer === opt && opt !== currentAppleWeight ? 'bg-red-400 text-white border-red-600 grayscale' :
                        'bg-white text-[#5d4037] border-gray-300 hover:translate-y-[-2px] active:translate-y-[2px] active:border-b-0'}`}
                  >
                    {opt}g
                    {isCorrect && opt === currentAppleWeight && (
                      <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md text-emerald-600">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </button>
                ))}
            </div>
        </div>
      </div>

      {/* NAVIGATION BAR */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 items-center px-2 pb-1">
          <button onClick={() => generateMission()} className={`relative flex items-center justify-between w-full p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 ${autoNextTimer !== null ? 'bg-indigo-600 text-white border-indigo-900' : 'bg-[#3e2723] text-[#dfc4a1] border-black'}`}>
            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-1.5 sm:p-3 rounded-xl"><ChevronRight size={20} /></div>
              <div className="leading-tight uppercase tracking-tighter text-xs sm:text-lg">{autoNextTimer !== null ? 'NEXT NOW' : 'NEW CHALLENGE'}</div>
            </div>
            <div className="flex items-center relative z-10">
              {autoNextTimer !== null ? (
                <div className="flex items-center gap-2 sm:gap-4 bg-black/50 px-3 sm:px-6 py-1 sm:py-2 rounded-full border border-white/10 shadow-inner relative overflow-hidden min-w-[100px] sm:min-w-[200px]">
                  <div className="flex items-center gap-1 shrink-0"><Timer size={14} className="animate-spin text-indigo-300" /><span className="text-lg sm:text-3xl font-mono leading-none">{autoNextTimer}</span></div>
                  <div className="flex justify-between w-full px-2 relative">
                      {[...Array(10)].map((_, i) => (<div key={i} className={`text-[8px] sm:text-base ${ (10 - autoNextTimer) > i ? 'opacity-100' : 'opacity-20'}`}>🍎</div>))}
                      <motion.div animate={{ left: `${((10 - autoNextTimer) / 10) * 100}%`, scaleX: -1 }} className="absolute top-1/2 -translate-y-1/2 text-xs sm:text-2xl pointer-events-none">🏃</motion.div>
                  </div>
                </div>
              ) : <FastForward className="opacity-30 w-6 h-6 sm:w-8 sm:h-8" />}
            </div>
          </button>
          
          <button onClick={runExplanation} className="flex items-center justify-center gap-2 sm:gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-2 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-sm sm:text-xl active:scale-95 shadow-lg border-b-4 border-[#3e2723]">
            <Info size={18} />
            <span className="uppercase tracking-tighter text-xs sm:text-lg">View Explanation</span>
          </button>
      </div>

      {/* EXPLANATION MODAL */}
      <AnimatePresence>
        {isExplaining && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[#3e2723]/90 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-4xl bg-[#f1f0ee] rounded-[3rem] shadow-2xl overflow-hidden relative flex flex-col items-center p-6 sm:p-10 border-[6px] border-[#8d6e63]">
              <button 
                onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
                className="absolute top-6 right-6 p-3 bg-[#8d6e63] text-white rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mb-4 text-[#5d4037]">Step-by-Step Logic</h2>

              {/* MINI SCALE ASSEMBLY */}
              <div className="relative w-full h-40 sm:h-52 flex justify-center items-center scale-90 sm:scale-100 mb-8">
                 <div className="absolute inset-0 flex justify-center items-center">
                    <div className="w-2 h-24 bg-[#8d6e63] rounded-full opacity-20" />
                 </div>
                 
                 <div className="relative w-full max-w-md h-2 bg-[#5d4037] rounded-full flex justify-between items-center px-2">
                    <div className="relative flex flex-col items-center">
                       <motion.div 
                         animate={{ scale: activeHighlight === 'left' || activeHighlight === 'both' ? 1.1 : 1 }}
                         className={`w-20 h-20 sm:w-28 sm:h-28 bg-[#e6dccb] rounded-full border-4 flex items-center justify-center shadow-xl transition-all
                           ${activeHighlight === 'left' || activeHighlight === 'both' ? 'border-blue-500 ring-8 ring-blue-500/20 shadow-blue-500/40' : 'border-[#8d6e63]'}`}
                       >
                          <div className="flex flex-wrap justify-center gap-1 p-2">
                            {[...Array(appleCount)].map((_, i) => <span key={i} className="text-lg">🍎</span>)}
                          </div>
                       </motion.div>
                       <div className="mt-2 font-black text-sm text-[#5d4037]">{appleCount} Apples</div>
                    </div>

                    <Equal className={`w-8 h-8 transition-opacity ${activeHighlight === 'both' ? 'opacity-100 text-emerald-600 scale-125' : 'opacity-20'}`} />

                    <div className="relative flex flex-col items-center">
                       <motion.div 
                         animate={{ scale: activeHighlight === 'right' || activeHighlight === 'both' ? 1.1 : 1 }}
                         className={`w-20 h-20 sm:w-28 sm:h-28 bg-[#e6dccb] rounded-full border-4 flex items-center justify-center shadow-xl transition-all
                           ${activeHighlight === 'right' || activeHighlight === 'both' ? 'border-blue-500 ring-8 ring-blue-500/20 shadow-blue-500/40' : 'border-[#8d6e63]'}`}
                       >
                          <span className="font-black text-xl sm:text-3xl">{targetTotalWeight}g</span>
                       </motion.div>
                       <div className="mt-2 font-black text-sm text-[#5d4037]">Total Weight</div>
                    </div>
                 </div>
              </div>

              {/* FORMULA & NARRATION SECTION */}
              <div className="w-full space-y-4">
                {/* Visual Formula Display - Content is now populated from the start */}
                <div className="w-full bg-gradient-to-br from-[#5d4037] to-[#3e2723] p-6 rounded-3xl border-4 border-[#8d6e63] shadow-2xl text-center">
                  <div className="space-y-3 min-h-[140px] flex flex-col justify-center">
                    {formulas.map((line, idx) => (
                      <motion.p
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`text-lg sm:text-2xl font-black tracking-tight font-mono drop-shadow-md leading-tight 
                          ${(activeHighlight === 'both' && idx === 0) || 
                            (activeHighlight === 'left' && idx === 1) || 
                            (activeHighlight === 'right' && idx === 2) ||
                            (activeHighlight === 'both' && idx === 3)
                            ? 'text-yellow-400 scale-110' : 'text-yellow-100/60'}`}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>

                {/* Descriptive Text Block */}
                <div className="w-full bg-white/60 p-4 sm:p-6 rounded-3xl border-2 border-[#8d6e63]/20 shadow-inner text-center min-h-[100px] flex items-center justify-center">
                   <AnimatePresence mode="wait">
                     <motion.p 
                       key={explanationText}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="text-base sm:text-xl font-bold text-[#5d4037] leading-tight"
                     >
                       {explanationText}
                     </motion.p>
                   </AnimatePresence>
                </div>
              </div>

              <div className="mt-6">
                 <button 
                   onClick={() => { setIsExplaining(false); window.speechSynthesis.cancel(); }}
                   className="px-10 py-3 bg-[#8d6e63] text-white font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-black/20"
                 >
                   I Got It!
                 </button>
              </div>
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