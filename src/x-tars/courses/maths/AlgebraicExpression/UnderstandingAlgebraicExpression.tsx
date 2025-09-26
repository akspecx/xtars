import React, { useState, useEffect, useRef, useCallback } from 'react';

// Helper to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper to convert PCM data to WAV Blob
const pcmToWav = (pcm16: Int16Array, sampleRate: number) => {
  const dataView = new DataView(new ArrayBuffer(44 + pcm16.byteLength));
  let offset = 0;

  function writeString(str: string) {
    for (let i = 0; i < str.length; i++) {
      dataView.setUint8(offset + i, str.charCodeAt(i));
    }
    offset += str.length;
  }

  function writeUint32(val: number) {
    dataView.setUint32(offset, val, true);
    offset += 4;
  }

  function writeUint16(val: number) {
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
const playAudio = (audioData: string, mimeType: string, audioContext: AudioContext | null): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    let audio: HTMLAudioElement | null = null;
    let audioUrl: string | null = null;

    try {
      console.log('Attempting to play audio with mimeType:', mimeType);

      const currentAudioContext = audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();

      // Ensure AudioContext is resumed before playing
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

      // Helper to clean up resources
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
        console.log('Audio playback ended');
        cleanup();
        resolve(); // Resolve the promise when audio ends
      };

      // Attempt to play
      await audio.play();
      console.log('Audio playing successfully');

    } catch (playError) {
      console.error("Audio play failed, likely autoplay blocked or other issue:", playError);
      // Display custom message box instead of alert()
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
      if (audioUrl) URL.revokeObjectURL(audioUrl); // Clean up any created URL
      reject(new Error("Audio play failed, user interaction needed or browser blocked autoplay")); // Reject the promise
    }
  });
};

// Mock TTS function (using Web Speech API as fallback)
const fetchTTS = async (text: string, langCode: string): Promise<{ audioData: string; mimeType: string } | null> => {
  console.log(`Mock TTS called for: "${text}" in language: ${langCode}`);

  if ('speechSynthesis' in window) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.8;

      utterance.onstart = () => {
        console.log('Web Speech API synthesis started');
      };

      utterance.onend = () => {
        console.log('Web Speech API synthesis ended');
        resolve(null); // Signal completion, but no audio data to return for this mock
      };

      utterance.onerror = (event) => {
        console.error('Web Speech API synthesis error:', event);
        resolve(null);
      };

      speechSynthesis.speak(utterance);
      // IMPORTANT: The promise resolves when onend or onerror is called, ensuring we await speech completion.
    });
  }
  // If no Web Speech API, return null immediately.
  return null;
};

// BalanceScale.tsx Component
type BalanceScaleProps = {
  initialLeft: number;
  initialRight: number;
  currentLanguage: 'en' | 'hi';
  theme: 'light' | 'dark';
  speakMessage: (key: string) => Promise<void>;
  hasUserInteracted: boolean;
  audioContext: AudioContext | null;
};

type LessonPhase = 'algebraicExpressionIntro'; // Only one phase now

const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    startLesson: "Start Lesson",
    reset: "🔄 Reset",
    algebraicExpressionIntro: "Welcome! Today we'll learn about algebraic expressions. On the left hand side, we have three apples. This should be equal to the value on the right hand side.",
    balanceExplanation: "As we learnt earlier, in a balanced equation, the left hand side should be equal to the right hand side.",
    algebraicExpressionEquation: "Cost of 3 Apples = 6 Rupees",
    weightEquation: "Weight of 3 Apples = 6 Grams",
    finalExplanation: "You can assume anything, but at the end - the left hand side should be equal to the right hand side."
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    startLesson: "पाठ शुरू करें",
    reset: "🔄 रीसेट करें",
    algebraicExpressionIntro: "स्वागत है! आज हम बीजीय व्यंजकों के बारे में जानेंगे। बाईं ओर, हमारे पास तीन सेब हैं। यह दाहिने हाथ के पैमाने पर दिए गए मान के बराबर होना चाहिए।",
    balanceExplanation: "जैसा कि हमने पहले सीखा था, संतुलित समीकरण में, बाईं ओर दाईं ओर के बराबर होनी चाहिए।",
    algebraicExpressionEquation: "3 सेब की लागत = 6 रुपये",
    weightEquation: "3 सेब का वजन = 6 ग्राम",
    finalExplanation: "आप कुछ भी मान सकते हैं, लेकिन अंत में - बाईं ओर दाईं ओर के बराबर होनी चाहिए।"
  }
};

