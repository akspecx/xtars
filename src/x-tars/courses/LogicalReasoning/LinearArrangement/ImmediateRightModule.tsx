// import React, { useState, useRef, useEffect } from 'react';
// import { Play, Pause, ChevronDown, RotateCcw } from 'lucide-react';

// const LeftVsImmediateLeftModule = () => {
//   const [currentPhase, setCurrentPhase] = useState('introduction');
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [currentLanguage, setCurrentLanguage] = useState('en-US');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // Animation states
//   const [scenario1AnniePosition, setScenario1AnniePosition] = useState(2); // Right
//   const [scenario2AnniePosition, setScenario2AnniePosition] = useState(4); // Immediate Right - Initial position for demo

//   const [scenario1VinniePosition, setScenario1VinniePosition] = useState(1);
//   const [scenario2VinniePosition, setScenario2VinniePosition] = useState(1); // Vinnie's fixed position for Immediate Right (Chair 1)

//   const [isAnimating, setIsAnimating] = useState(false);
//   const [currentHighlight, setCurrentHighlight] = useState({ scenario: null, chair: null });
//   const [draggedCharacter, setDraggedCharacter] = useState(null);
//   const [draggedFromScenario, setDraggedFromScenario] = useState(null);

//   const utteranceRef = useRef(null);
//   const animationTimeouts = useRef([]);

//   const languages = [
//     {
//       code: 'en-US',
//       name: 'English (US)',
//       introduction: 'Meet Annie and Vinnie! They will help us understand the difference between "right" and "immediate right".',
//       scenario1: 'Scenario 1: Annie is to the right of Vinnie. Annie can sit in chair 2. Annie can sit in chair 3. Annie can sit in chair 4. Any of these positions satisfies "to the right of Vinnie".',
//       scenario2: 'Scenario 2: Annie is to the immediate right of Vinnie. Chair 4 is too far for immediate right. Chair 3 is also too far. Chair 1 is where Vinnie is sitting. Only chair 2 is valid for immediate right. Immediate right means directly adjacent with no chairs in between.',
//       completed: 'Great! Now we understand the difference. "Right" means any position to the right side, and "immediate right" means directly next to each other with no empty chairs in between.'
//     }
//   ];

//   // Helper function to get the current message based on phase and language
//   const getCurrentMessage = (phase) => {
//     const lang = languages.find(l => l.code === currentLanguage);
//     if (lang && lang[phase]) {
//       return lang[phase];
//     }
//     // Fallback to English introduction if phase not found or language not found
//     return languages[0][phase] || languages[0].introduction;
//   };

//   // Character Components with drag functionality
//   const AnnieImage = ({ isGlowing = false, size = "normal", isDraggable = false, scenario = null, onDragStart = null }) => {
//     const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
//     const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
//     const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";

//     const handleDragStart = (e) => {
//       if (isDraggable && onDragStart) {
//         onDragStart('annie', scenario);
//       }
//     };

//     return (
//       <div
//         className={`${dimensions} bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700 transition-all duration-500 ${isGlowing ? 'ring-4 ring-pink-400 dark:ring-pink-500 ring-opacity-75 shadow-pink-300 dark:shadow-pink-600 animate-pulse' : ''} ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
//         draggable={isDraggable}
//         onDragStart={handleDragStart}
//       >
//         <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${hairSize} bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full`}></div>
//         <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${faceSize} bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600`}>
//           <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
//           <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
//           <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
//           <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
//         </div>
//         <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${size === "large" ? "w-10 h-16 md:w-12 md:h-20" : "w-4 h-8 md:w-6 md:h-10"} bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg`}></div>
//       </div>
//     );
//   };

//   const VinnieImage = ({ size = "normal", isDraggable = false, scenario = null, onDragStart = null }) => {
//     const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
//     const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
//     const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";

//     const handleDragStart = (e) => {
//       if (isDraggable && onDragStart) {
//         onDragStart('vinnie', scenario);
//       }
//     };

//     return (
//       <div
//         className={`${dimensions} bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700 transition-all duration-500 ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
//         draggable={isDraggable}
//         onDragStart={handleDragStart}
//       >
//         <div className={`absolute top-1 left-1/2 transform -translate-x-1/2 ${hairSize} bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full`}></div>
//         <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 ${faceSize} bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600`}>
//           <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
//           <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
//           <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
//           <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
//         </div>
//         <div className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 ${size === "large" ? "w-10 h-16 md:w-12 md:h-20" : "w-4 h-8 md:w-6 md:h-10"} bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg`}></div>
//       </div>
//     );
//   };

//   // Chair Component with drop functionality
//   const Chair = ({ number, occupied = false, isHighlighted = false, isValid = null, scenarioNumber, onDrop }) => {
//     const handleDragOver = (e) => {
//       e.preventDefault();
//     };

