import React, { CSSProperties } from 'react';
import DavidImage from './Images/David.png'
import AkashImage from './Images/Akash.png'

// --- Language and Translation Definitions ---
type Language = 'en' | 'hi';

interface Translation {
  title: string;
  subtitle: string;
  explanation: React.ReactNode;
  facingCenter: string;
  playButton: string;
  loading: string;
  speaking: string;
  autoplayError: string;
  footer: string;
  // Updated key to reflect the new character name
  davidIsLeftOfAkash: string; 
  leftLabel: string;
}

const translations: Record<Language, Translation> = {
  en: {
    title: "Circular Arrangement: Left/Right Lesson",
    // Updated subtitle reference
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
          <span className="text-green-600 dark:text-green-400 font-extrabold">Akash</span> is sitting immediately to the <span className="underline">Left</span> of <span className="text-red-600 dark:text-red-400 font-extrabold">David</span>.
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
          *Important: The direction (Left or Right) always depends on the way the user is facing.*
        </p>
      </div>
    ),
    facingCenter: "Facing centre", 
    playButton: "Play Explanation",
    loading: "Generating Voice...",
    speaking: "Now Speaking...",
    autoplayError: "Autoplay failed. Please click 'Play Explanation' to start the audio lesson.",
    footer: "The avatars are customized image placeholders for clarity. Left is considered the clockwise direction when facing the center.",
    // Updated voice script
    davidIsLeftOfAkash: "Akash is sitting to the left of David. Remember, the direction, left or right, always depends on which way the user is facing.",
    leftLabel: "Left"
  },
  hi: {
    title: "गोलाकार व्यवस्था: बाएँ/दाएँ पाठ",
    // Updated subtitle reference (Toma -> David)
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
          <span className="text-green-600 dark:text-green-400 font-extrabold">आकाश</span>, <span className="text-red-600 dark:text-red-400 font-extrabold">डेविड</span> के ठीक <span className="underline">बाएँ</span> बैठा है।
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
          *ज़रूरी: दिशा (बाएँ या दाएँ) हमेशा व्यक्ति के मुख की ओर निर्भर करती है।*
        </p>
      </div>
    ),
    facingCenter: "केंद्र की ओर मुख", 
    playButton: "व्याख्या चलाएँ",
    loading: "आवाज़ उत्पन्न हो रही है...",
    speaking: "अब बोल रहा है...",
    autoplayError: "ऑटोप्ले विफल रहा। ऑडियो पाठ शुरू करने के लिए 'व्याख्या चलाएँ' पर क्लिक करें।",
    footer: "स्पष्टता के लिए अवतार अनुकूलित छवि प्लेसहोल्डर हैं। केंद्र की ओर मुख होने पर बायाँ दक्षिणावर्त दिशा माना जाता है।",
    // Updated voice script
    davidIsLeftOfAkash: "डेविड के बाएँ आकाश बैठा है। याद रखें, बायाँ या दायाँ दिशा हमेशा इस बात पर निर्भर करती है कि उपयोगकर्ता किस दिशा में देख रहा है।",
    leftLabel: "बाएँ"
  }
};