const BalanceScale: React.FC<BalanceScaleProps> = ({
  initialLeft, // Will be 3 for apples
  initialRight, // Will be 6 for value
  currentLanguage,
  theme,
  speakMessage,
  hasUserInteracted,
  audioContext
}) => {
  const [leftSide, setLeftSide] = useState<number>(initialLeft);
  const [rightSide, setRightSide] = useState<number>(initialRight);
  const [showAlgebraicExpressionText, setShowAlgebraicExpressionText] = useState(false); // Controls display of equations

  // isBalanced will always be true since initialLeft and initialRight are fixed
  const isBalanced = true;

  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);

  // Ref to prevent the sequence from playing multiple times initially
  const isPlayingSequenceRef = useRef(false);

  const t = (key: keyof typeof translations['en'], params?: { N?: number }) => {
    let text = translations[currentLanguage][key];
    if (params?.N !== undefined) {
      text = text.replace('{N}', params.N.toString());
    }
    return text;
  };

  useEffect(() => {
    const speakAlgebraicExpressionLesson = async () => {
      // Only run if user has interacted and the sequence is not already playing
      if (hasUserInteracted && !isPlayingSequenceRef.current) {
        isPlayingSequenceRef.current = true;
        setShowAlgebraicExpressionText(false); // Hide expression text initially
        setLeftSide(initialLeft); // Ensure initial values are set from props
        setRightSide(initialRight);

        console.log('Starting algebraic expression lesson...');

        // Give a moment for the scale to visually update to the initial props
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Speak intro to algebraic expression
        await speakMessage('algebraicExpressionIntro');
        setHighlightLeft(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightLeft(false);
        setHighlightRight(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightRight(false);

        // Explain balance concept
        await speakMessage('balanceExplanation');
        await new Promise(resolve => setTimeout(resolve, 2000));

        setShowAlgebraicExpressionText(true); // Display the equations
        
        // Speak the cost equation
        await speakMessage('algebraicExpressionEquation');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Speak the weight equation
        await speakMessage('weightEquation');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Final explanation
        await speakMessage('finalExplanation');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // The lesson concludes here.
        isPlayingSequenceRef.current = false;
      }
    };

    // Reset the playing flag if user interaction state is reset (e.g., language change)
    if (!hasUserInteracted) {
      isPlayingSequenceRef.current = false;
      setShowAlgebraicExpressionText(false);
    }

    speakAlgebraicExpressionLesson();
  }, [hasUserInteracted, speakMessage, currentLanguage, initialLeft, initialRight]);

  // Responsive Tailwind classes
  const containerClasses = `flex flex-col items-center p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 border-4 transition-colors duration-300
    ${theme === 'light'
      ? 'bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200'
      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
    }`;

  const titleClasses = `text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight transition-colors duration-300 text-center
    ${theme === 'light' ? 'text-gray-900' : 'text-white'}`;

  // Pan background classes modified to always reflect a balanced state
  const panBgClasses = (isLeft: boolean) => `relative flex flex-col items-center justify-center w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-10 rounded-lg border-2 sm:border-3 md:border-4 transition-all duration-700 ease-in-out shadow-lg
    ${theme === 'light'
      ? (isLeft ? 'border-blue-400 bg-blue-200' : 'border-green-400 bg-green-200') // Always balanced color
      : (isLeft ? 'border-blue-500 bg-blue-700' : 'border-green-500 bg-green-700') // Always balanced color
    }
    ${isLeft && highlightLeft ? 'ring-2 sm:ring-3 md:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}
    ${!isLeft && highlightRight ? 'ring-2 sm:ring-3 md:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}
    `;

  const panTextClasses = (isLeft: boolean) => `text-lg sm:text-2xl md:text-3xl font-bold transition-colors duration-300 z-10
    ${theme === 'light'
      ? (isLeft ? 'text-blue-800' : 'text-green-800')
      : (isLeft ? 'text-blue-100' : 'text-green-100')
    }`;

  const resetButtonClasses = `px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
    ${theme === 'light'
      ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-400'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
    }`;

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>
        {t('scaleTitle')}
      </h2>

      {/* Main container for the scale elements (fulcrum, beam, pans) */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-32 sm:h-40 md:h-48 flex items-end justify-center mb-4 sm:mb-6 md:mb-8 pb-4 sm:pb-6 md:pb-8">
        {/* The fulcrum */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-t-full rounded-b-lg transform skew-x-[-15deg] origin-bottom-left`}
             style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)', backgroundColor: theme === 'light' ? '#8B80C3' : '#4A4080' }}>
          <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-blue-300 dark:bg-blue-400 border-2 border-blue-500 dark:border-blue-700"></div>
        </div>

        {/* The beam - always balanced */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-full h-2 sm:h-3 md:h-4 rounded-full transition-transform duration-700 ease-in-out transform rotate-0
                      ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'}
          `}
          style={{ transformOrigin: 'center center', backgroundColor: theme === 'light' ? '#6B8E9A' : '#3A5E6A' }}
        >
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} border-2 ${theme === 'light' ? 'border-gray-500' : 'border-gray-400'}`}></div>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} border-2 ${theme === 'light' ? 'border-gray-500' : 'border-gray-400'}`}></div>
        </div>

        {/* The pans - always visually at the same level (no vertical translation based on balance) */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 sm:px-3 md:px-4">
          <div className="flex flex-col items-center">
            <div
              className={`${panBgClasses(true)} translate-y-0`} // No vertical translation
              style={{ marginLeft: '-1.5rem', marginBottom: '0.5rem', backgroundColor: theme === 'light' ? '#A2D9CE' : '#5C8D89' }}
            >
              {/* Conditional rendering for apples */}
              <span className={panTextClasses(true)}>
                {'🍎🍎🍎'} {/* Always show apples for this lesson */}
              </span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2 rounded-b-lg ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-700'}`}></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`${panBgClasses(false)} translate-y-0`} // No vertical translation
              style={{ marginRight: '-1.5rem', marginBottom: '0.5rem', backgroundColor: theme === 'light' ? '#A2D9CE' : '#5C8D89' }}
            >
              <span className={panTextClasses(false)}>{rightSide}</span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2 rounded-b-lg ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-700'}`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* LHS and RHS labels positioned below the scale with margin */}
      <div className="flex justify-between w-full max-w-sm sm:max-w-md md:max-w-lg px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8">
        <div className="text-center">
          <span className={`text-sm sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-5 transition-colors duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>LHS</span>
        </div>
        <div className="text-center">
          <span className={`text-sm sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-5 transition-colors duration-300 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>RHS</span>
        </div>
      </div>

      {/* Display algebraic expressions during teaching phase */}
      {showAlgebraicExpressionText && (
        <div className={`mt-8 p-6 rounded-lg shadow-xl text-center space-y-4
          ${theme === 'light' ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' : 'bg-indigo-900 text-indigo-100 border border-indigo-700'}`}>
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold animate-pulse">
            {t('algebraicExpressionEquation')}
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold animate-pulse">
            {t('weightEquation')}
          </p>
          <div className={`mt-6 p-4 rounded-md text-lg sm:text-xl font-semibold
            ${theme === 'light' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-yellow-900 text-yellow-100 border border-yellow-700'}`}>
            {t('finalExplanation')}
          </div>
        </div>
      )}

      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={() => {
            // Reset to initial values and allow sequence to replay
            setLeftSide(initialLeft);
            setRightSide(initialRight);
            isPlayingSequenceRef.current = false;
          }}
          className={resetButtonClasses}
        >
          {t('reset')}
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const speakMessage = useCallback(async (key: keyof typeof translations['en']) => {
    console.log(`Speaking message: ${key}`);
    const textToSpeak = translations[currentLanguage][key];

    const audioContent = await fetchTTS(textToSpeak, currentLanguage);

    if (audioContent) {
      try {
        await playAudio(audioContent.audioData, audioContent.mimeType, audioContext);
      } catch (error) {
        console.warn(`[Speech] Failed to play audio for "${key}":`, error);
      }
    } else {
      console.log(`[Speech] No audio content from fetchTTS for "${key}". Assuming Web Speech API handled it.`);
    }
  }, [currentLanguage, audioContext]);

  const themeClasses = theme === 'light' ? 'bg-gray-200' : 'bg-gray-900';

  const handleStartLesson = () => {
    console.log('Starting lesson - creating AudioContext');
    const newAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    newAudioContext.resume().then(() => {
      console.log('AudioContext resumed successfully');
      setAudioContext(newAudioContext);
      setHasUserInteracted(true);
    }).catch(error => {
      console.error("Failed to resume AudioContext:", error);
      setHasUserInteracted(true);
    });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans antialiased transition-colors duration-300 ${themeClasses}`}>
      <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-8 p-3 sm:p-4 rounded-lg shadow-md w-full max-w-md sm:max-w-none sm:w-auto
        ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <label htmlFor="language-select" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
            {translations[currentLanguage].selectLanguage}:
          </label>
          <select
            id="language-select"
            value={currentLanguage}
            onChange={(e) => {
              setCurrentLanguage(e.target.value as 'en' | 'hi');
              setHasUserInteracted(false); // Reset interaction to restart lesson with new language
              setAudioContext(null); // Clear audio context
            }}
            className={`p-1 sm:p-2 border rounded-md text-sm sm:text-base
              ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-700 border-gray-600 text-white'}
            `}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className={`p-2 rounded-md font-medium transition-colors duration-300 text-sm sm:text-base
            ${theme === 'light' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-gray-700 text-white hover:bg-gray-600'}
          `}
        >
          {translations[currentLanguage].changeTheme} ({theme === 'light' ? 'Dark' : 'Light'})
        </button>
      </div>

      {!hasUserInteracted && (
        <button
          onClick={handleStartLesson}
          className={`px-6 py-3 sm:px-8 sm:py-4 mb-4 sm:mb-8 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-105 active:scale-95 text-lg sm:text-xl
            ${theme === 'light' ? 'bg-blue-600' : 'bg-blue-800'}
          `}
        >
          {translations[currentLanguage].startLesson}
        </button>
      )}

      {hasUserInteracted && (
        <BalanceScale
          initialLeft={3} // Fixed for apple lesson
          initialRight={6} // Fixed for apple lesson
          currentLanguage={currentLanguage}
          theme={theme}
          speakMessage={speakMessage}
          hasUserInteracted={hasUserInteracted}
          audioContext={audioContext}
        />
      )}
    </div>
  );
};

export default App;