//     const handleDrop = (e) => {
//       e.preventDefault();
//       if (onDrop && draggedCharacter && draggedFromScenario === scenarioNumber) {
//         onDrop(draggedCharacter, number, scenarioNumber);
//       }
//     };

//     return (
//       <div className="flex flex-col items-center">
//         <div
//           className={`
//             w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-dashed relative
//             flex flex-col items-center justify-center transition-all duration-500
//             ${isHighlighted ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-800/30 ring-2 ring-yellow-300 dark:ring-yellow-400 scale-105' :
//               'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}
//             hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800/30
//           `}
//           onDragOver={handleDragOver}
//           onDrop={handleDrop}
//         >
//           <div className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300 mb-1">Chair {number}</div>
//           {!occupied && (
//             <div className="text-xl md:text-2xl text-gray-400 dark:text-gray-500">💺</div>
//           )}
//         </div>

//         {/* Valid/Invalid indicator aligned below chair */}
//         <div className="mt-2 h-6 flex items-center justify-center min-w-16">
//           {isValid !== null && (
//             <div className={`text-xs font-bold px-2 py-1 rounded-full ${
//               isValid ? 'text-green-700 dark:text-green-200 bg-green-100 dark:bg-green-800' : 'text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800'
//             }`}>
//               {isValid ? 'Valid' : 'Invalid'}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Drag and drop handlers
//   const handleDragStart = (character, scenario) => {
//     setDraggedCharacter(character);
//     setDraggedFromScenario(scenario);
//   };

//   const handleDrop = (character, chairNumber, scenarioNumber) => {
//     if (character === 'annie') {
//       if (scenarioNumber === 1) { // Now corresponds to 'Right'
//         setScenario1AnniePosition(chairNumber);
//       } else if (scenarioNumber === 2) { // Now corresponds to 'Immediate Right'
//         setScenario2AnniePosition(chairNumber);
//       }
//     } else if (character === 'vinnie') {
//       if (scenarioNumber === 1) { // Now corresponds to 'Right'
//         setScenario1VinniePosition(chairNumber);
//       } else if (scenarioNumber === 2) { // Now corresponds to 'Immediate Right'
//         setScenario2VinniePosition(chairNumber);
//       }
//     }

//     setDraggedCharacter(null);
//     setDraggedFromScenario(null);
//   };

//   // Check if position is valid for the scenario
//   const isValidPosition = (character, chairNumber, scenarioNumber, vinnieCurrentPos) => {
//     const anniePos = character === 'annie' ? chairNumber : (
//       scenarioNumber === 1 ? scenario1AnniePosition :
//       scenario2AnniePosition
//     );
//     const vinniePos = vinnieCurrentPos !== undefined ? vinnieCurrentPos : (
//       scenarioNumber === 1 ? scenario1VinniePosition :
//       scenario2VinniePosition
//     );

//     if (scenarioNumber === 1) { // Corresponds to 'Right'
//       return anniePos > vinniePos;
//     } else if (scenarioNumber === 2) { // Corresponds to 'Immediate Right'
//       return anniePos === vinniePos + 1;
//     }
//     return false; // Default case
//   };

//   const getCurrentLanguageName = () => {
//     const lang = languages.find(l => l.code === currentLanguage);
//     return lang ? lang.name : languages[0].name;
//   };

//   // Clear all animation timeouts
//   const clearAnimationTimeouts = () => {
//     animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
//     animationTimeouts.current = [];
//   };

