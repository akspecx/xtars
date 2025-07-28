import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, RotateCcw } from 'lucide-react';

const LeftVsImmediateLeftModule = () => {
  const [currentPhase, setCurrentPhase] = useState<Phase>('introduction');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Animation states
  const [scenario1AnniePosition, setScenario1AnniePosition] = useState(3);
  const [scenario2AnniePosition, setScenario2AnniePosition] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<{ scenario: number | null; chair: number | null }>({ scenario: null, chair: null });
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const animationTimeouts = useRef<number[]>([]);

  const languages = [
    { 
      code: 'en-US', 
      name: 'English (US)', 
      introduction: 'Meet Annie and Vinnie! They will help us understand the difference between "left" and "immediate left". Annie is the girl with blonde hair wearing purple, and Vinnie is the boy with brown hair wearing green.',
      scenario1: 'Scenario 1: Annie is to the left of Vinnie. Annie can sit in chair 3. Annie can sit in chair 2. Annie can sit in chair 1. Any of these positions satisfies "to the left of Vinnie".',
      scenario2: 'Scenario 2: Annie is to the immediate left of Vinnie. Chair 2 is too far for immediate left. Chair 1 is also too far. Only chair 3 is valid for immediate left. Immediate left means directly adjacent with no chairs in between.',
      completed: 'Great! Now we understand the difference. "Left" means any position to the left side, while "immediate left" means directly next to each other with no empty chairs in between.'
    }
  ];

  // Character Components
  const AnnieImage = ({ isGlowing = false, size = "normal" }) => {
    const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
    const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
    const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";
    
    return (
      <div className={`${dimensions} bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700 transition-all duration-500 ${isGlowing ? 'ring-4 ring-pink-400 dark:ring-pink-500 ring-opacity-75 shadow-pink-300 dark:shadow-pink-600 animate-pulse' : ''}`}>
        <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${hairSize} bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full`}></div>
        <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${faceSize} bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600`}>
          <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
        </div>
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${size === "large" ? "w-10 h-16 md:w-12 md:h-20" : "w-4 h-8 md:w-6 md:h-10"} bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg`}></div>
      </div>
    );
  };

  const VinnieImage = ({ size = "normal" }) => {
    const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
    const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
    const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";
    
    return (
      <div className={`${dimensions} bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700`}>
        <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${hairSize} bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full`}></div>
        <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${faceSize} bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600`}>
          <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
        </div>
        <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${size === "large" ? "w-10 h-16 md:w-12 md:h-20" : "w-4 h-8 md:w-6 md:h-10"} bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg`}></div>
      </div>
    );
  };

  // Chair Component with better alignment
  const Chair = ({ number, occupied = false, isHighlighted = false, isValid = null, scenario = "" }: { number: number; occupied?: boolean; isHighlighted?: boolean; isValid?: boolean | null; scenario?: string }) => (
    <div className="flex flex-col items-center">
      <div className={`
        w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-dashed relative
        flex flex-col items-center justify-center transition-all duration-500
        ${isHighlighted ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-800/30 ring-2 ring-yellow-300 dark:ring-yellow-400 scale-105' : 
          'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}
      `}>
        <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Chair {number}</div>
        {!occupied && (
          <div className="text-xl md:text-2xl text-gray-400 dark:text-gray-500">💺</div>
        )}
      </div>
      
      {/* Valid/Invalid indicator aligned below chair */}
      <div className="mt-2 h-6 flex items-center justify-center min-w-16">
        {isValid !== null && (
          <div className={`text-xs font-bold px-2 py-1 rounded-full ${
            isValid ? 'text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-800' : 'text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800'
          }`}>
            {isValid ? 'Valid' : 'Invalid'}
          </div>
        )}
        {number === 4 && (
          <div className="text-xs font-bold px-2 py-1 rounded-full text-blue-700 dark:text-blue-200 bg-blue-100 dark:bg-blue-800">
            Vinnie
          </div>
        )}
      </div>
    </div>
  );

  type Phase = 'introduction' | 'scenario1' | 'scenario2' | 'completed';

  type Highlight = { scenario: number | null; chair: number | null };

  const getCurrentMessage = (phase: Phase): string => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? (lang as any)[phase] : (languages[0] as any)[phase];
  };

  const getCurrentLanguageName = (): string => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Clear all animation timeouts
  const clearAnimationTimeouts = (): void => {
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current = [];
  };

  // Parse speech text and create synchronized animations
  const createSynchronizedDemo = (phase: Phase) => {
    // const message = getCurrentMessage(phase); // message is unused, so removed
    
    if (phase === 'scenario1') {
      // Start from chair 3 and move backwards to chair 1
      const speechParts = [
        { text: 'Scenario 1: Annie is to the left of Vinnie.', action: null, duration: 3000 },
        { text: 'Annie can sit in chair 3.', action: () => { setScenario1AnniePosition(3); setCurrentHighlight({scenario: 1 as number, chair: 3 as number}); }, duration: 2500 },
        { text: 'Annie can sit in chair 2.', action: () => { setScenario1AnniePosition(2); setCurrentHighlight({scenario: 1 as number, chair: 2 as number}); }, duration: 2500 },
        { text: 'Annie can sit in chair 1.', action: () => { setScenario1AnniePosition(1); setCurrentHighlight({scenario: 1 as number, chair: 1 as number}); }, duration: 2500 },
        { text: 'Any of these positions satisfies "to the left of Vinnie".', action: () => setCurrentHighlight({scenario: null, chair: null}), duration: 3000 }
      ];
      
      return speechParts;
    } else if (phase === 'scenario2') {
      const speechParts = [
        { text: 'Scenario 2: Annie is to the immediate left of Vinnie.', action: () => setScenario2AnniePosition(3), duration: 3500 },
        { text: 'Chair 2 is too far for immediate left.', action: () => { setScenario2AnniePosition(2); setCurrentHighlight({scenario: 2 as number, chair: 2 as number}); }, duration: 2500 },
        { text: 'Chair 1 is also too far.', action: () => { setScenario2AnniePosition(1); setCurrentHighlight({scenario: 2 as number, chair: 1 as number}); }, duration: 2500 },
        { text: 'Only chair 3 is valid for immediate left.', action: () => { setScenario2AnniePosition(3); setCurrentHighlight({scenario: 2 as number, chair: 3 as number}); }, duration: 3000 },
        { text: 'Immediate left means directly adjacent with no chairs in between.', action: () => setCurrentHighlight({scenario: null, chair: null}), duration: 4000 }
      ];
      
      return speechParts;
    }
    
    return [];
  };

  // Start synchronized speech and animation
  const startSynchronizedDemo = (phase: Phase) => {
    const speechParts = createSynchronizedDemo(phase);
    let currentPartIndex = 0;
    
    const playNextPart = () => {
      if (currentPartIndex >= speechParts.length) {
        // Move to next phase
        switch (phase) {
          case 'introduction':
            setTimeout(() => {
              setCurrentPhase('scenario1');
              startSynchronizedDemo('scenario1');
            }, 1000);
            break;
          case 'scenario1':
            setTimeout(() => {
              setCurrentPhase('scenario2');
              startSynchronizedDemo('scenario2');
            }, 1000);
            break;
          case 'scenario2':
            setTimeout(() => {
              setCurrentPhase('completed');
              playPhase('completed');
            }, 1000);
            break;
        }
        return;
      }
      
      const currentPart = speechParts[currentPartIndex];
      
      // Execute the action (move character, highlight chair)
      if (currentPart.action) {
        currentPart.action();
      }
      
      // Speak this part
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentPart.text);
        utterance.lang = currentLanguage;
        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          currentPartIndex++;
          // Small pause between parts
          const timeout = setTimeout(playNextPart, 500);
          animationTimeouts.current.push(timeout);
        };
        
        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback without speech
        const timeout = setTimeout(() => {
          currentPartIndex++;
          playNextPart();
        }, currentPart.duration);
        animationTimeouts.current.push(timeout);
      }
    };
    
    playNextPart();
  };

  // Start the complete demo sequence
  const startCompleteDemo = () => {
    setCurrentPhase('introduction');
    setIsPlaying(true);
    setIsPaused(false);
    setIsAnimating(true);
    playPhase('introduction');
  };

  interface SpeechPart {
    text: string;
    action: (() => void) | null;
    duration: number;
  }

  type PhaseType = 'introduction' | 'scenario1' | 'scenario2' | 'completed';

  const playPhase = (phase: PhaseType): void => {
      if (phase === 'scenario1' || phase === 'scenario2') {
        startSynchronizedDemo(phase);
        return;
      }
      
      // For introduction and completion phases
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(getCurrentMessage(phase));
        utterance.lang = currentLanguage;
        utterance.rate = 0.7;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onend = (): void => {
          switch (phase) {
          case 'introduction':
            setTimeout(() => {
              setCurrentPhase('scenario1');
              startSynchronizedDemo('scenario1');
            }, 1000);
            break;
        }
      };
      
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
  };

  const pauseDemo = () => {
    if ('speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      clearAnimationTimeouts();
      setIsAnimating(false);
    }
  };

  const resumeDemo = () => {
    if (isPaused && utteranceRef.current) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      setIsAnimating(true);
    }
  };

  const resetDemo = () => {
    clearAnimationTimeouts();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentPhase('introduction');
    setScenario1AnniePosition(3);
    setScenario2AnniePosition(3);
    setIsAnimating(false);
    setCurrentHighlight({ scenario: null, chair: null });
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handleLanguageChange = (langCode: React.SetStateAction<string>) => {
    resetDemo();
    setCurrentLanguage(langCode);
    setIsDropdownOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAnimationTimeouts();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Introduction Phase
  const IntroductionSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Meet Our Characters!</h2>
      
      <div className="flex justify-center items-center gap-8 md:gap-16 mb-6">
        <div className="flex flex-col items-center">
          <AnnieImage size="large" isGlowing={currentPhase === 'introduction' && isAnimating} />
          <h3 className="text-lg md:text-xl font-bold mt-4 text-pink-600 dark:text-pink-400">Annie</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Blonde hair, Purple dress</p>
        </div>
        
        <div className="flex flex-col items-center">
          <VinnieImage size="large" />
          <h3 className="text-lg md:text-xl font-bold mt-4 text-blue-600 dark:text-blue-400">Vinnie</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Brown hair, Green shirt</p>
        </div>
      </div>
    </div>
  );

  // Scenario Layout
  interface ScenarioLayoutProps {
    scenario: string;
    anniePosition: number;
    title: string;
    scenarioNumber: number;
  }

  const ScenarioLayout = ({ scenario, anniePosition, title, scenarioNumber }: ScenarioLayoutProps) => {
    const isScenario1 = scenarioNumber === 1;
    const shouldShow = currentPhase === 'scenario1' || currentPhase === 'scenario2' || currentPhase === 'completed';
    
    if (!shouldShow) return null;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{title}</h2>
        
        {/* Seating Arrangement */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 md:p-8">
          <div className="flex justify-center items-start gap-3 md:gap-6">
            {/* Chairs 1-4 */}
            {[1, 2, 3, 4].map(chairNum => {
              const isAnnieHere = chairNum === anniePosition;
              const isVinnieHere = chairNum === 4;
              const isHighlighted = currentHighlight.scenario === scenarioNumber && currentHighlight.chair === chairNum;
              
              // Determine if chair is valid for this scenario
              let isValid = null;
              if (currentPhase === 'scenario1' || currentPhase === 'scenario2' || currentPhase === 'completed') {
                if (chairNum === 4) {
                  isValid = null; // Vinnie's chair
                } else if (isScenario1) {
                  isValid = chairNum >= 1 && chairNum <= 3; // Any left position
                } else {
                  isValid = chairNum === 3; // Only immediate left
                }
              }
              
              return (
                <div key={chairNum} className="relative flex flex-col items-center">
                  {/* Character positioned above chair */}
                  <div className="h-20 md:h-24 flex items-end justify-center mb-1">
                    {isAnnieHere && (
                      <div className="flex flex-col items-center">
                        <AnnieImage isGlowing={isHighlighted} />
                        <div className="text-xs md:text-sm font-bold text-pink-600 dark:text-pink-400 mt-1">Annie</div>
                      </div>
                    )}
                    
                    {isVinnieHere && (
                      <div className="flex flex-col items-center">
                        <VinnieImage />
                        <div className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">Vinnie</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chair */}
                  <Chair 
                    number={chairNum}
                    occupied={isAnnieHere || isVinnieHere}
                    isHighlighted={isHighlighted}
                    isValid={isValid}
                    scenario={scenario}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Understanding "Left" vs "Immediate Left"
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Watch as the system demonstrates with perfectly synchronized voice and movement!</p>
        
        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-40 text-sm"
            >
              <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
              <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm ${
                      currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button
            onClick={isPlaying ? pauseDemo : isPaused ? resumeDemo : startCompleteDemo}
            className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause Demo' : isPaused ? 'Resume Demo' : 'Start Complete Demo'}
          </button>
          
          <button
            onClick={resetDemo}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>

        {/* Current Phase Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
            <div className={`w-3 h-3 rounded-full ${
              currentPhase === 'introduction' ? 'bg-purple-500 dark:bg-purple-400' :
              currentPhase === 'scenario1' ? 'bg-green-500 dark:bg-green-400' :
              currentPhase === 'scenario2' ? 'bg-blue-500 dark:bg-blue-400' :
              'bg-gray-500 dark:bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {currentPhase === 'introduction' ? 'Character Introduction' :
               currentPhase === 'scenario1' ? 'Scenario 1: Left' :
               currentPhase === 'scenario2' ? 'Scenario 2: Immediate Left' :
               'Demo Complete'}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        {currentPhase === 'introduction' && <IntroductionSection />}
        
        <ScenarioLayout
          scenario="scenario1"
          anniePosition={scenario1AnniePosition}
          title="Scenario 1: Annie is to the LEFT of Vinnie"
          scenarioNumber={1}
        />

        <ScenarioLayout
          scenario="scenario2"
          anniePosition={scenario2AnniePosition}
          title="Scenario 2: Annie is to the IMMEDIATE LEFT of Vinnie"
          scenarioNumber={2}
        />

        {/* Current Message Display */}
        <div className="mt-6 text-center px-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic">
              "{getCurrentMessage(currentPhase)}"
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 dark:text-yellow-300 mb-2">Synchronized Demo Features:</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• <strong>Perfect Sync:</strong> When voice says "chair 1", Annie moves to chair 1 immediately</li>
            <li>• <strong>Visual Highlighting:</strong> Current chair being discussed glows with yellow border</li>
            <li>• <strong>Simultaneous View:</strong> Both scenarios visible during explanation phases</li>
            <li>• <strong>Smart Labels:</strong> Valid/Invalid indicators properly aligned below each chair</li>
            <li>• <strong>Character Glow:</strong> Annie glows when actively demonstrating movement</li>
            <li>• <strong>Smooth Flow:</strong> Introduction → Scenario 1 → Scenario 2 → Completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftVsImmediateLeftModule;