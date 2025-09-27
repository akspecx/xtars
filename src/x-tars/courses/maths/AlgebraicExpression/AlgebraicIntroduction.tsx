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

type SubmissionResult = 'correct' | 'incorrect' | null;

const translations = {
  en: {
    scaleTitle: "⚖️ Algebraic Balance Scale ⚖️",
    perfectlyBalanced: "🎉 The scale is perfectly balanced! 🎉",
    notBalanced: "🚧 The scale is not balanced. 🚧",
    keepBalanced: "Keep both sides equal to maintain balance!",
    addLeft: "+ Add {N} to Left",
    subtractLeft: "- Subtract {N} from Left",
    addRight: "+ Add {N} to Right",
    subtractRight: "- Subtract {N} from Right",
    multiplyLeft: "x Multiply Left by {N}",
    divideLeft: "/ Divide Left by {N}",
    multiplyRight: "x Multiply Right by {N}",
    divideRight: "/ Divide Right by {N}",
    reset: "🔄 Reset",
    tryAnother: "🎲 Try Another Expression",
    submit: "✅ Submit",
    valueN: "Value for N:",
    intro: "Welcome user, today we are going to learn algebraic expressions. Before we get into depth, assume this as a balance scale you would have seen in your daily life.",
    balancedExplanation: "When both sides have the same value, the scale is balanced. This shows both sides are equal. For example, if both sides have a value of 5, the scale is balanced.",
    unbalancedExplanation: "If one side has a larger weight and the other has less, the scale is not balanced. You can see the tilt.",
    objective: "Our objective here is to keep the scale balanced by making both sides equal.",
    selectLanguage: "Select Language",
    changeTheme: "Change Theme",
    leftScale: "This is the left side of the balance scale, also known as the Left Hand Side, or LHS, representing the left side of your equation.",
    rightScale: "And this is the right side of the balance scale, also known as the Right Hand Side, or RHS, representing the right side of your equation.",
    startLesson: "Start Lesson",
    tryToBalance: "Now try to keep the scale balanced by using the operations below. Good luck!",
    submissionCorrect: "Correctly balanced! Excellent work!",
    submissionIncorrect: "Not balanced yet. Keep trying!"
  },
  hi: {
    scaleTitle: "⚖️ बीजीय संतुलन पैमाना ⚖️",
    perfectlyBalanced: "🎉 पैमाना पूरी तरह से संतुलित है! 🎉",
    notBalanced: "🚧 पैमाना संतुलित नहीं है। 🚧",
    keepBalanced: "संतुलन बनाए रखने के लिए दोनों पक्षों को बराबर रखें!",
    addLeft: "+ बाएं में {N} जोड़ें",
    subtractLeft: "- बाएं से {N} घटाएं",
    addRight: "+ दाएं में {N} जोड़ें",
    subtractRight: "- दाएं से {N} घटाएं",
    multiplyLeft: "x बाएं को {N} से गुणा करें",
    divideLeft: "/ बाएं को {N} से विभाजित करें",
    multiplyRight: "x दाएं को {N} से गुणा करें",
    divideRight: "/ दाएं को {N} से विभाजित करें",
    reset: "🔄 रीसेट करें",
    tryAnother: "🎲 दूसरा व्यंजक आज़माएँ",
    submit: "✅ जमा करें",
    valueN: "N का मान:",
    intro: "उपयोगकर्ता का स्वागत है, आज हम बीजीय व्यंजकों के बारे में जानेंगे। गहराई में जाने से पहले, इसे एक संतुलन पैमाने के रूप में मानें जो आपने अपने दैनिक जीवन में देखा होगा।",
    balancedExplanation: "जब दोनों पक्षों का मान समान होता है, तो पैमाना संतुलित होता है। यह दर्शाता है कि दोनों पक्ष बराबर हैं। उदाहरण के लिए, यदि दोनों पक्षों का मान 5 है, तो तो पैमाना संतुलित है।",
    unbalancedExplanation: "यदि एक तरफ अधिक वजन है और दूसरी तरफ कम, तो पैमाना असंतुलित है। आप झुकाव देख सकते हैं।",
    objective: "हमारा उद्देश्य यहां पैमाने को संतुलित रखना है, दोनों पक्षों को बराबर करके।",
    selectLanguage: "भाषा चुनें",
    changeTheme: "थीम बदलें",
    leftScale: "यह संतुलन पैमाने का बायां हिस्सा है, जिसे बायां पक्ष, या LHS भी कहा जाता है, जो आपके समीकरण के बाएं हिस्से को दर्शाता है।",
    rightScale: "और यह संतुलन पैमाने का दाहिना हिस्सा है, जिसे दायां पक्ष, या RHS भी कहा जाता है, जो आपके समीकरण के दाहिने हिस्से को दर्शाता है।",
    startLesson: "पाठ शुरू करें",
    tryToBalance: "अब नीचे दिए गए ऑपरेशनों का उपयोग करके पैमाने को संतुलित रखने का प्रयास करें। शुभकामनाएँ!",
    submissionCorrect: "सही ढंग से संतुलित! उत्कृष्ट कार्य!",
    submissionIncorrect: "अभी संतुलित नहीं है। कोशिश करते रहें!"
  }
};