//   // Parse speech text and create synchronized animations
//   const createSynchronizedDemo = (phase) => {
//     if (phase === 'scenario1') { // Corresponds to 'Right'
//       const speechParts = [
//         { text: 'Scenario 1: Annie is to the right of Vinnie.', action: null, duration: 3000 },
//         { text: 'Annie can sit in chair 2.', action: () => { setScenario1AnniePosition(2); setCurrentHighlight({ scenario: 1, chair: 2 }); }, duration: 2500 },
//         { text: 'Annie can sit in chair 3.', action: () => { setScenario1AnniePosition(3); setCurrentHighlight({ scenario: 1, chair: 3 }); }, duration: 2500 },
//         { text: 'Annie can sit in chair 4.', action: () => { setScenario1AnniePosition(4); setCurrentHighlight({ scenario: 1, chair: 4 }); }, duration: 2500 },
//         { text: 'Any of these positions satisfies "to the right of Vinnie".', action: () => setCurrentHighlight({ scenario: null, chair: null }), duration: 3000 }
//       ];
//       return speechParts;
//     } else if (phase === 'scenario2') { // Corresponds to 'Immediate Right'
//       const speechParts = [
//         { text: 'Scenario 2: Annie is to the immediate right of Vinnie.', action: () => { setScenario2AnniePosition(4); setScenario2VinniePosition(1); }, duration: 3500 }, // Vinnie at 1, Annie at 4 initially
//         { text: 'Chair 4 is too far for immediate right.', action: () => { setCurrentHighlight({ scenario: 2, chair: 4 }); }, duration: 2500 },
//         { text: 'Chair 3 is also too far.', action: () => { setScenario2AnniePosition(3); setCurrentHighlight({ scenario: 2, chair: 3 }); }, duration: 2500 }, // Move Annie to Chair 3
//         { text: 'Chair 1 is where Vinnie is sitting.', action: () => { setCurrentHighlight({ scenario: 2, chair: 1 }); }, duration: 2500 }, // Highlight Chair 1 (Vinnie's spot)
//         { text: 'Only chair 2 is valid for immediate right.', action: () => { setScenario2AnniePosition(2); setCurrentHighlight({ scenario: 2, chair: 2 }); }, duration: 3000 }, // Move Annie to Chair 2 (valid)
//         { text: 'Immediate right means directly adjacent with no chairs in between.', action: () => setCurrentHighlight({ scenario: null, chair: null }), duration: 4000 }
//       ];
//       return speechParts;
//     }
//     return [];
//   };

//   // Start synchronized speech and animation
//   const startSynchronizedDemo = (phase) => {
//     const speechParts = createSynchronizedDemo(phase);
//     let currentPartIndex = 0;

//     const playNextPart = () => {
//       if (currentPartIndex >= speechParts.length) {
//         // Move to next phase
//         switch (phase) {
//           case 'introduction':
//             setTimeout(() => {
//               setCurrentPhase('scenario1');
//               startSynchronizedDemo('scenario1');
//             }, 1000);
//             break;
//           case 'scenario1': // After 'Right'
//             setTimeout(() => {
//               setCurrentPhase('scenario2');
//               startSynchronizedDemo('scenario2');
//             }, 1000);
//             break;
//           case 'scenario2': // After 'Immediate Right'
//             setTimeout(() => {
//               setCurrentPhase('completed');
//               playPhase('completed');
//             }, 1000);
//             break;
//         }
//         return;
//       }

//       const currentPart = speechParts[currentPartIndex];

//       // Execute the action (move character, highlight chair)
//       if (currentPart.action) {
//         currentPart.action();
//       }

//       // Speak this part
//       if ('speechSynthesis' in window) {
//         const utterance = new SpeechSynthesisUtterance(currentPart.text);
//         utterance.lang = currentLanguage;
//         utterance.rate = 0.7;
//         utterance.pitch = 1;
//         utterance.volume = 1;

//         utterance.onend = () => {
//           currentPartIndex++;
//           // Small pause between parts
//           const timeout = setTimeout(playNextPart, 500);
//           animationTimeouts.current.push(timeout);
//         };

//         utteranceRef.current = utterance;
//         window.speechSynthesis.speak(utterance);
//       } else {
//         // Fallback without speech
//         const timeout = setTimeout(() => {
//           currentPartIndex++;
//           playNextPart();
//         }, currentPart.duration);
//         animationTimeouts.current.push(timeout);
//       }
//     };

//     playNextPart();
//   };

//   // Start the complete demo sequence
//   const startCompleteDemo = () => {
//     setCurrentPhase('introduction');
//     setIsPlaying(true);
//     setIsPaused(false);
//     setIsAnimating(true);
//     playPhase('introduction');
//   };

//   const playPhase = (phase) => {
//     if (phase.startsWith('scenario')) { // Check if phase is any of the scenarios
//       startSynchronizedDemo(phase);
//       return;
//     }

//     // For introduction and completion phases
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();

//       const utterance = new SpeechSynthesisUtterance(getCurrentMessage(phase));
//       utterance.lang = currentLanguage;
//       utterance.rate = 0.7;
//       utterance.pitch = 1;
//       utterance.volume = 1;

//       utterance.onend = () => {
//         switch (phase) {
//           case 'introduction':
//             setTimeout(() => {
//               setCurrentPhase('scenario1');
//               startSynchronizedDemo('scenario1');
//             }, 1000);
//             break;
//           case 'completed':
//             setIsPlaying(false);
//             setIsPaused(false);
//             setIsAnimating(false);
//             break;
//         }
//       };

//       utteranceRef.current = utterance;
//       window.speechSynthesis.speak(utterance);
//     }
//   };