// --- Utility Functions for TTS ---
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
  const buffer = new ArrayBuffer(44 + pcm16.length * 2);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  let offset = 0;
  writeString(offset, 'RIFF'); offset += 4;
  view.setUint32(offset, 36 + pcm16.length * 2, true); offset += 4;
  writeString(offset, 'WAVE'); offset += 4;
  writeString(offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * 2, true); offset += 4;
  view.setUint16(offset, 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(offset, 'data'); offset += 4;
  view.setUint32(offset, pcm16.length * 2, true); offset += 4;

  for (let i = 0; i < pcm16.length; i++, offset += 2) {
    view.setInt16(offset, pcm16[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

interface Person {
  name: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  color: string; 
}

interface CircularArrangementProps {
  people: Person[];
  circleSize: number;
  explanationText: React.ReactNode;
  highlightedPerson: string | null;
  language: Language;
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  people,
  circleSize,
  explanationText,
  highlightedPerson,
  language
}) => {
  // Increased multiplier for larger avatar size (from 0.3 to 0.35)
  const personSize = Math.max(circleSize * 0.40, 60); 
  const radius = circleSize / 2;
  const offset = personSize / 2;
  const T = translations[language];
  
  const getPositionStyle = (position: Person['position']): CSSProperties => {
    switch (position) {
      case 'top': return { top: -offset, left: radius - offset };
      case 'right': return { top: radius - offset, right: -offset };
      case 'bottom': return { bottom: -offset, left: radius - offset };
      case 'left': return { top: radius - offset, left: -offset };
      default: return {};
    }
  };

  const renderPeople = () => {
    return people.map((person, index) => {
      // 1. Avatar Positioning Styles
      const personStyle: CSSProperties = {
        ...getPositionStyle(person.position),
        width: `${personSize}px`,
        height: `${personSize}px`,
      };
      
      let imageUrl = '';
      const size = Math.round(personSize);
      const text = person.name.substring(0, 4).toUpperCase(); 

      // Image source logic using placehold.co
      if (person.name === 'David') {
        imageUrl = DavidImage;
      } else if (person.name === 'Akash') {
        imageUrl = AkashImage;
      } else {
        imageUrl = `https://placehold.co/${size}x${size}/6b7280/ffffff?text=U`;
      }
      
      const isHighlighted = highlightedPerson === person.name;

      // 2. Name Label Positioning Logic (External and Closer)
      // Reduced distance from avatar edge (was 0.5, now 0.25)
      const nameDistance = personSize * 0.25; 
      // Base offset for name position outside the main circle container
      const externalOffset = offset * 2.5; 
      
      return (
        <div key={index}>
          {/* Avatar Div - Positioned at circumference */}
          <div
            className={`absolute rounded-full shadow-lg transition duration-300 transform hover:scale-105 overflow-hidden border-2 flex justify-center items-center
              ${isHighlighted ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : 'border-white'}
            `}
            style={personStyle}
            title={person.name}
          >
            <img
              src={imageUrl}
              alt={person.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = `https://placehold.co/${size}x${size}/6b7280/ffffff?text=X`;
              }}
            />
          </div>
          
          {/* Name Label - Positioned externally relative to the circle container */}
          <span 
            className="absolute text-gray-800 dark:text-gray-200 font-bold" 
            style={{ 
                zIndex: 20,
                fontSize: '1.1rem',
                color: person.name === 'David' ? '#dc2626' : '#10b981',

                // David (Bottom position)
                ...(person.position === 'bottom' && { 
                    bottom: -externalOffset+100, 
                    left: radius,
                    transform: `translateX(-50%) translateY(${nameDistance}px)` 
                }),
                // Akash (Left position)
                ...(person.position === 'left' && { 
                    top: radius, 
                    left: -externalOffset+80,
                    transform: `translateX(-${personSize + nameDistance - 150}px) translateY(-50%)` 
                }),
            }}
          >
              {person.name}
          </span>
        </div>
      );
    });
  };

  const renderDirectionArrow = () => {
    const david = people.find(p => p.name === 'David' && p.position === 'bottom');
    const akash = people.find(p => p.name === 'Akash' && p.position === 'left');

    if (!david || !akash) return null;

    const R_Circle = circleSize / 2;
    // Reduced ARROW_OFFSET (from 100 to 90)
    const ARROW_OFFSET = 90; 
    const arrowRadius = R_Circle + ARROW_OFFSET; 
    
    // David (6 PM = 270 degrees or PI/2 using CSS coordinates)
    const startAngle = Math.PI / 2; 
    const davidX = R_Circle + arrowRadius * Math.cos(startAngle);
    const davidY = R_Circle + arrowRadius * Math.sin(startAngle);
    
    // Akash (9 PM = 180 degrees or PI)
    const endAngle = Math.PI; 
    const akashX = R_Circle + arrowRadius * Math.cos(endAngle);
    const akashY = R_Circle + arrowRadius * Math.sin(endAngle);
    
    // Create clockwise arc path from David to Akash
    const arrowPath = `M ${davidX} ${davidY} A ${arrowRadius} ${arrowRadius} 0 0 1 ${akashX} ${akashY}`;
    
    // Position label near the midpoint (7:30 PM = 135 degrees)
    const midAngle = (startAngle + endAngle) / 2; 
    const labelRadius = arrowRadius - 10; // Pull label closer to the circle
    const labelX = R_Circle + labelRadius * Math.cos(midAngle);
    const labelY = R_Circle + labelRadius * Math.sin(midAngle);

    const viewBoxSize = circleSize + ARROW_OFFSET * 3;

    const offsetCalc = personSize / 2;
    
    const dashedCircleSize = 64;
    const mugSize = 48;
    
    const lineStrokeColor = '#3b82f6'; 

    return (
        <>
            <style>
                {`
                  /* Animations removed */
                  @keyframes rotate-center { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                  .rotate-center-disabled { animation: none; }
                `}
            </style>
            <svg 
                className="absolute text-black dark:text-white"
                style={{ 
                  top: -ARROW_OFFSET * 1.5,
                  left: -ARROW_OFFSET * 1.5,
                  width: viewBoxSize,
                  height: viewBoxSize,
                  zIndex: 5 
                }}
                viewBox={`${-ARROW_OFFSET * 1.5} ${-ARROW_OFFSET * 1.5} ${viewBoxSize} ${viewBoxSize}`}
                preserveAspectRatio="xMidYMid meet"
            >
                 <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                    </marker>
                    <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
                        <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
                    </marker>
                </defs>
                <path 
                    d={arrowPath} 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2.5" 
                    markerEnd="url(#arrowhead)"
                />
                <text
                    x={labelX}
                    y={labelY}
                    className="fill-yellow-600 dark:fill-yellow-400 font-extrabold"
                    style={{ fontSize: '18px', textShadow: '0 0 4px rgba(234,179,8,0.5)' }}
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {T.leftLabel}
                </text>
                
                {/* David's Facing Arrow (From bottom to center) */}
                <path
                    d={`M ${R_Circle} ${R_Circle + radius - offsetCalc + 5} L ${R_Circle} ${R_Circle + mugSize*0.5}`}
                    fill="none"
                    stroke={lineStrokeColor}
                    strokeWidth="2"
                    markerEnd="url(#facingArrowhead)"
                    strokeDasharray="4,3"
                /> 
                
                {/* Akash's Facing Arrow (From left to center) */}
                <path
                    d={`M ${R_Circle - radius + offsetCalc - 5} ${R_Circle} L ${R_Circle - mugSize*0.5} ${R_Circle}`}
                    fill="none"
                    stroke={lineStrokeColor}
                    strokeWidth="2"
                    markerEnd="url(#facingArrowhead)"
                    strokeDasharray="4,3"
                />
            </svg>
            
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
                {/* Dashed Circle (Animation removed) */}
                <div 
                    className="absolute border-4 border-dashed border-blue-400 dark:border-blue-500 rounded-full rotate-center-disabled opacity-50"
                    style={{
                        width: dashedCircleSize,
                        height: dashedCircleSize,
                        top: `calc(50% - ${dashedCircleSize/2}px)`,
                        left: `calc(50% - ${dashedCircleSize/2}px)`,
                    }}
                ></div>
                {/* Center Mug */}
                <div 
                    className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
                    style={{ width: mugSize, height: mugSize }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
            </div>
        </>
    );
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      {/* Increased fixed padding to accommodate larger avatars and external names */}
      <div style={{ padding: `${offset + 5 + 80}px` }}> 
          <div
            className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
            style={{ width: circleSize, height: circleSize }}
          >
            {renderDirectionArrow()}
            {renderPeople()}
          </div>
      </div>

      <div className="w-full sm:max-w-md bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md mt-4">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">{T.subtitle}</h3>
        <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
            {explanationText}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [highlightedPerson, setHighlightedPerson] = React.useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [circleSize, setCircleSize] = React.useState(400);
  const [playbackError, setPlaybackError] = React.useState<string | null>(null); 
  const [language, setLanguage] = React.useState<Language>('en'); 

  const T = translations[language];

  const synthesizeSpeech = async () => {
    if (isLoading || isSpeaking) return;
    setPlaybackError(null);

    const playAudio = (url: string) => {
      const audio = new Audio(url);
      
      audio.onended = () => {
        setIsSpeaking(false);
        setHighlightedPerson(null);
      };
      
      // Highlight sequence updated to use 'David' instead of 'Tom'
      setHighlightedPerson('Akash'); 
      setTimeout(() => { setHighlightedPerson('David'); }, 1500); 
      setTimeout(() => { setHighlightedPerson(null); }, 3000);

      setIsSpeaking(true);
      
      audio.play().catch(e => {
        if (e.name === 'NotAllowedError' || e.message.includes('interact with the document')) {
            setIsSpeaking(false);
            setHighlightedPerson(null);
            setPlaybackError(T.autoplayError);
        } else {
            console.error("Audio playback failed:", e);
        }
      });
    };

    if (audioUrl) {
      playAudio(audioUrl);
      return;
    }

    setIsLoading(true);
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const payload = {
        // Voice text uses the new key 'davidIsLeftOfAkash'
        contents: [{ parts: [{ text: T.davidIsLeftOfAkash }] }],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
        },
        model: "gemini-2.5-flash-preview-tts"
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });

        const result = await response.json();
        const part = result?.candidates?.[0]?.content?.parts?.[0];
        const audioData = part?.inlineData?.data;
        const mimeType = part?.inlineData?.mimeType;

        if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
            const rateMatch = mimeType.match(/rate=(\d+)/);
            const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
            
            const pcmData = base64ToArrayBuffer(audioData);
            const pcm16 = new Int16Array(pcmData);
            const wavBlob = pcmToWav(pcm16, sampleRate);
            const url = URL.createObjectURL(wavBlob);
            
            setAudioUrl(url);
            playAudio(url);
        } else {
            console.error("Failed to generate audio:", result);
        }
    } catch (error) {
        console.error("API call error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const autoPlay = () => { if (!audioUrl) synthesizeSpeech(); };
    const timer = setTimeout(autoPlay, 3000); 
    return () => clearTimeout(timer);
  }, [audioUrl, language]);

  React.useEffect(() => {
    if (isDarkMode) { document.documentElement.classList.add('dark'); } 
    else { document.documentElement.classList.remove('dark'); }

    const calculateSize = () => {
      const size = Math.min(window.innerWidth * 0.85, 400); 
      setCircleSize(size);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [isDarkMode]);

  React.useEffect(() => {
    // Regenerate audio when language changes
    setAudioUrl(null); 
    setPlaybackError(null);
  }, [language]);
  
  const leftRightExample: Person[] = [
    // Updated 'Tom' to 'David'
    { name: 'David', position: 'bottom', color: 'bg-red-500' }, 
    { name: 'Akash', position: 'left', color: 'bg-green-500' }, 
  ];
  
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-8">
          
          <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 space-y-4 sm:space-y-0">
              <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
                {T.title}
              </h1>
              <div className="flex space-x-4 items-center">
                  <select 
                      value={language} 
                      onChange={handleLanguageChange}
                      className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  >
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                  <button
                      onClick={toggleDarkMode}
                      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow-md hover:ring-2 ring-blue-500 dark:ring-blue-300 transition-all duration-300"
                  >
                      {isDarkMode ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                      )}
                  </button>
              </div>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 overflow-x-hidden">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">{T.subtitle}</h2>
            <CircularArrangement
              people={leftRightExample}
              explanationText={T.explanation}
              circleSize={circleSize}
              highlightedPerson={highlightedPerson}
              language={language}
            />

            <div className="flex flex-col items-center mt-6">
              {playbackError && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-4 text-sm font-medium text-center w-full max-w-xs">
                      {playbackError}
                  </div>
              )}
              <button 
                  onClick={synthesizeSpeech}
                  disabled={isLoading}
                  className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
              >
                  {isLoading ? (
                      <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {T.loading}
                      </>
                  ) : (
                      <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          {isSpeaking ? T.speaking : T.playButton}
                      </>
                  )}
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
            <p>{T.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