const BalanceScale: React.FC<BalanceScaleProps> = ({
  initialLeft,
  initialRight,
  currentLanguage,
  theme,
  speakMessage,
  hasUserInteracted,
  audioContext
}) => {
  const [leftSide, setLeftSide] = useState<number>(initialLeft);
  const [rightSide, setRightSide] = useState<number>(initialRight);
  const [operationValueN, setOperationValueN] = useState<number>(2);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>(null);
  const isBalanced = leftSide === rightSide;

  const [highlightLeft, setHighlightLeft] = useState(false);
  const [highlightRight, setHighlightRight] = useState(false);

  // Ref to prevent the initial sequence from playing multiple times
  const isPlayingSequenceRef = useRef(false);

  const t = (key: keyof typeof translations['en'], params?: { N?: number }) => {
    let text = translations[currentLanguage][key];
    if (params?.N !== undefined) {
      text = text.replace('{N}', params.N.toString());
    }
    return text;
  };

  const generateRandomExpression = useCallback(() => {
    let newLeft, newRight;
    do {
      newLeft = Math.floor(Math.random() * 10) + 1;
      newRight = Math.floor(Math.random() * 10) + 1;
    } while (newLeft === newRight); // Ensure initial state is unbalanced for the exercise

    setLeftSide(newLeft);
    setRightSide(newRight);
    setSubmissionResult(null);
  }, []);

  useEffect(() => {
    const speakInitialSequence = async () => {
      // Only run if user has interacted and the sequence is not already playing
      if (hasUserInteracted && !isPlayingSequenceRef.current) {
        isPlayingSequenceRef.current = true;
        console.log('Starting initial lesson sequence...');

        await speakMessage('intro');
        await new Promise(resolve => setTimeout(resolve, 500)); // Short pause after intro

        // First, show balanced state and explain
        setLeftSide(5);
        setRightSide(5);
        await new Promise(resolve => setTimeout(resolve, 500)); // Wait for scale animation to complete
        await speakMessage('balancedExplanation');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for explanation to finish

        // Highlight both sides
        setHighlightLeft(true);
        setHighlightRight(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightLeft(false);
        setHighlightRight(false);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Explain Left Scale
        await speakMessage('leftScale');
        setHighlightLeft(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightLeft(false);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Explain Right Scale
        await speakMessage('rightScale');
        setHighlightRight(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setHighlightRight(false);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Add a short pause here before transitioning to the unbalanced state explanation
        // This provides a clearer separation between concepts.
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Now show unbalanced state and explain - added strategic delay here as per user request
        await new Promise(resolve => setTimeout(resolve, 3000)); // Strategic delay before showing unbalanced state
        setLeftSide(7); // Set to an unbalanced state
        setRightSide(5);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for tilt animation to complete
        await speakMessage('unbalancedExplanation');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await speakMessage('objective');
        await new Promise(resolve => setTimeout(resolve, 1200));

        await speakMessage('tryToBalance');
        await new Promise(resolve => setTimeout(resolve, 500));

        generateRandomExpression(); // Generate a random expression for the user to solve
        isPlayingSequenceRef.current = false; // Reset ref after sequence completion
      }
    };

    // Reset the playing flag if user interaction state is reset (e.g., language change)
    if (!hasUserInteracted) {
      isPlayingSequenceRef.current = false;
    }

    speakInitialSequence();
  }, [hasUserInteracted, speakMessage, generateRandomExpression]); // Simplified dependencies

  const handleSubmit = () => {
    if (leftSide === rightSide) {
      setSubmissionResult('correct');
      speakMessage('submissionCorrect');
    } else {
      setSubmissionResult('incorrect');
      speakMessage('submissionIncorrect');
    }
  };

  // Responsive Tailwind classes
  const containerClasses = `flex flex-col items-center p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto my-4 sm:my-8 border-4 transition-colors duration-300
    ${theme === 'light'
      ? 'bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200'
      : 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
    }`;

  const titleClasses = `text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6 md:mb-8 tracking-tight transition-colors duration-300 text-center
    ${theme === 'light' ? 'text-gray-900' : 'text-white'}`;

  const panBgClasses = (isLeft: boolean) => `relative flex flex-col items-center justify-center w-24 h-8 sm:w-32 sm:h-10 md:w-40 md:h-10 rounded-lg border-2 sm:border-3 md:border-4 transition-all duration-700 ease-in-out shadow-lg
    ${theme === 'light'
      ? (isBalanced
          ? (isLeft ? 'border-blue-400 bg-blue-200' : 'border-green-400 bg-green-200')
          : (isLeft && leftSide < rightSide || !isLeft && rightSide < leftSide ? 'border-red-500 bg-red-300' : (isLeft ? 'border-blue-400 bg-blue-200' : 'border-green-400 bg-green-200')))
      : (isBalanced
          ? (isLeft ? 'border-blue-500 bg-blue-700' : 'border-green-500 bg-green-700')
          : (isLeft && leftSide < rightSide || !isLeft && rightSide < leftSide ? 'border-red-600 bg-red-700' : (isLeft ? 'border-blue-500 bg-blue-700' : 'border-green-500 bg-green-700')))
    }
    ${isLeft && highlightLeft ? 'ring-2 sm:ring-3 md:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}
    ${!isLeft && highlightRight ? 'ring-2 sm:ring-3 md:ring-4 ring-yellow-400 ring-opacity-75 animate-pulse' : ''}
    `;

  const panTextClasses = (isLeft: boolean) => `text-lg sm:text-2xl md:text-3xl font-bold transition-colors duration-300 z-10
    ${theme === 'light'
      ? (isLeft ? 'text-blue-800' : 'text-green-800')
      : (isLeft ? 'text-blue-100' : 'text-green-100')
    }`;

  const buttonClasses = `px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm md:text-base font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75
    ${theme === 'light'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
      : 'bg-indigo-700 text-white hover:bg-indigo-600 focus:ring-indigo-400'
    }
    relative
    `;

  const operatorSpanClasses = `absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 text-lg sm:text-xl md:text-2xl font-bold
    ${theme === 'light' ? 'text-white' : 'text-white'}
  `;

  const textContentSpanClasses = `ml-4 sm:ml-5 md:ml-6`;

  const resetButtonClasses = `px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
    ${theme === 'light'
      ? 'bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-400'
      : 'bg-gray-200 text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
    }`;

  const tryAnotherButtonClasses = `px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
    ${theme === 'light'
      ? 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-400'
      : 'bg-yellow-700 text-white hover:bg-yellow-600 focus:ring-yellow-500'
    }`;

  const submitButtonClasses = `px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-75 text-sm sm:text-lg md:text-xl
    ${theme === 'light'
      ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-400'
      : 'bg-green-700 text-white hover:bg-green-600 focus:ring-green-500'
    }`;

  const messageClasses = `text-xl sm:text-2xl md:text-3xl font-extrabold animate-pulse transition-colors duration-300 text-center
    ${theme === 'light' ? 'text-gray-800' : 'text-white'}`;

  const subMessageClasses = `text-sm sm:text-base md:text-lg mt-2 transition-colors duration-300 text-center
    ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;

  const lhsRhsLabelClasses = `text-sm sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-5 transition-colors duration-300
    ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}
  `;

  const submissionFeedbackClasses = `mt-4 text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300 text-center
    ${submissionResult === 'correct' ? 'text-green-500' : (submissionResult === 'incorrect' ? 'text-red-500' : 'hidden')}
  `;

  const renderButtonContent = (labelKey: keyof typeof translations['en'], N: number) => {
    const fullText = t(labelKey, { N });
    const operatorMatch = fullText.match(/^(\+|-|x|\/)\s*(.*)/);
    if (operatorMatch) {
      const operator = operatorMatch[1];
      const textContent = operatorMatch[2];
      return (
        <>
          <span className={operatorSpanClasses}>{operator}</span>
          <span className={textContentSpanClasses}>{textContent}</span>
        </>
      );
    }
    return fullText;
  };

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>
        {t('scaleTitle')}
      </h2>

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg h-32 sm:h-40 md:h-48 flex items-end justify-center mb-4 sm:mb-6 md:mb-8">
        {/* The fulcrum */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-t-full rounded-b-lg transform skew-x-[-15deg] origin-bottom-left`}
             style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)', backgroundColor: theme === 'light' ? '#8B80C3' : '#4A4080' }}>
          <div className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-blue-300 dark:bg-blue-400 border-2 border-blue-500 dark:border-blue-700"></div>
        </div>

        {/* The beam */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-full h-2 sm:h-3 md:h-4 rounded-full transition-transform duration-700 ease-in-out
                      ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'}
                      ${isBalanced ? 'transform rotate-0' : ''}
                      ${!isBalanced && leftSide < rightSide ? 'transform rotate-6' : ''}
                      ${!isBalanced && leftSide > rightSide ? 'transform -rotate-6' : ''}
          `}
          style={{ transformOrigin: 'center center', backgroundColor: theme === 'light' ? '#6B8E9A' : '#3A5E6A' }}
        >
          <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} border-2 ${theme === 'light' ? 'border-gray-500' : 'border-gray-400'}`}></div>
          <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full ${theme === 'light' ? 'bg-blue-300' : 'bg-blue-600'} border-2 ${theme === 'light' ? 'border-gray-500' : 'border-gray-400'}`}></div>
        </div>

        {/* The pans */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between px-2 sm:px-3 md:px-4">
          <div className="flex flex-col items-center">
            <div
              className={`${panBgClasses(true)}
                          ${isBalanced ? 'translate-y-0' : (leftSide < rightSide ? '-translate-y-4 sm:-translate-y-6 md:-translate-y-8' : 'translate-y-4 sm:translate-y-6 md:translate-y-8')}
              `}
              style={{ marginLeft: '-1.5rem', marginBottom: '0.5rem', backgroundColor: theme === 'light' ? '#A2D9CE' : '#5C8D89' }}
            >
              <span className={panTextClasses(true)}>{leftSide}</span>
              <div className={`absolute bottom-0 left-0 right-0 h-1 sm:h-1.5 md:h-2 rounded-b-lg ${theme === 'light' ? 'bg-gray-400' : 'bg-gray-700'}`}></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`${panBgClasses(false)}
                          ${isBalanced ? 'translate-y-0' : (rightSide < leftSide ? '-translate-y-4 sm:-translate-y-6 md:-translate-y-8' : 'translate-y-4 sm:translate-y-6 md:translate-y-8')}
              `}
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
          <span className={lhsRhsLabelClasses}>LHS</span>
        </div>
        <div className="text-center">
          <span className={lhsRhsLabelClasses}>RHS</span>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 md:mt-12 text-center">
        {/* Only show status messages when user submits, not automatically */}
        {submissionResult && (
          <>
            <p className={messageClasses}>
              {submissionResult === 'correct' ? t('perfectlyBalanced') : t('notBalanced')}
            </p>
            <p className={subMessageClasses}>
              {t('keepBalanced')}
            </p>
          </>
        )}
      </div>

      <p className={submissionFeedbackClasses}>
        {submissionResult === 'correct' ? t('submissionCorrect') : (submissionResult === 'incorrect' ? t('submissionIncorrect') : '')}
      </p>

      <div className={`mt-4 sm:mt-6 md:mt-8 flex items-center gap-2 p-2 sm:p-3 rounded-lg shadow-inner
        ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'}`}>
        <label htmlFor="operation-n-value" className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} font-medium text-sm sm:text-base`}>
          {t('valueN')}
        </label>
        <input
          id="operation-n-value"
          type="number"
          value={operationValueN}
          onChange={(e) => setOperationValueN(Number(e.target.value))}
          className={`w-16 sm:w-20 p-1 sm:p-2 border rounded-md text-center text-sm sm:text-base
            ${theme === 'light' ? 'bg-white border-gray-300 text-gray-900' : 'bg-gray-800 border-gray-600 text-white'}
          `}
          min="1"
        />
      </div>

      <div className="mt-6 sm:mt-8 md:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full max-w-4xl">
        <button
          onClick={() => setLeftSide(leftSide + operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('addLeft', operationValueN)}
        </button>
        <button
          onClick={() => setLeftSide(leftSide - operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('subtractLeft', operationValueN)}
        </button>

        <button
          onClick={() => setRightSide(rightSide + operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('addRight', operationValueN)}
        </button>
        <button
          onClick={() => setRightSide(rightSide - operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('subtractRight', operationValueN)}
        </button>

        <button
          onClick={() => setLeftSide(leftSide * operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('multiplyLeft', operationValueN)}
        </button>
        <button
          onClick={() => { if (operationValueN !== 0) setLeftSide(leftSide / operationValueN); }}
          className={buttonClasses}
        >
          {renderButtonContent('divideLeft', operationValueN)}
        </button>

        <button
          onClick={() => setRightSide(rightSide * operationValueN)}
          className={buttonClasses}
        >
          {renderButtonContent('multiplyRight', operationValueN)}
        </button>
        <button
          onClick={() => { if (operationValueN !== 0) setRightSide(rightSide / operationValueN); }}
          className={buttonClasses}
        >
          {renderButtonContent('divideRight', operationValueN)}
        </button>
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={handleSubmit}
          className={submitButtonClasses}
        >
          {t('submit')}
        </button>
        <button
          onClick={() => {
            setLeftSide(initialLeft);
            setRightSide(initialRight);
            setSubmissionResult(null);
            // Reset sequence flag on manual reset
            isPlayingSequenceRef.current = false;
          }}
          className={resetButtonClasses}
        >
          {t('reset')}
        </button>

        <button
          onClick={() => {
            generateRandomExpression();
            setSubmissionResult(null); // Clear any previous submission results
          }}
          className={tryAnotherButtonClasses}
        >
          {t('tryAnother')}
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

    // fetchTTS will now return null if using Web Speech API, and its promise will resolve when speech is done.
    const audioContent = await fetchTTS(textToSpeak, currentLanguage);

    if (audioContent) {
      try {
        await playAudio(audioContent.audioData, audioContent.mimeType, audioContext);
      } catch (error) {
        console.warn(`[Speech] Failed to play audio for "${key}":`, error);
        // The sequence will continue even if audio failed to play, but with a warning.
      }
    } else {
      // If fetchTTS returned null (e.g., using Web Speech API as mock), it means the speech has already occurred.
      console.log(`[Speech] No audio content from fetchTTS for "${key}". Assuming Web Speech API handled it.`);
    }
  }, [currentLanguage, audioContext]); // Recreate speakMessage if language or audioContext changes

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
      // Even if AudioContext fails, allow the lesson to start
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
          initialLeft={5}
          initialRight={5}
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