//   const pauseDemo = () => {
//     if ('speechSynthesis' in window && isPlaying) {
//       window.speechSynthesis.pause();
//       setIsPlaying(false);
//       setIsPaused(true);
//       clearAnimationTimeouts();
//       setIsAnimating(false);
//     }
//   };

//   const resumeDemo = () => {
//     if (isPaused && utteranceRef.current) {
//       window.speechSynthesis.resume();
//       setIsPlaying(true);
//       setIsAnimating(true);
//     }
//   };

//   const resetDemo = () => {
//     clearAnimationTimeouts();
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//     }
//     setCurrentPhase('introduction');
//     setScenario1AnniePosition(2); // Reset for Right
//     setScenario2AnniePosition(4); // Reset for Immediate Right to initial demo state
//     setScenario1VinniePosition(1);
//     setScenario2VinniePosition(1); // Vinnie at Chair 1 for Immediate Right
//     setIsAnimating(false);
//     setCurrentHighlight({ scenario: null, chair: null });
//     setIsPlaying(false);
//     setIsPaused(false);
//     setDraggedCharacter(null);
//     setDraggedFromScenario(null);
//   };

//   const handleLanguageChange = (langCode) => {
//     resetDemo();
//     setCurrentLanguage(langCode);
//     setIsDropdownOpen(false);
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       clearAnimationTimeouts();
//       if ('speechSynthesis' in window) {
//         window.speechSynthesis.cancel();
//       }
//     };
//   }, []);

//   // Introduction Phase
//   const IntroductionSection = () => (
//     <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 mb-6">
//       <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Meet Our Characters!</h2>

//       <div className="flex justify-center items-center gap-8 md:gap-16 mb-6">
//         <div className="flex flex-col items-center">
//           <AnnieImage size="large" isGlowing={currentPhase === 'introduction' && isAnimating} />
//           <h3 className="text-lg md:text-xl font-bold mt-4 text-pink-600 dark:text-pink-400">Annie</h3>
//         </div>

//         <div className="flex flex-col items-center">
//           <VinnieImage size="large" />
//           <h3 className="text-lg md:text-xl font-bold mt-4 text-blue-600 dark:text-blue-400">Vinnie</h3>
//         </div>
//       </div>
//     </div>
//   );

//   // Scenario Layout
//   const ScenarioLayout = ({ anniePosition, vinniePosition, title, scenarioNumber }) => {
//     // Both scenarios should always be shown if not in introduction phase
//     const shouldShow = currentPhase !== 'introduction';

//     if (!shouldShow) return null;

//     return (
//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 mb-6">
//         <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">{title}</h2>

//         {/* Seating Arrangement */}
//         <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 md:p-8">
//           <div className="flex justify-center items-start gap-3 md:gap-6">
//             {/* Chairs 1-4 */}
//             {[1, 2, 3, 4].map(chairNum => {
//               const isAnnieHere = chairNum === anniePosition;
//               const isVinnieHere = chairNum === vinniePosition;
//               const isHighlighted = currentHighlight.scenario === scenarioNumber && currentHighlight.chair === chairNum;

//               let chairValidityForAnnie = null;
//               // Only show valid/invalid for chairs that are not occupied by Vinnie
//               // and are being evaluated for Annie's potential position.
//               if (!isVinnieHere) {
//                 chairValidityForAnnie = isValidPosition('annie', chairNum, scenarioNumber, vinniePosition);
//               }

//               return (
//                 <div key={chairNum} className="relative flex flex-col items-center">
//                   {/* Character positioned above chair */}
//                   <div className="h-20 md:h-24 flex items-end justify-center mb-1">
//                     {isAnnieHere && (
//                       <div className="flex flex-col items-center">
//                         <AnnieImage isGlowing={isHighlighted} />
//                         <div className="text-xs md:text-sm font-bold text-pink-600 dark:text-pink-400 mt-1">Annie</div>
//                       </div>
//                     )}

//                     {isVinnieHere && (
//                       <div className="flex flex-col items-center">
//                         <VinnieImage />
//                         <div className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400 mt-1">Vinnie</div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Chair */}
//                   <Chair
//                     number={chairNum}
//                     occupied={isAnnieHere || isVinnieHere}
//                     isHighlighted={isHighlighted}
//                     isValid={chairValidityForAnnie}
//                     scenarioNumber={scenarioNumber}
//                     onDrop={handleDrop}
//                   />
//                 </div>
//               );
//             })}
//           </div>

//           {/* Validation Message */}
//           <div className="mt-4 text-center">
//             {(() => {
//               const anniePos = anniePosition;
//               const vinniePos = vinniePosition;

//               if (scenarioNumber === 1) { // Corresponds to 'Right'
//                 if (anniePos > vinniePos) {
//                   return <div className="text-green-600 dark:text-green-400 font-medium">✅ Correct! Annie is to the right of Vinnie</div>;
//                 } else if (anniePos < vinniePos) {
//                   return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie should be to the RIGHT of Vinnie</div>;
//                 } else {
//                   return <div className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Annie and Vinnie cannot be in the same chair</div>;
//                 }
//               } else if (scenarioNumber === 2) { // Corresponds to 'Immediate Right'
//                 if (anniePos === vinniePos + 1) {
//                   return <div className="text-green-600 dark:text-green-400 font-medium">✅ Perfect! Annie is immediately to the right of Vinnie</div>;
//                 } else if (anniePos > vinniePos + 1) {
//                   return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie is too far right. She needs to be IMMEDIATELY right of Vinnie</div>;
//                 } else if (anniePos <= vinniePos) {
//                   return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie should be to the immediate RIGHT of Vinnie</div>;
//                 }
//               }
//             })()}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
//       <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-4 md:p-8">
//         <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
//           Understanding "Right" vs "Immediate Right"
//         </h1>
//         <p className="text-center text-gray-600 dark:text-gray-300 mb-6">Watch as the system demonstrates with perfectly synchronized voice and movement!</p>

//         {/* Controls */}
//         <div className="flex justify-center items-center gap-4 mb-6">
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-40 text-sm"
//             >
//               <span className="text-gray-700 dark:text-gray-200">{getCurrentLanguageName()}</span>
//               <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
//             </button>

//             {isDropdownOpen && (
//               <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
//                 {languages.map((lang) => (
//                   <button
//                     key={lang.code}
//                     onClick={() => handleLanguageChange(lang.code)}
//                     className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm ${
//                       currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
//                     }`}
//                   >
//                     {lang.name}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <button
//             onClick={isPlaying ? pauseDemo : isPaused ? resumeDemo : startCompleteDemo}
//             className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
//           >
//             {isPlaying ? <Pause size={16} /> : <Play size={16} />}
//             {isPlaying ? 'Pause Demo' : isPaused ? 'Resume Demo' : 'Start Complete Demo'}
//           </button>

//           <button
//             onClick={resetDemo}
//             className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
//           >
//             <RotateCcw size={16} />
//             Reset
//           </button>
//         </div>

//         {/* Current Phase Display */}
//         <div className="text-center mb-6">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
//             <div className={`w-3 h-3 rounded-full ${
//               currentPhase === 'introduction' ? 'bg-purple-500 dark:bg-purple-400' :
//               currentPhase === 'scenario1' ? 'bg-orange-500 dark:bg-orange-400' : // Color for Right
//               currentPhase === 'scenario2' ? 'bg-red-500 dark:bg-red-400' :    // Color for Immediate Right
//               'bg-gray-500 dark:bg-gray-400'
//             }`}></div>
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
//               {currentPhase === 'introduction' ? 'Character Introduction' :
//                currentPhase === 'scenario1' ? 'Scenario 1: Right' :
//                currentPhase === 'scenario2' ? 'Scenario 2: Immediate Right' :
//                'Demo Complete'}
//             </span>
//           </div>
//         </div>

//         {/* Content Sections */}
//         {currentPhase === 'introduction' && <IntroductionSection />}

//         <ScenarioLayout
//           anniePosition={scenario1AnniePosition}
//           vinniePosition={scenario1VinniePosition}
//           title="Scenario 1: Annie is to the RIGHT of Vinnie"
//           scenarioNumber={1}
//         />
//         <ScenarioLayout
//           anniePosition={scenario2AnniePosition}
//           vinniePosition={scenario2VinniePosition}
//           title="Scenario 2: Annie is to the IMMEDIATE RIGHT of Vinnie"
//           scenarioNumber={2}
//         />

//         {/* Current Message Display */}
//         <div className="mt-6 text-center px-4">
//           <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
//             <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic">
//               "{getCurrentMessage(currentPhase)}"
//             </p>
//           </div>
//         </div>

//         {/* Instructions */}
//         {/* Removed the Synchronized Demo Features section */}
//       </div>
//     </div>
//   );
// };

// export default LeftVsImmediateLeftModule;


import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ChevronDown, RotateCcw } from 'lucide-react';

const LeftVsImmediateLeftModule = () => {
  const [currentPhase, setCurrentPhase] = useState('introduction');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Animation states
  const [scenario1AnniePosition, setScenario1AnniePosition] = useState(2); // Right
  const [scenario2AnniePosition, setScenario2AnniePosition] = useState(4); // Immediate Right - Initial position for demo

  const [scenario1VinniePosition, setScenario1VinniePosition] = useState(1);
  const [scenario2VinniePosition, setScenario2VinniePosition] = useState(1); // Vinnie's fixed position for Immediate Right (Chair 1)

  const [isAnimating, setIsAnimating] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState({ scenario: null, chair: null });
  const [draggedCharacter, setDraggedCharacter] = useState(null);
  const [draggedFromScenario, setDraggedFromScenario] = useState(null);

  const utteranceRef = useRef(null);
  const animationTimeouts = useRef([]);

  type LanguagePhase = 'introduction' | 'scenario1' | 'scenario2' | 'completed';

  type Language = {
    code: string;
    name: string;
    introduction: string;
    scenario1: string;
    scenario2: string;
    completed: string;
  };

  const languages: Language[] = [
    {
      code: 'en-US',
      name: 'English (US)',
      introduction: 'Meet Annie and Vinnie! They will help us understand the difference between "right" and "immediate right".',
      scenario1: 'Scenario 1: Annie is to the right of Vinnie. Annie can sit in chair 2. Annie can sit in chair 3. Annie can sit in chair 4. Any of these positions satisfies "to the right of Vinnie".',
      scenario2: 'Scenario 2: Annie is to the immediate right of Vinnie. Chair 4 is too far for immediate right. Chair 3 is also too far. Chair 1 is where Vinnie is sitting. Only chair 2 is valid for immediate right. Immediate right means directly adjacent with no chairs in between.',
      completed: 'Great! Now we understand the difference. "Right" means any position to the right side, and "immediate right" means directly next to each other with no empty chairs in between.'
    }
  ];

  // Helper function to get the current message based on phase and language
  const getCurrentMessage = (phase: keyof Language) => {
    const lang = languages.find(l => l.code === currentLanguage);
    if (lang && lang[phase]) {
      return lang[phase];
    }
    // Fallback to English introduction if phase not found or language not found
    return languages[0][phase] || languages[0].introduction;
  };

  // Character Components with drag functionality
  const AnnieImage = ({ isGlowing = false, size = "normal", isDraggable = false, scenario = null, onDragStart }: { 
    isGlowing?: boolean;
    size?: string;
    isDraggable?: boolean;
    scenario?: number | null;
    onDragStart?: (character: string, scenario: number | null) => void;
  }) => {
    const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
    const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
    const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";

    const handleDragStart = (e) => {
      if (isDraggable && onDragStart) {
        onDragStart('annie', scenario);
      }
    };

    return (
      <div
        className={`${dimensions} bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700 transition-all duration-500 ${isGlowing ? 'ring-4 ring-pink-400 dark:ring-pink-500 ring-opacity-75 shadow-pink-300 dark:shadow-pink-600 animate-pulse' : ''} ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
        draggable={isDraggable}
        onDragStart={handleDragStart}
      >
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

  const VinnieImage = ({ size = "normal", isDraggable = false, scenario = null, onDragStart = null }) => {
    const dimensions = size === "large" ? "w-20 h-28 md:w-24 md:h-32" : "w-12 h-16 md:w-16 md:h-20";
    const hairSize = size === "large" ? "w-16 h-8 md:w-20 md:h-10" : "w-8 h-4 md:w-12 md:h-6";
    const faceSize = size === "large" ? "w-12 h-12 md:w-16 md:h-16" : "w-6 h-6 md:w-8 md:h-8";

    const handleDragStart = (e) => {
      if (isDraggable && onDragStart) {
        onDragStart('vinnie', scenario);
      }
    };

    return (
      <div
        className={`${dimensions} bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700 transition-all duration-500 ${isDraggable ? 'cursor-grab active:cursor-grabbing hover:scale-105' : ''}`}
        draggable={isDraggable}
        onDragStart={handleDragStart}
      >
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

  // Chair Component with drop functionality
  const Chair = ({ number, occupied = false, isHighlighted = false, isValid = null, scenarioNumber, onDrop }) => {
    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      if (onDrop && draggedCharacter && draggedFromScenario === scenarioNumber) {
        onDrop(draggedCharacter, number, scenarioNumber);
      }
    };

    return (
      <div className="flex flex-col items-center">
        <div
          className={`
            w-16 h-20 md:w-20 md:h-24 rounded-lg border-2 border-dashed relative
            flex flex-col items-center justify-center transition-all duration-500
            ${isHighlighted ? 'border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-800/30 ring-2 ring-yellow-300 dark:ring-yellow-400 scale-105' :
              'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'}
            hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800/30
          `}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
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
        </div>
      </div>
    );
  };

  // Drag and drop handlers
  const handleDragStart = (character, scenario) => {
    setDraggedCharacter(character);
    setDraggedFromScenario(scenario);
  };

  const handleDrop = (character, chairNumber, scenarioNumber) => {
    if (character === 'annie') {
      if (scenarioNumber === 1) { // Now corresponds to 'Right'
        setScenario1AnniePosition(chairNumber);
      } else if (scenarioNumber === 2) { // Now corresponds to 'Immediate Right'
        setScenario2AnniePosition(chairNumber);
      }
    } else if (character === 'vinnie') {
      if (scenarioNumber === 1) { // Now corresponds to 'Right'
        setScenario1VinniePosition(chairNumber);
      } else if (scenarioNumber === 2) { // Now corresponds to 'Immediate Right'
        setScenario2VinniePosition(chairNumber);
      }
    }

    setDraggedCharacter(null);
    setDraggedFromScenario(null);
  };

  // Check if position is valid for the scenario
  const isValidPosition = (character, chairNumber, scenarioNumber, vinnieCurrentPos) => {
    const anniePos = character === 'annie' ? chairNumber : (
      scenarioNumber === 1 ? scenario1AnniePosition :
      scenario2AnniePosition
    );
    const vinniePos = vinnieCurrentPos !== undefined ? vinnieCurrentPos : (
      scenarioNumber === 1 ? scenario1VinniePosition :
      scenario2VinniePosition
    );

    if (scenarioNumber === 1) { // Corresponds to 'Right'
      return anniePos > vinniePos;
    } else if (scenarioNumber === 2) { // Corresponds to 'Immediate Right'
      return anniePos === vinniePos + 1;
    }
    return false; // Default case
  };

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? lang.name : languages[0].name;
  };

  // Clear all animation timeouts
  const clearAnimationTimeouts = () => {
    animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    animationTimeouts.current = [];
  };

  // Parse speech text and create synchronized animations
  const createSynchronizedDemo = (phase) => {
    if (phase === 'scenario1') { // Corresponds to 'Right'
      const speechParts = [
        { text: 'Scenario 1: Annie is to the right of Vinnie.', action: null, duration: 3000 },
        { text: 'Annie can sit in chair 2.', action: () => { setScenario1AnniePosition(2); setCurrentHighlight({ scenario: 1, chair: 2 }); }, duration: 2500 },
        { text: 'Annie can sit in chair 3.', action: () => { setScenario1AnniePosition(3); setCurrentHighlight({ scenario: 1, chair: 3 }); }, duration: 2500 },
        { text: 'Annie can sit in chair 4.', action: () => { setScenario1AnniePosition(4); setCurrentHighlight({ scenario: 1, chair: 4 }); }, duration: 2500 },
        { text: 'Any of these positions satisfies "to the right of Vinnie".', action: () => setCurrentHighlight({ scenario: null, chair: null }), duration: 3000 }
      ];
      return speechParts;
    } else if (phase === 'scenario2') { // Corresponds to 'Immediate Right'
      const speechParts = [
        { text: 'Scenario 2: Annie is to the immediate right of Vinnie.', action: () => { setScenario2AnniePosition(4); setScenario2VinniePosition(1); }, duration: 3500 }, // Vinnie at 1, Annie at 4 initially
        { text: 'Chair 4 is too far for immediate right.', action: () => { setCurrentHighlight({ scenario: 2, chair: 4 }); }, duration: 2500 },
        { text: 'Chair 3 is also too far.', action: () => { setScenario2AnniePosition(3); setCurrentHighlight({ scenario: 2, chair: 3 }); }, duration: 2500 }, // Move Annie to Chair 3
        { text: 'Chair 1 is where Vinnie is sitting.', action: () => { setCurrentHighlight({ scenario: 2, chair: 1 }); }, duration: 2500 }, // Highlight Chair 1 (Vinnie's spot)
        { text: 'Only chair 2 is valid for immediate right.', action: () => { setScenario2AnniePosition(2); setCurrentHighlight({ scenario: 2, chair: 2 }); }, duration: 3000 }, // Move Annie to Chair 2 (valid)
        { text: 'Immediate right means directly adjacent with no chairs in between.', action: () => setCurrentHighlight({ scenario: null, chair: null }), duration: 4000 }
      ];
      return speechParts;
    }
    return [];
  };

  // Start synchronized speech and animation
  const startSynchronizedDemo = (phase) => {
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
          case 'scenario1': // After 'Right'
            setTimeout(() => {
              setCurrentPhase('scenario2');
              startSynchronizedDemo('scenario2');
            }, 1000);
            break;
          case 'scenario2': // After 'Immediate Right'
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

  const playPhase = (phase) => {
    if (phase.startsWith('scenario')) { // Check if phase is any of the scenarios
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

      utterance.onend = () => {
        switch (phase) {
          case 'introduction':
            setTimeout(() => {
              setCurrentPhase('scenario1');
              startSynchronizedDemo('scenario1');
            }, 1000);
            break;
          case 'completed':
            setIsPlaying(false);
            setIsPaused(false);
            setIsAnimating(false);
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
      setIsAnimating(true);
    }
  };

  const resetDemo = () => {
    clearAnimationTimeouts();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentPhase('introduction');
    setScenario1AnniePosition(2); // Reset for Right
    setScenario2AnniePosition(4); // Reset for Immediate Right to initial demo state
    setScenario1VinniePosition(1);
    setScenario2VinniePosition(1); // Vinnie at Chair 1 for Immediate Right
    setIsAnimating(false);
    setCurrentHighlight({ scenario: null, chair: null });
    setIsPlaying(false);
    setIsPaused(false);
    setDraggedCharacter(null);
    setDraggedFromScenario(null);
  };

  const handleLanguageChange = (langCode) => {
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
        </div>

        <div className="flex flex-col items-center">
          <VinnieImage size="large" />
          <h3 className="text-lg md:text-xl font-bold mt-4 text-blue-600 dark:text-blue-400">Vinnie</h3>
        </div>
      </div>
    </div>
  );

  // Scenario Layout
  const ScenarioLayout = ({ anniePosition, vinniePosition, title, scenarioNumber }) => {
    // Both scenarios should always be shown if not in introduction phase
    const shouldShow = currentPhase !== 'introduction';

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
              const isVinnieHere = chairNum === vinniePosition;
              const isHighlighted = currentHighlight.scenario === scenarioNumber && currentHighlight.chair === chairNum;

              let chairValidityForAnnie = null;
              // Only show valid/invalid for chairs that are not occupied by Vinnie
              // and are being evaluated for Annie's potential position.
              if (!isVinnieHere) {
                chairValidityForAnnie = isValidPosition('annie', chairNum, scenarioNumber, vinniePosition);
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
                    isValid={chairValidityForAnnie}
                    scenarioNumber={scenarioNumber}
                    onDrop={handleDrop}
                  />
                </div>
              );
            })}
          </div>

          {/* Validation Message */}
          <div className="mt-4 text-center">
            {(() => {
              const anniePos = anniePosition;
              const vinniePos = vinniePosition;

              if (scenarioNumber === 1) { // Corresponds to 'Right'
                if (anniePos > vinniePos) {
                  return <div className="text-green-600 dark:text-green-400 font-medium">✅ Correct! Annie is to the right of Vinnie</div>;
                } else if (anniePos < vinniePos) {
                  return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie should be to the RIGHT of Vinnie</div>;
                } else {
                  return <div className="text-orange-600 dark:text-orange-400 font-medium">⚠️ Annie and Vinnie cannot be in the same chair</div>;
                }
              } else if (scenarioNumber === 2) { // Corresponds to 'Immediate Right'
                if (anniePos === vinniePos + 1) {
                  return <div className="text-green-600 dark:text-green-400 font-medium">✅ Perfect! Annie is immediately to the right of Vinnie</div>;
                } else if (anniePos > vinniePos + 1) {
                  return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie is too far right. She needs to be IMMEDIATELY right of Vinnie</div>;
                } else if (anniePos <= vinniePos) {
                  return <div className="text-red-600 dark:text-red-400 font-medium">❌ Annie should be to the immediate RIGHT of Vinnie</div>;
                }
              }
            })()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-100">
          Understanding "Right" vs "Immediate Right"
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
              currentPhase === 'scenario1' ? 'bg-orange-500 dark:bg-orange-400' : // Color for Right
              currentPhase === 'scenario2' ? 'bg-red-500 dark:bg-red-400' :    // Color for Immediate Right
              'bg-gray-500 dark:bg-gray-400'
            }`}></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {currentPhase === 'introduction' ? 'Character Introduction' :
               currentPhase === 'scenario1' ? 'Scenario 1: Right' :
               currentPhase === 'scenario2' ? 'Scenario 2: Immediate Right' :
               'Demo Complete'}
            </span>
          </div>
        </div>

        {/* Content Sections */}
        {currentPhase === 'introduction' && <IntroductionSection />}

        <ScenarioLayout
          anniePosition={scenario1AnniePosition}
          vinniePosition={scenario1VinniePosition}
          title="Scenario 1: Annie is to the RIGHT of Vinnie"
          scenarioNumber={1}
        />
        <ScenarioLayout
          anniePosition={scenario2AnniePosition}
          vinniePosition={scenario2VinniePosition}
          title="Scenario 2: Annie is to the IMMEDIATE RIGHT of Vinnie"
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
        {/* Removed the Synchronized Demo Features section */}
      </div>
    </div>
  );
};

export default LeftVsImmediateLeftModule;